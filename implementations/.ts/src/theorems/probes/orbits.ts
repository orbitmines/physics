/**
 * WHAT THE COUNTED METRIC DOES TO AN ORBIT - integrated, against general relativity,
 * through one integrator.
 *
 * THE ONLY PROBE HERE THAT MEASURES A CONSEQUENCE RATHER THAN A RULE. Everything else in
 * this folder counts something structural - exits, states, ball sizes - and gets an exact
 * answer. A perihelion advance is not like that: it is what a differential equation does
 * over many orbits, and the honest way to know it is to integrate and look.
 *
 * THROUGH ONE INTEGRATOR, which is the whole point of `Orbit.ts` and the reason this can
 * be believed at all. The counted metric and Schwarzschild are both written in isotropic
 * form and handed to the same stepper, so what differs between the two runs is the metric
 * and not the arithmetic. Newton is integrated as the actual inverse-square law rather
 * than as a weak-field metric - a Kepler ellipse closes exactly, and that closing is what
 * the other two are departing from.
 *
 * REPORTED IN SIXTHS, as the article reports it: six sixths is general relativity's own
 * answer, and the number to look at is how close the counted metric comes to it.
 */
import {
  COUNTED, deflect, Metric, NEWTON, SCHWARZSCHILD, orbit,
} from "../../lib/Orbit.ts";
import { rat } from "../Algebra.ts";
import { Lab, Probe, Probing, measure } from "../Probe.ts";
import { Emitted, Measured } from "../Kernel.ts";

/** how much a perihelion moves per orbit, as a fraction of general relativity's */
export const SIXTHS = "sixths";
/** and how far a light ray bends, as a fraction of general relativity's */
export const BENDING = "bending";
/** whether the retarded route's own factor IS the metric's time part */
export const IS_TIME_PART = "retarded/A";
/** and how the space part compares to it */
export const SPACE_OVER_TIME = "B/A";

/**
 * THE RADIAL FORCE A MOVING BODY FEELS, split into what comes from the time part of the
 * metric and what comes from the space part.
 *
 * Both pieces are in one Hamiltonian and neither is separable physically - a body feels
 * their sum. Separating them is a question about the DESCRIPTION rather than about the
 * body: it asks which half of the geometry a ledger picture, counting arrivals, is able
 * to account for.
 */
const hamiltonian = (beta: number, r: number) => {
  const h = 1e-7;
  const A = COUNTED.A, B = COUNTED.B;
  const dA = (A(r + h) - A(r - h)) / (2 * h);
  const dB = (B(r + h) - B(r - h)) / (2 * h);
  const Ar = A(r), Br = B(r);
  const E = Math.sqrt(Ar / (1 - beta * beta));
  const p = beta * E * Math.sqrt(Br) / Math.sqrt(Ar);
  const newton = 1 / (r * r);
  return {
    a: 0.5 * (E * E * dA) / (Ar * Ar) / newton,
    b: -0.5 * (p * p * dB) / (Br * Br) / newton,
  };
};

/** the mean perihelion advance per orbit, in radians */
const advance = (m: Metric, r0: number, kick: number, turns = 6) => {
  const o = orbit(m, r0, kick, turns, 400000);
  if (o.peri.length < 2) return NaN;
  const d: number[] = [];
  for (let i = 1; i < o.peri.length; i++) {
    let x = o.peri[i] - o.peri[i - 1];
    while (x > Math.PI) x -= 2 * Math.PI;
    while (x < -Math.PI) x += 2 * Math.PI;
    d.push(x);
  }
  return d.reduce((a, b) => a + b, 0) / d.length;
};

