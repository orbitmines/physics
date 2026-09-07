/**
 * WHAT TWO BIASED BODIES DO WHEN THEY MEET - and it is where Coulomb's sign law was
 * hiding all along.
 *
 * `share.coherence` asks the meeting rule what it does to a facing pair in each of the
 * states the pair can be in, and gets one half: two of the four states are opposite and
 * annihilate, two are alike and turn. That half is the same half that sits in the
 * gravitational constant, and until now it was a CONSTANT - a number about the rule,
 * settled once and carried everywhere.
 *
 * IT IS NOT A CONSTANT. It is one half because ORDINARY MATTER IS UNBIASED: the four
 * states are equally available only when each body is as likely to offer a + as a -.
 * Give a body a bias - let a fraction (1 + P)/2 of what it emits be positive - and the
 * four states stop being equally available, so the fraction of meetings that annihilate
 * moves. That fraction is what the article calls `share` and what the assembled force law
 * multiplies by, so MOVING IT MOVES THE FORCE.
 *
 * AND THE WAY IT MOVES IS THE SIGN LAW. Drawing one ray from each body,
 *
 *     opposed(P_a, P_b) = (1 + P_a)/2 · (1 - P_b)/2  +  (1 - P_a)/2 · (1 + P_b)/2
 *                       = (1 - P_a·P_b) / 2
 *
 * - a half when either body is unbiased, NOUGHT when the two biases agree, and ONE when
 * they oppose. Since the force is proportional to it, opposite biases pull twice as hard
 * as unbiased matter and alike biases do not pull at all. Opposites attract and sameness
 * repels, out of a rule that has never been told about charge.
 *
 * WHAT THIS PROBE ACTUALLY DOES, because the arithmetic above is not a measurement. It
 * does two things and reports both:
 *
 *   ENUMERATES. The theory's own facing-pair rule is applied to a real pair in each of
 *   the states it can be in, exactly as `meeting/what-the-halves-do` does, and what is
 *   recorded is WHICH states leave nothing. Nothing is assumed about which those are -
 *   a theory that annihilated the ALIKE pairs would give the sign law with its sign
 *   reversed, and this would report that.
 *
 *   THEN RUNS IT. At each of a grid of bias pairs, rays are drawn from the two biased
 *   populations with a seeded generator, handed to the rule, and the survivors counted.
 *   What is measured is the fraction that annihilated, and what is checked is that
 *   surface against the bilinear form above. The residual is the number this probe
 *   stands behind: if the rule did something the product law does not describe, the
 *   residual would say so and no fact would be emitted.
 *
 * A THEORY WHOSE RAYS CARRY NO SIGN HAS NOTHING TO BIAS, and this reports that rather
 * than reporting a law. Under `G` every meeting annihilates whatever anything is carrying,
 * so `opposed` is 1 at every bias, the surface is flat, and the correct answer is that
 * pure gravity has no sign law - which is also why it has one sign of force.
 */
import { GEOMETRIES } from "../../lib/Local.ts";
import { World } from "../../lib/Compat.ts";
import { mul, num, sub, sym } from "../Expr.ts";
import { rat } from "../Algebra.ts";
import { Lab, Probe, Probing, measure } from "../Probe.ts";
import { Emitted, Measured } from "../Kernel.ts";
import { facing, meetingRule } from "./meeting.ts";

/** how much of one body's emission is positive, as a signed fraction: (1 + P)/2 of it */
export const BIAS_A = "P_{a}";
export const BIAS_B = "P_{b}";
/** how much of the time a ray from one meets an opposite ray from the other */
export const OPPOSED = "opposed";

