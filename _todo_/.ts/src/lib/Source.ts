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
   * A PULSE WRITTEN OUT TICK BY TICK, instead of a period and a dwell.
   *
   * `period`/`dwellTicks` can only put the flips at EVEN intervals, and the radial nodes of a
   * Coulomb state are not evenly spaced - the two of 3s sit at rho = 3 +/- sqrt(3), a ratio of
   * 2 + sqrt(3), and no square wave has that in it. Since a ray leaves at one cell a tick,
   * RADIUS IS RETARDED TIME: what stands at r was emitted r ticks ago, so the radial profile a
   * source lays down IS its emission history read backwards. Handing it the history directly
   * is therefore how a named radial shape is asked for.
   *
   * `sign` is +1/-1 per tick and `duty` is what fraction of ticks it fires - the AGGREGATE
   * amplitude, since one ray is only ever +1 or -1 and an amplitude is how many of them there
   * are. Both are indexed by `tick % length`, so the shape repeats outward and the space
   * around the source holds it standing rather than moving away.
   */
  pulse?: { sign: number[]; duty: number[] }
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

export const acting = (s: Source, tick: number) => {
  if (s.pulse) {
    const d = s.pulse.duty[((tick % s.pulse.duty.length) + s.pulse.duty.length)
      % s.pulse.duty.length];
    return d >= 1 || ((tick * d) % 1) < d;
  }
  return s.duty >= 1 || ((tick * s.duty) % 1) < s.duty;
};

export const sign = (s: Source, tick: number) => {
  if (s.pulse) {
    const n = s.pulse.sign.length;
    return s.emits * s.pulse.sign[(((tick + s.phase) % n) + n) % n];
  }
  const ph = (((tick + s.phase) % s.period) + s.period) % s.period;
  return ph < s.dwellTicks ? s.emits : -s.emits;
};

/**
 * WHICH EXITS FIRE THIS TICK.
 *
 * `isotropic` is every one of them. `sheet` is a plane of SHEET rays that comes round, so
 * a fixed number of rays is spread over the shell rather than the whole degree of the
 * lattice — which is the article's own derivation of 1/R^(D−1) and NOT the same picture as
 * firing everything. A geometry with no ring has no sheet to rotate, and there the two
 * readings coincide.
 *
 * THE SHEET IS TURNED MEMBER BY MEMBER, AND THE OTHER WAY ROUND WAS WRONG. This used to
 * recompute the equator of a NEW AXIS each tick, stepping that axis round the ring. That
 * lands on classes of axis whose equators are different sizes, so the source's own ray
 * count changed as it came round — measured over one full turn:
 *
 *   fcc-12         lit 2,2,2,2,2,2   where SHEET is 6   — a third of the rays, and a
 *                                                          LINE rather than a plane
 *   cubic-18       lit 4,8,4,8,4,8   where SHEET is 8   — the count is not fixed at all
 *   triangular-6   lit 0,0,0,0,0,0                      — no equator, so it fell through
 *                                                          to ALL and emitted isotropically
 *
 * A source does not lose rays by coming round, and "a fixed number of rays over a shell"
 * is the premise the 1/R^(D−1) derivation rests on — cubic-18 was violating it outright.
 * `visuals/LATTICE.ts` already had this right and says why: the sheet turns about AN AXIS
 * LYING IN ITSELF, which is the article's "we'll be rotating this sheet in one more
 * dimension than it's defined". Every member is turned by that one axis, so the sheet
 * keeps its size by construction and only its orientation moves.
 *
 * THE SHEET COMES ROUND ONE STEP A TICK, which is the cadence this has always run at: the
 * shape is what changes here, not the timing. `turning` is NOT this rate — it is the rate
 * the source's AXIS comes round, which is what it was declared for and what `axisAt` does.
 */
export const firing = (g: any, s: Source, tick: number): number[] => {
  if (s.emission !== "sheet") return ALL(g);
  const base = g.equator(g.sheetAxis);
  if (!base.length || !g.CYCLE) return ALL(g);
  const about = g.U[base[0]];
  if (!about) return base;
  const k = (tick % g.CYCLE + g.CYCLE) % g.CYCLE;
  if (!k) return base;
  /* turned member by member about an axis in the sheet — deduped, since two members of a
   * sheet can land on one exit and a source must not fire the same ray twice */
  const lit = new Set<number>();
  for (const d of base) {
    let e = d;
    for (let i = 0; i < k; i++) e = g.turn(e, about);
    lit.add(e);
  }
  return [...lit];
};

const cache = new WeakMap<object, number[]>();
const ALL = (g: any): number[] => {
  let a = cache.get(g);
  if (!a) cache.set(g, a = Array.from({ length: g.DEG }, (_, i) => i));
  return a;
};

/**
 * WHERE THE SOURCE'S AXIS IS POINTING ON THIS TICK — `turning` ring steps per beat, and
 * this is the field it was declared for.
 *
 * `turning` is documented on `Source` as "how many ring steps ITS AXIS takes per beat" and
 * sits beside `axis`. It was read by nothing. Putting the rotation on the SHEET instead is
 * the mistake worth naming, because on some lattices it is unobservable: fcc-12's exits are
 * the ±<110> directions and a ring step about one of them is a symmetry of the whole set,
 * so every sheet — the 6-member equator, and every wider band up to all 12 exits — is its
 * own image and nothing moves. Measured: 1 distinct orientation over a full turn at every
 * width. The AXIS, by contrast, lands on a different exit at every step on every lattice
 * that has a ring, so which half is + and which is − sweeps regardless.
 *
 * AND A ROTATION IS A STEP ROUND THE RING, not an angle. `RING` is the equator ordered by
 * angle, so the axis is carried along it and stays a direction the lattice actually has —
 * no rounding, and nothing that lands between exits.
 */
export const axisAt = (g: any, s: Source, tick: number): Vec | undefined => {
  if (!s.axis || !s.turning || !g.CYCLE || !g.RING?.length) return s.axis;
  /* which ring member the axis is nearest, then carried `turning` steps per beat from it */
  const a = unit(s.axis);
  let at = 0, best = -Infinity;
  for (let i = 0; i < g.RING.length; i++) {
    const c = dot(unit(g.U[g.RING[i]] as Vec), a);
    if (c > best) { best = c; at = i; }
  }
  const beat = Math.floor((tick + s.phase) / Math.max(1, s.period));
  const k = ((at + Math.round(s.turning * beat)) % g.CYCLE + g.CYCLE) % g.CYCLE;
  return g.U[g.RING[k]] as Vec;
};

/**
 * AN AXIAL SOURCE PUTS ITS SIGN OUT OF ONE HALF AND THE OPPOSITE OUT OF THE OTHER, and
 * emits nothing along its own equator — which is what makes it a thing with poles
 * rather than a ball. Returns +1 or −1 for which half an exit is in, or 0 for an exit
 * that lies on the equator and therefore does not fire at all.
 *
 * READ OFF THE AXIS AS IT IS ON THIS TICK — see `axisAt`. A source whose axis is held still
 * behaves exactly as it always did, since `axisAt` returns `s.axis` unchanged at
 * `turning = 0`, which is the default.
 */
export const half = (g: any, s: Source, d: number, tick = 0): 0 | 1 | -1 => {
  const ax = axisAt(g, s, tick);
  if (!ax) return 1;
  const c = dot(g.U[d], unit(ax));
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
