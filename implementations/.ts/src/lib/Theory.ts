import { base, Boundary, kind, Local, Ray, Ref, Ref2, Vocab } from "./Local.ts";
import { Backend } from "./Backend.ts";
import { World } from "./World.ts";
import { Visual } from "../visuals/CANVAS.ts";

export type { Ref, Ref2 } from "./Local.ts";

type RefType<R extends Ref, L, Y, B> =
  R extends "Local" ? L :
  R extends "Ray" ? Y :
  R extends "Boundary" ? B :
  never;
type RefTypes<R extends Ref | Ref[], L, Y, B> =
  R extends Ref
    ? [RefType<R, L, Y, B>]
    : R extends Ref[]
      ? { [K in keyof R]: R[K] extends Ref ? RefType<R[K], L, Y, B> : never }
      : never;

export type RuleType = Ref | Ref[]// | World // Arbitrary graphs could be rules
export class Rule<Type extends RuleType = []> {
  constructor(public type: Type, public exec: (...refs: any[]) => void) {}
}

const METHOD = Symbol("method");
export const method = <F extends Function>(f: F): F =>
  Object.assign(f, { [METHOD]: true });

export type Constructor<T> = {
  [K in keyof T]?: T[K] | (() => T[K]);
}

export type Decorator<T> = (self: T) => Constructor<T>;

export const construct = <T>(decorators: Decorator<any>[], from: object = {}): T => {
  const self: any = Object.defineProperties({}, Object.getOwnPropertyDescriptors(from));
  for (const decorate of decorators)
    for (const [key, value] of Object.entries(decorate(self) as Record<string, unknown>))
      Object.defineProperty(self, key, typeof value === "function" && !(METHOD in value)
        ? { get: value as () => unknown, configurable: true, enumerable: true }
        : { value, writable: true, configurable: true, enumerable: true });
  return self as T;
}

const of = <T>(...refs: (T | undefined)[]): T[] => refs.filter(r => r !== undefined) as T[];

/*
 * ONE HOP OF A CHAIN, YIELDED. Written as a generator for the same reason `all` is:
 * ANNIHILATION is ["Boundary", "Boundary"], so this is called once per boundary per
 * tick, and returning `of(ref.target)` meant a one-element array for every one of them.
 * Nothing is skipped — a hop with nothing at the end yields nothing, which is what
 * filtering the undefined out of a list did.
 */
function* step(ref: any, to: Ref): Generator<Ref2> {
  switch (kind(ref)) {
    case "Local":
      for (const r of ref.rays as Ray[]) {
        if (to === "Ray") { yield r; continue; }
        for (const b of r.boundaries) {
          if (to === "Boundary") yield b;
          else if (b.target?.source?.l) yield b.target.source.l;
        }
      }
      return;
    case "Ray":
      if (to === "Boundary") { yield* ref.boundaries; return; }
      if (to === "Local") { if (ref.l) yield ref.l; return; }
      for (const b of ref.boundaries as Boundary[]) if (b.target?.source) yield b.target.source;
      return;
    case "Boundary": {
      const there = to === "Boundary" ? ref.target
        : to === "Ray" ? ref.source
        : ref.source?.l;
      if (there) yield there;
      return;
    }
  }
}

/*
 * WHAT A RULE IS OFFERED, AND THE ONE THING THAT HAS TO BE A SNAPSHOT.
 *
 * THE LOCALS ARE COPIED AND EVERYTHING BELOW THEM IS WALKED LAZILY. A rule sees the
 * world as it stood when its pass began: rewrites are buffered in `Rewrite` and land
 * at `flush`, which happens after the pass, so `l.rays` and `r.boundaries` cannot move
 * underneath the walk. The LOCALS are the exception — `Rewrite.create` reaches the
 * backend immediately, so (G+M/2) adds points to the very set being iterated, and a
 * lazy walk of it would hand the rule points the same pass had just made. That one
 * level is copied; nothing else needs to be.
 *
 * IT USED TO BE COPIED ALL THE WAY DOWN, and that was the cost of a tick. `all` built
 * every local, then every ray, then every boundary as arrays — at 121² that is 14.6k,
 * 88k and 175k objects listed out ONCE PER RULE PER TICK — and a chained type like
 * ANNIHILATION's ["Boundary", "Boundary"] then allocated a `[ref]` per boundary and a
 * `[...path, ref]` per pair on top. Roughly a million short-lived arrays a tick, and
 * the panels could not be rendered at all: eighteen minutes of warm-up per panel, most
 * of it in the garbage collector.
 *
 * THE ORDER IS THE OLD ORDER, exactly — locals in set order, each local's rays in
 * order, each ray's boundaries in order, and a chain expanded depth-first the way the
 * flatMaps expanded it. It has to be: the rules draw from one `rng`, so a different
 * visiting order is a different world, not a faster one.
 */
