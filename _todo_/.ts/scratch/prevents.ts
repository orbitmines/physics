/**
 * DOES BEING TURNED SAVE A CHARGE FROM BEING ANNIHILATED? - the rule order says it can.
 *
 * `steer` is called inside MOVEMENT, which decides which exit a ray leaves by; ANNIHILATION is
 * a LATER rule, quantified over whatever is facing once everything has moved. So the polarity
 * field bends a charge BEFORE the meeting is resolved, and a bend changes who it ends up
 * facing. Polarity therefore takes precedence over charge in the order of events, and turning
 * away can prevent a meeting that would have destroyed the pair.
 *
 * IF THAT IS WHY THE RESIDUAL SURVIVES, then switching the steering off must annihilate MORE
 * and leave LESS. `withSteering(..., "none")` is `G^XOR` - the same vacuum with the bending
 * taken out and nothing else changed - so the comparison is about the one rule.
 *
 * The prediction is stated before the run: annihilations UP and residual DOWN without
 * steering. If both are unchanged, the bending is not protecting anything and the residual
 * comes from somewhere else.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_XOR, withSteering } from "../src/theories/G^XOR+XOR.ts";

const GEOM = "fcc-12", N = 21, C = 10, WARM = 8, TICKS = 100, SEEDS = 5, RMAX = 8;

const run = (how: any, src: boolean, seed: number) => {
  const g: any = (GEOMETRIES as any)[GEOM];
  const w: any = new World({ theory: withSteering(G_XOR_XOR, how), geometry: g, N, seed,
    boundary: "absorb", slotUniformRng: true } as any);
  w.world.turnLog = [];
  if (src) w.add({ at: [C,C,C], radius: 1, emits: 1, period: 1, dwellTicks: 1,
    absorbs: true } as any);
  for (let t = 0; t < WARM; t++) { w.tick(); w.world.turnLog.length = 0; }
  const a0 = w.world.backend.stats.annihilations ?? 0;
  let gq = 0, nq = 0, cells = 0;
  /* the per-tick net, kept so its RMS can be taken - the MEAN of a signed quantity in a
   * symmetric vacuum wanders near nought and measures the sampling rather than the vacuum */
  const perTick: number[] = [];
  for (let t = 0; t < TICKS; t++) {
    w.tick();
    let tn = 0;
    for (const l of w.locals) {
      const at = w.embedding.at(l as any); if (!at) continue;
      const r = Math.round(Math.hypot(at[0]-C, at[1]-C, at[2]-C));
      if (r < 1 || r > RMAX) continue;
      cells++;
      let s = 0, a = 0;
      for (const ry of (l as any).rays) {
        if (!ry.active) continue;
        const q = ry.charge ?? 0;
        s += q; a += Math.abs(q);
      }
      gq += a; nq += s; tn += s;
    }
    perTick.push(tn);
    w.world.turnLog.length = 0;
  }
  const rms = Math.sqrt(perTick.reduce((a,b)=>a+b*b,0)/perTick.length);
  return { annih: (w.world.backend.stats.annihilations ?? 0) - a0,
           gross: gq/cells, net: nq/cells, frac: rms/(gq/TICKS || 1) };
};

console.log(`${GEOM} — does the bending protect the residual? ${SEEDS} seeds x ${TICKS} ticks\n`);
console.log("steering    annihilations   gross |q|/cell   net q/cell   RMS net/gross");
const out: any = {};
for (const how of ["lorentz", "coherent", "none"]) {
  const rs = Array.from({length: SEEDS}, (_, k) => run(how, true, k + 1));
  const m = (f: (r:any)=>number) => rs.reduce((a,r)=>a+f(r),0)/rs.length;
  const sd = (f: (r:any)=>number) => {
    const mm = m(f);
    return Math.sqrt(rs.reduce((a,r)=>a+(f(r)-mm)**2,0)/(rs.length-1))/Math.sqrt(rs.length);
  };
  out[how] = { a: m(r=>r.annih), f: m(r=>r.frac) };
  console.log(`${how.padEnd(11)} ${m(r=>r.annih).toFixed(0).padStart(9)}` +
    ` ± ${sd(r=>r.annih).toFixed(0).padEnd(6)}` +
    ` ${m(r=>r.gross).toFixed(4).padStart(10)}` +
    ` ${(m(r=>r.net)>=0?"+":"")}${m(r=>r.net).toFixed(4).padStart(11)}` +
    ` ${m(r=>r.frac).toFixed(5).padStart(11)}`);
}
const dA = 100*(out.none.a - out.lorentz.a)/out.lorentz.a;
const dF = 100*(out.none.f - out.lorentz.f)/out.lorentz.f;
console.log(`\n  turning the steering OFF changes annihilations by ${dA>=0?"+":""}${dA.toFixed(1)}%` +
  ` and the residual by ${dF>=0?"+":""}${dF.toFixed(1)}%`);
console.log(`  the mechanism predicts annihilations UP and residual DOWN`);
