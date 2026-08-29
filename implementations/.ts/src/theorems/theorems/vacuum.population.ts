/**
 * WHAT `vacuum.continuum` LEAVES OUT, AND EACH PIECE DECIDES WHETHER A FIELD GETS OUT OF THE BOX.
 *
 * That theorem writes every rule as a term in how a density changes: transport, the turn about
 * its own field, what a neutral point makes, what a meeting takes and what it turns, what the
 * turning sheds. As an accounting of the rules it is complete. But `sigma·n·n~` is a rate only
 * once three things are said that the term does not say, and every one of them was found by the
 * model doing the wrong thing until it was put in:
 *
 *   THE BEAT. Splitting and killing are not both happening every tick - they ALTERNATE, one
 *   tick makes the pairs and the next takes them. Running both as Poisson rates every tick is
 *   the MEAN of that cycle, and the mean of an alternation is not the alternation: it kills
 *   what was just made. A ray therefore carries which beat made it and meets only facing
 *   opposites of its own, so half of what it faces cannot touch it. Measured: 0.513.
 *
 *   THE FACING. A meeting is with what is coming the OTHER way, so the rate goes against the
 *   opposing polarity's CURRENT and not its density - (1 - d^·j^)/2, which is one head-on and
 *   nought co-moving. In a vacuum with no bias the mean heading is nothing and the factor is a
 *   half. Measured: 0.517. Without it a ray is stopped by a crowd that is running alongside it.
 *
 *   THE WEIGHT. `room = max(0, 1 - rho)` is CONVEX, so reading it off one or two rays in a cell
 *   returns more room than there is and the box creates its way past its own fixed point. A
 *   particle stands for a fraction of a ray instead. Doubling the mean-field grid at a fixed
 *   weight moves the settled density 44%; doubling it with the weight taken down by the cell
 *   volume moves it 2%. THE GRID IS NOT IN THE ANSWER, the sampling is - which is the whole
 *   claim of a continuum model implemented on a grid, stated as something that can be checked.
 *
 * NONE OF THIS IS A NEW RULE. The beat is `G/2` and ANNIHILATION being two rules that fire at
 * different times, the facing is ANNIHILATION's own quantifier read honestly, and the weight is
 * arithmetic. What they change is what the equation MEANS when it is integrated.
 */
import { term } from "../Expr.ts";
import { expo } from "../Algebra.ts";
import { base } from "../Algebra.ts";
import { Theorem } from "../Theorem.ts";
import {
  BEATSHARE, FACING, GRIDFREE, ONEBEAT, RHO_INF, SAMPLING, population,
} from "../probes/population.ts";
import { DENSITY, KILLS, MAKES, OCCUPANCY } from "./vacuum.continuum.ts";

/** the opposing polarity's mean heading, which is what a meeting is actually against */
export const CURRENT = "\\hat{j}";
/** which beat made a ray - the tick it was split on, carried with it */
export const BEAT = "b";
/** what one particle stands for, and it is not one ray */
export const WEIGHT = "w";
/** how many cells the moments are read on - a number in the implementation, not in the model */
export const GRID = "N_{cell}";

/* ------------------------------------------------------------------------------------- */

export const facing: Theorem = {
  id: "vacuum.facing",
  asks: "ANNIHILATION is quantified over a ray and something FACING it. Against what, exactly " +
    "- the opposing density where it stands, or the part of it that is coming the other way?",
  about: FACING,
  probes: [population],
  uses: ["vacuum.continuum", "meeting.rate"],
  wants: [
    { kind: "value", of: FACING, equals: { n: 1, d: 2 } },
  ],
  glossary: {
    [FACING]: { symbol: "F=(1-\\hat{d}·\\hat{j})/2", says: "how much of a meeting a pair actually is: one head-on, nought co-moving, a half for a crowd going nowhere in particular" },
    [CURRENT]: { symbol: "\\hat{j}", says: "the opposing polarity's mean heading where the ray stands - its current, which is a first moment of the density and not the density" },
    [KILLS]: { symbol: "\\sigma n\\tilde{n}", says: "ANNIHILATION as a rate, once it is said what n~ is" },
    [DENSITY]: { symbol: "n", says: "how many rays are at a place heading a way carrying a sign" },
  },
};

