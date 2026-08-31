/**
 * THE ALGEBRA A DERIVATION IS DONE IN — expressions as values, so a conclusion is REACHED
 * rather than written down.
 *
 * `lib/Continuum.ts` assembles the line off the rules and that part is honest: the degree, the
 * facing, the shares and the signs are all counted. Then `falloff` and `geometry` printed
 * paragraphs at it - `"so a disturbance is pushed back at a = ..."` - and those paragraphs were
 * ME doing the algebra and typing the answer. Every objection raised against a declared gate
 * applies to a declared conclusion, more so: it cannot even be checked against the code it
 * claims to follow from.
 *
 * SO AN EXPRESSION IS A VALUE AND A DERIVATION IS A LIST OF STEPS. Differentiating a term with
 * respect to the density is a function on the tree; taking a moment of the line is a function
 * on the tree; solving a linear operator for its Green's function is a function on the tree.
 * The answer comes out because the steps were applied, and every step says which rule of
 * algebra it was and what it acted on - so a reader can check it and a change to a rule of the
 * MODEL moves it without anything here being edited.
 */

export type Expr =
  | { kind: "num"; n: number }
  | { kind: "sym"; name: string }
  /** a symbol standing for a field of the medium, which a derivative may act on */
  | { kind: "field"; name: string }
  | { kind: "add"; of: Expr[] }
  | { kind: "mul"; of: Expr[] }
  /** a power, whose exponent may itself be an expression - `r^{D-1}` is not `r^{1}` */
  | { kind: "pow"; base: Expr; by: number | Expr }
  /** the gradient of a scalar - what a direction-swinging term is made of */
  | { kind: "grad"; of: Expr }
  /** and the logarithm, which is what a gradient of a ratio integrates to */
  | { kind: "log"; of: Expr }
  /**
   * A CHOICE - how many ways `k` things come out of `n`.
   *
   * A STRUCTURE AND NOT A NAME. It was a `field` whose text spelled its own arguments, which
   * reads correctly and cannot be worked with: putting the dimension in never reached inside
   * the name, so a count that was ready to become a number stayed a symbol. Its arguments are
   * expressions like any others, so they are held as expressions.
   */
  | { kind: "choose"; n: Expr; k: Expr }
  /** and its inverse, which is what a gradient of a log integrates BACK to */
  | { kind: "exp"; of: Expr }
  /*
   * THE UPPER INCOMPLETE GAMMA — `\Gamma(s, x) = \int_{x}^{\infty} t^{s-1}e^{-t}dt`.
   *
   * A SUM ALONG A PATH OF SOMETHING THAT IS ALSO BEING DESTROYED is a power times a constant
   * raised to the distance, and that is not elementary for every power. It is exactly this,
   * for every power at once - including `s = 0`, where it is the exponential integral and the
   * sum is only logarithmically finite. Having the one function is what lets a marginal case
   * be carried rather than special-cased: the same expression is the convergent answer above
   * three dimensions, the logarithm at three, and the divergent one below.
   */
  | { kind: "gammaInc"; s: Expr; x: Expr }
  /*
   * THE ROOT OF AN EQUATION IN ONE OF ITS OWN NAMES — where a balance has no closed form.
   *
   * A quadratic can be solved and written down; `DEG\nu(1-n)^{DEG} = (DEG-2)\sigma Fn^{2}` has
   * the width of the lattice in an exponent and cannot. THAT IS NOT A REASON TO APPROXIMATE
   * IT. The equation is the derived thing, the number is what it comes to, and carrying the
   * first and evaluating the second keeps a law that changes with the rules rather than with
   * whoever last did the algebra.
   *
   * IT IS A PROBABILITY, WHICH IS WHAT MAKES IT SOLVABLE. Every balance of this kind here is a
   * balance in an occupancy - a share of rays that are lit - so the root is bracketed in
   * [0, 1] by what the quantity IS, and bisection cannot wander.
   */
  | { kind: "root"; of: Expr; in: string };

export const num = (n: number): Expr => ({ kind: "num", n });

/** how many ways k things come out of n - a count, computed where both are known */
const binomAt = (n: number, k: number): number => {
  if (k < 0 || k > n) return 0;
  let out = 1;
  for (let i = 0; i < k; i++) out = out * (n - i) / (i + 1);
  return Math.round(out);
};
export const sym = (name: string): Expr => ({ kind: "sym", name });
export const field = (name: string): Expr => ({ kind: "field", name });
export const add = (...of: Expr[]): Expr => flatten({ kind: "add", of });
export const mul = (...of: Expr[]): Expr => flatten({ kind: "mul", of });
export const pow = (base: Expr, by: number | Expr): Expr => ({ kind: "pow", base, by });
export const grad = (of: Expr): Expr => ({ kind: "grad", of });
export const log = (of: Expr): Expr => ({ kind: "log", of });
export const choose = (n: Expr, k: Expr): Expr => ({ kind: "choose", n, k });
export const exp = (of: Expr): Expr => ({ kind: "exp", of });
export const gammaInc = (s: Expr, x: Expr): Expr => ({ kind: "gammaInc", s, x });
export const root = (of: Expr, inName: string): Expr => ({ kind: "root", of, in: inName });

