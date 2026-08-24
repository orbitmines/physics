import { Graph } from "../backends/CPU.graph.ts";
import { Boundary, Local, opposite, outward, Ray } from "./Local.ts";
import { Theory } from "./Theory.ts";

/**
 * THE SPACE A LAYER ABOVE RUNS ON: a store of its own, holding what the layer below
 * has folded away.
 *
 * WHY IT IS A SECOND STORE AND NOT A SECOND READING OF THE FIRST. The obvious
 * construction is a view — the same pools, iterated over the points that are no longer
 * loose — and it is elegant and it does not work. `ARRIVAL` takes the store's fast path,
 * and that path is `swap`, which exchanges whole column ARRAYS by pointer, and `reset`,
 * which `fill`s an entire pool. Neither knows the interior exists. So the layer below
 * wiped every column of every interior ray once a tick, before the layer above ran at
 * all, and the interior could not hold a charge for one tick in any configuration —
 * measured at `L2 active rays = 0` across every budget and every escape rate. Sharing
 * the columns is sharing the erasure.
 *
 * SO THE INTERIOR IS MIRRORED RATHER THAN VIEWED. It has its own pools, its own columns,
 * its own random stream and its own statistics, and the two layers cannot reach into one
 * another by accident because there is nothing between them to reach through. What is
 * shared is the SHAPE: one point of this store per point the layer below has folded, and
 * a link here wherever the two originals are linked there.
 *
 * AND THE SHAPE IS THE SPACE (G/1) DESTROYED, which is the claim the layer is for. A fold
 * CONTAINS a point rather than freeing it — it leaves `loose`, stays in `live`, and keeps
 * its rays and its links — so the folded set is already a graph and not a tally. Nothing
 * ever read it; gravity takes the count as `density` and asks no more. Mirroring it is
 * what lets the same rules run on it: THE SPACE GRAVITY DESTROYS IS THE MATERIAL MATTER
 * IS MADE OF, and Layer 2 does not restate Layer 1's rules, it runs them here.
 *
 * WHAT `sync` COSTS, AND WHY IT IS PAID ONLY ON THE DIFFERENCE. Rewiring every mirror
 * every tick is the folded set times the degree squared, which at three thousand points
 * on fcc 12 is half a million index walks a tick to rediscover a graph that mostly did
 * not move. So arrivals and departures are what is walked: a point folded since last tick
 * gets a mirror and is wired to whichever of its neighbours already have one, and a point
 * handed back out of the interior takes its mirror with it. `Graph.remove` cascades
 * through the rays and unlinks the ends, so a departure leaves nothing facing nothing.
 */
export class Interior {
  /** the layer above's own store — separate pools, separate columns */
  readonly backend: Graph;

  /** host local index -> the point of this store that stands for it, beside the host
   *  point itself: `drift` re-contains that point, and the store has no public way back
   *  from an index to a ref */
  private mine = new Map<number, { mirror: Local; host: any }>();

  constructor(
    private readonly host: any,
    theory: Theory<any, any, any, any, any, any>,
    seed: number,
    DEG: number,
    bound = Infinity,
  ) {
    /*
     * IT GROWS AND IT FOLDS, because the rules that will run on it do both — Layer 2's
     * own (G/1) folds a point of the interior into another, which is an interior of an
     * interior and is exactly what a composite would have to be. It does NOT expand:
     * `make` puts a point one step along an exit of a LATTICE, and this store's shape is
     * whatever the layer below destroyed rather than a lattice it may extend.
     */
    this.backend = new Graph(theory, seed, bound, DEG * 2, true, true, true, false);
  }

  /** the points of the interior, by the host index each one stands for */
  get size(): number { return this.mine.size }

