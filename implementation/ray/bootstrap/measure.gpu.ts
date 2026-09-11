/**
 * `deno run --unstable-webgpu --allow-all measure.gpu.ts <repo> <id> <how>` - the possibility space
 * (`Sweep` in Model.ray) integrated on the GPU: the closed laws as WGSL (`Sweep.kernel`), one thread per
 * (mass, face) solving the crowded density at every radius, one thread per point for what arrives and
 * what is felt; the tracks are then laid on the grid and written by the Ray sweep itself
 * (`rasterise`, `needs`, `save`), so the device and the CPU sweep can only differ in floating point.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [repo, id, how] = Deno.args;
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
  console.log(`  ${id.padEnd(14)} ${String(rows).padStart(6)} rows × ${names.length} columns (${names.join(", ")})  →  ${where}/${id}/field.f32`);
};

await import(join(OUT, "visuals.ts"));
const physics: any = await import(join(repo, "languages", "physics.ts", "index.ts"));
const t0 = Date.now();
const model = new physics.Model({ theory: physics.G });
const sweep = new physics.Sweep({ model, how });
const code: string = sweep.kernel;
const names: string[] = sweep.names;
const C = new Float32Array(sweep.constants);
const rad = new Float32Array(sweep.radii);
const RS: number = sweep.RS;
const order: string[] = sweep.order;
console.log(`  ${id.padEnd(14)} planned in ${((Date.now() - t0) / 1000).toFixed(1)}s: ${names.length} names, ${RS} radii`);

const nav: any = (globalThis as any).navigator;
const adapter = await nav.gpu.requestAdapter();
if (!adapter) throw new Error("WebGPU: no adapter");
const lim = adapter.limits ?? {};
const device = await adapter.requestDevice({ requiredLimits: { maxStorageBufferBindingSize: lim.maxStorageBufferBindingSize, maxBufferSize: lim.maxBufferSize } }).catch(() => adapter.requestDevice());
const STORAGE = 0x80 | 0x4 | 0x8;
const upload = (data: ArrayBufferView) => { const b = device.createBuffer({ size: Math.max(16, data.byteLength), usage: STORAGE }); device.queue.writeBuffer(b, 0, data as any); return b; };
const module = device.createShaderModule({ code });
const info = await module.getCompilationInfo?.();
for (const m of info?.messages ?? []) if (m.type === "error") throw new Error(`the sweep's shader failed to compile: ${m.message} (line ${m.lineNum})`);
const layout = device.createBindGroupLayout({ entries: [0, 1, 2, 3].map(b => ({ binding: b, visibility: 4, buffer: { type: "read-only-storage" } })).concat([4, 5, 6].map(b => ({ binding: b, visibility: 4, buffer: { type: "storage" } }))) });
const pl = device.createPipelineLayout({ bindGroupLayouts: [layout] });
const pipes: Record<string, any> = {};
for (const name of ["PROFILE", "TRACK"]) pipes[name] = device.createComputePipeline({ layout: pl, compute: { module, entryPoint: name } });
const read = async (buf: any, floats: number) => {
  const staging = device.createBuffer({ size: floats * 4, usage: 0x1 | 0x8 });
  const enc = device.createCommandEncoder();
  enc.copyBufferToBuffer(buf, 0, staging, 0, floats * 4);
  device.queue.submit([enc.finish()]);
  await staging.mapAsync(1);
  const out = new Float32Array(staging.getMappedRange().slice(0));
  staging.unmap(); staging.destroy();
  return out;
};
const dispatch = (enc: any, name: string, bind: any, n: number) => {
  const pass = enc.beginComputePass();
  pass.setPipeline(pipes[name]); pass.setBindGroup(0, bind);
  const groups = Math.ceil(n / 64);
  pass.dispatchWorkgroups(Math.min(groups, 1024), Math.ceil(groups / 1024));
  pass.end();
};
const cBuf = upload(C), radBuf = upload(rad);

const lay = async (vary: string[]) => {
  const steps = order.map(k => sweep.steps(vary, k));
  const [nM, nA, nB, nS] = steps;
  const values: number[] = [];
  for (const k of order) { const axis = sweep.axes[k]; values.push(...(vary.includes(k) ? axis.values : [axis.mid])); }
  const tracks = nM * nA * nB * nS, points = tracks * RS;
  const P = new Uint32Array([RS, nM, nA, nB, nS, 0, 0, 0]);
  const pBuf = upload(P), axBuf = upload(new Float32Array(values));
  const avgBuf = device.createBuffer({ size: nM * nA * RS * 4, usage: STORAGE });
  const xsBuf = device.createBuffer({ size: points * 4, usage: STORAGE }), ysBuf = device.createBuffer({ size: points * 4, usage: STORAGE });
  const bind = device.createBindGroup({ layout, entries: [pBuf, cBuf, radBuf, axBuf, avgBuf, xsBuf, ysBuf].map((buffer, binding) => ({ binding, resource: { buffer } })) });
  const enc = device.createCommandEncoder();
  dispatch(enc, "PROFILE", bind, nM * nA);
  dispatch(enc, "TRACK", bind, points);
  device.queue.submit([enc.finish()]);
  await device.queue.onSubmittedWorkDone();
  const xs = await read(xsBuf, points), ys = await read(ysBuf, points), avg = await read(avgBuf, nM * nA * RS);
  for (let i = 0; i < points; i++) { if (xs[i] >= 1e29) xs[i] = NaN; if (ys[i] >= 1e29) ys[i] = NaN; }
  for (const b of [pBuf, axBuf, avgBuf, xsBuf, ysBuf]) b.destroy();
  return { xs, ys, tracks, avg, steps, values };
};

/* the device against the CPU sweep, on a few points - the same plan, so only floating point may differ */
const check = (got: any) => {
  const [nM, nA, nB, nS] = got.steps;
  let worst = 0, worstAt = "";
  for (const [mi, ai, bi, si, k] of [[0, 0, 0, 0, 40], [nM >> 1, nA >> 1, nB >> 1, nS >> 1, 90], [nM - 1, nA - 1, nB - 1, nS - 1, 140], [nM >> 2, nA - 1, 0, nS - 1, 120]]) {
    const m = got.values[mi], A = got.values[nM + ai], beta = got.values[nM + nA + bi], S0 = got.values[nM + nA + nB + si];
    const pair = mi * nA + ai, track = (pair * nB + bi) * nS + si;
    const cpu = sweep.landing(k, m, A, beta, S0, got.avg[pair * RS + k]);
    const gx = got.xs[track * RS + k], gy = got.ys[track * RS + k];
    for (const [a, b, what] of [[cpu[0], gx, "arrives"], [cpu[1], gy, "felt"]]) {
      const d = Number.isFinite(a) && Number.isFinite(b) ? Math.abs(a - b) : (Number.isFinite(a) === Number.isFinite(b) ? 0 : Infinity);
      if (d > worst) { worst = d; worstAt = `${what} at m ${m.toExponential(1)} A ${A.toExponential(1)} k ${k}: cpu ${a} gpu ${b}`; }
    }
  }
  console.log(`  ${id.padEnd(14)} device against the CPU sweep: worst ${worst.toExponential(2)} dex${worstAt ? ` (${worstAt})` : ""}`);
  if (!(worst < 0.01)) throw new Error(`${id}: the device's sweep differs from the CPU's by ${worst} dex - ${worstAt}`);
};

const t1 = Date.now();
const whole = await lay(order);
check(whole);
const grid = sweep.rasterise(whole.xs, whole.ys, whole.tracks);
const without: any[] = [];
for (const held of order) {
  const got = await lay(order.filter(n => n !== held));
  without.push(sweep.rasterise(got.xs, got.ys, got.tracks));
}
sweep.save(id, grid, sweep.needs(grid, without));
console.log(`  ${id.padEnd(14)} swept on the gpu in ${((Date.now() - t1) / 1000).toFixed(1)}s`);
