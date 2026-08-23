import { Backend, Sample, Stats } from "./Backend.ts";
import { Boundary, Local, Ref, Ref2 } from "./Local.ts";
import { Op, Rewrite } from "./Rewrite.ts";
import { Carrying } from "./Theory.ts";

/**
 * THE SPACE A LAYER ABOVE RUNS ON: what the layer below has folded away.
 *
 * A LAYER THAT SAYS "I OPERATE ON THE SPATIAL LAYER BELOW ME" SHOULD NOT RESTATE ITS
 * RULES, and this is what lets it not. `Inside` is not a store — it is the same store,
 * ITERATED DIFFERENTLY. Every primitive, every column, every link and every flyweight is
 * the host's; what changes is which points the walk hands to a rule. So Layer 2 can BE
 * `G^XOR`, unmodified and unforked, and the sentence "the same automaton, running on the
 * space the one below destroyed" is the whole of the construction rather than a summary
 * of a reimplementation.
 *
 * AND THE INTERIOR IS NOT INVENTED. (G/1) already ends in `here.fold(there)`, and a fold
 * CONTAINS a point rather than freeing it: it leaves `loose` and stays in `live`, keeping
 * its rays, its links and its columns. Every annihilation this model has ever run has
 * been filling this set, and nothing has ever read it — gravity takes the count as
 * `density` and asks no more. So the space gravity destroys is the material a layer above
 * is made of, which is a claim with a measurement attached rather than a picture.
 *
 * WHAT IS DELIBERATELY NOT DELEGATED, and why each one would be a silent error:
 *
 *   THE FAST PATHS. `walk`, `facing`, `step`, `swap`, `reset`, `gated`, `eachLocal` are
 *   the host's answers over `loose` — Layer 1's points. Offering them here would run
 *   Layer 2's rules over Layer 1's world while claiming to run them over the interior,
 *   and `swap`/`reset` are worse than wrong: they exchange WHOLE COLUMNS, so both layers
 *   doing ARRIVAL would swap every ray in the store twice. They are absent, so
 *   `forEachMatch` falls back to the general walk — which is this iterator, and which is
 *   correct at the cost of being slower.
 *
 *   THE RANDOM STREAM. Shared, the layer above shifts the layer below's draws and
 *   `slotUniformRng` stops meaning anything: the guarantee that one seed run twice
 *   differs only by what was put in it is exactly what a second consumer breaks.
 *
 *   THE STATISTICS. Shared, Layer 2's annihilations and deflections land in the counters
 *   every Layer 1 measurement in this book reads.
 *
 * WHAT IS SHARED, AND IS THE COUPLING RATHER THAN AN OVERSIGHT: the REWRITE. A folded
 * point's rays are still linked to the points it was joined to, so a ray of Layer 2 can
 * step into Layer 1, and Layer 2's own (G/2) hands a point back out of containment —
 * `unfold` puts it in `loose` again, which is the interior giving space back to the
 * world. That is the local interaction between the two, it is structural rather than
 * declared, and it is the first thing to measure rather than the first thing to trust.
 */
export class Inside implements Backend {
  /** Layer 2's own events, so the layer below's counters stay its own */
  readonly stats: Stats =
    { annihilations: 0, folded: 0, created: 0, deflections: 0, blocked: 0 };

  /** and its own stream, for the reason in the header */
  private readonly draw: () => number;

  /**
   * THE WORLD THIS IS LAID DOWN FOR — THE LAYER'S OWN, and it must not be the host's.
   *
   * A rule quantified over `"World"` is handed `backend.world` and then reaches back
   * through `w.backend`. Set to the host's world, that round trip lands on the HOST's
   * store: MOVEMENT and ARRIVAL are both `"World"` rules, so the layer above ran them
   * over every ray of the layer below while claiming to run them over the interior.
   * Measured, it was the whole of why Layer 1's behaviour moved when the layer was
   * added. Left undefined here, `Theory.seed` fills it with the layer's own world.
   *
   * The layer's world is given the host's LATTICE CONSTANTS at seed time — an interior
   * is made of points of the lattice below and has no geometry of its own to have.
   */
  world: any;

