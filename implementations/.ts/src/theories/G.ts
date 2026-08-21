import { Backend } from "../lib/Backend.ts";
import {
  across, busy, dot, GEOMETRIES, Geometry, Global, global, leaving, light, opposite, outward,
} from "../lib/Local.ts";
import {
  acting, aims, Embedding, embedding, firing, half, Source, SourceSpec,
} from "../lib/Source.ts";
import { clear, forEachMatch, method, Theory } from "../lib/Theory.ts";
import { Graph } from "../backends/CPU.graph.ts";


/**
 * A RAY THAT STEPPED OFF THE EDGE. On a bounded world that is the end of it; on an
 * EXPANDING one it makes the room it needs and waits one tick to move into it, because a
 * link is a rewrite and a rewrite lands at the end of the pass. Holding it in place is
 * not a free ride: it is still on the same point, still meets whatever meets it there,
 * and it has not advanced a cell.
 */
const offEdge = (r: any) => {
  const from = r.bounced ? opposite(r) : r;
  if (!from) return;
  if (!r.backend.rewrite.grow(leaving(from))) return;
  r.arriving = true;
  const carrying = r.backend.carrying;
  for (let i = 0; i < carrying.length; i++) carrying[i].writeWaiting(r, carrying[i].read(r));
};

export const G = new Theory()
  .called("G")
  /*
   * THE CHANNELS, AS DECORATIONS. In the article these are parallel arrays allocated
   * per theory; here a per-ray quantity is a property, which is the same thing said in
   * this vocabulary — and a theory that does not declare one cannot read it by mistake.
   *
   * EVERY ONE OF THEM IS DECLARED WITH A DEFAULT, INCLUDING THE ABSENT ONES. The
   * backend builds its columns off what a freshly constructed ray SAYS it has, so a
   * decoration that returns `{}` for a field gets no column — and the field is then an
   * own property written onto the flyweight, which is per-index and is NOT reset when
   * that index is freed and handed to the next ray. Declaring it is what puts it in a
   * column and what makes `create` clear it.
   */
  .decorate.Ray<{
    active: boolean
    arriving: boolean
    bounced: boolean
    /** how many times this ray has been deflected — what `scattering` averages, and
     *  the diagnostic that says whether a null result is a result or a vacuum that
     *  never scattered in the first place */
    turns: number
    /** ticks in flight */
    age: number
  }>(self => ({
    active: false,
    arriving: false,
    bounced: false,
    turns: 0,
    age: 0,
  }))

  /**
   * WHICH SOURCE IT CAME FROM, OR −1 FOR THE VACUUM'S OWN — and it travels with the ray.
   *
   * A BODY CANNOT PUSH ITSELF, and without this it does. A source of more than one cell
   * emits at every cell it owns and absorbs at every cell too, so it is permanently
   * radiating into itself. At rest that is invisible: the exits come in ± pairs, it eats
   * as much one way as the other, and the ledger cancels exactly. ONCE IT MOVES the
   * cancellation breaks — it takes in the cells ahead, which hold its own forward rays,
   * and abandons the cells behind, which hold its backward ones. Measured in the
   * article: momentum climbed by a constant every tick, +3 for a body of 5 cells, +7 for
   * 13, +11 for 29, in proportion to its own size, in a box with nothing else in it.
   *
   * The rays are real and still happen; what is wrong is the accounting. So a body is
   * TRANSPARENT TO ITS OWN UNTOUCHED RADIATION, and the moment a ray is deflected it
   * stops being the body's own — that is a real interaction with something else, and it
   * is exactly the channel repulsion arrives on.
   */
  .carries("from", -1)

  /** what has been destroyed at a local, what has turned there, and how many points
   *  this one now stands for — see `Rewrite.fold` */
  .decorate.Local<{
    destroyed: number
    turned: number
    density: number
  }>(self => ({
    destroyed: 0,
    turned: 0,
    density: 1,
  }))

  .decorate.World<{
    vacuum: number | null
    /**
     * DRAW THE RANDOM STREAM FOR EVERY LOCAL, whether or not it splits.
     *
     * Costs time and buys the thing every difference measurement in this project
     * rests on: the same seed run twice, once with a body and once without, then
     * differs ONLY by the body. Without it a local that is skipped does not pay the
     * draw, so adding a body shifts the stream everywhere — measured in the article
     * at a fifth of the board OUTSIDE the body's light cone, against a shadow a few
     * per cent deep.
     */
    slotUniformRng: boolean
    geometry: Geometry
    N: number
    seed: number
    bound: number
    /**
     * HOW MUCH MOMENTUM A CELL OF MOVEMENT COSTS. THIS IS THE MASS: a heavy thing
     * needs more of the vacuum pushed through it to go the same distance. 1 is the
     * MASSLESS limit and behaves like one — a body nudged once moves a cell, is one
     * cell further into its own radiation, and locks to c̄.
     */
    inertia: number
    /**
     * ONE ACTION A TICK, SPENT MOVING OR SPENT ON ITSELF — the budget rule.
     *
     * "A structure gets one action per tick. It can spend it moving through the lattice
     * or walking its own graph, and not both — and walking its own graph is its clock."
     * `upkeep` is what one period of that clock costs and `share` is how far to look
     * for co-phased neighbours to split the cost with, so a dense field is a fast one.
     * OFF BY DEFAULT, because turning it on changes every existing movement result.
     */
    upkeep: number
    share: number
    /**
     * WHERE (G/2) IS NOT ALLOWED TO FIRE — a coupling from outside this lattice, and off
     * by default. It is what "a cell busy in Layer 1 does not split in Layer 2" is: the
     * gravity mechanism — matter suppressing the expansion — read across layers, and the
     * only way to say it without giving Layer 2 a rule Layer 1 has not got.
     */
    blocks: ((l: any) => boolean) | null
  }>(self => ({
    vacuum: 0,
    slotUniformRng: true,
    geometry: GEOMETRIES["fcc-12"],
    N: 1,
    seed: 0,
    bound: () => self.N ** self.geometry.D,
    inertia: 1,
    blocks: null,
    upkeep: 0,
    share: 0,
  }))

  /** the source that owns this point, or null for the vacuum's own space */
  .decorate.Local<{
    source: Source | null
  }>(self => ({ source: null }))

  .decorate.World<{
    global: Global
    backend: Backend
  }>(self => {
    let assumed: Global, laid: Backend;
    return {
      global: () => assumed ??= global(self.geometry, new Graph(self.theory)),
      backend: () => laid ??= self.geometry.seed(new Graph(self.theory, self.seed, self.bound, self.geometry.DEG * 2), self.N),
    };
  })

  .decorate.World<{
    sources: Source[]
    embedding: Embedding
    add(spec: SourceSpec): Source
  }>(self => {
    const sources: Source[] = [];
    let laid: Embedding | undefined, at = -1;
    return {
      sources,
      /*
       * REBUILT WHEN THE WORLD HAS CHANGED SIZE, and not otherwise. Held for ever it goes
       * stale the moment a point is made: an expanding world's frontier is exactly the
       * points that are not in it, so every shell reading past the seeded box came back
       * empty — which reads as a frontier that makes nothing rather than as a stale map.
       */
      embedding: () => {
        const n = self.backend.size();
        if (!laid || at !== n) { laid = embedding(self.backend.sample()); at = n; }
        return laid;
      },
      add: method((spec: SourceSpec): Source => {
        const D = self.geometry.D;
        const s: Source = {
          id: sources.length, emits: 1, absorbs: true, collides: true, moves: false,
          duty: 1, dwellTicks: 1, period: 1, phase: 0, u: [], turning: 0,
          emission: "isotropic", propulsion: "none", bias: 1, conserve: false,
          locals: [], absorbed: new Array(D).fill(0), emitted: new Array(D).fill(0),
          caught: new Array(self.geometry.DEG).fill(0), arrivals: 0,
          momentum: new Array(D).fill(0),
          lastAbsorbed: new Array(D).fill(0), lastEmitted: new Array(D).fill(0),
          owed: 0, upkeepTicks: 0, moved: 0, origin: spec.at.slice(),
          ...spec,
        };
        sources.push(s);
        /* a slab where half-extents were given, a ball otherwise — two slabs meet face
         * on, which is what a collision figure is actually about */
        const cells = spec.half
          ? self.embedding.box(spec.at, spec.half)
          : self.embedding.within(spec.at, spec.radius ?? 0);
        for (const l of cells) {
          (l as any).source = s;
          s.locals.push(l);
        }
        return s;
      }),
    };
  })

  /**
   * (EMIT) SOURCES ABSORB WHAT ARRIVED AND WRITE THEIR OWN CHARGE ONTO THE SPACE AROUND
   * THEM — and what leaves is decided by four things the article gives a source: which
   * exits fire (`emission`), which half of it they are in (`axis`), whether it is
   * aiming (`propulsion`), and whether it may make rays or only pass them on
   * (`conserve`). None of those is a knob added here; leaving any of them out makes a
   * different source, and a panel or a claim that asks for one and silently gets the
   * isotropic ball is measuring something nobody asked about.
   */
  .rule("EMISSION", "Local", (l) => {
    const s = l.source;
    if (!s) return;
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
          /* a body is transparent to its OWN untouched radiation — see `from` */
          if (r.from !== s.id) {
            s.arrivals++;
            /* summed in place: this runs per ray per source cell per tick, and a fresh
             * vector for each is the allocation, not the physics */
            for (let i = 0; i < g.D; i++) s.absorbed[i] += g.V[d][i] ?? 0;
            s.caught[d] = (s.caught[d] ?? 0) + 1;
          }
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
      if (half(g, s, d) === 0) continue;             // an axial source has an equator
      if (!aims(g, s, d, arrived[d] ?? 0, l.backend.rng)) continue;
      if (s.conserve && budget <= 0) break;
      r.active = true;
      r.from = s.id;
      budget--;
      if (arrived[d] > 0) arrived[d]--;
      /* every ray it sends costs it the recoil, wherever that ray ends up */
      for (let i = 0; i < g.D; i++) s.emitted[i] += g.V[d][i] ?? 0;
    }
  }, "source")

  /**
   * (G/2) A NEUTRAL POINT EXPANDS INTO TWO POINTS, unconditionally — every neutral
   * point, every tick. Nothing is thinned; what removes a ray is the meeting on the
   * edge. A point carrying an active ray is not neutral, so it does not split.
   */
  .rule("CREATION", "Local", (l) => {
    if (l.source || l.world.blocks?.(l) || busy(l)) return;
    l.unfold();
    light(l);
  })

  /**
   * (STREAM) EVERY ACTIVE RAY MOVES ONE STEP ALONG ITS OWN EXIT. c̄ = one step a tick,
   * by definition — and everything the ray carries goes with it, whatever the theory
   * above has decided that is. A ray on a SOURCE's cell streams like any other: that is
   * how what a body emits gets out of it.
   */
  .rule("MOVEMENT", "World", (w: any) => {
    const b = w.backend;
    /* the gate, the sense, and every quantity that goes with the ray — declared here,
     * because what a ray carries is the theory's business and not the store's */
    const moving: [string, string][] = [["active", "arriving"]];
    for (const c of b.carrying) moving.push([c.name, c.waiting]);
    if (b.step) { b.step("active", "bounced", moving, offEdge); return; }
    forEachMatch(b, "Ray", (r: any) => {
      if (!r.active) return;
      const to = across(r, r.bounced);
      if (!to) { offEdge(r); return; }
      to.arriving = true;
      const carrying = b.carrying;
      for (let i = 0; i < carrying.length; i++) carrying[i].writeWaiting(to, carrying[i].read(r));
    });
  })

  /**
   * (ARRIVE) WHAT WAS ARRIVING IS NOW WHAT IS HERE, and nothing is arriving any more.
   *
   * The same sentence about every ray in the world, so it is quantified over the WORLD:
   * a store that keeps its rays in columns exchanges two of them and clears one, which is
   * the article's own "swapped, not copied", and one that cannot is asked ray by ray and
   * gets the same answer more slowly.
   *
   * A ray that received nothing goes out, and it goes out carrying nothing — its waiting
   * slot is empty because only MOVEMENT writes one, and only where it also said the ray
   * was arriving.
   */
  .rule("ARRIVAL", "World", (w: any) => {
    const b = w.backend;
    if (b.swap && b.reset) {
      b.swap("Ray", "active", "arriving");
      b.reset("Ray", "arriving");
      const carrying = b.carrying;
      for (let i = 0; i < carrying.length; i++) {
        b.swap("Ray", carrying[i].name, carrying[i].waiting);
        b.reset("Ray", carrying[i].waiting);
      }
      b.reset("Ray", "bounced");
      return;
    }
    forEachMatch(b, "Ray", (r: any) => {
      const here = r.arriving === true;
      r.active = here;
      const carrying = b.carrying;
      for (let i = 0; i < carrying.length; i++) {
        const c = carrying[i];
        c.write(r, here ? c.readWaiting(r) : c.absent);
        c.writeWaiting(r, c.absent);
      }
      r.arriving = false;
      r.bounced = false;
    });
  })

  /**
   * (G/1) TWO RAYS THAT MEET ON THE EDGE BETWEEN TWO POINTS ANNIHILATE, LEAVING A
   * SINGLE NEUTRAL SPATIAL POINT BEHIND — which is what makes (G/1) the inverse of the
   * split rather than merely its opposite, and which is why GRAVITY IS SPACE BEING
   * DESTROYED rather than a counter of events standing in for one.
   */
  .rule("ANNIHILATION", ["Boundary", "Boundary"], (a, b) => {
    const x = a.source, y = b.source;
    /* ASKED IN THE ORDER THAT ANSWERS SOONEST. Most facing pairs have nothing on one end
     * of them, and that is two column reads; the points they are at are two walks back up
     * the containment, and they are only needed by a pair that has actually met. */
    if (!x.active || !y.active) return;
    const here = x.l, there = y.l;
    if (here.source?.collides === false || there.source?.collides === false) return;
    clear(x);
    clear(y);
    x.backend.stats.annihilations++;
    /* credited half to each end of the edge the event happened on, which is what a
     * force is read off — see `pullChannel` */
    here.destroyed += 0.5;
    there.destroyed += 0.5;
    here.fold(there);
  }, "active")

  /**
   * (MOVE) A STRUCTURE CARRIES THE MOMENTUM THE VACUUM GIVES IT, and crosses a cell
   * when it has enough — the first thing in this model that moves a STRUCTURE rather
   * than a ray.
   *
   * Nothing in the three rules does this. A ray moves because streaming moves it; a
   * structure is a region and a region has no heading, so if matter goes anywhere it is
   * because of what the vacuum does to it. That force is MEASURED rather than assumed:
   * what arrived, less what was thrown away. Transmitting costs nothing, so a perfect
   * transmitter is already moving; emitting is what it costs to be massive.
   *
   * ONE CELL AT A TIME, because that is the only distance there is. Momentum short of a
   * whole cell is kept rather than rounded away, so a slow thing moves rarely rather
   * than never — a duty cycle arrived at from the dynamics instead of imposed.
   *
   * IT IS A RULE OF THE WORLD AND NOT OF A POINT. A body is every local it owns at
   * once: it reads one force, decides once, and the cells go together or not at all.
   */
  .rule("TRANSPORT", "World", (w: any) => {
    const g = w.geometry as Geometry, D = g.D;
    for (const s of w.sources as Source[]) {
      if (!s.moves) continue;

      /*
       * THE BUDGET, SPENT BEFORE ANYTHING ELSE. If this tick's action went on the
       * structure's own upkeep there is none left to move with — the force still
       * accumulates, it simply cannot be acted on, which is what "not both" means.
       */
      if (w.upkeep > 0) {
        let k = 1;
        if (w.share > 0) {
          const here = w.embedding.at(s.locals[0]);
          for (const l of w.backend as Iterable<any>) {
            if (l.source) continue;
            const there = w.embedding.at(l);
            if (!there) continue;
            let d2 = 0;
            for (let i = 0; i < D; i++) d2 += ((there[i] ?? 0) - (here?.[i] ?? 0)) ** 2;
            if (d2 > w.share * w.share) continue;
            /* COUNTED IN RAYS, NOT IN CELLS: what shares the upkeep is the traffic, and
             * counting cells made k the same at fill 0.50 and at fill 0.24 */
            for (const r of l.rays) if (r.active) k++;
          }
        }
        s.owed += w.upkeep / k;
        if (s.owed >= 1) { s.owed -= 1; s.upkeepTicks++; continue; }
      }

      /* the force THIS TICK: what arrived less what was sent away, SINCE LAST TIME.
       * Both are running totals; adding the total itself feeds momentum the size of the
       * whole history every tick and everything crosses every threshold immediately. */
      for (let i = 0; i < D; i++) {
        s.momentum[i] += (s.absorbed[i] - s.lastAbsorbed[i]) - (s.emitted[i] - s.lastEmitted[i]);
        s.lastAbsorbed[i] = s.absorbed[i];
        s.lastEmitted[i] = s.emitted[i];
      }

      // the exit it has most nearly earned, and whether it has earned it
      let best = -1, most = 0;
      for (let d = 0; d < g.DEG; d++) {
        const along = dot(s.momentum, g.U[d]);
        if (along > most) { most = along; best = d; }
      }
      if (best < 0 || most < w.inertia * g.steps[best]) continue;

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
      for (let i = 0; i < D; i++) s.momentum[i] -= (g.V[best][i] ?? 0) * w.inertia;
    }
  });

