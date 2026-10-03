/**
 * `deno run --unstable-webgpu --allow-all galaxy.gpu.ts <repo>` - the galaxies, run (`Simulation` in Simulation.ray):
 * every SPARC galaxy laid from its own gas, disc and bulge and run on the device, and every galaxy there could be.
 * The plan, the numbers the device is handed and everything written are the Ray side's; this only moves buffers and
 * checks the device against the CPU on a few of each kernel's threads, so the two can only differ in floating point.
 *
 *   RAY_DEG=10         the lattice (default: the theory's own)
 *   RAY_GALAXIES=a,b   the galaxies filmed (default: four across the sample's speeds)
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [repo] = Deno.args;
const OUT = join(repo, "visuals");

const all: Record<string, { header: any; bytes: Uint8Array }> = {};
for (const root of [OUT, join(repo, "data")]) {
  if (!existsSync(root)) continue;
  for (const d of readdirSync(root).sort()) {
    const f = join(root, d, "field.f32"), h = join(root, d, "meta.json");
    if (!existsSync(f) || !existsSync(h)) continue;
    const bytes = readFileSync(f);
    all[d] = { header: JSON.parse(readFileSync(h, "utf8")), bytes: new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength) };
  }
}
(globalThis as any).__measured = all;
(globalThis as any).__measured_save = (where: string, id: string, what: string, names: string[], columns: any, extra: any) => {
  const rows = columns[names[0]].length;
  const flat = new Float32Array(names.length * rows);
  names.forEach((n, i) => flat.set(columns[n], i * rows));
  const header = { what, columns: names, rows, measured: new Date().toISOString(), ...(extra ?? {}) };
  const dir = join(repo, where, id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "field.f32"), new Uint8Array(flat.buffer));
  writeFileSync(join(dir, "meta.json"), JSON.stringify(header, null, 2) + "\n");
  /* and what is read back in this run sees what was just written */
  all[id] = { header: JSON.parse(JSON.stringify(header)), bytes: new Uint8Array(flat.buffer) };
  console.log(`  ${id.padEnd(18)} ${String(rows).padStart(8)} rows × ${names.length} columns (${names.join(", ")})  →  ${where}/${id}/field.f32`);
};

await import(join(OUT, "visuals.ts"));
const physics: any = await import(join(repo, "languages", "physics.ts", "index.ts"));
const S = physics.Simulation;
const t0 = Date.now();
const secs = () => `${((Date.now() - t0) / 1000).toFixed(1)}s`;

const space = physics.Measured.of("galaxy.many.solved");
if (!space) throw new Error("galaxy.many.solved is not on disk - solve the space (record.gpu RAY_SOLVE) first: it carries each lattice's a_0/cH");
const deg = Number(Deno.env.get("RAY_DEG") ?? space.header.theory_deg ?? 18);

/*
 * RAY_ONLY=apart-check: the medium with every body apart (Medium.apart, the meeting gathered by the way rays come
 * from) against the medium as it was (a plane per tag, body met by body), on the CPU, on bodies few enough that no two
 * share a bin - where the two must agree to rounding - and on a crowd where they may not, to say by how much
 */
if (Deno.env.get("RAY_ONLY") === "apart-check") {
  const setOf = (m: any) => { m.vacuum = true; m.facing = true; m.own = 2; m.crowd = false; m.a0_from = 2; return m; };
  const compare = (label: string, spots: number[][], ticks: number) => {
    const N = 45, A = 96, K = 3, DEG = Math.round(deg);
    const tagged = setOf(physics.G.medium(N, A, K, DEG, spots.length + 1));
    const apart = setOf(physics.G.medium(N, A, K, DEG, 1));
    apart.apart = true;
    spots.forEach(([x, y, mx], k) => {
      for (const [m, tag] of [[tagged, k + 1], [apart, 0]] as [any, number][]) {
        const h = new physics.Hole({ x: (N - 1) / 2 + x * K, y: (N - 1) / 2 + y * K, mx, ways: 1 });
        h.tag = tag; h.moves = false; h.px = 0; h.py = 0;
        m.add(h);
      }
    });
    for (const m of [tagged, apart]) { m.seed; for (let t = 0; t < ticks; t++) m.tick; }
    const worst = (a: number[], b: number[]) => { let top = 0, d = 0; for (let i = 0; i < a.length; i++) { top = Math.max(top, Math.abs(a[i])); d = Math.max(d, Math.abs(a[i] - b[i])); } return top > 0 ? d / top : d; };
    const pulls = (m: any) => m.holes.flatMap((h: any) => m.lean_under(h));
    console.log(`  ${label.padEnd(34)} record ${worst(tagged.fold, apart.fold).toExponential(2)}, density ${worst(tagged.rho_was, apart.rho_was).toExponential(2)}, pulls ${worst(pulls(tagged), pulls(apart)).toExponential(2)} (worst over the largest)`);
  };
  console.log(`\n  every body apart against a plane a body, on the CPU (DEG ${Math.round(deg)}; vacuum, facing, recursion at the place, a0 along the path):`);
  compare("two bodies, 6 c-bar apart", [[-3, 0, 0.3], [3, 0, 0.3]], 12);
  compare("three, unequal, off a line", [[-4, -1, 0.5], [3, 2, 0.2], [1, -4, 0.1]], 12);
  compare("five, two sharing a way", [[-5, 0, 0.3], [5, 0, 0.3], [0, 5, 0.2], [2.5, 0, 0.1], [0, -4, 0.2]], 12);
  /* and the device: every body apart on the device against the same on the CPU, and against the device as it was (a plane a tag) - small, paced */
  const webgpu: any = await import(join(repo, "languages", "physics.ts", "src", "webgpu.ts"));
  const how = { vacuum: true, facing: true, own: 2, crowd: false, a0_from: 2 };
  const onDevice = async (label: string, spots: number[][], ticks: number) => {
    const N = 45, A = 96, K = 3, DEG = Math.round(deg), D = physics.G.lattice.D;
    const lay = (m: any, tagged: boolean) => spots.forEach(([x, y, mx], k) => {
      const h = new physics.Hole({ x: (N - 1) / 2 + x * K, y: (N - 1) / 2 + y * K, mx, ways: 1 });
      h.tag = tagged ? k + 1 : 0; h.moves = false; h.px = 0; h.py = 0;
      m.add(h);
    });
    const cpu = setOf(physics.G.medium(N, A, K, DEG, 1)); cpu.apart = true; lay(cpu, false);
    const dev = await webgpu.medium(N, A, K, 1, physics.G, DEG, D, { ...how, apart: spots.length, paced: true }); lay(dev, false);
    const old = await webgpu.medium(N, A, K, spots.length + 1, physics.G, DEG, D, { ...how, paced: true }); lay(old, true);
    cpu.seed; for (let t = 0; t < ticks; t++) cpu.tick;
    for (const w of [dev, old]) { w.seed(); for (let t = 0; t < ticks; t++) await w.tick(); }
    const worst = (a: ArrayLike<number>, b: ArrayLike<number>) => { let top = 0, d = 0; for (let i = 0; i < a.length; i++) { top = Math.max(top, Math.abs(a[i])); d = Math.max(d, Math.abs(a[i] - b[i])); } return top > 0 ? d / top : d; };
    const devRec = await dev.record(), oldRec = await old.record(), devRho = await dev.rho();
    const devPull = (await dev.leans()).flat(), oldPull = (await old.leans()).flat(), cpuPull = cpu.pulled.flat();
    const top = (a: ArrayLike<number>) => { let m = 0, s = 0; for (let i = 0; i < a.length; i++) { m = Math.max(m, Math.abs(a[i])); s += a[i]; } return `max ${m.toExponential(3)} sum ${s.toExponential(3)}`; };
    console.log(`    records: CPU ${top(cpu.fold)}; device apart ${top(devRec)}; device as it was ${top(oldRec)}; the device as it was vs the CPU ${worst(cpu.fold, oldRec).toExponential(2)}`);
    console.log(`  ${label.padEnd(34)} device apart vs CPU apart: record ${worst(cpu.fold, devRec).toExponential(2)}, density ${worst(cpu.rho_was, devRho).toExponential(2)}, pulls ${worst(cpuPull, devPull).toExponential(2)}; vs the device as it was: record ${worst(oldRec, devRec).toExponential(2)}, pulls ${worst(oldPull, devPull).toExponential(2)}; longest submission ${dev.longest.toFixed(1)} ms`);
  };
  console.log(`\n  on the device (paced):`);
  await onDevice("two bodies, 6 c-bar apart", [[-3, 0, 0.3], [3, 0, 0.3]], 12);
  await onDevice("five, two sharing a way", [[-5, 0, 0.3], [5, 0, 0.3], [0, 5, 0.2], [2.5, 0, 0.1], [0, -4, 0.2]], 12);
  /* and bodies that go: every body apart is moved a thread a body (MMOVEH, MSTEPH) where the device as it was moves them one after another */
  {
    const N = 45, A = 96, K = 3, DEG = Math.round(deg), D = physics.G.lattice.D;
    const spots = [[-4, 0, 0.3, 0, 0.02], [4, 0, 0.3, 0, -0.02], [0, 4, 0.2, 0.015, 0]];
    const lay = (m: any, tagged: boolean) => spots.forEach(([x, y, mx, px, py], k) => {
      const h = new physics.Hole({ x: (N - 1) / 2 + x * K, y: (N - 1) / 2 + y * K, mx, ways: 1 });
      h.tag = tagged ? k + 1 : 0; h.moves = true; h.px = px * mx; h.py = py * mx;
      m.add(h);
    });
    const cpu = setOf(physics.G.medium(N, A, K, DEG, 1)); cpu.apart = true; lay(cpu, false);
    const dev = await webgpu.medium(N, A, K, 1, physics.G, DEG, D, { ...how, apart: spots.length, paced: true }); lay(dev, false);
    const old = await webgpu.medium(N, A, K, spots.length + 1, physics.G, DEG, D, { ...how, paced: true }); lay(old, true);
    cpu.seed; for (let t = 0; t < 24; t++) cpu.tick;
    for (const w of [dev, old]) { w.seed(); for (let t = 0; t < 24; t++) await w.tick(); await w.sync(); }
    const where = (w: any) => w.holes.flatMap((h: any) => [h.x, h.y]);
    const gap = (a: number[], b: number[]) => Math.max(...a.map((v, i) => Math.abs(v - b[i])));
    console.log(`  three thrown, 24 ticks             bodies' places (cells): device apart vs the device as it was ${gap(where(dev), where(old)).toExponential(2)}, vs the CPU ${gap(where(dev), where(cpu)).toExponential(2)}; the device as it was vs the CPU ${gap(where(old), where(cpu)).toExponential(2)}`);
  }
  Deno.exit(0);
}

/*
 * RAY_ONLY=space: HOW FAST SPACE GROWS, the rules against the chain. The chain's H is what the space line nets at the
 * settled vacuum over D (Inferences.hubble_rate); the rules' own interpreter (Field.ray) keeps the space ledger per
 * cell, so an empty box run tick by tick says what the rules themselves do to space per point per tick - on the CPU
 */
if (Deno.env.get("RAY_ONLY") === "space") {
  const model = new physics.Model({ theory: physics.G });
  const DEG = Math.round(deg);
  const e = model.settled(DEG);
  const nets = model.fact("the space line nets");
  const H = model.fact("H");
  console.log(`\n  the chain at DEG ${DEG}: the space line nets ${nets ? physics.Expr.show(nets.to) : "-"}`);
  console.log(`    = ${nets ? model.at(nets.to, e) : NaN} a point a tick at the settled vacuum; H = ${H ? model.at(H.to, e) : NaN} a tick`);
  for (const [N, A, K] of [[16, 16, 1], [24, 32, 1]]) {
    const f = physics.G.field(N, A, K, 1, DEG, 1);
    const cells = N * N;
    const mean = (xs: ArrayLike<number>) => { let s = 0; for (let i = 0; i < xs.length; i++) s += xs[i]; return s / xs.length; };
    let before = mean(f.space);
    const rows: string[] = [];
    for (let t = 1; t <= 24; t++) {
      f.tick;
      const now = mean(f.space);
      rows.push(`t${t}: rho ${mean(f.rho).toFixed(3)} folds ${mean(f.folds).toFixed(3)} space +${(now - before).toExponential(3)}`);
      before = now;
    }
    console.log(`  the rules on an empty ${N}x${N} box, ${A} headings (${cells} points): per point per tick\n    ${rows.join("\n    ")}`);
  }
  Deno.exit(0);
}

/*
 * RAY_ONLY=rules: WHAT THE RULES ACTUALLY DO - G's own rules on a discrete world (Theory.tick, the reference
 * semantics), nothing read or averaged: every tick, how many points stand, how many are held inside others, how
 * many folds the ways carry, what the tick created, annihilated and folded, and the share of ways lit. On the
 * theory's own lattice, a closed box and a box with room to grow into; CPU only
 */
if (Deno.env.get("RAY_ONLY") === "rules") {
  const run = (label: string, geometry: any, N: number, margin: number, ticks: number) => {
    const w = physics.G.seed(geometry, N, 1, 250000, margin);
    const DEG = geometry.DEG;
    const inner = (v: any) => v.at.components.every((c: number) => c >= 1 && c < N - 1);
    const rows: string[] = [];
    let was = { created: 0, annihilations: 0, folded: 0 };
    let t0 = performance.now();
    for (let t = 0; t <= ticks; t++) {
      if (t > 0) w.tick;
      const live = w.vertices.filter((v: any) => v.alive);
      const mid = live.filter(inner);
      const held = live.reduce((s: number, v: any) => s + v.held.length, 0);
      const folds = live.reduce((s: number, v: any) => s + v.folds.reduce((a: number, b: number) => a + b, 0), 0);
      const lit = live.reduce((s: number, v: any) => s + v.rays.filter((r: any) => r.active).length, 0);
      const midHeld = mid.reduce((s: number, v: any) => s + v.held.length, 0);
      const line = (`t${String(t).padEnd(3)} standing ${String(live.length).padStart(6)} (inner ${String(mid.length).padStart(5)}, holding ${String(midHeld).padStart(5)})  ever made ${String(w.vertices.length).padStart(6)}  held ${String(held).padStart(6)}  folds ${String(folds).padStart(6)}  lit ${(lit / Math.max(1, live.length * DEG)).toFixed(3)}  +created ${w.created - was.created}  +annihilated ${w.annihilations - was.annihilations}  +folded ${w.folded - was.folded}  (${((performance.now() - t0) / 1000).toFixed(1)}s)`); console.log(`    ${label.slice(0, 18)} ${line}`); t0 = performance.now();
      was = { created: w.created, annihilations: w.annihilations, folded: w.folded };
    }
    void rows;
  };
  run(`closed 4^3`, physics.CUBIC18, 4, 0, 10);
  run(`4^3 + margin 2`, physics.CUBIC18, 4, 2, 8);
  Deno.exit(0);
}

/* RAY_ONLY=crossed: with a_0 the same everywhere, reading it at the density crossed (a0_from 2) must change nothing - on the CPU and on the device */
if (Deno.env.get("RAY_ONLY") === "crossed") {
  const webgpu: any = await import(join(repo, "languages", "physics.ts", "src", "webgpu.ts"));
  const at = [18, 21, 24, 27];
  for (const from of [0, 2]) {
    const how = { vacuum: true, facing: true, own: 2, crowd: false, a0_from: from };
    const mdeg = Number(Deno.env.get("RAY_MDEG") ?? physics.G.lattice.DEG);
    const dev = await webgpu.medium(31, 8, 3, 2, physics.G, mdeg, undefined, how);
    const cpu = physics.G.medium(31, 8, 3, mdeg, 2); Object.assign(cpu, how);
    for (const w of [dev, cpu]) w.add(new physics.Hole({ x: 15, y: 15, mx: 5, ways: 1, tag: 1 }));
    for (let t = 0; t < 6; t++) { await dev.tick(); cpu.tick; }
    const got = await dev.probe_now(at.map(x => [x, 15, 0])), want = at.map(x => cpu.pull_at(x, 15, 0, 0, 0));
    console.log(`  a0_from ${from}: device ${got.map((g: number[]) => g[0].toExponential(4)).join(" ")} | CPU ${want.map((g: number[]) => g[0].toExponential(4)).join(" ")} | CPU a_0 at 18 ${cpu.a0_at_place(18, 15).toExponential(4)} vs the vacuum's ${cpu.a0_vacuum.toExponential(4)}`);
  }
  Deno.exit(0);
}

