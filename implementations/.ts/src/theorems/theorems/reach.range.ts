/**
 * THE FOUR THAT WERE ONLY IN `discovered/` - a range, a horizon, a recession and a phase
 * quantum, each now asked as a theorem so it has a page of its own.
 *
 * THEY WERE ALREADY BEING DERIVED. The discovery sweep reaches them every run, because the
 * probes that establish them are in the catalogue and the rules close over what they find.
 * What was missing is that nobody had ASKED - a theorem is a question with a name, and
 * without one a result lives in the sweep's list and never appears in the index. That is a
 * gap in the asking rather than in the proving, and this file closes it.
 */
import { Theorem } from "../Theorem.ts";
import { meeting, OCCUPANCY } from "../probes/meeting.ts";
import { tables, PAIR_EMPTIES, PAIR_STATES } from "../probes/tables.ts";
import { survival, DEATH, FATAL, PARTNER, RANGE } from "../probes/survival.ts";
import { saturation, CEILING, DEFICIT, HORIZON } from "../probes/saturation.ts";
import { expanding, BETWEEN, RECESSION, SEPARATION } from "../probes/expanding.ts";
import { turning, SPIN, TURN_ORDER } from "../probes/turning.ts";

/**
 * HOW FAR A FORCE REACHES, which the article marks CALIBRATED and owes a length to.
 *
 * Its words: `F(d) ∝ e^{-d/λ}`, owing "λ, which is a property of the vacuum's occupancy
 * and not of the geometry". The occupancy is not a free parameter here - `vacuum.occupancy`
 * gets it by enumerating what the meeting rule does to a facing pair in every state it can
 * be in - so the length is not owed either. A carrier dies when something facing it is
 * carrying something AND that meeting is one of the fatal ones; both are counts; a constant
 * chance per step compounds into an exponential whose length is that chance's logarithm.
 *
 * A THEORY THAT DESTROYS NOTHING HAS AN INFINITE RANGE, which is the correct and slightly
 * startling reading: its forces are not screened at all.
 */
export const range: Theorem = {
  id: "force.range",
  asks: "a carrier is destroyed when it meets something. How far does one get, and what " +
    "does that make the reach of a force?",
  about: RANGE,
  probes: [survival, tables, meeting],
  wants: [{ kind: "product", of: DEATH, from: [PARTNER, FATAL] }],
  glossary: {
    [RANGE]: { symbol: "\\lambda", says: "how far a carrier gets before it is destroyed - the range of a force, derived rather than calibrated" },
    [DEATH]: { symbol: "death per step", says: "how often a carrier is destroyed on a step" },
    [PARTNER]: { symbol: "partner", says: "something facing it, carrying something itself" },
    [FATAL]: { symbol: "fatal fraction", says: "how many of a facing pair's states leave nothing at all" },
    [OCCUPANCY]: { symbol: "f", says: "how much of what the vacuum makes is still there" },
    [PAIR_EMPTIES]: { symbol: "pair leaves nothing", says: "the states in which a meeting leaves nothing" },
    [PAIR_STATES]: { symbol: "pair states", says: "the states a facing pair can be in" },
  },
};

/**
 * WHERE NOTHING GETS OUT - a horizon, arrived at because an unbounded law meets the only
 * ceiling the arithmetic already has.
 *
 * A shortfall at a point is exits that are dark, and a point has DEG of them. It cannot be
 * missing one it does not have. Every falloff here grows without limit as you approach a
 * source, so somewhere it reaches DEG - and there every exit is dark, so nothing leaves by
 * any route, since leaving is what an exit is. Not a weakened signal: none.
 *
 * AND THE RADIUS IS NOT SOLVED FOR, which is a limit of the algebra stated rather than
 * hidden. It would be (S/DEG)^{1/(D-1)}, and one over a linear form in D is not a linear
 * form in D - this algebra keeps exponents linear so that a law survives changing the
 * lattice, and evaluating D to force it would bake three dimensions into the answer. Solved
 * for the SOURCE instead there is no root: the strength needed to put a horizon at a radius
 * is the ceiling times the room out there, which on three dimensions goes as r^{2}. The
 * mass of one of these goes as the AREA of its horizon rather than as its radius, which is
 * not what the standard answer says.
 */
export const horizon: Theorem = {
  id: "gravity.horizon",
  asks: "the shortfall around a body grows without limit as you approach it, and a point " +
    "has only so many exits to be missing. What happens where they meet?",
  about: `what leaves a point at the ${HORIZON}`,
  probes: [saturation],
  wants: [{ kind: "bound", of: DEFICIT, atMost: CEILING }],
  glossary: {
    [`what leaves a point at the ${HORIZON}`]: { symbol: "what gets out",
      says: "how much leaves a point whose every exit is dark - which is nothing, by what an exit is" },
    [DEFICIT]: { symbol: "n[deficit]", says: "how much of one point is missing" },
    [CEILING]: { symbol: "DEG", says: "the ways out of a point, and so the most it can be missing" },
  },
};

/**
 * WHY A FAR THING RECEDES FASTER, counted rather than assumed.
 *
 * The vacuum makes space wherever it is idle. The only points that can add to the distance
 * between two markers are the ones BETWEEN them, each adding a step when it splits - and
 * how many of those there are is how far apart the markers already are, which is counted
 * here as integers over one walk with nothing ticked. So the recession goes as the
 * separation, with the same constant everywhere.
 *
 * IT IS NOT A COSMOLOGY. Nothing in it is about the universe being large or old; it is what
 * a medium that grows uniformly does to any two things embedded in it.
 */
export const recession: Theorem = {
  id: "space.recession",
  asks: "the vacuum makes space wherever it is idle. What does that do to two things " +
    "sitting some distance apart?",
  about: RECESSION,
  probes: [expanding],
  wants: [{ kind: "scales", of: BETWEEN, by: { [SEPARATION]: { k: { n: 1, d: 1 }, of: {} } } }],
  glossary: {
    [RECESSION]: { symbol: "recession", says: "how fast two markers come apart" },
    [SEPARATION]: { symbol: "separation", says: "how far apart they already are" },
    [BETWEEN]: { symbol: "idle points between", says: "the points that can make space between them, which is what the rate is" },
  },
};

/**
 * THE PHASE QUANTUM - one step of the ring the lattice carries.
 *
 * A turn is a turn in a PLANE, and the lattice's exits about an axis form a ring; going
 * round it a step at a time brings a direction home after however many steps the ring has.
 * That count is a property of the tiling, and the angle one step is worth is a whole turn
 * over it.
 *
 * IT IS THE LATTICE'S AND NOT THE THEORY'S, which the probe is careful about: no rule in
 * any theory here consults the ring. The alike meeting REVERSES a direction rather than
 * walking it round, and a reversal is a reflection - which is why the magnetic force is
 * structurally absent from the dynamics however good the ring looks. What is proved here is
 * that the ring is there and what one step of it is worth.
 */
export const phase: Theorem = {
  id: "lattice.phase",
  asks: "the exits about an axis form a ring. How far round is one step of it?",
  about: SPIN,
  probes: [turning],
  wants: [{ kind: "value", of: TURN_ORDER, equals: { n: 0, d: 1 } }],
  glossary: {
    [SPIN]: { symbol: "SPIN", says: "the angle one step of the ring is worth - a whole turn over how many steps it has" },
    [TURN_ORDER]: { symbol: "turn order", says: "how many turns about a given axis bring a direction home. NOT the geometry's CYCLE, which is its default ring's length and can differ" },
  },
};
