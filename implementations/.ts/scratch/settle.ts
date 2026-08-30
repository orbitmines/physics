/** what fails to settle, and where - a pulsing source should reach a balance */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { emit, grid, step } from "../src/lib/Vlasov2.ts";
import { derive, OCCUPANCY } from "./derived.ts";
const g: any = GEOMETRIES["fcc-12"], N = 25, C = 12;
const R = derive(g);
const G = grid(g, N);
for (const a of G.n) a.fill(OCCUPANCY / 4);
console.log("tick   total density   total |space|   max space   near-source rho   far rho");
for (let t = 1; t <= 1600; t++) {
  emit(G, { at: [C,C,C], radius: 1,
    exits: (d) => { const u = g.U[d], mg = Math.hypot(u[0],u[1],u[2]??0)||1;
      const c2 = (u[2]??0)/mg; return c2 > 1e-9 ? 1 : c2 < -1e-9 ? -1 : 0; },
    amount: 0.5 });
  step(G, R);
  if (t % 200) continue;
  let tot = 0, sp = 0, mx = 0, near = 0, nn = 0, far = 0, nf = 0;
  for (let c = 0; c < G.cells; c++) { sp += G.space[c]; mx = Math.max(mx, G.space[c]); }
  for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) for (let z = 0; z < N; z++) {
    const c = (x*N+y)*N+z, b0 = c*g.DEG;
    let v = 0;
    for (let k = 0; k < 4; k++) for (let d = 0; d < g.DEG; d++) v += G.n[k][b0+d];
    tot += v;
    const r = Math.hypot(x-C,y-C,z-C);
    if (r > 1.5 && r < 4) { near += v/g.DEG; nn++; }
    if (r > 8) { far += v/g.DEG; nf++; }
  }
  console.log(String(t).padStart(4), (tot/G.cells/g.DEG).toFixed(4).padStart(14),
    (sp/G.cells).toFixed(4).padStart(15), mx.toFixed(3).padStart(11),
    (near/nn).toFixed(4).padStart(17), (far/nf).toFixed(4).padStart(9));
}
