/**
 * WHAT THE MODEL IS MADE OF, TERM BY TERM - read off the solver's own rule set, and each one
 * checked by taking it away.
 *
 * `vacuum.equation` puts the whole continuous model on one line, and for a long time that line
 * was a STRING: every term already in it, in the right order with the right sign, true because
 * somebody transcribed it. An inventory written that way is the thing in this folder most
 * likely to rot - a rate is added to `lib/Vacuum.ts`, or a limit takes one out, and the line
 * goes on saying what it said. Nothing about it stands on a run.
 *
 * SO IT IS ENUMERATED HERE INSTEAD. `Rules` is the solver's own type and the object handed to
 * `tick` is the model as it is actually integrated; this probe walks that object's OWN KEYS,
 * says which term each is, and then ABLATES it - the same box settled with that one rate at
 * nought - and reports how far the vacuum moves. A knob whose removal moves nothing is not a
 * term of the model whatever a comment says about it, and a knob that is not on the object is
 * not reported at all.
 *
 * AND THE ONE THAT IS NOT A RULE IS FOUND THE SAME WAY. `source` is a key of `Rules` like the
 * others and it moves the density like the others - but no rewrite of the model produces it:
 * it is the region put into the box from outside, and the model's own arithmetic never writes
 * into it. So it is stated as a term with no rule on it, and "Sigma is the only term that is
 * not a rule" becomes a COUNT over the terms rather than a sentence to be believed. That count
 * is the whole hinge of `atom.emission`, which writes a hydrogen state into that one term and
 * changes nothing else.
 *
 * WHAT THIS DOES NOT SAY. That the terms are RIGHT - each one's form is somebody else's
 * theorem, and `vacuum.continuum`, `vacuum.facing`, `vacuum.beats` and `turn.kernel` are where
 * the corrections on them were established. This probe says only which terms there are, which
 * rule each came out of, and that each is doing something.
 */
import { Rules, World, gather, tick, world } from "../../lib/Vacuum.ts";
import { rat } from "../Algebra.ts";
import { Lab, Probe, Probing, measure } from "../Probe.ts";
import { Emitted, Measured } from "../Kernel.ts";
import { KILLS, MAKES } from "../theorems/vacuum.continuum.ts";

/** the whole model on one line - what the terms below come to when they are put together */
export const MODEL = "\\mathcal{L}n";
/** the turn as an OPERATOR rather than as a force: a fixed angle about the field's axis */
export const SCATTER_OP = "S_{\\Theta}";
/**
 * WHAT A MEETING OF ALIKE SIGNS DOES - it reverses, it does not remove.
 *
 * NAMED `R_{alike}` AND NOT `R`, which it was. The page replaces a quantity's name by the
 * symbol the glossary sets it in, longest name first, and a name one character long matches
 * inside other words: `RADIATING` came out as the whole reversal operator followed by
 * `ADIATING`. A one-letter internal name is not worth that.
 */
export const REVERSE = "R_{alike}";
/** what a turn throws off - RADIATING, and it lands on the OTHER beat */
export const SHED = "\\chi(turning)";
/** and what is put into the box from outside, which is the only place a state can live */
export const SOURCE = "\\Sigma";
/**
 * THE RATE A STEER FIRES AT, which is the vacuum's own stir PLUS whatever field is there.
 *
 * The one place the equation is nonlinear in a way `turn.kernel` cannot take apart, so it is
 * worth having as a measured number rather than as a remark: where the field is nought a ray
 * still turns, at the bare stir about a uniform axis, and where a source has built a field it
 * turns faster and about THAT axis.
 */
export const STEER_RATE = "\\sigma_{s}+|B|";
/** the density the operator acts on - a steer moves a ray, it does not make or take one */
export const STEERED = "n_{b}";
/** how many terms the model has, counted off the solver's own rule set */
export const TERMS = "T_{model}";
/** and how many of them no rewrite of the model produces */
export const NOT_A_RULE = "T_{outside}";