  /**
   * BRING THE MIRROR UP TO DATE WITH WHAT IS FOLDED NOW — run before the layer ticks.
   */
  sync(): void {
    const host = this.host;
    if (!host.eachFolded) return;
    const w = this.backend.rewrite;

    /* what is folded at this moment, as indices, so departures can be told from arrivals */
    const now = new Map<number, Local>();
    host.eachFolded((l: any) => now.set(l.i, l));

    /* DEPARTURES FIRST. A point handed back out of the interior by (G/2) is a point of
     * the world again, and what stood for it here is not anything — removed rather than
     * left dangling, since an end still linked to a dead ray is a partner facing nothing. */
    for (const [hi, held] of this.mine)
      if (!now.has(hi)) {
        /* IT TAKES ITS CHARGE BACK OUT WITH IT. A point handed out of the interior is a
         * point rejoining the vacuum, and deleting its mirror used to delete whatever
         * charge that mirror was carrying — matter releasing space while annihilating the
         * charge in it, which is a leak and not a rule. This is the inverse of the
         * burying that put the charge here in the first place. */
        this.give(held.mirror, held.host);
        w.delete(held.mirror);
        this.mine.delete(hi);
      }

    /* ARRIVALS. The point is made with one ray per ray the original has, so a midpoint
     * that `insert` made with two rays stands here as a two-valent point too — the
     * interior inherits the shape it was destroyed in rather than a tidied version. */
    const fresh: [number, Local, Ray[]][] = [];
    for (const [hi, hl] of now) {
      if (this.mine.has(hi)) continue;
      const hr = hl.rays as Ray[];
      const ml = w.local();
      const mr = hr.map(() => w.ray(ml));
      /* IT STANDS FOR AS MUCH SPACE AS THE ORIGINAL DOES. `density` is how many points
       * the folded point counts for, which on this layer's reading is how much matter is
       * at it — and the budget is read off it, so a mirror starting at 1 would make every
       * structure weigh the same however much was folded into it. */
      (ml as any).density = (hl as any).density ?? 1;
      (ml as any).buried = (hl as any).buried ?? 0;
      /*
       * AND WHAT IT WAS CARRYING COMES WITH IT. A point folded away leaves `loose`, so
       * its live rays stop counting in the layer below the moment it goes — and nothing
       * was carrying them up. That is momentum vanishing at every fold. Copied at the
       * same indices, so the direction is the direction it had.
       */
      for (let d = 0; d < hr.length; d++) {
        const src: any = hr[d];
        if (src?.active) {
          this.acc(this.p.fold1, d);                 // what Layer 1 stopped counting
          (mr[d] as any).active = true; (mr[d] as any).polarity = src.polarity ?? 0;
          this.acc(this.p.fold2, (mr as any[]).indexOf(mr[d]));   // what Layer 2 got
        }
      }
      this.mine.set(hi, { mirror: ml, host: hl });
      fresh.push([hi, ml, mr]);
    }
    w.flush();

    /*
     * THE ANTIPODAL PAIRING, TAKEN FROM THE ORIGINAL. `opposite` is read off the INWARD
     * link and every rule that turns or streams goes through it, so a mirror whose rays
     * are not paired is a point a ray cannot turn at. It is the original's own pairing
     * and not an assumed one, because the folded set contains points the lattice never
     * laid down.
     */
    for (const [hi, , mr] of fresh) {
      const hr = (now.get(hi) as any).rays as Ray[];
      for (let d = 0; d < hr.length; d++) {
        const o = opposite(hr[d]);
        if (!o) continue;
        const od = hr.indexOf(o);
        if (od <= d) continue;
        w.link(mr[d].boundaries[1] as Boundary, mr[od].boundaries[1] as Boundary);
      }
    }
    w.flush();

    /*
     * AND THE CHARGE IT WAS BURIED WITH, LIT AS THE PAIR IT WAS.
     *
     * A layer above has no (G/2): a neutral point of the interior does not split, because
     * making charge out of nothing is the vacuum's business and not matter's. So every
     * charge here came in the only way it can — an opposite meeting on the layer below
     * annihilated a ± pair and folded the point that held it, and this is that pair put
     * back on the point that stands for it. It is NET NEUTRAL by construction, which is
     * what ordinary matter is; a structure is charged only when its dynamics has
     * separated the two halves of pairs across a boundary.
     */
    for (const [hi, ml, mr] of fresh) {
      const n = (now.get(hi) as any).buried ?? 0;
      if (n <= 0 || mr.length < 2) continue;
      for (let k = 0; k + 1 < mr.length && k < 2 * n; k += 2) {
        (mr[k] as any).active = true; (mr[k] as any).polarity = 1;
        (mr[k + 1] as any).active = true; (mr[k + 1] as any).polarity = -1;
      }
    }

    /*
     * AND THE ADJACENCY — ONLY WHERE BOTH ENDS ARE IN. A folded point is still linked to
     * the loose points it was joined to, and those are not of this space: the interior's
     * EDGE is exactly the links that lead out, and leaving them unmirrored is what gives
     * it one. Wired from the arrivals, which also picks up the pairs where the neighbour
     * was already here.
     */
    for (const [hi, , mr] of fresh) {
      const hl: any = now.get(hi);
      const hr = hl.rays as Ray[];
      for (let d = 0; d < hr.length; d++) {
        const out = outward(hr[d]);
        const facing = out?.target?.source as Ray | undefined;
        const there: any = facing && (facing as any).l;
        if (!there) continue;
          const mt = this.mine.get(there.i)?.mirror;
        if (!mt) continue;
        const dm = (there.rays as Ray[]).indexOf(facing!);
        if (dm < 0) continue;
        const mine = mr[d].boundaries[0] as Boundary;
        const theirs = (mt.rays as Ray[])[dm]?.boundaries[0] as Boundary | undefined;
        /* an end that already faces something is already wired — linking again would
         * let go of what it had, which is how a graph loses half its degree */
        if (!theirs || mine.target || theirs.target) continue;
        w.link(mine, theirs);
      }
    }
    w.flush();
    this.label();
    this.index();
    this.returns();
  }

