/**
 * THE CONSTANT ITSELF - read off the tiling, as a number.
 *
 * `gravity.full` carries SHEET^{2}/DEG in front of the masses. This theorem asks what
 * that ratio IS on the lattice being run, and the answer is arithmetic on two counts:
 * 6^{2}/12 = 3 on fcc-12, 4^{2}/6 = 8/3 on cubic-6, 8^{2}/26 = 32/13 on cubic-26.
 *
 * THE SAME RATIO IN BOTH REGIMES, which is worth saying since everything else about the
 * assembled law depends on which is binding. What the transport regime changes is the
 * power of R and whether the c̄ cancels - not this. So the counts part of the constant is
 * a property of the tiling alone, and it is the part that can be asked about without
 * first asking how thick the medium is.
 *
 * WHY IT IS WORTH ITS OWN THEOREM. The whole claim the article makes about itself is that
 * its constants are counts rather than fitted parameters, and this is the line where that
 * is either true or it is not - there is nowhere left for a free number to hide. It also
 * makes the comparison across tilings concrete: the constant is not universal, it is the
 * lattice's, and a different tiling is a different gravity.
 *
 * WHERE THIS STOPS. The article goes one step further and reads the constant as a mass in
 * Planck masses, which turns it into kilograms. That step needs ħ and c in SI units and a
 * definition of the Planck mass - none of which is a count of anything - so it is named
 * here rather than attempted. What is derived is the number the lattice fixes; what is
 * borrowed to put it in kilograms is borrowed, and saying which is which is the point.
 */
import { Theorem } from "../Theorem.ts";
import { counts, DEG_Q, SHEET_C } from "../probes/counts.ts";

/** the constant in front of the inverse square, as this tiling fixes it */
export const G_Q = "G";
/** SHEET squared - the charges a pulse lets go, on both sides of a meeting */
export const SHEET2 = "SHEET^{2}";

export const ceiling: Theorem = {
  id: "gravity.constant",
  asks: "the assembled law carries SHEET^{2}/DEG in front of it, in either regime. What " +
    "is that ratio, on this lattice?",
  about: G_Q,
  probes: [counts],
  uses: ["gravity.full"],
  wants: [
    { kind: "value", of: SHEET_C, equals: { n: 0, d: 1 } },
    { kind: "value", of: DEG_Q, equals: { n: 0, d: 1 } },
  ],
  glossary: {
    [G_Q]: { symbol: "G", says: "the constant in front of the inverse square" },
    [SHEET2]: { symbol: "SHEET^{2}", says: "the charges a pulse lets go, on both sides" },
    [SHEET_C]: { symbol: "SHEET", says: "how many charges one pulse lets go" },
    [DEG_Q]: { symbol: "DEG", says: "the ways out of a point" },
  },
};

export const definitions = [
  {
    fact: { kind: "product" as const, of: SHEET2, from: [SHEET_C, SHEET_C] },
    because: "a meeting needs a charge from each side, so the pulse count enters twice",
    line: `${SHEET2} = ${SHEET_C} · ${SHEET_C}`,
  },
  {
    fact: { kind: "quotient" as const, of: G_Q, over: SHEET2, under: DEG_Q },
    because: "the assembled law carries SHEET^{2}/DEG in front of the masses and the " +
      "inverse square - so the constant is those two counts, divided. Both came off the " +
      "tiling, and there is nowhere in this line for a fitted number to be",
    line: `${G_Q} = \\frac{${SHEET2}}{${DEG_Q}}`,
  },
];
