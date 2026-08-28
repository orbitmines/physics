/**
 * THE LADDER FROM THE TWO GRAVITY RULES AND THE ROTATION - and the rotation is what supplies
 * the integer, so nothing has to be quantised by hand.
 *
 * WHAT IS ALLOWED IN HERE. The same two sentences as `gravity.atom` and no others:
 *
 *   A SOURCE EMITS GRAVITY.  What it puts out spreads over the room at a distance, and
 *   `lattice.shell-growth` counts that room at STEP·r^(D-1).
 *
 *   AND TURNING EMITS GRAVITY.  `G^XOR^o`: a ray that comes back round holds the same
 *   neighbourhood down again and again. `lib/Trajectory.ts`: mass is how many points are
 *   turning. So mass is the RATE at which a thing is being bent.
 *
 * WHAT THE ROTATION ADDS, AND WHY IT IS NOT A THIRD ASSUMPTION. `axisAt` carries the source's
 * axis round the RING, which has CYCLE exits and no more - so a winding is a WHOLE NUMBER of
 * ring steps per beat and cannot be anything else. That integer is the only free thing in the
 * setup, it is bounded by CYCLE, and it is what an energy level IS here. No counting condition
 * is imposed on the electron: the discreteness comes from the lattice having finitely many
 * directions to turn through, which is a fact about the ring rather than about the atom.
 *
 * AND THE ROTATION IS ALSO THE RETARDATION. A ray leaves at one cell a tick, so what stands at
 * radius r was emitted r ticks ago and the shell at r carries the orientation the axis had
 * then. A source winding n steps a beat therefore writes n turns of phase into the space it
 * has filled - which is what makes n a COUNT OF SOMETHING IN SPACE rather than a label on a
 * setting, and is the whole of what is put in below.
 *
 * WHAT COMES OUT is the Bohr ladder: r ∝ n^{2} and E ∝ 1/n^{2}, from a balance and a count,
 * with no wavelength and no hbar written anywhere in this file.
 */
import { expo } from "../Algebra.ts";
import { Theorem } from "../Theorem.ts";
import { sym } from "../Expr.ts";
import { counts, CYCLE_Q, DIM_Q } from "../probes/counts.ts";

/** the winding - how many ring steps the axis takes per beat. THE energy level */
export const WIND = "n";
/** how far out the state stands, in cells */
export const RADIUS_H = "r_{n}";
/** how fast what is standing there is being bent - ring steps a tick */
export const TURN_H = "\\omega_{n}";
/** what the source's gravity comes to out there */
export const PULL_H = "g";
/** what it would take to get the thing off that shell */
export const BIND = "E_{n}";
/** the balance the shell sits at - what the pull and the turning agree on */
export const HOLD = "\\omega·r";
/** how much turn the winding has written between the source and that shell */
export const PHASE = "\\Phi";

export const gravityHydrogen: Theorem = {
  id: "gravity.hydrogen",
  asks: "a source emits gravity, turning emits gravity, and the axis can only wind a whole " +
    "number of ring steps a beat. With no wavelength and no counting condition put on the " +
    "electron, where do the shells stand and what does it cost to leave one?",
  about: BIND,
  probes: [counts],
  uses: ["lattice.shell-growth", "lattice.turn", "gravity.atom"],
  wants: [
    { kind: "scales", of: TURN_H, by: { [RADIUS_H]: expo(-1) } },
    { kind: "scales", of: PULL_H, by: { [RADIUS_H]: expo(1, { [DIM_Q]: -1 }) } },
    { kind: "positive", of: BIND },
  ],
  glossary: {
    [WIND]: { symbol: "n", says: "how many ring steps the axis winds per beat - a whole number because the ring has CYCLE exits and no more, and this is what an energy level is" },
    [RADIUS_H]: { symbol: "r_{n}", says: "how far out that state stands, in cells" },
    [TURN_H]: { symbol: "\\omega_{n}", says: "how fast what stands there is being bent" },
    [PULL_H]: { symbol: "g", says: "what the source's gravity comes to at that distance" },
    [BIND]: { symbol: "E_{n}", says: "what it would take to get the thing off that shell" },
    [HOLD]: { symbol: "\\omega·r", says: "the turning carried round once" },
    [PHASE]: { symbol: "\\Phi", says: "how much turn the winding has written between the source and that shell - n·r, because a ray takes r ticks to get there" },
    [CYCLE_Q]: { symbol: "CYCLE", says: "how many ring steps go once round, and so how many windings there can be" },
    [DIM_Q]: { symbol: "D", says: "the lattice's dimension" },
  },
};

