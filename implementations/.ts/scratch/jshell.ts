/**
 * THE CIRCULATION, READ WHERE THE SOURCE ACTUALLY REACHES - and the last measurement
 * diluted it away.
 *
 * `J` came back zero at every rotation rate, pooled over 0.5 < r <= 3.5. But the source's
 * influence on this vacuum is at r = 1 and nowhere else: turning events per cell went 71 ->
 * 102 at r=1 with a rotating source and stayed flat at 70-72 from r=2 out. So roughly nine
 * events in ten in that pool came from cells the source does not touch, and any circulation
 * at r=1 was averaged against the vacuum's own noise.
 *
 * SO IT IS READ PER SHELL, with the no-source run beside it as the baseline that the
 * lattice's own bias (if it has one) shows up in. Nothing is imposed and CREATION is on -
 * this is `G^XOR+XOR`'s own dynamics, which is where the recovery has to come from.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_XOR } from "../src/theories/G^XOR+XOR.ts";

const dot = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * (b[i] ?? 0), 0);
const unit = (v: number[]) => { const m = Math.hypot(...v); return m ? v.map(x => x / m) : v; };
const cross = (a: number[], b: number[]) => [
  a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];

const run = (o: { geom: string; N: number; warm: number; T: number; seed: number;
  turning: number; source: boolean }) => {
  const g: any = (GEOMETRIES as any)[o.geom];
  const C = (o.N - 1) / 2;
  const w: any = new World({ theory: G_XOR_XOR, geometry: g, N: o.N, seed: o.seed,
    boundary: "absorb", slotUniformRng: true } as any);
  w.world.turnLog = [];
  if (o.source) w.add({ at: [C,C,C], radius: 1, emits: 1, period: 1, dwellTicks: 1,
    axis: [0,0,1], emission: "sheet", turning: o.turning, absorbs: true } as any);
  for (let t = 0; t < o.warm; t++) { w.tick(); w.world.turnLog.length = 0; }

  const n = unit(g.ringAxis as number[]);
  const J = new Map<number, number>(), cnt = new Map<number, number>();
  for (let t = 0; t < o.T; t++) {
    w.tick();
    const log = w.world.turnLog;
    for (let i = 0; i < log.length; i += 6) {
      const l = log[i], d2 = log[i + 2];
      const at = l && w.embedding.at(l); if (!at) continue;
      const p = [at[0]-C, at[1]-C, (at[2] ?? C)-C];
      const rr = Math.hypot(...p);
      if (rr < 0.5 || rr > 4.5) continue;
      const k = Math.round(rr);
      const u = g.U[d2]; if (!u) continue;
      const ph = unit(cross(n, unit(p)));
      J.set(k, (J.get(k) ?? 0) + dot(unit(u as number[]), ph));
      cnt.set(k, (cnt.get(k) ?? 0) + 1);
    }
    log.length = 0;
  }
  return { J, cnt };
};

const SEEDS = 6;
for (const geom of ["icosahedral-12", "fcc-12"]) {
  console.log(`\n${geom} — J per shell (mean +/- sem over ${SEEDS} seeds), G^XOR+XOR real vacuum`);
  console.log("config          " + [1,2,3,4].map(r=>`r=${r}`.padStart(18)).join(""));
  for (const [label, source, turning] of [
    ["no source", false, 0], ["turning=0", true, 0], ["turning=1", true, 1],
    ["turning=2", true, 2], ["turning=3", true, 3],
  ] as any[]) {
    const per: Record<number, number[]> = { 1: [], 2: [], 3: [], 4: [] };
    for (let seed = 1; seed <= SEEDS; seed++) {
      const r = run({ geom, N: 15, warm: 8, T: 40, seed, turning, source });
      for (const k of [1,2,3,4]) {
        const c = r.cnt.get(k) ?? 0;
        if (c) per[k].push((r.J.get(k) ?? 0) / c);
      }
    }
    const cells = [1,2,3,4].map(k => {
      const xs = per[k]; if (!xs.length) return "-".padStart(18);
      const m = xs.reduce((a,b)=>a+b,0)/xs.length;
      const sd = Math.sqrt(xs.reduce((a,b)=>a+(b-m)**2,0)/Math.max(1,xs.length-1));
      const sem = sd/Math.sqrt(xs.length);
      const sig = Math.abs(sem) > 1e-12 ? Math.abs(m)/sem : 0;
      return `${(m>=0?"+":"")}${m.toFixed(4)}±${sem.toFixed(4)}${sig>=2?"*":" "}`.padStart(18);
    });
    console.log(label.padEnd(15) + cells.join(""));
  }
}
console.log("\n  * = at least 2 sigma from zero");
