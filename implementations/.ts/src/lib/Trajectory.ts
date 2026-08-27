/**
 * FOLLOWING ONE RAY THROUGH THIS MEDIUM — the instrument, kept apart from anything that
 * uses it.
 *
 * IT LIVES HERE BECAUSE TWO DIFFERENT THINGS NEED IT AND NEITHER MAY IMPORT THE OTHER.
 * `tests/ledger.ts` measures what the model does against what matter does; `theorems/`
 * derives laws from the rules and must not reach into a test to do it. What both want is
 * the same small thing: a ray's own history — how far it went, how far it got, how often
 * it bent, and whether it bent inside matter or in the open.
 */
import { Geometry, GEOMETRIES, busy, outward } from "./Local.ts";
import { Graph } from "../backends/CPU.graph.ts";

/**
 * ONE STRUCTURE, READ THE WAY A NUCLEUS IS READ — and every field of it is a COUNT,
 * because a count is the only thing a lattice hands out for free.
 *
 * SURFACE IS THE ONE THAT MATTERS AND IT IS THE ONE NOBODY WAS TAKING. A structure's mass
 * is its point count; its surface is how many of those points touch something that is not
 * it. For a compact body in D dimensions surface goes as mass^((D−1)/D), and for dust or a
 * filament it goes as mass itself. THAT EXPONENT IS THE WHOLE OF THE VOLUME-AGAINST-SURFACE
 * COMPETITION, measured without an embedding, without coordinates and without a radius —
 * which matters because this lattice EXPANDS, so a coordinate is a thing it does not
 * reliably have and a count is a thing it always does.
 */
export type Structure = {
  mass: number;
  surface: number;
  /** net charge over the rays it holds — the sum `G^XOR+XOR` says grows with mass */
  q: number;
  /** net polarity, for telling charge apart from the sign it might merely be copying */
  p: number;
  /**
   * HOW MANY SIGNED RAYS IT HOLDS AT ALL - the denominator `q` has never had.
   *
   * `charge.attraction` derives the force between two bodies as
   * `F_meet·(1 - P_a·P_b)`, where P is a BIAS: the fraction of a body's rays that are
   * positive, doubled and shifted, so it lives in [-1, 1] however big the body is. Read
   * the product out and the electric part of the force is `-(m_a·P_a)(m_b·P_b)`, so what
   * plays the part of a charge is `m·P` and the charge-to-mass ratio is P itself.
   *
   * WHICH MEANS THE MODEL PREDICTS A CEILING RATHER THAN AN INTEGER, and nothing here
   * has ever measured against it: `q` is a plain sum, so it grows with the number of
   * points and always did, and the ledger reads that growth as the failure. The bounded
   * quantity is `q / gross`, and it is not the same complaint at all. This is the
   * denominator, counted in the same walk.
   */
  gross: number;
  /** space unmade at its points — the model's binding energy, in the unit gravity is in */
  destroyed: number;
};

export type Reading = {
  ticks: number;
  /** loose points: the vacuum */
  points: number;
  /** folded points: the matter */
  folded: number;
  structures: Structure[];
  /**
   * LOOSE POINTS THAT ARE HOLDING SOMETHING — the footprint of all matter in the vacuum,
   * and what (G/2) is actually refused AT.
   *
   * `blocks` is `contained(l).length > 0`, so the split is refused once per HOST and not
   * once per point of matter. A structure of a thousand points folded twenty deep occupies
   * fifty hosts and casts a fifty-point shadow, not a thousand-point one. That distinction
   * is the whole of why the shadow can be derived rather than measured: it is a count of
   * places, and places are what the lattice hands out.
   */
  hosts: number;
  /**
   * AND THE TWO COUNTS THE RULE ACTUALLY GATES ON — points that reach the `blocks` test at
   * all, and how many of those are holding something.
   *
   * `CREATION` asks `busy(l)` BEFORE it asks `blocks(l)`, so a point already carrying a ray
   * returns early and never reaches the blocked branch. That is not a detail: measured,
   * 1151 points were hosting matter and only 301 of them ever got as far as the test —
   * matter's own footprint is BUSIER than the vacuum around it, because matter radiates.
   * Reading the shadow as hosts/loose ignores the gate and comes out at 0.142 against the
   * 0.067 the rule actually produced. With the gate it is 0.0645, and the rule's own
   * counter is 0.0674.
   */
  freePoints: number;
  freeHosts: number;
  /**
   * AND THE EXPANSION RULE'S OWN COUNTERS OVER THE LAST TICK ALONE.
   *
   * `split` and `blocked` accumulate over the whole run, and the world GROWS through it —
   * so their ratio is a time average taken over a vacuum that had far less matter in it at
   * the start than at the end. `hosts/loose` is the state now. Comparing the two at face
   * value put them 1.8 apart and that gap is entirely the averaging: the same category
   * error as setting a share against a part, made again one level along. The last tick is
   * the one that can be set beside a final-state count.
   */
  splitLast: number;
  blockedLast: number;
  /** what `G^XOR^c` counts as it runs */
  corners: number;
  radiated: number;
  qMade: number;
  made: number;
  moved: number;
  turnsTaken: number;
  /**
   * ACTIVE-RAY-TICKS — how many times a ray was asked where it was going, over the whole
   * run. `steer` increments it once per active ray per tick BEFORE it decides anything, so
   * it is exactly the denominator a duty fraction needs and it costs nothing to have.
   */
  rayTicks: number;
  /**
   * ONE LIVE RAY, SAMPLED — how far it has actually GOT against how far it has gone.
   *
   * `steps` is path length: a ray crosses one cell a tick, so the number of steps it has
   * taken IS the distance it has travelled at c. `drift` is |Σ d̂| over those steps divided by
   * `steps` — the net displacement as a fraction of the path. A ray that never turns has
   * drift 1; a ray that comes all the way round has drift 0; and everything in between is
   * a RELATIVE velocity, which is the only kind of velocity this model has room for.
   */
  rays: { steps: number; drift: number; turns: number; bends: number; bin: number }[];
  split: number;
  blocked: number;
  annihilations: number;
};

