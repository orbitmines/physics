/**
 * THE SAME EQUATION, WRITTEN THE WAY A MACHINE WANTS IT - two orders of magnitude, and not
 * one term of physics changed.
 *
 * `Vlasov.ts` is the equation written the way it reads: a pass for the field, a pass to
 * stream, a pass for what meetings take, a pass for what neutral points make, and an index
 * worked out from (x,y,z,exit,sign) every time one is touched. That is four walks over
 * cells x exits x signs per tick and a multiply-add chain inside each - twenty-four billion
 * inner steps for a twelve-panel render, which is why a big one is out of reach.
 *
 * WHAT IS DIFFERENT HERE, AND IT IS ALL BOOKKEEPING:
 *
 *   ONE PASS INSTEAD OF FOUR. The field, the turn, the stream, the meeting and the making
 *   all happen against the same cell while it is in cache, rather than in four separate
 *   walks that each pull the whole array through memory again.
 *
 *   NEIGHBOURS PRECOMPUTED. Where exit d from cell c lands is a fact about the lattice and
 *   the box, so it is a table of cells x exits built once - no arithmetic and no bounds
 *   check in the inner loop, just a lookup that is -1 at the rim.
 *
 *   TWO POLARITY PLANES, NOT FOUR SIGN SLOTS. Nothing in the rules asks for the four
 *   combinations separately: a meeting is fatal on POLARITY alone and a turn's sense is
 *   CHARGE alone, so the state is two arrays and the charge sense is a sign on the turn
 *   rather than an index. Half the memory and half the traffic.
 *
 *   AND THE MEETING IS FUSED INTO THE STREAM. A ray is killed by what it is about to face,
 *   which is known while it is being moved - so the loss is applied as it goes rather than
 *   in a second walk that has to find the facing cell again.
 *
 * THE PHYSICS IS BIT-FOR-BIT THE SAME EQUATION: transport, a turn about the density's own
 * moment, a source gated on the room left, and a quadratic loss against the oncoming
 * population. `Vlasov.ts` stays as the readable statement of it, and this is what runs.
 */
import { Geometry } from "./Local.ts";

export type Grid = {
  g: Geometry; N: number; C: number; cells: number;
  /**
   * THE FOUR SIGN SLOTS, AND TWO WAS NOT ENOUGH.
   *
   * (G+M/2) splits every neutral point TWICE - once in polarity and once in charge, "from two
   * independent draws" - so a ray carries two signs and there are four combinations of them.
   * Collapsing to two planes and treating charge as a sign on the turn dropped one of the two
   * books entirely: the field is made of POLARITY and the turn's sense is CHARGE, and a
   * picture of the cloud is a picture of the CHARGE that is left over. With one book there was
   * no charge to render and `section` was returning a polarity difference.
   *
   * So the state is four arrays, indexed [cell][exit], for (p,q) = (+,+), (+,-), (-,+), (-,-).
   */
  n: Float64Array[];
  /**
   * HOW MUCH SPACE IS AT EACH CELL, and it is not one.
   *
   * A destroyed pair FOLDS: `here.fold(there)` puts two points into one and credits
   * `destroyed`. An alike meeting INSERTS: `a.insert()` puts a new point between them. So the
   * lattice's own cell count moves as the vacuum runs - it is not a fixed grid with things on
   * it - and the SHORTFALL against what expansion would have made is the deficit. That
   * deficit IS gravity here: `G^XOR^o`'s "the expansion that does not happen there".
   *
   * A fixed grid therefore has no gravity in it at all, which is what this array is for: how
   * much space a cell stands for, moved by folds and inserts, and read as the metric a ray
   * crosses. One is undisturbed.
   */
  space: Float64Array;
  /**
   * WHERE TURNING HAPPENED, PER CELL - which is what the cloud is, and not the field.
   *
   * `atom.cloud` draws "where the centre of mass turns up, counted", and the mass measurement
   * says mass is POLARITY MADE BY TURNING - a corner that sheds polarity leaves 279 closed
   * orbits where one that sheds charge leaves 12. So the thing an electron cloud is made of is
   * the TURN RATE, the alike meetings that insert, and not the charge or polarity field that
   * was being drawn instead. This records it so it can be.
   */
  turns: Float64Array;
  /** what turning has laid down here - the polarity a corner throws off */
  lit: Float64Array;
  /** where exit d from cell c lands, or -1 for off the edge: [cell][exit] */
  nbr: Int32Array;
  /** which exit a turn about axis b lands d on: [b][d] */
  turn: Int16Array;
  /** the unit vectors, flattened, so the field sum is three multiply-adds */
  U: Float64Array;
  /** the opposite exit of each */
  opp: Int32Array;
  /**
   * WHICH EXITS ARE ONE RING STEP FROM EACH - the neighbourhood a turn can reach.
   *
   * `steer` turns a charge ONE ring step about whatever axis the field points along, so what
   * a turn can do to a direction is bounded: it lands on a neighbour, never on the far side.
   * Redistributing a cell's density evenly over every exit - which is what this did - is not
   * a turn at all, it is complete randomisation, and it destroys the angular structure at
   * exactly the rate it fills the gaps in. That is why no amount of it ever both scattered
   * the beams and kept the lobes: it could not.
   */
  ring: Int32Array; ringN: Int32Array;
};

