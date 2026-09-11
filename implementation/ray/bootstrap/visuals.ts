/**
 * `ray visuals [ids...] [--stills] [--record]` - every visual the theories declare (Visual.ray), as a film
 * and as a still, drawn by a real browser:
 *
 *   visuals/<id>/frames.f32 + frames.json   the recording behind a film - its world run once, frame by
 *                                           frame, into named channels (stale or missing: recorded first)
 *   visuals/<id>/animation.webm             the film, 24 frames a second, VP9 by the browser's own encoder
 *   visuals/<id>/snapshot.png               THE LAST FRAME - the picture the animation arrives at
 *   visuals/<id>/index.html                 a player for it
 *   visuals/index.html                      the contents page, every visual that has been rendered
 *
 * `ray measure [names...]` runs the model on the generated package and writes `visuals/<id>/field.f32`
 * + `meta.json` (galaxy.point, galaxy.many, law) - the half of a picture that is physics, measured once.
 *
 * Host tooling, like the old RENDER.ts/RECORD.ts/MEASURE.ts: the generated `visuals/visuals.ts` runs
 * under node here (recording, measuring) and, bundled with esbuild, in headless Chrome driven over the
 * DevTools protocol with Node's own WebSocket. What was measured is put in the page before anything
 * runs (`globalThis.__measured`), since a browser has no filesystem.
 */
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "..", "..", "..");
const require = createRequire(import.meta.url);
const OUT = join(repo, "visuals");

/** the rate a film is written at, and the dt each frame is told it took */
const FPS = 24;
const safe = (id: string) => id.replace(/[^\w.-]/g, "_");
const pad = (s: string, n: number) => s.padEnd(n);

/* ── what is on disk: every column file, as `{ header, bytes }` by name ──────────────────────── */

type Baked = Record<string, { header: any; bytes: Uint8Array }>;

/**
 * TWO DIRECTORIES, ONE NAMESPACE. `visuals/` is what this model measured, `data/` is what `ray data`
 * fetched from the people who observed it; both are named columns and a header. `field` is what was
 * measured of a thing; `<id>.frames` is that thing frame by frame - a recording kept beside the film it
 * is a recording of.
 */
function baked(): Baked {
  const out: Baked = {};
  for (const root of [OUT, join(repo, "data")]) {
    if (!existsSync(root)) continue;
    for (const id of readdirSync(root).sort()) {
      for (const [suffix, stem, meta] of [["", "field", "meta"], [".frames", "frames", "frames"]] as const) {
        const f = join(root, id, `${stem}.f32`), h = join(root, id, `${meta}.json`);
        if (!existsSync(f) || !existsSync(h)) continue;
        const bytes = readFileSync(f);
        out[id + suffix] = { header: JSON.parse(readFileSync(h, "utf8")), bytes: new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength) };
      }
    }
  }
  return out;
}

/** the host's half of `Measured` under node: what is on disk, and a writer for `Measured.save` */
function installMeasured() {
  const all = baked();
  (globalThis as any).__measured = all;
  (globalThis as any).__measured_save = (where: string, id: string, what: string, names: string[], columns: any, extra: any) => {
    const rows = columns[names[0]].length;
    const flat = new Float32Array(names.length * rows);
    names.forEach((n, i) => flat.set(columns[n], i * rows));
    const header = { what, columns: names, rows, measured: new Date().toISOString(), ...(extra ?? {}) };
    const dir = join(repo, where, id);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "field.f32"), Buffer.from(flat.buffer));
    writeFileSync(join(dir, "meta.json"), JSON.stringify(header, null, 2) + "\n");
    all[id] = { header, bytes: new Uint8Array(flat.buffer) };
    console.log(`  ${pad(id, 14)} ${String(rows).padStart(6)} rows × ${names.length} columns (${names.join(", ")})  →  ${where}/${id}/field.f32`);
  };
  return all;
}

async function loadVisuals() {
  const file = join(OUT, "visuals.ts");
  if (!existsSync(file)) throw new Error("no visuals/visuals.ts - run `ray gen` first");
  return await import(file) as { VISUALS: Record<string, () => any> };
}

/* ── the recording: a film's world run once, frame by frame, into its channels ───────────────── */

/**
 * A RECORDING IS A MEASUREMENT: one column and a header, the channels a stride into it. It is stamped
 * with what it depends on, and `Picture.played` ignores a film stamped otherwise - so a change to the
 * physics can never be drawn from a stale recording, and a change to the colours never re-runs it.
 */
