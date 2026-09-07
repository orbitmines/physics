/**
 * WHAT ELSE A SOURCE CAN BE DOING - the space of motions, not one comb and one cone.
 *
 * THE THING THAT WAS MISSING, AND IT EXPLAINS THE RINGS. A real orbital with m /= 0 is a STANDING
 * wave: p_x is (Y_1,+1 + Y_1,-1)/sqrt2, d_xy is (Y_2,+2 + Y_2,-2)/sqrt2. It does not rotate. A
 * pattern with a WINDING does rotate, and a rotating pattern averaged over the sampling IS A
 * RING - which is why every m /= 0 run came out circular and why that looked wrong. The fix is
 * not more rotation, it is NO rotation with an azimuthal amplitude: seats that stay put and beat.
 *
 * The motions, each a different thing a turning body might be doing:
 *
 *   standing-m   seats fixed, amplitude cos(m phi). 2m lobes, and they stay where they are
 *   counter      +m and -m on alternate ticks - the same standing wave built the other way,
 *                as two counter-rotating patterns rather than as an amplitude
 *   jitter       one direction, but shaking - a beam whose heading wanders by a few degrees each
 *                tick. Spewing one way while vibrating locally
 *   precess      the AXIS itself walks slowly round a cone while the pattern fires along it
 *   nutate       the axis nods up and down as it precesses - two rates at once
 *   chirp        the winding rate changes through the cycle: fast, then slow, then fast
 *   spiral       pitch and azimuth advance together, so the seats trace a spiral over the sphere
 *   hop          the seat jumps at random rather than advancing - rotation with no sense to it
 *   breathe      the cone's PITCH oscillates - the body opening and closing rather than turning
 *
 * usage: npx tsx scratch/motions.ts <motion> <param> [ticks] [stir]
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { cutAll } from "./render.ts";
import { gather, tick, world, type Rules } from "../src/lib/Vacuum.ts";

const MOTION = process.argv[2] ?? "standing";
const PARAM = Number(process.argv[3] ?? 2);
const TICKS = Number(process.argv[4] ?? 340);
const STIR = Number(process.argv[5] ?? 0.15);
/*
 * THETA AS AN ARGUMENT, because of what the first sweep showed.
 *
 * The MOVING patterns - jitter, nutate, precess, spiral, hop - come back with azimuthal
 * structure the ballistic run does not have, and the fold it appears at is FOUR: A4 = 0.489
 * against a ballistic 0.182 for jitter, 0.339 against 0.042 for nutate. CYCLE at THETA = 90 is
 * also four. If that is the vacuum's own ring imprinting itself on the response - which would be
 * the ring emerging rather than being emitted - then the fold must FOLLOW CYCLE when THETA
 * changes, and stay at four if it is a coincidence of the box or the pattern.
 */
const THDEG = Number(process.argv[6] ?? 90);
const N = 96, L = 9.6, RMAX = 3.6;

let rs = 20260828 >>> 0;
const rnd = () => { rs = (rs + 0x6D2B79F5)|0; let t = Math.imul(rs ^ (rs>>>15), 1|rs);
  t = (t + Math.imul(t ^ (t>>>7), 61|t)) ^ t; return ((t ^ (t>>>14))>>>0)/4294967296; };

