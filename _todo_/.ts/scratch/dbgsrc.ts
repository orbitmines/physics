import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_XOR } from "../src/theories/G^XOR+XOR.ts";
import { firing, half } from "../src/lib/Source.ts";
const g: any = (GEOMETRIES as any)["fcc-12"];
const N = 11, C = 5;
const w: any = new World({ theory: G_XOR_XOR, geometry: g, N, seed: 1,
  boundary: "absorb", slotUniformRng: true } as any);
w.world.turnLog = [];
const s: any = w.add({ at: [C,C,C], radius: 1, emits: 1, period: 1, dwellTicks: 1,
  axis: [0,0,1], emission: "sheet", turning: 2, absorbs: true } as any);
console.log("source: emission=", s.emission, "turning=", s.turning, "axis=", s.axis,
  "duty=", s.duty, "locals=", s.locals.length);
for (let t = 0; t < 4; t++) {
  const f = firing(g, s, t);
  const passed = f.filter((d:number) => half(g, s, d) !== 0);
  console.log(" tick", t, "firing=", f.length, "after half() filter=", passed.length,
    "exits=", passed.map((d:number)=>g.exits[d].join("")).join(" "));
}
