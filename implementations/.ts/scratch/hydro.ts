/**
 * THE ACTUAL HYDROGEN SHAPES, ASKED FOR BY NAME - and what the vacuum makes of each.
 *
 * The cone patterns so far cover ONE hemisphere, so they cannot make a 2p at all: a p orbital has
 * a lobe at each pole and a single cone has one. Nor can a d_z2, which is two polar lobes AND an
 * equatorial torus - two features at once, not one cone. So the pattern needs to be able to be
 * MIRRORED, and to be a SUM of pieces.
 *
 * What each hydrogen state is, as a set of directions:
 *
 *   1s      everything, evenly                                  a sphere
 *   2s      everything, with a radial node                       a sphere in a sphere
 *   2p_z    +z and -z                                            two lobes on the axis
 *   2p_x    +x and -x                                            two lobes across it
 *   3d_z2   +z and -z, AND the equator                           two lobes and a torus
 *   3d_xy   four seats round the equator                         four lobes in a plane
 *   3d_xz   four seats at 45 degrees, mirrored                   four lobes in a meridian
 *   4f_z3   +z, -z, and two cones at 39 and 141 degrees          six lobes up the axis
 *
 * The RADIAL half is the period: `n - l - 1` nodes for a real orbital, and a firing every P ticks
 * lays shells P apart. Whether that survives the medium is exactly the open question - measured,
 * the mean free path is floored near 0.7 by annihilation alone and no period has yet beaten it.
 *
 * usage: npx tsx scratch/hydro.ts <state> [ticks] [stir] [period]
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { cut, cutAll, project } from "./render.ts";
import { png } from "../src/theorems/probes/png.ts";
import { gather, tick, world, type Rules } from "../src/lib/Vacuum.ts";

const NAME = process.argv[2] ?? "2p_z";
const TICKS = Number(process.argv[3] ?? 300);
const STIR = Number(process.argv[4] ?? 0.15);
const PERIOD = Number(process.argv[5] ?? 0);
/*
 * NU AND SIGMA, because the RADIAL confinement is theirs and not the rendering's.
 *
 * The response sits in a shell about one mean free path across, so a lobe has no room to be
 * filled - measured, both the turning and the density channels show four lobes MODULATING a
 * shell rather than four solid lobes. The reach is lambda = 1/(stir + sigma rho face), and
 * lowering `stir` alone cannot fix it: sigma rho face is about 0.42 on its own, so lambda is
 * floored near 2.4 however still the vacuum is held.
 *
 * But rho is not a constant either - it is what CREATION settles at, nu(1-rho) = sigma rho^2/4.
 * Thin the vacuum by lowering nu and the annihilation falls with it:
 *
 *      nu = 1     rho ~ 0.84   lambda ~ 0.7
 *      nu = 0.1   rho ~ 0.46   lambda ~ 3.6
 *      nu = 0.03  rho ~ 0.28   lambda ~ 5.6
 *
 * Eight times the reach, which is the room a filled lobe needs. This is turning a DERIVED rate
 * into a knob - `vacuum.rates` fixes nu = 1 - so it is an experiment about what blocks the
 * radial half, not a claim about the theory's own vacuum.
 */
const NU = Number(process.argv[8] ?? 1);
const SIG = Number(process.argv[9] ?? 1);
/*
 * ONE CELL PER TICK, which is the lattice's own correspondence and was violated tenfold.
 *
 * `dt = 1` and the speed is one, so a ray moves ONE UNIT a tick. The cell was L/N = 9.6/96 = 0.1
 * of a unit, so every ray jumped TEN CELLS a step and could only ever be found at radii 0.12,
 * 1.12, 2.12 ... Measured, the turning is nought at every radius except a spike at 1.13 and a
 * trace at 2.02 - those are one tick and two ticks of flight, and nothing else exists.
 *
 * So every radial feature measured today - the 0.75 shell spacing, the "transport shells", the
 * lobes being one shell thick - is the TIME DISCRETISATION drawn in space. It is why none of it
 * moved when nu or stir changed: those alter rates, not how far a tick carries a ray.
 *
 * One cell a tick is what the lattice does - MOVEMENT takes a ray to the next cell, and that IS
 * the speed - so the grid is built that way here: cell = 1, and the box is as many cells across
 * as it is ticks wide.
 */
