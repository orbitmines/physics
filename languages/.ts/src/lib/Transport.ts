/**
 * THE TRANSPORT LAW — how the carriers travel, which is where the rotation curves
 * come from rather than from how hard anything pulls.
 *
 *     v = c·min(1, n/n_c)          a carrier slows where the medium is thin, because
 *                                  there is less of it to hand the charge on to
 *     Φ = 4πr²·n·v = constant      whatever is conserved is conserved
 *
 * DENSE: v = c, so n ∝ 1/r² and the force is Newton's. THIN: v ∝ n, so the flux
 * condition goes quadratic and n ∝ √Φ/r — a 1/r force, which is a flat rotation curve.
 * One rule, both limits.
 *
 * AND THE CROSSOVER IS DERIVED. Matching the two at the turnover gives
 *
 *     g = g_N (1 + a₀/g)     ⇒     g = g_N/2 + √(g_N²/4 + g_N a₀)
 *
 * which is MOND's "simple" interpolation function — chosen for its shape everywhere
 * else, and here the thing the condition solves to. `cosmology/rotation` checks that
 * identity to 3·10⁻¹⁶ rather than asserting it.
 *
 * THE SCALE IS NOT FITTED EITHER. What sets the threshold is the thing the model is
 * about: space being made. That has a rate, the rate is H, and an acceleration built
 * from it is cH/2π with nothing free in it.
 *
 * IT LIVES HERE so the test and the figure are the same law. Kept in two files they
 * drift, and a curve that has drifted from the measurement is the failure this
 * migration exists to end.
 */

export const C_LIGHT = 2.99792458e8;                  // m/s
export const MPC = 3.0856775814913673e22;             // m
export const G_NEWTON = 6.67430e-11;                  // m³/kg/s²
export const MSUN = 1.98892e30;                       // kg
export const KPC = 3.0856775814913673e19;             // m

/** the Hubble tension, which brackets this rather than fixing it */
export const H0 = { planck: 67.4, riess: 73.0 };
export const hz = (kmsMpc: number) => (kmsMpc * 1000) / MPC;

/** the model's own acceleration scale, a₀ = cH₀/2π */
export const a0 = (kmsMpc = H0.planck) => (C_LIGHT * hz(kmsMpc)) / (2 * Math.PI);

/** measured from rotation-curve fits, for comparison only */
export const A0_MEASURED = 1.2e-10;

/**
 * THE INTERPOLATION — AND IT IS NOW READ OFF THE RULES rather than written down here.
 *
 * This used to solve a turnover condition, `g = g_N(1 + a₀/g)`, which was a statement somebody
 * had to make: a point already carrying a charge is busy, so splitting is suppressed where the
 * field is strong, and the free fraction is `1/(1+θ)`. True or not, nothing could check it.
 *
 * `boost` is the law `Prove` closes off `G.ts`, MEASURED - `tools/MEASURE.ts` runs the model
 * once and writes the curve down, and `visuals/LAW.ts` reads it back. Reaching for the prover
 * from here would put it in every browser bundle and make every picture wait on it.
 */
/*
 * AND IT IS NOT RE-EXPORTED FROM HERE ANY MORE. This file is core, and reaching into the
 * visuals for it dragged a browser-side module - and through it a filesystem - into a package
 * whose whole point is that it has neither. A panel that wants the law asks `visuals/LAW.ts`
 * directly, which is where the measured curve is read.
 */
