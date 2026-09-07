/**
 * WHAT THIS THEORY ACTUALLY DOES - its rewrites, listed off the theory itself.
 *
 * THE ARTICLE'S "the rules, in full" IS AN INVENTORY, and an inventory is exactly the sort
 * of claim that rots: a rule gets added, or a limit takes one away, and the prose still
 * says three. Read off `Theory.rules` it cannot - the list is whatever the theory has, and
 * a theory built by `without` reports one fewer without anybody editing a sentence.
 *
 * AND IT IS THE SHAPE THAT MATTERS, not just the names. A rule is quantified over
 * something - a point, a ray, a facing pair, the world - and may be gated on what the
 * things it is offered are carrying. That is the whole of what a rewrite IS here, and it
 * is what the other probes read when they need to know whether a hand-off takes a partner
 * or whether transport is a bijection.
 */
import { Rule as TheoryRule, RuleType } from "../../lib/Theory.ts";
import { rat } from "../Algebra.ts";
import { Lab, Probe, Probing, measure } from "../Probe.ts";
import { Emitted, Measured } from "../Kernel.ts";

/** how many rewrites this theory is made of */
export const REWRITES = "rewrites";

const shape = (t: RuleType) =>
  t === "World" ? "the world" : Array.isArray(t) ? `a chain of ${t.join(", ")}` : `each ${t}`;

export const rules: Probe = {
  id: "rules/what-this-theory-does",
  asks: "what rewrites is this theory made of, what is each one quantified over, and " +
    "what must be there before it fires?",
  run: (lab: Lab): Probing => {
    const measured: Measured[] = [];
    const facts: Emitted[] = [];
    const all = Object.entries(lab.theory.rules as Record<string, TheoryRule>);

    const lines = all.map(([name, r]) =>
      `${name} over ${shape(r.type)}${r.where ? `, gated on "${r.where}"` : ""}`);

    measured.push(measure(REWRITES, all.length,
      `${lab.theory.name} is made of these, read off the theory itself: ${lines.join("; ")}`));

    facts.push({
      fact: { kind: "value", of: REWRITES, equals: rat(all.length) },
      from: [], measured: [measured[0]],
      because: `${lab.theory.name} has exactly these ${all.length} rewrites and no ` +
        `others: ${lines.join("; ")}. Listed off the theory rather than transcribed, so ` +
        `a theory with a rule taken out reports one fewer without anything here changing`,
      line: `${REWRITES} = ${all.length}`,
    });
    facts.push({
      fact: { kind: "constant", of: REWRITES },
      from: [], measured: [measured[0]],
      because: "a theory is the same theory wherever it is applied",
      line: `${REWRITES} is the same everywhere`,
    });

    return {
      facts, measured, holds: all.length > 0,
      found: `${lab.theory.name}: ${lines.join("; ")}`,
    };
  },
};
