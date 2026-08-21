/**
 * WHAT HAPPENS WHEN THE TWO HALVES MEET - enumerated, every case, for whatever theory
 * this is.
 *
 * THE FIRST THEOREM HERE WHOSE ANSWER DEPENDS ON THE THEORY RATHER THAN THE LATTICE, and
 * that is the point of it. The vacuum makes space by splitting: every neutral point puts
 * two halves of one inserted point onto the two ends of a shared edge, facing each other.
 * Whether that inserted point SURVIVES is decided entirely by what the meeting rule does
 * to the pair - so the density the vacuum settles at is not a rate, not a fit, and not a
 * property of the tiling. It is a fraction of cases.
 *
 * SO IT IS SETTLED BY ENUMERATION. The rule is applied to a facing pair in every
 * combination of what the pair can be carrying, and it is asked what is left. There are
 * four such combinations in a theory whose rays carry a sign and one in a theory whose
 * rays do not, so the enumeration is complete in the strict sense - nothing is sampled,
 * nothing is averaged, and no run length or box could change the answer.
 *
 * AND IT COMES OUT AT THE THREE NUMBERS THE ARTICLE QUOTES:
 *
 *   G               both halves are neutral, every pair annihilates, every inserted
 *                   point collapses - pure gravity has no vacuum              -> 0
 *   G^XOR           each split gets a sign, so two halves meeting are alike half the
 *                   time and TURN, opposite half the time and annihilate      -> 1/2
 *   G^CONSERVING    nothing is ever destroyed, so every inserted point survives
 *                   and the box fills                                         -> 1
 *
 * THE HALF IS THE ONE THIS BOOK QUOTES THROUGHOUT, and here it falls out of the rule
 * rather than out of a limit: half the created space survives because half the meetings
 * are alike. That is the same sentence as "magnetism expands space and gravity does not".
 */
import { GEOMETRIES, outward } from "../../lib/Local.ts";
import { World } from "../../lib/Compat.ts";
import { Rule as TheoryRule } from "../../lib/Theory.ts";
import { rat } from "../Algebra.ts";
import { Lab, Probe, Probing, measure } from "../Probe.ts";
import { Emitted, Measured } from "../Kernel.ts";

/** how much of what the vacuum makes is still there afterwards */
export const OCCUPANCY = "occupancy";
/** the cases the meeting rule can be handed, and the ones that leave something behind */
export const CASES = "cases";
export const SURVIVING = "surviving";
/** and the ones that leave nothing - the pair annihilated */
export const ANNIHILATING = "annihilating";

/** the rule two facing ends are handed to, if this theory has one */
const meetingRule = (theory: any): [string, TheoryRule] | undefined =>
  (Object.entries(theory.rules as Record<string, TheoryRule>)
    .find(([, r]) => {
      const t = r.type as unknown;
      return Array.isArray(t) && t.length === 2 && t.every(x => x === "Boundary");
    }));

/** a facing pair somewhere in the middle of a small world of this theory */
const facing = (w: World) => {
  const all = w.locals as any[];
  const l = all[Math.floor(all.length / 2)];
  for (const r of l.rays as any[]) {
    const o = outward(r);
    if (o?.target) return [o, o.target] as const;
  }
  return undefined;
};

export const meeting: Probe = {
  id: "meeting/what-the-halves-do",
  asks: "the vacuum splits a point into two halves facing each other across an edge. " +
    "What does this theory's meeting rule leave of them?",
  run: (lab: Lab): Probing => {
    const measured: Measured[] = [];
    const facts: Emitted[] = [];

    const found = meetingRule(lab.theory);
    if (!found) return {
      facts, measured, holds: false,
      found: `${lab.theory.name} has no rule between facing ends, so nothing decides ` +
        `what becomes of the two halves and this question has no answer here`,
    };
    const [name, rule] = found;

    /*
     * SMALL, WRAPPED, AND OF NO CONSEQUENCE. The world exists only to give the rule a
     * real facing pair to be applied to - the answer is about the rule and cannot
     * depend on the box, which is why the box is the smallest one that has an interior.
     */
    const g = GEOMETRIES["cubic-6"];

    /* what a ray of this theory can be carrying: a sign, or nothing at all */
    const signs: (number | undefined)[] = lab.theory.polarised ? [-1, 1] : [undefined];

    const rows: string[] = [];
    let survived = 0, cases = 0;
    for (const a of signs) for (const b of signs) {
      /* A FRESH WORLD PER CASE, so a pair cleared by the previous one cannot colour
       * this one. They are five cells across; there are at most four of them. */
      const w = new World({ theory: lab.theory, geometry: g, N: 5, seed: 1, boundary: "wrap" });
      const pair = facing(w);
      if (!pair) continue;
      const [x, y] = pair;
      for (const end of [x.source, y.source]) { end.active = true; end.polarity = undefined; }
      x.source.polarity = a;
      y.source.polarity = b;
      rule.exec(x, y);
      const left = (x.source.active ? 1 : 0) + (y.source.active ? 1 : 0);
      cases++;
      if (left > 0) survived++;
      rows.push(`${a ?? "neutral"} meets ${b ?? "neutral"}: ` +
        (left ? "both still there" : "both gone"));
    }

    if (!cases) return {
      facts, measured, holds: false,
      found: "no facing pair could be built to hand the rule, so it could not be asked",
    };

    measured.push(measure(CASES, cases,
      `every combination the two ends can be carrying in ${lab.theory.name} - ` +
      `${lab.theory.polarised ? "a sign each, so four" : "no sign to carry, so one"}. ` +
      `Enumerated, not sampled`));
    measured.push(measure(SURVIVING, survived,
      `applying ${name} to each: ${rows.join("; ")}`));

    /*
     * AND THE OTHER HALF OF THE SAME COUNT.
     *
     * How many states leave something behind decides the vacuum's density; how many
     * leave NOTHING decides how much of the time two charges are opposed, which is what
     * the article calls `share`. They are the same enumeration read twice, so both come
     * off it - and neither is a separate measurement to get wrong.
     */
    const gone = cases - survived;
    measured.push(measure(ANNIHILATING, gone,
      `the states in which ${name} left nothing at all: ${gone} of ${cases}`));

    for (const [q, v] of
      [[CASES, cases], [SURVIVING, survived], [ANNIHILATING, gone]] as [string, number][])
      facts.push({
        fact: { kind: "value", of: q, equals: rat(v) },
        from: [], measured: [measured[q === CASES ? 0 : 1]],
        because: q === CASES
          ? `a ray of ${lab.theory.name} can be carrying ${lab.theory.polarised
            ? "either sign" : "nothing but itself"}, so a facing pair has ${v} ` +
            `possible states and the enumeration is complete`
          : q === SURVIVING
            ? `${name} was applied to a real facing pair in each of the ${cases} states ` +
              `and left something behind in ${v} of them: ${rows.join("; ")}`
            : `and left nothing at all in the other ${v}: those are the states in which ` +
              `the two were opposed, which is what being opposed MEANS in a theory whose ` +
              `meetings either annihilate a pair or do not`,
        line: `${q} = ${v}`,
      });


    return {
      facts, measured, holds: true,
      found: `${name} leaves something behind in ${survived} of the ${cases} states a ` +
        `facing pair can be in - ${rows.join("; ")}`,
    };
  },
};
