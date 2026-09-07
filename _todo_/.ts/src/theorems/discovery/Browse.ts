/**
 * THE PAGE - every candidate the sweep reached, with the weighting out in the open.
 *
 * WHAT A READER HAS TO DO HERE IS JUDGE, so the page is built for judging rather than for
 * announcing. A ranked list with a hidden scoring function is a machine asking to be
 * trusted; the whole of the argument for these numbers is that somebody can see them,
 * disagree, move a slider and watch the order change. So the seven scores are on every
 * row, the weights are sliders, and the total re-computes in the browser rather than
 * being baked in at emit time.
 *
 * THE VERDICT IS NOT COLOUR-CODED ALONE. Recovering a known law, contradicting one and
 * matching nothing are three states of very different consequence, and a red dot that a
 * reader has to remember the meaning of is how a falsification gets scrolled past. Each
 * carries a glyph and a word, and the colours are only the third channel.
 *
 * AND RECOVERY IS THE QUIET ONE. The instinct is to paint a match green and celebrate;
 * that is backwards. A candidate that recovers Newton is the sweep working correctly and
 * is exactly what a reader does NOT need to look at - so it is set in the de-emphasis
 * grey, and what gets the accent is the thing nobody has a name for.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { html } from "../../rendering/Notation.ts";
import { ALIASES, INEXPRESSIBLE, READS, TARGETS } from "./Targets.ts";
import { Candidate, WEIGHTS } from "./Rank.ts";
import { Conjecture } from "./Conjectures.ts";
import { Covered } from "./Coverage.ts";

const RENDERING = new URL("../../rendering/", import.meta.url).pathname;
const base = () => readFileSync(join(RENDERING, "notation.css"), "utf8");

const esc = (s: string) => String(s ?? "")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** JSON that cannot end the script element it sits in */
const q = (x: unknown) => JSON.stringify(x).replace(/</g, "\\u003c");

/**
 * THE SEVEN, IN THE ORDER THEY ARE ALWAYS DRAWN.
 *
 * Fixed, because the row of meters on every card is read positionally - a reader learns
 * that the first bar is discrimination and the fourth is exactness, and reordering them
 * per card would make the whole column unreadable. The legend above the list names them
 * once.
 */
const AXES: { key: keyof typeof WEIGHTS; name: string; says: string }[] = [
  { key: "discriminates", name: "tells theories apart",
    says: "the same subject concluded differently under different theories, on one " +
      "lattice and one regime - which is a measurement that would kill one of them" },
  { key: "novelty", name: "novelty",
    says: "what the corpus of known laws makes of it: contradicting one scores highest, " +
      "matching nothing next, recovering one lowest" },
  { key: "usefulness", name: "usefulness",
    says: "how much else in the derivation stands on it, counted through - a lemma " +
      "forty conclusions rest on is load-bearing however dull it looks" },
  { key: "exactness", name: "exactness",
    says: "whether anything underneath it was fitted. Exact counts and snapped " +
      "exponents keep this at one; a leaf with an error bar pulls it down" },
  { key: "bridges", name: "bridges probes",
    says: "how many different probes its leaves come from. One probe is a restatement " +
      "of one measurement; two or more is a connection between independent ones" },
  { key: "robust", name: "same on every lattice",
    says: "whether the symbolic conclusion is identical across the lattices it was " +
      "derived on - a law about dimension rather than about one tiling" },
  { key: "economy", name: "economy",
    says: "few leaves, and few of those assumed rather than measured" },
];

const VERDICTS: Record<string, { glyph: string; word: string; cls: string }> = {
  recovers: { glyph: "=", word: "recovers a known law", cls: "v-known" },
  "unheard-of": { glyph: "?", word: "matches nothing in the corpus", cls: "v-new" },
  contradicts: { glyph: "!", word: "contradicts a known law", cls: "v-clash" },
};

