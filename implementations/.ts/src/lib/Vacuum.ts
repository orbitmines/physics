/**
 * ALL OF `G^XOR+XOR` WITH NO LATTICE, AS A POPULATION RATHER THAN AS A BEAM.
 *
 * `Rays.ts` follows rays FROM A SOURCE until they are absorbed. That is the transport half of
 * the rules and it is faithful as far as it goes, but three terms of `vacuum.continuum` are
 * simply absent from it - and they are the three that make matter:
 *
 *    MAKES     nu(1-rho)     a neutral point SPLITS INTO A PAIR. The vacuum makes rays; without
 *                            it nothing is ever created and turning can only redirect a fixed
 *                            budget, so no shape can grow. Seeded with noise, `Rays.ts` washed
 *                            every angular mode out in one pass and left the monopole, which is
 *                            what a pure-transport medium MUST do: g_0 = 1 and g_l < 1.
 *    DEFLECTS  tau n n~      alike facing pairs are TURNED rather than destroyed - what makes
 *                            the vacuum a medium instead of a gas of beams
 *    SHINES    chi (turning)  `G^XOR^o`'s RADIATING: a turn throws off a ray of its own, which
 *                            goes back into the field that bent it. "Turning is what makes
 *                            gravity", as an arithmetic, and the whole of mass
 *
 * So this is a POPULATION: rays are born, stream, meet, turn, shine and die, and the density is
 * whatever that settles at rather than something imposed. Particles for the rays, a grid for
 * what a ray has to know about its neighbourhood - the density it might meet and the field that
 * turns it. No lattice: positions and directions are continuous, and the grid is only where the
 * mean field is read, at whatever resolution is asked for.
 *
 * WHAT IS APPROXIMATED, and it is one thing. ANNIHILATION is quantified over a FACING PAIR, and
 * a faithful reading needs the density of opposite polarity heading the opposite way - a
 * function of direction, per cell. Here it is the cell's opposite-polarity density times how
 * much of it is coming the other way, taken from that population's mean heading. That is the
 * continuum's own `sigma n n~` with n~ read off two moments instead of a full direction
 * histogram; it is exact when the opposing population is beamed and worst when it is isotropic,
 * where it errs by a factor of order one that `sigma` absorbs.
 */

