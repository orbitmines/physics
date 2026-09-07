/**
 * WHICH OF THEM IS WORTH READING - the part that is not mechanical, said mechanically.
 *
 * `Harvest.ts` produces a thousand facts a cell and roughly seventy laws nobody asked
 * for, and most of them are worthless: `D = 3` is a premise wearing a conclusion's
 * clothes, `SHEET^{2} = 36` is arithmetic, and half the rest restate a definition in the
 * notation of the line above it. A saturating prover without a taste function is a
 * machine for burying its own good results, so the taste function is the deliverable
 * here and the closure was the easy half.
 *
 * A CANDIDATE MUST BE DERIVED. Not a premise, not a definition, not a citation - those
 * are things somebody put in, and a folder whose whole claim is "ask the rules, never
 * fit" cannot then present its own inputs back as findings. That single filter removes
 * `D = 3`, `spent = β_{v}`, `blocked = A'` and every other leaf in one line.
 *
 * THE SEVEN SCORES, and what each is actually detecting:
 *
 *   DISCRIMINATES  the same subject concludes differently under different theories, on
 *                  one lattice and one regime. This is the only score that names an
 *                  EXPERIMENT: a quantity that G and G^XOR disagree about is a quantity
 *                  whose measurement would kill one of them. Weighted highest for that
 *                  reason and for no other.
 *   NOVELTY        what `Targets.ts` says about it - recovered, contradicted, or unheard
 *                  of. A contradiction inside a target's own stated limit outranks
 *                  everything, because it is either a falsification or a bug and both
 *                  want looking at today.
 *   USEFULNESS     how much else stands on it. Counted as transitive dependents in the
 *                  derivation graph, which is the honest version of "load-bearing": a
 *                  lemma forty conclusions rest on is worth more than a leaf of the same
 *                  depth that nothing uses. This one was the user's, and it is the score
 *                  that most often disagrees with the others.
 *   EXACTNESS      whether anything under it was fitted. A leaf with an error bar makes
 *                  everything above it approximate; a leaf that is an exact count or a
 *                  snapped exponent does not. `Probe.snap` already refuses to snap a
 *                  slope that fails to track D across the ladder, so "exact" here means
 *                  the lattices said it rather than that a fit was rounded.
 *   BRIDGES        how many DIFFERENT probes its leaves come from. One probe means a
 *                  restatement of one measurement; two or more means the conclusion
 *                  connects independent observations, which is the shape every
 *                  interesting result in the handmade folder happens to have.
 *   ROBUST         the same symbolic conclusion on every lattice. The exponents carry D
 *                  symbolically, so a real law reads identically on line-2 and fcc-12 and
 *                  a coincidence of one tiling does not.
 *   ECONOMY        few leaves, and few of those leaves definitions. A conclusion leaning
 *                  on nine assumptions has nine ways to be wrong.
 *
 * THE WEIGHTS ARE A JUDGEMENT AND ARE THEREFORE OUT IN THE OPEN, both here and as sliders
 * on the page. There is no correct weighting of "surprising" against "load-bearing"; what
 * there is, is a weighting somebody can see and disagree with.
 */
import { Fact, key as fkey, says } from "../Fact.ts";
import { Expr, asMonomial } from "../Expr.ts";
import { Node, Store, proof } from "../Kernel.ts";
import { Rat, Scaling, eshow, eval_, rnum, skey } from "../Algebra.ts";
import { Cell, Under, cellKey } from "./Harvest.ts";
import { Reached } from "./Reached.ts";
import { ALIASES, READS, SUBJECTS, TARGETS, TILING, Target } from "./Targets.ts";

/* ------------------------------------------------------------------ shapes */

/**
 * A LAW WITH THIS MODEL'S OWN COUNTS DIVIDED OUT AND ITS SYMBOLS RENAMED - the only form
 * in which a derived law and a textbook law can be the same object.
 *
 * `F_{g} ∝ SHEET^{2}·m_{a}·m_{b}/(DEG·R^{2})` and `F ∝ m·m'/r^{2}` are the same claim
 * about the world and no string comparison will ever say so. Renaming and dividing out the
 * tiling turns the first into the second exactly, and the pile of counts that came out is
 * kept beside it as what G would have to be - which is the whole content of this project
 * stated as a comparison rather than as an assertion.
 */
