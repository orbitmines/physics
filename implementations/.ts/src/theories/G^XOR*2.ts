import { across } from "../lib/Local.ts";
import { forEachMatch, method } from "../lib/Theory.ts";
import { G_XOR } from "./G^XOR.ts";

/**
 * LAYER 2: MATTER — the same XOR, running on the space Layer 1 folded away, on a budget.
 *
 * TWO XORs AT TWO LEVELS OF DESCRIPTION, and the second one gets a SPACE rather than a
 * decoration. What stood here before declared a per-ray `phase` on Layer 1's rays and
 * advanced it one ring step per deflection. Three things were wrong with that:
 *
 *   A TURN IS A HALF-TURN. (G+M/3) sets `bounced` and MOVEMENT reads it through
 *   `across(r, bounced)` = `opposite(r)`, a REVERSAL. `DEFLECT` says so outright — "a
 *   meeting is ON THE EDGE, so the two rays are ±d̂ and a half-turn is the only turn
 *   there is" — and `DEFLECT.spin`, the one-step rotation, is `unbuilt`. A deflection
 *   moves a ring coordinate by CYCLE/2, never by one.
 *
 *   THERE IS NO RING ON THE LATTICE THE MODEL RUNS ON. The ring numbers the SEEDED box's
 *   exits; the dynamics runs on a graph and reaches neighbours through links, so a ray
 *   has no exit index to read a position off. And every alike meeting calls `insert`,
 *   which makes a point with TWO rays — the event said to advance the phase manufactures
 *   points with no equator.
 *
 *   A Z/2 LABEL CANNOT BE THE SECOND XOR. Under a half-turn the most the turning
 *   mechanism can hand on is the parity of how often a ray reversed — the same shape as
 *   the polarity Layer 1 already carries, AND a function of Layer 1's own collision
 *   history. Two XORs need two INDEPENDENT two-valued things.
 *
 * SO LAYER 2 IS GIVEN THE ONE INTERIOR THIS MODEL ALREADY HAS. (G/1) does not delete the
 * point it destroys — it ends in `here.fold(there)`, and a fold CONTAINS: the point
 * leaves `loose`, stays in `live`, and keeps its rays, its links and its columns. Every
 * annihilation ever run in this book has been filling that set and nothing has read it;
 * gravity takes the count as `density` and asks no more. `Inside` iterates it, so THE
 * SPACE GRAVITY DESTROYS IS THE MATERIAL MATTER IS MADE OF, and Layer 2 does not restate
 * Layer 1's rules — it IS Layer 1's theory, running on points that are no longer points
 * of the world.
 *
 * AND WITHOUT A BUDGET IT IS A PUMP RATHER THAN A STRUCTURE, which is measured and is why
 * the rest of this file exists. Run plain, Layer 2's (G/2) fires on every neutral point of
 * the interior every tick, and (G/2) is `unfold` — it hands contained points straight back
 * to `loose`. Measured at N=15 over 60 ticks with no sources: Layer 1 alone eats itself
 * down to 247 points and stalls; with Layer 2 running it holds 3297 and its annihilations
 * go on climbing, and removing Layer 2's CREATION alone puts it back to 617. The interior
 * was emptying itself as fast as annihilation filled it, and nothing ever stayed lit in it
 * — `L2 active rays = 0` at every sample.
 *
 * THE BUDGET IS THE ONE ACTION A TICK, AND `phase` IS WHAT SPENDING IT ON ITSELF MEANS.
 * "A structure gets one action per tick. It can spend it moving through the lattice or
 * walking its own graph, and not both — and walking its own graph is its clock." That
 * sentence is already in `G.ts` as `upkeep`/`share`, where it has only ever incremented a
 * counter. Here it decides: a point of the interior that spends its action on itself
 * advances its own phase and does NOT expand that tick. So the phase is the internal
 * update rather than a quantity beside it, it is a property of the STRUCTURE and not of
 * `tick`, and two structures paying different upkeep run at different rates — which is
 * what mass has to be for `1 = m + v + u` to be a tradeoff rather than a sum.
 *
 * IT IS SAID THROUGH `blocks`, WHICH IS THE SANCTIONED HOOK AND NOT A NEW RULE. `G.ts`
 * describes it as "the only way to say it without giving Layer 2 a rule Layer 1 has not
 * got". The predicate asks two things — is this point in the interior at all, and did it
 * spend its action on itself — so a loose point of Layer 1 is never blocked by it, and a
 * point that has been handed back out of the interior stops being blocked the moment it
 * leaves. Layer 1's (G/2) is untouched.
 *
 * ONE TICK OF OFFSET, SAID PLAINLY: a rule added to a theory appends, so UPDATE runs after
 * ANNIHILATION and the flag it sets is read by the NEXT tick's CREATION. Since the budget
 * accrues every tick the steady state is the same; it is a phase of one tick in when the
 * refusal lands, not a difference in how often it does.
 *
 * AND THE INTERIOR IS GIVEN AN EDGE, WHICH IS WHAT LETS ANYTHING STAY IN IT. A fold does
 * not touch a point's links, so a point of the interior is still wired to the loose points
 * it was joined to and `across` walks straight out of it. Run that way the interior is
 * transparent: everything Layer 2 lights leaves on its next step and `L2 active rays` is
 * nought at every sample, however the budget is set. A layer with no boundary has no
 * inside, and nothing can be bound in it.
 *
 * SO A RAY THAT WOULD LEAVE THE INTERIOR TURNS BACK INSTEAD, at the rate `escape` says.
 * That is a statement about LAYER 2'S SPACE and not a new mechanism: it is the same
 * half-turn (G+M/3) already makes, asked at the edge of the interior rather than at a
 * meeting, and it is the only rule of Layer 1's that this layer restates. What escapes
 * instead of turning is RADIATION — emission as something the structure loses at its
 * surface, rather than a rate a `Source` was handed — and at `escape` = 0 the interior
 * is closed and loses nothing.
 *
 * WHAT IS NOT DONE YET: `Source` still exists on Layer 1 and has not been abolished;
 * only expansion is on the budget, not travel; nothing yet reads a WINDING off the phase,
 * which is what charge would have to be; and the interior's components are not identified,
 * so every point pays the same upkeep and there is no per-structure mass.
 */

