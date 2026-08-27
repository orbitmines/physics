import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_XOR } from "../src/theories/G^XOR+XOR.ts";
const ballistic = (t: any) => (t as any).without("CREATION").called(`${t.name} (ballistic)`);

/** one polarity source at the centre (the nucleus) and one charge in its field */
export const atom = (o: {
  geom: string; N: number; T: number; warm: number;
  period: number; dwell: number; r0: number; q: number;
  axis?: number[]; emission?: "isotropic" | "sheet";
}) => {
  const g: any = (GEOMETRIES as any)[o.geom];
  const C = (o.N - 1) / 2;
  const w: any = new World({ theory: ballistic(G_XOR_XOR), geometry: g, N: o.N, seed: 1,
    boundary: "absorb", slotUniformRng: true } as any);
  const s = w.add({ at: [C, C, C].slice(0, g.D), radius: 1, emits: 1,
    period: o.period, dwellTicks: o.dwell, axis: o.axis,
    emission: o.emission ?? "isotropic", absorbs: false } as any);

  /* let the field fill space before the electron is put in it */
  for (let t = 0; t < o.warm; t++) w.tick();

  /* inject the charge at r0 along +x, moving tangentially (+y) */
  const eq = (v:number[],u:number[]) => v.every((x,i)=>Math.abs(x-u[i])<1e-9);
  const yp = g.exits.findIndex((v:number[]) => eq(v,[0,1,0]));
  let seat:any;
  for (const l of w.locals) { const at = w.embedding.at(l as any);
    if (at && at[0]===C+o.r0 && at[1]===C && at[2]===C) { seat=l; break; } }
  if (!seat) throw new Error("no seat at r0");
  const r:any = seat.rays[yp];
  r.active = true; r.charge = o.q; r.polarity = 1; r.gyrophase = 0;

  const path: number[][] = [];
  for (let t = 0; t < o.T; t++) {
    w.tick();
    let at:any, ray:any;
    for (const l of w.locals) { for (const ry of (l as any).rays)
      if (ry.active && ry.charge) { ray = ry; break; } if (ray) { at = w.embedding.at(l as any); break; } }
    if (!at) break;
    path.push(at.map((x:number)=>x-C));
  }
  return { path, g };
};

if (process.argv[1].endsWith("atom.ts")) {
  for (const period of [2, 4, 8]) for (const r0 of [3, 6]) {
    const { path } = atom({ geom: "cubic-6", N: 61, T: 120, warm: 12,
      period, dwell: Math.max(1, period>>1), r0, q: 1 });
    const rad = path.map(p => Math.hypot(...p));
    console.log(`period=${period} r0=${r0}`.padEnd(20), "alive=" + String(path.length).padStart(4),
      "r: min=" + (rad.length?Math.min(...rad).toFixed(1):"-"),
      "max=" + (rad.length?Math.max(...rad).toFixed(1):"-"),
      "last=" + (rad.length?rad[rad.length-1].toFixed(1):"-"));
  }
}