export const grid = (g: Geometry, N: number, wrap = false): Grid => {
  const cells = N * N * N, DEG = g.DEG, C = (N - 1) / 2;
  const nbr = new Int32Array(cells * DEG).fill(-1);
  for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) for (let z = 0; z < N; z++) {
    const c = (x * N + y) * N + z;
    for (let d = 0; d < DEG; d++) {
      const v = (g.L[d] ?? g.U[d]) as number[];
      const a = x + (v[0] | 0), b = y + (v[1] | 0), e = z + ((v[2] ?? 0) | 0);
      /*
       * THE VACUUM HAS NO EDGE, and giving it one is why it had no single occupancy.
       *
       * An open box loses whatever streams out of it, so the level it settles at depends on
       * how far the middle is from a wall: measured on the same rules and the same seed, a
       * 17-box settled at 0.2126 and a 21-box at 0.1364. That is a boundary being reported as
       * a property of the vacuum. Wrapping makes the box homogeneous, which is what the thing
       * being measured is, and the number stops depending on the ruler.
       *
       * A run with a SOURCE keeps the open edge - radiation is supposed to leave and never
       * come back, and wrapping it would fold the outgoing field onto the far side and let a
       * source illuminate itself.
       */
      if (wrap) {
        const a2 = ((a % N) + N) % N, b2 = ((b % N) + N) % N, e2 = ((e % N) + N) % N;
        nbr[c * DEG + d] = (a2 * N + b2) * N + e2;
        continue;
      }
      if (a < 0 || b < 0 || e < 0 || a >= N || b >= N || e >= N) continue;
      nbr[c * DEG + d] = (a * N + b) * N + e;
    }
  }
  const turn = new Int16Array(DEG * DEG);
  for (let b = 0; b < DEG; b++) {
    const axis = g.U[b];
    for (let d = 0; d < DEG; d++) {
      const t = axis ? g.turn(d, axis as any) : d;
      turn[b * DEG + d] = (t === undefined ? d : t);
    }
  }
  const U = new Float64Array(DEG * 3);
  for (let d = 0; d < DEG; d++) {
    const u = (g.U[d] ?? [0, 0, 0]) as number[];
    U[d * 3] = u[0] ?? 0; U[d * 3 + 1] = u[1] ?? 0; U[d * 3 + 2] = u[2] ?? 0;
  }
  const opp = new Int32Array(DEG);
  for (let d = 0; d < DEG; d++) opp[d] = g.OPP[d] ?? d;
  /* every exit a single turn about any axis can move d onto - the small-angle neighbourhood */
  /*
   * AND THE NEIGHBOURHOOD IS MADE SYMMETRIC, because being one step apart is.
   *
   * `g.turn(d, axis)` turns one step in the geometry's own SENSE, so gathering turn(d, b)
   * over every axis b gives the exits d can be turned ONTO and not the ones that can be
   * turned onto d. Scattering into that set moves density preferentially one way round each
   * ring, and an isotropic source came out lopsided: measured, +x over -x at 0.669 and +y
   * over -y at 0.823, while z came out exactly 1 because the exit list happens to be
   * symmetric in it. With this term switched off the same source is symmetric to a part in a
   * thousand, which is what says the fault is here and not in the streaming.
   *
   * Being a step apart is a symmetric relation, so the closure is taken: e is a neighbour of
   * d if d can be turned onto e OR e onto d.
   */
  const near: Set<number>[] = Array.from({ length: DEG }, () => new Set<number>());
  for (let d = 0; d < DEG; d++) for (let b = 0; b < DEG; b++) {
    const t = turn[b * DEG + d];
    if (t !== d && t >= 0) { near[d].add(t); near[t].add(d); }
  }
  const ring = new Int32Array(DEG * DEG).fill(-1), ringN = new Int32Array(DEG);
  for (let d = 0; d < DEG; d++) {
    let k = 0;
    for (const t of near[d]) ring[d * DEG + k++] = t;
    ringN[d] = k;
  }
  const space = new Float64Array(cells).fill(1);
  const turns = new Float64Array(cells);
  return { g, N, C, cells,
    n: [0,1,2,3].map(() => new Float64Array(cells * DEG)),
    space, turns, lit: new Float64Array(cells * DEG), nbr, turn, U, opp, ring, ringN };
};