  /**
   * WHICH STRUCTURE EACH POINT BELONGS TO, AND HOW BIG THAT STRUCTURE IS.
   *
   * THE INTERIOR IS NOT ONE OBJECT AND HAS BEEN COUNTED AS ONE. Every measurement of it
   * so far has been a single number over the whole folded set — so a budget read off it
   * was a budget per POINT, and there was no quantity in the model that meant "how big
   * is the thing this point is part of". A structure is a connected component of this
   * store, which is a walk, and this is that walk.
   *
   * THE ID IS THE LOWEST INDEX IN THE COMPONENT, so it is the same id next tick for as
   * long as that member is still in it — enough to follow an object across ticks, and
   * honestly not a conserved identity: two structures that merge take the lower of the
   * two names and a structure that splits keeps its name on one half.
   *
   * WALKED WITH AN EXPLICIT STACK. The interior runs to thousands of points in one
   * component and a recursive flood over that is a stack the runtime will not give.
   */
  private label(): void {
    const b: any = this.backend;
    const seen = new Set<number>();
    const stack: any[] = [];
    for (const start of b as Iterable<any>) {
      if (seen.has(start.i)) continue;
      const comp: any[] = [];
      seen.add(start.i);
      stack.push(start);
      while (stack.length) {
        const x = stack.pop();
        comp.push(x);
        for (const r of x.rays as Ray[]) {
          const there: any = outward(r)?.target?.source?.l;
          if (!there || seen.has(there.i)) continue;
          /*
           * AND NOT INTO WHAT THIS LAYER HAS ITSELF FOLDED AWAY. Layer 2's own (G/1) ends
           * in a fold like Layer 1's, and a fold keeps the point's links — so the walk
           * followed them and counted an interior of the interior as part of the
           * structure, giving components larger than the whole store. That deeper set is
           * real and is what a THIRD layer would be made of; it is not this one's points.
           */
          if (b.parent(there) !== undefined) continue;
          seen.add(there.i);
          stack.push(there);
        }
      }
      let id = Infinity;
      for (const c of comp) if (c.i < id) id = c.i;
      for (const c of comp) { c.part = id; c.mass = comp.length; }
    }
  }

