/**
 * met(R) - the two densities multiplied together and summed along the line between them.
 *
 * THE INTEGRAND IS A PRODUCT OF TWO FALLOFFS, one from each body, at a point x along the
 * line joining them: what the near body puts there goes as 1/x² and what the far one puts
 * there goes as 1/(R-x)². Both are `gravity.falloff`, cited rather than counted again.
 *
 * THE `max` MAKES IT PIECEWISE, so it is cut in three. A shell is never smaller than the
 * cell its source sits in, so neither density keeps rising all the way in: inside a core
 * of c̄ the falloff flattens off. That gives two cores and a middle, and the article cuts
 * exactly there.
 *
 * THE CORES ARE WHERE IT LIVES. In the core at x = 0 the near density is capped at 1/c̄²
 * while the far one is 1/R² and barely moves across the core's width, so that region
 * contributes its width c̄ times 1/(c̄²R²) - which is 1/(c̄R²). The core at the far end is
 * the same by symmetry, and the middle is smaller than either once R is many cores wide.
 * So met(R) = 2/(c̄R²), and the whole R-dependence came out of the two ends.
 *
 * AND THE MIDDLE REGION IS NOT DROPPED. It was, at first, and that lost the most
 * interesting term in the law. Between the two cores the integrand is a genuine product
 * of two falling densities, and by partial fractions it splits into a part that goes as
 * an inverse square of the separation and a part that goes as one over it - and the
 * second of those integrates to a LOGARITHM.
 *
 * ADDED UP, THE (R - c̄) CANCELS. That is the article's own remark about this integral,
 * and it is what makes the answer clean: the cores carry a 1/(R - c̄) and the middle
 * carries the opposite one, so over a common denominator they go and what is left is a
 * plain power of R times a bracket:
 *
 *     met(R) = met_far · (1 + near)
 *
 * met_far is the far-field term - the inverse square that becomes Newton's law - and
 * `near` is the near-field correction, which carries c̄/R times the logarithm.
 *
 * BOTH ARE SUBSTITUTED THROUGH rather than left standing as names. They were named at
 * first, so that the bracket would survive on the page - and the cost was that anything
 * citing this theorem inherited an unopened symbol, so the assembled gravitational law
 * came out with `met_far` sitting in a denominator. The shape is recovered for display by
 * taking the common factor back out (see `factored`), which needs no symbol kept whole
 * and cannot go stale.
 *
 * THE CORRECTION DIES AWAY WITH RANGE:
 * at a few cells apart it is worth per cent, and at astronomical separations, where R is
 * a huge number of lattice steps, it is nothing at all. That is why the same law reads as
 * Newton's at one scale and does not at another, and it comes out of the geometry of the
 * integral rather than being put in.
 */
import { add, mul, num, sym } from "../Expr.ts";
import { Theorem } from "../Theorem.ts";
import { eadd, eneg, eshow, expo } from "../Algebra.ts";
import { counts, CBAR_Q } from "../probes/counts.ts";
import { Regime } from "./transport.ts";
import { lattice } from "../probes/lattice.ts";

/** what the integrand is worth inside a core - both densities, one of them capped */
export const IN_CORE = "the integrand in a core";
/** one core's contribution */
export const CORE = "one core";
/** the middle region, between the two cores */
export const MIDDLE = "the middle";
/** the part of the middle that goes as one over the separation - the log's home */
export const TAIL = "the middle's tail";
/** the far-field term - the inverse square that becomes Newton's law */
export const LONG = "met_{far}";
/** the near-field correction, which dies away with range */
export const SHORT = "near";
/** and the whole of it */
export const MET = "met(R)";

export const met: Theorem = {
  id: "met.integral",
  asks: "two bodies R apart. Adding the product of what each puts at every point along " +
    "the line between them, what does it come to - and how does that differ close up?",
  about: MET,
  probes: [counts, lattice],
  uses: ["transport.thinning"],
  wants: [{ kind: "equals", of: IN_CORE, to: [] }],
  glossary: {
    [MET]: { symbol: "met(R)", says: "the two densities multiplied and summed along the line" },
    [LONG]: { symbol: "met_{far}", says: "the far-field term - the inverse square that becomes Newton's" },
    [SHORT]: { symbol: "near", says: "the near-field correction, which dies away with range" },
    [CORE]: { symbol: "core", says: "what one end contributes" },
    [MIDDLE]: { symbol: "middle", says: "what the stretch between the cores contributes" },
    [TAIL]: { symbol: "tail", says: "the part of the middle going as one over the separation" },
    [IN_CORE]: { symbol: "integrand", says: "the integrand inside a core" },
    [CBAR_Q]: { symbol: "\\bar{c}", says: "the core - a shell is never smaller than its own cell" },
    R: { symbol: "R", says: "how far apart the two bodies are" },
    x: { symbol: "x", says: "where along the line between them" },
  },
};