export const shapeOf = (
  by: Scaling, counts: Record<string, number>,
): { shape: string; bases: string[]; counts: string[]; read: string[] } => {
  const out: string[] = [];
  const bases: string[] = [];
  const tiling: string[] = [];
  const read: string[] = [];
  for (const [b, e] of Object.entries(by)) {
    if (TILING.has(b)) { tiling.push(`${b}^{${eshow(e)}}`); continue; }
    let name = ALIASES[b] ?? normalBase(b);
    if (READS[b]) { name = READS[b].as; read.push(b); }
    if (TILING.has(name)) { tiling.push(`${b}^{${eshow(e)}}`); continue; }
    /*
     * THE EXPONENT IS WORKED OUT AT THIS CELL'S OWN DIMENSION, and without that step
     * nothing ever matches. A derived falloff is `r^{-D+1}` because that is the honest
     * form - it is the same theorem on every lattice - and Newton wrote `r^{-2}`, which is
     * what `-D+1` COMES TO when D is three. Compared as strings those are two different
     * laws for ever; compared at D = 3 they are one law, and on square-4 the same
     * candidate correctly fails to match Newton and matches the line-charge instead.
     */
    let power: number;
    try {
      power = eval_(e, counts);
    } catch {
      /* an exponent standing on a count this cell does not fix cannot be compared at
       * all - better to be unmatched than to guess at what it came to */
      return { shape: `?${skey(by)}`, bases: [], counts: tiling, read };
    }
    bases.push(name);
    out.push(`${name}^${Math.round(power * 1e6) / 1e6}`);
  }
  return { shape: out.sort().join("\u00b7") || "1", bases: bases.sort(), counts: tiling, read };
};

export const subjectOf = (of: string) => SUBJECTS[of] ?? ALIASES[of] ?? of;

/* ------------------------------------------------------- what a target says */

export type Verdict =
  | { kind: "recovers"; target: Target; counts: string[]; read: string[];
      /** true when only the term that dies most slowly was compared - see `asScalingLike` */
      leading?: boolean }
  | { kind: "contradicts"; target: Target; how: string; read: string[]; leading?: boolean }
  | { kind: "unheard-of" };

/**
 * WHAT THE CORPUS MAKES OF A CONCLUSION - and the contradiction test is deliberately
 * narrow.
 *
 * A CONTRADICTION IS A DISAGREEMENT ABOUT THE SAME LAW, not a difference between two
 * laws. `F \u221d m\u00b7m'/r^{3}` contradicts Newton; `F \u221d q\u00b7v\u00b7B` does not, it is a different
 * statement about a different thing that happens to share the letter F. So the test
 * requires the same subject AND the same set of quantities on the right, differing only in
 * the exponents - which is the shape a wrong falloff has and the shape a different law
 * does not.
 *
 * AND IT IS RAISED, NOT DECIDED. The limits are English sentences: "weak field, v much
 * less than c" cannot be intersected with "dense regime, fcc-12" by any code worth
 * trusting, and a machine that silently decided they overlapped would manufacture
 * falsifications out of comparisons that were never valid. So a contradiction carries both
 * limits to the page and asks a person whether they meet.
 */
/**
 * AN EXPRESSION READ AS A PROPORTIONALITY, so that it can be compared with one at all.
 *
 * MOST OF WHAT THIS PROVER FINISHES WITH IS AN `equals`, not a `scales` - `F_{vac} =
 * A'\u00b7A_{\u22a5}/(R^{D-1}\u00b7STEP)` is an expression with a coefficient in it, and Newton's law is
 * a proportionality with every constant deliberately thrown away. Compared as different
 * kinds of object they never meet, and the first version of this file reported that it had
 * recovered nothing while the assembled gravitational law sat in the store.
 *
 * A SUM IS READ AT ITS LEADING TERM, AND THE PAGE IS TOLD. `F_{meet} = X/R^{D} +
 * Y/R^{D-1}` is not one power of R and cannot be; what it IS, far away, is the second
 * term, because that is the one that dies more slowly. That is a real and standard
 * reading - it is what "goes as" means about a series - but it is a reading, so a verdict
 * that needed it is marked as holding to leading order rather than exactly.
 */
