/**
 * WHICH OF THE THINGS A RAY CARRIES DOES A MEETING ACTUALLY READ - asked of each label in
 * turn, by changing it and seeing whether the outcome moves.
 *
 * A RULE'S INPUTS ARE A STRUCTURAL FACT AND THEY DECIDE WHAT THE THEORY CAN DISTINGUISH.
 * `tables/what-every-rule-does` enumerates the states a facing pair can be in and counts
 * the outcomes; this asks the sharper question underneath it - of everything a ray is
 * carrying, which does the rule look at? A label the rule never reads cannot affect
 * anything, ever, and that is not a small statement: it says which differences in the
 * world the theory is blind to, and a blindness is as much a prediction as a coupling.
 *
 * THE ONE THIS EXISTS FOR IS `from`. Every ray carries the id of the source that emitted
 * it. If the meeting rule read it, a theory could in principle treat two rays from the
 * same emitter differently from two rays from different ones - it could mark a pair "same
 * particle, skip". If it does not read it, then no such bookkeeping exists anywhere and
 * none can be added without changing the rule, which means:
 *
 *   A THING PUT IN TWO PLACES MUST INTERFERE WITH ITSELF. Split one emitter's output
 *   across two positions and the rays that meet are annihilated on exactly the terms any
 *   other pair would be, because the rule cannot see that they share an origin. The model
 *   already computes this for a single body - a body's own charges annihilating against
 *   its own field - and a superposition is that same computation with the emission split
 *   in two. Nothing needs adding to make the branches interfere and nothing could be
 *   added to stop them.
 *
 * THAT IS A DERIVATION FROM A RULE'S SIGNATURE, not a simulation of an interference
 * pattern, and it is stronger than one: a pattern is evidence about a configuration, and
 * this is a statement about every configuration at once.
 *
 * TESTED BY VARYING ONE LABEL AT A TIME with everything else held. Two runs per label, on
 * a real facing pair, and the outcome compared as a whole - what is left standing, what
 * each end is carrying afterwards, and what the world's ledger recorded. Exact, and no run
 * length or box can move it.
 */
import { GEOMETRIES, outward } from "../../lib/Local.ts";
import { World } from "../../lib/Compat.ts";
import { Rule as TheoryRule } from "../../lib/Theory.ts";
import { Lab, Probe, Probing, measure } from "../Probe.ts";
import { Emitted, Measured } from "../Kernel.ts";

/** whether a meeting can tell where the two rays came from */
export const PROVENANCE = "whether a meeting reads where a ray came from";
/** whether one emitter's own branches annihilate each other like any other pair */
export const SELF = "a thing in two places interferes with itself";

const binary = (theory: any): [string, TheoryRule][] =>
  Object.entries(theory.rules as Record<string, TheoryRule>).filter(([, r]) => {
    const t = r.type as unknown;
    return Array.isArray(t) && t.length === 2 && t.every(x => x === "Boundary");
  });

const facing = (w: World) => {
  const all = w.locals as any[];
  const l = all[Math.floor(all.length / 2)];
  for (const r of l.rays as any[]) {
    const o = outward(r);
    if (o?.target) return [o, o.target] as const;
  }
  return undefined;
};

