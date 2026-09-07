/** where the BARE vacuum settles with space conserved - no source, nothing imposed */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { grid, step } from "../src/lib/Vlasov2.ts";
import { derive, OCCUPANCY } from "./derived.ts";

const g: any = GEOMETRIES["fcc-12"], N = 21;
const R = derive(g);
console.log(`rates: ${JSON.stringify(R)}`);
for (const seed of [0.02, 0.1945, 0.45]) {
  const G = grid(g, N);
  for (const a of G.n) a.fill(seed / 4);
  let last = 0;
  for (let t = 1; t <= 1200; t++) {
    step(G, R);
    if (t % 300 === 0) {
      let s = 0, c = 0;
      for (let x = 6; x < N - 6; x++) for (let y = 6; y < N - 6; y++) for (let z = 6; z < N - 6; z++) {
        const b = ((x * N + y) * N + z) * g.DEG;
        for (let k = 0; k < 4; k++) for (let d = 0; d < g.DEG; d++) { s += G.n[k][b + d]; c++; }
      }
      last = s / c * 4;   /* the four sign slots are one exit's occupancy between them */
      console.log(`  seed ${seed}  t=${t}  occupancy ${(s / c * 4).toFixed(4)}`);
    }
  }
  console.log(`  -> ${seed} settles at ${last.toFixed(4)}\n`);
}
/* what the algebra says the same rules balance at */
let x = 0.15;
for (let i = 0; i < 200; i++) x = Math.pow(1 - x, g.DEG) / (1 - 0.5 * (1 - x));
console.log(`analytic balance (with radiating): ${x.toFixed(4)}`);
let y = 0.15;
for (let i = 0; i < 200; i++) y = Math.pow(1 - y, g.DEG);
console.log(`analytic balance (no radiating):   ${y.toFixed(4)}`);
console.log(`lattice, measured:                 ${OCCUPANCY}`);