const asScalingLike = (
  f: Fact,
): { by: Scaling; leading: boolean } | undefined => {
  if (f.kind === "scales") return { by: f.by, leading: false };
  if (f.kind !== "equals" || !f.to.length) return undefined;
  const one = asMonomial(f.to as Expr);
  if (one) return { by: one, leading: false };

  /* the term that dies most slowly in r is the one a far-field law is about */
  const rBase = (m: Scaling) => Object.entries(m)
    .find(([b]) => (ALIASES[b] ?? b) === "r")?.[1];
  let best: { m: Scaling; power: number } | undefined;
  for (const t of f.to) {
    const e = rBase(t.m);
    if (!e) continue;
    let power: number;
    try { power = eval_(e, { D: 3, DEG: 12 }); } catch { continue; }
    if (!best || power > best.power) best = { m: t.m, power };
  }
  return best ? { by: best.m, leading: true } : undefined;
};

/**
 * THE SAME POWER UNDER TWO SPELLINGS - `(1-\u03b2^{2})` here, `(1-b^{2})` in the corpus.
 *
 * A `raised` fact keeps its base as a STRING, because a rational power of a sum is not a
 * sum and the algebra deliberately refuses to open it. That makes the comparison a string
 * comparison, and a string comparison fails on notation: the Lorentz factor was derived
 * exactly and reported as unheard-of, purely because this repository writes the speed as
 * a Greek beta and the corpus writes it as a b.
 */
const INSIDE: Record<string, string> = {
  "\u03b2": "b", "\u03b3": "gamma", "\u03c1": "rho", "\\bar{c}": "c",
};

const normalBase = (b: string) => {
  let out = b;
  /*
   * ONLY THE UNMISTAKABLE ONES, and never the single letters. `ALIASES` maps `d` and `s`
   * to `r` because a theorem writes a distance either way, and those are exact-key
   * lookups where that is harmless. Run as substring replacements over a composite base
   * they are a disaster: every `d` inside every name becomes an `r`, and
   * `(1-\u03b2^{2})` would survive while `den(F_{g})` quietly turned into something else.
   */
  for (const [from, to] of Object.entries(INSIDE)) out = out.split(from).join(to);
  return out;
};

export const judge = (f: Fact, counts: Record<string, number>): Verdict => {
  const like = asScalingLike(f);
  if (like) {
    const me = shapeOf(like.by, counts);
    const subject = subjectOf(f.of);
    /*
     * A TARGET WRITTEN AS AN EXACT POWER IS COMPARABLE WITH A MONOMIAL, and has to be.
     * The Lorentz factor is in the corpus as `raised` - a rational power of a named sum,
     * which is the one shape this algebra deliberately refuses to expand - and it comes
     * out of the prover as a monomial in that same sum. Two spellings of one object;
     * compared only within their own kind they never met, and an exactly derived gamma
     * was being reported as unheard-of.
     */
    const alike = TARGETS.filter(t =>
      (t.fact.kind === "scales" || t.fact.kind === "raised") &&
      subjectOf(t.fact.of) === subject);
    const asScaling = (t: Target): Scaling => t.fact.kind === "scales" ? t.fact.by
      : { [normalBase((t.fact as { base: string }).base)]:
          { k: (t.fact as { to: Rat }).to, of: {} } };
    for (const t of alike) {
      const theirs = shapeOf(asScaling(t), counts);
      if (theirs.shape === me.shape && me.shape !== "1")
        return { kind: "recovers", target: t, counts: me.counts, read: me.read,
          leading: like.leading };
    }
    for (const t of alike) {
      const theirs = shapeOf(asScaling(t), counts);
      if (!me.bases.length || me.bases.join(",") !== theirs.bases.join(",")) continue;
      return { kind: "contradicts", target: t, read: me.read, leading: like.leading,
        how: `the same quantities, to different powers - this run has ${me.shape} ` +
          `where ${t.law} has ${theirs.shape}` };
    }
  }
  if (f.kind === "value") {
    const subject = subjectOf(f.of);
    for (const t of TARGETS) {
      if (t.fact.kind !== "value" || subjectOf(t.fact.of) !== subject) continue;
      return rnum(t.fact.equals) === rnum(f.equals)
        ? { kind: "recovers", target: t, counts: [], read: [] }
        : { kind: "contradicts", target: t, read: [],
            how: `${rnum(f.equals)} here against ${rnum(t.fact.equals)}` };
    }
  }
  if (f.kind === "raised") {
    for (const t of TARGETS) {
      if (t.fact.kind !== "raised") continue;
      if (subjectOf(t.fact.of) !== subjectOf(f.of)) continue;
      const same = normalBase(t.fact.base) === normalBase(f.base) &&
        rnum(t.fact.to) === rnum(f.to);
      return same
        ? { kind: "recovers", target: t, counts: [], read: [] }
        : { kind: "contradicts", target: t, read: [],
            how: `${f.base}^${eshow({ k: f.to, of: {} })} here against the standard form` };
    }
  }
  return { kind: "unheard-of" };
};

