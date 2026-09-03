/**
 * WHAT THE PROOF LEAVES BEHIND - a record under `theorems/`, one folder per run.
 *
 * KEYED BY WHAT WAS ACTUALLY RUN, because a theorem here is not a theorem about
 * mathematics in the abstract - it is a theorem about a theory on a lattice, and both
 * belong in the name. `lattice.shell-growth.G.fcc-12` and `.G.square-4` are DIFFERENT
 * RESULTS and the second is not a worse version of the first. Writing them to one path
 * would make the second silently replace the first, which is the bug that makes a
 * general prover look like a special one.
 *
 * NOTHING EMITTED IS FRAMEWORK-SPECIFIC. An earlier version wrote React components, which
 * made the proofs usable by exactly one website. A derivation is a document, not a
 * component: what is written now is the parsed notation as DATA - `Piece[]`, the same
 * tree `rendering/Notation.ts` produces - so a project renders it with whatever it
 * already has, and a standalone HTML page that needs no build at all is generated beside
 * it for the reader who just wants to look.
 *
 * FOUR FILES:
 *
 *   proof.json      the record - every premise, step and number, enough to rebuild
 *                   the page without rerunning anything, and what a test asserts against
 *   derivation.ts   the same, with the notation parsed into `Piece[]`, for a project
 *                   that wants to set the equations in its own components
 *   index.html      standalone, self-contained, with the working behind each line
 *                   opening in a panel - the `visuals/` convention
 *   README.md       the answer in one line, then what the runs found
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { Expr, show as showE } from "../src/lib/Algebra.ts";
import { Equation, Term } from "../src/lib/Continuum.ts";
import { Declared } from "../src/lib/Rules.ts";
import { annotate, fromRule, key, Node, Proven, says, standingFor } from "../src/lib/Prove.ts";
import { gatesIn, sourceOf } from "./SOURCE.ts";
import { README } from "./README.ts";
import { check, html, parse, Piece } from "../src/rendering/Notation.ts";
import { REFERENCES } from "../src/rendering/references.ts";

/**
 * WHAT ONE THEOREM IS HERE — a question, and the part of the one closure that answers it.
 *
 * THERE IS ONE PROOF AND THESE ARE READINGS OF IT. The research repository proves each theorem
 * from its own probes, so a theorem is a run; here the rules are closed ONCE and a theorem is a
 * conclusion of that closure with the steps it actually rests on. Splitting them is for a
 * reader, and `behind` is what does the splitting.
 */
export type Asked = {
  id: string;
  asks: string;
  /** the fact this theorem is about, as `Prove` names it - empty for the line itself */
  about: string;
  /**
   * AND A SECOND WRITING OF THE SAME LAW, where there is one worth showing.
   *
   * `g = g_{N}\paren{1 + a_{0}/g}` and `g = 2a_{0}/\paren{\sqrt{1 + 4a_{0}/g_{N}} - 1}` are
   * the same statement and neither one replaces the other. The first says WHY - the mismatch
   * is measured against the acceleration it produces, which is what puts `g` on both sides.
   * The second says WHAT, with nothing on the right that is not known. A page that showed one
   * would be hiding either the mechanism or the answer, so it shows both and says which is
   * which.
   */
  also?: string;
  /** what to say above the leading form, and above the one beneath it */
  leads?: string;
  then?: string;
  /**
   * AND A SECOND EQUALS ON THE SAME LINE, where one form IS the other worked out.
   *
   * `\bar{m} = \lim_{R \to \infty} \frac{\bar{m}\paren{R}}{l.shell(R)}` is the statement
   * and `= \frac{\bar{m}_{x}DEG\paren{1-\rho}}{\sigma\omega\rho}` is what it comes to.
   * Those are one sentence with two verbs in it, not two claims, so they belong on one line -
   * which is how a limit is written everywhere else. `also` is for the OTHER case, where two
   * forms say the same thing differently and neither is the working of the other.
   */
  chain?: string;
  /** the model the rules came to, which every page shows */
  equation: Equation;
  /** and the whole closure, so the steps can be walked back from the conclusion */
  proof: Proven;
  /** or, for a theorem about the line itself, how the line was reached - see `lineSteps` */
  line: Node[];
};

/** a glossary here is what a quantity is called - the model names them, so it is thin */
export type Glossary = Record<string, { symbol: string; says: string }>;

/**
 * THE LINE THIS RUN ASSEMBLED, so a step can be shown against the term it produced.
 *
 * Set once by `THEOREMS.ts` before anything is written. A module-level handle is the wrong shape
 * for a library and the right one for a tool that renders exactly one model per run.
 */
let EQUATION: Equation;
let G_RULES: Record<string, unknown> = {};
export const rendering = (eq: Equation, rules: Record<string, unknown>) => {
  EQUATION = eq; G_RULES = rules;
};

/** where the record goes: the repository's own top level, beside `visuals/` */
export const ROOT = new URL("../../../theorems/", import.meta.url).pathname;
const RENDERING = new URL("../src/rendering/", import.meta.url).pathname;

/**
 * ONE FOLDER PER THEOREM, and everything else is a switch inside it.
 *
 * THE THEORY IS THE TOP OF THE PAGE, not the top of the tree. `vacuum.occupancy` is one
 * question, and the interesting thing about it is that G answers 0, G^XOR answers 1/2 and
 * they do so through the same derivation with a different rule underneath - which is
 * invisible if the two live in different folders and a reader has to open both and hold
 * them side by side. Put on the title as a dropdown, the comparison is one click and the
 * shared shape of the argument is obvious.
 *
 * BELOW THAT the lattice is a configuration, and below that a genuinely different result
 * gets its own arrows. Three levels, in order of how much they change the answer: the
 * theory changes which rules ran, the lattice changes the numbers, and a different result
 * is a different conclusion.
 */