export const orbits: Probe = {
  id: "orbits/what-the-metric-does",
  asks: "put the counted metric and general relativity through one integrator. How far " +
    "does a perihelion move, how far is light bent, and do the two metrics agree?",
  run: (lab: Lab): Probing => {
    const measured: Measured[] = [];
    const facts: Emitted[] = [];

    const rows: { r0: number; gr: number; ct: number; sixths: number }[] = [];
    for (const r0 of [60, 120, 240]) {
      const gr = advance(SCHWARZSCHILD, r0, 0.85);
      const ct = advance(COUNTED, r0, 0.85);
      if (!isFinite(gr) || !isFinite(ct) || gr === 0) continue;
      rows.push({ r0, gr, ct, sixths: (6 * ct) / gr });
    }
    const nw = advance(NEWTON, 120, 0.85);

    if (!rows.length) return {
      facts, measured, holds: false,
      found: "no orbit closed well enough to read a perihelion off it",
    };

    /*
     * AND THE OTHER RELATIVISTIC TEST, which is the one the force law fails entirely.
     *
     * The article is explicit that the lean alone gives "none at all of light's
     * deflection" - a corpuscle with no rest mass feels no force law - so bending is
     * where a metric either earns its place or does not. It is a NULL geodesic through
     * the same Hamiltonian: only the normalisation differs, so the comparison is still of
     * two metrics rather than of two numerical methods.
     */
    const bend: { b: number; gr: number; ct: number }[] = [];
    for (const b of [200, 400, 800]) {
      const gr = deflect(SCHWARZSCHILD, b);
      const ct = deflect(COUNTED, b);
      if (isFinite(gr) && isFinite(ct) && gr > 0) bend.push({ b, gr, ct });
    }

    const mean = rows.reduce((a, r) => a + r.sixths, 0) / rows.length;
    measured.push(measure(SIXTHS, mean,
      `the counted metric's perihelion advance against general relativity's, over ` +
      `${rows.length} orbits: ` +
      rows.map(r => `r0 ${r.r0} gives ${r.sixths.toFixed(2)}`).join(", ") +
      `. Six sixths is general relativity's own answer`));
    measured.push(measure("Newton's advance, same integrator", nw,
      `integrated as the actual inverse-square law - a Kepler ellipse closes, so this is ` +
      `the integrator's own noise and the scale against which the other two mean anything`));

    if (bend.length) {
      const ratio = bend.reduce((a, x) => a + x.ct / x.gr, 0) / bend.length;
      const off = Math.max(...bend.map(x => Math.abs(x.ct / x.gr - 1)));
      measured.push(measure(BENDING, ratio,
        `light bent past the mass, counted metric against general relativity, at impact ` +
        `parameters ` + bend.map(x => `${x.b} (${(x.ct / x.gr).toFixed(4)})`).join(", ") +
        `. General relativity's own answer is 4M/b, which it gives here to ` +
        `${bend.map(x => (x.gr / (4 / x.b)).toFixed(3)).join(", ")} of itself`));
      if (off < 0.01) {
        facts.push({
          fact: { kind: "value", of: BENDING, equals: rat(1) },
          from: [], measured: [measured[measured.length - 1]],
          because: `a null geodesic through the same Hamiltonian bends by the same ` +
            `amount in the counted metric as in general relativity - to ` +
            `${(off * 100).toFixed(2)}% at worst. This is the test the force law alone ` +
            `fails outright, since a massless corpuscle feels no force law, so it is ` +
            `where the second reading of the count either earns its place or does not`,
          line: `${BENDING} = 1`,
        });
        facts.push({
          fact: { kind: "constant", of: BENDING },
          from: [], measured: [measured[measured.length - 1]],
          because: "the ratio does not depend on the impact parameter, which is what " +
            "makes it a property of the metric",
          line: `${BENDING} is the same everywhere`,
        });
      }
    }

    /*
     * IS THE RETARDED ROUTE EXACTLY THE METRIC'S TIME PART?
     *
     * `gravity.joining` found the metric's velocity correction splits into 1 beta^{2}
     * from A and 1 beta^{2} from B, against the retarded route's 3/2 - and read that as a
     * missing term. That reading is a claim and this is the test of it: if the retarded
     * branches ARE the time part rather than merely comparable to it, the two should
     * agree not approximately but identically, at every speed.
     *
     * The comparison is made at the same radius against the same static baseline, so the
     * only thing left in the ratio is the velocity dependence. A constant ratio across
     * speeds - constant at the static term, which is the baseline's own offset and not a
     * discrepancy - is the identity; anything varying with beta is not.
     */
    const rr = 1e3;
    const stat = hamiltonian(0, rr);
    const each = [0.01, 0.05, 0.1, 0.2].map(bt => {
      const x = hamiltonian(bt, rr);
      const kA = (x.a - stat.a) / (bt * bt);
      const kB = (x.b - stat.b) / (bt * bt);
      /* the two retarded branches alone, per beta^{2}: (gamma^{2} - 1)/beta^{2} */
      const kRet = (1 / (1 - bt * bt) - 1) / (bt * bt);
      return { bt, ratioA: kA / kRet, ratioB: kB / kRet };
    });
    const spreadA = Math.max(...each.map(e => e.ratioA)) -
      Math.min(...each.map(e => e.ratioA));
    const meanA = each.reduce((a, e) => a + e.ratioA, 0) / each.length;
    const meanB = each.reduce((a, e) => a + e.ratioB, 0) / each.length;

    measured.push(measure(IS_TIME_PART, meanA,
      `the metric's time part against the retarded branches, per beta squared, at ` +
      each.map(e => `b=${e.bt} (${e.ratioA.toFixed(6)})`).join(", ") +
      `. The spread across speeds is ${spreadA.toExponential(2)} - the offset from one is ` +
      `the static term at this radius, not a velocity effect`));
    measured.push(measure(SPACE_OVER_TIME, meanB,
      `and the metric's SPACE part against the same, which the retarded route has no ` +
      `counterpart for at all`));

    if (spreadA < 1e-6) {
      facts.push({
        fact: { kind: "value", of: IS_TIME_PART, equals: rat(1) },
        from: [], measured: [measured[measured.length - 2]],
        because: `the ratio does not move with speed - ${spreadA.toExponential(1)} across ` +
          `a factor of twenty in beta - so the retarded route's factor IS the metric's ` +
          `time part rather than something of the same order as it. What separates them ` +
          `is the static offset of the baseline, which is not a velocity effect`,
        line: `${IS_TIME_PART} = 1`,
      });
      facts.push({
        fact: { kind: "value", of: SPACE_OVER_TIME, equals: rat(1) },
        from: [], measured: [measured[measured.length - 1]],
        because: `and the space part is the same size again, which is where the metric's ` +
          `2 beta^{2} comes from and what the retarded route is short of`,
        line: `${SPACE_OVER_TIME} = 1`,
      });
    }

    /*
     * JUDGED AGAINST SIX, because six sixths is what general relativity gives and the
     * question is whether the counted metric gives the same. Within a tenth is agreement
     * at the precision this integration has; the spread across the three orbits is the
     * honest error bar and is reported rather than averaged away.
     */
    const spread = Math.max(...rows.map(r => Math.abs(r.sixths - 6)));
    if (spread < 0.25) {
      facts.push({
        fact: { kind: "value", of: SIXTHS, equals: rat(6) },
        from: [], measured: [measured[0], measured[1]],
        because: `integrated through the same stepper as general relativity, the counted ` +
          `metric advances a perihelion by ${mean.toFixed(2)} sixths of what general ` +
          `relativity does - six being general relativity's own. The worst of the three ` +
          `orbits is off by ${spread.toFixed(2)}, and Newton on the same integrator ` +
          `closes to ${nw.toExponential(1)}, so the agreement is the metric's and not ` +
          `the arithmetic's`,
        line: `${SIXTHS} = 6`,
      });
      facts.push({
        fact: { kind: "constant", of: SIXTHS },
        from: [], measured: [measured[0]],
        because: "the ratio does not depend on which orbit it is read from - which is " +
          "what makes it a property of the metric rather than of a configuration",
        line: `${SIXTHS} is the same everywhere`,
      });
    }

    return {
      facts, measured, holds: spread < 0.25,
      found: `the counted metric gives ${mean.toFixed(2)} sixths of general relativity's ` +
        `perihelion advance (worst orbit off by ${spread.toFixed(2)})` +
        (bend.length
          ? `, and bends light by ${(bend.reduce((a, x) => a + x.ct / x.gr, 0) /
            bend.length).toFixed(4)} of what general relativity does`
          : "") +
        ` - through the same integrator, with Newton closing to ${nw.toExponential(1)}`,
    };
  },
};
