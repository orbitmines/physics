/**
 * IS THE ANGULAR STRUCTURE THE ORBITAL OR THE LATTICE? - correlated against both, not squinted at.
 *
 * The meridian pictures show real structure: lobes on the axis, dark bands at 45-55 degrees.
 * Y_l0 for l=2 has nodal cones at 54.7 degrees and maxima at the poles; fcc-12's <110> beams sit
 * at 45, 90 and 135. Those are close enough to confuse by eye and completely different claims.
 *
 * So the field's angular profile is taken at several radii and correlated against BOTH: the
 * Legendre polynomial the state was emitted with, and a beam model that peaks wherever the
 * lattice has an exit. Whichever correlates is what is being looked at.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { emit, grid, step } from "../src/lib/Vlasov2.ts";
import { derive, OCCUPANCY } from "./derived.ts";

/* the geometry is an argument: fcc-12 has twelve exits and beams badly, cubic-26 has twenty-six
 * and icosahedral-12 spreads its twelve as evenly as twelve can be spread */
const GEOM = process.argv[3] ?? "fcc-12";
const g: any = GEOMETRIES[GEOM as keyof typeof GEOMETRIES], N = 41, C = 20, DEG = g.DEG;
const o = derive(g);
const leg = (l: number, x: number): number =>
  l === 0 ? 1 : l === 1 ? x : l === 2 ? (3*x*x - 1)/2 : (5*x*x*x - 3*x)/2;

const [n, l] = (process.argv[2] ?? "3,2").split(",").map(Number);
const a0 = 22/(n*n), PERIOD = Math.max(1, Math.ceil(4*n*n*a0));
const lag = (k: number, a: number, x: number): number => {
  if (k === 0) return 1; if (k === 1) return 1 + a - x;
  let Lm = 1, L = 1 + a - x;
  for (let i = 1; i < k; i++) { const Ln = ((2*i+1+a-x)*L - (i+a)*Lm)/(i+1); Lm = L; L = Ln; }
  return L;
};
const Rnl = (r: number) => { const rho = 2*r/(n*a0);
  return Math.pow(rho,l)*Math.exp(-rho/2)*lag(n-l-1,2*l+1,rho); };

const G = grid(g, N), K = grid(g, N);
for (const a of G.n) a.fill(OCCUPANCY/4);
for (const a of K.n) a.fill(OCCUPANCY/4);
for (let t = 0; t < 500; t++) {
  const amp = Rnl(t % PERIOD), sgn = amp >= 0 ? 1 : -1;
  emit(G, { at: [C,C,C], radius: 1,
    exits: (d) => { const u = g.U[d]; const mg = Math.hypot(u[0],u[1],u[2]??0)||1;
      const y = leg(l, (u[2]??0)/mg); return Math.abs(y) < 1e-9 ? 0 : (y > 0 ? sgn : -sgn); },
    amountAt: (d) => { const u = g.U[d]; const mg = Math.hypot(u[0],u[1],u[2]??0)||1;
      return Math.min(1,Math.abs(amp)) * Math.abs(leg(l,(u[2]??0)/mg)) * 0.5; },
    amount: Math.min(1,Math.abs(amp))*0.5 });
  step(G, o); step(K, o);
}
const q = (nn: any, c: number) => { const b = c*DEG; let v = 0;
  for (const s of [1,3]) for (let d = 0; d < DEG; d++) v += nn[s][b+d]; return v; };

/* the beam model: how well a direction lines up with the NEAREST lattice exit */
const beam = (ct: number, st: number, cp: number, sp: number) => {
  let best = -1;
  for (let d = 0; d < DEG; d++) { const u = g.U[d], mg = Math.hypot(u[0],u[1],u[2]??0)||1;
    const dot = (st*cp*u[0] + st*sp*u[1] + ct*(u[2]??0))/mg;
    if (dot > best) best = dot; }
  return best;
};


/*
 * SAMPLED WITHOUT LETTING THE SUBLATTICE IN - and whether there IS one is detected, not assumed.
 *
 * A lattice whose every exit changes x+y+z by an EVEN amount conserves parity: it is bipartite,
 * streaming never mixes the two halves, and they hold different - often opposite - amounts.
 * Rounding a sample point to the nearest cell then alternates between two solutions and any
 * correlation computed on it flips sign every cell, which is what the first version of this
 * measurement did. fcc-12 is such a lattice; cubic-18 and cubic-26 include +-(1,0,0) steps and
 * are NOT, so restricting them to one parity would throw away half the data for nothing.
 *
 * So: detect it, restrict only where it exists, and read the field by interpolation either way.
 */
