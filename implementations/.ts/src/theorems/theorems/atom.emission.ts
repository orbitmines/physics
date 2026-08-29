/**
 * HYDROGEN AS A SOURCE TERM, AND THE HONEST ACCOUNT OF WHICH HALF OF THAT IS AN ANSWER.
 *
 * `vacuum.equation` is the whole model on one line and exactly one thing in it is not a rule:
 * Sigma, what is put into the box from outside. This theorem writes a hydrogen state as a Sigma
 * and changes NOTHING ELSE - and the reason it is worth stating as a theorem is that the
 * separation can then be checked instead of asserted, which is what the probe does.
 *
 *     Sigma_{nlm}(x, d^, t) = rate · 1_{|x| < a} · |Y_lm(d^)|^2 · |R_nl(t)| ,
 *     and the emitted polarity carries sign R_nl(t)
 *
 * WHERE THE THREE NUMBERS GO, AND EACH OF THEM IS A COUNT OF SOMETHING:
 *
 *   m   the fold round the azimuth. |Y_lm|^2 goes as cos^2(m phi), which vanishes 2|m| times.
 *   l   the lobes up the axis - l - |m| zeros in the polar angle, on top of that fold.
 *   n   THE NODES IN SPACE, and it gets there by retarded time rather than by geometry.
 *       Everything moves at one cell a tick, so what stands at radius r was emitted r ago and
 *       radius IS the schedule's argument. R_nl has n - l - 1 zeros, the source flips the
 *       polarity it emits at each, and the shells that result stand where the zeros were.
 *
 * Counted off the actual Laguerre and Legendre rather than asserted: 7 of 7 states give exactly
 * n - l - 1, l - |m| and 2|m|, and ONE term of the equation depends on which state is running.
 *
 * AND NOW WHAT IS NOT CLAIMED, WHICH IS THE LARGER HALF.
 *
 * This does not derive hydrogen. The angular shape is typed into `pattern` and the radial one
 * into `schedule`; the vacuum is handed |Y_lm|^2 and the honest question is only what it does
 * with it, which is why every run has a BALLISTIC TWIN - the same Sigma fired into sigma = tau =
 * nu = stir = 0 - and why the pictures are the difference. Against that control the vacuum
 * DOES do things: the 4d polarity changes sign where its 3d twin does not, at the same angular
 * shape; the outer lobe moves out as the vacuum thins, 1.9 to 2.9 as nu goes 0.3 to 0.03; the
 * response carries 74 to 97 per cent of the ideal harmonics where the best lattice carries 1 at
 * l = 2. What it does NOT do is produce the shape without being given it.
 *
 * AND THE ONE PLACE THE VACUUM IS UNMISTAKABLY DOING THE WORK IS THE 3d/4d GAP, WHICH WAS
 * EXPLAINED WRONGLY UNTIL IT WAS MEASURED. 3d's field is some 280 times 4d's, and the account
 * given for that was the gating - |R_42| smaller than |R_32|, so 4d emits less. It does not.
 * Gated as the run gates, the two differ by 1.54 over a period, and the two BALLISTIC twins -
 * the same sources fired into sigma = tau = nu = stir = 0 - differ by 1.08. The sources put out
 * the same amount. What differs is the RESPONSE: 3d's field stands at 481 times its own
 * ballistic twin and 4d's at 1.85 times its own.
 *
 * That is a factor of 260 of pure vacuum, at identical angular emission, and the only thing
 * separating the two sources is that R_42 CHANGES SIGN and R_32 does not - so 3d emits one
 * polarity throughout and 4d emits both. A single-polarity source drives the making and the
 * killing out of balance in one direction and the vacuum piles up around it; a source that
 * alternates hands the vacuum its own annihilation partner. THAT IS A HYPOTHESIS AND NOT A
 * RESULT: the test is a state with 3d's schedule and its sign forced to alternate, which
 * separates the sign from everything else, and it has not been run.
 *
 * `vacuum.rates` says why the ANGULAR side is not a tuning problem. Both rates come out at 1 per
 * tick from the rules themselves, so the mean free path is of order the cell and the medium is
 * nearly ballistic - a vacuum that transparent carries the angle it is handed and organises
 * little of it. The one place a shape was made rather than carried is `spin: "circulating"`,
 * where the emission has no angular preference at all and B is built by the body's own
 * circulation; that is the version worth pursuing and it is not what these states are.
 *
 * SO THIS THEOREM'S CONTENT IS THE SEPARATION AND NOT THE ATOM: the rules are the same
 * arithmetic for 1s and for 4f, every hydrogen equation in the model is inside Sigma, and any
 * claim that the vacuum produced an orbital has to be a statement about the difference from the
 * ballistic control. The previous `atom.hydrogen` and `gravity.hydrogen` were removed because
 * they read a Bohr ladder off a balance and called it an atom without ever running anything.
 */
import { Theorem } from "../Theorem.ts";
import {
  AZIM_NODES, POLAR_NODES, RADIAL_NODES, SIGMA_NLM, STATE_TERMS, emission,
} from "../probes/emission.ts";

export { SIGMA_NLM };
/** the radial wavefunction, whose SIGN the source emits and whose zeros are the shells */
export const RNL = "R_{nl}";
/** and the angular one, used as a firing probability */
export const YLM = "|Y_{lm}|^{2}";
/** radius is retarded time: what stands at r was emitted r ago */
export const RETARD = "r = c\\,t";