/** the scale on the per-point rate below — the world's only say in it */
const UPKEEP = 1;

/**
 * WHAT ONE POINT OF THE INTERIOR SPENDS ON ITSELF — READ OFF THE POINT, NOT THE WORLD.
 *
 * A WORLD-WIDE RATE IS THE GLOBAL CLOCK AGAIN, and it was measured being one: at a
 * uniform rate of 1 every point of the interior pays every tick, so every point advances
 * in lockstep and `phase` comes out `tick mod CYCLE` — 2,971 of 3,001 points sitting on
 * the same value at t=60. A phase that is the same everywhere is not a property of a
 * structure, and mass that is the same everywhere is not mass.
 *
 * SO IT COMES OFF `density`, WHICH IS ALREADY WHAT A POINT HOLDS. (G/1) folds the point
 * it destroys into the survivor and `Rewrite.fold` counts it — `density` is exactly how
 * many points this one now stands for, which on the reading this layer is built on is
 * HOW MUCH MATTER IS AT IT. A point standing only for itself has nothing to run and pays
 * nothing, so it behaves as vacuum does; one that has absorbed k others pays k, and pays
 * it out of the same single action it would otherwise move or expand with.
 *
 * WHICH WAY ROUND IS A REAL QUESTION AND THIS IS ONE ANSWER. Read as here, a heavier
 * point spends its action on itself more often, so it expands and travels less — the
 * sense `inertia` already has in `G`, where a heavy thing needs more pushed through it to
 * go the same distance. The other reading is that a bigger internal graph takes MORE
 * steps to come round, so a heavy structure's clock runs SLOWER — time dilation rather
 * than inertia. They are different theories and this one is not yet an argument that it
 * is the right one; it is the one with a per-point quantity already under it.
 */
const rate = (l: any): number => {
  const scale = l.world?.interior ?? 0;
  if (scale <= 0) return 0;
  return scale * ((l.density ?? 1) - 1);
};