/* --------------------------------------------------------- the graph facts */

/** everything a conclusion rests on that nothing here derived - its leaves */
const leavesOf = (s: Store, at: Node): Node[] =>
  proof(s, at).filter(n => n.premise);

/** how many facts in this cell stand on it, at any remove - the usefulness count */
const dependents = (s: Store): Map<string, number> => {
  const down = new Map<string, Set<string>>();
  for (const n of s.nodes.values())
    for (const id of n.from) {
      if (!down.has(id)) down.set(id, new Set());
      down.get(id)!.add(n.id);
    }
  const out = new Map<string, number>();
  for (const id of s.nodes.keys()) {
    const seen = new Set<string>(), stack = [...(down.get(id) ?? [])];
    while (stack.length) {
      const x = stack.pop()!;
      if (seen.has(x)) continue;
      seen.add(x);
      for (const y of down.get(x) ?? []) stack.push(y);
    }
    out.set(id, seen.size);
  }
  return out;
};

/* ------------------------------------------------------------- candidates */

export type Where = { under: Under; line: string; factKey: string };

export type Scores = {
  discriminates: number;
  novelty: number;
  usefulness: number;
  exactness: number;
  bridges: number;
  robust: number;
  economy: number;
  total: number;
};

export type Candidate = {
  id: string;
  /** the quantity it is a law about, in this repository's own name for it */
  subject: string;
  /** the same, as a physicist would name it, where the corpus knows the name */
  called: string;
  /** the conclusion, as one line, from the cell that scored it */
  line: string;
  says: string;
  verdict: Verdict;
  /** the distinct conclusions this subject reached, and where each held */
  forms: { factKey: string; line: string; where: Under[] }[];
  /** the theories that disagreed about it, on a fixed lattice and regime */
  splits: { geometry: string; regime?: string; by: Record<string, string> }[];
  scores: Scores;
  /** the probes its leaves came from, and how much was assumed rather than measured */
  from: { probes: string[]; definitions: string[]; cited: string[] };
  depth: number;
  leaves: number;
  /** the derivation, premises first - what a reader checks with a pencil */
  steps: { line: string; because: string; via: string; premise: boolean }[];
  /**
   * TRUE WHEN IT ADDS NOTHING TO WHAT WAS ALREADY THERE - arithmetic over the tiling's own
   * counts, or a rule restating a probe's own measurement in another notation. Hidden by
   * default rather than dropped, because a candidate nobody can see is a candidate nobody
   * can check.
   */
  arithmetic: boolean;
  /** whether every leaf under it is a run - see `Grade` */
  grade: Grade;
  /** the definitions it is still waiting on, if it is not yet derived */
  waiting: { fact: string; because: string; from: string }[];
  /** true where a probe measured this same statement and the rules reached it too */
  agrees?: boolean;
  /** the identifications its match would rest on, and whether a run has established them */
  leaning: { symbol: string; as: string; status: string; evidence?: string }[];
  /** whether a handmade theorem already asks this question */
  asked?: string;
};