/* —— and the number it comes to, which a proof that fills in a dimension needs ———— */

/** log-gamma, Lanczos - so the complete gamma is available to normalise the series against */
const lgamma = (z: number): number => {
  const g = [676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012,
    9.9843695780195716e-6, 1.5056327351493116e-7];
  if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - lgamma(1 - z);
  z -= 1;
  let x = 0.99999999999980993;
  for (let i = 0; i < g.length; i++) x += g[i] / (z + i + 1);
  const t = z + g.length - 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
};

/** the exponential integral E_1(x) - the s = 0 case, where the complete gamma has no value */
const e1 = (x: number): number => {
  if (x <= 0) return NaN;
  if (x <= 1) {
    let sum = 0, term = 1;
    for (let k = 1; k <= 60; k++) { term *= -x / k; sum += -term / k; }
    return -0.5772156649015329 - Math.log(x) + sum;
  }
  /* Lentz's continued fraction, which is what converges out here */
  let b = x + 1, c = 1e300, d = 1 / b, h = d;
  for (let i = 1; i <= 200; i++) {
    const an = -i * i;
    b += 2;
    d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300;
    c = b + an / c;  if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d;
    const del = d * c; h *= del;
    if (Math.abs(del - 1) < 1e-14) break;
  }
  return h * Math.exp(-x);
};

/** and the upper incomplete gamma itself, series below the turn and continued fraction above */
export const gammaUpper = (s: number, x: number): number => {
  if (x < 0) return NaN;
  if (x === 0) return s > 0 ? Math.exp(lgamma(s)) : Infinity;
  if (Math.abs(s) < 1e-12) return e1(x);
  if (x < s + 1) {
    /* the lower one by its series, taken off the complete one */
    let ap = s, del = 1 / s, sum = del;
    for (let n = 1; n <= 500; n++) {
      ap++; del *= x / ap; sum += del;
      if (Math.abs(del) < Math.abs(sum) * 1e-15) break;
    }
    const lower = sum * Math.exp(-x + s * Math.log(x) - lgamma(s));
    return Math.exp(lgamma(s)) * (1 - lower);
  }
  let b = x + 1 - s, c = 1e300, d = 1 / b, h = d;
  for (let i = 1; i <= 500; i++) {
    const an = -i * (i - s);
    b += 2;
    d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300;
    c = b + an / c;  if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d;
    const del = d * c; h *= del;
    if (Math.abs(del - 1) < 1e-14) break;
  }
  return Math.exp(-x + s * Math.log(x)) * h;
};
export const neg = (e: Expr): Expr => mul(num(-1), e);
export const sub = (a: Expr, b: Expr): Expr => add(a, neg(b));
export const div = (a: Expr, b: Expr): Expr => mul(a, pow(b, -1));

/**
 * A LINEAR FORM IN THE COUNTS, GATHERED — so `D - D` is nothing and `D + D` is `2D`.
 *
 * Exponents here are forms like `1 - D` and `3 - 2D`, and taking one out of another leaves
 * their difference unsimplified: `R^{1-D}` divided out of `R^{1-D}` left `R^{D-D}` on the page,
 * which is one but does not look like it. Nothing else in this algebra needs like terms
 * collected - a product gathers by base and a sum by constant - so this is where it is done,
 * on the one shape that is always linear.
 */
const gather = (e: Expr): Expr => {
  const t = simplify(e);
  if (t.kind !== "add") return t;
  let c = 0;
  const by = new Map<string, { base: Expr; n: number }>();
  const walk = (x: Expr, sign: number) => {
    const y = simplify(x);
    if (y.kind === "num") { c += sign * y.n; return; }
    if (y.kind === "add") { for (const z of y.of) walk(z, sign); return; }
    if (y.kind === "mul") {
      let k = sign; const rest: Expr[] = [];
      for (const z of y.of) (z.kind === "num" ? k *= z.n : rest.push(z));
      if (!rest.length) { c += k; return; }
      /* a number times a sum is distributed - `-(D-1)` has to become `-D + 1` or the two
       * halves of it can never meet the `D` and the `1` they cancel against */
      if (rest.length === 1 && rest[0].kind === "add") {
        for (const z of (rest[0] as Extract<Expr, { kind: "add" }>).of) walk(z, k);
        return;
      }
      const id = rest.map(show).join("·");
      const at = by.get(id);
      by.set(id, { base: rest.length === 1 ? rest[0] : mul(...rest), n: (at?.n ?? 0) + k });
      return;
    }
    const id = show(y);
    const at = by.get(id);
    by.set(id, { base: y, n: (at?.n ?? 0) + sign });
  };
  walk(t, 1);
  const terms = [...by.values()].filter(({ n }) => n !== 0)
    .map(({ base, n }) => n === 1 ? base : mul(num(n), base));
  if (c !== 0) terms.push(num(c));
  return terms.length ? simplify(add(...terms)) : num(0);
};

