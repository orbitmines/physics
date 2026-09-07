import { Backend } from "./Backend.ts"
import { Boundary, kind, leaving, Local, opposite, outward, Ray, Ref, Ref2 } from "./Local.ts"

export type Op =
  | { op: "contain"; child: Ref2; parent?: Ref2 }
  | { op: "link"; a: Boundary; b?: Boundary }
  | { op: "delete"; ref: Ref2 }

export class Rewrite {
  ops: Op[] = []

  /**
   * WHICH PASS A REF WAS MADE IN — and "fresh" is "made in this one".
   *
   * It was a WeakSet: one add per ref made and one lookup per primitive, which is five
   * million hashed lookups to lay down a 41³ box before anything has ticked. What the
   * question actually is is a comparison of two numbers, so it is stored as one — stamped
   * on the flyweight by `create` and read back by the primitives. A ref made in an earlier
   * pass carries an earlier stamp and is correctly not fresh; an index freed and handed
   * out again is stamped again on its way through `create`, so a recycled flyweight
   * cannot inherit the freshness of the ref that used to live at its index.
   */
  private gen = 0

  private fresh = (r: Ref2 | undefined) => (r as any)?.born === this.gen

  constructor(public backend: Backend) {}

  /**
   * HOW BIG THE WORLD IS, WHICH IS WHAT A BOUND IS AGAINST — and it is POINTS.
   *
   * Not everything the store is holding: a fold contains the point rather than deleting
   * it, reversibly, and the very next creation at that site hands it straight back. A
   * cap written against what is held is therefore a cap a theory spends on its own
   * corpses — measured, pure gravity, which folds on every meeting, stopped growing at
   * a quarter of the size the article's run reached while the conserving medium, which
   * folds nothing, ran to the end of its budget.
   */
  private held = () => this.backend.size();

  create = (of: Ref): Ref2 => {
    const ref = this.backend.create(of);
    (ref as any).born = this.gen;
    return ref;
  }

  /*
   * A REWRITE ON SOMETHING THIS PASS JUST MADE LANDS NOW; ONE ON THE WORLD AS IT STANDS
   * WAITS FOR THE FLUSH — because a rule sees the world as it stood when its pass began,
   * and a ref nothing has seen yet cannot break that.
   *
   * The immediate path allocates nothing: it calls the primitive. It used to build the
   * `Op` either way and pass it to `apply`, and to ask `now(...refs)` through rest args —
   * two allocations on each of the two and a half million primitive calls that laying
   * down a 41³ box takes, which was 78% of the twenty seconds it took.
   */
  contain = (child: Ref2, parent?: Ref2): this => {
    if (this.backend.contain && this.fresh(child)) this.backend.contain(child, parent);
    else this.ops.push({ op: "contain", child, parent });
    return this;
  }

  link = (a: Boundary, b?: Boundary): this => {
    if (this.backend.linkEnds && this.fresh(a) && (b === undefined || this.fresh(b)))
      this.backend.linkEnds(a, b);
    else this.ops.push({ op: "link", a, b });
    return this;
  }

  delete = (ref: Ref2): this => {
    this.ops.push({ op: "delete", ref });
    return this;
  }

  local = (): Local => {
    const l = this.create("Local") as Local;
    return l;
  }

  ray = (at: Local, ends = 2): Ray => {
    const r = this.create("Ray") as Ray;
    this.contain(r, at);
    for (let i = 0; i < ends; i++) this.contain(this.create("Boundary"), r);
    return r;
  }

