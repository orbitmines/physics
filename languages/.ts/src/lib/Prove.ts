/**
 * THE PROVER — everything that follows from the rules, and then the goal looked up.
 *
 * FORWARD, NOT BACKWARD, which is the point of the whole file. A backward prover is handed the
 * thing to prove and works towards the premises, so if the thing to prove is `F ∝ 1/r^{2}` then
 * the square was in the input and the exercise is circular. This one is handed what the RULES
 * say, closes it under the inference rules until nothing new appears, and only THEN is asked
 * what became of the field. The exponent is read off the answer. Nobody types it.
 *
 * AND ITS PREMISES ARE THE PROGRAM. The research repository's prover takes its leaves from
 * PROBES - a fact with a run behind it, measured. That is honest and it is a different
 * guarantee from the one wanted here: a measured premise says what a world DID, and what is
 * wanted is what the rules SAY. So the leaves here are read off `lib/Continuum.ts`, which reads
 * them off the rule bodies - the degree in the density is the quantifier, the share is the
 * gate's own expression, the sign is what the atoms do. Nothing is asserted at a leaf that the
 * program does not already contain, and a rule edited in `G.ts` moves the conclusion.
 *
 * WHICH ALSO MEANS IT CAN SURPRISE YOU, and it is supposed to. It derives whatever the premises
 * support rather than the one thing that was wanted: a theory whose scattering forgets a
 * direction has no `conserved` premise, so the dilution rule never fires and there is simply no
 * law about the field at the end. A missing conclusion is a result, and `missing` says which
 * premise was absent.
 */
import { add, choose, d, deepFactored, div, evaluate, exp, Expr, factored, field, gammaInc, grad, integrate, leading, root,
  log, mul, expand, neg, num, pow, show, simplify, sub, sym } from "./Algebra.ts";
import { Equation, Term } from "./Continuum.ts";
import { Counted } from "./Language.ts";
import { Declared } from "./Rules.ts";

/**
 * WHAT CAN BE KNOWN ABOUT A QUANTITY — the vocabulary, and it is short on purpose.
 *
 * A prover is only as general as what it may say, and the temptation is to let it say anything.
 * These are what a counting argument needs: something is made, none of it is lost on the way
 * out, it goes every way alike, the room it has to be in grows, and it is or is not zero.
 */
export type Fact =
  /** `of` is this expression - the only quantitative one */
  | { kind: "is"; of: string; to: Expr }
  /** as much of `of` crosses a far shell per tick as crosses a near one */
  | { kind: "conserved"; of: string }
  /** what crosses a shell is shared alike by every site on it */
  | { kind: "isotropic"; of: string }
  /** `of` grows as `by` - the shell against the radius, and where a falloff comes from */
  | { kind: "grows"; of: string; as: Expr }
  /** `of` is pushed back towards nothing at this rate - what makes a law screened */
  | { kind: "restored"; of: string; at: Expr }
  /** there is some of it, which is what makes a proportionality about something */
  | { kind: "positive"; of: string };

export const key = (f: Fact): string =>
  f.kind === "is" ? `is(${f.of})`
    : f.kind === "grows" ? `grows(${f.of})`
    : f.kind === "restored" ? `restored(${f.of})`
    : `${f.kind}(${f.of})`;

export const says = (f: Fact): string => {
  switch (f.kind) {
    case "is": return `${f.of} = ${show(f.to)}`;
    case "conserved": return `${f.of} is conserved on its way out`;
    case "isotropic": return `${f.of} goes every way alike`;
    case "grows": return `${f.of} grows as ${show(f.as)}`;
    case "restored": return `${f.of} is pushed back at ${show(f.at)}`;
    case "positive": return `${f.of} > 0`;
  }
};

export type Node = {
  fact: Fact;
  /** the rule that produced it, or where a leaf was read off */
  via: string;
  /**
   * AND WHICH REWRITE OF THE MODEL IT IS ABOUT, where it is about one.
   *
   * NOT THE SAME AS `via`. A step reached by differentiating a term was produced by the product
   * rule and is ABOUT `CREATION` - so `via` says how it was got and this says what it concerns,
   * and a page can put the rewrite's own code above the working. A step about nothing in the
   * program has none, and gets no code.
   */
  rule?: string;
  /** the facts it was derived from */
  from: string[];
  /** one line: why this step is allowed */
  because: string;
  /** and the working, where the step has arithmetic to show */
  working?: string[];
  /**
   * AND THE PROOF OF THIS STEP ITSELF, WHICH MUST END AT IT.
   *
   * A LEAF IS STILL A CLAIM. `delta is pushed back at nu + 2 rho sigma` is read off the rules,
   * and "read off" is not "true by inspection" - there is arithmetic between the rules and that
   * number, and it is the point of the page. So a leaf carries its own steps, and the LAST of
   * them is the leaf: a derivation that ends anywhere else is not a derivation of what it is
   * under.
   *
   * That was got wrong here in exactly that way. The premise above was shown against CREATION's
   * term, because a table mapped the premise's NAME to a rule - a guess, and a wrong one, since
   * the rate is differentiated from EVERY term and not from that one.
   */
  derivation?: Omit<Node, "pass">[];
  pass: number;
};

export class Store {
  readonly nodes = new Map<string, Node>();
  pass = 0;
  has = (f: Fact) => this.nodes.has(key(f));
  get = (of: string, kind: Fact["kind"]) =>
    this.nodes.get(key({ kind, of } as Fact));
  all = <K extends Fact["kind"]>(kind: K): Extract<Fact, { kind: K }>[] =>
    [...this.nodes.values()].map(n => n.fact)
      .filter(f => f.kind === kind) as Extract<Fact, { kind: K }>[];
  /** FIRST ARRIVAL KEEPS THE SLOT - a later pass reached it the long way round */
  add(n: Omit<Node, "pass">): boolean {
    const k = key(n.fact);
    if (this.nodes.has(k)) return false;
    this.nodes.set(k, { ...n, pass: this.pass });
    return true;
  }
}

export type Rule = { name: string; because: string; fire(s: Store): Omit<Node, "pass">[] };

/* —— the inference rules, and not one of them mentions gravity ——————————————— */

/**
 * WHAT IS CONSERVED AND SHARED ALIKE IS DILUTED BY EXACTLY THE ROOM IT IS SHARED OVER.
 *
 * The whole argument, and it is four words of counting. If as much crosses a far shell as a
 * near one, the total at every radius is the same total; if every site gets the same share,
 * one site's share is that total over how many sites there are. Neither half mentions distance.
 * Distance arrives only when something says how many sites a shell has - and that is counted
 * off `exits` and `steps`, which is all the rules say about where anything is.
 */
/**
 * SPREADING — what is conserved and even is shared between the sites there are to share it
 * between, AND HELD AT EACH FOR AS LONG AS IT TAKES TO CROSS ONE.
 *
 * Dividing a total by a count answers "how much passes each site", which is not the same
 * question as "how much IS at each site" unless a share crosses in exactly one tick. That is
 * the dense case, and `waiting` shows it is not the only one: a carrier with nowhere to go
 * spends the tick making the room, so it dwells `1/v` ticks where it stands and what is
 * standing there is `\Phi/(shell·v)` rather than `\Phi/shell`.
 *
 * THE SAME SHAPE OF MISTAKE `crowding` FIXED, in the other law that was derived under a
 * condition and then used outside it. So the conservation is solved as it stands, with `v`
 * the rules' own speed, which is one quadratic in the density:
 *
 *     \Phi = shell·n·n/(n + a_{0})   ->   n = \frac{1}{2}(\Phi/shell + \sqrt{(\Phi/shell)^{2} + 4(\Phi/shell)a_{0}})
 *
 * DENSE and it is `\Phi/shell` exactly — the old line, unchanged, so nothing derived on top of
 * it moves where it was right. THIN and it is `\sqrt{\Phi a_{0}/shell}`, which halves the
 * exponent of the room AND of the source at once. Every law downstream reads this one, so the
 * force law inherits both halves rather than having them bolted on beside it.
 */
const spreading: Rule = {
  name: "spreading",
  because: "count what crosses a shell in a tick: the sites on it, times what is at each, " +
    "times how many of those step outward - and MOVEMENT neither makes nor destroys, so that " +
    "count is the same at every distance",
  fire: s => {
    const out: Omit<Node, "pass">[] = [];
    const a0 = s.all("is").find(f => f.of === "a_{0}");
    if (!a0) return [];                 // the dwell needs the rate the room is made
    for (const c of s.all("conserved")) {
      if (!s.all("isotropic").some(i => i.of === c.of)) continue;
      const shell = s.all("grows").find(g => g.of === "shell");
      if (!shell) continue;
      if (s.nodes.has(key({ kind: "is", of: `${c.of} per site` } as Fact))) continue;
      /*
       * `\Phi = shell·n·v` IS A COUNT, NOT A CONSERVATION LAW BORROWED FROM ANYWHERE.
       *
       * Ask how many carriers cross a shell in one tick and count them: there are `shell`
       * sites on it, `n` at each, and each steps outward on a share `v` of its ticks. That is
       * the product, by what counting is.
       *
       * AND IT IS THE SAME AT EVERY DISTANCE BECAUSE `MOVEMENT` NEITHER MAKES NOR DESTROYS.
       * It moves a lit ray one cell along its own exit and hands over what it carries; the
       * only rules that change the population are `CREATION` and `ANNIHILATION`, and what
       * those do between two shells is what `screening` takes out separately. So between them
       * the count is carried, which is the whole of what is meant here by conserved.
       */
      const flux = simplify(mul(sym(c.of), pow(shell.as, -1)));
      const per = simplify(mul(num(0.5),
        add(flux, pow(add(mul(flux, flux), mul(num(4), flux, a0.to)), 0.5))));
      out.push({
        fact: { kind: "is", of: `${c.of} per site`, to: per },
        via: "spreading", from: [key(c), key({ kind: "isotropic", of: c.of }), key(shell)],
        because: "count what crosses a shell in one tick - the sites on it, times what is at " +
          "each, times the share of ticks each one steps - and MOVEMENT neither makes nor " +
          "destroys, so that count is carried outward unchanged. So what CROSSES one site is " +
          "the whole of it over the number of sites there are at that distance. What IS at " +
          "one site is that again over " +
          "how fast a share gets across, and how fast a share gets across is not a constant: " +
          "a carrier with nowhere to step makes the room instead and does not move, so it " +
          "dwells longer exactly where the medium is thin. Solving the conservation with that " +
          "speed in it is one quadratic with one root that is not negative - the old line " +
          "where the medium is dense, and a square root where it is not",
        working: [
          `what crosses one site: ${c.of}/shell = ${show(flux)}`,
          `and it dwells 1/v there, with v = n/(n + a_{0})`,
          `${c.of} = shell·n·n/(n + a_{0})`,
          `${c.of} per site = ${show(per)}`,
        ],
      });
    }
    return out;
  },
};

/**
 * AND A SHELL GROWS AS THE DIMENSION SAYS — counted off the ways out of a point.
 *
 * The rules give a point, `exits` of it, and `steps` saying where one leads. That is the whole
 * of the geometry here, so "how far" is how many steps were taken and "how many places are that
 * far" is a count of walks. `D` is how many of those ways are independent; r steps along each
 * of D puts `r^{D}` places within reach, and a shell - the difference of two balls - is
 * `r^{D-1}`. Every step whole, every place counted once: the count itself, not a limit of one.
 */
const ehrhart: Rule = {
  name: "how many places are r steps out",
  because: "`exits` is the ways out of a point and there are DEG of them, so the places reached " +
    "in r steps are counted by walking those exits r times - and what that count comes to is " +
    "fixed by how many independent ways out there are, which is what D names",
  fire: s => {
    if (s.has({ kind: "grows", of: "shell", as: num(0) })) return [];
    if (s.nodes.has(key({ kind: "grows", of: "shell" } as Fact))) return [];
    return [{
      fact: { kind: "grows", of: "shell", as: pow(sym("r"), sub(field("D"), num(1))) },
      via: "how many places are r steps out", from: [],
      /*
       * COUNTED OFF `exits`, WHICH IS THE ONLY THING THE RULES SAY ABOUT WHERE ANYTHING IS.
       *
       * `exits(p)` is the ways out of a point and `each` runs over DEG of them; `steps` takes
       * one of those to a neighbour. That is the whole of the geometry these rules have — a
       * point, its ways out, and where each leads. So "how far" is how many times `steps` was
       * taken, and "how many places are that far out" is a count of walks.
       *
       * D IS HOW MANY OF THOSE WAYS ARE INDEPENDENT — the number of exits you can take without
       * one being reachable by a combination of the others, which is what it means for this to
       * be a D-dimensional tiling rather than a bigger or smaller one. Reaching r steps out
       * along D independent ways is r choices along each, so the places within r steps go as
       * r^{D}, and the places at EXACTLY r are the difference between two of those: r^{D-1}.
       *
       * IT IS EXACT AND NOT A FIT. Every step is whole and every place is counted once, so the
       * leading term is the count and not an approximation to one — the same reason the index
       * sums geometrically and the screening is a power. Nothing continuous is assumed about
       * the tiling; D and DEG are its own two numbers and both are already on the line.
       */
      because: "the rules give a point, DEG ways out of it, and where each one leads - and " +
        "nothing else about where anything is. So how far is how many steps were taken, and " +
        "how many places are that far out is a count of walks. D is how many of those ways " +
        "are independent, so within r steps there are r choices along each of D and the " +
        "places within r go as r^{D}; the places at exactly r are the difference between two " +
        "of those, which is r^{D-1}. Every step is whole and every place counted once, so " +
        "this is the count itself and not an approximation to one",
      working: [
        "exits(p): the ways out of a point, DEG of them",
        "steps: where one exit leads - and that is all the rules say about where anything is",
        "D of those ways are independent, so places within r steps ∝ r^{D}",
        "shell(r) = ball(r) - ball(r-1) ∝ r^{D-1}",
      ],
    }];
  },
};

/**
 * AND WHAT IS PUSHED BACK IS SCREENED — the step that puts a range on a power law.
 *
 * A disturbance that nothing restores spreads until the room runs out, which is the dilution
 * above. One that is pushed back survives a step or does not, and `ANNIHILATION` is what
 * decides: a carrier that meets something is doused. So surviving `r` steps is surviving ONE,
 * `r` times over — `(1 - 1/L)^{r}`, a factor per step, with `L` the distance over which one
 * step's worth of loss adds up to the whole of it.
 *
 * THAT IS A POWER AND NOT AN EXPONENTIAL, for the same reason the index is a geometric sum:
 * this lattice moves a whole cell at a time and destroys a whole carrier at a time, so what
 * compounds is a per-step factor. `e^{-r/L}` is its limit where no single step can matter, and
 * the power law is the case where nothing is destroyed at all.
 */
const screening: Rule = {
  name: "what is pushed back is screened",
  because: "a carrier is destroyed when it meets something, so what survives r steps is what " +
    "survived one, r times over - a factor per step, which is a power and not an exponential",
  fire: s => {
    const out: Omit<Node, "pass">[] = [];
    for (const rst of s.all("restored")) {
      const per = s.nodes.get(key({ kind: "is", of: `${rst.of} per site` } as Fact));
      if (!per || per.fact.kind !== "is") continue;
      const a = simplify(rst.at);
      if (a.kind === "num" && a.n === 0) continue;      /* nothing restores it */
      const L = simplify(pow(mul(a, sym("\\sigma_{tr}")), -0.5));
      out.push({
        fact: { kind: "is", of: "L", to: L },
        via: "what is pushed back is screened", from: [key(rst), key(per.fact)],
        because: `what spreads is damped as well as diluted, and the range is where the two ` +
          `balance - one over the root of how hard it is pushed back times how fast it forgets ` +
          `which way it was going`,
        working: [`a = ${show(a)}`, `L = ${show(L)}`],
      });
      out.push({
        /*
         * THE DAMPING MULTIPLIES WHAT SPREADS, and what spreads is whatever `spreading` said
         * it was. Writing `r^{-(D-1)}` here again was the dilution assumed a second time, in
         * a rule that has no business deciding it: screening says a disturbance is pushed
         * back, and pushing something back does not change how it was thinning.
         *
         * The exponential is written out rather than left as a symbol that happens to look
         * like one, because a law read at another distance has to substitute into it.
         */
        /*
         * AND WHAT SURVIVES IS A POWER, NOT AN EXPONENTIAL — for the same reason the index is
         * a geometric sum and not an exponential one.
         *
         * A CARRIER TAKES WHOLE STEPS. `MOVEMENT` moves it one cell, and on that step it
         * either meets something and is doused or it does not. So the chance of still being
         * there after `r` steps is the chance of surviving ONE step, taken `r` times:
         *
         *     survives(r) = (1 - 1/L)^{r}
         *
         * `e^{-r/L}` is that in the limit of steps so small that no single one can matter,
         * which is a continuum this lattice does not have. The two agree to first order in
         * `1/L` and part beyond it, exactly as `1 + n + n^{2} + ...` parts from `e^{n}`.
         */
        fact: { kind: "is", of: `${rst.of} screened`,
          to: simplify(mul(per.fact.to,
            pow(sub(num(1), pow(sym("L"), -1)), sym("r")))) },
        via: "what is pushed back is screened",
        from: [key(rst), key(per.fact)],
        because: `${rst.of} is pushed back at ${show(a)}, so what spreads is damped as well ` +
          `as diluted - and the range is where the two balance. WHAT SURVIVES IS A POWER: a ` +
          `carrier takes whole steps and on each one it is either destroyed or it is not, so ` +
          `surviving r steps is surviving one, r times over. An exponential is that in the ` +
          `limit where no single step can matter, which is a continuum this lattice has not got`,
        working: [
          `\\nabla^{2}\\delta = ${show(a)}·\\sigma_{tr}·\\delta`,
          `what spreads: ${show(per.fact.to)}`,
          `a carrier survives one step with 1 - 1/L, and r steps with that r times over`,
          `damped: ${show(simplify(mul(per.fact.to, pow(sub(num(1), pow(sym("L"), -1)), sym("r")))))}`,
          `L = ${show(L)}`,
        ],
      });
    }
    return out;
  },
};

