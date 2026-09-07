/**
 * DOES THE LATTICE'S OWN CLOUD SIT ON THE <110> ARMS? - the ground truth, never measured.
 *
 * The continuum form puts a source's charge on the lattice's own diagonals and leaves the
 * space between them nearly empty. Whether that is right has been argued about for hours and
 * never checked, so this checks it: a source in a running vacuum, and the charge it adds
 * split by whether a cell lies on an arm - two offsets equal, the third nought - or between.
 *
 * A ratio near one is an isotropic cloud. A large ratio is an X, and would mean the continuum
 * is reproducing the lattice rather than failing to.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_XOR } from "../src/theories/G^XOR+XOR.ts";

const g: any = GEOMETRIES["fcc-12"], N = 19, C = 9, WARM = 8, T = 60, SEEDS = 2;

const run = (src: boolean, seed: number) => {
  const w: any = new World({ theory: G_XOR_XOR, geometry: g, N, seed,
    boundary: "absorb", slotUniformRng: true } as any);
  w.world.turnLog = [];
  if (src) w.add({ at: [C,C,C], radius: 1, emits: 1, period: 1, dwellTicks: 1,
    absorbs: true } as any);
  for (let t = 0; t < WARM; t++) { w.tick(); w.world.turnLog.length = 0; }
  const on = new Float64Array(7), off = new Float64Array(7);
  const non = new Float64Array(7), noff = new Float64Array(7);
  for (let t = 0; t < T; t++) {
    w.tick();
    for (const l of w.locals) {
      const at = w.embedding.at(l as any); if (!at) continue;
      const dx = at[0]-C, dy = at[1]-C, dz = at[2]-C;
      const r = Math.round(Math.hypot(dx,dy,dz));
      if (r < 1 || r > 6) continue;
      let q = 0;
      for (const ry of (l as any).rays) if (ry.active) q += Math.abs(ry.charge ?? 0);
      const a = [Math.abs(dx), Math.abs(dy), Math.abs(dz)].sort((p,s)=>s-p);
      if (a[2] === 0 && a[0] === a[1] && a[0] > 0) { on[r] += q; non[r]++; }
      else { off[r] += q; noff[r]++; }
    }
    w.world.turnLog.length = 0;
  }
  return { on: Array.from(on,(v,i)=>non[i]?v/non[i]:0),
           off: Array.from(off,(v,i)=>noff[i]?v/noff[i]:0) };
};

const A: any[] = [], B: any[] = [];
for (let s = 1; s <= SEEDS; s++) { A.push(run(true,s)); B.push(run(false,s)); }
const m = (xs: any[], k: string, r: number) => xs.reduce((a,x)=>a+x[k][r],0)/xs.length;

console.log(`fcc-12 LATTICE - a source's charge, on the <110> arms against between them\n`);
console.log("  r    on-arm excess   between excess    ratio");
for (let r = 1; r <= 6; r++) {
  const on = m(A,"on",r) - m(B,"on",r), off = m(A,"off",r) - m(B,"off",r);
  if (Math.abs(on) < 1e-9 && Math.abs(off) < 1e-9) continue;
  console.log(`  ${r}   ${on.toFixed(4).padStart(13)}   ${off.toFixed(4).padStart(14)}` +
    `   ${(on/(off||1e-9)).toFixed(2).padStart(7)}`);
}
console.log("\n  ratio ~1 = isotropic.  large = an X.   the continuum gives about 3.7");
