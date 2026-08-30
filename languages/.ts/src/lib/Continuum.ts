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
import { showCount } from "./Language.ts";
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
  /** rays one firing makes (+) or puts out (−), COUNTED OFF THE BODY - what decided the sign */
  rays: string;
  /** and points of space, which is the other ledger and the one gravity is read off */
  space: string;
  says: string;
};

export type Equation = {
  theory: string;
  population: string;
  terms: Term[];
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
  const outside = q.outside || d.gates.some(g => g.reads.as === "outside") ||
    d.body.doing.some(b => b.outside);
  /* the gates that are a factor rather than a power of the density - a point that has to be
   * empty carries how much room there is left to make anything in */
  const room = d.gates.map(g => g.reads.as === "room" ? g.reads.factor : "").join("");

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
      rules: [name], degree, facing,
      rays: showCount(doing.rays), space: showCount(doing.space), says: d.body.says,
    };

    if (outside) return {
      ...shape, rules: [], sign: 1 as const, symbol: source, side: "right" as const,
    };
    if (doing.settles) return {
      ...shape, sign: 1 as const, symbol: `\\partial_{t}${population}`,
      operator: "\\partial_{t}", side: "left" as const,
    };

    const net = doing.rays.n + Object.values(doing.rays.of).reduce((x, y) => x + y, 0);
    if (!net && doing.carries) return {
      ...shape, sign: 1 as const, symbol: `\\hat{d}·\\nabla_{x}${population}`,
      operator: "\\hat{d}·\\nabla_{x}", side: "left" as const,
    };

    const rate = d.rate ?? "";
    const pw = powers(population, degree);
    /* set apart, so `\sigma n` reads as two things rather than one symbol nobody has seen */
    return {
      ...shape,
      sign: (net < 0 ? -1 : 1) as -1 | 1,
      symbol: rate + room + (rate && !room && pw ? " " : "") + pw + (facing ? "F" : ""),
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
    toString() {
      const left = terms.filter(t => t.side === "left")
        .sort((a, b) => Number(a.operator !== "\\partial_{t}") -
          Number(b.operator !== "\\partial_{t}"));
      const right = terms.filter(t => t.side === "right")
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
