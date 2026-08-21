/**
 * WHAT THE VACUUM SETTLES AT - and the first answer here that is the THEORY's rather
 * than the lattice's.
 *
 * THE MECHANISM IS ONE SENTENCE. (G/2) splits every neutral point every tick, and each
 * split puts two halves of one inserted point onto the two ends of a shared edge, facing
 * each other. Whether that inserted point is still there afterwards is decided entirely
 * by what the meeting rule does to the pair. So the density is a FRACTION OF CASES: how
 * many of the states a facing pair can be in leave something behind, over how many states
 * there are.
 *
 * WHICH MAKES IT EXACT AND MAKES IT ENUMERABLE. `meeting/what-the-halves-do` applies the
 * theory's own rule to a real facing pair in every one of those states and counts. There
 * are four in a theory whose rays carry a sign and one in a theory whose rays do not, so
 * the enumeration is complete - nothing sampled, nothing averaged, and no run length or
 * box able to change it.
 *
 * AND IT REPRODUCES THE THREE NUMBERS THE ARTICLE QUOTES, from the rules rather than from
 * a rate: 0 for pure gravity, 1/2 for gravity with magnetism, 1 for a medium that
 * destroys nothing. The half is the figure this book uses throughout, and it is here
 * because half the meetings are alike - which is the same sentence as "magnetism expands
 * space and gravity does not".
 *
 * NOTE WHAT IS NOT CLAIMED. This is the fraction of what the vacuum MAKES that survives
 * its own first meeting. On a polarised theory the lattice then has its own say in where
 * the balance finally lands, because creation goes as (1-f)^DEG - `Checks.vacuumFill`
 * reports that separately and declines to judge it. What is proved here is the rule's
 * share of the answer, which is the part that does not depend on the tiling.
 */
import { Theorem } from "../Theorem.ts";
import { CASES, meeting, OCCUPANCY, SURVIVING } from "../probes/meeting.ts";

export const occupancy: Theorem = {
  id: "vacuum.occupancy",
  asks: "the vacuum makes space by splitting a point into two halves that meet. How " +
    "much of what it makes is still there afterwards?",
  about: OCCUPANCY,
  probes: [meeting],
  wants: [
    { kind: "value", of: CASES, equals: { n: 0, d: 1 } },
    { kind: "value", of: SURVIVING, equals: { n: 0, d: 1 } },
  ],
  glossary: {
    [OCCUPANCY]: { symbol: "f", says: "how much of what the vacuum makes survives its first meeting" },
    [CASES]: { symbol: "cases", says: "the states a facing pair can be in" },
    [SURVIVING]: { symbol: "surviving", says: "how many of them leave something behind" },
  },
};

/**
 * THE ONE LINE PUT IN BY HAND, and it is what the question means.
 *
 * Saying that the occupancy is the surviving states over all the states is a definition
 * of what is being asked, not a claim about the answer; both counts come from applying
 * the theory's own rule.
 */
export const definitions = [
  {
    fact: { kind: "quotient" as const, of: OCCUPANCY, over: SURVIVING, under: CASES },
    because: "every point the vacuum makes arrives as one facing pair, and the states " +
      "such a pair can be in are equally available - so how much of what is made is " +
      "still there is how many states leave something behind, over how many there are",
    line: `${OCCUPANCY} = \\frac{${SURVIVING}}{${CASES}}`,
  },
];
