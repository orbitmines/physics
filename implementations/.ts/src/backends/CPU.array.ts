import { Sample } from "../lib/Backend.ts";
import { Local, Ref, Ref2, Vec } from "../lib/Local.ts";
import { Theory } from "../lib/Theory.ts";
import { Graph } from "./CPU.graph.ts";

export class Flat extends Graph {
  order = new Map<Local, number>()

  constructor(
    theory: Theory<any, any, any, any, any, any>,
    seed = 0,
    bound = Infinity,
    DEG = 0,
    public N = 1,
    public D = 1,
    folds = true,
  ) {
    super(theory, seed, bound, DEG, false, folds, false, false);
  }

  create(of: Ref): Ref2 {
    const ref = super.create(of);
    if (of === "Local") this.order.set(ref as Local, this.order.size);
    return ref;
  }

  at(l: Local): Vec {
    const i = this.order.get(l) ?? 0;
    return Array.from({ length: this.D }, (_, k) => Math.floor(i / this.N ** k) % this.N);
  }

  sample(): Sample[] {
    return [...this.locals].map(local => ({ local, at: this.at(local) }));
  }
}
