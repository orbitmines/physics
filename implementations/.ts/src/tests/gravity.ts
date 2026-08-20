import { GEOMETRIES } from "../lib/Local.ts";
import { gravitationalPull } from "../lib/Measure.ts";
import { test } from "../lib/Report.ts";
import { Flat } from "../backends/CPU.array.ts";

export default [
  test({
    id: "gravity/inverse-square",
    claims: "two inert absorbers are pulled together by the vacuum alone, and the force " +
      "falls as 1/R^(D−1)",
    under: {
      "G": "holds",
      "G^XOR": "holds",
      "G^CONSERVING": "a medium that destroys nothing casts no shadow, so there is no " +
        "deficit for a body to be pulled into",
    },
    run: (ctx, theory) => {
      const { N, T, seeds } = ctx.budget({ N: 21, T: 60, seeds: 3 });
      const geometry = GEOMETRIES["cubic-6"];
      const r = gravitationalPull({
        theory, geometry, N, T, seeds, separations: [4, 6, 8],
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
];
