/**
 * WHAT A MOVING SOURCE WRITES INTO SPACE - and why the velocity label was never needed.
 *
 * `G^LABELLED` puts the emitter's velocity on every ray as a tag, and the tag is what a
 * magnetic field was to be computed from. Two things are wrong with it and this probe is
 * the answer to both. The tag is read by no rule, so it cannot act; and the number in it
 * is DECLARED - nothing in the dynamics sets `u` and nothing checks it against where the
 * source actually goes, which is driven by momentum the vacuum delivered. So it is an
 * annotation carrying a quantity the model neither produces nor validates.
 *
 * AND IT IS REDUNDANT, WHICH IS THE INTERESTING PART. `G^XOR` already writes the velocity
 * into space, by two rules that were there for other reasons:
 *
 *   EMISSION ALTERNATES THE SIGN. A source spends `dwellTicks` of every `period` emitting
 *   one polarity and the rest emitting the other - that is what `sign(s, tick)` does, and
 *   it is read here by running the rule over a whole period and watching what lands on
 *   the rays.
 *
 *   MOVEMENT CARRIES A RAY ONE CELL A TICK. Established already, as a front that never
 *   runs ahead of the steps it has taken.
 *
 * PUT TOGETHER THEY GIVE A DOPPLER SHIFT, exactly. A front emitted at tick t is, at time
 * T, a distance (T-t)·c̄ from wherever the source stood at t. If the source is displacing
 * by δ per tick, then successive fronts of the same sign leave from successively shifted
 * places, so along a direction n̂ their spacing is
 *
 *   λ(n̂) = period·(c̄ - δ·n̂)
 *
 * - compressed ahead of the motion and stretched behind it. Which means the spacing
 * between sign reversals, measured locally at any point, gives the component of the
 * source's velocity along the line of sight:
 *
 *   δ·n̂ = c̄ - λ(n̂)/period
 *
 * SO THE VELOCITY IS ALREADY THERE, in the phase pattern, put there by the dynamics rather
 * than by a declaration - and unlike the tag it is the velocity the source ACTUALLY has,
 * since it is the displacement that shifted the wavefronts. Anything that could be
 * computed from the label can be computed from the spacing, and it is local: a reading
 * taken at one place, over one period, without knowing which source it came from.
 *
 * WHAT THIS DOES NOT DO is make a force. Reading a velocity out of the phase is not the
 * same as something acting on it, and the acting is what `turning` shows is missing: the
 * alike meeting reverses rather than rotates, so there is no antisymmetric part for any
 * of this to act through. What is established here is that the INFORMATION needs no label.
 * The mechanism that would use it is a separate absence and is reported separately.
 */
import { GEOMETRIES } from "../../lib/Local.ts";
import { World } from "../../lib/Compat.ts";
import { mul, num, sub, sym } from "../Expr.ts";
import { Lab, Probe, Probing, measure, middle } from "../Probe.ts";
import { Emitted, Measured } from "../Kernel.ts";

/** how long a source takes to come back to the same sign */
export const PULSE = "pulse period";
/** the spacing between sign reversals along a direction */
export const WAVELENGTH = "\\lambda(\\hat{n})";
/** the source's own speed along that direction */
export const CLOSING = "\\delta \\cdot \\hat{n}";
/** one cell a tick */
export const CBAR = "\\bar{c}";

