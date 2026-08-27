/**
 * THE LEDGER — everything matter is known to do, at every level anybody describes it at,
 * and where in this model each one could possibly come from.
 *
 * WHY IT IS A FILE AND NOT AN ARGUMENT. `G^XOR^c` says what a particle is: a charge bent
 * round by a polarity field until its motion closes, and the closing IS the mass. That is
 * a claim at ONE level — the lowest — and the file's own header admits what it costs:
 * "nothing here picks out a preferred mass: the sizes are spread rather than clustered, so
 * there are structures but no KINDS of structure." The temptation at that point is to keep
 * tuning the lowest level until the electron falls out of it. THAT IS THE WRONG SHAPE OF
 * ATTEMPT, and it is wrong for a reason that has nothing to do with this model.
 *
 * NOBODY GETS CHEMISTRY OUT OF QCD EITHER. The periodic table is not derived from the
 * strong coupling; it is derived from the Pauli principle and a Coulomb potential, and the
 * nucleus enters as a number. Nuclear saturation is not derived from quark masses; it is
 * derived from a short-ranged attraction and a hard core. EACH LEVEL IS RECOVERED FROM THE
 * ONE BELOW BY AN ARGUMENT THAT THROWS ALMOST EVERYTHING AWAY, and what survives the throw
 * is two or three numbers. So the honest question this model can be asked is not "does the
 * lattice give the electron" but:
 *
 *   AT EACH LEVEL, DOES THE MODEL HAVE THE TWO OR THREE THINGS THAT LEVEL NEEDS?
 *
 * AND THE RECURRING ANSWER IS THAT IT NEEDS TWO SCALES AND HAS ONE. Every characteristic
 * size in this ledger is a competition: a nucleus is volume against surface, an atom is
 * kinetic against Coulomb, a white dwarf is degeneracy against gravity, a superconductor is
 * pairing against thermal. `G^XOR^c` names its own missing pair exactly — "the candidates
 * here are the orbit's radius, which the field sets, against what a turn costs. A turn
 * costs nothing in this file, so there is nothing for the radius to trade against." THE
 * `scales` FIELD BELOW IS THAT OBSERVATION MADE INTO A COLUMN, so that the same question
 * can be asked of all seventy-odd facts at once rather than of one at a time.
 *
 * EVERY NUMBER HERE IS SOURCED AND NONE OF IT IS THIS MODEL'S. `source` names where the
 * value was taken from, and a fact with no source it could be checked against carries no
 * number at all — it is stated qualitatively or it is left out. That rule cost several
 * entries their decimals and it is the rule that makes the file usable: a target that was
 * remembered rather than looked up is a target that can be met by accident.
 *
 * WHAT IT IS FOR, PRACTICALLY. `LEDGER` is data and `readingOf` runs the matter model
 * once; a fact that has an `analogue` names a number the model can actually produce and
 * what it would have to be. That pair is what a search optimises against, and it is why
 * the two are in one file: a target without a probe is a wish, and a probe without a
 * target is a diagnostic.
 */

import { World, headerOf, judge } from "../lib/DISCRETE.ts";
import { readdirSync, readFileSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { test } from "../lib/Report.ts";
import {
  Reading, Structure, clockRate, exponentOf, meanPath, readingOf, shadow, sizeLaw,
  tradeoff, withTracking,
} from "../lib/Trajectory.ts";

/* re-exported: `runtime/CREATION.ts` and the probes both address these through here, and
 * moving them to `lib/` should not have moved where they are asked for */
export type { Reading, Structure };
export {
  clockRate, exponentOf, meanPath, readingOf, shadow, sizeLaw, tradeoff, withTracking,
};

// ────────────────────────────────────────────────────────────────────────────
//  THE LEVELS
// ────────────────────────────────────────────────────────────────────────────

/**
 * SEVEN LEVELS AND THE LATTICE UNDER THEM, each one a description that survives the loss
 * of the one below it. That is what makes a level a level rather than an approximation: a
 * chemist who is handed the quark masses learns nothing, and the reason is not ignorance,
 * it is that everything the quark masses do to chemistry arrives through two numbers.
 */
export const LEVELS = [
  { n: 0, name: "lattice", what: "rays, polarity, charge, and one cell a tick — what this model IS" },
  { n: 1, name: "particle", what: "species: a mass, a charge, a spin, a lifetime" },
  { n: 2, name: "nuclear", what: "what binds nucleons, and what size it settles at" },
  { n: 3, name: "atomic", what: "one nucleus and its electrons: shells, spectra, the table" },
  { n: 4, name: "chemical", what: "atoms bound to atoms: valence, bond energies, shapes" },
  { n: 5, name: "condensed", what: "many atoms at once: phases, rigidity, conduction, order" },
  { n: 6, name: "bulk", what: "matter held together by its own gravity" },
  { n: 7, name: "cosmological", what: "how much of it there is, and why it is matter at all" },
] as const;

export type Level = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * WHERE A FACT COULD COME FROM IN THIS MODEL — the verdict, declared before anything runs.
 *
 *   has          the model produces it, and something in this suite measures it. The claim
 *                is checkable and is checked
 *   could        decidable from what the model already has and nobody has asked. These are
 *                the cheap ones and there are more of them than expected
 *   needs-scale  the model has one of the two competing scales this fact is made of. THIS
 *                IS THE LARGEST CLASS AND IT IS ONE DIAGNOSIS REPEATED, which is either the
 *                model's central defect or its central opportunity
 *   needs-above  it needs a level of description that has not been built. Not a defect:
 *                no theory of anything derives chemistry without building atoms first
 *   refuted      the model says otherwise. These are the only entries that are PREDICTIONS
 *                rather than targets, and they are the ones that can kill it
 */
export type Reach = "has" | "could" | "needs-scale" | "needs-above" | "refuted";

export type Fact = {
  id: string;
  level: Level;
  /** the fact, in one line, as somebody outside this project would state it */
  what: string;
  value?: number;
  err?: number;
  units?: string;
  /** WHERE THE NUMBER CAME FROM. A fact with a value and no source is not allowed. */
  source?: string;
  reach: Reach;
  /** the two quantities whose competition SETS this, where it is a size or a scale */
  scales?: [string, string];
  /** what the model would need before it could say this at all */
  needs?: string;
  /**
   * WHERE IN THIS SUITE IT IS ALREADY MEASURED — prose, for a reader.
   *
   * NOT CHECKED, AND THAT IS WHY `cites` EXISTS BESIDE IT. Every `has` fact carried one of
   * these and sixteen of the seventeen named nothing a machine could resolve: "transport,
   * step", "species §4", "the article's walk". A reader can follow those; nothing can
   * verify them, so "the suite already measures this" was a claim the suite never made.
   */
  at?: string;
  /**
   * THE TESTS THAT ESTABLISH IT, BY ID — and they are checked to exist and to have HELD.
   *
   * This is what makes a `has` fact testable without measuring it again: the measurement is
   * somewhere else in this suite, so what is owed here is a link, and a link can be
   * followed. `ledger/coverage` resolves every one of these against the report and fails on
   * a citation that names no test or names a failing one.
   */
  cites?: string[];
  /**
   * WHAT MUST BE TRUE BEFORE THIS FACT CAN EVEN BE ASKED — other ledger facts, by id.
   *
   * A `needs-above` fact is not a failure and is not a pass; it is a question the model
   * cannot yet be put. But it is not unfalsifiable either, because the REASON it cannot be
   * put is itself a statement: the periodic table needs atoms, atoms need a bound state,
   * and a bound state needs a preferred size. Naming the blocker turns twenty-nine
   * un-askable facts into a dependency graph over askable ones — and the day a blocker is
   * met, everything above it becomes askable at once rather than by somebody remembering.
   */
  blockedBy?: string[];
  /** the model-side quantity that stands in for it, and what that number would have to be */
  analogue?: {
    name: string;
    probe: (r: Reading) => number;
    want: number;
    tolerance?: number;
    atLeast?: number;
    atMost?: number;
    because: string;
  };
};

// ────────────────────────────────────────────────────────────────────────────
//  WHAT A RUN OF THE MATTER MODEL LOOKS LIKE FROM OUTSIDE
// ────────────────────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────────────────────
//  THE PROBES — a model-side number for a world-side fact
// ────────────────────────────────────────────────────────────────────────────

const mean = (xs: number[]) => xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN;

const sd = (xs: number[]) => {
  if (xs.length < 2) return NaN;
  const m = mean(xs);
  return Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1));
};

const corr = (xs: number[], ys: number[]) => {
  if (xs.length < 3) return NaN;
  const mx = mean(xs), my = mean(ys);
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < xs.length; i++) {
    const a = xs[i] - mx, b = ys[i] - my;
    sxy += a * b; sxx += a * a; syy += b * b;
  }
  return sxx > 0 && syy > 0 ? sxy / Math.sqrt(sxx * syy) : NaN;
};

/** ordinary least squares slope of y on x — the only fit in this file */
const slope = (xs: number[], ys: number[]) => {
  if (xs.length < 3) return NaN;
  const mx = mean(xs), my = mean(ys);
  let sxy = 0, sxx = 0;
  for (let i = 0; i < xs.length; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; }
  return sxx > 0 ? sxy / sxx : NaN;
};

/** structures big enough to have an inside and an outside — one point has neither */
const real = (r: Reading) => r.structures.filter(s => s.mass >= 4);

/**
 * HOW SURFACE GROWS WITH MASS — the exponent, and the single most informative number in
 * this file.
 *
 * 2/3 IS A COMPACT BODY IN THREE DIMENSIONS: double the volume and the skin goes up by
 * 2^(2/3). 1 IS DUST OR A FILAMENT: every point is on the outside, there is no inside, and
 * a volume term cannot exist because nothing is in the volume. A binding energy per nucleon
 * that PLATEAUS is exactly the statement that the volume term wins at large A, so a model
 * whose structures come out at 1 cannot have a plateau, cannot have a saturation density,
 * and cannot have a preferred size — three of this ledger's entries falling to one number.
 */
