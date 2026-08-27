/**
 * HOW FAR A CHARGE'S FIELD REACHES - and this theorem's job is to fail, loudly, in the one
 * place the article has been arguing about in prose.
 *
 * THE ARTICLE'S COMPLAINT, IN ITS OWN WORDS, is that "a Coulomb force with a range of two
 * Planck lengths is not a Coulomb force" - the vacuum's derived occupancy of a half puts
 * `force.range`'s mean free path at a few cells, and electrostatics is observed to have no
 * range at all. It calls this the sharpest quantitative statement its vacuum sections have
 * produced, and leaves it owed.
 *
 * THE COMPLAINT IS ABOUT THE WRONG THING, AND THE RIGHT THING IS WORSE.
 *
 * `force.range` derives how far ONE CARRIER gets before something destroys it. That is a
 * mean free path, and a medium in which every carrier is destroyed in three cells can still
 * carry a signal any distance - `medium/what-transport-does` measures exactly that, under
 * EVERY rule, and finds the disturbance integral flat to nought sigma. A carrier's lifetime
 * is not a field's range, and reading the first as the second is the error in the prose.
 *
 * BUT THE PREMISE UNDERNEATH THE INVERSE SQUARE IS THE ONE TO WORRY ABOUT. Every falloff in
 * this folder is the same argument: something conserved, going every way alike, shared
 * between the sites there are to share it between. For charge the conserved thing is the
 * NET SIGN, and `charge.falloff` gets that premise from `carried/what-a-ray-keeps` - which
 * establishes it with the theory STRIPPED TO TRANSPORT. Under `MOVEMENT` and `ARRIVAL`
 * alone the multiset of signs is kept exactly, and that is a true statement about carrying
 * a sign about. It is not a statement about a world that is also destroying things.
 *
 * SO THIS THEOREM ASKS FOR THE SAME PREMISE UNDER THE FULL RULES, and
 * `purity/what-becomes-of-a-net-sign` goes and looks: two worlds on one seed, one of them
 * with a monopole at the middle, averaged over seeds so that the vacuum's own draw averages
 * out. What comes back is that the net does not survive - a third of it gone in two ticks,
 * consistent with nothing by five.
 *
 * SO THERE IS NO LAW HERE AND THE PROVER SAYS WHICH PREMISE IS MISSING. That is the whole
 * point of writing it as a theorem rather than as a paragraph: `charge.falloff` concludes
 * an inverse square because it was handed conservation by a probe that had switched the
 * destroying rule off, and this one, handed the same question with the rule on, concludes
 * nothing and names the reason. The two pages sit beside each other and the difference
 * between them is exactly one probe.
 *
 * AND THE ASYMMETRY IS THE RESULT WORTH TAKING AWAY. The gross disturbance survives this
 * vacuum and the net sign does not. Gravity's carrier is a shortfall in the ray population
 * and the population is what settles; charge's carrier is a signed excess and the vacuum
 * eats the sign. Anybody who wants electrostatics at range in this model has to attack that
 * measurement, and it is now a measurement rather than an argument.
 */
import { Theorem } from "../Theorem.ts";
import { GROSS, NET, purity } from "../probes/purity.ts";
import { carried, carriedAs } from "../probes/carried.ts";
import { lattice, RHO } from "../probes/lattice.ts";
import { extent } from "../probes/extent.ts";
import { spread } from "../Rules.ts";

/** how much of the net sign is at one site a distance away - the field, if there is one */
export const FIELD = spread(NET);

export const charge_reach: Theorem = {
  id: "charge.reach",
  asks: "the inverse square is the dilution of something conserved. Ask for that " +
    "conservation with the destroying rule RUNNING rather than stripped out - is there " +
    "still a field at a distance?",
  about: FIELD,
  probes: [purity, carried, lattice, extent],
  uses: ["charge.falloff", "force.range", "lattice.shell-growth"],
  wants: [
    { kind: "conserved", of: NET },
    { kind: "isotropic", of: NET },
  ],
  glossary: {
    [FIELD]: { symbol: "n[q]", says: "how much of the net sign one site holds at a distance - the field, if the net survives to make one" },
    [NET]: { symbol: "q", says: "the net sign a disturbance carries, asked under EVERY rule rather than under transport alone" },
    [GROSS]: { symbol: "gross", says: "how many rays a disturbance differs by at all - the quantity medium/what-transport-does finds settles" },
    [carriedAs("polarity")]: { symbol: "q_{transport}", says: "the same net sign asked with the theory stripped to transport, which is where charge.falloff gets its premise" },
    [RHO]: { symbol: "\\rho", says: "the lattice's site density" },
    D: { symbol: "D", says: "the lattice's dimension" },
  },
};

/**
 * NOTHING IS PUT IN BY HAND HERE, AND THAT IS DELIBERATE.
 *
 * The temptation is to write the dilution line - `n[q] = q / shell` - so that the page has
 * something on it. But that line is what `spreading` produces FROM the two premises, and
 * writing it as a definition would mean this theorem concluded an inverse square whether or
 * not the conservation held. The whole value of asking the question this way is that the
 * answer is allowed to be nothing.
 */
export const definitions: { fact: any; because: string; line?: string }[] = [];
