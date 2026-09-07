/**
 * `share` - how much of the time two charges are opposed, and it is the THEORY's number.
 *
 * THE ARTICLE READS IT AS A PHASE AVERAGE. What matters at a meeting is how much of the
 * time the two are opposed, which for a phase difference ψ is |ψ|/π; a body made of many
 * things has parts whose phases are spread evenly, so what survives is ⟨|ψ|/π⟩ over a
 * uniform ψ, which is exactly one half. That is right, and it is a statement about a
 * theory whose rays carry a phase at all.
 *
 * SO IT IS NOT ONE HALF EVERYWHERE, AND THAT FALLS OUT RATHER THAN BEING STIPULATED.
 * Being opposed, in a theory made of rewrites, means the meeting rule leaves nothing:
 * the pair annihilated. `meeting/what-the-halves-do` already applies the rule to a facing
 * pair in every state that pair can be in - it has to, for the vacuum's density - so the
 * count of states that annihilate is sitting there beside the count that survive. share
 * is the first over the total.
 *
 * WHICH GIVES THE THREE ANSWERS THE THEORIES ACTUALLY HAVE:
 *
 *   G           rays carry no sign, so there is one state and it annihilates      -> 1
 *   G^XOR       four states, two alike and two opposite                           -> 1/2
 *   G^XOR*2     the same four, since a phase does not change what a meeting does  -> 1/2
 *
 * AND THE TWO READINGS AGREE WHERE BOTH APPLY. On a polarised theory the enumeration
 * gives 2/4 and the phase average gives ⟨|ψ|/π⟩ = 1/2 - the same number by two routes,
 * one of them counting states and the other integrating over a continuum. On pure
 * gravity there is no phase to average and only the enumeration has anything to say,
 * which is why the enumeration is what this theorem is built on.
 *
 * IT IS ALSO ONE MINUS THE OCCUPANCY, necessarily: a state either leaves something or it
 * does not. So `vacuum.occupancy` and this are two readings of one count, which is worth
 * seeing - the vacuum's density and the strength of gravity are not independent numbers
 * in this model, they are the same enumeration read from either end.
 */
import { Theorem } from "../Theorem.ts";
import { ANNIHILATING, CASES, meeting } from "../probes/meeting.ts";

/** how much of the time two charges are opposed */
export const SHARE = "share";

export const share: Theorem = {
  id: "share.coherence",
  asks: "how much of the time are two charges opposed, in this theory?",
  about: SHARE,
  probes: [meeting],
  wants: [
    { kind: "value", of: CASES, equals: { n: 0, d: 1 } },
    { kind: "value", of: ANNIHILATING, equals: { n: 0, d: 1 } },
  ],
  glossary: {
    [SHARE]: { symbol: "share", says: "how much of the time two charges are opposed" },
    [ANNIHILATING]: { symbol: "opposed", says: "the states in which the pair annihilates" },
    [CASES]: { symbol: "states", says: "the states a facing pair can be in" },
  },
};

/**
 * THE ONE LINE PUT IN BY HAND, and it is what the word means.
 *
 * Being opposed is the meeting leaving nothing; how much of the time that happens is
 * how many such states there are over how many there are altogether. Both counts come
 * from applying the theory's own rule, so the answer is the theory's.
 */
export const definitions = [
  {
    fact: { kind: "quotient" as const, of: SHARE, over: ANNIHILATING, under: CASES },
    because: "two charges are opposed exactly when their meeting leaves nothing - that " +
      "is what the word means for a rule that either annihilates a pair or does not. " +
      "The states a pair can be in are equally available, so how much of the time they " +
      "are opposed is how many of those states annihilate, over how many there are",
    line: `${SHARE} = \\frac{${ANNIHILATING}}{${CASES}}`,
  },
];
