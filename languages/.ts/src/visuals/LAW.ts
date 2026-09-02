/**
 * THE LAW, AS MEASURED — what a panel draws, without closing the rules to find out.
 *
 * `MODEL.ts` runs `Prove`: it closes `G.ts`, solves every balance and evaluates the force law.
 * That is a minute of work, it happens at IMPORT, and `RENDER.ts` builds its registry by
 * importing every visual — so a single panel reaching for it made every picture in the folder
 * wait for the prover, whether or not it drew anything derived.
 *
 * SO THE MODEL IS RUN ONCE, BY `tools/MEASURE.ts`, and what it said is read back here. The
 * curve is a few hundred pairs; between them it is interpolated in the logarithm, which is how
 * it is plotted and where it is smooth.
 */
import { measured } from "./DATA.ts";

const LAW = measured("law");
const A0 = (LAW.header as any).a0 as number;

/** the scale the model settles at, off the rules - the units its half of a picture is in */
export const a0 = () => A0;

/** and what the theory calls itself, as the measurement recorded it */
export const theory = () => ((LAW.header as any).theory ?? "G") as string;

/**
 * WHAT IS FELT, GIVEN WHAT ARRIVES — both in whatever units `a` is in.
 *
 * The measured curve is in the model's own units, so it is read at `gN/a` and handed back at
 * the same scale. That is what lets a panel put a model in lattice counts and a measurement in
 * metres on one pair of axes: each is in units of ITS OWN `a_0`, and the shape is what is
 * being compared.
 */
export const boost = (gN: number, a: number): number => {
  const { gN: xs, g: ys } = LAW.columns;
  const want = (gN / a) * A0;
  let lo = 0, hi = LAW.header.rows - 1;
  if (want <= xs[0]) return (ys[0] / A0) * a;
  if (want >= xs[hi]) return (ys[hi] / A0) * a;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (xs[mid] <= want) lo = mid; else hi = mid;
  }
  /* in the logarithm, because that is the axis it is drawn on and where it is straight */
  const t = (Math.log(want) - Math.log(xs[lo])) / (Math.log(xs[hi]) - Math.log(xs[lo]));
  return (Math.exp(Math.log(ys[lo]) + t * (Math.log(ys[hi]) - Math.log(ys[lo]))) / A0) * a;
};