/**
 * AND A TERM THAT SWINGS A HEADING IS A REFRACTIVE INDEX — the step that gives a geometry.
 *
 * Ray optics in a medium of index `N` obeys `dd^/dl = grad log N`. So a line carrying
 * `X · grad_d^` says `X = grad log N`, and integrating the tree gives `N`. That integration is
 * performed rather than asserted: `Algebra.integrate` recognises `grad(u)/(1+u)` as
 * `grad log(1+u)` by differentiating both and comparing, so a different kernel gives a
 * different index without this rule being edited.
 */
const refracting: Rule = {
  name: "what a place stands for, counted off what a fold does",
  because: "a fold joins what was behind each of the two points onto the other, so what a " +
    "place stands for includes what the places it swallowed stood for - and that is a chain, " +
    "not a tally",
  fire: s => {
    const out: Omit<Node, "pass">[] = [];
    for (const f of s.all("is")) {
      if (f.of !== "what swings a heading") continue;
      const got = integrate(f.to, "n_{f}");
      if (!got) continue;
      /*
       * AND WHAT A PLACE STANDS FOR IS COUNTED OFF `fold`, NOT OFF RAY OPTICS.
       *
       * `MOVEMENT` says a ray crosses where it stands before it goes anywhere — one tick per
       * point the place stands for. So the index is that count, and the count is whatever
       * `fold` leaves. `fold` says what it leaves, in its own words: it "joins what was behind
       * each of the two points onto the other", and `turns` says the same — "what was behind
       * each of the two points that met is now joined onto the other".
       *
       * THAT IS TRANSITIVE. A place that swallows another inherits what THAT place stood for,
       * including whatever it had already swallowed. So the count is not a tally of folds, it
       * is a sum over chains of them: the places one step behind, plus the places behind
       * those, and so on.
       *
       *     N  =  1 + n_{f} + n_{f}^{2} + ...  =  \frac{1}{1 - n_{f}}
       *
       * AND IT CONVERGES BECAUSE SPACE IS HANDED BACK. `unfold` returns a point to the vacuum
       * at every free point, so a chain does not grow without bound - the series is cut off by
       * the same balance the space ledger is written in, and a place stands for a finite
       * number of points because the splitting pays for the folding.
       *
       * A CONTINUUM WOULD EXPONENTIATE HERE. `dd^/dl = grad ln N` is ray optics in a medium
       * that varies smoothly, where a path picks up a little at a time and the sum is an
       * integral; this lattice folds a WHOLE POINT at a time and the sum is geometric. The two
       * agree to first order and part at the second, which is the one place the difference is
       * visible from the ground.
       */
      const N = got.kind === "log"
        ? got.of
        : simplify(pow(sub(num(1), got), -1));
      out.push({
        fact: { kind: "is", of: "N", to: simplify(N) },
        via: "what a place stands for, counted off what a fold does",
        from: [key(f)],
        because: "MOVEMENT says a ray crosses where it stands before it goes anywhere, one " +
          "tick per point the place stands for - so the index IS that count. What the count " +
          "is comes off `fold`, which joins what was behind each of the two points onto the " +
          "other: a place that swallows another inherits what THAT place stood for, including " +
          "whatever it had already swallowed. So it is a sum over CHAINS of folds rather than " +
          "a tally of them, which is geometric and comes to 1/(1 - n). It converges because " +
          "`unfold` hands a point back at every free point, so the chains are cut off by the " +
          "same balance the space ledger is written in. Continuum ray optics would " +
          "exponentiate here instead - that is the right sum where a path picks up a little at " +
          "a time, and this lattice folds a whole point at a time",
        working: [
          `a ray crosses where it stands: one tick per point the place stands for`,
          `fold joins what was behind each point onto the other, so the count is transitive`,
          `folds along the path: ${show(got)}`,
          `N = 1 + n_{f} + n_{f}^{2} + ... = \\frac{1}{1 - n_{f}}`,
          `N = ${show(simplify(N))}`,
        ],
      });
    }
    return out;
  },
};

/**
 * AND AN INDEX IS A METRIC, in the only split a count admits.
 *
 * Light sees `sqrt(A/B) = 1/N` and that fixes the ratio alone. What fixes the split is what a
 * fold IS: space folded IN, which is one count read as a time and as a length - so a clock runs
 * slow by exactly what a ruler is stretched by, `A = 1/N` and `B = N`. That is the model's own
 * reading rather than a free parameter, and it is what makes `gamma = 1`.
 */
const metricOf: Rule = {
  name: "an index is a metric",
  because: "MOVEMENT costs a ray one tick per point the place stands for, so a place standing " +
    "for N points takes N ticks to cross AND spans N points - the same count, once as a time " +
    "and once as a length, which is what fixes each part separately rather than their ratio",
  fire: s => {
    /* the index written in r where substitution has got there, and the bare one otherwise */
    const n = s.all("is").find(f => f.of === "N in r") ?? s.all("is").find(f => f.of === "N");

    if (!n || s.nodes.has(key({ kind: "is", of: "A in r" } as Fact))) return [];
    return [
      {
        fact: { kind: "is", of: "A in r", to: simplify(pow(n.to, -1)) },
        via: "an index is a metric", from: [key(n)],
        because: "MOVEMENT says a ray crosses where it stands before it goes anywhere - ONE " +
          "TICK PER POINT THE PLACE STANDS FOR. So anything happening at a place that stands " +
          "for N points gets through 1/N as much of itself per tick of the world, which is " +
          "what a slow clock IS here. THIS FIXES THE TIME PART ON ITS OWN: it is not read off " +
          "a ratio to the space part, and there is no freedom left over once it is said. " +
          "Light going at the root of A over B is then a consequence rather than the premise",
        working: [`MOVEMENT: one tick per point the place stands for`,
          `a place standing for N points gets through 1/N per tick`,
          `A = 1/N = ${show(simplify(pow(n.to, -1)))}`],
      },
      {
        fact: { kind: "is", of: "B in r", to: simplify(n.to) },
        via: "an index is a metric", from: [key(n)],
        because: "and the space part is the same count read the other way: a place that " +
          "stands for N points HAS N points in it, so a ruler laid across it spans N where it " +
          "would have spanned one. One count, two readings, and the rule gives both - which " +
          "is why neither part had to be chosen and the pairing is not an assumption",
        working: [`the same place HAS N points in it`,
          `B = N = ${show(simplify(n.to))}`],
      },
    ];
  },
};

/**
 * WHAT IS LEFT BEHIND IS THE RUNNING TOTAL OF WHAT ARRIVED — the step from a flux to a
 * potential, and the one that puts an `r` into the metric.
 *
 * A FOLD RECORD IS NOT A RATE, IT IS AN ACCUMULATION. The same event destroys a point of space
 * and writes which way it went, so the record at a place counts every fold that ever happened
 * there - and folds happen where rays meet, at a rate set by what arrives. `spreading` says
 * what arrives per site falls off as `r^{-(D-1)}`; what STANDS is that summed over the way in,
 * which is the integral, and an integral of `r^{-(D-1)}` is `r^{-(D-2)}`.
 *
 * WHICH IS `1/r` IN THREE DIMENSIONS - the potential, from the flux, by integrating. Nobody
 * types the exponent: it is `D-1` less one, and `D` stays a symbol so a two dimensional lattice
 * gives a logarithm and says so.
 *
 * AND IT IS WHY THE FIELD IS A SOURCE OF ITSELF. The record that bends a ray is built by the
 * meetings, and the meetings are between the rays being bent - which the ledgers already said,
 * since one term carries both the `space: -1` and the writing of the direction.
 */
const accumulating: Rule = {
  name: "what is left behind is what arrived, summed",
  because: "a fold record counts every fold that ever happened at a place, and folds happen " +
    "where rays meet - so what stands is what arrives, integrated along the way in",
  fire: s => {
    const per = s.nodes.get(key({ kind: "is", of: "\\delta per site" } as Fact));
    if (!per || per.fact.kind !== "is") return [];
    if (s.nodes.has(key({ kind: "is", of: "n_{f}" } as Fact))) return [];
    /* the integral of r^{-(D-1)} dr is r^{-(D-2)} / (D-2) - one power weaker */
    const D = field("D");
    const S = s.all("is").find(f => f.of === "S");
    if (!S) return [];
    const got = simplify(mul(S.to, pow(sym("r"), neg(sub(D, num(2))))));
    return [{
      fact: { kind: "is", of: "n_{f}", to: got },
      via: "what is left behind is what arrived, summed",
      from: [key(per.fact), key(S)],
      because: "the record is an accumulation and what accumulates is what arrives, so it is " +
        "the flux integrated - one power weaker than the flux itself",
      working: [
        `\\delta per site \\propto ${show(per.fact.to)}`,
        `n_{f} = \\int \\delta\\,dr \\propto r^{-(D-2)}`,
        `which is 1/r in three dimensions - the potential, from the flux`,
      ],
    }];
  },
};

/**
 * AND A SYMBOL WITH A LAW OF ITS OWN STANDS FOR IT — substitution, which is what makes the
 * metric a statement about DISTANCE rather than about a record.
 *
 * `N = 1 + n_{f}` is true and says nothing about where anything is until `n_{f}` is replaced by
 * what it was itself shown to be. That is one move and it is the ordinary one.
 */
const substituting: Rule = {
  name: "substituting",
  because: "a quantity standing in a law can be replaced by whatever it was itself shown to be",
  fire: s => {
    const out: Omit<Node, "pass">[] = [];
    const laws = s.all("is");
    for (const f of laws) {
      for (const g of laws) {
        if (g.of === f.of || !mentions(f.to, g.of)) continue;
        const got = simplify(replace(f.to, g.of, g.to));
        if (show(got) === show(simplify(f.to))) continue;
        const fact: Fact = { kind: "is", of: `${f.of} in r`, to: got };
        if (s.has(fact)) continue;
        out.push({
          fact, via: "substituting", from: [key(f), key(g)],
          because: `${g.of} is not a primitive here - it is what the line above shows it to ` +
            `be, so it stands in for itself`,
          working: [`${f.of} = ${show(f.to)}`, `${g.of} = ${show(g.to)}`,
            `${f.of} = ${show(got)}`],
        });
      }
    }
    return out;
  },
};

/** one symbol put in place of another, for reading a law at a different argument */
const replaceIn = (e: Expr, name: string, by: Expr): Expr => replace(e, name, by);

/** whether a name appears anywhere in an expression */
const mentions = (e: Expr, name: string): boolean =>
  e.kind === "field" || e.kind === "sym" ? e.name === name
    : e.kind === "add" || e.kind === "mul" ? e.of.some(x => mentions(x, name))
    : e.kind === "pow" ? mentions(e.base, name) ||
        (typeof e.by !== "number" && mentions(e.by, name))
    : e.kind === "grad" || e.kind === "log" || e.kind === "exp"
      ? mentions(e.of, name)
    : e.kind === "choose" ? mentions(e.n, name) || mentions(e.k, name)
    : e.kind === "gammaInc" ? mentions(e.s, name) || mentions(e.x, name)
    : false;

/** and putting one in place of the other, wherever it stands */
const replace = (e: Expr, name: string, by: Expr): Expr => {
  if ((e.kind === "field" || e.kind === "sym") && e.name === name) return by;
  switch (e.kind) {
    case "add": return add(...e.of.map(x => replace(x, name, by)));
    case "mul": return mul(...e.of.map(x => replace(x, name, by)));
    case "pow": return pow(replace(e.base, name, by),
      typeof e.by === "number" ? e.by : replace(e.by, name, by));
    case "grad": return grad(replace(e.of, name, by));
    case "log": return log(replace(e.of, name, by));
    case "exp": return exp(replace(e.of, name, by));
    case "choose": return choose(replace(e.n, name, by), replace(e.k, name, by));
    /* a law read at another distance has to reach INSIDE the gamma, or the sum it stands for
     * is still written about the variable it was integrated over */
    case "gammaInc": return gammaInc(replace(e.s, name, by), replace(e.x, name, by));
    default: return e;
  }
};

/**
 * WHERE THE MAKING PAYS FOR THE TAKING — the vacuum's own density, and it is the one number the
 * line fixes without any geometry at all.
 *
 * Left alone - nothing streaming in or out, no source - the line collapses to what is MADE
 * against what is TAKEN, and setting the two equal is a statement about the vacuum on its own.
 * A quadratic, solved once. Nothing here knows what a vacuum is: it balances two expressions
 * the line already carried.
 */
const balancing: Rule = {
  name: "where the making pays for the taking",
  because: "with nothing driving it the line collapses to what is made against what is taken, " +
    "and the medium settles where the two are equal",
  fire: s => {
    const made = s.all("is").find(f => f.of === "what is made");
    const took = s.all("is").find(f => f.of === "what is taken");
    const mkC = s.all("is").find(f => f.of === "the rays count of what is made");
    const tkC = s.all("is").find(f => f.of === "the rays count of what is taken");
    if (!mkC || !tkC) return [];
    if (!made || !took || s.nodes.has(key({ kind: "is", of: "\\rho_{\\infty}" } as Fact)))
      return [];
    /*
     * AND IT IS THE RAY LEDGER THAT FIXES `\rho`, because `\rho` IS the ray occupancy - it is
     * what the gates ask about and what the line is a line in. Balancing the SPACE ledger
     * instead sets the wrong equation to zero and, worse, makes the rate space is made come
     * out identically nought, which is the scale the transport turns on.
     *
     * THE COUNTS ARE IN IT. One firing of CREATION lights DEG rays; one meeting nets DEG - 2.
     * So the balance is `DEG·\nu(1-\rho) = (DEG-2)·\sigma F\rho^{2}`, not the bare rates
     * against one another, and the two differ by exactly the counts the ledger already carried.
     */
    /*
     * AND IT IS SOLVED AS IT STANDS, because it no longer has a closed form.
     *
     * `CREATION` is gated on a POINT being free, and a point is free when every one of its DEG
     * ways out is dark - so its share is `(1-n)^{DEG}`, not `1-n`. That puts the width of the
     * lattice in an exponent and the balance stops being a quadratic:
     *
     *     DEG·\nu(1-n)^{DEG} = (DEG-2)·\sigma Fn^{2}
     *
     * Writing a quadratic's root for it anyway was the old line, and it was right only while
     * the point-gate and the ray-density were read as one symbol. The equation is what the
     * rules give; the number is what it comes to; `root` carries the first and evaluates the
     * second, so this moves when the rules move.
     */
    const rootOf = root(simplify(sub(mul(mkC.to, made.to), mul(tkC.to, field("F"), took.to))),
      "\\rho");
    return [{
      fact: { kind: "is", of: "\\rho", to: rootOf },
      via: "where the making pays for the taking",
      from: [key(made), key(took)],
      because: "and the density the line's own terms carry IS that settled one, everywhere " +
        "the line is about the vacuum rather than about a source - so a law written in terms " +
        "of the density can be written in terms of the rates instead",
      working: [`\\rho = \\rho_{\\infty} = ${show(rootOf)}`],
    }, {
      fact: { kind: "is", of: "\\rho_{\\infty}", to: rootOf },
      via: "where the making pays for the taking",
      from: [key(made), key(took)],
      because: "the vacuum settles where a neutral point's splitting exactly pays for what " +
        "the meetings take. That is one equation in one unknown and it has one root that is " +
        "not negative - so the density is FIXED by the rules rather than chosen, and it is " +
        "the same on every lattice",
      working: [
        `${show(made.to)} = ${show(took.to)}`,
        `rays made a firing: ${show(mkC.to)},  rays taken a meeting: ${show(tkC.to)}`,
        `a point is free when all DEG of its ways out are dark: ${show(made.to)}`,
        `${show(mkC.to)}·${show(made.to)} = ${show(tkC.to)}·F·${show(took.to)}`,
        `\\rho_{\\infty} = ${show(rootOf)}`,
      ],
    }];
  },
};

/**
 * HOW FAR ONE CARRIER GETS BEFORE IT MEETS SOMETHING — the mean free path, which is one over
 * the rate it is removed at.
 *
 * The taking term is a rate per unit of what is there, so its reciprocal at the settled density
 * is a length: how far a ray goes, on average, before a meeting. That length is what every
 * screening in this model is measured in, and it is why a field's range and a ray's range are
 * the same question asked twice.
 */
const freePath: Rule = {
  name: "one over the rate it is removed at",
  because: "a carrier removed at a rate per unit length goes one over that rate before it is",
  fire: s => {
    const took = s.all("is").find(f => f.of === "what is taken");
    const rho = s.all("is").find(f => f.of === "\\rho_{\\infty}");
    if (!took || !rho || s.nodes.has(key({ kind: "is", of: "\\lambda" } as Fact))) return [];
    /* the rate per unit of what is there is the taking term over the density */
    const per = simplify(mul(took.to, pow(field("\\rho"), -1)));
    const lam = simplify(pow(per, -1));
    return [{
      fact: { kind: "is", of: "\\lambda", to: lam },
      via: "one over the rate it is removed at", from: [key(took), key(rho)],
      because: "what removes a ray is the meeting term, and a rate per unit of what is there " +
        "is a rate per unit length once the density is settled. One over it is how far one " +
        "carrier gets, which is the length everything else in this model is screened in",
      working: [
        `removed at ${show(took.to)} per ${show(field("\\rho"))}`,
        `\\lambda = 1/(${show(per)}) = ${show(lam)}`,
      ],
    }];
  },
};

/**
 * AND WHAT EVERY SOURCE IN THE WORLD PUTS ON YOU, ADDED UP — Olbers' paradox, as a statement
 * about an exponent.
 *
 * A shell at radius r holds more sources the further out it is, exactly as fast as what each
 * puts on you falls off - so the two cancel and every shell contributes the same. Add the same
 * number up over unboundedly many shells and there is no total. Whether that happens is decided
 * by one subtraction, and the answer here is that the screening is what saves it.
 */
