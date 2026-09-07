/**
 * THE ROOM AROUND A SOURCE OF ANY EXTENT - point, wire, sheet, and whatever else this
 * lattice has room for, in one walk.
 *
 * THE GENERAL FORM OF THE ONLY ARGUMENT THIS REPOSITORY MAKES. Whatever is conserved and
 * spread evenly is diluted by exactly the room it is spread over, and every falloff here
 * is that sentence with a different amount of room in it. `lattice.shell-growth` counts
 * the room around a POINT and gets `r^{D-1}`; the inverse-square law is that and nothing
 * else. But nothing in the argument cares that the source was a point, and the moment it
 * is not one the answer changes - so the honest question is not "what is the field of a
 * wire" but "how much room is there around a source of extent k", asked once, for every k
 * the lattice can hold.
 *
 * WHICH IS WHY THIS FILE IS NOT ABOUT WIRES. An earlier version of it was: it seeded a
 * line, counted, and handed back Ampere's law - which is the right answer arrived at by
 * building an instrument that could only ever produce that answer. Written this way the
 * same walk produces the point charge, the wire and the charged plane together, and it
 * produces the k = 3 case on a lattice that has one without anybody deciding in advance
 * that such a thing is interesting.
 *
 * A SOURCE OF EXTENT k HAS ROOM OF DEGREE D-k, and the shell one below that. The k
 * directions along the source are already spanned, so nothing grows that way and all the
 * growth is across it. On three dimensions that gives:
 *
 *   k = 0   a point     ball r^{3}   shell r^{2}    the inverse square
 *   k = 1   a wire      ball r^{2}   shell r^{1}    Ampere's one-over-r
 *   k = 2   a sheet     ball r^{1}   shell r^{0}    a field that does not fall off at all
 *
 * The third of those is the one worth staring at: it says a charged plane's field is the
 * same everywhere, which is textbook electrostatics, and it arrives here as an exponent of
 * nought out of a difference table rather than as a Gaussian pillbox.
 *
 * WRAPPED, SO THE SOURCE HAS NO EDGES. A line that stops inside the box is a cylinder plus
 * two caps, and the caps grow the way a point does - which is exactly what would drag the
 * degree off an integer and turn a count into an argument about fitting. Wrapped, every
 * seed set closes on itself and there are no edges to contribute.
 *
 * AND THE DEGREE IS CHECKED ON INTEGERS. The k-th difference of the counts is constant, and
 * a sequence whose k-th difference is constant is a polynomial of degree k. No slope is
 * fitted anywhere and no logarithm is taken.
 */
import { Geometry, Vec } from "../../lib/Local.ts";
import { World } from "../../lib/Compat.ts";
import { expo } from "../Algebra.ts";
import { Lab, Probe, Probing, measure, middle } from "../Probe.ts";
import { Emitted, Measured } from "../Kernel.ts";

/** the room within r̄ steps of a source spanning k directions */
export const ballAbout = (k: number) => `ball about a ${k}-dimensional source`;
/** the rate that room grows at */
export const shellAbout = (k: number) => `shell about a ${k}-dimensional source`;
const RBAR = "\\bar{r}";

const diff = (v: number[]): number[] => v.slice(1).map((x, i) => x - v[i]);

/**
 * EVERY SITE LYING IN THE SOURCE - the k directions it spans are free, the rest are
 * pinned to the centre.
 *
 * k = 0 pins every direction and gives one site; k = D would pin none and give the whole
 * world, which is why the sweep stops one short of it.
 */
const spanning = (w: World, centre: Vec, k: number) => {
  const out: any[] = [];
  for (const l of w.locals as any[]) {
    const p = w.embedding.at(l) as Vec | undefined;
    if (!p) continue;
    let inIt = true;
    for (let i = k; i < p.length; i++)
      if (Math.abs(p[i] - centre[i]) > 0.5) { inIt = false; break; }
    if (inIt) out.push(l);
  }
  return out;
};

/** how many sites lie within r̄ steps of the whole seed set, walked over the exits */
const roomAbout = (seed: any[], upto: number): number[] => {
  const seen = new Set<any>(seed);
  let edge = seed;
  const out = [seen.size];
  for (let r = 1; r <= upto; r++) {
    const next: any[] = [];
    for (const l of edge)
      for (const ray of l.rays as any[])
        for (const b of (ray.boundaries ?? []) as any[]) {
          const there = b.target?.source?.l;
          if (!there || seen.has(there)) continue;
          seen.add(there); next.push(there);
        }
    if (!next.length) break;
    edge = next;
    out.push(seen.size);
  }
  return out;
};