/**
 * THE FOUR SIGNS AS FOUR PLANES, and it costs almost nothing because the work per plane is
 * the same fused pass it always was: one walk over the cells, neighbours read from a table,
 * every term applied while the cell is in cache. Twice the arrays and twice the traffic
 * against the two-plane version, which is the honest price of carrying the second book that
 * version had simply dropped.
 *
 * POLARITY MAKES THE FIELD AND CHARGE PICKS THE SENSE, which is the whole reason both are
 * needed: `fieldAt` sums polarity times direction, and `steer` turns about that in the sense
 * the CHARGE gives. With one book the field and the turn read the same sign and the two could
 * never disagree - and a cloud of residual CHARGE, which is what an electron is here, had
 * nothing to be made of.
 */
const P_OF = [1, 1, -1, -1];       // the polarity of each slot
const Q_OF = [1, -1, 1, -1];       // and its charge

/* where a corner's recoil lands, given what the permutation says it carries */
const SHED: Record<string, number[][]> = {
  /* by turner slot: [target slots], the amount split evenly between them */
  inherit:  [[0], [1], [2], [3]],
  polarity: [[0, 1], [0, 1], [2, 3], [2, 3]],   /* keep p, both q - mass, no net charge */
  charge:   [[0, 2], [1, 3], [0, 2], [1, 3]],   /* keep q, both p - charge, no net mass */
};

export const AUDIT = { tp: 0, kp: 0, lit: 0, k: 0, opp: 0, same: 0, room: 0, cells: 0 };
export const resetAudit = () => { for (const key of Object.keys(AUDIT)) (AUDIT as any)[key] = 0; };

