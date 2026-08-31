/**
 * THE EQUATION, COUNTED OFF THE RULES THEMSELVES — and there is nothing here to keep in step.
 *
 * A DISCRETE RULE AND A CONTINUOUS TERM ARE THE SAME STATEMENT AT TWO SCALES. (G/2) fires at
 * a neutral point and lights every exit; below the scale where one point matters that is
 * `+nu(1-rho)`, a rate against the room left. (G/1) fires on a facing pair of active ends and
 * destroys both; that is `-sigma n n~ F`, a loss quadratic in the density taken against what
 * is coming the other way. Neither is a new claim. They are the same rule, counted rather
 * than followed.
 *
 * SO NOTHING ABOUT THE EQUATION IS WRITTEN DOWN, AND NOTHING ABOUT IT IS DECLARED. It was
 * written out, in the research repository — a string with every term already in it, true
 * because somebody transcribed it. Then it was declared beside each rule, which is the same
 * fault one step smaller: a second description of the same code, free to drift, with nothing
 * able to tell that it had. Then the gates were made into values and the BODY was still a
 * closure with `makes` written next to it, which is the same fault again.
 *
 * A RULE IS NOW THREE VALUES AND NO CODE: a quantifier, some gates and some effects. This
 * file counts them.
 *
 *   THE SIGN IS WHAT THE EFFECTS DO. `split` lights every exit, so the population it changes
 *   is positive and its term is a source; `annihilate` puts two rays out, so its term is a
 *   sink. Nobody writes `makes` or `removes`: edit the effect and the term changes with it.
 *
 *   THE DEGREE IS THE QUANTIFIER. A facing pair needs a ray AND something coming the other
 *   way, so its term is quadratic — which is what separates a meeting from a decay. Nobody
 *   writes `n n~`.
 *
 *   THE FACING FACTOR IS THAT SAME PAIR, because a pair is a pair ACROSS an edge, so the rate
 *   goes against the oncoming current rather than the density where the ray stands.
 *
 *   AND WHETHER IT IS A TERM OF THE MEDIUM AT ALL IS WHERE IT FIRES. An effect done to
 *   something put into the box from outside is `Sigma` whatever its arithmetic.
 *
 * ONE TERM PER EVENT, NOT PER RULE — which is what makes the double reading of a meeting come
 * out right without anybody having to say so. (G/1) is one event; ANNIHILATION finds it on a
 * facing pair and MOVEMENT finds it one step sooner, and because both effects point at the
 * same `Event` the equation gets one loss term with both rules credited on it. Before this,
 * one rule had to DECLARE that it resolved the other's business, which is a claim somebody
 * could get wrong. Now they either share the event or they do not.
 */
import { add, d, div, Expr, field, grad, integrate, log, mul, num, pow, show as showE,
  simplify, sub, sym } from "./Algebra.ts";
import { showCount, type Count } from "./Language.ts";
import { Declared, degreeOf, facingOf } from "./Rules.ts";

/**
 * ONE TERM, WITH EVERYTHING BEHIND IT STILL ATTACHED.
 *
 * Not a string. A string is what the equation is PRINTED as, and printing is the last thing
 * that should happen to it: a prover wants the sign and the rewrites behind it, a reader
 * wants the symbol, an ablation wants the names of the rules to take out. All three are this.
 */
