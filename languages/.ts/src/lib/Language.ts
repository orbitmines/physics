/**
 * THE LANGUAGE A RULE IS WRITTEN IN — every part of it, with no host code anywhere inside a
 * rule, so that what a rule DOES and what its continuous term IS are one thing counted twice.
 *
 * THIS HAS BEEN GOT WRONG THREE TIMES AND EACH TIME THE SAME WAY. First the equation was
 * written out as a string beside the theory. Then each rule declared its own term next to its
 * body. Then the gates were made into values and the BODY stayed a closure with `makes` and a
 * rate written beside it. Then the body was split into effects and each effect declared
 * `changes: { population: -2 }` beside its own `run`. Every one of those is the same fault:
 * TWO DESCRIPTIONS OF ONE THING, free to disagree, with nothing anywhere able to tell.
 *
 * THERE IS ONE DESCRIPTION HERE. A rule is an expression in this language. Compiling it gives
 * the function a tick runs; COUNTING it gives the continuous term. Neither is written down —
 * both are computed from the same tree, so a body edited to destroy where it used to create
 * changes its term in the same keystroke.
 *
 * THE ATOMS, AND WHY THEIR ARITHMETIC IS NOT A SECOND DESCRIPTION. Five things change the
 * world here: `light` puts a ray out on an exit, `douse` puts one out, `unfold` hands back a
 * point of space, `fold` destroys one, `grow` makes one at the frontier. Their arithmetic is
 * not an opinion ABOUT them, it is what the words mean — dousing a ray removes a ray, and
 * there is no version of `douse` that does not. That is where a language bottoms out, and it
 * is the same place `Rewrite.fold` bottoms out.
 *
 * AND EVERYTHING ELSE IS COMPOSED, SO EVERYTHING ELSE IS COUNTED. `(G/2)` is not declared to
 * make DEG rays: it is `unfold` and then `light` on every exit there is, and `each` MULTIPLIES
 * what its body does by how many there are — so `+DEG` falls out of the loop. `(G/1)` is not
 * declared to remove two: it douses one ray and then another, and the counting adds them.
 *
 * PURE OPERATORS ARE NOT AN ESCAPE HATCH, and this is the one boundary worth being exact
 * about. An operator that only COMPUTES A VALUE — `across`, `dot`, `opposite`, whether a
 * source is firing this tick — cannot change what a rule does to the population, whatever it
 * is implemented as, because it changes nothing at all. It is a leaf of the language in the
 * same way `+` is. Anything that touches the world is an atom above, and there are five.
 */
import { Backend } from "./Backend.ts";
import { across as goesTo, busy as anyOn, opposite as otherEnd } from "./Local.ts";

/* —— what a piece of the language does to what there is ——————————————————— */

/**
 * THE TWO LEDGERS, BECAUSE THIS MODEL HAS TWO THINGS.
 *
 * `rays` is the population: what streams, what meets, what a density is a density OF. `space`
 * is points: what a fold destroys and an unfold hands back, and the shortfall in which IS
 * gravity here. A rule that makes rays and a rule that makes space are not the same rule and
 * must not come out as the same term.
 *
 * COUNTS ARE SYMBOLIC WHERE THEY ARE COUNTS OF THE LATTICE. `light` on every exit of a point
 * is `DEG` rays, and writing 12 in here would be writing fcc-12 into the theory.
 */
export type Count = { n: number; of: Record<string, number> };

export const ZERO: Count = { n: 0, of: {} };
export const count = (n = 0, of: Record<string, number> = {}): Count => ({ n, of });
export const plus = (a: Count, b: Count): Count => {
  const of = { ...a.of };
  for (const [k, v] of Object.entries(b.of)) of[k] = (of[k] ?? 0) + v;
  return { n: a.n + b.n, of };
};
export const times = (c: Count, by: string | number): Count => {
  if (typeof by === "number") return { n: c.n * by, of: Object.fromEntries(
    Object.entries(c.of).map(([k, v]) => [k, v * by])) };
  /* multiplied by a count of the lattice: `n` of them becomes `n` lots of that count */
  const of: Record<string, number> = {};
  for (const [k, v] of Object.entries(c.of)) of[`${by}·${k}`] = v;
  if (c.n) of[by] = (of[by] ?? 0) + c.n;
  return { n: 0, of };
};
export const showCount = (c: Count): string => {
  const parts = Object.entries(c.of)
    .filter(([, v]) => v !== 0)
    .map(([k, v]) => `${v === 1 ? "" : v === -1 ? "-" : `${v}`}${k}`);
  if (c.n || !parts.length) parts.unshift(`${c.n}`);
  return parts.join(" + ").replace(/\+ -/g, "- ");
};

