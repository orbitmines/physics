/**
 * WHAT SURVIVES THE CANCELLING, BOTH BOOKS, ON THE REAL LATTICE.
 *
 * `residual` measures the net CHARGE left in a ball, because `gravity.electron` was written
 * about charge. If what a turn makes is POLARITY - mass - then the number that matters for a
 * mass is the polarity that survives, and it has never been measured. Both are taken here in
 * the same run, off the same rays, so the ratio is not an artefact of two different setups.
 *
 * RMS and not mean, for the reason `residual` gives: a signed quantity averaged over ticks in
 * a vacuum with no preferred sign measures the sampling, not the vacuum.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
/* the theories themselves - PROVE.ts keeps its registry private and runs the prover on import */
import { G_XOR_XOR } from "../src/theories/G^XOR+XOR.ts";
import { G_XOR_O } from "../src/theories/G^XOR^o.ts";
const THEORIES: Record<string, any> = { "G^XOR+XOR": G_XOR_XOR, "G^XOR^o": G_XOR_O };

const g: any = GEOMETRIES["fcc-12"];
const N = 15, C = (N - 1) / 2, RMAX = 4, WARM = 8, TICKS = 60, SEEDS = 3;
const want = (process.argv[2] ?? "G^XOR+XOR,G^XOR^o").split(",");

const rmsOf = (theory: any, seed: number) => {
  const w: any = new World({ theory, geometry: g, N, seed,
    boundary: "absorb", slotUniformRng: true } as any);
  /* ARM THE LOG. `steer` records a turn only where something is listening and `turnLog`
   * defaults to null, so a world that does not set it runs the vacuum and RADIATING is handed
   * an empty log every tick - which is how G^XOR^o came out bit-identical to G^XOR+XOR. */
  (w.world ?? w).turnLog = [];
  for (let t = 0; t < WARM; t++) w.tick();
  const perQ: number[] = [], perP: number[] = [];
  let grossQ = 0, grossP = 0;
  for (let t = 0; t < TICKS; t++) {
    w.tick();
    let netQ = 0, netP = 0;
    for (const l of w.locals) {
      const at = w.embedding.at(l as any); if (!at) continue;
      let d = 0;
      for (let i = 0; i < g.D; i++) d += (at[i] - C) ** 2;
      if (Math.sqrt(d) > RMAX) continue;
      for (const r of (l as any).rays) {
        if (!r.active) continue;
        const q = r.charge ?? 0, p = r.polarity ?? 0;
        netQ += q; grossQ += Math.abs(q);
        netP += p; grossP += Math.abs(p);
      }
    }
    perQ.push(netQ); perP.push(netP);
  }
  /*
   * AND WHAT THE LATTICE SAYS ABOUT THE BRAKE. The continuum form saturates at rho = 0.9956
   * under RADIATING, but its brake is a mean-field 1 - held that only shuts off when a seat is
   * genuinely full. The lattice's is binary - the seat is empty or it is not - and `saturated`
   * is the counter the theory put there to answer exactly this.
   */
  let carrying = 0, exits = 0;
  for (const l of w.locals) for (const r of (l as any).rays) { exits++; if (r.active) carrying++; }
  const rms = (a: number[]) => Math.sqrt(a.reduce((x, b) => x + b * b, 0) / a.length);
  return {
    q: grossQ ? rms(perQ) / (grossQ / TICKS) : 0,
    p: grossP ? rms(perP) / (grossP / TICKS) : 0,
    occ: exits ? carrying / exits : 0,
    sat: (w.saturated ?? 0) / Math.max(1, w.corners ?? 1),
  };
};

console.log("theory            f (charge)          f (polarity, = mass)     ratio P/Q   occupancy  saturated/corner");
for (const name of want) {
  const theory = (THEORIES as any)[name];
  if (!theory) { console.log(`${name.padEnd(16)}  -- not in THEORIES --`); continue; }
  const xs = [] as any[];
  for (let s = 1; s <= SEEDS; s++) xs.push(rmsOf(theory, s));
  const mean = (k: "q" | "p") => xs.reduce((a, b) => a + b[k], 0) / xs.length;
  const err = (k: "q" | "p") => {
    const m = mean(k);
    return Math.sqrt(xs.reduce((a, b) => a + (b[k] - m) ** 2, 0) / Math.max(1, xs.length - 1)) /
      Math.sqrt(xs.length);
  };
  console.log(`${name.padEnd(16)}  ${mean("q").toFixed(4)} +/- ${err("q").toFixed(4)}` +
    `      ${mean("p").toFixed(4)} +/- ${err("p").toFixed(4)}` +
    `        ${(mean("p") / (mean("q") || 1)).toFixed(2).padStart(8)}` +
    `   ${(xs.reduce((a, b) => a + b.occ, 0) / xs.length).toFixed(4)}` +
    `     ${(xs.reduce((a, b) => a + b.sat, 0) / xs.length).toFixed(4)}`);
}
