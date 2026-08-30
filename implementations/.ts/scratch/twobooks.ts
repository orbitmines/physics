/**
 * DOES THE RESIDUAL HAVE TO SURVIVE TWO BOOKS? - which would make the exponent a count.
 *
 * A single pass of cancelling leaves 2.7% and gives a mass ratio of 36; two passes give 1327
 * against the 1836 wanted. But "two" was chosen because it lands near the answer, and that is
 * fitting rather than deriving. What would make it a COUNT is if the model already carries two
 * signed quantities that a residual must survive independently.
 *
 * IT DOES. `(G+M/2)` in `G^XOR+XOR` splits every neutral point into pairs TWICE OVER - once in
 * polarity and once in charge, "from two independent draws" in the rule's own words. So a ray
 * carries two signs, each with its own cancelling, and a residual that has to be left over in
 * BOTH books survives at the product of the two rates. The exponent is then the number of
 * signed quantities the theory has, which is two because the theory says two, and not because
 * 1836 wanted it.
 *
 * WHAT IS MEASURED, per shell and pooled:
 *
 *   q      the charge book:   sum |q| against sum q
 *   p      the polarity book: sum |p| against sum p
 *   both   how often a ray is left over in BOTH at once - the joint residual
 *
 * AND THE TEST OF INDEPENDENCE IS THE POINT. If the joint residual is the product of the two
 * separate ones, the books are independent and the exponent is honestly 2. If the joint is
 * much larger, they are correlated and the two draws are not doing separate work - in which
 * case the exponent is 1 and the ratio stays at 36.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_XOR } from "../src/theories/G^XOR+XOR.ts";

const GEOM = "fcc-12", N = 21, C = 10, WARM = 8, TICKS = 120, SEEDS = 5, RMAX = 8;

const run = (src: boolean, seed: number) => {
  const g: any = (GEOMETRIES as any)[GEOM];
  const w: any = new World({ theory: G_XOR_XOR, geometry: g, N, seed,
    boundary: "absorb", slotUniformRng: true } as any);
  w.world.turnLog = [];
  if (src) w.add({ at: [C,C,C], radius: 1, emits: 1, period: 1, dwellTicks: 1,
    absorbs: true } as any);
  for (let t = 0; t < WARM; t++) { w.tick(); w.world.turnLog.length = 0; }

  let gq = 0, nq = 0, gp = 0, np = 0;
  /* the joint: per CELL, is there charge left over and polarity left over at once */
  let cells = 0, leftQ = 0, leftP = 0, leftBoth = 0;
  for (let t = 0; t < TICKS; t++) {
    w.tick();
    for (const l of w.locals) {
      const at = w.embedding.at(l as any); if (!at) continue;
      const r = Math.round(Math.hypot(at[0]-C, at[1]-C, at[2]-C));
      if (r < 1 || r > RMAX) continue;
      let sq = 0, aq = 0, sp = 0, ap = 0;
      for (const ry of (l as any).rays) {
        if (!ry.active) continue;
        const q = ry.charge ?? 0, p = ry.polarity ?? 0;
        sq += q; aq += Math.abs(q); sp += p; ap += Math.abs(p);
      }
      gq += aq; nq += sq; gp += ap; np += sp;
      cells++;
      const lq = sq !== 0, lp = sp !== 0;
      if (lq) leftQ++;
      if (lp) leftP++;
      if (lq && lp) leftBoth++;
    }
    w.world.turnLog.length = 0;
  }
  return { gq, nq, gp, np, cells, leftQ, leftP, leftBoth };
};

const acc: any = { gq:0, nq:0, gp:0, np:0, cells:0, leftQ:0, leftP:0, leftBoth:0 };
for (let s = 1; s <= SEEDS; s++) {
  const a = run(true, s);
  for (const k of Object.keys(acc)) acc[k] += a[k];
}

const fq = Math.abs(acc.nq)/acc.gq, fp = Math.abs(acc.np)/acc.gp;
const pQ = acc.leftQ/acc.cells, pP = acc.leftP/acc.cells, pB = acc.leftBoth/acc.cells;

console.log(`${GEOM} — the two books, ${SEEDS} seeds x ${TICKS} ticks\n`);
console.log("HOW COMPLETELY EACH BOOK CANCELS (net over gross, pooled):");
console.log(`  charge     |sum q| / sum|q|  = ${fq.toFixed(5)}`);
console.log(`  polarity   |sum p| / sum|p|  = ${fp.toFixed(5)}`);
console.log(`  product                      = ${(fq*fp).toExponential(3)}  ->  ratio ${(1/(fq*fp)).toFixed(0)}`);

console.log("\nARE THE TWO BOOKS INDEPENDENT? (per cell, is anything left over)");
console.log(`  P(charge left)             = ${pQ.toFixed(5)}`);
console.log(`  P(polarity left)           = ${pP.toFixed(5)}`);
console.log(`  P(both)  measured          = ${pB.toFixed(5)}`);
console.log(`  P(both)  if independent    = ${(pQ*pP).toFixed(5)}`);
console.log(`  ratio measured/independent = ${(pB/(pQ*pP)).toFixed(3)}` +
  `   ${Math.abs(pB/(pQ*pP)-1) < 0.15 ? "<- independent, so the exponent is honestly 2"
     : "<- correlated, the two draws are NOT doing separate work"}`);
console.log(`\n  wanted: m_p/m_e = 1836.15`);
