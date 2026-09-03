/**
 * THE BORROWED CATALOGUES, FETCHED FROM THE PEOPLE WHO MEASURED THEM.
 *
 *     npm run catalogue          # fetch (or reuse data/.raw), parse, write data/
 *     npm run catalogue -- --refetch
 *
 * WHY THIS EXISTS. Until now SPARC and Genzel arrived in this repository as numbers typed
 * into a source file - a base-36 blob for 2,696 accelerations, a 123-row array for the
 * Tully-Fisher sample, six discs written out by hand. Every one of those was correct, and
 * not one of them was CHECKABLE: a reader could not tell a transcription slip from a
 * measurement, and neither could I. A borrowed number should carry its provenance the way a
 * derived one carries its rule.
 *
 * So nothing here is typed. Four files are downloaded from the addresses their authors
 * publish them at, parsed by the format descriptions the files themselves carry, and written
 * out as columns. What the model then does with them - which cuts, which mass-to-light
 * ratio, which recipe - lives in `src/lib/Sparc.ts`, where it can be read and argued with.
 * This file only moves numbers.
 *
 * THE SOURCES, AND WHY EACH ONE:
 *
 *   https://astroweb.cwru.edu/SPARC/SPARC_Lelli2016c.mrt
 *     Lelli, McGaugh & Schombert 2016, AJ 152:157, table 1. The 175 galaxies: distance,
 *     inclination, luminosity, HI mass, the flat velocity, the quality flag. One row each,
 *     and the row IS the galaxy.
 *
 *   https://astroweb.cwru.edu/SPARC/MassModels_Lelli2016c.mrt
 *     The same paper's table 2. 3,390 rotation-curve points: a radius, the velocity measured
 *     there, and the velocity the gas, the disk and the bulge would each produce on their
 *     own. One row is one radius in one galaxy - these are MEASUREMENTS, not samples of a
 *     fitted curve, which is the distinction the panel is at pains to draw.
 *
 *   https://astroweb.cwru.edu/SPARC/BTFR_Lelli2019.mrt
 *     Lelli, McGaugh, Schombert, Desmond & Katz 2019, MNRAS 484:3267. Carried because it is
 *     the paper the baryonic Tully-Fisher relation is quoted from, and because its own
 *     log(Mb) is an independent check on the mass this repository builds out of table 1.
 *
 *   https://arxiv.org/pdf/1703.04310  (Genzel et al. 2017, Nature 543:397, table 1)
 *     Six high-redshift discs. Nature publishes no machine-readable table for this one - not
 *     at CDS, not in the supplementary material - so the authors' own preprint is the source
 *     of record and the table is read out of its text layer. `pdftotext` does the
 *     extraction; if it is missing the run says so rather than falling back to anything
 *     typed.
 *
 * THE FORMAT IS THE ONE THE REPOSITORY ALREADY HAS: a `.f32` of columns and a `meta.json`
 * header, the same pair `tools/MEASURE.ts` writes and `src/lib/Measured.ts` reads. Measured
 * fields and borrowed catalogues are the same kind of artefact - named columns with a header
 * saying where they came from - and giving them one reader means a panel does not have to
 * care which of the two it is holding.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const ROOT = new URL("../../../", import.meta.url).pathname;
const DATA = `${ROOT}data`;
const RAW = `${DATA}/.raw`;
const refetch = process.argv.includes("--refetch");

/**
 * ONE DOWNLOAD, CACHED IN `data/.raw`.
 *
 * The cache is not politeness, it is repeatability: parsing is the part that changes while
 * this is being written, and re-fetching four files for every parser fix asks a university
 * web server to pay for my iteration. It also means the run is offline the second time, and
 * that a reader can diff what was downloaded against what was written.
 */
const fetched = async (url: string, as: string): Promise<Buffer> => {
  mkdirSync(RAW, { recursive: true });
  const at = `${RAW}/${as}`;
  if (existsSync(at) && !refetch) { console.log(`  cached   ${as}`); return readFileSync(at); }
  process.stdout.write(`  GET      ${url} ... `);
  const r = await fetch(url, { headers: { "user-agent": "orbitmines-physics (research)" } });
  if (!r.ok) throw new Error(`${url} answered ${r.status} ${r.statusText}`);
  const bytes = Buffer.from(await r.arrayBuffer());
  writeFileSync(at, bytes);
  console.log(`${(bytes.length / 1024).toFixed(0)} kB`);
  return bytes;
};