const css = () => `${base()}
:root{--meter:#7fb8d4;--track:#374a55;--clash:#d03b3b;--quiet:#8a8d99}
main{max-width:104ch}
.lede{color:var(--dim);line-height:1.7;margin:.6em 0 2em}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(11ch,1fr));gap:1px;
background:var(--rule);border:1px solid var(--rule);margin:0 0 2em}
.kpi{background:var(--card);padding:.9em 1em}
.kpi .v{font-size:1.7em;color:#e8ecf4;line-height:1.1}
.kpi .l{color:var(--faint);font-size:.78em;letter-spacing:.04em;margin-top:.35em}
.controls{position:sticky;top:0;z-index:20;background:var(--bg);
border-bottom:1px solid var(--rule);padding:.9em 0 1em;margin-bottom:1.6em}
.row{display:flex;flex-wrap:wrap;gap:.5em;align-items:center}
.row + .row{margin-top:.6em}
input[type=search],select{background:var(--card);color:var(--ink);font:inherit;
border:1px solid var(--edge);border-radius:2px;padding:.4em .6em}
input[type=search]{flex:1;min-width:18ch}
.chip{background:var(--card);border:1px solid var(--edge);border-radius:2px;
color:var(--dim);cursor:pointer;font:inherit;font-size:.85em;padding:.35em .7em}
.chip[aria-pressed=true]{border-color:var(--meter);color:#e8ecf4}
.sliders{display:none;grid-template-columns:repeat(auto-fit,minmax(26ch,1fr));
gap:.5em 1.6em;padding:1em 0 .2em}
.sliders.open{display:grid}
.slider{display:flex;align-items:center;gap:.7em;font-size:.85em;color:var(--dim)}
.slider label{flex:1}
.slider input{flex:1;accent-color:var(--meter)}
.slider .w{color:var(--faint);width:4ch;text-align:right;
font-variant-numeric:tabular-nums}
.cand{border-top:1px solid var(--rule);padding:1.5em 0 1.6em;display:grid;
grid-template-columns:9ch 1fr;gap:0 2em}
.cand:hover{background:rgba(127,184,212,.02)}
.score{text-align:right}
.score .t{font-size:1.5em;color:#e8ecf4;line-height:1;
font-variant-numeric:tabular-nums}
.score .r{color:var(--faint);font-size:.72em;letter-spacing:.05em;margin-top:.3em}
.total{height:4px;background:var(--track);border-radius:2px;margin-top:.7em;
overflow:hidden}
.total i{display:block;height:100%;background:var(--meter);border-radius:0 2px 2px 0}
.law{font-family:Georgia,"Times New Roman",serif;font-size:1.18em;color:var(--ink);
overflow-x:auto;padding:.1em 0 .5em}
.about{color:var(--faint);font-size:.78em;letter-spacing:.05em;margin-bottom:.4em}
.badges{display:flex;flex-wrap:wrap;gap:.5em;margin:.5em 0 .8em;font-size:.8em}
.badge{border:1px solid var(--edge);border-radius:2px;padding:.2em .55em;color:var(--dim)}
.badge .g{font-family:ui-monospace,monospace;margin-right:.45em}
.v-known{color:var(--quiet)}
.v-ok{color:var(--meter);border-color:rgba(127,184,212,.4)}
.v-would{color:var(--named);border-color:rgba(224,168,120,.35)}
.v-new{color:var(--named);border-color:rgba(224,168,120,.4)}
.v-clash{color:var(--clash);border-color:rgba(208,59,59,.5)}
.meters{display:flex;gap:2px;align-items:flex-end;height:26px;margin:.2em 0 .9em}
.meters .m{width:20px;height:100%;background:var(--track);border-radius:2px;
display:flex;align-items:flex-end;cursor:help}
.meters .m i{display:block;width:100%;background:var(--meter);border-radius:2px}
.legend{display:flex;gap:2px;margin:.2em 0 1.4em;color:var(--faint);font-size:.7em;
flex-wrap:wrap}
.legend span{width:22px;text-align:center}
.prov{color:var(--faint);font-size:.82em;line-height:1.7}
.prov b{color:var(--dim);font-weight:400}
details{margin-top:.8em}
summary{cursor:pointer;color:var(--derived);font-size:.8em;letter-spacing:.05em}
.steps{border-left:1px solid var(--rule);margin:.9em 0 0;padding:0 0 0 1.2em}
.st{padding:.5em 0 .9em}
.st .e{font-family:Georgia,serif;color:var(--ink);overflow-x:auto}
.st .w{color:var(--faint);font-size:.78em;line-height:1.6;margin-top:.2em}
.st .via{color:var(--derived);font-size:.68em;letter-spacing:.08em;
text-transform:uppercase;opacity:.7}
.split{width:100%;font-size:.85em;margin:.7em 0 0}
.split td{padding:.25em .8em .25em 0;border-bottom:1px solid var(--rule)}
.split td.k{color:var(--faint);white-space:nowrap}
.split td.e{font-family:Georgia,serif;color:var(--ink)}
.none{color:var(--faint);padding:3em 0;text-align:center}
#table{display:none;width:100%;font-size:.85em}
#table.open{display:table}
#table td,#table th{font-variant-numeric:tabular-nums;white-space:nowrap}
#table td.l{white-space:normal;font-family:Georgia,serif;color:var(--ink)}
@media (max-width:800px){.cand{grid-template-columns:1fr}.score{text-align:left}}
`;

