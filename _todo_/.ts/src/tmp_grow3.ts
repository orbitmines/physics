/* DOES A CONCENTRATION GROW A TURNING REGION? Two worlds on one seed, built the way
 * `readingOf` builds them - which is the whole point of this third attempt: a hand-made
 * `new World(...)` leaves the folding machinery off, so `folded` came back 0 and the
 * measurement was of the harness. Matter is read as `turningBodies`: a connected region
 * where charges are being bent, which is the aggregate reading and needs no closure. */
import { GEOMETRIES, Geometry, norm, sub } from "./lib/Local.ts";
import { Graph } from "./backends/CPU.graph.ts";
import { withTracking, turningBodies } from "./lib/Trajectory.ts";
import { G_XOR_C } from "./theories/G^XOR^c.ts";

const g = GEOMETRIES["fcc-12"] as Geometry, N = 13, T = 24, SEEDS = 2;
const centre = new Array(g.D).fill((N - 1) / 2);

const rngOf = (n: number) => { let x = (n | 0) || 1;
  return () => { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return ((x >>> 0) % 1e6) / 1e6; }; };

const build = (theory: any, seed: number, R: number) => {
  const t = withTracking(theory);
  const backend = g.seed(new Graph(t, seed, 12_000, g.DEG * 2, true, true, true, true), N);
  const w: any = t.seed({ N, seed, geometry: g, bound: 12_000, backend } as any);
  w.turnLog = [];
  let lit = 0;
  if (R >= 0) {
    const rng = rngOf(seed * 7919 + 13);
    backend.eachLocal((l: any) => {
      const p = w.embedding?.at?.(l) ?? l.at;
      if (!p || norm(sub(p as number[], centre)) > R) return;
      for (const r of l.rays as any[]) {
        r.active = true;
        r.polarity = rng() < 0.5 ? 1 : -1;
        r.charge = rng() < 0.5 ? 1 : -1;
        lit++;
      }
    });
  }
  return { w, backend, lit };
};

const look = (backend: any) => {
  const { bodies } = turningBodies(backend, g);
  const big = bodies.length ? Math.max(...bodies.map(b => b.mass)) : 0;
  const turns = bodies.reduce((a, b) => a + b.turns, 0);
  const mass = bodies.reduce((a, b) => a + b.mass, 0);
  return { n: bodies.length, big, mass, turns, folded: backend.foldedSize?.() ?? 0 };
};

console.log(`fcc-12 N=${N} ${T} ticks ${SEEDS} seeds - turning regions, seeded vs twin\n`);
for (const R of [-1, 0, 2, 3]) {
  const acc: any[] = [];
  let lit = 0;
  for (let s = 1; s <= SEEDS; s++) {
    const A = build(G_XOR_C, s, R);
    lit = A.lit;
    for (let t = 0; t < T; t++) {
      A.w.tick();
      const a = look(A.backend);
      acc[t] = acc[t] ?? { n: 0, big: 0, mass: 0, turns: 0, folded: 0 };
      for (const k of ["n", "big", "mass", "turns", "folded"]) acc[t][k] += (a as Record<string, number>)[k] / SEEDS;
    }
  }
  const at = (k: string, i: number) => (acc[i]?.[k] ?? 0).toFixed(0).padStart(6);
  const tag = R < 0 ? "UNSEEDED" : `R=${R} (${lit} rays)`;
  console.log(`${tag}`);
  for (const k of ["n", "big", "mass", "turns", "folded"])
    console.log(`   ${k.padEnd(7)} t=1 ${at(k,0)}  t=4 ${at(k,3)}  t=8 ${at(k,7)}  t=16 ${at(k,15)}  t=${T} ${at(k,T-1)}`);
}
