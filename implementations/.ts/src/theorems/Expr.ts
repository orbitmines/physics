/**
 * SUMS - the one thing the monomials could not say, and half the article needs it.
 *
 * `Algebra.ts` handles a product of powers, which is the right shape for a falloff and
 * the wrong shape for almost everything else in the law. The lean an annihilation buys is
 * `1 + n` ways out of a point where there was one; the total is `DEG + n`, not DEG; a
 * moving source's two retarded branches carry `1 - v` and `1 + v`; the metric's own
 * correction is `B^(3/2) - 1`. None of those is a monomial, and a prover that cannot
 * write a sum cannot state them, let alone work with them.
 *
 * SO AN EXPRESSION IS A SUM OF TERMS, and a term is an exact rational times a monomial.
 * That is enough for every line in the article's sixteen derivations: they add, multiply,
 * substitute one into another, and get expanded to first order in something small. It is
 * NOT a general computer algebra system and is not trying to be - there is no
 * factorisation here, no solving, and no simplification beyond collecting like terms,
 * because none of the derivations needs any of that and every one of them would be harder
 * to check if the machinery were cleverer.
 *
 * EXACT THROUGHOUT, for the reason everything else here is: the coefficients come from
 * counting, and 1/2 is an answer where 0.5 is a rounding of one.
 */
import {
  base, escale, Expo, expo, ezero, ONE, Rat, rat, radd, rmul, rnum, rshow, rzero, Scaling,
  sdiv, skey, smul, spow, sshow,
} from "./Algebra.ts";

/** an exact rational times a product of powers */
export type Term = { c: Rat; m: Scaling };
/** a sum of them - collected, so no two terms share a monomial */
export type Expr = Term[];

export const term = (c: number | Rat, m: Scaling = ONE): Term =>
  ({ c: typeof c === "number" ? rat(c) : c, m });

/** an expression from a plain number, or from a single monomial */
export const num = (c: number | Rat): Expr => collect([term(c)]);
export const mono = (m: Scaling, c: number | Rat = 1): Expr => collect([term(c, m)]);
export const sym = (b: string, e: number | Expo = 1): Expr => mono(base(b, e));

/**
 * LIKE TERMS ADDED, EMPTY ONES DROPPED - the only simplification in this file.
 *
 * Kept deliberately minimal. Anything cleverer would make a derivation harder to follow,
 * and following it is what the derivation is for.
 */
export const collect = (e: Expr): Expr => {
  const by = new Map<string, Term>();
  for (const t of e) {
    if (rzero(t.c)) continue;
    const k = skey(t.m);
    const at = by.get(k);
    if (at) at.c = radd(at.c, t.c);
    else by.set(k, { c: t.c, m: t.m });
  }
  return [...by.values()].filter(t => !rzero(t.c))
    /* a stable order, so two runs print the same line: constants last, then by name */
    .sort((a, b) => skey(a.m).localeCompare(skey(b.m)));
};

/*
 * DECLARED AFTER `collect`, because they use it at module load. `const` bindings are not
 * hoisted the way functions are, so a constant built by a function defined further down
 * throws before anything has run - which it did.
 */
export const ZERO: Expr = [];
export const ONE_E: Expr = collect([term(1)]);

export const add = (...es: Expr[]): Expr => collect(es.flat());
export const neg = (e: Expr): Expr => e.map(t => ({ c: rmul(t.c, rat(-1)), m: t.m }));
export const sub = (a: Expr, b: Expr): Expr => add(a, neg(b));

export const mul = (...es: Expr[]): Expr => es.reduce((a, b) => collect(
  a.flatMap(x => b.map(y => ({ c: rmul(x.c, y.c), m: smul(x.m, y.m) })))),
  ONE_E);

/** an expression raised to a whole power - repeated multiplication, and nothing subtler */
export const pow = (e: Expr, k: number): Expr => {
  /*
   * A SINGLE MONOMIAL CAN GO TO ANY POWER, and often has to: `∫ ds/s²` evaluated at its
   * lower limit is r^-1, which is a perfectly good term and not a sum at all. Only a SUM
   * raised to a negative power is beyond this algebra, because that is a genuinely
   * different kind of object and pretending otherwise is where wrong lines come from.
   */
  const single = asMonomial(e);
  if (single) {
    const c = collect(e)[0].c;
    if (!Number.isInteger(k) && !single) throw new Error("no");
    const scaled = spow(single, rat(Math.round(k * 12), 12));
    return collect([{ c: powRat(c, k), m: scaled }]);
  }
  if (k < 0) throw new Error(
    `${show(e)} to the power ${k}: a negative power of a sum is not a sum, and this ` +
    `algebra has no way to write one`);
  let out = ONE_E;
  for (let i = 0; i < k; i++) out = mul(out, e);
  return out;
};

