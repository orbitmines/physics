import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_XOR } from "../src/theories/G^XOR+XOR.ts";

const ballistic = (t: any) => (t as any).without("CREATION").called(`${t.name} (ballistic)`);

/** a uniform field along `axis` (a unit exit direction), laid as the +/- ray pair, thinned */
const impose = (w: any, g: any, sign: number, ax: number[], thin = 1) => {
  const eq = (v: number[], u: number[]) => v.every((x, i) => Math.abs(x - u[i]) < 1e-9);
  const dp = g.exits.findIndex((v: number[]) => eq(v, ax));
  const dm = g.exits.findIndex((v: number[]) => eq(v, ax.map(x => -x)));
  w.backend.forEachLocal((n: number) => {
    const l: any = w.locals[n];
    if (l.source) return;
    const at = w.embedding.at(l);
    if (thin > 1 && at && ((at[0]*3 + at[1]*5 + (at[2]??0)*7) % thin + thin) % thin !== 0) return;
    const a = l.rays[dp], b = l.rays[dm];
    /* never overwrite a slot a charge is riding in */
    if (a && !(a.active && a.charge)) { a.active = true; a.polarity = sign; a.charge = undefined; }
    if (b && !(b.active && b.charge)) { b.active = true; b.polarity = -sign; b.charge = undefined; }
  });
};

export const fly = (o: {
  geom: string; N: number; T: number; q: number; thin: number;
  /** ticks between polarity reversals of the field; 0 = never flip */
  flip: number;
  /** which exit index to launch along; default: first exit perpendicular to the axis */
  launch?: number;
  axis?: number[];
}) => {
  const g: any = (GEOMETRIES as any)[o.geom];
  const C = (o.N - 1) / 2;
  const ax = o.axis ?? (g.D === 3 ? [1,0,0] : [0,0,1]);
  const w: any = new World({ theory: ballistic(G_XOR_XOR), geometry: g, N: o.N, seed: 1,
    boundary: "absorb", slotUniformRng: true } as any);

  const signAt = (t: number) => (o.flip ? (Math.floor(t / o.flip) % 2 ? -1 : 1) : 1);
  const lay = (t: number) => impose(w, g, signAt(t), ax, o.thin);
  lay(0);

  /* launch perpendicular to the axis */
  const dir = o.launch ?? g.exits.findIndex((v: number[]) =>
    Math.abs(v.reduce((s: number, x: number, i: number) => s + x * (ax[i] ?? 0), 0)) < 1e-9);
  let seat: any;
  for (const l of w.locals) {
    const at = w.embedding.at(l as any);
    if (at && at[0] === C && at[1] === C && (g.D < 3 || at[2] === C)) { seat = l; break; }
  }
  const r: any = seat.rays[dir];
  r.active = true; r.charge = o.q; r.polarity = 1; r.gyrophase = 0;

  const path: number[][] = [];
  let turned = 0;
  for (let t = 0; t < o.T; t++) {
    w.tick();
    lay(t + 1);
    let at: any, ray: any;
    for (const l of w.locals) {
      for (const ry of (l as any).rays) if (ry.active && ry.charge) { ray = ry; break; }
      if (ray) { at = w.embedding.at(l as any); break; }
    }
    if (!at) break;
    turned = ray.turned ?? 0;
    path.push(at.map((x: number, i: number) => x - C));
  }
  return { path, turned, CYCLE: g.CYCLE, D: g.D };
};

if (process.argv[1].endsWith("orbit.ts")) {
  for (const geom of ["cubic-6", "fcc-12", "cubic-18"]) {
    for (const thin of [1, 2, 4]) {
      const r = fly({ geom, N: 41, T: 60, q: 1, thin, flip: 0 });
      const rad = r.path.map(p => Math.hypot(...p));
      console.log(geom.padEnd(10), "thin=" + thin, "CYCLE=" + r.CYCLE,
        "alive=" + r.path.length, "turned=" + r.turned,
        "maxr=" + Math.max(0, ...rad).toFixed(1),
        "path=", JSON.stringify(r.path.slice(0, 14)));
    }
  }
}
