/**
 * PHYSICS AS IT IS ALREADY WRITTEN DOWN - the corpus a candidate is scored against.
 *
 * NOT AXIOMS, AND NOTHING HERE IS EVER FED TO THE PROVER. A target is a claim somebody
 * else established, kept on the other side of a wall from the derivation so that it can
 * be used as a verdict and never as a premise. Import one into `Harvest` and the whole
 * folder becomes circular in the exact way `Kernel.ts` was written to prevent - the
 * prover would be proving what it was told. So this file is read only by `Rank.ts`, after
 * saturation has finished and can no longer be influenced.
 *
 * THREE VERDICTS COME OUT OF IT, and the middle one is the one worth building for.
 * A candidate that MATCHES a target is known physics recovered - and the interesting part
 * is not the match but the leaves behind it, which say what the law actually needed. A
 * candidate that CONTRADICTS a target inside that target's own stated limit is either a
 * falsification or a bug, and either way it is the most urgent thing on the page. A
 * candidate that matches nothing is a candidate for being new, which is worth exactly as
 * much as the corpus is wide - which is why this is eighty laws and not eight.
 *
 * WRITTEN AS SCALINGS, BECAUSE THAT IS WHAT THIS VOCABULARY CAN SAY. `Fact.ts` is a
 * counting argument's vocabulary: how a quantity scales, what it is conserved against,
 * what it equals. That covers the falloff skeleton of physics and it does not cover
 * tensors, gauge freedom, variational principles or operator ordering - see
 * `INEXPRESSIBLE`, which names the gap rather than leaving a reader to discover it by
 * noticing that Maxwell's equations are missing. What IS here of Maxwell is the r^-2 of a
 * point charge, the r^-3 of a dipole and the r^-1 of the radiation zone, which is the
 * part a lattice counting argument could ever have reproduced.
 *
 * THE LIMIT IS PART OF THE CLAIM. `F ∝ m·m'/r^2` is not true of a binary pulsar and
 * saying so unqualified would make every relativistic correction read as a contradiction
 * of Newton. So every target carries where it holds, and `Rank.ts` only raises a
 * contradiction where the limits overlap.
 */
import { Fact } from "../Fact.ts";
import { Expo, Rat, expo, rat, scaling } from "../Algebra.ts";
import { mono } from "../Expr.ts";

export type Domain =
  | "gravitation" | "electromagnetism" | "mechanics" | "relativity"
  | "quantum" | "thermal" | "waves" | "cosmology" | "geometry" | "dimensionless";

export type Target = {
  id: string;
  domain: Domain;
  /** what it is called, as a physicist would name it */
  law: string;
  fact: Fact;
  /** where the claim is made - a contradiction outside this is not a contradiction */
  limit: string;
  says: string;
};

/**
 * THE SAME QUANTITY UNDER TWO NAMES - this model's and the textbook's.
 *
 * `gravity.full` concludes about `F_{g}` in terms of `m_{a}` and `m_{b}` at separation
 * `R`; Newton wrote `F`, `m`, `m'` and `r`. Those are the same law and a comparison that
 * did not know it would report a novel result every time it recovered one - which is the
 * failure mode that would make this whole ranking worthless, since the corpus exists to
 * SINK the things already known.
 *
 * A RENAMING IS NOT A CONVERSION. Nothing here changes an exponent or drops a factor; it
 * says which symbol is which, and it is deliberately short and deliberately explicit, so
 * that a reader can check every line of it. Anything not listed keeps its own name and
 * simply fails to match, which is the safe direction to fail in.
 */
