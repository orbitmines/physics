/**
 * WHEN THE SOURCE FIRES, PROPERLY EXPLORED - because a delta comb is one point in a large space
 * and it is the worst one.
 *
 * Everything so far fired either every tick or one tick in every P. A single-tick pulse is
 * thinner than the mean free path, so it is scrambled before it has gone anywhere, and no radial
 * structure could have survived whatever the period. That was a poor choice, not a result.
 *
 * The space is much bigger. Path length is time, so the TEMPORAL pattern is laid down directly
 * as radial structure:
 *
 *   a BURST of A ticks           lays a shell A thick - and a thick shell can outlive a mean
 *                                free path where a thin one cannot
 *   a GAP of B ticks             lays a void B thick
 *   LONG then SHORT              lays a thick shell and a thin one - shell inside shell, which
 *                                is the radial half of lobes-in-lobes
 *   NESTED bursts                a train of thin shells inside a thick envelope, which is what
 *                                `n - l - 1` nodes under one radial envelope actually looks like
 *
 * The pattern is written as an on/off sequence in ticks and repeated: "8,2" is on eight off two;
 * "8,2,2,8" is on eight, off two, on two, off eight - a long stage then a short one, which is
 * the thing that was missing.
 *
 * usage: npx tsx scratch/timing.ts <on,off,on,off,...> <state> [ticks] [stir]
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { cutAll } from "./render.ts";
import { gather, tick, world, type Rules } from "../src/lib/Vacuum.ts";

const SPEC = (process.argv[2] ?? "8,2").split(",").map(Number);
const STATE = process.argv[3] ?? "iso";
const TICKS = Number(process.argv[4] ?? 360);
const STIR = Number(process.argv[5] ?? 0.15);
const N = 96, L = 9.6, RMAX = 3.6;

/* where in the repeating on/off sequence a tick falls */
const CYCLE_T = SPEC.reduce((a, b) => a + b, 0);
const firing = (t: number) => {
  let u = ((t % CYCLE_T) + CYCLE_T) % CYCLE_T;
  for (let i = 0; i < SPEC.length; i++) {
    if (u < SPEC[i]) return i % 2 === 0;        // even entries are ON, odd are OFF
    u -= SPEC[i];
  }
  return false;
};
const TOL = 0.22;
const lobe = (lx:number,ly:number,lz:number) => (ux:number,uy:number,uz:number) =>
  (ux*lx+uy*ly+uz*lz) > 1-TOL ? 1 : 0;
const ANG: Record<string, (x:number,y:number,z:number)=>number> = {
  iso:    () => 1,
  pz:     (x,y,z) => (lobe(0,0,1)(x,y,z) || lobe(0,0,-1)(x,y,z)) ? 1 : 0,
  dxy:    (x,y,z) => { if (Math.abs(z) > 0.3) return 0;
            const s = ((Math.atan2(y,x)/(2*Math.PI)*4)%4+4)%4;
            return Math.min(s%1, 1-s%1) < 0.16 ? 1 : 0; },
};
const ang0 = ANG[STATE] ?? ANG.iso;
const pattern = (ux:number,uy:number,uz:number,t:number) => firing(t) ? ang0(ux,uy,uz) : 0;

const R: Rules = { theta: Math.PI/2, sigma:1, tau:1, nu:1, stir:STIR, shine:0.02,
  makes:"polarity", source:{ rate:24, radius:0.12, charge:1, pattern } };
const BAL: Rules = { theta: Math.PI/2, sigma:0, tau:0, nu:0, stir:0, shine:0,
  makes:"polarity", source:{ rate:24, radius:0.12, charge:1, pattern } };
const W = world(N,L,9_000_000,1/200), K = world(N,L,9_000_000,1/200), B = world(N,L,9_000_000,1/200);
const noSrc = { ...R, source: undefined };
const vol = new Float64Array(N*N*N), bal = new Float64Array(N*N*N);
for (let t = 0; t < TICKS; t++) {
  tick(W,R,1,5); tick(K,noSrc,1,5); tick(B,BAL,1,5);
  if (t < TICKS/3) continue;
  gather(W); gather(K); gather(B);
  for (let c = 0; c < N*N*N; c++) { vol[c] += W.turned[c]-K.turned[c]; bal[c] += B.rho[c]; }
}
const dir = `/home/fadi/Desktop/orbitmines/physics/visuals/vacuum/timing`;
mkdirSync(dir, { recursive: true });
const TAG = `${STATE}_${SPEC.join("-")}`;
writeFileSync(`${dir}/${TAG}.f32`, Buffer.from(Float32Array.from(vol).buffer));
writeFileSync(`${dir}/${TAG}-bal.f32`, Buffer.from(Float32Array.from(bal).buffer));
writeFileSync(`${dir}/${TAG}.json`, JSON.stringify(
  { N,L,RMAX, spec:SPEC, state:STATE, stir:STIR, ticks:TICKS, alpha:0, m:0 }, null, 1));
/* AND THE PICTURES, every time - a run whose output nobody can look at is half a run */
cutAll(dir, TAG, N, L, RMAX, { vol, bal });

/* the radial profile of both, and where the peaks are */
const NB = 24;
const prof = (f: Float64Array) => {
  const s = new Float64Array(NB), c = new Float64Array(NB);
  for (let a=0;a<N;a++) for(let b=0;b<N;b++) for(let e=0;e<N;e++){
    const x=(a+0.5-N/2)*L/N, y=(b+0.5-N/2)*L/N, z=(e+0.5-N/2)*L/N;
    const r=Math.hypot(x,y,z); if(r>=RMAX||r<0.2) continue;
    const i=Math.floor(r/RMAX*NB); s[i]+=f[(a*N+b)*N+e]; c[i]++;
  }
  return Array.from(s,(v,i)=>c[i]?v/c[i]:0);
};
const peaksOf = (p: number[]) => {
  const sm = p.map((_,i)=>{let s=0,k=0;for(let j=i-1;j<=i+1;j++)if(j>=0&&j<NB){s+=p[j];k++;}return s/k;});
  const out: number[] = [];
  for (let i=2;i<NB-2;i++) if(sm[i]>sm[i-1]&&sm[i]>sm[i+1]&&sm[i]>sm[i-2]&&sm[i]>sm[i+2])
    out.push((i+0.5)*RMAX/NB);
  return out;
};
const pv = peaksOf(prof(vol)), pb = peaksOf(prof(bal));
const gaps = (a: number[]) => a.slice(1).map((v,i)=>+(v-a[i]).toFixed(2));
console.log(`${TAG.padEnd(18)} on/off ${SPEC.join("/")} (cycle ${CYCLE_T})` +
  `  vacuum peaks ${pv.map(v=>v.toFixed(2)).join(",")||"-"} gaps ${gaps(pv).join(",")||"-"}` +
  `  | ballistic ${pb.map(v=>v.toFixed(2)).join(",")||"-"} gaps ${gaps(pb).join(",")||"-"}`);
