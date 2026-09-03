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
import { add, div, Expr, field, grad, mul, num, show as showE, sub } from "./Algebra.ts";
import { Backend } from "./Backend.ts";
import { across as goesTo, busy as anyOn, leaving as leavesBy, opposite as otherEnd,
  outward as goesOut } from "./Local.ts";

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
  /*
   * AND FOLDS SWALLOWED (+) OR HANDED BACK (−) — the third ledger, and the one `turns` reads.
   *
   * `fold` leaves a record of which way two points were joined and `unfold` takes one back, so
   * what a place has swallowed is a COUNT with a rate on each side exactly as the other two
   * are. It was not carried, so nothing could balance it and the record had to be asserted
   * wherever it was wanted - which is how a quantity that the rules make and unmake in equal
   * measure came to be treated as a field sourced only by matter.
   */
  folds: Count;
  /** the population is carried from place to place rather than changed — transport */
  carries: boolean;
  /** the tick's own exchange: what was arriving becomes what is here */
  settles: boolean;
  /** WHICH carrying things this had to find before it would do anything - see `Term.needs` */
  needs: string[];
  /** and what it happens once per, where a condition said so - see `Term.slows` */
  slows?: string;
  /*
   * AND THE SHARE OF THE TIME THE BRANCH IT SITS IN IS THE ONE TAKEN.
   *
   * `either` keeps BOTH branches - they are both things the rule can do - and until now it
   * kept them at the same rate, so a ray both stepped AND made the cell it could not step
   * into, every tick. A branch's condition is a share exactly as a gate's is, and the two
   * arms get that share and its complement.
   */
  share?: Expr;
  /** and what a turn in it does to a direction - see `Term.kernel` */
  kernel?: { keeps: Expr; drifts: Expr };
  /**
   * WHETHER WHAT WAS DRAWN DECIDED THAT IT FIRES — which is the whole of what a rate is.
   *
   * A REWRITE FIRES ON EVERY MATCH IT HAS, ONCE A TICK. That is what a rule of this model IS:
   * the walk offers it every match and it acts on each, so its rate is ONE per match per tick.
   * A rate is therefore a count of the rewrite rather than a number anybody chose.
   *
   * AND A DRAW ABOUT WHERE IS NOT A DRAW ABOUT WHETHER. The one thing in this language that
   * draws picks which way a ray goes on, and a ray that turns has still met whatever it met -
   * so that draw is the KERNEL and belongs to the direction, not to the rate. Marked as a rate
   * it made the meeting's rate uncertain, which it is not.
   */
  draws?: boolean;
  /** done by something outside the model, so its term is `Sigma` and not the medium's */
  outside?: boolean;
};

export const NOTHING: Doing =
  { rays: ZERO, space: ZERO, folds: ZERO, carries: false, settles: false, needs: [] };

const both = (a: Doing, b: Doing): Doing => ({
  rays: plus(a.rays, b.rays), space: plus(a.space, b.space),
  folds: plus(a.folds, b.folds),
  carries: a.carries || b.carries, settles: a.settles || b.settles,
  needs: [...new Set([...a.needs, ...b.needs])],
  draws: a.draws || b.draws,
});

