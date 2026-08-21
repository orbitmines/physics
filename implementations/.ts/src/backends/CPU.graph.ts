/**
 * THE GRAPH BACKEND — locals, rays and boundaries as INDICES, in flat arrays.
 *
 * WHAT CHANGED AND WHY. A first version stored the graph as objects in Maps: each ref
 * to its parent, each to a Set of its children, each boundary to its partner. It was
 * the shortest way to say what a rewrite is, and at the size a published number is
 * measured at — a 41³ box is three million refs — it is millions of Map entries and
 * millions of objects each carrying ten decorated fields. Measured, a worker ran out
 * of memory and took a quarter of the suite with it.
 *
 * NOTHING IS AN OBJECT HERE. A ref is an index, and typed arrays say everything about
 * it: who holds it, who it faces, whether it is alive. Containment is an INTRUSIVE
 * LIST — `head`, `next`, `prev` — so adding or removing a child is a few writes and
 * allocates nothing, where a Set was an allocation and a hash on every touch.
 *
 * AND THE OBJECTS ARE THE API, NOT THE STORAGE. A rule is handed a `Local`, a `Ray`, a
 * `Boundary`, exactly as before; those are flyweights — an index and a shared
 * prototype whose accessors read the columns. They hold no data, they are made once
 * per index and reused, and a theory that decorates a ray with a field gets a COLUMN
 * for it rather than a slot on every ray in the world.
 *
 * SPACE STILL CHANGES SIZE, which is the whole reason this backend exists: `create`
 * takes from a free list, `delete` gives back to it, and a fold genuinely removes a
 * point. That is what a fixed grid cannot do and what `conform` measures the cost of.
 */
import { Backend, Sample, Stats } from "../lib/Backend.ts";
import { Boundary, Local, Ray, Ref, Ref2 } from "../lib/Local.ts";
import { Op, Rewrite } from "../lib/Rewrite.ts";
import { Carried, Carrying, Theory } from "../lib/Theory.ts";

