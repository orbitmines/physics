/**
 * WHAT COUNTS AS A MEETING — the reading that was never tested, and that moves
 * everything downstream of it.
 *
 * The article says "when two rays meet, they annihilate". That leaves two things
 * open, and both were settled by whoever wrote each test file rather than by any
 * measurement:
 *
 *   WHAT MEETS      `head-on` — only a counter-propagating pair on one axis, which
 *                   is what a lattice-gas collision usually means. Or `co-located` —
 *                   any two rays that arrive at the same point, which is what the
 *                   sentence says.
 *
 *   HOW MANY        `all` the met pairs resolve in a tick, up to l.DEG/2 events at
 *                   one point. Or `one`, which is what "leaving A SINGLE neutral
 *                   spatial point behind" reads like against (G/2)'s "on ALL axis".
 *
 * FOUR COMBINATIONS, AND THEY GIVE VACUA AN ORDER OF MAGNITUDE APART. Since every
 * screening length in this project is a mean free path and a mean free path is
 * 1/fill, that is not a detail — it decides whether a force has a range of two cells
 * or fifty, and whether one is measurable at all.
 *
 * SO THE TEST IS NOT WHICH IS PRETTIEST. It is which of them leaves a vacuum that can
 * still carry the results this book already has: a resolvable force between two
 * bodies, and an occupancy in the range the derivation points at.
 */

import { test } from "../lib/Report.ts";

/**
 * AND THIS MODEL HAS ONE OF THEM, WHICH IS WHY THIS CLAIM IS NOT MEASURED HERE.
 *
 * A meeting in these rules is the two halves of ONE inserted point, facing each other
 * across the edge they were split onto — the article's `on-edge`, and the reading every
 * run in the book is made in. `head-on` and `co-located` are events AT a point: a
 * different quantification, a different pairing, and a different rule. They are not a
 * setting on ANNIHILATION and cannot be reached by turning one.
 *
 * SO THE COMPARISON IS DECLARED RATHER THAN RUN, and that is the whole content of this
 * entry. Sweeping four readings through a world that has one produces four copies of one
 * number and an order-of-magnitude spread of exactly zero, which reads as "the reading
 * does not matter" — the opposite of what the file says and the strongest possible
 * version of the failure it was written to catch. `World` refuses the other three at the
 * moment it is asked; this says so where a reader of the report will see it.
 */
export const whichMeeting = test({
  id: "vacuum/which-meeting",
  claims: "the reading of what counts as a meeting decides the vacuum's occupancy, and " +
    "therefore whether any force in this model is measurable at all",
  cited: ["Gravity", "XOR: Gravity + Magnetism"],
  under: {
    "G": "cannot be asked — a meeting here is ON THE EDGE, which is the reading the rules " +
      "are written in. The other three are events at a point: a different quantification " +
      "and a different rule, which would have to be written as one before the four could " +
      "be compared. Asking a world for one of them refuses; it is not silently given this " +
      "one, and the comparison is not run against itself.",
    "G^XOR": "cannot be asked — as above. The claim stands and is unmeasured, which is a " +
      "different thing from a four-way sweep that came back flat.",
  },
  run: () => { throw new Error("declared unmeasurable — see `under`"); },
});

export default [whichMeeting];