export const step = (G: Grid, o: {
  nu: number; sigma: number; cap: number; tau: number;
  shine: number; fold: number; stir: number;
  /*
   * WHAT A CORNER THROWS OFF, which `G^XOR^q` counts eighty-four ways of deciding.
   *
   *   "inherit"   the recoil keeps the polarity AND the charge that turned
   *   "polarity"  it keeps the POLARITY and is split evenly over charge, so a turn makes
   *               MASS and no net charge. Opposite polarities then annihilate on meeting and
   *               what is left over is the residue
   *   "charge"    the complement - charge kept, split over polarity - carried so the two can
   *               be told apart by measurement rather than by argument
   */
  carries?: "inherit" | "polarity" | "charge";
}) => {
  const { g, cells, n, space, turns, nbr, turn, U, opp, ring, ringN } = G;
  const DEG = g.DEG, S = 4;
  const out = n.map(a => new Float64Array(a.length));
  const ds = new Float64Array(cells);
  const made = o.nu / (2 * DEG);
  /* buffers that outlive the cell. Each of these was a fresh array PER CELL - a quarter of a
   * million allocations a step apiece, for four numbers and a list of at most twelve ints. */
  const axes = new Int32Array(DEG);
  const scat = new Float64Array(S);

  /*
   * THE FACING DENSITY OF EACH POLARITY, ADDED ONCE INSTEAD OF FOUR TIMES.
   *
   * What a ray meets is the density facing it of the opposite polarity (which kills) and of
   * the alike one (which turns). Those two sums depend only on the EXIT being faced, not on
   * which of the four slots is doing the looking - but the loop re-added them for every slot,
   * so every exit's pair of sums was computed four times over. Added here in the order the
   * slots are listed, which is the order the loop used, so the arithmetic is unchanged.
   */
  const plus = new Float64Array(cells * DEG);
  const minus = new Float64Array(cells * DEG);
  {
    const n0 = n[0], n1 = n[1], n2 = n[2], n3 = n[3];
    for (let i = 0; i < plus.length; i++) {
      plus[i] = n0[i] + n1[i];
      minus[i] = n2[i] + n3[i];
    }
  }

  for (let c = 0; c < cells; c++) {
    const b0 = c * DEG;
    /* the field is POLARITY times direction, summed over every slot and exit */
    let bx = 0, by = 0, bz = 0, tot = 0;
    for (let s = 0; s < S; s++) {
      const a = n[s], pol = P_OF[s];
      for (let d = 0; d < DEG; d++) {
        const w = a[b0 + d];
        if (w === 0) continue;
        tot += w;
        const k = w * pol;
        bx += k * U[d*3]; by += k * U[d*3+1]; bz += k * U[d*3+2];
      }
    }
    const rho = tot / DEG;
    scat[0] = 0; scat[1] = 0; scat[2] = 0; scat[3] = 0;

    if (tot > 0) {
      /*
       * NO FIELD MEANS NO TURN, AND SAYING SO IS NOT PEDANTRY - it is what made an isotropic
       * source lopsided.
       *
       * `nearest` walks the exits in array order and keeps the first whose dot with B beats
       * what it has seen, starting from nought. Where B is genuinely nought - which is exactly
       * what an unbiased vacuum and an isotropic source both give - every dot is rounding
       * noise, so it returns whichever exit comes FIRST in the geometry's own list. fcc-12
       * lists the negative-x directions first, so every cell in the box turned the same way
       * for no reason at all: measured, an isotropic source put 143 units of charge into -x
       * against 84 into +x, while +z and -z came out exactly equal because the list is
       * symmetric in z. A ratio of 0.58 where the answer is 1.
       *
       * So a turn needs a field to turn about. Below this the density goes straight, which is
       * what `steer` does too - it returns the ray unchanged where there is nothing to bend it.
       */
      /*
       * A FIELD BETWEEN EXITS IS TURNED ABOUT ALL OF THEM, and picking one broke the picture.
       *
       * The turn table is indexed by an EXIT, so a field has to be snapped to one - and a
       * field along z on fcc-12 lies exactly between four of them: (+-1,0,1) and (0,+-1,1)
       * all sit at the same 0.707. Taking the first of a tie in array order takes index 2,
       * which is (-0.71, 0, 0.71), so every turn in the box was about an axis tilted towards
       * -x. Measured on a source whose polarity dipole is along z and balanced in x to five
       * figures, the cloud came back with an x-dipole three and a half times STRONGER than
       * the z one it was asked for, and the picture was split along a diagonal.
       *
       * So the tie is shared rather than broken: every exit within a whisker of the best
       * alignment takes an equal part of the turn, which is what a field pointing between
       * them means and which cannot prefer a direction the field does not have.
       */
      const B2 = bx * bx + by * by + bz * bz;
      /* the tied axes, into a buffer that outlives the cell - this was a fresh array per cell,
       * which is a quarter of a million allocations a step for a list of at most twelve ints */
      let nAx = 0;
      let mag = 0;
      if (B2 > 1e-18) {
        let best = -Infinity;
        for (let d = 0; d < DEG; d++) {
          const c2 = bx * U[d*3] + by * U[d*3+1] + bz * U[d*3+2];
          if (c2 > best + 1e-9) { best = c2; nAx = 0; axes[nAx++] = d; }
          else if (c2 > best - 1e-9) axes[nAx++] = d;
        }
        if (best > 1e-12) mag = Math.min(1, Math.sqrt(B2));
        else nAx = 0;
      }

      for (let s = 0; s < S; s++) {
        const a = n[s], pol = P_OF[s], q = Q_OF[s];
        /* what is FACING it with the opposite polarity dies; with the alike one, turns - read
         * off the presums rather than re-added per slot, see `plus`/`minus` above */
        const plusIsLike = pol > 0;
        for (let d = 0; d < DEG; d++) {
          const w = a[b0 + d];
          if (w <= 0) continue;
          /*
           * A MEETING IS ON THE EDGE, AND I HAD IT INSIDE A CELL.
           *
           * `G`'s own words: a meeting is "the two halves of one inserted point facing each
           * other across the edge they were split onto". So what a ray leaving cell c along d
           * runs into is what is leaving the NEIGHBOUR along d back the other way - it is at
           * `nbr[c][d]`, on exit `opp(d)`. What sits at `c` on `opp(d)` is heading the
           * opposite way OUT of the same cell: the two are moving APART and never meet.
           *
           * Reading the partner from the same cell made every source annihilate itself the
           * instant it emitted - a source lights all its exits, so each one found its own
           * opposite as a partner, everything was consumed on the first tick, and no charge
           * ever left the middle cell. Measured, a net of 1e-17 at every radius but the one
           * the source is in.
           */
          const od = opp[d];
          const face = nbr[b0 + d];
          let opp_ = 0, same = 0;
          if (face >= 0) {
            const f0 = face * DEG + od;
            /* the same two sums the loop used to re-add for every one of the four slots: the
             * facing density of each polarity, added in the order the slots are listed */
            const pl = plus[f0], mi = minus[f0];
            opp_ = plusIsLike ? mi : pl;
            same = plusIsLike ? pl : mi;
          }
          let kp = o.sigma * w * opp_, tp = o.tau * w * same;
          AUDIT.opp += opp_; AUDIT.same += same;
          /* nothing may take more than is there - without this the step writes negative
           * densities and the scheme runs away */
          const want = kp + tp;
          if (want > w && want > 0) { const f = w / want; kp *= f; tp *= f; }
          const left = w - kp - tp;
          scat[s] += tp;
          turns[c] += tp;                 // where a corner happened, which is where mass is made
          ds[c] += o.fold * (tp - kp);
          AUDIT.tp += tp; AUDIT.kp += kp;
          if (left <= 0) continue;

          /* the turn: about the field, in the sense the charge gives - shared over every
           * axis the field is equally aligned with, so a tie cannot pick a direction */
          const turnAmt = nAx ? left * mag : 0, str = left - turnAmt;
          if (turnAmt > 0) {
            const each = turnAmt / nAx;
            for (let ia = 0; ia < nAx; ia++) {
              const b = q > 0 ? axes[ia] : opp[axes[ia]];
              const e = turn[b * DEG + d];
              const to = nbr[b0 + (e === d ? d : e)];
              if (to >= 0) out[s][to * DEG + (e === d ? d : e)] += each;
              /*
               * A CORNER ONLY LIGHTS A SEAT THAT IS EMPTY, and taking the average instead of
               * the seat itself made this a runaway.
               *
               * The rule is explicit: `if (seat.active) { w.saturated++; continue; }` - the
               * ray is thrown off ONLY where there is room for it, and a blocked corner is
               * COUNTED rather than forced. Deriving the coefficient from the mean occupancy
               * gives 0.8 everywhere, including right beside a source where every seat is
               * full - so turning radiated, the radiation turned, and that radiated too.
               * Measured, the polarity field grew fifty-fold between two hundred and sixty
               * ticks and twelve hundred, and the two-lobe structure that was there early was
               * gone by the end: not a converged answer, a divergence caught before it showed.
               *
               * So the seat is asked. What is already on it cannot be added to, which is what
               * bounds this and is the same gate `saturated` exists to count.
               */
              if (o.shine > 0 && e !== d) {
                const back = nbr[b0 + od];
                if (back >= 0) {
                  const seat = back * DEG + od;
                  let held = 0;
                  for (let k = 0; k < S; k++) held += n[k][seat];
                  const room2 = Math.max(0, 1 - held);
                  const lit = o.shine * each * room2;
                  const shed = SHED[o.carries ?? "inherit"][s];
                  for (const ts of shed) out[ts][seat] += lit / shed.length;
                  ds[c] -= o.fold * lit;
                  AUDIT.lit += lit;
                }
              }
            }
          }
          if (str > 0) { const to = nbr[b0 + d]; if (to >= 0) out[s][to * DEG + d] += str; }
        }
      }
    }

    /*
     * THE GATE IS NEUTRALITY, NOT FULLNESS. `if (l.source || busy(l)) return` - a point
     * splits only when NOTHING is on it, and `busy` is any active ray at all. So the chance
     * a point splits is the chance every one of its exits is empty, which for exits carrying
     * independently at rho is (1-rho)^DEG. The linear `1 - rho/cap` this replaces is a much
     * softer gate and let the vacuum fill far past where the rule would stop it: at rho = 0.19
     * on fcc-12 the true gate is 0.081 and the linear one gives 0.84, a factor of ten in how
     * often a point is allowed to split.
     */
    const room = Math.pow(Math.max(0, 1 - rho), o.cap);
    /*
     * CREATION IS PER EXIT, AND MULTIPLYING IT BY A COUNT OF POINTS WAS A UNITS ERROR.
     *
     * `made` is nu/(2*DEG) - a rate per exit - and `n` is the fraction of exits carrying.
     * `space[c]` counts the points a cell holds. A cell with twice the points has twice the
     * EXITS as well, so the fraction of them that light is the same: the per-exit rate does
     * not scale with the count. Multiplying the two turned an intensive rate into an
     * extensive one and then fed it back as intensive, which is a gain with nothing on the
     * other side of it.
     *
     * That product is the whole of the runaway, and it needed a source only because a source
     * is what makes alike meetings outnumber opposite WHERE THE DENSITY IS - the aggregate
     * stays unbiased at same/opp = 1.0000 while tp/kp climbs to 4.7, because what drives
     * space is the correlation <w*same> and not the mean. Space then multiplied creation and
     * closed the loop: rho 0.37 to 0.62, space 72 to 4034, while the neutrality gate lost
     * ground it was actually winning - room fell by a factor of 55 and still could not hold.
     *
     * Space keeps its own books either way. Its job is the DEFICIT - the shortfall against
     * what expansion would have made, which is what a mass IS here - and a diagnostic that
     * feeds back into its own source is not measuring anything.
     */
    const k = room > 0 ? made * room : 0;
    AUDIT.k += k; AUDIT.room += room; AUDIT.cells++;
    for (let s = 0; s < S; s++) {
      const spread = scat[s] / DEG;
      for (let d = 0; d < DEG; d++) {
        if (k > 0) out[s][b0 + d] += k;
        if (spread > 0) { const to = nbr[b0 + d]; if (to >= 0) out[s][to * DEG + d] += spread; }
      }
    }
  }

  /*
   * AND THE STIR IS A PASS OF ITS OWN, because it was reading a half-finished tick.
   *
   * It used to run inside the cell loop, so a cell was stirred after the cells before it in
   * the walk had streamed into it and BEFORE the ones after it had - and the walk is x-major.
   * That is an order bias dressed as physics: measured on an isotropic source, +x over -x
   * came to 0.669 and +y over -y to 0.823 while z, which the loop treats last and so most
   * evenly, stayed at 1.000. With the term switched off the same source was symmetric to a
   * part in a thousand. A rule applies to the whole tick or it is not a rule.
   */
  if (o.stir > 0) {
    const was = new Float64Array(DEG);
    /*
     * AND THE STIR IS A CORNER TOO, which is why nothing ever shone.
     *
     * RADIATING reads `turnLog`, and the log has EVERY turn in it - there is no separate
     * "stir" in the lattice, only `steer` about the local field, which in the vacuum is the
     * fluctuating one. Firing the recoil on the coherent turn alone meant it fired on the
     * mean field, and the mean field of an unbiased vacuum is nought: measured, the radiated
     * total came to exactly zero over four hundred ticks with shine at 0.8055.
     *
     * It is gated on `shine`, so `G^XOR+XOR` - which has no corner rule at all, RADIATING
     * being `G^XOR^o`'s and TURNING being `G^XOR^c`'s - passes through untouched at zero.
     *
     * The recoil goes to a buffer rather than into `out` mid-pass. Writing it straight in
     * would let a cell shine onto one the walk has not reached yet and not onto one it has,
     * which is the x-major order bias this block was split out to remove.
     */
    const rad = o.shine > 0 ? Array.from({ length: S }, () => new Float64Array(cells * DEG)) : null;
    for (let c = 0; c < cells; c++) {
      const b0 = c * DEG;
      for (let s = 0; s < S; s++) {
        const a = out[s];
        let any = 0;
        for (let d = 0; d < DEG; d++) { was[d] = a[b0 + d]; any += was[d]; }
        if (any <= 0) continue;
        for (let d = 0; d < DEG; d++) {
          const w = was[d];
          if (w <= 0) continue;
          const k = ringN[d];
          if (!k) continue;
          const turned = w * o.stir;
          a[b0 + d] -= turned;
          const each = turned / k;
          for (let i2 = 0; i2 < k; i2++) a[b0 + ring[d * DEG + i2]] += each;
          /* the recoil: against the heading it had, and only onto a seat that is free */
          if (rad) {
            const od = opp[d], back = nbr[b0 + od];
            if (back >= 0) {
              const seat = back * DEG + od;
              let held = 0;
              for (let k2 = 0; k2 < S; k2++) held += n[k2][seat];
              const lit = o.shine * turned * Math.max(0, 1 - held);
              if (lit > 0) {
                const shed = SHED[o.carries ?? "inherit"][s];
                for (const ts of shed) rad[ts][seat] += lit / shed.length;
                ds[c] -= o.fold * lit;
                AUDIT.lit += lit;
              }
            }
          }
        }
      }
    }
    if (rad) for (let s = 0; s < S; s++) {
      const a = out[s], r = rad[s];
      for (let i2 = 0; i2 < r.length; i2++) a[i2] += r[i2];
    }
  }

  for (let s = 0; s < S; s++) n[s].set(out[s]);
  /*
   * SPACE IS MOVED, NOT MANUFACTURED - and integrating it without saying so is why nothing
   * ever settled.
   *
   * A fold puts two points into one and an insert puts one between two others: both MOVE a
   * point, neither makes one out of nothing. Adding fold·(deflections - kills) every tick with
   * no constraint is an unbounded integrator, and space MULTIPLIES creation - so more space
   * gave more density gave more meetings gave more space. Measured on a steadily pulsing
   * source, the mean went 25 to 3246 over sixteen hundred ticks and the maximum to ten
   * thousand, with the occupancy creeping up behind it. Nothing converged because nothing
   * could, and every claim that a pattern was "a transient" rested on that.
   *
   * So the total is held while the distribution is free: a meeting takes space from where it
   * happened and gives it to where the other kind happened, which is what the two rules do
   * between them. Space being MADE - the expansion at the frontier - is a separate thing this
   * fixed box does not model, and applying it everywhere at once is what the integrator did.
   */
  /*
   * LOCAL, because normalising the mean to one across the whole box was a global coupling
   * that does not exist in any rule: a source in the middle then drained space out of every
   * far cell to keep the total, so the sourced run sat below its own control everywhere and
   * the difference of the two came out uniformly negative. That is the all-blue cloud, made
   * by the fix rather than by the model.
   *
   * A fold destroys the space between two points and an insert makes some, which is what ds
   * already carries. Whether those balance is a question for measurement, not for a rescale.
   */
  for (let c = 0; c < cells; c++) space[c] = Math.max(0.05, space[c] + ds[c]);
};

