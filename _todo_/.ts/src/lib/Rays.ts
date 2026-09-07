/**
 * THE RULE ITSELF, WITH NOTHING DISCRETISED - no lattice, no grid in direction, no closure.
 *
 * Every other solver here approximates the rule twice over. `Local.ts` replaces the turn by
 * 2pi/CYCLE and SNAPS the result to the nearest of twelve or twenty-six exits; `Vlasov2`
 * replaces the continuous distribution by its values on those exits and the turn by a table
 * that, on fcc-12, has the sign of g1 wrong. Both errors were measured: the rule's g1 on fcc is
 * +0.667, the lattice makes it +0.467, and the solver's table makes it -0.600.
 *
 * But the rule is a MARKOV PROCESS and can be run exactly:
 *
 *    travel an exponential free path of mean 1/(absorb + stir)
 *    then with probability absorb/(absorb+stir) the ray is ANNIHILATED
 *              otherwise it TURNS by THETA about a uniformly random axis and carries on
 *
 * That is `steer` verbatim - a fixed turn about wherever the local field points, which in an
 * unbiased vacuum is isotropic - and ANNIHILATION verbatim. Nothing is expanded, truncated or
 * snapped. The only error is the square root of the number of rays.
 *
 * Three things fall out that no grid method gives cheaply:
 *
 *   PATH LENGTH IS TIME. A ray's own clock is how far it has gone, so a source with a schedule
 *   R(tau) is sampled by choosing the emission time, and the retarded structure - which is what
 *   puts the radial nodes where they are - is exact rather than a strobe of a time integration.
 *
 *   TURNS ARE EVENTS. The turning channel is the density of scattering events, which this counts
 *   directly. On the lattice it had to be accumulated in a side array and differenced against a
 *   control run.
 *
 *   IT IS FAST. Ten million rays take a couple of seconds against twenty minutes for one state
 *   on cubic-26, because the cost is per RAY and not per cell per exit per tick.
 *
 * WHAT IT DOES NOT DO. It is LINEAR - the vacuum is a medium with fixed rates, not a population
 * that the source depletes - so `room = (1-rho)^DEG` saturating near the body is absent, and
 * with it the reason the turning came out as a HOLE rather than a heap. This says where the
 * shape goes and how far it reaches. `Vlasov2` on cubic-26 says what the body does to the vacuum
 * it sits in. They answer different halves and neither replaces the other.
 */

export type Rules = {
  theta: number;      // the turn, in radians. 2pi/CYCLE on a lattice; free here
  absorb: number;     // ANNIHILATION rate per unit length
  stir: number;       // `steer` rate per unit length
  /**
   * THE FIELD A RAY IS TURNED ABOUT, if there is one. `fieldAt` in the rules; supplied here by
   * whatever is iterating towards self-consistency. Returning nought at a point means the
   * vacuum, and the turn there falls back to a uniform axis.
   */
  field?: (x: number, y: number, z: number, out: Float64Array) => void;
};

export type Source = {
  /** |amplitude| along a direction with polar cosine mu - the emission's own angular pattern */
  weight: (mu: number, phi: number) => number;
  /** its sign, which is the polarity the ray carries */
  sign: (mu: number, phi: number) => number;
  /** the radial schedule R_nl as a function of retarded time, and its period */
  schedule: (tau: number) => number;
  period: number;
};

export type Bins = {
  /** (r, cos theta) histograms: what arrived, what turned, and the polarity each carried */
  NR: number; NU: number; R: number;
  density: Float64Array;    // rays present, weighted
  turns: Float64Array;      // turning events
  polarity: Float64Array;   // signed density
  /**
   * THE FIELD THE RAYS THEMSELVES MAKE - `fieldAt`, which sums polarity times DIRECTION over
   * what is at a point. Three components per bin. This is the other half of the loop: the rays
   * are turned by a field and they make one, and only by reading it back can the two be
   * compared and a mode be called self-sustaining or not.
   */
  field: Float64Array;
  /**
   * AND ITS RADIAL PART, ACCUMULATED WHERE THE DIRECTION IS STILL KNOWN.
   *
   * The bins are (r, cos theta) with the azimuth integrated out, so the x and y components of a
   * vector cancel round the ring and only z survives - which means the radial component CANNOT
   * be recovered from `field` afterwards. Read back that way an isotropic source gives B_z·u,
   * which is u^2, which projects onto P_2 as two thirds: the measurement reported a P_2 of 1.46
   * for a source that has no angular structure whatever. So r^ . u^ is taken at deposit, where
   * the ray's heading and its position are both in hand, and binned as the scalar it is.
   */
  fieldR: Float64Array;
  rays: number;
};