const bipartite = (() => {
  for (let d = 0; d < DEG; d++) {
    const v = (g.L?.[d] ?? g.U[d]) as number[];
    const par = Math.abs(((v[0]|0) + (v[1]|0) + ((v[2]??0)|0)) % 2);
    if (par === 1) return false;
  }
  return true;
})();

const smooth = (nn: any, of: (b0: number) => number, par: number) => {
  const raw = new Float64Array(N*N*N);
  for (let c = 0; c < N*N*N; c++) raw[c] = of(c*DEG);
  const out = new Float64Array(N*N*N);
  for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) for (let z = 0; z < N; z++) {
    let acc = 0, w = 0;
    for (let dx=-2; dx<=2; dx++) for (let dy=-2; dy<=2; dy++) for (let dz=-2; dz<=2; dz++) {
      const xi=x+dx, yi=y+dy, zi=z+dz;
      if (xi<0||yi<0||zi<0||xi>=N||yi>=N||zi>=N) continue;
      if (bipartite && (((xi+yi+zi)%2)+2)%2 !== par) continue;
      const g2 = Math.exp(-(dx*dx+dy*dy+dz*dz)/2);
      acc += g2*raw[(xi*N+yi)*N+zi]; w += g2;
    }
    out[(x*N+y)*N+z] = w > 0 ? acc/w : 0;
  }
  return out;
};
const lerpAt = (f: Float64Array, x: number, y: number, z: number) => {
  const x0=Math.floor(x), y0=Math.floor(y), z0=Math.floor(z);
  const fx=x-x0, fy=y-y0, fz=z-z0;
  let v = 0;
  for (let dx=0;dx<2;dx++) for (let dy=0;dy<2;dy++) for (let dz=0;dz<2;dz++) {
    const xi=x0+dx, yi=y0+dy, zi=z0+dz;
    if (xi<0||yi<0||zi<0||xi>=N||yi>=N||zi>=N) continue;
    v += (dx?fx:1-fx)*(dy?fy:1-fy)*(dz?fz:1-fz)*f[(xi*N+yi)*N+zi];
  }
  return v;
};

const corr = (a: number[], b: number[]) => {
  const ma = a.reduce((x,y)=>x+y,0)/a.length, mb = b.reduce((x,y)=>x+y,0)/b.length;
  let sab=0, sa=0, sb=0;
  for (let i=0;i<a.length;i++){const da=a[i]-ma, db=b[i]-mb; sab+=da*db; sa+=da*da; sb+=db*db;}
  return sab/Math.sqrt((sa*sb)||1);
};

const PAR = (((C+C+C)%2)+2)%2;
const qq = (nn: any) => (b0: number) => { let v = 0;
  for (const sl of [1,3]) for (let d = 0; d < DEG; d++) v += nn[sl][b0+d]; return v; };
const fS = smooth(G.n, qq(G.n), PAR), fK = smooth(K.n, qq(K.n), PAR);
console.log(`${GEOM} (bipartite=${bipartite})  state n=${n} l=${l}   correlation of the measured angular profile with:`);
console.log(" r     P_l(cos th)   nearest-exit (beams)   which");
for (const r of [3,4,5,6,8,10,12]) {
  const vals: number[] = [], pl: number[] = [], bm: number[] = [];
  for (let i = 0; i < 60; i++) {
    const th = Math.PI*(i+0.5)/60, ct = Math.cos(th), st = Math.sin(th);
    let acc = 0, cnt = 0, ab = 0;
    for (let k = 0; k < 48; k++) {
      const ph = 2*Math.PI*k/48, cp = Math.cos(ph), sp = Math.sin(ph);
      const x = C + r*st*cp, y = C + r*st*sp, z = C + r*ct;
      acc += lerpAt(fS,x,y,z) - lerpAt(fK,x,y,z); cnt++;
      ab += beam(ct,st,cp,sp);
    }
    if (!cnt) continue;
    vals.push(acc/cnt); pl.push(leg(l,ct)); bm.push(ab/cnt);
  }
  const cP = corr(vals, pl), cB = corr(vals, bm);
  console.log(`${String(r).padStart(2)}    ${cP.toFixed(3).padStart(9)}   ${cB.toFixed(3).padStart(18)}   ` +
    `${Math.abs(cP) > Math.abs(cB) ? "ORBITAL" : "beams"}`);
}
