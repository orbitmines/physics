/**
 * WHAT THE DERIVED METRIC DOES TO AN ORBIT — the last step, and the one that can be checked
 * against something nobody in this project chose.
 *
 * `lib/Solve.ts` integrates the two lines the rules come to and hands back `s(r)`: how many
 * points a place stands for, out from a body. That IS the metric, because a ray crosses a place
 * once per point it stands for — light goes at `c̄/s`. In an isotropic line element
 *
 *     ds^{2} = A(r) dt^{2} - B(r) dx^{2},     light where  sqrt(A/B) = 1/s
 *
 * so `A = 1/s` and `B = s`, and there is nothing to choose: both come off the one profile.
 *
 * THROUGH ONE INTEGRATOR, which is the whole point. The derived metric and Schwarzschild are
 * both written in isotropic form and handed to the same stepper, so what differs between two
 * runs is the metric and not the arithmetic. Newton goes through as the actual inverse-square
 * law rather than as a weak-field metric: a Kepler ellipse closes exactly, and that closing is
 * what the other two are measured as departing from.
 */

export type Metric = { name: string; A: (r: number) => number; B: (r: number) => number };

/** the model's own: light at `c̄/s` with `s = exp(2M/r)`, which is what `Solve` settles to */
export const derived = (M = 1): Metric => ({
  name: "the count",
  A: r => Math.exp(-2 * M / r),
  B: r => Math.exp(2 * M / r),
});

/** and Schwarzschild, in the same isotropic form so the stepper cannot tell them apart */
export const schwarzschild = (M = 1): Metric => ({
  name: "general relativity",
  A: r => Math.pow((1 - M / (2 * r)) / (1 + M / (2 * r)), 2),
  B: r => Math.pow(1 + M / (2 * r), 4),
});

/**
 * HOW FAR THE PERIHELION MOVES IN ONE ORBIT, in radians.
 *
 * A TIMELIKE GEODESIC HAS TWO CONSTANTS and the rest is quadrature. `E = A dt/dl` and
 * `L = B r^{2} dphi/dl` are conserved, and normalising the four-velocity leaves
 *
 *     (dr/dl)^{2} = [ E^{2}/A - 1 - L^{2}/(B r^{2}) ] / B
 *
 * so `dphi/dr` is the ratio of the two and the angle swept between one turning point and the
 * next is an integral. Twice that is the angle between successive perihelia; what it exceeds
 * `2 pi` by is the advance. Integrated in `u = 1/r`, which is regular where `dr/dl` vanishes
 * and is the substitution the closed form uses for the same reason.
 */
export const advance = (
  m: Metric, o: { peri: number; apo: number; steps?: number },
): number => {
  const N = o.steps ?? 20_000;
  const rp = o.peri, ra = o.apo;

  /*
   * THE TWO CONSTANTS, FIXED BY THE TWO TURNING POINTS.
   *
   * `dr/dl` vanishes at both, which is two equations in `E^{2}` and `L^{2}` - so an orbit is
   * named by where it turns rather than by how hard it was thrown, and the pair falls out of a
   * two by two.
   */
  const f = (r: number) => 1 / (m.B(r) * r * r);
  const g = (r: number) => 1 / m.A(r);
  const fp = f(rp), fa = f(ra), gp = g(rp), ga = g(ra);
  const det = fp * ga - gp * fa;
  const E2 = (fp - fa) / det;
  const L2 = (gp - ga) / det;
  const L = Math.sqrt(Math.max(0, L2));

  /*
   * AND THE ANGLE SWEPT FROM ONE TURNING POINT TO THE OTHER, in `u = 1/r`.
   *
   *     dphi/du = L / ( sqrt(B) sqrt( E^{2}/A - 1 - L^{2}/(B r^{2}) ) )
   *
   * which is regular in `u` where it is not in `r`, and is the substitution the closed form
   * uses for the same reason. Midpoint, because the integrand is inverse-square-root singular
   * at both ends and that is exactly what a midpoint rule is for.
   */
  /*
   * AND THE SQUARE ROOT'S SINGULARITY IS TAKEN OUT BEFORE IT IS STEPPED, or the answer is
   * noise.
   *
   * The advance is what `2 phi` EXCEEDS `2 pi` by, and in a weak field that is a part in a
   * thousand of either. So the quadrature has to be good to far better than the thing being
   * measured, and a midpoint rule on an integrand that goes as `1/sqrt` at both ends is not:
   * measured against the closed form it came out 0.91 of it at one separation and 0.03 at
   * another, getting WORSE as the field got weaker, which is the signature of a difference of
   * two large numbers rather than of a wrong law.
   *
   * `u = m + h sin(theta)` is the cure and it is exact rather than a refinement. The radicand
   * vanishes linearly at both turning points, so it goes as `(u - ua)(up - u)` there, which the
   * substitution turns into `h^{2} cos^{2}(theta)` - and the `cos` cancels against the one in
   * `du`. What is left is smooth, and the same rule that was hopeless on the original is
   * spectrally accurate on this one.
   */
  const up = 1 / rp, ua = 1 / ra;
  const mid = (up + ua) / 2, half = (up - ua) / 2;
  const dth = Math.PI / N;
  let phi = 0;
  for (let i = 0; i < N; i++) {
    const th = -Math.PI / 2 + dth * (i + 0.5);
    const u = mid + half * Math.sin(th);
    const r = 1 / u;
    const rad = E2 * g(r) - 1 - L2 * f(r);
    if (rad <= 0) continue;
    phi += L / (Math.sqrt(m.B(r)) * Math.sqrt(rad)) * half * Math.cos(th) * dth;
  }
  /* one radial period is peri -> apo -> peri, so twice the sweep */
  return 2 * phi - 2 * Math.PI;
};

