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
import { folded, showCount, type Count } from "../lib/Language.ts";
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
  /** the gates, as the questions they are - see where they are collected */
  tests?: ((e: any) => any)[];
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
      /*
       * AND THE GATES THEMSELVES, not only what they come to over an ensemble.
       *
       * A share is `P(condition)` at a given density. On ONE point with a definite state that
       * is not the answer to whether the condition holds - and reading it as though it were
       * is right for some conditions and wrong for others. `neutral` is `\paren{1-\rho}^{DEG}`,
       * which is one exactly when nothing is lit, so a threshold at one reads it correctly.
       * `busy` is its complement and reaches one only when EVERY way out is lit, while the
       * condition it names holds as soon as ONE is - so the same threshold answered `false`
       * for every point that was busy at all.
       *
       * A backend that runs whole rays can just ASK. The test is a function of the state and
       * the state is right there.
       */
      tests: d.gates.map(g => g.test.read),
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
  /** where it is - read back off the cell the rule left it standing on */
  x: number; y: number;
  /** what it is carrying, which `propel` moves it by - read back off `Source.momentum` */
  px: number; py: number;
  /**
   * `\bar{m}_{x}`, THE CEILING PER NEIGHBOUR — and its mass is `\bar{m}_{x} \cdot DEG`.
   *
   * A SOURCE IS A HOLE IN THE SPACE AND IT IS POINT-LIKE. It stands on ONE place, with as
   * many neighbours as that place has ways out, and how heavy it is is how much it hands
   * each of them. It is NOT a ball of lattice cells whose mass goes as its area: the lattice
   * is an abstraction, a hole's connections are its own, and a body twice as heavy is not a
   * body twice as wide. So there is no extent here to set, and `\bar{m}_{x}` is the only
   * dial a body has.
   */
  mx: number;
  /** how many neighbours the hole has - its own degree, not the lattice's. See `Source.ways` */
  ways?: number;
  /** whether the vacuum is allowed to carry it anywhere - `Source.moves`, its own property */
  moves?: boolean;
  /**
   * HOW OFTEN IT ACTS — `Source.duty`, and what decides how much of its neighbourhood is held
   * out of the vacuum's own beat.
   *
   * PERIOD TWO IS WHAT AN EMPTY VACUUM DOES, and `rhythm` derives it rather than assuming it:
   * every point splits, and the tick after, every one of them annihilates. A point in that
   * beat is neutral every other tick, so `(G/2)` fires on it then and hands back what was
   * folded into it, and the record settles at `DEG/2`.
   *
   * WHERE RAYS ARE, IT DEVIATES FROM THAT, and the deviation is not a fault to be patched -
   * it IS the mechanism. "A body's cells are not neutral - they belong to a source - so the
   * split does not fire on them, and that is the whole of gravity in this model: not a pull
   * between bodies but an expansion that DID NOT HAPPEN where something was in the way." Rays
   * occupy the space they cross exactly as matter does, so a place a source keeps lit is a
   * place the vacuum's expansion is suppressed at, and what is folded there stays folded.
   *
   * SO HOW OFTEN A SOURCE ACTS IS HOW MUCH OF THE MEDIUM IT HOLDS OUT OF THE BEAT, and that is
   * a property of the source rather than anything the rules decide - which is why it is here
   * and not there.
   */
  duty?: number;
  /**
   * WHETHER IT HANDS BACK WHAT ARRIVED — `Source.conserve`, "what separates a REDIRECTOR from
   * a SOURCE", and what decides whether it feels radiation pressure.
   *
   * A body that absorbs and does not re-emit TAKES the momentum of everything that lands on
   * it, so a bright neighbour blows it away: measured, a dark body six cells from a bright one
   * was pushed 64 cells off in four hundred ticks, with a control that did not move at all.
   * One that hands back what arrived has its `+V` and `-V` cancel ray by ray and feels none.
   */
  conserve?: boolean;
  /**
   * WHICH POPULATION ITS RAYS ARE COUNTED IN — its own index by default.
   *
   * `tags` keeps whose ray a ray is so the cross term of `\bar{m}\bar{m}'` can be drawn, and
   * a panel does not always want one channel per body: five bodies of which four are the same
   * kind of thing are TWO populations, not five. Saying so here costs nothing - every rule
   * treats a tagged population exactly alike - and keeps a recording the size of a recording.
   */
  tag?: number;
  /** and the pattern it chooses under that ceiling - see `Source.chooses` */
  chooses?: (d: number, tick: number) => number;
};