/**
 * THE SAME THEORY WITH SOMETHING ELSE DECIDING WHERE IT MAY SPLIT — see `blocks`.
 *
 * The predicate is wrapped as a METHOD because a decoration whose value is a function is
 * installed as a GETTER: `blocks: busy` without this makes `world.blocks` the RESULT of
 * calling busy on the world, which is not a predicate and not an error either.
 */
export const withBlocking = <T extends { copy(): any; name: string }>(
  t: T, blocks: (l: any) => boolean,
) => (t.copy() as any).decorate.World(() => ({ blocks: method(blocks) })).called(`${t.name} · blocked`);

/** the same theory with heavier matter in it — `inertia` is the mass, see the World */
export const withInertia = <T extends { copy(): any; name: string }>(t: T, inertia: number) =>
  (t.copy() as any).decorate.World(() => ({ inertia })).called(`${t.name} (inertia ${inertia})`);

/** the same theory with the structure budget turned on — see `upkeep` and `share` */
export const withBudget = <T extends { copy(): any; name: string }>(
  t: T, o: { upkeep?: number; share?: number } = {},
) => (t.copy() as any).decorate.World(() => ({
  upkeep: o.upkeep ?? 1, share: o.share ?? 0,
})).called(`${t.name} (upkeep ${o.upkeep ?? 1}/${o.share ?? 0})`);