const MOTIONS: Record<string, (ux:number,uy:number,uz:number,t:number)=>number> = {
  /* SEATS THAT STAY PUT AND BEAT - a standing wave, which is what a real m /= 0 orbital is.
   * cos(m phi) is positive on 2m arcs and the source fires only where it is positive, so the
   * emission has 2m LOBES fixed in space and they never rotate away. */
  standing: (ux, uy, uz) => {
    if (Math.abs(uz) > 0.35) return 0;
    return Math.cos(PARAM * Math.atan2(uy, ux)) > 0.6 ? 1 : 0;
  },
  /* the same standing wave assembled from two counter-rotating patterns instead of an amplitude -
   * if the two routes agree, the standing wave is the physics and not the parametrisation */
  counter: (ux, uy, uz, t) => {
    if (Math.abs(uz) > 0.35) return 0;
    const s = (t % 2 === 0 ? 1 : -1) * PARAM * t * Math.PI/6;
    return Math.cos(PARAM * Math.atan2(uy, ux) - s) > 0.6 ? 1 : 0;
  },
  /* SPEWING ONE WAY WHILE SHAKING - a beam whose heading wanders a few degrees a tick. The mean
   * direction is fixed; what varies is how tightly it is held. */
  jitter: (ux, uy, uz, t) => {
    const w = PARAM * 0.06;
    const ax = Math.sin(t*1.7)*w, ay = Math.sin(t*2.3)*w;
    const tx = ax, ty = ay, tz = Math.sqrt(Math.max(0, 1 - ax*ax - ay*ay));
    return (ux*tx + uy*ty + uz*tz) > 0.92 ? 1 : 0;
  },
  /* the AXIS walks round a cone while the pattern fires along it - the body's own wobble */
  precess: (ux, uy, uz, t) => {
    const ph = t * 2*Math.PI / (PARAM * 8), th = Math.PI/4;
    const tx = Math.sin(th)*Math.cos(ph), ty = Math.sin(th)*Math.sin(ph), tz = Math.cos(th);
    return (ux*tx + uy*ty + uz*tz) > 0.90 ? 1 : 0;
  },
  /* and nods as it goes - two rates at once, which is what makes a shape rather than a ring */
  nutate: (ux, uy, uz, t) => {
    const ph = t * 2*Math.PI / (PARAM * 8);
    const th = Math.PI/4 + 0.5*Math.sin(t * 2*Math.PI / (PARAM * 3));
    const tx = Math.sin(th)*Math.cos(ph), ty = Math.sin(th)*Math.sin(ph), tz = Math.cos(th);
    return (ux*tx + uy*ty + uz*tz) > 0.90 ? 1 : 0;
  },
  /* the winding rate itself varies through the cycle - fast, slow, fast. A rotation that is
   * SPORADIC rather than steady, which is what `steer` actually does when the field varies */
  chirp: (ux, uy, uz, t) => {
    if (Math.abs(uz) > 0.35) return 0;
    const rate = 1 + PARAM * Math.sin(t * 2*Math.PI / 24);
    const want = (t * rate * Math.PI/2);
    const d = Math.cos(Math.atan2(uy, ux) - want);
    return d > 0.7 ? 1 : 0;
  },
  /* pitch and azimuth advance together - the seats trace a spiral over the sphere */
  spiral: (ux, uy, uz, t) => {
    const ph = t * Math.PI/3, th = (t * PARAM * 0.11) % Math.PI;
    const tx = Math.sin(th)*Math.cos(ph), ty = Math.sin(th)*Math.sin(ph), tz = Math.cos(th);
    return (ux*tx + uy*ty + uz*tz) > 0.90 ? 1 : 0;
  },
  /* the seat JUMPS at random - turning with no sense to it, the sporadic limit */
  hop: (ux, uy, uz, t) => {
    if (Math.abs(uz) > 0.35) return 0;
    const k = Math.floor(rnd()*PARAM);
    const s = ((Math.atan2(uy,ux)/(2*Math.PI)*PARAM) % PARAM + PARAM) % PARAM;
    return Math.min(Math.abs(s-k), PARAM-Math.abs(s-k)) < 0.5 ? 1 : 0;
  },
  /* the cone OPENS AND CLOSES - the body breathing rather than turning */
  breathe: (ux, uy, uz, t) => {
    const a = Math.PI/2 * (0.5 + 0.45*Math.sin(t * 2*Math.PI / (PARAM*6)));
    return Math.abs(uz - Math.cos(a)) < 0.18 ? 1 : 0;
  },
};
const pattern = MOTIONS[MOTION];
if (!pattern) throw new Error(`no motion ${MOTION} - have ${Object.keys(MOTIONS).join(", ")}`);

const R: Rules = { theta: THDEG*Math.PI/180, sigma:1, tau:1, nu:1, stir:STIR, shine:0.02,
  makes:"polarity", source:{ rate:24, radius:0.12, charge:1, pattern } };
const BAL: Rules = { theta: THDEG*Math.PI/180, sigma:0, tau:0, nu:0, stir:0, shine:0,
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
const dir = `/home/fadi/Desktop/orbitmines/physics/visuals/vacuum/motions`;
mkdirSync(dir, { recursive: true });
const TAG = `${MOTION}${PARAM}t${THDEG}`;
writeFileSync(`${dir}/${TAG}.f32`, Buffer.from(Float32Array.from(vol).buffer));
writeFileSync(`${dir}/${TAG}-bal.f32`, Buffer.from(Float32Array.from(bal).buffer));
writeFileSync(`${dir}/${TAG}.json`, JSON.stringify(
  { N,L,RMAX, motion:MOTION, param:PARAM, stir:STIR, theta:THDEG,
    cycle:Math.round(360/THDEG), ticks:TICKS, alpha:0, m:0 }, null, 1));
/* AND THE PICTURES, every time - a run whose output nobody can look at is half a run */
cutAll(dir, TAG, N, L, RMAX, { vol, bal });

/*
 * AZIMUTHAL structure is what a lobe IS, so it is what is measured - the polar harmonics say
 * nothing about whether the thing is a ring or a set of lobes. `A_k` is how much k-fold variation
 * there is round the axis, and a ring has NONE of it whatever its polar shape.
 */
const NPH = 48, az = new Float64Array(NPH), azB = new Float64Array(NPH);
for (let a=0;a<N;a++) for(let b=0;b<N;b++) for(let e=0;e<N;e++){
  const x=(a+0.5-N/2)*L/N, y=(b+0.5-N/2)*L/N, z=(e+0.5-N/2)*L/N;
  const r=Math.hypot(x,y,z); if(r>=RMAX||r<0.3||Math.abs(z)>1.2) continue;
  const i = Math.min(NPH-1, Math.floor(((Math.atan2(y,x)/(2*Math.PI))%1+1)%1*NPH));
  az[i] += vol[(a*N+b)*N+e]; azB[i] += bal[(a*N+b)*N+e];
}
const fold = (h: Float64Array) => {
  let tot=0; for(const v of h) tot+=v;
  return [1,2,3,4,6].map(k => {
    let c=0, s=0;
    for(let i=0;i<NPH;i++){ const ph=2*Math.PI*(i+0.5)/NPH, w=h[i]/(tot||1)*NPH-1;
      c += w*Math.cos(k*ph)/NPH; s += w*Math.sin(k*ph)/NPH; }
    return 2*Math.hypot(c,s);
  });
};
const fv = fold(az), fb = fold(azB);
console.log(`${TAG.padEnd(12)} azimuthal A1,A2,A3,A4,A6  vacuum ${fv.map(v=>v.toFixed(3).padStart(6)).join(" ")}` +
  `  | ballistic ${fb.map(v=>v.toFixed(3).padStart(6)).join(" ")}`);
