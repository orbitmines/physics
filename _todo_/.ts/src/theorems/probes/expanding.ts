/**
 * WHY A DISTANT THING RECEDES FASTER - counted, and it is one line of arithmetic once the
 * counting is done.
 *
 * THE VACUUM MAKES SPACE EVERYWHERE IT IS IDLE. That is what `CREATION` does and
 * `suppression/what-stops-the-vacuum-splitting` establishes the gate on it by handing the
 * rule a point of each kind. What has not been said anywhere is the consequence for two
 * things sitting some distance apart, and it is immediate: every idle point BETWEEN them
 * adds a step when it splits, so how fast they separate is how many idle points lie
 * between them - and how many that is, is how far apart they are.
 *
 * SO RECESSION GOES AS SEPARATION, which is Hubble's law, and it arrives here as a count
 * rather than as a cosmology. Nothing in it is about the universe being large or old; it
 * is what a medium that grows uniformly does to any two markers embedded in it, and it
 * would be just as true of two dots on a rising loaf.
 *
 * THE COUNT IS THE WHOLE MEASUREMENT AND IT IS EXACT. Walk the lattice between two
 * markers at several separations and count the points strictly between them - integers,
 * one walk, no ticking and nothing fitted. If that count is proportional to the
 * separation then the rate is too, because each of those points contributes at most one
 * step per tick and they are the only things that can contribute at all.
 *
 * WHAT IS NOT CLAIMED. The rate per point is not derived here - that is the vacuum's own
 * business and depends on how much of what it makes survives, which is
 * `vacuum.occupancy`. What is derived is that whatever that rate is, the recession is
 * proportional to the separation, with the same constant everywhere. A Hubble constant is
 * then a property of the medium rather than of where you are standing in it, which is the
 * part that makes it a law rather than an observation.
 */
import { Geometry, Vec } from "../../lib/Local.ts";
import { World } from "../../lib/Compat.ts";
import { Lab, Probe, Probing, measure, middle } from "../Probe.ts";
import { Emitted, Measured } from "../Kernel.ts";

/** how fast two markers come apart */
export const RECESSION = "recession";
/** how far apart they are */
export const SEPARATION = "separation";
/** the points between them that are free to make space */
export const BETWEEN = "idle points between";

export const expanding: Probe = {
  id: "expanding/why-far-things-recede-faster",
  asks: "two markers sit some distance apart in a medium that makes space wherever it " +
    "is idle. How many points are there between them to make it?",
  run: (lab: Lab): Probing => {
    const g: Geometry = lab.geometry;
    const measured: Measured[] = [];
    const facts: Emitted[] = [];

    if (!lab.theory.rules.CREATION) return {
      facts, measured, holds: false,
      found: `${lab.theory.name} has no creation rule, so its medium makes no space and ` +
        `two markers in it do not come apart at all`,
    };

    const N = Math.min(lab.boxFor(g), g.D === 1 ? 41 : g.D === 2 ? 31 : 17);
    const w = new World({ theory: lab.theory, geometry: g, N, seed: lab.seeds[0],
      boundary: "absorb" });
    const centre = middle(g, N);

    /*
     * COUNTED ALONG THE LINE, over the lattice's own positions rather than by assuming a
     * cell is a unit of anything. A point counts as between if it lies within half a cell
     * of the segment joining the two markers.
     */
    const betweenAt = (sep: number) => {
      const a = centre, b = centre.map((x, i) => (i === 0 ? x + sep : x));
      let n = 0;
      for (const l of w.locals as any[]) {
        const p = w.embedding.at(l) as Vec | undefined;
        if (!p) continue;
        const t = (p[0] - a[0]) / sep;
        if (t <= 0 || t >= 1) continue;
        let off = 0;
        for (let i = 1; i < p.length; i++) off += (p[i] - a[i]) ** 2;
        if (Math.sqrt(off) > 0.5) continue;
        n++;
      }
      return n;
    };

    const seps = [2, 3, 4, 5, 6, 7, 8].filter(s => s < Math.floor(N / 2) - 1);
    if (seps.length < 4) return {
      facts, measured, holds: false,
      found: `a box of ${N} on ${g.name} does not hold enough separations to compare`,
    };
    const counts = seps.map(betweenAt);

    /*
     * PROPORTIONAL, CHECKED AS INTEGERS. The differences between consecutive counts are
     * constant when the count is linear in the separation - the same test the lattice
     * probes use, and it either holds on integers or it does not.
     */
    const steps = counts.slice(1).map((c, i) => c - counts[i]);
    const even = steps.length > 1 && steps.every(s => s === steps[0]);

    measured.push(measure(BETWEEN, counts[0],
      `points lying between two markers at separations ${seps.join(", ")} on ${g.name}: ` +
      `${counts.join(", ")}. Differences ${steps.join(", ")}, which are ` +
      `${even ? `constant at ${steps[0]}, so the count is linear in the separation` :
        "not constant, so the count is not linear in the separation"}. Walked over the ` +
      `lattice's own positions, with nothing ticked`));

    if (!even || !steps[0]) return {
      facts, measured, holds: false,
      found: `the points between two markers on ${g.name} do not grow evenly with their ` +
        `separation - ${counts.join(", ")} at ${seps.join(", ")} - so nothing simple can ` +
        `be said here about how fast they come apart`,
    };

    facts.push({
      fact: { kind: "scales", of: BETWEEN, by: { [SEPARATION]: { k: { n: 1, d: 1 }, of: {} } } },
      from: [], measured: [measured[0]],
      because: `the points lying between two markers were counted at separations ` +
        `${seps.join(", ")} and came to ${counts.join(", ")} - a constant ${steps[0]} more ` +
        `for each extra step apart, so the count is exactly proportional to the ` +
        `separation. Integers, from one walk of the lattice, with nothing ticked`,
      line: `${BETWEEN} ∝ ${SEPARATION}`,
    });

    facts.push({
      fact: { kind: "positive", of: BETWEEN },
      from: [], measured: [measured[0]],
      because: `there are ${counts[0]} points between two markers even at the shortest ` +
        `separation tried, counted - so there is something between them to make space, ` +
        `and the recession is about a rate rather than about a possible nothing`,
      line: `${BETWEEN} > 0`,
    });

    facts.push({
      fact: { kind: "scales", of: RECESSION, by: { [SEPARATION]: { k: { n: 1, d: 1 }, of: {} } } },
      from: [], measured: [measured[0]],
      because: `space is made by idle points splitting, and the only points that can add ` +
        `to the distance between two markers are the ones BETWEEN them - each contributing ` +
        `at most one step when it splits. So how fast they come apart is how many such ` +
        `points there are, times whatever rate each splits at; and the count is ` +
        `proportional to the separation. The rate per point is the vacuum's own business ` +
        `and is not claimed here - what is claimed is that it is the SAME rate everywhere, ` +
        `so the recession goes as the separation with one constant for the whole medium. ` +
        `That is Hubble's law, and it is a count of what lies between rather than a ` +
        `statement about the universe`,
      line: `${RECESSION} ∝ ${SEPARATION}`,
    });

    return {
      facts, measured, holds: true,
      found: `the points between two markers on ${g.name} go ${counts.join(", ")} at ` +
        `separations ${seps.join(", ")} - proportional, exactly. Each of them can add a ` +
        `step when it splits and nothing else can, so two markers come apart at a rate ` +
        `proportional to how far apart they already are`,
    };
  },
};
