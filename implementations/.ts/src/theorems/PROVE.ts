/**
 * THE ENTRY POINT — prove the theorems, for whichever theory and lattice were asked for.
 *
 *   npm run theorems
 *   npm run theorems -- --theory G^XOR --geometry cubic-6 --N 21 --T 80
 *
 * THE SETTINGS ARE THE RESULT, so they are arguments rather than constants: the same
 * theorem on another lattice is another theorem, and both are kept. What is written out
 * is `theorems/<theorem>.<theory>.<geometry>/` at the top of the repository.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { GEOMETRIES, Geometry } from "../lib/Local.ts";
import { G } from "../theories/G.ts";
import { G_XOR } from "../theories/G^XOR.ts";
import { G_CONSERVING } from "../theories/G^CONSERVING.ts";
import { LADDER, Lab } from "./Probe.ts";
import { prove, sentence } from "./Proof.ts";
import { Group, group, record, ROOT, write, writeIndex } from "./Emit.ts";
import { Theorem } from "./Theorem.ts";
import { definitions, inverseSquare } from "./theorems/inverse-square.ts";
import { shellGrowth } from "./theorems/shell-growth.ts";
import {
  assumptions, fluxIsPositive, fluxIsWhatTransportConserves, REGIMES, transport,
} from "./theorems/transport.ts";
import { DEFICIT } from "./probes/medium.ts";

const THEORIES: Record<string, any> = {
  G, "G^XOR": G_XOR, "G^CONSERVING": G_CONSERVING,
};

/**
 * WHAT IS PROVED, AND IN WHAT ORDER - the shell first, because everything else stands on
 * it.
 *
 * `extra` is a function of the lab rather than a list, because a theorem may be asked
 * under a named setting that is not the lattice: `transport.thinning` has two regimes and
 * they are two different questions, so the assumption it is given depends on which one is
 * being asked. A theorem with nothing to vary ignores the argument.
 */
type Entry = {
  theorem: typeof shellGrowth;
  extra: (lab: Lab) => { fact: any; because: string; line?: string }[];
  /** the settings other than the lattice this theorem is asked under, if it has any */
  regimes?: { name: string; says: string }[];
};

const THEOREMS: Entry[] = [
  { theorem: shellGrowth, extra: () => [] },
  { theorem: inverseSquare, extra: () => definitions },
  {
    theorem: transport,
    regimes: REGIMES,
    extra: (lab: Lab) => {
      const regime = REGIMES.find(r => r.name === lab.regime?.name) ?? REGIMES[0];
      return [...assumptions(regime), fluxIsWhatTransportConserves(DEFICIT), fluxIsPositive];
    },
  },
];

/** every proof on disk, this run's included and freshest - see `writeIndex` */
const everything = (fresh: Group[]): Group[] => {
  const seen = new Map(fresh.map(g => [`${g.theorem}.${g.theory}`, g]));
  for (const e of readdirSync(ROOT, { withFileTypes: true })) {
    if (!e.isDirectory() || seen.has(e.name)) continue;
    try {
      seen.set(e.name, JSON.parse(readFileSync(join(ROOT, e.name, "proof.json"), "utf8")));
    } catch { /* a folder with no proof in it is not one of ours */ }
  }
  return [...seen.values()].sort((a, b) =>
    `${a.theorem}.${a.theory}`.localeCompare(`${b.theorem}.${b.theory}`));
};

const arg = (name: string, fallback?: string) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : fallback;
};

const theory = THEORIES[arg("theory", "G")!];
if (!theory) throw new Error(
  `there is no theory called ${arg("theory")} here - ${Object.keys(THEORIES).join(", ")}`);
/**
 * THE LATTICES THIS RUN CHECKS ON.
 *
 * A theorem is about a THEORY; the lattice is a setting, and the interesting question is
 * whether the derivation survives changing it. So the default is to sweep several rather
 * than to pick one - the answer `shell ∝ β·r̄^(D-1)` means much more once it has come out
 * of D = 1, 2 and 3 by the same two rules, and a lattice where it did NOT would be the
 * most important output this folder could produce.
 */