const repeated = (d: Doing, by: string | number): Doing => ({
  rays: times(d.rays, by), space: times(d.space, by), folds: times(d.folds, by),
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
  /**
   * AND WHAT THIS CONDITION MAKES A THING HAPPEN ONCE PER.
   *
   * `needs` says what must be THERE, and each one is a factor of the density. This says what a
   * thing is divided BY: a ray crosses a place once per point that place stands for, so its
   * transport is `1/s` of what it would be through undisturbed space. That is a metric, and it
   * belongs in the equation as one — read off the condition the rule already asks rather than
   * written into the transport term by hand.
   */
  slows?: string;
  /**
   * WHAT FRACTION OF ITS MATCHES THIS CONDITION LETS THROUGH — COMPUTED, never declared.
   *
   * A condition narrows, and whatever the rule then does it does on the share that got through.
   * That share is not something anybody should write down beside a gate: it is a property of
   * the EXPRESSION, and expressions compose. `busy` asks whether anything is on a point, and the
   * fraction of points that are is what the model calls `rho`; `not` of it lets through
   * `1 - rho`; two conditions together let through the product of their shares.
   *
   * SO IT IS ARITHMETIC ON THE TREE, and that is the whole point of the tree. Nothing here
   * enumerates which shares are possible, so a condition built out of anything - a beat, a
   * charge, something not thought of yet - reaches the equation carrying its own share without
   * this file or `Continuum` learning a new case.
   *
   * WHERE IT BOTTOMS OUT IS A NAME FOR A QUANTITY, not a claim about behaviour: the fraction of
   * points that are busy IS what `rho` means, the fraction of ticks a body spent moving IS what
   * `beta` means. That is naming the density of a field, in the same category as calling the
   * population `n`, and it is attached to the field rather than to any rule that asks about it.
   */
  share?: Expr;
  /**
   * AND WHAT THIS DOES TO A DIRECTION — BOTH moments of the choice it makes.
   *
   * `keeps` is the scalar one, `g = <cos theta>`: how much of the heading survives a turn, which
   * is what `sigma(1-g)` attenuates a shadow by and so fixes how FAR the field reaches.
   *
   * `drifts` is the vector one, `<d^\'>`: which way the turn leans on average. That is not a
   * range, it is a BENDING - rays pulled toward where the folds are - and it is the same choice
   * read as a first moment rather than as a cosine. One kernel, two moments, and the fact that
   * they are one object is why turning and deflecting are not two mechanisms.
   *
   * A condition that redirects a ray has a kernel, and the only thing about that kernel which
   * reaches the far field is `g = <cos theta>`: how much of the heading survives one turn.
   * `g = 1` is "carries straight on" and costs a direction nothing; `g = 0` forgets it
   * entirely. What attenuates a shadow is `sigma(1 - g)`, so this is the number a falloff is
   * derived from, and it is a property of the CHOICE rather than of any rule that makes it.
   */
  kernel?: { keeps: Expr; drifts: Expr };
};

const term = (
  says: string, read: (e: Env) => any,
  needs: string[] = [], slows?: string, share?: Expr,
  kernel?: { keeps: Expr; drifts: Expr },
): Term => ({ read, says, needs, slows, share, kernel });

/**
 * THE FOLD RECORD OF ONE POINT — kept beside the store rather than on the flyweight.
 *
 * A `Local` is a view onto an index, handed out and reused, so a field whose default is an
 * OBJECT is one object shared by every point in the world. What a fold leaves is per point, so
 * it lives in a map the point's own index keys.
 */
const RECORDS = new WeakMap<object, Map<number, number[]>>();
export const folded = (l: any): number[] => {
  const store = l.backend;
  let byIndex = RECORDS.get(store);
  if (!byIndex) RECORDS.set(store, byIndex = new Map());
  let rec = byIndex.get(l.i);
  if (!rec) byIndex.set(l.i, rec = []);
  return rec;
};

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

/**
 * A CONDITION ON A FIELD, CARRYING THAT FIELD'S OWN DENSITY.
 *
 * The one place a share enters, and it enters as the NAME OF A QUANTITY rather than as a claim:
 * how much of the population is carrying is what `rho` means, how much of a body's time went on
 * moving is what `beta` means. Everything else in this file computes from these - `not` takes
 * one from it, `and` multiplies them - so a gate never says what it passes and `Continuum`
 * never asks.
 */
export const asks = (
  says: string, share: Expr, f: (...vs: any[]) => any, ...xs: Term[]
): Term => term(says, e => f(...xs.map(x => x.read(e))), [], undefined, share);

/** and what it does NOT let through is everything else - so the share is one less it */
export const not = (x: Term): Term =>
  term(`not ${x.says}`, e => !x.read(e), [], x.slows,
    x.share ? sub(num(1), x.share) : undefined);

/** and two conditions together let through the product of what each does */
export const and = (...xs: Term[]): Term => {
  const shares = xs.map(x => x.share).filter(Boolean) as Expr[];
  return term(xs.map(x => x.says).join(" and "), e => xs.every(x => x.read(e)),
    xs.flatMap(x => x.needs ?? []), xs.find(x => x.slows)?.slows,
    shares.length ? mul(...shares) : undefined);
};
export const is = (x: Term, v: any): Term =>
  op(`${x.says} is ${v}`, (a: any) => a === v, x);
export const some = (x: Term): Term => op(`there is a ${x.says}`, (v: any) => !!v, x);

/* —— what a rule does ————————————————————————————————————————————————————— */

/**
 * ONE LINE OF THE COUNTING — what a piece of a body contributed, and what that made of it.
 *
 * THE ARITHMETIC IS THE DERIVATION AND IT WAS BEING THROWN AWAY. `doing` is the ANSWER - so
 * many rays, so many points, so many things that had to be carrying - and a page showing only
 * that is showing the total of a sum whose terms nobody can see. `light` making one ray, `each`
 * multiplying it by the exits there are, `seq` adding two branches: those are the steps, and
 * they are what a reader has to be able to check.
 *
 * SO EACH COMBINATOR RECORDS WHAT IT DID, and the record composes as the tree does. Nothing is
 * recomputed to build it - the line is written where the arithmetic already happens.
 */
export type Counted = {
  /** what this piece of the body is, as written */
  of: string;
  /** what the counting made of it - the ledgers, not a description of them */
  doing: Doing[];
  /** and how it was composed - `seq` of two, `each` of one and a multiplier */
  how: "atom" | "seq" | "each" | "when" | "either" | "let";
  /** where a loop, how many it runs over - which is where a count of the lattice enters */
  many?: string | number;
  /** the pieces it was made of, so the arithmetic can be shown a step at a time */
  from?: Counted[];
};

export type Act = {
  /** compiled once, when the rule is built - a tick runs this and never walks the tree */
  run: (e: Env) => void;
  /** and how the counting went, line by line - see `Counted` */
  counted: Counted;
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

const act = (
  says: string, doing: Doing[], run: (e: Env) => void,
  how: Counted["how"] = "atom", from?: Counted[], many?: string | number,
): Act => ({ run, doing, says, counted: { of: says, doing, how, from, many } });
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

/**
 * A POINT OF SPACE IS HANDED BACK — one more point than there was, AND ONE FOLD FEWER.
 *
 * `fold` joins two points and leaves a record of which way they were joined; handing a point
 * back is that undone, so the record has to come back with it. IT DID NOT. `folded()` was
 * written only by `fold` and read only by `turns`, so the count at every place rose forever:
 * in an old vacuum every point would have swallowed an unbounded number of folds and
 * `turns`'s draw - one way straight on against `folds[d]` ways sideways - would send a ray
 * straight essentially never. Light would freeze, and the metric this feeds would say so.
 *
 * AND IT COMES OFF EVERY WAY, ONE EACH, because that is what splitting a point IS here.
 *
 * `fold` joins two points along ONE direction and marks that one. A split is not the reverse
 * of one join: `CREATION` unfolds the point and lights EVERY exit, so it opens in every
 * direction at once, and what it hands back is a fold in each of them. ONE PER WAY OUT, which
 * is the "one" that makes sense for a rewrite that acts on every way out.
 *
 * AND IT IS WHAT LETS THE RECORD SETTLE. A meeting takes two rays and makes one fold; a
 * splitting makes DEG rays and hands back one fold. With the rays balancing, that is DEG/2
 * meetings per splitting and so DEG/2 folds made against one returned - the record would grow
 * without bound and `turns` would send a ray straight essentially never. One per way out puts
 * DEG back against DEG/2 taken, and it settles.
 *
 * A record already at nothing is left alone rather than driven negative: a way out that has
 * swallowed nothing has nothing to hand back.
 */
export const unfold = (point: Term): Act =>
  one(`unfold ${point.says}`, { ...NOTHING, space: count(1), folds: times(count(-1), "DEG") },
    e => {
      const l = point.read(e);
      const rec = folded(l);
      for (let d = 0; d < l.rays.length; d++)
        if ((rec[d] ?? 0) > 0) rec[d] = rec[d] - 1;
      l.unfold();
    });

/** AND TWO POINTS BECOME ONE - one point of space destroyed, which is what gravity is here */
export const fold = (into: Term, point: Term): Act =>
  one(`fold ${point.says} into ${into.says}`, { ...NOTHING, space: count(-1), folds: count(1) },
    e => {
      const a = into.read(e), b = point.read(e);
      if (!a || !b) return;
      /*
       * AND WHICH WAY IT WENT IS KEPT, because that is what a fold leaves behind.
       *
       * "An annihilation joins what was behind each onto what was behind the other, so the
       * place it happened is left with more space folded into it." More space in a
       * DIRECTION - the one the two points were separated along. Counted per exit, that
       * record is the ways through the place a later ray may take, and it is the whole of
       * what makes a path lean toward where the folds are.
       */
      /*
       * KEYED ON THE POINT'S OWN INDEX, because a Local is a FLYWEIGHT. The decoration's
       * default is built ONCE and every point is handed the same object, so `a.folds[d]++`
       * wrote into one array shared by the whole world - measured, 9.2 million folds recorded
       * against 25,170 that happened, which is the world's count times the number of points.
       * A per-point record has to be looked up per point.
       */
      const mine = a.rays as any[];
      for (let d = 0; d < mine.length; d++) {
        const there: any = goesOut(mine[d])?.target?.source?.l;
        if (there !== b) continue;
        const rec = folded(a);
        rec[d] = (rec[d] ?? 0) + 1;
        break;
      }
      a.fold(b);
    });

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

  const kids = acts.map(a => a.counted);
  if (acts.length === 2) {
    const a = acts[0].run, b = acts[1].run;
    return act(says, doing, e => { a(e); b(e); }, "seq", kids);
  }
  const runs = acts.map(a => a.run);
  return act(says, doing, e => { for (let i = 0; i < runs.length; i++) runs[i](e); },
    "seq", kids);
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
    e => { if (cond.read(e)) body.run(e); }, "when", [body.counted]);
};

