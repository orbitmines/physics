/**
 * THE VACUUM AS A POPULATION, MEASURED - and the three numbers that are not in
 * `vacuum.continuum`'s line.
 *
 * That theorem writes every rule as a term in how a density changes and stops there. Running it
 * as a population - `src/lib/Vacuum.ts`, weighted particles at continuous positions with the
 * grid holding nothing but the moments - turns up three things the term-by-term reading does
 * not say, and each of them decides whether a field gets out of the box at all:
 *
 *   THE BEAT     splitting and killing do not both happen every tick. They ALTERNATE, and a ray
 *                remembers which beat made it. So a ray meets facing opposites OF ITS OWN BEAT
 *                and passes straight through the rest, and the vacuum is two interleaved
 *                populations rather than one.
 *   THE FACING   a meeting is between a ray and what is coming the OTHER WAY, so the rate
 *                carries (1 - d^·j^)/2 against the opposing polarity's mean heading. Head-on is
 *                full rate and co-moving is none. In an unbiased vacuum j^ averages to nothing
 *                and the factor is a half.
 *   THE WEIGHT   `room = max(0, 1 - rho)` is CONVEX, so reading it off a Poisson count of one or
 *                two rays a cell biases it upward and the box settles above the fixed point. A
 *                particle therefore stands for a fraction of a ray.
 *
 * Everything here is measured off runs of the model with the source switched off, which is the
 * only setting in which "what the vacuum does on its own" means anything.
 */
import { Rules, World, gather, tick, world } from "../../lib/Vacuum.ts";
import { rat } from "../Algebra.ts";
import { Lab, Probe, Probing, measure } from "../Probe.ts";
import { Emitted, Measured } from "../Kernel.ts";

/** what the population settles at with nothing driving it */
export const RHO_INF = "\\rho_{\\infty}";
/** the facing factor a meeting carries, averaged over an unbiased vacuum */
export const FACING = "\\langle F\\rangle";
/** how much of the opposing polarity is on a ray's own beat, and so can kill it */
export const BEATSHARE = "\\beta";
/** what is left of a population after T ticks when the beats are collapsed into one */
export const ONEBEAT = "S_{1}";
/** and when they are not */
export const TWOBEAT = "S_{2}";
/** the settled density on a fine mean-field grid against a coarse one, SAMPLED THE SAME */
export const GRIDFREE = "\\rho^{fine}/\\rho^{coarse}";
/** and the same doubling with the weight left alone, which is the convexity bias by itself */
export const SAMPLING = "\\rho^{under}/\\rho";

const settle = (N: number, L: number, R: Rules, ticks: number, dt: number,
                collapse: boolean, seed: number, wt = 1/50): World => {
  const w = world(N, L, 3000000, wt);
  for (let t = 0; t < ticks; t++) {
    tick(w, R, dt, seed);
    /* ONE BEAT: every ray put on the same beat, so every facing opposite is a partner */
    if (collapse) w.ph.fill(0, 0, w.n);
  }
  gather(w);
  return w;
};

const meanRho = (w: World) => {
  let s = 0, k = 0;
  for (let c = 0; c < w.rho.length; c++) { s += w.rho[c]; k++; }
  return k ? s / k : 0;
};

