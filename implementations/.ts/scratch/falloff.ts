/**
 * HOW THE SOURCE'S EXCESS ACTUALLY FALLS OFF - measured against 1/r^2 rather than eyeballed.
 *
 * Flux conservation alone gives 1/r^2. A medium that absorbs gives exp(-r/lambda)/r, and at the
 * measured lambda of about 1.5 cells that is 1e-4 of the peak by r = 14. The 1s picture shows
 * neither: it is nearly uniform. So the profile is taken here, for the monopole (l=0, one sign
 * on every exit) and for the dipole (l=1, +z against -z), because a monopole INJECTS net
 * polarity into the box and a dipole does not - and that difference is the likely reason.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { emit, grid, step } from "../src/lib/Vlasov2.ts";
import { derive, OCCUPANCY } from "./derived.ts";
const g: any = GEOMETRIES["fcc-12"], N = 41, C = 20, DEG = g.DEG;
const o = derive(g);
const P4 = [1, 1, -1, -1];

const run = (label: string, exits: (d: number) => number) => {
  const G = grid(g, N), K = grid(g, N);
  for (const a of G.n) a.fill(OCCUPANCY / 4);
  for (const a of K.n) a.fill(OCCUPANCY / 4);
  for (let t = 0; t < 250; t++) {
    emit(G, { at: [C, C, C], radius: 1, exits, amount: 0.5 });
    step(G, o); step(K, o);
  }
  const pol = (nn: any, c: number) => { const b = c * DEG; let v = 0;
    for (let s = 0; s < 4; s++) for (let d = 0; d < DEG; d++) v += nn[s][b + d] * P4[s]; return v; };
  const prof: number[] = [], amp: number[] = [], rs = [1,2,3,4,6,8,10,12,14,16];
  for (const r of rs) {
    let sum = 0, mag = 0, cnt = 0;
    for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) for (let z = 0; z < N; z++) {
      const d = Math.hypot(x-C, y-C, z-C);
      if (Math.abs(d - r) > 0.5) continue;
      const c = (x*N+y)*N+z;
      const dv = pol(G.n, c) - pol(K.n, c); sum += dv; mag += Math.abs(dv); cnt++;
    }
    prof.push(sum / Math.max(1, cnt)); amp.push(mag / Math.max(1, cnt));
  }
  console.log(`\n${label}`);
  console.log("  r      net (signed)   |excess|      |excess| x r^2   ratio to r=2");

  const a2 = amp[1] || 1;
  rs.forEach((r, i) => console.log(
    `  ${String(r).padStart(2)}   ${prof[i].toExponential(3).padStart(11)}   ` +
    `${amp[i].toExponential(3).padStart(11)}   ${(amp[i]*r*r).toExponential(3).padStart(13)}   ` +
    `${(amp[i]/a2).toFixed(4)}`));
  /* what 1/r^2 would give, normalised at r=2 */
  console.log("  if it were 1/r^2, the last column would be " +
    rs.map(r => (4/(r*r)).toFixed(3)).join(" "));
};

run("MONOPOLE  (l=0: same sign on every exit - net polarity injected)", () => 1);
/*
 * A REAL DIPOLE, which the last one was not. `u_z >= 0` puts the four EQUATORIAL exits - the
 * ones with u_z exactly nought - on the positive side, so eight exits fired + against four -
 * and the "dipole" was injecting net polarity like a monopole. Its shell mean came out at 1.8
 * where a balanced source gives nought, which is how it was caught. The equator emits nothing.
 */
run("DIPOLE    (l=1: +z against -z, equator silent - nothing net injected)",
    (d) => { const uz = g.U[d]?.[2] ?? 0; return uz > 1e-9 ? 1 : uz < -1e-9 ? -1 : 0; });
