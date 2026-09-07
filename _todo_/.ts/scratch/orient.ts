/** which way does the rendered dipole point? - section's own indices, measured */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { emit, grid, polarity, section, step } from "../src/lib/Vlasov2.ts";
const g: any = GEOMETRIES["fcc-12"], N = 27, C = 13, R = 10, PX = 2*R+1;
const leg = (l:number,m:number,x:number) => l===1&&m===0 ? x : 1;
const G = grid(g, N);
for (const a of G.n) a.fill(0.0485);
const axis = [0,0,1];
const acc = new Float64Array(PX*PX);
for (let t = 0; t < 90; t++) {
  emit(G, { at: [C,C,C], radius: 1,
    exits: (d) => { const u = g.U[d]; const mg = Math.hypot(u[0],u[1],u[2]??0)||1;
      const y = leg(1,0,((u[2]??0))/mg); return Math.abs(y)<1e-9?0:(y>0?1:-1); },
    amountAt: (d) => { const u = g.U[d]; const mg = Math.hypot(u[0],u[1],u[2]??0)||1;
      return Math.abs(leg(1,0,((u[2]??0))/mg))*0.5; },
    amount: 0.5 });
  step(G, { nu: 0.05, sigma: 3.48, cap: 1, tau: 10, shine: 0.05, fold: 0.02, stir: 0.12 });
  if (t > 30) { const s = polarity(G, R); for (let i=0;i<acc.length;i++) acc[i]+=s[i]; }
}
/* the section's index layout: acc[row*PX+col].  which index carries the sign flip? */
let rowP=0,rowM=0,colP=0,colM=0,dgP=0,dgM=0;
for (let row=0; row<PX; row++) for (let col=0; col<PX; col++) {
  const v = acc[row*PX+col];
  if (row>R) rowP+=v; if (row<R) rowM+=v;
  if (col>R) colP+=v; if (col<R) colM+=v;
  if (row-R > col-R) dgP+=v; if (row-R < col-R) dgM+=v;
}
console.log("the accumulated POLARITY of a p_z source (axis = z):\n");
console.log(`  row > R : ${rowP.toFixed(2).padStart(9)}    row < R : ${rowM.toFixed(2).padStart(9)}`);
console.log(`  col > R : ${colP.toFixed(2).padStart(9)}    col < R : ${colM.toFixed(2).padStart(9)}`);
console.log("\n  section() writes out[(z+R)*PX + (x+R)], so row=z and col=x.");
console.log("  a p_z dipole must flip sign across ROW and be balanced across COL.");
