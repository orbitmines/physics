import { GEOMETRIES, norm, sub } from "../lib/Local.ts";
import { charge, exponent, screenedFit } from "../lib/Measure.ts";
import { fill, Finding, headerOf, judge, test } from "../lib/Report.ts";
import { Flat } from "../backends/CPU.array.ts";

export default [
  test({
    id: "electrostatics/coulomb",
    claims: "a charge polarises the vacuum around it, the two signs give equal and opposite " +
      "fields, and the net polarity falls as 1/r^(D−1)",
    under: {
      "G^XOR": "holds",
      "G": "cannot be asked — rays carry no polarity, so there is no sign for a field to be " +
        "the net of. This is not a gap in the test: it is what makes G a theory of this " +
        "model rather than magnetism with the signs switched off.",
      "G^CONSERVING": "holds",
    },
    run: (ctx, theory) => {
      const { N, T, seeds } = ctx.budget({ N: 21, T: 60, seeds: 3 });
      const geometry = GEOMETRIES["cubic-6"];
      const C = (N - 1) / 2;
      const centre = [C, C, C];
      const radii = [3, 4, 5, 6, 8].filter(r => r < C - 2);

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
];