export const folder = (q: Asked) => q.id;

/** what a variant is called on its switch - the settings that were varied */
export const configName = (r: { under: { geometry: string } }) => r.under.geometry;

const num = (v: number, err?: number) =>
  `${Number.isInteger(v) ? v : v.toFixed(4)}${err !== undefined && err > 0 ? ` +/- ${err.toFixed(4)}` : ""}`;

/**
 * EVERY LINE IS CHECKED BEFORE IT IS WRITTEN.
 *
 * The rule about combining characters and em dashes is worth nothing unless something
 * enforces it, and the place a stray macron gets in is a string literal in a rule that
 * nobody reads again. A violation stops the build here rather than reaching a phone.
 */
const line = (s: string, where: string) => check(s, where);

/**
 * QUANTITY NAMES REPLACED BY THE SYMBOLS THEY ARE SET AS.
 *
 * A quantity needs a name a reader of the SOURCE can follow - `what is at s`, `opposed,
 * summed across the range` - and a symbol a reader of the PAGE can scan. Those are
 * different jobs and the names are chosen for the first, so a line that reached the page
 * with its internal names still in it read like a variable dump: `ε = ∫ what is at s ds`.
 * The glossary already says what each is set as; this applies it.
 *
 * LONGEST FIRST, so a name that contains another is replaced whole rather than having its
 * middle eaten - and only on a boundary, so a one-letter name cannot match inside a word.
 */
const symbols = (text: string, g: Glossary): string => {
  const names = Object.keys(g).sort((a, b) => b.length - a.length);
  let out = text;
  for (const n of names) {
    const sym = g[n]?.symbol;
    if (!sym || sym === n) continue;
    out = out.split(n).join("\u0000");           // mark, so later names cannot re-enter
    out = out.split("\u0000").join(sym);
  }
  return out;
};

/**
 * THE STEPS A CONCLUSION ACTUALLY RESTS ON, leaves first — which is what makes one closure
 * into several proofs.
 *
 * Walked back from the fact a theorem is about, through what each step was derived FROM, so a
 * page carries its own chain and not the whole store. A theorem about the line itself has no
 * one fact to walk back from and takes everything.
 */
const behind = (p: Proven, about: string): Node[] => {
  const out: Node[] = [], seen = new Set<string>();
  const walk = (k: string) => {
    if (seen.has(k)) return;
    const n = p.store.nodes.get(k);
    if (!n) return;
    seen.add(k);
    for (const f of n.from) walk(f);
    out.push(n);
  };
  if (!about) return [...p.store.nodes.values()];
  for (const [k, n] of p.store.nodes) if ((n.fact as { of?: string }).of === about) walk(k);
  return out;
};

/** ` = <what the leading form works out to>`, where a theorem names one */
const chained = (q: Asked): string => {
  if (!q.chain) return "";
  const walk = behind(q.proof, q.chain);
  const at = walk[walk.length - 1];
  if (!at || at.fact.kind !== "is") return "";
  return ` = ${showE((at.fact as { to: Expr }).to)}`;
};

export const record = (q: Asked) => {
  /*
   * A THEOREM ABOUT THE LINE IS PROVED BY ITS TERMS, and one about a consequence by the steps
   * that reached it. Showing the whole closure for the first was showing what FOLLOWS from the
   * line where its own derivation belonged.
   */
  const steps = q.about ? behind(q.proof, q.about) : q.line;
  const end = q.about ? steps[steps.length - 1] : undefined;
  return {
    theorem: q.id,
    asks: q.asks,
    about: q.about,
    under: {
      theory: q.equation.theory,
      /*
       * NO LATTICE, NO BOX, NO SEED AND NO TICKS.
       *
       * The research repository varies those because its premises are MEASURED and a
       * measurement is about the world it was taken in. These premises are read off the rules,
       * so there is nothing to vary: what is derived is what the rules say, and it says it on
       * every lattice at once. `D` stays a symbol for exactly that reason.
       */
      geometry: "any", D: null, DEG: null, N: null, T: null, seeds: [],
      regime: null, regimeSays: null,
    },
    concluded: q.about
      ? (end ? line(says(end.fact) + chained(q), q.id) : null)
      : line(`${q.equation}`, q.id),
    /* the same law written the other way, where the theorem names one */
    leads: q.leads ?? null,
    then: q.then ?? null,
    also: (() => {
      if (!q.also) return null;
      const walk = behind(q.proof, q.also);
      const at = walk[walk.length - 1];
      return at ? line(says(at.fact), q.id) : null;
    })(),
    /*
     * AND WHICH PART OF THE ANSWER IS WHICH, where the answer is several answers multiplied.
     *
     * A law with two channels and four factors reads as one line, and a reader cannot see the
     * joins. Each piece is matched against what the store settled - so the naming is found
     * rather than written, and a piece the proof did not settle goes unnamed.
     */
    parts: end && end.fact.kind === "is"
      ? annotate((end.fact as { to: any }).to, q.proof.store, "R", q.about) : [],
    /*
     * AND WHAT EVERY NAME IN THE LINE STANDS FOR — opened once each, under it.
     *
     * A LINE THAT CITES ITS PARTS IS UNREADABLE UNTIL THE PARTS ARE GIVEN, and a line with the
     * parts written into it is unreadable the other way. `F_{g}` mentions the arrivals three
     * times, so substituting printed the same two-channel expression three times over and
     * buried the shape of the root - which is the whole content of that line - inside it. The
     * two galaxy theorems came out as four hundred characters differing in one factor a third
     * of the way along.
     *
     * SO NEITHER. The line keeps its names and every name is opened beneath it exactly once,
     * which is how the substitution would be written by hand and the only arrangement whose
     * length grows with the number of DISTINCT parts rather than with how often each is used.
     */
    standing_for: end && end.fact.kind === "is"
      ? standingFor((end.fact as { to: any }).to, q.proof.store, q.about) : [],
    /*
     * AND THE OTHER LEDGER, WHERE A THEOREM IS ABOUT THE LINE ITSELF.
     *
     * The model has two things - the population and the space - and every rule does something
     * to each. One line cannot say both, so both are shown: rays above, space below, read off
     * the same rule bodies in the same pass.
     */
    space: q.about ? null : line(q.equation.space(), q.id),
    standing: q.about ? !!end : true,
    missing: q.about && !end ? q.proof.missing : [],
    cites: [] as { key: string; short: string }[],
    /*
     * AND WHERE A PROBE'S FINDINGS WOULD BE, THE RULES' OWN TERMS.
     *
     * A page has to say where its premises came from, and there is no run behind these: each is
     * read off a rewrite of `G.ts`. So what stands in that place is the line's terms, with the
     * rule each came out of and what its body did to the two ledgers - which is the same
     * question a probe's `found` answers, asked of the program instead of a world.
     */
    terms: q.equation.terms.map((t: Term) => ({
      symbol: t.symbol, sign: t.sign, degree: t.degree, facing: t.facing,
      rays: t.rays, space: t.space, rules: t.rules, says: t.says,
    })),
    probes: [] as never[],
    steps: steps.map(n => step(n)),
    glossary: {} as Glossary,
  };
};