export const ALIASES: Record<string, string> = {
  "m_{a}": "m", "m_{b}": "m'", "m_{1}": "m", "m_{2}": "m'",
  "R": "r", "\\bar{r}": "r", "s": "r", "d": "r",
  "\\bar{c}": "c", "\u03b2": "b", "\u03b2_{v}": "b", "\u03b3": "gamma",
  "\u03c1_{m}": "rho", "\u03c1": "rho",
  /*
   * AND THE ATOM'S THREE, WHICH ARE RENAMINGS AND NOT READINGS. `r_{n}` is a radius and
   * `E_{n}` an energy, spelled with the shell they belong to; `nodes` is how many nodes
   * fit, which is what the corpus writes as `n` in the Bohr radii and the hydrogen levels.
   * Nothing is claimed by any of the three beyond which symbol is which.
   *
   * IT IS SPELLED `nodes` IN THE FIRST PLACE PRECISELY SO THAT IT NEEDS THIS LINE. `n` is
   * already the vacuum's density in `transport` and the count of annihilations in
   * `gravity.law`, and this sweep puts every probe into ONE store - so a node count called
   * `n` would silently BE those, and the `constant` it carries would freeze them. Kept
   * apart in the store and rejoined here, where a rename can be read and argued with.
   */
  "r_{n}": "r", "E_{n}": "E", "nodes": "n",
};

/**
 * A READING, NOT A RENAMING - and the two are kept apart because only one of them is free.
 *
 * `m_{a}` and `m` are the same symbol under two spellings and nothing is claimed by
 * saying so. `A_{\\perp}` and `m'` are not: the first is how much of the far body's
 * boundary points along the line, the second is its mass, and the statement that those are
 * the same thing IS this model's central physical claim rather than a fact about notation.
 * Fold it into the rename table and the page would report that it had recovered Newton's
 * law when what it had really done was assume him.
 *
 * SO A MATCH THAT NEEDED ONE OF THESE SAYS SO. The candidate still matches - it should,
 * that is the interesting case - but the page prints "reading A_{\\perp} as the far
 * body's mass" beside it, and a reader who does not accept the reading can see exactly
 * which line to argue with.
 */
export type Read = {
  as: string;
  says: string;
  /**
   * WHETHER A RUN HAS BEEN ASKED ABOUT IT YET, AND WHAT THE RUN SAID.
   *
   *   measured  a probe established it. The reading is no longer a reading; it is a
   *             premise, and a match that uses it is a recovery.
   *   untested  nobody has asked. The reading is a conjecture and blocks any claim.
   *   refuted   a probe asked and the answer was no. The reading is WRONG, and every
   *             match that was resting on it was an artifact of this table.
   *
   * THE THIRD CASE IS WHY THIS IS AN ENUM AND NOT A DELETION. `A_{\\perp} = m'` looked
   * entirely reasonable and it produced the most satisfying line the sweep had - the
   * assembled vacuum force matching Newton's law exactly. `coupling` then built the same
   * body at four duty cycles and counted the ways across its boundary: sixty, sixty,
   * sixty, sixty. A body's boundary is a property of its RADIUS and has nothing to do
   * with how often it pulses, so `A` is not a mass in disguise and that match was this
   * table talking to itself. Deleting the row would hide that; keeping it, marked, is the
   * finding.
   */
  status: "measured" | "untested" | "refuted";
  /** what was run, and what it found */
  evidence?: string;
};

