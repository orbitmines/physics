/*
 * A DEVICE THAT ALSO DRIVES THE DISPLAY, USED WITHOUT TAKING IT. A submission that holds the card for seconds starves
 * the compositor and has taken the whole card off the bus (2026-09-24). So every dispatch is cut into pieces (each
 * kernel starts at P[7]), each piece is its own submission, the host rests at least as long as the device worked (the
 * device is never busy more than half the time), a piece is grown only while it stays under AIM_MS (at most four times
 * at a step), and a piece that still takes longer than LONGEST_MS stops the run rather than risk the card again.
 * Layouts are explicit: an "auto" layout drops unread bindings and the bind group then fails without a word.
 */
export const LONGEST_MS = 250;
export const AIM_MS = 20;

export async function paced() {
  const nav: any = (globalThis as any).navigator;
  const adapter = await nav.gpu.requestAdapter();
  if (!adapter) throw new Error("WebGPU: no adapter");
  const lim = adapter.limits ?? {};
  const device = await adapter.requestDevice({ requiredLimits: { maxStorageBufferBindingSize: lim.maxStorageBufferBindingSize, maxBufferSize: lim.maxBufferSize } });
  const STORAGE = 0x80 | 0x4 | 0x8;
  const upload = (data: ArrayBufferView) => { const b = device.createBuffer({ size: Math.max(16, data.byteLength), usage: STORAGE }); device.queue.writeBuffer(b, 0, data as any); return b; };
  const blank = (words: number) => device.createBuffer({ size: Math.max(16, words * 4), usage: STORAGE });
  const bytes = async (buf: any, words: number, from = 0) => {
    const size = Math.max(16, words * 4);
    const staging = device.createBuffer({ size, usage: 0x1 | 0x8 });
    const enc = device.createCommandEncoder();
    enc.copyBufferToBuffer(buf, from * 4, staging, 0, size);
    device.queue.submit([enc.finish()]);
    await staging.mapAsync(1);
    const out = staging.getMappedRange().slice(0, words * 4);
    staging.unmap(); staging.destroy();
    return out as ArrayBuffer;
  };
  const read = async (buf: any, words: number, from = 0) => new Float32Array(await bytes(buf, words, from));
  const read_u32 = async (buf: any, words: number, from = 0) => new Uint32Array(await bytes(buf, words, from));
  const compile = async (code: string, entries: string[]) => {
    const module = device.createShaderModule({ code });
    const info = await module.getCompilationInfo?.();
    for (const m of info?.messages ?? []) if (m.type === "error") throw new Error(`${entries.join("/")}: the shader failed to compile: ${m.message} (line ${m.lineNum}: ${code.split("\n")[m.lineNum - 1]})`);
    const entries_ = [...code.matchAll(/@binding\((\d+)\) var<storage, (read|read_write)>/g)].map(m => ({ binding: Number(m[1]), visibility: 4, buffer: { type: m[2] === "read" ? "read-only-storage" : "storage" } }));
    const group = device.createBindGroupLayout({ entries: entries_ });
    const layout = device.createPipelineLayout({ bindGroupLayouts: [group] });
    const out: Record<string, any> = {};
    for (const e of entries) out[e] = { pipe: device.createComputePipeline({ layout, compute: { module, entryPoint: e } }), group, name: e, piece: 1 << 10 };
    return out;
  };
  let longest = 0;
  /* one dispatch over n threads, P = the first seven parameters and P[7] each piece's first thread; the piece a kernel settles on is kept for its next dispatch */
  const run = async (kernel: any, params: number[], buffers: any[], n: number): Promise<{ busy: number; pieces: number }> => {
    let busy = 0, pieces = 0;
    for (let off = 0; off < n;) {
      const count = Math.min(kernel.piece, n - off);
      const P = upload(new Uint32Array([...params, 0, 0, 0, 0, 0, 0, 0].slice(0, 7).concat([off])));
      device.pushErrorScope("validation");
      const bind = device.createBindGroup({ layout: kernel.group, entries: [P, ...buffers].map((buffer, binding) => ({ binding, resource: { buffer } })) });
      const enc = device.createCommandEncoder();
      const pass = enc.beginComputePass();
      pass.setPipeline(kernel.pipe); pass.setBindGroup(0, bind);
      const groups = Math.ceil(count / 64);
      pass.dispatchWorkgroups(Math.min(groups, 1024), Math.ceil(groups / 1024));
      pass.end();
      const t0 = performance.now();
      device.queue.submit([enc.finish()]);
      await device.queue.onSubmittedWorkDone();
      const ms = performance.now() - t0;
      const bad = await device.popErrorScope();
      P.destroy();
      if (bad) throw new Error(`${kernel.name}: the device refused it: ${bad.message}`);
      longest = Math.max(longest, ms);
      busy += ms; pieces++;
      if (ms > LONGEST_MS) throw new Error(`${kernel.name}: one submission held the device ${ms.toFixed(0)} ms (limit ${LONGEST_MS}) - cut it finer before running again`);
      off += count;
      if (count === kernel.piece) kernel.piece = Math.max(64, Math.min(1 << 22, Math.floor(kernel.piece * Math.min(4, AIM_MS / Math.max(ms, 0.5)))));
      await new Promise(r => setTimeout(r, Math.max(4, ms)));
    }
    return { busy, pieces };
  };
  return { device, upload, blank, read, read_u32, compile, run, get longest() { return longest; } };
}