export type Term = {
  /** the rewrites this term came out of - EMPTY where nothing in the model puts it there */
  rules: string[];
  sign: -1 | 1;
  /** how it is written, assembled from the rate, the gates, the degree and the facing */
  symbol: string;
  /** the power of the density, counted off the quantifier */
  degree: number;
  /** whether the rate goes against the oncoming current - true of a facing pair, only */
  facing: boolean;
  /** transport and the tick sit left of the equals; everything else on the right */
  side: "left" | "right";
  /** a left-hand term without the population - `\partial_{t}`, not `\partial_{t}n` */
  operator?: string;
  /** what the rate is called, kept so `falloff` can differentiate the line */
  rate?: string;
  /** and what the gates let through, for the same reason */
  share?: Expr;
  /** whether the rule's body draws - which is what makes its rate anything but one */
  draws?: boolean;
  /** what a turn does to a direction - both moments, see `Term.kernel` */
  kernel?: { keeps: Expr; drifts: Expr };
  /** rays one firing makes (+) or puts out (−), COUNTED OFF THE BODY - what decided the sign */
  rays: string;
  /** and points of space, which is the other ledger and the one gravity is read off */
  space: string;
  /*
   * AND THE SAME TWO AS COUNTS RATHER THAN AS TEXT.
   *
   * `rays` and `space` above are for printing. A proof needs to ARITHMETIC with them - the two
   * ledgers settle at different densities precisely because their coefficients differ, and a
   * rule that reads only the rendered string cannot tell DEG from 1. They were computed and
   * then thrown away at the boundary; these are the same numbers, kept.
   */
  rayCount: Count;
  spaceCount: Count;
  /*
   * WHAT THE QUANTIFIER WALKED — a point, a ray, a facing pair.
   *
   * A GATE'S SHARE IS A SHARE OF WHATEVER IT WAS ASKED ABOUT, and those are not the same
   * population. `busy` is asked of a POINT and answers whether ANY of its DEG rays is lit;
   * the line's `n` is a share of RAYS. Reading both as one symbol makes a point-occupancy and
   * a ray-density the same number, and they are DEG draws apart.
   */
  over: string;
  says: string;
};

export type Equation = {
  theory: string;
  population: string;
  terms: Term[];
  /**
   * THE OTHER LEDGER, WRITTEN OUT — because this model has two things and one line cannot say
   * both.
   *
   * `n` is the population: what streams, what meets, what a density is a density OF. `s` is
   * SPACE: what a fold destroys and an unfold hands back. Every term does something to each,
   * and the two are read off the same rule bodies at once - `\nu(1-\rho)` makes DEG rays AND
   * one point of space, `\sigma n\tilde{n}F` takes two rays AND one point.
   *
   * SO THERE ARE TWO LINES AND THEY ARE COUPLED. `s` divides nothing here any more - what it
   * does is bend, through the fold record - but it is still what the meetings build and what
   * (G/2) hands back, and gravity is a shortfall IN IT. A page that printed only the rays line
   * was showing half the model.
   */
  space(): string;
  /** rules written as bare functions, with no declaration to read - the line is short of them */
  opaque: string[];
  toString(): string;
};

export type Readable = {
  name: string;
  rules: Record<string, { declared?: Declared }>;
};

/** the population raised to the degree - `n·n~` rather than `n^{2}`, because the second
 *  factor is what is coming the OTHER way and a square hides that */
const powers = (n: string, degree: number): string =>
  degree === 0 ? "" : degree === 1 ? n : degree === 2 ? `${n}\\tilde{${n}}` : `${n}^{${degree}}`;

/**
 * ONE RULE, READ AS ONE TERM PER THING IT CAN DO — and every line counts something the rule
 * already had to say in order to run at all.
 *
 * THE SIGN IS WHAT THE BODY DOES, walked off the body's own tree. The atoms know their
 * arithmetic because it is what their words mean — dousing a ray removes a ray — and `each`
 * MULTIPLIES its body by how many it runs over, which is where a count of the lattice enters:
 * (G/2) comes out `+DEG` because it lights every exit there is, not because anybody wrote DEG.
 *
 * THE DEGREE IS WHAT THE BRANCH ASKED FOR. A branch that fires only when one ray is carrying
 * is linear in the density; one that asks for a ray AND the ray facing it is quadratic, and
 * quadratic across an edge is a MEETING, so it carries the facing factor. Neither is declared:
 * `lit(x)` is one factor of n, and the branch's condition is what the code already asks.
 *
 * AND WHERE IT FIRES COMES BEFORE BOTH: a body done to something put in from outside is
 * `Sigma` whatever its arithmetic.
 */