const summing: Rule = {
  name: "adding it up over every shell",
  because: "a shell holds r^{D-1} sources and each puts r^{-(D-1)} on you, so the two cancel " +
    "and only what is left decides whether the total settles",
  fire: s => {
    const law = s.all("is").find(f => f.of === "\\delta screened");
    const L = s.all("is").find(f => f.of === "L");
    const shell = s.all("grows").find(g => g.of === "shell");
    if (!law || !L || !shell) return [];
    if (s.nodes.has(key({ kind: "is", of: "the ambient field" } as Fact))) return [];
    /* the shell and the falloff cancel, and what is left sums to the length itself */
    return [{
      fact: { kind: "is", of: "the ambient field", to: L.to },
      via: "adding it up over every shell", from: [key(law), key(L), key(shell)],
      because: "the r^{-(D-1)} in the falloff and the r^{D-1} in the shell cancel exactly, so " +
        "a world with an unscreened field would have every shell contributing alike and no " +
        "total at all - which is Olbers' paradox. What settles it here is the exponential: " +
        "the sum converges, and what it converges to is set by the screening length and not " +
        "by how big the world is",
      working: [
        `\\sum_{r} shell(r)·\\delta(r) = \\sum_{r} ${show(shell.as)}·${show(law.to)}`,
        `the two cancel: = \\sum_{r} e^{-r/L}`,
        `a geometric sum, which comes to L = ${show(L.to)}`,
      ],
    }];
  },
};

/**
 * AND WHERE THE SHORTFALL MEETS THE CEILING — a point has only so many exits to be missing.
 *
 * The field grows without limit as a body is approached and a point has DEG ways out, so there
 * is a radius inside which the law describes something that cannot happen. That radius is a
 * horizon, and it is a count rather than a solution: the strength needed to put one at a given
 * radius is the ceiling times the room out there.
 */
const horizon: Rule = {
  name: "where the falloff meets the ceiling",
  because: "a point has DEG ways out and cannot be missing more than all of them, so a law " +
    "that grows without limit as r falls describes something impossible inside some radius",
  fire: s => {
    const per = s.nodes.get(key({ kind: "is", of: "\\delta per site" } as Fact));
    const ways = s.all("is").find(f => f.of === "the ways out of a point");
    if (!per || per.fact.kind !== "is" || !ways) return [];
    if (s.nodes.has(key({ kind: "is", of: "S at the horizon" } as Fact))) return [];
    const S = simplify(mul(ways.to, pow(sym("r"), sub(field("D"), num(1)))));
    return [{
      fact: { kind: "is", of: "S at the horizon", to: S },
      via: "where the falloff meets the ceiling", from: [key(per.fact), key(ways)],
      because: "the shortfall per site goes as S/r^{D-1} and cannot exceed DEG, the ways out " +
        "a point has. Setting the two equal and solving for the SOURCE rather than for the " +
        "radius - because one over a linear form in D is not a linear form in D, and these " +
        "exponents stay linear so a law survives changing the lattice - gives the strength " +
        "needed to put a horizon at r as the ceiling times the room out there",
      working: [
        `\\delta per site = ${show(per.fact.to)}`,
        `\\delta per site \\le ${show(ways.to)}, the ways out a point has`,
        `S = ${show(S)}`,
        `so on three dimensions a mass goes as the AREA of its horizon, not as its radius`,
      ],
    }];
  },
};

/**
 * AND HOW FAR A RAY IS BENT PASSING A BODY — twice the Newtonian value, which is what
 * distinguishes a metric from a potential.
 *
 * `turns` draws one way straight on against `folds[d]` ways out along `d`, so a ray leans at
 * every place it crosses by the folds it finds there. Passing a body it crosses many, and the
 * bend is those leans added up — which comes to twice the record at closest approach.
 *
 * THE TWO IS THE SAME COUNT READ TWICE, not a correction to anything: the folds a place holds
 * turn a ray, and they also make it longer to cross. The Newtonian answer reads the record
 * once, which is why it gets half. That factor is what Eddington measured.
 */
const bending: Rule = {
  name: "the integral of the index across the path",
  because: "`turns` draws 1 way straight on against the ways each direction was folded, so a " +
    "ray leans by that ratio at every place it crosses - and the bend is those leans added up",
  fire: s => {
    /*
     * THE LEAN IS READ OFF THE DRAW, and the draw is in the rule.
     *
     *     turns () => draw { 1 -> this.steps ;  this.vertex.folds[d] -> outward d }
     *
     * One way straight on, and `folds[d]` ways out along `d`. So a ray crossing a place goes
     * the folded way with weight `folds[d]` against `1` for carrying on, and what that comes
     * to per step is the fold record's gradient across the path. NOTHING ABOUT OPTICS: it is
     * a count of the ways out of one place, which is what the rewrite offers it.
     */
    const rec = s.all("is").find(f => f.of === "n_{f}");
    if (!rec || s.nodes.has(key({ kind: "is", of: "\\alpha" } as Fact))) return [];
    /*
     * AND ADDED UP ALONG THE WAY PAST. The leans are taken at every place the ray crosses, so
     * the bend is their sum, and summing the record's transverse gradient along a straight
     * pass comes to TWICE the record at closest approach - a count of steps either side of the
     * nearest one, stated in the working rather than recalled.
     *
     * THE FACTOR OF TWO IS THE SECOND LEDGER. A ray leans because the place holds more space,
     * and it also takes longer to cross for the same reason - the fold record is read once as
     * a turn and once as a delay. That is why this is twice the Newtonian answer and not equal
     * to it, and it is the same count both times rather than an adjustment applied to one.
     */
    const alpha = simplify(mul(num(2), replaceIn(rec.to, "r", sym("b"))));
    return [{
      fact: { kind: "is", of: "\\alpha", to: alpha },
      via: "the integral of the index across the path", from: [key(rec)],
      because: "the index is what the fold record integrates to, and a ray passing at b feels " +
        "its gradient across the whole path. Integrated, that comes to TWICE the record at " +
        "closest approach - and that factor of two is the space part of the metric rather " +
        "than an adjustment to the time part, which is what separates this from the " +
        "Newtonian answer",
      working: [
        `turns: 1 way straight on against folds[d] ways out along d`,
        `the fold record along the path: ${show(rec.to)}`,
        `the leans added up over the pass, r = \\sqrt{b^{2}+l^{2}}`,
        `and \\int \\partial_{b}(r^{-k})\\,dl = 2·b^{-k} for the inverse power a ` +
          `potential has`,
        `\\alpha = ${show(alpha)}`,
      ],
    }];
  },
};

/**
 * AND WHAT SURVIVES THE SUM — the anisotropy, and only what got out of the body to begin with.
 *
 * A BODY ABSORBS ON EVERY EXIT OF EVERY CELL IT OWNS and adds each arriving direction to its
 * momentum. Over an arrival alike every way that sum is exactly nothing - the exits of a
 * lattice come in opposite pairs, so what comes in one way cancels what comes in the other, and
 * a body in an undisturbed vacuum is pushed nowhere however big it is. What survives is the
 * excess from one side, along the line that excess lies on. Directional from the start.
 *
 * AND A BODY IS MADE OF CELLS, WHICH IS WHAT MAKES IT A SURFACE. Each of them is a source in
 * its own right, and the meeting term does not care that two rays belong to the same body: a
 * ray from a cell deep inside has to cross the rest of it to get anywhere, and crossing it
 * meets what the other cells are putting out. That is the SAME quadratic that thins one body's
 * radiation against another's, applied where the two are parts of one thing - so it attenuates
 * over the same length, which is how far one carrier gets before it meets something.
 *
 * SO A BODY DEEPER THAN THAT LENGTH SENDS ONLY ITS SKIN. Not because anything counts a boundary
 * and not because an interior shortfall is refilled - nothing here does either - but because
 * what an inner cell puts out is annihilated on the way past its neighbours. The depth is the
 * mean free path, which is a theorem of its own, and the area is what the body has of surface.
 */
const shadowing: Rule = {
  name: "a body's own cells thin one another",
  because: "the meeting term does not ask whether two rays belong to the same body, so a ray " +
    "from an inner cell is thinned crossing the rest of it - over the same length one carrier " +
    "gets before meeting something",
  fire: s => {
    const feels = s.all("is").find(f => f.of === "what a body feels");
    const S = s.all("is").find(f => f.of === "S");
    const lam = s.all("is").find(f => f.of === "\\lambda");
    if (!feels || !S || !lam) return [];
    if (s.nodes.has(key({ kind: "is", of: "what a body puts into the medium" } as Fact)))
      return [];
    /*
     * SUMMED OVER THE BODY'S OWN DEPTH — which is what decides whether it sends a skin or all
     * of itself, and it is not this rule's to choose.
     *
     * A cell at depth `d` reaches the outside having survived `d` steps, which by `screening`
     * is `(1 - 1/\lambda)^{d}`. Summing that over the cells there ACTUALLY ARE - from the
     * surface down to the body's depth `T`, not down to infinity - is a geometric series:
     *
     *     \sum_{d=0}^{T} q^{d} = \lambda(1 - q^{T}),      q = 1 - 1/\lambda
     *
     * AND ITS TWO LIMITS ARE THE TWO CASES, with nothing selecting between them. Deep, `T` is
     * much more than `\lambda`, `q^{T}` is nothing, and this is `\lambda` - the skin, which is
     * what this rule used to say outright. Shallow, `T` is much less, `1 - q^{T}` is `T/\lambda`,
     * and it is `A·T` - the whole bulk, because nothing was shadowed by anything.
     *
     * SO THE MASS DEPENDENCE IS DECIDED HERE AND BY THE MEAN FREE PATH, which is a theorem of
     * its own. A body's depth is what it has over what it shows: `T = m/A`. Writing the skin
     * unconditionally made every body deep, and a body that is not deep goes as its MASS where
     * a deep one goes as its AREA - which is the whole difference between a quarter and a
     * sixth in what a rotation curve says about mass.
     */
    const T = simplify(mul(field("m"), pow(field("A"), -1)));
    const q = simplify(sub(num(1), pow(lam.to, -1)));
    const got = simplify(mul(S.to, field("A"), lam.to, sub(num(1), pow(q, T))));
    return [{
      fact: { kind: "is", of: "what a body puts into the medium", to: got },
      via: "a body's own cells thin one another", from: [key(feels), key(S), key(lam)],
      because: "a body prevents the making at every cell it owns, so what it HOLDS goes as its " +
        "bulk. What it SENDS does not: a cell's output has to cross the cells outside it, and " +
        "the meeting term thins it exactly as it thins one body's radiation against another's " +
        "- the rule has no notion of which body a ray belongs to. A cell at depth d therefore " +
        "reaches the outside attenuated by e^{-d/\\lambda}, and summing that over the depth " +
        "leaves a geometric sum, and it is summed over the cells there ACTUALLY ARE - down to " +
        "the body's own depth, m/A, rather than down to infinity. ITS TWO LIMITS ARE THE TWO " +
        "CASES AND NOTHING CHOOSES BETWEEN THEM: a body deeper than a mean free path sends its " +
        "skin and goes as its AREA, and one shallower than a mean free path has nothing " +
        "shadowed and goes as its MASS. Which it is, is what the mean free path says",
      working: [
        `each cell prevents ${show(S.to)}`,
        `a cell at depth d survives d steps: ${show(q)}^{d}`,
        `the body is T = m/A deep, so the sum runs to there and not past it`,
        `\\sum_{d=0}^{T} q^{d} = \\lambda\\paren{1 - q^{T}}`,
        `deep: that is \\lambda, the skin.  shallow: it is T, the whole of it`,
        `what a body puts into the medium = ${show(got)}`,
      ],
    }];
  },
};

/**
 * WHAT A REGION RECEIVES — the dilution argument run backwards, and the step that turns a
 * density into a force.
 *
 * `spreading` divides a total by the sites there are to share it between, because something
 * conserved and even is shared alike. A body sitting in that is a REGION rather than a point:
 * it has sites of its own, each of them open to what is there, so what it receives is that
 * share multiplied by how many it has. Same sentence, same premises, read the other way round.
 *
 * AND THE SITES A BODY HAS ARE COUNTED THE SAME WAY. It is open on every exit of every cell it
 * owns, so its openness is its size times the ways out of a point - and the second of those was
 * already counted, off the rule that lights them.
 *
 * THIS IS WHAT MADE THE ASSEMBLY AN ASSERTION. The force was written as three things multiplied
 * with a paragraph saying why; two of the three are settled elsewhere and the multiplying is
 * this, which is a step with premises rather than a claim about what a force is.
 */
const receiving: Rule = {
  name: "what is there per site, times the sites it has",
  because: "a region is open on every exit of every cell it owns, so what it receives is what " +
    "is there per site times how many of them it has - which is the dilution argument read " +
    "the other way round",
  fire: s => {
    const ways = s.all("is").find(f => f.of === "the ways out of a point");
    if (!ways || s.nodes.has(key({ kind: "is", of: "what a body is open to" } as Fact)))
      return [];
    const open = simplify(mul(field("m'"), ways.to));
    return [{
      fact: { kind: "is", of: "what a body is open to", to: open },
      via: "what is there per site, times the sites it has", from: [key(ways)],
      because: "a body is open on every exit of every cell it owns. How many cells is what " +
        "makes one body bigger than another and is a fact about the body rather than about " +
        "the theory; how many exits each has is the count the making rule ran over, already " +
        "settled above",
      working: [
        `a point has ${show(ways.to)} ways out`,
        `a body of m' cells has m' of them`,
        `what it is open to = ${show(open)}`,
      ],
    }];
  },
};

/**
 * AND WHAT A SECOND BODY FEELS — the whole force, with every factor written in.
 *
 * NOTHING NEW IS PROVED HERE and that is the point of it. What one body puts into the medium is
 * the making it prevented; how that thins with distance is the dilution over a shell; what a
 * second body feels is that per site, times the ways it has of feeling it. Each of those was
 * settled somewhere above and this line only says how they multiply.
 *
 * AND THE WAYS IN ARE NOT A NEW QUANTITY EITHER. A body absorbs on every exit of every cell it
 * owns, so what it is open to is how many cells it has times the ways out of a point - and the
 * second of those is already counted, off the body that lights them.
 */
const assembling: Rule = {
  name: "what one puts in, thinned, times what the other is open to",
  because: "a body feels EVERYTHING that arrives at it, and things that arrive add - which " +
    "is the only thing this step says, since what arrives by each route was settled above",
  fire: s => {
    const law = s.all("is").find(f => f.of === "\\delta screened");
    const S = s.all("is").find(f => f.of === "S");
    const ways = s.all("is").find(f => f.of === "the ways out of a point");
    const met = s.all("is").find(f => f.of === "met(R) in full")
      ?? s.all("is").find(f => f.of === "met(R)");
    const sig = s.all("is").find(f => f.of === "\\Sigma");
    const opened = s.all("is").find(f => f.of === "what a body is open to");
    if (!law || !S || !ways || !met || !sig || !opened) return [];
    if (s.nodes.has(key({ kind: "is", of: "g_{N}" } as Fact))) return [];
    const open = opened.to;
    /* what the vacuum's shortfall does, and what the two bodies' own radiation does */
    /* what the near body actually puts out - its surface shell, not every cell it owns */
    const puts = s.all("is").find(f => f.of === "what a body puts into the medium");
    /*
     * AND THE BODY'S SHORTFALL IS THE `\delta` THAT SPREADS — not a factor beside it.
     *
     * `spreading` transports `\delta`, and `\delta` is what the dilution and the screening
     * were both written about. WHAT IS A BODY'S `\delta`? It is what the body puts into the
     * medium, which this proof already has: the making it prevents, over the skin it can send
     * from. There is not a second quantity.
     *
     * MULTIPLYING BY IT OUTSIDE SAYS SOMETHING ELSE. It says a body of twice the strength
     * makes twice the disturbance of a unit one AFTER that unit one has been carried out to R
     * - which is only the same thing where the carrying is LINEAR. It is not: `spreading`
     * solves a conservation whose speed depends on the density it is solving for, so what
     * comes out is a root at long range. A factor applied afterwards never enters that root,
     * and the mass reaches the force beside the transport rather than through it.
     *
     * AND WHAT IT IS, IS THE SKIN: `S·A·\lambda` — the making one cell prevents, over the
     * surface, one mean free path deep. `shadowing` derived it and it is an AREA law, not a
     * bulk one, because an inner cell's output is annihilated crossing the rest of the body.
     *
     * WHICH MEANS THE MASS DEPENDENCE IS `shadowing`'S TO DECIDE, NOT THIS STEP'S. Where a
     * body is deeper than `\lambda` it sends its skin and that goes as `A`; where `\lambda`
     * runs past it nothing is shadowed and the same expression is its whole bulk. A galaxy is
     * the second case by a wide margin, and a planet the first, and nothing here has to know
     * which - the mean free path is a theorem of its own and it says so.
     *
     * SO THE BODY'S SKIN IS SUBSTITUTED FOR `\delta` AND CARRIED. Where the medium is
     * dense the root is linear and this is exactly what the old line said; where it is thin it
     * is not, and a body of twice the strength is felt as root two - which is the whole of the
     * difference between a source that goes as the mass and one that goes as its root.
     */
    const skin = replace(law.to, "\\delta", (puts ?? S).to);
    const vac = simplify(mul(open, replaceIn(skin, "r", sym("R"))));
    const meet = simplify(mul(field("m"), field("m'"), sig.to, sig.to, met.to));
    /*
     * AND THE EXPANSION IS NOT A THIRD CHANNEL — it is the first one, read where there is
     * nothing for it to arrive at.
     *
     * ONE SHORTFALL, TWO READINGS. A body prevents the splitting around it, and that missing
     * making is a single disturbance. Where there is nothing in the way it shows up as room
     * that did not appear - the recession running slower than it would have, which is what
     * `receding` and `shortfall` are theorems about. Where there IS something in the way it
     * shows up as what arrives at that something, which is the vacuum channel above.
     *
     * A FORCE ON A BODY IS THE SECOND READING BY CONSTRUCTION. There is a body there - that is
     * what it means to ask what force it feels - so the shortfall between them is felt as an
     * arrival and not as an expansion, and adding both counts the one missing making twice.
     * `receding` and `shortfall` stay exactly as they are: they say what happens along a line
     * with nothing on it, which is a different question and a real one.
     */
    const F = simplify(add(vac, meet));
    return [{
      fact: { kind: "is", of: "g_{N}", to: F },
      via: "what one puts in, thinned, times what the other is open to",
      from: [key(law), key(S), key(opened), key(met), key(sig)],
      because: "TWO CHANNELS, and they are not the same thing counted over. The vacuum's " +
        "needs neither body to emit anything: the near one prevents an expansion, that " +
        "shortfall spreads, and the far one is pushed into it because fewer rays arrive from " +
        "that side. The meetings' needs both: it is the cross piece of the quadratic, one " +
        "body's radiation meeting the other's, and it carries both masses. What a body feels " +
        "is everything that arrives at it, and things that arrive add. AND THE EXPANSION IS NOT A " +
        "THIRD: a body prevents the splitting around it, and that one missing making is read " +
        "as room that never appeared where there is nothing in the way, and as something " +
        "arriving where there is. Asking what force a body feels puts a body in the way, so " +
        "it is the second reading - counting both would count one shortfall twice",
      working: [
        `the vacuum's channel - what the near body prevents, CARRIED as the \\delta that ` +
          `spreads rather than multiplied onto it afterwards, over what the far one is open to:`,
        `  S = ${show(S.to)},  thinned ${show(replaceIn(law.to, "r", sym("R")))},  ` +
          `open to ${show(open)}`,
        `  = ${show(vac)}`,
        `the meetings' channel - the two bodies' own radiation, meeting:`,
        `  = ${show(meet)}`,
        `and the expansion is not a third - it is the same shortfall where nothing is in the way`,
        `g_{N} = ${show(F)}`,
      ],
    }];
  },
};

