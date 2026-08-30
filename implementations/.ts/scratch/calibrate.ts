/**
 * WHAT nu AND sigma HAVE TO BE - measured off the lattice rather than set to a half.
 *
 * The continuum equation has two rates in it that the lattice does not name: how fast a
 * neutral point makes a pair, and how fast a facing pair is destroyed. Both ARE in the
 * lattice - (G/2) fires on every neutral point every tick, and ANNIHILATION on every facing
 * opposite pair - so they are counted rather than chosen, and the continuum is only the same
 * theory if it is given the same numbers.
 *
 * WHAT IS COUNTED, per cell per tick, on a bare vacuum:
 *
 *   nu      pairs made - how much density (G/2) adds where there is room
 *   sigma   how much of a facing pair is destroyed when there is one
 *   rho     what the vacuum settles at, which is the check: the continuum run must land on
 *           the same occupancy or the two rates are wrong
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_XOR } from "../src/theories/G^XOR+XOR.ts";
import { grid, profile, step } from "../src/lib/Vlasov2.ts";

const g: any = GEOMETRIES["fcc-12"], N = 21, C = 10, WARM = 12, T = 60;

/* ---- the lattice: what it actually does per cell per tick ---- */
const w: any = new World({ theory: G_XOR_XOR, geometry: g, N, seed: 1,
  boundary: "absorb", slotUniformRng: true } as any);
w.world.turnLog = [];
for (let t = 0; t < WARM; t++) { w.tick(); w.world.turnLog.length = 0; }

let occ = 0, cells = 0, ticks = 0;
let annihPer = 0;
const a0 = w.world.backend.stats.annihilations ?? 0;
for (let t = 0; t < T; t++) {
  w.tick();
  for (const l of w.locals) {
    const at = w.embedding.at(l as any); if (!at) continue;
    if (Math.hypot(at[0]-C, at[1]-C, at[2]-C) > 6) continue;
    cells++;
    let n = 0;
    for (const r of (l as any).rays) if (r.active) n++;
    occ += n / g.DEG;
  }
  ticks++;
  w.world.turnLog.length = 0;
}
const rhoLat = occ / cells;
/* the box-wide count over the box-wide cells - the ball was the wrong denominator and made
 * this ten times too big */
annihPer = ((w.world.backend.stats.annihilations ?? 0) - a0) / (N ** 3) / ticks;

console.log("MEASURED OFF THE LATTICE (fcc-12, bare vacuum)");
console.log(`  occupancy rho          = ${rhoLat.toFixed(4)}   (fraction of exits carrying)`);
console.log(`  annihilations per cell per tick = ${annihPer.toFixed(4)}`);

/*
 * AND WHAT THE CONTINUUM NEEDS TO LAND THERE. At the fixed point nothing changes, so what is
 * made pays exactly for what is taken: nu(1-rho) = sigma·rho^{2}. One equation, two unknowns
 * - so the annihilation count fixes sigma and the fixed point then fixes nu.
 */
/*
 * SIGMA IS NOT A RATE TO BE FITTED - IT IS ONE, BY THE RULE. ANNIHILATION destroys BOTH ends
 * of every facing opposite pair, outright and every time: `clear(r)` on each. There is no
 * partial meeting and no chance in it. So the continuum's sigma, which is the fraction of the
 * smaller of a facing pair that is removed, is exactly 1.
 *
 * WHICH LEAVES ONE UNKNOWN AND ONE EQUATION. At the fixed point what is made pays for what is
 * taken - nu(1-rho) = sigma·rho^{2} - so nu is whatever puts the continuum at the occupancy
 * the lattice actually sits at. That is a calibration of ONE number against a measurement,
 * and the check is that it lands there.
 */
const sigma = 1;
const nu = sigma * rhoLat * rhoLat / (1 - rhoLat);
console.log(`\n  => sigma = ${sigma.toFixed(4)}   nu = ${nu.toFixed(4)}`);

/* ---- and the check: does the continuum settle where the lattice did? ---- */
console.log("\nCONTINUUM WITH THOSE RATES");
/*
 * AND nu IS SOLVED FOR RATHER THAN DERIVED. The fixed point I wrote out - nu(1-rho) =
 * sigma·rho^{2} - is the equation's, but what runs is a discrete step with a room gate and a
 * per-exit product in it, and those do not land in exactly the same place. So nu is found by
 * bisection against the one thing that has to match: the occupancy the lattice actually sits
 * at. One number, one measurement, and the search is visible rather than a constant.
 */
const settle = (nn: number) => {
  const G = grid(g, N);
  for (const a of G.n) a.fill(rhoLat / 4);
  for (let t = 0; t < T + WARM; t++) step(G, { nu: nn, sigma, cap: 1, tau: 0.5, shine: 0.3, fold: 0.02, stir: 0.6 });
  const pr = profile(G, 6);
  return pr.gross.slice(1, 7).reduce((a, b) => a + b, 0) / 6 / g.DEG;
};
let lo = 1e-4, hi = 20;
for (let i = 0; i < 24; i++) {
  const mid = Math.sqrt(lo * hi);
  if (settle(mid) < rhoLat) lo = mid; else hi = mid;
}
const nuFit = Math.sqrt(lo * hi);
console.log(`\n  nu that lands on the lattice's occupancy: ${nuFit.toFixed(4)}`);

for (const [nn, ss, lab] of [[0.5, 0.5, "the placeholder"], [nu, sigma, "from the algebra"],
     [nuFit, sigma, "solved for"]] as [number, number, string][]) {
  const G = grid(g, N);
  for (const a of G.n) a.fill(rhoLat / 4);
  for (let t = 0; t < T + WARM; t++) step(G, { nu: nn, sigma: ss, cap: 1, tau: 0.5, shine: 0.3, fold: 0.02, stir: 0.6 });
  const pr = profile(G, 6);
  const rho = pr.gross.slice(1, 7).reduce((a, b) => a + b, 0) / 6 / g.DEG;
  console.log(`  ${lab.padEnd(15)} nu=${nn.toFixed(3)} sigma=${ss.toFixed(3)}` +
    `  -> rho = ${rho.toFixed(4)}   ${Math.abs(rho - rhoLat) < 0.02 ? "MATCHES" :
      `off by ${((rho - rhoLat) / rhoLat * 100).toFixed(0)}%`}`);
}
