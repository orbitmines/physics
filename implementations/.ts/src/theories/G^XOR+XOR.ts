import { across, busy, Geometry, leaving, opposite, outward, Vec } from "../lib/Local.ts"
import { acting, half, sign, Source } from "../lib/Source.ts"
import { forEachMatch } from "../lib/Theory.ts"
import { G } from "./G.ts"
import { G_XOR, Polarity, Sign } from "./G^XOR.ts"

/**
 * TWO POLARITIES ON ONE BOUNDARY — magnetism and charge in the SAME layer, and the whole
 * of the addition is that one of them decides WHICH WAY A RAY IS POINTING.
 *
 * `G^XOR` gives a boundary one ± and asks one question of it: when two of them meet, do
 * they agree? Agreeing turns the pair, disagreeing annihilates it, and that one question
 * is every force the theory has. `G^XOR*2` gets a second ± by going up a LEVEL — a layer
 * of matter running the same rule on the space the first layer folded away — which costs
 * it a second space, a budget, an interior and a surface.
 *
 * THIS IS THE OTHER WAY TO GET A SECOND ±: leave it on the same boundary. A boundary here
 * carries `polarity` AND `charge`, drawn independently, streaming independently, and they
 * are asked DIFFERENT QUESTIONS:
 *
 *   polarity   what happens when two rays MEET — (G+M/1) and (G+M/3), untouched, and so
 *              also what the FIELD around a body is made of
 *   charge     which way a ray is POINTING in the first place
 *
 * and that second question is the one the model did not have. Under `G^XOR` a ray on exit
 * d goes to d, always, and the only thing that ever reverses it is `bounced`, which a
 * meeting sets. Here the heading is READ OFF THE NEIGHBOURHOOD:
 *
 *   THE BOUNDARY IN FRONT AND THE BOUNDARY BEHIND DECIDE TOGETHER WHICH WAY I POINT.
 *
 * A ray at (P, d) has a boundary that leaves — facing the ray at the neighbour ahead —
 * and a boundary that faces back into P, paired with P's own ray on OPP[d]. Those are the
 * two the ray sits between, they are two POLARITIES a step apart along its own axis, and
 * WHICH OF THEM IS THE + ONE is a direction. Multiplied by the ray's own CHARGE, that is
 * the heading: with the field, or against it. Reversing it is the same half-turn (G+M/3)
 * already makes — no new motion, only a new thing that decides it.
 *
 * SO CHARGE STEERS AND POLARITY MEETS, and the pair of them is electromagnetism read as
 * ONE layer with two signs rather than two layers with one each.
 *
 * WHY THE FIELD IS THE POLARITY AND NOT A SECOND CHARGE FIELD. A field in this model is
 * RADIAL — a source puts rays out along every exit and they radiate, which is the only
 * shape the lattice gives. A magnetic field is drawn as circles round a magnet and nothing
 * here draws circles; what that picture is FOR is that a moving charge is pushed sideways
 * and that the two signs are pushed OPPOSITE ways. Read through the steering, a radial
 * field already does that: a body emitting one polarity into a vacuum that drew its own is
 * a patch of coherent sign in an incoherent sea, so the polarity ACROSS a ray leaving it
 * points out of it, and which way out is which reverses when the body's sign does. The
 * flow is the same for both charges and the charge decides whether it is carried along it
 * or against it. The electron and the positron are then the two solutions of one field,
 * which is what qv×B says and is what `tests/steering.ts` measures — at all four signs,
 * because the claim is a PRODUCT and not a direction.
 *
 * WHERE THE TWO BOUNDARIES AGREE, NOTHING IS STEERED, and that is the reduction rather
 * than a hole. A uniform field exerts no force; a region where every boundary carries the
 * same polarity has no direction in it for a charge to be steered along; and a world in
 * which nothing ever disagrees is `G`'s MOVEMENT ray for ray. A second sign that does
 * nothing when the field is flat is a second sign that is doing something when it is not,
 * rather than a knob.
 *
 * WHAT IS NOT DONE. Charge does not enter the MEETING at all — two rays that agree in
 * polarity turn whatever their charges are — so this theory has no second annihilation and
 * conserves no charge across a meeting beyond what `clear` wipes. It has no magnetic
 * moment either: the steering is along the ray's own axis, so a charge is turned back or
 * let through and never pushed SIDEWAYS, which is the part of qv×B a lattice with a
 * half-turn as its only turn cannot say. Both are the obvious next theories and neither is
 * this one: one addition at a time, and this one is the steering.
 */

