import { GEOMETRIES, busy, light, outward } from "../lib/Local.ts";
import { clear, method } from "../lib/Theory.ts";
import { withRelaxation } from "./G.ts";
import { G_XOR } from "./G^XOR.ts";
import { G_XOR_XOR } from "./G^XOR+XOR.ts";
import { structuresOf } from "./G^XOR*2.ts";

/**
 * EVERYTHING MOVES AT c, AND MASS IS WHAT TURNS AROUND.
 *
 * NOTHING IN THIS MODEL IS EVER AT REST. A ray goes one cell a tick or it is not a ray;
 * there is no slower and no faster and no standing still, which is not a limitation of
 * the lattice but the whole of what `TRANSPORT` says. So a thing at rest cannot be a thing
 * that is not moving. It has to be a thing whose motion CLOSES.
 *
 * WHICH IS WHERE MASS COMES FROM HERE. `G^XOR+XOR` puts a charge on the boundary and lets
 * the polarity field steer it: a charge is bent, and bent hard enough it comes back round.
 * The orbit is the particle. What is going round in it is its mass, and the price of
 * having mass is exactly that you cannot go forward any more — you can only turn. A
 * massless thing goes; a massive thing circles; and both are doing the same one cell a
 * tick, which is why there is no third option and no continuum of speeds between them.
 *
 * AND A THING THAT TURNS RADIATES, because turning is acceleration and acceleration is the
 * one thing that makes a charge shine. Discretely: at the corner, a ray goes out AGAINST
 * the heading it had — the recoil of being bent. A loop that is not perfectly carried
 * along by its own momentum sheds, all the way round its circumference, which is what
 * makes a particle a source rather than an inert ring.
 *
 * WHAT THIS THEORY IS FOR is to find out whether that gives the things matter does. It was
 * arrived at by search rather than by argument — `search.ts` climbs the space of ways this
 * could work, scoring seven declared criteria, and this configuration is the only one that
 * has ever met more than four of them:
 *
 *   alive     the vacuum runs, neither frozen nor eating the box
 *   books     what enters matter equals what leaves plus what is caught
 *   momentum  matter is not holding wildly more or less than the vacuum has
 *   spectrum  a population with a range of sizes: not dust, not one blob
 *   cycles    the folded graph CLOSES — b1 above nought, which nothing else has given
 *   charge    structures carry a net sign that does not simply track their size
 *   motion    matter moves
 *
 * SEVEN OF THE SEVEN, and it is the radiating that does it: with the corner silent the
 * same configuration manages six, and with the corner throwing off along the exit it is
 * turning ONTO rather than against its heading it manages six and loses the charge.
 *
 * WHAT IT DOES NOT GIVE, and the reason this file is a question and not an answer, is a
 * SPECIES. Nothing here picks out a preferred mass: the sizes are spread rather than
 * clustered, so there are structures but no kinds of structure. A characteristic size
 * needs two scales competing — in a nucleus it is the volume against the surface — and
 * the candidates here are the orbit's radius, which the field sets, against what a turn
 * costs. A turn costs nothing in this file, so there is nothing for the radius to trade
 * against, and that is the next thing to try rather than a thing that is settled.
 */

/**
 * (G^c/1) A CHARGE THAT IS BEING BENT LEAVES A POINT BEHIND, AND THROWS ONE OFF BACKWARDS.
 *
 * The corner is the whole of this theory. `steer` already decides where a charge is turned
 * and by how much — it banks the field strength and spends it a ring step at a time, which
 * is ω = qB/m said discretely — and it now RECORDS each turn as it makes it: the point,
 * the heading in, the heading out. That record is what this reads.
 *
 * READ FROM OUTSIDE IT CANNOT BE RECOVERED. The obvious proxy — look for a point whose
 * opposite rays disagree — found 0 corners against 6,047 real turns, because `steer`
 * decides from a vector sum over the whole neighbourhood and no two-ray test stands in for
 * it. A mechanism that acts on turning has to be told by the thing that turns.
 */
