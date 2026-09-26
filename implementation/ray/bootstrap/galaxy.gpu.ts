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
  let seed = 12345; const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return (seed + 0.5) / 2147483648; };
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
  console.log(`  longest submission ${w.longest.toFixed(1)} ms`);
  Deno.exit(0);
}

/*
 * RAY_ONLY=medium-galaxy: A GALAXY IN THE MEDIUM ITSELF, FILMED (Galaxies.medium, visual galaxy.medium). RAY_STARS stars
 * (exponential surface density, scale RAY_RD c-bar) laid at rest in a RAY_SIDE box, every star its own body and every
 * step local (how.local); the field let stand with them held (Medium.stand), and each star launched circling at the
 * pull the medium itself gives it there - sqrt(g R), with a spread of RAY_SIGMA of it - then left to the medium for
 * RAY_FRAMES frames of RAY_TPF ticks. The total mass is set, off one lone body's pull measured in the same medium, so
 * the disc circles at about RAY_SPEED c-bar a tick at one scale length: well below the light a tick carries
 */
if (Deno.env.get("RAY_ONLY") === "medium-galaxy") {
  const webgpu: any = await import(join(repo, "languages", "physics.ts", "src", "webgpu.ts"));
  const A = 96, K = 3, DEG = Math.round(deg), D = physics.G.lattice.D;
  const SIDE = Number(Deno.env.get("RAY_SIDE") ?? 361), STARS = Number(Deno.env.get("RAY_STARS") ?? 100000);
  const RD = Number(Deno.env.get("RAY_RD") ?? 8), SPEED = Number(Deno.env.get("RAY_SPEED") ?? 0.03), SIGMA = Number(Deno.env.get("RAY_SIGMA") ?? 0.05);
  const FRAMES = Number(Deno.env.get("RAY_FRAMES") ?? 120), TPF = Number(Deno.env.get("RAY_TPF") ?? 40), GRID = 128;
  const how = { local: true, slots: Number(Deno.env.get("RAY_SLOTS") ?? 4), paced: true };
  const mid = (SIDE - 1) / 2, span = mid / K - 2;
  const t0 = performance.now();
  /* what one body of unit mass pulls with, a little out, in a small box of the same medium: the scale the mass is set by */
  const CAL = 121, cmid = (CAL - 1) / 2, rcal = 8;
  const lone = await webgpu.medium(CAL, A, K, 1, physics.G, DEG, D, { ...how, apart: 1 });
  const unit = new physics.Hole({ x: cmid, y: cmid, mx: 1, ways: 1 }); unit.tag = 0; unit.moves = false; unit.px = 0; unit.py = 0;
  lone.add(unit);
  await lone.stand();
  const p1 = -(await lone.probe([[cmid + rcal * K, cmid, 0]]))[0][0];
  /* an exponential disc holds 0.264 of itself within one scale length; that much pulls about as one body there */
  const pRD = p1 * (rcal / RD) ** (D - 1);
  const MASS = SPEED * SPEED / RD / (0.264 * pRD), m = MASS / STARS;
  console.log(`\n  a galaxy in the medium: ${STARS} stars, R_d ${RD} c-bar, box ${SIDE} (K ${K}, DEG ${DEG}); a unit mass pulls ${p1.toExponential(3)} at ${rcal} c-bar, so the disc weighs ${MASS.toExponential(3)} (${m.toExponential(3)} a star) to circle near ${SPEED} c-bar a tick`);
  /* the disc, seeded so a run is the run again: radius off R e^(-R/RD), angle uniform */
  let seed = 2026; const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return (seed + 0.5) / 2147483648; };
  const gauss = () => Math.sqrt(-2 * Math.log(rnd())) * Math.cos(2 * Math.PI * rnd());
  const w = await webgpu.medium(SIDE, A, K, 1, physics.G, DEG, D, { ...how, apart: STARS });
  for (let s = 0; s < STARS; s++) {
    const r = Math.min(-RD * Math.log(rnd() * rnd()), span - 1), th = 2 * Math.PI * rnd();
    const h = new physics.Hole({ x: mid + r * K * Math.cos(th), y: mid + r * K * Math.sin(th), mx: m, ways: 1 });
    h.tag = 0; h.moves = false; h.px = 0; h.py = 0;
    w.add(h);
  }
  await w.stand();
  const pulls = await w.leans();
  /* each star launched circling at what the medium pulls it with where it stands */
  let vsum = 0, vn = 0;
  w.holes.forEach((h: any, s: number) => {
    const dx = (h.x - mid) / K, dy = (h.y - mid) / K, R = Math.hypot(dx, dy);
    if (R <= 0) return;
    const g = -(pulls[s][0] * dx + pulls[s][1] * dy) / R;
    const v = Math.sqrt(Math.max(0, g * R));
    if (Math.abs(R - RD) < 1) { vsum += v; vn++; }
    const vx = -v * dy / R + SIGMA * v * gauss(), vy = v * dx / R + SIGMA * v * gauss();
    h.px = h.mass * vx; h.py = h.mass * vy;
    h.momentum = new physics.Vector({ components: [h.px, h.py] });
    h.moves = true;
  });
  w.push();
  const speedRD = vn ? vsum / vn : 0;
  console.log(`  launched: at R_d they circle at ${speedRD.toFixed(4)} c-bar a tick (the field stood in ${((performance.now() - t0) / 1000).toFixed(0)}s)`);
  /* star counts on a GRID x GRID face-on picture, span c-bar either side of the box's middle */
  const density: number[] = [], ticks: number[] = [];
  const shoot = async () => {
    await w.sync();
    const grid = new Float32Array(GRID * GRID);
    for (const h of w.holes) {
      const gx = Math.floor(((h.x - mid) / K / span + 1) / 2 * GRID), gy = Math.floor(((h.y - mid) / K / span + 1) / 2 * GRID);
      if (gx >= 0 && gx < GRID && gy >= 0 && gy < GRID) grid[gy * GRID + gx] += 1;
    }
    for (const v of grid) density.push(v);
    ticks.push(w.t);
  };
  await shoot();
  for (let f = 1; f < FRAMES; f++) {
    for (let t = 0; t < TPF; t++) await w.tick();
    await shoot();
    if (f % 10 === 0) console.log(`  frame ${f}/${FRAMES}, tick ${w.t}, ${((performance.now() - t0) / 1000).toFixed(0)}s, longest submission ${w.longest.toFixed(1)} ms`);
  }
  physics.Measure.save("galaxy.medium", ["density"], { density }, {
    names: ["a disc in the medium"], mass: [MASS], scale: [RD], span: [span], stars: STARS, frames: FRAMES, grid: GRID, ticks,
    deg: DEG, side: SIDE, speed: speedRD, sigma: SIGMA, tpf: TPF,
    about: "a disc of stars in the medium itself, every star its own body, every step local (galaxy.gpu.ts RAY_ONLY=medium-galaxy): star counts on grid x grid cells, span c-bar either side of the middle, frame after frame",
  });
  console.log(`  written to visuals/galaxy.medium (${((performance.now() - t0) / 1000).toFixed(0)}s); draw it: npx ray visuals galaxy.medium`);
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