export type Rules = {
  /** the turn one ring step makes: 2pi/CYCLE on a lattice, free here */
  theta: number;
  /** ANNIHILATION - the cross-section for a facing opposite pair */
  sigma: number;
  /** (G+M/3) - alike facing pairs deflect instead of dying */
  tau: number;
  /** (G/2) - a neutral point splits, gated on the room left */
  nu: number;
  /** `steer` - the vacuum's own turning rate, the size of its fluctuating field */
  stir: number;
  /** RADIATING - what fraction of turns throw off a ray. 0 is G^XOR+XOR, >0 is G^XOR^o */
  shine: number;
  /** what the shed ray carries: the recoil's polarity, or its charge */
  makes: "polarity" | "charge";
  /**
   * THE PROTON: A SOURCE, NOT A CLUMP THAT HOLDS ITSELF UP.
   *
   * Several runs were spent trying to seed a body that survives on its own, and every one
   * evaporated inside forty ticks - radial headings leave the box, random headings give
   * `B = sum p u^ ~ 0` so there is no field to be bound by, tangential headings make every ray
   * parallel to the field its own circulation builds. That was the wrong problem. In hydrogen
   * the proton is GIVEN: it sits there, it is charged, and the electron cloud is the vacuum's
   * response to it. It does not need to be a solution of the same equations.
   *
   * So the source is an external, persistent thing - a small region that puts out `rate` rays a
   * tick carrying `charge`, and keeps doing it. What forms around it is what is being asked
   * about.
   */
  source?: {
    rate: number; radius: number; charge: 1 | -1;
    /**
     * WHICH WAYS IT FIRES, AND WHEN - and this is where a state lives.
     *
     * A source need not put out the same amount every way every tick. It can do NOTHING in some
     * directions, more often in others, and the pattern can have a period or any structure at
     * all. Returning 0 means "not this way, not now"; 1 means fire. Different patterns are
     * different setups, and the proposal is that they are what different energy states ARE.
     *
     * This is NOT the same as imposing |Y_lm| as an amplitude, which is what the earlier ray
     * renders did and which makes the answer the input. A pattern says only WHEN AND WHICH WAY
     * the thing fires; what shape the vacuum settles into around it is left to the vacuum.
     */
    pattern?: (ux: number, uy: number, uz: number, tick: number) => number;
    /**
     * THE RADIAL SCHEDULE, WHOSE SIGN IS A NODE.
     *
     * `pattern` is a probability and cannot be negative, so it can say WHERE and WHEN a ray goes
     * but not that R_nl has changed sign - and a radial node IS that sign change. n - l - 1 of
     * them is what separates 4d from 3d at the same angular shape.
     *
     * Path length is time, so what is emitted at tick t stands at radius t: giving the emitted
     * POLARITY the sign of R_nl(t) puts the node at the radius the schedule puts it. The
     * magnitude scales the firing rate, the sign flips the polarity, and the two together are
     * the radial wavefunction rather than a gate.
     */
    schedule?: (tick: number) => number;
    /**
     * THE SOURCE'S OWN MOTION, INSTEAD OF A SHAPE TO EMIT.
     *
     * `pattern` says which directions fire, which means the angular shape is specified rather
     * than produced - typing |Y20|^2 in and reading |Y20|^2 out is not emergence, and the
     * ballistic control confirmed the vacuum added nothing to it.
     *
     * A body in these rules is a region of TURNING with angular momentum. So this says only that:
     * rays go out in every direction equally, and their POLARITY is the sign of how they run
     * against the azimuth. `fieldAt` sums polarity times direction, so that makes B tangential -
     * a circulating body - while the emission itself carries NO angular preference whatever.
     *
     * Whatever shape then appears around it is the vacuum's, made by `steer` turning rays about
     * the field the body's own circulation built. Nothing about a harmonic is put in.
     */
    spin?: "circulating";
  };
};

