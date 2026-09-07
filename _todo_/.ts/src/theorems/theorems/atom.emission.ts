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
  AZIM_NODES, POLAR_NODES, RADIAL_NODES, RETARD, RNL, SEPARABLE, SIGMA_NLM, STATE_TERMS,
  YLM, emission,
} from "../probes/emission.ts";
import { MODEL, NOT_A_RULE, SOURCE, TERMS, terms } from "../probes/terms.ts";

export { RETARD, RNL, SIGMA_NLM, YLM };

export const emissionTheorem: Theorem = {
  id: "atom.emission",
  asks: "the vacuum equation has one term that is not a rule. Write a hydrogen state into it " +
    "and nothing else - how much of the equation has to change, and what do n, l and m turn " +
    "out to be counts of?",
  about: SIGMA_NLM,
  probes: [emission, terms],
  uses: ["vacuum.equation", "vacuum.rates"],
  wants: [
    { kind: "value", of: STATE_TERMS, equals: { n: 1, d: 1 } },
    { kind: "value", of: RADIAL_NODES, equals: { n: 1, d: 1 } },
    { kind: "product", of: SIGMA_NLM, from: [YLM, RNL] },
    { kind: "term", of: SIGMA_NLM, in: SOURCE },
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
    [SEPARABLE]: { symbol: "\\Sigma/(\\Sigma_{\\theta}\\Sigma_{t})", says: "the joint firing chance against the product of its own margins - one is what two draws that do not consult each other come to, and it is what makes the product a derivation rather than a definition" },
    /* set as its own name: the page replaces the longest name first and skips a name it is
     * set as, so anything else here would reach inside `\\Sigma_{nlm}` and rewrite its stem */
    [SOURCE]: { symbol: "\\Sigma", says: "the term of `vacuum.equation` that no rewrite puts there, which is why it is the only place a state can be written" },
    [MODEL]: { symbol: "(\\partial_{t}+\\hat{d}·\\nabla_{x})n_{b}", says: "the whole model, whose terms are counted so that the one this theorem writes into can be found rather than pointed at" },
    [TERMS]: { symbol: "T_{model}", says: "how many terms the model has, walked off the solver's own rule set" },
    [NOT_A_RULE]: { symbol: "T_{outside}", says: "and how many of them no rewrite produces. One - and that one is this theorem's subject" },
  },
};

/**
 * AND THERE ARE NO DEFINITIONS HERE ANY MORE.
 *
 * There were four, and two of them were the same facts the probe was already measuring, so
 * they never entered a store at all - a premise is added before a definition and takes the
 * slot. The other two were doing real work under a label that said they were not:
 *
 *   THE PRODUCT was `Sigma = rate·1_{|x|<a}·|Y_lm|^{2}·|R_nl|`, typed out. It is not a matter
 *   of what a word means: `lib/Vacuum.ts` fires a ray only if it passes the angular draw and
 *   then the radial one, and whether two draws that never consult each other come out
 *   independent is a question about that code. `emission` now runs the same two gates over a
 *   grid of directions and ticks and measures the joint against the product of its margins.
 *
 *   AND `Sigma_nlm IS IMPOSED` was the honest half asserted. It follows instead: the state is
 *   a term of Sigma, Sigma is the term of the model that `terms` finds no rewrite behind, and
 *   `the term no rule puts there` carries the one down into the other. Which is better than
 *   asserting it, because a model that grew a second unruled term would say so.
 *
 * What is NOT derived, and cannot be, is the shape: the angular pattern is typed into
 * `source.pattern` and the radial one into `source.schedule`, and every claim about what the
 * vacuum did with them is a difference from the ballistic twin. That is in the header, where
 * it belongs, rather than dressed as a step.
 */
export const definitions: never[] = [];
