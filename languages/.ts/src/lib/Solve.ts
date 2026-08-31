/**
 * THE DERIVED EQUATIONS, INTEGRATED — the last step from a rule to a number.
 *
 * `lib/Continuum.ts` reads the model off the rules and hands back two coupled lines:
 *
 *     (d_t + (d^·grad_x)/s) n = nu(1-rho) - sigma n n~ F + Sigma
 *      d_t s                  = nu(1-rho) - sigma n n~ F
 *
 * WHICH IS A METRIC THEORY, and it is worth saying why before solving it. `s` is how many
 * points a place stands for — what (G/1) folded into it — and it DIVIDES the transport, so
 * radiation crosses folded space slower. `n` is the radiation, and its meetings are what fold
 * space in the first place. Geometry tells radiation how to move; radiation tells geometry how
 * to curve. Neither of those was put in: the first is (G/2) and (G/1) counted, the second is
 * the local rule that a ray crossing a place that stands for `s` points takes `s` ticks.
 *
 * SOLVED RADIALLY, because that is the shape a body has. Nothing here is specific to gravity:
 * it steps the two lines forward on a radial grid until they stop moving, with matter written
 * in the only way the rules allow — a region whose points are not neutral, so `nu(1-rho)` does
 * not fire there. That IS the body. There is no force in this file and no potential.
 *
 * WHAT COMES OUT is `s(r)` — the metric — and what a reader wants from it is the DEFICIT
 * against the undisturbed vacuum far away, since that is what a second body falls into.
 */

export type Rates = {
  /** (G/2): a neutral point splits, gated on the room left */
  nu: number;
  /** ANNIHILATION: a facing pair of opposite sign, quadratic and against the oncoming current */
  sigma: number;
  /** the facing factor - a half in an unbiased vacuum, one head-on, nought co-moving */
  F: number;
  /** how many ways out of a point - the lattice's own count */
  DEG: number;
  /** the dimension the shell grows in */
  D: number;
  /**
   * HOW FORWARD-PEAKED THE SCATTERING IS — `g = <cos theta>` over the kernel, and the one
   * number that decides how far a direction survives.
   *
   * A ray reaching a place that has swallowed folds leaves by one of the ways the folds
   * offer, weighted against carrying straight on. `g = 0` is isotropic: it forgets where it
   * was going, and a shadow dies in one mean free path - which is pure absorption followed by
   * isotropic re-creation, and is what `G` does today. `g -> 1` is "keep going unless a fold
   * offers otherwise": the medium stays thick for any one ray and becomes transparent to the
   * DIRECTION, and a shadow survives the TRANSPORT mean free path
   *
   *     lambda_tr = lambda / (1 - g)
   *
   * which is where a power law can live. `turn.kernel` gives `g_l = <P_l(cos gamma)>` in
   * closed form, so this is a number the model computes rather than one anybody chooses.
   */
  g?: number;
};

export type Body = {
  /** how many cells of the grid the body owns, from the centre out */
  radius: number;
};

export type Solved = {
  /** the radial grid, one entry per cell */
  r: number[];
  /** how many points each place stands for - the metric */
  s: number[];
  /** the radiation density there */
  n: number[];
  /**
   * THE IMBALANCE: what arrives from outside less what comes back from inside.
   *
   * A body eats what lands on it, so less comes back out from behind it than goes in. That
   * difference is the shadow, and it is what a second body is pushed into - the force, before
   * anything has been said about a force.
   */
  excess: number[];
  /** what the vacuum settles at with nothing in it */
  rho: number;
  ticks: number;
  settled: boolean;
};

/**
 * WHAT THE VACUUM SETTLES AT ON ITS OWN — where making pays for killing exactly.
 *
 * `nu(1-rho) = sigma rho^{2} F` is the whole of it, and it is the one number the equations fix
 * without any geometry: a quadratic, solved once. Everything else in this file is what happens
 * to that number when something is in the way.
 */
