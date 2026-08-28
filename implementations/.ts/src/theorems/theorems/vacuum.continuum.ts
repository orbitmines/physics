/**
 * ALL OF `G^XOR+XOR` IN ONE EQUATION - every rule as a term, and nothing else in it.
 *
 * WHAT A STATE IS, ONCE THERE ARE TOO MANY RAYS TO NAME. A ray is a position, an exit it is
 * heading down, and the two signs it carries. Below the scale where individual rays matter,
 * what is left is HOW MANY of them are at a place heading a way carrying a sign - a density
 * n(x, d, p, q, t), one number per cell of that space. Nothing is thrown away by the move:
 * the rules never ask which ray, only what is at a point, so a density is exactly as much as
 * they can see.
 *
 * AND THEN EVERY RULE IS A TERM. Each of the five is a statement about how that density
 * changes in one tick, and putting them on one line is the whole of the continuum reading:
 *
 *   d_t n            what changes                                    the tick itself
 *   + c·d^·grad_x n  every active ray moves one cell along its exit  (MOVEMENT/STREAM)
 *   + q(B x d^)·grad_d n   a charge is turned one ring step about the local B, in the sense
 *                    its charge gives - a rotation in the DIRECTION argument and not in
 *                    space, which is what `steer` does and why it moves no mass       (steer)
 *   = nu·(1 - rho)   a NEUTRAL point splits into a pair, unconditionally, and only a neutral
 *                    one - so creation is gated on the room left, which is the (1-rho) and is
 *                    where the vacuum's own fixed point comes from                     (G/2)
 *   - sigma·n·n~     two rays facing each other across an edge with opposite sign are both
 *                    destroyed - a loss quadratic in the density and taken against the
 *                    ONCOMING population n~ = n(x, -d, -p), which is what makes it a meeting
 *                    rather than a decay                                       (ANNIHILATION)
 *
 * AND THE FIELD IS NOT A SIXTH TERM - IT IS THE DENSITY'S OWN MOMENT. `fieldAt` sums polarity
 * times direction over the rays AT a point and calls that B; in the limit that is
 * B(x) = integral p·d^·n dd, so the equation is closed on itself. THAT is what makes this one
 * equation rather than a system: the thing doing the steering is the thing being steered,
 * and no field is carried alongside.
 *
 * WHAT IT IS, IN THE USUAL WORDS. A Vlasov equation with a collision term - transport, a
 * self-consistent force, a source and a sink - and it is the same shape as a plasma's, which
 * is not a coincidence, because a vacuum of charges turning in their own field IS one.
 *
 * WHY IT IS WORTH HAVING. A lattice run costs one pass over every cell and every exit per
 * tick and must be averaged over seeds to say anything, because it resolves rays nobody
 * asked about. This equation is deterministic and has no seeds in it, so the same picture
 * comes out of one integration - which is what makes an atom's cloud affordable to draw.
 */
import { expo } from "../Algebra.ts";
import { term } from "../Expr.ts";
import { base } from "../Algebra.ts";
import { Theorem } from "../Theorem.ts";
import { counts, CYCLE_Q, DEG_Q, DIM_Q } from "../probes/counts.ts";
import { RESIDUAL, residual } from "../probes/residual.ts";

/** how many rays are at a place, heading a way, carrying a sign */
export const DENSITY = "n_{ray}";
/** how it changes on a tick - the thing the equation is about */
export const EVOLVE = "dn/dt";
/** every active ray moves one cell along its own exit */
export const STREAM = "streaming";
/** and a charge is turned about the local field, in the sense its charge gives */
export const TURNS = "turning";
/** a neutral point splits, and only a neutral one */
export const MAKES = "making";
/** two rays facing each other with opposite signs are both destroyed */
export const KILLS = "killing";
/** and two facing with ALIKE signs are deflected instead - (G+M/3) */
export const DEFLECTS = "deflecting";
/** a turn throws off a ray of its own - RADIATING, and the whole of "turning gravitates" */
export const SHINES = "shining";
/** and space itself moves - a fold takes a point away, an insert makes one */
export const SPACE = "space";
/** what the vacuum settles at when nothing is driving it - what the equation IMPLIES */
export const OCCUPANCY = "\\rho_{\\infty}";
/** the field, which is the density's own first moment and not a thing carried beside it */
export const FIELD_B = "B_{field}";