/** what a piece of the language does, added up over everything it can reach */
export type Doing = {
  /** rays put out on exits (+) or put out of existence (−) */
  rays: Count;
  /** points of space handed back (+) or destroyed (−) */
  space: Count;
  /** the population is carried from place to place rather than changed — transport */
  carries: boolean;
  /** the tick's own exchange: what was arriving becomes what is here */
  settles: boolean;
  /** WHICH carrying things this had to find before it would do anything - see `Term.needs` */
  needs: string[];
  /** done by something outside the model, so its term is `Sigma` and not the medium's */
  outside?: boolean;
};

export const NOTHING: Doing =
  { rays: ZERO, space: ZERO, carries: false, settles: false, needs: [] };

const both = (a: Doing, b: Doing): Doing => ({
  rays: plus(a.rays, b.rays), space: plus(a.space, b.space),
  carries: a.carries || b.carries, settles: a.settles || b.settles,
  needs: [...new Set([...a.needs, ...b.needs])],
});

const repeated = (d: Doing, by: string | number): Doing => ({
  rays: times(d.rays, by), space: times(d.space, by),
  carries: d.carries, settles: d.settles, needs: d.needs,
});

/* —— the tree ————————————————————————————————————————————————————————————— */

/** where a value comes from at run time: the refs the match handed over, and what is bound */
export type Env = { at: any[]; in: any[] };

/**
 * A VALUE OF THE LANGUAGE — a ref, a number, a truth, a list.
 *
 * It has a `read` because a tick needs one and a `says` because a page does. It has NO
 * arithmetic on the two ledgers, and that is not an omission: an expression that only computes
 * cannot change what a rule does to the world, so it contributes nothing to the term BY
 * CONSTRUCTION rather than by being declared to.
 */
export type Term = {
  read: (e: Env) => any;
  says: string;
  /**
   * HOW MANY POPULATION-BEARING THINGS THIS CONDITION REQUIRES TO BE CARRYING.
   *
   * WHICH IS WHERE THE DEGREE OF A BRANCH COMES FROM. `lit(x)` requires one ray; a condition
   * that requires the ray AND the one facing it requires two, and a body that only fires when
   * two rays are lit is a body about a MEETING however it happens to be walked. So the
   * quadratic term and its facing factor fall out of what the code asks for, rather than out
   * of a quantifier that had to be trusted to match.
   *
   * NAMED RATHER THAN COUNTED, because asking the same ray twice is asking for one ray. The
   * streaming branch sits inside `when(lit(it))` and asks `lit(it)` again before handing over;
   * counted, that made transport quadratic and gave it a facing factor, which is a meeting's
   * shape on a rule that meets nothing. What a branch needs is the SET of things it needs.
   */
  needs?: string[];
};

const term = (says: string, read: (e: Env) => any, needs: string[] = []): Term =>
  ({ read, says, needs });

/** the refs the match handed over - `it` for a rule about one thing, `a`/`b` for a pair */
export const arg = (i: number, says: string): Term =>
  term(says, e => e.at[i]);

/** a value bound by `each` or by `let` */
const bound = (slot: number, says: string): Term =>
  term(says, e => e.in[slot]);

export const value = (v: any): Term => term(JSON.stringify(v) ?? String(v), () => v);

/**
 * A FIELD OF A REF, READ — and it answers nothing where there is nothing to read it off.
 *
 * A ray at the edge of the world has no neighbour and a point outside a body has no source, so
 * a chain of reads runs off the end constantly and that is a normal state rather than a fault.
 * Answering `undefined` is what the imperative code it replaces did with `?.`.
 */
export const of = (x: Term, field: string): Term =>
  term(`${x.says}.${field}`, e => x.read(e)?.[field]);