/**
 * FOLLOWING ONE RAY, WHICH TAKES A CARRIED CHANNEL AND CANNOT BE DONE WITHOUT ONE.
 *
 * THE MISTAKE THIS REPLACES IS WORTH KEEPING. The first attempt tracked rays by their row
 * index — accumulate a heading per index, close the life when the index goes quiet. It
 * reported v = 1.0000 ± 0.0000 across every seed, which is not a measurement, it is a
 * tautology wearing one. A RAY DOES NOT STAY AT A ROW. A row is a (point, exit) slot; a ray
 * streams to the neighbour's slot every tick and the row it left is taken by whatever
 * arrives next. So what that code measured was how long a SLOT stayed lit, and a slot has
 * one direction for ever — d̂ summed over its own life is n·d̂ and the drift is exactly 1 by
 * construction, for any dynamics whatsoever.
 *
 * WHAT TRAVELS WITH A RAY IS WHAT IS DECLARED TO TRAVEL WITH IT. `carries` is the mechanism
 * and the theory tree already uses it for exactly this: `from` marks whose radiation a ray
 * is, `turned` counts the ring steps this ray has taken, `gyrophase` banks its part-turn.
 * Those survive a step because MOVEMENT writes them into the waiting slot and ARRIVAL swaps
 * them in. A quantity not declared that way does not survive, and no amount of care outside
 * the theory recovers it.
 *
 * SO THE TRAJECTORY IS CARRIED TOO — the step count and the running sum of headings — and
 * v = |Σ d̂| / steps is then readable off any live ray at any moment.
 *
 * AND IT IS A WRAPPER, SO NOTHING IN THE DEFAULT BUILD CHANGES. Four extra columns per ray
 * is not free and a measurement has no business making every other run pay for it. This is
 * the `withSteering` / `withRelaxation` idiom: the theory under test is the theory as
 * written, plus the instrument, and the instrument comes off.
 */
