/**
 * THE COUNTING CONDITION - and it is where quantum mechanics stops being a postulate here.
 *
 * WHAT THIS FOLDER ALREADY HAD WAS HALF A RELATION. `matter.wavelength` takes the two
 * retarded branches of a moving source, weights them at a half each because you do not
 * know which side you are on, and gets the beat: 2v, to first order. That is the right
 * shape and it is not a length, so nothing could be made to FIT in anything.
 *
 * `standing/what-two-branches-leave` gets the length, by building the phase field and
 * bracketing it rather than by evaluating a formula: the nodes of the envelope are
 * pi·lbar/(gamma·v) apart, which is HALF a de Broglie wavelength, and it arrives as a half
 * rather than as a whole because that is the form a standing wave needs.
 *
 * AND THEN THE WHOLE OF IT IS COUNTING. Nodes half a wavelength apart means a region of
 * size r holds a WHOLE NUMBER of them - there is no such thing as most of a node - so
 *
 *     r = n · lambda_dB/2        and therefore        p·r = n·pi·hbar
 *
 * which is de Broglie, or the uncertainty principle, or the Bohr condition, depending on
 * which of them you were expecting. NONE OF THE THREE IS ASSUMED. What is assumed is that
 * a ray carries its emitter's phase and goes one cell a tick, which are two rules this
 * model has for other reasons entirely.
 *
 * WHAT IS OWED, AND THE ARTICLE IS EXPLICIT ABOUT IT. Against the p = hbar/r that a
 * variational estimate uses, this is a factor of pi out - the familiar gap between a
 * hard-walled box mode and the estimate that happens to make the Coulomb problem exact.
 * SO THE FORM IS DERIVED AND AN O(1) BOUNDARY FACTOR IS NOT, which is the same O(1) that
 * separates a box from an atom in ordinary quantum mechanics. It is written into the
 * conclusion as pi rather than absorbed, so that a reader can see exactly what is owed.
 *
 * AND WHAT IS NOT OWED: the n. The integer is not a quantum number anybody imposed, it is
 * how many nodes fit, and a node is a place where two branches of one emitter's own phase
 * cancel. That is the piece `atom.hydrogen` needs and the reason this theorem exists.
 */
import { mul, sym } from "../Expr.ts";
import { Theorem } from "../Theorem.ts";
import { CARRIER, GAMMA, HALFWAVE, LBAR, PI, VEL, standing } from "../probes/standing.ts";
import { counts } from "../probes/counts.ts";

/**
 * HOW MANY NODES FIT IN THE REGION - a whole number, because a node is not divisible.
 *
 * SET AS `n` AND NAMED SOMETHING ELSE, which is worth a line because it looks like
 * fussiness and is not. `n` is already three quantities in this folder - the vacuum's
 * density in `transport`, the count of annihilations at a place in `gravity.law`, and the
 * carrier density in `handoff` - and they never meet, because a theorem only ever sees the
 * premises its own probes emitted. `npm run discover` puts EVERY probe into one store, and
 * there four different quantities called `n` become one. This one carries a `constant`
 * fact, so the collision would not merely confuse a page: it would freeze the vacuum's
 * density and quietly change what the sweep could derive. The glossary sets it as `n` and
 * the page reads as it should.
 */
export const NODES = "nodes";
/** how big the region is */
export const RADIUS = "r";
/** the momentum of whatever is standing in it */
export const MOM = "p";
/** the quantum of action, which is what lbar is a mass measured in */
export const HBAR = "\\hbar";
/** momentum times size - the thing the counting condition is actually about */
export const ACTION = "p·r";

