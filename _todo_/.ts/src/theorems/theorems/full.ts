/**
 * THE LAW IN FULL - every piece proved somewhere else, put together here, and what comes
 * out is a gravitational constant made of counts.
 *
 * NOTHING NEW IS PROVED IN THIS FILE and that is the point of it. Each factor was
 * established by a theorem of its own and is cited, the way a text cites what it settled
 * a page earlier:
 *
 *   what one meeting is worth to a path        c̄/DEG        lattice.lean
 *   how much of the time two phases oppose     1/2          share.coherence
 *   how many charges a pulse lets go           SHEET        counts, per pulse and squared
 *   the two densities summed along the line    2/(c̄R^{2})   met.integral
 *
 * AND THEN THE ARITHMETIC DOES SOMETHING WORTH WATCHING. The c̄ from the lean cancels
 * against the c̄ from the cores of met; the half from the phase average cancels against
 * the two from there being two cores. What is left is
 *
 *     force = SHEET^{2} · m · m' / (DEG · R^{2})
 *
 * an inverse square whose constant is SHEET^{2}/DEG - a ratio of two counts of the
 * tiling, with nothing fitted in it and nothing left over. That is the claim the article
 * makes about itself, and this is the line where it either survives the cancellations or
 * does not.
 *
 * AND THAT IS THE DENSE BRANCH ONLY, which is a correction rather than a caveat. met is
 * an integral of a product of two DENSITIES, and how fast a density thins is the
 * transport law's business - so this assembly inherits whichever branch is binding.
 * Written without a regime it silently took the dense one and produced Newton's law
 * however thin the medium was, which is precisely the case the transport law exists to
 * describe. Where carriers have to wait for somewhere to go, met carries R^{-1} instead
 * of R^{-2}, the c̄ no longer cancels, and the force falls off as 1/R - a flat rotation
 * curve, out of the same six factors.
 */
import { eneg, eshow, expo, rat } from "../Algebra.ts";
import { add, mul, num, sym } from "../Expr.ts";
import { Theorem } from "../Theorem.ts";
import { counts, CBAR_Q, DEG_Q, LEAN_Q, SHEET_C } from "../probes/counts.ts";
import { lattice } from "../probes/lattice.ts";
import { MET } from "./met.ts";
import { Regime } from "./transport.ts";
import { AREA, FACING } from "../probes/absorber.ts";
import { STRENGTH } from "../probes/medium.ts";
import { BETA, SHELL } from "../Rules.ts";
import { SHARE } from "./share.ts";
import { MASS_A, MASS_B } from "./meetings.ts";

/** the gravitational force between two bodies R apart, with every factor written in */
export const FORCE = "F_{g}";
/** what arrives through meetings - the two bodies' own charges coinciding */
export const BY_MEETING = "F_{meet}";
/** and what arrives because the vacuum's expansion was suppressed - the vacuum's own pull */
export const BY_VACUUM = "F_{vac}";

export const full: Theorem = {
  id: "gravity.full",
  asks: "put the pieces together. What is the gravitational force between two bodies R " +
    "apart, with every factor written in?",
  about: FORCE,
  probes: [counts, lattice],
  uses: ["lattice.lean", "share.coherence", "met.integral", "vacuum.suppression",
    "vacuum.expansion", "lattice.shell-growth"],
  wants: [
    { kind: "equals", of: MET, to: [] },
    { kind: "value", of: SHARE, equals: { n: 1, d: 2 } },
  ],
  glossary: {
    [FORCE]: { symbol: "F_{g}", says: "the gravitational force between two bodies R apart" },
    [BY_MEETING]: { symbol: "F_{meet}", says: "what arrives through meetings between the two bodies' own radiation" },
    [BY_VACUUM]: { symbol: "F_{vac}", says: "what arrives because the vacuum's expansion was suppressed" },
    [AREA]: { symbol: "A", says: "the whole of a body's boundary" },
    [FACING]: { symbol: "A_{\\perp}", says: "the part of the far body's boundary pointing along the line - what feels the imbalance" },
    [STRENGTH]: { symbol: "S", says: "the expansion the near body's boundary suppressed" },
    [BETA]: { symbol: "STEP", says: "how much room one step covers - the volume of the polytope the exits span, and so the shell's own coefficient" },
    [MET]: { symbol: "met(R)", says: "the two densities summed along the line between them" },
    [SHARE]: { symbol: "share", says: "how much of the time two phases are opposed" },
    [LEAN_Q]: { symbol: "lean", says: "what one meeting is worth to a path" },
    [SHEET_C]: { symbol: "SHEET", says: "how many charges one pulse lets go" },
    [DEG_Q]: { symbol: "DEG", says: "the ways out of a point" },
    [CBAR_Q]: { symbol: "\\bar{c}", says: "a step - one cell a tick" },
    [MASS_A]: { symbol: "m", says: "one body's mass, which is its pulse rate" },
    [MASS_B]: { symbol: "m'", says: "the other's" },
    R: { symbol: "R", says: "how far apart they are" },
  },
};