export const withTracking = <T extends { copy(): any; name: string }>(t: T) =>
  (t.copy() as any)
    .carries("steps", 0)
    .carries("a0", 0)
    .carries("a1", 0)
    .carries("a2", 0)
    /**
     * AND HOW MANY TIMES IT HAS CHANGED DIRECTION AT ALL — which is NOT `turned`.
     *
     * `turned` counts ring steps, and a ring step is not the only thing that bends a ray
     * here. A MEETING BETWEEN ALIKE POLARITIES REVERSES ONE — (G+M/3), the oldest rule in
     * the model — and it does not touch `turned`, because `turned` belongs to `steer` and
     * `steer` is not what did it.
     *
     * MEASURED, THAT DISTINCTION IS THE WHOLE OF A MISSING QUARTER. With m read as the ring
     * steps alone, m = 0.0064 against a drift of 0.749: the rays wander far too much for the
     * turning that was being counted, and m + v came out at 0.755 rather than 1. Counting
     * every heading change instead gives m = 0.412, of which the cyclotron is 1.6%. THE
     * MASS IN THIS MODEL IS MADE BY MEETINGS AND NOT BY THE FIELD, which is worth knowing
     * about a theory whose whole argument is that a charge is bent round by a polarity field.
     *
     * WHAT IT CANNOT COUNT IS `BLOCKED`, AND THE REASON IS THE SAME REASON. That rule does
     * not bend a ray, it REPLACES one: `seat.active = true` with the polarity and charge
     * copied across, then `clear(r)`. `clear` wipes every carried channel, so the ray that
     * comes out of a block has no history — it is a new ray as far as anything carried is
     * concerned, and the same is true of the recoil a corner throws off. Those events
     * TRUNCATE a life rather than bending it, which biases the sample towards rays that
     * were never blocked. `truncation` below is how much of the population that is.
     */
    .carries("bends", 0)
    .carries("lastD", -1)
    /**
     * AND WHETHER THE BEND HAPPENED INSIDE MATTER — the third term, and the one the whole
     * accounting was missing.
     *
     * A THING CAN BE AT REST AND STILL BE LIGHT, which `1 = m + v` cannot say. Set v to
     * nought and the identity hands every last unit of the budget to m, so anything that
     * has stopped is maximally heavy — and that is plainly not how matter works. What the
     * relation leaves out is that motion can be lost WITHOUT BECOMING INERTIA: a ray bent
     * inside a structure is turning round to hold that structure together and to run its
     * clock, and the space it unmakes there is the structure's binding rather than its mass.
     *
     * WHICH IS THE SHADOW, AND THIS MODEL ALREADY HAS IT UNDER ANOTHER NAME. `blocks` says
     * where (G/2) may not fire, and it is asked of exactly this question — is this point
     * holding something. Every suppressed split is a unit of expansion that matter's
     * presence cancelled, which is what gravity IS here. So a bend inside matter and a
     * blocked split are two readings of one quantity, and the point of carrying this is
     * that they can then be MEASURED AGAINST EACH OTHER rather than assumed equal.
     */
    .carries("bin", 0)
    /**
     * (TRACK) EVERY RAY REMEMBERS WHERE IT HAS BEEN — declared last, so it runs after
     * ARRIVAL and sees the world settled.
     *
     * THE EXIT A RAY IS SITTING ON IS THE STEP IT JUST TOOK. A ray that streamed along d
     * arrives into the target's slot for d, so reading its slot after arrival reads the
     * displacement it has this tick — INCLUDING A STEERED ONE, which arrives on the exit it
     * turned onto rather than the one it set out along. Nothing has to be told what the
     * turn did: the ray is already standing where it went.
     */
    .rule("TRACK", "Local", (l: any) => {
      const g = l.world.geometry, rays = l.rays as any[];
      for (let d = 0; d < rays.length && d < g.DEG; d++) {
        const r = rays[d];
        if (!r?.active) continue;
        const u = g.U[d];
        if (!u) continue;                  // a bead's numbering names no direction
        r.steps = (r.steps ?? 0) + 1;
        r.a0 = (r.a0 ?? 0) + (u[0] ?? 0);
        r.a1 = (r.a1 ?? 0) + (u[1] ?? 0);
        r.a2 = (r.a2 ?? 0) + (u[2] ?? 0);
        /* the first step has nothing to have bent away from */
        if ((r.lastD ?? -1) >= 0 && r.lastD !== d) {
          r.bends = (r.bends ?? 0) + 1;
          /* asked of this point and what is held at it, which is the only kind of question
           * either layer may put to the other — the same test `blocks` makes */
          if (((l.backend?.contained?.(l) ?? []).length > 0)) r.bin = (r.bin ?? 0) + 1;
        }
        r.lastD = d;
      }
    })
    .called(`${t.name} [tracked]`);

/**
 * RUN THE MATTER MODEL ONCE AND READ IT — the same way `visuals/MATTER.ts` does, because
 * a reading taken a different way is a reading of a different thing.
 *
 * `turnLog` HAS TO BE ARMED OR THERE IS NO MATTER AT ALL. `steer` records a turn only
 * where something is listening, and `TURNING` is the rule that folds points; a world that
 * does not set it runs the vacuum and nothing else, and reports zero structures as though
 * that were a finding. It is not — it is the mechanism never having been switched on.
 */
/**
 * MATTER WITHOUT CONTAINMENT — a body as a REGION WHERE TURNING IS HAPPENING, and it does
 * not have to be a tidy orbit.
 *
 * `bodiesOf` reads matter as connected hosts, which needs matter to be a second kind of
 * thing living in a containment relation. `G^XOR^o` has no such thing: everything is on the
 * one graph, and what makes a place matter is that charges are being BENT there rather than
 * passing through. So the question a point asks is the same shape as everywhere else — is
 * anything on me turning, and is my neighbour turning too — and a body is what that relation
 * connects.
 *
 * IT DOES NOT REQUIRE A CLOSED ORBIT, WHICH IS THE POINT. Reading matter as `r.turned >=
 * CYCLE` asks one ray to survive its own circumference, and at this occupancy almost none
 * do: measured, 94.3% of ray-ticks have taken no ring step at all and nothing that closes
 * lasts to the end of a run. But a REGION can be persistently full of turning without any
 * single ray going all the way round — the same way a vortex is a real thing without any
 * one molecule completing a circuit. That is the aggregate reading, and it is the one a
 * lattice this dense can actually support.
 *
 * MASS IS HOW MANY POINTS ARE TURNING, which is the only count available: there is no
 * containment to measure depth with, so a body's size is its extent.
 */
export const turningBodies = (b: any, g: Geometry) => {
  const spun = new Map<number, number>();
  const at = new Map<number, any>();
  b.eachLocal?.((l: any) => {
    let most = 0;
    for (const r of l.rays as any[]) if (r.active) most = Math.max(most, r.turned ?? 0);
    if (most > 0) { spun.set(l.i, most); at.set(l.i, l); }
  });

  const seen = new Set<number>();
  const bodies: { points: any[]; mass: number; turns: number }[] = [];
  for (const [i0, start] of at) {
    if (seen.has(i0)) continue;
    seen.add(i0);
    const points: any[] = [], stack = [start];
    let turns = 0;
    while (stack.length) {
      const x = stack.pop();
      points.push(x);
      turns += spun.get(x.i) ?? 0;
      /* THE LOCAL RELATION: my neighbour, by my own exits, is also turning */
      for (const r of x.rays as any[]) {
        const y: any = outward(r)?.target?.source?.l;
        if (!y || !spun.has(y.i) || seen.has(y.i)) continue;
        seen.add(y.i);
        stack.push(y);
      }
    }
    bodies.push({ points, mass: points.length, turns });
  }
  return { spun, bodies };
};