export const surfaceExponent = (r: Reading) => {
  const s = real(r);
  return slope(s.map(x => Math.log(x.mass)), s.map(x => Math.log(Math.max(x.surface, 1))));
};

/**
 * HOW MUCH OF ALL MATTER IS IN THE SINGLE BIGGEST THING — which is what a mass spread of
 * ten actually means, said in a way that cannot be misread.
 *
 * A relative spread is a ratio of two moments and a big one has two quite different causes:
 * a genuine range of sizes, which is what a population with KINDS looks like, or ONE BLOB
 * AND SOME CRUMBS, which is what it looks like when accretion has no opposing rate. The two
 * want opposite things done about them and the spread alone cannot tell them apart.
 */
export const blobShare = (r: Reading) => {
  const all = r.structures;
  if (!all.length) return NaN;
  let total = 0, most = 0;
  for (const s of all) { total += s.mass; if (s.mass > most) most = s.mass; }
  return total > 0 ? most / total : NaN;
};

/** the spread of sizes, relative — a population with KINDS is narrow, dust is broad */
export const massSpread = (r: Reading) => {
  const m = real(r).map(x => x.mass);
  return sd(m) / mean(m);
};

/** binding per unit mass against mass: nought is a plateau, anything else is not */
export const bindingSlope = (r: Reading) => {
  const s = real(r);
  return slope(s.map(x => x.mass), s.map(x => x.destroyed / x.mass));
};

/** the largest charge any structure carries — real matter's answer is 1 */
export const qMax = (r: Reading) =>
  r.structures.length ? Math.max(...r.structures.map(s => Math.abs(s.q))) : NaN;

/**
 * THE BIAS - which is what `charge.attraction` says the force actually contains, and what
 * nothing here has ever measured.
 *
 * THE DERIVED LAW IS `F_meet·(1 - P_a·P_b)`, and P is a fraction: how much of a body's
 * emission is positive, doubled and shifted, so it lives in [-1, 1] however many points
 * the body has. Multiply the bracket out and the electric term is `-(m_a·P_a)(m_b·P_b)`,
 * so what plays the part of a charge is `m·P` and the charge-to-MASS RATIO is P itself.
 *
 * WHICH CHANGES WHAT THE TWO TARGETS BELOW ARE ASKING. `|q|` is a sum over points and
 * grows with them; under this law it SHOULD, because a heavier body emits more. What must
 * not run away is `q/gross`, and until now there was no denominator to divide by. So these
 * two are the same questions asked of the quantity the force law names.
 */
export const biasMax = (r: Reading) => {
  const s = r.structures.filter(x => x.gross > 0);
  return s.length ? Math.max(...s.map(x => Math.abs(x.q) / x.gross)) : NaN;
};

/** and whether THAT tracks size - the ratio is what has no business growing */
export const biasMassCorrelation = (r: Reading) => {
  const s = real(r).filter(x => x.gross > 0);
  return Math.abs(corr(s.map(x => x.mass), s.map(x => Math.abs(x.q) / x.gross)));
};

/** does charge track size — the failure `G^XOR+XOR` documents, as one number */
export const qMassCorrelation = (r: Reading) => {
  const s = real(r);
  return Math.abs(corr(s.map(x => x.mass), s.map(x => Math.abs(x.q))));
};

/**
 * IS THE CHARGE THE POLARITY WEARING A HAT — the control the best-measured configuration
 * fails by construction. Under `charging: "with"` this is 1 and the two signs are one sign.
 */
export const qIsP = (r: Reading) => {
  const s = real(r);
  return Math.abs(corr(s.map(x => x.q), s.map(x => x.p)));
};

/** net charge over total charge carried — the universe's answer is nought to 26 places */
export const qNeutrality = (r: Reading) => {
  let net = 0, gross = 0;
  for (const s of r.structures) { net += s.q; gross += Math.abs(s.q); }
  return gross > 0 ? Math.abs(net) / gross : NaN;
};

/** what fraction of the world is matter rather than vacuum — the model's own Ω_b */
export const matterFraction = (r: Reading) =>
  r.points + r.folded > 0 ? r.folded / (r.points + r.folded) : NaN;

/**
 * THE TRADEOFF, MEASURED RATHER THAN IMPOSED — m against v, and NOTHING HERE ENFORCES A
 * RELATION BETWEEN THEM.
 *
 * v IS THE RELATIVE VELOCITY AND NOT THE SPEED, and getting that wrong is the mistake this
 * note exists to record. The first reading here took v to be cells crossed per tick, which
 * is 1 for every ray in the world always — `MOVEMENT` has no branch in which an active ray
 * fails to stream — so it measured c, reported it as 1, and could never have said anything
 * else. THAT IS THE PREMISE, NOT THE OBSERVABLE. Everything goes at c; what differs between
 * a photon and a proton is not how fast the underlying motion is but HOW MUCH OF IT ADDS UP:
 *
 *   v = |Σ d̂| / steps
 *
 * the net displacement over one ray's own life divided by the path it took to get there. A
 * ray that never turns has v = 1 and is massless. A ray whose orbit closes has v = 0 and is
 * at rest — not because it stopped, but because it came back. Everything between is a body
 * with a relative velocity, and it is relative in the only sense available on a lattice
 * where the underlying speed has no freedom in it at all.
 *
 * AND m IS THE TURNING RATE, which is the article's own identity — "in one dimension a ray
 * moves one cell a tick and its only other option is to turn around. MASS IS HOW OFTEN IT
 * TURNS." So m = turns / steps over the same life, off the same ray, over the same window.
 *
 * WHICH MAKES 1 = m + v A CLAIM THAT CAN NOW BE WRONG, and that is the whole point of
 * measuring it this way. Two candidates are scored and neither is built into any rule:
 *
 *   m + v = 1        the budget read literally — every step is either progress or a turn
 *   m² + v² = 1      the RELATIVISTIC reading, β² + 1/γ² = 1, which is what E² = p² + m²
 *                    becomes once it is divided through by E
 *
 * BOTH ARE NOW REAL TESTS. Under the old reading they were not: with v pinned at 1 the
 * Pythagorean form was √(1 + m²) ≈ 1 + m²/2, within a per cent of 1 for any small m whatever
 * the dynamics did, so it "won" by arithmetic. With v free to fall the two separate — they
 * differ by m·v, which is order 0.25 at the midpoint — and whichever is nearer is the
 * model's answer rather than the author's.
 *
 * WEIGHTED BY PATH LENGTH, because a ray that lived four ticks and one that lived forty are
 * not two equal opinions about the same quantity. An unweighted mean lets the short lives —
 * which are the most numerous and the least resolved, a four-step drift being 1 unless it
 * turned in a window barely wide enough to turn in — set the answer.
 */
// ────────────────────────────────────────────────────────────────────────────
//  THE LEDGER
// ────────────────────────────────────────────────────────────────────────────

/** the sources, named once so that a value cannot drift away from where it came from */
export const SOURCES = {
  CODATA: "CODATA 2022, physics.nist.gov/cuu/Constants (allascii.txt)",
  PDG: "Particle Data Group, mass_width_2025.txt (RPP 2025)",
  PDG_N: "PDG 2024 neutron listing; τ = ħ/Γ from mass_width_2025.txt",
  SUPERK: "Super-Kamiokande I–IV, arXiv:2010.16098",
  AME: "AME2016 atomic mass evaluation, via arXiv:1709.01386",
  PLANCK: "Planck 2018 results VI, arXiv:1807.06209",
  FIXSEN: "Fixsen 2009, arXiv:0911.1955",
  LBT: "LBT Y_p Project V, arXiv:2601.22239",
  CCCBDB: "NIST Computational Chemistry Comparison and Benchmark Database",
  NUCMAT: "empirical nuclear matter saturation, via arXiv:1604.07632",
  SC: "arXiv:cond-mat/9802202 (cuprates); arXiv:2112.09862 (hydrides)",
} as const;

/** ħ in GeV·s, so a PDG width becomes a lifetime here rather than in a comment */
const HBAR_GEVS = 6.582119569e-25;
const lifeOf = (widthGeV: number) => HBAR_GEVS / widthGeV;

