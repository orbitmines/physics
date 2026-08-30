/**
 * WHERE THE TURN DENSITY DIPS, AGAINST WHERE THE SCHEDULE CHANGES SIGN.
 *
 * 2s renders with a bright core, a dark shell and a bright ring - which is what one radial node
 * looks like. The claim is checkable rather than a reading of a picture: the schedule R_nl
 * changes sign at rho = 2, so at r = n*a0 cells, and radius is retarded time, so the dip should
 * be THERE and not somewhere else. 1s has no sign change and must show no dip at all.
 */
import { readFileSync } from "node:fs";
const lag=(k:number,a:number,x:number):number=>{if(k===0)return 1;if(k===1)return 1+a-x;
  let Lm=1,L=1+a-x;for(let i=1;i<k;i++){const Ln=((2*i+1+a-x)*L-(i+a)*Lm)/(i+1);Lm=L;L=Ln;}return L;};
const Rnl=(n:number,l:number,a0:number,r:number)=>{const rho=2*r/(n*a0);
  return Math.pow(rho,l)*Math.exp(-rho/2)*lag(n-l-1,2*l+1,rho);};
console.log("state   a0     R_nl sign changes at r =        (cells)");
for (const [n,l] of [[1,0],[2,0],[3,0],[4,0]] as [number,number][]) {
  const a0=22/(n*n); const zs:number[]=[];
  let prev=Rnl(n,l,a0,0);
  for (let r=0.25;r<40;r+=0.25){const v=Rnl(n,l,a0,r);
    if (prev!==0 && Math.sign(v)!==Math.sign(prev)) zs.push(r); prev=v;}
  console.log(`${n}${l}    ${a0.toFixed(2).padStart(5)}   ${zs.length?zs.map(z=>z.toFixed(1)).join(", "):"none"}`);
}
