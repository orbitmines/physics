import { outward } from "../lib/Local.ts";
import { method } from "../lib/Theory.ts";
import { withRelaxation } from "./G.ts";
import { G_XOR } from "./G^XOR.ts";
import { G_XOR_XOR } from "./G^XOR+XOR.ts";

/**
 * MATTER, IN LAYER 1 — no second layer, no second store, no mirror.
 *
 * THIS USED TO BE A LAYER ABOVE. `G^XOR` gives a boundary ONE sign, so a second one had
 * to come from somewhere, and the somewhere was a level up: an interior made of the points
 * (G/1) had folded away, running the same rules on them, with charge reconstructed from a
 * tally of the ± pairs each fold had buried. That bought a second sign at the price of a
 * second space, a mirror kept in step with the first, a budget, a surface and a crossing
 * every quantity had to survive.
 *
 * `G^XOR+XOR` PUTS THE SECOND SIGN ON THE SAME BOUNDARY, so none of that is needed. A
 * boundary carries `polarity` and `charge`: the polarity decides what happens when two
 * rays meet, the charge decides which way a ray points. Electromagnetism is then one layer
 * with two signs rather than two layers with one each, and the layer above has nothing
 * left that only it could do.
 *
 * WHAT SURVIVES IS THE READING, WHICH WAS NEVER ABOUT LAYERS. (G/1) does not delete the
 * point it destroys — it FOLDS it, and a fold contains: the point leaves `loose`, keeps
 * its rays and its links, and is still there. THE SPACE GRAVITY DESTROYS IS THE MATERIAL
 * MATTER IS MADE OF, and that is true of this store, in place, with no mirror of it. A
 * structure is a connected component of what has been folded; its mass is how many points
 * it holds; and what it does is read off the same graph everything else is read off.
 */

/** how much of its one action a point of matter spends on its own clock */
const UPKEEP = 1;

/**
 * THE STRUCTURES: connected components of what has been folded away.
 *
 * Walked over the folded set and through the links those points still carry, which is the
 * whole of what makes them a graph rather than a tally. A point folded INTO another is a
 * point of a deeper interior — Layer 2's own (G/1) folding, which is what a composite
 * would be — and is not one of these.
 */
export type Structure = {
  id: number; mass: number; points: any[];
  /** what it has absorbed less what it has emitted, in lattice coordinates */
  p: number[];
};

export const structuresOf = (b: any, D: number): Map<number, Structure> => {
  const inside = new Set<number>();
  b.eachFolded?.((l: any) => inside.add(l.i));
  const seen = new Set<number>();
  const out = new Map<number, Structure>();
  b.eachFolded?.((start: any) => {
    if (seen.has(start.i)) return;
    const points: any[] = [];
    const stack = [start];
    seen.add(start.i);
    while (stack.length) {
      const x = stack.pop();
      points.push(x);
      for (const r of x.rays as any[]) {
        const there: any = outward(r)?.target?.source?.l;
        if (!there || !inside.has(there.i) || seen.has(there.i)) continue;
        /* not into what THIS matter has itself folded — that is a level further down */
        if (b.parent(there) !== undefined && !inside.has(there.i)) continue;
        seen.add(there.i);
        stack.push(there);
      }
    }
    let id = Infinity;
    for (const x of points) if (x.i < id) id = x.i;
    for (const x of points) { (x as any).part = id; (x as any).mass = points.length; }
    out.set(id, { id, mass: points.length, points, p: new Array(D).fill(0) });
  });
  return out;
};

/**
 * (MATTER) WHAT A STRUCTURE DOES WITH ITS ONE ACTION.
 *
 * "A structure gets one action per tick. It can spend it moving through the lattice or
 * walking its own graph, and not both." Here that is one rule, quantified over the WORLD
 * because a structure is every point it holds at once: it reads one thing, decides once,
 * and its points go together or not at all.
 *
 * AND ITS MOMENTUM IS WHAT IT TOOK IN LESS WHAT IT PUT OUT, which is `TRANSPORT`'s own
 * bookkeeping and the only reading that conserves anything. Nothing samples a field and
 * nothing is told where to go: a ray that arrives is a ray whose direction the structure
 * now has, and a ray it lets go is one it no longer has.
 *
 * WHICH IS WHY GRAVITY CURVES IT. Matter is in the way of the expansion, so the vacuum is
 * thinner where matter is. A structure therefore takes IN fewer rays from the side its
 * neighbour is on — and a ray taken in pushes along its own heading, away from where it
 * came from — so less push from that side is a net push TOWARDS it. The same asymmetry
 * runs the other way on what it EMITS: a ray let go into a thinner vacuum gets further
 * before it meets anything, and the recoil of letting it go is the other half of the
 * ledger. Both are counted here because both are real, and neither is a force term added
 * beside them.
 */
