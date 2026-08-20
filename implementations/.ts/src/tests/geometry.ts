import { GEOMETRIES, norm, sub } from "../lib/Local.ts";
import { headerOf, judge, test } from "../lib/Report.ts";

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
];
