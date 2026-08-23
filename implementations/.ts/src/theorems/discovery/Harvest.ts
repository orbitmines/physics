/**
 * EVERYTHING THE RULES CAN REACH, ASKED WITHOUT A QUESTION - which is the difference
 * between this folder and the one above it.
 *
 * `Proof.prove` runs the probes a theorem named, saturates, and then asks
 * `conclusion(store, theorem.about)` for ONE quantity somebody typed. Saturation does not
 * stop at that quantity - it never did - so every run of the handmade sweep has been
 * deriving laws about things nobody looked up and throwing them away at the last line.
 * This reads them instead.
 *
 * THE UNION IS THE POINT. A theorem restricts itself to the probes it needs, and that
 * restriction is exactly what stops a conclusion from ever standing on two independent
 * measurements at once: `counts` and `medium` never met inside `gravity.falloff` because
 * that theorem did not ask for both. Here every probe in the catalogue runs into ONE
 * store, so a rule that wants a premise from the tiling and a premise from the medium can
 * have both - and a fact whose leaves come from two probes is the shape a bridge has.
 *
 * NOTHING HERE IS A NEW KIND OF INFERENCE. Same `RULES`, same `Store`, same `saturate`,
 * same refusal to accept a premise with no run behind it. What changes is that the goal
 * is not named in advance, so a conclusion cannot have been aimed at.
 *
 * WHICH IS ALSO WHY THE CAP MATTERS. Saturation over a union is a bigger closure than
 * saturation over six premises, and `substituting` against a store holding every
 * definition in the catalogue can grow for a long time before it stops. A cell that hits
 * the cap is kept and MARKED rather than thrown: what it found up to that pass is still
 * derived, and pretending an incomplete closure is a complete one is the one thing that
 * would make a "nothing was found about q" line a lie.
 */
import { Geometry } from "../../lib/Local.ts";
import { Store, saturate } from "../Kernel.ts";
import { Reached, reached } from "./Reached.ts";
import { Lab, Probe, Probing } from "../Probe.ts";
import { RULES } from "../Rules.ts";
import { THEOREMS } from "../Catalogue.ts";
import { additivity } from "../probes/additivity.ts";
import { carried } from "../probes/carried.ts";
import { extent } from "../probes/extent.ts";
import { doppler } from "../probes/doppler.ts";
import { expanding } from "../probes/expanding.ts";
import { reads } from "../probes/reads.ts";
import { saturation } from "../probes/saturation.ts";
import { suppression } from "../probes/suppression.ts";
import { survival } from "../probes/survival.ts";
import { turning } from "../probes/turning.ts";
import { coupling } from "../probes/coupling.ts";
import { tables } from "../probes/tables.ts";

/**
 * THE PROBES THAT SERVE NO THEOREM - and the reason discovery can reach past the
 * handmade folder at all.
 *
 * Every probe in the catalogue was written to supply a premise some theorem needed, which
 * puts a ceiling on what the closure can be about: a conclusion can only exist about a
 * quantity something measured. These measure without a theorem having asked.
 *
 * AND NOT ONE OF THEM FITS ANYTHING, which is a correction rather than a preference.
 * Three earlier ones did - they profiled ledgers against distance, swept two bodies over
 * separations, and fitted log-log slopes - and every one of them came back refusing its
 * own answer because the profiles died into noise inside a dozen cells. That is not bad
 * luck with the box size. It is the same wall `lattice.shell-growth` documents hitting
 * and then walking around: a fit gave 1.906 at N = 17, 1.950 at N = 21, 1.960 at N = 31,
 * creeping towards 2 and never arriving, and rounding that to 2 is a judgement call
 * standing exactly where a theorem ought to be. The answer was to ask the RULE instead -
 * one site per fundamental cell, Ehrhart, differencing - and get every radius exactly, on
 * any lattice, including radii no box could hold.
 *
 * AND IT ASKS THE GENERAL QUESTION, NOT THE ONE IT WANTS ANSWERED. That is a second
 * discipline and a harder one to keep. A probe that seeds a LINE and hands back Ampere's
 * law is exact, honest about its arithmetic, and still worthless as discovery: it could
 * only ever have produced the law it was built around. `extent` asks instead how much room
 * there is around a source spanning k directions, for every k the lattice holds - which
 * gives the point charge, the wire and the charged plane out of one walk, and gives the
 * k = 3 case on a lattice that has one without anybody deciding in advance that such a
 * thing is worth knowing. `carried` asks its questions of everything a theory says its
 * rays carry, read off the theory, rather than about the polarity by name. The general
 * form costs a few more lines and is the only version that can return something nobody
 * was looking for.
 *
 * AND THE SHARPEST FORM OF THE RULE, WHICH IS THE ONE TO KEEP: A PROBE'S PREMISES COME
 * FROM THE RULES. A MEASUREMENT MAY BE THE REASON A PROBE EXISTS AND MAY NEVER BE WHAT A
 * PREMISE STANDS ON.
 *
 * Those are different things and it is easy to let the second slide into the first,
 * because a measurement is often exactly what shows you a question is worth asking. The
 * distinction that matters is what the emitted FACT rests on. A premise resting on a
 * measurement carries that measurement's noise, its box size and its chosen tolerance
 * into every line derived above it - and on the page it reads precisely like a premise
 * resting on a rule. There is no way for a reader to tell them apart afterwards, which is
 * why they have to be kept apart here.
 *
 * TWO PROBES HAD TO BE CUT BACK UNDER IT, both of them mine and both recent. `coupling`
 * counted the space a body stopped being made by differencing two whole-world totals of
 * some twenty-five thousand each, on one seed, looking for a few hundred - and was set to
 * emit `S ∝ m` if those numbers happened to rise. `additivity` was set to emit the
 * additive decomposition of the force whenever two ticked channels agreed to within a
 * tenth. Both now measure, report, and supply nothing. What they are FOR is naming the
 * rule-level question underneath: for the first, that suppression is a gate, so the space
 * a body stops being made is the count of body-adjacent points that were busy when their
 * turn came - a deterministic set with nothing to average; for the second, whether
 * CREATION supplies what ANNIHILATION consumes, asked of the rules rather than of two
 * worlds' totals.
 *
 * SO A PROBE HERE INTERROGATES THE DYNAMICS RATHER THAN SAMPLING THEM. It isolates a rule
 * and counts integers, enumerates the states a rule can be handed, reads a rule's own
 * shape off the theory, or takes a rule out and looks at what stops working. What comes
 * back is exact and no run length or box can move it. A slope with an error bar on it is
 * not evidence here; it is a measurement standing where a derivation belongs.
 */
