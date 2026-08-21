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
import { conclusion, explain, Node, proof, saturate, Store } from "./Kernel.ts";
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

export const prove = (
  theorem: Theorem, lab: Lab, extra: { fact: Fact; because: string }[] = [],
): Proven => {
  const store = new Store();
  const ran: Ran[] = [];

  for (const probe of theorem.probes) {
    lab.say(`  ${probe.id}`);
    const out = probe.run(lab);
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
  for (const d of extra)
    store.define({ fact: d.fact, from: [], because: d.because }, theorem.id);

  saturate(store, RULES);

  const at = conclusion(store, theorem.about);
  const standing = store.has({ kind: "positive", of: theorem.about });

  return {
    theorem, lab, ran, store, at,
    steps: at ? proof(store, at) : [],
    standing,
    missing: at && standing ? [] : explain(store, theorem.wants),
  };
};

export const sentence = (p: Proven): string => {
  if (!p.at) return `no law for ${p.theorem.about} follows from what the probes found`;
  const line = p.at.line ?? says(p.at.fact, p.theorem.glossary);
  return p.standing ? line : `${line} - but of a quantity nothing showed to be non-zero`;
};
