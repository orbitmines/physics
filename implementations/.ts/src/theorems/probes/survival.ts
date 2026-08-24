/**
 * WHAT IT TAKES TO KILL A CARRIER - read off the annihilation rule, and the reason a
 * force has a range at all.
 *
 * THE ARTICLE'S CONTINUOUS MODEL LISTS SCREENING AS ONE OF ITS LAWS and marks it
 * CALIBRATED: `F(d) ∝ e^{-d/λ}`, owing λ, "which is a property of the vacuum's occupancy
 * and not of the geometry". That is exactly right and it is also exactly derivable,
 * because the vacuum's occupancy is not a free parameter here - `vacuum.occupancy` gets it
 * from the meeting rule by enumeration, and it comes out 0 for pure gravity and 1/2 for
 * gravity with magnetism. A length that is owed to a quantity this folder already derives
 * is not owed at all.
 *
 * SO THE ONLY THING TO ESTABLISH IS THE SHAPE OF THE DEATH, and that is a fact about the
 * rule rather than about a run. Annihilation in these theories is quantified over a FACING
 * PAIR and gated on both ends carrying something - `["Boundary", "Boundary"]` with
 * `where: "active"` - which is read here off the theory rather than transcribed. So a
 * carrier with nothing facing it is not killed, and how often a carrier is killed is how
 * often there is a partner there, times how often such a meeting is fatal. Both of those
 * are counts this folder already has.
 *
 * NOTHING IS SAMPLED. The tempting experiment - light one ray, tick, see how far it gets,
 * fit an exponential to the survivors - is the mistake this folder exists to avoid, and it
 * would be a bad version of it: a survival curve is noisy exactly where it matters, and
 * the number that came out would be a property of the box. What is asked instead is what
 * has to be true for a carrier to die, which the rule states, and what fraction of
 * meetings are fatal, which `tables/what-every-rule-does` counts exhaustively.
 *
 * THE ONE THING TAKEN ON TRUST is named where it is used rather than buried here: that
 * whether a partner is present is not correlated with whether the carrier is. That is the
 * standard kinetic assumption, `handoff/what-passing-along-takes` makes the same one for
 * the same reason, and it is one line.
 */
import { Rule as TheoryRule } from "../../lib/Theory.ts";
import { Lab, Probe, Probing, measure } from "../Probe.ts";
import { Emitted, Measured } from "../Kernel.ts";
import { PAIR_EMPTIES, PAIR_STATES } from "./tables.ts";

/** how often a carrier is killed on a step - what sets the range of a force */
export const DEATH = "death per step";
/** how often a meeting is fatal at all - a fraction of the rule's own cases */
export const FATAL = "fatal fraction";
/** something facing the carrier, carrying something itself */
export const PARTNER = "partner";
/** how far a carrier gets before it is killed */
export const RANGE = "\\lambda";
/** what is left of a beam after it has gone that far */
export const SURVIVAL = "survival";

/** a rule quantified over a facing pair, which is what a meeting is in these theories */
const meetings = (theory: any): { name: string; gate?: string }[] =>
  Object.entries(theory.rules as Record<string, TheoryRule>)
    .filter(([, r]) => {
      const t = r.type as unknown;
      return Array.isArray(t) && t.length === 2 && t.every(x => x === "Boundary");
    })
    .map(([name, r]) => ({ name, gate: r.where }));

