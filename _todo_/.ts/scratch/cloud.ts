import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR } from "../src/theories/G^XOR.ts";
const ballistic = (t: any) => (t as any).without("CREATION").called(`${t.name} (ballistic)`);

/** run one source and accumulate where its own rays are found, per cell, over T ticks */
export const cloud = (o: {
  geom: string; N: number; T: number; warm: number;
  period: number; dwell: number; axis?: number[]; emission?: "isotropic"|"sheet";
}) => {
  const g: any = (GEOMETRIES as any)[o.geom];
  const C = (o.N - 1) / 2;
  const w: any = new World({ theory: ballistic(G_XOR), geometry: g, N: o.N, seed: 1,
    boundary: "absorb", slotUniformRng: true } as any);
  const s = w.add({ at: [C, C, C].slice(0, g.D), radius: 0, emits: 1,
    period: o.period, dwellTicks: o.dwell, axis: o.axis,
    emission: o.emission ?? "isotropic", absorbs: true } as any);

  /* density and signed density, per cell */
  const n = new Map<string, number>(), sgn = new Map<string, number>();
  for (let t = 0; t < o.T; t++) {
    w.tick();
    if (t < o.warm) continue;
    for (const l of w.locals) {
      const at = w.embedding.at(l as any); if (!at) continue;
      const k = at.map((x: number) => x - C).join(",");
      for (const r of (l as any).rays) {
        if (!r.active || r.from !== s.id) continue;
        n.set(k, (n.get(k) ?? 0) + 1);
        sgn.set(k, (sgn.get(k) ?? 0) + (r.polarity ?? 0));
      }
    }
  }
  return { n, sgn, g, C };
};

if (process.argv[1].endsWith("cloud.ts")) {
  const [period, dwell] = [Number(process.argv[2] ?? 6), Number(process.argv[3] ?? 3)];
  const useAxis = process.argv[4] === "axis";
  const r = cloud({ geom: "cubic-6", N: 41, T: 80, warm: 20,
    period, dwell, axis: useAxis ? [0,0,1] : undefined });
  /* radial profile: mean count and mean sign per integer radius */
  const cnt = new Map<number, number>(), tot = new Map<number, number>(), sg = new Map<number, number>();
  for (const [k, v] of r.n) {
    const p = k.split(",").map(Number);
    const rad = Math.round(Math.hypot(...p));
    tot.set(rad, (tot.get(rad) ?? 0) + v);
    cnt.set(rad, (cnt.get(rad) ?? 0) + 1);
    sg.set(rad, (sg.get(rad) ?? 0) + (r.sgn.get(k) ?? 0));
  }
  console.log(`period=${period} dwell=${dwell} axis=${useAxis}`);
  console.log("  r   cells   density   meansign");
  for (let rad = 0; rad <= 22; rad++) {
    const c = cnt.get(rad) ?? 0; if (!c) continue;
    console.log(String(rad).padStart(3), String(c).padStart(6),
      ((tot.get(rad)!)/c).toFixed(2).padStart(9), ((sg.get(rad)!)/c).toFixed(2).padStart(10));
  }
}