export const readingOf = (
  theory: any,
  {
    N = 1, seed = 1, ticks = 60, bound = 12_000,
    geometry = GEOMETRIES["fcc-12"] as Geometry,
    /* WHAT MATTER IS IN THIS THEORY — `held` for one that folds matter into containers,
     * `turning` for one where everything is on the main graph. Not a knob: the two theories
     * mean different things by the word, and a reading that assumed one would report the
     * other's vacuum as empty of matter. */
    matter = "held" as "held" | "turning",
  } = {},
): Reading => {
  /* THE INSTRUMENT GOES ON HERE AND NOWHERE ELSE — see `withTracking`. Both the store and
   * the world must be built from the SAME theory object, or the columns the store lays
   * down are not the columns the rules write to. */
  const t = withTracking(theory);
  const backend = geometry.seed(
    new Graph(t, seed, bound, geometry.DEG * 2, true, true, true, true), N);
  const w: any = t.seed({ N, seed, geometry, bound, backend } as any);
  w.turnLog = [];

  /*
   * SAMPLED EVERY TICK OFF THE RAYS THAT ARE ALIVE, and weighted by the path each has
   * already walked — which is what makes it an ensemble average over PATH rather than over
   * rays, and so the same average the drift is defined as.
   *
   * A RAY OF FEWER THAN FOUR STEPS IS NOT ASKED. It has not had room to turn — the tightest
   * orbit the lattice expresses is CYCLE steps — so its drift is 1 whatever the dynamics
   * would have done to it given longer, and including it measures how short the lives are
   * rather than how straight they are. That is a real fact about this vacuum and it belongs
   * in `lives`, not in `v`.
   */
  const D = geometry.D;
  const sampled:
    { steps: number; drift: number; turns: number; bends: number; bin: number }[] = [];

  let splitLast = 0, blockedLast = 0;
  for (let tick = 0; tick < ticks; tick++) {
    const s0 = w.split ?? 0, b0 = w.blocked ?? 0;
    w.tick();
    splitLast = (w.split ?? 0) - s0;
    blockedLast = (w.blocked ?? 0) - b0;
    backend.eachLocal?.((l: any) => {
      for (const r of l.rays as any[]) {
        if (!r?.active) continue;
        const n = r.steps ?? 0;
        /* COLLECTED FROM TWO STEPS UP AND CUT LATER. Where the cut goes is an analysis
         * choice and it turned out to matter, so it must not be baked into the sampling —
         * see `tradeoffAt`, which varies it and reports whether anything survives. */
        if (n < 2) continue;
        const a = [r.a0 ?? 0, r.a1 ?? 0, r.a2 ?? 0];
        let m2 = 0;
        for (let i = 0; i < D; i++) m2 += a[i] * a[i];
        sampled.push({
          steps: n, drift: Math.sqrt(m2) / n,
          turns: r.turned ?? 0, bends: r.bends ?? 0, bin: r.bin ?? 0,
        });
      }
    });
  }

  const b: any = w.backend;

  let hosts = 0, freePoints = 0, freeHosts = 0;
  b.eachLocal?.((l: any) => {
    const held = (b.contained?.(l) ?? []).length > 0;
    if (held) hosts++;
    /* the two gates CREATION applies first, in its order — see `freePoints` */
    if (l.source || busy(l)) return;
    freePoints++;
    if (held) freeHosts++;
  });

  /*
   * AND A STRUCTURE IS MATTER NEXT TO MATTER — see `bodiesOf`, and the two readings it
   * replaced. A body's mass is what its hosts hold; its surface is the hosts with a
   * neighbour that holds nothing.
   */
  const asTurning = matter === "turning";
  const { held, bodies } = asTurning
    ? (() => { const t = turningBodies(b, geometry);
               return { held: t.spun,
                        bodies: t.bodies.map(x => ({ hosts: x.points, mass: x.mass })) }; })()
    : bodiesOf(b, geometry);
  const inBody = new Map<number, number>();
  bodies.forEach((body, k) => { for (const h of body.hosts) inBody.set(h.i, k); });

  const structures: Structure[] = bodies.map((body, k) => {
    let surface = 0, q = 0, p = 0, gross = 0, destroyed = 0;
    for (const h of body.hosts) {
      destroyed += h.destroyed ?? 0;
      for (const x of (b.contained?.(h) ?? []) as any[])
        for (const r of x.rays as any[]) if (r.active) {
          q += r.charge ?? 0; p += r.polarity ?? 0;
          if (r.charge) gross++;
        }
      let open = false;
      for (const r of h.rays as any[]) {
        const nb: any = outward(r)?.target?.source?.l;
        if (nb && inBody.get(nb.i) !== k) { open = true; break; }
      }
      if (open) surface++;
    }
    return { mass: body.mass, surface, q, p, gross, destroyed };
  });
  void held;

  return {
    ticks, points: b.size?.() ?? 0, folded: b.foldedSize?.() ?? 0, hosts,
    freePoints, freeHosts, splitLast, blockedLast, structures,
    corners: w.corners ?? 0, radiated: w.radiated ?? 0, qMade: w.qMade ?? 0,
    made: w.made ?? 0, moved: w.moved ?? 0, turnsTaken: w.turnsTaken ?? 0,
    rayTicks: w.steered ?? 0, rays: sampled,
    split: w.split ?? 0, blocked: w.blocked ?? 0,
    annihilations: b.stats?.annihilations ?? 0,
  };
};