const TURNING = (t: any) => t
  .rule("TURNING", "World", (w: any) => {
    const b = w.backend, g = w.geometry;
    const log: any[] = w.turnLog ?? [];
    w.corners = (w.corners ?? 0) + log.length / 4;

    for (let i = 0; i < log.length; i += 4) {
      const l = log[i], d = log[i + 1], d2 = log[i + 2], dB = log[i + 3];
      if (!l || b.parent(l) !== undefined) continue;      // gone since it turned
      const rays = l.rays as any[];

      /*
       * WHAT THE CORNER THROWS OFF — against the heading it had, which is the recoil of
       * being bent rather than the tangent it would have flown off along. Measured both
       * ways: backwards meets every criterion this model has, and the tangent loses the
       * charge. That is a fact about this lattice and not a preference.
       */
      const k = g.OPP[d];
      const seat = k !== undefined ? rays[k] : undefined;
      if (seat && !seat.active) {
        seat.active = true;
        seat.polarity = rays[d]?.polarity ?? 1;
        seat.charge = rays[d]?.charge;
        w.radiated = (w.radiated ?? 0) + 1;
      } else if (seat) w.saturated = (w.saturated ?? 0) + 1;

      /*
       * AND WHAT IT LEAVES BEHIND. The corner is where forward stopped, and a thing that
       * has stopped going forward is matter — folded into the point it was turning at, so
       * the space it can no longer cross is the space it is now made of.
       */
      /*
       * AND HOW OFTEN A CORNER MAKES MASS — which is a question about what a point can
       * KNOW.
       *
       *   corner  every turn folds a point. Decidable from the point and its own rays,
       *           which is the only kind of decision this model allows anywhere else
       *   lap     a turn folds once the ray has been all the way round, CYCLE ring steps.
       *           It is the better physics — what has mass is the thing whose motion
       *           CLOSES, and one lap is one unit of it — but IT IS NOT LOCAL: it needs the
       *           ray to carry a count of its own laps, and no point can read that off its
       *           own neighbourhood. Kept because the RATE matters and this says what the
       *           right rate would be, not because the model is entitled to it
       *
       * THE RATE IS THE WHOLE QUESTION. At every corner, matter eats the vacuum that is
       * making it: 20,164 turns folded 10,375 points out of a world holding 5,864 and the
       * occupancy fell to 0.056 — a dead vacuum with one blob in it. Once a lap is CYCLE
       * times slower. What is wanted is whichever gives the ratio matter actually has, and
       * that is a measurement.
       */
      const spun = rays[d]?.turned ?? 0;
      const makes = w.massAt === "lap" ? !!(g.CYCLE && spun > 0 && spun % g.CYCLE === 0) : true;
      if (makes) {
        /*
         * AND IT TAKES SPACE FROM THE WAY IT IS TURNING, AND — WHERE `pullsToField` — FROM
         * THE WAY THE FIELD IS COMING FROM TOO.
         *
         * The turn direction is where the charge is going; the field direction is where
         * whatever is bending it IS. Taking space along both means a corner draws itself
         * towards the thing that made it turn, which is what would hold an aggregate
         * together rather than letting each corner accrete wherever it happens to point.
         */
        const ways = w.pullsToField && dB >= 0 && dB !== d2 ? [d2, dB] : [d2];
        for (const k of ways) {
          const there: any = outward(rays[k] ?? rays[d])?.target?.source?.l;
          if (there && there !== l && b.parent(there) === undefined) {
            b.rewrite.fold(l, there);
            w.made = (w.made ?? 0) + 1;
          }
        }
      }

      /*
       * AND THE RAY THAT WAS GOING FORWARD IS SPENT, because it is not going forward any
       * more. That is the whole trade: one ray arrives heading somewhere, and what leaves
       * the corner is one ray heading back and one point of space folded away. Nothing is
       * created by turning; motion is exchanged for mass and recoil.
       *
       * WITHOUT IT THE CORNER IS A SOURCE AND THE WORLD RUNS AWAY. Each turn threw off a
       * ray, that ray could turn, and that turn threw off another: measured, tick time
       * went 13ms to 719ms in six ticks while turns doubled each one and the lattice grew
       * 911 points to 2,376. A rule that makes more of what triggers it is not a rule, it
       * is a fire.
       */
      const spent = rays[d];
      if (spent?.active) clear(spent);
    }

    log.length = 0;
    b.rewrite.flush();
  })

  /**
   * AND THERE IS NO RULE HERE THAT "CLOSES" AN ORBIT, because there is nothing to close.
   *
   * THE CYCLE IS IN THE TRAJECTORY AND THE TRAJECTORY IS ALREADY IN THE GRAPH. A charge
   * that comes round visits points that are neighbours, and returns to one it has been at
   * — so the points its orbit folds are joined in a loop BY THE LATTICE'S OWN LINKS, and a
   * walk over the folded set finds that loop without anyone drawing it.
   *
   * A RULE THAT DREW IT ANYWAY WAS THE WHOLE COST OF THIS THEORY. Making a new way round
   * at each corner — `ray()` on both ends and a link between them — gave every such point
   * an exit with no lattice numbering, which every rule that walks rays then walks too,
   * and links that are shortcuts across the box for traffic that should have taken the
   * long way. Measured by dropping it and nothing else: 6,840ms to 181ms, and the lattice
   * stopped growing, 6,103 points to 851. Thirty-eight times the cost of the entire rest
   * of the theory, to record something that was already recorded.
   */

  /**
   * (G^c/3) WHERE FORWARD IS CLOSED, ROUND IS OPEN.
   *
   * This is the tradeoff stated as a rule. A ray that cannot go on — because what is ahead
   * of it is matter — does not simply stop being: it takes the ring step instead. Motion
   * is not lost, it is redirected, which is the only reading consistent with everything
   * going at c and nothing ever being at rest.
   */
  .rule("BLOCKED", "Local", (l: any) => {
    const b: any = l.backend, g = l.world.geometry;
    const rays = l.rays as any[];
    for (let d = 0; d < rays.length && d < g.DEG; d++) {
      const r = rays[d];
      if (!r?.active) continue;
      const there: any = outward(r)?.target?.source?.l;
      if (there && !(b.contained?.(there) ?? []).length) continue;   // open: carry on
      const k = (d + 1) % Math.min(rays.length, g.DEG);
      const seat = rays[k];
      if (!seat || seat.active) continue;
      seat.active = true; seat.polarity = r.polarity; seat.charge = r.charge;
      clear(r);
      l.world.turnedBack = (l.world.turnedBack ?? 0) + 1;
    }
  });

