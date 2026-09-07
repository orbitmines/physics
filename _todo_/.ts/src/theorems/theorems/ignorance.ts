/**
 * THE MATTER WAVE - and the half that is doing real work.
 *
 * A MOVING SOURCE HAS TWO RETARDED BRANCHES and one of them is yours. A place carries the
 * phase the source had when the shell that reached it left, and for a source moving at v
 * there are two such moments - one for a shell that set out ahead of it and one behind:
 *
 *     ahead   t_r = (t - x/c̄) / (1 - v)
 *     behind  t_r = (t + x/c̄) / (1 + v)
 *
 * YOU DO NOT KNOW WHICH SIDE YOU ARE ON, so the two are weighted by how likely each is,
 * which is one half each. That is the only free-looking number in the derivation and it
 * is not free: it is what "you do not know" MEANS when there are two possibilities and
 * nothing to tell them apart. Weighted at a half, the two branches beat against each
 * other and what comes out is de Broglie, exactly.
 *
 * THE HALF IS A TEST, NOT A DETAIL, and the article is emphatic about it. Any other
 * weighting gives a wavelength that is not h/p, so the result is a check on the ignorance
 * being genuine rather than a knob. What is derived below is the beat: the difference of
 * the two branches' rates, to first order in v, which is where the 2v/c̄ that becomes the
 * de Broglie wavelength comes from.
 */
import { add, mul, num, sub, sym } from "../Expr.ts";
import { Theorem } from "../Theorem.ts";
import { counts, CBAR_Q } from "../probes/counts.ts";

/** how fast the source is going, as a fraction of a step a tick */
export const V = "v";
/** what the branch ahead of the source contributes */
export const AHEAD = "ahead";
/** and the one behind */
export const BEHIND = "behind";
/** the difference between them, which is the beat you actually see */
export const BEAT = "beat";

export const ignorance: Theorem = {
  id: "matter.wavelength",
  asks: "a moving source has two retarded branches and you do not know which side you " +
    "are on. What do they leave when they beat against each other?",
  about: BEAT,
  probes: [counts],
  uses: ["mass.period"],
  wants: [{ kind: "small", of: V }],
  glossary: {
    [BEAT]: { symbol: "beat", says: "the difference between the two branches" },
    [AHEAD]: { symbol: "ahead", says: "the branch that set out ahead of the source" },
    [BEHIND]: { symbol: "behind", says: "the one that set out behind it" },
    [V]: { symbol: "v", says: "how fast the source is going" },
    [CBAR_Q]: { symbol: "\\bar{c}", says: "a step - one cell a tick" },
  },
};

export const definitions = [
  {
    fact: { kind: "small" as const, of: V },
    because: "the source is going slowly compared with a step a tick, so the square of " +
      "its speed is smaller still and the first order is the whole of what matters",
    line: `${V} is small`,
  },
  {
    /* 1/(1-v) to first order is 1 + v; the branch ahead runs fast by that much */
    fact: { kind: "equals" as const, of: AHEAD, to: add(num(1), sym(V)) },
    because: "the branch that set out ahead of the source is compressed by its motion - " +
      "the retarded time carries a 1/(1 - v), which to first order in a small speed is " +
      "1 + v",
    line: `${AHEAD} = 1 + ${V}`,
  },
  {
    fact: { kind: "equals" as const, of: BEHIND, to: sub(num(1), sym(V)) },
    because: "the branch behind is stretched by the same motion by the same amount the " +
      "other way - 1/(1 + v), which to first order is 1 - v",
    line: `${BEHIND} = 1 - ${V}`,
  },
  {
    fact: {
      kind: "equals" as const, of: BEAT,
      to: sub(sym(AHEAD), sym(BEHIND)),
    },
    because: "you do not know which side you are on, so both branches are there at half " +
      "weight each and what you see is the two beating against one another - their " +
      "difference. The halves cancel out of the difference, which is why the answer does " +
      "not depend on them being exactly a half but the WAVELENGTH does",
    line: `${BEAT} = ${AHEAD} - ${BEHIND}`,
  },
];