/** a rational to a whole power - the only case a coefficient ever needs */
const powRat = (c: Rat, k: number): Rat => {
  if (!Number.isInteger(k)) throw new Error(
    `a coefficient to the power ${k} is not rational, and this algebra is`);
  const n = Math.pow(c.n, Math.abs(k)), d = Math.pow(c.d, Math.abs(k));
  return k >= 0 ? rat(n, d) : rat(d, n);
};

/** whether this is just a number, and what it is */
export const asNumber = (e: Expr): Rat | undefined => {
  const c = collect(e);
  if (!c.length) return rat(0);
  if (c.length === 1 && skey(c[0].m) === "1") return c[0].c;
  return undefined;
};

/** whether this is a single monomial, and which */
export const asMonomial = (e: Expr): Scaling | undefined => {
  const c = collect(e);
  return c.length === 1 ? c[0].m : undefined;
};

/**
 * ONE SYMBOL REPLACED BY AN EXPRESSION, wherever it stands.
 *
 * Refused where the symbol stands under an exponent that is not a whole number, or under
 * one with a lattice count in it - `n^D` with n replaced by a sum is not a sum, and
 * pretending otherwise is where a prover starts producing lines it cannot justify.
 */
export const substitute = (e: Expr, b: string, by: Expr): Expr =>
  collect(e.flatMap(t => {
    const x = t.m[b];
    if (!x) return [t];
    if (Object.keys(x.of).length) {
      /*
       * A SYMBOLIC EXPONENT IS FINE WHEN WHAT REPLACES IT IS A MONOMIAL.
       *
       * `(base^a)^x` is `base^(a.x)`, and if a is a plain rational then a.x is just x
       * scaled - still a linear form in the counts, which is exactly what this algebra
       * carries. Only a SUM under such an exponent is beyond it.
       *
       * Refusing both left gamma standing in the relativistic law unopened: it is raised
       * there to m_r - m_s + 2, a symbolic power, and gamma is itself a monomial power of
       * one minus beta squared. There was nothing to approximate - only an exponent to
       * multiply.
       */
      const only = asMonomial(by);
      const flat = only && Object.values(only).every(e => !Object.keys(e.of).length);
      if (!only || !flat) throw new Error(
        `${b} stands under an exponent with a count in it, so it cannot be replaced by ` +
        `a sum`);
      const rest0 = { ...t.m };
      delete rest0[b];
      let m = rest0;
      for (const [b2, e2] of Object.entries(only)) m = smul(m, { [b2]: escale(x, e2.k) });
      return [{ c: t.c, m }];
    }
    const k = rnum(x.k);
    const rest = { ...t.m };
    delete rest[b];
    /*
     * A NEGATIVE POWER IS FINE WHEN WHAT REPLACES IT IS A SINGLE TERM.
     *
     * One over a sum is not a sum and this algebra cannot write it - but one over a
     * single product of powers is just that product with its exponents negated, which it
     * can write perfectly well. Refusing both left `met_far` sitting unopened in the
     * denominator of the assembled gravitational law, because the near-field correction
     * is a ratio against it.
     */
    const single = asMonomial(by);
    if (single) {
      const c0 = collect(by)[0].c;
      return [{
        c: rmul(t.c, powRat(c0, k)),
        m: smul(rest, spow(single, rat(Math.round(k * 12), 12))),
      }];
    }
    if (!Number.isInteger(k) || k < 0) throw new Error(
      `${b} stands to the power ${rshow(x.k)} and what replaces it is a sum, which this ` +
      `algebra has no way to raise to that`);
    return mul([{ c: t.c, m: rest }], pow(by, k));
  }));

/**
 * DROP EVERYTHING SMALLER THAN FIRST ORDER IN A SMALL QUANTITY.
 *
 * `(1 - v)^-1 = 1 + v + v² + ...` truncated after the term that matters, which is what
 * every "to first order" in the article means. Written as a rule rather than done by hand
 * so the truncation is visible and so the order kept is stated rather than assumed.
 */
