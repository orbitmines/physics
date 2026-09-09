import { Sample } from "./Backend.ts";
import { call, field, mul, num, sub as minus } from "./Algebra.ts";
import { Env, folded, it, putIn, turns } from "./Language.ts";
import { across, dot, Geometry, Local, outward, sub, unit, Vec } from "./Local.ts";
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
  /**
   * `\bar{m}_{x}` — THE MOST IT PUTS DOWN ONE WAY OUT ON ONE TICK, and it is a CEILING
   * rather than a rate.
   *
   * A SOURCE IS A HOLE IN THE SPACE, point-like, with as many neighbours as the place it
   * sits in has ways out. So its mass is what it hands every one of them:
   *
   *     \bar{m} = \bar{m}_{x} \cdot DEG
   *
   * and mass goes as HOW IT IS JOINED ON TO THE SPACE rather than as how many cells of a
   * lattice it covers. A body twice as heavy is not a body twice as wide — the lattice is
   * an abstraction and a hole's connections are its own — which is why nothing here reads
   * an extent and why `\bar{m}_{x}` is per neighbour.
   *
   * AND IT IS A MAXIMUM, WHICH IS WHAT `chooses` IS FOR. `\bar{m}_{x} = 1` is a way out lit
   * every tick, which is `\bar{c}` and the ceiling; anything under it is a source choosing
   * to put less down that way. LESS MASS FOR THE SAME SIZE is therefore a thing a source can
   * be, and it is the only dial a body of one point has.
   */
  mx: number
  /**
   * HOW MANY NEIGHBOURS THE HOLE HAS — `l.DEG`, ITS OWN, AND NOT THE LATTICE'S.
   *
   * "A point's degree grows without bound, measured at 396 ways out of a point where the
   * lattice has 26" — a place that has swallowed its neighbourhood is a HUB, and a source is
   * a hole in the space, so how it is joined on is a fact about the hole. A lattice is how
   * the MEDIUM is written down, and a mass has no business being read off it: the whole
   * reading is that a body is point-like with many, many neighbours rather than a heap of
   * small parts, and being heavier is being joined on to more of the space at the same size.
   *
   * WHAT THE MEDIUM THEN CARRIES IS THE MEDIUM'S BUSINESS. A hole with a thousand ways sits
   * in a place with `DEG` of them, and what it puts down is coarse-grained onto those; what it
   * WEIGHS is still what it is joined on to. Absent is a hole joined on exactly as the place
   * it stands in is, which is every source written before this existed.
   */
  ways?: number
  /**
   * WHAT IT CHOOSES TO PUT DOWN EACH WAY OUT, under its own ceiling — the emission PATTERN.
   *
   * Answers a share of `\bar{m}_{x}` for the way out `d` on this tick, and is clamped into
   * `[0, \bar{m}_{x}]` by `chose` below, so a pattern cannot ask for more than the source
   * has. Absent is the flat choice: every neighbour gets the ceiling, which is the isotropic
   * ball every test in this book is written about.
   *
   * IT IS THE ONE PLACE AN ASSUMPTION IS ALLOWED. Whether a source moves, and whether and
   * how it emits, is what a source IS; everything after it is the rules'.
   */
  chooses?: (d: number, tick: number) => number
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

/**
 * WHAT IT PUTS DOWN ONE WAY OUT THIS TICK — its ceiling, times the pattern it chose, and never
 * more than the ceiling. A source with no pattern hands every neighbour the same, which is
 * `\bar{m}_{x}` on all `DEG` of them and so a mass of `\bar{m}_{x} \cdot DEG`.
 */
/**
 * WHAT IT WEIGHS — `\bar{m} = \bar{m}_{x} \cdot DEG`, and it is a count of CONNECTIONS.
 *
 * A source is a hole in the space with as many neighbours as the place it sits in has ways
 * out, and how heavy it is is how much it hands each of them. Nothing about an extent enters:
 * a body twice as heavy is not a body twice as wide, and a lattice of cells is an abstraction
 * a mass is not entitled to be read off.
 */
