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
 * AND THERE IS ONE INTEGRATOR, NOT TWO, AND IT INTEGRATES THE LINE. There were two for a while
 * - one carrying moments and one carrying WHOLE RAYS ON A LATTICE'S EXITS - and the second is
 * gone, because it was not a reading of this equation at all. It indexed a population by EXIT
 * and stepped it by whole-cell offsets, so a ray's heading was an integer and there were `DEG`
 * of them: a point source came out as `DEG` beams and not a shell, measured at `max/mean 2.68`
 * in the exit directions with the sectors between them at NOUGHT. Everything that then went
 * wrong went wrong there - the field could not get out, a body caught its own light, and no
 * scheme fixed it, because a grid of points one `\bar{c}` apart HAS only eight directions in it
 * and that is the lattice, however it is dressed.
 *
 * `line` IS WHAT IS LEFT, AND IT READS THE TERMS AND NOTHING ELSE. `\hat{d}` is continuous and
 * sampled at a resolution; the tick is physical and the grid is not; and what a rule does
 * reaches the dynamics as its own term, gate, degree and kernel. No rule body is executed, no
 * lattice exit is walked, and there is nothing in it to disagree with the line above.
 */
import { add, d, div, Expr, field, grad, integrate, log, mul, num, pow, show as showE,
  simplify, sub, sym, numeric } from "../lib/Algebra.ts";
