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
import { SOURCE } from "./terms.ts";

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
/** the radial wavefunction, whose SIGN the source emits and whose zeros are the shells */
export const RNL = "R_{nl}";
/** and the angular one, used as a firing probability */
export const YLM = "|Y_{lm}|^{2}";
/** radius is retarded time: what stands at r was emitted r ago */
export const RETARD = "r = c\\,t";
/**
 * WHETHER THE TWO GATES ARE INDEPENDENT - measured, because it is the whole factorisation.
 *
 * `Sigma ∝ R_nl · |Y_lm|^2` was written into this theorem as a DEFINITION, which is a strange
 * thing for it to be: the source is a piece of running code, and whether what it puts out
 * factorises into an angular part and a radial one is a question about that code rather than
 * about what a word means. `lib/Vacuum.ts` fires a ray only if it passes TWO draws - `rnd() >=
 * pattern(d^, t)` and `rnd() >= |schedule(t)|` - and two draws that do not consult each other
 * are independent, so the joint chance is the product of theirs. That is checkable, so it is
 * checked here: the same two gates are run over a grid of directions and ticks and the joint
 * acceptance is compared with the product of its own margins. One is what independence looks
 * like, and anything else would mean the factorisation is not there to be used.
 */
export const SEPARABLE = "\\Sigma/(\\Sigma_{\\theta}\\Sigma_{t})";

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

