/**
 * `deno run --unstable-webgpu --allow-all record.gpu.ts <repo> <id>` - one film's world, run and written to
 * `visuals/<id>/frames.f32` + `frames.json`, exactly as the CPU recording would be. The world is the MEDIUM
 * (Medium.ray): the continuous equation the prover derives (`vacuum.equation`, read through Aggregate.ray),
 * integrated on a box - on the device where the WebGPU runtime offers it (`medium` in webgpu.ts), on the
 * generated CPU classes otherwise. The frame's readings and channels are the Ray recording's own
 * (`begin_frame`, `take`, `finish` of Panel.ray's FieldRecording); only the ticking is driven from here.
 *
 * Before the film, what the derivation says is printed: the settled vacuum, the record a body leaves, the
 * pull by radius, and the launch each film read off it (`Setup.found`: R, v, the pull at R).
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [repo, id] = Deno.args;
const OUT = join(repo, "visuals");

/* what is on disk, for `Measured.of` - the catalogues a setup reads (solar-inner) */
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

const { VISUALS } = await import(join(OUT, "visuals.ts"));
const physics: any = await import(join(repo, "languages", "physics.ts", "index.ts"));
const webgpu: any = await import(join(repo, "languages", "physics.ts", "src", "webgpu.ts"));

const v = VISUALS[id]();
/* a diagnostic only: how many headings the line is read on */
if (Deno.env.get("RAY_A")) (v.record?.p ?? {}).A = Number(Deno.env.get("RAY_A"));
const r = v.record, p = r?.p;
if (!p) throw new Error(`${id} has no field recording to run on a device`);

/* WHAT THE DERIVATION SAYS, before anything runs: the chain `vacuum.equation` ends in, evaluated (Aggregate.ray) */
const law = physics.Aggregate.of(physics.G, p.DEG, p.D);
const f = (x: number, d = 4) => Number.isFinite(x) ? x.toFixed(d) : String(x);
console.log(`  ${id.padEnd(26)} the settled vacuum: rho ${f(law.rho_inf)}, record ${f(law.nf_inf)} (DEG ${p.DEG}); a meeting is ${f(law.fold_weight, 1)} rays a fold`);
console.log(`  ${id.padEnd(26)} the record every body leaves: ${law.says("record")}`);
console.log(`  ${id.padEnd(26)} one line for every body: ${law.says("line")}`);
const radii = [0.5, 1, 2, 3, 4, 6, 8, 12, 18, 24, 36, 48];
console.log(`  ${id.padEnd(26)} the pull of a unit mass by radius (c-bar a tick a tick, toward it): ${radii.map((R: number) => `${R}: ${Number.isFinite(law.pull(1, R)) ? law.pull(1, R).toExponential(2) : "-"}`).join(", ")}`);
/* Kepler's own reading of the launches: v times the root of R is one number where the pull goes as one over R squared */
if ((p.found ?? []).length > 1 && p.found.every((row: number[]) => row.length <= 4)) console.log(`  ${id.padEnd(26)} v·sqrt(R) by body (one number under an inverse-square pull): ${p.found.map((row: number[]) => f(row[1] * Math.sqrt(row[0]), 4)).join(", ")}`);
for (const row of p.found ?? []) console.log(`  ${id.padEnd(26)} launch off the derivation: R ${f(row[0], 2)}, pull there ${Number.isFinite(row[2]) ? row[2].toExponential(3) : "-"}, ${row.length > 4 ? `speed at the farthest ${row[3] ? f(row[1]) : "none (no orbit there: let go at rest)"}, to fall in to ${f(row[4], 2)}` : `circling speed ${row[3] ? f(row[1]) : "none (the record falls toward the mass: let go at rest)"}`} c-bar a tick`);

/*
 * WHAT THE MEDIUM IS SET TO RUN ON, for trying one reading against another: RAY_VACUUM=1 puts the settled vacuum
 * under what the bodies add, RAY_FACING=1 takes the facing factor off the closure rather than for one, and
 * RAY_ENHANCE=1|2 reads what is felt off what arrives as the chain's F_g does, with the vacuum's a_0 or the one
 * where the body stands (Medium.vacuum, Medium.facing, Medium.enhance)
 */
const how = {
  vacuum: Deno.env.get("RAY_VACUUM") === "1",
  facing: Deno.env.get("RAY_FACING") === "1",
  enhance: Number(Deno.env.get("RAY_ENHANCE") ?? 0),
  a0_share: Number(Deno.env.get("RAY_A0") ?? 1),
  /* RAY_OWN=1: what a body sends carries its own acceleration; =2: what is felt at a place is enhanced by a_0 over the acceleration THERE (Medium.own) */
  own: Number(Deno.env.get("RAY_OWN") ?? 0),
};
const set_how = (w2: any) => { if (!w2) return w2; w2.vacuum = how.vacuum; w2.facing = how.facing; w2.enhance = how.enhance; w2.a0_share = how.a0_share; w2.own = how.own; return w2; };
/* THE WORLD: the medium on the device where the runtime has it, on the CPU classes otherwise */
let w: any = null;
const device = typeof webgpu.medium === "function" && Deno.env.get("RAY_CPU_RECORD") !== "1";
const lay = async () => {
  w = device ? await webgpu.medium(p.side, p.A, p.K, p.tags, physics.G, p.DEG, p.D, how) : set_how(physics.G.medium(p.side, p.A, p.K, p.DEG, p.tags, p.D));
  /* the bodies are put down held, the medium is older than the film by BURN ticks, and then they are let go with what they were launched with (Panel.lay) */
  const placed = p.place(p);
  /* a diagnostic run only: RAY_EMPTY=1 lays no body, to read the vacuum alone */
  for (const b of Deno.env.get("RAY_EMPTY") === "1" ? [] : Deno.env.get("RAY_ONE") === "1" ? placed.slice(0, 1) : placed) {
    const h = new physics.Hole({ x: p.centre + b.x * p.K, y: p.centre + b.y * p.K, mx: b.mx * Number(Deno.env.get("RAY_MASS") ?? 1) * (b === placed[1] ? Number(Deno.env.get("RAY_MASS1") ?? 1) : 1), ways: b.ways });
    h.tag = b.tag; h.moves = false; h.px = 0; h.py = 0;
    w.add(h);
  }
  const trace: string[] = [];
  if (p.RANGE === "instant") { const got = typeof w.settle === "function" ? w.settle() : w.settle; if (got && typeof got.then === "function") await got; }
  else for (let i = 0; i < p.BURN; i++) {
    await step();
    if (Deno.env.get("RAY_PROFILE") === "1" && (i % 10 === 9)) {
      const fr = await snapshot();
      const at = (k: number) => { const v = fr.rho(w.at(Math.min(p.side - 1, Math.round(p.centre + k * p.K)), p.centre)); return (v > 0.5 ? `1-${(1 - v).toExponential(2)}` : v.toExponential(2)) + ` rec ${(fr.record_above(w.at(Math.min(p.side - 1, Math.round(p.centre + k * p.K)), p.centre)) + law.nf_inf).toExponential(3)}`; };
      trace.push(`t${i + 1}: rho at 0 ${at(0)}, 20 ${at(20)}, 30 ${at(30)}, 36 ${at(36)}, 39 ${at(39)}, 40 ${at(40)}`);
    }
  }
  if (trace.length) console.log(`  ${id.padEnd(26)} the first ticks (middle cell, the one beside it, 30 c-bar out):\n    ${trace.join("\n    ")}`);
  /* bodies launched on an orbit read their speed off the pull they stand in, after one held tick more (Panel.lay, Setup.orbit) */
  const orbiting = placed.some((b: any) => b.launch === "orbit");
  if (orbiting) await step();
  /* the pull between a body and the rest of them, from its nearest to its farthest, as the medium gives it (Setup.pulls_between) */
  const reading = async (k: number, b: any) => {
    const h = w.holes[k], rest = physics.Setup.rest_of(w.holes, k);
    const asks = physics.Setup.where_between(h, rest, b.ecc, p.K, 64);
    const zown = w.plane_of ? w.plane_of(h) : (h.tag ?? 0);
    if (typeof w.probe !== "function") return physics.Setup.pulls_between(w, h, rest, b.ecc, p.K, 64);
    const got = await w.probe(asks.map((at: number[]) => [at[1], at[2], zown]));
    return got.map((g: number[], i: number) => {
      const dx = rest[1] - asks[i][1], dy = rest[2] - asks[i][2], d = Math.hypot(dx, dy) || 1;
      return [asks[i][0], (g[0] * dx + g[1] * dy) / d];
    });
  };
  const give = (k: number, v: number[]) => {
    const h = w.holes[k];
    h.px = v[0]; h.py = v[1]; h.momentum = new physics.Vector({ components: [v[0], v[1]] });
  };
  /* which of them will go and which will be held: what a body is thrown about is read off that (Setup.rest_of) */
  for (const [k, b] of placed.entries()) if (w.holes[k]) w.holes[k].moves = b.moves;
  const rests: Record<number, number[][]> = {};
  const throws: Record<number, number[]> = {};
  for (const [k, b] of placed.entries()) {
    const h = w.holes[k]; if (!h) continue;
    if (b.launch === "orbit" && Deno.env.get("RAY_ECC")) b.ecc = Number(Deno.env.get("RAY_ECC"));
    throws[k] = [b.px, b.py];
    if (b.launch !== "orbit") continue;
    rests[k] = await reading(k, b);
    throws[k] = physics.Setup.orbit(h, physics.Setup.rest_of(w.holes, k), rests[k], b.ecc, b.px, b.py, p.K, 0);
    give(k, throws[k]);
  }
  /*
   * and again with the field as it stands with every body going that fast: a body sends less for its own going and its
   * own rays stand in what it reads, so what that took off the pull is the slope the throw is read with (Setup.slower)
   */
  if (orbiting) {
    if (typeof w.push === "function") w.push();
    const again = typeof w.seed === "function" ? w.seed() : w.seed;
    if (again && typeof again.then === "function") await again;
    for (const [k, b] of placed.entries()) {
      const h = w.holes[k]; if (!h || b.launch !== "orbit") continue;
      const rest = physics.Setup.rest_of(w.holes, k);
      const moving = await reading(k, b);
      const at = rests[k].length - 1;
      const vrel = Math.hypot(h.px, h.py) / h.mass * (h.mass + rest[0]) / rest[0];
      const kappa = physics.Setup.slower(rests[k][at][1], moving[at][1], vrel);
      throws[k] = physics.Setup.orbit(h, rest, rests[k], b.ecc, b.px, b.py, p.K, kappa);
      give(k, throws[k]);
      if (Deno.env.get("RAY_PULLS") === "1") {
        const got = rests[k], far = got[got.length - 1], near = got[0];
        console.log(`  ${id.padEnd(26)} launch off the medium: b${k} between ${near[0].toFixed(2)} and ${far[0].toFixed(2)} c-bar, pull there ${near[1].toExponential(2)} and ${far[1].toExponential(2)}, going it is ${(100 * kappa * vrel).toFixed(2)}% less, work ${physics.Setup.work(got).toExponential(3)}, speed ${(Math.hypot(throws[k][0], throws[k][1]) / h.mass).toFixed(5)}, on a circle it would be ${Math.sqrt(Math.max(0, far[1] * (h.mass + rest[0]) / rest[0] * far[0])) * rest[0] / (h.mass + rest[0])}`);
      }
    }
  }
  for (const [k, b] of placed.entries()) {
    const h = w.holes[k]; if (!h) continue;
    h.moves = b.moves;
    give(k, throws[k]);
  }
  /* a body is the device's once it is launched: the host says so once, and reads it back where it wants to know */
  if (typeof w.push === "function") w.push();
  /*
   * RAY_SOAK=n: n more ticks before anything is read. A seeded field stands as the source stood when it was seeded,
   * and what a source's own going does to what it sends (Medium.own) is written at the first rung and carried one
   * rung a tick, so nothing of it is out at the far rungs until as many ticks as there are rungs have gone by
   */
  for (let i = 0; i < Number(Deno.env.get("RAY_SOAK") ?? 0); i++) await step();
};
/* one tick: a Ray getter on the CPU classes, an async call on the device */
const step = async () => { const got = typeof w.tick === "function" ? w.tick() : w.tick; if (got && typeof got.then === "function") await got; };
const snapshot = async () => (typeof w.frame === "function" ? await w.frame() : w);
const positions = () => w.holes.map((h: any) => ({ x: (h.x - p.centre) / p.K, y: (h.y - p.centre) / p.K, mx: h.mx, ways: h.ways }));
const where = () => w.holes.map((h: any, k: number) => `b${k} (${((h.x - p.centre) / p.K).toFixed(2)}, ${((h.y - p.centre) / p.K).toFixed(2)}) v (${(h.px_now / h.mass).toFixed(4)}, ${(h.py_now / h.mass).toFixed(4)})`).join("; ");

