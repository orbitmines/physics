/**
 * THE RULES WITH NO LATTICE AT ALL - and it is a thousand times faster because of it.
 *
 * Every geometry in `Local.ts` is an APPROXIMATION to one rule: a ray turns by a fixed angle
 * about the direction the local field points along. The lattice enters three times and all
 * three are error - the turn angle becomes 2pi/CYCLE, the turned ray is SNAPPED to the nearest
 * exit, and space is sampled at the lattice's own step. Measured, those three take fcc-12's g1
 * from the rule's +0.667 to +0.467, and the continuum solver's own table takes it to -0.600.
 * So the lattice is not the model. It is a discretisation of it, with an error nobody had
 * measured.
 *
 * Take the lattice away and the problem collapses:
 *
 *   1. `stir` is ROTATIONALLY INVARIANT, so it is diagonal in spherical harmonics. Scattering
 *      is one number per l - `Kernel.kernel` gives it in closed form - and never mixes them.
 *   2. The vacuum is HOMOGENEOUS, so Fourier modes are independent too. One k at a time.
 *   3. Streaming `i k.u` couples only l to l+-1. So each k is a COMPLEX TRIDIAGONAL SYSTEM in
 *      l, of size L+1, and solves in O(L).
 *
 * Only the m = 0 part about k matters for the density, because streaming and scattering both
 * preserve m about k and the density integral picks m = 0 alone. The source's projection onto
 * that is the addition theorem: a source `sum_l s_l P_l(u.z)` contributes `s_l P_l(cos psi)`
 * where psi is the angle between k and the source's axis. So the whole angular dependence comes
 * out of the k integral as `P_l(cos theta)` and the answer separates:
 *
 *      rho(r, theta) = sum_l  s_l  A_l(r)  P_l(cos theta)
 *      A_l(r) = (1 / 2 pi^2) integral k^2 j_l(k r) h_l(k) dk
 *
 * with h_l(k) the l-th density response to a unit source in mode l. That is L+1 radial
 * functions and nothing else - no cells, no exits, no seeds, no control run. A state that took
 * twenty minutes on the lattice takes milliseconds here.
 *
 * WHAT THIS DOES NOT DO. It is LINEAR: the response is computed about the uniform vacuum, so
 * `room = (1-rho)^DEG` saturating near the body - the nonlinearity that makes the turning a
 * HOLE rather than a heap - is absent. It says where the shape goes and how far it reaches,
 * which is what the angular question is; it does not say what the body does to the vacuum it
 * sits in. Use `Vlasov2` for that, on cubic-26, which is the one geometry it encodes faithfully.
 */
import { kernel, legendre } from "./Kernel.ts";

export type Rules = {
  /** the turn a ray makes about the local field - 2pi/CYCLE on a lattice, free here */
  theta: number;
  /** ANNIHILATION, which removes a ray outright: 0.5/facing, per mean free time */
  absorb: number;
  /** `steer`, which turns one and keeps it */
  stir: number;
  /** how many harmonics are carried. l needs (l+1)^2 components on a lattice and ONE here */
  L: number;
};

/** spherical Bessel j_l by upward recurrence, downward where upward is unstable (x < l) */
export const besselJ = (l: number, x: number): number => {
  if (x === 0) return l === 0 ? 1 : 0;
  if (x > l) {
    let j0 = Math.sin(x) / x, j1 = (Math.sin(x) / x - Math.cos(x)) / x;
    if (l === 0) return j0;
    if (l === 1) return j1;
    for (let k = 1; k < l; k++) { const jn = (2*k + 1)/x * j1 - j0; j0 = j1; j1 = jn; }
    return j1;
  }
  /* downward from a safe start, then normalised on j_0 - upward recurrence loses every digit
   * below the turning point x ~ l, where j_l is exponentially small */
  const top = l + 30 + Math.ceil(10 * Math.sqrt(l + 1));
  let jp = 0, j = 1e-280, scale = 0;
  for (let k = top; k >= 1; k--) {
    const jm = (2*k + 1)/x * j - jp; jp = j; j = jm;
    if (k - 1 === l) scale = j;      // `j` is j_{k-1}; `jp` is j_k - taking jp returned j_{l+1}
    if (Math.abs(j) > 1e250) { j *= 1e-250; jp *= 1e-250; scale *= 1e-250; }
  }
  const j0 = Math.sin(x) / x;
  return scale * (j0 / j);
};

