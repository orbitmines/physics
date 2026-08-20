import { Backend } from "./Backend.ts"
import { Boundary, kind, Local, Ray, Ref, Ref2 } from "./Local.ts"

export type Op =
  | { op: "contain"; child: Ref2; parent?: Ref2 }
  | { op: "link"; a: Boundary; b?: Boundary }
  | { op: "delete"; ref: Ref2 }

export class Rewrite {
  ops: Op[] = []
  fresh = new WeakSet<object>()

  constructor(public backend: Backend) {}

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

  fold = (into: Local, l: Local): this => {
    if (into === l || !this.backend.folds) return this;
    this.backend.stats.folded++;
    if (!this.backend.removes) return this;
    return this.contain(l, into);
  }

  unfold = (l: Local): Local | undefined => {
    if (!this.backend.expands) return undefined;
    const [back] = this.backend.children(l).filter(c => kind(c) === "Local") as Local[];
    if (back) this.contain(back, undefined);
    return back;
  }

  insert = (b: Boundary): Local | undefined => {
    const t = b.target;
    if (!t) return undefined;
    this.backend.stats.created++;
    if (!this.backend.grows) return undefined;
    if (this.backend.size() >= 2 * this.backend.bound) return undefined;
    const mid = this.create("Local") as Local;
    const near = this.ray(mid), far = this.ray(mid);
    near.boundaries[1].link(far.boundaries[1]);
    near.boundaries[0].link(b);
    far.boundaries[0].link(t);
    return mid;
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