const names: string[] = r.names, sizes: number[] = r.sizes;
const width = sizes.reduce((n: number, k: number) => n + k, 0);
const flat = new Float32Array(width * v.frames);
const buf: Record<string, Float32Array> = {};
names.forEach((k, i) => { buf[k] = new Float32Array(sizes[i]); });
const t0 = Date.now();
await lay();
console.log(`  ${id.padEnd(26)} ${device ? "on the device" : "on the CPU"}: ${p.side}×${p.side} cells, ${p.A} headings, K ${p.K}, ${p.tags} tags; ${p.RANGE === "instant" ? "every field standing at any range" : `after ${p.BURN} ticks held`}, released: ${where()}`);
/* WHAT THE MEDIUM ITSELF PULLS WITH, held, before release: the lean under each body, and its part along the line to the first other body (positive: toward it) */
const leans = async () => (typeof w.leans === "function" ? await w.leans() : w.holes.map((h: any) => w.lean_under(h)));
{
  const g = await leans();
  console.log(`  ${id.padEnd(26)} the lean under each body, held (c-bar a tick a tick): ${g.map((l: number[], k: number) => {
    const o = w.holes[k === 0 ? 1 : 0], h = w.holes[k];
    const dx = o ? o.x - h.x : 0, dy = o ? o.y - h.y : 0, d = Math.hypot(dx, dy) || 1;
    return `b${k} (${l[0].toExponential(2)}, ${l[1].toExponential(2)}) toward ${((l[0] * dx + l[1] * dy) / d).toExponential(2)}`;
  }).join("; ")}`);
}
/* and along the line through the first two bodies, every two c-bar: the lean along x, the record above the vacuum's, and the density */
if (Deno.env.get("RAY_PROFILE") === "1") {
  /* a diagnostic run only: two more ticks held, and the line read on each - the vacuum beats, so a lean is read over both halves */
  const y = w.holes.length ? Math.round(w.holes[0].y) : p.centre;
  const ks: number[] = [];
  for (let k = -Math.floor(p.side / 2 / p.K); k <= Math.floor(p.side / 2 / p.K); k += 1) ks.push(k);
  const moving = w.holes.map((h: any) => h.moves);
  w.holes.forEach((h: any) => { h.moves = false; });
  if (typeof w.push === "function") w.push();
  const reads: any[] = [];
  for (let n = 0; n < 2; n++) {
    await step();
    const fr = await snapshot();
    reads.push(ks.map(k => { const c = w.at(Math.round(p.centre + k * p.K), y); return c < 0 ? [0, 0, 0, 0] : [fr.pull_x(c), fr.record_above(c), fr.rho(c), fr.arrived(1, c)]; }));
  }
  w.holes.forEach((h: any, k: number) => { h.moves = moving[k]; });
  if (typeof w.push === "function") w.push();
  console.log(`  ${id.padEnd(26)} along the line (c-bar: lean_x on each tick, their mean; record-above; rho):\n    ${ks.map((k, i) => `${k}: ${reads[0][i][0].toExponential(2)} ${reads[1][i][0].toExponential(2)} mean ${((reads[0][i][0] + reads[1][i][0]) / 2).toExponential(2)}; ${reads[0][i][1].toFixed(2)} ${reads[1][i][1].toFixed(2)}; ${reads[0][i][2].toFixed(3)} ${reads[1][i][2].toFixed(3)}; rays ${reads[0][i][3].toExponential(2)}`).join("\n    ")}`);
}
/*
 * THE SAME QUESTION PUT TO THE RULES THEMSELVES (RAY_RECOIL=n). The rules' own world keeps a ray at every heading of
 * every cell, which is what a phase needs and what the medium's one-number-a-distance cannot hold. A body there is
 * touched by one thing only, the recoil of its own emission (`motion.ray`), so: held, carried evenly, and pushed -
 * and what its momentum does of its own accord in each case. The chain says nought, nought, and something at g
 */