/*
 * ONE CELL PER STEP, WITH THE STEP MADE SMALL ENOUGH TO SEE ANYTHING.
 *
 * At dt = 1 a ray moves a whole unit a step, so a cell had to be a unit wide to avoid the
 * teleporting that made every radial feature an arrival-time artefact - but the response only
 * reaches about four units, which is four cells of radius, and the picture came out as blocks.
 *
 * `dt` is an integration STEP, not a physical constant: the rules are rates per unit length and
 * `tick` scales both the movement and every probability by it, so a quarter step integrates the
 * same dynamics four times as finely. The beat is a per-ray property (which tick made it), not a
 * global clock, so it survives the subdivision. Quarter-unit cells and a quarter-unit step keep
 * the one-cell-per-step correspondence and give sixteen cells across the region that matters.
 */
const DT = 0.25;
const N = 64, L = 16, RMAX = 3.5, CYCLE = 4;   /* the response is over by ~3 units */
/*
 * THE OUTPUT GRID COVERS THE REGION OF INTEREST, NOT THE WHOLE BOX.
 *
 * Spanning all sixteen units at 128 cells gives cells of 0.125, and the response is over by about
 * one unit - so a picture of it had twenty cells across and was blocky however it was drawn. The
 * cells were spent on empty box.
 *
 * The positions are continuous, so the output grid can cover whatever it likes: LOUT is the width
 * it spans and anything outside is simply not binned. At LOUT = 4 and 160 cells the resolution is
 * 0.025 - five times finer - for the same memory, because none of it is wasted on vacuum nobody
 * is looking at.
 */
const NO = 160;
const LOUT = 4;
/*
 * HOW WIDE A LOBE IS, as an argument. At 0.22 the cone is a thin shell in angle and the picture
 * came out as short stripes rather than filled lobes - the feature is the angular window crossed
 * with a radial shell, and both were narrow. A real orbital's lobe is FAT: |Y|^2 falls off
 * smoothly over tens of degrees, not sharply over ten.
 */
const TOL = Number(process.argv[6] ?? 0.22);
const BAND = Number(process.argv[7] ?? 0.18);

/*
 * THE PATTERN IS |Y_lm|^2 ITSELF, SMOOTH - not a narrow gate at a few seats.
 *
 * The seats fired only within about nine degrees of an exact direction, so what went out was four
 * narrow BEAMS and what they drew was four thin spokes crossed by the transport shells - "four
 * thin lines, then four more a few steps away". A real lobe is nothing like that: |Y22|^2 goes as
 * cos^2(2phi), which is smooth and spans ninety degrees, and |Y10|^2 as cos^2(theta), which
 * spans the whole hemisphere. The narrowness was mine.
 *
 * `pattern` is used as a PROBABILITY - the source draws a direction and fires with that chance -
 * so it can return the harmonic's own value instead of a gate, and then the emission has exactly
 * the angular profile of the orbital rather than a spike where its maximum is. That is what makes
 * a lobe a lobe.
 *
 * These are the real |Y_lm|^2, normalised to peak at one. The ballistic twin still separates what
 * the vacuum did from what was emitted, so imposing the profile does not hide anything - it makes
 * the comparison sharper, because the ballistic run now carries the exact shape being looked for.
 */
