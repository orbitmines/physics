import { GEOMETRIES } from "../src/lib/Local.ts";
import { grid, step } from "../src/lib/Vlasov2.ts";
import { derive } from "./derived.ts";
const g: any = GEOMETRIES["fcc-12"];
for (const [N, shine, carries] of [[41, 0.02, "polarity"], [61, 0, "inherit"], [61, 0.02, "polarity"]] as any) {
  const R = { ...derive(g), shine, carries };
  const G = grid(g, N);
  for (const a of G.n) a.fill(0.1945 / 4);
  step(G, R);                                  // warm
  const t0 = Date.now();
  const K = 5;
  for (let i = 0; i < K; i++) step(G, R);
  const ms = (Date.now() - t0) / K;
  console.log(`N=${N} shine=${shine}  ${ms.toFixed(0)} ms/step`);
}