export type World = {
  N: number; L: number; h: number;          // cells a side, box size, cell size
  /**
   * WHAT ONE PARTICLE STANDS FOR, and without it the vacuum settles in the wrong place.
   *
   * The fixed point is rho ~ 0.6 rays per unit volume, so at one cell per unit volume there is
   * LESS THAN ONE ray in a cell - and `room = 1 - rho` is then being read off a Poisson count of
   * 0, 1 or 2. `max(0, 1-rho)` is convex, so noise in rho biases what it returns UPWARD: measured
   * unweighted, the box settled at 1.33 and went on creating where room should have been nought.
   *
   * A particle therefore carries a weight and stands for `wt` rays. The physics is unchanged -
   * rho, the field and the meeting rates are all sums of weights - but a cell can hold a hundred
   * particles at rho = 0.6 and the gate is read off a smooth number instead of a coin toss.
   */
  wt: number;
  cap: number; n: number;                   // capacity and how many rays are alive
  x: Float64Array; y: Float64Array; z: Float64Array;
  ux: Float64Array; uy: Float64Array; uz: Float64Array;
  p: Int8Array; q: Int8Array;               // polarity and charge, the two signs a ray carries
  /**
   * WHICH BEAT OF THE VACUUM A RAY BELONGS TO - and leaving it out is why the field was screened
   * inside one length unit.
   *
   * The vacuum is not a medium with steady rates. It BEATS: on one tick a neutral point splits
   * and makes a pair, on the next the facing opposites annihilate. Applying both every tick as a
   * Poisson rate - which is what a continuous `dt` does - is the mean of that cycle with the
   * cycle taken out, and the cycle is the physics. Everything then dies at the average rate,
   * which is one mean free path, and nothing can reach.
   *
   * What propagates is what is OUT OF PHASE. A ray whose beat does not line up with the local
   * annihilating one is not offered a partner: it passes through and keeps going, and it is
   * still going when it meets what is travelling sideways on the other beat. That crossing is
   * where the bending and the organising happen, and it can only happen at range because the
   * out-of-phase ray got there.
   *
   * So a ray carries its beat, and ANNIHILATION is quantified over facing opposites OF THE SAME
   * BEAT. Two beats means half the opposing population is invisible to any given ray.
   */
  ph: Int8Array;
  /**
   * THE RING, WHICH IS IN THE AZIMUTH AND NOT IN THE PITCH.
   *
   * A turn by THETA about b^ CONSERVES u^ . b^ and advances the azimuth about b^ by THETA. So the
   * pitch is a constant of the motion and says nothing about the rotation; what is quantised is
   * the azimuth, which takes CYCLE = 2pi/THETA discrete values before coming back to where it
   * started. That is the finite ring, and it is a property of the RULE - a fixed turn angle - and
   * not of any lattice. It is here in the continuum too, and measuring the pitch instead of the
   * azimuth is what hid it.
   *
   * A ray therefore carries how many turns it has taken and the heading it had at the last
   * multiple of CYCLE. If the ring closes, the two agree after CYCLE turns.
   */
  nturn: Int32Array;
  u0x: Float64Array; u0y: Float64Array; u0z: Float64Array;
  /* per cell, rebuilt every tick */
  rho: Float64Array;                        // how many rays, per unit volume
  rhoP: Float64Array; rhoM: Float64Array;   // split by polarity
  rhoPB: Float64Array; rhoMB: Float64Array; // and again by BEAT: [beat*cells + c]
  Bx: Float64Array; By: Float64Array; Bz: Float64Array;   // sum of p * u^ - the FIELD
  /**
   * THE MEAN HEADING OF EACH POPULATION SEPARATELY - and using the TOTAL one was a bug that
   * manufactured the screening.
   *
   * ANNIHILATION is quantified over a FACING pair, so what a ray must be checked against is
   * where the OPPOSING polarity is going, not where everything is going. A pair made together
   * moves APART, so a population created on one beat never faces itself and annihilates not at
   * all: it propagates freely, and is only met where it runs into something of another origin
   * coming the other way. That is why a field can reach.
   *
   * Read against the total heading, that vanishes. Near a body the isotropic vacuum outnumbers
   * the body's own rays, so the cell's mean heading is nought whatever the body is doing, every
   * ray scores half-facing, and a perfectly coherent outgoing beam is annihilated as though it
   * were isotropic. The field then dies in one mean free path BY CONSTRUCTION - which is the
   * screening length that blocked the shells, and it was mine and not the theory's.
   */
  JPx: Float64Array; JPy: Float64Array; JPz: Float64Array;   // where the +polarity is heading
  JMx: Float64Array; JMy: Float64Array; JMz: Float64Array;   // and the -polarity
  rhoN: Float64Array;                       // raw particle COUNT, for averaging headings
  nP: Float64Array; nM: Float64Array;       // counts per polarity, to average their headings
  turned: Float64Array;                     // turns per cell this tick - what SHINES reads
  ticks: number;
  /** the ring's own measurement: <u^ . u^0> after a full lap of CYCLE turns, and after half */
  recur: number; recurN: number; half: number; halfN: number;
  /**
   * AND THE SAME SPLIT BY HOW COHERENT THE FIELD WAS.
   *
   * A ring closes only if the AXIS PERSISTS across the whole lap. In the vacuum B is a
   * fluctuation and every turn is about a fresh random direction - which is `turn.isotropic`,
   * and it randomises by construction. Averaged over the whole box the vacuum's rays outnumber a
   * body's several times over and swamp it. So the closure is accumulated separately for turns
   * taken where the field is STRONG, which is where it is also steady, and that is the only
   * place the question means anything.
   */
  recurB: number; recurBN: number; halfB: number; halfBN: number;
};