export const extent: Probe = {
  id: "extent/room-around-a-source-of-any-size",
  asks: "how much room is there within \\bar{r} steps of a source that spans k directions, " +
    "for every k this lattice can hold?",
  run: (lab: Lab): Probing => {
    const g: Geometry = lab.geometry, D = g.D;
    const measured: Measured[] = [];
    const facts: Emitted[] = [];
    const found: string[] = [];

    /* wrapped, so every seed set closes on itself and contributes no edges */
    const N = Math.min(lab.boxFor(g), D === 1 ? 41 : D === 2 ? 41 : 21);
    const w = new World({ theory: lab.theory, geometry: g, N, seed: lab.seeds[0],
      boundary: "wrap" });
    const centre = middle(g, N);
    const upto = Math.max(D + 2, Math.min(6, Math.floor((N - 1) / 2) - 2));

    for (let k = 0; k < D; k++) {
      const seed = spanning(w, centre, k);
      if (!seed.length) { found.push(`k=${k}: no seed set could be picked out`); continue; }

      const balls = roomAbout(seed, upto);
      measured.push(measure(`sites within \\bar{r} of a ${k}-dimensional source`,
        seed.length,
        `seeded from ${seed.length} site${seed.length > 1 ? "s" : ""} spanning ${k} ` +
        `direction${k === 1 ? "" : "s"} of ${g.name}, walked over the lattice's own ` +
        `exits: ${balls.join(", ")} for \\bar{r} = 0, 1, 2, ...`));

      let seq = balls, order = 0, constant = false;
      const rounds: string[] = [`${ballAbout(k)}(\\bar{r}) = ${balls.join(", ")}`];
      while (seq.length > 1 && order < D + 2) {
        seq = diff(seq); order++;
        rounds.push(`Δ^{${order}} = ${seq.join(", ")}`);
        if (seq.length >= 2 && seq.every(x => x === seq[0])) { constant = true; break; }
      }
      const degree = constant ? order : NaN;

      measured.push(measure(`degree of that count in \\bar{r}`, degree,
        constant
          ? `the ${order}-th difference is constant at ${seq[0]}, and a sequence whose ` +
            `${order}-th difference is constant is a polynomial of degree ${order}. ` +
            `Integer arithmetic throughout - ${rounds.join("  |  ")}`
          : `the differences did not settle within ${D + 2} rounds - ${rounds.join("  |  ")}`));

      if (!constant) { found.push(`k=${k}: not a polynomial within ${D + 2} rounds`); continue; }
      if (degree !== D - k) {
        found.push(`k=${k}: degree ${degree}, where a source spanning ${k} of ${D} ` +
          `directions should leave ${D - k}`);
        continue;
      }

      facts.push({
        /*
         * THE DEGREE GOES ON THE FACT. Ehrhart gives a polynomial of the POLYTOPE's
         * dimension, and the polytope here is the cross-section - D-k, not D. Left off,
         * the rule downstream assumes D and a wire's field comes back with a sphere's
         * exponent in it.
         */
        fact: { kind: "dilate", of: ballAbout(k), by: RBAR,
          degree: expo(-k, { D: 1 }) },
        from: [], measured: [measured[measured.length - 2], measured[measured.length - 1]],
        because: `the sites within \\bar{r} steps of a source spanning ${k} ` +
          `direction${k === 1 ? "" : "s"} are the \\bar{r}-fold dilate of the sites within one ` +
          `step of it, in the ${D - k} directions ACROSS it - the source already spans ` +
          `the other ${k}, so nothing grows that way. Checked: the counts walked out of ` +
          `the lattice are a polynomial in \\bar{r} of degree ${degree}, which is D-${k}, ` +
          `exactly and on integers`,
        line: `${ballAbout(k)}(\\bar{r}) = |\\bar{r}·P_{\\perp} ∩ L|`,
        working: rounds,
      });
      facts.push({
        fact: { kind: "rate", of: shellAbout(k), from: ballAbout(k), in: RBAR },
        from: [], measured: [measured[measured.length - 1]],
        because: `the sites at exactly \\bar{r} steps from it are those within \\bar{r} less ` +
          `those within \\bar{r}-1, which is the rate the room grows at - the same relation ` +
          `between a shell and a ball however much of space the source itself takes up`,
        line: `${shellAbout(k)} = d(${ballAbout(k)}) / d${RBAR}`,
      });
      found.push(`k=${k}: room of degree ${degree}, so its shell goes as ` +
        `\\bar{r}^{${D - k - 1}}`);
    }

    return {
      facts, measured, holds: facts.length > 0,
      found: facts.length
        ? `the room around a source depends on how much of space the source itself ` +
          `spans, and on ${g.name} it comes out exactly one degree lower for each ` +
          `direction the source occupies - ${found.join("; ")}. Counted, not fitted`
        : `no seed set on ${g.name} gave a polynomial count: ${found.join("; ")}`,
    };
  },
};
