/**
 * THE VACUUM DOES NOT SPLIT WHERE SOMETHING IS ALREADY THERE - read off the creation rule,
 * and then counted.
 *
 * THIS IS WHERE THE EXTRA GRAVITY COMES FROM, and the article is emphatic that it is not
 * an extra assumption: space is trying to expand everywhere, matter is in the way of it,
 * and the deficit that leaves is the pull. The mechanism is one clause of one rule - a
 * point already carrying a charge is busy, an arriving charge annihilates or reverses, and
 * either way that point does not split this tick - so splitting is suppressed exactly
 * where the carrier density is high, which is where the field is strong.
 *
 * SO THE FIRST HALF IS STRUCTURAL AND IS SETTLED BY RUNNING THE RULE. Hand CREATION a
 * point with nothing on it and it splits; hand it a point with something on it and it
 * returns without doing anything. Two calls, two outcomes, no statistics. That is the
 * whole of "the expansion is blocked by matter", and once it is established the
 * interpolation law is algebra: with occupancy θ and a free fraction 1/(1+θ), the busy
 * fraction θ/(1+θ) is gN/g, and that rearranges to g² - g·gN - gN·a0 = 0.
 *
 * AND THE SECOND HALF IS A DEBT THE ARTICLE RECORDS ITSELF OWING. Its own words: what is
 * still owed is "a lattice run of the suppression itself: measuring the free fraction
 * against the field and checking it goes as 1/(1+θ) rather than only checking that it
 * closes algebraically once assumed. The algebra is exact; the mechanism behind it has not
 * been clocked." So this clocks it - and clocks it without fitting anything, because there
 * is nothing to fit: at each tick the world has an exact occupancy and an exact free
 * fraction, both integer counts over the same points, and 1/(1+θ) is a prediction with no
 * parameter in it. Every tick is a point on a curve that was drawn before the run started.
 *
 * WHAT IS NOT SETTLED HERE is the step from a carrier density to a field, `g ∝ n`, which
 * the article uses to turn θ into an acceleration ratio. That is its own claim and it is
 * left as one rather than folded in silently.
 */
import { Geometry } from "../../lib/Local.ts";
import { World } from "../../lib/Compat.ts";
import { rat } from "../Algebra.ts";
import { Lab, Probe, Probing, measure, middle } from "../Probe.ts";
import { Emitted, Measured } from "../Kernel.ts";

/** how much of the vacuum is carrying something - the occupancy the rule reads */
export const OCCUPIED = "\\theta";
/** the share of points still free to split */
export const FREE = "free fraction";
/** whether the creation rule is gated on the point being idle at all */
export const BLOCKED = "creation is blocked where something is";

