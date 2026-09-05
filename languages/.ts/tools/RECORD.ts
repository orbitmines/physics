/**
 * RUN EVERY VISUAL'S WORLD ONCE AND KEEP IT — so that changing how a picture looks costs
 * seconds instead of the minutes its physics costs.
 *
 * `MEASURE.ts` does this for a field that does not move: run the model, write named columns,
 * and let the panels draw from disk. Its own header says why - "changing a colour takes
 * seconds, and tying the two together means every colour costs minutes" - and an ANIMATION is
 * the case that hurts, because it runs its world once per frame and there are hundreds.
 *
 * SO A RECORDING IS A MEASUREMENT, and that is the whole design. A visual that declares
 * `record` says what its frames are made of; this runs them and writes `<id>.frames` as an
 * ordinary field beside every other one. `RENDER` bakes it into the page the way it bakes the
 * rest, `CANVAS.played` hands it back a frame at a time, and nothing else changes.
 *
 * AND IT IS STAMPED WITH WHAT IT DEPENDS ON. The stamp is the visual's own - the constants,
 * the sizes, whatever it says its numbers rest on - and `played` ignores a film stamped
 * otherwise. A change to the physics can never be drawn from a stale recording, and a change
 * to the colours never re-runs the physics.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import type { Visual } from "../src/visuals/CANVAS.ts";

const HERE = import.meta.dirname;
const OUT = resolve(`${HERE}/../../../visuals`);
const NOT = new Set(["RENDER", "CANVAS", "FIGURES", "DATA", "LAW"]);

const gather = async (): Promise<Visual[]> => {
  const out: Visual[] = [];
  for (const f of readdirSync(`${HERE}/../src/visuals`).sort()) {
    if (!f.endsWith(".ts") || NOT.has(f.slice(0, -3))) continue;
    const mod: any = await import(`../src/visuals/${f}`);
    for (const v of [mod.default ?? []].flat()) if (v?.id) out.push(v);
  }
  return out;
};

const only = process.argv.slice(2);
const want = (id: string) => !only.length || only.some(o => id.includes(o));

console.log(`\n═════ recording → ${OUT}/<id>/frames.f32 ═════\n`);

let wrote = 0;
for (const v of await gather()) {
  if (!v.record || !want(v.id)) continue;
  const r = v.record;
  const names = Object.keys(r.channels);
  const width = names.reduce((n, k) => n + r.channels[k], 0);

  const t0 = Date.now();
  const all = new Float32Array(width * v.frames);
  const buf: Record<string, Float32Array> = {};
  for (const k of names) buf[k] = new Float32Array(r.channels[k]);

  r.start();
  for (let f = 0; f < v.frames; f++) {
    r.frame(buf);
    let at = f * width;
    for (const k of names) { all.set(buf[k], at); at += r.channels[k]; }
    if (f % 10 === 0)
      process.stdout.write(`\r  ${v.id.padEnd(24)} frame ${String(f).padStart(4)}/${v.frames}   `);
  }

  /*
   * ONE COLUMN AND A HEADER, because that is what every other field here is. The channels are
   * a STRIDE into it rather than columns of their own: a column is a quantity swept over rows
   * and these are quantities swept over frames, which is the same shape read the other way.
   */
  /* beside the film it is a recording of, not in a directory of its own */
  const dir = `${OUT}/${v.id}`;
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/frames.f32`, Buffer.from(all.buffer));
  writeFileSync(`${dir}/frames.json`, JSON.stringify({
    what: `${v.id}, frame by frame`,
    columns: ["frames"],
    rows: all.length,
    frames: v.frames,
    channels: r.channels,
    stamp: r.stamp,
    recorded: new Date().toISOString(),
    about: v.what,
  }, null, 2) + "\n");

  console.log(`\r  ${v.id.padEnd(24)} ${String(v.frames).padStart(4)} frames × ` +
    `${String(width).padStart(6)} numbers   ${(all.byteLength / 1024).toFixed(0).padStart(6)} KB` +
    `  ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  wrote++;
}

console.log(wrote
  ? `\n  ${wrote} recorded · \`npm run visuals\` now draws them without running anything\n`
  : `\n  nothing to record - a visual is recorded by declaring \`record\` on it\n`);