/* -- the machine-readable table format, read out of the file that uses it ---- */

type Field = { label: string; kind: string };

/**
 * A `.mrt` DESCRIBES ITSELF, so no column name or order is written down here.
 *
 * Every one of these files opens with a byte-by-byte description - `35- 41 F7.3 10+9solLum
 * L[3.6] Total Luminosity at [3.6]` - and then the rows. Hard-coding those names and their
 * order would put a second copy of the format in this repository, and the day a column moves
 * the copy would be silently wrong in the fourth decimal of a luminosity. Reading the header
 * instead means a changed file either parses correctly or fails loudly.
 *
 * THE BLOCK IS FOUND BY ITS OWN COLUMN HEADING rather than by counting horizontal rules.
 * These files carry four of those - one under the title, one on each side of the description,
 * one after the notes - and which pair the description falls between differs from table to
 * table. `Bytes Format Units Label` opens it in every one of them; the data is everything
 * past the LAST rule, which is true in all of them too.
 *
 * THE VALUES ARE TAKEN BY WHITESPACE AND NOT BY THE BYTE OFFSETS, which needs saying because
 * the offsets are RIGHT THERE and they are WRONG. `SPARC_Lelli2016c.mrt` declares its galaxy
 * name as bytes 1-11 and then writes a twelve-wide name field, so every column after it sits
 * one byte to the right of where the file says it does - and slicing by the declaration
 * returns `1` for a Hubble type of `10`, `65` for an inclination error, and a quality flag
 * made of somebody else's decimal. Nothing throws. The first version of this parser did
 * exactly that and produced a catalogue that looked entirely reasonable.
 *
 * Splitting on whitespace cannot make that mistake, and the one thing it cannot handle - a
 * blank column, which byte offsets exist to allow - is checked for rather than hoped about:
 * a row whose token count differs from the description's field count is an error. All three
 * of these tables are complete, so the check never fires; if a future one is not, it fires
 * on the first row instead of quietly shifting a column.
 */
const mrt = (text: string) => {
  const lines = text.replace(/\r/g, "").split("\n");
  const rules: number[] = [];
  lines.forEach((l, i) => { if (/^-{20,}\s*$/.test(l)) rules.push(i); });
  const heading = lines.findIndex(l => /^\s*Bytes\s+Format\s+Units\s+Label/.test(l));
  if (heading < 0 || rules.length < 2)
    throw new Error("no byte-by-byte description in this file");
  const ends = rules.find(r => r > heading + 1) ?? lines.length;
  const fields: Field[] = [];
  for (let i = heading + 1; i < ends; i++) {
    /* `  1- 11 A11  ---  Galaxy  ...`, and a single-byte column writes just `  99 I3 ...` */
    const m = lines[i].match(/^\s*\d+(?:\s*-\s*\d+)?\s+([A-Z]\d*\.?\d*)\s+\S+\s+(\S+)/);
    if (m) fields.push({ kind: m[1], label: m[2] });
  }
  const rows = lines.slice(rules[rules.length - 1] + 1)
    .filter(l => l.trim().length > 0)
    .map((l, i) => {
      const cells = l.trim().split(/\s+/);
      if (cells.length !== fields.length)
        throw new Error(`row ${i + 1} has ${cells.length} values, the description declares ` +
          `${fields.length} columns - this file needs reading by its byte offsets`);
      return cells;
    });
  const of = (label: string) => {
    const i = fields.findIndex(f => f.label === label);
    if (i < 0) throw new Error(`no column called ${label} - the file's format has moved`);
    return i;
  };
  return {
    fields, rows,
    at: (row: string[], label: string) => row[of(label)],
    num: (row: string[], label: string) => Number(row[of(label)]),
  };
};

/* -- what gets written ------------------------------------------------------ */

/**
 * COLUMNS AND A HEADER, which is the shape everything measured in this repository has.
 *
 * The header is JSON and carries what a reader would otherwise have to be told out of band:
 * the exact URL, the paper, the units of every column, and - for the catalogues - the galaxy
 * names, which are strings and so cannot live in a `Float32Array`.
 */
