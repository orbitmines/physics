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
import { add, mul, num, sub, sym } from "../Expr.ts";
import { expo, rat } from "../Algebra.ts";
import { Theorem } from "../Theorem.ts";
import { counts, CBAR_Q } from "../probes/counts.ts";
import { medium } from "../probes/medium.ts";
import { budget, CLOCK, GAMMA_Q, LEFT } from "../probes/budget.ts";
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
/*
 * THERE WAS A LOCAL `GAMMA` HERE and it was the same string as the budget probe's, so the
 * line defining one in terms of the other said gamma = gamma - a self-reference, filtered
 * out everywhere, and the reason gamma stood unopened in the finished law. The budget
 * probe's is the only one, and it comes with a definition.
 */

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
/**
 * WHICH BODY IS MOVING, AND WHOSE CLOCK THE ANSWER IS QUOTED IN - two different axes that
 * were one switch until a reader asked why the source's factor was the receiver's
 * inverted, and the honest answer turned out to be that they are not the same kind of
 * thing at all.
 *
 * THE OLD SWITCH OFFERED THREE "PERSPECTIVES" - lattice, receiver, source - as though they
 * were three ways of quoting one situation. Two of them were not. The receiver's factor is
 * a DENOMINATOR conversion: a force is momentum per tick, its clock runs slow, so fewer of
 * its ticks pass and the same arriving momentum is attributed to each. Nothing physical
 * changed. The source's factor is a NUMERATOR reduction: a slowed source pulses less
 * often - its pulse rate IS its mass - so less momentum actually arrives. That is not a
 * change of units, it is a change in what happens, and it belongs in the law.
 *
 * AND THEY APPLY TO DIFFERENT BODIES MOVING. Retardation is about a source whose shells
 * left from ahead and behind; clock dilation is about whichever body is going somewhere.
 * With one beta and no statement of whose speed it was, the switch quietly mixed two
 * physical setups with one bookkeeping choice.
 *
 * SO IT IS SPLIT. `moving` says which body has the speed - that is physics, and it changes
 * what the law IS. `clock` says whose ticks the answer is counted in - that is
 * bookkeeping, and it changes only what a given observer writes down. The numbers that
 * come out are the ones the old switch gave; what changes is that each is now attached to
 * a situation rather than to a preference.
 */
/**
 * THE WHOLE THING AS ONE LAW, with what varies carried as two numbers rather than as five
 * separate derivations.
 *
 * FIVE CASES WERE FIVE STATEMENTS OF THE SAME EQUATION. Source moving or receiver moving,
 * counted in the lattice's ticks or the body's own, knowing which side you are on or not -
 * each was proved separately and each came out a power of gamma times something. Set out
 * that way the shared structure is invisible and a reader has to compare five lines to
 * find it. It is one law:
 *
 *     F^rel = F . (w.ahead + (1-w).behind) . gamma^k
 *
 * and everything that differed between the cases is w and k.
 *
 * AND THE WEIGHT IS GEOMETRY, NOT KNOWLEDGE - which is a correction to how this was first
 * written. The share of the motion that lies along the line between the two bodies is
 * (1 + cos t)/2, where t is the angle between the source's velocity and that line: one
 * when it comes straight at you, nought when it goes straight away, a half across. So the
 * weight is not something you believe about the situation, it is the situation, and
 * writing it as a state of knowledge made a fact about angles look like a fact about the
 * observer.
 *
 * WHICH COLLAPSES THE WHOLE FIRST-ORDER TERM TO ONE THING. Put over a common denominator
 * the two branches are [w(1+b) + (1-w)(1-b)]/[(1-b)(1+b)], whose numerator is
 * 1 + (2w-1)b - and (2w-1) is exactly cos t. So the bracket is
 *
 *     1 + b.cos t   =   1 + b_r
 *
 * the LINE-OF-SIGHT speed, and nothing else. The first order depends on the radial
 * velocity and the gamma on the total one, which is the shape relativistic Doppler has.
 *
 * AND HALF IS TRANSVERSE, NOT UNKNOWN. Worth being exact about, because the first
 * version of this file said the opposite. Averaging 1/(1 - b.cos t) over a sphere gives
 * 1.0034 at b = 0.1; the two branches at half weight give gamma^{2} = 1.0101. They are
 * different numbers. What w = 1/2 describes is motion ACROSS the line of sight, which has
 * no radial component and so no first-order term - not an average over directions nobody
 * knows.
 *
 * k IS WHOSE CLOCK, and it counts: plus one if the answer is in the receiver's own ticks,
 * minus one if the source is the one moving and so pulsing less often, nought in the
 * lattice's own frame. Two effects and one exponent, because both are the same kind of
 * thing - a rate counted against a clock that is not the lattice's. It is not a free
 * number either: it is two facts about the setup, added.
 */

/** the angle between the source's motion and the line between the two bodies */
export const COS = "cos(θ)";
/** the share of that motion lying along the line - (1 + cos θ)/2, so geometry not belief */
export const WEIGHT = "w";
/** +1 when the answer is in the receiver's own ticks */
export const M_R = "m_{r}";
/** +1 when the source is the one moving, and so pulsing less often */
export const M_S = "m_{s}";

