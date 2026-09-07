/** the same balance WITH a source, and whether the seed still matters once the rescale is gone */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { emit, grid, step, AUDIT, resetAudit } from "../src/lib/Vlasov2.ts";
import { derive, OCCUPANCY } from "./derived.ts";
const g: any = GEOMETRIES["fcc-12"], N = 21, C = 10;
const R = derive(g);

console.log("== seed independence, bare, no rescale");
for (const seed of [0.02, 0.1945, 0.45]) {
  const G = grid(g, N);
  for (const a of G.n) a.fill(seed / 4);
  for (let t = 0; t < 600; t++) step(G, R);
  let s = 0, c = 0;
  for (let x = 6; x < N - 6; x++) for (let y = 6; y < N - 6; y++) for (let z = 6; z < N - 6; z++) {
    const b = ((x * N + y) * N + z) * g.DEG;
    for (let k = 0; k < 4; k++) for (let d = 0; d < g.DEG; d++) { s += G.n[k][b + d]; c++; }
  }
  console.log(`  seed ${String(seed).padEnd(7)} -> ${(s / c * 4).toFixed(4)}`);
}

console.log("\n== with a steady source");
const G = grid(g, N);
for (const a of G.n) a.fill(OCCUPANCY / 4);
console.log("tick   rho     mean space   max space   tp/kp     same/opp   mean room");
for (let t = 1; t <= 800; t++) {
  resetAudit();
  emit(G, { at: [C, C, C], radius: 1, exits: (d) => ((g.U[d]?.[2] ?? 0) >= 0 ? 1 : -1), amount: 0.5 });
  step(G, R);
  if (t % 100 === 0) {
    let s = 0, c = 0, sp = 0, mx = 0;
    for (let x = 5; x < N - 5; x++) for (let y = 5; y < N - 5; y++) for (let z = 5; z < N - 5; z++) {
      const cell = (x * N + y) * N + z, b = cell * g.DEG;
      sp += G.space[cell]; mx = Math.max(mx, G.space[cell]);
      for (let k = 0; k < 4; k++) for (let d = 0; d < g.DEG; d++) { s += G.n[k][b + d]; c++; }
    }
    const nc = (N - 10) ** 3;
    console.log(`${String(t).padStart(4)}  ${(s / c * 4).toFixed(4)}  ${(sp / nc).toFixed(4).padStart(10)}` +
      `  ${mx.toFixed(2).padStart(9)}  ${(AUDIT.tp / (AUDIT.kp || 1)).toFixed(4)}` +
      `  ${(AUDIT.same / (AUDIT.opp || 1)).toFixed(4).padStart(9)}` +
      `  ${(AUDIT.room / (AUDIT.cells || 1)).toFixed(4)}`);
  }
}
