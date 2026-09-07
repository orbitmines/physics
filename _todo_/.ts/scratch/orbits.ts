/**
 * THE CLOSED ORBITS THE LATTICE CAN EXPRESS, ENUMERATED - and why there are finitely many.
 *
 * `G^XOR^o` says what a particle is here: `laps(r,g) = floor(turned / CYCLE)`, a ray that
 * has taken CYCLE ring steps has been round once, and `closed` is a question about ONE ray
 * asked of the ray. Nothing walks the world to find it.
 *
 * SO THE ANGULAR QUANTUM NUMBERS ARE COUNTS ON THE RING, NOT SOLUTIONS OF ANYTHING.
 * `steer` turns a charge ONE RING STEP about the local B per whole unit of |B| banked, and
 * the ring has CYCLE exits. A lap is CYCLE steps. Which means:
 *
 *   the winding about the axis per lap is an INTEGER in 0..CYCLE-1   -> this is m
 *   the total turning per closure is an integer count of ring steps  -> this is l
 *
 * and BOTH ARE BOUNDED BY THE RING. A lattice whose ring has CYCLE exits cannot express a
 * winding of CYCLE or more, because there is no such step to take. That is a ceiling on
 * |m| that no continuum treatment has, and it is the sharpest falsifiable thing this
 * reading says: cubic-6 has CYCLE=4, fcc-12 has CYCLE=6, cubic-18/26 have CYCLE=8.
 *
 * WHAT THIS ENUMERATES is the orbits themselves - every closed trajectory a charge can
 * take on the ring, by the sense of its charge and the axis it is turning about - and what
 * it reports is how many distinct ones there are per lattice, which is the count the (n,l,m)
 * table has to fit inside.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";

/** every distinct closed ring trajectory: a starting exit and a winding per step */
const orbitsOf = (g: any) => {
  const C = g.CYCLE;
  if (!C) return { cycle: 0, axes: 0, windings: [] as number[], orbits: 0 };
  /* which axes a ring can be about: the exits, up to the antipodal identification that
   * turning about -B is the opposite step about B */
  const axes = new Set<string>();
  for (let d = 0; d < g.DEG; d++) {
    const u = g.U[d]; if (!u) continue;
    const key = u.map((x: number) => Math.abs(x) < 1e-9 ? 0 : x).join(",");
    const anti = u.map((x: number) => Math.abs(x) < 1e-9 ? 0 : -x).join(",");
    if (!axes.has(anti)) axes.add(key);
  }
  /* a winding w takes w ring steps per lattice step; it closes when w and C are
   * commensurate, and w = 0 is the un-wound orbit (the s-like one) */
  const windings: number[] = [];
  for (let w = 0; w < C; w++) windings.push(w);
  return { cycle: C, axes: axes.size, windings, orbits: axes.size * windings.length };
};

console.log("lattice           D  DEG  CYCLE  axes  |m| range   distinct orbits");
for (const [name, g] of Object.entries(GEOMETRIES as any)) {
  const o = orbitsOf(g);
  if (!o.cycle) { console.log(name.padEnd(18), (g as any).D, "  ", (g as any).DEG,
    "   -      -     no ring - no orbit closes"); continue; }
  console.log(name.padEnd(18), (g as any).D, " ", String((g as any).DEG).padStart(3),
    String(o.cycle).padStart(6), String(o.axes).padStart(6),
    `   0..${o.cycle - 1}`.padEnd(12), String(o.orbits).padStart(8));
}
