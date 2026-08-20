/**
 * IS THIS THE SAME MODEL — the port, measured against the article's own report.
 *
 *   tsx src/runtime/COMPARE.ts [filter…] [--all]
 *
 * The migrated claims were moved without being rewritten, so every finding recorded
 * here has a counterpart there, recorded by the same claim under the same name. This
 * puts the two side by side and says where they disagree.
 *
 * A PORT IS NOT FINISHED BECAUSE IT RUNS. It is finished when it produces the numbers
 * the thing it was ported from produced, and the only way to know that is to look.
 * What this cannot do is say which of the two is right where they differ — that is a
 * question about the model, and it is exactly the question worth being handed.
 */
import { readFileSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

/*
 * WHERE THIS FILE IS, ON EVERY NODE THIS RUNS ON.
 *
 * `import.meta.dirname` landed in Node 20.11. Before that it is not an error — it
 * is `undefined`, so a path built from it becomes the string "undefined/…" and the
 * failure surfaces somewhere else entirely as a bad path. `import.meta.url` has
 * always been there, so the directory is taken off it.
 */
const HERE = dirname(fileURLToPath(import.meta.url));

type Finding = { name: string; value: number | null };
type Entry = { id: string; findings: Finding[] };
type Report = { title?: string; entries: Entry[] };

const args = process.argv.slice(2);
const only = args.filter(a => !a.startsWith("--"));
const showAll = args.includes("--all");

const MINE = `${HERE}/../../../../REPORT.json`;
const THEIRS = process.env.ARTICLE ??
  "/home/fadi/Desktop/orbitmines/orbitmines.com/orbitmines.com/src/routes/Physics/REPORT.json";

const load = (p: string, what: string): Report => {
  try { return JSON.parse(readFileSync(p, "utf8")); }
  catch (e) { throw new Error(`could not read the ${what} report at ${p} — ${e}`); }
};

/*
 * A CLAIM IS KEYED BY WHAT IT MEASURED, not by which theory happened to run it: the
 * theories are named differently on the two sides — `gravity` there, `G` here — and a
 * finding is the same finding under either name.
 */
const claimOf = (id: string) => id.split(" · ")[0];

const num = (x: number | null | undefined) =>
  typeof x === "number" && Number.isFinite(x) ? x : NaN;

/** how far apart two numbers are, relative to the larger — 0 is agreement */
const apart = (a: number, b: number) => {
  if (!Number.isFinite(a) && !Number.isFinite(b)) return 0;
  if (!Number.isFinite(a) || !Number.isFinite(b)) return Infinity;
  const scale = Math.max(Math.abs(a), Math.abs(b));
  return scale < 1e-12 ? Math.abs(a - b) : Math.abs(a - b) / scale;
};

const index = (r: Report) => {
  const m = new Map<string, number>();
  for (const e of r.entries)
    for (const f of e.findings) m.set(`${claimOf(e.id)}\t${f.name}`, num(f.value));
  return m;
};

const mine = load(MINE, "ported");
const theirs = load(THEIRS, "article's");
const A = index(mine), B = index(theirs);

const rows = [...A.keys()]
  .filter(k => B.has(k))
  .filter(k => !only.length || only.some(s => k.includes(s)))
  .map(k => {
    const [id, name] = k.split("\t");
    return { id, name, mine: A.get(k)!, theirs: B.get(k)!, by: apart(A.get(k)!, B.get(k)!) };
  })
  .sort((a, b) => b.by - a.by);

const AGREES = 0.05;
const agree = rows.filter(r => r.by <= AGREES);
const differ = rows.filter(r => r.by > AGREES);
const onlyMine = [...A.keys()].filter(k => !B.has(k)).length;
const onlyTheirs = [...B.keys()].filter(k => !A.has(k)).length;

console.log(`\n═════ the port against the article ═════\n`);
console.log(`  ${rows.length} findings recorded by both`);
console.log(`  ${agree.length} agree to within ${(100 * AGREES).toFixed(0)}%`);
console.log(`  ${differ.length} differ`);
console.log(`  ${onlyMine} only here · ${onlyTheirs} only there — claims one side has not run\n`);

const show = (list: typeof rows, title: string) => {
  if (!list.length) return;
  console.log(`═════ ${title} ═════\n`);
  const w = 52;
  console.log(`  ${"claim · finding".padEnd(w)} ${"here".padStart(11)}  ${"article".padStart(11)}\n`);
  for (const r of list.slice(0, showAll ? list.length : 40)) {
    const label = `${r.id} · ${r.name}`;
    const fmt = (x: number) => Number.isFinite(x) ? x.toExponential(3) : "—";
    console.log(`  ${(label.length > w ? label.slice(0, w - 1) + "…" : label).padEnd(w)} ` +
      `${fmt(r.mine).padStart(11)}  ${fmt(r.theirs).padStart(11)}   ` +
      `${r.by === Infinity ? "one side did not resolve" : (100 * r.by).toFixed(1) + "%"}`);
  }
  if (!showAll && list.length > 40) console.log(`  … and ${list.length - 40} more (--all)`);
  console.log();
};

show(differ, `${differ.length} that disagree`);
if (showAll) show(agree, `${agree.length} that agree`);
