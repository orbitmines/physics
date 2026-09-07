/**
 * WHAT VACUUM WOULD GIVE A CLOUD BIG ENOUGH TO BE AN ORBITAL?
 *
 * The cloud is three cells across because the mean free path is one and a half, and no box
 * makes it bigger. Three cells and twelve directions cannot carry an orbital: on fcc-12 the
 * angle to the axis takes the values 0, 45 and 90 degrees and nothing between, so |Y_lm| is
 * nearly a two-valued thing and the picture is a ball in two colours however it is drawn.
 *
 * SO THE QUESTION IS WHAT THE VACUUM WOULD HAVE TO BE. Occupancy is what sets the range - a
 * carrier dies when it meets something, so a thinner vacuum reaches further - and `nu` is
 * what sets occupancy. This sweeps it and reports the range and the size of the cloud, so the
 * picture that follows can say which vacuum it is of rather than implying it is this one.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { emit, grid, profile, step } from "../src/lib/Vlasov2.ts";
const g: any = GEOMETRIES["fcc-12"], N = 31, C = 15;

console.log("  nu     occupancy       r=1       r=2       r=3       r=5       r=8      r=12      r=16");
for (const nu of [0.488, 0.05, 0.005]) {
  const G = grid(g, N);
  for (const a of G.n) a.fill(0.0485);
  const R = { nu, sigma: 3.48, cap: 1, tau: 3.48, shine: 0.05, fold: 0.02, stir: 0.12 };
  for (let t = 0; t < 40; t++) step(G, R);
  const occ = profile(G, 20).gross[10] / g.DEG;
  for (let t = 0; t < 50; t++) {
    emit(G, { at: [C,C,C], radius: 1, exits: () => 1, amount: 0.5 });
    step(G, R);
  }
  const pr = profile(G, 18);
  console.log(String(nu).padStart(6), occ.toFixed(4).padStart(10), "  ",
    [1,2,3,5,8,12,16].map(r => Math.abs(pr.net[r]).toExponential(1).padStart(9)).join(" "));
}
console.log("\n  the model's own vacuum is nu = 0.488, occupancy 0.19");
