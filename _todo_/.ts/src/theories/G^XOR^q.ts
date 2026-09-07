/**
 * WHAT MEETING MAKES A CHARGE — the question this model has never asked, enumerated.
 *
 * THE ASYMMETRY IT IS ABOUT. `G^XOR^c` has a mechanism that MAKES POLARITY: a charge is
 * bent by a polarity field, and the corner throws off a ray carrying a polarity of its
 * own. Run it long enough and there is more polarity in the world than the vacuum drew,
 * laid down in a pattern by the thing that turned. That is a creation rule, and it is the
 * only one the model has.
 *
 * THERE IS NO SUCH RULE FOR CHARGE. Every charge in every run came out of (G/2) — the
 * vacuum's own draw, `charging`, one of four settings on an unconditional split. Nothing
 * that HAPPENS has ever produced one. Which means charge in this model is a boundary
 * condition and not a phenomenon, and a theory in which one of two signs is manufactured
 * by events and the other is handed out at creation is not a theory of two signs, it is a
 * theory of one sign with a decoration.
 *
 * SO THE QUESTION IS PUT AS A SPACE AND NOT AS A GUESS. A corner is two things meeting
 * sideways — something moving, and a field it is moving through — and there are exactly
 * three independent choices in what such a meeting can do:
 *
 *   READS    which sign of the mover, against which sign of the field. Four ways, and
 *            only one of them (charge against polarity) is the cyclotron the model
 *            already runs. `charge × charge` is "two charges meeting sideways", which is
 *            the case with no precedent anywhere in the file
 *   MAKES    which sign comes out — a polarity, a charge, or one of each
 *   SIGN     what that sign IS. Six ways, and this is where the three candidates split:
 *            the same sign as the field, the opposite sign to the field, or a draw
 *
 * FOUR TIMES THREE TIMES SEVEN IS EIGHTY-FOUR, every one of them a rule about one point and
 * what is at it, which is the only kind of rule this model allows. `CREATIONS` is the list
 * and `made` is the whole of the mechanism.
 *
 * WHAT WOULD COUNT AS AN ANSWER, stated before anything is run, so that a run cannot be
 * read into agreement afterwards:
 *
 *   the charge is MADE          `qMade` above nought — a rule that never fires is not a
 *                               rule, and four of the settings here cannot fire at all
 *   and it STAYS SMALL          |q| bounded across structures of every size, which is the
 *                               failure `G^XOR+XOR` documents at length: charge that is a
 *                               plain sum over points is a count of contents
 *   and it is NOT the polarity  the correlation between a structure's q and its net
 *                               polarity below the correlation `charging: "with"` forces,
 *                               which is 1 by construction. This is the criterion the
 *                               best-measured configuration fails, and it is why that
 *                               configuration is called an admission in `G.ts`
 *   and matter still runs       the seven criteria `G^XOR^c` already declares. A creation
 *                               rule that gives charge by killing the vacuum has bought
 *                               nothing
 *
 * AND THE ANTI-RULE IS IN HERE RATHER THAN BESIDE IT. "What if the rule ran the other way"
 * is not a separate theory: reversing which sign is read, or which sign comes out, or
 * whether the product is taken against the field or with it, is a MOVE WITHIN THIS SPACE.
 * `ANTI` names the one that is the current rule's inverse in every coordinate at once, so
 * the comparison is a lookup rather than a second file.
 */

/** which sign of the mover the meeting reads */
export type Reads = "charge" | "polarity";

/** what the meeting puts out */
export type Makes = "polarity" | "charge" | "both";

