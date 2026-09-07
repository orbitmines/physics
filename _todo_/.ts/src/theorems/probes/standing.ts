/**
 * THE MATTER WAVE, MEASURED OFF THE PHASE FIELD ITSELF - and nothing here knows the
 * closed form.
 *
 * `matter.wavelength` gets as far as the BEAT: a moving source has two retarded branches,
 * you do not know which side you are on, and to first order their difference is 2v. That
 * is the right shape and it is not yet a length. What a standing wave needs is the
 * SPACING between nodes, and getting one means building the phase field and looking.
 *
 * WHICH IS WHAT THIS DOES, and every ingredient is a rule this model already has:
 *
 *   A RAY CARRIES THE PHASE ITS EMITTER'S CLOCK HAD when it left, and then goes one cell
 *   a tick for ever. That is EMISSION and TRANSPORT, unchanged.
 *   THE EMITTER MOVES AT v BY SPENDING TICKS ON IT rather than on pulsing - the same
 *   budget `mass.period` divides.
 *   AND ITS CLOCK RUNS SLOW BY gamma, which `gravity.relativistic` derives from ray
 *   geometry rather than assuming.
 *
 * PUT TOGETHER, A LAB POINT IS REACHED BY TWO RAYS FROM ONE EMITTER - the one that set
 * out ahead of it and the one that set out behind. Solving the light cone for when each
 * left gives two emission times, they carry different phases, and two phases at one place
 * beat. THE TWO ROOTS ARE SOLVED AND THEN CHECKED against the condition they came from,
 * which is what makes this a derivation rather than a substitution.
 *
 * TWO LENGTHS COME OUT OF THE ONE CONSTRUCTION and that is the check that neither is an
 * accident of the algebra. The SUM of the phases carries the envelope and the DIFFERENCE
 * carries the carrier:
 *
 *     envelope  period  =  pi·lbar/(gamma·v)      which is HALF the de Broglie wavelength
 *     carrier   period  =  pi·lbar/gamma          which is the Compton one
 *
 * and their ratio is exactly 1/v, so the envelope is the longer by a factor the speed
 * alone sets - a fast carrier under a slow envelope, which is the textbook structure and
 * was not put in.
 *
 * NOTHING IS EVALUATED FROM THE CLOSED FORM. Printing the formula and calling it a
 * measurement would be circular, so the phase field is built numerically and its period
 * found by walking out until the phase has turned through 2*pi and then bisecting onto
 * the crossing. The closed form appears only at the end, as the thing the measured number
 * is divided by.
 *
 * AND IT ARRIVES ALREADY AS A HALF WAVELENGTH, which is the form a standing wave needs:
 * nodes are half a wavelength apart, so a region of a given size holds a WHOLE NUMBER of
 * them. That is the counting condition every bound state in this model rests on, and it
 * is why the probe is called `standing` rather than `de-broglie`.
 *
 * WHAT DOES NOT MOVE WITH THE LATTICE. There is no tiling in any of this beyond "a ray
 * goes one cell a tick": the retarded times are the light cone solved for a source moving
 * at v, and the periods are derivatives of a phase exactly linear in position. So unlike
 * every falloff in this folder these numbers are the same on line-2 and on fcc-12, to
 * every digit - which the probe reports rather than hides, because a quantity that does
 * not depend on the lattice is a different kind of claim from one that does.
 */
import { mul, num, sym } from "../Expr.ts";
import { rat } from "../Algebra.ts";
import { Lab, Probe, Probing, measure } from "../Probe.ts";
import { Emitted, Measured } from "../Kernel.ts";

/** the emitter's own rest wavelength - its clock period, and the unit of every length here */
export const LBAR = "\\bar{\\lambda}";
/** how much its clock is slowed by going */
export const GAMMA = "\\gamma";
/** how fast it is going, as a fraction of one cell a tick */
export const VEL = "v";
/** the spacing between nodes of the envelope - half the de Broglie wavelength */
export const HALFWAVE = "\\lambda_{dB}/2";
/** and the carrier under it, which is the Compton one */
export const CARRIER = "\\lambda_{C}";
/** pi, which is what a phase turning all the way round is counted in */
export const PI = "\\pi";

/** the speeds the two periods are measured at - four decades of them */
const SPEEDS = [0.001, 0.05, 0.5, 0.95];

const gammaOf = (v: number) => 1 / Math.sqrt(1 - v * v);

/**
 * THE TWO RETARDED EMISSION TIMES, as the two roots of the light cone.
 *
 * A source at v·t_e at time t_e emits a ray that goes one cell a tick; it reaches lab
 * position x at time t when the time it spent in flight equals the distance it had to
 * cover, t - t_e = |x - v·t_e|. The two signs of the modulus are the ray that left going
 * forward and the one that left going backward.
 */
