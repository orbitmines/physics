/**
 * THE DIVERSITY BETWEEN STATES IS THE EVIDENCE - and the beams cannot supply it.
 *
 * The twelve <110> beams are a property of the LATTICE: they are in every state's picture
 * identically, whatever was emitted. So correlating one state against its own harmonic asks the
 * wrong question - the common beam pattern is in both the signal and the noise and it swamps
 * the answer, which is what the last test measured.
 *
 * What only the harmonic can supply is the DIFFERENCE between states. So: take the angular
 * profile of several states, subtract the mean profile across them - which removes whatever is
 * common, beams included - and see whether what is left correlates with the harmonic each state
 * was actually emitted with. A correlation matrix that is strong on its DIAGONAL means the
 * orbital information is getting through and is state-specific. One that is not means every
 * state is the same picture and the diversity was in my reading of it.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { emit, grid, step } from "../src/lib/Vlasov2.ts";
import { derive, OCCUPANCY } from "./derived.ts";

const GEOM = process.argv[2] ?? "fcc-12";
const g: any = GEOMETRIES[GEOM as keyof typeof GEOMETRIES], N = 41, C = 20, DEG = g.DEG;
const o = derive(g);
const NT = 48;
const leg = (l: number, x: number): number =>
  l === 0 ? 1 : l === 1 ? x : l === 2 ? (3*x*x - 1)/2 : (5*x*x*x - 3*x)/2;
const lag = (k: number, a: number, x: number): number => {
  if (k === 0) return 1; if (k === 1) return 1 + a - x;
  let Lm = 1, L = 1 + a - x;
  for (let i = 1; i < k; i++) { const Ln = ((2*i+1+a-x)*L - (i+a)*Lm)/(i+1); Lm = L; L = Ln; }
  return L;
};

const profileOf = (n: number, l: number) => {
  const a0 = 22/(n*n), PERIOD = Math.max(1, Math.ceil(4*n*n*a0));
  const Rnl = (r: number) => { const rho = 2*r/(n*a0);
    return Math.pow(rho,l)*Math.exp(-rho/2)*lag(n-l-1,2*l+1,rho); };
  const G = grid(g, N), K = grid(g, N);
  for (const a of G.n) a.fill(OCCUPANCY/4);
  for (const a of K.n) a.fill(OCCUPANCY/4);
  for (let t = 0; t < 400; t++) {
    const amp = Rnl(t % PERIOD), sgn = amp >= 0 ? 1 : -1;
    emit(G, { at: [C,C,C], radius: 1,
      exits: (d) => { const u = g.U[d]; const mg = Math.hypot(u[0],u[1],u[2]??0)||1;
        const y = leg(l,(u[2]??0)/mg); return Math.abs(y) < 1e-9 ? 0 : (y > 0 ? sgn : -sgn); },
      amountAt: (d) => { const u = g.U[d]; const mg = Math.hypot(u[0],u[1],u[2]??0)||1;
        return Math.min(1,Math.abs(amp)) * Math.abs(leg(l,(u[2]??0)/mg)) * 0.5; },
      amount: Math.min(1,Math.abs(amp))*0.5 });
    step(G, o); step(K, o);
  }
  const PAR = (((C+C+C)%2)+2)%2;
/*
 * THE SIGNED BOOK, because the density one cannot carry an odd harmonic AT ALL.
 *
 * Counting slots 1 and 3 is a DENSITY of one charge species - it is even in z by construction,
 * so correlating it against P_1 or P_3 returns exactly nought whatever the physics does. Three
 * of the four columns of the first matrix were structurally zero and said nothing. Polarity is
 * signed, so an odd harmonic can show in it.
 */
  const P4 = [1, 1, -1, -1];
  const qOf = (nn: any) => (b0: number) => { let v = 0;
    for (let s = 0; s < 4; s++) for (let d = 0; d < DEG; d++) v += nn[s][b0+d] * P4[s]; return v; };
  const fS = parityScalar(G.n, N, DEG, PAR, qOf(G.n));
  const fK = parityScalar(K.n, N, DEG, PAR, qOf(K.n));
  /* the angular profile, pooled over the radii where anything is happening */
  const prof = new Array(NT).fill(0);
  for (let i = 0; i < NT; i++) {
    const th = Math.PI*(i+0.5)/NT, ct = Math.cos(th), st = Math.sin(th);
    let acc = 0, cnt = 0;
    for (const r of [3,4,5,6,7,8]) for (let k = 0; k < 64; k++) {
      const ph = 2*Math.PI*k/64;
      const x = C + r*st*Math.cos(ph), y = C + r*st*Math.sin(ph), z = C + r*ct;
      acc += lerpAt(fS,N,x,y,z) - lerpAt(fK,N,x,y,z); cnt++;
    }
    prof[i] = cnt ? acc/cnt : 0;
  }
  return prof;
};


