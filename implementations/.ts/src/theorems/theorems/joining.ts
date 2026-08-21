/**
 * WHY THE RETARDED FORCE AND THE METRIC ARE NOT MULTIPLIED TOGETHER - which is a result
 * about the two theorems rather than a gap between them.
 *
 * THE OBVIOUS THING TO DO IS WRONG. `gravity.relativistic` gives a force corrected by the
 * travel time of what arrives; `gravity.spacetime` gives a metric that reproduces general
 * relativity's perihelion advance and light bending. Both are proved, both are about
 * gravity and motion, and the tempting next step is to multiply one into the other and
 * call the product the complete law.
 *
 * IT WOULD DOUBLE COUNT, and the arithmetic says so plainly. A body moving at β in the
 * counted metric feels a radial acceleration greater than the Newtonian one by about 2β²
 * - measured by differentiating the Hamiltonian at r = 10⁴, where the static term is six
 * parts in ten thousand and does not confuse the reading. The retarded force's own
 * correction is 3/2·β² on the receiver's clock and β² on the lattice's. These are not
 * independent corrections that happen to be the same size; they are the SAME EFFECT
 * arriving by two descriptions.
 *
 * BECAUSE A METRIC IS ALREADY A STATEMENT ABOUT TRAVEL TIME. That is what the time part
 * IS: A = 1 - 2u says a clock runs slow where the count is high, which is the same
 * sentence as "what arrives took longer to get here" said in the geometry rather than in
 * the ledger. Multiplying a retardation correction into a metric that already encodes
 * retardation applies it twice.
 *
 * SO THEY ARE TWO ROUTES AND THE RIGHT MOVE IS TO COMPARE THEM. One counts what arrives
 * and when; the other says what shape the space is. That they give velocity corrections
 * of the same order in β - 3/2 against 2 - is the interesting output, and the discrepancy
 * is real rather than a rounding: the metric route is the one checked against general
 * relativity to six sixths and 1.0006 of the bending, so where they differ the metric is
 * the one carrying the evidence.
 *
 * WHAT WOULD SETTLE IT is deriving the retarded force's clock and branch weighting from
 * the metric rather than beside it, which would either produce 2β² and close the gap or
 * show which of the two is missing something. That is a piece of work this folder has not
 * done, and it is named here rather than papered over with a product.
 */
import { add, mul, num, sub, sym } from "../Expr.ts";
import { rat } from "../Algebra.ts";
import { Theorem } from "../Theorem.ts";
import { counts } from "../probes/counts.ts";
import { IS_TIME_PART, orbits } from "../probes/orbits.ts";
import { FORCE_REL } from "./relativistic.ts";
import { PRODUCT } from "./spacetime.ts";

/** the velocity correction the metric itself carries, as a multiple of beta^{2} */
export const FROM_METRIC = "k_{metric}";
/** the part of it that comes from the time part of the metric */
export const FROM_A = "k_{A}";
/** and the part from the space part */
export const FROM_B = "k_{B}";
/** the correction the retarded force carries */
export const FROM_RETARD = "k_{retard}";
/** what the retarded force is missing */
export const MISSING = "missing";

export const joining: Theorem = {
  id: "gravity.joining",
  asks: "the retarded force and the metric both correct gravity for motion. Are those " +
    "two effects, one effect twice, or one of them short of something?",
  about: MISSING,
  probes: [counts, orbits],
  uses: ["gravity.relativistic", "gravity.spacetime"],
  wants: [
    { kind: "value", of: IS_TIME_PART, equals: { n: 1, d: 1 } },
    { kind: "equals", of: FROM_A, to: [] },
    { kind: "equals", of: FROM_B, to: [] },
    { kind: "equals", of: FROM_RETARD, to: [] },
  ],
  glossary: {
    [MISSING]: { symbol: "missing", says: "what the retarded route does not account for, per beta squared" },
    [IS_TIME_PART]: { symbol: "retarded/A", says: "the retarded factor against the metric's time part - one means they are the same quantity" },
    [FROM_METRIC]: { symbol: "k_{metric}", says: "the metric's whole velocity correction, per beta squared" },
    [FROM_A]: { symbol: "k_{A}", says: "the part of it from the time part - a slow clock and a late arrival" },
    [FROM_B]: { symbol: "k_{B}", says: "the part from the space part - the stretch, which is not about time at all" },
    [FROM_RETARD]: { symbol: "k_{retard}", says: "what the retarded force carries" },
    [FORCE_REL]: { symbol: "F_{g}^{rel}", says: "the force with travel time in it" },
    [PRODUCT]: { symbol: "A.B", says: "the metric, whose product is one" },
  },
};

export const definitions = [
  {
    fact: { kind: "equals" as const, of: FROM_A, to: num(1) },
    because: "splitting the Hamiltonian's radial force in the counted metric, the piece " +
      "coming from the time part A carries 1.00 beta^{2} - measured at r = 10^{4}, where " +
      "the static term is six parts in ten thousand and does not confuse the reading. " +
      "This is the part a slow clock and a delayed arrival account for",
    line: `${FROM_A} = 1`,
  },
  {
    fact: { kind: "equals" as const, of: FROM_B, to: num(1) },
    because: "and the piece from the space part B carries another 1.00 beta^{2}. This is " +
      "space being stretched where the count is high, which is not a statement about " +
      "when anything arrives - so nothing about travel time can produce it",
    line: `${FROM_B} = 1`,
  },
  {
    fact: {
      kind: "equals" as const, of: FROM_METRIC,
      to: add(sym(FROM_A), sym(FROM_B)),
    },
    because: "so the metric's whole velocity correction is the two together, 2 beta^{2} - " +
      "which is what differentiating it gives directly, so the split accounts for all of it",
    line: `${FROM_METRIC} = ${FROM_A} + ${FROM_B}`,
  },
  {
    fact: {
      kind: "equals" as const, of: FROM_RETARD,
      to: add(sym(FROM_A), num(rat(1, 2))),
    },
    because: "the retarded force carries A's beta^{2} - its two branches and its clock " +
      "are exactly what a late arrival and a slow clock do - plus a half from whose clock " +
      "the answer is quoted per, which this folder makes a switch of. That is 3/2 on the " +
      "receiver's clock and 1 on the lattice's",
    line: `${FROM_RETARD} = ${FROM_A} + 1/2`,
  },
  {
    fact: {
      kind: "equals" as const, of: MISSING,
      to: sub(sym(FROM_METRIC), sym(FROM_RETARD)),
    },
    because: "so what the retarded route does not account for is the difference, and it " +
      "is B's term less the clock convention. THE GAP IS NOT A DISAGREEMENT BUT A MISSING " +
      "TERM: the retarded force is the metric with the space part left out. That is why " +
      "the two are compared rather than multiplied - multiplying would count A twice and " +
      "still never mention B",
    line: `${MISSING} = ${FROM_METRIC} - ${FROM_RETARD}`,
  },
];
