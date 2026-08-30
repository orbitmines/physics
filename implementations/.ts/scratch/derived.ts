/**
 * EVERY RATE READ OFF ITS OWN RULE - and the ones that cannot be are named as such.
 *
 * The continuum form has numbers in it that the lattice does not name, and until now most of
 * them were chosen by hand until a picture looked right. That is the failure this file exists
 * to end: each one below is derived from the rule it stands for, with the derivation written
 * out, and what is left over is stated as a choice rather than smuggled in as a constant.
 */
import { Geometry } from "../src/lib/Local.ts";

export type Rates = {
  nu: number; sigma: number; cap: number; tau: number;
  shine: number; fold: number; stir: number;
};

/**
 * THE VACUUM'S OWN OCCUPANCY, which everything else is quoted against.
 *
 * `vacuum.occupancy` derives it by enumerating what a meeting does: keep both and the box
 * fills, annihilate both and there is no vacuum, keep the alike half and there is a half. It
 * is measured on fcc-12 at 0.1945 of exits carrying once it settles, which is the number
 * these rates are checked against rather than the one they are given.
 */
export const OCCUPANCY = 0.1945;

/**
 * AND IT IS NOT THE SAME NUMBER ON EVERY LATTICE - which handing 0.1945 to all of them assumed.
 *
 * `sigma` is 1/occ, so the occupancy is not a label on the vacuum, it is the ABSORPTION. Give a
 * geometry the wrong one and the feedback inverts: too much absorption lowers rho, which raises
 * `room = (1-rho)^DEG`, which raises creation. Measured, icosahedral-12 run on fcc-12's 0.1945
 * settled at 2.53 - twelve times over and far past saturation - and the render was a picture of
 * a filled box rather than of the model. That mistake was mine and it briefly looked like a
 * falsification of the angular derivation.
 *
 * These are solved self-consistently in `scratch/occ.ts`: guess occ, derive sigma from it, run
 * the BARE vacuum wrapped, read where it settles, feed it back until it stops moving. Wrapped
 * because an open box grows a bright rim - a leaky edge lowers rho and so raises room.
 */
export const OCCUPANCY_OF: Record<string, number> = {
  "fcc-12": 0.1753,
  "icosahedral-12": 0.2943,
  "cubic-18": 0.1139,
  "cubic-26": 0.0876,
};
/*
 * AND IT DOES NOT FOLLOW DEG. fcc-12 and icosahedral-12 have the SAME twelve exits and differ by
 * sixty-eight per cent; cubic-18 has more exits than either and sits below both. What sets it is
 * how the exits lie relative to each other - the same thing that sets g_1 and so the angular
 * range - and not how many there are.
 */

/** the vacuum this lattice actually settles at, falling back to fcc-12's if unmeasured */
export const occupancyOf = (g: Geometry) =>
  OCCUPANCY_OF[(g as any).name ?? ""] ?? OCCUPANCY;

export const derive = (g: Geometry, occ = occupancyOf(g)): Rates => {
  const DEG = g.DEG;
  /* the density facing a ray on the opposite exit of the next cell, of one polarity */
  const facing = occ / 2;

  /*
   * SIGMA - ANNIHILATION destroys BOTH ends of every facing pair whose polarities differ, and
   * (G/2) puts a fresh half on every edge every tick, so a moving ray meets something
   * essentially always rather than with probability `occ`. Half of what it meets is opposite,
   * because the vacuum draws its signs unbiased - which is `G^CONSERVING`'s "keep the alike
   * half and there is a half". So a ray dies with chance one half per step, and sigma is
   * whatever makes the density form do that against the density that is actually facing it.
   */
  const sigma = 0.5 / facing;

  /*
   * TAU EQUALS SIGMA, and it is not a second knob. The same rule reads the two polarities and
   * only destroys where they DIFFER; where they agree it inserts a point and deflects. An
   * unbiased vacuum offers alike exactly as often as opposite, so turning is exactly as
   * common as killing. Anything else is a claim that the vacuum has a preferred sign.
   */
  const tau = sigma;

  /*
   * NU - (G/2) splits a neutral point into a plus and a minus ON EVERY AXIS, unconditionally.
   * So a point that splits does not add a little: it lights every exit it has. In a density
   * whose unit is "this exit is carrying", that is one.
   */
  const nu = 1;

  /*
   * CAP - and the gate is neutrality, not fullness. The rule is `if (l.source || busy(l))
   * return`: a point splits only when NOTHING is on it, and `busy` is any active ray at all.
   * The chance of that, for exits carrying independently at `occ`, is (1-occ)^DEG - which is
   * a far harder gate than the linear 1 - rho/cap this used to have. `cap` is carried as the
   * exponent's own scale so the room term can stay in the shape the solver wants.
   */
  const cap = DEG;

  /*
   * STIR - the vacuum's own field turns everything, every tick. `G^XOR+XOR` measures it at
   * |B| = 1.4 a tick with a direction autocorrelation of 0.02: a large field with no memory.
   * `steer` banks |B| and spends ONE RING STEP per whole unit, so at 1.4 every charge takes a
   * step every tick and the leftover carries. The fraction that turns is therefore min(1,|B|)
   * = 1 - not a fraction to be tuned - and the step is to a RING NEIGHBOUR, which is what
   * keeps this a scattering and not a randomisation.
   */
  const stir = 1;

  /*
   * SHINE IS ZERO UNDER THE REAL MODEL, and saying otherwise was borrowing another theory's
   * rule.
   *
   * RADIATING is `G^XOR^o`'s, and `G^XOR^o` is `G_XOR_XOR.copy()` with that rule ADDED -
   * so `G^XOR+XOR` does not have it. Nor does it have `TURNING`, which lives only in
   * `G^XOR^c`. Its rules are EMISSION, CREATION and MOVEMENT, and none of them shine at a
   * corner. Deriving `1 - occ` from RADIATING and handing it to a solver that is meant to be
   * `G^XOR+XOR` is a theory swap dressed as a constant.
   *
   * It was inert in any case - measured, the radiated total is exactly zero over four hundred
   * ticks, because the solver only radiated on the COHERENT turn and the vacuum's mean field
   * is nought. So the number changes nothing here; what changes is that the file no longer
   * claims a rule the model does not have. `shineOf` gives it back for a run that actually
   * means to be `G^XOR^o`, tagged as such.
   */
  const shine = 0;

  /*
   * FOLD - a meeting moves ONE POINT. ANNIHILATION does `here.fold(there)`, putting two into
   * one; (G+M/3) does `a.insert()`, putting one between them. Both are one point per meeting,
   * so in units of points per meeting the coefficient is one.
   */
  const fold = 1;

  return { nu, sigma, cap, tau, shine, fold, stir };
};

/** RADIATING's coefficient, for a run that means to be `G^XOR^o` and says so in its tag */
export const shineOf = (occ = OCCUPANCY) => 1 - occ;

/** and the winding, which is `axisAt` said as an angle: m ring steps a beat, CYCLE to a turn */
export const spinPerTick = (g: Geometry, m: number, period: number) =>
  g.CYCLE ? 2 * Math.PI * m / (g.CYCLE * Math.max(1, period)) : 0;