/**
 * WHAT SIGN COMES OUT.
 *
 *   own       EACH OUTPUT TAKES ITS OWN COUNTERPART — the polarity from the polarity, the
 *             charge from the charge. THIS IS WHAT `G^XOR^c` DOES, and it is the reason a
 *             corner can only ever make more of exactly what turned. It reads no field, so
 *             it is the control arm rather than a candidate
 *   self      the sign named by `self` — ONE scalar — written into whatever `makes` says.
 *             Distinct from `own` whenever `makes` is "both": it puts the charge's sign
 *             into the polarity too, which is a rule that collapses the two signs
 *   field     the same sign as the field it met. Alignment: a corner reinforces the thing
 *             that bent it, which is how a domain grows and how a field could be its own
 *             source
 *   anti      the opposite sign to the field. Opposition: a corner CANCELS the thing that
 *             bent it, which is a negative feedback and is the only setting here that can
 *             bound a field without anything counting
 *   product   the two operands multiplied — the sign is + where they agreed and − where
 *             they did not. This is the XOR itself, applied to creation rather than to
 *             meeting, and so is the setting most nearly in the model's own idiom
 *   anti-product   the same, reversed
 *   random    a fresh draw off the point's own stream. The control: any structure the
 *             other five give has to beat what falls out of noise
 */
export type Emits = "own" | "self" | "field" | "anti" | "product" | "anti-product" | "random";

export type Creation = {
  /** which sign of the MOVER is read */
  self: Reads;
  /** which sign of the FIELD it is read against */
  field: Reads;
  makes: Makes;
  emits: Emits;
};

/**
 * WHAT `G^XOR^c` HAS ALWAYS DONE, SAID IN THESE TERMS — the identity element, and it took a
 * measurement to get right.
 *
 * IT WAS FIRST WRITTEN AS `emits: "self"` AND THAT WAS WRONG. Run side by side against the
 * theory as it ships, on one seed for thirty ticks, `self` gave 38,697 corners against
 * 40,898 and a net charge of +19 against −27 — a different run, not the same one. The reason
 * is that `self` reads ONE scalar and writes it wherever `makes` points, so with
 * `makes: "both"` it was putting the CHARGE's sign into the polarity as well. The default
 * does no such thing: it copies polarity to polarity and charge to charge.
 *
 * WHICH MEANT THE SPACE DID NOT CONTAIN THE RULE IT WAS ENUMERATING ALTERNATIVES TO, and
 * the sweep was skipping this entry as a duplicate of a control it did not actually equal.
 * `own` is the sixth emitter and exists to close that hole: with it, `withCreation(CURRENT)`
 * is bit-identical to `G^XOR^c`, and every other rule in the list is a stated departure
 * from something that is in the list.
 */
export const CURRENT: Creation = { self: "charge", field: "polarity", makes: "both", emits: "own" };

/**
 * AND ITS INVERSE IN EVERY COORDINATE — the anti-rule.
 *
 * The mover is read by its polarity instead of its charge; the field by its charge instead
 * of its polarity; what comes out is a charge rather than the pair; and the sign is the
 * opposite of the field rather than the mover's own. Nothing in it is new machinery. It is
 * the same corner, asked backwards.
 */
export const ANTI: Creation = { self: "polarity", field: "charge", makes: "charge", emits: "anti" };

const READS: Reads[] = ["charge", "polarity"];
const MAKES: Makes[] = ["polarity", "charge", "both"];
const EMITS: Emits[] = ["own", "self", "field", "anti", "product", "anti-product", "random"];

/** every one of the eighty-four, in a fixed order so a run is quotable by index */
export const CREATIONS: Creation[] = READS.flatMap(self =>
  READS.flatMap(field =>
    MAKES.flatMap(makes =>
      EMITS.map(emits => ({ self, field, makes, emits })))));

export const nameOf = (c: Creation) =>
  `${c.self}×${c.field} → ${c.makes} (${c.emits})`;

/**
 * WHAT A CORNER PUTS ON THE RAY IT THROWS OFF.
 *
 * `r` is the ray that turned, `netP` and `netQ` are the field's two net signs AT THE
 * MOMENT IT TURNED — recorded by `steer`, because by the time this is asked the columns
 * have been swapped and the point is holding the next tick's neighbourhood.
 *
 * A SIGN THAT IS NOUGHT IS NOT A SIGN. An unbiased point has net 0 in both, and a rule
 * that read that as "make a −" would manufacture a sign out of a field that has none. So
 * a nought propagates: the meeting happens and puts out nothing, which is the correct
 * reading of a corner in a field with no bias in it — there was nothing there to copy.
 */
