/**
 * COULOMB'S SIGN LAW, AND IT WAS ALREADY INSIDE THE GRAVITATIONAL CONSTANT.
 *
 * THE HALF HAD NEVER BEEN JUSTIFIED. `gravity.full` assembles the force out of six
 * factors and one of them is `share` - how much of the time two charges are opposed -
 * which `share.coherence` settles at one half by applying the meeting rule to a facing
 * pair in every state it can be in. Two of four states are opposite, so one half, so the
 * constant carries one. Nothing in that argument is wrong and nothing in it is general:
 * the four states are equally available only because each body was as likely to offer a
 * plus as a minus.
 *
 * SO THE HALF IS NOT A CONSTANT, IT IS A FACT ABOUT THE MATTER. Let a fraction (1 + P)/2
 * of what a body emits be positive - a BIAS, which is all a charge can be in a model
 * whose rays carry one sign each - and `bias/what-two-biased-bodies-do` measures what
 * becomes of the enumeration: (1 - P_a·P_b)/2 - exactly, over forty-nine bias pairs, with
 * the corners and the middle run end to end through the rule itself.
 *
 * AND THE FORCE FOLLOWS, BECAUSE THE FORCE IS PROPORTIONAL TO IT. gravity.full writes the
 * meeting channel as six factors multiplied and exactly one of them asks about the signs
 * the bodies carry - the rest are counts of the tiling, two masses and a distance. So they
 * cancel out of the ratio and what is left is
 *
 *     F_meet  ->  F_meet · (1 - P_a·P_b)
 *
 * which is three claims at once, and none of them was put in:
 *
 *   P = 0 GIVES NEWTON EXACTLY. Unbiased matter recovers the half, so gravity is the
 *   unbiased case of this rather than a separate law sitting beside it.
 *   A BIAS DOES NOTHING TO SOMETHING WITH NO BIAS. P_a·0 = 0 whatever P_a is, so a
 *   charged thing pulls on unbiased matter exactly as an uncharged one of the same mass
 *   would - out of the arithmetic rather than by decree.
 *   AND OPPOSITES ATTRACT, SAMENESS REPELS. Opposite biases give twice the pull;
 *   alike biases give none of it. That is the law Coulomb wrote down as an observation
 *   in 1785, and here it is a property of which pairs a rewrite rule destroys.
 *
 * AND ONLY ONE OF THE TWO CHANNELS IS TOUCHED, WHICH IS ITSELF A PREDICTION. gravity.full
 * has two: the MEETINGS between the two bodies' own radiation, and the VACUUM's own pull,
 * which is the expansion that did not happen where a body's cells sat. The second needs
 * neither body to emit anything - an inert absorber has it - so there is nothing in it for
 * a bias to act on and it is the same for both signs. What comes out is therefore
 *
 *     F  =  F_vac  +  F_meet · (1 - P_a·P_b)
 *
 * a force with a screenable half and an unscreenable one, which is the division between
 * electrostatics and gravity said in one line rather than assumed as two theories. It is
 * also why a charged thing still falls like an uncharged one: the term that does not care
 * is still there underneath the one that does.
 *
 * WHAT THIS IS NOT. It is not the whole of electrostatics: `charge.falloff` gets the
 * 1/r^{2} from the same dilution argument gravity uses, and the two together are Coulomb's
 * law - shape from the shells, sign from the meetings. Neither half is derived here twice.
 *
 * AND IT IS NOT A SECOND FORCE. There is one force in this model and it is made of
 * meetings; charge is the direction the meetings lean. A theory whose rays carry no sign
 * has nothing to bias, so `bias` returns nothing under `G` and this theorem correctly
 * concludes nothing there - which is the same sentence as "pure gravity has one sign".
 */
import { add, mul, sym } from "../Expr.ts";
import { Theorem } from "../Theorem.ts";
import { BIAS_A, BIAS_B, OPPOSED, bias } from "../probes/bias.ts";
import { ANNIHILATING, CASES, meeting } from "../probes/meeting.ts";
import { SHARE } from "./share.ts";
import { BY_MEETING, BY_VACUUM } from "./full.ts";

/** how much of the unbiased pull two bodies of given bias actually get */
export const COUPLING = "g_{q}";
/** what the meetings between the two bodies' own radiation come to, once biased */
export const FORCE_Q = "F_{q}";
/** and everything that arrives - the biased channel plus the one a bias cannot touch */
export const FORCE_ALL = "F";