  /**
   * (G/1) TWO POINTS BECOME ONE — and what the survivor now stands for is its DENSITY,
   * which is what "two to one, three to one" means and what a force is read off.
   *
   * ONE POINT ABSORBED, NOT `l`'s WHOLE HISTORY, where the backend does not remove it.
   * A store that really takes `l` away moves its whole count across once; a flat one
   * leaves `l` standing as a site that can fold again next tick, so adding its density
   * COMPOUNDS — measured in the article at 2.6·10⁸ inside a hundred and sixty ticks,
   * which made the annihilation channel of the sign law garbage while looking like a
   * number.
   */
  /**
   * WHAT HAPPENS TO THE LINKS OF A POINT THAT IS FOLDED AWAY — see `Rewrite.fold`.
   *
   *   keep        nothing. Its neighbours go on facing it, and it is no longer a point
   *               of the world, so those links lead nowhere a rule can follow
   *   inherit     THE SURVIVOR TAKES THEM OVER — the link is MOVED, so the point that
   *               went loses it and the interior it now belongs to is cut off from what
   *               it used to be beside
   *   paired      the same, but only what can be handed over as ± pairs
   */
  static Folding = ["keep", "inherit", "paired"] as const;

  /**
   * (G/1) TWO POINTS BECOME ONE — and what the survivor now stands for is its DENSITY,
   * which is what "two to one, three to one" means and what a force is read off.
   *
   * AND WHAT BECOMES OF THE LINKS OF THE ONE THAT WENT, which was nothing at all. A fold
   * CONTAINS the point: it leaves `loose`, keeps every link it had, and every neighbour
   * goes on facing it — at a point that is no longer part of the world. Measured on
   * fcc 12 after one tick: of 8,500 links out of loose points, 7,792 led to a folded one
   * and 708 did not. THE LOOSE GRAPH HAD DEGREE 0.18. That is not a thin vacuum, it is a
   * disconnected one, and it is the whole reason no ray ever meets another after the
   * opening ticks — there is almost nothing left to travel along.
   *
   * SO THE SURVIVOR INHERITS THEM. Two points becoming one means what was beside either
   * is beside the one that is left, and the ways out it gains are the ways out the other
   * had: a point that has absorbed its neighbourhood is a HUB, and its degree grows past
   * the lattice's. That is not an accident of the encoding — `unfold` exists precisely
   * because it does, and says so: "a point's degree grows without bound, measured at 396
   * ways out of a point where the lattice has 26". The inherited ways are made as ± PAIRS
   * so `opposite` still answers at them and a ray can still turn.
   *
   * ONE POINT ABSORBED, NOT `l`'s WHOLE HISTORY, where the backend does not remove it.
   * A store that really takes `l` away moves its whole count across once; a flat one
   * leaves `l` standing as a site that can fold again next tick, so adding its density
   * COMPOUNDS — measured in the article at 2.6·10⁸ inside a hundred and sixty ticks,
   * which made the annihilation channel of the sign law garbage while looking like a
   * number.
   */
  fold = (into: Local, l: Local): this => {
    if (into === l || !this.backend.folds) return this;
    this.backend.stats.folded++;
    const a = into as any, b = l as any;
    if (!this.backend.removes) {
      if (typeof a.density === "number") a.density += 1;
      return this;
    }
    if (typeof a.density === "number") a.density += (b.density ?? 1);

    const how = (this.backend as any).world?.folding;

    if (how === "inherit" || how === "paired") {
      /*
       * WHAT IS STILL BESIDE IT, COLLECTED FIRST. The exit index is kept with each one so
       * the ways in can be handed to the survivor as ± PAIRS: a ray whose antipode faces
       * nothing is a way out that goes nowhere, and (G/2) lights it every tick along with
       * the real ones. Measured, giving each inherited way a blank partner cost the
       * vacuum most of its occupancy — 0.045 against 0.418 — because the traffic went
       * into ends that could not carry it.
       */
      const mine = l.rays as Ray[];
      const found: [number, Boundary][] = [];
      for (let e = 0; e < mine.length; e++) {
        const out = outward(mine[e]);
        const there: any = out?.target?.source?.l;
        /* the edge the two met on leads to the survivor itself, and a point is not its
         * own neighbour; a link into something already folded leads out of the world */
        if (!there || there === into || this.backend.parent(there) !== undefined) continue;
        found.push([e, out!.target as Boundary]);
      }
      const g = (this.backend as any).world?.geometry;
      const taken = new Set<number>();
      for (let i = 0; i < found.length; i++) {
        const [e, facing] = found[i];
        if (taken.has(e)) continue;
        /* the way back out on the same axis, if this point still had one — then the two
         * are handed over together and `opposite` answers at both */
        const o = g?.OPP?.[e];
        const j = o === undefined ? -1 : found.findIndex(([f]) => f === o && !taken.has(f));
        taken.add(e);
        const a1 = this.ray(into);
        if (j >= 0) {
          const [f, other] = found[j];
          taken.add(f);
          const a2 = this.ray(into);
          a1.boundaries[1].link(a2.boundaries[1]);
          a1.boundaries[0].link(facing);
          a2.boundaries[0].link(other);
        } else if (how === "inherit") {
          /* no partner to be had: the way is still real, and `opposite` has no answer at
           * it — the same state a ray at the edge of a bounded world is already in */
          a1.boundaries[0].link(facing);
        }
        /* `paired` hands over only what it can hand over in pairs, and drops the rest */
      }
    }
    return this.contain(l, into);
  }

