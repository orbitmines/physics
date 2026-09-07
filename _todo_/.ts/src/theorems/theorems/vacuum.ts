/**
 * WHAT THE VACUUM DOES ON ITS OWN, AND WHAT MATTER DOES TO IT - two laws, because they
 * are two questions and the second is the mechanism of gravity in this model.
 *
 * SPACE IS MADE BY A RULE, IN EVERY ONE OF THESE THEORIES. The split fires on a point
 * because the point is neutral, and it does not ask what the theory's rays carry - so
 * every neutral point makes one point every tick, and the rate space is MADE at is one
 * per neutral point per tick whatever theory is running.
 *
 * WHICH IS NOT THE SAME QUESTION AS HOW MUCH SURVIVES, and conflating the two was wrong.
 * An earlier version of this file set the expansion equal to the occupancy, so pure
 * gravity - which annihilates both halves of everything it makes - came out as not
 * expanding at all. That is false and it is the wrong way round: G expands exactly as
 * hard as anything else does, and then destroys what it made. The occupancy is what is
 * left standing afterwards, not whether the making happened.
 *
 * AND THE DISTINCTION IS WHAT MAKES GRAVITY WORK UNDER G. If pure gravity did not expand
 * there would be no expansion for matter to be in the way of, and no deficit - so the
 * theory with the strongest gravity in this book would have none. What matter suppresses
 * is the MAKING, and the making is there in every theory.
 *
 * AND MATTER IS IN THE WAY. A body's cells are not neutral - they belong to a source - so
 * the split does not fire on them. The space that would have been made there is not made,
 * and that shortfall is what spreads outward and what another body is pushed into. THIS
 * IS THE WHOLE OF GRAVITY HERE: not an attraction between bodies but a deficit in an
 * expansion, and the two theorems below are the two halves of saying so.
 *
 * WHICH IS WHY THEY ARE SEPARATE FROM `gravity.falloff`. That theorem takes a disturbance
 * and works out how it thins with distance - a counting argument that would apply to any
 * disturbance in any medium. These two say what the disturbance IS and where it comes
 * from, and they are the ones that make the falloff a statement about gravity rather than
 * about diffusion.
 */
import { mul, num, sym } from "../Expr.ts";
import { Theorem } from "../Theorem.ts";
import { meeting, CASES, OCCUPANCY, SURVIVING } from "../probes/meeting.ts";
import { STRENGTH } from "../probes/medium.ts";
import { absorber, AREA_OTHER } from "../probes/absorber.ts";
import { rules, REWRITES } from "../probes/rules.ts";


/** how fast a region of empty space grows, per point per tick */
export const EXPANSION = "expansion";
/** what is still standing once the halves have met - a second question about the same rule */
export const SURVIVES = "what survives";
/** how many of a body's cells are not free to split */
export const BLOCKED = "blocked";
/**
 * THE SHORTFALL A BODY LEAVES IN THE EXPANSION - and it is the SAME SYMBOL the falloff
 * law calls the strength of a disturbance.
 *
 * NAMING THEM ALIKE IS THE CLAIM THAT THEY ARE ONE QUANTITY, which is what this model
 * says: what a body puts into the medium is not something in addition to the expansion it
 * prevented, it IS the expansion it prevented. Kept as two names they were two quantities
 * that happened to behave the same way, and the vacuum's pull had to be added to the
 * gravitational law by hand as an extra term - which is exactly the sort of thing this
 * folder exists not to do. Sharing the symbol, `gravity.falloff` substitutes one into the
 * other and the vacuum's pull is derived rather than posited.
 */
export const SUPPRESSED = STRENGTH;

export const expansion: Theorem = {
  id: "vacuum.expansion",
  asks: "the vacuum splits every neutral point every tick. How fast does empty space " +
    "actually grow, in this theory?",
  about: EXPANSION,
  probes: [meeting, rules],
  uses: ["vacuum.occupancy"],
  wants: [
    { kind: "value", of: CASES, equals: { n: 0, d: 1 } },
    { kind: "value", of: SURVIVING, equals: { n: 0, d: 1 } },
  ],
  glossary: {
    [EXPANSION]: { symbol: "expansion", says: "how fast space is MADE, per neutral point per tick" },
    [SURVIVES]: { symbol: "net", says: "how much of it is still there after the halves meet" },
    [OCCUPANCY]: { symbol: "f", says: "how much of what the vacuum makes survives its first meeting" },
    [SURVIVING]: { symbol: "surviving", says: "the states that leave something behind" },
    [CASES]: { symbol: "states", says: "the states a facing pair can be in" },
    [REWRITES]: { symbol: "rewrites", says: "the rules this theory is made of" },
  },
};

