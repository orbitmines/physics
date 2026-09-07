import { GEOMETRIES } from "../src/lib/Local.ts";
import { grid, step } from "../src/lib/Vlasov2.ts";
import { derive } from "./derived.ts";
const g: any = GEOMETRIES["fcc-12"];
const R = { ...derive(g), shine: 0.02, carries: "polarity" as const };
const G = grid(g, 41);
for (const a of G.n) a.fill(0.1945 / 4);
for (let i = 0; i < 12; i++) step(G, R);
