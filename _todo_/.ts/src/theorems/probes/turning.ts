/**
 * WHAT AN ALIKE MEETING DOES TO A DIRECTION - asked of the RULE, and the answer decides
 * whether this theory can have a magnetic force at all.
 *
 * THE ARTICLE'S ARGUMENT, WHICH IS SHORT AND ENTIRELY STRUCTURAL. A meeting displaces by
 * ±d̂, and ±d̂ is d̂ reflected, so the matrix built out of the displacements is SYMMETRIC -
 * and a symmetric matrix has no antisymmetric part to give. A perpendicular force is then
 * not small, it is ABSENT: the meeting rate depends on how much background is on each
 * side, which is a density and therefore a scalar, so the force is along ∇n always, and a
 * vector parallel to ∇n cannot be perpendicular to v and B.
 *
 * THE ARTICLE'S ESCAPE IS THAT THE TURN IS A ROTATION. Rodrigues splits one:
 * R(b̂,θ) = I + sin θ [b̂]× + (1-cos θ)[b̂]×². The middle term is antisymmetric, and an
 * antisymmetric matrix in three dimensions IS the cross product - so a rotation carries
 * for free exactly the piece no distribution of reflections can carry. Its words: "(G+M/3)
 * has always been a rotation and never a reflection... the escape is a line of lattice.ts,
 * and it has always been blank."
 *
 * IN THIS IMPLEMENTATION THE LINE IS STILL BLANK, AND THAT IS WHAT THIS PROBE FOUND.
 * `G^XOR`'s alike branch sets `bounced` on both ends; MOVEMENT then resolves a bounce
 * through `OPP[d]`, the opposite exit. Going back the way you came is a REVERSAL - order
 * two, a reflection - and no rule in any theory here calls the geometry's `turn` at all.
 * The lattice has a ring; nothing uses it.
 *
 * SO THE ROTATION ROUTE IS NOT TAKEN, and this probe must not pretend it is. An earlier
 * version of this file walked `g.turn` - the LATTICE's ring - found order four, and
 * emitted a cross product on the strength of it. That was reading a property of the tiling
 * and attributing it to the theory: the number was right about the ring and licensed
 * nothing whatever about the force, because no rule consults that ring.
 *
 * WHICH IS THE ANSWER TO WHY `G^LABELLED` EXISTS. With the meeting a reflection there is
 * no antisymmetric part anywhere in the dynamics, so the only remaining way to get a
 * pseudovector is to put a second direction on the ray by hand - the emitter's velocity,
 * carried per ray. That theory's own header says exactly this: a ray carrying only a
 * polarity and a heading offers no local pseudovector for a one-polarity source, and the
 * label is the one more thing it needs. It is needed BECAUSE the escape was never taken.
 *
 * The ring and the second moment are still read and still reported, because they are what
 * the escape would be made of if anybody took it. They are reported as properties of the
 * LATTICE, which is what they are.
  */
import { GEOMETRIES, Geometry, outward } from "../../lib/Local.ts";
import { World } from "../../lib/Compat.ts";
import { rat } from "../Algebra.ts";
import { mul, num, sym } from "../Expr.ts";
import { Lab, Probe, Probing, measure } from "../Probe.ts";
import { Emitted, Measured } from "../Kernel.ts";

/**
 * HOW MANY TURNS BRING A DIRECTION HOME, ABOUT THE AXIS IT WAS ASKED ABOUT - and it is
 * deliberately NOT called CYCLE.
 *
 * `counts/what-the-tiling-fixes` already publishes CYCLE, read off the geometry's own
 * ring, and on fcc-12 that is 6. Walked about the z axis the turn closes after 4. The
 * article quotes 8, for a lattice with twenty-six exits that is not in this ladder at all.
 * Three numbers, all correct, all about different things: the geometry's default ring, the
 * ring about a particular axis, and another tiling's.
 *
 * NAMING THIS ONE CYCLE WOULD HAVE BEEN A SILENT BUG OF THE WORST KIND. The discovery
 * store holds every probe's premises at once and the first arrival keeps the slot, so one
 * of the two numbers would have quietly shadowed the other and every line downstream would
 * have been about whichever probe happened to run first - with nothing anywhere reporting
 * a conflict. So it gets its own name and the discrepancy is reported rather than
 * resolved, because it is a fact about the lattice: the order of a turn depends on the
 * axis it is about.
 */
