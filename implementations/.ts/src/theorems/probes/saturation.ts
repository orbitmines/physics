/**
 * A POINT CANNOT LOSE MORE THAN IT HAS - the ceiling, counted, and where a falloff meets
 * it is a horizon.
 *
 * EVERY FALLOFF IN THIS FOLDER IS UNBOUNDED AND NONE OF THEM CAN BE. `deficit ∝ S/r^{D-1}`
 * grows without limit as r goes to nothing, and what it counts is how many of a point's
 * rays are missing - a point with DEG exits cannot be missing DEG+1 of them. So the law is
 * a statement about the region where it has not yet run into the only ceiling the
 * arithmetic already has, and somewhere inside that region the two meet.
 *
 * WHERE THEY MEET IS A SURFACE INSIDE WHICH NOTHING GETS OUT. Every exit dark means
 * nothing leaves the point by any route, because leaving is what an exit is. That is a
 * horizon in the only sense this model can have one, and it is not put in - it is what
 * happens when a law that has to increase meets a count that cannot.
 *
 * THE CEILING IS EXACT AND IS NOT MEASURED SO MUCH AS COUNTED: a point has DEG exits, so
 * at most DEG of them can be dark. There is no run in it and no way for it to come out
 * otherwise on a given tiling.
 *
 * AND THE RADIUS THAT FOLLOWS IS A PREDICTION THAT DIFFERS FROM THE STANDARD ONE, which is
 * the interesting part and the reason this is worth deriving rather than assuming. Setting
 * S/r^{D-1} against DEG gives r ∝ S^{1/(D-1)} - on three dimensions the square root of the
 * mass, where the Schwarzschild radius is proportional to the mass. Those are different
 * laws, so either this model is wrong about horizons or the standard one is, and the
 * discovery sweep should say so out loud rather than quietly matching whichever it can.
 */
import { Geometry } from "../../lib/Local.ts";
import { rat } from "../Algebra.ts";
import { Lab, Probe, Probing, measure } from "../Probe.ts";
import { Emitted, Measured } from "../Kernel.ts";

/** how much of a point can be missing at once */
export const CEILING = "DEG";
/**
 * THE SHORTFALL AT ONE POINT, which is what the ceiling actually bounds.
 *
 * NOT the deficit, which is the whole of what a body took out of the medium and has no
 * ceiling at all - a heavier body removes more, without limit. What cannot exceed DEG is
 * what ONE POINT is missing, and that is the spread quantity: the total shared out over
 * the sites at that distance. Bounding the total instead was a silent miss - the rule
 * looking for a falloff to cross found no law about `deficit` itself, because every law
 * here is about its density, and nothing fired.
 */
export const DEFICIT = "n[deficit]";
/** where the shortfall reaches the ceiling and nothing gets out */
export const HORIZON = "horizon";

export const saturation: Probe = {
  id: "saturation/what-a-point-cannot-lose-more-than",
  asks: "the shortfall around a body grows without limit as you approach it. How much " +
    "shortfall can one point actually hold?",
  run: (lab: Lab): Probing => {
    const g: Geometry = lab.geometry;
    const measured: Measured[] = [];
    const facts: Emitted[] = [];

    /*
     * COUNTED OFF THE TILING, with nothing running. How many ways out of a point there
     * are is what DEG means, and how many of them can be dark at once is that same
     * number - a point cannot be missing an exit it does not have.
     */
    measured.push(measure(CEILING, g.DEG,
      `the ways out of a point on ${g.name}, counted. A shortfall at a point is exits ` +
      `that are dark, and there are ${g.DEG} of them, so the shortfall at one point can ` +
      `be at most ${g.DEG}. Read off the tiling with nothing ticked, and there is no way ` +
      `for it to come out otherwise`));

    facts.push({
      fact: { kind: "bound", of: DEFICIT, atMost: CEILING },
      from: [], measured: [measured[0]],
      because: `a shortfall at a point is how many of its exits are dark, and a point on ` +
        `${g.name} has ${g.DEG} exits. It cannot be missing one it does not have. So ` +
        `every law about how the shortfall grows is a law about the region where it has ` +
        `not yet reached ${g.DEG} - which is a limit the arithmetic already had rather ` +
        `than one imposed on it`,
      line: `${DEFICIT} \\leq ${CEILING}`,
    });

    facts.push({
      fact: { kind: "positive", of: CEILING },
      from: [], measured: [measured[0]],
      because: `a point on ${g.name} has ${g.DEG} ways out of it, which is more than none`,
      line: `${CEILING} > 0`,
    });

    /*
     * AND WHAT LIES INSIDE IT IS NOT A SMALLER FIELD, IT IS NO SIGNAL AT ALL. Worth
     * stating separately from the bound, because the bound alone reads as an
     * approximation breaking down, and this is not that: every exit dark means nothing
     * leaves the point by any route, since leaving is what an exit is.
     */
    facts.push({
      fact: { kind: "value", of: `what leaves a point at the ${HORIZON}`, equals: rat(0) },
      from: [], measured: [measured[0]],
      because: `at the ceiling every one of a point's ${g.DEG} exits is dark. Leaving is ` +
        `what an exit is, so nothing leaves such a point by any route - not a weakened ` +
        `signal, none. That is a horizon in the only sense this model has one, and it is ` +
        `not put in anywhere: it is where a law that has to keep growing meets a count ` +
        `that cannot`,
      line: `what leaves a point at the ${HORIZON} = 0`,
    });

    return {
      facts, measured, holds: true,
      found: `a point on ${g.name} has ${g.DEG} exits, so the shortfall at one point is ` +
        `at most ${g.DEG} - and where the falloff reaches it, every exit is dark and ` +
        `nothing leaves at all. The horizon is where an unbounded law meets the only ` +
        `ceiling the arithmetic already had`,
    };
  },
};
