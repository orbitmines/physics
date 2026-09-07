/**
 * EACH GEOMETRY'S OWN VACUUM OCCUPANCY - because sigma is 1/occ and occ is not universal.
 *
 * `derive()` defaults to 0.1945, which was measured on fcc-12. Handing that to another lattice
 * sets the absorption wrong and the vacuum runs away: icosahedral-12 settled at 2.53, twelve
 * times over and far past saturation, so the render was a picture of a filled box. The rate has
 * to come from the lattice it is being used on.
 *
 * Solved self-consistently: guess occ, derive sigma from it, run the bare vacuum WRAPPED (an
 * open box grows a bright rim, since a leaky edge lowers rho and so raises room), read what it
 * settles at, and feed that back until it stops moving.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { grid, step } from "../src/lib/Vlasov2.ts";
import { derive } from "./derived.ts";

const N = 17;
console.log("geometry          DEG   self-consistent occupancy   sigma");
for (const name of ["fcc-12", "icosahedral-12", "cubic-18", "cubic-26"]) {
  const g: any = (GEOMETRIES as any)[name];
  if (!g) continue;
  let occ = 0.1945;
  for (let it = 0; it < 12; it++) {
    const R = derive(g, occ);
    const G = grid(g, N, true);                       // wrapped: no edge, no rim
    for (const a of G.n) a.fill(occ / 4);
    for (let t = 0; t < 400; t++) step(G, R);
    let s = 0, c = 0;
    for (let i = 0; i < G.n[0].length; i++) {
      for (let k = 0; k < 4; k++) s += G.n[k][i];
      c++;
    }
    const got = s / c;
    if (!isFinite(got) || got > 0.99) { occ = NaN; break; }
    if (Math.abs(got - occ) < 1e-4) { occ = got; break; }
    occ = 0.5 * occ + 0.5 * got;                      // damped, so it cannot oscillate
  }
  const sig = isFinite(occ) ? 1 / occ : NaN;
  console.log(`${name.padEnd(17)} ${String(g.DEG).padStart(3)}   ${(isFinite(occ) ? occ.toFixed(4) : "saturates").padStart(24)}   ${isFinite(sig) ? sig.toFixed(3) : "-"}`);
}
