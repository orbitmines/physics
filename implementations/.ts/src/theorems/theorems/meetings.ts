/**
 * HOW OFTEN TWO SOURCES MEET IN THE SAME PLACE - the article's S_ab, and the second
 * theorem to come out of the same three rules as the first.
 *
 * WHAT IS WORTH NOTICING IS HOW LITTLE IS NEW. A source lets go of SHEET charges a pulse
 * and they spread over the shell they have grown to, so what it puts at a place is
 * `m·SHEET/shell(r̄)` - which is `spreading` again, on a different quantity, with the
 * source's own equator count as the strength. The article says so in as many words: "this
 * is where the inverse square is". A meeting then needs a charge from EACH source at the
 * same place, which is `multiplying`. Nothing was added to the prover to reach this; the
 * theorem is a different question put to the rules that were already there.
 *
 * SO THE RATE FALLS AS THE SQUARE OF THE FALLOFF. Two independent inverse squares
 * multiplied is 1/r̄^(2(D-1)) - at D = 3, a fourth power - which is what a rate wanting
 * two things to coincide has to look like, and it comes out of the arithmetic rather than
 * being reasoned about.
 *
 * SHEET IS NOT DEG, and the article records getting that wrong: "the same constant was
 * doing both jobs until it was noticed". They are separate counts here, both read off the
 * geometry, and on fcc-12 they are 6 and 12.
 */
import { base, smul } from "../Algebra.ts";
import { Theorem } from "../Theorem.ts";
import { lattice, RHO, SHEET_Q } from "../probes/lattice.ts";
import { medium, DEFICIT } from "../probes/medium.ts";
import { BALL, BETA, RBAR, SHELL, spread } from "../Rules.ts";

/**
 * WHAT EACH SOURCE PUTS INTO THE MEDIUM PER PULSE - and there are two of them, kept apart.
 *
 * The first version of this file gave the second source a bare mass and multiplied it
 * into the first source's spread charge, which produced ONE inverse square where the
 * article has two. A coincidence needs a charge from each, and each has travelled and
 * thinned on its own way out - so both are spread, both by the same rule, and the rate
 * carries the square.
 */
export const EMISSION_A = "emitted_{a}";
export const EMISSION_B = "emitted_{b}";
/** how often the two coincide at a place */
export const RATE = "S_{ab}";
/** the two masses, which are the two pulse rates */
export const MASS_A = "m_{a}";
export const MASS_B = "m_{b}";

export const meetings: Theorem = {
  id: "meeting.rate",
  asks: "two sources are both putting charges into the medium. How often do a charge " +
    "from each turn up in the same place, \\bar{r} steps out?",
  about: RATE,
  probes: [lattice, medium],
  wants: [
    { kind: "dilate", of: BALL, by: RBAR },
    { kind: "conserved", of: EMISSION_A },
    { kind: "conserved", of: EMISSION_B },
    { kind: "isotropic", of: RHO },
    { kind: "positive", of: SHEET_Q },
  ],
  glossary: {
    [RATE]: { symbol: "S", says: "how often a charge from each source coincides" },
    [EMISSION_A]: { symbol: "emitted", says: "what the first source puts into the medium per pulse" },
    [EMISSION_B]: { symbol: "emitted'", says: "what the second source puts in" },
    [MASS_A]: { symbol: "m", says: "a source's pulse rate, which is its mass" },
    [MASS_B]: { symbol: "m'", says: "the other source's pulse rate" },
    [SHEET_Q]: { symbol: "SHEET", says: "how many charges one pulse lets go - the source's equator" },
    [SHELL]: { symbol: "shell", says: "how many sites lie at exactly \\bar{r} steps" },
    [BALL]: { symbol: "ball", says: "how many sites lie within \\bar{r} steps" },
    [BETA]: { symbol: "STEP", says: "how much room one step covers - the volume of the polytope the exits span, which is the coefficient Ehrhart gives the ball" },
    [RHO]: { symbol: "ρ", says: "the lattice, and its one site per fundamental cell" },
    [RBAR]: { symbol: "\\bar{r}", says: "the discrete radius - how many steps from the centre" },
    [spread(EMISSION_A)]: { symbol: "chance", says: "the chance a site is holding one of the first source's" },
    [spread(EMISSION_B)]: { symbol: "chance'", says: "the chance it is holding one of the second's" },
    D: { symbol: "D", says: "the lattice's dimension" },
  },
};

/**
 * WHAT THIS THEOREM PUTS IN BY HAND - three lines, all of them definitions.
 *
 * What a source emits, that its emission is carried by the same transport everything else
 * is, and that a meeting needs one from each. None mentions distance.
 */
export const definitions = [
  ...[[EMISSION_A, MASS_A, "first"], [EMISSION_B, MASS_B, "second"]].flatMap(
    ([emission, mass, which]) => [
      {
        fact: { kind: "scales" as const, of: emission, by: smul(base(mass), base(SHEET_Q)) },
        because: `the ${which} source pulses at its own rate - which is what its mass IS ` +
          `here - and each pulse lets go of SHEET charges over its equator. So what it ` +
          `puts into the medium is the one times the other, and SHEET is a count of the ` +
          `tiling rather than anything fitted`,
        line: `${emission} ∝ ${mass} · ${SHEET_Q}`,
      },
      {
        fact: { kind: "carried" as const, of: emission, by: RHO },
        because: `what the ${which} source lets go of travels outward through the medium ` +
          `by the same stepping everything else does - it is the same rays`,
        line: `${emission} travels through ${RHO}`,
      },
      {
        fact: { kind: "conserved" as const, of: emission },
        because: `what the ${which} source lets go of is carried by transport, which was ` +
          `counted in integers neither making nor unmaking any of what it carries - the ` +
          `same fact that makes ${DEFICIT} conserved, under another name`,
        line: `${emission} is conserved in flight`,
      },
      {
        fact: { kind: "positive" as const, of: emission },
        because: `a source that pulses lets go of charges, and SHEET of them is more ` +
          `than none`,
        line: `${emission} > 0`,
      },
    ]),
  {
    /* A COINCIDENCE NEEDS ONE FROM EACH, and each has thinned on its own way out */
    fact: {
      kind: "product" as const, of: RATE,
      from: [spread(EMISSION_A), spread(EMISSION_B)],
    },
    because: "a meeting needs a charge from EACH source in the same place, so the rate " +
      "is the chance the first has one there times the chance the second does. Both " +
      "have travelled and thinned on the way, which is why the rate carries the falloff " +
      "twice over - and that is what it means for a rate to want two things to coincide",
    line: `${RATE} = chance · chance'`,
  },
];