export const debroglie: Theorem = {
  id: "matter.debroglie",
  asks: "the nodes of a moving emitter's own beat are half a wavelength apart, and a " +
    "node is not divisible. What does a region of a given size hold?",
  about: ACTION,
  probes: [standing, counts],
  uses: ["matter.wavelength", "mass.period"],
  wants: [
    { kind: "equals", of: HALFWAVE, to: [] },
  ],
  glossary: {
    [ACTION]: { symbol: "p·r", says: "the momentum of what is standing in the region, times the size of the region" },
    [MOM]: { symbol: "p", says: "the momentum of what is standing in it" },
    [RADIUS]: { symbol: "r", says: "how big the region is" },
    [NODES]: { symbol: "n", says: "how many nodes fit in it - a whole number, because half a node is not a node" },
    [HALFWAVE]: { symbol: "\\lambda_{dB}/2", says: "the spacing between nodes of the envelope, measured off the phase field" },
    [CARRIER]: { symbol: "\\lambda_{C}", says: "the carrier running under that envelope - the Compton length, measured the same way" },
    [LBAR]: { symbol: "\\bar{\\lambda}", says: "the emitter's own rest wavelength, which is what this model measures a mass in" },
    [GAMMA]: { symbol: "\\gamma", says: "how much the emitter's clock is slowed by going" },
    [VEL]: { symbol: "v", says: "how fast it is going, as a fraction of one cell a tick" },
    [HBAR]: { symbol: "\\hbar", says: "the quantum of action - here a unit conversion, since a mass in this model IS a wavelength" },
    [PI]: { symbol: "\\pi", says: "a phase turned all the way round" },
  },
};

/**
 * THE THREE LINES PUT IN BY HAND, and each of them is a definition rather than a claim.
 *
 * THE FIRST IS THE WHOLE THEOREM AND IT IS ARITHMETIC. If the nodes are a fixed distance
 * apart then the number of them in a region is the region over that distance. The only
 * physical content is that n is a WHOLE NUMBER, and that is not an assumption about
 * quantisation - it is what a node being an indivisible thing means.
 *
 * THE SECOND SAYS WHAT MOMENTUM IS in a model that measures a mass as a wavelength. lbar
 * is hbar/(m·c), so m is hbar/(lbar·c), and p = gamma·m·v is gamma·v·hbar/lbar with c = 1.
 * There is no physics in that line, only the unit the rest of the folder already uses.
 *
 * THE THIRD IS THE PRODUCT ITSELF, written down so that the two can be multiplied where a
 * reader can watch gamma and v cancel - which is the whole reason the answer has neither
 * of them in it and holds at every speed rather than only at slow ones.
 */
export const definitions = [
  {
    fact: { kind: "equals" as const, of: RADIUS, to: mul(sym(NODES), sym(HALFWAVE)) },
    because: "the nodes are a fixed distance apart, so how many of them a region holds " +
      "is the region divided by that distance - and a region holding n of them is n of " +
      "them long. THE ONLY PHYSICS IN THIS LINE IS THAT n IS A WHOLE NUMBER, and that is " +
      "not a quantisation postulate: a node is a place where the emitter's two branches " +
      "cancel, and there is no such thing as most of one",
    line: `${RADIUS} = ${NODES} · ${HALFWAVE}`,
  },
  {
    fact: {
      kind: "equals" as const, of: MOM,
      to: mul(sym(HBAR), sym(LBAR, -1), sym(GAMMA), sym(VEL)),
    },
    because: "and momentum is gamma·m·v. This model measures a mass as a wavelength - " +
      "lbar is hbar/(m·c), which is what `mass.period` divides the budget by - so m is " +
      "hbar/(lbar·c) and p is gamma·v·hbar/lbar at c = 1. A unit conversion and nothing " +
      "else: there is no claim in this line that is not already in the definition of lbar",
    line: `${MOM} = \\frac{${HBAR}}{${LBAR}}·${GAMMA}·${VEL}`,
  },
  {
    fact: { kind: "equals" as const, of: ACTION, to: mul(sym(MOM), sym(RADIUS)) },
    because: "and the two are multiplied here rather than at the end, so that a reader " +
      "can watch what cancels. The momentum carries gamma·v and the node spacing carries " +
      "its reciprocal - that is the same gamma and the same v, because the emitter whose " +
      "phase makes the nodes is the thing whose momentum is being counted. So they go, " +
      "and what is left has neither a speed nor a Lorentz factor in it, which is why this " +
      "holds at any speed rather than only at a slow one",
    line: `${ACTION} = ${MOM} · ${RADIUS}`,
  },
];
