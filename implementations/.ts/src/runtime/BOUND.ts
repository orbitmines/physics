/**
 * WHAT BOUNDS A CHARGE — the six ideas, run against the rules that make one.
 *
 * WHERE THIS PICKS UP. `npm run creation` sweeps the eighty-four ways a corner could sign
 * what it throws off, and it works: a dozen rules beat the file as written, the top of the
 * table is `product` and `anti-product` — the XOR itself, applied to CREATION rather than
 * to MEETING — and the `why` column is a dash all the way down. Charge is made by a local
 * rule, it does not track mass, it is not the polarity wearing a hat, the world is neutral,
 * and matter still runs. Four of the five criteria `G^XOR^q` declared in advance, met.
 *
 * ONE NUMBER IS LEFT AND IT IS `small`. |q| tops out around five or six where matter's own
 * answer is one. That is a factor of a few rather than a factor of ten, which is why the
 * next move is not more permutations: it is a BOUND.
 *
 * AND THE BOUNDS ARE ALREADY WRITTEN. `G^XOR^c`'s `IDEAS` block holds six of them, every
 * one a question about ONE POINT and what is at it, which is the only kind of question this
 * model allows anywhere:
 *
 *   qCancel     opposites cancel where they are HELD TOGETHER — two things folded into one
 *               point are as close as anything gets, and nothing has ever let them meet
 *   qCap        a point holds one unit and no more — capacity is a property of a PLACE, so
 *               charge is bounded by how many places a thing has rather than by contents
 *   qExclusion  Pauli, for charge: two alike may not sit on an axis and its opposite
 *   qDiffuse    it spreads to where there is less of it, so opposites are carried into
 *               each other's reach instead of sitting apart inside one aggregate for ever
 *   qImplode    the collapse carries it off — a fold destroys space and what it destroyed
 *               was carrying something
 *   qSurface    only the surface counts, which is why a bigger conductor is not a more
 *               charged one
 *
 * NONE OF THEM HAS EVER BEEN RUN AGAINST A RULE THAT MAKES CHARGE. They were measured in a
 * world where charge came only from (G/2)'s draw — `creates: null` — which is the one
 * configuration the creation sweep has now beaten. So the grid is the two together, and the
 * whole point is that neither half has been asked in the presence of the other.
 *
 * WHAT WOULD COUNT AS AN ANSWER, WRITTEN DOWN BEFORE IT RUNS, so a run cannot be read into
 * agreement afterwards. `small` has to come up WITHOUT `made` collapsing and WITHOUT
 * `alive` going. Five of the six ideas bound |q| by REMOVING charge, so a rule that gets
 * |q| to one by zeroing most of the charge in the world will show up as `made` falling and
 * `neutral` improving for the wrong reason — and both are already in the scorer, which is
 * why the scorer is shared rather than rewritten here.
 *
 * AND A PREDICTION, for the same reason. `qCap` is the one to expect and the one to trust
 * least: "a point holds one unit and no more" bounds |q| by the number of PLACES, which is
 * exactly the shape the problem wants, but it does it by fiat at the point and will hit
 * `small` at or near 1 almost by construction. The interesting result is `qCancel` or
 * `qDiffuse` doing it, because those bound charge by letting opposites MEET — the model's
 * own idiom, and the same mechanism `charge.attraction` derives the sign law from.
 *
 *   npm run bound                  the product family and the control, each against the six
 *   npm run bound -- --all         every candidate the creation sweep scores
 *   npm run bound -- --ticks 70 --seeds 2
 */

import { writeFileSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { G_XOR_C, IDEAS } from "../theories/G^XOR^c.ts";
import {
  CANDIDATES, Creation, CURRENT, nameOf, withCreation,
} from "../theories/G^XOR^q.ts";
import { Reading, readingOf } from "../tests/ledger.ts";
import { Score, scoreOf } from "./SCORE.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const arg = (flag: string, fallback: number) => {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? Number(process.argv[i + 1]) : fallback;
};

const TICKS = arg("--ticks", 40);
const SEEDS = arg("--seeds", 2);
const BOUND = arg("--bound", 4000);
const ALL = process.argv.includes("--all");

/** the six, plus the one that is none of them — the control arm of this axis */
const IDEA_NAMES = [
  "none", "qCancel", "qCap", "qExclusion", "qDiffuse", "qImplode", "qSurface",
] as const;
type Idea = typeof IDEA_NAMES[number];

const cfgFor = (i: Idea) => i === "none" ? {} : { [i]: true };

/**
 * WHICH CREATION RULES GO IN, AND WHY THEY ARE NOT READ OFF `CREATION.json`.
 *
 * The obvious thing is to take the winners the creation sweep already found. It is the
 * wrong thing: that file is written against whatever the theory was when it ran, and the
 * theory moves. Measured, on the day this was written, `MOVING` changed from a rule over
 * flood-filled structures to a rule over basins and the relaxation came out of the default
 * build — both of which change how many structures there are, which is what every ledger
 * criterion is computed over. A grid that inherited a stale ranking would be testing bounds
 * against rules that are no longer the winners.
 *
 * SO THE FAMILY IS NAMED BY ITS SHAPE RATHER THAN BY ITS RANK. `product` and
 * `anti-product` are what the creation sweep found at the top and what
 * `charge.attraction` gives a reason to expect — the force law IS the XOR of two signs, so
 * a creation rule that signs by the XOR of two signs is the same operation applied to
 * making rather than to meeting. That is a claim about the shape of the rule and it
 * survives a reshuffle; a rank does not.
 */
const FAMILY = CANDIDATES.filter(c =>
  c.emits === "product" || c.emits === "anti-product");

const list: (Creation | null)[] = [null, ...(ALL ? CANDIDATES : FAMILY)];

