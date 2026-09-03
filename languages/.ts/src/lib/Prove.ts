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
import { add, call, choose, d, deepFactored, div, evaluate, exp, Expr, factored, field, gammaInc, grad, integrate, leading, limit, root,
  log, mul, expand, neg, num, pow, show, simplify, sub, swap, sym } from "./Algebra.ts";
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
  /** BUMPED ONLY WHEN SOMETHING NEW LANDS — what tells a rule whether re-running it can help */
  version = 0;
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
    this.version++;
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
    const v = s.all("is").find(f => f.of === "v");
    if (!v) return [];                  // the dwell needs how fast a share gets across
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
      /*
       * AND THE SPEED IS THE ONE `transporting` DERIVES — the share of `turns`'s draw that did
       * not turn the ray. This solved a quadratic in `a_{0}`, the waiting rate, and `waiting`
       * no longer means that: a ray waits only where there is NO CELL AT ALL, which is the
       * frontier, and a law about the bulk cannot be built on it. What slows a carrier
       * everywhere is being turned, and that is `turns`, which is in `MOVEMENT`.
       *
       * SO THERE IS ONE TRANSPORT AND NOT TWO. What is at a site is what crosses it over how
       * fast a share gets across, and nothing here decides the second for itself.
       */
      const flux = simplify(mul(sym(c.of), pow(shell.as, -1)));
      const per = simplify(mul(flux, pow(v.to, -1)));
      out.push({
        fact: { kind: "is", of: `${c.of} per site`, to: per },
        via: "spreading", from: [key(c), key({ kind: "isotropic", of: c.of }), key(shell)],
        because: "count what crosses a shell in one tick - the sites on it, times what is at " +
          "each, times the share of a step that went outward - and MOVEMENT neither makes nor " +
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
          `and it dwells 1/v there, with v = ${show(v.to)} off turns's own draw`,
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
/**
 * WHAT A PLACE HAS SWALLOWED — and it SETTLES, because the rules both make it and unmake it.
 *
 * `fold` leaves a record of which way two points were joined; `unfold` hands one back when a
 * point is handed back. So the fold count has a rate on each side exactly as the population
 * and the room do, and where those two pay for each other is where the record sits:
 *
 *     what the folds line nets  =  0
 *
 * THIS WAS ASSERTED BEFORE, as the flux of what a body prevents, integrated - `S·r^{-(D-2)}`.
 * That is what a body ADDS to the record and it is right about that; it is not the record,
 * because it left out everything the vacuum does to itself and everything `unfold` gives back.
 * A quantity the rules make and unmake in equal measure had been treated as a field sourced
 * only by matter, and `turns` draws on the whole of it.
 *
 * SO THERE ARE TWO PARTS AND BOTH ARE HERE: the vacuum's own, which is where the folds line
 * balances and is the same everywhere, and the body's, which falls off as a flux does. What
 * `turns` sees is the sum, and what a rotation curve reads is how that varies with distance.
 */
const accumulating: Rule = {
  name: "what a place has swallowed, where the folding pays for the handing back",
  because: "a fold is left by a meeting and taken back when a point is handed back, so the " +
    "record settles where those two rates are equal - and a body adds to it on top",
  fire: s => {
    const line = s.all("is").find(f => f.of === "the folds line nets");
    const S = s.all("is").find(f => f.of === "S");
    const made = s.all("is").find(f => f.of === "what is made");
    const took = s.all("is").find(f => f.of === "what is taken");
    if (!line || !S || !made || !took) return [];
    if (s.nodes.has(key({ kind: "is", of: "n_{f}" } as Fact))) return [];
    const D = field("D");
    /* the body's own contribution, one power weaker than the flux, as before */
    const sourced = simplify(mul(S.to, pow(sym("r"), neg(sub(D, num(2))))));
    /*
     * AND THE VACUUM'S OWN LEVEL, WHICH THE BALANCE ALONE DOES NOT GIVE.
     *
     * Setting the folds line to nothing says the making and the handing back pay for each
     * other; it says nothing about HOW MANY folds a place holds while they do, because neither
     * rate mentions the record. What fixes the level is that `unfold` CAN ONLY HAND BACK A
     * FOLD IF THERE IS ONE - a point that has swallowed nothing has nothing to give - so the
     * returning is gated on the record being non-empty and the folding is not.
     *
     * SO IT IS SELF-LIMITING. Empty, nothing is handed back and the meetings pile them up;
     * full, every splitting returns one and the two can balance. The level sits where
     *
     *     what a meeting folds  =  what a splitting hands back  ×  P(the record is not empty)
     *
     * and `P` is that same binomial the point-gates are read through: a place's folds land on
     * DEG distinct ways out and are dispersed by streaming exactly as its rays are, so a
     * record holding `n_{f}` in total is empty with `(1 - 1/DEG)^{n_{f}}` and not otherwise.
     */
    /*
     * AND THE COUNTS COME OFF THE FOLD LEDGER, not from assuming one each way.
     *
     * A meeting makes ONE fold - it joins two points along one direction. A split hands back
     * one PER WAY OUT, because `CREATION` opens the point in every direction at once. Those
     * are `DEG` apart and the ledger already carries both; writing `1` for each was the same
     * mistake as reading the ray counts off the wrong rule.
     */
    const mkF = s.all("is").find(f => f.of === "the folds count of what is made");
    const tkF = s.all("is").find(f => f.of === "the folds count of what is taken");
    if (!mkF || !tkF) return [];
    const held = sub(num(1), pow(sub(num(1), pow(field("DEG"), -1)), field("n_{f}")));
    /* made and returned, each with its own count and sign, and the returning gated on there
     * being something to return */
    const settled = root(simplify(add(mul(tkF.to, field("F"), took.to),
      mul(mkF.to, made.to, held))), "n_{f}");
    const got = simplify(add(settled, sourced));
    return [{
      fact: { kind: "is", of: "n_{f}", to: got },
      via: "what a place has swallowed, where the folding pays for the handing back",
      from: [key(line), key(S)],
      because: "a meeting leaves a fold and handing a point back takes one away, so what a " +
        "place has swallowed is not a tally that only grows - it settles where the two rates " +
        "pay for each other, and that value is the same everywhere the vacuum is left alone. " +
        "A BODY ADDS TO IT: what it prevents spreads, and an accumulation of what arrives is " +
        "one power weaker than the flux. `turns` draws on the sum, so both belong",
      working: [
        `the folds line: ${show(line.to)}`,
        `a meeting makes ${show(tkF.to)}; a split hands back ${show(mkF.to)}, one per way out`,
        `and only where there is one to hand back: P = ${show(held)}`,
        `the vacuum's own level, where the two rates pay for each other: ${show(settled)}`,
        `and a body's, one power weaker than what it prevents: ${show(sourced)}`,
        `n_{f} = ${show(got)}`,
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
    /*
     * AND WHAT IT MAKES IS NAMED AFTER THE LAW ALONE, not after what was put into it - the
     * fact is `<law> in r` whichever quantity stood in. Three things follow, and together they
     * are the difference between this rule costing everything and costing nothing.
     *
     * ONCE A LAW HAS BEEN SUBSTITUTED INTO, THERE IS NOTHING LEFT TO DO WITH IT. The name is
     * taken, and the store keeps the first arrival, so every further pairing for that law is
     * built in full and then dropped. Skipping the law outright is the same store.
     *
     * AND ONE SUBSTITUTION PER LAW IS ALL THAT SURVIVES A PASS, for the same reason - so the
     * inner walk stops at the first that changes anything instead of finishing the row.
     *
     * AND THE LAW AS IT STANDS IS SIMPLIFIED ONCE, not once per quantity it might mention. It
     * does not depend on the quantity at all, and it was inside both loops.
     *
     * This is a hundred thousand pairings a pass over three hundred facts, each simplifying and
     * rendering trees, twenty-one passes deep. It was the whole of the proving time.
     */
    const out: Omit<Node, "pass">[] = [];
    const laws = s.all("is");
    for (const f of laws) {
      /*
       * AND IT DOES NOT SUBSTITUTE INTO ITS OWN OUTPUT.
       *
       * `X in r` is X with everything it mentions written out. Feeding that back in gives
       * `X in r in r`, and again, and again - twenty-one passes of it, each tree carrying the
       * one before it whole. THE TREES GROW EXPONENTIALLY AND SAY NOTHING NEW: writing out
       * what is already written out is the same law with more parentheses. It was the reason
       * every theorem page took the same fifty seconds, which was `show` walking them.
       *
       * One level is what "written out" means, so one level is what it does.
       */
      /*
       * AND A LAW ALREADY WRITTEN OUT IS NOT READ AT ANOTHER DISTANCE EITHER.
       *
       * `X in full` is `X` with everything it cites opened - a form for READING, not a law
       * with names left in it to substitute. Running this over one produces `X in full in r`,
       * which nothing asks for and which costs a simplify and two prints of a three-hundred
       * character tree per candidate. It is the same waste `in r` was already skipped for.
       */
      if (/ in (r|full)$/.test(f.of)) continue;
      if (s.has({ kind: "is", of: `${f.of} in r` } as Fact)) continue;
      const asItStands = show(simplify(f.to));
      for (const g of laws) {
        if (g.of === f.of || !mentions(f.to, g.of)) continue;
        const got = simplify(replace(f.to, g.of, g.to));
        if (show(got) === asItStands) continue;
        const fact: Fact = { kind: "is", of: `${f.of} in r`, to: got };
        out.push({
          fact, via: "substituting", from: [key(f), key(g)],
          because: `${g.of} is not a primitive here - it is what the line above shows it to ` +
            `be, so it stands in for itself`,
          working: [`${f.of} = ${show(f.to)}`, `${g.of} = ${show(g.to)}`,
            `${f.of} = ${show(got)}`],
        });
        break;
      }
    }
    return out;
  },
};

/**
 * A TERM PLUS A ROOT, WRITTEN SO THE TERM APPEARS TWICE INSTEAD OF THREE TIMES.
 *
 * `\frac{1}{2}g_{N} + \sqrt{\frac{1}{4}g_{N}^{2} + g_{N}a_{0}}` names the arrival THREE
 * times, and once the arrival is written out that is three copies of a two-hundred-character
 * expression to say one thing. The identity is exact and needs no pattern:
 *
 *     A + \sqrt{X} = A\paren{1 + \sqrt{1 + \frac{X - A^{2}}{A^{2}}}}
 *
 * and for this law `X - A^{2}` is `g_{N}a_{0}` against `\frac{1}{4}g_{N}^{2}`, so the ratio
 * cancels to `\frac{4a_{0}}{g_{N}}` and the arrival is left standing exactly twice. It is
 * also the form this law is usually written in, which is a second reason to prefer it.
 *
 * KEPT ONLY IF IT DOES NOT MAKE THE LINE LONGER. The identity holds for any `A`, and for some
 * it makes a worse one - a root whose inside does not cancel against the square gains a term
 * rather than losing one. So the two are compared as written and the shorter wins; at equal
 * length the folded one wins, because what is being counted is how many times `A` is written
 * and that is what the substitution will multiply.
 *
 * AND IT IS DONE BEFORE THE SUBSTITUTION, NOT AFTER. `X - A^{2}` cancels while `A` is the
 * SYMBOL `g_{N}`; once `A` is two hundred characters of arrivals, the square inside the root
 * and the square of the term outside it print differently and no collection can match them.
 * Fold first, substitute second, and the two hundred characters land in a template that asks
 * for them twice instead of three times.
 */
const foldRoot = (e: Expr): Expr => {
  if (e.kind !== "add" || e.of.length !== 2) return e;
  const i = e.of.findIndex(x => x.kind === "pow" && x.by === 0.5);
  if (i < 0) return e;
  const A = e.of[1 - i], X = (e.of[i] as Extract<Expr, { kind: "pow" }>).base;
  const sq = simplify(mul(A, A));
  if (show(sq) === "0") return e;
  const inner = simplify(add(num(1), mul(sub(X, sq), pow(sq, -1))));
  const got = simplify(mul(A, add(num(1), pow(inner, 0.5))));
  return show(got).length <= show(e).length ? got : e;
};

/**
 * AND THE SAME ROOT WITH THE OTHER FACTOR CLEARED — which writes the long name ONCE.
 *
 * `A + \sqrt{X}` multiplied above and below by `\sqrt{X} - A` is `\frac{X - A^{2}}{\sqrt{X}
 * - A}`, and pulling `A` out of the root as well gives
 *
 *     A + \sqrt{X} = \frac{\paren{X - A^{2}}/A}{\sqrt{X/A^{2}} - 1}
 *
 * For this law `A = \frac{1}{2}g_{N}` and `X - A^{2} = g_{N}a_{0}`, so the numerator is
 * `2a_{0}` — THE ARRIVAL CANCELS OUT OF IT — and the only place `g_{N}` survives is the
 * `4a_{0}/g_{N}` inside the root:
 *
 *     g = \frac{2a_{0}}{\sqrt{1 + \frac{4a_{0}}{g_{N}}} - 1}
 *
 * ONE OCCURRENCE, in a form that is not recursive. The fold above gets it down to two and no
 * arrangement of `A + \sqrt{A^{2} + q}` gets below that; clearing the surd instead trades the
 * repetitions of `A` for repetitions of `a_{0}`, and `a_{0}` is `\sigma\rho` while `A` is two
 * hundred and fifty characters of arrivals. Which of the two is shorter is therefore not a
 * question with a general answer - it depends on which name is the big one - so both are built
 * and the shorter is kept.
 *
 * AND IT IS FOR READING, NOT FOR EVALUATING. `\sqrt{1 + \epsilon} - 1` loses every digit it
 * has when `\epsilon` is small, which is the strong-field limit - checked against the closed
 * form, the two agree to machine precision out to `g_{N}/a_{0} = 100` and have lost eight
 * digits by `10^{8}`. `F_{g}` keeps the stable form and is what everything evaluates; this is
 * what the page shows.
 */
const clearRoot = (e: Expr): Expr => {
  if (e.kind !== "add" || e.of.length !== 2) return e;
  const i = e.of.findIndex(x => x.kind === "pow" && x.by === 0.5);
  if (i < 0) return e;
  const A = e.of[1 - i], X = (e.of[i] as Extract<Expr, { kind: "pow" }>).base;
  const sq = simplify(mul(A, A));
  if (show(sq) === "0") return e;
  /*
   * AND THE INSIDE OF THE ROOT IS WRITTEN AS `1 + q/A^{2}`, NOT AS `X/A^{2}`.
   *
   * They are the same number and only the first one cancels. `X` is a SUM, and dividing a sum
   * by something does not distribute here - `simplify` gathers like terms and like bases, it
   * does not multiply brackets out - so `X/A^{2}` printed as `4\paren{\frac{1}{4}g^{2} + ga}
   * /g^{2}` with the arrival still standing twice inside it, and the whole rearrangement
   * bought nothing. Subtracting `A^{2}` FIRST leaves `q = ga`, and `q/A^{2}` is one product
   * over another, which does cancel: `4a/g`.
   */
  const q = simplify(sub(X, sq));
  const over = simplify(mul(q, pow(A, -1)));
  const under = simplify(sub(pow(simplify(add(num(1), mul(q, pow(sq, -1)))), 0.5), num(1)));
  if (show(under) === "0") return e;
  return simplify(mul(over, pow(under, -1)));
};

/** a rearrangement applied everywhere it occurs in a law rather than only at the top */
const everywhere = (f: (e: Expr) => Expr) => {
  const go = (e: Expr): Expr => {
    const inner: Expr = e.kind === "add" ? add(...e.of.map(go))
      : e.kind === "mul" ? mul(...e.of.map(go))
      : e.kind === "pow" ? pow(go(e.base), typeof e.by === "number" ? e.by : go(e.by))
      : e.kind === "root" ? root(go(e.of), e.in)
      : e;
    return f(simplify(inner));
  };
  return go;
};

const folded = everywhere(foldRoot);
const cleared = everywhere(clearRoot);

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
    /* an unsolved equation mentions whatever its body does, except the name it binds - and a
     * limit mentions whatever its body does, except the name it sends out */
    : e.kind === "root" || e.kind === "limit" ? e.in !== name && mentions(e.of, name)
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
    /*
     * AND INSIDE AN EQUATION THAT HAS NOT BEEN SOLVED, which this did not reach at all.
     *
     * `the g where g_{N}(1 + a_{0}/g) - g = 0` is a law like any other and the names in it are
     * open to substitution like any others - but with `root` falling through to `default` the
     * body was untouchable, so a written-out form of it came back with `g_{N}` still standing.
     * The one name that must NOT be touched is the unknown itself: it is bound by the `where`,
     * and putting a law in its place would be answering the question with itself.
     */
    case "root": return e.in === name ? e : root(replace(e.of, name, by), e.in);
    case "limit": return e.in === name ? e : limit(replace(e.of, name, by), e.in);
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
    /*
     * AND THE COUNTS CARRY THEIR OWN SIGN, so they ADD.
     *
     * A firing puts `DEG` rays in and a meeting takes two out - and the ledger says so: its
     * count is `-2`, not `2`. Subtracting a count that is already negative makes both terms
     * of the balance positive and the equation has no root at all, which is exactly what it
     * had. The line's own signs are the line's own; nothing here should be putting them back.
     */
    /*
     * AND THE OTHER LINE'S SHARE IS FILLED IN FIRST, or this is one equation in two unknowns.
     *
     * The line carries `\rho`, which this solves for, and `\omega`, which the SPACE line
     * solves for - and `\omega`'s answer is written in `\rho`. Left standing, the two roots
     * cite each other and nothing can be evaluated. Substituted, this is a single equation in
     * a single unknown, which is what it was before the second share existed.
     *
     * IT IS NOT SPECIAL-CASED TO A NAME: whatever the other ledger has already settled gets
     * written in, and if it has settled nothing this is unchanged.
     */
    let body = simplify(add(mul(mkC.to, made.to), mul(tkC.to, field("F"), took.to)));
    for (const f of s.all("is"))
      if (f.of !== "\\rho" && !mentions(f.to, f.of) && mentions(body, f.of))
        body = simplify(replace(body, f.of, f.to));
    const rootOf = root(body, "\\rho");
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
        `${show(mkC.to)}·${show(made.to)} + ${show(tkC.to)}·F·${show(took.to)} = 0`,
        `\\rho_{\\infty} = ${show(rootOf)}`,
      ],
    }];
  },
};