export const toFirstOrder = (e: Expr, small: string, order = 1): Expr =>
  collect(e.filter(t => {
    const x = t.m[small];
    if (!x) return true;
    if (Object.keys(x.of).length) return true;
    return rnum(x.k) <= order;
  }));

/** the expression as it is read out loud */
export const show = (e: Expr): string => {
  const c = collect(e);
  if (!c.length) return "0";
  return c.map((t, i) => {
    const neg = rnum(t.c) < 0;
    const mag = neg ? rmul(t.c, rat(-1)) : t.c;
    const one = mag.n === mag.d;
    const body = skey(t.m) === "1" ? rshow(mag)
      : one ? sshow(t.m)
      : `${rshow(mag)}·${sshow(t.m)}`;
    return `${i === 0 ? (neg ? "-" : "") : neg ? " - " : " + "}${body}`;
  }).join("");
};

/** the same, bracketed when it is a sum and would otherwise run into its neighbours */
export const showIn = (e: Expr): string =>
  collect(e).length > 1 ? `(${show(e)})` : show(e);

export const key = (e: Expr): string =>
  collect(e).map(t => `${rshow(t.c)}*${skey(t.m)}`).join("+") || "0";

/**
 * THE COMMON FACTOR TAKEN BACK OUT - `A + A·near` written as `A·(1 + near)`.
 *
 * A SUM IS THE ONLY SHAPE THIS ALGEBRA HAS, so multiplying a bracket by anything
 * distributes it and the bracket is gone. That is fine while the terms are unrelated and
 * wrong when they are not: the gravitational law is a Newtonian term times one plus a
 * correction that dies away with distance, and printed as two terms a reader has to
 * notice for themselves that the second is the first multiplied by something small.
 *
 * SO THE FACTOR IS TAKEN BACK OUT FOR THE PAGE, and only for the page - nothing downstream
 * reads this, and the two forms are the same quantity. What is returned is the common
 * monomial and what is left beside it; where there is nothing in common it says so and the
 * caller prints the sum as it stands.
 */
const gcd2 = (a: number, b: number): number => (b ? gcd2(b, a % b) : Math.abs(a));
const lcm2 = (a: number, b: number) => Math.abs(a * b) / (gcd2(a, b) || 1);

export const factored = (
  e: Expr,
): { common: Scaling; rest: Expr; scale: Rat } | undefined => {
  const c = collect(e);
  if (c.length < 2) return undefined;

  /* the largest monomial every term is divisible by - the lowest power of each base */
  const bases = Object.keys(c[0].m).filter(b => c.every(t => t.m[b]));
  const common: Scaling = {};
  for (const b of bases) {
    /*
     * AN EXPONENT THE TERMS ALL SHARE COMES OUT WHOLE, whatever it is.
     *
     * This is the case that matters and it used to be the one skipped. In `F_g = A + A·near`
     * every term carries the same `R^{-(D-1)}` and the same `1/DEG`, so those belong
     * outside the bracket entirely - and an exponent with a lattice count in it is exactly
     * the shape they have. Requiring a comparison of magnitudes ruled them out and left
     * only the masses, which factors almost nothing and reads worse than not factoring.
     */
    const same = c.every(t => skey({ x: t.m[b] }) === skey({ x: c[0].m[b] }));
    if (same) { common[b] = c[0].m[b]; continue; }
    /*
     * EXPONENTS THAT DIFFER ONLY BY A CONSTANT still share a factor, and it is the one
     * worth taking: R^{-(D-1)} and R^{-D} have the same count in them and differ by one,
     * so the law's Newtonian scale can come out of both and leave a bare 1/R behind in
     * the second. Which of the two to take out is not the strict greatest common divisor
     * - that would be R^{-D} and would leave an R sitting in two numerators. It is the
     * one MOST of the terms already have, which is the scale the law is actually written
     * at.
     */
    const ofs = c.map(t => skey({ x: expo(rat(0), t.m[b].of) }));
    if (!ofs.every(o => o === ofs[0])) continue;
    const ks = c.map(t => rnum(t.m[b].k));
    const tally = new Map<number, number>();
    for (const k of ks) tally.set(k, (tally.get(k) ?? 0) + 1);
    const best = [...tally.entries()].sort((x, y) => y[1] - x[1] || x[0] - y[0])[0][0];
    common[b] = expo(rat(Math.round(best * 12), 12), c[0].m[b].of);
  }
  if (!Object.keys(common).length) return undefined;

  /*
   * AND THE NUMBER IN FRONT COMES OUT WITH THE SYMBOLS.
   *
   * `2 + 2·near` is `2·(1 + near)`, and leaving the two inside the bracket hides that the
   * bracket is a Newtonian one plus a correction - which is the only reason to factor at
   * all. The common divisor of the coefficients goes outside with the rest.
   */
  /*
   * ONLY A WHOLE COMMON FACTOR COMES OUT.
   *
   * Taking the fractional part too turns `½·a + b` into `½·(a + 2·b)` - arithmetically
   * the same and worse to read, because a half now sits outside a bracket that has had a
   * two put into it to pay for it. A whole factor shared by every term is a simplification;
   * a fraction is just moved.
   */
  const num0 = c.map(t => Math.abs(t.c.n)), den0 = c.map(t => t.c.d);
  const whole = den0.every(d => d === 1);
  const g = whole ? num0.reduce(gcd2) : 1, l = 1;
  const scale = rat(g, l);
  const rest = collect(c.map(t => ({
    c: rat(t.c.n * l, t.c.d * g), m: sdiv(t.m, common),
  })));
  return { common, rest, scale };
};