/** a source: clear its cells and light the exits it fires, with the sign each carries */
export const emit = (G: Grid, o: {
  at: [number, number, number]; radius: number;
  exits: (d: number) => number; amount: number;
  /** how much this exit emits, where the angular part has an amplitude and not only a sign */
  amountAt?: (d: number) => number;
}) => {
  const { g, N, n } = G, DEG = g.DEG, R2 = o.radius * o.radius;
  for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) for (let z = 0; z < N; z++) {
    const dx = x - o.at[0], dy = y - o.at[1], dz = z - o.at[2];
    if (dx*dx + dy*dy + dz*dz > R2) continue;
    const b0 = ((x * N + y) * N + z) * DEG;
    for (let d = 0; d < DEG; d++) {
      const sg = o.exits(d);
      for (let s = 0; s < 4; s++) n[s][b0 + d] = 0;
      if (!sg) continue;
      /*
       * THE POLARITY FLIPS BY HEMISPHERE AND THE CHARGE DOES NOT - which is what the rule
       * says, and flipping both was putting a dipole where the model has none.
       *
       * `G^XOR+XOR`'s EMISSION: `r.polarity = (half(...) === -1 ? -p : p)` and
       * `r.charge = s.charges ?? s.emits` - the polarity is read off which half of the source
       * the exit is in, and the charge is one value for the whole body. Emitting (+p,+q) on
       * one side and (-p,-q) on the other therefore invents a CHARGE dipole the source does
       * not have, and that dipole then shears against its own field: measured, a p_z source
       * came out with a charge dipole along x four and a half times stronger than the one
       * along z it was asked for.
       *
       * So: slot 0 is (+p,+q) and slot 2 is (-p,+q). The shape lives in the polarity, and
       * what the charge does with it is what the picture is of.
       */
      n[sg > 0 ? 0 : 2][b0 + d] = o.amountAt ? o.amountAt(d) : o.amount;
    }
  }
};