export const LEDGER: Fact[] = [

  // ── LEVEL 0 · THE LATTICE ────────────────────────────────────────────────
  // What the model already commits to. These are not targets; they are the
  // premises everything above has to be recovered THROUGH.

  {
    id: "lattice/c",
    cites: ["cosmology/lattice-step", "geometry/derived-constants"],
    level: 0,
    what: "everything propagates at one cell a tick — there is no slower and no faster",
    value: 299792458, units: "m s^-1", source: SOURCES.CODATA,
    reach: "has", at: "transport, step",
  },
  {
    id: "lattice/no-rest",
    cites: ["structures/mass-as-period"],
    level: 0,
    what: "nothing is ever at rest; what looks like rest is motion that has closed",
    reach: "has", at: "G^XOR^c header",
  },
  {
    id: "lattice/mass-is-turning",
    cites: ["structures/mass-as-period", "dilation/budget-is-a-length"],
    level: 0,
    what: "mass is the rate at which a ray turns round: period = 1/mass",
    reach: "has", at: "the article's walk; dilation",
  },
  {
    id: "lattice/tradeoff",
    blockedBy: ["lattice/binding"],
    level: 0,
    what: "the price of having mass is not being able to go forward — but a thing can be " +
      "at rest and still be light, so motion lost is not the same as weight gained",
    reach: "could",
    scales: ["what gets through, v", "what does not, 1 − v"],
    needs: "nothing new — but the accounting has to be in ONE UNIT. `1 = m + v` is false as " +
      "written for two separate reasons and both had to be found by measuring. FIRST, v is " +
      "a fraction of DISPLACEMENT while the obvious reading of m is a COUNT OF TURNS per " +
      "step; adding them is adding a ratio to a rate, and the sum missed 1 by 0.21 on that " +
      "alone. SECOND, and the one that matters: even in the right units it says a thing at " +
      "rest is maximally heavy, because v = 0 forces the whole budget into m. THAT IS " +
      "PLAINLY WRONG ABOUT MATTER, and what it leaves out is that motion can be lost " +
      "WITHOUT BECOMING INERTIA — see `lattice/binding`",
  },
  {
    id: "lattice/binding",
    level: 0,
    what: "and the motion lost INSIDE matter is not weight — it is what holds the thing " +
      "together and runs its clock",
    reach: "could",
    scales: ["motion lost in the open — mass", "motion lost inside matter — binding"],
    needs: "the split is an IDENTITY once bends are attributed to where they happened, so " +
      "on its own it proves nothing. What makes it a claim is that this model already has " +
      "a second, independent reading of the same quantity: `blocks` refuses (G/2) wherever " +
      "matter is holding something, and that deficit is the gravity of this model. One " +
      "number off ray trajectories, one off the expansion rule, and neither knows about " +
      "the other",
    analogue: {
      name: "|inside − shadow| / shadow — two routes to the binding share",
      probe: r => {
        const t = tradeoff(r, 2), sh = shadow(r);
        return Number.isFinite(t.inside) && sh > 0 ? Math.abs(t.inside - sh) / sh : NaN;
      },
      want: 0, atMost: 0.15,
      because: "two independent routes to how much of the budget is tied up holding matter " +
        "together. Agreement says the decomposition describes something the model already " +
        "does under another name; disagreement says one of the two is not measuring what " +
        "it claims, and either answer is worth more than the identity on its own",
    },
  },
  {
    id: "lattice/free-path",
    cites: ["cosmology/transport-premise"],
    level: 0,
    what: "a ray in this vacuum lives about two steps and never more than eleven, so " +
      "nothing has a trajectory to have a relative velocity ALONG",
    reach: "has",
    needs: "not a target — a measured property of the medium, and the reason the whole " +
      "m-against-v question is currently unanswerable at the ray level. An orbit closes " +
      "after CYCLE ring steps and no ray lives that long: `G^XOR+XOR` reports 290,526 " +
      "turns taken and not one lap completed, and this is the same fact from the other " +
      "end. Any exponent fitted to v drifts with wherever the sample is cut — measured, " +
      "p ran 1.26 → 1.45 → 1.55 → 1.62 as the cut went 2 → 4 → 6 → 8 and the sample fell " +
      "61,327 → 1,839 → 125 → 12. THAT IS A FITTED CUTOFF, NOT A LAW",
    analogue: {
      name: "mean sampled path, in steps",
      probe: meanPath,
      want: 8, atLeast: 8,
      because: "the tightest orbit the lattice can express is CYCLE ring steps, so a ray " +
        "has to live at least that long for `an orbit that closed` to be a thing that " +
        "happens rather than a thing that is described. Below it, every trajectory " +
        "statement in this file is about the survivors",
    },
  },
  {
    id: "lattice/planck-time",
    cites: ["geometry/derived-constants"],
    level: 0,
    what: "the tick, if the lattice is at the Planck scale",
    value: 5.391247e-44, err: 6.0e-49, units: "s", source: SOURCES.CODATA,
    reach: "has", at: "scale, ceiling",
  },
  {
    id: "lattice/planck-length",
    cites: ["geometry/derived-constants"],
    level: 0,
    what: "the cell, on the same identification",
    value: 1.616255e-35, err: 1.8e-40, units: "m", source: SOURCES.CODATA,
    reach: "has", at: "scale",
  },
  {
    id: "lattice/born",
    cites: ["automaton/one-process-not-two"],
    level: 0,
    what: "probability is the square of what evolves, and ray count is what is conserved",
    reach: "has", at: "the article's walk — Σ|ψ|² measured at 1.000000000000",
  },
  {
    id: "lattice/interference",
    cites: ["vacuum/which-meeting"],
    level: 0,
    what: "two paths can cancel: a + and a − arriving together give nothing",
    reach: "has", at: "meeting — it is (G/1) unchanged",
  },
  {
    id: "lattice/gravity-is-destruction",
    cites: ["gravity/inverse-square", "cosmology/blocked-expansion"],
    level: 0,
    what: "matter is in the way of the expansion, and the deficit that leaves is the pull",
    reach: "has", at: "gravity, suppression, rar",
  },

  // ── LEVEL 1 · PARTICLES ──────────────────────────────────────────────────

  {
    id: "particle/electron-mass",
    level: 1,
    what: "the electron has one particular mass, and every electron has the same one",
    value: 0.51099895069, err: 1.6e-10, units: "MeV", source: SOURCES.CODATA,
    reach: "needs-scale",
    scales: ["the orbit's radius, which the field sets", "what a turn costs — MISSING"],
    needs: "a turn has to cost something. With a free turn the radius trades against " +
      "nothing and the size distribution is spread rather than peaked, which is this " +
      "model's own stated gap",
    analogue: {
      name: "spread of structure masses, relative",
      probe: massSpread,
      want: 0, atMost: 0.35,
      because: "a population with KINDS is narrow about its kinds. Dust is broad. This does " +
        "not ask for the electron's mass — it asks whether there is a preferred mass at all, " +
        "which is the prior question and the one the model currently fails",
    },
  },
  {
    id: "particle/generations",
    blockedBy: ["particle/electron-mass"],
    level: 1,
    what: "there are exactly three generations of charged lepton, and no more",
    reach: "needs-above",
    needs: "a preferred mass first — a model with no species cannot have three of them",
  },
  {
    id: "particle/muon-mass",
    blockedBy: ["particle/electron-mass"],
    level: 1,
    what: "the muon is the electron's heavier copy: same charge, same spin, 207× the mass",
    value: 105.6583755, err: 2.3e-6, units: "MeV", source: SOURCES.PDG,
    reach: "needs-above",
  },
  {
    id: "particle/tau-mass",
    blockedBy: ["particle/electron-mass"],
    level: 1,
    what: "and the tau is the third copy",
    value: 1776.93, err: 0.09, units: "MeV", source: SOURCES.PDG,
    reach: "needs-above",
  },
  {
    id: "particle/proton-electron-ratio",
    blockedBy: ["particle/electron-mass"],
    level: 1,
    what: "the proton is 1836 times the electron, which is why atoms have a nucleus at rest",
    value: 1836.152673426, err: 3.2e-8, units: "dimensionless", source: SOURCES.CODATA,
    reach: "needs-above",
    needs: "two species before there can be a ratio of two species",
  },
  {
    id: "particle/charge-quantised",
    cites: ["species/which-exist", "structures/charge-is-one-bit"],
    level: 1,
    what: "charge comes in units: every free particle carries an integer multiple of e",
    value: 1.602176634e-19, units: "C (exact)", source: SOURCES.CODATA,
    reach: "has", at: "species/which-exist — |q| is an integer by construction",
  },
  {
    id: "particle/charge-is-one",
    cites: ["species/which-exist"],
    level: 1,
    what: "and the integer is 1 for every charged particle that exists free",
    value: 1, units: "e",
    source: SOURCES.PDG,
    reach: "refuted",
    needs: "the model over-predicts: |q| ≥ 2 occurs in the enumeration and nothing forbids " +
      "it. This is an over-prediction rather than a gap, and it is a standing refutation " +
      "unless something bounds it",
    at: "species/which-exist §1",
    analogue: {
      name: "largest |q| any structure carries",
      probe: qMax,
      want: 1, atMost: 3,
      because: "matter's answer is 1. `G^XOR+XOR` measures 27 with a correlation of 0.57 to " +
        "mass, which is charge having become a count of contents. Anything above a few is " +
        "the same failure",
    },
  },
  {
    id: "particle/charge-not-mass",
    level: 1,
    what: "a heavier particle is not a more charged one — charge and mass are independent",
    reach: "needs-above",
    needs: "charge that is a WINDING rather than a sum. A sum over points grows with the " +
      "number of points and there is no way round that",
    analogue: {
      name: "|corr(mass, |q|)| across structures",
      probe: qMassCorrelation,
      want: 0, atMost: 0.2,
      because: "the proton and the positron have the same charge and differ by 1836 in mass, " +
        "so the correlation in the world is nothing at all",
    },
  },
  {
    id: "particle/charge-is-not-polarity",
    level: 1,
    what: "electric charge and magnetic polarity are different things about a particle",
    reach: "needs-above",
    needs: "a mechanism that MAKES charge from an event. Where charge is drawn as the " +
      "polarity — which is what the measured-best configuration does — the two are one " +
      "quantity and this is 1 by construction. See `G^XOR^q`",
    analogue: {
      name: "|corr(q, p)| across structures",
      probe: qIsP,
      want: 0, atMost: 0.5,
      because: "the whole reason `G^XOR+XOR` exists is to keep two signs apart, and " +
        "`charging: \"with\"` collapses them. This is that collapse as a number",
    },
  },
  {
    id: "particle/quark-thirds",
    cites: ["species/which-exist"],
    level: 1,
    what: "quarks carry ±1/3 and ±2/3 of e — charge is quantised in thirds, not in units",
    value: 1 / 3, units: "e", source: SOURCES.PDG,
    reach: "refuted",
    needs: "nothing can be done: |q| here is a traversal count and a count is an integer. " +
      "THE MODEL FORBIDS THE QUARK OUTRIGHT, which is the sharpest thing in this ledger",
    at: "species/which-exist §1",
  },
  {
    id: "particle/neutrinos-have-mass",
    cites: ["species/which-exist"],
    level: 1,
    what: "neutrinos are neutral, are fermions, and have mass — oscillation proves the mass",
    value: 0.12, units: "eV (Σmν, 95% upper limit)", source: SOURCES.PLANCK,
    reach: "refuted",
    needs: "|q| = 0 forces every traversal count even, hence the zero class, hence holonomy " +
      "+1, hence a BOSON. A NEUTRAL FERMION IS IMPOSSIBLE HERE, on any structure whatever. " +
      "This is a theorem in the model and the neutrino is a fact in the world",
    at: "species/which-exist §2",
  },
  {
    id: "particle/spin-half",
    cites: ["structures/spin-from-a-twist", "layer2/spin-half-and-g-two"],
    level: 1,
    what: "matter is made of fermions: a 2π rotation returns them to minus themselves",
    reach: "has",
    at: "structures/spin-from-a-twist, matter/handles — one twist on one edge does it",
  },
  {
    id: "particle/exclusion",
    blockedBy: ["particle/spin-half"],
    level: 1,
    what: "and two of them cannot be in the same state, which is why matter takes up room",
    reach: "could",
    needs: "the twist is there and the exclusion is not read off it yet",
  },
  {
    id: "particle/antimatter",
    blockedBy: ["particle/electron-mass"],
    level: 1,
    what: "every particle has an antiparticle: identical mass, opposite charge",
    reach: "could",
    needs: "the two senses of one turn ARE the two signs — `steer` says so. Nothing has " +
      "checked that the masses come out equal",
  },
  {
    id: "particle/electron-g",
    blockedBy: ["particle/electron-mass"],
    level: 1,
    what: "the electron's magnetic moment is 2, and the deviation is measured to 12 places",
    value: 2.00231930436092, err: 3.6e-13, units: "dimensionless", source: SOURCES.CODATA,
    reach: "needs-above",
    at: "moments — the model gets 2, and the anomaly needs a loop expansion it has not got",
  },
  {
    id: "particle/electron-stable",
    cites: ["structures/lifetime"],
    level: 1,
    what: "the electron does not decay — it is the lightest thing carrying charge",
    reach: "has", at: "structures §5 — no structure can beat 1/p",
  },
  {
    id: "particle/proton-stable",
    blockedBy: ["particle/electron-mass"],
    level: 1,
    what: "and the proton is stable to at least 10^34 years",
    value: 2.4e34, units: "years (90% CL, p→e⁺π⁰)", source: SOURCES.SUPERK,
    reach: "could",
  },
  {
    id: "particle/neutron-lifetime",
    blockedBy: ["particle/electron-mass"],
    level: 1,
    what: "a free neutron decays in about a quarter of an hour; bound in a nucleus it does not",
    value: lifeOf(7.493e-28), units: "s", source: SOURCES.PDG_N,
    reach: "needs-above",
    needs: "a bound state that changes what its parts do — nothing here has one",
  },
  {
    id: "particle/muon-lifetime",
    cites: ["structures/lifetime"],
    level: 1,
    what: "and the heavier leptons decay, faster the heavier they are",
    value: lifeOf(2.9959836e-19), units: "s", source: SOURCES.PDG,
    reach: "has", at: "species §5 — the ORDERING follows; the exponent does not",
  },
  {
    id: "particle/tau-lifetime",
    blockedBy: ["particle/electron-mass"],
    level: 1,
    what: "the tau, 10^7 times shorter-lived than the muon",
    value: lifeOf(2.267e-12), units: "s", source: SOURCES.PDG,
    reach: "needs-above",
  },
  {
    id: "particle/photon-massless",
    cites: ["species/the-particle-table"],
    level: 1,
    what: "the photon is massless and spin 1; the Higgs is massive and spin 0",
    value: 125.20, err: 0.11, units: "GeV (Higgs)", source: SOURCES.PDG,
    reach: "refuted",
    needs: "the spin ladder here is ONE BIT, so photon, Higgs and graviton are one object. " +
      "The largest hole in `species.ts` and it is a hole rather than a nuance",
    at: "species §3",
  },
  {
    id: "particle/mass-ceiling",
    cites: ["species/mass-ceiling"],
    level: 1,
    what: "no particle is anywhere near the Planck mass",
    value: 1.220890e19, err: 1.4e14, units: "GeV", source: SOURCES.CODATA,
    reach: "has",
    at: "species §4 — the one real derivation: the electron's mass cancels and 2π·m_P/N is left",
  },

  // ── LEVEL 2 · NUCLEI ─────────────────────────────────────────────────────
  // The level this model is closest to and furthest from at once: it is ALL
  // about two scales competing, and two scales competing is exactly the thing
  // `G^XOR^c` says it has not got.

  {
    id: "nuclear/binding-plateau",
    level: 2,
    what: "binding energy per nucleon PLATEAUS — it stops growing once a nucleus has an inside",
    value: 8.794533, err: 7e-6, units: "MeV per nucleon (⁶²Ni, the maximum)",
    source: SOURCES.AME,
    reach: "needs-scale",
    scales: ["a volume term, ∝ A", "a surface term, ∝ A^(2/3)"],
    needs: "structures with a genuine inside. `INSIDE` is written and is NOT in the default " +
      "build, and without it a folded point is never visited again — so there is no bulk " +
      "for a volume term to be about",
    analogue: {
      name: "slope of (destroyed/mass) against mass",
      probe: bindingSlope,
      want: 0, atMost: 0.02,
      because: "a plateau IS a zero slope. Space destroyed per point is this model's binding " +
        "energy per nucleon — it is what gravity is read off, so it is already in the right " +
        "unit and nothing has to be converted",
    },
  },
  {
    id: "nuclear/most-bound",
    blockedBy: ["nuclear/binding-plateau", "nuclear/two-rates"],
    level: 2,
    what: "and it has a maximum: ⁵⁶Fe and ⁶²Ni sit at the top, which is why fusion stops there",
    value: 8.790354, err: 5e-6, units: "MeV per nucleon (⁵⁶Fe)", source: SOURCES.AME,
    reach: "needs-scale",
    scales: ["the volume/surface plateau", "Coulomb repulsion, ∝ Z²/A^(1/3)"],
  },
  {
    id: "nuclear/saturation-energy",
    blockedBy: ["nuclear/two-rates"],
    level: 2,
    what: "infinite nuclear matter binds at a fixed energy per nucleon, whatever its size",
    value: 16, err: 1, units: "MeV per nucleon", source: SOURCES.NUCMAT,
    reach: "needs-scale",
    scales: ["short-ranged attraction", "a hard repulsive core"],
    needs: "a repulsion at short range. The model has attraction — folding — and nothing " +
      "that stops it, which is why matter here eats its own vacuum: 20,164 turns folded " +
      "10,375 points out of a world holding 5,864",
  },
  {
    id: "nuclear/saturation-density",
    level: 2,
    what: "and at a fixed density: a big nucleus is not a denser one, only a bigger one",
    value: 0.16, err: 0.01, units: "nucleons fm^-3", source: SOURCES.NUCMAT,
    reach: "needs-scale",
    scales: ["attraction pulling in", "the core holding out"],
    analogue: {
      name: "exponent of surface against mass",
      probe: surfaceExponent,
      want: 2 / 3, tolerance: 0.2,
      because: "a body at constant density has surface ∝ mass^((D−1)/D) = mass^(2/3) in " +
        "three dimensions. An exponent at 1 is dust — every point on the outside, no " +
        "interior, no density to saturate. This is the one number that decides whether the " +
        "model's structures are BODIES at all",
    },
  },
  {
    id: "nuclear/one-blob",
    level: 2,
    what: "matter comes in many separate nuclei, not one lump — accretion is opposed by " +
      "something, or everything would already be one object",
    reach: "needs-scale",
    scales: ["accretion from outside", "consumption from within — MISSING"],
    needs: "`INSIDE` is the candidate second rate and is not in the default build: interior " +
      "meetings would eat a structure at a rate its own density sets, against accretion " +
      "which adds at a rate its surface sets. Two rates is what picks a size",
    analogue: {
      name: "share of all matter in the single largest structure",
      probe: blobShare,
      want: 0.1, atMost: 0.5,
      because: "one object holding most of the matter in the world is not a population with " +
        "a size distribution, it is a runaway with debris. This is what a mass spread of " +
        "ten is actually reporting, and it is the more legible half of it",
    },
  },
  {
    id: "nuclear/two-rates",
    level: 2,
    what: "matter has a PREFERRED size at every level - nuclei cluster in A, stars in mass, " +
      "droplets in radius - and a preferred size is always two rates crossing",
    reach: "needs-scale",
    scales: ["something that grows with the thing", "something that opposes it"],
    needs: "not a second rate in particular - ANY second rate. This is the entry the other " +
      "nine `needs-scale` facts reduce to: six nuclear and four bulk, filed separately " +
      "because they are separate facts about the world, but ONE absence in the model. " +
      "Where two rates cross there is a size at which they balance and the population " +
      "piles up near it; where one rate runs alone, growth is self-similar and the sizes " +
      "come out scale-free. The shape of the distribution says which, without anybody " +
      "having to name the rates",
    analogue: {
      name: "r² of a power-law fit to the size distribution",
      probe: r => sizeLaw(r).r2,
      want: 0.4, atMost: 0.8,
      because: "a good power-law fit means NO preferred size — self-similar growth, one " +
        "rate, no scale anywhere in it. Matter is not like that at any level, so a high r² " +
        "here is the model failing this entry rather than passing it. IT IS ONLY ASKED " +
        "WHERE THE SIZES SPAN A DECADE: a straight line fitted across two thirds of one " +
        "distinguishes a power law from nothing at all, and reading 0.97 off such a fit as " +
        "`scale-free` is a conclusion the data cannot carry",
    },
  },
  {
    id: "nuclear/radius-law",
    blockedBy: ["nuclear/saturation-density"],
    level: 2,
    what: "nuclear radius goes as the cube root of the count: R ≈ 1.2·A^(1/3) fm",
    value: 1 / 3, units: "exponent", source: SOURCES.AME,
    reach: "could",
    needs: "nothing — it is the same statement as the saturation density and the same probe " +
      "answers it",
  },
  {
    id: "nuclear/proton-radius",
    blockedBy: ["particle/electron-mass", "nuclear/two-rates"],
    level: 2,
    what: "a proton is about a femtometre across, and a nucleus is a few",
    value: 8.4075e-16, err: 6.4e-19, units: "m", source: SOURCES.CODATA,
    reach: "needs-scale",
  },
  {
    id: "nuclear/magic-numbers",
    blockedBy: ["particle/exclusion", "nuclear/two-rates"],
    level: 2,
    what: "some counts are special: 2, 8, 20, 28, 50, 82, 126 nucleons are unusually bound",
    reach: "needs-above",
    scales: ["a mean field", "the exclusion principle filling it"],
    needs: "a SHELL — a potential whose levels can be counted and filled. There is nothing " +
      "in this model that is a level, so there is nothing to be magic about",
  },
  {
    id: "nuclear/strong-range",
    blockedBy: ["particle/electron-mass"],
    level: 2,
    what: "what binds nucleons reaches about one femtometre and no further",
    reach: "needs-above",
    scales: ["the range of the attraction", "the size of the thing it acts on"],
    needs: "a force with a RANGE. Every interaction here is between touching points, so " +
      "the range is one cell by construction and cannot be anything else",
  },
  {
    id: "nuclear/valley",
    blockedBy: ["nuclear/magic-numbers"],
    level: 2,
    what: "light nuclei want N ≈ Z; heavy ones want more neutrons, and outside a narrow " +
      "band nothing is bound at all",
    reach: "needs-above",
    scales: ["symmetry energy", "Coulomb repulsion"],
  },
  {
    id: "nuclear/decay-modes",
    blockedBy: ["nuclear/valley"],
    level: 2,
    what: "unstable nuclei have exactly three ways out: alpha, beta, fission",
    reach: "needs-above",
  },

  // ── LEVEL 3 · ATOMS ──────────────────────────────────────────────────────

  {
    id: "atomic/bohr-radius",
    blockedBy: ["nuclear/two-rates", "particle/charge-is-one"],
    level: 3,
    what: "an atom is about half an ångström, and every atom is within a factor of three of it",
    value: 5.29177210544e-11, err: 8.2e-21, units: "m", source: SOURCES.CODATA,
    reach: "needs-above",
    scales: ["kinetic energy, which wants to spread out", "Coulomb attraction, which pulls in"],
    needs: "this is the cleanest two-scale competition in physics and the model has neither " +
      "term. It needs a bound state before it needs a size for one",
  },
  {
    id: "atomic/rydberg",
    blockedBy: ["atomic/bohr-radius"],
    level: 3,
    what: "and it costs about 14 eV to take an electron off hydrogen",
    value: 13.605693122990, err: 1.5e-11, units: "eV", source: SOURCES.CODATA,
    reach: "needs-above",
  },
  {
    id: "atomic/fine-structure",
    blockedBy: ["atomic/bohr-radius"],
    level: 3,
    what: "the strength of the coupling between charge and light, and it is small",
    value: 137.035999177, err: 2.1e-8, units: "1/α", source: SOURCES.CODATA,
    reach: "needs-above",
    needs: "a dimensionless coupling. Everything in this model happens with probability 1 " +
      "when it happens at all — there is no small number anywhere in the rules",
  },
  {
    id: "atomic/shells",
    blockedBy: ["atomic/bohr-radius", "particle/exclusion"],
    level: 3,
    what: "electrons fill shells, and the shells hold 2, 8, 8, 18, 18, 32 — which IS the " +
      "periodic table",
    reach: "needs-above",
    scales: ["angular momentum levels", "exclusion filling them"],
  },
  {
    id: "atomic/spectra-discrete",
    blockedBy: ["atomic/bohr-radius"],
    level: 3,
    what: "atoms emit at sharp frequencies, not a continuum",
    reach: "could",
    needs: "the model's own mass-as-a-period says a bound thing has a repeat rate. Whether " +
      "a structure has a discrete spectrum of them has never been asked",
  },
  {
    id: "atomic/mostly-empty",
    level: 3,
    what: "the nucleus is 10^-5 of the atom, so matter is 10^-15 of the space it occupies",
    value: 1e-15, units: "volume fraction", source: SOURCES.CODATA,
    reach: "could",
    analogue: {
      name: "folded points over all points — the model's own matter fraction",
      probe: matterFraction,
      want: 0.5, atLeast: 0.02, atMost: 0.9,
      because: "not a target for the 10^-15 — a lattice at the Planck scale has no atoms — " +
        "but a check that matter is a MINORITY of the world and not all of it. A run where " +
        "matter has eaten the vacuum is a run where nothing above this level can exist",
    },
  },

  // ── LEVEL 4 · CHEMISTRY ──────────────────────────────────────────────────

  {
    id: "chemical/bond-energy",
    blockedBy: ["atomic/shells"],
    level: 4,
    what: "a chemical bond costs a few electron-volts — four orders below nuclear binding",
    value: 4.4781, units: "eV (H₂ dissociation)", source: SOURCES.CCCBDB,
    reach: "needs-above",
    scales: ["electron kinetic energy", "the Coulomb well two nuclei share"],
  },
  {
    id: "chemical/bond-length",
    blockedBy: ["atomic/shells"],
    level: 4,
    what: "and it holds atoms about an ångström apart",
    value: 0.74144e-10, units: "m (H₂)", source: SOURCES.CCCBDB,
    reach: "needs-above",
  },
  {
    id: "chemical/valence",
    blockedBy: ["atomic/shells"],
    level: 4,
    what: "how many bonds an atom makes is set by its outer shell, which is why carbon makes four",
    reach: "needs-above",
  },
  {
    id: "chemical/energy-hierarchy",
    blockedBy: ["chemical/bond-energy"],
    level: 4,
    what: "bonds come in a ladder: covalent ~eV, hydrogen ~0.2 eV, van der Waals ~0.01 eV — " +
      "and life runs entirely in the gap between them",
    reach: "needs-above",
    scales: ["bond energy", "thermal energy kT at 300 K"],
  },
  {
    id: "chemical/chirality",
    cites: ["chirality/the-lattice-decides", "chirality/rotation-is-not-gauge"],
    level: 4,
    what: "molecules come in left and right forms that behave differently, and life uses one",
    reach: "has", at: "chirality — the model has a handedness and it is measured",
  },
  {
    id: "chemical/catenation",
    blockedBy: ["chemical/valence"],
    level: 4,
    what: "carbon bonds to itself indefinitely, which is why there is organic chemistry at all",
    reach: "needs-above",
  },

  // ── LEVEL 5 · CONDENSED MATTER ───────────────────────────────────────────

  {
    id: "condensed/phases",
    blockedBy: ["chemical/bond-energy"],
    level: 5,
    what: "matter has phases with sharp boundaries between them, not a smooth continuum",
    reach: "could",
    scales: ["interaction energy", "thermal energy"],
    needs: "a temperature. The model has a vacuum with an occupancy and nothing that is a " +
      "temperature, and a phase transition is a competition between an energy and one",
  },
  {
    id: "condensed/rigidity",
    blockedBy: ["chemical/bond-energy"],
    level: 5,
    what: "solids resist shear: they remember a shape, which liquids and gases do not",
    reach: "could",
    needs: "the model's structures move as wholes — `MOVING` tears rather than shears, " +
      "which is rigidity by construction and has never been called that",
  },
  {
    id: "condensed/incompressible",
    blockedBy: ["particle/exclusion"],
    level: 5,
    what: "ordinary matter barely compresses: squeeze a solid and its density hardly moves",
    reach: "needs-scale",
    scales: ["exclusion pressure", "applied pressure"],
  },
  {
    id: "condensed/conduction",
    blockedBy: ["atomic/shells"],
    level: 5,
    what: "some solids conduct and some do not, and the difference is a gap of about an eV",
    reach: "needs-above",
    scales: ["band gap", "thermal energy"],
  },
  {
    id: "condensed/ferromagnetism",
    blockedBy: ["condensed/phases"],
    level: 5,
    what: "iron holds a magnetisation below 1043 K and loses it above — a sharp transition",
    value: 1043, units: "K (Curie point of iron)", source: "standard reference value; " +
      "770 °C, corroborated in the literature but not taken from a primary metrology source",
    reach: "could",
    scales: ["exchange coupling between neighbours", "thermal disorder"],
    needs: "the model has ORDER — `inheritSign` makes a split take its sign from its " +
      "neighbours, which is an exchange coupling in everything but name. What it has not " +
      "got is the thing that disorders it, so there is a Curie point with nothing on the " +
      "far side of it",
    at: "neel, poles, ordering, texture",
  },
  {
    id: "condensed/superconductivity",
    blockedBy: ["condensed/phases"],
    level: 5,
    what: "some materials lose all resistance below a critical temperature",
    value: 134, units: "K (HgBa₂Ca₂Cu₃O₈₊δ at ambient pressure)", source: SOURCES.SC,
    reach: "needs-above",
    scales: ["pairing energy", "thermal energy"],
  },
  {
    id: "condensed/specific-heat",
    blockedBy: ["condensed/phases"],
    level: 5,
    what: "heat capacity goes as T³ at low temperature and flattens at high",
    reach: "needs-above",
    scales: ["Debye temperature", "T"],
  },

  // ── LEVEL 6 · BULK, HELD BY ITS OWN GRAVITY ──────────────────────────────
  // The level this model reaches most easily, because gravity is the one force
  // it does not have to import.

  {
    id: "bulk/hydrostatic",
    blockedBy: ["particle/electron-mass"],
    level: 6,
    what: "a star is pressure holding gravity off, and it settles at one radius",
    reach: "needs-scale",
    scales: ["pressure", "self-gravity"],
  },
  {
    id: "bulk/chandrasekhar",
    blockedBy: ["particle/exclusion", "bulk/hydrostatic"],
    level: 6,
    what: "a white dwarf cannot exceed about 1.4 solar masses — degeneracy pressure runs out",
    value: 1.4, units: "M☉",
    source: "Chandrasekhar limit; standard result, value corroborated across the " +
      "literature (see arXiv:astro-ph/9607003 for its dependence on G)",
    reach: "needs-scale",
    scales: ["electron degeneracy pressure", "gravity"],
    needs: "exclusion, which the model has as a twist and has never used as a pressure",
  },
  {
    id: "bulk/neutron-star",
    blockedBy: ["bulk/chandrasekhar"],
    level: 6,
    what: "and a neutron star is nuclear density held up the same way, about 10 km across",
    value: 12, units: "km (radius; the observed range is roughly 9–15)",
    source: "arXiv:1511.04305; range rather than a measurement of one object",
    reach: "needs-scale",
    scales: ["neutron degeneracy pressure", "gravity"],
  },
  {
    id: "bulk/rounding",
    blockedBy: ["bulk/hydrostatic"],
    level: 6,
    what: "past a few hundred kilometres a body is pulled round; below it, it stays lumpy",
    reach: "needs-scale",
    scales: ["material strength", "self-gravity"],
  },
  {
    id: "bulk/horizons",
    cites: ["metric/shadow-against-eht"],
    level: 6,
    what: "enough mass in a small enough region has a horizon, and light does not come back out",
    reach: "has", at: "eht — and the model predicts no late echoes, which is a real prediction",
  },
  {
    id: "bulk/density-range",
    blockedBy: ["nuclear/saturation-density"],
    level: 6,
    what: "matter's density spans some forty orders of magnitude, from interstellar gas to " +
      "a neutron star, and it is the SAME matter throughout",
    reach: "could",
  },

  // ── LEVEL 7 · COSMOLOGICAL ───────────────────────────────────────────────

  {
    id: "cosmo/asymmetry",
    level: 7,
    what: "there is matter and essentially no antimatter, and nothing in the known laws " +
      "explains the imbalance",
    value: 6.1e-10, units: "baryons per photon (η, from Ω_b h²)", source: SOURCES.PLANCK,
    reach: "could",
    needs: "A RULE THAT MAKES CHARGE ASYMMETRICALLY. This is the one entry in the ledger " +
      "that the current open question bears on directly: `G^XOR^q` enumerates the ways a " +
      "meeting could create charge, and a rule whose output is biased — `field` or `anti` " +
      "rather than `product` or `random` — is a baryogenesis mechanism in the model's own " +
      "terms. Whether any of them biases is a measurement and this is where to read it",
    analogue: {
      name: "net charge over gross charge",
      probe: qNeutrality,
      want: 0, atMost: 0.05,
      because: "and the world is neutral to better than 10^-26, which is the CONSTRAINT on " +
        "the same mechanism: whatever makes the matter asymmetry must not leave a net " +
        "charge. A creation rule that biases charge and neutrality together is refuted by " +
        "this line before it is measured by the one above",
    },
  },
  {
    id: "cosmo/baryon-density",
    blockedBy: ["particle/electron-mass"],
    level: 7,
    what: "ordinary matter is about five per cent of the universe's energy density",
    value: 0.0224, err: 0.0001, units: "Ω_b h²", source: SOURCES.PLANCK,
    reach: "needs-above",
  },
  {
    id: "cosmo/dark-matter",
    cites: ["cosmology/radial-acceleration", "cosmology/sparc"],
    level: 7,
    what: "and something that gravitates and does nothing else is five times more abundant",
    value: 0.120, err: 0.001, units: "Ω_c h²", source: SOURCES.PLANCK,
    reach: "could",
    at: "rar, sparc — the model's gravity is a deficit rather than a substance, so this is " +
      "a place it has an actual alternative rather than a gap",
  },
  {
    id: "cosmo/matter-density",
    blockedBy: ["cosmo/baryon-density"],
    level: 7,
    what: "matter of every kind together is about a third of it",
    value: 0.315, err: 0.007, units: "Ω_m", source: SOURCES.PLANCK,
    reach: "needs-above",
  },
  {
    id: "cosmo/helium",
    blockedBy: ["nuclear/valley"],
    level: 7,
    what: "a quarter of ordinary matter by mass is helium, made in the first few minutes",
    value: 0.2458, err: 0.0013, units: "Y_p", source: SOURCES.LBT,
    reach: "needs-above",
    needs: "nuclei first",
  },
  {
    id: "cosmo/cmb",
    blockedBy: ["cosmo/baryon-density"],
    level: 7,
    what: "and the light left over is a near-perfect blackbody at 2.7 K",
    value: 2.72548, err: 0.00057, units: "K", source: SOURCES.FIXSEN,
    reach: "needs-above",
  },
  {
    id: "cosmo/expansion",
    cites: ["cosmology/hubble-rate", "cosmology/where-space-is-made"],
    level: 7,
    what: "space is expanding, and the rate is measured",
    value: 67.4, err: 0.5, units: "km s^-1 Mpc^-1", source: SOURCES.PLANCK,
    reach: "has", at: "cosmology — (G/2) IS the expansion, so this is the model's home ground",
  },
  {
    id: "cosmo/structure",
    cites: ["cosmology/where-space-is-made"],
    level: 7,
    what: "matter is not spread evenly: it clumps into a web with voids between",
    reach: "could",
    at: "cosmology, medium",
  },
  {
    id: "cosmo/neutrality",
    blockedBy: ["cosmo/asymmetry"],
    level: 7,
    what: "the universe is electrically neutral to better than one part in 10^26",
    reach: "could",
    needs: "see cosmo/asymmetry — the two are one constraint on one mechanism",
  },
];

