/**
 * FROM THE RULES TO THE CONTINUOUS MODEL, IN FOUR STEPS AND WITH NO LATTICE IN THE ANSWER.
 *
 * `vacuum.continuum` already writes every rule as a term in how a density changes. What it
 * leaves standing is the steering term, `q(B x d^)·grad_d n`, which is the hard one: B is the
 * density's own moment, so the equation is closed on itself and nonlinear, and it still has
 * the lattice in it through `turn`. These four theorems take that term apart.
 *
 *   turn.isotropic   the axis a turn is about is the field, and in an unbiased vacuum the
 *                    field points nowhere in particular - so the scattering is ROTATIONALLY
 *                    INVARIANT, and that is a statement about the rules, not an assumption
 *   turn.kernel      a fixed turn about a uniform axis has a phase function in CLOSED FORM,
 *                    g_1 = (1 + 2 cos THETA)/3, and g_0 = 1 for every THETA
 *   scatter.harmonics  a rotationally invariant scatter is DIAGONAL in spherical harmonics,
 *                    so each multipole decays on its own with lambda_l = lambda/(1 - g_l) -
 *                    and lambda_0 is INFINITE, which is why a source fills its box
 *   vacuum.rates     sigma = 1/occ and the vacuum sits at rho = occ, so the annihilation rate
 *                    is 1 per tick on EVERY lattice; `steer` spends one ring step per tick, so
 *                    stir is 1 too. absorb = stir identically, and the model has ONE parameter
 *
 * What comes out the other end is not a lattice with better numbers. It is a one-parameter
 * family in THETA, and every geometry in this book is a point in it: fcc-12 is 60 degrees,
 * icosahedral-12 is 90, both cubics are 45. `src/lib/Rays.ts` runs that family exactly, as the
 * Markov process it is, and `src/lib/Kernel.ts` is `turn.kernel` as arithmetic.
 */
import { expo } from "../Algebra.ts";
import { base } from "../Algebra.ts";
import { term } from "../Expr.ts";
import { Theorem } from "../Theorem.ts";
import { counts, CYCLE_Q, DEG_Q, DIM_Q } from "../probes/counts.ts";
import {
  G0_Q, G1_LAT, G1_Q, G1_SOL, G2_Q, LAM0_Q, LAM1_Q, THETA_Q, scattering,
} from "../probes/scattering.ts";
import { DENSITY, FIELD_B, KILLS, TURNS } from "./vacuum.continuum.ts";

/** the axis a turn is about - `held`, the field the ray has accumulated */
export const AXIS = "\\hat{b}";
/** how far a ray is turned in one scattering, which is not THETA: THETA is about the AXIS */
export const DEFLECT = "\\gamma";
/** the scattering as an operator on the density - what `stir` is, written down */
export const SCATTER = "S";
/** ANNIHILATION as a rate per unit length, which is what a mean free path is made of */
export const ABSORB = "\\sigma_{a}";
/** and `steer` as one, so the two can be compared */
export const STIR = "\\sigma_{s}";
/** what the vacuum settles at - `vacuum.occupancy`'s fixed point, cited not re-derived */
export const OCC = "\\rho_{\\infty}";

/* ------------------------------------------------------------------------------------- */

export const isotropic: Theorem = {
  id: "turn.isotropic",
  asks: "`steer` turns a ray about the field it has accumulated. In a vacuum with nothing " +
    "driving it, which way does that field point - and what does the answer make the " +
    "scattering into?",
  about: AXIS,
  probes: [scattering, counts],
  uses: ["vacuum.continuum", "vacuum.occupancy", "lattice.turn"],
  wants: [
    { kind: "isotropic", of: AXIS },
    { kind: "value", of: THETA_Q, equals: { n: 0, d: 1 } },
  ],
  glossary: {
    [AXIS]: { symbol: "\\hat{b}", says: "the axis a turn is about: `held`, the sum of polarity times direction over what the ray has met - not an exit, not a coordinate axis, not anything the tiling names" },
    [FIELD_B]: { symbol: "B", says: "the field, which is the density's own first moment and is therefore made of the same rays it steers" },
    [THETA_Q]: { symbol: "\\Theta", says: "how far one ring step turns a ray: 2pi/CYCLE" },
    [CYCLE_Q]: { symbol: "CYCLE", says: "how many steps go round a turn - what fixes THETA" },
    [DIM_Q]: { symbol: "D", says: "the lattice's dimension" },
  },
};

