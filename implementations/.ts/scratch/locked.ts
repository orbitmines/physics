/**
 * DOES A CARRIER THAT IS TURNING HOLD ITS PHASE, WHERE A STRAIGHT ONE CANNOT?
 *
 * The straight-ray baseline (`scratch/phase.ts`) is 1-2 cells with a strict parity in the
 * launch tick - the vacuum's two-tick beat - and no launch phase gets a straight carrier
 * out. That is the RIGHT answer for a straight ray: it has no way to re-align, so it
 * samples the beat at whatever parity the geometry hands it and dies.
 *
 * A CHARGED ray under `G^XOR+XOR` is steered by the local B, so an ALIKE meeting turns it
 * rather than killing it, and turning is what brings it back round. This asks whether that
 * changes the lifetime at all. Nothing is imposed and CREATION is left on: this is the real
 * vacuum, and the carrier is followed by the CARRIED `from` mark rather than guessed at.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_XOR, withSteering } from "../src/theories/G^XOR+XOR.ts";

const MARK = 999;

const flight = (o: { geom: string; N: number; warm: number; T: number;
  charge: number | undefined; polarity: number; phase: number; how: any; seed: number }) => {
  const g: any = (GEOMETRIES as any)[o.geom];
  const C = (o.N - 1) / 2;
  const w: any = new World({ theory: withSteering(G_XOR_XOR, o.how), geometry: g,
    N: o.N, seed: o.seed, boundary: "absorb", slotUniformRng: true } as any);
  for (let t = 0; t < o.warm + o.phase; t++) w.tick();

  let seat: any;
  for (const l of w.locals) { const at = w.embedding.at(l as any);
    if (at && at[0] === C && at[1] === C && at[2] === C) { seat = l; break; } }
  const d = g.exits.findIndex((v: number[]) => v[0] === 1 && v[1] === 0 && v[2] === 0);
  const r: any = seat.rays[d];
  r.active = true; r.polarity = o.polarity; r.charge = o.charge;
  r.from = MARK; r.gyrophase = 0; r.turned = 0;

  let far = 0, alive = 0, turned = 0;
  for (let t = 0; t < o.T; t++) {
    w.tick();
    let found = false;
    for (const l of w.locals) {
      for (const ry of (l as any).rays) {
        if (ry.from !== MARK) continue;                 // presence is the MARK, not `active`
        const at = w.embedding.at(l as any);
        if (at) far = Math.max(far, Math.hypot(at[0]-C, at[1]-C, at[2]-C));
        turned = ry.turned ?? turned;
        found = true; break;
      }
      if (found) break;
    }
    if (!found) break;
    alive++;
  }
  return { far, alive, turned };
};

const N = 21, warm = 10, T = 60, geom = "cubic-6";
const mean = (a: number[]) => a.reduce((x,y)=>x+y,0)/a.length;
console.log(`G^XOR+XOR  ${geom}  N=${N} warm=${warm} T=${T}  (2 seeds x 4 phases)`);
console.log("carrier                       mean_alive  mean_far  mean_turned  max_alive");
for (const [name, charge, how] of [
  ["uncharged (straight)", undefined, "lorentz"],
  ["charged q=+1 lorentz",  1,        "lorentz"],
  ["charged q=-1 lorentz", -1,        "lorentz"],
  ["charged q=+1 coherent", 1,        "coherent"],
  ["charged q=+1 no steer", 1,        "none"],
] as any[]) {
  const runs: any[] = [];
  for (let seed = 1; seed <= 2; seed++)
    for (let phase = 0; phase < 4; phase++)
      runs.push(flight({ geom, N, warm, T, charge, polarity: 1, phase, how, seed }));
  console.log(name.padEnd(28),
    mean(runs.map(r=>r.alive)).toFixed(2).padStart(10),
    mean(runs.map(r=>r.far)).toFixed(2).padStart(9),
    mean(runs.map(r=>r.turned)).toFixed(2).padStart(12),
    String(Math.max(...runs.map(r=>r.alive))).padStart(10));
}