/**
 * AND THE WALK ITSELF ALLOCATES NOTHING BELOW THE LOCALS.
 *
 * `l.rays` and `r.boundaries` are the vocabulary — they hand back an array, which is
 * the right shape for a rule to read and the wrong one to build a hundred thousand of
 * per tick. Where the backend can walk its own lists it is asked to; where it cannot,
 * the arrays are still correct, so a backend that has not been taught this is slower
 * and never wrong.
 */
const rays = (backend: any, l: any): Iterable<any> =>
  backend.each ? backend.each("Ray", l) : l.rays;
const bounds = (backend: any, r: any): Iterable<any> =>
  backend.each ? backend.each("Boundary", r) : r.boundaries;

function* all(backend: Backend, ref: Ref): Generator<Ref2> {
  const locals = [...backend];                     // the one level that must not move
  if (ref === "Local") { yield* locals; return; }
  for (const l of locals)
    for (const r of rays(backend, l)) {
      if (ref === "Ray") yield r;
      else yield* bounds(backend, r);
    }
}

/**
 * THE MATCHES FOR A RULE, YIELDED RATHER THAN LISTED.
 *
 * The tuple handed to `exec` is REUSED between matches, which is safe because
 * `rule.exec(...refs)` spreads it into arguments at the call — a rule receives its
 * refs, never the array. Nothing here may hold on to it.
 */
/**
 * EVERY MATCH, HANDED STRAIGHT TO THE RULE.
 *
 * `matches` is a generator over a generator over a generator: at a hundred and
 * seventy thousand boundaries a tick that is half a million frames resumed, and
 * measured it was most of what a chained rule cost — the walk alone was 0.08s of
 * ANNIHILATION's 0.11s, doing nothing but arriving.
 *
 * The shapes every rule in this book has are written as loops instead, and the
 * ORDER IS THE SAME ORDER: locals as the backend gives them, each local's rays in
 * order, each ray's ends in order. It has to be — the rules draw from one `rng`, so
 * a different visiting order is a different world rather than a faster one. Anything
 * longer falls back to the generator, which is still correct.
 */
export const forEachMatch = (
  backend: Backend, type: RuleType, f: (...refs: any[]) => void,
) => {
  const chain = Array.isArray(type) ? type : [type];
  const b = backend as any;
  if (!chain.length) return;
  if (!b.walk) { for (const refs of matches(backend, type)) f(...refs); return; }

  const locals = [...backend];                    // the one level that must not move

  if (chain.length === 1) {
    if (chain[0] === "Local") { for (const l of locals) f(l); return; }
    if (chain[0] === "Ray") {
      for (const l of locals) b.walk("Ray", l, (r: any) => f(r));
      return;
    }
    for (const l of locals)
      b.walk("Ray", l, (r: any) => b.walk("Boundary", r, (x: any) => f(x)));
    return;
  }

  /*
   * A FACING PAIR, VISITED ONCE — the only chain the rules use, and the hot one.
   *
   * A meeting is one event, and the article says so: its collide walks the pairs with
   * `if (B < A) continue`, so each edge is resolved from one side. Walking both
   * orders offers the same meeting twice — the second finds what the first already
   * did and falls through — which is half the work of the busiest rule in the model
   * spent arriving at a decision that has been made.
   *
   * WHICH SIDE IS ARBITRARY AND MUST BE STABLE, so it is the lower index: the pair is
   * the same pair whichever end is asked, and every rule here acts on the two
   * symmetrically.
   */
  if (chain.length === 2 && chain[0] === "Boundary" && chain[1] === "Boundary") {
    for (const l of locals)
      b.walk("Ray", l, (r: any) => b.walk("Boundary", r, (x: any) => {
        const t = x.target;
        if (t && x.i < t.i) f(x, t);
      }));
    return;
  }

  for (const refs of matches(backend, type)) f(...refs);
}