export const isotropicDefinitions = [
  {
    fact: { kind: "product" as const, of: AXIS, from: [DENSITY] },
    because: "THE AXIS IS NOT A CHOICE, IT IS THE FIELD. `steer` reads `held` - the running " +
      "sum of polarity times direction over what the ray has met - and turns about THAT, in " +
      "the sense the charge gives. So the axis is a moment of the same density being steered, " +
      "which is `vacuum.continuum`'s closure said from the other side",
    line: `${AXIS} = ${FIELD_B}/|${FIELD_B}|`,
  },
  {
    fact: { kind: "isotropic" as const, of: AXIS },
    because: "AND IN AN UNBIASED VACUUM IT POINTS NOWHERE IN PARTICULAR. The mean field is " +
      "nought - that is what `vacuum.occupancy`'s fixed point IS, a balance with no direction " +
      "in it - so what remains is the fluctuation, and nothing in any rule distinguishes one " +
      "direction from another for it to prefer. The axis is therefore UNIFORM ON THE SPHERE. " +
      "This is the step that makes the whole thing tractable and it is a consequence rather " +
      "than an assumption: a turn about a fixed axis is not rotationally invariant and has no " +
      "single phase function, but a turn about a uniform one is and does",
    line: `${AXIS} \\sim \\mathrm{Uniform}(S^{2})`,
  },
  {
    /*
     * AS A SCALING AND NOT AS A NUMBER. This asserted `THETA = 360` - a placeholder standing in
     * for "some value", which is the house idiom in `wants` but is a LIE in a definition. On
     * line-2 and square-4 the probe declines (there is no plane for a turn to live in, which is
     * `lattice.turn`'s own answer), so the placeholder was the only thing the engine had and it
     * printed `g_1 = (1 + 2 cos THETA)/3 = 360` and `lambda_1 = 360/killing`. A definition must
     * not put a number where a probe is supposed to measure one. The RELATION is what is known
     * without measuring: one ring step is a whole turn divided by how many go round it.
     */
    fact: { kind: "scales" as const, of: THETA_Q, by: { [CYCLE_Q]: expo(-1) } },
    because: "AND HOW FAR IS SET BY THE RING AND NOTHING ELSE. `steer` spends one unit of " +
      "banked field on one RING STEP, and a ring closes after CYCLE of them - so a turn is " +
      "2pi/CYCLE. `lattice.turn` already established that CYCLE counts what fits in the PLANE " +
      "a turn sweeps and so stops growing with the dimension; this is what that number is FOR",
    line: `${THETA_Q} = 2\\pi/${CYCLE_Q}`,
  },
];

/* ------------------------------------------------------------------------------------- */

export const turnKernel: Theorem = {
  id: "turn.kernel",
  asks: "a ray is turned a fixed angle about an axis pointing anywhere. Over all the ways " +
    "the axis could point, how far does the ray actually end up being deflected?",
  about: G1_Q,
  probes: [scattering, counts],
  uses: ["turn.isotropic", "lattice.turn"],
  wants: [
    { kind: "value", of: G1_Q, equals: { n: 0, d: 1 } },
    { kind: "value", of: G0_Q, equals: { n: 1, d: 1 } },
  ],
  glossary: {
    [DEFLECT]: { symbol: "\\gamma", says: "how far the ray was actually deflected, which is not THETA - THETA is measured about the axis and gamma between the old heading and the new" },
    [THETA_Q]: { symbol: "\\Theta", says: "the turn about the axis: 2pi/CYCLE" },
    [G0_Q]: { symbol: "g_{0}", says: "<P_0(cos gamma)> = 1 for every THETA, because a turn moves a ray and never destroys one" },
    [G1_Q]: { symbol: "g_{1}", says: "<cos gamma> - how much of a heading survives one scattering. (1 + 2 cos THETA)/3, exactly" },
    [G2_Q]: { symbol: "g_{2}", says: "the same for the quadrupole. NEGATIVE at THETA = 90 degrees, which is icosahedral-12" },
    [G1_LAT]: { symbol: "g_{1}^{lat}", says: "what the lattice makes of the same turn once the result is snapped to the nearest exit" },
    [G1_SOL]: { symbol: "g_{1}^{sol}", says: "and what `Vlasov2`'s stir table makes of it, which on fcc-12 has the opposite sign" },
    [CYCLE_Q]: { symbol: "CYCLE", says: "how many steps go round a turn" },
  },
};