const step = (n: Node) => ({
  id: key(n.fact),
  /*
   * A LEAF HERE IS NEITHER A MEASUREMENT NOR A DEFINITION — it is READ OFF THE RULES.
   *
   * The research repository has three kinds of leaf and each is a different claim about where a
   * premise came from: a probe ran, a word was defined, an earlier theorem established it. Here
   * there is one, and it is the strongest of the three: the premise is already in the program,
   * so a rule edited in `G.ts` moves it. `rule` is what the page calls it.
   */
  /*
   * ONLY A REWRITE OF THE MODEL IS A RULE. Everything else here is a THEOREM - a step reached
   * by an inference of the prover, whether or not anything stands behind it in this store. The
   * distinction is what a reader needs: a rule is the program, a theorem is what follows.
   */
  kind: /^[A-Z][A-Z_.\/ +]*$/.test(n.via) ? "rule" : "theorem",
  via: n.via,
  line: says(n.fact),
  working: n.working,
  because: n.because,
  from: n.from,
  measured: [] as never[],
  /*
   * AND THE REWRITE ITSELF, where this leaf was read off one. `via` on a leaf is the rule's
   * name, so the text is a lookup - and a step derived from other steps has no rule of its own
   * and gets none.
   */
  ...ruleText(n.rule ?? n.via),
  /* and the proof of this step itself, which ends at it - see `Node.derivation` */
  derivation: n.derivation?.map(x => step({ ...x, pass: 0 })),
});

/**
 * THE REWRITE A LEAF NAMES, where it names one — and nothing where it does not.
 *
 * A LEAF'S `via` SAYS WHERE IT CAME FROM and sometimes that is a rewrite: `CREATION`,
 * `MOVEMENT`. Sometimes it is not - `the lattice`, `and so the rate` - and then there is no
 * source to show and the step's own working is the whole of it.
 *
 * A TABLE MAPPING THE OTHERS TO A RULE WAS EXACTLY THE BUG. `differentiating the line` was
 * mapped to CREATION, so the panel headed `delta is pushed back at nu + 2 rho sigma` showed
 * CREATION's term being derived and ended somewhere else entirely. A derivation has to end at
 * the thing it is under; if the name does not say which rule, the answer is none.
 */
const ruleText = (of: string): { rule?: string; gates?: string[] } => {
  if (!/^[A-Z][A-Z_.\/ +]*$/.test(of)) return {};
  const src = sourceOf(of.split(",")[0].trim());
  return src ? { rule: src, gates: gatesIn(src) } : {};
};

type Record_ = ReturnType<typeof record>;

/**
 * WHAT MAKES TWO RUNS THE SAME RESULT - the shape of the proof, never its numbers.
 *
 * fcc-12 and cubic-6 both conclude `shell ∝ β·r̄^(D-1)` by the same two rules from the
 * same two premises; what differs is that D is 3 by way of a third difference of 8 in
 * one and of 6 in the other. That is ONE result with two configurations. A lattice on
 * which the proof stopped somewhere else, or reached a different line, is a different
 * result and is not folded in.
 *
 * The signature is therefore the steps' identities and order, plus what was concluded
 * and what was missing - and pointedly not `measured`, which is exactly the part that is
 * expected to vary.
 */
const signature = (r: Record_) => JSON.stringify({
  concluded: r.concluded,
  standing: r.standing,
  missing: [...r.missing].sort(),
  steps: r.steps.map(s => [s.kind, s.via, s.line]),
});

export type Result = { signature: string; variants: Record_[] };
/** one theory's answer to a theorem, and the results it reached */
export type Under = { theory: string; results: Result[] };
export type Group = { theorem: string; theories: Under[] };

