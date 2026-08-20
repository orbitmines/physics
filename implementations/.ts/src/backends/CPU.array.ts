import { Geometry } from "../lib/Local.ts";
import { Sample } from "../lib/Backend.ts";
import { Local, Vec } from "../lib/Local.ts";
import { Theory } from "../lib/Theory.ts";
import { Graph } from "./CPU.graph.ts";

/**
 * THE FLAT READING — the same store, with a FIXED EMBEDDING and no room to grow.
 *
 * It is the graph backend with three capabilities withdrawn, and each withdrawal is a
 * statement rather than a limitation: its sites are a grid, so a fold is RECORDED and
 * the point stays, an insert is recorded as size and no point is made, and nothing is
 * ever given back. That is the flat backend's stated approximation, and `conform`
 * measures what it costs instead of anyone assuming it is small.
 *
 * WHAT IT ADDS is coordinates. A graph knows only how far apart things are in hops; a
 * grid knows where they are, which is what every shell, flux and profile is read off.
 */
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

  create(of: any) {
    const ref = super.create(of);
    if (of === "Local") this.order.set(ref as Local, this.order.size);
    return ref;
  }

  /** where a local sits, in the grid it was laid down on */
  at(l: Local): Vec {
    const i = this.order.get(l) ?? 0;
    return Array.from({ length: this.D }, (_, k) => Math.floor(i / this.N ** k) % this.N);
  }

  sample(): Sample[] {
    return [...this].map(local => ({ local, at: this.at(local) }));
  }
}
