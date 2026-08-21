/**
 * THE PROVER — everything that follows from what is known, and then the goal looked up.
 *
 * FORWARD, NOT BACKWARD, AND THAT IS THE POINT OF THE WHOLE FOLDER. A backward prover
 * is handed the thing to prove and works towards the premises, which means somebody has
 * already written the thing to prove — and if the thing to prove is `F ∝ 1/r²` then
 * 1/r² was in the input and the exercise is circular. This one is handed the premises
 * the probes came back with, closes them under the inference rules until nothing new
 * appears, and only THEN is asked what became of the force. The exponent is read off
 * the answer. Nobody types it.
 *
 * WHICH ALSO MEANS IT CAN SURPRISE YOU, and it is supposed to. Saturation derives every
 * law the premises support, not only the one that was wanted: run it on a lattice whose
 * shells grow as something other than D−1 and it will say so, run it on a theory whose
 * medium loses carriers in flight and the `conserved` premise never arrives, so the
 * dilution rule never fires and there is simply no law about the force at the end. A
 * missing conclusion is a result here, and `explain` says which premise was absent.
 *
 * SHORTEST DERIVATION WINS. Facts arrive in passes, a pass is a round of every rule
 * against everything known, and a fact is kept with the pass it first appeared in. So
 * the recorded route to a conclusion is the fewest steps that reach it, which is the
 * one worth reading — the same conclusion is usually reachable half a dozen longer ways
 * once substitution is in the rule set.
 */
import { Scaling, sshow } from "./Algebra.ts";
import { Fact, Glossary, key, says } from "./Fact.ts";
import { show as xshow, showFactored } from "./Expr.ts";

/** a number a probe came back with, carried through the proof to the page */
export type Measured = {
  name: string; value: number; err?: number; unit?: string; note?: string;
};

/** a fact, with where it came from — a probe, or a rule and the facts it fired on */
export type Node = {
  id: string;
  fact: Fact;
  /** the rule that produced it, or the probe id for a premise */
  via: string;
  /** whether this is something measured or something concluded */
  premise: boolean;
  /** the ids it was derived from, in the order the rule read them */
  from: string[];
  /** one line of prose: why this step is allowed */
  because: string;
  /** the working, where the rule has arithmetic to show */
  line?: string;
  /**
   * WHAT THE STEP ACTUALLY DID, line by line.
   *
   * A step that gives only its conclusion and the name of the rule that reached it is a
   * citation, not a derivation — "by differencing" tells a reader nothing they could
   * check with a pencil. So a rule that has arithmetic in it writes the arithmetic out:
   * the identity it started from, the substitution it made, and the cancellation that
   * left the answer.
   */
  working?: string[];
  measured?: Measured[];
  pass: number;
};

export type Emitted = {
  fact: Fact; from: string[]; because: string; line?: string;
  working?: string[]; measured?: Measured[];
};

export type Rule = {
  name: string;
  /** what this rule is, in one line — printed above the steps it produced */
  because: string;
  fire(s: Store): Emitted[];
};

export class Store {
  readonly nodes = new Map<string, Node>();
  pass = 0;

  /** whether anything here already says this */
  has = (f: Fact) => this.nodes.has(key(f));
  get = (f: Fact) => this.nodes.get(key(f));

  /**
   * A PREMISE, AND IT MUST HAVE A RUN BEHIND IT.
   *
   * THIS IS THE ONE GUARANTEE THE FOLDER RESTS ON, so it is enforced here rather than
   * promised in a comment. A prover fed its premises by hand proves whatever it was
   * fed — it would say `F ∝ 1/r²` about a world that does not exist, and read exactly
   * the same on the page as one that had measured it. So a leaf of a proof carries the
   * probe that produced it and the numbers that probe came back with, and a leaf
   * without them is refused before it can reach a conclusion.
   */
  premise(e: Emitted, probe: string): Node | undefined {
    if (!e.measured?.length) throw new Error(
      `${key(e.fact)} was offered as a premise by ${probe} with nothing measured behind ` +
      `it. Every premise in this folder is the result of a run; a fact that is merely ` +
      `believed cannot be one, because a proof from beliefs is a proof about beliefs.`);
    return this.add(e, probe, true);
  }