export const coulomb: Theorem = {
  id: "charge.attraction",
  asks: "the half in the gravitational constant is how often two charges are opposed, " +
    "and that is a fact about the bodies rather than a number. What happens to the force " +
    "when they are biased?",
  about: FORCE_ALL,
  probes: [meeting, bias],
  uses: ["share.coherence", "gravity.full"],
  wants: [
    { kind: "equals", of: OPPOSED, to: [] },
    { kind: "value", of: SHARE, equals: { n: 1, d: 2 } },
  ],
  glossary: {
    [FORCE_ALL]: { symbol: "F", says: "everything that arrives at the far body - both channels, with the bias acting on the one it can act on" },
    [FORCE_Q]: { symbol: "F_{q}", says: "what the MEETINGS between the two bodies' own radiation come to once the bodies are biased" },
    [BY_MEETING]: { symbol: "F_{meet}", says: "the same channel for UNBIASED matter - gravity.full's meeting term, cited and not rebuilt here" },
    [BY_VACUUM]: { symbol: "F_{vac}", says: "the other channel: what arrives because a body's cells are not neutral and the expansion did not happen there. It needs neither body to emit anything, so a bias has nothing to act on and it is the same for both signs" },
    [COUPLING]: { symbol: "g_{q}", says: "how much of that pull a biased pair actually gets" },
    [OPPOSED]: { symbol: "opposed", says: "how much of the time a ray from one body meets an opposite ray from the other" },
    [SHARE]: { symbol: "share", says: "the same fraction for unbiased matter, which is the half already sitting in the constant" },
    /* share.coherence's own two counts, set here as well because this theorem carries its
     * definition - left out, the page showed `share = annihilating/cases` in the middle of
     * a derivation whose every other line was in symbols */
    [ANNIHILATING]: { symbol: "n_{opp}", says: "how many of the states a facing pair can be in are ones the rule leaves nothing of" },
    [CASES]: { symbol: "n_{states}", says: "how many states a facing pair can be in at all - four, where the rays carry a sign" },
    [BIAS_A]: { symbol: "P_{a}", says: "one body's bias - a fraction (1 + P)/2 of what it emits is positive" },
    [BIAS_B]: { symbol: "P_{b}", says: "the other's" },
  },
};

/**
 * THE THREE LINES PUT IN BY HAND, and all three are readings of the assembled law rather
 * than claims about the world.
 *
 * THE FIRST IS A CANCELLATION, NOT AN ASSUMPTION. `gravity.full` writes the meeting
 * channel as lean·share·SHEET^{2}·m·m'·met, and of those six factors exactly one - share -
 * asks about the signs the bodies carry. Every other one is a count of the tiling, a mass,
 * or a distance. So a biased pair feels the same product with `opposed` where `share`
 * stood, and the ratio of the two is the ratio of those two numbers with the other five
 * divided out. Writing it as a quotient is what makes that cancellation VISIBLE rather
 * than something a reader has to trust.
 *
 * THE SECOND IS WHAT A RATIO MEANS. If a biased pair meets opposed g_q as often, it feels
 * g_q of the channel. There is nothing in that line but the word "of".
 *
 * THE THIRD IS THAT THINGS WHICH ARRIVE ADD, which `gravity.full` also says - and it is
 * here rather than left implicit because it is where the interesting half of the answer
 * is. Only one of the two channels went through the ratio. The other one is still there.
 */
export const definitions = [
  {
    fact: { kind: "quotient" as const, of: COUPLING, over: OPPOSED, under: SHARE },
    because: "gravity.full writes the meeting channel as six factors multiplied - what " +
      "one meeting is worth to a path, how much of the time the two are OPPOSED, the " +
      "charges each pulse lets go on both sides, the two masses, and the meetings summed " +
      "along the line. Exactly one of those asks about the SIGNS the bodies are carrying, " +
      "and it is the second: the rest are counts of the tiling, masses, and a distance, " +
      "and not one of them moves when a body is biased. So the biased and unbiased " +
      "channels differ by that factor alone and everything else cancels out of the ratio",
    line: `${COUPLING} = \\frac{${OPPOSED}}{${SHARE}}`,
  },
  {
    fact: {
      kind: "equals" as const, of: FORCE_Q,
      to: mul(sym(BY_MEETING), sym(COUPLING)),
    },
    because: "and a pair that meets opposed that fraction as often feels that fraction " +
      "of the meeting channel. This line says nothing except what a ratio is",
    line: `${FORCE_Q} = ${BY_MEETING} · ${COUPLING}`,
  },
  {
    fact: {
      kind: "equals" as const, of: FORCE_ALL,
      to: add(sym(BY_VACUUM), sym(FORCE_Q)),
    },
    because: "and what a body actually feels is everything that arrives, which is BOTH " +
      "channels - and only one of them has been touched. The vacuum channel needs " +
      "neither body to emit anything: a body's cells are not neutral, the split does not " +
      "fire on them, and the expansion that did not happen spreads outward as a " +
      "shortfall whatever signs anybody is carrying. THERE IS NOTHING IN IT FOR A BIAS " +
      "TO ACT ON, so it is the same for both signs of charge and cannot be screened by " +
      "either. That is the part of this law that is gravity, and it is why a charged " +
      "thing falls like an uncharged one even where the other channel is pulling it " +
      "about",
    line: `${FORCE_ALL} = ${BY_VACUUM} + ${FORCE_Q}`,
  },
];
