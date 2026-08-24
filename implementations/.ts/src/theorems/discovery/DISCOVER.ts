/**
 * THE ENTRY POINT - saturate everything, score it, and write the page.
 *
 *   npm run discover
 *   npm run discover -- --theories G,G^XOR --geometries fcc-12,cubic-6
 *   npm run discover -- --render     (re-score and re-render what is already on disk)
 *
 * WHAT COMES OUT is `theorems/discovered/` at the top of the repository: one page, every
 * candidate the rules reached that nobody asked for, sorted by a weighting that is visible
 * and adjustable rather than baked in.
 *
 * THE CROSS-PRODUCT IS THE EXPENSE AND IT IS ALSO THE POINT. A conclusion is only known to
 * discriminate between two theories if it was derived under both, on the same lattice, in
 * the same regime - so the sweep is theories x lattices x regimes, and the probe answers
 * are cached across all of it because a probe cannot see the regime.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { GEOMETRIES, Geometry } from "../../lib/Local.ts";
import { G } from "../../theories/G.ts";
import { G_XOR } from "../../theories/G^XOR.ts";
import { G_XOR_2 } from "../../theories/G^XOR*2.ts";
import { G_CONSERVING } from "../../theories/G^CONSERVING.ts";

import { LADDER, Lab } from "../Probe.ts";
import { ROOT } from "../Emit.ts";
import { REGIMES } from "../theorems/transport.ts";
import { Cell, ASKED, harvest } from "./Harvest.ts";
import { Candidate, WEIGHTS, rank } from "./Rank.ts";
import { Conjecture, conjectures } from "./Conjectures.ts";
import { Covered, coverage } from "./Coverage.ts";
import { page, readme } from "./Browse.ts";

/**
 * THE THEORIES SWEPT - the three the article means to be read side by side, and the null
 * control.
 *
 * `G^CONSERVING` destroys nothing, which is what makes it worth carrying: a candidate that
 * concludes the same thing under it never needed the destruction, and there is no other
 * way to find that out. It is a control rather than a fourth physics.
 *
 * The sweep briefly carried `G^LABELLED`, and carrying it was a mistake worth recording.
 * That theory is `G^XOR` plus a per-ray tag holding the emitter's declared velocity, and
 * `reads/what-a-meeting-looks-at` establishes that no rule consults the tag - run on one
 * seed the two theories are identical tick for tick, with a moving source or a still one.
 * So it was not a fifth physics to compare against; it was the same physics with an
 * annotation, and an annotation carrying a number nothing in the dynamics sets or checks.
 *
 * WHAT THE TAG STOOD IN FOR IS ALREADY IN `G^XOR`, which is the point of removing it.
 * A source alternates its sign, and its rays leave one cell a tick - so the spacing
 * between sign reversals along a direction is set by how fast the source is going that
 * way. The velocity is written into the spatial phase pattern by the dynamics themselves.
 * See `doppler/what-a-moving-source-writes-into-space`.
 */
const THEORIES: Record<string, any> = {
  G, "G^XOR": G_XOR, "G^XOR*2": G_XOR_2, "G^CONSERVING": G_CONSERVING,
};

const arg = (name: string, fallback?: string) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : fallback;
};

const OUT = join(ROOT, "discovered");

const plain = (s: string) => s
  .replace(/\\bar\{([^{}]*)\}/g, "$1_")
  .replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, "($1)/($2)")
  .replace(/\^\{([^{}]*)\}/g, "^($1)")
  .replace(/_\{([^{}]*)\}/g, "_$1");

/** everything the sweep found, kept so that re-scoring costs nothing */
type Saved = {
  swept: { theories: string[]; geometries: string[]; regimes: string[]; N: string;
    T: number; seeds: number[] };
  cells: { under: Cell["under"]; closed: boolean; nodes: number; concluded: number;
    probes: { id: string; holds: boolean; found: string; failed?: string }[] }[];
  candidates: Candidate[];
  covered: Covered[];
  open: Conjecture[];
  weights: typeof WEIGHTS;
  when: string;
};

if (process.argv.includes("--render")) {
  const saved: Saved = JSON.parse(readFileSync(join(OUT, "discovered.json"), "utf8"));
  writeFileSync(join(OUT, "index.html"),
    page(saved.candidates, saved.cells, saved.swept, saved.covered, saved.open));
  writeFileSync(join(OUT, "README.md"), readme(saved.candidates, saved.swept));
  console.log(`  rendered theorems/discovered/index.html`);
  process.exit(0);
}

const theories = (arg("theories") ?? Object.keys(THEORIES).join(","))
  .split(",").map(n => {
    const t = THEORIES[n.trim()];
    if (!t) throw new Error(`there is no theory called ${n.trim()} here - ` +
      Object.keys(THEORIES).join(", "));
    return t;
  });

const sweep = (arg("geometries") ?? "fcc-12,cubic-6,square-4,line-2")
  .split(",").map(n => {
    const g = GEOMETRIES[n.trim()];
    if (!g) throw new Error(`there is no lattice called ${n.trim()} here`);
    return g;
  });

const regimes = (arg("regimes") ?? REGIMES.map(r => r.name).join(","))
  .split(",").map(n => {
    const r = REGIMES.find(x => x.name === n.trim());
    if (!r) throw new Error(`there is no regime called ${n.trim()} here`);
    return r;
  });

