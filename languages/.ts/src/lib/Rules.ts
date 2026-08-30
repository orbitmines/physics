/**
 * A RULE — a quantifier, some gates, and a body written in `lib/Language.ts`.
 *
 * NOTHING IN A RULE IS HOST CODE. The body is an expression of the language, so compiling it
 * gives the function a tick runs and counting it gives the continuous term; there is one
 * description and both readings come off it. `lib/Continuum.ts` never sees a closure.
 *
 * WHAT THE QUANTIFIER DECIDES, and it decides most of the shape:
 *
 *   THE DEGREE IN n. A rule about one ray is linear in the density; a rule about a FACING
 *   PAIR of ends is quadratic, because it needs a ray AND something coming the other way.
 *   That is what separates a meeting from a decay, and it is not written anywhere — it is
 *   counted off how many population-bearing refs the rule is quantified over.
 *
 *   THE FACING FACTOR. A pair of ends IS a meeting across an edge, so the rate goes against
 *   the oncoming CURRENT rather than the density where the ray stands: `F = (1 - d^·j^)/2`,
 *   one head-on, nought co-moving. A rule not about a pair cannot be given an F by accident
 *   and one that is cannot be denied one.
 *
 *   AND WHETHER IT IS A RULE OF THE MEDIUM AT ALL. A rewrite that fires only on matches
 *   something OUTSIDE the model put there is a statement about what was put in rather than
 *   about what the vacuum does, so its term is `Sigma` whatever its body. That is the
 *   separation the whole equation is worth having, and it is a property of where a rule fires.
 */
import { Act, Doing, Env, Term } from "./Language.ts";
import { Ref, RuleType } from "./Theory.ts";

/**
 * WHAT A GATE COMES TO IN THE CONTINUOUS READING — and there are only three answers.
 *
 * `room`    the match has to be EMPTY, so the term carries how much room there is: `(1-rho)`.
 * `held`    the match has to be CARRYING, which is what makes the term a power of the density
 *           rather than a rate against bare space.
 * `outside` the match belongs to something put into the box from outside, so the rule is not
 *           a rule of the medium and its term is `Sigma`.
 */
export type Reads =
  | { as: "room"; factor: string }
  | { as: "held" }
  | { as: "outside" };

export type Gate = {
  /**
   * THE COLUMN THE STORE CAN DECLINE TO BUILD A MATCH ON.
   *
   * The same condition asked one level down: a rule about active rays is a rule about refs
   * with something in the `active` column, and a store keeping its refs in columns can skip
   * the rest without building them. It must read the same either way — it is the gate said to
   * the walk, not a hint — which is what putting it on the gate itself guarantees.
   */
  column?: string;
  /** the condition, as an expression of the language */
  test: Term;
  reads: Reads;
};

export const gate = (g: Gate): Gate => g;

export type Quantifier = {
  /** what the walk is asked for */
  type: RuleType;
  /**
   * WHAT IT IS REALLY ABOUT, where that is not what the walk is asked for.
   *
   * A rule settled in one pass over the whole store is registered as a rule of the WORLD —
   * that is how a store keeping its rays in columns exchanges two of them instead of being
   * asked ray by ray. It is still a statement about rays, and the degree of its term is the
   * degree of what it is ABOUT rather than of how it is walked.
   */
  about?: RuleType;
  /** the matches are things put into the box from outside, so the term is `Sigma` */
  outside?: boolean;
  says: string;
};

export type Declared = {
  quantifier: Quantifier;
  gates: Gate[];
  /**
   * WHAT THE RATE THIS FIRES AT IS CALLED — a NAME, and the only thing in a rule that is.
   *
   * Everything else here is a claim that can be wrong and is therefore computed: what the rule
   * does, how often it can, what it needs. `\sigma` is not a claim — it is what the
   * annihilation rate is CALLED in the literature this is being read against, and calling it
   * something else would change nothing but the spelling. A rule with no name for its rate
   * simply has none in the line, which is right for transport and for the tick.
   */
  rate?: string;
  /** the body, as an expression - `doing` is where the term's sign and ledgers come from */
  body: Act;
  /** the walk's own gate, taken off whichever gate offered a column */
  where?: string;
  /** the gates and the body, made into the one function a tick runs */
  exec: (...refs: any[]) => void;
};

/** how many of the refs a quantifier hands over carry population - a point is space, not traffic */
const bearing = (r: string) => r === "Ray" || r === "Boundary";

