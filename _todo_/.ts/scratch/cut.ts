/**
 * CUT ANY SAVED FIELD, ANY WAY - one renderer for every batch.
 *
 * `hydro`, `timing`, `motions` and `lobes` all dump the accumulated 3D field and a small json
 * saying how big the box was. This reads a whole folder and makes the pictures, so a rendering
 * decision costs seconds and never a re-run - and the same cuts are applied to every batch, so
 * two batches can actually be compared.
 *
 * THE CUTS, and the point is that the last one is a CHOICE that destroys the others:
 *
 *   -meridian   the (x, z) plane at y ~ 0. Azimuth KEPT: a lobe stays a lobe
 *   -equator    the (x, y) plane at z ~ 0. Where seats show as discrete lobes
 *   -ring       azimuthally integrated (rho, z) - every azimuth merged into one radius, so a
 *               lobe is spread into a RING. Every picture in this session was this, which is
 *               why everything came out circular. Kept for the comparison, not as the answer
 *   -added      where a `-bal` twin exists: the response LESS the pattern's own ballistic shape,
 *               each normalised to its own total. What the vacuum did, and nothing else
 *
 * usage: npx tsx scratch/cut.ts <folder> [slab-cells]
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { png } from "../src/theorems/probes/png.ts";
import { cutAll } from "./render.ts";

const FOLDER = process.argv[2] ?? "hydro";
const SLAB = Number(process.argv[3] ?? 3);
const dir = `/home/fadi/Desktop/orbitmines/physics/visuals/vacuum/${FOLDER}`;
const PX = 720;

const load = (p: string) => {
  const b = readFileSync(p);
  return Float64Array.from(new Float32Array(b.buffer, b.byteOffset, b.byteLength/4));
};

const paint = (f: Float64Array, N: number, L: number, RMAX: number,
               name: string, signed: boolean) => {
  const at = (a: number, b: number, c: number) =>
    (a<0||b<0||c<0||a>=N||b>=N||c>=N) ? 0 : f[(a*N+b)*N+c];
  const idx = (v: number) => Math.floor((v/L + 0.5)*N);
  const cuts: [string, (u: number, v: number) => number][] = [
    ["meridian", (u, v) => { let s=0,k=0;
      for (let d=-SLAB; d<=SLAB; d++){ s+=at(idx(u), idx(d*L/N), idx(v)); k++; } return s/k; }],
    ["equator",  (u, v) => { let s=0,k=0;
      for (let d=-SLAB; d<=SLAB; d++){ s+=at(idx(u), idx(v), idx(d*L/N)); k++; } return s/k; }],
    ["ring",     (u, v) => { const rho=Math.abs(u); let s=0;
      for (let q=0;q<64;q++){ const ph=2*Math.PI*(q+0.5)/64;
        s+=at(idx(rho*Math.cos(ph)), idx(rho*Math.sin(ph)), idx(v)); } return s/64; }],
  ];
  for (const [cut, get] of cuts) {
    const img = new Float64Array(PX*PX); let hi = 0;
    for (let j=0;j<PX;j++) for(let i=0;i<PX;i++){
      const u=(i-(PX-1)/2)/((PX-1)/2)*RMAX, v=(j-(PX-1)/2)/((PX-1)/2)*RMAX;
      const r=Math.hypot(u,v); if (r>RMAX || r<0.2) continue;
      const g=get(u,v); img[j*PX+i]=g; hi=Math.max(hi,Math.abs(g));
    }
    const rgb = new Uint8Array(PX*PX*3);
    for (let k=0;k<PX*PX;k++){
      const val = img[k]/(hi||1);
      let c: number[];
      if (signed) { const p=Math.pow(Math.min(1,Math.abs(val)),0.5);
        c = val>=0 ? [20+235*p,20+130*p,20+60*p] : [20+60*p,20+140*p,20+235*p]; }
      else { const t=Math.pow(Math.max(0,Math.min(1,Math.abs(val))),0.45);
        const st=[[6,8,14],[20,45,95],[70,130,200],[190,220,245],[255,205,140]];
        const ff=t*(st.length-1), k0=Math.min(st.length-2,Math.floor(ff)), fr=ff-k0;
        c=[0,1,2].map(q=>st[k0][q]+(st[k0+1][q]-st[k0][q])*fr); }
      const j=(k/PX)|0, i=k%PX, q=((PX-1-j)*PX+i)*3;
      rgb[q]=c[0]|0; rgb[q+1]=c[1]|0; rgb[q+2]=c[2]|0;
    }
    writeFileSync(`${dir}/${name}-${cut}.png`, Buffer.from(png(PX,PX,rgb),"base64"));
  }
};

let n = 0;
for (const jf of readdirSync(dir).filter(f => f.endsWith(".json"))) {
  const tag = jf.replace(/\.json$/, "");
  const meta = JSON.parse(readFileSync(`${dir}/${jf}`, "utf8"));
  const { N, L, RMAX } = meta as { N: number; L: number; RMAX: number };
  if (!existsSync(`${dir}/${tag}.f32`)) continue;
  const vol = load(`${dir}/${tag}.f32`);
  paint(vol, N, L, RMAX, tag, false);
  /* and the shape - each radius against its own mean, which is the only cut a cone survives */
  cutAll(dir, tag, N, L, RMAX, { vol });
  /* the DENSITY channel too where it exists - that is where a filled lobe lives, against the
   * turning channel's stripes at the transport shells */
  const df = `${dir}/${tag}-den.f32`;
  if (existsSync(df)) paint(load(df), N, L, RMAX, `${tag}-den`, false);
  const bf = `${dir}/${tag}-bal.f32`;
  if (existsSync(bf)) {
    const bal = load(bf);
    paint(bal, N, L, RMAX, `${tag}-bal`, false);
    /* what the vacuum ADDED: each to its own total, so brightness is not mistaken for shape */
    const sum = (a: Float64Array) => { let s=0; for(const v of a) s+=Math.abs(v); return s||1; };
    const sv = sum(vol), sb = sum(bal);
    const add = new Float64Array(vol.length);
    for (let i=0;i<vol.length;i++) add[i] = vol[i]/sv - bal[i]/sb;
    paint(add, N, L, RMAX, `${tag}-added`, true);
  }
  console.log(`  cut ${tag}`);
  n++;
}
console.log(`${n} field(s) cut -> ${dir}`);
