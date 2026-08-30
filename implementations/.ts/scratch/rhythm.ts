/**
 * IS THE SPACING THE LATTICE'S OWN? - the control the node test needs.
 *
 * 2s and 3s were handed DIFFERENT schedules and both came back with sign changes at r = 4
 * and 8, ratio 2.000, where 3s wants 3.732 and 2s wants one node only. That reads as the
 * vacuum imposing a fixed radial rhythm rather than carrying the shape it was handed - but
 * "reads as" is not a measurement. If it is the lattice's own, then a source with NO pulse
 * at all, and one held at a constant sign, must show the SAME 4 and 8; if those are flat
 * and only the pulsed ones ring, the rhythm is coming from the pulse after all and the
 * spacing is being set by something else in it.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_XOR } from "../src/theories/G^XOR+XOR.ts";

const GEOM = "fcc-12", N = 25, C = 12, WARM = 10, TICKS = 150, SEEDS = 4;

const profile = (pulse: any, src: boolean, seed: number) => {
  const g: any = (GEOMETRIES as any)[GEOM];
  const w: any = new World({ theory: G_XOR_XOR, geometry: g, N, seed,
    boundary: "absorb", slotUniformRng: true } as any);
  w.world.turnLog = [];
  if (src) w.add({ at: [C,C,C], radius: 1, emits: 1, period: 1, dwellTicks: 1,
    ...(pulse ? { pulse } : {}), absorbs: true } as any);
  for (let t = 0; t < WARM; t++) w.tick();
  const q = new Float64Array(13), n = new Float64Array(13);
  for (let t = 0; t < TICKS; t++) {
    w.tick();
    for (const l of w.locals) {
      const at = w.embedding.at(l as any); if (!at) continue;
      const r = Math.round(Math.hypot(at[0]-C, at[1]-C, at[2]-C));
      if (r < 1 || r > 12) continue;
      let v = 0;
      for (const ry of (l as any).rays) if (ry.active) v += ry.charge ?? 0;
      q[r] += v; n[r]++;
    }
    w.world.turnLog.length = 0;
  }
  return Array.from(q, (v, i) => n[i] ? v/n[i] : 0);
};

const CASES: [string, any][] = [
  ["no pulse (plain, flips every tick)", null],
  ["constant +1, never flips", { sign: [1], duty: [1] }],
  ["constant +1, half duty", { sign: [1], duty: [0.5] }],
  ["square wave, period 6", { sign: [1,1,1,-1,-1,-1], duty: [1,1,1,1,1,1] }],
  ["square wave, period 10", { sign: [1,1,1,1,1,-1,-1,-1,-1,-1],
    duty: [1,1,1,1,1,1,1,1,1,1] }],
];

console.log(`${GEOM} N=${N} — charge per cell, source minus control, ${SEEDS} seeds`);
console.log("if the spacing is the LATTICE's, every row changes sign at the same radii\n");
for (const [name, pulse] of CASES) {
  const rows: number[][] = [];
  for (let s = 1; s <= SEEDS; s++) {
    const a = profile(pulse, true, s), b = profile(pulse, false, s);
    rows.push(a.map((v, i) => v - b[i]));
  }
  const mean = (i: number) => rows.reduce((x, r) => x + r[i], 0)/rows.length;
  const signs: string[] = [];
  const flips: number[] = [];
  let prev = 0;
  for (let r = 1; r <= 12; r++) {
    const m = mean(r), s = Math.sign(m);
    signs.push(m >= 0 ? "+" : "-");
    if (prev && s !== prev) flips.push(r);
    prev = s;
  }
  console.log(`  ${name.padEnd(36)} ${signs.join("")}   flips at r = ${flips.join(", ") || "none"}` +
    (flips.length > 1 ? `   ratio ${(flips[1]/flips[0]).toFixed(3)}` : ""));
}