/**
 * A PURE OPERATOR — it computes a value and touches nothing.
 *
 * The leaves of the language, and provably term-neutral: whatever `across` is implemented as,
 * it cannot make or destroy a ray, so no rule's term can depend on how it is written. That is
 * what makes it safe for this to bottom out in a host function while the ATOMS below may not.
 */
export const op = (says: string, f: (...vs: any[]) => any, ...xs: Term[]): Term =>
  term(says, e => f(...xs.map(x => x.read(e))));

export const not = (x: Term): Term => op(`not ${x.says}`, (v: any) => !v, x);
export const and = (...xs: Term[]): Term =>
  term(xs.map(x => x.says).join(" and "), e => xs.every(x => x.read(e)),
    xs.flatMap(x => x.needs ?? []));
export const is = (x: Term, v: any): Term =>
  op(`${x.says} is ${v}`, (a: any) => a === v, x);
export const some = (x: Term): Term => op(`there is a ${x.says}`, (v: any) => !!v, x);

/* —— what a rule does ————————————————————————————————————————————————————— */

export type Act = {
  /** compiled once, when the rule is built - a tick runs this and never walks the tree */
  run: (e: Env) => void;
  /**
   * THE DISTINCT THINGS THIS CAN DO, counted off the same tree — one per branch, not one
   * per act.
   *
   * WHICH IS HOW ONE RULE COMES OUT AS TWO TERMS WHERE IT DOES TWO THINGS. MOVEMENT settles a
   * meeting and then carries what is left: those are different arithmetic under different
   * conditions, and an equation that added them would have one term that both destroys and
   * transports. Each branch is its own `Doing`, so each is its own term — and the meeting
   * branch, which asks for TWO lit rays, meets ANNIHILATION's on the way past and the two
   * become one because they ask for the same thing and do the same thing.
   */
  doing: Doing[];
  says: string;
};

const act = (says: string, doing: Doing[], run: (e: Env) => void): Act => ({ run, doing, says });
const one = (says: string, d: Doing, run: (e: Env) => void): Act => act(says, [d], run);

/* —— the five atoms ——————————————————————————————————————————————————————— */

/**
 * A RAY IS PUT OUT ON AN EXIT — one more of the population, by what the word means.
 */
export const light = (ray: Term): Act =>
  one(`light ${ray.says}`, { ...NOTHING, rays: count(1) },
    e => { ray.read(e).active = true; });

/**
 * AND A RAY IS PUT OUT — one fewer, and the slot cleared of everything it was carrying.
 *
 * Not the same as setting it inactive: a ray that has been annihilated is not a dark ray still
 * holding what it carried, so the whole slot goes back to what absence is.
 */
export const douse = (ray: Term): Act =>
  one(`douse ${ray.says}`, { ...NOTHING, rays: count(-1) }, e => {
    const r = ray.read(e);
    r.active = false;
    r.bounced = false;
    r.arriving = false;
    const carrying = (r.backend?.carrying ?? []) as any[];
    for (let i = 0; i < carrying.length; i++) carrying[i].write(r, carrying[i].absent);
  });

/** A POINT OF SPACE IS HANDED BACK - one more point than there was */
export const unfold = (point: Term): Act =>
  one(`unfold ${point.says}`, { ...NOTHING, space: count(1) },
    e => { point.read(e).unfold(); });

/** AND TWO POINTS BECOME ONE - one point of space destroyed, which is what gravity is here */
export const fold = (into: Term, point: Term): Act =>
  one(`fold ${point.says} into ${into.says}`, { ...NOTHING, space: count(-1) },
    e => { into.read(e).fold(point.read(e)); });

/**
 * THE WORLD MAKES THE ROOM A RAY NEEDS TO STEP INTO - one more point, at the frontier.
 *
 * Answers whether it managed: on a bounded world there is nowhere to grow and the ray has
 * stepped off the edge for good.
 */
export const grow = (end: Term): Act =>
  one(`grow past ${end.says}`, { ...NOTHING, space: count(1) },
    e => { end.read(e).backend.rewrite.grow(end.read(e)); });

/* —— and the ways of putting them together ————————————————————————————————— */

