/**
 * WHAT AN ANNIHILATION DOES TO A PATH THROUGH THE PLACE IT HAPPENED - and why the lean has
 * no ceiling in it.
 *
 * THE RULE IS THE WHOLE ARGUMENT. An annihilation removes the two points its charges were
 * on and joins what was behind each onto what was behind the other, so the place it
 * happened is left with more space folded into it than its neighbours have. A path
 * arriving there has more ways of going the way the annihilation went than of going any
 * other: one makes it two to one, a second three to one, a third four. Every other way out
 * still weighs exactly what it always did, and there are DEG of those.
 *
 * SO THE COUNT IS `1 + n` AGAINST `1` EACH, DEG OF THEM. Written out that is a lean of
 * n·c̄/DEG - LINEAR IN THE COUNT, with no ceiling anywhere in it, which is the property
 * the rest of the law depends on and the one a saturating mechanism would not have. One
 * annihilation is worth c̄/DEG, which `lattice.lean` establishes and this theorem cites
 * rather than counting again.
 *
 * AND A RATIO IS NOT ALL OF IT. This line compares one direction against the others and
 * throws away how many there are; the ways out of that point no longer number DEG but
 * DEG + n. That second reading is `gravity.metric`, and it is a different theorem because
 * it is a different question about the same count.
 */
import { num, mul, sym } from "../Expr.ts";
import { Theorem } from "../Theorem.ts";
import { counts, CBAR_Q, DEG_Q, LEAN_Q } from "../probes/counts.ts";
import { rules } from "../probes/rules.ts";

/** how many annihilations have happened at this place */
export const COUNT = "n";
/** the lean a path through it picks up, after all of them */
export const LEAN_N = "lean(n)";

export const law: Theorem = {
  id: "gravity.law",
  asks: "n annihilations have happened at a place. How much does a path through it lean, " +
    "and does that stop growing?",
  about: LEAN_N,
  probes: [counts, rules],
  uses: ["lattice.lean"],
  wants: [
    { kind: "value", of: DEG_Q, equals: { n: 0, d: 1 } },
    { kind: "equals", of: LEAN_N, to: [] },
  ],
  glossary: {
    [LEAN_N]: { symbol: "lean", says: "how much a path through the place leans, after n of them" },
    [LEAN_Q]: { symbol: "lean_{1}", says: "what one annihilation is worth" },
    [COUNT]: { symbol: "n", says: "how many annihilations have happened there" },
    [CBAR_Q]: { symbol: "\\bar{c}", says: "a step - one cell a tick" },
    [DEG_Q]: { symbol: "DEG", says: "the ways out of a point - the alternatives not taken" },
  },
};

/**
 * WHAT THIS THEOREM PUTS IN BY HAND - the counting, said once.
 *
 * That n annihilations leave `1 + n` ways of going the way they went while every other
 * way still weighs one, and that the lean is the surplus over the alternatives. Both are
 * readings of the rule rather than claims about the world, and neither has a ceiling in
 * it - which is the thing worth checking about the answer.
 */
export const definitions = [
  {
    fact: {
      kind: "equals" as const, of: LEAN_N,
      to: mul(sym(COUNT), sym(CBAR_Q), sym(DEG_Q, -1)),
    },
    because: "an annihilation gives the direction it went one extra way of being taken, " +
      "so after n of them that direction has 1 + n ways against the 1 each that the " +
      "DEG alternatives still have. The surplus is n, each worth a step, against DEG - " +
      "and a path's lean is that. Note what is NOT here: nothing divides by anything " +
      "that grows with n, so the lean is linear in the count and has no ceiling",
    line: `${LEAN_N} = ${COUNT} · \\frac{\\bar{c}}{${DEG_Q}}`,
  },
];
