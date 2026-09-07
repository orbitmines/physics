/**
 * DOES A DISTURBANCE SPREAD IN THE LATTICE, AND WHAT SPREADS IT? - measured, because the
 * continuum form only attenuates and the difference has to be found rather than guessed.
 *
 * A bright spot is put at the middle of a running vacuum and watched. Two things are read:
 *
 *   how far it has got   the mean radius of the excess, tick by tick. Ballistic streaming
 *                        grows as t; diffusion grows as sqrt(t). Which one it is says
 *                        whether anything is scattering it at all
 *   what it left behind  the POLARITY the vacuum is carrying where the disturbance has been,
 *                        against the same vacuum with no disturbance - the polarisation
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_XOR } from "../src/theories/G^XOR+XOR.ts";

const GEOM = process.argv[2] ?? "fcc-12";
const g: any = GEOMETRIES[GEOM], N = 19, C = 9, WARM = 8, T = 18;

const run = (lit: boolean, seed: number) => {
  const w: any = new World({ theory: G_XOR_XOR, geometry: g, N, seed,
    boundary: "absorb", slotUniformRng: true } as any);
  w.world.turnLog = [];
  for (let t = 0; t < WARM; t++) { w.tick(); w.world.turnLog.length = 0; }
  if (lit) for (const l of w.locals) {
    const at = w.embedding.at(l as any); if (!at) continue;
    if (Math.hypot(at[0]-C, at[1]-C, at[2]-C) > 1.1) continue;
    for (const r of (l as any).rays) { r.active = true; r.polarity = 1; r.charge = 1; }
  }
  const out: { r: number; pol: number }[] = [];
  for (let t = 0; t < T; t++) {
    w.tick(); w.world.turnLog.length = 0;
    let sw = 0, s = 0, pol = 0, cells = 0;
    for (const l of w.locals) {
      const at = w.embedding.at(l as any); if (!at) continue;
      const rr = Math.hypot(at[0]-C, at[1]-C, at[2]-C);
      if (rr > 8) continue;
      cells++;
      let n = 0, p = 0;
      for (const ry of (l as any).rays) { if (!ry.active) continue; n++; p += ry.polarity ?? 0; }
      sw += n * rr; s += n; pol += p;
    }
    out.push({ r: s ? sw / s : 0, pol: pol / cells });
  }
  return out;
};

const S = 2;
const A: any[][] = [], B: any[][] = [];
for (let k = 1; k <= S; k++) { A.push(run(true, k)); B.push(run(false, k)); }

console.log(`${GEOM} — a bright spot in a running vacuum, ${S} seeds\n`);
console.log("tick   mean radius of the excess   sqrt(t)   t     polarisation left");
for (let t = 0; t < T; t += 3) {
  const ra = A.reduce((x, r) => x + r[t].r, 0) / S;
  const rb = B.reduce((x, r) => x + r[t].r, 0) / S;
  const pa = A.reduce((x, r) => x + r[t].pol, 0) / S;
  const pb = B.reduce((x, r) => x + r[t].pol, 0) / S;
  console.log(String(t+1).padStart(4), (ra - rb).toFixed(4).padStart(24),
    Math.sqrt(t+1).toFixed(2).padStart(9), String(t+1).padStart(4),
    (pa - pb).toFixed(5).padStart(18));
}
