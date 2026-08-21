/**
 * ORBITS IN A STATIC METRIC — the same integrator for all three, so what differs is
 * the metric and not the arithmetic.
 *
 * Written in ISOTROPIC coordinates, ds² = −A dt² + B(dx² + dy²), which is the form the
 * count gives: B multiplies the whole spatial part because a lattice has no
 * radial-against-transverse choice to make. Newton is the same code with A = 1 − 2u
 * and B = 1, which is not a metric anybody believes in but IS what integrating
 * Newtonian gravity as a geodesic amounts to, and putting it through the same
 * integrator is what makes the comparison about physics rather than about method.
 *
 * HAMILTONIAN RATHER THAN THE ORBIT EQUATION, deliberately. dφ/dr has a 1/√ at every
 * turning point, and a first attempt at the perihelion advance integrated exactly that
 * and got the ratio right while the absolute value was 45× out — the quadrature, not
 * the physics. In the Hamiltonian form nothing is singular anywhere along the path:
 *
 *     H = ½[ −E²/A(r) + (p·p)/B(r) ]        with 2H = −1 for a timelike geodesic
 *     ẋ = p/B          ṗ = −∇H
 */

export type Metric = {
  name: string; A: (r: number) => number; B: (r: number) => number;
  /** integrate the inverse-square law directly instead of a geodesic */
  kepler?: boolean;
};

/** the count's own metric: u = M/r, A = e^(−2u), B = e^(+2u), A·B = 1 */
export const COUNTED: Metric = {
  name: "the count", A: r => Math.exp(-2 / r), B: r => Math.exp(2 / r),
};

/** Schwarzschild, in the same isotropic form so the integrator cannot tell them apart */
export const SCHWARZSCHILD: Metric = {
  name: "general relativity",
  A: r => Math.pow((1 - 0.5 / r) / (1 + 0.5 / r), 2),
  B: r => Math.pow(1 + 0.5 / r, 4),
};

/**
 * NEWTON, INTEGRATED AS NEWTON rather than as a metric.
 *
 * It is tempting to write A = 1 − 2u with B = 1 and call it Newton, since that is the
 * weak-field time part. It is not: geodesics in that metric still precess — measured,
 * 6.0·10⁻² per orbit against general relativity's 8.7·10⁻² on the same orbit — so
 * using it as the baseline would show Newton precessing, which he does not. A Kepler
 * ellipse closes exactly, and that closing is the thing the other two are departing
 * from, so the baseline integrates the actual inverse-square law.
 */
export const NEWTON: Metric = {
  name: "Newton", A: r => 1 - 2 / r, B: () => 1, kepler: true,
};

type State = { x: number; y: number; px: number; py: number };

const deriv = (m: Metric, s: State, E: number) => {
  const r = Math.hypot(s.x, s.y);
  if (m.kepler) {
    /* ẍ = −M x/r³ with M = 1, and p carried as the velocity */
    return { x: s.px, y: s.py, px: -s.x / (r * r * r), py: -s.y / (r * r * r) };
  }
  const h = 1e-6 * Math.max(r, 1);
  const A = m.A(r), B = m.B(r);
  const dA = (m.A(r + h) - m.A(r - h)) / (2 * h);
  const dB = (m.B(r + h) - m.B(r - h)) / (2 * h);
  const p2 = s.px * s.px + s.py * s.py;
  /* ∂H/∂r, then projected onto x and y */
  const dHdr = 0.5 * ((E * E * dA) / (A * A) - (p2 * dB) / (B * B));
  return {
    x: s.px / B, y: s.py / B,
    px: -dHdr * (s.x / r), py: -dHdr * (s.y / r),
  };
};

const step = (m: Metric, s: State, E: number, dt: number): State => {
  const add = (a: State, d: ReturnType<typeof deriv>, k: number): State => ({
    x: a.x + d.x * k, y: a.y + d.y * k, px: a.px + d.px * k, py: a.py + d.py * k,
  });
  const k1 = deriv(m, s, E);
  const k2 = deriv(m, add(s, k1, dt / 2), E);
  const k3 = deriv(m, add(s, k2, dt / 2), E);
  const k4 = deriv(m, add(s, k3, dt), E);
  return {
    x: s.x + (dt / 6) * (k1.x + 2 * k2.x + 2 * k3.x + k4.x),
    y: s.y + (dt / 6) * (k1.y + 2 * k2.y + 2 * k3.y + k4.y),
    px: s.px + (dt / 6) * (k1.px + 2 * k2.px + 2 * k3.px + k4.px),
    py: s.py + (dt / 6) * (k1.py + 2 * k2.py + 2 * k3.py + k4.py),
  };
};

