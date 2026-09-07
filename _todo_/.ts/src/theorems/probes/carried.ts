/**
 * EVERYTHING A RAY CARRIES, ASKED THE SAME TWO QUESTIONS - is it conserved while it is
 * carried, and how does a source lay it out?
 *
 * NOT "IS THE CHARGE CONSERVED". An earlier version of this file asked about the polarity
 * by name, which is the same mistake as seeding a line and handing back Ampere's law: the
 * instrument could only ever have found the thing it was built to look for. A theory here
 * declares what its rays carry - `carries("polarity", undefined)`, `carries("from", -1)` -
 * and the list is readable off the theory. So the question is asked of the list, and a
 * theory that starts carrying something new gets it asked about that too, without anybody
 * editing this file.
 *
 * THE TWO QUESTIONS ARE THE WHOLE OF A CONSERVATION LAW between them:
 *
 *   IS IT KEPT      isolate transport - MOVEMENT and ARRIVAL, nothing else - light rays
 *                   carrying a known spread of values in a wrapped box, tick, and compare
 *                   the MULTISET of carried values before and against after. Not the sum:
 *                   a sum is only meaningful for something numeric and would call a rule
 *                   that swapped two rays' labels conservative, which for a source id is
 *                   exactly wrong. The multiset is the right test for anything at all, and
 *                   it is strictly stronger where both apply.
 *
 *   HOW IS IT LAID  hand the theory's own EMISSION rule a real source and read what it
 *   OUT             wrote on each exit. For a source with no axis every exit gets the same
 *                   value, which is a monopole. For an AXIAL source the rule writes one
 *                   value into the exits on one side and its opposite into the other, and
 *                   the two cancel exactly - which is a dipole, and it has no monopole
 *                   term at all rather than a small one.
 *
 * THAT SECOND ANSWER IS THE DIFFERENCE BETWEEN AN ELECTRIC CHARGE AND A MAGNET, and it
 * falls out of one line of the emission rule - read by running it, not by transcribing it.
 * The exits it wrote nothing on are the ones lying along neither side of the axis, which
 * is what this repository calls SHEET.
 *
 * NOTHING IS FITTED AND NOTHING IS SAMPLED. Both answers are counts of integers, and no
 * box or run length or seed can move either.
 */
import { GEOMETRIES, Geometry } from "../../lib/Local.ts";
import { World } from "../../lib/Compat.ts";
import { rat } from "../Algebra.ts";
import { Lab, Probe, Probing, measure, middle } from "../Probe.ts";
import { Emitted, Measured } from "../Kernel.ts";

/** what a carried quantity is called, as a subject of a law */
export const carriedAs = (name: string) => `what a ray carries as ${name}`;
/** the net a round source puts out of it */
export const netOf = (name: string) => `net ${name}`;
/** the net an axial source puts out of it */
export const axialNetOf = (name: string) => `net ${name}, axial`;

const TRANSPORT = new Set(["MOVEMENT", "ARRIVAL"]);

const transportOnly = (theory: any) => {
  let t = theory;
  const removed: string[] = [];
  for (const name of Object.keys(theory.rules))
    if (!TRANSPORT.has(name)) { t = t.without(name); removed.push(name); }
  return { theory: t, removed, kept: Object.keys(t.rules) };
};

/** the multiset of what every active ray is carrying under this name, as a sorted tally */
const tally = (w: World, name: string): string => {
  const counts = new Map<string, number>();
  for (const l of w.locals as any[])
    for (const r of l.rays as any[]) {
      if (!r.active) continue;
      const v = JSON.stringify((r as any)[name] ?? null);
      counts.set(v, (counts.get(v) ?? 0) + 1);
    }
  return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]))
    .map(([v, n]) => `${v}x${n}`).join(" ");
};

/** the net, where what is carried is a number and a net therefore means something */
const net = (w: World, name: string): number | undefined => {
  let sum = 0, sawNumber = false;
  for (const l of w.locals as any[])
    for (const r of l.rays as any[]) {
      if (!r.active) continue;
      const v = (r as any)[name];
      if (typeof v !== "number") continue;
      sawNumber = true; sum += v;
    }
  return sawNumber ? sum : undefined;
};

