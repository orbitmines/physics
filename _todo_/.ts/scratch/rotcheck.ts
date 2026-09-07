import { GEOMETRIES } from "../src/lib/Local.ts";
import { firing } from "../src/lib/Source.ts";
for (const name of ["cubic-6","fcc-12","cubic-18","cubic-26","triangular-6","square-4"]) {
  const g: any = (GEOMETRIES as any)[name];
  if (!g.CYCLE) continue;
  const sets = new Set<string>();
  for (let t = 0; t < g.CYCLE; t++)
    sets.add(firing(g, { emission: "sheet", turning: 1 } as any, t)
      .slice().sort((a:number,b:number)=>a-b).join("|"));
  console.log(name.padEnd(14), "SHEET=" + String(g.SHEET).padStart(2),
    "CYCLE=" + g.CYCLE, "| distinct sheet orientations over a full turn:", sets.size,
    sets.size === 1 ? "  <-- rotation is a SYMMETRY: no-op" : "");
}