export const definitions = [
  {
    fact: { kind: "scales" as const, of: TURN_H, by: { [RADIUS_H]: expo(-1) } },
    because: "EVERYTHING MOVES AT ONE CELL A TICK, so a closed curve of radius r is 2πr " +
      "cells round and a lap is CYCLE ring steps - `G^XOR^o`'s own `laps`. Holding that " +
      "curve therefore costs CYCLE/(2πr) ring steps a tick, and neither π nor CYCLE " +
      "depends on which curve is being asked about. This is `gravity.atom`'s second line " +
      "and it is cited rather than re-argued",
    line: `${TURN_H} ∝ \\frac{1}{${RADIUS_H}}`,
  },
  {
    fact: { kind: "scales" as const, of: PULL_H,
      by: { [RADIUS_H]: expo(1, { [DIM_Q]: -1 }) } },
    because: "A SOURCE EMITS GRAVITY and it spreads over the room there is at a distance, " +
      "which `lattice.shell-growth` counts at STEP·r^{D-1}. The exponent is 1-D because " +
      "the lattice has D dimensions, and on three of them that is an inverse square nobody " +
      "wrote down",
    line: `${PULL_H} ∝ ${RADIUS_H}^{1-D}`,
  },
  {
    fact: { kind: "product" as const, of: HOLD, from: [TURN_H, RADIUS_H] },
    because: "AND WHAT THE WINDING COUNTS IS THE TURNING CARRIED ONCE ROUND. A ray leaves " +
      "at one cell a tick, so the shell at r holds the orientation the axis had r ticks " +
      "ago, and a source winding n steps a beat has written n turns of phase into the " +
      "space it has filled. That is ω·r - a turn rate times the distance it was carried - " +
      "and it is a COUNT of something standing in space rather than a label on a setting",
    line: `${HOLD} = ${TURN_H} · ${RADIUS_H}`,
  },
  {
    fact: { kind: "equals" as const, of: TURN_H, to: sym(PULL_H) },
    because: "AND THE SHELL IS WHERE THE TWO MEET. What holding the curve COSTS is the " +
      "first line and what the source SUPPLIES is the second, and a thing stands where they " +
      "are equal - it is not being held by anything else and there is nothing else here to " +
      "hold it. This is the only place the two premises are put together, and everything " +
      "below is what that equality makes of them",
    line: `${TURN_H} = ${PULL_H}`,
  },
  {
    fact: { kind: "scales" as const, of: PHASE, by: { [WIND]: expo(1), [RADIUS_H]: expo(1) } },
    because: "AND WHAT THE WINDING WRITES INTO SPACE IS n TURNS PER CELL CROSSED. A ray " +
      "leaves at one cell a tick and the axis has moved on by the time the next leaves, so " +
      "the shell at r carries the orientation the axis had r ticks ago: a source winding n " +
      "ring steps a beat has laid n·r of turn between itself and that shell. THE INTEGER IS " +
      "THE LATTICE'S AND NOT THE ATOM'S - `axisAt` carries the axis round a ring with CYCLE " +
      "exits and there is nothing between them, so a winding is whole because a direction " +
      "cannot be half-turned. Nothing here is a condition on the electron",
    line: `${PHASE} = ${WIND} · ${RADIUS_H}`,
  },
  {
    fact: { kind: "product" as const, of: BIND, from: [TURN_H, TURN_H] },
    because: "AND WHAT IT COSTS TO LEAVE IS THE TURNING TWICE OVER. Mass is the rate of " +
      "bending - `gravity.atom`'s premise - and what a thing at that rate carries goes as " +
      "the rate again, so the energy is quadratic in ω. Nothing about this is put in for " +
      "the atom; it is the same statement `mass.budget` makes when it writes β^{2}",
    line: `${BIND} ∝ ${TURN_H}^{2}`,
  },
];
