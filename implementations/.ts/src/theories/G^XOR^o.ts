import { Geometry } from "../lib/Local.ts";
import { G_XOR_XOR } from "./G^XOR+XOR.ts";
import { Creation, made } from "./G^XOR^q.ts";

/**
 * MATTER AS A CLOSED ORBIT, AND NOTHING ELSE — no fold, no inside, no second space.
 *
 * WHAT THIS IS FOR. `G^XOR^c` says a particle is a charge bent round until its motion
 * closes, and then it FOLDS the points it turned at into matter — a second kind of thing,
 * living in a containment relation, needing its own mover, its own erosion, its own
 * suppression of the expansion, and a whole vocabulary (`contained`, `parent`, `blocks`,
 * `RELAXATION`) that the three rules underneath it never had. THIS THEORY TAKES THE FIRST
 * HALF AND REFUSES THE SECOND. The orbit is the particle. It is a trajectory on the one
 * graph everything else lives on, and there is nowhere else for it to be.
 *
 * SO A STRUCTURE IS A RAY THAT HAS COME BACK. `steer` turns a charge one ring step about the
 * local polarity field, in the sense of its charge, and counts the steps in `turned`. CYCLE
 * of them is once round — the ray is heading the way it set out, at a point it has been at.
 * That is a closed curve, it is carried BY the ray, and it needs no walk over the world to
 * find: `r.turned >= CYCLE` is a question about one ray, asked of the ray.
 *
 * AND IT MOVES BECAUSE THE ORBIT DRIFTS. A cyclotron orbit in a uniform field closes on
 * itself and goes nowhere; in a field with a gradient it drifts, which is what a moving
 * particle IS here. No rule moves it. Nothing decides it is a structure and re-contains it
 * somewhere. It goes where being bent takes it, at one cell a tick, like everything else.
 *
 * AND IT LASTS AS LONG AS THE TWO SIGNS PERMIT. A meeting with an opposite polarity
 * annihilates the ray and the orbit is over; a meeting with an alike one turns it, and the
 * orbit is deflected but survives. Nothing protects it and nothing is tuned to keep it
 * alive. Whether matter EXISTS in this reading is therefore a measurement rather than a
 * construction, and it is the measurement this file is for.
 *
 * WHAT IT COSTS, STATED HONESTLY BEFORE ANY OF IT IS RUN. `G^XOR+XOR` records that a lap has
 * never completed: "290,526 turns were taken and not one lap completed", because a ray has
 * to survive CYCLE ring steps and at this occupancy almost none do — meetings clear them
 * first. `G^XOR^c` folds at every CORNER rather than every lap for exactly that reason, and
 * its own note says the lap reading "is the better physics" and was set aside because it is
 * not reachable. THIS THEORY IS THE LAP READING TAKEN SERIOUSLY, and the first thing to
 * measure about it is whether anything closes at all. If nothing does, that is a result: it
 * says the vacuum is too dense for an orbit to survive its own circumference, and the number
 * to look at is the mean free path against CYCLE.
 *
 * WHAT IS DELIBERATELY ABSENT, EACH FOR A REASON:
 *
 *   no fold          matter is not made of destroyed space here. A corner leaves nothing
 *                    behind; the trajectory is the object
 *   no `blocks`      AND GRAVITY IS STILL HERE, which I first wrote down as the price of
 *                    this simplification and had backwards. `blocks` is how `G^XOR^c` says
 *                    a point holding a CONTAINER may not split. It is not what suppresses
 *                    the expansion; it is a second way of suppressing it, invented for a
 *                    second kind of thing. THE FIRST WAY IS IN (G/2) ITSELF: `if (l.source
 *                    || busy(l)) return` — A POINT CARRYING AN ACTIVE RAY DOES NOT SPLIT.
 *                    So a charge going round keeps the points of its orbit busy, tick after
 *                    tick, and the expansion that does not happen there is the deficit.
 *                    TURNING IS WHAT MAKES GRAVITY: a ray that goes straight is somewhere
 *                    else next tick and suppresses one split in passing, while a ray that
 *                    comes back round holds the same neighbourhood down again and again.
 *                    And a meeting FOLDS the two points into one and credits `destroyed`,
 *                    which is space destroyed outright. Both are (G/1) and (G/2) unchanged,
 *                    doing what they have always done
 *   no RELAXATION    nothing erodes a structure, because a structure is not a heap of
 *                    points that could be taken off one at a time
 *   no MOVING        an orbit already moves; a rule that moved it would be moving it twice
 *   no INSIDE        there is no inside. That is the whole point
 */
