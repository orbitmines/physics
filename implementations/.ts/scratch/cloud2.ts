/**
 * THE ELECTRON CLOUD AS TURNING DENSITY - the aggregate reading, in the real vacuum.
 *
 * WHY NOT A RAY. `lib/Trajectory.ts` settles this: "Reading matter as `r.turned >= CYCLE`
 * asks one ray to survive its own circumference, and at this occupancy almost none do ...
 * But a REGION can be persistently full of turning without any single ray going all the way
 * round - the same way a vortex is a real thing without any one molecule completing a
 * circuit." So what is accumulated here is WHERE TURNING IS HAPPENING, per cell, over many
 * ticks - which is also what `visuals/ATOM.ts` says a bound state is: "where it is FOUND,
 * over many of them, and that is a density".
 *
 * NOTHING IS IMPOSED AND NOTHING IS SWITCHED OFF. CREATION is on, the vacuum is at its own
 * occupancy, and the only thing put in the box is the source at the middle.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_XOR } from "../src/theories/G^XOR+XOR.ts";

export const cloud = (o: {
  geom: string; N: number; warm: number; T: number; seed: number;
  source: boolean; period: number; dwell: number; axis?: number[];
  emission?: "isotropic" | "sheet"; turning?: number;
}) => {
  const g: any = (GEOMETRIES as any)[o.geom];
  const C = (o.N - 1) / 2;
  const w: any = new World({ theory: G_XOR_XOR, geometry: g, N: o.N, seed: o.seed,
    boundary: "absorb", slotUniformRng: true } as any);
  w.world.turnLog = [];
  if (o.source) w.add({ at: [C, C, C].slice(0, g.D), radius: 1, emits: 1,
    period: o.period, dwellTicks: o.dwell, axis: o.axis, absorbs: true,
    emission: o.emission ?? "isotropic", turning: o.turning ?? 0 } as any);

  for (let t = 0; t < o.warm; t++) w.tick();

  const turn = new Map<string, number>(), busy = new Map<string, number>();
  for (let t = 0; t < o.T; t++) {
    w.tick();
    for (const l of w.locals) {
      const at = w.embedding.at(l as any); if (!at) continue;
      let most = 0, act = 0;
      for (const r of (l as any).rays) {
        if (!r.active) continue;
        act++; most = Math.max(most, r.turned ?? 0);
      }
      if (!act) continue;
      const k = `${at[0]-C},${at[1]-C},${at[2]-C}`;
      busy.set(k, (busy.get(k) ?? 0) + act);
      if (most > 0) turn.set(k, (turn.get(k) ?? 0) + most);
    }
  }
  return { turn, busy, g, C };
};

if (process.argv[1].endsWith("cloud2.ts")) {
  const N = 21, warm = 10, T = 30;
  for (const source of [false, true]) {
    const { turn, busy } = cloud({ geom: "cubic-6", N, warm, T, seed: 1,
      source, period: 4, dwell: 2 });
    const tr = new Map<number, number>(), bs = new Map<number, number>(), cc = new Map<number, number>();
    for (const [k, v] of busy) {
      const p = k.split(",").map(Number);
      const rad = Math.round(Math.hypot(...p));
      bs.set(rad, (bs.get(rad) ?? 0) + v);
      tr.set(rad, (tr.get(rad) ?? 0) + (turn.get(k) ?? 0));
      cc.set(rad, (cc.get(rad) ?? 0) + 1);
    }
    console.log(`\nsource=${source}   (cubic-6 N=${N} warm=${warm} T=${T}, real vacuum)`);
    console.log("  r  cells   busy/cell  turn/cell  turn/busy");
    for (let rad = 0; rad <= 10; rad++) {
      const c = cc.get(rad); if (!c) continue;
      const b = bs.get(rad)!, t = tr.get(rad) ?? 0;
      console.log(String(rad).padStart(3), String(c).padStart(6),
        (b/c).toFixed(2).padStart(11), (t/c).toFixed(2).padStart(10),
        (t/b).toFixed(4).padStart(11));
    }
  }
}