export const made = (
  c: Creation | undefined | null,
  r: any,
  netP: number,
  netQ: number,
  rng: () => number,
): { polarity: number | undefined; charge: number | undefined } => {
  /* THE DEFAULT IS THE OLD LINE, TO THE BIT. A theory that has not asked this question
   * behaves exactly as it did, so every existing measurement stands. */
  if (!c) return { polarity: r?.polarity ?? 1, charge: r?.charge };

  const mine = (c.self === "charge" ? r?.charge : r?.polarity) ?? 0;
  const theirs = c.field === "charge" ? netQ : netP;

  /* EACH SIGN FROM ITS OWN COUNTERPART — the default, and the one case that is not a single
   * scalar written to one or both fields. It short-circuits because there is no `sign`. */
  if (c.emits === "own") return {
    polarity: c.makes === "charge" ? undefined : (r?.polarity ?? 1),
    charge: c.makes === "polarity" ? undefined : r?.charge,
  };

  const sign =
      c.emits === "self" ? mine
    : c.emits === "field" ? theirs
    : c.emits === "anti" ? -theirs
    : c.emits === "product" ? mine * theirs
    : c.emits === "anti-product" ? -(mine * theirs)
    : (rng() < 0.5 ? 1 : -1);

  /* AND NOUGHT MEANS NOUGHT — see above. A ray with no sign on it is not a ray carrying
   * the sign 0; it is a ray the meeting declined to sign. */
  const s = Math.sign(sign) || 0;
  if (c.makes === "polarity") return { polarity: s || undefined, charge: undefined };
  if (c.makes === "charge") return { polarity: undefined, charge: s || undefined };
  return { polarity: s || undefined, charge: s || undefined };
};

/**
 * WHICH OF THE SEVENTY-TWO CAN MAKE A CHARGE AT ALL — decidable without running anything,
 * and the reason the sweep is smaller than it looks.
 *
 * A setting that never puts a charge on anything is not a candidate answer to "what makes
 * charge"; it is the question restated. Twenty-eight of the eighty-four `makes: "polarity"`
 * and are in the list as the control arm, not as candidates. Of the rest, one more class
 * is empty for a reason worth stating: `emits: "self"` with `self: "polarity"` and
 * `makes: "charge"` DOES make charge, but it makes it out of polarity alone and the field
 * is not consulted, so it is a relabelling rather than a meeting.
 */
export const canMakeCharge = (c: Creation) => c.makes !== "polarity";

/** and whether the field is actually read — a rule that ignores it is not about a meeting */
export const readsField = (c: Creation) =>
  c.emits === "field" || c.emits === "anti" || c.emits === "product" || c.emits === "anti-product";

/** the control arm: it makes a sign without consulting anything but the ray that turned */
export const isControl = (c: Creation) => c.emits === "own" || c.emits === "self";

/**
 * THE CANDIDATES PROPER: it makes a charge, and it makes it out of an encounter. Fourteen
 * settings if the pair-makers are counted with the charge-makers, which they should be —
 * `makes: "both"` is the case where one event signs the ray in both books at once, and
 * nothing says a meeting has to produce one sign rather than a pair.
 */
export const CANDIDATES = CREATIONS.filter(c => canMakeCharge(c) && readsField(c));

/** put a creation rule on a theory — the wrapper idiom, as `withSteering` does it */
export const withCreation = <T extends { copy(): any; name: string }>(t: T, c: Creation | null) =>
  (t.copy() as any).decorate.World(() => ({ creates: c })).called(
    `${t.name} [${c ? nameOf(c) : "as written"}]`);