export const kernelDefinitions = [
  {
    fact: { kind: "equals" as const, of: DEFLECT, to: [term(1, base(THETA_Q))] },
    because: "RODRIGUES, AND THEN ONE CHANGE OF VARIABLE. Turning u about an axis b by THETA " +
      "leaves the component along b alone and rotates the rest, so the new heading has " +
      "cos gamma = t^2 + (1 - t^2) cos THETA where t is cos of the angle between u and the " +
      "axis. The axis being uniform on the sphere (`turn.isotropic`), t is uniform on [-1, 1] " +
      "- that is the one fact about a sphere that makes this elementary - so the deflection's " +
      "whole distribution is a change of variable away from a uniform one",
    line: `\\cos${DEFLECT} = \\cos${THETA_Q} + t^{2}(1 - \\cos${THETA_Q})`,
  },
  {
    fact: { kind: "value" as const, of: G0_Q, equals: { n: 1, d: 1 } },
    because: "AND g_0 IS 1 FOR EVERY THETA, WHICH IS THE MOST CONSEQUENTIAL LINE HERE. " +
      "<P_0> = 1 identically because P_0 is 1: turning MOVES a ray and never destroys one, so " +
      "the total is conserved by the scattering whatever the angle. Nothing about a lattice " +
      "enters. Everything that follows about a monopole not decaying follows from this and " +
      "cannot be escaped by choosing a better geometry",
    line: `${G0_Q} = 1`,
  },
  {
    fact: { kind: "equals" as const, of: G1_Q, to: [term(1, base(THETA_Q))] },
    because: "g_1 IS <cos gamma>, AND THE AVERAGE OF t^2 OVER A UNIFORM t IS A THIRD. So " +
      "g_1 = cos THETA + (1 - cos THETA)/3 = (1 + 2 cos THETA)/3, with no integral left to do. " +
      "The higher g_l are the same change of variable against P_l and come out of one " +
      "quadrature - `src/lib/Kernel.ts` does exactly that and agrees with this to 1e-9. Note " +
      "what it means: at THETA = 120 degrees g_1 is nought, and beyond it NEGATIVE - a turn " +
      "that big is a reversal and undoes a heading rather than nudging it",
    line: `${G1_Q} = (1 + 2\\cos${THETA_Q})/3`,
  },
  {
    fact: { kind: "bound" as const, of: G1_LAT, atMost: G1_Q },
    because: "AND THE LATTICE DOES NOT GET THIS RIGHT, WHICH IS WORTH STATING AS A RESULT " +
      "RATHER THAN AS AN APOLOGY. `Geometry.turn` snaps the turned ray to the nearest exit, " +
      "and a snap can only lose: measured over random axes, fcc-12's g_1 falls from the " +
      "rule's 0.667 to 0.467, and a fifth of draws leave the ray on the exit it was already " +
      "on. `Vlasov2` is worse and differently wrong - it samples no axes at all, taking " +
      "turn(d, U[b]) over the EXITS and closing the relation symmetrically, which on fcc-12 " +
      "reaches only 120 and 180 degree neighbours while 60 degree ones sit unused in the exit " +
      "set. Its g_1 is -0.600: the wrong SIGN, not merely the wrong size. cubic-26 is the one " +
      "lattice whose table is close to the rule, at 0.650 against 0.805",
    line: `${G1_SOL} \\ne ${G1_LAT} \\ne ${G1_Q}`,
  },
];

/* ------------------------------------------------------------------------------------- */

export const harmonics: Theorem = {
  id: "scatter.harmonics",
  asks: "the scattering does not care which way anything is pointing. What does that alone " +
    "settle about how far a shape can be carried before the vacuum forgets it?",
  about: LAM1_Q,
  probes: [scattering, counts],
  uses: ["turn.kernel", "turn.isotropic", "vacuum.continuum"],
  wants: [
    { kind: "value", of: G1_Q, equals: { n: 0, d: 1 } },
    { kind: "diverges", of: LAM0_Q, in: G0_Q },
  ],
  glossary: {
    [SCATTER]: { symbol: "S[n]", says: "what `stir` does to the density, as an operator: the mean over the ring, less what was there" },
    [LAM0_Q]: { symbol: "\\lambda_{0}", says: "how far the MONOPOLE reaches. Infinite, because g_0 = 1" },
    [LAM1_Q]: { symbol: "\\lambda_{1}", says: "how far the dipole reaches, in mean free paths: 1/(1 - g_1)" },
    [G0_Q]: { symbol: "g_{0}", says: "1 for every THETA" },
    [G1_Q]: { symbol: "g_{1}", says: "(1 + 2 cos THETA)/3" },
    [G2_Q]: { symbol: "g_{2}", says: "negative at THETA = 90 degrees - a quadrupole is then undone by turning faster than by absorption" },
    [DEG_Q]: { symbol: "DEG", says: "the ways out of a point - what an l needs (l+1)^2 of, and what a continuum has infinitely many of" },
  },
};