const run = (c: Creation | null, idea: Idea): Score => {
  const base = c ? withCreation(G_XOR_C, c) : G_XOR_C;
  const theory = idea === "none" ? base : IDEAS(base.copy(), cfgFor(idea));
  const rs: Reading[] = [];
  for (let i = 0; i < SEEDS; i++)
    rs.push(readingOf(theory, { seed: 1 + i, ticks: TICKS, bound: BOUND }));
  return scoreOf(rs);
};

const num = (x: number, d = 2) => Number.isFinite(x) ? x.toFixed(d) : "—";

(async () => {
  console.log(`\n═════ bound sweep · ${list.length} creation rules × ` +
    `${IDEA_NAMES.length} bounds · ${TICKS} ticks · ${SEEDS} seed` +
    `${SEEDS > 1 ? "s" : ""} · bound ${BOUND} ═════\n`);
  console.log("  `none` is the control on the bound axis and `CONTROL` on the creation");
  console.log("  axis, so the top-left cell is `G^XOR^c` exactly as it ships.\n");

  const rows: { rule: string; c: Creation | null; idea: Idea; s: Score }[] = [];

  for (const c of list) {
    const rule = c === null ? "CONTROL — as written"
      : JSON.stringify(c) === JSON.stringify(CURRENT) ? `${nameOf(c)} (= control)`
      : nameOf(c);
    for (const idea of IDEA_NAMES) {
      const t0 = Date.now();
      const s = run(c, idea);
      rows.push({ rule, c, idea, s });
      console.log(`  ${rule.padEnd(38)} ${idea.padEnd(11)}` +
        ` |q| ${num(s.qMax, 1).padStart(5)}  made ${String(Math.round(s.made)).padStart(6)}` +
        `  small ${num(s.small, 3)}  score ${num(s.total, 3)}  ${s.why.padEnd(18)}` +
        `${((Date.now() - t0) / 1000).toFixed(1)}s`);
    }
  }

  /*
   * WHAT THE TABLE IS SORTED ON, and it is not the total.
   *
   * The total already scores five things and `small` is one of them, so ranking on it
   * hides the one axis this sweep exists to move. What is wanted is the rules that got |q|
   * DOWN and kept everything else, so the sort is `small` first and the total as the
   * tie-break - and `made` and `alive` are in the table beside it, because a bound that
   * works by emptying the world is the failure mode this whole file is guarding against.
   */
  const scored = rows.filter(r => r.s.fires || r.c === null)
    .sort((a, b) => (b.s.small || 0) - (a.s.small || 0) ||
      (b.s.total || 0) - (a.s.total || 0));

  const base = rows.find(r => r.c === null && r.idea === "none")!;
  console.log(`\n═════ the file as it ships ═════\n`);
  console.log(`  |q| ${num(base.s.qMax, 1)}  small ${num(base.s.small, 3)}  ` +
    `made ${Math.round(base.s.made)}  score ${num(base.s.total, 3)}  ${base.s.why}\n`);

  console.log(`═════ what got |q| down, and what it cost ═════\n`);
  const cols = ["rule", "bound", "|q|", "small", "q made", "corr(q,m)", "corr(q,p)",
    "net", "matter", "parts", "alive", "score", "why"];
  const table = scored.slice(0, 24).map(r => [
    r.rule, r.idea, num(r.s.qMax, 1), num(r.s.small, 3), Math.round(r.s.made),
    num(r.s.qCorr), num(r.s.qP), num(r.s.net), num(r.s.matter),
    Math.round(r.s.structures), r.s.alive, num(r.s.total, 3), r.s.why,
  ]);
  const w = cols.map((c, i) => Math.max(c.length, ...table.map(t => String(t[i]).length)) + 2);
  console.log("  " + cols.map((c, i) => c.padEnd(w[i])).join(""));
  for (const t of table) console.log("  " + t.map((x, i) => String(x).padEnd(w[i])).join(""));

  /*
   * AND THE BOUND AXIS ON ITS OWN, averaged over the rules it was run against - because
   * the question "does this bound work" is about the bound and not about which creation
   * rule happened to be under it, and one cell of a grid cannot tell those apart.
   */
  console.log(`\n═════ each bound, averaged over the rules it was run against ═════\n`);
  const mean = (xs: number[]) => {
    const ok = xs.filter(Number.isFinite);
    return ok.length ? ok.reduce((a, b) => a + b, 0) / ok.length : NaN;
  };
  for (const idea of IDEA_NAMES) {
    const of = rows.filter(r => r.idea === idea && (r.s.fires || r.c === null));
    if (!of.length) continue;
    console.log(`  ${idea.padEnd(12)} |q| ${num(mean(of.map(r => r.s.qMax)), 1).padStart(5)}` +
      `  small ${num(mean(of.map(r => r.s.small)), 3)}` +
      `  made ${String(Math.round(mean(of.map(r => r.s.made)))).padStart(6)}` +
      `  alive ${num(mean(of.map(r => r.s.alive)), 2)}` +
      `  score ${num(mean(of.map(r => r.s.total)), 3)}`);
  }
  console.log("\n  A bound that moves `small` while `made` holds and `alive` stays at 1 is");
  console.log("  the answer. One that moves `small` by dropping `made` has bounded the");
  console.log("  charge by removing it, which is the question restated.\n");

  writeFileSync(`${HERE}/../../../../BOUND.json`, JSON.stringify({
    generated: new Date().toISOString(), ticks: TICKS, seeds: SEEDS, bound: BOUND,
    scored: rows.map(r => ({ rule: r.rule, creation: r.c, bound: r.idea, ...r.s })),
  }, null, 2) + "\n");
  console.log(`  written to BOUND.json\n`);
})();
