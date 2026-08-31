import { Sample } from "./Backend.ts";
import { Env, putIn } from "./Language.ts";
import { dot, Geometry, Local, outward, sub, unit, Vec } from "./Local.ts";
import { clear } from "./Theory.ts";

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
   * WHAT THE VACUUM HAS DELIVERED TO IT AND NOT YET SPENT — the force, collected here.
   *
   * ADDED WHERE IT HAPPENS. A ray absorbed delivers its heading; a ray emitted costs the
   * recoil of the same; a cell crossed spends one step's worth. All three write here, and
   * what stands in it is what the body has to move with.
   *
   * IT WAS FOUR FIELDS. `absorbed` and `emitted` were running totals over all time, and
   * because a total is not a force, `lastAbsorbed` and `lastEmitted` had to be snapshotted
   * every tick so the DIFFERENCE could be taken — adding the totals themselves fed momentum
   * the size of the whole history every tick and everything crossed every threshold at once.
   * That difference over one tick is just that tick's arrivals less its departures, which is
   * what accumulating in place gives for nothing. So the other three are gone, and the bug
   * they were guarding against can no longer be written.
   */
  momentum: Vec
  /**
   * WHETHER IT SPENT ITS ACTION MOVING — one per tick, and NOT BOTH.
   *
   * "A structure gets one action per tick. It can spend it moving through the lattice or
   * walking its own graph, and not both." A tick it crosses a cell on is a tick it did not
   * put anything out on, so a thing going somewhere emits on FEWER of its ticks than a thing
   * standing still — and that is where a moving source's shift comes from. Not a rule about
   * frequencies: a rule about there being one step and two things to spend it on.
   */
  stepped: boolean
  /**
   * HOW FAR IT HAS GOT TOWARDS THE NEXT CELL — and this is what a step spends, NOT the
   * momentum.
   *
   * A BODY WITH MOMENTUM AND NO FORCE MUST KEEP GOING, and until this existed it did not.
   * One accumulator was doing two jobs: the vacuum's push went into `momentum`, and then a
   * step SUBTRACTED a cell's worth of it. So every cell had to be earned again, a constant
   * force gave a constant speed rather than a rising one, and a body that had been pushed
   * came to rest the moment the pushing stopped. That is `F = mv` — Aristotle — and no orbit
   * can exist in it, because an orbit is tangential velocity persisting while gravity bends it.
   *
   * SPLIT IN TWO IT IS NEWTON, and it is the same two lines the textbook is. The vacuum's
   * imbalance changes the MOMENTUM, which nothing else touches; the momentum advances this
   * REMAINDER every tick; and a whole cell of remainder is what a step costs. No force and
   * the momentum stands, so the body coasts; a steady force and the momentum climbs, so the
   * body accelerates. One cell at a time is still the only distance there is, and what is
   * short of a whole one is kept rather than rounded away.
   */
  advance: Vec
  /** self-maintenance carried over, and how many ticks went on it rather than on moving */
  owed: number
  upkeepTicks: number
  /** how many cells it has moved, and from where */
  moved: number
  origin: Vec
}

