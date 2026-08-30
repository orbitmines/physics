/**
 * DOES THE RING CLOSE? - the finite ring measured in the continuum, where it was said not to be.
 *
 * A turn by THETA about b^ conserves u^ . b^ and advances the AZIMUTH about b^ by THETA. So the
 * pitch is a constant of the motion and carries no information about the rotation; the ring is
 * in the azimuth, and it has CYCLE = 2pi/THETA places on it. That is a property of the RULE - a
 * fixed turn angle - and needs no lattice. Measuring the pitch instead is what hid it.
 *
 * So: after CYCLE turns, is a ray heading the way it was? `<u^ . u^0>` over a full lap against
 * the same over a HALF lap is the test. A ray going round a ring scores near 1 on the full lap
 * and near cos(pi) = -1 on the half; one that is merely diffusing scores the same low number on
 * both, because it has forgotten where it started either way.
 *
 * usage: npx tsx scratch/ring.ts [theta-deg] [ticks] [with-body 0|1]
 */
import { tick, world, type Rules } from "../src/lib/Vacuum.ts";

const THDEG = Number(process.argv[2] ?? 90);
const TICKS = Number(process.argv[3] ?? 30);
/*
 * HOW DENSE THE BODY IS, because that is what sets whether a lap fits inside it.
 *
 * Between turns a ray goes 1/(stir + |B|), so a lap of CYCLE turns is CYCLE/(stir+|B|) long and
 * closes only if that fits well inside the body. At the density used before a lap was 1.2 across
 * a body of 1.6 and the axis turned under the ray mid-lap. Ten to twenty times the density
 * shortens the lap by the same factor.
 *
 * AND CLOSURE IS NOT REQUIRED FOR THE HARMONIC. An orbital is a standing pattern, not a closed
 * orbit - the quantisation is single-valuedness, not a ray coming back to its heading. So the
 * angular content is measured too, and it does not care whether any lap closed.
 */
const BODY = Number(process.argv[4] ?? 1);
const DENS = Number(process.argv[5] ?? 1);
const THETA = THDEG * Math.PI / 180;
const CYCLE = Math.round(2 * Math.PI / THETA);
const R: Rules = { theta: THETA, sigma: 1, tau: 1, nu: 1, stir: 1, shine: 0.02,
                   makes: "polarity" };
const W = world(24, 12, 6_000_000, 1/200);

let s = 999 >>> 0;
const rnd = () => { s = (s + 0x6D2B79F5)|0; let t = Math.imul(s ^ (s>>>15), 1|s);
  t = (t + Math.imul(t ^ (t>>>7), 61|t)) ^ t; return ((t ^ (t>>>14))>>>0)/4294967296; };
if (BODY) {
  const NB = Math.round(120_000 * DENS);
  for (let i = 0; i < NB; i++) {
    const r = 0.8*Math.cbrt(rnd());
    const u = 2*rnd()-1, ph = 2*Math.PI*rnd(), st = Math.sqrt(Math.max(0,1-u*u));
    W.x[i]=r*st*Math.cos(ph); W.y[i]=r*st*Math.sin(ph); W.z[i]=r*u;
    /* NOT along the circulation this time - a random heading, so the field a ray meets is not
     * the field it is already parallel to. Seeding tangentially made every ray parallel to the
     * B its own circulation built, and the 41% "alignment" that came out was the seed. */
    /*
     * A BODY THAT HAS A FIELD, without every ray being parallel to it.
     *
     * Random headings with p = +1 throughout gives B = sum p u^ ~ 0 - a body with NO field, so
     * nothing to turn about and no charge can separate. Seeding tangentially gives a field but
     * makes every ray parallel to it, which is the fixed point of the turn.
     *
     * So: random headings, and the POLARITY is the sign of how the ray is going relative to the
     * radius. Then B = sum p u^ ~ sum |u^ . r^| r^ is RADIAL and outward, the ray directions stay
     * spread over the sphere, and "the charges are all turned inside" has a field to be turned by.
     */
    const v = 2*rnd()-1, vp = 2*Math.PI*rnd(), vs = Math.sqrt(Math.max(0,1-v*v));
    W.ux[i]=vs*Math.cos(vp); W.uy[i]=vs*Math.sin(vp); W.uz[i]=v;
    /*
     * AND THE FIELD MUST BE TANGENTIAL, not radial, or no charge can be turned inward.
     *
     * A turn about b^ preserves u^ . b^. With b^ radial that is the RADIAL component of the
     * heading, so both charges keep their in-and-out motion exactly and only spiral opposite ways
     * in azimuth: measured, the charge asymmetry stayed under 0.02 at every radius. To turn one
     * charge IN and the other OUT the field has to have a component ACROSS the radius.
     *
     * So the polarity is the sign of how the ray goes relative to phi^, which makes
     * B = sum p u^ ~ |u^ . phi^| phi^ - tangential, as a circulating body's is - while the
     * headings stay spread over the sphere and are not parallel to it.
     */
    const rho2 = Math.hypot(W.x[i], W.y[i]) || 1;
    const fx = -W.y[i]/rho2, fy = W.x[i]/rho2;
    W.p[i] = (W.ux[i]*fx + W.uy[i]*fy) >= 0 ? 1 : -1;
    W.q[i]=rnd()<0.5?1:-1;
  }
  W.n = NB;
}
for (let t = 0; t < TICKS; t++) tick(W, R, 1, 3);