  /**
   * THE INVERSE: a point expands, giving back space that was folded into it.
   *
   * Without it the two rules do not fight over anything — annihilation folds space away
   * monotonically and a point's degree grows without bound, measured at 396 ways out of
   * a point where the lattice has 26. Where no point can actually be made, the count is
   * what is given back, which is the same statement at the resolution a grid has.
   */
  unfold = (l: Local): Local | undefined => {
    const d = l as any;
    /* give back a point this one had absorbed, if it has one — asked without listing
     * every child of every point, every tick, to look at the first of them */
    const store = this.backend as any;
    /*
     * TAKEN OFF THE FACE, NOT OUT OF THE MIDDLE.
     *
     * `first` hands back the OLDEST point this one absorbed, which is a fact about the
     * order things were folded in and nothing about where they sit. Handing that one back
     * guts a structure from the inside: what the vacuum reached was its surface, and what
     * came away was whatever happened to have been swallowed first. Measured, a structure
     * of 2,289 points came apart into 67 even with the pressure restricted to points that
     * have vacuum beside them, because the point released was never the one the vacuum was
     * pulling at.
     *
     * SO IT IS THE ONE WITH A LIVE LINK OUT — a point of the containment still joined to
     * something that is not matter, which is exactly the face the vacuum can reach. Where
     * none of them has one the oldest is given back as before, because a structure with no
     * face is one this reading has nothing to say about.
     */
    let back: Local | undefined;
    const held = (store.contained?.(l) ?? []) as Local[];
    for (const c of held) {
      for (const r of (c as any).rays as any[]) {
        const there: any = outward(r)?.target?.source?.l;
        if (!there || there === l) continue;
        if (((store.contained?.(there) ?? []) as Local[]).length === 0) { back = c; break; }
      }
      if (back) break;
    }
    back ??= (store.first ? store.first("Local", l)
      : this.backend.children(l).filter(c => kind(c) === "Local")[0]) as Local | undefined;
    if (back) {
      this.contain(back, undefined);
      if (typeof d.density === "number" && d.density > 1) d.density--;
      return back;
    }
    if (!this.backend.expands) {
      /* space given back where none can be made: a point that stands for several gives
       * one of them up, which is what makes (G/2) and (G/1) fight over something */
      if (typeof d.density === "number" && d.density > 1) d.density--;
      return undefined;
    }
    /*
     * AND WHERE NOTHING WAS FOLDED IN, (G/2) MAKES THE SECOND POINT ITSELF.
     *
     * "A neutral point expands into TWO POINTS" is a rule that makes space, not one that
     * only hands back space that was taken. In a bounded world there is nowhere to put
     * the second one and the sentence has to be read as the count; in an expanding one it
     * is a point, beside this one, in the first direction that has nothing in it — and
     * that is where the growth in an expanding world comes from, rather than only from
     * rays falling off the edge.
     */
    const mine = l.rays as any[];
    for (let e = 0; e < mine.length; e++) {
      if (outward(mine[e])) continue;                  // that way is already somewhere
      const there = this.make(l, e);
      if (there) return there;
    }
    return undefined;
  }

