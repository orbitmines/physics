/**
 * THE WHICH-PATH RATE - and the r's cancel, twice.
 *
 * THE RULE DOES NOT KNOW WHOSE CHARGE IT IS. A meeting is a meeting; nothing in it records
 * which source either charge came from. So if a superposition is going to leave a record
 * of which path it took, the record has to be in the FIELD - in how many meetings happen
 * where, which is a rate rather than a mark.
 *
 * THAT IS TWO DIFFERENT RATES AND ONLY ONE OF THEM DECOHERES, which is why the question is
 * worth asking carefully. What is derived here is the one that would: the rate at which
 * meetings leave a record, integrated over the field.
 *
 * AND THE DISTANCE FALLS OUT. What each source puts at a place goes as one over the shell
 * - `gravity.falloff`, cited - so a meeting needs the product of two of those, which is
 * one over the shell squared. But the number of PLACES at that distance is the shell. Add
 * up the rate over all of them and one factor of shell cancels; the article's "the r's
 * cancel, twice" is that happening at both ends. What is left has no r in it at all, and
 * a rate with no distance in it is a pure number - which is then the whole of the answer,
 * and the article's point is that the number is tiny.
 */
import { Theorem } from "../Theorem.ts";
import { lattice, RHO } from "../probes/lattice.ts";
import { medium } from "../probes/medium.ts";
import { counts, SHEET_C } from "../probes/counts.ts";
import { SHELL, spread } from "../Rules.ts";
import { EMISSION_A, EMISSION_B, MASS_A, MASS_B } from "./meetings.ts";

/** how many places there are at that distance to leave a record at */
export const PLACES = "places";
/** the rate a record is left, at one place */
export const AT_ONE = "record here";
/** and over the whole field */
export const RECORD = "record";

export const record: Theorem = {
  id: "decoherence.rate",
  asks: "a meeting does not know whose charge it is, so a which-path record has to be in " +
    "the field. How fast is one left, and does it depend on how far apart things are?",
  about: RECORD,
  probes: [lattice, medium, counts],
  uses: ["meeting.rate"],
  wants: [
    { kind: "product", of: AT_ONE, from: [spread(EMISSION_A), spread(EMISSION_B)] },
  ],
  glossary: {
    [RECORD]: { symbol: "rate", says: "how fast a which-path record is left, over the whole field" },
    [AT_ONE]: { symbol: "rate(r)", says: "how fast one is left at one place" },
    [PLACES]: { symbol: "shell", says: "how many places there are at that distance" },
    [SHELL]: { symbol: "shell", says: "how many sites lie at that distance" },
    [spread(EMISSION_A)]: { symbol: "chance", says: "what the first source has put there" },
    [spread(EMISSION_B)]: { symbol: "chance'", says: "what the second has" },
    [MASS_A]: { symbol: "m", says: "the first source's mass" },
    [MASS_B]: { symbol: "m'", says: "the second's" },
    [SHEET_C]: { symbol: "SHEET", says: "how many charges one pulse lets go" },
    [RHO]: { symbol: "ρ", says: "the lattice" },
  },
};

export const definitions = [
  {
    fact: {
      kind: "product" as const, of: AT_ONE,
      from: [spread(EMISSION_A), spread(EMISSION_B)],
    },
    because: "a record is left where a charge from each source meets, so the rate at one " +
      "place is what the first has put there times what the second has - both of which " +
      "thinned on the way, and both of which are cited rather than counted again",
    line: `${AT_ONE} = chance · chance'`,
  },
  {
    fact: { kind: "product" as const, of: RECORD, from: [AT_ONE, SHELL] },
    because: "the record is left anywhere on the shell, not at one chosen place - so the " +
      "rate over the whole field is the rate at one place times how many places there " +
      "are. That count is the shell, and it is what cancels one of the two falloffs",
    line: `${RECORD} = ${AT_ONE} · ${SHELL}`,
  },
];
