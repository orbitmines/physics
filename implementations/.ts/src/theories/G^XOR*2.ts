import { Theory } from "../lib/Theory.ts";
import { G_LABELLED } from "./G^LABELLED.ts";

/**
 * LAYER 2: THE RING'S PHASE, which is what a gate acts on and what interference is.
 *
 * It is the labelled reading with a per-ray phase, and the phase is A POSITION ON THE
 * EQUATORIAL RING rather than a free number — the ring is the only thing on this
 * lattice carrying a cyclic order, so it is the only place a phase can live. SPIN =
 * 360/CYCLE is one step of it, which is why a turn advances the phase by exactly one.
 *
 * IT IS A MERGED LAYER, and that is the whole point of the construction rather than a
 * detail: Layer 2 does not get its own space. It decorates the rays Layer 1 already
 * has, so a gate acts on the same ray that carries the charge, and the two layers
 * cannot drift apart because there is only one lattice under both. The phase is
 * declared on Layer 2 and MOVED by Layer 1's MOVEMENT — see `Theory.carrying` — which
 * is the merge itself and not a convenience.
 *
 * A GEOMETRY WITH NO EQUATOR HAS NO LAYER 2 AT ALL. On bcc-8 CYCLE is nought, so
 * there is no ring to put a phase on — the article's "one genuine exclusion", which
 * falls out of the construction here rather than being asserted beside it.
 */
export const PHASE = new Theory()
  .called("PHASE")
  /** where on the ring this ray is, in steps — absent where there is no ring */
  .carries<"phase", number | undefined>("phase", undefined)

  /**
   * A TURN IS ONE STEP OF THE RING, AND THE PHASE IS WHAT COUNTS IT.
   *
   * SPIN = 360/CYCLE is a statement about the ring, so a ray that has turned has moved
   * one step along it — and the phase is that step, modulo the cycle. Where the
   * geometry has no equator there is nothing to advance and the phase stays absent,
   * which is bcc-8 having no Layer 2 rather than a Layer 2 that does nothing.
   */
  .rule("PHASE", "Ray", (r: any) => {
    if (!r.bounced) return;
    const CYCLE = r.l?.world?.geometry?.CYCLE ?? 0;
    if (!CYCLE) return;
    r.phase = ((r.phase ?? 0) + 1) % CYCLE;
  });

export const G_XOR_2 = G_LABELLED.copy()
  .called("G^XOR*2")
  .layer.merged("PHASE", PHASE);