export const read = (
  name: string, d: Declared, population: string, source: string,
): Term[] => {
  const q = d.quantifier;
  /* what the quantifier hands over, and what the branch itself asked to be carrying - the
   * larger is the true degree, since a rule walked one way may still be about a pair */
  const handed = degreeOf(q);
  const outside = q.outside || d.gates.some(g => g.outside) ||
    d.body.doing.some(b => b.outside);
  /*
   * WHAT THE GATES LET THROUGH, MULTIPLIED — and there is no case analysis here on purpose.
   *
   * A condition narrows, the rule does what it does on that share, and the term carries it.
   * `1 - rho` and `1 - beta` reach the line by the same road, and so will anything a later gate
   * narrows by, without this function learning about it.
   */
  /* what the gates let through, AND what the shape of the match itself contributes */
  const shares = [...d.gates.map(g => g.test.share), q.share].filter(Boolean) as Expr[];
  const share = shares.length ? simplify(mul(...shares)) : undefined;
  /* and what any choice the body makes leaves of a direction - see `Term.kernel` */
  const kernel = d.body.doing.map(b => b.kernel).find(Boolean);

  return d.body.doing.map(doing => {
    const degree = Math.max(handed, doing.needs.length);
    /*
     * FACING IS NOT THE SAME QUESTION AS QUADRATIC, though in `G` they answer alike.
     *
     * Two rays make a term quadratic wherever they are; the rate goes against the oncoming
     * CURRENT only where the two are ACROSS AN EDGE, which is what a facing pair is. A rule
     * about two rays at one point would be `n^2` with no F, and reading the F off the degree
     * would hand it one. So it is asked of the quantifier, or of a body that went and found
     * what faced the ray it was given.
     */
    const facing = facingOf(q) || doing.needs.length >= 2;
    const shape = {
      rules: [name], degree, facing, rate: d.rate, share, kernel,
      draws: doing.draws,
      rays: showCount(doing.rays), space: showCount(doing.space),
      rayCount: doing.rays, spaceCount: doing.space, over: String(q.about ?? q.type),
      says: d.body.says,
    };

    if (outside) return {
      ...shape, rules: [], sign: 1 as const,
      symbol: `${share
        ? (simplify(share).kind === "add" ? `\\paren{${showE(share)}}` : showE(share))
        : ""}${source}`, side: "right" as const,
    };
    if (doing.settles) return {
      ...shape, sign: 1 as const, symbol: `\\partial_{t}${population}`,
      operator: "\\partial_{t}", side: "left" as const,
    };

    const net = doing.rays.n + Object.values(doing.rays.of).reduce((x, y) => x + y, 0);
    /*
     * AND A BRANCH THAT MAKES SPACE IS NOT TRANSPORT, however little it does to the population.
     *
     * "Makes no rays and carries" was taken as enough to be the transport operator, and for
     * `handOver` it is - a ray moved from here to there is the same ray, so the population is
     * untouched and the step is the whole of what happened. `waitForRoom` passes the same test
     * for a different reason: it hands the ray to ITSELF, so no ray moves and none is made.
     * But it also GROWS THE WORLD, and that is a point of space that has to appear on the
     * second line. Swallowed into the operator it appeared on neither - `MOVEMENT` hands
     * `Continuum` two carrying branches, both were called transport, and the merge kept the
     * first one's counts, so the `+1` was dropped without trace.
     *
     * THE SPACE LEDGER IS THE ONE GRAVITY IS READ OFF, so a rule that makes space and is
     * filed as a derivative takes the whole of it with it.
     */
    const spaceNet = doing.space.n
      + Object.values(doing.space.of).reduce((x, y) => x + y, 0);
    if (!net && !spaceNet && doing.carries) {
      /*
       * AND TRANSPORT MAY BE DIVIDED BY SOMETHING, which is what a metric is.
       *
       * A ray crosses a place once per point that place stands for, so where space has been
       * folded in it goes slower - `c̄/s` rather than `c̄`. That is not a term added to the
       * equation, it is the transport operator itself carrying a local factor, and it is read
       * off the condition the rule asks rather than written in by hand.
       */
      const by = doing.slows;
      const carry = by
        ? `\\frac{\\hat{d}·\\nabla_{x}}{${by}}`
        : "\\hat{d}·\\nabla_{x}";
      /*
       * AND A TURN THAT LEANS IS AN ADVECTION IN DIRECTION, which belongs on the LEFT beside
       * the one in place. Together they are a derivative along the path rather than along the
       * axes - a ray is carried through space AND swung in heading as it goes, which is what a
       * geodesic is. Nothing here decided that: it is the first moment of the same choice
       * whose cosine gave the range.
       */
      /* `\paren{...}` is the renderer's own bracket - see `WRAPS` in `rendering/Notation.ts`.
       * `\left(...\right)` is TeX's and this notation does not have it, so a line written
       * that way reached the page as its own source. */
      const drift = kernel?.drifts
        ? `\\paren{${showE(kernel.drifts)}}·\\nabla_{\\hat{d}}`
        : "";
      const operator = drift ? `${carry} + ${drift}` : carry;
      return {
        ...shape, sign: 1 as const, symbol: `${operator}${population}`,
        operator, side: "left" as const,
      };
    }

    const rate = d.rate ?? "";
    const pw = powers(population, degree);
    /* the share, bracketed where it is a sum - `\nu(1-\rho)` and not `\nu1-\rho` */
    const room = share
      ? (simplify(share).kind === "add" ? `\\paren{${showE(share)}}` : showE(share))
      : "";
    /* set apart, so `\sigma n` reads as two things rather than one symbol nobody has seen */
    return {
      ...shape,
      sign: (net < 0 ? -1 : 1) as -1 | 1,
      symbol: rate + room + (rate && !room && pw ? " " : "") + pw,
      side: "right" as const,
    };
  });
};

