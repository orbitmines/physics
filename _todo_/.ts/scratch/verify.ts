import { GEOMETRIES } from "../src/lib/Local.ts";
import { firing } from "../src/lib/Source.ts";
const mk = (turning: number) => ({ emission: "sheet", turning } as any);
for (const name of ["cubic-6","fcc-12","cubic-18","cubic-26","square-4","triangular-6"]) {
  const g: any = (GEOMETRIES as any)[name];
  if (!g.CYCLE) continue;
  const sizes = [], dirs: string[] = [];
  for (let t = 0; t < g.CYCLE; t++) {
    const f = firing(g, mk(0), t);
    sizes.push(f.length);
    if (t < 2) dirs.push("[" + f.map((d:number)=>g.exits[d].join("")).join(" ") + "]");
  }
  const slow = [0,1,2,3,4,5].map(t => firing(g, mk(0.5), t).length);
  console.log(name.padEnd(14), "SHEET=" + String(g.SHEET).padStart(2),
    "| firing():", JSON.stringify(sizes),
    "| turning=0.5:", JSON.stringify(slow), "|", dirs.join(" "));
}