const sq = (v: number) => v*v;
const STATES: Record<string, (x:number,y:number,z:number)=>number> = {
  "1s":    () => 1,
  "2s":    () => 1,                                    // its node is the PERIOD, not the angle
  /* |Y10|^2 = cos^2 theta - two lobes on the axis, each spanning a whole hemisphere */
  "2p_z":  (_x,_y,z) => sq(z),
  "2p_x":  (x)       => sq(x),
  /* |Y20|^2 ~ (3cos^2 - 1)^2 - two polar lobes AND an equatorial torus, in one smooth function */
  "3d_z2": (_x,_y,z) => sq(3*z*z - 1) / 4,
  /* |Y22|^2 ~ sin^4 cos^2(2phi) - four lobes round the equator, ninety degrees apart and WIDE */
  "3d_xy": (x,y,z)   => sq(1 - z*z) * sq(Math.cos(2*Math.atan2(y,x))),
  /* |Y21|^2 ~ sin^2 cos^2 - four lobes in the meridian, at 45 degrees */
  "3d_xz": (_x,_y,z) => 4 * z*z * (1 - z*z),
  /* |Y30|^2 ~ (5cos^3 - 3cos)^2 - six lobes up the axis */
  "4f_z3": (_x,_y,z) => sq(5*z*z*z - 3*z) / 4,
  /* SAME ANGULAR SHAPE AS 3d_z2 - the difference is entirely radial, and lives in the schedule */
  "4d_z2": (_x,_y,z) => sq(3*z*z - 1) / 4,
  /*
   * THE REST OF `Atom.ts`'s SHOWN TWELVE, which is the set every other picture of this is drawn
   * for. Six of them repeat an angular shape already here and differ ONLY in the schedule - which
   * is the claim being tested, so they have to be run rather than assumed.
   */
  /* isotropic, exactly as 1s and 2s are: for an s state the whole of n is radial */
  "3s":     () => 1,
  "4s":     () => 1,
  /* |Y10|^2 again - 3p and 4p are 2p's angular shape with one and two more radial nodes */
  "3p_z":   (_x,_y,z) => sq(z),
  "4p_z":   (_x,_y,z) => sq(z),
  /* |Y21|^2 - 3d_xz's shape with a radial node added, the l = 2 twin of the 3d/4d pair */
  "4d_xz":  (_x,_y,z) => 4 * z*z * (1 - z*z),
  /*
   * |Y32|^2 ~ sin^4 cos^2 cos^2(2phi) - the |m| = 2 partner of 4f_z3, normalised by 27/4 which is
   * where (1-z^2)^2 z^2 peaks. The azimuth is taken as cos(2phi) to match `3d_xy` above; the two
   * real forms at |m| = 2 differ only by a rotation and |Y|^2 is the same either way.
   */
  "4f_xyz": (x,y,z) => 27/4 * sq(1 - z*z) * sq(z) * sq(Math.cos(2*Math.atan2(y,x))),
  /*
   * NOTHING IMPOSED. Every direction fires equally; the only thing said about the source is that
   * it CIRCULATES, which is a statement about its motion and not about its shape. Any angular
   * structure measured afterwards was made by the vacuum.
   */
  "spin": () => 1,
};

/*
 * THE RADIAL SCHEDULE, which is where n lives.
 *
 * n - l - 1 radial nodes: 3d (n=3, l=2) has NONE and 4d (n=4, l=2) has ONE, at the same angular
 * shape. So the pair is the cleanest test there is of whether the radial half works - identical
 * emission in angle, differing only in whether the amplitude changes sign partway out.
 *
 * R_42 goes as rho^2 exp(-rho/2) (6 - rho), which changes sign at rho = 6. Path length is time,
 * so with rho = tick/SCALE the node stands at radius 6 SCALE - put at 2 units here, inside the
 * region the response actually reaches.
 */
/*
 * AND IT REPEATS, or the source is silent by the time anything is measured.
 *
 * R_42 dies by rho ~ 15, which at this scale is tick 20 - and the sampling starts at tick 233.
 * The first version ran the schedule once, so the source had been quiet for two hundred ticks
 * before a single sample was taken: the ballistic run emitted NOTHING (all zeros, a black
 * picture) and the vacuum's numbers were noise on an empty difference.
 *
 * A source that is to be watched in a steady state has to keep going, so the schedule repeats.
 * PERIOD_T is one pass through it - long enough for R to have died - and the radial pattern then
 * stands still instead of washing out, at the cost of repeating every PERIOD_T of radius.
 */
const SCALE = 1/3;
const PERIOD_T = 24;                            // ticks for one pass; 24 * DT = 6 units of radius
const rhoOf = (t: number) => ((t % PERIOD_T) + PERIOD_T) % PERIOD_T * DT / SCALE;
const R42 = (t: number) => {
  const rho = rhoOf(t);
  return rho*rho * Math.exp(-rho/2) * (6 - rho) / 4;
};
const R32 = (t: number) => {
  const rho = rhoOf(t);
  return rho*rho * Math.exp(-rho/2);          // n-l-1 = 0: no sign change anywhere
};

