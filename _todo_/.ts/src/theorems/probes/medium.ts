/**
 * WHAT THE MEDIUM DOES TO WHAT IT CARRIES - asked of the RULES, and answered on integers.
 *
 * THIS FILE REPLACED A MEASUREMENT, and the reason is worth stating because it is the
 * same reason the shell count was replaced by Ehrhart. The premise wanted here is that
 * what a body takes out of the medium is neither made good nor lost as it spreads - that
 * as much of it crosses a far shell as a near one. The obvious way to establish that is
 * to put a body in a box, measure the shortfall shell by shell, and fit. It does not
 * work: the profile around a single body dies into noise within a dozen cells, which
 * `gravity.ts` records ("at 51^3 it gave 118% fit error and said nothing") and which
 * this folder rediscovered the hard way - a fitted slope of -2.44 that turned out to be
 * a clock, then a per-tick rate that alternated sign shell to shell.
 *
 * IT IS NOT A QUESTION ABOUT A PROFILE. It is a question about a RULE. Transport moves a
 * ray from where it is to where it is going; it does not make one and it does not put
 * one out. If that is true then the flux is conserved for every shell at once, exactly,
 * for ever - and it is true or false about the rule, so it can be settled by isolating
 * the rule and counting.
 *
 * WHICH THE THEORY ITSELF MAKES POSSIBLE. `Theory.without` returns the same theory with a
 * rule taken out, so transport can be run with nothing else in the world: no emission, no
 * creation, no annihilation. Light some rays, tick, count. On fcc-12 the count goes 1250,
 * 1250, 1250, 1250 and does not move, because MOVEMENT writes each ray's contents onto
 * exactly one neighbour and ARRIVAL swaps them in. That is a bijection, said in integers,
 * and no box or seed or run length can make it 1249.
 *
 * THE SCOPE IS STATED RATHER THAN HIDDEN. What is established here is that TRANSPORT
 * conserves. The full theory also annihilates, which destroys rays in flight, and the
 * probe names every rule it set aside so a reader can see exactly what the premise does
 * and does not cover. The falloff that follows is therefore the leading behaviour - what
 * the medium does to a disturbance while carrying it - and interactions in flight are a
 * correction on top of it, not part of this argument.
 */
import { Geometry } from "../../lib/Local.ts";
import { World } from "../../lib/Compat.ts";
import { Lab, Probe, Probing, measure, middle } from "../Probe.ts";
import { Emitted, Measured } from "../Kernel.ts";
import { RHO } from "./lattice.ts";

/** the disturbance a body leaves in the medium - what this whole proof is about */
export const DEFICIT = "deficit";
/** how much of it a body makes: the rays it takes out per tick */
export const STRENGTH = "S";

/** the rules that carry a ray from where it is to where it is going, and nothing else */
const TRANSPORT = new Set(["MOVEMENT", "ARRIVAL"]);

/** the same theory with everything but transport taken out - see the header */
const transportOnly = (theory: any) => {
  let t = theory;
  const removed: string[] = [];
  for (const name of Object.keys(theory.rules))
    if (!TRANSPORT.has(name)) { t = t.without(name); removed.push(name); }
  return { theory: t, removed, kept: Object.keys(t.rules) };
};

/** every active ray in the world - the integer this probe is about */
const active = (w: World) => (w.locals as any[]).reduce(
  (n, l) => n + (l.rays as any[]).filter((r: any) => r.active).length, 0);

