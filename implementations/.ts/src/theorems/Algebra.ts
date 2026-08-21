/**
 * THE ARITHMETIC A FALLOFF RATE IS WRITTEN IN — exact, and open at the exponent.
 *
 * Everything this prover concludes has one shape: a quantity is proportional to a
 * product of other quantities raised to powers. `F ∝ A·S·r^−(D−1)` is one of those and
 * so is `shell ∝ κ·r^(D−1)`, and the whole of the deduction is multiplying and dividing
 * them. So that is the only algebra here: a monomial, and the exponents it carries.
 *
 * THE EXPONENTS ARE NOT NUMBERS. The thing to be recovered is the falloff RATE, and
 * writing it as −2 answers the question before it is asked — it fixes three dimensions
 * into the arithmetic and there is then nothing left for the lattice to decide. An
 * exponent here is a linear form in the lattice's own counts, `−D + 1`, and D is
 * whatever the geometry the theory was seeded on turns out to have. A run on the square
 * lattice concludes 1/r and a run on fcc-12 concludes 1/r², out of the same proof.
 *
 * EXACT, because the exponents come out of measured slopes that are then SNAPPED (see
 * `Probe.snap`), and a snapped slope carries no error into the algebra. Once a shell is
 * known to grow as D−1 rather than as 2.03, every line after it is arithmetic and must
 * be exact — a proof that concluded −2.0000000001 would have to be rounded to be read,
 * and the rounding is where a wrong answer hides.
 */

/** an exact rational — the coefficients of every exponent in this file */
export type Rat = { n: number; d: number };

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));

export const rat = (n: number, d = 1): Rat => {
  if (d === 0) throw new Error("a rational with nothing under it is not a number");
  const s = d < 0 ? -1 : 1, g = gcd(n, d) || 1;
  return { n: (s * n) / g, d: (s * d) / g };
};

export const R0 = rat(0), R1 = rat(1);

export const radd = (a: Rat, b: Rat): Rat => rat(a.n * b.d + b.n * a.d, a.d * b.d);
export const rsub = (a: Rat, b: Rat): Rat => radd(a, rat(-b.n, b.d));
export const rmul = (a: Rat, b: Rat): Rat => rat(a.n * b.n, a.d * b.d);
export const rzero = (a: Rat) => a.n === 0;
export const rnum = (a: Rat) => a.n / a.d;
export const rshow = (a: Rat) => (a.d === 1 ? `${a.n}` : `${a.n}/${a.d}`);

/**
 * AN EXPONENT — a rational, plus rational multiples of the lattice's counts.
 *
 * `D − 1` is `{ k: −1, of: { D: 1 } }`. The counts that may appear are the ones a
 * geometry actually fixes (D, and DEG where a rule reaches for it), and they stay
 * symbolic all the way to the page: the theorem is `r^−(D−1)`, and `1/r²` is what that
 * reads as once you say which lattice.
 */
export type Expo = { k: Rat; of: Record<string, Rat> };

export const expo = (k: number | Rat, of: Record<string, number | Rat> = {}): Expo => ({
  k: typeof k === "number" ? rat(k) : k,
  of: Object.fromEntries(Object.entries(of)
    .map(([s, v]) => [s, typeof v === "number" ? rat(v) : v])
    .filter(([, v]) => !rzero(v as Rat))) as Record<string, Rat>,
});

export const E0 = expo(0), E1 = expo(1);

export const eadd = (a: Expo, b: Expo): Expo => {
  const of: Record<string, Rat> = { ...a.of };
  for (const [s, v] of Object.entries(b.of)) of[s] = radd(of[s] ?? R0, v);
  return expo(radd(a.k, b.k), of);
};
export const eneg = (a: Expo): Expo =>
  expo(rmul(a.k, rat(-1)), Object.fromEntries(
    Object.entries(a.of).map(([s, v]) => [s, rmul(v, rat(-1))])));
export const esub = (a: Expo, b: Expo): Expo => eadd(a, eneg(b));
export const escale = (a: Expo, c: Rat): Expo =>
  expo(rmul(a.k, c), Object.fromEntries(
    Object.entries(a.of).map(([s, v]) => [s, rmul(v, c)])));
export const ezero = (a: Expo) => rzero(a.k) && Object.keys(a.of).length === 0;
export const eone = (a: Expo) =>
  a.k.n === a.k.d && Object.keys(a.of).length === 0;

/** the exponent as it is read out loud: `D−1`, `−(D−1)`, `2`, `−1/2` */
export const eshow = (a: Expo): string => {
  const bits: string[] = [];
  for (const [s, v] of Object.entries(a.of)) {
    const c = rnum(v);
    bits.push(c === 1 ? s : c === -1 ? `-${s}` : `${rshow(v)}${s}`);
  }
  if (!rzero(a.k) || !bits.length) {
    const k = rnum(a.k);
    /* the minus is the typographic one throughout, and a leading `+` is not written */
    bits.push(!bits.length ? rshow(a.k)
      : k > 0 ? `+${rshow(a.k)}` : `-${rshow(rat(-a.k.n, a.k.d))}`);
  }
  return bits.join("");
};