/*
 * RAY_ONLY=medium-bench: WHERE THE MEDIUM'S TICK GOES as bodies and cells grow - every body apart, as a galaxy's stars
 * would be, moving, on the device and paced. It grows a size only while the slowest kernel of the last one leaves room
 * under the guard for four times the work, so it never asks the card for more than it has shown it can take
 */
if (Deno.env.get("RAY_ONLY") === "medium-bench") {
  const webgpu: any = await import(join(repo, "languages", "physics.ts", "src", "webgpu.ts"));
  /* the medium as it runs by default - as solar.inner records it: nothing added to what arrives */
  const how: any = Deno.env.get("RAY_LOCAL") === "1" ? { local: true, slots: Number(Deno.env.get("RAY_SLOTS") ?? 3) } : {};
  const A = 96, K = 3, DEG = Math.round(deg), D = physics.G.lattice.D, TICKS = Number(Deno.env.get("RAY_TICKS") ?? 32);
  const sides = (Deno.env.get("RAY_SIDES") ?? "91,181").split(",").map(Number);
  const counts = (Deno.env.get("RAY_BODIES") ?? "16,64,256,1024,4096").split(",").map(Number);
  console.log(`\n  the medium's tick, every body apart, DEG ${DEG}, K ${K}, ${TICKS} ticks a size (ms of device time a tick, paced):`);
  for (const N of sides) {
    let room = true;
    for (const n of counts) {
      if (!room) { console.log(`    ${N}x${N}, ${n} bodies: not run - the last size left no room under the guard`); continue; }
      const w = await webgpu.medium(N, A, K, 1, physics.G, DEG, D, { ...how, apart: n, paced: true });
      /* a disc of bodies over the middle half of the box, each light and moving round the middle */
      for (let k = 0; k < n; k++) {
        const r = (N / 4) * Math.sqrt((k + 0.5) / n), t = k * 2.399963229728653;
        const h = new physics.Hole({ x: (N - 1) / 2 + r * Math.cos(t), y: (N - 1) / 2 + r * Math.sin(t), mx: 1e-3, ways: 1 });
        h.tag = 0; h.moves = true; h.px = -1e-6 * Math.sin(t); h.py = 1e-6 * Math.cos(t);
        w.add(h);
      }
      w.seed();
      if (n === counts[0]) console.log(`    the device's clock: ${w.ns_per_count.toFixed(2)} ns a count, measured against the host's; the host's round trip ${w.round_trip.toFixed(1)} ms`);
      await w.tick();
      await w.flush();
      for (const k of Object.keys(w.spent)) w.spent[k] = 0;
      for (const k of Object.keys(w.clock)) w.clock[k] = 0;
      const t0 = performance.now();
      for (let t = 0; t < TICKS; t++) await w.tick();
      await w.flush();
      const wall = (performance.now() - t0) / TICKS;
      const parts = Object.entries(w.spent as Record<string, number>).sort((a, b) => b[1] - a[1]);
      const busy = parts.reduce((s, [, ms]) => s + ms, 0) / TICKS;
      console.log(`    ${N}x${N} (${N * N} cells), ${String(n).padStart(5)} bodies: busy ${busy.toFixed(2)} ms, wall ${wall.toFixed(1)} ms a tick; ${parts.slice(0, 6).map(([k, ms]) => `${k} ${(ms / TICKS).toFixed(2)}`).join(", ")}; longest ${w.longest.toFixed(1)} ms (${w.longest_was}); a tick on the host: gathering ${(w.clock.gathered / TICKS).toFixed(2)}, waiting ${(w.clock.waited / TICKS).toFixed(2)}, resting ${(w.clock.rested / TICKS).toFixed(2)} ms, ${w.clock.batches} submissions`);
      /* the slowest single kernel, by the device's clock: four times it must still sit under the guard */
      /* passes are cut into pieces by what they take, so what bounds the next size is the longest submission: twice it must sit under the guard */
      room = w.longest * 2 < 200;
    }
  }
  Deno.exit(0);
}

/*
 * RAY_ONLY=held-disc: A DISC OF STARS IN THE MEDIUM ITSELF, held where the rays are - its own radial acceleration
 * relation. RAY_STARS stars (exponential surface density, scale RAY_RD c-bar, total mass RAY_MASS) laid at rest in the
 * middle of a RAY_SIDE box, the field let stand (a crossing of ticks), and the medium's own pull on every star read.
 * Against it: what the same stars pull by plain superposition - one lone body's pull by distance, measured in the same
 * medium, summed over the others. Their ratio against that summed pull over a_0 is the medium's own relation: one if the
 * medium only adds what each body sends, above it where it makes more of a weak field
 */
if (Deno.env.get("RAY_ONLY") === "held-disc") {
  const webgpu: any = await import(join(repo, "languages", "physics.ts", "src", "webgpu.ts"));
  const A = 96, K = 3, DEG = Math.round(deg), D = physics.G.lattice.D;
  const SIDE = Number(Deno.env.get("RAY_SIDE") ?? 181), STARS = Number(Deno.env.get("RAY_STARS") ?? 2048);
  const RD = Number(Deno.env.get("RAY_RD") ?? 6), MASS = Number(Deno.env.get("RAY_MASS") ?? 20);
  /* the medium as it is: nothing added to what arrives */
  const how = { local: true, slots: Number(Deno.env.get("RAY_SLOTS") ?? 4), paced: true, vacuum: Deno.env.get("RAY_VACUUM") === "1" };
  const mid = (SIDE - 1) / 2, crossing = Math.ceil(SIDE / K) + 2;
  /* one lone body's pull by distance, in the same medium: the superposition every other reading is set against */
  const lone = await webgpu.medium(SIDE, A, K, 1, physics.G, DEG, D, { ...how, apart: 1 });
  const one = new physics.Hole({ x: mid, y: mid, mx: MASS / STARS, ways: 1 }); one.tag = 0; one.moves = false; one.px = 0; one.py = 0;
  lone.add(one);
  lone.seed();
  for (let t = 0; t < crossing; t++) await lone.tick();
  const RS: number[] = []; for (let r = 0.34; r < mid / K - 1; r *= 1.08) RS.push(r);
  const lonePull = (await lone.probe(RS.map(r => [mid + r * K, mid, 0]))).map((g: number[]) => -g[0]);
  const p1 = (d: number) => { if (d <= RS[0]) return lonePull[0]; let k = RS.findIndex(r => r >= d); if (k < 0) return lonePull[lonePull.length - 1] * Math.pow(RS[RS.length - 1] / d, D - 1); const f = (d - RS[k - 1]) / (RS[k] - RS[k - 1]); return lonePull[k - 1] * (1 - f) + lonePull[k] * f; };
  /* the disc: radius drawn off R e^(-R/RD) (two uniform draws), angle uniform - seeded, so a run is the run again */
  /* mulberry32, in whole 32-bit steps: the float LCG it replaces lost bits past 2^53 and gave 10917 distinct draws in two million - a million stars stood on some five thousand places */
  let seed = 12345 >>> 0; const rnd = () => { seed = (seed + 0x6D2B79F5) >>> 0; let z = seed; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return (((z ^ (z >>> 14)) >>> 0) + 0.5) / 4294967296; };
  const w = await webgpu.medium(SIDE, A, K, 1, physics.G, DEG, D, { ...how, apart: STARS });
  const at: number[][] = [];
  for (let s = 0; s < STARS; s++) {
    let r = -RD * Math.log(rnd() * rnd());
    r = Math.min(r, mid / K - 2);
    const th = 2 * Math.PI * rnd();
    const h = new physics.Hole({ x: mid + r * K * Math.cos(th), y: mid + r * K * Math.sin(th), mx: MASS / STARS, ways: 1 });
    h.tag = 0; h.moves = false; h.px = 0; h.py = 0;
    w.add(h); at.push([h.x, h.y]);
  }
  w.seed();
  for (let t = 0; t < crossing; t++) await w.tick();
  const pulls = await w.leans();
  const a0 = w.how.a0_vacuum;
  /* the radial pull on each star, the medium's and superposition's, binned by radius */
  const BINS = 12, edge = (mid / K - 2);
  const dirs = [[0, 0, 0], [0, 0, 0]];
  const acc = Array.from({ length: BINS }, () => [0, 0, 0, 0]);
  for (let s = 0; s < STARS; s++) {
    const dx = (at[s][0] - mid) / K, dy = (at[s][1] - mid) / K, R = Math.hypot(dx, dy);
    if (R < 0.5) continue;
    const ux = -dx / R, uy = -dy / R;
    const g = pulls[s][0] * ux + pulls[s][1] * uy;
    let gn = 0;
    for (let o = 0; o < STARS; o++) {
      if (o === s) continue;
      const ex = (at[o][0] - at[s][0]) / K, ey = (at[o][1] - at[s][1]) / K, d = Math.hypot(ex, ey);
      if (d <= 0) continue;
      gn += p1(d) * (ex * ux + ey * uy) / d;
    }
    const b = Math.min(BINS - 1, Math.floor(R / edge * BINS));
    acc[b][0] += R; acc[b][1] += g; acc[b][2] += gn; acc[b][3] += 1;
    /* and by direction: along the box's axes against along its diagonals, where a way of the lattice's own lies */
    const diag = Math.abs(Math.abs(dx) - Math.abs(dy)) < 0.25 * R, axis = Math.min(Math.abs(dx), Math.abs(dy)) < 0.15 * R;
    if (diag) { dirs[0][0] += g; dirs[0][1] += gn; dirs[0][2] += 1; }
    if (axis) { dirs[1][0] += g; dirs[1][1] += gn; dirs[1][2] += 1; }
  }
  console.log(`\n  a disc in the medium, held where the rays are: ${STARS} stars, scale ${RD} c-bar, mass ${MASS}, box ${SIDE} (K ${K}, DEG ${DEG}); a_0 ${a0.toExponential(3)} c-bar a tick a tick`);
  console.log(`  R (c-bar)   stars   g medium     g summed     g/g_summed   g_summed/a_0`);
  for (const [R, g, gn, n] of acc) if (n > 0) console.log(`  ${(R / n).toFixed(2).padStart(8)}  ${String(n).padStart(6)}   ${(g / n).toExponential(3)}   ${(gn / n).toExponential(3)}   ${(g / gn).toFixed(4).padStart(9)}    ${(gn / n / a0).toExponential(2)}`);
  console.log(`  by direction: along the diagonals g/g_summed ${(dirs[0][0] / dirs[0][1]).toFixed(4)} (${dirs[0][2]} stars), along the axes ${(dirs[1][0] / dirs[1][1]).toFixed(4)} (${dirs[1][2]} stars)`);
  console.log(`  longest submission ${w.longest.toFixed(1)} ms (${w.longest_was.slice(0, 120)})`);
  Deno.exit(0);
}

/*
 * RAY_ONLY=medium-orbit: THE MILKY WAY AND ANDROMEDA AS WHOLE BODIES, from where they are today (Video.ANDROMEDA:
 * 785 kpc, 110 km/s in, 17 km/s across) until they are RAY_UNTIL kpc apart (100), in the medium at RAY_PER_KPC
 * c-bar a kpc (0.05) and at their own speed - a km/s its share of light, the lattice's c-bar a tick. Hundreds of kpc
 * apart each pulls the other as one body, so where they go is the medium's however coarse; their discs are laid
 * fresh where this hands over (medium-galaxy RAY_GALAXY=collision RAY_ORBIT=collision.orbit). The mass of 1e10 suns
 * is the Milky Way film's (visuals/milkyway, mass_unit) carried to this scale as the pull of one body falls: the
 * film's and this box's lone pull are both measured and printed, and the mass set so a body pulls the same at the
 * same distance in kpc. Written: visuals/collision.orbit (track: Myr, then x y of each in kpc about the box's middle)
 */
if (Deno.env.get("RAY_ONLY") === "medium-orbit") {
  const webgpu: any = await import(join(repo, "languages", "physics.ts", "src", "webgpu.ts"));
  const A = 96, K = 3, DEG = Math.round(deg), D = physics.G.lattice.D, V = physics.Video;
  const P = Number(Deno.env.get("RAY_PER_KPC") ?? 0.05), UNTIL = Number(Deno.env.get("RAY_UNTIL") ?? 100);
  const CAP = Number(Deno.env.get("RAY_TICKS") ?? 400000), EVERY = Number(Deno.env.get("RAY_EVERY") ?? 500);
  const how = { local: true, slots: Number(Deno.env.get("RAY_SLOTS") ?? 4), paced: true, plan: { budget: { duty: Number(Deno.env.get("RAY_DUTY") ?? 0.5) } } };
  const MW = V.MILKY_WAY, M31 = V.ANDROMEDA;
  const meta = join(repo, "visuals", Deno.env.get("RAY_UNIT_FROM") ?? "milkyway", "meta.json");
  if (!existsSync(meta)) throw new Error("no mass scale: run the Milky Way film first (visuals/milkyway, mass_unit)");
  const film = JSON.parse(readFileSync(meta, "utf8"));
  if (!(film.mass_unit > 0)) throw new Error("visuals/milkyway keeps no mass_unit - rerun it at its own speed");
  /* one lone unit body's pull by distance (c-bar), in a box of this medium: the law a mass is carried by */
  const lonePull = async (rs: number[]) => {
    const CAL = 121, c = (CAL - 1) / 2;
    const lone = await webgpu.medium(CAL, A, K, 1, physics.G, DEG, D, { ...how, apart: 1 });
    const u = new physics.Hole({ x: c, y: c, mx: 1, ways: 1 }); u.tag = 0; u.moves = false; u.px = 0; u.py = 0;
    lone.add(u);
    await lone.stand();
    return (await lone.probe(rs.map(r => [c + r * K, c, 0]))).map((g: number[]) => -g[0]);
  };
  const RS = [2, 4, 8, 12, 16];
  const law = await lonePull(RS);
  console.log(`\n  a lone unit body pulls, by c-bar: ${RS.map((r, k) => `${r}: ${law[k].toExponential(4)}`).join(", ")}; slope ${RS.slice(1).map((r, k) => (Math.log(law[k + 1] / law[k]) / Math.log(r / RS[k])).toFixed(3)).join(" ")} (Newton in ${D} dimensions: ${-(D - 1)})`);
  /*
   * the same body pulls the same at the same kpc: a pull of M f(R c-bar) is M f(R) p c^2/kpc in metres, so with
   * f ~ R^-s the mass in this box's units is the film's times (p / p_film)^(s - 1), s read off the law at 8 c-bar
   */
  const s = -Math.log(law[3] / law[2]) / Math.log(RS[3] / RS[2]);
  const unit = film.mass_unit * (P / film.per_kpc) ** (s - 1);
  const mMW = unit * MW.mass, mM31 = unit * M31.mass, MT = mMW + mM31;
  const span = M31.distance * P, VIEW = Math.ceil(span * 1.3 * K / 2) * 2 + 1, MARGIN = 4, SIDE = VIEW + 2 * MARGIN * K, mid = (SIDE - 1) / 2;
  console.log(`  1e10 suns weigh ${unit.toExponential(4)} here (the film's ${film.mass_unit.toExponential(4)} at ${film.per_kpc.toFixed(3)} c-bar a kpc, slope ${s.toFixed(3)}); ${P} c-bar a kpc, a tick is ${(3.2616e-3 / P).toFixed(4)} Myr; box ${SIDE} (${(SIDE / K / P).toFixed(0)} kpc)`);
  const w = await webgpu.medium(SIDE, A, K, 1, physics.G, DEG, D, { ...how, apart: 2 });
  /* about their common middle: the Milky Way at -x, Andromeda at +x, each its share of the gap and of the motion */
  const fM = mM31 / MT, fW = mMW / MT, dx = M31.distance * P * K;
  const vin = M31.approach / V.LIGHT, vac = M31.across / V.LIGHT;
  const bodies = [[mMW, -fM * dx, fM * vin, -fM * vac], [mM31, fW * dx, -fW * vin, fW * vac]].map(([m, x, vx, vy]) => {
    const h = new physics.Hole({ x: mid + x, y: mid, mx: m, ways: 1 }); h.tag = 0; h.moves = false; h.px = m * vx; h.py = m * vy;
    w.add(h);
    return h;
  });
  await w.stand();
  bodies.forEach((h: any) => { h.momentum = new physics.Vector({ components: [h.px, h.py] }); h.moves = true; });
  w.push();
  const myr = 3.2616e-3 / P, track: number[] = [], t0 = performance.now();
  const at = () => bodies.map((h: any) => [(h.x - mid) / K / P, (h.y - mid) / K / P]);
  const vel = () => bodies.map((h: any) => { const p = h.momentum?.components ?? [h.px, h.py]; return [p[0] / h.mass * V.LIGHT, p[1] / h.mass * V.LIGHT]; });
  let ticks = 0, sep = M31.distance;
  for (;;) {
    await w.sync();
    const [a, b] = at();
    sep = Math.hypot(b[0] - a[0], b[1] - a[1]);
    track.push(ticks * myr, a[0], a[1], b[0], b[1]);
    const [va, vb] = vel(), rel = Math.hypot(vb[0] - va[0], vb[1] - va[1]);
    if (ticks % (EVERY * 20) === 0) console.log(`  tick ${ticks} (${(ticks * myr).toFixed(0)} Myr), ${((performance.now() - t0) / 1000).toFixed(0)}s: ${sep.toFixed(1)} kpc apart, closing at ${rel.toFixed(1)} km/s; longest submission ${w.longest.toFixed(1)} ms`);
    if (sep <= UNTIL || ticks >= CAP) break;
    for (let t = 0; t < EVERY; t++) await w.tick();
    ticks += EVERY;
  }
  const [a, b] = at(), [va, vb] = vel();
  const handover = { myr: ticks * myr, sep: [b[0] - a[0], b[1] - a[1]], vel: [vb[0] - va[0], vb[1] - va[1]], mw: [...a, ...va], m31: [...b, ...vb] };
  console.log(`  ${sep <= UNTIL ? "handed over" : "STOPPED AT THE CAP"} after ${handover.myr.toFixed(0)} Myr: Andromeda at (${handover.sep.map(v => v.toFixed(2)).join(", ")}) kpc from the Milky Way, moving (${handover.vel.map(v => v.toFixed(2)).join(", ")}) km/s`);
  physics.Measure.save("collision.orbit", ["track"], { track }, {
    pages: "video.", per_kpc: P, unit, slope: s, law: [RS, law], myr_per_tick: myr, until: UNTIL, handover, masses: [MW.mass, M31.mass],
    about: "the Milky Way and Andromeda as whole bodies in the medium from today's 785 kpc at their own speed: per row Myr, then x y (kpc about the box's middle) of the Milky Way and of Andromeda",
  });
  Deno.exit(0);
}

