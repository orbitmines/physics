/**
 * WHAT IS LEFT AFTER THE CANCELLING - the residual charge, and whether it is pulled in.
 *
 * THE VACUUM HOLDS BOTH SIGNS AND KEEPS DESTROYING THEM. (G+M/2) splits every neutral point
 * into a pair carrying both, and ANNIHILATION fires on `mine !== theirs` - opposite charges
 * are destroyed outright and take their space with them. So at any moment the box is full of
 * charge that is CONSTANTLY CANCELLING, and the gross amount of it says nothing: what can act
 * as an electron is the RESIDUAL, the bit that has not found a partner.
 *
 * AND THE QUESTION IS WHETHER THAT RESIDUAL IS PULLED IN. Gravity here is suppressed
 * expansion, and it does not care about charge - so if the residual is drawn toward the source
 * it is because the polarised field arranged it, not because gravity picked a sign. That is
 * measurable: the net charge per shell, against the gross, with and without the source.
 *
 * THREE NUMBERS PER SHELL:
 *
 *   gross   sum of |charge| - how much charge is there at all
 *   net     sum of charge   - what is left after the two signs cancel
 *   ratio   net/gross       - how completely they cancel
 *
 * For the residual to weigh 1/1836 of the proton while filling a large region, net/gross has
 * to be of that order. If it is of order one, the cancelling is not doing the work and an
 * extended cloud cannot be light.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_XOR } from "../src/theories/G^XOR+XOR.ts";

const GEOM = "fcc-12", N = 21, C = 10, WARM = 8, TICKS = 100, SEEDS = 4, RMAX = 9;

const run = (src: boolean, seed: number) => {
  const g: any = (GEOMETRIES as any)[GEOM];
  const w: any = new World({ theory: G_XOR_XOR, geometry: g, N, seed,
    boundary: "absorb", slotUniformRng: true } as any);
  w.world.turnLog = [];
  if (src) w.add({ at: [C,C,C], radius: 1, emits: 1, period: 1, dwellTicks: 1,
    absorbs: true } as any);
  for (let t = 0; t < WARM; t++) { w.tick(); w.world.turnLog.length = 0; }
  const gross = new Float64Array(RMAX+2), net = new Float64Array(RMAX+2);
  const cells = new Float64Array(RMAX+2);
  let annih = 0;
  const a0 = w.world.backend?.stats?.annihilations ?? 0;
  for (let t = 0; t < TICKS; t++) {
    w.tick();
    for (const l of w.locals) {
      const at = w.embedding.at(l as any); if (!at) continue;
      const r = Math.round(Math.hypot(at[0]-C, at[1]-C, at[2]-C));
      if (r < 1 || r > RMAX) continue;
      cells[r]++;
      for (const ry of (l as any).rays) {
        if (!ry.active) continue;
        const q = ry.charge ?? 0;
        gross[r] += Math.abs(q); net[r] += q;
      }
    }
    w.world.turnLog.length = 0;
  }
  annih = (w.world.backend?.stats?.annihilations ?? 0) - a0;
  return { gross: Array.from(gross, (v,i)=>cells[i]?v/cells[i]:0),
           net: Array.from(net, (v,i)=>cells[i]?v/cells[i]:0), annih };
};

const Gs: number[][] = [], Ns: number[][] = []; let annihS = 0, annihC = 0;
for (let s = 1; s <= SEEDS; s++) {
  const a = run(true, s), b = run(false, s);
  Gs.push(a.gross.map((v,i)=>v-b.gross[i]));
  Ns.push(a.net.map((v,i)=>v-b.net[i]));
  annihS += a.annih; annihC += b.annih;
}
const mean = (rows: number[][], i: number) => rows.reduce((x,r)=>x+r[i],0)/rows.length;
const sem = (rows: number[][], i: number) => {
  const m = mean(rows,i);
  return Math.sqrt(rows.reduce((x,r)=>x+(r[i]-m)**2,0)/(rows.length-1))/Math.sqrt(rows.length);
};

/* and the ABSOLUTE level, not just the source's excess - how much cancelling goes on at all */
const abs = run(false, 1);
console.log(`${GEOM} N=${N} — charge per cell, ${SEEDS} seeds\n`);
console.log("BARE VACUUM (no source): how completely do the two signs cancel?");
for (let r = 1; r <= 5; r++)
  console.log(`  r=${r}  gross ${abs.gross[r].toFixed(3)}   net ${abs.net[r].toFixed(4)}` +
    `   net/gross ${(abs.net[r]/(abs.gross[r]||1)).toFixed(5)}`);
console.log(`  annihilations in the control run: ${annihC}`);

console.log("\nWHAT THE SOURCE ADDS (source minus control):");
console.log("  r      gross excess        net excess          net/gross");
let sg = 0, sn = 0;
for (let r = 1; r <= RMAX; r++) {
  const g0 = mean(Gs,r), n0 = mean(Ns,r), e = sem(Ns,r);
  sg += Math.abs(g0); sn += n0;
  console.log(`  ${String(r).padStart(2)}   ${(g0>=0?"+":"")}${g0.toFixed(4)}` +
    `        ${(n0>=0?"+":"")}${n0.toFixed(4)} ± ${e.toFixed(4)}${Math.abs(n0)>2*e?" *":"  "}` +
    `    ${(Math.abs(g0)>1e-9?n0/g0:0).toFixed(4).padStart(9)}`);
}
console.log(`\n  totals: gross ${sg.toFixed(4)}  net ${sn.toFixed(4)}  ` +
  `net/gross ${(sn/(sg||1)).toFixed(5)}`);
console.log(`  annihilations: source ${annihS}  control ${annihC}  ` +
  `(${(100*(annihS-annihC)/(annihC||1)).toFixed(1)}% more with the source)`);
console.log(`\n  for the residual to weigh 1/1836 of the proton, net/gross ~ ${(1/1836.15).toFixed(6)}`);
