/**
 * THE LATTICE-FREE MODEL SCORED BY THE SAME MEASURE AS THE LATTICES - `scratch/harmonics.ts`
 * for the ray tracer, sharing `expect.ts` so the comparison is not a comparison of two scripts.
 *
 * usage: npx tsx scratch/rays-harm.ts rays45
 */
import { existsSync, readFileSync } from "node:fs";
import { CHANNELS, expected, P, pct, score } from "./expect.ts";

const TAG = process.argv[2] ?? "rays45";
const dir = `/home/fadi/Desktop/orbitmines/physics/visuals/vacuum/${TAG}`;
const STATES = ["1,0,0","2,1,0","3,2,0","2,0,0","2,1,1","3,0,0","3,1,0","3,2,1",
                "4,0,0","4,1,0","4,2,1","4,3,2"];

console.log(`${TAG} - turning, projected on Legendre. The rays carry no lattice, so a row that`);
console.log(`is not flat is the STATE and cannot be the tiling.\n`);
console.log(`  state      P1       P2       P3       P4       P6   |  as a % of what |Y_lm|^2 puts there`);
console.log(`  ` + "-".repeat(96));

for (const st of STATES) {
  const [n, l, m] = st.split(",").map(Number);
  const mp = `${dir}/n${n}l${l}m${m}-meta.json`;
  if (!existsSync(mp)) continue;
  const meta = JSON.parse(readFileSync(mp, "utf8")) as { NR: number; NU: number; frame: number };
  const b = readFileSync(`${dir}/n${n}l${l}m${m}-turns.f32`);
  const f = Float64Array.from(new Float32Array(b.buffer, b.byteOffset, b.byteLength / 4));

  /* each radius against its own RMS, then averaged over the radii the cloud actually occupies -
   * the same normalisation `harmonics.ts` uses, for the same reason */
  const c = CHANNELS.map(L => {
    let num = 0, w = 0;
    for (let ir = 0; ir < meta.NR; ir++) {
      const r = (ir + 0.5) * meta.frame / meta.NR;
      if (r < 0.25 * meta.frame || r > meta.frame) continue;
      let ss = 0;
      for (let iu = 0; iu < meta.NU; iu++) ss += f[ir*meta.NU + iu] ** 2;
      const rms = Math.sqrt(ss / meta.NU);
      if (!(rms > 0)) continue;
      for (let iu = 0; iu < meta.NU; iu++) {
        const u = -1 + (iu + 0.5) * 2 / meta.NU;
        num += f[ir*meta.NU + iu] / rms * P(L, u); w++;
      }
    }
    return w ? num / w * (2*L + 1) : 0;
  });
  const e = expected(l, m), mark = score(c, e), pc = pct(c, e);
  console.log(`  ${st.padEnd(7)}` + c.map((v, i) => (v.toFixed(3) + mark[i]).padStart(9)).join("") +
    `  |  ` + pc.map(v => (Number.isNaN(v) ? "     -" : `${v.toFixed(0)}%`.padStart(6))).join(""));
}