export type Continuous = {
  N: number;
  /** `n[c·DEG + k]` — the population, per point, per exit. `\hat{d}` is discretised by the
   *  geometry because the collision is `facing`, and a facing pair is two rays on one EDGE */
  n: Float64Array; work: Float64Array;
  /** the ledgers the terms move, one array each, named as the terms name them */
  ledger: Record<string, Float64Array>;
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
  let heard: Beat | undefined;
  const seed = (o.seed ?? 1) >>> 0;
  const rnd = (c: number, k: number, i: number) => {
    let x = (seed ^ Math.imul(f.t + 1, 0x9e3779b1) ^ Math.imul(c, 0x85ebca6b)
      ^ Math.imul(k + 1, 0xc2b2ae35) ^ Math.imul(i + 1, 0x27d4eb2d)) >>> 0;
    x = Math.imul(x ^ (x >>> 16), 0x21f0aaad) >>> 0;
    x = Math.imul(x ^ (x >>> 15), 0x735a2d97) >>> 0;
    return ((x ^ (x >>> 15)) >>> 0) / 4294967296;
  };
  const N = o.N, g = o.geometry, DEG = g.DEG;
  /*
   * AND THE LATTICE HAS TO BE ONE THIS CAN STEP ON — asked of the geometry, which already
   * knows.
   *
   * This walks whole cells: `at(x + V[d][0], y + V[d][1])` is an index, so a lattice whose
   * exits do not step by a whole number of them has no answer here. `Local.ts` checks exactly
   * that and publishes it as `unrunnable` - "exit 2 steps by [0.5, 0.866], which is not a whole
   * number of cells" - and this read straight past it: `triangular-6` came back with a
   * population of NaN, a fold record of NaN and a beat reported off both, which is worse than
   * refusing because it looks like a result. Nothing here decides which lattices are runnable;
   * the geometry says, and this stops.
   */
  /*
   * AND IT STEPS BY `L` AND NOT BY `V`, which the geometry says in as many words: `L` is "whole-
   * cell index offsets, one per exit — WHAT THE BACKEND STEPS BY", and `V` is where the exit
   * points in space. On a square lattice they are the same array and the mistake is invisible;
   * on `triangular-6` `V` is `[0.5, 0.866]` and `L` is `[0, 1]`, so stepping by `V` indexed a
   * cell at half a column and every population in the world came back NaN. `unrunnable` is the
   * geometry's own check that `L` is whole, and it is undefined there because that lattice IS
   * runnable - by `L`. Both of those were being got wrong at once, and each hid the other.
   */
  if (g.unrunnable)
    throw new Error(`${g.name} cannot be stepped cell by cell: ${g.unrunnable}`);
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
  /**
   * WHERE SPACE WAS DESTROYED THIS TICK — the meetings, which is the one thing read out of
   * the medium that is not the population itself.
   *
   * THERE WERE FOUR MORE OF THESE AND EVERY ONE WAS A RULE WRITTEN TWICE. `hit` and `took`
   * held what arrived at a body and what it handed back, which is `radiate`'s own budget and
   * its own `+V`/`-V`; `put` held what a body emits, worked out as
   * `\paren{1 - \beta}\bar{m}_{x}DEG`, which is `radiate` again, in a second hand, and which
   * nothing ever read. `between` held which pair of tags a meeting was between and was never
   * written at all. A backend that keeps its own answer to a question a rule answers can
   * disagree with the rule, and only one of the two is the theory.
   */
  const destroyed = new Float64Array(cells);

  const f: Continuous = {
    N, n: new Float64Array(cells * DEG), work: new Float64Array(cells * DEG),
    ledger, blocks: new Uint8Array(cells),
    bodies: [], t: 0,
  };

  /**
   * WHAT A RULE SEES IS THE WORLD AS IT STOOD WHEN ITS PASS BEGAN — `Theory.ts`'s own words,
   * and the thing this was not doing.
   *
   * `World.tick` runs ONE RULE AT A TIME over the whole world and flushes after it, so a rule
   * matches against the state its pass opened with. This ran cell-major - every rule at cell
   * nought, then every rule at cell one - and wrote in place, so a meeting at `c` was resolved
   * against a neighbour the same pass had already changed, and that dependence chains the whole
   * length of the sweep IN ONE TICK.
   *
   * AND THAT IS A SIGNAL FASTER THAN A STEP, WHICH THE MODEL HAS NO ROOM FOR. `MOVEMENT` is the
   * only thing that carries anything anywhere and it carries one cell a tick - that IS `\bar{c}`
   * - so nothing the medium does can reach further than one cell in one tick. Measured before
   * this: a body put down in an empty box broke the vacuum's beat out to Chebyshev SEVEN after
   * five ticks and THIRTY-SEVEN after twenty, against a light cone of five and twenty. About
   * `1.85` cells a tick, on a lattice where the fastest thing there is goes one.
   *
   * SO A PASS READS ITS SNAPSHOT AND WRITES THE WORLD, and `\bar{c}` comes back on its own.
   */
  /**
   * THE TICK'S INPUT, WHAT IS SPENT OF IT, AND WHAT THE TICK PRODUCES.
   *
   * ONE THING A TICK, AND WHAT COMES OF IT IS THE TICK'S OUTPUT. A rule reads the world the
   * tick opened with; whatever it makes is not there to be acted on again until the next one.
   * So a ray a point has just split into does not also travel, a ray that has just travelled
   * is not also met, and nothing composes with itself inside one tick.
   *
   * AND THAT IS WHAT `\bar{c}` IS. `MOVEMENT` carries one cell a tick and it is the only thing
   * in the model that carries anything anywhere, so nothing may reach further than one cell in
   * one tick. Run with each rule seeing the last one's work the rules COMPOSE inside a tick -
   * a point splits, the ray it made travels a cell, and the meeting that ray has credits a fold
   * to the far end of an edge one cell further on - and a disturbance walks TWO cells a tick.
   * Measured before this, on a body put down in an empty box: broken out to Chebyshev 7 after
   * five ticks, 17 after ten, 27 after fifteen, 37 after twenty - ten cells every five ticks,
   * flat, against a light cone of one.
   *
   * `spent` IS WHAT A RULE TOOK OFF THE INPUT and `made` is what it put into the output. A
   * douse spends; a lighting makes; and the transport carries what the input still has - the
   * survivors - into the output alongside. Nothing anywhere needs to know which rule is which.
   */
  const was = new Float64Array(cells * DEG);
  const spent = new Float64Array(cells * DEG);
  const made = new Float64Array(cells * DEG);
  /**
   * AND THE FOLD RECORD THE TICK OPENED WITH, which the population had and this did not.
   *
   * `turns` weighs the way a thing is going against the ways this place has been folded, so
   * the record is an INPUT to the transport - and `ANNIHILATION` and `(G/2)`'s `unfold` are
   * rules that CHANGE it. Run against the live array, a ray's turn was being decided by folds
   * the same tick's meetings had just made and handed back: two rules composing inside one
   * tick, which is the fault that made a disturbance walk two cells in one and which every
   * other quantity here was already protected from.
   */
  const wasFolds = ledger.folds ? new Float64Array(cells) : undefined;
  /**
   * AND THE SAME RECORD PER WAY OUT, because that is the one a BODY reads.
   *
   * `turns` weighs the way a thing is going against the ways this place has been folded, and
   * which WAY is the whole of the lean - a total per cell cannot say which side of a place has
   * more folded into it. `propel` asks `folded(l)`, which is per way out, so the snapshot it
   * is filled from has to be per way out too. Filled from the live array instead, a body's
   * step was being decided by folds the same tick's meetings had just made - the fault every
   * other quantity here is already protected from, in the one rule where it decides a
   * direction rather than a rate.
   */
  const wasFoldsK = ledger.folds ? new Float64Array(cells * DEG) : undefined;
  let seeing: Float64Array | null = null;
  let seeingFolds: Float64Array | undefined;

  /** the population at a point, in the units the equation's `n` is in — a share of exits */
  const rho = (c: number) => {
    const a = seeing ?? f.n;
    let s = 0; for (let k = 0; k < DEG; k++) s += a[c * DEG + k];
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
  /** one env, written into - a gate is asked of a point and nothing here escapes */
  const asked: any = { at: [null], in: [] };
  const here1 = (c: number) => { asked.at[0] = localAt(c); return asked; };

  const local: Symbols = { ...sym };
  const here = (c: number): Symbols => {
    /*
     * AND MATTER IS NEVER NEUTRAL, which is what `busy` says and not a test added here:
     * "a point is unavailable to split when something is passing THROUGH it or when something
     * IS there, and both of those are the same word". The gate's declared share is written in
     * `\rho` alone - `1 - \paren{1 - \rho}^{DEG}` - so the only way to tell it what `busy`
     * knows is to report the occupancy `busy` reads: a place a source stands on is full.
     * Without it a body that chose to put little down went neutral on its quiet ticks and
     * SPLIT, and the expansion that did not happen where something was in the way - which is
     * the whole of gravity here - happened after all.
     */
    local["\\rho"] = f.blocks[c] ? 1 : rho(c);
    if (ledger.folds) local["n_{f}"] = (seeingFolds ?? ledger.folds)[c];
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
    tests: (t as any).tests as ((e: any) => any)[] | undefined,
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

  const reactExactly = () => {
    /*
     * ONE PASS PER RULE OVER THE WHOLE WORLD, which is what `World.tick` does: `for (const
     * rule) { forEachMatch(...); flush(); }`. Cell-major ran every rule at every point before
     * moving on, which is a different model and not a faster one.
     *
     * AND EVERY ONE OF THEM READS THE SAME WORLD — the one the tick opened with. So the order
     * they are run in cannot matter, which is the point: there is no arrangement of these that
     * lets two of them compose inside a tick, and no arrangement that has to be argued for.
     */
    for (const fx of fixed) {
      const t = fx.t;
      for (let c = 0; c < cells; c++) {
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
          /*
           * AND ITS GATES ARE RUN WITH IT. `EMISSION` is `at.point.of(owns).of(acting)` -
           * a point something outside the model put there, that has not already spent this
           * tick getting somewhere - and `declared.exec` is the gates and the body made into
           * the one function a tick runs. Calling `body.run` reached past them, so a body
           * emitted on the ticks it stepped as well as the ticks it stood, and the `1 - \beta`
           * the line carries was in the equation and not in the world.
           */
          if (f.blocks[c] && outside.length) {
            /* the record as the rule keeps it, before and after - see `unfolded`; and the ways
             * out a hole is joined on by, wherever the rules have left it standing */
            /* the hole reaches as far as it is joined - its own place and the places its
             * ways out lead to, which is where it takes space from and hands it back */
            const reach = [c];
            {
              const x1 = c % N, y1 = (c - x1) / N;
              for (let d = 0; d < DEG; d++) {
                const v = g.L[d], to = at(x1 + v[0], y1 + v[1]);
                if (to >= 0) reach.push(to);
              }
            }
            for (const r of reach) refold(r);
            widen(localAt(c), f.bodies[f.blocks[c] - 1]?.ways ?? DEG);
            /*
             * AND WHOSE RAYS THESE ARE IS NOTED AS THEY ARE MADE — which nothing was doing.
             *
             * `tags` exists so the two halves of `\bar{m}\bar{m}'` can be told apart: "a
             * single body cannot have gravity - its rays need something to annihilate against
             * - so the long-range channel is MEETINGS between two bodies' radiation. That is a
             * cross term, and a cross term cannot be drawn from a total." `carryExactly`
             * carries a tagged population faithfully and `from` reads it back, but NOTHING
             * EVER PUT ANYTHING IN: the arrays were allocated, propagated and read, and every
             * value in them was nought. Every panel drawing a body's own field has been
             * drawing an empty array.
             *
             * A SOURCE'S RAYS ARE THE SOURCE'S, and that is the whole of the rule for it. What
             * `EMISSION` just put down is the difference `made` shows across the call, over
             * the ways out of this place - `radiate` hands them to the NEIGHBOURS, so that is
             * where to look. Nothing about the dynamics is touched: the sum of the tags and
             * the vacuum is exactly the population the line is about.
             */
            const who = f.bodies[f.blocks[c] - 1]?.tag ?? (f.blocks[c] - 1);
            const x0 = c % N, y0 = (c - x0) / N;
            const seen: number[] = [];
            if (who < T) for (let d = 0; d < DEG; d++) {
              const v = g.L[d], to = at(x0 + v[0], y0 + v[1]);
              seen.push(to < 0 ? 0 : made[to * DEG + d]);
            }
            for (const r of outside) r.declared.exec(localAt(c));
            if (who < T) for (let d = 0; d < DEG; d++) {
              const v = g.L[d], to = at(x0 + v[0], y0 + v[1]);
              if (to < 0) continue;
              const put = made[to * DEG + d] - seen[d];
              if (put > 0) tag[who][to * DEG + d] += put;
            }
            for (const r of reach) unfolded(r);
          }
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
           * A MEETING IS A FACING PAIR OF ENDS ACROSS AN EDGE — TWO POINTS, AND THE PAIRING IS
           * READ OFF THE QUANTIFIER RATHER THAN GUESSED AT.
           *
           * `facing.pair` is `["Boundary", "Boundary"]` and says what that means in its own
           * words: "every facing pair of ends - a ray and what is coming the other way ACROSS
           * AN EDGE". `Theory.step` walks it as a boundary and the boundary it is linked to, so
           * the two ends are the ray at `c` heading `k` and the ray at the `k`-NEIGHBOUR heading
           * back. `ANNIHILATION` says the same thing again — "two rays that meet on the edge
           * BETWEEN TWO POINTS" — and its body needs it: `let_(stands(x), here)` and
           * `let_(stands(y), there)` are two DIFFERENT points, `bump` credits half the deficit
           * to each of them, and `fold(here, there)` is refused outright when they are the same.
           *
           * IT PAIRED `n[c·DEG+k]` WITH `n[c·DEG+OPP[k]]`, WHICH IS ONE POINT. Two rays standing
           * at one place on opposite ways out are not coming the other way at each other - they
           * have already crossed and are moving apart - so this was resolving a meeting the rule
           * does not describe, and everything that hangs off the meeting was built on it:
           *
           *   THE FOLD HAD NOWHERE TO POINT. `here` and `there` collapsed to one point, so the
           *     direction "the two points were separated along" was not a fact the loop had. It
           *     wrote the record on `k` for `k` in `AXES` - half the ways out, always the same
           *     half - and the record came out pinned in one corner of the lattice whatever was
           *     nearby. Measured at five separations from eight cells to forty-four, the lean
           *     read `(-0.6, -0.25)` at every one of them.
           *   AND THE VACUUM COULD NOT KEEP ITS BEAT. From empty, every point is neutral, every
           *     point splits, every EDGE then has both its ends carrying and every one of them
           *     annihilates - all full, then all empty, which is the two-cycle the medium runs
           *     on. Resolved at one point instead the cancellation is not exact, a residue is
           *     left every tick, and the residue is what a point is never neutral again for.
           *
           * SO THE EDGE IS THE MATCH. Each undirected edge is one meeting and is walked once
           * here; the rule's own arbitrariness about which end is `here` is what the halves
           * below are - the same "half to each end" the body writes for the deficit.
           */
          const walked = val(t.walked, e, 1);
          if (!(share > 0) || !(walked > 0)) continue;
          const x = c % N, y = (c - x) / N;
          for (const k of g.AXES) {
            const v = g.L[k], to = at(x + v[0], y + v[1]);
            /* an edge with nothing at the far end is not a pair of ends */
            if (to < 0) continue;
            const a = c * DEG + k, b = to * DEG + g.OPP[k];
            const pairs = Math.min(was[a] - spent[a], was[b] - spent[b]);
            if (pairs <= 0) continue;
            const fires = pairs * (share / walked);
            /* what it douses is SPENT out of the tick's input, so the transport never carries
             * it: two rays that meet on the edge between two points do not also cross it */
            if (onPair) {
              const off = fires * Math.abs(onPair) / 2;
              spent[a] += off; spent[b] += off;
            }
            /* what it lights goes to both ends, since either of them is the survivor - and it
             * goes into the tick's OUTPUT, so it travels on the next one */
            if (perExit) for (const at2 of [c, to]) for (let q = 0; q < DEG; q++)
              made[at2 * DEG + q] = Math.min(CAP, made[at2 * DEG + q] + fires * perExit / DEG / 2);
            if (ledger.space) {
              ledger.space[c] += fires * fx.dSpace / 2;
              ledger.space[to] += fires * fx.dSpace / 2;
            }
            /*
             * AND THE RECORD IS WRITTEN ON THE EDGE IT HAPPENED ON, at each end, pointing at
             * the other — "more space IN A DIRECTION - the one the two points were separated
             * along". So what stands on `c`'s way out `k` is how much has been folded on the
             * edge that way leads down, and a place beside a busier neighbourhood carries more
             * that way than the other. That is the whole of the lean, and it is a count of
             * meetings rather than anything read off a field.
             */
            if (foldsK && fx.dFolds) {
              const half = fires * fx.dFolds / 2;
              foldsK[c * DEG + k] = Math.max(0, foldsK[c * DEG + k] + half);
              foldsK[to * DEG + g.OPP[k]] = Math.max(0, foldsK[to * DEG + g.OPP[k]] + half);
              ledger.folds![c] = Math.max(0, ledger.folds![c] + half);
              ledger.folds![to] = Math.max(0, ledger.folds![to] + half);
            }
            destroyed[c] += Math.abs(fires * fx.dSpace) / 2;
            destroyed[to] += Math.abs(fires * fx.dSpace) / 2;
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
        /*
         * A GATE ASKED OF A POINT IS ASKED, not averaged. Its share is what a share of POINTS
         * comes to over an ensemble; this backend holds a state, so the question has an answer
         * and the answer is the gate's own test read on that state.
         */
        const holds = fx.point
          ? (fx.tests?.every(q => q(here1(c))) === false ? 0 : 1)
          : share;
        const fires = holds * (t.degree ? Math.pow(rho(c), t.degree) : 1);
        if (fires <= 0) continue;
        if (fx.dRays > 0) for (let k = 0; k < DEG; k++)
          made[c * DEG + k] = Math.min(CAP, made[c * DEG + k] + fires * fx.dRays / DEG);
        else if (fx.dRays < 0) for (let k = 0; k < DEG; k++)
          spent[c * DEG + k] += fires * -fx.dRays / DEG;
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
    /* THE TICK'S OUTPUT OPENS WITH WHAT THE TICK MADE — what has just been lit is there, and it
     * travels on the NEXT tick rather than on this one */
    f.work.set(made);
    for (let i = 0; i < T; i++) tagWork[i].fill(0);
    const turn = moving.find(t => t.kernel);
    /* the record as the tick opened, not as this tick's meetings have left it */
    const fold = (i: number) => i < 0 ? 0 : ((seeingFolds ?? ledger.folds)?.[i] ?? 0);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const c = at(x, y);
      const e = here(c);
      const keeps = turn ? val(turn.kernel!.keeps, e, 1) : 1;
      const dv = turn ? val(turn.kernel!.drifts, e, 0) : 0;
      const gx = dv && ledger.folds ? (fold(at(x + 1, y)) - fold(at(x - 1, y))) / 2 : 0;
      const gy = dv && ledger.folds ? (fold(at(x, y + 1)) - fold(at(x, y - 1))) / 2 : 0;
      const gn = Math.hypot(gx, gy);
      for (let k = 0; k < DEG; k++) {
        /* WHAT THE TICK STILL HAS TO CARRY: its input, less what the rules spent of it. A ray
         * that met something is not here to be carried, and a ray made this tick is not here
         * yet - it is already in the output, waiting for the next one. */
        let m = was[c * DEG + k] - spent[c * DEG + k];
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
          const v = g.L[out];
          const to = at(x + v[0], y + v[1]);
          offered++;
          if (to < 0) continue;
          roomed++;
          /*
           * AND A RAY LANDS ON A BODY'S CELL LIKE ANY OTHER. Catching it here and summing it
           * into a vector was absorption written a second time; `EMISSION` counts what arrived
           * per exit and destroys it, which it can only do if it is there to be found.
           */
          /*
           * AND WHAT ARRIVES IS ADDED. STREAMING MAKES NOTHING AND IT DESTROYS NOTHING.
           *
           * `CAP` is what a way out may HOLD when a REWRITE offers it a second ray - `light` is
           * idempotent, so a point splitting onto an exit that is already lit puts one ray
           * there and not two. That is a question about the rewrite. Clamping here is a
           * different claim altogether: it says a ray that already exists is destroyed for
           * arriving where another one is, and no rule in the model says that.
           *
           * AND IT IS WHAT A BODY'S FIELD WAS BEING DESTROYED BY. The vacuum's own beat never
           * needs the cap - every point splits at once, every ray goes straight, so each exit
           * receives exactly ONE by symmetry - and measured on a uniform world it settles
           * identically either way, `\rho = 0` at every tick boundary and `n_{f} = 4` exactly.
           * The only thing the clamp ever bit on was the EXCESS a source puts in, which is the
           * whole of what a source is. `ANNIHILATION` already handles that excess correctly and
           * without any help: a meeting takes `\min` of the two ends, so where a body has put
           * two rays against the vacuum's one, one pair goes and ONE COMES THROUGH. That is why
           * a body's radiation outlives the vacuum it is travelling in, and it is the rules
           * doing it rather than anything here.
           */
          f.work[to * DEG + out] += 1;
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

  /**
   * WHAT THE MEDIUM IS IN THE MIDDLE OF A TICK, and not only at the ends of one.
   *
   * A TICK IS NOT AN INSTANT AND THE RULES SAY SO. `World.tick` runs the rules IN THE ORDER
   * THEY ARE DECLARED and flushes after each, so every rule sees what the ones before it did:
   * `G` declares EMISSION, CREATION, MOVEMENT, ARRIVAL, ANNIHILATION, and the medium is in a
   * different state at each of those moments. Read only at the ends of a tick it looks like a
   * fixed point; read through one it is a BEAT - a point splits and every way out of it is
   * lit, what is lit steps, and what steps meets what is coming the other way and is gone. The
   * average of those is a state the medium is never in, and a source that emits at one of them
   * is not doing the same thing as a source that emits at another.
   *
   * SO THE MOMENTS ARE NAMED OFF THE THEORY'S OWN ORDER. Nothing here knows what CREATION is;
   * it knows which terms `Continuum` emitted before the transport operator and which after, and
   * those are the moments a tick has.
   */
  const beats: { says: string; rho: number; folds: number }[] = [];
  let watching = false;
  /*
   * AND WHOEVER IS WATCHING MAY LOOK AT THE WORLD ITSELF, not only at what it averages to.
   *
   * WHAT MATTERS ABOUT THE BEAT IS WHERE IN THE WORLD IT IS BROKEN. `n_{f}` AT THE MOMENT RAYS
   * MOVE is what `turns` weighs a heading against, so it is the speed of light at that place -
   * and a mean over the box cannot show a profile. The moment is named and the state is right
   * there; this hands it over rather than deciding what about it is interesting.
   */
  let looking: ((says: string) => void) | undefined;
  /*
   * A TICK HAS TWO MOMENTS AND NOT THREE, now that nothing composes inside one: the world every
   * rule was handed, and what the tick left behind. WHICH RULE RAN FIRST IS NOT A MOMENT,
   * because every one of them was handed the same world - and that is the whole of why a
   * disturbance cannot get further than one cell.
   */
  const moments = [
    `the world every rule was handed`,
    `what the tick left, after ` +
      (acting.map(t => t.rules.join(",") || "\\Sigma").join(", ") || "nothing") +
      ` and the transport`,
  ];
  const note = (i: number) => {
    looking?.(moments[i]);
    if (!watching) return;
    let r = 0, z = 0;
    for (let c = 0; c < cells; c++) { r += rho(c); z += ledger.folds?.[c] ?? 0; }
    beats.push({ says: moments[i], rho: r / cells, folds: z / cells });
  };

  /**
   * ONE TICK: EVERY RULE READS THE WORLD IT OPENED WITH, AND WHAT THEY MAKE IS WHAT IT LEAVES.
   *
   * It ran as three moments with the state moving between them - the rules before the
   * transport, the transport, the rules after - and that is what let a disturbance walk TWO
   * cells in one tick: a point split, the ray it made travelled, and the meeting that ray then
   * had credited a fold to the far end of an edge one cell further on again. Now the input is
   * taken once, every rule is handed it, douses are SPENT out of it and lightings are MADE into
   * what the tick leaves, and the transport carries whatever the input still has into the same
   * place. Nothing acts on anything made this tick, so `\bar{c}` is one cell and there is
   * nowhere left for it to be anything else.
   */
  const step = () => {
    if (twin) twin.step();
    destroyed.fill(0);
    roomed = 0; offered = 0;
    was.set(f.n); spent.fill(0); made.fill(0); spins.fill(0);
    if (wasFolds && ledger.folds) wasFolds.set(ledger.folds);
    if (wasFoldsK && foldsK) wasFoldsK.set(foldsK);
    seeing = was; seeingFolds = wasFolds;
    note(0);
    /*
     * AND `TRANSPORT` IS PART OF THE TICK, which it was not — and that is what let a body do
     * two things in one.
     *
     * ONE ACTION A TICK, MOVING OR SHINING AND NOT BOTH: `EMISSION` is gated on `spare(point)`,
     * which asks `l.source.stepped`, and `propel` is what sets it. Run outside the tick - the
     * panel called `carry()` after `step()` - that flag was always a tick STALE, so the gate
     * arbitrated LAST tick's move and a body was free to shine and step on the same one.
     *
     * AND A BODY THAT DOES BOTH PUSHES ITSELF. `radiate` pays `-V[k]` for every way it lights
     * and takes `+V[k]` back for every ray it catches; standing still it catches none of its
     * own and the `-V[k]` sum to nothing, which is why a body at rest sits at `|p| = 2` for
     * ever. Step along `d` on the same tick and it walks onto its own forward ray and catches
     * THAT one alone: `-\sum_{k}V[k] + V[d] = +V[d]`, a push in the direction it was already
     * going. It is not a small effect - it is the whole recoil of every other way out - and it
     * runs away: measured, a body asked for `0.005\bar{c}` reached `0.96` and one asked for
     * `0.15` reached `0.88`, from any mass and any speed, as soon as it took a single step.
     *
     * SO THE ARBITRATION HAPPENS FIRST AND INSIDE THE TICK. `propel` reads the input and
     * nothing else - what the body carries, what it has earned, the record where it stands - so
     * asking it first is not letting it see another rule's work; it is deciding WHICH ONE THING
     * this body does, which is what `spare` was always asking about.
     */
    reactExactly();
    carryExactly();
    seeing = null; seeingFolds = undefined;
    /* and where the rules left each body is read back off the place it now stands on */
    carry();
    note(1);
    if (offered > 0) sym["\\omega"] = roomed / offered;
  };


  /** how much of a tagged population is standing at a point, in the units `\rho` is in */
  const from = (i: number, c: number) => {
    let s = 0; for (let k = 0; k < DEG; k++) s += tag[i][c * DEG + k];
    return s / DEG;
  };
  /**
   * WHERE A BODY STANDS — ONE PLACE, because a source is a HOLE IN THE SPACE and not a heap
   * of little ones.
   *
   * IT WAS A BALL OF CELLS AND THAT MADE MASS AN AREA. A radius of six is a hundred and
   * thirteen cells, each lighting `DEG` ways, so `\bar{m}` came to `\bar{m}_{x}` times nine
   * hundred and heavier meant WIDER — a body's weight read off how much lattice it covered.
   * That is the lattice showing through: it is an abstraction, the continuous reading is not
   * entitled to lean on it, and a hole's connections are its own however the cells are drawn.
   *
   * SO A BODY IS ONE PLACE WITH `DEG` NEIGHBOURS AND ITS MASS IS WHAT IT HANDS THEM,
   * `\bar{m} = \bar{m}_{x} \cdot DEG`. Being heavier is putting more down each way out, which
   * is `\bar{m}_{x}`; being lighter at the same size is choosing to put less, which is
   * `Source.chooses`. Nothing about how big it is enters, because nothing about how big it is
   * is a fact about the hole.
   */
  const covers = (b: Moving) => {
    const c = at(Math.round(b.x), Math.round(b.y));
    return c >= 0 ? [c] : [];
  };

  /**
   * WHICH PLACES ARE MATTER — read off where the RULE left each body standing, and nothing
   * else.
   *
   * WHAT A BODY PUTS INTO THE MEDIUM IS NOT WRITTEN HERE AND CANNOT BE. `EMISSION` is a
   * declared rule with a declared body; it decides which ways out fire, how often, and what
   * each costs in recoil. A `f.put` worked out beside it - `\paren{1 - \beta}\bar{m}_{x}DEG`,
   * the same sentence in a second hand - is a second answer to a question that has one, and
   * it is the fault this whole file exists to remove. So all that is kept is WHERE the matter
   * is, which is what `busy` needs and what a panel draws.
   */
  const mark = () => {
    f.blocks.fill(0);
    f.bodies.forEach((b, i) => {
      for (const l of shim(b)?.locals ?? []) f.blocks[l.c] = i + 1;
    });
  };

  /*
   * AND FOUR MORE READINGS OF `propel` STOOD HERE AND ARE GONE.
   *
   * `moveBy` and `shift` walked a body across the lattice and swapped the medium round it -
   * `propel`'s step, in this file's words. `bend` re-derived the lean from `\delta n_{f}` and
   * set a heading from it - `turns`, in this file's words. `felt` summed arrivals into a force
   * - `radiate`'s `+V`, in this file's words. Not one of them was called by anything: they had
   * been superseded, quietly, and were left standing as four descriptions of rules that
   * describe themselves. The lean now enters where `MOVEMENT` puts it, in `propel`'s own step.
   */

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
    /*
     * AND THE RECORD PER WAY OUT GOES ACROSS TOO, which it did not — and a twin branched
     * without it is not the same world.
     *
     * `unfold` hands a fold back DOWN A WAY THAT HAS ONE, so the per-exit record is what
     * decides whether anything can be returned at all. Copied with an empty one the twin
     * could decrement nothing, its record climbed away from the world it was branched from,
     * and the difference the whole device exists to measure came out at `-4.5` FIFTY-FIVE
     * CELLS FROM ANYTHING — a constant offset between two vacua rather than what a body did.
     */
    twin.foldsPerWay()?.set(foldsK ?? new Float64Array(0));
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
  /**
   * ONE MORE WAY OUT OF A PLACE — the `j`-th, leading down the exit `j mod DEG` and carrying
   * the `floor(j/DEG)`-th ray standing on it.
   *
   * A PLACE HAS `DEG` OF THEM AND A HOLE HAS AS MANY AS IT HAS NEIGHBOURS. `Source.ways` is
   * the hole's own degree and `heading` says its ways are spread evenly over the exits it
   * stands among, so a source of `ways` neighbours has `ways/DEG` of them down each exit and
   * what the medium carries there is HOW MANY of them are lit. That is the whole of why a
   * heavier body is a brighter one, and it is why the population on a way out is a COUNT here
   * rather than a bit: `\bar{m}_{x} = 1` on eight ways is what a splitting vacuum point puts
   * out, so a body that could never put down more than that could never be told from the
   * vacuum, and `\bar{m}\bar{m}'` had nothing to be a product of. Measured: `\delta n_{f}`
   * round a one-ray body was `161` at its own place, `35` one cell out and NOTHING at three -
   * a pull with a range of two cells.
   *
   * READ AND WRITTEN ONE RAY AT A TIME, AND THAT IS THE WHOLE OF THE BOOKKEEPING. A way out
   * is carrying while the count on its exit is not yet spent; lighting one adds a ray to that
   * count and dousing one takes a ray off. So `radiate` walking a hole's ways finds exactly as
   * many carrying as arrived - it reads and empties, way by way, and stops finding them when
   * the count is out - and puts down exactly as many as it chose. Nothing counts a ray twice
   * and nothing loses one.
   */
  const ways = (l: any, j: number): any => {
    const d = j % DEG, i = l.c * DEG + d;
    const v = g.L[d], to = at(l.x + v[0], l.y + v[1]);
    /*
     * AND A RAY IS READ OFF THE TICK'S INPUT AND WRITTEN INTO ITS OUTPUT — which is the same
     * sentence as everywhere else here, said where `radiate` touches the world. What is
     * CARRYING is what the tick opened with less what has been spent of it, so a source
     * walking its ways out empties them one at a time and finds exactly what arrived; what it
     * puts down goes into the output, and travels on the next tick rather than this one.
     */
    const r: any = { l, boundaries: [],
      get active() { return (seeing ? seeing[i] - spent[i] : f.n[i]) > 0; },
      set active(on: boolean) { if (on) made[i] += 1; else spent[i] += 1; } };
    /*
     * ONE END LEADS AWAY AND THE OTHER STAYS — which is what `outward` and `inward` tell
     * them apart by, and each of them ends on A RAY rather than on a stand-in for one.
     *
     * IT USED TO END ON `{l}`, an object carrying nothing but the local. That answers the
     * one question `outward(r).target.source.l` asks and no other, and it was enough for
     * exactly as long as `propel` asked no other. `turns` asks a second: `across` walks
     * `opposite(outward(r).target.source)` to reach the neighbour's ray on the SAME exit,
     * which needs the far end to be a ray with ends of its own. So the ends are the rays
     * the graph backend puts there - the facing ray across the edge, and this ray's own
     * ± partner on `OPP` - and every walk in `Local.ts` answers here the way it answers
     * anywhere else.
     */
    const o = g.OPP[d];
    r.boundaries = [
      { target: { get source() { return localAt(to)?.rays[o]; } } },
      { target: { get source() { return l.rays[o]; } } },
    ];
    l.rays.push(r);
    return r;
  };
  /** and a hole standing here is joined on by as many ways as it has neighbours */
  const widen = (l: any, n: number) => { while (l.rays.length < n) ways(l, l.rays.length); };

  const localAt = (c: number): any => {
    if (c < 0) return undefined;
    let l = spot[c];
    if (l) return l;
    const x = c % N, y = (c - x) / N;
    l = { c, x, y, source: null as any, rays: [] as any[], world,
      /*
       * AND THE DRAW BELONGS TO THE PLACE AND THE TICK, not to how many draws came before it.
       *
       * This was `spin++`, one counter for the whole world - which is the fault written out at
       * length where `rnd` is defined: "A SEQUENCE MAKES THE WHOLE WORLD DEPEND ON ITERATION
       * ORDER: put one more ray anywhere and every draw after it in that tick is a different
       * number, so two worlds 'on one seed' that differ by a single body decorrelate completely
       * within a few ticks." Every quantity in the medium was already keyed on where and when;
       * the one draw a BODY makes - `turns`, which is how it decides which way to step - was
       * still on the sequence, so which way one body went depended on how many bodies had been
       * asked before it.
       *
       * KEYED HERE TOO, on this place, this tick, and how many times this place has been asked
       * within it. `k` is past `DEG` so it cannot collide with the transport's own draws.
       */
      backend: { rng: () => rnd(c, DEG + 1, spins[c]++), carrying: [] as any[] } };
    for (let d = 0; d < DEG; d++) ways(l, d);
    spot[c] = l;
    return l;
  };
  /**
   * THE FOLD RECORD AS A RULE READS IT — `Language.folded`, filled from where this keeps it.
   *
   * `fold` writes the record and `turns` reads it, both through `folded(l)`, which hangs it
   * off the local's own store. This backend does not run those atoms - it integrates the
   * counted terms instead, and keeps what they come to in `foldsK` - so `folded(l)` at one of
   * these locals answered an EMPTY record, and a rule that asks the place it is standing what
   * ways through it there are was told there were none. `propel` then stepped rigidly along
   * the lattice whatever the vacuum had destroyed round about, which is a straight line
   * through curved space.
   *
   * AND IT IS THE RECORD THE MEETING WROTE, now that the meeting is resolved where the rule
   * puts it. `fold(here, there)` records on `here` the way out `there` lies down, so
   * `foldsK[c·DEG + d]` counts what has been folded on the EDGE from `c` toward its `d`
   * neighbour - which is "more space IN A DIRECTION", per way out, exactly as `folded` holds
   * it and exactly as `turns` draws from it.
   *
   * IT WAS BRIDGED, AND THE BRIDGE WAS MINE. While the meeting was being resolved at ONE point
   * the record had no direction to be written in - the loop wrote it on `k` for `k` in `AXES`,
   * half the ways out, always the same half - so this filled the record from the TOTAL standing
   * at each neighbour instead, on the argument that `turns` publishes `\nabla n_{f}` for its
   * drift and that would come to the same thing. It is not the same thing, it was a reading of
   * the kernel rather than of the rule, and it is not needed: with the meeting across the edge
   * the rule writes the record this reads.
   */
  const refold = (c: number) => {
    const rec = folded(localAt(c));
    /* the record as the tick opened, per way out - see `wasFoldsK` */
    const src = wasFoldsK ?? foldsK;
    for (let d = 0; d < DEG; d++) rec[d] = src ? src[c * DEG + d] : 0;
  };
  /**
   * AND BACK AGAIN, because a rule may WRITE the record and not only read it. `radiate` hands a
   * fold back on every way it lights, which is `(G/2)`'s own `unfold` half asked of a source;
   * this backend keeps the record in `foldsK`, so what the rule left there has to come home.
   */
  const unfolded = (c: number) => {
    if (!foldsK) return;
    const rec = folded(localAt(c));
    let tot = 0;
    for (let d = 0; d < DEG; d++) {
      foldsK[c * DEG + d] = Math.max(0, rec[d] ?? 0);
      tot += foldsK[c * DEG + d];
    }
    if (ledger.folds) ledger.folds[c] = tot;
  };

  const world: any = { geometry: g, sources: [] as any[], ticks: 0 };
  /** how many times each place has been asked for a draw this tick - see `localAt` */
  const spins = new Int32Array(cells);
  const shims = new Map<Moving, any>();
  const shim = (b: Moving) => shims.get(b);
  const rules = Object.values((o.theory as any).rules as Record<string, any>);
  /**
   * EVERY RULE A SOURCE IS THE SUBJECT OF, IN THE ORDER THE THEORY DECLARES THEM — and this is
   * a list rather than two named things.
   *
   * IT USED TO PICK OUT TWO AND TELL THEM APART BY THEIR QUANTIFIERS, one asked of the world
   * and one of a point. That was a reading of `G` as it happened to be written: two Sigma
   * rules, exactly, one of each shape. A theory with three, or with two of the same shape, got
   * one of them silently dropped - and when `TRANSPORT` became a rule about the place a body
   * stands on, which is what makes it local, this stopped finding it at all.
   *
   * SO NOTHING IS PICKED OUT. What a `Sigma` rule is, is one whose matches something outside
   * the model put there, and that is already on the rule - `outside`, from its own gate. They
   * are run where those matches are, in the order the theory wrote them, which is the order
   * `World.tick` would run them in. Order matters and is the theory's to state: `G` declares
   * `TRANSPORT` before `EMISSION` because a body decides which one thing it does with its
   * tick before it does it.
   */
  const outside = rules.filter(r =>
    r.declared?.body?.doing?.some((d: any) => d.outside)
    && r.declared?.quantifier?.type !== "World");

  const add = (spec: Partial<Moving> & { x: number; y: number }): Moving => {
    const b: Moving = { px: 0, py: 0, mx: 0.25, ...spec };
    f.bodies.push(b);
    /*
     * AND THE SOURCE'S OWN PROPERTIES ARE THE ONLY THING SET HERE — what it IS, not what the
     * rules then do with it. Whether the vacuum may carry it, whether it destroys what lands
     * on it, whether it acts this tick, and what it puts down each way out: those are a
     * source's own definition and they are the only assumptions this file is entitled to.
     * `\bar{m}_{x}` is its ceiling per neighbour, `ways` is how many neighbours the hole has
     * and `chooses` is the pattern it picks under that ceiling — so `\bar{m} = \bar{m}_{x}
     * \cdot ways` is what it radiates and what it weighs at once, and nothing about it is an
     * extent.
     */
    const s2: any = {
      id: f.bodies.length - 1,
      moves: b.moves ?? true, stepped: false, absorbs: true, conserve: b.conserve ?? false,
      /* it acts on every tick; how much it puts down is `\bar{m}_{x}`, per neighbour */
      duty: b.duty ?? 1, mx: b.mx, ways: b.ways, chooses: b.chooses,
      emits: 1, phase: 0, period: 1, dwellTicks: 1, turning: 0, bias: 1,
      emission: "isotropic", propulsion: "none",
      advance: [0, 0], momentum: [b.px, b.py],
      owed: 0, upkeepTicks: 0, moved: 0, origin: [b.x, b.y], u: [],
      locals: covers(b).map(localAt),
    };
    for (const l of s2.locals) { l.source = s2; widen(l, s2.ways ?? DEG); }
    shims.set(b, s2); world.sources.push(s2);
    branch();
    mark();
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
  /**
   * AND WHAT IS LEFT HERE IS READING BACK WHERE THE RULES PUT THINGS — not running them.
   *
   * `TRANSPORT` used to be run from here, after `step`, which put it outside the tick: `spare`
   * asks whether a body has already spent this tick getting somewhere, and a flag set after
   * the tick is a flag a tick late. It is a rule about a point a source stands on now, so it
   * runs where every other such rule runs - with them, in the theory's own order, inside the
   * tick - and this only reads off what happened.
   */
  const carry = () => {
    world.ticks = f.t;
    /*
     * AND THE STEP READS THE FOLD RECORD, so the record has to BE there — see `refold`. A body
     * whose place has swallowed nothing steps straight along the way it earned; one standing
     * where much has been folded leans, and that is the pull.
     */
    for (const b of f.bodies) {
      const s = shim(b);
      b.px = s.momentum[0]; b.py = s.momentum[1];
      /* where the rule left it, read back off the place it now stands on */
      let sx = 0, sy = 0;
      for (const l of s.locals) { sx += l.x; sy += l.y; }
      if (s.locals.length) { b.x = sx / s.locals.length; b.y = sy / s.locals.length; }
    }
    if (f.bodies.length) mark();
  };

  return Object.assign(f, {
    /*
     * AND THERE IS NO `carry` TO CALL ANY MORE. It was public and a panel ran `step()` then
     * `carry()`, which is what put `TRANSPORT` outside the tick and left `spare` arbitrating a
     * stale move. A tick is a tick: `step` runs every rule the theory has, bodies included.
     */
    step, rho, DEG, from, destroyed, tags: T, add, at,
    /**
     * WHAT THE MEDIUM COMES TO ON ITS OWN, found by running it — see `rhythm`.
     *
     * A FUNCTION AND NOT A GETTER, because `Object.assign` READS a getter as it copies it: a
     * property that answers by running a world would run one on every `continuous(...)`, and
     * this one builds a `continuous` of its own, so it recursed until the stack went.
     */
    beat: () => heard ??= rhythm({ ...o, N: 4 }),
    /** the medium read through a tick rather than at the ends of one - see `beats` above */
    through: (ticks: number, look?: (says: string) => void) => {
      watching = true; beats.length = 0; looking = look;
      for (let i = 0; i < ticks; i++) step();
      watching = false; looking = undefined;
      return beats.slice();
    },
    /**
     * THE FOLD RECORD AT A PLACE, PER WAY OUT — the same array `turns` draws from, offered
     * for reading. It is what a path leans by, so it is what a panel of the pull draws.
     */
    twinFolds: () => twin?.ledger?.folds as Float64Array | undefined,
    /** the record per way out, so a twin can be branched holding the same one */
    foldsPerWay: () => foldsK,
    record: (c: number) => Array.from({ length: DEG },
      (_, d) => foldsK ? foldsK[c * DEG + d] : 0),
  });
};

/* ═══════════════════════════════════════════════════════════════════════════════
 *
 * WHAT THE MEDIUM COMES TO WHEN IT IS LEFT ALONE — FOUND BY RUNNING IT, and it is NOT
 * assumed to be a number.
 *
 * EVERYTHING DOWNSTREAM WANTED A FIXED POINT AND ASKED FOR ONE. `\rho_{\infty}` is written all
 * over this arc as though the vacuum settles on a value and sits there, and a panel that burns
 * four hundred ticks "until what the rules build stops drifting" is asking the same thing. The
 * rules of `G` do not do that. From empty, every point is neutral, so EVERY POINT SPLITS AT
 * ONCE; every ray then goes straight, so every edge has both its ends carrying; so every one of
 * them annihilates and every point is empty again. Measured on a uniform world, exactly:
 *
 *     \rho    0   at every tick boundary        n_{f}   4   at every tick boundary
 *
 * and `4` is `DEG/2`, which is the balance `unfold` states in its own words - "a meeting takes
 * two rays and makes one fold; a splitting makes DEG rays and hands back one fold... DEG/2
 * meetings per splitting". THE VACUUM HAS A BEAT. It is full halfway through a tick and empty
 * at the ends of one, and the average of those two is a number no state of the medium is ever
 * in.
 *
 * AND THAT BEAT IS WHY A BODY HAS A FIELD AT ALL. A source puts its rays down while the vacuum
 * is empty - `EMISSION` is declared before `CREATION` and the theory's own order is what this
 * runs - so what it hands the space is an EXCESS over what the vacuum then lays on top. A
 * meeting takes `\min` of the two ends, so where a body has put two rays against the vacuum's
 * one, one pair goes and one comes through; a body in step with the vacuum would be cancelled
 * every tick one cell out, and out of step it carries. None of that is written anywhere here.
 * It is what the rules do, and what this exists to notice.
 *
 * SO IT IS FOUND RATHER THAN DECLARED, AND IT IS FOUND FOR WHATEVER THEORY IT IS HANDED. This
 * runs the theory's own rules on a uniform world - wrapped, which is what "everywhere alike"
 * means and the one place wrapping is right - and watches for the state to come back to itself.
 * A theory that settles on a value answers `period 1`. `G` answers `period 2`. A theory nobody
 * has written yet answers whatever it does, and nothing in here has an opinion about which.
 */
export type Beat = {
  /** how many ticks the medium takes to come back to itself — 1 is a fixed point */
  period: number;
  /** and how many it took to get there from empty */
  settles: number;
  /** what the medium is at each MOMENT of one tick, named off the theory's own rule order */
  moments: { says: string; rho: number; folds: number }[];
  /**
   * AND HOW THE BEAT CHANGES WHERE SOMETHING IS OCCUPYING THE SPACE — because the period is a
   * LOCAL fact and not one number about the world.
   *
   * The cycle above is what an EMPTY vacuum does. It is not what the medium does everywhere:
   * a point with a ray on it is not neutral, so the split does not fire on it, so it does not
   * hand back what was folded into it either. That is not an exception to the rules, it is
   * the rules - "a body's cells are not neutral, so the split does not fire on them, and that
   * is the whole of gravity in this model: an expansion that DID NOT HAPPEN where something
   * was in the way" - and RAYS OCCUPY SPACE EXACTLY AS MATTER DOES.
   *
   * So the same uniform world is run again with a standing population in it, and what comes
   * back is the beat at each occupancy: how long its cycle is, whether the record settles, and
   * what it settles at. Read that column and the field round a body is not a surprise.
   */
  deviates: { held: number; period: number; folds: number; settles: boolean }[];
  /** the population at each tick of the cycle, in the units `\rho` is in */
  rho: number[];
  /** and what it has folded at each */
  folds: number[];
  /** nothing here was typed - this is what was watched */
  working: string[];
};

/** a state, as one number - so "the same state again" is a question that can be asked */
const alike = (xs: Float64Array[]): number => {
  let h = 0x811c9dc5 >>> 0;
  for (const x of xs) for (let i = 0; i < x.length; i++) {
    /* rounded, because a state that differs in the last bit of a float is the same state */
    const v = Math.round(x[i] * 1e6) | 0;
    h = Math.imul(h ^ (v & 0xff), 0x01000193) >>> 0;
    h = Math.imul(h ^ ((v >>> 8) & 0xff), 0x01000193) >>> 0;
    h = Math.imul(h ^ ((v >>> 16) & 0xff), 0x01000193) >>> 0;
    h = Math.imul(h ^ ((v >>> 24) & 0xff), 0x01000193) >>> 0;
  }
  return h;
};

/**
 * ONE UNIFORM WORLD, RUN FROM A GIVEN OCCUPANCY, AND WHAT ITS CYCLE COMES TO.
 *
 * `held` is how much of every way out is KEPT carrying - nought is the empty vacuum, and
 * anything above it is a medium something is continuously supplying, which is what a source
 * does to the space around it. It has to be kept rather than merely seeded: a standing
 * population laid down once is annihilated on the first tick and the world drops straight back
 * into the empty vacuum's own cycle, which says nothing about a place anything is occupying.
 *
 * NOTHING ELSE IS HELD. The rules are run and the state is watched for a repeat, exactly as
 * for the empty case - the only difference is that this one is not allowed to empty.
 */
const cycle = (o: any, N: number, until: number, held: number) => {
  const w = continuous({ ...o, N, wraps: true, twin: false, tags: 0 });
  const keep = () => {
    if (!held) return;
    for (let i = 0; i < w.n.length; i++) if (w.n[i] < held) w.n[i] = held;
  };
  keep();
  const seen = new Map<number, number>();
  const folds: number[] = [];
  const cells = N * N;
  for (let t = 0; t < until; t++) {
    const key = alike([w.n, w.foldsPerWay() ?? new Float64Array(0)]);
    const was = seen.get(key);
    let z = 0; for (let c = 0; c < cells; c++) z += w.ledger.folds?.[c] ?? 0;
    if (was !== undefined) {
      const over = folds.slice(was);
      return { period: t - was, folds: over.reduce((a, b) => a + b, 0) / (over.length || 1),
               settles: true };
    }
    seen.set(key, t); folds.push(z / cells);
    w.step(); keep();
  }
  /* it never came back to a state it had been in - so whatever it is doing, it is not a cycle
   * this long, and the record is reported as it stood rather than as a settled value */
  return { period: 0, folds: folds[folds.length - 1] ?? 0, settles: false };
};

export const rhythm = (o: {
  geometry: Lattice; theory: any; seed?: number; symbols?: Symbols;
  /** how big the uniform world is - three is the least that is not its own neighbour */
  N?: number;
  /** and how long to watch before giving up on it coming back */
  until?: number;
}): Beat => {
  const N = Math.max(3, o.N ?? 4), until = o.until ?? 512;
  /*
   * WRAPPED, BECAUSE THIS IS THE ONE QUESTION A TORUS IS THE RIGHT WORLD FOR. Everywhere else
   * in this file a box has an edge, because a ray that comes round the world lights a body from
   * behind. What is being asked here is what a medium with no edge and nothing in it does, and
   * "everywhere alike" is exactly what joining the faces means.
   */
  const w = continuous({ ...o, N, wraps: true, twin: false, tags: 0 });
  const seen = new Map<number, number>();
  const rho: number[] = [], folds: number[] = [];
  const cells = N * N;
  for (let t = 0; t < until; t++) {
    const key = alike([w.n, w.foldsPerWay() ?? new Float64Array(0)]);
    const was = seen.get(key);
    if (was !== undefined) {
      const period = t - was;
      /*
       * AND THE TICK IS OPENED UP, BECAUSE A TICK IS NOT AN INSTANT. `World.tick` runs the
       * rules IN THE ORDER THEY ARE DECLARED and flushes after each, so the medium is in a
       * different state at every one of those moments. Read only at the ends of a tick a beat
       * looks like a fixed point, and every `\rho_{\infty}` in this arc was read that way.
       */
      /* and the same world again with something standing in it - see `Beat.deviates` */
      const deviates = [0, 1, 4, 16].map(held =>
        ({ held, ...cycle(o, N, until, held) }));
      const inside = w.through(period || 1);
      const k = inside.length / (period || 1);
      const one = inside.slice(0, k);
      const rs = one.map(m => m.rho);
      const swing = Math.max(...rs) - Math.min(...rs);
      /*
       * AND THE MOMENT THINGS MOVE IS THE ONE EVERY RULE WAS HANDED, which is the tick's INPUT.
       *
       * One thing a tick: every rule reads the world the tick opened with, and what any of them
       * makes is the tick's output. So the record `turns` weighs a heading against is the one
       * standing at the START of the tick, not the one the tick's own meetings leave behind.
       *
       * IT WAS READING THE OUTPUT, matched by the word "transport" at the end of that moment's
       * name - which is the state AFTER everything, including the folds this tick just made. On
       * `G` that is the difference between `n_{f} = 0` and `n_{f} = DEG/2`, so it reported an
       * undisturbed vacuum as keeping a heading a fifth of the time when it in fact keeps it
       * ALL of the time. A medium that carries straight and one that scatters within a cell are
       * not the same medium, and how far anything reaches in it is the question that turned on
       * this number.
       */
      const move = one[0];
      return {
        period, settles: was, moments: one, deviates,
        rho: rho.slice(was), folds: folds.slice(was),
        working: [
          `run on a uniform ${o.geometry.name} world of ${N}x${N}, wrapped, from empty`,
          `read at the ENDS of a tick it comes back to itself after ` +
            `${period} tick${period === 1 ? "" : "s"}, having taken ${was} to get there`,
          ...one.map(m => `  through one tick - ${m.says}: \rho = ${m.rho.toFixed(4)}, ` +
            `n_{f} = ${m.folds.toFixed(4)}`),
          swing < 1e-9
            ? `and it is the same at every moment of a tick, so the medium is at rest and ` +
              `\rho_{\infty} is a number: ${rs[0].toFixed(4)}`
            : `and it is NOT the same at every moment of a tick - it swings by ` +
              `${swing.toFixed(4)}, from ${Math.min(...rs).toFixed(4)} to ` +
              `${Math.max(...rs).toFixed(4)}. THE MEDIUM HAS A BEAT, there is no one ` +
              `\rho_{\infty}, and the mean of what it goes round is a state it is never in`,
          ...deviates.map(d =>
            `  ${d.held === 0 ? "an EMPTY vacuum" : `every way KEPT at ${d.held} ray` +
              `${d.held === 1 ? "" : "s"}, as a source keeps the space round it`}: ` +
            (d.settles
              ? `period ${d.period}, and the record settles at n_{f} = ${d.folds.toFixed(3)}`
              : `NO cycle inside ${until} ticks - the record does not settle, and stood at ` +
                `n_{f} = ${d.folds.toFixed(3)}`)),
          `so the beat above is what an EMPTY vacuum does, and where anything is occupying the ` +
            `space it is not what the medium does at all - which is the mechanism and not a fault`,
          move === undefined ? `nothing in this theory carries anything anywhere`
            : `and at the moment things MOVE the record stands at ` +
              `n_{f} = ${move.folds.toFixed(4)}, so a heading survives a step ` +
              `${(1 / (1 + move.folds)).toFixed(4)} of the time` +
              (move.folds < 1e-9
                ? ` - ALL of it. An undisturbed medium carries straight, and what spreads in ` +
                  `it is only what is annihilated on the way`
                : ` - so an undisturbed medium is already diffusive and nothing reaches far`),
        ],
      };
    }
    seen.set(key, t);
    let r = 0, fz = 0;
    for (let c = 0; c < cells; c++) { r += w.rho(c); fz += w.ledger.folds?.[c] ?? 0; }
    rho.push(r / cells); folds.push(fz / cells);
    w.step();
  }
  return {
    period: 0, settles: until, moments: [], deviates: [], rho, folds,
    working: [`run on a uniform ${o.geometry.name} world of ${N}x${N} for ${until} ticks and ` +
      `it never came back to a state it had been in - so whatever it does, it is not a cycle ` +
      `this long`],
  };
};
