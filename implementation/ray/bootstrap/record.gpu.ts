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
/* a diagnostic only: how many ways a point of the lattice has, since a_0 = \rho_{\infty}/(DEG + 2) rides on it */
if (Deno.env.get("RAY_DEG")) (v.record?.p ?? {}).DEG = Number(Deno.env.get("RAY_DEG"));
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
  /* RAY_CROWD=0: what already stands at a place does not take from what an arrival does there (Medium.crowd) */
  crowd: Deno.env.get("RAY_CROWD") !== "0",
  /* RAY_A0FROM=1: a_0 read off the matter a carrier crossed rather than the settled vacuum (Medium.a0_from) */
  a0_from: Number(Deno.env.get("RAY_A0FROM") ?? 0),
};
const set_how = (w2: any) => { if (!w2) return w2; w2.vacuum = how.vacuum; w2.facing = how.facing; w2.enhance = how.enhance; w2.a0_share = how.a0_share; w2.own = how.own; w2.crowd = how.crowd; w2.a0_from = how.a0_from; return w2; };
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
      const at = (k: number) => { const v = fr.rho(w.at(Math.min(p.side - 1, Math.round(p.centre + k * p.K)), p.centre)); return (v > 0.5 ? `1-${(1 - v).toExponential(2)}` : v.toExponential(2)) + ` rec above ${(fr.record_above(w.at(Math.min(p.side - 1, Math.round(p.centre + k * p.K)), p.centre))).toExponential(3)}`; };
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
 * THE POSSIBILITY SPACE, SOLVED ON EVERY LATTICE (RAY_SOLVE=1). A lone source's field is closed form in the medium's
 * own terms (the same pieces RAY_SPACE continues its runs with past the box, which join the device to a thousandth of
 * a dex): what it sends a way thins as the shell does and never past one ray (Medium.seed), the vacuum's own share
 * settles beside it (Medium.nets, Medium.settle_rho), what ARRIVES is the meeting's rate times what faces the place as
 * the boolean the rule asks (Medium.pull_at), a_0 is the chain's at the density averaged on the way in
 * (Medium.scale_at, a0_from 2), and what is FELT is the chain's law at that a_0 (Law.boost). Solved from the source's
 * face out to 1e8 c-bar for every mass, face and speed RAY_SPACE runs, on DEG 4 to 40 by halves, and laid as the same
 * density - so a film can step through the lattices. Written sparse: `visuals/<id>.solved`, one row a reached cell a DEG
 */