/**
 * AND THE VACUUM UNDER IT, which the search settled too.
 *
 * `surface` release: the vacuum takes matter apart by pushing into it, and that can only
 * happen where it can REACH. Inside a structure the traffic is matter's own. Applied to
 * the bulk instead, a structure of 2,265 points came apart into 14; not applied at all,
 * matter is perfectly stable and the world freezes dead — 0 movements for 120 ticks. It
 * is the surface reading or neither.
 */
const SURFACE = (t: any) => t.rule("RELAXATION", "Local", (l: any) => {
  const b: any = l.backend;
  if (!b.contained?.(l)?.length) return;
  for (const r of l.rays as any[]) {
    const nb: any = outward(r)?.target?.source?.l;
    if (nb && !(b.contained?.(nb) ?? []).length) { l.unfold(); return; }
  }
});

/**
 * (G^c/4) AND A STRUCTURE GOES WHERE ITS MOMENTUM HAS BEEN TAKING IT.
 *
 * WITHOUT THIS NOTHING MOVES AT ALL. Measured: 762 structures carrying momentum, mean
 * magnitude 5 and up to 45, and not one of them ever went anywhere — because there was no
 * rule that moved them. The largest fell 554 points to 36 while the count rose 39 to 3,595:
 * matter that cannot move cannot meet, and matter that cannot meet can only come apart.
 *
 * IT MOVES BY BEING SOMEWHERE ELSE, which is all a region can do. A point of matter is
 * CONTAINED in a loose point and that containment is where it is, so moving it is
 * re-containing it in the neighbour along the heading — and the whole structure goes
 * together or not at all, because a structure is not a heap of independently drifting
 * points.
 *
 * AND WHAT IT COSTS IS ITS MASS, which is what `inertia` already means: a heavier thing
 * needs more pushed through it to go the same distance.
 */
