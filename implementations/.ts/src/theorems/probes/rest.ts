/**
 * WHAT A THING AT REST IS STILL DOING - and the second split, which is not the same KIND
 * of split as the first.
 *
 * `budget/what-a-tick-is-spent-on` takes a ray's step, which is one vector of fixed
 * length, and resolves it along the structure's motion and across it. Those are ORTHOGONAL
 * COMPONENTS OF ONE VECTOR, so they add in quadrature and the crossing part comes out at
 * sqrt(1 - b^2). That is the Lorentz factor and it is derived rather than assumed.
 *
 * IT LEAVES THE WHOLE OF THE CROSSING PART UNACCOUNTED FOR. Set b to nought - a thing at
 * rest - and every bit of the step is across, and the argument stops there with the clock
 * running at 1. Read as a statement about MASS that says a thing at rest is maximally
 * heavy, WHICH IS FALSE OF MATTER: a proton and an electron can both be at rest and one
 * of them is eighteen hundred times the other. So the crossing part is not mass. It is
 * everything a structure does that is not going anywhere, and mass is one of the things
 * in it.
 *
 * WHAT ELSE IS IN IT IS HOLDING THE STRUCTURE TOGETHER. A ray bent inside matter is
 * turning round because the geometry it is in turns it round, and the space it unmakes
 * there is what binds the thing rather than what weighs it. So:
 *
 *     |step|^2  =  |along|^2  +  |across|^2          orthogonal - QUADRATURE
 *     |across|^2  =  free  +  bound                  disjoint   - LINEAR
 *
 * AND THE SECOND LINE IS LINEAR, WHICH IS THE ONE THING THIS PROBE EXISTS TO GET RIGHT.
 * The temptation is to write it in quadrature too, because the line above it is, and that
 * would be wrong for a reason this project has already been burned by once: `budget`'s own
 * header records a first reading that made the FIRST split linear - "one action, spent
 * moving or ticking" - which gives clock = 1 - b and puts the model in open conflict with
 * special relativity. The fix was to notice that along and across are DIRECTIONS.
 *
 * INSIDE AND OUTSIDE ARE NOT DIRECTIONS. `blocks` is a PREDICATE ON A POINT - is this
 * point holding something - and a predicate carries no direction at all. A ray's bend
 * happens at a point that either holds matter or does not; there is no component of the
 * step "along inside". Two disjoint events partition an AMOUNT and amounts add linearly.
 * Two orthogonal directions resolve a VECTOR and vectors add in quadrature. Writing the
 * second like the first would be the same mistake reflected, and it is caught here by
 * asking the model how many directions the distinction names. The answer is none.
 *
 * SO THE LAW IS MIXED, AND THE MIXTURE IS THE RESULT:
 *
 *     1  =  b^2  +  m  +  binding
 *
 * b enters squared because it is a direction; m and the binding enter linearly because
 * they are shares of what is left. A thing at rest has b = 0 and m + binding = 1, so it
 * can be light - most of its internal motion holding it together - or heavy, and the
 * relation no longer forces the answer. Which is what was wanted.
 *
 * AND THE SHARE THAT DIVIDES THE SECOND SPLIT IS NOT FREE EITHER, which is the part that
 * makes this a derivation rather than a decomposition. This model already counts that share,
 * from the other end and without mentioning any trajectory: (G/2) is refused wherever matter
 * is holding something, and the refusal rate is how much of everything happens where matter
 * is. Measured, 0.0611 off the rays against 0.0652 off the expansion rule - six per cent
 * apart, by two roads that share no code. So
 *
 *     binding = (1 - b^2) . shadow
 *     m       = (1 - b^2) . (1 - shadow)
 *
 * with nothing fitted in either: b is measured, the shadow is counted by the model itself,
 * and the mass is what the two of them leave over.
 *
 * MORE BINDING IS LESS MASS, and that is the right way round rather than a coincidence. A
 * bound thing weighs less than the sum of its parts - the mass defect - and here it is not
 * an analogy but the same subtraction: motion that has gone into holding the thing together
 * is motion that is not available to weigh it.
 *
 * THE COMPARISON WAS FIRST MADE AGAINST THE WRONG QUANTITY and reported as a failure. The
 * shadow is a fraction of OPPORTUNITIES; `inside` is a fraction of BENDS; both are shares of
 * a count and are comparable. The binding TERM is that share times the step left to divide,
 * which is a part rather than a proportion. Set against each other the two looked eight
 * times apart and the identification was written off as unearned. It is not unearned; it
 * was mis-measured.
 */
