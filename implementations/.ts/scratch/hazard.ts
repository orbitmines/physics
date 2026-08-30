/**
 * DOES CLOSING A LAP HELP A CARRIER SURVIVE? - the hazard read along `turned`.
 *
 * THE CLAIM BEING TESTED is the self-consistency one: a charge that comes back round holds
 * its own neighbourhood down, and that deficit is what keeps it there. If closing the loop
 * is what holds the loop together, then the chance of taking ONE MORE ring step should RISE
 * once a carrier has been round - the survival curve bends upward exactly at CYCLE. If the
 * chance is flat in `turned`, the carrier is just a ray being eaten at a constant rate and
 * a completed lap is luck rather than a state.
 *
 * HOW IT IS READ. For each carrier, the furthest `turned` it ever reached. Then for each k,
 *
 *     P(k) = N(reached k+1) / N(reached k)
 *
 * which is the discrete hazard along the ring rather than along time - the right axis,
 * because the question is about laps and not about ticks.
 *
 * MANY CARRIERS TO ONE WORLD. Each is marked with a distinct `from`, which is CARRIED, and
 * they are lit far enough apart to be independent; one scan a tick then serves all of them.
 * This is what makes a few hundred carriers affordable where one-world-per-carrier was not.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_XOR, withSteering } from "../src/theories/G^XOR+XOR.ts";

const BASE = 1000;

const batch = (o: { geom: string; N: number; warm: number; T: number; seed: number;
  carriers: number }) => {
  const g: any = (GEOMETRIES as any)[o.geom];
  const C = (o.N - 1) / 2;
  const w: any = new World({ theory: withSteering(G_XOR_XOR, "lorentz"), geometry: g,
    N: o.N, seed: o.seed, boundary: "absorb", slotUniformRng: true } as any);
  w.world.turnLog = [];
  for (let t = 0; t < o.warm; t++) w.tick();

  /* light them well apart: every cell whose coords are 0 mod 3, up to `carriers` of them */
  const seats: any[] = [];
  for (const l of w.locals) {
    const at = w.embedding.at(l as any); if (!at) continue;
    if (at.some((x: number) => (x - C) % 3 !== 0)) continue;
    if (at.every((x: number) => x === C)) continue;
    seats.push(l);
    if (seats.length >= o.carriers) break;
  }
  const live = new Map<number, { turned: number; alive: number }>();
  seats.forEach((l, i) => {
    const r: any = l.rays[i % g.DEG];
    if (!r) return;
    r.active = true; r.polarity = 1; r.charge = (i % 2) ? 1 : -1;
    r.from = BASE + i; r.gyrophase = 0; r.turned = 0;
    live.set(BASE + i, { turned: 0, alive: 0 });
  });

  const done: { turned: number; alive: number }[] = [];
  for (let t = 0; t < o.T && live.size; t++) {
    w.tick();
    const seen = new Set<number>();
    for (const l of w.locals) {
      for (const ry of (l as any).rays) {
        const f = ry.from;
        if (f === undefined || f < BASE) continue;
        const e = live.get(f); if (!e) continue;
        seen.add(f);
        e.turned = Math.max(e.turned, ry.turned ?? 0);
      }
    }
    for (const [f, e] of [...live]) {
      if (seen.has(f)) { e.alive++; continue; }
      done.push(e); live.delete(f);
    }
  }
  for (const e of live.values()) done.push(e);        // still alive at the cut
  return { done, CYCLE: g.CYCLE };
};

const report = (geom: string, N: number, seeds: number, carriers: number) => {
  const all: { turned: number; alive: number }[] = [];
  let CYCLE = 0;
  for (let seed = 1; seed <= seeds; seed++) {
    const r = batch({ geom, N, warm: 8, T: 50, seed, carriers });
    CYCLE = r.CYCLE; all.push(...r.done);
  }
  const n = all.length;
  const reached = (k: number) => all.filter(e => e.turned >= k).length;
  const laps = reached(CYCLE);
  console.log(`\n${geom}  CYCLE=${CYCLE}  carriers=${n}  ` +
    `mean_turned=${(all.reduce((a,e)=>a+e.turned,0)/n).toFixed(2)}  ` +
    `mean_alive=${(all.reduce((a,e)=>a+e.alive,0)/n).toFixed(2)}`);
  console.log(`  LAP RATE (turned >= ${CYCLE}): ${laps}/${n} = ${(100*laps/n).toFixed(1)}%`);
  console.log("   k  reached  P(k+1|k)");
  for (let k = 0; k <= CYCLE + 2; k++) {
    const a = reached(k), b = reached(k + 1);
    if (!a) break;
    console.log(String(k).padStart(4), String(a).padStart(8),
      (b / a).toFixed(3).padStart(10), k === CYCLE ? "  <-- one lap" : "");
  }
};

report("icosahedral-12", 15, 10, 40);
report("fcc-12", 15, 10, 40);