/**
 * THE CHARGE in a plane through the middle - and it is the CHARGE and not the polarity.
 *
 * A cloud that could act as an electron is made of the charge the cancelling left over, so
 * what is summed is q and not p. The two are separate books here and reading the wrong one
 * was returning a picture of the field instead of a picture of what is standing in it.
 */
/**
 * THE POLARITY in the same plane - which is where an axial source's SHAPE is.
 *
 * The rule emits polarity by hemisphere and one charge for the whole body, so a p_z source
 * has a polarity dipole and no charge dipole at all: measured, its charge comes out
 * symmetric to five figures in both directions. And a turn about a z-directed field moves
 * charge in the xy-plane, so the steering circulates it rather than stacking it along z.
 * Asking the charge for the shape therefore asks the wrong book - the shape is in the field,
 * and the charge is what is standing in it.
 */
/**
 * THE OPPOSITE CHARGE, AND ITS EXCESS OVER THE BARE VACUUM - which is what could act as an
 * electron, and is not what the source is putting out.
 *
 * The rule gives a body ONE charge for the whole of it - `r.charge = s.charges ?? s.emits` -
 * so a source is a source of its own sign and nothing else. Rendering the charge therefore
 * renders the proton: the same isotropic blob whatever (n, l, m) is asked for, which is what
 * every panel came out as. What a bound cloud is made of is the charge of the OTHER sign, the
 * part the vacuum is left holding once the source has polarised it - and the source never
 * puts any of that anywhere. It is entirely the vacuum's response.
 *
 * So this returns the minority charge less what the undisturbed vacuum carries, which is the
 * excess a source has drawn in or left behind. `bare` is the density each slot settles at
 * with nothing in the box, so subtracting it is subtracting the vacuum rather than a fitted
 * background.
 */