  /**
   * WHAT SHAPE THE POINT A DEFLECTION LEAVES BEHIND HAS — see `Rewrite.insert`.
   *
   *   pair    two rays, along the axis of the meeting and nothing else. What this model
   *           has always done, and what makes the point a SEGMENT: a ray on it can only
   *           shuttle back and forth
   *   full    one ray per exit of the lattice, paired antipodally as the lattice pairs
   *           them, with the meeting's axis wired into the edge and the rest left facing
   *           nothing — a point of the lattice's own degree rather than a bead on a
   *           thread, so it has an equator and can be met from any direction that ever
   *           reaches it
   *   none    no point at all: the deflection turns the rays and makes no space. The
   *           CONTROL, and the one that says whether any of this is what freezes the
   *           vacuum
   */
  static Inserting = ["pair", "full", "near", "both", "none"] as const;

  /**
   * (G+M/3) THE POINT A DEFLECTION LEAVES BETWEEN THE TWO THAT MET.
   *
   * IT IS A SUBDIVISION AND ITS DEGREE IS THE WHOLE QUESTION. `pair` gives the new point
   * two rays, so an edge A—B becomes A—mid—B and `mid` is 2-valent. Measured on fcc 12
   * from a fresh lattice: tick 2 resolves the WHOLE board at once — 4,042 annihilations
   * and 3,944 deflections — and what is left is 51 lattice points of degree 12 beside
   * 3,944 midpoints of degree 2, a mean of 2.13 ways out where the lattice has 12. After
   * that no ray ever meets another again and the vacuum runs in a period-2 cycle for
   * ever, at an occupancy of 2-6% against the ~50% every mean-free-path in this book
   * assumes.
   *
   * So the shape is a PARAMETER rather than a detail, and it is read off the world.
   */
  insert = (b: Boundary): Local | undefined => {
    const t = b.target;
    if (!t) return undefined;
    const store = this.backend as any;
    const how = store.world?.inserting ?? "pair";
    if (how === "none") return undefined;
    this.backend.stats.created++;
    if (!this.backend.grows) return undefined;
    if (this.held() >= this.backend.bound) return undefined;
    const mid = this.create("Local") as Local;
    const g = store.world?.geometry;

    if (how !== "pair" && g?.DEG) {
      /*
       * A POINT OF THE LATTICE'S OWN DEGREE, AND WHERE ITS OTHER EXITS LEAD.
       *
       * `full` gives it the rays and wires only the axis it was inserted on, which is
       * degree 12 in name and degree 2 in practice: the other eleven face nothing, so a
       * ray reaching one dies there. Measured, it left occupancy LOWER than `pair` did.
       *
       * THE POINT ALREADY HAS A NEIGHBOURHOOD AND IT IS THE ONE IT SPLIT INSIDE OF. It
       * sits between A and B, and both of those are points of the lattice with all their
       * connections; the midpoint is half a cell from each, so what is spatially beside
       * it is what is beside them. `near` takes A's neighbours for every exit; `both`
       * takes A's for the exits facing back towards A and B's for the ones facing B,
       * which is the reading that matches where the point actually is.
       *
       * THE CONNECTIONS ARE PRESERVED AND THEN FOUGHT OVER AGAIN. A midpoint wired into
       * the neighbourhood is a point (G/2) can split and (G/1) can annihilate on like any
       * other, so the space a deflection makes goes back into the same contest instead of
       * leaving the lattice as a bead on a thread.
       */
      const rays = Array.from({ length: g.DEG }, () => this.ray(mid)) as Ray[];
      for (let d = 0; d < g.DEG; d++) {
        const o = g.OPP[d];
        if (o > d) rays[d].boundaries[1].link(rays[o].boundaries[1]);
      }
      /*
       * THE AXIS IT WAS INSERTED ON, READ OFF THE MEETING. `b` is an end of a ray at A,
       * and which of A's exits that ray is IS the direction from A to B — so the midpoint
       * takes that exit towards B and its opposite back towards A, and the two are the
       * same axis rather than an arbitrary pair.
       */
      const A0: any = b.source?.l;
      const axis = Math.max(0, A0 ? (A0.rays as any[]).indexOf(b.source) : 0);
      rays[axis].boundaries[0].link(t);
      rays[g.OPP[axis]].boundaries[0].link(b);

      if (how === "near" || how === "both") {
        const A: any = b.source?.l, B: any = t.source?.l;
        const side = (e: number) => {
          if (how === "near") return A;
          /* which of the two it is on the far side of — dot with the axis it lies along */
          let along = 0;
          for (let i = 0; i < (g.D as number); i++)
            along += (g.U[e][i] ?? 0) * (g.U[axis][i] ?? 0);
          return along > 0 ? B : A;   // pointing on towards B, or back towards A
        };
        for (let e = 0; e < g.DEG; e++) {
          if (e === axis || e === g.OPP[axis]) continue;
          const from: any = side(e);
          const mineEnd = leaving(rays[e]);
          if (!from || !mineEnd || mineEnd.target) continue;
          /* the neighbour A (or B) has that way, and the end of it that faces back */
          const hop = (from.rays as any[])[e];
          const nb: any = hop && outward(hop)?.target?.source?.l;
          if (!nb || nb === mid) continue;
          /*
           * AND IT IS ALWAYS ALREADY TAKEN, WHICH IS THE ANSWER RATHER THAN A GUARD.
           *
           * A boundary faces exactly ONE partner, and A's neighbour P is already facing
           * A — that is what makes them neighbours. So there is no free end for the
           * midpoint to take, and inheriting A's neighbourhood cannot be done by
           * borrowing it: measured, 21,920 attempts in five ticks and 0 links made, which
           * is why `near` and `both` came out byte-identical to `full`.
           *
           * THE MIDPOINT'S REAL NEIGHBOUR IS ANOTHER MIDPOINT. It sits at (A+B)/2, so
           * what is a cell away along e is the midpoint of the edge (A+e)—(B+e) — which
           * exists only if that edge deflected too, and is therefore not knowable from
           * inside a single `insert`. Wiring those together is a pass over the midpoints
           * a tick made, not an operation on one of them.
           */
          const back = (nb.rays as any[])[g.OPP[e]];
          const end = back && leaving(back);
          if (!end || end.target) continue;
          mineEnd.link(end);
        }
      }
    } else {
      const near = this.ray(mid), far = this.ray(mid);
      near.boundaries[1].link(far.boundaries[1]);
      near.boundaries[0].link(b);
      far.boundaries[0].link(t);
    }

    /* it sits BETWEEN the two, which is what "a point inserted on the edge" means, and a
     * store with a grid has no slot there — so the rewrite says where it went */
    const a = b.source?.l, c = t.source?.l;
    /* A GUARD ON THE FUNCTIONS IS NOT A GUARD ON THE POINTS. A store may know how to
     * place things and still not know where THESE two are — a midpoint of a midpoint has
     * no coordinate until one is given — so both ends are asked for, not just the store. */
    if (store.place && store.at && a && c) {
      const pa = store.at(a), pc = store.at(c);
      if (pa && pc) store.place(mid, pa.map((x: number, i: number) => (x + pc[i]) / 2));
    }
    return mid;
  }