/*
 * RAY_ONLY=medium-galaxy: A GALAXY IN THE MEDIUM ITSELF, FILMED (Galaxies.medium, visual galaxy.medium). RAY_STARS stars
 * (exponential surface density, scale RAY_RD c-bar) laid at rest in a RAY_SIDE view, every star its own body and every
 * step local (how.local); the field let stand with them held (Medium.stand), and each star launched circling at the
 * pull the medium itself gives it there - sqrt(g R), with a spread of RAY_SIGMA of it - then left to the medium for
 * RAY_FRAMES frames of RAY_TPF ticks. The total mass is set, off one lone body's pull measured in the same medium, so
 * the disc circles at about RAY_SPEED c-bar a tick at one scale length: well below the light a tick carries.
 * The box is the view and RAY_MARGIN c-bars round it (Plan's `Resolution.margin`), run and never drawn: at the box's own
 * edge a star is pulled a quarter short and one past it no longer shines, so that edge is kept out of the view, and
 * what has gone past it is counted (Medium.departed) frame by frame
 */
if (Deno.env.get("RAY_ONLY") === "medium-galaxy") {
  const webgpu: any = await import(join(repo, "languages", "physics.ts", "src", "webgpu.ts"));
  const A = 96, K = 3, DEG = Math.round(deg), D = physics.G.lattice.D;
  const VIEW = Number(Deno.env.get("RAY_SIDE") ?? 361), STARS = Number(Deno.env.get("RAY_STARS") ?? 100000);
  const MARGIN = Number(Deno.env.get("RAY_MARGIN") ?? 2), SIDE = VIEW + 2 * MARGIN * 3;
  /* RAY_PER_KPC: the galaxies' c-bar a kpc (default Video.per_kpc, the Milky Way's R_d FILM_RD c-bar); the Milky Way's R_d follows it */
  const PER_KPC = Number(Deno.env.get("RAY_PER_KPC") ?? physics.Video.per_kpc);
  const RD = Number(Deno.env.get("RAY_RD") ?? (Deno.env.get("RAY_GALAXY") ? physics.Video.MILKY_WAY.disc_scale * PER_KPC : 6)), SPEED = Number(Deno.env.get("RAY_SPEED") ?? 0.015), SIGMA = Number(Deno.env.get("RAY_SIGMA") ?? 0.05);
  const FRAMES = Number(Deno.env.get("RAY_FRAMES") ?? 120), TPF = Number(Deno.env.get("RAY_TPF") ?? 40);
  /*
   * RAY_GALAXY=milkyway|andromeda|collision: galaxies laid from their data (Video.ray `Sighted`), in one set of lattice
   * units (the Milky Way's R_d is Video.FILM_RD c-bar), each an exponential disc and a Hernquist bulge seen face on, and
   * written to visuals/<RAY_OUT, default the name>. RAY_GRID cells across the density; RAY_SHOWN stars' own tracks kept
   * beside it (<out>.stars), the first of them the Sun's star. RAY_APART: the collision's separation in c-bar.
   */
  const GAL = Deno.env.get("RAY_GALAXY") ?? "";
  const OUT = Deno.env.get("RAY_OUT") ?? (GAL || "galaxy.medium");
  const GRID = Number(Deno.env.get("RAY_GRID") ?? 128), SHOWN = Number(Deno.env.get("RAY_SHOWN") ?? (GAL ? 20000 : 0));
  /* RAY_DUTY: the share of the time the device may be busy (the rest is the screen's; pieces stay <= 30 ms either way) */
  const how = { local: true, slots: Number(Deno.env.get("RAY_SLOTS") ?? 4), paced: true, plan: { budget: { duty: Number(Deno.env.get("RAY_DUTY") ?? 0.5) } } };
  const mid = (SIDE - 1) / 2, span = (VIEW - 1) / 2 / K - 2;
  const CUT = Math.min(Number(Deno.env.get("RAY_CUT") ?? 4) * RD, span - 1);
  /* the mean circling less what the stir holds up (asymmetric drift): RAY_DRIFT=0 launches every star at the full circling speed */
  const DRIFT = Number(Deno.env.get("RAY_DRIFT") ?? 1);
  const t0 = performance.now();
  /* what one body of unit mass pulls with, a little out, in a small box of the same medium: the scale the mass is set by */
  const CAL = 121, cmid = (CAL - 1) / 2, rcal = 8;
  /* (a dry run touches no device: the pull it would measure is only a scale for the masses, which a layout does not need) */
  let p1 = 2.446e-4;
  if (Deno.env.get("RAY_DRY") !== "1") {
    const lone = await webgpu.medium(CAL, A, K, 1, physics.G, DEG, D, { ...how, apart: 1 });
    const unit = new physics.Hole({ x: cmid, y: cmid, mx: 1, ways: 1 }); unit.tag = 0; unit.moves = false; unit.px = 0; unit.py = 0;
    lone.add(unit);
    await lone.stand();
    p1 = -(await lone.probe([[cmid + rcal * K, cmid, 0]]))[0][0];
  }
  /* an exponential disc holds 0.264 of itself within one scale length; that much pulls about as one body there */
  const pRD = p1 * (rcal / RD) ** (D - 1);
  /* the Milky Way (or the plain disc) weighs what circles near SPEED at its R_d; every other galaxy its data's share of that */
  const MASS0 = SPEED * SPEED / RD / (0.264 * pRD);
  const V = physics.Video, perKpc = GAL ? PER_KPC : 1;
  const sighted: any[] = GAL === "collision" ? [V.MILKY_WAY, V.ANDROMEDA] : GAL === "andromeda" ? [V.ANDROMEDA] : GAL ? [V.MILKY_WAY] : [];
  const MT = sighted.reduce((n, s) => n + s.mass, 0);
  const APART = Number(Deno.env.get("RAY_APART") ?? 110);
  /*
   * RAY_ORBIT=collision.orbit: the pair laid where the medium-orbit run handed them over - Andromeda's place and motion
   * from the Milky Way's (kpc, km/s) - about their common middle, each its share by mass. Otherwise APART c-bar on x,
   * moving as they are seen today
   */
  const ORBIT = Deno.env.get("RAY_ORBIT") ?? "";
  const handover = ORBIT ? JSON.parse(readFileSync(join(repo, "visuals", ORBIT, "meta.json"), "utf8")).handover : null;
  if (ORBIT && !handover) throw new Error(`visuals/${ORBIT} keeps no handover - run RAY_ONLY=medium-orbit first`);
  const gap = handover ? [handover.sep[0] * perKpc, handover.sep[1] * perKpc] : [APART, 0];
  /* each galaxy: where its middle is (cells), its scale length and bulge (c-bar), its stars and its mass */
  const galaxies = sighted.length ? sighted.map((s: any, i: number) => {
    const off = sighted.length === 2 ? (i === 0 ? -1 : 1) * (sighted[1 - i].mass / MT) : 0;
    return { s, cx: mid + off * gap[0] * K, cy: mid + off * gap[1] * K, rd: s.disc_scale * perKpc, bs: s.bulge_scale * perKpc, bulge: s.bulge_mass / s.mass, share: s.mass / MT, mass: MASS0 * s.mass / V.MILKY_WAY.mass };
  }) : [{ s: null, cx: mid, cy: mid, rd: RD, bs: 0, bulge: 0, share: 1, mass: MASS0 }];
  let MASS = galaxies.reduce((n, g) => n + g.mass, 0);
  const m = MASS / STARS;
  console.log(`\n  a galaxy in the medium: ${STARS} stars, R_d ${RD} c-bar, view ${VIEW} in a box ${SIDE} (a margin of ${MARGIN} c-bar; K ${K}, DEG ${DEG}); a unit mass pulls ${p1.toExponential(3)} at ${rcal} c-bar, so the disc weighs ${MASS.toExponential(3)} (${m.toExponential(3)} a star) to circle near ${SPEED} c-bar a tick`);
  if (GAL) console.log(`  from their data (${OUT}): ${galaxies.map(g => `${g.s.name} R_d ${g.rd.toFixed(2)} c-bar, bulge ${(100 * g.bulge).toFixed(0)}% within ${g.bs.toFixed(2)}, ${(100 * g.share).toFixed(0)}% of the stars, middle at ${((g.cx - mid) / K).toFixed(1)} c-bar`).join("; ")}; a kpc is ${perKpc.toFixed(3)} c-bar`);
  /* the disc, seeded so a run is the run again: radius off R e^(-R/RD), angle uniform */
  /* mulberry32, in whole 32-bit steps: the float LCG it replaces lost bits past 2^53 and gave 10917 distinct draws in two million - a million stars stood on some five thousand places */
  let seed = 2026 >>> 0; const rnd = () => { seed = (seed + 0x6D2B79F5) >>> 0; let z = seed; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return (((z ^ (z >>> 14)) >>> 0) + 0.5) / 4294967296; };
  const gauss = () => Math.sqrt(-2 * Math.log(rnd())) * Math.cos(2 * Math.PI * rnd());
  const LAID = Deno.env.get("RAY_LAID") ?? "measured";
  const MEASURED = LAID !== "smooth" && galaxies.some(g => g.s && g.s.name === V.MILKY_WAY.name);
  /* the young stars come on top of RAY_STARS: their share of the Milky Way's count (Video.MW_YOUNG) */
  const MWI = galaxies.findIndex(g => g.s && g.s.name === V.MILKY_WAY.name);
  /*
   * ANDROMEDA AS IT IS SEEN (data/andromeda-images: `npx ray data andromeda-images`): its old stars its measured disc
   * and bulge as before, its young stars and its dust laid off its own ultraviolet and 250-micron light, turned face on
   */
  const M31I = galaxies.findIndex(g => g.s && g.s.name === V.ANDROMEDA.name);
  const M31_IMG = all["andromeda-images"];
  const M31_LIT = LAID !== "smooth" && M31I >= 0 && !!M31_IMG;
  if (LAID !== "smooth" && M31I >= 0 && !M31_IMG) throw new Error("no data/andromeda-images: run `npx ray data andromeda-images` first (or RAY_LAID=smooth)");
  /* the young and the dust each galaxy lays on top of RAY_STARS: their share of its count */
  const youngOf = (gi: number) => (MEASURED && gi === MWI) || (M31_LIT && gi === M31I) ? Math.round(STARS * galaxies[gi].share * V.MW_YOUNG) : 0;
  const dustOf = (gi: number) => (MEASURED && gi === MWI) || (M31_LIT && gi === M31I) ? Math.round(STARS * galaxies[gi].share * V.MW_DUST[2]) : 0;
  const YOUNG_N = galaxies.reduce((n, _, gi) => n + youngOf(gi), 0);
  /* and the dust along the arms' inner edges (Video.MW_DUST), as many again of next to no mass */
  const DUST_N = galaxies.reduce((n, _, gi) => n + dustOf(gi), 0);
  /* RAY_DRY=1: only lay the stars (no device) and write where they stand as one frame - to look at a layout while the device is busy */
  const DRY = Deno.env.get("RAY_DRY") === "1";
  const w: any = DRY ? { holes: [] as any[], add(h: any) { this.holes.push(h); } } : await webgpu.medium(SIDE, A, K, 1, physics.G, DEG, D, { ...how, apart: STARS + YOUNG_N + DUST_N });
  /* which galaxy each star is, whether it is the bulge's (or the bar's), and whether it is one of the young (light, next to no mass) */
  const whose: number[] = [], inBulge: number[] = [], young: number[] = [], thick: number[] = [];
  let laid = 0;
  /*
   * THE MILKY WAY AS IT IS NOW (Video.MW_*, RAY_LAID=smooth for the plain disc): the bar as Sormani et al. 2022 fit it
   * (its density summed over z on a fine grid, stars drawn cell by cell), the discs round it with the bar's hole, the
   * thin disc in the two arms the old stars trace, and the young stars along every arm the masers trace - each its share
   * of the stars by mass, placed in kpc about the middle, beta measured from the Sun's direction (RAY_SUN_ANGLE) the way
   * the disc turns (the launch turns it anticlockwise, so beta adds to the picture's angle)
   */
  const SUN_ANGLE = Number(Deno.env.get("RAY_SUN_ANGLE") ?? 180) * Math.PI / 180, DEGR = Math.PI / 180;
  const sech = (u: number) => 2 / (Math.exp(u) + Math.exp(-u));
  const BAR1: number[] = MEASURED ? V.MW_BAR1 : [];
  const bar1 = (x: number, y: number, z: number) => {
    const [r1, x1, y1, z1, cpa, cpe, mm, al, nn, cc, xc, yc, rc] = BAR1;
    const a = Math.pow(Math.pow(Math.pow(Math.abs(x) / x1, cpe) + Math.pow(Math.abs(y) / y1, cpe), cpa / cpe) + Math.pow(Math.abs(z) / z1, cpa), 1 / cpa);
    const ap = Math.hypot((x + cc * z) / xc, y / yc), am = Math.hypot((x - cc * z) / xc, y / yc);
    return r1 * sech(Math.pow(a, mm)) * (1 + al * (Math.exp(-Math.pow(ap, nn)) + Math.exp(-Math.pow(am, nn)))) * Math.exp(-(x * x + y * y + z * z) / (rc * rc));
  };
  const barI = (P: number[]) => (x: number, y: number, z: number) => {
    const [ri, xi, yi, zi, ni, ci, rout, rin, nout, nin] = P, R = Math.max(1e-6, Math.hypot(x, y));
    const a = Math.pow(Math.pow(Math.abs(x) / xi, ci) + Math.pow(Math.abs(y) / yi, ci), 1 / ci);
    return ri * Math.exp(-Math.pow(a, ni)) * sech(z / zi) ** 2 * Math.exp(-Math.pow(R / rout, nout)) * Math.exp(-Math.pow(rin / R, nin));
  };
  const bars = MEASURED ? [bar1, barI(V.MW_BAR2), barI(V.MW_BAR3)] : [];
  /* the bar from above: each part's density summed over z (both sides, z = 3 kpc (k/48)^2), on a 0.025 kpc grid 12 kpc across */
  const BG = 480, BH = 6, BC = 2 * BH / BG;
  const barGrid = () => {
    const Z = 48, zs = Array.from({ length: Z + 1 }, (_, k) => 3 * (k / Z) ** 2);
    const sigma = bars.map(() => new Float64Array(BG * BG)), mass = bars.map(() => 0);
    for (let iy = 0; iy < BG; iy++) for (let ix = 0; ix < BG; ix++) {
      const x = -BH + (ix + 0.5) * BC, y = -BH + (iy + 0.5) * BC;
      bars.forEach((rho, b) => {
        let sum = 0;
        for (let k = 0; k < Z; k++) sum += (zs[k + 1] - zs[k]) * (rho(x, y, zs[k]) + rho(x, y, zs[k + 1])) / 2;
        sigma[b][iy * BG + ix] = 2 * sum;
        mass[b] += 2 * sum * BC * BC;
      });
    }
    return { sigma, mass };
  };
  const layMilkyWay = (n: number, ny: number, nd: number, cutKpc: number, put: (xk: number, yk: number, kind: number) => void) => {
    const discs: number[][] = V.MW_DISCS, arms: number[][] = V.MW_ARMS, [w0, w1, wR] = V.MW_ARM_WIDTH, A = V.MW_ARM_CONTRAST - 1, HOLE = V.MW_DISC_HOLE;
    const { sigma, mass } = barGrid();
    console.log(`  the bar from above (Sormani et al. 2022): its parts weigh ${mass.map(x => x.toFixed(3)).join(", ")} (the paper: ${V.MW_BAR_MASSES.join(", ")}) x 1e10 suns within 6 kpc`);
    const parts = [...V.MW_BAR_MASSES, ...discs.map(d => d[0])], total = parts.reduce((a: number, b: number) => a + b, 0);
    const BAR_ANGLE = V.MW_BAR_ANGLE;
    /* how much of the arms a point stands in: the sum over the arms of exp(-d^2 / 2 w^2), d across the arm, each arm only over where it is laid */
    /* shift: the arm read that many kpc further out (the dust, inside it, is where R + shift is on the arm); width: its own (0: Reid's) */
    const inArms = (R: number, th: number, old: boolean, shift = 0, width = 0) => {
      /* Hou & Han's azimuth: from their x axis anticlockwise, the Sun at 90, growing against the turn - the picture's beta (with the turn) the other way */
      const theta = 90 - (th - SUN_ANGLE) / DEGR;
      let sum = 0;
      for (const [ri, ti, psiDeg, end, traced] of arms) {
        if (old && !traced) continue;
        const tp = Math.tan(psiDeg * DEGR), cp = Math.cos(psiDeg * DEGR);
        let best = 0;
        for (let k = -2; k <= 4; k++) {
          const t = theta + 360 * k;
          /* before its start the arm fades in (Video.MW_ARM_FADE_IN degrees), past its end out (MW_ARM_FADE) */
          const out = Math.max(Math.max(0, ti - t) / V.MW_ARM_FADE_IN, end > 0 ? Math.max(0, t - end) / V.MW_ARM_FADE : 0);
          if (out > 3) continue;
          const ra = ri * Math.exp((t - ti) * DEGR * tp);
          if (ra > cutKpc + 3) continue;
          const d = Math.abs(R + shift - ra) * cp, wd = width > 0 ? width : w0 + w1 * (ra - wR);
          best = Math.max(best, Math.exp(-d * d / (2 * wd * wd) - out * out / 2));
        }
        sum += best;
      }
      return sum;
    };
    const turned = (x: number, y: number, t: number) => [x * Math.cos(t) - y * Math.sin(t), x * Math.sin(t) + y * Math.cos(t)];
    /* a disc's radius off e^(-R/R_d) e^(-HOLE/R) (R dR), within the cut */
    const discR = (rd: number) => { for (;;) { const R = -rd * Math.log(rnd() * rnd()); if (R <= cutKpc && rnd() < Math.exp(-HOLE / R)) return R; } };
    let placed = 0;
    parts.forEach((pm: number, part: number) => {
      const count = part === parts.length - 1 ? n - placed : Math.round(n * pm / total);
      if (part < bars.length) {
        /* drawn cell by cell off the summed density, anywhere within its cell, then turned to the bar's angle */
        const cdf = new Float64Array(BG * BG); let acc = 0;
        sigma[part].forEach((v, c) => { acc += v; cdf[c] = acc; });
        for (let s = 0; s < count; s++) {
          const u = rnd() * acc; let lo = 0, hi = BG * BG - 1;
          while (lo < hi) { const mid_ = (lo + hi) >> 1; if (cdf[mid_] < u) lo = mid_ + 1; else hi = mid_; }
          const x = -BH + (lo % BG + rnd()) * BC, y = -BH + (Math.floor(lo / BG) + rnd()) * BC, [tx, ty] = turned(x, y, SUN_ANGLE + BAR_ANGLE * DEGR);
          put(tx, ty, 1);
        }
      } else {
        const [, rd, armed] = discs[part - bars.length];
        for (let s = 0; s < count; s++) {
          for (;;) {
            const R = discR(rd), th = 2 * Math.PI * rnd();
            /* the old stars' arms: the density 1 + A (sum over the arms), A the contrast less one; never more than two arms at a place */
            if (armed && rnd() * (1 + 2 * A) > 1 + A * inArms(R, th, true)) continue;
            put(R * Math.cos(th), R * Math.sin(th), armed ? 0 : 3);
            break;
          }
        }
      }
      placed += count;
    });
    /* a place on the arms: the thin disc's own spread, kept only in the arms (the sum, at most one) - shifted and narrowed for the dust */
    const rdThin = discs.find(d => d[2])![1];
    const onArms = (shift = 0, width = 0) => { for (;;) { const R = discR(rdThin), th = 2 * Math.PI * rnd(); if (rnd() <= Math.min(1, inArms(R, th, false, shift, width))) return [R * Math.cos(th), R * Math.sin(th)]; } };
    /* the young: MW_CLUSTERS[0] of them born in groups round one place, the rest spread along the arms */
    const [share, per, rad] = V.MW_CLUSTERS;
    for (let s = 0; s < ny;) {
      const [x, y] = onArms();
      const group = rnd() < share ? Math.min(per, ny - s) : 1;
      for (let k = 0; k < group; k++, s++) group > 1 ? put(x + rad * gauss(), y + rad * gauss(), 2) : put(x, y, 2);
    }
    /* the dust: on each arm's inner edge, MW_DUST[0] kpc inside its middle */
    const [dIn, dWide] = V.MW_DUST;
    for (let s = 0; s < nd; s++) { const [x, y] = onArms(dIn, dWide); put(x, y, 4); }
  };
  /*
   * A BAND OF ANDROMEDA'S LIGHT AS STARS: each pixel's light over the sky round it (the median past 30 kpc, the sky's
   * own glow and our Galaxy's cirrus) is how likely a star is there; M32 and NGC 205 (its satellites, not its disc) left
   * out; each star placed anywhere in its pixel, then turned face on - along the major axis (position angle east of
   * north) as it is, across it stretched by 1 / cos(inclination), the near side (north-west) up. Seen so the disc turns
   * clockwise (its north-east side recedes): g.spin -1
   */
  /*
   * OUR OWN STARS IN FRONT OF IT, found in the old stars' band: a point more than 30 times the median of the 9 x 9 round
   * it, masked to a radius growing with how bright it is (1.5 + 2 log10 of that, pixels; at most 10) - their halos
   * reach far past the point in the ultraviolet - and each masked pixel given the light round it (the median of the
   * nearest unmasked ring holding at least eight), so what was behind the star is the galaxy's, not a hole
   */
  let starMask: Uint8Array | null = null;
  const foreground = (P: number) => {
    if (starMask) return starMask;
    const old = new Float32Array(M31_IMG.bytes.buffer, M31_IMG.bytes.byteOffset, P * P), mask = new Uint8Array(P * P), win: number[] = [];
    let found = 0;
    for (let iy = 4; iy < P - 4; iy++) for (let ix = 4; ix < P - 4; ix++) {
      const c = old[iy * P + ix];
      win.length = 0;
      for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) win.push(old[(iy + dy) * P + ix + dx]);
      win.sort((p_, q) => p_ - q);
      const med = Math.max(1e-9, win[40]);
      if (c > 30 * med && c >= win[80]) {
        found++;
        const r = Math.min(10, 1.5 + 2 * Math.log10(c / med));
        for (let dy = -Math.ceil(r); dy <= Math.ceil(r); dy++) for (let dx = -Math.ceil(r); dx <= Math.ceil(r); dx++) {
          const x = ix + dx, y = iy + dy;
          if (x >= 0 && y >= 0 && x < P && y < P && dx * dx + dy * dy <= r * r) mask[y * P + x] = 1;
        }
      }
    }
    console.log(`  Andromeda's images: ${found} of our own stars in front of it masked out`);
    return (starMask = mask);
  };
  const layFromImage = (g: any, gi: number, band: number, count: number, kind: number, cutKpc: number) => {
    const P = V.ANDROMEDA_IMAGE, fov = V.ANDROMEDA_FOV, M = V.ANDROMEDA, fg = foreground(P);
    const raw = new Float32Array(M31_IMG.bytes.buffer, M31_IMG.bytes.byteOffset + band * P * P * 4, P * P);
    /* stars in the way (ours, in front of it) are points, a galaxy's light is not: each pixel at most three times the median of the 5 x 5 round it */
    const img = new Float32Array(P * P), win: number[] = [];
    for (let iy = 0; iy < P; iy++) for (let ix = 0; ix < P; ix++) {
      win.length = 0;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const x = ix + dx, y = iy + dy; if (x >= 0 && y >= 0 && x < P && y < P) win.push(raw[y * P + x]); }
      win.sort((p_, q) => p_ - q);
      img[iy * P + ix] = Math.min(raw[iy * P + ix], 3 * Math.max(0, win[win.length >> 1]));
    }
    const filled = new Float32Array(img);
    for (let iy = 0; iy < P; iy++) for (let ix = 0; ix < P; ix++) {
      if (!fg[iy * P + ix]) continue;
      for (let r = 1; r <= 24; r++) {
        win.length = 0;
        for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
          const x = ix + dx, y = iy + dy;
          if (x >= 0 && y >= 0 && x < P && y < P && !fg[y * P + x]) win.push(img[y * P + x]);
        }
        if (win.length >= 8) { win.sort((p_, q) => p_ - q); filled[iy * P + ix] = win[win.length >> 1]; break; }
      }
    }
    img.set(filled);
    const pix = fov * Math.PI / 180 * M.distance / P, pa = M.position_angle * DEGR, ci = Math.cos(M.inclination * DEGR);
    const maj = [-Math.sin(pa), Math.cos(pa)], mnr = [Math.cos(pa), Math.sin(pa)];
    const face = (x: number, y: number) => [x * maj[0] + y * maj[1], (x * mnr[0] + y * mnr[1]) / ci];
    /* the satellites, from M31's middle: M32 0.47' west, 24.2' south; NGC 205 26.7' west, 25.0' north (arcmin -> kpc) */
    const am = M.distance * Math.PI / 180 / 60, sats = [[0.47 * am, -24.2 * am, 2 * am], [26.7 * am, 25.0 * am, 7 * am]];
    const sky: number[] = [];
    for (let iy = 0; iy < P; iy++) for (let ix = 0; ix < P; ix++) {
      const [u, v] = face((ix + 0.5 - P / 2) * pix, (iy + 0.5 - P / 2) * pix);
      if (Math.hypot(u, v) > 30) sky.push(img[iy * P + ix]);
    }
    sky.sort((a, b) => a - b);
    /* the sky's level and its scatter (median absolute deviation): light counts only above the level and twice the scatter */
    const bg0 = sky.length ? sky[Math.floor(sky.length / 2)] : 0;
    const dev = sky.map(v => Math.abs(v - bg0)).sort((a, b) => a - b), bg = bg0 + 2 * 1.4826 * (dev.length ? dev[dev.length >> 1] : 0);
    const cdf = new Float64Array(P * P); let acc = 0;
    for (let iy = 0; iy < P; iy++) for (let ix = 0; ix < P; ix++) {
      const x = (ix + 0.5 - P / 2) * pix, y = (iy + 0.5 - P / 2) * pix, [u, v] = face(x, y);
      const off = Math.hypot(u, v) > cutKpc || sats.some(([sx, sy, sr]) => Math.hypot(x - sx, y - sy) < sr);
      acc += off ? 0 : Math.max(0, img[iy * P + ix] - bg);
      cdf[iy * P + ix] = acc;
    }
    for (let s = 0; s < count; s++) {
      const r = rnd() * acc; let lo = 0, hi = P * P - 1;
      while (lo < hi) { const mid_ = (lo + hi) >> 1; if (cdf[mid_] < r) lo = mid_ + 1; else hi = mid_; }
      const [u, v] = face((lo % P + rnd() - P / 2) * pix, (Math.floor(lo / P) + rnd() - P / 2) * pix);
      const h = new physics.Hole({ x: g.cx + u * perKpc * K, y: g.cy + v * perKpc * K, mx: m * 1e-4, ways: 1 });
      h.tag = 0; h.moves = false; h.px = 0; h.py = 0;
      w.add(h);
      whose.push(gi); inBulge.push(0); young.push(kind); thick.push(0);
    }
  };
  galaxies.forEach((g: any) => { g.spin = M31_LIT && g.s && g.s.name === V.ANDROMEDA.name ? -1 : 1; });
  galaxies.forEach((g, gi) => {
    const n = gi === galaxies.length - 1 ? STARS - laid : Math.round(STARS * g.share), nb = Math.round(n * g.bulge);
    const cut = Math.min(Number(Deno.env.get("RAY_CUT") ?? 4) * g.rd, span - 1);
    if (MEASURED && gi === MWI) {
      layMilkyWay(n, youngOf(gi), dustOf(gi), cut / perKpc, (xk, yk, kind) => {
        /* a young star weighs a ten-thousandth of an old one: it is there to be seen, not to pull */
        const h = new physics.Hole({ x: g.cx + xk * perKpc * K, y: g.cy + yk * perKpc * K, mx: kind === 2 || kind === 4 ? m * 1e-4 : m, ways: 1 });
        h.tag = 0; h.moves = false; h.px = 0; h.py = 0;
        w.add(h);
        whose.push(gi); inBulge.push(kind === 1 ? 1 : 0); young.push(kind === 2 ? 1 : kind === 4 ? 2 : 0); thick.push(kind === 3 ? 1 : 0);
      });
      const nbar = inBulge.reduce((a, b, k) => a + (whose[k] === gi ? b : 0), 0);
      console.log(`  the Milky Way laid as measured: ${n} stars (${nbar} in the bar at ${V.MW_BAR_ANGLE} degrees to the Sun's line), the thin disc in Scutum-Centaurus and Perseus at ${V.MW_ARM_CONTRAST} over between them, and ${YOUNG_N} young along all five (Hou & Han 2014); cut at ${(cut / perKpc).toFixed(1)} kpc`);
      laid += n;
      return;
    }
    for (let s = 0; s < n; s++) {
      /* drawn again where it falls past the cut (RAY_CUT scale lengths, and never past the view): a disc cut there, not a ring of every star beyond it at the view's edge */
      let r = 0;
      if (s < nb) {
        /* a Hernquist bulge, seen face on: r = a sqrt(u) / (1 - sqrt(u)), then its projection on the disc's plane */
        do { const q = Math.sqrt(rnd()), c = 2 * rnd() - 1; r = g.bs * q / (1 - q) * Math.sqrt(1 - c * c); } while (r > cut);
      } else {
        r = -g.rd * Math.log(rnd() * rnd());
        while (r > cut) r = -g.rd * Math.log(rnd() * rnd());
      }
      const th = 2 * Math.PI * rnd();
      const h = new physics.Hole({ x: g.cx + r * K * Math.cos(th), y: g.cy + r * K * Math.sin(th), mx: m, ways: 1 });
      h.tag = 0; h.moves = false; h.px = 0; h.py = 0;
      w.add(h);
      whose.push(gi); inBulge.push(s < nb ? 1 : 0); young.push(0); thick.push(0);
    }
    if (M31_LIT && gi === M31I) {
      layFromImage(g, gi, 1, youngOf(gi), 1, cut / perKpc);
      layFromImage(g, gi, 2, dustOf(gi), 2, cut / perKpc);
      console.log(`  Andromeda's young (${youngOf(gi)}) and dust (${dustOf(gi)}) laid off its far-ultraviolet and 250-micron light (data/andromeda-images), turned face on from ${V.ANDROMEDA.inclination} degrees; it turns clockwise, as it is seen to`);
    }
    laid += n;
  });
  if (DRY) {
    const layers = [new Float32Array(GRID * GRID), new Float32Array(GRID * GRID), new Float32Array(GRID * GRID)];
    w.holes.forEach((h: any, s: number) => {
      const gx = Math.floor(((h.x - mid) / K / span + 1) / 2 * GRID), gy = Math.floor(((h.y - mid) / K / span + 1) / 2 * GRID);
      if (gx >= 0 && gx < GRID && gy >= 0 && gy < GRID) layers[young[s]][gy * GRID + gx] += 1;
    });
    physics.Measure.save(OUT, ["density", "young", "dust"], { density: [...layers[0]], young: [...layers[1]], dust: [...layers[2]] }, { dry: 1, grid: GRID, span: [span], frames: 1, young: 1, about: "where the stars were laid, no device (RAY_DRY)" });
    console.log(`  laid only (RAY_DRY): visuals/${OUT}`);
    Deno.exit(0);
  }
  await w.stand();
  let pulls = await w.leans();
  /*
   * AT THEIR OWN SPEED (RAY_GALAXY runs): one mass scale, set so the Milky Way's star at the Sun's distance is pulled
   * round at the Sun's measured 238 km/s - as a share of light, which the lattice carries a c-bar a tick. Everything
   * else (the rest of the curve, Andromeda's speeds off its mass, the pair's pull) is then the medium's. The pull the
   * medium gives at the Sun's place is read off the stood field, the masses scaled by (wanted / read)^2, and the field
   * stood again, until it is within RAY_TOL (0.5%). A run without the Milky Way takes its mass scale from the
   * Milky Way's film (visuals/<RAY_UNIT_FROM, milkyway>, header mass_unit). RAY_REAL=0: the old launch at RAY_SPEED
   */
  const REAL = GAL !== "" && Deno.env.get("RAY_REAL") !== "0";
  /* the masses as laid, a share of light at the Sun's place, and the mass of 1e10 suns in the film's units */
  let massUnit = MASS0 / V.MILKY_WAY.mass;
  const rescale = async (by: number) => {
    w.holes.forEach((h: any) => { h.mx = h.mx * by; });
    galaxies.forEach(g => { g.mass *= by; });
    MASS *= by;
    massUnit *= by;
    await w.stand();
    pulls = await w.leans();
  };
  if (REAL && GAL !== "andromeda") {
    const g = galaxies[0], R0 = V.MILKY_WAY.sun * perKpc, want = V.MILKY_WAY.circling / V.LIGHT, TOL = Number(Deno.env.get("RAY_TOL") ?? 0.005);
    for (let pass = 0; pass < 6; pass++) {
      /* the pull round the Milky Way's middle on its disc stars within half a c-bar of the Sun's ring */
      let gs = 0, gn = 0;
      w.holes.forEach((h: any, s: number) => {
        if (whose[s] !== 0 || inBulge[s] || young[s]) return;
        const dx = (h.x - g.cx) / K, dy = (h.y - g.cy) / K, R = Math.hypot(dx, dy);
        if (Math.abs(R - R0) > 0.5) return;
        gs += -(pulls[s][0] * dx + pulls[s][1] * dy) / R; gn++;
      });
      const v = Math.sqrt(Math.max(0, gs / gn) * R0);
      console.log(`  the mass scale, pass ${pass}: at the Sun's ${R0.toFixed(2)} c-bar (${gn} stars) the medium pulls round at ${v.toExponential(4)} c (${(v * V.LIGHT).toFixed(1)} km/s), wanted ${want.toExponential(4)} (${V.MILKY_WAY.circling} km/s)`);
      if (Math.abs(v / want - 1) < TOL) break;
      if (!(v > 0)) throw new Error("the medium pulls nothing round at the Sun's place - nothing to set the mass scale by");
      await rescale((want / v) ** 2);
    }
  } else if (REAL) {
    const from = Deno.env.get("RAY_UNIT_FROM") ?? "milkyway", meta = join(repo, "visuals", from, "meta.json");
    if (!existsSync(meta)) throw new Error(`no mass scale: run the Milky Way first (visuals/${from}, header mass_unit)`);
    const unit = JSON.parse(readFileSync(meta, "utf8")).mass_unit;
    if (!(unit > 0)) throw new Error(`visuals/${from} keeps no mass_unit - rerun it with this driver`);
    console.log(`  the mass scale from visuals/${from}: 1e10 suns weigh ${unit.toExponential(4)}`);
    await rescale(unit / massUnit);
  }
  /*
   * EACH STAR LAUNCHED CIRCLING at what the medium pulls it with where it stands, and stirred just enough that the disc
   * holds (RAY_Q, Toomre's Q; 0: a flat spread of RAY_SIGMA of the circling speed, as the first films were). A disc
   * stirred too little breaks into clumps that fling its stars out, whatever the pull. Off the medium's own numbers,
   * in rings of half a c-bar: the circling speed off the pull the stars stand in (v^2 = g R), the epicycles' rate
   * off how that falls (kappa^2 = d(v^2)/dR / R + 2 v^2 / R^2), the surface density off the stars' own count, and G off
   * the lone unit mass's pull (p1 rcal^(D-1), as the mass was set). The radial stir sigma_R = Q 3.36 G Sigma / kappa,
   * across it sigma_R kappa / 2 Omega, and the mean circling less the asymmetric drift the stir holds up
   * (v_phi^2 = v^2 + sigma_R^2 (1 - kappa^2 / 4 Omega^2 - 2 R / R_d)). Then each galaxy is set at rest - its
   * momentum taken off its every star alike - so a drift later is the medium's and not the draw's; a collision then
   * gives each its share of the pair's measured approach
   */
  const Q = Number(Deno.env.get("RAY_Q") ?? 1.2), GEFF = p1 * rcal ** (D - 1), DR = 0.5, RINGS = Math.ceil(span / DR) + 1;
  const at = (k: number) => (k + 0.5) * DR;
  /* read once (data/: each is a lookup), not for every star */
  const MW_STIR_ = V.MW_STIR, MW_DISCS_ = V.MW_DISCS, MW_R0_ = V.MILKY_WAY.sun;
  const launch = (gi: number) => {
    const g = galaxies[gi];
    const ringG = new Float64Array(RINGS), ringN = new Float64Array(RINGS), ringM = new Float64Array(RINGS);
    w.holes.forEach((h: any, s: number) => {
      if (whose[s] !== gi) return;
      const dx = (h.x - g.cx) / K, dy = (h.y - g.cy) / K, R = Math.hypot(dx, dy);
      if (R <= 0) return;
      const k = Math.min(RINGS - 1, Math.floor(R / DR));
      ringG[k] += -(pulls[s][0] * dx + pulls[s][1] * dy) / R; ringN[k]++; ringM[k] += h.mass;
    });
    const v2 = Array.from({ length: RINGS }, (_, k) => ringN[k] ? Math.max(0, ringG[k] / ringN[k] * at(k)) : NaN);
    /* rings too thin to say anything take their neighbours' */
    for (let k = 0; k < RINGS; k++) if (!(ringN[k] >= 20)) { let j = k; while (j > 0 && !(ringN[j] >= 20)) j--; v2[k] = ringN[j] >= 20 ? v2[j] * at(j) / at(k) : NaN; }
    /* and those at the very middle, before any ring says enough, turn as a solid body up to the first that does */
    const first = v2.findIndex((x, k) => ringN[k] >= 20 && Number.isFinite(x));
    for (let k = 0; k < first; k++) v2[k] = v2[first] * (at(k) / at(first)) ** 2;
    const sigmaSurf = Array.from({ length: RINGS }, (_, k) => ringM[k] / (Math.PI * ((k + 1) ** 2 - k ** 2) * DR * DR));
    /* the slope over two c-bar either side (a ring's own is noise), and never less than the circling's own rate - a fall past Kepler's is the count's noise, not the pull's */
    const kappa2 = Array.from({ length: RINGS }, (_, k) => {
      const lo = Math.max(0, k - 4), hi = Math.min(RINGS - 1, k + 4);
      const d = (v2[hi] - v2[lo]) / (at(hi) - at(lo)), om2 = v2[k] / (at(k) * at(k));
      return Math.max(om2, d / at(k) + 2 * om2);
    });
    const stir = (R: number) => {
      const k = Math.min(RINGS - 1, Math.floor(R / DR)), om2 = v2[k] / (R * R), kap = Math.sqrt(kappa2[k]);
      /* where the pull stood holds nothing (none, or outwards), nothing circles and nothing is stirred */
      if (!(om2 > 0) || !(kap > 0)) return { sR: 0, sP: 0, vphi: 0, q: NaN, v: 0 };
      /* and no stir past half the circling, where the disc thins out to a few stars a ring */
      const sR = Q > 0 ? Math.min(0.5 * Math.sqrt(v2[k]), Q * 3.36 * GEFF * sigmaSurf[k] / kap) : SIGMA * Math.sqrt(v2[k]);
      const sP = Q > 0 ? sR * kap / (2 * Math.sqrt(om2)) : sR;
      const vphi = Q > 0 ? Math.sqrt(Math.max(0, v2[k] + DRIFT * sR * sR * (1 - kappa2[k] / (4 * om2) - 2 * R / g.rd))) : Math.sqrt(v2[k]);
      return { sR, sP, vphi, q: sR * kap / (3.36 * GEFF * sigmaSurf[k]), v: Math.sqrt(v2[k]) };
    };
    console.log(`  the launch${g.s ? ` of ${g.s.name}` : ""}, ${Q > 0 ? `stirred to Toomre's Q ${Q}` : `a flat spread of ${SIGMA} of the circling`}: ${[1, 2, 3].map(n => { const st = stir(n * g.rd); return `at ${n} R_d circling ${st.v.toFixed(4)}, radial stir ${st.sR.toFixed(4)} (Q ${st.q.toFixed(2)})`; }).join("; ")}`);
    let vsum = 0, vn = 0, mx = 0, my = 0, mt = 0;
    w.holes.forEach((h: any, s: number) => {
      if (whose[s] !== gi) return;
      const dx = (h.x - g.cx) / K, dy = (h.y - g.cy) / K, R = Math.hypot(dx, dy);
      if (R <= 0) return;
      let st = stir(R);
      if (Math.abs(R - g.rd) < 1) { vsum += st.v; vn++; }
      /* the Milky Way laid as measured: its discs' and young stars' stir as measured (Video.MW_STIR), the bar's as before */
      if (((MEASURED && gi === MWI && !inBulge[s]) || young[s]) && st.v > 0) {
        const [s0, rs] = MW_STIR_[young[s] ? 2 : thick[s] ? 1 : 0], rd = MW_DISCS_[thick[s] ? 1 : 0][1], Rk = R / perKpc;
        const k = Math.min(RINGS - 1, Math.floor(R / DR)), om2 = v2[k] / (R * R), sR = s0 / V.LIGHT * Math.exp(-(Rk - MW_R0_) / rs);
        const sP = sR * Math.sqrt(kappa2[k]) / (2 * Math.sqrt(om2));
        st = { ...st, sR, sP, vphi: Math.sqrt(Math.max(0, v2[k] + sR * sR * (1 - kappa2[k] / (4 * om2) - Rk / rd - 2 * Rk / rs))) };
      }
      const vr = st.sR * gauss(), vp = ((g as any).spin ?? 1) * (st.vphi + st.sP * gauss());
      const vx = (vr * dx - vp * dy) / R, vy = (vr * dy + vp * dx) / R;
      h.px = h.mass * vx; h.py = h.mass * vy;
      mx += h.px; my += h.py; mt += h.mass;
    });
    w.holes.forEach((h: any, s: number) => {
      if (whose[s] !== gi) return;
      /* RAY_BULK: the whole disc then set moving along x at this speed (c-bar a tick) - does a moving galaxy speed itself up? */
    h.px -= h.mass * mx / mt - h.mass * Number(Deno.env.get("RAY_BULK") ?? 0); h.py -= h.mass * my / mt;
    });
    return { speed: vn ? vsum / vn : 0, stir };
  };
  const launched = galaxies.map((_, gi) => launch(gi));
  const speedRD = launched[0].speed;
  /* THE SUN: the Milky Way's star nearest 8.2 kpc out at RAY_SUN_ANGLE (degrees, 180: left of the middle), its track kept first */
  let sunStar = -1, sunInfo: number[] = [];
  if (GAL && GAL !== "andromeda") {
    const R0 = V.MILKY_WAY.sun * perKpc, a0 = Number(Deno.env.get("RAY_SUN_ANGLE") ?? 180) * Math.PI / 180, g = galaxies[0];
    const sx = g.cx + R0 * K * Math.cos(a0), sy = g.cy + R0 * K * Math.sin(a0);
    let best = Infinity;
    w.holes.forEach((h: any, s: number) => { if (whose[s] === 0 && !inBulge[s] && !young[s]) { const d = Math.hypot(h.x - sx, h.y - sy); if (d < best) { best = d; sunStar = s; } } });
    sunInfo = [R0, launched[0].stir(R0).vphi, a0];
    /* laid as measured, the Sun's star goes as the Sun does: the pull's circling there, 10.5 km/s ahead and 11.1 inwards (Video.MW_SUN_MOTION) */
    if (MEASURED && sunStar >= 0) {
      const h = w.holes[sunStar], dx = (h.x - g.cx) / K, dy = (h.y - g.cy) / K, R = Math.hypot(dx, dy);
      const vp = launched[0].stir(R).v + V.MW_SUN_MOTION[1] / V.LIGHT, vr = -V.MW_SUN_MOTION[0] / V.LIGHT;
      h.px = h.mass * (vr * dx - vp * dy) / R; h.py = h.mass * (vr * dy + vp * dx) / R;
      sunInfo[1] = vp;
    }
    console.log(`  the Sun: star ${sunStar}, ${(best / K).toFixed(2)} c-bar from ${R0.toFixed(2)} c-bar out, circling at ${sunInfo[1].toFixed(4)} c-bar a tick`);
  }
  /* THE CLOCK: the first galaxy's film circling against its measured one - at the Sun for the Milky Way, at 2.2 R_d (the disc's peak) otherwise: [R c-bar, v c-bar a tick, R kpc, v km/s] */
  let clock: number[] = [];
  if (GAL) {
    const g = galaxies[0], Rk = sunInfo.length ? g.s.sun : 2.2 * g.s.disc_scale;
    clock = [Rk * perKpc, sunInfo.length ? sunInfo[1] : launched[0].stir(Rk * perKpc).vphi, Rk, g.s.circling];
  }
  /* A COLLISION: the pair's measured motion (approach along the line between them, and across it), in the film's speed a km/s - the Sun's circling over its measured 238 - shared by mass */
  let kms = 0;
  if (GAL === "collision") {
    /* at their own speed a km/s is its share of light; otherwise the film's: the Sun's circling over its measured 238 */
    kms = REAL ? 1 / V.LIGHT : sunInfo[1] / V.MILKY_WAY.circling;
    const M31 = V.ANDROMEDA, vrx = (handover ? handover.vel[0] : -M31.approach) * kms, vry = (handover ? handover.vel[1] : M31.across) * kms;
    galaxies.forEach((g, gi) => {
      const f = gi === 0 ? -galaxies[1].share : galaxies[0].share;
      w.holes.forEach((h: any, s: number) => { if (whose[s] === gi) { h.px += h.mass * f * vrx; h.py += h.mass * f * vry; } });
    });
    if (handover) console.log(`  from the orbit run (visuals/${ORBIT}, ${handover.myr.toFixed(0)} Myr after today): Andromeda at (${handover.sep.map((v: number) => v.toFixed(1)).join(", ")}) kpc from the Milky Way, moving (${handover.vel.map((v: number) => v.toFixed(1)).join(", ")}) km/s (${(Math.hypot(vrx, vry)).toExponential(4)} c-bar a tick)`);
    else console.log(`  approaching at ${M31.approach} km/s (${(M31.approach * kms).toFixed(5)} c-bar a tick), ${M31.across} km/s across, from ${APART} c-bar (${(APART / perKpc).toFixed(0)} kpc; today ${M31.distance} kpc)`);
  }
  w.holes.forEach((h: any) => {
    h.momentum = new physics.Vector({ components: [h.px, h.py] });
    h.moves = true;
  });
  w.push();
  /* the stars whose own tracks are kept: the Sun's first, then every so many */
  const shown: number[] = [];
  if (SHOWN > 0) {
    if (sunStar >= 0) shown.push(sunStar);
    /* over every star laid, the young among them (not the dust: it is no point of light) */
    const ALL = w.holes.length;
    for (let k = 0; shown.length < Math.min(SHOWN, ALL); k++) { const s = Math.floor(k * ALL / SHOWN); if (s >= ALL) break; if (s !== sunStar && young[s] !== 2) shown.push(s); }
  }
  const xy: number[] = [];
  console.log(`  launched: at R_d they circle at ${speedRD.toFixed(4)} c-bar a tick (the field stood in ${((performance.now() - t0) / 1000).toFixed(0)}s)`);
  /* star counts on a GRID x GRID face-on picture, span c-bar either side of the box's middle */
  const density: number[] = [], youngDensity: number[] = [], dustDensity: number[] = [], ticks: number[] = [], departed: number[] = [];
  /* what a closed system keeps: its momentum (zero, launched about the middle) and its turn about the middle - and its motion's own energy, and how spread its stars are, frame by frame */
  const momentum: number[] = [], turn: number[] = [], motion: number[] = [], half: number[] = [], holding: number[] = [];
  /*
   * THE CAMERA: where the galaxy's middle is now - the centre of mass of the stars within 3 R_d of where it was, found
   * again a few times (so a star flung out, or a clump passing, does not drag it) - and every frame drawn about it
   * (RAY_CAMERA=fixed: about the box's middle, as the first films were). Its path is kept with the film
   */
  /* a collision is watched about the pair's common middle (the box's), which stays put: its momentum is nought */
  const FOLLOW = (Deno.env.get("RAY_CAMERA") ?? (GAL === "collision" ? "fixed" : "follow")) !== "fixed";
  let camX = mid, camY = mid;
  const camera: number[] = [];
  const shoot = async () => {
    await w.sync();
    if (FOLLOW) {
      const reach = 3 * RD * K;
      for (let pass = 0; pass < 6; pass++) {
        let sx = 0, sy = 0, sm = 0;
        for (const h of w.holes) { if (Math.hypot(h.x - camX, h.y - camY) <= reach) { sx += h.mass * h.x; sy += h.mass * h.y; sm += h.mass; } }
        if (sm > 0) { camX = sx / sm; camY = sy / sm; }
      }
    }
    camera.push((camX - mid) / K, (camY - mid) / K);
    /* the stars counted on the picture's cells - the young apart, they are the light and not the mass */
    const grid = new Float32Array(GRID * GRID), yg = new Float32Array(YOUNG_N ? GRID * GRID : 0), dg = new Float32Array(DUST_N ? GRID * GRID : 0);
    w.holes.forEach((h: any, s: number) => {
      const gx = Math.floor(((h.x - camX) / K / span + 1) / 2 * GRID), gy = Math.floor(((h.y - camY) / K / span + 1) / 2 * GRID);
      if (gx >= 0 && gx < GRID && gy >= 0 && gy < GRID) (young[s] === 1 ? yg : young[s] === 2 ? dg : grid)[gy * GRID + gx] += 1;
    });
    for (const v of grid) density.push(v);
    for (const v of yg) youngDensity.push(v);
    for (const v of dg) dustDensity.push(v);
    for (const s of shown) { const h = w.holes[s]; xy.push((h.x - camX) / K, (h.y - camY) / K); }
    ticks.push(w.t);
    let px = 0, py = 0, lz = 0, ke = 0, pabs = 0;
    const rs: number[] = [];
    for (const h of w.holes) {
      const p = h.momentum?.components ?? [h.px ?? 0, h.py ?? 0];
      const dx = (h.x - camX) / K, dy = (h.y - camY) / K;
      px += p[0]; py += p[1]; pabs += Math.hypot(p[0], p[1]);
      lz += dx * p[1] - dy * p[0];
      ke += (p[0] * p[0] + p[1] * p[1]) / (2 * h.mass);
      rs.push(Math.hypot(dx, dy));
    }
    rs.sort((a, b) => a - b);
    /* how well the pull a star now feels holds its circling: g R / v_turn^2, the median over stars 2-3 R_d out (1 at the launch, where each was set going at the pull it stood in) */
    const felt = await w.leans(), ratios: number[] = [];
    w.holes.forEach((h: any, s: number) => {
      const dx = (h.x - camX) / K, dy = (h.y - camY) / K, R = Math.hypot(dx, dy);
      if (R < 2 * RD || R > 3 * RD) return;
      const p = h.momentum?.components ?? [h.px ?? 0, h.py ?? 0];
      const vt = (dx * p[1] - dy * p[0]) / R / h.mass, g = -(felt[s][0] * dx + felt[s][1] * dy) / R;
      if (vt * vt > 1e-12) ratios.push(g * R / (vt * vt));
    });
    ratios.sort((a, b) => a - b);
    holding.push(ratios[Math.floor(ratios.length / 2)] ?? NaN);
    momentum.push(Math.hypot(px, py) / Math.max(pabs, 1e-30)); turn.push(lz); motion.push(ke); half.push(rs[Math.floor(rs.length / 2)] ?? 0);
    departed.push((await w.departed()) / MASS);
  };
  await shoot();
  for (let f = 1; f < FRAMES; f++) {
    for (let t = 0; t < TPF; t++) await w.tick();
    await shoot();
    if (f % Number(Deno.env.get("RAY_LOG") ?? 10) === 0) console.log(`  frame ${f}/${FRAMES}, tick ${w.t}, ${((performance.now() - t0) / 1000).toFixed(0)}s, longest submission ${w.longest.toFixed(1)} ms (${w.longest_was.slice(0, 120)}); ${(100 * departed[departed.length - 1]).toFixed(2)}% of the mass has left the box; net momentum ${(100 * momentum[momentum.length - 1]).toFixed(3)}% of the stars' own, turn ${(turn[turn.length - 1] / turn[0]).toFixed(4)} of the first, energy of motion ${(motion[motion.length - 1] / motion[0]).toFixed(3)} of the first, half the stars within ${half[half.length - 1].toFixed(1)} c-bar, the pull holds ${holding[holding.length - 1].toFixed(3)} of their circling`);
  }
  if (shown.length) physics.Measure.save(`${OUT}.stars`, ["xy"], { xy }, {
    shown: shown.length, frames: FRAMES, sun: sunStar >= 0 ? 0 : -1, pages: "video.",
    tags: shown.map(s => young[s] ? 4 + whose[s] : 2 * whose[s] + inBulge[s]),
    about: "the tracks of some of the stars of the film beside it: x, y (c-bar from the camera) of each shown star, frame after frame; tag 2 x galaxy + (1 in the bulge); the first is the Sun's where sun is 0",
  });
  physics.Measure.save(OUT, YOUNG_N ? ["density", "young", "dust"] : ["density"], YOUNG_N ? { density, young: youngDensity, dust: dustDensity } : { density }, {
    young: YOUNG_N ? 1 : 0, young_stars: YOUNG_N, dust_tracers: DUST_N,
    ...(GAL ? {
      galaxy: GAL, pages: "video.", per_kpc: perKpc, real: REAL, mass_unit: massUnit, sun: sunInfo, clock, kms, apart: Math.hypot(gap[0], gap[1]), orbit: ORBIT ? { from: ORBIT, ...handover } : null,
      middles: galaxies.map(g => [(g.cx - mid) / K, (g.cy - mid) / K]), scales: galaxies.map(g => g.rd),
      sighted: galaxies.map(g => g.s.name), speeds: launched.map(l => l.speed),
    } : {}),
    names: GAL ? galaxies.map(g => g.s.name) : ["a disc in the medium"], mass: GAL ? galaxies.map(g => g.mass) : [MASS], scale: GAL ? galaxies.map(g => g.rd) : [RD], span: [span], stars: STARS, frames: FRAMES, grid: GRID, ticks,
    deg: DEG, side: SIDE, view: VIEW, margin: MARGIN, departed, momentum, turn, motion, half, holding, camera, follow: FOLLOW, speed: speedRD, sigma: SIGMA, tpf: TPF,
    about: "a disc of stars in the medium itself, every star its own body, every step local (galaxy.gpu.ts RAY_ONLY=medium-galaxy): star counts on grid x grid cells, span c-bar either side of the middle, frame after frame",
  });
  console.log(`  written to visuals/${OUT} (${((performance.now() - t0) / 1000).toFixed(0)}s); draw it: npx ray visuals ${GAL ? `video.${GAL}` : OUT}`);
  Deno.exit(0);
}

