/**
 * THE GRAVITATIONAL LAW WITH TRAVEL TIME IN IT - and relativity falls out of the second
 * order, where the first order cancels.
 *
 * NOTHING IN THIS MODEL ACTS AT A DISTANCE. A shortfall crosses one cell a tick, which
 * `medium/what-transport-does` establishes by watching a front that never outruns its own
 * steps - so what a body feels at separation R is not what the other body is doing now
 * but what it was doing R/c̄ ticks ago. `gravity.full` ignores that, which is right for
 * two bodies at rest with respect to each other and wrong the moment they are not.
 *
 * A MOVING SOURCE HAS TWO RETARDED BRANCHES, and this is the same structure
 * `matter.wavelength` uses: one shell set out ahead of the motion and one behind, and
 * they arrive compressed and stretched by 1/(1-β) and 1/(1+β), where β is the speed as a
 * fraction of a cell a tick. You do not know which side of the source you are on, so both
 * are there at half weight - the ignorance is genuine and is not a knob.
 *
 * AND THE FIRST ORDER CANCELS, WHICH IS THE WHOLE POINT. Averaged,
 *
 *     ½[(1-β)^-1 + (1+β)^-1] = ½[(1 + β + β²) + (1 - β + β²)] = 1 + β²
 *
 * The β terms are equal and opposite and go. What survives is the SQUARE - and 1 + β² is
 * 1/(1-β²) to that order, which is γ². So the correction to gravity from travel time is
 * second order in the speed, and it is the Lorentz factor rather than something that
 * merely resembles one.
 *
 * A PROOF TRUNCATED AT FIRST ORDER WOULD CONCLUDE THAT TRAVEL TIME DOES NOTHING, which is
 * why the `small` premise here carries an order and says two. That is a statement about
 * what is being neglected, made where it can be checked, rather than a silent choice.
 *
 * AND THAT IS ONLY ONE OF THREE THINGS TIME DOES HERE, which is worth saying plainly
 * because the line below looks finished and is not. A force is momentum arriving per
 * tick, so every part of that sentence has a clock in it:
 *
 *   1. WHAT ARRIVES IS OLD - the field left R/c̄ ticks ago, and a moving source's two
 *      branches arrive compressed and stretched. That is what this theorem derives.
 *   2. THE SOURCE'S CLOCK - a body's pulse rate IS its mass, so a source whose clock has
 *      slowed emits less often and the far body feels less of it.
 *   3. THE RECEIVER'S CLOCK - "per tick" is per WHOSE tick, and a moving receiver's own
 *      clock is not the lattice's.
 *
 * AND THE CLOCK IS THE BUDGET RULE, which the model already has: a structure gets one
 * action a tick and spends it moving or walking its own graph, not both. That trade IS
 * time dilation here rather than a rival to it - the more of its tick a thing spends
 * updating itself, the less it has left to move with.
 *
 * A FIRST READING OF THAT MADE IT A PLAIN SUBTRACTION, so a thing going at β would tick
 * at 1 - β, and the model would be in open conflict with special relativity. That reading
 * is wrong, and what makes it wrong is elsewhere in the model: A RAY ALWAYS MOVES AT ONE
 * CELL A TICK. Nothing goes slower. What a structure varies is not how fast its
 * constituents move but WHICH WAY - so the two are components of a fixed rate, they add
 * as squares, and the clock runs at sqrt(1 - β²). The Lorentz factor, out of the budget
 * rather than beside it. `budget/what-a-tick-is-spent-on` derives it.
 *
 * WHAT THIS DOES NOT COVER AT ALL. Even with the clocks in, this is a correction to the
 * FORCE. It is not a metric: no null geodesic, and so nothing about light's deflection -
 * the article is explicit that the force law gives "none at all" of that. The metric
 * reading is `gravity.metric`, the same lattice count read a second way, and joining
 * them is a further step neither theorem takes.
 */
import { add, mul, num, sym } from "../Expr.ts";
import { rat } from "../Algebra.ts";
import { Theorem } from "../Theorem.ts";
import { counts, CBAR_Q } from "../probes/counts.ts";
import { medium } from "../probes/medium.ts";
import { budget, CLOCK, LEFT } from "../probes/budget.ts";
import { FORCE as STATIC } from "./full.ts";

