/**
 * WHERE THE SHELLS ARE, AS NUMBERS - because counting rings in a picture is not a measurement.
 *
 * The turning left after a control run is subtracted, binned finely in radius and averaged over
 * ticks, then the local maxima found. What is wanted is the SPACING of the series: a single ring
 * can sit anywhere, but a set of them has a period, and if the rotation puts them there the
 * period must move with THETA.
 *
 * usage: npx tsx scratch/rings2.ts [theta-deg] [ticks]
 */
import { gather, tick, world, type Rules } from "../src/lib/Vacuum.ts";

const THDEG = Number(process.argv[2] ?? 90);
const TICKS = Number(process.argv[3] ?? 240);
const N = 64, L = 9.6, RMAX = 3.6, NR = 48;      // fine bins: 0.075, against the 0.2 before
const R: Rules = { theta: THDEG*Math.PI/180, sigma: 1, tau: 1, nu: 1, stir: 1,
                   shine: 0.02, makes: "polarity",
                   source: { rate: 16, radius: 0.12, charge: 1 } };
const W = world(N, L, 9_000_000, 1/200);
const K = world(N, L, 9_000_000, 1/200);
const noSrc = { ...R, source: undefined };
const rad = new Float64Array(NR), cnt = new Float64Array(NR);
let ns = 0;
for (let t = 0; t < TICKS; t++) {
  tick(W, R, 1, 5); tick(K, noSrc, 1, 5);
  if (t < TICKS/3) continue;
  gather(W); gather(K);
  for (let a = 0; a < N; a++) for (let b = 0; b < N; b++) for (let e = 0; e < N; e++) {
    const x=(a+0.5-N/2)*L/N, y=(b+0.5-N/2)*L/N, z=(e+0.5-N/2)*L/N;
    const r = Math.hypot(x,y,z); if (r >= RMAX || r < 0.2) continue;
    const ir = Math.floor(r/RMAX*NR), c = (a*N+b)*N+e;
    rad[ir] += W.turned[c] - K.turned[c]; cnt[ir]++;
  }
  ns++;
}
const prof: number[] = [];
for (let i = 0; i < NR; i++) prof.push(cnt[i] ? rad[i]/cnt[i] : 0);
/* a light smooth, so a single noisy bin is not a peak */
const sm = prof.map((_, i) => {
  let s = 0, k = 0;
  for (let j = i-1; j <= i+1; j++) if (j >= 0 && j < NR) { s += prof[j]; k++; }
  return s/k;
});
const peaks: number[] = [];
for (let i = 2; i < NR-2; i++)
  if (sm[i] > sm[i-1] && sm[i] > sm[i+1] && sm[i] > sm[i-2] && sm[i] > sm[i+2])
    peaks.push((i+0.5)*RMAX/NR);
console.log(`THETA=${THDEG}deg CYCLE=${Math.round(360/THDEG)}  ${TICKS} ticks (${ns} sampled)`);
console.log(`  peaks at r = ${peaks.map(p => p.toFixed(2)).join(", ") || "none"}`);
if (peaks.length > 1) {
  const gaps = peaks.slice(1).map((p, i) => p - peaks[i]);
  console.log(`  spacings   = ${gaps.map(g => g.toFixed(2)).join(", ")}` +
    `   mean ${(gaps.reduce((a,b)=>a+b,0)/gaps.length).toFixed(3)}`);
}