export const world = (N: number, L: number, cap: number, wt = 1): World => ({
  N, L, h: L / N, wt, cap, n: 0,
  x: new Float64Array(cap), y: new Float64Array(cap), z: new Float64Array(cap),
  ux: new Float64Array(cap), uy: new Float64Array(cap), uz: new Float64Array(cap),
  p: new Int8Array(cap), q: new Int8Array(cap), ph: new Int8Array(cap),
  nturn: new Int32Array(cap),
  u0x: new Float64Array(cap), u0y: new Float64Array(cap), u0z: new Float64Array(cap),
  rho: new Float64Array(N*N*N), rhoP: new Float64Array(N*N*N), rhoM: new Float64Array(N*N*N),
  rhoPB: new Float64Array(2*N*N*N), rhoMB: new Float64Array(2*N*N*N),
  Bx: new Float64Array(N*N*N), By: new Float64Array(N*N*N), Bz: new Float64Array(N*N*N),
  JPx: new Float64Array(N*N*N), JPy: new Float64Array(N*N*N), JPz: new Float64Array(N*N*N),
  JMx: new Float64Array(N*N*N), JMy: new Float64Array(N*N*N), JMz: new Float64Array(N*N*N),
  nP: new Float64Array(N*N*N), nM: new Float64Array(N*N*N),
  rhoN: new Float64Array(N*N*N), turned: new Float64Array(N*N*N), ticks: 0,
  recur: 0, recurN: 0, half: 0, halfN: 0, recurB: 0, recurBN: 0, halfB: 0, halfBN: 0,
});

