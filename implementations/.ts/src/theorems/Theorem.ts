/**
 * A THEOREM — the probes to run, the quantity to ask about, and nothing else.
 *
 * NOTE WHAT IS NOT HERE: the answer. A theorem names a goal quantity and the probes
 * that might have something to say about it, and what comes back is whatever the rules
 * could make of what the probes found. `inverse-square` does not mention squares, or
 * distance, or gravity; it says "run these four probes, then tell me what became of the
 * force". If the lattice is two-dimensional the same theorem yields 1/r, and if the
 * medium turns out not to conserve what it carries the theorem yields nothing and says
 * which premise was missing.
 *
 * `wants` IS NOT AN EXPECTATION EITHER, and the distinction matters. It is the list of
 * premises the rules need in order to reach any conclusion at all, and it exists so
 * that a failure can be reported as "no probe established that the deficit is
 * conserved" rather than as silence. Nothing is ever checked against it; it is read
 * only when there is no conclusion.
 */
import { Fact, Glossary } from "./Fact.ts";
import { Probe } from "./Probe.ts";

export type Theorem = {
  id: string;
  /** what is being asked, in one sentence, with no answer in it */
  asks: string;
  /** the quantity whose law is wanted */
  about: string;
  probes: Probe[];
  /** the premises the rules need to say anything — read only on failure */
  wants: Fact[];
  /**
   * THEOREMS PROVED EARLIER WHOSE RESULTS THIS ONE MAY CITE.
   *
   * Named rather than discovered, because a citation is a claim about the order of the
   * argument: `meeting.rate` may lean on `gravity.falloff` because the falloff is
   * established before it and not the other way round. Listing them keeps that order
   * explicit and makes a circular pair of theorems impossible to write by accident.
   */
  uses?: string[];
  /** what the symbols mean, for the page */
  glossary: Glossary;
};