/*
 * SAMPLED WITHIN ONE SUBLATTICE, because rounding to a cell alternates between two solutions.
 *
 * <110>-type lattices conserve the parity of x+y+z, so streaming never mixes the two
 * sublattices and they carry different - often opposite - amounts. Rounding a continuous sample
 * point to the nearest cell therefore lands on alternating parities as the radius steps, and
 * any correlation computed on it flips sign every cell. That is exactly the pattern in the
 * first version of this measurement: +0.17, -0.24, +0.11, -0.10 with radius.
 *
 * So the field is rebuilt from ONE parity, Gaussian-weighted over the cells of that sublattice
 * within two cells, and then read by trilinear interpolation. A smooth harmonic can survive
 * that; the parity seam cannot.
 */
const parityScalar = (nn: any, N: number, DEG: number, par: number,
                      of: (b0: number) => number) => {
  const raw = new Float64Array(N*N*N);
  for (let c = 0; c < N*N*N; c++) raw[c] = of(c*DEG);
  const out = new Float64Array(N*N*N);
  for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) for (let z = 0; z < N; z++) {
    let acc = 0, w = 0;
    for (let dx=-2; dx<=2; dx++) for (let dy=-2; dy<=2; dy++) for (let dz=-2; dz<=2; dz++) {
      const xi=x+dx, yi=y+dy, zi=z+dz;
      if (xi<0||yi<0||zi<0||xi>=N||yi>=N||zi>=N) continue;
      if ((((xi+yi+zi)%2)+2)%2 !== par) continue;
      const g2 = Math.exp(-(dx*dx+dy*dy+dz*dz)/2);
      acc += g2*raw[(xi*N+yi)*N+zi]; w += g2;
    }
    out[(x*N+y)*N+z] = w > 0 ? acc/w : 0;
  }
  return out;
};
const lerpAt = (f: Float64Array, N: number, x: number, y: number, z: number) => {
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
  let sab=0,sa=0,sb=0;
  for (let i=0;i<a.length;i++){const da=a[i]-ma,db=b[i]-mb;sab+=da*db;sa+=da*da;sb+=db*db;}
  return sab/Math.sqrt((sa*sb)||1);
};

const STATES: [number, number][] = [[1,0],[2,1],[3,2],[4,3]];
const profs = STATES.map(([n,l]) => profileOf(n,l));
/* the common mode - beams and anything else the lattice puts in every state alike */
const mean = new Array(NT).fill(0);
for (const p of profs) for (let i=0;i<NT;i++) mean[i] += p[i]/profs.length;
const dev = profs.map(p => p.map((v,i) => v - mean[i]));

console.log(`${GEOM}: correlation of each state's DEVIATION from the common profile`);
console.log("            vs P_0     vs P_1     vs P_2     vs P_3");
STATES.forEach(([n,l], i) => {
  const row = [0,1,2,3].map(L => {
    const h = Array.from({length: NT}, (_, k) => leg(L, Math.cos(Math.PI*(k+0.5)/NT)));
    return corr(dev[i], h);
  });
  console.log(`n=${n} l=${l}   ` + row.map((c,L) =>
    (L === l ? `[${c.toFixed(3)}]` : ` ${c.toFixed(3)} `).padStart(10)).join(""));
});
console.log("\n[bracketed] is the state's OWN harmonic - it should be the largest in its row");