export const continuum: Theorem = {
  id: "vacuum.continuum",
  asks: "below the scale where one ray matters, what is left of the rules? Write every one " +
    "of them as a term in how the density of rays changes, and see what the sum is",
  about: OCCUPANCY,
  probes: [counts, residual],
  uses: ["vacuum.occupancy", "lattice.turn", "meeting.rate"],
  wants: [
    { kind: "equals", of: OCCUPANCY, to: [term(1, base(MAKES))] },
    { kind: "equals", of: EVOLVE, to: [term(1, base(MAKES))] },
    { kind: "positive", of: RESIDUAL },
  ],
  glossary: {
    [DENSITY]: { symbol: "n(x,\\hat{d},p,q,t)", says: "how many rays are at a place, heading a way, carrying a sign - all the rules can see, since none of them asks WHICH ray" },
    [EVOLVE]: { symbol: "\\partial_{t}n", says: "how that changes on one tick, which is what every rule is a statement about" },
    [STREAM]: { symbol: "c\\hat{d}·\\nabla_{x}n", says: "MOVEMENT: every active ray goes one cell along its own exit, so the density is carried at one cell a tick" },
    [TURNS]: { symbol: "q(B\\times\\hat{d})·\\nabla_{d}n", says: "steer: a charge is turned one ring step about the local B in the sense its charge gives - a rotation in the DIRECTION and not in space, which is why it moves nothing" },
    [MAKES]: { symbol: "\\nu(1-\\rho)", says: "(G/2): a NEUTRAL point splits into a pair unconditionally, and only a neutral one - so what is made is gated on the room left" },
    [KILLS]: { symbol: "\\sigma n\\tilde{n}", says: "ANNIHILATION: two rays facing across an edge with opposite signs are both destroyed - quadratic, and taken against the ONCOMING population, which is what makes it a meeting" },
    [DEFLECTS]: { symbol: "\\tau n\\tilde{n}", says: "(G+M/3): alike facing pairs are turned rather than destroyed - what makes the vacuum a medium instead of a gas of beams" },
    [SHINES]: { symbol: "\\chi·(turning)", says: "RADIATING: a corner throws off a ray carrying a polarity of its own, which goes back into the field that bent it - 'turning is what makes gravity', as an arithmetic" },
    [SPACE]: { symbol: "space", says: "how much space a cell stands for - a fold takes a point away and an insert makes one, and the shortfall against what expansion would have made is the deficit" },
    [FIELD_B]: { symbol: "B=\\int p\\hat{d}n\\,d\\hat{d}", says: "the field is the density's own first moment - `fieldAt` sums polarity times direction over what is AT a point - so the equation closes on itself and no field travels beside it" },
    [RESIDUAL]: { symbol: "f", says: "what the making and the killing do not cancel between them" },
    [CYCLE_Q]: { symbol: "CYCLE", says: "how many ring steps go round, which sets how big one turn is" },
    [DEG_Q]: { symbol: "DEG", says: "how many exits a point has, which is what the direction integral runs over" },
    [DIM_Q]: { symbol: "D", says: "the lattice's dimension" },
  },
};