/** a field written - bookkeeping, and it changes neither ledger */
export const set = (x: Term, field: string, v: Term): Act =>
  one(`set ${x.says}.${field} to ${v.says}`, NOTHING,
    e => { x.read(e)[field] = v.read(e); });

/**
 * A LEDGER ADDED TO — a COUNT of what happened, which is not itself a happening.
 *
 * Neither ledger of the model moves: writing down that a meeting occurred does not destroy a
 * ray, and a rule whose whole body was this would have no term at all, correctly. It is how
 * `destroyed` — the deficit gravity is read off — is credited half to each end of the edge an
 * event happened on, and how the store's own tallies are kept.
 */
export const bump = (x: Term, field: string, by: number): Act =>
  one(`add ${by} to ${x.says}.${field}`, NOTHING,
    e => { const t = x.read(e); if (t) t[field] = (t[field] ?? 0) + by; });

/** the store's own tally of what its rules did - the same, reached through the backend */
export const tally = (x: Term, field: string): Act =>
  one(`count one more ${field}`, NOTHING, e => {
    const s = x.read(e)?.backend?.stats;
    if (s) s[field] = (s[field] ?? 0) + 1;
  });

/**
 * ONE AFTER ANOTHER — and the branches gather rather than adding up.
 *
 * TWO ACTS UNDER THE SAME CONDITION ARE ONE THING and their arithmetic adds: dousing a ray and
 * then dousing another is `-2`. Two acts under DIFFERENT conditions are two things and must
 * not be added, or a rule that destroys under one condition and carries under another comes
 * out as a single term that does both. So an unconditional run of acts is merged into one
 * branch, and anything a `when` guarded keeps its own.
 */
export const seq = (...acts: Act[]): Act => {
  if (acts.length === 1) return acts[0];
  const says = acts.map(a => a.says).join("; ");
  /* the unconditional ones are one branch between them; a guarded one is its own */
  let merged = NOTHING;
  const branches: Doing[] = [];
  for (const a of acts)
    for (const d of a.doing)
      if (d.needs.length) branches.push(d); else merged = both(merged, d);
  const doing = (merged.rays.n || Object.keys(merged.rays.of).length ||
    merged.space.n || Object.keys(merged.space.of).length ||
    merged.carries || merged.settles) ? [merged, ...branches] : branches;

  if (acts.length === 2) {
    const a = acts[0].run, b = acts[1].run;
    return act(says, doing, e => { a(e); b(e); });
  }
  const runs = acts.map(a => a.run);
  return act(says, doing, e => { for (let i = 0; i < runs.length; i++) runs[i](e); });
};

/**
 * ONLY WHERE SOMETHING HOLDS — and what it does is still counted.
 *
 * A branch that a firing MIGHT take is part of what the rule does: the term is what one firing
 * comes to, and a meeting that fires only when something faces it is still a meeting. What
 * decides how often is the quantifier and the gates, which is the other half of the reading
 * and is where the density and the facing factor come from.
 */
export const when = (cond: Term, ...acts: Act[]): Act => {
  const body = seq(...acts);
  const needs = cond.needs ?? [];
  return act(`when ${cond.says}: ${body.says}`,
    body.doing.map(d => ({ ...d, needs: [...new Set([...d.needs, ...needs])] })),
    e => { if (cond.read(e)) body.run(e); });
};

/** one way or the other - and both ways are things the rule can do, so both are branches */
export const either = (cond: Term, yes: Act, no: Act): Act =>
  act(`if ${cond.says}: ${yes.says}; otherwise ${no.says}`, [...yes.doing, ...no.doing],
    e => { if (cond.read(e)) yes.run(e); else no.run(e); });

let SLOTS = 0;

/**
 * ONCE FOR EVERY ONE OF THEM — and this is where a count of the lattice enters the equation.
 *
 * `each(exits(point), ...)` runs its body once per exit, so what the body does is MULTIPLIED
 * by how many exits there are, which is `DEG`. That is how (G/2) comes out as `+DEG` rays
 * without anybody writing DEG anywhere: it is a loop over the ways out of a point, counted.
 */