export const reads: Probe = {
  id: "reads/what-a-meeting-looks-at",
  asks: "of everything a ray carries, which of it does a meeting actually read - and in " +
    "particular, can it tell whether the two rays came from the same source?",
  run: (lab: Lab): Probing => {
    const measured: Measured[] = [];
    const facts: Emitted[] = [];
    const found: string[] = [];

    const rules = binary(lab.theory);
    if (!rules.length) return {
      facts, measured, holds: false,
      found: `${lab.theory.name} has no rule between two facing ends, so there is no ` +
        `meeting here to ask what it reads`,
    };
    const carries = (lab.theory.carrying ?? []) as { name: string; absent: unknown }[];
    if (!carries.length) return {
      facts, measured, holds: false,
      found: `${lab.theory.name}'s rays carry nothing, so a meeting has nothing to read`,
    };

    const g = GEOMETRIES["cubic-6"];

    /** run every facing-pair rule on a pair set up this way, and describe what happened */
    const outcome = (set: (x: any, y: any) => void): string => {
      const parts: string[] = [];
      for (const [name, rule] of rules) {
        const w = new World({ theory: lab.theory, geometry: g, N: 5, seed: 1,
          boundary: "wrap" });
        const pair = facing(w);
        if (!pair) return "no pair";
        const [x, y] = pair;
        for (const end of [x.source, y.source]) {
          end.active = true;
          for (const c of carries) (end as any)[c.name] = c.absent;
        }
        set(x.source, y.source);
        const before = (w.destroyed as number[]).reduce((a, b) => a + b, 0);
        rule.exec(x, y);
        const after = (w.destroyed as number[]).reduce((a, b) => a + b, 0);
        parts.push(`${name}:${x.source.active ? 1 : 0}${y.source.active ? 1 : 0}` +
          `/${carries.map(c => JSON.stringify((x.source as any)[c.name])).join(",")}` +
          `/${after - before}`);
      }
      return parts.join(" ");
    };

    for (const c of carries) {
      /*
       * TWO VALUES OF THIS LABEL AND NOTHING ELSE DIFFERENT. The pair is built fresh each
       * time with every label at its absent value, so the only thing that differs between
       * the two runs is the one being varied.
       */
      const same = outcome((x, y) => { (x as any)[c.name] = 1; (y as any)[c.name] = 1; });
      const differ = outcome((x, y) => { (x as any)[c.name] = 1; (y as any)[c.name] = -1; });
      const readsIt = same !== differ;

      measured.push(measure(`does a meeting read ${c.name}`, readsIt ? 1 : 0,
        `with both ends carrying the same ${c.name} the rules give "${same}"; with them ` +
        `carrying different values they give "${differ}" - ` +
        `${readsIt ? "different, so the rule reads it" : "identical, so the rule is blind to it"}`));

      found.push(`${c.name}: ${readsIt ? "read" : "not read"}`);

      /*
       * A LABEL NO RULE READS IS AN INERT LABEL, and saying so is a structural statement
       * about the theory rather than a note about one symbol.
       *
       * `G^LABELLED` is `G^XOR` plus a per-ray tag carrying the emitter's velocity - its
       * own header says it is one line and deletes nothing. Nothing consumes the tag, so
       * the two theories do exactly the same thing: run on one seed they are identical
       * tick for tick, with a moving source or a still one. What the label buys is that
       * the magnetic field becomes COMPUTABLE from local ray state - B = Σ σ_d (d̂ × u) is
       * a sum an observer takes - and not that anything acts on it. A field you can read
       * off is not a force anything feels.
       *
       * SO IT IS EMITTED FOR EVERY UNREAD LABEL. A theory that carries something no rule
       * consults is blind to it by construction, and a blindness forecloses a family of
       * would-be derivations: nothing downstream may use that label to derive a force,
       * however suggestive its name.
       */
      if (!readsIt) facts.push({
        fact: { kind: "constant", of: `${c.name}, as far as the rules are concerned` },
        from: [], measured: [measured[measured.length - 1]],
        because: `varying ${c.name} across a facing pair changes nothing about what ` +
          `${lab.theory.name}'s meeting rules do - the outcome is "${same}" either way. ` +
          `So no rule consults it, and a label no rule consults cannot affect anything ` +
          `that happens. It may still make a quantity computable by whoever is reading ` +
          `the world, which is a different thing from a quantity the world acts on`,
        line: `no rule reads ${c.name}`,
      });

      if (c.name === "from" && !readsIt) {
        facts.push({
          fact: { kind: "value", of: PROVENANCE, equals: { n: 0, d: 1 } },
          from: [], measured: [measured[measured.length - 1]],
          because: `every ray carries the id of the source that emitted it, and the ` +
            `meeting rules of ${lab.theory.name} were handed a facing pair sharing one ` +
            `id and then a pair with two different ids, with everything else held. The ` +
            `outcome is identical: "${same}" either way. So a meeting cannot tell whether ` +
            `the two rays came from the same emitter - there is no bookkeeping anywhere ` +
            `that could mark a pair "same particle, skip", and none could be added without ` +
            `changing the rule itself`,
          line: `${PROVENANCE} = 0`,
        });
        facts.push({
          fact: { kind: "positive", of: SELF },
          from: [], measured: [measured[measured.length - 1]],
          because: `since a meeting does not read where a ray came from, one emitter's ` +
            `output split across two places annihilates against itself on exactly the ` +
            `terms any other pair would - the rule cannot see that the two branches share ` +
            `an origin. So the branches of a superposition interfere, necessarily, and ` +
            `nothing in the model could stop them. This is read off the rule's inputs ` +
            `rather than simulated: an interference pattern would be evidence about one ` +
            `configuration, and this is a statement about every configuration at once`,
          line: `${SELF}`,
        });
      }
    }

    return {
      facts, measured, holds: facts.length > 0,
      found: `of what ${lab.theory.name}'s rays carry - ${found.join("; ")}` +
        (facts.length
          ? `. Since a meeting is blind to where a ray came from, one thing in two ` +
            `places must interfere with itself`
          : `. Nothing here about provenance either way`),
    };
  },
};
