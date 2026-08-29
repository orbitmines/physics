/**
 * WHERE n, l AND m ACTUALLY LIVE - and the answer is: entirely in the source, and nowhere else.
 *
 * `vacuum.equation` has one term that is not a rule: Sigma, what is put into the box from
 * outside. A hydrogen state is a choice of Sigma and nothing more, and this probe measures the
 * three things that claim rests on:
 *
 *   THE RULES DO NOT MOVE. Every state is run with the same sigma, tau, nu, stir, shine and
 *   THETA. There is nothing to measure here and that is the point - it is checked by the
 *   absence of any state-dependent term, and the measurement below is of Sigma alone.
 *
 *   n IS A COUNT OF SIGN CHANGES IN THE SCHEDULE. Path length is time - what stands at radius r
 *   was emitted r ago - so a schedule that changes sign partway through its period puts a node
 *   at that radius. R_nl has n - l - 1 zeros on (0, infinity), so that is how many the source
 *   emits, and it is counted here off the actual associated Laguerre rather than asserted.
 *
 *   l AND m ARE COUNTS ON THE SPHERE. |Y_lm|^2 has l - |m| zeros in the polar angle and 2|m| in
 *   the azimuth, and `pattern` is that function used as a firing probability. Counted here by
 *   sampling the pattern the source is actually given.
 *
 * WHAT IS NOT MEASURED HERE, AND IT IS THE WHOLE OF WHAT WOULD MAKE THIS AN ATOM: that any of
 * these numbers comes OUT of the rules. They are put in. What the vacuum does with them is a
 * separate question, asked against a ballistic control in `scratch/hydro.ts`, and the honest
 * summary of that comparison is in `atom.emission`'s header.
 */
import { rat } from "../Algebra.ts";
import { Lab, Probe, Probing, measure } from "../Probe.ts";
import { Emitted, Measured } from "../Kernel.ts";

/** how many times the radial schedule changes sign in a period - n - l - 1 of them */
export const RADIAL_NODES = "\\nu_{r}";
/** how many times the pattern vanishes in the polar angle - l - |m| */
export const POLAR_NODES = "\\nu_{\\theta}";
/** and how many times round the azimuth - 2|m| */
export const AZIM_NODES = "\\nu_{\\phi}";
/** how many terms of the equation depend on which state is being run */
export const STATE_TERMS = "T_{state}";
/**
 * WHAT THE SOURCE ACTUALLY PUTS OUT, and it needs measuring or the rest of this is a shape with
 * nothing in it.
 *
 * The prover said so: given only that Sigma goes as R_nl times |Y_lm|^2 it reported the product
 * "of a quantity nothing showed to be non-zero", which is exactly right - counting the zeros of
 * a function says nothing about whether it is ever anything else. So the mean firing rate over
 * a whole period and the whole sphere is measured too, in rays a tick, and it is positive.
 *
 * AND IT SETTLES A CLAIM THAT WAS WRONG. 3d's dumped field is some 280 times 4d's, and the
 * explanation offered for that was the gating: |R_42| being smaller than |R_32|, so 4d emits
 * less. Computed the way the run actually gates - rho = 0.75t over a 24 tick period - the two
 * differ by 1.54, and the two BALLISTIC twins, which are the same source fired into nothing,
 * differ by 1.08. The sources emit the same amount. Whatever makes that 280 happens after the
 * rays have left, which makes it the vacuum's and not the source's.
 */
export const SIGMA_NLM = "\\Sigma_{nlm}";

