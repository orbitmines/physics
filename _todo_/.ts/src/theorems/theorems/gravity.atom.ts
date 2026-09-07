/**
 * THE ATOM FROM TWO SENTENCES ABOUT GRAVITY, and nothing else put in.
 *
 * WHAT IS ALLOWED HERE. Two statements, both of them things this model already says about
 * gravity, and no counting condition, no de Broglie, no wave:
 *
 *   A SOURCE EMITS GRAVITY.  The deficit it makes goes out over a shell, and
 *   `lattice.shell-growth` counts a shell at STEP·r^(D-1) sites, so what any one place
 *   gets is the whole divided by that: g ∝ r^(1-D), which is 1/r^(2) on three dimensions
 *   and is not put in as an inverse square.
 *
 *   AND TURNING EMITS GRAVITY TOO.  `G^XOR^o` is explicit: "TURNING IS WHAT MAKES GRAVITY
 *   ... a ray that goes straight is somewhere else next tick and suppresses one split in
 *   passing, while a ray that comes back round holds the same neighbourhood down again and
 *   again", and `lib/Trajectory.ts` gives the count - "MASS IS HOW MANY POINTS ARE TURNING,
 *   which is the only count available". So mass is not a substance a thing has; it is the
 *   rate at which that thing is being bent.
 *
 * AND THE ONE PIECE OF ARITHMETIC BETWEEN THEM IS THE LATTICE'S OWN. Everything moves at one
 * cell a tick, always, so a closed curve of radius r is 2πr cells round and takes 2πr ticks;
 * a lap is CYCLE ring steps by `G^XOR^o`'s `laps`; therefore holding that curve costs
 * CYCLE/(2πr) ring steps a tick. THE TURN RATE A CURVE COSTS GOES AS ONE OVER ITS RADIUS,
 * and neither π nor CYCLE depends on which curve is being asked about.
 *
 * WHAT THAT LEAVES THE RULES TO DO is put the second sentence through the third: if mass
 * counts turning, and turning goes as 1/r, then mass goes as 1/r. Nothing here says what a
 * mass IS in kilogrammes and nothing needs to - what comes out is a relation between a
 * thing's mass and its size, which is the only form a scale-free model can produce.
 *
 * WHAT IS DELIBERATELY ABSENT, and it is the thing that would make a ladder. There is no
 * condition here that anything fit a whole number of times. `matter.debroglie` supplies one
 * and `atom.hydrogen` uses it; this theorem is asked WITHOUT it on purpose, to find out how
 * far the gravity sentences get on their own. If the answer has no n in it, that is the
 * finding: the two premises fix the SHAPE of the mass-size relation and leave which sizes
 * are allowed to whatever does the counting.
 */
import { expo } from "../Algebra.ts";
import { Theorem } from "../Theorem.ts";
import { counts, CYCLE_Q, DIM_Q } from "../probes/counts.ts";

/** what a source's gravity comes to at a distance */
export const PULL = "g";
/** how fast the thing is being bent - ring steps a tick */
export const TURN = "\\omega";
/** how heavy it is, which by the second premise is how much turning it is */
export const MASS_G = "m";
/** how far across it is, in cells */
export const SIZE = "r";
/** how many cells sit at that distance - the room there is out there */
export const SHELL_N = "shell";
/** how much turning one cell out there is doing */
export const PER_CELL = "\\omega_{r}";
/** and how much a whole shell of them comes to */
export const PER_SHELL = "M_{r}";
/** the whole polarised region added up - what the cloud weighs */
export const CLOUD = "m_{cloud}";
/** how far the polarised region reaches, in cells */
export const EXTENT = "L";

export const gravityAtom: Theorem = {
  id: "gravity.atom",
  asks: "a source emits gravity, and so does anything that turns. With no counting " +
    "condition of any kind, what relation does that fix between a bound thing's mass " +
    "and its size?",
  about: CLOUD,
  probes: [counts],
  uses: ["lattice.shell-growth", "lattice.turn"],
  wants: [
    { kind: "scales", of: TURN, by: { [SIZE]: expo(-1) } },
    { kind: "scales", of: MASS_G, by: { [TURN]: expo(1) } },
    { kind: "product", of: PER_SHELL, from: [PER_CELL, SHELL_N] },
    { kind: "sum", of: CLOUD, over: SIZE, term: PER_SHELL },
  ],
  glossary: {
    [MASS_G]: { symbol: "m", says: "how heavy it is - by the second premise, how much of it is turning" },
    [SIZE]: { symbol: "r", says: "how far across the closed curve is, in cells of the lattice" },
    [TURN]: { symbol: "\\omega", says: "how fast it is being bent, in ring steps a tick" },
    [PULL]: { symbol: "g", says: "what a source's gravity comes to at a distance" },
    [CYCLE_Q]: { symbol: "CYCLE", says: "how many ring steps go once round" },
    [DIM_Q]: { symbol: "D", says: "the lattice's dimension" },
    [SHELL_N]: { symbol: "shell", says: "how many cells sit at that distance - STEP·r^{D-1}" },
    [PER_CELL]: { symbol: "\\omega_{r}", says: "how much turning one cell out there is doing" },
    [PER_SHELL]: { symbol: "M_{r}", says: "what a whole shell of them comes to" },
    [CLOUD]: { symbol: "m_{cloud}", says: "the whole polarised region added up - what the cloud weighs" },
    [EXTENT]: { symbol: "L", says: "how far the polarised region reaches, in cells" },
  },
};