export const expansionDefinitions = [
  {
    fact: { kind: "equals" as const, of: EXPANSION, to: num(1) },
    because: "the split fires on a point because the point is NEUTRAL, and it does not " +
      "ask what this theory's rays carry - so every neutral point makes one point every " +
      "tick, in every theory here. That is the rate space is made at, and it is the same " +
      "number whatever is running",
    line: `${EXPANSION} = 1`,
  },
  {
    fact: {
      kind: "equals" as const, of: SURVIVES,
      to: mul(sym(EXPANSION), sym(OCCUPANCY)),
    },
    because: "how much of what was made is still there once the two halves have met is a " +
      "different question, and its answer is the occupancy - enumerated from the meeting " +
      "rule rather than measured. Pure gravity makes space at the same rate as anything " +
      "else and keeps none of it; a theory whose rays carry a sign keeps half. What " +
      "matter is in the way of is the MAKING, which is why gravity works in both",
    line: `${SURVIVES} = ${EXPANSION} · ${OCCUPANCY}`,
  },
];

export const suppression: Theorem = {
  id: "vacuum.suppression",
  asks: "a body's cells belong to a source, so the split does not fire on them. What " +
    "does that do to the expansion around it - and is that gravity?",
  about: SUPPRESSED,
  probes: [meeting, rules, absorber],
  uses: ["vacuum.expansion", "vacuum.occupancy"],
  wants: [
    { kind: "equals", of: EXPANSION, to: [] },
    { kind: "value", of: BLOCKED, equals: { n: 0, d: 1 } },
  ],
  glossary: {
    [SUPPRESSED]: { symbol: "deficit", says: "the expansion a body prevents - what gravity is made of" },
    [BLOCKED]: { symbol: "A'", says: "the ways across a body's boundary - what limits the shortfall that escapes" },
    [AREA_OTHER]: { symbol: "A'", says: "the ways across the suppressing body's own boundary" },
    [EXPANSION]: { symbol: "expansion", says: "how fast empty space grows, per point per tick" },
    [OCCUPANCY]: { symbol: "f", says: "how much of what the vacuum makes survives" },
  },
};

export const suppressionDefinitions = [
  {
    /*
     * WHAT IS SUPPRESSED IS COUNTED IN CELLS; WHAT ESCAPES IS COUNTED ON THE BOUNDARY.
     *
     * Both are true and they are different quantities, and the first version of this file
     * used the wrong one. The split fails to fire at every cell the body owns, so the
     * suppression itself goes as its VOLUME. But a shortfall deep inside is filled in by
     * its neighbours before it gets anywhere: what reaches the medium outside has to cross
     * the boundary, and the boundary has a fixed number of ways through it. So the deficit
     * a distant body actually feels is limited by the AREA, not the volume - which is why
     * `gravity.falloff` measures inert absorbers and gets a shadow, and why a bigger
     * surface pulls harder.
     *
     * The count is the probe's own walk of the exits crossing the body's boundary - the
     * same number that says how much of the medium the body is open to, read the other
     * way round.
     */
    fact: { kind: "equals" as const, of: BLOCKED, to: sym(AREA_OTHER) },
    because: "the split fails to fire at every cell the body owns, so the suppression " +
      "itself goes as its volume - but a shortfall deep inside is filled in by its " +
      "neighbours before it gets out. What reaches the medium beyond has to cross the " +
      "boundary, and how many ways there are through it is the body's area. So what a " +
      "distant body feels is limited by the surface, and a bigger surface pulls harder",
    line: `${BLOCKED} = ${AREA_OTHER}`,
  },
  {
    fact: {
      kind: "equals" as const, of: SUPPRESSED,
      to: mul(sym(BLOCKED), sym(EXPANSION)),
    },
    because: "each blocked cell is one point that would have expanded and did not, so " +
      "the shortfall is how many are blocked times how fast each would have grown. THIS " +
      "IS GRAVITY IN THIS MODEL: not a pull between bodies but an expansion that did not " +
      "happen, spreading outward from whatever was in the way. A second body is pushed " +
      "toward it because fewer rays arrive from that direction than from the far side",
    line: `${SUPPRESSED} = ${BLOCKED} · ${EXPANSION}`,
  },
];