const retarded = (x: number, t: number, v: number) => ({
  forward: (t - x) / (1 - v),
  backward: (t + x) / (1 + v),
});

/**
 * WHAT THE LIGHT CONE ACTUALLY DEMANDS, and each root is checked against ITS OWN branch.
 *
 * Testing both roots against the condition written with a modulus fails, and not because
 * the roots are wrong: the modulus conflates the two branches, and outside |x| < v·t the
 * branch that does not apply returns an emission time LATER than the arrival - a ray that
 * has not been sent yet.
 */
const coneResidual = (te: number, x: number, t: number, v: number, forward: boolean) =>
  Math.abs((t - te) - (forward ? x - v * te : v * te - x));

/** the two phases a lab point receives - each the emitter's own clock, slowed by gamma */
const phases = (x: number, t: number, v: number) => {
  const { forward, backward } = retarded(x, t, v);
  const g = gammaOf(v);
  return { sum: (forward + backward) / g, difference: (forward - backward) / g };
};

/**
 * THE SPATIAL PERIOD OF A PHASE, MEASURED: walk out in x until the phase has turned
 * through 2*pi, then bisect onto the crossing. Nothing in here knows the closed form.
 */
const periodOf = (phase: (x: number) => number) => {
  const target = phase(0) - 2 * Math.PI;                 // the phases run DOWN with x
  let lo = 0, hi = 1e-6;
  for (let k = 0; k < 200 && phase(hi) > target; k++) hi *= 2;
  if (phase(hi) > target) return NaN;
  for (let k = 0; k < 200; k++) {
    const mid = (lo + hi) / 2;
    if (phase(mid) > target) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
};

export const standing: Probe = {
  id: "standing/what-two-branches-leave",
  asks: "a moving emitter's forward and backward rays reach one place having left at " +
    "different times, so they beat. How far apart are the nodes of that beat, and how " +
    "far apart the carrier under them?",
  run: (lab: Lab): Probing => {
    const measured: Measured[] = [];
    const facts: Emitted[] = [];

    /* any lab time: the periods do not depend on it, which is part of what makes them
     * periods rather than a transient */
    const t = 1000;
    const LBAR_UNITS = 1;

    /* §1 - do the two roots solve the cone they came from */
    let worstCone = 0;
    for (const v of SPEEDS) for (const x of [-30, -7, 0.5, 12, 44]) {
      const { forward, backward } = retarded(x, t, v);
      worstCone = Math.max(worstCone,
        coneResidual(forward, x, t, v, true),
        coneResidual(backward, x, t, v, false));
    }

    /*
     * AND AT REST THERE IS NO PATTERN - which is the claim that makes this a wavelength
     * that depends on momentum before any period has been measured.
     *
     * NOT because the two emission times coincide: at rest they are t - x and t + x and
     * differ by 2x. What coincides is that their SUM stops depending on x at all, and the
     * sum is what the envelope is built from. Measured both ways so the looser phrasing
     * cannot pass.
     */
    const restVariation = Math.abs(phases(40, t, 0).sum - phases(-40, t, 0).sum);
    const moveVariation = Math.abs(phases(40, t, 0.5).sum - phases(-40, t, 0.5).sum);

    /* §2 and §3 - the two periods, measured off the field */
    const rows = SPEEDS.map(v => {
      const g = gammaOf(v);
      return {
        v, g,
        envelope: periodOf(x => phases(x, t, v).sum),
        carrier: periodOf(x => phases(x, t, v).difference),
        envelopeWant: Math.PI * LBAR_UNITS / (g * v),
        carrierWant: Math.PI * LBAR_UNITS / g,
      };
    });
    const worstEnvelope = Math.max(...rows.map(r =>
      Math.abs(r.envelope / r.envelopeWant - 1)));
    const worstCarrier = Math.max(...rows.map(r =>
      Math.abs(r.carrier / r.carrierWant - 1)));
    /* one construction, two lengths, and the ratio is 1/v exactly - the check that
     * neither of them is an accident of the algebra */
    const worstRatio = Math.max(...rows.map(r =>
      Math.abs((r.envelope / r.carrier) * r.v - 1)));

    measured.push(measure("worst light-cone residual", worstCone,
      "over both roots, four speeds and five places. The two retarded times are SOLVED " +
      "from t - t_e = |x - v·t_e| and then checked against it, each root against its own " +
      "branch - which is what makes the rest of this a derivation and not a substitution"));
    measured.push(measure("variation of the phase SUM across 80 cells, at rest",
      restVariation,
      `nought - no motion, no pattern. The two emission times do NOT coincide at rest, ` +
      `they differ by 2x; what coincides is that their sum stops depending on x, and the ` +
      `sum is the quantity the envelope is built from. At v = 0.5 the same span varies ` +
      `by ${moveVariation.toFixed(1)}, so MOTION IS WHAT MAKES A PATTERN`));
    measured.push(measure("worst |envelope period / (pi·lbar/(gamma·v)) - 1|", worstEnvelope,
      `over v = ${SPEEDS[0]} to ${SPEEDS[SPEEDS.length - 1]}. The period is bracketed off ` +
      `the numerically built phase field and only then divided by the closed form - ` +
      `nothing is evaluated from it`));
    measured.push(measure("worst |carrier period / (pi·lbar/gamma) - 1|", worstCarrier,
      "the same construction's other length, measured the same way"));
    measured.push(measure("worst |v · envelope/carrier - 1|", worstRatio,
      "the two lengths' ratio is 1/v exactly, so the envelope is the longer by a factor " +
      "the speed alone sets - a fast carrier under a slow envelope, which is the textbook " +
      "structure and is not something either measurement was aimed at"));
    for (const r of rows)
      measured.push(measure(`envelope period at v = ${r.v}`, r.envelope,
        `against pi·lbar/(gamma·v) = ${r.envelopeWant.toPrecision(6)}, with gamma = ` +
        `${r.g.toPrecision(6)}; the carrier there is ${r.carrier.toPrecision(6)} against ` +
        `${r.carrierWant.toPrecision(6)}`));

    const good = 1e-9;
    if (!(worstCone <= good && restVariation <= good &&
          worstEnvelope <= 1e-8 && worstCarrier <= 1e-8)) return {
      facts, measured, holds: false,
      found: `the two-branch construction did not come out: worst cone residual ` +
        `${worstCone.toExponential(2)}, worst envelope ${worstEnvelope.toExponential(2)}, ` +
        `worst carrier ${worstCarrier.toExponential(2)}. No node spacing follows`,
    };

    facts.push({
      fact: {
        kind: "equals", of: HALFWAVE,
        /* pi·lbar/(gamma·v) */
        to: mul(sym(PI), sym(LBAR), sym(GAMMA, -1), sym(VEL, -1)),
      },
      from: [],
      measured: [measured[0], measured[1], measured[2]],
      because: "a place is reached by two rays from one emitter - the one that set out " +
        "ahead of it and the one behind - and the two beat. The SUM of their phases " +
        "carries the envelope, and the spacing between its nodes is what a standing wave " +
        "is counted in. Measured by building the phase field and bracketing successive " +
        "turns of 2·pi, at four speeds over three decades, it is pi·lbar/(gamma·v) to " +
        `${worstEnvelope.toExponential(1)}. AT REST IT IS INFINITE - the sum stops ` +
        "depending on position at all - so motion is what makes a pattern, which is the " +
        "shape a length that depends on momentum has to have",
      line: `${HALFWAVE} = \\frac{${PI}·${LBAR}}{${GAMMA}·${VEL}}`,
    });

    facts.push({
      fact: {
        kind: "equals", of: CARRIER,
        to: mul(sym(PI), sym(LBAR), sym(GAMMA, -1)),
      },
      from: [],
      measured: [measured[3], measured[4]],
      because: "and the DIFFERENCE of the same two phases carries the carrier under that " +
        "envelope, at pi·lbar/gamma - one construction, two lengths, measured the same " +
        `way to ${worstCarrier.toExponential(1)}. Their ratio is 1/v exactly, to ` +
        `${worstRatio.toExponential(1)}, so the envelope is always the longer and by a ` +
        "factor the speed alone sets. Neither length is fitted and neither is assumed; " +
        "the second is here because a construction that gave only the one it was aimed at " +
        "would be a construction nobody should believe",
      line: `${CARRIER} = \\frac{${PI}·${LBAR}}{${GAMMA}}`,
    });

    return {
      facts, measured, holds: true,
      found: `the two branches beat, and the beat has two lengths in it: an envelope ` +
        `whose nodes are pi·lbar/(gamma·v) apart - half a de Broglie wavelength - under ` +
        `which runs a carrier of pi·lbar/gamma. Both bracketed off the phase field ` +
        `itself, to ${Math.max(worstEnvelope, worstCarrier).toExponential(1)} over four ` +
        `speeds, with the light cone solved and checked to ${worstCone.toExponential(1)}. ` +
        `NOTHING HERE IS ABOUT THE LATTICE: the only tiling fact used is that a ray goes ` +
        `one cell a tick, so these numbers are the same on every geometry in the sweep`,
    };
  },
};