const mean = (xs: number[]) => xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN;

const sd = (xs: number[]) => {
  if (xs.length < 2) return NaN;
  const m = mean(xs);
  return Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1));
};

const corr = (xs: number[], ys: number[]) => {
  if (xs.length < 3) return NaN;
  const mx = mean(xs), my = mean(ys);
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < xs.length; i++) {
    const a = xs[i] - mx, b = ys[i] - my;
    sxy += a * b; sxx += a * a; syy += b * b;
  }
  return sxx > 0 && syy > 0 ? sxy / Math.sqrt(sxx * syy) : NaN;
};

/** ordinary least squares slope of y on x — the only fit in this file */
const slope = (xs: number[], ys: number[]) => {
  if (xs.length < 3) return NaN;
  const mx = mean(xs), my = mean(ys);
  let sxy = 0, sxx = 0;
  for (let i = 0; i < xs.length; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; }
  return sxx > 0 ? sxy / sxx : NaN;
};

/** structures big enough to have an inside and an outside — one point has neither */
/**
 * WHERE THE STRUCTURES ARE — and the answer is that a structure is not found, it is WHERE
 * MATTER IS NEXT TO MATTER.
 *
 * THIS FILE HAS NOW BEEN WRONG ABOUT IT TWICE AND BOTH WAYS WERE THE SAME MISTAKE. First a
 * flood fill over the folded set, which came back as one component holding 93.5% of
 * everything; then a watershed over how much each point holds, which came back as 1,330
 * "structures" of which 1,197 were a single point. One said matter is a single runaway
 * blob and the other said it is dust, of the same world, at the same tick.
 *
 * BOTH WERE ALGORITHMS IMPOSED FROM OUTSIDE. A flood fill and a watershed are things done
 * TO a set of points by something standing over the whole board — and this model does not
 * allow that question anywhere else. Every rule in it is about one point and what is at it.
 * A structure that only exists when a global pass says so is not a thing the model has.
 *
 * AND THE FLOOD FILL WAS WALKING A GRAPH THAT IS NOT THERE. `folding: "keep"` never rewires
 * a folded point's rays, so they still point where that point USED TO BE: measured over
 * 52,224 edges, 60.1% joined matter whose hosts are not neighbours. The one blob was an
 * artefact of stale links.
 *
 * SO WHAT IS LEFT IS WHAT THE MODEL ALREADY SAYS. `MOVING`'s own words: a point of matter
 * is contained in a loose point and THAT CONTAINMENT IS WHERE IT IS. So matter's geometry
 * is its hosts' geometry, and two pieces of matter are part of one body when their hosts
 * are NEIGHBOURS — a question about one point and its own exits, which is the only kind
 * this model permits.
 *
 * IT IS STILL ASSEMBLED BY A WALK HERE, and that is a measurement standing outside the
 * world rather than a rule inside it — a reader counting bodies, not the model deciding
 * what one is. The distinction that matters is that the RELATION being walked is local:
 * `is my neighbour also holding matter` is decided at each point by that point, and the
 * walk only collects what those local answers already imply.
 */
export const bodiesOf = (b: any, g: Geometry) => {
  /** what each host holds — matter's position IS its host's position */
  const held = new Map<number, number>();
  const at = new Map<number, any>();
  b.eachLocal?.((l: any) => {
    const n = (b.contained?.(l) ?? []).length;
    if (n > 0) { held.set(l.i, n); at.set(l.i, l); }
  });

  const seen = new Set<number>();
  const bodies: { hosts: any[]; mass: number }[] = [];
  for (const [i0, start] of at) {
    if (seen.has(i0)) continue;
    seen.add(i0);
    const hosts: any[] = [], stack = [start];
    let mass = 0;
    while (stack.length) {
      const x = stack.pop();
      hosts.push(x);
      mass += held.get(x.i) ?? 0;
      /* THE LOCAL RELATION: my neighbour, by my own exits, is also holding matter */
      for (const r of x.rays as any[]) {
        const y: any = outward(r)?.target?.source?.l;
        if (!y || !held.has(y.i) || seen.has(y.i)) continue;
        seen.add(y.i);
        stack.push(y);
      }
    }
    bodies.push({ hosts, mass });
  }
  return { held, bodies };
};

const real = (r: Reading) => r.structures.filter(s => s.mass >= 4);