const write = (name: string, header: Record<string, unknown>, cols: Record<string, number[]>) => {
  const names = Object.keys(cols);
  const rows = cols[names[0]].length;
  for (const c of names)
    if (cols[c].length !== rows)
      throw new Error(`${name}: column ${c} has ${cols[c].length} rows, not ${rows}`);
  const all = new Float32Array(names.length * rows);
  names.forEach((c, i) => all.set(cols[c], i * rows));
  const dir = `${DATA}/${name}`;
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/field.f32`, Buffer.from(all.buffer));
  writeFileSync(`${dir}/meta.json`,
    JSON.stringify({ ...header, columns: names, rows }, null, 2) + "\n");
  console.log(`  wrote    data/${name}   ${rows} rows x ${names.length} columns`);
};

/* -- SPARC ------------------------------------------------------------------ */

const SPARC = "https://astroweb.cwru.edu/SPARC";

const galaxies = async () => {
  const t = mrt((await fetched(`${SPARC}/SPARC_Lelli2016c.mrt`, "SPARC_Lelli2016c.mrt"))
    .toString("utf8"));
  const want = ["T", "D", "e_D", "f_D", "Inc", "e_Inc", "L[3.6]", "e_L[3.6]", "Reff",
    "SBeff", "Rdisk", "SBdisk", "MHI", "RHI", "Vflat", "e_Vflat", "Q"];
  const cols: Record<string, number[]> = {};
  for (const w of want) cols[w] = t.rows.map(r => t.num(r, w));
  write("sparc-galaxies", {
    what: "SPARC table 1 - the sample, one row per galaxy",
    source: `${SPARC}/SPARC_Lelli2016c.mrt`,
    paper: "Lelli, McGaugh & Schombert 2016, AJ 152:157",
    units: {
      T: "Hubble type", D: "Mpc", Inc: "deg", "L[3.6]": "1e9 Lsun", Reff: "kpc",
      SBeff: "Lsun/pc2", Rdisk: "kpc", SBdisk: "Lsun/pc2", MHI: "1e9 Msun", RHI: "kpc",
      Vflat: "km/s, 0 where the curve never flattens", Q: "quality flag, 1 high .. 3 low",
    },
    names: t.rows.map(r => t.at(r, "Galaxy")),
  }, cols);
  return t.rows.map(r => t.at(r, "Galaxy"));
};

const curves = async (names: string[]) => {
  const t = mrt((await fetched(`${SPARC}/MassModels_Lelli2016c.mrt`, "MassModels_Lelli2016c.mrt"))
    .toString("utf8"));
  const index = new Map(names.map((n, i) => [n, i]));
  const cols: Record<string, number[]> = {
    galaxy: [], D: [], R: [], Vobs: [], e_Vobs: [], Vgas: [], Vdisk: [], Vbul: [],
    SBdisk: [], SBbul: [],
  };
  for (const r of t.rows) {
    const id = t.at(r, "ID");
    const g = index.get(id);
    /*
     * A POINT WHOSE GALAXY IS NOT IN TABLE 1 IS A PARSE FAILURE, NOT A GALAXY.
     *
     * The two files are the two tables of one paper and their name columns agree exactly.
     * Dropping an unmatched row would turn a shifted byte offset into a slightly smaller
     * catalogue and nothing else - which is the failure that never gets noticed.
     */
    if (g === undefined) throw new Error(`mass models mention ${id}, table 1 does not`);
    cols.galaxy.push(g);
    for (const c of ["D", "R", "Vobs", "e_Vobs", "Vgas", "Vdisk", "Vbul", "SBdisk", "SBbul"])
      cols[c].push(t.num(r, c));
  }
  write("sparc-curves", {
    what: "SPARC table 2 - the mass models, one row per measured radius",
    source: `${SPARC}/MassModels_Lelli2016c.mrt`,
    paper: "Lelli, McGaugh & Schombert 2016, AJ 152:157",
    units: {
      galaxy: "row in sparc-galaxies", D: "Mpc", R: "kpc", Vobs: "km/s",
      Vgas: "km/s, already carrying the 1.33 for helium",
      Vdisk: "km/s at M/L = 1", Vbul: "km/s at M/L = 1", SBdisk: "Lsun/pc2", SBbul: "Lsun/pc2",
    },
  }, cols);
};

const btfr = async (names: string[]) => {
  const t = mrt((await fetched(`${SPARC}/BTFR_Lelli2019.mrt`, "BTFR_Lelli2019.mrt"))
    .toString("utf8"));
  const index = new Map(names.map((n, i) => [n, i]));
  const want = ["log(Mb)", "e_log(Mb)", "Inc", "e_Inc", "Vf", "e_Vf", "Vmax", "e_Vmax"];
  const cols: Record<string, number[]> = { galaxy: [] };
  for (const w of want) cols[w] = [];
  for (const r of t.rows) {
    cols.galaxy.push(index.get(t.at(r, "Name")) ?? -1);
    for (const w of want) cols[w].push(t.num(r, w));
  }
  write("sparc-btfr", {
    what: "the baryonic Tully-Fisher sample, with the authors' own baryonic masses",
    source: `${SPARC}/BTFR_Lelli2019.mrt`,
    paper: "Lelli, McGaugh, Schombert, Desmond & Katz 2019, MNRAS 484:3267",
    units: {
      galaxy: "row in sparc-galaxies, or -1 if absent",
      "log(Mb)": "log10 Msun, at M/L = 0.5 at 3.6um", Vf: "km/s", Vmax: "km/s", Inc: "deg",
    },
    names: t.rows.map(r => t.at(r, "Name")),
  }, cols);
};

/* -- Genzel ----------------------------------------------------------------- */

/**
 * TABLE 1 OF A NATURE PAPER, OUT OF THE PREPRINT'S TEXT LAYER.
 *
 * `pdftotext -layout` preserves the table as rows of a label followed by six values, and a
 * parser that reads them can be checked against the paper by anyone holding the paper.
 *
 * EVERY ROW IS TAKEN THE SAME WAY: find the line the label opens, then read the numbers off
 * the END of it, so the digits inside a label like `Mbaryon (10^11 M)` cannot be mistaken
 * for data. Three shapes occur - plain values, `value±error`, and `value (±error)` or
 * `value (<limit)` for the dark matter fraction - and each has its own reader. Anything that
 * does not yield exactly six values is an error, because a table that half-parses is worse
 * than one that does not parse at all.
 */
const GENZEL = "https://arxiv.org/pdf/1703.04310";

const discs = async () => {
  await fetched(GENZEL, "genzel2017.pdf");
  let text: string;
  try {
    text = execFileSync("pdftotext", ["-layout", `${RAW}/genzel2017.pdf`, "-"],
      { encoding: "utf8", maxBuffer: 64 << 20 });
  } catch {
    throw new Error(
      "Genzel's table needs `pdftotext` (poppler-utils) - Nature publishes no machine-readable\n" +
      "  version of it. Install poppler-utils and run again.");
  }
  const all = text.split("\n");
  /*
   * THE TABLE IS FOUND FIRST AND THE ROWS ARE READ INSIDE IT.
   *
   * The word `redshift` occurs a dozen times in twenty-four pages of a Nature paper, and the
   * first line that opens with it is a sentence about gas fractions, not a table row. So the
   * header naming the six galaxies is located first and every row is looked for BELOW it -
   * which also fixes the order of the six, since that header is what fixes it.
   */
  const head = all.findIndex(l => /COS4\s*\d/.test(l) && /D3a\s*15504/.test(l));
  if (head < 0) throw new Error("Genzel table 1: no header row naming the six galaxies");
  const lines = all.slice(head, head + 24);
  const row = (opens: string) => {
    const l = lines.find(l => l.trim().startsWith(opens));
    if (!l) throw new Error(`Genzel table 1: no row opening "${opens}"`);
    return l;
  };
  /** six plain numbers, taken off the end of the line */
  const plain = (opens: string) => {
    const all = [...row(opens).matchAll(/-?\d+(?:\.\d+)?/g)].map(m => Number(m[0]));
    if (all.length < 6) throw new Error(`Genzel table 1: "${opens}" gave ${all.length} numbers`);
    return all.slice(-6);
  };
  /** six `value±error` pairs */
  const pm = (opens: string) => {
    const m = [...row(opens).matchAll(/(-?\d+(?:\.\d+)?)\s*±\s*(\d+(?:\.\d+)?)/g)];
    if (m.length !== 6) throw new Error(`Genzel table 1: "${opens}" gave ${m.length} +- pairs`);
    return { v: m.map(x => Number(x[1])), e: m.map(x => Number(x[2])) };
  };
  /** the dark matter fractions: `0.21 (±0.1)` is a measurement, `0.0 (<0.08)` is a bound */
  const bounded = (opens: string) => {
    const m = [...row(opens).matchAll(/(-?\d+(?:\.\d+)?)\s*\(\s*(±|<)\s*(\d+(?:\.\d+)?)\s*\)/g)];
    if (m.length !== 6) throw new Error(`Genzel table 1: "${opens}" gave ${m.length} fractions`);
    return {
      f: m.map(x => Number(x[1])), e: m.map(x => Number(x[3])),
      limit: m.map(x => (x[2] === "<" ? 1 : 0)),
    };
  };

  /* the header line carries the six names, in the order every row below it uses */
  const who = (all[head].match(/(?:COS4|D3a|GS4|zC)\s*\d+/g) ?? [])
    .map(s => s.replace(/\s+/g, " "));
  if (who.length !== 6) throw new Error(`Genzel table 1: header named ${who.length} galaxies`);

  const mstar = pm("M* (10"), mbar = pm("Mbaryon(gas+stars) (10");
  const rh = pm("H-band R1/2"), inc = pm("inclination");
  const f = bounded("fDM(R1/2)");
  write("genzel-discs", {
    what: "Genzel et al. 2017 table 1 - six high-redshift discs, as published",
    source: `${GENZEL}   (Nature 543:397, table 1)`,
    paper: "Genzel et al. 2017, Nature 543:397",
    units: {
      z: "redshift", Mstar: "1e11 Msun", Mbaryon: "1e11 Msun, gas + stars, prior, no bulge",
      Rhalf_H: "kpc, H-band half-light radius, prior",
      Mb: "1e11 Msun, gas + stars INCLUDING bulge, fitted",
      Re: "kpc, R1/2 of an n=1 disk, fitted", vc: "km/s at R1/2", sigma0: "km/s",
      fDM: "dark matter fraction inside R1/2", e_fDM: "+-2 rms, or an upper limit",
      limit: "1 where e_fDM is a bound rather than an error",
    },
    names: who,
  }, {
    z: plain("redshift"),
    kpc_per_arcsec: plain("kpc/arcsec"),
    Mstar: mstar.v, e_Mstar: mstar.e,
    Mbaryon: mbar.v, e_Mbaryon: mbar.e,
    Rhalf_H: rh.v, e_Rhalf_H: rh.e,
    inc: inc.v, e_inc: inc.e,
    c: plain("dark matter concentration"),
    vc: plain("vc(R1/2)"),
    Re: plain("R1/2(n=1)"),
    Mb: plain("Mbaryon(gas+stars, including bulge)"),
    bulgeFraction: plain("Mbulge/Mbaryon"),
    fDM: f.f, e_fDM: f.e, limit: f.limit,
  });
};

/**
 * AND THE FETCH CHECKS ITSELF BEFORE IT CLAIMS TO HAVE WORKED.
 *
 * The Tully-Fisher relation is drawn from Lelli et al. 2019's table exactly as published, so
 * nothing downstream depends on rebuilding it - but table 1 is still where every rotation
 * point's cut comes from, and it is the file whose byte offsets lie. So the two are compared:
 * the mass this repository builds from table 1's photometry against the mass the authors
 * publish for the same galaxy, and the sample table 1's cut selects against the sample they
 * list. A run that parsed a column one byte off says so here rather than writing a
 * plausible-looking catalogue.
 *
 * The import is deferred to this point because `Sparc.ts` READS what the lines above write.
 */
const check = async () => {
  const { massCheck, RAR, GALAXIES, BTFR, FLAT, NAMES } = await import("../src/lib/Sparc.ts");
  const m = massCheck();
  console.log(`\n  ${RAR.length} rotation points in ${GALAXIES()} of ${NAMES.length} galaxies ` +
    `survive the quality, inclination and error cuts`);
  console.log(`  ${FLAT.length} galaxies get an outermost point; ${BTFR.length} have a flat velocity`);
  console.log(`  table 1's photometry reproduces Lelli+2019's own log(Mb) to ${m.rms.toFixed(4)} ` +
    `dex rms (worst ${m.worst.toFixed(4)}) over ${m.n} galaxies`);
  console.log(`  and table 1's own cut selects their sample exactly` +
    (m.missed ? ` EXCEPT for ${m.missed} galaxies` : ""));
  if (!(m.rms < 0.02) || m.missed)
    throw new Error("table 1 does not reproduce the authors' own sample or masses - the " +
      "parse or the recipe is wrong, and nothing downstream should be trusted");
};

const main = async () => {
  console.log("borrowed catalogues -> data/\n");
  const names = await galaxies();
  await curves(names);
  await btfr(names);
  await discs();
  await check();
  console.log("\ndone.");
};

main().catch(e => { console.error("\n" + e.message); process.exit(1); });