/**
 * AND THE GENERAL ONE, because six more states is six more Laguerres and writing them out by hand
 * is six more chances to get a node in the wrong place.
 *
 * R_nl goes as rho^l e^{-rho/2} L^{2l+1}_{n-l-1}(rho), and the associated Laguerre is a three-term
 * recurrence rather than a table. `probes/emission.ts` counts this same function's sign changes
 * and gets n - l - 1 for every state it is asked about, so the nodes are the polynomial's and not
 * a choice made here.
 *
 * NORMALISED TO ITS MEAN FIRING RATE, NOT TO ITS PEAK - and the difference is the whole of
 * whether an s state comes out at all.
 *
 * `Vacuum.ts` consumes the schedule as a PROBABILITY: `rnd() >= min(1, |a|)` skips the emission,
 * so what a state actually puts out over a pass is the MEAN of min(1, |R|) and not its maximum.
 * Scaling each R_nl to peak 1 equalises the wrong number. rho^l e^{-rho/2} is a narrow spike for
 * l = 0 and a broad hump for l = 3, so at equal peaks the s states fire on a tenth of the ticks
 * the f state does: measured, 2s/3s/4s came to 0.08-0.11 against 0.48 for 4f_xyz, and the three
 * that rendered as an empty box were exactly the three at the bottom of that list. The response
 * was not weak because the vacuum did nothing with it - the source had barely been switched on.
 *
 * So the scale is solved for instead: find s such that mean(min(1, s|R|)) matches what the
 * already-committed scheduled states do, which is R32's 0.600. The states then emit the same
 * amount per pass and differ only in WHEN within it, which is what the schedule is for. The
 * clamp flattens the top of the largest states - R32 itself peaks at 2.17 and clamps - so this
 * is the treatment those two already get rather than a new one.
 *
 * R32 and R42 are deliberately NOT routed through this: they are the schedules the committed
 * 3d_z2 and 4d_z2 fields were computed with, and rescaling them would silently make those two
 * irreproducible.
 */
const laguerre = (k: number, a: number, x: number): number => {
  let l0 = 1, l1 = 1 + a - x;
  if (k === 0) return l0;
  for (let i = 1; i < k; i++) {
    const l2 = ((2*i + 1 + a - x)*l1 - (i + a)*l0) / (i + 1);
    l0 = l1; l1 = l2;
  }
  return l1;
};
const FIRE = 0.600;                               // R32's mean over a pass, the reference rate
const RNL = (n: number, l: number) => {
  const raw = (rho: number) =>
    Math.pow(rho, l) * Math.exp(-rho/2) * laguerre(n - l - 1, 2*l + 1, rho);
  const meanAt = (k: number) => {
    let m = 0;
    for (let t = 0; t < PERIOD_T; t++) m += Math.min(1, Math.abs(k * raw(rhoOf(t))));
    return m / PERIOD_T;
  };
  /* bisection on the scale - meanAt is monotone in k and saturates at 1, so this always brackets */
  let lo = 1e-6, hi = 1;
  while (meanAt(hi) < FIRE && hi < 1e12) hi *= 2;
  for (let i = 0; i < 60; i++) { const mid = (lo + hi)/2; if (meanAt(mid) < FIRE) lo = mid; else hi = mid; }
  const k = (lo + hi)/2;
  return (t: number) => k * raw(rhoOf(t));
};
const pat0 = STATES[NAME];
if (!pat0) throw new Error(`no state ${NAME} - have ${Object.keys(STATES).join(", ")}`);
const pattern = (ux: number, uy: number, uz: number, t: number) =>
  (PERIOD > 1 && t % PERIOD !== 0) ? 0 : pat0(ux, uy, uz);

