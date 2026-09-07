/**
 * EVERY SUBJECT THE CLOSURE FINISHED A STATEMENT ABOUT - which is not the same set
 * `Kernel.conclusions` returns, and the difference was hiding six of our own theorems.
 *
 * `conclusions` exists to feed CITATIONS: what may a later theorem lean on. That is a
 * deliberately narrow question and it answers it with scalings, values and expressions,
 * because those are the shapes a citation can be used as. Discovery is asking a different
 * question - what did the rules manage to say about anything at all - and read through
 * the citation lens it loses:
 *
 *   A DIVERGENCE. `gravity.reach` concludes that the ambient field has no total. That is
 *   an answer, it is the answer that says whatever ends the pull cannot be geometry, and
 *   there is no way for it to appear in a list that only collects scalings.
 *
 *   A CEILING. `bound` facts likewise.
 *
 * AND THE OTHER HALF OF THE PROBLEM IS THE OPPOSITE OF MISSING: a subject that was
 * MEASURED and also DERIVED. `shell` is counted directly by the lattice probe and is also
 * reached by Ehrhart plus differencing, and `conclusion` sorts scalings by earliest pass -
 * so the premise wins, discovery drops it for being a premise, and the derivation is
 * thrown away.
 *
 * THAT CASE IS THE STRONGEST RESULT IN THE FOLDER AND IT WAS THE ONE BEING BINNED. A
 * probe measured it, a proof reached it independently, and they agree: that is a check on
 * the rules AND a check on the probe at once, and neither half can be got any other way.
 * So both are kept and the agreement is recorded as its own fact about the pair.
 */
import { Fact, key as fkey } from "../Fact.ts";
import { Node, Store, conclusion } from "../Kernel.ts";

export type Reached = {
  subject: string;
  /** the finished statement - derived where there is one, measured where there is not */
  at: Node;
  /** the probe's own version of the same subject, where a probe measured it too */
  measured?: Node;
  /**
   * TRUE WHEN A PROBE AND THE RULES REACHED THE SAME STATEMENT INDEPENDENTLY.
   *
   * Not "a probe measured something about it" - the same statement, by key. `shell` is
   * counted off the lattice and derived from Ehrhart, and the two agree; if they ever
   * stopped agreeing that would be the most important line this repository could print,
   * so it is computed rather than assumed.
   */
  agrees?: boolean;
};

/** the kinds of statement that count as having finished saying something */
const FINAL: Fact["kind"][] = [
  "scales", "value", "equals", "diverges", "bound", "quotient", "raised",
];

/**
 * THE BEST DERIVED STATEMENT ABOUT A SUBJECT, preferring what the RULES reached.
 *
 * `Kernel.conclusion` prefers the earliest pass among scalings, which is right when the
 * store holds only what one theorem needed and wrong over a union that holds the
 * measurement as well: earliest means the probe, every time.
 */
const derivedFor = (s: Store, of: string): Node | undefined => {
  const mine = [...s.nodes.values()].filter(n =>
    !n.premise && (n.fact as { of?: string }).of === of &&
    FINAL.includes(n.fact.kind));
  if (!mine.length) return undefined;
  /* the folder's own answer where it has one - it knows how to choose between forms */
  const its = conclusion(s, of);
  if (its && !its.premise) return its;
  return mine.sort((a, b) => b.pass - a.pass)[0];
};

export const reached = (s: Store): Reached[] => {
  const subjects = new Set<string>();
  for (const n of s.nodes.values()) {
    const of = (n.fact as { of?: string }).of;
    if (of && FINAL.includes(n.fact.kind)) subjects.add(of);
  }

  const out: Reached[] = [];
  for (const subject of subjects) {
    const derived = derivedFor(s, subject);
    const measured = [...s.nodes.values()].find(n =>
      n.premise && (n.fact as { of?: string }).of === subject &&
      !n.via.startsWith("definition:") && !n.via.startsWith("cited:") &&
      FINAL.includes(n.fact.kind));
    const at = derived ?? measured;
    if (!at) continue;
    out.push({
      subject, at, measured,
      agrees: derived && measured
        ? fkey(derived.fact) === fkey(measured.fact) : undefined,
    });
  }
  return out;
};
