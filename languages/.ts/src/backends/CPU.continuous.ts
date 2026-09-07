/**
 * THE CONTINUOUS BACKEND — the line read off the rules, and the line integrated, in ONE FILE.
 *
 * THEY WERE TWO AND THEY FELL OUT OF STEP, which is the only reason this is one. `Continuum`
 * read the equation off a theory; `Field` integrated it; and each of them, quietly, worked out
 * things the other had already worked out. The pairing `facing.pair` declares was multiplied in
 * by the reader AND resolved by the integrator. The point-gate was raised to `DEG` in three
 * places by three arguments. A ray count was kept apart as `{n, of}` at one end and flattened
 * at the other. None of those is a hard bug to write; every one of them is invisible across a
 * file boundary, and each cost a wrong number that nothing could catch, because there was
 * nothing that held both readings at once.
 *
 * SO A READING AND A RUNNING OF THE SAME LINE LIVE TOGETHER. What a term is - its rate, its
 * gates, its degree, which ledgers it moves and by how much, which part of its share is the
 * quantifier's own walk - is written down once here, and the integrator below reads THAT
 * rather than a description of it. A change to how the line is read reaches the dynamics in
 * the same file, and a solver that resolves something the line averages says so where the
 * averaging is written.
 *
 * AND NOTHING IN EITHER HALF KNOWS WHAT THEORY IT IS. Both halves take rules and give back
 * what those rules come to; `G` is a value passed in.
 *
 * AND THERE IS ONE INTEGRATOR, NOT TWO. There were two for a while - one carrying moments and
 * one carrying whole rays - and two readings of one line is the same fault as two readings of
 * one rule, one file down: they can disagree, and they did. The moment one holds a point at
 * `0.229` of a ray, which is neither neutral nor busy, so `CREATION`'s gate and the meeting
 * both fire at every cell every tick at fractional rates - the MEAN of an alternation the rules
 * do not have, and the mean kills what was just made. Counted in whole rays a point is neutral
 * or it is not, the two gates can never hold together, and the aggregate settles exactly as
 * before while every point in it alternates. That is the reading with no closure in it, so it
 * is the only one here.
 */
import { add, d, div, Expr, field, grad, integrate, log, mul, num, pow, show as showE,
  simplify, sub, sym, numeric } from "../lib/Algebra.ts";
