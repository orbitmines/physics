/**
 * IS THE VACUUM'S CANCELLATION FRACTION REAL, OR IS IT MY SAMPLING? - the test that decides.
 *
 * The residual run reported net/gross of 0.0024 to 0.028 for the bare vacuum, and I called it
 * close to the 0.000545 the mass ratio wants. But `net` there was the signed charge SUMMED
 * OVER EVERY CELL AND EVERY TICK and then divided by the count - a MEAN. In a vacuum with no
 * preferred sign that mean goes to nought as the samples grow, like one over the square root
 * of them, so a small value may say nothing except that I took a lot of samples.
 *
 * THE TEST IS TO VARY THE SAMPLING AND WATCH. If net/gross falls as 1/sqrt(ticks), it is my
 * averaging and there is no cancellation fraction to speak of. If it settles on a number, the
 * vacuum really does hold a residual of that size and the number means something.
 *
 * AND THE RIGHT QUANTITY IS MEASURED BESIDE IT. What matters for a residual that could act as
 * a particle is not the mean over all time - it is how much net charge is in a REGION AT ONE
 * MOMENT, which is the RMS of the net rather than its mean. That does not vanish with
 * sampling, and it is what the mass ratio should be asked about.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_XOR } from "../src/theories/G^XOR+XOR.ts";

const GEOM = "fcc-12", N = 17, C = 8, WARM = 8, RMAX = 6;

const run = (ticks: number, seed: number) => {
  const g: any = (GEOMETRIES as any)[GEOM];
  const w: any = new World({ theory: G_XOR_XOR, geometry: g, N, seed,
    boundary: "absorb", slotUniformRng: true } as any);
  w.world.turnLog = [];
  for (let t = 0; t < WARM; t++) { w.tick(); w.world.turnLog.length = 0; }
  let sumNet = 0, sumGross = 0, cells = 0;
  /* and the per-tick net of the whole ball, kept so its RMS can be taken */
  const perTick: number[] = [];
  for (let t = 0; t < ticks; t++) {
    w.tick();
    let tickNet = 0, tickGross = 0;
    for (const l of w.locals) {
      const at = w.embedding.at(l as any); if (!at) continue;
      const r = Math.hypot(at[0]-C, at[1]-C, at[2]-C);
      if (r < 0.5 || r > RMAX) continue;
      cells++;
      for (const ry of (l as any).rays) {
        if (!ry.active) continue;
        const q = ry.charge ?? 0;
        tickNet += q; tickGross += Math.abs(q);
      }
    }
    perTick.push(tickNet);
    sumNet += tickNet; sumGross += tickGross;
    w.world.turnLog.length = 0;
  }
  const meanFrac = Math.abs(sumNet)/sumGross;
  const rms = Math.sqrt(perTick.reduce((a,b)=>a+b*b,0)/perTick.length);
  const grossPerTick = sumGross/ticks;
  return { meanFrac, rmsFrac: rms/grossPerTick, grossPerTick };
};

const SEEDS = 3;
console.log(`${GEOM} — does the cancellation fraction survive more sampling?\n`);
console.log("ticks    |mean net|/gross    RMS net/gross     gross per tick");
const prev: any = {};
for (const ticks of [25, 50, 100, 200]) {
  const rs = Array.from({length: SEEDS}, (_, k) => run(ticks, k + 1));
  const m = (f: (r:any)=>number) => rs.reduce((a,r)=>a+f(r),0)/rs.length;
  const mf = m(r=>r.meanFrac), rf = m(r=>r.rmsFrac);
  console.log(`${String(ticks).padStart(5)}   ${mf.toFixed(6).padStart(14)}` +
    `   ${rf.toFixed(6).padStart(14)}   ${m(r=>r.grossPerTick).toFixed(0).padStart(12)}` +
    (prev.mf ? `   mean x${(mf/prev.mf).toFixed(2)}, rms x${(rf/prev.rf).toFixed(2)}` : ""));
  prev.mf = mf; prev.rf = rf;
}
console.log(`\n  if the mean halves each time ticks quadruple, it is 1/sqrt(n) - my sampling`);
console.log(`  the RMS is the physical one: net charge in the ball at ONE moment`);
console.log(`  wanted for 1/1836: 0.000545`);