export const harmonicsDefinitions = [
  {
    fact: { kind: "isotropic" as const, of: SCATTER },
    because: "THE OPERATOR INHERITS THE INVARIANCE. `stir` sends a ray to the mean over its " +
      "ring less what was there, and by `turn.isotropic` that ring is a distribution in the " +
      "DEFLECTION alone - it does not depend on the heading the ray happened to have. So S " +
      "commutes with every rotation",
    line: `${SCATTER}[${DENSITY}] = \\int K(\\hat{d}·\\hat{d}')${DENSITY}(\\hat{d}')\\,d\\hat{d}' - ${DENSITY}`,
  },
  {
    fact: { kind: "equals" as const, of: SCATTER,
      to: [term(1, base(G1_Q)), term(-1, base(DENSITY))] },
    because: "AND AN OPERATOR THAT COMMUTES WITH EVERY ROTATION IS DIAGONAL IN THE SPHERICAL " +
      "HARMONICS - Schur, and the reason the whole problem collapses. Each Y_lm is an " +
      "eigenvector, its eigenvalue is -(1 - g_l), and NO l EVER MIXES INTO ANOTHER. So the " +
      "shape a source emits does not get rearranged by the vacuum, only DIMMED, one harmonic " +
      "at a time and each at its own rate",
    line: `${SCATTER}[${DENSITY}]_{lm} = -(1 - ${G1_Q})${DENSITY}_{lm}`,
  },
  {
    fact: { kind: "quotient" as const, of: LAM1_Q, over: G1_Q, under: KILLS },
    because: "SO EACH MULTIPOLE HAS ITS OWN RANGE. Removal is absorption plus scattering-out " +
      "and the return is scattering-in weighted by g_l, so the l-th mode decays at " +
      "sigma_a + sigma_s(1 - g_l) and reaches lambda_l = lambda/(1 - g_l). A shape of order l " +
      "is therefore visible out to about lambda_l and no further, and the ratio between two " +
      "of them at a radius is what a picture of an orbital IS",
    line: `${LAM1_Q} = \\lambda/(1 - ${G1_Q})`,
  },
  {
    fact: { kind: "diverges" as const, of: LAM0_Q, in: G0_Q },
    because: "AND THE MONOPOLE NEVER DECAYS, ON ANY LATTICE, AT ANY ANGLE. g_0 = 1 exactly " +
      "(`turn.kernel`), so 1 - g_0 is nought and lambda_0 is INFINITE: scattering cannot " +
      "remove the l = 0 part because scattering conserves it. Only annihilation touches it. " +
      "This is why a source fills its box instead of radiating - measured on the lattice, a " +
      "monopole's excess falls twice over an eightfold radius where 1/r^2 demands sixty-four " +
      "- and it is why every picture of a cloud has to have its own radial mean taken off " +
      "before an angle can be seen in it. It is not an artefact of a geometry and no geometry " +
      "escapes it",
    line: `${G0_Q} = 1 \\Rightarrow ${LAM0_Q} = \\infty`,
  },
  {
    fact: { kind: "small" as const, of: G2_Q },
    because: "AND THE SIGN OF g_2 DECIDES WHETHER A d STATE CAN EXIST AT ALL. At THETA = 90 " +
      "degrees - which is CYCLE = 4, which is icosahedral-12 - g_2 is NEGATIVE, so " +
      "lambda_2 = 1/(1 - g_2) is SHORTER than a mean free path: turning undoes a quadrupole " +
      "faster than absorption removes it. That lattice cannot hold an l = 2 shape under the " +
      "rule, before any question of how many exits it has to represent one with. At 45 " +
      "degrees g_2 is +0.483 and it can. Predicted from CYCLE alone, and the renders agree",
    line: `${G2_Q} < 0 \\Rightarrow ${LAM1_Q} < \\lambda`,
  },
];