  constructor(private readonly host: Backend, seed = 0x9e3779b9) {
    let s = (seed ^ 0x6d2b79f5) >>> 0;
    this.draw = () => {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ─── the one thing that differs: WHICH points are points ─────────────── */

  *[Symbol.iterator](): Iterator<Local> {
    const h = this.host as any;
    if (!h.eachFolded) return;
    /* collected rather than yielded lazily, for the reason `forEachMatch` copies the
     * locals: Layer 2's own (G/2) folds and unfolds while the pass is running, and a
     * lazy walk would hand a rule the points that pass had just made or given away */
    const out: Local[] = [];
    h.eachFolded((l: Local) => out.push(l));
    yield* out;
  }

  size(): number {
    const h = this.host as any;
    return h.foldedSize ? h.foldedSize() : 0;
  }

  /** what the STORE is holding is the host's business; what this has is `size` */
  stored(): number { return this.host.stored?.() ?? this.host.size(); }

  /* ─── and everything else is the host, because it is the same store ───── */

  get rewrite(): Rewrite { return this.host.rewrite }
  get rng(): () => number { return this.draw }
  get bound(): number { return this.host.bound }
  get DEG(): number { return this.host.DEG }
  get grows(): boolean { return this.host.grows }
  get folds(): boolean { return this.host.folds }
  get removes(): boolean { return this.host.removes }
  get expands(): boolean { return this.host.expands }
  get carrying(): Carrying[] { return this.host.carrying }

  create(of: Ref): Ref2 { return this.host.create(of) }
  apply(op: Op): void { this.host.apply(op) }
  contain(child: Ref2, parent?: Ref2): void { this.host.contain?.(child, parent) }
  linkEnds(a: Boundary, b?: Boundary): void { this.host.linkEnds?.(a, b) }
  parent(ref: Ref2): Ref2 | undefined { return this.host.parent(ref) }
  children(ref: Ref2): Ref2[] { return this.host.children(ref) }
  target(b: Boundary): Boundary | undefined { return this.host.target(b) }

  /*
   * THE CHEAP WALKS BELOW A POINT ARE SAFE TO DELEGATE and the ones OVER the world are
   * not — see the header. `walk`/`some`/`first`/`across` are asked ABOUT a ref that has
   * already been handed over by the iterator above, so they answer about the interior's
   * own points; `eachLocal`, `facing`, `step`, `swap`, `reset` and `gated` are asked
   * about the world and would answer about Layer 1's.
   */
  walk(child: Ref, parent: Ref2, f: (x: any) => void): void {
    const h = this.host as any;
    if (h.walk) return h.walk(child, parent, f);
    for (const x of this.children(parent)) f(x);
  }
  some(child: Ref, parent: Ref2, f: (x: any) => boolean): boolean {
    const h = this.host as any;
    return h.some ? h.some(child, parent, f) : this.children(parent).some(f);
  }
  first(child: Ref, parent: Ref2): Ref2 | undefined {
    const h = this.host as any;
    return h.first ? h.first(child, parent) : this.children(parent)[0];
  }
  across(r: Ref2, bounced: boolean): Ref2 | undefined {
    const h = this.host as any;
    return h.across ? h.across(r, bounced) : undefined;
  }

  /**
   * WHERE THE POINTS ARE, WHICH AN INTERIOR CANNOT SAY IN COORDINATES. The host places
   * points of the LATTICE; a folded point has left it. What it can still say is how far
   * one is from another along the links that survived the fold, which is what `sample`
   * has always meant on a graph.
   */
  sample(accuracy?: number, from?: Local): Sample[] {
    const first = from ?? [...this][0];
    return first ? this.host.sample(accuracy, first) : [];
  }
}
