/**
 * ONE PICTURE, PROPERLY SIZED AND WITH THE WHOLE STRUCTURE VISIBLE.
 *
 * The trouble with every previous render of this field is dynamic range, not framing: the
 * polarity is -1.14 at r = 0.38 and +0.01 at r = 1.6, a factor of a hundred, so any single scale
 * either saturates the core and hides the lobe or shows the lobe as noise. Framing tighter does
 * not help - the two features are at different radii AND different magnitudes.
 *
 * So each radius is scaled by its OWN size (the RMS over that shell), which is the same trick the
 * angular measurements use. A shell that carries a tenth of the amplitude of another is then
 * drawn just as brightly, and what the colour shows is the SIGN and the shape at that radius
 * rather than how much is there. The node - a change of sign - is then visible at every radius it
 * reaches instead of only where the field is strong.
 *
 * usage: npx tsx scratch/big.ts <tag> <channel> [frame] [px]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { png } from "../src/theorems/probes/png.ts";

const TAG = process.argv[2] ?? "4d_z2s0.02n0.03";
const CH  = process.argv[3] ?? "-pol";
const RM  = Number(process.argv[4] ?? 3.2);
const PX  = Number(process.argv[5] ?? 960);
const dir = `/home/fadi/Desktop/orbitmines/physics/visuals/vacuum/hydro`;
const meta = JSON.parse(readFileSync(`${dir}/${TAG}.json`, "utf8"));
const { NO, L } = meta as { NO: number; L: number };
const b = readFileSync(`${dir}/${TAG}${CH}.f32`);
const f = Float64Array.from(new Float32Array(b.buffer, b.byteOffset, b.byteLength/4));

/*
 * SMOOTHED FIRST, because scaling each shell by its own size makes NOISE as bright as signal.
 *
 * Per-shell normalisation is what lets a lobe a hundred times fainter than the core be seen at
 * all - but it divides the noise up by the same factor, and at radii where there is little signal
 * the result is speckle at full brightness. The structure is smooth over about half a unit (it is
 * a lobe) while the noise is per cell, so a Gaussian of a few cells removes one and not the
 * other. Nothing is lost that the sampling could represent.
 */
const smooth = (src: Float64Array, sigCells: number) => {
  const rad = Math.max(1, Math.ceil(2*sigCells));
  const w: number[] = [];
  for (let d=-rad; d<=rad; d++) w.push(Math.exp(-(d*d)/(2*sigCells*sigCells)));
  let cur = src;
  for (const axis of [0,1,2]) {
    const out = new Float64Array(cur.length);
    for (let a=0;a<NO;a++) for(let b=0;b<NO;b++) for(let c=0;c<NO;c++){
      let acc=0, ws=0;
      for (let d=-rad; d<=rad; d++){
        const aa=axis===0?a+d:a, bb=axis===1?b+d:b, ccx=axis===2?c+d:c;
        if(aa<0||bb<0||ccx<0||aa>=NO||bb>=NO||ccx>=NO) continue;
        acc += w[d+rad]*cur[(aa*NO+bb)*NO+ccx]; ws += w[d+rad];
      }
      out[(a*NO+b)*NO+c] = ws?acc/ws:0;
    }
    cur = out;
  }
  return cur;
};
const fs = smooth(f, 2.5);

/* the size of each shell, so every radius is drawn on its own footing */
const NB = 80, R = L/2;
const ss = new Float64Array(NB), cc = new Float64Array(NB);
for (let a=0;a<NO;a++) for(let bb=0;bb<NO;bb++) for(let c=0;c<NO;c++){
  const x=(a+0.5-NO/2)*L/NO, y=(bb+0.5-NO/2)*L/NO, z=(c+0.5-NO/2)*L/NO;
  const i=Math.floor(Math.hypot(x,y,z)/R*NB); if(i>=NB) continue;
  const v=fs[(a*NO+bb)*NO+c]; ss[i]+=v*v; cc[i]++;
}
const rms = Array.from(ss,(v,i)=>cc[i]?Math.sqrt(v/cc[i]):0);

const at = (x:number,y:number,z:number) => {
  const a=Math.floor((x/L+0.5)*NO), bb=Math.floor((y/L+0.5)*NO), c=Math.floor((z/L+0.5)*NO);
  if(a<0||bb<0||c<0||a>=NO||bb>=NO||c>=NO) return 0;
  const r=Math.hypot(x,y,z), i=Math.floor(r/R*NB);
  if(i>=NB||!(rms[i]>0)) return 0;
  return fs[(a*NO+bb)*NO+c]/rms[i];
};

/* a slab several cells thick, averaged, so the picture is not one row of cells */
const SLAB = 4, h = L/NO;
const img = new Float64Array(PX*PX);
let hi = 0;
for (let j=0;j<PX;j++) for(let i=0;i<PX;i++){
  const u=(i-(PX-1)/2)/((PX-1)/2)*RM, v=(j-(PX-1)/2)/((PX-1)/2)*RM;
  if (Math.hypot(u,v) > RM) continue;
  let s=0,k=0;
  for(let d=-SLAB; d<=SLAB; d++){ s+=at(u, d*h, v); k++; }
  const q=s/k; img[j*PX+i]=q; hi=Math.max(hi,Math.abs(q));
}
const rgb = new Uint8Array(PX*PX*3);
for (let k=0;k<PX*PX;k++){
  const val = img[k]/(hi||1);
  const p = Math.pow(Math.min(1,Math.abs(val)), 0.42);
  /* blue for one polarity, amber for the other, black where there is none - a node is where the
   * two meet, which is what a sign change looks like when it is drawn as a sign */
  const c = val>=0 ? [16+239*p, 16+150*p, 16+70*p] : [16+70*p, 16+150*p, 16+239*p];
  const j=(k/PX)|0, i=k%PX, q=((PX-1-j)*PX+i)*3;
  rgb[q]=c[0]|0; rgb[q+1]=c[1]|0; rgb[q+2]=c[2]|0;
}
writeFileSync(`${dir}/${TAG}${CH}-BIG.png`, Buffer.from(png(PX,PX,rgb),"base64"));
console.log(`${TAG}${CH}  frame ${RM}  ${PX}px  -> ${TAG}${CH}-BIG.png`);