/**
 * WHETHER A SOURCE PUTS A DIRECTION ON WHAT IT EMITS - asked by giving one a velocity and
 * looking at what came back on the rays.
 */
const vectorValued = (
  lab: Lab, name: string,
): { length: number; example: unknown } | undefined => {
  const small = GEOMETRIES["cubic-6"];
  const M = 7;
  const world = new World({ theory: lab.theory, geometry: small, N: M,
    seed: lab.seeds[0], boundary: "absorb" });
  /* a source that is going somewhere, since a label carrying a velocity is nothing
   * at all on one that is standing still */
  world.add({ at: middle(small, M), radius: 0, absorbs: false, emits: 1, duty: 1,
    u: [1, 0, 0] });
  const rule = lab.theory.rules.EMISSION;
  const home = (world.locals as any[]).find(l => l.source);
  if (!home || !rule) return undefined;
  rule.exec(home);
  for (const r of home.rays as any[]) {
    const v = (r as any)[name];
    if (Array.isArray(v) && v.length > 1) return { length: v.length, example: v };
  }
  return undefined;
};

export const carried: Probe = {
  id: "carried/what-a-ray-keeps",
  asks: "of everything this theory's rays carry: is it kept while the medium carries it, " +
    "and how does a source lay it out over its exits?",
  run: (lab: Lab): Probing => {
    const measured: Measured[] = [];
    const facts: Emitted[] = [];
    const found: string[] = [];

    const carries = (lab.theory.carrying ?? []) as { name: string; absent: unknown }[];
    if (!carries.length) return {
      facts, measured, holds: false,
      found: `${lab.theory.name}'s rays carry nothing but themselves, so there is no ` +
        `label here to be conserved and nothing a source could lay out`,
    };

    const g: Geometry = lab.geometry;
    const { theory, removed, kept } = transportOnly(lab.theory);
    if (!kept.length) return {
      facts, measured, holds: false,
      found: `${lab.theory.name} has no transport rule, so nothing carries anything`,
    };

    /* ---- is each of them kept in flight --------------------------------------- */
    /*
     * WRAPPED, so nothing leaves: an absorbing edge takes rays out of the world, and a
     * tally that changed because rays walked off the side would be a fact about the
     * boundary rather than about the rule.
     */
    const N = Math.min(lab.boxFor(g), g.D === 1 ? 41 : g.D === 2 ? 21 : 9);

    for (const c of carries) {
      const w = new World({ theory, geometry: g, N, seed: lab.seeds[0], boundary: "wrap" });

      /*
       * LIT DETERMINISTICALLY AND DELIBERATELY UNBALANCED. Every seventh ray - seven is
       * coprime with every DEG here, so the lit rays do not line up with one exit
       * direction - and the values cycle through three, two of one for every one of the
       * other. The imbalance matters: a tally that starts even would be preserved by a
       * rule that destroyed every label it touched, and the check would pass by being
       * unable to fail.
       */
      let lit = 0, i = 0;
      for (const l of w.locals as any[])
        for (const r of l.rays as any[])
          if (i++ % 7 === 0) {
            r.active = true;
            (r as any)[c.name] = (lit++ % 3 === 2 ? -1 : 1);
          }

      const before = tally(w, c.name), beforeNet = net(w, c.name);
      const ticks = 6;
      w.run(ticks);
      const after = tally(w, c.name), afterNet = net(w, c.name);
      const kept_ = before === after;

      measured.push(measure(`${c.name}, carried`, beforeNet ?? lit,
        `${lit} rays lit carrying ${c.name}, two of one value for every one of the other ` +
        `so that there is an imbalance to lose. After ${ticks} ticks of ` +
        `${kept.join(" and ")} alone on ${g.name}, box ${N}, wrapped: the tally is ` +
        `${kept_ ? "unchanged" : `${before} before, ${after} after`}` +
        (beforeNet !== undefined ? `, net ${beforeNet} then ${afterNet}` : "")));

      if (!kept_) {
        found.push(`${c.name}: NOT kept - ${before} became ${after}`);
        continue;
      }

      facts.push({
        fact: { kind: "conserved", of: carriedAs(c.name) },
        from: [], measured: [measured[measured.length - 1]],
        because: `run with ${kept.join(" and ")} and nothing else, the multiset of what ` +
          `the rays are carrying as ${c.name} is exactly what it was ${ticks} ticks ` +
          `earlier. Transport writes each ray's contents onto one neighbour and swaps ` +
          `them in, and ${c.name} is part of what a ray carries - so it is moved and ` +
          `neither made nor unmade. Compared as a MULTISET rather than as a sum, so a ` +
          `rule that swapped two rays' labels would be caught rather than counted as ` +
          `conservative. This holds at every shell at once and for every run length, ` +
          `because it is a property of the rule. Set aside to ask it: ${removed.join(", ")}`,
        line: `${carriedAs(c.name)} is conserved in flight`,
      });
      found.push(`${c.name}: kept exactly` +
        (beforeNet !== undefined ? ` (net ${beforeNet}, unmoved)` : ""));
    }

    /* ---- how a source lays each of them out ----------------------------------- */
    /*
     * THE EMISSION RULE IS RUN, NOT READ. What a source writes on its exits is a line of
     * the theory, and the way to know what a line of the theory does is to hand it a real
     * source and look at the rays afterwards.
     */
    const layout = (name: string, axis?: number[]) => {
      const small = GEOMETRIES["cubic-6"];
      const M = 7;
      const world = new World({ theory: lab.theory, geometry: small, N: M,
        seed: lab.seeds[0], boundary: "absorb" });
      world.add({ at: middle(small, M), radius: 0, absorbs: false, emits: 1, duty: 1,
        ...(axis ? { axis } : {}) });
      const rule = lab.theory.rules.EMISSION;
      const home = (world.locals as any[]).find(l => l.source);
      if (!home || !rule) return undefined;
      rule.exec(home);
      let plus = 0, minus = 0, none = 0;
      for (const r of home.rays as any[]) {
        const v = (r as any)[name];
        if (!r.active || typeof v !== "number" || v === 0) { none++; continue; }
        if (v > 0) plus++; else minus++;
      }
      return { plus, minus, none, DEG: (home.rays as any[]).length };
    };

    for (const c of carries) {
      /*
       * A LABEL THAT IS A DIRECTION IS NOT A SIGN, AND SAYING SO IS THE POINT.
       *
       * `G^LABELLED` carries the emitter's velocity on every ray - its own comment calls
       * that the whole of what makes a B field. Counted for pluses and minuses it looks
       * like a quantity a source writes nothing signed of, which is exactly backwards: it
       * is a VECTOR, and being a vector is the property that matters. A ray already has
       * one direction by construction - it sits at an exit, and U[d] is its unit vector -
       * so a ray with a velocity label has two, and two directions are what a cross
       * product needs.
       */
      const vectorish = vectorValued(lab, c.name);
      if (vectorish) {
        measured.push(measure(`${c.name}, as a direction`, vectorish.length,
          `a source's rays came back carrying ${c.name} = ` +
          `${JSON.stringify(vectorish.example)}, which is a ${vectorish.length}-component ` +
          `direction rather than a number. A ray already has a heading - it sits at an ` +
          `exit - so this is a SECOND direction on the same ray`));
        facts.push({
          fact: { kind: "vector", of: carriedAs(c.name) },
          from: [], measured: [measured[measured.length - 1]],
          because: `${lab.theory.name}'s rays carry ${c.name} as a ` +
            `${vectorish.length}-component direction, read off a source that was given a ` +
            `velocity - the emitter's own motion, put on every ray it lights. A ray ` +
            `already carries a heading by sitting at an exit, so a ray in this theory ` +
            `carries two directions, and a pair of directions is what a cross product is ` +
            `built from. In a theory carrying only a sign and a heading there is no ` +
            `second direction and no local pseudovector to be had, which is why the ` +
            `perpendicular force is structurally absent there rather than merely small`,
          line: `${carriedAs(c.name)} is a direction`,
        });
        found.push(`${c.name}: a direction, not a sign`);
        continue;
      }

      const round = layout(c.name);
      const axial = layout(c.name, [0, 0, 1]);
      if (!round || !axial) continue;
      if (round.plus + round.minus === 0 && axial.plus + axial.minus === 0) {
        found.push(`${c.name}: a source writes no signed value of it`);
        continue;
      }

      measured.push(measure(`${c.name} over the exits of a round source`,
        round.plus - round.minus,
        `handed to ${lab.theory.name}'s own EMISSION rule, a source with no axis wrote a ` +
        `positive ${c.name} on ${round.plus} of its ${round.DEG} exits, a negative one ` +
        `on ${round.minus}, and none on ${round.none}`));
      measured.push(measure(`${c.name} over the exits of an axial source`,
        axial.plus - axial.minus,
        `the same rule handed a source WITH an axis wrote positive on ${axial.plus} ` +
        `exits, negative on ${axial.minus}, and none on ${axial.none} - those last being ` +
        `the equator, where an exit lies along neither side of the axis`));

      /*
       * A ROUND SOURCE THAT WROTE THE SAME VALUE ON EVERY EXIT HAS MEASURED AN ISOTROPY,
       * and it must say so or nothing downstream can use any of this.
       *
       * The dilution argument needs two premises and this probe was supplying one. That
       * something is conserved says it is not lost on the way out; that it goes every way
       * alike is what says to divide by the WHOLE shell rather than by part of it, and
       * without it a conserved quantity just sits in the store with no law about it. Here
       * it is not an assumption: the emission rule was handed a source with no axis and
       * wrote the same value on every exit it lit, counted.
       */
      if (round.plus === round.DEG || round.minus === round.DEG) facts.push({
        fact: { kind: "isotropic", of: carriedAs(c.name) },
        from: [], measured: [measured[measured.length - 2]],
        because: `handed a source with no axis, ${lab.theory.name}'s own EMISSION rule ` +
          `wrote the same value of ${c.name} on every one of its ${round.DEG} exits - not ` +
          `most of them, all of them. So what a round source puts out goes every way ` +
          `alike, which is what says a share is the whole of it over the WHOLE shell ` +
          `rather than over some part of it`,
        line: `${carriedAs(c.name)} goes every way alike`,
      });

      /*
       * AND THERE IS SOME OF IT, which a falloff law needs said or it is a law about a
       * possible nothing. The net is counted, not assumed: the rule wrote this sign on
       * that many exits.
       */
      if (round.plus - round.minus !== 0) facts.push({
        fact: { kind: "positive", of: carriedAs(c.name) },
        from: [], measured: [measured[measured.length - 2]],
        because: `a round source put out a net of ${Math.abs(round.plus - round.minus)} ` +
          `of it, counted off ${lab.theory.name}'s own emission rule. So there IS some, ` +
          `and a law about how it thins is a law about something rather than about a ` +
          `quantity that might be nought`,
        line: `${carriedAs(c.name)} > 0`,
      });

      if (round.plus - round.minus !== 0) facts.push({
        fact: { kind: "value", of: netOf(c.name), equals: rat(round.plus - round.minus) },
        from: [], measured: [measured[measured.length - 2]],
        because: `a source with no axis was handed ${lab.theory.name}'s own EMISSION ` +
          `rule and wrote the same sign of ${c.name} on every exit it lit: ` +
          `${round.plus} of them, net ${round.plus - round.minus}. So a round source has ` +
          `a NET of it - counted off the rule rather than assumed of it - and something ` +
          `conserved in flight with a net is what a monopole field is made of`,
        line: `${netOf(c.name)} = ${round.plus - round.minus}`,
      });

      if (axial.plus === axial.minus) facts.push({
        fact: { kind: "value", of: axialNetOf(c.name), equals: rat(0) },
        from: [], measured: [measured[measured.length - 1]],
        because: `handed a source WITH an axis, the same rule wrote positive on ` +
          `${axial.plus} exits and negative on ${axial.minus} - equal counts, so they ` +
          `cancel exactly and the net is nought. That is a dipole: no monopole term at ` +
          `all, not a small one. The ${axial.none} exits it wrote nothing on lie along ` +
          `neither side of the axis. The whole difference between this and the round ` +
          `case is one line of the emission rule, and it is the difference between a ` +
          `charge and a magnet`,
        line: `${axialNetOf(c.name)} = 0`,
      });
      found.push(`${c.name}: a round source nets ${round.plus - round.minus}, ` +
        `an axial one nets ${axial.plus - axial.minus}`);
    }

    return {
      facts, measured, holds: facts.length > 0,
      found: `${lab.theory.name}'s rays carry ${carries.map(c => c.name).join(", ")} - ` +
        found.join("; "),
    };
  },
};