export const READS: Record<string, Read> = {
  "S": { as: "m", status: "untested",
    says: "the expansion the near body's boundary SUPPRESSED - an amount of space per " +
      "tick that did not get made, which is what the glossary says it is and which is a " +
      "quantity about space rather than about matter. Reading it as mass is not a " +
      "category error, it is this model's central identification: the extra gravity IS " +
      "the expansion being blocked, so how much a body blocks is what its mass amounts " +
      "to. But it is an identification, so it has to be measured",
    evidence: "MARKED REFUTED HERE ON EVIDENCE THAT WAS NOT ABOUT IT. The run attached " +
      "to this row measured the body's caught-count - rays it absorbed - across four " +
      "duty cycles, which is not the suppressed expansion and never was. S is what did " +
      "NOT get made near the body, so what would settle it is counting the splits that " +
      "failed to happen against an identical world with no body in it. Until that is " +
      "run this row says nothing either way" },
  "A'": { as: "m", status: "refuted",
    says: "the ways across a body's boundary, read as its mass",
    evidence: "the same runs counted the exits leading out of the body's own cells: 60 " +
      "at every duty cycle. A boundary is fixed by the body's radius" },
  "A_{\\perp}": { as: "m'", status: "refuted",
    says: "the part of the far body's boundary that faces the line, read as the far " +
      "body's mass",
    evidence: "a facing cross-section is a fixed fraction of the boundary, and the " +
      "boundary does not move with the duty cycle - 60 ways at all four" },
  "A": { as: "m'", status: "refuted",
    says: "the whole of a body's boundary, read as its mass",
    evidence: "60 ways across it at every duty cycle" },
  "n[what a ray carries as polarity]": { as: "E", status: "untested",
    says: "the density of net polarity the medium is left holding, read as the electric " +
      "field itself. The article states this outright - the net polarity a charge leaves " +
      "in the vacuum IS the field, read directly rather than differentiated out of a " +
      "potential - which makes it exactly the kind of claim that has to be measured " +
      "rather than adopted. Nothing has yet asked a run whether a test charge placed in " +
      "that density feels what the field says it should" },
  "what a ray carries as polarity": { as: "q", status: "untested",
    says: "the signed thing a ray carries, read as electric charge. Transport conserves " +
      "it exactly and a round source puts out a net of it while an axial source puts out " +
      "none - which is everything a charge is asked to do, and still not a measurement " +
      "that it IS one" },
  "\u03b4": { as: "potential", status: "untested",
    says: "the disturbance left in the medium, read as a potential" },
  "deficit": { as: "potential", status: "untested",
    says: "the shortfall a body leaves, read as a potential" },
};


/** the same, for the thing a law is ABOUT rather than for what it is made of */
export const SUBJECTS: Record<string, string> = {
  "F_{g}": "F", "F_{meet}": "F", "F_{vac}": "F", "force": "F",
  "Φ": "potential", "γ": "gamma", "clock": "clock",
  "shell": "shell", "ball": "ball",
};

/**
 * THIS MODEL'S OWN COUNTS, WHICH A TEXTBOOK LAW HAS NO PLACE FOR - divided out before a
 * comparison, and NOT before anything else.
 *
 * A derived force comes out as `SHEET^2·m·m'/(DEG·R^2)`. Newton's has no SHEET in it and
 * no DEG, because those are properties of the tiling and Newton was not writing about a
 * tiling - what he wrote as one measured constant G is, if this model is right, exactly
 * this pile of counts. So the comparison is made on the law with the counts taken out,
 * and the counts themselves are reported ALONGSIDE the match as what G would have to be.
 *
 * DANGEROUS IF IT WERE WIDER THAN THIS, so it is a list and not a rule. Divide out
 * anything constant and `F ∝ m·m'/r^2` matches `F ∝ m·m'/r^3` as soon as somebody marks r
 * constant by accident. Only the tiling's own counts are here, each one a pure number
 * fixed by the lattice with no length and no mass in it.
 */
export const TILING = new Set(["STEP", "DEG", "SHEET", "CYCLE", "slice", "ρ", "rho",
  "cases", "surviving", "lean", "share", "D"]);

const s = (of: string, by: Record<string, number | Rat | Expo>): Fact =>
  ({ kind: "scales", of, by: scaling(by) });