import { showCount, type Count } from "../lib/Language.ts";
import { Declared, degreeOf, facingOf } from "../lib/Rules.ts";
import { Geometry as Lattice } from "../lib/Local.ts";
import { emits } from "../lib/Source.ts";


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
   * AND WHAT AN OUTSIDE TERM PUTS IN, AS THE QUANTITY IT IS — the source's own declaration.
   *
   * `\Sigma` names where a term came from and not what it comes to, so a line whose only
   * inhomogeneous term is a bare `\Sigma` cannot be evaluated at all. A source declares what it
   * puts down where the source is defined - which is its MASS, since "mass is simply how many
   * of these rays we're able to emit" - and this carries it, so the line reads as a quantity
   * and an integrator has something to evaluate.
   */
  weighs?: Expr;
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
  /**
   * WHAT THE NAMES IN THE LINE COME TO — the definitions, printed under it rather than
   * substituted into it. Empty where nothing declared one.
   */
  defines(): string[];
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

    if (outside) {
      /*
       * AND AN OUTSIDE TERM IS WRITTEN AS WHAT IT PUTS IN, where the source says what that is.
       *
       * `\Sigma` names where a term CAME FROM - something outside the model put it there - and
       * that is worth saying, but it is not a quantity: a line whose only inhomogeneous term is
       * a bare symbol with no content cannot be evaluated, and every number that came out of one
       * came from a backend deciding for itself what a source injects.
       *
       * A SOURCE DECLARES ITS OWN, AND IT IS THE MASS. "Mass is simply how many of these rays
       * we're able to emit from a source" - so what a source contributes to the population is
       * `\bar{m}`, and `\bar{m}` has an equation. Where a source says so the term is written and
       * carried as that; where it says nothing this falls back to `\Sigma`, which is what a
       * theory that has not written its sources down deserves.
       */
      const weighs = doing.weighs;
      const gate = share
        ? (simplify(share).kind === "add" ? `\\paren{${showE(share)}}` : showE(share))
        : "";
      /*
       * AND IT IS NAMED RATHER THAN SUBSTITUTED, AND IT IS A SUM OVER WHAT WAS PUT IN.
       *
       * A source's contribution is its MASS, and a mass has a name - writing the whole of
       * `gravity.saturation` inline puts a definition where a quantity belongs and makes the
       * line unreadable at exactly the place a reader wants to see the shape. `\bar{m}` is the
       * quantity; what it comes to is its own equation, carried alongside on the term and
       * printed under the line.
       *
       * AND THERE IS ONE OF THEM PER BODY. `\Sigma` was one opaque term however many bodies were
       * in the box, so the line said nothing about how many there are - and the force law is
       * `\bar{m}\bar{m}'`, a PRODUCT over two of them, which a single lump cannot express. The
       * source term is the sum over what was put in, each at its own place, so a world of `N`
       * bodies is the same line with `N` terms in that sum and is solvable as such.
       */
      return {
        ...shape, rules: [] as string[], sign: 1 as const,
        ...(weighs ? { weighs } : {}),
        symbol: weighs
          ? `${gate}\\sum_{b}\\bar{m}_{b}\\delta\\paren{x - x_{b}}`
          : `${gate}${source}`,
        side: "right" as const,
      };
    }
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
  /*
   * AND THE ONE SOURCE TERM IS THE ONE THAT SAYS WHAT IT PUTS IN, not whichever rule mentioning
   * a source happens to be written first.
   *
   * There is one `\Sigma` in a line however many rules touch a source, and that is right. But
   * "the first one wins" is a tie-break, and it broke the wrong way: `G` declares `TRANSPORT`
   * before `EMISSION` because a body decides which one thing it does with its tick before it
   * does it, so the term kept was the one for a body MOVING - which declares nothing about what
   * it hands the world - and the one for a body SHINING, which carries the mass, was dropped.
   * The line then read `+ \Sigma`, a name with no quantity in it, and nothing could be evaluated
   * from it.
   *
   * SO THE ONE THAT DECLARES ITS CONTENT IS THE ONE THE LINE CARRIES. Still exactly one, and
   * still no rule of the medium among them; what changed is that a placeholder no longer wins
   * against a source that has said what it is worth.
   */
  const held: Term[] = [];
  for (const [name, rule] of Object.entries(theory.rules as Record<string, any>)) {
    if (!rule.declared) { opaque.push(name); continue; }
    for (const t of read(name, rule.declared, population, source)) {
      if (!t.rules.length) { held.push(t); continue; }
      terms.push(t);
    }
  }
  const put = held.find(t => t.weighs) ?? held[0];
  if (put) terms.unshift(put);

  return {
    theory: theory.name, population, terms, opaque,
    defines: () => terms.filter(t => t.weighs).map(t =>
      `\\bar{m}_{b} = ${showE(t.weighs!)}`),
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

/** the value of an expression in a given state, or a fallback where it says nothing */
export const val = (e: Expr | undefined, at: Symbols, fallback: number): number => {
  if (!e) return fallback;
  const v = numeric(e, at);
  return Number.isFinite(v) ? v : fallback;
};

/**
 * A COUNT LIKE `{n: 0, of: {DEG: 1}}`, AGAINST WHATEVER THE THEORY CALLED THOSE NAMES —
 * symbolic where it is a count of the medium, so `DEG` reaches the arithmetic as the number
 * the geometry has rather than as one written down here.
 */
const count = (c: { n: number; of?: Record<string, number> } | undefined, at: Symbols): number => {
  if (!c) return 0;
  let v = c.n;
  for (const [k, w] of Object.entries(c.of ?? {}))
    v += w * (k.split("·").reduce((x, part) => x * (at[part] ?? 1), 1));
  return v;
};

/* ═══════════════════════════════════════════════════════════════════════════════
 *
 * THE LINE ITSELF, INTEGRATED — the equation `continuum` read off the theory, and NOTHING
 * ELSE. No lattice, no exits, no rule bodies: the terms, and what they say.
 *
 * WHAT MAKES THIS AN INTERPRETER RATHER THAN AN IMPLEMENTATION. Everything below reads
 * `eq.terms`. A term carries its own rate, its own gate as an EXPRESSION, its degree in the
 * density, whether it is a facing pair, which side of the equals it sits, what it does to each
 * of the three ledgers, and — where it transports — the kernel that says how a heading turns.
 * There is no branch here on which theory it is, no rule picked out by name, and nothing
 * written down that a term does not say. Change a rule and the term changes and this follows.
 *
 * THE ONE THING TAKEN FROM THE RULES AND NOT FROM THE LINE IS THE COUNT OF MATCHES, and
 * `Rules.ts` states it: "A REWRITE FIRES ON EVERY MATCH IT HAS, ONCE A TICK... a rate is
 * therefore a count of the rewrite rather than a number anybody chose." For a point rule that
 * is once; for a facing pair it is how many pairs there ARE, which is the lesser of the two
 * populations facing each other. `\sigma F n\tilde{n}` is that count's mean-field reading and
 * overshoots on a whole tick — it takes `DEG^{2}` out of a population of `DEG` — so what is
 * integrated is the count the rule fires on.
 *
 * ═══ WHAT IS A RESOLUTION AND WHAT IS PHYSICS ═══════════════════════════════════════════
 *
 * `A` — how finely DIRECTION is resolved. The line is about `n(x, \hat{d})` and `\hat{d}` is
 *   continuous; `A` is where it is sampled. It is not a set of exits and no rule may see it.
 * `K` — how many cells make one `\bar{c}`. THE TICK IS PHYSICAL AND THE GRID IS NOT: "one
 *   thing a tick" is a rule, so the step is one tick; how finely space is written down is this
 *   backend's. A step is `K` cells along the heading, so where it lands is wrong by at most one
 *   cell in `K` — an error that VANISHES under refinement, which is what makes it a resolution.
 *   At `K = 1` a step must land on one of nine offsets whatever `A` is, and that is the lattice
 *   wearing a different name: it is why a grid of points at `\bar{c}` can only ever have eight
 *   directions in it, and why every scheme tried at `K = 1` put the beams back.
 *
 * NEITHER OF THEM MAY MOVE THE ANSWER, and that is the test this is written to pass rather
 * than an aspiration: refine `A` or `K` and what comes out is the same medium.
 */
export const line = (o: {
  theory: any; geometry: Lattice; N: number;
  /** how finely direction is sampled — a resolution */
  A?: number;
  /**
   * AND HOW FINELY TIME IS RESOLVED WITHIN A TICK — a resolution, like `A` and `K`.
   *
   * The line is a RATE equation: `\sigma F n\tilde{n}` is what the meetings do per unit time, not
   * what they do in one. Stepped a whole tick at once it takes `DEG^{2}` out of a population of
   * `DEG` - measured, the record ran away at `32, 56, 80, 104` a tick where the vacuum's own
   * balance is `DEG/2` - which is an unstable integrator and not a statement about the rules.
   *
   * SO THE REACTION IS SUB-STEPPED AND THE TRANSPORT IS NOT. `\bar{c}` is one cell a tick and
   * that is the model's; how finely the rates between are integrated is this backend's, and
   * refining it must not move the answer.
   */
  sub?: number;
  /** how many cells make one `\bar{c}` — a resolution */
  K?: number;
  seed?: number; symbols?: Symbols;
  /** how many populations are told apart, for a cross term */
  tags?: number;
}) => {
  const eq = continuum(o.theory);
  const g = o.geometry, DEG = g.DEG, N = o.N, cells = N * N;
  const A = Math.max(8, (o.A ?? 96) & ~1), K = Math.max(1, o.K ?? 4);
  /*
   * AND A TICK IS A TICK: "A REWRITE FIRES ON EVERY MATCH IT HAS, ONCE A TICK", so the rates
   * are counts of matches and one tick is one firing. `sub` is kept for refining a theory whose
   * terms really are rates against continuous time; for `G` it is one, and has to be - sub-
   * stepping a rewrite would fire it a fraction of a time, which is not a thing it can do.
   */
  const S = Math.max(1, o.sub ?? 1), dt = 1 / S;
  const T = o.tags ?? 0;
  const ANG = Array.from({ length: A }, (_, a) => 2 * Math.PI * a / A);
  const UX = ANG.map(Math.cos), UY = ANG.map(Math.sin);
  const OPP = (a: number) => (a + A / 2) % A;

  /*
   * THE STATE THE LINE IS ABOUT, AND IT IS THE LINE THAT SAYS WHAT IT IS. `n` is the
   * population per point per direction — a DENSITY in `\hat{d}`, normalised so that its mean
   * over the directions is the rays standing at the point, which is what makes every count
   * below free of `A`. The ledgers are whichever ones the terms actually move.
   */
  const n = new Float64Array(cells * A), was = new Float64Array(cells * A);
  const ledgers = new Set<string>();
  for (const t of eq.terms) {
    if (count(t.rayCount as any, { DEG })) ledgers.add("rays");
    if (count(t.spaceCount as any, { DEG })) ledgers.add("space");
    if (count(t.foldCount as any, { DEG })) ledgers.add("folds");
  }
  const ledger: Record<string, Float64Array> = {};
  for (const l of ledgers) ledger[l] = new Float64Array(cells);
  const destroyed = new Float64Array(cells);

  /**
   * AND HOW MUCH OF THAT DESTRUCTION IS ONE BODY'S RAY AGAINST ANOTHER'S — the cross term the
   * force law is a PRODUCT for, which cannot be drawn from a total.
   *
   * "A single body cannot have gravity - its rays need something to annihilate against - so the
   * force law is `\bar{m}\bar{m}'` and the long-range channel is MEETINGS between two bodies'
   * radiation. That is a cross term, and a cross term cannot be drawn from a total: it needs the
   * two halves kept apart." That is what the tags are for, and this is the quantity they were
   * being kept for: of the meetings that happened here, the share that was one tag against the
   * other. Nothing new fires - it is the SAME event, asked whose rays were in it.
   *
   * IT IS NOUGHT UNTIL THE TWO FIELDS OVERLAP, by construction rather than by a threshold, and
   * the region where they do is a lens that first touches at the midpoint - each field having
   * gone half the separation - and opens from there at `\bar{c}`.
   */
  const crossed = new Float64Array(cells);
  const tag: Float64Array[] = Array.from({ length: T }, () => new Float64Array(cells * A));
  const tagWas: Float64Array[] = Array.from({ length: T }, () => new Float64Array(cells * A));
  const blocks = new Uint8Array(cells);

  const at = (x: number, y: number) =>
    x < 0 || y < 0 || x >= N || y >= N ? -1 : y * N + x;
  /**
   * WHERE ONE `\bar{c}` ALONG A HEADING LANDS — `K` cells, and the grid rounds where that is.
   * The tick is physical and the grid is not, so the error is one cell in `K` and goes as `K`
   * is refined; at `K = 1` there are nine places to go whatever `A` is, and that is a lattice.
   */
  /* one `\bar{c}` along each heading, in whole cells - a constant of the direction, so it is
   * worked out once rather than a million times a tick */
  const DX = Int32Array.from(UX, u => Math.round(K * u));
  const DY = Int32Array.from(UY, u => Math.round(K * u));
  /**
   * ═══ AND A STEP IS ONE `\bar{c}` ALONG THE HEADING, NOT ALONG THE NEAREST GRID OFFSET ═══
   *
   * `round(K cos t), round(K sin t)` is a whole number of cells and there are only about
   * `pi K^2` distinct ones - twenty-eight at `K = 3`. Left fixed, every direction takes the SAME
   * offset on every tick for ever, so a bin travels along a rational slope rather than along its
   * own heading and the population collects onto those few slopes: the field leaves a body ROUND
   * and turns into a fan of BEAMS over the next hundred ticks. Refining `A` cannot fix it,
   * because the beams are the OFFSETS and not the bins.
   *
   * SO EACH DIRECTION KEEPS WHAT IT IS OWED and the whole part of that is the step it takes; the
   * remainder is under half a cell and rides to the next tick. A heading's mean displacement is
   * then exactly `K cos t, K sin t` however the individual steps round, which is the straight
   * line the heading names - the grid only says where it is written down.
   */
  const owedX = new Float64Array(A), owedY = new Float64Array(A);
  const aim = () => {
    for (let a = 0; a < A; a++) {
      owedX[a] += K * UX[a]; owedY[a] += K * UY[a];
      const sx = Math.round(owedX[a]), sy = Math.round(owedY[a]);
      owedX[a] -= sx; owedY[a] -= sy;
      DX[a] = sx; DY[a] = sy;
    }
  };
  const hop = (c: number, a: number) => {
    const x = c % N, y = (c - x) / N;
    return at(x + DX[a], y + DY[a]);
  };
  /** the rays standing at a point — the mean over directions, so `A` cannot reach it */
  const held = (src: Float64Array, c: number) => {
    let s = 0; for (let a = 0; a < A; a++) s += src[a * cells + c];
    return s / A;
  };
  /**
   * ═══ `n` IS AN OCCUPANCY PER WAY, WHICH IS WHAT MAKES `n\tilde{n}` AND `\min` ONE THING ═══
   *
   * A way out holds nought or one ray - `stack` settles it, measured: "one ray to a way and it
   * bounces between nought and nine and stays there... the rule says the record settles; it
   * settles in one reading and not the other". So the population on a way is a NUMBER BETWEEN
   * NOUGHT AND ONE, and `n(x, \hat{d})` is that occupancy - which is exactly what `\rho` is a
   * share OF, so the two are one quantity read at one point rather than two.
   *
   * AND THEN THE LINE'S ARITHMETIC IS THE MATCH COUNT, EXACTLY. `\sigma F n\tilde{n}` on values in
   * `[0, 1]` IS the number of facing pairs: at full occupancy it is one, which removes precisely
   * the one ray that is there, and a rewrite that fires once per match per tick is integrated by
   * stepping one tick. Held as a COUNT of up to `DEG` instead, the same product came to `DEG^{2}`
   * against a population of `DEG` - eight times more meetings than there are rays - so the record
   * ran away at `32, 56, 80, 104` a tick and the whole thing had to be sub-stepped to stay
   * finite. That was never the term being wrong; it was a density in the wrong units.
   *
   * SO THE BEAT FOLLOWS FROM THE RULES, and it follows from the ARITHMETIC rather than from a
   * special case: every way is lit, so every facing pair is a match, so every one of them
   * annihilates, and the point is empty the tick after. One and nought, for ever.
   */
  const rho = (c: number) => held(n, c);

  const sym: Symbols = { DEG, ...(o.symbols ?? {}) };
  for (const t of eq.terms) if (t.rate) sym[t.rate] = 1;
  const local: Symbols = { ...sym };
  const here = (c: number): Symbols => {
    /*
     * the same occupancy the readout is in - a gate and a reading of one quantity cannot be
     * in two units, and `\rho` IS the share of a point's ways that are carrying.
     *
     * AND IT IS TAKEN FROM THE SWEEP, not counted down the direction axis here. The state is
     * held one direction at a time, so asking a place what it carries strides the whole array -
     * and a gate is asked of every place, so that is a cache miss per way per place per tick.
     * Measured, this one read was 233 ms of a 260 ms tick. `sweep` has already accumulated the
     * same number one plane at a time, sequentially, for nothing.
     */
    local["\\rho"] = blocks[c] ? 1 : RHO[c];
    if (ledger.folds) local["n_{f}"] = ledger.folds[c];
    return local;
  };

  /* what each term is, worked out once - it is the same at every point */
  const acting = eq.terms.filter(t => t.side === "right").map(t => ({
    t, facing: t.facing,
    rate: t.rate ? (sym[t.rate] ?? 1) : 1,
    dRays: count(t.rayCount as any, sym),
    dSpace: count(t.spaceCount as any, sym),
    dFolds: count(t.foldCount as any, sym),
    /* a term with no rule behind it is what something outside the model puts in */
    outside: !t.rules.length,
  }));
  /* and the one that carries, with the kernel that says how a heading turns */
  const carried = eq.terms.find(t => t.side === "left" && t.operator
    && !/partial_\{t\}/.test(t.operator));
  /** WHICH FIELD THE TURN LEANS ON, read off the kernel rather than chosen here */
  const leansOn = (e: any): string | undefined =>
    !e ? undefined : e.kind === "grad" && e.of?.kind === "field" ? e.of.name
      : e.of ? (Array.isArray(e.of) ? e.of.map(leansOn).find(Boolean) : leansOn(e.of))
      : undefined;
  const bendsBy = leansOn(carried?.kernel?.drifts);
  const bend = (c: number) =>
    bendsBy === undefined ? 0 : bendsBy === "\\rho" ? rho(c) : ledger.folds?.[c] ?? 0;

  /* THE SOURCES — what was put into the box from outside, which is what `\Sigma` is */
  /**
   * A HOLE — point-like, joined on to the space by `ways` of them, and what it weighs is what
   * it hands each: `\bar{m} = \bar{m}_{x}\cdot ways`. Nothing about an extent is in it.
   */
  type Hole = {
    x: number; y: number; mx: number; ways: number; tag?: number;
    moves?: boolean; px?: number; py?: number;
    /** whether it spent this tick getting somewhere, and how many ticks went that way -
     *  `\beta` is the share, which is the mass/velocity tradeoff the article states */
    stepped?: boolean; moved?: number;
    /** what it picks under its own ceiling, PER WAY OUT - `l.choose`, which is `(G/S.1)` and
     *  the one freedom a source has. Absent is the flat choice: every way at the ceiling. */
    chooses?: (d: number, tick: number) => number;
    /** which way it went on the tick just gone, which is the one way it may not light */
    along?: number;
    /** how far it has got toward the next `\bar{c}`, which is what a step spends */
    ax?: number; ay?: number;
  };
  const holes: Hole[] = [];
  let t = 0;
  /*
   * THE VACUUM'S OWN DENSITY, MEASURED — `\rho` in the mass equation, and not a number.
   *
   * `gravity.saturation` is written against the state the medium is in, so `\rho` there is what
   * the vacuum comes to and this has to be told by running it. `G`'s vacuum BEATS - every point
   * splits, then every point annihilates - so the instantaneous occupancy is one or nought and
   * neither of those is what the equation means: at `\rho = 0` the mass is infinite and at
   * `\rho = 1` it is nought. What the aggregate comes to is the mean over the cycle, which is
   * what a rate against a beating medium is, and this averages it as it goes.
   */
  let ambient = 0.5, seen = 0;
  /* the tick's buffers, made once - a fresh one per tick is allocation, not physics */
  const dN = new Float64Array(cells * A);
  const out = new Float64Array(cells * A);
  const outTag: Float64Array[] = Array.from({ length: T }, () => new Float64Array(cells * A));

  /*
   * AND THE VON MISES RECONSTRUCTION IS GONE, because the rule states its own draw.
   *
   * Two moments do not fix a distribution, so fitting the maximum-entropy law to them was a
   * reasonable thing to do and the wrong thing to do: `turns` says what leaves a place -
   * "carry straight on with weight ONE and take a folded way with the weight that way was
   * folded" - which is a spike and a spread, not a bell. Reconstructing it cost `O(A^{2})`,
   * spreading every way over every other, where the rule is one pass over a place's ways -
   * measured, 230 ms of a 260 ms tick against 48 ms for the draw as written.
   */


  /**
   * ═══ WHAT A SOURCE WEIGHS — EVALUATED OFF THE TERM, NOT WORKED OUT HERE ═════════════════
   *
   * The source declares what it puts in as an EXPRESSION, where the source is defined, and the
   * reading carries it onto the term as `weighs`. So this looks the term up, builds the state
   * the expression is asked in, and evaluates it. There is no equation written in this file:
   * change the mass where a source states it and this follows.
   */
  const Σ = acting.find(fx => fx.outside && fx.t.weighs)?.t;
  const beta = (h: Hole) => t > 0 ? Math.min(1, (h.moved ?? 0) / t) : 0;
  const asked: Symbols = { ...sym };
  const mass = (h: Hole) => {
    if (!Σ?.weighs) return Math.max(1e-12, h.mx * h.ways);   /* a theory that has not said */
    asked["l.choose"] = 1;   /* the pattern is asked per way, where it is applied */
    asked["\\bar{m}_{x}"] = h.mx;
    asked["l.DEG"] = h.ways;
    asked["\\beta"] = beta(h);
    asked["\\rho"] = Math.min(0.999, Math.max(1e-6, ambient));
    /* a rate of this model is one per match per tick, and `F` is the pairing this walks */
    for (const k of ["\\sigma", "F"]) if (!(k in asked)) asked[k] = 1;
    return Math.max(1e-12, val(Σ.weighs, asked, h.mx * h.ways) * val(Σ.share, asked, 1));
  };

  /* one row for the tag shares, written per bin - a fresh array per bin is allocation */
  const share = new Float64Array(Math.max(1, T));
  const POOLTS: Float64Array[] = Array.from({ length: T }, () => new Float64Array(cells));

  /**
   * ═══ WHAT EACH PLACE IS CARRYING, SWEPT ONE DIRECTION AT A TIME ═════════════════════════
   *
   * `\rho` at a place is the mean over its ways, which reads DOWN the direction axis - and with
   * the state held one direction at a time that stride is the whole array. Accumulated the other
   * way round, one direction's plane at a time, every read is sequential and the whole thing
   * costs one pass instead of `cells` scattered ones.
   */
  const RHO = new Float64Array(cells);
  const KEEP = new Float64Array(cells);
  /* what turned at a place, waiting to be handed to its ways - see the draw in `carry` */
  const POOLS = new Float64Array(cells);
  const GX = new Float64Array(cells), GY = new Float64Array(cells);
  /* how far it leans and which law it leans by - facts about the PLACE, so they are worked out
   * once for it and not once for every way out of it */
  const GM = new Float64Array(cells);
  const sweep = (src: Float64Array) => {
    RHO.fill(0);
    for (let a = 0; a < A; a++) {
      const base = a * cells;
      for (let c = 0; c < cells; c++) RHO[c] += src[base + c];
    }
    for (let c = 0; c < cells; c++) RHO[c] /= A;
  };

    /**
     * ═══ ONE DIRECTION AT A TIME, SWEEPING PLACES IN ORDER ═════════════════════════════════
     *
     * The state is held direction-major - `n[a·cells + c]` - so one direction is a contiguous
     * plane and a step along it is that plane shifted by a constant offset. Walked the other way
     * round, a place's ways stride the whole array and every read is a cache miss: measured, an
     * EMPTY vacuum cost 368 ms a tick where the arithmetic is a comparison and an add, because
     * the run was memory-bound rather than arithmetic-bound.
     *
     * NOTHING ABOUT THE PHYSICS IS IN THIS. It is the same numbers in a different order, and the
     * vacuum, the field and the mass come out identical - which is the check that it is a layout
     * and not a change.
     */
  const react = () => {
      sweep(was);
      for (const fx of acting) {
        if (fx.outside) continue;                  /* `\Sigma` is the holes, laid down below */
        /*
         * AND A SHARE IS A FRACTION, WHICH IS WHAT THE WORD MEANS — `Term.share` is "what
         * fraction of its matches this condition lets through", so it lies in `[0, 1]`. `busy`
         * says the same thing exactly: a point with anything on it is not neutral, so the split
         * does not fire there, and `\paren{1 - \rho}^{DEG}` is that condition's ensemble reading.
         */
        /*
         * AND A GATE IS A FUNCTION OF THE STATE, SO IT IS TABULATED RATHER THAN RE-WALKED.
         *
         * `t.share` is an EXPRESSION and evaluating it means walking that tree - which is right,
         * and is how a gate written in anything at all reaches the dynamics without this knowing
         * what it says. But it depends on the place only through `\rho` and `n_{f}`, so the same
         * two numbers give the same answer wherever they occur: walked per cell per term per
         * tick it was sixty thousand tree walks a tick for a few hundred distinct answers.
         *
         * TABULATING A PURE FUNCTION IS NOT A CHANGE TO IT. The expression is still the theory's,
         * still evaluated by the same `val`, and still whatever the rule says - only it is asked
         * once per distinct state instead of once per place.
         */
        const FIRE = new Float64Array(cells);
        const memo = new Map<number, number>();
        for (let c = 0; c < cells; c++) {
          const key = blocks[c] ? -1
            : Math.round(RHO[c] * 4096) * 8192 + Math.round((ledger.folds?.[c] ?? 0) * 64);
          let share = memo.get(key);
          if (share === undefined) {
            share = Math.min(1, Math.max(0, val(fx.t.share, here(c), 1)));
            memo.set(key, share);
          }
          FIRE[c] = share > 0
            ? fx.rate * share * dt * (fx.t.degree ? Math.pow(RHO[c], fx.t.degree) : 1)
            : 0;
        }
        if (fx.facing) {
          /*
           * A FACING PAIR — a ray AND what is coming the other way ACROSS AN EDGE, which is what
           * makes the term quadratic and gives it its `F`. Two rays at one place on opposite
           * headings have already crossed and are moving apart; the pair is this bin here and
           * the facing bin one `\bar{c}` along it, which are approaching.
           *
           * AND EACH EDGE IS WALKED FROM BOTH OF ITS ENDS, so each visit carries half of what
           * the event does - a walk that offers one meeting twice must halve it.
           */
          for (let a = 0; a < A; a++) {
            const base = a * cells, back = OPP(a) * cells;
            const dx = DX[a], dy = DY[a], off = dy * N + dx;
            for (let y = 0; y < N; y++) {
              const ty = y + dy;
              if (ty < 0 || ty >= N) continue;
              for (let x = 0; x < N; x++) {
                const tx = x + dx;
                if (tx < 0 || tx >= N) continue;
                const c = y * N + x, to = c + off;
                const i = base + c, j = back + to;
                const pairs = was[i] * was[j] * FIRE[c];
                if (pairs <= 0) continue;
                dN[i] += pairs * fx.dRays / 4;
                dN[j] += pairs * fx.dRays / 4;
                /* an event per way of the point, its `DEG` ways spread over `A` bins, halved
                 * again because the edge is walked from both of its ends */
                const ev = pairs * DEG / A / 4;
                if (ledger.space) { ledger.space[c] += ev * fx.dSpace; ledger.space[to] += ev * fx.dSpace; }
                if (ledger.folds) {
                  ledger.folds[c] = Math.max(0, ledger.folds[c] + ev * fx.dFolds);
                  ledger.folds[to] = Math.max(0, ledger.folds[to] + ev * fx.dFolds);
                }
                destroyed[c] += Math.abs(ev * fx.dSpace); destroyed[to] += Math.abs(ev * fx.dSpace);
                /* and whose rays were in it - the same meeting, asked a second question */
                if (T >= 2 && was[i] > 0 && was[j] > 0) {
                  const ai = tagWas[0][i] / was[i], bi = tagWas[1][i] / was[i];
                  const aj = tagWas[0][j] / was[j], bj = tagWas[1][j] / was[j];
                  const q = pairs * (ai * bj + bi * aj) * DEG / A / 4;
                  crossed[c] += Math.abs(q * fx.dSpace); crossed[to] += Math.abs(q * fx.dSpace);
                }
              }
            }
          }
          continue;
        }
        /*
         * AND A RULE ABOUT A POINT FIRES ONCE ON IT — what it makes is spread over every
         * direction there is, so `dRays` rays over the point's `DEG` ways is that much occupancy
         * on each of them, however finely direction is written down.
         */
        for (let a = 0; a < A; a++) {
          const base = a * cells, per = fx.dRays / DEG;
          for (let c = 0; c < cells; c++) if (FIRE[c] > 0) dN[base + c] += FIRE[c] * per;
        }
        for (let c = 0; c < cells; c++) {
          const fires = FIRE[c];
          if (fires <= 0) continue;
          if (ledger.space) ledger.space[c] += fires * fx.dSpace;
          if (ledger.folds) ledger.folds[c] = Math.max(0, ledger.folds[c] + fires * fx.dFolds);
        }
      }
    };

  /**
   * ═══ THE TRANSPORT, AS ITS OWN FUNCTION — which is worth thirty times its own weight ═════
   *
   * It was written inline in `step`, and `step` is the whole tick: every term, every source,
   * every ledger, with a nested function declaration in the middle of it. V8 will not optimise
   * a function that large, so the hottest loop in the model ran interpreted - measured, the same
   * loop over the same arrays costs 10 ms a tick written on its own and 271 ms a tick written
   * inside `step`. Nothing about it changed but where it lives.
   */
  /**
   * WHAT THE MEDIUM IS DOING AT EACH PLACE — the kernel's two moments and the law they pick,
   * worked out once for the place before anything is carried.
   *
   * KEPT APART FROM THE LOOP THAT USES IT, and that is worth twenty times the loop's own weight.
   * This half reads expressions off the terms - `val`, optional chaining, a map of laws - and a
   * function that does both that and a tight sweep over a million elements is optimised for
   * neither: V8 gives up on the whole thing. Split, the sweep is a sweep and this is asked once
   * per place, which is what each of them is.
   */
  const settle = () => {
    sweep(was);
    for (let c = 0; c < cells; c++) {
      KEEP[c] = carried?.kernel
        ? Math.min(1, Math.max(0, val(carried.kernel.keeps, here(c), 1))) : 1;
      const x = c % N, y = (c - x) / N;
      const xm = at(x - 1, y), xp = at(x + 1, y), ym = at(x, y - 1), yp = at(x, y + 1);
      GX[c] = ((xp >= 0 ? bend(xp) : 0) - (xm >= 0 ? bend(xm) : 0)) / 2;
      GY[c] = ((yp >= 0 ? bend(yp) : 0) - (ym >= 0 ? bend(ym) : 0)) / 2;
      GM[c] = Math.sqrt(GX[c] * GX[c] + GY[c] * GY[c]);
    }
    /*
     * AND THE TRANSPORT SWEEPS ONE DIRECTION AT A TIME. For a heading that survives the place
     * whole - which is undisturbed space and most of any box - the law is a spike, the target
     * bin is the heading itself, and the whole plane moves by one constant offset: reads and
     * writes both sequential, which is what makes this run at any resolution.
     */
  };

  const carry = () => {
    /*
     * AND EVERY ARRAY IT TOUCHES IS TAKEN INTO A LOCAL FIRST.
     *
     * These live in the closure `line` builds, and a closure variable read in a hot loop is a
     * context lookup rather than a register: V8 will not treat it as a constant, so every
     * `out[j] += m` reloads `out` before it can index it. The same loop over the same arrays
     * costs 10 ms a tick with the arrays as locals and 251 ms with them in the closure - the
     * arithmetic is identical and the difference is entirely in the lookup.
     */
    const OUT = out, WAS = was, DN = dN, TAGS = tag, OUTTAGS = outTag, SHARE = share;
    const KP = KEEP, GMM = GM, GXX = GX, GYY = GY, POOL = POOLS, POOLT = POOLTS;
    const dxs = DX, dys = DY, uxs = UX, uys = UY;
    const nT = T, nA = A, nN = N, nCells = cells;
    /*
     * WHAT THE MEDIUM IS DOING AT EACH PLACE, WORKED OUT ONCE — the kernel's two moments are a
     * fact about the place, not about the way; only the law's CENTRE moves with the heading.
     */
    settle();
    /*
     * ═══ THE DRAW ITSELF: STRAIGHT ON WITH WEIGHT ONE, OR A FOLDED WAY ══════════════════════
     *
     * `turns` says it in one line - "carry straight on with weight ONE and take a folded way
     * with the weight that way was folded" - so what leaves a place is a SPIKE on the heading
     * plus a share spread over the ways it was folded. `keeps = 1/(1 + n_{f})` is the spike's
     * weight, which is the kernel's first moment; `\nabla n_{f}` is where the folded ways lie on
     * average, which is its second. Both are used and neither is invented.
     *
     * AND IT IS LOCAL AND O(A) PER PLACE, which is what a rule of this model has to be. Fitting
     * a von Mises law to the same two moments spread every way over every other way - `W = 63`
     * bins at `n_{f} = 1.8`, so the transport was quadratic in the direction resolution and cost
     * 230 ms of a 260 ms tick. A place's ways are its own and what it hands them is one pass
     * over them: every cell is independent, every direction is independent, and nothing here
     * reads anything but the place it is standing on.
     */
    POOL.fill(0);
    for (let z = 0; z < nT; z++) POOLT[z].fill(0);
    for (let a = 0; a < nA; a++) {
      const base = a * nCells;
      for (let y = 0; y < nN; y++) for (let x = 0; x < nN; x++) {
        const c = y * nN + x, i = base + c;
        const m = Math.max(0, WAS[i] + DN[i]);
        if (m <= 1e-14) continue;
        const keeps = KP[c];
        /* what does not carry on goes down the ways this place was folded, which is a share of
         * the place and not of the way - gathered here and handed out below */
        const turned = m * (1 - keeps);
        if (turned > 0) {
          POOL[c] += turned / nA;
          for (let z = 0; z < nT; z++) {
            const sv = TAGS[z][i];
            if (sv > 0) POOLT[z][c] += turned * Math.min(1, sv / m) / nA;
          }
        }
        const kept = m * keeps;
        if (kept <= 0) continue;
        /*
         * AND THE HEADING THAT CARRIES ON LEANS BY WHERE THE FOLDS ARE — the kernel's other
         * moment, bounded by what did not survive, so a place that keeps everything bends
         * nothing and a place that keeps nothing has no heading left to bend.
         */
        let f = a;
        const gm = GMM[c];
        if (gm > 0 && keeps < 1) {
          const mx = keeps * uxs[a] + (1 - keeps) * (GXX[c] / gm);
          const my = keeps * uys[a] + (1 - keeps) * (GYY[c] / gm);
          f = Math.atan2(my, mx) / (2 * Math.PI) * nA;
        }
        /*
         * AND A BENT HEADING IS SHARED BETWEEN THE TWO BINS IT FALLS BETWEEN, not rounded into
         * one. A heading is continuous and the bins are only where it is written down, so
         * rounding is the same fault as rounding the step was, one level up: with a lean of any
         * size MANY headings round into the SAME bin and pile up there, and that pile is a beam
         * which grows with every tick. The falloff survives - rounding creates nothing - while
         * the angular shape collects onto a few directions, which is a structure that appears
         * over time out of a picture that started smooth.
         */
        const lo = Math.floor(f), fr = f - lo;
        for (let q = 0; q < 2; q++) {
          const w = q === 0 ? 1 - fr : fr;
          if (w <= 0) continue;
          const b = ((((lo + q) % nA) + nA) % nA);
          const tx = x + dxs[b], ty = y + dys[b];
          if (tx < 0 || ty < 0 || tx >= nN || ty >= nN) continue;
          const j = b * nCells + ty * nN + tx;
          OUT[j] += kept * w;
          for (let z = 0; z < nT; z++) {
            const sv = TAGS[z][i];
            if (sv > 0) OUTTAGS[z][j] += kept * w * Math.min(1, sv / m);
          }
        }
      }
    }
    /* and what turned goes down every way the place has, one pass over them */
    for (let b = 0; b < nA; b++) {
      const dx = dxs[b], dy = dys[b];
      for (let y = 0; y < nN; y++) {
        const ty = y + dy;
        if (ty < 0 || ty >= nN) continue;
        for (let x = 0; x < nN; x++) {
          const tx = x + dx;
          if (tx < 0 || tx >= nN) continue;
          const c = y * nN + x, p = POOL[c];
          if (p <= 0) continue;
          const j = b * nCells + ty * nN + tx;
          OUT[j] += p;
          for (let z = 0; z < nT; z++) if (POOLT[z][c] > 0) OUTTAGS[z][j] += POOLT[z][c];
        }
      }
    }

  };

  const step = () => {
    aim();
    was.set(n);
    for (let i = 0; i < T; i++) tagWas[i].set(tag[i]);
    destroyed.fill(0); crossed.fill(0);
    out.fill(0);
    for (const o of outTag) o.fill(0);
    /*
     * ═══ THE RATES ARE INTEGRATED OVER THE TICK, IN `S` STEPS ═══════════════════════════
     *
     * Each sub-step reads the state IT opened with and advances it by `dt`, which is what
     * integrating a rate means. `\Sigma` and the transport happen once a tick, because those
     * are the model's own: a source acts once per tick and `\bar{c}` is one cell a tick.
     */
    for (let sc = 0; sc < S; sc++) {
      was.set(n);
      dN.fill(0);
      react();
      for (let i = 0; i < n.length; i++) n[i] = Math.max(0, n[i] + dN[i]);
    }
    was.set(n);
    dN.fill(0);

    /* ── what the terms do, at every point, read on the world the sub-step opened with ── */
    /* ── `\Sigma`: a hole hands what it puts down to the space one `\bar{c}` around it ── */
    for (const h of holes) {
      /*
       * ═══ AND A POINT HANDS BACK ONE FOLD PER WAY IT LIGHTS ══════════════════════════════
       *
       * `(G/2)` is `seq(unfold(point), each(exits(point), light))`: a point gives back a point
       * of space and then lights every way it has. `unfold` takes ONE off each way, so what
       * comes back is exactly as many folds as there are ways being lit - `DEG` for a point of
       * the vacuum, and `\bar{m}_{x}\cdot ways` for a hole, which lights that many.
       *
       * THE RATE IS THE SAME RATE, AND THAT IS THE WHOLE POINT: a body is not some other kind
       * of thing, its places are spatial points like any other, and what they hand back is what
       * a point hands back - one per way lit. It is only that a hole HAS more ways.
       *
       * A FLAT `DEG` IS THE WRONG READING OF THE SAME SENTENCE. Tried, and the arithmetic says
       * why it cannot hold: in the vacuum a splitting makes `DEG` rays and the `DEG/2` meetings
       * they cause fold `DEG/2`, against `DEG` returned - it settles. Beside a hole putting down
       * `\bar{m}_{x}\cdot ways` the meetings are of that order too, and `DEG` of return against
       * hundreds of folds made is no balance at all: measured, `n_{f}` under a held body climbed
       * `195 -> 610 -> 1123 -> 1620` over thirty ticks, about fifty a tick and going, so
       * `keeps` sat at `0.001` and the body's heading was a fresh draw every tick.
       */
      /*
       * AND THE SPACE COMES BACK WHERE ITS WAYS REACH, NOT INSIDE THE HOLE. `unfold` takes one
       * off each WAY and a way is an edge to a neighbour, so the return lands on the space the
       * hole is joined to. The hole itself is not a place the medium models - it is where space
       * was taken FROM. Returned at its own cell it scrubbed the record flat there, which is
       * gravity switched off: measured, a test body eight c-bar from a heavy one sat at
       * `n_{f} = 0` with `keeps = 1`, so `turns` had nothing to lean on and it did not move.
       */
      /*
       * AND A BODY THAT SPENT ITS TICK GETTING SOMEWHERE HAS NONE LEFT TO SHINE WITH — which is
       * the `\paren{1 - \beta}` the line already carries on `\Sigma`, and not a rule added here.
       *
       * One action a tick, moving or shining and not both. A body at rest shines on every tick;
       * one crossing a cell every other tick shines on half of them, and `\beta` is the share of
       * its ticks that went on moving. That is where a moving source's shift comes from, and it
       * is why a body cannot outrun its own field: the faster it goes the less it emits.
       */
      if (!h.stepped) h.along = undefined;
      h.stepped = false;
      /*
       * AND THE POINT THAT LIGHTS ITS WAYS HANDS BACK A FOLD ON EACH — `(G/2)` is
       * `seq(unfold(point), each(exits(point), light))`, and the unfold is AT THE POINT that
       * does the lighting. A hole lighting `ways` of them is that same act, so it hands back
       * `ways` where it stands.
       *
       * A SOURCE'S PLACE IS NEVER NEUTRAL, so `(G/2)` cannot fire there and nothing else was
       * ever going to return them. Left to climb, `keeps = 1/(1 + n_{f})` at the body's own
       * cell goes to nought - and then the lean below REPLACES the heading rather than bending
       * it, so what a body carries is a fresh draw from the record every tick. Measured on
       * `gravity.pull`, that is exactly what happened: `p` flipped end over end between
       * samples - `(510, 0)`, `(35, 502)`, `(16, -468)`, `(-11, 471)` - so nothing could hold a
       * heading long enough to earn a cell, and a pair thrown past each other never moved.
       *
       * SO A BODY CAN COAST, which is the whole of what this buys: with the record where it
       * stands held down, `keeps` is near one, the lean is a small correction to the heading it
       * already has, and a thing with momentum and no force keeps going.
       */
      for (let a = 0; a < A; a++) {
        const cx = Math.round(h.x + K * UX[a]), cy = Math.round(h.y + K * UY[a]);
        const c = at(cx, cy);
        if (c < 0) continue;
        /*
         * AND WHETHER THIS WAY FIRES IS THE MODEL'S OWN QUESTION, ASKED WHERE IT IS ANSWERED.
         *
         * `emits` in `Source.ts` is the single restriction the model makes - a way out cannot be
         * lit on the tick the body moved ALONG it - times whatever the source chose to put down
         * that way. Both are the source's business and neither is this file's, so this asks and
         * does not decide: a source with a pattern of its own is honoured without this knowing
         * what the pattern is, and the restriction is stated once for every backend.
         */
        const share = emits({ mx: 1, ways: A, chooses: h.chooses } as any, a, t, h.along);
        if (!(share > 0)) continue;
        /*
         * AND WHAT IT PUTS ON A WAY IS AN OCCUPANCY, WHICH IS WHAT `n` IS.
         *
         * `\bar{m}` is how many rays it sends over ALL its ways; a way itself holds nought or
         * one, so what stands on one of them is `\bar{m}/ways` - the share of its ways that are
         * lit, which is `\bar{m}_{x}\paren{1 - \beta}` under the flat choice and is never more
         * than one, because a way lit every tick is `\bar{c}` and the ceiling.
         *
         * IT WAS PUTTING `\bar{m}` ITSELF ON EVERY WAY - two thousand where the most a way can
         * hold is one - so the medium round a body carried thousands of times what it can, and
         * the record went with it: `n_{f}` reached `5\cdot10^{5}` a cell out where the vacuum's
         * own balance is `DEG/2`. That is the mass in the wrong units, not a bright body.
         *
         * AND A HOLE'S WEIGHT IS STILL ITS WAYS, which is where it goes: `\bar{m}` is what it
         * takes to shift it and what it hands back in folds, and the medium at any one place can
         * only carry what a place can carry.
         */
        const m = Math.min(1, mass(h) / Math.max(1, h.ways)) * share;
        dN[a * cells + c] += m;
        if (h.tag !== undefined && h.tag < T) tag[h.tag][a * cells + c] += m;
        /* and at the places those ways REACH, which are as much the hole as its middle is -
         * "a hole is as many points as it has ways", so the return is spread over them */
        if (ledger.folds)
          ledger.folds[c] = Math.max(0, ledger.folds[c] - m / A);
      }
    }

    carry();
    n.set(out);
    for (let q = 0; q < T; q++) tag[q].set(outTag[q]);
    /*
     * WHAT THE MEDIUM IS COMING TO, SWEPT THE WAY THE STATE IS LAID OUT.
     *
     * `\rho` at a place reads DOWN the direction axis, and the state is held one direction at a
     * time - so asking it place by place strides the whole array and every read is a cache miss.
     * Measured, this one line was 275 ms of a 304 ms tick: the model spent its time taking its
     * own average, not doing physics. Accumulated one plane at a time it is the same number for
     * one sequential pass.
     */
    sweep(n);
    { let r = 0; for (let c = 0; c < cells; c++) r += RHO[c];
      r /= cells; seen++; ambient += (r - ambient) / Math.min(seen, 512); }

    /*
     * ═══ AND A BODY GOES WHERE THE SAME KERNEL SENDS IT ═══════════════════════════════════
     *
     * A structure is a region and a region has no heading, so if matter goes anywhere it is
     * because of what the vacuum does to it. Two things do:
     *
     *   WHAT ARRIVES. Every ray that reaches it delivers its heading, and what it puts out is
     *     isotropic and so costs it nothing on balance. What is left is the LOPSIDEDNESS of
     *     what came in, which is exactly the shadow another body casts. Then `\dot{x} = p/\bar{m}`
     *     and `\dot{p} = F`, which is the two lines the textbook is: the momentum is not spent
     *     by a step, so a body with no force on it keeps going.
     *   AND WHERE IT STANDS. `\paren{\nabla n_{f}}·\nabla_{\hat{d}}` swings a heading, and a body
     *     is not an exception to the geometry it sits in - it leans by the same term, read off
     *     the same kernel, for the same reason. THIS IS WHERE GRAVITY GETS IN: nothing asks
     *     where another body is or how heavy it is; the body reads the record where it STANDS
     *     and leans the way it leans, and what put the record there was the other body's
     *     radiation annihilating against its own, arriving late because it had to travel.
     */
    for (const h of holes) {
      if (!h.moves) continue;
      const c = at(Math.round(h.x), Math.round(h.y));
      if (c < 0) continue;
      const m = mass(h);
      /*
       * WHAT ARRIVED, WITH ITS HEADING — and a hole can only take in what it has ways to take
       * in, which is `\bar{m}_{x}` on each of `ways` of them, the same ceiling as emission.
       *
       * `\bar{m}_{x}` IS A MAXIMUM PER NEIGHBOUR AND IT IS ONE ON THE WAY IN AS ON THE WAY OUT:
       * a way out is lit at most once a tick, so it delivers at most one ray a tick. A hole
       * therefore absorbs at most `\bar{m}_{x}\cdot ways` in a tick, which is `\bar{m}` - and
       * since `\dot{x} = p/\bar{m}`, one tick of arrivals can change its speed by at most
       * `1/\bar{m}_{x}`, whatever is going on around it.
       *
       * IT WAS TAKING THE WHOLE LOCAL DENSITY, which is not a thing it has the ways to hold. A
       * planet of `256` ways standing in the Sun's field - `32768` ways of it, arriving as a
       * density in the thousands - was handed a momentum of `8542` against a mass of `256`, so
       * it saturated at `\bar{c}` and left radially on the first ticks. Measured, all four sat
       * pinned against the wall of the box for the whole film. Nothing went faster than
       * `\bar{c}` - a step is one `\bar{c}` and there is one a tick - which is exactly why the
       * fault showed up as every planet moving at precisely the maximum.
       *
       * SO IT IS THE DIRECTIONAL SHARE OF WHAT ARRIVED, TIMES WHAT IT CAN HOLD. A body hit
       * alike from every side takes in nothing on balance - the shares cancel - so what is left
       * is the LOPSIDEDNESS, which is the shadow another body casts, and it is bounded.
       */
      let fx = 0, fy = 0;
      /* what it can take down ONE way, `\bar{m}_{x}` apiece over the `ways/A` it has there -
       * a ceiling on each direction and not on the total, so a thin field is absorbed whole
       * and only a field thicker than the body's own ways is clipped */
      const cap = mass(h);
      for (let a = 0; a < A; a++) {
        const v = Math.min(was[a * cells + c], cap);
        fx += v * UX[a]; fy += v * UY[a];
      }
      h.px = (h.px ?? 0) + fx / A; h.py = (h.py ?? 0) + fy / A;
      /* and it leans by the record where it stands, exactly as a ray does */
      const x = c % N, y = (c - x) / N;
      const xm = at(x - 1, y), xp = at(x + 1, y), ym = at(x, y - 1), yp = at(x, y + 1);
      const gx = ((xp >= 0 ? bend(xp) : 0) - (xm >= 0 ? bend(xm) : 0)) / 2;
      const gy = ((yp >= 0 ? bend(yp) : 0) - (ym >= 0 ? bend(ym) : 0)) / 2;
      /*
       * AND HOW FAR IT LEANS IS WHAT THE KERNEL SAYS, WHICH IS BOUNDED — `keeps` of the heading
       * carries on and the rest goes the way the place is folded.
       *
       * `turns` is a DRAW: "carry straight on with weight ONE and take a folded way with the
       * weight that way was folded". So what survives is `keeps = 1/(1 + n_{f})` of the heading
       * and what does not takes a folded way, whose mean direction is `\nabla n_{f}` - the two
       * moments of the one choice, and the same pair the rays are carried by.
       *
       * IT WAS A ROTATION BY `\nabla n_{f}` AND THAT IS NOT AN ANGLE. A gradient of a record
       * that stands at tens, times a step, is radians in the tens - several whole turns a tick -
       * so a body's heading was replaced by a fresh random direction every tick while its
       * magnitude stayed put. Measured on `gravity.pull`: `p` went `(510, 0)`, `(-265, 442)`,
       * `(341, -385)`, `(453, 235)` on consecutive samples, and with the direction re-drawn
       * before a whole cell of it could be earned the pair never moved - both bodies sat within
       * a cell of where they were thrown from for the whole film.
       *
       * A DRAW CANNOT TURN A THING FURTHER THAN THE WAY IT DREW, and this is that draw's mean.
       */
      const sp = Math.hypot(h.px, h.py), gm = Math.hypot(gx, gy);
      if (sp > 0 && gm > 0) {
        const keeps = 1 / (1 + Math.max(0, bend(c)));
        const nx = h.px / sp * keeps + (gx / gm) * (1 - keeps);
        const ny = h.py / sp * keeps + (gy / gm) * (1 - keeps);
        const nm = Math.hypot(nx, ny);
        /* what it carries keeps its size - nothing here is a force - and points where it was
         * sent, so the momentum and the advance agree again and a step costs what it earned */
        if (nm > 0) { h.px = sp * nx / nm; h.py = sp * ny / nm; }
      }
      /* `\dot{x} = p/\bar{m}`, in cells, and a whole `\bar{c}` of it is what a step costs */
      h.ax = (h.ax ?? 0) + K * h.px / m; h.ay = (h.ay ?? 0) + K * h.py / m;
      const d = Math.hypot(h.ax, h.ay);
      if (d >= K) {
        const nx = h.x + K * h.ax / d, ny = h.y + K * h.ay / d;
        const to = at(Math.round(nx), Math.round(ny));
        /* and it cannot move into what is already there */
        if (to >= 0 && (!blocks[to] || blocks[to] === blocks[c])) {
          blocks[c] = 0; h.x = nx; h.y = ny; blocks[to] = holes.indexOf(h) + 1;
          h.ax -= K * h.ax / d; h.ay -= K * h.ay / d;
          /* it spent this tick getting somewhere - which `\Sigma` skips on, and which is the
           * `\beta` the mass equation is written against */
          h.stepped = true; h.moved = (h.moved ?? 0) + 1;
          /* the way it went, which is the one way it may not light on this tick */
          h.along = ((Math.round(Math.atan2(h.ay!, h.ax!) / (2 * Math.PI) * A) % A) + A) % A;
        }
      }
    }
    t++;
  };

  return {
    step, rho, held: (c: number) => held(n, c), ledger, destroyed, crossed, blocks, N, A, K, DEG,
    /* a device holds its state on the device and has to be asked for it; this one is already
     * here, so being asked costs nothing - see `GPU.continuous` */
    sync: async () => {},
    get t() { return t; },
    /** how much of a tagged population stands at a point, in the units `\rho` is in */
    from: (i: number, c: number) => held(tag[i] ?? new Float64Array(0), c) / DEG,
    /** a hole, laid down from outside — which is the whole of what `\Sigma` is */
    add: (h: Hole) => { holes.push(h); const c = at(Math.round(h.x), Math.round(h.y));
      if (c >= 0) blocks[c] = holes.length; return h; },
    /** what was put in, as it stands - where each is and what it carries */
    bodies: holes,
    /** what it weighs, by `gravity.saturation` - which is also what it radiates */
    mass, ambient: () => ambient,
    at, equation: eq,
  };
};