/* RAY_ONLY=probe: what the chain says a body does at a distance - its own shell, reach, record and pull - printed, nothing run on the device */
if (Deno.env.get("RAY_ONLY") === "probe") {
  const agg = physics.Aggregate.of(physics.G, Math.round(deg));
  console.log(`\n  the chain at DEG ${Math.round(deg)}: rho_inf ${agg.rho_inf}, n_f ${agg.nf_inf}`);
  for (const role of ["record", "felt", "line"]) console.log(`  ${role.padEnd(8)} ${agg.says(role)}`);
  const model = new physics.Model({ theory: physics.G });
  for (const name of ["what bodies' rays grow where they meet", "\\bar{n}", "the world's matter grows", "the space line nets", "H", "cH", "a_{0}", "a_{0} along the path", "\\frac{a_{0}}{cH}", "F_{g}"]) {
    const f = model.fact(name);
    console.log(`  ${name.padEnd(38)} ${f ? physics.Expr.show(f.to) : "-"}`);
  }
  /* the scale in the lattice's own units, and what a circle at that scale moves at: v^2 = a_0 R, c-bar = 1 */
  const a0lat = model.a0_lattice;
  const ratio = model.value_of("\\frac{a_{0}}{cH}", model.settled(Math.round(deg)));
  console.log(`\n  a_0 = ${a0lat} c-bar a tick a tick; a_0/cH = ${ratio}, so cH = ${(a0lat / ratio).toExponential(3)} a tick - the lattice grows by that share every tick`);
  for (const R of [1, 3, 10, 30]) console.log(`    a circle of ${R} c-bar at g = a_0 goes ${Math.sqrt(a0lat * R).toFixed(3)} c; a real galaxy's (v ~ 200 km/s) is ${(200 / 299792.458).toExponential(1)} c, so at g = a_0 it spans ${(Math.pow(200 / 299792.458, 2) / a0lat).toExponential(1)} c-bar`);
  const shellF = agg.store.fact("is", "l.shell\\paren{\\bar{R}}"), reachF = agg.store.fact("is", "l.reach\\paren{\\bar{R}}");
  console.log(`  shell    ${shellF ? physics.Expr.show(shellF.to) : "-"}`);
  console.log(`  reach    ${reachF ? physics.Expr.show(reachF.to) : "-"}`);
  const at = (name: string, R: number) => { const e = agg.base; e["\\bar{R}"] = R; const v = agg.fact_at(name, e); e["\\bar{R}"] = null; return v; };
  console.log(`\n  R (c-bar)      shell(R) raw     reach(R) raw     record(1 at R)    pull(1, R)     d ln pull / d ln R`);
  for (const R of [1e-4, 1e-3, 1e-2, 0.1, 0.5, 1, 2, 4, 8, 16, 32, 64, 128]) {
    const p = agg.pull(1, R), p2 = agg.pull(1, R * 1.1);
    console.log(`  ${R.toExponential(1).padEnd(14)} ${at("l.shell\\paren{\\bar{R}}", R).toExponential(4).padEnd(16)} ${at("l.reach\\paren{\\bar{R}}", R).toExponential(4).padEnd(16)} ${agg.record_of([1], [R], -1).toExponential(4).padEnd(17)} ${p.toExponential(4).padEnd(14)} ${(Math.log(p2 / p) / Math.log(1.1)).toFixed(3)}`);
  }
  Deno.exit(0);
}
const plan = new S({ deg });
plan.film((Deno.env.get("RAY_GALAXIES") ?? "").split(",").map((s: string) => s.trim()).filter(Boolean));
const G: number = plan.ids.length;
console.log(`\n═════ the galaxies, run → visuals/galaxy.{simulated,fields,stars,possible} ═════\n`);
console.log(`  DEG ${deg}: a0 ${plan.a0_si.toExponential(3)} m/s² = ${plan.a0.toFixed(1)} (km/s)²/kpc; ${G} galaxies, filming ${plan.film_ids.map((g: number) => physics.Sparc.names[g]).join(", ")}`);

