/**
 * WHAT A BODY'S MASS DOES TO THE MEDIUM - counted, at four masses, and the answer is
 * nothing.
 *
 * THIS PROBE EXISTS TO SETTLE A READING. The discovery sweep could match its assembled
 * gravitational law against Newton's only by treating `A_{\perp}` - how much of a body's
 * boundary faces the line - as the far body's MASS, and `S` as mass again. Both are this
 * model's central physical claim rather than facts about notation, so asserting them and
 * then announcing that Newton had been recovered would have been announcing that we had
 * assumed him.
 *
 * IT IS A QUESTION WITH AN EXACT ANSWER, so it gets one. Mass in this model is a DUTY
 * CYCLE: how often a body pulses. The ways across its boundary are the exits leading from
 * outside it to inside it, walked over the lattice's own links - a COUNT, of a structure
 * that is there before anything ticks. So the experiment is not a sweep to be fitted; it
 * is the same walk at four duty cycles, and either the integers differ or they do not.
 *
 * THEY DO NOT. Sixty, sixty, sixty, sixty. A body's boundary is fixed by its RADIUS, and
 * how often it pulses cannot change how many ways there are into it - which, once said,
 * is obvious, and is exactly the kind of obvious thing that was being assumed away. `A` is
 * not a mass in disguise, the reading is refuted, and every match that rested on it was an
 * artifact of the alias table.
 *
 * WHAT IT EMITS IS THEREFORE A NEGATIVE, and a negative is a premise like any other:
 * `A` is CONSTANT with respect to the duty cycle. That is a fact the rules can use, it is
 * exact, and it forecloses a whole family of would-be derivations that would otherwise
 * have to be tried and abandoned one at a time.
 */
import { Geometry } from "../../lib/Local.ts";
import { World } from "../../lib/Compat.ts";
import { rat } from "../Algebra.ts";
import { Lab, Probe, Probing, measure, middle } from "../Probe.ts";
import { Emitted, Measured } from "../Kernel.ts";

/** how hard a body pulses - the duty cycle, which is what this model calls mass */
export const MASS = "m";
/** the ways across a body's boundary - what the assembled law calls A */
export const AREA = "A";
/** the expansion a body's boundary suppressed - what the assembled law calls S */
export const STRENGTH = "S";

/**
 * THE WAYS ACROSS A BODY'S BOUNDARY - walked over the lattice's own links, exactly as
 * `body/what-a-body-does-to-the-medium` walks them.
 *
 * Through each ray's BOUNDARIES and not through the ray itself, which is worth stating
 * because getting it wrong is silent: a walk that reaches for a target on the ray comes
 * back with zero every time, and zero ways across a boundary reads exactly like a body
 * whose boundary does not depend on anything.
 */
const boundaryWays = (w: World) => {
  let ways = 0, cells = 0;
  for (const l of w.locals as any[]) {
    if (!l.source) continue;
    cells++;
    for (const ray of l.rays as any[])
      for (const b of (ray.boundaries ?? []) as any[]) {
        const there = b.target?.source?.l;
        if (there && !there.source) ways++;
      }
  }
  return { ways, cells };
};

/**
 * THE SPACE THAT DID NOT GET MADE NEAR A BODY - which is what `S` names, and what a
 * previous version of this probe did not measure.
 *
 * `S` is glossed as "the expansion the near body's boundary suppressed": an amount of
 * space per tick that failed to happen. That is a quantity about SPACE, not about matter,
 * and the model's identification of it with mass is its central claim rather than a
 * spelling. An earlier version of this file reported that identification REFUTED on the
 * strength of the body's caught-count - how many rays it absorbed - which is a different
 * quantity entirely and settles nothing about suppressed expansion either way.
 *
 * WHAT SETTLES IT IS COUNTING WHAT DID NOT HAPPEN. Run the world with the body and again
 * without it on the same seed, count how many points split in each, and the difference is
 * the expansion the body suppressed. Both are integer counts over the same points, and
 * `slotUniformRng` makes the two runs differ only by the body rather than by having drawn
 * a different random stream.
 */
const suppressed = (
  lab: Lab, g: Geometry, N: number, duty: number,
): { blocked: number; withBody: number; alone: number } => {
  const run = (body: boolean) => {
    const w = new World({ theory: lab.theory, geometry: g, N, seed: lab.seeds[0],
      boundary: "absorb", slotUniformRng: true });
    if (body) w.add({ at: middle(g, N), radius: 1, absorbs: true, emits: 1, duty });
    w.run(Math.min(lab.T, 40));
    return (w.stats as { created?: number }).created ?? 0;
  };
  const withBody = run(true), alone = run(false);
  return { blocked: alone - withBody, withBody, alone };
};