const meters = (c: Candidate) => `<div class="meters">${AXES.map(a => {
  const v = Math.round((c.scores[a.key] ?? 0) * 100);
  return `<span class="m" title="${esc(a.name)}: ${v}%"><i style="height:${
    Math.max(v, 2)}%"></i></span>`;
}).join("")}</div>`;

const verdictBadge = (c: Candidate) => {
  const gated = c.grade !== "derived" || c.leaning.some(l => l.status !== "measured");
  const v = c.verdict.kind === "unheard-of" || !gated ? VERDICTS[c.verdict.kind]
    : { glyph: "~", word: "WOULD match, if what it stands on were measured",
        cls: "v-would" };
  const t = c.verdict.kind === "recovers" || c.verdict.kind === "contradicts"
    ? ` &middot; ${esc(c.verdict.target.law)}${c.verdict.leading
      ? " (to leading order)" : ""}` : "";
  return `<span class="badge ${v.cls}"><span class="g">${v.glyph}</span>${v.word}${t}</span>`;
};

/**
 * WHY A MATCH IS NOT BEING CLAIMED - said in full, because a suppressed claim that does
 * not say what suppressed it is indistinguishable from no claim at all.
 */
const gatedNote = (c: Candidate) => {
  if (c.verdict.kind === "unheard-of") return "";
  const bad = c.leaning.filter(l => l.status !== "measured");
  const bits: string[] = [];
  if (c.grade !== "derived") bits.push(`it stands on ${c.from.definitions.length || "no"}
    definition${c.from.definitions.length === 1 ? "" : "s"} rather than on runs`);
  for (const l of bad) bits.push(`it would have to read ${html(l.symbol)} as
    ${esc(l.as)}, which is ${l.status}${l.evidence ? ` - ${esc(l.evidence)}` : ""}`);
  return bits.length
    ? `<br><b>not claimed, because</b> ${bits.join("; and ")}` : "";
};

const card = (c: Candidate, i: number) => `
<article class="cand" data-i="${i}">
  <div class="score">
    <div class="t" data-total>${c.scores.total.toFixed(2)}</div>
    <div class="r">score</div>
    <div class="total"><i data-totalbar style="width:${c.scores.total * 100}%"></i></div>
  </div>
  <div>
    <div class="about">${html(c.subject)}${c.called !== c.subject
      ? ` &middot; what the corpus calls ${esc(c.called)}` : ""}${c.asked
      ? ` &middot; already asked by ${esc(c.asked)}` : ""}</div>
    <div class="law">${html(c.line)}</div>
    <div class="badges">
      ${verdictBadge(c)}
      ${c.splits.length ? `<span class="badge v-new"><span class="g">&divide;</span>${
        c.splits.length} where the theories disagree</span>` : ""}
      ${c.from.probes.length > 1 ? `<span class="badge"><span class="g">+</span>${
        c.from.probes.length} probes</span>` : ""}
      ${c.from.definitions.length ? `<span class="badge"><span class="g">&sect;</span>${
        c.from.definitions.length} assumed</span>` : ""}
      ${c.grade === "derived" ? `<span class="badge v-ok"><span class="g">&check;</span>derived
        - every leaf is a run</span>`
        : c.grade === "probed" ? `<span class="badge v-ok"><span class="g">&bull;</span>probed
        - a probe's own conclusion, argued from the rules, with no inference step above
        it</span>`
        : c.grade === "conjectured" ? `<span class="badge v-clash"><span class="g">?</span>conjectured
        - ${c.from.definitions.length} definition${c.from.definitions.length > 1 ? "s" : ""}
        underneath it</span>`
        : `<span class="badge v-clash"><span class="g">0</span>assumed - no run anywhere
        under it</span>`}
      ${c.agrees ? `<span class="badge v-ok"><span class="g">&equiv;</span>a probe measured
        this and the rules reached it independently</span>` : ""}
      ${c.arithmetic ? `<span class="badge"><span class="g">#</span>arithmetic over the
        tiling's counts</span>` : ""}
    </div>
    ${meters(c)}
    <div class="prov">
      <b>measured by</b> ${c.from.probes.map(esc).join(", ") || "nothing - assumed"}
      &middot; <b>depth</b> ${c.depth} passes &middot; <b>leaves</b> ${c.leaves}
      ${c.verdict.kind === "recovers" && c.verdict.counts.length
        ? `<br><b>with this model's counts divided out:</b> ${
          c.verdict.counts.map(esc).join(" &middot; ")} - which is what the measured
          constant would have to be` : ""}
      ${gatedNote(c)}
      ${(c.verdict.kind === "recovers" || c.verdict.kind === "contradicts")
        && c.verdict.leading
        ? `<br><b>compared at its leading term</b> - the conclusion is a sum, and what a
          far-field law is about is the part of it that dies most slowly` : ""}
      ${(c.verdict.kind === "recovers" || c.verdict.kind === "contradicts")
        && c.verdict.read.length
        ? `<br><b>only by reading</b> ${c.verdict.read.map(r =>
          `${html(r)} as ${html(READS[r]?.as ?? "")} - ${html(READS[r]?.says ?? "")}`)
          .join("; ")} - which is a claim of this model's, not a renaming` : ""}
      ${c.verdict.kind === "contradicts"
        ? `<br><b>the clash:</b> ${html(c.verdict.how)}. ${esc(c.verdict.target.law)} is
          claimed only ${esc(c.verdict.target.limit)} - check that against the run before
          reading this as a falsification` : ""}
    </div>
    ${c.splits.length ? `<table class="split">${c.splits.map(s =>
      Object.entries(s.by).map(([theory, l], k) => `<tr>
        <td class="k">${k === 0 ? esc(s.geometry) +
          (s.regime ? ` / ${esc(s.regime)}` : "") : ""}</td>
        <td class="k">${esc(theory)}</td>
        <td class="e">${html(l)}</td></tr>`).join("")).join("")}</table>` : ""}
    <details>
      <summary>the derivation, ${c.steps.length} steps</summary>
      <div class="steps">${c.steps.map(s => `<div class="st">
        <div class="e">${html(s.line)}</div>
        <div class="via">${s.premise ? "premise" : "by"} ${esc(s.via)}</div>
        <div class="w">${html(s.because)}</div>
      </div>`).join("")}</div>
    </details>
  </div>
