/**
 * HOW FAR THE PULL REACHES - and the answer is that the sum does not end.
 *
 * THE FIRST THEOREM HERE THAT CITES ANOTHER RATHER THAN REPROVING IT. What one source
 * puts at a place, and how that thins with distance, is `gravity.falloff` - twelve steps
 * from an Ehrhart count to a shell to a share, all of them a page away. Repeating them
 * inside this theorem would say nothing new and would bury the one line that is new. So
 * the falloff enters as a CITATION, the way a result established earlier in a text does,
 * and the derivation below is three steps long because three steps is all that is left.
 *
 * AND THE ARGUMENT IS THAT THE DISTANCE CANCELS. Every source in the universe is putting
 * charges everywhere, so what arrives at you is a sum over all of them, taken shell by
 * shell. A shell at r̄ holds matter in proportion to how big the shell is - which grows
 * as r̄^(D-1) - and each unit of that matter puts on you what the falloff says, which
 * SHRINKS as r̄^(D-1). The two are the same power, so they cancel exactly and every shell
 * contributes the same amount regardless of how far away it is.
 *
 * THEN THERE IS NOTHING LEFT TO DECIDE. A constant added up over unboundedly many shells
 * has no total, and the prover says so. This is Olbers' paradox in the same form the
 * article puts it in - and the divergence is the interesting output, not a breakdown:
 * whatever ends the pull cannot be geometry, because the geometry says the pull does not
 * end. Something else has to.
 */
import { base } from "../Algebra.ts";
import { Theorem } from "../Theorem.ts";
import { lattice, RHO } from "../probes/lattice.ts";
import { medium } from "../probes/medium.ts";
import { counts, SHEET_C } from "../probes/counts.ts";
import { BALL, BETA, RBAR, SHELL, spread } from "../Rules.ts";
import { DEFICIT, STRENGTH } from "../probes/medium.ts";
import { AREA } from "../probes/absorber.ts";

/** how much matter a shell at this distance holds */
export const SHELL_MASS = "matter in the shell";
/** what that shell puts on you */
export const FROM_SHELL = "what the shell puts on you";
/** the whole ambient field - every shell added up */
export const AMBIENT = "ambient";
/** how much matter there is per unit of room, out there */
export const RHO_M = "ρ_{m}";

export const reach: Theorem = {
  id: "gravity.reach",
  asks: "every source in the universe is putting charges everywhere. Adding up what all " +
    "of them put on you, is there a total?",
  about: AMBIENT,
  probes: [lattice, medium, counts],
  /* the falloff is not reproved here - it is cited, and this is where it comes from */
  uses: ["gravity.falloff"],
  wants: [
    { kind: "dilate", of: BALL, by: RBAR },
    { kind: "sum", of: AMBIENT, over: RBAR, term: FROM_SHELL },
  ],
  glossary: {
    [AMBIENT]: { symbol: "Φ", says: "everything every source puts on you, added up" },
    [SHELL_MASS]: { symbol: "M(\\bar{r})", says: "how much matter a shell at \\bar{r} steps holds" },
    [FROM_SHELL]: { symbol: "dΦ", says: "what that one shell puts on you" },
    [RHO_M]: { symbol: "ρ", says: "how much matter there is per unit of room" },
    [SHEET_C]: { symbol: "SHEET", says: "how many charges one pulse lets go" },
    [SHELL]: { symbol: "shell", says: "how many sites lie at exactly \\bar{r} steps" },
    [BALL]: { symbol: "ball", says: "how many sites lie within \\bar{r} steps" },
    [BETA]: { symbol: "STEP", says: "how much room one step covers - the volume of the polytope the exits span" },
    [RHO]: { symbol: "ρ", says: "the lattice, and its one site per fundamental cell" },
    [RBAR]: { symbol: "\\bar{r}", says: "the discrete radius - how many steps from the centre" },
    [spread(DEFICIT)]: { symbol: "δ/site", says: "what one source puts at one place" },
    [STRENGTH]: { symbol: "S", says: "how much disturbance a source makes" },
    [AREA]: { symbol: "A", says: "how much of the medium you are open to" },
    D: { symbol: "D", says: "the lattice's dimension" },
  },
};

/**
 * WHAT THIS THEOREM PUTS IN BY HAND - three lines, and none of them mentions a power.
 *
 * How much matter a shell holds, what a shell therefore puts on you, and that the whole
 * field is every shell added up. The cancellation is not among them: it happens in the
 * arithmetic, between a shell that grows and a falloff that shrinks at exactly the same
 * rate, and neither line below knows about the other.
 */
export const definitions = [
  {
    fact: { kind: "scales" as const, of: SHELL_MASS, by: { ...base(RHO_M), ...base(SHELL) } },
    because: "a shell at \\bar{r} steps has as many sites in it as the shell has, and matter " +
      "is spread through space at some density - so the matter it holds is the one " +
      "times the other. No power appears here; the shell's size is established " +
      "separately",
    line: `${SHELL_MASS} ∝ ${RHO_M} · ${SHELL}`,
  },
  {
    fact: {
      kind: "product" as const, of: FROM_SHELL,
      from: [SHELL_MASS, spread(DEFICIT)],
    },
    because: "what one shell puts on you is how much matter is in it, times what a unit " +
      "of matter at that distance puts on you - and the second of those is the falloff, " +
      "cited rather than reproved",
    line: `${FROM_SHELL} = ${SHELL_MASS} · δ/site`,
  },
  {
    fact: { kind: "sum" as const, of: AMBIENT, over: RBAR, term: FROM_SHELL },
    because: "every source in the universe is putting charges everywhere, so what " +
      "arrives at you is what all of them put together - taken shell by shell, out as " +
      "far as there are shells",
    line: `${AMBIENT} = \\sum_{\\bar{r}} ${FROM_SHELL}`,
  },
];
