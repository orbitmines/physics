/**
 * THE ATOM - and it is two theorems of this folder holding at once, with nothing added.
 *
 * WHAT IS BEING PUT TOGETHER. `charge.attraction` says what a biased pair pulls with:
 * whatever unbiased matter would feel, times (1 - P_a·P_b), which for one body biased each
 * way is TWO and for two biased alike is NOUGHT. `charge.falloff` says that pull thins as
 * the room there is at a distance, so what the far body sits in goes as 1/r.
 * `matter.debroglie` says what may stand in it: a moving thing's own two retarded branches
 * beat, their nodes are half a de Broglie wavelength apart, and a region holds a whole
 * number of them, so p·r = n·pi·hbar.
 *
 * NEITHER OF THOSE IS ABOUT ATOMS. One is about which pairs a rewrite rule destroys and
 * the other about a moving source's own phase reaching a place by two routes. Put together
 * they leave nothing to choose, and what comes out is the Bohr structure:
 *
 *     p ∝ n/r          the counting condition, with hbar and pi off to one side
 *     p^{2}r = g_q     the balance, because the coupling is a fact about the two bodies
 *     ⟹  r ∝ n^{2}    and  E ∝ 1/n^{2}
 *
 * THE PROVER DOES THAT LAST STEP AND NOBODY ELSE DOES. What the run establishes is the
 * middle line only - that the coupling comes out the same whichever shell is asked about,
 * which is what makes this one atom rather than a different force at every radius. The
 * exponents are what `balancing a conserved product` makes of it, and they are deliberately
 * NOT emitted by the probe even though it fitted them: a probe that handed over n^{-2}
 * would be handing over the answer.
 *
 * AND THE SIGN LAW HAS ITS TEETH IN THE CONTROL. At alike biases the coupling is nought,
 * there is no well, and the same integration finds nothing bound at all. An atom in this
 * model is not "two things that attract" - it is two things whose biases OPPOSE, and the
 * theorem that says so is the same one that says why a charged thing still falls like an
 * uncharged one.
 *
 * WHAT IS OWED, AND IT IS ONE FACTOR. `matter.debroglie` gets p·r = n·pi·hbar where the
 * variational reading of the Coulomb problem wants n·hbar - the familiar gap between a
 * hard-walled box mode and the estimate that happens to make this problem exact. That pi
 * is carried through rather than absorbed, and it moves the SIZE of the atom without
 * touching either exponent, which is why the shells below are ratios throughout.
 *
 * AND THERE IS A TENSION WITH `force.range`, WHICH IS THIS THEOREM'S SHARPEST PROBLEM.
 * A carrier is destroyed when it meets something, so a force has a mean free path -
 * `\lambda = -1/ln(1 - death per step)` - and at the vacuum's own derived occupancy of a
 * half that path is of order TWO CELLS. The article says so in as many words and calls it
 * the sharpest quantitative statement its vacuum sections have produced: a Coulomb force
 * with a range of two Planck lengths is not a Coulomb force. An atom needs the pull to
 * reach across itself, and the ground state here is put at twenty-four cells for the
 * picture's sake - but the ratio it is put at does not matter, because ANY bound state
 * needs a reach longer than its own radius and two cells does not give one.
 *
 * SO THE SHELLS BELOW ARE WHAT THE TWO LAWS COME TO, AND THE RANGE IS A SEPARATE DEBT.
 * The ladder is a statement about the SHAPE of the well and holds whatever sets its depth;
 * what the range question decides is whether a well of that shape can exist at the size an
 * atom is. Either the density that governs force propagation is not the one the vacuum
 * sections derive, or the observed range of electrostatics bounds it - and that was
 * already the outstanding debt before this theorem was written. It is not made worse here,
 * it is made specific: it now has an atom's radius in it rather than an argument.
 *
 * AND WHAT IS NOT CLAIMED. This is the atom as the two laws' consequence, solved on the
 * lattice's own shells - not as something that emerged from a run of `G^XOR^c` with a
 * proton and an electron in the box. That run is not available: `G^XOR^c` has no SPECIES,
 * nothing in it picks out a mass, and a body built by accretion carries a charge that grows
 * with what it swallowed - so there is no electron to put in yet. The probe's header says
 * this too, in the place a reader of the numbers will be standing.
 */
import { expo } from "../Algebra.ts";
import { Theorem } from "../Theorem.ts";
import {
  BINDING, COUPLING, NODES, ORBIT, SHELL, VIRIAL, atom,
} from "../probes/atom.ts";
import { HBAR, MOM } from "./debroglie.ts";
import { PI } from "../probes/standing.ts";

