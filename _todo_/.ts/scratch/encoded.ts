/**
 * IS THE HARMONIC NOT THERE, OR IS IT PUT THERE AND THEN LOST? - which is a different question
 * from which lattice draws prettily, and the only one that says whether the continuum solver is
 * encoding these geometries faithfully.
 *
 * fcc-12 carries a 2p and icosahedral-12 carries nothing. That could be the model (those
 * lattices really cannot hold the shape) or it could be me (the solver mis-encodes them). The
 * two are told apart by WHEN the harmonic goes:
 *
 *   absent at emission        -> the ENCODING is wrong: `emit`, `ylm`, or the exit set
 *   present at emission, then
 *     decaying over ticks     -> the DYNAMICS: transport washes it out, which is physics
 *
 * So a single pulse is emitted with the 2p pattern and its angular content followed tick by
 * tick, on each geometry, with everything else held identical.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { emit, grid, step } from "../src/lib/Vlasov2.ts";
import { derive, occupancyOf, OCCUPANCY } from "./derived.ts";

const N = 29, C = (N - 1) >> 1, T = 14;
const GEOMS = ["fcc-12", "icosahedral-12", "cubic-18", "cubic-26"];

const P = (l: number, x: number): number => {
  if (l === 0) return 1;
  if (l === 1) return x;
  let pm = 1, p = x;
  for (let k = 2; k <= l; k++) { const pn = ((2*k-1)*x*p - (k-1)*pm)/k; pm = p; p = pn; }
  return p;
};

/* the density's angular content at radii the pulse has actually reached, normalised ring by
 * ring so the steep radial falloff does not make this a measurement of the innermost shell */
const c2 = (dens: Float64Array, rmin: number, rmax: number) => {
  const NB = Math.ceil(Math.hypot(C, C, C)) + 1;
  const rs = new Float64Array(NB), rc = new Float64Array(NB);
  for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) for (let z = 0; z < N; z++) {
    const r = Math.round(Math.hypot(x-C, y-C, z-C));
    if (r >= NB) continue;
    rs[r] += dens[(x*N+y)*N+z]; rc[r]++;
  }
  let num = 0, w = 0;
  for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) for (let z = 0; z < N; z++) {
    const rr = Math.hypot(x-C, y-C, z-C);
    if (rr < rmin || rr > rmax) continue;
    const r = Math.round(rr), mu = rc[r] ? rs[r]/rc[r] : 0;
    if (!(Math.abs(mu) > 1e-12)) continue;
    const u = (z - C) / rr;
    num += dens[(x*N+y)*N+z] / mu * P(2, u); w++;
  }
  return w ? num / w * 5 : 0;
};

console.log("one 2p pulse, then nothing - how much P2 the DENSITY carries, tick by tick");
console.log("(the pulse is followed outward: the window is the shell it has reached)\n");
console.log("geometry        DEG |L|   ring  ring<)   " +
  [1,2,3,4,6,8,11,14].map(t => `t=${t}`.padStart(8)).join(""));

for (const name of GEOMS) {
  const g: any = (GEOMETRIES as any)[name];
  const G = grid(g, N);
  for (const a of G.n) a.fill(occupancyOf(g) / 4);
  const RATES = derive(g);

  /* the exit set's own geometry, which is what the harmonic has to be written into */
  const L = (g.L ?? g.U) as number[][];
  const step1 = Math.hypot(...(L[0] as number[]).map(Number));
  let ang = 0, k = 0;
  for (let d = 0; d < g.DEG; d++) for (let q = 0; q < G.ringN[d]; q++) {
    const e = G.ring[d * g.DEG + q];
    const a = g.U[d] as number[], b = g.U[e] as number[];
    ang += Math.acos(Math.max(-1, Math.min(1, a[0]*b[0] + a[1]*b[1] + (a[2]??0)*(b[2]??0))));
    k++;
  }
  ang = ang / Math.max(1, k) * 180 / Math.PI;
  const ringSz = G.ringN[0];

  /* ONE pulse with the 2p pattern - amount |Y10|, polarity sign(Y10) */
  const y = (d: number) => {
    const u = g.U[d] as number[], mg = Math.hypot(u[0], u[1], u[2] ?? 0) || 1;
    return (u[2] ?? 0) / mg;
  };
  emit(G, { at: [C,C,C], radius: 1, exits: (d) => (Math.abs(y(d)) < 1e-9 ? 0 : (y(d) > 0 ? 1 : -1)),
    amountAt: (d) => Math.abs(y(d)) * 0.5, amount: 0.5 });

  const K = grid(g, N);
  for (const a of K.n) a.fill(occupancyOf(g) / 4);

  const out: string[] = [];
  const WANT = new Set([1,2,3,4,6,8,11,14]);
  for (let t = 1; t <= T; t++) {
    step(G, RATES); step(K, RATES);
    if (!WANT.has(t)) continue;
    const dens = new Float64Array(N*N*N);
    for (let c = 0; c < N*N*N; c++) {
      let v = 0;
      for (let s = 0; s < 4; s++) for (let d = 0; d < g.DEG; d++)
        v += G.n[s][c*g.DEG+d] - K.n[s][c*g.DEG+d];
      dens[c] = v;
    }
    /* the shell the pulse is in: it travels |L| cells a tick */
    const front = t * step1;
    out.push(c2(dens, Math.max(1.5, front - 2 * step1), front + step1).toFixed(3).padStart(8));
  }
  console.log(`${name.padEnd(16)}${String(g.DEG).padEnd(4)}${step1.toFixed(2).padEnd(6)}` +
    `${String(ringSz).padEnd(6)}${ang.toFixed(0).padStart(4)}deg  ` + out.join(""));
}
console.log("\na pulse that carries P2 at t=1 and loses it later was ENCODED and then washed out;");
console.log("one that never has it was never written into that lattice's exits at all.");