const MATTER = (t: any) => (t
  .decorate.Local(() => ({
    part: -1, mass: 1, owed: 0, walking: false,
    /*
     * WHAT THE STRUCTURE THIS POINT BELONGS TO HAS TAKEN IN LESS WHAT IT HAS LET GO,
     * WRITTEN ON THE POINT. Held in a map keyed by the structure's id it was unreadable:
     * the id is the lowest index in the component and is recomputed every tick, so
     * anything looking a momentum up by the id it saw last tick found nothing — measured,
     * the ledger was consulted at 0 of 28,972 points holding matter. On the point it is
     * where the point is.
     */
    mom: null as number[] | null,
  })) as any)

  .rule("MATTER", "World", (w: any) => {
    const b = w.backend, g = w.geometry, D = g.D as number;
    if (!b.eachFolded) return;
    const parts = structuresOf(b, D);
    if (!parts.size) return;

    /* where each of them is held, so the ledger below is per structure */
    const at = new Map<number, any[]>();
    for (const s of parts.values()) {
      const hosts: any[] = [];
      for (const x of s.points) {
        const h = b.parent(x);
        if (h) hosts.push(h);
      }
      at.set(s.id, hosts);
    }

    for (const s of parts.values()) {
      const hosts = at.get(s.id) ?? [];
      if (!hosts.length) continue;

      /*
       * THE LEDGER IS NOT KEPT HERE. Momentum crosses when a ray is TAKEN IN, which is an
       * event and happens in MOVEMENT — see the interception there. Read off the standing
       * state instead, it integrated the same rays every tick and matter came out holding
       * ten times the vacuum's whole momentum. What is left for this rule is what to do
       * with what the structure has.
       */
      const p = (s.points[0] as any).mom;
      if (!p) continue;
      w.ledger = (w.ledger ?? 0) + 1;
      /*
       * AND THE ONE ACTION IS SPENT ON WHICHEVER IT HAS MOST NEARLY EARNED. Walking its
       * own graph costs its mass — a bigger structure takes longer to come round — and
       * moving costs its mass too, which is what `inertia` already means in `G`. A
       * structure that cannot afford either this tick keeps what it has and tries again,
       * so a slow thing moves rarely rather than never.
       */
      const mass = Math.max(1, s.mass);
      s.p = p;
      for (const x of s.points) (x as any).mom = p;
      let best = -1, most = 0;
      for (let d = 0; d < g.DEG; d++) {
        let along = 0;
        for (let i = 0; i < D; i++) along += p[i] * (g.U[d][i] ?? 0);
        if (along > most) { most = along; best = d; }
      }
      const head = hosts[0];
      head.owed = (head.owed ?? 0) + (w.interior ?? 0);
      const walks = head.owed >= mass;
      if (best < 0 || most < (w.inertia ?? 1) * mass) {
        if (walks) { head.owed -= mass; for (const h of hosts) h.walking = true; }
        continue;
      }
      for (const h of hosts) h.walking = false;

      /*
       * IT MOVES BY BEING SOMEWHERE ELSE, which is all a region can do. A point of matter
       * is CONTAINED in a loose point, and that containment is where it is — so moving it
       * is re-containing it in the neighbour along the heading, and the space it stands
       * for goes with it or gravity would read the same matter in two places.
       */
      const moves: [any, any, any][] = [];
      let torn = false;
      for (let k = 0; k < s.points.length; k++) {
        const from = hosts[k] ?? hosts[0];
        const ray = (from.rays as any[])[best];
        const to: any = ray && outward(ray)?.target?.source?.l;
        if (!to || b.parent(to) !== undefined) { torn = true; break; }
        moves.push([s.points[k], from, to]);
      }
      if (torn) continue;
      for (const [x, from, to] of moves) {
        b.rewrite.fold(to, x);
        if (typeof from.density === "number" && from.density > 1) from.density--;
        if (typeof to.density === "number") to.density++;
      }
      for (let i = 0; i < D; i++) p[i] -= (g.V[best][i] ?? 0) * (w.inertia ?? 1) * mass;
      w.moved = (w.moved ?? 0) + 1;
    }
  });

/**
 * AND THE VACUUM THIS NEEDS UNDER IT.
 *
 * (G/2) fires only where a point is neutral and a point holding matter is not, so the one
 * rule that makes space is off exactly where space was destroyed — and nothing hands a
 * folded point back. Measured on fcc 12: the whole board resolves on tick 2 and the vacuum
 * then sits at 2-6% occupancy in a period-2 cycle with no meeting in it ever again. Matter
 * made of what annihilation folds away is then made of a set that stops growing after ten
 * ticks. With the inverse in, occupancy settles near 0.43 on its own and annihilation
 * never stops, so this is a precondition rather than a flavour.
 */
export const G_XOR_2 = MATTER(
  (withRelaxation(G_XOR_XOR, { above: 3, chance: 1 }) as typeof G_XOR)
    .called("G^XOR*2")

    .decorate.World<{ interior: number; moved: number; ledger: number }>(() => ({
      /** how much of its one action a structure spends walking its own graph */
      interior: UPKEEP,
      moved: 0,
      ledger: 0,
    }))

    /**
     * AND MATTER IS IN THE WAY OF THE EXPANSION, which is the gravity of this model: a
     * point holding a structure together is not free to split, so (G/2) fires less where
     * matter is and the deficit that leaves is the pull. Asked of ONE point and what is
     * contained in it, which is the only kind of question this coupling may put.
     */
    .decorate.World(() => ({
      /*
       * ASKED OF THE CONTAINMENT AND NOT OF A LABEL. This used to test `mass > 1`, and
       * `mass` is written by the census in MATTER — which runs LAST, so on the first tick
       * it is undefined and thereafter it is a tick stale. A point that is holding
       * something is holding it now, and `contained` says so without anybody having to
       * have written it down.
       */
      blocks: method((l: any) => ((l.backend?.contained?.(l) ?? []).length > 0)),
    })),
);
