/**
 * HOW HARD A CORNER MAY SHINE BEFORE THE VACUUM STOPS BEING ONE.
 *
 * `carries: "polarity"` banks space - which is mass - and `carries: "charge"` banks none, so
 * mass is made by turning exactly when what the turn makes is POLARITY. But at shine = 0.8055
 * the polarity variant fills every exit (rho 0.9956), so its mass rate is a rate in a full
 * vacuum and means nothing. This finds where the vacuum survives, and reads the mass off there.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { emit, grid, step } from "../src/lib/Vlasov2.ts";
import { derive } from "./derived.ts";

const g: any = GEOMETRIES["fcc-12"], N = 17, C = 8, DEG = g.DEG;
const P_OF = [1, 1, -1, -1];
const TICKS = 500, VACUUM = 0.1945;

const rmsP = (G: any) => {
  let s2 = 0, cnt = 0;
  for (let x = 3; x < N - 3; x++) for (let y = 3; y < N - 3; y++) for (let z = 3; z < N - 3; z++) {
    const b = ((x * N + y) * N + z) * DEG;
    if (Math.hypot(x - C, y - C, z - C) < 2.5) continue;
    let v = 0;
    for (let s = 0; s < 4; s++) for (let d = 0; d < DEG; d++) v += P_OF[s] * G.n[s][b + d];
    s2 += v * v; cnt++;
  }
  return Math.sqrt(s2 / Math.max(1, cnt));
};

console.log(`vacuum without a corner rule is ${VACUUM}; a shine that holds near it is one the`);
console.log(`model can have. space/tick is the mass banked.\n`);
console.log("carries    shine    rho      rho/vacuum   net |P|      space/tick");
for (const carries of ["polarity", "charge"] as const) {
  for (const shine of [0.8055, 0.4, 0.2, 0.1, 0.05, 0.02, 0.01]) {
    const rates = { ...derive(g), shine, carries };
    const G = grid(g, N);
    for (const a of G.n) a.fill(VACUUM / 4);
    let sp0 = 0;
    for (let t = 1; t <= TICKS; t++) {
      emit(G, { at: [C, C, C], radius: 1, exits: (d) => ((g.U[d]?.[2] ?? 0) >= 0 ? 1 : -1), amount: 0.5 });
      step(G, rates as any);
      if (t === TICKS / 2) sp0 = G.space.reduce((a: number, b: number) => a + b, 0);
    }
    let s = 0, c = 0;
    for (let x = 3; x < N - 3; x++) for (let y = 3; y < N - 3; y++) for (let z = 3; z < N - 3; z++) {
      const b = ((x * N + y) * N + z) * DEG;
      for (let k = 0; k < 4; k++) for (let d = 0; d < DEG; d++) { s += G.n[k][b + d]; c++; }
    }
    const rho = s / c * 4;
    const sp1 = G.space.reduce((a: number, b: number) => a + b, 0);
    console.log(`${carries.padEnd(9)}  ${String(shine).padEnd(7)} ${rho.toFixed(4)}   ` +
      `${(rho / VACUUM).toFixed(2).padStart(8)}     ${rmsP(G).toExponential(2)}   ` +
      `${((sp1 - sp0) / (TICKS / 2)).toFixed(3).padStart(10)}`);
  }
  console.log("");
}