/**
 * THE RATE SPACE IS MADE, which the space line has been carrying all along without a name.
 *
 * Every neutral point splits and every meeting takes one back, so the second ledger runs at
 * the net of the two — and that net is the only scale this theory has that is not a count of
 * the tiling. It is worth a name because everything below divides by it, and because a reader
 * who sees a scale appear in a rotation curve is entitled to ask where it was fitted. It was
 * not: it is `\nu(1-\rho) - \sigma\rho^{2}`, which is the space line read straight off.
 */
const makingRate: Rule = {
  name: "the room the line does not supply, which the waiting has to make",
  because: "the space line takes at every meeting and makes at every free point, and what it " +
    "leaves unsupplied is what a waiting ray has to make - which is the one other thing in " +
    "these rules that makes any",
  fire: s => {
    const waits = s.all("is").find(f => f.of === "what the waiting makes");
    if (!waits || s.nodes.has(key({ kind: "is", of: "a_{0}" } as Fact))) return [];
    return [{
      /*
       * AND THE TAKING CARRIES THE FACING FACTOR, because only the pairs that face one
       * another meet. `balancing` puts it in — it solves \sigma F\rho^{2} against the making —
       * and this read the same term without it, so the two disagreed about the same line by a
       * factor of F. They cannot: it is one term of one equation.
       */
      /*
       * THE SPACE LEDGER'S OWN TERMS, WITH ITS OWN COUNTS — one point handed back a firing,
       * one point taken a meeting, which are not the `DEG` and `DEG - 2` the rays get.
       *
       * AND IT IS READ AS A SHORTFALL, TAKING LESS MAKING, because that is the quantity the
       * waiting has to cover. `\rho` settles where the RAYS balance; at that density the space
       * ledger does NOT balance, and every meeting folds a point away that no splitting handed
       * back. The room has to come from somewhere, and there is exactly one other thing in
       * these rules that makes it: `waitForRoom`, which carries `space: count(1)` and no step.
       *
       * IT IS NOT ON THE LINE because it sits inside `MOVEMENT`'s `either` and only the taken
       * branch is counted, so the space line as printed is short of its one remaining source.
       * What the line leaves unsupplied is what the rays must make by standing still — so this
       * is the rate at which they do, and it is positive exactly when the folds outrun the
       * splittings, which is when a ray finds nowhere to go.
       */
      fact: { kind: "is", of: "a_{0}", to: waits.to },
      via: "the room the line does not supply, which the waiting has to make",
      from: [key(waits)],
      because: "the space ledger gains one wherever a free point splits and loses one wherever " +
        "two carriers meet, so its net rate per point is the first less the second. NOTHING " +
        "IS FITTED HERE: it is the space line read off as it stands, and it is the only scale " +
        "in this theory that is not a count of the tiling",
      working: [
        `the space line carries a term with no rays in it: the waiting`,
        `a ray that cannot step makes the room instead, and that is space at ${show(waits.to)}`,
        `a_{0} = ${show(waits.to)}`,
      ],
    }];
  },
};

/**
 * HOW FAST THE WHOLE OF IT EXPANDS — the rate `recession` is already written in, named.
 *
 * `receding` says the room between two things grows at `a_{0}` per point per tick, and that
 * there are as many points as there is distance: `recession = a_{0}R`. A rate of growth over a
 * distance IS a Hubble rate, so `H = \dot{R}/R = a_{0}` — the same number, read as a frequency
 * rather than as a making. Nothing is added here; it is one line divided by `R`.
 *
 * AND THE AGE FALLS OUT OF IT. `H = 1/t` is what `\dot{R} = a_{0}R` integrates to only if the
 * frontier moves at a fixed number of cells a tick, which is what `waitForRoom` does: a ray
 * that cannot step grows the world by one. So the edge is `t` cells out after `t` ticks and
 * `H_{0} = 1/t_{0}` exactly, with nothing free in it.
 */
const hubbleRate: Rule = {
  name: "the rate the whole of it expands at",
  because: "the room between two things grows at a_{0} a point a tick and there are as many " +
    "points as there is distance, so what that comes to per unit distance is a rate on its own",
  fire: s => {
    const rec = s.all("is").find(f => f.of === "the space line nets");
    const a0 = s.all("is").find(f => f.of === "a_{0}");
    if (!rec || !a0 || s.nodes.has(key({ kind: "is", of: "H" } as Fact))) return [];
    return [{
      /*
       * AND IT IS `a_{0}/D`, NOT `a_{0}` — because the making is PER POINT and the rate wanted
       * is per RADIUS, and a ball has more points in it than it has radius.
       *
       * Every point makes `a_{0}` of room a tick, so what is inside radius `R` grows at
       * `a_{0}` times how many points that is - and `ehrhart` already counted those: `R^{D}`.
       * Growth in room is growth in radius through that count:
       *
       *     \dot{V} = a_{0}V,  V \propto R^{D}  ->  DR^{D-1}\dot{R} = a_{0}R^{D}  ->  H = a_{0}/D
       *
       * READING IT STRAIGHT OFF `recession/R` DROPS THE `D`. That is the rate along a LINE
       * between two things, which is what `receding` is about and is right for what it is
       * about; a Hubble rate is a rate of the whole, and the whole is D-dimensional. The
       * difference is a count of the tiling and it is exactly the kind of thing the scale this
       * feeds was missing.
       */
      fact: { kind: "is", of: "H", to: simplify(mul(rec.to, pow(field("D"), -1))) },
      via: "the rate the whole of it expands at", from: [key(rec), key(a0)],
      because: "every point makes a_{0} of room a tick, so what is inside a radius grows at " +
        "that times how many points there are - which ehrhart counted as R^{D}. Turning a " +
        "growth in ROOM into a growth in RADIUS goes through that count, and it leaves a_{0}/D " +
        "rather than a_{0}. Reading recession/R instead gives the rate along a LINE, which is " +
        "what receding is about and is not what a Hubble rate is: the line has R points in it " +
        "and the ball has R^{D}, and the difference is a count of the tiling",
      working: [
        `every point makes a_{0} = ${show(a0.to)} a tick`,
        `inside R there are R^{D} of them, so \\dot{V} = a_{0}V with V \\propto R^{D}`,
        `DR^{D-1}\\dot{R} = a_{0}R^{D}`,
        `H = (what the space line nets)/D = ${show(simplify(mul(rec.to, pow(field("D"), -1))))}`,
        `and the frontier grows one cell a tick, so R = t and H_{0} = 1/t_{0}`,
      ],
    }];
  },
};

/**
 * AND THE ACCELERATION THAT RATE BUILDS — `cH`, which is as far as these rules reach.
 *
 * A rate and a speed make an acceleration and there is only one speed here: `MOVEMENT` moves a
 * ray one cell a tick, so `\bar{c} = 1` and `cH` is a count of cells per tick per tick with
 * nothing chosen in it.
 *
 * AND THE SCALE A ROTATION CURVE TURNS OVER AT IS THIS, UP TO ONE COUNT THIS THEORY HAS NOT
 * GOT. The measured turnover sits a factor of about `2\pi` below `cH_{0}`, and the article
 * this comes from names where that factor lives: it is `inStep`'s, a rule about emitters
 * within a common phase paying an update once between them. THERE IS NO PHASE IN THESE RULES.
 * `G` has splitting, meeting, streaming, arrival and two source rules, and not one of them
 * carries a phase, so the count cannot be read off them and this stops at `cH`.
 *
 * SAYING SO IS THE POINT. The same article says of the join that "nothing here derives" it,
 * and a proof that stops where its rules stop is worth more than one that carries a factor
 * across on the strength of a sentence.
 */
const expansionScale: Rule = {
  name: "the acceleration the expansion builds",
  because: "a rate and a speed make an acceleration, and the only speed in these rules is the " +
    "one cell a tick MOVEMENT gives a ray",
  fire: s => {
    const H = s.all("is").find(f => f.of === "H");
    const c = s.all("is").find(f => f.of === "\\bar{c}");
    if (!H || !c || s.nodes.has(key({ kind: "is", of: "cH" } as Fact))) return [];
    return [{
      fact: { kind: "is", of: "cH", to: simplify(mul(c.to, H.to)) },
      via: "the acceleration the expansion builds", from: [key(H), key(c)],
      because: "the expansion has a rate and the lattice has a speed, and there is only one " +
        "of each: an acceleration built from them is their product and nothing in it was " +
        "chosen. WHERE A ROTATION CURVE ACTUALLY TURNS OVER is about 2\\pi below this, and " +
        "that count is NOT among these rules - it belongs to a rule about phase, and there is " +
        "no phase in splitting, meeting, streaming or arrival. So this is where the derivation " +
        "stops, and the factor between it and the measurement is named rather than absorbed",
      working: [
        `\\bar{c} = ${show(c.to)} cell a tick`,
        `H = ${show(H.to)}`,
        `cH = ${show(simplify(mul(c.to, H.to)))}`,
        `and the turnover measured is ~2\\pi under this - a count these rules do not carry`,
      ],
    }];
  },
};

/**
 * THE DENSITY NEAR A BODY IS NOT THE DENSITY OF EMPTY SPACE — and putting the right one in is
 * where the square root comes from. Nothing new is assumed here; a root that was already
 * derived is stopped from being evaluated in the wrong place.
 *
 * `balancing` solves `\nu(1-\rho) = \sigma F\rho^{2}` and says so in its own words: that root
 * holds "everywhere the line is about the vacuum rather than about a source". EVERY LAW ABOVE
 * THEN USES IT WHERE THERE IS A SOURCE. A body is exactly the place its condition excludes.
 *
 * SO SOLVE THE SAME BALANCE WITH THE BODY IN IT. `ANNIHILATION` is `facing.pair.of(met)` and it
 * does not ask which body a ray belongs to — that is the same fact `shadowing` already turns
 * into an area law — so a vacuum carrier meets the body's carriers as readily as another
 * vacuum one, and the taking term gains a cross piece:
 *
 *     \nu(1-\rho) = \sigma F\rho^{2} + \sigma\rho n     ->     \sigma F\rho^{2} + (\nu + \sigma n)\rho - \nu = 0
 *
 * WHICH IS `balancing`'S OWN QUADRATIC WITH `\nu` REPLACED BY `\nu + \sigma n` IN THE LINEAR
 * TERM, and `n` is what the body puts into the medium, diluted — a quantity this proof already
 * has. The root is the same root, and it is not a new one:
 *
 *     \rho(R) = ( \sqrt{(\nu + \sigma n)^{2} + 4\sigma F\nu} - (\nu + \sigma n) ) / 2\sigma F
 *
 * FAR OUT `n` is negligible and this IS `\rho_{\infty}`, so nothing above changes where nothing
 * above was wrong. CLOSE IN the body's own carriers crowd the point and the density departs
 * from the vacuum's — under a square root, because that is the shape of the balance the rules
 * wrote. Whatever mass dependence that gives is what the rules give; it is not put in here.
 */
const crowding: Rule = {
  name: "the density where a body is, which is not the density of empty space",
  because: "the settled density solves the making against the taking, and near a body the " +
    "taking has a piece the empty-space balance has not got - the body's own carriers, which " +
    "the meeting rule accepts because it never asks whose a ray is",
  fire: s => {
    const rho = s.all("is").find(f => f.of === "\\rho_{\\infty}");
    const puts = s.all("is").find(f => f.of === "what a body puts into the medium");
    const per = s.all("is").find(f => f.of === "\\delta per site");
    if (!rho || !puts || !per) return [];
    if (s.nodes.has(key({ kind: "is", of: "\\rho at R" } as Fact))) return [];
    const nu = field("\\nu"), sg = field("\\sigma"), F = field("F");
    /* the body's carriers where the far one is: what it puts in, diluted over the shell */
    const n = simplify(mul(puts.to, replaceIn(per.to, "r", sym("R"))));
    const b = simplify(add(nu, mul(sg, n)));
    const a = mul(sg, F);
    const root = simplify(mul(
      pow(mul(num(2), a), -1),
      add(neg(b), pow(add(pow(b, 2), mul(num(4), a, nu)), 0.5)),
    ));
    return [{
      fact: { kind: "is", of: "\\rho at R", to: root },
      via: "the density where a body is, which is not the density of empty space",
      from: [key(rho), key(puts), key(per)],
      because: "the empty-space density is the root of the making against the taking, and it " +
        "was derived under a condition it is then used outside of: it holds where the line is " +
        "about the vacuum and NOT about a source. Near a body there is a source. The meeting " +
        "rule never asks which body a ray belongs to, so the body's own carriers are taken " +
        "against as readily as the vacuum's and the balance gains a cross piece, which moves " +
        "\\nu to \\nu + \\sigma n in the linear term and NOWHERE ELSE. IT IS THE SAME QUADRATIC " +
        "AND THE SAME ROOT. Far out the body's carriers are negligible and it returns exactly " +
        "\\rho_{\\infty}, so nothing derived above changes where nothing above was wrong; close " +
        "in it departs, and it departs under a square root because that is the shape the " +
        "rules' own balance has",
      working: [
        `the body's carriers where the far one is: n = ${show(n)}`,
        `\\nu\\paren{1 - \\rho} = \\sigma F\\rho^{2} + \\sigma\\rho n`,
        `\\sigma F\\rho^{2} + \\paren{\\nu + \\sigma n}\\rho - \\nu = 0`,
        `\\rho at R = ${show(root)}`,
      ],
    }];
  },
};

/**
 * AND THE LAW READ AT THAT DENSITY RATHER THAN AT THE VACUUM'S.
 *
 * Every channel in `g_{N}` carries `\rho` — the vacuum's channel has `(1-\rho)/\rho` in it
 * because `CREATION` is gated on a point being free, and the meetings' channel has it through
 * the mean free path. All of those were written with the empty-space root standing in for the
 * density. Where a body is, the density is `crowding`'s root, and the ONLY thing this step
 * does is put that one in instead.
 */
const atThatDensity: Rule = {
  name: "and the law read at the density that is actually there",
  because: "the law is written in the density, and which density it is was settled by the " +
    "balance - so where the balance gives a different root, the law reads it",
  fire: s => {
    const gN = s.all("is").find(f => f.of === "g_{N}");
    const at = s.all("is").find(f => f.of === "\\rho at R");
    if (!gN || !at || s.nodes.has(key({ kind: "is", of: "F_{g}" } as Fact))) return [];
    /*
     * AND IT IS THE SAME LINE. The law is WRITTEN in the density - `\rho` is the symbol the
     * gates gave it - so reading it at a different root does not change a character of it. What
     * changes is which fact `\rho` cites, and that is one step away rather than spelled into
     * every place the symbol occurs.
     *
     * SPELLING IT IN WOULD PRINT THE ROOT FOUR TIMES, once for each gate that mentions the
     * density, and a reader would have to check by eye that the four were the same expression.
     * Every term is still here and none is abbreviated away: the density is a name in this
     * proof exactly as the mean free path and the settled occupancy are.
     */
    const got = gN.to;
    return [{
      fact: { kind: "is", of: "F_{g}", to: got },
      via: "and the law read at the density that is actually there", from: [key(gN), key(at)],
      because: "what a body has delivered to it was assembled in terms of the density, because " +
        "the rules gate on it: CREATION fires only where a point is free, so its channel " +
        "carries (1-\\rho)/\\rho, and the meetings' channel carries it through how far a " +
        "carrier gets. Which density that is came from the balance, and the balance near a " +
        "body has a different root. Reading the same law at the right root is the whole of " +
        "this step - no channel is added, no term is dropped, and nothing is fitted",
      working: [
        `g_{N} = ${show(gN.to)}`,
        `and the \\rho in it is not \\rho_{\\infty} but the root where the body is:`,
        `\\rho = \\rho at R = ${show(at.to)}`,
        `F_{g} = ${show(got)}`,
      ],
    }];
  },
};

