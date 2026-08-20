import { Theory } from "./Theory.ts";

export type Any = Theory<any, any, any, any, any, any>;

export type Stat = { mean: number; err: number; n: number; saturated: boolean };

export const stat = (v: number[]): Stat => {
  const n = v.length;
  const mean = v.reduce((a, b) => a + b, 0) / n;
  const sd = Math.sqrt(v.reduce((a, b) => a + (b - mean) ** 2, 0) / Math.max(n - 1, 1));
  return { mean, err: sd / Math.sqrt(n), n, saturated: n > 1 && sd === 0 };
};

export type Header = {
  theory: string;
  geometry: string;
  D: number;
  DEG: number;
  N: number;
  backend: string;
  locals: number;
  rays: number;
  layers: string[];
  ticks: number;
  seeds: number[];
};

export const headerOf = (w: any, theory: string, seeds: number[] = []): Header => {
  const locals = [...w.backend];
  return {
    theory,
    geometry: w.geometry?.name ?? w.global?.name ?? "—",
    D: w.geometry?.D ?? 0,
    DEG: w.global?.DEG ?? 0,
    N: w.N ?? 0,
    backend: w.backend.constructor.name,
    locals: locals.length,
    rays: locals.reduce((n: number, l: any) => n + l.rays.length, 0),
    layers: Object.keys(w.layers),
    ticks: w.ticks ?? 0,
    seeds,
  };
};

export type Expectation = {
  of: string;
  want: number;
  tolerance?: number;
  atLeast?: number;
  atMost?: number;
  because: string;
};

export type Finding = {
  name: string;
  value: number;
  err?: number;
  units?: string;
  expect?: Expectation;
  verdict?: "within" | "above" | "below" | "unresolved" | "saturated";
  by?: number;
  note?: string;
};

export type Entry = {
  id: string;
  what: string;
  header: Header;
  findings: Finding[];
  table?: { columns: string[]; rows: (string | number)[][] };
  at: string;
};

export const judge = (f: Finding): Finding => {
  if (!f.expect) return f;
  const { want, tolerance, atLeast, atMost } = f.expect;

  if (!Number.isFinite(f.value)) return { ...f, verdict: "unresolved", by: undefined };

  if (atLeast !== undefined || atMost !== undefined) {
    const lo = atLeast ?? -Infinity, hi = atMost ?? Infinity;
    const ok = f.value >= lo && f.value <= hi;
    const miss = f.value < lo ? lo - f.value : f.value - hi;
    const scale = Math.max(Math.abs(lo === -Infinity ? hi : lo), 1e-12);
    return { ...f, by: ok ? 0 : miss / scale, verdict: ok ? "within" : f.value < lo ? "below" : "above" };
  }

  if (tolerance === undefined) throw new Error(
    `"${f.name}" has an expectation with neither a tolerance nor a bound. Give it a band, ` +
    `an atLeast/atMost, or no expectation at all.`);

  if (Math.abs(want) > 1e-12 && tolerance >= 1) throw new Error(
    `"${f.name}" wants ${want} within a relative tolerance of ${tolerance}, which admits ` +
    `zero — a measurement that found nothing at all would pass it. If the claim is about a ` +
    `sign or an order of magnitude, say so with atLeast/atMost; if there is no expectation, ` +
    `drop it and keep the note.`);

  const d = f.value - want;
  const rel = Math.abs(want) > 1e-12 ? Math.abs(d) / Math.abs(want) : Math.abs(d);
  return { ...f, by: rel, verdict: rel <= tolerance ? "within" : d > 0 ? "above" : "below" };
};

export class Report {
  entries: Entry[] = [];
  constructor(readonly title: string) {}

  record(e: Omit<Entry, "at">) {
    const entry: Entry = { ...e, findings: e.findings.map(judge), at: new Date().toISOString() };
    this.entries.push(entry);
    return entry;
  }

  deviations() {
    return this.entries.flatMap(e =>
      e.findings.filter(f => f.verdict && f.verdict !== "within")
        .map(f => ({ id: e.id, ...f })));
  }

  toJSON() {
    return { title: this.title, generated: new Date().toISOString(), entries: this.entries };
  }

  async write(writer: (json: string) => void | Promise<void>) {
    await writer(JSON.stringify(this.toJSON(), null, 2));
  }

