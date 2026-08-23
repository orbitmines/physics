/**
 * WHAT IS STILL BEING TAKEN ON TRUST, AND WHAT IT WOULD BUY TO GO AND MEASURE IT.
 *
 * THE INVERSION THIS FILE IS. Everything else here reports what the rules reached; this
 * reports what stopped them, which is the more actionable half. A conjectured candidate is
 * a statement standing on a definition - a line that is true because of what a word was
 * chosen to mean - and the way to promote it is not to argue about the definition but to
 * go and measure the thing it asserts. So each definition is turned round and stated as an
 * EXPERIMENT: here is a claim about the discrete model, here is what would be true if it
 * held, and here is everything that would be promoted from conjectured to derived the
 * moment a probe stands behind it.
 *
 * SORTED BY WHAT THEY UNLOCK, because that is the only ordering that matters when the list
 * is a work queue. A definition four conclusions are waiting on is worth four times a
 * definition nothing but its own theorem uses, whatever either of them is about - and
 * `F = A · n[δ]` turns out to be underneath most of the gravitational chain, which is not
 * obvious from reading the theorems one at a time.
 *
 * A CONJECTURE IS NOT A GAP IN THE ARGUMENT. It is a statement the model makes that has
 * not yet been checked against the model's own behaviour, and some of them may be
 * unmeasurable in principle - a definition that only fixes a symbol has nothing to
 * measure. Those are worth spotting too, and they are spotted by trying: an experiment
 * that runs and finds no dependence at all has established something.
 */
import { Candidate } from "./Rank.ts";

export type Conjecture = {
  /** the fact being taken on trust, as its own line */
  fact: string;
  /** the theorem whose definition put it there */
  from: string;
  /** why that theorem thought it was allowed to say it */
  because: string;
  /** the candidates that cannot be called derived until it is measured */
  blocks: { subject: string; line: string; wouldBe?: string }[];
  /** how many of those there are - the ordering, and the reason for it */
  leverage: number;
  /**
   * WHAT A PROBE WOULD HAVE TO DO, in one line, where the shape of the claim says so.
   *
   * A proportionality between two named quantities is measurable by construction: vary
   * one, watch the other, fit. Saying so here turns the list from a set of complaints
   * into a set of instructions, and the ones where nothing can be said are the ones worth
   * looking at hardest - either the claim is empty or it is subtle.
   */
  measurable?: string;
};

/** the shape of a claim, read for whether a run could settle it */
const howToMeasure = (line: string): string | undefined => {
  const prop = /^(.+?)\s*∝\s*(.+)$/.exec(line);
  if (prop) return `vary ${prop[2].trim()} in a world of this theory and watch ` +
    `${prop[1].trim()} - if the claim holds, the fitted exponent is one and the ` +
    `dependence is on nothing else`;
  const sum = /^(.+?)\s*=\s*(.+?)\s*\+\s*(.+)$/.exec(line);
  if (sum) return `run the theory with each mechanism isolated - ${sum[2].trim()} alone, ` +
    `then ${sum[3].trim()} alone, then both - and check that what the pair does is what ` +
    `the two do separately, added. Additivity is a claim about the dynamics and a run ` +
    `can refuse it`;
  const prod = /^(.+?)\s*=\s*(.+?)\s*·\s*(.+)$/.exec(line);
  if (prod) return `vary ${prod[2].trim()} and ${prod[3].trim()} independently and check ` +
    `that ${prod[1].trim()} follows the product - a dependence on either alone, or a ` +
    `cross term, refutes it`;
  return undefined;
};

export const conjectures = (candidates: Candidate[]): Conjecture[] => {
  const by = new Map<string, Conjecture>();
  for (const c of candidates) {
    if (c.grade === "derived") continue;
    for (const w of c.waiting) {
      const key = `${w.from}|${w.fact}`;
      const it = by.get(key) ?? {
        fact: w.fact, from: w.from, because: w.because, blocks: [], leverage: 0,
        measurable: howToMeasure(w.fact),
      };
      it.blocks.push({
        subject: c.subject, line: c.line,
        wouldBe: c.verdict.kind === "recovers" ? c.verdict.target.law
          : c.verdict.kind === "contradicts"
            ? `a contradiction of ${c.verdict.target.law}` : undefined,
      });
      it.leverage = it.blocks.length;
      by.set(key, it);
    }
  }
  return [...by.values()].sort((a, b) => b.leverage - a.leverage);
};
