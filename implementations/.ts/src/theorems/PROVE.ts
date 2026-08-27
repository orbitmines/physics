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
import { G_XOR_2 } from "../theories/G^XOR*2.ts";
import { G_XOR_C } from "../theories/G^XOR^c.ts";
import { withRelaxation } from "../theories/G.ts";
import { LADDER, Lab } from "./Probe.ts";
import { conclusions } from "./Kernel.ts";
import { Established, prove, sentence } from "./Proof.ts";
import { Group, group, record, ROOT, write, writeIndex } from "./Emit.ts";
import { Entry, THEOREMS } from "./Catalogue.ts";
/** what each theorem concluded, per theory and lattice, for later ones to cite */
const proved = new Map<string,
  { geometry: string; regime?: string; what: Established }[]>();

/** every proof on disk, this run's included and freshest - see `writeIndex` */
const everything = (fresh: Group[]): Group[] => {
  const seen = new Map(fresh.map(g => [g.theorem, g]));
  for (const e of readdirSync(ROOT, { withFileTypes: true })) {
    if (!e.isDirectory() || seen.has(e.name)) continue;
    try {
      seen.set(e.name, JSON.parse(readFileSync(join(ROOT, e.name, "proof.json"), "utf8")));
    } catch { /* a folder with no proof in it is not one of ours */ }
  }
  return [...seen.values()].sort((a, b) => a.theorem.localeCompare(b.theorem));
};

const arg = (name: string, fallback?: string) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : fallback;
};

/**
 * RE-RENDER WHAT IS ALREADY PROVED, without proving it again.
 *
 * A sweep takes many minutes of ticking and its presentation takes none, so a change to a
 * stylesheet or to the panel script must not cost a rerun - if it does it will not get
 * made, or worse it will get made by editing the generated HTML. `proof.json` holds
 * everything a page is built from.
 */
if (process.argv.includes("--render")) {
  const all = everything([]);
  for (const g of all) console.log(`  ${write(g).split("/").pop()}`);
  console.log(`  index at theorems/${writeIndex(all).split("/").pop()}`);
  process.exit(0);
}

/**
 * THE THEORIES THIS RUN PROVES UNDER - and the theory is the top of every page.
 *
 * Three, and they are the three that are meant to be compared: pure gravity, gravity with
 * a sign on the rays, and that again with a phase. A theorem's answer under each is the
 * comparison the whole folder exists to make cheap, which is why they end up as a
 * dropdown on the title rather than as separate folders nobody opens side by side.
 */
const THEORIES: Record<string, any> = {
  G, "G^XOR": G_XOR, "G^XOR*2": G_XOR_2,
  /* the matter theory - the only one that suppresses the expansion where matter is, so
   * the only one `rest` can divide the crossing part on */
  "G^XOR^c": G_XOR_C,
  /*
   * AND THE SAME THEORY WITH THE VACUUM ABLE TO RUN — see `withRelaxation`.
   *
   * Every theory above folds space irreversibly: (G/2) fires only where a point is
   * neutral, a point holding matter is not, so nothing hands folded space back. Measured
   * on fcc 12, the whole board resolves on tick 2 and the vacuum then sits at 2-6%
   * occupancy in a period-2 cycle with no meeting in it ever again. Every screening
   * length in this book is a mean free path and a mean free path is 1/fill, so the
   * numbers below are being asked of a vacuum forty times thinner than the one they
   * assume. With the inverse in, occupancy settles near a half on its own.
   *
   * It is a SEPARATE ENTRY rather than a change to the three, so what moves is visible
   * as a difference between two columns rather than as a silent re-measurement.
   */
  "G^XOR·relaxing": withRelaxation(G_XOR, { above: 2, chance: 1 }),
};

const chosen = (arg("theory") ?? arg("theories") ?? Object.keys(THEORIES).join(","))
  .split(",").map(n => {
    const t = THEORIES[n.trim()];
    if (!t) throw new Error(
      `there is no theory called ${n.trim()} here - ${Object.keys(THEORIES).join(", ")}`);
    return t;
  });

/**
 * THE LATTICES THIS RUN CHECKS ON.
 *
 * A theorem is about a THEORY; the lattice is a setting, and the interesting question is
 * whether the derivation survives changing it. So the default is to sweep several rather
 * than to pick one - `shell ∝ β·r̄^(D-1)` means much more once it has come out of D = 1,
 * 2 and 3 by the same two rules, and a lattice where it did NOT would be the most
 * important output this folder could produce.
 */
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
 * one number cannot serve both.
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