// ────────────────────────────────────────────────────────────────────────────
//  THE TESTS
// ────────────────────────────────────────────────────────────────────────────

const at = (r: Reach) => LEDGER.filter(f => f.reach === r).length;

/**
 * WHETHER ONE ANALOGUE'S BAND IS MET — the same arithmetic `judge` does, pulled out so that
 * a target can be COUNTED as well as reported.
 *
 * WHY THE COUNTING MATTERS MORE THAN THE REPORTING. This suite has two verdicts, `holds`
 * and a prose string that means "not applicable, and here is why" — and the second does not
 * run. There is no third that means "runs, and is expected to miss". So a ledger of things
 * matter does that this model cannot yet do has nowhere honest to sit: declared `holds` it
 * fails the suite every night for being an open problem, and declared with prose it is never
 * measured at all.
 *
 * SO THE SCOREBOARD IS THE CLAIM. Each target reports as a plain measurement carrying its
 * own verdict, and what is JUDGED is how many of them are met — pinned with `atLeast` at
 * what is met today. That cannot cry wolf, because meeting fewer is the only way to fail
 * it, and it cannot rot quietly, because meeting fewer is exactly what a regression is.
 */
const met = (a: NonNullable<Fact["analogue"]>, x: number): "met" | "missed" | "unresolved" => {
  /*
   * AND A TARGET THAT COULD NOT BE ASKED IS NOT A TARGET THAT WAS FAILED.
   *
   * `nuclear/two-rates` fits a size distribution, and a fit needs a population: eight
   * structures at least, four occupied bins at least. The model produces one blob holding
   * 93.5% of all matter and a handful of crumbs, so the fit returns nothing at all - and
   * scored as a miss it read as "the model has no preferred size", which is a claim the
   * measurement never made. IT COULD NOT TAKE THE TEST.
   *
   * THE SAME MISTAKE WAS MADE AND FIXED ONCE ALREADY, in `runtime/CREATION.ts`, where two
   * of four criteria came back NaN at a budget with too few structures to correlate and
   * every rule was quietly marked down for it. Reproducing it here one file later is worth
   * recording: a NaN is a question that went unanswered, and it has to be counted apart
   * from the answers or it silently becomes one.
   */
  if (!Number.isFinite(x)) return "unresolved";
  const ok = (b: boolean) => b ? "met" as const : "missed" as const;
  if (a.atLeast !== undefined || a.atMost !== undefined)
    return ok(x >= (a.atLeast ?? -Infinity) && x <= (a.atMost ?? Infinity));
  if (a.tolerance === undefined) return "missed";
  const d = Math.abs(x - a.want);
  return ok(Math.abs(a.want) > 1e-12 ? d / Math.abs(a.want) <= a.tolerance : d <= a.tolerance);
};