export const suppression: Probe = {
  id: "suppression/what-stops-the-vacuum-splitting",
  asks: "does this theory's vacuum decline to make space where something is already " +
    "there, and what share of it is free to split as it fills?",
  run: (lab: Lab): Probing => {
    const measured: Measured[] = [];
    const facts: Emitted[] = [];

    const rule = lab.theory.rules.CREATION;
    if (!rule) return {
      facts, measured, holds: false,
      found: `${lab.theory.name} has no creation rule, so its vacuum makes no space, ` +
        `nothing can block it and there is no suppression to be had`,
    };

    const g: Geometry = lab.geometry;

    /* ---- the gate, by handing the rule one point of each kind ------------------ */
    /*
     * TWO CALLS AND NO STATISTICS. A point with nothing on it, and the same point with
     * something on it. If the rule treats them alike there is no gate and the whole
     * suppression argument has nothing under it.
     */
    const trial = (occupied: boolean) => {
      const w = new World({ theory: lab.theory, geometry: g, N: 5, seed: lab.seeds[0],
        boundary: "wrap" });
      const all = w.locals as any[];
      const l = all[Math.floor(all.length / 2)];
      for (const r of l.rays as any[]) r.active = false;
      if (occupied) (l.rays as any[])[0].active = true;
      const before = (l.rays as any[]).filter((r: any) => r.active).length;
      rule.exec(l);
      const after = (l.rays as any[]).filter((r: any) => r.active).length;
      return { before, after, split: after > before };
    };

    const idle = trial(false), busy = trial(true);
    measured.push(measure("an idle point handed to CREATION", idle.after - idle.before,
      `a point with nothing on it went from ${idle.before} lit rays to ${idle.after} - ` +
      `${idle.split ? "it split" : "it did not split"}`));
    measured.push(measure("a busy point handed to CREATION", busy.after - busy.before,
      `the same point with one ray already lit went from ${busy.before} to ${busy.after} ` +
      `- ${busy.after > busy.before ? "it split anyway" : "it did NOT split"}`));

    if (!idle.split) return {
      facts, measured, holds: false,
      found: `${lab.theory.name}'s creation rule did not split even an empty point in ` +
        `this setting, so nothing here can be read about what blocks it`,
    };

    if (busy.after > busy.before) return {
      facts, measured, holds: false,
      found: `${lab.theory.name} splits a point whether or not something is already ` +
        `there, so its expansion is NOT blocked by what the medium is carrying. There is ` +
        `no suppression mechanism in this theory and the extra gravity would have to ` +
        `come from somewhere else`,
    };

    facts.push({
      fact: { kind: "positive", of: BLOCKED },
      from: [], measured: [measured[0], measured[1]],
      because: `${lab.theory.name}'s own CREATION rule was handed a point with nothing ` +
        `on it and split it, then handed a point with one ray lit and left it alone. So ` +
        `splitting is gated on the point being idle, exactly as the mechanism claims: a ` +
        `point already carrying something is busy and does not split this tick. That is ` +
        `the whole of "space is trying to expand everywhere and matter is in the way of ` +
        `it" - two calls to the rule, no statistics, and it could have come out the ` +
        `other way`,
      line: `${BLOCKED}`,
    });

    /* ---- and the free fraction as it fills, counted tick by tick --------------- */
    /*
     * NOTHING IS FITTED HERE AND THERE IS NOTHING TO FIT. Each tick gives an exact
     * occupancy and an exact free fraction - two integer counts over the same points -
     * and 1/(1+θ) is a prediction with no parameter in it. So the comparison is
     * pointwise: what was predicted before the run against what the run did.
     */
    const N = Math.min(lab.boxFor(g), g.D === 1 ? 41 : g.D === 2 ? 21 : 9);
    const w = new World({ theory: lab.theory, geometry: g, N, seed: lab.seeds[0],
      boundary: "wrap" });
    const rows: string[] = [];
    let worst = 0;
    for (let t = 1; t <= 8; t++) {
      w.run(1);
      let lit = 0, ways = 0, free = 0, points = 0;
      for (const l of w.locals as any[]) {
        if (l.source) continue;
        points++;
        const on = (l.rays as any[]).filter((r: any) => r.active).length;
        lit += on; ways += (l.rays as any[]).length;
        if (on === 0) free++;
      }
      if (!points || !ways) continue;
      const theta = lit / ways;
      const measuredFree = free / points;
      const predicted = 1 / (1 + theta);
      worst = Math.max(worst, Math.abs(measuredFree - predicted));
      rows.push(`t=${t}: θ=${theta.toFixed(4)}, free ${measuredFree.toFixed(4)} against ` +
        `1/(1+θ)=${predicted.toFixed(4)}`);
    }

    /*
     * A CHECK AGAINST θ = 0 IS NOT A CHECK. Under pure gravity every meeting annihilates,
     * the vacuum's occupancy settles at nothing, and 1/(1+0) = 1 is matched by a free
     * fraction of 1 for the same reason a net of nought is conserved by any rule at all.
     * The agreement is perfect and means nothing, and reporting it as a confirmation
     * would be the most flattering way this probe could lie.
     */
    const reached = Math.max(0, ...rows.map(r =>
      Number(/θ=([0-9.]+)/.exec(r)?.[1] ?? 0)));
    if (reached < 1e-9) {
      measured.push(measure("occupancy reached during the run", reached,
        `θ stayed at nothing for all ${rows.length} ticks - ${rows.join("; ")}`));
      return {
        facts, measured, holds: true,
        found: `${lab.theory.name}'s vacuum splits an idle point and leaves a busy one ` +
          `alone, so the suppression mechanism is there and is read off the rule. But its ` +
          `occupancy never leaves nothing in this theory, so the free fraction sat at 1 ` +
          `throughout and 1/(1+θ) = 1 matched it trivially - that comparison was not ` +
          `exercised and is not reported as though it had been. A theory whose vacuum ` +
          `keeps some of what it makes is what would test it`,
      };
    }

    /*
     * AND HERE THE COMPARISON TURNS OUT NOT TO BE WELL POSED, which is worth more than a
     * verdict either way.
     *
     * θ IS COUNTED HERE PER EXIT - lit rays over ray slots - and a point is busy if ANY of
     * its DEG exits is lit. Those two readings are not compatible: at a per-exit occupancy
     * of a half on a twelve-exit lattice, the share of points with nothing at all on them
     * is (1/2)^12, which is four ten-thousandths. So the free fraction is nearly nought
     * while 1/(1+θ) is two thirds, and the "disagreement" is a statement about which
     * quantity θ names rather than about the model.
     *
     * THE ARTICLE'S θ IS AN ACCELERATION RATIO, g/a0, reaching the lattice through `g ∝ n`
     * - a step it makes explicitly and this probe deliberately does not fold in. So what
     * is owed is not the run: it is an operational definition of θ on the lattice, and
     * until there is one the algebra cannot be checked against a count at all.
     *
     * REPORTED, NOT DECIDED. Emitting a `positive` here on either side would be claiming
     * to have settled something this measurement cannot reach, and the numbers are handed
     * over so a reader can see exactly what was compared with what.
     */
    const perPoint = worst;
    measured.push(measure("free fraction against 1/(1+θ), θ read per exit", perPoint,
      `counted over ${rows.length} ticks of ${lab.theory.name} on ${g.name}, box ${N}, ` +
      `wrapped: ${rows.join("; ")}. Both numbers are exact counts over the same points. ` +
      `They disagree badly, and the reason is that a point counts as busy when ANY of its ` +
      `${g.DEG} exits is lit, so at a per-exit occupancy of θ the share of wholly idle ` +
      `points goes as (1-θ)^${g.DEG} rather than as 1/(1+θ). These are two different ` +
      `quantities and only one of them is what the article's θ names`));

    return {
      facts, measured, holds: true,
      found: `${lab.theory.name}'s vacuum splits an idle point and leaves a busy one ` +
        `alone, so the suppression mechanism the extra gravity rests on is there and is ` +
        `read off the rule rather than assumed. The free fraction against 1/(1+θ) is NOT ` +
        `settled here: counted per exit, θ runs ${rows.length ? rows[0].split(",")[0]
          .replace("t=1: ", "") : "-"} down and the free share sits near nothing, because ` +
        `a point is busy when any one of its ${g.DEG} exits is lit and (1-θ)^${g.DEG} is ` +
        `not 1/(1+θ). The article's θ is an acceleration ratio reaching the lattice ` +
        `through g ∝ n, so what is still owed is an operational definition of θ on the ` +
        `lattice - not another run`,
    };
  },
};
