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

const step = (ref: any, to: Ref): Ref2[] => {
  switch (kind(ref)) {
    case "Local": return to === "Ray" ? ref.rays
      : to === "Boundary" ? ref.rays.flatMap((r: Ray) => r.boundaries)
      : of(...ref.rays.flatMap((r: Ray) => r.boundaries).map((b: Boundary) => b.target?.source?.l));
    case "Ray": return to === "Boundary" ? ref.boundaries
      : to === "Local" ? of(ref.l)
      : of(...ref.boundaries.map((b: Boundary) => b.target?.source));
    case "Boundary": return to === "Boundary" ? of(ref.target)
      : to === "Ray" ? of(ref.source)
      : of(ref.source?.l);
  }
}

const all = (backend: Backend, ref: Ref): Ref2[] => {
  const locals = [...backend];
  if (ref === "Local") return locals;
  const rays = locals.flatMap(l => l.rays);
  return ref === "Ray" ? rays : rays.flatMap(r => r.boundaries);
}

export const matches = (backend: Backend, type: RuleType): Ref2[][] => {
  const chain = Array.isArray(type) ? type : [type];
  if (chain.length === 0) return [];
  let paths = all(backend, chain[0]).map(ref => [ref]);
  for (const next of chain.slice(1))
    paths = paths.flatMap(path => step(path[path.length - 1], next).map(ref => [...path, ref]));
  return paths;
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
            for (const refs of matches(this.backend, rule.type)) rule.exec(...refs);
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
