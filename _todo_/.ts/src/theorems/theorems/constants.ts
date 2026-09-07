/**
 * WHAT ONE ANNIHILATION BUYS A PATH - c̄ over DEG, and the only constant in the dynamics.
 *
 * THE ARTICLE'S OWN CLAIM ABOUT ITSELF IS THAT THIS IS A RATIO OF TWO COUNTS, and here it
 * is, worked out. An annihilation leaves the place it happened with more space folded
 * into it than its neighbours have, so a path arriving there has one extra way of going
 * the way the annihilation went. Every other way out still weighs exactly what it always
 * did, and there are DEG of those. The lean is therefore one against DEG - and both
 * numbers came off the tiling rather than off a fit.
 *
 * IT COMES OUT DIFFERENT ON DIFFERENT LATTICES, which is the point of running it on all
 * of them: c̄/26 on cubic-26 (the article's own figure), c̄/12 on fcc-12, c̄/6 on cubic-6.
 * The ratio is the same; the number is the tiling's - which is why the answer is written
 * as the ratio with the number after it, rather than as the number alone.
 *
 * THERE IS NO CONSTANT CALLED `BIAS` HERE. It was a name for c̄/DEG, and a name for a
 * ratio of two counts is a place for the two counts to get lost: `BIAS = 1/26` is a
 * number a reader has to take on trust, while c̄/DEG says what it is and stays true on a
 * lattice where the number is different. Where a formula wants it, it gets c̄/DEG.
 */
import { Theorem } from "../Theorem.ts";
import { counts, CBAR_Q, CYCLE_Q, DEG_Q, LEAN_Q, SHEET_C } from "../probes/counts.ts";

export const constants: Theorem = {
  id: "lattice.lean",
  asks: "what is one annihilation worth to a path, on this lattice?",
  about: LEAN_Q,
  probes: [counts],
  wants: [
    { kind: "value", of: DEG_Q, equals: { n: 0, d: 1 } },
    { kind: "value", of: CBAR_Q, equals: { n: 1, d: 1 } },
  ],
  glossary: {
    [LEAN_Q]: { symbol: "lean", says: "what one annihilation is worth to a path" },
    [CBAR_Q]: { symbol: "\\bar{c}", says: "a step - one cell a tick, the lattice's own speed" },
    [DEG_Q]: { symbol: "DEG", says: "the ways out of a point - the alternatives not taken" },
    [SHEET_C]: { symbol: "SHEET", says: "how many charges one pulse lets go" },
    [CYCLE_Q]: { symbol: "CYCLE", says: "how many steps a turn takes" },
  },
};

/**
 * THE ONE LINE PUT IN BY HAND, and it is what the word means.
 *
 * BIAS compares the direction that took an annihilation against the ones that did not.
 * That is a ratio, and saying which two things are being divided is a definition rather
 * than a measurement; both of the numbers in it are counted by the probe.
 */
export const definitions = [
  {
    fact: { kind: "quotient" as const, of: LEAN_Q, over: CBAR_Q, under: DEG_Q },
    because: "an annihilation gives the direction it went one extra way of being taken, " +
      "while every other way out of that point still weighs exactly what it did before - " +
      "and there are DEG of those. So the lean is a step against DEG: what the " +
      "annihilation bought, over the alternatives it did not take. The numerator is \\bar{c} " +
      "rather than a bare 1 because what it bought is a step, and a step is \\bar{c}",
    line: `${LEAN_Q} = \\frac{${CBAR_Q}}{${DEG_Q}}`,
  },
];
