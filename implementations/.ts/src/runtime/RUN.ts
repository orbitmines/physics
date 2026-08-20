import { readFileSync, writeFileSync } from "fs";
import { fork } from "child_process";
import { createRequire } from "module";
import { cpus } from "os";
import { dirname } from "path";
import { fileURLToPath } from "url";
import {
  Any, Budget, currentBudget, Entry, matrix, Outcome, Report, runSuite, setBudget, Test,
} from "../lib/Report.ts";
import { G } from "../theories/G.ts";
import { G_XOR } from "../theories/G^XOR.ts";
import { G_XOR_2 } from "../theories/G^XOR*2.ts";

const ALL: Test[] = [];

const THEORIES: Record<string, Any> = { G, "G^XOR": G_XOR, "G^XOR*2": G_XOR_2 };

const self = fileURLToPath(import.meta.url);
const root = `${dirname(self)}/../../../..`;
const REPORT = `${root}/REPORT.json`;
const TIMINGS = `${root}/TIMINGS.json`;
const tsx = createRequire(import.meta.url).resolve("tsx/cli");

const valueOf = (args: string[], flag: string) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};

type Partial = { entries: Entry[]; outcomes: Outcome[] };

const runShard = async (
  args: string[], only: string[], shard?: { index: number; total: number },
) => {
  let waiting: ((i: number | null) => void) | undefined;
  if (!shard) process.on("message", (m: any) => {
    if (m?.kind === "unit") { const f = waiting; waiting = undefined; f?.(m.index ?? null); }
  });
  const take = () => new Promise<number | null>(res => {
    waiting = res;
    process.send?.({ kind: "take" });
  });

  const { report, outcomes } = await runSuite(ALL, THEORIES, {
    title: "@orbitmines/physics", only, quiet: true, shard,
    take: shard ? undefined : take,
    onUnit: u => process.send?.({ kind: "unit", ...u }),
  });
  process.send?.({ kind: "done", entries: report.entries, outcomes } satisfies
    { kind: string } & Partial, undefined, undefined, () => process.disconnect?.());
};

