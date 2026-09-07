/** does the pool agree with the serial step, and how much faster is it */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { emit, grid, step } from "../src/lib/Vlasov2.ts";
import { pool } from "../src/lib/Vlasov3.ts";
import { derive } from "./derived.ts";

const g: any = GEOMETRIES["fcc-12"];
const N = Number(process.argv[2] ?? 41), W = Number(process.argv[3] ?? 10);
const T = Number(process.argv[4] ?? 12);
const o = { ...derive(g), shine: 0.02, carries: "polarity" as const };
const C = (N - 1) >> 1;
const src = (G: any) => emit(G, { at: [C, C, C], radius: 1,
  exits: (d: number) => ((g.U[d]?.[2] ?? 0) >= 0 ? 1 : -1), amount: 0.5 });

const A = grid(g, N);
for (const a of A.n) a.fill(0.1945 / 4);
src(A); step(A, o);
const t0 = Date.now();
for (let t = 0; t < T; t++) { src(A); step(A, o); }
const serial = (Date.now() - t0) / T;

const B = grid(g, N);
for (const a of B.n) a.fill(0.1945 / 4);
const P = await pool(B, o, "fcc-12", false, W);
(B as any).n = P.S.n; (B as any).space = P.S.space;
src(B); P.step();
const t1 = Date.now();
for (let t = 0; t < T; t++) { src(B); P.step(); }
const par = (Date.now() - t1) / T;

let l2 = 0, l2n = 0, worst = 0;
for (let s = 0; s < 4; s++) for (let i = 0; i < A.n[s].length; i++) {
  const x = A.n[s][i], y = P.S.n[s][i];
  const d = Math.abs(x - y); l2 += d * d; l2n += x * x;
  const rel = d / (Math.abs(x) || 1e-300);
  if (rel > worst && Math.abs(x) > 1e-12) worst = rel;
}
console.log(`N=${N} workers=${W} ticks=${T}`);
console.log(`  serial   ${serial.toFixed(0)} ms/step`);
console.log(`  parallel ${par.toFixed(0)} ms/step   speedup ${(serial / par).toFixed(2)}x`);
console.log(`  agreement rel-L2 ${Math.sqrt(l2 / (l2n || 1)).toExponential(2)}  worst ${worst.toExponential(2)}`);
await P.close();