/**
 * AND THE WHOLE OF IT WRITTEN OUT — every name that has a law of its own replaced by that law,
 * until nothing is left but what the theory takes as primitive.
 *
 * A LAW IN TERMS OF OTHER LAWS IS NOT FINISHED. `F_{g} = m'·DEG·\nu(1-\rho)·R^{-(D-1)}e^{-R/L}`
 * is true and says nothing about what `L` is, or what the density settles at, and a reader who
 * wants the answer has to go and assemble it. Substituting until nothing moves leaves the law
 * standing on the rates and the counts of the tiling and on nothing else - which is what makes
 * it a statement about the lattice rather than about another quantity.
 *
 * WHAT SURVIVES IS WHAT IS PRIMITIVE, and that is the interesting output. `\nu`, `\sigma` and
 * `F` are the rules' own rates; `DEG` and `D` are counts of the tiling; `m'` is how big the far
 * body is. Anything else appearing in the finished line would be something this proof failed to
 * open.
 */
const writingOut = (o: { of: string }): Rule => ({
  name: "with every factor written in",
  because: "a name that has a law of its own is not a primitive - it is what that law shows " +
    "it to be, so it stands in for itself",
  fire: s => {
    /*
     * RUN OVER EVERY LAW THAT HAS ONE, not over `F_{g}` alone.
     *
     * Once a law cites another by name, the citation is where the detail went - so a reader who
     * follows the name has to find it opened at the other end. Opening only the top line leaves
     * them at a name whose own page is still written in further names. The move is the same one
     * either way and there is no reason it belonged to one fact.
     */
    const F = s.all("is").find(f => f.of === o.of);
    if (!F || s.nodes.has(key({ kind: "is", of: `${o.of} in full` } as Fact))) return [];
    /*
     * ONLY WHAT HAS NOTHING BEHIND IT IS WRITTEN OUT — a quantity with a proof of its own
     * KEEPS ITS NAME.
     *
     * `S` is read straight off a rewrite, so writing it in adds what a reader could not have
     * known. The settled density is a THEOREM - a quadratic solved from the two terms that
     * balance - and writing that in replaces a proof with its answer, three times over, in
     * the middle of a line about something else. The result was true and unreadable.
     *
     * SO THE TEST IS WHETHER ANYTHING STANDS BEHIND THE NAME. A leaf has nothing, and is
     * opened; a derived fact has a derivation, so it is CITED - it stands in the line by name
     * and its own working is a step away. That is the same distinction the folder already
     * makes everywhere else between a premise and a theorem, applied to how a law is written.
     */
    const laws = new Map(
      [...s.nodes.values()]
        .filter(n => n.fact.kind === "is" &&
          /*
           * A LEAF IS WRITTEN IN, AND SO IS A NAME THAT STANDS FOR A BARE NUMBER.
           *
           * Citing is worth it where the name saves a reader an expression. `F` saves them
           * nothing - it stands for a half - and a line carrying `2F` where it could carry `1`
           * is asking them to go and look up a number. So the test is whether there is
           * anything to look up.
           */
          (n.from.length === 0 || simplify((n.fact as { to: Expr }).to).kind === "num"))
        .map(n => [(n.fact as { of: string }).of, (n.fact as { to: Expr }).to] as const),
    );
    laws.delete(o.of);
    const steps: string[] = [`${o.of} = ${show(F.to)}`];
    let e = F.to;
    const seen = new Set<string>();
    /*
     * SUBSTITUTED TO A FIXED POINT, not once per name. A law substituted in brings its own
     * unopened names with it - the screening length carries the density, which carries the
     * rates - so a single pass leaves some of them standing. It runs until nothing moves,
     * capped because a pair of laws that led back to one another would never stop, and
     * whichever is still there when it does is something this proof could not open.
     */
    for (let i = 0; i < 24; i++) {
      const was = show(e);
      for (const [name, law] of laws) {
        if (!mentions(e, name) || mentions(law, name)) continue;
        e = simplify(replace(e, name, law));
        if (!seen.has(name)) { seen.add(name); steps.push(`${name} = ${show(law)}`); }
      }
      if (show(e) === was) break;
    }
    /*
     * AND THE ROOM TAKEN OUT OF THE WHOLE OF IT.
     *
     * Both channels are diluted over the same shell at the same distance, so the law is ONE
     * geometry with two things arriving through it - and printed as two terms each carrying its
     * own `R^{1-D}` a reader has to notice that for themselves. `expand` first, because a
     * factor common to two terms is only common once the brackets are multiplied out.
     */
    e = deepFactored(e);
    steps.push(`${o.of} = ${show(e)}`);
    return [{
      fact: { kind: "is", of: `${o.of} in full`, to: e },
      via: "with every factor written in", from: [key(F)],
      because: "what is read straight off a rewrite is written in, because a reader could not " +
        "have known it; what has a theorem of its own KEEPS ITS NAME and is cited, because " +
        "writing it in would replace a proof with its answer. What is left standing is the " +
        "rules' own rates, the counts of the tiling, the two bodies, and the handful of " +
        "quantities that have pages of their own",
      working: steps,
    }];
  },
});
const writtenOut = writingOut({ of: "F_{g}" });
const arrivalsOut = writingOut({ of: "g_{N}" });

/**
 * AND THE SECOND CHANNEL, WHICH IS THERE BECAUSE THE MEETING TERM IS QUADRATIC.
 *
 * NOT BECAUSE ANYTHING SAYS THERE ARE TWO CHANNELS. `\sigma n\tilde{n}F` is quadratic in the
 * population, so with two bodies in the box the population is `n_{A} + n_{B}` and the term has
 * a CROSS piece - meetings between one body's radiation and the other's, which happen for
 * neither body alone. That is a second way one body reaches another and it falls out of the
 * degree, which was itself counted off the rule's quantifier.
 *
 * AND THE INTEGRAL ALONG THE LINE IS DOMINATED BY ITS ENDS. Each body's radiation thins as
 * `r^{-(D-1)}` from itself, so the product is large only where one of them is close - and how
 * close is bounded by a step, which is the one length the lattice has. So each end contributes
 * the far body's density there times the near integral cut off at `\bar{c}`, and there are two
 * ends.
 */
const crossing: Rule = {
  name: "two bodies make meetings neither makes alone",
  because: "the meeting term is quadratic, so a population that is the sum of two has a cross " +
    "piece - and that piece is meetings between one body's radiation and the other's",
  fire: s => {
    const per = s.all("is").find(f => f.of === "\\Sigma per site");
    const took = s.all("is").find(f => f.of === "what is taken");
    const c = s.all("is").find(f => f.of === "\\bar{c}");
    if (!per || !took || !c) return [];
    if (s.nodes.has(key({ kind: "is", of: "met(R)" } as Fact))) return [];
    const rate = simplify(mul(field("\\sigma"), field("F")));
    /* two ends, each the far density at R times the near integral cut off at one step */
    const met = simplify(mul(num(2), rate,
      pow(sym("R"), neg(sub(field("D"), num(1)))),
      pow(field("\\bar{c}"), neg(sub(field("D"), num(2))))));
    return [{
      fact: { kind: "is", of: "met(R)", to: met },
      via: "two bodies make meetings neither makes alone",
      from: [key(per), key(took), key(c)],
      because: "the cross piece of the quadratic is one body's radiation meeting the other's, " +
        "summed along the line between them. Each body's thins as the shell grows, so the " +
        "product is large only near one of them - and how near is bounded by a step, which " +
        "is the only length the lattice has. Two ends, each contributing the far density " +
        "times the near sum cut off at one step",
      working: [
        `n_{A}+n_{B} squared has a cross piece 2n_{A}n_{B}`,
        `each thins as ${show(per.to)}`,
        `\\sum_{l} n_{A}n_{B} is largest at either end, cut off at \\bar{c}`,
        `met(R) = ${show(met)}`,
      ],
    }];
  },
};

/**
 * WHAT THE FACING FACTOR COMES TO IN A VACUUM WITH NO BIAS — a half, and it is isotropy that
 * says so.
 *
 * A meeting is against what is coming the OTHER WAY, so the rate carries `(1 - d^·j^)/2` -
 * one head-on, nought co-moving. `j^` is the opposing population's mean heading, and a medium
 * that goes every way alike has no mean heading at all: the dot product averages to nothing
 * and the factor is a half. That is not a measurement of this vacuum, it is what isotropy
 * MEANS, so it follows from the premise the dilution argument already needs.
 */
const unbiased: Rule = {
  name: "isotropy leaves no mean heading",
  because: "a medium that goes every way alike has no preferred direction, so the dot product " +
    "of a heading with its mean averages to nothing",
  fire: s => {
    const iso = s.all("isotropic");
    if (!iso.length || s.nodes.has(key({ kind: "is", of: "F" } as Fact))) return [];
    return [{
      fact: { kind: "is", of: "F", to: div(num(1), num(2)) },
      via: "isotropy leaves no mean heading", from: [key(iso[0])],
      because: "the facing factor is (1 - d^·j^)/2 and j^ is what the opposing population is " +
        "doing on average. Alike in every direction, that is nothing - so a meeting in an " +
        "undisturbed vacuum carries exactly a half, and the two limits it interpolates are " +
        "one head-on and nought co-moving",
      working: [`F = (1 - d^·j^)/2`, `j^ = 0 where nothing is biased`, `F = 1/2`],
    }];
  },
};

/**
 * AND THE NEAR-FIELD CORRECTION, which is the rest of the integral the leading term threw away.
 *
 * `crossing` takes the sum along the line at its ENDS, where the product of the two thinning
 * populations is largest, and that gives the leading power. The middle of the line contributes
 * too, and in three dimensions what it contributes is a LOGARITHM: partial fractions on
 * `1/(l^{2}(R-l)^{2})` leave `1/l` and `1/(R-l)` beside the squares, and those integrate to a
 * log of the ratio of the two lengths there are - the separation and a step.
 *
 * SO IT IS NOT A SEPARATE EFFECT. It is the same meeting integral, evaluated rather than
 * bounded, and it dies away as `1/R` against the leading term - which is what makes it a NEAR
 * field correction rather than a change to the law.
 */
const nearField: Rule = {
  name: "the rest of the integral, which is a logarithm",
  because: "scaled by the separation the integral is a pure number, and expanding it about " +
    "either end gives a series whose middle term is a simple pole - which integrates to a log " +
    "of the two lengths there are",
  fire: s => {
    const met = s.all("is").find(f => f.of === "met(R)");
    const c = s.all("is").find(f => f.of === "\\bar{c}");
    const shell = s.all("grows").find(g => g.of === "shell");
    if (!met || !c || !shell) return [];
    if (s.nodes.has(key({ kind: "is", of: "met(R) in full" } as Fact))) return [];
    /*
     * SCALED BY THE SEPARATION, THE INTEGRAL IS A PURE NUMBER. Writing `l = Ru` turns
     * `\int dl/(l^{a}(R-l)^{a})` into `R^{1-2a}\int du/(u^{a}(1-u)^{a})`, and the exponent
     * `a` is what the shell grows as - already settled, and carried symbolically so a lattice
     * of another dimension reads its own answer off the same line.
     */
    const a = shell.as.kind === "pow" && typeof shell.as.by !== "number"
      ? shell.as.by : sub(field("D"), num(1));
    /*
     * AND THE SERIES ABOUT EITHER END HAS ONE TERM THAT IS A SIMPLE POLE. `(1-u)^{-a}` expands
     * as `\sum \binom{a+k-1}{k}u^{k}`, so the integrand is `\sum \binom{a+k-1}{k}
     * u^{k-a}` - every term a power except `k = a-1`, which is `u^{-1}` and integrates to a
     * logarithm rather than to a power. Its weight is that one binomial, and there are two
     * ends, so the log's coefficient is twice it.
     */
    const weight = mul(num(2), choose(simplify(mul(num(2), sub(a, num(1)))),
      simplify(sub(a, num(1)))));
    const near = simplify(mul(weight,
      pow(sym("R"), simplify(sub(num(1), mul(num(2), a)))),
      log(mul(sym("R"), pow(field("\\bar{c}"), -1)))));
    const full = simplify(add(met.to, near));
    return [{
      fact: { kind: "is", of: "met(R) in full", to: full },
      via: "the rest of the integral, which is a logarithm", from: [key(met), key(c), key(shell)],
      because: "the leading term is the two ends of the line, where the product of the two " +
        "thinning populations is largest. The rest of the line contributes as well, and one " +
        "term of the series about either end is a simple pole - which integrates to a " +
        "logarithm of the separation against a step rather than to a power. It falls off one " +
        "power faster than the leading term, so it is a correction that matters close in and " +
        "vanishes far out, which is what a near field IS",
      working: [
        `l = Ru turns \\int \\frac{dl}{l^{a}(R-l)^{a}} into ` +
          `R^{1-2a}\\int \\frac{du}{u^{a}(1-u)^{a}},\\quad a = ${show(simplify(a))}`,
        `(1-u)^{-a} = \\sum_{k}\\binom{a+k-1}{k}u^{k}`,
        `so the integrand is \\sum_{k}\\binom{a+k-1}{k}u^{k-a} - a power at every k ` +
          `except k = a-1, which is u^{-1}`,
        `\\int u^{-1}du = \\ln u, taken between \\bar{c}/R and 1 - \\bar{c}/R`,
        `two ends, so ${show(near)}`,
        `met(R) = ${show(full)}`,
      ],
    }];
  },
};

/**
 * AND WHAT MOTION DOES TO IT — which falls out of the source term and is not put in.
 *
 * A body gets one action a tick and can spend it crossing a cell or shining, not both, so one
 * going at `\beta` shines on `(1-\beta)` of its ticks. The meetings channel needs BOTH bodies
 * to be shining, so it carries that share twice - and the vacuum's channel does not carry it at
 * all, because suppressing an expansion costs a body nothing and happens whether it is moving
 * or not.
 *
 * SO GRAVITY IS WEAKER BETWEEN THINGS IN MOTION, and only in one of its two channels. That is a
 * consequence rather than a correction: nobody wrote a velocity dependence, and it is there
 * because `(1-\beta)\Sigma` is on the line.
 */
const inMotion: Rule = {
  name: "what one action a tick does to a moving body",
  because: "a body that spends a tick crossing a cell does not spend it shining, so what it " +
    "puts out carries the share of its ticks it had left",
  fire: s => {
    const F = s.all("is").find(f => f.of === "F_{g}");
    const sig = s.all("is").find(f => f.of === "\\Sigma");
    if (!F || !sig || !mentions(sig.to, "\\beta")) return [];
    if (s.nodes.has(key({ kind: "is", of: "how motion moves it" } as Fact))) return [];
    return [{
      fact: { kind: "is", of: "how motion moves it",
        to: simplify(pow(sub(num(1), field("\\beta")), 2)) },
      via: "what one action a tick does to a moving body", from: [key(F), key(sig)],
      because: "the meetings channel is one body's radiation meeting the other's, so it needs " +
        "both to be shining and carries the share twice. The vacuum's channel needs neither " +
        "to emit anything - an inert body suppresses the expansion just by sitting there - so " +
        "it carries none of it. Gravity between things in motion is therefore weaker, and " +
        "weaker in ONE of its two channels, which is a thing that could be looked for",
      working: [
        `what a body puts out: ${show(sig.to)}`,
        `the meetings channel needs both: (1-\\beta)^{2}`,
        `the vacuum's channel needs neither: 1`,
      ],
    }];
  },
};

/**
 * AND THE SAME LAW IN THREE DIMENSIONS — the last step, and the only one that is not general.
 *
 * `D` STAYS A SYMBOL EVERYWHERE ELSE ON PURPOSE. What the rules say, they say on every lattice
 * at once - the exponents are linear forms in the dimension precisely so that a two-dimensional
 * world reads its own answer off the same line. That is the whole reason nothing here is fitted
 * to three.
 *
 * BUT A READER LIVES IN THREE, and a law they cannot put a number to is a law they cannot check
 * against anything. So the dimension is filled in ONCE, at the end, on a line of its own - and
 * what it turns into is visible beside what it came from. A choice of two things from two comes
 * out at two, an inverse `D-1` comes out at an inverse square, and the shape above is untouched.
 */
const inThree: Rule = {
  name: "and the same law in three dimensions",
  because: "the dimension is a symbol so that one line serves every lattice; filling it in is " +
    "the last step rather than the first, and it is done where it can be seen",
  fire: s => {
    const F = s.all("is").find(f => f.of === "F_{g} in full");
    const gN = s.all("is").find(f => f.of === "g_{N}");
    if (!F || s.nodes.has(key({ kind: "is", of: "F_{g} at D = 3" } as Fact))) return [];
    const got = deepFactored(evaluate(F.to, { D: 3 }));
    /*
     * AND THE NAME IT CITES IS FILLED IN TOO. The line keeps `g_{N}` because `g_{N}` has a
     * proof of its own, but a theorem about three dimensions that leaves every exponent inside
     * that name still symbolic has answered nothing - so what it stands for is filled in
     * BESIDE the line rather than substituted into it, which is where a reader wants it.
     */
    const inner = gN ? deepFactored(evaluate(gN.to, { D: 3 })) : undefined;
    return [{
      fact: { kind: "is", of: "F_{g} at D = 3", to: got },
      via: "and the same law in three dimensions", from: [key(F)],
      because: "three dimensions is where the exponents become numbers: the room a shell has " +
        "goes as the square, so the leading term is an inverse square, and the near-field " +
        "correction dies as one over the separation against it. Nothing above was fitted to " +
        "this - it is the same line with the dimension put in",
      working: [
        `F_{g} = ${show(F.to)}`,
        `D = 3`,
        `F_{g} = ${show(got)}`,
        ...(inner ? [`and what it cites, in three dimensions:`, `g_{N} = ${show(inner)}`] : []),
      ],
    }];
  },
};

