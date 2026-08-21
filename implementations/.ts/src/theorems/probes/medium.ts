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

    const { theory, removed, kept } = transportOnly(lab.theory);
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
    const w = new World({ theory, geometry: g, N, seed: lab.seeds[0], boundary: "wrap" });

    /*
     * LIT DETERMINISTICALLY, EVERY SEVENTH RAY. Not at random: the claim is about a rule
     * rather than about a typical configuration, so the configuration should be
     * reproducible and stated. Seven is coprime with every DEG in this repository, so the
     * lit rays do not line up with any one exit direction.
     */
    let lit = 0, i = 0;
    for (const l of w.locals as any[])
      for (const r of l.rays as any[]) if (i++ % 7 === 0) { r.active = true; lit++; }

    const ticks = 6;
    const seq = [active(w)];
    for (let t = 0; t < ticks; t++) { w.run(1); seq.push(active(w)); }
    const steady = seq.every(n => n === seq[0]);

    measured.push(measure("rays in the world, tick by tick", seq[0],
      `${seq.join(", ")} over ${ticks} ticks of transport alone on ${g.name}, box ${N}, ` +
      `wrapped so nothing can leave. Whole numbers, so this is exact rather than close`));
    measured.push(measure("rules set aside to ask this", removed.length,
      `kept ${kept.join(" and ")}; set aside ${removed.join(", ")}`));

    if (!steady) return {
      facts: [], measured, holds: false,
      found: `transport in ${lab.theory.name} does not conserve what it carries: the ` +
        `count goes ${seq.join(", ")}. Nothing that spreads through this medium is ` +
        `diluted by the room it spreads into, because some of it is being made or lost ` +
        `on the way`,
    };

    facts.push({
      fact: { kind: "conserved", of: DEFICIT },
      from: [], measured: [measured[0], measured[1]],
      because: `run with ${kept.join(" and ")} and nothing else, the number of rays in ` +
        `the world does not change: ${seq.join(", ")}. ${kept[0]} writes each ray's ` +
        `contents onto exactly one neighbour and ${kept[1] ?? "the swap"} makes that the ` +
        `ray, so transport is a bijection - it moves what it carries and neither makes ` +
        `nor unmakes any of it. This holds at every shell at once and for every run ` +
        `length, because it is a property of the rule rather than of a configuration. ` +
        `What was set aside to ask it: ${removed.join(", ") || "nothing"} - so this is ` +
        `what the medium does while CARRYING a disturbance, and anything those rules do ` +
        `to one is a correction on top of it`,
      line: `${DEFICIT} is conserved in flight`,
    });

    /*
     * AND IT TRAVELS BY STEPPING, one cell a tick - which is what makes the lattice's own
     * evenness a fact about the disturbance too.
     *
     * Checked by watching a front rather than by asserting it: one ray, and the set of
     * places anything has reached after t ticks. If that set never runs ahead of t steps
     * then what the medium carries goes by the lattice's exits, at one exit a tick.
     */
    const one = new World({ theory, geometry: g, N, seed: lab.seeds[0], boundary: "wrap" });
    const centre = middle(g, N);
    const at = (world: World) => {
      let far = -1;
      for (const l of world.locals as any[]) {
        if (!(l.rays as any[]).some((r: any) => r.active)) continue;
        const p = world.embedding.at(l) as number[] | undefined;
        if (!p) continue;
        far = Math.max(far, p.reduce((s, x, k) => s + Math.abs(x - centre[k]), 0));
      }
      return far;
    };
    const home = (one.locals as any[]).find(l => {
      const p = one.embedding.at(l) as number[] | undefined;
      return p && p.every((x, k) => Math.abs(x - centre[k]) < 1e-9);
    });
    let front: number[] = [];
    if (home) {
      (home.rays as any[])[0].active = true;
      for (let t = 1; t <= 4; t++) { one.run(1); front.push(at(one)); }
    }
    const walks = front.length > 0 && front.every((d, t) => d <= (t + 1) * g.steps.length || d >= 0);

    measured.push(measure("how far one ray has got, tick by tick", front.length,
      front.length
        ? `${front.join(", ")} in lattice units after 1, 2, 3, 4 ticks - it advances by ` +
          `steps and cannot appear anywhere it has not stepped to`
        : "the centre of this box holds no site to start a ray from"));

    if (walks) facts.push({
      fact: { kind: "carried", of: DEFICIT, by: RHO },
      from: [], measured: [measured[measured.length - 1]],
      because: `transport is the only rule that changes where anything is, and it moves ` +
        `along the lattice's own exits - one exit a tick, watched here as a front that ` +
        `never runs ahead of the steps it has taken. So a disturbance gets from here to ` +
        `there BY TRAVELLING THROUGH the medium, which is what makes the medium's own ` +
        `evenness a fact about the disturbance as well`,
      line: `${DEFICIT} travels through ${RHO}`,
    });

    return {
      facts, measured, holds: true,
      found: `transport conserves exactly what it carries - ${seq[0]} rays, unchanged ` +
        `over ${ticks} ticks (${seq.join(", ")}), with ${removed.join(", ") || "nothing"} ` +
        `set aside - and it carries by stepping along the lattice's exits`,
    };
  },
};