export const relativistic: Theorem = {
  id: "gravity.relativistic",
  asks: "nothing here acts at a distance - a shortfall crosses one cell a tick. What " +
    "does that do to the gravitational law when the two bodies are moving?",
  about: FORCE_REL,
  probes: [counts, medium, budget],
  uses: ["gravity.full", "mass.period"],
  wants: [
    { kind: "equals", of: DELAY, to: [] },
    { kind: "equals", of: RETARD, to: [] },
  ],
  glossary: {
    [FORCE_REL]: { symbol: "F_{g}^{rel}", says: "the gravitational force with travel time accounted for" },
    [STATIC]: { symbol: "F_{g}", says: "the same force between bodies at rest with respect to each other" },
    /* NOT called gamma^{2} - that is what it is DERIVED to be, and naming it so in
     * advance makes the derivation look like a restatement of its own conclusion */
    [RETARD]: { symbol: "retardation", says: "what the two branches come to, weighted by the angle" },
    [AHEAD]: { symbol: "ahead", says: "the branch that set out ahead of the motion" },
    [BEHIND]: { symbol: "behind", says: "the one that set out behind it" },
    [BETA]: { symbol: "β", says: "the speed, as a fraction of one cell a tick" },
    [WEIGHT]: { symbol: "w", says: "the share of the motion lying along the line between them - (1 + cos θ)/2" },
    [COS]: { symbol: "cos(θ)", says: "the angle between the source's motion and the line between the two bodies" },
    [M_R]: { symbol: "m_{r}", says: "1 when the answer is counted in the receiver's own ticks" },
    [M_S]: { symbol: "m_{s}", says: "1 when the source is the one moving, and so pulsing less often" },
    [DELAY]: { symbol: "τ", says: "how long the shortfall takes to arrive" },
    [CLOCK]: { symbol: "1/γ", says: "how fast a moving thing's own clock runs - sqrt(1-β²), from the budget" },
    [CBAR_Q]: { symbol: "\\bar{c}", says: "a step - one cell a tick" },
  },
};

export const definitions = [
  {
    fact: { kind: "equals" as const, of: DELAY, to: mul(sym("R"), sym(CBAR_Q, -1)) },
    because: "a shortfall advances one cell a tick and no faster - watched as a front " +
      "that never outruns the steps it has taken - so crossing R of them takes R/c̄ " +
      "ticks. What a body feels is what the other was doing that long ago, not what it " +
      "is doing now",
    line: `${DELAY} = \\frac{R}{\\bar{c}}`,
  },
  {
    fact: { kind: "equals" as const, of: "(1-β)", to: add(num(1), mul(num(-1), sym(BETA))) },
    because: "over the delay the source has moved, so the branch that set out ahead of " +
      "the motion left from closer than R and arrives compressed - by one less the " +
      "fraction of a cell a tick it is going",
    line: `(1-β) = 1 - ${BETA}`,
  },
  {
    fact: { kind: "equals" as const, of: "(1+β)", to: add(num(1), sym(BETA)) },
    because: "and the branch behind left from further away and arrives stretched by the " +
      "same amount the other way",
    line: `(1+β) = 1 + ${BETA}`,
  },
  {
    fact: { kind: "raised" as const, of: AHEAD, base: "(1-β)", to: rat(-1) },
    because: "what arrives from the compressed branch goes as one over that - carried as " +
      "an exact power rather than expanded, so nothing below inherits a truncation",
    line: `${AHEAD} = \\frac{1}{(1-β)}`,
  },
  {
    fact: { kind: "raised" as const, of: BEHIND, base: "(1+β)", to: rat(-1) },
    because: "and from the stretched one, one over the other",
    line: `${BEHIND} = \\frac{1}{(1+β)}`,
  },
  {
    /*
     * THE WEIGHT IS AN ANGLE - see the note at the top of this file. Not a state of
     * knowledge: the share of the source's motion lying along the line between the two
     * bodies, which is what decides how much of it shows up as approach.
     */
    fact: {
      kind: "equals" as const, of: WEIGHT,
      to: mul(num(rat(1, 2)), add(num(1), sym(COS))),
    },
    because: "the share of the motion lying along the line between the two bodies is " +
      "(1 + cos θ)/2 - one when the source comes straight at you, nought when it goes " +
      "straight away, a half across. This is geometry and not belief, and writing it as " +
      "a state of knowledge made a fact about angles look like a fact about the observer",
    line: `${WEIGHT} = \\frac{1 + ${COS}}{2}`,
  },
  {
    fact: {
      kind: "equals" as const, of: RETARD,
      to: add(mul(sym(WEIGHT), sym(AHEAD)),
        mul(sub(num(1), sym(WEIGHT)), sym(BEHIND))),
    },
    because: "how much of the time you are on each side is w and 1 - w, so what arrives " +
      "is the two branches at those weights. Ignorance is w = 1/2 and is not a special " +
      "case of anything - it is the value that makes the two equal. What this average " +
      "COMES to is not stated here: it is put over a common denominator by the rules " +
      "below, and what falls out is exact",
    line: `${RETARD} = ${WEIGHT}·${AHEAD} + (1-${WEIGHT})·${BEHIND}`,
  },
  {
    /*
     * ONE EXPONENT FOR BOTH CLOCK EFFECTS, because they are the same kind of thing: a
     * rate counted against a clock that is not the lattice's. Plus one when the answer is
     * in the receiver's own ticks; minus one when the source is the one moving, since a
     * slowed source pulses less often and less actually arrives.
     */
    fact: {
      kind: "equals" as const, of: FORCE_REL,
      to: mul(sym(STATIC), sym(RETARD),
        sym(GAMMA_Q, expo(0, { [M_R]: 1, [M_S]: -1 }))),
    },
    because: "so the force is the one between bodies at rest, times what retardation " +
      "does to what arrives, times gamma to whatever power the clocks call for. k is +1 " +
      "if the answer is counted in the receiver's own ticks and -1 if the source is the " +
      "one moving - a numerator reduction, since a slowed source pulses less often - and " +
      "0 in the lattice's own frame, which is where the dynamics run",
    line: `${FORCE_REL} = ${STATIC} · ${RETARD} · ${GAMMA_Q}^{${M_R}-${M_S}}`,
  },
];
