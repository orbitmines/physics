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
import { rat } from "../Algebra.ts";
import { mul, num, sym } from "../Expr.ts";
import { Lab, Probe, Probing, box, measure, middle } from "../Probe.ts";
import { Emitted, Measured } from "../Kernel.ts";
import { DEFICIT, STRENGTH } from "./medium.ts";

/** how much of the medium a body is open to - the ways in through its surface */
export const AREA = "A";
/**
 * AND THE OTHER BODY'S, WHICH IS A DIFFERENT NUMBER.
 *
 * Two bodies are two bodies: what the far one catches with and what the near one lets its
 * shortfall out through are the same KIND of count - ways across a boundary - and not the
 * same count. Written with one symbol they multiplied into A², which says the two bodies
 * are the same size and is true of nothing but a coincidence.
 */
export const AREA_OTHER = "A'";
/**
 * AND HOW MUCH OF A BOUNDARY POINTS AT THE OTHER BODY.
 *
 * THE TWO SIDES ARE NOT SYMMETRIC AND THAT IS THE POINT OF THIS COUNT. What a body SENDS
 * spreads isotropically - a shortfall leaves through the whole of its boundary and is
 * shared over the whole shell, so how much arrives in any one direction is the total over
 * that shell whichever part of the surface it left through. The full area is right there.
 *
 * WHAT A BODY FEELS IS AN IMBALANCE, and only the exits lying along the line between the
 * two take part in it: rays arriving from the far side are unshadowed, rays from the near
 * side are short, and the difference pushes along that axis. An exit at right angles to
 * it catches the same either way and contributes nothing to the push. So the receiving
 * side is the FACING cross-section, not the whole surface - which is a fraction of it
 * fixed by how the tiling's exits are arranged, and therefore another count rather than
 * another parameter.
 */
export const FACING = "A_{\\perp}";

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

    /*
     * THE WAYS IN ARE ALSO THE WAYS OUT, and that is the quantity both channels use.
     *
     * A body's exits leading across its boundary are how much of the medium it is open to
     * - what it catches with - and equally how much of it can get out, which is what
     * limits the shortfall a body sends into the medium around it. Emitted as a count so
     * that both readings stand on the same walked number rather than on two.
     */
    /*
     * THE WAYS IN ARE ALSO THE WAYS OUT, and both channels of the force use that count.
     *
     * A body's exits crossing its boundary are how much of the medium it is open to - what
     * it catches with - and equally how much of what it disturbs can get out, which is what
     * limits the shortfall it sends into the medium around it. It is left as a SYMBOL
     * rather than pinned to the walked number, because the number is this body's and the
     * law is every body's; the count is reported beside it as the measurement it is.
     */
    /*
     * THE FACING FRACTION, counted off the exit set: of all the ways across a boundary,
     * how much of them points along a given line. Weighted by the component, because an
     * exit at a shallow angle takes a shallow share of the push.
     */
    let along = 0;
    for (const u of g.U) along += Math.max(0, u[0]);
    const facing = along / g.DEG;
    measured.push(measure("the facing share of a boundary", facing,
      `summing each exit's component along the line and dividing by all ${g.DEG} of ` +
      `them on ${g.name}: an exit square-on to the line takes a full share of the push, ` +
      `one at right angles takes none. A count of the tiling, not a parameter`));

    /*
     * LEFT AS A SYMBOL, AND THE FRACTION REPORTED BESIDE IT.
     *
     * Written into the law as a number this comes out 0.236 on fcc-12 - and that is not a
     * count, it is a sum of direction cosines, which on this tiling is 1/(3*sqrt(2)) and
     * on others something else irrational. Rounded to a rational to fit the algebra it
     * became 59/250 sitting in front of the gravitational law, which reads exactly like
     * the fitted parameter this whole folder exists not to have. The facing cross-section
     * is a real quantity and belongs in the law by name; how big a share of the boundary
     * it is on a given tiling is a measurement, and stays one.
     */
    facts.push({
      fact: { kind: "constant", of: FACING },
      from: [], measured: [measured[measured.length - 1]],
      because: `a body feels an IMBALANCE - fewer rays from the shadowed side than the ` +
        `far one - and only the exits lying along that line take part in it; one at ` +
        `right angles catches the same either way and contributes nothing. So what ` +
        `receives is the facing cross-section, which on ${g.name} is ` +
        `${facing.toFixed(3)} of the whole boundary - a sum of direction cosines rather ` +
        `than a count, so it is carried by name and not as a number`,
      line: `${FACING} is the facing cross-section`,
    });
    facts.push({
      fact: { kind: "positive", of: FACING },
      from: [], measured: [measured[measured.length - 1]],
      because: "some of a boundary always points along any given line",
      line: `${FACING} > 0`,
    });

    if (ways > 0) facts.push({
      fact: { kind: "positive", of: AREA_OTHER },
      from: [], measured: [measured[1]],
      because: `the other body has a boundary too, with its own ways across it - the same ` +
        `kind of count, of a different body`,
      line: `${AREA_OTHER} > 0`,
    });
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