/*
 * THE ANGULAR SOLVE IS EXACT, NOT A P_L TRUNCATION - because these rates are nearly ballistic.
 *
 * The obvious method expands in Legendre moments and truncates: streaming couples l to l+-1, so
 * it is tridiagonal and solves in O(L). It was tried and it does not work here. P_L represents a
 * distribution by its first L moments, and a nearly unscattered ray is a DELTA in direction,
 * which has no such representation - measured, the answer moved 45% between L=9 and L=15, and
 * the l=0 profile missed the exact ballistic result by a factor of thirty at r = 8. These rates
 * are in exactly that regime: annihilation and stir are comparable, so a ray is about as likely
 * to be destroyed as turned and most of what arrives anywhere arrived straight.
 *
 * So STREAMING IS KEPT EXACTLY and only the scattering is expanded. Along k,
 *
 *      (Sigma_t + i k mu) n(mu) = stir sum_l (2l+1)/(4pi) g_l P_l(mu) n_l + S(mu)
 *
 * and the right-hand side touches n only through its first few moments, because g_l dies.
 * Dividing by (Sigma_t + i k mu) is exact - the pole sits off the real axis for any Sigma_t > 0 -
 * and projecting leaves a small dense complex system in the MOMENTS alone:
 *
 *      (I - M) n = b ,   M_ll' = stir (2l'+1)/2 g_l' I_ll' ,   b_l = 2 pi I_l,src
 *      I_ll'(k)  = integral P_l(mu) P_l'(mu) / (Sigma_t + i k mu) dmu
 *
 * The truncation is now on g_l - a property of the RULE, which converges - rather than on the
 * solution, which does not. With stir = 0 the system is the identity and b alone reproduces the
 * ballistic answer to the quadrature's accuracy.
 */
const NMU = 512;                      // Gauss-Legendre nodes in mu, for the I integrals
const LG = 15;                        // moments the scattering needs: g_l is under 1% by l = 14

/** Gauss-Legendre nodes and weights on [-1,1], Newton on the Legendre polynomial */
const gauss = (n: number) => {
  const x = new Float64Array(n), w = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    let z = Math.cos(Math.PI * (i + 0.75) / (n + 0.5)), pp = 0;
    for (let it = 0; it < 100; it++) {
      let p0 = 1, p1 = 0;
      for (let j = 0; j < n; j++) { const p2 = p1; p1 = p0; p0 = ((2*j + 1)*z*p1 - j*p2)/(j + 1); }
      pp = n * (z*p0 - p1) / (z*z - 1);
      const dz = p0 / pp; z -= dz;
      if (Math.abs(dz) < 1e-15) break;
    }
    x[i] = z; w[i] = 2 / ((1 - z*z) * pp * pp);
  }
  return { x, w };
};
const GL = gauss(NMU);
const PL: Float64Array[] = [];
for (let l = 0; l <= LG; l++) {
  const row = new Float64Array(NMU);
  for (let i = 0; i < NMU; i++) row[i] = legendre(l, GL.x[i]);
  PL.push(row);
}

