/**
 * DOES IT SETTLE AT A VACUUM ON ITS OWN, AND IS IT THE ONE THE RULES PREDICT?
 *
 * Nothing is put in: the box starts EMPTY and (G/2) fills it. If the rules are faithful it must
 * settle where what a split makes pays for what the meetings take, which `vacuum.continuum`
 * writes as nu(1-rho) = sigma rho^2 - and that fixed point is arithmetic done in advance, not a
 * thing fitted afterwards. A model that settles somewhere else is not this theory.
 */
import { tick, world, type Rules } from "../src/lib/Vacuum.ts";

const R: Rules = { theta: Math.PI/4, sigma: 1, tau: 1, nu: 1, stir: 1, shine: 0, makes: "polarity" };
/* 8 cells a side over a box of 8, so a cell is unit volume; weight 1/200 so that a cell at the
 * fixed point holds ~120 particles and `1 - rho` is read off a smooth number */
const W = world(8, 8, 4_000_000, 1/200);
const dt = 1;      /* a tick is a tick - see the beat comment in Vacuum.ts */

/* nu(1-rho) = sigma rho^2 (facing halves both sides, so they cancel) */
const root = (nu: number, sg: number) => (-nu + Math.sqrt(nu*nu + 4*sg*nu)) / (2*sg);
console.log(`predicted fixed point rho = ${root(R.nu, R.sigma).toFixed(4)}`);
console.log(`start: an EMPTY box\n  tick    rays      rho     born    died`);
for (let t = 1; t <= 60; t++) {
  const s = tick(W, R, dt, 7);
  if (t % 5 === 0 || t <= 3) {
    const rho = W.n * W.wt / (W.L**3);
    console.log(`  ${String(t).padStart(4)}  ${String(W.n).padStart(7)}  ${rho.toFixed(4)}  ` +
      `${String(s.born).padStart(6)}  ${String(s.died).padStart(6)}`);
  }
  if (W.n >= W.cap * 0.95) { console.log("  hit capacity"); break; }
}