/*
 * THREE RUNS, NOT ONE - and without the third the answer is the question.
 *
 * The emission pattern is IMPOSED: "2p_z" means rays are fired at +z and -z. So a picture of two
 * polar lobes is mostly the pattern PROPAGATING, and says nothing about what the vacuum did. The
 * control run removes the bare vacuum but not the source's own shape.
 *
 *   VACUUM     the pattern fired into the full rules
 *   CONTROL    the same rules with no source - the bare vacuum, subtracted cell by cell
 *   BALLISTIC  the same pattern fired into NOTHING (sigma = tau = nu = stir = 0), which is the
 *              pattern's own shape and nothing else
 *
 * `vol` is the response (vacuum - control) and `bal` is the pattern alone. What the vacuum
 * actually DID is the part of the response that the ballistic run does not already have, so both
 * are written and the difference is taken with each normalised to its own total - the two carry
 * different numbers of rays and comparing them raw would compare their brightness.
 *
 * Measured earlier on the cone patterns, this mattered enormously: an equatorial cone gives
 * P2 = -1.65 with NO VACUUM AT ALL. Read without the control that is a quadrupole response, and
 * it is geometry.
 */
/* the SAME source on both sides - the vacuum run had no schedule while the ballistic one did,
 * which compares two different emissions and calls the difference a response */
/*
 * WHICH SCHEDULE EACH STATE GETS. 3d_z2 and 4d_z2 keep the two hand-written ones so their
 * committed fields stay reproducible; every state added since is given its own R_nl. The five
 * original states with n - l - 1 = 0 (1s, 2p_z, 2p_x, 3d_xz) keep `undefined`, which is a flat
 * schedule - their fields are already computed and a radial envelope would change them.
 */
const NL: Record<string, [number, number]> = {
  "2s": [2,0], "3s": [3,0], "4s": [4,0],
  "3p_z": [3,1], "4p_z": [4,1], "4d_xz": [4,2], "4f_xyz": [4,3],
};
const SCHED = NAME === "4d_z2" ? R42 : NAME === "3d_z2" ? R32
            : NL[NAME] ? RNL(NL[NAME][0], NL[NAME][1]) : undefined;
/*
 * THE STROBE PHASE, CHOSEN SO THE NODE LANDS IN THE MIDDLE OF THE PICTURE.
 *
 * Radius r shows the schedule at phase (PHASE0 - r/DT) mod PERIOD_T, so PHASE0 decides WHICH part
 * of the schedule the frame shows and therefore where a node appears: r_node = (PHASE0 - t_node)
 * times DT.
 *
 * Set from the frame width it came out at round(6/0.25) mod 24 = 0, which put R_42's node (at
 * schedule tick 8) at r = 4.0 - the exact edge of the measured range. The field was then negative
 * at every radius inside it, which is what a node sitting on the boundary looks like and which I
 * read as no node at all. The control said as much: 3d, whose schedule never changes sign, was
 * positive everywhere.
 *
 * So it is set from the NODE instead: put t_node at the middle of the frame.
 */
const T_NODE = 8;                                  // where R_42 changes sign, in ticks
const R_NODE = 2.0;                                // where that should appear, in units
const PHASE0 = (T_NODE + Math.round(R_NODE / DT)) % PERIOD_T;
/*
 * WHAT A STEER DOES, AS A SWITCH - "turn" is the rule, "reflect" is the same rate with the
 * deflection set by the encounter instead of by CYCLE. The two share g_1 = 1/3 and differ in
 * every other moment: reflection gives g_l = 1/(2l+1), all POSITIVE, where the 90 degree turn
 * alternates, so lambda_2 is 1.25 mean free paths against 0.83. Whether that is what has been
 * stopping an l = 2 shape is exactly what this run is for.
 */
const BOUNCE = (process.argv[10] === "reflect" ? "reflect" : "turn") as "turn" | "reflect";
const R: Rules = { theta: Math.PI/2, sigma: SIG, tau: SIG, nu: NU, stir: STIR, shine: 0.02,
  makes: "polarity", bounce: BOUNCE,
  source: { rate: 24, radius: 0.3, charge: 1, pattern, schedule: SCHED,
            spin: NAME === "spin" ? "circulating" : undefined } };
const BAL: Rules = { theta: Math.PI/2, sigma: 0, tau: 0, nu: 0, stir: 0, shine: 0,
  makes: "polarity", bounce: BOUNCE,
  source: { rate: 24, radius: 0.3, charge: 1, pattern, schedule: SCHED,
            spin: NAME === "spin" ? "circulating" : undefined } };