export const mass = (g: any, s: Source) => Math.max(1e-12, s.mx * (s.ways ?? g.DEG));

/** how many rays it puts down ONE of the place's exits in a tick, over all the ways that lead
 *  that way - `\bar{m}/DEG`, which is what makes a heavy body a bright one */
export const brightness = (g: any, s: Source) => mass(g, s) / g.DEG;

export const chose = (s: Source, d: number, tick: number) =>
  Math.max(0, Math.min(s.mx, s.chooses ? s.mx * s.chooses(d, tick) : s.mx));

/**
 * ═══ THE ONE RESTRICTION THE MODEL MAKES ON A SOURCE ═══════════════════════════════════
 *
 * "The model does make a single restriction on the freedoms given to a source. Which is if you
 * move in some direction at some tick in the universe, YOU CANNOT ALSO EMIT A RAY IN THAT
 * DIRECTION."
 *
 * ONE WAY OUT, ON THAT TICK, AND NOTHING ELSE. Every other way is free, so a body crossing a
 * cell still tells the space around it everything except the one thing it is busy doing. The
 * mass it loses by moving is therefore `\bar{m}_{x}` out of `\bar{m}_{x}\cdot l.DEG` on the ticks
 * it moves - one way in `l.DEG` - and not all of it.
 *
 * `\paren{1 - \beta}` IS A CHOICE ON TOP OF THAT, NOT THIS. A source MAY go quiet while it
 * moves, and the article folds that into `l.choose`: "I let the `l.choose` term in the mass
 * equation also signals a choice of multiplication with the current velocity". That is a source
 * deciding something about itself; this is the model saying what no source may do. Asked as a
 * gate on the whole rule it silenced every way out on a moving tick - the strong reading of a
 * narrow rule - so it is asked here, per way, where the restriction actually is.
 *
 * AND IT IS STATED ONCE. Both backends ask this rather than each having a version of it.
 */
export const emits = (
  s: Source, d: number, tick: number, movedAlong?: number,
): number => movedAlong !== undefined && heading(g_of(s), d) === movedAlong
  ? 0 : chose(s, d, tick);
/* the geometry a source's ways are spread over is the one it was laid in - carried so that
 * `emits` can compare a way of the hole against a direction of the medium */
const GEOM = new WeakMap<Source, any>();
export const laidIn = (s: Source, g: any) => { GEOM.set(s, g); return s; };
const g_of = (s: Source) => GEOM.get(s) ?? { DEG: s.ways ?? 1 };

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
  /* EVERY WAY THE HOLE HAS, not every exit the place has - see `Source.ways` */
  if (s.emission !== "sheet") return ALL(s.ways ?? g.DEG);
  const base = g.equator(g.sheetAxis);
  if (!base.length || !g.CYCLE) return ALL(s.ways ?? g.DEG);
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

const cache = new Map<number, number[]>();
const ALL = (n: number): number[] => {
  let a = cache.get(n);
  if (!a) cache.set(n, a = Array.from({ length: n }, (_, i) => i));
  return a;
};

/**
 * WHICH OF THE PLACE'S EXITS A WAY OUT OF THE HOLE LEADS DOWN.
 *
 * A hole has `ways` neighbours and stands in a place that has `DEG`, so its ways are spread
 * over them - way `d` leads down exit `d mod DEG`, which is the flattest spreading there is and
 * the only one that says nothing more about the hole than that it is joined on evenly. What
 * the medium then carries down one exit is HOW MANY of the hole's ways chose it, which is why
 * a heavier body is a brighter one: `\bar{m} = \bar{m}_{x} \cdot ways` is what it radiates and
 * what it weighs at once, and pulsing every way every tick is the most of either it can be.
 */
export const heading = (g: any, d: number): number => d % g.DEG;

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
  const c = dot(g.U[heading(g, d)], unit(ax));
  return Math.abs(c) < 1e-9 ? 0 : c > 0 ? 1 : -1;
};

/**
 * WHETHER A PROPELLED SOURCE FIRES DOWN THIS EXIT — a ray either goes or it does not,
 * so emitting "more one way" is emitting into more of the exits that way.
 */
