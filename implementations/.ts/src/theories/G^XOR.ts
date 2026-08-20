import { G } from "./G.ts"

export type Polarity = -1 | 1

export const G_XOR = G.copy()
  .decorate.Boundary<{
    polarity?: Polarity
  }>(self => ({
    active: () => !!self.polarity
  }))

  .rule("ANNIHILATION", ["Boundary", "Boundary"], (a, b) => {
    if (a.polarity && b.polarity && a.polarity !== b.polarity) a.collapse();
  })

  .rule("TURN", ["Boundary", "Boundary"], (a, b) => {
    if (!a.polarity || a.polarity !== b.polarity) return;
    for (const r of [a.source, b.source]) {
      const [x, y] = r.boundaries;
      const [tx, ty] = [x.target, y.target];
      x.link(ty);
      y.link(tx);
    }
  })

  .rule("CREATION", "Local", (l) => {
    if (l.rays.some(r => r.boundaries.some(b => b.active))) return;
    const [x, y] = l.create().boundaries;
    x.polarity = 1;
    y.polarity = -1;
  });
