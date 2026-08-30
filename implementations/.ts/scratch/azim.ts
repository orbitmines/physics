/**
 * THE AZIMUTH, WHICH IS WHERE m LIVES - and the polar binning could never have seen it.
 *
 * The turning-event cloud came out peaked at mid-latitudes and depleted at both pole and
 * equator, which is an l-type shape, and it was the SAME at turning = 1 and 2. That is what
 * binning by POLAR angle alone must give: m is a winding in the AZIMUTH, and a profile that
 * has been summed over azimuth has integrated it away.
 *
 * SO THE AZIMUTH IS TAKEN ABOUT `ringAxis` - the axis the source's own axis rotates AROUND,
 * which is the quantization axis here - and measured RELATIVE to where the source's axis is
 * pointing on that tick. In that frame a cloud that follows the axis rigidly is static, so
 * its harmonics stand up; in the lab frame the same cloud sweeps and averages flat. Both are
 * reported, because the difference between them IS the claim.
 *
 * EXPOSURE IS COUNTED, NOT ASSUMED. Which cells fall in which azimuthal bin changes tick by
 * tick as the frame turns, so the cells in each bin are counted every tick alongside the
 * events and the density is events per cell-tick. Binning without that measures the
 * lattice's own azimuthal lumpiness instead of the cloud's.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_XOR } from "../src/theories/G^XOR+XOR.ts";
import { axisAt } from "../src/lib/Source.ts";

const dot = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * (b[i] ?? 0), 0);
const unit = (v: number[]) => { const m = Math.hypot(...v); return m ? v.map(x => x / m) : v; };
const cross = (a: number[], b: number[]) => [
  a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];

const BINS = 12;

const run = (o: { geom: string; N: number; warm: number; T: number; seed: number;
  turning: number; period: number; coRotating: boolean }) => {
  const g: any = (GEOMETRIES as any)[o.geom];
  const C = (o.N - 1) / 2;
  const w: any = new World({ theory: G_XOR_XOR, geometry: g, N: o.N, seed: o.seed,
    boundary: "absorb", slotUniformRng: true } as any);
  w.world.turnLog = [];
  const s: any = w.add({ at: [C,C,C], radius: 1, emits: 1, period: o.period,
    dwellTicks: Math.max(1, o.period >> 1), axis: [0,0,1], emission: "sheet",
    turning: o.turning, absorbs: true } as any);
  for (let t = 0; t < o.warm; t++) { w.tick(); w.world.turnLog.length = 0; }

  /* an orthonormal frame perpendicular to the axis the source's axis turns ABOUT */
  const n = unit(g.ringAxis as number[]);
  let tmp = Math.abs(n[0]) < 0.9 ? [1,0,0] : [0,1,0];
  const e1 = unit(cross(n, tmp)), e2 = cross(n, e1);
  const phiOf = (p: number[]) => Math.atan2(dot(p, e2), dot(p, e1));

  /* the cells in the shells we read, cached once - the box does not change size here */
  const shell: { p: number[] }[] = [];
  for (const l of w.locals) {
    const at = w.embedding.at(l as any); if (!at) continue;
    const p = [at[0]-C, at[1]-C, (at[2] ?? C)-C];
    const rr = Math.hypot(...p);
    if (rr >= 0.5 && rr <= 3.5) shell.push({ p });
  }

  const ev = new Array(BINS).fill(0), exp = new Array(BINS).fill(0);
  for (let t = 0; t < o.T; t++) {
    w.tick();
    const a = unit((axisAt(g, s, w.world.ticks) ?? [0,0,1]) as number[]);
    const off = o.coRotating ? phiOf(a) : 0;
    const bin = (p: number[]) => {
      let d = phiOf(p) - off;
      d = ((d % (2*Math.PI)) + 2*Math.PI) % (2*Math.PI);
      return Math.min(BINS - 1, Math.floor(d / (2*Math.PI) * BINS));
    };
    for (const c of shell) exp[bin(c.p)]++;
    const log = w.world.turnLog;
    for (let i = 0; i < log.length; i += 6) {
      const l = log[i]; const at = l && w.embedding.at(l); if (!at) continue;
      const p = [at[0]-C, at[1]-C, (at[2] ?? C)-C];
      const rr = Math.hypot(...p);
      if (rr < 0.5 || rr > 3.5) continue;
      ev[bin(p)]++;
    }
    log.length = 0;
  }
  return ev.map((e, i) => exp[i] ? e / exp[i] : 0);
};

/** the first three azimuthal harmonics of a profile, as fractions of its mean */
const harmonics = (f: number[]) => {
  const mean = f.reduce((a,b)=>a+b,0) / f.length;
  return [1,2,3].map(m => {
    let re = 0, im = 0;
    f.forEach((v, i) => { const th = 2*Math.PI*i/f.length;
      re += v*Math.cos(m*th); im += v*Math.sin(m*th); });
    return 2*Math.hypot(re, im)/f.length/(mean || 1);
  });
};

for (const geom of ["icosahedral-12", "fcc-12"]) {
  const g: any = (GEOMETRIES as any)[geom];
  console.log(`\n${geom}  CYCLE=${g.CYCLE}  — azimuthal harmonics |a_m|/mean, 3 seeds pooled`);
  console.log("turning   frame          a1      a2      a3");
  for (const turning of [0, 1, 2, 3])
    for (const co of [true, false]) {
      const acc = new Array(BINS).fill(0);
      for (let seed = 1; seed <= 3; seed++) {
        const f = run({ geom, N: 15, warm: 8, T: 40, seed, turning, period: 1,
          coRotating: co });
        f.forEach((v, i) => acc[i] += v / 3);
      }
      const h = harmonics(acc);
      console.log(String(turning).padStart(7), " ", (co ? "co-rotating" : "lab       ").padEnd(13),
        h.map(x => x.toFixed(4).padStart(7)).join(" "));
    }
}
