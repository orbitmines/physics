/**
 * HOW FAR A RAY ACTUALLY GETS - the mean free path, measured on the lattice.
 *
 * `derived.ts` sets sigma from "a moving ray meets something essentially always", justified by
 * (G/2) putting a fresh half on every edge every tick. But (G/2) is gated on the point being
 * NEUTRAL AND NOT BUSY, and that gate is (1-rho)^DEG - about 0.08 at rho = 0.19. If only a
 * twelfth of points split per tick the vacuum is not refreshed everywhere, a ray meets
 * something with probability nearer `occ`, and the death rate is occ/2 rather than 1/2 -
 * which is a mean free path of ten cells rather than one and a half.
 *
 * Everything about whether an orbital can hold a shape rests on which of those it is, so it is
 * measured: how many active rays there are, and how many die per tick.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_XOR } from "../src/theories/G^XOR+XOR.ts";
const g: any = GEOMETRIES["fcc-12"];
const N = 15;
const w: any = new World({ theory: G_XOR_XOR, geometry: g, N, seed: 1,
  boundary: "absorb", slotUniformRng: true } as any);
const inner = w.world ?? w;
inner.turnLog = [];
for (let t = 0; t < 20; t++) w.tick();
console.log("tick  active rays   met/tick   imploded/tick   deaths per ray per tick   lambda (cells)");
let lastMet = inner.met ?? 0, lastImp = inner.imploded ?? 0;
for (let t = 0; t < 12; t++) {
  w.tick();
  let active = 0;
  for (const l of w.locals) for (const r of (l as any).rays) if (r.active) active++;
  const met = (inner.met ?? 0) - lastMet, imp = (inner.imploded ?? 0) - lastImp;
  lastMet = inner.met ?? 0; lastImp = inner.imploded ?? 0;
  /* a meeting that annihilates takes BOTH ends, so deaths = 2 x opposite meetings; half of
   * meetings are opposite in an unbiased vacuum */
  const deaths = met;                      // `met` already counts what was destroyed into
  const rate = deaths / Math.max(1, active);
  console.log(`${String(t).padStart(4)}  ${String(active).padStart(10)}   ${String(met).padStart(8)}` +
    `   ${String(imp).padStart(13)}   ${rate.toFixed(4).padStart(22)}   ${(1 / Math.max(1e-9, rate)).toFixed(2).padStart(13)}`);
}