export const each = (
  over: Term & { many?: string | number }, body: (x: Term) => Act,
): Act => {
  const slot = SLOTS++;
  const inner = body(bound(slot, `each ${over.says}`));
  const many = over.many ?? 1;
  return act(`for every ${over.says}: ${inner.says}`,
    inner.doing.map(d => repeated(d, many)), e => {
    const xs = over.read(e);
    for (let i = 0; i < xs.length; i++) { e.in[slot] = xs[i]; inner.run(e); }
  });
};

/** a value named once and used more than once, rather than computed again */
export const let_ = (v: Term, body: (x: Term) => Act): Act => {
  const slot = SLOTS++;
  const inner = body(bound(slot, v.says));
  return act(`let ${v.says}: ${inner.says}`, inner.doing,
    e => { e.in[slot] = v.read(e); inner.run(e); });
};

/** a list, with how many of them there are where that is a count of the lattice */
export const list = (says: string, many: string | number, read: (e: Env) => any[]) =>
  Object.assign(term(says, read), { many });

/**
 * SOMETHING OUTSIDE THE MODEL REACHES IN — the one act whose body is not of this language, and
 * the one place that is not a hole in it.
 *
 * A SOURCE IS NOT MADE BY ANY RULE HERE. It is put into the box from outside, and what it does
 * is a question about the source rather than about the medium: the rules do not know what a
 * proton is and nothing in them should. So its term is `Sigma` — one term, however many acts
 * maintain it, and derived from being built this way rather than from anybody declaring it.
 *
 * WHICH IS WHY THE BODY BEING HOST CODE COSTS NOTHING HERE AND WOULD COST EVERYTHING ANYWHERE
 * ELSE. The continuous reading of a rule of the medium has to be counted, or it is a second
 * description that can drift. The continuous reading of THIS is `Sigma` whatever the body
 * does — that is what Sigma MEANS — so there is nothing for a body to drift away from. Every
 * other act in this file is composed and counted; this one says out loud that it is not part
 * of the model, and the reading takes it out of the rules on exactly that ground.
 */
export const putIn = (says: string, run: (e: Env) => void): Act =>
  one(says, { ...NOTHING, outside: true }, run);

/* —— the two that are about the whole world rather than about one match ————— */

/**
 * THE TICK ITSELF — what was arriving is now what is here, and nothing is arriving any more.
 *
 * NEITHER LEDGER MOVES: no ray is made and none is put out, the population is where it had
 * already been carried to. It is the exchange that makes every other rule a statement about
 * the same instant, which is why it reads as `d_t` and not as a term beside the others.
 */
export const settle = (world: Term): Act =>
  one("what was arriving is now what is here", { ...NOTHING, settles: true }, e => {
    const b = world.read(e).backend as Backend & Record<string, any>;
    b.swap("Ray", "active", "arriving");
    b.reset("Ray", "arriving");
    const carrying = (b as any).carrying;
    for (let i = 0; i < carrying.length; i++) {
      b.swap("Ray", carrying[i].name, carrying[i].waiting);
      b.reset("Ray", carrying[i].waiting);
    }
    b.reset("Ray", "bounced");
  });

/**
 * WHAT A RAY CARRIES GOES WITH IT — and what that is, is the theory's business.
 *
 * A ray's polarity, its label, the id of whatever emitted it: they are declared by whichever
 * theory added them and they all do the same thing when the ray steps. So this moves the
 * whole list, whatever the list turns out to be, and a theory that adds a quantity does not
 * have to come back and edit a rule. It carries the population; it neither makes nor destroys.
 */
export const handOver = (from: Term, to: Term): Act =>
  one(`what ${from.says} carries goes to ${to.says}`, { ...NOTHING, carries: true }, e => {
    const r = from.read(e), t = to.read(e);
    t.arriving = true;
    const carrying = r.backend.carrying;
    for (let i = 0; i < carrying.length; i++)
      carrying[i].writeWaiting(t, carrying[i].read(r));
  });

