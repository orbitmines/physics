import { busy, Geometry, light, opposite, outward } from "../lib/Local.ts"
import { acting, half, sign, Source } from "../lib/Source.ts"
import { clear } from "../lib/Theory.ts"
import { G } from "./G.ts"

export type Polarity = -1 | 1

/**
 * THE SIGN CONVENTION AS A PARAMETER — the model's one free draw, made explicit.
 *
 * (G+M/2) forces WHERE and WHEN a creation fires: wherever a point is neutral, on the
 * expansion's own beat. The one thing it does not fix is the SIGN, and how widely that
 * single choice is shared is the whole of the randomness:
 *
 *   perNode  one sign for the whole point, into all its axes at once — so the two
 *            sides of a point get the same sign and it is a coherent go-between
 *   perAxis  each axis signed on its own, so a point hands out D independent ± pairs
 *   perRay   every heading signed independently, which BREAKS the ± pair the rule
 *            states — carried for contrast rather than as a candidate
 *
 * `perNode` is the default everywhere because it is what the far field needs. It is a
 * PROPERTY OF THE WORLD and not a different rule: asking for another convention is
 * asking the same (G+M/2) to share its one draw more widely, so it is decorated on
 * like `vacuum` and `inertia` and overridden the same way — see `withSign`.
 */
export type Sign = "perNode" | "perAxis" | "perRay"

/**
 * HOW MANY DRAWS ONE LOCAL COSTS THE RANDOM STREAM, whether or not it splits.
 *
 * A local that is skipped still pays, which is `slotUniformRng` doing what it says: the
 * same seed run twice, once with a body and once without, then differs ONLY by the
 * body. Without it, a source local skipping the sign draw shifts the stream everywhere
 * — measured in the article at a fifth of the board OUTSIDE the body's light cone,
 * against a shadow a few per cent deep.
 */
const draws = (g: Geometry, s: Sign) =>
  1 + (s === "perAxis" ? g.AXES.length : s === "perRay" ? 2 * g.AXES.length : 0);

/** a local that did not split still pays the stream what a splitting one costs */
const pay = (l: any, how: Sign, taken: number) => {
  const want = draws(l.world.geometry, how);
  for (let i = taken; i < want; i++) l.backend.rng();
};

/**
 * THE SIGN THE POINT DREW, AND THE ONE WRITE THAT PUTS IT ON A RAY.
 *
 * Held beside the rule rather than closed over inside it: a closure built per point is
 * fourteen thousand of them a tick on a 21³ box, for a function that is the same
 * function every time. There is one world ticking at a time.
 */
let drawn: Polarity = 1;
const split = (r: any) => { r.active = true; r.polarity = drawn; };