export const facingDefinitions = [
  {
    fact: { kind: "product" as const, of: KILLS, from: [DENSITY, FACING] },
    because: "THE RULE SAYS `FACING`, AND FACING IS A STATEMENT ABOUT TWO HEADINGS. `G^XOR`'s " +
      "ANNIHILATION fires on a pair across an edge whose polarities differ and whose ends " +
      "point AT each other; two rays with opposite polarity travelling the same way share no " +
      "edge to meet across, and the rule never fires on them however dense they are. So what " +
      "multiplies the cross-section is not the opposing density, it is the part of it coming " +
      "the other way - the density times (1 - d^·j^)/2, against the opposing polarity's own " +
      "mean heading. THIS WAS LEFT OUT AND THE VACUUM SCREENED EVERYTHING: a ray leaving a " +
      "source was stopped by a crowd that was in fact running alongside it, and no field got " +
      "further than a length unit from where it was made",
    line: `${KILLS} = \\sigma·${DENSITY}·\\tilde{${DENSITY}}·\\frac{1-\\hat{d}·${CURRENT}}{2}`,
  },
  {
    fact: { kind: "value" as const, of: FACING, equals: { n: 1, d: 2 } },
    because: "AND IN AN UNBIASED VACUUM THAT FACTOR IS A HALF, which is not a coefficient " +
      "anybody chose. j^ is a mean of directions over the opposing polarity where the ray " +
      "stands, and with nothing driving the box it averages to nothing - so (1 - d^·j^)/2 " +
      "averages to a half whatever the ray is doing. Measured over a settled population it is " +
      "0.517. The factor only departs from a half where the vacuum is being DRIVEN, and that " +
      "is exactly where it should: a ray heading into an oncoming stream dies faster and one " +
      "riding with it does not die at all",
    line: `\\langle ${FACING} \\rangle = 1/2`,
  },
];

/* ------------------------------------------------------------------------------------- */

export const beats: Theorem = {
  id: "vacuum.beats",
  asks: "the making and the killing are two rules that fire at different times, not two terms " +
    "that hold at once. What is left of the vacuum once that is taken seriously?",
  about: BEATSHARE,
  probes: [population],
  uses: ["vacuum.continuum", "vacuum.occupancy", "vacuum.facing"],
  wants: [
    { kind: "value", of: BEATSHARE, equals: { n: 1, d: 2 } },
    { kind: "positive", of: RHO_INF },
  ],
  glossary: {
    [BEAT]: { symbol: "b", says: "which tick split a ray into being, carried with it - so a ray knows which half of the vacuum it belongs to" },
    [BEATSHARE]: { symbol: "\\beta", says: "how much of the opposing polarity shares a ray's beat and can therefore kill it - the rest it passes straight through" },
    [ONEBEAT]: { symbol: "S_{1}", says: "where the same rules settle when every ray is put on one beat, against where they settle when they are not" },
    [RHO_INF]: { symbol: "\\rho_{\\infty}", says: "what the population settles at with nothing driving it" },
    [MAKES]: { symbol: "\\nu(1-\\rho)", says: "(G/2), which fires on one beat" },
    [KILLS]: { symbol: "\\sigma n\\tilde{n}F", says: "ANNIHILATION, which fires on the other" },
  },
};

