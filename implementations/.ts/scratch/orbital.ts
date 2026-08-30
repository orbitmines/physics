import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_XOR } from "../src/theories/G^XOR+XOR.ts";
const ballistic = (t: any) => (t as any).without("CREATION").called(`${t.name} (ballistic)`);

export type Shape = "radial" | "azimuthal" | "axial";

/**
 * THE NUCLEUS'S FIELD, LAID DOWN RATHER THAN RADIATED — the stand-in `tests/steering.ts`
 * already justifies: a field is maintained by something far away, and a source on a cubic
 * lattice only ever radiates along its own six exits, so nothing fills space on its own.
 *
 * WHAT IS PUT IN. A direction at each point (`shape`) and a SIGN that alternates every
 * `period/2` cells of radius — which is what a source flipping its polarity every
 * `period/2` ticks HAS streaming away from it, one cell a tick. `turning` comes the whole
 * pattern round the ring, one step per `turning` ticks.
 */
const impose = (w: any, g: any, C: number, tick: number, o: {
  shape: Shape; period: number; turning: number; thin: number;
}) => {
  const half = Math.max(1, o.period >> 1);
  const spin = o.turning ? (tick * o.turning) % 4 : 0;      // quarter turns about z
  w.backend.forEachLocal((n: number) => {
    const l: any = w.locals[n];
    if (l.source) return;
    const at = w.embedding.at(l); if (!at) return;
    const x = at[0]-C, y = at[1]-C, z = at[2]-C;
    const rr = Math.hypot(x, y, z);
    if (rr < 1 || rr > 28) return;
    if (o.thin > 1 && ((at[0]*3+at[1]*5+at[2]*7)%o.thin+o.thin)%o.thin !== 0) return;
    /* the direction the field points here */
    let v = o.shape === "radial" ? [x, y, z]
      : o.shape === "azimuthal" ? [-y, x, 0]
      : [0, 0, 1];
    /* the whole pattern comes round the ring: quarter turns about z */
    for (let k = 0; k < spin; k++) v = [-v[1], v[0], v[2]];
    const m = Math.hypot(...v); if (m < 1e-9) return;
    /* the sign alternates every half period of RADIUS - the flipping source's shells */
    const sgn = (Math.floor(rr / half) % 2) ? -1 : 1;
    /* ONE WAY, never a pair: a pair holds oncoming traffic and annihilates itself */
    let best = -1, dot = 0;
    for (let d = 0; d < g.DEG; d++) {
      const u = g.U[d]; if (!u) continue;
      const c = (u[0]*v[0] + u[1]*v[1] + (u[2]??0)*v[2]) / m;
      if (c > dot) { dot = c; best = d; }
    }
    if (best < 0) return;
    for (let d = 0; d < g.DEG; d++) {
      const r = l.rays[d]; if (!r) continue;
      if (r.active && r.charge) continue;                  // never overwrite the electron
      if (d === best) { r.active = true; r.polarity = sgn; r.charge = undefined; }
      else r.active = false;
    }
  });
};

export const orbital = (o: {
  geom: string; N: number; T: number; r0: number; q: number;
  shape: Shape; period: number; turning: number; thin: number;
}) => {
  const g: any = (GEOMETRIES as any)[o.geom];
  const C = (o.N - 1) / 2;
  const w: any = new World({ theory: ballistic(G_XOR_XOR), geometry: g, N: o.N, seed: 1,
    boundary: "absorb", slotUniformRng: true } as any);
  const lay = (t: number) => impose(w, g, C, t, o);
  lay(0);
  const eq = (v:number[],u:number[]) => v.every((x,i)=>Math.abs(x-u[i])<1e-9);
  const yp = g.exits.findIndex((v:number[]) => eq(v,[0,1,0]));
  let seat:any;
  for (const l of w.locals) { const at = w.embedding.at(l as any);
    if (at && at[0]===C+o.r0 && at[1]===C && at[2]===C) { seat=l; break; } }
  const r:any = seat.rays[yp];
  r.active = true; r.charge = o.q; r.polarity = 1; r.gyrophase = 0;

  const path: number[][] = [];
  let here = [C + o.r0, C, C];
  for (let t = 0; t < o.T; t++) {
    w.tick(); lay(t + 1);
    let at:any;
    for (const l of w.embedding.within(here, 2)) {
      let hit = false;
      for (const ry of (l as any).rays) if (ry.active && ry.charge) { hit = true; break; }
      if (hit) { at = w.embedding.at(l as any); break; }
    }
    if (!at) break;
    here = at.slice();
    path.push([at[0]-C, at[1]-C, at[2]-C]);
  }
  return { path, g };
};

if (process.argv[1].endsWith("orbital.ts")) {
  for (const shape of ["radial","azimuthal","axial"] as Shape[])
    for (const period of [4, 8]) {
      const { path } = orbital({ geom: "cubic-6", N: 41, T: 200, r0: 5, q: 1,
        shape, period, turning: 0, thin: 1 });
      const rad = path.map(p => Math.hypot(...p));
      console.log(`${shape} period=${period}`.padEnd(24),
        "alive=" + String(path.length).padStart(4),
        "r min=" + (rad.length?Math.min(...rad).toFixed(1):"-").padStart(5),
        "max=" + (rad.length?Math.max(...rad).toFixed(1):"-").padStart(5),
        "mean=" + (rad.length?(rad.reduce((a,b)=>a+b,0)/rad.length).toFixed(1):"-"));
    }
}
