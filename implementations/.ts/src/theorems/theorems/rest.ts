/**
 * WHAT ONE STEP IS SPENT ON - the conservation law, with mass and velocity in it, and it
 * is NOT `1 = m + v`.
 *
 * THE QUESTION. Everything in this model moves at exactly one cell a tick; nothing is ever
 * at rest and nothing goes faster. So what distinguishes a photon from a proton cannot be
 * how fast their constituents move - it can only be WHAT THAT MOTION IS SPENT ON. Written
 * down, that is a conservation law with one on the left, and the whole content is what
 * stands on the right and in what powers.
 *
 * THE ANSWER, AND EVERY PART OF IT IS DERIVED SOMEWHERE RATHER THAN FITTED:
 *
 *     1  =  b^2  +  m  +  binding
 *
 * WHY THE FIRST TERM IS SQUARED AND THE OTHERS ARE NOT is the whole of the theorem, and
 * getting it wrong is the recorded failure mode of this exact argument.
 *
 *   ALONG AGAINST ACROSS IS A VECTOR RESOLVED, SO IT IS QUADRATURE. A ray's step is one
 *   vector whose magnitude the lattice fixes - PROBED, and false on tilings whose exits
 *   differ in length, where the whole argument refuses. A ray bound into a structure
 *   moving at b must carry b of that step just to keep pace, and what is left crosses the
 *   structure. Orthogonal components of a fixed magnitude, so |across|^2 = 1 - b^2 and the
 *   clock runs at its root. THAT IS THE LORENTZ FACTOR, out of a step and nothing else.
 *
 *   INSIDE AGAINST OUTSIDE IS A PREDICATE'S TWO ANSWERS, SO IT IS LINEAR. `blocks` takes a
 *   point and says whether it is holding something. There is no component of a step "along
 *   inside"; a bend either happened where matter was or where it was not. Disjoint events
 *   partition an amount, and amounts add.
 *
 * THE MISTAKE IN BOTH DIRECTIONS IS ON RECORD IN THIS FOLDER. `budget`'s header keeps the
 * first reading of the first split, which made it linear - "one action a tick, spent moving
 * or ticking" - giving clock = 1 - b and putting the model in open conflict with special
 * relativity. This theorem is where the opposite error was available: having learned that
 * the first split is quadrature, write the second one that way too. It would be just as
 * wrong and for the mirrored reason. What tells them apart is not taste, it is asking the
 * model how many directions the distinction names, and `rest/what-a-thing-at-rest-is-doing`
 * asks it.
 *
 * WHAT THE THIRD TERM IS FOR, AND IT IS WHY THE LAW HAS THREE. Two terms cannot be right.
 * With only b and m, setting b to nought forces m to one, so ANYTHING AT REST IS MAXIMALLY
 * HEAVY - and a proton and an electron are both at rest on this desk and differ by
 * eighteen hundred. What the two-term form leaves out is that motion can be lost WITHOUT
 * BECOMING WEIGHT: a ray bent inside a structure is turning round because that structure's
 * geometry turns it round, and the space it unmakes there holds the thing together. With
 * the third term, a body at rest has m + binding = 1 and may divide it any way at all,
 * which is what having a mass SPECTRUM would mean.
 *
 * AND THE THIRD TERM IS SOMETHING THIS MODEL ALREADY HAS UNDER ANOTHER NAME. Gravity here
 * is the expansion that did not happen where matter was in the way - `blocks`, counted.
 * That is a number reachable without mentioning a trajectory, and the binding share is a
 * number reachable without mentioning the expansion. THE PROBE EMITS THEIR IDENTIFICATION
 * AND SAYS IT HAS NOT EARNED IT: measured, they come out the same order and not the same
 * number. Emitting it with both figures in the line is the honest form - it is the claim
 * this theorem makes and the one most likely to be wrong.
 *
 * AND THE SHADOW IS DERIVED TOO, WHICH IT WAS NOT WHEN THIS WAS FIRST WRITTEN. A shadow
 * taken off a run and dropped into a law is a fitted constant wearing a derivation's
 * clothes, and it was one here. It is a COUNT OF PLACES:
 *
 *     shadow  =  phi . gate / rho_f
 *
 *   phi     matter per point of vacuum
 *   rho_f   points of matter one host stands for - a fold puts a point INSIDE another and
 *           (G/2) is refused once per HOST, so the fold depth DIVIDES the shadow. Fold a
 *           structure twice as deep and it blocks half as many splits for the same mass, so
 *           it weighs MORE. The only place a structure's own shape enters this law
 *   gate    how much busier matter's own footprint is than the vacuum around it
 *
 * ALL THREE ARE INTENSIVE, which is what makes it a local law. An earlier form had the mass
 * and the size of the box in it separately; the same statement in terms of ratios says it
 * without asking how big the world is, and a structure of a given density in a given local
 * matter fraction casts the same shadow whatever room it is put in.
 *
 * `gate` IS THE ONE THAT HAD TO BE MEASURED TO BE BELIEVED, AND LEAVING IT OUT WAS WORTH A
 * FACTOR OF FOUR. `CREATION` asks `busy(l)` BEFORE it asks `blocks(l)`, so a point already
 * carrying a ray returns early and never reaches the blocked branch however much matter it
 * is holding. Counted: 1151 points were hosting matter and 301 of them got as far as the
 * test - MATTER'S OWN FOOTPRINT IS BUSIER THAN THE VACUUM AROUND IT, because matter
 * radiates. Written without the gate the shadow reads 0.247 against the 0.065 the rule
 * actually produced. A derivation of a rule has to model the rule, including the order it
 * asks its questions in.
 *
 * SO NOTHING IN THE LAW IS FITTED. Every symbol is a count the store already keeps, and the
 * whole of it is a TRADEOFF between three ways of spending one step
 *
 *     b^2  +  m  +  binding  =  1
 *
 * WHAT IS STILL NOT DERIVED, AND IT IS NOW ONE THING RATHER THAN A WHOLE TERM. The law says
 * what a structure weighs GIVEN its density. It does not say what its density is, and rho is
 * the only quantity left in it that nothing pins down. A spectrum of masses would be a
 * spectrum of preferred fold depths, so the question "why does matter come in kinds" has
 * moved from "what sets the mass" to "what sets rho" - which is a smaller and much more
 * specific question than the one this theorem started with, and is the one to ask next.
 */