  /**
   * A DEFINITION — true by what a word means, so there is nothing to measure.
   *
   * The only leaf that is neither probed nor derived, and it is kept distinct from both
   * so that a reader can count them. `F = A·δ/site` is one; if a second ever appears in
   * a theorem it should be looked at hard, because a definition is where an assumption
   * can hide wearing a tautology's clothes.
   */
  define = (e: Emitted, by: string) => this.add(e, `definition:${by}`, true);

  /**
   * A RESULT PROVED EARLIER, USED HERE - and cited rather than re-derived.
   *
   * `meeting.rate` needs a source's charge to thin as it spreads, which is exactly what
   * `gravity.falloff` establishes. Proving it again inside the second theorem would be
   * the same twelve steps a second time, and a reader who has just read them does not
   * want them twice: what they want is the line, and a pointer to where it was got. So a
   * cited result enters as its own kind of leaf, carrying the theorem that established
   * it, and shows on the page as a reference back.
   *
   * IT IS NOT A DEFINITION AND NOT AN ASSUMPTION. Everything behind it was probed and
   * derived somewhere; this is a statement about WHERE, and the citation names it so the
   * chain can be followed.
   */
  cite = (e: Emitted, theorem: string) => this.add(e, `cited:${theorem}`, true);

  /** a fact a rule produced — see `saturate` */
  derive = (e: Emitted, rule: string) => this.add(e, rule, false);

  private add(e: Emitted, via: string, premise: boolean): Node | undefined {
    const id = key(e.fact);
    /* FIRST ARRIVAL KEEPS THE SLOT — see the header. A later pass reaching the same
     * fact has reached it the long way round, and overwriting would replace a proof
     * with a worse proof that happens to be more recent. */
    if (this.nodes.has(id)) return undefined;
    const n: Node = { id, via, premise, from: e.from, because: e.because,
      line: e.line, working: e.working, measured: e.measured, fact: e.fact,
      pass: this.pass };
    this.nodes.set(id, n);
    return n;
  }

  /** every fact of a kind, as facts */
  all = <K extends Fact["kind"]>(kind: K): Extract<Fact, { kind: K }>[] =>
    [...this.nodes.values()].map(n => n.fact)
      .filter(f => f.kind === kind) as Extract<Fact, { kind: K }>[];

  /** every scaling law known for a quantity */
  laws = (of: string): Scaling[] =>
    this.all("scales").filter(f => f.of === of).map(f => f.by);

  /** whether a quantity has a law of its own — what makes a base reducible */
  known = (of: string) => this.all("scales").some(f => f.of === of);
}

/**
 * EVERYTHING THAT FOLLOWS, AND THEN NOTHING NEW.
 *
 * The cap is a guard against a rule set that grows facts for ever rather than a budget:
 * substitution over a cyclic pair of definitions would, and there is no reason a
 * physics premise set should. Reaching it is a bug in the rules and says so.
 */
export const saturate = (s: Store, rules: Rule[], cap = 24): Store => {
  for (let pass = 1; pass <= cap; pass++) {
    s.pass = pass;
    let grew = 0;
    for (const rule of rules)
      for (const e of rule.fire(s))
        if (s.derive(e, rule.name)) grew++;
    if (!grew) return s;
    if (pass === cap) throw new Error(
      `the rules are still producing facts after ${cap} passes - something in them is ` +
      `feeding itself, and a proof that never closes is not a proof`);
  }
  return s;
};