const MOVING = (t: any) => t.rule("MOVING", "World", (w: any) => {
  const b = w.backend, g = w.geometry, D = g.D as number;
  if (!b.eachFolded) return;
  const parts = structuresOf(b, D);
  for (const s of parts.values()) {
    const p = (s.points[0] as any).mom;
    if (!p) continue;
    const mass = Math.max(1, s.mass);
    let best = -1, most = 0;
    for (let d = 0; d < g.DEG; d++) {
      let along = 0;
      for (let i = 0; i < D; i++) along += p[i] * (g.U[d][i] ?? 0);
      if (along > most) { most = along; best = d; }
    }
    if (best < 0 || most < (w.inertia ?? 1) * mass) continue;

    /* every point of it must have somewhere to go, or it would tear in half */
    const moves: [any, any][] = [];
    let torn = false;
    for (const x of s.points) {
      const from = b.parent(x);
      const ray = from && (from.rays as any[])[best];
      const to: any = ray && outward(ray)?.target?.source?.l;
      if (!to || b.parent(to) !== undefined) { torn = true; break; }
      moves.push([x, to]);
    }
    if (torn) continue;
    for (const [x, to] of moves) b.rewrite.fold(to, x);
    for (let i = 0; i < D; i++) p[i] -= (g.V[best][i] ?? 0) * (w.inertia ?? 1) * mass;
    w.moved = (w.moved ?? 0) + 1;
  }
  b.rewrite.flush();
});

/**
 * TEN WAYS A CHARGE MIGHT STAY SMALL — every one of them a question about ONE POINT and
 * what is at it, because that is the only kind of question this model is allowed to ask.
 *
 * WHY ANY OF THIS IS NEEDED. A structure's charge is a plain SUM over its points, so a
 * thing with a thousand points has a thousand chances to be charged and charge grows with
 * mass: |q| ran to 27 with a correlation of 0.57. Letting charge decide meetings halved
 * that and no more, because cancellation then only happens between two rays meeting in the
 * VACUUM — two charges that end up inside the same aggregate never see each other. Real
 * charge is small for one of two reasons and this model has neither: opposites cancel
 * wherever they meet, or charge is a WINDING, a count round a loop that has no reason to
 * grow with what it is wound about.
 */
const IDEAS = (t: any, cfg: any) => {
  let x = t;

  /* (1) OPPOSITES CANCEL WHERE THEY ARE HELD TOGETHER. Two things folded into one point
   * are as close as anything in this world can be, and nothing has ever let them meet. */
  if (cfg.qCancel) x = x.rule("QCANCEL", "Local", (l: any) => {
    const held = (l.backend as any).contained?.(l) ?? [];
    if (held.length < 2) return;
    const plus: any[] = [], minus: any[] = [];
    for (const c of held) for (const r of (c.rays as any[])) {
      if (!r.active || !r.charge) continue;
      (r.charge > 0 ? plus : minus).push(r);
    }
    const n = Math.min(plus.length, minus.length);
    for (let i = 0; i < n; i++) { clear(plus[i]); clear(minus[i]); l.world.qGone = (l.world.qGone ?? 0) + 2; }
  });

  /* (2) A POINT HOLDS ONE UNIT AND NO MORE. Capacity is a property of a place, so charge
   * is bounded by how many PLACES a thing has rather than by how much it contains. */
  if (cfg.qCap) x = x.rule("QCAP", "Local", (l: any) => {
    const held = (l.backend as any).contained?.(l) ?? [];
    let seen = 0;
    for (const c of held) for (const r of (c.rays as any[])) {
      if (!r.active || !r.charge) continue;
      if (++seen > 1) { r.charge = 0; l.world.qCapped = (l.world.qCapped ?? 0) + 1; }
    }
  });

  /* (3) PAULI, FOR CHARGE. Two alike charges may not sit on an axis and its opposite —
   * the same reading that makes matter take up room, asked of the other sign. */
  if (cfg.qExclusion) x = x.rule("QEXCL", "Local", (l: any) => {
    const rays = l.rays as any[], gg = l.world.geometry;
    for (let d = 0; d < rays.length && d < gg.DEG; d++) {
      const o = gg.OPP[d];
      if (o === undefined || o <= d) continue;
      const a = rays[d], z = rays[o];
      if (a?.active && z?.active && a.charge && a.charge === z.charge) {
        z.charge = 0; l.world.qExcluded = (l.world.qExcluded ?? 0) + 1;
      }
    }
  });

  /* (4) IT SPREADS TO WHERE THERE IS LESS OF IT, so opposites are carried into each
   * other's reach instead of sitting apart inside one aggregate for ever. */
  if (cfg.qDiffuse) x = x.rule("QDIFF", "Local", (l: any) => {
    const rays = l.rays as any[];
    for (const r of rays) {
      if (!r?.active || !r.charge) continue;
      const nb: any = outward(r)?.target?.source?.l;
      if (!nb) continue;
      for (const q of (nb.rays as any[])) {
        if (!q.active || q.charge === undefined) continue;
        if (q.charge === -r.charge) { q.charge = 0; r.charge = 0; l.world.qGone = (l.world.qGone ?? 0) + 2; return; }
      }
    }
  });

  /* (5) THE COLLAPSE CARRIES IT OFF. A fold destroys space and what it destroyed was
   * carrying something; the rays it sends out are the only things there to take it. */
  if (cfg.qImplode) x = x.rule("QIMPL", "Local", (l: any) => {
    if (!(l as any).destroyed) return;
    const held = (l.backend as any).contained?.(l) ?? [];
    let net = 0;
    for (const c of held) for (const r of (c.rays as any[])) if (r.active) net += r.charge ?? 0;
    if (!net) return;
    for (const r of (l.rays as any[])) {
      if (r.active || !net) continue;
      r.active = true; r.charge = net > 0 ? 1 : -1; net -= net > 0 ? 1 : -1;
      l.world.qThrown = (l.world.qThrown ?? 0) + 1;
    }
  });

  /* (6) ONLY THE SURFACE COUNTS. A conductor keeps its charge on its outside and that is
   * why a bigger one is not a more charged one — the inside is screened by definition. */
  if (cfg.qSurface) x = x.rule("QSURF", "Local", (l: any) => {
    const b2: any = l.backend;
    const held = b2.contained?.(l) ?? [];
    if (!held.length) return;
    let open = false;
    for (const r of (l.rays as any[])) {
      const nb: any = outward(r)?.target?.source?.l;
      if (nb && !(b2.contained?.(nb) ?? []).length) { open = true; break; }
    }
    if (open) return;                       // on the face: it may carry what it likes
    for (const c of held) for (const r of (c.rays as any[]))
      if (r.active && r.charge) { r.charge = 0; l.world.qBuried = (l.world.qBuried ?? 0) + 1; }
  });

  return x;
};