/**
 * THE EXPRESSION, WITH EACH GROUP'S COMMON FACTOR SET OUTSIDE ITS OWN BRACKET.
 *
 * ONE BRACKET IS NOT ENOUGH once a sum has genuinely unrelated pieces in it. The
 * gravitational law has a meeting channel carrying SHEET²·m·m'/DEG across two terms and a
 * vacuum channel carrying A² across one; there is no factor all three share, so factoring
 * across all of them finds nothing and every constant is printed twice. Grouped, each
 * channel is written once with its own bracket and the repetition goes.
 *
 * THE GROUPING IS BY WHAT THE TERMS ACTUALLY SHARE - greedily, first term first, taking
 * everything that has a factor in common with it. That is enough for the shapes these
 * laws have and it does not pretend to be a factoring algorithm.
 */
export const showFactored = (e: Expr): string => shown(e);

/** the terms of a sum, split into the groups that actually share a factor */
const grouped = (c: Expr): Expr[] => {
  const left = [...c];
  const groups: Expr[] = [];
  while (left.length) {
    const seed = left.shift()!;
    const group = [seed];
    for (let i = left.length - 1; i >= 0; i--) {
      /* the same test the factoring uses: a base whose symbolic part matches, whatever
       * constant the two exponents differ by - see `factored` */
      const shared = Object.keys(seed.m).some(b => {
        const a = seed.m[b], z = left[i].m[b];
        if (!z) return false;
        return skey({ x: expo(rat(0), a.of) }) === skey({ x: expo(rat(0), z.of) });
      });
      if (shared) group.unshift(...left.splice(i, 1));
    }
    groups.push(group);
  }
  return groups;
};

/**
 * A SUM WRITTEN AS COMPACTLY AS ITS OWN STRUCTURE ALLOWS.
 *
 * THE GRAVITATIONAL LAW IS A TWO-BY-TWO and that is what makes this worth doing properly.
 * Two of its terms share the distance scale and two share the counts standing in front of
 * the masses - and the two pairs OVERLAP, so one pass of factoring can only take out one
 * of them and whichever it takes, the other stays written twice.
 *
 * So grouping and factoring call each other. A sum is split into the groups that actually
 * share something; each group has its common factor taken out; and what is left inside
 * the bracket is a sum again, which gets the same treatment. The law comes out with each
 * of its constants written once, which is the whole point - a reader should be able to
 * see that two of the three terms are the samething with different distance behaviour, and
 * they cannot see that through a repeated denominator.
 */
const shown = (e: Expr, depth = 4): string => {
  const c = collect(e);
  if (c.length < 2 || depth <= 0) return show(c);

  const groups = grouped(c);
  if (groups.length > 1) return groups.map(g => shown(g, depth - 1)).join(" + ");

  const f = factored(c);
  if (!f) return show(c);
  const n = f.scale.n === f.scale.d ? "" : `${rshow(f.scale)}·`;
  return `${n}${sshow(f.common)}·\\paren{${shown(f.rest, depth - 1)}}`;
};
