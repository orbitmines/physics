import { opposite, outward } from "../lib/Local.ts"
import { acting, sign } from "../lib/Source.ts"
import { G } from "./G.ts"

export type Polarity = -1 | 1

export const G_XOR = G.copy()
  .decorate.Ray<{
    polarity?: Polarity
    settling?: Polarity
  }>(self => ({}))

  .decorate.World<{ vacuum: number | null }>(() => ({ vacuum: null }))

  .rule("EMISSION", "Local", (l) => {
    const s = l.source;
    if (!s) return;
    G.rules.EMISSION.exec(l);
    if (!acting(s, l.world.ticks)) return;
    const q = sign(s, l.world.ticks) as Polarity;
    for (const r of l.rays) r.polarity = q || undefined;
  })

  .rule("CREATION", "Local", (l) => {
    if (l.rays.some(r => r.active)) return;
    l.unfold();
    const sign: Polarity = l.backend.rng() < 0.5 ? 1 : -1;
    for (const r of l.rays) { r.active = true; r.polarity = sign; }
  })

  .rule("MOVEMENT", "Ray", (r) => {
    if (!r.active) return;
    const from = r.bounced ? opposite(r) : r;
    const facing = outward(from)?.target?.source;
    const to = facing && opposite(facing);
    if (!to) return;
    to.arriving = true;
    to.settling = r.polarity;
  })

  .rule("ARRIVAL", "Ray", (r) => {
    r.active = r.arriving === true;
    r.polarity = r.active ? r.settling : undefined;
    r.arriving = undefined;
    r.settling = undefined;
    r.bounced = false;
  })

  .rule("ANNIHILATION", ["Boundary", "Boundary"], (a, b) => {
    const [x, y] = [a.source, b.source];
    if (x.l === y.l) return;
    if (!x.active || !y.active) return;
    if (x.polarity === y.polarity) {
      if (x.bounced || y.bounced) return;
      a.insert();
      x.bounced = true;
      y.bounced = true;
      /* it has met something, so it is nobody's own ray any more */
      x.turns++; y.turns++;
      x.from = -1; y.from = -1;
      x.l.turned += 0.5; y.l.turned += 0.5;
      return;
    }
    x.active = false; x.polarity = undefined;
    y.active = false; y.polarity = undefined;
    x.backend.stats.annihilations++;
    x.l.destroyed += 0.5; y.l.destroyed += 0.5;
    x.l.fold(y.l);
  });