export const TARGETS: Target[] = [
  /* ---- gravitation ------------------------------------------------------------ */
  { id: "newton.gravitation", domain: "gravitation", law: "Newton's law of gravitation",
    fact: s("F", { m: 1, "m'": 1, r: -2 }), limit: "weak field, v much less than c",
    says: "two masses pull on one another as the inverse square of their separation" },
  { id: "newton.potential", domain: "gravitation", law: "Newtonian potential",
    fact: s("potential", { m: 1, r: -1 }), limit: "weak field",
    says: "the potential of a point mass falls as one over distance" },
  { id: "newton.field", domain: "gravitation", law: "gravitational field of a point mass",
    fact: s("g", { m: 1, r: -2 }), limit: "weak field",
    says: "the acceleration a mass imposes falls as the inverse square" },
  { id: "kepler.third", domain: "gravitation", law: "Kepler's third law",
    fact: s("period", { a: rat(3, 2), m: rat(-1, 2) }),
    limit: "two bodies, one much heavier",
    says: "the period of an orbit goes as the three-halves power of its size" },
  { id: "orbital.speed", domain: "gravitation", law: "circular orbital speed",
    fact: s("v", { m: rat(1, 2), r: rat(-1, 2) }),
    limit: "circular orbit, weak field",
    says: "orbital speed falls as one over the square root of the radius" },
  { id: "escape.speed", domain: "gravitation", law: "escape velocity",
    fact: s("v", { m: rat(1, 2), r: rat(-1, 2) }),
    limit: "weak field", says: "escape speed goes as the square root of mass over radius" },
  { id: "tidal", domain: "gravitation", law: "tidal force",
    fact: s("F", { m: 1, r: -3 }), limit: "extended body, weak field",
    says: "the difference in pull across a body falls as the inverse cube" },
  { id: "schwarzschild", domain: "gravitation", law: "Schwarzschild radius",
    fact: s("r", { m: 1 }), limit: "spherical, non-rotating",
    says: "the horizon of a mass is proportional to the mass" },
  { id: "binding.energy", domain: "gravitation", law: "gravitational binding energy",
    fact: s("E", { m: 2, r: -1 }), limit: "uniform sphere",
    says: "binding energy goes as mass squared over radius" },
  { id: "light.deflection", domain: "gravitation", law: "deflection of light by a mass",
    fact: s("theta", { m: 1, b: -1 }), limit: "weak field, grazing",
    says: "a ray bends by an angle going as mass over impact parameter" },
  { id: "gravitational.redshift", domain: "gravitation", law: "gravitational redshift",
    fact: s("z", { m: 1, r: -1 }), limit: "weak field",
    says: "a clock deep in a well runs slow by an amount going as mass over radius" },
  { id: "perihelion.advance", domain: "gravitation", law: "perihelion advance",
    fact: s("advance", { m: 1, a: -1 }), limit: "weak field, small eccentricity",
    says: "an orbit's perihelion creeps by an amount going as mass over semi-major axis" },
  { id: "freefall.time", domain: "gravitation", law: "free-fall time",
    fact: s("t", { r: rat(3, 2), m: rat(-1, 2) }),
    limit: "radial fall from rest", says: "the time to fall goes as the three-halves power of the drop" },

  /* ---- electromagnetism ------------------------------------------------------- */
  { id: "coulomb", domain: "electromagnetism", law: "Coulomb's law",
    fact: s("F", { q: 1, "q'": 1, r: -2 }), limit: "static charges in vacuum",
    says: "two charges push as the inverse square of their separation" },
  { id: "coulomb.potential", domain: "electromagnetism", law: "Coulomb potential",
    fact: s("potential", { q: 1, r: -1 }), limit: "static",
    says: "the potential of a point charge falls as one over distance" },
  { id: "point.field", domain: "electromagnetism", law: "field of a point charge",
    fact: s("E", { q: 1, r: -2 }), limit: "static",
    says: "the field of a point charge falls as the inverse square" },
  { id: "line.field", domain: "electromagnetism", law: "field of a line charge",
    fact: s("E", { lambda: 1, r: -1 }), limit: "infinite straight line, static",
    says: "the field of a line falls as one over distance, not as the square" },
  { id: "sheet.field", domain: "electromagnetism", law: "field of a charged sheet",
    fact: s("E", { sigma: 1 }), limit: "infinite plane, static",
    says: "the field of a plane does not fall off with distance at all" },
  { id: "dipole.field", domain: "electromagnetism", law: "field of a dipole",
    fact: s("E", { p: 1, r: -3 }), limit: "far from the dipole, static",
    says: "a dipole's field falls as the inverse cube" },
  { id: "quadrupole.field", domain: "electromagnetism", law: "field of a quadrupole",
    fact: s("E", { Q: 1, r: -4 }), limit: "far field, static",
    says: "a quadrupole's field falls as the inverse fourth power" },
  { id: "wire.magnetic", domain: "electromagnetism", law: "field of a straight wire",
    fact: s("B", { I: 1, r: -1 }), limit: "infinite straight wire, steady current",
    says: "the magnetic field of a wire falls as one over distance" },
  { id: "magnetic.dipole", domain: "electromagnetism", law: "field of a magnetic dipole",
    fact: s("B", { mu: 1, r: -3 }), limit: "far field, steady",
    says: "a magnetic dipole's field falls as the inverse cube" },
  { id: "radiation.zone", domain: "electromagnetism", law: "radiation field",
    fact: s("E", { q: 1, acceleration: 1, r: -1 }), limit: "far field, accelerating charge",
    says: "the radiated field falls only as one over distance, which is why radiation carries away energy" },
  { id: "larmor", domain: "electromagnetism", law: "Larmor radiated power",
    fact: s("P", { q: 2, acceleration: 2 }), limit: "non-relativistic acceleration",
    says: "radiated power goes as charge squared times acceleration squared" },
  { id: "intensity.falloff", domain: "electromagnetism", law: "inverse-square intensity",
    fact: s("I", { P: 1, r: -2 }), limit: "isotropic source, no absorption",
    says: "the intensity of anything radiated isotropically falls as the inverse square" },
  { id: "lorentz.force", domain: "electromagnetism", law: "Lorentz force",
    fact: s("F", { q: 1, v: 1, B: 1 }), limit: "point charge in a field",
    says: "the magnetic force goes as charge times speed times field" },
  { id: "sphere.capacitance", domain: "electromagnetism", law: "capacitance of a sphere",
    fact: s("C", { r: 1 }), limit: "isolated conductor",
    says: "capacitance is proportional to size" },
  { id: "rayleigh", domain: "electromagnetism", law: "Rayleigh scattering",
    fact: s("sigma", { lambda: -4 }), limit: "scatterer much smaller than the wavelength",
    says: "scattering goes as the inverse fourth power of wavelength, which is why the sky is blue" },

  /* ---- mechanics -------------------------------------------------------------- */
  { id: "newton.second", domain: "mechanics", law: "Newton's second law",
    fact: s("F", { m: 1, acceleration: 1 }), limit: "v much less than c",
    says: "force is mass times acceleration" },
  { id: "momentum", domain: "mechanics", law: "momentum",
    fact: s("p", { m: 1, v: 1 }), limit: "v much less than c",
    says: "momentum is mass times velocity" },
  { id: "kinetic.energy", domain: "mechanics", law: "kinetic energy",
    fact: s("E", { m: 1, v: 2 }), limit: "v much less than c",
    says: "kinetic energy goes as mass times speed squared" },
  { id: "hooke", domain: "mechanics", law: "Hooke's law",
    fact: s("F", { k: 1, x: 1 }), limit: "small displacement",
    says: "a spring pulls back in proportion to how far it is stretched" },
  { id: "pendulum", domain: "mechanics", law: "pendulum period",
    fact: s("period", { L: rat(1, 2), g: rat(-1, 2) }),
    limit: "small amplitude", says: "a pendulum's period goes as the square root of its length" },
  { id: "oscillator.period", domain: "mechanics", law: "harmonic oscillator period",
    fact: s("period", { m: rat(1, 2), k: rat(-1, 2) }),
    limit: "linear restoring force", says: "the period goes as the square root of mass over stiffness" },
  { id: "centripetal", domain: "mechanics", law: "centripetal acceleration",
    fact: s("acceleration", { v: 2, r: -1 }), limit: "circular motion",
    says: "the acceleration needed to turn goes as speed squared over radius" },
  { id: "angular.momentum", domain: "mechanics", law: "angular momentum",
    fact: s("L", { m: 1, v: 1, r: 1 }), limit: "point mass",
    says: "angular momentum is mass times speed times lever arm" },
  { id: "moment.inertia", domain: "mechanics", law: "moment of inertia",
    fact: s("I", { m: 1, r: 2 }), limit: "rigid body",
    says: "the resistance to being spun goes as mass times size squared" },
  { id: "drag.quadratic", domain: "mechanics", law: "quadratic drag",
    fact: s("F", { rho: 1, v: 2, A: 1 }), limit: "high Reynolds number",
    says: "drag through a fluid goes as speed squared" },
  { id: "stokes.drag", domain: "mechanics", law: "Stokes drag",
    fact: s("F", { eta: 1, r: 1, v: 1 }), limit: "low Reynolds number",
    says: "drag on a small slow sphere goes as speed, not as its square" },
  { id: "pressure", domain: "mechanics", law: "pressure",
    fact: s("P", { F: 1, A: -1 }), limit: "static",
    says: "pressure is force over area" },

  /* ---- relativity ------------------------------------------------------------- */
  { id: "lorentz.factor", domain: "relativity", law: "Lorentz factor",
    fact: { kind: "raised", of: "gamma", base: "(1-b^{2})", to: rat(-1, 2) },
    limit: "exact, all speeds below c",
    says: "the factor by which moving clocks and lengths are changed" },
  { id: "mass.energy", domain: "relativity", law: "mass-energy equivalence",
    fact: s("E", { m: 1, c: 2 }), limit: "exact, rest frame",
    says: "the energy in a mass at rest is that mass times c squared" },
  { id: "time.dilation", domain: "relativity", law: "time dilation",
    fact: s("t", { gamma: 1 }), limit: "inertial frames",
    says: "a moving clock is slow by the Lorentz factor" },
  { id: "length.contraction", domain: "relativity", law: "length contraction",
    fact: s("length", { gamma: -1 }), limit: "inertial frames",
    says: "a moving rod is short by the Lorentz factor" },
  { id: "relativistic.momentum", domain: "relativity", law: "relativistic momentum",
    fact: s("p", { gamma: 1, m: 1, v: 1 }), limit: "exact",
    says: "momentum is the Newtonian one times the Lorentz factor" },
  { id: "photon.momentum", domain: "relativity", law: "photon energy and momentum",
    fact: s("E", { p: 1, c: 1 }), limit: "massless",
    says: "for something with no mass, energy is momentum times c" },
  { id: "clock.rate", domain: "relativity", law: "proper time rate",
    fact: { kind: "raised", of: "clock", base: "(1-b^{2})", to: rat(1, 2) },
    limit: "inertial frames",
    says: "proper time advances as the square root of one minus beta squared" },

  /* ---- quantum ---------------------------------------------------------------- */
  { id: "de.broglie", domain: "quantum", law: "de Broglie wavelength",
    fact: s("lambda", { p: -1 }), limit: "free particle",
    says: "wavelength is inversely proportional to momentum" },
  { id: "planck.einstein", domain: "quantum", law: "Planck-Einstein relation",
    fact: s("E", { nu: 1 }), limit: "single quantum",
    says: "the energy of a quantum is proportional to its frequency" },
  { id: "uncertainty", domain: "quantum", law: "Heisenberg uncertainty",
    fact: s("dp", { dx: -1 }), limit: "conjugate pair",
    says: "the spread in momentum is at least inversely proportional to the spread in position" },
  { id: "bohr.radius", domain: "quantum", law: "Bohr radii",
    fact: s("r", { n: 2 }), limit: "hydrogen-like, non-relativistic",
    says: "the size of the n-th orbit goes as n squared" },
  { id: "hydrogen.energy", domain: "quantum", law: "hydrogen energy levels",
    fact: s("E", { n: -2 }), limit: "hydrogen-like, non-relativistic",
    says: "the binding energy of the n-th level goes as one over n squared" },
  { id: "oscillator.levels", domain: "quantum", law: "harmonic oscillator levels",
    fact: s("E", { n: 1 }), limit: "quantum harmonic oscillator",
    says: "the levels of an oscillator are evenly spaced" },
  { id: "compton", domain: "quantum", law: "Compton shift",
    fact: s("dlambda", { m: -1 }), limit: "photon off a free charge",
    says: "the wavelength shift goes as one over the scatterer's mass" },

  /* ---- waves ------------------------------------------------------------------ */
  { id: "string.speed", domain: "waves", law: "wave speed on a string",
    fact: s("v", { tension: rat(1, 2), mu: rat(-1, 2) }),
    limit: "small amplitude", says: "wave speed goes as the square root of tension over line density" },
  { id: "spherical.wave", domain: "waves", law: "spherical wave amplitude",
    fact: s("amplitude", { r: -1 }), limit: "no absorption, three dimensions",
    says: "amplitude falls as one over distance, so intensity falls as the square" },
  { id: "diffraction", domain: "waves", law: "diffraction angle",
    fact: s("theta", { lambda: 1, aperture: -1 }), limit: "small angle",
    says: "the spreading of a beam goes as wavelength over aperture" },
  { id: "doppler.acoustic", domain: "waves", law: "acoustic Doppler shift",
    fact: { kind: "equals", of: "nu", to: mono(scaling({ nu_0: 1 }), 1) },
    limit: "source slow against the medium",
    says: "the observed frequency is shifted in proportion to the closing speed" },
  { id: "sound.speed", domain: "waves", law: "speed of sound",
    fact: s("v", { P: rat(1, 2), rho: rat(-1, 2) }),
    limit: "ideal gas", says: "sound goes as the square root of pressure over density" },

  /* ---- thermal ---------------------------------------------------------------- */
  { id: "ideal.gas", domain: "thermal", law: "ideal gas law",
    fact: s("P", { N: 1, temp: 1, V: -1 }), limit: "dilute, non-interacting",
    says: "pressure goes as number times temperature over volume" },
  { id: "equipartition", domain: "thermal", law: "equipartition",
    fact: s("E", { temp: 1 }), limit: "classical, in equilibrium",
    says: "each degree of freedom carries energy proportional to temperature" },
  { id: "stefan.boltzmann", domain: "thermal", law: "Stefan-Boltzmann law",
    fact: s("P", { temp: 4, A: 1 }), limit: "black body in equilibrium",
    says: "radiated power goes as the fourth power of temperature" },
  { id: "wien", domain: "thermal", law: "Wien displacement law",
    fact: s("lambda", { temp: -1 }), limit: "black body",
    says: "the peak wavelength goes as one over temperature" },
  { id: "rms.speed", domain: "thermal", law: "root-mean-square molecular speed",
    fact: s("v", { temp: rat(1, 2), m: rat(-1, 2) }),
    limit: "ideal gas in equilibrium",
    says: "molecular speed goes as the square root of temperature over mass" },
  { id: "mean.free.path", domain: "thermal", law: "mean free path",
    fact: s("path", { n: -1, sigma: -1 }), limit: "dilute gas",
    says: "how far something gets between collisions goes inversely with density and cross-section" },
  { id: "diffusion", domain: "thermal", law: "diffusive spreading",
    fact: s("x", { t: rat(1, 2) }), limit: "random walk, no drift",
    says: "a diffusing thing spreads as the square root of time" },
  { id: "random.walk", domain: "thermal", law: "random walk distance",
    fact: s("x", { n: rat(1, 2) }), limit: "unbiased steps",
    says: "n random steps get you the square root of n away" },
  { id: "debye", domain: "thermal", law: "Debye heat capacity",
    fact: s("C", { temp: 3 }), limit: "crystal well below the Debye temperature",
    says: "the heat capacity of a solid falls as temperature cubed" },
  { id: "fourier", domain: "thermal", law: "Fourier heat conduction",
    fact: s("flux", { temp: 1, x: -1 }), limit: "steady state, small gradient",
    says: "heat flows in proportion to the temperature gradient" },

  /* ---- cosmology -------------------------------------------------------------- */
  { id: "hubble", domain: "cosmology", law: "Hubble's law",
    fact: s("v", { r: 1 }), limit: "nearby, smooth expansion",
    says: "recession speed is proportional to distance" },
  { id: "critical.density", domain: "cosmology", law: "critical density",
    fact: s("rho", { H: 2 }), limit: "flat universe",
    says: "the density that closes a universe goes as the expansion rate squared" },
  { id: "cmb.temperature", domain: "cosmology", law: "temperature of the relic background",
    fact: s("temp", { a: -1 }), limit: "adiabatic expansion",
    says: "the background cools as one over the scale factor" },
  { id: "matter.era", domain: "cosmology", law: "matter-dominated expansion",
    fact: s("a", { t: rat(2, 3) }), limit: "matter dominated, flat",
    says: "the scale factor grows as the two-thirds power of time" },
  { id: "radiation.era", domain: "cosmology", law: "radiation-dominated expansion",
    fact: s("a", { t: rat(1, 2) }), limit: "radiation dominated, flat",
    says: "the scale factor grows as the square root of time" },
  { id: "jeans", domain: "cosmology", law: "Jeans length",
    fact: s("length", { temp: rat(1, 2), rho: rat(-1, 2) }),
    limit: "isothermal cloud",
    says: "the size that collapses goes as the square root of temperature over density" },

  /* ---- geometry, and the exact ones --------------------------------------------- */
  { id: "shell.growth", domain: "geometry", law: "the surface of a ball in D dimensions",
    fact: s("shell", { r: expo(-1, { D: 1 }) }), limit: "exact, any dimension",
    says: "the room at radius r grows as r to the D minus one" },
  { id: "ball.growth", domain: "geometry", law: "the volume of a ball in D dimensions",
    fact: s("ball", { r: expo(0, { D: 1 }) }), limit: "exact, any dimension",
    says: "the room within radius r grows as r to the D" },
  { id: "surface.to.volume", domain: "geometry", law: "surface to volume ratio",
    fact: s("ratio", { r: -1 }), limit: "exact, any dimension",
    says: "the ratio of surface to volume falls as one over size" },
  { id: "flux.dilution", domain: "geometry", law: "dilution of a conserved flux",
    fact: s("density", { r: expo(1, { D: -1 }) }), limit: "conserved and isotropic, exact",
    says: "anything conserved and spread evenly is diluted by exactly the room it spreads into" },

  /* ---- dimensionless ------------------------------------------------------------ */
  { id: "fine.structure", domain: "dimensionless", law: "the fine structure constant",
    fact: { kind: "value", of: "alpha", equals: rat(1, 137) },
    limit: "low energy", says: "the strength of the electromagnetic coupling, about 1/137" },
  { id: "proton.electron", domain: "dimensionless", law: "proton to electron mass ratio",
    fact: { kind: "value", of: "mass ratio", equals: rat(1836, 1) },
    limit: "measured", says: "a proton is about 1836 times an electron" },
];