/** the target, said the way the band says it — for the note beside each measurement */
const bandOf = (a: NonNullable<Fact["analogue"]>) =>
  a.atLeast !== undefined && a.atMost !== undefined ? `${a.atLeast} to ${a.atMost}`
  : a.atMost !== undefined ? `at most ${a.atMost}`
  : a.atLeast !== undefined ? `at least ${a.atLeast}`
  : `${a.want} ± ${(a.tolerance ?? 0) * 100}%`;

/**
 * §1 THE LEDGER ITSELF — a structural check, and it is not a formality.
 *
 * Two rules it exists to enforce. A NUMBER WITHOUT A SOURCE IS NOT ALLOWED, because a
 * remembered constant is a target that can be met by accident. AND AN `analogue` MUST NAME
 * A BAND, because a probe with no band is a diagnostic wearing a target's clothes — this
 * suite has the `judge` machinery to catch that and there is no reason not to use it.
 */
export const ledger = test({
  id: "ledger/shape",
  claims: "every number in the ledger is sourced, every analogue is falsifiable, and the " +
    "coverage across seven levels is what it is",
  under: { "G": "holds" },
  exact: true,                    // the file's own structure: no box, no ticks, no seeds
  run: (_ctx, theory) => {
    const w = new World({ theory, N: 5 });

    const unsourced = LEDGER.filter(f => f.value !== undefined && !f.source);
    const unbanded = LEDGER.filter(f =>
      f.analogue && f.analogue.tolerance === undefined &&
      f.analogue.atLeast === undefined && f.analogue.atMost === undefined);
    const levels = new Set(LEDGER.map(f => f.level));

    return {
      header: headerOf(w),
      findings: [
        judge({
          name: "facts with a value and no source",
          value: unsourced.length,
          expect: {
            of: "0 — nothing here is remembered", want: 0, tolerance: 0,
            because: "a constant taken from memory is a target that can be met by accident, " +
              "and the whole use of this file is that it cannot be",
          },
          note: unsourced.length ? unsourced.map(f => f.id).join(", ") : undefined,
        }),
        judge({
          name: "analogues with no band",
          value: unbanded.length,
          expect: { of: "0 — a probe with no band is not a target", want: 0, tolerance: 0,
            because: "the difference between a target and a diagnostic is whether it can " +
              "fail, and this suite already has the machinery to say so" },
        }),
        judge({
          name: "levels covered", value: levels.size,
          expect: { of: "8 — the lattice and the seven above it", want: 8, tolerance: 0,
            because: "a ledger with a level missing cannot say where the model stops" },
        }),
        judge({
          name: "facts the model already has", value: at("has"),
          expect: { of: "a real count, and it is the smallest of the five", want: 10, atLeast: 10,
            because: "these are the entries that are already checkable, and every one of " +
              "them names where in this suite it is checked" },
          note: "each one names where in this suite it is measured",
        }),
        judge({
          name: "facts refuted outright", value: at("refuted"),
          expect: {
            of: "the model's standing predictions AGAINST the world",
            want: 4, atLeast: 1, atMost: 8,
            because: "these are the only entries that can kill it. Zero would mean the model " +
              "says nothing; a great many would mean it is already dead",
          },
          note: LEDGER.filter(f => f.reach === "refuted").map(f => f.id).join(", "),
        }),
        judge({
          name: "facts needing a second scale",
          value: at("needs-scale"),
          expect: {
            of: "a real count — and it is NOT the largest class overall",
            want: 11, atLeast: 6,
            because: "the guess when this file was written was that a missing second scale " +
              "would be the commonest diagnosis. IT IS NOT: `needs-above` is, by more than " +
              "two to one, and that is the more encouraging answer — most of what matter " +
              "does is missing because the LEVELS have not been built, which is the ordinary " +
              "condition of every theory, rather than because the rules cannot express it",
          },
        }),
        judge({
          name: "facts needing a level that does not exist",
          value: at("needs-above"),
          expect: {
            of: "the largest class", want: at("needs-above"),
            atLeast: at("needs-scale") + 1,
            because: "nobody derives chemistry from the strong coupling either. A fact " +
              "filed here is not evidence against the model; a fact filed under " +
              "`needs-scale` or `refuted` is",
          },
        }),
        judge({
          name: "and where a SIZE is the thing — levels 2 and 6 — the share needing a scale",
          value: LEDGER.filter(f => (f.level === 2 || f.level === 6) && f.reach === "needs-scale").length
            / LEDGER.filter(f => f.level === 2 || f.level === 6).length,
          expect: {
            of: "over half — THIS is where the one diagnosis repeats",
            want: 0.56, atLeast: 0.5,
            because: "nuclear and bulk are the two levels whose whole content is a " +
              "characteristic SIZE, and a size is always two things competing. That the " +
              "missing-scale diagnosis concentrates exactly there, and not across the " +
              "ledger at large, is what makes it a diagnosis rather than a mood",
          },
        }),
      ],
      table: {
        columns: ["level", "what it describes", "facts", "has", "could", "needs-scale", "needs-above", "refuted"],
        rows: LEVELS.map(L => {
          const f = LEDGER.filter(x => x.level === L.n);
          const c = (r: Reach) => f.filter(x => x.reach === r).length;
          return [`${L.n} ${L.name}`, L.what, f.length,
            c("has"), c("could"), c("needs-scale"), c("needs-above"), c("refuted")];
        }),
      },
    };
  },
});

