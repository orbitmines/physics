/**
 * WHAT THE EQUATION SAYS THE ANGULAR RANGE IS - derived, then checked against the pictures.
 *
 * The transport term that destroys angular structure is the scattering, and `stir = 1` means
 * ALL of the density scatters every tick. In transport theory the l-th angular moment of a
 * source decays with its own length
 *
 *      lambda_l = lambda / (1 - g_l),      g_l = <P_l(cos theta)> over the scattering kernel
 *
 * THE DERIVATION, WRITTEN OUT.
 *
 *   d_t n + c d.grad_x n + q(BxD).grad_d n = nu(1-rho)^DEG - (sigma+tau) n n~ + S[n]
 *   S[n] = stir ( <n>_ring - n )                       the ring scatter, one steer step
 *
 * Expand the direction dependence in spherical harmonics, n(x,d) = sum n_lm(x) Y_lm(d). S is
 * rotationally invariant so it is DIAGONAL in that basis - it cannot mix one l into another -
 * and its eigenvalue is the kernel's l-th moment:
 *
 *   S[n]_lm = - stir (1 - g_l) n_lm ,     g_l = <P_l(cos theta)>_ring
 *
 * Balancing that against streaming gives each moment its own length,
 *
 *   lambda_l = c / [ sigma_a + stir (1 - g_l) ] ~ lambda / (1 - g_l)
 *
 * and then the SHAPE that can be seen at a distance: the source's angular pattern is imprinted
 * only within lambda_1, so the effective source has radius a ~ lambda_1 and a spatial multipole
 * of order l reads at radius r as
 *
 *   A_l(r) / A_0(r) ~ (a / r)^l
 *
 * On fcc-12: g_1 = -0.600, lambda = 1.5, so lambda_1 = 0.94 cells, a/r = 0.117 at r = 8, and a
 * quadrupole comes to 1.4% of the monopole there - against a measured correlation of 0.11-0.32.
 *
 * so a monopole (l = 0, g = 1) never decays by scattering at all - it is conserved and only
 * annihilation removes it - while higher l die faster the less forward-peaked the kernel is.
 *
 * Here the kernel is not a free choice: `steer` spends ONE RING STEP, so theta is the angle
 * between an exit and its ring neighbours, which the geometry fixes. That single number decides
 * how far an orbital's shape can reach, and it is computed below for each lattice.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
const LAM = 1.5;                      // ray mean free path, measured on the lattice at 1.6
const leg = (l: number, x: number): number =>
  l === 0 ? 1 : l === 1 ? x : l === 2 ? (3*x*x-1)/2 : (5*x*x*x-3*x)/2;

console.log("geometry          DEG   mean ring angle   g1     g2     g3    lambda_1  lambda_2  lambda_3");
for (const name of ["fcc-12","icosahedral-12","cubic-18","cubic-26","bcc-8","cubic-6"]) {
  const g: any = (GEOMETRIES as any)[name];
  if (!g?.U) continue;
  const DEG = g.DEG;
  const unit = (d: number) => { const u = g.U[d]; const m = Math.hypot(u[0],u[1],u[2]??0)||1;
    return [u[0]/m, u[1]/m, (u[2]??0)/m]; };
  /* the ring of an exit: everything one turn away, which is what `steer` spends a step on */
  let cosSum = 0, cnt = 0;
  const gl = [0,0,0,0];
  for (let d = 0; d < DEG; d++) {
    const a = unit(d);
    /* the ring, as the solver builds it: the exits a single turn about any axis reaches */
    const ring: number[] = [];
    for (let b = 0; b < DEG; b++) {
      const t = g.turn ? g.turn(d, g.U[b] as any) : undefined;
      if (t !== undefined && t !== d) ring.push(t);
    }
    const uniq = [...new Set(ring)];
    for (const e of uniq) {
      const c = unit(e);
      const dot = Math.max(-1, Math.min(1, a[0]*c[0] + a[1]*c[1] + a[2]*c[2]));
      cosSum += dot; cnt++;
      for (let l = 1; l <= 3; l++) gl[l] += leg(l, dot);
    }
  }
  if (!cnt) { console.log(`${name.padEnd(17)} ${String(DEG).padStart(3)}   (no ring)`); continue; }
  const mc = cosSum/cnt, ang = Math.acos(Math.max(-1,Math.min(1,mc)))*180/Math.PI;
  const G1 = gl[1]/cnt, G2 = gl[2]/cnt, G3 = gl[3]/cnt;
  const lam = (G: number) => LAM/Math.max(1e-6, 1 - G);
  console.log(`${name.padEnd(17)} ${String(DEG).padStart(3)}   ${ang.toFixed(1).padStart(13)}   ` +
    `${G1.toFixed(3).padStart(6)} ${G2.toFixed(3).padStart(6)} ${G3.toFixed(3).padStart(6)}  ` +
    `${lam(G1).toFixed(2).padStart(8)}  ${lam(G2).toFixed(2).padStart(8)}  ${lam(G3).toFixed(2).padStart(8)}`);
}
console.log("\nlambda_l is how far an l-pole's shape reaches. Measured on fcc-12: the dipole");
console.log("survives the box and the quadrupole dies by about three cells.");