/**
 * THE BALL AND ITS SHELL, BY NAME — the two counts every law below is written against.
 *
 * `ehrhart` establishes that the places at exactly `r` steps go as `r^{D-1}` and the places
 * WITHIN `r` as `r^{D}`, and both are counts of walks over `exits`. They have been used
 * anonymously ever since - a `r^{-(D-1)}` here, a shell there - which is fine while the only
 * thing being diluted is a flux, and not fine once a BODY has a size, because then the same
 * two counts are asked about the body as about the distance.
 *
 * SO THEY GET NAMES. `l.shell(R)` is how many places are one step out from a place, read at any
 * radius; `l.ball(R).count` is how many places are within `R`. At `R = 1` the shell IS `DEG` -
 * the ways out of a point are the discrete sphere of radius one - so the lattice's degree is
 * not a separate input at all, it is this count read at its smallest argument.
 */
const counting: Rule = {
  name: "the ball and the shell it is bounded by",
  because: "`ehrhart` counts the places within r steps and the places at exactly r, both off " +
    "`exits`, and a body has a size - so the same two counts answer how big it is and how far " +
    "away it is",
  fire: s => {
    const grows = s.all("grows").find(g => g.of === "shell");
    const ways = s.all("is").find(f => f.of === "the ways out of a point");
    if (!grows || !ways) return [];
    if (s.nodes.has(key({ kind: "is", of: "l.shell(R)" } as Fact))) return [];
    const D = field("D");
    const ball = pow(sym("R"), D);
    const shell = replaceIn(grows.as, "r", sym("R"));
    return [{
      fact: { kind: "is", of: "l.DEG", to: ways.to },
      via: "the ball and the shell it is bounded by", from: [key(ways)],
      because: "the ways out of a point, which is `l.shell` read at one - the discrete sphere " +
        "of radius one. It gets a name of its own because a place that has swallowed folds has " +
        "more ways THROUGH it than its own exits, so whether this is the tiling's count or the " +
        "tiling's count plus the record is a question about the rules and wants one place to " +
        "be answered in",
      working: [`l.DEG = l.shell(1) = ${show(ways.to)}`],
    }, {
      fact: { kind: "is", of: "l.shell(R)", to: shell },
      via: "the ball and the shell it is bounded by", from: [key(grows)],
      because: "the places at exactly R steps out, which `ehrhart` counts off the ways out of " +
        "a point - and at R = 1 it is the ways out themselves, so DEG is this same count read " +
        "at one rather than a number of its own",
      working: [`l.shell(R) = ${show(shell)}`, `l.shell(1) = ${show(ways.to)} = DEG`],
    }, {
      fact: { kind: "is", of: "l.ball(R).count", to: ball },
      via: "the ball and the shell it is bounded by", from: [key(grows)],
      because: "the places WITHIN R steps, which is the shell summed over every radius up to " +
        "R - one power higher, by the same count of walks",
      working: [`l.ball(R).count = \\sum_{r}^{R} l.shell = ${show(ball)}`],
    }];
  },
};

/**
 * WHAT A BODY OF A GIVEN SIZE IS WORTH — the mass, written in the two counts and nothing else.
 *
 * A SOURCE HAS EXACTLY TWO THINGS TO SAY ABOUT ITSELF: how often it lets its surroundings know
 * (`\\bar{m}_{x}`, a share of ticks, which is `EMISSION`'s own rate and the only thing the rules
 * leave to a body) and how big it is (`R`). Everything else in the line below is the lattice's
 * or the vacuum's.
 *
 *     m = \\bar{m}_{x}·l.shell(1)·\paren{1-\rho}·l.shell·\lambda·
 *           \paren{1 - \paren{1 - \frac{1}{\lambda}}^{l.ball(R).count/l.shell}}
 *
 * READ IT LEFT TO RIGHT. `\\bar{m}_{x}` is how often; `l.shell(1)` is how many ways one cell has to
 * say it, which is `DEG`; `1-\rho` is because lighting a lit ray does nothing, so only the
 * dark exits take an emission; and the rest is `shadowing` in the ball's own counts - an inner
 * cell's rays are annihilated crossing the ones in front of it, so what gets out is the skin,
 * one mean free path deep.
 *
 * AND THE DEPTH IS `l.ball(R).count/l.shell`, which is the body's own thickness in cells - the
 * places inside it over the places on its boundary. That is what `shadowing`'s `m/A` was, said
 * in the counts rather than in two free symbols.
 */
const massOf: Rule = {
  name: "what a body of that size sends",
  because: "a source says how often it emits and how big it is, and everything else is the " +
    "lattice's counting and the vacuum's - so the mass is those two put through the skin law",
  fire: s => {
    const shell = s.all("is").find(f => f.of === "l.shell(R)");
    const ball = s.all("is").find(f => f.of === "l.ball(R).count");
    const lam = s.all("is").find(f => f.of === "\\lambda");
    const ways = s.all("is").find(f => f.of === "the ways out of a point");
    if (!shell || !ball || !lam || !ways) return [];
    if (s.nodes.has(key({ kind: "is", of: "\\bar{m}\\paren{R}" } as Fact))) return [];
    const dark = sub(num(1), field("\\rho"));
    const deep = div(ball.to, shell.to);                    /* the body's thickness, in cells */
    const skin = simplify(mul(shell.to, lam.to,
      sub(num(1), pow(sub(num(1), pow(lam.to, -1)), deep))));
    /*
     * AND WHAT ONE EMISSION IS WORTH IS A CHOICE OVER THE WAYS OUT, not a bare product.
     *
     * A source emitting at `\bar{m}_{x}` over `l.DEG` ways lights `\bar{m}_{x}l.DEG` of them,
     * and WHICH ones is a choice the lattice offers. `l.choose` is that, carried by name: what
     * it comes to is a question about the tiling and is not answered here, so a law written in
     * terms of it is carried symbolically rather than given a number nobody derived.
     */
    const lit = call("l.choose", simplify(mul(field("\\bar{m}_{x}"), field("l.DEG"))));
    const got = simplify(mul(lit, dark, skin));
    return [{
      fact: { kind: "is", of: "\\bar{m}\\paren{R}", to: got },
      via: "what a body of that size sends", from: [key(shell), key(ball), key(lam)],
      because: "EMISSION is the one rule a body owns, and all it says is how often. So a " +
        "body's mass is that share, times the ways one cell has to announce itself, times the " +
        "share of those that are dark enough to take it, times how many of its cells can get " +
        "their rays out at all - which is `shadowing`, and which saturates at the skin because " +
        "an inner cell's output is annihilated crossing its neighbours. TWO THINGS ARE THE " +
        "SOURCE'S, \\bar{m}_{x} and R; everything else here is a count of the tiling or a rate the " +
        "rules already fixed",
      working: [
        `l.shell at one = ${show(ways.to)}, and only ${show(dark)} of the exits are dark`,
        `the body is ${show(deep)} cells thick`,
        `shadowing lets out ${show(skin)}`,
        `\\bar{m}\\paren{R} = ${show(got)}`,
      ],
    }];
  },
};

/**
 * AND THE MASS ITSELF IS THAT, AT INFINITY — an intensive quantity, defined by a limit.
 *
 * `\bar{m}\paren{R}` is what a body of radius `R` sends, and it has no limit: it goes as
 * `l.shell`, which grows for ever. That is a fact about how much stuff there is, not about
 * what the stuff IS. WHAT DOES NOT DEPEND ON THE BODY is what it sends per unit of the face
 * it sends through, once the face is all there is left:
 *
 *     \bar{m} = \lim_{R \to \infty} \frac{\bar{m}\paren{R}}{l.shell}
 *             = \bar{m}_{x}·l.shell(1)·\paren{1-\rho}·\lambda
 *
 * A BODY CANNOT ANNOUNCE MORE THAN ONE MEAN FREE PATH OF ITSELF PER UNIT OF FACE. Everything
 * deeper is doused crossing what is in front of it, so past that size adding more of the same
 * stuff adds face and nothing else - and since what is felt is `m/l.shell` read at a distance
 * rather than at the body, THE SURFACE GRAVITY OF A LARGE BODY SATURATES. In Newton it grows
 * without bound as a body is made bigger at fixed density; here it stops, at a value the
 * vacuum fixes and no source can exceed.
 *
 * IT IS ALSO WHY THE SAME RELATION HAS TWO SLOPES. Below the bound a body is transparent and
 * its mass goes as its volume; above it, as its face. The Tully-Fisher exponent is one or the
 * other end of this limit and not two rules.
 */