/**
 * HOW A CHARGE IS STEERED — and the first answer here was the wrong shape entirely.
 *
 * WHAT WAS WRONG. The rule read the two boundaries ALONG THE RAY'S OWN AXIS — the one in
 * front and the one behind — and took their difference. Two boundaries on one axis can
 * only say "keep going" or "turn around", so the force was necessarily PARALLEL to the
 * motion, and the theory could reverse a charge and never push one sideways. Measured, it
 * gave no trajectory divergence at all (0.9σ) and no transverse separation (0.2σ), and it
 * could not have: a force along v does no turning, and an extended field of it cannot even
 * exist, since it was the gradient of a bounded ±1 quantity and such a gradient averages
 * to nought over any region.
 *
 * WHAT THE FIELD ACTUALLY IS. A magnetic field is not a difference along the direction you
 * are going — it is ANOTHER THING AT THE SAME PLACE. At a point P there are DEG rays, and
 * each carries a polarity and a direction; taken together they are a VECTOR,
 *
 *   B(P) = Σ polarity_i · d̂_i        over the rays that are at P
 *
 * which is what "one ray pointing outward IS the magnetic field there" means, said for all
 * of them at once. It is not a meeting — nothing has to collide, and the two rays never
 * interact under (G+M/1) or (G+M/3). They are simply CO-LOCATED, and that is the whole
 * setup: a charge moving through a place where a field is.
 *
 * AND THE FORCE IS SIDEWAYS TO BOTH, which is the one thing the old reading could not say:
 *
 *   F = q · v × B
 *
 * On a lattice that is not a new primitive and does not need one. A charge in a magnetic
 * field ROTATES ABOUT B — that is what qv×B integrates to, and it is the cyclotron — and
 * `Geometry.turn(d, axis)` is exactly "which exit d becomes, rotated one step about axis".
 * So the rule is: a ray carrying charge q at a point where the field is B turns ONE RING
 * STEP ABOUT B, and the SENSE of that step is the sign of q. Nothing else changes: it then
 * streams along the exit it turned onto, at one cell a tick, as every ray always has.
 *
 * THREE THINGS FALL OUT OF IT RATHER THAN BEING PUT IN.
 *
 *   v ∥ B FEELS NO FORCE. `turn` returns d unchanged when the exit is parallel to the
 *   axis, because there is no component of it in the plane of rotation. That is qv×B = 0
 *   for v ∥ B, and it is a property of the rotation rather than a case anyone wrote.
 *
 *   THE TWO SIGNS CURVE OPPOSITE WAYS, because the only thing q does is choose which way
 *   round the ring the step goes. An electron and a positron in one field are then the same
 *   ray turning in the two senses, which is what the picture of them separating IS.
 *
 *   AND IT REVERSES WITH THE FIELD, since turning about −B is the opposite step to turning
 *   about B. So the observable is the product q·B and neither factor alone — the same
 *   product law the old reading also had, now carried by a force that can actually deflect.
 *
 * THE FIELD A RAY READS EXCLUDES ITSELF. A charge does not act on itself, and including
 * its own contribution makes B depend on the very ray being steered — measured, that alone
 * turns a lone ray in an empty vacuum, which is a self-force and not a field.
 */
