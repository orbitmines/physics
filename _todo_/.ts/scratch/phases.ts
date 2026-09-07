/** where the work is, phase by phase - a phase that is all memory will not scale */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { emit, grid } from "../src/lib/Vlasov2.ts";
import { allocate, reverse, phase, PHASES } from "../src/lib/Vlasov3.ts";
import { derive } from "./derived.ts";
const g: any = GEOMETRIES["fcc-12"], N = 41, C = 20;
for (const shine of [0, 0.02]) {
  const o = { ...derive(g), shine, carries: "polarity" as const };
  const G = grid(g, N);
  for (const a of G.n) a.fill(0.1945 / 4);
  const S_ = allocate(G); const rev = reverse(G);
  (G as any).n = S_.n; (G as any).space = S_.space;
  const ms = new Float64Array(PHASES);
  const K = 6;
  for (let t = 0; t < K + 1; t++) {
    emit(G, { at: [C,C,C], radius: 1, exits: (d: number) => ((g.U[d]?.[2] ?? 0) >= 0 ? 1 : -1), amount: 0.5 });
    for (let p = 0; p < PHASES; p++) {
      const t0 = Date.now();
      phase(p, S_, G, rev, o, 0, G.cells, 0);
      if (t > 0) ms[p] += Date.now() - t0;
    }
  }
  const names = ["A presums+zero", "B local", "C gather", "D stir+shine", "E gather rad", "F commit"];
  const tot = ms.reduce((a, b) => a + b, 0) / K;
  console.log(`shine=${shine}  total ${tot.toFixed(0)} ms/step`);
  for (let p = 0; p < PHASES; p++)
    console.log(`   ${names[p].padEnd(15)} ${(ms[p]/K).toFixed(1).padStart(7)} ms  ${(100*ms[p]/K/tot).toFixed(0).padStart(3)}%`);
}
