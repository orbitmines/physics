import { G_XOR } from "./G^XOR.ts"

/**
 * A MEDIUM THAT NEVER DESTROYS ANYTHING — collisions that TURN and nothing else.
 *
 * It is not one of this book's physical theories and it is not meant to be. It is the
 * third corner of the only comparison that decides the vacuum's density: what happens
 * to the two halves of an inserted point when they meet. Keep both and the box fills;
 * annihilate both and there is no vacuum; keep the alike half and there is a half.
 * Running it beside the real theories is what turns "the vacuum's derived occupancy"
 * from an assumption into a measurement with a stated scope.
 *
 * EVERY MEETING TURNS, whatever the two signs are — which is the sentence, and it is
 * not what the article's own configuration said. That one asked for `alike: reverse`
 * with opposite and neutral both PASSING, in a theory declared unpolarised: every
 * meeting was therefore neutral, every meeting passed, and the reverse it named was
 * unreachable. Here the rule is the sentence.
 */
export const G_CONSERVING = G_XOR.copy()
  .called("G^CONSERVING")
  .decorate.World<{ vacuum: number | null }>(() => ({ vacuum: 1 }))

  .rule("ANNIHILATION", ["Boundary", "Boundary"], (a, b) => {
    const x = a.source, y = b.source;
    if (!x.active || !y.active) return;              // see G's ANNIHILATION on the order
    if (x.bounced || y.bounced) return;
    const here = x.l, there = y.l;
    if (here.source?.collides === false || there.source?.collides === false) return;
    a.insert();
    x.bounced = true;
    y.bounced = true;
    x.turns++; y.turns++;
    x.from = -1; y.from = -1;
    here.turned += 0.5; there.turned += 0.5;
    x.backend.stats.deflections++;
  }, "active");