/* ── the device ─────────────────────────────────────────────────────────────────────────── */
const nav: any = (globalThis as any).navigator;
const adapter = await nav.gpu.requestAdapter();
if (!adapter) throw new Error("WebGPU: no adapter");
const lim = adapter.limits ?? {};
const device = await adapter.requestDevice({ requiredLimits: { maxStorageBufferBindingSize: lim.maxStorageBufferBindingSize, maxBufferSize: lim.maxBufferSize } });
const STORAGE = 0x80 | 0x4 | 0x8;
const upload = (data: ArrayBufferView) => { const b = device.createBuffer({ size: Math.max(16, data.byteLength), usage: STORAGE }); device.queue.writeBuffer(b, 0, data as any); return b; };
const blank = (floats: number) => device.createBuffer({ size: Math.max(16, floats * 4), usage: STORAGE });
const read = async (buf: any, floats: number) => {
  const staging = device.createBuffer({ size: Math.max(16, floats * 4), usage: 0x1 | 0x8 });
  const enc = device.createCommandEncoder();
  enc.copyBufferToBuffer(buf, 0, staging, 0, Math.max(16, floats * 4));
  device.queue.submit([enc.finish()]);
  await staging.mapAsync(1);
  const out = new Float32Array(staging.getMappedRange().slice(0, floats * 4));
  staging.unmap(); staging.destroy();
  return out;
};
const compile = async (code: string, entries: string[]) => {
  const module = device.createShaderModule({ code });
  const info = await module.getCompilationInfo?.();
  for (const m of info?.messages ?? []) if (m.type === "error") throw new Error(`${entries.join("/")}: the shader failed to compile: ${m.message} (line ${m.lineNum}: ${code.split("\n")[m.lineNum - 1]})`);
  /* the layout is every binding the text declares, whether an entry point reads it or not - an "auto" layout drops the unread ones and the bind group then fails without a word */
  const entries_ = [...code.matchAll(/@binding\((\d+)\) var<storage, (read|read_write)>/g)].map(m => ({ binding: Number(m[1]), visibility: 4, buffer: { type: m[2] === "read" ? "read-only-storage" : "storage" } }));
  const group = device.createBindGroupLayout({ entries: entries_ });
  const layout = device.createPipelineLayout({ bindGroupLayouts: [group] });
  const out: Record<string, any> = {};
  for (const e of entries) out[e] = { pipe: device.createComputePipeline({ layout, compute: { module, entryPoint: e } }), group, name: e };
  return out;
};
/*
 * THIS DEVICE ALSO DRIVES THE DISPLAY. A submission that holds it for seconds starves the compositor and has taken
 * the whole card off the bus (2026-09-24: 25 N-body steps in one submission). So every dispatch is cut into pieces
 * of at most `piece` threads (each kernel starts at P[7]), each piece is its own submission, after each one the host
 * rests at least as long as the device worked (the device is never busy more than half the time), and a piece that
 * still takes longer than LONGEST_MS stops the run rather than risk the card again.
 */
