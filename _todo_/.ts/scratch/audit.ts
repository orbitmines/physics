/** which side of the space balance is heavier, measured rather than argued */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { grid, step, AUDIT, resetAudit } from "../src/lib/Vlasov2.ts";
import { derive, OCCUPANCY } from "./derived.ts";
const g: any = GEOMETRIES["fcc-12"], N = 17;
const R = derive(g);
const G = grid(g, N);
for (const a of G.n) a.fill(OCCUPANCY / 4);
console.log("tick   rho     mean space   turns tp    kills kp    radiated   tp-kp-lit    same/opp");
for (let t = 1; t <= 400; t++) {
  resetAudit();
  step(G, R);
  if (t % 50 === 0) {
    let s = 0, c = 0, sp = 0;
    for (let x = 4; x < N - 4; x++) for (let y = 4; y < N - 4; y++) for (let z = 4; z < N - 4; z++) {
      const cell = (x * N + y) * N + z, b = cell * g.DEG;
      sp += G.space[cell];
      for (let k = 0; k < 4; k++) for (let d = 0; d < g.DEG; d++) { s += G.n[k][b + d]; c++; }
    }
    const nc = (N - 8) ** 3;
    console.log(
      `${String(t).padStart(4)}  ${(s / c * 4).toFixed(4)}  ${(sp / nc).toFixed(4).padStart(10)}` +
      `  ${AUDIT.tp.toExponential(2).padStart(9)}  ${AUDIT.kp.toExponential(2).padStart(9)}` +
      `  ${AUDIT.lit.toExponential(2).padStart(9)}  ${(AUDIT.tp - AUDIT.kp - AUDIT.lit).toExponential(2).padStart(10)}` +
      `  ${(AUDIT.same / (AUDIT.opp || 1)).toFixed(4)}`);
  }
}