const mulberry32 = (seed: number) => () => {
  seed = (seed + 0x6D2B79F5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const NONE = -1;

type Kind = "Local" | "Ray" | "Boundary";
/** hoisted: this is walked on every ref made, and a fresh literal there is millions of them */
const KINDS: Kind[] = ["Local", "Ray", "Boundary"];
/** what holds what: a boundary is on a ray, a ray is at a local */
const HOLDER: Record<Kind, Kind | undefined> = {
  Local: undefined, Ray: "Local", Boundary: "Ray",
};
const HELD: Record<Kind, Kind | undefined> = {
  Local: "Ray", Ray: "Boundary", Boundary: undefined,
};

/** what a decorated field is stored as, decided by the value its decoration defaults to */
type Column =
  | { kind: "bool"; a: Uint8Array }
  | { kind: "num"; a: Float64Array }
  | { kind: "any"; a: unknown[] };

/**
 * WHERE A COLUMN KEEPS `undefined`.
 *
 * `polarity` is −1, 1 or absent, and absent is a real state: a ray carrying no sign is
 * not a ray carrying nought. NaN is the only number that is not one, so it is what
 * absence is stored as, and it survives the round trip in both directions.
 */
const ABSENT = NaN;

/**
 * A CARRIED QUANTITY, BOUND TO THE COLUMN IT LIVES IN.
 *
 * A rule reaches a decoration by name — `r.polarity` — and that is right for a rule
 * somebody writes. It is wrong for the two rules that move EVERY quantity of EVERY ray
 * every tick, because the name is then a VARIABLE: `r[c.name]` is a keyed load that
 * cannot be specialised, and iterating the list with `for…of` allocates an iterator per
 * ray. Measured on a 21³ box that pair was 68 of ARRIVAL's 72 ms a tick, against 4 ms
 * for the walk that visits the rays and 5 ms for the same six writes spelled out.
 *
 * So the store hands the rules a reader and a writer per quantity, closed over the
 * column. The vocabulary is unchanged; what changes is that MOVEMENT and ARRIVAL no
 * longer look anything up by name.
 */
const reader = (c: Column) =>
  c.kind === "bool" ? (r: any) => (c.a as Uint8Array)[r.i] === 1
    : c.kind === "num" ? (r: any) => {
      const x = (c.a as Float64Array)[r.i];
      return Number.isNaN(x) ? undefined : x;
    }
      : (r: any) => (c.a as unknown[])[r.i];

const writer = (c: Column) =>
  c.kind === "bool" ? (r: any, v: unknown) => { (c.a as Uint8Array)[r.i] = v ? 1 : 0; }
    : c.kind === "num" ? (r: any, v: unknown) => {
      (c.a as Float64Array)[r.i] = typeof v === "number" ? v : ABSENT;
    }
      : (r: any, v: unknown) => { (c.a as unknown[])[r.i] = v; };

const columnFor = (sample: unknown, cap: number): Column =>
  typeof sample === "boolean" ? { kind: "bool", a: new Uint8Array(cap) }
    : typeof sample === "number" || sample === undefined
      ? { kind: "num", a: new Float64Array(cap).fill(ABSENT) }
      : { kind: "any", a: new Array(cap) };

/**
 * ONE POOL OF ONE KIND OF REF. It grows by doubling and reuses what has been freed, so
 * a world that makes and destroys space in equal measure stops allocating entirely.
 */
class Pool {
  n = 0;
  cap: number;
  alive: Uint8Array;
  parent: Int32Array;
  /**
   * THE HEAD OF EACH LIST OF CHILDREN THIS REF HOLDS — ONE PER KIND OF CHILD.
   *
   * Indexed by the PARENT, so it lives on the parent's pool and is sized to it. Kept
   * on the child's pool instead it is indexed by numbers from another pool entirely,
   * and at a 9³ box there are more rays than the boundary pool had rows: the write
   * went past the end of a typed array, vanished, and a ray came back with one end.
   *
   * AND ONE PER KIND, because a local holds two different things. Its rays are its
   * ways out; the locals inside it are the points FOLDED into it, which is what
   * annihilation leaves behind. Sharing one head between them makes each list
   * silently eat the other — a ray stopped belonging to the point holding it the
   * first time anything folded.
   */
  head: Record<Kind, Int32Array>;
  /**
   * AND THE TAIL, SO A LIST IS WALKED IN THE ORDER IT WAS BUILT.
   *
   * Pushing at the head is one write fewer and gives the list back newest-first, which
   * is the wrong order: a ray's ends are `boundaries[0]` leaving and `boundaries[1]`
   * facing back, and the geometry seeds them in that order. Reversing on the way out
   * means building an array to reverse — which is the allocation this exists to avoid.
   * Appending at the tail costs one more write once and makes every read free.
   */
  tail: Record<Kind, Int32Array>;
  next: Int32Array;
  prev: Int32Array;
  target: Int32Array;
  free: number[] = [];
  cols = new Map<string, Column>();

  constructor(cap = 4096) {
    this.cap = cap;
    this.alive = new Uint8Array(cap);
    this.parent = new Int32Array(cap).fill(NONE);
    const heads = () => ({
      Local: new Int32Array(cap).fill(NONE),
      Ray: new Int32Array(cap).fill(NONE),
      Boundary: new Int32Array(cap).fill(NONE),
    });
    this.head = heads();
    this.tail = heads();
    this.next = new Int32Array(cap).fill(NONE);
    this.prev = new Int32Array(cap).fill(NONE);
    this.target = new Int32Array(cap).fill(NONE);
  }

  grow(to = this.cap * 2) {
    const bump = (a: Int32Array) => { const b = new Int32Array(to).fill(NONE); b.set(a); return b; };
    const kept = this.alive; this.alive = new Uint8Array(to); this.alive.set(kept);
    this.parent = bump(this.parent);
    for (const k of KINDS) { this.head[k] = bump(this.head[k]); this.tail[k] = bump(this.tail[k]); }
    this.next = bump(this.next);
    this.prev = bump(this.prev);
    this.target = bump(this.target);
    for (const [, c] of this.cols) {
      if (c.kind === "bool") { const b = new Uint8Array(to); b.set(c.a); c.a = b; }
      else if (c.kind === "num") { const b = new Float64Array(to).fill(ABSENT); b.set(c.a); c.a = b; }
      else c.a.length = to;
    }
    this.cap = to;
  }

  take(defaults: Map<string, unknown>) {
    const i = this.free.length ? this.free.pop()! : this.n++;
    if (i >= this.cap) this.grow(Math.max(this.cap * 2, i + 1));
    this.alive[i] = 1;
    this.parent[i] = NONE;
    this.head.Local[i] = NONE; this.head.Ray[i] = NONE; this.head.Boundary[i] = NONE;
    this.tail.Local[i] = NONE; this.tail.Ray[i] = NONE; this.tail.Boundary[i] = NONE;
    this.next[i] = NONE; this.prev[i] = NONE; this.target[i] = NONE;
    for (const [k, c] of this.cols) this.write(c, i, defaults.get(k));
    return i;
  }

  release(i: number) { this.alive[i] = 0; this.free.push(i); }

  read(c: Column, i: number) {
    if (c.kind === "bool") return c.a[i] === 1;
    if (c.kind === "num") { const x = c.a[i]; return Number.isNaN(x) ? undefined : x; }
    return c.a[i];
  }

  write(c: Column, i: number, v: unknown) {
    if (c.kind === "bool") c.a[i] = v ? 1 : 0;
    else if (c.kind === "num") c.a[i] = typeof v === "number" ? v : ABSENT;
    else c.a[i] = v;
  }
}

export class Graph implements Backend {
  rng: () => number;
  stats: Stats = { annihilations: 0, folded: 0, created: 0, deflections: 0, blocked: 0 };
  /**
   * WHAT THE RAYS OF THIS WORLD CARRY, held where a rule can reach it in one hop.
   *
   * It is the theory's list and belongs to the theory; a rule is handed a REF, and
   * `r.l.world.theory.carrying` is four accessor hops to fetch a constant, per ray, per
   * tick. The store already belongs to exactly one world, so it can hold the answer.
   */
  carrying: Carrying[] = [];
  world: any;
  rewrite: Rewrite = new Rewrite(this);

  private pool: Record<Kind, Pool> = {
    Local: new Pool(), Ray: new Pool(), Boundary: new Pool(),
  };
  private defaults: Record<Kind, Map<string, unknown>> = {
    Local: new Map(), Ray: new Map(), Boundary: new Map(),
  };
  private proto: Record<Kind, any> = { Local: null, Ray: null, Boundary: null };
  private fly: Record<Kind, (Ref2 | undefined)[]> = { Local: [], Ray: [], Boundary: [] };
  /** every local that exists, folded away or not — what the store is HOLDING */
  private live = new Set<number>();
  /**
   * AND THE ONES THAT ARE POINTS: every local not folded into another.
   *
   * These used to be the same set with a filter over it, and a counter beside it. That
   * is fine while nothing folds and wrong the moment something does: a fold CONTAINS the
   * point rather than deleting it — reversibly, which is what `unfold` gives back — so
   * `live` keeps growing while the count does not, and every rule pass walks all of it
   * to yield a few. Measured on an expanding world it was most of a quick run.
   */
  private loose = new Set<number>();

  constructor(
    public theory: Theory<any, any, any, any, any, any>,
    seed = 0,
    public bound = Infinity,
    public DEG = 0,
    public grows = true,
    public folds = true,
    public removes = true,
    public expands = false,
  ) {
    this.rng = mulberry32(seed);
    this.build();
    const rays = this.pool.Ray;
    this.carrying = (((theory as any).carrying ?? []) as Carried[]).map(c => {
      const here = rays.cols.get(c.name), waiting = rays.cols.get(c.waiting);
      if (!here || !waiting) throw new Error(
        `${c.name} is carried but has no column — a decoration that declares nothing has ` +
        `none, and a quantity that travels cannot live on the flyweight.`);
      return {
        ...c,
        read: reader(here), write: writer(here),
        readWaiting: reader(waiting), writeWaiting: writer(waiting),
      };
    });
  }

  /**
   * THE SCHEMA COMES FROM THE DECORATIONS THEMSELVES.
   *
   * One of each ref is built the ordinary way and asked what it carries, so a theory
   * that adds a field gets a column for it without this file knowing the field exists.
   * The prototypes are then given accessors onto those columns — which is the whole
   * trick: what a rule sees is unchanged, and what it costs is not.
   */
  private build() {
    for (const kind of KINDS) {
      const sample: any = (this.theory as any)[kind](this);
      const pool = this.pool[kind];
      const proto = this.protoFor(kind);
      for (const k of Object.keys(sample)) {
        /*
         * ONLY WHAT A DECORATION ADDS GETS A COLUMN.
         *
         * The sample carries the vocabulary's own members too — `rays`, `l`, `target`,
         * `DEG` — and those are STRUCTURE: they are answered from the index arrays and
         * the prototype already defines them. Giving them a column overwrites the
         * accessor that makes the flyweight work at all, and the world comes back with
         * every local holding nothing.
         */
        if (k === "backend" || Object.getOwnPropertyDescriptor(proto, k)) continue;
        let v: unknown;
        try { v = sample[k]; } catch { v = undefined; }
        if (typeof v === "function") continue;
        const c = columnFor(v, pool.cap);
        pool.cols.set(k, c);
        this.defaults[kind].set(k, v);
        /*
         * THE ACCESSOR KNOWS WHICH KIND OF COLUMN IT IS ON, and is written once knowing it.
         *
         * It used to be one accessor calling `pool.read(c, i)`, which asks what kind of
         * column this is on every read of every field of every ref — two calls and a
         * branch to fetch one number. The kind is fixed when the column is made, and every
         * rule in the book reads fields far more often than it does anything else.
         */
        Object.defineProperty(proto, k, {
          get: c.kind === "bool" ? function (this: any) { return (c.a as Uint8Array)[this.i] === 1; }
            : c.kind === "num" ? function (this: any) {
              const x = (c.a as Float64Array)[this.i];
              return Number.isNaN(x) ? undefined : x;
            }
              : function (this: any) { return (c.a as unknown[])[this.i]; },
          set: c.kind === "bool" ? function (this: any, x: unknown) { (c.a as Uint8Array)[this.i] = x ? 1 : 0; }
            : c.kind === "num" ? function (this: any, x: unknown) {
              (c.a as Float64Array)[this.i] = typeof x === "number" ? x : ABSENT;
            }
              : function (this: any, x: unknown) { (c.a as unknown[])[this.i] = x; },
          enumerable: true, configurable: true,
        });
      }
      this.proto[kind] = proto;
    }
  }

  private protoFor(kind: Kind): any {
    const b = this;
    /*
     * THE ACCESSORS ARE DEFINED RATHER THAN WRITTEN OUT.
     *
     * A getter in an object literal cannot say what `this` is, and every one of these
     * needs to — the whole point of a flyweight is that the object IS its index. So
     * the prototype is built with `defineProperty`, and each accessor closes over the
     * one function that turns an index into an answer.
     */
    const proto: any = { kind };
    const get = (name: string, f: (i: number) => unknown) =>
      Object.defineProperty(proto, name, {
        get(this: any) { return f(this.i); }, enumerable: true, configurable: true,
      });
    const call = (name: string, f: (i: number, ...a: any[]) => unknown) =>
      Object.defineProperty(proto, name, {
        value(this: any, ...a: any[]) { return f(this.i, ...a); },
        enumerable: true, configurable: true, writable: true,
      });

    Object.defineProperty(proto, "backend",
      { get: () => b, enumerable: true, configurable: true });

    if (kind === "Local") {
      Object.defineProperty(proto, "world",
        { get: () => b.world, enumerable: true, configurable: true });
      get("rays", i => b.kidsOf("Ray", i) as Ray[]);
      /* ways out that lead somewhere — an end facing nothing is not a way out */
      get("DEG", i => {
        const B = b.pool.Boundary, R = b.pool.Ray, L = b.pool.Local;
        let n = 0;
        for (let r = L.head.Ray[i]; r !== NONE; r = R.next[r])
          for (let x = R.head.Boundary[r]; x !== NONE; x = B.next[x])
            if (B.target[x] !== NONE) n++;
        return n;
      });
      call("create", i => b.rewrite.ray(b.ref("Local", i) as Local));
      call("fold", (i, other: Local) => b.rewrite.fold(b.ref("Local", i) as Local, other));
      call("unfold", i => b.rewrite.unfold(b.ref("Local", i) as Local));
      return proto;
    }

    if (kind === "Ray") {
      get("l", i => {
        const p = b.pool.Ray.parent[i];
        return p === NONE ? undefined : b.ref("Local", p);
      });
      get("boundaries", i => b.kidsOf("Boundary", i) as Boundary[]);
      call("delete", i => b.rewrite.delete(b.ref("Ray", i) as Ray));
      return proto;
    }

    get("source", i => {
      const p = b.pool.Boundary.parent[i];
      return p === NONE ? undefined : b.ref("Ray", p);
    });
    get("target", i => {
      const t = b.pool.Boundary.target[i];
      return t === NONE || !b.pool.Boundary.alive[t] ? undefined : b.ref("Boundary", t);
    });
    call("link", (i, to: Boundary) => b.rewrite.link(b.ref("Boundary", i) as Boundary, to));
    call("insert", i => b.rewrite.insert(b.ref("Boundary", i) as Boundary));
    call("collapse", i => b.rewrite.collapse(b.ref("Boundary", i) as Boundary));
    return proto;
  }

  /** the flyweight for an index — made once, reused, and carrying nothing but the index */
  private ref(kind: Kind, i: number): Ref2 {
    const cache = this.fly[kind];
    let r = cache[i];
    if (!r) {
      const o = Object.create(this.proto[kind]);
      o.i = i;
      cache[i] = r = o;
    }
    return r;
  }

  /**
   * A REF'S CHILDREN, OLDEST FIRST.
   *
   * The list is built by pushing at the head, so walking it gives the newest first —
   * and the order is not cosmetic here: a ray's two ends are `boundaries[0]` leaving
   * and `boundaries[1]` facing back, and the geometry seeds them in that order.
   */
  /**
   * A REF'S CHILDREN, WALKED WITHOUT BEING LISTED.
   *
   * `kidsOf` builds an array, and the rules ask for one per local and one per ray on
   * every pass of every rule — at 121² that is a hundred thousand throwaway arrays a
   * tick, which is most of what a tick costs. This walks the same list in the same
   * order and allocates nothing, so the answer is identical and the garbage is not.
   */
  /**
   * THE n-th CHILD, WITHOUT BUILDING THE LIST.
   *
   * A ray has two ends and the vocabulary asks for them constantly — `outward`,
   * `inward` and `opposite` each reach for `r.boundaries`, which builds an array of
   * two to look at one. That is a quarter of a million arrays a sweep for a question
   * that is two pointer hops.
   */
  nth(child: Kind, parent: Ref2, n: number): any {
    const pool = this.pool[child];
    const holder = this.pool[HOLDER[child]!];
    let k = holder.head[child][(parent as any).i];
    for (let i = 0; i < n && k !== NONE; i++) k = pool.next[k];
    return k === NONE ? undefined : this.ref(child, k);
  }

  /** the same walk as `each`, handed to a callback — no generator frame per child */
  /**
   * DOES ANY CHILD ANSWER — with the walk stopping at the one that does.
   *
   * (G/2) asks "is anything on this point" of every point every tick, and `l.rays.some(…)`
   * answers it by BUILDING the list first: a twelve-element array and twelve flyweights
   * per point per tick, thrown away, to look at one of them. The list is the vocabulary
   * and it is the right shape for a rule that reads it; it is the wrong shape for a
   * question with an early exit.
   */
  some(child: Kind, parent: Ref2, f: (x: any) => boolean): boolean {
    const pool = this.pool[child];
    const holder = this.pool[HOLDER[child]!];
    for (let k = holder.head[child][(parent as any).i]; k !== NONE; k = pool.next[k])
      if (f(this.ref(child, k))) return true;
    return false;
  }

  /** the first child of a kind, without building the list to take its head off */
  first(child: Kind, parent: Ref2): any {
    const holder = this.pool[HOLDER[child] ?? child];
    const k = holder.head[child][(parent as any).i];
    return k === NONE ? undefined : this.ref(child, k);
  }

  /**
   * EVERY FACING PAIR, VISITED ONCE, WITHOUT MATERIALISING WHAT IS NOT VISITED.
   *
   * A meeting is one event and the rule is quantified over pairs, so the walk has to
   * reach every boundary to find them — but only a pair that is actually resolved needs
   * to become an object. Reading the partner through `x.target` makes one for every
   * boundary in the world and then throws away the half that lose the `x.i < t.i` tie,
   * which is a quarter of a million flyweights a tick on a 21³ box.
   */
  facing(f: (a: any, b: any) => void, where?: string) {
    const B = this.pool.Boundary, R = this.pool.Ray, L = this.pool.Local;
    /* what the rule says a pair has to have on it — read straight off the column, and
     * read AT the pair rather than held: a rule that inserts a point grows the pools, and
     * a hoisted column array is the one that was there before it did */
    const gate = where ? R.cols.get(where) : undefined;
    if (where && !gate) throw new Error(`a ray here has no ${where} for a rule to be about`);
    for (const l of this.loose)
      for (let r = L.head.Ray[l]; r !== NONE; r = R.next[r])
        for (let x = R.head.Boundary[r]; x !== NONE; x = B.next[x]) {
          const t = B.target[x];
          if (t === NONE || t < x || !B.alive[t]) continue;
          /*
           * AND THE PAIRING INSIDE A POINT IS NOT A MEETING. Half of every ray's ends are
           * the INWARD ones, linked to their opposite's inward end — that is what makes an
           * exit and its opposite one axis, and it is structure rather than an event. Every
           * rule quantified over facing pairs threw those away with `x.l === y.l` after
           * paying for two flyweights and two walks up the containment to find out.
           */
          const there = B.parent[t];
          if (there === NONE || R.parent[there] === l) continue;
          if (gate) { const on = gate.a as any; if (!on[r] || !on[there]) continue; }
          f(this.ref("Boundary", x), this.ref("Boundary", t));
        }
  }

  /**
   * WHERE A RAY GOES WHEN IT STEPS — the far end of the exit it leaves by, on the same
   * exit, which is what streaming means.
   *
   * Spelled out through the vocabulary it is `opposite(outward(r)?.target?.source)`, and
   * every hop of that makes a flyweight: two ends of this ray, the end it faces, the ray
   * that end belongs to, the point that ray is at, and then the same again coming back.
   * Ten objects per moving ray per tick to answer a question the index arrays answer in
   * six reads. The ANSWER is identical — this is the same walk, not a shortcut past it.
   */
  across(r: Ref2, bounced: boolean): any {
    const i = this.acrossOf((r as any).i, bounced);
    return i === NONE ? undefined : this.ref("Ray", i);
  }

  /** the end of this ray that faces BACK into its own point, as an index */
  private inwardOf(ray: number): number {
    const B = this.pool.Boundary, R = this.pool.Ray;
    const mine = R.parent[ray];
    for (let x = R.head.Boundary[ray]; x !== NONE; x = B.next[x]) {
      const t = B.target[x];
      if (t === NONE) continue;
      const there = B.parent[t];
      if (there !== NONE && R.parent[there] === mine) return x;
    }
    return NONE;
  }

  /** the end of this ray that leads to another point, as an index */
  private outwardOf(ray: number): number {
    const B = this.pool.Boundary, R = this.pool.Ray;
    const mine = R.parent[ray];
    for (let x = R.head.Boundary[ray]; x !== NONE; x = B.next[x]) {
      const t = B.target[x];
      if (t === NONE) continue;
      const there = B.parent[t];
      if (there !== NONE && R.parent[there] !== mine) return x;
    }
    return NONE;
  }

  /**
   * TWO COLUMNS EXCHANGED, AND ONE PUT BACK TO WHAT IT IS WITHOUT A VALUE.
   *
   * ARRIVAL says the same thing about every ray in the world — what was ARRIVING is now
   * what is HERE, and nothing is arriving any more. Said one ray at a time that is a
   * hundred and eleven thousand visits and six writes each, to move a column onto a
   * column. Said as the columns it is, it is a pointer swap and a fill.
   *
   * IT IS THE SAME STATEMENT, not a shortcut past it: the rule still declares what
   * happens, and the store is asked to do it in the shape it actually holds. This is the
   * article's own double buffer — "swapped, not copied" — arrived at from the other end.
   */
  swap(kind: Kind, a: string, b: string) {
    const cols = this.pool[kind].cols;
    const x = cols.get(a), y = cols.get(b);
    if (!x || !y) throw new Error(`${kind} has no column ${x ? b : a} to exchange`);
    if (x.kind !== y.kind) throw new Error(
      `${a} is a ${x.kind} column and ${b} is a ${y.kind} one, so exchanging them would ` +
      `change what each of them means`);
    const t = x.a; (x as any).a = y.a; (y as any).a = t;
  }

  /** a column back to what a freshly made ref has in it */
  reset(kind: Kind, name: string) {
    const c = this.pool[kind].cols.get(name);
    if (!c) throw new Error(`${kind} has no column ${name} to clear`);
    const v = this.defaults[kind].get(name);
    if (c.kind === "bool") (c.a as Uint8Array).fill(v ? 1 : 0);
    else if (c.kind === "num") (c.a as Float64Array).fill(typeof v === "number" ? v : ABSENT);
    else (c.a as unknown[]).fill(v);
  }

  /**
   * EVERY RAY THAT IS THERE, ONE STEP ALONG ITS OWN EXIT, CARRYING WHAT IT CARRIES.
   *
   * The rule says WHICH quantities go — the gate, the one that says it is going backwards,
   * and the pairs of "where it lives here" and "where it waits over there". The store says
   * HOW, because where a ray goes is the store's own topology and moving a column along
   * that is a walk of index arrays rather than a hundred thousand objects and six accessor
   * calls each.
   *
   * A RAY WITH NOWHERE TO GO IS HANDED BACK, not dropped: on a bounded world it is the end
   * of it and on an expanding one it is where the world gets bigger, and neither of those
   * is the store's business. They are collected and handed over AFTER the pass, because
   * making room is a rewrite and a rewrite that reallocates a column underneath a loop
   * reading it is a bug this shape invites.
   */
  step(gate: string, back: string, moving: [string, string][], off: (r: any) => void) {
    const R = this.pool.Ray, L = this.pool.Local, cols = R.cols;
    const g = cols.get(gate), bk = cols.get(back);
    if (!g || !bk) throw new Error(`a ray here has no ${g ? back : gate} to step by`);
    const from: Column[] = [], to: Column[] = [];
    for (const [a, b] of moving) {
      const x = cols.get(a), y = cols.get(b);
      if (!x || !y) throw new Error(`a ray here has no ${x ? b : a} to carry`);
      from.push(x); to.push(y);
    }
    const n = from.length;
    const stranded: number[] = [];
    for (const l of this.loose)
      for (let r = L.head.Ray[l]; r !== NONE; r = R.next[r]) {
        if (!(g.a as Uint8Array)[r]) continue;
        const j = this.acrossOf(r, (bk.a as Uint8Array)[r] === 1);
        if (j === NONE) { stranded.push(r); continue; }
        for (let i = 0; i < n; i++) (to[i].a as any)[j] = (from[i].a as any)[r];
      }
    for (const r of stranded) off(this.ref("Ray", r));
  }

  /** where a ray goes when it steps, as an index — see `across` */
  private acrossOf(ray: number, bounced: boolean): number {
    const B = this.pool.Boundary;
    let i = ray;
    if (bounced) {
      const back = this.inwardOf(i);
      if (back === NONE) return NONE;
      const t = B.target[back];
      if (t === NONE) return NONE;
      i = B.parent[t];
      if (i === NONE) return NONE;
    }
    const out = this.outwardOf(i);
    if (out === NONE) return NONE;
    const t = B.target[out];
    if (t === NONE) return NONE;
    const there = B.parent[t];
    if (there === NONE) return NONE;
    const home = this.inwardOf(there);
    if (home === NONE) return NONE;
    const u = B.target[home];
    if (u === NONE) return NONE;
    return B.parent[u];
  }

  walk(child: Kind, parent: Ref2, f: (x: any) => void) {
    const pool = this.pool[child];
    const holder = this.pool[HOLDER[child]!];
    for (let k = holder.head[child][(parent as any).i]; k !== NONE; k = pool.next[k])
      f(this.ref(child, k));
  }

  *each(child: Kind, parent: Ref2): Generator<Ref2> {
    const pool = this.pool[child];
    const holder = this.pool[HOLDER[child]!];
    /* oldest first, as `kidsOf` gives it: the list is pushed at the head, so it is
     * walked into a stack and read back out */
    for (let k = holder.head[child][(parent as any).i]; k !== NONE; k = pool.next[k])
      yield this.ref(child, k);
  }

  private kidsOf(child: Kind, i: number): Ref2[] {
    const pool = this.pool[child];
    const holder = this.pool[HOLDER[child]!];
    const out: Ref2[] = [];
    for (let k = holder.head[child][i]; k !== NONE; k = pool.next[k]) out.push(this.ref(child, k));
    return out;
  }

  // ─── the four primitives, as index writes ─────────────────────────────────

  create(of: Ref): Ref2 {
    const kind = of as Kind;
    const i = this.pool[kind].take(this.defaults[kind]);
    if (kind === "Local") { this.live.add(i); this.loose.add(i); }
    return this.ref(kind, i);
  }

  private detach(kind: Kind, i: number) {
    const pool = this.pool[kind];
    const p = pool.parent[i];
    if (p === NONE) return;
    /* a local held by another local is a FOLD, and the list it is in is the holder's
     * own kind — so where a ref has no holder above it, it is held by one of its own */
    const holder = this.pool[HOLDER[kind] ?? kind];
    const prev = pool.prev[i], next = pool.next[i];
    if (prev !== NONE) pool.next[prev] = next; else holder.head[kind][p] = next;
    if (next !== NONE) pool.prev[next] = prev; else holder.tail[kind][p] = prev;
    pool.parent[i] = NONE; pool.prev[i] = NONE; pool.next[i] = NONE;
  }

  apply(op: Op): void {
    switch (op.op) {
      case "contain": {
        const kind = (op.child as any).kind as Kind, i = (op.child as any).i;
        const pool = this.pool[kind];
        if (!pool.alive[i]) return;
        this.detach(kind, i);
        if (kind === "Local") {
          /* folded into another it is not a point; handed back it is one again */
          if (op.parent) this.loose.delete(i); else this.loose.add(i);
        }
        if (!op.parent) return;
        const pk = (op.parent as any).kind as Kind, p = (op.parent as any).i;
        const holder = this.pool[pk];
        if (!holder.alive[p]) return;
        /* appended, so the list reads back in the order it was built */
        const t = holder.tail[kind][p];
        pool.prev[i] = t;
        pool.next[i] = NONE;
        if (t !== NONE) pool.next[t] = i; else holder.head[kind][p] = i;
        holder.tail[kind][p] = i;
        pool.parent[i] = p;
        return;
      }
      case "link": {
        const pool = this.pool.Boundary;
        const a = (op.a as any).i;
        if (!pool.alive[a]) return;
        /* a link is symmetric, so whatever either end faced is let go of first */
        const b = op.b ? (op.b as any).i : NONE;
        for (const end of [a, b]) {
          if (end === NONE) continue;
          const was = pool.target[end];
          if (was !== NONE) pool.target[was] = NONE;
          pool.target[end] = NONE;
        }
        if (b === NONE || !pool.alive[b]) return;
        pool.target[a] = b; pool.target[b] = a;
        return;
      }
      case "delete": {
        const kind = (op.ref as any).kind as Kind, i = (op.ref as any).i;
        const pool = this.pool[kind];
        if (!pool.alive[i]) return;
        /* what it contains goes with it — an end still linked to a deleted ray is a
         * partner facing nothing, which crashed a run before this was true */
        const below = HELD[kind];
        if (below) {
          const kids = this.pool[below];
          for (let k = pool.head[below][i]; k !== NONE;) {
            const nxt = kids.next[k];
            this.apply({ op: "delete", ref: this.ref(below, k) as any });
            k = nxt;
          }
        }
        if (kind === "Boundary") this.apply({ op: "link", a: op.ref as any });
        this.detach(kind, i);
        pool.release(i);
        if (kind === "Local") { this.live.delete(i); this.loose.delete(i); }
        return;
      }
    }
  }

  parent(ref: Ref2): Ref2 | undefined {
    const kind = (ref as any).kind as Kind;
    const holder = HOLDER[kind];
    if (!holder) return undefined;
    const p = this.pool[kind].parent[(ref as any).i];
    return p === NONE ? undefined : this.ref(holder, p);
  }

  children(ref: Ref2): Ref2[] {
    const held = HELD[(ref as any).kind as Kind];
    return held ? this.kidsOf(held, (ref as any).i) : [];
  }

  target(b: Boundary): Boundary | undefined {
    const t = this.pool.Boundary.target[(b as any).i];
    return t === NONE ? undefined : this.ref("Boundary", t) as Boundary;
  }

  // ─── the world, as the rules see it ───────────────────────────────────────

  *[Symbol.iterator](): Iterator<Local> {
    for (const i of this.loose) yield this.ref("Local", i) as Local;
  }

  /** how many POINTS there are — every local not folded into another */
  size() { return this.loose.size; }

  /** whether this local is still a point of the world, rather than gone or folded away */
  holds(l: Local): boolean {
    const i = (l as any).i;
    return this.pool.Local.alive[i] === 1 && this.loose.has(i);
  }

  /**
   * AND HOW MANY LOCALS THE STORE IS HOLDING, which is a different number and the one a
   * bound has to be against.
   *
   * A fold does not free anything: the point is contained, reversibly, and can be handed
   * back. So `size` falls while the store keeps growing, and a cap written against
   * `size` never fires — measured, an expanding box on a bound of 3,375 points ran to a
   * gigabyte because every inserted point folded away still cost what it costs.
   */
  stored() { return this.live.size; }

  /**
   * WHERE THE POINTS ARE, IN HOPS — the only embedding a graph honestly has.
   *
   * A lattice laid down by a geometry has coordinates and the flat reading uses them;
   * a graph that has been rewritten does not. What it can say is how far a point is
   * from another along the connections that actually exist.
   */
  sample(accuracy = Infinity, from?: Local): Sample[] {
    const first = from ?? [...this][0];
    if (!first) return [];
    const B = this.pool.Boundary, R = this.pool.Ray;
    const start = (first as any).i;
    const out: Sample[] = [{ local: first, at: [0] }];
    const seen = new Set<number>([start]);
    let edge = [start];
    for (let hops = 1; edge.length && hops <= accuracy; hops++) {
      const next: number[] = [];
      for (const l of edge)
        for (let r = this.pool.Local.head.Ray[l]; r !== NONE; r = R.next[r])
          for (let x = R.head.Boundary[r]; x !== NONE; x = B.next[x]) {
            const t = B.target[x];
            if (t === NONE) continue;
            const ray = B.parent[t];
            if (ray === NONE) continue;
            const there = R.parent[ray];
            if (there === NONE || seen.has(there)) continue;
            seen.add(there); next.push(there);
            out.push({ local: this.ref("Local", there) as Local, at: [hops] });
          }
      edge = next;
    }
    return out;
  }
}