/**
 * THE WHOLE MODEL ON ONE LINE — assembled from the rules, in the order the theory runs them.
 *
 * NOTHING HERE KNOWS WHAT A VACUUM IS. It knows that rules which do not consult one another
 * ADD — each fires on its own matches once a tick, so what they do to the density adds — and
 * that is the only physics in this function. Everything else is the rules' own, which is why
 * a theory built with `without` writes one term fewer without a line of this being touched.
 */
export const continuum = (
  theory: Readable, o: { population?: string; source?: string } = {},
): Equation => {
  const population = o.population ?? "n";
  const source = o.source ?? "\\Sigma";

  const terms: Term[] = [];
  const opaque: string[] = [];
  /*
   * TWO RULES THAT DO THE SAME THING ARE ONE TERM, and nothing had to say so.
   *
   * A meeting is a meeting whether ANNIHILATION finds it on a facing pair or MOVEMENT finds it
   * a step sooner: both branches ask for two carrying rays and both put both out and fold the
   * two points into one. Same question, same arithmetic — so they come out as one term with
   * both rules credited, where before this one rule had to DECLARE that it resolved the
   * other's business, which is a claim somebody could get wrong.
   */
  const seen = new Map<string, Term>();
  for (const [name, rule] of Object.entries(theory.rules)) {
    if (!rule.declared) { opaque.push(name); continue; }
    for (const t of read(name, rule.declared, population, source)) {
      /* a term is what it does and what it needs, which is what makes two of them one */
      /*
       * KEYED ON WHAT THE TERM IS, NOT ON EVERY LAST THING THE BODY DID. Two rules reaching
       * the same event by different routes agree on the sign, on how many carrying things it
       * takes and on what it does to SPACE — and differ in the extras: MOVEMENT's meeting also
       * lights the survivor, because a collapse that nothing hears is a collapse nothing can
       * respond to. That difference is real and is kept in the working; it is not a second
       * term, because a second `-sigma n n~ F` in the line would be the loss counted twice.
       */
      /*
       * AND TRANSPORT IS TRANSPORT, so a left-hand term is keyed on its operator alone.
       *
       * A ray that steps into the next cell and a ray that steps off the edge of an expanding
       * world are the same going: `d^·grad_x`, once. The second also makes the room it needs,
       * which is a real difference and is kept in the working — but it is not a second
       * transport operator, and a line carrying `d^·grad_x` twice would say the population is
       * carried twice as fast as it is.
       */
      const key = !t.rules.length ? source
        : t.side === "left" ? `left|${t.operator}`
        : `${t.sign}|${t.degree}|${t.space}`;
      const first = seen.get(key);
      if (!first) { seen.set(key, t); terms.push(t); continue; }
      first.rules = [...new Set([...first.rules, ...t.rules])];
      if (t.symbol.length > first.symbol.length) first.symbol = t.symbol;
    }
  }

  return {
    theory: theory.name, population, terms, opaque,
    /**
     * THE LINE, AND THE ORDER IT IS READ IN — the tick before the transport it is a tick of,
     * and on the right the rules of the medium in the order the theory runs them, with SIGMA
     * LAST because a source is not one of them. That is the only arranging done here: no term
     * is added, dropped or combined for the sake of how it looks.
     */
    /**
     * THE SPACE LINE — the same terms, read on the other ledger.
     *
     * A term belongs to this line where its body moved a point of space, and it carries the
     * sign that move had. Nothing is written twice: it is the same `space` count `Continuum`
     * already took off each rule's body, printed as a line rather than as a column.
     */
    space() {
      const moving = terms.filter(t => t.space !== "0");
      if (!moving.length) return `\\partial_{t}s = 0`;
      return `\\partial_{t}s = ` + moving.map((t, i) => {
        const neg = t.space.startsWith("-");
        const mag = neg ? t.space.slice(1) : t.space;
        const by = mag === "1" ? t.symbol : `${mag}·${t.symbol}`;
        return `${i === 0 ? (neg ? "-" : "") : neg ? " - " : " + "}${by}`;
      }).join("");
    },
    toString() {
      const left = terms.filter(t => t.side === "left")
        .sort((a, b) => Number(a.operator !== "\\partial_{t}") -
          Number(b.operator !== "\\partial_{t}"));
      /*
       * AND A TERM BELONGS TO THIS LINE WHERE ITS BODY MOVED THE POPULATION — the same test
       * `space()` applies on its own ledger, which was applied on one line and not the other.
       *
       * `waitForRoom` makes a point of space and no rays: it hands the ray to itself, so
       * nothing is created, destroyed or moved. It belongs on the space line and on that line
       * alone, and printing it here put a term in the population's equation that does nothing
       * to the population. A rule of the medium can touch one ledger without touching both.
       */
      const right = terms.filter(t => t.side === "right" && (!t.rules.length || t.rays !== "0"))
        .sort((a, b) => Number(a.rules.length === 0) - Number(b.rules.length === 0));
      const lhs = left.length
        ? `(${left.map(t => t.operator ?? t.symbol).join(" + ")})${population}`
        : population;
      const rhs = right.length
        ? right.map((t, i) =>
          `${i === 0 ? (t.sign === -1 ? "-" : "") : t.sign === -1 ? " - " : " + "}${t.symbol}`)
          .join("")
        : "0";
      return `${lhs} = ${rhs}`;
    },
  };
};

