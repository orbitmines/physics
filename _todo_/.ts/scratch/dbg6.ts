import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_XOR } from "../src/theories/G^XOR+XOR.ts";
const ballistic = (t: any) => (t as any).without("CREATION").called(`${t.name} (ballistic)`);
const g: any = (GEOMETRIES as any)["cubic-6"];
const N = 61, C = 30;
const eq=(v:number[],u:number[])=>v.every((x,i)=>Math.abs(x-u[i])<1e-9);
const zp = g.exits.findIndex((v:number[])=>eq(v,[0,0,1]));
const zm = g.exits.findIndex((v:number[])=>eq(v,[0,0,-1]));
const xp = g.exits.findIndex((v:number[])=>eq(v,[1,0,0]));
const run = (thin: number, T: number) => {
  const w: any = new World({ theory: ballistic(G_XOR_XOR), geometry: g, N, seed: 1,
    boundary: "absorb", slotUniformRng: true } as any);
  /* ONE-WAY field: every point carries a +z ray, nothing on -z, so no facing pairs */
  const lay = () => w.backend.forEachLocal((n:number) => {
    const l:any = w.locals[n]; if (l.source) return;
    const at = w.embedding.at(l); if (!at) return;
    if (thin>1 && ((at[0]*3+at[1]*5+at[2]*7)%thin+thin)%thin !== 0) return;
    const a=l.rays[zp], b=l.rays[zm];
    if (b && !(b.active && b.charge)) b.active = false;
    if (a && !(a.active && a.charge)) { a.active=true; a.polarity=1; a.charge=undefined; }
  });
  lay();
  let seat:any;
  for (const l of w.locals) { const at=w.embedding.at(l as any);
    if (at && at[0]===C && at[1]===C && at[2]===C) { seat=l; break; } }
  const r:any = seat.rays[xp]; r.active=true; r.charge=1; r.polarity=1; r.gyrophase=0;
  const path:number[][]=[]; let turned=0;
  for (let t=0;t<T;t++) {
    w.tick(); lay();
    let at:any, ray:any;
    for (const l of w.locals) { for (const ry of (l as any).rays)
      if (ry.active && ry.charge) { ray=ry; break; } if(ray){at=w.embedding.at(l as any);break;} }
    if(!at) break; turned=ray.turned??0; path.push(at.map((x:number)=>x-C));
  }
  console.log("thin="+thin, "alive="+path.length, "turned="+turned,
    "path="+JSON.stringify(path.slice(0,20)));
};
for (const thin of [1,2,3,4]) run(thin, 40);
