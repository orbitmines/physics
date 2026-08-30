/**
 * LOBES, AND LOBES INSIDE LOBES - the two structures separately, then together.
 *
 * `|psi|^2 = |R_nl(r)|^2 |Y_lm(theta)|^2`. The angular lobes come from Y and each is subdivided
 * radially by R's nodes; the two multiply and neither causes the other. In this model the
 * emission pattern has two independent parts that should do the same job:
 *
 *   the CONE      which directions fire - pitch alpha, seats on the ring. The angular lobes.
 *   the PERIOD    how often a seat fires. Path length is time, so a firing every P ticks lays
 *                 down shells P apart. The radial subdivision.
 *
 * AND THE PERIOD IS THE FALSIFIABLE ONE. The vacuum makes transport shells at the mean free path
 * whatever is done to it - measured, spacing 0.75 at every THETA from 45 to 120 degrees, which
 * is what killed the idea that the rotation places them. If firing with period P instead puts
 * the shells P apart, the PATTERN is setting the radial scale and the medium is not. That is a
 * different number from 0.75 and it cannot be faked by the medium.
 *
 * usage: npx tsx scratch/lobes.ts <alpha-deg> <period> <m> [ticks] [tag]
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { png } from "../src/theorems/probes/png.ts";
import { gather, tick, world, type Rules } from "../src/lib/Vacuum.ts";

const ALPHA = Number(process.argv[2] ?? 55) * Math.PI/180;
const PERIOD = Number(process.argv[3] ?? 0);          // 0 = fire every tick
const M = Number(process.argv[4] ?? 0);
const TICKS = Number(process.argv[5] ?? 300);
const TAG = process.argv[6] ?? `a${process.argv[2]}p${process.argv[3]}m${process.argv[4]}`;
/*
 * STIR AS AN ARGUMENT, because the whole blocker rests on its derived value.
 *
 * A train fired every P ticks lays shells P apart, and P is an integer number of ticks while a
 * tick is one unit of distance - so P >= 1. The mean free path is 1/(stir + sigma rho face), and
 * at the derived stir = 1 that is about 0.70: every pulse is scattered before the next is
 * emitted and no period can carry radial structure. For a train to survive, lambda > P, which
 * needs stir + sigma rho face < 1, i.e. **stir below about 0.58**.
 *
 * `vacuum.rates` derives stir = 1 per tick from `steer` spending one ring step a tick, so this
 * is NOT a free parameter of the theory - it is being unbound here to find out whether that one
 * number is what stands between this and radial nodes. If the shells move to the period when
 * stir falls, the blocker is exactly that derivation and nothing else.
 */
const STIR = Number(process.argv[7] ?? 1);
const THETA = Math.PI/2, CYCLE = 4;
const N = 96, L = 9.6, RMAX = 3.6, NB = Math.round(RMAX/(L/N)), NA = 32;   // finer cells and finer bins

const pattern = (ux: number, uy: number, uz: number, t: number) => {
  if (PERIOD > 1 && t % PERIOD !== 0) return 0;                  // the RADIAL part: how often
  if (ALPHA > 0 && Math.abs(uz - Math.cos(ALPHA)) > 0.18) return 0;   // the ANGULAR part: the cone
  if (M > 0) {
    const seat = ((Math.atan2(uy, ux)/(2*Math.PI)*CYCLE) % CYCLE + CYCLE) % CYCLE;
    const want = ((M*t) % CYCLE + CYCLE) % CYCLE;
    const d = Math.min(Math.abs(seat-want), CYCLE-Math.abs(seat-want));
    if (d >= 0.5) return 0;
  }
  return 1;
};
const R: Rules = { theta: THETA, sigma: 1, tau: 1, nu: 1, stir: STIR, shine: 0.02,
  makes: "polarity", source: { rate: 24, radius: 0.12, charge: 1, pattern } };
const W = world(N, L, 9_000_000, 1/200), K = world(N, L, 9_000_000, 1/200);
const noSrc = { ...R, source: undefined };

/*
 * THE WHOLE 3D FIELD IS KEPT, so a picture can be re-cut without casting anything again.
 *
 * Everything so far has been binned on the way past - by radius, or by (rho, z) with the azimuth
 * integrated - and the binning threw away what was later wanted. Azimuthal integration in
 * particular merges every azimuth into one radius, so an azimuthal LOBE is averaged into a RING
 * by construction: every picture in this session has been a circularised cone, and the structure
 * asked about was erased by the renderer rather than absent from the run.
 *
 * So the accumulated difference is written out whole, one float a cell, and `lobes-draw.ts` cuts
 * it however is wanted - a plane, a slice, a projection, integrated or not. A rendering decision
 * then costs milliseconds instead of an hour.
 */
