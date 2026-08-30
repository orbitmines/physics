/**
 * THE EIGHTY-FOUR CREATION RULES, ASKED WHETHER ANY OF THEM LETS AN ORBIT CLOSE.
 *
 * `G^XOR^q` enumerates every way a sideways meeting could decide what it throws off - four
 * READS by three MAKES by seven EMITS - and `withCreation` puts one on a theory. Most of
 * them were enumerated to ask what makes CHARGE; this asks a different question of the same
 * space: what each does to the vacuum's density, and so to how far a carrier gets.
 *
 * `anti` is the one to watch, and `G^XOR^q` says why before anything is run: it is "the
 * only setting here that can bound a field without anything counting", because a corner
 * that CANCELS the thing that bent it is a negative feedback. If any rule thins the vacuum
 * enough for a lap, that is the shape of the one that would.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_O } from "../src/theories/G^XOR^o.ts";
import { CREATIONS, CURRENT, ANTI, nameOf, withCreation } from "../src/theories/G^XOR^q.ts";

const MARK = 999;

const flight = (theory: any, geom: string, seed: number, phase: number) => {
  const g: any = (GEOMETRIES as any)[geom];
  const N = 11, C = (N - 1) / 2;
  const w: any = new World({ theory, geometry: g, N, seed,
    boundary: "absorb", slotUniformRng: true } as any);
  w.world.turnLog = [];
  for (let t = 0; t < 8 + phase; t++) w.tick();
  let seat: any;
  for (const l of w.locals) { const at = w.embedding.at(l as any);
    if (at && at.every((x: number) => x === C)) { seat = l; break; } }
  if (!seat?.rays?.[0]) return null;
  const r: any = seat.rays[0];
  r.active = true; r.polarity = 1; r.charge = 1; r.from = MARK;
  r.gyrophase = 0; r.turned = 0;
  let alive = 0, turned = 0;
  for (let t = 0; t < 30; t++) {
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
  return { alive, turned, CYCLE: g.CYCLE, occupancy: w.world.radiated ?? 0 };
};

/* the whole space is 84; the ones that can act at a corner at all are the candidates,
 * plus the two named rules, so the sweep is quotable rather than exhaustive-and-slow */
const PICK = [CURRENT, ANTI, ...CREATIONS.filter(c =>
  c.emits === "anti" || c.emits === "anti-product" || c.emits === "field")];
const seen = new Set<string>();
const RULES = PICK.filter(c => { const k = nameOf(c); if (seen.has(k)) return false;
  seen.add(k); return true; });

console.log(`G^XOR^o on icosahedral-12 (CYCLE=4), ${RULES.length} creation rules, 5 seeds x 2 phases`);
console.log("rule                                    mean_alive  mean_turned  turned/CYCLE  lap_rate");
const rows: any[] = [];
for (const c of RULES) {
  const th = withCreation(G_XOR_O, c);
  const rs: any[] = [];
  for (let seed = 1; seed <= 5; seed++) for (let phase = 0; phase < 2; phase++) {
    const r = flight(th, "icosahedral-12", seed, phase); if (r) rs.push(r);
  }
  if (!rs.length) continue;
  const m = (f: (r: any) => number) => rs.reduce((a, r) => a + f(r), 0) / rs.length;
  rows.push({ name: nameOf(c), alive: m(r => r.alive), turned: m(r => r.turned),
    ratio: m(r => r.turned) / rs[0].CYCLE,
    lapRate: rs.filter(r => r.turned >= r.CYCLE).length / rs.length });
}
rows.sort((a, b) => b.ratio - a.ratio);
for (const r of rows)
  console.log(r.name.padEnd(40), r.alive.toFixed(2).padStart(10),
    r.turned.toFixed(2).padStart(12), r.ratio.toFixed(3).padStart(13), (r.lapRate*100).toFixed(0).padStart(8) + "%",
    r.lapRate > 0 ? "  <-- LAPS COMPLETE" : "");