export const beatsDefinitions = [
  {
    fact: { kind: "product" as const, of: KILLS, from: [DENSITY, BEATSHARE] },
    because: "SPLITTING AND KILLING ALTERNATE, AND THE MEAN OF AN ALTERNATION IS NOT THE " +
      "ALTERNATION. One tick a neutral point splits and makes a pair; the next, facing " +
      "opposites annihilate. Written as two Poisson rates both acting every tick - which is " +
      "what a continuous dt does - what was just made is offered to the killing immediately, " +
      "and a pair never gets clear of where it was born. A ray therefore carries the beat that " +
      "made it and meets only facing opposites of its OWN beat, so the vacuum is two " +
      "interleaved populations passing through each other. Measured, a ray can be killed by " +
      "0.513 of the opposing polarity where it stands and passes through the rest",
    line: `${KILLS} \\to \\sigma·${DENSITY}·\\tilde{${DENSITY}}_{${BEAT}}·F`,
  },
  {
    fact: { kind: "value" as const, of: BEATSHARE, equals: { n: 1, d: 2 } },
    because: "AND WITH TWO BEATS THE SHARE IS A HALF, for the same reason the facing factor is: " +
      "creation puts a pair on the beat that is splitting and the beats are symmetric, so half " +
      "of what a ray faces was made on the other one. THE GLOBAL CLOCK IS THE VERSION THAT " +
      "FAILS - gating the whole box, split on even ticks and kill on odd, gives every ray the " +
      "same beat, and then the entire population dies in lockstep and is remade: 204800 rays, " +
      "then none, then 204800. The beat has to be a property of the RAY, which is what makes " +
      "it two populations rather than one flashing on and off",
    line: `${BEATSHARE} = 1/2`,
  },
  {
    fact: { kind: "value" as const, of: ONEBEAT, equals: { n: 94, d: 100 } },
    because: "AND WHAT IT IS WORTH IS SIX PER CENT OF THE FIXED POINT, WHICH IS SMALLER THAN " +
      "IT SOUNDS AND WORTH SAYING PLAINLY. Collapsing the beats makes every facing opposite a " +
      "partner, so the killing a ray sees doubles against the same creation and the population " +
      "has to sit lower to pay for it - it settles at 0.94 of where it otherwise would. The " +
      "beat is therefore not what lets a vacuum exist; it is what lets a ray get CLEAR of the " +
      "pair it was made with, and that is a statement about propagation rather than about the " +
      "fixed point. The density barely notices",
    line: `${ONEBEAT} = 0.94`,
  },
];

/* ------------------------------------------------------------------------------------- */

export const carried: Theorem = {
  id: "vacuum.population",
  asks: "the model is meant to be continuous, and it is integrated on a grid. Is the grid in " +
    "the answer?",
  about: GRIDFREE,
  probes: [population],
  uses: ["vacuum.continuum", "vacuum.rates", "vacuum.beats"],
  wants: [
    { kind: "value", of: GRIDFREE, equals: { n: 1, d: 1 } },
    { kind: "constant", of: GRIDFREE },
  ],
  glossary: {
    [GRIDFREE]: { symbol: "\\rho^{fine}/\\rho^{coarse}", says: "the settled density on a doubled mean-field grid against the coarse one, with the same number of particles in each cell" },
    [SAMPLING]: { symbol: "\\rho^{under}/\\rho", says: "and the same doubling with the weight left alone, which is the convexity bias on its own" },
    [WEIGHT]: { symbol: "w", says: "what one particle stands for - a fraction of a ray, so a cell can hold a hundred of them at rho below one" },
    [GRID]: { symbol: "N_{cell}", says: "how many cells the moments are read on: a number in the implementation, and the thing this theorem is asking about" },
    [OCCUPANCY]: { symbol: "\\rho_{\\infty}", says: "the fixed point, which is what the grid is being asked not to move" },
  },
};

