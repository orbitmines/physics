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
  | { kind: "root"; of: Expr; in: string }
  /*
   * A LIMIT — what an expression comes to as one of its names is sent to infinity.
   *
   * A QUANTITY DEFINED BY A LIMIT SHOULD BE WRITTEN AS ONE. `\bar{m}` is what a body sends per
   * unit of its own face once the face is all there is left of it, and printing only the value
   * that comes out hides the whole content of the statement - which is that the body's size
   * cancels. `root` is here for exactly the same reason: the equation is the derived thing and
   * the number is what it comes to.
   *
   * AND IT IS TAKEN NUMERICALLY, the way `root` is solved numerically. Pushing the name out and
   * watching the value settle IS what a limit is; a symbolic limit would need a rewriting
   * system this file does not have, and asserting the answer beside the expression would be
   * the thing this whole arrangement exists to avoid.
   */
  | { kind: "limit"; of: Expr; in: string }
  /*
   * A NAMED FUNCTION OF ONE EXPRESSION — `l.choose\paren{k}` and anything else the lattice
   * offers by name rather than by formula.
   *
   * `field` cannot do this: its name is a string, so an argument written into it is text and
   * substitution never reaches inside. That is the same defect `choose` was fixed for - it was
   * a `field` whose text spelled its own arguments, and putting the dimension in never got
   * into it. So the argument is an expression like any other and every walker descends into it.
   *
   * WHAT IT COMES TO IS THE THEORY'S TO SAY, not this file's. `evaluate` leaves it standing
   * unless something has told it otherwise, which is the same treatment a name with no law
   * gets - and means a law written in terms of one is carried symbolically rather than
   * silently given a number nobody derived.
   */
  | { kind: "call"; name: string; of: Expr };

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
export const limit = (of: Expr, inName: string): Expr => ({ kind: "limit", of, in: inName });
export const call = (name: string, of: Expr): Expr => ({ kind: "call", name, of });

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
    /*
     * AND A LOG OR AN EXPONENTIAL OF A NUMBER IS A NUMBER — which nothing folded, so any law
     * carrying one stayed a tree after every name in it had been filled in, and whatever asked
     * "is this a number yet" got no for a reason that had nothing to do with the physics.
     */
    case "log": {
      const x = simplify(e.of);
      return x.kind === "num" && x.n > 0 ? num(Math.log(x.n)) : log(x);
    }
    case "exp": {
      const x = simplify(e.of);
      return x.kind === "num" ? num(Math.exp(x.n)) : exp(x);
    }
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
    case "limit": return limit(simplify(e.of), e.in);
    case "call": return call(e.name, simplify(e.of));
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
      /*
       * AND A WHOLE POWER OF A PRODUCT GOES ONTO ITS FACTORS, which is what lets a ratio
       * cancel. `\frac{g·a}{\frac{1}{4}g^{2}}` is `g·a·\paren{\frac{1}{4}g^{2}}^{-1}`, and
       * with the power left sitting on the bracket the `g` upstairs never meets the `g^{2}`
       * downstairs - so the quarter stays in a denominator and the whole thing prints as a
       * fraction of two products that share a factor. Distributed, `mul` gathers the bases and
       * it comes to `\frac{4a}{g}`.
       *
       * ONLY FOR A WHOLE POWER. `\sqrt{xy}` is `\sqrt{x}\sqrt{y}` only where both are
       * positive, and nothing here knows that.
       */
      if (b.kind === "mul" && Number.isInteger(e.by))
        return simplify(mul(...b.of.map(x => pow(x, e.by as number))));
      return pow(b, e.by);
    }
    case "mul": {
      /*
       * AND A CHILD THAT SIMPLIFIES INTO A PRODUCT IS FOLDED BACK IN.
       *
       * `mul` flattens when it is BUILT, but simplifying a child can turn it into a product
       * that was not one before: `A\paren{1 - \paren{1 + \frac{m}{A}}}` has one child that
       * comes back as `-\frac{m}{A}`, and with that left as a single factor the `A` upstairs
       * never meets the `A` downstairs. The gathering below keys on what each factor prints
       * as, so it saw `A` and `-\frac{m}{A}` and had nothing to do — the law printed
       * `-\frac{A·m·\ln\paren{1-\rho}}{A}`, an expression with a factor cancelling itself.
       */
      const parts = e.of.flatMap(x => {
        const y = simplify(x);
        return y.kind === "mul" ? y.of : [y];
      }).filter(x => !(x.kind === "num" && x.n === 1));
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
      /*
       * A NUMBER TIMES A SUM, INSIDE A SUM, IS WRITTEN OUT FIRST.
       *
       * `1 - \paren{x + 1}` stayed exactly that, because nothing here multiplies a bracket
       * out and so the outer sum never got to see the `1` it could have cancelled. That is not
       * cosmetic: `shadowing`'s skin law in the scattered limit is `A\paren{1 - \paren{1 +
       * \frac{m\ln\paren{1-\rho}}{A}}}`, which IS `-m\ln\paren{1-\rho}` — the face
       * cancels and the mass comes out — and the law printed with `A` still in it and the mass
       * still buried in a bracket. A reader could not see that the scattered arrival goes as
       * the mass at all.
       *
       * ONLY A NUMBER TIMES A SUM, so this stays a flattening and does not become an expand.
       * `m\paren{1-\beta}^{2}\Sigma_{0}^{2}\paren{\ldots + 1}` has factors that are not
       * numbers and is left alone, which is what keeps the two channels readable as two
       * channels.
       */
      const flat = e.of.flatMap(x => {
        const y = simplify(x);
        /* and a child that simplifies into a sum is folded in, for the same reason */
        if (y.kind === "add") return y.of;
        if (y.kind !== "mul") return [y];
        const sums = y.of.filter(z => z.kind === "add");
        const nums = y.of.filter(z => z.kind === "num");
        if (sums.length !== 1 || nums.length + sums.length !== y.of.length) return [y];
        const k = nums.reduce((a, z) => a * (z as Extract<Expr, { kind: "num" }>).n, 1);
        return (sums[0] as Extract<Expr, { kind: "add" }>).of.map(z => simplify(mul(num(k), z)));
      });
      const parts = flat.map(simplify).filter(x => !(x.kind === "num" && x.n === 0));
      let c = 0; const rest: Expr[] = [];
      for (const x of parts) (x.kind === "num" ? c += x.n : rest.push(x));
      /*
       * AND LIKE TERMS GATHERED, which `mul` has always done for like bases and this never did
       * for like terms.
       *
       * `x - x` printed as `x - x` and `2x + 3x` as `2x + 3x`, so a sum could carry the same
       * expression any number of times and nothing would put them together. That is most of
       * why the finished laws repeat themselves: every substitution that produced a term
       * already standing in the sum left both copies there, and the cancellation that would
       * have collapsed a bracket never happened. It also blocked every rearrangement built on
       * one - `A + \sqrt{A^{2} + q}` cannot be folded if `A^{2} + q - A^{2}` will not come to
       * `q`.
       *
       * KEYED ON WHAT THE TERM PRINTS AS, minus its numeric coefficient, which is the same
       * device `mul` uses for bases and is exact for anything `show` distinguishes.
       */
      const like = new Map<string, { of: Expr; c: number }>();
      const order: string[] = [];
      for (const x of rest) {
        let k = 1, body: Expr = x;
        if (x.kind === "mul") {
          const nums = x.of.filter(y => y.kind === "num") as Extract<Expr, { kind: "num" }>[];
          if (nums.length) {
            k = nums.reduce((a, y) => a * y.n, 1);
            const others = x.of.filter(y => y.kind !== "num");
            body = others.length === 1 ? others[0] : mul(...others);
          }
        }
        const id = show(body);
        const at = like.get(id);
        if (at) at.c += k; else { like.set(id, { of: body, c: k }); order.push(id); }
      }
      const kept: Expr[] = [];
      for (const id of order) {
        const { of, c: k } = like.get(id)!;
        if (k === 0) continue;
        kept.push(k === 1 ? of : mul(num(k), of));
      }
      if (!kept.length) return num(c);
      return c === 0 ? (kept.length === 1 ? kept[0] : add(...kept))
        : add(...kept, num(c));
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
    /*
     * AN EQUATION IS SHOWN SOLVED FOR ITS OWN UNKNOWN WHERE IT CAN BE.
     *
     * `root` is `the x where <body> = 0`, and for a balance that is the right shape: the
     * settled density is genuinely a thing that makes two rates cancel. But a law that says
     * `g = g_{N}\paren{1 + a_{0}/g}` arrives here as `g_{N}\paren{1 + a_{0}/g} - g`, and
     * printing it against nought puts a `- g = 0` on the end of a two-line expression that
     * reads like a leftover. It is not a leftover - it is the left-hand side - so where the
     * body carries exactly one bare `-x`, it is moved across and the equation is written the
     * way it was derived.
     */
    case "call": return `${e.name}\\paren{${show(e.of)}}`;
    case "limit": return `\\lim_{${e.in} \\to \\infty} ${
      e.of.kind === "add" ? `\\paren{${show(e.of)}}` : show(e.of)}`;
    case "root": {
      const body = e.of;
      if (body.kind === "add") {
        const isMinus = (x: Expr) =>
          x.kind === "mul" && x.of.length === 2 &&
          x.of.some(y => y.kind === "num" && y.n === -1) &&
          x.of.some(y => (y.kind === "field" || y.kind === "sym") && y.name === e.in);
        const at = body.of.findIndex(isMinus);
        if (at >= 0 && body.of.filter(isMinus).length === 1) {
          const rest = body.of.filter((_, i) => i !== at);
          return `\\text{the } ${e.in} \\text{ where } ${e.in} = ` +
            `${show(rest.length === 1 ? rest[0] : add(...rest))}`;
        }
      }
      return `\\text{the } ${e.in} \\text{ where } ${show(e.of)} = 0`;
    }
    case "grad": return `\\nabla ${show(e.of)}`;
    case "pow": {
      /* an exponent may arrive as a number or as an expression that IS one */
      const k = typeof e.by === "number" ? e.by
        : (e.by.kind === "num" ? e.by.n : undefined);
      if (k === -1) return `\\frac{1}{${show(e.base)}}`;
      if (k === -0.5) return `\\frac{1}{\\sqrt{${show(e.base)}}}`;
      if (k === 0.5) return `\\sqrt{${show(e.base)}}`;
      /*
       * A POWER OF A SUM NEEDS ITS BRACKETS, or `(1-b)^{2}` reads as `1 - b^{2}` — AND SO
       * DOES A NAME THAT IS NOT ONE TOKEN. A quantity called `g_{N} at D = 3` squared came out
       * as `g_{N} at D = 3^{2}`, which raises the three.
       */
      const loose = (e.base.kind === "sym" || e.base.kind === "field") &&
        /[\s^]/.test(e.base.name);
      const base = e.base.kind === "add" || e.base.kind === "mul" ||
        e.base.kind === "root" || loose
        ? `\\paren{${show(e.base)}}` : show(e.base);
      return `${base}^{${k !== undefined ? k : show(e.by as Expr)}}`;
    }
    case "mul": {
      /*
       * A RATIONAL COEFFICIENT IS AN INTEGER OVER AN INTEGER, and both halves are told apart
       * here so that everything below can put each where it belongs.
       *
       * `\frac{1}{2}` is itself a fraction, so a half times a reciprocal printed as a
       * fraction whose numerator was one - `\frac{\frac{1}{2}}{n_{f} + 1}`, two bars for one
       * division. That shows up the moment the rates are filled in, which is exactly when a
       * reader is being handed an answer and least wants to decipher it. Split, the two go to
       * opposite sides of one bar; and the sign comes out as a bare `-1`, which the line below
       * already knows how to carry.
       */
      const flat = e.of.flatMap(x => {
        if (x.kind !== "num" || Number.isInteger(x.n)) return [x];
        const sign = x.n < 0 ? -1 : 1, v = Math.abs(x.n);
        for (let q = 2; q <= 12; q++) {
          const p = v * q;
          if (Math.abs(p - Math.round(p)) < 1e-12)
            return [num(sign * Math.round(p)), pow(num(q), -1)];
        }
        return [x];
      });
      const neg1 = flat.some(x => x.kind === "num" && x.n === -1);
      const rest = flat.filter(x => !(x.kind === "num" && (x.n === -1 || x.n === 1)));
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
        /* a sum inside a product needs its brackets - and so does an unsolved equation, or
         * `R\cdot\text{the } g \text{ where } \ldots = 0` reads as though the `R` were part
         * of the equation rather than a factor multiplying whatever solves it */
        x.kind === "add" || x.kind === "root" ? `\\paren{${show(x)}}` : show(x)).join("·");
      const below = under.map(x => {
        const k = negPow(x)!;
        const b = (x as Extract<Expr, { kind: "pow" }>).base;
        return k === 1 ? b : pow(b, k);
      });
      /* a lone denominator is already delimited by the bar, so bracketing it again gives
       * `\frac{2a_{0}}{\paren{\sqrt{\ldots} - 1}}` where the brackets say nothing */
      /* a number under the bar is a coefficient and goes first, as one is written */
      const ordered = [...below].sort((a, b) =>
        (a.kind === "num" ? 0 : 1) - (b.kind === "num" ? 0 : 1));
      const bar = ordered.length === 1 && ordered[0].kind === "add"
        ? show(ordered[0]) : set(ordered);
      const top = set(over);
      /*
       * AND A LONG NUMERATOR IS NOT PUT OVER A BAR — it is multiplied by the reciprocal.
       *
       * `\frac{a}{R^{2}}` is one glance while `a` is short. Once the written-out laws arrived
       * `a` became three hundred characters of arrivals, and the whole of it went upstairs of
       * a fraction whose denominator was `R^{2}`: a rule two lines long with a bar under all
       * of it and a two-character divisor at the bottom, which is unreadable on a page and
       * worse when it has to wrap. The same quantity written `\frac{1}{R^{2}}·a` puts the
       * inverse square where a reader meets it first, at its own size, and leaves the long
       * part running along the line as a product.
       *
       * THE THRESHOLD IS ABOUT READING AND NOTHING ELSE, so it is a length and it is here
       * rather than hidden in a caller. It is set where a numerator stops fitting on a line:
       * anything shorter stays a fraction, because for short things a fraction IS the one
       * glance, and flipping those would trade one unreadable form for another.
       */
      const body = !under.length ? set(rest)
        : top.length > 140 ? `\\frac{1}{${bar}}·${top}`
        : `\\frac{${top}}{${bar}}`;
      return neg1 ? `-${body}` : body;
    }
    case "add": {
      /* the positive ones first, so a sum reads `1 - \rho` rather than `-\rho + 1` */
      const neg = (x: Expr) => show(x).startsWith("-");
      const ordered = [...e.of.filter(x => !neg(x)), ...e.of.filter(neg)];
      return ordered.map((x, i) => {
        /* and an unsolved equation inside a sum needs its brackets too, or `the x where ... =
         * 0 + y` reads as though the `y` were on the right-hand side of the equation */
        const t = x.kind === "root" ? `\\paren{${show(x)}}` : show(x);
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
    case "num": return num(0);
    /*
     * A SYMBOL IS A NAME TOO. `sym` and `field` differ in where they came from and not in what
     * they are, and the radius arrives as a `sym` - so treating one as a constant made every
     * derivative with respect to it nought, silently and with no error to read.
     */
    case "sym": case "field": return e.name === wrt ? num(1) : num(0);
    case "add": return add(...e.of.map(x => d(x, wrt)));
    case "mul": return add(...e.of.map((x, i) =>
      mul(d(x, wrt), ...e.of.filter((_, j) => j !== i))));
    /*
     * AND A POWER IS DIFFERENTIATED WHEREVER THE NAME STANDS IN IT — base, exponent or both.
     *
     * The numeric case is the familiar one and is kept because it prints plainly. Otherwise
     * `\partial_{x}u^{v} = u^{v}\paren{v'\log u + v u'/u}`, which covers `R^{-\paren{D-1}}` where
     * the name is underneath and `\paren{1-1/L}^{R}` where it is upstairs. Returning nought for
     * these was not a simplification: the screening and the dilution are both powers, and both
     * were being reported as not varying with the radius at all.
     */
    case "pow": {
      if (typeof e.by === "number")
        return mul(num(e.by), pow(e.base, e.by - 1), d(e.base, wrt));
      const du = d(e.base, wrt), dv = d(e.by, wrt);
      const flat = (x: Expr) => x.kind === "num" && x.n === 0;
      if (flat(du) && flat(dv)) return num(0);
      if (flat(dv)) return mul(e.by, pow(e.base, sub(e.by, num(1))), du);
      if (flat(du)) return mul(pow(e.base, e.by), log(e.base), dv);
      return mul(pow(e.base, e.by),
        add(mul(dv, log(e.base)), mul(e.by, du, pow(e.base, -1))));
    }
    case "grad": return grad(d(e.of, wrt));
    case "log": return mul(pow(e.of, -1), d(e.of, wrt));
    case "exp": return mul(exp(e.of), d(e.of, wrt));
    case "choose": return num(0);
    /* d/dx Gamma(s, x) = -x^{s-1}e^{-x}, by what the integral is */
    case "gammaInc": return mul(num(-1), pow(e.x, sub(e.s, num(1))),
      exp(mul(num(-1), e.x)), d(e.x, wrt));
    /* a root and a limit are numbers once everything else is; neither varies with anything.
     * A call MIGHT vary, and this file does not know how it does - so it is not differentiated
     * rather than being differentiated wrongly. */
    case "root": case "limit": return num(0);
    case "call": return grad(e);
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

/**
 * AN EXPRESSION AS A NUMBER, DIRECTLY — for where the same tree is read thousands of times.
 *
 * `evaluate` then `simplify` rebuilds the tree at every reading: it allocates a new node per
 * operator, walks it again to fold, and hands back an `Expr` that then has to be unwrapped.
 * That is the right shape for a proof, which reads a law once and wants an expression back.
 * IT IS THE WRONG SHAPE FOR A SOLVER. Bisecting a balance reads one tree a few hundred times,
 * and a sweep does that for every configuration; the arithmetic is nothing and the allocation
 * is everything.
 *
 * SO THIS WALKS THE TREE AND RETURNS A NUMBER, allocating none. The two agree by construction
 * - the cases are the same cases - and where a name is missing or an operator has no numeric
 * meaning it says so with `NaN` rather than by returning something half-folded.
 */
/**
 * ONE PIECE OF AN EXPRESSION FOR ANOTHER — replacing a SUBTREE, not a name.
 *
 * `replace` swaps a symbol wherever it stands, which is what substituting a law into another
 * law needs. Taking a LIMIT needs the other thing: a whole factor goes to nothing, or a whole
 * factor straightens out into its first term, and the piece being replaced has no name of its
 * own - it is `\paren{1-\sigma\rho}^{m/A}` and nothing calls it anything.
 *
 * Matching is on what the two render as, so it is exactly as fine as the printer is, and a rule
 * that swaps a piece can be read against the page it prints.
 */
export const swap = (e: Expr, piece: Expr, by: Expr): Expr => {
  const want = show(piece);
  const go = (x: Expr): Expr => {
    if (show(x) === want) return by;
    switch (x.kind) {
      case "add": return { ...x, of: x.of.map(go) };
      case "mul": return { ...x, of: x.of.map(go) };
      case "pow": return { ...x, base: go(x.base),
        by: typeof x.by === "number" ? x.by : go(x.by) };
      case "log": return { ...x, of: go(x.of) };
      case "exp": return { ...x, of: go(x.of) };
      case "root": case "limit": case "call": return { ...x, of: go(x.of) };
      default: return x;
    }
  };
  return go(e);
};

/**
 * AND WHAT AN EXPRESSION COMES TO AS A NAME IS SENT OUT — a limit, taken by taking it.
 *
 * Push the name up by decades and watch the value settle. A limit that exists settles; one
 * that does not runs away, and this says so by returning nothing rather than by returning the
 * last thing it happened to compute. Same arrangement as `solveRoot`: the expression is the
 * derived object and the number is what it comes to, so a rule that changes shape moves the
 * number rather than being quietly contradicted by it.
 *
 * THE STEP IS A DECADE AND THE TEST IS RELATIVE, because these are counts on a lattice and the
 * things being sent out are radii. Twenty decades is far past where anything here converges
 * and cheap; the loop stops the moment two of them agree.
 */
const toInfinity = (of: Expr, name: string, at: Record<string, number>): number => {
  let was = NaN;
  for (let k = 1; k <= 20; k++) {
    const got = numeric(of, { ...at, [name]: Math.pow(10, k) });
    if (!Number.isFinite(got)) return NaN;
    if (Number.isFinite(was) && Math.abs(got - was) <= 1e-12 * Math.max(1, Math.abs(got)))
      return got;
    was = got;
  }
  return NaN;                      /* it did not settle - there is no limit to report */
};

export const numeric = (e: Expr, at: Record<string, number>): number => {
  switch (e.kind) {
    case "num": return e.n;
    case "sym": case "field": {
      const v = at[e.name];
      return v === undefined ? NaN : v;
    }
    case "add": {
      let sum = 0;
      for (const x of e.of) sum += numeric(x, at);
      return sum;
    }
    case "mul": {
      let prod = 1;
      for (const x of e.of) prod *= numeric(x, at);
      return prod;
    }
    case "pow": return Math.pow(numeric(e.base, at),
      typeof e.by === "number" ? e.by : numeric(e.by, at));
    case "log": return Math.log(numeric(e.of, at));
    case "exp": return Math.exp(numeric(e.of, at));
    case "gammaInc": return gammaUpper(numeric(e.s, at), numeric(e.x, at));
    case "choose": {
      const n = numeric(e.n, at), k = numeric(e.k, at);
      let r = 1;
      for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1);
      return r;
    }
    /* AND A ROOT IS SOLVED, by the same solver `evaluate` uses - see `solveRoot`. Returning
     * nothing here was a real hole: every balance in this proof is a root, so a reader that
     * could not do them agreed with the other one on the arithmetic and disagreed on the
     * physics. Caught by asking the two to agree across every fact in the store. */
    case "root": return solveRoot(e.of, e.in, at);
    case "limit": return toInfinity(e.of, e.in, at);
    default: return NaN;
  }
};

/**
 * WHERE AN EQUATION IN ONE OF ITS OWN NAMES CROSSES NOUGHT — one solver, both readers.
 *
 * The range is WALKED rather than sampled at its ends: a balance can be negative at both and
 * positive between, and `\rho` is one, since a mean free path carries `1/\rho` and runs away
 * as the density goes to nothing. Widened if nothing in [0,1] straddles, because a count is
 * not an occupancy and has no reason to be under one. It gives up rather than returning an end
 * point, so "no solution" and "did not look" cannot be confused.
 */
const solveRoot = (of: Expr, name: string, at: Record<string, number>): number => {
  const env = { ...at };
  const f = (v: number): number => { env[name] = v; return numeric(of, env); };
  /*
   * AND IT GIVES UP AT ONCE WHERE THERE IS NOTHING TO SOLVE.
   *
   * A root is asked of symbolically all the time - saturation simplifies expressions that carry
   * one long before anything is bound - and with a name missing every reading is nothing at
   * all. Scanning forty widening brackets at two hundred samples each to discover that costs
   * ten thousand readings per simplify and is the whole of why proving got slow. Two probes
   * settle it: if the equation cannot even be read here, it has no root to find.
   */
  if (!Number.isFinite(f(0.5)) && !Number.isFinite(f(1)) && !Number.isFinite(f(0.1)))
    return NaN;
  /*
   * AND THE RANGE IS WALKED ONCE, IN THE LOGARITHM.
   *
   * These equations are solved for occupancies and for counts, which live decades apart, so the
   * bracket has to cover a wide range - but WIDENING A LINEAR SCAN AND REDOING IT re-reads
   * everything it already read, forty times over, and that was ten thousand readings for a
   * root that a few hundred settle. One pass, spaced evenly in the logarithm, covers the same
   * ground at the same resolution PER DECADE and reads each point once.
   *
   * The stretch below one is walked linearly as well, because an occupancy sits there and the
   * logarithm spends most of its samples far under it where nothing ever is.
   */
  const points: number[] = [];
  for (let i = 1; i <= 120; i++) points.push(i / 120);
  for (let e = 0; e <= 24; e++)
    for (let k = 1; k < 8; k++) points.push(Math.pow(10, -12 + e) * (1 + k / 2));
  points.sort((p, q) => p - q);
  let span: [number, number] | undefined;
  let px = points[0], pf = f(px);
  for (let i = 1; i < points.length; i++) {
    const cx = points[i], cf = f(cx);
    if (Number.isFinite(pf) && Number.isFinite(cf) && pf * cf <= 0) { span = [px, cx]; break; }
    px = cx; pf = cf;
  }
  if (!span) return NaN;
  let [lo, hi] = span, flo = f(lo);
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2, fm = f(mid);
    if (!Number.isFinite(fm)) break;
    if (flo * fm <= 0) hi = mid; else { lo = mid; flo = fm; }
    if (hi - lo <= 1e-15 * Math.max(1, Math.abs(hi))) break;
  }
  return (lo + hi) / 2;
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
        /* the same solver the direct reader uses, so the two cannot drift apart */
        const v = solveRoot(x.of, x.in, at);
        return Number.isFinite(v) ? num(v) : root(go(x.of), x.in);
      }
      case "limit": {
        const v = toInfinity(x.of, x.in, at);
        return Number.isFinite(v) ? num(v) : limit(go(x.of), x.in);
      }
      /* its argument is filled in; what the call itself comes to is not this file's to say */
      case "call": return call(x.name, go(x.of));
      default: return x;
    }
  };
  return simplify(go(e));
};