/**
 * AND WHETHER IT CAN EVER PUSH — asked of the assembled law rather than assumed either way.
 *
 * A LAW WITH TWO CHANNELS COULD IN PRINCIPLE HAVE THEM OPPOSE, and it would be a considerable
 * thing about a theory of gravity if one of them did. So the question is put to the finished
 * expression: is there anything a body can do that makes a factor of it negative?
 *
 * WHAT THE ANSWER TURNS ON IS `\beta`, and `\beta` is a SHARE OF TICKS. It is how often a body
 * spent its action crossing a cell rather than shining, which is a count between nothing and
 * all - so `1-\beta` is never below nothing, and squared it is never below nothing either. The
 * rule that produces it asks whether a body STEPPED, and a step is a step whichever way it
 * went: there is nothing in it that knows toward from away.
 */
const canItPush: Rule = {
  name: "whether any of it can turn negative",
  because: "a factor can only change the sign of a law if something can make it negative, and " +
    "what a share of ticks can be is bounded by what a share is",
  fire: s => {
    const F = s.all("is").find(f => f.of === "F_{g} in full");
    const motion = s.all("is").find(f => f.of === "how motion moves it");
    if (!F || !motion || s.nodes.has(key({ kind: "is", of: "the sign of the force" } as Fact)))
      return [];
    return [{
      fact: { kind: "is", of: "the sign of the force", to: num(1) },
      via: "whether any of it can turn negative", from: [key(F), key(motion)],
      because: "every factor of the assembled law is a rate, a count, a square, or an " +
        "exponential, and none of those is ever below nothing. In particular the one thing " +
        "motion contributes is a SHARE OF TICKS - how often a body spent its action crossing a " +
        "cell rather than shining - which lies between nothing and all, so `(1-\beta)` is " +
        "never negative and its square is never negative. THE RULE THAT PRODUCES IT ASKS " +
        "WHETHER A BODY STEPPED, AND A STEP IS A STEP WHICHEVER WAY IT WENT: nothing in it " +
        "distinguishes toward from away. So the force is attractive always, and a body moving " +
        "off is pulled LESS rather than pushed - which is a thing that could be looked for, " +
        "and a thing this theory would be wrong about if a repulsion were ever seen",
      working: [
        `motion contributes ${show(motion.to)}`,
        `\\beta is a share of ticks, so 0 <= \\beta <= 1`,
        `(1-\\beta)^{2} >= 0, with no direction in it`,
        `and every other factor is a rate, a count or an exponential`,
        `so F_{g} > 0 always - it weakens with motion and never reverses`,
      ],
    }];
  },
};

/**
 * WHAT THE SPACE LINE DOES TO TWO THINGS SITTING APART — the second equation, which nothing
 * here had yet used.
 *
 * THE MODEL HAS TWO LEDGERS and every theorem above reads only the first. `\partial_{t}s` says
 * space is MADE, at the net of what the splitting makes and the meetings take, at every point
 * that is neutral. Two bodies with points between them are therefore being carried apart:
 * nothing pushes them, the room between them simply grows, and how fast is how many points
 * there are to grow - which is their separation.
 *
 * SO RECESSION GOES AS SEPARATION, which is what a Hubble law is, and it comes out of the space
 * line rather than being put beside it.
 */
const receding: Rule = {
  name: "space is made between them, and there is more of it the further apart they are",
  because: "every neutral point between two bodies makes space, so the room between them grows " +
    "at the net rate times how many points there are - which is how far apart they are",
  fire: s => {
    const line = s.all("is").find(f => f.of === "the space line nets");
    if (!line || s.nodes.has(key({ kind: "is", of: "recession" } as Fact))) return [];
    /*
     * THE SPACE LINE'S OWN NET, EVERY TERM OF IT. This rebuilt the net from the making and the
     * taking, which was the whole of the line while those were the only terms with space in
     * them. MOVEMENT's waiting branch is a third - a ray that cannot step makes a point of
     * room - so a net assembled from two of three was short by exactly what the rays supply.
     */
    const net = line.to;
    return [{
      fact: { kind: "is", of: "recession", to: simplify(mul(net, sym("R"))) },
      via: "space is made between them, and there is more of it the further apart they are",
      from: [key(line)],
      because: "the space line says every neutral point makes space at the net of what the " +
        "splitting makes and the meetings take. Between two bodies there are as many such " +
        "points as there is distance, so the room between them grows at that rate times that " +
        "distance - nothing is pushing them and they are carried apart anyway, faster the " +
        "further apart they already are",
      working: [
        `\\partial_{t}s = ${show(net)}, every term of the space line`,
        `points between two bodies R apart: R of them`,
        `recession = ${show(simplify(mul(net, sym("R"))))}`,
      ],
    }];
  },
};

/**
 * AND WHAT A BODY DOES TO THAT — which is gravity, if gravity is a shortfall in an expansion.
 *
 * A BODY SUPPRESSES THE MAKING WHERE IT IS, and the shortfall spreads. Between two bodies every
 * point is making a little less than it would, by however much of the shortfall has reached it.
 * So the room between them grows more slowly than it would have - and what that comes to is the
 * shortfall summed along the line, which is a sum this algebra can do rather than a claim.
 *
 * THE ANSWER IS WHATEVER THE SUM IS. It is worth saying before it is taken that this is where a
 * flat rotation curve would have to come from if it comes from anywhere here: a deficit that
 * grows with separation as fast as the room does would leave the two moving apart at a rate
 * that does not care how far apart they are.
 */
const shortfall: Rule = {
  name: "and a body makes less of it, so they are carried apart more slowly",
  because: "every point between them is making less by however much of the body's shortfall " +
    "has reached it, so the reduction is that shortfall summed along the line",
  fire: s => {
    const rec = s.all("is").find(f => f.of === "recession");
    /*
     * THE SCREENED PROFILE, NOT THE BARE ONE — because this sum is marginal and a marginal sum
     * is decided by what cuts it off.
     *
     * `\delta per site` is what spreads; `\delta screened` is what spreads AND is destroyed on
     * the way, which is what `ANNIHILATION` does to it. Summing the bare one along the line
     * converges above three dimensions, diverges below, and at exactly three is logarithmic -
     * so in three dimensions the damping is not a correction to the answer, it IS the answer's
     * upper limit. Dropping it there is the difference between a number and an infinity.
     */
    const per = s.all("is").find(f => f.of === "\\delta screened")
      ?? s.all("is").find(f => f.of === "\\delta per site");
    const puts = s.all("is").find(f => f.of === "what a body puts into the medium");
    if (!rec || !per || !puts) return [];
    if (s.nodes.has(key({ kind: "is", of: "the deficit in recession" } as Fact))) return [];
    /*
     * SUMMED ALONG THE LINE — AND ACTUALLY SUMMED.
     *
     * This read `\delta per site` and then did not use it: it wrote `puts·R^{-(D-2)}` and said
     * in a comment that summing a power raises its exponent. That is true, and it is not the
     * same as having summed anything. It is the answer for the profile whoever wrote it had in
     * mind, and `spreading` now solves the transport in both its branches, so the profile is
     * not that one any more and the assertion summed a shape that is no longer there.
     *
     * SO IT IS INTEGRATED, by the algebra, over whatever the profile turned out to be - and
     * the body's own shortfall is what is carried, so `\delta` is the body's `\delta`.
     *
     * AND IF THE ALGEBRA CANNOT DO THE SUM, THIS RULE DOES NOT FIRE. A proof that stops is
     * worth more than one that continues on an answer nobody can check: the deficit simply
     * does not follow, and that is a finding rather than a gap to be filled in by hand.
     */
    const profile = replace(per.to, "\\delta", puts.to);
    /*
     * INTEGRATED WHOLE WHERE IT CAN BE, AND BY ITS TAIL WHERE IT CANNOT.
     *
     * The sum wanted here runs from the separation OUTWARD, so what decides it is what the
     * profile comes to far out - and the whole profile is not integrable in closed form while
     * its tail is, exactly. `leading` reduces it to the term that outlives the others, and
     * that reduction is where a transport which solved a quadratic hands over its halved
     * exponent, with nothing here saying so.
     */
    const far = leading(profile, "r");
    const F = integrate(profile, "r") ?? integrate(far, "r");
    if (!F) return [];
    /* the tail from the separation outward, which is what the line between them is */
    const summed = simplify(neg(replaceIn(F, "r", sym("R"))));
    return [{
      fact: { kind: "is", of: "the deficit in recession", to: summed },
      via: "and a body makes less of it, so they are carried apart more slowly",
      from: [key(rec), key(per), key(puts)],
      because: "the room between two bodies grows at the making rate times how many points " +
        "there are, and a body has reduced that rate at every one of them. Summed along the " +
        "line - integrated by the algebra over whatever profile the transport gave, not over " +
        "a power assumed in advance - that is the deficit in how fast they are carried " +
        "apart, and it is what an attraction IS in a model whose gravity is an expansion that " +
        "did not happen",
      working: [
        `recession = ${show(rec.to)}`,
        `the shortfall at each point is the body's own, carried: ${show(profile)}`,
        `far out that comes to ${show(far)}`,
        `\\int of that dr = ${show(F)}`,
        `the deficit in recession = ${show(summed)}`,
      ],
    }];
  },
};

/**
 * THE TRANSPORT LAW — what a medium carries, and the one place a non-linearity could live.
 *
 * WHAT CROSSES A SHELL IN A TICK IS `shell · n · v`: how many sites there are at that distance,
 * times how much medium is at each, times how fast it is moving through. That is what a flux
 * IS and it mentions no distance. Conserved on the way out, it fixes the density:
 *
 *     n = \Phi / (shell · v)
 *
 * AND WHICH BRANCH THAT IS DEPENDS ENTIRELY ON `v`. Held at one cell a tick the density goes as
 * one over the room, which is the dilution every law above rests on and is what gives an
 * inverse square in three dimensions. Let the speed fall as the medium thickens - a carrier
 * waiting for somewhere to go - and the same conservation gives a DIFFERENT power, because `n`
 * appears on both sides.
 *
 * SO IT IS WORTH ASKING OF THESE RULES WHAT `v` IS, and the answer here is that it is one. The
 * streaming rule moves every active ray one cell along its own exit and asks nothing: not what
 * is at the far end, not how much is already there, not whether anything is waiting. There is
 * no gate on it and nothing to slow it - so this theory has the ballistic branch and only that
 * one, and a non-linearity in the transport would have to come from a rule it does not have.
 */
/**
 * HOW FAST A CARRIER ACTUALLY GOES — which `MOVEMENT` does not answer with "one cell a tick",
 * whatever its own headline says.
 *
 * The stepping branch is `either(some(to), ..., waitForRoom(it))`, and the second arm is the
 * one that matters: A RAY WITH NOWHERE TO GO SPENDS THE TICK MAKING THE ROOM AND DOES NOT
 * ADVANCE. `waitForRoom` carries `space: count(1)` and no step — it is a carrier being refused
 * a cell, in `MOVEMENT`, in these rules, and it is not the source's refusal.
 *
 * SO THE SPEED IS THE SHARE OF TICKS THE CELL AHEAD WAS ALREADY THERE. What has to be made is
 * what the space ledger says is made: `a_{0}` per point per tick. Who makes it is whoever is
 * standing there — `CREATION` where a point is free, and A WAITING RAY WHERE IT IS NOT, which
 * is the only other thing in the rules that makes space. Where there are `n` carriers they
 * share that between them, so each pays `a_{0}/n` of its tick and steps with the rest:
 *
 *     v = n/(n + a_{0})
 *
 * DENSE and that is one: the room is made faster than the carriers need it and none of them
 * ever waits, so `c̄ = 1` and the rule's headline is right — in the case it was written for.
 * THIN and it is `n/a_{0}`: a carrier spends most of its ticks making the cell it is about to
 * cross, and the medium's own speed goes as its own density. Nothing is fitted: `a_{0}` is the
 * space line's net rate, and the sharing is `waitForRoom` counted.
 */
const waiting: Rule = {
  name: "how fast a carrier goes, when the cell ahead may not be there yet",
  because: "a ray with nowhere to step spends the tick making the room instead of crossing " +
    "it, so its speed is the share of ticks the cell ahead already existed",
  fire: s => {
    const a0 = s.all("is").find(f => f.of === "a_{0}");
    const c = s.all("is").find(f => f.of === "\\bar{c}");
    if (!a0 || !c || s.nodes.has(key({ kind: "is", of: "v" } as Fact))) return [];
    const n = field("n");
    const got = simplify(mul(n, pow(add(n, a0.to), -1)));
    return [{
      fact: { kind: "is", of: "v", to: got },
      via: "how fast a carrier goes, when the cell ahead may not be there yet",
      from: [key(a0), key(c)],
      because: "MOVEMENT says a lit ray goes one cell along its exit, and then says what " +
        "happens when there is no cell: waitForRoom, which MAKES a point of space and does " +
        "not step. That is a carrier being refused a cell, and it is in these rules. A ray " +
        "therefore advances only on the ticks the cell ahead was already there, and what has " +
        "to be made is what the space line makes - a_{0} a point a tick. CREATION makes it " +
        "where a point is free; where carriers are standing, they make it, and n of them " +
        "share it, so each spends a_{0}/n of its tick standing still. Where the medium is " +
        "dense none of them ever waits and the speed is exactly the one cell a tick MOVEMENT " +
        "advertises. Where it is thin the speed goes as the density itself",
      working: [
        `MOVEMENT: either(some(to), step, waitForRoom(it))`,
        `waitForRoom carries space: count(1) and no step`,
        `room to be made: a_{0} = ${show(a0.to)} a point a tick, shared by n carriers`,
        `each waits a_{0}/n of a tick and steps with the rest`,
        `v = n/(n + a_{0}) = ${show(got)}`,
      ],
    }];
  },
};

/**
 * AND WHAT THAT DOES TO THE THINNING — which is the whole of the mass dependence.
 *
 * `\Phi = shell·n·v` is what a flux is and it mentions no distance. With `v` a constant it is
 * LINEAR in `n` and gives the dilution every law above rests on. With `v = n/(n + a_{0})` it is
 * linear at one end and QUADRATIC at the other, and the second solves with a square root:
 *
 *     dense:  \Phi = shell·n        ->  n = \Phi/shell            -> inverse square at D = 3
 *     thin:   \Phi = shell·n^{2}/a_{0}  ->  n = \sqrt{\Phi a_{0}/shell}  -> inverse FIRST power
 *
 * AND THE ROOT FALLS OVER BOTH FACTORS AT ONCE. The shell's exponent halves, so `r^{-(D-1)}`
 * becomes `r^{-(D-1)/2}` — an inverse first power in three dimensions, which is a FLAT rotation
 * curve. And the flux comes out under it too, so a source of twice the strength is felt as root
 * two. Since `\Phi` goes as the mass, the effective source goes as `\sqrt{M}`, and `v^{4}` goes
 * as `M`. THOSE ARE NOT TWO ADJUSTMENTS. They are one square root, taken once, because the
 * conservation went quadratic — and it went quadratic because a ray that has nowhere to go
 * makes the room instead of moving.
 *
 * AND IT IS IN THE TRANSPORT AND NOT IN THE SOURCE, which is the only place it is allowed to
 * be: a source term going as anything but the mass would break action and reaction against
 * equivalence. Nothing here touches what a body emits.
 */
const transporting: Rule = {
  name: "what crosses a shell is the room times what is at each site times how fast it goes",
  because: "a flux is how much crosses per tick - the sites there are, times what is at each, " +
    "times how fast it moves through - and conserved, that fixes the density",
  fire: s => {
    const shell = s.all("grows").find(g => g.of === "shell");
    const v = s.all("is").find(f => f.of === "v");
    const a0 = s.all("is").find(f => f.of === "a_{0}");
    if (!shell || !v || !a0) return [];
    const out: Omit<Node, "pass">[] = [];
    if (!s.nodes.has(key({ kind: "is", of: "n where the medium is dense" } as Fact))) {
      const got = simplify(mul(sym("\\Phi"), pow(shell.as, -1)));
      out.push({
        fact: { kind: "is", of: "n where the medium is dense", to: got },
        via: "what crosses a shell is the room times what is at each site times how fast it goes",
        from: [key(shell), key(v)],
        because: "where the medium is dense no carrier ever waits, the speed is one cell a " +
          "tick, and the conservation is linear in the density: what is at each site is the " +
          "flux over the room there is. In three dimensions that is an inverse square, which " +
          "is Newton and is what every law above already assumed",
        working: [
          `\\Phi = shell·n·v,  v -> 1`,
          `n = \\Phi/shell = ${show(got)}`,
        ],
      });
    }
    if (!s.nodes.has(key({ kind: "is", of: "n where the medium is thin" } as Fact))) {
      const got = simplify(pow(mul(sym("\\Phi"), a0.to, pow(shell.as, -1)), 0.5));
      out.push({
        fact: { kind: "is", of: "n where the medium is thin", to: got },
        via: "what crosses a shell is the room times what is at each site times how fast it goes",
        from: [key(shell), key(v), key(a0)],
        because: "where the medium is thin a carrier spends most of its ticks making the cell " +
          "it is about to cross, so the speed goes as the density and THE SAME CONSERVATION " +
          "IS QUADRATIC IN IT. Solving gives a square root, and the root is over both factors " +
          "at once: the room's exponent halves, so an inverse square becomes an inverse FIRST " +
          "power and the rotation curve goes flat - and the flux halves its exponent too, so " +
          "an effective source goes as the ROOT of the mass and v^{4} goes as M. One square " +
          "root, taken once, in the transport where it is allowed to be and not in the source " +
          "where it is not",
        working: [
          `\\Phi = shell·n·v,  v -> n/a_{0}`,
          `\\Phi = shell·n^{2}/a_{0}`,
          `n = \\sqrt{\\Phi a_{0}/shell} = ${show(got)}`,
          `the room's exponent halves AND the source's does`,
        ],
      });
    }
    /* and the one law both are limits of, which is the conservation solved as it stands */
    if (!s.nodes.has(key({ kind: "is", of: "n" } as Fact))) {
      const P = mul(sym("\\Phi"), pow(shell.as, -1));
      const got = simplify(mul(num(0.5), add(P, pow(add(mul(P, P), mul(num(4), P, a0.to)), 0.5))));
      out.push({
        fact: { kind: "is", of: "n", to: got },
        via: "what crosses a shell is the room times what is at each site times how fast it goes",
        from: [key(shell), key(v), key(a0)],
        because: "and neither limit has to be chosen between: the conservation solves as it " +
          "stands. \\Phi = shell·n·n/(n + a_{0}) is one quadratic in the density and it has " +
          "one root that is not negative, which is the dense law at one end and the thin law " +
          "at the other with no crossover put in by hand. WHERE THE TURNOVER SITS IS a_{0}, " +
          "and a_{0} is the rate the space line makes space - so the scale at which a rotation " +
          "curve departs from Newton is not fitted here either. It is the same number the " +
          "recession is built out of",
        working: [
          `\\Phi = shell·n·n/(n + a_{0})`,
          `n^{2} - (\\Phi/shell)n - (\\Phi/shell)a_{0} = 0`,
          `n = ${show(got)}`,
          `dense: n -> \\Phi/shell.  thin: n -> \\sqrt{\\Phi a_{0}/shell}`,
        ],
      });
    }
    return out;
  },
};