if (Deno.env.get("RAY_RECOIL")) {
  const ticks = Number(Deno.env.get("RAY_RECOIL"));
  const side = Number(Deno.env.get("RAY_SIDE") ?? 25);
  const mid = Math.round((side - 1) / 2);
  const ways = Number(Deno.env.get("RAY_WAYS") ?? 2000);
  const run = (start: number, push: number) => {
    const f: any = physics.G.field(side, p.A, 3, 1, 8, 2).thrown(mid, mid, 1, ways, start, 0, 1);
    const h = f.holes[0];
    const drift: number[] = [];
    for (let i = 0; i < ticks; i++) {
      const was = h.px_now;
      f.tick;
      /* what the rules did to it, apart from what we pushed it by */
      drift.push(h.px_now - was);
      if (push) { h.momentum = new physics.Vector({ components: [h.px_now + push, h.py_now] }); }
    }
    const half = Math.floor(drift.length / 2);
    const late = drift.slice(half);
    return { each: late.reduce((a2, b2) => a2 + b2, 0) / (late.length || 1), first: drift.slice(0, 4), v: h.px_now / h.mass };
  };
  console.log(`  ${id.padEnd(26)} the rules' own world, ${side} cells, ${ticks} ticks, a body of ${ways} ways:`);
  /* down where the flips do cancel, so what is measured is the pushing and not the hopping */
  const cases: [string, number, number][] = [["held", 0, 0], ["carried 0.005", 10, 0], ["pushed 0.05", 0, 0.05], ["pushed 0.1", 0, 0.1], ["pushed 0.2", 0, 0.2], ["pushed 0.4", 0, 0.4], ["pushed 0.8", 0, 0.8], ["pushed 1.6", 0, 1.6]];
  for (const [what, start, push] of cases) {
    const got = run(start, push);
    console.log(`    ${what.padEnd(16)} speed ${got.v.toFixed(5)}  its own recoil a tick ${got.each.toExponential(3)}  first ticks ${got.first.map(v => v.toFixed(2)).join(" ")}${push ? `  per what pushed it ${(got.each / push).toExponential(3)}` : ""}`);
  }
  Deno.exit(0);
}

/*
 * THE FORE-AND-AFT IMBALANCE (RAY_PHASE=n). One body, its field read from where it WAS when the ray left it, and the
 * pull on it from its own field - nothing else in the box. The chain says a body at rest and a body at constant speed
 * feel nothing of it (the flips cancel) and an accelerating one does, at a rate that is what a_0 is made of. So:
 * held, carried evenly, and pushed - and what it feels along its own way in each case
 */
if (Deno.env.get("RAY_PHASE")) {
  const ticks = Number(Deno.env.get("RAY_PHASE"));
  const side = Number(Deno.env.get("RAY_SIDE") ?? 41);
  const mid = (side - 1) / 2;
  const run = (speed: number, push: number) => {
    const w2: any = physics.G.medium(side, p.A, p.K, p.DEG, 2, p.D);
    w2.vacuum = true; w2.facing = true; w2.retard = true; w2.phase = Deno.env.get("RAY_NOPHASE") !== "1";
    const h = new physics.Hole({ x: mid, y: mid, mx: Number(Deno.env.get("RAY_MX") ?? 0.2458), ways: 1 });
    h.tag = 1; h.moves = false; h.px = 0; h.py = 0;
    w2.add(h);
    let v = speed;
    for (let i = 0; i < ticks; i++) {
      w2.tick;
      /* carried by hand, so what it feels is not what moved it: evenly, or gaining what it is pushed by every tick */
      v += push;
      h.x += v * p.K;
      h.momentum = new physics.Vector({ components: [v * h.mass, 0] });
    }
    /* what it feels of its OWN field, which is what the flips leave: nothing is left out of this read */
    const g = w2.pull_at(h.x, h.y, -1, h.px_now / h.mass, 0);
    return { along: g[0], across: g[1], v };
  };
  console.log(`  ${id.padEnd(26)} one body on a ${side}-cell box, ${ticks} ticks, read from where it was:`);
  for (const [what, speed, push] of [["held", 0, 0], ["carried evenly", 0.02, 0], ["pushed", 0, 0.0005], ["pushed harder", 0, 0.002]] as [string, number, number][]) {
    const got = run(speed, push);
    console.log(`    ${what.padEnd(16)} speed ${got.v.toFixed(4)}  feels along ${got.along.toExponential(3)}  across ${got.across.toExponential(3)}${push ? `  per what pushed it ${(got.along / push).toExponential(3)}` : ""}`);
  }
  Deno.exit(0);
}

/*
 * WHAT THE VACUUM'S OWN POPULATION DOES (RAY_RHO=n), on a small box run on the CPU classes so the whole of it is the
 * model and nothing of the device's. An empty box must sit where the line nets nought - rho_infinity, which nothing
 * put there - and a body must dent it. What that dent does to the pull is what a_0 is made of
 */
if (Deno.env.get("RAY_RHO")) {
  const ticks = Number(Deno.env.get("RAY_RHO"));
  const side = Number(Deno.env.get("RAY_SIDE") ?? 61);
  const mid = (side - 1) / 2;
  const run = (bodies: number) => {
    const w2: any = physics.G.medium(side, p.A, p.K, p.DEG, 2, p.D);
    w2.vacuum = true; w2.facing = true;
    for (let k = 0; k < bodies; k++) {
      const h = new physics.Hole({ x: mid, y: mid, mx: Number(Deno.env.get("RAY_MX") ?? 0.2458), ways: 1 });
      h.tag = 1; h.moves = false; h.px = 0; h.py = 0;
      w2.add(h);
    }
    for (let i = 0; i < ticks; i++) w2.tick;
    return w2;
  };
  {
    /* what the line nets by occupancy: where it crosses nought is where the vacuum settles, and that must be rho_infinity */
    const probe: any = physics.G.medium(11, p.A, p.K, p.DEG, 2, p.D);
    probe.vacuum = true; probe.facing = true;
    const row = [0, 0.2, 0.4, 0.6, 0.8, 0.9, 0.9499, 0.98, 1].map(r => `${r}: ${probe.nets(r, law.nf_inf).toExponential(3)}`);
    console.log(`  ${id.padEnd(26)} what the rays line nets by occupancy (at the record's own ${law.nf_inf}): ${row.join(", ")}`);
    const bits = ["points", "singles", "meets"].map(k => `${k} ${(probe[k] ?? []).length}`).join(", ");
    console.log(`  ${id.padEnd(26)} the terms it is made of: ${bits}`);
  }
  const empty = run(0);
  const one = run(1);
  const at = (w2: any, r: number) => { const c = w2.at(Math.round(mid + r * p.K), Math.round(mid)); return c < 0 ? NaN : c; };
  console.log(`  ${id.padEnd(26)} rho_infinity ${law.rho_inf.toPrecision(6)}, the record's own ${law.nf_inf.toPrecision(4)}; ${ticks} ticks on a ${side}-cell box`);
  const emptyRho = empty.vac[at(empty, 0)];
  console.log(`  ${id.padEnd(26)} with nothing in it: rho ${emptyRho.toPrecision(6)} (off by ${(emptyRho - law.rho_inf).toExponential(2)}), record ${empty.record_at(at(empty, 0)).toPrecision(4)}`);
  console.log(`  ${id.padEnd(26)} with one body in it, by radius:`);
  let was: number[] | null = null;
  for (let r = 1; r * p.K < (side - 1) / 2 - 2; r *= Math.SQRT2) {
    const c = at(one, r);
    if (!(c >= 0)) continue;
    const g = one.pull_toward(mid + r * p.K, mid, mid, mid, 0);
    let slope = "";
    if (was && was[1] > 0 && g > 0) slope = `r^-${(-Math.log(g / was[1]) / Math.log(r / was[0])).toFixed(3)}`;
    console.log(`    ${r.toFixed(2).padStart(7)} c-bar  rho ${one.vac[c].toPrecision(6)}  dented ${(one.vac[c] - law.rho_inf).toExponential(2)}  record ${one.record_at(c).toPrecision(4)}  pull ${g.toExponential(3)}  ${slope}`);
    was = [r, g];
  }
  Deno.exit(0);
}