/**
 * (G^o/1) AND A CHARGE THAT IS BEING BENT SHINES — the recoil, and nothing else.
 *
 * A THING THAT TURNS RADIATES, because turning is acceleration and acceleration is the one
 * thing that makes a charge shine. Discretely: at the corner a ray goes out AGAINST the
 * heading it had, which is the recoil of being bent rather than the tangent it would have
 * flown off along. `G^XOR^c` measured both ways and the recoil is what meets its criteria.
 *
 * THIS IS `TURNING` WITH THE FOLD TAKEN OUT, and taking it out is the whole of this theory.
 * There, a corner threw off a ray AND folded a point into matter AND spent the forward ray;
 * the fold is what made matter a second kind of thing. Here the corner only shines. The ray
 * that was going forward carries on being steered — it is not spent, because nothing is
 * being paid for. Motion is not exchanged for mass; there is no mass to exchange it for,
 * only a trajectory that bends.
 *
 * AND WITHOUT IT THE TWO SIGNS HAVE NOTHING TO DO. `G^XOR^q` enumerates eighty-four ways a
 * corner could decide what it throws off, and every one of them is a rule about this moment.
 * A theory with no corner rule cannot be asked the question at all — the sweep would report
 * eighty-four identical vacuums. So this is also what makes the permutations measurable
 * here, and it is the same `made` the fold-based theory calls.
 *
 * IT CANNOT RUN AWAY, WHICH IS WHAT THE FOLD WAS DOING FOR FREE. `G^XOR^c` records a fire:
 * each turn threw off a ray, that ray could turn, and that turn threw off another — tick
 * time went 13ms to 719ms in six ticks. There the forward ray was SPENT to stop it. Here
 * nothing is spent, so the seat is only lit when it is EMPTY and a saturated corner is
 * counted rather than forced: the vacuum's own occupancy is the brake, and if that is not
 * enough the measurement will say so in `saturated`.
 */
export const G_XOR_O = G_XOR_XOR.copy()
  .called("G^XOR^o")
  .decorate.World(() => ({
    radiated: 0, saturated: 0, corners: 0, qMade: 0,
    /** WHAT A SIDEWAYS MEETING MAKES — null is the recoil inheriting what turned */
    creates: null as Creation | null,
  }))
  .rule("RADIATING", "World", (w: any) => {
    const g = w.geometry, b = w.backend;
    const log: any[] = w.turnLog ?? [];
    w.corners = (w.corners ?? 0) + log.length / 6;

    for (let i = 0; i < log.length; i += 6) {
      const l = log[i], d = log[i + 1];
      const netP = log[i + 4] as number, netQ = log[i + 5] as number;
      if (!l || b.parent(l) !== undefined) continue;      // gone since it turned
      const rays = l.rays as any[];
      const k = g.OPP[d];
      const seat = k !== undefined ? rays[k] : undefined;
      if (!seat) continue;
      if (seat.active) { w.saturated = (w.saturated ?? 0) + 1; continue; }
      const out = made(w.creates as Creation | undefined, rays[d], netP, netQ, b.rng);
      seat.active = true;
      seat.polarity = out.polarity;
      seat.charge = out.charge;
      w.radiated = (w.radiated ?? 0) + 1;
      if (w.creates && out.charge) w.qMade = (w.qMade ?? 0) + 1;
    }
    log.length = 0;
  });

/**
 * WHAT COUNTS AS A PARTICLE HERE — read off one ray, with no walk over anything.
 *
 * A ray that has taken CYCLE ring steps has been round once. Below that it is a charge being
 * bent; at or above it, it is an orbit that has closed and closed again. Nothing else in this
 * file decides what a structure is, because nothing else has to: the trajectory is carried.
 */
export const laps = (r: any, g: Geometry) =>
  g.CYCLE ? Math.floor((r.turned ?? 0) / g.CYCLE) : 0;

export const closed = (r: any, g: Geometry) => laps(r, g) >= 1;