export const survival: Probe = {
  id: "survival/what-kills-a-carrier",
  asks: "what has to be true before this theory destroys something in flight, and how " +
    "often is that?",
  run: (lab: Lab): Probing => {
    const measured: Measured[] = [];
    const facts: Emitted[] = [];

    const met = meetings(lab.theory);
    measured.push(measure("rules that can destroy a carrier in flight", met.length,
      met.length
        ? met.map(m => `${m.name} over [Boundary, Boundary]` +
          (m.gate ? ` gated on "${m.gate}"` : " with no gate")).join("; ")
        : "none - nothing in this theory happens between two facing ends"));

    if (!met.length) return {
      facts, measured, holds: false,
      found: `${lab.theory.name} has no rule between facing ends, so nothing is destroyed ` +
        `in flight, a carrier goes as far as the box allows and there is no range to ` +
        `derive. A force in this theory is not screened at all`,
    };

    const gated = met.filter(m => m.gate);
    if (!gated.length) return {
      facts, measured, holds: false,
      found: `${lab.theory.name}'s meetings are not gated on either end carrying ` +
        `anything, so a carrier can be destroyed with nothing facing it - the death rate ` +
        `does not depend on how thick the medium is, and whatever screening this theory ` +
        `has is not the occupancy's doing`,
    };

    const it = gated[0];

    /*
     * A DEATH NEEDS BOTH: the carrier, and something facing it with something on it. That
     * is precisely what the rule's shape and its gate say, and it is the whole content of
     * "a force is second order in survival, since it needs rays from BOTH bodies to live
     * long enough to meet".
     */
    facts.push({
      fact: { kind: "product", of: DEATH, from: [PARTNER, FATAL] },
      from: [], measured: [measured[0]],
      because: `${it.name} is quantified over a facing pair and gated on "${it.gate}", ` +
        `read off ${lab.theory.name} itself rather than transcribed. So a carrier is ` +
        `destroyed on a step exactly when there is something facing it carrying ` +
        `something - which is how often ${PARTNER} - AND that meeting is one of the ones ` +
        `that leaves nothing - which is ${FATAL}. Neither alone kills anything. ` +
        `ASSUMED HERE, and nowhere else: that whether a partner is present is not ` +
        `correlated with whether the carrier is, which is the standard kinetic ` +
        `assumption and is what lets the two be multiplied`,
      line: `${DEATH} = ${PARTNER} · ${FATAL}`,
    });

    /*
     * AND HOW OFTEN THERE IS A PARTNER IS NOT SAID AGAIN HERE, which it was, and which
     * was a mistake that cost an hour of wall clock.
     *
     * `handoff/what-passing-along-takes` already establishes `partner ∝ n` - how often
     * something is facing you IS the occupancy, which is what that symbol means. This
     * probe emitted `partner ∝ occupancy` beside it: the same subject, a second law, and
     * two different names for one quantity. Substitution then had two routes through
     * `partner` and explored both everywhere downstream, so the store stopped closing -
     * 698 facts at three passes, 1271 at five, 2053 at seven, still climbing. A sweep cell
     * that had taken ninety seconds ran for seventy-seven minutes and was killed by its
     * own timeout.
     *
     * THE LESSON IS THE ONE `turning` ALREADY LEARNED ABOUT `CYCLE`: two probes naming the
     * same subject is not a duplicate, it is a fork, and in a store that substitutes it is
     * a combinatorial one. A probe that wants a quantity another probe already establishes
     * should USE it and say nothing.
     */

    /*
     * THE FATAL FRACTION IS THE TABLE'S, read as a fraction of cases rather than as a
     * rate. `tables/what-every-rule-does` applies every facing-pair rule to a real pair in
     * every state it can be handed and counts the ones that leave nothing at all.
     */
    facts.push({
      fact: { kind: "quotient", of: FATAL, over: PAIR_EMPTIES, under: PAIR_STATES },
      from: [], measured: [measured[0]],
      because: `how often a meeting is fatal is how many of the states a facing pair can ` +
        `be in leave nothing at all, over how many states there are - both counted ` +
        `exhaustively by applying the rule to a real pair. Nothing is sampled and no run ` +
        `length can change either count`,
      line: `${FATAL} = \\frac{${PAIR_EMPTIES}}{${PAIR_STATES}}`,
    });

    return {
      facts, measured, holds: true,
      found: `${it.name} destroys a carrier only when something facing it is carrying ` +
        `something, so the chance of dying on a step is how often there is a partner ` +
        `times how often such a meeting is fatal - both of them counts this folder ` +
        `already has, so the range of a force in ${lab.theory.name} is derived rather ` +
        `than calibrated`,
    };
  },
};