const W = world(N, L, 9_000_000, 1/50), K = world(N, L, 9_000_000, 1/50);
const B = world(N, L, 9_000_000, 1/50);
const noSrc = { ...R, source: undefined };
/*
 * EVERY CHANNEL THE RULES DISTINGUISH - turning and total density cannot show a radial node.
 *
 * A node is a SIGN CHANGE in the polarity: R_nl goes negative and the source emits the other
 * polarity. `turned` counts turns whatever polarity turned, and `rho` counts rays whatever they
 * carry, so both are positive everywhere and NEITHER CAN SHOW A NODE BY CONSTRUCTION. The 4d
 * profile came out monotone in them, which says nothing about whether the node is there.
 *
 *   turn   `steer` events - what gravitates (`gravity.atom`: mass is how many points are turning)
 *   den    how many rays, of any sign
 *   pol    rho+ minus rho- - SIGNED, and where a radial node lives
 *   chg    net charge, sum of q - where the two charges go to different places
 *   bmg    |B|, the field that does the steering
 */
const vol = new Float64Array(N*N*N), bmg = new Float64Array(N*N*N);
/* the particle channels at the OUTPUT resolution, straight from the positions */
const den = new Float64Array(NO*NO*NO), pol = new Float64Array(NO*NO*NO),
      chg = new Float64Array(NO*NO*NO), bal = new Float64Array(NO*NO*NO);
/*
 * THE OUTPUT GRID IS NOT THE PHYSICS GRID - the model is continuous and only the mean field
 * needs cells.
 *
 * A ray's position is a float. The lattice of cells exists so that |B|, `room` and the meeting
 * rates can be read off a neighbourhood, and it has to be coarse enough to hold enough rays per
 * cell for those to mean anything. NONE OF THAT CONSTRAINS THE PICTURE. Binning the output into
 * the same cells threw away resolution the run had, and then the only way to get it back seemed
 * to be a finer simulation - which needs a smaller step, and costs.
 *
 * So the particle channels are binned STRAIGHT FROM THE POSITIONS into a grid of their own, as
 * fine as is wanted. The dynamics are untouched; what changes is how finely the answer is read.
 */
const bin = (w: any, into: Float64Array, val: (i: number) => number, sgn: number) => {
  for (let i = 0; i < w.n; i++) {
    const a=Math.floor((w.x[i]/LOUT+0.5)*NO), b=Math.floor((w.y[i]/LOUT+0.5)*NO),
          c=Math.floor((w.z[i]/LOUT+0.5)*NO);
    if(a<0||b<0||c<0||a>=NO||b>=NO||c>=NO) continue;
    into[(a*NO+b)*NO+c] += sgn * val(i) * w.wt;
  }
};
let nSamp = 0;
for (let t = 0; t < TICKS; t++) {
  tick(W, R, DT, 5); tick(K, noSrc, DT, 5); tick(B, BAL, DT, 5);
  /*
   * SAMPLED AT ONE PHASE OF THE SCHEDULE, NOT ACROSS IT.
   *
   * Radius is retarded time: what stands at r was emitted r ago, so radius r holds R(t_obs - r).
   * Averaging that over whole periods gives the MEAN of R at EVERY radius identically - the
   * radial profile is divided out exactly and a node cannot survive. Measured: 467 ticks is
   * nineteen periods, and 4d came back uniformly NEGATIVE at every radius (because its schedule
   * spends more of its period negative) while 3d came back uniformly positive. Neither showed
   * the node, and neither could have.
   *
   * Taking only the ticks at one phase keeps it: every sample then sees the same R(phase - r) at
   * each radius, so the profile stands while the vacuum's own fluctuation still averages down
   * over however many periods are run. It costs a factor of PERIOD_T in samples, which is why
   * this wants a long run rather than a longer one. `continuum-solver` records exactly this.
   */
  if (t < TICKS/3) continue;
  if (SCHED && (t % PERIOD_T) !== (PHASE0 % PERIOD_T)) continue;
  gather(W); gather(K); gather(B);
  /* every particle channel binned finely, source run less control */
  bin(W, chg, i => W.q[i], 1);   bin(K, chg, i => K.q[i], -1);
  bin(W, pol, i => W.p[i], 1);   bin(K, pol, i => K.p[i], -1);
  bin(W, den, () => 1, 1);       bin(K, den, () => 1, -1);
  bin(B, bal, () => 1, 1);
  nSamp++;
  for (let c = 0; c < N*N*N; c++) {
    vol[c] += W.turned[c] - K.turned[c];
    /*
     * AND THE DENSITY, which is the channel a CLOUD lives in.
     *
     * `turned` counts turning EVENTS, and those pile up at the transport shells - so a picture of
     * it is the angular window crossed with a radial shell, and the lobes came out as short
     * stripes at one radius. The density is filled at every radius the rays reach, which is what
     * a lobe looks like. Both are kept: turning is what gravitates (`gravity.atom`: mass is how
     * many points are turning), density is what the cloud is.
     *
     * The ballistic twin is now the DENSITY of the ballistic run against the density of the
     * vacuum one - the same quantity on both sides. It was turning against density before, which
     * is not a comparison.
     */
    bmg[c] += Math.hypot(W.Bx[c],W.By[c],W.Bz[c]) - Math.hypot(K.Bx[c],K.By[c],K.Bz[c]);
  }
}
/*
 * WHAT THE VACUUM ADDED, TAKEN ON THE DENSITY - because `vol` and `bal` are no longer the same
 * grid OR the same quantity.
 *
 * `vol` is turning on the physics grid; `bal` is now the ballistic DENSITY binned finely from
 * the positions. Subtracting them cell by cell would index two different lattices against each
 * other and call the result a response. The comparison that means something is like against
 * like: the vacuum's density against the ballistic density, both binned the same way, each
 * normalised to its own total so brightness is not mistaken for shape.
 */