(async () => {
  const args = process.argv.slice(2);
  const tier: Budget = args.includes("--quick") ? "quick"
    : args.includes("--normal") ? "normal" : "full";
  setBudget(tier);
  const only = args.filter(a => !a.startsWith("--") && !/^\d+$/.test(a) &&
    args[args.indexOf(a) - 1] !== "--jobs" && args[args.indexOf(a) - 1] !== "--shard");

  const shardArg = valueOf(args, "--shard");
  if (shardArg) {
    const [index, total] = shardArg.split("/").map(Number);
    await runShard(args, only, { index, total });
    return;
  }
  if (args.includes("--worker")) { await runShard(args, only); return; }

  const chosen = ALL.filter(t => !only.length || only.some(k => t.id.includes(k)));
  const unitsList = chosen.flatMap(t => Object.keys(t.under).map(name => `${t.id} · ${name}`));
  const units = unitsList.length;
  const jobs = Math.max(1, Math.min(
    Number(valueOf(args, "--jobs") ?? cpus().length), units));

  let timings: Record<string, number> = {};
  try { timings = JSON.parse(readFileSync(TIMINGS, "utf8")); } catch { /* first run */ }

  const TIERS: Budget[] = ["full", "normal", "quick"];
  const cost = (u: string) => {
    for (const t of TIERS) {
      const v = timings[`${t} · ${u}`];
      if (v !== undefined) return v;
    }
    return Infinity;
  };
  const queue = unitsList.map((_, i) => i).sort((a, b) => cost(unitsList[b]) - cost(unitsList[a]));

  console.log(`\n═════ ${only.length ? `running ${only.join(", ")}` : "running everything"}` +
    ` · ${currentBudget()} · ${units} unit${units === 1 ? "" : "s"}` +
    `${jobs > 1 ? ` across ${jobs} processes` : ""} ═════\n`);

  const collected: Partial = { entries: [], outcomes: [] };
  const measured: Record<string, number> = {};
  if (units && jobs > 1) {
    let done = 0;
    await Promise.all(Array.from({ length: jobs }, (_, i) => new Promise<void>((res, rej) => {
      const child = fork(self, [...args, "--worker"], {
        execPath: tsx,
        stdio: ["ignore", "inherit", "inherit", "ipc"],
      });
      child.on("message", (m: any) => {
        if (m.kind === "take") child.send({ kind: "unit", index: queue.shift() ?? null });
        else if (m.kind === "unit") {
          measured[`${tier} · ${m.id} · ${m.theory}`] = m.seconds;
          console.log(`  [${++done}/${units}] ${m.id} · ${m.theory} … ` +
            `${m.seconds.toFixed(1)}s  ${m.status}`);
        }
        else if (m.kind === "done") {
          collected.entries.push(...m.entries);
          collected.outcomes.push(...m.outcomes);
        }
      });
      child.on("error", rej);
      child.on("exit", c => c === 0 ? res() : rej(new Error(`worker ${i} exited ${c}`)));
    })));
    try {
      writeFileSync(TIMINGS, JSON.stringify({ ...timings, ...measured }, null, 2));
    } catch { /* a cache that cannot be written is a slower next run, nothing more */ }
  } else {
    const r = await runSuite(ALL, THEORIES, { title: "@orbitmines/physics", only });
    collected.entries.push(...r.report.entries);
    collected.outcomes.push(...r.outcomes);
  }

  const report = new Report("@orbitmines/physics");
  report.entries = collected.entries.sort((a, b) => a.id.localeCompare(b.id));
  const outcomes = collected.outcomes.sort((a, b) =>
    a.id.localeCompare(b.id) || a.theory.localeCompare(b.theory));

  await report.write(json => {
    const fresh = JSON.parse(json) as { entries: { id: string }[] };
    let merged = fresh;
    let prior: typeof fresh | undefined;
    try {
      prior = JSON.parse(readFileSync(REPORT, "utf8")) as typeof fresh;
      const ids = new Set(fresh.entries.map(e => e.id));
      merged = {
        ...fresh,
        entries: [...prior.entries.filter(e => !ids.has(e.id)), ...fresh.entries]
          .sort((a, b) => a.id.localeCompare(b.id)),
      };
    } catch (err) {
      const missing = (err as NodeJS.ErrnoException)?.code === "ENOENT";
      console.log(missing
        ? "\n  no prior REPORT.json — this run is the whole report"
        : `\n  !! COULD NOT READ THE PRIOR REPORT — ${err}\n` +
          "     Everything not re-run in this invocation is about to be dropped.");
    }

    if (prior && merged.entries.length < prior.entries.length) {
      console.log(`\n  !! REFUSING TO WRITE: the merge came to ${merged.entries.length} ` +
        `entries where the file already holds ${prior.entries.length}.\n` +
        "     REPORT.json is unchanged. Re-run without a filter, or with every id you " +
        "meant to re-measure\n     in a single invocation.");
      return;
    }

    writeFileSync(REPORT, JSON.stringify(merged, null, 2));
    const kept = merged.entries.length - fresh.entries.length;
    if (kept > 0) console.log(`\n  ${fresh.entries.length} entries written, ${kept} kept from earlier runs`);
  });
  report.print();

  const m = matrix(outcomes);
  if (m.rows.length) {
    console.log(`\n═════ what holds where ═════\n`);
    const w = Math.max(...m.rows.map(r => String(r[0]).length)) + 2;
    console.log("  " + "".padEnd(w) + m.columns.slice(1).map(c => c.padEnd(20)).join(""));
    for (const r of m.rows)
      console.log("  " + String(r[0]).padEnd(w) + r.slice(1).map(c => String(c).padEnd(20)).join(""));
  }

  const wrong = outcomes.filter(o => !o.asDeclared);
  const soft = outcomes.filter(o => o.provisional);
  console.log(`\n═════ ${wrong.length} claim${wrong.length === 1 ? "" : "s"} did not do what was declared ═════`);
  for (const o of wrong) {
    console.log(`  ${o.id} · ${o.theory}: declared "${o.declared}"`);
    for (const f of o.outside)
      console.log(`      ${f.name}: ` +
        `${Number.isFinite(f.value) ? f.value.toExponential(3) : "—"} ` +
        (f.verdict === "unresolved" ? "DID NOT RESOLVE"
          : `${f.verdict} by ${(100 * (f.by ?? 0)).toFixed(1)}%`));
  }
  if (soft.length) {
    console.log(`\n  and ${soft.length} unresolved at this budget — re-run without --quick before` +
      ` reading anything into them:`);
    for (const o of soft)
      console.log(`      ${o.id} · ${o.theory}: ${o.outside.map(f => f.name).join(", ")}`);
  }
  console.log(`\nwritten to REPORT.json\n`);
})();
