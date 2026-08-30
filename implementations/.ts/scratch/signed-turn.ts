/**
 * DOES THE CLOUD'S TURNING CANCEL? - the question the mass ratio turns on.
 *
 * Counting turning EVENTS gives every shell the same weight - the field thins as r^{1-D} and
 * the room grows as r^{D-1} and the two cancel exactly - so a cloud of extent R weighs
 * SHEET·occupancy·R and is heavier the bigger it is. That contradicts m ∝ 1/r, which
 * `gravity.atom` proves from the same two rules and which says bigger is LIGHTER. Both cannot
 * describe the electron.
 *
 * THE WAY OUT IS THAT A TURN HAS A SENSE. `steer` takes one ring step about the local B and
 * the SIGN OF THE CHARGE picks which way round: `q > 0 ? held : -held`. So two charges of
 * opposite sign at the same place turn opposite ways, and a shell holding both contributes
 * NOTHING net however many events it logs. A count of events cannot see that; a sum of
 * senses can.
 *
 * So this measures both, per shell:
 *
 *   |turning|   how many ring steps were taken - what was counted before
 *   net turning the same steps with their sense kept - +1 one way round, -1 the other
 *
 * If the net is a small residual on a large gross, the cloud can be light while being large,
 * and the mass ratio becomes a question about HOW COMPLETELY IT CANCELS rather than about
 * how far it reaches. If the net tracks the gross, that way out is closed.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_XOR } from "../src/theories/G^XOR+XOR.ts";

const GEOM = "fcc-12", N = 21, C = 10, WARM = 8, TICKS = 90, SEEDS = 4, RMAX = 9;

const run = (src: boolean, seed: number) => {
  const g: any = (GEOMETRIES as any)[GEOM];
  const w: any = new World({ theory: G_XOR_XOR, geometry: g, N, seed,
    boundary: "absorb", slotUniformRng: true } as any);
  w.world.turnLog = [];
  if (src) w.add({ at: [C,C,C], radius: 1, emits: 1, period: 1, dwellTicks: 1,
    absorbs: true } as any);
  for (let t = 0; t < WARM; t++) { w.tick(); w.world.turnLog.length = 0; }
  const gross = new Float64Array(RMAX + 2), net = new Float64Array(RMAX + 2);
  for (let t = 0; t < TICKS; t++) {
    w.tick();
    const log = w.world.turnLog;
    /* the log is (local, from, to, fieldExit, netP, netQ) - the SENSE is the charge of the
     * ray that turned, which is what `steer` uses to pick which way round the ring */
    for (let i = 0; i < log.length; i += 6) {
      const l = log[i]; const at = l && w.embedding.at(l); if (!at) continue;
      const r = Math.round(Math.hypot(at[0]-C, at[1]-C, at[2]-C));
      if (r < 1 || r > RMAX) continue;
      const d = log[i + 1], d2 = log[i + 2];
      /* which way round: the sign of the ring step, read off the two headings */
      const ring: number[] = g.RING;
      const a = ring.indexOf(d), b = ring.indexOf(d2);
      let sense = 0;
      if (a >= 0 && b >= 0) {
        const fwd = (b - a + ring.length) % ring.length;
        sense = fwd === 1 ? 1 : fwd === ring.length - 1 ? -1 : 0;
      }
      gross[r] += 1; net[r] += sense;
    }
    log.length = 0;
  }
  return { gross: Array.from(gross), net: Array.from(net) };
};

const G: number[][] = [], Nt: number[][] = [];
for (let s = 1; s <= SEEDS; s++) {
  const a = run(true, s), b = run(false, s);
  G.push(a.gross.map((v, i) => v - b.gross[i]));
  Nt.push(a.net.map((v, i) => v - b.net[i]));
}
const mean = (rows: number[][], i: number) => rows.reduce((x, r) => x + r[i], 0)/rows.length;
const sem = (rows: number[][], i: number) => {
  const m = mean(rows, i);
  return Math.sqrt(rows.reduce((x, r) => x + (r[i]-m)**2, 0)/(rows.length-1))/Math.sqrt(rows.length);
};

console.log(`${GEOM} — turning per shell, source minus control, ${SEEDS} seeds`);
console.log("  r      |turning| (gross)        net turning (sense kept)     net/gross");
let sg = 0, sn = 0;
for (let r = 1; r <= RMAX; r++) {
  const g0 = mean(G, r), n0 = mean(Nt, r), e = sem(Nt, r);
  sg += Math.abs(g0); sn += n0;
  console.log(`  ${String(r).padStart(2)}   ${g0.toFixed(1).padStart(12)}` +
    `        ${(n0>=0?"+":"")}${n0.toFixed(2)} ± ${e.toFixed(2)}${Math.abs(n0)>2*e?" *":"  "}` +
    `      ${(Math.abs(g0)>1e-9 ? n0/g0 : 0).toFixed(4).padStart(8)}`);
}
console.log(`\n  totals: gross ${sg.toFixed(1)}   net ${sn.toFixed(2)}   ` +
  `net/gross = ${(sn/(sg||1)).toFixed(5)}`);
console.log(`  for m_e/m_p = 1/1836 the net would have to be ${(1/1836.15).toFixed(6)} of gross`);
