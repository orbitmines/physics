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
import { mul as xmul, num, sub, sym as xsym } from "../Expr.ts";
import { rat } from "../Algebra.ts";
import { Lab, Probe, Probing, measure } from "../Probe.ts";
import { Emitted, Measured } from "../Kernel.ts";

/** how fast a thing's own clock runs, against the lattice's ticks */
export const CLOCK = "clock";
/** what a moving thing spends on moving, as a fraction of its one action a tick */
export const SPENT = "spent";
/** the length of one step, which the lattice fixes */
export const STEP_LEN = "|step|^{2}";
/** the part of that step spent keeping pace with the structure */
export const ALONG = "|along|^{2}";
/** and the part left over to cross it with, which is what advances the clock */
export const LEFT = "(1-β^{2})";
/** the Lorentz factor itself, carried as an exact power and never expanded */
export const GAMMA_Q = "γ";

export const budget: Probe = {
  id: "budget/what-a-tick-is-spent-on",
  asks: "a structure's clock is its own rays crossing it. What does moving through the " +
    "lattice do to that, and does this tiling let the question be asked at all?",
  run: (lab: Lab): Probing => {
    const measured: Measured[] = [];
    const facts: Emitted[] = [];
    const g = lab.geometry;

    const rules = Object.entries(lab.theory.rules as Record<string, TheoryRule>);
    const mover = rules.find(([n]) => n === "TRANSPORT");
    const seeded: any = lab.theory.seed({ geometry: g, N: 5, seed: 1 });
    const hasBudget = "upkeep" in seeded;

    measured.push(measure("rules that move a structure", mover ? 1 : 0,
      mover ? `${mover[0]}, over ${JSON.stringify(mover[1].type)} - and it takes the ` +
        `upkeep before it moves anything, which is what "not both" means`
        : "none - nothing here moves a whole structure"));
    measured.push(measure("the theory carries an upkeep", hasBudget ? 1 : 0,
      hasBudget ? `${lab.theory.name} declares \`upkeep\` - what one period of a ` +
        `structure's own clock costs` : "no upkeep is declared"));

    /*
     * THE ONE THAT DECIDES WHETHER ANY OF THIS GOES THROUGH.
     *
     * Pythagoras on a step needs the step to have a length that does not depend on which
     * way it points. That is a fact about the tiling and not about the theory, it is true
     * of some lattices and false of others, and it is checked rather than assumed.
     */
    const lengths = [...new Set(g.steps.map(x => x.toFixed(9)))];
    const uniform = lengths.length === 1;
    measured.push(measure("distinct exit lengths", lengths.length,
      `${g.name} has ${lengths.length === 1 ? "one exit length" :
        `${lengths.length} different exit lengths`}: ${lengths.join(", ")}. A step is a ` +
      `vector of fixed magnitude only where there is one`));

    if (!mover || !hasBudget) return {
      facts, measured, holds: false,
      found: `${lab.theory.name} does not move a structure against its own clock, so ` +
        `there is nothing here that makes a moving thing tick slowly`,
    };
    if (!uniform) return {
      facts, measured, holds: false,
      found: `${g.name}'s exits are not all the same length (${lengths.join(", ")}), so a ` +
        `ray's step has no fixed magnitude and its components cannot be added in ` +
        `quadrature. The clock's dependence on speed is not derivable on this tiling by ` +
        `this argument - which is a statement about the lattice, not a gap in the theory`,
    };

    facts.push({
      fact: { kind: "equals", of: STEP_LEN, to: num(1) },
      from: [], measured: [measured[2]],
      because: `every exit of ${g.name} is the same length (${lengths[0]}), so a ray's ` +
        `step is a vector whose magnitude does not depend on which way it points. ` +
        `Measured in steps that magnitude is one, which is what makes the next line ` +
        `Pythagoras rather than an analogy`,
      line: `${STEP_LEN} = 1`,
    });

    facts.push({
      fact: { kind: "equals", of: SPENT, to: xsym("β_{v}") },
      from: [], measured: [measured[0]],
      because: `a ray bound into a moving structure has to keep pace with it or be left ` +
        `behind and cease to be part of it. So its step carries a component along the ` +
        `direction of travel equal to the structure's own speed - read off ${mover[0]}, ` +
        `which moves the structure a cell at a time`,
      line: `${SPENT} = β_{v}`,
    });

    facts.push({
      fact: { kind: "equals", of: ALONG, to: xmul(xsym(SPENT), xsym(SPENT)) },
      from: [], measured: [measured[0]],
      because: "and the square of that component is what Pythagoras wants",
      line: `${ALONG} = ${SPENT}^{2}`,
    });

    facts.push({
      /* the step is one vector; its two orthogonal components square to it */
      fact: { kind: "equals", of: LEFT, to: sub(xsym(STEP_LEN), xsym(ALONG)) },
      from: [], measured: [measured[2], measured[0]],
      because: `the step is ONE vector of fixed length, split into the part that keeps ` +
        `pace with the structure and the part that crosses it. Those are orthogonal, so ` +
        `their squares sum to the step's - which is Pythagoras on a lattice whose exits ` +
        `are all the same length, and not a claim about budgets. What is left to cross ` +
        `with is what advances the structure's own clock`,
      line: `${LEFT} = ${STEP_LEN} - ${ALONG}`,
    });

    facts.push({
      fact: { kind: "raised", of: GAMMA_Q, base: LEFT, to: rat(-1, 2) },
      from: [], measured: [measured[2]],
      because: `the clock advances by the crossing component, which is the root of that - ` +
        `so a moving thing ticks at sqrt(1 - β^{2}) and one lattice tick is worth ` +
        `(1 - β^{2})^{-1/2} of its own. The Lorentz factor, out of a step of fixed ` +
        `length and nothing else`,
      line: `${GAMMA_Q} = ${LEFT}^{-1/2}`,
    });
    /*
     * NOT NAMED - gamma is opened wherever it stands.
     *
     * It was kept whole so that answers would read as powers of gamma rather than as
     * powers of one minus beta squared. But a law with gamma in it is a law with an
     * unopened symbol in it, and the point of these proofs is that nothing is left
     * standing which could be written out. What it is IS one minus beta squared to a
     * power, so that is what it says.
     */
    facts.push({
      fact: { kind: "equals", of: LEFT, to: xsym(GAMMA_Q, -2) },
      from: [], measured: [measured[2]],
      because: "the same fact the other way up, which is the form anything arriving at " +
        "1 - β^{2} by another road needs in order to see the gamma in it",
      line: `${LEFT} = \\frac{1}{${GAMMA_Q}^{2}}`,
    });
    facts.push({
      fact: { kind: "equals", of: CLOCK, to: xsym(GAMMA_Q, -1) },
      from: [], measured: [measured[2]],
      because: "and the clock itself is one over that",
      line: `${CLOCK} = \\frac{1}{${GAMMA_Q}}`,
    });

    return {
      facts, measured, holds: true,
      found: `every exit of ${g.name} is the same length, so a ray's step is a vector of ` +
        `fixed magnitude. A ray bound into a structure moving at β spends β of that step ` +
        `keeping pace, and what is left to cross with - which is the clock - is ` +
        `sqrt(1 - β^{2}) by Pythagoras. The Lorentz factor, derived from the step rather ` +
        `than assumed`,
    };
  },
};
