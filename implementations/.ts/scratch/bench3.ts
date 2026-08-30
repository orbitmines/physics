import { GEOMETRIES } from "../src/lib/Local.ts";
import { grid, step } from "../src/lib/Vlasov2.ts";
const g: any = GEOMETRIES["fcc-12"];
for (const N of [25, 41]) {
  const t0 = Date.now();
  const G = grid(g, N); for (const a of G.n) a.fill(0.0485);
  for (let t = 0; t < 60; t++) step(G, { nu: 2.42, sigma: 1, cap: 1, tau: 0.5, shine: 0.3, fold: 0.02, stir: 0.6 });
  const ms = Date.now() - t0;
  console.log(`N=${N}  ${(2*R(N)+1)}x${(2*R(N)+1)} panel   150 ticks: ${(ms/1000).toFixed(1)}s` +
    `   -> 12 states at 150t: ${(12*2.5*ms/1000/60).toFixed(1)} min`);
}
function R(N: number) { return Math.floor((N-1)/2) - 2; }