export function* matches(backend: Backend, type: RuleType): Generator<Ref2[]> {
  const chain = Array.isArray(type) ? type : [type];
  if (chain.length === 0) return;
  const path: Ref2[] = new Array(chain.length);
  /*
   * THE TWO SHAPES EVERY RULE IN THIS BOOK HAS, written out. A nested `yield*` is a
   * generator resumed through one frame per level for every match, which at a hundred
   * and seventy thousand boundaries a tick is most of what a chained rule costs. Every
   * rule here is one ref or two — EMISSION, CREATION, MOVEMENT, ARRIVAL take one,
   * ANNIHILATION takes a facing pair — so those two are loops, and the general chain
   * stays behind them for a rule that wants a longer reach.
   */
  if (chain.length === 1) {
    for (const a of all(backend, chain[0])) { path[0] = a; yield path; }
    return;
  }
  if (chain.length === 2) {
    for (const a of all(backend, chain[0])) {
      path[0] = a;
      for (const b of step(a, chain[1])) { path[1] = b; yield path; }
    }
    return;
  }
  const walk = function* (depth: number): Generator<Ref2[]> {
    if (depth === chain.length) { yield path; return; }
    const here = depth === 0 ? all(backend, chain[0]) : step(path[depth - 1], chain[depth]);
    for (const ref of here) { path[depth] = ref; yield* walk(depth + 1); }
  };
  yield* walk(0);
}

export type Space = "merged" | "separate";

export type Layer = {
  theory: Theory
  space: Space
}

export class Theory<
  TRules = {},
  TWorld = World, L = {}, R = {}, B = {},
  TLayers = {}, TVisuals = {}
