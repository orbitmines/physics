/**
 * IS THE PATTERN OCCUPIED, OR ONLY DRIVEN? - the source is cut and the density watched.
 *
 * Everything measured so far is a pattern the source LAYS DOWN. An orbital is something a
 * thing STANDS IN: it has to outlive whatever put it there. So the source is run until the
 * dipole is established, then made inert - it stops emitting and stops absorbing, and
 * nothing else about the world changes - and the co-rotating projection is read tick by
 * tick afterwards.
 *
 * WHAT EACH ANSWER WOULD MEAN. A projection that falls to the vacuum's own level within a
 * tick or two says the pattern was being held up by the source and there is no bound state
 * here - which is what `lambda/CYCLE ~ 0.4` predicts. One that persists says the region is
 * holding itself, which is the self-consistency the model needs and cannot currently show.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_XOR } from "../src/theories/G^XOR+XOR.ts";
import { axisAt } from "../src/lib/Source.ts";

const dot = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * (b[i] ?? 0), 0);
const unit = (v: number[]) => { const m = Math.hypot(...v); return m ? v.map(x => x / m) : v; };

const run = (o: { seed: number; turning: number; warm: number; after: number;
  cut: boolean; N: number }) => {
  const g: any = (GEOMETRIES as any)["fcc-12"];
  const C = (o.N - 1) / 2;
  const w: any = new World({ theory: G_XOR_XOR, geometry: g, N: o.N, seed: o.seed,
    boundary: "absorb", slotUniformRng: true } as any);
  w.world.turnLog = [];
  const s: any = w.add({ at: [C,C,C], radius: 1, emits: 1, period: 1, dwellTicks: 1,
    axis: [0,0,1], emission: "sheet", turning: o.turning, absorbs: true } as any);

  const read = () => {
    const ax = unit((axisAt(g, s, w.world.ticks) ?? [0,0,1]) as number[]);
    let co = 0, norm = 0, turning = 0, busy = 0;
    for (const l of w.locals) {
      const at = w.embedding.at(l as any); if (!at) continue;
      const p = [at[0]-C, at[1]-C, at[2]-C];
      const rr = Math.hypot(...p);
      if (rr < 0.5 || rr > 2.5) continue;
      let sg = 0, ab = 0;
      for (const r of (l as any).rays) {
        if (!r.active) continue;
        sg += r.polarity ?? 0; ab += Math.abs(r.polarity ?? 0);
        busy++; turning += (r.turned ?? 0) > 0 ? 1 : 0;
      }
      if (!ab) continue;
      co += sg * dot(unit(p), ax); norm += ab;
    }
    return { co: norm ? co / norm : 0, turnFrac: busy ? turning / busy : 0 };
  };

  for (let t = 0; t < o.warm; t++) w.tick();
  const before = read();
  /* CUT: the source stops emitting and stops absorbing. Nothing else changes. */
  if (o.cut) { s.duty = 0; s.absorbs = false; }
  const after: { co: number; turnFrac: number }[] = [];
  for (let t = 0; t < o.after; t++) { w.tick(); after.push(read()); }
  return { before, after };
};

const N = 15, warm = 10, AFTER = 10;
for (const turning of [0, 1]) {
  for (const cut of [true, false]) {
    const rs = [1,2,3].map(seed => run({ seed, turning, warm, after: AFTER, cut, N }));
    const mean = (f: (r: any) => number) => rs.reduce((a,r)=>a+f(r),0)/rs.length;
    const traj = Array.from({length: AFTER}, (_, i) =>
      (rs.reduce((a,r)=>a+r.after[i].co,0)/rs.length));
    console.log(`turning=${turning} ${cut ? "SOURCE CUT " : "source kept"}` +
      `  before=${mean(r=>r.before.co).toFixed(3)}  after:`,
      traj.map(x => (x>=0?"+":"") + x.toFixed(3)).join(" "));
  }
}
