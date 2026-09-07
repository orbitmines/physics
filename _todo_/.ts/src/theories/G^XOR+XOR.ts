import { across, busy, Geometry, leaving, light, opposite, outward, Vec } from "../lib/Local.ts"
import { acting, half, sign, Source } from "../lib/Source.ts"
import { clear, forEachMatch } from "../lib/Theory.ts"
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
  /**
   * THE SAME CYCLOTRON WITH THE FIELD BANKED AS A VECTOR RATHER THAN AS A MAGNITUDE - and
   * the difference is whether an INCOHERENT field can steer anything.
   *
   * `lorentz` banks `|B|` a tick and spends a ring step per whole one. That is right for a
   * field and wrong for a fluctuation, because a magnitude is never negative: a field of
   * zero mean whose direction is fresh every tick still banks `|B|` every tick, so it
   * accumulates turning LINEARLY in time. It is a rectifier. Measured on this lattice, the
   * vacuum's own B has a direction autocorrelation of 0.02 at one tick - no memory at all -
   * and yet it turns charges at |B| = 1.4 a tick, which puts every gyroradius in the vacuum
   * at 0.66 of a cell. Nothing can orbit in that, and nothing is orbiting: a ray with
   * `turned` past CYCLE has taken its ring steps about that many DIFFERENT random axes.
   *
   * BANKED AS A VECTOR THE NOISE CANCELS ITSELF, over time exactly as it cancels over
   * space. The accumulated vector of an incoherent field grows as the square root of the
   * time - measured, 70 after a thousand ticks where the magnitude sum reaches 2319 - so
   * the turn rate it produces FALLS as one over the square root of the time, and a vacuum
   * with no direction in it becomes transparent by its own arithmetic. A COHERENT field
   * accumulates linearly and steers exactly as it always did, because for a field that
   * keeps its direction the vector sum and the magnitude sum are the same sum.
   *
   * NOTHING IS TUNED AND NOTHING IS THINNED. The vacuum keeps the occupancy the meeting
   * enumeration gives it; what changes is that a rule which could not tell a field from a
   * fluctuation now can, which is the same cancellation `G^XOR` already applies everywhere
   * else, applied to the accumulation instead of to the meeting.
   */
  | "coherent"
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
    /* A POINT NEED NOT HAVE THE LATTICE'S EXITS — a bead `insert` left, or a ring's new
     * way round — so an exit index off the end of the numbering names no direction, and
     * a ray on it contributes to no field. */
    const u = g.U[d];
    if (!u) continue;
    for (let i = 0; i < g.D; i++) B[i] += p * (u[i] ?? 0);
  }
  return B;
};

/**
 * THE CHARGE FIELD AT A POINT — Σ charge · d̂, the exact dual of `fieldAt`.
 *
 * NOTHING IN THIS THEORY READS IT YET, and that is the point of having it. `fieldAt` is
 * the polarity summed as a vector and it is what steers; charge has never been summed at
 * all, because charge has only ever been a thing a ray CARRIES and never a thing a place
 * HAS. So the model has a mechanism that makes more polarity — a corner throwing off a
 * signed ray — and no mechanism whatever that makes CHARGE: every charge in the world was
 * drawn by (G/2) out of the vacuum, and nothing has ever created one from an event.
 *
 * ASKING "WHAT MEETING CREATES CHARGE" NEEDS THIS. A meeting can only be decided by what
 * is at the place it happens, so if a charge is to be made by two things meeting sideways
 * then the sideways thing has to be readable as a field, and this is that reading.
 */
export const fieldQ = (l: any, g: Geometry, skip?: any): Vec => {
  const Q = new Array(g.D).fill(0);
  const rays = l.rays;
  for (let d = 0; d < rays.length; d++) {
    const r = rays[d];
    if (!r.active) continue;
    if (skip !== undefined && r.i === skip) continue;
    const q = r.charge ?? 0;
    if (!q) continue;
    const u = g.U[d];
    if (!u) continue;
    for (let i = 0; i < g.D; i++) Q[i] += q * (u[i] ?? 0);
  }
  return Q;
};