if (Deno.env.get("RAY_SOLVE")) {
  const XS = 700, X0 = -5, X1 = 4, YS = 520, Y0 = -4, Y1 = 4;
  const dx = (X1 - X0) / (XS - 1), dy = (Y1 - Y0) / (YS - 1);
  const REF = 0.2458, FAR = 1e8, step = Math.pow(2, 1 / 16);
  const freedoms = ["mass", "face", "moving", "spread"];
  const bit = (name: string) => 1 << freedoms.indexOf(name);
  const faces = [law.NEAR, 1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24, 32];
  const betas = [0, 0.225, 0.45, 0.675, 0.9];
  const rates: number[] = [];
  for (let k = 0; k <= 96; k++) rates.push(REF * Math.pow(10, -9 + 12 * k / 96));
  /*
   * and how the same mass is ARRANGED: one source, or spread over a ring or a disc of them - each source with its own
   * SHARE of the mass, so that an arrangement may hold a dense middle with a dilute disc around it, which is what a
   * galaxy is. Its middle is the one source of it that can fill the ways of its own face, and so empty the vacuum
   * that everything further out is felt against
   */
  const ring = (n: number, rad: number, share: number): number[][] => Array.from({ length: n }, (_, i) => { const t = 2 * Math.PI * (i + 0.5) / n; return [rad * Math.cos(t), rad * Math.sin(t), share / n]; });
  const disc = (share: number) => [...ring(6, 1.5, share / 3), ...ring(8, 4, share / 3), ...ring(10, 9, share / 3)];
  /* a disc of a given size: the same mass over three rings out to it, each ring holding a third */
  const laid = (size: number) => [...ring(6, size / 6, 1 / 3), ...ring(8, size / 2.25, 1 / 3), ...ring(10, size, 1 / 3)];
  const spreads: { name: string; at: number[][]; size: number }[] = [
    { name: "one source", at: [[0, 0, 1]], size: 0 },
    { name: "a disc a c-bar across", at: laid(1), size: 1 },
    { name: "a disc 3 c-bar across", at: laid(3), size: 3 },
    { name: "a disc 9 c-bar across", at: laid(9), size: 9 },
    { name: "a disc 27 c-bar across", at: laid(27), size: 27 },
    { name: "a disc 9 c-bar across with a tenth of its mass in the middle", at: [[0, 0, 0.1], ...laid(9).map(b => [b[0], b[1], b[2] * 0.9])], size: 9 },
    { name: "a disc 9 c-bar across with half its mass in the middle", at: [[0, 0, 0.5], ...laid(9).map(b => [b[0], b[1], b[2] * 0.5])], size: 9 },
  ];
  /* every lattice from four ways to forty by halves, or the ones RAY_DEGS names */
  const DEGS: number[] = Deno.env.get("RAY_DEGS") ? Deno.env.get("RAY_DEGS")!.split(",").map(Number) : [];
  if (!DEGS.length) for (let d = 4; d <= 40.0001; d += 0.5) DEGS.push(d);
  const closed = new physics.Model({ theory: physics.G });
  const kept: Record<string, { deg: number[]; cell: number[]; p: number[]; by: number[]; needs: number[]; size: number[]; starts: number[] }> = {
    gathered: { deg: [], cell: [], p: [], by: [], needs: [], size: [], starts: [] },
    scattered: { deg: [], cell: [], p: [], by: [], needs: [], size: [], starts: [] },
  };
  const a0s: number[] = [], ratios: number[] = [], typicals: number[][] = [];
  const t0 = Date.now();
  for (const DEG of DEGS) {
    const cpu = physics.G.medium(31, p.A, p.K, DEG, 2, p.D);
    cpu.vacuum = how.vacuum; cpu.facing = how.facing; cpu.own = how.own; cpu.a0_from = how.a0_from; cpu.crowd = how.crowd;
    const a0v = cpu.a0_vacuum;
    a0s.push(a0v);
    ratios.push(closed.value_of("\\frac{a_{0}}{cH}", closed.settled(DEG)));
    /* the vacuum's own share beside what a body sent there (Medium.settle_rho), tabled on what was sent */
    const settle = (theirs: number) => { let lo = 0, hi = 1; for (let k = 0; k < 40; k++) { const mid = (lo + hi) / 2; if (cpu.nets(Math.min(1, mid + theirs), 0) > 0) lo = mid; else hi = mid; } return (lo + hi) / 2; };
    const SENT = Array.from({ length: 481 }, (_, k) => Math.pow(10, -16 + 16 * k / 480));
    const VACS = SENT.map(settle);
    const empty = how.vacuum ? settle(0) : cpu.rho_inf;
    const vac_at = (sent: number) => {
      if (!(sent > SENT[0])) return empty;
      const u = (Math.log10(Math.min(1, sent)) + 16) / 16 * 480, k = Math.min(479, Math.floor(u)), f = u - k;
      return VACS[k] * (1 - f) + VACS[k + 1] * f;
    };
    /* the chain's scale at the density crossed, tabled on the density */
    const SC = Array.from({ length: 2001 }, (_, k) => cpu.scale_at(k / 2000));
    const inf = cpu.scale_at(cpu.rho_inf);
    const a0_crossed = (avg: number) => {
      if (how.a0_from !== 2 || !(inf > 0)) return a0v;
      const u = Math.max(0, Math.min(1, avg)) * 2000, k = Math.min(1999, Math.floor(u)), f = u - k;
      return a0v * (SC[k] * (1 - f) + SC[k + 1] * f) / inf;
    };
    /* the meeting's rate: what an arrival does a unit of activity, off the meeting terms at the settled vacuum (Medium.pull_at) */
    const sym = cpu.symbols(cpu.rho_inf, 0);
    let rate = 0;
    for (const t of cpu.meets) rate += cpu.share(t, sym) * t.doing.folds.at(sym) / 2;
    const per_ref: Record<string, number> = {};
    for (const face of faces) for (const beta of betas) {
      const hh = new physics.Hole({ x: 15, y: 15, mx: REF, ways: 1 }); hh.face = face;
      hh.momentum = new physics.Vector({ components: [beta * hh.mass, 0] });
      per_ref[`${face}|${beta}`] = cpu.per_way(hh);
    }
    type Track = { face: number; beta: number; mx: number; spread: number; xs: number[]; ys: number[] };
    const tracks: Track[] = [];
    const D1 = p.D - 1;
    for (const [si, spread] of spreads.entries()) for (const face of faces) for (const beta of betas) for (const mx of rates) {
      const near = Math.max(law.NEAR, face), all = per_ref[`${face}|${beta}`] * (mx / REF);
      /* what ONE of the arrangement's sources, holding its own share, has put on a way at a distance (Medium.seed) */
      const one_sent = (r: number, share: number) => Math.min(1, all * share * Math.pow(near / Math.max(near, r), D1));
      /* and what the whole arrangement has, at a place: every source's own, from where it stands (Medium.sent_to over the planes) */
      const at_place = (px: number, py: number) => {
        let sum = 0, gx = 0, gy = 0;
        for (const b of spread.at) {
          const ex = px - b[0], ey = py - b[1], d = Math.max(near, Math.hypot(ex, ey));
          const v = one_sent(d, b[2]);
          sum += v;
          if (d > 0) { gx += v * (ex / d); gy += v * (ey / d); }
        }
        return [Math.min(1, sum), Math.hypot(gx, gy)];
      };
      const sent = (r: number) => at_place(r, 0)[0];
      /*
       * the readings start outside the arrangement - nothing of it is read from inside one of its sources - but what a
       * carrier CROSSED is integrated from the middle out, so a galaxy's own emptied core stands on the way in
       */
      const out = spread.at.reduce((m, b) => Math.max(m, Math.hypot(b[0], b[1])), 0) + near;
      let cum = near * vac_at(sent(near)), at = near;
      const xs: number[] = [], ys: number[] = [];
      for (let r = out; r <= FAR; r *= step) {
        if (r > at) { const k = Math.max(1, Math.ceil(32 * Math.log10(r / at))); let r0 = at; for (let i = 1; i <= k; i++) { const r1 = at * Math.pow(r / at, i / k); cum += 0.5 * (vac_at(sent(r0)) + vac_at(sent(r1))) * (r1 - r0); r0 = r1; } at = r; }
        /* what ARRIVES is the meeting's rate times what faces the place, each source's own added as the medium adds them (Medium.pull_at) */
        const gN = rate * at_place(r, 0)[1];
        const felt = physics.Law.boost(gN, a0_crossed(cum / r));
        xs.push(gN > 0 ? Math.log10(gN / a0v) : NaN);
        ys.push(felt > 0 ? Math.log10(felt / a0v) : NaN);
      }
      tracks.push({ face, beta, mx, spread: si, xs, ys });
    }
    /* laid as a density, exactly as the chain's sweep lays its own (Sweep.rasterise), and classed by the fewest freedoms that reach a cell */
    /* HOW MUCH IT TAKES: the least mass, in dex of the rate a source starts at, of any source that reaches a cell */
    const least = new Float32Array(XS * YS).fill(NaN);
    /*
     * AND WHAT BEING SPREAD OUT COSTS: the least mass that reaches a cell when the source is LAID OVER `WIDE` c-bar
     * rather than gathered. Being spread is no boundary - a wide source reaches anywhere a gathered one does - but it
     * pays for it in mass, and the gap between the two is that price
     */
    const WIDE = 9;
    const widest = new Float32Array(XS * YS).fill(NaN);
    const fill = (keep: (t: Track) => boolean, mark = false) => {
      const grid = new Float32Array(XS * YS);
      for (const t of tracks) {
        if (!keep(t)) continue;
        const dex = Math.log10(t.mx / REF), across = spreads[t.spread].size;
        for (let i = 0; i + 1 < t.xs.length; i++) {
          const xa = t.xs[i], ya = t.ys[i], xb = t.xs[i + 1], yb = t.ys[i + 1];
          if (!Number.isFinite(xa) || !Number.isFinite(ya) || !Number.isFinite(xb) || !Number.isFinite(yb)) continue;
          if (Math.max(xa, xb) < X0 || Math.min(xa, xb) > X1) continue;
          const st = Math.max(1, Math.ceil(Math.max(Math.abs(xb - xa) / dx, Math.abs(yb - ya) / dy)));
          for (let k = 0; k < st; k++) {
            const f = (k + 0.5) / st;
            const gx = Math.round((xa + f * (xb - xa) - X0) / dx), gy = Math.round((ya + f * (yb - ya) - Y0) / dy);
            if (gx >= 0 && gx < XS && gy >= 0 && gy < YS) {
              grid[gy * XS + gx] += 1 / st;
              if (mark && !(least[gy * XS + gx] <= dex)) least[gy * XS + gx] = dex;
              if (mark && across >= WIDE && !(widest[gy * XS + gx] <= dex)) widest[gy * XS + gx] = dex;
            }
          }
        }
      }
      return grid;
    };
    const held: Record<string, (t: Track) => boolean> = {
      mass: (t: Track) => Math.abs(Math.log10(t.mx / REF)) < 1e-9,
      face: (t: Track) => t.face === faces[0],
      moving: (t: Track) => t.beta === 0,
      spread: (t: Track) => t.spread === 0,
    };
    const subsets = Array.from({ length: 1 << freedoms.length }, (_, k) => freedoms.filter((_, j) => (k >> j) & 1)).sort((a, b) => a.length - b.length);
    for (const [want, keep] of [["gathered", (t: Track) => t.spread === 0], ["scattered", (_: Track) => true]] as [string, (t: Track) => boolean][]) {
      least.fill(NaN);
      widest.fill(NaN);
      const grid = fill(keep, true);
      const reached = subsets.map(set => fill(t => keep(t) && freedoms.every(f => set.includes(f) || held[f](t))));
      const out = kept[want];
      out.starts.push(out.cell.length);
      for (let i = 0; i < grid.length; i++) {
        if (!(grid[i] > 0)) continue;
        const k = reached.findIndex(g2 => g2[i] > 0);
        out.deg.push(DEG); out.cell.push(i); out.p.push(grid[i]);
        out.by.push(k < 0 ? 0 : subsets[k].reduce((m, f) => m | bit(f), 0));
        out.needs.push(Number.isFinite(least[i]) ? least[i] : 99);
        out.size.push(Number.isFinite(widest[i]) ? widest[i] : 99);
      }
    }
    /*
     * AND WHAT A GALAXY IS among all of it: ONE run, not a middle taken over many - the same mass spread over the most
     * sources, at the rate a source starts at (dilute: its own rays never fill a way, so it barely disturbs the vacuum
     * it is felt against) and at a galaxy's own share of motion, read from its edge outward. A single track, in order,
     * so the line a panel draws is a solve and not a squiggle
     */
    /* what each mass of that arrangement covers and where it lands, so a reader can see which galaxy is being drawn */
    if (Deno.env.get("RAY_SAY")) {
      for (const t of tracks) {
        if (t.face !== faces[0] || t.beta !== betas[1]) continue;
        if (!(t.mx / REF >= 9 && t.mx / REF <= 1100)) continue;
        const ok = t.xs.map((x, i) => [x, t.ys[i]]).filter(q => Number.isFinite(q[0]) && Number.isFinite(q[1]));
        if (!ok.length) continue;
        const at = (x: number) => { const q = ok.reduce((b, c) => Math.abs(c[0] - x) < Math.abs(b[0] - x) ? c : b); return Math.abs(q[0] - x) < 0.3 ? (q[1] - physics.Galaxies.law_at(q[0])).toFixed(2) : "-"; };
        const per = per_ref[`${faces[0]}|${betas[1]}`] * (t.mx / REF);
        console.log(`    ${spreads[t.spread].name.padEnd(48)} mass ${(t.mx / REF).toExponential(0)} (a way holds ${per.toExponential(1)}): above the law at x -1: ${at(-1)}, at 0: ${at(0)}, at 1: ${at(1)}`);
      }
    }
    /*
     * A GALAXY, DRAWN: a disc of sources with a thousandth of its mass in the middle, in motion - at the mass whose own
     * reach covers what the sky shows (a hundred times the rate a source starts at, where a way of its middle holds
     * about one ray). Lighter than that and the whole of it lies left of the data; heavier and it is felt further above
     * the law. The mass is a galaxy's own, and it is the only thing about the drawn one that the data chose
     */
    const GALAXY = 100;
    const one = tracks.find(t => t.spread === 3 && t.face === faces[0] && t.beta === betas[1] && Math.abs(Math.log10(t.mx / (REF * GALAXY))) < 0.02);
    const line: number[] = [];
    if (one) for (let i = 0; i < one.xs.length; i++) if (Number.isFinite(one.xs[i]) && Number.isFinite(one.ys[i])) line.push(one.xs[i], one.ys[i]);
    typicals.push(line);
    console.log(`  ${id.padEnd(26)} solved DEG ${DEG.toFixed(1)}: a_0 ${a0v.toExponential(3)}, a_0/cH ${ratios[ratios.length - 1].toFixed(4)}, rho_inf ${cpu.rho_inf.toFixed(4)}  (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
  }
  for (const [want, dir_id] of [["gathered", "galaxy.point.solved"], ["scattered", "galaxy.many.solved"]]) {
    const out = kept[want], rows = out.cell.length;
    const cols = ["deg", "cell", "p", "by", "needs", "size"];
    const flat = new Float32Array(cols.length * rows);
    flat.set(out.deg, 0); flat.set(out.cell, rows); flat.set(out.p, 2 * rows); flat.set(out.by, 3 * rows); flat.set(out.needs, 4 * rows); flat.set(out.size, 5 * rows);
    const header = {
      what: `the possibility space of a galaxy (${want}), solved in closed form in the medium's own terms on every lattice`, columns: cols, rows,
      measured: new Date().toISOString(), arrangement: want, degs: DEGS, starts: out.starts, a0: a0s, coincidence: { deg: DEGS, ratio: ratios }, typical: typicals,
      spreads: spreads.map(sp => sp.name), faces, betas,
      /* the theory's own lattice, where a film of the space comes to rest */
      theory_deg: physics.G.lattice.DEG,
      grid: { arrives: { from: X0, to: X1, n: XS }, felt: { from: Y0, to: Y1, n: YS } }, freedoms,
      stages: ["the fewest freedoms that reach the cell, one bit per freedom in the order of `freedoms`; nought is the source as it starts - one mass, its own cell, at rest - which is the law's own line"],
      about: "per DEG: every reached cell (index gy*n+gx of the grid, in the vacuum's own a_0 of that lattice), how much of the space lands there, and which freedoms it needs. Closed form in the medium's functions (record.gpu RAY_SOLVE); checked against the device's own runs (RAY_SPACE)",
      how,
    };
    const dir = join(repo, "visuals", dir_id);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "field.f32"), new Uint8Array(flat.buffer));
    writeFileSync(join(dir, "meta.json"), JSON.stringify(header, null, 2) + "\n");
    console.log(`  ${id.padEnd(26)} ${want}: ${rows} cells over ${DEGS.length} lattices, written to visuals/${dir_id}/field.f32`);
  }
  Deno.exit(0);
}