/**
 * IS THE SIZE DISTRIBUTION PEAKED OR SCALE-FREE — the one number that decides whether this
 * model can have KINDS of matter, and it is decidable from a single snapshot.
 *
 * WHY THE SHAPE IS THE QUESTION AND NOT THE SPREAD. A characteristic size is always two
 * rates competing: a nucleus is volume against surface, a star is pressure against gravity,
 * a droplet is bulk against tension. Where two rates cross there is ONE size at which they
 * balance and the population piles up near it — a PEAK. Where only one rate is at work,
 * nothing distinguishes any size from any other, growth is self-similar, and the population
 * comes out a POWER LAW. So the shape says how many rates are running, without anybody
 * having to identify them.
 *
 * FITTED IN LOGARITHMIC BINS, because a power law is straight in log-log and linear bins
 * put almost every structure in the first one. Each bin is divided by its width in linear
 * size, or the wide bins read as denser than they are.
 *
 * THIS IS THE MEASUREMENT THAT TIES TEN FACTS TO ONE. Six of the ledger's nuclear entries
 * and four of its bulk ones are filed `needs-scale` — separate facts about the world, one
 * absence in the model. This says whether that absence is there.
 */
export const sizeLaw = (r: Reading) => {
  const m = r.structures.filter(s => s.mass >= 2).map(s => s.mass);
  if (m.length < 8) return { alpha: NaN, r2: NaN, n: m.length, decades: 0 };
  const lo = Math.log(2), hi = Math.log(Math.max(...m));
  const decades = (hi - lo) / Math.LN10;
  /*
   * AND A POWER LAW NEEDS ROOM TO BE ONE. A power law is a claim about scale INVARIANCE, so
   * it is only a claim at all across scales: fitted to sizes running 2 to 9 - two thirds of
   * one decade, four or five occupied bins - a straight line in log-log distinguishes
   * nothing. An exponential is straight over that range. So is a gaussian tail. So is
   * almost any falling function.
   *
   * MEASURED, THAT IS EXACTLY WHAT HAPPENED: r^2 came back 0.973 and was very nearly
   * reported as "the sizes are scale-free, so the model has no preferred size". It says no
   * such thing. The population is too narrow for the question to have an answer, and a fit
   * with a high r^2 over no range is the third artefact of this kind in this file - after
   * a share read against a part, and a flood fill read as a body.
   *
   * ONE DECADE IS THE FLOOR. Below it the probe returns nothing, which is what "we cannot
   * tell" looks like when it is said honestly.
   */
  const B = 8, w = (hi - lo) / B;
  if (!(w > 0) || decades < 1) return { alpha: NaN, r2: NaN, n: m.length, decades };
  const count = new Array(B).fill(0);
  for (const x of m) count[Math.min(B - 1, Math.floor((Math.log(x) - lo) / w))]++;
  const xs: number[] = [], ys: number[] = [];
  for (let b = 0; b < B; b++) {
    if (!count[b]) continue;                       // an empty bin has no logarithm
    xs.push(lo + w * (b + 0.5));
    ys.push(Math.log(count[b] / (Math.exp(lo + w * (b + 1)) - Math.exp(lo + w * b))));
  }
  if (xs.length < 4) return { alpha: NaN, r2: NaN, n: m.length, decades };
  const a = slope(xs, ys), mx = mean(xs), my = mean(ys);
  const b0 = my - a * mx;
  let ss = 0, tot = 0;
  for (let i = 0; i < xs.length; i++) {
    ss += (ys[i] - (a * xs[i] + b0)) ** 2;
    tot += (ys[i] - my) ** 2;
  }
  return { alpha: a, r2: tot > 0 ? 1 - ss / tot : NaN, n: m.length, decades };
};

/**
 * HOW SURFACE GROWS WITH MASS — the exponent, and the single most informative number in
 * this file.
 *
 * 2/3 IS A COMPACT BODY IN THREE DIMENSIONS: double the volume and the skin goes up by
 * 2^(2/3). 1 IS DUST OR A FILAMENT: every point is on the outside, there is no inside, and
 * a volume term cannot exist because nothing is in the volume. A binding energy per nucleon
 * that PLATEAUS is exactly the statement that the volume term wins at large A, so a model
 * whose structures come out at 1 cannot have a plateau, cannot have a saturation density,
 * and cannot have a preferred size — three of this ledger's entries falling to one number.
 */

