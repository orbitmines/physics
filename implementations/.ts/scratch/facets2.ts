/**
 * ANISOTROPY WITHIN ONE SUBLATTICE - because the last measurement conflated two things.
 *
 * Sampling round a circle and rounding to a cell alternates PARITY as the angle sweeps, and the
 * two sublattices carry different amounts, so a min/max round the circle reports the parity
 * split as though it were faceting. Here each parity is taken separately: if the front is
 * faceted, each one is still lumpy on its own; if it was only the seam, each is smooth.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { emit, grid, step } from "../src/lib/Vlasov2.ts";
import { derive } from "./derived.ts";
const g: any = GEOMETRIES["fcc-12"], N = 41, C = 20, DEG = g.DEG;
const o = derive(g);
const G = grid(g, N);
for (const a of G.n) a.fill(0.1945 / 4);
for (let t = 0; t < 120; t++) {
  emit(G, { at: [C, C, C], radius: 1, exits: () => 1, amount: 0.5 });
  step(G, o);
}
const val = (xi: number, yi: number, zi: number) => {
  if (xi < 0 || yi < 0 || zi < 0 || xi >= N || yi >= N || zi >= N) return NaN;
  const b = ((xi * N + yi) * N + zi) * DEG;
  let v = 0;
  for (let s = 0; s < 4; s++) for (let d = 0; d < DEG; d++) v += G.n[s][b + d];
  return v;
};
console.log("      ---- both parities ----   ---- even only ----   ---- odd only ----");
console.log("r     min/max   mean            min/max   mean        min/max   mean");
for (const r of [4, 6, 8, 10, 12, 14, 16]) {
  const acc: any = { a: [], e: [], o: [] };
  for (let k = 0; k < 360; k++) {
    const th = 2 * Math.PI * k / 360;
    const xi = Math.round(C + r * Math.cos(th)), zi = Math.round(C + r * Math.sin(th));
    const v = val(xi, C, zi);
    if (!isFinite(v)) continue;
    /* only cells actually at this radius, so the ring is a ring */
    if (Math.abs(Math.hypot(xi - C, zi - C) - r) > 0.5) continue;
    acc.a.push(v);
    (((xi - C) + (zi - C)) % 2 === 0 ? acc.e : acc.o).push(v);
  }
  const rep = (xs: number[]) => xs.length
    ? `${(Math.min(...xs) / (Math.max(...xs) || 1)).toFixed(3)}  ${(xs.reduce((a, b) => a + b, 0) / xs.length).toExponential(2)}`
    : "   --        --   ";
  console.log(`${String(r).padStart(2)}    ${rep(acc.a)}       ${rep(acc.e)}     ${rep(acc.o)}`);
}
