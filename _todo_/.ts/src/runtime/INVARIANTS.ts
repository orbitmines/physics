/**
 * THE BACKEND'S OWN INVARIANTS — what has to be true of the store after any rewrite,
 * checked against a world that has actually been rewritten rather than a fresh one.
 */
import { GEOMETRIES, inward, opposite, outward } from "../lib/Local.ts";
import { World } from "../lib/Compat.ts";
import { G_XOR } from "../theories/G^XOR.ts";
import { Graph } from "../backends/CPU.graph.ts";

/*
 * RUN ON EVERY LATTICE, AND ON A WORLD THAT HAS BEEN REWRITTEN.
 *
 * A fresh world satisfies all of this trivially; what breaks it is annihilation and
 * folding, which is why this ticks. It found a real one: a fold contains a LOCAL in a
 * local, and that list shared its head with the local's RAY list, so the two silently
 * ate each other and a ray stopped belonging to the point holding it.
 */
const LATTICES = ["line-2", "square-4", "cubic-6", "bcc-8", "fcc-12", "cubic-26"];
let bad = 0;
for (const name of LATTICES) {
const g = GEOMETRIES[name], N = g.D === 1 ? 9 : g.D === 2 ? 7 : 5;
const backend = g.seed(new Graph(G_XOR, 3, N ** g.D, g.DEG * 2, true, true, true), N);
const w: any = G_XOR.seed({ geometry: g, N, seed: 3, backend });

const fail: string[] = [];
const check = (name: string, ok: boolean) => { if (!ok) fail.push(name); };

for (let t = 0; t <= 12; t++) {
  const locals = [...w.backend];
  for (const l of locals) {
    /* every ray a local holds says that local is its own */
    for (const r of l.rays) {
      check(`t${t} ray.l points back`, r.l === l);
      /* a ray has exactly two ends, in order: leaving, then facing back */
      check(`t${t} ray has two ends`, r.boundaries.length === 2);
      for (const b of r.boundaries) check(`t${t} boundary.source points back`, b.source === r);
      /* a link is symmetric — if it faces something, that thing faces it */
      for (const b of r.boundaries)
        if (b.target) check(`t${t} link is symmetric`, b.target.target === b);
      /* the two ends are told apart structurally, and OPP is an involution */
      const o = opposite(r);
      if (o) check(`t${t} opposite is its own inverse`, opposite(o) === r);
      if (o) check(`t${t} opposite is at the same local`, o.l === l);
      const out = outward(r), inn = inward(r);
      if (out) check(`t${t} outward leaves`, out.target.source.l !== l);
      if (inn) check(`t${t} inward stays`, inn.target.source.l === l);
    }
    /* DEG counts ways out that lead somewhere */
    const byHand = l.rays.reduce((n: number, r: any) =>
      n + r.boundaries.filter((b: any) => b.target !== undefined).length, 0);
    check(`t${t} DEG agrees with a count`, l.DEG === byHand);
    /* a local that is iterated is not folded into another */
    check(`t${t} iterated locals are free`, w.backend.parent?.(l) === undefined);
  }
  /* a flyweight is the SAME object for the same index — rules compare by identity */
  if (locals.length) {
    const a = locals[0], again = [...w.backend][0];
    check(`t${t} flyweights are stable`, a === again);
    check(`t${t} rays are stable`, a.rays[0] === again.rays[0]);
  }
  w.tick();
}

const seen = [...new Set(fail)];
bad += seen.length;
console.log(seen.length
  ? `  ${name.padEnd(10)} ${fail.length} FAILURES\n    ${seen.slice(0, 6).join("\n    ")}`
  : `  ${name.padEnd(10)} held · ${w.backend.size()} locals · ` +
    `${w.backend.stats.annihilations} annihilations · ${w.backend.stats.folded} folds`);
}
console.log(bad ? `\n  ${bad} invariants broken\n` : "\n  every invariant held on every lattice\n");
process.exit(bad ? 1 : 0);