export type Steering =
  /** the cyclotron: turn one step about the local B, in the sense of the charge */
  | "lorentz"
  /** no steering — this is `G^XOR`, and what the reduction is measured against */
  | "none"
  /**
   * THE OLD READING, KEPT BECAUSE IT IS THE MEASURED MISTAKE. The gradient of polarity
   * along the ray's own axis, which reverses a ray and can never deflect one. It is not
   * an alternative anybody should choose; it is what this file used to do, and the runs
   * that show it giving 0.9σ and 0.2σ are the reason the rule above looks as it does.
   */
  | "axial"

/** what a boundary with nothing on it contributes: no sign, which is not the sign 0 */
const NEUTRAL = 1;
const q_ = (r: any): number => (r && r.active ? (r.charge ?? NEUTRAL) : NEUTRAL);
const p_ = (r: any): number => (r && r.active ? (r.polarity ?? 0) : 0);

/**
 * THE FIELD AT A POINT, READ OFF THE RAYS THAT ARE THERE — Σ polarity · d̂, skipping the
 * ray that is about to be steered by it.
 *
 * This is the whole of what a field is in this theory. There is no separate field
 * quantity, nothing is imposed, and no rule maintains it: it is what the point is already
 * holding, summed. A point whose rays are an unbiased ± mixture has a small random B and
 * steers almost nothing; a point where a body has laid down a coherent pattern has a large
 * one, and that is a field.
 */
export const fieldAt = (l: any, g: Geometry, skip?: any): Vec => {
  const B = new Array(g.D).fill(0);
  const rays = l.rays;
  for (let d = 0; d < rays.length; d++) {
    const r = rays[d];
    if (!r.active) continue;
    if (skip !== undefined && r.i === skip) continue;
    const p = r.polarity ?? 0;
    if (!p) continue;
    const u = g.U[d];
    for (let i = 0; i < g.D; i++) B[i] += p * (u[i] ?? 0);
  }
  return B;
};

/** which exit of its own point this ray is on, or −1 where the point has no numbering */
const exitOf = (l: any, r: any): number => {
  const rays = l.rays;
  for (let d = 0; d < rays.length; d++) if (rays[d].i === r.i) return d;
  return -1;
};

/**
 * THE EXIT A RAY ACTUALLY LEAVES BY, once the field at its point has had its say.
 *
 * Returns the ray to stream along — the ray itself where nothing steers it, and the ray on
 * the turned exit where something does. Handing back a RAY rather than an index is what
 * lets MOVEMENT stay the one line it was: `across` of whatever this returns.
 */
export const steer = (r: any, g: Geometry, how: Steering): any => {
  if (how !== "lorentz") return r;
  const q = r.charge;
  if (!q) return r;
  const l = r.l;
  if (!l) return r;
  const d = exitOf(l, r);
  if (d < 0) return r;
  const B = fieldAt(l, g, r.i);
  let m2 = 0;
  for (let i = 0; i < B.length; i++) m2 += B[i] * B[i];
  if (m2 <= 0) return r;
  /*
   * THE TURN RATE IS THE FIELD STRENGTH, FULL STOP — AND THERE IS NO CONSTANT IN IT.
   *
   * A THRESHOLD WAS WRONG AND WAS MEASURED BEING WRONG. Turning one step whenever |B|
   * cleared a bar makes every field the same field: the ray turns every tick, comes round
   * the ring in CYCLE ticks, and its orbit is about CYCLE/2π across whatever B is. A beam
   * in a strong field went 0.2 cells downrange in 22 ticks — gyrating on the spot.
   *
   * SO THE PHASE ACCUMULATES AND THE TURN IS SPENT OUT OF IT — ω = qB/m, said discretely.
   * Each tick a ray banks |B| of a turn and takes one ring step whenever it has a whole
   * one saved. That is the codebase's own `upkeep`/`owed` idiom: accrue a rate, spend a
   * discrete action, and a thing that cannot afford one every tick does it rarely rather
   * than never.
   *
   * AND |B| IS ALREADY IN THE RIGHT UNITS, WHICH IS WHY NOTHING DIVIDES IT. A ray of
   * polarity p on exit d̂ contributes p·d̂, a UNIT vector, so |B| = 1 means exactly one
   * aligned ray at this point and |B| = 0.2 means a field five times thinner. Banking |B|
   * a tick therefore says: ONE ALIGNED RAY TURNS A PASSING CHARGE ONE RING STEP PER TICK,
   * which is the tightest orbit the lattice can express and so is the natural unit rather
   * than a choice.
   *
   * THIS IS WHERE THE `gyro` KNOB WENT. It used to divide here, and it was the one number
   * in this rule the model did not earn — a second mass-like constant beside `inertia`,
   * set by hand to whatever made a picture look right. It is gone, and what replaced it is
   * not a different constant but the recognition that A WIDER ORBIT IS A WEAKER FIELD.
   * Where a big gyroradius is wanted, the field is made THINNER — fewer of its points
   * carrying a ray — and for a real magnet that thinness is set by the source's own
   * `duty` and size. So the gyroradius is now an output of how much field there is, and
   * the free parameter has become a property of whatever is making the field.
   */
  const banked = (r.gyrophase ?? 0) + Math.sqrt(m2);
  if (banked < 1) { r.gyrophase = banked; return r; }
  r.gyrophase = banked - 1;
  /* the sense of the turn IS the charge — this is the whole of q in qv×B */
  const axis: Vec = q > 0 ? B : B.map((x: number) => -x);
  const d2 = g.turn(d, axis);
  if (d2 === d) return r;                       // v ∥ B: nothing in the plane to turn
  return l.rays[d2] ?? r;
};

