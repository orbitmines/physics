import { Vec } from "../lib/Local.ts"
import { acting } from "../lib/Source.ts"
import { G_XOR } from "./G^XOR.ts"

/**
 * THE STRAND READING: one more label on a ray — what its emitter was doing when it
 * left. It is what makes a magnetic field, and it costs no new state on the lattice.
 *
 * `fork` established that a ray carrying only a polarity and a heading offers no local
 * pseudovector for a one-polarity source; this is the one more thing it needs, and it
 * is the emitter's velocity, axis times rate.
 *
 * IT IS ONE LINE AND IT DELETES NOTHING. This theory used to override MOVEMENT, ARRIVAL
 * and EMISSION to carry the label — and since a rule is replaced by name, its EMISSION
 * replaced the one that absorbs and emits at all. Measured, six ticks on a 7³ box: 225
 * arrivals under `G^XOR` and 0 here, with the labels landing on rays nothing had lit.
 * A label changes what a ray CARRIES, and `carries` is where that is said.
 */
export const G_LABELLED = G_XOR.copy()
  .called("G^LABELLED")
  .carries<"label", Vec | null>("label", null)

  .rule("EMISSION", "Local", (l) => {
    const s = l.source;
    if (!s) return;
    (G_XOR.rules.EMISSION as any).exec(l);
    if (!acting(s, l.world.ticks)) return;
    /* the emitter's velocity, carried per ray — the whole of what makes a B field */
    for (const r of l.rays) if (r.active && r.from === s.id) r.label = s.u.length ? s.u : null;
  }, "source");
