/**
 * WHAT ONE TURN DOES TO A DIRECTION, ASKED OF THE RULE RATHER THAN OF THE TILING - and the
 * three answers do not agree, which is the finding.
 *
 * `steer` turns a ray about `held`, the field it has accumulated. `held` is a SUM OF
 * DIRECTIONS weighted by polarity, so it points wherever the local imbalance happens to point
 * and is not an exit of the lattice, not a coordinate axis, not anything the tiling names. In
 * an unbiased vacuum its direction is uniform on the sphere, because nothing in the rules
 * distinguishes one way from another when the mean field is nought.
 *
 * So the scattering the rule makes is: TURN BY A FIXED ANGLE ABOUT A UNIFORMLY RANDOM AXIS.
 * That is rotationally invariant, so it is settled by its Legendre coefficients g_l, and those
 * are what this probe reports - three times over, because there are three different answers
 * and only one of them is the model's:
 *
 *   THE RULE      turn by THETA = 2pi/CYCLE about a uniform axis, exactly. `lib/Kernel.ts`
 *                 integrates the distribution in closed form.
 *   THE LATTICE   the same turn, but the result is SNAPPED to the nearest exit, which is what
 *                 `Geometry.turn` does. Sampled here over random axes.
 *   THE SOLVER    `Vlasov2` does not sample axes at all: it builds a neighbourhood by taking
 *                 `turn(d, U[b])` over the EXITS as axes and closing it symmetrically.
 *
 * On fcc-12 the three give +0.667, +0.467 and -0.600. The solver has the SIGN wrong, and it
 * has it wrong because `Geometry.turn` steps along the EQUATOR of the axis it is handed: the
 * equator of a <110> axis holds only two of fcc's twelve exits, so a step is a 180 degree flip
 * and anything off that equator lands 120 degrees away. The 60 degree neighbours exist in the
 * exit set and are never reached. Every other lattice here takes the smallest angles it has.
 *
 * This probe reports all three because the gap between them is a measurement about the
 * DISCRETISATION, and a theorem that quoted only one of them would be quoting whichever
 * happened to be in front of it.
 */
import { Geometry } from "../../lib/Local.ts";
import { kernel } from "../../lib/Kernel.ts";
import { grid } from "../../lib/Vlasov2.ts";
import { rat } from "../Algebra.ts";
import { Lab, Probe, Probing, measure } from "../Probe.ts";
import { Emitted, Measured } from "../Kernel.ts";

/** the angle one ring step turns a ray through - 2pi/CYCLE, and the model's only parameter */
export const THETA_Q = "\\Theta";
/** <cos gamma> over the turn: how much of a ray's heading survives one scattering */
export const G1_Q = "g_{1}";
/** the same for the quadrupole, which is what decides whether a d state can be held */
export const G2_Q = "g_{2}";
/** g_0, which is 1 for every THETA - a turn moves a ray and does not destroy it */
export const G0_Q = "g_{0}";
/** how far the l-th multipole reaches, in mean free paths: 1/(1 - g_l) */
export const LAM1_Q = "\\lambda_{1}";
/** and the monopole's, which is not finite */
export const LAM0_Q = "\\lambda_{0}";
/** what the LATTICE makes of the same turn, once the result is snapped to an exit */
export const G1_LAT = "g_{1}^{lat}";
/** and what `Vlasov2`'s stir table makes of it */
export const G1_SOL = "g_{1}^{sol}";

const ang = (a: number[], b: number[]) =>
  Math.acos(Math.max(-1, Math.min(1, a[0]*b[0] + a[1]*b[1] + (a[2] ?? 0)*(b[2] ?? 0))));

