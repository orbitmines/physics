/**
 * Two checks on the ray tracer, neither sharing code with what it is checked against.
 *
 *  1. its SCATTERING against `Kernel.kernel`, which integrates the same distribution in closed
 *     form. The tracer turns about a random axis and never computes a g_l; the kernel computes
 *     g_l and never turns anything. They must agree.
 *  2. its TRANSPORT with the scattering off, against exp(-absorb r)/r^2 - the exact density of
 *     an isotropic point source in a purely absorbing medium.
 */
import { kernel, legendre } from "../src/lib/Kernel.ts";
import { bins, cast, normalise, type Rules, type Source } from "../src/lib/Rays.ts";

/* ---- 1. the scattering distribution --------------------------------------------------- */
let s0 = 987654321 >>> 0, s1 = 123456789 >>> 0;
const rnd = () => { let x = s0, y = s1; s0 = y; x ^= x << 23; x >>>= 0;
  s1 = (x ^ y ^ (x >>> 17) ^ (y >>> 26)) >>> 0; return ((s1 + y) >>> 0) / 4294967296; };

console.log("scattering: <P_l(cos gamma)> sampled, against Kernel's closed form\n");
console.log("THETA   l        sampled        closed form      diff");
for (const deg of [45, 60, 90]) {
  const th = deg * Math.PI / 180, g = kernel(th, 4);
  const N = 2_000_000, acc = new Float64Array(5);
  const c = Math.cos(th), s = Math.sin(th);
  for (let i = 0; i < N; i++) {
    /* the tracer's own step, in isolation: u = z, turned about a uniform axis */
    const az = 2*rnd() - 1, ap = 2*Math.PI*rnd(), ar = Math.sqrt(Math.max(0, 1 - az*az));
    const kx = ar*Math.cos(ap), ky = ar*Math.sin(ap), kz = az;
    const dot = kz;                       // u = (0,0,1)
    const zz = 1*c + (kx*0 - ky*0)*s + kz*dot*(1 - c);
    const xx = 0*c + (ky*1 - kz*0)*s + kx*dot*(1 - c);
    const yy = 0*c + (kz*0 - kx*1)*s + ky*dot*(1 - c);
    const n = Math.hypot(xx, yy, zz) || 1;
    for (let l = 0; l <= 4; l++) acc[l] += legendre(l, zz/n);
  }
  for (const l of [1, 2, 3, 4])
    console.log(`${String(deg).padStart(4)}deg ${l}  ${(acc[l]/N).toFixed(6).padStart(12)}` +
      `   ${g[l].toFixed(6).padStart(12)}   ${Math.abs(acc[l]/N - g[l]).toExponential(1)}`);
}

/* ---- 2. transport with no scattering -------------------------------------------------- */
const ABS = 0.8;
const R: Rules = { theta: Math.PI/3, absorb: ABS, stir: 0 };
const src: Source = { weight: () => 1, sign: () => 1, schedule: () => 1, period: 1e9 };
const B = bins(40, 1, 10);
cast({ R, source: src, out: B, count: 2_000_000, seed: 7 });   // no phase: steady
const d = normalise(B, B.density);
console.log(`\ntransport, stir = 0, absorb = ${ABS}: density(r) x r^2 x exp(+${ABS} r) should be flat`);
console.log("    r      density      x r^2 e^{ar}");
for (let ir = 1; ir < 20; ir += 3) {
  const r = (ir + 0.5) * B.R / B.NR;
  const v = d[ir];
  console.log(`  ${r.toFixed(2).padStart(5)}  ${v.toExponential(4)}   ${(v*r*r*Math.exp(ABS*r)).toFixed(5)}`);
}