export const definitions = (regime: Regime) => {
  /* the density thins as r̄^{-k}; -k is what each factor of it contributes */
  const minusK = eneg(regime.thins);
  return [
    {
      fact: {
        kind: "equals" as const, of: IN_CORE,
        to: mul(sym(CBAR_Q, minusK), sym("R", minusK)),
      },
      because: `inside the core at one end the near density has flattened off at its cap ` +
        `- a shell is never smaller than the cell its source sits in - while the far ` +
        `density barely moves across a width of one core. So the integrand there is the ` +
        `product of the two, neither depending on x any more. How fast each thins is the ` +
        `${regime.name} regime's: ${regime.says}`,
      line: `${IN_CORE} = \\bar{c}^{${eshow(minusK)}}·R^{${eshow(minusK)}}`,
    },
    {
      fact: {
        kind: "integral" as const, of: CORE, term: IN_CORE, in: "x",
        from: num(0), to: sym(CBAR_Q),
      },
      because: "one core runs from the body out to a distance of one core, and across it " +
        "the integrand is flat - so its contribution is that value times the width",
      line: `${CORE} = \\int_{0}^{\\bar{c}} ${IN_CORE} dx`,
    },
    {
      /*
       * THE MIDDLE'S OWN TAIL. Between the cores the integrand is a product of two
       * falling densities, and partial fractions split that into a piece going as the
       * inverse square of the separation and a piece going as one over it. The first sums
       * with the cores; the second is this, and it is where the logarithm comes from.
       */
      /*
       * ONE POWER OF R BELOW THE LEADING PART, which is the whole reason the correction
       * dies away. Partial fractions on 1/(x^k (R-x)^k) give a part carrying R^{-k} - that
       * is the one which sums with the cores into the long-range law - and a part carrying
       * R^{-(k+1)} against a single power of x. Written with R^{-1} instead, as it was at
       * first, the correction came out GROWING with separation, which is the opposite of
       * what a short-range term does and was wrong on its face.
       */
      fact: {
        kind: "equals" as const, of: TAIL,
        to: mul(sym("R", eadd(minusK, expo(-1))), sym("x", -1)),
      },
      because: "between the two cores the integrand is a genuine product of two falling " +
        "densities. By partial fractions that splits into a part carrying the same power " +
        "of the separation as the cores do - which sums with them - and this part, one " +
        "power of R further down and going as one over the distance along the line. It " +
        "is the second that gives the correction, and being a power lower is exactly why " +
        "the correction shrinks as the bodies are moved apart",
      line: `${TAIL} = R^{${eshow(eadd(minusK, expo(-1)))}}·\\frac{1}{x}`,
    },
    {
      fact: {
        kind: "integral" as const, of: MIDDLE, term: TAIL, in: "x",
        from: sym(CBAR_Q), to: sym("R"),
      },
      because: "the middle runs from the edge of one core to the edge of the other, and " +
        "one over x integrated between them is a logarithm - which grows more slowly " +
        "than any power, and is the whole of why the correction dies away",
      line: `${MIDDLE} = \\int_{\\bar{c}}^{R} ${TAIL} dx`,
    },
    {
      fact: { kind: "equals" as const, of: LONG, to: mul(num(2), sym(CORE)) },
      because: "there is a core at each end and they are the same by symmetry. Added to " +
        "the inverse-square part of the middle, the (R - \\bar{c}) that each carries cancels " +
        "over a common denominator - which is what makes the long-range law a plain " +
        "power of R with no trace of the core size left in its exponent",
      line: `${LONG} = 2 · ${CORE}`,
    },
    {
      fact: { kind: "equals" as const, of: MET, to: mul(sym(LONG), add(num(1), sym(SHORT))) },
      because: "so the whole of it is the long-range law times one plus a correction. " +
        "The one is what becomes Newton's inverse square; the correction is the middle's " +
        "logarithm over the long-range term, and it carries \\bar{c}/R - worth per cent at a " +
        "few cells and nothing at all once R is an astronomical number of lattice steps",
      line: `${MET} = ${LONG}·(1 + ${SHORT})`,
    },
    {
      fact: { kind: "quotient" as const, of: SHORT, over: MIDDLE, under: LONG },
      because: "the correction is what the middle's tail is worth against the long-range " +
        "law - a ratio of the two, and the thing that goes to nothing as R grows",
      line: `${SHORT} = \\frac{${MIDDLE}}{${LONG}}`,
    },
    {
      fact: { kind: "small" as const, of: SHORT },
      because: "the correction carries \\bar{c}/R times a logarithm, and a logarithm grows more " +
        "slowly than any power - so past a few cores it is small, and at astronomical " +
        "separations it is nothing",
      line: `${SHORT} << 1`,
    },
  ];
};