/* the chain's own numbers at the settled vacuum, named one by one (RAY_CHAIN=1) */
if (Deno.env.get("RAY_CHAIN")) {
  const want = ["\\rho", "n_{f}", "\\lambda", "v", "\\sigma", "F", "\\omega", "\\nu",
    "the rate space is made", "the space line nets", "a_{0}", "H", "cH", "\\frac{a_{0}}{cH}",
    "what a body puts out", "what a body puts into the medium"];
  const model = new physics.Model({ theory: physics.G });
  const env = model.settled(p.DEG);
  env["D"] = p.D; env["DEG"] = p.DEG;
  console.log(`  ${id.padEnd(26)} the chain at the settled vacuum (DEG ${p.DEG}, D ${p.D}):`);
  for (const name of want) {
    const v = model.value_of(name, env);
    const f = model.fact ? model.fact(name) : null;
    const said = f && f.to ? physics.Expr.show(f.to) : "";
    console.log(`    ${name.padEnd(34)} ${(Number.isFinite(v) ? v.toPrecision(6) : String(v)).padEnd(12)} ${said.slice(0, 120)}`);
  }
  /*
   * and the two the panels live on, by radius for a unit mass: what arrives (the chain's own g_N) and what is felt
   * (its F_g). If the chain gives both regimes, what is felt goes as one over the square where it is strong and
   * turns over where it falls under a_0 - and that is what the medium would then have to reproduce
   */
  const a0 = model.value_of("a_{0}", env);
  console.log(`  ${id.padEnd(26)} a_0 = ${a0.toPrecision(4)}; a unit mass by radius - what arrives, what is felt, and the slope of each:`);
  let was: number[] | null = null;
  for (let R = 0.5; R <= 4096; R *= 2) {
    const gN = law.pull(1, R);
    const felt = model.boost ? model.boost(Math.abs(gN), a0) : NaN;
    let slopes = "";
    if (was && was[1] > 0 && Math.abs(gN) > 0) {
      const sN = -Math.log(Math.abs(gN) / was[1]) / Math.log(R / was[0]);
      const sF = was[2] > 0 && felt > 0 ? -Math.log(felt / was[2]) / Math.log(R / was[0]) : NaN;
      slopes = `arrives r^-${sN.toFixed(2)}   felt r^-${Number.isFinite(sF) ? sF.toFixed(2) : "?"}`;
    }
    console.log(`    R ${R.toFixed(1).padStart(8)}  arrives ${gN.toExponential(3).padStart(11)}  felt ${Number.isFinite(felt) ? felt.toExponential(3).padStart(11) : "-".padStart(11)}  ${slopes}`);
    was = [R, Math.abs(gN), felt];
  }
  Deno.exit(0);
}

/*
 * THE POSSIBILITY SPACE, MEASURED OFF THE MEDIUM (RAY_SPACE=1). The same two axes the galaxy panels carry, filled
 * by running the medium over every freedom a source has HERE: how much mass it is, how it is arranged (one face, or
 * spread over stars), how fast it goes, and how far out it is read. What is proportional to the mass is the point
 * source's own pull at the same radius, so a cell off the diagonal is the medium adding something to that.
 *
 * Mass enters by measurement, not by assumption: the pull was checked proportional to the mass over nine decades
 * (RAY_RAR) and additive over sources to two parts in ten thousand (RAY_STARS), so a mass sweep is that scaling.
 */
if (Deno.env.get("RAY_SPACE")) {
  if (!device) throw new Error("the space is measured on the device");
  const a0 = physics.Law?.a0 ?? 0;
  if (!(a0 > 0)) throw new Error("no a_0 to scale by - run `npx ray measure law` first");
  const XS = 700, X0 = -5, X1 = 4, YS = 520, Y0 = -4, Y1 = 4;
  const dx = (X1 - X0) / (XS - 1), dy = (Y1 - Y0) / (YS - 1);
  const edge = (p.side - 1) / 2 / p.K - 2;
  const REF = 0.2458;
  const freedoms = ["mass", "face", "moving", "radiating"];
  /*
   * THE TWO THINGS A SOURCE OWNS, swept: how often it emits, and how big it is. What it SENDS is its rate through
   * the skin of its size over the face that size has; what it HOLDS is its bulk. Those are not the same count -
   * the store says so in as many words - so a source's size moves what is felt against what is there, which is
   * the width of the space. Where it moves it to is the medium's to say, and this measures it
   */
  const faces = [law.NEAR, 1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24, 32];
  const betas = [0, 0.225, 0.45, 0.675, 0.9];
  /* one run per face and speed: what the medium gives, read at a spread of radii outside it */
  const tracks: { face: number; beta: number; mx: number; rs: number[]; gs: number[] }[] = [];
  /*
   * WHAT THE SOURCE OWNS IS SWEPT IN THE RUN, not scaled afterwards. Where the medium is linear the two are the same
   * thing and a rate was a slide along the line; where what is felt is enhanced by what stands at the place
   * (Medium.own), it is not proportional to the rate at all, so every rate has to be run
   */
  const rates: number[] = [];
  for (let k = 0; k <= 24; k++) rates.push(REF * Math.pow(10, -9 + 12 * k / 24));
  const settle_for = async (world: any) => { for (let i = 0; i < 4; i++) { const t2 = world.tick(); if (t2 && typeof t2.then === "function") await t2; } };
  for (const face of faces) {
    for (const beta of betas) {
      const world = await webgpu.medium(p.side, p.A, p.K, 2, physics.G, p.DEG, p.D, how);
      const h = new physics.Hole({ x: p.centre, y: p.centre, mx: REF, ways: 1 });
      h.tag = 1; h.moves = false; h.face = face;
      h.px = beta * h.mass; h.py = 0;
      h.momentum = new physics.Vector({ components: [h.px, h.py] });
      world.add(h);
      const settled = world.settle();
      if (settled && typeof settled.then === "function") await settled;
      const rs: number[] = [];
      for (let r = Math.max(2, 2 * face); r <= edge; r *= Math.pow(2, 1 / 16)) rs.push(r);
      if (!rs.length) continue;
      const asks2 = rs.map(r => [p.centre + r * p.K, p.centre, 0]);
      for (const mx of rates) {
        h.mx = mx;
        h.px = beta * h.mass; h.py = 0;
        h.momentum = new physics.Vector({ components: [h.px, h.py] });
        world.seed();
        /*
         * and a source the box cannot hold is no source: a cell carries at most all of its ways, so past some rate the
         * first rung clamps and what it sends stops answering what is in it. Those runs say what the lattice's ceiling
         * is, not what a source does, so they are left out rather than drawn
         */
        const prof = typeof world.profile === "function" ? await world.profile(1) : null;
        if (prof && prof.length && prof[0] >= 0.999) continue;
        /* a few ticks so what stands at each place is this rate's and not the one before it */
        await settle_for(world);
        const got = await world.probe(asks2);
        tracks.push({ face, beta, mx, rs, gs: got.map((g2: number[]) => -g2[0]) });
      }
    }
  }
  console.log(`  ${id.padEnd(26)} ${tracks.length} runs: faces ${faces[0].toFixed(1)}..${faces[faces.length - 1]} c-bar, beta 0..${betas[betas.length - 1]}`);
  /*
   * and what the ordinary matter alone would pull with: what the body HOLDS, at the same radius. The smallest a
   * source can be is where the two are one - nothing of it is shadowed and its bulk is its face - so that is where
   * this is fixed, and every bigger source is read against it
   */
  /*
   * and what the ordinary matter alone pulls with is read off a box with nothing of the recursion in it: that medium
   * is linear in the rate to a part in ten thousand, so its own pull is what the source and the shell alone give
   */
  const flatw = await webgpu.medium(p.side, p.A, p.K, 2, physics.G, p.DEG, p.D, { ...how, own: 0 });
  {
    const hf = new physics.Hole({ x: p.centre, y: p.centre, mx: REF, ways: 1 });
    hf.tag = 1; hf.moves = false; hf.face = faces[0]; hf.px = 0; hf.py = 0;
    flatw.add(hf);
    const st2 = flatw.settle();
    if (st2 && typeof st2.then === "function") await st2;
  }
  const flat_rs: number[] = [];
  for (let r = Math.max(2, 2 * faces[0]); r <= edge; r *= Math.pow(2, 1 / 16)) flat_rs.push(r);
  const flat_gs = (await flatw.probe(flat_rs.map(r => [p.centre + r * p.K, p.centre, 0]))).map((g2: number[]) => -g2[0]);
  const least = { face: faces[0], beta: 0, mx: REF, rs: flat_rs, gs: flat_gs };
  const hold = (face: number) => law.ball_at(face) / law.ball_at(faces[0]);
  const bare_at = (r: number) => {
    if (r <= least.rs[0]) return least.gs[0] * (least.rs[0] / r) ** 2;
    const i = least.rs.findIndex((v, j) => j + 1 < least.rs.length && least.rs[j + 1] > r);
    if (i < 0) return least.gs[least.gs.length - 1] * (least.rs[least.rs.length - 1] / r) ** 2;
    const f = (r - least.rs[i]) / (least.rs[i + 1] - least.rs[i]);
    return least.gs[i] * (1 - f) + least.gs[i + 1] * f;
  };
  const bit = (name: string) => 1 << freedoms.indexOf(name);
  const fill = (keep: (t: { face: number; beta: number }) => boolean, vary_mass: boolean) => {
    const wants = (t: { mx: number }) => vary_mass || Math.abs(Math.log10(t.mx / REF)) < 1e-9;
    const grid = new Float32Array(XS * YS);
    for (const t of tracks) {
      if (!keep(t) || !wants(t)) continue;
      for (let i = 0; i < t.rs.length; i++) {
        const felt = t.gs[i], held = bare_at(t.rs[i]) * hold(t.face) * (t.mx / REF);
        if (!(felt > 0) || !(held > 0)) continue;
        const gx = Math.round((Math.log10(held / a0) - X0) / dx);
        const gy = Math.round((Math.log10(felt / a0) - Y0) / dy);
        if (gx >= 0 && gx < XS && gy >= 0 && gy < YS) grid[gy * XS + gx] += 1;
      }
    }
    return grid;
  };
  const write = async (want: string, keep: (t: { face: number; beta: number }) => boolean) => {
    const grid = fill(keep, true);
    const without: Record<string, Float32Array> = {
      mass: fill(keep, false),
      face: fill(t => keep(t) && t.face === faces[0], true),
      moving: fill(t => keep(t) && t.beta === 0, true),
      radiating: fill(keep, true),
    };
    const by = new Float32Array(XS * YS);
    for (let i = 0; i < grid.length; i++) {
      if (!(grid[i] > 0)) continue;
      let need = 0, ways = 0;
      for (const f of freedoms) { if (without[f][i] > 0) ways++; else need |= bit(f); }
      by[i] = ways >= 2 ? 0 : need;
    }
    const rows = XS * YS;
    const cols = ["x", "y", "p", "by"];
    const flat = new Float32Array(cols.length * rows);
    let most = 0;
    for (let gy = 0; gy < YS; gy++) for (let gx = 0; gx < XS; gx++) {
      const i = gy * XS + gx;
      flat[i] = X0 + gx * dx;
      flat[rows + i] = Y0 + gy * dy;
      flat[2 * rows + i] = grid[i];
      flat[3 * rows + i] = by[i];
      if (grid[i] > most) most = grid[i];
    }
    const header = {
      what: `how much of what this medium can do lands at each pair of what the matter holds and what is felt (${want})`,
      columns: cols, rows, measured: new Date().toISOString(), a0, arrangement: want, most,
      grid: { arrives: { from: X0, to: X1, n: XS }, felt: { from: Y0, to: Y1, n: YS } },
      freedoms,
      stages: ["nought is: reachable several ways; otherwise one bit per freedom, in the order of `freedoms`, for each one that is NECESSARY there"],
      about: "measured by running the medium: a source of every size and speed, its rate swept, the pull read outside it. What it holds is its bulk (l.ball) and what it sends is its face through the skin - the store's own two counts. The medium has no rate of its own to vary, so nothing here needs `radiating`",
      faces, betas, masses: [rates[0], rates[rates.length - 1]],
    };
    const dir = join(repo, "visuals", want === "gathered" ? "galaxy.point" : "galaxy.many");
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "field.f32"), new Uint8Array(flat.buffer));
    writeFileSync(join(dir, "meta.json"), JSON.stringify(header, null, 2) + "\n");
    console.log(`  ${id.padEnd(26)} ${want}: most ${most} in a cell, written to ${dir.split("/").slice(-2).join("/")}/field.f32`);
    return grid;
  };
  /* one face is a galaxy gathered behind it; every size it may be is the same galaxy as its stars */
  const gathered = await write("gathered", t => t.face === faces[0]);
  const scattered = await write("scattered", t => true);
  const gN: number[] = [], g: number[] = [];
  /* the middle of what the space holds at each arrival, weighted by how much of it lands there - the thickest single cell jumps about between the tracks, and the weighted middle does not */
  for (let gx = 0; gx < XS; gx++) {
    let sum = 0, at = 0;
    for (let gy = 0; gy < YS; gy++) { const v = scattered[gy * XS + gx]; sum += v; at += v * gy; }
    if (!(sum > 0)) continue;
    gN.push(Math.pow(10, X0 + gx * dx) * a0);
    g.push(Math.pow(10, Y0 + (at / sum) * dy) * a0);
  }
  const rows = gN.length;
  const flat = new Float32Array(2 * rows);
  flat.set(gN, 0); flat.set(g, rows);
  const header = { what: "the typical galaxy this medium holds: where the space is thickest at each arrival", columns: ["gN", "g"], rows, measured: new Date().toISOString(), a0, theory: "G", about: "the ridge of the space, measured off the medium" };
  const dir = join(repo, "visuals", "law.medium");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "field.f32"), new Uint8Array(flat.buffer));
  writeFileSync(join(dir, "meta.json"), JSON.stringify(header, null, 2) + "\n");
  console.log(`  ${id.padEnd(26)} the typical galaxy: ${rows} columns, ${rows ? `${Math.log10(gN[0] / a0).toFixed(2)} to ${Math.log10(gN[rows - 1] / a0).toFixed(2)}` : "-"} in what the matter holds`);
  Deno.exit(0);
}

