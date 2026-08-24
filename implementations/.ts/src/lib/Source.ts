import { Sample } from "./Backend.ts";
import { dot, Local, sub, unit, Vec } from "./Local.ts";

/**
 * HOW A THING TRIES TO MOVE ITSELF — and the model gives it more than one way, none
 * of them obviously the right one.
 *
 *   `none`       emits every way at once. The control, which must not move.
 *   `forward`    emits more into the direction it wants to go. Two effects oppose:
 *                the rays leaving carry momentum, so it should recoil BACKWARD — but
 *                those same rays thin the vacuum ahead, so fewer arrive from that
 *                side and the ambient pressure behind pushes it FORWARD.
 *   `backward`   the vacuum as propellant: absorb what arrives from every side, which
 *                is isotropic and brings no net momentum, and send it all out behind.
 *   `transmit`   pass what arrives straight on, same direction, out the far side, so
 *                absorbed and emitted momentum cancel exactly. The control that says
 *                the measurement can tell a redirection from a pass-through.
 */
export type Propulsion = "none" | "forward" | "backward" | "transmit"

export type Source = {
  id: number
  /** the polarity it puts out */
  emits: number
  /**
   * THE SECOND POLARITY IT PUTS OUT, where a theory carries one — see `G^XOR+XOR`.
   *
   * Absent everywhere else, and absent means "this theory has only the one sign", not
   * "this source is neutral". A theory that stacks a CHARGE on the magnetic polarity
   * reads it and falls back to `emits`, so a source that says nothing is one whose two
   * polarities agree; a source that wants them apart says so here, and 0 is a body that
   * carries a polarity and no charge at all.
   */
  charges?: number
  /**
   * Mass as a DUTY CYCLE and not as a multiplier on a step. A strand advances one cell
   * per tick WHEN IT ADVANCES AT ALL, and how often is what this book calls mass.
   */
  duty: number
  /** whether it destroys what lands on it */
  absorbs: boolean
  /** whether it meets the vacuum's rays, or is exempt from the collision rule */
  collides: boolean
  /** whether the vacuum is allowed to carry it anywhere */
  moves: boolean
  dwellTicks: number
  period: number
  phase: number
  /** the emitter's velocity, axis times rate — what a ray's label carries */
  u: Vec
  /** the locals it occupies */
  locals: any[]
  /** which way round it is; absent for a source with no sides */
  axis?: Vec
  /** how many ring steps its axis takes per beat, or 0 for one held still */
  turning: number
  /**
   * `sheet` pulses SHEET rays in a plane that comes round, which is how the article
   * derives 1/R^(D−1) — a fixed number of rays over a shell. `isotropic` fires every
   * exit every tick, which is the approximation most of the tests use.
   */
  emission: "isotropic" | "sheet"
  propulsion: Propulsion
  /** the direction it is trying to go */
  toward?: Vec
  /** how strongly, from 0 (no preference) to 1 (that hemisphere only) */
  bias: number
  /**
   * Emit only as many rays as arrived, rather than firing every exit every tick — what
   * separates a REDIRECTOR from a SOURCE.
   */
  conserve: boolean
  /**
   * THE MOMENTUM THE VACUUM HAS DELIVERED TO IT, accumulated as rays are absorbed.
   * This is the force, and it has to be collected here rather than measured later,
   * because a source clears its own locals when it re-emits.
   */
  absorbed: Vec
  emitted: Vec
  /** which way the rays that landed on it were going — one count per exit */
  caught: number[]
  arrivals: number
  /** what it is carrying: net momentum, and what `absorbed`/`emitted` stood at last tick */
  momentum: Vec
  lastAbsorbed: Vec
  lastEmitted: Vec
  /** self-maintenance carried over, and how many ticks went on it rather than on moving */
  owed: number
  upkeepTicks: number
  /** how many cells it has moved, and from where */
  moved: number
  origin: Vec
}

