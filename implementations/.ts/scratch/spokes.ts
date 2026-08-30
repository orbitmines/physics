/**
 * RELAXING WHAT THE SHEET IS - not the exact equator, but every exit within a band of it.
 *
 * fcc-12's equator is a hexagon of 6, and turning it member by member about one of its own
 * members permutes it onto itself: 1 distinct orientation over a full turn, so the rotation
 * is a symmetry and nothing observable moves. That is a fact about a 6-member sheet on a
 * 12-exit lattice, NOT about the lattice. Widen the sheet past the exact plane and the set
 * is no longer its own image.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";

const dot = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * (b[i] ?? 0), 0);
const unit = (v: number[]) => { const m = Math.hypot(...v); return v.map(x => x / m); };

/** every exit whose angle to the sheet's plane is within `band` - band 0 is the equator */
const spokesOf = (g: any, band: number) => {
  const ax = unit(g.sheetAxis);
  const out: number[] = [];
  for (let d = 0; d < g.DEG; d++) {
    const u = g.U[d]; if (!u) continue;
    if (Math.abs(dot(unit(u as number[]), ax)) <= band + 1e-9) out.push(d);
  }
  return out;
};

for (const name of ["fcc-12", "cubic-6", "cubic-18", "cubic-26"]) {
  const g: any = (GEOMETRIES as any)[name];
  if (!g.CYCLE) continue;
  console.log(`\n${name}  DEG=${g.DEG} CYCLE=${g.CYCLE} SHEET=${g.SHEET}`);
  for (const band of [0, 0.35, 0.5, 0.6, 0.71, 0.82, 1]) {
    const base = spokesOf(g, band);
    if (base.length < 2) continue;
    const about = g.U[base[0]];
    const sets = new Set<string>();
    for (let k = 0; k < g.CYCLE; k++) {
      const lit = new Set<number>();
      for (const d of base) { let e = d; for (let i = 0; i < k; i++) e = g.turn(e, about); lit.add(e); }
      sets.add([...lit].sort((a,b)=>a-b).join("|"));
    }
    /* and whether the sheet keeps its size as it comes round */
    const sizes = new Set([...sets].map(s => s.split("|").length));
    console.log("  band=" + band.toFixed(2), "spokes=" + String(base.length).padStart(2),
      "distinct orientations=" + String(sets.size).padStart(2),
      "sizes=" + JSON.stringify([...sizes]),
      sets.size === 1 ? " <-- symmetry, no-op" : sizes.size === 1 ? " <-- rotates, size fixed" : " <-- size varies");
  }
}