/**
 * HOW MUCH OF IT IS A RUN - the gate, and the only classification on this page that is
 * not a matter of degree.
 *
 *   DERIVED     every leaf of the proof is a premise a probe stood behind, with numbers
 *               under it. Nothing was assumed, nothing was read as anything, and the
 *               statement is a consequence of what the discrete model DID.
 *   PROBED      the statement IS a probe's conclusion, with no inference step above it.
 *               That is not a lesser thing than derived - a probe reasons from the rules
 *               and its argument is written out in the step - but it is a DIFFERENT
 *               thing, because the reasoning lives in the probe's prose rather than in
 *               the rule engine where it could be checked mechanically. Worth seeing,
 *               and worth seeing as its own category.
 *   CONJECTURED somewhere underneath is a definition: a line that is true because of what
 *               a word was chosen to mean. The conclusion may well be right and is worth
 *               having, but it is not yet a result about a world, and it is exactly as
 *               strong as the definition it stands on.
 *   ASSUMED     no probe anywhere underneath. It follows entirely from the vocabulary.
 *
 * ONLY A DERIVED CANDIDATE MAY CLAIM TO RECOVER ANYTHING. This is the whole point of the
 * distinction and it is enforced rather than displayed: `F_{vac}` matches Newton's law
 * exactly, on four definitions and no runs, and a page that printed "recovers Newton's law
 * of gravitation" beside it would be reporting that the model had derived gravity when
 * what it had done was define it. A conjectured candidate keeps its match and the match is
 * phrased as what it WOULD be - and the definitions it is waiting on are listed as
 * experiments to go and do.
 */
export type Grade = "derived" | "probed" | "conjectured" | "assumed";

export type Weights = Record<keyof Omit<Scores, "total">, number>;

/**
 * WHAT COUNTS FOR HOW MUCH - a judgement, in one place, where it can be argued with.
 *
 * Discrimination leads because it is the only score that names an experiment. Novelty
 * follows it because the corpus is what stops this being a machine for rediscovering
 * Newton. Usefulness is third and is the one that most often disagrees with the other two:
 * a boring lemma everything rests on scores high here and nowhere else, which is exactly
 * the case worth being reminded of.
 */
export const WEIGHTS: Weights = {
  discriminates: 0.26,
  novelty: 0.22,
  usefulness: 0.16,
  exactness: 0.13,
  bridges: 0.13,
  robust: 0.06,
  economy: 0.04,
};

const clamp = (x: number) => Math.max(0, Math.min(1, x));

