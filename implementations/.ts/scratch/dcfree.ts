/** how much of each schedule is DC - the part that accumulates and buries the rest */
const lag = (k: number, a: number, x: number): number => {
  if (k===0) return 1; if (k===1) return 1+a-x;
  let Lm=1,L=1+a-x;
  for (let i=1;i<k;i++){const Ln=((2*i+1+a-x)*L-(i+a)*Lm)/(i+1);Lm=L;L=Ln;} return L; };
const Rnl=(n:number,l:number,a0:number,r:number)=>{const rho=2*r/(n*a0);
  return Math.pow(rho,l)*Math.exp(-rho/2)*lag(n-l-1,2*l+1,rho);};
console.log("state   mean <R>    rms |R-<R>|   DC / modulation");
for (const [n,l] of [[1,0],[2,0],[2,1],[3,0],[3,1],[3,2],[4,0],[4,3]] as [number,number][]) {
  const a0=22/(n*n), P=Math.max(1,Math.ceil(4*n*n*a0));
  const xs=Array.from({length:P},(_,t)=>Rnl(n,l,a0,t));
  const mean=xs.reduce((a,b)=>a+b,0)/P;
  const rms=Math.sqrt(xs.reduce((a,b)=>a+(b-mean)**2,0)/P);
  console.log(`${n}${l}     ${mean.toFixed(4).padStart(8)}   ${rms.toFixed(4).padStart(10)}   ` +
    `${(Math.abs(mean)/(rms||1)).toFixed(2).padStart(10)}`);
}
console.log("\nthe DC is what accumulates: with lambda_0 infinite it grows every tick while the");
console.log("modulation stays put, so the contrast of any radial node falls as 1/t.");
