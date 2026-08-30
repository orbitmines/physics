/**
 * THE CORNER PERMUTATION, MEASURED.
 *
 * `G^XOR^q` counts eighty-four ways a corner could decide what it throws off. Three of them
 * are separable and are what this compares, against `G^XOR+XOR` which has no corner rule at
 * all and so shines nothing:
 *
 *   inherit    the recoil keeps both signs of what turned
 *   polarity   it keeps the POLARITY and splits over charge - a turn makes MASS and no net
 *              charge. Opposite polarities annihilate when they meet, so most of it cancels
 *              and what is left over is the residue
 *   charge     the complement, kept so the two can be told apart by measurement
 *
 * What is read off each: the polarity that survives the cancelling (the mass), the charge
 * that survives, and the rate space is banked at - which is the DEFICIT, and is the other
 * reading of the same mass.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { emit, grid, step, AUDIT, resetAudit } from "../src/lib/Vlasov2.ts";
import { derive, shineOf } from "./derived.ts";

const g: any = GEOMETRIES["fcc-12"], N = 21, C = 10, DEG = g.DEG;
const P_OF = [1, 1, -1, -1], Q_OF = [1, -1, 1, -1];
const TICKS = Number(process.argv[2] ?? 600);

const rms = (G: any, of: number[]) => {
  let s2 = 0, cnt = 0;
  for (let x = 3; x < N - 3; x++) for (let y = 3; y < N - 3; y++) for (let z = 3; z < N - 3; z++) {
    const cell = (x * N + y) * N + z, b = cell * DEG;
    if (Math.hypot(x - C, y - C, z - C) < 2.5) continue;          // the source's own cells
    let v = 0;
    for (let s = 0; s < 4; s++) for (let d = 0; d < DEG; d++) v += of[s] * G.n[s][b + d];
    s2 += v * v; cnt++;
  }
  return Math.sqrt(s2 / Math.max(1, cnt));
};

console.log("theory                 rho      net |P| (mass)   net |Q|      space/tick   radiated");
for (const [name, rates] of [
  ["G^XOR+XOR (no corner)", { ...derive(g) }],
  ["G^XOR^o  inherit",      { ...derive(g), shine: shineOf(), carries: "inherit"  as const }],
  ["G^XOR^o  polarity",     { ...derive(g), shine: shineOf(), carries: "polarity" as const }],
  ["G^XOR^o  charge",       { ...derive(g), shine: shineOf(), carries: "charge"   as const }],
] as const) {
  const G = grid(g, N);
  for (const a of G.n) a.fill(0.1945 / 4);
  let sp0 = 0, litTot = 0;
  for (let t = 1; t <= TICKS; t++) {
    resetAudit();
    emit(G, { at: [C, C, C], radius: 1, exits: (d) => ((g.U[d]?.[2] ?? 0) >= 0 ? 1 : -1), amount: 0.5 });
    step(G, rates as any);
    litTot += AUDIT.lit;
    if (t === Math.floor(TICKS / 2)) { sp0 = G.space.reduce((a: number, b: number) => a + b, 0); }
  }
  let s = 0, c = 0;
  for (let x = 3; x < N - 3; x++) for (let y = 3; y < N - 3; y++) for (let z = 3; z < N - 3; z++) {
    const b = ((x * N + y) * N + z) * DEG;
    for (let k = 0; k < 4; k++) for (let d = 0; d < DEG; d++) { s += G.n[k][b + d]; c++; }
  }
  const sp1 = G.space.reduce((a: number, b: number) => a + b, 0);
  console.log(
    `${name.padEnd(22)} ${(s / c * 4).toFixed(4)}   ${rms(G, P_OF).toExponential(3)}` +
    `      ${rms(G, Q_OF).toExponential(3)}   ${((sp1 - sp0) / (TICKS / 2)).toFixed(2).padStart(9)}` +
    `   ${(litTot / TICKS).toExponential(2)}`);
}
