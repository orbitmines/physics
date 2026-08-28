/**
 * THE ELECTRON, FROM EVERYTHING THE MODEL SAYS AND NOTHING IT DOES NOT.
 *
 * WHAT THIS IS FOR. Not to check an answer - to put every rule that bears on a bound charge in
 * one place, sourced to the rule it comes from, and let the inference find what they come to
 * together. Nothing below is chosen to make a number come out; each line names the rule it is
 * read off, and where the model says nothing the theorem says nothing.
 *
 * THERE IS NO ELECTRON IN THIS MODEL AND THAT IS THE STARTING POINT. `G^XOR^o`: "The orbit is
 * the particle... there is nowhere else for it to be." `lib/Trajectory.ts`: a body is "a REGION
 * WHERE TURNING IS HAPPENING", and "MASS IS HOW MANY POINTS ARE TURNING, which is the only
 * count available". So both things in an atom are the same kind of object - an amount of
 * turning - and their masses are commensurable without any constant between them.
 *
 * THE RULES THAT BEAR ON IT, EACH READ OFF ITS OWN LINE:
 *
 *   (G/2) SPLITS EVERY NEUTRAL POINT, unconditionally, into a plus and a minus - and
 *   `G^XOR+XOR` does it TWICE, once in polarity and once in charge, from two independent
 *   draws. So charge is made in pairs and never singly.
 *
 *   ANNIHILATION DESTROYS THE OPPOSITE PAIRS: `mine !== theirs` clears both rays and folds the
 *   two points into one. Alike pairs are not destroyed - they turn. So charge is unmade in
 *   pairs too, and what can act on anything is only ever the RESIDUAL, the part left over.
 *
 *   STEERING HAPPENS FIRST, WHICH IS WHY THERE IS A RESIDUAL AT ALL. `steer` is called inside
 *   MOVEMENT, which decides the exit a ray leaves by; ANNIHILATION is a LATER rule quantified
 *   over whatever is then facing. So the polarity field bends a charge BEFORE the meeting is
 *   resolved, and bending changes who it faces - a charge turned aside survives a meeting it
 *   would have died in. Measured, the residual sits above the level chance alone would leave.
 *
 *   TURNING EMITS GRAVITY, so the cloud is inside its own field. `G^XOR^o`: "a ray that comes
 *   back round holds the same neighbourhood down again and again, and the expansion that does
 *   not happen there is the deficit." What bends a cell at radius r is therefore everything
 *   enclosed by r, the accumulated cloud included, and not the source alone.
 *
 *   AND WHAT IT SPREADS OVER IS COUNTED. `lattice.shell-growth` gives the room at a distance
 *   as STEP·r^{D-1}, proved, and the falloff is one over the same room.
 *
 *   EVERYTHING MOVES ONE CELL A TICK, always - c̄ by definition - so a closed curve of radius r
 *   is 2πr cells round, and a lap is CYCLE ring steps by `G^XOR^o`'s `laps`. Nothing closes
 *   tighter than one lap, because there is no shorter way round the ring.
 *
 * WHAT IS DELIBERATELY NOT PUT IN. No wavelength, no counting condition on the bound thing, no
 * hbar, no assumed extent, and no assumed exponent. Earlier attempts set the cloud's reach
 * equal to the mean free path and then reported what that implied, which was the answer put in
 * and read back out. Here the reach is left to whatever the equation makes of it.
 */
import { expo } from "../Algebra.ts";
import { Theorem } from "../Theorem.ts";
import { counts, CYCLE_Q, DIM_Q } from "../probes/counts.ts";
import { RESIDUAL, residual } from "../probes/residual.ts";
import { BETA, RBAR, SHELL } from "../Rules.ts";

/** everything enclosed by that radius - the source and whatever cloud has gathered inside */
export const ENCLOSED = "M";
/** what one cell out there is turning at, which is the field it sits in */
export const TURN_E = "\\omega";
/** how much of the turning survives the pair-cancelling - the residual fraction */
export const SURVIVES = RESIDUAL;
/** the tightest thing that can close: one lap */
export const R_TIGHT = "r_{p}";
/** what the cloud alone weighs */
export const CLOUD_M = "m_{e}";
/** what the next shell adds - dM/dr, named so the kernel can carry a law for it */
export const GROWTH = "\\frac{dM}{dr}";
/** and the two masses against each other */
export const RATIO_E = "\\frac{m_{p}}{m_{e}}";
/**
 * WHAT HAS ACCUMULATED, AGAINST WHAT IT GREW FROM - and this is what the theorem asks about
 * rather than M itself.
 *
 * The law here is exponential, and an exponential is not a scaling: `conclusions` gathers the
 * subjects a proof said anything final about from its `scales`, `value` and `equals` facts,
 * and an `exponential` fact is none of those. So asking about M gets silence even where the
 * rule has fired. What the same rule ALSO emits is an equality for the RATIO - what the cloud
 * came to over what it started as - and that is both expressible and the thing actually
 * wanted, since a mass ratio is what the question was.
 */
export const GREW = "\\frac{M}{M_{0}}";