/** one way or the other - and both ways are things the rule can do, so both are branches */
/**
 * ONE WAY OR THE OTHER — and both ways are things the rule can do, so both are branches, EACH
 * AT THE SHARE OF THE TIME ITS OWN CONDITION HOLDS.
 *
 * Keeping both effects at full rate says the rule does both every time, which is the one thing
 * `either` means it does not. `MOVEMENT` is `either(some(to), handOver, waitForRoom)`: a ray
 * steps where there is somewhere to step and MAKES A CELL where there is not, and counting the
 * second at the streaming rate had every ray in the world growing the world every tick.
 *
 * THE COMPLEMENT IS THE OTHER ARM'S, by what a condition is. Where the condition carries no
 * share this leaves both alone rather than inventing one - an unknown share is not a half.
 */
export const either = (cond: Term, yes: Act, no: Act): Act => {
  const on = cond.share;
  const held = (d: Doing, by?: Expr): Doing => ({
    ...d,
    ...(cond.slows ? { slows: cond.slows } : {}),
    ...(by ? { share: d.share ? mul(d.share, by) : by } : {}),
  });
  return act(`if ${cond.says}: ${yes.says}; otherwise ${no.says}`,
    [...yes.doing.map(d => held(d, on)),
     ...no.doing.map(d => held(d, on ? sub(num(1), on) : undefined))],
    e => { if (cond.read(e)) yes.run(e); else no.run(e); });
};

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
  }, "each", [inner.counted], many);
};