const saturating: Rule = {
  name: "the mass, which is that at infinity",
  because: "the skin law saturates once a body is deeper than a mean free path, so the mass " +
    "per unit face stops depending on the body and becomes a property of the vacuum",
  fire: s => {
    const m = s.all("is").find(f => f.of === "\\bar{m}\\paren{R}");
    const shell = s.all("is").find(f => f.of === "l.shell(R)");
    const lam = s.all("is").find(f => f.of === "\\lambda");
    const ways = s.all("is").find(f => f.of === "the ways out of a point");
    if (!m || !shell || !lam || !ways) return [];
    if (s.nodes.has(key({ kind: "is", of: "\\bar{m} solved" } as Fact))) return [];
    /*
     * THE LIMIT IS TAKEN ON THE SKIN FACTOR AND NOWHERE ELSE, because that is the only place
     * `R` survives division by the face: `\paren{1 - \paren{1-1/\lambda}^{depth}}` goes to one
     * as the depth grows, and what is left carries no `R`.
     */
    const got = simplify(mul(call("l.choose", simplify(mul(field("\\bar{m}_{x}"), field("l.DEG")))),
      sub(num(1), field("\\rho")), lam.to));
    /*
     * AND THE LIMIT IS KEPT AS A LIMIT, beside the number it comes to.
     *
     * `\bar{m} = \frac{\bar{m}_{x}DEG\paren{1-\rho}}{\sigma\omega\rho}` is true and says
     * nothing about where it came from. The whole content of this theorem is that the body's
     * SIZE CANCELS - and that is a statement about a limit, so the limit is what a reader
     * gets. `Algebra` takes it numerically, by taking it: `R` is pushed out by decades until
     * the value settles, which is what a limit is and is the same arrangement `root` has.
     */
    /*
     * AND THE BODY OF THE LIMIT IS THE TWO NAMES, because that is the statement.
     *
     * `\lim_{R \to \infty} \frac{\bar{m}\paren{R}}{l.shell}` says what the mass IS - what a
     * body sends, over the face it sends through, at infinity. Written out it is the same
     * number and a different sentence: a reader gets an expression with an `R` in it going to
     * a limit, and has to notice for themselves that the thing upstairs and the face
     * downstairs are the two counts this whole theorem is about.
     *
     * IT EVALUATES THROUGH `substituting`, like every other law that cites by name. Nothing
     * here has to bind them: the closure fills them in and `\bar{m} in r` is the same limit
     * with both written out, which is what any number comes from.
     */
    const asLimit = limit(div(field("\\bar{m}\\paren{R}"), field("l.shell(R)")), "R");
    return [{
      fact: { kind: "is", of: "\\bar{m}", to: asLimit },
      via: "the mass, which is that at infinity", from: [key(m), key(shell)],
      because: "the mass is what a body sends per unit of the face it sends through, once " +
        "the face is all there is left of it - which is a limit, and is written as one",
      working: [`\\bar{m} = \\lim_{R \\to \\infty} \\frac{\\bar{m}\\paren{R}}{l.shell(R)}`],
    }, {
      fact: { kind: "is", of: "\\bar{m} solved", to: got },
      via: "what a body is worth per unit of its own face", from: [key(m), key(shell)],
      because: "the body's thickness is its ball over its shell, and that grows with R - so " +
        "past one mean free path the skin factor is one and every R cancels. What is left is " +
        "a SURFACE DENSITY the vacuum fixes: one mean free path of announcement per unit of " +
        "face, and no body of any size or make can exceed it. Since what is felt at a " +
        "distance is this same quantity read at the far shell rather than the near one, the " +
        "SURFACE GRAVITY of a large body saturates - which Newton's does not",
      working: [
        `\\frac{\\bar{m}\\paren{R}}{l.shell(R)} = ${show(got)}` +
          `·\\paren{1 - \\paren{1 - \\frac{1}{\\lambda}}^{\\frac{l.ball(R).count}{l.shell(R)}}}`,
        `\\frac{l.ball(R).count}{l.shell(R)} \\to \\infty, so the bracket \\to 1`,
        `\\bar{m} = \\lim_{R \\to \\infty} \\frac{\\bar{m}\\paren{R}}{l.shell(R)} = ${show(got)}`,
      ],
    }];
  },
};

/**
 * AND THE OTHER LEDGER FIXES THE OTHER SHARE — two lines, two unknowns, and nothing left over.
 *
 * `balancing` sets the RAY line to nothing and gets `\rho`, the share of ways that are lit.
 * The SPACE line was never balanced by anything: `makingRate` read its waiting term off as
 * `a_{0}` and left the line itself hanging, on the grounds that the two ledgers do not settle
 * together. They do not settle at the same DENSITY - that part is right - but that is not a
 * reason for one of them to go unsolved, and while it did, `\omega` had no equation.
 *
 * WHAT `\omega` IS makes the space line exactly the equation that fixes it. `MOVEMENT` asks
 * whether the way a ray drew LEADS ANYWHERE, so `\omega` is the share of ways that lead to a
 * point that is there. Points are made by splitting and by waiting and unmade by meeting. If
 * more were made than unmade the ways would all lead somewhere and `\omega` would climb to
 * one; if fewer, it would fall. A STEADY SHARE IS A STEADY LEDGER, so the share that finds
 * room is the one at which the room stops changing - which is this line set to nothing.
 *
 * AND THAT IS WHERE THE NON-LINEARITY COMES FROM, without anything being put in. `\omega`
 * solves an equation in the density, so the speed a carrier goes depends on the density it is
 * going through; `spreading` then conserves a flux whose speed depends on what is flowing, and
 * the conservation is no longer linear. Neither `spreading` nor `closing` had to be told this.
 */