/**
 * §2 AND WHAT THE MATTER MODEL ACTUALLY GIVES, probe by probe.
 *
 * Every fact carrying an `analogue` names one number the model can produce and the band
 * that number would have to be in for the fact above it to be recoverable AT THIS LEVEL.
 * None of them asks for the electron's mass. They ask the prior questions — is there a
 * preferred size at all, is a structure a body or is it dust, does charge track mass — and
 * those are the ones an answer at the level above would have to be built on.
 *
 * IT IS DECLARED AS FAILING AND THAT IS THE POINT. `under` says what is expected, and what
 * is expected here is that most of these miss. A ledger whose targets were all met on the
 * day it was written would be a ledger of things somebody already knew.
 */
export const recovered = test({
  id: "ledger/recovered",
  claims: "what the matter model gives against what matter does, at the levels where the " +
    "two can be compared at all",
  cited: ["everything moves at c, and mass is what turns around"],
  under: { "G^XOR^c": "holds" },
  run: (ctx, theory) => {
    /*
     * OVER SEEDS, AND THE READINGS ARE KEPT RATHER THAN THE NUMBERS.
     *
     * `ctx.over` runs a function per seed and reduces to one statistic, which is right when
     * there is one statistic. Here there are fourteen probes off the same run, and asking
     * `over` fourteen times would build fourteen worlds per seed to answer questions one
     * world already answers. So the worlds are built once and every probe is taken across
     * the same readings — which also means the probes are CORRELATED in the way they
     * actually are, rather than each being told about a different world.
     */
    const b = ctx.budget({ N: 1, T: 90, seeds: 3 });
    const runs = ctx.once(() => b.seeds.map(seed =>
      readingOf(theory, { N: b.N, seed, ticks: b.T })))();

    /** a probe across the seeds — the value and what it moved by */
    const spread = (f: (r: Reading) => number) => {
      const xs = runs.map(f).filter(Number.isFinite);
      return { value: xs.length ? mean(xs) : NaN, err: xs.length > 1 ? sd(xs) : undefined };
    };

    const ts = runs.map(tradeoff);
    const withProbes = LEDGER.filter(f => f.analogue);
    const w = new World({ theory, N: 1 });
    const total = (f: (x: Reading) => number) => mean(runs.map(f));

    const scored = withProbes.map(f => {
      const a = f.analogue!;
      const { value, err } = spread(a.probe);
      return { f, a, value, err, verdict: met(a, value) };
    });

    return {
      header: headerOf(w),
      findings: [
        /*
         * THE SCOREBOARD, AND IT IS THE ONLY JUDGED THING HERE — see `met`. Everything
         * below it is a measurement carrying its own verdict, because a target this model
         * is not expected to meet yet is not a failing test, it is the file's whole point.
         */
        judge({
          name: `TARGETS MET, of ${scored.filter(x => x.verdict !== "unresolved").length} asked`,
          value: scored.filter(x => x.verdict === "met").length,
          expect: {
            of: "no fewer than are met today — the ratchet",
            want: 2, atLeast: 2,
            because: "the ledger is a list of things matter does that this model mostly " +
              "cannot yet do, so most of these miss and that is the file working rather " +
              "than failing. What must never happen is meeting FEWER, and that is what " +
              "this line is for: raise the floor whenever a rule earns it",
          },
          note: scored.filter(x => x.verdict === "met").map(x => x.f.id).join(", ") || "none",
        }),
        judge({
          name: "targets that could not be measured at all",
          value: scored.filter(x => x.verdict === "unresolved").length,
          expect: {
            of: "questions the model could not take, as opposed to ones it got wrong",
            want: 0, atMost: 3,
            because: "a probe that returns nothing has not refuted anything, and counting " +
              "it as a miss puts a claim in the measurement's mouth. Where this is above " +
              "nought the reason is upstream of the target — a fit with no population to " +
              "fit, a correlation with two points",
          },
          note: scored.filter(x => x.verdict === "unresolved").map(x => x.f.id).join(", ") || "none",
        }),
        ...scored.map(x => ({
          name: `${x.verdict === "met" ? "✓" : x.verdict === "unresolved" ? "?" : "·"} ${x.a.name}`,
          value: x.value,
          err: x.err,
          note: `${x.f.id} — wants ${bandOf(x.a)}; ` +
            `${x.verdict === "met" ? "MET" : x.verdict === "unresolved"
              ? "COULD NOT BE MEASURED" : "missed"}. ` +
            (x.f.scales ? `Two scales: ${x.f.scales[0]} against ${x.f.scales[1]}. ` : "") +
            x.a.because,
        })),
        { name: "v — RELATIVE velocity: net displacement over path",
          value: mean(ts.map(x => x.v)), err: sd(ts.map(x => x.v)),
          note: "what got through. 1 is massless; 0 is motion that closed. The underlying " +
            "speed is c either way and is not what this measures" },
        { name: "1 − v² — what is left to cross with (QUADRATURE)",
          value: mean(ts.map(x => x.across)), err: sd(ts.map(x => x.across)),
          note: "the quantity to be split. Squared because along and across are orthogonal " +
            "components of ONE step of fixed length — `budget/what-a-tick-is-spent-on`, " +
            "which is also where the Lorentz factor comes from" },
        { name: "   m — of that, lost in the open (MASS)",
          value: mean(ts.map(x => x.m)), err: sd(ts.map(x => x.m)),
          note: "inertia — (1 − v²)·(1 − shadow). Derived, not fitted: see mass.budget" },
        { name: "   b — of that, lost inside matter (BINDING)",
          value: mean(ts.map(x => x.b)), err: sd(ts.map(x => x.b)),
          note: "NOT weight — (1 − v²)·shadow. This is the MASS DEFECT: more binding is " +
            "LESS mass, which is the right way round and is why something can be at rest " +
            "and still be light" },
        { name: "the shadow: blocked / (blocked + split)",
          value: mean(runs.map(shadow)), err: sd(runs.map(shadow)),
          note: "THE SAME QUANTITY BY A ROUTE THAT KNOWS NOTHING ABOUT TRAJECTORIES — the " +
            "expansion matter suppressed, which is the gravity of this model. It answers " +
            "to `inside` below, not to b: both are shares of a COUNT, while b is that " +
            "share times the step left to divide" },
        { name: "share of all bending that happened inside matter",
          value: mean(ts.map(x => x.inside)), err: sd(ts.map(x => x.inside)),
          note: "COMPARE WITH THE SHADOW ABOVE — the two independent routes, and the claim" },
        { name: "bends per step — an event RATE, not a fraction",
          value: mean(ts.map(x => x.bends)), err: sd(ts.map(x => x.bends)),
          note: "kept, and kept labelled: reading this as a share of the budget is exactly " +
            "the units error that made m + v miss by 0.21" },
        { name: "…of which ring steps (steer alone)",
          value: mean(ts.map(x => x.ring)), err: sd(ts.map(x => x.ring)),
          note: "the cyclotron's share. The rest is the (G+M/3) reversal" },
      ],
      table: {
        columns: ["min path", "samples", "mean path", "v", "1−v²", "m", "b", "inside", "bends/step"],
        rows: [2, 4, 6, 8, 12, 16, 24, 32].map(least => {
          const xs = runs.map(x => tradeoff(x, least));
          const ok = xs.filter(x => Number.isFinite(x.v));
          if (!ok.length) return [least, 0, "—", "—", "—", "—", "—", "—", "—"];
          const f = (g: (x: typeof ok[0]) => number) => mean(ok.map(g));
          return [
            least, Math.round(f(x => x.lives)), f(x => x.path).toFixed(1),
            f(x => x.v).toFixed(3), f(x => x.across).toFixed(3),
            f(x => x.m).toFixed(3), f(x => x.b).toFixed(3),
            f(x => x.inside).toFixed(3), f(x => x.bends).toFixed(3),
          ];
        }),
      },
    };
  },
});

