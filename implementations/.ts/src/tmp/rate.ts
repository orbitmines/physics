import { World } from "../lib/Compat.ts";
import { G_XOR } from "../theories/G^XOR.ts";
import { G } from "../theories/G.ts";
for (const t of [G, G_XOR]) for (const N of [21, 41]) {
  const w = new World({ theory: t, N, seed: 1, boundary: "absorb" });
  w.add({ at: [(N - 1) / 2, (N - 1) / 2, (N - 1) / 2], radius: 2, absorbs: true, duty: 0 });
  w.run(3);
  const t0 = Date.now(); w.run(10);
  console.log(`${t.name.padEnd(6)} N=${String(N).padEnd(3)} ${String(w.size).padEnd(6)} locals  ${((Date.now() - t0) / 10).toFixed(1)} ms/tick`);
}