export const opposite = (G: Grid, R: number, bare: number, slab = 1) => {
  const { g, N, C, n } = G, DEG = g.DEG, PX = 2 * R + 1;
  const out = new Float64Array(PX * PX);
  for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) for (let z = 0; z < N; z++) {
    if (Math.abs(y - C) > slab) continue;
    const u = x - C, v = z - C;
    if (Math.abs(u) > R || Math.abs(v) > R) continue;
    const b0 = ((x * N + y) * N + z) * DEG;
    let q = 0;
    /* slots 1 and 3 are the -q ones; the source only ever writes 0 and 2 */
    for (const s of [1, 3]) { const a = n[s];
      for (let d = 0; d < DEG; d++) q += a[b0 + d] - bare; }
    out[(v + R) * PX + (u + R)] += q;
  }
  return out;
};

export const polarity = (G: Grid, R: number, slab = 1) => {
  const { g, N, C, n } = G, DEG = g.DEG, PX = 2 * R + 1;
  const P = [1, 1, -1, -1];
  const out = new Float64Array(PX * PX);
  for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) for (let z = 0; z < N; z++) {
    if (Math.abs(y - C) > slab) continue;
    const u = x - C, v = z - C;
    if (Math.abs(u) > R || Math.abs(v) > R) continue;
    const b0 = ((x * N + y) * N + z) * DEG;
    let p = 0;
    for (let s = 0; s < 4; s++) { const w = P[s], a = n[s];
      for (let d = 0; d < DEG; d++) p += a[b0 + d] * w; }
    out[(v + R) * PX + (u + R)] += p;
  }
  return out;
};

