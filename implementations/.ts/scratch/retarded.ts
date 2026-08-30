/**
 * HOW FAR A RADIAL NODE CAN SURVIVE - which decides whether the schedule can ever give one.
 *
 * Radius is retarded time: what stands at r on tick t was emitted at t - r, so a source whose
 * amplitude changes sign lays those sign changes down as SHELLS. That is the whole mechanism by
 * which n could show up as radial nodes, and it needs the arrival time to be SHARP.
 *
 * Ballistically it is: everything emitted at t arrives at r at t + r/c. Diffusively it is not -
 * the arrival is spread over roughly r^2/(6D), and once that spread exceeds the pulse PERIOD
 * every phase of the schedule arrives at the same place at the same time and the radial
 * structure is averaged away before it can be seen.
 *
 * So there is a radius beyond which no node can survive, and it is where spread = period.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
const LAM = 1.5;                       // ray mean free path, measured
const C_ = 1;                          // one cell per tick
const D = LAM * C_ / 3;                // diffusion constant of a random walk with this step

console.log(`lambda = ${LAM} cells,  D = ${D.toFixed(3)} cells^2/tick\n`);
console.log("state   period   r where spread = period   nodes wanted   verdict");
for (const [n, l] of [[1,0],[2,0],[2,1],[3,0],[3,2],[4,0],[4,3]] as [number,number][]) {
  const a0 = 22/(n*n), P = Math.max(1, Math.ceil(4*n*n*a0));
  /* spread(r) = r^2 / (6 D); solve spread = P */
  const rMax = Math.sqrt(6 * D * P);
  const nodes = n - l - 1;
  /* where the nodes actually sit, in cells: the zeros of R_nl are at rho of order n */
  const rNode = n * a0 / 2;
  console.log(`${n}${l}      ${String(P).padStart(4)}     ${rMax.toFixed(1).padStart(18)}` +
    `   ${String(nodes).padStart(11)}   ` +
    `${nodes === 0 ? "-" : rNode < rMax ? `first node at ~${rNode.toFixed(0)} cells: SURVIVES`
      : `first node at ~${rNode.toFixed(0)} cells: SMEARED`}`);
}
console.log("\nand the ballistic fraction - what is left un-scattered at r, exp(-r/lambda):");
console.log("  " + [1,2,3,5,8,12].map(r =>
  `r=${r}: ${(Math.exp(-r/LAM)*100).toFixed(2)}%`).join("  "));
