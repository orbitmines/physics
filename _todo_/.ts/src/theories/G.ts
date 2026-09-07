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
    /** it split this tick, so a ray arriving here is arriving into the split */
    splitting: boolean
    /**
     * HOW MANY ± PAIRS ARE BURIED AT THIS POINT — what (G+M/1) put here rather than
     * merely removed.
     *
     * An opposite meeting annihilates two rays and folds the two points into one. Their
     * signs sum to nothing, which is why the charge ledger balances — but they were TWO
     * UNITS of charge, and `clear` wipes both before the fold, so what the fold buries is
     * a point with no memory of what was destroyed into it. Counted here, a folded point
     * knows it holds a bound ± pair, and a layer above can inherit it instead of having
     * to manufacture charge of its own.
     */
    buried: number
    /**
     * THE SIGN OF THE MEETING THAT MADE THIS POINT — a ribbon's TWIST, and the half of a
     * ribbon graph the lattice was not keeping.
     *
     * A ribbon graph is a graph, a cyclic order of edges at each node, and a twist bit
     * per edge. The lattice already carries the first two — ray d of a point faces ray
     * OPP[d] of its neighbour, which IS a rotation system, measured perfect at t=0 and
     * 62% permuted by t=40. It carried no twist, because polarity lives on a RAY, which
     * streams and is cleared, and a twist has to live on an EDGE and persist.
     *
     * IT DOES NOT HAVE TO BE INVENTED. (G+M/3) fires when two ALIKE charges meet, and it
     * SUBDIVIDES the edge they met on — `insert` leaves a point standing in the middle of
     * it for ever. That point is already a permanent record of a meeting; what it was not
     * recording is the one thing the meeting had, which is the sign the two agreed on. An
     * opposite meeting leaves no such point, because it folds instead. So the edges that
     * carry a twist are exactly the edges where sameness survived, which is the XOR
     * writing its own ribbon.
     */
    twist: number
  }>(self => ({
    destroyed: 0,
    turned: 0,
    density: 1,
    splitting: false,
    buried: 0,
    twist: 0,
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
    inheritSign: boolean
    /**
     * WHETHER A COLLAPSE SENDS ITSELF OUT.
     *
     * (G/1) folds two points into one and the space between them is gone. Read as a
     * bookkeeping change that is silent — the count moves and the neighbourhood is no
     * different for it. Read as an event, the point left over lights every exit it has,
     * which is the same act (G/2) performs at a neutral point and is what makes a fold
     * something the world can notice.
     */
    met: number
    charging: "free" | "with" | "against" | "none"
    meets: "polarity" | "charge" | "either" | "both"
    residue: "gone" | "carried" | "turned"
    carried: number
    implodes: boolean
    turnsTaken: number
    turnLog: any
    split: number
    blocked: number
    /** what shape of point (G+M/3) leaves behind — see `Rewrite.Inserting` */
    inserting: "pair" | "full" | "near" | "both" | "none"
    /** what becomes of a folded point's links — see `Rewrite.Folding` */
    folding: "keep" | "inherit" | "paired"
    /**
     * WHAT IS HOLDING ITSELF TOGETHER HERE, and so is not to be pulled apart — the
     * counterpart of `blocks`, read the other way across the layers.
     *
     * `blocks` lets a layer above say where the layer below may not SPLIT. This lets it
     * say HOW HARD the layer below is to UNFOLD. Both are couplings from outside this
     * lattice and both are null here, so `G` has neither and nothing in it can consult
     * a layer it does not have.
     *
     * IT IS A COUNT OF POINTS, in the same unit as the pressure it is weighed against —
     * see the comparison in `RELAXATION`. As a yes/no it overshot: matter survived and
     * the vacuum froze behind it. As a fitted probability it worked at 0.9 and explained
     * nothing. As a count it is the budget the matter is already paying, and the balance
     * point is an output rather than a choice.
     */
    binds: ((l: any) => number) | null
  }>(self => ({
    vacuum: 0,
    slotUniformRng: true,
    geometry: GEOMETRIES["fcc-12"],
    N: 1,
    seed: 0,
    bound: () => self.N ** self.geometry.D,
    inertia: 1,
    blocks: null,
    /** whether a split takes its sign from its neighbours — see `withInheritedSign` */
    inheritSign: false,
    /** how often the meeting in MOVEMENT resolved, and how often it imploded — see the
     *  note there: a branch that cannot say it ran cannot be measured */
    met: 0,
    /** where a split's charge comes from — see CREATION in `G^XOR+XOR` */
    /*
     * DRAWN AS THE POLARITY — which is what the search settled on, and the reason is worth
     * stating because it is not a happy one.
     *
     * A charge stays small when it can ANNIHILATE, and the way the sweep found to give it
     * one was to make it the sign that already does. Polarity has annihilated at meetings
     * since (G/1); charge never had a mechanism of its own, so drawing it AS the polarity
     * lets it inherit that. Measured over 48 configurations at 800-1800 structures each,
     * every one of the top three does this: |q| tops out at 5 to 7 across structures
     * running to 2,536 points, and its correlation with mass falls to 0.07.
     *
     * BUT IT COLLAPSES THE TWO SIGNS INTO ONE, which is what `G^XOR+XOR` exists to keep
     * apart. Under this setting `meets: "charge"` and `meets: "both"` are the same test and
     * report identical figures to the digit. So this is the best-measured configuration and
     * also an admission that the second sign is not yet earning its place on its own terms.
     */
    charging: "free" as "free" | "with" | "against" | "none",
    /** what a meeting is decided by — see the meeting in `G^XOR+XOR`'s MOVEMENT */
    /** the meeting is decided by charge — see `charging`, which makes this the same test
     *  as `both` and a different one from `polarity` only when charge is drawn free */
    meets: "polarity" as "polarity" | "charge" | "either" | "both",
    /** what becomes of the sign a meeting was NOT about — see the meeting in `G^XOR+XOR` */
    residue: "gone" as "gone" | "carried" | "turned",
    carried: 0,
    /** whether a fold sends itself out along every exit — the collapse being an EVENT
     *  rather than a bookkeeping change. Measured: without it a structure of 2,265 points
     *  came apart into 14; with it the largest grew 4,264 to 6,323. */
    implodes: true,
    /** how many turns were taken, and — where something is listening — what they were:
     *  point, heading in, heading out, three at a time. See `steer` in `G^XOR+XOR`. */
    turnsTaken: 0,
    turnLog: null as any,
    imploded: 0,
    /** the walk through matter, counted at every end of it — see `through` in G^XOR+XOR.
     *  `entered` must equal `left` plus `caught`, and a rule that cannot say so cannot be
     *  measured, only guessed at. */
    /** how often (G/2) fired, and how often something outside stopped it — the gravity
     *  of this model, counted where it happens rather than read off a flag afterwards */
    split: 0,
    blocked: 0,
    inserting: "pair",
    folding: "keep",
    binds: null,
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
      if (half(g, s, d, w.ticks) === 0) continue;    // an axial source has an equator
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
    /* CLEARED HERE, not at the end of the tick: this rule visits every point once, so
     * the flag it sets is fresh for MOVEMENT and stale for nobody. */
    (l as any).splitting = false;
    if (l.source || l.world.blocks?.(l) || busy(l)) return;
    /* a point that took a ray in last tick is a beat behind: it splits now, and what is
     * around it is coming back together — see MOVEMENT, where the meeting is resolved */
    (l as any).splitting = true;
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
    /* THE FAST PATH WALKS THE STORE'S OWN RAY INDEX and knows nothing about what is at
     * the far end, so it cannot see a meeting coming. The walk below is the same
     * movement, asked in a way that can. */
    forEachMatch(b, "Ray", (r: any) => {
      if (!r.active) return;
      const to = across(r, r.bounced);
      if (!to) { offEdge(r); return; }
      /*
       * A RAY ARRIVING INTO SOMETHING COMING THE OTHER WAY IS A MEETING, AND IT IS
       * RESOLVED AS ONE — which is not a setting and never was.
       *
       * WITHOUT IT NOTHING CAN CROSS THIS MEDIUM. (G/2) lights every neutral point, so a
       * ray steps into a pair that was made to meet it and half of those meetings
       * annihilate: measured, one ray lit in a vacuum and at t=1 the world holding it was
       * identical to the world without it. Nothing propagates through that, which is
       * exactly the premise the falloff law needs and could not get.
       *
       * AND IT IS THE SAME EVENT (G/1) IS ABOUT, so it does what (G/1) does rather than
       * consuming the rays and leaving. Read as a bypass it abolished annihilation
       * outright — no folds, no deficit, no matter, and a lattice frozen at the size it
       * started: 2197 points, 0 annihilations, against 17,361 and 20,389 when the meeting
       * was left to resolve itself. What is fixed here is WHEN the meeting is noticed, not
       * whether space is destroyed by it.
       *
       * WHAT SURVIVES IS THE PHASE. The half that came out to meet this ray is cancelled
       * and this ray is taken, so the point is left one ray short of its neighbours — a
       * beat behind, splitting on the next one. Nothing is marked: the lag is what `busy`
       * already means, read a tick on.
       */
      const back0 = opposite(r) as any;
      const there: any = to.l;
      /*
       * MATTER IS IN THE WAY, SO IT INTERCEPTS FIRST.
       *
       * A meeting resolved here consumes the ray before anything downstream can have it,
       * and a structure sitting at this point is exactly something downstream that was
       * going to. Measured with the vacuum taking precedence: the shadow got STRONGER —
       * the traffic runs away from matter at −0.73 against −0.45 — while the pull went to
       * nothing, +0.04 against +0.45, because the rays carrying the asymmetry were being
       * annihilated in flight and never reached the structure that was supposed to feel
       * them. The shadow was there and nothing could fall into it.
       *
       * ASKED OF THIS POINT AND WHAT IS HELD AT IT, and of nothing else — the layer above
       * answers about one local, which is the only kind of question either layer may put
       * to the other.
       */
      const held: any = w.matterAt;
      const mine: any = r.l;
      const intercepts = !!(held && mine && held.matter?.(mine)?.share);
      if (!intercepts && there && !there.source && back0?.active && !r.l?.source) {
        const mine = r.polarity, theirs = back0.polarity;
        /* opposite charges annihilate and take their space with them; alike ones turn,
         * which is (G+M/3) and is left to the rule that owns it */
        if (mine === undefined || theirs === undefined || mine !== theirs) {
          const here = r.l as any;
          clear(r);
          back0.arriving = false;
          clear(back0);
          b.stats.annihilations++;
          here.destroyed += 0.5;
          if (there !== here) { there.destroyed += 0.5; here.fold(there); }
          /*
           * AND THE COLLAPSE SENDS ITSELF OUT — the implosion.
           *
           * Two points became one, and what was between them is gone. That is not a quiet
           * event: the space it stood in closed, and the point left over is the only thing
           * there to carry the news. So it goes out along every exit it has, which is what
           * (G/2) does at a neutral point and is the same act read from the other end —
           * the difference being that this one was not neutral, it was MADE neutral, by a
           * meeting.
           *
           * WHICH IS ALSO HOW A FOLD REACHES ANYTHING. Without it a fold is silent: the
           * point leaves `loose`, the count changes, and nothing in the neighbourhood is
           * any different for it. Everything that has to know a fold happened — a
           * structure that has just been added to, a vacuum that has just lost a cell —
           * has to be told by something, and this is the only thing there is to tell it.
           */
          /* COUNTED, so a null result can be told from a branch that never ran. Four
           * times in a row a change here was reported as "no effect" when what had
           * happened is that the code was not on the path being taken. A rule that cannot
           * say how often it fired cannot be measured, only guessed at. */
          w.met = (w.met ?? 0) + 1;
          /* AND THE COLLAPSE SENDS ITSELF OUT. Two points became one and the space
           * between them is gone; the point left over is the only thing there to carry
           * that, so it goes out along every exit it has. Measured, without it a
           * structure of 2,265 points came apart into 14 while the vacuum stripped it;
           * with it the largest grew 4,264 to 6,323 and held 90% of all folded matter. */
          if (w.implodes !== false) light(here);
        }
      }
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

/**
 * THE SAME THEORY WITH (G/2) PAYING FOR ITSELF — a REASON a point does not always split,
 * rather than a rate at which it does not.
 *
 * THE VACUUM HAS NO MEMORY AND THAT IS WHY NOTHING FORMS IN IT. (G+M/3) conserves sign —
 * alike rays turn and keep their polarity — so the XOR does select for agreement. It
 * never gets to act. (G/2) redraws the sign from scratch at every neutral point every
 * tick, an independent coin per point, so any correlation selection builds is overwritten
 * before it can spread. Measured on fcc 12 over 200 ticks: the ratio of disagreeing
 * neighbour links to agreeing ones came to 1.013, 1.008, 1.013, 0.988, 0.992, 1.016,
 * 0.985, 1.003 — one, to three places, at every sample. That is an uncorrelated field.
 * There are no domains in it and there is nothing for a structure to be made of.
 *
 * A RATE WOULD NOT BE AN ANSWER. Firing (G/2) with some probability would give selection
 * room, and the probability would be a constant chosen because it worked — which is the
 * kind of number this project exists to remove rather than acquire.
 *
 * SO IT PAYS THE BUDGET THE MODEL ALREADY STATES. "A structure gets one action per tick.
 * It can spend it moving through the lattice or walking its own graph, and NOT BOTH." A
 * point that has just been in a meeting has spent its action on that meeting, and cannot
 * also split in the same breath — which is not a new rule, it is the one already written
 * beside `upkeep` being applied to (G/2) instead of only to a source's motion.
 *
 * AND IT IS EXACTLY THE MEMORY THAT WAS MISSING. A point that met something keeps what
 * the meeting left it for a tick instead of having it overwritten by a fresh draw, so
 * what (G+M/3) conserved survives long enough to be spread. Said through `blocks`, which
 * is the hook for "where (G/2) may not fire" and needs no rule restated.
 */
export const withOneAction = <T extends { copy(): any; name: string }>(t: T) =>
  ((t.copy() as any)
    .decorate.Local(() => ({ spent: false, acted: 0 })) as any)
    .decorate.World(() => ({ blocks: method((l: any) => l.spent === true) }))
    /*
     * WHAT THIS POINT DID THIS TICK, read off the ledger the rules already keep: a
     * meeting credits `destroyed` or `turned` half to each end of the edge it happened
     * on. Appended, so it runs after the meetings and what it marks is read by the NEXT
     * tick's (G/2) — which is the one tick of memory the whole construction turns on.
     */
    .rule("SPENDING", "Local", (l: any) => {
      const now = (l.destroyed ?? 0) + (l.turned ?? 0);
      l.spent = now > (l.acted ?? 0);
      l.acted = now;
    })
    .called(`${t.name} · budgeted`);

/**
 * THE SAME THEORY WITH THE SPLIT'S SIGN TAKEN FROM THE NEIGHBOURHOOD RATHER THAN DRAWN.
 *
 * The other way to give the field a memory: a point that splits is not isolated — the
 * points around it carry signs — and drawing an independent coin throws away what the
 * lattice already has. Here the split takes the sign its neighbours are showing, and
 * falls back to the draw only where they show nothing.
 *
 * IT COSTS THE STREAM THE SAME EITHER WAY. The draw is taken whether or not it is used,
 * so a run with this on differs from one without it only by which sign was written —
 * which is what `slotUniformRng` protects and what makes the two comparable at all.
 */
export const withInheritedSign = <T extends { copy(): any; name: string }>(t: T) =>
  (t.copy() as any).decorate.World(() => ({ inheritSign: true }))
    .called(`${t.name} · inherited`);

/**
 * THE SAME THEORY WITH MATTER UNDER PRESSURE TO BECOME SPACE AGAIN.
 *
 * (G/2) FIRES ONLY WHERE A POINT IS NEUTRAL, and a point holding matter is not neutral —
 * so the one rule that makes space is switched off exactly where space has been
 * destroyed. Read forwards that is the gravity mechanism. Read backwards it means the
 * model has NO PATH BACK: annihilation folds space into a point, `density` counts it, and
 * nothing but a neutral point ever hands any of it out again. Space is destroyed
 * irreversibly and the vacuum runs down.
 *
 * SO A DENSE POINT GIVES ONE POINT BACK A TICK, whether or not it is busy. `unfold` is
 * the operation that already exists for it — it takes a point out of containment and
 * puts it back among the loose ones, with the links it was folded with — and this is that
 * operation asked of matter rather than only of vacuum. `above` is the density a point
 * has to exceed before it feels it, and `chance` is how often it acts on it, so the
 * pressure can be made a rate rather than a certainty.
 *
 * AND WHAT IS HOLDING ITSELF TOGETHER IS NOT PULLED APART — see `binds`.
 *
 * WITHOUT THAT, THIS RULE IS AN ANTI-MATTER PRESSURE AND NOTHING ELSE. It fires on
 * `density`, and `density` is precisely how much matter is at a point, so the mechanism
 * that keeps the vacuum alive is by construction the mechanism that tears matter apart.
 * Measured on fcc 12 at N=21 over 400 ticks: the vacuum stays healthy at occupancy 0.428
 * for the whole run while the largest structure falls from 4,804 points to 3, and 68,457
 * of 71,933 structures end as single points. Turn the rule off instead and the vacuum
 * freezes after ten ticks and no matter is ever made. Both ends give nothing.
 *
 * WHAT IS MISSING IS A REASON FOR A STRUCTURE TO STAY TOGETHER, which in nature is
 * binding: matter resists being pulled apart because pulling it apart costs. Here the
 * cost is already defined and already paid — a structure spends its one action a tick
 * walking its own graph, and `binds` is the layer above saying that a structure which is
 * running its own dynamics is not available to be dissolved. So the internal dynamics IS
 * what makes matter stable, which is the reading the budget was written for.
 *
 * IT IS OFF UNLESS ASKED FOR, and it is a decoration rather than a rule of `G`: a rule
 * added to the base theory that returns immediately still costs a full match enumeration
 * every tick to say it did nothing.
 */
export const withRelaxation = <T extends { copy(): any; name: string }>(
  t: T, o: { above?: number; chance?: number } = {},
) => (t.copy() as any)
  .decorate.World(() => ({
    relax: o.above ?? 1, relaxChance: o.chance ?? 1,
    /** how often the pressure fired, and how often binding held it — the two numbers that
     *  say whether a still vacuum is a bound one or a dead one */
    relaxed: 0, refused: 0,
  }))
  /* WHEN THIS POINT LAST GAVE SPACE BACK, so an avalanche can be read off the lattice:
   * the points that relaxed on the SAME tick and are joined to each other are one event,
   * which is the quantity whose distribution says whether this is critical or not. */
  .decorate.Local(() => ({ relaxedAt: -1 }))
  .rule("RELAXATION", "Local", (l: any) => {
    const above = l.world.relax;
    if (!above) return;
    if ((l.density ?? 1) <= above) return;
    /*
     * HOW MUCH SPACE IS PRESSING TO GET OUT, AGAINST HOW MUCH THE MATTER HERE CAN HOLD —
     * TWO QUANTITIES THE MODEL ALREADY HAS, COMPARED. There is no strength to choose.
     *
     * A FITTED BINDING IS NOT AN EXPLANATION. This was a probability: `binds` returned a
     * number between nought and one and the pressure was refused that often. It worked —
     * at 0.9 a graded population of bound objects appeared over a live vacuum — and 0.9
     * was a number picked because it was the one that worked, which is the kind of
     * constant this project exists to get rid of rather than acquire. Nothing said why
     * nine tenths.
     *
     * SO THE TWO SIDES ARE COUNTED IN THE SAME UNIT INSTEAD. What presses is the space
     * folded here beyond what a point may hold: `density - above`, in points. What holds
     * is the budget the matter here is already paying — a structure gets ONE ACTION A
     * TICK and spends it walking its own graph, so a structure running its clock at m of
     * its points holds m points' worth. Both are counts of points. The point gives space
     * back when there is more of it pressing than the matter is spending to keep it, and
     * that is a comparison rather than a coin, so it takes no parameter and no draw.
     *
     * WHICH MAKES THE STABLE MASS AN OUTPUT. A structure can hold what it can walk, so it
     * grows until the space folded into it outruns the action it has to hold that space
     * with — and where that lands is set by the budget and the annihilation rate, not by
     * anything chosen here.
     */
    const pressure = (l.density ?? 1) - above;
    if (pressure <= 0) return;
    const hold = l.world.binds?.(l) ?? 0;
    /* counted so a frozen vacuum can be told apart from a bound one — see `refused` */
    if (hold >= pressure) { l.world.refused = (l.world.refused ?? 0) + 1; return; }
    /* the draw is taken ONLY where it is needed — a certainty that pays the stream would
     * shift every other rule's draws and make this incomparable with the control */
    if (l.world.relaxChance < 1 && l.backend.rng() >= l.world.relaxChance) return;
    /*
     * AND IT IS THE SURFACE THAT IS PULLED AT, NOT THE BULK.
     *
     * The vacuum takes matter apart by pushing into it: a ray arrives and nothing goes
     * back the way it came, and what is on the end of that is pulled off. That is a thing
     * that can only happen where the vacuum can REACH — the outside of a structure — and
     * inside one the traffic is matter's own and balances. Asked of this point's own rays:
     * more arriving than leaving is the vacuum pressing in here and getting nothing back.
     *
     * WITHOUT IT THE PRESSURE IS A VOLUME LAW AND EATS EVERYTHING. `density` counts what a
     * point stands for wherever it is, so a point buried in the middle of a structure was
     * as liable to be handed back as one on its face — and a structure of 2,265 points
     * came apart into fourteen. A surface reading is also what this book already says the
     * aggregate is: an AREA law rather than a volume one.
     *
     * READ OFF THE NEIGHBOURHOOD AND NOT OFF `arriving`. What a ray was doing this tick is
     * gone by the time this rule runs: ARRIVAL swaps `active` with `arriving` and CLEARS
     * the latter, and it runs first. Asked that way the condition never fired once. What
     * a surface IS, though, is a place with vacuum next to it — a point one of whose
     * neighbours holds nothing — and that is a fact about the neighbourhood rather than
     * about a bit that has already been reset.
     */
    let open = false;
    for (const r of (l.rays as any[])) {
      const nb: any = outward(r)?.target?.source?.l;
      if (!nb) continue;
      if (((l.backend as any).contained?.(nb) ?? []).length === 0) { open = true; break; }
    }
    if (!open) return;
    l.unfold();
    l.world.relaxed = (l.world.relaxed ?? 0) + 1;
    l.relaxedAt = l.world.ticks;
  })
  .called(`${t.name} · relaxing(${o.above ?? 1}/${o.chance ?? 1})`);

/** the same theory with the structure budget turned on — see `upkeep` and `share` */
export const withBudget = <T extends { copy(): any; name: string }>(
  t: T, o: { upkeep?: number; share?: number } = {},
) => (t.copy() as any).decorate.World(() => ({
  upkeep: o.upkeep ?? 1, share: o.share ?? 0,
})).called(`${t.name} (upkeep ${o.upkeep ?? 1}/${o.share ?? 0})`);
