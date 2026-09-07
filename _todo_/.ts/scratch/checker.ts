/** how much of the rendered picture is a checkerboard, and does the slab cause it */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { emit, grid, step, opposite, section, polarity } from "../src/lib/Vlasov2.ts";
import { derive, OCCUPANCY } from "./derived.ts";
const g: any = GEOMETRIES["fcc-12"], N = 31, C = 15, R = 10;
const RATES = derive(g);
const G = grid(g, N), K = grid(g, N);
for (const a of G.n) a.fill(OCCUPANCY / 4);
for (const a of K.n) a.fill(OCCUPANCY / 4);
for (let t = 0; t < 120; t++) {
  emit(G, { at: [C, C, C], radius: 1, exits: (d) => ((g.U[d]?.[2] ?? 0) >= 0 ? 1 : -1), amount: 0.5 });
  step(G, RATES); step(K, RATES);
}
let bare = 0;
{ const b0 = ((3 * N + 3) * N + 3) * g.DEG;
  for (let k = 0; k < 4; k++) for (let d = 0; d < g.DEG; d++) bare += K.n[k][b0 + d];
  bare /= 4 * g.DEG; }

const stagger = (a: Float64Array, PX: number, label: string) => {
  let se = 0, ne = 0, so = 0, no = 0;
  for (let j = 0; j < PX; j++) for (let i = 0; i < PX; i++) {
    const v = a[j * PX + i];
    if ((i + j) % 2 === 0) { se += v; ne++; } else { so += v; no++; }
  }
  const me = se / ne, mo = so / no;
  let amp = 0; for (const v of a) amp = Math.max(amp, Math.abs(v));
  console.log(`${label.padEnd(26)} even=${me.toExponential(2)} odd=${mo.toExponential(2)}` +
    `  gap=${Math.abs(me - mo).toExponential(2)}  peak=${amp.toExponential(2)}` +
    `  gap/peak=${(Math.abs(me - mo) / (amp || 1)).toFixed(3)}`);
};
for (const slab of [0, 1, 2, 3]) {
  const PX = 2 * R + 1;
  stagger(opposite(G, R, bare, slab), PX, `cloud   slab=${slab} (${2 * slab + 1} planes)`);
}
console.log("");
for (const slab of [0, 1]) {
  const PX = 2 * R + 1;
  stagger(section(G, R, slab), PX, `charge  slab=${slab}`);
  stagger(polarity(G, R, slab), PX, `polarity slab=${slab}`);
}