import { Rule as TheoryRule } from "../../lib/Theory.ts";
import { add, mul, num, sub, sym } from "../Expr.ts";
import { Lab, Probe, Probing, measure } from "../Probe.ts";
import { Emitted, Measured } from "../Kernel.ts";
import {
  foldDensity, readingOf, shadow, shadowCounted, tradeoff,
} from "../../lib/Trajectory.ts";
import { ALONG, LEFT, SPENT, STEP_LEN } from "./budget.ts";

/** the crossing part, which is everything a structure does that gets it nowhere */
export const ACROSS = "|across|^{2}";
/** of that, what is spent in the open - which is inertia, and is the mass */
export const FREE = "m";
/** and what is spent inside matter - holding it together and running its clock */
export const BOUND = "binding";
/** how much of all the bending happened where matter was - read off trajectories */
export const INSIDE = "inside";
/** the same share, counted off the expansion rule instead - the gravity of this model */
export const SHADOW = "shadow";
/*
 * NAMED FOR THE CHECKS THE RULE MAKES, AND NOT AS GREEK.
 *
 * These were φ, ρ_{f} and `gate` - matter per point, fold depth, and how much busier
 * matter's footprint is than the vacuum. Three symbols, and TWO OF THEM WERE REDUNDANT:
 * φ/ρ_{f} is (M/N)/(M/hosts) = hosts/N exactly, so carrying both said one thing twice, and
 * `gate` was then a ratio of ratios on top of it. Written out it collapses to the two
 * questions `CREATION` actually asks, in the order it asks them:
 *
 *     open(l)   !l.source && !busy(l)                   - did the split get that far
 *     held(l)   blocks(l), which is contained(l).length  - and was matter in the way
 *
 * and the shadow is one over the other. A reader who wants to check it can read the rule.
 */
/** points where `l.contained` is not empty - matter is held here, so (G/2) is refused */
export const HELD = "l.contained";
/** points that got as far as that test - `!l.source && !busy(l)` */
export const OPEN = "l.free";
/** the whole of one step, which is what the three shares divide up */
export const BUDGET = "budget";