/**
 * §3 EVERY FACT IS COVERED BY SOMETHING, AND EVERY CITATION RESOLVES.
 *
 * WHAT "TESTING ALL SEVENTY-NINE" ACTUALLY MEANS, because it does not mean seventy-nine
 * probes. The facts are not one kind of thing and cannot take one kind of test:
 *
 *   a probe      the model produces a number and it is compared with a band. Twelve of them,
 *                and they are the only ones that measure anything here
 *   a citation   the measurement is elsewhere in this suite, so what is owed is a LINK -
 *                and a link is checkable: does that test exist, and did it hold
 *   a blocker    the question cannot be put yet, and the reason it cannot is itself a
 *                claim: name the fact that has to be met first. Twenty-nine facts become a
 *                dependency graph over askable ones rather than a shrug
 *
 * AND THE COVERAGE ITSELF IS THE TEST. A fact with none of the three is one nobody has to
 * think about, which is the only real way for a ledger to rot: not by being wrong, but by
 * quietly not applying to anything. This fails if any fact has none.
 *
 * WHY THE CITATIONS HAD TO BECOME IDS. They were prose - "transport, step", "species §4",
 * "the article's walk" - and sixteen of seventeen named nothing a machine could resolve. So
 * "the suite already measures this" was a claim the suite never made, and seventeen facts
 * counted as established on the strength of a sentence. Resolving them against the report
 * is cheap, catches a renamed or deleted test the day it happens, and turns the largest
 * category of unverified claims into the largest category of verified ones.
 */