/** the runs of one theorem on one theory, gathered into the results they reached */
const resultsOf = (all: Record_[]): Result[] => {
  const by = new Map<string, Record_[]>();
  for (const r of all) {
    const k = signature(r);
    (by.get(k) ?? by.set(k, []).get(k)!).push(r);
  }
  /* the result that got furthest first - a reader wants the proof that closed, and the
   * ones that stopped early are the comparison rather than the headline */
  return [...by.entries()]
    .map(([signature, variants]) => ({ signature, variants }))
    .sort((a, b) => rank(b.variants[0]) - rank(a.variants[0]));
};

/** every run of one theorem, gathered by theory and then by result */
export const group = (theorem: string, all: Record_[]): Group => {
  const byTheory = new Map<string, Record_[]>();
  for (const r of all) {
    const k = r.under.theory;
    (byTheory.get(k) ?? byTheory.set(k, []).get(k)!).push(r);
  }
  return {
    theorem,
    theories: [...byTheory.entries()].map(([theory, rs]) => ({
      theory, results: resultsOf(rs),
    })),
  };
};

/**
 * EVERY FIGURE IN A GROUP, DEDUPLICATED BY TITLE.
 *
 * The same probe runs once per lattice and once per theory, so the same picture arrives
 * many times over. What a reader wants is one of each - and the FIRST of each, because
 * the results are already ranked with the proof that got furthest at the top, so the
 * first occurrence is the figure belonging to the answer the page leads with.
 */
type Figure = { title: string; svg: string; says?: string };
/** NOTHING HERE DRAWS. A probe measures a shape and has to show it; a derivation has a line. */
const figuresOf = (g: Group): Figure[] => {
  const seen = new Map<string, Figure>();
  for (const u of g.theories) for (const res of u.results) for (const v of res.variants)
    for (const p of v.probes) for (const f of (p.figures ?? []) as Figure[])
      if (!seen.has(f.title)) seen.set(f.title, f);
  return [...seen.values()];
};

/** a title as a filename - lowercase, and nothing in it that a path minds */
const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const rank = (r: Record_) =>
  (r.concluded ? 2 : 0) + (r.standing ? 2 : 0) - r.missing.length * 0.1;

export const write = (g: Group) => {
  const dir = join(ROOT, g.theorem);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "proof.json"), JSON.stringify(g, null, 2) + "\n");
  writeFileSync(join(dir, "derivation.ts"),
    module_(g.theories[0].results[0].variants[0]));
  writeFileSync(join(dir, "index.html"), page(g));
  writeFileSync(join(dir, "README.md"), readme(g));
  /*
   * AND THE FIGURES AS FILES OF THEIR OWN, as well as inline in the page.
   *
   * Inline is what makes the standalone page standalone; a file of its own is what makes
   * the picture usable anywhere else - a README on a git host, the article, a slide - and
   * `README.md` links to it because markdown cannot carry an inline `<svg>` everywhere.
   */
  return dir;
};
type Step_ = Record_["steps"][number];
type Measured_ = { name: string; value: number; err?: number; note?: string };

/* —— the framework-agnostic module ————————————————————————————————————— */

/**
 * THE PROOF AS DATA, WITH THE NOTATION ALREADY PARSED.
 *
 * A consumer gets `Piece[]` - a small tree of `text`, `var`, `count`, `bar`, the other
 * accents, the big operators, `frac`, `sup`, `sub` and `ref` - and maps each kind onto
 * whatever it draws with. `rendering/Notation.ts` is where the kinds are declared and is
 * the list to read; a consumer that does not know a kind should set its contents rather
 * than drop them, since every kind but `ref` and `words` is a wrapper around more pieces.
 * That is the whole interface. There is no framework in it, no JSX, and no assumption that the reader has
 * a build step: a React project renders `count` as its own coloured span, a plain page
 * renders it as a `<b>`, and a PDF pipeline renders it however PDFs do.
 */
const module_ = (r: Record_) => {
  const q = (v: unknown) => JSON.stringify(v, null, 2);
  const setLine = (s: string) => parse(line(s, r.theorem));
  return `/**
 * GENERATED - do not edit. Rebuild with \`npm run theorems\`.
 *
 * ${r.theorem}, for ${r.under.theory} on ${r.under.geometry}
 * (D ${r.under.D}, DEG ${r.under.DEG}), box ${r.under.N}, ${r.under.T} ticks.
 *
 * ${r.concluded ?? "no law follows from what the probes found"}
 *
 * The notation is parsed into pieces rather than into markup for any one framework:
 * map each piece's \`kind\` onto whatever you draw with. See \`rendering/Notation.ts\`.
 */
import type { Piece } from "@orbitmines/physics";

export type Step = {
  kind: "premise" | "definition" | "derived";
  via: string;
  line: Piece[];
  working: Piece[][];
  because: Piece[];
  measured: { name: string; value: number; err?: number; note?: string }[];
};

export const THEOREM = ${q(r.theorem)};
export const ASKS = ${q(r.asks)};
export const UNDER = ${q(r.under)};
export const CONCLUDED: Piece[] = ${q(r.concluded ? setLine(r.concluded) : [])};
export const STANDING = ${r.standing};
export const MISSING = ${q(r.missing)};
export const CITES = ${q(r.cites.map(c => c.key))};

export const STEPS: Step[] = ${q(r.steps.map((s: Step_) => ({
    kind: s.kind, via: s.via,
    line: setLine(s.line),
    working: (s.working ?? []).map((w: string) => setLine(w)),
    because: setLine(s.because),
    measured: s.measured ?? [],
  })))};
`;
};