</article>`;

export const page = (
  candidates: Candidate[],
  cells: { under: { theory: string; geometry: string; regime?: string }; closed: boolean;
    nodes: number; concluded: number }[],
  swept: { theories: string[]; geometries: string[]; regimes: string[]; T: number;
    seeds: number[] },
  covered: Covered[] = [],
  open_: Conjecture[] = [],
) => {
  const fresh = candidates.filter(c => !c.asked);
  const clash = candidates.filter(c => c.verdict.kind === "contradicts");
  const known = candidates.filter(c => c.verdict.kind === "recovers");
  const splits = candidates.filter(c => c.splits.length);
  const facts = cells.reduce((a, c) => a + c.nodes, 0);

  const kpi = (v: string | number, l: string) =>
    `<div class="kpi"><div class="v">${v}</div><div class="l">${l}</div></div>`;

  return `<!doctype html>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>discovered</title>
<style>${css()}</style>
<main>
<h1>DISCOVERED</h1>
<p class="lede">Nobody asked for these. The prover runs every probe in the catalogue into
one store, closes it under the same rules the handmade theorems use, and this is
everything it reached - the goal was never named, so no conclusion here can have been
aimed at. What is left is judging them, which is why the seven scores are on every row and
the weighting is a set of sliders rather than a number somebody chose for you.
${swept.theories.length} theories over ${swept.geometries.length} lattices and
${swept.regimes.length} regimes, ${swept.T} ticks.</p>

<div class="kpis">
  ${kpi(candidates.length, "statements reached")}
  ${kpi(candidates.filter(c => c.grade === "derived").length, "standing only on runs")}
  ${kpi(candidates.filter(c => c.grade === "probed").length, "a probe's own conclusion")}
  ${kpi(open_.length, "assumptions still open")}
  ${kpi(`${covered.filter(c => c.state === "derived").length}/${covered.length}`,
    "of our own theorems refound")}
  ${kpi(fresh.length, "that no theorem asks")}
  ${kpi(splits.length, "tell the theories apart")}
  ${kpi(clash.length, "contradict a known law")}
  ${kpi(known.length, "recover a known law")}
  ${kpi(facts.toLocaleString("en"), "facts closed over")}
  ${kpi(cells.length, "cells swept")}
