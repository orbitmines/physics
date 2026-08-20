import { Backend } from "../lib/Backend.ts";
import { Boundary, Local, Ref, Ref2 } from "../lib/Local.ts";
import { Op, Rewrite } from "../lib/Rewrite.ts";
import { Theory } from "../lib/Theory.ts";

export class Graph implements Backend {
  locals = new Set<Local>()
  parents = new Map<Ref2, Ref2>()
  kids = new Map<Ref2, Set<Ref2>>()
  targets = new Map<Boundary, Boundary>()
  dead = new WeakSet<object>()
  rewrite: Rewrite = new Rewrite(this)

  constructor(public theory: Theory<any, any, any, any, any, any>) {}

  [Symbol.iterator]() { return this.locals.values() }
  size() { return this.locals.size }

  create(of: Ref): Ref2 {
    const ref = this.theory.build(this, of);
    if (of === "Local") this.locals.add(ref as Local);
    return ref;
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
        for (const kid of this.children(op.ref)) this.apply({ op: "contain", child: kid });
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