/**
 * EVERY TEST ID IN THIS SUITE, READ OFF THE SUITE ITSELF.
 *
 * NOT A LIST KEPT HERE. A list kept here is a second copy of something that already exists,
 * and a second copy goes stale — which is precisely the failure this test was written to
 * catch, so keeping one would be the joke writing itself. The ids are declared in the test
 * files, so the test files are what is read.
 *
 * THE LEDGER IS SKIPPED, or it would cite itself into validity: its own facts are declared
 * with `id:` too, and a ledger fact is not a test.
 */
const suiteIds = (): Set<string> => {
  const here = dirname(fileURLToPath(import.meta.url));
  const out = new Set<string>();
  for (const f of readdirSync(here)) {
    if (!f.endsWith(".ts") || f === "ledger.ts") continue;
    for (const m of readFileSync(`${here}/${f}`, "utf8")
      .matchAll(/^\s+id: "([a-z0-9/._-]+)"/gm)) out.add(m[1]);
  }
  return out;
};

export const coverage = test({
  id: "ledger/coverage",
  claims: "every fact in the ledger is covered by a probe, a resolving citation, or a " +
    "named blocker — and no citation points at a test that does not exist",
  under: { "G": "holds" },
  exact: true,                    // the file's own structure against the suite's own ids
  run: (_ctx, theory) => {
    const w = new World({ theory, N: 5 });

    const known = suiteIds();
    const cited = LEDGER.flatMap(f => f.cites ?? []);
    const dangling = [...new Set(cited.filter(id => !known.has(id)))];

    const ids = new Set(LEDGER.map(f => f.id));
    const badBlockers = LEDGER.flatMap(f =>
      (f.blockedBy ?? []).filter(b => !ids.has(b)).map(b => `${f.id} -> ${b}`));

    const scoredIds: string[] = [];
    const covered = (f: Fact) =>
      !!f.analogue || !!(f.cites?.length) || !!(f.blockedBy?.length);
    const bare = LEDGER.filter(f => !covered(f));

    /*
     * WHAT THE GRAPH IS FOR, AND IT IS NOT BOOKKEEPING.
     *
     * Once every un-askable fact names what it waits on, two things fall out that no list
     * of facts could give. The GATES are the facts most of the ledger stands behind - work
     * on one of those moves everything above it, and work anywhere else moves one thing.
     * The FRONTIER is what would become askable the moment a gate is met, which is the only
     * honest way to say "what next" about a model that cannot yet be asked most questions.
     */
    const met = new Set(scoredIds);
    const reachable = (id: string, seen = new Set<string>()): string[] => {
      if (seen.has(id)) return [];
      seen.add(id);
      const f = LEDGER.find(x => x.id === id);
      return [id, ...(f?.blockedBy ?? []).flatMap(b => reachable(b, seen))];
    };
    const gates = new Map<string, number>();
    for (const f of LEDGER)
      for (const b of reachable(f.id).slice(1)) gates.set(b, (gates.get(b) ?? 0) + 1);
    const top = [...gates.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

    /* a chain that comes back to where it started can never be lifted */
    const cycles: string[] = [];
    for (const f of LEDGER) {
      const walk = (id: string, path: string[]): void => {
        if (path.includes(id)) { cycles.push([...path, id].join(" -> ")); return; }
        const x = LEDGER.find(y => y.id === id);
        for (const b of x?.blockedBy ?? []) walk(b, [...path, id]);
      };
      walk(f.id, []);
    }

    const byKind = {
      probe: LEDGER.filter(f => f.analogue).length,
      citation: LEDGER.filter(f => !f.analogue && f.cites?.length).length,
      blocker: LEDGER.filter(f => !f.analogue && !f.cites?.length && f.blockedBy?.length).length,
    };

    return {
      header: headerOf(w),
      findings: [
        judge({
          name: "facts with no test of any kind",
          value: bare.length,
          expect: {
            of: "0 — every fact answerable, cited, or blocked by a named one", want: 0,
            tolerance: 0,
            because: "a fact that is neither measured, nor pointed at a measurement, nor " +
              "waiting on a named prerequisite is one nobody has to think about. That is " +
              "how a ledger rots — not by being wrong but by ceasing to apply",
          },
          note: bare.length ? bare.map(f => f.id).join(", ") : undefined,
        }),
        judge({
          name: "citations naming no such test",
          value: dangling.length,
          expect: {
            of: "0 — every citation resolves against the suite's own ids", want: 0,
            tolerance: 0,
            because: "a citation that resolves to nothing is a claim with no measurement " +
              "behind it, and it reads exactly like one that has. This is the check that " +
              "makes `has` mean something",
          },
          note: dangling.length ? dangling.join(", ") : undefined,
        }),
        judge({
          name: "blockers naming no such fact",
          value: badBlockers.length,
          expect: { of: "0 — a dependency graph over facts that exist", want: 0, tolerance: 0,
            because: "a blocker pointing at nothing cannot ever be lifted" },
          note: badBlockers.length ? badBlockers.join(", ") : undefined,
        }),
        judge({
          name: "cycles in the dependency graph",
          value: cycles.length,
          expect: { of: "0 — a blocker chain has to end somewhere", want: 0, tolerance: 0,
            because: "two facts each waiting on the other can never be lifted, and reads " +
              "as ordinary work rather than as a mistake in the graph" },
          note: cycles.length ? cycles.join("; ") : undefined,
        }),
        judge({
          name: "facts in the ledger", value: LEDGER.length,
          expect: { of: "all of them accounted for", want: LEDGER.length, tolerance: 0,
            because: "the total the three kinds have to add up to" },
          note: `${byKind.probe} measured here · ${byKind.citation} measured elsewhere · ` +
            `${byKind.blocker} waiting on a named prerequisite`,
        }),
        {
          name: "THE GATE — facts standing behind the most others",
          value: top.length ? top[0][1] : 0,
          note: top.map(([id, n]) => `${id} (${n})`).join(" · ") +
            ". Work on the first of these moves everything above it; work anywhere else " +
            "moves one thing",
        },
      ],
      table: {
        columns: ["level", "facts", "probed", "cited", "blocked", "bare"],
        rows: LEVELS.map(L => {
          const f = LEDGER.filter(x => x.level === L.n);
          return [`${L.n} ${L.name}`, f.length,
            f.filter(x => x.analogue).length,
            f.filter(x => !x.analogue && x.cites?.length).length,
            f.filter(x => !x.analogue && !x.cites?.length && x.blockedBy?.length).length,
            f.filter(x => !covered(x)).length];
        }),
      },
    };
  },
});

export default [ledger, recovered, coverage];