const expandOne = gather;

const flatten = (e: Expr): Expr => {
  if (e.kind !== "add" && e.kind !== "mul") return e;
  const of: Expr[] = [];
  for (const x of e.of) (x.kind === e.kind ? of.push(...x.of) : of.push(x));
  return { ...e, of };
};

/** like terms gathered, constants folded - the only simplification, and it is arithmetic */
export const simplify = (e: Expr): Expr => {
  switch (e.kind) {
    case "num": case "sym": case "field": return e;
    case "grad": return grad(simplify(e.of));
    case "log": return log(simplify(e.of));
    case "exp": return exp(simplify(e.of));
    case "choose": {
      const n = simplify(e.n), k = simplify(e.k);
      /* once both are numbers it is one, and there is nothing left to carry */
      if (n.kind === "num" && k.kind === "num") return num(binomAt(n.n, k.n));
      return choose(n, k);
    }
    case "gammaInc": {
      const a = simplify(e.s), x = simplify(e.x);
      if (a.kind === "num" && x.kind === "num") return num(gammaUpper(a.n, x.n));
      return gammaInc(a, x);
    }
    case "root": return root(simplify(e.of), e.in);
    case "pow": {
      const b = simplify(e.base);
      if (typeof e.by !== "number") {
        /* an exponent is an expression like any other - `1 - 2(D-1)` is `3 - 2D` */
        const k = gather(e.by);
        /* one to any power is one, whatever the power is a form in */
        if (b.kind === "num" && b.n === 1) return num(1);
        /*
         * AND A NUMBER TO A NUMBER IS A NUMBER, however the exponent got here.
         *
         * `(1-\rho)^{DEG}` with both filled in is `0.5^{26}`, and leaving it as a `pow` because
         * the exponent arrived as an `Expr` rather than as a JS number means nothing that asks
         * "is this a number yet" ever gets a yes - which is how a root that was perfectly well
         * bracketed came back as NaN.
         */
        if (b.kind === "num" && k.kind === "num") return num(Math.pow(b.n, k.n));
        return pow(b, k);
      }
      if (e.by === 1) return b;
      if (e.by === 0) return num(1);
      if (b.kind === "num") return num(Math.pow(b.n, e.by));
      /* a power of a power multiplies the exponents - so 1/(1/sqrt(x)) is sqrt(x) */
      if (b.kind === "pow" && typeof b.by === "number") return simplify(pow(b.base, b.by * e.by));
      if (b.kind === "pow") return simplify(pow(b.base, mul(b.by as Expr, num(e.by))));
      return pow(b, e.by);
    }
    case "mul": {
      const parts = e.of.map(simplify).filter(x => !(x.kind === "num" && x.n === 1));
      let c = 1; const rest: Expr[] = [];
      for (const x of parts) (x.kind === "num" ? c *= x.n : rest.push(x));
      if (c === 0) return num(0);
      /*
       * AND LIKE BASES GATHERED, so `\sigma\rho^{2}·1/\rho` is `\sigma\rho` and not
       * itself written out twice. Only where the exponents are numbers - a symbolic one is
       * a linear form in the counts and adding two of those is somebody else's job.
       */
      /* keyed on what the base PRINTS as, so two copies of a bracket gather too */
      const powers = new Map<string, { base: Expr; k: Expr }>();
      for (const x of rest) {
        const b = x.kind === "pow" ? x.base : x;
        const k: Expr = x.kind === "pow"
          ? (typeof x.by === "number" ? num(x.by) : x.by) : num(1);
        const id = show(b);
        const at = powers.get(id);
        powers.set(id, { base: b, k: at ? add(at.k, k) : k });
      }
      const gathered = [...powers.values()]
        .map(({ base, k }) => ({ base, k: simplify(expandOne(k)) }))
        .filter(({ k }) => !(k.kind === "num" && k.n === 0))
        .map(({ base, k }) => (k.kind === "num" && k.n === 1) ? base : pow(base, k));
      const other: Expr[] = [];
      const all = [...gathered, ...other];
      if (!all.length) return num(c);
      return c === 1 ? (all.length === 1 ? all[0] : mul(...all)) : mul(num(c), ...all);
    }
    case "add": {
      const parts = e.of.map(simplify).filter(x => !(x.kind === "num" && x.n === 0));
      let c = 0; const rest: Expr[] = [];
      for (const x of parts) (x.kind === "num" ? c += x.n : rest.push(x));
      if (!rest.length) return num(c);
      return c === 0 ? (rest.length === 1 ? rest[0] : add(...rest)) : add(...rest, num(c));
    }
  }
};

