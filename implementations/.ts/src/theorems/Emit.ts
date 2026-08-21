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
import { Glossary, says } from "./Fact.ts";
import { chained, Node } from "./Kernel.ts";
import { README } from "./README.ts";
import { Proven, Ran, sentence } from "./Proof.ts";
import { check, html, parse, Piece } from "../rendering/Notation.ts";
import { REFERENCES } from "../rendering/references.ts";

/** where the record goes: the repository's own top level, beside `visuals/` */
export const ROOT = new URL("../../../../theorems/", import.meta.url).pathname;
const RENDERING = new URL("../rendering/", import.meta.url).pathname;

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
export const folder = (p: Proven) => p.theorem.id;

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

export const record = (p: Proven) => ({
  theorem: p.theorem.id,
  asks: p.theorem.asks,
  about: p.theorem.about,
  under: {
    theory: p.lab.theory.name,
    geometry: p.lab.geometry.name,
    D: p.lab.geometry.D,
    DEG: p.lab.geometry.DEG,
    N: p.lab.N, T: p.lab.T, seeds: p.lab.seeds,
    regime: p.lab.regime?.name ?? null,
    regimeSays: p.lab.regime?.says ?? null,
  },
  /* the answer with its working folded in - `share = ∫ ... = 1/2` - see `chained` */
  concluded: p.at
    ? line(chained(p.store, p.theorem.about, p.at,
      t => symbols(t, p.theorem.glossary)) ??
      symbols(says(p.at.fact, p.theorem.glossary), p.theorem.glossary), p.theorem.id)
    : null,
  /* a law is one thing and a law about something is another - see `standing` */
  standing: p.standing,
  missing: p.missing,
  /* what this proof leaned on that was not established here */
  cites: cited(p),
  probes: p.ran.map((r: Ran) => ({
    id: r.probe.id, asks: r.probe.asks, holds: r.out.holds, found: r.out.found,
    measured: r.out.measured,
  })),
  steps: p.steps.map(n => step(n, p.theorem.glossary)),
  glossary: p.theorem.glossary,
});

const step = (n: Node, g: Glossary = {}) => ({
  id: n.id,
  kind: n.premise
    ? n.via.startsWith("definition:") ? "definition"
      : n.via.startsWith("cited:") ? "cited"
      : "premise"
    : "derived",
  via: n.via.replace(/^(definition|cited):/, ""),
  line: symbols(n.line ?? says(n.fact, g), g),
  working: n.working?.map(w => symbols(w, g)),
  because: n.because,
  from: n.from,
  measured: n.measured,
});

/** the works this proof cites, gathered off the steps that cite them */
const cited = (p: Proven) => {
  const keys = new Set<string>();
  for (const n of p.steps)
    for (const m of `${n.because} ${(n.working ?? []).join(" ")}`.matchAll(/\[\[([a-z0-9-]+)\]\]/g))
      keys.add(m[1]);
  return [...keys].map(k => REFERENCES[k]).filter(Boolean);
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
  return dir;
};
type Step_ = Record_["steps"][number];
type Measured_ = { name: string; value: number; err?: number; note?: string };

/* —— the framework-agnostic module ————————————————————————————————————— */

/**
 * THE PROOF AS DATA, WITH THE NOTATION ALREADY PARSED.
 *
 * A consumer gets `Piece[]` - a small tree of `text`, `var`, `count`, `bar`, `sup`,
 * `sub` and `ref` - and maps each kind onto whatever it draws with. That is the whole
 * interface. There is no framework in it, no JSX, and no assumption that the reader has
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
import type { Piece } from "../../implementations/.ts/src/rendering/Notation.ts";

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

const stepsHtml = (r: Record_) => r.steps.map((s: Step_) => `
  <div class="step">
    <div class="because">${esc(s.kind === "derived" ? s.via : s.kind)}</div>
    <div class="step-eq">${html(s.line)}</div>
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
    <span class="tag">derived &rsaquo;</span>
  </button>` : `<p class="n no">No law follows for ${html(v.about ?? "")} from what the
  probes found here.</p>`}
  ${v.concluded && !v.standing ? `<p class="n no">The law holds, but nothing established
  that it is about a quantity greater than zero.</p>` : ""}
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
</div>`;
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