/**
 * THE LAW THIS PROOF ENDED WITH FOR A QUANTITY — the most reduced one it reached.
 *
 * A saturated store holds several laws for the same thing: `F ∝ A·n`, then `F ∝ A·S/
 * shell`, then `F ∝ A·S/(κ·r^(D−1))` as substitution eats one base at a time. The last
 * is the answer, and "last" is said structurally rather than by pass number: it is the
 * one whose bases are all PRIMITIVE — nothing left in it that this proof knows how to
 * expand. That is what makes it a statement about the lattice and the source rather
 * than a statement about another intermediate quantity.
 */
export const conclusion = (s: Store, of: string): Node | undefined => {
  /*
   * A THEOREM MAY END IN A NUMBER RATHER THAN IN A SHAPE.
   *
   * `gravity.falloff` concludes with a proportionality and `lattice.bias` concludes with
   * 1/12. Both are answers; only the first is a `scales`. Looked for by scaling alone,
   * the second theorem reported that no law followed while its answer sat finished in
   * the store - which reads as a failure of the theory rather than as a category the
   * search had not been taught. A value is preferred where there is one: it is the
   * strictly stronger statement, since it fixes the constant a proportionality drops.
   */
  /*
   * AND A THEOREM MAY END IN "THERE IS NO TOTAL".
   *
   * `gravity.reach` concludes that the ambient field does not converge, which is an
   * answer and not a missing one - the divergence IS the result, and it is what tells you
   * that whatever ends the pull cannot be geometry. Looked for among scalings and values
   * only, it read as a theorem that failed.
   */
  const diverging = [...s.nodes.values()]
    .filter(n => n.fact.kind === "diverges" && n.fact.of === of)
    .sort((a, b) => a.pass - b.pass);
  if (diverging.length) return diverging[0];

  const valued = [...s.nodes.values()]
    .filter(n => n.fact.kind === "value" && n.fact.of === of)
    .sort((a, b) => a.pass - b.pass);
  if (valued.length) return valued[0];

  /*
   * AND A THEOREM MAY END IN AN EXPRESSION.
   *
   * `gravity.law` ends at `n·c̄/DEG` and `gravity.metric` at `3u` - sums, not
   * proportionalities and not single numbers. As with the scalings, the answer is the
   * MOST REDUCED one: substitution and the binomial series refine an expression a step at
   * a time, and the finished one is the one with nothing left in it that this proof knows
   * how to expand.
   */
  const said = [...s.nodes.values()]
    .filter(n => n.fact.kind === "equals" && n.fact.of === of);
  if (said.length) {
    const defined = new Set(s.all("equals").map(f => f.of));
    const done = said.filter(n => (n.fact as { to: { m: Record<string, unknown> }[] }).to
      .every(t => Object.keys(t.m).every(b => b === of || !defined.has(b))));
    return (done.length ? done : said).sort((a, b) => b.pass - a.pass)[0];
  }

  const laws = [...s.nodes.values()]
    .filter(n => n.fact.kind === "scales" && n.fact.of === of);
  const reduced = laws.filter(n =>
    Object.keys((n.fact as { by: Scaling }).by).every(b => b === of || !s.known(b)));
  const pick = (reduced.length ? reduced : laws).sort((a, b) => a.pass - b.pass);
  return pick[0];
};

/**
 * EVERY QUANTITY THIS PROOF FINISHED WITH A LAW FOR - what a later theorem may cite.
 *
 * Not only the goal. `gravity.reach` needs what one source puts at one place, which is a
 * line in the MIDDLE of `gravity.falloff` rather than its conclusion; published as only
 * the headline, the citation found nothing and the later theorem reported a missing
 * premise it had every right to expect. A theorem's finished laws are all of it, so all
 * of them are offered.
 */