/**
 * A NUMBER THAT IS A SIMPLE RATIO IS WRITTEN AS ONE.
 *
 * Halves and quarters arrive here as `0.5` and `0.25` because that is what the arithmetic
 * produced, and a law that reads `0.25·g^{2}` is asking a reader to recognise a quarter in
 * decimal in the middle of an algebraic line. Only SMALL denominators are recovered, and only
 * where the ratio is exact, so nothing that is genuinely a measurement gets dressed up as a
 * fraction it is not.
 */
const ratio = (n: number): string | undefined => {
  if (Number.isInteger(n)) return undefined;
  const sign = n < 0 ? "-" : "", x = Math.abs(n);
  for (let q = 2; q <= 12; q++) {
    const p = x * q;
    if (Math.abs(p - Math.round(p)) < 1e-12) return `${sign}\\frac{${Math.round(p)}}{${q}}`;
  }
  return undefined;
};

export const show = (e: Expr): string => {
  switch (e.kind) {
    case "num": return ratio(e.n) ?? `${e.n}`;
    case "sym": case "field": return e.name;
    case "log": return `\\ln\\paren{${show(e.of)}}`;
    case "exp": return `e^{${show(e.of)}}`;
    case "choose": return `\\binom{${show(e.n)}}{${show(e.k)}}`;
    case "gammaInc": return `\\Gamma\\paren{${show(e.s)}, ${show(e.x)}}`;
    case "root": return `\\text{the } ${e.in} \\text{ where } ${show(e.of)} = 0`;
    case "grad": return `\\nabla ${show(e.of)}`;
    case "pow": {
      /* an exponent may arrive as a number or as an expression that IS one */
      const k = typeof e.by === "number" ? e.by
        : (e.by.kind === "num" ? e.by.n : undefined);
      if (k === -1) return `\\frac{1}{${show(e.base)}}`;
      if (k === -0.5) return `\\frac{1}{\\sqrt{${show(e.base)}}}`;
      if (k === 0.5) return `\\sqrt{${show(e.base)}}`;
      /* a power of a sum needs its brackets, or `(1-b)^{2}` reads as `1 - b^{2}` */
      const base = e.base.kind === "add" || e.base.kind === "mul"
        ? `\\paren{${show(e.base)}}` : show(e.base);
      return `${base}^{${k !== undefined ? k : show(e.by as Expr)}}`;
    }
    case "mul": {
      const neg1 = e.of.some(x => x.kind === "num" && x.n === -1);
      const rest = e.of.filter(x => !(x.kind === "num" && (x.n === -1 || x.n === 1)));
      /* a sum inside a product is bracketed with the renderer's own `\paren`, not with
       * TeX's `\left(...\right)` - this notation has the first and not the second */
      /*
       * AND A RECIPROCAL IN A PRODUCT IS A FRACTION. `-R·\frac{1}{L}` is `-\frac{R}{L}`,
       * which is the same quantity and one glance rather than two.
       */
      /*
       * ANY NEGATIVE POWER GOES UNDER THE BAR, not only the first.
       *
       * `R^{-2}` is `1/R^{2}` and reads at a glance as a multiplication rather than a
       * division - which is exactly the wrong impression for an inverse square, the one
       * exponent a reader most needs to see. Only `-1` was being recognised, so a law falling
       * off as the square printed as though it grew. What decides is the SIGN of the exponent,
       * and a symbolic one is left alone because its sign is not known until the lattice is.
       */
      const negPow = (x: Expr): number | undefined => {
        if (x.kind !== "pow") return undefined;
        const k = typeof x.by === "number" ? x.by : (x.by.kind === "num" ? x.by.n : undefined);
        return k !== undefined && k < 0 ? -k : undefined;
      };
      const under = rest.filter(x => negPow(x) !== undefined);
      const over = rest.filter(x => negPow(x) === undefined);
      const set = (xs: Expr[]) => (xs.length ? xs : [num(1)]).map(x =>
        x.kind === "add" ? `\\paren{${show(x)}}` : show(x)).join("·");
      const body = under.length
        ? `\\frac{${set(over)}}{${set(under.map(x => {
            const k = negPow(x)!;
            const b = (x as Extract<Expr, { kind: "pow" }>).base;
            return k === 1 ? b : pow(b, k);
          }))}}`
        : set(rest);
      return neg1 ? `-${body}` : body;
    }
    case "add": {
      /* the positive ones first, so a sum reads `1 - \rho` rather than `-\rho + 1` */
      const neg = (x: Expr) => show(x).startsWith("-");
      const ordered = [...e.of.filter(x => !neg(x)), ...e.of.filter(neg)];
      return ordered.map((x, i) => {
        const t = show(x);
        return i === 0 ? t : t.startsWith("-") ? ` - ${t.slice(1)}` : ` + ${t}`;
      }).join("");
    }
  }
};

/**
 * DIFFERENTIATE WITH RESPECT TO A FIELD — the step that turns a rate into a restoring force.
 *
 * How a term responds to a small change in the density is what decides whether a disturbance
 * spreads or is pushed back, and it is the derivative. Nothing about gravity here: it is the
 * product rule and the power rule, applied to whatever the line turned out to be.
 */