/**
 * WHAT THIS VOCABULARY CANNOT SAY, written down so the gap is visible.
 *
 * A corpus of eighty laws invites a reader to treat "matches nothing" as "unknown to
 * physics", and for anything on this list that inference is simply wrong: the law is known
 * and the corpus cannot hold it. Kept next to the corpus rather than in a commit message,
 * because it is the single most misleading thing about the page this feeds.
 */
export const INEXPRESSIBLE: { what: string; why: string }[] = [
  { what: "Maxwell's equations as equations",
    why: "they relate fields to their own derivatives across space and time; this " +
      "vocabulary has scalings and products, not differential operators. What survives " +
      "here is their falloff skeleton - the r^-2, the r^-3 and the r^-1" },
  { what: "anything with a tensor in it - general relativity's field equations, stress " +
      "and strain, the metric as an object",
    why: "a Fact is about a scalar quantity. A metric COMPONENT can appear; the metric " +
      "cannot" },
  { what: "gauge structure and conservation as a consequence of symmetry",
    why: "conservation is a premise here, not something derived from an invariance - " +
      "there is no group in this vocabulary and so no Noether argument" },
  { what: "variational principles - least action, Lagrangians, Hamiltonians",
    why: "these are statements about a functional over paths; nothing here quantifies " +
      "over paths" },
  { what: "operator ordering, commutators, entanglement",
    why: "quantities here are numbers that multiply commutatively. The scaling shadows " +
      "of quantum mechanics are in the corpus; its algebra is not" },
  { what: "anything exponential - Boltzmann factors, tunnelling, radioactive decay",
    why: "`raised` carries a rational power of a base, not a base raised to a variable" },
  { what: "phase transitions and critical exponents as a class",
    why: "expressible one at a time as scalings, but the renormalisation argument that " +
      "explains why they are universal is not" },
];