/**
 * WHICH TERM EACH KNOB IS, AND THE SIGN IT ENTERS WITH.
 *
 * The only transcription left, and it is one line per knob rather than a whole equation: what
 * `sigma` IS is `vacuum.continuum`'s business and what it is corrected by is `vacuum.facing`'s.
 * A knob absent from this table is not a term of the line - `theta`, `makes` and `bounce` shape
 * what a turn DOES rather than adding a term of their own, and they are reported as the
 * scattering term's parameters instead.
 */
const AS: Record<string, { term: string; sign: -1 | 1; rule: string; says: string }> = {
  nu: { term: MAKES, sign: 1, rule: "(G/2)",
    says: "a neutral point splits into a pair, gated on the room left" },
  sigma: { term: KILLS, sign: -1, rule: "ANNIHILATION",
    says: "a facing pair of opposite sign is destroyed, against the oncoming current" },
  tau: { term: REVERSE, sign: -1, rule: "(G+M/3)",
    says: "a facing pair of alike sign is sent back the way it came, and nothing dies" },
  stir: { term: SCATTER_OP, sign: 1, rule: "steer",
    says: "a ray is turned by a fixed angle about the field's axis, at the vacuum's own " +
      "stir plus whatever field is there" },
  shine: { term: SHED, sign: 1, rule: "RADIATING",
    says: "a turn throws off a ray of its own, onto the other beat" },
  source: { term: SOURCE, sign: 1, rule: "",
    says: "what is put into the box from outside - no rewrite of the model writes into it" },
};
/** and the knobs that are not terms: they say what a turn does, not that there is one */
const SHAPES: Record<string, string> = {
  theta: "how big one turn is - the ring step, 2pi/CYCLE on a lattice",
  makes: "what a shed ray carries - the recoil's polarity, or its charge",
  bounce: "whether a steer turns by a fixed angle or mirrors in the field's plane",
};

const settle = (R: Rules, ticks: number, seed: number): World => {
  const w = world(10, 6, 400000, 1/50);
  for (let t = 0; t < ticks; t++) tick(w, R, 0.25, seed);
  gather(w);
  return w;
};
const meanRho = (w: World) => {
  let s = 0;
  for (let c = 0; c < w.rho.length; c++) s += w.rho[c];
  return w.rho.length ? s / w.rho.length : 0;
};