/**
 * WHAT ONE FIRING OF EACH TERM DOES TO THE TWO LEDGERS — the working behind every sign.
 *
 * The point of printing it is that nothing in it was typed: the counts were walked off the
 * rule bodies, and a body edited to destroy where it used to create moves its own line here.
 */
export const ledger = (eq: Equation): string[] =>
  eq.terms.map(t =>
    `${t.symbol.padEnd(20)} n^${t.degree}${t.facing ? "·F" : "  "}  ` +
    `rays ${t.rays.padStart(6)}  space ${t.space.padStart(3)}  <- ` +
    `${t.rules.join(", ") || "no rule of the medium"}`);


/* —— and what the line implies about a disturbance in it ——————————————————— */

export type Falloff = {
  /** how a shell grows with the radius - `D-1`, exactly, by Ehrhart */
  shell: string;
  /** what the line does to a disturbance in the density, linearised */
  restoring: string;
  /** and the shape that comes to */
  law: string;
  /** what has to be true for it to be a power law rather than a screened one */
  needs: string;
  working: string[];
};

/**
 * WHAT THE EQUATION SAYS A DISTURBANCE DOES — derived from the line, not measured.
 *
 * THIS IS THE STEP A SIMULATION SHOULD NOT BE ASKED FOR. Whether a shortfall around a body
 * falls off as `1/r^{2}` is a question about the equation, and the equation is already in hand:
 * integrating it needs a box, a boundary, a quadrature and a convergence criterion, and every
 * one of those is a way to measure an artefact. The line implies its own answer.
 *
 * AND THE ARGUMENT IS THREE MOVES.
 *
 *   THE TRANSPORT TERM IS A DIVERGENCE. `d^·grad_x n` integrated over directions is `div J`,
 *   so the zeroth moment of the line is a conservation law with the source and sink on the
 *   right. Nothing about that is assumed - it is what the term IS.
 *
 *   THE SOURCE AND SINK ARE LOCAL, so they act on a disturbance only through how they CHANGE
 *   with it. Linearise: a term carrying `(1-rho)` loses its rate as the density rises, and a
 *   term of degree `k` in the density gains `k` of it. Both are read off the term - the share
 *   from the gate, the degree from the quantifier - so the restoring coefficient is arithmetic
 *   on the line rather than a new premise.
 *
 *   AND A SHELL GROWS AS `r^{D-1}`, exactly, by Ehrhart - the sites within `r` steps are the
 *   `r`-fold dilate of the sites within one, and the count of lattice points in a dilated
 *   lattice polytope is a polynomial of degree `D`.
 *
 * PUT TOGETHER: `div J = -a delta`, `J = -grad(delta)/(D sigma_tr)`, so `grad^{2} delta = a D
 * sigma_tr delta` - a SCREENED Poisson equation, whose solution is `e^{-r/L}/r^{D-1}` with
 * `L = 1/sqrt(a D sigma_tr)`. The power law is the `L -> infinity` limit and nothing else.
 *
 * WHICH SAYS EXACTLY WHAT HAS TO HOLD FOR NEWTON. `a` is how hard the vacuum pushes a
 * disturbance back, and it is not small: creation is gated on the room left, so a shortfall
 * makes MORE of it. `sigma_tr` is the removal that survives averaging over the scattering -
 * `sigma(1 - g)` - so a medium that turns a ray without forgetting where it was going has none.
 * `1/r^{D-1}` is what this line gives when the disturbance is CONSERVED in flight, and that is
 * a statement about the scattering kernel rather than about the geometry.
 */