export type SourceSpec = Partial<Omit<Source, "id" | "locals" | "momentum" | "advance" |
  "stepped" | "owed" | "upkeepTicks" | "moved" | "origin">> & {
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

/* —— what a source is, as effects ————————————————————————————————————————— */

/**
 * A SOURCE IS PUT INTO THE BOX FROM OUTSIDE, AND SO IS EVERYTHING IT DOES.
 *
 * The rules of the medium do not make a source and cannot: `world.add` lays one down, from
 * outside, and every rewrite that fires on the cells it owns is a statement about what was put
 * in rather than about what the vacuum does. That is the whole of why the continuous reading
 * writes these as `Sigma` — one term, however many effects maintain it — and it is why the
 * rules never have to know what a hydrogen atom is. `outside` says so once, here, where a
 * source's own effects are defined.
 */
/**
 * (EMIT) A SOURCE ABSORBS WHAT ARRIVED AND WRITES ITS OWN CHARGE ONTO THE SPACE AROUND IT —
 * and what leaves is decided by four things: which exits fire (`emission`), which half of it
 * they are in (`axis`), whether it is aiming (`propulsion`), and whether it may make rays or
 * only pass them on (`conserve`). None of those is a knob; leaving any of them out makes a
 * different source, and a claim that asks for one and silently gets the isotropic ball is
 * measuring something nobody asked about.
 *
 * ABSORBING AND EMITTING ARE ONE EFFECT because they share a budget: what arrived is counted
 * per exit before it is destroyed — a re-emit would erase it — and a conserving source may
 * only send out what it took in. Split in two they would need to hand that budget between
 * them, which is a shared mutable thing pretending to be two independent effects.
 */
export const radiate = putIn(
  "a source absorbs what arrived and writes its own charge onto the space around it",
  (e: Env) => {
    const l: any = e.at[0];
  const s = l.source;
  const w = l.world, g = w.geometry, rays = l.rays;
  const act = acting(s, w.ticks);

  /*
   * WHAT ARRIVED, COUNTED BEFORE IT IS DESTROYED — a re-emit would erase it — and PER
   * EXIT rather than as a total, because momentum only cancels if what goes out
   * matches what came in exit by exit.
   */
  const arrived = new Array<number>(rays.length).fill(0);
  let budget = 0;
  if (s.absorbs) {
    for (let d = 0; d < rays.length; d++) {
      const r = rays[d];
      if (r.active) {
        /*
         * THE FORCE, ADDED WHERE IT ARRIVES — and every ray counts, its own included.
         *
         * A BODY CANNOT PUSH ITSELF, AND NOW THAT IS TRUE BY CONSTRUCTION RATHER THAN BY A
         * GUARD. A ray this body emitted and then caught on another of its own cells cost it
         * `-V` going out and returns `+V` coming in: it cancels, ray by ray, whether or not
         * the body moved between the two. What is left is what came from somewhere else.
         *
         * IT USED TO BE FILTERED, on this side only. Emission counted every ray and
         * absorption counted only foreign ones, so an internal ray was charged the recoil and
         * never credited the catch — which does not prevent a self-force, it manufactures
         * one, at `-V` per internal ray. The symmetry is the guarantee; the filter was the
         * thing breaking it.
         *
         * Summed in place: this runs per ray per source cell per tick, and a fresh vector for
         * each is the allocation, not the physics. A body hit alike from every side
         * accumulates nothing — the exits come in ± pairs and cancel — so what is left is the
         * LOPSIDEDNESS, which is exactly the shadow another body casts.
         */
        for (let i = 0; i < g.D; i++) s.momentum[i] += g.V[d][i] ?? 0;
        arrived[d]++; budget++;
      }
      clear(r);
    }
  }

  /* the duty cycle: a heavy source does not act every tick */
  if (!act) return;

  for (const d of firing(g, s, w.ticks)) {
    const r = rays[d];
    if (!r) continue;
    if (half(g, s, d, w.ticks) === 0) continue;    // an axial source has an equator
    if (!aims(g, s, d, arrived[d] ?? 0, l.backend.rng)) continue;
    if (s.conserve && budget <= 0) break;
    r.active = true;
    budget--;
    if (arrived[d] > 0) arrived[d]--;
    /* every ray it sends costs it the recoil, wherever that ray ends up */
    for (let i = 0; i < g.D; i++) s.momentum[i] -= g.V[d][i] ?? 0;
  }
  },
);

/**
 * (MOVE) A STRUCTURE CARRIES THE MOMENTUM THE VACUUM GIVES IT, and crosses a cell when it has
 * enough — the first thing in this model that moves a STRUCTURE rather than a ray.
 *
 * Nothing in the rules of the medium does this. A ray moves because streaming moves it; a
 * structure is a region and a region has no heading, so if matter goes anywhere it is because
 * of what the vacuum does to it. That force is MEASURED rather than assumed: what arrived,
 * less what was thrown away. ONE CELL AT A TIME, because that is the only distance there is,
 * and momentum short of a whole cell is kept rather than rounded away — so a slow thing moves
 * rarely rather than never, which is a duty cycle arrived at from the dynamics.
 *
 * AND IT IS SIGMA MOVING, NOT A TERM OF ITS OWN. A source that moves is still a source.
 */
export const propel = putIn(
  "a body carries the momentum the vacuum gives it and crosses a cell when it has earned one",
  (e: Env) => {
    const w: any = e.at[0];
  const g = w.geometry as Geometry, D = g.D;
  for (const s of w.sources as Source[]) {
    s.stepped = false;
    if (!s.moves) continue;

    /* x ADVANCES AT v: what it is carrying moves it on, every tick, whether or not
     * anything is pushing it this one */
    for (let i = 0; i < D; i++) s.advance[i] += s.momentum[i];

    // the exit it has most nearly earned, and whether it has earned it
    let best = -1, most = 0;
    for (let d = 0; d < g.DEG; d++) {
      const along = dot(s.advance, g.U[d]);
      if (along > most) { most = along; best = d; }
    }
    if (best < 0 || most < g.steps[best]) continue;

    /*
     * IT MOVES BY BEING SOMEWHERE ELSE, which is all a region can do — and it takes
     * its own cells with it, so nothing of it is left behind to keep emitting. The
     * step is read off the LINKS rather than off coordinates, so a wrapped box wraps
     * with it and a graph that has grown is still walked correctly.
     */
    const moved: any[] = [];
    for (const l of s.locals) {
      const there = outward(l.rays[best])?.target?.source?.l;
      if (there) moved.push(there);
    }
    if (moved.length !== s.locals.length) continue;      // it would leave the world

    /*
     * AND IT CANNOT MOVE THROUGH ANOTHER BODY. Without this two solid blocks driven
     * at each other interpenetrate and come out the far side — which is what the
     * alike-polarity figure did, so it showed two things passing through one another
     * under a caption about repulsion. It keeps its momentum when it is blocked, so
     * what happens next is decided by the force.
     */
    if (moved.some(l => l.source && l.source !== s)) continue;

    for (const l of s.locals) l.source = null;
    s.locals = moved;
    for (const l of moved) l.source = s;
    s.moved++;
    /* it spent this tick's action getting here, so it has none left to shine with */
    s.stepped = true;
    /* THE STEP IS PAID FOR OUT OF THE REMAINDER, and the momentum is not touched - which
     * is the whole of the difference between a thing that coasts and a thing that does not */
    for (let i = 0; i < D; i++) s.advance[i] -= (g.V[best][i] ?? 0);
  }
  },
);