console.log(`${chosen.map(t => t.name).join(", ")} over ` +
  `${SWEEP.map(g => g.name).join(", ")}, ${T} ticks, seeds ${seeds.join(",")}\n`);

const groups: Group[] = [];

/*
 * ONE THEOREM AT A TIME, WHEN THAT IS WHAT IS WANTED.
 *
 * A full sweep is every theorem over every lattice, which is the right default and takes
 * minutes. Iterating on ONE theorem's probe against that is minutes per edit, so the whole
 * of an argument ends up checked by reading rather than by running. `--theorem mass.budget`
 * runs the one, and the index it writes is partial by construction - which is why the
 * default is still everything.
 */
const only = arg("theorem");
const asked = only ? THEOREMS.filter(e => e.theorem.id === only) : THEOREMS;
if (only && !asked.length) throw new Error(
  `there is no theorem called ${only} here - ${THEOREMS.map(e => e.theorem.id).join(", ")}`);

for (const { theorem, extra, regimes } of asked) {
  console.log(plain(`${theorem.id} - ${theorem.asks}`));
  const variants: ReturnType<typeof record>[] = [];

  for (const theory of chosen) {
    /*
     * WHAT EARLIER THEOREMS ESTABLISHED, ON THIS THEORY AND THIS LATTICE.
     *
     * A citation is only good where it was proved: `meeting.rate` may lean on
     * `gravity.falloff`'s result under G, and must not lean on it under a theory where
     * that theorem concluded something else - or nothing.
     */
    const established = proved.get(theory.name) ?? [];

    for (const regime of regimes ?? [undefined]) {
      for (const geometry of SWEEP) {
        const lab: Lab = {
          theory, geometry, N: boxFor(geometry), T, seeds,
          ladder: LADDER, boxFor, regime, say: () => {},
        };
        const label = `${theory.name} ${geometry.name}` +
          (regime ? ` / ${regime.name}` : "");
        process.stdout.write(`  ${label.padEnd(30)} `);
        /*
         * CITED ONLY FROM THE SAME LATTICE AND THE SAME REGIME. A result proved in the
         * dense branch is not available to the thin one; a theorem with no regime of its
         * own may cite anything proved without one.
         */
        const p = prove(theorem, lab, extra(lab), established
          .filter(e => e.geometry === geometry.name &&
            (regime ? e.regime === regime.name || e.regime === undefined : !e.regime))
          .map(e => e.what));
        variants.push(record(p));
        console.log(plain(p.at ? sentence(p) : "no law follows"));

        /*
         * AND EVERY LAW THIS THEOREM FINISHED WITH becomes available to the next one -
         * not only its headline. A later theorem usually wants a line from the middle.
         */
        /*
         * A THEOREM THAT CONCLUDED ZERO STILL PUBLISHES.
         *
         * `standing` asks whether the subject was shown to be more than nothing, and
         * gating citation on it meant `vacuum.occupancy` under pure gravity - which
         * concludes 0, correctly and interestingly - handed nothing to the theorems that
         * need it. So `vacuum.expansion` could not say that G does not expand, which is
         * the single most characteristic fact about that theory.
         */
        if (p.at) {
          const list = proved.get(theory.name) ?? [];
          for (const n of conclusions(p.store))
            list.push({
              geometry: geometry.name, regime: regime?.name,
              what: { theorem: theorem.id, fact: n.fact, line: n.line },
            });
          proved.set(theory.name, list);
        }
      }
    }
  }

  const g = group(theorem.id, variants);
  groups.push(g);

  for (const u of g.theories) {
    console.log(`\n  ${u.theory}: ${u.results.length === 1
      ? "one result across every lattice" : `${u.results.length} different results`}`);
    u.results.forEach((res, i) => {
      const v = res.variants[0];
      console.log(`    ${i + 1}. ${plain(v.concluded ?? "no law")} ` +
        `[${res.variants.map(x => x.under.regime
          ? `${x.under.geometry}/${x.under.regime}` : x.under.geometry).join(", ")}]`);
      for (const m of v.missing) console.log(`         missing: ${plain(m)}`);
    });
  }
  console.log(`\n  written to theorems/${write(g).split("/").pop()}/\n`);
}

/*
 * THE COLLECTIVE PAGE IS REBUILT FROM EVERY FOLDER THAT EXISTS, not only from the ones
 * this run produced, so a partial sweep does not delete another theorem's rows.
 */
console.log(`  index at theorems/${writeIndex(everything(groups)).split("/").pop()}`);
