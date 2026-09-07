/**
 * HOW BIG IS THE CLOUD, MEASURED - and against what in nature.
 *
 * There is no electron in this picture: there is a charged cloud the source has polarised,
 * and its dissipating as a whole is what has the effect of one. So the number that matters is
 * HOW FAR THAT CLOUD REACHES, and it is a measurement rather than a choice - which is what
 * `r_e = lambda` was not.
 *
 * Three readings of the extent, because a cloud has no edge and which one is meant matters:
 *
 *   r_e-fold   where the charge excess has fallen to 1/e of its peak
 *   r_mean     the charge-weighted mean radius - where the cloud IS, on average
 *   r_last     the furthest shell still above two sigma
 *
 * And the proton in the same units is the tightest thing that can close, CYCLE/(2pi) cells,
 * which is a lattice count and not fitted.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_XOR } from "../src/theories/G^XOR+XOR.ts";

const GEOM = "fcc-12", N = 25, C = 12, WARM = 8, TICKS = 100, SEEDS = 4, RMAX = 11;

const profile = (src: boolean, seed: number) => {
  const g: any = (GEOMETRIES as any)[GEOM];
  const w: any = new World({ theory: G_XOR_XOR, geometry: g, N, seed,
    boundary: "absorb", slotUniformRng: true } as any);
  w.world.turnLog = [];
  if (src) w.add({ at: [C,C,C], radius: 1, emits: 1, period: 1, dwellTicks: 1,
    absorbs: true } as any);
  for (let t = 0; t < WARM; t++) w.tick();
  const q = new Float64Array(RMAX + 2), n = new Float64Array(RMAX + 2);
  for (let t = 0; t < TICKS; t++) {
    w.tick();
    for (const l of w.locals) {
      const at = w.embedding.at(l as any); if (!at) continue;
      const r = Math.round(Math.hypot(at[0]-C, at[1]-C, at[2]-C));
      if (r < 1 || r > RMAX) continue;
      let v = 0;
      for (const ry of (l as any).rays) if (ry.active) v += ry.charge ?? 0;
      q[r] += v; n[r]++;
    }
    w.world.turnLog.length = 0;
  }
  return Array.from(q, (v, i) => n[i] ? v/n[i] : 0);
};

const rows: number[][] = [];
for (let s = 1; s <= SEEDS; s++) {
  const a = profile(true, s), b = profile(false, s);
  rows.push(a.map((v, i) => v - b[i]));
}
const mean = (i: number) => rows.reduce((x, r) => x + r[i], 0)/rows.length;
const sem = (i: number) => {
  const m = mean(i);
  return Math.sqrt(rows.reduce((x, r) => x + (r[i]-m)**2, 0)/(rows.length-1))/Math.sqrt(rows.length);
};

console.log(`${GEOM} N=${N}, plain source, ${SEEDS} seeds x ${TICKS} ticks`);
console.log("  r    charge excess per cell        |excess|·shell");
const w: number[] = [];
for (let r = 1; r <= RMAX; r++) {
  const m = mean(r), e = sem(r);
  /* the cloud's WEIGHT at that radius: per-cell excess times how many cells there are */
  const shell = Math.abs(m) * r * r;
  w.push(shell);
  console.log(`  ${String(r).padStart(2)}   ${(m>=0?"+":"")}${m.toFixed(4)} ± ${e.toFixed(4)}` +
    `${Math.abs(m)>2*e?" *":"  "}      ${shell.toFixed(4)}`);
}
const peak = Math.max(...w.map(Math.abs));
let efold = RMAX;
for (let i = 0; i < w.length; i++) if (Math.abs(w[i]) < peak/Math.E && i > w.indexOf(peak)) {
  efold = i + 1; break; }
const tot = w.reduce((a,b)=>a+Math.abs(b),0);
const rmean = w.reduce((a,b,i)=>a+Math.abs(b)*(i+1),0)/tot;
let rlast = 0;
for (let r = 1; r <= RMAX; r++) if (Math.abs(mean(r)) > 2*sem(r)) rlast = r;

const CYCLE = 6, rp = CYCLE/(2*Math.PI);
console.log(`\n  r_proton (CYCLE/2pi)        = ${rp.toFixed(3)} cells`);
console.log(`  r_cloud, 1/e of peak weight = ${efold} cells      ratio ${(efold/rp).toFixed(1)}`);
console.log(`  r_cloud, weighted mean      = ${rmean.toFixed(2)} cells   ratio ${(rmean/rp).toFixed(1)}`);
console.log(`  r_cloud, last 2-sigma shell = ${rlast} cells      ratio ${(rlast/rp).toFixed(1)}`);
console.log(`\n  m_p/m_e in nature = 1836.15`);
