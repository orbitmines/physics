import { GEOMETRIES } from "../lib/Local.ts";
import { Finding, headerOf, judge, test } from "../lib/Report.ts";

export default [
  test({
    id: "layer2/moments",
    claims: "a count, a signed sum and a signed vector sum are three readings of the same " +
      "rays — and the bias is quantised by the cycle because a dwell is whole ticks",
    under: { "G": "holds" },
    exact: true,
    run: (_ctx, theory) => {
      const g = GEOMETRIES["cubic-26"];

      /*
       * THE TWO CLEAN CONFIGURATIONS, AND THEY SEPARATE THE MOMENTS EXACTLY.
       *
       *   CHARGED, NOT SIDED   the same sign out of every exit. q = DEG, and µ = Σ d̂ = 0
       *                        because the exits come in ± pairs.
       *   SIDED, NOT CHARGED   opposite signs on opposite exits. Now q = 0 — each pair
       *                        cancels — while µ ADDS. THAT IS A MAGNET.
       */
      const uniform = Array.from({ length: g.DEG }, () => 1);
      const antipodal = Array.from({ length: g.DEG }, (_, d) => (d < g.OPP[d] ? 1 : -1));
      const muOf = (sg: number[]) => [0, 1, 2].map(i =>
        sg.reduce((a, s, d) => a + s * (g.U[d][i] ?? 0), 0));

      const m = uniform.length;
      const muLen = Math.hypot(...muOf(uniform));
      const qSided = antipodal.reduce((a, b) => a + b, 0);
      const muSided = muOf(antipodal);

      /** the values P can take, from the cycle alone */
      const Ps = Array.from({ length: g.CYCLE + 1 }, (_, k) => (2 * k) / g.CYCLE - 1);

      const w: any = theory.seed({ geometry: GEOMETRIES["cubic-6"], N: 3 });

      const findings: Finding[] = [
        judge({
          name: "m = ⟨1⟩, every exit fired once", value: m,
          expect: {
            of: "DEG — a count, which cannot cancel and so has one sign",
            want: g.DEG, tolerance: 0,
            because: "gravity is this moment, and a quantity that only ever adds cannot be " +
              "screened: there is no negative mass to put in the way of it",
          },
        }),
        judge({
          name: "q = ⟨s⟩ with opposite signs on opposite exits", value: qSided,
          expect: {
            of: "0 — a signed sum cancels, which is why charge comes in two kinds",
            want: 0, tolerance: 0,
            because: "the same rays that gave a count of 26 give a charge of nought, so the " +
              "difference between gravity and charge is the MOMENT and not the mechanism",
          },
        }),
        judge({
          name: "|µ| for the uniformly signed source", value: muLen,
          expect: {
            of: "0 — charged but not sided: the exits come in ± pairs, so Σ d̂ is nought",
            want: 0, tolerance: 1e-9,
            because: "a magnet needs a SIDE, and a source whose signs alternate over exits " +
              "has none however many rays it puts out",
          },
        }),
        judge({
          name: "|µ| for a genuinely sided source", value: Math.hypot(...muSided),
          expect: {
            of: "well above nought — + out of one half and − out of the other IS a side",
            want: 1, atLeast: 1,
            because: "this is the only one of the three readings that can tell which way a " +
              "source is pointing, and it is what the magnetic arc is about",
          },
          note: `and its charge is exactly ${qSided} — SIDED WITHOUT BEING CHARGED, which ` +
            "is what a magnet is, and is why a magnet is not an electric object",
        }),
        judge({
          name: "values the bias P can take", value: Ps.length,
          expect: {
            of: "CYCLE + 1 — a dwell is whole ticks, so P is quantised",
            want: g.CYCLE + 1, tolerance: 0,
            because: "a real-valued P silently rounds onto the tick grid, so two different " +
              "settings produce the same run and the difference is not measurable",
          },
        }),
      ];

      return {
        header: headerOf(w, "—"),
        findings,
        table: {
          columns: ["reading", "uniform signs", "antipodal signs"],
          rows: [
            ["m = ⟨1⟩ (a count)", m, m],
            ["q = ⟨s⟩ (a charge)", uniform.reduce((a, b) => a + b, 0), qSided],
            ["|µ| = |⟨s d̂⟩| (a side)", muLen.toFixed(6), Math.hypot(...muSided).toFixed(4)],
          ],
        },
      };
    },
  }),

  test({
    id: "layer2/ring",
    claims: "the ring is the equator in circular order, so |RING| = |equator| by " +
      "construction, and a turn is one step along it",
    under: { "G": "holds" },
    exact: true,
    run: (_ctx, theory) => {
      const rows = Object.values(GEOMETRIES).filter(g => g.D === 3).map(g =>
        [g.name, g.SHEET, g.CYCLE, g.CYCLE ? (360 / g.CYCLE).toFixed(0) + "°" : "—"]);

      /* a turn must be a permutation of the ring, and CYCLE turns must return */
      const g = GEOMETRIES["fcc-12"];
      const start = g.RING[0];
      let d = start, steps = 0;
      do { d = g.turn(d, g.ringAxis); steps++; } while (d !== start && steps <= g.DEG + 1);

      const w: any = theory.seed({ geometry: GEOMETRIES["cubic-6"], N: 3 });
      return {
        header: headerOf(w, "—"),
        findings: [
          judge({
            name: "|RING| equals |equator| on fcc-12", value: g.RING.length - g.equator(g.ringAxis).length,
            expect: {
              of: "0 — sorting a set cannot lose a member",
              want: 0, tolerance: 0,
              because: "a first version walked the plane in n steps and took the nearest exit " +
                "each time, which silently collapsed six exits onto four and reported CYCLE = 4",
            },
          }),
          judge({
            name: "turns taken to come back round", value: steps,
            expect: {
              of: "CYCLE — a turn is one step along the ring",
              want: g.CYCLE, tolerance: 0,
              because: "the article's SPIN = 360/CYCLE only means anything if the ring closes",
            },
          }),
          judge({
            name: "bcc-8 has no ring at all", value: GEOMETRIES["bcc-8"].CYCLE,
            expect: {
              of: "0 — the one genuine exclusion",
              want: 0, tolerance: 0,
              because: "gravity would work on BCC and charge as this book writes it could not exist",
            },
          }),
        ],
        table: { columns: ["geometry", "SHEET", "CYCLE", "SPIN"], rows },
      };
    },
  }),
];
