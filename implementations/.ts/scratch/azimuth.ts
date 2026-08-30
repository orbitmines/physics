/**
 * DOES THE ROTATION REACH THE DENSITY? - measured in the frame that is turning.
 *
 * A running orbital has an axially symmetric |psi|^2, so a lobe pattern binned against a
 * FIXED axis must average to nothing - which is what turning = 1,2,3 gave, across seeds,
 * and is the right answer rather than a null one. The question the fixed frame cannot ask
 * is whether the lobes are there at all and merely sweeping.
 *
 * SO THE PROJECTION IS TAKEN AGAINST `axisAt(t)` - where the source's axis IS on that tick.
 * If the rotation reaches the density the projection stays large at every rate; if the
 * density cannot follow, it falls away as the axis speeds up, and the rate at which it
 * falls is how much the vacuum lags the source.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_XOR } from "../src/theories/G^XOR+XOR.ts";
import { axisAt } from "../src/lib/Source.ts";

const dot = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * (b[i] ?? 0), 0);
const unit = (v: number[]) => { const m = Math.hypot(...v); return m ? v.map(x => x / m) : v; };

export const project = (o: { geom: string; N: number; warm: number; T: number;
  seed: number; turning: number; period: number; rMax: number }) => {
  const g: any = (GEOMETRIES as any)[o.geom];
  const C = (o.N - 1) / 2;
  const w: any = new World({ theory: G_XOR_XOR, geometry: g, N: o.N, seed: o.seed,
    boundary: "absorb", slotUniformRng: true } as any);
  w.world.turnLog = [];
  const s: any = w.add({ at: [C,C,C], radius: 1, emits: 1, period: o.period,
    dwellTicks: Math.max(1, o.period >> 1), axis: [0,0,1], emission: "sheet",
    turning: o.turning, absorbs: true } as any);
  for (let t = 0; t < o.warm; t++) w.tick();

  /* co-rotating: project onto axisAt(t).  fixed: project onto the axis it started on */
  let co = 0, fix = 0, norm = 0;
  for (let t = 0; t < o.T; t++) {
    w.tick();
    const ax = unit((axisAt(g, s, w.world.ticks) ?? [0,0,1]) as number[]);
    for (const l of w.locals) {
      const at = w.embedding.at(l as any); if (!at) continue;
      const p = [at[0]-C, at[1]-C, at[2]-C];
      const rr = Math.hypot(...p);
      if (rr < 0.5 || rr > o.rMax) continue;
      let sg = 0, ab = 0;
      for (const r of (l as any).rays) {
        if (!r.active) continue;
        sg += r.polarity ?? 0; ab += Math.abs(r.polarity ?? 0);
      }
      if (!ab) continue;
      const u = unit(p);
      co  += sg * dot(u, ax);
      fix += sg * dot(u, [0,0,1]);
      norm += ab;
    }
  }
  return { co: co / norm, fix: fix / norm };
};

if (process.argv[1].endsWith("azimuth.ts")) {
  console.log("fcc-12, real vacuum, N=15 T=30, r<=2.5 — dipole projection");
  console.log("turning   co-rotating (onto axisAt(t))    fixed (onto z)     seeds 1-3");
  for (const turning of [0, 1, 2, 3]) {
    const rs = [1,2,3].map(seed => project({ geom: "fcc-12", N: 15, warm: 8, T: 30,
      seed, turning, period: 1, rMax: 2.5 }));
    const f = (xs: number[]) => xs.map(x => (x>=0?"+":"") + x.toFixed(3)).join(" ");
    console.log(String(turning).padStart(7), "  ", f(rs.map(r=>r.co)).padEnd(24),
      "  ", f(rs.map(r=>r.fix)));
  }
}