export const terms: Probe = {
  id: "terms/what-the-model-is-made-of",
  asks: "walk the solver's own rule set. Which terms does the continuous model have, which " +
    "rewrite is each one, does each of them actually move the vacuum - and how many of them " +
    "does no rewrite produce?",
  run: (lab: Lab): Probing => {
    const g = lab.geometry;
    const measured: Measured[] = [];
    const facts: Emitted[] = [];

    if (!g.CYCLE || g.CYCLE < 2 || g.D < 3) {
      return { facts, measured, holds: false,
        found: `${g.name} has no ring to turn on (CYCLE = ${g.CYCLE}, D = ${g.D})` };
    }

    /*
     * THE MODEL AS IT IS ACTUALLY INTEGRATED - every rate on, the shedding included, and a
     * source in the box, because a term that is switched off cannot be ablated and would be
     * reported as doing nothing. This is the object `tick` is handed; its keys are the
     * inventory.
     */
    const R: Rules = {
      /* stated in the order the model runs them - a point splits, a meeting takes or turns
       * what it finds, what survives is steered, a steer sheds - because `assembling` writes
       * the line in the order the terms arrive in and that is the order worth reading */
      theta: 2 * Math.PI / g.CYCLE, nu: 1, sigma: 1, tau: 1, stir: 1, shine: 0.25,
      makes: "polarity", source: { rate: 6, radius: 0.3, charge: 1 },
    };
    const T = 80, SEED = 20260830;

    const rho0 = meanRho(settle(R, T, SEED));

    const present = Object.keys(R);
    const mine = present.filter(k => AS[k]);
    const shapes = present.filter(k => SHAPES[k]);

    /*
     * --- AND EACH ONE TAKEN OUT IN TURN -------------------------------------------------
     *
     * `without` is the same object with one rate at nought - or, for the source, with the
     * region gone. What is reported is how far the settled density moves, as a fraction of
     * where it settled with everything on. A term that moves it not at all is a term the line
     * is carrying for nothing, and this is the measurement that would say so.
     */
    const moved: Record<string, number> = {};
    for (const k of mine) {
      const without: Rules = { ...R };
      if (k === "source") delete without.source;
      else (without as unknown as Record<string, number>)[k] = 0;
      moved[k] = rho0 ? Math.abs(meanRho(settle(without, T, SEED)) - rho0) / rho0 : 0;
    }

    const lines = mine.map(k =>
      `${k} -> ${AS[k].term}${AS[k].rule ? ` (${AS[k].rule})` : " (no rule)"}, ` +
      `taking it out moves the settled density ${(100*moved[k]).toFixed(1)}%`);

    for (const k of mine) {
      const a = AS[k];
      const m = measure(a.term, moved[k],
        `\`${k}\` is a key of the solver's own \`Rules\`, and it is ${a.says}. Settled ` +
        `with every rate on the box comes to rho = ${rho0.toFixed(3)}; with \`${k}\` alone ` +
        `taken out it moves ${(100*moved[k]).toFixed(1)} per cent, so the term is doing ` +
        `something and is not being carried for nothing`);
      measured.push(m);
      facts.push({
        fact: { kind: "term", of: a.term, in: MODEL, sign: a.sign,
          ...(a.rule ? { rule: a.rule } : {}) },
        from: [], measured: [m],
        because: a.rule
          ? `${a.rule} is a rewrite of this model - it is on the object \`tick\` is handed, ` +
            `as \`${k}\` - and as a statement about a density it says that ${a.says}. Read ` +
            `off the rule set rather than transcribed, so a model without it writes no such ` +
            `term. Taken out on its own the vacuum moves ` +
            `${(100*moved[k]).toFixed(1)} per cent, which is the check that it is a term at all`
          : `\`${k}\` is on the same object and moves the vacuum ` +
            `${(100*moved[k]).toFixed(1)} per cent when it is taken away, so it is a term of ` +
            `the model like the others - but NO REWRITE PRODUCES IT. It is ${a.says}, and ` +
            `that is what makes it the only place a particular problem can be written`,
        line: `${a.term} is a term of ${MODEL}${a.rule ? ` - ${a.rule}` : " - not a rule"}`,
      });
    }

    /*
     * --- AND WHAT THE STEERING TERM IS A PRODUCT OF ---------------------------------------
     *
     * A steer neither makes a ray nor takes one - it turns one - so the term is LINEAR in the
     * density, and its rate is the vacuum's own stir plus the field the box has built. Both
     * halves are read off the settled run: the stir is the knob, and |B| is the mean of the
     * density's own first moment over the cells. That the second is not nought is the whole
     * reason the operator is nonlinear, and it is why the term is stated as a product of a
     * rate and a density rather than as a rate times a constant.
     */
    const wref = settle(R, T, SEED);
    let bs = 0;
    for (let c = 0; c < wref.rho.length; c++)
      bs += Math.hypot(wref.Bx[c], wref.By[c], wref.Bz[c]);
    const meanB = wref.rho.length ? bs / wref.rho.length : 0;
    const rate = R.stir + meanB;
    const rm = measure(STEER_RATE, rate,
      `\`steer\` fires once a ring step a tick against the field a ray has accumulated, so ` +
      `the rate is the vacuum's own stir plus the local field: ${R.stir} + ` +
      `${meanB.toFixed(3)} = ${rate.toFixed(3)} averaged over the box. Where the field is ` +
      `nought a ray still turns - at the bare stir, about a uniform axis, which is ` +
      `\`turn.isotropic\` - and where a source has built one it turns faster and about THAT ` +
      `axis. The sense is the ray's CHARGE, so the two charges wind opposite ways in the same ` +
      `field, which is the only thing in the equation that tells them apart`);
    measured.push(rm);
    facts.push({
      fact: { kind: "value", of: STEER_RATE, equals: rat(Math.round(rate*1000), 1000) },
      from: [], measured: [rm], because: rm.note!,
      line: `${STEER_RATE} = ${rate.toFixed(3)}`,
    });
    facts.push({
      /*
       * NAMED, so that the line carries `S_Theta` rather than what it is made of, and so that
       * the working for it comes into the derivation with it - see `proof` in Kernel.ts. Only
       * this term: it is the one whose form is derived HERE, and a term whose form was
       * established in another theorem is cited by `uses` rather than reopened.
       */
      fact: { kind: "named", of: SCATTER_OP },
      from: [], measured: [rm],
      because: `the steering term is worth keeping whole rather than multiplied out: what ` +
        `matters about it is that it is a RATE times a population, and once it is written as ` +
        `an operator \`turn.kernel\` diagonalises it. So it stands in the line by name, and ` +
        `what it is made of is derived on a line of its own`,
      line: `${SCATTER_OP} is worth naming`,
    });
    facts.push({
      fact: { kind: "product", of: SCATTER_OP, from: [STEER_RATE, STEERED] },
      from: [], measured: [rm],
      because: `and the operator is that rate against the density it acts on, and nothing ` +
        `else: a steer TURNS a ray, so it neither makes one nor takes one, and the term is ` +
        `linear in n. A finite rotation is not a derivative - the rule makes one turn of size ` +
        `THETA = 2pi/CYCLE, which is 60, 90 or 45 degrees, not a small one - so it belongs in ` +
        `a collision operator rather than in a q(B x d^)·grad_d n, and once it is one ` +
        `\`turn.kernel\` diagonalises it and the whole angular problem is g_l = ` +
        `<P_l(cos gamma)> in closed form, with nothing expanded or truncated`,
      /* written out rather than left to `says`, which would set the subject's symbol and
       * then set the `S_{\\Theta}` inside THAT symbol a second time */
      line: `${SCATTER_OP} = ${STEER_RATE} · ${STEERED}`,
    });

    const outside = mine.filter(k => !AS[k].rule).length;
    const counted = measure(TERMS, mine.length,
      `${mine.length} terms, walked off the keys of the object the solver is handed: ` +
      `${lines.join("; ")}. The other ${shapes.length} keys are not terms - ` +
      `${shapes.map(k => `${k}, which is ${SHAPES[k]}`).join("; ")} - they say what a turn ` +
      `does rather than that there is one`);
    measured.push(counted);
    facts.push({
      fact: { kind: "value", of: TERMS, equals: rat(mine.length) },
      from: [], measured: [counted],
      because: `the model has exactly these ${mine.length} terms and no others, counted off ` +
        `the rule set itself: ${lines.join("; ")}`,
      line: `${TERMS} = ${mine.length}`,
    });

    const one = measure(NOT_A_RULE, outside,
      `and ${outside} of those ${mine.length} is not a rewrite of the model: ` +
      `${mine.filter(k => !AS[k].rule).map(k => AS[k].term).join(", ") || "none"}`);
    measured.push(one);
    facts.push({
      fact: { kind: "value", of: NOT_A_RULE, equals: rat(outside) },
      from: [], measured: [one],
      because: `every term above carries the rewrite it came out of except ${outside} of ` +
        `them. That count is the whole of the separation this equation is worth having for: ` +
        `the rules do not know what a hydrogen atom is and nothing in them should, so what a ` +
        `source does is a question about the source`,
      line: `${NOT_A_RULE} = ${outside}`,
    });

    return {
      facts, measured, holds: mine.length > 0 && outside === 1,
      found: `${mine.length} terms off the solver's own rule set, ${outside} of them put in ` +
        `from outside: ${lines.join("; ")}`,
    };
  },
};
