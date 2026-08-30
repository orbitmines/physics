/**
 * A PROTON IN THE VACUUM, AND WHAT THE VACUUM DOES ABOUT IT.
 *
 * The source is GIVEN, the way a proton is: a small region that puts out charged rays every tick
 * and keeps doing it. Nothing is imposed about the shape of what forms round it - no harmonic,
 * no schedule, no radial profile. The vacuum has its own rules and this asks what they make of a
 * charge sitting in the middle of them.
 *
 * What is measured, all of it against radius:
 *   the NET CHARGE      does the vacuum screen the proton, and does the screening have shells?
 *   the two SPECIES     where the positives go against where the negatives go. Fadi's mechanism
 *                       has the positives piling into the nodes and annihilating the negatives
 *                       there, leaving neutral space - so the two profiles should be OUT OF STEP
 *   the TURNING         where the vacuum is being bent, which is where a cloud would be
 *
 * usage: npx tsx scratch/proton.ts [theta-deg] [ticks] [rate] [shine]
 */
import { gather, tick, world, type Rules } from "../src/lib/Vacuum.ts";

const THDEG = Number(process.argv[2] ?? 90);
const TICKS = Number(process.argv[3] ?? 60);
const RATE  = Number(process.argv[4] ?? 40);
const SHINE = Number(process.argv[5] ?? 0.02);
const R: Rules = { theta: THDEG*Math.PI/180, sigma: 1, tau: 1, nu: 1, stir: 1,
                   shine: SHINE, makes: "polarity",
                   source: { rate: RATE, radius: 0.4, charge: 1 } };
const W = world(24, 12, 6_000_000, 1/200);
for (let t = 0; t < TICKS; t++) tick(W, R, 1, 5);
gather(W);

const NR = 20, RMAX = 4;
const qp = new Float64Array(NR), qm = new Float64Array(NR);
const trn = new Float64Array(NR), cnt = new Float64Array(NR);
for (let i = 0; i < W.n; i++) {
  const r = Math.hypot(W.x[i], W.y[i], W.z[i]);
  const ir = Math.floor(r / RMAX * NR);
  if (ir >= NR) continue;
  if (W.q[i] > 0) qp[ir] += W.wt; else qm[ir] += W.wt;
}
for (let a = 0; a < W.N; a++) for (let b = 0; b < W.N; b++) for (let e = 0; e < W.N; e++) {
  const x = (a+0.5-W.N/2)*W.h, y = (b+0.5-W.N/2)*W.h, z = (e+0.5-W.N/2)*W.h;
  const ir = Math.floor(Math.hypot(x,y,z) / RMAX * NR);
  if (ir >= NR) continue;
  trn[ir] += W.turned[(a*W.N+b)*W.N+e]; cnt[ir]++;
}
/* per unit volume, so a shell's size does not masquerade as a density */
console.log(`THETA=${THDEG}deg ticks=${TICKS} rate=${RATE} shine=${SHINE}  ${W.n} rays`);
console.log(`     r     n(+)/vol   n(-)/vol    net q      turning/cell`);
for (let ir = 0; ir < NR; ir++) {
  const r0 = ir*RMAX/NR, r1 = r0 + RMAX/NR;
  const vol = 4/3*Math.PI*(r1**3 - r0**3);
  const p = qp[ir]/vol, m = qm[ir]/vol;
  console.log(`  ${((ir+0.5)*RMAX/NR).toFixed(2).padStart(5)}  ${p.toFixed(3).padStart(9)}  ` +
    `${m.toFixed(3).padStart(9)}  ${(p-m).toFixed(4).padStart(9)}  ` +
    `${(cnt[ir] ? trn[ir]/cnt[ir] : 0).toFixed(2).padStart(10)}`);
}