const roomBalance: Rule = {
  name: "a way leads somewhere only if the point it leads to is still there",
  because: "a meeting folds two points into one, so the way that led to the second leads " +
    "nowhere - and the share of ways that are clear is the share of the record that is empty",
  fire: s => {
    const mkC = s.all("is").find(f => f.of === "the rays count of what is made");
    const tkC = s.all("is").find(f => f.of === "the rays count of what is taken");
    const mkF = s.all("is").find(f => f.of === "the folds count of what is made");
    const tkF = s.all("is").find(f => f.of === "the folds count of what is taken");
    if (!mkC || !tkC || !mkF || !tkF) return [];
    if (s.nodes.has(key({ kind: "is", of: "\\omega" } as Fact))) return [];
    /*
     * AND IT IS A RATIO OF THE LEDGERS' OWN COUNTS, with the rates and the density gone.
     *
     * Two balances, and one substitutes into the other. The RAY line settles where a firing's
     * making pays for a meeting's taking:
     *
     *     mkC·made + tkC·F·took = 0
     *
     * and the FOLD line settles where a meeting's folding pays for a firing's handing back -
     * which `unfold` can only do if there is a fold to hand back, so the returning carries the
     * share of the record that is NOT empty:
     *
     *     tkF·F·took + mkF·made·held = 0
     *
     * Put the first into the second and `made`, `took`, `F`, the rates and the density all
     * cancel, leaving nothing but the counts each rule writes into each ledger:
     *
     *     held = \frac{tkF·mkC}{mkF·tkC}
     *
     * ONE FIRING LIGHTS `DEG` RAYS AND HANDS BACK `DEG` FOLDS; ONE MEETING DOUSES TWO RAYS AND
     * MAKES ONE FOLD. So `held = DEG/(2·DEG) = 1/2`, on every lattice, whatever the rates are -
     * because it takes two rays to make a fold and a firing makes `DEG` of them.
     *
     * SO HALF OF A PLACE'S WAYS OUT LEAD TO A POINT THAT IS NO LONGER THERE, and `MOVEMENT`
     * asks exactly that: `some(to)` is whether the way drawn leads anywhere. `\omega` is the
     * other half.
     */
    const held = simplify(mul(tkF.to, mkC.to, pow(mul(mkF.to, tkC.to), -1)));
    const got = simplify(sub(num(1), held));
    return [{
      fact: { kind: "is", of: "\\omega", to: got },
      via: "a way leads somewhere only if the point it leads to is still there",
      from: [key(mkC), key(tkC), key(mkF), key(tkF)],
      because: "ANNIHILATION folds two points into one - the space between them is gone and " +
        "so is one of the points. A ray drawn along that way is drawn at something that is no " +
        "longer there, which is what `some(to)` finds. How many of a place's ways are like " +
        "that is what the fold record says, and where the record settles is fixed by the ray " +
        "line: it takes TWO rays to make a fold and one firing lights DEG of them, so the " +
        "folding outruns the handing back by exactly that ratio and the record sits where " +
        "half the ways are gone. NOTHING IS FITTED AND NO RATE SURVIVES: it is four counts " +
        "off the two ledgers, and it is the same number on every lattice",
      working: [
        `rays:  ${show(mkC.to)}·made + ${show(tkC.to)}·F·took = 0`,
        `folds: ${show(tkF.to)}·F·took + ${show(mkF.to)}·made·held = 0`,
        `the first into the second, and everything but the counts cancels:`,
        `held = ${show(held)}`,
        `\\omega = 1 - held = ${show(got)}`,
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
    /*
     * AND EACH CHANNEL IS GIVEN ITS OWN NAME, which costs nothing and is the difference
     * between a law a reader can take apart and one they cannot.
     *
     * The two were computed here and then added, and only the sum was ever named - so a page
     * printing `g_{N}` printed one enormous line with a `+` somewhere in the middle of it, and
     * which half was the vacuum's and which the two bodies' own radiation was something a
     * reader had to reconstruct from the factors. They are separate claims, they rest on
     * different premises, and the `because` below already argues them separately. Naming them
     * lets everything downstream cite them instead of restating them.
     */
    const channels = [
      { of: "the vacuum's channel", to: vac, why:
        "the near body prevents an expansion, that shortfall spreads, and the far one is " +
        "pushed into it because fewer rays arrive from that side. NEITHER BODY HAS TO EMIT " +
        "ANYTHING for this one - it is the making that did not happen, carried out to R and " +
        "met by whatever is open to it" },
      { of: "the meetings' channel", to: meet, why:
        "the cross piece of the quadratic: one body's radiation meeting the other's. It needs " +
        "BOTH to be shining, which is why it carries both masses and the motion factor twice" },
    ] as const;
    return [...channels.map(c => ({
      fact: { kind: "is", of: c.of, to: c.to } as Fact,
      via: "what one puts in, thinned, times what the other is open to",
      from: [key(law), key(S), key(opened), key(met), key(sig)],
      because: c.why,
      working: [`${c.of} = ${show(c.to)}`],
    })), {
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
 * It is worth a name because everything below divides by it, and because a reader who sees a
 * scale appear in a rotation curve is entitled to ask where it was fitted. It was not: it is
 * `\sigma\rho`, one term of the space line read straight off.
 *
 * WHICH TERM, AND NOT THE NET OF TWO — because this paragraph said the net for a long time
 * after the rule had stopped computing one, and a stale comment on the one scale in the theory
 * is worse than none.
 *
 * The earlier reading was `\nu(1-\rho) - \sigma\rho^{2}`: the space ledger gains a point
 * wherever a free point splits and loses one wherever two carriers meet, so its net rate is
 * the first less the second. That is a real quantity and it is not this one. What this rule
 * takes is the WAITING term alone — `MOVEMENT`'s `either` sends a ray with nowhere to step to
 * `waitForRoom`, which hands the ray back to itself and grows the world by one point: no ray
 * made, destroyed or moved, and space where there was none. Nothing else in these rules has
 * that shape, so a right-hand term with no rays and space to spare IS the waiting, and its
 * rate is `\sigma` (a ray tries to step) times `\rho` (its way out is already taken).
 *
 * AND `closing` IS WHAT SETTLES WHICH OF THE TWO IS MEANT. It reaches the same scale from the
 * OTHER end — `a_{0} = 1/\lambda`, one over how far a carrier gets before `ANNIHILATION`
 * douses it, which `freePath` gives as `\sigma\rho` — and rests on the two agreeing. They do,
 * for the waiting term. They do not for the net, which is a different expression and does not
 * equal it at the settled density. So the code was right and three layers of comment left over
 * from earlier passes were describing a rule that no longer existed.
 */
const makingRate: Rule = {
  name: "the room the line does not supply, which the waiting has to make",
  because: "the space line takes at every meeting and makes at every free point, and what it " +
    "leaves unsupplied is what a waiting ray has to make - which is the one other thing in " +
    "these rules that makes any",
  fire: s => {
    const waits = s.all("is").find(f => f.of === "what the waiting makes");
    if (!waits || s.nodes.has(key({ kind: "is", of: "the rate space is made" } as Fact)))
      return [];
    return [{
      /*
       * WHY THE ROOM HAS TO COME FROM SOMEWHERE, which is the argument the name is short for.
       *
       * `\rho` settles where the RAYS balance. At that density the SPACE ledger does not:
       * one point is handed back a firing and one point taken a meeting, and those counts are
       * not the `DEG` and `DEG - 2` the rays get, so the two ledgers do not settle together.
       * Every meeting folds away a point that no splitting handed back.
       *
       * There is exactly one other thing in these rules that makes room: `waitForRoom`, which
       * carries `space: count(1)` and no step. IT IS NOT ON THE PRINTED LINE, because it sits
       * inside `MOVEMENT`'s `either` and only the taken branch is counted — so the line as
       * printed is short of its one remaining source, and what it leaves unsupplied is what
       * the rays make by standing still. This is the rate at which they do.
       */
      fact: { kind: "is", of: "the rate space is made", to: waits.to },
      via: "the room the line does not supply, which the waiting has to make",
      from: [key(waits)],
      because: "MOVEMENT sends a ray with nowhere to step to waitForRoom, which hands it back " +
        "to itself and grows the world by a point - no ray made, destroyed or moved, and space " +
        "where there was none. Nothing else in these rules has that shape, so that term IS the " +
        "waiting, and its rate is the rate a ray tries to step times the chance its way out is " +
        "taken. NOTHING IS FITTED HERE: it is one term of the space line read off as it stands, " +
        "and it is the only scale in this theory that is not a count of the tiling",
      working: [
        `the space line carries a term with no rays in it: the waiting`,
        `a ray that cannot step makes the room instead, and that is space at ${show(waits.to)}`,
        `the rate space is made = ${show(waits.to)}`,
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
    const a0 = s.all("is").find(f => f.of === "the rate space is made");
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
    const made = s.all("is").find(f => f.of === "what is made");
    const took = s.all("is").find(f => f.of === "what is taken");
    const mkC = s.all("is").find(f => f.of === "the rays count of what is made");
    const tkC = s.all("is").find(f => f.of === "the rays count of what is taken");
    const puts = s.all("is").find(f => f.of === "what a body puts into the medium");
    const per = s.all("is").find(f => f.of === "\\delta per site");
    if (!made || !took || !mkC || !tkC || !puts || !per) return [];
    if (s.nodes.has(key({ kind: "is", of: "\\rho at R" } as Fact))) return [];
    /*
     * THE SAME BALANCE `balancing` SOLVES, WITH THE BODY IN IT — and it must be the same one.
     *
     * This built its own quadratic with `\nu(1-\rho)` in it, which was the empty-space balance
     * as it stood BEFORE a point-gate was read through the spectrum. `CREATION` is asked of a
     * POINT and a point is free when all DEG of its ways out are dark, so the making is
     * `(1-\rho)^{DEG}` and the balance is not a quadratic any more. Keeping a private copy of
     * an equation that has since changed shape is how a law comes to be solved two ways at
     * once - so this reads the line's own terms and adds one thing to them.
     *
     * WHAT IT ADDS is the cross piece: `ANNIHILATION` never asks which body a ray belongs to,
     * so a vacuum carrier meets the body's as readily as another vacuum one. That takes rays
     * at the same count a meeting does, at a rate set by both densities.
     */
    /*
     * AND THE CROSS PIECE IS NOT A TERM TO BE ADDED — it falls out of the square already there.
     *
     * The line carries `\sigma n\tilde{n}`: the population against the population coming the
     * other way. Where a body is, the population IS the vacuum's plus the body's, so that term
     * is `\sigma(\rho + n)(\tilde\rho + \tilde n)` and the `2\rho n` comes out of squaring it.
     * Writing a separate `\sigma\rho n` beside it was me inventing a rate the rules already
     * have, and it would have been a rate nobody could check.
     */
    /*
     * THE BODY'S CARRIERS WHERE THE FAR ONE IS — which is the per-site profile read at the
     * body's OWN shortfall, not that profile multiplied by it.
     *
     * `\delta per site` is already written in `\delta`; a body's `\delta` is what it puts into
     * the medium. Multiplying the one by the other put the body in twice and made `n` go as
     * its square, which no density can balance against - so the crowded balance had no root
     * for ANY source, however small.
     */
    /*
     * AND THE BODY'S CARRIERS ARE IN BOTH TERMS, because both gates ask the same question.
     *
     * `ANNIHILATION` takes a facing pair and never asks which body a ray belongs to - that is
     * the argument above, and it puts the body into the TAKING. `CREATION` is gated on
     * `neutral`, which asks whether ANY of a point's ways out is lit, and it does not ask whose
     * either. So a point near a body is less likely to be free for exactly the same reason it
     * is more likely to meet something, and the making carries the body too.
     *
     * PUTTING IT IN ONE AND NOT THE OTHER IS WHAT MADE THE ANSWER ONE-SIDED. Both terms move
     * the balance the same way, so the vacuum's own share is always suppressed near matter and
     * never raised - and a band built on it could only ever hang below the law, never straddle
     * it. That was an asymmetry in the reading, not in the rules.
     */
    const n = simplify(replace(replaceIn(per.to, "r", sym("R")), "\\delta", puts.to));
    const total = add(field("\\rho"), n);
    const withBody = simplify(replace(took.to, "\\rho", total));
    const makingWithBody = simplify(replace(made.to, "\\rho", total));
    const rootOf = root(simplify(add(mul(mkC.to, makingWithBody),
      mul(tkC.to, field("F"), withBody))), "\\rho");
    return [{
      fact: { kind: "is", of: "\\rho at R", to: rootOf },
      via: "the density where a body is, which is not the density of empty space",
      from: [key(made), key(took), key(puts)],
      because: "the empty-space density is the root of the making against the taking, and it " +
        "was derived under a condition it is then used outside of: it holds where the line is " +
        "about the vacuum and NOT about a source. Near a body there is a source. The meeting " +
        "rule never asks which body a ray belongs to, so the body's own carriers are taken " +
        "against as readily as the vacuum's and the balance gains a cross piece - AND IT IS " +
        "THE SAME BALANCE otherwise, read off the same terms with the same counts, so a change " +
        "in what a rule does moves both together. Far out the body's carriers are nothing and " +
        "it returns the empty-space root exactly",
      working: [
        `the body's carriers where the far one is: n = ${show(n)}`,
        `the population where the body is: \\rho + n`,
        `${show(mkC.to)}·${show(makingWithBody)} + ${show(tkC.to)}·F·${show(withBody)} = 0`,
        `\\rho at R = ${show(rootOf)}`,
      ],
    }, {
      /*
       * AND WHAT THE POPULATION ACTUALLY IS THERE — the vacuum's settled share PLUS the body's
       * carriers, which is what the line means by `n`.
       *
       * The space line's waiting term is `\sigma n`, degree one in THE POPULATION - and
       * `MOVEMENT` moves a lit ray whoever lit it, so the population is every ray at that
       * place. Reading the rate space is made off the vacuum's share alone leaves the body's
       * own carriers out of a term they are plainly in.
       */
      fact: { kind: "is", of: "the population at R", to: simplify(total) },
      via: "the density where a body is, which is not the density of empty space",
      from: [key(made), key(took), key(puts)],
      because: "what is at a place near a body is the vacuum's settled share and the body's " +
        "own carriers together - MOVEMENT moves a lit ray whoever lit it, so the line's " +
        "population is every ray there. The vacuum's share is what the BALANCE solves for, " +
        "because that is what the making and the taking act on; the POPULATION is what the " +
        "transport and the waiting see, and they are not the same number near matter",
      working: [
        `the vacuum's settled share there: \\rho at R`,
        `the body's carriers there: ${show(n)}`,
        `the population at R = ${show(simplify(total))}`,
      ],
    }, {
      /* and the rate space is made, read at the population rather than at the vacuum's share */
      fact: { kind: "is", of: "a_{0} at R",
        to: simplify(mul(field("\\sigma"), simplify(total))) },
      via: "the density where a body is, which is not the density of empty space",
      from: [key(made), key(took), key(puts)],
      because: "the space line's waiting term is \\sigma times the population, and near a body " +
        "the population is the vacuum's share plus the body's carriers. So the scale the " +
        "transport turns over at is NOT the vacuum's own everywhere: it falls where a body " +
        "suppresses the splitting and rises where the body's own carriers outnumber what it " +
        "suppressed, and which of those wins is a question about the body rather than an " +
        "assumption about the answer",
      working: [
        `the space line's waiting term: \\sigma n, degree one in the population`,
        `a_{0} at R = \\sigma·(the population at R) = ` +
          `${show(simplify(mul(field("\\sigma"), simplify(total))))}`,
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
    if (!gN || !at) return [];
    if (s.nodes.has(key({ kind: "is", of: "g_{N} at that density" } as Fact))) return [];
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
      fact: { kind: "is", of: "g_{N} at that density", to: got },
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
 * AND THE BODY'S OWN ACCELERATION CLOSES IT — which is where the square root comes from, and
 * the only place in this proof where anything is solved rather than assembled.
 *
 * TWO THINGS IN THESE RULES PULSE, AND MOVING SHIFTS THE PHASE BETWEEN THEM.
 *
 * `CREATION` is `at.point.of(neutral)` and its body lights EVERY exit. So a free point fires,
 * is busy, drains as `MOVEMENT` streams what it lit away, and is free again — PERIOD TWO, from
 * the gate and the body and nothing else. Every other tick the vacuum's rays at a place point
 * back at whatever is there.
 *
 * `propel` sets `stepped` on a source that crossed a cell, and `EMISSION` is gated on
 * `spare = not(moving)`. SO A SOURCE MOVES OR PULSES AND NEVER BOTH. That is the `(1-\beta)`
 * already on the line, and it is the second oscillator.
 *
 * A SOURCE'S EMISSION REACHES A PLACE `r` CELLS AWAY AFTER `r` TICKS, so whether it arrives
 * while the vacuum there is lit — and is therefore doused by `ANNIHILATION`, which takes a
 * facing pair — is a question of PARITY. Each move shifts the source one cell and flips it,
 * and moving toward a place shortens the path where moving away lengthens it, so the flip goes
 * opposite ways fore and aft. That is the preference in the direction of motion.
 *
 * AT A CONSTANT SPEED THOSE FLIPS ALTERNATE AND CANCEL. Under an acceleration they do not: the
 * rate of flipping keeps changing, so the mismatch ACCUMULATES rather than averaging away —
 * and what a body is accelerating at is `g`, the very thing being solved for. THAT is what
 * puts `g` on the right-hand side, and nothing else in these rules does.
 *
 * AND HOW MUCH ACCUMULATES IS SET BY HOW FAR A CARRIER GETS BEFORE IT MEETS SOMETHING.
 *
 * A flip is worth something only while the carrier that would deliver it is still there, and
 * `ANNIHILATION` is what ends that: a facing pair meets and both are doused. So the stretch
 * over which mismatch can pile up is the distance one carrier gets before that happens — the
 * MEAN FREE PATH, which `force.range` already derives off the meeting rule as
 *
 *     \lambda = \frac{1}{\sigma\rho}
 *
 * and `MOVEMENT` gives one cell a tick, so that length is also the time: `\tau = \lambda`.
 *
 * OVER THAT STRETCH AN ACCELERATING SOURCE DISPLACES `\frac{1}{2}g\lambda^{2}`, and each cell of
 * displacement flips the arrival parity once — a path one cell longer or shorter arrives a tick
 * later or earlier, on the other half of the vacuum's two-tick cycle. So the flips that
 * accumulate coherently number `\frac{1}{2}g\lambda^{2}`, which is a count and not a rate.
 *
 * AND WHAT MULTIPLIES THE ARRIVAL IS DIMENSIONLESS, which fixes the form with nothing left to
 * choose. In cells and ticks with `\bar{c} = 1`, an acceleration is a reciprocal length, so `g`
 * and `\lambda` make exactly one dimensionless combination, `g\lambda` — and the enhancement is
 * either it or its reciprocal. `g\lambda` gives `g(1 - g_{N}\lambda) = g_{N}`, which does not
 * interpolate but DIVERGES at `g_{N} = 1/\lambda`; the reciprocal gives a turnover. So
 *
 *     g = g_{N}\paren{1 + \frac{1}{g\lambda}}   ->   g^{2} - g_{N}g - \frac{g_{N}}{\lambda} = 0
 *
 * AND THAT IS THE SAME EQUATION, with `a_{0} = 1/\lambda = \sigma\rho`. The scale was read off
 * the space line as the waiting term and is here reached from the meeting rule as a coherence
 * length, and the two agree — which is worth more than either alone, because nothing made them.
 *
 * IT ALSO SETTLES WHICH DENSITY. `\lambda` is how far a carrier gets THROUGH THE MEDIUM IT
 * CROSSES, so the scale belongs to the ambient vacuum a ray traverses and not to the population
 * at the point it arrives at. Far from anything that relaxes to `\rho_{\infty}`, so `a_{0}` is
 * the SAME NUMBER for every body — and a turnover that is the same everywhere is what a tight
 * relation means. Reading it off the local population instead makes the scale a property of
 * whatever is nearby, and a relation built on that cannot be tight.
 *
 * STRONG FIELD and the root is `g_{N}`: the body accelerates hard, the phase runs away too
 * fast to accumulate against, and the arrival channel is the whole answer — Newton, with no
 * crossover put in anywhere. WEAK FIELD and it is `\sqrt{g_{N}a_{0}}` — the geometric mean of
 * what arrives and the rate space is made. Since `g_{N}` carries the mass linearly, `g` carries
 * its ROOT, which is the one thing a two-body force law may not do and the one thing the
 * measured relation wants. It is in the transport and not in the source.
 */
const closing: Rule = {
  name: "the phase between the two pulses, which the body's own acceleration keeps from cancelling",
  because: "the vacuum pulses every other tick and a source moves or pulses and never both, " +
    "so moving shifts the phase between them - and an accelerating body keeps changing that " +
    "shift, so it accumulates instead of averaging away",
  fire: s => {
    const gN = s.all("is").find(f => f.of === "g_{N}");
    /*
     * AND THE SCALE IS ONE OVER THE COHERENCE LENGTH, WHICH IS THIS RULE'S OWN ARGUMENT.
     *
     * A flip is worth something only while the carrier that would deliver it still exists, and
     * what ends it is `ANNIHILATION` - so the stretch is the MEAN FREE PATH, which `freePath`
     * derives off the meeting rule. That is the whole of why there is a scale here at all.
     *
     * IT USED TO READ `a_{0}` INSTEAD, on the grounds that the two were the same number. They
     * were - while `MOVEMENT`'s `either` carried no share, so the waiting rate came out as
     * `\sigma\rho` (as if every ray waited) and the meeting rate came out as `\sigma\rho`
     * (as if every ray stepped). With the share carried they are different quantities and only
     * one of them is a coherence length: `\lambda = 1/(\sigma\omega\rho)` counts the rays
     * that STEPPED and then met something, which is what ends a flip. The rate space is made
     * is a different rule and belongs to `receding`.
     */
    const lam = s.all("is").find(f => f.of === "\\lambda");
    const spd = s.all("is").find(f => f.of === "v");
    if (!gN || !lam || !spd || s.nodes.has(key({ kind: "is", of: "F_{g}" } as Fact))) return [];
    /*
     * WRITTEN IN THE TWO NAMES, because both have derivations of their own and substituting
     * them here would put a page of algebra inside a square and a root at once.
     */
    /*
     * AND THE STRETCH IS A TIME, NOT A LENGTH — which is where the speed comes in.
     *
     * The phase accumulates for as long as the carrier lasts, and what ends it is a meeting.
     * `\lambda` is how far it gets before that happens; how LONG it takes to get there is
     * `\lambda/v`, and `waiting` derives `v` off `MOVEMENT`'s own two gates.
     *
     * THIS RULE USED TO SAY `\bar{c} = 1, SO THAT LENGTH IS ALSO THE TIME`. That is true only
     * if a carrier crosses one cell per tick, and `MOVEMENT` says it does not: it is turned by
     * the folds it finds and it steps only where the way it drew leads somewhere, so
     * `v = \omega/(1 + n_{f})` and a cell takes `1/v` ticks. The identification was made
     * before either gate was derived and was never revisited.
     *
     * AND IT IS THE TIME THAT MAKES THE COMBINATION DIMENSIONLESS. In cells and ticks an
     * acceleration is cells per tick squared, so `g\tau` is a speed and `g\tau/\bar{c}` is
     * the one dimensionless thing `g` makes with the stretch. With `\tau = \lambda/v` the
     * enhancement is `v/(g\lambda)`, so the scale is
     *
     *     a_{0} = v/\lambda
     *
     * which is `1/\lambda` again exactly where the medium is transparent and the carrier
     * streams, and smaller by the speed everywhere else.
     */
    const scale = simplify(mul(spd.to, pow(lam.to, -1)));
    const g = field("g_{N}"), a = field("a_{0}");
    const half = mul(g, num(0.5));
    const got = simplify(add(half, pow(add(mul(half, half), mul(g, a)), 0.5)));
    /*
     * AND THE EQUATION IS KEPT AS WELL AS ITS SOLUTION, because they are not equally readable.
     *
     * A QUADRATIC'S SOLUTION CANNOT NAME ITS COEFFICIENT FEWER THAN TWICE. `\frac{1}{2}g_{N}
     * + \sqrt{\frac{1}{4}g_{N}^{2} + g_{N}a_{0}}` says it three times; folded to
     * `\frac{1}{2}g_{N}\paren{1 + \sqrt{1 + 4a_{0}/g_{N}}}` it says it twice, and there is
     * no arrangement that says it once. So the moment `g_{N}` is written out - two hundred and
     * fifty characters of arrivals - the line carries two copies of them whatever is done to
     * it, and no reader is going to see that the two are the same thing.
     *
     * THE EQUATION NAMES IT ONCE:
     *
     *     g = g_{N}\paren{1 + \frac{a_{0}}{g}}
     *
     * and that is not a weaker statement, it is the SAME one and the one this rule actually
     * derives - the solving is arithmetic done to it afterwards. This repository already keeps
     * a balance in that shape wherever it has no closed form: the settled density and the fold
     * record are both `the x where ... = 0`, on the grounds that the equation is the derived
     * thing and the number is what it comes to. This one HAS a closed form, so both are kept:
     * the solution for anything that evaluates, the equation for anything that reads.
     */
    const one = root(simplify(sub(mul(g, add(num(1), mul(a, pow(field("g"), -1)))),
      field("g"))), "g");
    return [{
      fact: { kind: "is", of: "a_{0}", to: scale },
      via: "the phase between the two pulses, which the body's own acceleration keeps from cancelling",
      from: [key(lam), key(spd)],
      because: "the accumulation runs until a meeting ends it, so the stretch is the mean free " +
        "path - and what the phase counts is TICKS, so what matters is how long that path " +
        "takes, which is the path over the speed. MOVEMENT turns a carrier and only lets it " +
        "step where the way it drew leads somewhere, so the speed is not one cell a tick and " +
        "the scale is v/\\lambda rather than 1/\\lambda. It is NOT the rate space is made: " +
        "that is MOVEMENT's other branch, and the two are equal only if the branches are not " +
        "shared out at all",
      working: [`\\lambda = ${show(lam.to)}`, `v = ${show(spd.to)}`,
        `\\tau = \\lambda/v, and g\\tau is the dimensionless one`,
        `a_{0} = v/\\lambda = ${show(scale)}`],
    }, {
      fact: { kind: "is", of: "F_{g} as one equation", to: one },
      via: "the phase between the two pulses, which the body's own acceleration keeps from cancelling",
      from: [key(gN), key(lam)],
      because: "what is felt is what arrives, enhanced by the mismatch that accumulated over " +
        "one mean free path - and that mismatch is measured against the only rate the vacuum " +
        "has, which is a_{0}/g. So g = g_{N}(1 + a_{0}/g), with the arrival written ONCE. " +
        "Solving it is a quadratic and the answer is the line below; this is the line the " +
        "rules give, and it is the one a reader can hold",
      working: [
        `the mismatch, measured against the vacuum's own rate: a_{0}/g`,
        `g = g_{N}\paren{1 + \frac{a_{0}}{g}}`,
        `and solved: ${show(got)}`,
      ],
    }, {
      fact: { kind: "is", of: "F_{g}", to: got },
      via: "the phase between the two pulses, which the body's own acceleration keeps from cancelling",
      from: [key(gN), key(lam)],
      because: "CREATION fires only where nothing is going on and lights every exit, so a " +
        "point fires, fills, drains and fires - the vacuum pulses every other tick. And a " +
        "source moves or pulses and never both, which is what puts (1-\\beta) on the line. So " +
        "there are two pulses and moving shifts the phase between them: an emission reaches a " +
        "place r cells away after r ticks, and whether it arrives while the vacuum there is " +
        "lit - and is doused by the meeting rule - is a parity. Each move flips it, and moving " +
        "toward a place shortens the path where moving away lengthens it, so the flip goes " +
        "opposite ways fore and aft. AT A CONSTANT SPEED THOSE CANCEL; under an acceleration " +
        "they accumulate, because the rate of flipping keeps changing - and what a body " +
        "accelerates at is g itself. That is what puts g on the right-hand side. Measured " +
        "against the only rate the vacuum has it is a_{0}/g, and solving is the one place here " +
        "where anything is solved rather than assembled: strong field gives back g_{N} exactly, " +
        "weak field the GEOMETRIC MEAN of what arrives and the rate space is made - so g " +
        "carries the ROOT of the mass g_{N} carries whole",
      working: [
        `CREATION: fires at a free point, lights every exit -> the vacuum pulses, period two`,
        `propel + EMISSION: a source moves or pulses, never both -> the second pulse`,
        `an emission r cells out arrives r ticks later, so meeting the vacuum's rays is a parity`,
        `each move flips it, opposite ways fore and aft`,
        `constant speed: the flips cancel.  accelerating: they accumulate, at g`,
        `a flip counts only while the carrier lasts, which is one mean free path`,
        `\\lambda = 1/(\\sigma\\omega\\rho), and the time to cross it is \\lambda/v`,
        `an accelerating source displaces \\frac{1}{2}g\\lambda^{2} over it - that many flips`,
        `g\\lambda is the only dimensionless combination; g\\lambda diverges, 1/(g\\lambda) turns over`,
        `g = g_{N}(1 + 1/(g\\lambda)),  and a_{0} = 1/\\lambda`,
        `g^{2} - g_{N}g - g_{N}a_{0} = 0`,
        `F_{g} = ${show(got)}`,
      ],
    }];
  },
};

/**
 * THE SAME MASS, GATHERED OR SCATTERED — and it does not send the same amount either way.
 *
 * `shadowing` already says what a body sends: `A\paren{1 - \paren{1-\sigma\rho}^{m/A}}`, a face
 * `A` and what gets out through it. THAT FACTOR IS NOT LINEAR IN THE MASS, and the two ends of
 * it are the two things a galaxy can be.
 *
 * GATHERED, `m/A` is huge - a galaxy's mass behind a galaxy's face is very many mean free paths
 * deep - so `\paren{1-\sigma\rho}^{m/A}` is nothing and the factor SATURATES AT `A`. What comes
 * out is set by the face and not by what is behind it: the inside is shadowed by its own skin,
 * and adding mass there adds nothing.
 *
 * SCATTERED INTO STARS, each `m_{*}/A_{*}` is tiny, and `1 - \paren{1-\sigma\rho}^{x}` at small
 * `x` is `-x\log\paren{1-\sigma\rho}`. Each star sends `m_{*}\cdot-\log\paren{1-\sigma\rho}` and
 * `assembling` adds them, so `M/m_{*}` of them send `M\cdot-\log\paren{1-\sigma\rho}` - LINEAR IN
 * THE TOTAL MASS, and the star's own mass and face have both cancelled out of it. How finely
 * the mass is cut does not matter, which is what a sum over bodies has to say if it is to say
 * anything at all.
 *
 * SO THE DIFFERENCE BETWEEN THE TWO PICTURES IS DERIVED AND NOT DRAWN. It is one limit of the
 * skin law against the other, and no quadrature over any disc appears in it - a ring-and-spoke
 * sum written out by hand is a guess at this integral, and this is the integral.
 */
const arrangement: Rule = {
  name: "the same mass, gathered or scattered",
  because: "what a body sends is a face times what gets out through it, and that factor " +
    "saturates for one big body and goes linear for many small ones",
  fire: s => {
    const puts = s.all("is").find(f => f.of === "what a body puts into the medium");
    if (!puts || s.nodes.has(key({ kind: "is", of: "what a gathered mass sends" } as Fact)))
      return [];
    const thick = simplify(pow(sub(num(1), mul(field("\\sigma"), field("\\rho"))),
      div(field("m"), field("A"))));
    /* deep: what gets out is all of the face. thin: it is the mass, by the log */
    const gathered = simplify(swap(puts.to, thick, num(0)));
    const scattered = simplify(swap(puts.to, thick,
      add(num(1), mul(field("m"), log(sub(num(1),
        mul(field("\\sigma"), field("\\rho")))), pow(field("A"), -1)))));
    return [{
      fact: { kind: "is", of: "what a gathered mass sends", to: gathered },
      via: "the same mass, gathered or scattered", from: [key(puts)],
      because: "all of it in one place is many mean free paths deep behind its own face, so " +
        "what gets out through that face is all of it - the factor saturates and what is sent " +
        "is set by the FACE. Mass added behind it is shadowed by its own skin and sends nothing",
      working: [`\\paren{1-\\sigma\\rho}^{m/A} -> 0 as m/A grows`,
        `what is sent -> ${show(gathered)}`,
        `and that does not mention m at all - the inside is hidden`],
    }, {
      fact: { kind: "is", of: "what a scattered mass sends", to: scattered },
      via: "the same mass, gathered or scattered", from: [key(puts)],
      because: "cut into stars, each is thin: 1 - \\paren{1-\\sigma\\rho}^{x} is -x\\log\\paren{1-" +
        "\\sigma\\rho} for small x, so a star sends its own MASS by that log and its face cancels. " +
        "Arrivals add, so M/m_{*} of them send M by the same log - LINEAR IN THE TOTAL, with " +
        "the star's mass and face both gone from the answer. How finely it is cut does not " +
        "change it, which is the only way a sum over bodies can mean anything",
      working: [`1 - \\paren{1-\\sigma\\rho}^{x} = -x\\log\\paren{1-\\sigma\\rho} + O\\paren{x^{2}}`,
        `one star: A_{*}\\cdot\\frac{m_{*}}{A_{*}}\\cdot-\\log\\paren{1-\\sigma\\rho} = ` +
          `m_{*}\\cdot-\\log\\paren{1-\\sigma\\rho}`,
        `M/m_{*} of them: ${show(scattered)}`],
    }];
  },
};

/**
 * AND THE TWO CURVES THEMSELVES — the same law, read at the two arrangements.
 *
 * `g_{N}` is what a body sends, diluted over the room a shell has. So swapping what is sent
 * for the gathered form and for the scattered one gives the arrival in each case, and `v^{2}`
 * carries it through the force law with nothing else touched.
 *
 * NOTHING HERE KNOWS WHAT A GALAXY IS. It is one law read at two limits of another law, and if
 * a rule moves both curves move with it.
 */
const curvesOfEach: Rule = {
  name: "the curve each arrangement has",
  because: "what arrives is what is sent diluted over the shell, so each arrangement has its " +
    "own arrival and its own curve",
  fire: s => {
    const v2 = s.all("is").find(f => f.of === "v^{2}");
    const one2 = s.all("is").find(f => f.of === "v^{2} as one equation");
    const gN = s.all("is").find(f => f.of === "g_{N}");
    const puts = s.all("is").find(f => f.of === "what a body puts into the medium");
    const one = s.all("is").find(f => f.of === "what a gathered mass sends");
    const many = s.all("is").find(f => f.of === "what a scattered mass sends");
    if (!v2 || !gN || !puts || !one || !many) return [];
    if (s.nodes.has(key({ kind: "is", of: "v^{2} with the mass gathered" } as Fact))) return [];
    /*
     * AND WHAT IS SWAPPED IS THE FACTOR, NOT THE WHOLE OF WHAT IS SENT.
     *
     * A product here is FLAT: `g_{N}` carries what a body sends spread out among its own
     * factors, so the sending is not a subtree of it and swapping it matched nothing at all -
     * which is why both arrangements first came out as the same expression. The piece that IS
     * a subtree of both is the one the arrangement is about, `\paren{1-\sigma\rho}^{m/A}`, and
     * that is what each limit moves.
     */
    const thickIn = simplify(pow(sub(num(1), mul(field("\\sigma"), field("\\rho"))),
      div(field("m"), field("A"))));
    const arrival = (by: Expr) => simplify(swap(gN.to, thickIn, by));
    const curve = (by: Expr) => simplify(swap(v2.to, field("g_{N}"), arrival(by)));
    /*
     * AND THE SAME CURVE AGAINST THE EQUATION RATHER THAN ITS SOLUTION.
     *
     * `v^{2} = R\paren{\frac{1}{2}g_{N} + \sqrt{\ldots}}` names the arrival three times, so
     * a curve with the arrangement written into it carries three copies of two hundred and
     * fifty characters. `v^{2} = R g` with `g = g_{N}(1 + a_{0}/g)` names it ONCE, and says
     * exactly the same thing. Both are kept; the pages show this one.
     */
    const alsoOne = (by: Expr) =>
      one2 ? simplify(swap(one2.to, field("g_{N}"), deepFactored(arrival(by)))) : undefined;
    const deep = num(0);
    const thin = add(num(1), mul(field("m"), log(sub(num(1),
      mul(field("\\sigma"), field("\\rho")))), pow(field("A"), -1)));
    return [{
      fact: { kind: "is", of: "what arrives with the mass gathered", to: arrival(deep) },
      via: "the curve each arrangement has", from: [key(gN), key(one)],
      because: "what arrives is what is sent over the room of a shell, and gathered the sending " +
        "is set by the face - so the arrival does not grow with the mass behind it",
      working: [`g_{N} with what is sent replaced by ${show(one.to)}`],
    }, {
      fact: { kind: "is", of: "what arrives with the mass scattered", to: arrival(thin) },
      via: "the curve each arrangement has", from: [key(gN), key(many)],
      because: "and scattered the sending is the total mass by the log, so the arrival grows " +
        "with all of it - every star radiates its whole self, none of it shadowed",
      working: [`g_{N} with what is sent replaced by ${show(many.to)}`],
    }, ...([["gathered", deep], ["scattered", thin]] as const).flatMap(([which, by]) => {
      const e = alsoOne(by);
      return e ? [{
        fact: { kind: "is", of: `v^{2} with the mass ${which} as one equation`, to: e } as Fact,
        via: "the curve each arrangement has", from: [key(v2), key(which === "gathered" ? one : many)],
        because: `the circle read at the ${which} arrival, against the equation the rules ` +
          `give rather than against its solution - so the arrival is written once`,
        working: [`v^{2} = R·g, and g = (that arrival)·(1 + a_{0}/g)`],
      }] : [];
    }), {
      fact: { kind: "is", of: "v^{2} with the mass gathered", to: curve(deep) },
      via: "the curve each arrangement has", from: [key(v2), key(one)],
      because: "the circle's law read at the gathered arrival - one source, the whole of it " +
        "presenting its own face, which is what a galaxy taken as a single point comes to",
      working: [`v^{2} = R·F_{g} at the gathered arrival`],
    }, {
      fact: { kind: "is", of: "v^{2} with the mass scattered", to: curve(thin) },
      via: "the curve each arrangement has", from: [key(v2), key(many)],
      because: "and read at the scattered arrival - a star apiece, each thin enough to send " +
        "all of itself, which is what a galaxy taken as its stars comes to",
      working: [`v^{2} = R·F_{g} at the scattered arrival`],
    }];
  },
};

/**
 * THE SCALE A CARRIER ACTUALLY CROSSES — which is not the vacuum's, and not the probe's either.
 *
 * `closing` fixes the scale at one over the mean free path, `a_{0} = 1/\lambda = \sigma\rho`,
 * because the mismatch accumulates until a meeting ends it. THE QUESTION THAT LEAVES OPEN IS
 * WHICH DENSITY, and I have twice answered it by assertion: once with the population where the
 * carrier LANDS, which made the scale a property of whatever was nearby and spread the answer
 * over four decades; once with the far-field `\rho_{\infty}`, which made it the same everywhere
 * and left no spread at all. Neither was derived.
 *
 * A MEAN FREE PATH IS A PROPERTY OF THE WHOLE PATH. What ends a carrier is meeting something,
 * and it can meet something anywhere between the source and the probe - so what matters is how
 * much medium it crossed, `\int_{0}^{R}\sigma\rho(s)\,ds`, and the reciprocal length that
 * corresponds to is that integral over the distance:
 *
 *     a_{0} \text{ along the path} = \frac{1}{R}\int_{0}^{R}\sigma\rho(s)\,ds
 *
 * and `\rho(s)` is `crowding`'s own profile, which is the vacuum's settled share where a body
 * has crowded it. NOTHING NEW IS ASSUMED: it is the same `\sigma\rho` the coherence argument
 * gives, read along the line the carrier travels rather than at one end of it.
 *
 * AND IT PUTS THE SPREAD BACK, if there is one to have. Near a body the profile is raised and
 * far from it it relaxes, so how much of a path is crowded depends on how heavy the body is,
 * how wide a face it presents and how far out the probe sits - three things that vary between
 * galaxies. The scale is then no longer the same for all of them, what is felt is no longer a
 * function of what arrives ALONE, and the possibilities stop being a line. Whether that spread
 * is large enough to see is a question for the arithmetic and not for this comment.
 */
const scaleCrossed: Rule = {
  name: "the scale a carrier crosses",
  because: "what ends a carrier is meeting something, and it can meet something anywhere " +
    "along its path - so the length that matters is set by all the medium it crossed",
  fire: s => {
    const a0 = s.all("is").find(f => f.of === "a_{0}");
    const at = s.all("is").find(f => f.of === "\\rho at R");
    if (!a0 || !at) return [];
    if (s.nodes.has(key({ kind: "is", of: "a_{0} along the path" } as Fact))) return [];
    /* the same \sigma\rho, averaged over the path rather than read at one end of it */
    const avg = simplify(replace(a0.to, "\\rho", field("\\langle\\rho\\rangle")));
    return [{
      fact: { kind: "is", of: "a_{0} along the path", to: avg },
      via: "the scale a carrier crosses", from: [key(a0), key(at)],
      because: "the scale is one over a mean free path, and a mean free path is how far a " +
        "carrier gets before meeting something ANYWHERE along its way - so the density in it " +
        "is the one it crossed, \\langle\\rho\\rangle = \\frac{1}{R}\\int_{0}^{R}\\rho(s)ds, with " +
        "\\rho(s) the profile `crowding` solves. Read at the far field it is the same for every " +
        "body and nothing varies; read where the carrier lands it belongs to whatever is " +
        "nearby; read along the path it depends on how much medium the body has crowded, " +
        "which is a fact about that body",
      working: [`a_{0} = \\sigma\\rho, and the \\rho in it is the one crossed`,
        `\\langle\\rho\\rangle = \\frac{1}{R}\\int_{0}^{R}\\rho(s)\\,ds`,
        `\\rho(s) = ${show(at.to).slice(0, 90)}...`,
        `a_{0} along the path = ${show(avg)}`],
    }];
  },
};

/**
 * HOW FAST AN ARRIVAL CHANGES WITH RADIUS — which is what turns a range of galaxies into a
 * density, and it is a derivative rather than a count.
 *
 * The felt pull is a FUNCTION of what arrives, so every galaxy this theory admits lands on one
 * curve and none of them lands beside it. A picture of the possibilities is therefore not a
 * cloud: it is that curve, carrying HOW MUCH of the possible lands where. Sampling galaxies and
 * counting where they fall answers that with noise; the change of variables answers it exactly.
 *
 * If the arrivals are spread evenly in the logarithm - which is the honest reading when nothing
 * in the rules picks out a mass or a size - then what lands in a stretch of `\log g_{N}` is
 * what came from the stretch of `\log R` that maps onto it, so the weight is
 *
 *     \frac{1}{\abs{\partial\log g_{N} / \partial\log R}}
 *
 * and THAT DERIVATIVE IS TAKEN, not estimated: `\partial\log f/\partial\log R = \frac{R}{f}
 * \frac{\partial f}{\partial R}`, and `\partial f/\partial R` is the algebra's own derivative
 * of the closed form `curvesOfEach` gives. Where the arrival changes slowly with radius, many
 * radii crowd into one stretch and the curve is dense there; where it changes quickly they
 * spread out and it is faint. No binning and no sampling anywhere in it.
 */
const crowdingOfArrivals: Rule = {
  name: "how fast an arrival changes with radius",
  because: "what lands in a stretch of the arrival is what came from the stretch of radius " +
    "that maps onto it, and that ratio is a derivative",
  fire: s => {
    const out: Omit<Node, "pass">[] = [];
    for (const how of ["gathered", "scattered"]) {
      const f = s.all("is").find(x => x.of === `what arrives with the mass ${how}`);
      if (!f) continue;
      const of = `how fast the ${how} arrival changes with radius`;
      if (s.nodes.has(key({ kind: "is", of } as Fact))) continue;
      const slope = simplify(mul(sym("R"), pow(f.to, -1), d(f.to, "R")));
      out.push({
        fact: { kind: "is", of, to: slope },
        via: "how fast an arrival changes with radius", from: [key(f)],
        because: `the ${how} arrival is a closed form in the radius, so how fast it moves ` +
          `with the radius is its derivative - and taken in the logarithm on both sides it is ` +
          `R over the arrival times that derivative. ONE OVER ITS SIZE IS THE WEIGHT the curve ` +
          `carries: slow means many radii crowded into one stretch of arrival, quick means few`,
        working: [`\\partial\\log g/\\partial\\log R = \\frac{R}{g}\\frac{\\partial g}{\\partial R}`,
          `= ${show(slope)}`,
          `and the density along the curve goes as one over its size`],
      });
    }
    return out;
  },
};

/**
 * WHAT A CIRCLE NEEDS TO STAY ON — a rotation curve, from the force law and nothing else.
 *
 * A body going round at radius `R` is accelerating toward the middle at `v^{2}/R`, and what
 * supplies that is what the medium delivers. So `v^{2} = Rg`, and every rotation curve this
 * theory has is that read at the `g` the rules give.
 *
 * IT IS A THEOREM AND NOT A SCRIPT. Written out by hand in a plotting file it would have to be
 * rewritten every time a rule moved; here it cites `F_{g}` and follows whatever that becomes.
 */
const orbiting: Rule = {
  name: "what a circle needs to stay on",
  because: "going round at a radius is accelerating toward the middle at v^{2}/R, and what " +
    "supplies that is what the medium delivers",
  fire: s => {
    const F = s.all("is").find(f => f.of === "F_{g}");
    const one = s.all("is").find(f => f.of === "F_{g} as one equation");
    if (!F || s.nodes.has(key({ kind: "is", of: "v^{2}" } as Fact))) return [];
    return [...(one ? [{
      fact: { kind: "is", of: "v^{2} as one equation",
        to: simplify(mul(sym("R"), one.to)) } as unknown as Fact,
      via: "what a circle needs to stay on", from: [key(one)],
      because: "the same circle read against the equation the rules give rather than against " +
        "its solution - so the arrival appears once here and twice there, and the two say the " +
        "same thing",
      working: [`v^{2}/R = g`, `v^{2} = R·${show(one.to)}`],
    } as any] : []), {
      fact: { kind: "is", of: "v^{2}", to: simplify(mul(sym("R"), F.to)) },
      via: "what a circle needs to stay on", from: [key(F)],
      because: "a circular orbit is an acceleration of v^{2}/R toward the centre and the " +
        "medium is what supplies it, so the speed a circle needs is the square root of the " +
        "radius times what is felt there. Nothing about galaxies is in this - it is what any " +
        "orbit is, and the galaxy comes in through what `g` is at that radius",
      working: [`v^{2}/R = g`, `v^{2} = R·${show(F.to)}`],
    }];
  },
};

/**
 * AND THE TWO ENDS OF IT, which are the two things a rotation curve can do.
 *
 * `F_{g}` interpolates between what arrives and the geometric mean of that with the scale, so
 * a curve does the same. Where the arrival dominates the orbit is Newtonian and the speed
 * falls off; where the scale does, the two powers of `R` cancel exactly and the speed does not
 * depend on radius at all. NEITHER IS PUT IN: both are `v^{2} = Rg` read at a limit of `g`
 * that `closing` already derived.
 */
const curveEnds: Rule = {
  name: "the two ends a rotation curve has",
  because: "the force law interpolates, so the curve does - and its ends are the ends of the " +
    "law read at a radius",
  fire: s => {
    const v2 = s.all("is").find(f => f.of === "v^{2}");
    const one2 = s.all("is").find(f => f.of === "v^{2} as one equation");
    const gN = s.all("is").find(f => f.of === "g_{N}");
    const a0 = s.all("is").find(f => f.of === "a_{0}");
    if (!v2 || !gN || !a0) return [];
    if (s.nodes.has(key({ kind: "is", of: "v^{2} where the arrival dominates" } as Fact)))
      return [];
    /* what arrives falls as the room does - one over the shell - so R·g_N loses one power */
    const dense = simplify(mul(sym("R"), field("g_{N}")));
    const thin = simplify(mul(sym("R"), pow(mul(field("g_{N}"), field("a_{0}")), 0.5)));
    return [{
      fact: { kind: "is", of: "v^{2} where the arrival dominates", to: dense },
      via: "the two ends a rotation curve has", from: [key(v2), key(gN)],
      because: "where what arrives is far above the scale the law gives back the arrival " +
        "itself, so the curve is R times it. What arrives is diluted over the room a shell " +
        "has, which in three dimensions is an inverse square, so this falls as one over the " +
        "radius and the speed as its root - Kepler, with nothing added",
      working: [`g -> g_{N}`, `v^{2} = ${show(dense)}`,
        `and g_{N} goes as R^{-(D-1)}, so v^{2} goes as R^{2-D} - inverse R at D = 3`],
    }, {
      fact: { kind: "is", of: "v^{2} where the scale dominates", to: thin },
      via: "the two ends a rotation curve has", from: [key(v2), key(gN), key(a0)],
      because: "and where the scale is far above what arrives the law gives their geometric " +
        "mean. THE POWERS OF THE RADIUS THEN CANCEL EXACTLY: what arrives falls as an inverse " +
        "square, its root falls as one over the radius, and the R in front of it undoes that - " +
        "so the speed does not depend on the radius at all. A FLAT CURVE IS NOT PUT IN " +
        "ANYWHERE; it is one power of R against the root of two",
      working: [`g -> \\sqrt{g_{N}a_{0}}`, `v^{2} = ${show(thin)}`,
        `g_{N} \\propto R^{-(D-1)}, so \\sqrt{g_{N}} \\propto R^{-(D-1)/2}`,
        `v^{2} \\propto R^{1-(D-1)/2} = R^{0} at D = 3 - flat, and only at D = 3`],
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
    /**
     * WHAT IS PART OF THIS LAW IS WRITTEN IN; WHAT IS A CONSTANT OF THE MEDIUM KEEPS ITS NAME.
     *
     * THE OLD TEST WAS WHETHER ANYTHING STOOD BEHIND THE NAME, and it drew the line in the
     * wrong place. `g_{N}` has a derivation, so it was cited - and a theorem whose whole
     * question is "with every factor written in" concluded `\frac{1}{2}g_{N} + \sqrt{\ldots}`,
     * which is the line it started from. Nothing was written in at all. The same defect made
     * `at D = 3` print an expression with no three in it, because every `D` was inside that
     * citation.
     *
     * THE TEST THAT WORKS IS WHETHER THE NAME IS ABOUT THIS ARRANGEMENT. A quantity that
     * depends on the separation or on either body - `g_{N}`, `met(R)`, what a body puts into
     * the medium - is part of what this law says about two bodies R apart, and a reader asking
     * for the law wants it. A quantity that does not - the settled density, the fold record,
     * the screening length, the rates - is a CONSTANT OF THE MEDIUM: it is the same number
     * whatever is where, it is a theorem with its own page, and writing it in would replace a
     * proof with its answer in the middle of a line about something else.
     *
     * A LEAF AND A BARE NUMBER ARE STILL WRITTEN IN, as before, because a name that saves a
     * reader nothing is a lookup that cost them something.
     */
    const about = (e: Expr) => ["R", "m", "A", "\\beta", "\\Sigma_{0}"].some(n => mentions(e, n));
    const laws = new Map(
      [...s.nodes.values()]
        .filter(n => n.fact.kind === "is" && !/ in (r|full)$/.test((n.fact as { of: string }).of) &&
          (n.from.length === 0 || simplify((n.fact as { to: Expr }).to).kind === "num" ||
            about((n.fact as { to: Expr }).to)))
        .map(n => [(n.fact as { of: string }).of, (n.fact as { to: Expr }).to] as const),
    );
    laws.delete(o.of);
    const steps: string[] = [`${o.of} = ${show(F.to)}`];
    const seen = new Set<string>();
    /*
     * SUBSTITUTED TO A FIXED POINT, not once per name. A law substituted in brings its own
     * unopened names with it - the screening length carries the density, which carries the
     * rates - so a single pass leaves some of them standing. It runs until nothing moves,
     * capped because a pair of laws that led back to one another would never stop, and
     * whichever is still there when it does is something this proof could not open.
     */
    /*
     * BOTH REARRANGEMENTS ARE CARRIED THROUGH THE SUBSTITUTION AND THE SHORTER IS KEPT.
     *
     * They are the same quantity - `folded` writes the arrival twice and the scale once,
     * `cleared` writes the arrival once and the scale twice - so which prints shorter depends
     * entirely on which of the two names turns out to be the big one, and that is not known
     * until they are written in. Guessing was how this ended up with three copies of two
     * hundred and fifty characters; substituting into both and measuring cannot.
     */
    const written = (start: Expr) => {
    let e = start;
    for (let i = 0; i < 24; i++) {
      const was = show(e);
      for (const [name, law] of laws) {
        if (!mentions(e, name) || mentions(law, name)) continue;
        /*
         * AND WHAT GOES IN IS ALREADY TIDIED, so that two copies of it are two copies.
         *
         * The fold leaves the arrival standing twice - once as a factor and once inside the
         * root - and the tidying used to happen to the WHOLE line afterwards. That reaches the
         * copy at the top level and not the one buried under a reciprocal inside a square
         * root, so the two came out written differently: `m'R^{1-D}` pulled out in front of
         * one and distributed through the other. A reader looking for the repetition could not
         * even see that it WAS one. Factor the law once, put the same thing in both places.
         */
        const put = deepFactored(law);
        e = simplify(replace(e, name, put));
        if (!seen.has(name)) { seen.add(name); steps.push(`${name} = ${show(put)}`); }
      }
      if (show(e) === was) break;
    }
      return folded(deepFactored(e));
    };
    /*
     * AND CLEARING THE SURD IS FOR READING ONLY, so it is offered only where a page is showing
     * the exact form beside it.
     *
     * `2a_{0}/\paren{\sqrt{1 + 4a_{0}/g_{N}} - 1}` writes the arrival once and is the shortest
     * honest way to print this law, but `\sqrt{1 + \epsilon} - 1` cancels away every digit it
     * has as `\epsilon` goes to nought - which is the strong-field limit, where the answer is
     * supposed to be Newton to machine precision. The folded form has no such loss.
     *
     * NOTHING IN THIS REPOSITORY EVALUATES AN `in full` LAW - `MODEL.boost` and `MEASURE` both
     * read `F_{g}`, which `closing` leaves in the stable form and no rearrangement here
     * touches. So the choice below decides what is READ and cannot decide what is computed;
     * `writingOut`'s output is a page, and the page carries the equation itself next to it.
     */
    const tries = [folded(F.to), cleared(F.to)].map(written);
    let e = tries.reduce((a, b) => (show(b).length < show(a).length ? b : a));
    /*
     * AND THE ROOM TAKEN OUT OF THE WHOLE OF IT.
     *
     * Both channels are diluted over the same shell at the same distance, so the law is ONE
     * geometry with two things arriving through it - and printed as two terms each carrying its
     * own `R^{1-D}` a reader has to notice that for themselves. `expand` first, because a
     * factor common to two terms is only common once the brackets are multiplied out.
     */
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
/**
 * AND EVERY LAW A PAGE ASKS FOR IN FULL, not just the force.
 *
 * `rotation.curve` asks what speed a circle needs and was answered `R\paren{\frac{1}{2}g_{N}
 * + \ldots}` - a citation, with the whole of the physics behind a name. So the curves get the
 * same treatment as the force: one written-out form apiece, and the theorem is about that.
 */
const IN_FULL = ["\\bar{m}", "F_{g}", "F_{g} as one equation", "g_{N}", "v^{2}", "v^{2} as one equation",
  "v^{2} with the mass gathered", "v^{2} with the mass scattered",
  "v^{2} with the mass gathered as one equation", "v^{2} with the mass scattered as one equation",
  "v^{2} where the arrival dominates", "v^{2} where the scale dominates"];
const inFull = IN_FULL.map(of => writingOut({ of }));

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
    /*
     * AND IT IS THE WRITTEN-OUT LAW THAT THE DIMENSION GOES INTO, not the one that cites.
     *
     * `F_{g}` names `g_{N}`, and every `D` in this law is INSIDE that name - so putting three
     * in produced `\frac{1}{2}g_{N} + \sqrt{\ldots}`, character for character the line it
     * came from, with the page headed `at D = 3` above an expression in which nothing was.
     * `F_{g} in full` has the arrival written into it, which is where the exponents are, so
     * that is what three dimensions is asked of.
     */
    const inner = gN ? deepFactored(evaluate(gN.to, { D: 3 })) : undefined;
    const got = folded(deepFactored(evaluate(F.to, { D: 3 })));
    /*
     * AND BOTH WRITINGS GET THREE PUT IN, because a page that shows two forms of a law needs
     * two of them at the dimension it is about. The solved one answers the question and the
     * one that is still an equation says where it came from.
     */
    const one = s.all("is").find(f => f.of === "F_{g} as one equation in full");
    return [...(one ? [{
      fact: { kind: "is", of: "F_{g} at D = 3 as one equation",
        to: deepFactored(evaluate(one.to, { D: 3 })) } as Fact,
      via: "and the same law in three dimensions", from: [key(one)],
      because: "the same equation with the dimension put in - what is felt is what arrives, " +
        "enhanced by the mismatch measured against itself, and in three dimensions what " +
        "arrives falls off as the square",
      working: [`${show(one.to)}`, `D = 3`],
    }] : []), {
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
 * HOW FAST A CARRIER ACTUALLY GOES — not one cell a tick, and `MOVEMENT` says so itself.
 *
 * `turns` is a DRAW, and it is the second thing `MOVEMENT` does to every lit ray:
 *
 *     turns () => draw { 1 -> this.steps ;  this.vertex.folds[d] -> outward d }
 *
 * ONE WAY STRAIGHT ON AGAINST THE WAYS EACH DIRECTION WAS FOLDED. So a ray arriving at a place
 * that has swallowed `n_{f}` folds carries on with probability `1/(1+n_{f})` and is turned
 * otherwise — and being turned is not being stopped, it is being sent somewhere that is not
 * straight out. WHAT ADVANCES A RAY RADIALLY IS THE SHARE OF ITS STEP THAT WAS STRAIGHT:
 *
 *     v = keeps = \frac{1}{1 + n_{f}}
 *
 * AND THAT IS STATISTICAL AND LOCAL, which is what the transport needed and what `waitForRoom`
 * could not give. A ray waits only where there is no cell at all, which is the frontier and
 * nowhere else; a ray TURNS wherever folds are, which is everywhere the vacuum has ever met
 * itself. One is a boundary condition, the other is the medium.
 *
 * CLOSE IN there are few folds between a body and a ray, `n_{f}` is small, `v` is one cell a
 * tick and the carrier streams — the dense branch, and Newton. FAR OUT a ray has crossed many
 * places that have folded, `n_{f}` is large, and its radial progress per tick falls as
 * `1/n_{f}`. The crossover is where a ray has met ONE fold, which is the mean free path, and
 * that is a theorem this proof already has.
 */
const waiting: Rule = {
  name: "how fast a carrier goes, which is the share of its step that was straight",
  because: "`turns` draws one way straight on against the ways each direction was folded, so " +
    "what carries a ray outward is the share of the draw that did not turn it",
  fire: s => {
    const nf = s.all("is").find(f => f.of === "n_{f}");
    const c = s.all("is").find(f => f.of === "\\bar{c}");
    if (!nf || !c || s.nodes.has(key({ kind: "is", of: "v" } as Fact))) return [];
    /*
     * AND BOTH OF `MOVEMENT`'S GATES ARE ON IT, because the rule applies both in order.
     *
     * `turns` decides WHICH way, and only the straight share advances a ray radially. `either`
     * then decides WHETHER that way leads anywhere, and only the share that does hands over at
     * all. A ray's progress is the product; taking one and not the other was reading half a
     * rule. The second share is exactly what the waiting does NOT get, so `v` and `a_{0}`
     * are two readings of one number and the transport is coupled to the medium it crosses -
     * which is the only place a non-linearity could come from and it is not put in anywhere.
     */
    const gate = s.all("is").find(f => f.of === "what share of a step advances");
    const got = simplify(mul(c.to, ...(gate ? [gate.to] : []),
      pow(add(num(1), field("n_{f}")), -1)));
    return [{
      fact: { kind: "is", of: "v", to: got },
      via: "how fast a carrier goes, which is the share of its step that was straight",
      from: [key(nf), key(c)],
      because: "MOVEMENT does not simply move a ray one cell: it draws where the ray goes, " +
        "one way straight on against the ways each direction was folded. A place that has " +
        "swallowed n_{f} folds sends it straight with 1/(1 + n_{f}) and turns it otherwise, " +
        "so what advances it OUTWARD is that share. It is statistical and it is local, and it " +
        "applies wherever the vacuum has met itself - which is everywhere, unlike the waiting, " +
        "which happens only where there is no cell at all and so only at the frontier",
      working: [
        `turns: 1 way straight on against folds[d] ways out along d`,
        `so a ray keeps its heading with 1/(1 + n_{f})`,
        `v = \\bar{c}/(1 + n_{f}) = ${show(got)}`,
        `n_{f} small: v -> one cell a tick, and the carrier streams`,
        `n_{f} large: v -> \\bar{c}/n_{f}, and it does not`,
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
    const nf = s.all("is").find(f => f.of === "n_{f}");
    if (!shell || !v || !nf) return [];
    if (s.nodes.has(key({ kind: "is", of: "n" } as Fact))) return [];
    /*
     * `\Phi = shell·n·v` IS A COUNT and it mentions no distance: the sites on a shell, what is
     * at each, and the share of a step that carried outward. Solved for the density it is
     *
     *     n = \frac{\Phi}{shell·v} = \frac{\Phi\paren{1 + n_{f}}}{shell·\bar{c}}
     *
     * AND THE FOLD RECORD IS WHAT MAKES IT MORE THAN A DILUTION. `n_{f}` is not a constant -
     * `accumulating` has it growing with the distance a ray has come, because a ray meets more
     * folded places the further it has travelled. So `1 + n_{f}` grows outward and the density
     * falls MORE SLOWLY than the room alone would make it.
     *
     * CLOSE IN `n_{f}` is nothing, `n` is the flux over the room, and in three dimensions that
     * is an inverse square - Newton, unchanged. FAR OUT `n_{f}` dominates and carries a power
     * of the distance back up, and how much it carries back is what a rotation curve reads.
     */
    const got = simplify(mul(sym("\\Phi"), pow(shell.as, -1), pow(v.to, -1)));
    return [{
      fact: { kind: "is", of: "n", to: got },
      via: "what crosses a shell is the room times what is at each site times how fast it goes",
      from: [key(shell), key(v), key(nf)],
      because: "count what crosses a shell in a tick - the sites on it, what is at each, and " +
        "the share of a step that went outward - and MOVEMENT neither makes nor destroys, so " +
        "that count is carried. Solved for what is AT a site it is the flux over the room over " +
        "the speed, and the speed is the share of the draw that did not turn. THE FOLD RECORD " +
        "IS WHAT MAKES THIS MORE THAN A DILUTION: it grows with how far a ray has come, so " +
        "1 + n_{f} rises outward and the density falls more slowly than the room alone would " +
        "have it. Close in that is nothing and this is an inverse square; far out it is not",
      working: [
        `\\Phi = shell·n·v`,
        `v = ${show(v.to)}`,
        `n = \\Phi/(shell·v) = ${show(got)}`,
        `n_{f} = ${show(nf.to)}, which grows with how far a ray has come`,
      ],
    }];
  },
};

export const RULES: Rule[] =
  /* the space line first, because the ray line's balance is written in the share it settles */
  [roomBalance, ehrhart, counting, massOf, saturating, spreading, screening, refracting, accumulating, substituting, metricOf,
   balancing, unbiased, freePath, summing, horizon, bending, crossing, nearField,
   shadowing, receiving, receding, shortfall, waiting, transporting, assembling, closing, arrangement, scaleCrossed, orbiting, curveEnds, curvesOfEach, crowdingOfArrivals, makingRate, hubbleRate, expansionScale, crowding, atThatDensity, inMotion,
   ...inFull, canItPush, inThree];

/** everything that follows, and then nothing new */
/**
 * AND A RULE IS ONLY RE-RUN WHERE RE-RUNNING IT COULD MATTER.
 *
 * A rule reads the store and nothing else, so IF THE STORE HAS NOT CHANGED SINCE IT LAST CAME
 * UP EMPTY, IT WILL COME UP EMPTY AGAIN. Running it anyway is not a cheap no-op: a rule
 * rebuilds its whole derivation before `add` finds the fact already there and drops it, and
 * these derivations solve roots and simplify large trees. With forty passes over every rule,
 * work done once was being redone dozens of times and thrown away each time.
 *
 * So each rule remembers the version it last ran at with nothing to show for it, and is skipped
 * until something lands. THE ANSWER IS UNCHANGED: the fixpoint is the same fixpoint, because a
 * rule skipped this way could not have added anything. Only the wasted passes are gone.
 */
export const saturate = (s: Store, rules = RULES, cap = 40): Store => {
  const idle = new Map<Rule, number>();
  for (let pass = 1; pass <= cap; pass++) {
    s.pass = pass;
    let grew = 0;
    for (const rule of rules) {
      if (idle.get(rule) === s.version) continue;
      const before = s.version;
      let any = false;
      for (const n of rule.fire(s)) if (s.add(n)) { grew++; any = true; }
      if (!any) idle.set(rule, before);
    }
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
   * AND EVERY RATE IS ONE, WHICH THE REWRITE SAYS AND NOBODY CHOOSES.
   *
   * A rewrite fires on every match it has, once a tick. That is what a rule of this model IS,
   * so its rate is one per match per tick and the name on it - `\nu`, `\sigma` - is a LABEL
   * for which rewrite, not a number. The line was carrying them as free symbols, so anything
   * reading it had to be handed values, and two knobs sat under every result that came out.
   */
  for (const name of new Set(eq.terms.map(t => t.rate).filter(Boolean) as string[]))
    out.push({
      fact: { kind: "is", of: name, to: num(1) }, via: "the rewrite", from: [],
      because: "a rewrite fires on every match it has, once a tick - that is what a rule of " +
        "this model is. So its rate is ONE per match per tick, and the name on it says which " +
        "rewrite rather than how often: there is nothing here to choose or to fit",
      working: [`${name} = 1 per match per tick`],
    });

  /*
   * AND WHAT EACH LEDGER NETS OVER THE WHOLE LINE — every term, with its own count and sign.
   *
   * A RULE THAT WANTS THE NET RATE MUST NOT REBUILD IT. `receding` was computing its own from
   * the making and the taking, which was right while those were the only two terms with space
   * in them; the waiting is a third and it was left out, so the recession and the rate space
   * is made disagreed about the same line. One quantity, one fact.
   */
  for (const ledger of ["rays", "space", "folds"] as const) {
    const parts: Expr[] = [];
    for (const t of eq.terms) {
      if (t.side === "left" || !t.rules.length || !t.rate) continue;
      const body = simplify(mul(field(t.rate),
        ...(t.share ? [asRayShare(t)] : []),
        ...(t.degree > 0 ? [pow(rho, t.degree)] : [])));
      const c = ledger === "rays" ? t.rayCount
        : ledger === "space" ? t.spaceCount : t.foldCount;
      parts.push(simplify(mul(body, asExpr(c))));
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
        `${show(asExpr(ledger === "rays" ? t.rayCount
          : ledger === "space" ? t.spaceCount : t.foldCount))}`),
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
    for (const [ledger, c] of
      [["rays", t.rayCount], ["space", t.spaceCount], ["folds", t.foldCount]] as const) {
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
  /*
   * AND WHAT SHARE OF A STEP ACTUALLY MOVES ANYTHING, which is the streaming term's own gate.
   *
   * `MOVEMENT` puts a lit ray through TWO conditions in order: `turns` draws which way it
   * goes, and then `either` asks whether that way leads anywhere - hand over if it does, make
   * the room and wait if it does not. The transport term carries the second as its share, and
   * the waiting term on the other line carries one less it. So the two are not independent
   * facts about the medium: they are the two arms of one choice, and a share that is not
   * advancing a ray is making room.
   *
   * IT IS READ OFF THE TERM, NOT WRITTEN HERE. Whatever the rule's condition carries is what
   * arrives, so a rule edited in the theory moves this with it - and if the condition carries
   * no share this is simply absent and the transport is what it was.
   */
  if (moving?.share) out.push({
    fact: { kind: "is", of: "what share of a step advances", to: simplify(moving.share) },
    via: moving.rules[0], rule: moving.rules[0], from: [],
    because: "the streaming term is gated: a ray hands over only where the way it drew leads " +
      "somewhere, and where it does not it makes the room and waits instead. That gate is on " +
      "the transport, so it is on the speed - and its complement is on the waiting, which is " +
      "the other arm of the same either and the only other thing in these rules that makes " +
      "space. One share, both lines",
  });
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
/**
 * AND BOTH MAPS ARE BUILT ONCE PER STORE, NOT ONCE PER PAGE.
 *
 * Every fact has to be simplified and printed to be keyed, and after the laws started being
 * written out in full those facts are hundreds of characters each - so building the map is
 * real work. `annotate` and `standingFor` are each called once per theorem and each built
 * their own, which is forty-odd rebuilds of the same thing over a store that has not changed:
 * the run went from five seconds to forty-five without a single new derivation in it.
 *
 * KEYED ON THE STORE'S VERSION, which it already keeps because `saturate` needs to know
 * whether a pass added anything. So a map built while the closure was still running is
 * dropped the moment it would be wrong, and nothing has to remember to invalidate it.
 */
const cached = <T>(kind: string, s: Store, make: () => T): T => {
  const at = (s as any).__cache ??= new Map<string, { v: number; of: unknown }>();
  const had = at.get(kind);
  if (had && had.v === (s as any).version) return had.of as T;
  const of = make();
  at.set(kind, { v: (s as any).version, of });
  return of;
};

const namesKnownTo = (s: Store, at: string) => cached(`known:${at}`, s, () => {
  /* what the store knows, written at the separation this law is about */
  const known = new Map<string, { of: string; because: string }>();
  for (const n of s.nodes.values()) {
    if (n.fact.kind !== "is") continue;
    const f = n.fact as Extract<Fact, { kind: "is" }>;
    /*
     * THE WORKING FORMS ARE NOT NAMES. `X in r` and `X in full` are the same claim as `X`
     * written differently for a reader, so matching against them labels a piece with a
     * bookkeeping name instead of the one it has.
     */
    if (/ in (r|full)$/.test(f.of)) continue;
    for (const form of [f.to, replace(f.to, "r", sym(at))]) {
      const k = show(simplify(form));
      if (k !== "0" && k !== "1" && !known.has(k)) known.set(k, { of: f.of, because: n.because });
    }
  }
  return known;
});

/**
 * EVERY NAME THE STORE SETTLES, so a symbol standing in a line can be looked up.
 *
 * A NAME MADE OF WORDS IS WRITTEN `\text{...}` INSIDE A FORMULA, because the notation renders
 * bare letters as a run of separate variables and `what arrives with the mass gathered` would
 * come out as thirty of them. The wrapper is presentation, so it is stripped before the
 * lookup - the fact is called what it is called.
 */
const plain = (name: string) => name.replace(/^\\text\{(.*)\}$/, "$1");

const byName = (s: Store) => cached("byName", s, () => {
  const out = new Map<string, { to: Expr; because: string }>();
  for (const n of s.nodes.values()) {
    if (n.fact.kind !== "is") continue;
    const f = n.fact as Extract<Fact, { kind: "is" }>;
    if (!out.has(f.of)) out.set(f.of, { to: f.to, because: n.because });
  }
  return out;
});

export const annotate = (e: Expr, s: Store, at = "R", of?: string): Annotated[] => {
  const known = namesKnownTo(s, at);
  const out: Annotated[] = [];
  const seen = new Set<string>();
  /*
   * AND THE LAW IS NOT AN ANNOTATION OF ITSELF.
   *
   * The whole expression matches its own fact, so the first thing `look` found was the line
   * it was called on - it named it, returned, and took nothing apart. Every law with a page
   * of its own annotated to exactly one row saying that it was itself. So the top level is
   * always descended into, and only what is INSIDE it can be named.
   */
  const whole = show(simplify(e));
  const look = (x: Expr, depth: number) => {
    const k = show(simplify(x));
    const hit = known.get(k);
    if (hit && !seen.has(k) && k !== whole && hit.of !== of &&
        hit.of !== "F_{g}" && !hit.of.startsWith("F_{g} ")) {
      seen.add(k);
      out.push({ part: k, is: hit.of, because: hit.because });
      return;                                  /* named whole - do not take it apart */
    }
    if (depth > 5) return;
    if (x.kind === "mul" || x.kind === "add") for (const y of x.of) look(y, depth + 1);
    else if (x.kind === "pow") look(x.base, depth + 1);
  };
  look(simplify(e), 0);
  return out;
};

/* —— and what every name in a finished law stands for ————————————————————— */

export type Standing = { name: string; is: string; because: string };

/**
 * THE `where` UNDER A LAW — every name it leans on, opened ONCE.
 *
 * A LAW THAT CITES ITS PARTS BY NAME IS UNREADABLE UNTIL THE NAMES ARE GIVEN, and a law with
 * the names substituted in is unreadable for the opposite reason. `F_{g} = \frac{1}{2}g_{N} +
 * \sqrt{\frac{1}{4}g_{N}^{2} + g_{N}a_{0}}` mentions the arrivals THREE TIMES; writing them
 * in prints the same two-channel expression three times over and the shape of the root - which
 * is the whole content of that line - disappears into it. `galaxy.point` was four hundred
 * characters of it, and the two galaxy theorems differed in a factor buried a third of the way
 * through a line nobody could hold in their head.
 *
 * SO NEITHER: the line keeps its names, and every name is opened underneath it exactly once.
 * That is how the substitution would be written by hand, and it is the only arrangement whose
 * length grows with the number of DISTINCT parts rather than with how often they are used.
 *
 * BREADTH FIRST, so a reader substitutes downward. The law's own names come first, then what
 * those lean on, and so on until nothing new appears.
 *
 * AND A NAME THAT STANDS FOR ITSELF IS NOT OPENED. `\nu` is a rate the rules carry and its
 * fact says so; printing `\nu = \nu` is noise. What is left is exactly the quantities that
 * have something behind them.
 */
export const standingFor = (e: Expr, s: Store, of?: string, depth = 6): Standing[] => {
  const facts = byName(s);
  const known = namesKnownTo(s, "R");
  /*
   * AND A PART THAT HAS A NAME IS PUT BACK AS ITS NAME, one level at a time.
   *
   * `g_{N}` opened is four hundred characters with a `+` somewhere in the middle of it, and
   * which half is the vacuum's channel and which the two bodies' own radiation is left for the
   * reader to work out from the factors — even though both halves are separately derived facts
   * sitting in the same store. So before a row is printed, its top-level terms are matched back
   * against what the store settled: `g_{N} = the vacuum's channel + the meetings' channel`, and
   * each of those gets a row of its own underneath.
   *
   * ONLY WHERE THE NAME IS SHORTER THAN WHAT IT STANDS FOR, because citing is worth it exactly
   * when it saves a reader an expression. A row reading `F + F` in place of `\frac{1}{2} +
   * \frac{1}{2}` has cost them a lookup and saved them nothing, and `\text{how motion moves
   * it}` in place of `\paren{1-\beta}^{2}` is longer than the thing it hides.
   */
  const cite = (x: Expr, self: string, d = 0): Expr => {
    if (d > 0) {
      const k = show(simplify(x));
      const hit = known.get(k);
      if (hit && hit.of !== self && !/ in (r|full)$/.test(hit.of) &&
          k.length > Math.max(24, hit.of.length + 8))
        return field(`\\text{${hit.of}}`);
    }
    if (d > 2) return x;
    if (x.kind === "add") return { kind: "add", of: x.of.map(y => cite(y, self, d + 1)) };
    if (x.kind === "mul") return { kind: "mul", of: x.of.map(y => cite(y, self, d + 1)) };
    return x;
  };
  const out: Standing[] = [];
  const done = new Set<string>([...(of ? [of] : [])]);
  let front: Expr[] = [simplify(e)];
  for (let round = 0; round < depth && front.length; round++) {
    const found: string[] = [];
    const walk = (x: Expr) => {
      switch (x.kind) {
        case "sym": case "field": found.push(x.name); return;
        case "add": case "mul": x.of.forEach(walk); return;
        case "pow": walk(x.base); if (typeof x.by !== "number") walk(x.by); return;
        case "grad": case "log": case "exp": walk(x.of); return;
        case "choose": walk(x.n); walk(x.k); return;
        case "gammaInc": walk(x.s); walk(x.x); return;
        case "root": walk(x.of); return;
        default: return;
      }
    };
    front.forEach(walk);
    const next: Expr[] = [];
    for (const name of found) {
      if (done.has(name)) continue;
      done.add(name);
      const f = facts.get(plain(name));
      if (!f) continue;
      const to = simplify(f.to);
      /* a name that stands for itself has nothing behind it and is a premise, not a part */
      if (show(to) === name) continue;
      const cited = cite(to, plain(name));
      out.push({ name: plain(name), is: show(cited), because: f.because });
      next.push(cited);
    }
    front = next;
  }
  return out;
};
