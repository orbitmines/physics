/**
 * DID THE SWEEP FIND WHAT WE ALREADY KNEW - asked of every handmade theorem, and reported
 * whether it did or not.
 *
 * THE CHECK THAT KEEPS THE REST HONEST. Discovery closes a bigger premise set under the
 * same rules, so it OUGHT to reach everything the twenty-five theorems reach and more. If
 * it does not, one of two things is true and both matter: either the union broke something
 * - a definition from one theorem colliding with another's, a rule firing in an order it
 * never sees when the store is small - or the sweep is quietly narrower than it looks and
 * the count of things it "found" is standing next to a count of things it lost.
 *
 * IT WAS NOT REACHING SIX OF THEM, and none of the three reasons was "the rules could not":
 *
 *   PREMISE-SHADOWED  `shell` and `turn` are measured directly by a probe AND derivable.
 *                     `Kernel.conclusion` prefers the earliest pass among scalings, so the
 *                     measurement won and the derivation was dropped for being a premise.
 *                     That pair is the strongest result available - see `Reached.ts`.
 *   NOT A SCALING     `gravity.reach` concludes a divergence. The citation lens collects
 *                     scalings, values and expressions, so a divergence could not appear.
 *   GENUINELY MISSING which is the only one of the three that is a finding about the
 *                     rules, and the only one worth acting on.
 *
 * So this runs every sweep and the numbers go on the page. A theorem that stops being
 * rediscovered is a regression, and it should read as one.
 */
import { THEOREMS } from "../Catalogue.ts";
import { Cell } from "./Harvest.ts";

export type Covered = {
  theorem: string;
  /** the quantity the handmade theorem asks about */
  about: string;
  /** what the sweep managed to say about it */
  state: "derived" | "measured only" | "absent";
  /** the statement the sweep reached, where it reached one */
  line?: string;
  /** true where a probe and the rules independently reached the same statement */
  agrees?: boolean;
  /** how many of the swept cells reached it at all */
  cells: number;
};

export const coverage = (cells: Cell[]): Covered[] =>
  THEOREMS.map(e => {
    const about = e.theorem.about;
    const hits = cells
      .map(c => c.concluded.find(r => r.subject === about))
      .filter((x): x is NonNullable<typeof x> => !!x);
    if (!hits.length)
      return { theorem: e.theorem.id, about, state: "absent" as const, cells: 0 };
    const derived = hits.find(h => !h.at.premise);
    return {
      theorem: e.theorem.id, about,
      state: derived ? ("derived" as const) : ("measured only" as const),
      line: (derived ?? hits[0]).at.line,
      agrees: (derived ?? hits[0]).agrees,
      cells: hits.length,
    };
  });