  /**
   * (LORENTZ) A STRUCTURE DRIFTS THROUGH LAYER 1, AND ITS CHARGE DECIDES WHICH WAY.
   *
   * NOTHING IN THIS MODEL HAS EVER MOVED MATTER. `TRANSPORT` moves a `Source`, which is
   * the thing Layer 2 exists to replace; a structure of the interior sits at whatever
   * host points were folded into it and stays there for ever. So nothing can approach
   * anything, and no amount of running produces clumping, because there is no mechanism
   * by which two structures could ever get closer together.
   *
   * THE FIELD IS RADIAL HERE AND THAT IS THE WHOLE CORRECTION. In electromagnetism a
   * charge in a field is pushed SIDEWAYS — qv×B — and the two signs go opposite ways.
   * What Layer 1 has at a point is not a transverse field but its own ray traffic
   * pointing OUTWARD, so the sideways-ness has nothing to be sideways to. What survives
   * the translation is the part that matters: THE TWO SIGNS GO OPPOSITE WAYS ALONG IT. A
   * structure of positive net charge drifts along Layer 1's local flux and a negative one
   * drifts against it, which is the same statement about opposite charges responding
   * oppositely, read on the axis the flux actually has.
   *
   * IT MOVES BY BEING SOMEWHERE ELSE, which is all a region can do — `TRANSPORT`'s own
   * words. A point of the interior is CONTAINED in a loose point of Layer 1, and that
   * containment is where it is; so moving it is re-containing it in the neighbour along
   * the drift, and the density it counts for goes with it. The structure moves as ONE
   * THING — it reads one flux, decides once, and its points go together or not at all —
   * because a structure is not a heap of independently drifting points.
   *
   * A NEUTRAL STRUCTURE DOES NOT MOVE, which is the check that this is charge doing it.
   */
  drift(strength: number, inertia: number): void {
    if (strength <= 0) return;
    const host = this.host, g = host.world?.geometry;
    if (!g?.DEG) return;
    const D = g.D as number;

    /* the structures, as the host points they are held at — one pass, since a structure
     * is a set of mirrors and what moves is what holds them */
    const parts = new Map<number, { hosts: any[]; Q: number }>();
    for (const { mirror: ml, host: hl } of this.mine.values()) {
      const p = parts.get((ml as any).part) ?? { hosts: [], Q: 0 };
      p.hosts.push(hl);
      for (const r of (ml as any).rays) if (r.active) p.Q += r.polarity ?? 0;
      parts.set((ml as any).part, p);
    }

    /* parts that are gone take their momentum with them */
    for (const id of [...this.carried.keys()]) if (!parts.has(id)) this.carried.delete(id);

    for (const [id, part] of parts) {
      if (!part.Q) continue;                       // neutral: nothing for the flux to pull on
      const sign = part.Q > 0 ? 1 : -1;

      /*
       * LAYER 1'S FLUX WHERE THIS STRUCTURE IS — the vector sum of what its host points
       * are actually sending, which is the only direction Layer 1 has at a place. Read
       * off the PARENTS, because those are the points of the world; the folded ones are
       * inside them and their traffic is this layer's, not the one below's.
       */
      const flux = new Array<number>(D).fill(0);
      for (const hl of part.hosts) {
        const at = host.parent(hl);
        if (!at) continue;
        const rays = (at as any).rays;
        for (let d = 0; d < rays.length && d < g.DEG; d++)
          if (rays[d]?.active)
            for (let i = 0; i < D; i++) flux[i] += (g.V[d][i] ?? 0) * (rays[d].polarity ?? 1);
      }

      /*
       * WHAT IT HAS ABSORBED LESS WHAT IT HAS EMITTED — see `tally`. Nothing here reads a
       * field: the structure is moved by what it actually ate and actually let go, which
       * is `TRANSPORT`'s own bookkeeping and is what turns a shadow into a pull.
       */
      const p = this.held2.get(id);
      if (!p) continue;

      let best = -1, most = 0;
      for (let d = 0; d < g.DEG; d++) {
        let along = 0;
        for (let i = 0; i < D; i++) along += p[i] * (g.U[d][i] ?? 0);
        if (along > most) { most = along; best = d; }
      }
      /* AND WHAT IT COSTS IS ITS MASS. A heavier structure needs more pushed through it
       * to go the same distance, which is what `inertia` already means in `G`. */
      const mass = Math.max(1, part.hosts.length);
      if (best < 0 || most < inertia * mass) continue;

      /*
       * AND IT GOES TOGETHER OR NOT AT ALL. Every point of it must have somewhere to go
       * — a LOOSE neighbour of the point that holds it — or the structure would tear,
       * with half of it a cell ahead of the other half.
       */
      const moves: [any, any, any][] = [];
      let torn = false;
      for (const hl of part.hosts) {
        const at: any = host.parent(hl);
        /* A POINT NEED NOT HAVE THE LATTICE'S EXITS. `insert` leaves a point with TWO
         * rays, and the settled vacuum is almost entirely made of those — measured at
         * 95-100% of it — so `rays[best]` for a `best` off the lattice's degree is
         * undefined and asking it for its ends throws. A point that has no such exit
         * cannot go that way, which is the same answer as an exit that leads nowhere. */
        const mine: any = at && (at.rays as Ray[])[best];
        const to: any = mine && outward(mine)?.target?.source?.l;
        if (!at || !to || host.parent(to) !== undefined) { torn = true; break; }
        moves.push([hl, at, to]);
      }
      if (torn) continue;

      for (const [hl, at, to] of moves) {
        host.contain(hl, to);
        /* the space it stands for goes with it, or gravity reads it in two places */
        if (typeof at.density === "number" && at.density > 1) at.density--;
        if (typeof to.density === "number") to.density++;
      }
      /* THE STEP IS PAID FOR OUT OF THE MOMENTUM and the rest is kept — which is what
       * makes this a velocity the structure HAS rather than one it is told each tick */
      for (let i = 0; i < D; i++) p[i] -= (g.V[best][i] ?? 0) * inertia * mass;
      this.moved++;
    }
  }

