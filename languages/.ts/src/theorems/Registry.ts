/**
 * THE PROVED THEOREMS, AS SOMETHING A PAGE CAN LOOK ONE UP IN.
 *
 * `npm run theorems` closes the rules of a theory once and writes what follows to
 * `theorems/` - a folder per question, each with its `proof.json`, its standalone page
 * and its `derivation.ts`. That is the record, and it is excellent for reading and
 * useless for CITING: an article that wants the mass law on the page has to either copy
 * the line out - which is a second copy of a derived thing, and therefore a thing that
 * drifts the next time a rule is edited - or read a file off disk, which an article
 * cannot do.
 *
 * SO THE SAME RUN ALSO WRITES `PROVED.ts` BESIDE THIS FILE, which is every one of those
 * records as one value, keyed by theory and then by question. That is what makes
 *
 *     <Eq theory="G" theorem="gravity.mass" />
 *
 * possible: the line on the page IS the line the prover concluded, looked up rather than
 * transcribed, and a rule edited in `G.ts` moves it. There is no second copy anywhere for
 * the two to disagree about.
 *
 * EVERY LINE HERE IS THE MARKUP, NOT A PARSE OF IT. A proof emits ASCII -
 * `\bar{r}^{D-1}` - because a combining macron is a tofu box on half the phones that will
 * read it, and `parse` in `rendering/Notation.ts` is the one thing that says what that
 * means. `Markup` runs it at render.
 *
 * THE PARSE WAS STORED HERE ONCE AND IT COST FOURTEEN TIMES THE BYTES. A parsed line is a
 * nest of `{kind, of}` objects around what was a handful of characters, and a page
 * carrying every derivation went from a third of a megabyte to four - for a parse that
 * takes no measurable time on strings this short. The reason for parsing in the prover
 * was that there must be ONE reading of `^{D-1}` and not one per consumer, and that
 * reason is untouched: there is still exactly one parser, it still ships in this package,
 * and every renderer still goes through it. What changed is WHEN it runs.
 *
 * `theorems/<id>/derivation.ts` still writes the parsed form, and should: those files are
 * for a consumer who wants the record without running anything of ours.
 *
 * AND IT IS ITS OWN ENTRY POINT - `@orbitmines/physics/theorems` - because it is every
 * derivation this repository has and nobody who wanted `<V>` and `<K>` should be made to
 * carry it. `notation(React, THEOREMS)` is how the two are joined, and the registry is an
 * argument there for the same reason React is: what is optional stays optional.
 */
/**
 * ONE STEP OF A PROOF - what it says, why, and where it came from.
 *
 * `kind` is the distinction a reader needs and the only one worth carrying: a `rule` is
 * the PROGRAM - a rewrite of the theory, so a premise that is already in `G.ts` and moves
 * when it is edited - and a `theorem` is what follows from those under the prover's
 * inference rules. Neither is a measurement, which is the difference between this
 * registry and the research repository's.
 */
export type Step = {
  kind: "rule" | "theorem";
  /** the rule's name, or the inference that reached it */
  via: string;
  /** what this step concluded */
  line: string;
  /** the arithmetic between the line above and this one, where there is any */
  working: string[];
  /** and why it follows, in prose */
  because: string;
};

/**
 * A NAME IN THE LINE, AND WHAT IT STANDS FOR - opened once, underneath.
 *
 * A LINE THAT CITES ITS PARTS IS UNREADABLE UNTIL THE PARTS ARE GIVEN, and a line with the
 * parts written into it is unreadable the other way: `F_{g}` mentions the arrivals three
 * times, so substituting printed the same two-channel expression three times over and
 * buried the shape of the law inside it. So neither. The line keeps its names, and every
 * name gets exactly one row here - which is how the substitution would be written by hand,
 * and the only arrangement whose length grows with the number of DISTINCT parts rather
 * than with how often each is used.
 */
export type Standing = {
  /** the name as it appears in the line */
  name: string;
  /** and what the closure settled it to */
  is: string;
  /** and why that is what it is */
  because: string;
};

/**
 * ONE FACTOR OF AN ANSWER, AND WHICH RULE PUT IT THERE.
 *
 * A law with two channels and four factors reads as one line and a reader cannot see the
 * joins. Each piece is matched against what the store settled, so the naming is found
 * rather than written, and a piece the proof did not settle goes unnamed.
 */
export type Part = {
  /** the factor, as it stands in the line */
  part: string;
  /** what the closure calls it */
  is: string;
  because: string;
};

/** what one theory concluded about one question, and everything behind it */
export type Proved = {
  /** the question's id - `gravity.mass`, the folder it is written to */
  theorem: string;
  /** which theory answered it: `G`, or a variant of it */
  theory: string;
  /** the question, as it is asked at the top of the page */
  asks: string;
  /** the fact this theorem is about, as the prover names it - empty for the line itself */
  about: string;
  /** the answer, or nothing where the closure did not reach one */
  concluded: string | null;
  /**
   * AND A SECOND WRITING OF THE SAME LAW, where there is one worth showing.
   *
   * The recursive form of the force law says WHY - the mismatch is measured against the
   * acceleration it produces, which is what puts `g` on both sides - and the solved form
   * says WHAT, with nothing on the right that is not already known. A page showing one
   * hides either the mechanism or the answer, so it shows both, and `leads` and `then`
   * are what say which is which.
   */
  also: string | null;
  leads: string | null;
  then: string | null;
  /**
   * THE OTHER LEDGER, where a theorem is about the line itself.
   *
   * The model has two things - the population and the space - and every rule does
   * something to each. One line cannot say both.
   */
  space: string | null;
  /** whether the closure actually reached the fact the question is about */
  standing: boolean;
  /** and what it wanted and did not have, where it did not */
  missing: string[];
  /** the borrowed steps, by their key in `REFERENCES` */
  cites: string[];
  /** the working, from the premises it rests on to the line it concluded */
  steps: Step[];
  /** every name in the line, opened exactly once - see `Standing` */
  standingFor: Standing[];
  /** and which factor of the answer is which, where the answer is several multiplied */
  parts: Part[];
};

/**
 * EVERY THEOREM, BY THEORY AND THEN BY QUESTION.
 *
 * THAT WAY ROUND ON PURPOSE. `vacuum.occupancy` is ONE question, and the interesting
 * thing about it is that different theories answer it differently through the same
 * derivation with a different rule underneath. Keyed by theory first, asking a variant
 * the same question is a lookup rather than a search, and `theories()` below is what
 * lists who has an answer.
 */
export type Registry = Record<string, Record<string, Proved>>;

/**
 * ONE THEOREM, OR NOTHING - and never a throw.
 *
 * A page citing a theorem that is not there is a broken citation, which is a thing to
 * SHOW rather than a thing to crash on: an article half of whose lines are still being
 * ported would otherwise render as a blank screen, and the one fact a reader needs -
 * which line is missing - is exactly what the crash takes away. So this returns nothing
 * and `Eq` prints what it could not find.
 */
export const proved = (of: Registry, theory: string, theorem: string): Proved | undefined =>
  of[theory]?.[theorem];

/** which theories have an answer to a question, in the order the registry carries them */
export const theories = (of: Registry, theorem: string): string[] =>
  Object.keys(of).filter(t => of[t][theorem]);

/** every question a theory answers */
export const asked = (of: Registry, theory: string): string[] =>
  Object.keys(of[theory] ?? {});
