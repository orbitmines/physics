/**
 * WHAT A BODY FEELS AT r̄ STEPS - asked without the word square anywhere in it.
 *
 * THE ONLY THING THIS FILE SAYS ABOUT THE FORCE is that it is what the medium has to
 * offer at a place times how much of the medium the body is open to, and that a body's
 * disturbance is measured by how much of it that body makes. Both are DEFINITIONS - of
 * the words "force" and "S" - and neither mentions distance. Nor does any inference rule.
 *
 * DISTANCE ENTERS EXACTLY ONCE, in `lattice/what-the-tiling-is`, which establishes that
 * the sites within r̄ steps are a dilated polytope. Ehrhart's theorem then fixes the ball
 * at degree D and one subtraction fixes the shell at D-1. Whether that reads as 1/r̄^2 or
 * 1/r̄ is decided by the lattice and by nothing in this file.
 *
 * AND NOTHING IN THE CHAIN IS FITTED. Every premise is either an exhaustive count or an
 * exact invariance:
 *
 *   the ball is a dilated polytope    finite differences of integer counts, exactly D
 *   the lattice prefers no direction  the exit set's second moment, over all DEG exits
 *   transport conserves               ray counts under MOVEMENT and ARRIVAL alone,
 *                                     1250, 1250, 1250 - a bijection, said in integers
 *   it travels by stepping            a front that never outruns the steps it has taken
 *   a body disturbs the medium        the rays it removed, off the source's own ledger
 *   there are ways into a body        the exits leading in, walked on the lattice
 *
 * There is no slope, no tolerance and no box in any of them, which is what makes the
 * conclusion a statement about the theory rather than about a run of it.
 */
import { base } from "../Algebra.ts";
import { Theorem } from "../Theorem.ts";
import { lattice, RHO } from "../probes/lattice.ts";
import { medium, DEFICIT, STRENGTH } from "../probes/medium.ts";
import { absorber, AREA } from "../probes/absorber.ts";
import { BALL, BETA, RBAR, ROOM, SHELL, spread } from "../Rules.ts";

/** what a body at r̄ steps feels */
export const FORCE = "F";

export const inverseSquare: Theorem = {
  id: "gravity.falloff",
  asks: "a body sits \\bar{r} steps away from another in the medium. How does what it " +
    "feels depend on \\bar{r}, and on what else?",
  about: FORCE,
  probes: [lattice, medium, absorber],
  wants: [
    { kind: "dilate", of: BALL, by: RBAR },
    { kind: "isotropic", of: RHO },
    { kind: "conserved", of: DEFICIT },
    { kind: "carried", of: DEFICIT, by: RHO },
    { kind: "positive", of: DEFICIT },
    { kind: "positive", of: AREA },
  ],
  glossary: {
    [FORCE]: { symbol: "F", says: "what the far body feels" },
    [AREA]: { symbol: "A", says: "how much of the medium the far body is open to - the exits leading into it" },
    [DEFICIT]: { symbol: "δ", says: "the disturbance the near body leaves in the medium" },
    [STRENGTH]: { symbol: "S", says: "how much disturbance the near body makes, per tick" },
    [SHELL]: { symbol: "shell(r̄)", says: "how many sites lie at exactly r̄ steps" },
    [BALL]: { symbol: "ball(r̄)", says: "how many sites lie within r̄ steps" },
    [BETA]: { symbol: "β", says: "the step-polytope's volume - Ehrhart's leading coefficient" },
    [RHO]: { symbol: "ρ", says: "the lattice, and its one site per fundamental cell" },
    [ROOM]: { symbol: "room", says: "volume, in the space the lattice sits in" },
    [RBAR]: { symbol: "r̄", says: "the discrete radius - how many steps from the centre" },
    [spread(DEFICIT)]: { symbol: "δ/site", says: "one site's share of the disturbance" },
    D: { symbol: "D", says: "the lattice's dimension" },
  },
};

/**
 * THE TWO THINGS THIS THEOREM ASSERTS, AND THEY ARE BOTH DEFINITIONS.
 *
 * Kept apart from the probes because there is nothing to measure about either: they say
 * what two words mean. They are listed rather than buried so that a reader can count how
 * much the proof assumes - two sentences, and neither has an r̄ in it.
 */
export const definitions = [
  {
    fact: { kind: "scales" as const, of: DEFICIT, by: base(STRENGTH) },
    because: "the disturbance a body leaves is the rays it took out, and how many that " +
      "is per tick is what S names. This is what the letter means, not something " +
      "measured about it",
    line: `${DEFICIT} ∝ ${STRENGTH}`,
  },
  {
    fact: { kind: "product" as const, of: FORCE, from: [AREA, spread(DEFICIT)] },
    because: "what a body feels is what the medium has to offer where it stands, times " +
      "how much of the medium it is open to. That is what a force IS in this model, and " +
      "it mentions no distance",
    line: `${FORCE} = ${AREA} · ${spread(DEFICIT)}`,
  },
];