export const settles = (R: Rates): number => {
  /* sigma F rho^2 + nu rho - nu = 0 */
  const a = R.sigma * R.F, b = R.nu, c = -R.nu;
  if (a === 0) return 1;
  return (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
};

/**
 * STEP THE TWO LINES UNTIL THEY STOP MOVING.
 *
 * EXPLICIT AND SLOW ON PURPOSE. A relaxation that jumps to the fixed point would be solving a
 * different problem — the equations are what the rules come to, and what is wanted is where
 * THEY settle, reached the way they would reach it. The transport is upwind: what crosses a
 * shell arrives from the shell inside it, at `1/s` of a cell a tick, and is shared over the
 * room at this radius, which is what `r^{D-1}` counts.
 */
/**
 * STEP THE TWO LINES UNTIL THEY STOP MOVING.
 *
 * TWO POPULATIONS, BECAUSE THE EQUATION SAYS SO. `sigma n n~ F` is a ray against the ONCOMING
 * one - that is what makes a meeting a meeting rather than a decay, and it is why the term is
 * quadratic. Collapsed to `n^{2}` it says a population annihilates against itself, which no
 * rule of G does. So the grid carries `out` and `in` separately, they are made in equal
 * numbers by (G/2), and they kill each other.
 *
 * AND THAT IS ALSO WHERE GRAVITY IS. A body absorbs what lands on it, so fewer rays come back
 * OUT from behind it than go IN - the imbalance between the two is the shadow, and a second
 * body is pushed into it. One population cannot express that; it is the whole mechanism.
 *
 * EXPLICIT AND SLOW ON PURPOSE. What is wanted is where the equations settle, reached the way
 * they would reach it. Transport is upwind at `1/s` of a cell a tick, shared over the room at
 * this radius, which is what `r^{D-1}` counts.
 */
/**
 * STEP THE TWO LINES UNTIL THEY STOP MOVING — over PLACE AND DIRECTION, because a ray has one.
 *
 * THE EQUATION IS ABOUT `n(x, d^)` AND IT HAS TO BE SOLVED THAT WAY. An earlier version here
 * carried only two streams, in and out, which is not a coarse angular grid - it is the claim
 * that every ray is aimed exactly at the centre. Measured, that alone produced a density at the
 * middle that grew with the size of the box and never converged: doubling the cells multiplied
 * `n` by about four at every radius, because a bigger box is more cells all firing at the
 * origin. There is no boundary condition that repairs that; the direction had been thrown away.
 *
 * SO THE GRID IS `n(r, mu)`, mu the cosine to the radial, and streaming carries BOTH terms:
 *
 *     mu d_r n  +  (1 - mu^{2})/r  d_mu n
 *
 * The second is not a force and not a curvature - it is flat space in spherical coordinates. A
 * ray going straight past the middle is radial nowhere except at its closest approach, and its
 * angle to the radial sweeps as it passes. That sweep is the whole of what stops the traffic
 * converging, and it is exactly what two streams cannot express.
 *
 * AND THE METRIC DIVIDES BOTH, because `1/s` is a speed: what is slowed is the going, whichever
 * way it is going.
 */
/**
 * THE STEADY STATE, SWEPT ALONG STRAIGHT LINES — which is what the streaming operator IS.
 *
 * THIS HAS BEEN GOT WRONG TWICE AND BOTH WERE THE SAME MISTAKE: throwing away where a ray is
 * pointing. Two streams, in and out, is the claim that every ray is aimed at the centre, and it
 * produced a density that grew with the size of the box and never converged. Adding the angular
 * sweep `(1-mu^{2})/r d_mu n` fixed that - it is flat space in spherical coordinates, not a
 * force - but differencing it is delicate and the explicit stepper never reached a steady state
 * anyway: 400,000 ticks left the profile still spreading, and an exponent read off a moving
 * front is a reading of the front.
 *
 * SO THE SWEEP IS DONE ALONG IMPACT PARAMETERS INSTEAD, and then there is no angular derivative
 * to difference. In spherical symmetry a STRAIGHT LINE is exactly a fixed `p`: along it,
 * `r = sqrt(p^{2} + z^{2})` and the transport is one dimensional,
 *
 *     dI/dz = q(r) - Sigma(r) I
 *
 * with `I = 0` entering from outside, because the box is a window and nothing arrives from
 * beyond it. The angular distribution at a radius is then read off the rays that pass through
 * it - `mu = +/- sqrt(1 - p^{2}/r^{2})` - rather than carried as a grid of its own. The term
 * that cost two rewrites is now exact by construction.
 *
 * AND IT IS SOURCE ITERATION, not time stepping. Sweep, rebuild what is emitted and removed
 * from what the sweep found, sweep again. That converges in tens of passes where the explicit
 * stepper needed millions, and it has a convergence criterion that means something.
 */
/**
 * THE STEADY STATE, SWEPT ALONG STRAIGHT LINES, WITH THE ANGLES WEIGHTED PROPERLY.
 *
 * IN SPHERICAL SYMMETRY A STRAIGHT LINE IS A FIXED IMPACT PARAMETER. Along one, `r =
 * sqrt(p^{2} + z^{2})` and the transport is one dimensional with no angular derivative to
 * difference - which is the term two earlier versions of this file got wrong. Nothing enters
 * from beyond the outermost shell, because the box is a window.
 *
 * AND THE ANGLES ARE INTEGRATED, NOT COUNTED. An earlier version binned ray samples by nearest
 * shell and averaged by how many landed there. That is not quadrature: samples pile up near a
 * ray's turning point and thin out far away, so the weights were the sampling and not the
 * geometry. It passed both controls - a UNIFORM field is insensitive to bad weights, which is
 * exactly why that was no evidence - and then reported a body's field that jumped two orders of
 * magnitude between neighbouring shells. Here the rays through a radius give their own `mu =
 * +/- sqrt(1 - p^{2}/r^{2})` and the integral is a trapezoid over those, which carries the
 * Jacobian by construction.
 *
 * EACH SEGMENT IS INTEGRATED EXACTLY. `dI/dz = q - sigma I` between two shell crossings has a
 * closed form, so the sweep is stable at any optical depth rather than needing small steps.
 */
export const solve = (
  R: Rates, body: Body,
  o: { cells?: number; passes?: number; tol?: number; relax?: number } = {},
): Solved => {
  const N = o.cells ?? 300, P = o.passes ?? 300;
  const tol = o.tol ?? 1e-12, w = o.relax ?? 0.5;
  const rho = settles(R);
  const g = R.g ?? 0;

  const r = Array.from({ length: N }, (_, i) => i + 1);
  const n = new Float64Array(N).fill(rho);
  const s = new Float64Array(N).fill(1);
  const flux = new Float64Array(N);
  const matter = (i: number) => r[i] <= body.radius;

  /* one ray grazing each shell */
  const pk = r.map(x => x - 0.5);
  /* Iin[k][i], Iout[k][i] - what ray k carries where it crosses shell i, each way */
  const Iin = Array.from({ length: N }, () => new Float64Array(N));
  const Iout = Array.from({ length: N }, () => new Float64Array(N));

  let ticks = 0, settled = false;
  for (; ticks < P; ticks++) {
    const q = new Float64Array(N), sig = new Float64Array(N);
    for (let i = 0; i < N; i++) {
      const made = matter(i) ? 0 : R.nu * Math.max(0, 1 - n[i]);
      q[i] = made / 2;
      /*
       * THE TRANSPORT CROSS SECTION, which is the whole of what `g` buys. A meeting that sends
       * a ray on nearly the way it was going has barely removed it as far as the DIRECTION is
       * concerned, so what attenuates a shadow is `sigma (1 - g)` and not `sigma`.
       */
      sig[i] = R.sigma * (1 - g) * n[i] * R.F / (s[i] || 1) + (matter(i) ? 1 : 0);
    }

    for (let k = 0; k < N; k++) {
      const p = pk[k];
      let I = 0;
      /* inward leg: from the outermost shell down to the turning point */
      for (let i = N - 1; i >= k; i--) {
        const zHi = Math.sqrt(Math.max(0, r[i] * r[i] - p * p));
        const zLo = i > k ? Math.sqrt(Math.max(0, r[i - 1] * r[i - 1] - p * p)) : 0;
        const dz = zHi - zLo;
        const t = sig[i] * dz;
        I = t > 1e-12 ? I * Math.exp(-t) + (q[i] / sig[i]) * (1 - Math.exp(-t)) : I + q[i] * dz;
        Iin[k][i] = I;
      }
      /* and out again */
      for (let i = k; i < N; i++) {
        const zLo = i > k ? Math.sqrt(Math.max(0, r[i - 1] * r[i - 1] - p * p)) : 0;
        const zHi = Math.sqrt(Math.max(0, r[i] * r[i] - p * p));
        const dz = zHi - zLo;
        const t = sig[i] * dz;
        I = t > 1e-12 ? I * Math.exp(-t) + (q[i] / sig[i]) * (1 - Math.exp(-t)) : I + q[i] * dz;
        Iout[k][i] = I;
      }
    }

    let moved = 0;
    for (let i = 0; i < N; i++) {
      /* the rays through this radius, as (mu, I) pairs, sorted from -1 to +1 */
      const pts: [number, number][] = [];
      for (let k = 0; k <= i; k++) {
        const mu = Math.sqrt(Math.max(0, 1 - (pk[k] * pk[k]) / (r[i] * r[i])));
        pts.push([-mu, Iin[k][i]]);
        pts.push([mu, Iout[k][i]]);
      }
      pts.sort((a, b) => a[0] - b[0]);
      let dens = 0, f = 0;
      for (let m = 1; m < pts.length; m++) {
        const [m0, i0] = pts[m - 1], [m1, i1] = pts[m];
        const d = m1 - m0;
        dens += (i0 + i1) / 2 * d;
        f += (i0 * m0 + i1 * m1) / 2 * d;
      }
      const a = n[i] + w * (dens - n[i]);
      moved = Math.max(moved, Math.abs(a - n[i]));
      n[i] = a;
      flux[i] = flux[i] + w * (f - flux[i]);

      const made = matter(i) ? 0 : R.nu * Math.max(0, 1 - n[i]);
      const killed = R.sigma * n[i] * n[i] * R.F;
      const ns = Math.max(1, s[i] + w * 0.05 * (killed - (s[i] > 1 ? made : 0)));
      moved = Math.max(moved, Math.abs(ns - s[i]));
      s[i] = ns;
    }
    if (moved < tol) { settled = true; break; }
  }

  const far = s[N - 2];
  return {
    r, s: [...s], n: [...n],
    excess: [...flux].map(v => -v),
    rho, ticks, settled,
  };
};


/* —— on the lattice's own directions, which is what the equation is about ———————— */

/**
 * THE DERIVED EQUATIONS ON A GRID, WITH THE LATTICE'S OWN EXITS AS THE DIRECTIONS.
 *
 * FIVE ATTEMPTS AT A SPHERICAL REDUCTION SAY THIS IS THE RIGHT SHAPE. `n(x, d^)` already HAS a
 * finite set of directions - the exits of the tiling - so reducing to a radius and an angle
 * imports a quadrature problem the model does not have: two streams aimed every ray at the
 * centre, a `mu` grid left a gap at grazing, and sample-counting weighted by the sampling
 * rather than the geometry. Here streaming is a shift by one cell along an exit, which is what
 * MOVEMENT is, and there is nothing to interpolate.
 *
 * WHAT LEAVES THE BOX IS GONE, as before - it is a window, not a mirror and not a lamp.
 *
 * AND `g` IS THE ONLY THING SCATTERING NEEDS. A meeting that sends a ray on nearly the way it
 * was going has hardly removed it as far as the DIRECTION is concerned, so what attenuates a
 * shadow is `sigma (1 - g)`. That is the transport cross section, and it is the whole of the
 * abstraction: `g = 0` forgets the direction in one mean free path, `g -> 1` keeps it for
 * `lambda/(1-g)`.
 */
export type Grid = {
  L: number;
  /** the density at each cell, summed over directions */
  n: Float64Array;
  /** and what a place stands for */
  s: Float64Array;
  rho: number;
  passes: number;
  settled: boolean;
  /** how much more arrives from one side than the other, per cell - the shadow */
  imbalance: Float64Array;
  at(...v: number[]): number;
};

export const sweep = (
  R: Rates, geom: { DEG: number; D: number; V: number[][] }, body: { radius: number },
  o: { size?: number; passes?: number; tol?: number } = {},
): Grid => {
  const L = o.size ?? 201, P = o.passes ?? 4000, tol = o.tol ?? 1e-12;
  const D = geom.D, rho = settles(R), g = R.g ?? 0;
  const c = (L - 1) / 2;
  const cells = Math.pow(L, D);
  const stride = [1, L, L * L].slice(0, D);
  const at = (...v: number[]) => v.reduce((k, x, i) => k + x * stride[i], 0);

  /* the exits, as whole-cell steps - only those that are, on this tiling */
  const step: number[][] = [];
  for (let d = 0; d < geom.DEG; d++) {
    const v = geom.V[d];
    const w = Array.from({ length: D }, (_, i) => Math.round(v[i] ?? 0));
    if (w.every(x => x === 0)) continue;
    step.push(w);
  }
  const M = step.length;
  const shift = step.map(w => w.reduce((k, x, i) => k + x * stride[i], 0));
  const opp = step.map(w => step.findIndex(u => u.every((x, i) => x === -w[i])));

  /* which cells are matter, and which are far enough from the wall to be stepped from */
  const isMatter = new Uint8Array(cells);
  const coord = (k: number) => Array.from({ length: D }, (_, i) =>
    Math.floor(k / stride[i]) % L);
  for (let k = 0; k < cells; k++) {
    const v = coord(k);
    let r2 = 0; for (const x of v) r2 += (x - c) * (x - c);
    if (Math.sqrt(r2) <= body.radius) isMatter[k] = 1;
  }

  let n = new Float64Array(cells * M).fill(rho / M);
  let next = new Float64Array(cells * M);
  const s = new Float64Array(cells).fill(1);

  let passes = 0, settled = false;
  for (; passes < P; passes++) {
    let moved = 0;
    next.fill(0);
    for (let k = 0; k < cells; k++) {
      const v = coord(k);
      let tot = 0;
      for (let d = 0; d < M; d++) tot += n[k * M + d];
      const made = isMatter[k] ? 0 : R.nu * Math.max(0, 1 - tot);
      const sp = 1 / s[k];
      for (let d = 0; d < M; d++) {
        const here = n[k * M + d];
        const facing = n[k * M + (opp[d] < 0 ? d : opp[d])];
        const killed = R.sigma * (1 - g) * here * facing * R.F;
        const left = Math.max(0, here + made / M - killed - (isMatter[k] ? here : 0));
        /* out of the window? then it is gone */
        let ok = true;
        for (let i = 0; i < D; i++) {
          const x = v[i] + step[d][i];
          if (x < 0 || x >= L) { ok = false; break; }
        }
        if (!ok) continue;
        next[(k + shift[d]) * M + d] += left * sp;
        next[k * M + d] += left * (1 - sp);
      }
    }
    for (let i = 0; i < cells * M; i++)
      if (Math.abs(next[i] - n[i]) > moved) moved = Math.abs(next[i] - n[i]);
    const t = n; n = next; next = t;
    if (moved < tol) { settled = true; break; }
  }

  const dens = new Float64Array(cells), imb = new Float64Array(cells);
  for (let k = 0; k < cells; k++) {
    const v = coord(k);
    let tot = 0;
    const f = new Array(D).fill(0);
    for (let d = 0; d < M; d++) {
      tot += n[k * M + d];
      for (let i = 0; i < D; i++) f[i] += n[k * M + d] * step[d][i];
    }
    dens[k] = tot;
    let dot = 0, rr = 0;
    for (let i = 0; i < D; i++) { const q = c - v[i]; dot += f[i] * q; rr += q * q; }
    imb[k] = dot / (Math.sqrt(rr) || 1);
  }
  return { L, n: dens, s, rho, passes, settled, imbalance: imb, at };
};