</div>

<div class="controls">
  <div class="row">
    <input type="search" id="q" placeholder="search the laws, subjects and probes">
    <select id="sort">
      <option value="total">by score</option>
      <option value="discriminates">by how well it tells theories apart</option>
      <option value="novelty">by novelty</option>
      <option value="usefulness">by how much stands on it</option>
      <option value="exactness">by exactness</option>
      <option value="bridges">by probes bridged</option>
      <option value="depth">by depth of derivation</option>
    </select>
    <button class="chip" id="weights-open" aria-pressed="false">weights</button>
    <button class="chip" id="table-open" aria-pressed="false">table</button>
  </div>
  <div class="row">
    <button class="chip" data-filter="fresh" aria-pressed="true">unasked only</button>
    <button class="chip" data-filter="splits" aria-pressed="false">tells theories apart</button>
    <button class="chip" data-filter="clash" aria-pressed="false">contradicts</button>
    <button class="chip" data-filter="new" aria-pressed="false">matches nothing</button>
    <button class="chip" data-filter="known" aria-pressed="false">recovers a law</button>
    <button class="chip" data-filter="exact" aria-pressed="false">nothing fitted</button>
    <button class="chip" data-filter="bridge" aria-pressed="false">two or more probes</button>
    <button class="chip" data-filter="clean" aria-pressed="false">assumes nothing</button>
    <button class="chip" data-filter="derived" aria-pressed="false">derived only</button>
    <button class="chip" data-filter="probed" aria-pressed="false">probe conclusions</button>
    <button class="chip" data-filter="measured" aria-pressed="false">has a run under it</button>
    <button class="chip" data-filter="noarith" aria-pressed="true">hide arithmetic</button>
  </div>
  <div class="sliders" id="sliders">
    ${AXES.map(a => `<div class="slider" title="${esc(a.says)}">
      <label for="w-${a.key}">${a.name}</label>
      <input type="range" id="w-${a.key}" data-w="${a.key}" min="0" max="50"
        value="${Math.round(WEIGHTS[a.key] * 100)}">
      <span class="w" data-wv="${a.key}">${WEIGHTS[a.key].toFixed(2)}</span>
    </div>`).join("")}
  </div>
</div>

<div class="legend">
  ${AXES.map((a, i) => `<span title="${esc(a.name)}: ${esc(a.says)}">${i + 1}</span>`).join("")}
  <span style="width:auto;margin-left:1em">${AXES.map((a, i) =>
    `${i + 1} ${a.name}`).join(" &middot; ")}</span>
</div>

<div id="list">${candidates.map(card).join("")}</div>
<p class="none" id="none" style="display:none">Nothing here matches those filters.</p>

<table id="table">
  <thead><tr><th>law</th><th>score</th>${AXES.map(a =>
    `<th>${esc(a.name)}</th>`).join("")}<th>verdict</th></tr></thead>
  <tbody>${candidates.map(c => `<tr><td class="l">${html(c.subject)}: ${html(c.line)}</td>
    <td>${c.scores.total.toFixed(2)}</td>${AXES.map(a =>
      `<td>${c.scores[a.key].toFixed(2)}</td>`).join("")}
    <td>${c.verdict.kind}</td></tr>`).join("")}</tbody>
</table>

<h2>what the corpus holds</h2>
<p class="n">A candidate is called novel when it matches nothing in ${TARGETS.length}
laws written in this same vocabulary - ${
  [...new Set(TARGETS.map(t => t.domain))].join(", ")}. That is a claim about the corpus
as much as about the candidate.</p>

<h2>what is still being taken on trust</h2>
<p class="n">Every one of these is a line some theorem writes down as a definition, turned
round and stated as an experiment. They are ordered by how much is waiting on them, which
is the only ordering that matters when the list is a work queue - and the top of it is
usually not where you would have looked.</p>
<table><tr><th>the claim</th><th>from</th><th>waiting on it</th><th>how to settle it</th></tr>
${open_.slice(0, 24).map(c => `<tr>
  <td class="v">${html(c.fact)}</td>
  <td class="n">${esc(c.from)}</td>
  <td class="v">${c.leverage}</td>
  <td class="n">${c.measurable ? html(c.measurable)
    : "no run suggests itself from the shape of the claim - either it fixes a symbol and " +
      "there is nothing to measure, or it needs an observable nothing here has"}</td>
</tr>`).join("")}</table>

