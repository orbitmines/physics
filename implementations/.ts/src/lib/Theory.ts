import { Boundary, Local, Ray } from "./Local.ts";
import { World } from "./World.ts";

export type Ref = "Local" | "Ray" | "Boundary";
export type Ref2 = Local | Ray | Boundary;
export type Any = Ref2 | Ref2[]
type RefType<R extends Ref> =
  R extends "Local" ? Local :
  R extends "Ray" ? Ray :
  R extends "Boundary" ? Boundary :
  never;
type RefTypes<R extends Ref | Ref[]> =
  R extends Ref
    ? [RefType<R>]
    : R extends Ref[]
      ? { [K in keyof R]: R[K] extends Ref ? RefType<R[K]> : never }
      : never;

export type RuleType = Ref | Ref[]// | World // Arbitrary graphs could be rules
export class Rule<Type extends RuleType = []> {
  constructor(public type: Type, public exec: (...refs: RefTypes<Type>) => Any) {}
}

export type Constructor<T> = {
  [K in keyof T]?: T[K] | (() => T[K]);
}

export class Theory<
  TRules = {},
  TLocal = Local, TRay = Ray, TBoundary = Boundary
> {
  rules: TRules
  rule = <Name extends string, Type extends RuleType>(name: Name, type: Type, exec: (...refs: RefTypes<Type>) => Any): Theory<TRules & { [K in Name]: Rule }, TLocal, TRay, TBoundary> => {
    return this.copy();
  }
  layers = (...layers: Theory[]): this => { return this; }
  decorate = {
    Local: <T>(constructor: (self: TLocal & T) => Constructor<TLocal & T>): Theory<TRules, TLocal & T, TRay, TBoundary> => {
      return this.copy();
    },
    Ray: <T>(constructor: (self: TRay & T) => Constructor<TRay & T>): Theory<TRules, TLocal, TRay & T, TBoundary> => {
      return this.copy();
    },
    Boundary: <T>(constructor: (self: TBoundary & T) => Constructor<TBoundary & T>): Theory<TRules, TLocal, TRay, TBoundary & T> => {
      return this.copy();
    }
  }

  copy<Rules = TRules, L = TLocal, R = TRay, B = TBoundary>(): Theory<Rules, L, R, B> {
    const copy = new Theory<Rules, L, R, B>();
    return copy;
  }

  seed(): World { // Any seed options
    
  }
}