export type SourceSpec = Partial<Omit<Source, "id" | "locals" | "absorbed" | "emitted" |
  "caught" | "arrivals" | "momentum" | "lastAbsorbed" | "lastEmitted" | "owed" |
  "upkeepTicks" | "moved" | "origin">> & {
  /** the centre, in embedding coordinates */
  at: Vec
  radius?: number
  /**
   * HALF-EXTENTS IN REAL SPACE, making the body a slab rather than a ball. Two balls
   * touch at a point; two slabs meet face on, across their whole width, which is what
   * the rule being illustrated actually says.
   */
  half?: Vec
}

/** the actual bias a whole number of dwell ticks comes to: P = 2·dwell − 1 */
export const bias = (s: Source) => 2 * (s.dwellTicks / s.period) - 1;

export const acting = (s: Source, tick: number) =>
  s.duty >= 1 || ((tick * s.duty) % 1) < s.duty;

export const sign = (s: Source, tick: number) => {
  const ph = (((tick + s.phase) % s.period) + s.period) % s.period;
  return ph < s.dwellTicks ? s.emits : -s.emits;
};

/**
 * WHICH EXITS FIRE THIS TICK.
 *
 * `isotropic` is every one of them. `sheet` is the equator of an axis that comes round
 * the ring one step a tick, so a fixed number of rays is spread over the shell rather
 * than the whole degree of the lattice — which is the article's own derivation of
 * 1/R^(D−1) and NOT the same picture as firing everything. A geometry with no ring has
 * no sheet to rotate, and there the two readings coincide.
 */
export const firing = (g: any, s: Source, tick: number): number[] => {
  if (s.emission !== "sheet") return ALL(g);
  const k = g.CYCLE ? tick % g.CYCLE : 0;
  const axis = g.RING.length ? g.U[g.RING[k]] : g.ringAxis;
  const exits = g.equator(axis);
  return exits.length ? exits : ALL(g);
};

const cache = new WeakMap<object, number[]>();
const ALL = (g: any): number[] => {
  let a = cache.get(g);
  if (!a) cache.set(g, a = Array.from({ length: g.DEG }, (_, i) => i));
  return a;
};

/**
 * AN AXIAL SOURCE PUTS ITS SIGN OUT OF ONE HALF AND THE OPPOSITE OUT OF THE OTHER, and
 * emits nothing along its own equator — which is what makes it a thing with poles
 * rather than a ball. Returns +1 or −1 for which half an exit is in, or 0 for an exit
 * that lies on the equator and therefore does not fire at all.
 */
export const half = (g: any, s: Source, d: number): 0 | 1 | -1 => {
  if (!s.axis) return 1;
  const c = dot(g.U[d], unit(s.axis));
  return Math.abs(c) < 1e-9 ? 0 : c > 0 ? 1 : -1;
};

/**
 * WHETHER A PROPELLED SOURCE FIRES DOWN THIS EXIT — a ray either goes or it does not,
 * so emitting "more one way" is emitting into more of the exits that way.
 */
export const aims = (g: any, s: Source, d: number, arrived: number, rng: () => number) => {
  if (s.propulsion === "none" || !s.toward) return true;
  if (s.propulsion === "transmit") return arrived > 0;   // pass on only what came in
  const ahead = dot(g.U[d], unit(s.toward));
  const want = s.propulsion === "forward" ? ahead : -ahead;
  const p = Math.min(1, Math.max(0, 0.5 + 0.5 * s.bias * want) * 2);
  return rng() <= p;
};

export type Embedding = {
  at(l: Local): Vec | undefined
  toward(from: Local, to: Local): Vec
  within(centre: Vec, radius: number): Local[]
  /** every local inside a box of the given half-extents about a centre */
  box(centre: Vec, half: Vec): Local[]
}

export const embedding = (samples: Sample[]): Embedding => {
  const at = new Map<Local, Vec>();
  for (const s of samples) at.set(s.local, s.at);
  return {
    at: l => at.get(l),
    toward: (from, to) => {
      const a = at.get(from), b = at.get(to);
      return a && b ? sub(b, a) : [];
    },
    within: (centre, radius) => samples
      .filter(s => Math.sqrt(sub(s.at, centre).reduce((n, x) => n + x * x, 0)) <= radius)
      .map(s => s.local),
    box: (centre, half) => samples
      .filter(s => sub(s.at, centre).every((x, i) => Math.abs(x) <= (half[i] ?? 0)))
      .map(s => s.local),
  };
};
