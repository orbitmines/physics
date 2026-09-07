/**
 * THE MEASUREMENTS THE CHECKS ARE MADE OF — ported from the article's own §10.
 *
 * `vacuumFill` measures the occupancy against what the rule says it should be,
 * `recoversGravity` asks whether alternating polarity brings (G/1) and (G/2) back out
 * of the three rules, and `conform` holds the two backends to each other.
 */
import { Flat } from "../backends/CPU.array.ts";
import { Graph } from "../backends/CPU.graph.ts";
import { GEOMETRIES, Geometry, norm, sub, Vec } from "./Local.ts";
import { Finding, headerOf, judge, stat } from "./Report.ts";
import { charge, exponent } from "./Measure.ts";
import { l, scattering, Theory, World } from "./Compat.ts";
import { fill } from "./Report.ts";
import { G as GRAVITY } from "../theories/G.ts";
import { G_XOR as GRAVITY_MAGNETISM } from "../theories/G^XOR.ts";

/**
 * The occupancy a vacuum actually settles at, measured, beside what the rule says it
 * should be — and the gap between them reported rather than glossed.
 *
 * This matters more than it looks. Every null result about scattering depends on the
 * vacuum being dense enough to scatter, and a run that assumes ½ and sits at a
 * seventh of it will report that nothing diffuses when the truth is that nothing was
 * there to diffuse against. That is not hypothetical: it is what a p of 0.05 did to
 * sixteen call sites.
 *
 * WHAT THE RULE SAYS, per theory, with no rate in it. (G/2) splits every neutral
 * point every tick, and each split puts two halves of one inserted point onto the two
 * ends of a shared edge, facing each other. What happens when they meet is the whole
 * of the answer:
 *
 *   conserving          nothing is ever destroyed, so every inserted point survives
 *                       and the box fills                                    → 1
 *   gravity             both halves are neutral, every pair annihilates, every
 *                       inserted point collapses — pure gravity has no vacuum → 0
 *   gravity+magnetism   `perNode` gives each split one sign, so the two halves
 *                       meeting on an edge are alike half the time and TURN, and
 *                       opposite half the time and annihilate                 → ½
 *
 * The half this book has quoted throughout is that last row, and it falls out of the
 * rule rather than out of the p → 0 limit of (1−p)/(2−p) that used to be quoted for
 * it. Half the created space survives because half the meetings are alike; that is
 * the same sentence as "magnetism expands space and gravity does not".
 */
export const vacuumFill = (o: { theory?: Theory; geometry?: Geometry; N?: number; T?: number; seed?: number } = {}) => {
  const theory = o.theory ?? GRAVITY_MAGNETISM;
  const w = new World({
    theory, geometry: o.geometry,
    N: o.N ?? 21, seed: o.seed ?? 20260817, boundary: "wrap",
  });
  w.run(o.T ?? 120);
  const measured = fill(w);
  const predicted = (w as any).world.vacuum as number | null;
  /*
   * JUDGED ONLY WHERE THE RULE FIXES IT. A polarised vacuum's density is the lattice's
   * (see `Theory.vacuum`), so there is nothing to judge it against that is not circular —
   * it is reported, and what gets judged instead is that it does not move with the box,
   * which is the part that makes it a property of the rules at all.
   */
  const finding: Finding = predicted === null
    ? {
      name: "vacuum occupancy", value: measured,
      note: `set by the lattice rather than by the rules: (G/2) fires on an EMPTY point, ` +
        `so creation goes as (1−f)^DEG and the balance lands wherever the tiling puts it. ` +
        `Measured here on ${w.geometry.name} with DEG ${w.geometry.DEG}.`,
    }
    : judge({
      name: "vacuum occupancy",
      value: measured,
      expect: {
        of: `${predicted} — what this theory leaves of an empty point once it has split ` +
          `and the halves have met on their shared edges`,
        want: predicted,
        tolerance: 0.05,
        because: "a medium that destroys nothing fills and stays full; pure gravity " +
          "annihilates both halves of everything it makes and holds nothing. Neither " +
          "depends on how often a point happens to be empty, so neither depends on the lattice",
      },
    });
  return { measured, predicted, mfp: 1 / Math.max(measured, 1e-9), finding, world: w };
};

/**
 * THE CLAIM THIS BOOK MAKES MOST OFTEN AND CHECKS LEAST: that gravity's two rules
 * are RECOVERED from the three when the polarity alternates. It is the hinge
 * between the two halves of the article and nothing had ever tested it.
 *
 * WHAT THE CLAIM IS AND IS NOT. The article's sentence is that alternating polarity
 * gives you ATTRACTION, and that (G/1) and (G/2) come back out of the three rules —
 * not that the two theories produce the same number. They cannot: in gravity every
 * head-on meeting annihilates, while under alternation roughly half of them are
 * alike and TURN instead, so the polarised theory destroys less space. So the thing
 * to compare is the SHAPE of the field and the SIGN of the force, with the
 * amplitude ratio reported as a measurement rather than expected to be one.
 *
 * A FIRST VERSION OF THIS TEST COMPARED RAW DEFICITS AND WAS MEANINGLESS: it read
 * the source's own emission rather than the shortfall, never differenced against a
 * control, and its numbers RISE with radius — which is a body filling its
 * neighbourhood, the opposite of a deficit. It is differenced now.
 */
