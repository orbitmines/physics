import { across } from "../lib/Local.ts";
import { clear, forEachMatch, method } from "../lib/Theory.ts";
import { withRelaxation } from "./G.ts";
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
  /* THE KNOB IS THE HOST'S AND THE POINT IS THIS LAYER'S. With a store of its own,
   * `l.world` is the LAYER's world — reading `interior` off it would find the layer's
   * own default and never what the run was configured with. `below` is the one below. */
  const scale = l.world?.below?.interior ?? 0;
  if (scale <= 0) return 0;
  return scale * ((l.density ?? 1) - 1);
};

/**
 * A POINT OF THE INTERIOR THAT IS WALKING ITSELF THIS TICK, and nothing else.
 *
 * THE FLAG ALONE IS ENOUGH HERE, and it was not when the two layers shared a store: a
 * column written on a shared pool outlives the point leaving the interior, so the test
 * had to ask the containment as well. This store holds interior points and nothing else.
 */
const walking = (l: any) => l.walking === true;

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
/**
 * AND MATTER HAS NO (G/2). A neutral point of the interior does not split.
 *
 * MAKING CHARGE OUT OF NOTHING IS THE VACUUM'S BUSINESS. Layer 1 may create and destroy
 * as it likes — it is the thing every other rule is written against and it conserves
 * nothing, which is fine and is not a defect. Layer 2 is MATTER, and matter that
 * manufactures its own charge every tick is not matter. Measured with (G/2) left in:
 * Σ|polarity| ran 4401 → 3953 → 3805 → 3669 while the net wandered 203 → 181 → 207 —
 * charge both leaking away and being made — and the layer froze by t=80 anyway.
 *
 * SO EVERY CHARGE HERE CAME FROM THE LAYER BELOW, as the pair an opposite meeting buried
 * when it folded a point — see `buried` and `Interior.sync`. Matter is made of what
 * annihilation put away, it is net neutral by construction, and a structure is charged
 * only where its own dynamics has pulled the halves of pairs apart.
 */
