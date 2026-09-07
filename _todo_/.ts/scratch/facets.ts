/**
 * IS THE WAVEFRONT ROUND? - the squares-within-squares, measured instead of squinted at.
 *
 * A point source in an isotropic medium makes a sphere. fcc-12 streams along twelve <110>
 * directions and `stir` only scatters to RING neighbours, which is a small angle, so the front
 * may stay faceted for a long way. This takes the amplitude round a circle at several radii: a
 * round front is flat in angle, a square one peaks four times.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { emit, grid, step } from "../src/lib/Vlasov2.ts";
import { derive } from "./derived.ts";
const g: any = GEOMETRIES["fcc-12"], N = 41, C = 20, DEG = g.DEG;
const o = derive(g);
const G = grid(g, N);
for (const a of G.n) a.fill(0.1945 / 4);
/* one steady isotropic pulse, so anything angular is the lattice and not the source */
for (let t = 0; t < 120; t++) {
  emit(G, { at: [C, C, C], radius: 1, exits: () => 1, amount: 0.5 });
  step(G, o);
}
const at = (x: number, y: number, z: number) => {
  const xi = Math.round(x), yi = Math.round(y), zi = Math.round(z);
  if (xi < 0 || yi < 0 || zi < 0 || xi >= N || yi >= N || zi >= N) return 0;
  const b = ((xi * N + yi) * N + zi) * DEG;
  let v = 0;
  for (let s = 0; s < 4; s++) for (let d = 0; d < DEG; d++) v += G.n[s][b + d];
  return v;
};
console.log("r    min/max round the circle    at 0deg   at 45deg   ratio(45/0)");
for (const r of [3, 5, 8, 11, 14, 17]) {
  let lo = Infinity, hi = -Infinity;
  for (let k = 0; k < 180; k++) {
    const a = 2 * Math.PI * k / 180;
    const v = at(C + r * Math.cos(a), C, C + r * Math.sin(a));
    lo = Math.min(lo, v); hi = Math.max(hi, v);
  }
  const ax = at(C + r, C, C);
  const di = at(C + r / Math.SQRT2, C, C + r / Math.SQRT2);
  console.log(`${String(r).padStart(2)}   ${(lo / (hi || 1)).toFixed(3)}` +
    `                     ${ax.toExponential(2)}  ${di.toExponential(2)}   ${(di / (ax || 1)).toFixed(3)}`);
}
