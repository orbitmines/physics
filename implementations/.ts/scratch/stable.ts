/** does the field settle now, or still grow? - the check the runaway needed */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { emit, grid, polarity, step } from "../src/lib/Vlasov2.ts";
import { derive, OCCUPANCY } from "./derived.ts";
const g: any = GEOMETRIES["fcc-12"], N = 31, C = 15, R = 12;
const R8 = derive(g);
const G = grid(g, N);
for (const a of G.n) a.fill(OCCUPANCY / 4);
console.log("tick    max |polarity|   max |density|   (a settled field stops growing)");
for (let t = 1; t <= 1200; t++) {
  emit(G, { at: [C,C,C], radius: 1,
    exits: (d) => { const u = g.U[d], mg = Math.hypot(u[0],u[1],u[2]??0)||1;
      return ((u[2]??0)/mg) > 1e-9 ? 1 : ((u[2]??0)/mg) < -1e-9 ? -1 : 0; },
    amount: 0.5 });
  step(G, R8);
  if (t % 200) continue;
  const p = polarity(G, R);
  let hp = 0; for (const v of p) hp = Math.max(hp, Math.abs(v));
  let hn = 0;
  for (let k = 0; k < 4; k++) for (let i = 0; i < G.n[k].length; i++)
    hn = Math.max(hn, G.n[k][i]);
  console.log(String(t).padStart(4), hp.toExponential(3).padStart(15),
    hn.toExponential(3).padStart(15));
}
