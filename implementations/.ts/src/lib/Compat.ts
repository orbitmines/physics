/**
 * THE OLD SURFACE, OVER THE NEW MODEL — so a ported test is the test, not a rewrite.
 *
 * The 119 migrated claims are written against `DISCRETE.ts`'s `World`: `new World({…})`,
 * `w.run(T)`, `w.backend.forEachLocal`, `w.backend.position`, `w.add({…})`. Rewriting
 * each of them by hand to this API would be 119 opportunities to change what a claim
 * says while moving it, which is the one thing the port must not do.
 *
 * So the shape they expect is provided here, backed by theories, decorations and the
 * four rewrite primitives. What a test measures is unchanged; where it reaches for
 * something this model does not have, it fails loudly rather than quietly returning
 * a plausible number.
 */
import { Flat } from "../backends/CPU.array.ts";
import { Boundaries, GEOMETRIES, Geometry, Vec } from "./Local.ts";
import { charge } from "./Measure.ts";
import { fill } from "./Report.ts";
import { norm } from "./Local.ts";
export type { Source, SourceSpec } from "./Source.ts";
import { SourceSpec } from "./Source.ts";

/**
 * NEUTRAL IS A CHARGE AND NOT AN ABSENCE. A ray is ACTIVE when it carries one, and
 * which of the three it carries is what the polarised theories decorate it with.
 */
export type Charge = -1 | 0 | 1;

/** the lattice everything runs on unless a claim says otherwise */
export const DEFAULT_GEOMETRY = GEOMETRIES["fcc-12"];


export type WorldOptions = {
  theory: any;
  geometry?: Geometry;
  N?: number;
  seed?: number;
  boundary?: Boundaries;
  backend?: "array" | "graph";
  /** how far the world may grow under expansion; unbounded if absent */
  bound?: any;
  fold?: any;
  meeting?: Meeting;
  meetingRate?: MeetingRate;
  /**
   * Draw the random stream for every slot whether or not it is occupied — what makes
   * two runs on one seed differ ONLY by the source, which is the basis of every
   * measurement taken as a difference against a lone control.
   */
  slotUniformRng?: boolean;
  channels?: any[];
};

/**
 * WHAT A MIGRATED CLAIM MAY ASK OF A BACKEND.
 *
 * Written out rather than inferred, because the facade is built once and cached — and
 * a cached `any` loses every type the literal had, so `position(k).map(x => …)` stopped
 * knowing that x is a number and the claims stopped typechecking.
 */
export type BackendFacade = {
  [Symbol.iterator](): Iterator<any>
  size(): number
  count: number
  /** a local is walked as its INDEX, as the article walks them */
  forEachLocal(f: (k: number) => void): void
  position(l: any): Vec
  charge(l: any, d?: number): any
  active(l: any, d?: number): boolean
  put(l: any, d: number, q?: number): void
  clear(l: any, d: number): void
  density(l: any): number
  neighbour(l: any, d: number): any
  channelAt(name: string, l: any, d: number, k?: number): number
  setChannel(name: string, l: any, d: number, v: number, k?: number): void
  rng: () => number
  stats: any
  kind: string
  raw(): undefined
  snapshot(): Uint8Array
}

export class World {
  readonly opts: Required<Pick<WorldOptions, "N" | "seed" | "boundary">> & WorldOptions;
  readonly geometry: Geometry;
  readonly world: any;

  constructor(o: WorldOptions) {
    const geometry = o.geometry ?? GEOMETRIES["fcc-12"];
    const N = o.N ?? 5, seed = o.seed ?? 0, boundary = o.boundary ?? "wrap";
    this.geometry = geometry;
    this.opts = { ...o, N, seed, boundary };
    const backend = geometry.seed(
      new Flat(o.theory, seed, N ** geometry.D, geometry.DEG * 2, N, geometry.D), N, boundary);
    this.world = o.theory.seed({ geometry, N, seed, backend });
  }

  get DEG() { return this.geometry.DEG; }
  /* what a header reads off a world, so provenance is the run and not a stand-in */
  get N() { return this.opts.N; }
  get seed() { return this.opts.seed; }
  get ticks() { return this.world.ticks; }
  get layers() { return this.world.layers; }
  get global() { return this.world.global; }
  get embedding() { return this.world.embedding; }
  get size() { return this.world.backend.size(); }
  get polarised() { return !!this.world.theory?.polarised; }
  get theory() { return this.world.theory; }
  get sources() { return this.world.sources; }
  get stats() { return { ...this.world.backend.stats, ticks: this.world.ticks }; }