/**
 * HOW FAR A LIGHT RAY IS BENT PASSING AT IMPACT PARAMETER `b` — and this is the measurement
 * that pins down what a delay alone cannot.
 *
 * A DELAY FIXES ONLY THE RATIO. "Light goes at `c̄/s`" is `sqrt(A/B) = 1/s`, which constrains
 * `A/B` and says nothing about how the effect is split between the two. `A = 1/s, B = s` gives
 * that ratio; so does `A = 1/s^{2}, B = 1`, and so does `A = 1, B = s^{2}`. They are the same
 * Shapiro delay and they are three different geometries.
 *
 * AND THE DEFLECTION IS EXACTLY THE SPLIT. In the weak field a metric `A = 1 - 2U`,
 * `B = 1 + 2 gamma U` bends light by `2(1 + gamma) GM/(c^{2} b)`: the time part contributes
 * half and the space part the other half. `gamma = 1` is general relativity's `4GM/c^{2}b`;
 * `gamma = 0` - all the delay in the clock and none in the ruler - gives half of it, which is
 * the "Newtonian" deflection Soldner computed and Eddington ruled out in 1919.
 *
 * SO A MODEL THAT ONLY DELAYS HAS NOT YET SAID WHICH IT IS. That is not a gap in the
 * measurement, it is a gap in the rules: something has to make a ray's DIRECTION answer to
 * where the folds are, and how strongly it does is what `gamma` counts.
 */
export const deflection = (m: Metric, b: number, steps = 200_000): number => {
  /* the turning point: where dr/dl vanishes for a null path */
  let r0 = b;
  for (let i = 0; i < 200; i++) {
    /* b = r sqrt(B/A) at closest approach, solved by iteration */
    r0 = b / Math.sqrt(m.B(r0) / m.A(r0));
  }
  const LE = b;                                  /* L/E, fixed by the impact parameter */
  const u0 = 1 / r0;
  const f = (r: number) => 1 / (m.B(r) * r * r);
  const g = (r: number) => 1 / m.A(r);

  let phi = 0;
  const dth = (Math.PI / 2) / steps;
  for (let i = 0; i < steps; i++) {
    const th = dth * (i + 0.5);
    const u = u0 * Math.sin(th);
    const r = 1 / u;
    const rad = g(r) - LE * LE * f(r);
    if (rad <= 0) continue;
    phi += LE / (Math.sqrt(m.B(r)) * Math.sqrt(rad)) * u0 * Math.cos(th) * dth;
  }
  return 2 * phi - Math.PI;
};

/** all the delay in the CLOCK and none in the ruler - the same `c̄/s`, `gamma = 0` */
export const clockOnly = (M = 1): Metric => ({
  name: "delay in the clock alone",
  A: r => Math.exp(-4 * M / r), B: () => 1,
});