export const carriedDefinitions = [
  {
    fact: { kind: "product" as const, of: MAKES, from: [WEIGHT] },
    because: "`room = max(0, 1 - rho)` IS CONVEX, AND THAT IS NOT A DETAIL. The fixed point is " +
      "under one ray a unit volume, so at one cell per unit volume the gate is being read off " +
      "a Poisson count of nought, one or two - and the mean of max(0, 1-rho) over that noise is " +
      "LARGER than max(0, 1-<rho>). Measured unweighted the box settled at 1.33 and went on " +
      "creating where there should have been no room at all. A particle therefore stands for a " +
      "fraction of a ray: the density, the field and every meeting rate are sums of weights, " +
      "nothing in the physics moves, and the gate is read off a smooth number",
    line: `${MAKES} = \\nu·\\max(0, 1-\\rho),\\ \\rho = \\sum ${WEIGHT}/V`,
  },
  {
    fact: { kind: "value" as const, of: SAMPLING, equals: { n: 144, d: 100 } },
    because: "SO DOUBLING THE GRID ALONE MOVES THE ANSWER 44 PER CENT, AND IT IS THE SAMPLING " +
      "THAT MOVED. Twice as many cells a side is eight times the cells and an eighth of the " +
      "particles in each, which is the convexity above seen again - the finer grid reads more " +
      "room than there is and settles higher. A reader who stopped here would conclude the " +
      "model was grid-dependent, and would be reading a Monte Carlo error as a physical one",
    line: `${SAMPLING} = 1.44`,
  },
  {
    fact: { kind: "value" as const, of: GRIDFREE, equals: { n: 1, d: 1 } },
    because: "AND WITH THE PARTICLES PER CELL HELD FIXED IT MOVES 2 PER CENT. The same doubling " +
      "with the weight taken down by the cell volume leaves the settled density where it was. " +
      "THAT is the statement that this is a continuum model: the positions are continuous, the " +
      "grid carries nothing but the moments the mean field needs - rho, B, and the two currents " +
      "- and once it is sampled well enough it is not in the answer. Which is the difference " +
      "between this and every lattice run in the book, where the tiling is not a numerical " +
      "parameter but the thing being solved, and where `vacuum.rates` shows the ONE thing a " +
      "geometry still contributes is THETA",
    line: `${GRIDFREE} = 1`,
  },
];

/* ------------------------------------------------------------------------------------- */

/** the whole model on one line - what everything above comes to when it is put together */
export const MODEL = "\\mathcal{L}n";
/** the turn as an OPERATOR rather than as a force: a fixed angle about the field's axis */
export const SCATTER_OP = "S_{\\Theta}";
/** what a meeting of alike signs does - it reverses, it does not remove */
export const REVERSE = "R";
/** and what is put into the box from outside, which is the only place a state can live */
export const SOURCE = "\\Sigma";

export const equation: Theorem = {
  id: "vacuum.equation",
  asks: "every rule has been written as a term and three of those terms have been corrected. " +
    "Put the whole of it on one line - what IS the continuous model?",
  about: MODEL,
  probes: [population],
  uses: ["vacuum.continuum", "vacuum.facing", "vacuum.beats", "vacuum.population",
    "turn.kernel", "vacuum.rates"],
  wants: [
    { kind: "equals", of: MODEL,
      to: [term(1, base(MAKES)), term(-1, base(KILLS)), term(1, base(SCATTER_OP)),
        term(1, base(SOURCE))] },
    { kind: "positive", of: RHO_INF },
  ],
  glossary: {
    [MODEL]: { symbol: "(\\partial_{t}+\\hat{d}·\\nabla_{x})n_{b}", says: "the whole left-hand side: how the population on beat b at a place heading a way carrying two signs changes, and the transport that carries it" },
    [SCATTER_OP]: { symbol: "(\\sigma_{s}+|B|)(S_{\\Theta}-1)n_{b}", says: "`steer` as a SCATTERING OPERATOR and not as a force: at a rate set by the vacuum's own stir plus the local field, a ray is turned by the fixed angle THETA about the field's axis - uniform where there is no field - and `turn.kernel` gives that operator's harmonics in closed form" },
    [REVERSE]: { symbol: "\\tau n\\tilde{n}_{b}F(R-1)", says: "(G+M/3): an alike facing pair is sent back the way it came. It removes nothing, which is why it is a reversal operator and not a loss term" },
    [SOURCE]: { symbol: "\\Sigma(x,\\hat{d},t)", says: "what is put in from outside - the only term that is not a rule, and the only place a STATE can be written" },
    [MAKES]: { symbol: "\\nu(1-\\rho)", says: "(G/2), on the splitting beat, gated on the room left" },
    [KILLS]: { symbol: "\\sigma n\\tilde{n}_{b}F", says: "ANNIHILATION: same beat, and against the oncoming current" },
    [FACING]: { symbol: "F", says: "(1-\\hat{d}·\\hat{j})/2 - a half in an unbiased vacuum, one head-on, nought co-moving" },
    [BEATSHARE]: { symbol: "\\beta", says: "and the tilde is taken on the ray's OWN beat, which is half of what it faces" },
  },
};

