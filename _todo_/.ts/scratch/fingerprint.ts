/**
 * THE SOLVER'S FINGERPRINT - so "faster" can be checked against "the same".
 *
 * Every optimisation below is meant to change the SCHEDULE of the arithmetic and not the
 * arithmetic, so the state after N ticks must come out bit-identical. Floating point is not
 * associative, so this is a real constraint and not a formality: reordering a sum is exactly
 * the kind of change that looks harmless and quietly moves the last digits.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { emit, grid, step } from "../src/lib/Vlasov2.ts";
import { derive } from "./derived.ts";

const g: any = GEOMETRIES["fcc-12"];
const bits = (x: number) => { const b = new DataView(new ArrayBuffer(8)); b.setFloat64(0, x); 
  return b.getUint32(0).toString(16).padStart(8, "0") + b.getUint32(4).toString(16).padStart(8, "0"); };

for (const [N, shine, carries, wrap] of [
  [17, 0, "inherit", false], [17, 0.02, "polarity", false],
  [17, 0.02, "charge", false], [21, 0, "inherit", true],
] as any) {
  const R = { ...derive(g), shine, carries };
  const G = grid(g, N, wrap);
  for (const a of G.n) a.fill(0.1945 / 4);
  const C = (N - 1) >> 1;
  for (let t = 0; t < 40; t++) {
    emit(G, { at: [C, C, C], radius: 1, exits: (d) => ((g.U[d]?.[2] ?? 0) >= 0 ? 1 : -1), amount: 0.5 });
    step(G, R);
  }
  /* a checksum that is order-independent to sum but sensitive to every value: sum, sum of
   * squares, and the extremes, all printed as raw bits so nothing is hidden by formatting */
  let s = 0, s2 = 0, lo = Infinity, hi = -Infinity;
  for (const a of G.n) for (const v of a) { s += v; s2 += v * v; if (v < lo) lo = v; if (v > hi) hi = v; }
  let sp = 0; for (const v of G.space) sp += v;
  console.log(`N=${N} shine=${shine} ${String(carries).padEnd(8)} wrap=${wrap ? 1 : 0}  ` +
    `sum=${bits(s)} sq=${bits(s2)} lo=${bits(lo)} hi=${bits(hi)} space=${bits(sp)}`);
}
