/* DOES A CONCENTRATION AMPLIFY ITSELF? Two worlds on one seed, one with a lump of rays in
 * it, and what is watched is whether the DIFFERENCE grows or settles. Growth is the loop
 * closing - deflection, radiation, busyness, deficit, more concentration. Settling is the
 * loop having no gain, which is what `medium/what-transport-does` already finds for a
 * perturbation of one ray. The question is whether a BIGGER seed behaves differently, so
 * the seed size is swept rather than chosen. */
import { GEOMETRIES, norm, sub } from "./lib/Local.ts";
import { World } from "./lib/Compat.ts";
import { G_XOR_C } from "./theories/G^XOR^c.ts";

const g = GEOMETRIES["fcc-12"], N = 13, T = 24, SEEDS = 2;
const centre = new Array(g.D).fill((N - 1) / 2);

/** a small deterministic stream for the seed itself, so the lump is the same lump */
const rngOf = (n: number) => { let x = (n | 0) || 1;
  return () => { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return ((x >>> 0) % 1e6) / 1e6; }; };

const build = (seed: number, R: number) => {
  const rng = rngOf(seed * 7919 + 13);
  const w: any = new World({ theory: G_XOR_C, geometry: g, N, seed, boundary: "wrap" });
  w.world.turnLog = [];
  if (R >= 0) {
    let lit = 0;
    for (const l of w.locals as any[]) {
      const p = w.embedding.at(l) as number[] | undefined;
      if (!p || norm(sub(p, centre)) > R) continue;
      for (const r of l.rays as any[]) {
        /*
         * DRAWN, NOT ALIGNED - and the first version of this got it exactly wrong.
         *
         * Lighting the whole lump at polarity +1 makes every facing pair inside it ALIKE,
         * and an alike pair TURNS rather than annihilating. So the seed was a region where
         * annihilation is suppressed by construction, and it duly destroyed less space
         * than the vacuum did - measured, -569 at R=3, which reads as a lump that repels
         * gravity and is nothing but the seed's own polarisation. A concentration of
         * MATTER is a concentration of rays, not a magnet.
         */
        r.active = true;
        r.polarity = rng() < 0.5 ? 1 : -1;
        r.charge = rng() < 0.5 ? 1 : -1;
        lit++;
      }
    }
    w.lit = lit;
  }
  return w;
};

const state = (w: any) => ({
  rays: (w.locals as any[]).reduce((a, l) => a + (l.rays as any[]).filter(r => r.active).length, 0),
  folded: w.backend.foldedSize?.() ?? 0,
  destroyed: (w.locals as any[]).reduce((a, l) => a + (l.destroyed ?? 0), 0),
});

console.log(`fcc-12  N=${N}  ${T} ticks  ${SEEDS} seeds  -  the DIFFERENCE against an unseeded twin\n`);
for (const R of [0, 2, 3]) {
  const traj: { rays: number[]; folded: number[]; destroyed: number[] } =
    { rays: [], folded: [], destroyed: [] };
  let lit = 0; let absLast: any = null;
  for (let s = 1; s <= SEEDS; s++) {
    const w = build(s, R), u = build(s, -1);
    lit = w.lit ?? 0;
    for (let t = 0; t < T; t++) {
      w.run(1); u.run(1);
      const a = state(w), b = state(u);
      if (t === T - 1) absLast = a;
      traj.rays[t] = (traj.rays[t] ?? 0) + (a.rays - b.rays) / SEEDS;
      traj.folded[t] = (traj.folded[t] ?? 0) + (a.folded - b.folded) / SEEDS;
      traj.destroyed[t] = (traj.destroyed[t] ?? 0) + (a.destroyed - b.destroyed) / SEEDS;
    }
  }
  const at = (x: number[], k: number) => (x[k] ?? 0).toFixed(0).padStart(7);
  console.log(`R=${R}  lit ${String(lit).padStart(4)} rays   (absolute in the seeded world at t=${T}: ${JSON.stringify(absLast)})`);
  console.log(`   d(rays)      t=1 ${at(traj.rays,0)}  t=5 ${at(traj.rays,4)}  t=15 ${at(traj.rays,14)}  t=${T} ${at(traj.rays,T-1)}`);
  console.log(`   d(folded)    t=1 ${at(traj.folded,0)}  t=5 ${at(traj.folded,4)}  t=15 ${at(traj.folded,14)}  t=${T} ${at(traj.folded,T-1)}`);
  console.log(`   d(destroyed) t=1 ${at(traj.destroyed,0)}  t=5 ${at(traj.destroyed,4)}  t=15 ${at(traj.destroyed,14)}  t=${T} ${at(traj.destroyed,T-1)}`);
}
