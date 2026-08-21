/**
 * HOW THICK THE MEDIUM IS AT r̄ STEPS - and why a galaxy's outskirts do not fall off.
 *
 * THE SAME COUNTING ARGUMENT AS THE FALLOFF, WITH ONE MORE FACTOR IN IT. What is
 * conserved as a medium carries something outward is not the density but the FLUX: how
 * much crosses a shell per tick, which is the room at that distance times how thick the
 * medium is times how fast it is moving. Written out, Phi = shell · n · v, and it cannot
 * change - the shell is bigger further out, so something else has to be smaller.
 *
 * EVERYTHING TURNS ON WHETHER THE SPEED KNOWS ABOUT THE DENSITY, and that is the whole
 * of the transport law:
 *
 *     v = c · min(1, n/n_c)
 *
 * Where the medium is thick there is always something to hand a carrier on to, so it
 * goes at c and the speed drops out of the balance: n is left alone against the shell,
 * falls as 1/shell, and the force is Newton's. Where it is thin the carrier waits, v
 * follows n, and n now appears TWICE in the same conserved product - the balance goes
 * quadratic and n falls as the square root of the shell instead. At D = 3 that is 1/r̄
 * where the dense limit gave 1/r̄², which is a force falling off slowly enough to hold a
 * rotation curve flat.
 *
 * ONE RULE, BOTH LIMITS, AND THE PROVER IS NOT TOLD WHICH IS WHICH. `balancing` collects
 * whatever exponent n ends up carrying and divides through by it; the two regimes are
 * that one line evaluated at two exponents. They come out as two RESULTS of this theorem
 * with the arrows between them, which is the honest presentation - a model needing a
 * different mechanism for the flat part would be two models.
 *
 * AND THE SPEED LAW IS DERIVED TOO, which is the part that took a second attempt. It was
 * assumed at first - written down as the transport law's premise and worked out from
 * there - and that was giving away the interesting half. "Because there is less of it to
 * hand the charge on to" is a MECHANISM, and this model states the mechanism in a rule: a
 * meeting is quantified over a facing PAIR and gated on both ends carrying something.
 * `handoff/what-passing-along-takes` reads that off the theory, so a hand-off needs a
 * partner, the partners available go as the occupancy, and v follows n WITHOUT anybody
 * having written a speed law down.
 *
 * SO WHAT IS LEFT TO CHOOSE IS ONLY WHICH BOUND BINDS. There are two, and both are
 * counted: the medium's, which is how often a partner is there, and the lattice's, which
 * is one cell a tick. A carrier moves at whichever is smaller - that is what the `min` in
 * `v = c·min(1, n/n_c)` says - and which one that is is a fact about how thick the medium
 * happens to be at a place, not an assumption about the form of a law. The two branches
 * come out as two RESULTS with the arrows between them.
 *
 * NOTHING ELSE IS ASSUMED. The flux being conserved is the same transport bijection
 * `medium/what-transport-does` counts in integers; the shell is the same Ehrhart count as
 * everywhere else. One line is still taken on trust - that a partner's presence is not
 * correlated with the carrier's - and it is stated in the step that uses it.
 */
import { base, expo } from "../Algebra.ts";
import { Theorem } from "../Theorem.ts";
import { lattice, RHO } from "../probes/lattice.ts";
import { medium } from "../probes/medium.ts";
import { CAP, CARRIER, HANDOFF, PARTNER, handoff } from "../probes/handoff.ts";
import { BALL, BETA, RBAR, ROOM, SHELL } from "../Rules.ts";

/** how much crosses a shell per tick - the conserved thing */
export const FLUX = "Phi";
/** how thick the medium is at a place */
export const DENSITY = "n";
/** how fast a carrier moves there */
export const SPEED = "v";

/**
 * WHICH BOUND ON THE SPEED IS THE BINDING ONE.
 *
 * Not two laws and not an assumption between them: two counted bounds, and a carrier
 * moves at whichever is smaller. Naming them this way is what turns the transport law's
 * `min` into a consequence.
 */
export type Regime = { name: string; binds: "medium" | "lattice"; says: string };

export const REGIMES: Regime[] = [
  {
    name: "dense",
    binds: "lattice",
    says: "there are partners everywhere, so the hand-off is never what a carrier waits " +
      "for and the lattice's one-cell-a-tick is the binding bound",
  },
  {
    name: "thin",
    binds: "medium",
    says: "partners are scarce, so a carrier waits for one and the hand-off rate is the " +
      "binding bound - which is what makes the speed follow the density",
  },
];