const rng = (seed: number) => {
  let a = (seed >>> 0) || 1;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** turn u by theta about b, or about a uniform axis where there is no b - `steer` */
const spin = (w: World, i: number, theta: number,
              bx: number, by: number, bz: number, rnd: () => number) => {
  let kx: number, ky: number, kz: number;
  const bm = Math.hypot(bx, by, bz);
  if (bm > 1e-12) { kx = bx/bm; ky = by/bm; kz = bz/bm; }
  else {
    const az = 2*rnd() - 1, ap = 2*Math.PI*rnd(), ar = Math.sqrt(Math.max(0, 1 - az*az));
    kx = ar*Math.cos(ap); ky = ar*Math.sin(ap); kz = az;
  }
  const c = Math.cos(theta), s = Math.sin(theta);
  const ux = w.ux[i], uy = w.uy[i], uz = w.uz[i];
  const d = kx*ux + ky*uy + kz*uz;
  const nx = ux*c + (ky*uz - kz*uy)*s + kx*d*(1 - c);
  const ny = uy*c + (kz*ux - kx*uz)*s + ky*d*(1 - c);
  const nz = uz*c + (kx*uy - ky*ux)*s + kz*d*(1 - c);
  const m = Math.hypot(nx, ny, nz) || 1;
  w.ux[i] = nx/m; w.uy[i] = ny/m; w.uz[i] = nz/m;
};

const cellOf = (w: World, i: number) => {
  const a = Math.floor((w.x[i] / w.L + 0.5) * w.N);
  const b = Math.floor((w.y[i] / w.L + 0.5) * w.N);
  const c = Math.floor((w.z[i] / w.L + 0.5) * w.N);
  if (a < 0 || b < 0 || c < 0 || a >= w.N || b >= w.N || c >= w.N) return -1;
  return (a * w.N + b) * w.N + c;
};

/** everything a ray needs to know about where it stands, rebuilt from the rays themselves */
export const gather = (w: World) => {
  w.rho.fill(0); w.rhoP.fill(0); w.rhoM.fill(0); w.rhoN.fill(0);
  w.rhoPB.fill(0); w.rhoMB.fill(0);
  w.Bx.fill(0); w.By.fill(0); w.Bz.fill(0);
  w.JPx.fill(0); w.JPy.fill(0); w.JPz.fill(0);
  w.JMx.fill(0); w.JMy.fill(0); w.JMz.fill(0);
  w.nP.fill(0); w.nM.fill(0);
  const vol = w.h * w.h * w.h;
  for (let i = 0; i < w.n; i++) {
    const c = cellOf(w, i);
    if (c < 0) continue;
    w.rho[c] += w.wt;
    const cells = w.N*w.N*w.N, bc = w.ph[i] * cells + c;
    if (w.p[i] > 0) { w.rhoP[c] += w.wt; w.rhoPB[bc] += w.wt; }
    else            { w.rhoM[c] += w.wt; w.rhoMB[bc] += w.wt; }
    /* THE FIELD IS THE DENSITY'S OWN MOMENT - `fieldAt` sums polarity times direction */
    w.Bx[c] += w.wt*w.p[i]*w.ux[i]; w.By[c] += w.wt*w.p[i]*w.uy[i]; w.Bz[c] += w.wt*w.p[i]*w.uz[i];
    if (w.p[i] > 0) { w.JPx[c] += w.ux[i]; w.JPy[c] += w.uy[i]; w.JPz[c] += w.uz[i]; w.nP[c]++; }
    else            { w.JMx[c] += w.ux[i]; w.JMy[c] += w.uy[i]; w.JMz[c] += w.uz[i]; w.nM[c]++; }
    w.rhoN[c] += 1;
  }
  for (let c = 0; c < w.rho.length; c++) {
    const kp = w.nP[c] || 1, km = w.nM[c] || 1;
    w.JPx[c] /= kp; w.JPy[c] /= kp; w.JPz[c] /= kp;
    w.JMx[c] /= km; w.JMy[c] /= km; w.JMz[c] /= km;
    w.rho[c] /= vol; w.rhoP[c] /= vol; w.rhoM[c] /= vol;
    w.rhoPB[c] /= vol; w.rhoMB[c] /= vol;
    w.rhoPB[w.rho.length + c] /= vol; w.rhoMB[w.rho.length + c] /= vol;
    w.Bx[c] /= vol; w.By[c] /= vol; w.Bz[c] /= vol;
  }
};

/** ONE TICK: every rule fires over its own matches, and what they do to the population adds */
export const tick = (w: World, R: Rules, dt: number, seed: number) => {
  const rnd = rng(seed * 2654435761 + w.ticks);
  gather(w);
  w.turned.fill(0);
  const vol = w.h * w.h * w.h;

  /*
   * BOTH RULES FIRE EVERY TICK; THE BEAT IS THE RAY'S, NOT THE CLOCK'S.
   *
   * Gating the whole box - split on even ticks, kill on odd - makes every ray share one beat, so
   * they are all in phase with each other and all die together: measured, the population went
   * 204800 -> 0 -> 204800 with nothing surviving a cycle. That is a global metronome and the
   * lattice has none. Every rule fires every tick, at whatever points match it.
   *
   * What a ray carries is WHICH TICK MADE IT, and ANNIHILATION is only offered a partner of the
   * same beat. So the vacuum is two interleaved populations that pass straight through one
   * another - the same structure as fcc-12's two sublattices, in time rather than in space - and
   * what one sheds travels through the other without being killed by it. That is the out-of-phase
   * propagation, and it is what can reach.
   */
  const dead = new Uint8Array(w.n);
  const bornX: number[] = [], bornY: number[] = [], bornZ: number[] = [];
  const bornUx: number[] = [], bornUy: number[] = [], bornUz: number[] = [];
  const bornP: number[] = [], bornQ: number[] = [], bornPh: number[] = [];
  const bear = (x: number, y: number, z: number,
                ux: number, uy: number, uz: number, p: number, q: number, ph: number) => {
    bornX.push(x); bornY.push(y); bornZ.push(z);
    bornUx.push(ux); bornUy.push(uy); bornUz.push(uz);
    bornP.push(p); bornQ.push(q); bornPh.push(ph);
  };

  for (let i = 0; i < w.n; i++) {
    /* MOVEMENT - one cell a tick along its own exit, and the speed is one */
    w.x[i] += w.ux[i]*dt; w.y[i] += w.uy[i]*dt; w.z[i] += w.uz[i]*dt;
    const c = cellOf(w, i);
    if (c < 0) { dead[i] = 1; continue; }              // an open box: what leaves is gone

    /* ONLY THE SAME BEAT IS A PARTNER. A ray meets facing opposites of its own beat and passes
     * straight through the other one's - which is what lets an out-of-phase ray travel. */
    const cells = w.N*w.N*w.N, bc = w.ph[i] * cells + c;
    const opp = w.p[i] > 0 ? w.rhoMB[bc] : w.rhoPB[bc];
    const like = w.p[i] > 0 ? w.rhoPB[bc] : w.rhoMB[bc];
    /*
     * HOW MUCH OF THAT IS COMING THE OTHER WAY. A meeting needs a FACING pair, so what counts is
     * not the opposing density but the part of it heading against this ray. Read off the cell's
     * mean heading: (1 - u^ . J^)/2 is 1 for a population coming straight at it and 0 for one
     * travelling alongside.
     */
    /* against where the OPPOSING polarity is actually going. 1 for a population coming straight
     * at this ray, 0 for one travelling alongside it - and a coherently expanding shell is the
     * second, so it is not annihilated and keeps going. */
    const ox = w.p[i] > 0 ? w.JMx[c] : w.JPx[c];
    const oy = w.p[i] > 0 ? w.JMy[c] : w.JPy[c];
    const oz = w.p[i] > 0 ? w.JMz[c] : w.JPz[c];
    const face = 0.5 * (1 - (w.ux[i]*ox + w.uy[i]*oy + w.uz[i]*oz));

    /* ANNIHILATION - opposite polarities facing, of the SAME BEAT, and both ends die. It fires
     * on the beat that is not splitting, which is what makes the two alternate rather than
     * average into one another. */
    if (rnd() < R.sigma * opp * face * dt) { dead[i] = 1; continue; }
    /* (G+M/3) - ALIKE facing turns back instead of dying. Nothing is lost; this is what makes
     * the vacuum a medium rather than a gas of beams */
    if (rnd() < R.tau * like * face * dt) {
      w.ux[i] = -w.ux[i]; w.uy[i] = -w.uy[i]; w.uz[i] = -w.uz[i];
      continue;
    }
    /* `steer` - turn about the local field, at a rate that IS the field's size */
    const bm = Math.hypot(w.Bx[c], w.By[c], w.Bz[c]);
    if (rnd() < (R.stir + bm) * dt) {
      /*
       * THE RING IS COUNTED HERE. Before turning, if this ray has just completed CYCLE turns,
       * compare where it is heading with where it headed CYCLE turns ago: if the ring closes,
       * they agree. Then re-snapshot. `recur` accumulates u^ . u^0 over every ray that closed a
       * lap, which is the ring's own measurement and needs no lattice to make sense of.
       */
      const CYCLE = Math.max(1, Math.round(2 * Math.PI / R.theta));
      if (w.nturn[i] > 0 && w.nturn[i] % CYCLE === 0) {
        const dot = w.ux[i]*w.u0x[i] + w.uy[i]*w.u0y[i] + w.uz[i]*w.u0z[i];
        w.recur += dot; w.recurN++;
        if (bm > 4 * R.stir) { w.recurB += dot; w.recurBN++; }
        w.u0x[i] = w.ux[i]; w.u0y[i] = w.uy[i]; w.u0z[i] = w.uz[i];
      } else if (w.nturn[i] === 0) {
        w.u0x[i] = w.ux[i]; w.u0y[i] = w.uy[i]; w.u0z[i] = w.uz[i];
      }
      /* and the same lap length measured against a HALF lap, as a control: a ray that is merely
       * diffusing scores the same on both, one that is going round scores high on the full lap
       * and low on the half */
      if (w.nturn[i] > 0 && (w.nturn[i] * 2) % CYCLE === 0 && w.nturn[i] % CYCLE !== 0) {
        const dh = w.ux[i]*w.u0x[i] + w.uy[i]*w.u0y[i] + w.uz[i]*w.u0z[i];
        w.half += dh; w.halfN++;
        if (bm > 4 * R.stir) { w.halfB += dh; w.halfBN++; }
      }
      w.nturn[i]++;
      /*
       * THE SENSE OF THE TURN IS THE CHARGE - the whole of q in qv x B, and it was missing.
       *
       * `G^XOR+XOR`'s `steer` reads `const axis = q > 0 ? held : -held`: a positive charge turns
       * one way about the field and a negative one the other. Until now `q` was carried on every
       * ray and read by nothing, so the two charges did the same thing everywhere and could not
       * separate. Nothing charge-shaped could form, which is why every angular measurement came
       * back at the noise floor.
       *
       * With it, the two species curve oppositely in the same field and go to different places -
       * which is the first step of getting charge to pile up somewhere the other does not.
       */
      const qs = w.q[i] > 0 ? 1 : -1;
      spin(w, i, R.theta, qs*w.Bx[c], qs*w.By[c], qs*w.Bz[c], rnd);
      w.turned[c] += 1;
      /*
       * RADIATING - the turn throws off a ray of its own, AGAINST the heading it had, carrying
       * what the corner makes. This is the term that lets turning ADD to the population instead
       * of only redirecting it, and so the only route by which a shape can feed itself.
       */
      if (R.shine > 0 && rnd() < R.shine) {
        const pp = R.makes === "polarity" ? (w.p[i] > 0 ? -1 : 1) : w.p[i];
        const qq = R.makes === "charge" ? (w.q[i] > 0 ? -1 : 1) : w.q[i];
        /* what a turn sheds belongs to the OTHER beat - it is made between the splitting and
         * the annihilating, which is the whole of why it can travel */
        bear(w.x[i], w.y[i], w.z[i], -w.ux[i], -w.uy[i], -w.uz[i], pp, qq, 1 - w.ph[i]);
      }
    }
  }

  /*
   * (G/2) - A NEUTRAL POINT SPLITS INTO A PAIR, and only where there is room.
   *
   * This is the term whose absence made the transport model unable to grow anything. It fires
   * per unit VOLUME rather than per ray - the vacuum makes rays where there are none - and it is
   * gated on `1 - rho`, so a full cell makes nothing and an empty one makes at the full rate.
   * That gate is the whole of the vacuum's fixed point: it settles where what a split makes
   * pays for what the meetings take.
   */
  /*
   * AND THE TICK IS A TICK. Creation and annihilation are not two things happening at once at
   * their average rates - they ALTERNATE, and a sub-tick `dt` that applies both every step is
   * the cycle replaced by its mean. Splitting fires on one beat and the meetings on the other,
   * so a pair made now is not offered to the killing until the beat comes round, and the field
   * a turn sheds in between travels on the beat that is not being killed.
   */
  for (let c = 0; c < w.rho.length; c++) {
    const room = Math.max(0, 1 - w.rho[c]);
    /* a PAIR is two rays, so the number of pairs is the ray budget over two weights */
    const expect = R.nu * room * vol * dt / (2 * w.wt);
    let k = Math.floor(expect);
    if (rnd() < expect - k) k++;
    for (let j = 0; j < k; j++) {
      const a = c / (w.N*w.N) | 0, b = (c / w.N | 0) % w.N, e = c % w.N;
      const px = ((a + rnd()) / w.N - 0.5) * w.L;
      const py = ((b + rnd()) / w.N - 0.5) * w.L;
      const pz = ((e + rnd()) / w.N - 0.5) * w.L;
      /* a PAIR: two ends, opposite polarity, going opposite ways */
      const az = 2*rnd() - 1, ap = 2*Math.PI*rnd(), ar = Math.sqrt(Math.max(0, 1 - az*az));
      const dx = ar*Math.cos(ap), dy = ar*Math.sin(ap), dz = az;
      const qq = rnd() < 0.5 ? 1 : -1;
      /* a split makes a pair on the beat that is splitting */
      const bt = w.ticks & 1;
      bear(px, py, pz,  dx,  dy,  dz,  1, qq, bt);
      bear(px, py, pz, -dx, -dy, -dz, -1, qq, bt);
    }
  }

  /*
   * AND THE SOURCE EMITS - the proton, held at whatever it is, tick after tick.
   *
   * Its rays go out isotropically carrying its charge; the POLARITY is split evenly, because a
   * source that emitted one polarity would be a source of field rather than of charge and the
   * two are different things. What the vacuum does with them is the measurement.
   */
  if (R.source) {
    const k = Math.round(R.source.rate / w.wt);
    for (let j = 0; j < k; j++) {
      const rr = R.source.radius * Math.cbrt(rnd());
      const uu = 2*rnd()-1, pp = 2*Math.PI*rnd(), ss = Math.sqrt(Math.max(0, 1-uu*uu));
      const dx = ss*Math.cos(pp), dy = ss*Math.sin(pp), dz = uu;
      /* the pattern decides whether this way, this tick, fires at all */
      if (R.source.pattern && rnd() >= R.source.pattern(dx, dy, dz, w.ticks)) continue;
      /* the schedule's SIZE gates the firing and its SIGN sets the polarity - a node is where
       * the polarity flips, which is what a radial node is */
      let pol = rnd() < 0.5 ? 1 : -1;
      if (R.source.spin === "circulating") {
        /* the polarity is the sign against phi^ - the body turns, the emission does not favour
         * any direction, and B comes out tangential because `fieldAt` sums p times d^ */
        const rho2 = Math.hypot(rr*dx, rr*dy) || 1;
        const fx = -(rr*dy)/rho2, fy = (rr*dx)/rho2;
        pol = (dx*fx + dy*fy) >= 0 ? 1 : -1;
      }
      if (R.source.schedule) {
        const a = R.source.schedule(w.ticks);
        if (rnd() >= Math.min(1, Math.abs(a))) continue;
        pol = a >= 0 ? 1 : -1;
      }
      bear(rr*dx, rr*dy, rr*dz, dx, dy, dz, pol, R.source.charge, w.ticks & 1);
    }
  }

  /* compact the dead away, then append what was born */
  let k = 0;
  for (let i = 0; i < w.n; i++) {
    if (dead[i]) continue;
    if (k !== i) {
      w.x[k]=w.x[i]; w.y[k]=w.y[i]; w.z[k]=w.z[i];
      w.ux[k]=w.ux[i]; w.uy[k]=w.uy[i]; w.uz[k]=w.uz[i];
      w.p[k]=w.p[i]; w.q[k]=w.q[i]; w.ph[k]=w.ph[i]; w.nturn[k]=w.nturn[i];
      w.u0x[k]=w.u0x[i]; w.u0y[k]=w.u0y[i]; w.u0z[k]=w.u0z[i];
    }
    k++;
  }
  for (let j = 0; j < bornX.length && k < w.cap; j++, k++) {
    w.x[k]=bornX[j]; w.y[k]=bornY[j]; w.z[k]=bornZ[j];
    w.ux[k]=bornUx[j]; w.uy[k]=bornUy[j]; w.uz[k]=bornUz[j];
    w.p[k]=bornP[j]; w.q[k]=bornQ[j]; w.ph[k]=bornPh[j]; w.nturn[k]=0;
  }
  w.n = k;
  w.ticks++;
  return { born: bornX.length, died: dead.reduce((a: number, b) => a + b, 0) };
};