const sum = (a: Float64Array) => { let s = 0; for (const v of a) s += Math.abs(v); return s || 1; };
const sd = sum(den), sb = sum(bal);
const added = new Float64Array(NO*NO*NO);
for (let c = 0; c < NO*NO*NO; c++) added[c] = den[c]/sd - bal[c]/sb;
/* repo-relative, so this runs on whichever checkout it is sitting in */
const dir = fileURLToPath(new URL("../../../visuals/vacuum/hydro", import.meta.url));
mkdirSync(dir, { recursive: true });
const TAG = `${NAME}${PERIOD>1?`p${PERIOD}`:``}s${STIR}${NU!==1?`n${NU}`:``}` +
            `${BOUNCE === "reflect" ? "R" : ""}`;
writeFileSync(`${dir}/${TAG}.f32`, Buffer.from(Float32Array.from(vol).buffer));
for (const [nm, fld] of [["pol",pol],["chg",chg],["bmg",bmg],["den",den],["bal",bal]] as [string,Float64Array][])
  writeFileSync(`${dir}/${TAG}-${nm}.f32`, Buffer.from(Float32Array.from(fld).buffer));
writeFileSync(`${dir}/${TAG}-added.f32`, Buffer.from(Float32Array.from(added).buffer));
writeFileSync(`${dir}/${TAG}.json`, JSON.stringify(
  { N, NO, L, LOUT, RMAX, dt: DT, state: NAME, period: PERIOD, stir: STIR, nu: NU, sigma: SIG,
    alpha: 0, m: 0, ticks: TICKS, bounce: BOUNCE }, null, 1));
/* AND THE PICTURES, every time - a run whose output nobody can look at is half a run */
cutAll(dir, TAG, N, L, RMAX, { vol });
cut(dir, `${TAG}-added`, added, NO, LOUT, Math.min(RMAX, LOUT/2*0.95), true);
cut(dir, `${TAG}-bmg`, bmg, N, L, RMAX, false);
/* the particle channels at their own, finer resolution - signed, since a node is a sign change
 * and a density ramp hides one */
for (const [nm, fld, sg] of [["den",den,false],["bal",bal,false],
                             ["pol",pol,true],["chg",chg,true]] as [string,Float64Array,boolean][]) {
  cut(dir, `${TAG}-${nm}`, fld, NO, LOUT, Math.min(RMAX, LOUT/2*0.95), sg);
  project(dir, `${TAG}-${nm}`, fld, NO, LOUT, Math.min(RMAX, LOUT/2*0.95));
}