const LONGEST_MS = 250;
let longest = 0;
const rest = async (t0: number, what: string) => {
  const ms = performance.now() - t0;
  longest = Math.max(longest, ms);
  if (ms > LONGEST_MS) throw new Error(`${what}: one submission held the device ${ms.toFixed(0)} ms (limit ${LONGEST_MS}) - cut it finer before running again`);
  await new Promise(r => setTimeout(r, Math.max(4, ms)));
};
/* the parameters a kernel reads as P: eight whole numbers, P[7] the first thread of the piece */
const u32 = (...xs: number[]) => ({ params: [...xs, 0, 0, 0, 0, 0, 0, 0, 0].slice(0, 8) });
const run = async (kernel: any, buffers: any[], n: number, piece = 1 << 16) => {
  const params: number[] = buffers[0].params;
  for (let off = 0; off < n; off += piece) {
    const count = Math.min(piece, n - off);
    const P = upload(new Uint32Array([...params.slice(0, 7), off]));
    device.pushErrorScope("validation");
    const bind = device.createBindGroup({ layout: kernel.group, entries: [P, ...buffers.slice(1)].map((buffer, binding) => ({ binding, resource: { buffer } })) });
    const enc = device.createCommandEncoder();
    const pass = enc.beginComputePass();
    pass.setPipeline(kernel.pipe); pass.setBindGroup(0, bind);
    const groups = Math.ceil(count / 64);
    pass.dispatchWorkgroups(Math.min(groups, 1024), Math.ceil(groups / 1024));
    pass.end();
    const t0 = performance.now();
    device.queue.submit([enc.finish()]);
    await device.queue.onSubmittedWorkDone();
    const bad = await device.popErrorScope();
    P.destroy();
    if (bad) throw new Error(`${kernel.name}: the device refused it: ${bad.message}`);
    await rest(t0, kernel.name);
  }
};
const worst = (what: string, pairs: [number, number][], tol: number) => {
  let w = 0, at = "";
  for (const [cpu, gpu] of pairs) {
    const d = Math.abs(cpu - gpu) / Math.max(Math.abs(cpu), 1e-12);
    if (!(d <= w) ) { w = d; at = `cpu ${cpu} gpu ${gpu}`; }
  }
  console.log(`  ${what.padEnd(18)} device against the CPU: worst ${w.toExponential(2)} relative${at ? ` (${at})` : ""}`);
  if (!(w < tol)) throw new Error(`${what}: the device differs from the CPU by ${w} - ${at}`);
};