const MATTER = G_XOR.without("CREATION")
  .called("MATTER")
  /*
   * THE REFUSAL IS THIS LAYER'S, AND SO IS THE WORLD IT IS DECLARED ON. It gates THIS
   * layer's (G/2), and this layer's rules read `l.world` — which, now that the interior
   * has a store of its own, is the interior's world and not the lattice's. Put on the
   * host it would gate Layer 1's expansion and never Layer 2's, which is the opposite of
   * what it is for.
   */
  .decorate.World<{ radiated: number }>(() => ({ radiated: 0 }))
  /** what THIS RAY owes back to the layer below, at its own slot — see MOVEMENT */
  .decorate.Ray<{ owes: number }>(() => ({ owes: 0 }))
  .decorate.World(() => ({ blocks: method(walking) }))
  .decorate.Local<{
    owed: number; walking: boolean; phase: number
    /** which structure this point is part of, and how many points that structure has —
     *  written by `Interior.label`, which is the only thing that knows */
    part: number; mass: number
    /** charge this point owes back to the layer below — see MOVEMENT and `Interior.give` */
    release: number
  }>(() => ({
    owed: 0,
    walking: false,
    phase: 0,
    part: -1,
    mass: 1,
    release: 0,
  }))

  /**
   * (STREAM) AT THE INTERIOR'S EDGE — G's MOVEMENT, with one question added.
   *
   * THE EDGE IS STRUCTURAL AND NOT A TEST. `Interior` mirrors a link only where BOTH its
   * ends are folded, so a ray pointing out of the interior has nothing facing it and
   * `across` comes back with nothing — the same answer a bounded lattice gives at its rim.
   * What is added is what happens next: `G` would grow the world there, which an interior
   * may not do, so the ray either TURNS BACK — the same half-turn (G+M/3) already makes,
   * asked at the surface rather than at a meeting — or it is let go, and being let go is
   * RADIATION: emission as something a structure loses at its surface, at the rate
   * `escape` names, rather than a rate a `Source` was handed. At `escape` = 0 nothing is
   * lost and the interior is closed.
   */
  .rule("MOVEMENT", "World", (w: any) => {
    const b = w.backend;
    const escape = w.below?.escape ?? 0;
    const carrying = b.carrying;
    forEachMatch(b, "Ray", (r: any) => {
      if (!r.active) return;
      let to = across(r, r.bounced);
      if (to === undefined) {
        /*
         * WHAT LEAVES IS HANDED BACK, NOT DELETED. A ray at the interior's surface that
         * is let go — or that has nowhere to turn back into — is charge leaving matter
         * for the vacuum, and returning it is the inverse of the burying that brought it
         * in. Dropping it here was a leak: measured, the net charge of the interior
         * wandered from +36 to −64 over eighty ticks with nothing creating charge at all.
         * `Interior.give` puts it back on the point this one stands for.
         */
        /* the slot it reached the surface at goes with what it owes, so what returns to
         * the vacuum returns along the direction it was travelling — see `Interior.returns` */
        /*
         * THE DEBT IS ON THE RAY, NOT ON THE POINT — which is what makes the handover
         * conservative and is as local as it gets.
         *
         * It used to be a NET SCALAR on the local plus one remembered slot. A point that
         * had two rays reach its surface then owed two units with one recorded origin,
         * and `returns` paid them out at two slots — so the vacuum was handed more than
         * the interior gave up. Measured over 140 ticks: Layer 2 lost |p| 25,440 and
         * Layer 1 gained 39,700. Momentum made at the crossing.
         *
         * A ray that reaches the surface owes ITS OWN unit at ITS OWN slot, and ray k of
         * a mirror is ray k of the point it stands for, so what goes back goes back along
         * the direction it was travelling.
         */
        const owe = () => { r.owes = r.polarity ?? 0; };
        /*
         * WHAT DECIDES THAT A STRUCTURE LETS GO — and it has to be something the STRUCTURE
         * IS, not a rate anybody picked. Each of these is read off the point itself and
         * its own contents, so which structures emit is settled by what they are:
         *
         *   never      it never does — the control that says the rest are doing something
         *   always     it always does at its surface — the other control
         *   saturated  every way out of this point already carries something: it has
         *              nowhere to put what arrived, so it cannot hold more
         *   charged    the point carries a NET ± — the halves of a buried pair have come
         *              apart here, and what is unpaired is what leaves
         *   lap        the structure has just come round its own walk (phase back to 0),
         *              so it emits once a period — emission AS the clock
         *   walking    it is spending its action on its own graph and has none left to
         *              hold what arrived with
         *   unbound    a lone point of no structure — nothing binds it, so it goes
         */
        const at: any = r.l;
        let lets = false;
        switch (w.below?.emitWhen ?? "never") {
          case "always": lets = true; break;
          case "saturated": {
            lets = true;
            for (const q of (at?.rays ?? [])) if (!q.active) { lets = false; break; }
            break;
          }
          case "charged": {
            let net = 0;
            for (const q of (at?.rays ?? [])) if (q.active) net += q.polarity ?? 0;
            lets = net !== 0; break;
          }
          case "lap": lets = (at?.phase ?? 0) === 0 && (at?.mass ?? 1) > 1; break;
          case "walking": lets = at?.walking === true; break;
          case "unbound": lets = (at?.mass ?? 1) <= 1; break;
          /*
           * AND THE TWO OF THEM PULLED APART. `walking` and `charged` both gave a steady
           * rate, which is either two rules or one rule found twice — a point spending
           * its action on its own graph is likelier to have an unpaired charge sitting on
           * it. These take each WITHOUT the other, so whichever still radiates steadily
           * is the one doing the work.
           */
          case "walking-only": {
            let net = 0;
            for (const q of (at?.rays ?? [])) if (q.active) net += q.polarity ?? 0;
            lets = at?.walking === true && net === 0; break;
          }
          case "charged-only": {
            let net = 0;
            for (const q of (at?.rays ?? [])) if (q.active) net += q.polarity ?? 0;
            lets = net !== 0 && at?.walking !== true; break;
          }
        }
        if (lets) { w.radiated++; owe(); return; }
        if (escape > 0 && b.rng() < escape) { w.radiated++; owe(); return; }
        to = across(r, !r.bounced);
        if (to === undefined) { owe(); return; }
      }
      to.arriving = true;
      for (let i = 0; i < carrying.length; i++)
        carrying[i].writeWaiting(to, carrying[i].read(r));
    });
  })

  .rule("UPDATE", "Local", (l: any) => {
    const r = rate(l);
    if (r <= 0) { l.walking = false; return; }
    l.owed += r;
    if (l.owed < 1) { l.walking = false; return; }
    l.owed -= 1;
    l.walking = true;
    /*
     * AND THE LAP IS THE STRUCTURE'S OWN SIZE, WHICH IS WHERE MASS ENTERS THE CLOCK.
     *
     * "Walking its own graph is its clock" — so one turn of that clock is one walk of the
     * graph, and a structure of `mass` points takes `mass` internal actions to come round.
     * A big structure therefore has a LONG period and a slow clock, which is mass read as
     * a frequency rather than as a drag. Counted modulo the structure's own size, so the
     * phase means "how far round its own walk this point is" and not a position on a ring
     * of the lattice — the lattice's ring belongs to a geometry the interior has left.
     */
    const period = Math.max(1, l.mass ?? 1);
    l.phase = (l.phase + 1) % period;
  });

