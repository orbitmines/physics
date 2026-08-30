/**
 * CAN ANYTHING GET AN ORBIT ROUND? - lambda against CYCLE, swept over rules and lattices.
 *
 * An orbit closes when a carrier survives CYCLE ring steps: `laps = floor(turned / CYCLE)`
 * in `G^XOR^o`, and `G^XOR+XOR` records that a lap has never completed. The quantity that
 * decides it is `turned / CYCLE` at death - below 1 nothing closes, and how far below says
 * how much would have to change.
 *
 * WHAT IS VARIED. The theory (which sets what a meeting does, and so the occupancy), the
 * lattice (which sets CYCLE - and a SMALLER ring is an easier orbit, so the lattices with
 * CYCLE = 4 are the favourable ones), and the steering (`lorentz` rectifies an incoherent
 * field, `coherent` banks it as a vector so noise cancels - the two differ exactly on
 * whether vacuum fluctuations can turn anything).
 *
 * The carrier is marked with the CARRIED `from` field and followed, and presence is the
 * mark rather than `active`, which alternates with `arriving` while a ray is in transit.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_XOR, withSteering } from "../src/theories/G^XOR+XOR.ts";
import { G_XOR_C } from "../src/theories/G^XOR^c.ts";
import { G_XOR_O } from "../src/theories/G^XOR^o.ts";

const MARK = 999;

const flight = (o: { theory: any; geom: string; N: number; warm: number; T: number;
  seed: number; phase: number; how: any }) => {
  const g: any = (GEOMETRIES as any)[o.geom];
  if (!g.CYCLE) return null;
  const C = (o.N - 1) / 2;
  const w: any = new World({ theory: withSteering(o.theory, o.how), geometry: g,
    N: o.N, seed: o.seed, boundary: "absorb", slotUniformRng: true } as any);
  w.world.turnLog = [];
  for (let t = 0; t < o.warm + o.phase; t++) w.tick();
  let seat: any;
  for (const l of w.locals) { const at = w.embedding.at(l as any);
    if (at && at.every((x: number, i: number) => x === C)) { seat = l; break; } }
  if (!seat) return null;
  const d = 0;
  const r: any = seat.rays[d];
  if (!r) return null;
  r.active = true; r.polarity = 1; r.charge = 1; r.from = MARK;
  r.gyrophase = 0; r.turned = 0;

  let alive = 0, turned = 0;
  for (let t = 0; t < o.T; t++) {
    w.tick();
    let found = false;
    for (const l of w.locals) {
      for (const ry of (l as any).rays) {
        if (ry.from !== MARK) continue;
        turned = Math.max(turned, ry.turned ?? 0); found = true; break;
      }
      if (found) break;
    }
    if (!found) break;
    alive++;
  }
  return { alive, turned, CYCLE: g.CYCLE };
};

const THEORIES: [string, any][] = [
  ["G^XOR+XOR", G_XOR_XOR], ["G^XOR^c", G_XOR_C], ["G^XOR^o", G_XOR_O],
];
const LATTICES = ["cubic-6", "icosahedral-12", "square-4", "fcc-12", "triangular-6", "cubic-18"];

console.log("theory      lattice          CYCLE  steering   mean_alive  mean_turned  turned/CYCLE  best_lap");
for (const [tn, th] of THEORIES)
  for (const geom of LATTICES)
    for (const how of ["lorentz", "coherent"] as const) {
      const rs: any[] = [];
      for (let seed = 1; seed <= 3; seed++)
        for (let phase = 0; phase < 2; phase++) {
          const r = flight({ theory: th, geom, N: 13, warm: 8, T: 40, seed, phase, how });
          if (r) rs.push(r);
        }
      if (!rs.length) continue;
      const m = (f: (r: any) => number) => rs.reduce((a, r) => a + f(r), 0) / rs.length;
      const cyc = rs[0].CYCLE;
      const ratio = m(r => r.turned) / cyc;
      console.log(tn.padEnd(11), geom.padEnd(16), String(cyc).padStart(5), how.padEnd(11),
        m(r => r.alive).toFixed(2).padStart(10), m(r => r.turned).toFixed(2).padStart(12),
        ratio.toFixed(3).padStart(13),
        (Math.max(...rs.map(r => r.turned)) / cyc).toFixed(2).padStart(9),
        ratio >= 1 ? "  <-- CLOSES" : "");
    }