export const tradeoff = (r: Reading, least = 4) => {
  let steps = 0, drift = 0, turns = 0, bends = 0, bin = 0, n = 0;
  for (const x of r.rays) {
    if (x.steps < least) continue;
    n++;
    steps += x.steps; drift += x.drift * x.steps;
    turns += x.turns; bends += x.bends; bin += x.bin;
  }
  if (!steps) return {
    v: NaN, across: NaN, m: NaN, b: NaN, inside: NaN, bends: NaN, ring: NaN,
    sum: NaN, lives: 0, path: NaN,
  };

  /* WHAT GETS THROUGH: net displacement over path, in units of one cell a tick. This is β */
  const v = drift / steps;

  /*
   * AND WHAT IS LEFT TO CROSS WITH, IN QUADRATURE — 1 − β², not 1 − β.
   *
   * THE LINEAR FORM WAS WRONG AND WAS MEASURED BEING WRONG. A step is ONE VECTOR whose
   * magnitude this lattice fixes at one, so the part that keeps pace with the structure and
   * the part that crosses it are ORTHOGONAL COMPONENTS and their squares sum to the step's.
   * That is `budget/what-a-tick-is-spent-on`, it is where the Lorentz factor comes from, and
   * subtracting β instead of β² is the same first-reading mistake that probe's header keeps
   * on record. Measured, it is the difference between 0.136 and 0.253 — nearly a factor of
   * two, on the quantity everything below divides up.
   */
  const across = 1 - v * v;

  /*
   * AND THE CROSSING PART DIVIDES AGAIN, LINEARLY — because inside and outside are a
   * predicate's two answers rather than two directions. See `theorems/probes/rest.ts`.
   */
  const inside = bends > 0 ? bin / bends : NaN;

  return {
    v, across, inside,
    /* MASS: the crossing part that is NOT held — inertia, and what a thing weighs */
    m: Number.isFinite(inside) ? across * (1 - inside) : NaN,
    /* BINDING: the crossing part that IS held — the mass defect, and not weight */
    b: Number.isFinite(inside) ? across * inside : NaN,
    /* 1 by construction; the CLAIM is `inside` against the shadow, not this */
    sum: v * v + across,
    /* the event RATES, kept clearly labelled — reading one as a share of the budget is the
     * units error that made the first version of this miss by 0.21 */
    bends: bends / steps, ring: turns / steps,
    lives: n, path: steps / Math.max(n, 1),
  };
};

/**
 * THE SHADOW — and it is a COUNT OF PLACES, which is what lets it be derived instead of
 * fitted.
 *
 * WHAT IT IS. (G/2) fires at every point that is not busy and not holding anything. `blocks`
 * refuses it wherever a point IS holding something, and that refusal is the gravity of this
 * model — expansion that did not happen. So the shadow is the share of the vacuum's points
 * that are hosting matter:
 *
 *     shadow  =  free hosts / free points
 *
 * AND THE HOST COUNT IS NOT THE MASS. A fold puts a point INSIDE another point, and a host
 * can hold many: `density` in `G.ts` is exactly "how many points this one now stands for".
 * So a structure of M points folded ρ deep sits in M/ρ hosts and blocks M/ρ splits, not M
 * of them. Putting the two together:
 *
 *     shadow  =  φ · gate / ρ_f
 *
 * and all three of those are LOCAL AND INTENSIVE — none of them mentions how big the box is:
 *
 *   φ      matter per point of vacuum
 *   ρ_f    points of matter one host stands for, the fold depth
 *   gate   how much busier matter's own footprint is than the vacuum around it
 *
 * The extensive form — M over ρ_f over N — says the same thing, and the intensive one says
 * it without dragging the box in: a structure of a given density and a given local matter
 * fraction casts the same shadow whatever room it is in, which is what a local law should
 * do. Every one of the three is a COUNT of something the store already keeps rather than a
 * constant anybody chose.
 *
 * THE GATE IS NOT OPTIONAL AND LEAVING IT OUT WAS WORTH A FACTOR OF TWO. `CREATION` asks
 * `busy(l)` before it asks `blocks(l)`, so a point carrying a ray never reaches the blocked
 * branch however much matter it holds. Measured: 1151 hosts, of which 301 reached the test,
 * giving 0.0645 against the rule's own 0.0674 — where the ungated reading gives 0.142. A
 * derivation of a rule has to model the rule, including the order it asks its questions in.
 *
 * AND M/(ρ·N) IS A REWRITING OF hosts/N, NOT A SECOND ROUTE TO IT. ρ is DEFINED as M over
 * the host count, so the two are the same statement and no agreement between them is
 * evidence of anything. What the rewriting says — and this is the content — is that THE
 * SHADOW IS A COUNT OF PLACES AND DENSITY DIVIDES IT: fold a structure twice as deep and it
 * blocks half as many splits for the same mass, so it weighs more. The independent check is
 * against what CREATION actually did, which is `shadowCounted`.
 *
 * WHY THE WORLD SIZE BELONGS IN IT rather than being a blemish on an otherwise intrinsic
 * quantity. Gravity here IS a deficit against the ambient expansion — the same body in a
 * larger vacuum suppresses the same number of splits out of a larger number that fired, and
 * so pulls relatively less. A shadow with no N in it would be a shadow that did not care
 * how much space it was cast across, which is not what a shadow is.
 *
 * SO THE THREE THINGS THAT SET A STRUCTURE'S MASS ARE ITS MASS, ITS DENSITY, AND THE ROOM
 * IT IS IN. Two of those are its own geometry. That is where a spectrum would have to come
 * from, and it is why ρ is the quantity to look at next: it is the only one of the three
 * that nothing in this model currently pins down.
 */
export const shadow = (r: Reading) =>
  r.freePoints > 0 ? r.freeHosts / r.freePoints : NaN;

/** the same ignoring the gate — kept because the difference between the two IS the finding
 *  that matter's own footprint is busier than the vacuum it sits in */
export const shadowGeometric = (r: Reading) =>
  r.points > 0 ? r.hosts / r.points : NaN;