export const conclusions = (s: Store): Node[] => {
  /* every subject this proof said anything final about - a later theorem may want a
   * value, an expression or a divergence as readily as a scaling */
  const subjects = new Set([
    ...s.all("scales").map(f => f.of),
    ...s.all("value").map(f => f.of),
    ...s.all("equals").map(f => f.of),
  ]);
  const out: Node[] = [];
  for (const q of subjects) {
    const at = conclusion(s, q);
    if (at) out.push(at);
    /*
     * AND THE SYMBOLIC FORM ALONGSIDE THE NUMBER, where a subject has both.
     *
     * `lattice.lean` finishes at 1/12, which is the right answer to its own question and
     * the wrong thing to hand the next theorem: `gravity.full` needs c̄/DEG, because the
     * c̄ in it has to cancel against the c̄ in met's cores and a 1/12 has nothing to cancel
     * with. Cited as the number, the assembled law came out with a stray c̄ in the
     * denominator - arithmetically true and physically wrong. Both forms go out; whatever
     * uses them takes the one it can work with.
     */
    /*
     * THE SYMBOLIC FORM GOES OUT ONLY WHEN IT HAS SOMETHING THAT CAN CANCEL IN IT.
     *
     * The reason to hand a later theorem `c̄/DEG` rather than `1/12` is that the c̄ has to
     * cancel against the c̄ in met's cores. That reason is specific: it is about a
     * CONSTANT appearing on both sides. `share` is also a ratio of two counts, and its
     * symbolic form carries nothing that cancels - published, it put `cases` in the
     * denominator of the assembled force where the number 1/2 belonged.
     */
    const fixed = new Set(s.all("constant").map(c => c.of));
    const said = [...s.nodes.values()].find(n =>
      n.fact.kind === "equals" && n.fact.of === q && n !== at &&
      n.fact.to.some(t => Object.keys(t.m).some(b => fixed.has(b))));
    if (said) out.push(said);
  }
  return out;
};

/**
 * THE ANSWER WITH ITS WORKING FOLDED IN - `share = ∫ ... = 1/2` rather than `share = 1/2`.
 *
 * A conclusion that shows only its final value hides where the value came from, and for
 * the short derivations that is most of what there was to see: `share = 1/2` is a number
 * to take on trust, while `share = (∫ |ψ|/π dψ)/π = 1/2` is the same line with the reason
 * still attached. So the summary chains the DISTINCT statements this proof made about its
 * subject, in the order it made them, joined by the equals signs that were true all along.
 *
 * DISTINCT, and capped. A step that only rearranged something adds nothing to read, and a
 * chain of six is not a summary; what is wanted is the shape it started as and the thing
 * it came to, with anything genuinely different in between.
 */
