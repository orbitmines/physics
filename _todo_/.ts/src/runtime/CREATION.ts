/**
 * THE CREATION SWEEP — every way a sideways meeting could make a sign, run, and scored
 * against the ledger.
 *
 * WHAT IS BEING ASKED. `G^XOR^c` has one creation rule and it makes POLARITY: a charge is
 * bent by a polarity field and the corner throws off a signed ray. There is no rule
 * anywhere in the model that makes CHARGE — every charge came out of (G/2)'s draw, so
 * charge is a boundary condition and not a phenomenon. `G^XOR^q` enumerates the seventy-two
 * ways a corner could be told to sign what it throws off, and this runs them.
 *
 * SCORED AGAINST THE LEDGER AND NOT AGAINST A HUNCH. `tests/ledger.ts` already says what a
 * charge in the world does — it is small, it does not track mass, it is not the magnetic
 * sign, and the net of it over everything is nought. Those are four probes with four bands
 * and they are the same four whatever rule is being run, which is what makes this a
 * comparison rather than seventy-two separate stories. Two more come with them because a
 * rule that buys charge by killing the vacuum has bought nothing: matter must stay a
 * minority of the world, and the structures must still be structures.
 *
 * THE CONTROL IS RUN FIRST AND IS THE FILE AS WRITTEN. A permutation that does not beat
 * `creates: null` is not an improvement, and the default has to be measured under exactly
 * the same budget as the candidates or the comparison is with a memory.
 *
 *   npm run creation              the 32 candidates and the control
 *   npm run creation -- --all     all 72, including the 24 that cannot make a charge at all
 *   npm run creation -- --ticks 60 --seeds 3
 */

import { writeFileSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { G_XOR_C } from "../theories/G^XOR^c.ts";
import { G_XOR_O } from "../theories/G^XOR^o.ts";
import {
  ANTI, CANDIDATES, Creation, CREATIONS, CURRENT, nameOf, withCreation,
} from "../theories/G^XOR^q.ts";
import { Reading, readingOf } from "../tests/ledger.ts";
/* the scorer lives in `SCORE.ts` so that a second sweep can read it without running this
 * one - see the note at the top of that file */
import { Score, scoreOf } from "./SCORE.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const arg = (flag: string, fallback: number) => {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? Number(process.argv[i + 1]) : fallback;
};

const TICKS = arg("--ticks", 40);
const SEEDS = arg("--seeds", 2);
/*
 * AND THE WORLD IS KEPT SMALL, WHICH IS A SWEEP DECISION AND NOT A PHYSICS ONE.
 *
 * A creation rule that puts charge into the world puts STEERING into it — more charge is
 * more turning, more turning is more corners, and a corner both radiates and folds. Some of
 * these seventy-two are therefore fires in the sense `TURNING`'s own note means: a rule that
 * makes more of what triggers it. Left unbounded the slow ones dominate the wall clock and
 * the sweep never finishes, which is what happened the first time it was run.
 *
 * THE CAP IS NOT A FIX FOR THAT — it is what makes the runaway MEASURABLE. Every rule gets
 * the same box, so a rule that fills it is a rule that filled a box the others did not, and
 * `matter` in the table says so. A rule scoring well because it ran out of room is caught by
 * the `alive` veto rather than by being allowed to run for an hour first.
 */
const BOUND = arg("--bound", 4000);
const ALL = process.argv.includes("--all");
/*
 * WHICH THEORY THE CORNER BELONGS TO. `G^XOR^c` folds at a corner and `G^XOR^o` only shines
 * at one, and the eighty-four rules are about the same moment in both — so the sweep is the
 * same sweep and the theory is a setting rather than a second file.
 */
const ORBIT = process.argv.includes("--orbit");
const BASE = ORBIT ? G_XOR_O : G_XOR_C;
const MATTER = ORBIT ? "turning" as const : "held" as const;