/* the harmonics, for the record - the pictures are cut from the field afterwards */
const P = (l:number,x:number):number => { if(l===0)return 1; if(l===1)return x;
  let pm=1,p=x; for(let k=2;k<=l;k++){const pn=((2*k-1)*x*p-(k-1)*pm)/k;pm=p;p=pn;} return p; };
const NA = 32, ang = new Float64Array(NA);
for (let a=0;a<N;a++) for(let b=0;b<N;b++) for(let e=0;e<N;e++){
  const x=(a+0.5-N/2)*L/N, y=(b+0.5-N/2)*L/N, z=(e+0.5-N/2)*L/N;
  const r=Math.hypot(x,y,z); if(r>=RMAX||r<0.2) continue;
  ang[Math.min(NA-1,Math.floor((z/r+1)/2*NA))] += vol[(a*N+b)*N+e];
}
const angB = new Float64Array(NA);
for (let a=0;a<N;a++) for(let b=0;b<N;b++) for(let e=0;e<N;e++){
  const x=(a+0.5-N/2)*L/N, y=(b+0.5-N/2)*L/N, z=(e+0.5-N/2)*L/N;
  const r=Math.hypot(x,y,z); if(r>=RMAX||r<0.2) continue;
  angB[Math.min(NA-1,Math.floor((z/r+1)/2*NA))] += bal[(a*N+b)*N+e];
}
const harmOf = (h: Float64Array) => {
  let tot=0; for(const v of h) tot+=v;
  return [1,2,3,4,6].map(l=>{ let s=0;
    for(let i=0;i<NA;i++) s+=(h[i]/(tot||1)*NA-1)*P(l,-1+(i+0.5)*2/NA)/NA; return s*(2*l+1); });
};
/*
 * AND THE RADIAL PROFILE OF BOTH, printed far enough out to see the falloff.
 *
 * The angular numbers say nothing about whether the cloud ends. What is wanted from a hydrogen
 * state is that it RISES, peaks, and falls away - and for 4d, that it changes SIGN once on the
 * way, which 3d never does. Printed for the vacuum and the ballistic side by side, since the
 * ballistic one is the schedule with nothing done to it and is the shape to beat.
 */
{
  const NBr = 28, sv = new Float64Array(NBr), cv = new Float64Array(NBr),
        sb2 = new Float64Array(NBr), cb2 = new Float64Array(NBr);
  for (let a=0;a<N;a++) for(let b=0;b<N;b++) for(let e=0;e<N;e++){
    const x=(a+0.5-N/2)*L/N, y=(b+0.5-N/2)*L/N, z=(e+0.5-N/2)*L/N;
    const r=Math.hypot(x,y,z); const i=Math.floor(r/RMAX*NBr); if(i>=NBr) continue;
    const k=(a*N+b)*N+e;
    sv[i]+=vol[k]; cv[i]++; sb2[i]+=bal[k]; cb2[i]++;
  }
  const pv = Array.from(sv,(v,i)=>cv[i]?v/cv[i]:0);
  const pb2 = Array.from(sb2,(v,i)=>cb2[i]?v/cb2[i]:0);
  const mv = Math.max(...pv.map(Math.abs))||1, mb = Math.max(...pb2.map(Math.abs))||1;
  console.log(`  radial (r, vacuum, ballistic) - a node is a SIGN CHANGE:   [${nSamp} samples]`);
  for (let i=0;i<NBr;i++){
    const r=(i+0.5)*RMAX/NBr;
    const bar=(v:number,m:number)=>(v>=0?"+":"-")+"#".repeat(Math.min(20,Math.round(Math.abs(v)/m*20)));
    console.log(`    ${r.toFixed(2).padStart(5)}  ${pv[i].toFixed(2).padStart(10)} ${bar(pv[i],mv).padEnd(22)}` +
      `${pb2[i].toFixed(2).padStart(10)} ${bar(pb2[i],mb)}`);
  }
}
const hv = harmOf(ang), hb = harmOf(angB);
console.log(`${TAG.padEnd(14)} vacuum ${hv.map(v=>v.toFixed(2).padStart(6)).join(" ")}` +
  `  | ballistic ${hb.map(v=>v.toFixed(2).padStart(6)).join(" ")}` +
  `  | ADDED ${hv.map((v,i)=>(v-hb[i]).toFixed(2).padStart(6)).join(" ")}`);