/* —— the standalone page ——————————————————————————————————————————————— */

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const css = () => readFileSync(join(RENDERING, "notation.css"), "utf8");
const js = () => readFileSync(join(RENDERING, "panel.js"), "utf8");

const measuredRows = (ms: Measured_[]) =>
  !ms.length ? "" :
    `<table><tr><th>measured</th><th></th></tr>${ms.map((m: Measured_) =>
      `<tr><td>${html(m.name)}${m.note ? `<div class="n">${html(m.note)}</div>` : ""}</td>` +
      `<td class="v">${html(num(m.value, m.err))}</td></tr>`).join("")}</table>`;

/**
 * THE PICTURES, WHERE A RESULT HAS ONE - set full width, above the numbers.
 *
 * A figure is not an illustration of the conclusion here, it IS one: for `atom.hydrogen`
 * the claim is a shape, and the line of algebra above it is the shape's summary rather
 * than the other way round. So it sits with the claim rather than buried in the run's
 * measurements, and its caption says what was counted to make it.
 */
const figuresHtml = (figs: Figure[]) => !figs.length ? "" :
  figs.map(f => `<figure class="fig">
  ${f.svg}
  <figcaption><b>${esc(f.title)}</b> ${html(f.caption)}</figcaption>
</figure>`).join("");

/**
 * A STEP IS A CLAIM AND OPENS LIKE ONE — the same gesture the conclusion has.
 *
 * A THEOREM'S ANSWER IS A BUTTON that opens the working behind it. A step of that working is the
 * same kind of thing one level down: it asserts something, and behind it is why. On these pages
 * the why of a LEAF is a rewrite of `G.ts` and how the line got its term from it - so a leaf
 * opens too, into the rule's own text.
 *
 * WHICH IS THE GENERALISATION RATHER THAN A SECOND MECHANISM. `panel.js` opens whatever
 * `data-derive` names; it does not know or care whether that is a theorem or a step, so nothing
 * in it changes. What changes is that steps now have panels of their own, and the layout of a
 * step's panel is the layout of a theorem's: the claim centred at the top, then the working.
 */
/**
 * A STEP'S ADDRESS, WHICH IS ITS PATH — because a step inside a step's working is still a step
 * and opens the same way.
 *
 * `0`, then `0-2` for the third step of its working, then `0-2-1`. Deep enough for whatever the
 * proof turns out to be, and unique without counting anything globally.
 */
const stepId = (r: Record_, path: string) => `s${idOf(r.theorem)}_${path}`;

/** whether there is anything behind a step to open */
const opens = (s: Step_) => (s.derivation ?? []).length > 0 || !!s.rule;

/**
 * WHAT IS BEHIND A LEAF: the rewrite, and how a line of the model came off it.
 *
 * Three things and they are the whole of the route from a program to an equation - the rule as
 * written, the gates it names, and the reading that turned one into the other. A derived step
 * has no such panel: its warrant is the steps it came from, and those are on the page already.
 */
const stepPanel = (r: Record_, s: Step_, path: string): string => {
  if (!opens(s)) return "";
  return `<div class="panel" id="${stepId(r, path)}" tabindex="-1">
  <div class="panel-head">
    <div class="t">${esc(s.via)}<div class="n">${esc(r.under.theory)}</div></div>
    <button data-close="1">esc</button>
  </div>
  <div class="claim-eq">${html(s.line)}</div>
  <p class="n">${esc(s.because)}</p>
  ${s.rule ? `<h2>the rewrite it is about</h2>
  <pre class="src">${esc(s.rule)}</pre>
  ${(s.gates ?? []).length ? (s.gates ?? []).map((g: string) =>
    `<pre class="src">${esc(g)}</pre>`).join("") : ""}` : ""}
  ${(s.derivation ?? []).length ? `<h2>how it was reached</h2>
  ${stepsHtml(r, s.derivation ?? [], path)}` : ""}
</div>`;
};

/**
 * AND THE PANELS FOR EVERY STEP AT EVERY DEPTH.
 *
 * A proof is a tree and a page is flat, so the panels are laid out flat and addressed by path.
 * `panel.js` opens whatever `data-derive` names and does not know how deep it is, which is why
 * nothing in it changes for this.
 */
const panelsFor = (r: Record_, steps: Step_[], prefix = ""): string =>
  steps.map((s, i) => {
    const path = prefix ? `${prefix}-${i}` : `${i}`;
    return stepPanel(r, s, path) + panelsFor(r, s.derivation ?? [], path);
  }).join("");

const stepsHtml = (r: Record_, steps: Step_[] = r.steps, prefix = "") =>
  steps.map((s: Step_, i: number) => `
  <div class="step">
    <div class="because">${esc(s.via)}<span class="kind">${esc(s.kind)}</span></div>
    ${opens(s)
      ? `<button class="claim step-claim" data-derive="${
          stepId(r, prefix ? `${prefix}-${i}` : `${i}`)}">
           <div class="eq">${html(s.line)}</div>
           <span class="tag">read off &rsaquo;</span>
         </button>`
      : `<div class="step-eq">${html(s.line)}</div>`}
    ${(s.working ?? []).length
      ? `<div class="work">${(s.working ?? []).map((w: string) => `<div>${html(w)}</div>`).join("")}</div>`
      : ""}
    <p>${html(s.because)}</p>
    ${(s.measured ?? []).length
      ? `<span class="nums">${(s.measured ?? []).map((m: Measured_) =>
        `${html(m.name)} = ${html(num(m.value, m.err))}`).join("; ")}</span>` : ""}
  </div>`).join("");