/**
 * THE OLD AXIAL READING — the gradient of polarity along the ray's OWN axis, ±1 for
 * whether the ray keeps its heading or reverses.
 *
 * KEPT SO THE MISTAKE STAYS MEASURABLE rather than being quietly deleted. It is what this
 * theory did before the field was understood as another thing AT THE SAME PLACE instead of
 * a difference along the way you are already going. Two boundaries on one axis can only
 * say "on" or "back", so it is a force parallel to v, it cannot deflect, and it therefore
 * cannot separate two species in a field — 0.9σ on trajectories and 0.2σ on transverse
 * displacement, against a cyclotron turn that does it outright.
 */
export const axialSense = (r: any): number => {
  const own = r.charge ?? NEUTRAL;
  const grad = (p_(opposite(r)) - p_(outward(r)?.target?.source)) / 2;
  return grad === 0 ? 1 : own * grad;
};

/**
 * HOW MANY DRAWS ONE LOCAL COSTS THE RANDOM STREAM — twice what `G^XOR` costs, because
 * there are two signs to draw and they are INDEPENDENT.
 *
 * The same accounting `slotUniformRng` is for: a local that is skipped still pays, so two
 * runs on one seed differ only by what was put in them. Drawing the charge from the
 * polarity's own draw would be cheaper and would make the two signs the same sign, which
 * is the one thing a theory built on their being two must not do.
 */
const draws = (g: Geometry, s: Sign) =>
  2 * (1 + (s === "perAxis" ? g.AXES.length : s === "perRay" ? 2 * g.AXES.length : 0));

const pay = (l: any, how: Sign, taken: number) => {
  const want = draws(l.world.geometry, how);
  for (let i = taken; i < want; i++) l.backend.rng();
};

/** the two signs the point drew, and the one write that puts both on a ray — see the
 *  note on `drawn` in `G^XOR`, which this is the two-signed copy of */
let drawn: Polarity = 1;
let drawnQ: number = 1;
const split = (r: any) => { r.active = true; r.polarity = drawn; r.charge = drawnQ; };

/**
 * A RAY THAT STEPPED OFF THE EDGE — `G`'s own, with the steered heading passed in.
 *
 * `G` keeps this private and reads `r.bounced` for itself, which is the right thing there
 * and the wrong thing here: the end a steered ray leaves by is not the end `bounced`
 * names. It grows the world at the end it is ACTUALLY leaving by, so a ray steered back
 * into the box does not make room behind itself.
 */
