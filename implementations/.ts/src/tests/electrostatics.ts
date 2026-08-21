import { GEOMETRIES, norm, sub } from "../lib/Local.ts";
import { charge, exponent, pullOn, screenedFit, shells } from "../lib/Measure.ts";
import { fill, Finding, headerOf, judge, test } from "../lib/Report.ts";
import { Flat } from "../backends/CPU.array.ts";

export default [
  test({
    id: "electrostatics/coulomb",
    claims: "a charge polarises the vacuum around it, the two signs give equal and opposite " +
      "fields, and the net polarity falls as 1/r^(D−1)",
    under: {
      "G^XOR": "holds",
      "G^LABELLED": "holds",
      "G": "cannot be asked — rays carry no polarity, so there is no sign for a field to be " +
        "the net of. This is not a gap in the test: it is what makes G a theory of this " +
        "model rather than magnetism with the signs switched off.",
      "G^CONSERVING": "holds",
    },
    run: (ctx, theory) => {
      /* THE ARTICLE'S OWN BOX AND ITS OWN TILING. The screening length this claim is
       * judged against is 1/fill, and fill is the LATTICE's — 0.2553 on fcc 12 against
       * 0.3209 on cubic 6 — so running it on another tiling moves the number it is
       * checked against as well as the number it measures. */
      const { N, T, seeds } = ctx.budget({ N: 41, T: 160, seeds: 4 });
      const geometry = GEOMETRIES["fcc-12"];
      const C = (N - 1) / 2;
      const centre = [C, C, C];
      const radii = shells([4, 6, 8, 10, 13], C - 2);

      const build = (seed: number) => geometry.seed(
        new Flat(theory, seed, N ** geometry.D, geometry.DEG * 2, N, geometry.D), N, "absorb");

      /** the net polarity, differenced against the same box at the same seed with no body */
      const profile = ctx.once((emits: number, seed: number) => {
        const mk = (withBody: boolean) => {
          const w: any = theory.seed({ geometry, N, seed, backend: build(seed) });
          if (withBody) w.add({ at: centre, radius: 2, emits });
          for (let t = 0; t < T; t++) w.tick();
          return w;
        };
        const b = mk(true), v = mk(false);
        const at = (w: any, r: number) => {
          let s = 0, n = 0;
          for (const k of w.backend) {
            if (k.source) continue;
            const p = w.embedding.at(k);
            if (!p || Math.abs(norm(sub(p, centre)) - r) > 0.5) continue;
            s += charge(k); n++;
          }
          return n ? s / n : NaN;
        };
        return radii.map(r => at(b, r) - at(v, r));
      });

      const plus = radii.map((_, i) => ctx.over(seeds, s => profile(1, s)[i]));
      const minus = radii.map((_, i) => ctx.over(seeds, s => profile(-1, s)[i]));

      const exp = exponent(radii, plus.map(p => p.mean), plus.map(p => p.err));
      const screen = screenedFit(radii, plus.map(p => p.mean), 2);

      const asym = plus.map((p, i) => Math.abs(p.mean + minus[i].mean));
      const scaleOf = plus.map((p, i) => Math.abs(p.mean - minus[i].mean));
      const ratio = scaleOf[0] / Math.max(asym[0], 1e-12);

      const w: any = theory.seed({ geometry, N, seed: seeds[0], backend: build(seeds[0]) });
      w.add({ at: centre, radius: 2, emits: 1 });
      for (let t = 0; t < T; t++) w.tick();
      const fillNow = fill(w);

      const findings: Finding[] = [
        judge({
          name: "falloff exponent, resolved radii", value: exp,
          note: "REPORTED WITHOUT AN EXPECTATION, deliberately. A bare power law is the wrong " +
            "shape for this medium: what the model predicts is geometry TIMES attenuation, so " +
            "this number is the sum of the two and is steep by construction. The expectation " +
            "belongs on λ below, where the geometric exponent is held fixed.",
        }),
        judge({
          name: "screening length λ (cells)", value: screen.lambda,
          expect: {
            of: "the vacuum's own mean free path, 1/fill",
            want: 1 / Math.max(fillNow, 1e-9), tolerance: 0.6,
            because: "a ray meets something when it lands where one sits on the opposing exit, " +
              "so a field is attenuated at the same length a ray survives",
          },
          note: "fitting A/r²·e^(−r/λ) with the exponent FIXED by the geometry, so what comes " +
            "out is the medium rather than a mixture of the medium and the shell counting",
        }),
        judge({
          name: "two signs, |+ − −| / |+ + −|", value: ratio,
          expect: {
            of: "large — the two signs give equal and opposite fields",
            want: 0, atLeast: 3,
            because: "the sign law is the claim that a charge's field reverses with its sign, " +
              "so the difference of the two must dominate their sum",
          },
        }),
      ];

      return {
        header: headerOf(w, "—", seeds),
        findings,
        table: {
          columns: ["r", "+ charge", "±", "− charge", "±", "|sum|"],
          rows: radii.map((r, i) => [
            r, plus[i].mean.toExponential(3), plus[i].err.toExponential(1),
            minus[i].mean.toExponential(3), minus[i].err.toExponential(1),
            asym[i].toExponential(2),
          ]),
        },
      };
    },
  }),

  /**
   * THE SIGN LAW, BOTH CHANNELS — and it needs both, because either alone is a
   * difference between two magnitudes of one thing.
   *
   *   PULL   annihilation between two bodies destroys spatial points, and destroying a
   *          point between them shortens the separation. A metric effect.
   *   PUSH   arrivals deliver momentum. A mechanical effect, and INVISIBLE to an
   *          annihilation count, because its whole content is that annihilation did NOT
   *          happen there.
   *
   * The XOR is over which rule fires: opposite charges annihilate in the gap (high pull,
   * low push → attract), alike ones turn (low pull, high push → repel).
   */
  test({
    id: "electrostatics/sign-law",
    claims: "opposite charges attract and alike ones repel, as two channels — destroyed " +
      "space and delivered momentum — with the XOR over which rule fires",
    under: {
      "G^XOR": "holds",
      "G^LABELLED": "holds",
      "G": "cannot be asked — with no polarity there are no alike and opposite cases to " +
        "have a law between",
    },
    run: (ctx, theory) => {
      const { N, T, seeds } = ctx.budget({ N: 41, T: 160, seeds: 4 });
      const geometry = GEOMETRIES["fcc-12"];
      const C = (N - 1) / 2;
      const sep = Math.min(10, N - 12), xL = C - sep / 2;
      const build = (seed: number) => geometry.seed(
        new Flat(theory, seed, N ** geometry.D, geometry.DEG * 2, N, geometry.D), N, "absorb");

      const channels = ctx.once((right: number, seed: number) => {
        const w: any = theory.seed({ geometry, N, seed, backend: build(seed) });
        w.add({ at: [xL, C, C], radius: 2, emits: 1, period: 12, dwellTicks: 10 });
        if (right !== 0)
          w.add({ at: [C + sep / 2, C, C], radius: 2, emits: right, period: 12, dwellTicks: 10 });
        const before = new Map<any, number>();
        for (const k of w.backend) before.set(k, k.density);
        for (let t = 0; t < T; t++) w.tick();
        /* PULL: the annihilation asymmetry on a shell round the left body */
        let tow = 0, twN = 0, awy = 0, awN = 0;
        for (const k of w.backend) {
          if (k.source) continue;
          const p = w.embedding.at(k);
          if (!p) continue;
          const dx = p[0] - xL, r = Math.hypot(dx, p[1] - C, p[2] - C);
          if (r < 3 || r > 5 || Math.abs(dx) < 0.7 * r) continue;
          const grew = k.density - (before.get(k) ?? 1);
          if (dx > 0) { tow += grew; twN++; } else { awy += grew; awN++; }
        }
        return {
          push: pullOn(w, 0)[0],
          pull: tow / Math.max(twN, 1) - awy / Math.max(awN, 1),
        };
      });

      const over = (right: number) => ({
        push: ctx.over(seeds, s => channels(right, s).push),
        pull: ctx.over(seeds, s => channels(right, s).pull),
      });
      const lone = over(0), alike = over(1), opp = over(-1);

      /*
       * DIFFERENCED PER SEED. Alike and opposite at seed s run in the SAME VACUUM —
       * identical polarities, identical expansion, differing only in the sign on the
       * right-hand body. So their noise is the same noise, and subtracting them seed by
       * seed removes it before any mean is taken. Differencing the two MEANS instead
       * treats runs that share a realisation as independent, which inflates the error by
       * a spread that cancels exactly.
       */
      const dPushStat = ctx.over(seeds, s => channels(1, s).push - channels(-1, s).push);
      const dPullStat = ctx.over(seeds, s => channels(-1, s).pull - channels(1, s).pull);
      const dPush = dPushStat.mean, ePush = dPushStat.err;
      const dPull = dPullStat.mean, ePull = dPullStat.err;

      const w: any = theory.seed({ geometry, N, seed: seeds[0], backend: build(seeds[0]) });
      w.add({ at: [xL, C, C], radius: 2, emits: 1 });
      for (let t = 0; t < T; t++) w.tick();

      /*
       * AND THE ONE THING THE LATTICE DOES NOT HAND OVER. A destroyed spatial point and
       * an absorbed ray are not the same quantity, so the net force is
       * F = (arrivals) + κ·(points destroyed) for a κ the lattice does not fix. What it
       * DOES fix is the window in which both signs come out right.
       */
      const kOpp = -opp.push.mean / Math.max(opp.pull.mean, 1e-30);
      const kAlike = -alike.push.mean / Math.max(alike.pull.mean, 1e-30);
      const decades = Math.log10(kAlike / Math.max(kOpp, 1e-30));

      const findings: Finding[] = [
        judge({
          name: "alike pushed harder than opposite", value: dPush, err: ePush,
          expect: {
            of: "negative — alike rays are not annihilated in the gap, so they arrive and land",
            want: 0, atMost: -Math.abs(ePush),
            because: "(G+M/3) turns alike pairs and destroys nothing, so the gap stays full",
          },
          note: `${(Math.abs(dPush) / (ePush || Infinity)).toFixed(1)}σ`,
        }),
        judge({
          name: "opposite pulled harder than alike", value: dPull, err: ePull,
          expect: {
            of: "positive — (G+M/1) fires between opposite charges and shortens the separation",
            want: 0, atLeast: Math.abs(ePull),
            because: "a force in this model is where space shortens",
          },
          note: `${(Math.abs(dPull) / (ePull || Infinity)).toFixed(1)}σ`,
        }),
        judge({
          name: "both orderings hold at once", value: (dPush < 0 && dPull > 0) ? 1 : 0,
          expect: {
            of: "1 — a sign law needs a push AND a pull, or it is two magnitudes of one thing",
            want: 1, tolerance: 0.01,
            because: "either channel alone reports a difference and cannot report a sign",
          },
        }),
        judge({
          name: "push on a LONE body, in units of its own error",
          value: Math.abs(lone.push.mean) / Math.max(lone.push.err, 1e-30),
          expect: {
            of: "small — consistent with the nought the self term guarantees",
            want: 0, atMost: 12,
            because: "the control is a body with nothing to interact with, and it must read " +
              "zero for the two configurations above to be forces rather than differences. " +
              "AND IT IS NOT LUCK: the overlap counts for d̂ and −d̂ are equal while the " +
              "momentum along them flips sign, so a body cannot push itself — structurally, " +
              "and now also because a body does not absorb its own untouched radiation at " +
              "all. What is measured is not exactly zero because it also contains what the " +
              "vacuum delivers, which fluctuates, so the row is stated against its own error",
          },
          note: `${lone.push.mean.toExponential(2)} ± ${lone.push.err.toExponential(1)}`,
        }),
        {
          name: "decades of κ in which both signs come out right", value: decades,
          note: `κ ∈ (${kOpp.toExponential(3)}, ${kAlike.toExponential(3)}) — the lower bound ` +
            `is what opposite needs to attract and the upper is what alike can stand and ` +
            `still repel. F = (arrivals) + κ·(points destroyed) for a κ THE LATTICE DOES NOT ` +
            `FIX, and it is the first quantity in the electromagnetic arc the model needs and ` +
            `cannot supply. NO EXPECTATION IS DECLARED because the arc's window — 3.36 ` +
            `decades straddling unity — is cubic 26's, and this run gives ` +
            `${decades.toFixed(2)} decades ` +
            `${(1 > kOpp && 1 < kAlike) ? "which still contains" : "which does NOT contain"} ` +
            `κ = 1. A disagreement to resolve rather than a band to widen`,
        },
      ];

      return {
        header: headerOf(w, "—", seeds),
        findings,
        table: {
          columns: ["config", "PUSH", "±", "PULL", "±"],
          rows: ([["lone", lone], ["alike", alike], ["opposite", opp]] as const).map(
            ([name, c]) => [
              name, c.push.mean.toExponential(3), c.push.err.toExponential(1),
              c.pull.mean.toExponential(3), c.pull.err.toExponential(1),
            ]),
        },
      };
    },
  }),
];