/**
 * THE CONFIGURATIONS OF ONE RESULT, as a row of switches.
 *
 * Only rendered where there is a choice: a result reached on one lattice has nothing to
 * switch between, and a row of one button is furniture.
 */
const picks = (res: Result) => res.variants.length < 2 ? "" :
  `<div class="picks">${res.variants.map(v =>
    `<button data-pick="${esc(configName(v))}">${esc(configName(v))}</button>`).join("")}</div>`;

/** which settings produced this result - said plainly, since it is the point of a result */
const where = (res: Result) => {
  const v = res.variants[0];
  return `<p class="where">reached on ${res.variants.map(x =>
    `<b>${esc(x.under.geometry)}</b>`).join(", ")} - ` +
    `${res.variants.length === 1 ? "one lattice" : `${res.variants.length} lattices`}, ` +
    `${esc(v.under.theory)}` +
    /* the regime is not a detail of the run, it is which question was asked */
    (v.under.regime ? `, <b>${esc(v.under.regime)}</b> regime${
      v.under.regimeSays ? ` - ${esc(v.under.regimeSays)}` : ""}` : "") +
    `</p>`;
};

/** one configuration's numbers: the settings it ran under, then its probes */
const configBlock = (v: Record_) => `
<div data-config="${esc(configName(v))}">
  <p class="n">D ${v.under.D} &middot; DEG ${v.under.DEG} &middot; box ${v.under.N}
  &middot; ${v.under.T} ticks &middot; seeds ${v.under.seeds.join(", ")}</p>
  ${v.probes.map((p: Record_["probes"][number]) => `<div class="step">
    <div class="because">${esc(p.id)} &middot; <span class="${p.holds ? "ok" : "no"}">${
      p.holds ? "holds" : "does not hold"}</span></div>
    <p>${html(p.found)}</p>
    ${measuredRows(p.measured)}
  </div>`).join("")}`
  + `</div>`;

/** what a result did not have, said once rather than trailed after the conclusion */
const missingBlock = (v: Record_) => !v.missing.length ? "" : `
<h2>what was missing</h2>
<p class="n">The rules needed ${v.missing.length === 1 ? "this and no probe" :
  "these and no probe"} established ${v.missing.length === 1 ? "it" : "them"} here:</p>
<ul class="n">${v.missing.map((m: string) => `<li class="no">${html(m)}</li>`).join("")}</ul>
<p class="n">That is a result about ${esc(v.under.theory)}, not a failure of the prover:
a premise a run did not support is one this theory does not supply.</p>`;

/**
 * ONE RESULT - the derivation set once, with its configurations switchable underneath.
 *
 * The steps come from the first variant and are the same in all of them by construction;
 * that is what `signature` means. Only the numbers move.
 */
const resultBlock = (res: Result, id: string) => {
  const v = res.variants[0];
  return `<div data-result>
  ${where(res)}
  ${v.concluded ? `<button class="claim" data-derive="${id}">
    <div class="eq">${html(v.concluded)}</div>
    ${v.space ? `<div class="eq eq-space">${html(v.space)}</div>` : ""}
    ${v.also ? `${v.leads ? `<div class="n" style="padding-top:.4em">${esc(v.leads)}</div>` : ""}
    ${v.then ? `<div class="n" style="padding-top:1.4em">${esc(v.then)}</div>` : ""}
    <div class="eq">${html(v.also)}</div>` : ""}
    <span class="tag">derived &rsaquo;</span>
  </button>` : `<p class="n no">No law follows for ${html(v.about ?? "")} from what the
  probes found here.</p>`}
  ${v.concluded && !v.standing ? `<p class="n no">The law holds, but nothing established
  that it is about a quantity greater than zero.</p>` : ""}
  ${figuresHtml(res.variants.flatMap(x => x.probes.flatMap(p => (p.figures ?? []) as Figure[]))
    /* one of each: the same probe ran once per lattice and drew the same picture each
     * time, and a page that showed four of them would be showing the sweep rather than
     * the result */
    .filter((f, i, all) => all.findIndex(o => o.title === f.title) === i))}
  ${(v.parts ?? []).length ? `<h2>and which part is which</h2>
  <table class="parts">${(v.parts ?? []).map((p: { part: string; is: string; because: string }) =>
    `<tr><td class="p">${html(p.part)}</td><td class="w">${html(p.is)}</td>
     <td class="n">${esc(p.because)}</td></tr>`).join("")}</table>` : ""}
  ${(v.standing_for ?? []).length ? `<h2>where</h2>
  <table class="parts stands">${(v.standing_for ?? [])
    .map((p: { name: string; is: string; because: string }) =>
    `<tr><td class="w">${html(p.name)}</td><td class="p">= ${html(p.is)}</td>
     <td class="n">${esc(p.because)}</td></tr>`).join("")}</table>` : ""}
  ${missingBlock(v)}
  <h2>what the runs found</h2>
  ${picks(res)}
  ${res.variants.map(configBlock).join("")}
</div>`;
};

const panelFor = (res: Result, id: string) => {
  const v = res.variants[0];
  return `<div class="panel" id="${id}" tabindex="-1">
  <div class="panel-head">
    <div class="t">${html(v.asks)}<div class="n">${esc(v.under.theory)} on ${
      res.variants.map(x => esc(x.under.geometry)).join(", ")}</div></div>
    <button data-close="1">esc</button>
  </div>
  ${stepsHtml(v)}
</div>
${panelsFor(v, v.steps)}`;
};