const boxFor = (g: Geometry) => {
  const asked = arg("N");
  if (asked) return Number(asked);
  return g.D === 1 ? 61 : g.D === 2 ? 41 : 21;
};
const T = Number(arg("T", "120"));
const seeds = arg("seeds", "1")!.split(",").map(Number);
const cap = Number(arg("cap", "40"));

console.log(`${theories.map(t => t.name).join(", ")} over ` +
  `${sweep.map(g => g.name).join(", ")}, regimes ${regimes.map(r => r.name).join(", ")}` +
  `, ${T} ticks, seeds ${seeds.join(",")}\n`);

const cells: Cell[] = [];
const started = Date.now();

for (const theory of theories)
  for (const regime of regimes)
    for (const geometry of sweep) {
      const lab: Lab = { theory, geometry, N: boxFor(geometry), T, seeds,
        ladder: LADDER, boxFor, regime, say: () => {} };
      const label = `${theory.name} ${geometry.name} / ${regime.name}`;
      process.stdout.write(`  ${label.padEnd(34)} `);
      const t0 = Date.now();
      const cell = harvest(lab, cap);
      cells.push(cell);
      for (const f of cell.forks)
        console.log(`\n    FORK: ${f.subject} is claimed by ${f.from.join(" and ")} - ` +
          `two laws for one subject give substitution two routes through it, and the ` +
          `routes multiply`);
      console.log(`${cell.store.nodes.size} facts, ${cell.concluded.length} laws` +
        `${cell.closed ? "" : " (CAP - closure incomplete)"}` +
        `  ${((Date.now() - t0) / 1000).toFixed(1)}s`);
    }

const candidates = rank(cells);

/*
 * A CANDIDATE A HANDMADE THEOREM ALREADY ASKS IS NOT HIDDEN - it is MARKED.
 *
 * Those are the checks: if the discovery sweep reaches `gravity.falloff`'s conclusion by
 * the same rules from a bigger premise pool, that agreement is evidence the pool did not
 * quietly break something. Dropped, the page would look like it had found twenty-six new
 * things and silently stopped reproducing the twenty it already knew.
 */
for (const c of candidates) c.asked = ASKED.get(c.subject);

/*
 * WHAT GOES ON THE TERMINAL IS WHAT THE PAGE SHOWS BY DEFAULT - restatements and
 * arithmetic over the tiling's counts hidden in both, or the two disagree about what was
 * found and the terminal is the one people read.
 */
const fresh = candidates.filter(c => !c.asked && !c.arithmetic);
console.log(`\n  ${cells.length} cells in ${((Date.now() - started) / 60000).toFixed(1)} ` +
  `minutes, ${candidates.length} derived laws, ${fresh.length} that no theorem asks for`);

const refound = coverage(cells).filter(c => c.state === "derived").length;
const open = conjectures(candidates);
console.log(`  ${candidates.filter(c => c.grade === "derived").length} stand only on ` +
  `runs, ${candidates.filter(c => c.grade === "conjectured").length} on a definition, ` +
  `${candidates.filter(c => c.grade === "assumed").length} on nothing but the vocabulary`);
console.log(`  ${refound} of the ${coverage(cells).length} handmade theorems refound, ` +
  `${open.length} assumptions still open\n`);
for (const c of open.slice(0, 6))
  console.log(`  waiting on ${plain(c.fact).slice(0, 60).padEnd(62)} ` +
    `(${c.leverage} statements, from ${c.from})`);
console.log();

const contradicting = candidates.filter(c => c.verdict.kind === "contradicts");
const recovering = candidates.filter(c => c.verdict.kind === "recovers");
const splitting = candidates.filter(c => c.splits.length);
console.log(`  ${recovering.length} recover a law in the corpus, ` +
  `${contradicting.length} contradict one, ${splitting.length} tell the theories apart\n`);

console.log("  the top of the pile:\n");
for (const c of fresh.slice(0, 12))
  console.log(`  ${(c.scores.total).toFixed(2)}  ${plain(c.line).slice(0, 96)}` +
    `\n        ${c.verdict.kind}${c.splits.length ? `, splits ${c.splits.length} ways` : ""}` +
    `, ${c.from.probes.length} probes, depth ${c.depth}, ${c.leaves} leaves`);

const saved: Saved = {
  swept: { theories: theories.map(t => t.name), geometries: sweep.map(g => g.name),
    regimes: regimes.map(r => r.name), N: String(arg("N") ?? "per lattice"), T, seeds },
  cells: cells.map(c => ({ under: c.under, closed: c.closed, nodes: c.store.nodes.size,
    concluded: c.concluded.length,
    probes: c.ran.map(r => ({ id: r.probe.id, holds: r.out.holds, found: r.out.found,
      failed: r.failed })) })),
  candidates, covered: coverage(cells), open: conjectures(candidates),
  weights: WEIGHTS, when: new Date().toISOString(),
};

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "discovered.json"), JSON.stringify(saved, null, 2));
writeFileSync(join(OUT, "index.html"),
  page(saved.candidates, saved.cells, saved.swept, saved.covered, saved.open));
writeFileSync(join(OUT, "README.md"), readme(saved.candidates, saved.swept));
console.log(`\n  written to theorems/discovered/`);