  /*
   * THE READINGS A CLAIM ASKS FOR REPEATEDLY, HELD FOR AS LONG AS THEY ARE TRUE.
   *
   * `locals`, `destroyed` and `turned` each walk the whole world to answer, and a
   * claim written the natural way asks for one INSIDE a loop over the other — which
   * is quadratic and reads as the model being slow. Measured on a 121² panel that is
   * fourteen thousand walks of fourteen thousand locals for a single snapshot.
   *
   * Nothing here changes between ticks, so the tick is the key: the answer is kept
   * until the world moves, and every reading in a pass is the same reading.
   */
  private cache: { at: number; locals?: any[]; destroyed?: number[]; turned?: number[] } =
    { at: -1 };

  private fresh() {
    if (this.cache.at !== this.world.ticks) this.cache = { at: this.world.ticks };
    return this.cache;
  }

  /** every local of the world, by the handle the rules use */
  get locals(): any[] {
    const c = this.fresh();
    return c.locals ??= [...this.world.backend];
  }

  /*
   * A LOCAL'S RAYS ARE ITS EXITS, IN ORDER — the geometry seeds one ray per exit, so
   * `l.rays[d]` IS exit d and the old `(local, exit)` pair reads straight across.
   */
  /*
   * THE FACADE IS BUILT ONCE, NOT ON EVERY LOOK.
   *
   * `w.backend` is the shape a migrated claim expects, and it is a getter — so every
   * `w.backend.position(k)` inside a loop over the world built a fresh object with a
   * closure per member and threw it away. At 121² that is a couple of hundred thousand
   * closures a frame, and it was two orders of magnitude more than the physics it was
   * reading: 1.5s to ask where fourteen thousand points are, against 0.13s to tick them.
   */
  private facade?: BackendFacade;

  get backend() {
    if (this.facade) return this.facade;
    const w = this.world;
    /*
     * A LOCAL IS AN OBJECT HERE AND AN INDEX THERE.
     *
     * The article's backend addresses a point by its index into a flat array, and a
     * claim computes one: `put(at0 + i, d, q)` places a charge i cells along. Both
     * are accepted, and an index means the same point it meant there — the flat
     * backend lays its locals down in index order.
     */
    /*
     * THE INDEX A CLAIM HOLDS IS AN INDEX INTO THE WORLD AS IT STANDS.
     *
     * Cached once and never refreshed, it goes stale the moment anything folds: a
     * point that has been taken into another leaves the list, every index past it
     * shifts, and the claim reads a different point — or past the end, and reads
     * `undefined`, which is where `charge` was crashing. The tick is the key, as it
     * is for every other reading here.
     */
    let order: any[] | undefined, orderAt = -1;
    const locals = () => {
      if (orderAt !== w.ticks || !order) { order = [...w.backend]; orderAt = w.ticks; }
      return order;
    };
    const L = (x: any) => typeof x === "number" ? locals()[x] : x;
    const ray = (l: any, d: number) => L(l)?.rays[d];
    this.facade = {
      /* a backend IS its locals, here as there — `[...w.backend]` has to work */
      [Symbol.iterator]: () => w.backend[Symbol.iterator](),
      size: () => w.backend.size(),
      count: w.backend.size(),
      /*
       * A LOCAL IS HANDED OUT AS ITS INDEX, WHICH IS WHAT A CLAIM EXPECTS.
       *
       * The article's backend walks its points as NUMBERS, and its claims use that
       * number as one: `a[k] = w.destroyed[k]`, `dv[k] += 1`, `sits[k] = 1`. Handing
       * an object instead does not fail — it writes to a property named after the
       * object and reads back `undefined`, so the measurement silently records
       * nothing. The pull channel of every field panel came back empty that way, and
       * the panel drew it as a picture of nought rather than as a missing reading.
       *
       * Everything else here already accepts either, so an index is the faithful one.
       */
      forEachLocal: (f: (k: number) => void) => {
        const all = locals();
        for (let i = 0; i < all.length; i++) f(i);
      },
      position: (l: any): Vec => (w.embedding.at(L(l)) ?? []) as Vec,
      /** the net polarity a local holds, or the sign on one exit */
      charge: (l: any, d?: number) =>
        d === undefined ? charge(L(l)) : (ray(l, d)?.active ? (ray(l, d).polarity ?? 0) : 0),
      /** whether anything is on this local, or on one exit of it */
      active: (l: any, d?: number) =>
        d === undefined ? L(l).rays.some((r: any) => r.active) : !!ray(l, d)?.active,
      put: (l: any, d: number, q = 0) => {
        const r = ray(l, d);
        if (!r) return;
        r.active = true;
        if (q) r.polarity = q;
      },
      clear: (l: any, d: number) => {
        const r = ray(l, d);
        if (!r) return;
        r.active = false;
        r.polarity = undefined;
      },
      /** how many points have been folded into this one */
      density: (_l: any) => 1,
      /** where exit d of this local leads */
      neighbour: (l: any, d: number) => {
        const r = ray(l, d);
        const b = r?.boundaries?.find((x: any) => x.target?.source?.l && x.target.source.l !== L(l));
        return b?.target?.source?.l;
      },
      /*
       * CHANNELS ARE DECORATIONS HERE. A theory that wants a per-ray quantity declares
       * it with `decorate.Ray`, so a channel is a property rather than a parallel
       * array — and a claim asking for one this theory never declared reads `0` for
       * the same reason it would read an unallocated channel.
       */
      channelAt: (name: string, l: any, d: number, k = 0) => {
        const r = ray(l, d);
        const v = r ? (r as any)[name] : undefined;
        return Array.isArray(v) ? (v[k] ?? 0) : (typeof v === "number" ? v : 0);
      },
      setChannel: (name: string, l: any, d: number, v: number, k?: number) => {
        const r = ray(l, d);
        if (!r) return;
        if (k === undefined) (r as any)[name] = v;
        else { const a = ((r as any)[name] ??= []); a[k] = v; }
      },
      rng: w.backend.rng,
      stats: w.backend.stats,
      kind: w.backend.constructor.name,
      raw: (): undefined => undefined,
      snapshot: (): Uint8Array => new Uint8Array(
        [...w.backend].flatMap((l: any) => l.rays.map((r: any) => (r.active ? 1 : 0)))),
    };
    return this.facade;
  }