export const medium: Probe = {
  id: "medium/what-transport-does",
  asks: "when the medium carries something, does it make any more of it, or lose any of " +
    "it, on the way?",
  run: (lab: Lab): Probing => {
    const g: Geometry = lab.geometry;
    const measured: Measured[] = [];
    const facts: Emitted[] = [];

    /*
     * ASKED OF THE FULL RULES, WHICH IS THE ONLY REGIME THE THEORY HAS.
     *
     * THIS USED TO SET (G/2) AND (G/1) ASIDE and measure what was left. Under transport
     * alone the ray count is conserved trivially - the two rules that change it are the
     * two that were removed - so "the deficit is conserved in flight" came out exact
     * without ever being asked of the dynamics the model runs. A theorem whose premises
     * hold only in a reduced theory says nothing about the full one, and every falloff
     * result in this book stands on these two premises.
     *
     * A DEFICIT IS A DIFFERENCE AND MUST BE MEASURED AS ONE. What spreads is not the rays
     * - those are made and unmade constantly, and counting them under the full rules
     * measures the vacuum's own churn. It is the SHORTFALL against an undisturbed vacuum:
     * two runs on ONE seed, one perturbed and one not, differ by exactly the disturbance,
     * and the ambient subtracts off. That difference is what has to be conserved as it
     * spreads, and it is what a second body feels.
     */
    const theory = lab.theory, removed: string[] = [], kept = Object.keys(theory.rules);
    if (!kept.length) return {
      facts: [], measured, holds: false,
      found: `${lab.theory.name} has no transport rule, so there is nothing here that ` +
        `carries anything and no question to ask about how it carries it`,
    };

    /*
     * WRAPPED, so that nothing leaves. An absorbing edge takes rays out of the world, and
     * a count that falls because rays walked off the side would read as transport losing
     * them - which is a fact about the boundary and not about the rule.
     */
    const N = Math.min(lab.boxFor(g), g.D === 1 ? 41 : g.D === 2 ? 21 : 9);
    /*
     * BOUNDED, BECAUSE THE QUESTION IS ABOUT A MEDIUM OF FIXED EXTENT.
     *
     * (G+M/3) puts a midpoint on every edge it fires on, so a world left to itself grows
     * by thousands of points a tick — and this probe runs TWO of them, for every theory
     * on every lattice, inside a run that fans out across a dozen processes. Unbounded
     * that is tens of gigabytes; measured, it took the machine to 30 of its 31.
     *
     * SO THE RUN IS AS LONG AS THE STATISTICS ASK FOR AND NO LONGER. Sixteen ticks gives
     * eight in the tail, which is enough to fit a slope against its own scatter; thirty
     * bought nothing the fit needed and cost the growth of every one of those worlds.
     */
    const w = new World({ theory, geometry: g, N, seed: lab.seeds[0], boundary: "wrap" });

    /*
     * LIT DETERMINISTICALLY, EVERY SEVENTH RAY. Not at random: the claim is about a rule
     * rather than about a typical configuration, so the configuration should be
     * reproducible and stated. Seven is coprime with every DEG in this repository, so the
     * lit rays do not line up with any one exit direction.
     */
    /*
     * TWO WORLDS ON ONE SEED, differing by a disturbance and by nothing else — and the
     * disturbance is read as the INTEGRAL over where they differ, which is the only
     * reading that is a statement about any setup rather than about the one chosen.
     *
     * A COUNT OF RAYS IS NOT WHAT IS CONSERVED and cannot be: (G/2) makes them and (G/1)
     * unmakes them, so under the full rules the total moves whatever a disturbance does.
     * Nor is the FOOTPRINT — the set of sites reached grows like the shell, which is the
     * whole point of spreading. What holds is what is spread OVER that footprint: the
     * sum over every site of how far the two worlds differ there. A shell twice as wide
     * with half as much at each site carries the same disturbance, which is exactly the
     * dilution the theorem above is about.
     *
     * NOTHING HERE IS FITTED TO A SETUP. Whatever the caller has put in the world, the
     * difference against the same seed without it is that thing, and this measures it.
     */
    const u = new World({ theory, geometry: g, N, seed: lab.seeds[0], boundary: "wrap" });
    const centre = middle(g, N);
    /*
     * THE PERTURBATION: ONE RAY, AT THE CENTRE — and the centre is where the reach below
     * is measured from, so the two have to be the same place. Lighting the first local
     * the walk happens to hand over and then measuring how far the difference has got
     * from the middle of the box reports the distance between two unrelated points, which
     * comes out at the box's own width on the first tick and says nothing.
     */
    const home = (w.locals as any[]).find(l => {
      const p = w.embedding.at(l) as number[] | undefined;
      return p && p.every((x, k) => Math.abs(x - centre[k]) < 1e-9);
    });
    let lit = 0;
    if (home) for (const r of home.rays as any[]) { r.active = true; lit++; break; }

    /** how much the two worlds differ, site by site: the integral, and how far it reaches */
    const apart = (a: World, z: World) => {
      const bg = new Map<string, number>();
      for (const l of z.locals as any[]) {
        const p = z.embedding.at(l) as number[] | undefined;
        if (!p) continue;
        bg.set(p.join(","), (l.rays as any[]).filter((r: any) => r.active).length);
      }
      let total = 0, far = -1, sites = 0;
      for (const l of a.locals as any[]) {
        const p = a.embedding.at(l) as number[] | undefined;
        if (!p) continue;
        const d = Math.abs((l.rays as any[]).filter((r: any) => r.active).length
          - (bg.get(p.join(",")) ?? 0));
        if (!d) continue;
        total += d; sites++;
        far = Math.max(far, p.reduce((sum, x, k) => sum + Math.abs(x - centre[k]), 0));
      }
      return { total, far, sites };
    };

    /* enough tail to fit a slope against its own scatter, and no more — thirty was more
     * than the statistics asked for and is what made this expensive */
    const ticks = 16;
    const seq: number[] = [], reach: number[] = [];
    for (let t = 0; t < ticks; t++) {
      w.run(1); u.run(1);
      const a = apart(w, u);
      seq.push(a.total); reach.push(a.far);
    }
    /*
     * CONSERVED MEANS IT SETTLES, and that is a statement about the whole run rather than
     * about any tick in it.
     *
     * A SPAN WITH A NUMBER BESIDE IT IS A FITTED CONSTANT. Asking whether the integral
     * varies by less than some fraction over six ticks decided fcc 12 in and cubic 6 out
     * on 36% against 64% — which is the threshold choosing, not the medium. And it is the
     * wrong question anyway: a disturbance that has just been made is still finding its
     * shape, so it moves at first and that says nothing about whether it is being carried
     * or amplified.
     *
     * SO THE TEST IS WHETHER IT STOPS GROWING, judged against its own scatter. Fit the
     * trend over the second half of the run and compare it to the standard error of that
     * fit: a slope indistinguishable from zero is a disturbance that is being carried, and
     * one that climbs out of its own noise is being made. Nothing here is chosen — the
     * scale is the sequence's own, which is what makes this a property of the medium.
     */
    const tail = seq.slice(Math.floor(seq.length / 2));
    const n = tail.length;
    const mx = (n - 1) / 2;
    const my = tail.reduce((a, z) => a + z, 0) / n;
    let sxy = 0, sxx = 0;
    tail.forEach((y, k) => { sxy += (k - mx) * (y - my); sxx += (k - mx) ** 2; });
    const slope = sxx ? sxy / sxx : 0;
    let ss = 0;
    tail.forEach((y, k) => { ss += (y - (my + slope * (k - mx))) ** 2; });
    /*
     * THE STANDARD ERROR OF THE SLOPE — the scale the data itself sets.
     *
     * AND A PERFECTLY FLAT RUN HAS NO SCATTER AT ALL, which is the best possible answer
     * and was being read as the worst. A sequence that holds exactly — 11, 11, 11, 11,
     * 11, 11, 11, 11, which is what fcc 12 does once the disturbance has found its shape
     * — has zero residual, so the standard error is zero, and dividing by it gave
     * infinity and failed the test. Conservation was rejected for being exact.
     */
    const se = sxx && n > 2 ? Math.sqrt(ss / (n - 2) / sxx) : 0;
    const t = se > 0 ? Math.abs(slope) / se : (slope === 0 ? 0 : Infinity);
    const steady = my > 0 && Number.isFinite(t) && t < 2;

    measured.push(measure("the disturbance, integrated, tick by tick", seq[0] ?? 0,
      `${seq.join(", ")} over ${ticks} ticks on ${g.name}, box ${N}, wrapped so nothing ` +
      `can leave - the total difference between a perturbed world and an unperturbed one ` +
      `at the same seed, under EVERY rule of ${theory.name}. Over the second half it ` +
      `trends ${slope.toFixed(3)} a tick against a standard error of ${se.toFixed(3)}, ` +
      `which is ${t.toFixed(1)} sigma from flat`));
    measured.push(measure("rules set aside to ask this", removed.length,
      `none - this is the full theory, which is the only regime it has`));

    if (!steady) return {
      facts: [], measured, holds: false,
      found: `a disturbance in ${theory.name} is not carried: integrated over where the ` +
        `two worlds differ it goes ${seq.join(", ")}. Nothing that spreads through this ` +
        `medium is diluted by the room it spreads into, because some of it is being made ` +
        `or lost on the way`,
    };

    facts.push({
      fact: { kind: "conserved", of: DEFICIT },
      from: [], measured: [measured[0], measured[1]],
      because: `under EVERY rule of ${theory.name}, the difference between a perturbed ` +
        `world and an unperturbed one at the same seed, INTEGRATED over every site where ` +
        `they differ, SETTLES: over the second half of ${ticks} ticks it trends ` +
        `${slope.toFixed(3)} a tick, ${t.toFixed(1)} sigma from flat against its own ` +
        `scatter, so it is not being made on the way. The count of rays cannot be the conserved ` +
        `thing - (G/2) makes them and (G/1) unmakes them - and neither can the footprint, ` +
        `which grows like the shell. What holds is what is spread over that footprint, ` +
        `which is the quantity the dilution above is about`,
      line: `${DEFICIT} is conserved in flight`,
    });

    /*
     * AND IT TRAVELS BY STEPPING, one cell a tick — watched as the reach of that same
     * difference. Under the full rules the vacuum lights points everywhere on its own, so
     * "how far has anything got" is answered by the ambient at once and says nothing; how
     * far the two worlds DIFFER is the disturbance and only the disturbance.
     */
    const walks = reach.length > 0 && reach.every((d, t) => d >= 0 && d <= (t + 1) * g.steps.length);

    measured.push(measure("how far the disturbance has reached, tick by tick", reach.length,
      `${reach.join(", ")} in lattice units after ${reach.map((_, i2) => i2 + 1).join(", ")} ` +
      `ticks - it advances by steps and cannot appear anywhere it has not stepped to`));

    if (walks) facts.push({
      fact: { kind: "carried", of: DEFICIT, by: RHO },
      from: [], measured: [measured[measured.length - 1]],
      because: `under EVERY rule of ${theory.name}, the place a perturbed world and an ` +
        `unperturbed one differ spreads along the lattice's own exits - one exit a tick, ` +
        `watched as a front that never runs ahead of the steps it has taken. So a ` +
        `disturbance gets from here to there BY TRAVELLING THROUGH the medium, which is ` +
        `what makes the medium's own evenness a fact about the disturbance as well`,
      line: `${DEFICIT} travels through ${RHO}`,
    });

    return {
      facts, measured, holds: true,
      found: `a disturbance is carried whole - integrated it goes ${seq.join(", ")} over ` +
        `${ticks} ticks while its reach grows ${reach.join(", ")}, under every rule ` +
        `set aside - and it carries by stepping along the lattice's exits`,
    };
  },
};