export const d = (e: Expr, wrt: string): Expr => {
  switch (e.kind) {
    case "num": case "sym": return num(0);
    case "field": return e.name === wrt ? num(1) : num(0);
    case "add": return add(...e.of.map(x => d(x, wrt)));
    case "mul": return add(...e.of.map((x, i) =>
      mul(d(x, wrt), ...e.of.filter((_, j) => j !== i))));
    case "pow": return typeof e.by === "number"
      ? mul(num(e.by), pow(e.base, e.by - 1), d(e.base, wrt))
      : num(0);
    case "grad": return grad(d(e.of, wrt));
    case "log": return mul(pow(e.of, -1), d(e.of, wrt));
    case "exp": return mul(exp(e.of), d(e.of, wrt));
    case "choose": return num(0);
    /* d/dx Gamma(s, x) = -x^{s-1}e^{-x}, by what the integral is */
    case "gammaInc": return mul(num(-1), pow(e.x, sub(e.s, num(1))),
      exp(mul(num(-1), e.x)), d(e.x, wrt));
    /* a root is a number once everything else is; it does not vary with anything else here */
    case "root": return num(0);
  }
};

/**
 * AND THE INVERSE OF A GRADIENT, where the tree already says what it is the gradient OF.
 *
 * `grad(x)` integrates to `x`; `f/(1+n)` is recognised as `grad log(1+n)` when `f` is what the
 * gradient of `n` is called. That second one is the whole of how an index falls out of a
 * direction-swinging term, and it is pattern matching on the tree rather than an assertion.
 */
/** whether a name stands anywhere in an expression - `d` already walks the same shapes */
const has = (e: Expr, name: string): boolean =>
  (e.kind === "sym" || e.kind === "field") ? e.name === name
    : e.kind === "add" || e.kind === "mul" ? e.of.some(x => has(x, name))
    : e.kind === "pow" ? has(e.base, name) || (typeof e.by !== "number" && has(e.by, name))
    : e.kind === "grad" || e.kind === "log" || e.kind === "exp" ? has(e.of, name)
    : e.kind === "choose" ? has(e.n, name) || has(e.k, name)
    : e.kind === "gammaInc" ? has(e.s, name) || has(e.x, name)
    : e.kind === "root" ? false      /* its own name is bound inside it */
    : false;

/**
 * THE POWER OF `of` A TERM CARRIES — as an expression, because a dimension is a symbol here.
 *
 * `r^{2-2D}` and `r^{1-D}` are both powers of `r` and which of them survives at large `r`
 * depends on `D`, which nothing has fixed. So the exponent comes back symbolic and the
 * comparison is made separately.
 */
const powerIn = (e: Expr, of: string): Expr => {
  const t = simplify(e);
  if (t.kind === "sym" && t.name === of) return num(1);
  if (t.kind === "pow" && t.base.kind === "sym" && t.base.name === of)
    return typeof t.by === "number" ? num(t.by) : t.by;
  if (t.kind === "mul") return simplify(add(...t.of.map(x => powerIn(x, of))));
  if (t.kind === "pow" && typeof t.by === "number")
    return simplify(mul(powerIn(t.base, of), num(t.by)));
  return num(0);
};

/**
 * WHICH OF TWO EXPONENTS IS THE BIGGER — decided by trying, not by assuming.
 *
 * The exponents are expressions in `D`, so "bigger" is only a question once `D` is a number.
 * It is asked at several dimensions and the answer is only accepted if it is the SAME at all
 * of them - so `1-D` beats `2-2D` (true for every `D` above one) and a pair that genuinely
 * swaps over would return nothing rather than a decision that happens to hold at three.
 */
const bigger = (a: Expr, b: Expr): boolean | undefined => {
  let seen: boolean | undefined;
  for (const D of [2, 3, 4, 5, 7]) {
    const x = evaluate(a, { D }), y = evaluate(b, { D });
    if (x.kind !== "num" || y.kind !== "num") return undefined;
    if (x.n === y.n) continue;
    const here = x.n > y.n;
    if (seen === undefined) seen = here; else if (seen !== here) return undefined;
  }
  return seen;
};

/**
 * WHAT AN EXPRESSION COMES TO AT LARGE `of` — the term that outlives the others.
 *
 * A TAIL INTEGRAL IS SET BY THE TAIL OF WHAT IS INTEGRATED, so summing a profile from far out
 * needs only the part of it that still matters far out. That is what makes this worth having
 * rather than a shortcut: the whole profile is not integrable in closed form and its tail is,
 * exactly, and the tail is the thing being asked for.
 *
 * A SUM keeps its largest power. A ROOT takes the root of what is under it, reduced first -
 * which is where a transport that solved a quadratic gets its exponent halved, without anybody
 * saying so. Anything else is left as it stands.
 */
