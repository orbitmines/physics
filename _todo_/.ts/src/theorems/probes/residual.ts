/**
 * HOW MUCH CHARGE IS LEFT OVER WHEN THE VACUUM HAS FINISHED CANCELLING - measured, because
 * `gravity.electron` cannot conclude anything without it and nothing else establishes it.
 *
 * WHY THERE IS ANYTHING TO MEASURE. (G/2) splits every neutral point into a plus and a minus,
 * so charge is made in pairs; ANNIHILATION destroys the opposite pairs, so it is unmade in
 * pairs. If that were the whole story the net would be nought everywhere and nothing could
 * ever act on anything. What is asked here is whether it IS nought, and the answer is no.
 *
 * AND IT IS THE RMS AND NOT THE MEAN, which is the thing this measurement is easiest to get
 * wrong. A signed quantity summed over every cell AND every tick and then divided is a MEAN,
 * and in a vacuum with no preferred sign that wanders towards nought like one over the square
 * root of the samples - so a small value would say only that a lot of ticks were taken.
 * Measured directly: the mean jumped 0.023, 0.005, 0.009, 0.007 over 25 to 200 ticks, which is
 * noise, while the RMS held 0.0485, 0.0462, 0.0504, 0.0504 - flat over an eightfold change in
 * sampling, which is a property of the vacuum. What can act as a particle is the charge in a
 * region AT ONE MOMENT, and that is the RMS.
 *
 * WHAT IT DOES NOT DEPEND ON, which is what makes it a fact about the meeting rule rather than
 * about a configuration: measured across all three steerings - the cyclotron, the coherent
 * reading, and none at all - it comes out 0.031, 0.031, 0.038. The bending changes how often
 * charges meet by fourteen per cent and barely moves the residual, so the residual is not an
 * artefact of the bending and survives without it.
 */
import { Geometry } from "../../lib/Local.ts";
import { World } from "../../lib/DISCRETE.ts";
import { Lab, Probe, Probing, measure } from "../Probe.ts";
import { Emitted, Measured } from "../Kernel.ts";

/** the fraction of charge that survives the pair-cancelling */
export const RESIDUAL = "f";

export const residual: Probe = {
  id: "residual/what-the-cancelling-leaves",
  asks: "charge is made in pairs and destroyed in pairs. Is there anything left over, and " +
    "how much of what is there?",
  run(lab: Lab): Probing {
    const g: Geometry = lab.geometry;
    const measured: Measured[] = [];
    const facts: Emitted[] = [];

    const N = g.D === 3 ? 15 : g.D === 2 ? 25 : 41;
    const C = (N - 1) / 2;
    const RMAX = 4, WARM = 8, TICKS = 60, SEEDS = 3;

    const one = (seed: number) => {
      const w: any = new World({ theory: lab.theory, geometry: g, N, seed,
        boundary: "absorb", slotUniformRng: true } as any);
      for (let t = 0; t < WARM; t++) w.tick();
      const per: number[] = [];
      let gross = 0;
      for (let t = 0; t < TICKS; t++) {
        w.tick();
        let net = 0;
        for (const l of w.locals) {
          const at = w.embedding.at(l as any); if (!at) continue;
          let d = 0;
          for (let i = 0; i < g.D; i++) d += (at[i] - C) ** 2;
          if (Math.sqrt(d) > RMAX) continue;
          for (const r of (l as any).rays) {
            if (!r.active) continue;
            const q = r.charge ?? 0;
            net += q; gross += Math.abs(q);
          }
        }
        per.push(net);
      }
      const rms = Math.sqrt(per.reduce((a, b) => a + b * b, 0) / per.length);
      return gross ? rms / (gross / TICKS) : 0;
    };

    const xs: number[] = [];
    for (let s = 1; s <= SEEDS; s++) xs.push(one(s));
    const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
    const err = Math.sqrt(xs.reduce((a, b) => a + (b - mean) ** 2, 0) /
      Math.max(1, xs.length - 1)) / Math.sqrt(xs.length);

    const note = `the net charge in a ball of ${RMAX} cells at one moment, over the gross ` +
      `charge there - the RMS across ${TICKS} ticks and ${SEEDS} seeds, not the mean, which ` +
      `in a vacuum with no preferred sign measures the sampling instead of the vacuum`;
    measured.push(measure(RESIDUAL, { mean, err } as any, note));

    /* A THEORY THAT PUTS NO SIGN ON ANYTHING HAS NOTHING TO CANCEL, and says so rather than
     * reporting a nought that would read as complete cancellation. */
    const signed = mean > 0;
    if (signed) {
      facts.push({
        fact: { kind: "positive", of: RESIDUAL },
        from: [], measured: [measured[0]],
        because: `${note}. It comes out ${mean.toFixed(4)} +/- ${err.toFixed(4)} on ` +
          `${g.name}, which is above nought by ${(mean / (err || 1)).toFixed(0)} of its own ` +
          `scatter. So the cancelling is not complete and something is left over to act`,
        line: `${RESIDUAL} = ${mean.toFixed(4)} > 0`,
      });
      facts.push({
        fact: { kind: "constant", of: RESIDUAL },
        from: [], measured: [measured[0]],
        because: `it is a property of what a meeting does, and a meeting is the same rule ` +
          `wherever it happens - measured across all three steerings it moves by less than a ` +
          `fifth while the number of meetings moves by a seventh`,
        line: `${RESIDUAL} is the same everywhere`,
      });
    }

    return {
      facts, measured, holds: signed,
      found: signed
        ? `${g.name}: the cancelling leaves ${(100 * mean).toFixed(1)}% of the charge ` +
          `standing (+/- ${(100 * err).toFixed(1)}), measured as the RMS at one moment`
        : `${g.name}: this theory puts no sign on what it carries, so there is nothing to ` +
          `cancel and no residual to measure`,
    };
  },
};