const vol3 = new Float64Array(N*N*N);
const rad = new Float64Array(NB), rcnt = new Float64Array(NB);
const img = new Float64Array(NB*2*NB), icnt = new Float64Array(NB*2*NB);
const ang = new Float64Array(NA);
for (let t = 0; t < TICKS; t++) {
  tick(W, R, 1, 5); tick(K, noSrc, 1, 5);
  if (t < TICKS/3) continue;
  gather(W); gather(K);
  for (let a = 0; a < N; a++) for (let b = 0; b < N; b++) for (let e = 0; e < N; e++) {
    const x=(a+0.5-N/2)*L/N, y=(b+0.5-N/2)*L/N, z=(e+0.5-N/2)*L/N;
    const r = Math.hypot(x,y,z); if (r >= RMAX || r < 0.2) continue;
    const d = W.turned[(a*N+b)*N+e] - K.turned[(a*N+b)*N+e];
    vol3[(a*N+b)*N+e] += d;
    const ir = Math.floor(r/RMAX*NB); rad[ir] += d; rcnt[ir]++;
    ang[Math.min(NA-1, Math.floor((z/r+1)/2*NA))] += d;
    const i2 = Math.floor(Math.hypot(x,y)/RMAX*NB), j2 = Math.floor((z/RMAX+1)/2*(2*NB));
    if (i2 < NB && j2 >= 0 && j2 < 2*NB) { img[i2*(2*NB)+j2] += d; icnt[i2*(2*NB)+j2]++; }
  }
}
const prof = Array.from(rad, (v,i) => rcnt[i] ? v/rcnt[i] : 0);
const sm = prof.map((_,i) => { let s=0,k=0;
  for (let j=i-1;j<=i+1;j++) if (j>=0&&j<NB){s+=prof[j];k++;} return s/k; });
const peaks: number[] = [];
for (let i = 2; i < NB-2; i++)
  if (sm[i]>sm[i-1]&&sm[i]>sm[i+1]&&sm[i]>sm[i-2]&&sm[i]>sm[i+2]) peaks.push((i+0.5)*RMAX/NB);
const gaps = peaks.slice(1).map((p,i) => p-peaks[i]);
const P = (l:number,x:number):number => { if(l===0)return 1; if(l===1)return x;
  let pm=1,p=x; for(let k=2;k<=l;k++){const pn=((2*k-1)*x*p-(k-1)*pm)/k;pm=p;p=pn;} return p; };
let tot=0; for(const v of ang) tot+=v;
const harm = [1,2,3,4].map(l => { let s=0;
  for(let i=0;i<NA;i++) s += (ang[i]/tot*NA-1)*P(l,-1+(i+0.5)*2/NA)/NA; return s*(2*l+1); });

const dir = `/home/fadi/Desktop/orbitmines/physics/visuals/vacuum/lobes`;
mkdirSync(dir, { recursive: true });
const PX = 720;
const per = new Float64Array(img.length);
for (let i=0;i<per.length;i++) per[i] = icnt[i]>0 ? img[i]/icnt[i] : 0;
let hi=0; for(const v of per) hi=Math.max(hi,Math.abs(v));
const rgb = new Uint8Array(PX*PX*3);
for (let j=0;j<PX;j++) for(let i=0;i<PX;i++){
  const rho=Math.abs(i-(PX-1)/2)/((PX-1)/2)*RMAX, zz=(j-(PX-1)/2)/((PX-1)/2)*RMAX;
  const i2=Math.floor(rho/RMAX*NB), j2=Math.floor((zz/RMAX+1)/2*(2*NB));
  const ok = i2<NB && j2>=0 && j2<2*NB && Math.hypot(rho,zz)<RMAX && Math.hypot(rho,zz)>0.2;
  const v = ok ? per[i2*(2*NB)+j2]/(hi||1) : 0;
  const tt = Math.pow(Math.max(0,Math.min(1,Math.abs(v))),0.45);
  const st=[[6,8,14],[20,45,95],[70,130,200],[190,220,245],[255,205,140]];
  const f=tt*(st.length-1), k0=Math.min(st.length-2,Math.floor(f)), fr=f-k0;
  const c=[0,1,2].map(q=>st[k0][q]+(st[k0+1][q]-st[k0][q])*fr);
  const k=((PX-1-j)*PX+i)*3; rgb[k]=c[0]|0; rgb[k+1]=c[1]|0; rgb[k+2]=c[2]|0;
}
writeFileSync(`${dir}/${TAG}.png`, Buffer.from(png(PX,PX,rgb),"base64"));
writeFileSync(`${dir}/${TAG}.f32`, Buffer.from(Float32Array.from(vol3).buffer));
writeFileSync(`${dir}/${TAG}.json`, JSON.stringify(
  { N, L, RMAX, alpha: Number(process.argv[2]), period: PERIOD, m: M, stir: STIR,
    theta: 90, cycle: CYCLE, ticks: TICKS, sampled: TICKS - Math.floor(TICKS/3) }, null, 1));
console.log(`a=${process.argv[2]} P=${PERIOD} m=${M} stir=${STIR}  lambda~${(1/(STIR+0.42)).toFixed(2)}  peaks ${peaks.map(p=>p.toFixed(2)).join(",")}` +
  `  spacing ${gaps.length?gaps.map(g=>g.toFixed(2)).join(","):"-"}` +
  `   P1..P4 ${harm.map(v=>v.toFixed(2)).join(" ")}  -> ${TAG}.png`);
