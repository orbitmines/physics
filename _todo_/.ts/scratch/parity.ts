/** is the checkerboard the fcc sublattice? split the density by the parity of x+y+z */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { emit, grid, step } from "../src/lib/Vlasov2.ts";
import { derive } from "./derived.ts";
const g: any = GEOMETRIES["fcc-12"], N = 31, C = 15;
const R = derive(g);
console.log("fcc-12 exits (L):", (g.L ?? g.U).slice(0, 4).map((v: any) => `(${v})`).join(" "));
const G = grid(g, N);
for (const a of G.n) a.fill(0);                    // empty, so only what the source makes shows
for (let t = 0; t < 60; t++) {
  emit(G, { at: [C, C, C], radius: 1, exits: (d) => ((g.U[d]?.[2] ?? 0) >= 0 ? 1 : -1), amount: 0.5 });
  step(G, R);
}
let even = 0, odd = 0, ne = 0, no = 0;
for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) for (let z = 0; z < N; z++) {
  const b = ((x * N + y) * N + z) * g.DEG;
  let v = 0;
  for (let s = 0; s < 4; s++) for (let d = 0; d < g.DEG; d++) v += G.n[s][b + d];
  /* parity relative to the source cell */
  if (((x - C) + (y - C) + (z - C)) % 2 === 0) { even += v; ne++; } else { odd += v; no++; }
}
console.log(`same parity as the source : ${(even / ne).toExponential(3)} per cell  (${ne} cells)`);
console.log(`opposite parity           : ${(odd / no).toExponential(3)} per cell  (${no} cells)`);
console.log(`ratio                     : ${(even / ne) / ((odd / no) || 1e-300)}`);