export const scattering: Probe = {
  id: "scattering/what-a-turn-does",
  asks: "`steer` turns a ray about the field it has accumulated, which in an unbiased vacuum " +
    "points nowhere in particular. What does that do to a direction - and does the lattice, " +
    "and the solver's own table, do the same thing?",
  run: (lab: Lab): Probing => {
    const g: Geometry = lab.geometry;
    const measured: Measured[] = [];
    const facts: Emitted[] = [];

    if (!g.CYCLE || g.CYCLE < 2 || g.D < 3) {
      return { facts, measured, holds: false,
        found: `${g.name} has no ring to turn on (CYCLE = ${g.CYCLE}, D = ${g.D}) - there is ` +
          `nothing here for a turn to be a turn IN, which is \`lattice.turn\`'s own answer` };
    }

    /* --- THE RULE: closed form, no lattice in it ---------------------------------------- */
    const theta = 2 * Math.PI / g.CYCLE;
    const gk = kernel(theta, 4);

    /* --- THE LATTICE: the same turn, snapped to an exit --------------------------------- */
    let seed = 20260828 >>> 0;
    const rnd = () => {
      seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    let latSum = 0, latN = 0, still = 0;
    for (let i = 0; i < 60000; i++) {
      const az = 2*rnd() - 1, ap = 2*Math.PI*rnd(), ar = Math.sqrt(Math.max(0, 1 - az*az));
      const d = i % g.DEG;
      const d2 = g.turn(d, [ar*Math.cos(ap), ar*Math.sin(ap), az]);
      if (d2 === undefined || d2 < 0) continue;
      if (d2 === d) { still++; continue; }
      latSum += Math.cos(ang(g.U[d] as number[], g.U[d2] as number[])); latN++;
    }
    const g1lat = latN ? latSum / latN : 0;

    /* --- THE SOLVER: its stir neighbourhood, which samples no axes at all --------------- */
    const G = grid(g, 5);
    let solSum = 0, solN = 0;
    for (let d = 0; d < g.DEG; d++) for (let q = 0; q < G.ringN[d]; q++) {
      solSum += Math.cos(ang(g.U[d] as number[], g.U[G.ring[d*g.DEG + q]] as number[])); solN++;
    }
    const g1sol = solN ? solSum / solN : 0;

    const each: [string, number, string][] = [
      [THETA_Q, theta * 180 / Math.PI, `one ring step is 2pi/CYCLE, and CYCLE is ${g.CYCLE} ` +
        `on ${g.name} - so a turn is ${(theta*180/Math.PI).toFixed(0)} degrees. This is the ` +
        `ONLY thing a geometry contributes to the rule once the lattice is taken away`],
      [G0_Q, gk[0], `<P_0> is 1 whatever THETA, because a turn moves a ray and does not ` +
        `destroy it - so the monopole has nothing to decay by`],
      [G1_Q, gk[1], `<cos gamma> for a turn of THETA about a UNIFORM axis, in closed form: ` +
        `(1 + 2 cos THETA)/3`],
      [G2_Q, gk[2], `and the quadrupole's, which decides whether a d state survives - it is ` +
        `NEGATIVE for THETA = 90 degrees, where a turn undoes l = 2 faster than absorption does`],
      [LAM1_Q, 1 / (1 - gk[1]), `how far the dipole reaches, in mean free paths: 1/(1 - g_1)`],
      [G1_LAT, g1lat, `the same turn with the result SNAPPED to the nearest exit, which is ` +
        `what \`Geometry.turn\` does - sampled over ${latN} random axes, with ${(100*still/(latN+still)).toFixed(0)}% ` +
        `of draws leaving the ray on the exit it was already on`],
      [G1_SOL, g1sol, `and what \`Vlasov2\`'s stir table gives, which samples no axes: it ` +
        `takes turn(d, U[b]) over the EXITS as axes and closes the relation symmetrically`],
    ];
    for (const [name, value, note] of each) {
      measured.push(measure(name, value, note));
      if (!Number.isFinite(value)) continue;
      facts.push({
        fact: { kind: "value", of: name, equals: rat(Math.round(value * 1000), 1000) },
        from: [], measured: [measured[measured.length - 1]],
        because: note, line: `${name} = ${value.toFixed(3)}`,
      });
    }
    facts.push({
      fact: { kind: "constant", of: THETA_Q },
      from: [], measured: [measured[0]],
      because: `THETA is 2pi/CYCLE and CYCLE is a count of the tiling, so the turn is the ` +
        `same everywhere on ${g.name} - which is what lets the scattering be written as one ` +
        `number per harmonic rather than as a function of where you are standing`,
      line: `${THETA_Q} is the same everywhere`,
    });

    return {
      facts, measured, holds: true,
      found: `${g.name}: CYCLE ${g.CYCLE}, so THETA = ${(theta*180/Math.PI).toFixed(0)}deg. ` +
        `g_1 - rule ${gk[1].toFixed(3)}, lattice ${g1lat.toFixed(3)}, solver ${g1sol.toFixed(3)}` +
        (Math.sign(gk[1]) !== Math.sign(g1sol)
          ? ` - THE SOLVER HAS THE SIGN WRONG` : ``),
    };
  },
};
