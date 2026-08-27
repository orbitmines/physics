import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_XOR } from "../src/theories/G^XOR+XOR.ts";
const ballistic = (t: any) => (t as any).without("CREATION").called(`${t.name} (ballistic)`);
const g: any = (GEOMETRIES as any)["cubic-6"];
const N = 41, C = 20;
const w: any = new World({ theory: ballistic(G_XOR_XOR), geometry: g, N, seed: 1,
  boundary: "absorb", slotUniformRng: true } as any);
console.log("inner steering =", w.world.steering, "locals", w.locals?.length);
const zp = 3, zm = 2, xp = 5;
const lay = () => w.backend.forEachLocal((n:number) => {
  const l:any = w.locals[n]; if (l.source) return;
  const a=l.rays[zp], b=l.rays[zm];
  if (a && !(a.active&&a.charge)) { a.active=true; a.polarity=1; a.charge=undefined; }
  if (b && !(b.active&&b.charge)) { b.active=true; b.polarity=-1; b.charge=undefined; }
});
lay();
let seat:any;
for (const l of w.locals) { const at=w.embedding.at(l as any);
  if (at && at[0]===C-12 && at[1]===C && at[2]===C) { seat=l; break; } }
console.log("seat", !!seat);
const r:any = seat.rays[xp]; r.active=true; r.charge=1; r.polarity=1; r.gyrophase=0;
for (let t=0;t<10;t++) {
  w.tick();
  let n=0, at:any, ray:any;
  for (const l of w.locals) for (const ry of (l as any).rays)
    if (ry.active && ry.charge) { n++; if(!ray){ray=ry; at=w.embedding.at(l as any);} }
  console.log(t,"charged=",n, at? at.map((x:number)=>x-C).join(","):"-",
    "turned=",ray?.turned,"steered=",w.world.steered,"turns=",w.world.turnsTaken);
  lay();
}