/*
 * A GALAXY AS ONE SOURCE AGAINST A GALAXY AS ITS STARS (RAY_STARS=n). The same total mass, once behind one face and
 * once spread over n of them in a disc, each on a plane of its own so what they send meets what the others send.
 * The pull is read outside them both, at a spread of radii: whether the many pull harder than the one is what the
 * two galaxy panels are about, and it is measured here rather than argued
 */
if (Deno.env.get("RAY_STARS")) {
  if (!device) throw new Error("this is measured on the device");
  const stars = Number(Deno.env.get("RAY_STARS"));
  const total = Number(Deno.env.get("RAY_MASS") ?? 1) * 0.2458;
  const disc = Number(Deno.env.get("RAY_DISC") ?? 6);
  const edge = (p.side - 1) / 2 / p.K - 2;
  const radii: number[] = [];
  for (let r = Math.max(2, disc * 2); r <= edge; r *= Math.SQRT2) radii.push(r);
  const asks = radii.map(r => [p.centre + r * p.K, p.centre, 0]);
  const lay_stars = async (n: number) => {
    const world = await webgpu.medium(p.side, p.A, p.K, n + 1, physics.G, p.DEG, p.D, how);
    for (let k = 0; k < n; k++) {
      /* a disc of them, evenly round it, and the one alone at the middle */
      const turn = 2 * Math.PI * k / n, at = n === 1 ? 0 : disc;
      const h = new physics.Hole({ x: p.centre + at * Math.cos(turn) * p.K, y: p.centre + at * Math.sin(turn) * p.K, mx: total / n, ways: 1 });
      h.tag = k + 1; h.moves = false; h.px = 0; h.py = 0;
      world.add(h);
    }
    const settled = world.settle();
    if (settled && typeof settled.then === "function") await settled;
    const got = await world.probe(asks);
    return got.map((g2: number[], i: number) => {
      /* what points at the middle of them, which is what a rotation curve reads */
      const dx = p.centre - (asks[i][0]), dy = p.centre - asks[i][1], d = Math.hypot(dx, dy) || 1;
      return (g2[0] * dx + g2[1] * dy) / d;
    });
  };
  const one = await lay_stars(1);
  const many = await lay_stars(stars);
  /*
   * and the control the ratio above does NOT give: the same eight, summed as if they never met. A ring of them is
   * nearer on one side than the middle is, and one over the square is convex, so the many pull harder for geometry
   * alone. What says the medium itself adds anything is the many against THAT sum
   */
  const alone = await (async () => {
    const world = await webgpu.medium(p.side, p.A, p.K, 2, physics.G, p.DEG, p.D, how);
    const h = new physics.Hole({ x: p.centre, y: p.centre, mx: total / stars, ways: 1 });
    h.tag = 1; h.moves = false; h.px = 0; h.py = 0;
    world.add(h);
    const settled = world.settle();
    if (settled && typeof settled.then === "function") await settled;
    /* the one star's pull by distance, finely, so the sum below can read it anywhere */
    const fine: number[] = [];
    for (let r = 0.5; r <= edge * 2; r += 0.25) fine.push(r);
    const got = await world.probe(fine.map(r => [p.centre + r * p.K, p.centre, 0]));
    return (r: number) => {
      if (r <= fine[0]) return -got[0][0];
      if (r >= fine[fine.length - 1]) return -got[got.length - 1][0] * (fine[fine.length - 1] / r) ** 2;
      const i = Math.min(fine.length - 2, Math.max(0, Math.floor((r - fine[0]) / 0.25)));
      const f = (r - fine[i]) / (fine[i + 1] - fine[i]);
      return -((got[i][0]) * (1 - f) + (got[i + 1][0]) * f);
    };
  })();
  const summed = radii.map(R => {
    let toward = 0;
    for (let k = 0; k < stars; k++) {
      const turn = 2 * Math.PI * k / stars;
      const sx = disc * Math.cos(turn), sy = disc * Math.sin(turn);
      const dx = R - sx, dy = -sy, d = Math.hypot(dx, dy) || 1;
      /* what that star pulls with there, the part of it that points back at the middle of them */
      toward += alone(d) * (dx / d);
    }
    return toward;
  });
  console.log(`  ${id.padEnd(26)} mass ${total.toExponential(3)}, ${stars} stars on a disc of ${disc} c-bar, read from ${radii[0].toFixed(1)} to ${radii[radii.length - 1].toFixed(1)} c-bar`);
  radii.forEach((r, i) => {
    console.log(`    ${r.toFixed(1).padStart(6)} c-bar  one ${one[i].toExponential(3)}  many ${many[i].toExponential(3)}  summed ${summed[i].toExponential(3)}  many/one ${(many[i] / one[i]).toFixed(4)}  many/summed ${(many[i] / summed[i]).toFixed(5)}`);
  });
  Deno.exit(0);
}

