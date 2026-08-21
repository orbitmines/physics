import { World } from "../lib/Compat.ts";
import { G_XOR } from "../theories/G^XOR.ts";
const N = 21;
const w = new World({ theory: G_XOR, N, seed: 1, boundary: "absorb" });
w.add({ at: [(N - 1) / 2, (N - 1) / 2, (N - 1) / 2], radius: 2, absorbs: true, duty: 0 });
w.run(3);
const t0 = Date.now();
w.run(20);
console.log(`${w.size} locals  ${((Date.now() - t0) / 20).toFixed(1)} ms/tick`);
