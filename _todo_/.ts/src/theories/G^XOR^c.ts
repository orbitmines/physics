import { GEOMETRIES, busy, light, outward } from "../lib/Local.ts";
import { clear, method } from "../lib/Theory.ts";
import { G_XOR } from "./G^XOR.ts";
import { G_XOR_XOR, netSignsAt } from "./G^XOR+XOR.ts";
import { made, Creation } from "./G^XOR^q.ts";

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
    /* SIX TO A TURN — the point, the heading in, the heading out, where the field is
     * coming from, and the field's own two net signs. The last two are `steer`'s to
     * record because they are gone by the time this rule runs; see `netSignsAt`. */
    w.corners = (w.corners ?? 0) + log.length / 6;

    for (let i = 0; i < log.length; i += 6) {
      const l = log[i], d = log[i + 1], d2 = log[i + 2], dB = log[i + 3];
      const netP = log[i + 4] as number, netQ = log[i + 5] as number;
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
        /*
         * AND WHAT IT THROWS OFF IS A QUESTION, NOT A FACT — see `G^XOR^q`.
         *
         * The default is what this file has always done: the recoil inherits BOTH of the
         * turning ray's signs, so a corner makes more of exactly what turned. That is one
         * of eighty-four answers and it is the one that was never compared with the other
         * eighty-three. `made` is the whole of the comparison; the default reproduces this
         * line to the bit.
         */
        const out = made(w.creates as Creation | undefined, rays[d], netP, netQ, l.backend.rng);
        seat.polarity = out.polarity;
        seat.charge = out.charge;
        w.radiated = (w.radiated ?? 0) + 1;
        /* COUNTED ONLY WHERE A RULE MADE IT. With `creates` unset the recoil INHERITS the
         * turning ray's charge, and counting that as a charge the world created reads
         * 42,970 creations in a theory whose whole complaint is that it has no mechanism
         * for one. An inherited sign is a sign that was already there. */
        if (w.creates && out.charge) w.qMade = (w.qMade ?? 0) + 1;
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
 * AND THE VACUUM UNDER IT — the surface reading, and the one point it may not take.
 *
 * `surface` release: the vacuum takes matter apart by pushing into it, and that can only
 * happen where it can REACH. Inside a structure the traffic is matter's own. Applied to the
 * bulk instead, a structure of 2,265 points came apart into 14; not applied at all, matter
 * is perfectly stable and the world freezes dead — 0 movements for 120 ticks. It is the
 * surface reading or neither.
 *
 * AND IT MAY NOT TAKE THE LAST ONE, WHICH IS NOT A THRESHOLD BUT WHAT A FOLD IS. A point
 * holding one other point is the LEAST MATTER CAN BE: the fold itself, and nothing stacked
 * on it. A vacuum that can push that back out can dissolve matter into nothing, so the
 * minimal unit is never stable and nothing ever accumulates. What the vacuum takes back is
 * what is STACKED at a point, and the fold is not stacked on anything.
 *
 * MEASURED, IT IS THE WHOLE EFFECT AND IT IS AT ONE. Same seed, same box, sixty ticks: with
 * the last point takeable the largest structure is 13 and matter holds 15,508 points; with
 * it kept, 122 and 21,556 — nearly ten times the size. Going further and keeping two makes
 * it 135, eleven per cent more, while movement falls by two thirds. So the step is between
 * NOTHING and THE FOLD, which is where an argument about what a fold is would put it, and
 * not anywhere along a dial.
 *
 * SO THERE IS NO PARAMETER HERE ANY MORE. This theory used to be built on
 * `withRelaxation(G_XOR_XOR, { above: 3, chance: 1 })` — a density threshold of three,
 * chosen. IT WAS ALSO NEVER RUNNING: that wrapper installs a rule called `RELAXATION` and
 * this one replaces it by the same name, so `world.relax = 3` sat on the world and nothing
 * ever read it. Every result this theory has ever produced was made with the surface rule
 * stripping unconditionally, and the tuned constant it appeared to carry was dead config.
 */
const SURFACE = (t: any) => t.rule("RELAXATION", "Local", (l: any) => {
  const b: any = l.backend;
  const held = b.contained?.(l) ?? [];
  /* nothing here, or nothing here but the fold itself */
  if (held.length <= 1) return;
  for (const r of l.rays as any[]) {
    const nb: any = outward(r)?.target?.source?.l;
    if (nb && !(b.contained?.(nb) ?? []).length) { l.unfold(); return; }
  }
});

/**
 * (G^c/4) AND MATTER GOES WHERE ITS MOMENTUM HAS BEEN TAKING IT — ONE POINT AT A TIME.
 *
 * WITHOUT THIS NOTHING MOVES AT ALL. Measured: 762 structures carrying momentum, mean
 * magnitude 5 and up to 45, and not one of them ever went anywhere — because there was no
 * rule that moved them. Matter that cannot move cannot meet, and matter that cannot meet
 * can only come apart.
 *
 * IT MOVES BY BEING SOMEWHERE ELSE, which is all a region can do. A point of matter is
 * CONTAINED in a loose point and THAT CONTAINMENT IS WHERE IT IS, so moving it is
 * re-containing it in the neighbour along the heading.
 *
 * AND THE DECISION IS LOCAL, WHICH IT WAS NOT. This rule used to ask `structuresOf` for the
 * connected components of the folded set, then move a whole component together or not at
 * all. That is a FLOOD FILL OVER THE WHOLE WORLD — the one kind of question this model does
 * not allow anywhere else, and it was wrong twice over:
 *
 *   IT WALKED A GRAPH THAT IS NOT THERE. `structuresOf` joins two points of matter when
 *   THEIR OWN rays face each other. But `folding: "keep"` — the default — never rewires a
 *   folded point's rays, so those rays still point where the point USED TO BE. Measured
 *   over 52,224 such edges: 60.1% joined matter whose hosts are not neighbours at all. So
 *   the components were connected through stale links rather than through space, and came
 *   back as one blob holding 93.5% of everything.
 *
 *   AND IT MOVED BY A DIFFERENT GRAPH THAN IT GROUPED BY. Having bundled points by their
 *   own rays, it moved them along their HOST's ray — so a "structure" was a set assembled
 *   on one adjacency and then required to translate coherently on another. It almost always
 *   tore: 114,451 folds against 427 moves.
 *
 * SO THE COMPONENT IS GONE AND NOTHING REPLACED IT. A host reads what it is holding, reads
 * the momentum that matter has, and moves it or does not. One point, its own contents, its
 * own exits, one neighbour — the same question every other rule here is allowed to ask.
 *
 * AND COHESION IS NOW A CONSEQUENCE RATHER THAN A RULE. Neighbouring hosts hold matter that
 * has been through the same field and carries correlated momentum, so they move the same
 * way and stay together — and where the momentum genuinely disagrees, the matter genuinely
 * separates. That is what a body holding together SHOULD mean. The tearing check was the
 * old rule enforcing cohesion by refusing to move; a structure is not a heap of
 * independently drifting points because the dynamics make it so, not because a global
 * algorithm forbids it.
 *
 * AND WHAT IT COSTS IS ITS MASS, which is what `inertia` already means: a heavier thing
 * needs more pushed through it to go the same distance. Here that mass is what THIS HOST
 * holds, which is the only mass a local rule can know about.
 */
const MOVING = (t: any) => t.rule("MOVING", "Local", (l: any) => {
  const b: any = l.backend, w = l.world, g = w.geometry, D = g.D as number;
  const held: any[] = b.contained?.(l) ?? [];
  if (!held.length) return;

  /* the ledger `through` keeps — one array shared by everything this host holds */
  const p = (held[0] as any).mom;
  if (!p) return;

  let best = -1, most = 0;
  for (let d = 0; d < g.DEG; d++) {
    const u = g.U[d];
    if (!u) continue;
    let along = 0;
    for (let i = 0; i < D; i++) along += p[i] * (u[i] ?? 0);
    if (along > most) { most = along; best = d; }
  }
  if (best < 0) return;

  const mass = Math.max(1, held.length);
  if (most < (w.inertia ?? 1) * mass) return;

  /* somewhere to go: the neighbour along that exit, and it must be loose to receive */
  const ray = (l.rays as any[])[best];
  const to: any = ray && outward(ray)?.target?.source?.l;
  if (!to || to === l || b.parent(to) !== undefined) return;

  for (const x of held) b.rewrite.fold(to, x);
  for (let i = 0; i < D; i++) p[i] -= (g.V[best][i] ?? 0) * (w.inertia ?? 1) * mass;
  w.moved = (w.moved ?? 0) + 1;
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
 * (G^c/5) AND MATTER HAS AN INSIDE THAT IS ALIVE — the second rate, and the whole of what
 * a preferred size would need.
 *
 * NOTHING HAS EVER HAPPENED INSIDE A STRUCTURE. `eachLocal` walks `loose`, and a point that
 * has been folded leaves it — so every ray that gets folded in is frozen exactly as it was,
 * for ever. It cannot move, cannot turn, cannot meet anything. A structure's charge is
 * therefore the arithmetic SUM of everything it has ever swallowed.
 *
 * SO THE FOLDED SET MEETS, ON THE SAME TERMS AS EVERYTHING ELSE. Two rays facing each other
 * across an edge, opposite in what decides it, and they go — crediting the space they
 * unmade. Which means charge cancels because two charges MET rather than because a rule
 * found them and zeroed them, and the space unmade INSIDE matter is credited, so a dense
 * structure destroys more space and pulls harder.
 *
 * AND IT IS WHERE A SIZE COMES FROM, WHICH IS WHY IT IS WORTH THE COST. Accretion adds to a
 * structure from OUTSIDE, so it scales with the surface. Interior meetings consume it from
 * WITHIN, so they scale with the volume. Two rates with different exponents cross at ONE
 * size, and that crossing is what a characteristic size IS. Measured without it: surface
 * goes as mass^0.999 — every point on the boundary, no interior at all — and the size
 * distribution is a power law to r² = 0.989 across two decades, which is exactly what one
 * rate acting alone looks like.
 *
 * IT MEETS BY THE HOSTS, NOT BY THE FOLDED POINTS' OWN RAYS — which is the correction that
 * makes it worth re-measuring at all. A folded point keeps the rays it had before it was
 * folded: `folding: "keep"` never rewires them, so they point at where that point USED to
 * be. Measured over 52,224 such pairings, 60.1% joined matter whose hosts are not
 * neighbours. `MOVING` had the same defect and it was what made a structure look like one
 * blob holding 93.5% of everything. A meeting between two pieces of matter that are not in
 * the same place is not a meeting, and every earlier measurement of this rule was made
 * through that graph.
 *
 * SO WHAT MEETS IS WHAT IS HELD AT ONE POINT, AND AT ITS NEIGHBOUR. Containment is where
 * matter is; two pieces of matter are next to each other when their hosts are. That is a
 * question about one point and its own exits, which is the only kind this model allows.
 */
const INSIDE = (t: any) => t.rule("INSIDE", "Local", (l: any) => {
  const b: any = l.backend, w = l.world, g = w.geometry;
  const held: any[] = b.contained?.(l) ?? [];
  if (!held.length) return;
  const decides = w.meets ?? "polarity";

  /** does this pair disagree in whatever decides a meeting here */
  const meets = (x: any, y: any) => {
    const pO = x.polarity !== undefined && y.polarity !== undefined && x.polarity !== y.polarity;
    const qO = x.charge !== undefined && y.charge !== undefined && x.charge !== y.charge;
    return decides === "charge" ? qO
         : decides === "either" ? (pO || qO)
         : decides === "both" ? (pO && qO)
         : pO;
  };

  /** the rays this point's matter is carrying, in one list */
  const raysOf = (host: any) => {
    const out: any[] = [];
    for (const x of (b.contained?.(host) ?? []) as any[])
      for (const r of x.rays as any[]) if (r.active) out.push(r);
    return out;
  };

  const mine = raysOf(l);
  if (!mine.length) return;

  /*
   * FIRST WITHIN THIS POINT. Two things folded into one point are as close as anything in
   * this world can be, and nothing has ever let them meet — see `qCancel` in `IDEAS`, which
   * is the same observation made as a patch rather than as a meeting.
   */
  for (let i = 0; i < mine.length; i++) {
    const a = mine[i];
    if (!a.active) continue;
    for (let k = i + 1; k < mine.length; k++) {
      const z = mine[k];
      if (!z.active || !meets(a, z)) continue;
      clear(a); clear(z);
      b.stats.annihilations++;
      l.destroyed = (l.destroyed ?? 0) + 1;
      w.inside = (w.inside ?? 0) + 1;
      break;
    }
  }

  /*
   * AND THEN ACROSS TO THE NEIGHBOUR'S. One of the pair does the work, or both ends resolve
   * the same meeting twice — decided by index, as every meeting in this model is.
   */
  for (const r of l.rays as any[]) {
    const there: any = outward(r)?.target?.source?.l;
    if (!there || there === l || (l as any).i > (there as any).i) continue;
    const theirs = raysOf(there);
    if (!theirs.length) continue;
    for (const a of mine) {
      if (!a.active) continue;
      for (const z of theirs) {
        if (!z.active || !meets(a, z)) continue;
        clear(a); clear(z);
        b.stats.annihilations++;
        l.destroyed = (l.destroyed ?? 0) + 0.5;
        there.destroyed = (there.destroyed ?? 0) + 0.5;
        w.inside = (w.inside ?? 0) + 1;
        break;
      }
    }
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
  (G_XOR_XOR as typeof G_XOR)
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
      qMade: 0,
      /** WHAT A SIDEWAYS MEETING MAKES — null is this file's own answer. See `G^XOR^q`. */
      creates: null as Creation | null,
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

export { IDEAS, INSIDE };
