/**
 * GRAVITY — the vacuum's pull, and the two rules recovered from the three.
 *
 * THE MECHANISM IS A SHORTFALL IN PRESSURE, not an attraction between bodies. The
 * vacuum is trying to expand; matter is in the way and disturbs that expansion; the
 * deficit spreads at c̄; and what a body feels is the vacuum's rays arriving
 * ANISOTROPICALLY, because a second body has been eating the ones that would have come
 * from its direction. Fewer land on the facing side, the far side wins, and the two are
 * pushed together.
 *
 * WHICH IS WHY MEASURING THE DEFICIT PROFILE AROUND ONE BODY IS THE WRONG READING. The
 * deficit is the mechanism, not the observable: a single body's shortfall dies into
 * noise within a dozen cells, so at 51³ it gave 118% fit error and said nothing. The
 * FORCE is a difference between two configurations at ONE place, so it survives at box
 * sizes the profile cannot reach — and it comes out at 9.6σ.
 *
 * Both bodies are INERT ABSORBERS: they eat the vacuum's rays and emit nothing. So
 * there is no body-to-body interaction in the run at all, and whatever draws them
 * together is the vacuum.
 *
 * ON THE BOX AND THE TILING. This is the article's own configuration — 41³, 240 ticks,
 * five seeds, on FCC 12 — and it is not decoration. The number quoted is 9.6σ against a
 * lone body at the same position, and σ is what a smaller box and fewer seeds take
 * away; the tiling is worse than that, because the occupancy this force is carried
 * through is the LATTICE's (0.2553 on fcc 12, 0.3209 on cubic 6) and so is the mean
 * free path every range in this book is quoted in.
 */
import { GEOMETRIES } from "../lib/Local.ts";
import { gravitationalPull } from "../lib/Measure.ts";
import { recoversGravity } from "../lib/Checks.ts";
import { test } from "../lib/Report.ts";
import { Flat } from "../backends/CPU.array.ts";

export default [
  test({
    id: "gravity/inverse-square",
    claims: "two inert absorbers are pulled together by the vacuum alone, and the force " +
      "falls as 1/R^(D−1)",
    under: {
      "G": "holds",
      /*
       * IT MUST HOLD HERE TOO, and that is the article's own claim rather than a bonus:
       * the three rules with alternating polarity are supposed to give back the two. A
       * gravity that appeared only in the gravity theory would be a separate theory
       * bolted on, not a recovered one.
       */
      "G^XOR": "holds",
      "G^CONSERVING": "a medium that destroys nothing casts no shadow, so there is no " +
        "deficit for a body to be pulled into",
    },
    run: (ctx, theory) => {
      const { N, T, seeds } = ctx.budget({ N: 41, T: 240, seeds: 5 });
      const geometry = GEOMETRIES["fcc-12"];
      const r = gravitationalPull({
        theory, geometry, N, T, seeds,
        backend: (seed: number) => geometry.seed(
          new Flat(theory, seed, N ** geometry.D, geometry.DEG * 2, N, geometry.D), N, "absorb"),
      });
      return {
        header: r.header,
        findings: r.findings,
        table: {
          columns: ["sep", "pair − lone", "±", "σ", "× sep²"],
          rows: r.rows.map(x => [
            x.sep, x.value.toExponential(3), x.err.toExponential(1),
            x.sigma.toFixed(1), (x.value * x.sep * x.sep).toExponential(3),
          ]),
        },
      };
    },
  }),

  /**
   * THE HINGE BETWEEN THE TWO HALVES OF THE ARTICLE, and nothing had ever tested it.
   *
   * The claim is that alternating polarity gives ATTRACTION and brings (G/1) and (G/2)
   * back out of the three rules — NOT that the two theories produce the same number.
   * They cannot: under alternation about half of head-on meetings are alike and TURN
   * rather than annihilate, so the polarised theory destroys less space. The SHAPE and
   * the SIGN are what is compared; the amplitude ratio is reported.
   *
   * It was written, it lives in `Checks.ts`, and it was reachable only from the
   * standalone `CHECK` script — so the claim this book makes most often was the one
   * claim its report did not carry.
   */
  test({
    id: "gravity/recovered-from-magnetism",
    claims: "gravity's two rules are recovered from the three when the polarity alternates",
    under: { "G": "holds" },
    run: (ctx) => {
      const { N, T, seeds } = ctx.budget({ N: 27, T: 70, seeds: 3 });
      const r = recoversGravity({ N, T, seeds });
      return {
        header: r.header,
        findings: r.findings,
        table: {
          columns: ["r", "deficit, gravity", "±", "deficit, G+M", "±"],
          rows: r.radii.map((rad, i) => [
            rad,
            r.gravity.profile[i].mean.toExponential(3), r.gravity.profile[i].err.toExponential(1),
            r.magnetism.profile[i].mean.toExponential(3), r.magnetism.profile[i].err.toExponential(1),
          ]),
        },
      };
    },
  }),
];
