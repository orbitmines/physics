import { fill, headerOf, judge, test } from "../lib/Report.ts";
import { Flat } from "../backends/CPU.array.ts";
import { GEOMETRIES } from "../lib/Local.ts";

export default [
  test({
    id: "vacuum/fixed-point",
    claims: "the vacuum settles at a definite occupancy with no rate in it and no dependence " +
      "on the box — 1 where nothing is destroyed and 0 under pure gravity, both from the rule; " +
      "and under G^XOR a number the LATTICE fixes rather than the rules",
    under: {
      "G^CONSERVING": "holds",
      "G": "holds",
      "G^XOR": "holds",
    },
    run: (ctx, theory) => {
      const { N, T, seeds } = ctx.budget({ N: 13, T: 200, seeds: 3 });
      const geometry = GEOMETRIES["fcc-12"];

      const boxes: [number, number][] = [
        [Math.max(9, Math.round(N * 0.4)) | 1, Math.round(T / 4)],
        [Math.max(11, Math.round(N * 0.7)) | 1, Math.round(T / 2)],
        [N, T],
        [N, 2 * T],
      ];

      const settled = ctx.once((n: number, t: number, seed: number) => {
        const backend = geometry.seed(
          new Flat(theory, seed, n ** geometry.D, geometry.DEG * 2, n, geometry.D), n);
        const w: any = theory.seed({ geometry, N: n, seed, backend });
        for (let i = 0; i < t; i++) w.tick();
        return { w, fill: fill(w) };
      });

      const measured = boxes.map(([n, t]) => ctx.over(seeds, s => settled(n, t, s).fill));
      const { w } = settled(N, T, seeds[0]);
      const predicted: number | null = w.vacuum;
      const at = measured[measured.length - 1].mean;

      const spread = Math.max(...measured.map(m => m.mean)) - Math.min(...measured.map(m => m.mean));
      const empty = predicted === 0;

      return {
        header: headerOf(w, "—", seeds),
        findings: [
          predicted === null
            ? {
              name: "occupancy", value: at, err: measured[measured.length - 1].err,
              note: "SET BY THE LATTICE AND NOT BY THE RULES, which is the correction this " +
                "claim carries. (G/2) fires on an EMPTY point, so creation goes as (1−f)^DEG " +
                "and the balance lands where the tiling puts it.",
            }
            : judge({
              name: "occupancy", value: at,
              expect: {
                of: `${predicted} — what this theory is left holding once every empty point ` +
                  `has split and the halves have met on their shared edges`,
                want: predicted, tolerance: 0.05,
                because: "a medium that destroys nothing fills and stays full; pure gravity " +
                  "annihilates both halves of everything it makes and holds nothing. Neither " +
                  "turns on how often a point is empty, so neither turns on the lattice",
              },
            }),
          judge({
            name: "how far it moves over a 3× box and a 8× run", value: spread,
            expect: {
              of: "nought — a density that is a property of the rules and the tiling cannot " +
                "also be a property of the box it is run in",
              want: 0, tolerance: 0.03,
              because: "THIS IS THE CLAIM THAT SURVIVES. The occupancy is not universal — it " +
                "moves with the lattice — but it does not move with the box or the run length, " +
                "which is what makes it a constant of the model rather than an artefact",
            },
          }),
          judge({
            name: "mean free path (cells)", value: empty ? NaN : 1 / Math.max(at, 1e-9),
            note: empty
              ? "THERE IS NO PATH, because there is nothing to meet. Pure gravity annihilates " +
                "every point it makes, so a screening length is not small here — it does not exist."
              : "1/fill — a ray meets something when it lands where one sits on the opposing " +
                "exit. EVERY screening length in this book is this number.",
          }),
        ],
        table: {
          columns: ["N", "ticks", "measured", "±", "the rule says", "mfp"],
          rows: boxes.map(([n, t], i) => [
            n, t, measured[i].mean.toFixed(4), measured[i].err.toFixed(4),
            predicted === null ? "the lattice's" : predicted.toFixed(4),
            measured[i].mean > 0 ? (1 / measured[i].mean).toFixed(2) : "—",
          ]),
        },
      };
    },
  }),
];