/*
 * THE RADIAL ACCELERATION RELATION, MEASURED OFF THE MEDIUM ITSELF (RAY_RAR=1). One source alone in a box of its
 * own, its mass swept over decades, and the pull read at a spread of radii. What the source and the shell alone
 * would give is the medium's own LINEAR response - the pull at the smallest mass, scaled by the mass - so the boost
 * is what the medium adds beyond being proportional to what is there. Written where the galaxy panel reads it
 * (`law.medium`), so the line those axes carry is a measurement of this medium and not an evaluation of a law
 */
if (Deno.env.get("RAY_RAR")) {
  if (!device) throw new Error("the relation is measured on the device");
  const world = await webgpu.medium(p.side, p.A, p.K, 2, physics.G, p.DEG, p.D, how);
  /*
   * and the same box with nothing of the recursion in it, which is where what the source and the shell alone give is
   * read: that medium is linear in the mass to a part in ten thousand, so its own pull IS g_N. Taking the baseline off
   * the smallest mass of the SAME run only works where that mass is linear, and under the recursion it is the least so
   */
  const plain = await webgpu.medium(p.side, p.A, p.K, 2, physics.G, p.DEG, p.D, { ...how, own: 0 });
  const h = new physics.Hole({ x: p.centre, y: p.centre, mx: 1e-10, ways: 4096 });
  h.tag = 1; h.moves = false; h.px = 0; h.py = 0;
  world.add(h);
  const hp = new physics.Hole({ x: p.centre, y: p.centre, mx: 1e-10, ways: 4096 });
  hp.tag = 1; hp.moves = false; hp.px = 0; hp.py = 0;
  plain.add(hp);
  /* far enough out that the body's own size is behind us, and inside what the box holds */
  const edge = (p.side - 1) / 2 / p.K - 2;
  const radii: number[] = [];
  for (let r = 2; r <= edge; r *= Math.SQRT2) radii.push(r);
  const asks = radii.map(r => [p.centre + r * p.K, p.centre, 0]);
  const masses: number[] = [];
  for (let k = 0; k <= 36; k++) masses.push(1e-10 * Math.pow(10, k / 4));
  const rows: number[][] = [];
  let bare: number[] | null = null;
  for (const mx of masses) {
    h.mx = mx; hp.mx = mx;
    world.seed(); plain.seed();
    const got = await world.probe(asks);
    const pulls = got.map((g2: number[]) => -g2[0]);
    const flat2 = (await plain.probe(asks)).map((g2: number[]) => -g2[0]);
    if (!bare) bare = flat2.map((v: number) => v / mx);
    for (let i = 0; i < radii.length; i++) {
      const gN = flat2[i];
      if (gN > 0 && pulls[i] > 0) rows.push([gN, pulls[i], radii[i], h.mass]);
    }
  }
  rows.sort((a2, b2) => a2[0] - b2[0]);
  /* and what the smallest masses come to against that baseline: one where nothing is added, the boost itself where it is */
  const first = rows.filter(r => r[3] <= masses[1] * 4096 * 1.001);
  console.log(`  ${id.padEnd(26)} ${rows.length} readings: mass ${(masses[0] * 4096).toExponential(2)}..${(masses[masses.length - 1] * 4096).toExponential(2)}, radius ${radii[0].toFixed(1)}..${radii[radii.length - 1].toFixed(1)} c-bar`);
  console.log(`  ${id.padEnd(26)} the pull against what is proportional to the mass: ${[0, 0.25, 0.5, 0.75, 1].map(q => { const r = rows[Math.min(rows.length - 1, Math.round(q * (rows.length - 1)))]; return `${r[0].toExponential(1)} -> ${(r[1] / r[0]).toFixed(4)}`; }).join(", ")}`);
  if (first.length) console.log(`  ${id.padEnd(26)} the small end stands at ${Math.max(...first.map(r => r[1] / r[0])).toFixed(3)} of what arrives (one where nothing is added)`);
  const cols = ["gN", "g"];
  const flat = new Float32Array(cols.length * rows.length);
  rows.forEach((r, i) => { flat[i] = r[0]; flat[rows.length + i] = r[1]; });
  const header = {
    what: "what the medium pulls with against what is proportional to the mass in it, both in c-bar a tick a tick",
    columns: cols, rows: rows.length, measured: new Date().toISOString(),
    a0: law.a0, theory: "G", about: "measured on the medium: one source, its mass swept, the pull read at a spread of radii",
    radii, masses: masses.map(m => m * 4096),
  };
  const dir = join(repo, "visuals", "law.medium");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "field.f32"), new Uint8Array(flat.buffer));
  writeFileSync(join(dir, "meta.json"), JSON.stringify(header, null, 2) + "\n");
  console.log(`  ${id.padEnd(26)} written to visuals/law.medium/field.f32`);
  Deno.exit(0);
}
/*
 * WHAT LAW THE MEDIUM ACTUALLY GIVES: RAY_LAW=1 probes the pull a point would feel at a spread of distances from the
 * heaviest body and prints the slope from one distance to the next. Nothing is assumed of it - this is the medium
 * read straight, the way a body reads it (Medium.pull_at)
 */
if (Deno.env.get("RAY_LAW")) {
  if (typeof w.probe !== "function") throw new Error("this world cannot be probed - the device's medium can");
  let heavy = 0;
  w.holes.forEach((h: any, k: number) => { if (h.mass > w.holes[heavy].mass) heavy = k; });
  const o = w.holes[heavy];
  const zown = w.holes.length > 1 ? (w.plane_of ? w.plane_of(w.holes[heavy === 0 ? 1 : 0]) : 0) : 0;
  const edge = (p.side - 1) / 2 - 2 * p.K;
  const asks: number[][] = [];
  for (let r = 0.5; r * p.K < edge; r *= Math.SQRT2) asks.push([o.x + r * p.K, o.y, zown, r]);
  const got = await w.probe(asks.map((a2: number[]) => [a2[0], a2[1], a2[2]]));
  if (w.room) console.log(`  ${id.padEnd(26)} the device binds ${(w.room.binds / 1048576).toFixed(0)} MiB at a time and holds ${(w.room.holds / 1048576).toFixed(0)} MiB; this box asks ${(w.room.ledgers / 1048576).toFixed(1)} MiB of ledgers and ${(w.room.planes / 1048576).toFixed(1)} MiB of planes`);
  if (typeof w.profile === "function") {
    const z = w.plane_of ? w.plane_of(o) : 1;
    const beam = await w.profile(z);
    const show = [0, 1, 2, 4, 8, 16, 32, 64, 128, 256].filter(r => r < beam.length);
    console.log(`  ${id.padEnd(26)} what it has sent, rung by rung (of ${w.rungs}): ${show.map(r => `${r}: ${beam[r].toExponential(3)}`).join(", ")}`);
  }
  console.log(`  ${id.padEnd(26)} running on ${how.vacuum ? "the settled vacuum" : "an empty lattice"}, facing ${how.facing ? "off the closure" : "one"}, what is felt ${how.enhance === 0 ? "as what arrives" : how.enhance === 1 ? "enhanced by the vacuum's a_0" : "enhanced by the a_0 where it stands"} (a_0 at ${how.a0_share} of the chain's)`);
  console.log(`  ${id.padEnd(26)} the pull of the heaviest body (mass ${o.mass.toExponential(3)}, rays ${(o.ways ?? 0)}), by distance - and what slope that is:`);
  let was: number[] | null = null;
  got.forEach((g: number[], i: number) => {
    const r = asks[i][3], toward = -g[0];
    let slope = "";
    if (was && was[1] > 0 && toward > 0) slope = `r^-${(-Math.log(toward / was[1]) / Math.log(r / was[0])).toFixed(3)}`;
    console.log(`    ${r.toFixed(2).padStart(9)} c-bar  ${toward.toExponential(3).padStart(11)}  ${slope}`);
    was = [r, toward];
  });
  Deno.exit(0);
}
/*
 * WHERE EACH BODY'S NEAREST POINT STANDS, TURN AFTER TURN, off the device's own per-tick track. A nearest point is
 * not found by looking at three ticks: over one tick the distance changes by about as much as a single-precision
 * place holds, so what places it is a parabola through the whole of the turn about it, and a turn only counts once
 * the body has been out to the middle of its range again
 */
