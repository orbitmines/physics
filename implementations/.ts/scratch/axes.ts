/**
 * WHICH AXES A TURN IS ALLOWED ABOUT - which is what decides how far a `stir` step moves a ray.
 *
 * `Vlasov2.grid` builds its ring from `g.turn(d, g.U[b])` over the EXITS ONLY. `turn` steps
 * along the equator of the axis it is given, and on fcc-12 the equator of a <110> axis holds
 * just TWO exits, so the step is a 180 degree flip and everything off that equator lands 120
 * degrees away. Hence a "small-angle neighbourhood" of {120,120,180,120,120}.
 *
 * The geometry offers more axes than its exits. Rotating about a body diagonal <111> cycles
 * x->y->z, which carries (1,1,0) to (0,1,1) - sixty degrees, the small angle that is missing.
 * So: is the 60-degree neighbour unreachable on fcc, or merely never asked for?
 */
import { GEOMETRIES } from "../src/lib/Local.ts";

const ang = (a: number[], b: number[]) =>
  Math.acos(Math.max(-1, Math.min(1, a[0]*b[0] + a[1]*b[1] + (a[2]??0)*(b[2]??0)))) * 180/Math.PI;

for (const name of ["fcc-12", "icosahedral-12", "cubic-18", "cubic-26"]) {
  const g: any = (GEOMETRIES as any)[name];
  const axisSets: Record<string, number[][]> = {
    "exits only (what Vlasov2 uses)": g.U.map((u: number[]) => u),
    "+ coordinate axes":             [...g.U, [1,0,0], [0,1,0], [0,0,1]],
    "+ body diagonals too":          [...g.U, [1,0,0], [0,1,0], [0,0,1],
                                      [1,1,1], [1,1,-1], [1,-1,1], [-1,1,1]],
  };
  console.log(`${name}`);
  for (const [label, axes] of Object.entries(axisSets)) {
    const near: Set<number>[] = Array.from({ length: g.DEG }, () => new Set<number>());
    for (const axis of axes) {
      const n = Math.hypot(axis[0], axis[1], axis[2] ?? 0); if (!n) continue;
      const a = [axis[0]/n, axis[1]/n, (axis[2]??0)/n];
      for (let d = 0; d < g.DEG; d++) {
        const t = g.turn(d, a);
        if (t !== undefined && t !== d && t >= 0) { near[d].add(t); near[t].add(d); }
      }
    }
    const got = [...near[0]].map(e => ang(g.U[0], g.U[e]).toFixed(0)).sort((x,y)=>+x-+y);
    let sum = 0, k = 0;
    for (let d = 0; d < g.DEG; d++) for (const e of near[d]) { sum += ang(g.U[d], g.U[e]); k++; }
    console.log(`  ${label.padEnd(32)} ring of exit 0: [${got.join(" ")}]  mean ${(sum/Math.max(1,k)).toFixed(0)}deg`);
  }
  console.log();
}
