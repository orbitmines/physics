/**
 * HOW MUCH OF A CHARGE'S FIELD IS LEFT PAST A RADIUS - and it is 1/r, which is why the
 * count converges at all.
 *
 * WHAT A CHARGE LEAVES AT A DISTANCE falls off as one over the square of it - that is
 * `gravity.falloff`, cited here rather than counted again. This theorem asks a different
 * question: not what is at r, but how much is left BEYOND r once everything further out is
 * added up. That is an integral, and it is the one integral these derivations need.
 *
 * ∫ ds/s² FROM r TO FOR EVER = 1/r. The sum converges, and it converges to something that
 * still depends on where you started - which is what makes it a field with a scale in it
 * rather than either nothing or everything.
 *
 * THE CONTRAST WITH `gravity.reach` IS THE POINT. There the same machinery is handed a
 * contribution that does NOT fall off, and reports that there is no total. Two integrals,
 * one rule, opposite answers, and the difference is entirely one exponent. Neither was
 * decided in advance.
 */
import { num, sym } from "../Expr.ts";
import { Theorem } from "../Theorem.ts";
import { lattice } from "../probes/lattice.ts";
import { medium } from "../probes/medium.ts";

/** what is at distance s from the charge */
export const AT_S = "what is at s";
/** everything past r, added up */
export const BEYOND = "ε";

export const epsilon: Theorem = {
  id: "charge.beyond",
  asks: "a charge's field falls off as one over the square of the distance. How much of " +
    "it is left beyond a radius r?",
  about: BEYOND,
  probes: [lattice, medium],
  uses: ["gravity.falloff"],
  wants: [{ kind: "equals", of: AT_S, to: [] }],
  glossary: {
    [BEYOND]: { symbol: "ε", says: "everything past r, added up" },
    [AT_S]: { symbol: "1/s^{2}", says: "what is at distance s" },
    r: { symbol: "r", says: "the radius past which the counting starts" },
    s: { symbol: "s", says: "distance, integrated over" },
  },
};

export const definitions = [
  {
    fact: { kind: "equals" as const, of: AT_S, to: sym("s", -2) },
    because: "what a charge leaves at a distance falls off as one over the square of it " +
      "- which is gravity.falloff at D = 3, cited rather than counted again",
    line: `${AT_S} = \\frac{1}{s^{2}}`,
  },
  {
    fact: {
      kind: "integral" as const, of: BEYOND, term: AT_S, in: "s",
      from: sym("r"), to: num(Infinity),
    },
    because: "everything past r is everything at every s from r outwards, added up - and " +
      "there is no outer edge to stop at, so the upper limit is however far you care to go",
    line: `${BEYOND} = \\int_{r}^{∞} ${AT_S} ds`,
  },
];
