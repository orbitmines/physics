/**
 * WHAT A BODY TAKES OUT OF THE MEDIUM, AND WHAT IT OFFERS BACK TO IT - both counted.
 *
 * TWO INTEGERS, AND NEITHER IS FITTED. How much of a disturbance a body makes is the
 * number of rays it removes per tick, which the source's own ledger records exactly; how
 * much of the medium a body is open to is the number of ways in through its surface,
 * which is a walk of the lattice around it. Neither is a slope, neither has a tolerance,
 * and neither changes if the box does.
 *
 * NOTE WHAT IS *NOT* CLAIMED HERE. The falloff is not measured, and no profile is taken:
 * the shortfall around a single body is exactly the reading that does not resolve, and
 * `medium.ts` explains at length why this folder stopped trying to take it. All that is
 * wanted from a body is that it disturbs the medium AT ALL and by how much at its own
 * surface. Everything after that - how the disturbance thins with distance - comes from
 * transport conserving it and the lattice having more room further out, which are
 * established elsewhere and exactly.
 *
 * A THEORY WHOSE BODIES DISTURB NOTHING FAILS HERE, and that is the point of the probe
 * rather than an edge case. `G^CONSERVING` destroys nothing, so what an absorber removes
 * is immediately remade and the count comes back zero: no `positive`, and the law derived
 * about the force is then a law about a quantity nothing showed to be there. Said that
 * way round it is a result about the theory instead of a silent zero on a page.
 */
import { Geometry, Vec } from "../../lib/Local.ts";
import { World } from "../../lib/Compat.ts";
import { Lab, Probe, Probing, box, measure, middle } from "../Probe.ts";
import { Emitted, Measured } from "../Kernel.ts";
import { DEFICIT, STRENGTH } from "./medium.ts";

/** how much of the medium a body is open to - the ways in through its surface */
export const AREA = "A";

/** the rays a source has taken in, over all its cells and exits */
const caught = (s: any): number =>
  (s.caught as number[]).reduce((a, b) => a + b, 0);

export const absorber: Probe = {
  id: "body/what-a-body-does-to-the-medium",
  asks: "does a body disturb the medium at all, how much of it does it remove per tick, " +
    "and how many ways into it are there?",
  run: (lab: Lab): Probing => {
    const g: Geometry = lab.geometry;
    const measured: Measured[] = [];
    const facts: Emitted[] = [];

    const N = lab.boxFor(g);
    const centre: Vec = middle(g, N);
    const radius = Math.max(1, Math.min(2, Math.floor((N - 1) / 4)));

    const w: World = box(lab, g, N, lab.seeds[0], "absorb");
    w.add({ at: centre, radius, absorbs: true, emits: 1, duty: 0 });

    /*
     * LONG ENOUGH FOR THE MEDIUM TO HAVE REACHED THE BODY, and no longer. This is a rate,
     * so what is wanted is a total over ticks divided by ticks; the only thing a longer
     * run buys is a steadier average, and the quantity being established is whether it is
     * greater than zero.
     */
    const ticks = Math.max(20, Math.min(lab.T, 80));
    w.run(ticks);

    const s = (w.sources as any[])[0];
    const removed = caught(s), rate = removed / ticks;

    measured.push(measure("rays the body removed per tick", rate,
      `${removed} taken in over ${ticks} ticks by a body of radius ${radius} on ` +
      `${g.name}, counted off the source's own ledger - a count, not a fit`));

    /*
     * THE WAYS IN, counted by walking the lattice around the body: every exit that leads
     * from outside the body to inside it. That is the body's cross-section as this model
     * has one, and it is the quantity a force is proportional to.
     */
    let ways = 0, cells = 0;
    for (const l of w.locals as any[]) {
      if (!l.source) continue;
      cells++;
      for (const ray of l.rays as any[])
        for (const b of ray.boundaries as any[]) {
          const there = b.target?.source?.l;
          if (there && !there.source) ways++;
        }
    }
    measured.push(measure("ways into the body", ways,
      `${cells} cells with ${ways} exits leading in from outside, walked over the ` +
      `lattice's own links on ${g.name}`));

    const there = rate > 0;

    if (there) {
      facts.push({
        fact: { kind: "positive", of: DEFICIT },
        from: [], measured: [measured[0]],
        because: `the body took ${removed} rays out of the medium over ${ticks} ticks. ` +
          `Those rays are not there any more, so the medium around it is short of them - ` +
          `a whole number greater than zero, counted rather than inferred from a profile`,
        line: `${DEFICIT} > 0`,
      });
      facts.push({
        fact: { kind: "positive", of: STRENGTH },
        from: [], measured: [measured[0]],
        because: `a body that removes ${rate.toFixed(2)} rays a tick makes that much ` +
          `disturbance a tick, and that is what S names`,
        line: `${STRENGTH} > 0`,
      });
    }

    if (ways > 0) facts.push({
      fact: { kind: "positive", of: AREA },
      from: [], measured: [measured[1]],
      because: `there are ${ways} exits leading into the body from outside, so there is ` +
        `something for the medium to arrive through`,
      line: `${AREA} > 0`,
    });

    return {
      facts, measured, holds: there,
      found: there
        ? `a body of radius ${radius} removes ${rate.toFixed(2)} rays a tick from the ` +
          `medium and has ${ways} ways in`
        : `a body in ${lab.theory.name} removes nothing from the medium (${removed} rays ` +
          `over ${ticks} ticks), so there is no disturbance here for anything to be ` +
          `pulled into`,
    };
  },
};
