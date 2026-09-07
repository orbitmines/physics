/**
 * m IS IN THE CURRENT, NOT IN THE DENSITY - which is why the harmonics found nothing.
 *
 * A RUNNING ORBITAL HAS AN AXIALLY SYMMETRIC DENSITY. |e^{i m phi}|^2 = 1, so |psi|^2 has
 * NO azimuthal structure whatever m is, and an azimuthal harmonic of a density is the one
 * quantity that provably cannot carry it. The earlier sweep came back at the lattice's own
 * artifact level (a2 ~ 0.03 present even at turning = 0) because there was nothing there to
 * find. Tightening the bins would not have changed that.
 *
 * WHAT DOES CARRY m IS THE CIRCULATION. The phase winding is a FLUX: carriers go round the
 * axis, and the net azimuthal current is what distinguishes m = +1 from m = -1 from m = 0,
 * all three of which have the same density. So what is summed here is
 *
 *     J = < d_hat . phi_hat >        over turning events, about `ringAxis`
 *
 * where `phi_hat = n x p_hat` is the way round at that point and `d_hat` is the exit the
 * turn put the carrier onto. `steer` logs both the local and the outgoing exit, so this is
 * read off the turn itself rather than reconstructed.
 *
 * AND THE DENSITY IS RE-READ BESIDE IT with bins tied to CYCLE, so the axis offset is a
 * whole number of bins and the aliasing that contaminated fcc-12 cannot occur - it is the
 * control on the claim that the density is flat, rather than a second attempt to find m in
 * it. A no-source run gives the baseline that gets subtracted from both.
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
  const BINS = g.CYCLE * 2;                      // commensurate: the offset is whole bins
  let tmp = Math.abs(n[0]) < 0.9 ? [1,0,0] : [0,1,0];
  const e1 = unit(cross(n, tmp)), e2 = cross(n, e1);

  let J = 0, events = 0;
  const dens = new Array(BINS).fill(0);
  for (let t = 0; t < o.T; t++) {
    w.tick();
    const log = w.world.turnLog;
    for (let i = 0; i < log.length; i += 6) {
      const l = log[i], d2 = log[i + 2];
      const at = l && w.embedding.at(l); if (!at) continue;
      const p = [at[0]-C, at[1]-C, (at[2] ?? C)-C];
      const rr = Math.hypot(...p);
      if (rr < 0.5 || rr > 3.5) continue;
      const ph = unit(cross(n, unit(p)));         // the way round, here
      const u = g.U[d2];
      if (u) { J += dot(unit(u as number[]), ph); events++; }
      let a = Math.atan2(dot(p, e2), dot(p, e1));
      a = ((a % (2*Math.PI)) + 2*Math.PI) % (2*Math.PI);
      dens[Math.min(BINS-1, Math.floor(a / (2*Math.PI) * BINS))]++;
    }
    log.length = 0;
  }
  return { J: events ? J / events : 0, events, dens };
};

const harm = (f: number[], m: number) => {
  const mean = f.reduce((a,b)=>a+b,0) / f.length;
  let re = 0, im = 0;
  f.forEach((v, i) => { const th = 2*Math.PI*i/f.length;
    re += v*Math.cos(m*th); im += v*Math.sin(m*th); });
  return 2*Math.hypot(re, im)/f.length/(mean || 1);
};

const SEEDS = 5;
for (const geom of ["icosahedral-12", "fcc-12"]) {
  const g: any = (GEOMETRIES as any)[geom];
  console.log(`\n${geom}  CYCLE=${g.CYCLE}  bins=${g.CYCLE*2}  (${SEEDS} seeds)`);
  console.log("config             J_azimuthal +/- sem      density a1    a2");
  const rows: [string, boolean, number][] = [
    ["no source", false, 0], ["turning=0", true, 0], ["turning=1", true, 1],
    ["turning=2", true, 2], ["turning=3", true, 3],
  ];
  for (const [label, source, turning] of rows) {
    const Js: number[] = []; const acc = new Array(g.CYCLE*2).fill(0);
    for (let seed = 1; seed <= SEEDS; seed++) {
      const r = run({ geom, N: 15, warm: 8, T: 40, seed, turning, source });
      Js.push(r.J); r.dens.forEach((v, i) => acc[i] += v);
    }
    const mean = Js.reduce((a,b)=>a+b,0)/Js.length;
    const sd = Math.sqrt(Js.reduce((a,b)=>a+(b-mean)**2,0)/Math.max(1,Js.length-1));
    console.log(label.padEnd(18),
      (mean>=0?"+":"") + mean.toFixed(4), "+/-", (sd/Math.sqrt(Js.length)).toFixed(4),
      "     ", harm(acc,1).toFixed(4), harm(acc,2).toFixed(4));
  }
}
