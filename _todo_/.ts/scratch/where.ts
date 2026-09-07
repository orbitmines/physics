/**
 * WHERE DO CARRIERS ACTUALLY TURN UP? - the cloud as an ENSEMBLE, with nothing asked to
 * survive a lap.
 *
 * WHY THIS IS THE RIGHT QUESTION AND CLOSURE WAS NOT. An orbital is not an orbit. The
 * measured hazard is flat along `turned` - each ring step is a coin flip at the vacuum's own
 * occupancy - so lap rate is (1/2)^CYCLE and a bound state read as "one ray goes all the way
 * round" is exponentially rare by construction. But `lib/Trajectory.ts` already says the
 * aggregate reading is the one a lattice this dense supports: "a REGION can be persistently
 * full of turning without any single ray going all the way round". A cloud is made of MANY
 * short-lived carriers, and where it is bright is where turning HAPPENS - not where any one
 * of them persists.
 *
 * SO WHAT IS COUNTED IS TURNING EVENTS, IN SPACE. `steer` logs every ring step it takes to
 * `w.turnLog` as (local, from, to, fieldExit, netP, netQ), which is the only place that
 * knows where a turn happened. The vacuum's own charges supply the population - (G+M/2)
 * makes them everywhere - so nothing has to be injected and no carrier has to be followed.
 *
 * AND IT IS READ IN THE CO-ROTATING FRAME, against `axisAt(t)`, because a source whose axis
 * comes round has lobes that sweep, and a fixed frame averages them away - measured earlier
 * as a dipole that vanishes at every turning rate in z and survives at every rate in axisAt.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_XOR } from "../src/theories/G^XOR+XOR.ts";
import { axisAt } from "../src/lib/Source.ts";

const dot = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * (b[i] ?? 0), 0);
const unit = (v: number[]) => { const m = Math.hypot(...v); return m ? v.map(x => x / m) : v; };

const where = (o: { geom: string; N: number; warm: number; T: number; seed: number;
  source: boolean; turning: number; period: number }) => {
  const g: any = (GEOMETRIES as any)[o.geom];
  const C = (o.N - 1) / 2;
  const w: any = new World({ theory: G_XOR_XOR, geometry: g, N: o.N, seed: o.seed,
    boundary: "absorb", slotUniformRng: true } as any);
  w.world.turnLog = [];
  let s: any = null;
  if (o.source) s = w.add({ at: [C,C,C].slice(0, g.D), radius: 1, emits: 1,
    period: o.period, dwellTicks: Math.max(1, o.period >> 1), axis: [0,0,1],
    emission: "sheet", turning: o.turning, absorbs: true } as any);
  for (let t = 0; t < o.warm; t++) { w.tick(); w.world.turnLog.length = 0; }

  /* turning events, binned by radius and by angle to the axis AS IT IS ON THAT TICK */
  const rad = new Map<number, number>(), ang = new Map<string, number>();
  let total = 0;
  for (let t = 0; t < o.T; t++) {
    w.tick();
    const log = w.world.turnLog;
    const ax = unit((s ? axisAt(g, s, w.world.ticks) : [0,0,1]) as number[]);
    for (let i = 0; i < log.length; i += 6) {
      const l = log[i];
      const at = l && w.embedding.at(l); if (!at) continue;
      const p = [at[0]-C, at[1]-C, (at[2] ?? C)-C];
      const rr = Math.hypot(...p);
      if (rr < 0.5 || rr > 6.5) continue;
      const k = Math.round(rr);
      rad.set(k, (rad.get(k) ?? 0) + 1);
      if (rr <= 3.5) {
        const c = dot(unit(p), ax);
        const band = Math.abs(c) < 0.34 ? "equator" : Math.abs(c) < 0.8
          ? (c > 0 ? "mid+" : "mid-") : (c > 0 ? "pole+" : "pole-");
        ang.set(band, (ang.get(band) ?? 0) + 1);
      }
      total++;
    }
    log.length = 0;
  }
  /* cells per shell, so a density is per cell and not per shell's size */
  const cells = new Map<number, number>();
  for (const l of w.locals) {
    const at = w.embedding.at(l as any); if (!at) continue;
    const rr = Math.hypot(at[0]-C, at[1]-C, (at[2] ?? C)-C);
    if (rr < 0.5 || rr > 6.5) continue;
    cells.set(Math.round(rr), (cells.get(Math.round(rr)) ?? 0) + 1);
  }
  return { rad, ang, cells, total };
};

const N = 15, warm = 8, T = 40, geom = "icosahedral-12";
console.log(`${geom}, real vacuum — TURNING EVENTS per cell, by shell (3 seeds pooled)`);
for (const [label, source, turning] of [
  ["no source (control)", false, 0], ["source, turning=0", true, 0],
  ["source, turning=1", true, 1], ["source, turning=2", true, 2],
] as any[]) {
  const rad = new Map<number, number>(), ang = new Map<string, number>();
  let cells = new Map<number, number>();
  for (let seed = 1; seed <= 3; seed++) {
    const r = where({ geom, N, warm, T, seed, source, turning, period: 1 });
    for (const [k, v] of r.rad) rad.set(k, (rad.get(k) ?? 0) + v);
    for (const [k, v] of r.ang) ang.set(k, (ang.get(k) ?? 0) + v);
    cells = r.cells;
  }
  const shells = [...rad.keys()].sort((a,b)=>a-b)
    .map(k => `r${k}=${(rad.get(k)!/(cells.get(k) ?? 1)/3).toFixed(1)}`);
  const bands = ["pole+","mid+","equator","mid-","pole-"]
    .map(b => `${b}=${((ang.get(b) ?? 0)/3).toFixed(0)}`);
  console.log("\n " + label);
  console.log("   shells:", shells.join("  "));
  console.log("   bands :", bands.join("  "));
}