function fresh(all: Baked, v: any): boolean {
  const r = v.record;
  const film = all[`${v.id}.frames`];
  return !!film && film.header.stamp === r.stamp && film.header.rows === r.width * v.frames;
}

/**
 * ON THE DEVICE WHERE THERE IS ONE: a film of the continuous reading is run by `record.gpu.ts` under
 * Deno's WebGPU - the same numbers the CPU field gives (the agreement is tested), in seconds rather
 * than the better part of an hour. Without deno, or a device, the CPU field records it here.
 */
function record(all: Baked, v: any) {
  if (v.record?.p && process.env.RAY_CPU_RECORD !== "1") {
    const r = spawnSync("deno", ["run", "--unstable-webgpu", "--allow-all", join(here, "record.gpu.ts"), repo, v.id], { stdio: "inherit" });
    if (r.status === 0) {
      const dir = join(OUT, safe(v.id));
      const bytes = readFileSync(join(dir, "frames.f32"));
      all[`${v.id}.frames`] = { header: JSON.parse(readFileSync(join(dir, "frames.json"), "utf8")), bytes: new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength) };
      return;
    }
    console.log(`  ${pad(v.id, 26)} no device to record on (${r.error?.message ?? `deno exited ${r.status}`}) - recording on the CPU`);
  }
  recordCPU(all, v);
}