/**
 * AN ORBIT FROM APOAPSIS, and the perihelion advance it accumulates.
 *
 * Started at (r0, 0) moving in +y with the angular momentum a circular orbit there
 * would need, scaled by `kick` — below 1 it falls inward and the orbit is elliptical.
 */
export const orbit = (m: Metric, r0: number, kick: number, turns: number, N = 60000) => {
  const A0 = m.A(r0), B0 = m.B(r0);
  /* circular-orbit angular momentum in this metric, then scaled */
  const h = 1e-6 * r0;
  const dA = (m.A(r0 + h) - m.A(r0 - h)) / (2 * h);
  const L2 = (r0 * r0 * r0 * dA) / (2 * A0 - r0 * dA) * B0 / r0 * r0;
  const L = Math.sqrt(Math.max(L2, 1e-12)) * kick;
  /* timelike normalisation: −E²/A + p²/B = −1 with p = L/r at apoapsis */
  const p = L / r0;
  const E = Math.sqrt(A0 * (1 + (p * p) / B0));

  /* for Kepler, p is a velocity and the circular value is √(M/r) */
  const p0 = m.kepler ? Math.sqrt(1 / r0) * kick : p;
  let s: State = { x: r0, y: 0, px: 0, py: p0 };
  const path: [number, number][] = [[r0, 0]];
  const peri: number[] = [];
  let last = r0, prev = r0;
  const dt = (2 * Math.PI * r0) / ((m.kepler ? p0 : p / B0)) / 900;
  for (let i = 0; i < N; i++) {
    s = step(m, s, E, dt);
    const r = Math.hypot(s.x, s.y);
    path.push([s.x, s.y]);
    /* a minimum in r is a perihelion; record the angle it happens at */
    if (prev < last && prev < r) peri.push(Math.atan2(s.y, s.x));
    last = prev; prev = r;
    if (path.length > 4 && Math.atan2(s.y, s.x) === 0) break;
    if (peri.length > turns) break;
  }
  return { path, peri, E, L };
};

/**
 * HOW FAR A LIGHT RAY IS BENT PASSING A MASS - the article's other relativistic claim,
 * and the one the force law alone gives none of.
 *
 * A NULL GEODESIC THROUGH THE SAME HAMILTONIAN. Nothing here is a new integrator: light
 * obeys the same ẋ = p/B and ṗ = −∇H that an orbit does, and what makes it light is the
 * normalisation - a timelike path carries −E²/A + p²/B = −1 and a null one carries zero,
 * so E = p·sqrt(A/B) instead. Reusing the stepper is the point: if the counted metric and
 * Schwarzschild are to be compared, the comparison has to be of the metrics and not of two
 * people's numerical methods.
 *
 * STARTED FAR OUT AND FLAT, at an impact parameter b, moving parallel to the axis; run
 * until it is as far away on the other side; and the answer is how much the direction of
 * travel turned. General relativity gives 4M/b, which is twice what a Newtonian
 * corpuscle would do - the famous factor of two, and the thing to check.
 */
export const deflect = (m: Metric, b: number, far = 4000, N = 2000000) => {
  const A0 = m.A(far), B0 = m.B(far);
  /* a null path: −E²/A + p²/B = 0, so E is fixed by p rather than by a rest mass */
  const p = 1;
  const E = p * Math.sqrt(A0 / B0);

  let s: State = { x: -far, y: b, px: p, py: 0 };
  const dt = (2 * far) / N * 2;
  let last = s;
  for (let i = 0; i < N; i++) {
    last = s;
    s = step(m, s, E, dt);
    if (s.x > far) break;
  }
  /* the turn in the direction of travel, start to finish */
  const a0 = Math.atan2(0, p);
  const a1 = Math.atan2(s.py, s.px);
  let d = a1 - a0;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return Math.abs(d);
};