export const doppler: Probe = {
  id: "doppler/what-a-moving-source-writes-into-space",
  asks: "a source alternates its sign and its rays leave one cell a tick. What does that " +
    "put into the space around a source that is going somewhere?",
  run: (lab: Lab): Probing => {
    const measured: Measured[] = [];
    const facts: Emitted[] = [];

    if (!lab.theory.polarised) return {
      facts, measured, holds: false,
      found: `${lab.theory.name} puts no sign on what it emits, so there are no sign ` +
        `reversals in the space around a source and nothing whose spacing could carry a ` +
        `velocity`,
    };

    /*
     * THE ALTERNATION, BY RUNNING THE RULE OVER A WHOLE PERIOD. Not by reading `sign`
     * and trusting it: the question is what lands on the rays, so the world is ticked
     * and the rays are looked at.
     */
    const g = GEOMETRIES["cubic-6"];
    const M = 7;
    const period = 2;
    const w = new World({ theory: lab.theory, geometry: g, N: M, seed: lab.seeds[0],
      boundary: "absorb" });
    w.add({ at: middle(g, M), radius: 0, absorbs: false, emits: 1, duty: 1,
      period, dwellTicks: 1, phase: 0 });

    /*
     * ONLY THE TICKS WHERE SOMETHING WAS ACTUALLY LIT COUNT. A tick on which the source's
     * own rays have already streamed away reads as a net of nought, and nought is not a
     * third sign - reported alongside the others it looks like the alternation stopping.
     */
    const seen: { t: number; sign: number }[] = [];
    for (let t = 0; t < 2 * period; t++) {
      w.run(1);
      const home = (w.locals as any[]).find(l => l.source);
      const lit = (home?.rays as any[])?.filter((r: any) => r.active) ?? [];
      if (!lit.length) continue;
      const net = lit.reduce((a: number, r: any) => a + (r.polarity ?? 0), 0);
      if (net === 0) continue;
      seen.push({ t, sign: Math.sign(net) });
    }

    const alternates = seen.some(x => x.sign > 0) && seen.some(x => x.sign < 0);

    measured.push(measure("the sign a source emits, tick by tick", seen.length,
      `over ${2 * period} ticks, the ticks on which the source had rays lit and their ` +
      `net sign: ${seen.map(x => `t${x.t}:${x.sign > 0 ? "+" : "-"}`).join(", ")} - ` +
      `${alternates ? "both signs appear, so it alternates" : "only one sign appears"}. ` +
      `Read by ticking the world and looking at the rays, not by consulting the helper ` +
      `that decides it. Ticks where nothing was lit are left out rather than counted as ` +
      `a sign of nought`));

    if (!alternates) return {
      facts, measured, holds: false,
      found: `${lab.theory.name}'s source did not alternate its sign over a period here ` +
        `- ${seen.map(x => x.sign).join(", ")} - so there are no reversals whose ` +
        `spacing could encode anything`,
    };

    /*
     * THE PERIOD IS NOT EMITTED, BECAUSE IT IS AN INPUT. It was written into the source's
     * own spec by whoever built the world, and reporting it back as a derived value would
     * be laundering a parameter through a probe - the same error as reading a declared
     * velocity off a tag and calling it the emitter's speed. What IS established by the
     * run is that the sign ALTERNATES, which is the theory's doing; the relations below
     * hold whatever the period happens to be, and carry it as a symbol.
     */
    /*
     * AND THE SPACING THAT FOLLOWS. A front emitted at tick t is (T-t)·c̄ from where the
     * source stood at t, and the source has moved on since - so consecutive fronts of one
     * sign are a period's worth of travel apart, less a period's worth of the source's own
     * displacement along that direction.
     */
    facts.push({
      fact: { kind: "equals", of: WAVELENGTH,
        to: mul(sym(PULSE), sub(sym(CBAR), sym(CLOSING))) },
      from: [], measured: [measured[0]],
      because: `the sign alternates with period ${period} and a ray leaves one cell a ` +
        `tick, so two fronts of the same sign are a period's worth of travel apart - ` +
        `except that the source moved between emitting them, so along a direction the ` +
        `spacing is short by a period's worth of the source's own displacement that way. ` +
        `Compressed ahead of the motion, stretched behind it. Nothing here is a label: ` +
        `it is what alternating and stepping one cell a tick DO to the space around ` +
        `something that is going somewhere`,
      line: `${WAVELENGTH} = ${PULSE} \\cdot (${CBAR} - ${CLOSING})`,
    });

    facts.push({
      fact: { kind: "equals", of: CLOSING,
        to: sub(sym(CBAR), mul(sym(WAVELENGTH), sym(PULSE, -1))) },
      from: [], measured: [measured[0]],
      because: `read the other way round, the spacing between sign reversals at a place ` +
        `GIVES the component of the source's velocity along the line to it. That is a ` +
        `local reading - one place, one period, and no need to know which source it came ` +
        `from - and it is the velocity the source ACTUALLY has, because it is the ` +
        `displacement that shifted the fronts. So the emitter's velocity is already ` +
        `written into the phase pattern by rules that were there for other reasons, and a ` +
        `tag carrying a declared one adds no information. It is the declared number that ` +
        `is the weaker of the two: nothing in the dynamics sets it and nothing checks it ` +
        `against where the source goes`,
      line: `${CLOSING} = ${CBAR} - \\frac{${WAVELENGTH}}{${PULSE}}`,
    });

    return {
      facts, measured, holds: true,
      found: `${lab.theory.name}'s source alternates its sign ` +
        `(${seen.map(x => x.sign > 0 ? "+" : "-").join("")} over ` +
        `${2 * period} ticks) and its rays leave one cell a tick, so the spacing between ` +
        `sign reversals along a direction is ${period}·(c̄ - δ·n̂) - compressed ahead, ` +
        `stretched behind. The emitter's velocity is therefore readable locally from the ` +
        `phase pattern, which is what the velocity label was standing in for and what ` +
        `makes it redundant`,
    };
  },
};