export const population: Probe = {
  id: "population/what-the-rules-do-as-a-crowd",
  asks: "run every rule as a population of rays with continuous positions and no lattice " +
    "under them. Where does it settle, how much of what a ray faces can actually kill it, " +
    "and does anything in the answer come from the grid the moments are read on?",
  run: (lab: Lab): Probing => {
    const g = lab.geometry;
    const measured: Measured[] = [];
    const facts: Emitted[] = [];

    if (!g.CYCLE || g.CYCLE < 2 || g.D < 3) {
      return { facts, measured, holds: false,
        found: `${g.name} has no ring to turn on (CYCLE = ${g.CYCLE}, D = ${g.D})` };
    }

    const theta = 2 * Math.PI / g.CYCLE;
    const R: Rules = { theta, sigma: 1, tau: 1, nu: 1, stir: 1, shine: 0, makes: "polarity" };
    const DT = 0.25, T = 160;

    const w = settle(12, 6, R, T, DT, false, 20260829);
    const rho = meanRho(w);

    /* --- THE FACING FACTOR, over every living ray ---------------------------------------- */
    let fsum = 0, fn = 0, bsum = 0, bn = 0;
    const cells = w.N*w.N*w.N;
    for (let i = 0; i < w.n; i++) {
      const a = Math.floor((w.x[i]/w.L + 0.5)*w.N), b = Math.floor((w.y[i]/w.L + 0.5)*w.N),
            c = Math.floor((w.z[i]/w.L + 0.5)*w.N);
      if (a<0||b<0||c<0||a>=w.N||b>=w.N||c>=w.N) continue;
      const k = (a*w.N + b)*w.N + c;
      const ox = w.p[i] > 0 ? w.JMx[k] : w.JPx[k],
            oy = w.p[i] > 0 ? w.JMy[k] : w.JPy[k],
            oz = w.p[i] > 0 ? w.JMz[k] : w.JPz[k];
      fsum += 0.5*(1 - (w.ux[i]*ox + w.uy[i]*oy + w.uz[i]*oz)); fn++;
      /* how much of the opposing polarity shares this ray's beat - the rest cannot touch it */
      const all = w.p[i] > 0 ? w.rhoM[k] : w.rhoP[k];
      const mine = w.p[i] > 0 ? w.rhoMB[w.ph[i]*cells + k] : w.rhoPB[w.ph[i]*cells + k];
      if (all > 1e-12) { bsum += mine/all; bn++; }
    }
    const face = fn ? fsum/fn : 0, beat = bn ? bsum/bn : 0;

    /* --- WHAT COLLAPSING THE BEATS COSTS -------------------------------------------------- */
    const w1 = settle(12, 6, R, T, DT, true, 20260829);
    const rho1 = meanRho(w1);

    /*
     * --- AND WHETHER THE GRID THE MOMENTS ARE READ ON IS IN THE ANSWER ---------------------
     *
     * Twice as many cells a side is EIGHT TIMES the cells, so at the same particle weight each
     * one holds an eighth as many - and `room = max(0, 1 - rho)` is convex, so a thinner sample
     * reads it higher and the box settles higher. Doubling the grid alone therefore moves the
     * answer a great deal, and that is a statement about the SAMPLING and not about the model.
     * The test that means something holds the particles per cell fixed - the weight goes down
     * with the cell volume - and asks whether anything is left.
     */
    const wb = settle(24, 6, R, T, DT, false, 20260829);
    const rhob = meanRho(wb);
    const wf = settle(24, 6, R, T, DT, false, 20260829, 1/400);
    const rhof = meanRho(wf);

    const each: [string, number, string][] = [
      [RHO_INF, rho, `the population left to itself settles at ${rho.toFixed(3)} rays a unit ` +
        `volume - creation against the meetings, with nothing driving it and no source in the box`],
      [FACING, face, `a meeting is with what is coming the OTHER way, so the rate carries ` +
        `(1 - d^·j^)/2 against the opposing polarity's mean heading. In a vacuum with no bias ` +
        `that heading averages to nothing and the factor comes out at a HALF - which is not a ` +
        `coefficient anybody chose, it is what an isotropic crowd does`],
      [BEATSHARE, beat, `and only the opposites on a ray's OWN beat are partners: ` +
        `${(100*beat).toFixed(0)}% of the opposing polarity where it stands. The other half is ` +
        `invisible to it and it passes straight through, which is what lets anything cross a ` +
        `vacuum that would otherwise kill it where it was made`],
      [ONEBEAT, rho1 / (rho || 1), `WITH THE BEATS COLLAPSED INTO ONE the same rules settle at ` +
        `${(rho1/(rho||1)).toFixed(3)} of that. Every facing opposite is then a partner, the ` +
        `killing doubles against the same creation, and the population has to sit lower to pay ` +
        `for it - the beat is not bookkeeping, it moves where the vacuum IS`],
      [SAMPLING, rhob / (rho || 1), `DOUBLE THE GRID AND CHANGE NOTHING ELSE and the settled ` +
        `density moves to ${(rhob/(rho||1)).toFixed(3)} of the coarse one. Eight times the cells ` +
        `at the same weight is an eighth of the sample in each, and \`room = max(0, 1 - rho)\` ` +
        `is CONVEX, so a thinner sample reads more room than there is and the box creates its ` +
        `way above the fixed point. This is the measurement of that bias, not of the model`],
      [GRIDFREE, rhof / (rho || 1), `and the same doubling with the WEIGHT taken down by the ` +
        `cell volume, so each cell holds the same number of particles: ${(rhof/(rho||1)).toFixed(3)}. ` +
        `The positions were continuous throughout and the grid carries nothing but the moments, ` +
        `so once it is sampled well enough it is not in the answer - which is what makes this a ` +
        `continuum model with a grid in its implementation rather than a lattice model`],
    ];
    for (const [name, value, note] of each) {
      measured.push(measure(name, value, note));
      if (!Number.isFinite(value)) continue;
      facts.push({
        fact: { kind: "value", of: name, equals: rat(Math.round(value*1000), 1000) },
        from: [], measured: [measured[measured.length - 1]],
        because: note, line: `${name} = ${value.toFixed(3)}`,
      });
    }

    return {
      facts, measured, holds: true,
      found: `${g.name} (THETA ${(theta*180/Math.PI).toFixed(0)}deg): rho_inf ${rho.toFixed(3)}, ` +
        `facing ${face.toFixed(3)}, own-beat share ${beat.toFixed(3)}, ` +
        `one beat leaves ${(100*rho1/(rho||1)).toFixed(0)}%, ` +
        `grid doubled under-sampled ${(100*(rhob/(rho||1) - 1)).toFixed(0)}% but sampled the ` +
        `same ${(100*(rhof/(rho||1) - 1)).toFixed(1)}%`,
    };
  },
};