/**
 * THE NAVIGATION BETWEEN RESULTS - only where there is more than one.
 *
 * Two lattices that reached different conclusions are not a variant of each other and
 * must not be switchable as though they were: they are separate answers, and the arrows
 * say so.
 */
/**
 * THE ARROWS BETWEEN RESULTS - only where one theory reached more than one.
 *
 * Two lattices that concluded differently are not variants of each other and must not be
 * switchable as though they were: they are separate answers, and the arrows say so.
 */
const nav = (u: Under) => u.results.length < 2 ? "" : `
<div class="nav">
  <button data-nav="-1">&lsaquo; previous result</button>
  <span class="at" data-at></span>
  <button data-nav="1">next result &rsaquo;</button>
</div>`;

/**
 * THE THEORY, AS A DROPDOWN ON THE TITLE.
 *
 * The theory is the thing that changes which RULES ran, so it belongs where a reader
 * looks first rather than in a path they have to navigate. Changing it swaps the whole
 * page beneath - a different answer, reached through the same shape of argument, which is
 * exactly the comparison the folder exists to make easy.
 *
 * SETTABLE FROM OUTSIDE, because a page that can only be driven by a person cannot be
 * embedded in one that already knows which theory it is talking about. `?theory=G^XOR` in
 * the address picks one on load, and `window.selectTheory("G^XOR")` picks one afterwards.
 */
const chooser = (g: Group) => `<select data-theory-pick aria-label="theory">${
  g.theories.map(u =>
    `<option value="${esc(u.theory)}">${esc(u.theory)}</option>`).join("")}</select>`;

const underBlock = (u: Under, gi: string) => `
<div data-theory="${esc(u.theory)}">
  <div data-results data-current="0">
    ${u.results.map((res, i) => resultBlock(res, `${gi}${idOf(u.theory)}r${i}`)).join("")}
    ${nav(u)}
  </div>
</div>`;

/** an id-safe form of a theory's name - `G^XOR*2` is not an element id */
const idOf = (name: string) => name.replace(/[^A-Za-z0-9]/g, "_");

const page = (g: Group) => {
  const first = g.theories[0].results[0].variants[0];
  return `<!doctype html>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(g.theorem)}</title>
<style>${css()}</style>
<main>
<h1>${chooser(g)} ${esc(g.theorem)}</h1>
<p class="q">${html(first.asks)}</p>

<div data-theories>
${g.theories.map(u => underBlock(u, "d")).join("")}
</div>

<h2></h2>
<p class="n"><a href="../index.html">all theorems</a> &middot;
<a href="proof.json">proof.json</a> &middot; <a href="derivation.ts">derivation.ts</a></p>
</main>

<div class="backdrop" id="backdrop"></div>
${g.theories.map(u => u.results.map((res, i) =>
  panelFor(res, `d${idOf(u.theory)}r${i}`)).join("")).join("")}
<script>${js()}</script>
`;
};

/* —— the collective page ——————————————————————————————————————————————— */

/**
 * EVERY THEOREM ON ONE PAGE, each with its own theory dropdown and its own working.
 */
export const index = (groups: Group[]) => `<!doctype html>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>theorems</title>
<style>${css()}</style>
<main>
<h1>THEOREMS</h1>
<p class="n">Proved from runs of the theories, not written by hand. The theory is a
dropdown on each title - it is what changes which rules ran, and the same derivation
usually survives the change with different numbers in it. The lattice is a setting below
that; where lattices genuinely disagree the results are separate and have arrows between
them. Click a line to see the working.</p>

${groups.map((g, gi) => `
<h2>${chooser(g)} ${esc(g.theorem)}</h2>
<p class="q">${html(g.theories[0].results[0].variants[0].asks)}</p>
<div data-theories>
${g.theories.map(u => `<div data-theory="${esc(u.theory)}">
  <div data-results data-current="0">
  ${u.results.map((res, i) => {
    const v = res.variants[0];
    return `<div data-result>
      ${where(res)}
      ${v.concluded ? `<button class="claim" data-derive="g${gi}${idOf(u.theory)}r${i}">
        <div class="eq">${html(v.concluded)}</div>
        ${v.space ? `<div class="eq eq-space">${html(v.space)}</div>` : ""}
        <span class="tag">derived &rsaquo;</span>
      </button>` : `<p class="n no">No law follows from what the probes found here.</p>`}
      ${v.concluded && !v.standing ? `<p class="n no">The law holds, but nothing
      established that it is about a quantity greater than zero.</p>` : ""}
      ${v.missing.length ? `<p class="n">Missing: ${v.missing.map((m: string) =>
        `<span class="no">${html(m)}</span>`).join(", ")}.</p>` : ""}
    </div>`;
  }).join("")}
  ${nav(u)}
  </div>
</div>`).join("")}
</div>
<p class="n"><a href="${esc(g.theorem)}/index.html">the runs, and what they measured</a></p>
`).join("")}
</main>

<div class="backdrop" id="backdrop"></div>
${groups.map((g, gi) => g.theories.map(u => u.results.map((res, i) =>
  panelFor(res, `g${gi}${idOf(u.theory)}r${i}`)).join("")).join("")).join("")}
<script>${js()}</script>
`;

export const writeIndex = (groups: Group[]) => {
  mkdirSync(ROOT, { recursive: true });
  writeFileSync(join(ROOT, "index.html"), index(groups));
  /*
   * THE FOLDER'S OWN README IS WRITTEN BY THE PROVER, not kept beside the output by hand.
   *
   * `theorems/` is generated, so the honest way to rebuild it is to delete it and run -
   * which ate a hand-written README three times before this. Anything that has to survive
   * a rebuild has to be produced BY the rebuild, so the prose lives in the source and is
   * emitted like everything else.
   */
  writeFileSync(join(ROOT, "README.md"), README);
  return join(ROOT, "index.html");
};