export const rank = (cells: Cell[], weights: Weights = WEIGHTS): Candidate[] => {
  const useful = new Map<string, Map<string, number>>();
  for (const c of cells) useful.set(cellKey(c.under), dependents(c.store));

  /* every DERIVED conclusion, by subject - a premise is not a finding, see the header */
  type Seen = { cell: Cell; node: Node; it: Reached };
  const bySubject = new Map<string, Seen[]>();
  for (const c of cells)
    for (const it of c.concluded) {
      /*
       * A PROBE'S OWN CONCLUSION IS A FINDING, and dropping it was wrong twice over.
       *
       * THE ORIGINAL REASONING HAS EXPIRED. When a probe MEASURED something - fitted a
       * slope, profiled a ledger - its output really was an input to this folder rather
       * than a result of it, and showing it beside derived laws would have flattered it.
       * That is no longer what a probe is. A probe here isolates a rule and counts
       * integers, or enumerates every state a rule can be handed, or reads a rule's own
       * shape off the theory. `expanding` counts the points between two markers and
       * concludes that recession goes as separation - Hubble's law, argued from what
       * CREATION does - and there is no sense in which that is an input.
       *
       * AND THE FILTER WAS ARBITRARY BESIDES. Whether a probe's conclusion survived
       * depended on whether some rule happened to restate it in another notation:
       * `net polarity` appeared because `a number is an expression` rewrote it, and
       * `recession` vanished because nothing did. Two results of exactly the same kind,
       * one findable and one not, for a reason having nothing to do with either.
       *
       * SO THEY ARE KEPT AND GRADED, not dropped. What still gets dropped is a leaf that
       * nothing ran for: a definition is somebody's sentence, and a citation is a pointer
       * to a result established elsewhere.
       */
      const via = it.at.via;
      if (it.at.premise &&
        (via.startsWith("definition:") || via.startsWith("cited:"))) continue;
      const list = bySubject.get(it.subject) ?? [];
      list.push({ cell: c, node: it.at, it });
      bySubject.set(it.subject, list);
    }

  const maxUse = Math.max(1, ...[...useful.values()]
    .flatMap(m => [...m.values()]));

  const out: Candidate[] = [];
  for (const [subject, seen] of bySubject) {
    /* the distinct conclusions, and where each one held */
    const forms = new Map<string, { line: string; where: Under[] }>();
    for (const { cell, node } of seen) {
      const k = node.id;
      const f = forms.get(k) ?? { line: node.line ?? says(node.fact), where: [] };
      f.where.push(cell.under);
      forms.set(k, f);
    }

    /*
     * WHERE THE THEORIES DISAGREE - held at one lattice and one regime, because a
     * difference across lattices is a difference in D and says nothing about the theories.
     */
    const splits: Candidate["splits"] = [];
    const slices = new Map<string, Map<string, string>>();
    for (const { cell, node } of seen) {
      const slice = `${cell.under.geometry}|${cell.under.regime ?? ""}`;
      const m = slices.get(slice) ?? new Map();
      m.set(cell.under.theory, node.line ?? says(node.fact));
      slices.set(slice, m);
    }
    let disagreed = 0;
    for (const [slice, m] of slices) {
      if (new Set(m.values()).size < 2) continue;
      disagreed++;
      const [geometry, regime] = slice.split("|");
      splits.push({ geometry, regime: regime || undefined,
        by: Object.fromEntries(m) });
    }

    /* scored on the cell where it is most developed - the deepest derivation of it */
    const best = seen.reduce((a, b) => (b.node.pass > a.node.pass ? b : a));
    const store = best.cell.store, at = best.node;
    const leaves = leavesOf(store, at);
    const probes = [...new Set(leaves.map(l => l.via)
      .filter(v => !v.startsWith("definition:") && !v.startsWith("cited:")))];
    const definitions = [...new Set(leaves.map(l => l.via)
      .filter(v => v.startsWith("definition:")).map(v => v.slice("definition:".length)))];
    const cited = [...new Set(leaves.map(l => l.via)
      .filter(v => v.startsWith("cited:")).map(v => v.slice("cited:".length)))];

    const counts = { D: best.cell.under.D, DEG: best.cell.under.DEG };

    /*
     * THE GATE. A definition anywhere underneath means the statement is standing on
     * something somebody wrote down rather than on something a run did - see `Grade`.
     */
    const grade: Grade = at.premise
      ? (at.via.startsWith("definition:") || at.via.startsWith("cited:")
        ? "assumed" : "probed")
      : !probes.length ? "assumed"
      : definitions.length ? "conjectured" : "derived";
    const waiting = leaves
      .filter(l => l.via.startsWith("definition:"))
      .map(l => ({ fact: l.line ?? says(l.fact), because: l.because,
        from: l.via.slice("definition:".length) }));

    /*
     * THE MATCH IS STILL COMPUTED FOR A CONJECTURED CANDIDATE, because knowing that a
     * definitional assembly WOULD be Newton's law once its definitions are discharged is
     * how you know which experiment is worth doing. It is the claim that is gated, not
     * the comparison.
     */
    const verdict = judge(at.fact, counts);

    /*
     * AND A MATCH THAT NEEDED A READING NOBODY HAS ESTABLISHED IS NOT A MATCH.
     *
     * The gate above already stops a conjectured candidate from claiming anything, and
     * this is the second lock on the same door: even a fully probed conclusion may only
     * be compared with the corpus in symbols whose identification has itself been
     * measured. Every reading in the table is currently refuted or untested, so nothing
     * may lean on one - which is the correct state of affairs and not a bug to route
     * around.
     */
    const leaning = verdict.kind === "unheard-of" ? [] : verdict.read;
    const unestablished = leaning.filter(r => READS[r]?.status !== "measured");

    /*
     * ARITHMETIC IS NOT A FINDING. `SHEET^{2} = 36` is a true statement the rules
     * derived, and it is the product of two counts of the tiling and nothing else -
     * there is no world in which it could have come out otherwise, so it belongs in the
     * working rather than in a list of things to judge. Marked rather than dropped: a
     * reader can turn it back on, and a candidate silently deleted is a candidate nobody
     * can check.
     */
    /*
     * A RESTATEMENT IS NOT A DERIVATION. `cases = 1` arrives as a probe's own integer and
     * a rule then writes it out as an expression, which is a change of TYPE and not a step
     * of reasoning - the store now holds two nodes, the second of them technically derived,
     * and it went straight to the top of the page because it is exact, cheap and different
     * under every theory. All three are true of the measurement it is restating.
     *
     * So: one leaf, that leaf a probe's premise, and about the same subject. That is a
     * format conversion however the rules dress it up.
     */
    /*
     * A RESTATEMENT IS A DERIVED NODE THAT ADDS NOTHING TO A PREMISE - not a premise
     * itself. A probed conclusion IS its own single leaf, so the test below calls it a
     * restatement of itself and hides it, which is exactly the result that was being
     * lost. The node has to be derived for restating to mean anything.
     */
    const restatement = !at.premise && leaves.length === 1 && leaves[0].premise &&
      (leaves[0].fact as { of?: string }).of === subject;

    const of = (at.fact as { by?: Scaling; to?: { m: Scaling }[] });
    const mentioned = of.by ? Object.keys(of.by)
      : of.to ? of.to.flatMap(t => Object.keys(t.m)) : [];
    const arithmetic = mentioned.length > 0 && mentioned.every(b => TILING.has(b));

    /*
     * EXACT MEANS NOTHING UNDER IT WAS FITTED. A measured number with an error bar makes
     * every line above it approximate, however tidy the algebra was; an exact count and a
     * snapped exponent do not.
     */
    const fitted = leaves.filter(l =>
      (l.measured ?? []).some(m => m.err !== undefined && m.err > 0)).length;

    const use = (useful.get(cellKey(best.cell.under))?.get(at.id) ?? 0);

    const geometries = new Set(seen.map(x => x.cell.under.geometry));
    const perTheory = new Map<string, Set<string>>();
    for (const { cell, node } of seen) {
      const set = perTheory.get(cell.under.theory) ?? new Set();
      set.add(node.id);
      perTheory.set(cell.under.theory, set);
    }
    const steady = [...perTheory.values()].every(s2 => s2.size === 1);

    const scores: Scores = {
      discriminates: slices.size ? clamp(disagreed / slices.size) : 0,
      /*
       * ARITHMETIC OVER THE TILING'S OWN COUNTS IS NEVER NOVEL, whatever the corpus says
       * about it - it could not have come out otherwise.
       */
      /*
       * AND A CONJECTURED CANDIDATE SCORES NOTHING FOR ITS MATCH, in either direction. It
       * cannot claim the recovery, so it must not be paid for it - and it emphatically
       * cannot raise a falsification, because contradicting a known law on the strength of
       * a definition is a statement about the definition.
       */
      /* a probed statement may carry its match: it stands on a run of the rules, which
       * is what the gate is about - it is the DEFINITIONS that disqualify a claim */
      novelty: arithmetic || restatement || unestablished.length
        || (grade !== "derived" && grade !== "probed") ? 0
        : verdict.kind === "contradicts" ? 1
        : verdict.kind === "unheard-of" ? 0.6 : 0.15,
      usefulness: clamp(Math.log1p(use) / Math.log1p(maxUse)),
      exactness: leaves.length ? clamp(1 - fitted / leaves.length) : 0,
      bridges: clamp((probes.length - 1) / 2),
      robust: geometries.size > 1 && steady ? 1 : geometries.size > 1 ? 0.2 : 0.5,
      /*
       * AND A CONCLUSION WITH NO RUN ANYWHERE UNDER IT IS THE WEAKEST KIND THERE IS.
       * Every leaf a definition means the whole thing is a consequence of what somebody
       * chose the words to mean - true, possibly useful, and not a result about a world.
       */
      economy: probes.length
        ? clamp(1 - (leaves.length + definitions.length * 2) / 16)
        : 0,
      total: 0,
    };
    scores.total = (Object.keys(weights) as (keyof Weights)[])
      .reduce((a, k) => a + weights[k] * scores[k], 0);

    out.push({
      id: `${subject}`,
      subject,
      called: subjectOf(subject),
      line: at.line ?? says(at.fact),
      says: at.because,
      verdict,
      forms: [...forms.entries()].map(([factKey, f]) => ({ factKey, ...f })),
      splits,
      scores,
      from: { probes, definitions, cited },
      arithmetic: arithmetic || restatement, grade, waiting,
      agrees: best.it.agrees,
      /* the readings it would need, and what a run has said about each */
      leaning: leaning.map(r => ({ symbol: r, as: READS[r]?.as ?? "",
        status: READS[r]?.status ?? "untested", evidence: READS[r]?.evidence })),
      depth: at.pass,
      leaves: leaves.length,
      steps: proof(store, at).map(n => ({
        line: n.line ?? says(n.fact), because: n.because, via: n.via, premise: n.premise,
      })),
    });
  }

  return out.sort((a, b) => b.scores.total - a.scores.total);
};