export const section = (G: Grid, R: number, slab = 1) => {
  const { g, N, C, n } = G, DEG = g.DEG, PX = 2 * R + 1;
  const out = new Float64Array(PX * PX);
  for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) for (let z = 0; z < N; z++) {
    if (Math.abs(y - C) > slab) continue;
    const u = x - C, v = z - C;
    if (Math.abs(u) > R || Math.abs(v) > R) continue;
    const b0 = ((x * N + y) * N + z) * DEG;
    let q = 0;
    for (let s = 0; s < 4; s++) { const w = Q_OF[s]; const a = n[s];
      for (let d = 0; d < DEG; d++) q += a[b0 + d] * w; }
    out[(v + R) * PX + (u + R)] += q;
  }
  return out;
};

export const profile = (G: Grid, RMAX: number) => {
  const { g, N, C, n } = G, DEG = g.DEG;
  const net = new Float64Array(RMAX + 1), gross = new Float64Array(RMAX + 1);
  const cnt = new Float64Array(RMAX + 1);
  for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) for (let z = 0; z < N; z++) {
    const r = Math.round(Math.hypot(x - C, y - C, z - C));
    if (r < 1 || r > RMAX) continue;
    const b0 = ((x * N + y) * N + z) * DEG;
    cnt[r]++;
    for (let s = 0; s < 4; s++) { const w = Q_OF[s], a = n[s];
      for (let d = 0; d < DEG; d++) { net[r] += a[b0 + d] * w; gross[r] += a[b0 + d]; } }
  }
  return { net: Array.from(net, (v, i) => cnt[i] ? v/cnt[i] : 0),
           gross: Array.from(gross, (v, i) => cnt[i] ? v/cnt[i] : 0) };
};