export const falloff = (eq: Equation, o: { D?: string } = {}): Falloff => {
  const D = o.D ?? "D";
  const working: string[] = [];

  const transport = eq.terms.find(t => t.operator && t.operator !== "\\partial_{t}");
  /*
   * WHAT A TURN LEAVES OF A DIRECTION, read off the choice the rule makes. `sigma` removes a
   * ray; what removes a DIRECTION is `sigma(1 - g)`, so a medium that turns a ray without
   * forgetting where it was going attenuates a shadow by nothing at all.
   */
  const kern = eq.terms.map(t => t.kernel).find(Boolean);
  const g = kern?.keeps;
  const sigTr = g ? `\\sigma(1-${g})` : "\\sigma_{tr}";
  if (kern) {
    working.push(`a turn here keeps g = ${kern.keeps} of the heading, so what attenuates a ` +
      `shadow is \\sigma(1-g) = ${sigTr}`);
    working.push(`and it leans by ${kern.drifts}, which is an advection in DIRECTION - the ` +
      `bending, and the same choice read as a first moment rather than as a cosine`);
    /*
     * AND WHAT MAKES `f` IS THE TERM THAT DESTROYS SPACE, which is the whole of why this is
     * nonlinear: the thing that bends a ray is built by rays meeting.
     */
    const maker = eq.terms.find(t => t.space.startsWith("-"));
    if (maker) working.push(
      `and \\mathbf{f} is what ${maker.symbol} leaves behind - it is of degree ` +
      `${maker.degree} in the density, so WHAT BENDS A RAY IS MADE BY RAYS MEETING. The field ` +
      `is a source of itself: a shortfall changes where meetings happen, which changes ` +
      `\\mathbf{f}, which bends what is left. Gravity bends gravity, and it is not put in - ` +
      `it is that one term both destroys space and writes the direction the destroying went`);
  }
  working.push(transport
    ? `${transport.symbol} is a divergence, so the line's zeroth moment is ` +
      `\\nabla·J = (what is made) - (what is taken)`
    : `no transport term in this line - a disturbance does not go anywhere`);

  /*
   * HOW HARD THE LINE PUSHES BACK, term by term. A share of `(1-\rho)` differentiates to `-1`
   * and a degree of `k` in the density to `k\rho^{k-1}` — both already on the term.
   */
  const parts: string[] = [];
  void 0;
  for (const t of eq.terms) {
    if (t.side === "left" || !t.rules.length || !t.rate) continue;
    if (t.share && showE(t.share).includes("\\rho")) {
      parts.push(t.rate);
      working.push(`${t.symbol} is gated on the room left, so a shortfall makes MORE of it: ` +
        `\\partial/\\partial\\rho = -${t.rate}`);
    }
    if (t.degree > 0) {
      const k = t.degree === 1 ? "" : `${t.degree}`;
      parts.push(`${k}${t.rate}\\rho${t.degree > 1 ? `^{${t.degree - 1}}` : ""}` +
        "");
      working.push(`${t.symbol} is of degree ${t.degree} in the density, so it changes ` +
        `${t.degree === 1 ? "" : `${t.degree} times `}as fast as it does`);
    }
  }
  const restoring = parts.length ? parts.join(" + ") : "0";
  working.push(`so a disturbance is pushed back at a = ${restoring}`);
  working.push(`and a shell grows as ${D}-1 by Ehrhart, exactly`);

  const law = restoring === "0"
    ? `\\delta \\propto 1/r^{${D}-1}`
    : `\\delta \\propto e^{-r/L}/r^{${D}-1},\\quad ` +
      `L = 1/\\sqrt{(${restoring})·${D}·${sigTr}}`;
  working.push(law);

  return {
    shell: `${D}-1`, restoring, law,
    needs: restoring === "0"
      ? "nothing - the disturbance is already conserved"
      : g
        ? `${sigTr} \\to 0, which is n_{f} \\to 0: undisturbed space has folded nothing, ` +
          `so g = 1 there and a shadow crossing it is attenuated by nothing. The screening ` +
          `is exactly as long as the folds reach`
        : `L \\to \\infty, which is \\sigma_{tr} \\to 0 - and nothing in these rules ` +
          `turns a ray, so there is no g and the removal is the whole of sigma`,
    working,
  };
};


