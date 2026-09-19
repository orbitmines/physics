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

/* THE WORLD: the medium on the device where the runtime has it, on the CPU classes otherwise */
let w: any = null;
const device = typeof webgpu.medium === "function" && Deno.env.get("RAY_CPU_RECORD") !== "1";
const lay = async () => {
  w = device ? await webgpu.medium(p.side, p.A, p.K, p.tags, physics.G, p.DEG, p.D) : physics.G.medium(p.side, p.A, p.K, p.DEG, p.tags, p.D);
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
  /*
   * WHERE EACH BODY'S NEAREST POINT STANDS, TURN AFTER TURN: the frames about each nearest are fitted a parabola, so
   * the turn and the heading are read between frames, and what the heading does from one turn to the next is the shift
   */
  const apsis = (k: number) => {
    const me = tracks[k].frames, mid = tracks[0].frames;
    const r = me.map((f2: any, i: number) => Math.hypot(f2.x - mid[i].x, f2.y - mid[i].y));
    const th = me.map((f2: any, i: number) => Math.atan2(f2.y - mid[i].y, f2.x - mid[i].x));
    for (let i = 1; i < th.length; i++) { while (th[i] - th[i - 1] > Math.PI) th[i] -= 2 * Math.PI; while (th[i] - th[i - 1] < -Math.PI) th[i] += 2 * Math.PI; }
    const turns: number[] = [];
    for (let i = 1; i < r.length - 1; i++) {
      if (!(r[i] < r[i - 1] && r[i] <= r[i + 1])) continue;
      const bend = r[i - 1] - 2 * r[i] + r[i + 1];
      const off = bend !== 0 ? 0.5 * (r[i - 1] - r[i + 1]) / bend : 0;
      turns.push(th[i] + off * 0.5 * (th[i + 1] - th[i - 1]));
    }
    if (turns.length < 2) return null;
    const way = th[th.length - 1] > th[0] ? 1 : -1;
    const shifts = turns.slice(1).map((v, i) => (v - turns[i] - way * 2 * Math.PI) * 180 / Math.PI);
    return { turns: turns.length, shift: shifts.reduce((n, v) => n + v, 0) / shifts.length * way, spread: (Math.max(...shifts) - Math.min(...shifts)) / 2 };
  };
  if (bodies > 1) {
    const said = tracks.slice(1).map((_tr, i) => apsis(i + 1)).map((a2, i) => a2 && a2.turns > 2 ? `b${i + 1} ${a2.shift >= 0 ? "+" : ""}${a2.shift.toFixed(2)}±${a2.spread.toFixed(2)}° over ${a2.turns} turns` : null).filter(Boolean);
    /* a shift the way it goes round is the nearest point running ahead of the turn: what the pull is, out there, is not exactly one over the square */
    if (said.length) console.log(`  ${id.padEnd(26)} the nearest point shifts, the way it goes round: ${said.join(", ")}`);
  }
  if (bodies > 2) console.log(`  ${id.padEnd(26)} each body's distance from the first over the film, nearest..farthest: ${tracks.slice(1).map(tr => { const ds = tr.frames.map((f2, i) => Math.hypot(f2.x - tracks[0].frames[i].x, f2.y - tracks[0].frames[i].y)); return `${Math.min(...ds).toFixed(2)}..${Math.max(...ds).toFixed(2)}`; }).join(", ")}`);
  writeFileSync(join(dir, "tracks.json"), JSON.stringify({ what: `${id}: where the bodies went`, ticks_per_frame: p.TICKS, launch: p.found ?? [], tracks, separation: pair }, null, 1) + "\n");
  if (pair.length) console.log(`  ${id.padEnd(26)} separation over the film: nearest ${Math.min(...pair)}, farthest ${Math.max(...pair)}; ${[0, 0.25, 0.5, 0.75, 1].map(q => `frame ${Math.min(pair.length - 1, Math.round(q * (pair.length - 1)))}: ${pair[Math.min(pair.length - 1, Math.round(q * (pair.length - 1)))]}`).join(", ")}`);
}
console.log(`  ${id.padEnd(26)} recorded ${device ? "on the device" : "on the CPU"}: ${v.frames} frames × ${width} numbers  ${(flat.byteLength / 1024).toFixed(0)} KB  ${((Date.now() - t0) / 1000).toFixed(1)}s`);
