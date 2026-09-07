/**
 * IS THE VACUUM'S OCCUPANCY A PROPERTY OF THE VACUUM, OR OF THE BOX?
 *
 * Open-boxed, it was the box: the same rules and the same seed gave 0.2126 in a 17-box and
 * 0.1364 in a 21-box, because whatever streams out of an open edge is gone and how much that
 * costs depends on how far the middle is from a wall. Wrapped, the box is homogeneous, which
 * is what the thing being measured is. If the number still moves with N, something else is
 * wrong; if it holds, that is the vacuum's occupancy and it can be compared with the lattice.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { grid, step } from "../src/lib/Vlasov2.ts";
import { derive, OCCUPANCY } from "./derived.ts";
const g: any = GEOMETRIES["fcc-12"];
const R = derive(g);
console.log("N    open      wrapped     (lattice measures " + OCCUPANCY + ")");
for (const N of [13, 17, 21, 25]) {
  const out: string[] = [];
  for (const wrap of [false, true]) {
    const G = grid(g, N, wrap);
    for (const a of G.n) a.fill(OCCUPANCY / 4);
    for (let t = 0; t < 500; t++) step(G, R);
    /* wrapped: every cell is interior, so measure them all. open: keep clear of the wall */
    const lo = wrap ? 0 : 4, hi = wrap ? N : N - 4;
    let s = 0, c = 0;
    for (let x = lo; x < hi; x++) for (let y = lo; y < hi; y++) for (let z = lo; z < hi; z++) {
      const b = ((x * N + y) * N + z) * g.DEG;
      for (let k = 0; k < 4; k++) for (let d = 0; d < g.DEG; d++) { s += G.n[k][b + d]; c++; }
    }
    out.push((s / c * 4).toFixed(4));
  }
  console.log(`${String(N).padEnd(4)} ${out[0]}    ${out[1]}`);
}