  /**
   * A POINT ONE STEP ALONG AN EXIT, WIRED INTO WHATEVER IS ALREADY THERE.
   *
   * It is the one operation that makes the world BIGGER rather than subdividing what it
   * already has, and both of the rules that grow space go through it: a ray stepping off
   * the edge, and (G/2) expanding a neutral point into two.
   *
   * THE NEW POINT IS A POINT OF THE SAME LATTICE. Its rays mirror the ones it grew from,
   * paired into the same antipodal pairs, and every PLACE beside it that already holds a
   * point is joined to it. Without that last part the world grows as a TREE — measured,
   * the mean ways out of a point came to 8.6 where the lattice has 12.
   */
  private make = (here: Local, d: number): Local | undefined => {
    const store = this.backend as any;
    const g = store.world?.geometry;
    const mine = here.rays as any[];
    if (!g || d < 0 || d >= mine.length || !store.at || !store.place) return undefined;

    /* the pairing, read off this point's own links rather than off a table */
    const facing: number[] = new Array(mine.length).fill(-1);
    for (let i = 0; i < mine.length; i++) {
      const o = opposite(mine[i]);
      facing[i] = o ? mine.indexOf(o) : -1;
    }
    const from = store.at(here);
    if (!from) return undefined;                 // it does not know where it is growing FROM
    const at = from.map((x: number, i: number) => x + (g.L[d]?.[i] ?? 0));

    /* somebody is already there: then it is a neighbour, not a place to make one */
    const already = store.atCoord?.(at);
    if (already && already !== here) { this.join(here, already, d, facing); return already; }
    /* and the world may only reach so far — a bound on the EXTENT, which is what a
     * radius is, and which leaves subdivision inside it free. See `Flat.within`. */
    if (store.within && !store.within(at)) return undefined;
    if (this.held() >= this.backend.bound) return undefined;

    const there = this.local();
    const made = mine.map(() => this.ray(there));
    for (let i = 0; i < mine.length; i++)
      if (facing[i] > i) made[i].boundaries[1].link(made[facing[i]].boundaries[1]);
    store.place(there, at);

    for (let i = 0; i < made.length; i++) {
      const step = g.L[i];
      if (!step || facing[i] < 0) continue;
      const nb = i === facing[d]
        ? here
        : store.atCoord?.(at.map((x: number, k: number) => x + (step[k] ?? 0)));
      if (!nb) continue;
      const back = (nb.rays as any[])[facing[i]];
      const end = back && leaving(back);
      if (!end || end.target) continue;                // it already faces something
      made[i].boundaries[0].link(end);
    }
    this.backend.stats.created++;
    return there;
  }

