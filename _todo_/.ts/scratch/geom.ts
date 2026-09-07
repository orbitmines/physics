import { GEOMETRIES } from "../src/lib/Local.ts";
for (const g of Object.values(GEOMETRIES) as any[]) {
  console.log(g.name, "D=", g.D, "DEG=", g.DEG, "CYCLE=", g.CYCLE,
    "SPIN=", (180/Math.PI*g.SPIN).toFixed(1)+"deg", "RING=", JSON.stringify(g.RING),
    "ringAxis=", JSON.stringify(g.ringAxis));
}
