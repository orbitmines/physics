/**
 * THE FALLOFF LAWS A SIGN GIVES YOU - Coulomb, Ampere and the charged plane, which are one
 * argument asked about three shapes of source.
 *
 * NOTHING NEW IS ASSUMED FOR ANY OF THEM. The dilution argument is the same one
 * `gravity.falloff` makes and the same one the article makes about everything: what is
 * conserved on its way out and goes every way alike is shared between exactly the sites
 * there are to share it between. All that changes between these three is HOW MUCH ROOM
 * there is at a distance, and that is a property of the source's shape rather than of the
 * physics.
 *
 * SO THE THREE ARE ONE THEOREM ASKED THREE TIMES, and they are stated separately here only
 * because a reader looking for Ampere's law should be able to find it under its own name.
 * On three dimensions they read:
 *
 *   a point   shell r^{D-1}   field r^{-2}   the inverse square
 *   a wire    shell r^{D-2}   field r^{-1}   Ampere
 *   a sheet   shell r^{D-3}   field r^{0}    a field that does not fall off at all
 *
 * WHAT MAKES THEM ELECTRIC RATHER THAN GRAVITATIONAL is the premise underneath, and it is
 * measured rather than declared: `carried/what-a-ray-keeps` establishes that this theory's
 * rays carry a SIGN, that transport keeps the multiset of signs exactly, and that a source
 * with no axis writes the same sign on every one of its exits - conserved, and isotropic,
 * which are the two things the dilution argument wants. A theory whose rays carry no sign
 * has no charge and none of these theorems concludes anything there, which is the correct
 * answer rather than a gap.
 */
import { Theorem } from "../Theorem.ts";
import { carried, carriedAs } from "../probes/carried.ts";
import { extent, shellAbout } from "../probes/extent.ts";
import { lattice, RHO } from "../probes/lattice.ts";
import { spread } from "../Rules.ts";

/** the signed thing a ray carries - a charge, if anything here is one */
const CHARGE = carriedAs("polarity");
/** how much of it is at one site at a distance - the field */
const FIELD = spread(CHARGE);

const glossary = {
  [CHARGE]: { symbol: "q", says: "the sign a ray carries, which transport keeps exactly and which a round source puts out a net of" },
  [FIELD]: { symbol: "n[q]", says: "how much of that sign one site holds at a distance - the field, read directly rather than differentiated out of a potential" },
  [RHO]: { symbol: "ρ", says: "the lattice's site density" },
  D: { symbol: "D", says: "the lattice's dimension" },
};

export const coulomb: Theorem = {
  id: "charge.falloff",
  asks: "the rays carry a sign, transport keeps it, and a round source puts out a net of " +
    "it. How much of it is at one site, a distance away?",
  about: FIELD,
  probes: [carried, lattice, extent],
  wants: [
    { kind: "conserved", of: CHARGE },
    { kind: "isotropic", of: CHARGE },
  ],
  glossary,
};

export const ampere: Theorem = {
  id: "charge.wire",
  asks: "the same sign, spreading from a source that is a LINE rather than a point. How " +
    "much of it is at one site?",
  about: `${FIELD} per ${shellAbout(1)}`,
  probes: [carried, lattice, extent],
  wants: [
    { kind: "conserved", of: CHARGE },
    { kind: "isotropic", of: CHARGE },
  ],
  glossary: {
    ...glossary,
    [`${FIELD} per ${shellAbout(1)}`]: { symbol: "n[q] about a wire",
      says: "the field of a line of charge - one power slower than a point's, because a line already spans the direction along it" },
    [shellAbout(1)]: { symbol: "shell about a wire",
      says: "the sites at a given distance from a line, which grow one power more slowly than around a point" },
  },
};

export const sheet: Theorem = {
  id: "charge.sheet",
  asks: "and spreading from a SHEET. How much of it is at one site then?",
  about: `${FIELD} per ${shellAbout(2)}`,
  probes: [carried, lattice, extent],
  wants: [
    { kind: "conserved", of: CHARGE },
    { kind: "isotropic", of: CHARGE },
  ],
  glossary: {
    ...glossary,
    [`${FIELD} per ${shellAbout(2)}`]: { symbol: "n[q] about a sheet",
      says: "the field of a charged plane - which on three dimensions does not fall off with distance at all" },
    [shellAbout(2)]: { symbol: "shell about a sheet",
      says: "the sites at a given distance from a plane, which on three dimensions do not grow with distance" },
  },
};