/**
 * RE-RENDER WHAT IS ALREADY PROVED, without proving it again.
 *
 * A proof takes ten minutes of ticking and its presentation takes none, so a change to a
 * stylesheet or to the panel script must not cost a rerun - and if it does, it will not
 * get made, or worse it will get made by editing the generated HTML by hand. `proof.json`
 * holds everything the page is built from, so `--render` reads the folders back and emits
 * from them. Nothing is measured and nothing can change but the setting of it.
 */
if (process.argv.includes("--render")) {
  const groups = everything([]);
  for (const g of groups) console.log(`  ${write(g).split("/").pop()}`);
  console.log(`  index at theorems/${writeIndex(groups).split("/").pop()}`);
  process.exit(0);
}

const SWEEP = (arg("geometry") ?? arg("geometries") ?? "fcc-12,cubic-6,square-4,line-2")
  .split(",").map(n => {
    const g = GEOMETRIES[n.trim()];
    if (!g) throw new Error(`there is no lattice called ${n.trim()} here`);
    return g;
  });

/**
 * A BOX PER LATTICE, because a cell in one dimension is not a cell in three.
 *
 * 61 in one dimension is 61 points and 61 in three is two hundred and twenty thousand, so
 * one number cannot serve both: a walk needs enough room to take its steps in and a
 * three-dimensional run has to stay affordable. Stated per dimension rather than left to
 * a single `--N` that is wrong for at least two of the four.
 */
const boxFor = (g: Geometry) => {
  const asked = arg("N");
  if (asked) return Number(asked);
  return g.D === 1 ? 61 : g.D === 2 ? 41 : 21;
};

const T = Number(arg("T", "120"));
const seeds = arg("seeds", "1")!.split(",").map(Number);

/* the markup set for a terminal, which has no superscripts and no overlines */
const plain = (s: string) => s
  .replace(/\\bar\{([^{}]*)\}/g, "$1_")
  .replace(/\^\{([^{}]*)\}/g, "^($1)")
  .replace(/_\{([^{}]*)\}/g, "_$1")
  .replace(/\[\[([a-z0-9-]+)\]\]/g, "$1");

console.log(`${theory.name} over ${SWEEP.map(g => g.name).join(", ")}, ` +
  `${T} ticks, seeds ${seeds.join(",")}\n`);

const groups: Group[] = [];

for (const { theorem, extra, regimes } of THEOREMS) {
  console.log(plain(`${theorem.id} - ${theorem.asks}`));
  const variants: ReturnType<typeof record>[] = [];

  /* a theorem with no named setting is asked once per lattice; one with settings is
   * asked once per lattice per setting, and the grouping sorts out which of those
   * turned out to be the same result */
  for (const regime of regimes ?? [undefined]) {
    for (const geometry of SWEEP) {
      const lab: Lab = {
        theory, geometry,
        N: boxFor(geometry), T, seeds,
        ladder: LADDER,
        boxFor,
        regime,
        say: () => {},
      };
      const label = regime ? `${geometry.name} / ${regime.name}` : geometry.name;
      process.stdout.write(`  ${label.padEnd(20)} `);
      const p = prove(theorem, lab, extra(lab));
      variants.push(record(p));
      console.log(plain(p.at ? sentence(p) : "no law follows"));
    }
  }

  const g = group(theorem.id, theory.name, variants);
  groups.push(g);

  console.log(`\n  ${g.results.length === 1
    ? `one result across all ${variants.length} lattices`
    : `${g.results.length} different results`}:`);
  g.results.forEach((res, i) => {
    const v = res.variants[0];
    console.log(`    ${i + 1}. ${plain(v.concluded ?? "no law")} ` +
      `[${res.variants.map(x => x.under.regime
        ? `${x.under.geometry}/${x.under.regime}` : x.under.geometry).join(", ")}]`);
    for (const m of v.missing) console.log(`         missing: ${plain(m)}`);
  });
  console.log(`\n  written to theorems/${write(g).split("/").pop()}/\n`);
}

/*
 * THE COLLECTIVE PAGE IS REBUILT FROM EVERY FOLDER THAT EXISTS, not from the ones this
 * run happened to produce. A run on one theory must not delete another's rows: they are
 * different results, both still true, and an index showing only the most recent
 * invocation would say the opposite.
 */
console.log(`  index at theorems/${writeIndex(everything(groups)).split("/").pop()}`);
