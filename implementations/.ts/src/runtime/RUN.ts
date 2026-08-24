import { readFileSync, writeFileSync } from "fs";
import { fork } from "child_process";
import { cpus } from "os";
import {
  Any, Budget, currentBudget, Entry, matrix, Outcome, Report, runSuite, setBudget, Test,
} from "../lib/Report.ts";
import { G } from "../theories/G.ts";
import { G_XOR } from "../theories/G^XOR.ts";
import { G_XOR_2 } from "../theories/G^XOR*2.ts";
import { G_XOR_XOR } from "../theories/G^XOR+XOR.ts";
import { G_CONSERVING } from "../theories/G^CONSERVING.ts";
import acting from "../tests/acting.ts";
import ampere from "../tests/ampere.ts";
import anisotropy from "../tests/anisotropy.ts";
import automaton from "../tests/automaton.ts";
import benchmark from "../tests/benchmark.ts";
import binding from "../tests/binding.ts";
import bloch from "../tests/bloch.ts";
import ceiling from "../tests/ceiling.ts";
import chirality from "../tests/chirality.ts";
import coherence from "../tests/coherence.ts";
import conserving from "../tests/conserving.ts";
import continuity from "../tests/continuity.ts";
import cosmology from "../tests/cosmology.ts";
import current from "../tests/current.ts";
import dilation from "../tests/dilation.ts";
import discs from "../tests/discs.ts";
import drift from "../tests/drift.ts";
import eht from "../tests/eht.ts";
import electrostatics from "../tests/electrostatics.ts";
import emission from "../tests/emission.ts";
import exchange from "../tests/exchange.ts";
import geometry from "../tests/geometry.ts";
import gravity from "../tests/gravity.ts";
import harmony from "../tests/harmony.ts";
import induction from "../tests/induction.ts";
import kernel from "../tests/kernel.ts";
import layer2 from "../tests/layer2.ts";
import layers from "../tests/layers.ts";
import lorentz from "../tests/lorentz.ts";
import magnetic_laws from "../tests/magnetic-laws.ts";
import magnetism from "../tests/magnetism.ts";
import magnetostatics from "../tests/magnetostatics.ts";
import matter from "../tests/matter.ts";
import medium from "../tests/medium.ts";
import meeting from "../tests/meeting.ts";
import metric from "../tests/metric.ts";
import moments from "../tests/moments.ts";
import neel from "../tests/neel.ts";
import ordering from "../tests/ordering.ts";
import poles from "../tests/poles.ts";
import potentials from "../tests/potentials.ts";
import propulsion from "../tests/propulsion.ts";
import radiation from "../tests/radiation.ts";
import range from "../tests/range.ts";
import rar from "../tests/rar.ts";
import relaxation from "../tests/relaxation.ts";
import ring from "../tests/ring.ts";
import rotation from "../tests/rotation.ts";
import scale from "../tests/scale.ts";
import sourcing from "../tests/sourcing.ts";
import sparc from "../tests/sparc.ts";
import steering from "../tests/steering.ts";
import species from "../tests/species.ts";
import spin from "../tests/spin.ts";
import step from "../tests/step.ts";
import strand from "../tests/strand.ts";
import structures from "../tests/structures.ts";
import suppression from "../tests/suppression.ts";
import texture from "../tests/texture.ts";
import topology from "../tests/topology.ts";
import transport from "../tests/transport.ts";
import turn from "../tests/turn.ts";
import vacuum from "../tests/vacuum.ts";
import wander from "../tests/wander.ts";
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
const FILE = fileURLToPath(import.meta.url);

const ALL: Test[] = [...acting, ...ampere, ...anisotropy, ...automaton, ...benchmark, ...binding, ...bloch, ...ceiling, ...chirality, ...coherence, ...conserving, ...continuity, ...cosmology, ...current, ...dilation, ...discs, ...drift, ...eht, ...electrostatics, ...emission, ...exchange, ...geometry, ...gravity, ...harmony, ...induction, ...kernel, ...layer2, ...layers, ...lorentz, ...magnetic_laws, ...magnetism, ...magnetostatics, ...matter, ...medium, ...meeting, ...metric, ...moments, ...neel, ...ordering, ...poles, ...potentials, ...propulsion, ...radiation, ...range, ...rar, ...relaxation, ...ring, ...rotation, ...scale, ...sourcing, ...sparc, ...species, ...steering, ...spin, ...step, ...strand, ...structures, ...suppression, ...texture, ...topology, ...transport, ...turn, ...vacuum, ...wander];

const THEORIES: Record<string, Any> = {
  G, "G^XOR": G_XOR, "G^XOR*2": G_XOR_2, "G^XOR+XOR": G_XOR_XOR,
  "G^CONSERVING": G_CONSERVING,
};

const root = `${HERE}/../../../..`;
const REPORT = `${root}/REPORT.json`;
const TIMINGS = `${root}/TIMINGS.json`;

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
      /*
       * A WORKER GETS A REAL HEAP. This model is an object per ray rather than a slot
       * in a typed array, so a full-budget box is millions of live objects and the
       * default heap is not enough — measured, a worker died of it and took a quarter
       * of the suite with it.
       */
      const child = fork(FILE, [...args, "--worker"], {
        execArgv: ["--import", "tsx", `--max-old-space-size=${valueOf(args, "--heap") ?? 6144}`],
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
      /*
       * AND A WORKER THAT DIES IS A HOLE, NOT A LOST RUN. Whatever it had measured is
       * gone and says so; everything the other workers did is kept, and the queue is
       * still there for the next invocation to re-measure what is missing.
       */
      child.on("error", e => { console.log(`  !! worker ${i}: ${e}`); res(); });
      child.on("exit", c => {
        if (c !== 0) console.log(`  !! worker ${i} died (${c}) — its units are unmeasured`);
        res();
      });
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
