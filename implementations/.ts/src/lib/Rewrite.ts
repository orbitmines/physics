import { Backend } from "./Backend.ts"
import { Boundary, kind, leaving, Local, opposite, outward, Ray, Ref, Ref2 } from "./Local.ts"

export type Op =
  | { op: "contain"; child: Ref2; parent?: Ref2 }
  | { op: "link"; a: Boundary; b?: Boundary }
  | { op: "delete"; ref: Ref2 }

export class Rewrite {
  ops: Op[] = []
  fresh = new WeakSet<object>()

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
    this.fresh.add(ref);
    return ref;
  }

  private now = (...refs: (Ref2 | undefined)[]) =>
    refs.every(r => r === undefined || this.fresh.has(r))

  contain = (child: Ref2, parent?: Ref2): this => {
    const op: Op = { op: "contain", child, parent };
    if (this.now(child)) this.backend.apply(op); else this.ops.push(op);
    return this;
  }

  link = (a: Boundary, b?: Boundary): this => {
    const op: Op = { op: "link", a, b };
    if (this.now(a, b)) this.backend.apply(op); else this.ops.push(op);
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
  fold = (into: Local, l: Local): this => {
    if (into === l || !this.backend.folds) return this;
    this.backend.stats.folded++;
    const a = into as any, b = l as any;
    if (!this.backend.removes) {
      if (typeof a.density === "number") a.density += 1;
      return this;
    }
    if (typeof a.density === "number") a.density += (b.density ?? 1);
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
    const back = (store.first ? store.first("Local", l)
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

  insert = (b: Boundary): Local | undefined => {
    const t = b.target;
    if (!t) return undefined;
    this.backend.stats.created++;
    if (!this.backend.grows) return undefined;
    if (this.held() >= this.backend.bound) return undefined;
    const mid = this.create("Local") as Local;
    const near = this.ray(mid), far = this.ray(mid);
    near.boundaries[1].link(far.boundaries[1]);
    near.boundaries[0].link(b);
    far.boundaries[0].link(t);
    /* it sits BETWEEN the two, which is what "a point inserted on the edge" means, and a
     * store with a grid has no slot there — so the rewrite says where it went */
    const store = this.backend as any;
    const a = b.source?.l, c = t.source?.l;
    if (store.place && store.at && a && c)
      store.place(mid, store.at(a).map((x: number, i: number) => (x + store.at(c)[i]) / 2));
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
    const at = store.at(here).map((x: number, i: number) => x + (g.L[d]?.[i] ?? 0));

    /* somebody is already there: then it is a neighbour, not a place to make one */
    const already = store.atCoord?.(at);
    if (already && already !== here) { this.join(here, already, d, facing); return already; }
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

  /** two points that are already neighbours, joined on the exit between them */
  private join = (here: Local, there: Local, d: number, facing: number[]) => {
    const a = leaving((here.rays as any[])[d]);
    const b = leaving((there.rays as any[])[facing[d]]);
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
    for (const op of ops) this.backend.apply(op);
  }
}
