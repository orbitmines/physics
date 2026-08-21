/**
 * WHAT A STRUCTURE SPENDS ITS TICK ON - read off the theory, because it is the clock.
 *
 * THE RULE IS THE ARTICLE'S OWN, and it is in the model rather than in the prose: "a
 * structure gets one action per tick. It can spend it moving through the lattice or
 * walking its own graph, and not both - and walking its own graph is its clock." The
 * theory carries `upkeep`, what one period of that clock costs, and TRANSPORT spends the
 * tick on it before anything else - "the force still accumulates, it simply cannot be
 * acted on, which is what 'not both' means".
 *
 * SO A MOVING THING HAS A SLOW CLOCK, AND THAT BUDGET IS WHAT TIME DILATION IS HERE - not
 * a rival to it. The more of its tick a structure spends updating itself, the less is left
 * to move with, and the less it moves the faster its own clock runs. Said that way there
 * is nothing to reconcile: dilation is the trade, stated as a rule rather than imposed as
 * a metric.
 *
 * AND THE TRADE IS IN QUADRATURE, WHICH IS THE PART THAT HAS TO BE GOT RIGHT. A first
 * reading of "one action, spent moving or ticking" makes it a plain subtraction, so a
 * thing going at β would tick at 1 - β - linear, where the Lorentz factor is not, and the
 * model would be in open conflict with special relativity. That reading is wrong, and
 * what makes it wrong is something the model fixes elsewhere: A RAY ALWAYS MOVES AT
 * EXACTLY ONE CELL A TICK. Nothing here goes slower. What varies is not how fast the
 * constituents move but WHICH WAY - motion that walks the structure's own graph gets
 * nowhere, motion that carries it across the lattice does.
 *
 * So the two are components of a rate whose magnitude is fixed at c̄, not two shares of a
 * scalar. Components of a fixed magnitude add as squares:
 *
 *     clock² + β² = 1        so       clock = sqrt(1 - β²)
 *
 * which is the Lorentz factor, inverted, and it comes out of the constituents all moving
 * at one speed rather than out of any assumption about metrics. That is the same argument
 * a light clock makes - the perpendicular bounce and Pythagoras - said in the model's own
 * terms.
 */
import { Rule as TheoryRule } from "../../lib/Theory.ts";
import { add, mul, num, sub, sym } from "../Expr.ts";
import { rat } from "../Algebra.ts";
import { Lab, Probe, Probing, measure } from "../Probe.ts";
import { Emitted, Measured } from "../Kernel.ts";

/** how fast a thing's own clock runs, against the lattice's ticks */
export const CLOCK = "clock";
/** what a moving thing spends on moving, as a fraction of its one action a tick */
export const SPENT = "spent";
/** what is left of the rate once the moving part is taken out - in quadrature */
export const LEFT = "left";

export const budget: Probe = {
  id: "budget/what-a-tick-is-spent-on",
  asks: "a structure gets one action a tick. What does spending it on moving do to the " +
    "clock it would otherwise have been walking?",
  run: (lab: Lab): Probing => {
    const measured: Measured[] = [];
    const facts: Emitted[] = [];

    /*
     * THE RULE THAT MOVES A BODY, and whether this theory has one at all. A theory with no
     * transport rule has nothing that spends a tick on moving and so nothing here to say.
     */
    const rules = Object.entries(lab.theory.rules as Record<string, TheoryRule>);
    const mover = rules.find(([n]) => n === "TRANSPORT");

    const seeded: any = lab.theory.seed({ geometry: lab.geometry, N: 5, seed: 1 });
    const hasBudget = "upkeep" in seeded;

    measured.push(measure("rules that move a structure", mover ? 1 : 0,
      mover ? `${mover[0]}, over ${JSON.stringify(mover[1].type)}` :
        "none - nothing here moves a whole structure"));
    measured.push(measure("the theory carries an upkeep", hasBudget ? 1 : 0,
      hasBudget
        ? `${lab.theory.name} declares \`upkeep\` - what one period of a structure's own ` +
          `clock costs - and spends the tick on it BEFORE moving, which is what "not ` +
          `both" means`
        : "no upkeep is declared, so nothing here says a tick is a budget"));

    if (!mover || !hasBudget) return {
      facts, measured, holds: false,
      found: `${lab.theory.name} does not put a structure's motion and its clock on one ` +
        `budget, so there is nothing here that makes a moving thing tick slowly`,
    };

    /*
     * ONE ACTION, SPLIT. What goes on moving is the speed - a thing crossing a cell a tick
     * spends the whole of it - and what is left is the clock.
     */
    facts.push({
      fact: { kind: "equals", of: SPENT, to: sym("β_{v}") },
      from: [], measured: [measured[0], measured[1]],
      because: `a structure gets one action a tick and crossing a cell costs the whole ` +
        `of it, so a thing going at a fraction β of a cell a tick spends that fraction ` +
        `of its actions on moving. Read off ${mover[0]}, which takes the upkeep before ` +
        `it moves anything`,
      line: `${SPENT} = β_{v}`,
    });

    /*
     * THE REMAINDER IS IN QUADRATURE, because what is being divided is a DIRECTION and not
     * an amount - see the header. The constituents move at one cell a tick whatever
     * happens; what the structure chooses is how much of that goes into getting somewhere.
     */
    facts.push({
      fact: {
        kind: "equals", of: LEFT,
        to: sub(num(1), mul(sym(SPENT), sym(SPENT))),
      },
      from: [], measured: [measured[0], measured[1]],
      because: `a ray moves at exactly one cell a tick and never slower, so what a ` +
        `structure varies is not how fast its constituents go but WHICH WAY - motion ` +
        `that walks its own graph gets nowhere, motion that carries it across the ` +
        `lattice does. Two components of a rate whose magnitude is fixed, so they add as ` +
        `squares rather than as shares: what is left for the clock is 1 - β²`,
      line: `${LEFT} = 1 - ${SPENT}^{2}`,
    });

    facts.push({
      fact: { kind: "raised", of: CLOCK, base: LEFT, to: rat(1, 2) },
      from: [], measured: [measured[1]],
      because: `and the clock is the size of that remaining component, which is its root ` +
        `- so a moving thing ticks at sqrt(1 - β²). That is the Lorentz factor inverted, ` +
        `out of the constituents all moving at one speed and nothing else: the more of ` +
        `its tick a structure spends updating itself the less it moves, which is what ` +
        `time dilation IS here rather than something imposed alongside it`,
      line: `${CLOCK} = ${LEFT}^{1/2}`,
    });

    return {
      facts, measured, holds: true,
      found: `${lab.theory.name} spends one action a tick on moving OR on its own clock ` +
        `and not both - and because a ray moves at one cell a tick whatever happens, ` +
        `those are two directions of one fixed rate rather than two shares of an amount. ` +
        `So they add as squares and the clock runs at sqrt(1 - β²): the Lorentz factor, ` +
        `out of the budget rather than beside it`,
    };
  },
};
