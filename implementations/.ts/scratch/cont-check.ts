/**
 * DOES IT SOLVE WHAT IT CLAIMS TO? Checks that share no code with the solver's own reasoning.
 *
 *  1. besselJ against known values
 *  2. stir = 0: a point source in a purely absorbing medium, where the answer is exactly
 *     exp(-Sigma r) / r^2 for a source emitting one per steradian (4 pi in total)
 *  3. the moment truncation LG - widen it and see whether the answer moves
 */
import { besselJ, solve, type Rules } from "../src/lib/Continuum.ts";

console.log("besselJ:");
for (const [l, x, want] of [[0,1,0.8414709848],[1,1,0.3011686789],[2,3,0.2986374970],
                            [5,1,9.256115861e-5],[8,2,4.7902000e-5],[3,0.5,4.7541e-4]] as number[][])
  console.log(`  j${l}(${x}) = ${besselJ(l,x).toExponential(6)}   want ${want.toExponential(6)}` +
    `   rel ${(Math.abs(besselJ(l,x)-want)/want).toExponential(1)}`);

const SIG = 1.3;
const bal: Rules = { theta: Math.PI/4, absorb: SIG, stir: 0, L: 3 };
const rs = Float64Array.from([0.3, 0.5, 1, 2, 3, 5, 8]);
console.log(`\nstir = 0, absorb = ${SIG}:  A_0(r) against exp(-${SIG} r)/r^2`);
console.log("   r      solver         exact         ratio");
for (const [kMax, nk] of [[400, 40000]] as number[][]) {
  const A = solve(bal, rs, kMax, nk);
  for (let j = 0; j < rs.length; j++) {
    const exact = Math.exp(-SIG*rs[j]) / (rs[j]*rs[j]);
    console.log(`  ${rs[j].toFixed(1).padStart(4)}  ${A[0][j].toExponential(5)}  ${exact.toExponential(5)}` +
      `   ${(A[0][j]/exact).toFixed(5)}`);
  }
}
