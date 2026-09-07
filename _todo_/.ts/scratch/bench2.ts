import { GEOMETRIES } from "../src/lib/Local.ts";
import { grid, step } from "../src/lib/Vlasov2.ts";
import { derive } from "./derived.ts";
const g: any = GEOMETRIES["fcc-12"];
const base = derive(g);
const time = (label: string, R: any) => {
  const G = grid(g, 61);
  for (const a of G.n) a.fill(0.1945 / 4);
  step(G, R);
  const t0 = Date.now(); const K = 4;
  for (let i = 0; i < K; i++) step(G, R);
  console.log(`${label.padEnd(34)} ${((Date.now() - t0) / K).toFixed(0)} ms/step`);
};
time("everything (shine 0.02)",        { ...base, shine: 0.02, carries: "polarity" });
time("no radiating",                   { ...base, shine: 0 });
time("no radiating, no stir",          { ...base, shine: 0, stir: 0 });
time("no stir, no turn (sigma/tau on)", { ...base, shine: 0, stir: 0, nu: 0 });
time("streaming only",                 { ...base, shine: 0, stir: 0, nu: 0, sigma: 0, tau: 0 });