const PULL = (await compile(S.pull_kernel, ["PULL"])).PULL;
const LAW = (await compile(S.law_kernel, ["LAW"])).LAW;
const FIT = (await compile(S.fit_kernel, ["FIT"])).FIT;
const BEST = (await compile(S.best_kernel, ["BEST"])).BEST;
const STARS = await compile(S.stars_kernel, ["START", "STEP"]);
const lawBuf = upload(new Float32Array(plan.law_table));

/* RAY_ONLY=formed runs the discs left to themselves alone (Formed.ray), leaving everything else on disk as it is */
if (Deno.env.get("RAY_ONLY") !== "formed") {
/* PULL: every annulus of every galaxy at every measured and table radius */
const pullOf = async (tasks: number[]) => {
  const n = tasks.length / 4;
  const out = blank(n);
  await run(PULL, [u32(n, S.NSUB, S.NPHI), upload(new Float32Array(tasks)), out], n, 1 << 13);
  return read(out, n);
};
const tasks: number[] = plan.tasks;
const pulls = await pullOf(tasks);
const nt = tasks.length / 4;
worst("PULL", [0, nt >> 3, nt >> 1, nt - 1].map(i => [plan.pull_cpu(tasks, i), pulls[i]]), 2e-3);
console.log(`  PULL               ${nt} (radius, annulus) pairs summed (${secs()})`);
plan.solve(Array.from(pulls));

/*
 * RAY_ONLY=lift: THE TWO READINGS OF a_0 NEAR MATTER, TESTED (Simulation.lift_coefficients, lift_test): what arrives
 * at every measured radius whichever way (PULL, scalar), the two kappas off the chain and the medium, the curves at
 * each, and what each does where gravity is strongest and best measured - a planet's orbit
 */
/*
 * RAY_ONLY=perms: EVERY WAY a_0 MIGHT BE SET, ON EVERY LATTICE, AGAINST EVERY MEASUREMENT AT HAND. a_0 = v c / tau, v =
 * 2/(DEG+2) off the chain, tau one of: the age (falls in time), the growth rate (goes as H(z)), the vacuum's own
 * constant growth (H_0 sqrt(Omega_Lambda), constant in time), or H_0 itself held constant. Each scored on SPARC's
 * curves (Simulation.lift_test, no lift), Genzel's six discs at their own epochs (Simulation.epochs), and a_0/cH_0
 * against the measured 0.155-0.183
 */
if (Deno.env.get("RAY_ONLY") === "perms") {
  const shape = S.shape_of(Array.from(await pullOf(S.shape_tasks)));
  const c = physics.Sparc.C_LIGHT, H0 = S.hubble0, t0 = S.age_at(0), OL = 1 - S.OMEGA_M;
  const hyps: [string, (v: number) => number, string][] = [
    ["age: v c / t", v => v * c / t0, "age"],
    ["growth: v c H(z)", v => v * c * H0, "hubble"],
    ["vacuum: v c H0 sqrt(OL)", v => v * c * H0 * Math.sqrt(OL), "constant"],
    ["held: v c H0", v => v * c * H0, "constant"],
  ];
  const pct = (dex: number) => `${(100 * (10 ** dex - 1)).toFixed(1)}%`;
  const genzel = (a0: number, how: string) => {
    let chi = 0;
    for (const [, , f, err, limit, pred] of S.epochs(shape, a0, how)) { const d = (pred - f) / Math.max(err, 0.02); chi += limit > 0 && pred <= f ? 0 : d * d; }
    return chi;
  };
  console.log(`\n  ${"a_0 from".padEnd(26)} DEG    v      a_0 (m/s^2)  a_0/cH_0  band   SPARC rms  middle   Genzel chi^2 (6)`);
  for (const [label, a0of, how] of hyps) {
    for (const DEG of [6, 8, 10, 12, 18, 26]) {
      const v = 2 / (DEG + 2), a0 = a0of(v), ratio = a0 / (c * H0);
      const [rms, mid] = plan.lift_test(0, a0 / S.UNIT_G);
      const inBand = ratio >= 0.155 && ratio <= 0.183 ? " in " : (ratio < 0.155 ? "low " : "high");
      console.log(`  ${label.padEnd(26)} ${String(DEG).padStart(3)}  ${v.toFixed(3)}  ${a0.toExponential(2)}    ${ratio.toFixed(3)}    ${inBand}  ${pct(rms).padStart(7)}   ${((mid >= 0 ? "+" : "") + pct(mid)).padStart(7)}   ${genzel(a0, how).toFixed(1).padStart(6)}`);
    }
    console.log("");
  }
  /* and the one number each hypothesis would need: the v that puts a_0/cH_0 in the middle of the band, as a DEG */
  for (const [label, a0of] of hyps) { const per = a0of(1) / (c * H0); const vWant = 0.169 / per; console.log(`  ${label.padEnd(26)} wants v = ${vWant.toFixed(3)}, DEG = ${(2 / vWant - 2).toFixed(1)}`); }
  Deno.exit(0);
}

/* RAY_ONLY=epochs: a_0 through time on Genzel's six discs (Simulation.epochs) - constant, falling with the age, or with H(z) */
if (Deno.env.get("RAY_ONLY") === "epochs") {
  const shape = S.shape_of(Array.from(await pullOf(S.shape_tasks)));
  const names = physics.Sparc.discs.map((d: any) => d.name);
  for (const [label, a0si] of [["a_0 today the chain's (DEG 18)", plan.a0_si], ["a_0 today the data's 1.2e-10", 1.2e-10]] as [string, number][]) {
    console.log(`\n  Genzel's discs, ${label}: the dark share within R_1/2, measured against predicted`);
    for (const how of ["constant", "age", "hubble"]) {
      const rows = S.epochs(shape, a0si, how);
      let chi = 0;
      const parts = rows.map((r: number[], i: number) => {
        const [z, gbar, f, err, limit, pred] = r;
        const d = (pred - f) / Math.max(err, 0.02);
        /* an upper limit is only missed from above */
        const c = limit > 0 && pred <= f ? 0 : d * d;
        chi += c;
        return `${names[i]} z${z.toFixed(2)} ${f.toFixed(2)}${limit > 0 ? "<" : "±" + err.toFixed(2)}→${pred.toFixed(2)}`;
      });
      console.log(`    ${how.padEnd(9)} chi² ${chi.toFixed(1).padStart(6)} over ${rows.length}:  ${parts.join("  ")}`);
    }
  }
  const t0 = S.age_at(0) / 3.15576e16, z2 = S.age_at(2) / 3.15576e16;
  console.log(`\n  the ages: now ${t0.toFixed(2)} Gyr, at z = 2 ${z2.toFixed(2)} Gyr - a_0 by the age ${(t0 / z2).toFixed(2)}x today's there, by H(z) ${(S.hubble_at(2) / S.hubble0).toFixed(2)}x`);
  Deno.exit(0);
}

if (Deno.env.get("RAY_ONLY") === "lift") {
  const upto = plan.tabled_at[0];
  const measuredTasks = tasks.slice(0, 4 * upto);
  const sOut = blank(upto);
  await run(PULL, [u32(upto, S.NSUB, S.NPHI, 1), upload(new Float32Array(measuredTasks)), sOut], upto, 1 << 13);
  const spulls = await read(sOut, upto);
  const ann = new physics.Annulus({ inner: measuredTasks[1], outer: measuredTasks[2], thick: measuredTasks[3] });
  worst("PULL, what arrives", [[ann.arrives(measuredTasks[0], S.NSUB, S.NPHI), spulls[0]]], 2e-3);
  plan.arrive(Array.from(spulls));
  const [k1, k2per, slope, v, rate, sf] = S.lift_coefficients(physics.G, Math.round(deg));
  console.log(`\n  off the chain and the medium at DEG ${Math.round(deg)}: |S'| = ${slope.toFixed(4)}, v = ${v.toFixed(4)}, the meeting rate ${rate.toFixed(4)}, sigma F = ${sf}`);
  console.log(`    (1) record held at the far field's:  a_0 -> a_0 + ${k1.toFixed(4)} g_s   (nothing to choose)`);
  console.log(`    (2) record settled where it stands:  a_0 -> a_0 + ${k2per.toFixed(4)} n-bar g_s   (n-bar, the world's matter, at most 1)`);
  const pct = (dex: number) => `${(100 * (10 ** dex - 1)).toFixed(1)}%`;
  for (const [label, a0si] of [["a_0 the chain's (DEG 18)", plan.a0_si], ["a_0 the data's 1.2e-10", 1.2e-10]] as [string, number][]) {
    const a0 = a0si / S.UNIT_G;
    const show = (name: string, k: number) => { const [rms, mid] = plan.lift_test(k, a0); console.log(`    ${name.padEnd(40)} rms ${pct(rms).padStart(7)}   middle ${(mid >= 0 ? "+" : "") + pct(mid)}`); };
    console.log(`\n  SPARC, ${label}, at SPARC's own freedoms:`);
    show("no lift (a_0 the same everywhere)", 0);
    show(`(1) kappa ${k1.toFixed(3)}`, k1);
    for (const nbar of [1, 0.21, 1e-2, 1e-4, 1e-8]) show(`(2) n-bar ${nbar}, kappa ${(k2per * nbar).toExponential(2)}`, k2per * nbar);
  }
  /* Earth's orbit: what arrives is the Sun's own pull, and planetary ephemerides hold gravity there to ~1e-10 */
  const gN = physics.Sparc.G_NEWTON * physics.Sparc.MSUN / (1.495978707e11) ** 2;
  /* the chain's own F_g in closed form: the measured law's table stops at 1e4 a_0, and an orbit sits at ~1e8 */
  const Fg = (a: number) => gN / 2 + Math.sqrt(gN * gN / 4 + gN * a);
  const at = (k: number) => Fg(plan.a0_si + k * gN) / Fg(plan.a0_si) - 1;
  console.log(`\n  Earth's orbit (g_N = ${gN.toExponential(3)} m/s^2): gravity off by (1) ${at(k1).toExponential(2)}; (2) at n-bar 1: ${at(k2per).toExponential(2)}, 0.21: ${at(k2per * 0.21).toExponential(2)}, 1e-4: ${at(k2per * 1e-4).toExponential(2)}, 1e-8: ${at(k2per * 1e-8).toExponential(2)}; the ephemerides allow ~1e-10`);
  Deno.exit(0);
}
const repro: number[] = plan.repro;
const sortedRepro = [...repro].sort((a, b) => a - b);
for (const j of repro.map((r, j) => [r, j]).sort((a, b) => b[0] - a[0]).slice(0, 5).map(p => p[1])) {
  const rs = plan.rows[j], at = plan.at_rows[j];
  const sp = (g: number, R: number) => Math.sign(g) * Math.sqrt(Math.abs(g * R));
  const off = rs.map((row: number[], i: number) => [Math.abs(sp(at[i][0], row[0]) - row[4]), Math.abs(sp(at[i][1], row[0]) - row[3]), i]);
  const w = off.reduce((a: number[], b: number[]) => Math.max(b[0], b[1]) > Math.max(a[0], a[1]) ? b : a);
  const i = w[2];
  console.log(`    ${physics.Sparc.names[plan.ids[j]].padEnd(12)} ${rs.length} radii; worst at R ${rs[i][0]} (#${i}): disc ${sp(at[i][0], rs[i][0]).toFixed(1)} vs ${rs[i][4]}, gas ${sp(at[i][1], rs[i][0]).toFixed(1)} vs ${rs[i][3]}`);
}
console.log(`  the laid galaxies pull as SPARC's do: worst speed off at a measured radius over the galaxy's top, median ${(100 * sortedRepro[G >> 1]).toFixed(2)}%, 90th ${(100 * sortedRepro[Math.floor(G * 0.9)]).toFixed(2)}%, worst ${(100 * sortedRepro[G - 1]).toFixed(2)}% (${physics.Sparc.names[plan.ids[repro.indexOf(sortedRepro[G - 1])]]})`);

/* LAW: what is felt at every measured and table radius, at a set of freedoms */
const points = new Float32Array(plan.points);
const np = points.length / 6;
const pointsBuf = upload(points);
const lawAt = async (fitted: boolean) => {
  const out = blank(np);
  await run(LAW, [u32(np), lawBuf, pointsBuf, upload(new Float32Array(plan.nuisances(fitted))), out], np);
  return read(out, np);
};
const felt0 = await lawAt(false);
worst("LAW", [0, np >> 2, np >> 1, np - 1].map(i => {
  const gN = physics.Sparc.YD * points[6 * i + 2] + physics.Sparc.YB * points[6 * i + 4] + points[6 * i + 3];
  return [plan.felt(gN), felt0[i]] as [number, number];
}).filter(([c]) => c !== 0), 1e-3);

/* FIT: the data's freedoms, a wide grid and then a fine one about each galaxy's best */
plan.begin_fit;
const fitPoints = upload(new Float32Array(plan.fit_points));
const pass = async (n: number, last: boolean) => {
  const C = n ** 4;
  const searches = new Float32Array(plan.searches);
  const lp = blank(G * C), best = blank(2 * G);
  await run(FIT, [u32(G, n), lawBuf, fitPoints, upload(searches), lp], G * C, 1 << 18);
  await run(BEST, [u32(G, C), lp, best], G);
  const got = await read(best, 2 * G);
  /* the device's posterior against the CPU's at a galaxy's best */
  const checks: [number, number][] = [];
  for (const j of [0, G >> 1, G - 1]) if (got[2 * j + 1] > -1e29) checks.push([plan.logpost(j, plan.combo(j, Math.round(got[2 * j]), n)), got[2 * j + 1]]);
  worst(`FIT ${n}⁴`, checks, 1e-3);
  plan.settle_fit(Array.from(got), n, last);
  lp.destroy(); best.destroy();
};
await pass(S.GRID, false);
await pass(S.FINE, true);
console.log(`  FIT                the data's freedoms searched, ${G} galaxies (${secs()})`);
const felt1 = await lawAt(true);

/* STARS: every galaxy's tracers followed on its field at SPARC's own freedoms */
const T: number = S.TABLE;
const measuredPoints = np - G * T;
const tableFelt = Array.from(felt0.slice(measuredPoints));
const runs = new Float32Array(plan.runs(tableFelt));
const NS: number = S.STARS, FR: number = S.FRAMES, films: number = plan.film_ids.length;
const follow = async (label: string, seeds: number[], table: number[], runInfo: number[], per: number, galaxies: number, most: number, frameFloats: number) => {
  const n = galaxies * per;
  const state = upload(new Float32Array(seeds));
  const frames = blank(Math.max(4, frameFloats));
  const tableBuf = upload(new Float32Array(table));
  const runsBuf = upload(new Float32Array(runInfo));
  await run(STARS.START, [u32(n, per, T, 0, 0, FR), lawBuf, tableBuf, runsBuf, state, frames], n);
  for (let k = 0; k < most; k += S.CHUNK) {
    await run(STARS.STEP, [u32(n, per, T, k, Math.min(most, k + S.CHUNK), FR), lawBuf, tableBuf, runsBuf, state, frames], n);
    Deno.stdout.writeSync(new TextEncoder().encode(`\r  ${label.padEnd(18)} ${Math.min(most, k + S.CHUNK)} of ${most} steps (${secs()})   `));
  }
  console.log("");
  return { state: await read(state, n * 10), frames: await read(frames, frameFloats) };
};
/* the tracers the curves are read off: evenly in radius, every galaxy */
const measured = await follow("STARS", plan.seeds, tableFelt, Array.from(runs), NS, G, plan.most_steps, 0);
const stars = measured.state;
/* and the filmed galaxies' own stars, laid where their light is, from the moment the picture was taken */
const filmSeeds: number[] = plan.film_seeds;
const filmRuns: number[] = plan.film_runs(tableFelt);
const NF: number = S.FILM_STARS;
const filmed = await follow("FILM", filmSeeds, plan.film_table(tableFelt), filmRuns, NF, films, plan.most_film_steps, films * NF * FR * 2);
const film = filmed.frames;
plan.film_ids.forEach((g: number, k: number) => console.log(`  ${physics.Sparc.names[g].padEnd(12)} stars laid from ${plan.film_sources[k]}${Number.isFinite(plan.film_angles[k]) ? `, major axis at ${plan.film_angles[k].toFixed(0)}°` : ""}; ${plan.film_times[k].toFixed(0)} Myr filmed`));

plan.save(Array.from(felt0), Array.from(felt1), Array.from(stars), Array.from(film));

/* what the run says, in a few numbers: the sample's miss, what the tracers read against the circles, the freedoms the data asked for */
{
  const sim = physics.Measured.of("galaxy.simulated");
  const C = sim.columns, H = sim.header;
  const pct = (dex: number) => `${(100 * (10 ** dex - 1)).toFixed(1)}%`;
  const med = (xs: number[]) => { const s = xs.filter(Number.isFinite).sort((a, b) => a - b); return s.length ? s[s.length >> 1] : NaN; };
  const bias: number[] = [], bias1: number[] = [], drift: number[] = [], driftAll: number[] = [];
  for (let i = 0; i < sim.rows; i++) {
    if (C.kept[i] > 0 && C.v0[i] > 0) { bias.push(Math.log10(C.v0[i] / C.Vobs[i])); bias1.push(Math.log10(C.v1[i] / C.Vobs[i])); }
    if (Number.isFinite(C.vs[i]) && C.v0[i] > 0) { driftAll.push(C.vs[i] / C.v0[i]); if (C.kept[i] > 0) drift.push(C.vs[i] / C.v0[i]); }
  }
  const S0 = physics.Sparc.sample.columns;
  const ys = H.Y_disk as number[], ds = (H.D as number[]).map((d, j) => d / S0.D[H.ids[j]]), is = (H.Inc as number[]).map((v, j) => v - S0.Inc[H.ids[j]]);
  console.log(`  the sample, ${bias.length} kept radii: ${pct(physics.Galaxies.sample_off(false))} rms off (median ${bias.length ? (med(bias) >= 0 ? "+" : "") + pct(med(bias)) : "—"}) at the published Υ, D, i; ${pct(physics.Galaxies.sample_off(true))} (median ${(med(bias1) >= 0 ? "+" : "") + pct(med(bias1))}) with them fitted`);
  const quart = (xs: number[], d: number) => { const s = xs.filter(Number.isFinite).sort((a, b) => a - b); return `${s[s.length >> 2].toFixed(d)} / ${s[s.length >> 1].toFixed(d)} / ${s[(3 * s.length) >> 2].toFixed(d)}`; };
  const usable = (H.ids as number[]).map((g: number, j: number) => physics.Sparc.usable(g) ? j : -1).filter((j: number) => j >= 0);
  const on = (xs: number[]) => usable.map((j: number) => xs[j]);
  console.log(`  the freedoms asked for, quartiles over the ${usable.length} usable galaxies: Υ_disk ${quart(on(ys), 3)} (SPARC 0.5), D/D₀ ${quart(on(ds), 3)}, i − i₀ ${quart(on(is), 2)}°`);
  console.log(`  the tracers against the circles (stir ${S.SIGMA} km/s): median v_tracers / v_circle ${med(driftAll).toFixed(4)} over ${driftAll.length} radii, ${med(drift).toFixed(4)} over the kept ones`);
}

/* EVERY GALAXY THERE COULD BE: the unit disc summed once, then every galaxy scaled from it, read on every lattice */
const shapeTasks: number[] = S.shape_tasks;
const shapePulls = await pullOf(shapeTasks);
const shape = S.shape_of(Array.from(shapePulls));
const possible = new Float32Array(S.possible_points(shape));
const npos = possible.length / 6;
const possibleBuf = upload(possible);
const degs: number[] = space.header.degs;
const a0s: number[] = [], bins: any[] = [];
for (const d of degs) {
  const a0 = physics.Galaxies.a0_at(d) / S.UNIT_G;
  const out = blank(npos);
  await run(LAW, [u32(npos), lawBuf, possibleBuf, upload(new Float32Array([1, 1, a0, 0])), out], npos);
  const felt = await read(out, npos);
  out.destroy();
  a0s.push(a0 * S.UNIT_G);
  bins.push(S.binned(Array.from(possible), Array.from(felt)));
}
S.save_possible(degs, a0s, bins);
console.log(`  every galaxy there could be: ${npos} (galaxy, radius) pairs on ${degs.length} lattices (${secs()})\n`);

}