const run = (c: Creation | null): Score => {
  const theory = c ? withCreation(BASE, c) : BASE;
  const rs: Reading[] = [];
  for (let i = 0; i < SEEDS; i++)
    rs.push(readingOf(theory, { seed: 1 + i, ticks: TICKS, bound: BOUND, matter: MATTER }));
  return scoreOf(rs);
};

const num = (x: number, d = 2) => Number.isFinite(x) ? x.toFixed(d) : "—";

(async () => {
  const list = ALL ? CREATIONS : CANDIDATES;
  console.log(`\n═════ creation sweep · ${list.length} rules + the control · ` +
    `${TICKS} ticks · ${SEEDS} seed${SEEDS > 1 ? "s" : ""} · bound ${BOUND} ═════\n`);
  console.log(`  the control is \`${BASE.name}\` as written: the recoil inherits the turning`);
  console.log("  ray's own signs, so a corner can only make more of what turned.\n");

  const rows: { name: string; c: Creation | null; s: Score }[] = [];

  const took = (name: string, c: Creation | null) => {
    const t0 = Date.now();
    const s = run(c);
    rows.push({ name, c, s });
    console.log(`  ${name.padEnd(38)} ${s.fires ? `q made ${String(Math.round(s.made)).padStart(6)}` : "never fired  "}` +
      `  |q| ${num(s.qMax, 1).padStart(6)}  score ${num(s.total, 3)}` +
      `  ${s.why.padEnd(18)}${((Date.now() - t0) / 1000).toFixed(1)}s`);
  };

  took("CONTROL — as written", null);
  took(`ANTI — ${nameOf(ANTI)}`, ANTI);
  for (const c of list) {
    /* the identity is the control and does not need running twice */
    if (JSON.stringify(c) === JSON.stringify(CURRENT)) continue;
    took(nameOf(c), c);
  }

  const scored = rows.filter(r => r.s.fires || r.c === null)
    .sort((a, b) => (b.s.total || 0) - (a.s.total || 0));

  console.log(`\n═════ smallest charge, whatever else it did ═════\n`);
  const byQ = rows.filter(r => r.s.fires).sort((a, b) => a.s.qMax - b.s.qMax).slice(0, 8);
  for (const r of byQ)
    console.log(`  |q| ${num(r.s.qMax, 1).padStart(6)}  ${r.name.padEnd(40)}${r.s.why}`);
  console.log("\n  matter's answer is 1, and this project's documented failure is 27. A rule");
  console.log("  here with a small |q| and a veto against it is a rule to look at, not one");
  console.log("  to discard — the veto is about the VACUUM and is a separate problem.\n");

  console.log(`\n═════ what beat the control ═════\n`);
  const control = rows.find(r => r.c === null)!;
  const better = scored.filter(r => r.c !== null && r.s.total > control.s.total);
  if (!better.length) console.log("  NOTHING. Every rule that fired scored at or below the " +
    "file as written, which is a result: the question is open and none of these seventy-two " +
    "answers it.\n");

  const cols = ["rule", "q made", "|q|", "corr(q,m)", "corr(q,p)", "net", "matter", "surf", "parts", "score", "asked", "why"];
  const table = scored.slice(0, 20).map(r => [
    r.name, Math.round(r.s.made), num(r.s.qMax, 1), num(r.s.qCorr), num(r.s.qP),
    num(r.s.net), num(r.s.matter), num(r.s.surface), Math.round(r.s.structures),
    num(r.s.total, 3), `${r.s.asked}/4`, r.s.why,
  ]);
  const w = cols.map((c, i) => Math.max(c.length, ...table.map(t => String(t[i]).length)) + 2);
  console.log("  " + cols.map((c, i) => c.padEnd(w[i])).join(""));
  for (const t of table) console.log("  " + t.map((x, i) => String(x).padEnd(w[i])).join(""));

  const out = `${HERE}/../../../../CREATION.json`;
  writeFileSync(out, JSON.stringify({
    generated: new Date().toISOString(), ticks: TICKS, seeds: SEEDS,
    scored: scored.map(r => ({ name: r.name, rule: r.c, ...r.s })),
  }, null, 2));
  console.log(`\n  written to CREATION.json\n`);
})();
