/**
 * THE NEIGHBOURHOOD `steer` ACTUALLY REACHES, against the one the continuum solver uses.
 *
 * In `G^XOR+XOR` the turn axis is `held` - the field a ray has accumulated - which is an
 * arbitrary direction in space, not an exit. `Geometry.turn` then finds no exits exactly
 * perpendicular to it, falls through to the rotation branch, turns by SPIN = 2pi/CYCLE and
 * snaps to the nearest exit. So the lattice's rule is "turn a fixed angle about whichever way
 * the field points".
 *
 * `Vlasov2.grid` instead enumerates `turn(d, U[b])` over the EXITS as axes and takes the
 * symmetric closure. There is no reason those two sets should agree, and on fcc-12 they do not.
 *
 * So sample the real thing: many random axes, and where each exit lands.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { grid } from "../src/lib/Vlasov2.ts";

const ang = (a: number[], b: number[]) =>
  Math.acos(Math.max(-1, Math.min(1, a[0]*b[0] + a[1]*b[1] + (a[2]??0)*(b[2]??0)))) * 180/Math.PI;

let seed = 12345;
const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;

console.log("the set `steer` reaches (random field directions) vs the set Vlasov2 stirs into\n");
for (const name of ["fcc-12", "icosahedral-12", "cubic-18", "cubic-26"]) {
  const g: any = (GEOMETRIES as any)[name];
  const G = grid(g, 5);

  /* what steer does: turn about an arbitrary direction, 20000 of them */
  const hist = new Map<string, number>();
  let sum = 0, k = 0, same = 0;
  for (let t = 0; t < 20000; t++) {
    let x = rnd()*2-1, y = rnd()*2-1, z = rnd()*2-1;
    const n = Math.hypot(x, y, z); if (n < 1e-6) continue;
    x /= n; y /= n; z /= n;
    const d = t % g.DEG, d2 = g.turn(d, [x, y, z]);
    if (d2 === undefined || d2 < 0) continue;
    if (d2 === d) { same++; continue; }
    const a = ang(g.U[d], g.U[d2]);
    hist.set(a.toFixed(0), (hist.get(a.toFixed(0)) ?? 0) + 1);
    sum += a; k++;
  }
  const rows = [...hist.entries()].sort((p, q) => +p[0] - +q[0])
    .map(([a, c]) => `${a}deg:${(100*c/k).toFixed(0)}%`);

  /* what Vlasov2 stirs into */
  let vs = 0, vk = 0;
  for (let d = 0; d < g.DEG; d++) for (let q = 0; q < G.ringN[d]; q++) {
    vs += ang(g.U[d], g.U[G.ring[d*g.DEG+q]]); vk++;
  }
  console.log(`${name}  CYCLE=${g.CYCLE}  SPIN=${(g.SPIN*180/Math.PI).toFixed(0)}deg`);
  /*
   * g1 = <cos theta> over the scattering distribution, which is the number the whole angular
   * range argument rests on: lambda_1 = lambda / (1 - g1). Computed from the sampled
   * distribution rather than from the mean angle, because <cos> is not cos<>.
   */
  let g1 = 0;
  for (const [a, c] of hist) g1 += (c / k) * Math.cos(+a * Math.PI / 180);
  let vg1 = 0;
  for (let d = 0; d < g.DEG; d++) for (let q = 0; q < G.ringN[d]; q++)
    vg1 += Math.cos(ang(g.U[d], g.U[G.ring[d*g.DEG+q]]) * Math.PI / 180);
  vg1 /= vk;
  console.log(`  steer reaches : ${rows.join("  ")}   (mean ${(sum/k).toFixed(0)}deg` +
    `, unturned ${(100*same/(k+same)).toFixed(0)}%)`);
  console.log(`  Vlasov2 stirs : mean ${(vs/vk).toFixed(0)}deg over ${G.ringN[0]} neighbours`);
  console.log(`  g1  rule ${g1 >= 0 ? "+" : ""}${g1.toFixed(3)}   solver ${vg1 >= 0 ? "+" : ""}${vg1.toFixed(3)}` +
    `   lambda1 rule ${(1/(1-g1)).toFixed(2)}x  solver ${(1/(1-vg1)).toFixed(2)}x\n`);
}