export const GENERIC: Probe[] = [tables, coupling, additivity, carried, extent, survival,
  turning, suppression, expanding, saturation, reads, doppler];

/** every probe any theorem names, once each - the union this file is about */
export const ALL_PROBES: Probe[] = (() => {
  const seen = new Map<string, Probe>();
  for (const e of THEOREMS) for (const p of e.theorem.probes) seen.set(p.id, p);
  for (const p of GENERIC) seen.set(p.id, p);
  return [...seen.values()];
})();

/** the quantity every handmade theorem asked about - what counts as already looked at */
export const ASKED: Map<string, string> = new Map(
  THEOREMS.map(e => [e.theorem.about, e.theorem.id]));

/** where a probe's answer is kept - see the note in `Proof.ts`, same reasoning */
const answered = new Map<string, Probing>();

const askedOf = (probe: Probe, lab: Lab) =>
  [probe.id, lab.theory.name, lab.geometry.name, lab.N, lab.T, lab.seeds.join("+")]
    .join("|");

export type Under = {
  theory: string;
  geometry: string;
  D: number;
  DEG: number;
  regime?: string;
  N: number;
  T: number;
  seeds: number[];
};

export type Cell = {
  under: Under;
  store: Store;
  /** what each probe found here, and whether it stood behind anything */
  ran: { probe: Probe; out: Probing; failed?: string }[];
  /** false when the closure hit the pass cap - what follows is a floor, not the whole */
  closed: boolean;
  /**
   * EVERY SUBJECT THIS CELL FINISHED A STATEMENT ABOUT - see `Reached.ts` for why this
   * is not `Kernel.conclusions`, which answers the narrower question of what a later
   * theorem may cite and drops a divergence, a ceiling, and anything a probe measured
   * directly.
   */
  concluded: Reached[];
};

export const under = (lab: Lab): Under => ({
  theory: lab.theory.name,
  geometry: lab.geometry.name,
  D: lab.geometry.D,
  DEG: lab.geometry.DEG,
  regime: lab.regime?.name,
  N: lab.N, T: lab.T, seeds: lab.seeds,
});

/** what a cell is called, in one string - the key every comparison across cells uses */
export const cellKey = (u: Under) =>
  `${u.theory}|${u.geometry}${u.regime ? `|${u.regime}` : ""}`;

/**
 * ONE WORLD'S WORTH OF CONSEQUENCES.
 *
 * Premises first and from runs only, then the definitions the catalogue carries, then
 * closure. The order is the same guarantee `Proof.prove` makes and for the same reason:
 * nothing downstream of saturation can reach back and add a premise, so what comes out is
 * a function of what the runs found.
 *
 * EVERY DEFINITION IN THE CATALOGUE COMES IN, and that is a real widening of what is
 * assumed - so it is worth saying exactly what it widens. A definition says what a word
 * means (`F = A·δ/site`); it has no run behind it and `Store.define` keeps it as its own
 * kind of leaf, countable and visible on the page. Union them and a candidate may lean on
 * a definition written for a theorem it has nothing to do with, which is either a genuine
 * bridge or a category error - and `Rank.ts` scores how many definitions a candidate
 * leans on precisely so that the second kind sinks.
 */
export const harvest = (lab: Lab, cap = 40): Cell => {
  const store = new Store();
  const ran: Cell["ran"] = [];

  for (const probe of ALL_PROBES) {
    const key = askedOf(probe, lab);
    let out = answered.get(key);
    if (!out) {
      try {
        out = probe.run(lab);
      } catch (e) {
        /* A PROBE THAT THROWS IS NOT A SWEEP THAT STOPS. Some probes are asked of
         * lattices they cannot afford or of theories missing the rule they isolate; that
         * is a fact about the pair and the rest of the union still has something to say.
         * It is recorded rather than swallowed. */
        ran.push({ probe, out: { facts: [], measured: [], found: String(e), holds: false },
          failed: String((e as Error).message ?? e) });
        continue;
      }
      answered.set(key, out);
    }
    ran.push({ probe, out });
    for (const f of out.facts) store.premise(f, probe.id);
  }

  for (const entry of THEOREMS)
    for (const d of entry.extra(lab))
      store.define({ fact: d.fact, from: [], because: d.because,
        line: (d as { line?: string }).line }, entry.theorem.id);

  let closed = true;
  try {
    saturate(store, RULES, cap);
  } catch {
    /* the cap, reached - see the header. What is in the store is still derived. */
    closed = false;
  }

  return { under: under(lab), store, ran, closed, concluded: reached(store) };
};
