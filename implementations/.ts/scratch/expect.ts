/**
 * WHAT |Y_lm|^2 PUTS IN EACH LEGENDRE CHANNEL - computed, and shared, so that the lattice and
 * the lattice-free model are scored by the same lines of code.
 *
 * It was typed out by hand once and one row was wrong: 3d with m = 1 was written as "P2 < 0",
 * where |Y21|^2 = sin^2 cos^2 = u^2 - u^4 actually puts +0.60 in P2 and -1.43 in P4. fcc-12
 * measured +0.489 and -1.353 - its best l = 2 result by a distance - and the hand-written row
 * would have scored it a failure.
 *
 * The turning channel is a DENSITY and therefore quadratic in what is emitted, which is why it
 * is |Y|^2 that is projected and not Y. Normalised by its own RMS round the ring, because that
 * is how the measurement normalises too - the mean is nought for a signed channel and dividing
 * by it reported P1 = 736 once.
 */
export const P = (l: number, x: number): number => {
  if (l === 0) return 1;
  if (l === 1) return x;
  let pm = 1, p = x;
  for (let k = 2; k <= l; k++) { const pn = ((2*k-1)*x*p - (k-1)*pm)/k; pm = p; p = pn; }
  return p;
};

const assocP = (L: number, M: number, x: number): number => {
  let pmm = 1;
  if (M > 0) { const s = Math.sqrt(Math.max(0, 1 - x*x)); let f = 1;
    for (let i = 1; i <= M; i++) { pmm *= -f*s; f += 2; } }
  if (L === M) return pmm;
  let p1 = x*(2*M+1)*pmm;
  if (L === M+1) return p1;
  for (let ll = M+2; ll <= L; ll++) {
    const pr = ((2*ll-1)*x*p1 - (ll+M-1)*pmm)/(ll-M); pmm = p1; p1 = pr;
  }
  return p1;
};

export const CHANNELS = [1, 2, 3, 4, 6];

export const expected = (l: number, m: number) => {
  const N = 4000, f = new Float64Array(N);
  let ss = 0;
  for (let i = 0; i < N; i++) {
    const u = -1 + (i + 0.5) * 2 / N, y = assocP(l, m, u);
    f[i] = y * y; ss += f[i] * f[i];
  }
  const rms = Math.sqrt(ss / N) || 1;
  return CHANNELS.map(L => {
    let acc = 0;
    for (let i = 0; i < N; i++) acc += f[i] / rms * P(L, -1 + (i + 0.5) * 2 / N);
    return acc / N * (2*L + 1);
  });
};

/** how a measured row is scored: right sign and at least a tenth of what the emission puts there */
export const score = (c: number[], e: number[]) =>
  c.map((v, i) => (Math.abs(e[i]) < 0.05 ? " "
    : (Math.sign(v) === Math.sign(e[i]) && Math.abs(v) > 0.1 * Math.abs(e[i]) ? "+" : "-")));

/** and as a percentage of it, which is the number worth comparing across models */
export const pct = (c: number[], e: number[]) =>
  c.map((v, i) => (Math.abs(e[i]) < 0.05 ? NaN : 100 * v / e[i]));