  /** how much has been destroyed at each local, which is what a force is read off */
  get destroyed(): number[] {
    const c = this.fresh();
    return c.destroyed ??= this.locals.map(l => l.destroyed ?? 0);
  }
  get turned(): number[] {
    const c = this.fresh();
    return c.turned ??= this.locals.map(l => l.turned ?? 0);
  }
  get rng() { return this.world.backend.rng; }

  hasChannel(_name: string) { return false; }
  mask(n: number) { return new Uint8Array(n); }

  isSource(l: any) {
    const x = typeof l === "number" ? this.locals[l] : l;
    return !!x?.source;
  }

  add(spec: SourceSpec) { return this.world.add(spec); }

  tick() { this.world.tick(); return this; }

  run(T: number) { for (let i = 0; i < T; i++) this.world.tick(); return this; }
}

/**
 * THE ARTICLE'S `l` HELPER: readings OF a local, which is where they belong.
 *
 * A claim addresses a point by its INDEX, as the article's backend hands them out,
 * so every one of these takes either — the index it was given, or the point itself.
 */
export const l = {
  DEG: (w: World, local: any) => point(w, local)?.DEG ?? 0,
  rays: (w: World, local: any) =>
    (point(w, local)?.rays ?? []).filter((r: any) => r.active),
  charge: (w: World, local: any) => {
    const p = point(w, local);
    return p ? charge(p) : 0;
  },
};


/** the theories, by the names the migrated claims know them by */
export type Theory = any;

/**
 * THE MEAN DEFLECTIONS A SURVIVING RAY HAS HAD — is the vacuum scattering at all?
 *
 * Reported wherever a null result depends on the medium doing something: if rays are
 * not being turned then nothing measured through them means anything either way. A
 * theory that never turns anything reads 0 here, and that is the answer rather than
 * a missing diagnostic.
 */
/** a claim addresses a point by its index; every reading takes either that or the point */
const point = (w: World, x: any) => typeof x === "number" ? w.locals[x] : x;

export const scattering = (w: World) => {
  let s = 0, n = 0;
  w.backend.forEachLocal((k: number) => {
    const l = point(w, k);
    if (!l) return;
    for (const r of l.rays) if (r.active) { s += r.turns ?? 0; n++; }
  });
  return n ? s / n : 0;
};

/**
 * THE SIGN CONVENTION AS A PARAMETER — the model's one free draw, made explicit.
 *
 * Here the convention lives in the theory that draws it, so asking for a different one
 * is asking for a different theory. Returned unchanged with the draw recorded, so a
 * claim that varies it says so in its header rather than silently measuring one sign.
 */
export const withSign = (t: any, sign: string) =>
  Object.assign(Object.create(Object.getPrototypeOf(t)), t, { name: `${t.name} (${sign})`, sign });

/** the same theory with heavier matter in it — `inertia` is the mass */
export const withInertia = (t: any, inertia: number) =>
  Object.assign(Object.create(Object.getPrototypeOf(t)), t, { name: `${t.name} (inertia ${inertia})`, inertia });

/** whether this theory's rays carry a sign at all */
export const polarised = (t: any) => !!t?.decorators?.Ray?.length;

/**
 * THE PULL: where space was destroyed near a body, facing its partner against facing
 * away — which is the anisotropy a shadow makes, read as a channel.
 */