/**
 * AND THE VACUUM THIS LAYER NEEDS UNDER IT, WHICH IS NOT THE ONE `G^XOR` LEAVES.
 *
 * (G/2) fires only where a point is neutral and a point holding matter is not, so the one
 * rule that makes space is off exactly where space was destroyed — and nothing hands a
 * folded point back. Measured on fcc 12: the whole board resolves on tick 2, and the
 * vacuum then sits at 2-6% occupancy in a period-2 cycle with no meeting in it ever
 * again. A layer made OF what annihilation folds away is then made of a set that stops
 * growing after ten ticks. With the inverse in, occupancy settles near 0.43 on its own
 * and annihilation never stops — so this is a precondition of Layer 2 rather than a
 * flavour of it, and it is the default here while `G` and `G^XOR` keep theirs.
 */
export const G_XOR_2 = (withRelaxation(G_XOR, { above: 3, chance: 1 }) as typeof G_XOR)
  .called("G^XOR*2")

  /**
   * (ABSORB) WHAT LANDS ON MATTER IS TAKEN IN, AND THAT IS HOW MATTER MOVES.
   *
   * A ray of the vacuum arriving where a structure sits meets the ± the structure is
   * holding. LAYER 1'S POLARITY IS MAGNETISM AND NOT CHARGE, so what decides is not any
   * charge of the structure's: it is the XOR of the arriving sign against the matter's
   * OWN sign, which is a Layer 2 quantity read off Layer 2's own rays. Alike turns away,
   * opposite is taken in — the same rule the whole model is built on, asked one level up.
   *
   * AND IT IS WHY MOMENTUM IS CONSERVED. What the structure gains, the vacuum loses, in
   * the same tick and at the same point. `Interior.drift` used to read the local flux and
   * add it to a structure's momentum while taking nothing — momentum out of nothing,
   * every tick. Absorption is `TRANSPORT`'s own `absorbed − emitted` and cannot do that.
   *
   * ASKED OF A RAY AND THE POINT IT IS AT, and of nothing else.
   */
  .rule("ABSORPTION", "Ray", (r: any) => {
    if (!r.active) return;
    const l = r.l;
    const inside: any = l?.world?.matterAt;
    if (!inside) return;
    if (!inside.absorb(l, r, l.world.absorbing ?? "xor", l.world.takes ?? "ray")) return;
    clear(r);                                    // it is the layer above's now
  }, "active")
  /** the interior's own budget knob — deliberately NOT `upkeep`, which `TRANSPORT`
   *  already spends on moving a source and which would change what a body does */
  .decorate.World<{
    interior: number; escape: number; drift: number; binding: number
    absorbing: "xor" | "all" | "alike" | "none"
    takes: "ray" | "point"
    emitting: "walk" | "behind"
    emitWhen: "never" | "always" | "saturated" | "charged" | "lap" | "walking" | "unbound"
      | "walking-only" | "charged-only"
  }>(() => ({
    /**
     * HOW HARD LAYER 1'S TRAFFIC CARRIES A CHARGED STRUCTURE — see `Interior.drift`.
     *
     * ON HERE AND NOWHERE ELSE, because it is the one coupling that moves matter and
     * nothing in this model moved matter before it. A structure of positive net charge is
     * carried ALONG the
     * local flux and a negative one AGAINST it, which is opposite charges responding
     * oppositely — the surviving half of qv×B once the field is radial and there is no
     * sideways for it to be sideways to. A neutral structure is not carried at all.
     */
    drift: 0.5,
    /** which rays matter takes in — see `Interior.absorb` */
    absorbing: "xor" as "xor" | "all" | "alike" | "none",
    /**
     * WHETHER ABSORBING ALSO DRAWS IN THE POINT THE RAY CAME FROM — and it does.
     *
     * THIS IS THE ONE THAT MAKES MATTER CONCENTRATE. Taking only the ray leaves the
     * density of matter at 1.6 times the ambient, which is no concentration at all;
     * taking the point behind it too puts it at 28. The vacuum is drawn THROUGH the
     * structure and the space it has crossed is folded into it, so a structure moves by
     * eating rather than by being pushed, and the contraction is what it leaves behind.
     */
    takes: "point" as "ray" | "point",
    /** where a release leaves — the walk's own exit, or aimed against the intake */
    emitting: "walk" as "walk" | "behind",
    /** what decides a structure lets go at its surface — see MATTER's MOVEMENT */
    /**
     * WHAT DECIDES A STRUCTURE LETS GO — `walking`, and it was searched for rather than
     * chosen. Seven candidates, all read off the structure itself; only two gave a
     * SUSTAINED rate rather than a burst that had not finished, and pulling those two
     * apart left one standing: a point spending its action on its own graph has none
     * left to hold what arrived, so what arrives overflows. Emission is the remainder
     * when the clock has the budget — `m` is not a third channel competing with `v` and
     * `u`, it is what is left of the one action after `u` has taken it.
     */
    emitWhen: "walking" as
      "never" | "always" | "saturated" | "charged" | "lap" | "walking" | "unbound"
      | "walking-only" | "charged-only",
    /**
     * HOW HARD A STRUCTURE THAT IS RUNNING ITS OWN DYNAMICS RESISTS BEING DISSOLVED.
     *
     * Relaxation fires on `density`, and density is how much matter is at a point, so
     * without this the rule that keeps the vacuum alive is the rule that shreds matter —
     * measured, the largest structure falls from 4,804 points to 3 while the vacuum stays
     * perfectly healthy. Binding is what a structure has already paid for: it spends its
     * one action a tick walking its own graph, and that is the cost that makes it hard to
     * pull apart. See `binds`.
     *
     * IT IS 1 BECAUSE ONE RUNNING POINT IS ONE ACTION AND HOLDS ONE POINT'S WORTH, which
     * is the budget read in the unit the pressure is already in — not a strength that was
     * tuned. Anything else is a run asking what the balance point depends on.
     */
    binding: 1,
    /** the SCALE on each point's own rate — see `rate`, which reads `density` */
    interior: UPKEEP,
    /** how much of what reaches the interior's surface leaves it — the radiated share */
    escape: 0,
  }))
  .layer.inside("MATTER", MATTER);