/* —— the folder's own README ——————————————————————————————————————————— */

/** the markup, flattened to something a markdown reader can show */
const flat = (s: string): string =>
  s.replace(/\\bar\{([^{}]*)\}/g, "$1̄")
    .replace(/\^\{([^{}]*)\}/g, "^($1)")
    .replace(/_\{([^{}]*)\}/g, "_$1")
    .replace(/\[\[([a-z0-9-]+)\]\]/g, (_, k) => REFERENCES[k]?.short ?? k);

/**
 * THE FOLDER'S README - one result after another, with the configurations that reached
 * each.
 *
 * Markdown cannot set an overline or a superscript, so the markup is flattened here and
 * only here; the HTML and the parsed AST keep it. That is the right way round - the
 * README is for someone browsing the repository, and the page is for someone reading the
 * proof.
 */
const readme = (g: Group) => {
  const first = g.theories[0].results[0].variants[0];
  const out: string[] = [
    `# ${g.theorem}`, ``,
    `> ${flat(first.asks)}`, ``,
    `Proved under ${g.theories.map(u => `\`${u.theory}\``).join(", ")}. ` +
    `Generated by \`implementations/.ts/src/theorems\` - nothing here was written by ` +
    `hand: every premise is a count or an exact invariance taken from the theory itself, ` +
    `and the conclusion is what the inference rules made of them. ` +
    `[Open the page](index.html) to switch theory and lattice.`, ``,
    `| theory | answer |`, `|---|---|`,
    ...g.theories.map(u => {
      const v = u.results[0].variants[0];
      return `| \`${u.theory}\` | ${v.concluded ? flat(v.concluded) : "no law follows"}` +
        `${u.results.length > 1 ? ` (and ${u.results.length - 1} other result` +
          `${u.results.length > 2 ? "s" : ""})` : ""} |`;
    }),
    ``,
  ];

  for (const u of g.theories) {
    out.push(`## ${u.theory}`, ``);
    u.results.forEach((res, i) => {
      const v = res.variants[0];
      out.push(u.results.length > 1
        ? `### result ${i + 1} of ${u.results.length}` : `### the result`, ``,
        `**${v.concluded ? flat(v.concluded) : `no law follows for ${v.about}`}**`, ``);
      if (v.concluded && !v.standing)
        out.push(`The law holds, but nothing established that it is about a quantity ` +
          `greater than zero.`, ``);
      out.push(`| lattice | D | DEG | box | ticks |`, `|---|---|---|---|---|`);
      for (const x of res.variants)
        out.push(`| \`${x.under.geometry}\` | ${x.under.D} | ${x.under.DEG} | ` +
          `${x.under.N} | ${x.under.T} |`);
      out.push(``);

      if (v.missing.length) {
        out.push(`**What was missing.** The rules needed these and no probe established ` +
          `them here:`, ``);
        for (const m of v.missing) out.push(`- ${flat(m)}`);
        out.push(``);
      }

      /*
       * THE PICTURES FIRST, because where a theorem has one the picture is the result and
       * the algebra under it is the summary. Linked rather than inlined: markdown carries
       * an `<svg>` in some readers and strips it in others, and a file beside the page
       * works in every one of them.
       */
      for (const f of res.variants.flatMap(x =>
        x.probes.flatMap(pr => (pr.figures ?? []) as Figure[]))
        .filter((f, i, all) => all.findIndex(o => o.title === f.title) === i)) {
        out.push(`![${f.title}](${slug(f.title)}.svg)`, ``,
          `*${flat(f.title)} - ${flat(f.caption)}*`, ``);
      }

      out.push(`#### the derivation`, ``);
      if (!v.steps.length)
        out.push(`There isn't one - the rules could reach no law from what the probes ` +
          `found.`, ``);
      for (const st of v.steps) {
        out.push(`**${flat(st.line)}**  `, `<sub>${st.kind} · ${st.via}</sub>  `, ``);
        if (st.working?.length) out.push("```", ...st.working.map(flat), "```", ``);
        out.push(flat(st.because), ``);
      }

      out.push(`#### what the runs found`, ``);
      for (const x of res.variants) {
        if (res.variants.length > 1) out.push(`**\`${x.under.geometry}\`**`, ``);
        for (const pr of x.probes) {
          out.push(`\`${pr.id}\` - ${pr.holds ? "holds" : "does not hold"}. ` +
            `${flat(pr.found)}`, ``);
          for (const m of pr.measured as Measured_[])
            out.push(`- ${flat(m.name)} = ${num(m.value, m.err)}` +
              `${m.note ? ` - ${flat(m.note)}` : ""}`);
          out.push(``);
        }
      }
    });
  }

  const cites = g.theories.flatMap(u => u.results.flatMap(r => r.variants[0].cites));
  const seen = new Set<string>();
  const uniq = cites.filter(c => c && !seen.has(c.key) && seen.add(c.key));
  if (uniq.length) {
    out.push(`## what it leans on`, ``);
    for (const c of uniq)
      out.push(`- **${c.short}** - ${c.title}${c.authors !== "-" ? `, ${c.authors}` : ""}` +
        `${c.year ? ` (${c.year})` : ""}. ${c.says}${c.link ? ` <${c.link}>` : ""}`);
    out.push(``);
  }
  return out.join("\n");
};
