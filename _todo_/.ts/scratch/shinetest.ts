/** does `shine` sustain the beam? - a driven source, profile measured, shine on and off */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { emit, grid, profile, step } from "../src/lib/Vlasov2.ts";
const g: any = GEOMETRIES["fcc-12"], N = 41, C = 20;
console.log("a driven source, radial profile of |net| per cell\n");
console.log("shine   r=1     r=2     r=3     r=5     r=8    r=12    r=16");
for (const shine of [0, 0.01, 0.05, 0.2]) {
  const G = grid(g, N);
  for (const a of G.n) a.fill(0.0485);
  const RATES = { nu: 0.488, sigma: 3.48, cap: 1, tau: 2, shine, fold: 0.02, stir: 0.6 };
  for (let t = 0; t < 120; t++) {
    emit(G, { at: [C,C,C], radius: 1, exits: () => 1, amount: 0.5 });
    step(G, RATES);
  }
  const pr = profile(G, 18);
  console.log(String(shine).padStart(5),
    [1,2,3,5,8,12,16].map(r => Math.abs(pr.net[r]).toFixed(4).padStart(7)).join(" "));
}
console.log("\n  the lattice: 2.40, 1.11, 0.167 at r=1,2,3 then noise");