export const rest: Probe = {
  id: "rest/what-a-thing-at-rest-is-doing",
  asks: "a thing at rest is still moving at one cell a tick internally. What do the rules " +
    "spend that motion on, and do the parts add as directions or as shares?",
  run: (lab: Lab): Probing => {
    const measured: Measured[] = [];
    const facts: Emitted[] = [];
    const g = lab.geometry;
    const seeded: any = lab.theory.seed({ geometry: g, N: 5, seed: 1 });

    /*
     * READ OFF THE RULES, NOT OFF A RUN.
     *
     * The first version of this probe built a world, ticked it sixty times and reported the
     * shares it came back with. THOSE ARE MEASUREMENTS AND THIS IS A DERIVATION: a number
     * off one run is a fact about that run, and dropping it into a law makes the law a fit.
     * What a law needs is what the rules DO, which is readable without running them - the
     * rules are right here, and `Rule` carries its own `exec`.
     *
     * SO EVERY PREMISE BELOW IS A STATEMENT ABOUT A RULE'S TEXT, and each one is quoted so
     * a reader can check it against the source rather than take it.
     */
    const rules = lab.theory.rules as Record<string, { type: unknown; exec: Function }>;
    const src = (name: string) => {
      const r = rules[name];
      return r ? r.exec.toString() : "";
    };
    const has = (name: string, what: string) => src(name).includes(what);

    // ── what moves a structure, and what that does to a ray inside it ──────────
    /*
     * WHICH RULE MOVES MATTER — ASKED OF WHAT THE RULE SAYS ABOUT ITSELF.
     *
     * `G`'s TRANSPORT walks `w.sources` and each source's `s.locals`: it moves a body
     * SOMEBODY PUT THERE. `G^XOR*2`'s MATTER and `G^XOR^c`'s MOVING move matter the model
     * made, by re-containing it in a neighbour. Only the second kind bears on this law: a
     * ray is carried by matter because matter IS what holds it, and a declared source is a
     * region of the lattice rather than something rays are inside of.
     *
     * DETECTED BY THE COUNTER IT KEEPS, NOT BY ITS SHAPE. This first looked for a rule that
     * iterates `.points`, which was true of the rule as it stood that week and stopped being
     * true the moment `MOVING` was made local — the theorem went from a law to `no law
     * follows` on a change that altered nothing about the physics it describes. A syntactic
     * pattern is a guess about how something happens to be written. `w.moved` is the rule
     * SAYING it moved matter, in the model's own bookkeeping, and it survives the rule being
     * rewritten — which is what a premise about the dynamics has to do.
     */
    const mover = Object.keys(rules).find(n =>
      /\bw(?:orld)?\.moved\s*=/.test(src(n)) && has(n, "rewrite.fold")) ?? "";
    const together = !!mover;
    measured.push(measure("a rule moves a whole structure at once", together ? 1 : 0,
      mover
        ? `${mover} moves matter by RE-CONTAINING it - it takes what a point holds and ` +
          `folds it into the neighbour along one exit, and increments \`moved\` to say so. ` +
          `Everything that point held goes together, because containment is where matter ` +
          `IS. So a ray inside is CARRIED: that displacement is part of its step whatever ` +
          `the ray itself did`
        : `nothing here moves emergent matter as a whole. ${rules["TRANSPORT"] ?
            "TRANSPORT moves a declared source's own cells, which is a region of the " +
            "lattice and not something rays are inside of" : "there is no mover at all"}, ` +
          `so no ray is carried and nothing gives one a component to keep`));

    // ── what refuses the expansion, and in what order it asks ──────────────────
    const creation = rules["CREATION"] ? "CREATION" : "";
    const text = src(creation);
    const iBusy = text.indexOf("busy(");
    const iBlocks = text.indexOf("blocks");
    const gated = iBusy >= 0 && iBlocks >= 0 && iBusy < iBlocks;
    measured.push(measure("(G/2) is refused where matter is held", iBlocks >= 0 ? 1 : 0,
      iBlocks >= 0
        ? `${creation} consults \`blocks\`, and the split it then does not make is the ` +
          `expansion that did not happen - which is the gravity of this model`
        : `${creation || "nothing here"} never consults \`blocks\`, so matter is not in ` +
          `the way of anything and there is no shadow to divide by`));
    measured.push(measure("and it asks `busy` first", gated ? 1 : 0,
      gated
        ? `\`busy(l)\` is read at character ${iBusy} and \`blocks\` at ${iBlocks}, so a ` +
          `point already carrying a ray RETURNS BEFORE the blocks test and never refuses a ` +
          `split however much matter it holds. The shadow is therefore over the points that ` +
          `reach the test, not over all of them - and reading it over all of them gives an ` +
          `answer twice too big`
        : "nothing here gates the blocks test, so every point holding matter refuses"));

    /*
     * AND WHAT KIND OF THING `blocks` IS - which decides the whole shape of the law.
     *
     * Not whether it is set: what its ARITY is. It takes a point and returns a yes or a no.
     * A direction is not among its outputs, so the distinction it draws cannot resolve a
     * vector and must not be added in quadrature. `budget`'s header keeps the mirrored
     * mistake on record - reading along-against-across as a share, which gives clock = 1-β
     * and breaks special relativity - and this is the same error available the other way up.
     */
    const blocks = seeded.blocks;
    const isPredicate = typeof blocks === "function" && blocks.length <= 1;
    measured.push(measure("directions the inside/outside split names", 0,
      isPredicate
        ? `\`blocks\` takes ${blocks.length} argument - a point - and answers yes or no. ` +
          `A predicate has no direction in it, so inside and outside are DISJOINT EVENTS ` +
          `and partition an amount. Amounts add linearly; vectors add in quadrature`
        : "this theory has no `blocks` to ask"));

    const lengths = [...new Set(g.steps.map(x => x.toFixed(9)))];
    const uniform = lengths.length === 1;
    measured.push(measure("distinct exit lengths", lengths.length,
      `${g.name}: ${lengths.join(", ")}. The first split is Pythagoras and needs one`));

    if (!uniform) return {
      facts, measured, holds: false,
      found: `${g.name}'s exits are not all the same length, so a step has no fixed ` +
        `magnitude and there is no |across|^{2} to divide up. The question cannot be asked ` +
        `on this tiling - a statement about the lattice and not a gap in the theory`,
    };
    if (!together || iBlocks < 0 || !isPredicate) return {
      facts, measured, holds: false,
      found: `${lab.theory.name} ${!together ? "moves no structure as a whole" :
        iBlocks < 0 ? "never refuses a split where matter is" :
        "has no predicate saying where matter is"}, so its rules do not separate motion ` +
        `that holds a thing together from motion that weighs it. The split has no referent ` +
        `and the probe declines rather than dividing by a distinction that is not there`,
    };

    facts.push({
      fact: { kind: "equals", of: ALONG, to: mul(sym(SPENT), sym(SPENT)) },
      from: [], measured: [measured[0], measured[4]],
      because: `${mover} re-contains what a point holds into the neighbour along one exit, ` +
        `all of it together, because containment is where matter is. A ray held inside is ` +
        `therefore carried: that displacement is part of its step whatever the ray did. So ` +
        `the step carries a component along the direction of travel equal to the speed of ` +
        `the matter holding it, and its square is what Pythagoras wants`,
      line: `${ALONG} = ${SPENT}^{2}`,
    });

    facts.push({
      /* WRITTEN OUT RATHER THAN NAMED. `|across|^{2} = m + binding` is the same statement
       * and reads better, but `binding` then stands unopened in the first derived form and
       * the law on the page carries a name instead of what it is made of. Opened here, the
       * substitution that reaches the tradeoff reaches it already written out. */
      fact: {
        kind: "equals", of: ACROSS,
        to: add(sym(FREE), mul(sym(LEFT), sym(HELD), sym(OPEN, -1))),
      },
      from: [], measured: [measured[3]],
      because: `and what is left of the step after that divides again - LINEARLY. Every ` +
        `bend a ray makes happens at a point, and \`blocks\` sorts points into two kinds ` +
        `and no more: holding something, or not. That is a predicate, so the two are ` +
        `DISJOINT EVENTS partitioning an amount rather than orthogonal components ` +
        `resolving a vector. Amounts add; only vectors go in quadrature. Motion lost in ` +
        `the open is inertia and motion lost where matter is holding is what does the ` +
        `holding, and between them they are the whole of it`,
      line: `${ACROSS} = ${FREE} + ${LEFT}·\\frac{${HELD}}{${OPEN}}`,
    });

    facts.push({
      fact: { kind: "equals", of: SHADOW, to: mul(sym(HELD), sym(OPEN, -1)) },
      from: [], measured: [measured[1], measured[2]],
      because: `AND THE SHARE THAT DIVIDES THEM IS THE RULE ITSELF, not a number off a run. ` +
        `${creation} refuses the split at exactly those points where \`blocks\` says ` +
        `matter is held - and it reaches that test only where it has not already returned, ` +
        `which is \`!l.source && !busy(l)\`. So the share of the expansion that matter ` +
        `stops is one count over the other BY THE TEXT OF THE RULE. Nothing is fitted here ` +
        `and nothing needed to be run: the two counts are the two branches ${creation} takes`,
      line: `${SHADOW} = \\frac{${HELD}}{${OPEN}}`,
    });

    facts.push({
      fact: { kind: "equals", of: BOUND, to: mul(sym(LEFT), sym(SHADOW)) },
      from: [], measured: [measured[1], measured[3]],
      because: `so the holding part is the crossing part taken at that share - what is left ` +
        `after the motion is paid for, times how much of it happens where matter is`,
      line: `${BOUND} = ${LEFT} · ${SHADOW}`,
    });

    facts.push({
      fact: { kind: "equals", of: FREE, to: mul(sym(LEFT), sub(num(1), sym(SHADOW))) },
      from: [], measured: [measured[1], measured[3]],
      because: `AND THE MASS IS WHAT THOSE TWO LEAVE. Not a definition of mass and not a ` +
        `measurement of one: the step is spent, the parts are named by which branch of ` +
        `which rule they fall on, and m is the one that is not held. MORE BINDING IS LESS ` +
        `MASS - the mass defect, and here it is the same subtraction rather than an ` +
        `analogy, because motion that has gone into holding a thing together is motion ` +
        `that is not available to weigh it`,
      line: `${FREE} = ${LEFT} · (1 - ${SHADOW})`,
    });

    facts.push({
      fact: { kind: "equals", of: BUDGET, to: add(sym(SPENT, 2), sym(ACROSS)) },
      from: [], measured: [measured[4]],
      /*
       * NO `line`, AND THAT IS WHAT KEEPS THE TRADEOFF OUT OF THE PREMISES.
       *
       * `chained` quotes the earliest line it can find for a quantity, so whatever a leaf
       * says becomes the law on the page. What this leaf is entitled to say is Pythagoras
       * and nothing more: one step is what keeps pace plus what crosses. Without a line it
       * still stands as the premise and still carries its rules; it simply does not speak
       * for the result, and the first form the page shows is the earliest DERIVED one.
       */
      because: `and the two of them are one step. ${g.name} has a single exit length, so a ` +
        `step is a vector whose magnitude does not depend on which way it points - and ` +
        `orthogonal components of a fixed magnitude square to it`,
    });

    return {
      facts, measured, holds: true,
      found: `READ OFF THE RULES AND NOT OFF A RUN. A step of fixed length divides twice, ` +
        `and not the same way both times. ${mover} carries every point of a structure ` +
        `together, so a bound ray keeps pace and its step has a component ALONG the motion; ` +
        `the rest crosses. Those are DIRECTIONS and square to the step - which is ` +
        `\`budget\`, and where the Lorentz factor comes from. Then ${creation} sorts ` +
        `points with \`blocks\`, a predicate, into held and not-held: TWO ANSWERS, no ` +
        `direction between them, so that cut is a share and adds linearly. The share is the ` +
        `rule's own two branches - refused over reached - and the mass is what the other ` +
        `two leave. Nothing here was fitted and nothing was run`,
    };
  },
};
