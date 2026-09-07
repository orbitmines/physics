/**
 * THE DETERMINISTIC READING - kept HERE, beside the one panel that draws it, rather than
 * in `theories/`.
 *
 * `theories/` is what the model IS, and what the theorem prover and the discovery sweep
 * range over: G, G^XOR, G^XOR*2, and G^CONSERVING as the null control. This is none of
 * those. It is `G` with both events taken out and the vacuum's coin replaced by a phase,
 * and it exists so that one figure is legible - the stochastic vacuum's shortfall is
 * real and is nearly unreadable, three sigma after two thousand ticks.
 *
 * SO IT IS A DRAWING AID AND IS FILED AS ONE. Left in `theories/` it read as a fifth
 * physics to be compared with the others, and a sweep would have swept it. Beside the
 * panel it is obviously what it is: the same mechanism with the static taken out, so a
 * reader can see the shape of a thing the honest picture only hints at.
 */
import { Geometry } from "../lib/Local.ts"
import { G } from "../theories/G.ts"

/**
 * THE ORDER THE EXITS ARE WALKED IN — the ring where the ring is the whole of it.
 *
 * Cached per geometry: it is a property of the lattice, and re-sorting the equator
 * once per point per tick would be paying for it fourteen thousand times over.
 */
const orders = new Map<Geometry, number[]>();
const around = (g: Geometry): number[] => {
  let hit = orders.get(g);
  if (!hit) orders.set(g, hit = g.RING.length === g.DEG
    ? g.RING.slice()
    : Array.from({ length: g.DEG }, (_, d) => d));
  return hit;
};

/**
 * (G/1) AND (G/2) WITH THE DIE TAKEN OUT, and nothing else taken out.
 *
 * `G` runs the stochastic vacuum: (G/2) fires on a coin, so the shortfall a body
 * casts has to be dug out of shot noise by averaging over hundreds of ticks. That is
 * the honest picture and it is nearly unreadable — at one tick the force is invisible,
 * and at two thousand the arrow is still only three sigma.
 *
 * WHY THE DIE IS WHAT HAD TO GO, and not the discreteness. Measured, the stochastic
 * vacuum's shortfall dies inside four cells whatever else is changed: at creation
 * rates from 0.20 down to 0.002 the ray lifetime rises from 1.6 ticks to 19.1 and the
 * deficit STILL vanishes by r ≈ 6–9. It is not lifetime that limits the reach, it is
 * that (G/2) is a local ISOTROPIC source — every tick it injects fresh rays carrying
 * no news of the body, so the shadow is diluted as fast as it spreads. Take the
 * creation away and every ray traces back to the initial condition, so every ray
 * carries the shadow, and the front goes out at c̄ and keeps going.
 *
 * WHAT IS STILL WHOLE. The rays are still whole rays — one ray per exit, one thing or
 * no things — and a point still hands on exactly what it received. There is no third
 * of a ray on this lattice and no occupancy fraction anywhere: a version of this that
 * carried a Float64 and handed each neighbour `q/DEG` would be the CONTINUUM limit,
 * which is a different theory that happens to draw a similar picture.
 *
 * WHAT REPLACES THE COIN is the phase. A point holding k rays sends them down k
 * CONSECUTIVE exits starting from where it left off, then advances by k. Over a few
 * ticks that spreads them evenly in every direction without anything being drawn at
 * random — which is the whole trick, because randomness is exactly what the stochastic
 * theories have to average away.
 *
 * CONSECUTIVE IN WHAT ORDER is a question about the lattice and not about this rule,
 * so it is asked of the lattice: where the geometry's RING is a cycle through every
 * exit it is used, and consecutive then means NEXT ONE ROUND, which is what makes a
 * partial handful of rays leave a point evenly rather than as a beam. Where the ring
 * is only the equator — every 3D lattice here — there is no such cycle to borrow and
 * the exits are taken in the order the geometry declares them. That is a weaker
 * ordering and it is said out loud rather than hidden: on those lattices the spread
 * is even over a full turn of the phase but not within one tick.
 *
 * NOTHING IS CREATED AND NOTHING IS ANNIHILATED HERE. Both events are TAKEN OUT
 * rather than emptied — `without`, not a rule with no body — so the only sink left in
 * the world is a body: what a source absorbs is the momentum handed to it, and that
 * is the force, exactly, with no common mode to subtract. A world with no vacuum
 * source is not a world this theory can grow: it is the DETERMINISTIC LIMIT of one,
 * run from a full lattice as its initial condition.
 */
export const G_DETERMINISTIC = G.copy()
  /** which exit the next ray goes out of — the whole of what replaces the coin */
  .decorate.Local<{ phase: number }>(() => ({ phase: 0 }))

  /* the die, gone: with no (G/2) every ray traces back to the initial condition */
  .without("CREATION")

  /* and with no (G/1) the only sink in the world is a body */
  .without("ANNIHILATION")

  /**
   * k IN, k OUT, DOWN k CONSECUTIVE EXITS. Run after ARRIVAL, so what is redistributed
   * is precisely what this point was handed; MOVEMENT then carries it on next tick.
   *
   * A body is exempt — it holds what reaches it until (G/EMISSION) counts it and
   * clears it, which is what absorbing means.
   */
  .rule("SPREAD", "Local", (l) => {
    if (l.source) return;
    const rays = l.rays, DEG = rays.length;
    let k = 0;
    for (const r of rays) if (r.active) k++;
    if (!k) return;
    const o = around(l.world.geometry);
    const p = l.phase;
    for (const r of rays) r.active = false;
    for (let j = 0; j < k; j++) rays[o[(p + j) % DEG]].active = true;
    l.phase = (p + k) % DEG;
  });