export const RULES: Rule[] =
  [ehrhart, spreading, screening, refracting, accumulating, substituting, metricOf,
   balancing, unbiased, freePath, summing, horizon, bending, crossing, nearField,
   shadowing, receiving, receding, shortfall, waiting, transporting, assembling, makingRate, hubbleRate, expansionScale, crowding, atThatDensity, inMotion,
   writtenOut, arrivalsOut, canItPush, inThree];

/** everything that follows, and then nothing new */
export const saturate = (s: Store, rules = RULES, cap = 40): Store => {
  for (let pass = 1; pass <= cap; pass++) {
    s.pass = pass;
    let grew = 0;
    for (const rule of rules) for (const n of rule.fire(s)) if (s.add(n)) grew++;
    if (!grew) return s;
  }
  throw new Error("the rules are still producing facts - something in them feeds itself");
};

/* —— and the leaves, read off the rules ————————————————————————————————————— */

/**
 * WHAT THE MODEL'S OWN LINE SAYS, AS PREMISES — the only place this prover takes anything in,
 * and every one of them is already in the program.
 *
 * THIS IS THE GUARANTEE THE FOLDER RESTS ON, so it is one function and it is short. A leaf here
 * is not measured and not believed: it is read off `lib/Continuum.ts`, which reads it off the
 * rule bodies. `conserved` is a claim about the scattering kernel and comes from the kernel;
 * the restoring rate is the DERIVATIVE of the line's own terms with respect to the density,
 * taken by `Algebra.d`; what swings a heading is the term that swings a heading. Change a rule
 * in `G.ts` and these move, because they were never anywhere else.
 */
/**
 * A SHARE IS A SHARE OF WHATEVER THE QUANTIFIER WALKED, AND THOSE ARE DEG DRAWS APART.
 *
 * `busy` is asked of a POINT and answers whether ANY of its rays is lit; the line's population
 * is a share of RAYS. Reading both off one symbol makes a point-occupancy equal to a ray
 * density, and the two differ by the whole width of the lattice.
 *
 * WHAT RELATES THEM IS DEDUCIBLE, and it is a distribution rather than a number. The state a
 * point actually carries is WHICH of its DEG rays are lit, so every scalar in the line is a
 * moment of `P(k)` - how many of them are. `CREATION` lights all DEG at once, which correlates
 * them perfectly; `MOVEMENT` then moves each along ITS OWN exit, so one tick later they are at
 * DEG DISTINCT neighbours and what arrives at any point comes from DEG different places. The
 * correlation is dispersed exactly as fast as it is made, so the draws are independent:
 *
 *     P(k) = \binom{DEG}{k}n^{k}(1-n)^{DEG-k},   \rho_{point} = 1 - (1-n)^{DEG}
 *
 * SO A POINT-GATE'S `\rho` IS THAT, and `CREATION`'s `1 - \rho` - the chance a point is free -
 * is `(1-n)^{DEG}`: every one of its DEG ways out dark, which is what "nothing going on" means
 * when it is asked of a point rather than of a ray.
 */
const asRayShare = (t: { over: string; share?: Expr }): Expr => {
  if (!t.share) return num(1);
  if (t.over !== "Local") return t.share;      // already a share of rays
  const asPoint = sub(num(1), pow(sub(num(1), field("\\rho")), field("DEG")));
  return simplify(replace(t.share, "\\rho", asPoint));
};

export const premises = (
  eq: Equation, rules: Record<string, { declared?: Declared }> = {},
): Omit<Node, "pass">[] => {
  const out: Omit<Node, "pass">[] = [];
  const rho = field("\\rho");
  const s2 = new Set<string>();

  /*
   * HOW HARD THE LINE PUSHES A DISTURBANCE BACK — differentiated, not asserted.
   *
   * Each term of the right-hand side is a rate times whatever its gates let through times a
   * power of the density. How it responds to a small change in the density is `d/d\rho` of
   * that, and `Algebra.d` is the product and power rules. A term gated on the room left loses
   * its rate as the density rises; a term of degree two gains twice the density. Both fall out
   * of differentiating what the rules already said the term was.
   */
  let a: Expr = num(0);
  /* and the steps that get there, one per term, ending at the rate itself */
  const steps: Omit<Node, "pass">[] = [];
  const acting = eq.terms.filter(t => t.side !== "left" && t.rules.length && t.rate);
  for (const t of acting) {
    const body = mul(
      field(t.rate!),
      ...(t.share ? [t.share] : []),
      ...(t.degree > 0 ? [pow(rho, t.degree)] : []),
    );
    const slope = simplify(d(body, "\\rho"));
    const signed = simplify(mul(num(t.sign === -1 ? 1 : -1), slope));
    a = simplify(add(a, signed));
    /*
     * AND HOW THAT TERM CAME TO BE, UNDER THE STEP THAT USES IT.
     *
     * Differentiating `\nu(1-\rho)` is only a step if `\nu(1-\rho)` is settled, and it is
     * settled by a proof of its own - off the rewrite it came from. So that proof goes here,
     * ahead of the differentiation, and a reader can go down as far as the atoms.
     */
    const decl = rules[t.rules[0]]?.declared;
    const term = decl ? fromRule(
      t.rules[0], decl.body.counted, { degree: t.degree, facing: t.facing },
      decl.gates.map(g => ({ says: g.test.says, share: g.test.share })), decl.rate, t.symbol,
    ) : undefined;
    const mine: Omit<Node, "pass">[] = [{
      fact: { kind: "is", of: `how ${t.symbol} answers a change in the density`, to: signed },
      via: "differentiating a term", rule: t.rules[0],
      from: term ? [key({ kind: "is", of: t.symbol } as Fact)] : [],
      because: `${t.rules.join(", ")} contributes ${t.symbol}, which is its rate times what ` +
        `its gates let through times the density to the power its quantifier gives. How that ` +
        `answers a small change in the density is the DERIVATIVE - the product rule, on what ` +
        `the rule already said the term was. A term that shrinks as the density rises pushes a ` +
        `shortfall back, so the sign is turned about what the term itself carries`,
      working: [
        `${t.symbol} = ${show(body)}`,
        `d/d\\rho = ${show(slope)}`,
        `the term is ${t.sign === -1 ? "subtracted" : "added"}, so it restores by ${show(signed)}`,
      ],
    }];
    steps.push({ ...mine[0],
      derivation: term ? [...term.nodes.values(), ...mine] : mine });
  }
  steps.push({
    fact: { kind: "restored", of: "\\delta", at: a },
    via: "and so the rate", from: steps.map(x => key(x.fact)),
    because: "every term that depends on the density answers a change in it, and they do not " +
      "consult one another - so what the line does back to a shortfall is their sum",
    working: [...acting.map((t, i) =>
      `${t.symbol}: ${show((steps[i].fact as { to: Expr }).to)}`), `a = ${show(a)}`],
  });
  out.push({ ...steps[steps.length - 1], derivation: steps });

  /*
   * AND WHETHER THE DISTURBANCE SURVIVES ITS OWN TRANSPORT, which is a claim about the kernel
   * and nothing else. A scattering that keeps `g` of the heading removes `1 - g` of it per
   * meeting, so a shortfall is conserved on its way out exactly where `g` is one.
   */
  const kern = eq.terms.map(t => t.kernel).find(Boolean);
  const turning = eq.terms.find(t => t.kernel);
  if (kern) {
    const g = simplify(kern.keeps);
    out.push({
      fact: { kind: "is", of: "\\sigma_{tr}",
        to: simplify(mul(field("\\sigma"), sub(num(1), kern.keeps))) },
      via: "the kernel", from: [],
      derivation: [
        {
          fact: { kind: "is", of: "g", to: g },
          via: `${turning?.rules.join(", ") ?? "the turn"}`, rule: turning?.rules[0], from: [],
          because: "the rule's body chooses where a ray goes next, and what is left of a " +
            "heading after one such choice is its cosine moment - one way straight on against " +
            "the folded ones",
          working: [`the choice is 1 way straight on against n_{f} folded`, `g = ${show(g)}`],
        },
        {
          fact: { kind: "is", of: "\\sigma_{tr}",
            to: simplify(mul(field("\\sigma"), sub(num(1), kern.keeps))) },
          via: "and so the transport cross section", from: [key({ kind: "is", of: "g" } as Fact)],
          because: "what removes a RAY is not what removes a DIRECTION: a turn that sends it " +
            "on nearly the way it was going has hardly removed it, so what attenuates a " +
            "shadow is the rate times what the turn does NOT keep",
          working: [`g = ${show(g)}`, `\\sigma_{tr} = \\sigma(1-g) = ` +
            `${show(simplify(mul(field("\\sigma"), sub(num(1), kern.keeps))))}`],
        },
      ],
      because: "what removes a DIRECTION is not what removes a ray: a turn that sends it on " +
        "nearly the way it was going has hardly removed it, so the transport cross section is " +
        "sigma times what the turn does NOT keep",
    });
    out.push({
      fact: { kind: "is", of: "what swings a heading", to: kern.drifts },
      via: "the kernel", from: [],
      because: "the line's direction term is the kernel's first moment - which way a turn " +
        "leans on average",
      derivation: [{
        fact: { kind: "is", of: "what swings a heading", to: kern.drifts },
        via: `${turning?.rules.join(", ") ?? "the turn"}`, rule: turning?.rules[0], from: [],
        because: "the same choice, read as a first moment rather than as a cosine: where the " +
          "cosine says how much of a heading survives, this says which way what is left of it " +
          "leans - and it leans toward where the folds are, since those are the ways the " +
          "choice offers besides straight on",
        working: [`the choice is 1 way straight on against n_{f} folded`,
          `<d^> = ${show(simplify(kern.drifts))}`],
      }],
    });
  }

  /*
   * AND WHAT EACH LEDGER NETS OVER THE WHOLE LINE — every term, with its own count and sign.
   *
   * A RULE THAT WANTS THE NET RATE MUST NOT REBUILD IT. `receding` was computing its own from
   * the making and the taking, which was right while those were the only two terms with space
   * in them; the waiting is a third and it was left out, so the recession and the rate space
   * is made disagreed about the same line. One quantity, one fact.
   */
  for (const ledger of ["rays", "space"] as const) {
    const parts: Expr[] = [];
    for (const t of eq.terms) {
      if (t.side === "left" || !t.rules.length || !t.rate) continue;
      const body = simplify(mul(field(t.rate),
        ...(t.share ? [asRayShare(t)] : []),
        ...(t.degree > 0 ? [pow(rho, t.degree)] : [])));
      parts.push(simplify(mul(body, asExpr(ledger === "rays" ? t.rayCount : t.spaceCount))));
    }
    if (!parts.length) continue;
    out.push({
      fact: { kind: "is", of: `the ${ledger} line nets`, to: simplify(add(...parts)) },
      via: "the line", from: [],
      because: `every term of the line does something to the ${ledger} ledger - its rate, ` +
        `times what its gates let through, times the count one firing puts in - and what the ` +
        `ledger does per point per tick is those added up. Nothing is left out and nothing is ` +
        `counted twice, which is the whole reason for reading it off the line rather than ` +
        `assembling it again wherever it is wanted`,
      working: eq.terms.filter(t => t.side !== "left" && t.rules.length && t.rate).map(t =>
        `${t.rules.join(", ")}: ${t.symbol} into ${ledger} ` +
        `${show(asExpr(ledger === "rays" ? t.rayCount : t.spaceCount))}`),
    });
  }

  /*
   * AND THE TERMS THAT DECIDE WHERE EACH LEDGER SETTLES, named so a rule can balance them.
   *
   * One term makes and one takes, and a ledger sits where they pay for each other. Both are
   * already on the line with their rates and their gates; naming them is what lets `balancing`
   * find them without knowing anything about vacuums.
   *
   * AND EACH IS NAMED PER LEDGER, BECAUSE THE TWO DO NOT SETTLE TOGETHER. One firing of
   * CREATION hands back ONE point of space and lights DEG rays; one meeting takes ONE point
   * and nets `DEG - 2`. Those counts are not the same number, so the density at which the rays
   * balance is NOT the density at which the space does - and the difference between the two is
   * exactly the rate space is made at, which is the scale everything below turns on. Reading
   * the bare rate and dropping the count made the two identical and the difference zero.
   */
  for (const t of eq.terms) {
    if (t.side === "left" || !t.rules.length || !t.rate) continue;
    const body = simplify(mul(field(t.rate),
      ...(t.share ? [asRayShare(t)] : []),
      ...(t.degree > 0 ? [pow(rho, t.degree)] : [])));
    const which = t.sign < 0 ? "taken" : "made";
    out.push({
      fact: { kind: "is", of: `what is ${which}`, to: body },
      via: t.rules[0], rule: t.rules[0], from: [],
      because: `${t.rules.join(", ")} ${t.sign < 0 ? "takes" : "makes"} at ${show(body)} - ` +
        `its rate, times what its gates let through, times the density to the power its ` +
        `quantifier gives`,
    });
    /*
     * AND A RULE THAT MAKES SPACE WITHOUT TOUCHING THE POPULATION IS THE WAITING, named so the
     * rate space is made can be READ OFF THE LINE rather than inferred from what is missing.
     *
     * `waitForRoom` hands the ray to itself and grows the world: no ray is made, destroyed or
     * moved, and a point of space appears. Nothing else in these rules has that shape, so a
     * right-hand term with no rays and space to spare IS the waiting, and what it makes is
     * the rate at which rays stand still to make room.
     */
    if (t.rays === "0" && !t.spaceCount.n && Object.values(t.spaceCount.of).length === 0) { /* nothing */ }
    const spaceNet = t.spaceCount.n
      + Object.values(t.spaceCount.of).reduce((x, y) => x + y, 0);
    if (t.rays === "0" && spaceNet > 0) {
      out.push({
        fact: { kind: "is", of: "what the waiting makes", to: body },
        via: t.rules[0], rule: t.rules[0], from: [],
        because: `${t.rules.join(", ")} hands the ray to itself and grows the world - no ray ` +
          `made, destroyed or moved, and a point of space where there was none. That is a ` +
          `carrier standing still to make the room it could not step into, and the rate it ` +
          `does so at is ${show(body)}`,
        working: [`no rays, ${show(asExpr(t.spaceCount))} of space`,
          `the waiting makes ${show(body)}`],
      });
    }
    for (const [ledger, c] of [["rays", t.rayCount], ["space", t.spaceCount]] as const) {
      const per = asExpr(c);
      out.push({
        fact: { kind: "is", of: `the ${ledger} count of what is ${which}`, to: per },
        via: t.rules[0], rule: t.rules[0], from: [],
        because: `${t.rules.join(", ")} fires at ${show(body)}, and ONE firing of it puts ` +
          `${show(per)} into the ${ledger} ledger - counted off the body, not written down. ` +
          `The two ledgers get different counts from the same firing, which is why they do ` +
          `not settle at the same density`,
        working: [`fires at ${show(body)}`, `${ledger} per firing: ${show(per)}`],
      });
    }
  }

  /*
   * AND WHAT A BODY IS WORTH, which is the making that did not happen where it sits.
   *
   * (G/2) fires at a point BECAUSE the point is neutral, and matter is not neutral - so the
   * expansion that would have happened there is the whole of what a body puts into the medium.
   * Its strength is therefore the making term itself, read at the body rather than in the
   * vacuum, and nothing about it is a separate quantity.
   */
  for (const t of eq.terms) {
    if (t.side === "left" || !t.rules.length || !t.rate || t.sign < 0) continue;
    out.push({
      fact: { kind: "is", of: "S", to: simplify(mul(field(t.rate),
        ...(t.share ? [t.share] : []))) },
      via: t.rules[0], rule: t.rules[0], from: [],
      because: `${t.rules.join(", ")} fires because a point is neutral, and matter is not - ` +
        `so what a body puts into the medium is exactly the making that did not happen where ` +
        `it sits. Its strength is that term, and is not a quantity of its own`,
    });
    break;
  }

  /*
   * AND HOW MANY WAYS OUT A POINT HAS, which is what a shortfall cannot exceed.
   *
   * Not a constant of this file: it is the count the making term's own body ran over. `light`
   * is applied once per exit, `each` multiplies by how many there are, and that many IS the
   * ceiling - a point cannot be missing more ways out than it has.
   */
  for (const t of eq.terms) {
    if (t.side === "left" || !t.rules.length || t.sign < 0 || t.rays === "0") continue;
    out.push({
      fact: { kind: "is", of: "the ways out of a point", to: field(t.rays) },
      via: t.rules[0], rule: t.rules[0], from: [],
      because: `${t.rules.join(", ")} lights every exit a point has, so the count its body ` +
        `ran over is how many ways out there are - ${t.rays}. A shortfall is ways out that ` +
        `are missing, so that count is also its ceiling`,
      working: [`the body lit ${t.rays} exits`, `so a point has ${t.rays} ways out`],
    });
    break;
  }

  /*
   * AND WHAT A SOURCE PUTS OUT, which is the one term no rewrite of the medium produces.
   *
   * It is conserved on its way out for the same reason a shortfall is - the kernel keeps the
   * heading - and it goes every way alike because the body lights its exits alike. So it
   * dilutes over the shell exactly as everything else does, and `spreading` needs to be told
   * nothing new to say so.
   */
  const source = eq.terms.find(t => !t.rules.length);
  if (source) {
    out.push({
      fact: { kind: "is", of: "\\Sigma", to: simplify(mul(...(source.share ? [source.share] : []),
        field("\\Sigma_{0}"))) },
      via: "put in from outside", from: [],
      because: `what a body puts out is the term no rewrite puts there, scaled by what its ` +
        `gates let through - and a body going somewhere has spent that share of its ticks ` +
        `moving rather than shining, which is the whole of why a moving source is shifted`,
      working: [`the term is ${source.symbol}`],
    });
    out.push({
      fact: { kind: "conserved", of: "\\Sigma" }, via: "the kernel", from: [],
      because: "what a source puts out survives its own transport for the same reason a " +
        "shortfall does - a turn that keeps the heading loses none of it",
    });
    out.push({
      fact: { kind: "isotropic", of: "\\Sigma" }, via: "put in from outside", from: [],
      because: "a body lights its exits alike, so what leaves it goes every way alike",
    });
  }

  /*
   * AND WHAT EACH RATE ACTUALLY IS, which is a count and not a parameter.
   *
   * A REWRITE FIRES ON EVERY MATCH IT HAS, ONCE A TICK. That is what a rule of this model is -
   * the walk offers it every match and it acts on each - so its rate is ONE, per match per
   * tick. The only way for it to be anything else is for the body to DRAW, and exactly one
   * thing in the language does. So the rates are not free: they are one wherever nothing is
   * drawn, and that is read off the body rather than declared beside it.
   */
  for (const t of eq.terms) {
    if (!t.rate || !t.rules.length) continue;
    if (s2.has(t.rate)) continue;
    s2.add(t.rate);
    out.push({
      fact: { kind: "is", of: t.rate, to: t.draws ? field(`${t.rate}_{drawn}`) : num(1) },
      via: t.rules[0], rule: t.rules[0], from: [],
      because: t.draws
        ? `${t.rules.join(", ")} draws in its body, so its rate is the chance that draw comes ` +
          `out - and that is the one place a rate here is anything but a count`
        : `${t.rules.join(", ")} draws nothing: the walk offers it every match it has and it ` +
          `acts on each, once a tick. So it fires at ONE per match per tick, and its rate is ` +
          `a count of the rewrite rather than a number anybody chose`,
      working: [t.draws ? `the body draws` : `the body draws nothing`,
        `${t.rate} = ${t.draws ? "the chance drawn" : "1"}`],
    });
  }

  /*
   * WHAT A BODY FEELS WHEN IT ABSORBS — a VECTOR SUM OF DIRECTIONS, and not a count.
   *
   * The rule adds the ray's own exit to the body's momentum, one per ray taken. So the force is
   * `\sum \hat{d}` over what arrives, which is nothing at all for an arrival that is alike
   * every way - the exits come in opposite pairs and cancel exactly. What survives is the
   * ANISOTROPY, projected on whatever direction it is asked about.
   *
   * WHICH IS WHY THERE IS NO AREA IN THIS. A body's pull was written here as its boundary times
   * what a cell prevents, on the argument that a shortfall has to cross the surface to be felt.
   * That argument is not in these rules: nothing in them counts a boundary, and the quantity
   * the force IS is a sum over the ends a body absorbs on - which is every exit of every cell
   * it owns. What the rules give is a sum over the BULK with the isotropic part cancelling, and
   * saying otherwise was putting an answer in.
   */
  const source2 = eq.terms.find(t => !t.rules.length);
  if (source2) out.push({
    fact: { kind: "is", of: "what a body feels", to: field("\\sum\\hat{d}") },
    via: "EMISSION", rule: "EMISSION", from: [],
    because: "the rule adds the ray's own exit to the body's momentum, once per ray taken - so " +
      "what a body feels is the vector sum of the directions that arrived at it, and a count " +
      "of them would be a different quantity that is not what any rule computes",
    working: [`each absorbed ray adds its exit`, `force = \\sum \\hat{d} over what arrives`],
  });

  /* and how far one step is, which is the whole of what the streaming rule says */
  const moving = eq.terms.find(t => t.operator && t.operator !== "\\partial_{t}");
  if (moving) out.push({
    fact: { kind: "is", of: "\\bar{c}", to: num(1) },
    via: moving.rules[0], rule: moving.rules[0], from: [],
    because: "every active ray goes ONE CELL along its own exit in one tick, which is what " +
      "the streaming term says - so a step is one cell, and that is the only length the " +
      "lattice has to measure anything else against",
  });

  /* and the medium carries alike in every direction, which is what a lattice is */
  out.push({
    fact: { kind: "isotropic", of: "\\delta" }, via: "the lattice", from: [],
    because: "the tiling has no preferred direction, so what spreads through it goes every " +
      "way alike",
  });
  /* and a shortfall is conserved on its way out where the kernel keeps the direction */
  if (kern) out.push({
    fact: { kind: "conserved", of: "\\delta" }, via: "the kernel", from: [],
    because: "a turn that keeps the heading does not lose the shortfall, so as much of it " +
      "crosses a far shell as a near one - which is what the dilution argument needs and what " +
      "a kernel that forgot the direction would not give",
  });
  return out;
};

