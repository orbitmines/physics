/**
 * THE CLOUD'S MASS AGAINST THE SOURCE'S - in the one currency both of them have.
 *
 * MASS HERE IS SUPPRESSED EXPANSION. (G/2) splits every neutral point every tick, and the
 * gate is `if (l.source || busy(l)) return` - a point carrying an active ray does not split,
 * and neither does a source's own cell. `G^XOR^o` says this IS the gravity mechanism, and
 * `lib/Trajectory.ts` gives the other reading of the same thing: "MASS IS HOW MANY POINTS
 * ARE TURNING, which is the only count available".
 *
 * So both sides are counted as splits that did not happen:
 *
 *   the source   its own cells, which never split by the first clause of that gate
 *   the cloud    every OTHER cell that is busy with the source present and would not have
 *                been without it - the vacuum polarised by the source, measured against the
 *                same vacuum with no source in it
 *
 * WHAT IS OWED, SAID BEFORE THE NUMBER. The source is a BOUNDARY CONDITION, not a structure
 * the rules built: its cells are declared, not turned into being. So its mass here is what
 * was put in by hand, and this ratio is only as meaningful as that stand-in. It is still
 * worth asking, because if the cloud a proton-sized source polarises is ~1/1836 of it, that
 * is a relation nobody put there.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_XOR } from "../src/theories/G^XOR+XOR.ts";

const GEOM = "fcc-12", N = 21, C = 10;

const run = (o: { seed: number; warm: number; T: number; source: boolean;
  turning: number; radius: number }) => {
  const g: any = (GEOMETRIES as any)[GEOM];
  const w: any = new World({ theory: G_XOR_XOR, geometry: g, N, seed: o.seed,
    boundary: "absorb", slotUniformRng: true } as any);
  w.world.turnLog = [];
  let src: any = null;
  if (o.source) src = w.add({ at: [C,C,C], radius: o.radius, emits: 1, period: 1,
    dwellTicks: 1, axis: [0,0,1], emission: "sheet", turning: o.turning,
    absorbs: true } as any);

  for (let t = 0; t < o.warm; t++) { w.tick(); w.world.turnLog.length = 0; }

  let busy = 0, turning = 0, srcCells = 0, ticks = 0;
  for (let t = 0; t < o.T; t++) {
    w.tick();
    for (const l of w.locals) {
      const at = w.embedding.at(l as any); if (!at) continue;
      /*
       * THE SAME CELLS IN BOTH ARMS. Skipping the source's own cells in the source run and
       * not in the control measured the hole the body punches in the tally: the excess came
       * back negative and equal to the cells removed times the vacuum's busy fraction, with
       * no seed scatter at all. The body's footprint is therefore excluded GEOMETRICALLY,
       * from both runs, so what is left is the vacuum's response outside it.
       */
      const d = Math.hypot(at[0]-C, at[1]-C, (at[2] ?? C)-C);
      if (d <= o.radius + 0.5) { if ((l as any).source) srcCells++; continue; }
      let act = false, turn = false;
      for (const r of (l as any).rays) {
        if (!r.active) continue;
        act = true;
        if ((r.turned ?? 0) > 0) { turn = true; break; }
      }
      if (act) busy++;
      if (turn) turning++;
    }
    w.world.turnLog.length = 0;
    ticks++;
  }
  return { busy: busy / ticks, turning: turning / ticks, srcCells: srcCells / ticks };
};

const SEEDS = 6, WARM = 8, T = 50;
console.log(`${GEOM} N=${N} — mass as splits that did not happen, per tick, ${SEEDS} seeds\n`);
console.log("radius turning   source cells   busy excess     turn excess    " +
  "M_src/M_busy   M_src/M_turn");
for (const radius of [1, 2, 3]) for (const turning of [0, 1]) {
  const S: any[] = [], K: any[] = [];
  for (let seed = 1; seed <= SEEDS; seed++) {
    S.push(run({ seed, warm: WARM, T, source: true, turning, radius }));
    K.push(run({ seed, warm: WARM, T, source: false, turning, radius }));
  }
  const mean = (xs: any[], f: (r: any) => number) =>
    xs.reduce((a, r) => a + f(r), 0) / xs.length;
  const src = mean(S, r => r.srcCells);
  const dBusy = mean(S, r => r.busy) - mean(K, r => r.busy);
  const dTurn = mean(S, r => r.turning) - mean(K, r => r.turning);
  /* per-seed ratios, so the error bar is on the RATIO and not on the pieces */
  const rb = S.map((s, i) => s.srcCells / Math.max(1e-9, s.busy - K[i].busy));
  const sd = (xs: number[]) => {
    const m = xs.reduce((a,b)=>a+b,0)/xs.length;
    return Math.sqrt(xs.reduce((a,b)=>a+(b-m)**2,0)/Math.max(1,xs.length-1))/Math.sqrt(xs.length);
  };
  console.log(String(radius).padStart(6), String(turning).padStart(8),
    src.toFixed(1).padStart(14), dBusy.toFixed(1).padStart(14),
    dTurn.toFixed(1).padStart(15),
    `${(src/dBusy).toFixed(3)}±${sd(rb).toFixed(3)}`.padStart(16),
    (src/dTurn).toFixed(3).padStart(14));
}
console.log("\n  the proton:electron ratio to beat is 1836.15");