/** the exponent once the counts are known — what `−(D−1)` is on this lattice */
export const eval_ = (a: Expo, counts: Record<string, number>): number => {
  let v = rnum(a.k);
  for (const [s, c] of Object.entries(a.of)) {
    if (!(s in counts)) throw new Error(`nothing here says what ${s} is`);
    v += rnum(c) * counts[s];
  }
  return v;
};

/**
 * A PROPORTIONALITY — the product of bases, each to an exponent.
 *
 * There is no coefficient in it, and that is deliberate rather than a simplification:
 * every constant this proof would want in front is itself a count of the lattice, and a
 * count of the lattice is a BASE here (`κ`, the shell's own coefficient, is one). So
 * `n = S/(κ·r^(D−1))` is a monomial in S, κ and r with nothing outside it, and the
 * "proportionality that goes with the falloff" is the part of the answer that is not
 * the r exponent — which is a thing the algebra hands back rather than a thing anybody
 * writes down.
 */
export type Scaling = Record<string, Expo>;

export const scaling = (of: Record<string, number | Rat | Expo> = {}): Scaling => {
  const out: Scaling = {};
  for (const [b, e] of Object.entries(of)) {
    const x = typeof e === "number" ? expo(e) : "k" in (e as object) ? (e as Expo) : expo(e as Rat);
    if (!ezero(x)) out[b] = x;
  }
  return out;
};

export const ONE: Scaling = {};
export const base = (b: string, e: number | Expo = 1): Scaling =>
  scaling({ [b]: e });

export const smul = (a: Scaling, b: Scaling): Scaling => {
  const out: Scaling = { ...a };
  for (const [s, e] of Object.entries(b)) {
    const sum = eadd(out[s] ?? E0, e);
    if (ezero(sum)) delete out[s]; else out[s] = sum;
  }
  return out;
};
export const sinv = (a: Scaling): Scaling =>
  Object.fromEntries(Object.entries(a).map(([s, e]) => [s, eneg(e)]));
export const sdiv = (a: Scaling, b: Scaling): Scaling => smul(a, sinv(b));
export const spow = (a: Scaling, c: Rat): Scaling =>
  scaling(Object.fromEntries(Object.entries(a).map(([s, e]) => [s, escale(e, c)])));

/**
 * ONE BASE REPLACED BY WHAT IT IS MADE OF, exponent and all.
 *
 * This is the only non-obvious operation here and it is the one that makes the chain a
 * chain: the shell is `κ·r^(D−1)`, so a density written as `S/shell` becomes `S·κ^−1·
 * r^−(D−1)` — and the falloff rate appears, in r, having been nowhere in the line above.
 */
export const substitute = (a: Scaling, b: string, by: Scaling): Scaling => {
  const e = a[b];
  if (!e) return a;
  const rest = { ...a };
  delete rest[b];
  /* a symbolic exponent cannot be raised to a symbolic power and stay linear, so a
   * substitution under one is refused rather than silently linearised */
  if (Object.keys(e.of).length) throw new Error(
    `${b} stands under the exponent ${eshow(e)}, which has a count in it - ` +
    `substituting into that leaves the linear algebra this file is`);
  return smul(rest, spow(by, e.k));
};

export const skey = (a: Scaling): string =>
  Object.keys(a).sort().map(s => `${s}^${eshow(a[s])}`).join("·") || "1";

export const sshow = (a: Scaling): string => {
  const up: string[] = [], down: string[] = [];
  for (const s of Object.keys(a).sort()) {
    const e = a[s];
    /*
     * WHICH SIDE OF THE LINE AN EXPONENT BELONGS ON - decided by the part of it that
     * grows, not by its constant.
     *
     * `D-1` is `{k: -1, of: {D: 1}}` and `-D+1` is `{k: 1, of: {D: -1}}`. They are
     * opposite quantities whose CONSTANTS have the opposite sign to the thing that
     * matters, so testing the constant gets both wrong: it printed the shell as
     * `p / r^(-D+1)`, and once that was patched by refusing to move anything symbolic it
     * printed the force as `A.S.r^(-D+1) / b` - each the right quantity, said inside out.
     *
     * The COUNT decides. An exponent whose D-part is negative is a division: it goes
     * below the line, negated, so `r^(-D+1)` is set as `/ r^(D-1)`. One whose D-part is
     * positive stays above. With no count in it at all, the constant is all there is.
     */
    const lead = Object.values(e.of)[0];
    const neg = lead ? rnum(lead) < 0 : rnum(e.k) < 0;
    const put = neg ? down : up, x = neg ? eneg(e) : e;
    /*
     * THE EXPONENT IS ALWAYS BRACED, in the markup sense - `^{D-1}`, never `^D-1`,
     * which reads as `r^D` minus one and is a different claim. The braces are the
     * markup's and are consumed by the renderer, so what a reader sees is a real
     * superscript rather than a caret. See `rendering/Notation.ts`.
     */
    put.push(eone(x) ? s : `${s}^{${eshow(x)}}`);
  }
  if (!down.length) return up.join("·") || "1";
  return `${up.join("·") || "1"} / ${down.length > 1 ? `(${down.join("·")})` : down[0]}`;
};