/** how fast the two bodies move apart or together, as a fraction of a cell a tick */
export const BETA = "β_{v}";
/** how long the shortfall takes to arrive */
export const DELAY = "τ";
/** the branch that set out ahead of the motion, and the one behind */
export const AHEAD = "ahead";
export const BEHIND = "behind";
/** what the two of them come to, weighted by not knowing which side you are on */
export const RETARD = "retardation";
/** the force with travel time accounted for */
export const FORCE_REL = "F_{g}^{rel}";
/** one over the receiver's clock rate - how many of its ticks a lattice tick is worth */
export const GAMMA = "γ";

/**
 * WHOSE CLOCK THE FORCE IS MEASURED PER - the one thing in this theorem that is chosen
 * rather than derived, so it is made a setting and every choice is shown.
 *
 * A FORCE IS MOMENTUM PER TICK AND THERE ARE THREE CLOCKS IN THE ROOM. The lattice's,
 * which is the one everything is actually computed in; the receiver's, which is the one
 * anything that body does is timed by; and the source's, which sets how often it pulses -
 * and its pulse rate IS its mass. They disagree once the bodies are moving, and which one
 * the answer is quoted in changes the power of γ on the front of it.
 *
 * SO IT IS NOT BURIED IN A DEFINITION. Written as one line inside the proof it looked
 * derived and was not; as a setting it appears on the page beside the answer, the other
 * choices are one click away, and a reader who disagrees knows exactly where to.
 *
 * THE RECEIVER IS THE DEFAULT because that is the clock the body's own dynamics run on:
 * whatever it does with the momentum it receives, it does at its own rate.
 */
export type Perspective = {
  name: string; says: string; power: number;
  /**
   * WHICH BRANCHES ARE WEIGHED, and how. `both` is the ignorant case - a half each, first
   * order cancels. `toward` and `away` are what you get when the sign IS known.
   */
  branch?: "both" | "toward" | "away";
};

/**
 * WHETHER YOU KNOW WHICH SIDE OF THE SOURCE YOU ARE ON - and it changes the ORDER of the
 * answer, not just its size.
 *
 * THE HALF-AND-HALF IS AN IGNORANCE, and ignorance is a physical claim rather than a
 * default. Weighted at a half each the two branches' first-order terms are equal and
 * opposite and cancel, leaving gamma^{2} - isotropic, quadratic, and the same whichever
 * way the source is going. That is right when you genuinely cannot tell, which is the case
 * for a body made of many parts whose phases are anybody's guess.
 *
 * BUT IF YOU KNOW, THE CANCELLATION DOES NOT HAPPEN. 1/(1-b) is 1 + b + b^{2} and 1/(1+b)
 * is 1 - b + b^{2}: keeping one branch keeps a term LINEAR in the speed, which at any
 * ordinary speed is enormously larger than the quadratic one it sits on. At b = 0.1 the
 * approaching case is 10% above the ignorant one and the receding case 10% below, against
 * a gamma^{2} correction of 1%. An order of magnitude, from knowing a sign.
 *
 * WHICH MAKES THIS THE SHARPEST PREDICTION IN THE FOLDER. A first-order, sign-dependent
 * departure from an isotropic force is not a subtle correction - it is the difference
 * between a law that treats approach and recession alike and one that does not. The
 * article's own use of the half is the ignorant case, and it is kept as the default.
 */
export const PERSPECTIVES: Perspective[] = [
  {
    name: "receiver",
    power: 1,
    says: "per the receiving body's own clock, which is the one anything it does with " +
      "the momentum is timed by - so the lattice-rate arrival is divided by how slowly " +
      "that clock runs",
  },
  {
    name: "lattice",
    power: 0,
    says: "per the lattice's own tick, which is the frame everything here is computed " +
      "in - no clock correction at all, only the retardation of what arrives",
  },
  {
    name: "source",
    power: -1,
    says: "per the emitting body's clock, which sets how often it pulses - a slowed " +
      "source emits less often, so less arrives per lattice tick",
  },
  /*
   * AND THE TWO CASES WHERE THE SIGN IS KNOWN, on the receiver's clock so they can be read
   * straight against the default. These are the sharp ones: first order in the speed.
   */
  {
    name: "approaching",
    power: 1,
    branch: "toward",
    says: "per the receiver's clock, knowing the source is coming TOWARD you - so only " +
      "the compressed branch is weighed and the first order does not cancel",
  },
  {
    name: "receding",
    power: 1,
    branch: "away",
    says: "per the receiver's clock, knowing the source is going AWAY - only the " +
      "stretched branch, and the first order survives with the other sign",
  },
];

