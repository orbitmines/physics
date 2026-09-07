/** does a beam spread now? - the one thing the X's said was missing */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { grid, step } from "../src/lib/Vlasov2.ts";
const g: any = GEOMETRIES[process.argv[2] ?? "fcc-12"], N = 25, C = 12;
const G = grid(g, N);
for (const a of G.n) a.fill(0.0485);
/* a bright spot at the middle, on every exit - if it spreads, it is a medium */
const b0 = ((C*N + C)*N + C)*g.DEG;
for (let d = 0; d < g.DEG; d++) G.n[0][b0+d] = 2;
const RATES = { nu: 2.42, sigma: 1, cap: 1, tau: 0.5, shine: 0.3, fold: 0.02, stir: 0.6 };
console.log("how the excess spreads from the middle (net polarity by radius)\n");
console.log("tick    r=1     r=3     r=5     r=8    r=11");
for (let t = 1; t <= 40; t++) {
  step(G, RATES);
  if (t % 8) continue;
  const at = (r: number) => {
    let s = 0, n = 0;
    for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) for (let z = 0; z < N; z++) {
      if (Math.round(Math.hypot(x-C,y-C,z-C)) !== r) continue;
      const k = ((x*N+y)*N+z)*g.DEG; n++;
      for (let d = 0; d < g.DEG; d++) s += G.n[0][k+d]+G.n[1][k+d]-G.n[2][k+d]-G.n[3][k+d];
    }
    return n ? s/n : 0;
  };
  console.log(String(t).padStart(4), [1,3,5,8,11].map(r =>
    at(r).toFixed(4).padStart(7)).join(" "));
}