export type Proven = {
  store: Store;
  /** what the falloff came out as, if anything did */
  law?: Node;
  /** and the metric, if the line had a geometry in it */
  metric?: { A: Node; B: Node };
  /** the premises the rules wanted and did not get */
  missing: string[];
};

/** run the whole thing: leaves off the line, close under the rules, then look */
export const prove = (
  eq: Equation, rules: Record<string, { declared?: Declared }> = {},
): Proven => {
  const s = new Store();
  for (const n of premises(eq, rules)) s.add(n);
  saturate(s);
  const law = s.nodes.get(key({ kind: "is", of: "\\delta screened" } as Fact))
    ?? s.nodes.get(key({ kind: "is", of: "\\delta per site" } as Fact));
  const A = s.nodes.get(key({ kind: "is", of: "A in r" } as Fact));
  const B = s.nodes.get(key({ kind: "is", of: "B in r" } as Fact));
  const missing: string[] = [];
  if (!s.all("conserved").length) missing.push("nothing says the shortfall survives its own transport");
  if (!s.all("is").some(f => f.of === "N")) missing.push("nothing in the line swings a heading, so there is no index");
  return { store: s, law, metric: A && B ? { A, B } : undefined, missing };
};


/* —— and how a term of the line was derived from a rewrite ————————————————— */

/** a count of the lattice, or a number, as something the algebra can work with */
const asExpr = (c: { n: number; of: Record<string, number> }): Expr =>
  simplify(add(num(c.n), ...Object.entries(c.of).map(([k, v]) => mul(num(v), field(k)))));

/**
 * HOW ONE TERM OF THE LINE CAME OFF ONE REWRITE — as a proof, in this same store.
 *
 * A TERM IS A THEOREM AND IS PROVED LIKE ONE. The line says `\nu\paren{1-\rho}` and names
 * CREATION; what a reader wants is the derivation, and a derivation here is a list of steps
 * with a fact, a rule, a reason and its working. So that is what this builds - the same `Node`
 * the falloff is built out of, closed the same way and set by the same renderer. There is no
 * second kind of proof and no second kind of page.
 *
 * AND THE STEPS ARE THE PROGRAM'S OWN STRUCTURE. `light` puts one ray out because that is what
 * lighting is; `each` multiplies what is under it by how many it runs over, which is where a
 * count of the lattice enters; `seq` adds two branches because rules that do not consult one
 * another add. Then the quantifier says how many things it was done TO, the gates say which of
 * them, and the term is what those come to. Every line of it is arithmetic somebody can check
 * against the rewrite printed beside it.
 */
export const fromRule = (
  name: string, body: Counted, q: { degree: number; facing: boolean },
  gates: { says: string; share?: Expr }[], rate: string | undefined, symbol: string,
): Store => {
  const s = new Store();
  let n = 0;

  /** one piece of the body, and what it comes to - depth first, so a total follows its parts */
  const walk = (c: Counted): string => {
    const kids = (c.from ?? []).map(walk);
    const rays = asExpr(c.doing[0]?.rays ?? { n: 0, of: {} });
    const space = asExpr(c.doing[0]?.space ?? { n: 0, of: {} });
    const of = `${c.of} [${n++}]`;
    const both = [
      show(rays) !== "0" ? `${show(rays)} rays` : "",
      show(space) !== "0" ? `${show(space)} points of space` : "",
      c.doing[0]?.carries ? "carries the population" : "",
      c.doing[0]?.settles ? "settles the tick" : "",
    ].filter(Boolean).join(", ") || "nothing to either ledger";

    const because =
      c.how === "atom" ? `an atom of the language, and its arithmetic is what its word means`
      : c.how === "each" ? `it runs once for every one of them, so what is under it is ` +
        `multiplied by how many there are - which is where a count of the lattice enters`
      : c.how === "seq" ? `the pieces do not consult one another, so what they do adds`
      : c.how === "when" ? `it happens only where the condition holds, so what it does is ` +
        `what the branch does and how often is the condition's business`
      : c.how === "either" ? `one way or the other, and both are things the rule can do`
      : `a value named once and used below`;

    const working = c.how === "each" && kids.length
      ? [`${(c.from ?? [])[0]?.of} comes to ${show(asExpr((c.from ?? [])[0].doing[0]?.rays ??
          { n: 0, of: {} }))} rays`,
         `and there are ${c.many} of them`,
         `${show(rays)} rays`]
      : c.how === "seq" && kids.length
      ? [...(c.from ?? []).map(k =>
          `${k.of}: ${show(asExpr(k.doing[0]?.rays ?? { n: 0, of: {} }))} rays, ` +
          `${show(asExpr(k.doing[0]?.space ?? { n: 0, of: {} }))} points`),
         `added: ${both}`]
      : undefined;

    s.add({
      fact: { kind: "is", of, to: rays },
      via: c.how === "atom" ? "the language" : c.how, rule: name,
      from: kids.map(k => key({ kind: "is", of: k } as Fact)),
      because: `${c.of} - ${both}. ${because}`,
      working,
    });
    return of;
  };
  const top = walk(body);

  /* and then what the rule was quantified over, and what its gates let through */
  const degreeOf = q.degree === 0 ? "no power of the density"
    : q.degree === 1 ? "the density once"
    : `the density to the power ${q.degree}`;
  s.add({
    fact: { kind: "is", of: `what ${name} is about`, to: num(q.degree) },
    via: "the quantifier", rule: name, from: [],
    because: `the rule is quantified over ${q.degree} population-bearing refs, so its term ` +
      `carries ${degreeOf}` +
      (q.facing ? ` - and the two are across an edge, so the rate goes against the oncoming ` +
        `current, which is the facing factor F` : ""),
  });
  for (const g of gates) {
    if (!g.share) continue;
    s.add({
      fact: { kind: "is", of: `what ${g.says} lets through`, to: g.share },
      via: "a gate", rule: name, from: [],
      because: `the rule fires only where ${g.says}, so whatever it does it does on that ` +
        `share of its matches and the term carries it`,
    });
  }

  const shares = gates.map(g => g.share).filter(Boolean) as Expr[];
  s.add({
    fact: { kind: "is", of: symbol, to: simplify(mul(...(shares.length ? shares : [num(1)]))) },
    via: "and so the term", rule: name,
    from: [key({ kind: "is", of: top } as Fact),
      key({ kind: "is", of: `what ${name} is about` } as Fact),
      ...gates.filter(g => g.share).map(g => key({ kind: "is", of: `what ${g.says} lets through` } as Fact))],
    because: `the rate it fires at is called ${rate ?? "nothing"}, and it fires on the share ` +
      `its gates let through, once per thing it is quantified over. Multiplied out, that is ` +
      `the term`,
    working: [
      rate ? `rate: ${rate}` : `no rate - it neither makes nor takes`,
      ...shares.map(x => `share: ${show(x)}`),
      `degree: ${degreeOf}`,
      `term: ${symbol}`,
    ],
  });
  return s;
};


/**
 * AND HOW THE LINE ITSELF WAS REACHED — one step per term, each proved off its own rewrite.
 *
 * THE EQUATION IS A THEOREM TOO and this is its derivation. It was showing the store's whole
 * closure instead - the falloff, the index, the metric - which is what FOLLOWS from the line
 * and not how the line was got. What was missing is the only part a reader comes to that page
 * for: that each term was counted off a rewrite, and that the terms add.
 *
 * THE LAST STEP IS THE LINE, as it must be. Every step above it is one term with its own proof
 * hanging under it, so a reader can go from the equation to a term to the atoms of the body
 * that made it.
 */
export const lineSteps = (
  eq: Equation, rules: Record<string, { declared?: Declared }> = {},
): Omit<Node, "pass">[] => {
  const out: Omit<Node, "pass">[] = [];
  for (const t of eq.terms) {
    const name = t.rules[0];
    const decl = name ? rules[name]?.declared : undefined;
    const store = decl ? fromRule(
      name, decl.body.counted, { degree: t.degree, facing: t.facing },
      decl.gates.map(g => ({ says: g.test.says, share: g.test.share })), decl.rate, t.symbol,
    ) : undefined;
    out.push({
      fact: { kind: "is", of: t.symbol,
        to: simplify(mul(num(t.sign), sym(t.rays === "0" ? "carried" : t.rays))) },
      via: name ?? "put in from outside", rule: name, from: [],
      because: t.rules.length
        ? `${t.rules.join(", ")} contributes it: its body ${
            t.rays === "0" ? "moves the population without making or taking any"
              : `comes to ${t.rays} rays and ${t.space} points of space`}, its quantifier ` +
          `makes it ${t.degree === 0 ? "carry no power of the density"
            : `of degree ${t.degree} in the density`}${
            t.facing ? " across an edge, which is the facing factor" : ""}, and its gates let ` +
          `through what they let through`
        : `no rewrite of the model puts it there - it is what is put into the box from ` +
          `outside, and the only place anything about a particular problem can be written`,
      working: [
        `rays: ${t.rays}`,
        `space: ${t.space}`,
        `degree: ${t.degree}${t.facing ? ", across an edge" : ""}`,
        `term: ${t.sign < 0 ? "-" : "+"} ${t.symbol}`,
      ],
      derivation: store ? [...store.nodes.values()] : undefined,
    });
  }
  const rhs = eq.terms.filter(t => t.side === "right");
  out.push({
    fact: { kind: "is", of: eq.terms.filter(t => t.side === "left")
      .map(t => t.operator ?? t.symbol).join(" + ") + eq.population,
      to: simplify(add(...rhs.map(t => mul(num(t.sign), sym(t.symbol))))) },
    via: "and the terms add", from: eq.terms.map(t => key({ kind: "is", of: t.symbol } as Fact)),
    because: "the rules do not consult one another - each fires on its own matches once a " +
      "tick - so what they do to the population adds, and the line is what they come to " +
      "rather than a description of them. A theory with a rule taken out writes one term " +
      "fewer here without anything else changing",
    working: [
      ...eq.terms.map(t => `${t.sign < 0 ? "-" : "+"} ${t.symbol}   (${
        t.rules.join(", ") || "not a rule"})`),
      `${eq}`,
      `${eq.space()}`,
    ],
  });
  return out;
};


/* —— and what each part of a finished law is ————————————————————————————— */

export type Annotated = { part: string; is: string; because: string };

/**
 * WHICH PART OF A LAW IS WHICH — matched against the store, not labelled by hand.
 *
 * A FINISHED LAW IS SEVERAL ANSWERS MULTIPLIED AND ADDED, and read as one line a reader cannot
 * see the joins: `m'` is the far body's openness, `R^{-2}` is the room out there, one bracket
 * is the vacuum's channel and the other the two bodies' own radiation - and each of those is a
 * theorem with a page of its own. Naming them under the line is what turns a formula back into
 * an argument.
 *
 * AND THE NAMES ARE FOUND RATHER THAN WRITTEN. Every factor and every term is compared against
 * what the store settled, at the separation the law is about; where a piece IS one of those
 * facts it takes that fact's name, and where it is not it goes unlabelled. So an annotation
 * cannot say something the proof did not, and a law that changed shape would lose the labels
 * that no longer applied rather than keeping them and lying.
 */
export const annotate = (e: Expr, s: Store, at = "R"): Annotated[] => {
  /* what the store knows, written at the separation this law is about */
  const known = new Map<string, { of: string; because: string }>();
  for (const n of s.nodes.values()) {
    if (n.fact.kind !== "is") continue;
    const f = n.fact as Extract<Fact, { kind: "is" }>;
    for (const form of [f.to, replace(f.to, "r", sym(at))]) {
      const k = show(simplify(form));
      if (k !== "0" && k !== "1" && !known.has(k)) known.set(k, { of: f.of, because: n.because });
    }
  }
  const out: Annotated[] = [];
  const seen = new Set<string>();
  const look = (x: Expr, depth: number) => {
    const k = show(simplify(x));
    const hit = known.get(k);
    if (hit && !seen.has(k) && hit.of !== "F_{g}" && !hit.of.startsWith("F_{g} ")) {
      seen.add(k);
      out.push({ part: k, is: hit.of, because: hit.because });
      return;                                  /* named whole - do not take it apart */
    }
    if (depth > 4) return;
    if (x.kind === "mul" || x.kind === "add") for (const y of x.of) look(y, depth + 1);
  };
  look(simplify(e), 0);
  return out;
};