export const G_XOR = G.copy()
  .called("G^XOR")
  .signed()
  .carries<"polarity", Polarity | undefined>("polarity", undefined)

  .decorate.World<{ vacuum: number | null; sign: Sign }>(() => ({
    vacuum: null,
    sign: "perNode",
  }))

  /**
   * A SOURCE'S SIGN. The theory decides whether there is one at all, not the source: a
   * first version let a source write its `emits` whatever theory it was in, so a
   * GRAVITY world came out holding thousands of rays carrying +1, which met head-on,
   * counted as ALIKE and sailed through each other. In the one theory where every
   * meeting is supposed to annihilate, the source's own rays never did.
   *
   * `G` emits; this puts the sign on what `G` lit, and an AXIAL source puts its sign
   * out of one half and the opposite out of the other, which is what gives it poles.
   */
  .rule("EMISSION", "Local", (l) => {
    const s: Source | null = l.source;
    if (!s) return;
    (G.rules.EMISSION as any).exec(l);
    if (!acting(s, l.world.ticks)) return;
    const g: Geometry = l.world.geometry;
    const q = sign(s, l.world.ticks) as Polarity;
    const rays = l.rays;
    for (let d = 0; d < rays.length; d++) {
      const r = rays[d];
      if (!r.active || r.from !== s.id) continue;
      r.polarity = (half(g, s, d) === -1 ? -q : q) as Polarity;
    }
  }, "source")

  /**
   * (G+M/2) A NEUTRAL POINT SPLITS INTO A ± PAIR ON EVERY AXIS.
   *
   * The halves STAY ON THE POINT THAT SPLIT, heading outward, because a split puts a new
   * point BETWEEN this one and its neighbour and a ray at (local, d) is exactly a thing
   * on its way to that midpoint. The neighbour is splitting at the same moment, so its
   * facing half is the other half of the SAME inserted point, approaching across the
   * edge — which is why the meeting is on the edge.
   *
   * The pairs are found through the LINKS rather than by index, so a point the graph
   * backend has made — which has no exit numbering of its own — splits correctly too.
   */
  .rule("CREATION", "Local", (l) => {
    const rng = l.backend.rng;
    /*
     * THE DRAW IS TAKEN FIRST AND ALWAYS. A local that is skipped costs the stream what a
     * splitting one costs, so two runs on one seed differ ONLY by what was put in them.
     */
    const node = rng();
    const how: Sign = l.world.sign;
    /* CLEARED BEFORE ANYTHING ELSE — this rule visits every point once a tick, so the
     * flag it leaves is fresh for MOVEMENT and stale for nobody. */
    (l as any).splitting = false;
    if (l.source || l.world.blocks?.(l) || busy(l)) {
      if (how !== "perNode") pay(l, how, 1);
      return;
    }
    (l as any).splitting = true;
    if (l.world.unfolds) l.unfold();   // see `unfolds` — space it has held may stay held

    /*
     * ONE SIGN FOR THE WHOLE POINT, WRITTEN WITHOUT LOOKING FOR THE PAIRS.
     *
     * `perNode` gives both sides of every axis the same sign, so which ray is opposite
     * which does not enter into it — and finding that out costs five walks up and down
     * the containment per ray. It is the default everywhere and the only convention any
     * run in this book uses, so it is the path that has to be cheap.
     */
    if (how === "perNode") {
      drawn = node < 0.5 ? 1 : -1;
      /*
       * OR TAKEN FROM WHAT IS ALREADY BESIDE IT — see `withInheritedSign`. The draw above
       * is still taken and still paid for, so the two readings differ only by which sign
       * is written and a run of one can be differenced against a run of the other.
       */
      if (l.world.inheritSign) {
        let around = 0;
        for (const r of l.rays) {
          const there: any = outward(r)?.target?.source?.l;
          if (!there) continue;
          for (const q of there.rays) if (q.active) around += q.polarity ?? 0;
        }
        if (around !== 0) drawn = (around > 0 ? 1 : -1) as Polarity;
      }
      (l.backend as any).walk("Ray", l, split);
      return;
    }

    /*
     * AND THE TWO CONVENTIONS THAT SIGN THE PAIRS SEPARATELY, which have to find them.
     * The pairs are read off the LINKS rather than by index, so a point the store has
     * made — which has no exit numbering of its own — splits correctly too.
     */
    const g: Geometry = l.world.geometry;
    let used = 1;
    const seen = new Set<unknown>();
    for (const r of l.rays) {
      if (seen.has(r)) continue;
      const o = opposite(r);
      seen.add(r); if (o) seen.add(o);
      const q: Polarity = (rng() < 0.5 ? 1 : -1); used++;
      let q2: Polarity;
      if (how === "perAxis") q2 = q === 1 ? -1 : 1;
      else { q2 = rng() < 0.5 ? 1 : -1; used++; }
      r.active = true; r.polarity = q;
      if (o) { o.active = true; o.polarity = q2; }
    }
    for (let i = used; i < draws(g, how); i++) rng();
  })

  /**
   * (G+M/1) OPPOSITE POLARITIES ANNIHILATE, taking their space with them, and
   * (G+M/3) ALIKE ONES TURN — one pass over the facing pairs, because the two are the
   * two branches of one question: do the two charges agree?
   *
   * THE TURN IS WHERE SPACE GROWS. The point the split put between A and B survives,
   * which is `insert`; leaving it out kept the annihilations, the deflections and the
   * fill bit-identical while the recorded size came out 15,559 against 1,873,568.
   */
  .rule("ANNIHILATION", ["Boundary", "Boundary"], (a, b) => {
    const x = a.source, y = b.source;
    if (!x.active || !y.active) return;              // see G's ANNIHILATION on the order
    const here = x.l, there = y.l;
    if (here.source?.collides === false || there.source?.collides === false) return;
    if (x.polarity === y.polarity) {
      if (x.bounced || y.bounced) return;
      /* the point it leaves behind carries the sign the two agreed on — see `twist` */
      const mid: any = a.insert();
      if (mid) mid.twist = x.polarity ?? 0;
      x.bounced = true;
      y.bounced = true;
      /* it has met something, so it is nobody's own ray any more */
      x.turns++; y.turns++;
      x.from = -1; y.from = -1;
      here.turned += 0.5; there.turned += 0.5;
      x.backend.stats.deflections++;
      return;
    }
    clear(x);
    clear(y);
    x.backend.stats.annihilations++;
    here.destroyed += 0.5; there.destroyed += 0.5;
    /* the pair is BURIED rather than merely gone — see `buried`. It is recorded on the
     * point that is about to be folded away, because that is the one a layer above
     * stands for, and it is one PAIR and not two charges: the two signs are opposite. */
    there.buried = (there.buried ?? 0) + 1;
    here.fold(there);
  }, "active");

/**
 * THE SAME THEORY WITH THE CREATION'S ONE DRAW SHARED MORE WIDELY, OR LESS.
 *
 * (G+M/2) is unchanged — it is the world that says how far the sign reaches, so this is
 * a decoration and not another rule. A claim that varies it is varying one property of
 * the world it names in its header, rather than measuring a theory it assembled.
 */
export const withSign = <T extends { copy(): any; name: string }>(t: T, how: Sign) =>
  (t.copy() as any).decorate.World(() => ({ sign: how })).called(`${t.name} (${how})`);
