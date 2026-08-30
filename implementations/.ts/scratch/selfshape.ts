/**
 * LET THE SHAPE CHOOSE ITSELF - seed NOISE, iterate to a fixed point, see what is left.
 *
 * `emerge.ts` seeded a P_l ripple and asked whether it grew. That cannot settle the question,
 * because the turn rate goes as |B| and |P_l| for ODD l is an even function with no P_l
 * component in it at all. So "even l amplify, odd l die" is predicted by the modulus alone,
 * with no physics: l = 3 came back at +0.02 exactly as that artefact says it should. Seeding the
 * answer and finding the answer is not a measurement.
 *
 * So seed white noise in the field - every l present at the same small amplitude, none preferred
 * - and iterate: cast rays, read back the field they made, feed it in again. Whatever the rules
 * hold up is what survives, and whatever they do not decays. If a particular l comes to dominate
 * a spectrum that started flat, the rules chose it. If the spectrum stays flat or dies away
 * uniformly, they did not.
 *
 * Nothing in this run knows what a spherical harmonic is except the projection that reads the
 * answer out. The source is isotropic and unpolarised.
 *
 * usage: npx tsx scratch/selfshape.ts [theta-deg] [millions per pass] [passes] [seed amplitude]
 */
import { bins, cast, type Rules, type Source } from "../src/lib/Rays.ts";
import { legendre } from "../src/lib/Kernel.ts";

const THETA = Number(process.argv[2] ?? 45) * Math.PI / 180;
const MRAYS = Number(process.argv[3] ?? 1);
const PASSES = Number(process.argv[4] ?? 8);
const AMP = Number(process.argv[5] ?? 0.5);
const RMAX = 4, NR = 40, NU = 40, LMAX = 6;

const SRC: Source = { weight: () => 1, sign: () => 1, schedule: () => 1, period: 1e9 };

let rs = 987654321 >>> 0;
const rnd = () => { rs = (rs + 0x6D2B79F5) | 0;
  let t = Math.imul(rs ^ (rs >>> 15), 1 | rs);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

/* the field as a table over (r, cos theta), radial, interpolated when a ray asks for it */
let B = new Float64Array(NR * NU);
for (let i = 0; i < B.length; i++) B[i] = AMP * (2 * rnd() - 1);      // white noise

const asField = (tab: Float64Array) =>
  (x: number, y: number, z: number, out: Float64Array) => {
    const r = Math.hypot(x, y, z);
    if (r < 1e-9 || r >= RMAX) { out[0] = out[1] = out[2] = 0; return; }
    const ir = Math.min(NR - 1, Math.floor(r / RMAX * NR));
    const iu = Math.min(NU - 1, Math.floor((z / r + 1) / 2 * NU));
    const s = tab[ir * NU + iu];
    out[0] = s * x / r; out[1] = s * y / r; out[2] = s * z / r;
  };

/** the spectrum of a field table: how much of each P_l it holds, radius by radius then averaged */
const spectrum = (tab: Float64Array) => {
  const c = new Float64Array(LMAX + 1);
  let rows = 0;
  for (let ir = 0; ir < NR; ir++) {
    const r = (ir + 0.5) * RMAX / NR;
    if (r < 0.4 || r > RMAX * 0.9) continue;
    let ss = 0;
    for (let iu = 0; iu < NU; iu++) ss += tab[ir*NU + iu] ** 2;
    const rms = Math.sqrt(ss / NU);
    if (!(rms > 0)) continue;
    for (let l = 0; l <= LMAX; l++) {
      let a = 0;
      for (let iu = 0; iu < NU; iu++) {
        const u = -1 + (iu + 0.5) * 2 / NU;
        a += tab[ir*NU + iu] / rms * legendre(l, u);
      }
      c[l] += a / NU * (2*l + 1);
    }
    rows++;
  }
  for (let l = 0; l <= LMAX; l++) c[l] /= Math.max(1, rows);
  return c;
};

const show = (c: Float64Array) =>
  Array.from(c).map((v, l) => `P${l}=${v.toFixed(3).padStart(7)}`).join(" ");

console.log(`THETA = ${(THETA*180/Math.PI).toFixed(0)}deg, ${MRAYS}M rays a pass, ${PASSES} passes`);
console.log(`the field starts as WHITE NOISE - every l present equally, none preferred.\n`);
console.log(`  pass 0 (noise)  ${show(spectrum(B))}`);

for (let pass = 1; pass <= PASSES; pass++) {
  const R: Rules = { theta: THETA, absorb: 0.5, stir: 0.5, field: asField(B) };
  const out = bins(NR, NU, RMAX);
  cast({ R, source: SRC, out, count: MRAYS * 1_000_000, seed: 1000 + pass });
  /* what the rays made becomes what turns them next - normalised so the test is about SHAPE
   * and not about whether the overall level runs away or dies, which is a separate question */
  let ss = 0;
  for (const v of out.fieldR) ss += v * v;
  const rms = Math.sqrt(ss / out.fieldR.length) || 1;
  B = Float64Array.from(out.fieldR, v => AMP * v / rms);
  console.log(`  pass ${String(pass).padStart(2)}        ${show(spectrum(B))}`);
}
console.log(`\n  a spectrum that started flat and ended peaked is the rules CHOOSING a shape.`);
console.log(`  one that stays flat is them choosing nothing.`);