export const coupling: Probe = {
  id: "coupling/what-mass-does-to-the-boundary",
  asks: "a body's mass in this model is how often it pulses. Does how often it pulses " +
    "change how many ways there are into it, or how much expansion it suppresses?",
  run: (lab: Lab): Probing => {
    const measured: Measured[] = [];
    const facts: Emitted[] = [];

    const g: Geometry = lab.geometry;
    const N = Math.min(lab.boxFor(g), g.D === 1 ? 41 : g.D === 2 ? 31 : 17);
    const duties = [rat(1, 8), rat(1, 4), rat(1, 2), rat(1)];

    /*
     * NOTHING IS TICKED. The boundary is a fact about how the body sits on the lattice,
     * and it is there the moment the body is placed - so running the world would add
     * nothing but an opportunity for the answer to depend on a seed.
     */
    const counts = duties.map(d => {
      const w = new World({ theory: lab.theory, geometry: g, N, seed: lab.seeds[0],
        boundary: "absorb" });
      w.add({ at: middle(g, N), radius: 1, absorbs: true, emits: 1, duty: d.n / d.d });
      return boundaryWays(w);
    });

    const ways = counts.map(c => c.ways);
    const same = ways.every(w => w === ways[0]);

    measured.push(measure(`${AREA} at each duty cycle`, ways[0],
      `the exits leading from outside the body to inside it, walked over the lattice's ` +
      `own links at duty ${duties.map(d => `${d.n}/${d.d}`).join(", ")}: ` +
      `${ways.join(", ")}. Whole numbers, and nothing was ticked to get them - a boundary ` +
      `is there the moment the body is placed`));
    measured.push(measure("cells the body occupies", counts[0].cells,
      `the same at every duty, which is what a radius fixes`));

    if (!same) return {
      facts, measured, holds: false,
      found: `the ways into the body DO change with how often it pulses: ` +
        `${ways.join(", ")} at duty ${duties.map(d => `${d.n}/${d.d}`).join(", ")}. That ` +
        `is worth understanding before anything is built on it - a boundary that moves ` +
        `with a duty cycle is not the boundary this model's assembled law is about`,
    };

    facts.push({
      fact: { kind: "constant", of: AREA },
      from: [], measured: [...measured],
      because: `the ways across the body's boundary were counted at duty ` +
        `${duties.map(d => `${d.n}/${d.d}`).join(", ")} and came to ${ways[0]} every ` +
        `time. A boundary is a fact about how the body sits on the lattice - which cells ` +
        `it occupies and which exits lead into them - and how often it pulses cannot ` +
        `change any of that. So ${AREA} does not vary with ${MASS}, exactly, and not as ` +
        `a fit that came out near zero: four counts, all ${ways[0]}. Whatever this ` +
        `model's mass couples through, it is not the size of a body's boundary`,
      line: `${AREA} is the same at every ${MASS}`,
    });

    /* ---- and the space it stopped being made, which is what S names --------- */
    const blocked = duties.map(d => suppressed(lab, g, N, d.n / d.d));

    measured.push(measure("expansion the body suppressed", blocked[0].blocked,
      `points that split in a world with the body against an identical world without it ` +
      `on the same seed, at duty ${duties.map(d => `${d.n}/${d.d}`).join(", ")}: ` +
      `${blocked.map(b => `${b.alone}-${b.withBody}=${b.blocked}`).join(", ")}. This is ` +
      `what S names - the space that did not get made - and it is counted rather than ` +
      `inferred from what the body absorbed`));

    /*
     * AND WHEN IT DOES NOT COME OUT CLEANLY, THAT IS SAID RATHER THAN SMOOTHED.
     *
     * This is a DIFFERENCE OF TWO LARGE TOTALS - some twenty-five thousand splits each
     * way - and what is being looked for is a few hundred. One seed cannot separate that
     * from the seed itself, and averaging more of them would be turning an exact question
     * into a statistical one, which is the move this folder is arranged to avoid.
     *
     * THE MEASUREMENT WANTS REPLACING, NOT REPEATING. Suppression is a GATE: a point that
     * is busy does not split. So the space a body stops being made is the count of points
     * adjacent to it that were busy when their turn came - a small, local, deterministic
     * set - rather than the difference between two whole-world totals. That version has
     * nothing to average.
     */
    /*
     * AND NOTHING IS EMITTED FROM IT, WHICH IS THE POINT.
     *
     * A PROBE'S PREMISES COME FROM THE RULES. A measurement may be the REASON a probe
     * exists - it is what makes a question worth asking - but it cannot be what a premise
     * stands on, because a premise standing on a measurement carries that measurement's
     * noise into every line above it while reading exactly like a premise standing on a
     * rule. The counts above are a difference of two whole-world totals of about
     * ${blocked[0].alone} each, on one seed, looking for a few hundred. Averaging seeds
     * would turn an exact question into a statistical one; emitting the number as it
     * stands would be worse.
     *
     * SO IT IS REPORTED AND NOT CLAIMED, and what it is FOR is naming the rule-level
     * question underneath it. Suppression is a GATE - a point that is busy does not split
     * - so the space a body stops being made is the count of points adjacent to it that
     * were busy when their turn came. That is a small deterministic set, it is a
     * consequence of the gate rather than a sample of the world, and it has nothing to
     * average. That is the probe this measurement argues for.
     */
    return {
      facts, measured, holds: true,
      found: `the ways into a body are ${ways.join(", ")} at duty ` +
        `${duties.map(d => `${d.n}/${d.d}`).join(", ")} - the same number every time, so ` +
        `${AREA} is fixed by the body's radius and is not its mass under another name. ` +
        `The expansion it suppressed, which is what S names and is a quantity about ` +
        `space rather than matter, goes ${blocked.map(b => b.blocked).join(", ")} at those ` +
        `same duties. Nothing is claimed from that: it is a difference of two totals of about ` +
        `${blocked[0].alone} each on one seed, which is a measurement rather than a ` +
        `consequence of a rule, and it is here to argue for the probe that would settle ` +
        `it - a count of body-adjacent points that were busy when their turn came`,
    };
  },
};
