/**
 * THE TILING'S OWN NUMBERS - read off the geometry, exactly, with nothing running.
 *
 * EVERY CONSTANT IN THIS MODEL IS A COUNT OR A RATIO OF COUNTS, and that is the claim the
 * article makes most often about itself: "a model whose constants are all counts and a
 * model with six fitted parameters look identical once they are drawn, and the only way
 * to tell them apart is to be able to ask any line where it came from and get an answer".
 * This probe is where that answer comes from. DEG is how many ways out of a point there
 * are; SHEET is how many charges one pulse lets go, over the source's equator; CYCLE is
 * how many steps a turn takes. All three are properties of the tiling, all three are
 * integers, and none of them was ever fitted to anything.
 *
 * DEG AND SHEET ARE DIFFERENT COUNTS, which the article records getting wrong: "this is
 * not SHEET, which is how many charges a source emits in one pulse: a different question,
 * and the same constant was doing both jobs until it was noticed". On fcc-12 they are 12
 * and 6. They are emitted separately here for that reason.
 *
 * AND WHAT AN ANNIHILATION BUYS A PATH IS c̄, NOT `1`. It is a step's worth of lean, and a
 * step on this lattice is c̄ - the discrete speed of light, which is the model's own unit
 * of length-per-tick and not a dimensionless one. Writing it as a bare 1 was wrong twice:
 * it hides that the numerator is a quantity with units, and it hides which quantity. The
 * ratio that comes out is c̄/DEG and it is worth reading as that rather than as a decimal.
 */
import { Geometry } from "../../lib/Local.ts";
import { rat } from "../Algebra.ts";
import { Lab, Probe, Probing, measure } from "../Probe.ts";
import { Emitted, Measured } from "../Kernel.ts";

/** how many ways out of a point there are */
export const DEG_Q = "DEG";
/** how many charges one pulse lets go - the source's equator */
export const SHEET_C = "SHEET";
/** how many steps a turn takes */
export const CYCLE_Q = "CYCLE";
/** how many dimensions a turn actually lives in - min(D, 2), and that is why CYCLE stops */
export const SLICE_Q = "slice";
/** what one annihilation buys a path: a step's worth of lean, which is c̄ */
export const CBAR_Q = "\\bar{c}";
/** the lean one annihilation is worth - c̄ over DEG */
export const LEAN_Q = "lean";
/** the lattice's dimension */
export const DIM_Q = "D";

export const counts: Probe = {
  id: "counts/what-the-tiling-fixes",
  asks: "what are this lattice's own numbers - how many ways out of a point, how many " +
    "charges a pulse lets go, how long a turn takes?",
  run: (lab: Lab): Probing => {
    const g: Geometry = lab.geometry;
    const measured: Measured[] = [];
    const facts: Emitted[] = [];

    const each: [string, number, string][] = [
      [DIM_Q, g.D, `how many dimensions ${g.name} has`],
      [DEG_Q, g.DEG, `the ways out of a point on ${g.name} - the exits it has, counted`],
      [SHEET_C, g.SHEET, `the exits with no component along the pulsing axis, which is ` +
        `what a source emits over. NOT ${DEG_Q}, which is ${g.DEG}`],
      [CYCLE_Q, g.CYCLE, `how many steps go round the ring of a turn on ${g.name}`],
      [SLICE_Q, Math.min(g.D, 2), `a turn sweeps a PLANE, and a plane needs two ` +
        `dimensions - so what a turn lives in is min(D, 2), which is ${Math.min(g.D, 2)} ` +
        `here and stops growing at 2 however many dimensions are added`],
      [CBAR_Q, 1, `a step's worth of lean is what one annihilation buys a path, and a ` +
        `step is \\bar{c} - one cell a tick, the lattice's own speed. Its value in those units ` +
        `is one, which is a statement about the units and not about the quantity`],
    ];

    for (const [name, value, note] of each) {
      measured.push(measure(name, value, note));
      if (!Number.isFinite(value)) continue;
      facts.push({
        fact: { kind: "value", of: name, equals: rat(value) },
        from: [], measured: [measured[measured.length - 1]],
        because: `${note}. A count of the tiling, taken off the geometry itself with ` +
          `nothing run and nothing fitted`,
        line: `${name} = ${value}`,
      });
      facts.push({
        fact: { kind: "constant", of: name },
        from: [], measured: [measured[measured.length - 1]],
        because: `${name} is a property of ${g.name}, so it is the same wherever you ` +
          `stand on it`,
        line: `${name} is the same everywhere`,
      });
    }

    return {
      facts, measured, holds: true,
      found: `${g.name}: D = ${g.D}, ${DEG_Q} = ${g.DEG}, ${SHEET_C} = ${g.SHEET}, ` +
        `${CYCLE_Q} = ${g.CYCLE} - counts, not measurements`,
    };
  },
};
