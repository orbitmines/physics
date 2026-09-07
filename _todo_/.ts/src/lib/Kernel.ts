/**
 * THE SCATTERING THE RULE MAKES, WITH NO LATTICE IN IT.
 *
 * `steer` turns a ray by ONE ring step about the direction the local field points along. On a
 * lattice "one ring step" is 2pi/CYCLE and the result is snapped to the nearest exit, and both
 * of those are the lattice's, not the rule's. Take them away and what is left is exact:
 *
 *   turn u by a fixed angle THETA about an axis n
 *
 * In an unbiased vacuum the field has no preferred direction, so n is uniform on the sphere.
 * Write t = cos(angle between u and n), which is then uniform on [-1, 1]. Rodrigues gives
 *
 *   cos(gamma) = t^2 + (1 - t^2) cos(THETA) = cos(THETA) + t^2 (1 - cos THETA)
 *
 * where gamma is how far the ray actually turned. So the phase function is a change of variable
 * away from uniform: with x = t^2 on [0,1] carrying density 1/(2 sqrt x),
 *
 *   g_l = E[P_l(cos gamma)] = integral_0^1 P_l( cosTHETA + x (1 - cosTHETA) ) dx / (2 sqrt x)
 *
 * and in particular g_1 = cosTHETA + (1 - cosTHETA)/3 = (1 + 2 cos THETA) / 3, exactly.
 *
 * THIS IS THE WHOLE ANGULAR CONTENT OF THE MODEL. Everything the lattices disagree about -
 * which multipole survives how far - is g_l and nothing else, because the stir operator is
 * rotationally invariant and therefore diagonal in the harmonics:
 *
 *   S[n]_lm = -stir (1 - g_l) n_lm ,   lambda_l = lambda / (1 - g_l)
 *
 * g_0 = 1 identically, whatever THETA: turning moves a ray but does not destroy it, so the
 * monopole cannot decay by scattering. That is not a lattice artefact and no geometry escapes it.
 */

/** P_l(x) by the standard recurrence */
export const legendre = (l: number, x: number): number => {
  if (l === 0) return 1;
  if (l === 1) return x;
  let pm = 1, p = x;
  for (let k = 2; k <= l; k++) { const pn = ((2*k - 1)*x*p - (k - 1)*pm)/k; pm = p; p = pn; }
  return p;
};

/**
 * g_l for l = 0..L, for a turn of `theta` radians about a uniformly random axis.
 *
 * The integral has a 1/sqrt(x) endpoint singularity, so it is substituted away rather than
 * quadratured through: x = s^2 turns dx/(2 sqrt x) into ds on [0,1], which is smooth and a
 * midpoint rule converges on it at machine precision for a polynomial integrand.
 */
export const kernel = (theta: number, L: number, samples = 4096): Float64Array => {
  const c = Math.cos(theta), g = new Float64Array(L + 1);
  for (let i = 0; i < samples; i++) {
    const s = (i + 0.5) / samples;                 // x = s^2, dx/(2 sqrt x) = ds
    const mu = c + s * s * (1 - c);
    for (let l = 0; l <= L; l++) g[l] += legendre(l, mu);
  }
  for (let l = 0; l <= L; l++) g[l] /= samples;
  return g;
};

/** what the rule turns by on a lattice whose principal ring has CYCLE members */
export const spinOf = (cycle: number) => cycle > 0 ? 2 * Math.PI / cycle : 0;
