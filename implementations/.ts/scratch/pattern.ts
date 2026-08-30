/**
 * THE PATTERN OF DIRECTIONS, WHICH IS WHERE THE HARMONIC SHOULD LIVE.
 *
 * The rotation need not be steady. `steer` fires when the banked field reaches one, so how long
 * a ray spends heading any way is whatever the local field happened to be - sporadic, and no
 * two rays alike. What is NOT free is the PATTERN: a turn is always by THETA, and about the
 * local axis, so the directions a ray can be in are the ones reachable by composing turns of
 * THETA. About a coherent axis that is a ring of CYCLE directions and nothing between them.
 *
 * So a closure condition on the RADIUS - which is what `shells.ts` tests - is the wrong object.
 * It assumes a steady circular orbit at a fixed rate, and the rotation is neither. What should
 * carry l and m is the distribution over DIRECTIONS: how the rays of a bound body are spread
 * over the sphere of headings, and whether that spread is a harmonic.
 *
 * Two things are measured, both in direction space and both against the body's own axis:
 *   the PITCH   P_l of u^ . z^ - how the headings are spread in polar angle. An l shows here.
 *   the RING    how u^ . b^ is distributed - the angle to the LOCAL field, which for a turn of
 *               THETA about that field can only take the values the ring allows. Peaks at
 *               discrete values are the finite ring showing itself; a smooth spread is not.
 *
 * usage: npx tsx scratch/pattern.ts [theta-deg] [ticks] [shine]
 */
import { gather, tick, world, type Rules } from "../src/lib/Vacuum.ts";
import { legendre } from "../src/lib/Kernel.ts";

const THDEG = Number(process.argv[2] ?? 90);
const TICKS = Number(process.argv[3] ?? 40);
const SHINE = Number(process.argv[4] ?? 0.02);
const THETA = THDEG * Math.PI / 180;
const R: Rules = { theta: THETA, sigma: 1, tau: 1, nu: 1, stir: 1, shine: SHINE,
                   makes: "polarity" };
const W = world(24, 12, 6_000_000, 1/200);

let s = 12345 >>> 0;
const rnd = () => { s = (s + 0x6D2B79F5)|0; let t = Math.imul(s ^ (s>>>15), 1|s);
  t = (t + Math.imul(t ^ (t>>>7), 61|t)) ^ t; return ((t ^ (t>>>14))>>>0)/4294967296; };
for (let i = 0; i < 120_000; i++) {
  const r = 0.8 * Math.cbrt(rnd());
  const u = 2*rnd()-1, ph = 2*Math.PI*rnd(), st = Math.sqrt(Math.max(0,1-u*u));
  W.x[i] = r*st*Math.cos(ph); W.y[i] = r*st*Math.sin(ph); W.z[i] = r*u;
  W.ux[i] = -Math.sin(ph); W.uy[i] = Math.cos(ph); W.uz[i] = 0;   // circulating
  W.p[i] = 1; W.q[i] = rnd() < 0.5 ? 1 : -1;
}
W.n = 120_000;
for (let t = 0; t < TICKS; t++) tick(W, R, 1, 3);
gather(W);

/* the body is where the density stands well above the vacuum - found, not assumed */
let vac = 0, k = 0;
for (let c = 0; c < W.rho.length; c++) { vac += W.rho[c]; k++; }
vac /= k;
const RB = 1.6;
const NA = 40;
const pitch = new Float64Array(NA);          // u^ . z^, the body's axis
const ring  = new Float64Array(NA);          // u^ . b^, the LOCAL field
let inBody = 0;
for (let i = 0; i < W.n; i++) {
  const r = Math.hypot(W.x[i], W.y[i], W.z[i]);
  if (r > RB) continue;
  inBody++;
  const a = Math.floor((W.uz[i] + 1) / 2 * NA);
  if (a >= 0 && a < NA) pitch[Math.min(NA-1, a)]++;
  const cx = Math.floor((W.x[i]/W.L + 0.5) * W.N), cy = Math.floor((W.y[i]/W.L + 0.5) * W.N),
        cz = Math.floor((W.z[i]/W.L + 0.5) * W.N);
  if (cx < 0 || cy < 0 || cz < 0 || cx >= W.N || cy >= W.N || cz >= W.N) continue;
  const c = (cx*W.N + cy)*W.N + cz;
  const bm = Math.hypot(W.Bx[c], W.By[c], W.Bz[c]);
  if (bm < 1e-9) continue;
  const d = (W.ux[i]*W.Bx[c] + W.uy[i]*W.By[c] + W.uz[i]*W.Bz[c]) / bm;
  const b = Math.floor((d + 1) / 2 * NA);
  if (b >= 0 && b < NA) ring[Math.min(NA-1, b)]++;
}

const proj = (h: Float64Array) => {
  let tot = 0; for (const v of h) tot += v;
  if (!tot) return [] as number[];
  return [1,2,3,4,6].map(l => {
    let a = 0;
    for (let i = 0; i < NA; i++) a += h[i]/tot * legendre(l, -1 + (i+0.5)*2/NA);
    return a * (2*l+1) * NA / 2 * (2/NA) * NA / 2;
  });
};
/* how PEAKED a histogram is against a flat one - a finite ring is spiky, diffusion is not */
const spike = (h: Float64Array) => {
  let tot = 0; for (const v of h) tot += v;
  if (!tot) return 0;
  let s2 = 0;
  for (const v of h) s2 += (v/tot - 1/NA) ** 2;
  return Math.sqrt(s2 * NA) * NA / 1;
};

console.log(`THETA=${THDEG}deg ticks=${TICKS} shine=${SHINE}  vacuum rho=${vac.toFixed(3)}  ` +
  `rays in body(r<${RB})=${inBody}`);
console.log(`  pitch  (u^ . z^, the body's axis)  P1..P6: ` +
  proj(pitch).map(v => v.toFixed(3).padStart(8)).join("") + `   spikiness ${spike(pitch).toFixed(2)}`);
console.log(`  ring   (u^ . b^, the LOCAL field)  P1..P6: ` +
  proj(ring).map(v => v.toFixed(3).padStart(8)).join("") + `   spikiness ${spike(ring).toFixed(2)}`);
console.log(`  ring histogram (cos of angle to local B, -1 .. +1):`);
let tot = 0; for (const v of ring) tot += v;
for (let i = 0; i < NA; i += 2) {
  const u = -1 + (i+0.5)*2/NA;
  const f = tot ? (ring[i]+ring[i+1])/tot : 0;
  console.log(`    ${u.toFixed(2).padStart(5)}  ${"#".repeat(Math.round(f*400))} ${(100*f).toFixed(1)}%`);
}
