/** which term breaks the symmetry? - an isotropic source has no left */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { emit, grid, step } from "../src/lib/Vlasov2.ts";
const g: any = GEOMETRIES["fcc-12"], N = 27, C = 13;
const Q = [1,-1,1,-1];
const base = { nu: 0.05, sigma: 3.48, cap: 1, tau: 10, shine: 0.05, fold: 0.02, stir: 0.12 };
const CASES: [string, any][] = [
  ["everything",        base],
  ["no stir",           { ...base, stir: 0 }],
  ["no shine",          { ...base, shine: 0 }],
  ["no fold",           { ...base, fold: 0 }],
  ["no turn/shine/fold",{ ...base, stir: 0, shine: 0, fold: 0 }],
  ["streaming only",    { nu: 0.05, sigma: 0, cap: 1, tau: 0, shine: 0, fold: 0, stir: 0 }],
];
console.log("isotropic source, charge ratio between opposite half-spaces\n");
console.log("case                        +x/-x     +y/-y     +z/-z");
for (const [lab, R] of CASES) {
  const G = grid(g, N);
  for (const a of G.n) a.fill(0.0485);
  for (let t = 0; t < 70; t++) {
    emit(G, { at: [C,C,C], radius: 1, exits: () => 1, amount: 0.5 });
    step(G, R);
  }
  let xp=0,xm=0,yp=0,ym=0,zp=0,zm=0;
  for (let x=0;x<N;x++) for (let y=0;y<N;y++) for (let z=0;z<N;z++) {
    const r = Math.hypot(x-C,y-C,z-C); if (r<1.5||r>10) continue;
    const b = ((x*N+y)*N+z)*g.DEG; let v = 0;
    for (let k=0;k<4;k++) for (let d=0;d<g.DEG;d++) v += G.n[k][b+d]*Q[k];
    if (x>C) xp+=v; if (x<C) xm+=v;
    if (y>C) yp+=v; if (y<C) ym+=v;
    if (z>C) zp+=v; if (z<C) zm+=v;
  }
  const f = (a:number,b:number) => (a/(b||1e-9)).toFixed(3).padStart(9);
  console.log(lab.padEnd(24), f(xp,xm), f(yp,ym), f(zp,zm));
}
console.log("\n  every ratio should be 1.000");
