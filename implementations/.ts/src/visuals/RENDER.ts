/**
 * THE RENDERER — every visual as a film and as a still, drawn by a real browser.
 *
 *   tsx src/visuals/RENDER.ts [filter…] [--stills]
 *
 * A visual is a `Painter`: `start()` makes the world, `frame(surface, dt)` draws it
 * and advances it. So the film IS the visual — the renderer calls `frame` once per
 * frame exactly as a browser's rAF loop would — and THE SNAPSHOT IS THE LAST FRAME,
 * the picture the animation has arrived at, not a re-run to some midpoint.
 *
 * WHY A BROWSER. The panels draw on a canvas and several of them run the model; a
 * headless Chrome is the canvas a reader's browser would use, so what lands on disk
 * is what they see. Chrome is driven over CDP with Node's own WebSocket — no
 * puppeteer, no playwright, nothing to install.
 */
import { spawn } from "child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { tmpdir } from "os";
import { fileURLToPath } from "url";
import { build } from "esbuild";

/*
 * WHERE THIS FILE IS, ON EVERY NODE THIS RUNS ON.
 *
 * `import.meta.dirname` landed in Node 20.11. Before that it is not an error — it
 * is `undefined`, so `readdirSync` is handed nothing and the registry dies with
 * "path must be of type string", while ROOT and `abs` quietly become paths
 * beginning "undefined/". `import.meta.url` has always been there, so the
 * directory is taken off it.
 */
const HERE = dirname(fileURLToPath(import.meta.url));

const ROOT = `${HERE}/../../../..`;
const OUT = resolve(`${ROOT}/visuals`);
const WORK = `${tmpdir()}/om-visuals-work-${process.pid}`;

const args = process.argv.slice(2);
const only = args.filter(a => !a.startsWith("--"));
const stillsOnly = args.includes("--stills");

const safe = (id: string) => id.replace(/[^\w.-]/g, "_");

/** the rate a film is written at, and the dt each frame is told it took */
const FPS = 24;

/*
 * WHETHER TO WAIT FOR A VISUAL'S AVERAGE BEFORE RECORDING IT, in seconds. OFF BY
 * DEFAULT, AND THE DEFAULT IS THE POINT.
 *
 * A PAGE NEVER WAITS. `Painter.frame` spends a slice of each frame on whatever the
 * visual still owes — that is how the panels work on screen, and why they start
 * drawing the moment they are scrolled to: they paint the average they have and say
 * so with the bar along the bottom. Recording them the same way makes the film show
 * what a reader sees, and takes as long as the film takes.
 *
 * Waiting is the OPTION, not the rule. `VISUALS_WARM_S=600 npm run visuals -- panels`
 * spends up to that long driving the warm-up to completion first, and every frame of
 * the film is then a finished average. It is minutes per panel; that is the price of
 * the average, and it is now something asked for rather than something walked into.
 */
const WARM_BUDGET_S = Number(process.env.VISUALS_WARM_S ?? 0);

/**
 * EVERY VISUAL THERE IS — READ OFF THE DIRECTORY, not a list kept by hand.
 *
 * A hand-kept registry is a list that goes stale silently: a visual gets ported, is
 * never added, and simply does not exist as far as anything downstream is concerned.
 * Every `*.ts` here that default-exports visuals is one, and every visual a theory
 * declares is one too.
 */
const NOT_VISUALS = new Set(["RENDER", "CANVAS", "FIGURES"]);

const registry = async () => {
  const out: { id: string; owner: string; from: string; name: string; v: any }[] = [];

  const files = readdirSync(HERE)
    .filter(f => f.endsWith(".ts") && !NOT_VISUALS.has(f.slice(0, -3)))
    .sort();
  for (const f of files) {
    const mod: any = await import(`./${f}`);
    for (const v of mod.default ?? [])
      out.push({ id: v.id, owner: "—", from: `./${f}`, name: v.id, v });
  }

  const theories: [string, string, any][] = [
    ["G", "G", (await import("../theories/G.ts")).G],
    ["G^XOR", "G_XOR", (await import("../theories/G^XOR.ts")).G_XOR],
    ["G^XOR*2", "G_XOR_2", (await import("../theories/G^XOR*2.ts")).G_XOR_2],
    ["G^CONSERVING", "G_CONSERVING", (await import("../theories/G^CONSERVING.ts")).G_CONSERVING],
    ["G^LABELLED", "G_LABELLED", (await import("../theories/G^LABELLED.ts")).G_LABELLED],
    ["G^PURE", "G_PURE", (await import("../theories/G^PURE.ts")).G_PURE],
  ];
  for (const [owner, binding, theory] of theories)
    for (const [name, v] of Object.entries(theory.visuals as Record<string, any>))
      out.push({ id: `${owner}.${name}`, owner, from: `${binding}@../theories/${owner}.ts`, name, v });

  return out;
};

