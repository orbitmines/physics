/** does RADIATING fire on the lattice at all - `corners` is the count of turns it was handed */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_O } from "../src/theories/G^XOR^o.ts";
import { G_XOR_XOR } from "../src/theories/G^XOR+XOR.ts";
const g: any = GEOMETRIES["fcc-12"];
for (const [name, theory] of [["G^XOR+XOR", G_XOR_XOR], ["G^XOR^o", G_XOR_O]] as const) {
  const w: any = new World({ theory, geometry: g, N: 13, seed: 1,
    boundary: "absorb", slotUniformRng: true } as any);
  /* ARM THE LOG. `steer` records a turn only where something is listening and `turnLog`
   * defaults to null, so a world that does not set it runs the vacuum and RADIATING is handed
   * an empty log every tick - which is how G^XOR^o came out bit-identical to G^XOR+XOR. */
  (w.world ?? w).turnLog = [];
  for (let t = 0; t < 30; t++) w.tick();
  const log = w.turnLog;
  console.log(`${name.padEnd(12)} corners=${w.corners ?? "undef"}  radiated=${w.radiated ?? "undef"}` +
    `  saturated=${w.saturated ?? "undef"}  qMade=${w.qMade ?? "undef"}` +
    `  turnLog=${log ? log.length : "undef"}  rules=${(theory as any).rules?.length ?? "?"}`);
}
