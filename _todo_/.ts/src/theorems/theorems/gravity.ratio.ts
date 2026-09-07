/**
 * WHAT THE PROTON-TO-ELECTRON RATIO ASKS OF THE VACUUM - the question inverted, because that
 * is the direction in which this model has a number to give.
 *
 * ASKED FORWARD IT COMES OUT WRONG AND IT IS WORTH SAYING SO FIRST. `gravity.atom` proves
 * m ∝ 1/r from the two gravity rules, so a mass ratio is a SIZE ratio inverted and nothing
 * else: m_p/m_e = r_e/r_p. Both sizes are lattice counts here, both are of order a cell, and
 * the ratio they give is of order one rather than of order two thousand. That is not a small
 * discrepancy to be tightened later; it is the model saying something false, and the useful
 * move is to ask what would have to be true instead.
 *
 * SO IT IS ASKED BACKWARD. The two sizes are these, and neither is fitted:
 *
 *   r_p   THE TIGHTEST THING THAT CAN CLOSE. A lap is CYCLE ring steps - `G^XOR^o`'s own
 *         `laps` - and a closed curve of CYCLE cells' circumference has radius CYCLE/(2π).
 *         Nothing smaller closes, because there is no shorter way round the ring, so this is
 *         a floor the lattice puts under how tight a bound thing can be.
 *
 *   r_e   HOW FAR THE CLOUD REACHES. `gravity.atom` establishes that every shell of the
 *         cloud weighs the same - the falloff r^{1-D} and the room r^{D-1} cancel exactly -
 *         so the cloud's mass is its weight per shell times HOW MANY SHELLS THERE ARE, and
 *         it DIVERGES unless something stops it. What stops it is the carrier dying:
 *         `reach.range` derives λ from the vacuum's own occupancy, and the cloud reaches as
 *         far as its carriers do and no further.
 *
 * WHICH MAKES THE RATIO 2πλ/CYCLE, AND THAT IS THE WHOLE OF IT. Everything else cancelled:
 * the falloff cancelled against the room, and the two masses are two radii. So the observed
 * 1836 is a statement about λ and about nothing else in this model, and it says
 *
 *     λ = 1836 · CYCLE / (2π)   ≈ 1753 cells   on fcc-12, where CYCLE is 6
 *
 * AGAINST THE λ THIS VACUUM ACTUALLY HAS, which `reach.range` derives from an occupancy of a
 * half and which comes out at about one and a half cells. The gap is a factor of about a
 * thousand, and it is THE SAME GAP `force.range` and `atom.hydrogen` already record - "a
 * Coulomb force with a range of two Planck lengths is not a Coulomb force". This theorem does
 * not add a new problem; it puts a second, independent number on the one that is there, and
 * that number came from the mass ratio rather than from an atom's radius.
 */
import { expo } from "../Algebra.ts";
import { Theorem } from "../Theorem.ts";
import { counts, CYCLE_Q } from "../probes/counts.ts";
import { RANGE, survival } from "../probes/survival.ts";

/** the tightest closed orbit - what a lap of CYCLE cells has for a radius */
export const R_TIGHT = "r_{p}";
/** how far the cloud gets before its carriers are eaten */
export const R_CLOUD = "r_{e}";
/** the ratio of the two masses, which is the ratio of the two sizes inverted */
export const RATIO = "\\frac{m_{p}}{m_{e}}";

export const gravityRatio: Theorem = {
  id: "gravity.ratio",
  asks: "mass goes as one over size, so a mass ratio is a size ratio. What are the two " +
    "sizes a bound pair has here, and what does the ratio between them come to?",
  about: RATIO,
  probes: [counts, survival],
  uses: ["gravity.atom", "lattice.turn", "reach.range"],
  wants: [
    { kind: "scales", of: RATIO, by: { [R_CLOUD]: expo(1), [R_TIGHT]: expo(-1) } },
    { kind: "positive", of: RANGE },
  ],
  glossary: {
    [RATIO]: { symbol: "\\frac{m_{p}}{m_{e}}", says: "how much heavier the tight one is - a ratio of sizes inverted, because mass goes as one over size" },
    [R_TIGHT]: { symbol: "r_{p}", says: "the tightest thing that can close - a lap is CYCLE cells round, so its radius is CYCLE/(2\\pi)" },
    [R_CLOUD]: { symbol: "r_{e}", says: "how far the cloud reaches, which is how far a carrier gets before it is eaten" },
    [RANGE]: { symbol: "\\lambda", says: "how far a carrier gets, derived from the vacuum's own occupancy" },
    [CYCLE_Q]: { symbol: "CYCLE", says: "how many ring steps go once round" },
  },
};

export const definitions = [
  {
    fact: { kind: "scales" as const, of: R_TIGHT, by: { [CYCLE_Q]: expo(1) } },
    because: "THE TIGHTEST THING THAT CAN CLOSE is a lap, and a lap is CYCLE ring steps - " +
      "`G^XOR^o`'s `laps`, and `lattice.turn` establishes that CYCLE does not grow with the " +
      "dimension. A closed curve whose circumference is CYCLE cells has radius CYCLE/(2π), " +
      "and nothing smaller closes because there is no shorter way round the ring. The 2π is " +
      "not fitted; it is what a circumference is",
    line: `${R_TIGHT} = \\frac{${CYCLE_Q}}{2\\pi}`,
  },
  {
    fact: { kind: "equals" as const, of: R_CLOUD, to: [{ c: { n: 1, d: 1 },
      m: { [RANGE]: expo(1) } }] },
    because: "AND THE CLOUD REACHES AS FAR AS ITS CARRIERS DO. `gravity.atom` establishes " +
      "that every shell of it weighs the same, so its mass is set by HOW MANY SHELLS there " +
      "are and diverges without a cut - and what cuts it is the carrier being eaten, which " +
      "`reach.range` derives from the vacuum's occupancy rather than assuming",
    line: `${R_CLOUD} = ${RANGE}`,
  },
  {
    fact: { kind: "scales" as const, of: RATIO,
      by: { [R_CLOUD]: expo(1), [R_TIGHT]: expo(-1) } },
    because: "AND A MASS RATIO IS A SIZE RATIO INVERTED, which is `gravity.atom`'s m ∝ 1/r " +
      "and nothing more. Both masses are the same kind of thing - an amount of turning - so " +
      "the constant between mass and size is the same for both and cancels. What is left is " +
      "2πλ/CYCLE, and every symbol in it is a count this folder already derives",
    line: `${RATIO} = \\frac{${R_CLOUD}}{${R_TIGHT}} = \\frac{2\\pi·${RANGE}}{${CYCLE_Q}}`,
  },
];
