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
    /*
     * THE THREE CAPABILITIES, AS PARAMETERS — because the difference between "the flat
     * reading" and "the graph reading" IS these three, and `conform` exists to measure
     * what withdrawing them costs. Withheld by default, which is the flat reading: a
     * fold is RECORDED and the point stays, an insert is recorded as size and no point
     * is made, and nothing is ever given back.
     */
    grows = false,
    removes = false,
    expands = false,
  ) {
    super(theory, seed, bound, DEG, grows, folds, removes, expands);
  }

  create(of: any) {
    const ref = super.create(of);
    /* an index is a PLACE, so a slot handed back and taken again is the same place —
     * assigning a new one would move a point that has not moved */
    if (of === "Local" && !this.order.has(ref as Local)) {
      const i = this.order.size;
      this.order.set(ref as Local, i);
      this.byIndex[i] = ref as Local;
    }
    return ref;
  }

  /**
   * HOW FAR THE WORLD MAY REACH, and from where — the article's `bound`, as a geometric
   * test rather than a count of points. Absent where the world may grow without limit.
   */
  reach?: { at: Vec; radius: number }

  /** whether a point may be MADE here at all */
  within(at: Vec): boolean {
    if (!this.reach) return true;
    let d2 = 0;
    for (let i = 0; i < at.length; i++) d2 += (at[i] - (this.reach.at[i] ?? 0)) ** 2;
    return d2 <= this.reach.radius * this.reach.radius;
  }

  byIndex: Local[] = []
  byCoord = new Map<string, Local>()
  private static key = (v: Vec) => v.map(x => Math.round(x * 2)).join(",")

  /**
   * WHAT IS AT A PLACE, IF ANYTHING — which is what a point being MADE has to ask.
   *
   * A frontier point is not a leaf hanging off the one ray that reached it: it is a
   * point of the same lattice, and every neighbour of it that already exists is its
   * neighbour. Without this the world grows as a TREE — measured, the mean ways out of
   * a point came to 8.6 where the lattice has 12, and space grew four-fold where the
   * article's own run grew it two hundred and sixty.
   */
  atCoord(v: Vec): Local | undefined {
    const made = this.byCoord.get(Flat.key(v));
    if (made) return this.holds(made) ? made : undefined;
    if (!v.every((x, i) => Number.isInteger(x) && x >= 0 && x < this.N && i < this.D)) return undefined;
    const i = v.reduce((a, x, d) => a + x * this.N ** d, 0);
    const l = this.byIndex[i];
    return l && this.holds(l) ? l : undefined;
  }

  /**
   * WHERE A LOCAL SITS, IN THE GRID IT WAS LAID DOWN ON — and where a point that was
   * MADE sits, which the grid cannot answer.
   *
   * A seeded point is at its index. A point the rules made — grown at an expanding edge,
   * or inserted between two that turned — has no index in that grid, and reading one off
   * its slot number puts it at an arbitrary place inside the box. So the rewrite that
   * makes it says where it went, and that is what is remembered.
   */
  place(l: Local, at: Vec) { this.coords.set(l, at); this.byCoord.set(Flat.key(at), l); }
  coords = new Map<Local, Vec>()

  at(l: Local): Vec {
    const made = this.coords.get(l);
    if (made) return made;
    const i = this.order.get(l) ?? 0;
    return Array.from({ length: this.D }, (_, k) => Math.floor(i / this.N ** k) % this.N);
  }

  sample(): Sample[] {
    return [...this].map(local => ({ local, at: this.at(local) }));
  }
}