/**
 * THE NET ± AT A POINT, IN EACH SIGN SEPARATELY — the SCALAR beside the two vectors.
 *
 * `fieldAt` says which way the polarity at a point is leaning; this says whether there is
 * more of one sign than the other there at all, which is the thing "the same polarity as
 * the field" and "the opposite polarity to the field" are actually about. A DIRECTION
 * CANNOT ANSWER THAT QUESTION: the exit best aligned with B is picked BY being aligned, so
 * its projection is positive by construction and carries no sign of its own.
 */
export const netSignsAt = (l: any, skip?: any): { p: number; q: number } => {
  let p = 0, q = 0;
  for (const r of l.rays as any[]) {
    if (!r.active) continue;
    if (skip !== undefined && r.i === skip) continue;
    p += r.polarity ?? 0;
    q += r.charge ?? 0;
  }
  return { p: Math.sign(p), q: Math.sign(q) };
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
/** the accumulated field a ray carries, one component per dimension - see `coherent` */
const GYRO = ["gyro0", "gyro1", "gyro2"] as const;

/**
 * THE FIELD OVER A NEIGHBOURHOOD RATHER THAN OVER A POINT - the mean of `fieldAt` across a
 * point and the points one step from it.
 *
 * WHY A MEAN AND WHY A NEIGHBOURHOOD. A field is what is COHERENT over a region; a point's
 * own twelve exits are the smallest sample there is, which is the sample that maximises the
 * fluctuation. Averaging over the point and its neighbours leaves a uniform field exactly
 * where it was - the mean of the same vector is that vector - while an incoherent one falls
 * as one over the root of the sites averaged. Measured on fcc 12 the vacuum's per-point
 * |B| is 1.4 with a direction autocorrelation of 0.02, and thirteen sites is a factor of
 * 3.6, which is what puts it under the threshold a bank can hold.
 *
 * IT IS STILL LOCAL. One step is the same reach every rule in this model already has - a
 * meeting reads across an edge, a split reads its own neighbourhood - so this asks nothing
 * the lattice does not already answer in one hop.
 */
const fieldAround = (l: any, g: Geometry, skip?: any): Vec => {
  const B = fieldAt(l, g, skip);
  let n = 1;
  for (const r of l.rays as any[]) {
    const there: any = outward(r)?.target?.source?.l;
    if (!there || there === l) continue;
    const b = fieldAt(there, g);
    for (let i = 0; i < g.D; i++) B[i] += b[i];
    n++;
  }
  for (let i = 0; i < g.D; i++) B[i] /= n;
  return B;
};

export const steer = (r: any, g: Geometry, how: Steering): any => {
  if (how !== "lorentz" && how !== "coherent") return r;
  { const ww = r.l?.world; if (ww) ww.steered = (ww.steered ?? 0) + 1; }
  const q = r.charge;
  if (!q) return r;
  const l = r.l;
  if (!l) return r;
  const d = exitOf(l, r);
  if (d < 0) return r;
  /* over a neighbourhood where the bank is a vector - see `fieldAround` and `coherent` */
  const B = how === "coherent" ? fieldAround(l, g, r.i) : fieldAt(l, g, r.i);
  let m2 = 0;
  for (let i = 0; i < B.length; i++) m2 += B[i] * B[i];
  /* a vector bank still has something to spend on a tick the field is nought */
  if (m2 <= 0 && how !== "coherent") return r;
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
  let held: Vec = B;
  if (how === "coherent") {
    /*
     * BANKED AS A VECTOR. The same accrue-and-spend idiom as below - and the only change
     * is that what accrues has a DIRECTION, so contributions that disagree subtract.
     */
    const acc: number[] = [];
    for (let i = 0; i < B.length; i++) acc.push((r[GYRO[i]] ?? 0) + B[i]);
    const m = Math.hypot(...acc);
    if (m < 1) {
      for (let i = 0; i < acc.length; i++) r[GYRO[i]] = acc[i];
      return r;
    }
    /* spend ONE unit, along the direction it accumulated in - the vector counterpart of
     * `banked - 1`, which is what keeps a strong field turning every tick and a weak one
     * turning rarely rather than never */
    const k = (m - 1) / m;
    for (let i = 0; i < acc.length; i++) r[GYRO[i]] = acc[i] * k;
    held = acc as Vec;
  } else {
    const banked = (r.gyrophase ?? 0) + Math.sqrt(m2);
    if (banked < 1) { r.gyrophase = banked; return r; }
    r.gyrophase = banked - 1;
  }
  /* the sense of the turn IS the charge — this is the whole of q in qv×B */
  const axis: Vec = q > 0 ? held : held.map((x: number) => -x);
  /* AND A TURN IS ABOUT AN EXIT OF THE LATTICE. `turn` reads `U[d]` to find the plane, so
   * a ray on a bead's own numbering — which is not the lattice's — has no plane to be
   * turned in and is left going the way it was. */
  if (!g.U[d]) return r;
  const d2 = g.turn(d, axis);
  if (d2 === d) return r;                       // v ∥ B: nothing in the plane to turn
  /* HOW MANY RING STEPS THIS RAY HAS TAKEN. A ray that has taken CYCLE of them has been
   * round once, which is what makes a closed orbit recognisable as one. */
  r.turned = (r.turned ?? 0) + 1;
  /*
   * AND THE TURN IS RECORDED WHERE IT HAPPENS.
   *
   * A turn is a physical event — the one thing that makes a charge shine, and the thing a
   * closed orbit is made of — so what turned, where, from which heading to which, is
   * something this rule knows and nothing else can recover. Re-deriving it from outside
   * by comparing two rays' polarities is a PROXY, and the proxy found nothing: 6,047 real
   * turns against 0 corners detected. Anything that wants to act on turning reads this.
   */
  const ww = l.world;
  if (ww) {
    ww.turnsTaken = (ww.turnsTaken ?? 0) + 1;
    if (ww.turnLog) {
      /* AND WHICH WAY THE FIELD IS, said as an exit of the lattice — the direction the
       * thing bending this charge is coming FROM. Only this rule knows it: `B` is a vector
       * sum over the whole neighbourhood and no two-ray test outside recovers it. */
      let dB = -1, best = 0;
      for (let k = 0; k < g.DEG; k++) {
        const u = g.U[k];
        if (!u) continue;
        let along = 0;
        for (let i = 0; i < B.length; i++) along += B[i] * (u[i] ?? 0);
        if (along > best) { best = along; dB = k; }
      }
      /* AND WHAT SIGNS THE FIELD ITSELF IS CARRYING, taken HERE rather than read back
       * later. `TURNING` runs after `ARRIVAL` has swapped every column, so a rule that
       * asks the point what it holds is asking about the NEXT tick's neighbourhood rather
       * than the one the turn happened in. The two nets are four adds; recovering them
       * afterwards is not possible at all. */
      const net = netSignsAt(l, r.i);
      ww.turnLog.push(l, d, d2, dB, net.p, net.q);
    }
  }

  /*
   * AND A TURN THAT HAS COME ALL THE WAY ROUND LEAVES A RING BEHIND.
   *
   * THE ORBIT IS ALREADY A CLOSED CURVE — that is what a cyclotron turn IS, and this
   * theory has been drawing them since it was written. Nothing was reading them. A ray
   * that has taken CYCLE ring steps has been round once and is heading the way it set out,
   * so the points it went through are a loop; joining the end of that loop to its
   * beginning is not a new object, it is the loop being written down.
   *
   * WHICH IS WHERE CYCLES COME FROM WITHOUT ANYBODY PUTTING THEM THERE. Every measurement
   * of the folded graph has come back a forest — b1 nought, no winding, no holonomy,
   * nothing for a charge to be a count of — and joining arbitrary neighbours to make loops
   * closed the world into one component instead. An orbit closes because a charge in a
   * field comes back, which is a reason.
   *
   * IT NEEDS A FIELD AND A CHARGE AND SOMEWHERE SMALL ENOUGH TO COME ROUND IN, so it
   * happens where the field is strong and not anywhere else — which is the point.
   */

  /*
   * AND THE ORBIT IS DRAWN INTO THE GRAPH AS IT GOES.
   *
   * A charge in a field comes round, so the points it turns at are the corners of a closed
   * curve — and joining each corner to the one before puts that curve INTO the graph
   * rather than leaving it as something the trajectory did and nothing recorded. After
   * CYCLE corners it has come back and the polygon is closed, which is a cycle nobody put
   * there: it is where the ray went.
   *
   * WAITING FOR THE LAP TO COMPLETE DID NOT WORK, and the reason is worth keeping: a ray
   * has to survive CYCLE turns to close one, and in a vacuum at this occupancy almost none
   * do — meetings clear them first. Measured, 290,526 turns were taken and not one lap
   * completed. Drawn corner by corner it does not need the ray to live that long; what
   * closes the loop is that the field brings SOME ray back round, not that one ray does.
   *
   * AND THE WAY OUT IS MADE, NOT BORROWED. Every end of a wired lattice already faces its
   * neighbour — that is what makes them neighbours — so reaching for a free one finds
   * none: 48,000 looks and nothing linked. The corner gets a way round that was not there.
   */
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

/**
 * (THROUGH) A RAY THAT REACHES MATTER GOES INTO IT AND COMES OUT, OR DOES NOT.
 *
 * NOTHING IS ABSORBED BY FIAT. A ray meeting a point that holds matter used to be taken
 * off the board and its heading credited to whatever was there — which is a transfer, and
 * conserves, and says nothing about what matter IS. It also gave the ledger only one half:
 * momentum went in and never came out, so matter ended up holding more than the whole
 * vacuum had.
 *
 * SO IT TRAVELS THE STRUCTURE. The points a fold put away keep their links, so there is a
 * real graph in there to walk, and walking it is the same three things that happen
 * anywhere else in this model:
 *
 *   an OPPOSITE sign            annihilates - the ray is stopped, and what it was
 *                               carrying stays. That is matter CATCHING it, and the point
 *                               it met is unmade, which is mass
 *   an ALIKE sign               turns, the half-turn (G+M/3) already makes, and the ray
 *                               carries on through
 *   a point with vacuum beside  it leaves, and what it was carrying goes with it. That is
 *                               RADIATION, and it is not a rule anybody added: it is where
 *                               the walk happened to come out
 *
 * WHICH IS WHY EMISSION IS A SURFACE THING. A structure with a lot of inside catches more
 * of what enters it and a thin one passes more through, so what it radiates goes with the
 * boundary it has rather than with the mass — which is the area law this book says the
 * aggregate obeys, arrived at by walking rather than by asserting.
 *
 * AND BOTH HALVES OF THE LEDGER COME FROM ONE PROCESS. In is counted where it enters, out
 * where it leaves, kept where it stopped, so `in = out + kept` is a thing that can be
 * checked rather than assumed - see `entered`, `left`, `caught`.
 */
const through = (w: any, b: any, g: Geometry, r: any, host: any, inside: any[]): void => {
  const D = g.D as number;
  const slot = (host.rays as any[]).indexOf(r);
  const q = r.polarity;
  const mom = ((inside[0] as any).mom ??= new Array(D).fill(0));
  for (const c of inside) (c as any).mom = mom;          // one structure, one ledger
  w.entered = (w.entered ?? 0) + 1;
  /* A HEADING IS A HEADING OF THE LATTICE. A point `insert` left, or one a ring gave a new
   * way round, is numbered by its own rays and not by the lattice's exits — so an index off
   * the end of `V` names no direction and carries no momentum, rather than throwing. */
  const give = (d: number, sign: number) => {
    const v = g.V[d];
    if (d < 0 || !v) return;
    for (let i = 0; i < D; i++) mom[i] += sign * (v[i] ?? 0);
  };
  /* it is in: the structure has its heading */
  give(slot, +1);

  /*
   * THE WALK. Enter at the slot it arrived on and step through the folded points by their
   * own links, bounded by how many there are — a walk on a graph cannot visit more points
   * than the graph has before it is going round in circles.
   */
  let at: any = inside[0], d = slot >= 0 ? slot : 0;
  for (let step = 0; step < inside.length * g.DEG + g.DEG; step++) {
    const rays = at.rays as any[];
    const mid = rays[d];
    if (!mid) break;

    /* what it meets here */
    const met = mid.active ? (mid.polarity ?? undefined) : undefined;
    if (met !== undefined && q !== undefined && met !== q) {
      /*
       * OPPOSITE: IT IS CAUGHT — and a catch is an ANNIHILATION, so what the structure
       * gains is the DIFFERENCE of the two headings and not the whole of the one that
       * came in.
       *
       * Credited one-sidedly it is a gain every time: half of everything that enters is
       * caught, so momentum floods in and never leaves. Measured that way, matter came to
       * hold two hundred and thirty times the whole vacuum's momentum. The ray that was
       * met was going the other way and stops too, so its heading comes off the ledger in
       * the same breath the arriving one goes on — which is what makes this a meeting
       * rather than a meal.
       */
      give((at.rays as any[]).indexOf(mid), -1);
      clear(mid);
      clear(r);
      b.stats.annihilations++;
      at.destroyed = (at.destroyed ?? 0) + 1;
      w.caught = (w.caught ?? 0) + 1;
      return;
    }
    /* ALIKE: it turns and goes on — onto the exit facing back, WHERE THERE IS ONE. A
     * point `insert` left has two rays and no lattice numbering, and most of the folded
     * set is those, so `OPP[d]` names a slot that is not there. */
    if (met !== undefined) {
      const o = g.OPP[d];
      d = (o !== undefined && rays[o]) ? o : (rays.length === 2 ? (d === 0 ? 1 : 0) : d);
    }
    const out0 = rays[d];
    if (!out0) break;
    const next: any = outward(out0)?.target?.source?.l;
    if (!next) break;
    const held = (b.contained?.(next) ?? []).length > 0;
    const folded = b.parent(next) !== undefined;
    if (!folded && !held) {
      /*
       * IT HAS COME OUT — the structure loses what it was carrying, and the ray is put
       * back into the vacuum on the far side, travelling as it was.
       */
      /*
       * IT LEAVES ALONG THE SLOT IT ACTUALLY LEAVES BY, and that slot is what comes off
       * the ledger. Debiting the heading the walk HAD and then lighting whatever slot
       * happened to be free is a leak on every exit — a 2-valent point has no slot `d`,
       * so the fallback put the ray out somewhere else entirely while the books said it
       * went out along `d`. Exits are near half of everything that enters, so a small
       * mismatch on each of them is most of the drift.
       */
      /*
       * IT COMES OUT WHERE IT COMES OUT, and a slot that is taken is a MEETING and not a
       * wall.
       *
       * Looking for a FREE slot to put it in and keeping it where there was none made the
       * structure opaque: a third of everything that entered could not leave, exits fell
       * away to nothing, and what stayed piled the momentum up — which is not matter being
       * dense, it is the walk refusing to finish. There is always somewhere for it to go,
       * because arriving where something already is has a rule and this model is made of
       * it: opposite annihilates and alike turns.
       */
      const nr = next.rays as any[];
      const slotOut = nr[d] ? d : 0;
      const seat = nr[slotOut];
      if (!seat) break;
      give(slotOut, -1);
      clear(r);
      w.left = (w.left ?? 0) + 1;
      if (seat.active) {
        /* something is already there — the meeting it walked into */
        if (seat.polarity !== undefined && q !== undefined && seat.polarity !== q) {
          clear(seat);
          b.stats.annihilations++;
          next.destroyed = (next.destroyed ?? 0) + 1;
          w.metOut = (w.metOut ?? 0) + 1;
        } else {
          /* alike: it turns, which is the half-turn every meeting here makes */
          const o = g.OPP[slotOut];
          const turn = o !== undefined ? nr[o] : undefined;
          if (turn && !turn.active) { turn.active = true; turn.polarity = q; }
          w.turnedOut = (w.turnedOut ?? 0) + 1;
        }
      } else { seat.active = true; seat.polarity = q; }
      return;
    }
    at = folded ? next : (b.contained?.(next) ?? [next])[0];
    if (!at) break;
  }

  /* the walk closed on itself: it is in there, and what it carries is the structure's */
  clear(r);
  w.caught = (w.caught ?? 0) + 1;
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

  /**
   * AND THE SAME BANK AS A VECTOR, one component per dimension — see `coherent`.
   *
   * Carried rather than decorated, for the reason `gyrophase` is: it has to travel with the
   * ray. Three because every lattice here is three dimensions or fewer, and a component a
   * geometry does not have is never read.
   */
  .carries<"gyro0", number>("gyro0", 0)
  .carries<"gyro1", number>("gyro1", 0)
  .carries<"gyro2", number>("gyro2", 0)

  /**
   * HOW MANY RING STEPS THIS RAY HAS TAKEN, AND WHERE IT WAS WHEN THE LAP BEGAN — so a
   * closed orbit can be recognised as one. See the turn in `steer`: CYCLE steps is once
   * round, and once round is a loop the graph can be told about.
   */
  .carries<"turned", number>("turned", 0)
  /* WHERE THE LAP BEGAN, as a value the ray carries rather than a reference it does not.
   * A `decorate.Ray` sits on the flyweight and the flyweight is per SLOT, so a ray that
   * moved read back whatever the slot it landed in was last holding — the pairing was
   * between two unrelated rays. Carried, it travels with the ray as `turned` does. */
  .carries<"orbit", any>("orbit", null)

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
      r.polarity = (half(g, s, d, l.world.ticks) === -1 ? -p : p) as Polarity;
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
    /* WHERE (G/2) WAS NOT ALLOWED TO FIRE, COUNTED. `blocks` is the only way anything
     * outside this lattice suppresses the expansion, and it is the gravity of this model
     * — so how often it fires is the thing to measure, and reading a flag after the tick
     * cannot: the flag is set and cleared inside this rule. */
    if (l.source || busy(l)) { pay(l, how, 2); return; }
    if (l.world.blocks?.(l)) { l.world.blocked = (l.world.blocked ?? 0) + 1; pay(l, how, 2); return; }
    l.world.split = (l.world.split ?? 0) + 1;
    if (l.world.unfolds) l.unfold();   // see `unfolds` — space it has held may stay held

    if (how === "perNode") {
      drawn = node < 0.5 ? 1 : -1;
      /*
       * AND WHAT CHARGE A SPLIT PUTS OUT — which nothing forces, and which the model has
       * only ever answered one way.
       *
       *   free     an independent draw, as it has been. Two signs on one boundary with
       *            nothing relating them, which is what makes them two signs at all
       *   with     the polarity's own sign. Charge and magnetism are then the same draw
       *            read twice, and a split can never be charged against its own field
       *   against  the polarity reversed, so every split is a dipole in the two together
       *   none     no charge at all from the vacuum. Then every charge in the world came
       *            from a MEETING, and matter cannot be made of what the vacuum handed it
       *
       * WHY IT IS WORTH ASKING. Charge came out quantised — never past |5| — until matter
       * was allowed to block the expansion, and then it ran to 30 with its correlation to
       * mass climbing to 0.70, which is a charge that has become a count of contents.
       * Something about where charge comes from is what decides whether it stays small,
       * and the vacuum's draw is the only place it comes from.
       */
      const qHow = l.world.charging ?? "free";
      drawnQ = qHow === "with" ? drawn
             : qHow === "against" ? (-drawn as Polarity)
             : qHow === "none" ? 0
             : (nodeQ < 0.5 ? 1 : -1);
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
      const from = how === "lorentz" || how === "coherent" ? steer(r, g, how)
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

      /*
       * AND THE MEETING IS RESOLVED HERE, AS IT IS IN `G`'s MOVEMENT — because this rule
       * REPLACES that one, and a rule that replaces another inherits everything it was
       * doing or silently drops it.
       *
       * IT WAS SILENTLY DROPPED. `G`'s MOVEMENT resolves a ray arriving into something
       * coming the other way: without it (G/2) lights every neutral point, a ray steps
       * into a pair made to meet it, and half of those meetings annihilate — measured, one
       * ray lit in a vacuum and at t=1 the world holding it was identical to the world
       * without it. That fix was written into `G` and this theory overrode the rule it
       * lived in, so every run of `G^XOR+XOR` and of `G^XOR*2` has been without it.
       * Instrumented, the branch fired 0 times while 10,644 annihilations happened
       * elsewhere, which is what a dead path looks like when nothing counts it.
       *
       * WHICH IS WHY IT COUNTS ITSELF. Four changes in a row were reported as having no
       * effect when what had happened is that the code was not on the path being taken.
       */
      const back0 = opposite(r) as any;
      const there: any = to.l;
      const mine: any = r.l;
      /*
       * MATTER TAKES THE RAY IN, AND TAKES ITS MOMENTUM WITH IT.
       *
       * This is the only place momentum crosses between the vacuum and matter, and it has
       * to be an EVENT: the vacuum loses a ray, matter gains the heading that ray had, at
       * the same point in the same tick. Anything else is not a transfer.
       *
       * IT WAS NOT ONE. The ledger in `MATTER` added up what was `arriving` at a point and
       * subtracted the rays standing on it — but ARRIVAL clears `arriving` before that
       * rule runs, so the first term was always nought, and the second subtracted the same
       * standing rays every tick for ever. It integrated a STATE instead of accumulating a
       * FLOW, and matter came out holding ten times the whole vacuum's momentum and
       * swinging: 2714, then 54, then 3521, against a vacuum steady near 500.
       */
      const inside: any[] = mine ? ((b as any).contained?.(mine) ?? []) : [];
      if (inside.length) {
        through(w, b, g, r, mine, inside); return;
      }
      if (there && !there.source && back0?.active && !mine?.source) {
        /*
         * WHAT DECIDES A MEETING — and charge has never been allowed a say in it.
         *
         * `G^XOR+XOR`'s own note says so out loud: "charge does not enter the MEETING at
         * all — two rays that agree in polarity turn whatever their charges are — so this
         * theory has no second annihilation and conserves no charge across a meeting
         * beyond what `clear` wipes". That was the honest limit of one addition at a time.
         *
         * AND IT IS WHY CHARGE IS NOT A CHARGE. Nothing anywhere cancels one against
         * another, so a structure's charge is a plain sum over its points and a thing with
         * a thousand points has a thousand chances to be charged. Measured: |q| ran to 27
         * with correlation 0.57 to mass, and drawing the charge with the polarity, against
         * it, or independently changed none of that — because where it comes FROM was
         * never the problem. Real charge is small because opposite charges ANNIHILATE.
         *
         *   polarity  the meeting is decided by polarity alone, as it has been
         *   charge    by charge alone — then magnetism is what turns and charge is what
         *             annihilates, which is the other way round from `G^XOR`
         *   either    opposite in EITHER sign annihilates, so a meeting is a meeting if
         *             the two disagree about anything
         *   both      only a pair opposite in both goes; agreeing in either is enough to
         *             survive, which is the strictest reading and the one that should
         *             leave the most charge standing
         */
        const decides = w.meets ?? "polarity";
        const pO = r.polarity !== undefined && back0.polarity !== undefined && r.polarity !== back0.polarity;
        const qO = r.charge !== undefined && back0.charge !== undefined && r.charge !== back0.charge;
        const q = r.polarity, theirs = back0.polarity;
        const gone = decides === "charge" ? qO
                   : decides === "either" ? (pO || qO)
                   : decides === "both" ? (pO && qO)
                   : (q === undefined || theirs === undefined || q !== theirs);
        if (gone) {
          const here = mine as any;
          w.met = (w.met ?? 0) + 1;

          /*
           * AND WHAT BECOMES OF THE SIGN THAT DID NOT CAUSE IT.
           *
           * A meeting is decided by ONE of the two signs a boundary carries. `clear` then
           * wipes the ray whole — both signs — so the other one is destroyed by an event
           * it had no part in. That is not what an annihilation does anywhere else in
           * physics: a pair going means everything the pair was carrying has to go
           * SOMEWHERE, and what it was not about is carried off rather than forgotten.
           *
           *   gone     both signs wiped with the rays, as it has been
           *   carried  the sign that did not decide it is put on the point, so the fold
           *            keeps what the meeting was not about
           *   turned   it goes back the way it came — the half-turn a meeting gives, given
           *            to the quantity the meeting was not about
           */
          /* what the two were carrying that the meeting was not about, read before they go */
          const res = w.residue ?? "gone";
          const spare = decides === "polarity" ? "charge" : "polarity";
          const spared = res === "gone" ? 0
            : ((r as any)[spare] ?? 0) + ((back0 as any)[spare] ?? 0);

          clear(r);
          back0.arriving = false;
          clear(back0);

          /*
           * AND IT IS PUT BACK AFTER THEY ARE GONE, WHICH IS THE ONLY MOMENT IT CAN BE.
           *
           * Placed before the clears it was written and then wiped by them — and for
           * `turned` the seat is the very ray coming the other way, which is ACTIVE by
           * definition, since that is why there was a meeting. So the branch either could
           * not fire or fired into something about to be erased, and `carried` and `turned`
           * measured identical to `gone` down to the digit.
           */
          if (res !== "gone" && spared !== 0) {
            const seat = res === "turned" ? back0 : (opposite(r) as any);
            if (seat && !seat.active) {
              seat.active = true;
              (seat as any)[spare] = spared;
              w.carried = (w.carried ?? 0) + 1;
            }
          }
          b.stats.annihilations++;
          here.destroyed += 0.5;
          if (there !== here) { there.destroyed += 0.5; here.fold(there); }
          /* AND THE COLLAPSE SENDS ITSELF OUT — see `implodes` in `G` */
          if (w.implodes) { light(here); w.imploded = (w.imploded ?? 0) + 1; }
          return;
        }
      }

      to.arriving = true;
      for (let i = 0; i < carrying.length; i++)
        carrying[i].writeWaiting(to, carrying[i].read(r));
    });

    /* AND THE CORNERS OF THE ORBITS ARE JOINED, now the walk is done with them */
    const pending: any[] = w.pending ?? [];
    if (pending.length) {
      const rw = b.rewrite;
      for (const [a0, z0] of pending) {
        const a = rw.ray(a0), z = rw.ray(z0);
        a.boundaries[0].link(z.boundaries[0]);
        w.rings = (w.rings ?? 0) + 1;
      }
      w.pending = [];
      rw.flush();
    }
  });

/**
 * THE SAME THEORY WITH ANOTHER READING OF WHOSE CHARGE STEERS — a decoration and not
 * another rule, for the same reason `withSign` is one.
 */
export const withSteering = <T extends { copy(): any; name: string }>(t: T, how: Steering) =>
  (t.copy() as any).decorate.World(() => ({ steering: how })).called(`${t.name} (${how})`);