function recordCPU(all: Baked, v: any) {
  const r = v.record;
  const names: string[] = r.names, sizes: number[] = r.sizes;
  const width = sizes.reduce((n, k) => n + k, 0);
  const t0 = Date.now();
  const flat = new Float32Array(width * v.frames);
  const buf: Record<string, Float32Array> = {};
  names.forEach((k, i) => { buf[k] = new Float32Array(sizes[i]); });
  r.start;                                       // a zero-argument Ray method is a getter
  for (let f = 0; f < v.frames; f++) {
    r.frame(buf);
    let at = f * width;
    names.forEach((k, i) => { flat.set(buf[k], at); at += sizes[i]; });
    if (process.stdout.isTTY && f % 5 === 0)
      process.stdout.write(`\r  ${pad(v.id, 26)} recording frame ${String(f).padStart(4)}/${v.frames}  ${((Date.now() - t0) / 1000).toFixed(0)}s   `);
  }
  const channels: Record<string, number> = {};
  names.forEach((k, i) => { channels[k] = sizes[i]; });
  const header = {
    what: `${v.id}, frame by frame`, columns: ["frames"], rows: flat.length, frames: v.frames,
    channels, stamp: r.stamp, recorded: new Date().toISOString(), about: v.what,
  };
  const dir = join(OUT, safe(v.id));
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "frames.f32"), Buffer.from(flat.buffer));
  writeFileSync(join(dir, "frames.json"), JSON.stringify(header, null, 2) + "\n");
  all[`${v.id}.frames`] = { header, bytes: new Uint8Array(flat.buffer) };
  if (process.stdout.isTTY) process.stdout.write("\r" + " ".repeat(72) + "\r");
  console.log(`  ${pad(v.id, 26)} recorded ${String(v.frames).padStart(4)} frames × ${String(width).padStart(7)} numbers  ${(flat.byteLength / 1024).toFixed(0).padStart(6)} KB  ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}

/* ── the page: the bundle, the canvas, and the browser's own encoder ─────────────────────────── */

async function bundle(entry: string, banner: string): Promise<string> {
  const esbuild = require("esbuild");
  const r = await esbuild.build({
    entryPoints: [entry], bundle: true, write: false, format: "esm", platform: "browser", target: "es2022",
    absWorkingDir: repo, logLevel: "silent", banner: { js: banner },
  }).catch((e: any) => {
    for (const m of e.errors ?? []) console.log(`  !! ${m.text}` + (m.location ? ` — ${m.location.file}:${m.location.line}` : ""));
    throw new Error("could not bundle visuals/visuals.ts");
  });
  return r.outputFiles[0].text;
}

/** what a visual draws from, put in the page before anything runs: base64, decoded once on load */
function banner(all: Baked, only: string[]): string {
  const rows: string[] = [];
  for (const [name, m] of Object.entries(all)) {
    if (!only.includes(name)) continue;
    rows.push(`  ${JSON.stringify(name)}: { header: ${JSON.stringify(m.header)}, bytes: __b64(${JSON.stringify(Buffer.from(m.bytes).toString("base64"))}) }`);
  }
  return `const __b64 = (s) => { const b = atob(s), a = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return a; };\n` +
    `globalThis.__measured = {\n${rows.join(",\n")}\n};\n`;
}

/*
 * THE SURFACE IS THE CANVAS. Visual.ray names the operations a picture is made of; this is the one
 * implementation, on a 2D context. A zero-argument Ray method is emitted as a getter, so `s.stroke`
 * is a property read here.
 */
const page = (code: string, id: string, w: number, h: number) => `<!doctype html>
<meta charset="utf-8">
<title>${id}</title>
<style>html,body{margin:0;background:#08090d}canvas{display:block}</style>
<canvas id="c" width="${w}" height="${h}"></canvas>
<script>addEventListener("error", e => { globalThis.__error = String(e.message || e.error); });</script>
<script type="module">
${code}
const __el = document.getElementById("c"), __ctx = __el.getContext("2d");
class CanvasSurface extends Surface {
  constructor(ctx, width, height) { super({ width, height }); this.ctx = ctx; }
  fill_style(c) { this.ctx.fillStyle = c; return null; }
  stroke_style(c) { this.ctx.strokeStyle = c; return null; }
  line_width(w) { this.ctx.lineWidth = w; return null; }
  alpha(a) { this.ctx.globalAlpha = a; return null; }
  fill_rect(x, y, w, h) { this.ctx.fillRect(x, y, w, h); return null; }
  stroke_rect(x, y, w, h) { this.ctx.strokeRect(x, y, w, h); return null; }
  clear_rect(x, y, w, h) { this.ctx.clearRect(x, y, w, h); return null; }
  get begin_path() { this.ctx.beginPath(); return null; }
  move_to(x, y) { this.ctx.moveTo(x, y); return null; }
  line_to(x, y) { this.ctx.lineTo(x, y); return null; }
  arc(x, y, r, a0, a1) { this.ctx.arc(x, y, r, a0, a1); return null; }
  get stroke() { this.ctx.stroke(); return null; }
  get fill() { this.ctx.fill(); return null; }
  font(f) { this.ctx.font = f; return null; }
  text_align(a) { this.ctx.textAlign = a; return null; }
  text_baseline(b) { this.ctx.textBaseline = b; return null; }
  fill_text(t, x, y) { this.ctx.fillText(t, x, y); return null; }
  measure(t) { return this.ctx.measureText(t).width; }
  get save() { this.ctx.save(); return null; }
  get restore() { this.ctx.restore(); return null; }
  translate(x, y) { this.ctx.translate(x, y); return null; }
  rotate(a) { this.ctx.rotate(a); return null; }
  dash(segments) { this.ctx.setLineDash(segments); return null; }
  gradient_stroke(x0, x1, stops, at) {
    const g = this.ctx.createLinearGradient(x0, 0, x1, 0);
    stops.forEach((c, i) => g.addColorStop(at[i], c));
    this.ctx.strokeStyle = g; return null;
  }
}
const __surface = new CanvasSurface(__ctx, __el.width, __el.height);
const __v = VISUALS[${JSON.stringify(id)}]();
let __painter = null, __track = null, __rec = null, __chunks = [];

/* the painter is made once and then DRIVEN, because frame() advances the world */
globalThis.__begin = () => { __painter = __v.painter; __painter.start; return true; };
/* a slice of whatever this painter needs before the first frame is honest, 0 to 1 */
globalThis.__warm = (budgetMs) => __painter.warm(budgetMs);

globalThis.__record = (fps) => {
  const __stream = __el.captureStream(0);
  __track = __stream.getVideoTracks()[0];
  const __type = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"].find(t => MediaRecorder.isTypeSupported(t));
  if (!__type) return false;
  __rec = new MediaRecorder(__stream, { mimeType: __type, videoBitsPerSecond: 2_000_000 });
  __rec.ondataavailable = e => { if (e.data.size) __chunks.push(e.data); };
  __rec.start();
  return __type;
};
globalThis.__step = (dt) => { __painter.frame(__surface, dt); if (__track) __track.requestFrame(); return true; };
/*
 * THE FILM, PACED IN REAL TIME AND RUN IN THE PAGE: MediaRecorder stamps by the wall clock, so the loop
 * waits 1/fps between frames, which is also what makes the film play at the rate it was written for.
 */
globalThis.__run = async (n, dt, fps, first) => {
  const wait = ms => new Promise(r => setTimeout(r, ms));
  if (!first) await wait(120);
  for (let f = 0; f < n; f++) { globalThis.__step(dt); await wait(1000 / fps); }
  return n;
};
globalThis.__settle = () => new Promise(r => setTimeout(r, 160));
globalThis.__finish = () => new Promise(res => {
  if (!__rec) return res(null);
  __rec.requestData();
  __rec.onstop = async () => {
    const __blob = new Blob(__chunks, { type: __rec.mimeType });
    const __buf = new Uint8Array(await __blob.arrayBuffer());
    let s = "";
    for (let i = 0; i < __buf.length; i += 0x8000) s += String.fromCharCode.apply(null, __buf.subarray(i, i + 0x8000));
    res(btoa(s));
  };
  __rec.stop();
});
globalThis.__ready = true;
</script>`;

const player = (id: string, v: any) => `<!doctype html>
<meta charset="utf-8"><title>${id}</title>
<style>body{margin:0;background:#08090d;color:#e8ecf4;font:13px ui-monospace,monospace;
display:flex;flex-direction:column;align-items:center;gap:12px;padding:24px}
video,img{max-width:100%;background:#08090d}a{color:#3ddcff}</style>
<h3>${id}</h3><p style="color:#5a6478;max-width:74ch;text-align:center;line-height:1.6">${v.what}</p>
<video src="animation.webm" autoplay loop muted playsinline controls></video>
<div>${v.frames} frames · <a href="animation.webm" download>webm</a>
 · <a href="snapshot.png" download>last frame</a>
 · <a href="../index.html">all visuals</a></div>`;

const contents = (rows: { id: string; what: string }[]) => `<!doctype html>
<meta charset="utf-8"><title>visuals</title>
<style>body{margin:0;background:#08090d;color:#e8ecf4;font:13px ui-monospace,monospace;padding:32px}
h1{font-size:17px;letter-spacing:.05em}a{color:inherit;text-decoration:none}
p.n{color:#5a6478;max-width:80ch;line-height:1.6}
.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(400px,1fr));gap:22px;margin-top:26px}
.c{border:1px solid #1b2130;border-radius:8px;overflow:hidden;background:#0b0d12;display:block}
video,img{width:100%;display:block;background:#08090d}.m{padding:12px 14px}.w{color:#5a6478;margin-top:6px;line-height:1.55}
.o{color:#ff7a45;font-size:11px}</style>
<h1>VISUALS</h1>
<p class="n">Every one is a picture of the model. The still is the LAST frame of its own
animation — the picture it arrives at — so a still and a film cannot disagree.</p>
<div class="g">${rows.map(r => `<a class="c" href="${safe(r.id)}/index.html">
<video src="${safe(r.id)}/animation.webm" poster="${safe(r.id)}/snapshot.png"
autoplay loop muted playsinline></video>
<div class="m"><div>${r.id} <span class="o"></span></div>
<div class="w">${r.what}</div></div></a>`).join("")}</div>`;

/* ── chrome, over the DevTools protocol ──────────────────────────────────────────────────────── */

async function chrome(port: number) {
  const bin = process.env.CHROME ?? "google-chrome";
  const profile = `${tmpdir()}/ray-visuals-profile-${process.pid}`;
  let noise = "";
  const proc = spawn(bin, ["--headless=new", `--remote-debugging-port=${port}`, "--disable-gpu", "--hide-scrollbars", "--no-sandbox", "--autoplay-policy=no-user-gesture-required", `--user-data-dir=${profile}`, "about:blank"], { stdio: ["ignore", "ignore", "pipe"] });
  proc.stderr?.on("data", d => { noise += d; });
  const deadline = Date.now() + 20000;
  for (;;) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (r.ok) return { proc, ws: (await r.json()).webSocketDebuggerUrl as string, profile };
    } catch { /* not up yet */ }
    if (Date.now() > deadline) { proc.kill(); throw new Error(`chrome did not start on ${port}. Set CHROME to a browser binary.\n${noise.slice(-600)}`); }
    await new Promise(r => setTimeout(r, 120));
  }
}

async function cdp(url: string) {
  const ws = new WebSocket(url);
  await new Promise<void>((res, rej) => { ws.onopen = () => res(); ws.onerror = e => rej(e); });
  let id = 0;
  const pending = new Map<number, (m: any) => void>();
  ws.onmessage = ev => { const m = JSON.parse(String(ev.data)); if (m.id && pending.has(m.id)) { pending.get(m.id)!(m); pending.delete(m.id); } };
  ws.onclose = ev => { for (const [, f] of pending) f({ error: { message: `the browser connection closed (${ev.code})` } }); pending.clear(); };
  const call = (method: string, params: object = {}, sessionId?: string) => new Promise<any>((res, rej) => {
    const n = ++id;
    pending.set(n, m => m.error ? rej(new Error(`${method}: ${m.error.message}`)) : res(m.result));
    ws.send(JSON.stringify({ id: n, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
  const { targetId } = await call("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await call("Target.attachToTarget", { targetId, flatten: true });
  return { send: (m: string, p: object = {}) => call(m, p, sessionId), close: () => ws.close() };
}

/* ── the commands ────────────────────────────────────────────────────────────────────────────── */

export async function measure(names: string[]) {
  installMeasured();
  await loadVisuals();                             // installs Measured's host on the package
  const physics: any = await import(join(repo, "languages", "physics.ts", "index.ts"));
  console.log(`\n═════ measuring → visuals/<id>/field.f32 ═════\n`);
  const t0 = Date.now();
  const want = (n: string) => !names.length || names.some(o => n.includes(o));
  const cpu: string[] = [];
  /* the two densities are millions of evaluations: on the device where there is one (measure.gpu.ts), else the CPU sweep */
  for (const [id, how] of [["galaxy.point", "gathered"], ["galaxy.many", "scattered"]]) {
    if (!want(id)) continue;
    if (process.env.RAY_CPU_MEASURE !== "1") {
      const r = spawnSync("deno", ["run", "--unstable-webgpu", "--allow-all", join(here, "measure.gpu.ts"), repo, id, how], { stdio: "inherit" });
      if (r.status === 0) continue;
      console.log(`  ${pad(id, 14)} no device to sweep on (${r.error?.message ?? `deno exited ${r.status}`}) - sweeping on the CPU`);
    }
    cpu.push(id);
  }
  if (cpu.length || want("law")) physics.Measure.run(physics.G, [...cpu, ...(want("law") ? ["law"] : [])]);
  console.log(`\n  measured in ${((Date.now() - t0) / 1000).toFixed(1)}s\n`);
}

export async function renderVisuals(args: string[]) {
  const ids = args.filter(a => !a.startsWith("--"));
  const stillsOnly = args.includes("--stills");
  const rerecord = args.includes("--record");
  const all = installMeasured();
  const { VISUALS } = await loadVisuals();
  const every = Object.keys(VISUALS);
  const wanted = ids.length ? every.filter(i => ids.some(w => i.includes(w))) : every;
  if (!wanted.length) throw new Error(`no visual matches ${ids.join(", ")}; have ${every.join(", ")}`);
  mkdirSync(OUT, { recursive: true });
  const work = `${tmpdir()}/ray-visuals-work-${process.pid}`;
  mkdirSync(work, { recursive: true });
  console.log(`\n═════ rendering ${wanted.length} visual${wanted.length === 1 ? "" : "s"} → ${OUT} ═════\n`);

  const port = 9300 + Math.floor(Math.random() * 500);
  const { proc, ws, profile } = await chrome(port);
  try {
    const client = await cdp(ws);
    await client.send("Page.enable");
    for (const id of wanted) {
      const t0 = Date.now();
      const v = VISUALS[id]();
      /* the recording first, where the film has one and it is stale or asked for again */
      if (v.record && (rerecord || !fresh(all, v))) record(all, v);

      const entry = `${work}/${safe(id)}.entry.ts`;
      writeFileSync(entry, `import * as __visuals from ${JSON.stringify(join(OUT, "visuals.ts"))};\nimport * as __physics from ${JSON.stringify(join(repo, "languages", "physics.ts", "index.ts"))};\nglobalThis.VISUALS = __visuals.VISUALS;\nglobalThis.Surface = __physics.Surface;\n`);
      const needs = Object.keys(all).filter(n => !n.endsWith(".frames") || n === `${id}.frames`);
      const code = await bundle(entry, banner(all, needs));
      const file = `${work}/${safe(id)}.html`;
      writeFileSync(file, page(code, id, v.width, v.height));

      await client.send("Emulation.setDeviceMetricsOverride", { width: v.width, height: v.height, deviceScaleFactor: 2, mobile: false });
      await client.send("Page.navigate", { url: `file://${file}` });
      for (let i = 0; i < 600; i++) {
        const r = await client.send("Runtime.evaluate", { expression: "!!globalThis.__ready" });
        if (r.result?.value) break;
        const bad = await client.send("Runtime.evaluate", { expression: "globalThis.__error || ''" });
        if (bad.result?.value) throw new Error(`${id}: the page failed — ${bad.result.value}`);
        await new Promise(r => setTimeout(r, 50));
      }
      const evaluate = async (expression: string) => {
        const r = await client.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
        if (r.exceptionDetails) {
          const d = r.exceptionDetails, where = d.stackTrace?.callFrames?.[0];
          throw new Error(`${id}: ${d.exception?.description ?? d.text ?? "threw"}` + (where ? ` — ${where.functionName || "(top level)"} line ${where.lineNumber}` : ""));
        }
        return r.result?.value;
      };
      const shoot = async (name: string) => {
        let last: unknown;
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            const shot = await client.send("Page.captureScreenshot", { format: "png" });
            writeFileSync(name, Buffer.from(shot.data, "base64"));
            return;
          } catch (e) { last = e; await new Promise(r => setTimeout(r, 150)); }
        }
        throw last;
      };

      const dir = join(OUT, safe(id));
      mkdirSync(dir, { recursive: true });
      await evaluate("globalThis.__begin()");
      /* warmed where it says it needs to be, and said out loud while it happens */
      let done = await evaluate("globalThis.__warm(400)");
      while (typeof done === "number" && done < 1) {
        done = await evaluate("globalThis.__warm(400)");
        if (process.stdout.isTTY) process.stdout.write(`\r  ${pad(id, 26)} warming ${(done * 100).toFixed(0)}%   `);
      }
      const codec = stillsOnly ? null : await evaluate(`globalThis.__record(${FPS})`);
      if (!stillsOnly && !codec) throw new Error(`${id}: this browser has no WebM encoder`);
      /* the film first, then the still: frame() advances the world, and the snapshot is where that leaves it */
      const dt = 1 / FPS, CHUNK = 10;
      for (let f = 0; f < v.frames; f += CHUNK) {
        const n = Math.min(CHUNK, v.frames - f);
        if (stillsOnly) for (let i = 0; i < n; i++) await evaluate(`globalThis.__step(${dt})`);
        else await evaluate(`globalThis.__run(${n}, ${dt}, ${FPS}, ${f})`);
        if (process.stdout.isTTY && Date.now() - t0 > 4000)
          process.stdout.write(`\r  ${pad(id, 26)} frame ${String(f + n).padStart(4)}/${v.frames}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
      }
      if (!stillsOnly) await evaluate("globalThis.__settle()");
      if (process.stdout.isTTY) process.stdout.write("\r" + " ".repeat(64) + "\r");
      let bytes = 0;
      if (!stillsOnly) {
        const b64 = await evaluate("globalThis.__finish()");
        if (!b64) throw new Error(`${id}: the recorder produced nothing`);
        const film = Buffer.from(b64, "base64");
        writeFileSync(join(dir, "animation.webm"), film);
        bytes = film.length;
        writeFileSync(join(dir, "index.html"), player(id, v));
      }
      await shoot(join(dir, "snapshot.png"));
      console.log(`  ${pad(id, 26)} ${String(v.width).padStart(4)}×${String(v.height).padStart(4)}  ${String(v.frames).padStart(4)} frames` +
        (bytes ? `  ${(bytes / 1024).toFixed(0).padStart(5)} KB` : "  (still only)") + `  ${((Date.now() - t0) / 1000).toFixed(1)}s`);
    }
    /* the gallery is every visual that has been rendered, not only the ones this run touched */
    writeFileSync(join(OUT, "index.html"), contents(every.filter(id => existsSync(join(OUT, safe(id), "animation.webm"))).map(id => ({ id, what: VISUALS[id]().what }))));
    client.close();
  } finally {
    proc.kill();
    for (const d of [work, profile]) try { rmSync(d, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }); } catch { /* scratch */ }
  }
  console.log(`\n  open ${OUT}/index.html\n`);
}
