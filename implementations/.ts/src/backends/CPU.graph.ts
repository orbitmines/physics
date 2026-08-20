import { Backend, Sample, Stats } from "../lib/Backend.ts";
import { Boundary, Local, Ref, Ref2 } from "../lib/Local.ts";
import { Op, Rewrite } from "../lib/Rewrite.ts";
import { Theory } from "../lib/Theory.ts";

const mulberry32 = (seed: number) => () => {
  seed = (seed + 0x6D2B79F5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export class Graph implements Backend {
  locals = new Set<Local>()
  parents = new Map<Ref2, Ref2>()
  kids = new Map<Ref2, Set<Ref2>>()
  targets = new Map<Boundary, Boundary>()
  dead = new WeakSet<object>()
  rewrite: Rewrite = new Rewrite(this)

  rng: () => number
  stats: Stats = { annihilations: 0, folded: 0, created: 0 }
  world: any

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
  }

  *[Symbol.iterator]() {
    for (const l of this.locals) if (this.parents.get(l) === undefined) yield l;
  }
  size() { let n = 0; for (const _ of this) n++; return n }

  create(of: Ref): Ref2 {
    const ref = this.theory.build(this, of);
    if (of === "Local") this.locals.add(ref as Local);
    return ref;
  }

  sample(accuracy = Infinity, from?: Local): Sample[] {
    const origin = from ?? this.locals.values().next().value;
    if (!origin) return [];
    const out: Sample[] = [{ local: origin, at: [0] }];
    const seen = new Set<Local>([origin]);
    for (let edge = [origin], hops = 1; edge.length && hops <= accuracy; hops++) {
      const next: Local[] = [];
      for (const l of edge)
        for (const r of l.rays)
          for (const b of r.boundaries) {
            const there = b.target?.source?.l;
            if (!there || seen.has(there)) continue;
            seen.add(there);
            next.push(there);
            out.push({ local: there, at: [hops] });
          }
      edge = next;
    }
    return out;
  }

  parent(ref: Ref2) { return this.parents.get(ref) }
  children(ref: Ref2) { return [...(this.kids.get(ref) ?? [])] }
  target(b: Boundary) { return this.targets.get(b) }

  gone(...refs: (Ref2 | undefined)[]) { return refs.some(r => r && this.dead.has(r)) }

  apply(op: Op): void {
    switch (op.op) {
      case "contain": {
        if (this.gone(op.child, op.parent)) return;
        const was = this.parents.get(op.child);
        if (was) this.kids.get(was)?.delete(op.child);
        this.parents.delete(op.child);
        if (!op.parent) return;
        this.parents.set(op.child, op.parent);
        if (!this.kids.has(op.parent)) this.kids.set(op.parent, new Set());
        this.kids.get(op.parent)!.add(op.child);
        return;
      }
      case "link": {
        if (this.gone(op.a, op.b)) return;
        for (const end of [op.a, op.b]) {
          if (!end) continue;
          const was = this.targets.get(end);
          if (was) this.targets.delete(was);
          this.targets.delete(end);
        }
        if (!op.b) return;
        this.targets.set(op.a, op.b);
        this.targets.set(op.b, op.a);
        return;
      }
      case "delete": {
        if (this.gone(op.ref)) return;
        for (const kid of this.children(op.ref)) this.apply({ op: "delete", ref: kid });
        this.apply({ op: "link", a: op.ref as Boundary });
        this.apply({ op: "contain", child: op.ref });
        this.kids.delete(op.ref);
        this.locals.delete(op.ref as Local);
        this.dead.add(op.ref);
        return;
      }
    }
  }
}
