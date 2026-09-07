/**
 * RUN THE PROBES, CLOSE THE FACTS, AND WRITE DOWN WHAT HAPPENED — including when what
 * happened is that nothing could be concluded.
 *
 * THE ORDER IS THE GUARANTEE. Probes first, against a world of the theory as configured;
 * then saturation, which may not read anything but the store; then the goal, asked once
 * at the end. Nothing downstream can reach back and add a premise, so the conclusion is
 * a function of what the runs found and of nothing else. A theorem that "did not prove"
 * is written out with the same care as one that did — the probes it ran, the numbers
 * they came back with, and the premises the rules were still waiting for.
 */
import { Fact, says } from "./Fact.ts";
import { chained, conclusion, explain, Node, proof, saturate, Store } from "./Kernel.ts";
import { Lab, Probe, Probing } from "./Probe.ts";
import { RULES } from "./Rules.ts";
import { Theorem } from "./Theorem.ts";

export type Ran = { probe: Probe; out: Probing };

export type Proven = {
  theorem: Theorem;
  lab: Lab;
  ran: Ran[];
  store: Store;
  /** the law the prover ended with, or nothing */
  at?: Node;
  /** the steps behind it, premises first */
  steps: Node[];
  /** whether the goal was shown to be about something rather than about zero */
  standing: boolean;
  /** the premises no probe established — written only when there is no conclusion */
  missing: string[];
};

/**
 * WHAT AN EARLIER THEOREM ESTABLISHED, ready to be cited by a later one.
 *
 * A RESULT IS ONLY GOOD WHERE IT WAS PROVED, and that now includes the regime. `met`
 * multiplies two densities together and `gravity.full` multiplies met by some counts, so
 * both inherit whichever branch of the transport law is binding - and a citation that
 * ignored the regime would hand the thin assembly the dense density and produce Newton's
 * law in a medium too thin for it. Which it did.
 */
export type Established = { theorem: string; fact: Fact; line?: string };

/**
 * A PROBE'S ANSWER, KEPT - because it is about the theory and the lattice, and not about
 * which theorem happened to ask.
 *
 * `lattice/what-the-tiling-is` counts the same balls whether it was asked by the shell
 * theorem, the falloff, the meeting rate or the reach; `medium/what-transport-does` ticks
 * the same worlds. Run once per theorem they were run six times over for an answer that
 * could not differ, and a full sweep took the better part of an hour - most of it
 * recomputing integers that were already on the desk.
 *
 * THE KEY IS EVERYTHING A PROBE CAN SEE. Theory, lattice, box, ticks and seeds: change any
 * of them and it is a different question, so it gets a different slot. A probe that
 * looked at something outside that list would be answering a question the key cannot
 * distinguish, which is the one way this could go wrong - so the key is the whole of the
 * lab except the regime, which no probe reads.
 */
const answered = new Map<string, Probing>();

const askedOf = (probe: Probe, lab: Lab) =>
  [probe.id, lab.theory.name, lab.geometry.name, lab.N, lab.T, lab.seeds.join("+")]
    .join("|");

export const prove = (
  theorem: Theorem, lab: Lab, extra: { fact: Fact; because: string }[] = [],
  established: Established[] = [],
): Proven => {
  const store = new Store();
  const ran: Ran[] = [];

  for (const probe of theorem.probes) {
    lab.say(`  ${probe.id}`);
    const key = askedOf(probe, lab);
    const out = answered.get(key) ?? probe.run(lab);
    answered.set(key, out);
    ran.push({ probe, out });
    lab.say(`      ${out.found.replace(/\\bar\{([^{}]*)\}/g, "$1_")}`);
    for (const f of out.facts) store.premise(f, probe.id);
  }

  /*
   * A DEFINITION IS NOT A PREMISE AND IS NOT SMUGGLED IN AS ONE.
   *
   * `F = A · δ/site` says what the word force means in this model; there is no run
   * behind it and there could not be, so it cannot go through `premise`, which refuses
   * anything without measurements. It is added as its own kind of leaf and shows on the
   * page as a definition — which is honest, and lets a reader see exactly how much was
   * assumed: one sentence, with no r in it.
   */
  /*
   * THE DEFINITION'S OWN LINE COMES WITH IT.
   *
   * Dropped, every definition was re-rendered from its fact by `says` - which gives a
   * correct sentence and throws away the notation the theorem wrote. `share`'s integral
   * came out as "share = TOTAL / π" instead of the integral over the range, and the
   * chained summary had nothing to chain because the only distinct form it could see was
   * the answer.
   */
  for (const d of extra)
    store.define({
      fact: d.fact, from: [], because: d.because,
      line: (d as { line?: string }).line,
    }, theorem.id);

  /*
   * WHAT WAS PROVED EARLIER COMES IN AS A CITATION, not as a re-derivation.
   *
   * Only the results this theorem SAYS it uses, and only ones it has not established for
   * itself - a theorem that probes something directly should stand on its own probe
   * rather than on someone else's conclusion.
   */
  for (const e of established) {
    if (!(theorem.uses ?? []).includes(e.theorem)) continue;
    if (store.has(e.fact)) continue;
    store.cite({
      fact: e.fact, from: [],
      because: `established earlier by ${e.theorem}, on this same theory and lattice - ` +
        `the working is there rather than repeated here`,
      line: e.line,
    }, e.theorem);
  }

  saturate(store, RULES);

  const at = conclusion(store, theorem.about);
  /*
   * A SUM THAT RUNS AWAY IS NOT A LAW ABOUT A POSSIBLE NOTHING.
   *
   * `standing` asks whether the thing a theorem concluded about was shown to be more than
   * zero, which is the right question for a proportionality and a strange one for a
   * divergence: `gravity.reach` concludes that the ambient field has no total, and
   * appending "but of a quantity nothing showed to be non-zero" to that reads as a doubt
   * about the very thing being asserted.
   */
  /*
   * AN EXPRESSION IS ITS OWN ANSWER. `standing` asks whether the thing concluded about was
   * shown to be more than zero, which is the right question for a proportionality - it
   * drops every constant, so a law about a quantity that happens to be nought looks
   * exactly like a law about one that is not. An expression drops nothing: `lean =
   * c̄·n/DEG` says what it is, and appending a doubt about whether it is anything reads as
   * a doubt about the line itself. A divergent sum is likewise emphatically not nothing.
   */
  const at2 = at?.fact;
  const standing = at2?.kind === "diverges" ||
    (at2?.kind === "equals" && at2.to.length > 0) ||
    store.has({ kind: "positive", of: theorem.about });

  return {
    theorem, lab, ran, store, at,
    steps: at ? proof(store, at) : [],
    standing,
    missing: at && standing ? [] : explain(store, theorem.wants),
  };
};

export const sentence = (p: Proven): string => {
  if (!p.at) return `no law for ${p.theorem.about} follows from what the probes found`;
  /* the same chained-and-factored form the page gets, so the terminal and the page do
   * not disagree about what was proved */
  const line = chained(p.store, p.theorem.about, p.at) ??
    p.at.line ?? says(p.at.fact, p.theorem.glossary);
  return p.standing ? line : `${line} - but of a quantity nothing showed to be non-zero`;
};