export const transport: Theorem = {
  id: "transport.thinning",
  asks: "a medium carries something outward from a source. How thick is it at " +
    "\\bar{r} steps, and does that change when the carriers slow down in thin medium?",
  about: DENSITY,
  probes: [lattice, medium, handoff],
  wants: [
    { kind: "dilate", of: BALL, by: RBAR },
    { kind: "conserved", of: FLUX },
    { kind: "product", of: HANDOFF, from: [CARRIER, PARTNER] },
  ],
  glossary: {
    [FLUX]: { symbol: "Φ", says: "how much crosses a shell per tick" },
    [DENSITY]: { symbol: "n", says: "how thick the medium is at that distance" },
    [SPEED]: { symbol: "v", says: "how fast a carrier moves there" },
    [HANDOFF]: { symbol: "handoff", says: "how often a carrier is passed along" },
    [PARTNER]: { symbol: "partner", says: "something facing the carrier, carrying something itself" },
    [CARRIER]: { symbol: "carrier", says: "the thing being passed" },
    [CAP]: { symbol: "c", says: "the lattice's own limit - one cell a tick" },
    [SHELL]: { symbol: "shell(r̄)", says: "how many sites lie at exactly r̄ steps" },
    [BALL]: { symbol: "ball(r̄)", says: "how many sites lie within r̄ steps" },
    [BETA]: { symbol: "β", says: "the step-polytope's volume - Ehrhart's leading coefficient" },
    [RHO]: { symbol: "ρ", says: "the lattice, and its one site per fundamental cell" },
    [ROOM]: { symbol: "room", says: "volume, in the space the lattice sits in" },
    [RBAR]: { symbol: "r̄", says: "the discrete radius - how many steps from the centre" },
    D: { symbol: "D", says: "the lattice's dimension" },
  },
};

/**
 * WHAT THIS THEOREM PUTS IN BY HAND - one definition, and which bound binds.
 *
 * The first says what the word flux means and has no content beyond that. The second is
 * not a law but a CHOICE OF BRANCH: both bounds on the speed were counted by
 * `handoff/what-passing-along-takes`, and this says which of them a carrier is actually
 * waiting on. Both branches are shown, so nothing is being preferred quietly.
 */
export const assumptions = (regime: Regime) => [
  {
    fact: { kind: "product" as const, of: FLUX, from: [SHELL, DENSITY, SPEED] },
    because: "what crosses a shell in a tick is the number of sites on it, times how " +
      "much medium is at each, times how fast that medium is moving through. That is " +
      "what a flux IS, and it mentions no distance",
    line: `${FLUX} = ${SHELL} · ${DENSITY} · ${SPEED}`,
  },
  {
    /* the speed is whichever bound binds - and BOTH were counted, so this is a branch
     * rather than a postulate */
    fact: {
      kind: "scales" as const, of: SPEED,
      by: base(regime.binds === "medium" ? HANDOFF : CAP),
    },
    because: `a carrier moves at whichever bound is smaller, and in the ${regime.name} ` +
      `regime that is the ${regime.binds}'s: ${regime.says}. Both bounds were counted ` +
      `off the theory rather than assumed - what is chosen here is only which of them a ` +
      `carrier is waiting on, which is a fact about how thick the medium is at a place`,
    line: `${SPEED} ∝ ${regime.binds === "medium" ? HANDOFF : CAP}`,
  },
];

/**
 * THE FLUX IS CONSERVED FOR THE REASON TRANSPORT IS - said once, here, rather than
 * probed twice.
 *
 * `medium/what-transport-does` establishes that the rules which carry a thing neither
 * make nor unmake any of it. That is a statement about everything transport carries, and
 * the flux is what crossing a shell means for it, so the two are the same fact under two
 * names. Renaming it is a definition; measuring it again would be measuring one integer
 * twice.
 */
export const fluxIsPositive = {
  fact: { kind: "positive" as const, of: FLUX },
  because: "the source is putting something out and transport is carrying it, so there " +
    "is something crossing the shell - a flux of nothing is not a flux this question is " +
    "about",
  line: `${FLUX} > 0`,
};

export const fluxIsWhatTransportConserves = (deficit: string) => ({
  fact: { kind: "conserved" as const, of: FLUX },
  because: `the flux is what transport carries, counted where it crosses a shell - so ` +
    `it is conserved for exactly the reason ${deficit} is, which the transport rules ` +
    `were counted doing in integers`,
  line: `${FLUX} is conserved in flight`,
});