> {
  rules: TRules = {} as TRules
  layers: TLayers = {} as TLayers
  visuals: TVisuals = {} as TVisuals
  decorators: Record<"World" | Ref, Decorator<any>[]> =
    { World: [], Local: [], Ray: [], Boundary: [] }

  rule = <Name extends string, Type extends RuleType>(name: Name, type: Type, exec: (...refs: RefTypes<Type, Vocab<L, R, B>["Local"], Vocab<L, R, B>["Ray"], Vocab<L, R, B>["Boundary"]>) => void): Theory<TRules & { [K in Name]: Rule }, TWorld, L, R, B, TLayers, TVisuals> =>
    this.copy<TRules & { [K in Name]: Rule }>(copy => {
      copy.rules = { ...copy.rules, [name]: new Rule(type, exec as (...refs: any[]) => void) };
    })

  /**
   * THE SAME THEORY WITH A RULE TAKEN OUT — which is a different thing from a rule
   * that does nothing.
   *
   * A limit is usually reached by REMOVING an event, not by redefining it: the
   * deterministic limit of the vacuum is (G/2) gone, not (G/2) rewritten to return
   * immediately. Overriding it with an empty body says the event still happens and
   * has no effect, which is false, and it still costs a full match enumeration every
   * tick to say so.
   */
  without = <Name extends keyof TRules & string>(name: Name): Theory<Omit<TRules, Name>, TWorld, L, R, B, TLayers, TVisuals> =>
    this.copy<Omit<TRules, Name>>(copy => {
      const rest = { ...(copy.rules as object) } as Record<string, unknown>;
      if (!(name in rest)) throw new Error(
        `this theory has no rule called ${name}, so there is nothing to take out of it.`);
      delete rest[name];
      copy.rules = rest as Omit<TRules, Name>;
    })

  layered = <Name extends string, T extends Theory>(name: Name, theory: T, space: Space): Theory<TRules, TWorld, L, R, B, TLayers & { [K in Name]: T }, TVisuals> =>
    this.copy<TRules, TWorld, L, R, B, TLayers & { [K in Name]: T }, TVisuals>(copy => {
      copy.layers = { ...copy.layers, [name]: { theory, space } };
    })

  layer = Object.assign(
    <Name extends string, T extends Theory>(name: Name, theory: T) =>
      this.layered(name, theory, "separate"),
    {
      merged: <Name extends string, T extends Theory>(name: Name, theory: T) =>
        this.layered(name, theory, "merged"),
    },
  )

  decorate = {
    World: <T>(constructor: Decorator<TWorld & T>): Theory<TRules, TWorld & T, L, R, B, TLayers, TVisuals> =>
      this.copy<TRules, TWorld & T>(copy => { copy.decorators.World.push(constructor); }),
    Local: <T>(constructor: Decorator<Vocab<L & T, R, B>["Local"]>): Theory<TRules, TWorld, L & T, R, B, TLayers, TVisuals> =>
      this.copy<TRules, TWorld, L & T>(copy => { copy.decorators.Local.push(constructor); }),
    Ray: <T>(constructor: Decorator<Vocab<L, R & T, B>["Ray"]>): Theory<TRules, TWorld, L, R & T, B, TLayers, TVisuals> =>
      this.copy<TRules, TWorld, L, R & T>(copy => { copy.decorators.Ray.push(constructor); }),
    Boundary: <T>(constructor: Decorator<Vocab<L, R, B & T>["Boundary"]>): Theory<TRules, TWorld, L, R, B & T, TLayers, TVisuals> =>
      this.copy<TRules, TWorld, L, R, B & T>(copy => { copy.decorators.Boundary.push(constructor); }),
  }

  visual = <Name extends string>(name: Name, v: Omit<Visual, "id">): Theory<TRules, TWorld, L, R, B, TLayers, TVisuals & { [K in Name]: Visual }> =>
    this.copy<TRules, TWorld, L, R, B, TLayers, TVisuals & { [K in Name]: Visual }>(copy => {
      copy.visuals = { ...copy.visuals, [name]: { ...v, id: name } };
    })

  copy<Rules = TRules, W = TWorld, XL = L, XR = R, XB = B, Layers = TLayers, Visuals = TVisuals>(
    and?: (copy: Theory<Rules, W, XL, XR, XB, Layers, Visuals>) => void
  ): Theory<Rules, W, XL, XR, XB, Layers, Visuals> {
    const copy = new Theory<Rules, W, XL, XR, XB, Layers, Visuals>();
    copy.rules = { ...(this.rules as object) } as Rules;
    copy.layers = { ...(this.layers as object) } as Layers;
    copy.visuals = { ...(this.visuals as object) } as Visuals;
    copy.decorators = {
      World: [...this.decorators.World], Local: [...this.decorators.Local],
      Ray: [...this.decorators.Ray], Boundary: [...this.decorators.Boundary],
    };
    and?.(copy);
    return copy;
  }

  /** whether this theory's rays carry a sign at all — the polarity channel exists or it does not */
  get polarised(): boolean {
    return this.decorating("Ray").length > 0;
  }

  /** the name a claim knows this theory by */
  name = "—"

  merged = (): Layer[] =>
    (Object.values(this.layers as object) as Layer[]).filter(l => l.space === "merged")

  decorating = (ref: "World" | Ref): Decorator<any>[] => [
    ...this.decorators[ref],
    ...this.merged().flatMap(l => l.theory.decorating(ref)),
  ]

  Local = (backend: Backend): Vocab<L, R, B>["Local"] =>
    construct(this.decorating("Local"), base.Local(backend))
  Ray = (backend: Backend): Vocab<L, R, B>["Ray"] =>
    construct(this.decorating("Ray"), base.Ray(backend))
  Boundary = (backend: Backend): Vocab<L, R, B>["Boundary"] =>
    construct(this.decorating("Boundary"), base.Boundary(backend))

  build = (backend: Backend, of: Ref): Ref2 =>
    (of === "Local" ? this.Local(backend)
      : of === "Ray" ? this.Ray(backend)
        : this.Boundary(backend)) as Ref2

  seed(options?: Constructor<TWorld>): TWorld {
    const theory = this;
    const layers: Record<string, World> = {};
    let world: World;

    const seeded = construct<TWorld>(
      [...this.decorators.World, ...of(options && (() => options))],
      {
        theory, layers, below: undefined, ticks: 0,
        tick: method(function (this: World) {
          this.ticks++;
          for (const rule of Object.values(theory.rules as object) as Rule<RuleType>[]) {
            forEachMatch(this.backend, rule.type, rule.exec);
            this.backend.rewrite.flush();
          }
          for (const layer of Object.values(this.layers)) layer.tick();
        }),
      },
    );
    world = seeded as unknown as World;
    /*
     * THE BACKEND BELONGS TO THE WORLD THAT LAID IT DOWN.
     *
     * A merged layer shares the backend below it, and seeding the layer used to
     * re-point the backend at the LAYER's world — which has no geometry of its own,
     * so a rule reaching through `l.world.geometry` found nothing and quietly did
     * nothing. The first owner keeps it; a merged layer reaches its host through
     * `below` instead.
     */
    if ((world.backend as any).world === undefined) (world.backend as any).world = world;

    for (const [name, layer] of Object.entries(this.layers as object) as [string, Layer][])
      layers[name] = layer.theory.seed({
        below: () => world,
        ...(layer.space === "merged" ? { backend: () => world.backend } : {}),
      });

    return seeded;
  }
}