  print() {
    const num = (x: number | null | undefined, digits = 4) =>
      typeof x === "number" && Number.isFinite(x) ? x.toExponential(digits) : "—";

    for (const e of this.entries) {
      console.log(`\n═════ ${e.id} — ${e.what} ═════`);
      const h = e.header;
      console.log(`  ${h.geometry} · D ${h.D} · DEG ${h.DEG} · N ${h.N}`);
      console.log(`  ${h.theory}${h.layers.length ? ` · layers ${h.layers.join(", ")}` : ""} · ` +
        `${h.backend} · ${h.locals} locals · ${h.rays} rays · ${h.ticks} ticks · seeds ${h.seeds.length}`);
      console.log();
      for (const f of e.findings) {
        const v = `${num(f.value)}${f.err !== undefined && f.err !== null ? ` ± ${num(f.err, 1)}` : ""}`;
        const j = f.expect
          ? `   ${f.verdict === "within" ? "within" : `${f.verdict} by ${(100 * (f.by ?? 0)).toFixed(1)}%`}` +
            ` of ${f.expect.want} (${f.expect.of})`
          : "";
        console.log(`  ${f.name.padEnd(34)} ${v.padEnd(24)}${j}`);
        if (f.note) console.log(`      ${f.note}`);
      }
      if (e.table) {
        const w = e.table.columns.map((c, i) =>
          Math.max(c.length, ...e.table!.rows.map(r => String(r[i]).length)) + 2);
        console.log("\n  " + e.table.columns.map((c, i) => c.padEnd(w[i])).join(""));
        for (const r of e.table.rows)
          console.log("  " + r.map((x, i) => String(x).padEnd(w[i])).join(""));
      }
    }
  }
}

export type Under = "holds" | "absent" | (string & {});

export type TestContext = {
  over<T extends number>(seeds: number[], f: (seed: number) => T): Stat;
  once<A extends unknown[], R>(f: (...a: A) => R): (...a: A) => R;
  expecting: "holds" | "absent";
  budget: typeof budget;
  note(s: string): void;
};

export type Test = {
  id: string;
  claims: string;
  cited?: string[];
  under: Record<string, Under>;
  exact?: boolean;
  run: (ctx: TestContext, theory: Any) => {
    header: Header;
    findings: Finding[];
    table?: Entry["table"];
  };
};

export const test = (t: Test): Test => t;

export const DEFAULT_SEEDS = [20260817, 777333, 424242, 909090, 5150, 31337];

export type Budget = "quick" | "normal" | "full";
let CURRENT: Budget = "full";
export const setBudget = (b: Budget) => { CURRENT = b; };
export const currentBudget = () => CURRENT;

const odd = (x: number, floor: number) => Math.max(floor, 2 * Math.round((x - 1) / 2) + 1);

export const budget = (want: { N: number; T: number; seeds: number }) => {
  if (CURRENT === "full")
    return {
      N: want.N, T: want.T, seeds: DEFAULT_SEEDS.slice(0, want.seeds),
      quick: false, tier: "full" as Budget,
    };
  if (CURRENT === "normal")
    return {
      N: odd(0.7 * want.N, 21),
      T: Math.max(60, Math.round(0.75 * want.T)),
      seeds: DEFAULT_SEEDS.slice(0, Math.max(3, Math.ceil(0.75 * want.seeds))),
      quick: false, tier: "normal" as Budget,
    };
  return {
    N: odd(want.N / 3, 21),
    T: Math.max(40, Math.round(want.T / 2)),
    seeds: DEFAULT_SEEDS.slice(0, Math.max(2, Math.ceil(want.seeds / 2))),
    quick: true, tier: "quick" as Budget,
  };
};

export type Outcome = {
  id: string;
  theory: string;
  declared: Under;
  held: boolean;
  asDeclared: boolean;
  provisional?: boolean;
  outside: Finding[];
};