export const leading = (e: Expr, of: string): Expr => {
  const t = simplify(e);
  if (t.kind === "add") {
    const parts = t.of.map(x => leading(x, of));
    let best = parts[0];
    for (let i = 1; i < parts.length; i++) {
      const cmp = bigger(powerIn(parts[i], of), powerIn(best, of));
      if (cmp === undefined) return t;            // cannot tell - leave it whole
      if (cmp) best = parts[i];
    }
    return best;
  }
  if (t.kind === "pow" && typeof t.by === "number" && t.by > 0 && t.by < 1)
    return simplify(pow(leading(t.base, of), t.by));
  if (t.kind === "mul") return simplify(mul(...t.of.map(x => leading(x, of))));
  return t;
};

/**
 * A POWER OF A PRODUCT IS THE PRODUCT OF POWERS — `\sqrt{c·r^{k}} = \sqrt{c}·r^{k/2}`.
 *
 * Everything in these expressions is a count or a rate and none of them is negative, so this
 * holds wherever it is applied here. It matters because a transport that solved a quadratic
 * comes back as a ROOT OF A PRODUCT, and a root of a product hides the power of `r` inside
 * itself where nothing looking for one can see it - so an integral that could be done exactly
 * came back as though it could not be done at all.
 */
export const spread = (e: Expr): Expr => {
  const t = simplify(e);
  if (t.kind === "pow" && t.base.kind === "mul")
    return simplify(mul(...t.base.of.map(x => spread(pow(x, t.by)))));
  if (t.kind === "pow" && t.base.kind === "pow")
    return spread(pow(t.base.base, simplify(mul(
      typeof t.base.by === "number" ? num(t.base.by) : t.base.by,
      typeof t.by === "number" ? num(t.by) : t.by))));
  if (t.kind === "mul") return simplify(mul(...t.of.map(spread)));
  return t;
};

export const integrate = (e: Expr, of: string): Expr | undefined => {
  const s = spread(e);
  if (s.kind === "grad") return s.of;
  /*
   * AND `grad(u) / v` IS `grad log(v)` WHERE `v` DIFFERENTIATES TO WHAT `u` DOES.
   *
   * Checked by differentiating both and comparing, rather than by matching a shape: `1 + n` and
   * `n` have the same derivative, so the pattern holds for any `v` that differs from `u` by a
   * constant - and a kernel that produced a different denominator would be integrated correctly
   * or not at all, rather than silently.
   */
  if (s.kind === "mul") {
    const g = s.of.find(x => x.kind === "grad") as Extract<Expr, { kind: "grad" }> | undefined;
    const inv = s.of.find(x => x.kind === "pow" && x.by === -1) as
      Extract<Expr, { kind: "pow" }> | undefined;
    if (g && inv) {
      const inner = simplify(g.of), den = simplify(inv.base);
      if (show(simplify(d(den, of))) === show(simplify(d(inner, of)))) return log(den);
    }
  }
  /*
   * AND A POWER INTEGRATES BY ITS OWN RULE, which is the only other thing this needs to know.
   *
   *     \int r^{k} dr = r^{k+1}/(k+1)     and     \int r^{-1} dr = \ln r
   *
   * WITHOUT THIS, EVERY SUM ALONG A PATH HAD TO BE WRITTEN OUT BY HAND — a rule that wanted
   * one asserted its answer and said in a comment that summing raises the exponent, which is
   * true and is not the same as having done it. Asserted answers are right only for the
   * profile whoever wrote them had in mind, so a profile that later changed shape was summed
   * as though it had not.
   *
   * IT IS LINEAR, so a sum of terms integrates term by term and a constant factor comes out.
   * Anything else returns nothing at all rather than a guess - a rule that cannot do its sum
   * should not fire, and a proof that stops is worth more than one that continues on an
   * assumption nobody can see.
   */
  const pow_ = (base: Expr, by: number | Expr) => {
    if (base.kind !== "sym" || base.name !== of) return undefined;
    const k = typeof by === "number" ? num(by) : by;
    const k1 = simplify(add(k, num(1)));
    if (k1.kind === "num" && k1.n === 0) return log(sym(of));
    return simplify(mul(pow(sym(of), k1), pow(k1, -1)));
  };
  if (s.kind === "sym" && s.name === of) return pow_(s, 1);
  if (s.kind === "pow") return pow_(s.base, s.by);
  if (s.kind === "add") {
    const parts = s.of.map(x => integrate(x, of));
    if (parts.some(x => !x)) return undefined;
    return simplify(add(...parts as Expr[]));
  }
  if (s.kind === "mul") {
    /* a constant factor comes out; anything else in the product and this cannot do it */
    const free = s.of.filter(x => !has(x, of));
    const rest = s.of.filter(x => has(x, of));
    /*
     * A POWER TIMES SOMETHING DECAYING PER STEP — which is what a profile that spreads AND is
     * destroyed looks like, and it is not elementary for a general power.
     *
     *     \int r^{k}q^{r}dr = -\ell^{k+1}\Gamma(k+1, r/\ell),      \ell = -1/\ln q
     *
     * ONE ANSWER FOR EVERY `k`, which is the point of having the function at all. Above the
     * critical dimension the gamma is finite and the sum converges; at it, `k+1` is nought and
     * the same expression IS the exponential integral, so the logarithm falls out rather than
     * being a case anybody wrote. Below, it diverges, and it says so in the same breath.
     */
    if (rest.length === 2) {
      const decay = rest.find(x => x.kind === "pow" && !has(x.base, of) &&
        typeof x.by !== "number" && x.by.kind === "sym" && x.by.name === of) as
        Extract<Expr, { kind: "pow" }> | undefined;
      const other = rest.find(x => x !== decay);
      if (decay && other) {
        const k = powerIn(other, of);
        /* and it really is a bare power of it - a log or anything else and this does not apply */
        if (!has(simplify(mul(other, pow(sym(of), simplify(mul(k, num(-1)))))), of)) {
          const ell = simplify(mul(num(-1), pow(log(decay.base), -1)));
          const s1 = simplify(add(k, num(1)));
          return simplify(mul(...free, num(-1), pow(ell, s1),
            gammaInc(s1, mul(sym(of), pow(ell, -1)))));
        }
      }
    }
    if (rest.length !== 1) return undefined;
    const inner = integrate(rest[0], of);
    return inner ? simplify(mul(...free, inner)) : undefined;
  }
  return undefined;
};