  /** every structure in the interior, as id -> how many points it is made of */
  parts(): Map<number, number> {
    const out = new Map<number, number>();
    for (const l of this.backend as Iterable<any>) out.set(l.part, l.mass);
    return out;
  }

  /** how many points the interior stands for */
  get held(): number { return this.mine.size }

  /**
   * (BINDING) IS THE MATTER AT THIS POINT OF THE WORLD HOLDING ITSELF TOGETHER?
   *
   * A structure that is running its own dynamics is not available to be dissolved, and
   * this is the question `withRelaxation` asks before it unfolds anything — see `binds`.
   * Without it relaxation fires on `density`, which is exactly how much matter is at a
   * point, so the rule that keeps the vacuum alive is the rule that shreds matter, and
   * the two cannot both be had.
   *
   * WHAT COUNTS AS HOLDING ITSELF TOGETHER is having somewhere for the action to go: a
   * point of the interior that is part of a structure of more than one point AND is
   * carrying its own traffic. A lone point has no graph to walk and nothing to bind it,
   * so it is dissolved like any other density — which is what makes this a statement
   * about STRUCTURES rather than a blanket refusal, and why it does not simply switch
   * relaxation off.
   *
   * THE ANSWER IS A COUNT OF POINTS and not a fraction, because it is compared against a
   * pressure that is also a count of points — see `RELAXATION`. Returning a share would
   * make the two sides incommensurable and put a fitted constant between them.
   *
   * INDEXED BY THE HOLDER, because that is what the rule below is quantified over. The
   * rule walks the world's loose points; the interior's points are contained in them, and
   * the map from one to the other is rebuilt with the rest of the mirror at `sync`.
   */
  bound(l: any, strength: number): number {
    if (strength <= 0) return 0;
    const held = this.inside.get((l as any).i);
    if (!held) return 0;
    /*
     * ONE ACTION PER STRUCTURE, SHARED OVER THE POINTS IT OCCUPIES.
     *
     * THIS WAS COUNTED PER POINT AND IT IS PER STRUCTURE. The model's own sentence is
     * "A STRUCTURE gets one action per tick", and counting every running point as holding
     * a full point's worth gave a structure of mass m an m-fold budget it does not have.
     * Measured, that made `hold >= pressure` almost everywhere: relaxation was refused
     * across the board, the vacuum could not expand, and it froze at 8,933 points and
     * occupancy 0.176 where the same Layer 1 alone runs to 98,795 at 0.428. A structure
     * of 250 points was holding 250 points' worth of space out of one action.
     *
     * So its one action is spread over what it occupies: each point of a structure of
     * mass m holds 1/m, and what a host point holds is the sum over the structures at it.
     * A point holding one whole small structure holds about a point's worth; a point that
     * is a two-hundred-and-fiftieth of a loose aggregate holds a two-hundred-and-fiftieth.
     * Which is also the right way round — a big loose thing is weakly bound per unit and
     * a small tight one strongly, and that is what the fitted 0.9 was crudely imitating.
     */
    let running = 0;
    const counted = new Set<number>();
    for (let i = 0; i < held.length; i++) {
      const m: any = held[i];
      const mass = m.mass ?? 1;
      if (mass <= 1) continue;                     // a lone point is not a structure
      let live = m.walking === true;
      if (!live) for (const r of m.rays) if (r.active) { live = true; break; }
      if (!live) continue;
      running += 1 / mass;
      counted.add(m.part);
    }
    /* HOW MANY POINTS' WORTH OF ACTION IS BEING SPENT HERE, which is what the pressure
     * is weighed against and is in the same unit as it: one running point is one action a
     * tick and holds one point's worth of space. `strength` is 1 unless a run is
     * deliberately scaling it to see what the balance point depends on. */
    return running * strength;
  }