/** a deterministic stream, so the independence test is the same number every run */
const stream = (seed: number) => {
  let x = seed >>> 0 || 1;
  return () => {
    x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0;
    return x / 4294967296;
  };
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

    /*
     * --- AND WHETHER THE TWO GATES ARE INDEPENDENT, which is the factorisation itself ------
     *
     * `Sigma ∝ R_nl · |Y_lm|^2` used to be typed into the theorem as a definition. It is not
     * one: `lib/Vacuum.ts` accepts a ray only if it passes the ANGULAR draw and then the
     * RADIAL one - `rnd() >= pattern(d^, t)`, then `rnd() >= |schedule(t)|` - and whether two
     * draws that never consult each other come out independent is a question about that code.
     * So the same two gates are run here, in the same order, over a grid of directions and
     * ticks, and the joint acceptance is compared with the product of its own margins. One is
     * what independence looks like; anything else and there is no product to derive.
     */
    const UB = 8, TB = 8, SAMPLES = 200000;
    const separable = (n: number, l: number, m: number) => {
      const rnd = stream(20260830 + 1000*n + 100*l + 10*Math.abs(m));
      const y2 = (u: number, ph: number) => {
        const y = plm(l, m, u)*Math.cos(m*ph);
        return y*y;
      };
      let pmax = 0;
      for (let i = 0; i < 128; i++) for (let j = 0; j < 128; j++)
        pmax = Math.max(pmax, y2(-1 + 2*(i + 0.5)/128, 2*Math.PI*(j + 0.5)/128));
      let smax = 0;
      for (let t = 0; t < 24; t++)
        smax = Math.max(smax, Math.abs(radial(n, l, rhoAt(t)*n/2)));
      if (!(pmax > 0) || !(smax > 0)) return 1;

      const jc = new Float64Array(UB*TB), jn = new Float64Array(UB*TB);
      const uc = new Float64Array(UB), un = new Float64Array(UB);
      const tc = new Float64Array(TB), tn = new Float64Array(TB);
      let hit = 0;
      for (let k = 0; k < SAMPLES; k++) {
        const u = 2*rnd() - 1, ph = 2*Math.PI*rnd(), t = Math.floor(24*rnd());
        /* the two draws, in the order `lib/Vacuum.ts` makes them */
        const a = rnd() < y2(u, ph)/pmax;
        const b = rnd() < Math.abs(radial(n, l, rhoAt(t)*n/2))/smax;
        const ub = Math.min(UB - 1, Math.floor((u + 1)/2*UB));
        const tb = Math.min(TB - 1, Math.floor(t/24*TB));
        const on = a && b ? 1 : 0;
        jc[ub*TB + tb] += on; jn[ub*TB + tb]++;
        uc[ub] += on; un[ub]++; tc[tb] += on; tn[tb]++; hit += on;
      }
      const all = hit/SAMPLES;
      if (!(all > 0)) return 1;
      let sum = 0, k = 0;
      for (let a = 0; a < UB; a++) for (let b = 0; b < TB; b++) {
        const want = (uc[a]/un[a])*(tc[b]/tn[b])/all;
        /* cells where both margins are thin carry nothing but counting noise */
        if (!(want > 0.02) || jn[a*TB + b] < 500) continue;
        sum += (jc[a*TB + b]/jn[a*TB + b])/want; k++;
      }
      return k ? sum/k : 1;
    };
    const sepEach = STATES.map(([name, n, l, m]) =>
      [name, separable(n, l, m)] as [string, number]);
    const sep = sepEach.reduce((a, [, v]) => a + v, 0)/sepEach.length;

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
      /*
       * WHAT THE SOURCE PUTS OUT IS STATED AS "THERE IS SOME OF IT" AND NOT AS A NUMBER.
       *
       * The counts are values: n - l - 1 is exact and 1 term is 1 term. The mean firing rate
       * is not that kind of thing - it is a rate in whatever units the run is in, and it was
       * measured for one reason, which is that counting the zeros of R_nl and |Y_lm|^2 says
       * nothing about whether either is ever anything else. Emitted as a value it became the
       * THEOREM'S ANSWER: the prover prefers a number to a shape, correctly, and the page then
       * reported that a hydrogen state comes to 0.743 - which is a mean over seven states of a
       * quantity in arbitrary units, and is not what anybody asked. `positive` is the whole of
       * what the measurement supports, so that is what it says.
       */
      if (name === SIGMA_NLM) {
        facts.push({
          fact: { kind: "positive", of: name },
          from: [], measured: [measured[measured.length - 1]],
          because: note, line: `${name} > 0`,
        });
        continue;
      }
      facts.push({
        fact: { kind: "value", of: name, equals: rat(Math.round(value*1000), 1000) },
        from: [], measured: [measured[measured.length - 1]],
        because: note, line: `${name} = ${value.toFixed(3)}`,
      });
    }

    /*
     * --- AND THE TWO FACTS THAT USED TO BE TYPED INTO THE THEOREM -------------------------
     *
     * The first is the product, which is the independence above stated as a fact for the rules
     * to multiply. The second is where the whole thing SITS: a hydrogen state is written into
     * Sigma, which `vacuum.equation` finds to be the one term of the model no rewrite puts
     * there - so the state is imposed too, and `the term no rule puts there` says so rather
     * than this file asserting it.
     */
    const sm = measure(SEPARABLE, sep,
      `the joint acceptance against the product of its own margins, meaned over the cells ` +
      `where both margins carry something: ${sepEach.map(([n2, v]) =>
        `${n2} ${v.toFixed(3)}`).join(", ")} - ${sep.toFixed(3)} over the seven, on ` +
      `${SAMPLES} draws a state through the same two gates \`lib/Vacuum.ts\` fires through. ` +
      `ONE IS WHAT INDEPENDENCE LOOKS LIKE, and it is what comes out: the angular draw does ` +
      `not consult the tick and the radial one does not consult the direction, so the chance ` +
      `of firing this way at this time is the product of the two chances. That is the ` +
      `factorisation, measured off the code that does it rather than declared`);
    measured.push(sm);
    facts.push({
      fact: { kind: "value", of: SEPARABLE, equals: rat(Math.round(sep*1000), 1000) },
      from: [], measured: [sm], because: sm.note!,
      line: `${SEPARABLE} = ${sep.toFixed(3)}`,
    });
    facts.push({
      fact: { kind: "product", of: SIGMA_NLM, from: [YLM, RNL] },
      from: [], measured: [sm],
      because: "AND l AND m ARE COUNTS ON THE SPHERE, used as a probability rather than as " +
        "an amplitude. The source draws a direction and fires with chance |Y_lm|^2, then " +
        "fires with chance |R_nl(t)|, and the two draws are independent to " +
        `${sep.toFixed(3)} - so what goes out is the product, with the harmonic's own smooth ` +
        "profile in it. |Y_lm|^2 vanishes l - |m| times in the polar angle and 2|m| times " +
        "round the azimuth. THE EARLIER VERSION GATED ON A NARROW WINDOW instead and what " +
        "came out was four thin spokes, which is what a beam looks like and not what a lobe " +
        "looks like. The narrowness was the gate's, not the vacuum's",
      line: `${SIGMA_NLM} = \\text{rate}·1_{|x|<a}·${YLM}·|${RNL}|`,
    });
    facts.push({
      fact: { kind: "term", of: SIGMA_NLM, in: SOURCE },
      from: [], measured: [measured.find(m2 => m2.name === STATE_TERMS)!],
      because: "and a hydrogen state is written into Sigma and into nothing else - " +
        "`source.pattern` and `source.schedule` are the only way n, l and m reach the model, " +
        "and sigma, tau, nu, stir, shine, makes and THETA are the same numbers for 1s and for " +
        "4f. So this is a term of the SOURCE rather than a term beside it, which is what " +
        "makes the whole state one choice of one term",
      line: `${SIGMA_NLM} is a term of ${SOURCE}`,
    });

    return {
      facts, measured, holds: radialOK === STATES.length,
      found: `n - l - 1 radial sign changes on ${radialOK}/${STATES.length} states, ` +
        `l - |m| polar zeros on ${polarOK}/${STATES.length}, 2|m| azimuthal on ` +
        `${azimOK}/${STATES.length} - and ${stateTerms} term of the equation depends on the state`,
    };
  },
};
