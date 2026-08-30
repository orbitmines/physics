/** the continuum solver against the lattice - same box, same lattice, and how long each takes */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_XOR } from "../src/theories/G^XOR+XOR.ts";
import { field, profile, step } from "../src/lib/Vlasov.ts";

const g: any = GEOMETRIES["fcc-12"], N = 13, C = 6, RMAX = 4, T = 40;

/* the continuum */
let t0 = Date.now();
const f = field(g, N);
/* seed it at the vacuum's own occupancy, uniformly - no source yet */
f.n.fill(0.5 / (g.DEG * 4));
for (let t = 0; t < T; t++) step(f, { nu: 2.42, sigma: 1, cap: 1, tau: 0.5, shine: 0.3, fold: 0.02, stir: 0.6 });
const cont = profile(f, RMAX);
const contMs = Date.now() - t0;

/* the lattice, one seed */
t0 = Date.now();
const w: any = new World({ theory: G_XOR_XOR, geometry: g, N, seed: 1,
  boundary: "absorb", slotUniformRng: true } as any);
w.world.turnLog = [];
for (let t = 0; t < T; t++) { w.tick(); w.world.turnLog.length = 0; }
const gross = new Float64Array(RMAX+1), cells = new Float64Array(RMAX+1);
for (const l of w.locals) {
  const at = w.embedding.at(l as any); if (!at) continue;
  const r = Math.round(Math.hypot(at[0]-C, at[1]-C, at[2]-C));
  if (r < 1 || r > RMAX) continue;
  cells[r]++;
  for (const ry of (l as any).rays) if (ry.active) gross[r] += Math.abs(ry.charge ?? 0);
}
const latMs = Date.now() - t0;

console.log(`fcc-12  N=${N}  T=${T} ticks\n`);
console.log(`  continuum : ${contMs} ms   (deterministic, no seeds)`);
console.log(`  lattice   : ${latMs} ms   (one seed; a picture needs many)`);
console.log(`  speedup   : ${(latMs/contMs).toFixed(1)}x per seed, ` +
  `${(15*latMs/contMs).toFixed(0)}x against the 15 seeds a panel used\n`);
console.log("  r   continuum gross   lattice gross");
for (let r = 1; r <= RMAX; r++)
  console.log(`  ${r}   ${cont.gross[r].toFixed(4).padStart(13)}   ` +
    `${(cells[r]?gross[r]/cells[r]:0).toFixed(4).padStart(13)}`);
