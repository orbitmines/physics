/**
 * DIFFERENT EMISSION PATTERNS, AND WHAT THE VACUUM MAKES OF EACH.
 *
 * The proposal: a source need not fire the same way every direction every tick. It can do
 * nothing in some directions, more often in others, and the pattern may have a period. Different
 * patterns are different setups - and the claim to test is that they are what different ENERGY
 * STATES are.
 *
 * This is NOT the earlier ray renders. Those set the emission AMPLITUDE to |Y_lm|, so the shape
 * measured afterwards was the shape put in. Here a pattern only says WHEN and WHICH WAY the thing
 * fires - a gate, 0 or 1 - and what the vacuum settles into is its own doing. Two of these
 * patterns carry no angular preference at all, so if a harmonic comes out of THOSE it was not
 * put there.
 *
 * usage: npx tsx scratch/states.ts [theta-deg] [ticks]
 */
import { gather, tick, world, type Rules } from "../src/lib/Vacuum.ts";

const THDEG = Number(process.argv[2] ?? 90);
const TICKS = Number(process.argv[3] ?? 45);
const N = 40, L = 9.6, RATE = 8;

const P = (l: number, x: number): number => {
  if (l === 0) return 1; if (l === 1) return x;
  let pm = 1, p = x;
  for (let k = 2; k <= l; k++) { const pn = ((2*k-1)*x*p - (k-1)*pm)/k; pm = p; p = pn; }
  return p;
};

type Pat = { name: string; says: string;
             f?: (ux: number, uy: number, uz: number, t: number) => number };
const PATTERNS: Pat[] = [
  { name: "steady   ", says: "every way, every tick - no pattern at all (the control)" },
  { name: "blinking ", says: "every way, but only every 4th tick - a PERIOD and no direction" },
  { name: "polar    ", says: "only within 45deg of the axis - a direction and no period" },
  { name: "equator  ", says: "only within 30deg of the equator" },
  { name: "winding  ", says: "one azimuthal sector, advancing a quarter turn each tick" },
];
PATTERNS[1].f = (_x, _y, _z, t) => (t % 4 === 0 ? 1 : 0);
PATTERNS[2].f = (_x, _y, z) => (Math.abs(z) > Math.cos(Math.PI/4) ? 1 : 0);
PATTERNS[3].f = (_x, _y, z) => (Math.abs(z) < Math.sin(Math.PI/6) ? 1 : 0);
PATTERNS[4].f = (x, y, _z, t) => {
  const ph = Math.atan2(y, x) - t * Math.PI/2;
  return Math.cos(ph) > 0.7 ? 1 : 0;
};

console.log(`THETA=${THDEG}deg  ${TICKS} ticks  - the vacuum's response to each pattern`);
console.log(`  pattern      rays    shell r   P1      P2      P3      P4     what it is`);
for (const pat of PATTERNS) {
  const R: Rules = { theta: THDEG*Math.PI/180, sigma: 1, tau: 1, nu: 1, stir: 1,
    shine: 0.02, makes: "polarity",
    source: { rate: RATE, radius: 0.12, charge: 1, pattern: pat.f } };
  const W = world(N, L, 8_000_000, 1/200);
  const K = world(N, L, 8_000_000, 1/200);
  const noSrc = { ...R, source: undefined };
  const NR = 16, RMAX = 3.2, NA = 16;
  const rad = new Float64Array(NR), ang = new Float64Array(NA);
  let ns = 0;
  for (let t = 0; t < TICKS; t++) {
    tick(W, R, 1, 5); tick(K, noSrc, 1, 5);
    if (t < TICKS/3) continue;
    gather(W); gather(K);
    for (let a = 0; a < N; a++) for (let b = 0; b < N; b++) for (let e = 0; e < N; e++) {
      const x=(a+0.5-N/2)*L/N, y=(b+0.5-N/2)*L/N, z=(e+0.5-N/2)*L/N;
      const r = Math.hypot(x,y,z); if (r >= RMAX || r < 0.2) continue;
      const c = (a*N+b)*N+e, d = W.turned[c] - K.turned[c];
      rad[Math.floor(r/RMAX*NR)] += d;
      ang[Math.min(NA-1, Math.floor((z/r + 1)/2*NA))] += d;
    }
    ns++;
  }
  let best = 0, bi = 0;
  for (let i = 1; i < NR; i++) { const v = rad[i]/((i+0.5)**2); if (v > best) { best = v; bi = i; } }
  let tot = 0; for (const v of ang) tot += v;
  const proj = [1,2,3,4].map(l => {
    let s = 0;
    for (let i = 0; i < NA; i++) s += (ang[i]/tot*NA - 1) * P(l, -1 + (i+0.5)*2/NA) / NA;
    return s * (2*l+1);
  });
  console.log(`  ${pat.name} ${String(W.n).padStart(7)}   ${((bi+0.5)*RMAX/NR).toFixed(2)}   ` +
    proj.map(v => v.toFixed(3).padStart(7)).join(" ") + `   ${pat.says}`);
}