const response = (k: number, R: Rules, g: Float64Array, src: number): { re: number; im: number } => {
  const St = R.absorb + R.stir, n = LG + 1;
  const Ire: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  const Iim: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < NMU; i++) {
    const den = St*St + k*k*GL.x[i]*GL.x[i];
    const re = GL.w[i] * St / den, im = -GL.w[i] * k * GL.x[i] / den;
    for (let l = 0; l < n; l++) {
      const pl = PL[l][i];
      for (let l2 = l; l2 < n; l2++) { const v = pl * PL[l2][i]; Ire[l][l2] += v*re; Iim[l][l2] += v*im; }
    }
  }
  for (let l = 0; l < n; l++) for (let l2 = 0; l2 < l; l2++) { Ire[l][l2] = Ire[l2][l]; Iim[l][l2] = Iim[l2][l]; }

  const A: number[][] = Array.from({ length: n }, () => new Array(2*n + 2).fill(0));
  for (let l = 0; l < n; l++) {
    for (let l2 = 0; l2 < n; l2++) {
      const c = R.stir * (2*l2 + 1) / 2 * g[Math.min(l2, g.length - 1)];
      A[l][2*l2]     = (l === l2 ? 1 : 0) - c * Ire[l][l2];
      A[l][2*l2 + 1] = -c * Iim[l][l2];
    }
    A[l][2*n] = 2*Math.PI * Ire[l][src];  A[l][2*n + 1] = 2*Math.PI * Iim[l][src];
  }
  const gi = (r: number, c: number): [number, number] => [A[r][2*c], A[r][2*c+1]];
  const si = (r: number, c: number, v: [number, number]) => { A[r][2*c] = v[0]; A[r][2*c+1] = v[1]; };
  for (let c = 0; c < n; c++) {
    let piv = c;
    for (let r = c; r < n; r++) if (Math.hypot(...gi(r, c)) > Math.hypot(...gi(piv, c))) piv = r;
    [A[c], A[piv]] = [A[piv], A[c]];
    const [pr, pi] = gi(c, c), pd = pr*pr + pi*pi;
    for (let cc = c; cc <= n; cc++) {
      const [ar, ai] = gi(c, cc); si(c, cc, [(ar*pr + ai*pi)/pd, (ai*pr - ar*pi)/pd]);
    }
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const [fr, fi] = gi(r, c);
      if (fr === 0 && fi === 0) continue;
      for (let cc = c; cc <= n; cc++) {
        const [vr, vi] = gi(r, cc), [wr, wi] = gi(c, cc);
        si(r, cc, [vr - (fr*wr - fi*wi), vi - (fr*wi + fi*wr)]);
      }
    }
  }
  return { re: A[0][2*n], im: A[0][2*n + 1] };
};
/**
 * A_l(r) for l = 0..L on a radial grid: the radial profile of each multipole of the density.
 * The k integral is a spherical Hankel transform, done as a plain midpoint sum out to where the
 * response has died - the integrand is smooth and decays like 1/k^2, so nothing clever is needed.
 */
export const solve = (R: Rules, rs: Float64Array, kMax = 60, nk = 4000): Float64Array[] => {
  const g = kernel(R.theta, LG);
  const out: Float64Array[] = [];
  const dk = kMax / nk;
  for (let l = 0; l <= R.L; l++) {
    const A = new Float64Array(rs.length);
    /* h_l(k) once per k, reused for every radius */
    const hre = new Float64Array(nk), him = new Float64Array(nk);
    for (let i = 0; i < nk; i++) {
      const k = (i + 0.5) * dk;
      const h = response(k, R, g, l);
      hre[i] = h.re; him[i] = h.im;
    }
    /*
     * i^l MAKES IT REAL. The plane-wave expansion carries i^l, and h_l(k) is real for even l and
     * pure imaginary for odd l (the streaming term is the only imaginary one and it enters once
     * per step in l), so i^l h_l is real throughout. Taking the part that survives rather than
     * the modulus is what keeps a multipole's SIGN, which is the whole of a node.
     */
    const useIm = (l % 2) === 1;
    for (let j = 0; j < rs.length; j++) {
      const r = rs[j];
      let acc = 0;
      for (let i = 0; i < nk; i++) {
        const k = (i + 0.5) * dk;
        acc += k * k * besselJ(l, k * r) * (useIm ? him[i] : hre[i]) * dk;
      }
      A[j] = acc / (2 * Math.PI * Math.PI) * (useIm ? (l % 4 === 1 ? 1 : -1) : (l % 4 === 0 ? 1 : -1));
    }
    out.push(A);
  }
  return out;
};

/** the source's own angular pattern, as Legendre coefficients s_l - what the emission puts out */
export const project = (f: (mu: number) => number, L: number, n = 4000): Float64Array => {
  const s = new Float64Array(L + 1);
  for (let i = 0; i < n; i++) {
    const mu = -1 + (i + 0.5) * 2 / n;
    for (let l = 0; l <= L; l++) s[l] += f(mu) * legendre(l, mu) * (2 / n);
  }
  for (let l = 0; l <= L; l++) s[l] *= (2*l + 1) / 2;
  return s;
};
