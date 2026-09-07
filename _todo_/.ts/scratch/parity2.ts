/** the charge difference field: do the two sublattices carry OPPOSITE sign, or the same? */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { emit, grid, step } from "../src/lib/Vlasov2.ts";
import { derive, OCCUPANCY } from "./derived.ts";
const g: any = GEOMETRIES["fcc-12"], N = 41, C = 20, DEG = g.DEG;
const o = derive(g);
const G = grid(g, N), K = grid(g, N);
for (const a of G.n) a.fill(OCCUPANCY / 4);
for (const a of K.n) a.fill(OCCUPANCY / 4);
for (let t = 0; t < 200; t++) {
  emit(G, { at: [C,C,C], radius: 1, exits: (d) => ((g.U[d]?.[2] ?? 0) >= 0 ? 1 : -1), amount: 0.5 });
  step(G, o); step(K, o);
}
const q = (nn: any, c: number) => { const b = c * DEG; let v = 0;
  for (const s of [1, 3]) for (let d = 0; d < DEG; d++) v += nn[s][b + d]; return v; };
console.log(" r    even-parity mean      odd-parity mean     ratio");
for (const r of [2, 4, 6, 8, 10, 12]) {
  let se = 0, ne = 0, so = 0, no = 0;
  for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) for (let z = 0; z < N; z++) {
    const d = Math.hypot(x-C, y-C, z-C);
    if (Math.abs(d - r) > 0.5) continue;
    const c = (x*N+y)*N+z, v = q(G.n, c) - q(K.n, c);
    if (((x-C)+(y-C)+(z-C)) % 2 === 0) { se += v; ne++; } else { so += v; no++; }
  }
  const me = se/Math.max(1,ne), mo = so/Math.max(1,no);
  console.log(`${String(r).padStart(2)}    ${me.toExponential(3).padStart(12)}     ${mo.toExponential(3).padStart(12)}    ${(me/(mo||1)).toFixed(3)}`);
}