/** how many points of matter one host stands for — the fold depth, and the one number in
 *  the shadow that this model does not yet fix */
export const foldDensity = (r: Reading) => r.hosts > 0 ? r.folded / r.hosts : NaN;

/** matter per point of vacuum — intensive, so it says nothing about how big the box is */
export const matterPer = (r: Reading) => r.points > 0 ? r.folded / r.points : NaN;

/**
 * HOW MUCH BUSIER MATTER'S FOOTPRINT IS THAN THE VACUUM AROUND IT.
 *
 * The share of HOST points that reach the `blocks` test, over the share of ALL points that
 * do. Below one means matter's own places are busier than average — which they are, because
 * matter radiates: measured, 26% of hosts reach the test against 58% of everything, so the
 * gate is 0.45 and it SUPPRESSES the shadow by more than half.
 *
 * IT IS THE FACTOR THAT WAS MISSING AND THE ERROR WAS NOT SMALL. Writing the shadow as
 * hosts over free points — that is, taking every host to be free — gave 0.247 against the
 * 0.065 the rule produced, out by nearly four. `hosts` and `free hosts` are different
 * counts and reading one for the other is the same class of mistake as reading a share for
 * a part, made a third time on a third quantity.
 */
export const gate = (r: Reading) => {
  const openHosts = r.hosts > 0 ? r.freeHosts / r.hosts : NaN;
  const openAll = r.points > 0 ? r.freePoints / r.points : NaN;
  return openAll > 0 ? openHosts / openAll : NaN;
};

/**
 * THE SHADOW THE OTHER WAY, off the expansion rule's own counters — the check.
 *
 * `blocked/(blocked+split)` is what CREATION actually did, tick by tick, and hosts/loose is
 * what the store says it should have done. They are the same statement about the same rule
 * and neither is derived from the other, so a gap between them is a gap in the reading
 * rather than in the physics.
 */
export const shadowCounted = (r: Reading) =>
  r.splitLast + r.blockedLast > 0
    ? r.blockedLast / (r.splitLast + r.blockedLast) : NaN;

/** the same over the whole run — a time average across a growing world, and kept only so
 *  that the difference between the two is visible rather than surprising */
export const shadowAveraged = (r: Reading) =>
  r.split + r.blocked > 0 ? r.blocked / (r.split + r.blocked) : NaN;

/**
 * AND THE RELATION THE DYNAMICS ACTUALLY GIVES, rather than either of the two guesses.
 *
 * Both candidates are the same shape with a different power — m + v = 1 is p = 1 and
 * m² + v² = 1 is p = 2 — so rather than declaring one and scoring the miss, SOLVE FOR p.
 * Whatever comes out is the model's own answer, and the two guesses are then two points on
 * a line it either sits on or does not.
 *
 * BISECTED BECAUSE m^p + v^p IS MONOTONE IN p for m, v in (0,1): raising a fraction to a
 * larger power makes it smaller, so the sum falls as p rises and there is exactly one
 * crossing. Thirty halvings put it inside 1e-9, which is far tighter than the measurement
 * that feeds it and costs nothing.
 *
 * IT IS ONLY DEFINED WHERE BOTH ARE FRACTIONS. A drift of 1 (a ray that never bent) or a
 * bend rate of 1 (one that bent every step) pins one term at 1 for every p, and there is no
 * exponent that makes the other vanish. Those are the massless and the wholly-trapped
 * limits and the relation degenerates at both, which is correct rather than a gap.
 */
export const exponentOf = (m: number, v: number) => {
  if (!(m > 0 && m < 1 && v > 0 && v < 1)) return NaN;
  const f = (p: number) => Math.pow(m, p) + Math.pow(v, p) - 1;
  let lo = 1e-3, hi = 64;
  if (f(lo) < 0 || f(hi) > 0) return NaN;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (f(mid) > 0) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
};

/**
 * HOW MUCH OF THE RAY POPULATION NEVER GETS A HISTORY — the caveat on v, as a number.
 *
 * A life ends when the ray meets something that annihilates it, and it is TRUNCATED when
 * `BLOCKED` or a corner replaces it with a fresh ray carrying nothing. Both look the same
 * from outside: the carried steps go back to nought. So the mean sampled path is an upper
 * bound on what the instrument can see and a lower bound on nothing at all — and if it is
 * short against the run, then v is being read off the straight-flying minority.
 *
 * IT IS REPORTED RATHER THAN CORRECTED. Copying the carried channels through `BLOCKED` and
 * through the corner would fix the bias and would put instrument code inside the theory,
 * which is the trade this file exists not to make. What is honest is to say how big the
 * blind spot is beside the number it applies to.
 */
export const meanPath = (r: Reading) => {
  if (!r.rays.length) return NaN;
  let steps = 0;
  for (const x of r.rays) steps += x.steps;
  return steps / r.rays.length;
};

/** and the structure-level clock beside it — corners per structure per tick, NOT a
 *  fraction of anything, kept because the rate itself is what `massAt` is a choice about */
export const clockRate = (r: Reading) => {
  const n = Math.max(real(r).length, 1);
  return r.corners / (n * Math.max(r.ticks, 1));
};