const watching = () => {
  const n = w.holes.length;
  const held = w.holes.map((h: any) => !h.moves);
  const mass = w.holes.map((h: any) => h.mass);
  /* what the paths are read against: the held bodies where there are any, else the middle they all keep to */
  const anchored = held.some(Boolean);
  const weigh = w.holes.map((_h: any, k: number) => (anchored ? (held[k] ? mass[k] : 0) : mass[k]));
  const total = weigh.reduce((a2: number, b2: number) => a2 + b2, 0) || 1;
  /*
   * A NEAREST POINT IS NOT FOUND BY LOOKING AT THREE TICKS. Over one tick the distance changes by about as much as a
   * single-precision place holds, so the three nearest ticks say nothing: what places it is a parabola through the
   * whole of the turn about it, and a turn only counts once the body has been out to the middle of its range again
   */
  const RING = 8192;
  const seen: any[] = w.holes.map(() => ({ ring: [], at: 0, n: 0, armed: false, lowAt: -1, low: Infinity, last: null, turns: [], lo: Infinity, hi: 0 }));
  let rounds = 0;
  const fit = (s2: any, m: number, wide: number) => {
    /* a least-squares parabola in the tick, through the readings about the nearest point: its lowest place is the turn */
    let n = 0, sx = 0, sx2 = 0, sx3 = 0, sx4 = 0, sy = 0, sxy = 0, sx2y = 0, t0 = 0;
    for (let i = m - wide; i <= m + wide; i++) {
      if (i < 0 || i >= s2.n) continue;
      const it = s2.ring[i % RING];
      if (!it) continue;
      if (!n) t0 = it.t;
      const x = it.t - t0, y = it.r;
      n++; sx += x; sx2 += x * x; sx3 += x ** 3; sx4 += x ** 4; sy += y; sxy += x * y; sx2y += x * x * y;
    }
    if (n < 5) return null;
    /* three normal equations for y = a x^2 + b x + c */
    const A = [[sx4, sx3, sx2], [sx3, sx2, sx], [sx2, sx, n]], B = [sx2y, sxy, sy];
    for (let i = 0; i < 3; i++) {
      let p2 = i;
      for (let j = i + 1; j < 3; j++) if (Math.abs(A[j][i]) > Math.abs(A[p2][i])) p2 = j;
      [A[i], A[p2]] = [A[p2], A[i]]; [B[i], B[p2]] = [B[p2], B[i]];
      if (!A[i][i]) return null;
      for (let j = i + 1; j < 3; j++) { const f = A[j][i] / A[i][i]; for (let k2 = i; k2 < 3; k2++) A[j][k2] -= f * A[i][k2]; B[j] -= f * B[i]; }
    }
    const c2 = B[2] / A[2][2], b2 = (B[1] - A[1][2] * c2) / A[1][1], a2 = (B[0] - A[0][1] * b2 - A[0][2] * c2) / A[0][0];
    if (!(a2 > 0)) return null;
    const xv = -b2 / (2 * a2), tv = t0 + xv;
    /* and the heading there, between the two readings it falls between */
    let lo = m;
    while (lo > 0 && s2.ring[lo % RING] && s2.ring[lo % RING].t > tv) lo--;
    while (lo + 1 < s2.n && s2.ring[(lo + 1) % RING] && s2.ring[(lo + 1) % RING].t < tv) lo++;
    const one = s2.ring[lo % RING], two = s2.ring[(lo + 1) % RING];
    if (!one || !two) return null;
    const f = two.t > one.t ? (tv - one.t) / (two.t - one.t) : 0;
    return { t: tv, th: one.th + f * (two.th - one.th), r: c2 - b2 * b2 / (4 * a2) };
  };
  const feed = (rows: number[][]) => {
    const by: Record<number, number[][]> = {};
    for (const row of rows) (by[row[0]] ??= [])[row[1]] = row;
    for (const tick of Object.keys(by).map(Number).sort((a2, b2) => a2 - b2)) {
      const at = by[tick];
      if (at.length < n) continue;
      let cx = 0, cy = 0;
      for (let k = 0; k < n; k++) { cx += weigh[k] * at[k][2]; cy += weigh[k] * at[k][3]; }
      cx /= total; cy /= total;
      for (let k = 0; k < n; k++) {
        if (held[k]) continue;
        const s2 = seen[k];
        const dx = at[k][2] - cx, dy = at[k][3] - cy;
        const r = Math.hypot(dx, dy) / p.K;
        let th = Math.atan2(dy, dx);
        if (s2.last !== null) { while (th - s2.last > Math.PI) th -= 2 * Math.PI; while (th - s2.last < -Math.PI) th += 2 * Math.PI; }
        if (s2.first === undefined) s2.first = th;
        s2.went = th - s2.first;
        s2.last = th;
        s2.lo = Math.min(s2.lo, r); s2.hi = Math.max(s2.hi, r);
        s2.ring[s2.n % RING] = { t: tick, r, th };
        s2.n++;
        const mid = (s2.lo + s2.hi) / 2, range = s2.hi - s2.lo;
        if (r > mid) { s2.armed = true; s2.low = Infinity; s2.lowAt = -1; }
        if (s2.armed) {
          if (r < s2.low) { s2.low = r; s2.lowAt = s2.n - 1; }
          /* it has turned and gone back out a twentieth of its range: the turn between is placed and counted */
          if (s2.lowAt >= 0 && range > 0 && r > s2.low + range / 20) {
            const wide = Math.max(4, Math.min(RING / 3, s2.n - 1 - s2.lowAt));
            const got = fit(s2, s2.lowAt, wide);
            if (got) s2.turns.push(got);
            s2.armed = false; s2.low = Infinity; s2.lowAt = -1;
          }
        }
      }
    }
    rounds = Math.max(...seen.map((s2: any) => s2.turns.length));
    if (Deno.env.get("RAY_DEBUG") && rows.length) console.log(`    track: ${rows.length} rows, turns ${seen.map((s2: any) => s2.turns.length).join("/")}, r ${seen.map((s2: any) => (s2.ring[(s2.n - 1) % RING]?.r ?? -1).toFixed(3)).join(" ")}`);
  };
  return {
    get rounds() { return rounds; },
    feed,
    report() {
      for (let k = 0; k < n; k++) {
        const s2 = seen[k];
        /* a nearly round path has no nearest point to speak of, and two turns say nothing about how it moves between them */
        const round = !(s2.hi > 0) || (s2.hi - s2.lo) / (s2.hi + s2.lo) < 0.02;
        if (s2.turns.length < 3 || round) {
          if (s2.turns.length) console.log(`  ${id.padEnd(26)} b${k}: ${s2.turns.length} turn${s2.turns.length === 1 ? "" : "s"}, ${s2.lo.toFixed(4)}..${s2.hi.toFixed(4)} c-bar, e ${((s2.hi - s2.lo) / (s2.hi + s2.lo)).toFixed(5)} - ${round ? "too round for a nearest point" : "too few turns to say what it does"}`);
          continue;
        }
        /* which way round it goes: what the heading did over the whole run */
        const way = s2.went > 0 ? 1 : -1;
        const shifts = s2.turns.slice(1).map((v: any, i: number) => (v.th - s2.turns[i].th - way * 2 * Math.PI) * 180 / Math.PI * way);
        const mean = shifts.reduce((a2: number, b2: number) => a2 + b2, 0) / (shifts.length || 1);
        const spread = shifts.length > 1 ? Math.sqrt(shifts.reduce((a2: number, b2: number) => a2 + (b2 - mean) ** 2, 0) / (shifts.length - 1)) / Math.sqrt(shifts.length) : NaN;
        const period = s2.turns.length > 1 ? (s2.turns[s2.turns.length - 1].t - s2.turns[0].t) / (s2.turns.length - 1) : NaN;
        console.log(`  ${id.padEnd(26)} b${k}: ${s2.turns.length} turns of ${period.toFixed(1)} ticks, ${s2.lo.toFixed(4)}..${s2.hi.toFixed(4)} c-bar, e ${((s2.hi - s2.lo) / (s2.hi + s2.lo)).toFixed(5)}, nearest point ${mean >= 0 ? "+" : ""}${mean.toFixed(5)}±${spread.toFixed(5)}° a turn`);
      }
    },
  };
};

