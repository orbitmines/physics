import { World } from "../lib/Compat.ts";
import { G } from "../theories/G.ts";
import { G_XOR } from "../theories/G^XOR.ts";
import { G_LABELLED } from "../theories/G^LABELLED.ts";
import { G_XOR_2 } from "../theories/G^XOR*2.ts";
import { G_PURE } from "../theories/G^PURE.ts";
import { G_CONSERVING } from "../theories/G^CONSERVING.ts";
import { fill } from "../lib/Report.ts";
for (const t of [G, G_XOR, G_LABELLED, G_XOR_2, G_PURE, G_CONSERVING]) {
  const w = new World({ theory: t, N: 9, seed: 3 });
  w.run(20);
  console.log(t.name.padEnd(13), "fill", fill(w).toFixed(4),
    "ann", String(w.stats.annihilations).padEnd(7), "defl", String(w.stats.deflections).padEnd(7));
}
const w = new World({ theory: G_XOR, N: 9, seed: 3 });
const s = w.add({ at: [4, 4, 4], radius: 1, emits: 1, absorbs: true, u: [1, 0, 0] });
w.run(12);
console.log("source arrivals", s.arrivals);