/* ── a minimal CDP client, over Node's own WebSocket ───────────────────────── */

const cdp = async (url: string) => {
  const ws = new WebSocket(url);
  await new Promise<void>((res, rej) => {
    ws.addEventListener("open", () => res(), { once: true });
    ws.addEventListener("error", () => rej(new Error("could not open a CDP socket")), { once: true });
  });
  let id = 0;
  const pending = new Map<number, (v: any) => void>();
  ws.addEventListener("message", (e: MessageEvent) => {
    const m = JSON.parse(String(e.data));
    if (m.id && pending.has(m.id)) { pending.get(m.id)!(m); pending.delete(m.id); }
  });
  const call = (method: string, params: object = {}, sessionId?: string) =>
    new Promise<any>((res, rej) => {
      const n = ++id;
      pending.set(n, m => m.error ? rej(new Error(`${method}: ${m.error.message}`)) : res(m.result));
      ws.send(JSON.stringify({ id: n, method, params, ...(sessionId ? { sessionId } : {}) }));
    });
  /* SESSION-SCOPED: the browser endpoint does not take page commands at all */
  const { targetId } = await call("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await call("Target.attachToTarget", { targetId, flatten: true });
  return { send: (m: string, p: object = {}) => call(m, p, sessionId), close: () => ws.close() };
};

const chrome = async (port: number) => {
  const bin = process.env.CHROME ?? "google-chrome";
  const profile = `${tmpdir()}/om-visuals-profile-${process.pid}`;
  let noise = "";
  const proc = spawn(bin, [
    "--headless=new", `--remote-debugging-port=${port}`, "--disable-gpu",
    "--hide-scrollbars", "--no-sandbox", `--user-data-dir=${profile}`, "about:blank",
  ], { stdio: ["ignore", "ignore", "pipe"] });
  proc.stderr?.on("data", d => { noise += d; });

  const deadline = Date.now() + 20000;
  for (;;) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (r.ok) return { proc, ws: (await r.json()).webSocketDebuggerUrl as string, profile };
    } catch { /* not up yet */ }
    if (Date.now() > deadline) {
      proc.kill();
      throw new Error(`chrome did not start on ${port}. Set CHROME to a browser binary.\n${noise.slice(-600)}`);
    }
    await new Promise(r => setTimeout(r, 120));
  }
};

/* THE GENERATED ENTRY IMPORTS BY ABSOLUTE PATH. It is written to a scratch directory,
 * so a relative specifier would resolve against /tmp and find nothing. */
