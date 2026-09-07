/**
 * WHAT A RULE HAS TO DO TO COUNT - the scorer, lifted out of the sweep that used to own it.
 *
 * NOTHING RUNS ON IMPORT. That is the whole reason this is its own file, and it is the same
 * reason `Catalogue.ts` is not an export from `PROVE.ts`: `CREATION.ts` is an entry point
 * with a top-level IIFE in it, so a second sweep that imported its scorer would run the
 * first sweep to get at it. Two sweeps that score differently are two stories; a second
 * copy of a hundred lines of banding is a second copy that goes stale. There is one
 * scorer, here, and both `CREATION.ts` and `BOUND.ts` read it.
 *
 * EVERY CRITERION IS A LINE IN `tests/ledger.ts` AND NONE OF THEM IS INVENTED HERE. What a
 * charge in the world does is that it is small, does not track mass, is not the magnetic
 * sign wearing a hat, and nets to nothing over everything; a body has an inside; and the
 * vacuum has to survive whatever bought those.
 */
import {
  massSpread, matterFraction, qIsP, qMassCorrelation, qMax, qNeutrality, Reading,
  surfaceExponent,
} from "../tests/ledger.ts";

/**
 * WHAT A RULE HAS TO DO TO COUNT — six criteria, every one of them a line in the ledger and
 * none of them invented here.
 *
 * `fires` IS FIRST AND IS NOT SCORED WITH THE REST. A rule that never makes a charge is not
 * a bad answer to "what makes charge", it is a non-answer, and averaging it in with the
 * others would let a rule that does nothing score well by doing nothing badly.
 */
export type Score = {
  /** it made charges at all — the gate */
  fires: boolean;
  made: number;
  /** and the five that are scored, each in [0,1] where 1 is matter's own answer */
  small: number;
  independent: number;
  distinct: number;
  neutral: number;
  compact: number;
  alive: number;
  /** how many of the four could be asked at all at this budget — see `scoreOf` */
  asked: number;
  /** raw, so a number can be checked rather than trusted */
  qMax: number;
  qCorr: number;
  qP: number;
  net: number;
  why: string;
  matter: number;
  surface: number;
  spread: number;
  structures: number;
  total: number;
};

/** a band read as a score: 1 where the ledger's target is met, falling off outside it */
export const band = (x: number, good: number, bad: number) => {
  if (!Number.isFinite(x)) return 0;
  const t = (Math.abs(x) - good) / (bad - good);
  return Math.max(0, Math.min(1, 1 - t));
};

export const scoreOf = (rs: Reading[]): Score => {
  const avg = (f: (r: Reading) => number) => {
    const xs = rs.map(f).filter(Number.isFinite);
    return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN;
  };
  const made = avg(r => r.qMade);
  const q = avg(qMax), qc = avg(qMassCorrelation), qp = avg(qIsP);
  const net = avg(qNeutrality), matter = avg(matterFraction);
  const surface = avg(surfaceExponent), spread = avg(massSpread);
  const structures = avg(r => r.structures.filter(s => s.mass >= 4).length);

  /* charge stays small (matter's answer is 1; the model's documented failure is 27) */
  /*
   * SCORED ONLY OVER WHAT RESOLVED — and this was got wrong the first time in a way that
   * quietly halved every score.
   *
   * `corr` needs three structures to mean anything and returns NaN below that. `band(NaN)`
   * is 0, so at a budget where only one or two structures form, TWO OF THE FOUR CRITERIA
   * SCORE ZERO FOR EVERY RULE ALIKE — not because the rules failed them but because the
   * question was never answerable. Measured: the whole first sweep ran with corr(q,m) and
   * corr(q,p) at "—" in every row, so every total was a half-mark out of four dressed up as
   * a full one, and the ranking was decided entirely by |q| and neutrality.
   *
   * A CRITERION THAT COULD NOT BE ASKED IS NOT A CRITERION THAT WAS FAILED.
   */
  const small = band(q, 3, 30);
  /* and does not track mass */
  const independent = band(qc, 0.2, 0.9);
  /* and is not the magnetic sign wearing a hat */
  const distinct = band(qp, 0.2, 0.9);
  /* and the world is neutral overall */
  const neutral = band(net, 0.05, 0.6);
  /*
   * AND THE VACUUM SURVIVED. Not a charge criterion — a veto. `G^XOR^c` measured a corner
   * rate that folded 10,375 points out of a world holding 5,864 and left an occupancy of
   * 0.056, which is a dead vacuum with one blob in it. A creation rule that makes charge
   * behave by making everything else stop is a rule that has answered a different question.
   */
  const alive = structures >= 2 && matter > 0.02 && matter < 0.95 ? 1 : 0;

  /*
   * AND WHY IT FAILED, IN A WORD — because a score of 0.000 says nothing about which of
   * five things went wrong, and five different failures reported as one number is a sweep
   * that cannot be learned from. Measured on the first run: `charge×charge → charge (anti)`
   * came back with |q| = 4 — the best charge bound anything in this project has produced —
   * and scored 0.000, and the reason was the veto rather than the charge. That is a rule
   * worth looking at and the bare total buried it.
   */
  /*
   * AND COMPACTNESS IS SCORED, because a rule that makes charge behave by turning matter
   * into filaments has not helped. The ledger wants surface ∝ mass^(2/3) — a body with an
   * inside — and that is a property the creation rule can wreck without touching charge.
   */
  const compact = band(Number.isFinite(surface) ? Math.abs(surface - 2 / 3) : NaN, 0.10, 0.45);

  const why = !Number.isFinite(q) ? "nothing to measure"
    : alive === 0
    ? (structures < 2 ? "no structures" : matter >= 0.95 ? "matter ate the box" : "no matter")
    : small < 0.5 ? "|q| too big"
    : compact < 0.5 ? "not a body"
    : independent < 0.5 ? "q tracks mass"
    : distinct < 0.5 ? "q IS the polarity"
    : neutral < 0.5 ? "not neutral"
    : "—";


  /*
   * A CRITERION EVERY CANDIDATE PASSES IS NOT A CRITERION. Under the corrected structure
   * reading, corr(q,mass), corr(q,polarity) and neutrality all sit near their targets for
   * every rule alike — they were doing real work when the baseline was broken and stopped
   * the moment it was fixed. Kept, because a rule that BREAKS one must still be caught,
   * and weighted low, because a criterion with no spread in it cannot rank anything.
   */
  const parts: [number, number][] = [
    [small, q], [small, q], [compact, surface],
    [independent, qc], [distinct, qp], [neutral, net],
  ];
  const asked = parts.filter(([, raw]) => Number.isFinite(raw));
  const total = asked.length
    ? alive * asked.reduce((a, [x]) => a + x, 0) / asked.length : NaN;

  return {
    fires: made > 0, made,
    small, independent, distinct, neutral, alive, why, compact,
    asked: asked.length,
    qMax: q, qCorr: qc, qP: qp, net, matter, surface, spread, structures,
    total,
  };
};