/**
 * THE THREE LINES PUT IN, and every one of them is a sentence of the header written out.
 */
export const definitions = [
  {
    fact: { kind: "scales" as const, of: PULL, by: { [SIZE]: expo(1, { [DIM_Q]: -1 }) } },
    because: "A SOURCE EMITS GRAVITY, and what it emits goes out over a shell. " +
      "`lattice.shell-growth` counts that shell at STEP·r^(D-1) sites, so what any one " +
      "place gets is the whole divided by the room there is at that distance. The exponent " +
      "is 1-D because the lattice has D dimensions and not because anybody wrote an " +
      "inverse square",
    line: `${PULL} ∝ ${SIZE}^{1-D}`,
  },
  {
    fact: { kind: "scales" as const, of: TURN, by: { [SIZE]: expo(-1) } },
    because: "EVERYTHING MOVES AT ONE CELL A TICK, so a closed curve of radius r is 2πr " +
      "cells round and takes 2πr ticks to go round; and a lap is CYCLE ring steps, which " +
      "is what `G^XOR^o`'s `laps` counts and what `lattice.turn` establishes does not grow " +
      "with the dimension. So holding that curve costs CYCLE/(2πr) ring steps a tick. " +
      "Neither π nor CYCLE depends on WHICH curve is being asked about, so as a statement " +
      "about how the turn rate moves when the size does, it is ω ∝ 1/r",
    line: `${TURN} ∝ \\frac{1}{${SIZE}}`,
  },
  {
    fact: { kind: "scales" as const, of: MASS_G, by: { [TURN]: expo(1) } },
    because: "AND TURNING EMITS GRAVITY, which is the second premise and is `G^XOR^o` in " +
      "its own words: a ray that comes back round holds the same neighbourhood down again " +
      "and again, and the expansion that does not happen there is the deficit. " +
      "`lib/Trajectory.ts` gives the count - mass is how many points are turning - so mass " +
      "is not something a thing HAS, it is the rate at which it is being bent. That makes " +
      "m proportional to ω and puts no constant between them that depends on the thing",
    line: `${MASS_G} ∝ ${TURN}`,
  },
  {
    fact: { kind: "scales" as const, of: SHELL_N, by: { [SIZE]: expo(-1, { [DIM_Q]: 1 }) } },
    because: "AND THE VACUUM AROUND IT IS MANY MANY CELLS relative to the thing at the " +
      "middle, which is the whole point: `lattice.shell-growth` counts the room at a " +
      "distance as STEP·r^{D-1}, and that count GROWS while the field thins",
    line: `${SHELL_N} = STEP·${SIZE}^{D-1}`,
  },
  {
    fact: { kind: "scales" as const, of: PER_CELL, by: { [SIZE]: expo(1, { [DIM_Q]: -1 }) } },
    because: "what one cell out there is doing is what the source's gravity comes to " +
      "there, which is the first line again - a cell is turned as hard as the field at it",
    line: `${PER_CELL} ∝ ${PULL}`,
  },
  {
    fact: { kind: "product" as const, of: PER_SHELL, from: [PER_CELL, SHELL_N] },
    because: "SO A WHOLE SHELL IS WHAT ONE CELL DOES TIMES HOW MANY CELLS THERE ARE, and " +
      "this is where the two exponents meet: the field thins as r^{1-D} and the room grows " +
      "as r^{D-1}, so THE PRODUCT DOES NOT DEPEND ON r AT ALL. Every shell of the cloud " +
      "weighs the same, which is conservation said as an arithmetic - the rays that left " +
      "the source are all still there, spread thinner over more room",
    line: `${PER_SHELL} = ${PER_CELL} · ${SHELL_N}`,
  },
  {
    fact: { kind: "sum" as const, of: CLOUD, over: SIZE, term: PER_SHELL },
    because: "AND THE CLOUD IS ALL OF THOSE SHELLS ADDED UP. Since every shell weighs the " +
      "same, the sum is that weight times HOW MANY SHELLS THERE ARE - so what the cloud " +
      "comes to is set by HOW FAR IT REACHES and not by how the field falls off. That " +
      "extent is what an energy state IS here: how fast the thing rotates and how far what " +
      "it throws off gets before it is eaten. The mass ratio is therefore a question about " +
      "L, and the falloff has cancelled itself out of it",
    line: `${CLOUD} = \\sum_{${SIZE}} ${PER_SHELL} = ${PER_SHELL} · ${EXTENT}`,
  },
];