/** the biases the surface is worked out over - both ends, both middles, and nought */
const GRID = [-1, -0.6, -0.25, 0, 0.25, 0.6, 1];
/**
 * THE BIASES THE SPOT CHECK IS RUN AT, and why it is nine rather than forty-nine.
 *
 * A meeting is not cheap: the rule folds a point or inserts one, so a world is spent by
 * being used and the next meeting needs a fresh one. Measured, that is about four
 * milliseconds each, and a surface of forty-nine cells at four thousand draws apiece
 * would be twelve minutes of world-building for a probe that is asked sixteen times over
 * in a sweep.
 *
 * AND THE EXPENSIVE PART IS NOT THE PART IN DOUBT. What the theory has a say in is WHICH
 * PAIRS THE RULE DESTROYS, and that is settled exactly by four applications - the
 * enumeration below, which is complete and cannot be improved by sampling. What the
 * weighting adds is how often two independent draws come up opposite, and sampling that
 * at scale would be measuring a random number generator. So the surface is worked out
 * from the enumeration and the nine corners-and-middle are RUN, end to end, as the check
 * that the two agree.
 */
const CHECK = [-1, 0, 1];
/**
 * HOW MANY MEETINGS ARE ACTUALLY RUN AT EACH OF THOSE NINE - and it is not the same number
 * at each, because the nine are not equally uncertain.
 *
 * At P = +/-1 a body offers one sign and never the other, so the draw is not a draw: four
 * of the nine cells are settled by ONE meeting apiece and a second would be the same
 * meeting again. It is the cells with a nought in them where the two signs are actually
 * being drawn against each other, and those are the ones worth spending on. Spending the
 * same everywhere put the worst residual at two sampling errors, which is exactly what a
 * budget spread evenly over cells that did not need it buys.
 */
const DRAWS = 250;

/** a small deterministic generator, so the surface is the same surface every run */
const rng = (seed: number) => {
  let x = (seed | 0) || 1;
  return () => {
    x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
    return ((x >>> 0) % 1e6) / 1e6;
  };
};

