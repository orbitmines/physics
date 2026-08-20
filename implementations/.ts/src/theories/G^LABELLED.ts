import { opposite, outward, Vec } from "../lib/Local.ts"
import { acting } from "../lib/Source.ts"
import { G_XOR } from "./G^XOR.ts"

/**
 * THE STRAND READING: one more label on a ray — what its emitter was doing when it
 * left. It is what makes a magnetic field, and it costs no new state on the lattice.
 *
 * `fork` established that a ray carrying only a polarity and a heading offers no local
 * pseudovector for a one-polarity source; this is the one more thing it needs, and it
 * is the emitter's velocity, axis times rate.
 */
export const G_LABELLED = G_XOR.copy()
  .decorate.Ray<{
    label?: Vec
    labelling?: Vec
  }>(self => ({}))

  /* as gravity+magnetism — a label changes what a ray CARRIES, not what survives a meeting */
  .rule("MOVEMENT", "Ray", (r) => {
    if (!r.active) return;
    const from = r.bounced ? opposite(r) : r;
    const facing = outward(from)?.target?.source;
    const to = facing && opposite(facing);
    if (!to) return;
    to.arriving = true;
    to.settling = r.polarity;
    to.labelling = r.label;
  })

  .rule("ARRIVAL", "Ray", (r) => {
    r.active = r.arriving === true;
    r.polarity = r.active ? r.settling : undefined;
    r.label = r.active ? r.labelling : undefined;
    r.arriving = undefined;
    r.settling = undefined;
    r.labelling = undefined;
    r.bounced = false;
  })

  .rule("EMISSION", "Local", (l) => {
    const s = l.source;
    if (!s || !acting(s, l.world.ticks)) return;
    /* the emitter's velocity, carried per ray — the whole of what makes a B field */
    for (const r of l.rays) r.label = s.u.length ? s.u : undefined;
  });
