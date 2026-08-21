import { fill, headerOf, judge, test } from "../lib/Report.ts";
import { Flat } from "../backends/CPU.array.ts";
import { GEOMETRIES } from "../lib/Local.ts";
import { CONSERVING, GRAVITY, GRAVITY_MAGNETISM, World, expansionOf } from "../lib/Compat.ts";
import { shells } from "../lib/Measure.ts";

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
      /* THE ARTICLE'S BOX. The claim that survives is that the occupancy does not move
       * with the box or the run length, and a small box is exactly where that is easiest
       * to satisfy by accident — the sweep below runs three sizes off this one. */
      const { N, T, seeds } = ctx.budget({ N: 25, T: 200, seeds: 3 });
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

  /**
   * ANNIHILATION FEEDS THE EXPANSION — the loop this book's cosmology rests on, and the
   * one place the two rules are not merely each other's inverse.
   *
   * (G/1) leaves neutral points and (G/2) expands neutral points, so a theory that
   * destroys more grows space faster. It is a statement about an ORDER over three
   * theories, which is why the test runs all three whichever one it is declared under.
   */
  test({
    id: "vacuum/annihilation-feeds-expansion",
    claims: "annihilation leaves neutral points and (G/2) expands neutral points, so a " +
      "theory that destroys more grows space faster",
    under: { "G": "holds" },
    run: (ctx, theory) => {
      const { T, seeds } = ctx.budget({ N: 9, T: 40, seeds: 2 });
      const N = 9, radius = 7;
      const bound = { radius, metric: "box" };

      const grow = ctx.once((which: string, seed: number) => {
        const th = which === "conserving" ? CONSERVING
          : which === "gravity" ? GRAVITY : GRAVITY_MAGNETISM;
        const w = new World({ theory: th, N, seed, backend: "graph", boundary: "expand", bound });
        const before = w.backend.size();
        w.run(T);
        const e = expansionOf(w);
        return {
          grew: e.size / before, meanDegree: e.meanDegree,
          annihilations: w.stats.annihilations,
          /* whether it stopped because of the theory or because of the budget */
          capped: e.size >= (2 * radius + 1) ** w.geometry.D - 1 ? 1 : 0,
        };
      });

      const names = ["conserving", "gravity+magnetism", "gravity"];
      const grew = names.map(n => ctx.over(seeds, s => grow(n, s).grew));
      const ann = names.map(n => ctx.over(seeds, s => grow(n, s).annihilations));
      const deg = names.map(n => ctx.over(seeds, s => grow(n, s).meanDegree));
      const capped = names.map(n => ctx.over(seeds, s => grow(n, s).capped));

      const w = new World({ theory, N, seed: seeds[0], backend: "graph", boundary: "expand", bound });
      w.run(5);

      return {
        header: headerOf(w, "—", seeds),
        findings: [
          judge({
            name: "growth ordered by how much each theory annihilates",
            value: (grew[2].mean > grew[1].mean && grew[1].mean > grew[0].mean) ? 1 : 0,
            expect: {
              of: "1 — conserving < gravity+magnetism < gravity",
              want: 1, tolerance: 0,
              because: "a theory that destroys more rays leaves more neutral points, and a " +
                "neutral point is exactly what (G/2) expands",
            },
          }),
          judge({
            name: "gravity's growth over the conserving medium's",
            value: grew[2].mean / Math.max(grew[0].mean, 1e-9),
            expect: {
              of: "at or above 1 — the loop is a large effect, not a correction",
              want: 1, atLeast: 1,
              because: "the only difference between those two runs is how often two rays " +
                "destroy each other; the bound, the rate and the ticks are identical",
            },
          }),
          /*
           * THE DIAGNOSTIC THAT SAYS WHETHER THE ROW ABOVE IS PHYSICS OR ARITHMETIC.
           *
           * A frontier ray meets nothing, whatever the theory is, so the edge advances one
           * cell a tick in every reading of the rules — and a bound is reached at the same
           * tick by all three. Where that has happened the growth column is the BOUND and
           * nothing else, and no ordering can be read off it. It is reported rather than
           * worked around: widening the bound until the answer comes out is fitting.
           */
          {
            name: "theories that ran into the bound rather than out of mechanism",
            value: capped.reduce((a, x) => a + x.mean, 0),
            note: capped.every(x => x.mean >= 1)
              ? "ALL THREE — so the growth column above is the budget, and the ordering it " +
                "reports is arithmetic. The claim is not measured here at this bound: the " +
                "frontier advances at c-bar under every theory, and a radius of " +
                `${radius} around a box of ${N} is reached before the theories can differ. ` +
                "The article's run reports 267x against the conserving medium's 7.6x, which " +
                "no ball of that radius holds — so what it counted was not points in the " +
                "bound. A disagreement recorded rather than a bound widened until it agrees."
              : "not all of them — the growth column is a mechanism where it is not capped",
          },
          {
            name: "mean ways out of a point, gravity", value: deg[2].mean, err: deg[2].err,
            note: "if this were growing, the point count would be falling and this would be " +
              "the bookkeeping of a collapse rather than an expansion",
          },
        ],
        table: {
          columns: ["theory", "annihilates", "space grew", "annihilations", "ways out"],
          rows: [
            ["conserving", "never", grew[0].mean.toFixed(1) + "x",
              ann[0].mean.toExponential(2), deg[0].mean.toFixed(1)],
            ["gravity+magnetism", "half its meetings", grew[1].mean.toFixed(1) + "x",
              ann[1].mean.toExponential(2), deg[1].mean.toFixed(1)],
            ["gravity", "every meeting", grew[2].mean.toFixed(1) + "x",
              ann[2].mean.toExponential(2), deg[2].mean.toFixed(1)],
          ],
        },
      };
    },
  }),

  /**
   * SHEET AGAINST ISOTROPIC — whether the approximation every other measurement in this
   * book uses is a fair one.
   *
   * The article derives 1/R^(D-1) from a FIXED number of rays spread over a shell, and
   * pulses them as a SHEET that comes round the ring. Every test here instead fires every
   * exit every tick, and that is a different source unless the falloff is the same. It
   * was never checked, and it could not be: `emission` was a field on a source spec that
   * nothing read, so the two panels of this comparison rendered bit-identical images.
   */
  test({
    id: "vacuum/sheet-versus-isotropic",
    claims: "sheet emission and isotropic emission give the same falloff, so the " +
      "approximation every measurement in this book uses is a fair one",
    under: { "G^XOR": "holds" },
    run: (ctx, theory) => {
      /* `least` because this is a PROFILE: the comparison is between two falloffs, and a
       * box with room for one shell has no falloff in it to compare. See `budget`. */
      const { N, T, seeds } = ctx.budget({ N: 35, T: 140, seeds: 3, least: 21 });
      const C = (N - 1) / 2, centre = [C, C, C];
      const radii = shells([4, 6, 8, 10], C - 2);

      const profile = ctx.once((emission: "isotropic" | "sheet", seed: number) => {
        const mk = (withBody: boolean) => {
          const w = new World({ theory, N, seed, boundary: "absorb" });
          if (withBody) w.add({ at: centre, radius: 2, emits: 1, emission });
          return w.run(T);
        };
        const b = mk(true), v = mk(false);
        return radii.map(r => {
          let s = 0, n = 0;
          b.backend.forEachLocal(k => {
            if (b.isSource(k)) return;
            const d = Math.hypot(...b.backend.position(k).map((x, i) => x - centre[i]));
            if (Math.abs(d - r) > 0.5) return;
            let q = 0, qv = 0;
            for (let e = 0; e < b.DEG; e++) {
              if (b.backend.active(k, e)) q += b.backend.charge(k, e);
              if (v.backend.active(k, e)) qv += v.backend.charge(k, e);
            }
            s += q - qv; n++;
          });
          return n ? s / n : NaN;
        });
      });

      const iso = radii.map((_, i) => ctx.over(seeds, s => profile("isotropic", s)[i]));
      const sheet = radii.map((_, i) => ctx.over(seeds, s => profile("sheet", s)[i]));

      /* the shapes, normalised at the innermost radius so only the FALLOFF is compared */
      const shape = (m: typeof iso) => m.map(x => x.mean / (m[0].mean || NaN));
      const si = shape(iso), ss = shape(sheet);
      const worst = Math.max(...si.map((x, i) =>
        Math.abs(x - ss[i]) / Math.max(Math.abs(x), 1e-9)).filter(isFinite));

      const w = new World({ theory, N, seed: seeds[0], boundary: "absorb" });
      w.add({ at: centre, radius: 2, emits: 1, emission: "sheet" });
      w.run(T);

      return {
        header: headerOf(w, "—", seeds),
        findings: [
          judge({
            name: "worst shape difference", value: worst,
            expect: {
              of: "small — the same falloff whichever way the source emits",
              want: 0, tolerance: 0.4,
              because: "the inverse-square law comes from a FIXED number of rays over a " +
                "shell, and how they are distributed over the shell should not change how " +
                "it thins",
            },
            note: "normalised at the innermost radius, so this compares the falloff and not " +
              "the amplitude — a sheet puts out an equator's worth of rays a tick against " +
              "isotropic's whole degree, so they are not expected to be the same size",
          }),
          {
            name: "amplitude ratio, sheet / isotropic",
            value: sheet[0].mean / (iso[0].mean || NaN),
            note: `SHEET / DEG = ${(w.geometry.SHEET / w.geometry.DEG).toFixed(4)} if the two ` +
              "differ only by how many rays go out a tick",
          },
        ],
        table: {
          columns: ["r", "isotropic", "sheet", "iso shape", "sheet shape"],
          rows: radii.map((r, i) => [
            r, iso[i].mean.toExponential(3), sheet[i].mean.toExponential(3),
            si[i].toFixed(3), ss[i].toFixed(3),
          ]),
        },
      };
    },
  }),
];
