/**
 * WHERE SPACE COMES FROM - the rewrites, in full, and taken off the theory rather than
 * transcribed.
 *
 * THE ARTICLE LISTS THREE: a neutral point splits into a plus and a minus, a plus and a
 * minus meeting go back to a neutral point, and a move consumes ahead and emits behind.
 * Everything else in the book is those three applied over and over. An inventory is
 * exactly the sort of claim that rots quietly - a rule gets added, a limit takes one away,
 * and the prose still says three - so this theorem does not state the list. It reads it.
 *
 * WHICH MAKES IT A DIFFERENT ANSWER PER THEORY, and that is the point of it: `G` and
 * `G^XOR` are made of the same rewrites doing different things, while a theory built by
 * `Theory.without` reports one fewer without a sentence anywhere having been edited. The
 * count is the answer and the shapes are the working.
 */
import { Theorem } from "../Theorem.ts";
import { REWRITES, rules } from "../probes/rules.ts";

export const space: Theorem = {
  id: "space.rewrites",
  asks: "what is this theory made of - and how many rewrites does making space out of " +
    "nothing actually take?",
  about: REWRITES,
  probes: [rules],
  wants: [{ kind: "value", of: REWRITES, equals: { n: 0, d: 1 } }],
  glossary: {
    [REWRITES]: { symbol: "rewrites", says: "the rules this theory is made of" },
  },
};
