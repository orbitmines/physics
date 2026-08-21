import { GEOMETRIES, norm, sub } from "../lib/Local.ts";
import { World, l, scattering } from "../lib/Compat.ts";
import { fill, headerOf, judge, test } from "../lib/Report.ts";

/** the three families of direction on a cubic lattice, which is where a vein shows */
const FAMILIES: [string, number[]][] = [
  ["⟨100⟩ axis", [1, 0, 0]], ["⟨110⟩ face", [1, 1, 0]], ["⟨111⟩ body", [1, 1, 1]],
];

export default [
  test({
    id: "geometry/derived-constants",
    claims: "DEG, SHEET, CYCLE, SPIN and the moments come out of the exits rather than " +
      "being written down, and reproduce the article's table",
    under: { "G": "holds" },
    exact: true,                    // a counting fact: no box, no ticks, no seeds
    run: (_ctx, theory) => {
      const rows = Object.values(GEOMETRIES).filter(g => g.D === 3).map(g => [
        g.name, g.DEG, g.SHEET, g.CYCLE,
        g.CYCLE ? (360 / g.CYCLE).toFixed(0) + "°" : "—",
        (100 * g.moment(4).anisotropy).toFixed(1) + "%",
        g.cAnisotropy.toFixed(2) + "×",
        g.veined ? "veined" : "round",
      ]);
      const cubic = GEOMETRIES["cubic-26"], fcc = GEOMETRIES["fcc-12"], bcc = GEOMETRIES["bcc-8"];
      const w: any = theory.seed({ geometry: GEOMETRIES["cubic-6"], N: 3 });
      return {
        header: headerOf(w, "—"),
        findings: [
          judge({ name: "cubic-26 DEG", value: cubic.DEG,
            expect: { of: "3^D − 1", want: 26, tolerance: 0,
              because: "every non-zero offset in {−1,0,1}^D" } }),
          judge({ name: "cubic-26 SHEET", value: cubic.SHEET,
            expect: { of: "DEG(D−1) = 3^(D−1) − 1", want: 8, tolerance: 0,
              because: "the exits perpendicular to a face axis — one dimension fewer" } }),
          judge({ name: "cubic-26 Σd̂⊗d̂", value: cubic.moment(2).diagUnit,
            expect: { of: "DEG/D exactly", want: 26 / 3, tolerance: 1e-9,
              because: "cubic symmetry makes the second moment isotropic identically, which is " +
                "why the inverse-square law was never in danger on any candidate geometry" } }),
          judge({ name: "FCC CYCLE", value: fcc.CYCLE,
            expect: { of: "6 — a hexagonal ring about a body diagonal", want: 6, tolerance: 0,
              because: "FCC's exit axes have two and its cube axes four, but its body diagonals six" } }),
          judge({ name: "BCC equator", value: bcc.SHEET,
            expect: { of: "0 — no ring to put a phase on", want: 0, tolerance: 0,
              because: "gravity would work on BCC and charge as this book writes it could not exist" },
            note: `admitting face-diagonal axes would give it ${bcc.alternatives.withFaceDiagonals}, ` +
              "which is a reading the article does not take and this records rather than hides" }),
        ],
        table: {
          columns: ["geometry", "DEG", "SHEET", "CYCLE", "SPIN", "rank 4", "c aniso", "field"],
          rows,
        },
      };
    },
  }),

  test({
    id: "geometry/exits-by-axis",
    claims: "the three axis classes give two rings and not three — a face axis and an " +
      "edge axis both leave eight, and only a body diagonal differs, at six",
    under: { "G": "holds" },
    exact: true,
    run: (_ctx, theory) => {
      const g = GEOMETRIES["cubic-26"];
      const face = g.equator([1, 0, 0]).length;
      const edge = g.equator([1, 1, 0]).length;
      const body = g.equator([1, 1, 1]).length;
      const w: any = theory.seed({ geometry: GEOMETRIES["cubic-6"], N: 3 });
      return {
        header: headerOf(w, "—"),
        findings: [
          judge({ name: "⟨100⟩ face axis", value: face,
            expect: { of: "8", want: 8, tolerance: 0, because: "the exits with no x component" } }),
          judge({ name: "⟨110⟩ edge axis", value: edge,
            expect: { of: "8 — the same as a face axis, which is the correction", want: 8,
              tolerance: 0, because: "the article once tabulated three distinct rings; there are two" } }),
          judge({ name: "⟨111⟩ body axis", value: body,
            expect: { of: "6", want: 6, tolerance: 0,
              because: "the hexagonal cross-section of a cube down its diagonal" } }),
        ],
        table: {
          columns: ["axis class", "exits on the equator"],
          rows: [["⟨100⟩ face", face], ["⟨110⟩ edge", edge], ["⟨111⟩ body", body]],
        },
      };
    },
  }),

  test({
    id: "geometry/shells",
    claims: "the exits fall into shells by length, and the step lengths are what make " +
      "light anisotropic on a lattice that has more than one",
    under: { "G": "holds" },
    exact: true,
    run: (_ctx, theory) => {
      const rows = Object.values(GEOMETRIES).filter(g => g.D === 3).map(g => {
        const shells = new Map<string, number>();
        for (const s of g.steps) {
          const k = s.toFixed(4);
          shells.set(k, (shells.get(k) ?? 0) + 1);
        }
        return [g.name, [...shells].map(([r, n]) => `${n}×${r}`).join("  "), g.cAnisotropy.toFixed(3)];
      });
      const w: any = theory.seed({ geometry: GEOMETRIES["cubic-6"], N: 3 });
      return {
        header: headerOf(w, "—"),
        findings: [
          judge({ name: "cubic-6 is one shell", value: GEOMETRIES["cubic-6"].cAnisotropy,
            expect: { of: "1 — every exit the same length", want: 1, tolerance: 1e-9,
              because: "light cannot be anisotropic where there is only one step length" } }),
          judge({ name: "fcc-12 is one shell", value: GEOMETRIES["fcc-12"].cAnisotropy,
            expect: { of: "1 — twelve edge centres, all √2", want: 1, tolerance: 1e-9,
              because: "ONE STEP LENGTH is why this book runs on FCC rather than cubic-26" } }),
          judge({ name: "cubic-26 light anisotropy", value: GEOMETRIES["cubic-26"].cAnisotropy,
            expect: { of: "√3 — the body diagonal against the face", want: Math.sqrt(3),
              tolerance: 1e-9,
              because: "a 73% anisotropy in c̄ is refuted by every interferometer ever built, " +
                "which is what rules cubic-26 out as the model's lattice" } }),
        ],
        table: { columns: ["geometry", "shells", "c anisotropy"], rows },
      };
    },
  }),

  test({
    id: "geometry/sheet-coverage",
    claims: "one rotation of the sheet covers cubic completely and FCC only half",
    under: { "G": "holds" },
    exact: true,
    run: (_ctx, theory) => {
      const rows = Object.values(GEOMETRIES).filter(g => g.D === 3).map(g => {
        const seen = new Set<number>();
        for (let k = 0; k < Math.max(g.CYCLE, 1); k++) {
          const axis = g.RING.length ? g.U[g.RING[k % g.RING.length]] : g.ringAxis;
          for (const d of g.equator(axis)) seen.add(d);
        }
        return { g, covered: seen.size, frac: g.DEG ? seen.size / g.DEG : 0 };
      });
      const cubic = rows.find(r => r.g.name === "cubic-26")!;
      const fcc = rows.find(r => r.g.name === "fcc-12")!;
      const w: any = theory.seed({ geometry: GEOMETRIES["cubic-6"], N: 3 });
      return {
        header: headerOf(w, "—"),
        findings: [
          judge({ name: "cubic-26 covered by one rotation", value: cubic.frac,
            expect: { of: "1 — the whole neighbour set", want: 1, tolerance: 0.01,
              because: "the inverse-square law's derivation assumes a pulse reaches every exit" } }),
          judge({ name: "fcc-12 covered by one rotation", value: fcc.frac,
            expect: { of: "a half", want: 0.5, tolerance: 0.2,
              because: "SO ON FCC THE INVERSE-SQUARE LAW'S OWN DERIVATION WOULD HAVE TO BE REDONE, " +
                "which is one more item on the bill for changing lattice" } }),
        ],
        table: {
          columns: ["geometry", "DEG", "covered by one rotation", "fraction"],
          rows: rows.map(r => [r.g.name, r.g.DEG, r.covered, r.frac.toFixed(3)]),
        },
      };
    },
  }),

  /**
   * WHETHER THE LATTICE'S GRAIN SURVIVES ITS OWN VACUUM.
   *
   * `geometry`'s table calls the model's cubic 26 veined, with a rank-four anisotropy of
   * 49.7% and light 1.73x faster along a body diagonal — and calls the second a
   * prediction, and a bad one, since a 73% anisotropy in c-bar is refuted by every
   * interferometer ever built. Its three repairs all change the LATTICE.
   *
   * BUT EVERY ONE OF THOSE NUMBERS IS A PROPERTY OF THE NEIGHBOUR SET ALONE. The rank-four
   * moment is the momentum flux of a gas whose carriers stream FOR EVER, and the root
   * three is the shape of a ray that has never met anything. In this model a ray does not
   * stream for ever: it meets something every few cells, and a ray that has been turned
   * is on a different exit from the one it left on.
   *
   * SO IT IS A MEASUREMENT, AND ONLY A MEASUREMENT IF THE VACUUM SCATTERS — which is why
   * `scattering` is reported here and given a band that can fail.
   */
  test({
    id: "geometry/veins",
    claims: "the lattice's grain is a collisionless artefact — a field measured through " +
      "the model's own vacuum is rounder than the neighbour set is",
    under: {
      "G^XOR": "holds",
      /*
       * AND GRAVITY CANNOT BE ASKED, which an expansion rate used to hide. (G/2) is not a
       * rule that fires at a rate — every neutral point splits every tick — and under
       * gravity both halves of an inserted point are neutral, so they annihilate on the
       * edge and the point collapses. Gravity has NO VACUUM AT ALL, `vacuum: 0`, and a
       * claim about what a medium does to a field has no medium to be about.
       */
      "G": "cannot be asked — gravity's vacuum is empty by the rule, so there is no medium " +
        "here to round anything",
    },
    run: (ctx, theory) => {
      const { N, T, seeds } = ctx.budget({ N: 41, T: 120, seeds: 3 });
      const C = (N - 1) / 2, centre = [C, C, C];
      const radii = [6, 10, 14].filter(r => r < C - 2);

      /**
       * THE FIELD DOWN A NARROW CONE ABOUT EACH FAMILY, differenced against no body.
       *
       * THERE IS NO COLLISIONLESS CONTROL RUN, and there does not need to be. What a
       * control would measure — the shape of a ray that has never met anything — is
       * exactly the geometry's own rank-four moment, a constant of the neighbour set and
       * the very number the article's table prints.
       */
      const spread = ctx.once((seed: number) => {
        const mk = (withBody: boolean) => {
          const w = new World({ theory, N, seed, boundary: "absorb" });
          if (withBody) w.add({ at: centre, radius: 2, emits: 1 });
          return w.run(T);
        };
        const b = mk(true), v = mk(false);
        const byFamily = radii.map(r => FAMILIES.map(([, f]) => {
          const u = f.map(x => x / norm(f));
          let s = 0, n = 0;
          b.backend.forEachLocal(k => {
            if (b.isSource(k)) return;
            const d = sub(b.backend.position(k), centre), rr = norm(d);
            if (Math.abs(rr - r) > 0.6 || rr < 1e-9) return;
            const cs = Math.abs((d[0] * u[0] + d[1] * u[1] + d[2] * u[2]) / rr);
            if (cs < 0.955) return;
            /* the deficit: how many of a local's rays failed to arrive */
            s += (b.DEG - l.rays(b, k).length) - (v.DEG - l.rays(v, k).length); n++;
          });
          return n ? s / n : NaN;
        }));
        return { byFamily, fill: fill(b), scattering: scattering(b) };
      });

      const anisotropyAt = (ri: number) => ctx.over(seeds, s => {
        const v = spread(s).byFamily[ri];
        if (!v || !v.every(isFinite)) return NaN;
        const mean = v.reduce((a2, b2) => a2 + b2, 0) / v.length;
        return Math.abs(mean) < 1e-9 ? NaN : (Math.max(...v) - Math.min(...v)) / Math.abs(mean);
      });

      /* the middle radius that survives the box — a quick run may keep only one */
      const ri = Math.min(1, radii.length - 1);
      const measured = anisotropyAt(ri);
      const diag = spread(seeds[0]);

      const w = new World({ theory, N, seed: seeds[0], boundary: "absorb" });
      w.add({ at: centre, radius: 2, emits: 1 });
      w.run(T);
      /* the collisionless limit, which is a property of the exits and not of a run */
      const bare = w.geometry.moment(4).anisotropy;

      return {
        header: headerOf(w, "—", seeds),
        findings: [
          judge({
            name: "deflections per surviving ray", value: diag.scattering,
            expect: {
              of: "well above zero, or nothing below means anything",
              want: 1, tolerance: 0.9,
              because: "if rays are not being turned then the front is the collisionless one " +
                "whatever the density says, and no conclusion about the grain follows",
            },
            note: "THE DIAGNOSTIC THAT KEEPS A NULL RESULT FROM BEING VACUOUS. An earlier " +
              "attempt read 0.07 here and its answer was worthless — and then this read " +
              "0.0000 for a longer while, because the collision path never wrote the turn " +
              "count it averages. Its band was plus or minus 10 about 1, which cannot fail, " +
              "so nothing said so. Both are fixed; the band is now one that can.",
          }),
          {
            name: "anisotropy of the neighbour set, with nothing in the way", value: bare,
            note: "the collisionless limit, and it is the geometry's own rank-four moment " +
              "rather than a second run",
          },
          judge({
            name: "is the field measured through the vacuum ROUNDER than the neighbour set",
            value: measured.mean < bare ? 1 : 0,
            expect: {
              of: "1 — the medium rounds the field", want: 1, tolerance: 0,
              because: "a ray that has been turned is on a different exit from the one it " +
                "left on, so the direction a disturbance travels is not the direction any " +
                "ray travels. STATED AS A VERDICT because the two sides are different kinds " +
                "of quantity — one measured through a box, one a constant of the lattice",
            },
            note: `${(100 * measured.mean).toFixed(1)}% +/- ${(100 * measured.err).toFixed(1)} ` +
              `measured against the neighbour set's ${(100 * bare).toFixed(1)}%`,
          }),
        ],
        table: {
          columns: ["r", ...FAMILIES.map(f => f[0]), "spread"],
          rows: radii.map((r, i) => {
            const v = spread(seeds[0]).byFamily[i];
            if (!v || !v.every(isFinite)) return [r, "—", "—", "—", "—"];
            const mean = v.reduce((a, b2) => a + b2, 0) / v.length;
            return [r, ...v.map(x => x.toExponential(3)),
              (100 * (Math.max(...v) - Math.min(...v)) / Math.abs(mean || 1)).toFixed(1) + "%"];
          }),
        },
      };
    },
  }),
];
