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
const r = v.record, p = r?.p;
if (!p) throw new Error(`${id} has no field recording to run on a device`);

/* WHAT THE DERIVATION SAYS, before anything runs: the chain `vacuum.equation` ends in, evaluated (Aggregate.ray) */
const law = physics.Aggregate.of(physics.G, p.DEG);
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
  w = device ? await webgpu.medium(p.side, p.A, p.K, p.tags, physics.G, p.DEG) : physics.G.medium(p.side, p.A, p.K, p.DEG, p.tags);
  /* the bodies are put down held, the medium is older than the film by BURN ticks, and then they are let go with what they were launched with (Panel.lay) */
  const placed = p.place(p);
  for (const b of placed) {
    const h = new physics.Hole({ x: p.centre + b.x * p.K, y: p.centre + b.y * p.K, mx: b.mx, ways: b.ways });
    h.tag = b.tag; h.moves = false; h.px = 0; h.py = 0;
    w.add(h);
  }
  for (let i = 0; i < p.BURN; i++) await step();
  placed.forEach((b: any, k: number) => { const h = w.holes[k]; h.moves = b.moves; h.px = b.px; h.py = b.py; h.momentum = new physics.Vector({ components: [b.px, b.py] }); });
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
console.log(`  ${id.padEnd(26)} ${device ? "on the device" : "on the CPU"}: ${p.side}×${p.side} cells, ${p.A} headings, K ${p.K}, ${p.tags} tags; after ${p.BURN} ticks held, released: ${where()}`);
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
  if (fr % every === 0) console.log(`  ${id.padEnd(26)} frame ${String(fr).padStart(4)}/${v.frames} t ${String(w.t).padStart(5)}: ${where()}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
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
  if (bodies > 2) console.log(`  ${id.padEnd(26)} each body's distance from the first over the film, nearest..farthest: ${tracks.slice(1).map(tr => { const ds = tr.frames.map((f2, i) => Math.hypot(f2.x - tracks[0].frames[i].x, f2.y - tracks[0].frames[i].y)); return `${Math.min(...ds).toFixed(2)}..${Math.max(...ds).toFixed(2)}`; }).join(", ")}`);
  writeFileSync(join(dir, "tracks.json"), JSON.stringify({ what: `${id}: where the bodies went`, ticks_per_frame: p.TICKS, launch: p.found ?? [], tracks, separation: pair }, null, 1) + "\n");
  if (pair.length) console.log(`  ${id.padEnd(26)} separation over the film: nearest ${Math.min(...pair)}, farthest ${Math.max(...pair)}; ${[0, 0.25, 0.5, 0.75, 1].map(q => `frame ${Math.min(pair.length - 1, Math.round(q * (pair.length - 1)))}: ${pair[Math.min(pair.length - 1, Math.round(q * (pair.length - 1)))]}`).join(", ")}`);
}
console.log(`  ${id.padEnd(26)} recorded ${device ? "on the device" : "on the CPU"}: ${v.frames} frames × ${width} numbers  ${(flat.byteLength / 1024).toFixed(0)} KB  ${((Date.now() - t0) / 1000).toFixed(1)}s`);
