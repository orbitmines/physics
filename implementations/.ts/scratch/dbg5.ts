import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_XOR } from "../src/theories/G^XOR+XOR.ts";
const ballistic = (t: any) => (t as any).without("CREATION").called(`${t.name} (ballistic)`);
const run = (geom: string, field: boolean, folds: "none"|"destroy") => {
  const g: any = (GEOMETRIES as any)[geom];
  const N = 41, C = 20;
  const w: any = new World({ theory: ballistic(G_XOR_XOR), geometry: g, N, seed: 1,
    boundary: "absorb", slotUniformRng: true } as any);
  const eq=(v:number[],u:number[])=>v.every((x,i)=>Math.abs(x-u[i])<1e-9);
  const zp = g.exits.findIndex((v:number[])=>eq(v,[0,0,1]));
  const zm = g.exits.findIndex((v:number[])=>eq(v,[0,0,-1]));
  const xp = g.exits.findIndex((v:number[])=>eq(v,[1,0,0]));
  const lay = () => { if(!field) return; w.backend.forEachLocal((n:number) => {
    const l:any = w.locals[n]; if (l.source) return;
    const a=l.rays[zp], b=l.rays[zm];
    if (a && !(a.active&&a.charge)) { a.active=true; a.polarity=1; a.charge=undefined; }
    if (b && !(b.active&&b.charge)) { b.active=true; b.polarity=-1; b.charge=undefined; }
  }); };
  lay();
  let seat:any;
  for (const l of w.locals) { const at=w.embedding.at(l as any);
    if (at && at[0]===C-12 && at[1]===C && at[2]===C) { seat=l; break; } }
  const r:any = seat.rays[xp]; r.active=true; r.charge=1; r.polarity=1; r.gyrophase=0;
  let alive=0, last:any=null, turned=0;
  for (let t=0;t<25;t++) {
    w.tick(); lay();
    let at:any, ray:any;
    for (const l of w.locals) { for (const ry of (l as any).rays)
      if (ry.active && ry.charge) { ray=ry; break; } if(ray){at=w.embedding.at(l as any);break;} }
    if(!at) break; alive++; last=at.map((x:number)=>x-C); turned=ray.turned??0;
  }
  console.log(geom.padEnd(9), "field="+field, "fold="+folds, "alive="+alive, "last="+(last?last.join(","):"-"), "turned="+turned);
};
for (const geom of ["cubic-6","fcc-12"])
  for (const field of [false,true])
    run(geom, field, "destroy");