/**
 * THE COMMON FACTOR TAKEN BACK OUT — `A·x + A·y` written as `A·(x + y)`.
 *
 * A SUM IS THE ONLY SHAPE THIS ALGEBRA HAS, so multiplying a bracket by anything distributes it
 * and the bracket is gone. That is fine while the terms are unrelated and wrong when they are
 * not: a force with two channels is ONE geometry with two things arriving through it, and
 * printed as two terms a reader has to notice for themselves that both carry the same room.
 *
 * FOR THE PAGE ONLY. Nothing downstream reads this and the two forms are the same quantity.
 */
export const factored = (e: Expr): Expr => {
  const t = simplify(e);
  if (t.kind !== "add" || t.of.length < 2) return t;
  /*
   * WHAT EVERY TERM HAS, WITH THE EXPONENTS KEPT AS EXPRESSIONS.
   *
   * `R^{1-D}` and `R^{3-2D}` are the same base to different powers, and a factoriser that only
   * understood NUMERIC exponents could not see it - so a law whose two channels are diluted
   * over the same shell printed as two terms each carrying its own room. The exponent is an
   * expression like any other, and one is taken out of the other by subtracting them.
   */
  const parts = t.of.map(x => {
    const m = new Map<string, { base: Expr; k: Expr }>();
    const bits = x.kind === "mul" ? x.of : [x];
    for (const b of bits) {
      const base = b.kind === "pow" ? b.base : b;
      const k: Expr = b.kind === "pow"
        ? (typeof b.by === "number" ? num(b.by) : b.by) : num(1);
      if (base.kind === "num") continue;
      m.set(show(base), { base, k });
    }
    return { x, m };
  });
  /* a base every term carries - and the first term's power of it is what comes out */
  const common: { base: Expr; k: Expr }[] = [];
  for (const [id, first] of parts[0].m) {
    if (!parts.every(p => p.m.has(id))) continue;
    /* where every power is a number, the least of them comes out; otherwise the first,
     * which is a valid factorisation whichever it is */
    const ks = parts.map(p => p.m.get(id)!.k);
    const nums = ks.every(k => simplify(k).kind === "num")
      ? ks.map(k => (simplify(k) as Extract<Expr, { kind: "num" }>).n) : undefined;
    if (nums && (Math.min(...nums) <= 0) !== (Math.max(...nums) <= 0)) continue;
    const k = nums ? num(nums.reduce((a2, b2) => Math.abs(b2) < Math.abs(a2) ? b2 : a2))
      : first.k;
    common.push({ base: first.base, k });
  }
  if (!common.length) return t;
  const out = mul(...common.map(({ base, k }) => pow(base, k)));
  const inv = mul(...common.map(({ base, k }) => pow(base, gather(neg(k)))));
  return simplify(mul(out, add(...t.of.map(x => simplify(mul(x, inv))))));
};

/**
 * A PRODUCT OF SUMS MULTIPLIED OUT — so that `1 - 2(D-1)` can be seen to be `3 - 2D`.
 *
 * The algebra keeps a bracket as a bracket, which is right for reading and wrong for deciding
 * whether two exponents are the same. Distributing is not a simplification of the expression -
 * it is usually longer - so it is done where a comparison needs it and not on the way to a page.
 */