export const runSuite = async (
  tests: Test[],
  theories: Record<string, Any>,
  o: {
    title?: string; only?: string[]; quiet?: boolean;
    write?: (json: string) => void | Promise<void>;
    shard?: { index: number; total: number };
    take?: () => Promise<number | null>;
    onUnit?: (u: { id: string; theory: string; seconds: number; status: string }) => void;
  } = {},
) => {
  const R = new Report(o.title ?? "physics");
  const outcomes: Outcome[] = [];
  const chosen = o.only?.length ? tests.filter(t => o.only!.some(k => t.id.includes(k))) : tests;

  const units = chosen.flatMap(t =>
    Object.entries(t.under).map(([name, declared]) => ({ t, name, declared })));

  async function* work() {
    if (o.take) {
      for (;;) {
        const i = await o.take();
        if (i === null || i === undefined) return;
        yield units[i];
      }
    } else {
      const mine = o.shard
        ? units.filter((_, i) => i % o.shard!.total === o.shard!.index)
        : units;
      for (const u of mine) yield u;
    }
  }

  for await (const { t, name, declared } of work()) {
    const theory = theories[name];
    if (!theory) throw new Error(
      `${t.id} declares an expectation under "${name}", which is not a theory this suite knows. ` +
      `Known: ${Object.keys(theories).join(", ")}`);

    if (declared !== "holds" && declared !== "absent") {
      R.record({
        id: `${t.id} · ${name}`, what: t.claims,
        header: headerOf(theory.seed(), name),
        findings: [{ name: "not applicable", value: NaN, note: declared }],
      });
      outcomes.push({ id: t.id, theory: name, declared, held: false, asDeclared: true, outside: [] });
      continue;
    }

    const notes: string[] = [];
    const ctx: TestContext = {
      once: <A extends unknown[], Rt>(f: (...a: A) => Rt) => {
        const cache = new Map<string, Rt>();
        return (...a: A): Rt => {
          const k = JSON.stringify(a);
          if (!cache.has(k)) cache.set(k, f(...a));
          return cache.get(k)!;
        };
      },
      over: (seeds, f) => {
        if (seeds.length < 2) throw new Error(
          `${t.id}: a single seed is not a measurement. Every number in this book that turned ` +
          `out to be noise looked like this one does.`);
        return stat(seeds.map(f));
      },
      expecting: declared as "holds" | "absent",
      budget,
      note: s => notes.push(s),
    };

    const t0 = Date.now();
    if (!o.quiet) process.stdout.write(`  ${t.id} · ${name} … `);
    const got = t.run(ctx, theory);
    const entry = R.record({
      id: `${t.id} · ${name}`, what: t.claims, header: got.header,
      findings: got.findings, table: got.table,
    });
    if (CURRENT !== "full" && !t.exact) entry.findings.unshift({
      name: CURRENT === "quick" ? "QUICK RUN" : "NORMAL RUN", value: NaN,
      note: CURRENT === "quick"
        ? "measured at a reduced box and tick count. Good enough to say whether something " +
          "broke; NOT good enough to quote — a published number is a `full` run."
        : "measured at the iteration tier: big enough to size an effect and to carry a " +
          "profile or a sweep, but NOT what a published number is quoted from. A figure " +
          "the article cites is a `full` run.",
    });
    for (const n of notes) entry.findings.push({ name: "note", value: NaN, note: n });

    const outside = entry.findings.filter(f => f.verdict && f.verdict !== "within");
    const held = outside.length === 0;
    const provisional = CURRENT !== "full" && !held && !t.exact;
    outcomes.push({
      id: t.id, theory: name, declared, held,
      asDeclared: held || provisional, provisional, outside,
    });
    const status = held ? `${declared} ✓`
      : provisional ? `${outside.length} outside — provisional, ${CURRENT} budget`
        : `${outside.length} outside expectation`;
    const seconds = (Date.now() - t0) / 1000;
    if (!o.quiet) console.log(`${seconds.toFixed(1)}s  ${status}`);
    o.onUnit?.({ id: t.id, theory: name, seconds, status });
  }

  if (o.write) await R.write(o.write);
  return { report: R, outcomes };
};

export const matrix = (outcomes: Outcome[]) => {
  const ids = [...new Set(outcomes.map(o => o.id))];
  const theories = [...new Set(outcomes.map(o => o.theory))];
  const rows = ids.map(id => {
    const cells = theories.map(th => {
      const o = outcomes.find(x => x.id === id && x.theory === th);
      if (!o) return "—";
      if (o.declared !== "holds" && o.declared !== "absent") return "n/a";
      if (o.held) return o.declared;
      return o.provisional ? "unresolved" : `NOT ${o.declared}`;
    });
    return [id, ...cells];
  });
  return { columns: ["claim", ...theories], rows };
};
