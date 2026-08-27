/**
 * HOW A PREMISE IS OBTAINED — by running the theory and looking, never by declaring.
 *
 * A probe is a question put to a world rather than to a person. It builds the theory it
 * was handed on the lattice it was handed, ticks it, measures one thing, and comes back
 * with a fact and the numbers that fact is standing on — or with no fact at all, which
 * is a result and not a failure. `G^CONSERVING` destroys nothing, so its shadow probe
 * measures a shortfall consistent with zero and hands back nothing; the theorem about
 * the force is then not proved for that theory, and the prover names the missing
 * premise instead of reporting an exponent about a quantity that is not there.
 *
 * NOTHING HERE KNOWS WHAT IT IS LOOKING FOR. A probe measures a slope; it does not
 * check the slope against a number somebody expected. What it does with the slope is
 * SNAP it — see `snap` — and snapping is a statement about exactness, not about which
 * value is wanted: 1.97 ± 0.04 is either an exact count of the lattice or it is not a
 * law at all, and the prover would rather report a rational than pretend a fitted
 * decimal is a theorem.
 *
 * THE EXPONENTS ARE ESTABLISHED ACROSS DIMENSIONS, WHICH IS THE WHOLE TRICK. On one
 * lattice a measured slope of 2 is `2`, and it is also `D−1`, and it is also `D²−7`;
 * nothing in a single 3-dimensional run can tell those apart, and picking `D−1` because
 * it is the one that gives the answer we know is the circularity this folder exists to
 * avoid. So a probe that fits an exponent fits it on EVERY lattice it can afford —
 * line-2, square-4, cubic-6, fcc-12, which are D = 1, 2, 3, 3 — and fits the family
 * across them. `D−1` is then something the lattices said, and a slope that does not
 * track D comes back as the plain rational it measured.
 */
import { GEOMETRIES, Geometry, norm, sub, Vec } from "../lib/Local.ts";
import { World } from "../lib/Compat.ts";
import { stat, Stat } from "../lib/Report.ts";
import { exponent } from "../lib/Measure.ts";
import { Expo, expo, rat, rnum, eshow } from "./Algebra.ts";
import { Emitted, Measured, Store } from "./Kernel.ts";

/** what every probe is given: the theory under test, and what it may spend */
export type Lab = {
  theory: any;
  geometry: Geometry;
  N: number;
  T: number;
  seeds: number[];
  /**
   * A NAMED SETTING THAT IS NOT THE LATTICE - the transport law's regime, and anything
   * later that has one.
   *
   * It travels on the lab because it belongs in `under`: two runs that differ by it are
   * different results, and a page that did not say which regime it was showing would be
   * showing two answers and claiming one.
   */
  regime?: { name: string; says: string; thins?: unknown };
  /** how many further ticks the ledger is read across — see `shadow`'s header */
  /** the lattices an exponent is established across — D = 1, 2, 3, 3 */
  ladder: Geometry[];
  /** how far a probe may reduce the box when it drops to a cheaper lattice */
  boxFor(g: Geometry): number;
  say(line: string): void;
};

/**
 * A PICTURE A PROBE CAME BACK WITH - and the reason the prover needed one.
 *
 * EVERY OTHER THING THIS FOLDER EMITS IS A NUMBER OR A SENTENCE, and that is right for a
 * falloff: an exponent is the whole of what a falloff is, and drawing it would add
 * nothing a reader could not read off `r^{-2}`. It is exactly wrong for a SHAPE. The
 * thing an atom's electron does is not a number - it is where the centre of mass is
 * found, over the whole of a plane, and the only faithful statement of that is the
 * picture of it. A probe that measured a shell structure and reported only "3 nodes"
 * would be reporting the count and throwing away the claim.
 *
 * SO A FIGURE IS A MEASUREMENT LIKE ANY OTHER and travels the same road: emitted by the
 * probe that ran, carried into `proof.json`, written beside the page, and never drawn by
 * hand. It is SVG because SVG is text - it diffs, it needs no build, and it embeds in
 * the standalone page without a second file to lose.
 *
 * NOTHING IS DRAWN THAT WAS NOT COUNTED. The rule for a figure here is the rule for a
 * number: what is plotted must come out of the run that produced it, so a reader who
 * disbelieves the picture can find the array it was made from in `measured`.
 */
export type Figure = {
  /** what it is, in a few words - the caption's title */
  title: string;
  /** the picture itself: an `<svg>` element, self-contained, no external anything */
  svg: string;
  /** what a reader is looking at, and what was counted to make it */
  caption: string;
};

export type Probing = {
  /** the premises this probe is prepared to stand behind, and nothing else */
  facts: Emitted[];
  /** what it saw, whether or not it produced a fact */
  measured: Measured[];
  /** one line: what the run showed */
  found: string;
  /**
   * WHAT IT DREW, where the answer has a shape rather than a value - see `Figure`.
   *
   * Optional, and most probes have none: a probe that measures an exponent has nothing
   * to draw that the exponent does not already say.
   */
  figures?: Figure[];
  /** false when the theory did not do the thing — a stated result, not an error */
  holds: boolean;
};

