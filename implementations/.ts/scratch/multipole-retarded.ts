/**
 * WHICH SETTINGS MAKE LOBES - searched by multipole content, not by looking.
 *
 * The rings came out because a ring is what an angle-POOLED picture can show. A lobe is the
 * part that pooling destroys: it lives in the ANGLE at each radius, and `shell = STEP·r^(D-1)`
 * - the falloff every derivation here has used - assumes the source radiates the same in
 * every direction, which an AXIAL source with a rotating sheet flatly does not. `half()`
 * gives it two poles and a null on its equator, so what arrives at a distance depends on
 * which way you look, and that anisotropy is the whole of what a lobe is.
 *
 * So the cloud is binned by (radius, angle) in the co-rotating frame and decomposed at each
 * radius into cos(k·theta):
 *
 *   k = 0   a ring - the same all the way round
 *   k = 1   a dipole - one lobe up, one down
 *   k = 2   a quadrupole - four lobes
 *   k = 3   six
 *
 * The winner for each k is the setting to draw. Nothing is imposed, CREATION is on, and the
 * control is the same vacuum with no source, binned in the same turning frame.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_XOR } from "../src/theories/G^XOR+XOR.ts";
import { axisAt } from "../src/lib/Source.ts";

const dot = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * (b[i] ?? 0), 0);
const unit = (v: number[]) => { const m = Math.hypot(...v); return m ? v.map(x => x / m) : v; };
const cross = (a: number[], b: number[]) => [
  a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];

const GEOM = "fcc-12", N = 17, RMAX = 5, ABINS = 16;
const WARM = 8, TICKS = 90, SEEDS = 3;

/** charge summed per (radius, angle) cell of the co-rotating rotation plane */
const run = (period: number, turning: number, axial: boolean, source: boolean, seed: number) => {
  const g: any = (GEOMETRIES as any)[GEOM];
  const C = (N - 1) / 2;
  const w: any = new World({ theory: G_XOR_XOR, geometry: g, N, seed,
    boundary: "absorb", slotUniformRng: true } as any);
  w.world.turnLog = [];
  if (source) w.add({ at: [C,C,C], radius: 1, emits: 1, period,
    dwellTicks: Math.max(1, period >> 1), axis: axial ? [0,0,1] : undefined,
    emission: axial ? "sheet" : "isotropic", turning, absorbs: true } as any);
  for (let t = 0; t < WARM; t++) { w.tick(); w.world.turnLog.length = 0; }
  const n = unit(g.ringAxis as number[]);
  const frame = { axis: [0,0,1], turning, period, phase: 0 };
  /*
   * DE-ROTATED BY THE RETARDED ANGLE, WHICH IS THE WHOLE CORRECTION.
   *
   * A ray leaves the source and streams outward one cell a tick, so what sits at radius r on
   * tick T was emitted on tick T-r: each shell is frozen at the orientation the axis had when
   * it left, and the cloud is a spiral written outward in TIME. De-rotating every shell by
   * the axis as it is NOW smears each one by however far the axis turned during the crossing,
   * and that smear is exactly what turns a lobe into a ring - a ring being the part that
   * survives it. So the frame is taken at T - r, per shell, and not at T.
   */
  const frameAt = (tick: number, r: number) => {
    let a = unit((axisAt(g, frame as any, tick - r) ?? [0,0,1]) as number[]);
    const al = dot(a, n); a = unit(a.map((x, i) => x - al * n[i]));
    return isFinite(a[0]) ? a : null;
  };
  const acc = new Float64Array((RMAX + 1) * ABINS);
  const exp = new Float64Array((RMAX + 1) * ABINS);
  for (let t = 0; t < TICKS; t++) {
    w.tick();
    for (const l of w.locals) {
      const at = w.embedding.at(l as any); if (!at) continue;
      const p = [at[0]-C, at[1]-C, at[2]-C];
      if (Math.abs(dot(p, n)) > 1) continue;
      const r0 = Math.round(Math.hypot(dot(p, [1,0,0]) * 0 + p[0], p[1], p[2]));
      const rr0 = Math.hypot(p[0], p[1], p[2]);
      const rr = Math.round(rr0);
      if (rr < 1 || rr > RMAX) continue;
      const a = frameAt(w.world.ticks, rr);          // the axis as it was when this left
      if (!a) continue;
      const e = unit(cross(n, a));
      const u = dot(p, a), v = dot(p, e);
      let th = Math.atan2(v, u); th = ((th % (2*Math.PI)) + 2*Math.PI) % (2*Math.PI);
      const b = Math.min(ABINS-1, Math.floor(th / (2*Math.PI) * ABINS));
      let q = 0;
      for (const ry of (l as any).rays) if (ry.active) q += ry.charge ?? 0;
      acc[rr * ABINS + b] += q;
      exp[rr * ABINS + b]++;
    }
    w.world.turnLog.length = 0;
  }
  return { acc, exp };
};

/** |cos(k.theta)| amplitude of the angular profile at each radius, averaged over radii */
const multipoles = (d: Float64Array, e: Float64Array) => {
  const out = [0, 0, 0, 0];
  let rows = 0;
  for (let r = 1; r <= RMAX; r++) {
    const f: number[] = [];
    for (let b = 0; b < ABINS; b++) {
      const k = r * ABINS + b;
      f.push(e[k] ? d[k] / e[k] : 0);
    }
    const mean = f.reduce((a, b) => a + b, 0) / ABINS;
    const norm = Math.sqrt(f.reduce((a, b) => a + (b - mean) ** 2, 0) / ABINS) || 1;
    for (let k = 0; k <= 3; k++) {
      let re = 0, im = 0;
      f.forEach((v, i) => { const th = 2*Math.PI*i/ABINS;
        re += (v - mean) * Math.cos(k*th); im += (v - mean) * Math.sin(k*th); });
      out[k] += 2 * Math.hypot(re, im) / ABINS / norm;
    }
    rows++;
  }
  return out.map(x => x / rows);
};

const rows: any[] = [];
for (const axial of [true, false])
  for (const period of [1, 2, 3, 4, 6, 8])
    for (const turning of [0, 1, 2, 3]) {
      const D = new Float64Array((RMAX+1)*ABINS), E = new Float64Array((RMAX+1)*ABINS);
      for (let s = 1; s <= SEEDS; s++) {
        const a = run(period, turning, axial, true, s);
        const b = run(period, turning, axial, false, s);
        for (let i = 0; i < D.length; i++) {
          const va = a.exp[i] ? a.acc[i]/a.exp[i] : 0;
          const vb = b.exp[i] ? b.acc[i]/b.exp[i] : 0;
          D[i] += va - vb; E[i] += 1;
        }
      }
      const m = multipoles(D, E);
      rows.push({ axial, period, turning, k0: m[0], k1: m[1], k2: m[2], k3: m[3] });
    }

console.log("axial period turning     k=0 ring    k=1 dipole   k=2 quad    k=3 six");
for (const r of rows)
  console.log(String(r.axial).padStart(5), String(r.period).padStart(6),
    String(r.turning).padStart(8), r.k0.toFixed(3).padStart(12),
    r.k1.toFixed(3).padStart(12), r.k2.toFixed(3).padStart(11), r.k3.toFixed(3).padStart(10));

for (const k of [1, 2, 3]) {
  const best = [...rows].sort((a, b) => b[`k${k}`] - a[`k${k}`]).slice(0, 3);
  console.log(`\nstrongest k=${k}:`, best.map(b =>
    `axial=${b.axial} period=${b.period} turning=${b.turning} (${b[`k${k}`].toFixed(3)})`).join("  |  "));
}