export const equationDefinitions = [
  {
    fact: { kind: "equals" as const, of: MODEL,
      to: [term(1, base(MAKES)), term(-1, base(KILLS)), term(1, base(SCATTER_OP)),
        term(1, base(SOURCE))] },
    because: "THE WHOLE MODEL, ON ONE LINE, WITH EVERY CORRECTION IN IT:\n\n" +
      "  (d_t + d^·grad_x) n_b = nu(1-rho)/2 - sigma n_b n~_b F - tau n_b n~_b F (1-R) " +
      "+ (sigma_s + |B|)(S_Theta - 1) n_b + chi·(turning)_{1-b} + Sigma\n\n" +
      "with B(x) = integral p d^ n dd^, F = (1 - d^·j^_opp)/2, rho = sum of weights over the " +
      "cell, and b the beat the ray was made on. EVERY SYMBOL IN IT IS A RULE. The transport " +
      "is MOVEMENT; nu(1-rho) is (G/2) with its room gate; sigma is ANNIHILATION and tau is " +
      "(G+M/3), both against the ONCOMING population of the ray's OWN beat; S_Theta is `steer`; " +
      "chi is RADIATING, and what it sheds lands on the OTHER beat because it is made between " +
      "the splitting and the killing. Nothing else is in it.\n\n" +
      "AND THE TURN IS AN OPERATOR, NOT A FORCE. `vacuum.continuum` wrote it as " +
      "q(B x d^)·grad_d n, which is the Vlasov reading and is what a SMALL turn would be. The " +
      "rule does not make small turns: it makes one of size THETA = 2pi/CYCLE, which is 60, 90 " +
      "or 45 degrees. A finite rotation is not a derivative, so it belongs in a collision " +
      "operator - and once it is one, `turn.kernel` diagonalises it and the whole angular " +
      "problem is g_l = <P_l(cos gamma)>, in closed form, with nothing expanded or truncated",
    line: `(\\partial_{t}+\\hat{d}·\\nabla_{x})n_{b} = ${MAKES} - ${KILLS} - ${REVERSE} + ` +
      `${SCATTER_OP} + \\chi(turning)_{1-b} + ${SOURCE}`,
  },
  {
    fact: { kind: "scales" as const, of: SCATTER_OP,
      by: { [DENSITY]: expo(1), [FACING]: expo(0) } },
    because: "AND THE STEERING RATE IS THE VACUUM'S OWN STIR PLUS THE LOCAL FIELD, which is " +
      "the one place the equation is nonlinear in a way `turn.kernel` cannot take apart. " +
      "`steer` fires once a ring step per tick against the field a ray has accumulated, so " +
      "where the field is nought a ray still turns - at sigma_s, about a uniform axis, which " +
      "is `turn.isotropic` - and where a source has built a field it turns faster and about " +
      "THAT axis. The sense is the ray's CHARGE, so the two charges wind opposite ways in the " +
      "same field, which is the only thing in the equation that tells them apart",
    line: `${SCATTER_OP} = (\\sigma_{s} + |B|)(S_{\\Theta} - 1)n_{b}`,
  },
  {
    fact: { kind: "constant" as const, of: SOURCE },
    because: "AND EVERY TERM BUT ONE IS A RULE. Sigma is what is put into the box from " +
      "outside and it is the ONLY place anything about a particular problem can be written - " +
      "which is the whole reason the equation is worth having in this form. The rules do not " +
      "know what a hydrogen atom is and nothing in them should; what a source does is a " +
      "question about the source. `atom.emission` is that equation with a Sigma written for a " +
      "hydrogen state and NOTHING ELSE CHANGED, and the point of separating them is that the " +
      "separation can then be checked rather than asserted",
    line: `${SOURCE} \\text{ is the only term that is not a rule}`,
  },
];
