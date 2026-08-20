import { G_XOR } from "./G^XOR.ts"

export const G_CONSERVING = G_XOR.copy()
  .decorate.World<{ vacuum: number | null }>(() => ({ vacuum: 1 }))

  .rule("ANNIHILATION", ["Boundary", "Boundary"], (a, b) => {
    const [x, y] = [a.source, b.source];
    if (x.l === y.l) return;
    if (!x.active || !y.active) return;
    if (x.bounced || y.bounced) return;
    a.insert();
    x.bounced = true;
    y.bounced = true;
  });
