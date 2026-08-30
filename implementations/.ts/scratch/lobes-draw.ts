/**
 * CUT THE SAVED FIELD ANY WAY, WITHOUT RUNNING ANYTHING.
 *
 * `lobes.ts` writes the accumulated 3D difference whole. This reads it back and makes the
 * projections - and the point is that AZIMUTHAL INTEGRATION IS ONE CHOICE AMONG SEVERAL, not
 * the only way to draw a sphere. Binning by rho = hypot(x,y) merges every azimuth into one
 * radius, so a lobe at one azimuth is spread into a ring: it turns a cone into a circularised
 * cone. Every picture in this session did that, which is why everything came out as rings.
 *
 *   -meridian   the (x, z) PLANE at y ~ 0. Keeps azimuth; noisier, but a lobe stays a lobe.
 *   -equator    the (x, y) PLANE at z ~ 0. Where CYCLE seats should show as CYCLE lobes.
 *   -cone       the (x, y) plane at the cone's own height z = r cos(alpha), which is where the
 *               seats actually are - the equator is empty for a cone that is not equatorial.
 *   -ring       the old azimuthally integrated (rho, z), kept for the comparison
 *
 * usage: npx tsx scratch/lobes-draw.ts <tag> [slab-cells]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { png } from "../src/theorems/probes/png.ts";

const TAG = process.argv[2] ?? "a55p3m0s0.15";
const SLAB = Number(process.argv[3] ?? 3);         // how many cells thick a plane is
const dir = `/home/fadi/Desktop/orbitmines/physics/visuals/vacuum/lobes`;
const meta = JSON.parse(readFileSync(`${dir}/${TAG}.json`, "utf8"));
const { N, L, RMAX, alpha } = meta as { N: number; L: number; RMAX: number; alpha: number };
const b = readFileSync(`${dir}/${TAG}.f32`);
const f = Float64Array.from(new Float32Array(b.buffer, b.byteOffset, b.byteLength/4));
const at = (a: number, bb: number, c: number) =>
  (a<0||bb<0||c<0||a>=N||bb>=N||c>=N) ? 0 : f[(a*N+bb)*N+c];
const idx = (v: number) => Math.floor((v/L + 0.5)*N);

const PX = 720;
const paint = (get: (u: number, v: number) => number | null, name: string) => {
  const img = new Float64Array(PX*PX);
  let hi = 0;
  for (let j = 0; j < PX; j++) for (let i = 0; i < PX; i++) {
    const u = (i-(PX-1)/2)/((PX-1)/2)*RMAX, v = (j-(PX-1)/2)/((PX-1)/2)*RMAX;
    if (Math.hypot(u,v) > RMAX || Math.hypot(u,v) < 0.2) continue;
    const g = get(u, v); if (g === null) continue;
    img[j*PX+i] = g; hi = Math.max(hi, Math.abs(g));
  }
  const rgb = new Uint8Array(PX*PX*3);
  for (let k = 0; k < PX*PX; k++) {
    const t = Math.pow(Math.max(0, Math.min(1, Math.abs(img[k])/(hi||1))), 0.45);
    const st = [[6,8,14],[20,45,95],[70,130,200],[190,220,245],[255,205,140]];
    const ff = t*(st.length-1), k0 = Math.min(st.length-2, Math.floor(ff)), fr = ff-k0;
    const c = [0,1,2].map(q => st[k0][q] + (st[k0+1][q]-st[k0][q])*fr);
    const j = (k/PX)|0, i = k%PX, q = ((PX-1-j)*PX + i)*3;
    rgb[q]=c[0]|0; rgb[q+1]=c[1]|0; rgb[q+2]=c[2]|0;
  }
  writeFileSync(`${dir}/${TAG}-${name}.png`, Buffer.from(png(PX,PX,rgb),"base64"));
};

/** a plane, averaged over a slab a few cells thick so it is not one row of cells */
const plane = (which: "xz" | "xy", at0 = 0) => (u: number, v: number) => {
  let s = 0, k = 0;
  for (let d = -SLAB; d <= SLAB; d++) {
    const w = at0 + d*L/N;
    s += which === "xz" ? at(idx(u), idx(w), idx(v)) : at(idx(u), idx(v), idx(w));
    k++;
  }
  return s/k;
};
paint(plane("xz"), "meridian");
paint(plane("xy"), "equator");
/* the cone's own height: seats at pitch alpha sit at z = r cos(alpha), so the equator is empty
 * unless alpha is 90. Cut where the emission actually is. */
const zc = alpha > 0 && alpha < 89 ? 1.4 * Math.cos(alpha*Math.PI/180) : 0;
paint(plane("xy", zc), "cone");
/* and the old azimuthally integrated view, for the comparison */
paint((u, v) => {
  const rho = Math.abs(u); let s = 0, k = 0;
  for (let q = 0; q < 64; q++) {
    const ph = 2*Math.PI*(q+0.5)/64;
    s += at(idx(rho*Math.cos(ph)), idx(rho*Math.sin(ph)), idx(v)); k++;
  }
  return s/k;
}, "ring");
console.log(`${TAG}: alpha=${alpha} m=${meta.m} period=${meta.period} stir=${meta.stir}` +
  `  -> -meridian -equator -cone(z=${zc.toFixed(2)}) -ring`);