  /** what each structure is carrying — momentum that OUTLIVES the tick it was given in,
   *  which is the difference between a force and a marching order. See `drift`. */
  private carried = new Map<number, number[]>();

  /** how many cells the interior's structures have moved, all told */
  moved = 0;

  /** charge handed back to the layer below, and charge that could not be handed back */
  released = 0;
  stranded = 0;

  /**
   * PUT WHAT THIS MIRROR IS CARRYING BACK ON THE POINT IT STOOD FOR.
   *
   * The mirror's rays were made one for one with the host's, so ray k here is ray k
   * there — the charge goes back on the way it came in. A host exit that is already
   * carrying something cannot take it, and what cannot be placed is counted rather than
   * quietly dropped, so the books can be checked instead of assumed.
   */
  private give(mirror: any, host: any): void {
    const hr = host.rays as any[];
    for (let k = 0; k < (mirror.rays as any[]).length; k++) {
      const m = (mirror.rays as any[])[k];
      const q = m.active ? (m.polarity ?? 0) : 0;
      if (!q) continue;
      const h = hr[k];
      if (h && !h.active) { h.active = true; h.polarity = q; this.released += q; }
      else this.stranded += q;
    }
    /* and whatever its rays were owing at their own slots — see `returns` */
    for (let k = 0; k < (mirror.rays as any[]).length; k++) {
      const owed = (mirror.rays as any[])[k]?.owes ?? 0;
      if (!owed) continue;
      (mirror.rays as any[])[k].owes = 0;
      const h = hr[k];
      if (h && !h.active) {
        h.active = true; h.polarity = Math.sign(owed); this.released += Math.sign(owed);
        this.acc(this.p.from2, k); this.acc(this.p.to1, k);
      } else this.stranded += owed;
    }
  }

  /**
   * AND THE SAME FOR WHAT REACHED THE SURFACE AND LEFT — run every sync, since a ray
   * radiates out of a structure that is otherwise staying exactly where it is.
   */
  /**
   * WHAT REACHED THE SURFACE AND LEFT, PAID BACK AT THE SLOT IT LEFT BY.
   *
   * Each ray carries its own debt, so ray k of a mirror pays at ray k of the point it
   * stands for and the direction survives the crossing. `behind` instead aims the
   * release against what the point took in — kept as a variant to measure the walk
   * against, and knowingly NOT conservative, since it puts what left one way back
   * another way.
   */
  private returns(): void {
    const g = this.host.world?.geometry;
    const aim = this.host.world?.emitting ?? "walk";
    for (const { mirror, host } of this.mine.values()) {
      const mr = (mirror as any).rays as any[];
      const hr = host.rays as any[];
      for (let k = 0; k < mr.length; k++) {
        const owed = mr[k]?.owes ?? 0;
        if (!owed) continue;
        mr[k].owes = 0;
        let at = k;
        if (aim === "behind" && g) {
          const v = this.intake.get((host as any).i);
          if (v) {
            let best = -1, worst = Infinity;
            for (let d = 0; d < hr.length; d++) {
              if (!hr[d] || hr[d].active) continue;
              let dot = 0;
              for (let i = 0; i < g.D; i++) dot += (g.U[d]?.[i] ?? 0) * (v[i] ?? 0);
              if (dot < worst) { worst = dot; best = d; }
            }
            if (best >= 0) at = best;
          }
        }
        const h = hr[at];
        if (!h || h.active) { this.stranded += owed; continue; }
        h.active = true; h.polarity = Math.sign(owed);
        this.released += Math.sign(owed);
        this.acc(this.p.from2, k);        // the slot it left the interior by
        this.acc(this.p.to1, at);         // and the slot it arrived on below
        this.tally((mirror as any).part, k, -1);       // and the structure gave it up
      }
    }
  }