export const aims = (g: any, s: Source, d: number, arrived: number, rng: () => number) => {
  if (s.propulsion === "none" || !s.toward) return true;
  if (s.propulsion === "transmit") return arrived > 0;   // pass on only what came in
  const ahead = dot(g.U[heading(g, d)], unit(s.toward));
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
        const v = g.V[heading(g, d)];
        for (let i = 0; i < g.D; i++) s.momentum[i] += v[i] ?? 0;
        arrived[d]++; budget++;
      }
      clear(r);
    }
  }

  /* the duty cycle: a heavy source does not act every tick */
  if (!act) return;

  /*
   * AND IT HANDS A FOLD BACK ON EVERY WAY IT HAS, WHICH IS THE OTHER HALF OF PUTTING RAYS OUT.
   *
   * `(G/2)` is `seq(unfold(point), each(exits(point), light))` — a point that lights its ways
   * out gives back a point of space FIRST, one off each way that is holding a fold. `unfold`
   * says what that balance is for: "a meeting takes two rays and makes one fold; a splitting
   * makes DEG rays and hands back one fold... One per way out puts DEG back against DEG/2
   * taken, AND IT SETTLES." This did only the lighting half. Same act, half the bookkeeping.
   *
   * AND WITHOUT IT NOTHING MADE OF MATTER CAN HOLD A HEADING. A source's place is never neutral
   * — matter never is — so `(G/2)` cannot fire there and nothing else was ever going to hand
   * the folds back. Measured: the record under a body climbed to 335 by fifty ticks and 2193 by
   * four hundred, while the open vacuum beat between nought and seven for ever. `turns` weighs
   * the way a thing has earned as ONE against `n_{f}` folded ones, so at 2193 a body's step was
   * a pure draw from the record and its momentum was noise. It could not coast, so it could not
   * orbit, so nothing made of matter could go anywhere on purpose.
   *
   * THE VACUUM IS TRYING TO EXPAND EVERYWHERE, and a hole in it is not an exception to that.
   * A source is a point that puts rays down every one of its ways out, which is what a neutral
   * point does when it splits; so it gives space back the way one does, one per way out, and
   * the same balance holds under it as anywhere else. Nothing is assumed about how much: it is
   * `unfold`'s own count, over this source's own ways.
   */
  /*
   * AND IT GIVES THE SPACE BACK WHERE IT WAS TAKEN FROM — one per way out, exactly as `(G/2)`
   * gives back one per way out of a point, because A HOLE IS AS MANY POINTS AS IT HAS WAYS.
   *
   * A SOURCE STANDING ON ONE CELL IS AN ABSTRACTION. `\bar{m} = \bar{m}_{x} \cdot ways` says how
   * it is really joined on: a hole with many, many neighbours, far more than the lattice has
   * exits. The cell is where it is DRAWN; the places it is joined to are as much the hole as
   * the middle of it is.
   *
   * `(G/2)` IS `seq(unfold(point), each(exits(point), light))` — a point hands back a fold on
   * each way it has and then lights each of them. A source lights `ways` of them, so it hands
   * back `ways`, at the places those ways reach. Doing it only `DEG` times was reading the
   * drawing instead of the hole: the source made `ways/2` folds a tick around itself and
   * returned eight, so the books never closed and the shell grew anyway — measured, the record
   * one cell out still reached `36419` by six hundred ticks against the vacuum's `4`.
   *
   * AND `unfold` ONLY EVER RUNS INSIDE `(G/2)`, which needs a NEUTRAL point, and a place a
   * source is joined to is carrying every tick. So the space taken from a hole's own
   * neighbourhood was never returned to it at all: `keeps` went to nought, the place turned
   * opaque, and a body that cannot get its light OUT catches it again itself — lopsidedly,
   * which is the whole of the self-force.
   */
  for (const d of firing(g, s, w.ticks)) {
    const r = rays[d];
    if (!r) continue;
    if (half(g, s, d, w.ticks) === 0) continue;    // an axial source has an equator
    /*
     * AND WHAT IT CHOSE TO PUT DOWN THIS WAY — `\bar{m}_{x}` is a CEILING per neighbour and
     * not a rate the source is held to, so a way out is lit as often as the source chose to
     * light it and no oftener. Every way at the ceiling is a mass of `\bar{m}_{x} \cdot DEG`;
     * a source that chooses less is lighter at the same size, which is the only way a body
     * of one point can be lighter.
     */
    const m = chose(s, d, w.ticks);
    if (m < 1 && l.backend.rng() >= m) continue;
    if (!aims(g, s, d, arrived[d] ?? 0, l.backend.rng)) continue;
    if (s.conserve && budget <= 0) break;
    /*
     * AND WHAT IT PUTS DOWN GOES ON THE SPACE AROUND IT, WHICH IS WHAT THIS RULE IS CALLED.
     *
     * "A source absorbs what arrived and writes its own charge ONTO THE SPACE AROUND IT" - and
     * a way out is a way to a NEIGHBOUR, so what it hands down that way arrives there. It was
     * lighting the ray on the source's OWN place instead, which is what `(G/2)` does to a
     * neutral point and is not the same act: a point that splits stays where it is, and a hole
     * hands its neighbours something.
     *
     * AND THAT IS WHY A BODY COULD CATCH ITS OWN RADIATION. Left on its own place a ray spends
     * a tick there before it moves, and the tick it moves is a tick the body can move too - so
     * the two go to the same neighbour together, and the body absorbs its own ray on arriving.
     * The one it catches cancels, `-V[d] + V[d]`; the `DEG - 1` it threw away and did NOT catch
     * do not, and they come to `-\sum_{k \neq d}V[k] = +V[d]` - a push along the way it was
     * already going, worth the whole recoil of every other way out. Measured, a body asked for
     * `0.005\bar{c}` reached `0.96` and one asked for `0.15` reached `0.88`, from any mass, as
     * soon as it took a single step.
     *
     * A BODY CANNOT OUTRUN ITS OWN RADIATION, because the radiation goes at `\bar{c}` and
     * nothing goes faster. Handed to the neighbour the ray starts a cell ahead and stays a cell
     * ahead however often the body steps, so there is no tick on which it can be caught - and
     * that is a fact about the two speeds rather than a guard anybody has to remember.
     */
    const out = across(r, false);
    if (out) {
      out.active = true;
      /*
       * AND THE SPACE THAT WAY TOOK COMES BACK THE SAME WAY. This way of the hole is one of its
       * points, so it hands back one fold where it reaches, on the way its own rank picks -
       * which spreads the `ways/DEG` returns that land on one neighbour over that neighbour's
       * own ways out, rather than piling them all onto the edge just crossed.
       */
      const rec = folded(out.l), k = ((d / g.DEG) | 0) % g.DEG;
      if ((rec[k] ?? 0) > 0) rec[k] = rec[k] - 1;
    }
    budget--;
    if (arrived[d] > 0) arrived[d]--;
    /* every ray it sends costs it the recoil, wherever that ray ends up */
    const v = g.V[heading(g, d)];
    for (let i = 0; i < g.D; i++) s.momentum[i] -= v[i] ?? 0;
  }
  },
  /**
   * ═══ AND WHAT IT PUTS IN IS ITS MASS, WHICH HAS AN EQUATION ═══════════════════════════
   *
   *     \bar{m} = l.choose\paren{\bar{m}_{x}·l.DEG·\paren{1 - \beta}}·\paren{1 - \rho}
   *               / \paren{\sigma·F·\rho}
   *
   * which is `gravity.saturation`, and every name in it is one the model already has:
   *
   *   `l.choose(\bar{m}_{x}·l.DEG)`  what the source picks under its own ceiling - which
   *       connections it activates and how often per connection. That is `(G/S.1)`, the one
   *       freedom a source has, and absent it is the flat choice: every way at the ceiling.
   *   `\paren{1 - \beta}`  THE MASS/VELOCITY TRADEOFF, which is `(G/S.v)` met by `(G/S.1)`: a
   *       tick spent crossing a cell is a tick not spent shining, so a thing that is always
   *       moving cannot also tell the universe it has mass.
   *   `\paren{1 - \rho}/\rho`  the vacuum it is announcing itself INTO.
   *   `\sigma`, `F`  the meeting's own rate and its facing factor, which the line already names.
   *
   * MASS IS BRIGHTNESS AND THAT IS WHY ONE EXPRESSION DOES BOTH. "Since the rays are what
   * causes spatial annihilation which is what influences movement, mass is simply how many of
   * these rays we're able to emit from a source." So this is what it radiates, what it weighs,
   * and what the line's source term comes to - one quantity, with nowhere for three readings of
   * it to disagree.
   */
  /*
   * AND `\paren{1 - \beta}` IS NOT WRITTEN HERE, BECAUSE THE RULE ALREADY ASKS IT.
   *
   * `EMISSION` is `at.point.of(owns).of(acting)`, and `acting` is `spare(point)` - "whether what
   * owns this place still has its action to spend" - whose share is `1 - \beta` by `not` of
   * `moving`. The reading multiplies a rule's gates into its term, so the tradeoff reaches the
   * line from the condition that IS the tradeoff. Written here as well it is the same condition
   * counted twice and the term came out `\paren{1 - \beta}^{2}` - which `Language` warns about in
   * as many words: "ONE CONDITION SAID TWICE IS SAID ONCE."
   *
   * The article writes it inside `l.choose` because the article is not separating the gate from
   * the quantity; the line factors it out front, and it is the same equation either way.
   */
  /*
   * AND WHAT IT DECLARES IS WHAT IT EMITS, NOT WHAT THAT IS WORTH.
   *
   *     l.choose\paren{\bar{m}_{x}·l.DEG}
   *
   * which is `(G/S.1)` and nothing more: how many of its ways it lights per tick, and which.
   * That is the only thing a source knows about itself.
   *
   * WHAT IT IS WORTH IS DERIVED FROM IT AND IS NOT DECLARED HERE. `gravity.mass` puts this
   * through the skin law over a growing shell and `gravity.saturation` takes that to the limit,
   * arriving at `\bar{m} = l.choose\paren{\bar{m}_{x}l.DEG}\paren{1 - \rho}/\paren{\sigma F \rho}`.
   * Declaring THAT here would be the same law written twice - once as a source's property and
   * once as a theorem - free to disagree, which is the fault this whole arrangement exists to
   * prevent. `Prove` reads this fact and derives the rest.
   */
  /*
   * AND IT KEEPS `l.choose`'s OWN FORM, WHICH IS A CALL AND NOT A PRODUCT.
   *
   *     l.choose\paren{\bar{m}_{x}·l.DEG·\paren{1 - \beta}}
   *
   * `l.choose` is the source CHOOSING - which of its `l.DEG` connections it activates, at
   * `\bar{m}_{x}` apiece - so the ways and the rate are its ARGUMENT and not factors beside it.
   * Written as a product it says the choice is a number the emission is multiplied by, which is
   * a different claim: what a source picks is which of the exits, and that is what it is applied
   * TO. `gravity.mass` and `gravity.saturation` print it as a call for that reason, and a
   * declaration in another shape would not be the same quantity.
   *
   * AND `\paren{1 - \beta}` IS INSIDE IT BECAUSE IT IS A CHOICE. The model's own restriction is
   * one way out on the tick a body moved along it - `emits`, above. Going quiet in EVERY
   * direction while moving is a source deciding something further about itself, and the article
   * puts it exactly here: "I let the `l.choose` term in the mass equation ALSO SIGNAL A CHOICE
   * of multiplication with the current velocity, the `(1 - \beta)`". A gate on the rule would
   * make it the medium's law; an argument to the choice makes it the source's, which is what it
   * is.
   */
  call("l.choose", mul(field("\\bar{m}_{x}"), field("l.DEG"),
                       minus(num(1), field("\\beta")))),
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
/**
 * WHERE A STEP ACTUALLY LANDS — `turns`, the same question `MOVEMENT` asks of a ray, asked of
 * the way out a body has earned.
 *
 * A BODY DOES NOT WALK A LATTICE, IT WALKS THE SPACE THAT IS THERE. `outward` stood here and
 * it reads the way out as though nothing had ever happened to it: a rigid step along the exit,
 * the same cell over whatever the vacuum has destroyed round about. But a place that has
 * swallowed folds has MORE ways through it than its own exits — "carry straight on with weight
 * one and take a folded way with the weight that way was folded" — and that is the whole of
 * how anything curves here. It is not a second mechanism bolted on beside the step; it IS the
 * step, and a body leans toward where more has been folded for exactly the reason a ray does.
 *
 * SO THE PULL IS `MOVEMENT` AND NOT A FORCE. Nothing in this asks where another body is, how
 * heavy it is, or how far away — the body reads the record where it STANDS and goes the way
 * that record leans. What put the record there is the other body's radiation annihilating
 * against its own, which is `\bar{m}\bar{m}'`, and it arrives late because it had to travel.
 * The momentum the vacuum hands it is real and it is measured in `radiate`, but it is the
 * smaller effect by orders and the dynamics are not built on it.
 */
