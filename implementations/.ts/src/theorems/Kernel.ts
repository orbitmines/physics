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
  const laws = [...s.nodes.values()]
    .filter(n => n.fact.kind === "scales" && n.fact.of === of);
  const reduced = laws.filter(n =>
    Object.keys((n.fact as { by: Scaling }).by).every(b => b === of || !s.known(b)));
  const pick = (reduced.length ? reduced : laws).sort((a, b) => a.pass - b.pass);
  return pick[0];
};

/** the steps behind a conclusion, premises first, each one after what it rests on */
export const proof = (s: Store, at: Node): Node[] => {
  const out: Node[] = [], seen = new Set<string>();
  const walk = (n: Node) => {
    if (seen.has(n.id)) return;
    seen.add(n.id);
    for (const id of n.from) { const p = s.nodes.get(id); if (p) walk(p); }
    out.push(n);
  };
  walk(at);
  return out;
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
