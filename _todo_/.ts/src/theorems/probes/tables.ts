/**
 * WHAT EVERY RULE DOES, IN EVERY STATE IT CAN BE HANDED - the whole table, not one entry.
 *
 * `meeting/what-the-halves-do` asks one rule one question, because the theorem above it
 * wanted one number. That is the right shape for a theorem somebody wrote and the wrong
 * shape for discovery: the question was chosen, so the answer could only ever be about
 * what was chosen. This asks the same rules everything they can be asked and hands back
 * the whole table, which is where a quantity nobody had a name for gets to appear.
 *
 * EXACT, AND THEREFORE THE BEST KIND OF PREMISE HERE. A rule over a facing pair has a
 * finite number of states and they are all visited - four where a ray carries a sign, one
 * where it does not. Nothing is sampled, nothing is averaged, no run length or box could
 * change any of it, and every number that comes out is an integer count of cases. A
 * candidate standing entirely on this probe cannot have been fitted.
 *
 * AND THE NAMES ARE THE SAME IN EVERY THEORY, which is what makes the table useful for
 * telling theories apart. `pair states` and `pair leaves something` mean the same question
 * under G as under G^XOR, so the two answers are comparable - and they differ, which is
 * exactly the kind of difference the discovery sweep exists to surface. Naming these after
 * the rule that produced them would have made every theory's answers incomparable with
 * every other's.
 */
import { GEOMETRIES, outward } from "../../lib/Local.ts";
import { World } from "../../lib/Compat.ts";
import { Rule as TheoryRule } from "../../lib/Theory.ts";
import { rat } from "../Algebra.ts";
import { Lab, Probe, Probing, measure } from "../Probe.ts";
import { Emitted, Measured } from "../Kernel.ts";

/** how many states a facing pair can be handed to a rule in */
export const PAIR_STATES = "pair states";
/** how many of them leave something behind */
export const PAIR_LEAVES = "pair leaves something";
/** how many of them leave nothing at all */
export const PAIR_EMPTIES = "pair leaves nothing";
/** how many of them change a sign rather than removing anything */
export const PAIR_FLIPS = "pair flips a sign";
/** how many of them actually destroy - what the world's own ledger recorded */
export const PAIR_DESTROYS = "pair destroys";
/** the fraction that leave something - the same question `occupancy` asks, asked wider */
export const PAIR_SURVIVAL = "pair survival";

/** every rule this theory has between two facing ends */
const binary = (theory: any): [string, TheoryRule][] =>
  Object.entries(theory.rules as Record<string, TheoryRule>).filter(([, r]) => {
    const t = r.type as unknown;
    return Array.isArray(t) && t.length === 2 && t.every(x => x === "Boundary");
  });

/** a facing pair somewhere in the middle of a small world - see `meeting.ts` */
const facing = (w: World) => {
  const all = w.locals as any[];
  const l = all[Math.floor(all.length / 2)];
  for (const r of l.rays as any[]) {
    const o = outward(r);
    if (o?.target) return [o, o.target] as const;
  }
  return undefined;
};

export const tables: Probe = {
  id: "tables/what-every-rule-does",
  asks: "handed every state it can be handed, what does each of this theory's rules " +
    "between two facing ends actually do?",
  run: (lab: Lab): Probing => {
    const measured: Measured[] = [];
    const facts: Emitted[] = [];

    const rules = binary(lab.theory);
    if (!rules.length) return {
      facts, measured, holds: false,
      found: `${lab.theory.name} has no rule between two facing ends, so there is no ` +
        `table here to enumerate`,
    };

    /* the smallest world with an interior - it exists only to supply a real pair */
    const g = GEOMETRIES["cubic-6"];
    const signs: (number | undefined)[] = lab.theory.polarised ? [-1, 1] : [undefined];

    let states = 0, left = 0, empty = 0, flipped = 0, destroyed = 0;
    const rows: string[] = [];

    for (const [name, rule] of rules)
      for (const a of signs) for (const b of signs) {
        /* a fresh world per state, so one case cannot colour the next */
        const w = new World({ theory: lab.theory, geometry: g, N: 5, seed: 1,
          boundary: "wrap" });
        const pair = facing(w);
        if (!pair) continue;
        const [x, y] = pair;
        for (const end of [x.source, y.source]) {
          end.active = true;
          end.polarity = undefined;
        }
        x.source.polarity = a;
        y.source.polarity = b;
        const before = (w.destroyed as number[]).reduce((s, n) => s + n, 0);
        rule.exec(x, y);
        const after = (w.destroyed as number[]).reduce((s, n) => s + n, 0);

        const standing = (x.source.active ? 1 : 0) + (y.source.active ? 1 : 0);
        const turned = x.source.polarity !== a || y.source.polarity !== b;
        states++;
        if (standing > 0) left++; else empty++;
        if (turned && standing > 0) flipped++;
        if (after > before) destroyed++;
        rows.push(`${name}: ${a ?? "neutral"} against ${b ?? "neutral"} leaves ` +
          `${standing} of 2${turned ? ", with a sign changed" : ""}` +
          `${after > before ? `, and the ledger recorded ${after - before} destroyed` : ""}`);
      }

    if (!states) return {
      facts, measured, holds: false,
      found: "no facing pair could be built to hand a rule, so no table could be taken",
    };

    const each: [string, number, string][] = [
      [PAIR_STATES, states, `every state every facing-pair rule of ${lab.theory.name} ` +
        `can be handed - ${rules.map(([n]) => n).join(", ")} over ` +
        `${lab.theory.polarised ? "a sign each" : "no sign at all"}. Enumerated, ` +
        `not sampled, so no run could change it`],
      [PAIR_LEAVES, left, `states that leave something standing: ${rows.join("; ")}`],
      [PAIR_EMPTIES, empty, `states that leave nothing at all - ${empty} of ${states}`],
      [PAIR_FLIPS, flipped, `states that change a sign rather than removing anything - ` +
        `${flipped} of ${states}, which is what a turn IS in a theory whose rays carry ` +
        `a sign`],
      [PAIR_DESTROYS, destroyed, `states in which the world's own ledger recorded a ` +
        `destruction - ${destroyed} of ${states}. NOT the same count as the states that ` +
        `leave nothing: a rule can clear an end without the ledger calling it a ` +
        `destruction, and where those two numbers differ the difference is worth reading`],
    ];

    for (const [q, v, why] of each) {
      measured.push(measure(q, v, why));
      facts.push({
        fact: { kind: "value", of: q, equals: rat(v) },
        from: [], measured: [measured[measured.length - 1]],
        because: why, line: `${q} = ${v}`,
      });
    }

    /*
     * AND THE FRACTION, because a count of cases is only meaningful against how many
     * cases there were - four surviving states means one thing out of four and another
     * out of sixteen.
     */
    facts.push({
      fact: { kind: "quotient", of: PAIR_SURVIVAL, over: PAIR_LEAVES, under: PAIR_STATES },
      from: [], measured: [measured[0], measured[1]],
      because: `the states a facing pair can be in are equally available, so how much of ` +
        `what meets survives meeting is how many states leave something standing over ` +
        `how many states there are`,
      line: `${PAIR_SURVIVAL} = \\frac{${PAIR_LEAVES}}{${PAIR_STATES}}`,
    });

    return {
      facts, measured, holds: true,
      found: `${rules.length} rule${rules.length > 1 ? "s" : ""} over ${states} states: ` +
        `${left} leave something, ${empty} leave nothing, ${flipped} change a sign, ` +
        `${destroyed} are recorded as destroying`,
    };
  },
};