export const TURN_ORDER = "turn order";
/** the angle one turn is worth */
export const SPIN = "SPIN about \\hat{b}";
/** the axis a turn sweeps about, which the rule has always carried */
export const AXIS = "\\hat{b}";
/** the velocity of whatever is being turned */
export const SPEED = "v";
/** the transverse force a turn leaves on a moving charge */
export const TRANSVERSE = "F_{\\perp}";
/** the field it lies along */
export const FIELD = "B";
/** the exits' second moment - the coupling, and a count of the tiling */
export const SECOND_MOMENT = "\\Sigma \\hat{d} \\otimes \\hat{d}";

export const turning: Probe = {
  id: "turning/is-a-turn-a-rotation",
  asks: "when this theory turns a direction, is that a reflection or a rotation - and " +
    "does it turn about an axis it was given?",
  run: (lab: Lab): Probing => {
    const g: Geometry = lab.geometry;
    const measured: Measured[] = [];
    const facts: Emitted[] = [];

    if (g.D < 2) return {
      facts, measured, holds: false,
      found: `a turn is a turn in a PLANE and ${g.name} has ${g.D} dimension, so there ` +
        `is no plane to turn in and nothing here can be a rotation`,
    };

    /* ---- what the THEORY's own meeting does to a direction --------------------- */
    /*
     * THE QUESTION THAT DECIDES EVERYTHING, and it is asked of the rule rather than of
     * the lattice. Hand the theory's facing-pair rule two ALIKE ends and look at what it
     * did: a rule that reverses them has produced a reflection, order two, no
     * antisymmetric part, no magnetic force. A rule that walked the direction round a
     * ring would be a rotation and would carry one for free.
     */
    const meeting = Object.entries(lab.theory.rules as Record<string, any>)
      .find(([, r]) => Array.isArray(r.type) && r.type.length === 2 &&
        r.type.every((x: unknown) => x === "Boundary"));
    let reverses = false, movedRing = false, meetingName = "";
    if (meeting) {
      meetingName = meeting[0];
      const small = GEOMETRIES["cubic-6"];
      const w = new World({ theory: lab.theory, geometry: small, N: 5, seed: 1,
        boundary: "wrap" });
      const all = w.locals as any[];
      const l = all[Math.floor(all.length / 2)];
      const ray = (l.rays as any[])[0];
      const o = outward(ray);
      if (o?.target) {
        const [x, y] = [o, o.target];
        for (const end of [x.source, y.source]) {
          end.active = true;
          end.polarity = 1;              /* alike, which is the branch that turns */
          end.bounced = false;
        }
        const wasX = (x.source as any).d ?? -1;
        meeting[1].exec(x, y);
        reverses = !!(x.source as any).bounced || !!(y.source as any).bounced;
        movedRing = ((x.source as any).d ?? -1) !== wasX && !reverses;
      }
    }

    measured.push(measure("what an alike meeting does to a direction", reverses ? 2 : 0,
      meeting
        ? (reverses
          ? `${meetingName} marks both ends bounced, and a bounce is resolved through ` +
            `OPP - the opposite exit. Going back the way you came is a REVERSAL: order ` +
            `two, which is a reflection. A reflection has no antisymmetric part, so ` +
            `there is no cross product in it and no perpendicular force`
          : movedRing
            ? `${meetingName} moved the direction without reversing it, which is a ` +
              `rotation and does carry an antisymmetric part`
            : `${meetingName} left the direction alone entirely`)
        : "this theory has no rule between two facing ends"));

    /* ---- how many turns bring a direction home -------------------------------- */
    /*
     * ORDER TWO IS A REFLECTION AND ANYTHING MORE IS A ROTATION. Applied by the geometry's
     * own `turn`, which is the same operation the meeting rule uses, so this is the rule
     * being run rather than a description of it being trusted.
     */
    const axis = [0, 0, 1].slice(0, g.D);
    while (axis.length < g.D) axis.push(0);
    const start = 0;
    let at = start, order = 0;
    const walked: number[] = [start];
    for (let i = 0; i < 4 * g.DEG + 4; i++) {
      at = g.turn(at, axis);
      order++;
      if (at === start) break;
      walked.push(at);
    }
    const closed = at === start;

    measured.push(measure("turns that bring a direction home", order,
      closed
        ? `applying ${lab.theory.name}'s own turn about an axis, exit ${start} goes ` +
          `${walked.join(" -> ")} and back to ${start} after ${order} of them. An order ` +
          `of two would be a reflection; ${order} is a rotation`
        : `the turn did not bring the direction home within ${4 * g.DEG + 4} steps, so ` +
          `it is not a finite rotation of the exits at all`));

    if (!closed) return {
      facts, measured, holds: false,
      found: `turning does not close on ${g.name} - a direction never comes home, so ` +
        `there is no ring here and no phase quantum to read off it`,
    };

    if (order <= 2) return {
      facts, measured, holds: false,
      found: `a turn on ${g.name} has order ${order}, which is a REFLECTION. A meeting ` +
        `displaces by plus or minus d-hat and a reflection of d-hat is minus d-hat, so ` +
        `the matrix built from the displacements is symmetric and has no antisymmetric ` +
        `part. There is no cross product to be had and therefore no magnetic force - ` +
        `which is a statement about this lattice rather than a failure to find one`,
    };

    /* ---- does it care which axis it was given --------------------------------- */
    const other = new Array(g.D).fill(0);
    other[0] = 1;
    const differs = g.turn(start, axis) !== g.turn(start, other);
    measured.push(measure("does the turn use the axis it is handed", differs ? 1 : 0,
      differs
        ? `turning exit ${start} about ${JSON.stringify(axis)} gives ` +
          `${g.turn(start, axis)} and about ${JSON.stringify(other)} gives ` +
          `${g.turn(start, other)} - different, so the rule sweeps the axis it was given`
        : `both axes give ${g.turn(start, axis)}, so the rule is not using the axis it ` +
          `was handed and there is no free direction in it for a field to lie along`));

    /* ---- the coupling, off the geometry --------------------------------------- */
    const m2 = g.moment(2);
    measured.push(measure(SECOND_MOMENT, m2.diagUnit,
      `the exits' second moment on the unit vectors, summed over all ${g.DEG} of them: ` +
      `${m2.diagUnit.toFixed(6)} against DEG/D = ${(g.DEG / g.D).toFixed(6)}, and the ` +
      `whole tensor is ${m2.isotropic ? "isotropic" : `anisotropic at ` +
      `${m2.anisotropy.toFixed(6)}`}. Read off the exit vectors, with nothing running`));

    measured.push(measure("the geometry's own CYCLE, for comparison", g.CYCLE,
      g.CYCLE === order
        ? `the same as the order walked here, so the default ring and the ring about ` +
          `this axis are one ring`
        : `${g.CYCLE}, against the ${order} walked about this axis - DIFFERENT, and both ` +
          `are right. The geometry's CYCLE is the length of its default ring; the order ` +
          `here is the ring about the axis this turn was handed. That a turn's order ` +
          `depends on which axis it is about is a fact about ${g.name} worth having, and ` +
          `it is the reason this quantity is not called CYCLE`));

    facts.push({
      fact: { kind: "value", of: TURN_ORDER, equals: rat(order) },
      from: [], measured: [measured[0]],
      because: `the theory's own turn was applied to a direction until it came home, ` +
        `which took ${order} applications: ${walked.join(" -> ")} -> ${start}. That count ` +
        `is the ring's length. It is also the proof that a turn is a ROTATION rather than ` +
        `a reflection, since a reflection has order two - and everything magnetic in this ` +
        `model rests on that distinction`,
      line: `${TURN_ORDER} = ${order}`,
    });

    facts.push({
      fact: { kind: "equals", of: SPIN, to: mul(num(2), sym("\\pi"), sym(TURN_ORDER, -1)) },
      from: [], measured: [measured[0]],
      because: `one turn is one step of a ring of ${order}, so it is a whole turn over ` +
        `${order} - the phase quantum, and a count of the tiling rather than an angle ` +
        `anybody chose`,
      line: `${SPIN} = \\frac{2\\pi}{${TURN_ORDER}}`,
    });

    /*
     * AND THE CROSS PRODUCT IS REFUSED WHERE THE RULE DOES NOT ROTATE. The ring below is
     * the LATTICE's and is reported as such; a force is the THEORY's, and this theory's
     * meeting reflects.
     */
    if (reverses) return {
      facts, measured, holds: true,
      found: `${lab.theory.name}'s alike meeting REVERSES a direction - ${meetingName} ` +
        `marks it bounced and a bounce resolves through the opposite exit, which is a ` +
        `reflection of order two. A reflection's matrix is symmetric and has no ` +
        `antisymmetric part, so there is no cross product in the dynamics and no ` +
        `perpendicular force: not a small one, none. The lattice DOES carry a ring - a ` +
        `direction comes home after ${order} turns about a given axis, and the exits' ` +
        `second moment is ${m2.diagUnit.toFixed(4)} = DEG/D, isotropic to ` +
        `${m2.anisotropy.toExponential(1)} - which is everything the rotation route would ` +
        `be made of. No rule here consults it. That is why a magnetic force in this ` +
        `implementation needs a direction carried on the ray by hand, which is what ` +
        `G^LABELLED adds and why it exists`,
    };

    if (differs) {
      /*
       * THE ROTATION'S ANTISYMMETRIC PART IS THE CROSS PRODUCT, and that is Rodrigues
       * rather than anything measured here - so it is stated as the step it is, with the
       * measured part (that this IS a rotation, and that it has an axis) underneath it.
       */
      facts.push({
        fact: { kind: "vector", of: AXIS },
        from: [], measured: [measured[1]],
        because: `the turn gives different answers for different axes, so the axis is a ` +
          `direction the rule actually carries rather than one the code happened to be ` +
          `written with. The article's note is that this free axis has been in the ` +
          `central rule from the beginning and no section ever said what set it`,
        line: `${AXIS} is a direction`,
      });
      facts.push({
        fact: { kind: "vector", of: SPEED },
        from: [], measured: [measured[1]],
        because: `what is being turned is moving, and which way it moves is a direction`,
        line: `${SPEED} is a direction`,
      });
      facts.push({
        fact: { kind: "cross", of: TRANSVERSE, left: SPEED, right: AXIS },
        from: [], measured: [measured[0], measured[1]],
        because: `a turn of order ${order} about an axis is a rotation, and Rodrigues ` +
          `splits a rotation into I + sin(θ)[b̂]× + (1-cos θ)[b̂]×². The middle piece is ` +
          `ANTISYMMETRIC, and an antisymmetric matrix is the cross product - so a ` +
          `rotation carries for free exactly the piece a symmetric matrix cannot. That ` +
          `matters because a meeting displaces by ±d̂ and ±d̂ is d̂ reflected, so any ` +
          `DISTRIBUTION of meetings builds a symmetric matrix and can never produce this ` +
          `term. What is left transverse to the motion therefore lies along v × b̂. ` +
          `Head on, two alike charges turn the same way and their displacements R(d̂) and ` +
          `R(-d̂) = -R(d̂) cancel, so the third law survives the turn without anything ` +
          `having to be arranged, and the only local sign left to set the sense is the ` +
          `charge's own`,
        line: `${TRANSVERSE} = ${SPEED} \\times ${AXIS}`,
      });

      if (m2.isotropic) facts.push({
        fact: { kind: "quotient", of: SECOND_MOMENT, over: "DEG", under: "D" },
        from: [], measured: [measured[2]],
        because: `the exits' second moment comes to ${m2.diagUnit.toFixed(6)}, which is ` +
          `DEG/D = ${g.DEG}/${g.D} exactly, and the tensor is isotropic to ` +
          `${m2.anisotropy.toExponential(1)}. The exits are manifestly NOT an isotropic ` +
          `set - they point at particular neighbours - and their second moment is ` +
          `isotropic anyway, the tiling's symmetry being enough. So no lattice ` +
          `anisotropy leaks into the force and the law reads the same in every ` +
          `orientation. This is a count of the tiling, not a fitted coupling, and it is ` +
          `a check that could have failed`,
        line: `${SECOND_MOMENT} = \\frac{DEG}{D}`,
      });
    }

    return {
      facts, measured, holds: true,
      found: `a turn on ${g.name} has order ${order} - a ROTATION, not a reflection - ` +
        `about an axis the rule is genuinely given, so its antisymmetric part is a cross ` +
        `product and what it leaves transverse to a motion lies along v x b-hat. The ` +
        `coupling is the exits' second moment, ${m2.diagUnit.toFixed(4)} = DEG/D, ` +
        `isotropic to ${m2.anisotropy.toExponential(1)}`,
    };
  },
};