export const degreeOf = (q: Quantifier): number => {
  const t = q.about ?? q.type;
  if (t === "World") return 0;
  return (Array.isArray(t) ? t : [t]).filter(bearing).length;
};

/** a meeting is a chain of two ends across an edge, and nothing else in this vocabulary is */
export const facingOf = (q: Quantifier): boolean => {
  const t = q.about ?? q.type;
  return Array.isArray(t) && t.length === 2 && t[0] === "Boundary" && t[1] === "Boundary";
};

/**
 * THE GATES AND THE BODY, MADE INTO ONE FUNCTION — and the environment reused between matches.
 *
 * A gate and a body are values so that they can be read as well as run, and the obvious way to
 * run them is to build an environment per match and spread the refs into each. At a hundred
 * and seventy thousand matches a tick that allocation is most of what a rule costs. Every
 * quantifier here hands over one ref or two, so the environment is made ONCE per rule and its
 * slots written per match — nothing holds on to it, because `run` never escapes.
 */
const compile = (gates: Gate[], body: Act): ((...refs: any[]) => void) => {
  const env: Env = { at: [], in: [] };
  const tests = gates.map(g => g.test.read);
  const run = body.run;
  if (!tests.length) return (x: any, y: any) => { env.at[0] = x; env.at[1] = y; run(env); };
  if (tests.length === 1) {
    const t = tests[0];
    return (x: any, y: any) => {
      env.at[0] = x; env.at[1] = y;
      if (t(env)) run(env);
    };
  }
  return (x: any, y: any) => {
    env.at[0] = x; env.at[1] = y;
    for (let i = 0; i < tests.length; i++) if (!tests[i](env)) return;
    run(env);
  };
};

/**
 * THE BUILDER — `at.point.of(neutral).does(split)`, which IS the rule and IS also the term.
 *
 * Nothing comes out of this that is not a quantifier, some gates and an expression. There is
 * nowhere to write a claim about what the rule does, because what it does is the expression
 * and the expression says so itself.
 */
export class Rules {
  constructor(
    private quantifier: Quantifier,
    private gates: Gate[] = [],
    private named?: string,
  ) {}

  /** one more thing a match has to be before this rule is about it */
  of = (g: Gate) => new Rules(this.quantifier, [...this.gates, g], this.named);

  /** what the rate it fires at is called - see `Declared.rate` */
  called = (rate: string) => new Rules(this.quantifier, this.gates, rate);

  /** and what it does to a match that got through */
  does = (body: Act): Declared => ({
    quantifier: this.quantifier, gates: this.gates, body, rate: this.named,
    where: this.gates.find(g => g.column)?.column,
    exec: compile(this.gates, body),
  });
}

const quantifier = (q: Quantifier) => new Rules(q);

/** every point of the lattice - space itself, which carries no population of its own */
export const at = {
  point: quantifier({ type: "Local", says: "every point of the lattice" }),
};

/** every ray, one at a time */
export const along = {
  ray: quantifier({ type: "Ray", says: "every ray, wherever it is" }),
};

/**
 * EVERY FACING PAIR OF ENDS - a ray and whatever is coming the other way across one edge.
 *
 * The quantifier that makes a term quadratic and gives it its facing factor, and it does both
 * because of what it IS rather than because anything says so: a meeting needs two, and the two
 * are across an edge, so the rate goes against the oncoming current.
 */
export const facing = {
  pair: quantifier({
    type: ["Boundary", "Boundary"] as Ref[],
    says: "every facing pair of ends - a ray and what is coming the other way across an edge",
  }),
};

/** the whole world as one match - for what a store can settle in one pass over its columns */
export const over = {
  world: Object.assign(
    quantifier({ type: "World", says: "the world, as one match" }),
    {
      of: (about: RuleType, says: string) => quantifier({ type: "World", about, says }),
    },
  ),
  /**
   * THE BODIES SOMETHING OUTSIDE THE MODEL PUT IN THE BOX - and so, Sigma.
   *
   * A source is not made by any rule here: it is added to a world from outside, and a rule
   * quantified over sources is a rule about what was put in rather than about what the medium
   * does. That is what makes its term `Sigma` — derived from where it fires, not declared —
   * and it is why the rules never have to know what a hydrogen atom is.
   */
  sources: quantifier({
    type: "World", outside: true,
    says: "every source in the world - what was put into the box from outside",
  }),
};

export type { Act, Doing };