const leans = (r: any) => turns(it).read({ at: [r], in: [] })?.l;

export const propel = putIn(
  "a body carries the momentum the vacuum gives it and crosses a cell when it has earned one",
  (e: Env) => {
    /*
     * ASKED OF THE PLACE IT STANDS ON, AND OF NOTHING ELSE.
     *
     * IT WAS A RULE OF THE WORLD AND THAT IS A GLOBAL REGISTRY, not a locality. It took the
     * whole box as its match and walked `w.sources` - every body there is, in the order they
     * happened to be added - so how one thing moved was decided by a loop over all of them.
     * Nothing in that loop was USED across bodies, which is exactly what made it easy to miss:
     * it read like a rule about one body and it was quantified over all of them, so anything
     * that later wanted to know about another body could reach for it with nothing in the way.
     *
     * A BODY IS A HOLE IN THE SPACE AT ONE PLACE, so where it goes is a question that place can
     * answer: what it is carrying, what it has earned, what ways out this place has, and what
     * is folded here. Every one of those is here. Nothing asks where another body is, how heavy
     * it is, or how far away - and now nothing CAN, because the world is not handed over.
     */
    const l: any = e.at[0];
    const s: Source = l.source;
    if (!s) return;
    const g = l.world.geometry as Geometry, D = g.D;

    s.stepped = false;
    if (!s.moves) return;

    /*
     * x ADVANCES AT v: what it is carrying moves it on, every tick, whether or not anything is
     * pushing it this one — AND `v` IS `p/\bar{m}`, WHICH WAS THE HALF OF NEWTON MISSING HERE.
     *
     * The two lines above say "SPLIT IN TWO IT IS NEWTON, and it is the same two lines the
     * textbook is". The textbook's two lines are `\dot{x} = p/\bar{m}` and `\dot{p} = F`, and
     * only the second one was written: this read `advance += momentum`, which is `v = p`, which
     * is a body whose mass is one whatever it is made of. A single ray landing on it then
     * bought a whole cell a tick — measured, a body put down at rest in an undisturbed vacuum
     * absorbed one ray on its first tick and left at `\bar{c}` — so nothing was ever slow
     * enough to be pulled on, and no mass could be told from any other.
     *
     * AND THE MASS IS THE ONE THE SOURCE HAS, `\bar{m}_{x} \cdot ways`, which is what it is
     * joined on to the space by. Heavier is more connections, and more connections is more to
     * shift for the same arrival.
     */
    const m = mass(g, s);
    for (let i = 0; i < D; i++) s.advance[i] += s.momentum[i] / m;

    // the exit it has most nearly earned, and whether it has earned it
    let best = -1, most = 0;
    for (let d = 0; d < g.DEG; d++) {
      const along = dot(s.advance, g.U[d]);
      if (along > most) { most = along; best = d; }
    }
    if (best < 0 || most < g.steps[best]) return;

    /*
     * IT MOVES BY BEING SOMEWHERE ELSE, which is all a region can do — and where that is, is
     * `turns`, which is the one rule about how anything curves. `MOVEMENT` does not carry a
     * thing straight on: it asks the place it is standing what ways through it there are, and
     * a place that has swallowed folds has more than its own exits. A BODY IS BENT BY WHAT IS
     * FOLDED WHERE IT STANDS AND BY NOTHING ELSE.
     */
    const there = leans(l.rays[best]);
    if (!there) return;                                  // it would leave the world
    /*
     * AND IT CANNOT MOVE INTO WHAT IS ALREADY THERE. Without this two bodies driven at each
     * other interpenetrate and come out the far side. It is not a question about another BODY -
     * it is whether the place this step leads to is free, which is a fact about that place and
     * is one step away, which is as far as a step reaches. It keeps its momentum when it is
     * blocked, so what happens next is decided by the force.
     */
    if (there.source && there.source !== s) return;

    /*
     * AND IT PAYS FOR THE WAY IT ACTUALLY TOOK, WHICH IS NOT ALWAYS THE ONE IT EARNED.
     *
     * `turns` keeps the earned way with weight one and takes a folded way with the weight that
     * way was folded, so where the body LANDS is a draw. Charging `best` regardless gave a body
     * carried down a folded way its displacement for free and debited its remainder for a step
     * it did not take - a standing drift along the record with nothing paying for it.
     */
    let took = best;
    for (let d = 0; d < g.DEG; d++)
      if (outward(l.rays[d])?.target?.source?.l === there) { took = d; break; }

    /*
     * AND WHAT IS BENT IS THE BODY, NOT JUST ITS POSITION — the momentum turns with the step.
     *
     * `turns` sent it down a folded way rather than the way it had earned, and that is the
     * whole of how anything curves here. But a curve is a change of HEADING: a thing carried
     * round a bend leaves it going the new way, not the old way with a kink in its path. This
     * moved the body and left what it was carrying pointing where it used to be going.
     *
     * AND THAT DOES NOT SETTLE, IT SPIRALS. `advance` accumulates along the momentum and a step
     * pays for the way actually taken, so with the two pointing different ways the payment
     * never cancels the accumulation - it is a random walk with a drift on top, and the body
     * earns another step almost at once. Measured on `gravity.rain`'s own pair: within fifty
     * ticks each body was stepping EVERY tick, so `spare` was never true, so `EMISSION` never
     * fired again - and `EMISSION` is what hands the folds back, so the record where it stood
     * ran away, `keeps` went to nought, every step became a pure draw from the record, and it
     * stepped every tick for ever. The panel showed two bodies that shine once and then go
     * dark, with their momentum frozen at the value it had when they stopped.
     *
     * SO THE HEADING FOLLOWS THE STEP. What it carries keeps its size - nothing here is a force
     * and nothing is added or lost - and points the way the place sent it. Then `advance` and
     * the momentum agree again, a step costs what it earned, and a body moves at `p/\bar{m}`
     * whatever the space around it is doing. THIS IS WHERE GRAVITY GETS IN: the body leaves
     * each bend going a little more toward wherever more has been folded, and over many steps
     * that is a path curving toward mass, arrived at from a local draw rather than a force.
     */
    if (took !== best) {
      let carry = 0;
      for (let i = 0; i < D; i++) carry += s.momentum[i] * s.momentum[i];
      carry = Math.sqrt(carry);
      const u = g.U[took];
      for (let i = 0; i < D; i++) s.momentum[i] = carry * (u[i] ?? 0);
    }

    l.source = null;
    there.source = s;
    s.locals = [there];
    s.moved++;
    /* it spent this tick's action getting here, so it has none left to shine with */
    s.stepped = true;
    /* THE STEP IS PAID FOR OUT OF THE REMAINDER, and the momentum is not touched - which
     * is the whole of the difference between a thing that coasts and a thing that does not */
    for (let i = 0; i < D; i++) s.advance[i] -= (g.V[took][i] ?? 0);
  },
);