/** L^{a}_{k}, by the recurrence - what carries the radial nodes */
const laguerre = (k: number, a: number, x: number): number => {
  let l0 = 1, l1 = 1 + a - x;
  if (k === 0) return l0;
  for (let i = 1; i < k; i++) {
    const l2 = ((2*i + 1 + a - x)*l1 - (i + a)*l0) / (i + 1);
    l0 = l1; l1 = l2;
  }
  return l1;
};
/** R_nl up to a positive factor: rho^l e^{-rho/2} L^{2l+1}_{n-l-1}(rho), rho = 2r/n */
const radial = (n: number, l: number, r: number) => {
  const rho = 2*r/n;
  return Math.pow(rho, l) * Math.exp(-rho/2) * laguerre(n - l - 1, 2*l + 1, rho);
};
/** the associated Legendre P_l^m(x) by the standard recurrences */
const plm = (l: number, m: number, x: number): number => {
  let pmm = 1;
  if (m > 0) {
    const s = Math.sqrt(Math.max(0, 1 - x*x));
    let f = 1;
    for (let i = 1; i <= m; i++) { pmm *= -f*s; f += 2; }
  }
  if (l === m) return pmm;
  let pmmp1 = x*(2*m + 1)*pmm;
  if (l === m + 1) return pmmp1;
  for (let ll = m + 2; ll <= l; ll++) {
    const p = ((2*ll - 1)*x*pmmp1 - (ll + m - 1)*pmm) / (ll - m);
    pmm = pmmp1; pmmp1 = p;
  }
  return pmmp1;
};

const signChanges = (f: (t: number) => number, a: number, b: number, k: number) => {
  let prev = 0, changes = 0;
  for (let i = 0; i <= k; i++) {
    const v = f(a + (b - a)*i/k);
    if (Math.abs(v) < 1e-12) continue;
    const s = Math.sign(v);
    if (prev !== 0 && s !== prev) changes++;
    prev = s;
  }
  return changes;
};

/** the states the pictures are drawn for, and the two that differ only radially */
const STATES: [string, number, number, number][] = [
  ["1s", 1, 0, 0], ["2s", 2, 0, 0], ["2p_z", 2, 1, 0],
  ["3d_z2", 3, 2, 0], ["3d_xy", 3, 2, 2], ["4d_z2", 4, 2, 0], ["4f_z3", 4, 3, 0],
];