  /**
   * TWO POINTS THAT ARE ALREADY NEIGHBOURS, JOINED ON THE EXIT BETWEEN THEM.
   *
   * A POINT NEED NOT HAVE THE LATTICE'S EXITS. `insert` leaves one with two rays and no
   * exit numbering of its own, a ring joins two points by a way that was not there before,
   * and the settled graph is mostly those — so `rays[d]` for a `d` off the lattice's degree
   * is undefined and asking it which end leaves throws. A point with no such exit is not a
   * point this join is about.
   */
  private join = (here: Local, there: Local, d: number, facing: number[]) => {
    const mine = (here.rays as any[])[d];
    const yours = (there.rays as any[])[facing[d]];
    if (!mine || !yours) return;
    const a = leaving(mine);
    const b = leaving(yours);
    if (a && b && !a.target && !b.target) a.link(b);
  }

  /**
   * A RAY THAT STEPS INTO NOTHING MAKES THE ROOM IT NEEDS — which is what an EXPANDING
   * boundary is, and the one place the refusal of a bounded world belongs.
   */
  grow = (b: Boundary): Local | undefined => {
    if (b.target) return undefined;
    if (!this.backend.expands) return undefined;
    const here = b.source?.l as Local | undefined;
    if (!here) return undefined;
    return this.make(here, (here.rays as any[]).indexOf(b.source));
  }

  collapse = (b: Boundary): this => {
    const t = b.target;
    if (!t) return this.delete(b);
    const into = b.source, from = t.source;
    for (const x of from.boundaries) if (x !== t) this.contain(x, into);
    this.link(b).link(t);
    return this.delete(b).delete(t).delete(from);
  }

  flush = (): void => {
    const ops = this.ops;
    this.ops = [];
    this.gen++;                     // whatever was fresh has landed; nothing is now
    for (const op of ops) this.backend.apply(op);
  }
}
