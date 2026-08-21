import { Geometry } from "../lib/Local.ts"
import { G } from "./G.ts"

/**
 * `pure`'s simplification: every arriving charge destroyed and remade ROUND-ROBIN.
 *
 * It gives the right static 1/r and is THE ONLY RULE IN THIS BOOK THAT DOES NOT
 * CONSERVE MOMENTUM, so nothing about propagation may be run on it. It is kept, and
 * flagged, because it is what the gravity arc's static results were measured with.
 *
 * THE COUNTER IS THE BOX'S AND NOT THE POINT'S, which is the whole of "round-robin".
 * Dealing from a counter that restarts at every point puts every local's k charges into
 * the SAME first k exits, every point, every tick — a standing bias down one set of
 * lattice directions in a rule whose only defence is that it is unbiased. The counter
 * carries across the box, so which exits a point is dealt depends on where the deal had
 * got to, and over a box that is flat. Hence a rule of the WORLD.
 *
 * AND (G/1) IS GONE RATHER THAN EMPTY. A limit is reached by REMOVING an event, not by
 * redefining it to do nothing: an annihilation that happens and has no effect is a
 * different and false claim, and it still costs a full match enumeration to say so.
 */
export const G_PURE = G.copy()
  .called("G^PURE")
  .without("ANNIHILATION")
  /* remake destroys nothing, it redeals — so nothing is removed and the box fills */
  .decorate.World<{ vacuum: number | null }>(() => ({ vacuum: 1 }))

  .rule("REMAKE", "World", (w: any) => {
    const g: Geometry = w.geometry;
    let slot = 0;
    for (const l of w.backend as Iterable<any>) {
      if (l.source) continue;
      const rays = l.rays;
      let on = 0;
      for (const r of rays) if (r.active) on++;
      if (!on) continue;
      /* k in, k out, round-robin. DESTROYS MOMENTUM — static fields only. */
      for (const r of rays) r.active = false;
      for (let i = 0; i < on; i++) {
        const r = rays[slot % g.DEG];
        if (r) r.active = true;
        slot++;
      }
    }
  });