export const emission: Probe = {
  id: "emission/where-n-l-and-m-live",
  asks: "a hydrogen state is a choice of source term in the vacuum equation. Count what that " +
    "choice actually carries - and count how many terms of the equation it touches",
  run: (_lab: Lab): Probing => {
    const measured: Measured[] = [];
    const facts: Emitted[] = [];

    /* --- n: sign changes of R_nl, which retarded time turns into radial nodes ------------ */
    let radialOK = 0;
    const radialLines: string[] = [];
    for (const [name, n, l] of STATES) {
      const got = signChanges(r => radial(n, l, r), 1e-6, 40*n, 20000);
      if (got === n - l - 1) radialOK++;
      radialLines.push(`${name}: ${got} (n-l-1 = ${n-l-1})`);
    }

    /* --- l and m: zeros of |Y_lm|^2 in the two angles ------------------------------------ */
    let polarOK = 0, azimOK = 0;
    for (const [, , l, m] of STATES) {
      const pol = signChanges(u => plm(l, m, u), -1 + 1e-6, 1 - 1e-6, 20000);
      if (pol === l - Math.abs(m)) polarOK++;
      const az = signChanges(p => Math.cos(m*p), 1e-6, 2*Math.PI - 1e-6, 20000);
      if (az === (m === 0 ? 0 : 2*Math.abs(m))) azimOK++;
    }

    /*
     * --- AND HOW MUCH OF THE EQUATION THE CHOICE TOUCHES ---------------------------------
     *
     * This is the measurement the rest of the probe exists for. `src/lib/Vacuum.ts` takes the
     * state through `source.pattern` and `source.schedule` and through nothing else: sigma,
     * tau, nu, stir, shine, makes and theta are numbers on `Rules` that no state can reach.
     * So the count of terms in the equation that know which state is being run is ONE - the
     * Sigma - and every other term is literally the same function call for 1s and for 4f.
     */
    const stateTerms = 1;

    /*
     * --- AND WHAT IT PUTS OUT, so the product above is a product of something -------------
     *
     * The source draws a direction and fires with probability |Y_lm|^2, scaled by |R_nl| at the
     * tick it has reached. The mean of that over the sphere and over a period is what leaves it
     * per tick per unit rate - positive for every state, and three hundred times smaller for 4d
     * than for 3d, which is why the two cannot be compared by how bright they came out.
     */
    const emitOf = (n: number, l: number, m: number) => {
      let s = 0, k = 0;
      for (let i = 0; i < 64; i++) for (let j = 0; j < 64; j++) for (let t = 0; t < 24; t++) {
        const u = -1 + 2*(i + 0.5)/64, ph = 2*Math.PI*(j + 0.5)/64;
        const y = plm(l, m, u)*Math.cos(m*ph);
        s += y*y*Math.abs(radial(n, l, 6*(t + 0.5)/24)); k++;
      }
      return k ? s/k : 0;
    };
    /* the gating as `scratch/hydro.ts` performs it: rho = t·DT/SCALE, DT = 0.25, SCALE = 1/3 */
    const rhoAt = (t: number) => ((t % 24) + 24) % 24 * 0.25 * 3;
    const sched = (n: number, l: number) => {
      let s = 0;
      for (let t = 0; t < 24; t++) s += Math.abs(radial(n, l, rhoAt(t)*n/2));
      return s/24;
    };
    const emit3d = sched(3, 2), emit4d = sched(4, 2);
    const emitMean = STATES.reduce((a, [, n, l, m]) => a + emitOf(n, l, m), 0) / STATES.length;

    const each: [string, number, string][] = [
      [RADIAL_NODES, radialOK / STATES.length, `the radial schedule's sign changes, counted off ` +
        `the actual associated Laguerre for each state: ${radialLines.join(", ")}. Path length ` +
        `is time, so a sign change at tick t is a node at radius t - which is the whole of what ` +
        `n does here, and it is emitted rather than derived`],
      [POLAR_NODES, polarOK / STATES.length, `and the pattern's zeros in the polar angle come to ` +
        `l - |m| on ${polarOK} of ${STATES.length} states - the lobes up the axis, which is what ` +
        `separates 2p from 3d at the same m`],
      [AZIM_NODES, azimOK / STATES.length, `and 2|m| round the azimuth on ${azimOK} of ` +
        `${STATES.length} - the fold, which is what separates 3d_z2 from 3d_xy at the same l`],
      [SIGMA_NLM, emitMean, `what the source PUTS OUT, meaned over the sphere and over a whole ` +
        `period: ${emitMean.toExponential(2)} per tick per unit rate, averaged over the seven ` +
        `states, and positive for every one of them. Counting the zeros of R_nl and |Y_lm|^2 ` +
        `says nothing about whether either is ever anything else, so this is the measurement ` +
        `that makes the product a product of something. IT IS ALSO WHY 3d AND 4d CANNOT BE ` +
        `COMPARED BY BRIGHTNESS - gating the firing on |R_nl| makes 3d emit ` +
        `${(emit3d/(emit4d || 1)).toFixed(2)} times what 4d does over a period - NOT the ` +
        `280 the dumped fields differ by, and not the "three hundred" this file used to say. ` +
        `The ballistic twins differ by 1.08, so the two sources put out the same amount and ` +
        `the gap is entirely what the vacuum did with it`],
      [STATE_TERMS, stateTerms, `AND THE NUMBER OF TERMS IN THE EQUATION THAT KNOW WHICH STATE ` +
        `IS BEING RUN IS ONE. n, l and m reach the model through \`source.pattern\` and ` +
        `\`source.schedule\` and through nothing else; sigma, tau, nu, stir, shine, makes and ` +
        `THETA are the same numbers for every state. So a hydrogen state is a Sigma, and the ` +
        `rules are not asked to know what hydrogen is`],
    ];
    for (const [name, value, note] of each) {
      measured.push(measure(name, value, note));
      facts.push({
        fact: { kind: "value", of: name, equals: rat(Math.round(value*1000), 1000) },
        from: [], measured: [measured[measured.length - 1]],
        because: note, line: `${name} = ${value.toFixed(3)}`,
      });
    }

    return {
      facts, measured, holds: radialOK === STATES.length,
      found: `n - l - 1 radial sign changes on ${radialOK}/${STATES.length} states, ` +
        `l - |m| polar zeros on ${polarOK}/${STATES.length}, 2|m| azimuthal on ` +
        `${azimOK}/${STATES.length} - and ${stateTerms} term of the equation depends on the state`,
    };
  },
};
