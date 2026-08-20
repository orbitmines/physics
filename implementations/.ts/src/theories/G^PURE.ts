import { G } from "./G.ts"

/**
 * `pure`'s simplification: every arriving charge destroyed and remade round-robin.
 *
 * It gives the right static 1/r and is THE ONLY RULE IN THIS BOOK THAT DOES NOT
 * CONSERVE MOMENTUM, so nothing about propagation may be run on it. It is kept, and
 * flagged, because it is what the gravity arc's static results were measured with.
 */
export const G_PURE = G.copy()
  .rule("ANNIHILATION", ["Boundary", "Boundary"], () => { /* nothing is destroyed here */ })

  .rule("REMAKE", "Local", (l) => {
    if (l.source) return;
    const on = l.rays.filter(r => r.active).length;
    if (!on) return;
    /* k in, k out, round-robin. DESTROYS MOMENTUM — static fields only. */
    for (const r of l.rays) r.active = false;
    for (let i = 0; i < on && i < l.rays.length; i++) l.rays[i].active = true;
  });
