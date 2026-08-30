import { GEOMETRIES } from "../src/lib/Local.ts";
for (const name of ["cubic-6","fcc-12","cubic-18","cubic-26","square-4","triangular-6"]) {
  const g: any = (GEOMETRIES as any)[name];
  if (!g.CYCLE) continue;
  /* WHAT `firing()` DOES: recompute the equator of a new axis, stepping round the ring */
  const byAxis: number[] = [];
  for (let k = 0; k < g.CYCLE; k++) {
    const axis = g.RING.length ? g.U[g.RING[k]] : g.ringAxis;
    byAxis.push(g.equator(axis).length);
  }
  /* WHAT `visuals/LATTICE.ts` DOES: turn the sheet member by member about an axis in it */
  const base = g.equator(g.sheetAxis);
  const byMember: number[] = [];
  const about = base.length ? g.U[base[0]] : null;
  for (let k = 0; k < g.CYCLE; k++) {
    const lit = new Set<string>();
    for (const d of base) { let e = d; for (let i = 0; i < k; i++) e = g.turn(e, about); 
      lit.add(g.exits[e].join(",")); }
    byMember.push(lit.size);
  }
  console.log(name.padEnd(14), "SHEET=" + String(g.SHEET).padStart(2),
    "| firing() equator sizes:", JSON.stringify(byAxis),
    "| sheet turned member-wise:", JSON.stringify(byMember));
}