import { num, sym } from "../Expr.ts";
import { Theorem } from "../Theorem.ts";
import { budget, CLOCK, GAMMA_Q, LEFT, ALONG, STEP_LEN, SPENT } from "../probes/budget.ts";
import {
  ACROSS, BOUND, BUDGET, FREE, HELD, INSIDE, OPEN, SHADOW, rest as restProbe,
} from "../probes/rest.ts";

export const rest: Theorem = {
  id: "mass.budget",
  asks: "everything moves at one cell a tick, so a thing at rest is still moving. What " +
    "is one step spent on, and what does that make conserved?",
  /*
   * THE LAW WANTED IS THE MASS, NOT THE STEP.
   *
   * With `about` on the step the page's headline came back `|step|^{2} = 1` - which is TRUE,
   * is the premise everything here stands on, and is not what anybody came to read. Solved
   * for m instead it reads as a formula for mass, which is closer but still says the wrong
   * thing: it makes mass look like the subject and the other two like corrections to it.
   *
   * AND THE SUM FORM IS NOT THE THEOREM, WHICH THE PROVER SETTLED RATHER THAN ME. Pointing
   * `about` at the budget gave `budget = |along|^{2} + |across|^{2} = 1`, and the chain it
   * took is the finding: it substitutes across -> (1 - b^2) and is done in three steps. IT
   * NEVER ROUTES THROUGH m + binding. That is correct and it is worth keeping, because m
   * and binding are DEFINED as shares of across - m = across(1-shadow), binding =
   * across.shadow - so their summing to across is a tautology carrying no information. A
   * saturating prover walks every road; the road it declined is the one that goes nowhere.
   *
   * So the tradeoff reading is true and worth saying in prose - go faster and there is less
   * for the other two, bind harder and there is less to weigh with - but it is a
   * RE-PARTITION rather than a law, and making it the headline would present an identity as
   * a result. What is left when that is taken away is not nothing: it is a formula for m
   * with no free quantity in it, which is what this theorem is about.
   */
  about: BUDGET,
  probes: [budget, restProbe],
  /*
   * THE PREMISES THE RULES NEED, AND THEY ARE REAL EXPRESSIONS.
   *
   * `wants` is read ONLY when a theorem reaches no conclusion, which makes it the one field
   * that a passing run never touches. Written first as object literals cast to `any` -
   * `{ kind: "num", value: 1 }`, a shape `Expr` does not have - it typechecked, proved
   * correctly on every lattice where the argument goes through, and CRASHED THE MOMENT ONE
   * REFUSED: `e is not iterable`, inside the very explanation that was supposed to say
   * which premise was missing. The failure path was the untested one, and the failure path
   * is the whole point of a probe that can decline.
   */
  wants: [
    { kind: "equals", of: STEP_LEN, to: num(1) },
    { kind: "equals", of: ACROSS, to: sym(FREE) },
    { kind: "equals", of: BUDGET, to: sym(FREE) },
  ],
  uses: ["mass.period"],
  glossary: {
    [STEP_LEN]: {
      symbol: "|step|^{2}",
      says: "one step, squared - and the lattice fixes it at one, which is the premise " +
        "everything here stands on and the one that fails on uneven tilings",
    },
    /* THE GLOSSARY'S `symbol` IS WHAT THE PAGE PRINTS, and renaming the constant without
     * renaming this leaves the old name on the page while the new one is in the store - so
     * `proof.json` carried `held(l)` nine times and `l.contained` five, for one quantity. */
    [SPENT]: { symbol: "β", says: "how fast the structure itself is going, in cells a tick" },
    [ALONG]: {
      symbol: "|along|^{2}",
      says: "the part of the step that goes into keeping pace with the structure - the " +
        "only term that is squared, because it is the only one that names a direction",
    },
    [ACROSS]: {
      symbol: "|across|^{2}",
      says: "what is left to cross the structure with: everything it does that gets it " +
        "nowhere. This is what a thing at rest has ALL of, and it is not mass",
    },
    [FREE]: {
      symbol: "m",
      says: "of the crossing part, what is spent bending in the open - inertia, the weight",
    },
    [BOUND]: {
      symbol: "binding",
      says: "and what is spent bending inside matter - holding the structure together and " +
        "running its clock. Not weight, and the reason something can be at rest and light",
    },
    [BUDGET]: {
      symbol: "budget",
      says: "the whole of one step, which the lattice fixes at one - and which the three " +
        "terms below divide between them. That division IS the law",
    },
    [HELD]: {
      symbol: "l.contained",
      says: "points where `blocks(l)` fired - that is, where `contained(l)` is not empty, " +
        "so matter is being held there and (G/2) is refused. The expansion that did not " +
        "happen IS the gravity of this model, so this is where it is counted",
    },
    [OPEN]: {
      symbol: "l.free",
      says: "points that got as far as the test: `!l.source && !busy(l)`. CREATION asks " +
        "these FIRST, so a point already carrying a ray never reaches `blocks` however " +
        "much matter it holds - and matter's own places are busier than the vacuum, " +
        "because matter radiates. Dividing by all points instead of these gives 0.142 " +
        "where the rule produced 0.067",
    },
    [INSIDE]: { symbol: "inside", says: "the share of all bending that happened where " +
      "matter was, read off ray trajectories rather than off the expansion rule" },
    [SHADOW]: {
      symbol: "shadow",
      says: "the same quantity counted off the expansion rule instead: splits that did " +
        "not fire because matter was in the way, which is the gravity of this model",
    },
    [LEFT]: { symbol: "(1-β^{2})", says: "the crossing part, as `budget` writes it" },
    [GAMMA_Q]: { symbol: "γ", says: "one over the clock" },
    [CLOCK]: { symbol: "clock", says: "how fast a moving thing's own clock runs" },
  },
};

/* NOTHING IS DEFINED HERE. Every line of this law is emitted by a probe that measured
 * something to justify it, which is the point: a definition added at the theorem is a step
 * nobody probed. */
export const definitions: { fact: any; because: string; line?: string }[] = [];
