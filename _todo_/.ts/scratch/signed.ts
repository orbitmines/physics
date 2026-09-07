/**
 * THE SIGNED DENSITY, AND WHY THE UNSIGNED ONE HAD TO WASH OUT.
 *
 * A rotating sheet visits the same CYCLE orientations whatever rate it comes round at, so
 * a density accumulated over many full turns is the SAME at every rate - measured,
 * bit-identical at turning = 0, 1, 2. That is not a null result, it is the statement that
 * an unsigned average cannot carry an angular quantum number.
 *
 * WHAT CARRIES IT IS THE SIGN. `sign(s, tick)` flips the source's polarity every
 * `dwellTicks` of `period`, and `half()` puts the opposite sign out of the opposite half.
 * So each orientation of the sheet is visited WITH A SIGN, and whether a given direction
 * is always reinforced or alternately cancelled is set by the ratio of the flip rate to
 * the rotation rate. That ratio is a winding number, and it is what m is.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_XOR } from "../src/theories/G^XOR+XOR.ts";

const run = (o: { geom: string; N: number; warm: number; T: number; seed: number;
  period: number; dwell: number; turning: number; axis: number[] }) => {
  const g: any = (GEOMETRIES as any)[o.geom];
  const C = (o.N - 1) / 2;
  const w: any = new World({ theory: G_XOR_XOR, geometry: g, N: o.N, seed: o.seed,
    boundary: "absorb", slotUniformRng: true } as any);
  w.world.turnLog = [];
  w.add({ at: [C, C, C], radius: 1, emits: 1, period: o.period, dwellTicks: o.dwell,
    axis: o.axis, emission: "sheet", turning: o.turning, absorbs: true } as any);
  for (let t = 0; t < o.warm; t++) w.tick();

  /* SIGNED: the polarity the cell is carrying, summed over ticks */
  const sgn = new Map<string, number>(), abs = new Map<string, number>();
  for (let t = 0; t < o.T; t++) {
    w.tick();
    for (const l of w.locals) {
      const at = w.embedding.at(l as any); if (!at) continue;
      let s = 0, a = 0;
      for (const r of (l as any).rays) {
        if (!r.active) continue;
        s += r.polarity ?? 0; a += Math.abs(r.polarity ?? 0);
      }
      if (!a) continue;
      const k = `${at[0]-C},${at[1]-C},${at[2]-C}`;
      sgn.set(k, (sgn.get(k) ?? 0) + s);
      abs.set(k, (abs.get(k) ?? 0) + a);
    }
  }
  /* the angular pattern of the SIGNED density, in bands about the axis */
  const bins = new Map<string, { s: number; a: number; n: number }>();
  for (const [k, a] of abs) {
    const p = k.split(",").map(Number);
    const rr = Math.hypot(...p);
    if (rr < 0.5 || rr > 2.5) continue;
    const c = (p[0]*o.axis[0] + p[1]*o.axis[1] + p[2]*o.axis[2]) / rr;
    const band = Math.abs(c) < 0.34 ? "equator" : Math.abs(c) < 0.8
      ? (c > 0 ? "mid+" : "mid-") : (c > 0 ? "pole+" : "pole-");
    const e = bins.get(band) ?? { s: 0, a: 0, n: 0 };
    e.s += sgn.get(k) ?? 0; e.a += a; e.n++;
    bins.set(band, e);
  }
  return bins;
};

const order = ["pole+","mid+","equator","mid-","pole-"];
console.log("fcc-12 axial+sheet source, real vacuum, N=15 T=30 — SIGNED density / |density|");
console.log("turning period  " + order.map(o=>o.padStart(9)).join(""));
for (const turning of [0, 1, 2, 3])
  for (const period of [1]) {
    const b = run({ geom: "fcc-12", N: 15, warm: 8, T: 36, seed: 3,
      period, dwell: Math.max(1, period >> 1), turning, axis: [0,0,1] });
    console.log(String(turning).padStart(7), String(period).padStart(6), " ",
      order.map(o => { const e = b.get(o);
        return (e ? (e.s/e.a).toFixed(3) : "-").padStart(9); }).join(""));
  }
