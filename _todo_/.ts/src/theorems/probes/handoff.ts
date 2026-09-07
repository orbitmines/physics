/**
 * WHAT IT TAKES TO PASS A DISTURBANCE ALONG - read off the rules, not assumed about them.
 *
 * THIS EXISTS BECAUSE THE SPEED LAW WAS BEING ASSUMED. The transport law says a carrier
 * slows where the medium is thin, "because there is less of it to hand the charge on
 * to", and an earlier version of `transport.ts` took that as a premise and worked out its
 * consequences. But the sentence is a MECHANISM, not a postulate, and this model states
 * the mechanism in a rule - so the speed law is something to derive.
 *
 * THE RULE SAYS IT. A meeting in these theories is quantified over a FACING PAIR and
 * gated on both ends carrying something: `["Boundary", "Boundary"]` with `where:
 * "active"`, which is read off the theory here rather than transcribed. A carrier with
 * nothing facing it is not handed on. So how often a carrier is handed on is how often
 * there is a partner there, and how often there is a partner there is what the occupancy
 * IS. That gives the hand-off rate its dependence on n without anybody having written one
 * down.
 *
 * AND THE OTHER BOUND IS THE LATTICE'S. A ray advances one cell a tick and no more -
 * `medium/what-transport-does` watches a front and confirms it never outruns its own
 * steps. So however plentiful the partners get, the speed stops at one cell a tick. Two
 * bounds, both counted, and the transport law's `min` is the statement that a carrier
 * moves at whichever is smaller. `v = c·min(1, n/n_c)` is then a consequence rather than
 * a premise, and which branch binds is a fact about how thick the medium is at a place -
 * not an assumption about the form of a law.
 *
 * THE ONE THING STILL TAKEN ON TRUST is named where it is used: that whether a partner is
 * present at a given end is not correlated with whether the carrier is. That is the
 * standard kinetic assumption, it is one line, and it is stated in the step rather than
 * buried here.
 */
import { Rule as TheoryRule } from "../../lib/Theory.ts";
import { base } from "../Algebra.ts";
import { Lab, Probe, Probing, measure } from "../Probe.ts";
import { Emitted, Measured } from "../Kernel.ts";

/** how often a carrier is passed along - what sets its speed where partners are scarce */
export const HANDOFF = "handoff";
/** something facing the carrier, carrying something itself */
export const PARTNER = "partner";
/** the carrier being passed */
export const CARRIER = "carrier";
/** the lattice's own speed limit - one cell a tick */
export const CAP = "c";
/** how thick the medium is - the fraction of ends carrying something */
export const DENSITY = "n";

/** a rule quantified over a facing pair, which is what a meeting is in these theories */
const meetings = (theory: any): { name: string; gate?: string }[] =>
  Object.entries(theory.rules as Record<string, TheoryRule>)
    .filter(([, r]) => {
      const t = r.type as unknown;
      return Array.isArray(t) && t.length === 2 && t.every(x => x === "Boundary");
    })
    .map(([name, r]) => ({ name, gate: r.where }));

export const handoff: Probe = {
  id: "handoff/what-passing-along-takes",
  asks: "what does this theory require before a disturbance can be passed from one place " +
    "to the next, and what is the most often that can happen?",
  run: (lab: Lab): Probing => {
    const measured: Measured[] = [];
    const facts: Emitted[] = [];

    const met = meetings(lab.theory);
    measured.push(measure("rules quantified over a facing pair", met.length,
      met.length
        ? met.map(m => `${m.name} over [Boundary, Boundary]` +
          (m.gate ? ` gated on "${m.gate}"` : " with no gate")).join("; ")
        : "none - nothing in this theory happens between two facing ends"));

    if (!met.length) return {
      facts, measured, holds: false,
      found: `${lab.theory.name} has no rule between facing ends, so there is nothing ` +
        `here that passes a disturbance along and no speed for it to have`,
    };

    const gated = met.filter(m => m.gate);
    if (!gated.length) return {
      facts, measured, holds: false,
      found: `${lab.theory.name}'s meetings are not gated on either end carrying ` +
        `anything, so a hand-off needs no partner and its rate does not depend on how ` +
        `thick the medium is`,
    };

    const it = gated[0];

    /*
     * A HAND-OFF NEEDS BOTH: the carrier, and something facing it with something on it.
     * That is precisely what the rule's shape and gate say, and it is the entire content
     * of "there is less of it to hand the charge on to".
     */
    facts.push({
      fact: { kind: "product", of: HANDOFF, from: [CARRIER, PARTNER] },
      from: [], measured: [measured[0]],
      because: `${it.name} is quantified over a facing PAIR and gated on "${it.gate}" - ` +
        `read off ${lab.theory.name}'s own rules rather than transcribed. So it happens ` +
        `only where there is a carrier AND something facing it that is itself carrying ` +
        `something: a hand-off takes both`,
      line: `${HANDOFF} = ${CARRIER} · ${PARTNER}`,
    });

    /*
     * AND HOW OFTEN A PARTNER IS THERE IS WHAT OCCUPANCY MEANS. This is a definition of n
     * rather than a claim about it - with one thing taken on trust, named in the step.
     */
    facts.push({
      fact: { kind: "scales", of: PARTNER, by: base(DENSITY) },
      from: [], measured: [measured[0]],
      because: `the occupancy n IS the fraction of ends carrying something, so the ` +
        `number of partners available to a carrier goes as n. This takes one thing on ` +
        `trust and it is the only such line here: that whether the facing end is ` +
        `carrying something is not correlated with whether the carrier is. That is the ` +
        `standard kinetic assumption, and a medium in which it failed would have a ` +
        `different hand-off rate rather than a different mechanism`,
      line: `${PARTNER} ∝ ${DENSITY}`,
    });

    /*
     * THE OTHER BOUND, and it is the lattice's rather than the medium's.
     */
    facts.push({
      /*
       * MARKED AS A CONSTANT RATHER THAN GIVEN A LAW. `c ∝ 1` reads as a scaling law and
       * the algebra then treats c as a quantity it may substitute for - which it did,
       * breeding c², c³ and never closing. c does not vary; that is the whole of what
       * there is to say about it.
       */
      fact: { kind: "constant", of: CAP },
      from: [], measured: [measured[0]],
      because: `a ray advances one cell a tick and no more - MOVEMENT writes it onto ` +
        `exactly one neighbour, and the front watched in medium/what-transport-does ` +
        `never outruns the steps it has taken. So however many partners there are, the ` +
        `speed stops here. This is the lattice's bound, not the medium's`,
      line: `${CAP} is one cell a tick`,
    });

    facts.push({
      fact: { kind: "positive", of: CARRIER },
      from: [], measured: [measured[0]],
      because: "there is something to pass along - a medium with nothing in it is not " +
        "a medium this question is about",
      line: `${CARRIER} > 0`,
    });
    facts.push({
      fact: { kind: "positive", of: CAP },
      from: [], measured: [measured[0]],
      because: "a ray advances one cell a tick, which is a speed greater than none",
      line: `${CAP} > 0`,
    });
    facts.push({
      fact: { kind: "positive", of: HANDOFF },
      from: [], measured: [measured[0]],
      because: "a medium with carriers in it hands them on",
      line: `${HANDOFF} > 0`,
    });

    return {
      facts, measured, holds: true,
      found: `${it.name} needs a facing partner carrying something (gated on ` +
        `"${it.gate}"), so a hand-off goes as the occupancy; and a ray advances at most ` +
        `one cell a tick, so the speed is bounded by the lattice as well as by the medium`,
    };
  },
};
