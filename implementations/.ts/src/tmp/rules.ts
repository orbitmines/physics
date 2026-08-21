import { World } from "../lib/Compat.ts";
import { G_XOR } from "../theories/G^XOR.ts";
import { forEachMatch } from "../lib/Theory.ts";
const N = 21;
const w: any = new World({ theory: G_XOR, N, seed: 1, boundary: "absorb" });
w.add({ at: [(N - 1) / 2, (N - 1) / 2, (N - 1) / 2], radius: 2, absorbs: true, duty: 0 });
w.run(3);
const world = w.world, rules: any = world.theory.rules;
const acc: Record<string, number> = {}; let flush = 0;
const T = 20;
for (let t = 0; t < T; t++) {
  world.ticks++;
  for (const [name, rule] of Object.entries(rules) as any[]) {
    const t0 = Date.now();
    forEachMatch(world.backend, rule.type, rule.exec, rule.where);
    acc[name] = (acc[name] ?? 0) + (Date.now() - t0);
    const t1 = Date.now();
    world.backend.rewrite.flush();
    flush += Date.now() - t1;
  }
}
const total = Object.values(acc).reduce((a, b) => a + b, 0) + flush;
for (const [k, v] of Object.entries(acc).sort((a, b) => b[1] - a[1]))
  console.log(`${k.padEnd(14)} ${(v / T).toFixed(1).padStart(7)} ms/tick   ${(100 * v / total).toFixed(1)}%`);
console.log(`${"flush".padEnd(14)} ${(flush / T).toFixed(1).padStart(7)} ms/tick   ${(100 * flush / total).toFixed(1)}%`);
console.log(`${"TOTAL".padEnd(14)} ${(total / T).toFixed(1).padStart(7)} ms/tick`);
