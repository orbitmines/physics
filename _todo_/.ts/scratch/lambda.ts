/** what mean free path does the solver actually have, and what sigma gives the lattice's 1.5? */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { grid, step } from "../src/lib/Vlasov2.ts";
const g: any = GEOMETRIES["fcc-12"], N = 31, C = 15;

const lam = (sigma: number) => {
  const G = grid(g, N);
  for (const a of G.n) a.fill(0.0485);
  const RATES = { nu: 0.488, sigma, cap: 1, tau: 0.5, shine: 0, fold: 0, stir: 0.6 };
  for (let t = 0; t < 30; t++) step(G, RATES);           // settle the vacuum
  /* light one exit at the middle, well above vacuum, and follow the ridge outward */
  const d0 = 0;
  for (let t = 0; t < 40; t++) {
    const b0 = ((C*N + C)*N + C)*g.DEG;
    G.n[0][b0 + d0] = 5;
    step(G, RATES);
  }
  /* the profile along that exit's own direction */
  const v = (g.L[d0] ?? g.U[d0]) as number[];
  const out: number[] = [];
  for (let k = 1; k <= 12; k++) {
    const x = C + (v[0]|0)*k, y = C + (v[1]|0)*k, z = C + ((v[2]??0)|0)*k;
    if (x<0||y<0||z<0||x>=N||y>=N||z>=N) break;
    const b = ((x*N+y)*N+z)*g.DEG;
    out.push(G.n[0][b + d0]);
  }
  /* the decay length from the first two decades of it */
  let lo = 0;
  for (let i = 1; i < out.length; i++) {
    if (out[i] <= 0 || out[0] <= 0) break;
    if (out[i] < out[0] / Math.E) { lo = i; break; }
  }
  return { lam: lo || out.length, prof: out.slice(0, 6) };
};

/*
 * SIGMA IS NOT ONE, AND THE REASON IS WHAT A MEETING IS.
 *
 * The rule destroys both ends of every opposite facing pair, so "the fraction removed when a
 * meeting happens" is indeed one. But sigma here multiplies the STANDING density of what is
 * facing, and that is not how often a meeting happens: (G/2) splits EVERY neutral point EVERY
 * tick, so a ray that moves runs into the freshly-made half coming the other way essentially
 * always, not with probability 0.097. Sigma therefore carries the encounter rate as well as
 * the fatality, and what fixes it is the range the lattice actually has.
 */
console.log("sigma   lambda (cells)");
for (const s of [1, 5, 20, 50]) console.log(String(s).padStart(5), String(lam(s).lam).padStart(9));
let lo = 20, hi = 200;
for (let i = 0; i < 12; i++) {
  const mid = Math.sqrt(lo * hi);
  if (lam(mid).lam > 1.5) lo = mid; else hi = mid;
}
const fit = Math.sqrt(lo * hi);
console.log(`\n  sigma that gives the lattice's lambda of 1.5 cells: ${fit.toFixed(1)}`);
console.log("  profile there:", lam(fit).prof.map(x => x.toFixed(3)).join(" "));
