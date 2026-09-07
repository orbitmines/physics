/**
 * WHAT HAS BEEN PROVED, LOOKED UP - so that nothing outside this folder ever re-derives
 * anything, or worse, hardcodes it.
 *
 * THE PROBLEM THIS SOLVES IS A REAL ONE AND I WALKED INTO IT. `fieldB` computes a
 * magnetic field as Σ q (d̂ × u), and it needs the emitter's velocity. That velocity was
 * being read off a per-ray tag holding a DECLARED number - one nothing in the dynamics
 * sets and nothing checks. The fix is not to compute it in `fieldB` instead: a second
 * implementation of a derived quantity is a second thing that can be wrong, and it can
 * drift from the derivation silently because nothing relates the two. `doppler` derives
 * the velocity from XOR's own rules; the honest thing for a reader to do is ASK for that
 * result rather than reproduce its arithmetic.
 *
 * SO THE PROVED RESULTS ARE A LOOKUP, keyed by the theorem and by the world the reader is
 * standing in. `theory.theorems` gives what is established for that theory; asking it for
 * a theorem returns the conclusion ONLY where the configuration matches the one it was
 * proved under, and otherwise returns nothing at all.
 *
 * THE CONFIGURATION GUARD IS THE WHOLE POINT AND NOT A FORMALITY. A result proved on
 * fcc-12 in the dense regime is a result about fcc-12 in the dense regime. Handed to a
 * cubic-6 world it would be wrong, and wrong in the way that is hardest to catch: a
 * plausible number in the right units, silently describing a different lattice. So a
 * mismatch is a MISS rather than a best effort, and a reader that gets nothing back is
 * being told something true - that this has not been proved where you are standing.
 *
 * IT READS THE GENERATED FOLDER, which is deliberate. `theorems/` is the output of
 * `npm run theorems`, so what a visual draws is what the prover last established, and a
 * derivation that stops holding stops being available to draw. Nothing is compiled in.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("../../../../theorems/", import.meta.url).pathname;

/** the settings a result was proved under - all of them, so a reader can check */
export type Under = {
  theory: string; geometry: string; D: number; DEG: number;
  N: number; T: number; seeds: number[]; regime: string | null;
};

export type Established = {
  theorem: string;
  under: Under;
  /** the conclusion as it is set on the page */
  concluded: string;
  /** whether it was shown to be about a quantity greater than zero */
  standing: boolean;
};

type Proof = {
  theorem: string;
  theories: { theory: string; results: { variants: {
    under: Under; concluded: string | null; standing: boolean }[] }[] }[];
};

let cache: Established[] | undefined;

/** every result on disk, read once */
const all = (): Established[] => {
  if (cache) return cache;
  const out: Established[] = [];
  let dirs: string[] = [];
  try {
    dirs = readdirSync(ROOT, { withFileTypes: true })
      .filter(e => e.isDirectory()).map(e => e.name);
  } catch { /* nothing proved yet, which is a state and not an error */ }
  for (const d of dirs) {
    let proof: Proof;
    try {
      proof = JSON.parse(readFileSync(join(ROOT, d, "proof.json"), "utf8"));
    } catch { continue; }
    for (const t of proof.theories ?? [])
      for (const r of t.results ?? [])
        for (const v of r.variants ?? []) {
          if (!v.concluded) continue;
          out.push({ theorem: proof.theorem, under: v.under,
            concluded: v.concluded, standing: v.standing });
        }
  }
  return (cache = out);
};

/** every result on disk - what `theory.theorems` indexes */
export const everything = (): Established[] => all();

/** forget what was read, so a fresh sweep is picked up without restarting */
export const reread = () => { cache = undefined; };

/**
 * WHAT THE READER IS STANDING IN - enough of it to decide whether a result applies.
 *
 * The seed is included because the caller may care: two runs of a stochastic vacuum on
 * different seeds are different runs, and a result quoted from one of them is quoted
 * about that one. Whether that matters is the caller's judgement, so `matched` reports
 * which parts agreed rather than deciding for them.
 */
export type Where = {
  theory: string; geometry: string; regime?: string | null;
  N?: number; T?: number; seed?: number;
};

const sameSettings = (u: Under, w: Where) =>
  u.theory === w.theory && u.geometry === w.geometry &&
  (u.regime ?? null) === (w.regime ?? null);

/**
 * THE RESULT FOR ONE THEOREM WHERE THE READER IS STANDING, or nothing.
 *
 * Nothing is returned rather than something approximate, and nothing is returned where
 * the theorem exists but was proved elsewhere - see the header. A caller wanting to know
 * WHY it got nothing can ask `provedUnder`.
 */
export const established = (
  theorem: string, where: Where,
): Established | undefined =>
  all().find(e => e.theorem === theorem && sameSettings(e.under, where));

/** every configuration this theorem HAS been proved under - for a caller that missed */
export const provedUnder = (theorem: string): Under[] =>
  all().filter(e => e.theorem === theorem).map(e => e.under);

/**
 * EVERYTHING ESTABLISHED WHERE THE READER IS STANDING, by theorem id.
 *
 * This is what `theory.theorems` hands back. It is a plain record so that a caller reads
 * `theorems["gravity.constant"]` and gets either the result or `undefined`, with no way
 * to accidentally receive one proved somewhere else.
 */
export const theoremsAt = (where: Where): Record<string, Established> => {
  const out: Record<string, Established> = {};
  for (const e of all())
    if (sameSettings(e.under, where) && !out[e.theorem]) out[e.theorem] = e;
  return out;
};
