/**
 * HOW MANY SITES LIE AT r̄ STEPS — derived, for every r̄, on any lattice.
 *
 * A THEOREM IN ITS OWN RIGHT, and the one every falloff law in this project stands on.
 * Whatever is conserved and spread evenly is diluted by exactly the room it is spread
 * over, so the rate at which anything falls off with distance IS this — and everything
 * else is arithmetic. It is worth proving by itself, and it is worth proving PROPERLY,
 * because an earlier version of this folder measured it instead: a log-log fit of site
 * counts in a box, which gave 1.906 at N = 17, 1.950 at N = 21 and 1.960 at N = 31,
 * creeping towards 2 and never arriving. Rounding that to 2 is a judgement call standing
 * exactly where a theorem ought to be, and it is true only inside the box it was fitted
 * in.
 *
 * WHAT IS ASSUMED HERE IS ONE EXACT NUMBER: that the lattice holds one site per
 * fundamental cell, so its density is 1/|det basis|. That is read off the basis vectors
 * without running anything. From it, `volume` gives the ball — because scaling a region
 * by λ multiplies the room in it by λ^D, which is what having D dimensions MEANS — and
 * `differencing` gives the shell, because a shell is the rate the ball grows at and
 * differentiating a power drops its exponent by one.
 *
 * SO THE ANSWER HOLDS AT EVERY RADIUS, including radii no box could contain, and on any
 * lattice with a well-defined density rather than on the four that were counted. The
 * count is still taken and is still reported — as a CHECK on the coefficient, agreeing
 * to a couple of per cent, which is what the cells cut by the ball's boundary cost.
 */
import { Theorem } from "../Theorem.ts";
import { lattice, RHO } from "../probes/lattice.ts";
import { BALL, BETA, RBAR, ROOM, SHELL } from "../Rules.ts";

export const shellGrowth: Theorem = {
  id: "lattice.shell-growth",
  asks: "how many sites of this lattice lie at exactly \\bar{r} steps from a point, and what " +
    "does that do as \\bar{r} grows?",
  about: SHELL,
  probes: [lattice],
  wants: [
    { kind: "dilate", of: BALL, by: RBAR },
    { kind: "rate", of: SHELL, from: BALL, in: RBAR },
  ],
  glossary: {
    [SHELL]: { symbol: "shell", says: "how many sites lie at exactly \\bar{r} steps" },
    [BALL]: { symbol: "ball", says: "how many sites lie within \\bar{r} steps" },
    [BETA]: { symbol: "STEP", says: "how much room one step covers - the volume of the polytope the exits span, which is the coefficient Ehrhart gives the ball" },
    [RHO]: { symbol: "ρ", says: "the lattice's site density - one per fundamental cell" },
    [ROOM]: { symbol: "room", says: "volume, in the space the lattice sits in" },
    [RBAR]: { symbol: "\\bar{r}", says: "the discrete radius - how many steps from the centre" },
    D: { symbol: "D", says: "the lattice's dimension" },
  },
};