/** and the same where there is nowhere to go but the world can make somewhere */
export const waitForRoom = (ray: Term): Act =>
  one(`${ray.says} waits for the room it needs`, { ...NOTHING, carries: true, space: count(1) },
    e => {
      const r = ray.read(e);
      const from = r.bounced ? (r.backend.opposite?.(r) ?? r) : r;
      const end = from.boundaries?.[0];
      if (!end || !r.backend.rewrite.grow(end)) return;
      r.arriving = true;
      const carrying = r.backend.carrying;
      for (let i = 0; i < carrying.length; i++)
        carrying[i].writeWaiting(r, carrying[i].read(r));
    });

/* —— the vocabulary a rule reads the world with ————————————————————————————— */

/**
 * THE PURE OPERATORS OF `Local.ts`, AS TERMS — and every one of them only COMPUTES.
 *
 * `across` finds where a ray steps to; `opposite` finds the ray on the other exit; `busy`
 * asks whether anything is on a point. None of them can make or destroy a ray, whatever they
 * are implemented as, so no rule's term can depend on how they are written — which is what
 * makes it safe for these to be host functions while the five atoms above may not be.
 */

/** the ray a match is about, or the two ends of a facing pair */
export const it = arg(0, "the ray");
export const point = arg(0, "the point");
export const world = arg(0, "the world");
export const a = arg(0, "this end");
export const b = arg(1, "the facing end");

/** the ray at the far end of a boundary - what a facing pair is a pair OF */
export const carriedBy = (end: Term): Term => of(end, "source");
/** and the point a ray is at */
export const stands = (ray: Term): Term => of(ray, "l");

/** the ways out of a point - the list `each` multiplies a body by, and there are DEG */
export const exits = (p: Term) =>
  list(`the exits of ${p.says}`, "DEG", e => p.read(e).rays);

/** where a ray steps to, which is the neighbour's ray on the same exit */
export const steps = (ray: Term): Term =>
  op(`where ${ray.says} steps to`, (r: any) => goesTo(r, r.bounced), ray);

/** the ray on this point's opposite exit - what a ray meets when it walks into one */
export const facingIt = (ray: Term): Term =>
  op(`what faces ${ray.says}`, (r: any) => otherEnd(r), ray);

/**
 * WHETHER ANYTHING IS ON A POINT — which is `rho`, below the scale where one point matters.
 *
 * TWO THINGS MAKE A POINT UNAVAILABLE and both are this word: something passing THROUGH it,
 * and something being THERE. A ray in flight occupies it, and so does matter, which belongs
 * to a source and is not the vacuum's to split. See `busy` in `Local.ts`, where that is an
 * invariant rather than a second condition a rule has to remember to ask.
 */
export const busy = (p: Term): Term => op(`${p.says} is busy`, (l: any) => anyOn(l), p);

/**
 * AND A NEUTRAL POINT IS ONE THAT IS NOT — the whole of what (G/2) fires on.
 *
 * "A neutral point expands into two points, unconditionally." That is the rule, and this is
 * the only thing it asks: not what is nearby, not what any ray carries, not how many times
 * this point has split before. So below the scale where one point matters it is a flat rate
 * against the ROOM LEFT — `(1-rho)` — which is where the vacuum's own fixed point comes from:
 * creation gated on the room against a loss quadratic in the density, meeting at an occupancy
 * this theory HAS rather than one it was given.
 *
 * IT ASKS FOR NOTHING TO BE CARRYING, which is why it contributes no factor of `n`. `lit`
 * names a ray that must be there and each one is a power of the density; this is the absence
 * of that, and an absence is a coefficient rather than a factor. The two are the same field
 * read at opposite polarity and at different arity, and that is exactly the difference
 * between the `n\tilde{n}` in the loss term and the `(1-rho)` in the gain.
 */
export const neutral = (p: Term): Term => not(busy(p));

/**
 * WHETHER A RAY IS CARRYING — and asking it is what makes a term a power of the density.
 *
 * One `lit` is one factor of n. A branch that asks it of the ray AND of what faces that ray is
 * asking for two, so its term is quadratic and carries the facing factor: that is what a
 * meeting IS, and it is now read off the question the code asks rather than off a quantifier.
 */
export const lit = (ray: Term): Term =>
  term(`${ray.says} is lit`, e => ray.read(e)?.active === true, [ray.says]);

/** whether a point is owned by something put into the box from outside */
export const owned = (p: Term): Term => some(of(p, "source"));