export const bias: Probe = {
  id: "bias/what-two-biased-bodies-do",
  asks: "a body's emission need not be half positive. If a fraction (1 + P)/2 of it is, " +
    "how much of the time do two bodies' rays meet opposed - and what does that make of " +
    "the half sitting in the force law?",
  run: (lab: Lab): Probing => {
    const measured: Measured[] = [];
    const facts: Emitted[] = [];

    const found = meetingRule(lab.theory);
    if (!found) return {
      facts, measured, holds: false,
      found: `${lab.theory.name} has no rule between facing ends, so there is nothing a ` +
        `bias could change and this question has no answer here`,
    };
    const [name, rule] = found;

    if (!lab.theory.polarised) return {
      facts, measured, holds: false,
      found: `${lab.theory.name}'s rays carry no sign, so there is nothing to be biased ` +
        `about: every meeting is the same meeting whatever the two bodies are made of. ` +
        `That is why pure gravity has one sign of force and no sign law - the absence is ` +
        `the result, not a gap in the measurement`,
    };

    /* the smallest box that has an interior - the answer is about the rule, not the box */
    const g = GEOMETRIES["cubic-6"];

    /**
     * ONE MEETING, RUN THROUGH THE THEORY'S OWN RULE - and a fresh world for it, because
     * a pair cleared by the previous meeting is not a pair.
     */
    const meet = (a: number, b: number, seed: number): boolean | undefined => {
      const w = new World({ theory: lab.theory, geometry: g, N: 5, seed, boundary: "wrap" });
      const pair = facing(w);
      if (!pair) return undefined;
      const [x, y] = pair;
      for (const end of [x.source, y.source]) { end.active = true; end.polarity = undefined; }
      x.source.polarity = a;
      y.source.polarity = b;
      rule.exec(x, y);
      return !(x.source.active || y.source.active);       // nothing left: they annihilated
    };

    /*
     * FIRST THE ENUMERATION, which says WHICH pairs the rule destroys rather than
     * assuming it is the opposite ones. A theory that annihilated the alike pairs would
     * come through here with its own table and the sign law would come out reversed,
     * which is the right behaviour for a prover that is not allowed to know the answer.
     */
    const table: string[] = [];
    /** the sign pairs this rule was SEEN to destroy - the whole of what the theory says */
    const destroys: [number, number][] = [];
    let destroysOpposite = 0, destroysAlike = 0;
    for (const a of [-1, 1] as const) for (const b of [-1, 1] as const) {
      const gone = meet(a, b, 1);
      if (gone === undefined) continue;
      table.push(`${a > 0 ? "+" : "-"} with ${b > 0 ? "+" : "-"}: ` +
        (gone ? "nothing left" : "both still there"));
      if (!gone) continue;
      destroys.push([a, b]);
      if (a === b) destroysAlike++; else destroysOpposite++;
    }
    if (!table.length) return {
      facts, measured, holds: false,
      found: "no facing pair could be built to hand the rule, so it could not be asked",
    };

    measured.push(measure("destroyed opposite", destroysOpposite,
      `of the two states in which the pair carries opposite signs, ${name} left nothing ` +
      `in ${destroysOpposite}. Enumerated over a real facing pair, not assumed - ` +
      `${table.join("; ")}`));
    measured.push(measure("destroyed alike", destroysAlike,
      `and of the two in which it carries alike signs, ${destroysAlike}. It is the ` +
      `DIFFERENCE between these two counts that a bias can act on: a rule that treated ` +
      `alike and opposite the same would have no sign law however the bodies were made`));

    /*
     * THEN THE SURFACE, WORKED OUT FROM THE ENUMERATION - which is what a bias means.
     *
     * A body with bias P offers a + on a fraction (1 + P)/2 of its rays. Two bodies draw
     * independently, so the four states arrive with the four products of those fractions,
     * and how often the pair is one the rule destroys is the sum of the products over
     * exactly those states. NOTHING IS ASSUMED ABOUT WHICH STATES THOSE ARE: `destroys`
     * was filled in by applying the rule.
     */
    const weight = (sign: number, P: number) => (1 + sign * P) / 2;
    const worked = (Pa: number, Pb: number) => {
      let sum = 0;
      for (const [a, b] of destroys) sum += weight(a, Pa) * weight(b, Pb);
      return sum;
    };

    const rows: { a: number; b: number; got: number; want: number }[] = [];
    for (const Pa of GRID) for (const Pb of GRID)
      rows.push({ a: Pa, b: Pb, got: worked(Pa, Pb), want: (1 - Pa * Pb) / 2 });
    const worstForm = Math.max(...rows.map(r => Math.abs(r.got - r.want)));

    /*
     * AND THE SPOT CHECK, END TO END. At nine bias pairs the rays are DRAWN from the two
     * populations and handed to the rule for real - a fresh world each time, because a
     * meeting spends the one it happened in - and what is counted is how often nothing
     * was left. This is the line that would catch a rule whose verdict depended on
     * something other than the two signs.
     */
    const ran: { a: number; b: number; got: number; want: number; drew: number }[] = [];
    let seed = 7;
    for (const Pa of CHECK) for (const Pb of CHECK) {
      const r = rng((seed += 101));
      /* a body at P = +/-1 offers one sign and never the other, so there is nothing to
       * sample and one meeting settles the cell */
      const draws = Math.abs(Pa) === 1 && Math.abs(Pb) === 1 ? 1 : DRAWS;
      let gone = 0, n = 0;
      for (let i = 0; i < draws; i++) {
        const a = r() < (1 + Pa) / 2 ? 1 : -1;
        const b = r() < (1 + Pb) / 2 ? 1 : -1;
        /* the world's seed is the world's and not the draw's: what the vacuum around the
         * pair looks like must not be correlated with what the pair is carrying */
        const out = meet(a, b, 1 + (i % 5));
        if (out === undefined) continue;
        n++; if (out) gone++;
      }
      if (n) ran.push({ a: Pa, b: Pb, got: gone / n, want: (1 - Pa * Pb) / 2, drew: n });
    }

    const worstRun = ran.length
      ? Math.max(...ran.map(r => Math.abs(r.got - r.want))) : NaN;
    /* the sampling error on the cells that were sampled - the four that were not have
     * none, being one meeting with only one meeting to have */
    const noise = 0.5 / Math.sqrt(DRAWS);
    const total = ran.reduce((a, r) => a + r.drew, 0);
    const worst = Math.max(worstForm, 0);

    measured.push(measure("bias pairs worked out", rows.length,
      `${rows.length} pairs of biases from ${GRID[0]} to ${GRID[GRID.length - 1]}, ` +
      `weighted off the enumeration above - not fitted, and not sampled`));
    measured.push(measure("worst |worked out - (1 - P_a·P_b)/2|", worstForm,
      `over all ${rows.length} of them. This is exact arithmetic on the enumerated ` +
      `table, so anything other than nought here would mean the rule destroys a set of ` +
      `states that is not "the opposite ones" and the product law does not describe it`));
    measured.push(measure("meetings actually run", total,
      `over ${ran.length} bias pairs - ${DRAWS} at each of the ${ran.filter(r => r.drew > 1).length} ` +
      `where a sign is actually being drawn, and one at each of the ` +
      `${ran.filter(r => r.drew === 1).length} where a body offers one sign and never the ` +
      `other. Each in a world of its own, because a meeting folds or inserts a point and ` +
      `so spends the world it happened in`));
    measured.push(measure("worst |run - (1 - P_a·P_b)/2|", worstRun,
      `against a sampling error of ${noise.toFixed(4)} on one cell - 0.5/sqrt(${DRAWS})`));
    for (const r of ran)
      measured.push(measure(`opposed at P_a = ${r.a}, P_b = ${r.b}`, r.got,
        `${r.drew} meeting${r.drew === 1 ? "" : "s"} run, against ${r.want} - ` +
        (r.a * r.b === 0 ? "a bias does nothing to something with no bias of its own, " +
          "which is why a charged thing falls like an uncharged one"
          : r.a === r.b ? "alike biases never meet opposed, so nothing annihilates and " +
            "there is no pull at all"
          : "opposite biases ALWAYS meet opposed, so every meeting annihilates and the " +
            "pull is twice what unbiased matter has")));

    if (!(worstForm <= 1e-12) || !(worstRun <= Math.max(3 * noise, 0.02))) return {
      facts, measured, holds: false,
      found: `${name} does not follow the product law: the worked-out surface departs ` +
        `from (1 - P_a·P_b)/2 by ${worstForm.toFixed(6)} and the meetings actually run ` +
        `by ${worstRun.toFixed(4)} against a sampling error of ${noise.toFixed(4)}. So ` +
        `how often two bodies meet opposed is not a function of the two biases ` +
        `multiplied together, and no sign law follows from this rule`,
    };

    facts.push({
      fact: {
        kind: "equals", of: OPPOSED,
        /* (1 - P_a·P_b)/2, written as the algebra carries it */
        to: mul(num(rat(1, 2)), sub(num(1), mul(sym(BIAS_A), sym(BIAS_B)))),
      },
      from: [],
      measured: [measured[2], measured[3], measured[4], measured[5]],
      because: `${name} leaves nothing exactly when the pair is opposite - enumerated ` +
        `over a real facing pair, ${table.join("; ")} - so how often two bodies meet ` +
        `opposed is how often one offers a + while the other offers a -, either way ` +
        `round. At biases P_a and P_b that is (1+P_a)(1-P_b)/4 + (1-P_a)(1+P_b)/4, which ` +
        `multiplies out to (1 - P_a·P_b)/2 - exactly, over all ${rows.length} bias ` +
        `pairs, to ${worstForm.toFixed(6)}. And the ${total} meetings ` +
        `actually run at the corners and the middle agree with it to ` +
        `${worstRun.toFixed(4)} against a sampling error of ${noise.toFixed(4)}. NOTE ` +
        `WHAT IS NOT ASSUMED: not that the rule destroys the opposite pairs, which was ` +
        `enumerated; and not that the two draws are independent, which is what drawing ` +
        `them from two bodies makes true`,
      line: `${OPPOSED} = \\frac{1 - ${BIAS_A}·${BIAS_B}}{2}`,
    });

    return {
      facts, measured, holds: true,
      found: `${name} annihilates a pair exactly when the two are opposite - enumerated, ` +
        `not assumed - so how much of the time two bodies meet opposed is ` +
        `(1 - P_a·P_b)/2, exact over ${rows.length} bias pairs and confirmed to ` +
        `${worstRun.toFixed(4)} by ${total} meetings run end to end. ` +
        `Unbiased against anything is a half, which is the half the force law already ` +
        `carries; alike biases give nought and opposite biases give one`,
    };
  },
};