/**
 * (G^c/5) AND MATTER HAS AN INSIDE THAT IS ALIVE.
 *
 * NOTHING HAS EVER HAPPENED INSIDE A STRUCTURE. `eachLocal` walks `loose`, and a point
 * that has been folded leaves it — so every ray that gets folded in is frozen exactly as
 * it was, for ever. It cannot move, cannot turn, cannot meet anything. A structure's
 * charge is therefore the arithmetic SUM of everything it has ever swallowed, which is
 * why it grows with mass: |q| ran to 18 with a correlation of 0.94 to what carried it.
 *
 * AND THAT IS WHY THE PATCHES WORKED AND WHY THEY WERE WRONG. Rules that reach into a
 * structure and zero a charge — cancelling within a point, or a ray zeroing a field in a
 * neighbour's list — moved the numbers because ANY rule that makes something happen in
 * there does. But none of them is a meeting: no axis, no fold, no space credited as
 * destroyed, and the momentum those rays carried simply gone. A meeting is a specific
 * thing in this model and matter deserves the real one.
 *
 * SO THE FOLDED SET MEETS, ON THE SAME TERMS AS EVERYTHING ELSE. Two rays facing each
 * other across an edge, opposite in what decides it, and they go — folding the points and
 * crediting the space they unmade. Which means:
 *
 *   charge cancels because two charges MET, not because a rule found them and zeroed them
 *   momentum is accounted for, since a meeting is where this model accounts for it
 *   THE SPACE UNMADE INSIDE MATTER IS CREDITED, so a dense structure destroys more space
 *     and pulls harder — mass IS the pull, applied to the inside as well as the surface
 *   and a structure has an internal life, which is what "it breathes" would need
 *
 * IT IS ALSO WHERE A SIZE COULD COME FROM. Accretion adds to a structure from outside;
 * interior meetings consume it from within at a rate its own density sets. Two rates
 * against each other is what picks a scale, and this model has never had the second one.
 */
