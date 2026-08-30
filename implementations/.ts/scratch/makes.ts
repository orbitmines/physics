/**
 * WHAT A CORNER MAKES - POLARITY, CHARGE, OR BOTH - on the lattice, with the log armed.
 *
 * The proposal: mass is POLARITY made by turning, most of it cancels against itself, and what
 * survives is what an electron weighs. `G^XOR^q` already enumerates this - `makes` is one of
 * the four axes of a `Creation` and `withCreation` builds the variant - so this is the model's
 * own knob rather than one bolted onto the continuum solver.
 *
 * ARMED, which the first attempt was not. `steer` records a turn only where something is
 * listening and `turnLog` defaults to null, so an unarmed world hands RADIATING an empty log
 * every tick and `G^XOR^o` comes out bit-identical to `G^XOR+XOR` - the vacuum and nothing
 * else, reported as though it were a finding.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_O, laps } from "../src/theories/G^XOR^o.ts";
import { CURRENT, withCreation } from "../src/theories/G^XOR^q.ts";

const g: any = GEOMETRIES["fcc-12"];
const N = 15, C = (N - 1) / 2, RMAX = 4, WARM = 8, TICKS = 60, SEEDS = 3;

const one = (theory: any, seed: number) => {
  const w: any = new World({ theory, geometry: g, N, seed,
    boundary: "absorb", slotUniformRng: true } as any);
  const inner = w.world ?? w;
  inner.turnLog = [];
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
        netQ += r.charge ?? 0; grossQ += Math.abs(r.charge ?? 0);
        netP += r.polarity ?? 0; grossP += Math.abs(r.polarity ?? 0);
      }
    }
    perQ.push(netQ); perP.push(netP);
  }
  const rms = (a: number[]) => Math.sqrt(a.reduce((x, b) => x + b * b, 0) / a.length);
  /* MATTER, read the way this theory reads it: a ray that has been round once is an orbit */
  let closed = 0, carrying = 0, exits = 0;
  for (const l of w.locals) for (const r of (l as any).rays) {
    exits++; if (r.active) { carrying++; if (laps(r, g) >= 1) closed++; }
  }
  return {
    q: grossQ ? rms(perQ) / (grossQ / TICKS) : 0,
    p: grossP ? rms(perP) / (grossP / TICKS) : 0,
    occ: exits ? carrying / exits : 0,
    corners: inner.corners ?? 0, radiated: inner.radiated ?? 0,
    saturated: inner.saturated ?? 0, closed,
  };
};

console.log("makes      f(charge)        f(polarity)=mass  P/Q    occ     corners   radiated  saturated  closed");
for (const makes of ["both", "polarity", "charge"] as const) {
  const theory = withCreation(G_XOR_O as any, { ...CURRENT, makes });
  const xs: any[] = [];
  for (let s = 1; s <= SEEDS; s++) xs.push(one(theory, s));
  const m = (k: string) => xs.reduce((a, b) => a + b[k], 0) / xs.length;
  const e = (k: string) => {
    const mu = m(k);
    return Math.sqrt(xs.reduce((a, b) => a + (b[k] - mu) ** 2, 0) / Math.max(1, xs.length - 1)) /
      Math.sqrt(xs.length);
  };
  console.log(`${makes.padEnd(9)}  ${m("q").toFixed(4)}+/-${e("q").toFixed(4)}  ` +
    `${m("p").toFixed(4)}+/-${e("p").toFixed(4)}  ${(m("p") / (m("q") || 1)).toFixed(2).padStart(5)}` +
    `  ${m("occ").toFixed(4)}  ${m("corners").toFixed(0).padStart(8)}  ${m("radiated").toFixed(0).padStart(8)}` +
    `  ${m("saturated").toFixed(0).padStart(9)}  ${m("closed").toFixed(0)}`);
}