export const gravityElectron: Theorem = {
  id: "gravity.electron",
  asks: "charge is made in pairs and destroyed in pairs, what is left over is bent by " +
    "everything inside it, and the bending itself weighs. What does a bound cloud come to, " +
    "and how does it stand against the tightest thing that can close?",
  about: GREW,
  probes: [counts, residual],
  uses: ["lattice.shell-growth", "lattice.turn", "gravity.atom", "vacuum.occupancy"],
  wants: [
    { kind: "product", of: GROWTH, from: [SHELL, TURN_E, SURVIVES] },
    { kind: "rate", of: GROWTH, from: ENCLOSED, in: RBAR },
    { kind: "scales", of: TURN_E, by: { [ENCLOSED]: expo(1), [RBAR]: expo(1, { [DIM_Q]: -1 }) } },
    { kind: "positive", of: SURVIVES },
  ],
  glossary: {
    [GREW]: { symbol: "\\frac{M}{M_{0}}", says: "what the cloud came to over what it grew from - the accumulated mass against the source that seeded it, which is what a mass ratio IS here" },
    [ENCLOSED]: { symbol: "M", says: "everything inside that radius - the source, and the cloud that has gathered within it, because turning weighs too" },
    [TURN_E]: { symbol: "\\omega", says: "what one cell out there turns at, which is the field it is sitting in" },
    [SURVIVES]: { symbol: "f", says: "how much turning survives the pair-cancelling - charge is made and unmade in pairs, and only the residual acts. A property of the meeting rule and of the order the rules fire in, not of the geometry" },
    [R_TIGHT]: { symbol: "r_{p}", says: "the tightest thing that can close - one lap is CYCLE cells round, so its radius is CYCLE/(2\\pi)" },
    [GROWTH]: { symbol: "\\frac{dM}{dr}", says: "what the next shell adds to the enclosed mass - its cells, times what each turns at, times what survives the cancelling" },
    [CLOUD_M]: { symbol: "m_{e}", says: "what the cloud alone weighs - the enclosed mass less the source it grew from" },
    [RATIO_E]: { symbol: "\\frac{m_{p}}{m_{e}}", says: "the two masses against each other, both being amounts of turning and so commensurable with no constant between them" },
    [SHELL]: { symbol: "shell", says: "how many cells sit at that distance" },
    [BETA]: { symbol: "STEP", says: "the leading coefficient of the shell count" },
    [RBAR]: { symbol: "r", says: "how far out, in cells" },
    [CYCLE_Q]: { symbol: "CYCLE", says: "how many ring steps go once round" },
    [DIM_Q]: { symbol: "D", says: "the lattice's dimension" },
  },
};

export const definitions = [
  {
    fact: { kind: "equals" as const, of: SHELL,
      to: [{ c: { n: 1, d: 1 }, m: { [BETA]: expo(1), [RBAR]: expo(-1, { [DIM_Q]: 1 }) } }] },
    because: "the room at a distance is what `lattice.shell-growth` establishes - STEP·r^{D-1} " +
      "sites at r̄ steps out - cited rather than re-derived",
    line: `${SHELL} = STEP·${RBAR}^{D-1}`,
  },
  {
    fact: { kind: "scales" as const, of: TURN_E,
      by: { [ENCLOSED]: expo(1), [RBAR]: expo(1, { [DIM_Q]: -1 }) } },
    because: "WHAT BENDS A CELL IS EVERYTHING INSIDE IT. The second premise says turning emits " +
      "gravity and `lib/Trajectory.ts` says mass IS turning, so the cloud that has already " +
      "gathered is part of what does the bending - the field reads M and not the source alone. " +
      "It spreads over the room above, which is the only geometry in this",
    line: `${TURN_E} = \\frac{${ENCLOSED}}{STEP·${RBAR}^{D-1}}`,
  },
  {
    fact: { kind: "product" as const, of: GROWTH, from: [SHELL, TURN_E, SURVIVES] },
    because: "AND WHAT THE NEXT SHELL ADDS IS ITS CELLS, TIMES WHAT EACH IS TURNING AT, " +
      "TIMES WHAT SURVIVES THE CANCELLING. (G/2) makes charge in pairs and ANNIHILATION " +
      "unmakes it in pairs, so what can act on anything is the residual, and f is that " +
      "fraction - a property of the meeting rule, measured rather than assumed. THE THREE " +
      "FACTORS ARE HANDED OVER SEPARATELY AND NOT MULTIPLIED HERE: what they come to is for " +
      "the rules to work out, and the cancellation between the room and the falloff is the " +
      "whole content of this theorem rather than something to be asserted in a sentence",
    line: `${GROWTH} = ${SHELL} · ${TURN_E} · ${SURVIVES}`,
  },
  {
    fact: { kind: "rate" as const, of: GROWTH, from: ENCLOSED, in: RBAR },
    because: "and that is what dM/dr MEANS - the rate the enclosed mass grows at as the " +
      "radius does. Naming it is not a premise about the world; it is saying which " +
      "derivative the product above is",
    line: `${GROWTH} = \\frac{d${ENCLOSED}}{d${RBAR}}`,
  },
  {
    fact: { kind: "scales" as const, of: R_TIGHT, by: { [CYCLE_Q]: expo(1) } },
    because: "AND THE OTHER BODY IS THE TIGHTEST THING THAT CAN CLOSE. Everything moves one " +
      "cell a tick, so a closed curve of radius r is 2πr cells round; a lap is CYCLE ring " +
      "steps, which `lattice.turn` establishes does not grow with the dimension; and nothing " +
      "closes tighter because there is no shorter way round the ring. The 2π is what a " +
      "circumference is and not a fitted constant",
    line: `${R_TIGHT} = \\frac{${CYCLE_Q}}{2\\pi}`,
  },
];