/*
 * THE POSSIBILITY SPACE, MEASURED OFF THE MEDIUM (RAY_SPACE=1, RAY_DEGS a list of lattices).
 *
 * Every freedom a source has HERE, each one RUN rather than argued: how much mass it is (`mass`), how big a face it
 * presents (`face`), how fast it MOVES (`moving` - the body is let go and probed in its own frame, not held and
 * charged for it), and how that mass is ARRANGED (`spread` - one source, or the same mass over a ring or a disc).
 * What ARRIVES is the same arrangement run with no recursion (a twin world, `own: 0`), so both axes are the medium's.
 * Each cell is coloured by the FEWEST freedoms that reach it, every other one held where a source starts: one mass,
 * its own cell, at rest, alone - which is what the colours are for, saying which freedom a region NEEDS.
 */
if (Deno.env.get("RAY_SPACE")) {
  if (!device) throw new Error("the space is measured on the device");
  const closed = new physics.Model({ theory: physics.G });
  const XS = 700, X0 = -5, X1 = 4, YS = 520, Y0 = -4, Y1 = 4;
  const dx = (X1 - X0) / (XS - 1), dy = (Y1 - Y0) / (YS - 1);
  const REF = 0.2458, TICKS = 24;
  const freedoms = ["mass", "face", "moving", "spread"];
  const bit = (name: string) => 1 << freedoms.indexOf(name);
  const faces = [law.NEAR, 2, 6, 16];
  const speeds = [0, 0.05, 0.15, 0.3];
  const rates: number[] = [];
  for (let k = 0; k <= 24; k++) rates.push(REF * Math.pow(10, -9 + 12 * k / 24));
  const ring = (n: number, rad: number): number[][] => Array.from({ length: n }, (_, i) => { const t = 2 * Math.PI * (i + 0.5) / n; return [rad * Math.cos(t), rad * Math.sin(t)]; });
  const spreads: { name: string; at: number[][] }[] = [
    { name: "one source", at: [[0, 0]] },
    { name: "8 on a ring of 2 c-bar", at: ring(8, 2) },
    { name: "24 on a ring of 6 c-bar", at: ring(24, 6) },
    { name: "24 in a disc out to 9 c-bar", at: [...ring(6, 1.5), ...ring(8, 4), ...ring(10, 9)] },
  ];
  const side = p.side, K = p.K, centre = p.centre, edge = (side - 1) / 2 / K - 4;
  const DEGS = (Deno.env.get("RAY_DEGS") ?? String(p.DEG)).split(",").map(Number);
  type Track = { mass: number; face: number; speed: number; spread: number; xs: number[]; ys: number[] };
  const kept: Record<string, { deg: number[]; cell: number[]; p: number[]; by: number[]; needs: number[]; size: number[]; starts: number[] }> = {
    gathered: { deg: [], cell: [], p: [], by: [], needs: [], size: [], starts: [] },
    scattered: { deg: [], cell: [], p: [], by: [], needs: [], size: [], starts: [] },
  };
  const a0s: number[] = [], ratios: number[] = [], typicals: number[][] = [];
  const t0 = Date.now();
  for (const DEG of DEGS) {
    const a0 = closed.value_of("a_{0}", closed.settled(DEG));
    a0s.push(a0);
    ratios.push(closed.value_of("\\frac{a_{0}}{cH}", closed.settled(DEG)));
    const tracks: Track[] = [];
    for (const spread of spreads) {
      /* one world per arrangement and per reading, since the bodies are its own; everything else is set on the bodies */
      const worlds = [];
      for (const own of [2, 0]) {
        const w = await webgpu.medium(side, p.A, K, spread.at.length + 1, physics.G, DEG, p.D, { ...how, own });
        for (const [i, at] of spread.at.entries()) {
          const h = new physics.Hole({ x: centre + at[0] * K, y: centre + at[1] * K, mx: REF, ways: 1 });
          h.tag = i + 1; h.moves = false; h.px = 0; h.py = 0;
          w.add(h);
        }
        worlds.push(w);
      }
      for (const face of faces) for (const speed of speeds) {
        const rs: number[] = [];
        for (let r = Math.max(law.NEAR, face); r <= edge; r *= Math.pow(2, 1 / 8)) rs.push(r);
        if (!rs.length) continue;
        for (const mass of rates) {
          const got: number[][][] = [];
          for (const w of worlds) {
            for (const [i, at] of spread.at.entries()) {
              const h = w.holes[i];
              h.x = centre + at[0] * K; h.y = centre + at[1] * K;
              h.mx = mass / spread.at.length; h.face = face;
              h.moves = speed > 0; h.px = speed * h.mass; h.py = 0;
              h.momentum = new physics.Vector({ components: [h.px, 0] });
            }
            w.seed();
            /*
             * THE ARRANGEMENT IS CARRIED, not let go: at a speed the bodies would also pull on each other, and they
             * would do it differently with the recursion than without - two different arrangements, and what arrives
             * and what is felt would be read off each. So every tick puts them back where the speed says they are,
             * which is the same in both worlds, and what is measured is the motion and nothing else
             */
            for (let t = 0; t < TICKS; t++) {
              await w.tick();
              for (const [i, at] of spread.at.entries()) {
                const h = w.holes[i];
                h.x = centre + at[0] * K + speed * K * (t + 1); h.y = centre + at[1] * K;
                h.momentum = new physics.Vector({ components: [speed * h.mass, 0] });
              }
            }
            if (w.sync) await w.sync();
            /* probed in the arrangement's own frame: it has gone where its speed took it */
            const cx = centre + speed * K * TICKS, cy = centre;
            got.push(await w.probe(rs.map(r => [cx + r * K, cy, 0])));
          }
          const xs: number[] = [], ys: number[] = [];
          rs.forEach((_, i) => {
            const g = Math.hypot(got[0][i][0], got[0][i][1]), gN = Math.hypot(got[1][i][0], got[1][i][1]);
            xs.push(gN > 0 ? Math.log10(gN / a0) : NaN);
            ys.push(g > 0 ? Math.log10(g / a0) : NaN);
          });
          tracks.push({ mass, face, speed, spread: spreads.indexOf(spread), xs, ys });
        }
      }
    }
    /* laid as a density, each track between neighbouring radii weighted by the length of its image (Sweep.rasterise) */
    /* HOW MUCH IT TAKES: the least mass, in dex of the rate a source starts at, of any source that reaches a cell */
    const least = new Float32Array(XS * YS).fill(NaN);
    /*
     * AND WHAT BEING SPREAD OUT COSTS: the least mass that reaches a cell when the source is LAID OVER `WIDE` c-bar
     * rather than gathered. Being spread is no boundary - a wide source reaches anywhere a gathered one does - but it
     * pays for it in mass, and the gap between the two is that price
     */
    const WIDE = 9;
    const widest = new Float32Array(XS * YS).fill(NaN);
    const fill = (keep: (t: Track) => boolean, mark = false) => {
      const grid = new Float32Array(XS * YS);
      for (const t of tracks) {
        if (!keep(t)) continue;
        const dex = Math.log10(t.mx / REF), across = spreads[t.spread].size;
        for (let i = 0; i + 1 < t.xs.length; i++) {
          const xa = t.xs[i], ya = t.ys[i], xb = t.xs[i + 1], yb = t.ys[i + 1];
          if (!Number.isFinite(xa) || !Number.isFinite(ya) || !Number.isFinite(xb) || !Number.isFinite(yb)) continue;
          const st = Math.max(1, Math.ceil(Math.max(Math.abs(xb - xa) / dx, Math.abs(yb - ya) / dy)));
          for (let k = 0; k < st; k++) {
            const f = (k + 0.5) / st;
            const gx = Math.round((xa + f * (xb - xa) - X0) / dx), gy = Math.round((ya + f * (yb - ya) - Y0) / dy);
            if (gx >= 0 && gx < XS && gy >= 0 && gy < YS) {
              grid[gy * XS + gx] += 1 / st;
              if (mark && !(least[gy * XS + gx] <= dex)) least[gy * XS + gx] = dex;
              if (mark && across >= WIDE && !(widest[gy * XS + gx] <= dex)) widest[gy * XS + gx] = dex;
            }
          }
        }
      }
      return grid;
    };
    const held: Record<string, (t: Track) => boolean> = {
      mass: (t: Track) => Math.abs(Math.log10(t.mass / REF)) < 1e-9,
      face: (t: Track) => t.face === faces[0],
      moving: (t: Track) => t.speed === 0,
      spread: (t: Track) => t.spread === 0,
    };
    const subsets = Array.from({ length: 1 << freedoms.length }, (_, k) => freedoms.filter((_, j) => (k >> j) & 1)).sort((a, b) => a.length - b.length);
    for (const [want, keep] of [["gathered", (t: Track) => t.spread === 0], ["scattered", (_: Track) => true]] as [string, (t: Track) => boolean][]) {
      least.fill(NaN);
      widest.fill(NaN);
      const grid = fill(keep, true);
      const reached = subsets.map(set => fill(t => keep(t) && freedoms.every(f => set.includes(f) || held[f](t))));
      const out = kept[want];
      out.starts.push(out.cell.length);
      for (let i = 0; i < grid.length; i++) {
        if (!(grid[i] > 0)) continue;
        const k = reached.findIndex(g2 => g2[i] > 0);
        out.deg.push(DEG); out.cell.push(i); out.p.push(grid[i]);
        out.by.push(k < 0 ? 0 : subsets[k].reduce((m, f) => m | bit(f), 0));
        out.needs.push(Number.isFinite(least[i]) ? least[i] : 99);
        out.size.push(Number.isFinite(widest[i]) ? widest[i] : 99);
      }
    }
    /* AND WHAT A GALAXY IS, among all of that: the mass spread over the most sources, going at a galaxy's own speed - the line the model draws */
    const typical = tracks.filter(t => t.spread === spreads.length - 1 && t.face === faces[0] && t.speed === speeds[1]);
    const line: number[] = [];
    for (const t of typical) for (let i = 0; i < t.xs.length; i++) if (Number.isFinite(t.xs[i]) && Number.isFinite(t.ys[i])) line.push(t.xs[i], t.ys[i]);
    typicals.push(line);
    console.log(`  ${id.padEnd(26)} DEG ${DEG}: ${tracks.length} runs (${spreads.length} arrangements x ${faces.length} faces x ${speeds.length} speeds x ${rates.length} masses), a_0 ${a0.toExponential(3)}  (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
  }
  for (const [want, dir_id] of [["gathered", "galaxy.point"], ["scattered", "galaxy.many"]]) {
    const out = kept[want], rows = out.cell.length;
    const cols = ["deg", "cell", "p", "by", "needs", "size"];
    const flat = new Float32Array(cols.length * rows);
    flat.set(out.deg, 0); flat.set(out.cell, rows); flat.set(out.p, 2 * rows); flat.set(out.by, 3 * rows); flat.set(out.needs, 4 * rows); flat.set(out.size, 5 * rows);
    const header = {
      what: `how much of what this medium can do lands at each pair of what arrives and what is felt (${want})`, columns: cols, rows,
      measured: new Date().toISOString(), arrangement: want, degs: DEGS, starts: out.starts, a0: a0s,
      coincidence: { deg: DEGS, ratio: ratios }, theory_deg: physics.G.lattice.DEG, typical: typicals,
      grid: { arrives: { from: X0, to: X1, n: XS }, felt: { from: Y0, to: Y1, n: YS } }, freedoms,
      stages: ["the fewest freedoms that reach the cell, one bit per freedom in the order of `freedoms`; nought is the source as it starts - one mass, its own cell, at rest, alone", "`needs` is HOW MUCH it takes: the least mass, in dex of the rate a source starts at, that reaches the cell", "`size` is WHAT SPREADING COSTS: the least mass that reaches the cell when the source is laid over nine c-bar rather than gathered, in the same dex"],
      about: "measured by running the medium: every mass, face, speed and arrangement a source may have - what ARRIVES (the same arrangement with no recursion) against what is FELT, a_0 read at the density crossed on the way in. `typical` is the same mass spread over the most sources at a galaxy's own speed, per lattice, as x, y pairs",
      faces, speeds, spreads: spreads.map(s => s.name), masses: [rates[0], rates[rates.length - 1]], how,
    };
    const dir = join(repo, "visuals", dir_id);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "field.f32"), new Uint8Array(flat.buffer));
    writeFileSync(join(dir, "meta.json"), JSON.stringify(header, null, 2) + "\n");
    console.log(`  ${id.padEnd(26)} ${want}: ${rows} cells over ${DEGS.length} lattices, written to visuals/${dir_id}/field.f32`);
  }
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
    /* a few ticks so what stands at each place is this rate's: the recursion reads the lean that place was left with,
     * and straight after a seed that lean still belongs to the rate before it (Medium.recur_at) */
    for (let i = 0; i < 4; i++) { const t2 = world.tick(); if (t2 && typeof t2.then === "function") await t2; const t3 = plain.tick(); if (t3 && typeof t3.then === "function") await t3; }
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
 * THE POSSIBILITY SPACE, SOLVED RATHER THAN SWEPT (RAY_BAND=1). What a source may choose enters in exactly one
 * place. What it HOLDS is its bulk, l.ball(face); what it SENDS is that bulk's rate through its own skin, and a
 * source that is going somewhere sends (1 - beta) of it. So at one radius the two differ by a factor that depends
 * on the source and NOT on the radius or the rate:
 *
 *     Q(face, beta) = l.ball(face) / (l.ball(NEAR)·skin(face)·(1 - beta)),   Q >= 1
 *
 * and what is felt is the law read at what ARRIVES. Writing u = log(what arrives / a_0), a point of the space is
 * (u + log Q, f(u)) with f the law's own curve - so the whole space is THE LAW SWEPT RIGHTWARD by log Q, its
 * upper-left edge the law itself at Q = 1 (the smallest a source can be, standing still) and its lower-right edge
 * the law shifted by the largest Q there is. Nothing else in a source can move it: every freedom holds more or
 * sends less, and neither can send MORE than its own skin lets out
 */
if (Deno.env.get("RAY_BAND")) {
  const a0 = physics.Law?.a0 ?? 0;
  if (!(a0 > 0)) throw new Error("no a_0 to scale by - run `npx ray measure law` first");
  const faces = [law.NEAR, 1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24, 32];
  const betas = [0, 0.225, 0.45, 0.675, 0.9];
  const at_one = 1 - law.reach_at(law.NEAR);
  const skin = (face: number) => at_one > 0 ? (1 - law.reach_at(face)) / at_one : 1;
  const hold = (face: number) => law.ball_at(face) / law.ball_at(law.NEAR);
  const qs: number[][] = [];
  for (const face of faces) for (const b of betas) qs.push([Math.log10(hold(face) / (skin(face) * (1 - b))), face, b]);
  qs.sort((u, v) => u[0] - v[0]);
  const qmax = qs[qs.length - 1][0];
  /* the law's own curve, read in a_0: f(u) = log((s + sqrt(s^2 + 4s))/2) at s = 10^u */
  const f = (u: number) => { const s = Math.pow(10, u); return Math.log10((s + Math.sqrt(s * s + 4 * s)) / 2); };
  console.log(`  ${id.padEnd(26)} the space is the law swept right by log Q, Q from ${qs[0][0].toFixed(2)} (face ${qs[0][1]}, beta ${qs[0][2]}) to ${qmax.toFixed(2)} dex (face ${qs[qs.length - 1][1]}, beta ${qs[qs.length - 1][2]})`);
  console.log(`  ${id.padEnd(26)} what a source may choose, in dex of what it holds over what it sends:\n    ${faces.map(face => `face ${face}: ${Math.log10(hold(face) / skin(face)).toFixed(2)}`).join(", ")}`);
  console.log(`  ${id.padEnd(26)} the band by what the matter holds - its top is the law, its floor the law shifted:`);
  for (const x of [-3, -2, -1, 0, 1, 2]) console.log(`    ${x.toFixed(1).padStart(5)}  top ${f(x).toFixed(2).padStart(6)}   floor ${f(x - qmax).toFixed(2).padStart(6)}   wide ${(f(x) - f(x - qmax)).toFixed(2)} dex`);
  /* and the same read off the panel's own classes, which is what it draws (Galaxies.carries, Galaxies.asks) */
  const G2: any = physics.Galaxies;
  if (G2) {
    const asks = G2.asks;
    const off = G2.offsets(asks);
    const mid = G2.middle(off), theirs = G2.middle(G2.offsets(physics.Sparc.YD));
    console.log(`  ${id.padEnd(26)} the panel: the space carries ${G2.carries.toFixed(2)} dex; the disc weight the law asks of the data is ${asks.toFixed(3)} (SPARC's own ${physics.Sparc.YD}), middle ${mid.toFixed(4)} dex against ${theirs.toFixed(4)} at theirs, over ${off.length} readings`);
  }
  Deno.exit(0);
}
/*
 * A GALAXY, LAID (RAY_DISK=1). Every SPARC point is a DISK read at a radius, while the possibility space runs ONE
 * source - and a single source's own curve is the law itself, which no arrangement of one body can rise above. So
 * this lays many: rings of bodies in the box's own plane, each on its own plane of the medium since a plane carries
 * one body's profile, with what each ring holds following an exponential disk. What the baryons alone give is read
 * off the same arrangement in a box with nothing of the recursion in it, so the pair (g_N, g) is measured on both
 * sides the way SPARC's own pair is - and the spread over the disk's own freedoms is what the panel wants
 */
if (Deno.env.get("RAY_DISK")) {
  if (!device) throw new Error("a galaxy is laid on the device");
  const each = Number(Deno.env.get("RAY_RING") ?? 8);
  const rings = Number(Deno.env.get("RAY_RINGS") ?? 3);
  const bodies = each * rings;
  const edge = (p.side - 1) / 2 / p.K - 2;
  const a0 = physics.Law?.a0 ?? 0;
  if (!(a0 > 0)) throw new Error("no a_0 to scale by - run `npx ray measure law` first");
  const rows: number[][] = [];
  const lay = (w2: any, Rd: number, M: number) => {
    /* an exponential disk, ring by ring: what an annulus at R holds is its area times what stands there */
    let total = 0;
    const want: number[] = [];
    for (let i = 0; i < rings; i++) { const R = (i + 1) * Rd; const v = R * Math.exp(-R / Rd); want.push(v); total += v * each; }
    for (let i = 0; i < rings; i++) {
      const R = (i + 1) * Rd;
      for (let k = 0; k < each; k++) {
        const th = 2 * Math.PI * (k + (i % 2) / 2) / each;
        const h = new physics.Hole({ x: p.centre + R * p.K * Math.cos(th), y: p.centre + R * p.K * Math.sin(th), mx: M * want[i] / total, ways: 1 });
        h.tag = 1 + i * each + k; h.moves = false; h.px = 0; h.py = 0;
        w2.add(h);
      }
    }
  };
  for (const Rd of [2, 4, 8]) {
    for (const M of [1e-4, 1e-3, 1e-2, 1e-1, 1]) {
      const world = await webgpu.medium(p.side, p.A, p.K, bodies + 1, physics.G, p.DEG, p.D, how);
      const flat2 = await webgpu.medium(p.side, p.A, p.K, bodies + 1, physics.G, p.DEG, p.D, { ...how, own: 0 });
      lay(world, Rd, M); lay(flat2, Rd, M);
      const rs: number[] = [];
      for (let r = Rd / 2; r <= edge; r *= Math.pow(2, 1 / 4)) rs.push(r);
      const asks = rs.map(r => [p.centre + r * p.K, p.centre, 0]);
      for (const w2 of [world, flat2]) { w2.seed(); for (let i = 0; i < 6; i++) { const t2 = w2.tick(); if (t2 && typeof t2.then === "function") await t2; } }
      const got = (await world.probe(asks)).map((g2: number[]) => -g2[0]);
      const bare = (await flat2.probe(asks)).map((g2: number[]) => -g2[0]);
      for (let i = 0; i < rs.length; i++) if (bare[i] > 0 && got[i] > 0) rows.push([bare[i], got[i], rs[i], Rd, M]);
      console.log(`  ${id.padEnd(26)} a disk of ${bodies} at R_d ${Rd} c-bar, holding ${M.toExponential(0)}: ${rs.map((r, i) => `${r.toFixed(1)}: ${(Math.log10(bare[i] / a0)).toFixed(2)}->${(Math.log10(got[i] / a0)).toFixed(2)}`).slice(0, 6).join(", ")}`);
    }
  }
  const cols = ["gN", "g", "R", "Rd", "M"];
  const flatf = new Float32Array(cols.length * rows.length);
  rows.forEach((r, i) => cols.forEach((_, c) => { flatf[c * rows.length + i] = r[c]; }));
  const dir = join(repo, "visuals", "law.disk");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "field.f32"), new Uint8Array(flatf.buffer));
  writeFileSync(join(dir, "meta.json"), JSON.stringify({
    what: "what a disk of sources pulls with against what its own baryons alone give, both in c-bar a tick a tick",
    columns: cols, rows: rows.length, measured: new Date().toISOString(), a0, theory: "G",
    about: "measured on the medium: rings of bodies in the plane, the pull read along a radius, against the same arrangement with nothing of the recursion in it",
  }, null, 2) + "\n");
  console.log(`  ${id.padEnd(26)} ${rows.length} readings written to visuals/law.disk/field.f32`);
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