export const definitions = [
  {
    fact: { kind: "scales" as const, of: STREAM, by: { [DENSITY]: expo(1) } },
    because: "MOVEMENT carries every active ray one cell along its own exit and changes " +
      "nothing else about it, so as a statement about a density it is transport at one cell " +
      "a tick - linear in n, because a ray does not consult its neighbours to move",
    line: `${STREAM} = c·\\hat{d}·\\nabla_{x}${DENSITY}`,
  },
  {
    fact: { kind: "scales" as const, of: TURNS,
      by: { [DENSITY]: expo(1), [FIELD_B]: expo(1) } },
    because: "and `steer` turns a charge one ring step about the local B, in the sense the " +
      "charge gives. A turn changes the DIRECTION and not the place, so it is a rotation in " +
      "the direction argument - and it is linear in n and in B separately, which is what " +
      "makes the pair of them the nonlinearity when B is itself made of n",
    line: `${TURNS} = q(${FIELD_B}\\times\\hat{d})·\\nabla_{d}${DENSITY}`,
  },
  {
    fact: { kind: "product" as const, of: FIELD_B, from: [DENSITY] },
    because: "AND THE FIELD IS THE DENSITY'S OWN MOMENT. `fieldAt` sums polarity times " +
      "direction over the rays AT a point and calls the result B - there is no separate " +
      "field quantity anywhere in the theory and no rule maintains one. So B is an integral " +
      "of n, the steering term is n against its own moment, and the equation is closed",
    line: `${FIELD_B} = \\int p·\\hat{d}·${DENSITY}\\,d\\hat{d}`,
  },
  {
    fact: { kind: "scales" as const, of: DEFLECTS, by: { [DENSITY]: expo(2) } },
    because: "AND A MEETING OF ALIKE SIGNS TURNS INSTEAD OF KILLING - (G+M/3), which is the " +
      "other half of the same rule and was left out of the first version of this line. " +
      "`G^XOR`'s ANNIHILATION reads the two polarities and only destroys where they DIFFER; " +
      "where they agree it inserts a point, marks both ends bounced and credits a " +
      "deflection. Nothing dies. It is quadratic for the same reason the killing is - it " +
      "takes a ray and something facing it - but it moves no density at all: it only sends " +
      "what met back the way it came. THAT IS WHAT MAKES THE VACUUM A MEDIUM RATHER THAN A " +
      "GAS OF BEAMS, and without it nothing ever leaves the exit it set out on",
    line: `${DEFLECTS} = \\tau·${DENSITY}·\\tilde{${DENSITY}}`,
  },
  {
    fact: { kind: "scales" as const, of: SHINES, by: { [TURNS]: expo(1) } },
    because: "AND A TURN THROWS OFF A RAY OF ITS OWN. `G^XOR^o`'s RADIATING: at the corner a " +
      "ray goes out AGAINST the heading it had, carrying a polarity `made` decides - which " +
      "is the recoil of being bent. So bending is not only a redirection, it is a SOURCE, " +
      "and what it makes goes straight back into the B that did the bending. This is the " +
      "whole of 'turning is what makes gravity' as an arithmetic, and a solver without it " +
      "has the field acting on the density and the density never acting back",
    line: `${SHINES} = \\chi·${TURNS}`,
  },
  {
    fact: { kind: "scales" as const, of: SPACE,
      by: { [DEFLECTS]: expo(1), [KILLS]: expo(-1) } },
    because: "AND SPACE IS NOT A FIXED GRID WITH THINGS ON IT. A destroyed pair FOLDS - " +
      "`here.fold(there)` puts two points into one and credits `destroyed` - and an alike " +
      "meeting INSERTS one between them. So the count of points moves as the vacuum runs, " +
      "and THE SHORTFALL AGAINST WHAT THE EXPANSION WOULD HAVE MADE IS THE DEFICIT, which is " +
      "what gravity is here. It feeds back rather than being carried beside: (G/2) splits a " +
      "point where there IS one, so where space has been folded away there is less to split",
    line: `\\partial_{t}${SPACE} = \\phi(${DEFLECTS} - ${KILLS})`,
  },
  {
    fact: { kind: "scales" as const, of: KILLS, by: { [DENSITY]: expo(2) } },
    because: "ANNIHILATION is quantified over a FACING PAIR and destroys both ends, so what " +
      "it removes goes as the density times the density coming the other way - QUADRATIC, " +
      "which is what distinguishes a meeting from a decay. A ray with nothing facing it is " +
      "not killed however long it flies",
    line: `${KILLS} = \\sigma·${DENSITY}·\\tilde{${DENSITY}}`,
  },
  {
    /*
     * THE EQUATION AS AN EQUALITY AND NOT AS A `sum`. `conclusions` gathers the subjects a
     * proof said anything final about from its `scales`, `value` and `equals` facts, and a
     * `sum` is none of those - so stating the line as a sum meant the kernel could reach it
     * and never report it. An `Expr` IS a sum of monomials, which is exactly what this line
     * is, so it goes in as one.
     */
    fact: { kind: "equals" as const, of: EVOLVE,
      to: [term(1, base(MAKES)), term(-1, base(KILLS)), term(-1, base(DEFLECTS)),
        term(1, base(SHINES)), term(-1, base(STREAM)), term(-1, base(TURNS))] },
    because: "AND THE RULES DO NOT INTERACT - each fires over its own matches once a tick, " +
      "and what they do to the density adds. So the whole theory is those terms on one line: " +
      "transport, the turn about its own field, what a neutral point makes, what a meeting " +
      "TAKES where the signs differ and what it TURNS where they agree, and what the turning " +
      "itself throws off. Six terms and not four: the first version of this line had the " +
      "killing without the deflecting and the bending without the shining, which is a vacuum " +
      "that cannot scatter and a field that is never acted back on",
    line: `${EVOLVE} + ${STREAM} + ${TURNS} = ${MAKES} - ${KILLS}`,
  },
  {
    fact: { kind: "equals" as const, of: OCCUPANCY,
      to: [term(1, base(MAKES)), term(-1, base(KILLS))] },
    because: "AND WHAT THE EQUATION IS FOR IS WHAT IT IMPLIES, not the assembling of it. " +
      "Left alone - no source, nothing streaming in or out, no field to turn about - the " +
      "transport and the turning both vanish and the line above collapses to what is MADE " +
      "against what is KILLED. Setting the rate to nought is then a statement about the " +
      "vacuum on its own: it settles where a neutral point's splitting exactly pays for what " +
      "the meetings take, nu(1-rho) = sigma·rho^{2}, and that is `vacuum.occupancy`'s own " +
      "fixed point reached from the continuum side rather than by enumerating the rule",
    line: `${MAKES} = ${KILLS} \\Rightarrow ${OCCUPANCY}`,
  },
];
