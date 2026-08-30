/**
 * THE ROTATING SHEET, NOW THAT IT ACTUALLY ROTATES - what shape does it leave behind?
 *
 * `firing()` was recomputing the equator of a new axis each tick, which on fcc-12 lit a
 * 2-ray LINE where the sheet is 6 rays. Turned member by member about an axis lying in
 * itself - the article's "rotating this sheet in one more dimension than it's defined" -
 * it keeps its size and only its orientation moves. This asks what the turning density
 * around such a source looks like, at each rate of coming round.
 */
import { cloud } from "./cloud2.ts";

const profile = (turn: Map<string,number>, busy: Map<string,number>, axis: number[]) => {
  const bins = new Map<string, { t: number; b: number; n: number }>();
  for (const [k, b] of busy) {
    const p = k.split(",").map(Number);
    const rr = Math.hypot(...p);
    if (rr < 0.5 || rr > 2.5) continue;
    const c = (p[0]*axis[0] + p[1]*axis[1] + p[2]*axis[2]) / rr;
    const band = Math.abs(c) < 0.34 ? "equator" : Math.abs(c) < 0.8 ? "mid" : "pole";
    const key = `r=${Math.round(rr)} ${band}`;
    const e = bins.get(key) ?? { t: 0, b: 0, n: 0 };
    e.b += b; e.t += turn.get(k) ?? 0; e.n++;
    bins.set(key, e);
  }
  return bins;
};

const N = 21, warm = 10, T = 40, axis = [0,0,1];
for (const turning of [0, 1, 2]) {
  const { turn, busy } = cloud({ geom: "fcc-12", N, warm, T, seed: 1, source: true,
    period: 4, dwell: 2, axis, emission: "sheet", turning });
  console.log(`\nfcc-12  sheet source, turning=${turning}  (real vacuum, T=${T})`);
  const bins = [...profile(turn, busy, axis)].sort((a,b)=>a[0]<b[0]?-1:1);
  for (const [key, e] of bins)
    console.log("  ", key.padEnd(12), "cells=" + String(e.n).padStart(3),
      "busy/cell=" + (e.b/e.n).toFixed(2).padStart(7),
      "turn/busy=" + (e.t/e.b).toFixed(4).padStart(7));
}
