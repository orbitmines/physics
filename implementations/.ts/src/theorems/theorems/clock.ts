/**
 * MASS AS A PERIOD - and the ceiling that needs no argument beyond what a fraction is.
 *
 * MASS HERE IS WHAT FRACTION OF THE TICKS A THING SPENDS PULSING. Said that way the
 * ceiling is not a discovery, it is arithmetic: you cannot spend more than all of them. So
 * m runs from nothing up to one tick in one, which in the lattice's units is c̄ - and
 * there is no mechanism to look for behind that, no coupling that saturates, nothing to
 * measure. It is what a fraction is.
 *
 * TURNED ROUND IT IS A PERIOD. Something of mass m pulses once every 1/m ticks, so a
 * heavier thing has a shorter clock and the heaviest possible thing pulses every tick.
 * That is the only move made here, and it is a rewriting rather than a claim.
 *
 * AND ONE THING IN PHYSICS ALREADY HAS THAT SHAPE - a Compton wavelength, which also goes
 * as one over the mass. Two lengths that both go as 1/M are proportional, so the whole
 * question is what the constant is, and the way to find it is to ask at the ceiling where
 * both sides are easy. That step needs the Planck mass, which is a definition rather than
 * a coincidence, and is where this theorem stops: what is derived here is the shape.
 */
import { sym } from "../Expr.ts";
import { Theorem } from "../Theorem.ts";
import { counts, CBAR_Q } from "../probes/counts.ts";

/** what fraction of its ticks a thing spends pulsing - which is its mass */
export const MASS = "m";
/** how many ticks between one pulse and the next */
export const PERIOD = "period";

export const clock: Theorem = {
  id: "mass.period",
  asks: "mass is what fraction of its ticks a thing spends pulsing. How long between " +
    "pulses, and how heavy can anything be?",
  about: PERIOD,
  probes: [counts],
  wants: [{ kind: "bound", of: MASS, atMost: CBAR_Q }],
  glossary: {
    [PERIOD]: { symbol: "period", says: "ticks between one pulse and the next" },
    [MASS]: { symbol: "m", says: "what fraction of its ticks a thing spends pulsing" },
    [CBAR_Q]: { symbol: "\\bar{c}", says: "one tick in one - the whole of them" },
  },
};

export const definitions = [
  {
    fact: { kind: "bound" as const, of: MASS, atMost: CBAR_Q },
    because: "mass is a fraction of the ticks, and you cannot spend more of them than " +
      "there are. The ceiling needs no argument beyond that - there is no mechanism " +
      "behind it and nothing to measure",
    line: `${MASS} is at most \\bar{c}`,
  },
  {
    fact: { kind: "equals" as const, of: PERIOD, to: sym(MASS, -1) },
    because: "something that pulses on a fraction m of its ticks pulses once every 1/m " +
      "of them - the same statement turned round, which is the only move made here",
    line: `${PERIOD} = \\frac{1}{${MASS}}`,
  },
];
