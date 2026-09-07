/**
 * DOES THE RESTRUCTURED STEP AGREE WITH THE ONE IT REPLACES, and by how much.
 *
 * The staged form adds the same contributions in a different ORDER, so the last digits are
 * allowed to move and nothing else is. This measures the gap rather than asserting it away.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { emit, grid, step } from "../src/lib/Vlasov2.ts";
import { allocate, reverse, stepStaged } from "../src/lib/Vlasov3.ts";
import { derive } from "./derived.ts";

const g: any = GEOMETRIES["fcc-12"];
for (const [N, shine, carries] of [[17, 0, "inherit"], [17, 0.02, "polarity"], [17, 0.02, "charge"]] as any) {
  const o = { ...derive(g), shine, carries };
  const C = (N - 1) >> 1;
  const src = (G: any) => emit(G, { at: [C, C, C], radius: 1,
    exits: (d: number) => ((g.U[d]?.[2] ?? 0) >= 0 ? 1 : -1), amount: 0.5 });

  const A = grid(g, N);
  for (const a of A.n) a.fill(0.1945 / 4);

  const B = grid(g, N);
  for (const a of B.n) a.fill(0.1945 / 4);
  const S_ = allocate(B); const rev = reverse(B);
  (B as any).n = S_.n; (B as any).space = S_.space;

  const T = 40;
  for (let t = 0; t < T; t++) { src(A); step(A, o); }
  for (let t = 0; t < T; t++) { src(B); stepStaged(B, S_, rev, o); }

  let worst = 0, sa = 0, sb = 0, l2 = 0, l2n = 0;
  for (let s = 0; s < 4; s++) for (let i = 0; i < A.n[s].length; i++) {
    const x = A.n[s][i], y = S_.n[s][i];
    sa += x; sb += y;
    const d = Math.abs(x - y); l2 += d * d; l2n += x * x;
    const rel = d / (Math.abs(x) || 1e-300);
    if (rel > worst && Math.abs(x) > 1e-12) worst = rel;
  }
  console.log(`N=${N} shine=${shine} ${String(carries).padEnd(8)}  ` +
    `sum ${sa.toExponential(12)} vs ${sb.toExponential(12)}  ` +
    `rel-L2 ${(Math.sqrt(l2 / (l2n || 1))).toExponential(2)}  worst-rel ${worst.toExponential(2)}`);
}