const offEdge = (r: any, back: boolean) => {
  const from = back ? opposite(r) : r;
  if (!from) return;
  if (!r.backend.rewrite.grow(leaving(from))) return;
  r.arriving = true;
  const carrying = r.backend.carrying;
  for (let i = 0; i < carrying.length; i++) carrying[i].writeWaiting(r, carrying[i].read(r));
};

export const G_XOR_XOR = G_XOR.copy()
  .called("G^XOR+XOR")

  /**
   * THE SECOND SIGN, CARRIED — so it streams with the ray as `polarity` does, and so
   * `clear` wipes it when a meeting puts the ray out.
   *
   * `carries` and not `decorate.Ray`: a quantity that travels has to live in a column
   * with a waiting slot beside it, and MOVEMENT/ARRIVAL exchange the two. Declared as a
   * decoration it would sit on the flyweight and be read back off whichever ray happened
   * to hold that index next.
   */
  .carries<"charge", number | undefined>("charge", undefined)

  /**
   * HOW MUCH OF A TURN THIS RAY HAS BANKED — the cyclotron phase, carried with it.
   *
   * `carries` and not `decorate.Ray` for the same reason `charge` is carried: it has to
   * travel with the ray, or a ray would inherit whatever phase the slot it landed in
   * happened to hold and the orbit would be noise.
   */
  .carries<"gyrophase", number>("gyrophase", 0)

  .decorate.World<{ steering: Steering }>(() => ({
    steering: "lorentz",
  }))

  /**
   * A SOURCE'S TWO SIGNS. The polarity is `G^XOR`'s and keeps its poles; the charge is
   * put out the same in every direction.
   *
   * THAT ASYMMETRY IS THE PHYSICS AND NOT AN OVERSIGHT. An axial source is a MAGNET: it
   * puts +q out of one half and −q out of the other, which is what having poles is, and
   * `half` is what says so. A charge has no poles — that is the whole difference between
   * the two things this layer is stacking — so `charges` goes out of every exit alike and
   * a body is a monopole in charge and a dipole in polarity at the same time.
   *
   * `charges` FALLS BACK TO `emits`, so a source that says nothing is one whose two
   * polarities agree, which is the "stacked" reading this theory is named for.
   */
  .rule("EMISSION", "Local", (l) => {
    const s: Source | null = l.source;
    if (!s) return;
    (G.rules.EMISSION as any).exec(l);
    if (!acting(s, l.world.ticks)) return;
    const g: Geometry = l.world.geometry;
    const p = sign(s, l.world.ticks) as Polarity;
    const q = s.charges ?? s.emits;
    const rays = l.rays;
    for (let d = 0; d < rays.length; d++) {
      const r = rays[d];
      if (!r.active || r.from !== s.id) continue;
      r.polarity = (half(g, s, d) === -1 ? -p : p) as Polarity;
      r.charge = q;
    }
  }, "source")

  /**
   * (G+M/2) A NEUTRAL POINT SPLITS INTO A ± PAIR ON EVERY AXIS, TWICE OVER — once in
   * polarity and once in charge, from two independent draws.
   *
   * This is `G^XOR`'s CREATION with the second draw in it and nothing else changed. The
   * conventions mean the same thing they mean there: `perNode` gives the whole point one
   * of each, `perAxis` signs each axis on its own, `perRay` breaks the pair and is
   * carried for contrast.
   */
  .rule("CREATION", "Local", (l) => {
    const rng = l.backend.rng;
    /* both draws taken first and always — see `slotUniformRng` */
    const node = rng(), nodeQ = rng();
    const how: Sign = l.world.sign;
    if (l.source || l.world.blocks?.(l) || busy(l)) { pay(l, how, 2); return; }
    l.unfold();

    if (how === "perNode") {
      drawn = node < 0.5 ? 1 : -1;
      drawnQ = nodeQ < 0.5 ? 1 : -1;
      if (l.world.inheritSign) {
        let around = 0;
        for (const r of l.rays) {
          const there: any = outward(r)?.target?.source?.l;
          if (!there) continue;
          for (const q of there.rays) if (q.active) around += q.polarity ?? 0;
        }
        if (around !== 0) drawn = (around > 0 ? 1 : -1) as Polarity;
      }
      (l.backend as any).walk("Ray", l, split);
      return;
    }

    const g: Geometry = l.world.geometry;
    let used = 2;
    const seen = new Set<unknown>();
    for (const r of l.rays) {
      if (seen.has(r)) continue;
      const o = opposite(r);
      seen.add(r); if (o) seen.add(o);
      const pol: Polarity = (rng() < 0.5 ? 1 : -1); used++;
      const qa: number = rng() < 0.5 ? 1 : -1; used++;
      let p2: Polarity, qb: number;
      if (how === "perAxis") { p2 = pol === 1 ? -1 : 1; qb = qa === 1 ? -1 : 1; }
      else { p2 = rng() < 0.5 ? 1 : -1; qb = rng() < 0.5 ? 1 : -1; used += 2; }
      r.active = true; r.polarity = pol; r.charge = qa;
      if (o) { o.active = true; o.polarity = p2; o.charge = qb; }
    }
    for (let i = used; i < draws(g, how); i++) rng();
  })

  /**
   * (STREAM) EVERY ACTIVE RAY MOVES ONE STEP — ALONG THE EXIT ITS TWO BOUNDARIES SAY IT
   * IS ON.
   *
   * `G`'s MOVEMENT with one line added, and the line is the theory: the heading is
   * `bounced` composed with the sense the charges give. Where every charge agrees the
   * sense is +1 everywhere and this IS `G`'s MOVEMENT, ray for ray.
   *
   * WRITTEN THE SLOW WAY ON PURPOSE. `Graph.step` walks the columns and reads `bounced`
   * out of one of them, which is exactly the gate this rule is replacing — it cannot be
   * told to consult two neighbouring charge columns per ray. `G^XOR*2`'s MATTER makes the
   * same trade for the same reason. What it costs is a flyweight per moving ray; what it
   * buys is that the heading is a question about the neighbourhood rather than a bit.
   */
  .rule("MOVEMENT", "World", (w: any) => {
    const b = w.backend;
    const g: Geometry = w.geometry;
    const how: Steering = w.steering;
    const carrying = b.carrying;
    forEachMatch(b, "Ray", (r: any) => {
      if (!r.active) return;
      /*
       * THE ONE LINE THIS THEORY ADDS. `from` is the ray whose exit is actually left by:
       * the ray itself where the field is too weak to bend it or it carries no charge, and
       * the ray on the TURNED exit where the cyclotron has moved it. Everything after this
       * is `G`'s MOVEMENT unchanged, so a ray still travels one cell a tick and still
       * carries everything it was carrying.
       */
      const from = how === "lorentz" ? steer(r, g, how)
        : how === "axial" && axialSense(r) < 0 ? (opposite(r) ?? r) : r;
      /*
       * A TURNED RAY HAS HAD ITS HEADING DECIDED HERE, so `bounced` — which is the
       * half-turn a MEETING gave it — is already spent and does not apply on top.
       */
      const back = from === r ? r.bounced : false;
      const to = across(from, back);
      /* the banked phase goes with the ray — `steer` has already updated it on `r`, and
       * the carrying loop below is what actually hands it on */
      if (!to) { offEdge(from, back); return; }
      to.arriving = true;
      for (let i = 0; i < carrying.length; i++)
        carrying[i].writeWaiting(to, carrying[i].read(r));
    });
  });

/**
 * THE SAME THEORY WITH ANOTHER READING OF WHOSE CHARGE STEERS — a decoration and not
 * another rule, for the same reason `withSign` is one.
 */
export const withSteering = <T extends { copy(): any; name: string }>(t: T, how: Steering) =>
  (t.copy() as any).decorate.World(() => ({ steering: how })).called(`${t.name} (${how})`);