<h2>did it refind what we already knew</h2>
<p class="n">The sweep closes a bigger premise set under the same rules, so it ought to
reach everything the handmade theorems reach. Where it does not, that is a regression and
should read as one - not as a smaller number of discoveries.</p>
<table><tr><th>theorem</th><th>state</th><th>what the sweep reached</th></tr>
${covered.map(c => `<tr><td class="n">${esc(c.theorem)}</td>
  <td class="${c.state === "derived" ? "" : "no"}">${esc(c.state)}${
    c.agrees ? " (probe and proof agree)" : ""}</td>
  <td class="v">${html(c.line ?? "-")}</td></tr>`).join("")}</table>

<h2>the two ways a symbol is matched</h2>
<p class="n">A candidate is compared with the corpus after this model's own counts are
divided out and its symbols are put into the corpus's names. Renaming is free - the same
quantity, two spellings. Reading is not: it is a claim of this model's, and any match that
needed one says so on the row.</p>
<table><tr><th>this model</th><th>the corpus</th><th>which kind</th></tr>
${Object.entries(ALIASES).map(([a, b]) =>
  `<tr><td class="v">${html(a)}</td><td class="v">${esc(b)}</td>
  <td class="n">a renaming - nothing is claimed</td></tr>`).join("")}
${Object.entries(READS).map(([a, r]) =>
  `<tr><td class="v">${html(a)}</td><td class="v">${esc(r.as)}</td>
  <td class="n">a reading, <b>${esc(r.status)}</b> - ${html(r.says)}${
    r.evidence ? `. ${esc(r.evidence)}` : ""}</td></tr>`).join("")}
</table>

<h2>what this vocabulary cannot say</h2>
<p class="n">For anything on this list, "matches nothing" means the corpus cannot hold the
law, not that the law is unknown.</p>
<ul class="n">${INEXPRESSIBLE.map(i =>
  `<li><b>${esc(i.what)}</b> - ${esc(i.why)}</li>`).join("")}</ul>

<h2>the runs behind it</h2>
<table><tr><th>theory</th><th>lattice</th><th>regime</th><th>facts</th><th>laws</th>
<th>closed</th></tr>
${cells.map(c => `<tr><td>${esc(c.under.theory)}</td><td>${esc(c.under.geometry)}</td>
<td>${esc(c.under.regime ?? "")}</td><td class="v">${c.nodes}</td>
<td class="v">${c.concluded}</td><td>${c.closed ? "yes" : "CAP REACHED"}</td></tr>`).join("")}
</table>

<p class="n"><a href="../index.html">the handmade theorems</a> &middot;
<a href="discovered.json">discovered.json</a></p>
</main>

<script>
const DATA = ${q(candidates.map(c => ({
  scores: c.scores, verdict: c.verdict.kind, splits: c.splits.length,
  probes: c.from.probes.length, defs: c.from.definitions.length, depth: c.depth,
  asked: !!c.asked, arithmetic: c.arithmetic, grade: c.grade,
  text: [c.subject, c.called, c.line, c.says, ...c.from.probes].join(" ").toLowerCase(),
})))};
const AXES = ${q(AXES.map(a => a.key))};
const W = ${q(Object.fromEntries(AXES.map(a => [a.key, WEIGHTS[a.key]])))};
const list = document.getElementById("list");
const cards = [...list.children];
const on = new Set(["fresh", "noarith"]);
let sort = "total", query = "";

const total = i => AXES.reduce((a, k) => a + W[k] * DATA[i].scores[k], 0);

const keep = i => {
  const d = DATA[i];
  if (query && !d.text.includes(query)) return false;
  for (const f of on) {
    if (f === "fresh" && d.asked) return false;
    if (f === "splits" && !d.splits) return false;
    if (f === "clash" && d.verdict !== "contradicts") return false;
    if (f === "new" && d.verdict !== "unheard-of") return false;
    if (f === "known" && d.verdict !== "recovers") return false;
    if (f === "exact" && d.scores.exactness < 1) return false;
    if (f === "bridge" && d.probes < 2) return false;
    if (f === "clean" && d.defs) return false;
    if (f === "derived" && d.grade !== "derived") return false;
    if (f === "probed" && d.grade !== "probed") return false;
    if (f === "measured" && !d.probes) return false;
    if (f === "noarith" && d.arithmetic) return false;
  }
  return true;
};