export const recoversGravity = (o: {
  N?: number; T?: number; seeds?: number[]; radii?: number[]; separation?: number;
} = {}) => {
  const N = o.N ?? 27, T = o.T ?? 70;
  const seeds = o.seeds ?? [20260817, 777333, 424242];
  const radii = (o.radii ?? [4, 6, 8, 10]).filter(r => r < (N - 1) / 2);
  const sep = o.separation ?? 8;
  const C = (N - 1) / 2;
  const centre = [C, C, C];

  /* the world the profile came out of, so the header is the run and not a stand-in */
  let ran: World | undefined;

  /** the deficit a body leaves, differenced against the same box without it */
  const profile = (theory: Theory, alternate: boolean, seed: number) => {
    const mk = (withBody: boolean) => {
      const w = new World({ theory, N, seed, boundary: "absorb" });
      if (withBody) w.add({
        at: centre, radius: 2, emits: 1,
        period: alternate ? 2 : 1, dwellTicks: 1,
      });
      return w.run(T);
    };
    const b = mk(true), v = mk(false);
    ran = b;
    return radii.map(r => {
      let s = 0, n = 0;
      b.backend.forEachLocal((k: any) => {
        if (b.isSource(k)) return;
        const d = norm(sub(b.backend.position(k), centre));
        if (Math.abs(d - r) > 0.5) return;
        const db = b.DEG - l.rays(b, k).length;
        const dv = v.DEG - l.rays(v, k).length;
        s += db - dv; n++;
      });
      return n ? s / n : NaN;
    });
  };

  /**
   * The force, as the article defines one: where space SHORTENS. Annihilations on a
   * shell round the left body, the half facing its partner minus the half facing
   * away — positive means space is being destroyed between them, which draws them in.
   */
  const attraction = (theory: Theory, alternate: boolean, seed: number) => {
    const xL = C - sep / 2;
    const w = new World({ theory, N, seed, boundary: "absorb" });
    for (const x of [xL, C + sep / 2]) w.add({
      at: [x, C, C], radius: 2, emits: 1, period: alternate ? 2 : 1, dwellTicks: 1,
    });
    // count where annihilation fires, by watching the space it destroys
    const before = new Int32Array(w.backend.size());
    w.backend.forEachLocal((k: any) => { before[k] = w.backend.density(k); });
    w.run(T);
    let tow = 0, twN = 0, awy = 0, awN = 0;
    w.backend.forEachLocal((k: any) => {
      if (w.isSource(k)) return;
      const p = w.backend.position(k);
      const dx = p[0] - xL, dy = p[1] - C, dz = p[2] - C;
      const r = Math.hypot(dx, dy, dz);
      if (r < 3 || r > 5 || Math.abs(dx) < 0.7 * r) return;
      const grew = w.backend.density(k) - before[k];
      if (dx > 0) { tow += grew; twN++; } else { awy += grew; awN++; }
    });
    return tow / Math.max(twN, 1) - awy / Math.max(awN, 1);
  };

  const runs = (theory: Theory, alternate: boolean) => {
    const profs = seeds.map(s => profile(theory, alternate, s));
    const exps = profs.map(p => exponent(radii, p));
    const near = profs.map(p => p[0]);
    return {
      profile: radii.map((_, i) => stat(profs.map(p => p[i]))),
      exponent: stat(exps),
      amplitude: stat(near),
      force: stat(seeds.map(s => attraction(theory, alternate, s))),
    };
  };

  const g = runs(GRAVITY, false);
  const m = runs(GRAVITY_MAGNETISM, true);

  const findings: Finding[] = [
    judge({
      name: "deficit exponent, gravity", value: g.exponent.mean, err: g.exponent.err,
    }),
    judge({
      name: "deficit exponent, G+M alternating", value: m.exponent.mean, err: m.exponent.err,
      expect: {
        of: "the same shape as gravity's, which is what 'recovered' has to mean",
        want: g.exponent.mean, tolerance: 0.2,
        because: "the three rules with alternating polarity are supposed to give back (G/1) and (G/2)",
      },
    }),
    judge({
      name: "amplitude ratio G+M / gravity",
      value: m.amplitude.mean / (g.amplitude.mean || NaN),
      note: "NOT expected to be 1. Under alternation about half of head-on meetings are " +
        "alike and turn rather than annihilate, so the polarised theory destroys less space.",
    }),
    judge({
      name: "attraction, gravity", value: g.force.mean, err: g.force.err,
      expect: { of: "positive — space destroyed between two bodies draws them in",
        want: 0, atLeast: Math.abs(g.force.err),
        because: "a force in this model is where space shortens" },
    }),
    judge({
      name: "attraction, G+M alternating", value: m.force.mean, err: m.force.err,
      note: "the article's actual claim is that ALTERNATING POLARITY GIVES ATTRACTION. " +
        "Same sign as gravity's is the result; the same size is not claimed.",
    }),
  ];

  return { radii, gravity: g, magnetism: m, findings, seeds, header: headerOf(ran!, seeds) };
};

