/**
 * WHAT `stir` ACTUALLY MOVES A RAY ONTO, exit by exit and in degrees.
 *
 * `Vlasov2.grid` calls `ring` "the small-angle neighbourhood" and builds it as the SYMMETRIC
 * CLOSURE of `g.turn`: e is a neighbour of d if d turns onto e or e turns onto d. The closure
 * was put there for a good reason - the one-way version scattered preferentially one way round
 * each ring and an isotropic source came out at +x/-x = 0.669 - but a closure can only make the
 * set BIGGER, and nothing in it checks that what it adds is still a small angle.
 *
 * So print it. If a geometry's ring reaches past a right angle, `stir` is not steering there,
 * it is reversing, and every range that depends on it is a different quantity from the one the
 * rule describes.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { grid } from "../src/lib/Vlasov2.ts";

for (const name of ["fcc-12", "icosahedral-12", "cubic-18", "cubic-26"]) {
  const g: any = (GEOMETRIES as any)[name];
  const G = grid(g, 5);
  const ang = (a: number[], b: number[]) =>
    Math.acos(Math.max(-1, Math.min(1, a[0]*b[0] + a[1]*b[1] + (a[2]??0)*(b[2]??0)))) * 180/Math.PI;

  /* every angle the exit set even OFFERS, so the ring can be judged against what was available */
  const offered = new Set<string>();
  for (let e = 1; e < g.DEG; e++) offered.add(ang(g.U[0], g.U[e]).toFixed(0));

  const rows: string[] = [];
  let sum = 0, k = 0, back = 0;
  for (let d = 0; d < g.DEG; d++) for (let q = 0; q < G.ringN[d]; q++) {
    const a = ang(g.U[d], g.U[G.ring[d*g.DEG+q]]);
    sum += a; k++; if (a > 90) back++;
  }
  for (let q = 0; q < G.ringN[0]; q++)
    rows.push(ang(g.U[0], g.U[G.ring[q]]).toFixed(0) + "deg");

  console.log(`${name}  DEG=${g.DEG}  |L|=${Math.hypot(...(g.L?.[0] ?? g.U[0]).map(Number)).toFixed(2)}`);
  console.log(`  exit 0's ring (${G.ringN[0]} of ${g.DEG - 1} others): ${rows.join("  ")}`);
  console.log(`  angles the exit set offers at all: ${[...offered].sort((x,y)=>+x-+y).join("  ")}`);
  console.log(`  mean ${(sum/k).toFixed(0)}deg, and ${(100*back/k).toFixed(0)}% of ring steps turn` +
    ` a ray past a RIGHT ANGLE\n`);
}
