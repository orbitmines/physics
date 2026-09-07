/**
 * TWO OF THE SAME THING, CLOSER THAN A WAVELENGTH - where the half stops applying.
 *
 * `share.coherence` gets one half because a body made of many things has no phase of its
 * own: its parts are spread evenly round the circle and what survives the averaging is
 * ⟨|ψ|/π⟩ = 1/2. That argument has a premise in it, and the premise is that the phases
 * are anybody's guess.
 *
 * TWO OF THE SAME THING BREAK IT. They do not have independent phases - they have the
 * SAME phase, because ω is not free any more: a thing's pulse rate IS its mass, so two
 * things of one mass pulse together. There is nothing left to average over, the phase
 * difference is zero rather than uniform, and `share` is not one half for them.
 *
 * WHICH IS A PREDICTION AND NOT A LOOPHOLE. It says gravity between two electrons closer
 * than a wavelength of each other differs from gravity between an electron and anything
 * else, by exactly the factor the averaging would have taken off. The article puts the
 * scale at 0.268λ - about 40 femtometres for two electrons - and the point of deriving
 * it here is that the factor is forced: it is 1 over 1/2, because the half came from an
 * average that no longer has anything to average.
 */
import { num, sym } from "../Expr.ts";
import { Theorem } from "../Theorem.ts";
import { counts } from "../probes/counts.ts";
import { SHARE } from "./share.ts";
import { MASS } from "./clock.ts";

/** a thing's pulse rate, which is not free */
export const OMEGA = "ω";
/** what share becomes when the two things are the same thing */
export const ALIKE = "share, for two of the same";

export const identical: Theorem = {
  id: "gravity.identical",
  asks: "two of the SAME thing, closer than a wavelength. Does the averaging that gave " +
    "one half still apply to them?",
  about: ALIKE,
  probes: [counts],
  uses: ["share.coherence", "mass.period"],
  wants: [{ kind: "equals", of: OMEGA, to: [] }],
  glossary: {
    [ALIKE]: { symbol: "share*", says: "how opposed two of the same thing are" },
    [SHARE]: { symbol: "share", says: "the averaged value, for things whose phases are anybody's guess" },
    [OMEGA]: { symbol: "ω", says: "a thing's pulse rate" },
    [MASS]: { symbol: "m", says: "its mass, which is that rate" },
  },
};

export const definitions = [
  {
    fact: { kind: "equals" as const, of: OMEGA, to: sym(MASS) },
    because: "a thing's pulse rate is not free - it IS its mass, which is what " +
      "mass.period says. So two things of one mass pulse at one rate, and that is the " +
      "whole of why the next line follows",
    line: `${OMEGA} = ${MASS}`,
  },
  {
    fact: { kind: "equals" as const, of: ALIKE, to: num(1) },
    because: "the half in share.coherence came from averaging |ψ|/π over a phase " +
      "difference that was anybody's guess. Two of the same thing pulse at the same " +
      "rate, so their phase difference is not anybody's guess - there is nothing left " +
      "to average, and what would have been averaged down is not",
    line: `${ALIKE} = 1`,
  },
];