export const expand = (e: Expr): Expr => {
  const t = simplify(e);
  switch (t.kind) {
    case "add": return simplify(add(...t.of.map(expand)));
    case "mul": {
      const parts = t.of.map(expand);
      let out: Expr[] = [num(1)];
      for (const p of parts) {
        const terms = p.kind === "add" ? p.of : [p];
        out = out.flatMap(a => terms.map(b => mul(a, b)));
      }
      return simplify(add(...out));
    }
    default: return t;
  }
};

/**
 * AND THE COMMON FACTOR TAKEN OUT AT EVERY DEPTH — because a sum inside a bracket has one too.
 *
 * `factored` takes what every term of a sum shares; a term that is itself a sum has its own
 * shared factor inside it, and taking only the outer one leaves the inner bracket carrying a
 * power in every term. Applied all the way down, a law comes out as one geometry with the
 * things arriving through it beside each other, which is the shape it is easiest to read.
 */
export const deepFactored = (e: Expr, depth = 0): Expr => {
  if (depth > 6) return simplify(e);
  /*
   * BOTTOM UP, because an outer sum can only see what its terms share once each of them has
   * been gathered. `A·R^{k} + B·(R^{k} + C·R^{j})` shares the room, and the outer sum cannot
   * tell until the bracket has been written as `R^{k}(1 + C·R^{j-k})`.
   */
  const inner = e.kind === "add" ? add(...e.of.map(x => deepFactored(x, depth + 1)))
    : e.kind === "mul" ? mul(...e.of.map(x => deepFactored(x, depth + 1)))
    : e;
  const t = factored(simplify(inner));
  /*
   * DOWN THE RESIDUALS, NOT BACK INTO WHAT WAS JUST BUILT.
   *
   * Factoring a sum hands back a PRODUCT whose last factor is that sum with the common part
   * divided out. Recursing on the product walks straight back into it and factors it again, for
   * ever - so what is descended into is the bracket's own terms, and the depth is capped
   * because an algebra that cannot stop is not one anybody can read the output of.
   */
  if (t.kind === "mul") {
    return simplify(mul(...t.of.map(x =>
      x.kind === "add" ? add(...x.of.map(y => deepFactored(y, depth + 1))) : x)));
  }
  if (t.kind === "add") return simplify(add(...t.of.map(x => deepFactored(x, depth + 1))));
  return t;
};



/**
 * A COUNT GIVEN ITS VALUE — and a binomial evaluated once its arguments are numbers.
 *
 * The laws here are written with `D` standing for the dimension, which is what lets one line
 * serve every lattice. A reader living in three of them wants the number, so the last step is
 * to put it in - and once it is in, things that were shapes become values: `r^{-(D-1)}` is
 * `r^{-2}`, and a choice of two things from two is `2`.
 */
export const evaluate = (e: Expr, at: Record<string, number>): Expr => {
  const go = (x: Expr): Expr => {
    switch (x.kind) {
      case "field": case "sym":
        return at[x.name] !== undefined ? num(at[x.name]) : x;
      case "add": return add(...x.of.map(go));
      case "mul": return mul(...x.of.map(go));
      case "pow": return pow(go(x.base), typeof x.by === "number" ? x.by : go(x.by));
      case "grad": return grad(go(x.of));
      case "gammaInc": {
        /* filled in only where BOTH parts came out as numbers - otherwise it stands, which is
         * what lets a law keep the dimension symbolic and still be read at three */
        const a = go(x.s), b = go(x.x);
        return a.kind === "num" && b.kind === "num"
          ? num(gammaUpper(a.n, b.n)) : gammaInc(a, b);
      }
      case "log": return log(go(x.of));
      case "exp": return exp(go(x.of));
      case "choose": return choose(go(x.n), go(x.k));
      case "gammaInc": return gammaInc(go(x.s), go(x.x));
      case "root": {
        /*
         * SOLVED WHERE EVERYTHING ELSE IS A NUMBER, and left standing where it is not.
         *
         * Bisection on [0,1], because the unknown is an occupancy and cannot be outside it.
         * If the two ends do not straddle, there is no root in the range the quantity is
         * allowed to take, and that is said by leaving it unsolved rather than by returning
         * an end point.
         */
        /* `evaluate` fills the names in and leaves a tree of numbers; `simplify` is what
         * folds that to one, so both are needed before a root can be looked for at all */
        const f = (v: number): number => {
          const got = simplify(evaluate(x.of, { ...at, [x.in]: v }));
          return got.kind === "num" ? got.n : NaN;
        };
        let lo = 1e-12, hi = 1 - 1e-12;
        const flo = f(lo), fhi = f(hi);
        if (!Number.isFinite(flo) || !Number.isFinite(fhi) || flo * fhi > 0)
          return root(go(x.of), x.in);
        for (let i = 0; i < 200; i++) {
          const mid = (lo + hi) / 2, fm = f(mid);
          if (!Number.isFinite(fm)) break;
          if (flo * fm <= 0) hi = mid; else lo = mid;
        }
        return num((lo + hi) / 2);
      }
      default: return x;
    }
  };
  return simplify(go(e));
};
