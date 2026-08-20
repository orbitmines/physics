import { Theory } from "../lib/Theory.ts";
import { G_XOR } from "./G^XOR.ts";

export const G_XOR_2 = G_XOR.copy()
  .layer.merged("CHARGE", new Theory()
    .decorate.Ray<{
      phase: number
    }>(self => ({
      phase: 0
    }))

    .rule("PHASE", "Ray", (r) => {
      r.phase = (r.phase + 1) % Math.max(r.l.DEG, 1);
    }));