  /**
   * (MATTER) WHAT IS HELD AT THIS POINT OF THE WORLD — asked of ONE point and its own
   * contents, because every coupling between the layers has to be local.
   *
   *   share    how much of a structure's single action this point commands: Σ 1/mass
   *   sign     THE MATTER'S OWN ±, which is NOT the ray polarity of the layer below.
   *            Layer 1's ± is MAGNETISM. What a structure has is the net of the pairs
   *            buried in it, and it is a Layer 2 quantity read off Layer 2's own rays.
   *   buried   how many ± pairs are here to be released
   */
  matter(l: any): { share: number; sign: number; buried: number } | undefined {
    const held = this.inside.get((l as any).i);
    if (!held || !held.length) return undefined;
    let share = 0, sign = 0, buried = 0;
    for (let i = 0; i < held.length; i++) {
      const m: any = held[i];
      const mass = m.mass ?? 1;
      if (mass > 1) share += 1 / mass;
      buried += m.buried ?? 0;
      for (const r of m.rays) if (r.active) sign += r.polarity ?? 0;
    }
    return { share, sign, buried };
  }

  /**
   * (G/2 SUPPRESSED) IS MATTER IN THE WAY OF THE EXPANSION HERE?
   *
   * The gravity of this model is matter being in the way — "the neighbourhood of matter
   * is a region where (G/2) has fewer places to fire", and the deficit that leaves is the
   * pull. A structure spends its action walking its own graph, and a point spending its
   * action on that is not also free to split. Until this was wired, Layer 2 left NO trace
   * on Layer 1 at all: occupancy came out 0.426-0.428 whether the interior was there or
   * not, so matter was gravitationally invisible and nothing could ever attract anything.
   */
  occupied(l: any): boolean {
    const m = this.matter(l);
    return !!m && m.share > 0;
  }

  /**
   * (ABSORB) A RAY OF THE LAYER BELOW MEETS THE MATTER AT THIS POINT.
   *
   * IT IS THE MATTER'S OWN SIGN IT IS COMPARED AGAINST, not a charge. Layer 1's polarity
   * is magnetism; what decides here is the XOR of the arriving ray against the ± the
   * structure itself is holding — the same "opposite annihilates, alike turns" the model
   * is built on, asked one level up.
   *
   * AND ABSORBING IS HOW IT MOVES. The ray is taken out of the layer below and its
   * momentum credited here, which is `TRANSPORT`'s own `absorbed − emitted` and is what
   * makes the momentum conserved rather than conjured: what the structure gains, Layer 1
   * loses, in the same tick. Eating from behind puts weight behind it, and a region moves
   * by being somewhere else.
   */
  absorbed = 0;
  swallowed = 0;

  /**
   * THE MOMENTUM LEDGER — every vector that crosses between the layers, both ends of it,
   * recorded from the OBJECTS rather than from the intent.
   *
   * A construction argument is not a measurement. Absorption lights the mirror at the
   * slot the ray arrived on, so the transfer "must" be exact — but that is a claim about
   * code, and the way to check it is to add up what actually left one layer and what
   * actually reached the other and see whether the two are the same vector. `from1`/`to2`
   * are the absorption path, `from2`/`to1` the release path, and `up` what a fold carries.
   * A residual of anything but zero is momentum being made or lost at the crossing.
   */
  readonly p = {
    from1: [] as number[], to2: [] as number[],
    from2: [] as number[], to1: [] as number[],
    /* the fold crossing, both ends: what the point was carrying when it left `loose`,
     * and what the mirror standing for it actually came up holding */
    fold1: [] as number[], fold2: [] as number[],
  };
  /**
   * WHAT EACH STRUCTURE HAS ABSORBED LESS WHAT IT HAS EMITTED — the only thing that
   * should move it, and the model's own reading of a body's motion.
   *
   * `TRANSPORT` says a body's momentum is `absorbed − emitted`: a tally of what actually
   * arrived and what actually left, kept at the body. `drift` did not do that. It sampled
   * the ambient FLUX at the structure's location and added it — a field being read, which
   * is the path-integral reading of gravity rather than a local one, and it double-counts
   * the absorption channel that is already moving momentum across.
   *
   * AND IT IS WHAT MAKES THE SHADOW PULL. Two structures each suppress (G/2) where they
   * sit, so between them there is less traffic. A structure therefore absorbs FEWER rays
   * from its neighbour's direction than from the open side, and a ray absorbed along d
   * pushes along +V[d] — away from where it came from. Less push away from the neighbour
   * is a net push TOWARDS it. Attraction out of local tallying, with no path in it.
   */
  readonly held2 = new Map<number, number[]>();
  private tally(part: number, d: number, sign: number) {
    const g = this.host.world?.geometry;
    if (!g || d < 0 || part === undefined) return;
    let v = this.held2.get(part);
    if (!v) this.held2.set(part, v = new Array(g.D).fill(0));
    for (let i = 0; i < g.D; i++) v[i] += sign * (g.V[d][i] ?? 0);
  }

