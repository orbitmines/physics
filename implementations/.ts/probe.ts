import { G_XOR } from "./src/theories/G^XOR.ts";
import { G_XOR_2 } from "./src/theories/G^XOR*2.ts";
import { withRelaxation } from "./src/theories/G.ts";
import { Graph } from "./src/backends/CPU.graph.ts";
import { GEOMETRIES, outward } from "./src/lib/Local.ts";

const g = GEOMETRIES["fcc-12"], BOUND = 3_000_000;
const build = (theory: any, N: number, opts: any = {}) => {
  const backend = g.seed(new Graph(theory, 1, BOUND, g.DEG * 2, true, true, true, true), N);
  return theory.seed({ N, seed: 1, geometry: g, bound: BOUND, backend, ...opts });
};

/* ── §2 winding: do cycles appear on a live substrate ── */
console.log("═══ §2 cycles and charge on a LIVE substrate ═══");
type P = { V: number; E: number; b1: number; Q: number };
const survey = (two: any) => {
  const b: any = two.backend;
  const out = new Map<number, P>();
  for (const l of b as Iterable<any>) {
    const p = out.get(l.part) ?? { V: 0, E: 0, b1: 0, Q: 0 };
    p.V++;
    for (const r of l.rays) {
      if (r.active) p.Q += r.polarity ?? 0;
      const there: any = outward(r)?.target?.source?.l;
      if (there && b.parent(there) === undefined && there.part === l.part) p.E++;
    }
    out.set(l.part, p);
  }
  for (const p of out.values()) { p.E /= 2; p.b1 = p.E - p.V + 1; }
  return out;
};
for (const [above, chance] of [[4, 0.5], [2, 1]] as const) {
  const w: any = build(withRelaxation(G_XOR_2, { above, chance }), 9, { interior: 1, escape: 0 });
  const two: any = w.layers.MATTER;
  console.log(`\n  above=${above} chance=${chance}`);
  console.log("     t   parts  cyclic %cyc  sumb1 maxb1 | Qspectrum(nonzero)   corr|Q|~b1  corr|Q|~V");
  for (let t = 1; t <= 60; t++) {
    w.tick();
    if (t % 15) continue;
    const s = survey(two);
    const vs = [...s.values()];
    const cyc = vs.filter(p => p.b1 > 0);
    const hist = new Map<number, number>();
    for (const p of vs) if (p.Q !== 0) hist.set(p.Q, (hist.get(p.Q) ?? 0) + 1);
    const multi = vs.filter(p => p.V > 1);
    const corr = (f: (p: P) => number) => {
      const x = multi.map(p => Math.abs(p.Q)), y = multi.map(f);
      if (x.length < 3) return NaN;
      const mx = x.reduce((a, c) => a + c, 0) / x.length, my = y.reduce((a, c) => a + c, 0) / y.length;
      let sxy = 0, sxx = 0, syy = 0;
      for (let i = 0; i < x.length; i++) { const a = x[i] - mx, b2 = y[i] - my; sxy += a * b2; sxx += a * a; syy += b2 * b2; }
      return sxy / Math.sqrt(sxx * syy || 1);
    };
    const spec = [...hist.entries()].sort((a, c) => a[0] - c[0]).slice(0, 8).map(([q, n]) => `${q}:${n}`).join(" ");
    console.log(`${String(t).padStart(6)} ${String(s.size).padStart(7)} ${String(cyc.length).padStart(7)}` +
      ` ${(100 * cyc.length / s.size).toFixed(1).padStart(4)}` +
      ` ${String(vs.reduce((a, p) => a + Math.max(0, p.b1), 0)).padStart(6)}` +
      ` ${String(Math.max(0, ...vs.map(p => p.b1))).padStart(5)} | ${spec.padEnd(34)}` +
      ` ${corr(p => p.b1).toFixed(3).padStart(6)} ${corr(p => p.V).toFixed(3).padStart(10)}`);
  }
}

/* ── §3 does `above` set the fill AND the mean free path ── */
console.log("\n═══ §3 does `above` fix density and range together ═══");
console.log("  above | fill(settled)  meanFreePath=1/fill  measured λ (annih per active ray)");
for (const above of [1, 2, 3, 4, 6, 8]) {
  const w: any = build(withRelaxation(G_XOR, { above, chance: 1 }), 11);
  const b: any = w.backend;
  for (let t = 0; t < 60; t++) w.tick();
  const fills: number[] = [], lam: number[] = [];
  let pa = 0;
  for (let t = 0; t < 20; t++) {
    pa = b.stats.annihilations;
    w.tick();
    let rays = 0, act = 0;
    for (const l of b as Iterable<any>) for (const r of l.rays) { rays++; if (r.active) act++; }
    fills.push(act / Math.max(rays, 1));
    /* a ray survives 1/(per-ray annihilation rate) steps: that IS the mean free path */
    const da = b.stats.annihilations - pa;
    if (act > 0 && da > 0) lam.push(act / (2 * da));
  }
  const mean = (a: number[]) => a.reduce((x, y) => x + y, 0) / Math.max(a.length, 1);
  const f = mean(fills);
  console.log(`  ${String(above).padStart(5)} | ${f.toFixed(4).padStart(12)}` +
    ` ${(1 / f).toFixed(2).padStart(19)} ${mean(lam).toFixed(2).padStart(33)}`);
}
