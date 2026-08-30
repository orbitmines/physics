/** which way does the emitted dipole actually point? - measured, not read off a picture */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { emit, grid } from "../src/lib/Vlasov2.ts";
const g: any = GEOMETRIES["fcc-12"], N = 11, C = 5;
const leg = (l: number, m: number, x: number): number => (l === 1 && m === 0) ? x : 1;
const G = grid(g, N);
const axis = [0,0,1];
emit(G, { at: [C,C,C], radius: 1,
  exits: (d) => { const u = g.U[d]; if (!u) return 0;
    const mg = Math.hypot(u[0],u[1],u[2]??0)||1;
    const y = leg(1,0,(u[0]*axis[0]+u[1]*axis[1]+(u[2]??0)*axis[2])/mg);
    return Math.abs(y)<1e-9 ? 0 : (y>0?1:-1); },
  amountAt: (d) => { const u = g.U[d]; if (!u) return 0;
    const mg = Math.hypot(u[0],u[1],u[2]??0)||1;
    return Math.abs(leg(1,0,(u[0]*axis[0]+u[1]*axis[1]+(u[2]??0)*axis[2])/mg))*0.5; },
  amount: 0.5 });
console.log("what the source put on each exit of its own cell:\n");
console.log(" exit   direction      cos to z    charge put there");
const b0 = ((C*N+C)*N+C)*g.DEG;
const Q = [1,-1,1,-1];
for (let d = 0; d < g.DEG; d++) {
  const u = g.U[d]; const mg = Math.hypot(u[0],u[1],u[2]??0)||1;
  let q = 0; for (let s = 0; s < 4; s++) q += G.n[s][b0+d]*Q[s];
  console.log(String(d).padStart(5), JSON.stringify(u.map((x:number)=>+x.toFixed(2))).padStart(18),
    ((u[2]??0)/mg).toFixed(3).padStart(10), (q>=0?"+":"")+q.toFixed(3));
}
/* and where that lands after one step of pure streaming */
let up = 0, dn = 0, lf = 0, rt = 0;
for (let d = 0; d < g.DEG; d++) {
  const u = g.U[d]; let q = 0;
  for (let s = 0; s < 4; s++) q += G.n[s][b0+d]*Q[s];
  if ((u[2]??0) > 0) up += q; if ((u[2]??0) < 0) dn += q;
  if (u[0] > 0) rt += q; if (u[0] < 0) lf += q;
}
console.log(`\n  charge heading +z: ${up.toFixed(3)}   -z: ${dn.toFixed(3)}   <- should differ`);
console.log(`  charge heading +x: ${rt.toFixed(3)}   -x: ${lf.toFixed(3)}   <- should be equal`);