export const definitions = (regime: Regime) => [
  {
    fact: {
      kind: "equals" as const, of: BY_MEETING,
      to: mul(sym(LEAN_Q), sym(SHARE), sym(SHEET_C, 2), sym(MASS_A), sym(MASS_B), sym(MET)),
    },
    because: "what arrives through MEETINGS is what a meeting is worth to a path, times " +
      "how much of the time the two phases are opposed, times the charges each pulse " +
      "lets go on both sides, times the two masses, times the meetings summed along the " +
      "line between them. Every one of those was proved somewhere else and is cited; " +
      "this line only says how they multiply",
    line: `${BY_MEETING} = ${LEAN_Q} · ${SHARE} · ${SHEET_C}^{2} · ${MASS_A} · ${MASS_B} · ${MET}`,
  },
  {
    /*
     * THE VACUUM'S OWN PULL, AS ITS OWN TERM.
     *
     * The two channels are not the same thing counted twice and it is worth being exact
     * about why. The meeting term is what the two bodies' OWN radiation does when a
     * charge from each turns up in the same place - it needs both bodies to be emitting
     * and carries m·m'. The vacuum term needs neither of them to emit anything: a body's
     * cells are not neutral, so the split does not fire on them, and the expansion that
     * did not happen there spreads outward as a shortfall. An inert absorber that emits
     * nothing at all still has this one, which is exactly what `gravity.falloff` measures
     * and why that theorem's bodies are inert.
     *
     * NEITHER IS ASSUMED HERE. `gravity.falloff` derives how a disturbance of strength S
     * thins with distance and `vacuum.suppression` derives what S is - the expansion a
     * body's cells prevented. This line cites the composition of the two.
     */
    /*
     * BUILT FROM THE SAME TWO LINES `gravity.falloff` IS, rather than cited as its result.
     *
     * The falloff's conclusion is a PROPORTIONALITY - it fixes the shape and drops the
     * coefficient - and an equality cannot be recovered from one without inventing the
     * constant back. So this term is assembled from the pieces instead, all of which are
     * equalities: how much of the medium the far body is open to, what the near body's
     * suppressed expansion comes to, and how much room there is at that distance. Which is
     * the same composition the falloff makes, done where the coefficients are still there.
     *
     * IT SCALES WITH BOTH AREAS, and that falls out rather than being put in: A is the far
     * body's ways in, and S is the near body's suppressed expansion, which
     * `vacuum.suppression` derives as its own boundary count times the expansion rate.
     */
    fact: {
      kind: "equals" as const, of: BY_VACUUM,
      /* the shell AT THE SEPARATION - the same law, read at the distance this force is
       * about, so both channels are written in the one distance R rather than two names
       * for it */
      /*
       * THINNED BY THE REGIME, like everything else the medium carries.
       *
       * This was written with the shell's own exponent hard-coded, which quietly assumed
       * the dense limit for the vacuum channel while the meeting channel was correctly
       * following the transport law. But the deficit IS a shortfall in the ray
       * population, carried outward by the same carriers under the same rule - so
       * whatever thinning applies to them applies to it. Left as it was, the two channels
       * of one force disagreed with each other about how the medium works.
       */
      to: mul(sym(FACING), sym(STRENGTH), sym(BETA, -1),
        sym("R", eneg(regime.thins))),
    },
    because: "and what arrives because the vacuum's expansion was SUPPRESSED is the " +
      "other channel. A body's cells are not neutral, so the split does not fire on " +
      "them; the expansion that did not happen there spreads outward and a second body " +
      "is pushed into the shortfall. This needs neither body to emit anything - an inert " +
      "absorber has it - which is what makes it a separate arrival rather than the " +
      `meeting term counted again. It thins as the ${regime.name} regime says, because ` +
      `the deficit is carried by the same rays as everything else. Note the two areas ` +
      `are not the same kind of area: ` +
      "what the near body SENDS leaves through the whole of its boundary and spreads " +
      "isotropically, so its full A' counts; what the far body FEELS is an imbalance " +
      "along the line between them, so only its facing cross-section takes part",
    line: `${BY_VACUUM} = \\frac{${FACING} · ${STRENGTH}}{STEP}·R^{${eshow(eneg(regime.thins))}}`,
  },
  {
    fact: {
      kind: "equals" as const, of: FORCE,
      to: add(sym(BY_MEETING), sym(BY_VACUUM)),
    },
    because: "what a body feels is everything that arrives at it, and things that arrive " +
      "add. So the gravitational force is the two channels together: the meetings " +
      "between the bodies' own radiation, and the expansion the vacuum did not manage " +
      "around them",
    line: `${FORCE} = ${BY_MEETING} + ${BY_VACUUM}`,
  },
];
