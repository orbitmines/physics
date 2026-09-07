import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR } from "../src/theories/G^XOR.ts";
const MARK = 999;
const g: any = (GEOMETRIES as any)["cubic-6"];
const N = 21, C = 10;
const w: any = new World({ theory: G_XOR, geometry: g, N, seed: 1,
  boundary: "absorb", slotUniformRng: true } as any);
for (let t = 0; t < 12; t++) w.tick();
console.log("size after warm", w.size, "locals", w.locals.length);
let seat:any;
for (const l of w.locals) { const at=w.embedding.at(l as any);
  if (at && at[0]===C&&at[1]===C&&at[2]===C) { seat=l; break; } }
console.log("seat?", !!seat);
const d = g.exits.findIndex((v:number[])=>v[0]===1&&v[1]===0&&v[2]===0);
const r:any = seat.rays[d];
console.log("before: active",r.active,"pol",r.polarity,"from",r.from);
r.active=true; r.polarity=1; r.charge=undefined; r.from=MARK;
console.log("after set: active",r.active,"from",r.from);
for (let t=0;t<4;t++) {
  w.tick();
  let n=0, anyActive=0, marks:string[]=[];
  for (const l of w.locals) for (const ry of (l as any).rays) {
    if (ry.active) anyActive++;
    if (ry.from===MARK) { n++; const at=w.embedding.at(l as any);
      if(at&&marks.length<3) marks.push(`${at.map((x:number)=>x-C)} act=${ry.active}`); }
  }
  console.log("tick",t,"marked=",n,"active total=",anyActive,marks.join(" | "));
}