const draw = () => {
  const shown = cards.map((el, i) => i).filter(keep);
  shown.sort((a, b) => sort === "total" ? total(b) - total(a)
    : sort === "depth" ? DATA[b].depth - DATA[a].depth
    : DATA[b].scores[sort] - DATA[a].scores[sort]);
  for (const el of cards) el.style.display = "none";
  for (const i of shown) {
    const el = cards[i], t = total(i);
    el.querySelector("[data-total]").textContent = t.toFixed(2);
    el.querySelector("[data-totalbar]").style.width = (Math.min(t, 1) * 100) + "%";
    el.style.display = "";
    list.appendChild(el);
  }
  document.getElementById("none").style.display = shown.length ? "none" : "";
};

document.getElementById("q").addEventListener("input", e => {
  query = e.target.value.trim().toLowerCase(); draw();
});
document.getElementById("sort").addEventListener("change", e => {
  sort = e.target.value; draw();
});
for (const b of document.querySelectorAll("[data-filter]"))
  b.addEventListener("click", () => {
    const f = b.dataset.filter;
    if (on.has(f)) on.delete(f); else on.add(f);
    b.setAttribute("aria-pressed", on.has(f));
    draw();
  });
for (const s of document.querySelectorAll("[data-w]"))
  s.addEventListener("input", () => {
    W[s.dataset.w] = Number(s.value) / 100;
    document.querySelector('[data-wv="' + s.dataset.w + '"]').textContent =
      W[s.dataset.w].toFixed(2);
    draw();
  });
const toggle = (btn, el, cls) => btn.addEventListener("click", () => {
  const open = el.classList.toggle(cls);
  btn.setAttribute("aria-pressed", open);
});
toggle(document.getElementById("weights-open"), document.getElementById("sliders"), "open");
toggle(document.getElementById("table-open"), document.getElementById("table"), "open");
draw();
</script>
`;
};

/**
 * THE FOLDER'S OWN README, WRITTEN BY THE SWEEP - same reasoning as `Emit.ts`.
 *
 * `theorems/discovered/` is generated, so anything in it that has to survive a rebuild has
 * to be produced BY the rebuild. A hand-written note beside generated output is a note
 * that gets deleted the first time somebody clears the folder and runs again.
 */
export const readme = (
  candidates: Candidate[],
  swept: { theories: string[]; geometries: string[]; regimes: string[]; T: number },
) => {
  const fresh = candidates.filter(c => !c.asked && !c.arithmetic);
  const clash = candidates.filter(c => c.verdict.kind === "contradicts");
  const known = candidates.filter(c => c.verdict.kind === "recovers");
  const splits = candidates.filter(c => c.splits.length);
  return `# discovered

Generated by \`npm run discover\`. Do not edit - it is rewritten by the next sweep.

Every probe in the catalogue is run into ONE store, closed under the same rules the
handmade theorems use, and everything the closure reached is read off. No goal is named
before saturation, so nothing here can have been aimed at.

- **${candidates.length}** derived laws, **${fresh.length}** of them about quantities no
  theorem asks about
- **${splits.length}** conclude differently under different theories on the same lattice -
  those name a measurement that would tell the theories apart
- **${clash.length}** contradict a law in the corpus, **${known.length}** recover one
- swept over ${swept.theories.join(", ")} on ${swept.geometries.join(", ")}, regimes
  ${swept.regimes.join(", ")}, ${swept.T} ticks

Open \`index.html\` to read them. The seven scores are on every row and the weighting is a
set of sliders: there is no correct weighting of "surprising" against "load-bearing", only
one somebody can see and disagree with.

\`discovered.json\` holds everything the page is built from, so re-scoring and re-rendering
costs nothing - \`npm run discover -- --render\`.

## what it does not do

The fact vocabulary is a counting argument's vocabulary. It carries scalings, exact
rationals, sums, integrals and leading-order corrections; it does not carry tensors, gauge
structure, variational principles, operator ordering or anything exponential. For those,
"matches nothing in the corpus" means the corpus cannot hold the law - not that the law is
unknown. The page lists them.
`;
};