/**
 * A POINT OF THE INTERIOR THAT IS WALKING ITSELF THIS TICK, and nothing else.
 *
 * ASKED OF THE CONTAINMENT AND NOT ONLY OF THE FLAG, because the flag is a column on a
 * shared pool: a point handed back out of the interior by (G/2) keeps whatever was last
 * written to it, and without the first clause it would go on refusing to split as a
 * perfectly ordinary point of Layer 1's world.
 */
const walking = (l: any) => l.walking === true && l.backend?.parent?.(l) !== undefined;

/**
 * THE ONE ACTION, SPENT — the whole of `u`, and the only rule this layer adds.
 *
 * `owed` accrues the upkeep and is spent a whole action at a time, so a point that cannot
 * afford its clock every tick runs it RARELY rather than never — a duty cycle arrived at
 * from the budget instead of imposed, which is the same reading `TRANSPORT` gives motion.
 * Where the geometry has no ring there is nothing for the clock to count and the phase
 * stays absent; the action is still spent, because having nowhere to put a phase is not
 * the same as having nothing to do.
 */
/** is this ray at a point that is still inside the interior? */
const within = (b: any, r: any): boolean => {
  const l = r?.l;
  return l !== undefined && b.parent(l) !== undefined;
};

const MATTER = G_XOR.copy()
  .called("MATTER")

  /**
   * (STREAM) AT THE INTERIOR'S EDGE — G's MOVEMENT, with one question added.
   *
   * Everything here is the rule it overrides: every active ray steps one cell along its
   * own exit and takes what it carries with it. The addition is the two lines that ask
   * whether the step LEAVES, and turn it back if it does. The fast path is deliberately
   * not taken — `b.step` would walk the store's own ray index, which is Layer 1's, and
   * `Inside` does not offer one for that reason.
   */
  .rule("MOVEMENT", "World", (w: any) => {
    const b = w.backend;
    const escape = w.below?.escape ?? 0;
    const carrying = b.carrying;
    forEachMatch(b, "Ray", (r: any) => {
      if (!r.active) return;
      let to = across(r, r.bounced);
      /*
       * IT WOULD LEAVE. Either it is let go — which is what radiating is, and it is then
       * Layer 1's ray and Layer 1's ARRIVAL that picks it up — or it turns back, which is
       * `across` asked the other way round and is the same half-turn a meeting makes.
       */
      if (to !== undefined && !within(b, to)) {
        if (b.rng() >= escape) {
          to = across(r, !r.bounced);
          if (to !== undefined && !within(b, to)) to = undefined;
        }
      }
      /* nothing on the far side at all: a bounded edge, and the ray goes out there —
       * `G`'s `offEdge` grows the world instead, which an interior may not do */
      if (to === undefined) return;
      to.arriving = true;
      for (let i = 0; i < carrying.length; i++)
        carrying[i].writeWaiting(to, carrying[i].read(r));
    });
  })
  .decorate.Local<{ owed: number; walking: boolean; phase: number }>(() => ({
    owed: 0,
    walking: false,
    phase: 0,
  }))
  .rule("UPDATE", "Local", (l: any) => {
    const r = rate(l);
    if (r <= 0) { l.walking = false; return; }
    l.owed += r;
    if (l.owed < 1) { l.walking = false; return; }
    l.owed -= 1;
    l.walking = true;
    const CYCLE = l.world?.geometry?.CYCLE ?? 0;
    if (CYCLE) l.phase = (l.phase + 1) % CYCLE;
  });

export const G_XOR_2 = G_XOR.copy()
  .called("G^XOR*2")
  /** the interior's own budget knob — deliberately NOT `upkeep`, which `TRANSPORT`
   *  already spends on moving a source and which would change what a body does */
  .decorate.World<{ interior: number; escape: number }>(() => ({
    /** the SCALE on each point's own rate — see `rate`, which reads `density` */
    interior: UPKEEP,
    /** how much of what reaches the interior's surface leaves it — the radiated share */
    escape: 0,
  }))
  .decorate.World(() => ({ blocks: method(walking) }))
  .layer.inside("MATTER", MATTER);