const abs = (rel: string) => `${HERE}/${rel}`.replace(/\/\.\//g, "/");

const entryFor = (v: { id: string; from: string; name: string }) => v.from.includes("@")
  ? (() => {
    const [binding, rel] = v.from.split("@");
    const file = abs(rel);
    return `import { ${binding} as T } from ${JSON.stringify(file)};
const v = (T as any).visuals[${JSON.stringify(v.name)}];
(globalThis as any).__visual = v;`;
  })()
  : `import all from ${JSON.stringify(abs(v.from))};
(globalThis as any).__visual = all.find((x: any) => x.id === ${JSON.stringify(v.id)});`;

/**
 * THE PAGE, AND THE ENCODER IS THE BROWSER'S OWN.
 *
 * A folder of PNGs is not an animation and is not small — the ten lattice pictures
 * came to 46 MB. The browser already has a video encoder in it, so the canvas is
 * captured as a stream and MediaRecorder writes VP9 into a WebM. Nothing has to be
 * installed and the result is one file a reader can open.
 *
 * THE STREAM IS DRIVEN AT ZERO FPS, which is what makes this exact: `captureStream(0)`
 * takes a frame only when it is asked to, so one `requestFrame` per `frame()` gives a
 * film with exactly the visual's own frames in it rather than whatever a wall clock
 * happened to catch.
 */
const page = (bundle: string, w: number, h: number) => `<!doctype html>
<meta charset="utf-8">
<style>html,body{margin:0;background:#08090d}canvas{display:block}</style>
<canvas id="c" width="${w}" height="${h}"></canvas>
<script>
/* a module that throws leaves no trace beyond the console, and the driver then
   reports only that its entry points are missing — so the reason is kept here */
addEventListener("error", e => { globalThis.__error = String(e.message || e.error); });
</script>
<script type="module">
${bundle}
const __el = document.getElementById("c");
const __ctx = __el.getContext("2d");
const __v = globalThis.__visual;
let __painter = null, __track = null, __rec = null, __chunks = [];

/* the __painter is made once and then DRIVEN, because frame() advances the world:
   re-making it per frame would restart the animation on every capture */
globalThis.__begin = () => { __painter = __v.paint(); __painter.start?.(); return true; };

/*
 * THE WARM-UP, IN SLICES, SO IT CAN BE WATCHED.
 *
 * A panel that averages has to arrive whole here — a film of a picture filling in is
 * a film of the wrong thing. But doing it inside one call is minutes with nothing
 * said, which the driver cannot tell from a hang and which was reported as one. The
 * painter hands control back between slices; this passes that on.
 */
globalThis.__warm = (budgetMs) =>
  __painter.warm ? __painter.warm(budgetMs) : 1;

/* a slice of whatever this painter needs before the first frame is honest, so the
   driver can print how far along it is instead of sitting inside one blocking call */
globalThis.__warm = (budgetMs) => __painter.warm ? __painter.warm(budgetMs) : 1;

globalThis.__record = (fps) => {
  const __stream = __el.captureStream(0);
  __track = __stream.getVideoTracks()[0];
  const __type = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"]
    .find(t => MediaRecorder.isTypeSupported(t));
  if (!__type) return false;
  __rec = new MediaRecorder(__stream, { mimeType: __type, videoBitsPerSecond: 2_000_000 });
  __rec.ondataavailable = e => { if (e.data.size) __chunks.push(e.data); };
  __rec.start();
  return __type;
};

globalThis.__step = (dt) => {
  __painter.frame({ ctx: __ctx, width: __el.width, height: __el.height }, dt);
  if (__track) __track.requestFrame();
  return true;
};

/*
 * THE WHOLE FILM, PACED IN REAL TIME AND RUN IN THE PAGE.
 *
 * MediaRecorder stamps by the WALL CLOCK, so pushing every frame as fast as the
 * driver can ask gives a film a few milliseconds long — eleven frames came back as a
 * 110-byte empty container. The loop therefore waits 1/fps between frames, which is
 * also what makes the recorded film play at the rate the visual was written for.
 * Running it here rather than one CDP call per frame is incidentally much faster.
 */
globalThis.__run = async (n, dt, fps, first) => {
  const wait = ms => new Promise(r => setTimeout(r, ms));
  if (!first) await wait(120);           // let the recorder actually start
  for (let f = 0; f < n; f++) {
    globalThis.__step(dt);
    await wait(1000 / fps);
  }
  return n;
};

/* the recorder is stamped by the wall clock, so the last frames need a moment to
   reach it — kept apart from __run now that a film is driven in several calls */
globalThis.__settle = () => new Promise(r => setTimeout(r, 160));

globalThis.__finish = () => new Promise(res => {
  if (!__rec) return res(null);
  __rec.requestData();
  __rec.onstop = async () => {
    const __blob = new Blob(__chunks, { type: __rec.mimeType });
    const __buf = new Uint8Array(await __blob.arrayBuffer());
    let s = "";
    for (let i = 0; i < __buf.length; i += 0x8000)
      s += String.fromCharCode.apply(null, __buf.subarray(i, i + 0x8000));
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

const contents = (rows: any[]) => `<!doctype html>
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
<div class="m"><div>${r.id} <span class="o">${r.owner === "—" ? "" : "· " + r.owner}</span></div>
<div class="w">${r.what}</div></div></a>`).join("")}</div>`;

(async () => {
  const all = await registry();
  const chosen = only.length ? all.filter(v => only.some(k => v.id.includes(k))) : all;
  if (!chosen.length) { console.log("no visuals matched"); return; }

  mkdirSync(OUT, { recursive: true });
  mkdirSync(WORK, { recursive: true });

  console.log(`\n═════ rendering ${chosen.length} visual${chosen.length === 1 ? "" : "s"} → ${OUT} ═════\n`);

  const port = 9222 + (process.pid % 400);
  const { proc, ws, profile } = await chrome(port);
  const client = await cdp(ws);
  await client.send("Page.enable");

  const index: any[] = [];

  for (const item of chosen) {
    const { id, owner, v } = item;
    const t0 = Date.now();

    const entry = `${WORK}/${safe(id)}.entry.ts`;
    writeFileSync(entry, entryFor(item));

    const bundled = await build({
      entryPoints: [entry], bundle: true, write: false, format: "esm",
      target: "es2022", platform: "browser", logLevel: "silent",
      absWorkingDir: `${HERE}`,
      /*
       * A THEORY IS NAMED AFTER ITSELF, and `G^XOR*2.ts` is a real file. esbuild reads
       * a `*` in a specifier as a glob and finds nothing, so the literal path is
       * resolved here rather than the file being renamed to suit the bundler.
       */
      plugins: [{
        name: "literal-paths",
        setup(b) {
          b.onResolve({ filter: /\*/ }, a => ({
            path: resolve(dirname(a.importer), a.path),
          }));
        },
      }],
    }).catch((e: any) => {
      for (const m of e.errors ?? []) console.log(`  !! ${id}: ${m.text}` + (m.location ? ` — ${m.location.file}:${m.location.line}` : ""));
      throw new Error(`could not bundle ${id}`);
    });

    const file = `${WORK}/${safe(id)}.html`;
    writeFileSync(file, page(bundled.outputFiles[0].text, v.width, v.height));

    await client.send("Emulation.setDeviceMetricsOverride",
      { width: v.width, height: v.height, deviceScaleFactor: 2, mobile: false });
    await client.send("Page.navigate", { url: `file://${file}` });

    for (let i = 0; i < 300; i++) {
      const r = await client.send("Runtime.evaluate", { expression: "!!globalThis.__ready" });
      if (r.result?.value) break;
      const bad = await client.send("Runtime.evaluate", { expression: "globalThis.__error || ''" });
      if (bad.result?.value) throw new Error(`${id}: the page failed — ${bad.result.value}`);
      await new Promise(r => setTimeout(r, 50));
    }

    const evaluate = async (expression: string) => {
      const r = await client.send("Runtime.evaluate", { expression, awaitPromise: true });
      if (r.exceptionDetails) {
        /* the whole of what the page said, including where — a description alone
         * arrives as an empty line and says nothing about which visual broke */
        const d = r.exceptionDetails;
        const where = d.stackTrace?.callFrames?.[0];
        throw new Error(`${id}: ${d.exception?.description ?? d.text ?? "threw"}` +
          (where ? ` — ${where.functionName || "(top level)"} line ${where.lineNumber}` : ""));
      }
      return r.result?.value;
    };
    /* A DROPPED FRAME MUST NOT LOSE THE RUN. One capture failed at frame 42 of 144
     * and took the whole render with it; the same frame wrote fine on a re-run. */
    const shoot = async (name: string) => {
      let last: unknown;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const shot = await client.send("Page.captureScreenshot", { format: "png" });
          mkdirSync(dirname(name), { recursive: true });
          writeFileSync(name, Buffer.from(shot.data, "base64"));
          return;
        } catch (e) { last = e; await new Promise(r => setTimeout(r, 150)); }
      }
      throw last;
    };

    const dir = `${OUT}/${safe(id)}`;
    mkdirSync(dir, { recursive: true });
    await evaluate("globalThis.__begin()");

    /*
     * WARMED WHERE IT SAYS IT NEEDS TO BE, and said out loud while it happens.
     *
     * `warm` returns how far along it is, 0 to 1. A visual with no average to build
     * has no `warm` and says 1 at once, so this costs it nothing.
     */
    let done = await evaluate("globalThis.__warm(400)");
    if (typeof done === "number" && done < 1) {
      const w0 = Date.now();
      let last = -1;
      while (done < 1) {
        done = await evaluate("globalThis.__warm(400)");
        const pct = Math.floor(done * 10);
        if (pct !== last) {
          last = pct;
          process.stdout.write(`\r  ${id.padEnd(26)} warming ${(done * 100).toFixed(0)}%   `);
        }
      }
      process.stdout.write(`\r  ${id.padEnd(26)} warmed in ${((Date.now() - w0) / 1000).toFixed(1)}s      \n`);
    }

    /*
     * THE AVERAGE UP FRONT — ONLY IF IT WAS ASKED FOR.
     *
     * `Painter.warm` is the same work `frame` does a slice of; driving it from here
     * just does it all before the recorder starts. Off by default, because a page does
     * not do it either and a render that waits on it is minutes per panel with nothing
     * said — which is exactly what it was taken for, a hang. When it is on, the line
     * below is rewritten as it goes, so the wait is visible and has an end.
     */
    if (WARM_BUDGET_S > 0) {
      const warmedBy = Date.now() + WARM_BUDGET_S * 1000;
      let done = await evaluate("globalThis.__warm(0)"), warming = false;
      while (done < 1) {
        done = await evaluate("globalThis.__warm(250)");
        warming = true;
        if (process.stdout.isTTY)
          process.stdout.write(`\r  ${id.padEnd(26)} warming ${(done * 100).toFixed(0).padStart(3)}%` +
            `  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
        if (done < 1 && Date.now() > warmedBy) throw new Error(
          `${id}: still warming (${(done * 100).toFixed(0)}%) after ${WARM_BUDGET_S}s. Give it ` +
          `longer with VISUALS_WARM_S, or leave it unset and record it as a page shows it.`);
      }
      if (warming && process.stdout.isTTY) process.stdout.write("\r" + " ".repeat(64) + "\r");
    }

    const codec = stillsOnly ? null : await evaluate(`globalThis.__record(${FPS})`);
    if (!stillsOnly && !codec) throw new Error(`${id}: this browser has no WebM encoder`);

    /*
     * THE FILM FIRST, THEN THE STILL. frame() advances the world, so the frames have
     * to be taken in order — and the snapshot is simply where that leaves it.
     */
    /*
     * DRIVEN IN CHUNKS SO THE FRAMES CAN BE COUNTED OUT LOUD.
     *
     * A frame of a cheap visual is a millisecond and a frame of a panel is a tick of
     * two 121² worlds, and the whole film used to be ONE call: for the second kind
     * that is minutes in which the render says nothing at all, right after it has
     * finished saying something — which reads as having got stuck at whatever it last
     * printed. The pacing that makes the film play at the rate it was written for is
     * still in the page, where it has to be; only the reporting comes back here.
     */
    const dt = 1 / FPS;
    const CHUNK = 10;
    for (let f = 0; f < v.frames; f += CHUNK) {
      const n = Math.min(CHUNK, v.frames - f);
      if (stillsOnly) for (let i = 0; i < n; i++) await evaluate(`globalThis.__step(${dt})`);
      else await evaluate(`globalThis.__run(${n}, ${dt}, ${FPS}, ${f})`);
      if (process.stdout.isTTY && Date.now() - t0 > 4000)
        process.stdout.write(`\r  ${id.padEnd(26)} frame ${String(f + n).padStart(4)}/${v.frames}` +
          `  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
    if (!stillsOnly) await evaluate("globalThis.__settle()");
    if (process.stdout.isTTY) process.stdout.write("\r" + " ".repeat(64) + "\r");

    let bytes = 0;
    if (!stillsOnly) {
      const b64 = await evaluate("globalThis.__finish()");
      if (!b64) throw new Error(`${id}: the recorder produced nothing`);
      const film = Buffer.from(b64, "base64");
      writeFileSync(`${dir}/animation.webm`, film);
      bytes = film.length;
      writeFileSync(`${dir}/index.html`, player(id, v));
    }
    await shoot(`${dir}/snapshot.png`);

    index.push({ id, owner, what: v.what, frames: v.frames });
    console.log(`  ${id.padEnd(26)} ${String(v.width).padStart(4)}×${String(v.height).padStart(4)}` +
      `  ${String(v.frames).padStart(4)} frames` +
      (bytes ? `  ${(bytes / 1024).toFixed(0).padStart(5)} KB` : "  (still only)") +
      `  ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  }

  /*
   * THE GALLERY IS EVERY VISUAL THAT HAS BEEN RENDERED, not only the ones this run
   * touched — otherwise `RENDER.ts sheet` leaves an index with one card in it and
   * every other picture becomes unreachable. Same rule as the report's merge.
   */
  writeFileSync(`${OUT}/index.html`, contents(
    all.filter(v => existsSync(`${OUT}/${safe(v.id)}/animation.webm`))
      .map(v => ({ id: v.id, owner: v.owner, what: v.v.what, frames: v.v.frames }))));
  client.close();
  proc.kill();
  /* chrome is still letting go of its profile; a failed tidy-up is not a failed run */
  for (const d of [WORK, profile])
    try { rmSync(d, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }); }
    catch { /* it is a scratch directory in /tmp */ }
  console.log(`\n  ${index.length} written · open ${OUT}/index.html\n`);
})();
