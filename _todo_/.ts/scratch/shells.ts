/**
 * A BODY IN THE VACUUM, AND WHETHER THE ROTATION PUTS SHELLS AROUND IT.
 *
 * The chain being tested, and every link is the rules':
 *   RADIATING clumps the vacuum          -> a lump is a body
 *   a body's polarity is a FIELD          -> `fieldAt`, the density's own moment
 *   the field TURNS what goes past it     -> `steer`, at a rate that IS the field's size
 *   and a turn that closes is an ORBIT    -> which can only close at particular radii
 *
 * THE CLOSURE CONDITION, worked out in advance so the answer is falsifiable. A ray at radius r
 * turns once every 1/|B| of path, and a circle of radius r needs CYCLE = 2pi/THETA turns spaced
 * 2pi r/CYCLE apart. Setting the two equal:
 *
 *      |B(r)| . r  =  1 / THETA
 *
 * So a shell sits wherever the field has fallen to that value, and nowhere else. This does not
 * assume a shape, a harmonic or a wavefunction: it is the turn rate against the geometry of a
 * circle. If the density shows rings at the radii this picks out, the rotation put them there.
 *
 * The body is a CLUMP, which is what RADIATING makes on its own - not an imposed source.
 *
 * usage: npx tsx scratch/shells.ts [shine] [ticks]
 */
import { gather, tick, world, type Rules } from "../src/lib/Vacuum.ts";

const SHINE = Number(process.argv[2] ?? 0.5);
const TICKS = Number(process.argv[3] ?? 50);
/*
 * THETA IS THE ARGUMENT NOW, because the closure condition makes a FALSIFIABLE prediction about
 * it and a single value cannot test one. |B(r)| r = 1/THETA, and |B| r falls outward from the
 * body - so a SMALLER theta needs a BIGGER |B| r and puts the shell FURTHER IN. If a density
 * bump exists and moves outward as theta grows, the rotation put it there. If it sits still, it
 * is the body's edge and has nothing to do with the turning.
 */
const THETA = Number(process.argv[4] ?? 45) * Math.PI / 180;
const R: Rules = { theta: THETA, sigma: 1, tau: 1, nu: 1, stir: 1,
                   shine: SHINE, makes: "polarity" };
const W = world(24, 12, 6_000_000, 1/200);
const dt = 1;      /* a tick is a tick - see the beat comment in Vacuum.ts */

/* SEED A CLUMP - a lump of one polarity at the middle, which is what a body is here. Its own
 * dynamics decide whether it holds together; nothing pins it. */
let s = 12345 >>> 0;
const rnd = () => { s = (s + 0x6D2B79F5)|0; let t = Math.imul(s ^ (s>>>15), 1|s);
  t = (t + Math.imul(t ^ (t>>>7), 61|t)) ^ t; return ((t ^ (t>>>14))>>>0)/4294967296; };
const NB = 120_000;
for (let i = 0; i < NB; i++) {
  const r = 0.8 * Math.cbrt(rnd());
  const u = 2*rnd()-1, ph = 2*Math.PI*rnd(), st = Math.sqrt(Math.max(0,1-u*u));
  W.x[i] = r*st*Math.cos(ph); W.y[i] = r*st*Math.sin(ph); W.z[i] = r*u;
  /*
   * CIRCULATING, NOT RADIATING - because a body is a region of TURNING and a ball of outgoing
   * rays is not a body, it is an explosion. Seeded outward at speed one they had left the six
   * unit box within a dozen ticks and the "body" measured at the end was whatever the vacuum had
   * put back: density 4.96 against the 198 it started at.
   *
   * So the seed goes AROUND the axis - u^ tangential, phi-hatwise - which is a lump whose rays
   * keep returning instead of leaving, and whose polarity therefore stays where it is. Whether
   * the rules HOLD it there is the thing being asked; nothing pins it.
   */
  W.ux[i] = -Math.sin(ph); W.uy[i] = Math.cos(ph); W.uz[i] = 0;
  W.p[i] = 1; W.q[i] = rnd() < 0.5 ? 1 : -1;
}
W.n = NB;

for (let t = 0; t < TICKS; t++) tick(W, R, dt, 3);
gather(W);

/* the radial profile: density, the field's size, and where |B| r = 1/THETA */
const NR = 28, RMAX = 5.5;
const dens = new Float64Array(NR), bmag = new Float64Array(NR), cnt = new Float64Array(NR);
const C = (W.N - 1) / 2;
for (let a = 0; a < W.N; a++) for (let b = 0; b < W.N; b++) for (let e = 0; e < W.N; e++) {
  const x = (a + 0.5 - W.N/2) * W.h, y = (b + 0.5 - W.N/2) * W.h, z = (e + 0.5 - W.N/2) * W.h;
  const r = Math.hypot(x, y, z);
  const ir = Math.floor(r / RMAX * NR);
  if (ir >= NR) continue;
  const c = (a*W.N + b)*W.N + e;
  dens[ir] += W.rho[c]; cnt[ir]++;
  bmag[ir] += Math.hypot(W.Bx[c], W.By[c], W.Bz[c]);
}
console.log(`THETA=${(THETA*180/Math.PI).toFixed(0)}deg shine=${SHINE} ${TICKS} ticks ${W.n} rays.  closure wants |B| r = ${(1/THETA).toFixed(3)}`);
console.log(`     r     density      |B|      |B| r     <- shell where |B| r crosses ${(1/THETA).toFixed(2)}`);
let prev = 0;
for (let ir = 0; ir < NR; ir++) {
  if (!cnt[ir]) continue;
  const r = (ir + 0.5) * RMAX / NR, d = dens[ir]/cnt[ir], bm = bmag[ir]/cnt[ir];
  const br = bm * r;
  const mark = prev !== 0 && ((prev - 1/THETA) * (br - 1/THETA) < 0) ? "   <== CLOSES HERE" : "";
  console.log(`  ${r.toFixed(2).padStart(5)}  ${d.toFixed(4).padStart(9)}  ${bm.toFixed(4).padStart(8)}  ${br.toFixed(4).padStart(8)}${mark}`);
  prev = br;
}
