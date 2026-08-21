/**
 * WHY A TURN TAKES THE SAME NUMBER OF STEPS HOWEVER MANY DIMENSIONS THERE ARE.
 *
 * THE PUZZLE IS THAT THE OTHER COUNTS GROW AND THIS ONE DOES NOT. DEG is 3^D - 1 on a
 * full neighbourhood and SHEET is 3^(D-1) - 1; both run away with the dimension. CYCLE
 * does not: it is 4 on cubic-6, 6 on fcc-12, 8 on cubic-26, and adding a fourth dimension
 * would not touch it. The article asks why, and the answer is a counting one.
 *
 * WHAT ACTUALLY TURNS IS ONE VECTOR, and one vector coming round sweeps a PLANE. A plane
 * has two dimensions in it and no more, however many the space has - so what a turn lives
 * in is min(D, 2), which is 2 for every lattice in this book above the line and stops
 * there for ever. CYCLE counts the exits lying in that plane, and a plane does not get
 * bigger when the space around it does.
 *
 * SO THE ANSWER IS THAT THE QUESTION HAS A CEILING IN IT. `slice` is min(D, 2), it is
 * already at its ceiling on any lattice with a plane in it, and CYCLE is a count of what
 * fits in that fixed slice rather than a count of the whole neighbourhood. On line-2
 * there is no plane at all, `slice` is 1, and there is nothing to turn - which the probe
 * reports as CYCLE 0 rather than as an error.
 */
import { Theorem } from "../Theorem.ts";
import { counts, CYCLE_Q, DEG_Q, DIM_Q, SHEET_C, SLICE_Q } from "../probes/counts.ts";

export const turns: Theorem = {
  id: "lattice.turn",
  asks: "DEG and SHEET grow with the dimension. Why does the length of a turn not?",
  about: CYCLE_Q,
  probes: [counts],
  wants: [
    { kind: "value", of: CYCLE_Q, equals: { n: 0, d: 1 } },
    { kind: "value", of: SLICE_Q, equals: { n: 0, d: 1 } },
  ],
  glossary: {
    [CYCLE_Q]: { symbol: "CYCLE", says: "how many steps go round a turn" },
    [SLICE_Q]: { symbol: "slice", says: "how many dimensions a turn lives in - min(D, 2)" },
    [DEG_Q]: { symbol: "DEG", says: "the ways out of a point" },
    [SHEET_C]: { symbol: "SHEET", says: "how many charges one pulse lets go" },
    [DIM_Q]: { symbol: "D", says: "the lattice's dimension" },
  },
};
