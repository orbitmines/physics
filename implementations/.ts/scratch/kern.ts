import { kernel } from "../src/lib/Kernel.ts";
import { GEOMETRIES } from "../src/lib/Local.ts";

console.log("g_l from the RULE alone - a turn of THETA about a random axis, no lattice\n");
console.log("THETA      g0      g1      g2      g3      g4      g6   | lambda1  lambda2  lambda4");
for (const deg of [30, 45, 60, 90, 120]) {
  const g = kernel(deg * Math.PI / 180, 6);
  console.log(`${String(deg).padStart(4)}deg` + [0,1,2,3,4,6].map(l => g[l].toFixed(3).padStart(8)).join("") +
    `  | ${(1/(1-g[1])).toFixed(2).padStart(6)}  ${(1/(1-g[2])).toFixed(2).padStart(7)}  ${(1/(1-g[4])).toFixed(2).padStart(7)}`);
}
console.log("\n  g1 should be exactly (1 + 2 cos THETA)/3:");
for (const deg of [30, 45, 60, 90, 120]) {
  const g = kernel(deg * Math.PI / 180, 1);
  const exact = (1 + 2*Math.cos(deg*Math.PI/180))/3;
  console.log(`   ${String(deg).padStart(4)}deg  numeric ${g[1].toFixed(9)}  exact ${exact.toFixed(9)}` +
    `  diff ${Math.abs(g[1]-exact).toExponential(1)}`);
}
console.log("\n  and what each geometry's CYCLE asks for:");
for (const name of ["fcc-12", "icosahedral-12", "cubic-18", "cubic-26"]) {
  const gg: any = (GEOMETRIES as any)[name];
  const th = 2*Math.PI/gg.CYCLE;
  const g = kernel(th, 4);
  console.log(`   ${name.padEnd(16)} CYCLE=${gg.CYCLE}  THETA=${(th*180/Math.PI).toFixed(0)}deg` +
    `  g1=${g[1].toFixed(3)}  g2=${g[2].toFixed(3)}  g4=${g[4].toFixed(3)}`);
}
