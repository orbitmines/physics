/** how isotropic is the cloud? - the angular spread, against the ratio of killing to turning */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { emit, grid, step } from "../src/lib/Vlasov2.ts";
const g: any = GEOMETRIES["fcc-12"], N = 33, C = 16;

/* how much of a shell sits on the lattice's own diagonals against off them */
const anisotropy = (G: any, r: number) => {
  let on = 0, off = 0, non = 0, noff = 0;
  for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) for (let z = 0; z < N; z++) {
    const dx = x-C, dy = y-C, dz = z-C;
    if (Math.round(Math.hypot(dx,dy,dz)) !== r) continue;
    const b = ((x*N+y)*N+z)*g.DEG;
    let q = 0;
    for (let d = 0; d < g.DEG; d++) q += Math.abs(G.n[0][b+d]-G.n[1][b+d]+G.n[2][b+d]-G.n[3][b+d]);
    /* a cell is "on an arm" if two of its three offsets are equal in size and one is nought */
    const a = [Math.abs(dx), Math.abs(dy), Math.abs(dz)].sort((p,q2)=>q2-p);
    const arm = a[2] === 0 && a[0] === a[1];
    if (arm) { on += q; non++; } else { off += q; noff++; }
  }
  return { on: non ? on/non : 0, off: noff ? off/noff : 0 };
};

console.log("setting            r=6 on-arm  off-arm   ratio    r=11 on-arm  off-arm   ratio");
for (const [sig, tau, lab] of [[3.48,3.48,"equal"],[3.48,10,"tau 3x"],[3.48,30,"tau 9x"],[3.48,80,"tau 23x"]] as [number,number,string][]) {
  const G = grid(g, N);
  for (const a of G.n) a.fill(0.0485);
  for (let t = 0; t < 60; t++) {
    emit(G, { at: [C,C,C], radius: 1, exits: () => 1, amount: 0.5 });
    step(G, { nu: 0.488, sigma: 3.48, cap: 1, tau, shine: 0.05, fold: 0.02, stir: 0.6 });
  }
  const a2 = anisotropy(G, 6), a3 = anisotropy(G, 11);
  console.log(lab.padEnd(18),
    a2.on.toFixed(4).padStart(10), a2.off.toFixed(4).padStart(8),
    (a2.on/(a2.off||1e-9)).toFixed(1).padStart(7),
    a3.on.toFixed(4).padStart(12), a3.off.toFixed(4).padStart(8),
    (a3.on/(a3.off||1e-9)).toFixed(1).padStart(7));
}
console.log("\n  ratio 1 = isotropic cloud.  large ratio = all of it on the arms, i.e. an X");