export const chained = (
  s: Store, of: string, at: Node, set: (t: string) => string = t => t,
): string | undefined => {
  /*
   * THE CONCLUSION IS SHOWN WITH ITS COMMON FACTOR TAKEN BACK OUT.
   *
   * The algebra distributes, so a Newtonian law times one plus a small correction arrives
   * here as two terms. Both forms are the same quantity; the factored one says what the
   * law IS - see `factored` in Expr.ts.
   */
  const shown = (n: Node) => {
    const f = n.fact;
    if (f.kind === "equals" && n.line) {
      const head = /^(.*?)\s=\s/.exec(n.line);
      const better = showFactored(f.to);
      if (head && better !== xshow(f.to)) return set(`${head[1]} = ${better}`);
    }
    return set(n.line ?? "");
  };

  /*
   * EACH LINE IS `subject REL something`, and the relation matters: a definition is an
   * equality and a falloff is a proportionality, so a chain that forced everything into
   * `=` would assert more than was proved. Split on either, keep which it was.
   */
  const parts = (n: Node): { rel: string; rhs: string } | undefined => {
    const m = /^(.*?)\s(=|∝)\s(.+)$/s.exec(shown(n));
    return m ? { rel: m[2], rhs: m[3] } : undefined;
  };

  const mine = [...s.nodes.values()]
    .filter(n => (n.fact as { of?: string }).of === of && n.line)
    .sort((a, b) => a.pass - b.pass);

  const first = mine.map(parts).find(Boolean);
  const last = parts(at);

  /* a conclusion that is not an equation at all - `does not converge` - stands alone */
  if (!last) return shown(at);
  if (!first) return `${set(of)} ${last.rel} ${last.rhs}`;

  /*
   * DEDUPED AFTER THE SYMBOLS ARE APPLIED, not before. Two steps that differed only in
   * which internal name they used come out identical once both are set in the notation
   * the page uses, and printing `lean = c̄/DEG = c̄/DEG = 1/12` is worse than printing
   * either half of it.
   */
  /*
   * AND A LINE THAT ALREADY CHAINS IS NOT CHAINED AGAIN. `dividing` writes its own
   * two-step answer - `lean = c̄/DEG = 1/12` - so prefixing it with the definition it came
   * from repeats the middle: `lean = c̄/DEG = c̄/DEG = 1/12`.
   */
  if (first.rhs === last.rhs || last.rhs.startsWith(first.rhs))
    return `${set(of)} ${last.rel} ${last.rhs}`;

  /*
   * THE INTERMEDIATE FORM IS SHOWN ONLY WHERE IT EARNS ITS PLACE.
   *
   * `lean = c̄/DEG = 1/12` needs both halves: the number alone is something to take on
   * trust and the ratio alone does not say what it comes to on this lattice. A law that
   * ends in an expression does not - `F_g = lean · share · SHEET² · m · m' · met(R) =
   * (the whole thing)` restates the assembly nobody needed restating and pushes the
   * answer off the end of the line. So the chain is kept for a value and dropped for an
   * expression, where the finished form is the whole of what was wanted.
   */
  if (at.fact.kind !== "value") return `${set(of)} ${last.rel} ${last.rhs}`;
  return `${set(of)} ${first.rel} ${first.rhs} ${last.rel} ${last.rhs}`;
};

/** the steps behind a conclusion, premises first, each one after what it rests on */
export const proof = (s: Store, at: Node): Node[] => {
  const out: Node[] = [], seen = new Set<string>();

  /*
   * A NAMED FACTOR BRINGS ITS OWN WORKING WITH IT.
   *
   * `met(R) = X·(1 + Y)` is deliberately not multiplied out, so nothing in its chain
   * mentions what X or Y actually are - and the derivation came out one line long, saying
   * the answer had two parts and never saying what either was. A factor kept whole
   * because its name is the point still has to be derived somewhere, and the place a
   * reader will look for it is here.
   */
  const named = new Set(s.all("named").map(n => n.of));

  const walk = (n: Node) => {
    if (seen.has(n.id)) return;
    seen.add(n.id);
    for (const id of n.from) { const p = s.nodes.get(id); if (p) walk(p); }
    for (const q of mentions(n)) {
      if (!named.has(q)) continue;
      const its = conclusion(s, q);
      if (its) walk(its);
    }
    out.push(n);
  };
  walk(at);
  return out;
};

/** the symbols a step's own statement stands on - where a named factor is spotted */
const mentions = (n: Node): string[] => {
  const f = n.fact;
  if (f.kind === "equals") return f.to.flatMap(t => Object.keys(t.m));
  if (f.kind === "scales") return Object.keys(f.by);
  return [];
};

/**
 * WHY THERE IS NO CONCLUSION — which is the more interesting output of the two.
 *
 * A theory whose vacuum destroys nothing casts no shadow, so its shadow probe comes
 * back with no `positive` and the force is never shown to be anything at all. That must
 * not read as a crash or as a silent zero: the goal names the premises it wanted, and
 * whichever of them never arrived is named back.
 */
export const explain = (s: Store, wanted: Fact[]): string[] =>
  wanted.filter(f => !s.has(f)).map(f => says(f));

export const show = (n: Node, g: Glossary = {}) => n.line ?? says(n.fact, g);
export const sshowScaling = sshow;