export const emissionTheorem: Theorem = {
  id: "atom.emission",
  asks: "the vacuum equation has one term that is not a rule. Write a hydrogen state into it " +
    "and nothing else - how much of the equation has to change, and what do n, l and m turn " +
    "out to be counts of?",
  about: SIGMA_NLM,
  probes: [emission],
  uses: ["vacuum.equation", "vacuum.rates"],
  wants: [
    { kind: "value", of: STATE_TERMS, equals: { n: 1, d: 1 } },
    { kind: "value", of: RADIAL_NODES, equals: { n: 1, d: 1 } },
    { kind: "positive", of: SIGMA_NLM },
  ],
  glossary: {
    [SIGMA_NLM]: { symbol: "\\Sigma_{nlm}", says: "the source term of `vacuum.equation` written for one state - the only term in the whole model that knows what hydrogen is" },
    [YLM]: { symbol: "|Y_{lm}(\\hat{d})|^{2}", says: "used as a FIRING PROBABILITY: the source draws a direction and fires with that chance, so what goes out has the harmonic's own angular profile rather than a spike where its maximum is" },
    [RNL]: { symbol: "R_{nl}(t)", says: "the radial wavefunction read as a schedule - its magnitude scales the rate and its SIGN is the polarity emitted, which is what a node is" },
    [RETARD]: { symbol: "r = c\\,t", says: "everything moves at one cell a tick, so what stands at radius r was emitted r ticks ago - which is how a schedule in time becomes a structure in space" },
    [RADIAL_NODES]: { symbol: "\\nu_{r}", says: "how many times the schedule changes sign in a period: n - l - 1, counted off the Laguerre" },
    [POLAR_NODES]: { symbol: "\\nu_{\\theta}", says: "l - |m|, the lobes up the axis" },
    [AZIM_NODES]: { symbol: "\\nu_{\\phi}", says: "2|m|, the fold round the azimuth" },
    [STATE_TERMS]: { symbol: "T_{state}", says: "how many terms of the equation depend on which state is being run. It is one, and that is the theorem" },
  },
};

export const definitions = [
  {
    fact: { kind: "value" as const, of: STATE_TERMS, equals: { n: 1, d: 1 } },
    because: "ONE TERM, AND THAT IS THE WHOLE CLAIM. n, l and m reach the model through " +
      "`source.pattern` and `source.schedule` and through nothing else - sigma, tau, nu, stir, " +
      "shine, makes and THETA are the same numbers for 1s and for 4f, and `tick` is the same " +
      "arithmetic in both. So a hydrogen state is a Sigma. This is worth a theorem only because " +
      "it is the thing that would be easiest to get wrong quietly: a rate tuned per state, a " +
      "turn angle chosen to suit a lobe, and the answer would be the input with extra steps",
    line: `${SIGMA_NLM} \\text{ is the only state-dependent term}`,
  },
  {
    fact: { kind: "value" as const, of: RADIAL_NODES, equals: { n: 1, d: 1 } },
    because: "AND n IS A COUNT OF SIGN CHANGES, TURNED INTO A COUNT OF SHELLS BY RETARDED TIME. " +
      "Everything moves at one cell a tick, so what stands at radius r was emitted r ticks ago " +
      "and the schedule's argument IS the radius. R_nl has n - l - 1 zeros on the half line; " +
      "the source flips the polarity it emits at each of them; the shells stand where the zeros " +
      "were. Counted off the actual associated Laguerre for seven states, every one gives " +
      "exactly n - l - 1. THE MAGNITUDE ALSO SCALES THE RATE, but by far less than it looks: " +
      "gated as the run gates, 3d emits 1.54 times what 4d does over a period and their " +
      "ballistic twins differ by 1.08, against 280 in the fields themselves. The sources put " +
      "out the same amount and the gap is the vacuum's",
    line: `${RADIAL_NODES} = n - l - 1,\\quad ${RETARD}`,
  },
  {
    fact: { kind: "product" as const, of: SIGMA_NLM, from: [YLM, RNL] },
    because: "AND l AND m ARE COUNTS ON THE SPHERE, used as a probability rather than as an " +
      "amplitude. |Y_lm|^2 vanishes l - |m| times in the polar angle and 2|m| times round the " +
      "azimuth, and the source draws a direction and fires with that chance - so the emission " +
      "has the harmonic's own smooth profile. THE EARLIER VERSION GATED ON A NARROW WINDOW " +
      "instead and what came out was four thin spokes, which is what a beam looks like and not " +
      "what a lobe looks like. The narrowness was the gate's, not the vacuum's",
    line: `${SIGMA_NLM} = \\text{rate}·1_{|x|<a}·${YLM}·|${RNL}|`,
  },
  {
    fact: { kind: "constant" as const, of: SIGMA_NLM },
    because: "AND WHAT IS NOT ESTABLISHED, STATED WHERE THE NUMBERS ARE. This does not derive " +
      "hydrogen: the angular shape is typed into the pattern and the radial one into the " +
      "schedule. Every run therefore has a BALLISTIC TWIN - the same Sigma fired into " +
      "sigma = tau = nu = stir = 0 - and only the difference from it is the vacuum's. Against " +
      "that control the vacuum does do things: 4d's polarity changes sign where its 3d twin " +
      "does not at the same angular shape, and the outer lobe moves from 1.9 to 2.9 as nu goes " +
      "0.3 to 0.03. What it does not do is make the shape without being handed it - and " +
      "`vacuum.rates` says why that is not a tuning problem, since both rates come out at 1 per " +
      "tick from the rules and a medium that transparent carries what it is given. The one " +
      "setup that makes a shape rather than carrying one is `spin: \"circulating\"`, where the " +
      "emission has no angular preference at all",
    line: `${SIGMA_NLM} \\text{ is imposed; the response is measured against a ballistic twin}`,
  },
];