export const relativistic: Theorem = {
  id: "gravity.relativistic",
  asks: "nothing here acts at a distance - a shortfall crosses one cell a tick. What " +
    "does that do to the gravitational law when the two bodies are moving?",
  about: FORCE_REL,
  probes: [counts, medium, budget],
  uses: ["gravity.full", "mass.period"],
  wants: [
    { kind: "equals", of: DELAY, to: [] },
    { kind: "small", of: BETA, order: 2 },
  ],
  glossary: {
    [FORCE_REL]: { symbol: "F_{g}^{rel}", says: "the gravitational force with travel time accounted for" },
    [STATIC]: { symbol: "F_{g}", says: "the same force between bodies at rest with respect to each other" },
    [RETARD]: { symbol: "γ²", says: "what the two retarded branches come to, averaged" },
    [AHEAD]: { symbol: "ahead", says: "the branch that set out ahead of the motion" },
    [BEHIND]: { symbol: "behind", says: "the one that set out behind it" },
    [BETA]: { symbol: "β", says: "the speed, as a fraction of one cell a tick" },
    [DELAY]: { symbol: "τ", says: "how long the shortfall takes to arrive" },
    [CLOCK]: { symbol: "1/γ", says: "how fast a moving thing's own clock runs - sqrt(1-β²), from the budget" },
    [GAMMA]: { symbol: "γ", says: "one over that - how much a lattice tick is worth in the body's own ticks" },
    [CBAR_Q]: { symbol: "\\bar{c}", says: "a step - one cell a tick" },
  },
};

