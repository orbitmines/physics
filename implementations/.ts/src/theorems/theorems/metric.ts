/**
 * THE SAME COUNT, READ A SECOND TIME - and the second reading is the space part.
 *
 * `gravity.law` compares the direction that took an annihilation against the ones that did
 * not. That is a RATIO, and a ratio has no opinion about how many things it is a ratio
 * over: it throws away that the ways out of the point no longer number DEG. They number
 * DEG + n. Nothing was wrong with the first reading - it is the pull, and on its own the
 * article measures it at about a sixth of Mercury's perihelion advance - but it is one of
 * two readings of one count, and the other one is also there to be taken.
 *
 * WHAT THE SECOND READING GIVES IS A METRIC, and it needs no tensor: one number per place,
 * because at this order the spatial part is a scalar. The total having grown from DEG to
 * DEG + n is a stretching of the same size everywhere, which is what `B = 1 + 2u` says.
 *
 * AND THEN THE CORRECTION FALLS OUT AS THREE HALVES OF IT. What a path actually
 * accumulates goes as `B^(3/2)`, and three halves is not a number of times you can
 * multiply something by itself - so it is the binomial series, to first order, which is
 * where `δ = 3u` comes from. That is one line of algebra on a premise that was counted,
 * and it is the line the article says was missing when the pull alone gave a sixth.
 */
import { add, num, mul, sub, sym } from "../Expr.ts";
import { rat } from "../Algebra.ts";
import { Theorem } from "../Theorem.ts";
import { counts, DEG_Q } from "../probes/counts.ts";
import { COUNT, LEAN_N } from "./law.ts";

/** the potential, in the article's normalisation - what the second reading is 2 of */
export const U = "u";
/** the spatial part of the metric: the total, read as a stretch */
export const B_Q = "B";
/** what a path accumulates through it */
export const PATH = "B^{3/2}";
/** the correction that leaves */
export const DELTA = "δ";

export const metric: Theorem = {
  id: "gravity.metric",
  asks: "the lean threw away how many ways out there now are. Read that way instead, " +
    "what does the same count give?",
  about: DELTA,
  probes: [counts],
  uses: ["gravity.law"],
  wants: [
    { kind: "equals", of: B_Q, to: [] },
    { kind: "small", of: U },
  ],
  glossary: {
    [DELTA]: { symbol: "δ", says: "the correction the second reading leaves" },
    [B_Q]: { symbol: "B", says: "the spatial part - the total, read as a stretch" },
    [PATH]: { symbol: "B^{3/2}", says: "what a path accumulates through it" },
    [U]: { symbol: "u", says: "the potential" },
    [COUNT]: { symbol: "n", says: "how many annihilations have happened there" },
    [DEG_Q]: { symbol: "DEG", says: "the ways out of a point" },
    [LEAN_N]: { symbol: "lean", says: "the first reading - what a path leans by" },
  },
};

export const definitions = [
  {
    fact: { kind: "equals" as const, of: B_Q, to: add(num(1), mul(num(2), sym(U))) },
    because: "the ways out of the point number DEG + n rather than DEG, which over DEG " +
      "is 1 + n/DEG - the same everywhere, so one number per place and no tensor needed. " +
      "Written in the potential that is 1 + 2u, which is what u NAMES; the factor of two " +
      "is the normalisation the article carries, not a step",
    line: `${B_Q} = 1 + 2${U}`,
  },
  {
    /*
     * EXPANDED, and one of the few places that asks to be.
     *
     * Powers of sums are kept closed by default now - exact, and no truncation for
     * anything downstream to inherit. This is the case where the series IS the result:
     * the article's own line is delta = 3u, which is the first-order term and not a
     * closed form, and stating it as B^{3/2} - 1 would be true and would say nothing.
     */
    fact: { kind: "raised" as const, of: PATH, base: B_Q, to: rat(3, 2), expand: true },
    because: "what a path accumulates through the stretched space goes as B to the three " +
      "halves - and three halves is not a number of times you can multiply something by " +
      "itself, so the next line is a series rather than a product",
    line: `${PATH} = ${B_Q}^{3/2}`,
  },
  {
    fact: { kind: "small" as const, of: U },
    because: "the potential is small wherever this is being asked - far outside anything " +
      "dense - so its square is smaller still and the first order is the whole of it",
    line: `${U} is small`,
  },
  {
    fact: { kind: "equals" as const, of: DELTA, to: sub(sym(PATH), num(1)) },
    because: "the correction is what the path accumulates over and above flat space, " +
      "which is that quantity less one",
    line: `${DELTA} = ${PATH} - 1`,
  },
];
