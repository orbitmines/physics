/**
 * ONE CELL, EVERYTHING ABOUT IT - the diagnostic, kept because a full sweep is half an
 * hour and most questions are about one theory on one lattice.
 *
 *   npx tsx src/theorems/discovery/PEEK.ts --theory G --geometry fcc-12
 */
import { GEOMETRIES } from "../../lib/Local.ts";
import { G } from "../../theories/G.ts";
import { G_XOR } from "../../theories/G^XOR.ts";
import { G_XOR_2 } from "../../theories/G^XOR*2.ts";
import { G_CONSERVING } from "../../theories/G^CONSERVING.ts";
import { LADDER, Lab } from "../Probe.ts";
import { REGIMES } from "../theorems/transport.ts";
import { GENERIC, harvest } from "./Harvest.ts";
import { rank } from "./Rank.ts";
import { coverage } from "./Coverage.ts";
import { conjectures } from "./Conjectures.ts";

const THEORIES: Record<string, any> = {
  G, "G^XOR": G_XOR, "G^XOR*2": G_XOR_2, "G^CONSERVING": G_CONSERVING };
const arg = (n: string, d?: string) => {
  const i = process.argv.indexOf(`--${n}`);
  return i > 0 ? process.argv[i + 1] : d;
};
const plain = (s: string) => s
  .replace(/\\bar\{([^{}]*)\}/g, "$1_").replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, "($1)/($2)")
  .replace(/\^\{([^{}]*)\}/g, "^($1)").replace(/_\{([^{}]*)\}/g, "_$1");

const g = GEOMETRIES[arg("geometry", "fcc-12")!];
const theory = THEORIES[arg("theory", "G")!];
const boxFor = (x: { D: number }) => (x.D === 1 ? 61 : x.D === 2 ? 41 : 21);
const lab: Lab = { theory, geometry: g, N: boxFor(g), T: Number(arg("T", "120")),
  seeds: [1], ladder: LADDER, boxFor, regime: REGIMES[0], say: () => {} };

const t0 = Date.now();
const cell = harvest(lab);
console.log(`${theory.name} on ${g.name}: ${cell.store.nodes.size} facts, ` +
  `${cell.concluded.length} statements, closed=${cell.closed}, ` +
  `${((Date.now() - t0) / 1000).toFixed(1)}s\n`);

console.log("the probes that serve no theorem:");
for (const p of GENERIC) {
  const r = cell.ran.find(x => x.probe.id === p.id);
  console.log(`  ${p.id}`);
  console.log(`     ${r?.failed ? `FAILED ${r.failed}` : plain(r?.out.found ?? "did not run")}`);
  console.log(`     stood behind ${r?.out.facts.length ?? 0} premises`);
}

const cands = rank([cell]);
const grades = cands.reduce((a, c) => ({ ...a, [c.grade]: (a[c.grade] ?? 0) + 1 }),
  {} as Record<string, number>);
console.log(`\n${cands.length} derived statements: ${JSON.stringify(grades)}`);

console.log("\ncoverage of the handmade theorems:");
for (const c of coverage([cell]))
  console.log(`  ${c.theorem.padEnd(24)} ${c.state.padEnd(14)}` +
    `${c.agrees === true ? " (probe and proof agree)" : ""} ${plain(c.line ?? "")}`.slice(0, 118));

console.log("\nwhat is still being taken on trust, most leverage first:");
for (const c of conjectures(cands).slice(0, 8)) {
  console.log(`  ${plain(c.fact)}`);
  console.log(`     from ${c.from}, blocking ${c.leverage}: ` +
    c.blocks.map(b => b.subject).join(", "));
  if (c.measurable) console.log(`     to settle it: ${c.measurable}`.slice(0, 150));
}