const INSIDE = (t: any) => t.rule("INSIDE", "World", (w: any) => {
  const b = w.backend, g = w.geometry;
  if (!b.eachFolded) return;
  const decides = w.meets ?? "polarity";
  const gone: any[] = [];

  b.eachFolded((l: any) => {
    const rays = l.rays as any[];
    for (let d = 0; d < rays.length && d < g.DEG; d++) {
      const r = rays[d];
      if (!r?.active) continue;
      /* the ray facing this one across the edge — the same pairing every meeting uses */
      const there: any = outward(r)?.target?.source?.l;
      if (!there || there === l) continue;
      const o = g.OPP[d];
      const back = o !== undefined ? (there.rays as any[])[o] : undefined;
      if (!back?.active) continue;
      /* one of the pair does the work, or both would resolve the same meeting twice */
      if ((l as any).i > (there as any).i) continue;

      const pO = r.polarity !== undefined && back.polarity !== undefined && r.polarity !== back.polarity;
      const qO = r.charge !== undefined && back.charge !== undefined && r.charge !== back.charge;
      const meets = decides === "charge" ? qO
                  : decides === "either" ? (pO || qO)
                  : decides === "both" ? (pO && qO)
                  : pO;
      if (meets) gone.push([l, there, r, back]);
    }
  });

  for (const [l, there, r, back] of gone) {
    if (!r.active || !back.active) continue;      // already resolved this pass
    clear(r); clear(back);
    b.stats.annihilations++;
    (l as any).destroyed = ((l as any).destroyed ?? 0) + 0.5;
    (there as any).destroyed = ((there as any).destroyed ?? 0) + 0.5;
    w.inside = (w.inside ?? 0) + 1;
  }
});

/*
 * AND `INSIDE` IS NOT IN THE DEFAULT BUILD.
 *
 * The argument for it stands: `eachLocal` walks `loose`, so a folded point is never
 * visited again and matter has no internal life at all — every ray it swallows is frozen
 * as it was, for ever. On its own it halves the charge, as a proper meeting with the fold
 * and the space credited rather than a rule that reaches in and zeroes a field.
 *
 * IT IS STILL WORSE EVERYWHERE IT WAS MEASURED. Across 48 configurations, every one with
 * the interior alive scored below its twin without it — because with `charging: "with"`
 * charge already annihilates at the surface, and the interior meetings then take matter
 * apart faster than they tidy it. Exported so it can be put back when there is a reason
 * for it, and left out because the measurement says so today.
 */
export const G_XOR_C = MOVING(SURFACE(TURNING(
  (withRelaxation(G_XOR_XOR, { above: 3, chance: 1 }) as typeof G_XOR)
    .called("G^XOR^c")
    /**
     * AND MATTER IS IN THE WAY OF THE EXPANSION, WHICH IS WHAT MAKES IT MASS.
     *
     * A point holding a structure together is not free to split, so (G/2) fires less where
     * matter is and the deficit that leaves is the pull. THAT IS NOT A SEPARATE FORCE
     * BOLTED ON — it is what having mass MEANS here: the mass IS the pull, and a thing
     * that is not in the way of anything has none.
     *
     * IT WAS MISSING FROM THIS THEORY ENTIRELY. `G^XOR*2` had it and this was built on
     * `G^XOR+XOR` instead, so nothing carried it over — measured, (G/2) was blocked 0 times
     * out of 303,633 chances. Every result about aggregates before that was about matter
     * nothing was falling into, which is why they had no edge: the radial profile sat at
     * the ambient from the first shell out, because there was no reason for anything to be
     * denser anywhere.
     *
     * ASKED OF ONE POINT AND WHAT IS CONTAINED IN IT, which is the only kind of question
     * this coupling may put.
     */
    .decorate.World(() => ({
      blocks: method((l: any) => ((l.backend?.contained?.(l) ?? []).length > 0)),
      corners: 0, radiated: 0, saturated: 0, made: 0, turnedBack: 0, moved: 0, inside: 0,
      /*
       * THE COLLAPSE IS SILENT HERE, and that is a measurement rather than an omission.
       *
       * A fold sending itself out along every exit was what held matter together when
       * nothing else did — without it a structure of 2,265 points came apart into 14. But
       * that was before anything MOVED. With `MOVING` in, momentum does the holding, and
       * the implosion's extra rays are traffic that breaks structures up instead:
       * measured side by side, silent folds consolidated 57 structures into 26 while the
       * largest grew to 1,293 and matter moved 190 times; folds that shout drifted 20 up
       * to 32 and moved 117. The mechanism that saved matter when it could not move is
       * the one that fragments it once it can.
       */
      implodes: false,
      /** whether a corner also draws in space from where the field is coming from */
      pullsToField: false,
      /** how often a corner makes mass — see TURNING */
      massAt: "corner" as "corner" | "lap",
    })),
)));

export { structuresOf, IDEAS, INSIDE };
