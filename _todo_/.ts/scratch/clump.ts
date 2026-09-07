/**
 * DOES THE VACUUM CLUMP? - which is whether matter forms at all, asked of the full rules.
 *
 * With RADIATING on, a turn throws off a ray. Turning goes at the rate |B|, and B is made of the
 * rays. So a patch with a little more field turns a little more, sheds a little more polarity,
 * and has a little more field: the loop can run away. If it does, the uniform vacuum is UNSTABLE
 * and lumps of it are matter - "mass is polarity made by turning", as a measurement rather than
 * a slogan. If it does not, the vacuum stays a vacuum and nothing can be built out of it.
 *
 * Measured as the roughness of the density across cells - the standard deviation over the mean.
 * Poisson noise sets a floor of 1/sqrt(particles per cell), so what matters is whether the
 * roughness sits AT that floor or climbs above it, and whether shine changes which.
 *
 * usage: npx tsx scratch/clump.ts [shine] [ticks]
 */
import { gather, tick, world, type Rules } from "../src/lib/Vacuum.ts";

const SHINE = Number(process.argv[2] ?? 0);
const TICKS = Number(process.argv[3] ?? 60);
const R: Rules = { theta: Math.PI/4, sigma: 1, tau: 1, nu: 1, stir: 1,
                   shine: SHINE, makes: "polarity" };
const W = world(8, 8, 6_000_000, 1/200);
const dt = 1;      /* a tick is a tick - see the beat comment in Vacuum.ts */

const rough = () => {
  gather(W);
  let s = 0, s2 = 0, k = 0;
  for (let c = 0; c < W.rho.length; c++) { s += W.rho[c]; s2 += W.rho[c]**2; k++; }
  const m = s/k;
  return { rho: m, rel: Math.sqrt(Math.max(0, s2/k - m*m)) / (m || 1),
           floor: 1/Math.sqrt(Math.max(1, W.n/k)) };
};

console.log(`shine = ${SHINE}  (0 is G^XOR+XOR; above it is G^XOR^o, makes polarity)`);
console.log(`  tick     rays      rho    roughness   Poisson floor   above floor?`);
for (let t = 1; t <= TICKS; t++) {
  tick(W, R, dt, 11);
  if (t % 10 === 0) {
    const r = rough();
    console.log(`  ${String(t).padStart(4)}  ${String(W.n).padStart(8)}  ${r.rho.toFixed(4)}  ` +
      `${r.rel.toFixed(4).padStart(9)}   ${r.floor.toFixed(4).padStart(11)}   ` +
      `${(r.rel/r.floor).toFixed(2)}x`);
  }
  if (W.n >= W.cap * 0.95) { console.log("  RAN AWAY - hit capacity"); break; }
}