/** a value named once and used more than once, rather than computed again */
export const let_ = (v: Term, body: (x: Term) => Act): Act => {
  const slot = SLOTS++;
  const inner = body(bound(slot, v.says));
  /* a value that makes a CHOICE hands its kernel to whatever is done with it */
  return act(`let ${v.says}: ${inner.says}`,
    v.kernel ? inner.doing.map(d => ({ ...d, kernel: v.kernel })) : inner.doing,
    e => { e.in[slot] = v.read(e); inner.run(e); },
    "let", [inner.counted]);
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
      /*
       * THE END THAT LEAVES THIS POINT, and it has to be that one.
       *
       * `outward` answers "which end leads somewhere" and is undefined at an edge with
       * nothing on the far side - which is the whole state a ray about to step off one is
       * in. `leaving` names the same end structurally: the one the inward pairing did not
       * claim. Asked for `boundaries[0]` instead, half the time this is the INWARD end,
       * which already has a target, and `grow` refuses an end that leads somewhere - so the
       * world never grew and the frontier never moved.
       */
      const from = r.bounced ? otherEnd(r) : r;
      if (!from) return;
      const end = leavesBy(from);
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

/**
 * WHERE A RAY GOES ONCE THE FOLDS AT THIS PLACE HAVE HAD THEIR SAY — the turn, which is the
 * deflection, which is the same mechanism said once.
 *
 * A place that has swallowed folds has more ways through it than its own exits: what was
 * behind each of the two points that met is now joined onto the other. So a ray arriving there
 * carries straight on with weight ONE and takes a folded way with the weight that way was
 * folded - `1 + n` to `1` against each of the DEG others, which is `gravity.law`'s ratio and
 * the lean it gives is `n c̄ / DEG`.
 *
 * TWO READINGS OF THE ONE CHOICE, and there is no second rule for the second one. How far it
 * turns is the DEFLECTION; how much of the heading survives one turn is `g = <cos theta>`, and
 * `sigma(1-g)` is what attenuates a shadow - so the same kernel fixes both how light bends and
 * how far gravity reaches. In undisturbed space nothing has been folded, the choice is `1` to
 * nothing, `g = 1`, and a ray carries on for ever exactly as it does today.
 */
export const turns = (ray: Term): Term =>
  term(`where ${ray.says} goes once the folds here have had their say`,
    e => {
      const r = ray.read(e);
      const l = r?.l;
      if (!l) return goesTo(r, r.bounced);
      const f = folded(l);
      let tot = 0;
      for (let d = 0; d < f.length; d++) tot += f[d] ?? 0;
      if (tot <= 0) return goesTo(r, r.bounced);
      /* carry straight on with weight one, or take a folded way with the weight it was folded */
      let pick = (l.backend?.rng?.() ?? 0) * (1 + tot);
      if (pick <= 1) return goesTo(r, r.bounced);
      pick -= 1;
      for (let d = 0; d < f.length; d++) {
        pick -= f[d] ?? 0;
        if (pick <= 0) {
          const out = goesOut((l.rays as any[])[d]);
          return out?.target?.source ?? goesTo(r, r.bounced);
        }
      }
      return goesTo(r, r.bounced);
    },
    [], undefined, undefined,
    /*
     * ONE WAY STRAIGHT ON AGAINST THE FOLDED ONES, so the two moments of the choice are
     *
     *   keeps   1/(1+n_{f})     what is left of the heading  -> how far the field reaches
     *   drifts  f/(1+n_{f})     which way it leans on average -> how much a path bends
     *
     * with `f` the fold record as a vector - the folds summed with their directions - and
     * `n_{f}` its total. Undisturbed space has folded nothing: `keeps` is one, `drifts` is
     * nothing, and a ray goes straight for ever.
     */
    {
      /*
       * WHAT IS LEFT OF THE HEADING: one way straight on against `n_{f}` folded ones.
       */
      keeps: div(num(1), add(num(1), field("n_{f}"))),
      /*
       * AND WHICH WAY IT LEANS, which is `grad n_{f}` and NOT that over `1 + n_{f}`.
       *
       * The turn is chosen from `1 + n_{f}` ways, so the CHANCE of taking a folded one carries
       * that denominator - but what a ray's heading does per unit length is the lean times how
       * often it is taken, and the two `1 + n_{f}` cancel: a place with twice the folds turns a
       * ray twice as often AND offers twice as many ways to turn. What survives is the record
       * itself, so the direction term is `grad n_{f}·grad_d^` and the index integrates to
       * `e^{n_{f}}` rather than to `1 + n_{f}`.
       *
       * THE PERIHELION IS WHAT TELLS THE TWO APART, and it is not a small difference: the
       * linearised reading gives FOUR sixths of general relativity's advance and the
       * exponential gives SIX. Four sixths is the classic Newton-plus-time-dilation answer -
       * the one that comes of dropping the space part - so the cancellation is exactly the
       * piece the perihelion is made of.
       */
      drifts: grad(field("n_{f}")),
    });

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
export const busy = (p: Term): Term =>
  asks(`${p.says} is busy`, field("\\rho"), (l: any) => anyOn(l), p);

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
 * AND WHETHER A RAY HAS WAITED LONG ENOUGH TO CROSS WHERE IT IS.
 *
 * A path through a place with more space folded into it has more of it to cross. So a ray
 * takes one tick per point the place stands for — one where nothing was destroyed, more where
 * it was — and that is the whole of the rule. It is local: the ray asks the point it is on
 * and nothing else.
 *
 * THIS IS WHAT MAKES THE MEDIUM A GEOMETRY. c̄ is one cell a tick through undisturbed space
 * and slower through space that has been folded, so a path near where much has been destroyed
 * both bends and lags — which is what a metric IS, arrived at from a count rather than
 * imposed as a field.
 */

/**
 * WHETHER A RAY IS CARRYING — and asking it is what makes a term a power of the density.
 *
 * One `lit` is one factor of n. A branch that asks it of the ray AND of what faces that ray is
 * asking for two, so its term is quadratic and carries the facing factor: that is what a
 * meeting IS, and it is now read off the question the code asks rather than off a quantifier.
 */
export const lit = (ray: Term): Term =>
  term(`${ray.says} is lit`, e => ray.read(e)?.active === true, [ray.says]);

/**
 * WHETHER WHAT OWNS THIS PLACE STILL HAS ITS ACTION TO SPEND.
 *
 * One per tick, and a tick spent crossing a cell is a tick not spent shining. So a body going
 * somewhere puts out on fewer of its ticks than one standing still, in exact proportion to how
 * often it moves - which is `beta`. Nothing here is about frequency or about an observer: it
 * is one step, two things to spend it on, and the arithmetic of which got it.
 */
export const moving = (p: Term): Term =>
  asks(`what owns ${p.says} spent this tick moving`, field("\\beta"),
    (l: any) => l?.source?.stepped === true, p);

/** and what has NOT spent it moving still has it - one less the share, by `not` */
export const spare = (p: Term): Term => not(moving(p));

/**
 * WHETHER THERE IS SOMEWHERE TO STEP — the other half of `MOVEMENT`, and the half the
 * counting could not see.
 *
 * `MOVEMENT` does two things to a lit ray and it does them in order: `turns` draws WHICH way
 * it goes, and then `either` asks whether that way LEADS ANYWHERE. Take the first branch and
 * it hands over; take the second and it makes the room and waits. So a ray's radial progress
 * is the product of two shares - how much of the draw went straight, and how much of the
 * stepping found somewhere to step - and the second one was invisible.
 *
 * IT WAS INVISIBLE BECAUSE `some` IS BUILT WITH `op`, WHICH CARRIES NO SHARE. `either` has the
 * machinery and uses it: the taken branch gets the condition's share and the other gets one
 * less it. Handed `undefined` it applies neither, so BOTH branches came out at share one -
 * the line then says every ray steps AND every ray waits, which is why the waiting term
 * reached the equation as a bare `\sigma n` and `a_{0}` came out equal to the whole
 * population rather than to the part of it that is waiting.
 *
 * AND THAT IS WHAT COUPLES THE TWO. The speed and the rate space is made are not independent
 * quantities that happen to appear in the same law: they are the two arms of ONE choice, so
 * whatever share is not advancing a ray is making room, and one symbol carries both. That
 * coupling is the whole of the non-linearity - a transport whose speed depends on what is
 * being transported - and with the share dropped there was nothing to couple.
 *
 * THE SHARE IS A NAME AND NOT A CLAIM, exactly as `\rho` and `\beta` are. Nothing here says
 * what it comes to; it says only that the two branches divide one thing between them, and
 * what it comes to is for the closure to work out.
 */
export const roomAhead = (x: Term): Term =>
  asks(`there is somewhere for ${x.says} to go`, field("\\omega"), (v: any) => !!v, x);

/** whether a point is owned by something put into the box from outside */
export const owned = (p: Term): Term => some(of(p, "source"));