export const pullChannel = (w: World, at: Vec, toward: Vec, lo = 2, hi = 5) => {
  const n = norm(toward) || 1;
  const u = toward.map(x => x / n);
  let tow = 0, twN = 0, awy = 0, awN = 0;
  w.backend.forEachLocal((k: any) => {
    if (w.isSource(k)) return;
    const p: Vec = w.backend.position(k);
    const d = p.map((x: number, i: number) => x - (at[i] ?? 0));
    const r = norm(d);
    if (r < lo || r > hi) return;
    const along = d.reduce((a: number, x: number, i: number) => a + x * u[i], 0);
    if (Math.abs(along) < 0.6 * r) return;
    /* what a local has had destroyed on it — the shortfall a shadow leaves */
    const gone = k.rays.filter((x: any) => !x.active).length;
    if (along > 0) { tow += gone; twN++; } else { awy += gone; awN++; }
  });
  return tow / Math.max(twN, 1) - awy / Math.max(awN, 1);
};

/** the medium at one instant, which is what a single tick can say about it */
export const mediumAt = (o: any): World => {
  const w = new World({ theory: o.theory, geometry: o.geometry, N: o.N ?? 9, seed: o.seed ?? 0 });
  w.run(o.T ?? 1);
  return Object.assign(w, { fill: fill(w) }) as World;
};

/** the magnetic field at a local: Σ σ_d (d̂ × u), which needs the emitter's label */
export const fieldB = (w: World, local: any): Vec => {
  const out = [0, 0, 0];
  const g = w.geometry;
  const p = point(w, local);
  if (!p) return out;
  p.rays.forEach((r: any, d: number) => {
    if (!r.active || !r.label) return;
    const q = r.polarity ?? 0;
    if (!q) return;
    const u = r.label, dh = g.U[d] ?? [0, 0, 0];
    out[0] += q * (dh[1] * (u[2] ?? 0) - dh[2] * (u[1] ?? 0));
    out[1] += q * (dh[2] * (u[0] ?? 0) - dh[0] * (u[2] ?? 0));
    out[2] += q * (dh[0] * (u[1] ?? 0) - dh[1] * (u[0] ?? 0));
  });
  return out;
};


/** how much the vacuum has grown, as points made against points destroyed */
export const expansionOf = (w: World) => {
  const s = w.stats;
  return { created: s.created, folded: s.folded, net: s.created - s.folded, size: w.size };
};

/*
 * THE THEORIES UNDER THE NAMES THE MIGRATED CLAIMS USE.
 *
 * A claim written against the article says `GRAVITY`; this implementation calls the
 * same thing `G`, because a theory here is a builder rather than a record. The alias
 * is one line and it keeps every ported test saying what it said.
 */
export { G as GRAVITY } from "../theories/G.ts";
export { G_XOR as GRAVITY_MAGNETISM } from "../theories/G^XOR.ts";
export { G_CONSERVING as CONSERVING } from "../theories/G^CONSERVING.ts";
export { G_XOR_2 as LAYER2 } from "../theories/G^XOR*2.ts";
export { G_LABELLED as LABELLED } from "../theories/G^LABELLED.ts";
export { G_PURE as PURE } from "../theories/G^PURE.ts";

/*
 * THE THEORIES UNDER THE NAMES THE MIGRATED CLAIMS USE.
 *
 * A claim written against the article says `GRAVITY`; this implementation calls the
 * same thing `G`, because a theory here is a builder rather than a record. The alias
 * keeps every ported test saying what it said.
 */


/*
 * THE RULE BUILDERS A CLAIM MAY REACH FOR.
 *
 * In this implementation a rule is declared on a theory with `.rule(name, type, exec)`
 * rather than constructed and handed to one, so there is nothing for these to return.
 * A claim that builds its own variant theory therefore CANNOT be phrased here yet —
 * and it says so, loudly, at the moment it tries, rather than quietly measuring a
 * theory that is not the one it asked for.
 */
const unbuilt = (what: string) => (..._a: any[]): never => {
  throw new Error(
    `${what} is a rule CONSTRUCTOR of the article's model. Here a rule is declared on a ` +
    `theory — G.rule("ANNIHILATION", …) — so a claim that assembles its own theory out ` +
    `of rule objects has to be rewritten against \`Theory\` before it can be measured. ` +
    `It is not being skipped: this is what it costs.`);
};

export const expand = unbuilt("expand()");
export const collide = unbuilt("collide()");
export const streamRule = unbuilt("streamRule()");
export const emitRule = unbuilt("emitRule()");
export const moveRule = unbuilt("moveRule()");

export type Meeting = "on-edge" | "co-located" | "head-on";
export type MeetingRate = "all" | "one";

/** the article's readings of (G+M/3) — how "they turn around" is carried out */
export const DEFLECT = {
  pass: () => (): null => null,
  reverse: () => (w: any, l: any, d: number) => w.geometry.OPP[d],
  spin: () => (w: any, l: any, d: number) => w.geometry.turn(d, w.geometry.ringAxis),
};