export const hydrogen: Theorem = {
  id: "atom.hydrogen",
  asks: "one body biased one way, one the other. The sign law says what they pull with " +
    "and the counting condition says what can stand in it - so how far out are the " +
    "shells, and what does it take to get off one?",
  about: BINDING,
  probes: [atom],
  uses: ["charge.attraction", "charge.falloff", "matter.debroglie"],
  wants: [
    { kind: "conserved", of: ORBIT },
    { kind: "conserved", of: VIRIAL },
    { kind: "positive", of: BINDING },
  ],
  glossary: {
    [BINDING]: { symbol: "E_{n}", says: "what it would take to get the thing off the n-th shell" },
    [SHELL]: { symbol: "r_{n}", says: "how far out that shell stands" },
    [NODES]: { symbol: "n", says: "how many nodes fit - counted off the solution, not imposed" },
    [MOM]: { symbol: "p", says: "the momentum of what is standing there" },
    [ORBIT]: { symbol: "p^{2}r", says: "what the balance holds fixed - the momentum against the pull, which comes to the coupling itself" },
    [VIRIAL]: { symbol: "E·r", says: "the same statement read as an energy rather than as a balance" },
    [COUPLING]: { symbol: "g_{q}", says: "how much of the unbiased pull this pair gets - charge.attraction's (1 - P_a·P_b), which is 2 for an atom and 0 for two alike" },
    [HBAR]: { symbol: "\\hbar", says: "the quantum of action" },
    [PI]: { symbol: "\\pi", says: "the boundary factor matter.debroglie carries and does not absorb" },
  },
};

/**
 * THE THREE LINES PUT IN BY HAND, and every one of them is a citation written out.
 *
 * THE FIRST IS `matter.debroglie` WITH ITS CONSTANTS SET ASIDE. p·r = n·pi·hbar, and
 * neither pi nor hbar depends on which shell is being asked about, so as a statement about
 * how things move when n changes it is p ∝ n/r. Dropping the constants is what a scaling
 * IS; they are not lost, they are in the cited line.
 *
 * THE OTHER TWO SAY WHAT THE TWO CONSERVED THINGS ARE MADE OF. p^{2}r is momentum twice
 * and radius once - that is the balance between what holds a thing in a curve and what
 * pulls it, with the inverse square already divided out. E·r is an energy and a radius.
 * Neither line says what either is EQUAL to, and neither needs to: what the run
 * established is that they do not move from shell to shell, and the rule that uses them
 * only wants to know which factors they are built out of.
 */
export const definitions = [
  {
    fact: {
      kind: "scales" as const, of: MOM,
      by: { [NODES]: expo(1), [SHELL]: expo(-1) },
    },
    because: "matter.debroglie established that a region holds a whole number of nodes " +
      "and that this comes to p·r = n·pi·hbar. Neither pi nor hbar has anything to do " +
      "with which shell is being asked about, so as a statement about how the momentum " +
      "moves when the shell does, it is p ∝ n/r. The constants are not lost - they are " +
      "in the line that is cited, and they set the SIZE of the atom rather than the shape " +
      "of the ladder",
    line: `${MOM} ∝ \\frac{${NODES}}{${SHELL}}`,
  },
  {
    fact: { kind: "product" as const, of: ORBIT, from: [MOM, MOM, SHELL] },
    because: "and what the balance holds fixed is momentum twice and radius once. What " +
      "keeps a thing on a curve goes as p^{2}/r and what pulls it goes as g_q/r^{2} - " +
      "charge.attraction's coupling over charge.falloff's room - so setting the two equal " +
      "leaves p^{2}r = g_q, with the inverse square already divided out. THE COUPLING IS " +
      "A PROPERTY OF THE TWO BODIES' BIASES, so it is the same on every shell, and the " +
      "run measured that rather than assuming it",
    line: `${ORBIT} = ${MOM} · ${MOM} · ${SHELL}`,
  },
  {
    fact: { kind: "product" as const, of: VIRIAL, from: [BINDING, SHELL] },
    because: "and the same coupling read as an energy: what is not kinetic is potential, " +
      "the potential is the coupling over r, so an energy times a radius is that coupling " +
      "again up to a factor which is also the same on every shell. This is not a second " +
      "premise - it is the first one written the other way, which is why the run reports " +
      "one measurement behind both",
    line: `${VIRIAL} = ${BINDING} · ${SHELL}`,
  },
];