/* GALAXIES LEFT TO THEMSELVES (Formed.ray): every star pulled by every other through the law, from smooth to whatever forms */
{
  const F = physics.Formed;
  const formed = new F({ deg });
  /* RAY_FORMED_NEWTON=1: the control, the law off (a quick look only - nothing is saved unless every frame runs) */
  if (Deno.env.get("RAY_FORMED_NEWTON") === "1") { formed.newton = true; console.log("  FORMED             the control: the law off, every pull as it arrives"); }
  const K = await compile(F.kernel, ["ACCEL", "KICKDRIFT", "KICK"]);
  const total: number = formed.discs_n * F.N;
  const seeds = new Float32Array(formed.seeds);
  const X = upload(seeds), A = blank(total * 4), Cb = upload(new Float32Array(formed.constants));
  /* ACCEL runs in pieces of `piece` stars, each with its own P (P[7] the first star): one bind group a piece, made once */
  const bindAt = (k: any, off: number) => device.createBindGroup({ layout: k.group, entries: [upload(new Uint32Array([total, F.N, formed.discs_n, 0, 0, 0, 0, off])), lawBuf, Cb, X, A].map((buffer, binding) => ({ binding, resource: { buffer } })) });
  const leap = { KICKDRIFT: bindAt(K.KICKDRIFT, 0), KICK: bindAt(K.KICK, 0) };
  let piece = Math.min(total, 2048);
  let pieceMs = Infinity;
  let accels: { off: number; bind: any; n: number }[] = [];
  const cut = () => { accels = []; for (let off = 0; off < total; off += piece) accels.push({ off, bind: bindAt(K.ACCEL, off), n: Math.min(piece, total - off) }); };
  cut();
  /* one submission: the named passes, ACCEL as every piece; then the same rest as every other submission */
  const passes = async (names: string[]) => {
    device.pushErrorScope("validation");
    const enc = device.createCommandEncoder();
    const one = (name: string, bind: any, groups: number) => {
      const pass = enc.beginComputePass();
      pass.setPipeline(K[name].pipe); pass.setBindGroup(0, bind);
      pass.dispatchWorkgroups(Math.min(groups, 1024), Math.ceil(groups / 1024));
      pass.end();
    };
    for (const name of names) {
      if (name === "ACCEL") for (const a of accels) one(name, a.bind, a.n / F.TILE);
      else one(name, (leap as any)[name], Math.ceil(total / 64));
    }
    const t0 = performance.now();
    device.queue.submit([enc.finish()]);
    await device.queue.onSubmittedWorkDone();
    const bad = await device.popErrorScope();
    if (bad) throw new Error(`galaxy.formed: the device refused it: ${bad.message}`);
    await rest(t0, "galaxy.formed");
    return performance.now() - t0;
  };
  /* a step must stay short: time one piece of ACCEL alone and cut the pieces finer until one takes under 30 ms, then a step is one submission only if all of it fits in 60 */
  for (;;) {
    const ms = await (async () => { const keep = accels; accels = [keep[0]]; const t = await passes(["ACCEL"]); accels = keep; return t / 2; })();
    if (ms < 30 || piece <= F.TILE) { pieceMs = ms; console.log(`  FORMED             ${piece} stars a piece of the pull: ${ms.toFixed(1)} ms, ${accels.length} pieces a step`); break; }
    piece = Math.max(F.TILE, piece / 2);
    cut();
  }
  /* the whole pull, piece by piece, each its own submission until the step is known to fit */
  const pullAll = async () => { for (const a of accels.slice()) { const keep = accels; accels = [a]; await passes(["ACCEL"]); accels = keep; } };
  await pullAll();
  const acc = await read(A, total * 4);
  worst("ACCEL", [0, F.N >> 1, total - 1].flatMap(i => { const c = formed.accel_cpu(Array.from(seeds), i); return [[c[0], acc[4 * i]], [c[2], acc[4 * i + 2]]] as [number, number][]; }), 2e-3);
  device.queue.writeBuffer(X, 0, new Float32Array(formed.launch(Array.from(seeds), Array.from(acc))));
  await pullAll();
  /* RAY_FORMED_FRAMES=n stops after n frames (a quick look; nothing is saved) */
  const upTo = Number(Deno.env.get("RAY_FORMED_FRAMES") ?? F.FRAMES);
  const every = Math.max(1, Math.floor(F.STEPS / F.FRAMES));
  /* how each disc stands: its middle, its momentum per star and its half-mass radius - a disc that drifts or flies apart says so here */
  const look = (x: Float32Array, f: number) => {
    const parts: string[] = [];
    for (let g = 0; g < formed.discs_n; g++) {
      let cx = 0, cy = 0, px = 0, py = 0;
      const rs: number[] = [];
      for (let k = 0; k < F.N; k++) { const i = g * F.N + k; cx += x[4 * i]; cy += x[4 * i + 1]; px += x[4 * i + 2]; py += x[4 * i + 3]; }
      cx /= F.N; cy /= F.N; px /= F.N; py /= F.N;
      for (let k = 0; k < F.N; k++) { const i = g * F.N + k; rs.push(Math.hypot(x[4 * i] - cx, x[4 * i + 1] - cy)); }
      rs.sort((a, b) => a - b);
      parts.push(`disc ${g}: middle (${cx.toFixed(2)}, ${cy.toFixed(2)}) kpc, momentum (${px.toFixed(2)}, ${py.toFixed(2)}) km/s a star, half-mass r ${rs[F.N >> 1].toFixed(2)} kpc`);
    }
    console.log(`\n  t ${(f * every * F.DT * S.MYR).toFixed(0)} Myr: ${parts.join("; ")}`);
  };
  const first = await read(X, total * 4);
  look(first, 0);
  const frames: number[][] = [Array.from(formed.binned(Array.from(first)))];
  for (let f = 1; f < Math.min(F.FRAMES, upTo); f++) {
    /* one step a submission: every star's pull summed is heavy, and a long submission is taken for a hung device */
    for (let k = 0; k < every; k++) {
      if (accels.length * pieceMs <= 60) await passes(["KICKDRIFT", "ACCEL", "KICK"]);
      else { await passes(["KICKDRIFT"]); await pullAll(); await passes(["KICK"]); }
    }
    const now = await read(X, total * 4);
    if (f % 10 === 0 || f < 4) look(now, f);
    frames.push(Array.from(formed.binned(Array.from(now))));
    Deno.stdout.writeSync(new TextEncoder().encode(`\r  FORMED             frame ${f + 1} of ${F.FRAMES}, ${(f * every * F.DT * S.MYR / 1000).toFixed(2)} Gyr (${secs()})   `));
  }
  console.log("");
  if (frames.length === F.FRAMES) formed.save(frames);
  console.log(`  galaxies left to themselves: ${formed.discs_n} discs of ${F.N} stars, ${(F.STEPS * F.DT * S.MYR / 1000).toFixed(1)} Gyr (${secs()})`);
}
console.log(`  the longest any one submission held the device: ${longest.toFixed(1)} ms (limit ${LONGEST_MS})\n`);