  private acc(into: number[], d: number, sign = 1) {
    const g = this.host.world?.geometry;
    if (!g || d < 0) return;
    for (let i = 0; i < g.D; i++) into[i] = (into[i] ?? 0) + sign * (g.V[d][i] ?? 0);
  }
  /** what a point of the world has taken in, as a direction — see `emitting: "behind"` */
  readonly intake = new Map<number, number[]>();

  /**
   * `how`   which rays are taken in: by the XOR against the matter's OWN sign, or all,
   *         or the alike ones, or none. Layer 1's ± is MAGNETISM, so this is never a
   *         charge test — the others are carried to say whether it is the XOR that does
   *         the work or merely the taking-in.
   * `takes` `ray` takes only what landed. `point` ALSO folds in the point it came from,
   *         so the vacuum is drawn through and space contracts behind — movement by
   *         eating rather than movement by being pushed.
   */
  absorb(l: any, r: any, how: string, takes: string): boolean {
    if (how === "none") return false;
    const m = this.matter(l);
    if (!m || !m.share) return false;
    const q = r.polarity ?? 0;
    if (!q) return false;
    if (how === "xor" && m.sign !== 0 && Math.sign(q) === Math.sign(m.sign)) return false;
    if (how === "alike" && m.sign !== 0 && Math.sign(q) !== Math.sign(m.sign)) return false;
    const held = this.inside.get((l as any).i);
    if (!held || !held.length) return false;

    /*
     * IT KEEPS THE DIRECTION IT ARRIVED WITH, which is the whole of the momentum
     * bookkeeping. A ray at slot d travels along V[d], and mirror rays are indexed the
     * same way as the lattice's, so lighting slot d on the mirror carries exactly what
     * Layer 1 gave up. Lighting the FIRST FREE slot instead — which is what this did —
     * takes p along V[d] out of one layer and puts p along V[whatever] into the other,
     * and the difference is momentum made out of nothing, every absorption.
     */
    const g0 = this.host.world?.geometry;
    const di = (l.rays as any[]).indexOf(r);
    let took = false;
    for (const mm of held) {
      const mrs = (mm as any).rays as any[];
      const want = di >= 0 && di < mrs.length ? mrs[di] : undefined;
      if (want && !want.active) {
        want.active = true; want.polarity = q; this.absorbed++; took = true;
        /* read back off the objects: what Layer 1 is about to lose, and what Layer 2
         * actually gained — the mirror's OWN index, not the one we meant to use */
        this.acc(this.p.from1, di);
        this.acc(this.p.to2, mrs.indexOf(want));
        this.tally((mm as any).part, di, +1);          // this structure took it in
        break;
      }
    }
    if (!took) return false;

    /* WHERE IT CAME FROM, kept so a release can be aimed against it */
    const g = this.host.world?.geometry;
    const rays = l.rays as any[];
    const d = rays.indexOf(r);
    if (g && d >= 0) {
      const k = (l as any).i;
      let v = this.intake.get(k);
      if (!v) this.intake.set(k, v = new Array(g.D).fill(0));
      for (let i = 0; i < g.D; i++) v[i] += g.V[d][i] ?? 0;

      /* AND THE POINT IT CAME FROM GOES WITH IT — the vacuum drawn in behind the ray */
      if (takes === "point") {
        const back = rays[g.OPP?.[d] ?? d];
        const src: any = back && outward(back)?.target?.source?.l;
        if (src && src !== l && this.host.parent(src) === undefined) {
          this.host.rewrite.fold(l, src); this.swallowed++;
        }
      }
    }
    return true;
  }

  /** loose host index -> the mirrors held there, rebuilt at `sync` */
  private inside = new Map<number, any[]>();

  private index(): void {
    this.inside.clear();
    for (const { mirror, host } of this.mine.values()) {
      const at = this.host.parent(host);
      if (!at) continue;
      const k = (at as any).i;
      const list = this.inside.get(k);
      if (list) list.push(mirror); else this.inside.set(k, [mirror]);
    }
  }
}