export type Probe = {
  id: string;
  /** the question, as a question — printed above the numbers on the page */
  asks: string;
  run(lab: Lab): Probing;
};

export const LADDER = ["line-2", "square-4", "cubic-6", "fcc-12"]
  .map(n => GEOMETRIES[n]);

/**
 * THE EXACT EXPONENT A FITTED SLOPE IS, or the fitted slope if it is not an exact one.
 *
 * Given one slope per lattice, this asks whether they lie on a line in D. Two
 * dimensions of data fix the line, and the rest test it: fcc-12 and cubic-6 are both
 * D = 3 with different DEG, so a slope that is really about the tiling rather than
 * about the dimension shows up as those two disagreeing, and nothing is snapped.
 *
 * SNAPPING IS REFUSED RATHER THAN FORCED. If the line's coefficients are not within
 * tolerance of integers, or the residual across the lattices is worse than the
 * measurement error, the honest answer is the measured rational and the prover carries
 * an inexact exponent into the conclusion — which reads, correctly, as "this is not a
 * law about the dimension".
 */
export const snap = (
  points: { D: number; slope: number; err?: number }[], tol = 0.12,
): { expo: Expo; exact: boolean; residual: number } => {
  const mean = points.reduce((a, p) => a + p.slope, 0) / points.length;
  const Ds = points.map(p => p.D);
  const spread = Math.max(...Ds) - Math.min(...Ds);

  /* one dimension only — there is nothing to fit a line to, so the constant is all
   * that can honestly be claimed */
  if (spread === 0) {
    const k = Math.round(mean);
    const exact = Math.abs(mean - k) <= tol;
    return { expo: exact ? expo(k) : expo(rat(Math.round(mean * 12), 12)),
      exact, residual: Math.abs(mean - k) };
  }

  const mD = Ds.reduce((a, b) => a + b, 0) / Ds.length;
  let num = 0, den = 0;
  for (const p of points) { num += (p.D - mD) * (p.slope - mean); den += (p.D - mD) ** 2; }
  const a = den ? num / den : 0, b = mean - a * mD;
  const A = Math.round(a), B = Math.round(b);
  const residual = Math.max(...points.map(p => Math.abs(p.slope - (A * p.D + B))));
  const exact = Math.abs(a - A) <= tol && Math.abs(b - B) <= tol && residual <= tol * 2;

  return {
    expo: exact ? expo(B, { D: A }) : expo(rat(Math.round(mean * 12), 12)),
    exact, residual,
  };
};

/** a log-log slope with an error bar, over runs that each produced one profile */
export const slopeOf = (xs: number[], profiles: number[][]): Stat => {
  const fits = profiles.map(p => exponent(xs, p)).filter(x => isFinite(x));
  return fits.length ? stat(fits) : { mean: NaN, err: NaN, n: 0, saturated: false };
};

export const measure = (
  name: string, s: Stat | number, note?: string, unit?: string,
): Measured => typeof s === "number"
  ? { name, value: s, note, unit }
  : { name, value: s.mean, err: s.err, note, unit };

/** a world of this theory on this lattice, with nothing in it yet */
export const box = (lab: Lab, g: Geometry, N: number, seed: number, boundary: any = "absorb") =>
  new World({ theory: lab.theory, geometry: g, N, seed, boundary });

/** the centre of a box, which is where every body a probe places goes */
export const middle = (g: Geometry, N: number): Vec =>
  new Array(g.D).fill((N - 1) / 2);

/**
 * EVERY SITE OF THE WORLD, BY ITS DISTANCE FROM A CENTRE — the one walk every probe
 * here does, hoisted so a probe pays for it once.
 *
 * The bins are shells one cell thick, which is what a shell IS on a lattice: the sites
 * whose distance rounds to r. Sites belonging to a body are left out — a body is not
 * part of the medium the shadow travels through, and counting its own cells as shell
 * sites is how a deficit profile picks up the body's own radius as a feature.
 */
export const shells = (
  w: World, centre: Vec, rmax: number,
): { r: number; locals: any[]; at: Vec[] }[] => {
  const out = Array.from({ length: rmax + 1 }, (_, r) => ({ r, locals: [] as any[], at: [] as Vec[] }));
  for (const l of w.locals) {
    if ((l as any).source) continue;
    const p = w.embedding.at(l) as Vec | undefined;
    if (!p) continue;
    const d = norm(sub(p, centre)), r = Math.round(d);
    if (r < 1 || r > rmax) continue;
    out[r].locals.push(l);
    out[r].at.push(sub(p, centre));
  }
  return out.filter(s => s.locals.length);
};

/** what a local has had taken from it — the shortfall a shadow leaves, per the article */
export const gone = (l: any): number =>
  (l.rays as any[]).reduce((n, r) => n + (r.active ? 0 : 1), 0);

/** hand a probe's premises to the store, refusing any that arrived without numbers */
export const give = (s: Store, p: Probe, out: Probing) => {
  for (const f of out.facts) s.premise(f, p.id);
};

export const showExpo = eshow;
export const asNumber = rnum;
