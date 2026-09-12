/**
 * `deno run --unstable-webgpu --allow-all record.gpu.ts <repo> <id>` - one film's world run on the GPU
 * (languages/physics.ts/src/webgpu.ts) and written to `visuals/<id>/frames.f32` + `frames.json`, exactly
 * as the CPU recording would be. The frame's readings and channels are the Ray recording's own
 * (`begin_frame`, `take`, `finish` of Panel.ray's FieldRecording); only the ticking is driven from here,
 * since a device is asked for its numbers asynchronously.
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
const { gpu } = await import(join(repo, "languages", "physics.ts", "src", "webgpu.ts"));

const v = VISUALS[id]();
const r = v.record, p = r?.p;
if (!p) throw new Error(`${id} has no field recording to run on a device`);

let w: any = null;
const lay = async () => {
  w = await gpu(p.side, p.A, p.K, p.tags, physics.G);
  for (let i = 0; i < p.BURN; i++) await w.tick();
  for (const b of p.place(p)) {
    const h = new physics.Hole({ x: p.centre + b.x * p.K, y: p.centre + b.y * p.K, mx: b.mx, ways: b.ways });
    h.tag = b.tag; h.moves = b.moves; h.px = b.px; h.py = b.py;
    w.add(h);
  }
};
const positions = () => w.holes.map((h: any) => ({ x: (h.x - p.centre) / p.K, y: (h.y - p.centre) / p.K, mx: h.mx, ways: h.ways }));

const names: string[] = r.names, sizes: number[] = r.sizes;
const width = sizes.reduce((n: number, k: number) => n + k, 0);
const flat = new Float32Array(width * v.frames);
const buf: Record<string, Float32Array> = {};
names.forEach((k, i) => { buf[k] = new Float32Array(sizes[i]); });
const t0 = Date.now();
await lay();
let snap: any = null;
for (let f = 0; f < v.frames; f++) {
  r.begin_frame;
  for (let i = 0; i < p.TICKS; i++) {
    if (p.spent && p.spent(positions())) { await lay(); continue; }
    await w.tick();
    snap = await w.frame();
    r.take(snap);
  }
  if (!snap) snap = await w.frame();
  r.finish(buf, snap);
  let at = f * width;
  names.forEach((k, i) => { flat.set(buf[k], at); at += sizes[i]; });
  if (f % 10 === 0) console.log(`  ${id.padEnd(26)} gpu frame ${String(f).padStart(4)}/${v.frames}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
const channels: Record<string, number> = {};
names.forEach((k, i) => { channels[k] = sizes[i]; });
const header = { what: `${id}, frame by frame`, columns: ["frames"], rows: flat.length, frames: v.frames, channels, stamp: r.stamp, recorded: new Date().toISOString(), about: v.what };
const dir = join(OUT, id.replace(/[^\w.-]/g, "_"));
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "frames.f32"), new Uint8Array(flat.buffer));
writeFileSync(join(dir, "frames.json"), JSON.stringify(header, null, 2) + "\n");
console.log(`  ${id.padEnd(26)} recorded on the gpu: ${v.frames} frames × ${width} numbers  ${(flat.byteLength / 1024).toFixed(0)} KB  ${((Date.now() - t0) / 1000).toFixed(1)}s`);