console.log(`THETA=${THDEG}deg  CYCLE=${CYCLE}  body=${BODY}  ${TICKS} ticks  ${W.n} rays`);
console.log(`  full lap (${CYCLE} turns): <u^.u^0> = ${(W.recur/Math.max(1,W.recurN)).toFixed(4)}` +
  `   over ${W.recurN} laps`);
console.log(`  half lap (${CYCLE/2} turns): <u^.u^0> = ${(W.half/Math.max(1,W.halfN)).toFixed(4)}` +
  `   over ${W.halfN}`);
/*
 * THE ANGULAR CONTENT OF THE BOUND BODY - which needs no closed orbit.
 *
 * Two distributions, both against the body's own axis: WHERE its rays are (position, which is
 * the orbital's shape) and WHERE THEY POINT (direction). A harmonic in either is the pattern the
 * rotation made, and neither asks whether a lap came back to its start.
 */
{
  const NA = 24, RB = 1.6;
  const pos = new Float64Array(NA), dir = new Float64Array(NA);
  let inb = 0;
  for (let i = 0; i < W.n; i++) {
    const r = Math.hypot(W.x[i], W.y[i], W.z[i]);
    if (r > RB || r < 1e-9) continue;
    inb++;
    pos[Math.min(NA-1, Math.floor((W.z[i]/r + 1)/2*NA))]++;
    dir[Math.min(NA-1, Math.floor((W.uz[i] + 1)/2*NA))]++;
  }
  const P = (l: number, x: number): number => {
    if (l === 0) return 1; if (l === 1) return x;
    let pm = 1, p = x;
    for (let k = 2; k <= l; k++) { const pn = ((2*k-1)*x*p - (k-1)*pm)/k; pm = p; p = pn; }
    return p;
  };
  const proj = (h: Float64Array) => {
    let tot = 0; for (const v of h) tot += v;
    if (!tot) return [0,0,0,0];
    return [1,2,3,4].map(l => {
      let a = 0;
      for (let i = 0; i < NA; i++) a += (h[i]/tot*NA - 1) * P(l, -1 + (i+0.5)*2/NA) / NA;
      return a * (2*l+1);
    });
  };
  /*
   * AND THE CHARGE, SPLIT BY SIGN - which is where the proposed mechanism lives. If the positive
   * charges go where the negative ones do not, the two profiles differ, and the pattern of the
   * difference is the harmonic. A single density cannot show this however finely it is measured.
   */
  const posR = new Float64Array(16), negR = new Float64Array(16), cnt = new Float64Array(16);
  for (let i = 0; i < W.n; i++) {
    const r = Math.hypot(W.x[i], W.y[i], W.z[i]);
    const ir = Math.floor(r / 3.2 * 16);
    if (ir >= 16) continue;
    if (W.q[i] > 0) posR[ir]++; else negR[ir]++;
    cnt[ir]++;
  }
  console.log(`  --- charge by radius: does + go where - does not? ---`);
  console.log(`     r      n(+)     n(-)    (+ - -)/(+ + -)`);
  for (let ir = 0; ir < 12; ir++) {
    const t = posR[ir] + negR[ir];
    if (!t) continue;
    console.log(`  ${((ir+0.5)*3.2/16).toFixed(2).padStart(5)}  ${String(Math.round(posR[ir])).padStart(8)} ` +
      `${String(Math.round(negR[ir])).padStart(8)}   ${((posR[ir]-negR[ir])/t).toFixed(4).padStart(9)}`);
  }
  console.log(`  --- the body's angular content (${inb} rays, no closure needed) ---`);
  console.log(`  where they ARE   P1..P4: ` + proj(pos).map(v => v.toFixed(4).padStart(9)).join(""));
  console.log(`  where they POINT P1..P4: ` + proj(dir).map(v => v.toFixed(4).padStart(9)).join(""));
}
console.log(`  --- and only where the field is COHERENT (|B| > 4x the vacuum's own) ---`);
console.log(`  full lap: <u^.u^0> = ${(W.recurB/Math.max(1,W.recurBN)).toFixed(4)}   over ${W.recurBN} laps`);
console.log(`  half lap: <u^.u^0> = ${(W.halfB/Math.max(1,W.halfBN)).toFixed(4)}   over ${W.halfBN}`);
console.log(`\n  a closed ring: full near +1, half near -1.`);
console.log(`  diffusion:     both near 0, and equal.`);
