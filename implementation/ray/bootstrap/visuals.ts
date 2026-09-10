/**
 * `ray visuals [ids...]` - records every film of `visuals/films.ts` (generated) with headless Chrome:
 * `visuals/<id>/animation.webm`, `snapshot.png` (the last frame), `frames.f32` + `frames.json` (the
 * marks of every frame: x, y, size, shade), and `index.html` (the page itself, playable).
 *
 * Host tooling, like the old RENDER.ts: the page is bundled with esbuild, Chrome is driven over the
 * DevTools protocol with Node's own WebSocket, and nothing else is installed.
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "..", "..", "..");
const require = createRequire(import.meta.url);

const FPS = 24;

async function bundle(entry: string): Promise<string> {
  const esbuild = require("esbuild");
  const r = await esbuild.build({
    entryPoints: [entry], bundle: true, write: false, format: "esm", platform: "browser", target: "es2022",
    absWorkingDir: repo, logLevel: "silent",
  });
  return r.outputFiles[0].text;
}

const page = (bundle: string, id: string, w: number, h: number) => `<!doctype html>
<meta charset="utf-8">
<title>${id}</title>
<style>html,body{margin:0;background:#08090d}canvas{display:block}</style>
<canvas id="c" width="${w}" height="${h}"></canvas>
<script>addEventListener("error", e => { globalThis.__error = String(e.message || e.error); });</script>
<script type="module">
${bundle}
const el = document.getElementById("c"), ctx = el.getContext("2d");
const __film = FILMS[${JSON.stringify(id)}]();
const W = el.width, H = el.height;
const frames = [];
let chunks = [];
const draw = (marks) => {
  ctx.fillStyle = "#08090d"; ctx.fillRect(0, 0, W, H);
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const m of marks) { if (m[0] < x0) x0 = m[0]; if (m[0] > x1) x1 = m[0]; if (m[1] < y0) y0 = m[1]; if (m[1] > y1) y1 = m[1]; }
  const span = Math.max(x1 - x0, y1 - y0, 1), cell = Math.min(W, H) / (span + 2);
  for (const [x, y, size, shade] of marks) {
    const px = (x - x0 + 1) * cell, py = H - (y - y0 + 1) * cell;
    const s = Math.min(1, Math.max(0, shade));
    ctx.fillStyle = "rgba(" + Math.round(80 + 175 * s) + "," + Math.round(120 + 100 * (1 - s)) + ",230," + (0.15 + 0.85 * Math.min(1, size)) + ")";
    ctx.beginPath(); ctx.arc(px, py, Math.max(1, cell * 0.35 * (0.4 + Math.min(1, size))), 0, 6.2832); ctx.fill();
  }
};
globalThis.__run = async () => {
  const stream = el.captureStream(${FPS});
  const rec = new MediaRecorder(stream, { mimeType: "video/webm" });
  rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
  rec.start();
  draw(__film.marks);
  for (let t = 0; t < __film.ticks; t++) {
    const marks = __film.frame;
    frames.push(marks.map(m => m.map(Number)));
    draw(marks);
    await new Promise(r => setTimeout(r, 1000 / ${FPS}));
  }
  rec.stop();
  const blob = await new Promise(res => { rec.onstop = () => res(new Blob(chunks, { type: "video/webm" })); });
  const buf = new Uint8Array(await blob.arrayBuffer());
  let bin = ""; for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
  globalThis.__result = { webm: btoa(bin), frames, ticks: __film.ticks, width: W, height: H };
  return true;
};
</script>`;

async function chrome(port: number) {
  const bin = process.env.CHROME ?? "google-chrome";
  const profile = `${tmpdir()}/ray-visuals-profile-${process.pid}`;
  let noise = "";
  const proc = spawn(bin, ["--headless=new", `--remote-debugging-port=${port}`, "--disable-gpu", "--hide-scrollbars", "--no-sandbox", "--autoplay-policy=no-user-gesture-required", `--user-data-dir=${profile}`, "about:blank"], { stdio: ["ignore", "ignore", "pipe"] });
  proc.stderr?.on("data", d => { noise += d; });
  proc.on("exit", code => { if (code !== null && code !== 0) console.error(`chrome exited with ${code}\n${noise.slice(-800)}`); });
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

export async function renderVisuals(ids: string[]) {
  const films = join(repo, "visuals", "films.ts");
  if (!existsSync(films)) throw new Error("no visuals/films.ts - run `ray gen` first");
  const bundled = await bundle(films);
  const all = [...bundled.matchAll(/^\s+"([^"]+)": \(\) =>/gm)].map(m => m[1]);
  const wanted = ids.length ? all.filter(i => ids.some(w => i.includes(w))) : all;
  if (!wanted.length) throw new Error(`no visual matches ${ids.join(", ")}; have ${all.join(", ")}`);
  const port = 9300 + Math.floor(Math.random() * 500);
  const { proc, ws, profile } = await chrome(port);
  try {
    for (const id of wanted) {
      const dir = join(repo, "visuals", id);
      mkdirSync(dir, { recursive: true });
      // the film's size is read off the page once it runs; the page is written at a default and the canvas resized by the film
      const html = page(bundled, id, 512, 512);
      writeFileSync(join(dir, "index.html"), html);
      const c = await cdp(ws);
      await c.send("Page.enable");
      await c.send("Emulation.setDeviceMetricsOverride", { width: 512, height: 512, deviceScaleFactor: 1, mobile: false });
      await c.send("Page.navigate", { url: "file://" + join(dir, "index.html") });
      await new Promise(r => setTimeout(r, 400));
      const err = await c.send("Runtime.evaluate", { expression: "globalThis.__error || null", returnByValue: true });
      if (err.result.value) throw new Error(`${id}: ${err.result.value}`);
      console.log(`recording ${id} ...`);
      // fire the run, then poll: a single long await lets Node's loop go idle and exit
      await c.send("Runtime.evaluate", { expression: "globalThis.__failed = null; globalThis.__run().catch(e => { globalThis.__failed = 'failed: ' + (e && e.stack || e); })" });
      const keep = setInterval(() => {}, 1000);
      try {
        const deadline = Date.now() + 3600_000;
        for (;;) {
          await new Promise(r => setTimeout(r, 1000));
          const st = await c.send("Runtime.evaluate", { expression: "globalThis.__failed || (globalThis.__result ? 'done' : 'running')", returnByValue: true });
          if (st.result.value === "done") break;
          if (st.result.value !== "running") throw new Error(`${id}: ${st.result.value}`);
          if (Date.now() > deadline) throw new Error(`${id}: recording took over an hour`);
        }
      } finally { clearInterval(keep); }
      const r = await c.send("Runtime.evaluate", { expression: "JSON.stringify({ ticks: __result.ticks, width: __result.width, height: __result.height, frames: __result.frames.length })", returnByValue: true });
      const meta = JSON.parse(r.result.value);
      const webm = await c.send("Runtime.evaluate", { expression: "__result.webm", returnByValue: true });
      writeFileSync(join(dir, "animation.webm"), Buffer.from(webm.result.value, "base64"));
      const frames = await c.send("Runtime.evaluate", { expression: "JSON.stringify(__result.frames)", returnByValue: true });
      const data: number[][][] = JSON.parse(frames.result.value);
      const counts = data.map(f => f.length);
      const flat = new Float32Array(counts.reduce((a, n) => a + n, 0) * 4);
      let k = 0;
      for (const f of data) for (const m of f) { flat[k++] = m[0]; flat[k++] = m[1]; flat[k++] = m[2]; flat[k++] = m[3]; }
      writeFileSync(join(dir, "frames.f32"), Buffer.from(flat.buffer));
      writeFileSync(join(dir, "frames.json"), JSON.stringify({ id, ...meta, columns: ["x", "y", "size", "shade"], marks_per_frame: counts, fps: FPS, generated: "npx ray visuals" }, null, 2));
      const shot = await c.send("Page.captureScreenshot", { format: "png" });
      writeFileSync(join(dir, "snapshot.png"), Buffer.from(shot.data, "base64"));
      c.close();
      console.log(` ${meta.frames} frames -> visuals/${id}/`);
    }
  } finally {
    proc.kill();
    try { rmSync(profile, { recursive: true, force: true }); } catch { /* chrome is letting go of it */ }
  }
}
