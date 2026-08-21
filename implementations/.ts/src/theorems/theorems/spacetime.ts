/**
 * THE TWO READINGS PUT TOGETHER - and they turn out to be reciprocal, which is what makes
 * the metric general relativity's.
 *
 * ONE COUNT, READ TWICE. `gravity.law` compares the direction that took an annihilation
 * against the ones that did not: a ratio, which is the pull, and which taken alone gives
 * a sixth of Mercury's perihelion advance and none at all of light's deflection.
 * `gravity.metric` reads the same count the other way - the ways out of that point no
 * longer number DEG but DEG + n - which is a stretching of space rather than a lean, and
 * needs no tensor because at this order it is one number per place.
 *
 * PUT SIDE BY SIDE THEY ARE INVERSES. The lean makes time run slow where the count is
 * high and the stretch makes space long there, by the same amount:
 *
 *     A = 1 - 2u        B = 1 + 2u        A·B = 1 - 4u²  =  1  to this order
 *
 * so A = 1/B, and the metric is
 *
 *     ds² = -A dt² + B dr²        with A·B = 1
 *
 * THAT PRODUCT BEING ONE IS THE WHOLE CONTENT. It is what Schwarzschild has in isotropic
 * form, and it is not something put in here: it falls out of the two readings being of
 * ONE count, so whatever the count does to the ways through a point it does inversely to
 * the ways round it. A model where the time part and the space part came from separate
 * mechanisms would have no reason to satisfy it.
 *
 * AND IT IS CHECKED BY INTEGRATION, not by inspection. `orbits/what-the-metric-does`
 * hands this metric and Schwarzschild to one stepper and measures how far a perihelion
 * moves: six sixths is general relativity's own answer, and the counted metric comes out
 * at 6.08, 6.11 and 6.01 on three different orbits. Newton, integrated as the actual
 * inverse-square law on the same stepper, closes to one part in two thousand - so the
 * agreement is the metric's and not the integrator's.
 *
 * AND LIGHT'S DEFLECTION IS THE HARDER HALF OF THE CHECK. The force law alone gives none
 * of it - a massless corpuscle feels no force law - so bending is where the second
 * reading of the count either earns its place or does not. Through the same Hamiltonian
 * with a null normalisation, the counted metric bends light by 1.0003 to 1.0010 of what
 * general relativity does, and both sit on general relativity's own 4M/b. So the metric
 * supplies exactly what the force law could not.
 */
import { add, mul, num, sym } from "../Expr.ts";
import { Theorem } from "../Theorem.ts";
import { counts } from "../probes/counts.ts";
import { BENDING, orbits, SIXTHS } from "../probes/orbits.ts";
import { B_Q, U } from "./metric.ts";

/** the time part of the metric - what the lean does to a clock */
export const A_Q = "A";
/** the two of them multiplied, which is the claim */
export const PRODUCT = "A·B";

export const spacetime: Theorem = {
  id: "gravity.spacetime",
  asks: "the lean and the stretch are two readings of one count. Put together, what " +
    "metric do they make - and does it move a perihelion the way general relativity does?",
  about: PRODUCT,
  probes: [counts, orbits],
  uses: ["gravity.metric", "gravity.law"],
  wants: [
    { kind: "equals", of: A_Q, to: [] },
    { kind: "equals", of: B_Q, to: [] },
    { kind: "value", of: SIXTHS, equals: { n: 6, d: 1 } },
    { kind: "value", of: BENDING, equals: { n: 1, d: 1 } },
  ],
  glossary: {
    [PRODUCT]: { symbol: "A·B", says: "the time part times the space part" },
    [A_Q]: { symbol: "A", says: "the time part - what the lean does to a clock" },
    [B_Q]: { symbol: "B", says: "the space part - the ways out, read as a stretch" },
    [U]: { symbol: "u", says: "the potential" },
    [SIXTHS]: { symbol: "sixths", says: "the perihelion advance against general relativity's, six being its own" },
    [BENDING]: { symbol: "bending", says: "how far light is bent, against general relativity's - one being agreement" },
  },
};

export const definitions = [
  {
    fact: { kind: "equals" as const, of: A_Q, to: add(num(1), mul(num(-2), sym(U))) },
    because: "the lean makes a clock run slow where the count is high - that is the " +
      "first reading, the one gravity.law takes, and in the potential it is 1 - 2u. The " +
      "factor of two is the normalisation u carries, not a step",
    line: `${A_Q} = 1 - 2${U}`,
  },
  {
    fact: { kind: "equals" as const, of: PRODUCT, to: mul(sym(A_Q), sym(B_Q)) },
    because: "the metric is ds² = -A dt² + B dr², so what there is to ask about the two " +
      "together is their product. Multiplied out it is (1 - 2u)(1 + 2u) = 1 - 4u², which " +
      "is one to this order - the two readings are INVERSES. That is what Schwarzschild " +
      "has in isotropic form, and it is not put in here: it follows from both being " +
      "readings of one count, so what the count does to the ways through a point it does " +
      "inversely to the ways round it",
    line: `${PRODUCT} = ${A_Q} · ${B_Q}`,
  },
  {
    fact: { kind: "small" as const, of: U },
    because: "the potential is small wherever this is asked - far outside anything dense " +
      "- so its square is smaller still and the first order is the whole of it",
    line: `${U} << 1`,
  },
];