/*
 * A RUN WITH NO FILM: RAY_ORBITS=n ticks until the first moving body has been round n times, reading that track in
 * blocks. Nothing is drawn and nothing is read back a cell at a time, so a tick costs what a tick costs
 */
if (Deno.env.get("RAY_ORBITS")) {
  const want = Number(Deno.env.get("RAY_ORBITS"));
  if (typeof w.track !== "function") throw new Error("this world keeps no track - the device's medium does");
  const watch = watching();
  let from = w.t, ticked = 0;
  const t0b = Date.now();
  while (watch.rounds <= want) {
    const block = Math.min(w.TRACKED ?? 4096, 4096);
    for (let i = 0; i < block; i++) await step();
    watch.feed(await w.track(from));
    from = w.t;
    ticked += block;
    if (ticked % (block * 8) === 0) console.log(`  ${id.padEnd(26)} ${ticked} ticks, ${watch.rounds} turns, ${((Date.now() - t0b) / 1000).toFixed(0)}s`);
    if (ticked > 400_000_000) break;
  }
  watch.report();
  console.log(`  ${id.padEnd(26)} ${ticked} ticks in ${((Date.now() - t0b) / 1000).toFixed(0)}s (${((Date.now() - t0b) / ticked).toFixed(3)} ms a tick)`);
  Deno.exit(0);
}
/* a diagnostic run only: RAY_BENCH=n ticks n times and says what a tick costs */
if (Deno.env.get("RAY_BENCH")) {
  const n = Number(Deno.env.get("RAY_BENCH"));
  await step();
  const t1 = Date.now();
  for (let i = 0; i < n; i++) await step();
  const each = (Date.now() - t1) / n;
  console.log(`  ${id.padEnd(26)} ${each.toFixed(3)} ms a tick over ${n} (${w.cells ?? "?"} cells, ${w.planes ?? "?"} planes, ${w.holes.length} bodies)`);
  const t2 = Date.now();
  for (let i = 0; i < 20; i++) await snapshot();
  console.log(`  ${id.padEnd(26)} ${((Date.now() - t2) / 20).toFixed(3)} ms a frame read`);
  Deno.exit(0);
}
/* a diagnostic run only: the pull on each body, tick by tick after release */
if (Deno.env.get("RAY_TRACE")) {
  for (let i = 0; i < Number(Deno.env.get("RAY_TRACE")); i++) {
    await step();
    const ls = typeof w.leans === "function" ? await w.leans() : w.holes.map((h: any) => w.lean_under(h));
    const a0 = w.holes[0];
    const fr4 = await snapshot();
    const spot = (dx: number, dy: number) => { const c = w.at(Math.round(a0.x + dx * p.K), Math.round(a0.y + dy * p.K)); return c < 0 ? 0 : fr4.arrived(1, c); };
    const rows = [`at ${(a0.x / p.K).toFixed(2)} v ${(a0.px_now / a0.mass).toFixed(4)} its rays 10 ahead ${spot(-10, 0).toExponential(3)} behind ${spot(10, 0).toExponential(3)} across ${spot(0, 10).toExponential(3)}`];
    console.log(`  t${w.t}: ${rows.join(" | ")}`);
  }
  Deno.exit(0);
}
/* and a film watches the same track, so what it says of a turn is placed the same way (`watching`) */
const watch = typeof w.track === "function" ? watching() : null;
let watched = w.t;
let snap: any = null;
/* the panel reads the world back at most four times a frame: reading it every tick was most of a film's cost */
const stride = Math.max(1, Math.floor(p.TICKS / 4));
const every = Math.max(1, Math.floor(v.frames / 8));
for (let fr = 0; fr < v.frames; fr++) {
  r.begin_frame;
  for (let i = 0; i < p.TICKS; i++) {
    if (p.spent && p.spent(positions())) { await lay(); continue; }
    await step();
    if (i % stride === stride - 1 || i === p.TICKS - 1) { snap = await snapshot(); r.take(snap); }
  }
  if (!snap) snap = await snapshot();
  r.finish(buf, snap);
  let at = fr * width;
  names.forEach((k, i) => { flat.set(buf[k], at); at += sizes[i]; });
  if (watch && w.t - watched >= (w.TRACKED ?? 4096)) { watch.feed(await w.track(watched)); watched = w.t; }
  if (fr % every === 0) {
    let pull = "";
    if (Deno.env.get("RAY_PULLS") === "1") {
      const ls = typeof w.leans === "function" ? await w.leans() : w.holes.map((h: any) => w.lean_under(h));
      /* each body's pull, split into what points at the other body and what points along its own way round */
      pull = "; pull " + ls.map((l: number[], k: number) => {
        const h = w.holes[k], o = w.holes[k === 0 ? 1 : 0];
        if (!o) return Math.hypot(l[0], l[1]).toExponential(3);
        const dx = o.x - h.x, dy = o.y - h.y, d = Math.hypot(dx, dy) || 1;
        const toward = (l[0] * dx + l[1] * dy) / d, across = (l[0] * -dy + l[1] * dx) / d;
        const v = Math.hypot(h.px_now, h.py_now) || 1, along = (l[0] * h.px_now + l[1] * h.py_now) / v;
        return `${toward.toExponential(2)}|across ${across.toExponential(2)}|along ${along.toExponential(2)}`;
      }).join(" ");
    }
    console.log(`  ${id.padEnd(26)} frame ${String(fr).padStart(4)}/${v.frames} t ${String(w.t).padStart(5)}: ${where()}${pull}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
}
const channels: Record<string, number> = {};
names.forEach((k, i) => { channels[k] = sizes[i]; });
const header = { what: `${id}, frame by frame`, columns: ["frames"], rows: flat.length, frames: v.frames, channels, stamp: r.stamp, recorded: new Date().toISOString(), about: v.what };
const dir = join(OUT, id.replace(/[^\w.-]/g, "_"));
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "frames.f32"), new Uint8Array(flat.buffer));
writeFileSync(join(dir, "frames.json"), JSON.stringify(header, null, 2) + "\n");
/* the bodies' tracks, readable: per frame, each body's place (c-bar from the middle), momentum and mass, off the marks channel */
if (channels.marks) {
  const at0 = names.slice(0, names.indexOf("marks")).reduce((n, k) => n + channels[k], 0), bodies = Math.floor((channels.marks - 1) / 6);
  const tracks = Array.from({ length: bodies }, (_, k) => ({ body: k, frames: Array.from({ length: v.frames }, (_, fr) => { const m = flat.subarray(fr * width + at0 + k * 6, fr * width + at0 + k * 6 + 6); return { t: m[4], x: +m[0].toFixed(3), y: +m[1].toFixed(3), px: +m[2].toFixed(4), py: +m[3].toFixed(4), mass: m[5] }; }) }));
  const pair = bodies >= 2 ? tracks[0].frames.map((a, i) => { const b = tracks[1].frames[i]; return +Math.hypot(a.x - b.x, a.y - b.y).toFixed(3); }) : [];
  if (watch) { watch.feed(await w.track(watched)); watch.report(); }
  if (bodies > 2) console.log(`  ${id.padEnd(26)} each body's distance from the first over the film, nearest..farthest: ${tracks.slice(1).map(tr => { const ds = tr.frames.map((f2, i) => Math.hypot(f2.x - tracks[0].frames[i].x, f2.y - tracks[0].frames[i].y)); return `${Math.min(...ds).toFixed(2)}..${Math.max(...ds).toFixed(2)}`; }).join(", ")}`);
  writeFileSync(join(dir, "tracks.json"), JSON.stringify({ what: `${id}: where the bodies went`, ticks_per_frame: p.TICKS, launch: p.found ?? [], tracks, separation: pair }, null, 1) + "\n");
  if (pair.length) console.log(`  ${id.padEnd(26)} separation over the film: nearest ${Math.min(...pair)}, farthest ${Math.max(...pair)}; ${[0, 0.25, 0.5, 0.75, 1].map(q => `frame ${Math.min(pair.length - 1, Math.round(q * (pair.length - 1)))}: ${pair[Math.min(pair.length - 1, Math.round(q * (pair.length - 1)))]}`).join(", ")}`);
}
console.log(`  ${id.padEnd(26)} recorded ${device ? "on the device" : "on the CPU"}: ${v.frames} frames × ${width} numbers  ${(flat.byteLength / 1024).toFixed(0)} KB  ${((Date.now() - t0) / 1000).toFixed(1)}s`);
