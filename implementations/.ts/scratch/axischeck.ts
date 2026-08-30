import { GEOMETRIES } from "../src/lib/Local.ts";
import { axisAt, half } from "../src/lib/Source.ts";
for (const name of ["fcc-12","cubic-6","cubic-18","cubic-26"]) {
  const g: any = (GEOMETRIES as any)[name];
  if (!g.CYCLE) continue;
  for (const turning of [0, 1, 2]) {
    const s: any = { axis: [0,0,1], turning, period: 1, phase: 0, emission: "sheet" };
    const axes = new Set<string>(), pats = new Set<string>();
    for (let t = 0; t < g.CYCLE * 2; t++) {
      axes.add((axisAt(g, s, t) ?? []).map((x:number)=>x.toFixed(2)).join(","));
      pats.add(Array.from({length: g.DEG}, (_,d) => half(g, s, d, t)).join(""));
    }
    console.log(name.padEnd(10), "turning=" + turning,
      "distinct axes=" + String(axes.size).padStart(2),
      "distinct +/- patterns=" + String(pats.size).padStart(2),
      pats.size > 1 ? " <-- the lobes sweep" : " <-- held still");
  }
}