export const definitions = (view: Perspective) => [
  {
    fact: {
      kind: "equals" as const, of: DELAY,
      to: mul(sym("R"), sym(CBAR_Q, -1)),
    },
    because: "a shortfall advances one cell a tick and no faster - watched as a front " +
      "that never outruns the steps it has taken - so crossing R of them takes R/c̄ " +
      "ticks. What a body feels is what the other was doing that long ago, not what it " +
      "is doing now",
    line: `${DELAY} = \\frac{R}{\\bar{c}}`,
  },
  {
    fact: { kind: "small" as const, of: BETA, order: 2 },
    because: "the bodies move slowly compared with a cell a tick. Kept to SECOND order, " +
      "and that is not a detail: the two branches differ at first order and cancel when " +
      "averaged, so a proof stopping at first order would conclude that travel time does " +
      "nothing at all. The square is the whole of the effect",
    line: `${BETA} << 1`,
  },
  {
    fact: { kind: "equals" as const, of: "1-β", to: add(num(1), mul(num(-1), sym(BETA))) },
    because: "over the delay the source has moved, so the branch that set out ahead of " +
      "the motion left from closer than R and arrives compressed - by one less the " +
      "fraction of a cell a tick it is going",
    line: `1-β = 1 - ${BETA}`,
  },
  {
    fact: { kind: "equals" as const, of: "1+β", to: add(num(1), sym(BETA)) },
    because: "and the branch behind left from further away and arrives stretched by the " +
      "same amount the other way",
    line: `1+β = 1 + ${BETA}`,
  },
  {
    fact: { kind: "raised" as const, of: AHEAD, base: "1-β", to: rat(-1) },
    because: "what arrives from the compressed branch goes as one over that",
    line: `${AHEAD} = (1-β)^{-1}`,
  },
  {
    fact: { kind: "raised" as const, of: BEHIND, base: "1+β", to: rat(-1) },
    because: "and from the stretched one, one over the other",
    line: `${BEHIND} = (1+β)^{-1}`,
  },
  {
    /*
     * WHICH BRANCHES ARE WEIGHED - and this is where knowing a sign changes the ORDER of
     * the answer rather than its size. See the note on `PERSPECTIVES`.
     */
    fact: {
      kind: "equals" as const, of: RETARD,
      to: (view.branch ?? "both") === "toward" ? sym(AHEAD)
        : (view.branch ?? "both") === "away" ? sym(BEHIND)
          : add(mul(num(rat(1, 2)), sym(AHEAD)), mul(num(rat(1, 2)), sym(BEHIND))),
    },
    because: (view.branch ?? "both") === "both"
      ? "you do not know which side of the source you are on, so both branches are there " +
        "at half weight each. This is the same ignorance matter.wavelength weighs, and it " +
        "is not a knob: half is what two possibilities with nothing to tell them apart " +
        "come to. Weighted so, the two first-order terms are equal and opposite and " +
        "cancel - which is why the ignorant answer is quadratic and isotropic"
      : `you KNOW the source is ${view.branch === "toward" ? "approaching" : "receding"}, ` +
        `so only that branch is weighed. The cancellation that made the ignorant case ` +
        `quadratic does not happen, and what is left carries a term LINEAR in the speed - ` +
        `${view.branch === "toward" ? "larger" : "smaller"} than the isotropic answer by ` +
        `about b, which at any ordinary speed dwarfs the b^{2} it sits on`,
    line: (view.branch ?? "both") === "both"
      ? `${RETARD} = \\frac{${AHEAD} + ${BEHIND}}{2}`
      : `${RETARD} = ${view.branch === "toward" ? AHEAD : BEHIND}`,
  },
  {
    /*
     * THE ONE CHOICE IN THIS THEOREM, AND IT IS WORTH CHECKING RATHER THAN THE ALGEBRA.
     *
     * A force is momentum per tick and the question is per WHOSE tick. Measured against
     * the receiver's own clock - which is the clock anything it does is timed by - the
     * lattice-rate arrival is divided by how slowly that clock runs. Everything else here
     * is derived; this line says which clock the answer is in, and a reader who disagrees
     * with it should disagree here rather than further down.
     */
    fact: {
      kind: "equals" as const, of: FORCE_REL,
      /*
       * THE SOURCE'S VIEW USES `clock` AND NOT ONE OVER γ, which is the same quantity
       * said the way this algebra can open. Once the series has been taken, γ is a SUM,
       * and one over a sum is not a sum - so `γ^{-1}` stood in the answer unopened while
       * `clock`, raised from the same base with the opposite power, expands like anything
       * else.
       */
      to: view.power === 0 ? mul(sym(STATIC), sym(RETARD))
        : view.power === 1 ? mul(sym(STATIC), sym(RETARD), sym(GAMMA))
          : mul(sym(STATIC), sym(RETARD), sym(CLOCK)),
    },
    because: `so the force is the one between bodies at rest, times what retardation ` +
      `does to what arrives, quoted ${view.says}. The first order cancels between the ` +
      `two retarded branches and the square survives; the clock then contributes ` +
      `${view.power === 0 ? "nothing, being the frame this is all computed in"
        : view.power === 1 ? "its own half a square" : "half a square the other way"}, ` +
      `out of the budget rule`,
    line: `${FORCE_REL} = ${STATIC} · ${RETARD}` +
      (view.power === 0 ? "" : ` · ${view.power === 1 ? GAMMA : CLOCK}`),
  },
  {
    /*
     * TAKEN FROM THE SAME BASE THE CLOCK IS, not as one over the clock.
     *
     * `clock` is sqrt(1 - β²), and once the series has been taken that is a SUM - and one
     * over a sum is not a sum, so this algebra cannot invert it and the symbol simply
     * stood there unopened in the answer. Raised from the same base with the opposite
     * power it is a series like any other, and the binomial rule opens it.
     */
    fact: { kind: "raised" as const, of: GAMMA, base: LEFT, to: rat(-1, 2) },
    because: "how much a lattice tick is worth in the receiver's own ticks is one over " +
      "how fast that clock runs - the same quantity the budget gave, to the opposite " +
      "power",
    line: `${GAMMA} = (1 - β²)^{-1/2}`,
  },
];
