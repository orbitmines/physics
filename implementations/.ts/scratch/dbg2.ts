import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_XOR, withSteering } from "../src/theories/G^XOR+XOR.ts";
const g:any = (GEOMETRIES as any)["cubic-6"];
for (const [nm, th] of [["plain", G_XOR_XOR], ["lorentz", withSteering(G_XOR_XOR,"lorentz")],
   ["ballistic", (withSteering(G_XOR_XOR,"lorentz") as any).without("CREATION")]] as any[]) {
  const w:any = new World({theory: th, geometry: g, N: 11, seed: 1, boundary:"absorb", slotUniformRng:true} as any);
  console.log(nm, "steering=", w.steering, "rules=", (th.rules??[]).map?.((r:any)=>r.name ?? r[0]).join(","));
}
console.log("G_XOR_XOR keys", Object.keys(G_XOR_XOR));