/* ------------------------------------------------------------------------------------- */

export const rates: Theorem = {
  id: "vacuum.rates",
  asks: "the continuum model has an absorption and a scattering in it. What sets the two, " +
    "and how much freedom is actually left once the rules have spoken?",
  about: STIR,
  probes: [scattering, counts],
  uses: ["vacuum.occupancy", "meeting.rate", "turn.isotropic"],
  wants: [
    { kind: "value", of: THETA_Q, equals: { n: 0, d: 1 } },
    { kind: "equals", of: STIR, to: [term(1, base(ABSORB))] },
  ],
  glossary: {
    [ABSORB]: { symbol: "\\sigma_{a}", says: "ANNIHILATION as a rate: how often a ray meets an opposite one facing it" },
    [STIR]: { symbol: "\\sigma_{s}", says: "`steer` as a rate: how often a ray is turned" },
    [OCC]: { symbol: "\\rho_{\\infty}", says: "what the vacuum settles at when nothing drives it - `vacuum.occupancy`'s fixed point" },
    [THETA_Q]: { symbol: "\\Theta", says: "the turn: 2pi/CYCLE, and once this is said there is nothing else a geometry contributes" },
    [DEG_Q]: { symbol: "DEG", says: "the ways out of a point" },
  },
};

export const ratesDefinitions = [
  {
    fact: { kind: "scales" as const, of: ABSORB, by: { [OCC]: expo(1) } },
    because: "ANNIHILATION IS A MEETING, so its rate is a cross-section times what there is " +
      "to meet: sigma_a = sigma·rho. `meeting.rate` establishes the first and " +
      "`vacuum.occupancy` the second",
    line: `${ABSORB} = \\sigma·${OCC}`,
  },
  {
    fact: { kind: "value" as const, of: ABSORB, equals: { n: 1, d: 1 } },
    because: "AND THE TWO CANCEL. The cross-section read off the rule is 1/occ and the vacuum " +
      "settles AT occ - the same number, because it is the same balance seen twice - so the " +
      "annihilation rate is 1 per tick ON EVERY LATTICE. The occupancies differ by 68% " +
      "between fcc-12 and icosahedral-12 and this does not move at all, which is the sort of " +
      "thing that is either a coincidence or the point",
    line: `${ABSORB} = \\sigma·${OCC} = (1/${OCC})·${OCC} = 1`,
  },
  {
    fact: { kind: "equals" as const, of: STIR, to: [term(1, base(ABSORB))] },
    because: "AND `steer` SPENDS ONE RING STEP PER TICK, so stir is 1 per tick too, and " +
      "absorb = stir IDENTICALLY. A ray is exactly as likely to be destroyed as turned. " +
      "That is not a regime that was chosen, it is where the rules put themselves, and it " +
      "matters for how the model must be solved: with scattering and absorption comparable " +
      "the medium is NEARLY BALLISTIC, most of what arrives anywhere arrived straight, and a " +
      "moment expansion of the direction - P_L - cannot represent that at any usable order. " +
      "Measured, such a solve moved 45% between L = 9 and L = 15 and missed the exact " +
      "ballistic profile by a factor of thirty",
    line: `${STIR} = ${ABSORB} = 1`,
  },
  {
    fact: { kind: "constant" as const, of: STIR },
    because: "SO THE MODEL IS A ONE-PARAMETER FAMILY. Both rates are 1 on every lattice, " +
      "which fixes the unit of length and leaves nothing; the only thing a geometry still " +
      "contributes is THETA = 2pi/CYCLE. Every tiling in this book is a POINT in that family " +
      "- fcc-12 at 60 degrees, icosahedral-12 at 90, cubic-18 and cubic-26 both at 45 - and " +
      "the differences between their clouds are differences in one number. `src/lib/Rays.ts` " +
      "runs the family exactly, as the Markov process the rules already are: an exponential " +
      "free path of mean 1/(absorb + stir), then annihilation with probability " +
      "absorb/(absorb + stir), otherwise a turn of THETA about a uniform axis. Nothing in it " +
      "is expanded, truncated or snapped, and it costs a couple of seconds where a lattice " +
      "run of the same state costs twenty minutes",
    line: `\\{${ABSORB}, ${STIR}, ${THETA_Q}\\} \\to \\{${THETA_Q}\\}`,
  },
];