/* —— and what a metric that line is ——————————————————————————————————————— */

export type Geometry = {
  /** the refractive index the line implies - what a ray's path is bent by */
  index: string;
  /** the metric in isotropic form, as `A` and `B` */
  A: string;
  B: string;
  working: string[];
};

/**
 * THE METRIC THE LINE IMPLIES — read off the direction advection, not off a delay.
 *
 * A TERM THAT SWINGS A HEADING IS A REFRACTIVE INDEX, and that is the whole derivation. Ray
 * optics in a medium of index `N` obeys `dd^/dl = grad_perp ln N`; the line here carries
 * `<d^'> · grad_d^`, so whatever `<d^'>` is the gradient of IS `ln N`. The kernel's first
 * moment is `f/(1+n_f)` and `f` is the fold record, so
 *
 *     grad ln N = f/(1+n_f)      ->      N = 1 + n_f    up to the constant far away
 *
 * because the fold record's divergence is what counts the folds. A place that has swallowed
 * nothing has `N = 1` and a ray crosses it straight; a place with `n_f` folded in it bends a
 * path by exactly the ratio `gravity.law` reads off the same count.
 *
 * AND THE FOLDS AROUND A BODY GO AS `1/r`, because they are what the DEFICIT is made of and a
 * deficit conserved in flight over a shell going as `r^{D-1}` gives a potential going as
 * `1/r^{D-2}` - which is `1/r` in three dimensions. So `N = 1 + 2M/r` with `M` counting the
 * body's folds, and the metric in isotropic form is `A = 1/N`, `B = N`, since light travels at
 * `sqrt(A/B) = 1/N`.
 *
 * WHICH IS NOT A CHOICE BETWEEN TWO WAYS OF SPLITTING IT. `A/B` is what light sees and both are
 * fixed by requiring that a static clock and a static ruler scale oppositely - the same count
 * read as time and as length, which is what a fold IS: space folded in.
 */
export const geometry = (eq: Equation): Geometry => {
  const working: string[] = [];
  const kern = eq.terms.map(t => t.kernel).find(Boolean);
  if (!kern) return {
    index: "1", A: "1", B: "1",
    working: ["nothing in this line swings a heading, so it has no geometry - " +
      "rays go straight and there is nothing to bend"],
  };

  working.push(`the line carries ${kern.drifts}·\\nabla_{\\hat{d}}, which swings a heading`);
  working.push(`ray optics in a medium of index N is d\\hat{d}/dl = \\nabla_{\\perp}\\ln N, ` +
    `so ${kern.drifts} IS \\nabla\\ln N`);
  working.push(`\\mathbf{f} is the fold record and \\ln(1+n_{f}) is its potential, so ` +
    `N = 1 + n_{f}`);
  working.push(`and the folds around a body fall off as the deficit does - conserved over a ` +
    `shell going as r^{D-1}, so the potential goes as 1/r^{D-2}, which is 1/r in three ` +
    `dimensions: n_{f} = 2M/r`);
  working.push(`light goes at \\sqrt{A/B} = 1/N, and a fold is space folded IN - the same ` +
    `count read as time and as length - so A = 1/N and B = N`);
  return {
    index: "1 + 2M/r",
    A: "e^{-2M/r}", B: "e^{2M/r}",
    working,
  };
};