import { showCount, type Count } from "../lib/Language.ts";
import { Declared, degreeOf, facingOf } from "../lib/Rules.ts";
import { Geometry as Lattice } from "../lib/Local.ts";


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
  /**
   * AND WHICH PART OF THAT SHARE IS THE QUANTIFIER'S OWN WALK — kept apart, because a backend
   * that walks the same thing has already counted it.
   *
   * `facing.pair` carries `F`: "what counts is the part of the opposing population actually
   * coming the other way ... that is what the pairing IS". A solver holding one number per
   * point must multiply it in, because it cannot see which exits are lit. A solver holding a
   * population PER EXIT walks the pairs itself - `\sum_{axes} n_{a}n_{b}` - and multiplying
   * `F` in as well is the pairing counted twice. Same statement, two resolutions; this says
   * which part of the share is the one being resolved, so neither has to know what it is.
   */
  walked?: Expr;
  /** whether the rule's body draws - which is what makes its rate anything but one */
  draws?: boolean;
  /** what a turn does to a direction - both moments, see `Term.kernel` */
  kernel?: { keeps: Expr; drifts: Expr };
  /** rays one firing makes (+) or puts out (−), COUNTED OFF THE BODY - what decided the sign */
  rays: string;
  /** and points of space, which is the other ledger and the one gravity is read off */
  space: string;
  /** and folds, as text - the count is `foldCount` */
  folds: string;
  /*
   * WHETHER THE QUANTIFIER HANDED THE WHOLE MATCH OVER, or the body went and found the rest.
   *
   * `ANNIHILATION` is quantified over a FACING PAIR: the walk hands it both rays and its body
   * is about the event itself. `MOVEMENT` is quantified over ONE ray and goes looking for the
   * one facing it. Both describe the same meeting, and when two rules describe one event the
   * counts must come from the rule the event IS, not from whichever happened to be declared
   * first - which is how the line came to carry a relight that the meeting rule does not do.
   */
  handed: boolean;
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
  /** and folds swallowed or handed back, which is the ledger `turns` draws on */
  foldCount: Count;
  /**
   * WHETHER THE RULE REACHED BEYOND THE MATCH IT WAS HANDED — which is what makes a term the
   * source rather than the medium's, and what decides whether a DISCREPANCY can be made.
   *
   * Every act of a local rule reads the refs its own match handed over. Two worlds that agree
   * about a match get the same act, so they still agree after it: a rule like that can MOVE a
   * disagreement and cannot make one or unmake one. A rule that consulted something outside its
   * match could - which is what a source IS - so the flag is kept rather than thrown away once
   * it has picked the source out.
   */
  outside: boolean;
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
  /* gathered by what they SAY, so a condition a gate and a body both carry is counted once -
   * see `together` in `Language`, which is the same statement about the same shares */
  const shares = [...new Map(
    ([...d.gates.map(g => g.test.share), q.share].filter(Boolean) as Expr[])
      .map(e => [showE(e), e] as const),
  ).values()];
  /* and what any choice the body makes leaves of a direction - see `Term.kernel` */
  const kernel = d.body.doing.map(b => b.kernel).find(Boolean);

  return d.body.doing.map(doing => {
    /*
     * AND A SHARE FROM INSIDE THE BODY COUNTS AS MUCH AS ONE FROM A GATE — so it is taken PER
     * BRANCH, which is the whole reason it cannot live outside this loop.
     *
     * `either` gives one arm its condition's share and the other the complement, and the two
     * arms are different terms of the line. A share worked out once for the rule would hand
     * both of them the same one, which is exactly the thing that had every ray in the world
     * stepping AND growing the world in the same tick.
     */
    const own = doing.share
      ? [...new Map([...shares, doing.share].map(e => [showE(e), e] as const)).values()]
      : shares;
    const share = own.length ? simplify(mul(...own)) : undefined;
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
      rules: [name], degree, facing, rate: d.rate, share, walked: q.share, kernel,
      draws: doing.draws,
      rays: showCount(doing.rays), space: showCount(doing.space),
      folds: showCount(doing.folds),
      rayCount: doing.rays, spaceCount: doing.space, foldCount: doing.folds,
      over: String(q.about ?? q.type), handed: handed >= degree, outside,
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
   * THE RULES ARE TRIED IN THE ORDER THEY ARE WRITTEN, AND A MATCH BELONGS TO THE FIRST THAT
   * TAKES IT — which is the whole of what this loop has to know about them.
   *
   * IT USED TO MERGE. Two rules describing one event came out as one term, keyed on what the
   * term did, and where they disagreed a tie-break picked a side: the rule "handed the whole
   * match by its walk" carried the counts. That was an assumption in the one file that is
   * supposed to make none - it decided, on the theory's behalf, which of two descriptions of
   * a meeting was the real one, and the side it dropped was the one that lit the survivor.
   * Everything downstream then rested on a choice nobody wrote down.
   *
   * THERE IS NOTHING TO MERGE ONCE THE ORDER DECIDES. Two rules cannot describe one event any
   * more, because the first one to match takes it and the second never sees it - see
   * `Theory.seed`, where the tick claims a match before running the body. So a term is one
   * rule's, always, and this counts each rule once.
   *
   * AND WHAT IS LEFT FOR THE LATER ONE IS WHAT THE EARLIER ONE DID NOT TAKE. That is the only
   * thing the ordering adds to the arithmetic, and it is not a special case: a rule quantified
   * over the same thing as an earlier rule fires on the share of it the earlier rule left, so
   * its gate is its own times `1 - ` each earlier gate over that same quantifier. A rule with
   * no gate takes all of what it is asked about, and everything after it over that quantifier
   * is multiplied by nothing, which is what "another rule cannot also match it" MEANS once it
   * is counted rather than followed.
   */
  /*
   * ONE RULE, ONE EVENT, ONE TERM — and that is now a fact about the theory rather than a
   * decision taken here.
   *
   * THE ORDER IS WHAT SETTLES IT AND THE ORDER IS THE THEORY'S. Rules are tried as they are
   * written and a match belongs to the first that takes it, so two rules cannot describe one
   * event: the meeting is `ANNIHILATION`'s and a ray `MOVEMENT` steps is a ray nothing else
   * gets. Nothing in this file has to know which of two descriptions was meant, because there
   * are no longer two.
   *
   * WHICH IS WHY THE MERGE IS GONE. It keyed two terms on what they did, put them together,
   * and where they disagreed a tie-break took the counts from "the rule handed the whole match
   * by its walk" - deciding, in the one file that is supposed to decide nothing, that a
   * meeting does not light the survivor. That was an assumption, it was invisible, and every
   * falloff in the book rested on it. A rule is counted once, as written.
   *
   * THE SOURCE IS THE ONE THING THAT IS NOT A RULE'S. It is the term no rewrite of the medium
   * puts there - `\Sigma`, what a body hands the world - so however many rules mention one,
   * there is one of it in the line.
   */
  let put = false;
  for (const [name, rule] of Object.entries(theory.rules as Record<string, any>)) {
    if (!rule.declared) { opaque.push(name); continue; }
    for (const t of read(name, rule.declared, population, source)) {
      if (!t.rules.length) { if (put) continue; put = true; }
      terms.push(t);
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
  /*
   * AND THE KERNEL IS SHOWN, NOT STRINGIFIED. `keeps` and `drifts` are expressions, and an
   * expression dropped into a template comes out as `[object Object]` - which is what the
   * derived law, the screening length and the condition for a power law were all carrying.
   */
  const g = kern ? showE(kern.keeps) : undefined;
  const sigTr = g ? `\\sigma(1-${g})` : "\\sigma_{tr}";
  if (kern) {
    working.push(`a turn here keeps g = ${showE(kern.keeps)} of the heading, so what attenuates a ` +
      `shadow is \\sigma(1-g) = ${sigTr}`);
    working.push(`and it leans by ${showE(kern.drifts)}, which is an advection in DIRECTION - the ` +
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
  /*
   * HOW HARD THE LINE PUSHES BACK — by DIFFERENTIATING the line, not by guessing at it.
   *
   * A term's contribution to the population's rate is its ledger count times its rate times
   * its gates times the density to its degree, and how hard it pushes back on a disturbance
   * is minus the derivative of that. `Algebra.d` does the differentiating; every factor comes
   * off the term. THREE THINGS WERE WRONG WITH READING IT OFF BY HAND:
   *
   *   THE GATE'S DERIVATIVE IS NOT ITS RATE. A share was assumed to be `\paren{1 - \rho}`, so
   *   the derivative was taken to be the bare rate - but `Term.over` says CREATION is asked of
   *   a POINT, and a point is free when every one of its `DEG` ways out is dark, so its share
   *   is `\paren{1 - \rho}^{DEG}` and it differentiates to `-DEG\nu\paren{1 - \rho}^{DEG-1}`.
   *   At any settled density that is a small number where the bare rate is one, so the line
   *   was read as pushing back several times harder than it does.
   *
   *   A LEDGER COUNT OF NOUGHT MEANS THE TERM IS NOT IN THIS LINE AT ALL. `waitForRoom` makes
   *   a point of space and no rays, so it cannot restore a RAY disturbance whatever its rate
   *   is - it was being summed in as though it could.
   *
   *   AND THE COUNTS CARRY THEIR OWN SIGN, so a term that MAKES the population destabilises
   *   it. Every term was being added as positive, which cannot be right of a line that has
   *   both a source and a sink in it.
   */
  const pop = field("\\rho");
  const rate = (n: string | undefined) => n ? field(n) : num(1);
  let net: Expr = num(0);
  for (const t of eq.terms) {
    if (t.side === "left" || !t.rules.length) continue;
    /* the count, kept as the symbol it is - `DEG` stays `DEG` */
    let count: Expr = num(t.rayCount?.n ?? 0);
    for (const [k, m] of Object.entries(t.rayCount?.of ?? {}))
      count = add(count, mul(num(m), field(k)));
    if (showE(simplify(count)) === "0") {
      working.push(`${t.symbol} moves no rays, so it is not in this line's balance at all`);
      continue;
    }
    /* the gate, to the DEG where the rule was asked of a point - see `Term.over` */
    const gate = t.share
      ? (t.over === "Local" ? pow(simplify(t.share), field("DEG")) : simplify(t.share))
      : num(1);
    const term = simplify(mul(count, rate(t.rate), gate, pow(pop, t.degree)));
    net = simplify(add(net, term));
    working.push(`${t.symbol} contributes ${showE(term)} to the line, ` +
      `counted off its ledger (${showE(simplify(count))} rays) and its gates`);
  }
  /*
   * AND THE RESTORING RATE IS MINUS THAT, DIFFERENTIATED, PER CARRIER. The line is in rays
   * per point per tick and a disturbance is in the density, so the derivative is divided by
   * the ways out - which is the same `DEG` draws the gates were about.
   */
  const slope = simplify(mul(num(-1), div(d(net, "\\rho"), field("DEG"))));
  const parts = [showE(slope)];
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

  working.push(`the line carries ${showE(kern.drifts)}·\\nabla_{\\hat{d}}, which swings a heading`);
  working.push(`ray optics in a medium of index N is d\\hat{d}/dl = \\nabla_{\\perp}\\ln N, ` +
    `so ${showE(kern.drifts)} IS \\nabla\\ln N`);
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

/* ═══════════════════════════════════════════════════════════════════════════════
 *
 *
 * THE CONTINUUM AS A BACKEND — the theory's own equation, integrated, with nothing added.
 *
 * `Continuum.continuum(G)` reads the rewrite rules and hands back ONE kinetic equation:
 *
 *     \partial_{t}n + \hat{d}\cdot\nabla_{x}n + \paren{\nabla n_{f}}\cdot\nabla_{\hat{d}}n
 *       = \paren{1 - \beta}\Sigma + \nu\paren{1 - \rho} - \sigma\omega n\tilde{n}
 *         + \sigma\paren{1 - \omega}n
 *
 * and each of its terms carries the three ledgers the rules move - rays, points of space and
 * folds - as counts rather than as prose. THIS FILE INTEGRATES THAT AND NOTHING ELSE. Every
 * rate, gate, degree, sign and ledger count is read off the term; the constants are the ones
 * `MEASURE` published off the closed theory. There is no number in here that was chosen.
 *
 * WHY A BACKEND AND NOT A PANEL. Drawing the discrete world means drawing single rays and
 * shot noise, and every gravity panel that tried it had to average hundreds of ticks to see
 * anything. The continuum is not a different model - it is the same rules with the population
 * read as a density - so a picture drawn from it is the theory, at the scale a reader can see.
 * And because it is a backend rather than a drawing, every visual can be put on it.
 *
 * AND NOTHING HERE KNOWS WHAT THE RULES ARE. There is no `\nu` in this file, no `\sigma`, no
 * `DEG`, no test for which rule a term came from. A term carries a RATE NAME, a GATE as an
 * expression, a DEGREE, whether it is FACING, what it was quantified OVER, and its three
 * ledger counts; this reads those and evaluates them against the symbol table the theory
 * published. Change a rule and `Continuum` hands back a different equation - a term more, a
 * gate different, a count changed - and this integrates that instead, without being edited.
 * The only things written down are what the grammar MEANS: a degree is a power of the
 * population, a facing term is quantified over an edge, a point-gate is a ray-share to the
 * `DEG`, and a left-hand operator streams.
 *
 * AND IT IS WHY THERE ARE NO BEAMS. The transport term is not free streaming: the same
 * meeting that destroys a pair leaves a fold, and `turns` draws against it - straight on with
 * weight one against `n_{f}` folded ways, which is the term's own
 *
 *     kernel.keeps = 1/\paren{1 + n_{f}}
 *
 * At the settled vacuum `n_{f}` is about six on this plane, so a ray keeps its heading about
 * one time in seven and is turned the other six. A shadow cast along an exit is scattered off
 * that exit within a cell or so, and what spreads is a sphere. Ballistic transport - keeping
 * the heading - is what makes eight beams, and it is not what the rules say.
 */


/**
 * THE THEORY'S OWN CONSTANTS, KEYED BY THE NAMES IT USES — whatever it happens to name.
 *
 * Not a typed record of `nu` and `sigma`: a rule added tomorrow brings a rate with it, and a
 * record with fields for today's rates would silently drop it. `MEASURE` publishes whatever
 * the closed theory could put a number to, and every expression below is evaluated against
 * that map by NAME.
 */
export type Symbols = Record<string, number>;

/**
 * A SOURCE, AND WHAT IT DOES — `Source.ts`'s own three moving parts, kept here because they
 * are DERIVED and a panel that re-derives them gets them wrong.
 *
 * Every one of these was got wrong at least once by being written in a drawing instead: a body
 * pushed by its own rays, then by its own wake, then by the medium it had displaced, then flung
 * apart at twenty-five cells a tick by the impulse of its own step. None of that is about
 * pictures. It is `propel` and `turns`, it is written down in the rules, and it belongs
 * wherever the rules are integrated so that there is one place to be right.
 */
export type Moving = {
  /** where it is, and what is left over of a cell - `Source`'s own remainder */
  x: number; y: number; ax: number; ay: number;
  /** the way it is going, which is what `turns` bends */
  hx: number; hy: number;
  /** what arrives at it, which `propel` would make a force of - measured, not integrated */
  px: number; py: number;
  /** how often one of its cells lights one exit: `\bar{m}_{x}`, PER NEIGHBOUR, at most one */
  mx: number;
  /** how far across it is, in cells */
  radius: number;
  /** how fast it is carried, in cells a tick */
  speed: number;
  /** and which of its recent ticks went on moving rather than shining, which is `\beta` */
  moved: number[];
};

export type Continuous = {
  N: number;
  /** `n[c·DEG + k]` — the population, per point, per exit. `\hat{d}` is discretised by the
   *  geometry because the collision is `facing`, and a facing pair is two rays on one EDGE */
  n: Float64Array; work: Float64Array;
  /** the ledgers the terms move, one array each, named as the terms name them */
  ledger: Record<string, Float64Array>;
  /** what a source puts in, per point — the term no rewrite of the medium produces */
  put: Float64Array;
  /** the sources in it, which the step below moves by the rules and not by a path */
  bodies: Moving[];
  blocks: Uint8Array;
  t: number;
};

/*
 * READ AS A NUMBER, NOT REBUILT AS AN EXPRESSION — which is the difference between a panel
 * that records in twenty minutes and one that records in one.
 *
 * `simplify(evaluate(e, at))` makes a fresh tree and folds it, and this is asked of every term
 * of every cell of every tick: at a hundred and eighty cells square that is a million trees a
 * tick. `Algebra.numeric` walks the same expression and returns the number, allocating
 * nothing. It is the same answer by the same rules - the folding was never what made it right.
 */
const val = (e: Expr | undefined, at: Symbols, fallback: number): number => {
  if (!e) return fallback;
  const v = numeric(e, at);
  return Number.isFinite(v) ? v : fallback;
};

/** a count like `{n: 0, of: {DEG: 1}}`, against whatever the theory called those names */
const count = (c: { n: number; of?: Record<string, number> } | undefined, at: Symbols): number => {
  if (!c) return 0;
  let v = c.n ?? 0;
  for (const [k, m] of Object.entries(c.of ?? {})) v += m * (at[k] ?? 0);
  return v;
};

/**
 * AND THE SAME COUNT, WITH THE TWO HALVES IT IS MADE OF KEPT APART — because they happen to
 * different things and adding them up throws that away.
 *
 * A count comes off a rule's body as `{n, of}` and the shape says where each part came from.
 * `n` is what the rule did to the MATCH it was handed: `ANNIHILATION` is quantified over a
 * facing pair and douses both, so it carries `n = -2`, two rays off the two ends of one edge.
 * `of.DEG` is what it did per WAY OUT of a point: `each(exits(point), light)` is one ray on
 * each of `DEG` exits, and it is written as a multiple of `DEG` for exactly that reason.
 *
 * FLATTENED THEY ARE ONE NUMBER AND IT IS THE WRONG ONE. A meeting that douses two and lights
 * the survivor's exits is `-2 + DEG`, which on eight exits is `+6` - and a `+6` handed to a
 * loop that takes rays off facing pairs takes SIX off instead of putting six on. Measured, that
 * turned the one rule that spreads a disturbance into the one that swallows it fastest: the
 * field came out shorter-ranged with the lighting in than with it out, which is backwards.
 *
 * NOTHING HERE DECIDES WHICH IS WHICH. The rule wrote `{n: -2, of: {DEG: 1}}` and this reads
 * the two entries it wrote.
 */
const split = (c: { n: number; of?: Record<string, number> } | undefined, at: Symbols) => {
  if (!c) return { pair: 0, each: 0 };
  let each = 0;
  for (const [k, m] of Object.entries(c.of ?? {})) each += m * (at[k] ?? 0);
  return { pair: c.n ?? 0, each };
};

export const continuous = (o: {
  /**
   * ANYTHING THE RULES DO NOT FIX BY COUNTING — and for `G` there is nothing, so it is omitted.
   *
   * A name left over from a theory this cannot count for itself can be handed in here, and it
   * is only ever a FALLBACK: whatever this derives wins. Handing in `\rho` or `F` does
   * nothing, because those are read off the cell and off the walk.
   */
  symbols?: Symbols; N: number; geometry: Lattice; theory: any;
  /*
   * WHETHER THE BOX JOINS ITS OWN FACES — false, and it has to be, because a torus is a
   * different world and not a big one: a ray leaving one side arrives on the other, so a body
   * is lit from behind by its own radiation come round the world. The one place it is right
   * is a box standing for a UNIFORM medium, where wrapping is what "everywhere alike" means.
   */
  wraps?: boolean;
  /*
   * HOW MANY POPULATIONS ARE CARRIED APART FROM THE VACUUM'S — one per source, and it is
   * bookkeeping rather than a change to the dynamics.
   *
   * `G` gives a `Local` a `source`, so whose ray a ray is is a thing the model distinguishes.
   * Every rule treats them alike: transport moves a ray without asking, and a meeting destroys
   * whatever is facing whatever, so a tagged population is transported by the same operator
   * and loses the same SHARE of itself the total loses. Nothing is added; the sum of the tags
   * and the vacuum is exactly the population the line is about.
   *
   * AND IT IS WHAT LETS THE TWO-BODY TERM BE SEEN. A single body cannot have gravity - its
   * rays need something to annihilate against - so the force law is `\bar{m}\bar{m}'` and the
   * long-range channel is MEETINGS between two bodies' radiation. That is a cross term, and a
   * cross term cannot be drawn from a total: it needs the two halves kept apart.
   */
  tags?: number;
  /**
   * AND WHETHER IT KEEPS THE SAME WORLD WITHOUT THE SOURCES IN IT — which is what a DEFICIT is.
   *
   * `probes/medium.ts` says what the quantity every falloff is about actually is: "two runs on
   * ONE seed, one perturbed and one not, differ by exactly the disturbance, and the ambient
   * subtracts off". Not the fold record - the fold record counts what the vacuum does anyway,
   * everywhere, and it is enormous next to what a body adds. Not the ray density either, which
   * is pushed back at a rate the line derives. THE DIFFERENCE, which `conserved` shows a local
   * rule can only move.
   *
   * SO THE MEDIUM CARRIES ITS OWN UNDISTURBED TWIN, branched at the tick the first source
   * appears and stepped beside it ever after. Nothing is closed, averaged or linearised: it is
   * the same integrator on the same seed with the sources left out, and what a body is bent by
   * is the difference between the two - `\delta n_{f}`, which is what `gravity.metric` is
   * written in and what every theorem below `spreading` means by `\delta`.
   *
   * `false` leaves it out, which is what the twin itself is run with.
   */
  twin?: boolean;
  /** the draw `turns` asks for, if it is being run exactly - the same seed gives the same world */
  seed?: number;
  /**
   * AND WHETHER A WAY OUT CAN HOLD MORE THAN ONE RAY.
   *
   * `light` is idempotent - setting a lit ray lit is one ray and not two - so read one way an
   * exit holds nought or one and the state is a bit per exit. Read the other way rays stack and
   * an exit holds a count. The rules do not settle it, because nothing in them ever offers a
   * second ray to a lit exit: whether two can land on one is a question about the store rather
   * than about the rewrite. So both readings are here and what each gives is measured -
   *
   * AND ONE OF THEM SETTLES. `unfold` states the balance: "a meeting takes two rays and makes
   * one fold; a splitting makes DEG rays and hands back one fold... One per way out puts DEG
   * back against DEG/2 taken, AND IT SETTLES." Measured over sixteen hundred ticks, stacked the
   * record climbs - 25, 28, 43, 66, 70 and going - while the density holds at `0.263`. One ray
   * to a way and it bounces between nought and nine and stays there, with the density at
   * `0.199`. The rule says the record settles; it settles in one reading and not the other, so
   * that is the reading, and this is `false`.
   */
  stack?: boolean;
}) => {
  /* and what one way out can hold - see `stack` */
  const CAP = (o.stack ?? false) ? Infinity : 1;
  /*
   * THE DRAW, SEEDED — `turns` is a CHOICE among `1 + n_{f}` ways and a state that holds whole
   * rays has to make it rather than take its mean. Deterministic from the seed, so the same
   * world is the same world.
   */
  /*
   * AND THE DRAW BELONGS TO THE PLACE AND THE TICK, not to how many draws came before it.
   *
   * A SEQUENCE MAKES THE WHOLE WORLD DEPEND ON ITERATION ORDER: put one more ray anywhere and
   * every draw after it in that tick is a different number, so two worlds "on one seed" that
   * differ by a single body decorrelate completely within a few ticks. Measured, the mean
   * difference between them came out flat at `0.16` from the body out to the wall - two
   * independent microstates, with the body's own field nowhere in it.
   *
   * KEYED ON WHERE AND WHEN, the same place makes the same draw in both worlds wherever they
   * agree, so they differ only where the body has actually changed something - which is what
   * `probes/medium.ts` means by "two runs on ONE seed... differ by exactly the disturbance".
   * It is also the more faithful reading on its own account: `turns` is a choice made at a
   * point, and nothing in the rule makes it depend on what some other point did first.
   */
  const seed = (o.seed ?? 1) >>> 0;
  const rnd = (c: number, k: number, i: number) => {
    let x = (seed ^ Math.imul(f.t + 1, 0x9e3779b1) ^ Math.imul(c, 0x85ebca6b)
      ^ Math.imul(k + 1, 0xc2b2ae35) ^ Math.imul(i + 1, 0x27d4eb2d)) >>> 0;
    x = Math.imul(x ^ (x >>> 16), 0x21f0aaad) >>> 0;
    x = Math.imul(x ^ (x >>> 15), 0x735a2d97) >>> 0;
    return ((x ^ (x >>> 15)) >>> 0) / 4294967296;
  };
  const N = o.N, g = o.geometry, DEG = g.DEG;
  const eq = continuum(o.theory);
  /*
   * AND THE CONSTANTS ARE THIS BACKEND'S OWN, COUNTED HERE — not handed in from a measurement.
   *
   * IT USED TO TAKE THEM FROM `law`, which is what `Prove` settled by algebra: `\rho`, `F`,
   * `\omega`, `\lambda`. Two things then had an opinion about the same number and they could
   * differ - and they did, by the whole of the pairing, because one of them multiplied `F` in
   * twice. A solver that is handed the answer cannot check it, and one that is handed a WRONG
   * answer runs on it silently.
   *
   * SO NOTHING IS ASSERTED THAT THIS CAN COUNT. A rate is ONE per match per tick, which is what
   * a rewrite of this model IS - the name on it says which rewrite, not how often - so every
   * rate the line carries is one, whatever it is called and however many there turn out to be.
   * `DEG` is the geometry's. `\rho` and `n_{f}` are read off the cell being asked. `\omega` is
   * the share of steps that found room, which this measures while it takes them. `\beta` is a
   * body's own, bound where the body is. `F` is the quantifier's pairing and this walks the
   * pairs, so it divides out rather than being looked up.
   *
   * WHAT IS LEFT IS WHAT THE RULES FIX BY COUNTING, and `\rho_{\infty}` is not among them: it
   * is where this ARRIVES when it is run, which is the only reading of it that cannot disagree
   * with anything.
   */
  const sym: Symbols = { DEG };
  /* what the last step found: the share of rays that had somewhere to go - see `\omega` */
  let roomed = 0, offered = 0;
  for (const t of eq.terms) if (t.rate) sym[t.rate] = 1;
  for (const [k, v] of Object.entries(o.symbols ?? {})) if (!(k in sym)) sym[k] = v;
  const cells = N * N;
  /*
   * AND THE BOX HAS AN EDGE, because a torus is a different world and not a big one.
   *
   * Wrapped, a ray that leaves one side arrives on the other - so a body is lit from behind
   * by its own radiation come round the world, and two bodies are pulled by their own images
   * as well as by each other. With bodies free to move it is worse: one walks off the edge
   * and reappears beside the other. `G` seeds a BOX and grows it; nothing in these rules
   * joins its faces. So a step that leaves is a ray that left, and it is gone.
   */
  const at = o.wraps
    ? (x: number, y: number) => (((y % N) + N) % N) * N + (((x % N) + N) % N)
    : (x: number, y: number) =>
        x < 0 || y < 0 || x >= N || y >= N ? -1 : y * N + x;


  /*
   * THE EQUATION, SPLIT THE WAY IT SPLITS ITSELF. `side` says which terms are the operator
   * and which are the sources and sinks; nothing here decides that.
   */
  const moving = eq.terms.filter(t => t.side === "left" && t.operator && !/partial_\{t\}/.test(t.operator));
  /*
   * AND THE TRANSPORT SITS WHERE ITS RULE SITS, with the medium's other rules on either side.
   *
   * `G` declares EMISSION, CREATION, MOVEMENT, ARRIVAL, ANNIHILATION - so a ray a neutral point
   * has just lit MOVES before any meeting is asked about, and what it meets is what is at the
   * cell it arrived AT. Reacting everything first and stepping afterwards puts the meeting
   * before the step: measured, a point lit all its exits and the same tick's meeting took them
   * straight back off, so nothing ever left and the medium sat at nought.
   *
   * THE SPLIT IS THE LINE'S OWN ORDER. `Continuum` emits terms as the rules are written, so
   * where the transport operator falls among them is where the theory put it, and the two
   * halves are simply what comes before it and what comes after.
   */
  const carriedAt = eq.terms.findIndex(t => t.side === "left" && t.kernel);
  const acting = eq.terms.filter(t => t.side === "right");
  const beforeStep = (t: Term) => carriedAt < 0 || eq.terms.indexOf(t) < carriedAt;

  /* one array per ledger the terms actually move, discovered from the terms */
  const ledgers = new Set<string>();
  for (const t of eq.terms) {
    if (count(t.rayCount as any, sym)) ledgers.add("rays");
    if (count(t.spaceCount as any, sym)) ledgers.add("space");
    if (count(t.foldCount as any, sym)) ledgers.add("folds");
  }
  const ledger: Record<string, Float64Array> = {};
  for (const l of ledgers) ledger[l] = new Float64Array(cells);

  const T = o.tags ?? 0;
  /* one scratch row for the tag totals, so a tick allocates nothing */
  const tagSum = new Float64Array(Math.max(1, o.tags ?? 0));
  const tag: Float64Array[] = Array.from({ length: T }, () => new Float64Array(cells * DEG));
  const tagWork: Float64Array[] = Array.from({ length: T }, () => new Float64Array(cells * DEG));
  /** where space was destroyed this tick, and by which pair of tags - the meetings */
  const destroyed = new Float64Array(cells);
  const between = new Float64Array(cells);
  /*
   * AND WHAT A RAY HANDS OVER WHEN IT STOPS, which is what pushes a body.
   *
   * `propel` gives a body the momentum of what arrives at it, and a ray arriving carries the
   * heading it was going: so a cell that absorbs one is handed that heading, and the sum over
   * a body's cells is the force on it. Nothing here decides what a force is - the ray was
   * going somewhere and now it is not, and this is where the difference went.
   */
  const hit = new Float64Array(cells * 2);
  /*
   * AND HOW MUCH ARRIVED, not just which way it was going - because a body HANDS IT BACK.
   *
   * `propel` counts every arrival into a budget and spends that budget emitting: "every ray
   * it sends costs it the recoil", and a conserving source sends no more than came in. So a
   * body is not a sink - what it takes it puts back, isotropically - and a body hit alike
   * from every side accumulates nothing, which is the guarantee that leaves only the
   * LOPSIDEDNESS, the shadow another body casts.
   */
  const took = new Float64Array(cells);

  const f: Continuous = {
    N, n: new Float64Array(cells * DEG), work: new Float64Array(cells * DEG),
    ledger, put: new Float64Array(cells), blocks: new Uint8Array(cells),
    bodies: [], t: 0,
  };

  /** the population at a point, in the units the equation's `n` is in — a share of exits */
  const rho = (c: number) => {
    let s = 0; for (let k = 0; k < DEG; k++) s += f.n[c * DEG + k];
    return s / DEG;
  };
  /*
   * AND EVERY EXPRESSION IS READ IN THE LOCAL STATE, because a gate is about THIS point. The
   * ledgers are offered under their own names, so a kernel written in `n_{f}` finds the fold
   * record here rather than the ambient one — which is the whole of why a shortfall deepens.
   */
  /*
   * AND THE ENVIRONMENT IS ONE OBJECT, WRITTEN INTO — not a fresh spread per cell.
   *
   * A gate is about THIS point, so `\rho` and `n_{f}` are read where the term is being
   * asked; everything else is the theory's and does not move. Spreading the whole table for
   * every cell of every tick allocated a million short-lived objects a tick and was most of
   * what a recording cost. The two that change are assigned in place.
   */
  const local: Symbols = { ...sym };
  const here = (c: number): Symbols => {
    local["\\rho"] = rho(c);
    if (ledger.folds) local["n_{f}"] = ledger.folds[c];
    return local;
  };

  /*
   * AND EVERYTHING ABOUT A TERM THAT DOES NOT DEPEND ON WHERE IT IS ASKED IS WORKED OUT ONCE.
   *
   * A term's rate and its three ledger counts are the same at every cell - they are read off
   * the rule, not off the medium - and only its GATE moves, because a gate is about this
   * point's occupancy. They were being rebuilt per cell per term per tick, and `count` walks
   * `Object.entries` to do it, so a hundred and eighty cells square came to a million small
   * arrays a tick. What is left in the loop is the one thing that actually varies.
   */
  const fixed = acting.map(t => ({
    t,
    rate: t.rate ? (sym[t.rate] ?? 1) : 1,
    dRays: count(t.rayCount as any, sym),
    rays: split(t.rayCount as any, sym),
    dSpace: count(t.spaceCount as any, sym),
    dFolds: count(t.foldCount as any, sym),
    point: t.over === "Local",
  }));
  const source = acting.find(t => !t.rules.length);


  /*
   * ═══ THE SAME LINE, RUN ON WHOLE RAYS ═══════════════════════════════════════════════════
   *
   * Every term is the one `Continuum` read off the theory and every count is the one the rule
   * wrote. What differs from the pass above is only that a point's state is a state: a gate
   * whose share comes to ONE holds here and one that comes to less does not hold at all, and a
   * facing pair is a pair of rays that are both there rather than a product of two averages.
   */
  /**
   * THE FOLD RECORD, PER WAY OUT — which is how `fold` writes it and how `unfold` reads it.
   *
   * "An annihilation joins what was behind each onto what was behind the other, so the place it
   * happened is left with more space folded into it. More space IN A DIRECTION - the one the
   * two points were separated along. Counted per exit, that record is the ways through the
   * place a later ray may take."
   *
   * AND `unfold` DECREMENTS EACH WAY THAT HAS ONE: "for d in rays: if rec[d] > 0: rec[d] - 1".
   * Held as one number per point there is no way to ask that, and what stood here instead was a
   * CLAMP - take `DEG` off unless there is less than that, which removes folds from ways that
   * never had any. The rule says which ways; this keeps them, and `ledger.folds` stays the total
   * because that is what `turns` weighs one straight way against.
   */
  const foldsK = ledger.folds ? new Float64Array(cells * DEG) : undefined;

  const reactExactly = (early: boolean) => {
    for (let c = 0; c < cells; c++) {
      for (const fx of fixed) {
        const t = fx.t;
        if (beforeStep(t) !== early) continue;
        if (t === source) {
          /*
           * AND THE SOURCE RULE IS RUN, not worked out again here.
           *
           * `EMISSION` is declared - "a source absorbs what arrived and writes its own charge
           * onto the space around it" - and its body says the whole of it: what arrived is
           * counted PER EXIT before it is destroyed, the momentum takes `+V` for each, the
           * exits it fires on are `firing`/`half`/`aims`, and each ray it sends costs it `-V`
           * on THAT exit. "Absorbed and emitted momentum cancel exactly."
           *
           * WHAT STOOD HERE PUT RAYS OUT ALIKE DOWN EVERY EXIT and caught arrivals into a
           * vector. Isotropic out, directional in - so they never cancelled, and what was left
           * was a residual force with nothing to do with gravity. Measured, a pair with
           * `\bar{m}_{x} = 0` - two bodies with no mass at all - pushed each other apart on it.
           */
          if (f.blocks[c] && emission)
            emission.declared.body.run({ at: [localAt(c)], in: [] } as any);
          continue;
        }
        /*
         * AND THE MEDIUM'S RULES RUN ON A BODY'S CELL, because its GATES already say whether
         * they can.
         *
         * SKIPPING THE CELL WAS A THIRD RULE NOBODY WROTE. `CREATION` is gated on the point
         * being NEUTRAL and a body's cell is carrying, so it cannot fire there anyway;
         * `ANNIHILATION` is gated on a facing pair being lit, which a body's cell can perfectly
         * well be, and skipping it meant no fold was ever made there. A body was a HOLE in the
         * fold record - and `turns` leans a path toward where more is folded, so two of them
         * leaned away from each other. Measured, a pair released from rest separated, at
         * `\bar{m}_{x} = 0` as well, which is a body with no mass repelling another with none.
         * The gates decide; nothing else needs to.
         */
        const e = here(c);
        const share = val(t.share, e, 1);
        const onPair = fx.rays.pair, perExit = fx.rays.each;
        if (t.facing) {
          /*
           * A MEETING IS A FACING PAIR THAT IS THERE. With rays stacking, an edge with `n_{a}`
           * on one end and `n_{b}` on the other has `\min` of them facing pairs, and every one
           * of them fires - which is what "every match, once a tick" means when the matches can
           * be counted instead of estimated.
           */
          const walked = val(t.walked, e, 1);
          if (!(share > 0) || !(walked > 0)) continue;
          for (const k of g.AXES) {
            const a = c * DEG + k, b = c * DEG + g.OPP[k];
            const pairs = Math.min(f.n[a], f.n[b]);
            if (pairs <= 0) continue;
            const fires = pairs * (share / walked);
            if (onPair) {
              const off = fires * Math.abs(onPair) / 2;
              f.n[a] = Math.max(0, f.n[a] - off);
              f.n[b] = Math.max(0, f.n[b] - off);
            }
            if (perExit) for (let q = 0; q < DEG; q++)
              f.n[c * DEG + q] = Math.min(CAP, f.n[c * DEG + q] + fires * perExit / DEG);
            if (ledger.space) ledger.space[c] += fires * fx.dSpace;
            /* the way the two points were separated along, which is this axis */
            if (foldsK && fx.dFolds) {
              foldsK[c * DEG + k] = Math.max(0, foldsK[c * DEG + k] + fires * fx.dFolds);
              ledger.folds![c] = Math.max(0, ledger.folds![c] + fires * fx.dFolds);
            }
            destroyed[c] += Math.abs(fires * fx.dSpace);
          }
          continue;
        }
        /*
         * AND A GATE ASKED OF A POINT HOLDS OR IT DOES NOT. Its share is what a share of POINTS
         * comes to over an ensemble; on one point the answer is nought or one, and the
         * expression is one exactly on the states the condition describes - `\paren{1 -
         * \rho}^{DEG}` is one when nothing is lit and less as soon as anything is. Nothing is
         * decided here: the same expression is read on a state instead of on an average.
         */
        const holds = fx.point ? (share >= 1 - 1e-12 ? 1 : 0) : share;
        const fires = holds * (t.degree ? Math.pow(rho(c), t.degree) : 1);
        if (fires <= 0) continue;
        if (fx.dRays) for (let k = 0; k < DEG; k++)
          f.n[c * DEG + k] = Math.min(CAP, Math.max(0, f.n[c * DEG + k] + fires * fx.dRays / DEG));
        if (ledger.space) ledger.space[c] += fires * fx.dSpace;
        /*
         * AND A RETURN GOES BACK DOWN THE WAYS THAT HAVE ONE, one apiece — `unfold`'s body,
         * not its declared count. The count says `-DEG` because a count has to be a constant;
         * what the rule DOES is walk the ways out and take one off each that is holding a fold.
         */
        if (foldsK && fx.dFolds < 0) {
          for (let k = 0; k < DEG && k < -fx.dFolds; k++) {
            const i = c * DEG + k;
            if (foldsK[i] <= 0) continue;
            const off = Math.min(foldsK[i], fires);
            foldsK[i] -= off; ledger.folds![c] = Math.max(0, ledger.folds![c] - off);
          }
        } else if (ledger.folds && fx.dFolds > 0) {
          ledger.folds[c] += fires * fx.dFolds;
        }
      }
    }
  };

  /** and the step, drawn: `turns` picks a way out and `MOVEMENT` carries the ray one cell */
  const carryExactly = () => {
    f.work.fill(0);
    for (let i = 0; i < T; i++) tagWork[i].fill(0);
    const turn = moving.find(t => t.kernel);
    const fold = (i: number) => i < 0 ? 0 : (ledger.folds?.[i] ?? 0);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const c = at(x, y);
      const e = here(c);
      const keeps = turn ? val(turn.kernel!.keeps, e, 1) : 1;
      const dv = turn ? val(turn.kernel!.drifts, e, 0) : 0;
      const gx = dv && ledger.folds ? (fold(at(x + 1, y)) - fold(at(x - 1, y))) / 2 : 0;
      const gy = dv && ledger.folds ? (fold(at(x, y + 1)) - fold(at(x, y - 1))) / 2 : 0;
      const gn = Math.hypot(gx, gy);
      for (let k = 0; k < DEG; k++) {
        let m = f.n[c * DEG + k];
        if (m <= 0) continue;
        /* what share of these rays is whose - every tag, not the first one */
        const shares = T ? Array.from({ length: T },
          (_, i) => Math.min(1, tag[i][c * DEG + k] / m)) : [];
        for (let i = 0; m > 0; m--, i++) {
          /*
           * ONE WAY STRAIGHT ON AGAINST THE FOLDED ONES — `keeps` of the draw carries the
           * heading and the rest takes a folded way, leaning by what the record says. The mean
           * of this draw is the kernel the line carries; a whole ray takes ONE of them.
           */
          let out = k;
          if (rnd(c, k, i * 3 + 1) >= keeps) {
            let pick = rnd(c, k, i * 3 + 2) * DEG, q = 0;
            for (; q < DEG - 1; q++) {
              const u = g.U[q];
              const w = gn > 0 ? 1 + (u[0] * gx + u[1] * gy) / (gn + 1) : 1;
              if (pick < w) break;
              pick -= w;
            }
            out = q;
          }
          const v = g.V[out];
          const to = at(x + v[0], y + v[1]);
          offered++;
          if (to < 0) continue;
          roomed++;
          /*
           * AND A RAY LANDS ON A BODY'S CELL LIKE ANY OTHER. Catching it here and summing it
           * into a vector was absorption written a second time; `EMISSION` counts what arrived
           * per exit and destroys it, which it can only do if it is there to be found.
           */
          f.work[to * DEG + out] = Math.min(CAP, f.work[to * DEG + out] + 1);
          for (let q = 0; q < T; q++)
            if (shares[q] > 0 && rnd(c, k, i * 3 + 3 + q) < shares[q])
              tagWork[q][to * DEG + out] += 1;
        }
      }
    }
    const swap = f.n; f.n = f.work; f.work = swap;
    for (let i = 0; i < T; i++) { tag[i].set(tagWork[i]); tagWork[i].fill(0); }
    f.t++;
  };

  const step = () => {
    if (twin) twin.step();
    destroyed.fill(0); between.fill(0); hit.fill(0); took.fill(0);
    /* everything the theory declares before MOVEMENT, then MOVEMENT, then everything after */
    roomed = 0; offered = 0;
    reactExactly(true); carryExactly(); reactExactly(false);
    if (offered > 0) sym["\\omega"] = roomed / offered;
  };


  /** how much of a tagged population is standing at a point, in the units `\rho` is in */
  const from = (i: number, c: number) => {
    let s = 0; for (let k = 0; k < DEG; k++) s += tag[i][c * DEG + k];
    return s / DEG;
  };
  /* the cells a body covers, clipped to the box - a body at the edge is partly out of it */
  const covers = (b: Moving) => {
    const out: number[] = [];
    const R = b.radius;
    for (let y = -R; y <= R; y++) for (let x = -R; x <= R; x++) {
      if (x * x + y * y > R * R) continue;
      const c = at(Math.round(b.x) + x, Math.round(b.y) + y);
      if (c >= 0) out.push(c);
    }
    return out;
  };

  /** the share of its recent ticks a body spent moving rather than shining */
  const beta = (b: Moving) =>
    b.moved.length ? b.moved.reduce((s, v) => s + v, 0) / b.moved.length : 0;

  /**
   * LAY THE SOURCES INTO THE FIELD — and a body HANDS BACK what arrived at it.
   *
   * `propel` counts every arrival into a budget and spends that budget emitting: "every ray it
   * sends costs it the recoil", and a conserving source sends no more than came in. So a body
   * is not a sink. Left as one it ploughs a furrow - the density four cells behind a moving
   * body came out at 0.377 against 0.419 ahead - and the medium drags on it at about two cells
   * a tick, which is a million times the pull between two bodies.
   *
   * AND WHAT IT SENDS ON TOP IS ITS OWN, gated by how much of its ticks went on moving rather
   * than shining: `EMISSION` is gated on `not(moving)`, so that share is `1 - \beta`. What one
   * of its cells sends altogether is `\bar{m}_{x}` times its `DEG` ways out, because
   * `\bar{m}_{x}` is PER NEIGHBOUR.
   */
  const lay = () => {
    const back = new Float64Array(took.length);
    back.set(took);
    f.blocks.fill(0); f.put.fill(0);
    f.bodies.forEach((b, i) => {
      for (const c of covers(b)) {
        f.blocks[c] = i + 1;
        f.put[c] = (1 - beta(b)) * b.mx * DEG + back[c];
      }
    });
  };

  /*
   * A STEP DISPLACES THE MEDIUM RATHER THAN OVERWRITING IT. Re-drawing a footprint one cell
   * over is not motion: a cell the body did not cover suddenly holds a body and one it did
   * suddenly holds vacuum, and neither transition conserves anything. What stood where it is
   * going is put where it has been - the medium goes round it - and nothing is made or lost.
   */
  /** one cell along an exit, taking the medium round it - what `propel`'s step comes to */
  const moveBy = (b: Moving, vx: number, vy: number) => {
    const was = covers(b);
    b.x += vx; b.y += vy;
    const now = covers(b);
    const gone = was.filter(c => !now.includes(c));
    const fresh = now.filter(c => !was.includes(c));
    for (let i = 0; i < Math.min(gone.length, fresh.length); i++)
      for (let k = 0; k < DEG; k++) {
        const a = gone[i] * DEG + k, g2 = fresh[i] * DEG + k;
        const keep = f.n[a]; f.n[a] = f.n[g2]; f.n[g2] = keep;
      }
  };

  const shift = (b: Moving, which: "ax" | "ay", along: "x" | "y") => {
    let stepped = 0;
    while (Math.abs(b[which]) >= 1) {
      const d = Math.sign(b[which]);
      const was = covers(b);
      b[along] += d; b[which] -= d;
      const now = covers(b);
      const gone = was.filter(c => !now.includes(c));
      const fresh = now.filter(c => !was.includes(c));
      for (let i = 0; i < Math.min(gone.length, fresh.length); i++)
        for (let k = 0; k < DEG; k++) {
          const a = gone[i] * DEG + k, g2 = fresh[i] * DEG + k;
          const keep = f.n[a]; f.n[a] = f.n[g2]; f.n[g2] = keep;
        }
      stepped = 1;
    }
    return stepped;
  };

  /**
   * AND WHICH WAY A BODY GOES IS `turns`, WHICH IS THE ONE RULE ABOUT HOW ANYTHING CURVES.
   *
   * `MOVEMENT` does not carry a thing straight on: it asks the place it is standing what ways
   * through it there are, and a place that has swallowed folds has more than its own exits -
   * "carry straight on with weight ONE and take a folded way with the weight that way was
   * folded". The continuum hands that same choice over in two moments,
   * `keeps = 1/\paren{1 + n_{f}}` of the heading and a lean of `\nabla n_{f}`, so the mean of
   * the draw is the heading plus the record as a vector. A BODY IS BENT BY WHAT IS FOLDED
   * WHERE IT STANDS AND BY NOTHING ELSE - it never asks where another body is, how heavy it
   * is, or how far away. That is a geodesic, arrived at rather than imposed.
   *
   * AND IT IS NOT `propel`'s FORCE, WHICH DOES NOT WORK HERE AND IT IS WORTH SAYING WHY. The
   * momentum ARRIVING at a body is the right quantity and it is measured below - for a body
   * standing still it comes to `10^{-8}`, machine nought, which is the check that the catch and
   * the recoil balance. But a body that STEPS takes an impulse from the step itself of order
   * ten, against a pull of order `10^{-3}`, and no mass closes that: the impulse does not fall
   * with mass the way a product of two masses does. The lean is not a small difference of large
   * arrivals - it is the record itself, `0.37` per tick nine cells from a body.
   */
  const bend = (b: Moving) => {
    /*
     * AND WHAT IT IS BENT BY IS THE DIFFERENCE, not the total.
     *
     * The fold record counts what the vacuum does anyway - everywhere, every tick, and far more
     * of it than a body adds. Reading its gradient asks a body to steer by the medium's own
     * churn: measured, that came to order ONE thirty cells from anything, which is not a lean,
     * it is a heading replaced. Every mass from `0.15` to `0.85` then gave the SAME trajectory
     * to two decimals, because the term the mass enters was lost under the ambient.
     *
     * `\delta n_{f}` is the quantity `gravity.metric` is written in and the one `spreading`
     * carries. It is the fold record here less the fold record of the same world with the
     * sources left out - which the twin is, stepped beside this one since the tick they parted.
     */
    const nf = (x: number, y: number) => {
      const c = at(Math.round(x), Math.round(y));
      if (c < 0) return 0;
      const here = ledger.folds?.[c] ?? 0;
      return here - (twin ? (twin.ledger.folds?.[c] ?? 0) : 0);
    };
    /*
     * AND IT IS READ ACROSS THE BODY, NOT INSIDE IT. A body of radius two asked what was
     * folded one cell away was asking its OWN cells, where no fold is ever made - the reaction
     * is skipped on a source's cells - so the difference came out as nothing and a pair passed
     * each other in a straight line. The record it is bent by is the one its own extent
     * spans, so the difference is taken at its edge and divided by the width between.
     */
    /*
     * AND IT IS READ OVER EVERY CELL THE BODY OWNS, which is what a body IS here.
     *
     * `TRANSPORT` is quantified `over.sources`: "IT IS A RULE OF THE WORLD AND NOT OF A POINT.
     * A body is every local it owns at once: it reads ONE force, decides once, and the cells go
     * together or not at all." Four samples at its edge is four points, and on a record counted
     * in whole folds four points are shot noise - the record at a cell swings by several from
     * one tick to the next, so the difference of two of them is noise and a heading built from
     * it is a random walk. Measured, a pair thrown at each other did not move at all.
     *
     * THE BODY'S OWN EXTENT IS THE AVERAGE THE RULE ASKS FOR, and it is not a smoothing put on
     * top: the same difference is taken about every cell the body covers and they are added,
     * which is the one reading a body of many cells has.
     */
    const d = b.radius + 1, span = 2 * d;
    let gx = 0, gy = 0;
    const own = covers(b);
    for (const c of own) {
      const x = c % N, y = (c - x) / N;
      gx += (nf(x + d, y) - nf(x - d, y)) / span;
      gy += (nf(x, y + d) - nf(x, y - d)) / span;
    }
    if (own.length) { gx /= own.length; gy /= own.length; }
    /* and the lean is handed back rather than turned into a heading - see `carry` */
    const n = Math.hypot(gx, gy);
    if (n > 0) { b.hx = gx / n; b.hy = gy / n; }
    return { gx, gy };
  };

  /** what arrived at a body, which is what `propel` makes a force of - kept, not integrated */
  const felt = (b: Moving) => {
    let fx = 0, fy = 0;
    for (const c of covers(b)) { fx += hit[c * 2]; fy += hit[c * 2 + 1]; }
    b.px += fx; b.py += fy;
  };

  /** put a source in, and lay it down - `world.add` does this from outside, and so does this */
  /*
   * THE SAME WORLD WITHOUT THE SOURCES, branched when the first one arrives - see `twin` above.
   * Everything up to that tick is shared, so the two differ by the sources and by nothing else.
   */
  let twin: any;
  const branch = () => {
    if (twin || o.twin === false) return;
    twin = continuous({ ...o, twin: false, tags: 0 });
    twin.n.set(f.n);
    for (const [k, v] of Object.entries(ledger))
      (twin.ledger[k] as Float64Array | undefined)?.set(v as Float64Array);
    twin.t = f.t;
  };

  /**
   * WHAT `propel` WALKS, AND NOTHING ELSE — the world as the rule asks about it.
   *
   * It reads `w.geometry` and `w.sources`; of a source, the cells it stands on, what it is
   * carrying and what it has earned; and of a cell, whether a way out leads somewhere and to
   * what - `outward(l.rays[d])`, which is a boundary whose `target.source.l` is the local at
   * the other end. That is the whole of the vocabulary, so that is the whole of what is built
   * here. A cell is made the first time something asks for it.
   *
   * NOTHING HERE DECIDES ANYTHING. Every question about what a body does is answered by the
   * rule that is handed this and run.
   */
  const spot: any[] = new Array(cells);
  const localAt = (c: number): any => {
    if (c < 0) return undefined;
    let l = spot[c];
    if (l) return l;
    const x = c % N, y = (c - x) / N;
    l = { c, x, y, source: null as any, rays: [] as any[], world,
      backend: { rng: () => rnd(c, 0, spin++), carrying: [] as any[] } };
    for (let d = 0; d < DEG; d++) {
      const v = g.V[d], to = at(x + v[0], y + v[1]);
      /* a ray IS the population on that way out - one thing or no things, read and written
       * where it lives, so a rule that douses one douses it here */
      const i = c * DEG + d;
      const r: any = { l, boundaries: [],
        get active() { return f.n[i] > 0; },
        set active(v2: boolean) { f.n[i] = v2 ? 1 : 0; } };
      /* one end leads away, the other stays - which is what `outward` tells them apart by */
      r.boundaries = [
        { target: { source: { get l() { return localAt(to); } } } },
        { target: { source: { l } } },
      ];
      l.rays.push(r);
    }
    spot[c] = l;
    return l;
  };
  const world: any = { geometry: g, sources: [] as any[], ticks: 0 };
  let spin = 0;
  const shims = new Map<Moving, any>();
  const shim = (b: Moving) => shims.get(b);
  const rules = Object.values((o.theory as any).rules as Record<string, any>);
  /* the two rules a SOURCE is the subject of, told apart by what they are quantified over and
   * not by their names - one is asked of the world, one of a point a source stands on */
  const transport = rules.find(r => r.declared?.body?.doing?.some((d: any) => d.outside)
    && r.declared?.quantifier?.type === "World");
  const emission = rules.find(r => r.declared?.body?.doing?.some((d: any) => d.outside)
    && r.declared?.quantifier?.type !== "World");

  const add = (spec: Partial<Moving> & { x: number; y: number }): Moving => {
    const b: Moving = {
      ax: 0, ay: 0, hx: 0, hy: 0, px: 0, py: 0,
      mx: 0.25, radius: 2, speed: 0, moved: [], ...spec,
    };
    f.bodies.push(b);
    /* and the same body as the rule sees it - the cells it stands on, and what it carries */
    /*
     * AND THE SOURCE'S OWN PROPERTIES ARE THE ONLY THING SET HERE — what it is, not what the
     * rules then do with it. `\bar{m}_{x}` is how often it lights a way out, which is the
     * duty; the rest is a plain ball that absorbs and moves.
     */
    const s2: any = {
      moves: true, stepped: false, moved: 0, absorbs: true, conserve: false,
      duty: b.mx, emits: 1, phase: 0, period: 1, emission: "ball", propulsion: "none",
      advance: [0, 0], momentum: [b.px, b.py],
      locals: covers(b).map(localAt),
    };
    for (const l of s2.locals) l.source = s2;
    shims.set(b, s2); world.sources.push(s2);
    branch();
    lay();
    return b;
  };

  /**
   * ═══ AND A BODY MOVES BECAUSE `TRANSPORT` IS RUN, not because this works out what it would do
   *
   * `G` declares `TRANSPORT` as `over.sources.does(propel)` and `propel` says the whole of it -
   * advance, momentum, the exit most nearly earned, whether it has been earned, the step, that a
   * body takes its own cells with it, that it cannot move through another, and that a tick spent
   * getting somewhere is a tick not spent shining. EVERY ONE OF THOSE was written a second time
   * here, in my words, and every one of them came out differently: a heading turned by `turns`
   * with no inertia, then a momentum integrated twice, then a lean, then a velocity - and a pair
   * released from rest repelled under three of the four.
   *
   * THAT IS THE SAME FAULT THIS FILE EXISTS TO REMOVE, one level down. `Continuum` stopped
   * having an opinion about what a rule does; `Prove` stopped working out the pairing a second
   * time; and the body dynamics were still a private reading of a rule that is right there,
   * declared, with a body that can be run.
   *
   * SO IT IS RUN. What this owes `propel` is the world it walks: the sources, and for each the
   * cells it stands on as things with ways out that lead somewhere. Nothing about what it then
   * DOES is here, and a change to `propel` changes how a body moves with nothing in this file
   * edited - which is the only version of "the rules decide" that stays true.
   */
  const carry = () => {
    /* `EMISSION` has already put the momentum on it, `+V` a ray in and `-V` a ray out */
    world.ticks = f.t;
    transport?.declared.body.run({ at: [world], in: [] } as any);
    for (const b of f.bodies) {
      const s = shim(b);
      b.px = s.momentum[0]; b.py = s.momentum[1];
    }
    for (const b of f.bodies) {
      const s = shim(b);
      /* where the rule left it, read back off the cells it now stands on */
      let sx = 0, sy = 0;
      for (const l of s.locals) { sx += l.x; sy += l.y; }
      if (s.locals.length) { b.x = sx / s.locals.length; b.y = sy / s.locals.length; }
      b.moved.push(s.stepped ? 1 : 0);
      if (b.moved.length > 100) b.moved.shift();
    }
    if (f.bodies.length) lay();
  };

  return Object.assign(f, {
    step, rho, DEG, from, destroyed, between, hit, took, tags: T,
    add, lay, carry, covers, beta,
  });
};