export const bins = (NR: number, NU: number, R: number): Bins => ({
  NR, NU, R, rays: 0,
  density: new Float64Array(NR * NU),
  turns: new Float64Array(NR * NU),
  polarity: new Float64Array(NR * NU),
  field: new Float64Array(NR * NU * 3),
  fieldR: new Float64Array(NR * NU),
});

/*
 * mulberry32 - a 32-bit generator that is actually tested at 32 bits.
 *
 * The first version here was xorshift128+ with its shift constants (23, 17, 26) transplanted
 * from 64-bit words into 32-bit ones, which is not the same generator and has no claim to its
 * equidistribution. It showed: the free path is drawn as -log(1-u)/Sigma, so the quality of u
 * near 0 and 1 IS the quality of the tail, and the density came out 10% light at r = 4.9 where
 * the exact answer is known - twenty standard deviations, not noise. Nothing else in the tracer
 * had changed. A generator is not a place to improvise.
 */
const rng = (seed: number) => {
  let a = (seed >>> 0) || 1;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/**
 * TURN `u` BY `theta` ABOUT A UNIFORMLY RANDOM AXIS - Rodrigues, with the axis drawn from the
 * sphere. This is the whole of the scattering and it is where every g_l comes from: with the
 * axis uniform, cos(gamma) = cos(theta) + t^2 (1 - cos theta) for t = cos(angle to the axis),
 * which is what `Kernel.ts` integrates in closed form. Here it is not integrated, it is done.
 */
const turn = (u: Float64Array, theta: number, rnd: () => number,
              bx = 0, by = 0, bz = 0) => {
  /*
   * ABOUT THE FIELD WHERE THERE IS ONE, AND UNIFORMLY WHERE THERE IS NOT.
   *
   * `turn.isotropic` says the axis is uniform BECAUSE the vacuum's mean field is nought - which
   * is true of the vacuum and is exactly the assumption that there is no body. A uniform axis
   * carries no direction, so a ray can never be turned COHERENTLY, so no structure can build
   * that was not put in at the source. That is why the linear tracer can only ever transport a
   * shape somebody else specified.
   *
   * `steer` turns about `held`, the field the ray has accumulated, and `fieldAt` makes that out
   * of the same rays. So where a field stands, the axis is IT, and the loop the rules actually
   * describe - turning makes polarity, polarity makes the field, the field does the turning -
   * closes. The uniform draw is kept for where the field is nought, which is the vacuum far
   * from anything, and the two are the same rule read at different field strengths.
   */
  let kx: number, ky: number, kz: number;
  const bm = Math.hypot(bx, by, bz);
  if (bm > 1e-12) { kx = bx / bm; ky = by / bm; kz = bz / bm; }
  else {
    const az = 2 * rnd() - 1, ap = 2 * Math.PI * rnd(), ar = Math.sqrt(Math.max(0, 1 - az*az));
    kx = ar * Math.cos(ap); ky = ar * Math.sin(ap); kz = az;
  }
  const c = Math.cos(theta), s = Math.sin(theta);
  const dot = kx*u[0] + ky*u[1] + kz*u[2];
  const cx = ky*u[2] - kz*u[1], cy = kz*u[0] - kx*u[2], cz = kx*u[1] - ky*u[0];
  const x = u[0]*c + cx*s + kx*dot*(1 - c);
  const y = u[1]*c + cy*s + ky*dot*(1 - c);
  const z = u[2]*c + cz*s + kz*dot*(1 - c);
  const n = Math.hypot(x, y, z) || 1;
  u[0] = x/n; u[1] = y/n; u[2] = z/n;
};

/**
 * Run `count` rays and score them by TRACK LENGTH, which is both exact and far quieter than
 * counting where they happen to be.
 *
 * The first attempt sampled an emission time and scored a ray only at the one instant the
 * strobe caught it. With a long period almost no ray's path lands on that instant, and the
 * measurement came back empty. The fix is the standard estimator and it is better on its own
 * terms: a ray's contribution to the density in a region is the LENGTH OF TRACK it lays down
 * there, so every ray contributes to every bin it crosses and nothing is thrown away.
 *
 * The schedule then costs nothing. Path length IS time - the ray moves at one - so a ray that
 * has gone a distance `l` and is seen at moment `phase` was emitted at `phase - l` and carries
 * `R(phase - l)`. Evaluating that along the track gives the retarded structure exactly, where
 * the lattice runs had to strobe a time integration and discard five sixths of their ticks to
 * approximate it.
 */
export const cast = (o: {
  R: Rules; source: Source; out: Bins; count: number; seed?: number; phase?: number;
}) => {
  const { R, source, out } = o;
  const rnd = rng(o.seed ?? 1);
  /*
   * HOW OFTEN A RAY TURNS IS |B|, NOT A CONSTANT - and that is the whole of the feedback.
   *
   * `steer` banks `sqrt(m2)` - the magnitude of the field the ray has accumulated - and spends
   * one ring step each time the bank reaches one. So the turn RATE is the field strength: a ray
   * where the field is strong turns often, one in a weak field rarely. `vacuum.rates` reads
   * stir = 1 per tick, and that is the VACUUM's value, set by the size of its own fluctuation.
   *
   * With stir held constant the field could only ever set the AXIS a ray turned about, never how
   * often - so turning could not concentrate where the field was, no polarity could pile up
   * there, and nothing could feed itself. Seeded with a P_l ripple every mode came back with a
   * gain of about nought, which is not the rules saying no body exists; it is a tracer with the
   * loop cut.
   *
   * Restored: the total rate is absorb + stir + |B|, and a turn is about the FIELD with
   * probability |B|/(stir + |B|) and about a uniform axis otherwise. At B = 0 that is exactly
   * the vacuum of `turn.isotropic`; where the field dominates it is coherent turning about it.
   */
  const bAt = new Float64Array(3);
  const fieldMag = (x: number, y: number, z: number) => {
    if (!R.field) return 0;
    R.field(x, y, z, bAt);
    return Math.hypot(bAt[0], bAt[1], bAt[2]);
  };
  const phase = o.phase;
  const u = new Float64Array(3), B = new Float64Array(3);
  const NR = out.NR, NU = out.NU, RMAX = out.R;
  const SUB = RMAX / NR / 2;                       // deposit step: half a radial bin

  const at = (x: number, y: number, z: number) => {
    const r = Math.hypot(x, y, z);
    if (r >= RMAX) return -1;
    const ir = Math.min(NR - 1, Math.floor(r / RMAX * NR));
    const mu = r > 0 ? z / r : 0;
    return ir * NU + Math.min(NU - 1, Math.floor((mu + 1) / 2 * NU));
  };
  /*
   * WHAT THE SOURCE WAS DOING WHEN THIS BIT OF TRACK WAS EMITTED - and the schedule has to be
   * the orbital REVERSED, or every radial node is drawn inside out.
   *
   * Radius is retarded time: a ray at radius r was emitted r ago, so the field there is
   * A(t_obs - r) for a source whose amplitude is A. This asked for `A(s) = R_nl(s)` and got
   * `field(r) = R_nl(t_obs - r)` - the profile reversed about the frame. 3s shows it plainly:
   * its schedule changes sign at tau = 1.27 and 4.73, and those rendered at r = 4.58 and 1.12,
   * the outer node inside the inner one. 4d's single node landed at r = 0.21 of a 4.71 frame,
   * under the mask, which is what made it look as though it had no radial structure at all.
   *
   * Solving A(t_obs - r) = R_nl(r) for A gives A(s) = R_nl(t_obs - s): the schedule is the
   * profile run backwards. Written in terms of the path a ray has taken that is simply
   * `R_nl(travelled)`, and `phase` drops out of it entirely - so a ray carries the amplitude
   * belonging to how far it has come, which for an unscattered one is exactly its radius and
   * for a scattered one is correctly further along the schedule than its radius suggests.
   */
  const when = (travelled: number) => {
    if (phase === undefined) return 1;
    const tau = travelled - Math.floor(travelled / source.period) * source.period;
    return source.schedule(tau);
  };

  for (let i = 0; i < o.count; i++) {
    /* WHERE IT IS AIMED, sampled uniformly and CARRIED as a weight rather than rejected - a
     * rejection loop throws rays away and buys nothing when the weight is already bounded */
    const mu = 2 * rnd() - 1, ph = 2 * Math.PI * rnd();
    const w0 = source.weight(mu, ph);
    if (w0 === 0) continue;
    const pol = source.sign(mu, ph);
    const sr = Math.sqrt(Math.max(0, 1 - mu*mu));
    u[0] = sr * Math.cos(ph); u[1] = sr * Math.sin(ph); u[2] = mu;

    let x = 0, y = 0, z = 0, travelled = 0;
    out.rays++;

    for (let hop = 0; hop < 1024; hop++) {
      /* the rates are local now, because |B| is - read them where the ray stands */
      const bm = fieldMag(x, y, z);
      const St = R.absorb + R.stir + bm;
      const pKill = R.absorb / St;
      const step = -Math.log(1 - rnd()) / St;
      /*
       * ONLY THE PART INSIDE THE FRAME IS WALKED. The deposit step is a fraction of a radial
       * bin, so zooming in makes it small - and a ray whose flight is mostly outside the frame
       * was being walked in three hundred pieces to deposit nothing. Where the segment meets the
       * sphere of radius RMAX is a quadratic, so solve it and sub-step between the roots.
       */
      const pu = x*u[0] + y*u[1] + z*u[2];
      const disc = pu*pu - (x*x + y*y + z*z) + RMAX*RMAX;
      if (disc > 0) {
        const sq = Math.sqrt(disc);
        let t0c = Math.max(0, -pu - sq), t1c = Math.min(step, -pu + sq);
        for (let done = t0c; done < t1c; ) {
          const d = Math.min(SUB, t1c - done);
          const mx = x + u[0]*(done + d/2), my = y + u[1]*(done + d/2), mz = z + u[2]*(done + d/2);
          const b = at(mx, my, mz);
          if (b >= 0) {
            const w = w0 * when(travelled + done + d/2) * d;
            out.density[b] += w;
            out.polarity[b] += w * pol;
            /* polarity times heading - the field this bit of track contributes */
            out.field[b*3] += w * pol * u[0];
            out.field[b*3+1] += w * pol * u[1];
            out.field[b*3+2] += w * pol * u[2];
            const rr = Math.hypot(mx, my, mz);
            if (rr > 1e-9)
              out.fieldR[b] += w * pol * (u[0]*mx + u[1]*my + u[2]*mz) / rr;
          }
          done += d;
        }
      }
      x += u[0]*step; y += u[1]*step; z += u[2]*step; travelled += step;
      if (Math.hypot(x, y, z) > RMAX) break;
      if (rnd() < pKill) break;                       // ANNIHILATION
      /*
       * A TURN IS AN EVENT, and the cloud channel counts them. It is scored QUADRATICALLY in the
       * emission amplitude because turning is a meeting: two rays have to agree, so the rate goes
       * as the density squared, which is why the lattice's turning channel reads |Y|^2 where its
       * density reads |Y|.
       */
      const b = at(x, y, z);
      if (b >= 0) { const w = w0 * when(travelled); out.turns[b] += w * w; }
      /* about the field with probability |B|/(stir + |B|), about a uniform axis otherwise */
      const bm2 = fieldMag(x, y, z);
      if (bm2 > 0 && rnd() < bm2 / (R.stir + bm2)) {
        R.field!(x, y, z, B); turn(u, R.theta, rnd, B[0], B[1], B[2]);
      } else turn(u, R.theta, rnd);
    }
  }
  return out;
};

/** divide each (r, mu) bin by its solid-angle-times-shell volume, so a bin is a DENSITY */
export const normalise = (b: Bins, a: Float64Array) => {
  const out = new Float64Array(a.length);
  const dr = b.R / b.NR, dmu = 2 / b.NU;
  for (let ir = 0; ir < b.NR; ir++) {
    const r0 = ir * dr, r1 = r0 + dr;
    const vol = (4/3) * Math.PI * (r1*r1*r1 - r0*r0*r0) * (dmu / 2);
    for (let iu = 0; iu < b.NU; iu++) out[ir*b.NU + iu] = a[ir*b.NU + iu] / (vol * Math.max(1, b.rays));
  }
  return out;
};