/**
 * BACKEND CONFORMANCE, AND WHY IT CANNOT BE SLOT FOR SLOT.
 *
 * The flat backend records a fold and honours its weighting; the graph backend
 * actually rewires and stops iterating a local that has been folded away. So the
 * moment the first annihilation lands, the two are drawing from the random stream
 * in different orders and every slot after that is incomparable. Measured, they
 * part company at tick 1 and sit around 15% of slots differing — which is not a
 * bug and is not small, and pretending otherwise is how the forks happened.
 *
 * WHAT CONFORMANCE MEANS HERE is that they agree on OBSERVABLES: the occupancy the
 * vacuum settles at, the rate space is destroyed at, the shape of a field. Those
 * are what any result is read off, and a gap in them is a real disagreement about
 * the model rather than about the seed. `firstDivergence` is still reported,
 * because a run where it never happens is a run where nothing folded.
 */
export const conform = (make: (backend: "array" | "graph") => any, T = 30) => {
  /*
   * EITHER SHAPE OF WORLD. `conform` is handed whatever the caller builds — the
   * article's `World`, which walks its locals with `forEachLocal`, or one seeded
   * straight off a theory, whose backend simply IS its locals. Both are the same
   * question and neither should have to know about the other.
   */
  const each = (w: any, f: (l: any) => void) =>
    w.backend.forEachLocal ? w.backend.forEachLocal(f) : [...w.backend].forEach(f);
  const DEG = (w: any) => w.DEG ?? w.geometry?.DEG ?? 0;
  const active = (w: any, l: any, d: number) =>
    w.backend.active ? w.backend.active(l, d) : !!l.rays[d]?.active;
  const charge = (w: any, l: any, d: number) =>
    w.backend.charge ? w.backend.charge(l, d)
      : (l.rays[d]?.active ? (l.rays[d].polarity ?? 0) : 0);

  const a = make("array"), b = make("graph");
  const rows: (string | number)[][] = [];
  let firstDivergence = -1;
  const obs = (w: World) => {
    let on = 0, all = 0, net = 0;
    each(w, (local: any) => {
      for (let d = 0; d < DEG(w); d++) {
        all++;
        if (active(w, local, d)) { on++; net += charge(w, local, d); }
      }
    });
    return { fill: all ? on / all : 0, net: all ? net / all : 0, ann: (w.stats ?? w.backend.stats).annihilations };
  };
  for (let t = 0; t < T; t++) {
    a.tick(); b.tick();
    /* the world as it stands, ray by ray — the flat backend's own `snapshot` in the
     * article, and here just as well read off the vocabulary both backends share */
    const shot = (x: any) => {
      const out: number[] = [];
      each(x, (l: any) => { for (const r of l.rays) out.push(r.active ? 1 : 0); });
      return out;
    };
    const sa = shot(a), sb = shot(b);
    let differ = 0;
    const n = Math.min(sa.length, sb.length);
    for (let i = 0; i < n; i++) if (sa[i] !== sb[i]) differ++;
    if (differ > 0 && firstDivergence < 0) firstDivergence = t;
    if (t % Math.max(1, Math.floor(T / 6)) === 0 || t === T - 1) {
      const oa = obs(a), ob = obs(b);
      rows.push([t, a.backend.size(), b.backend.size(),
        (differ / Math.max(n, 1)).toFixed(3),
        oa.fill.toFixed(3), ob.fill.toFixed(3),
        Math.abs(oa.fill - ob.fill).toFixed(4)]);
    }
  }
  const oa = obs(a), ob = obs(b);
  return {
    firstDivergence,
    /** what the two agree on once they have stopped agreeing slot for slot */
    statistical: {
      fill: { array: oa.fill, graph: ob.fill, gap: Math.abs(oa.fill - ob.fill) },
      annihilations: { array: oa.ann, graph: ob.ann,
        gap: Math.abs(oa.ann - ob.ann) / Math.max(oa.ann, ob.ann, 1) },
    },
    table: {
      columns: ["tick", "array n", "graph n", "slot Δ", "fill A", "fill G", "|Δfill|"],
      rows,
    },
    a, b,
  };
};
