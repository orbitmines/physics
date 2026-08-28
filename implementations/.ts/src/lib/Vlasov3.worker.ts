/**
 * ONE CORE'S SHARE. It rebuilds the read-only tables for itself rather than being sent them -
 * they are a function of the geometry and the box, so posting them would cost more than making
 * them - and then waits on the generation counter, runs whichever phase was asked for over its
 * own range of cells, and reports back.
 */
import { parentPort, workerData } from "node:worker_threads";
import { GEOMETRIES } from "./Local.ts";
import { grid } from "./Vlasov2.ts";
import { ARRIVED, GEN, PHASE, Shared, phase, reverse } from "./Vlasov3.ts";

const { geom, N, wrap, lo, hi, id, rates, buf } = workerData as any;
const g: any = (GEOMETRIES as any)[geom];
const G = grid(g, N, wrap);
const rev = reverse(G);

const f64 = (b: SharedArrayBuffer) => new Float64Array(b);
const S_: Shared = {
  n: buf.n.map(f64), out: buf.out.map(f64), stage: buf.stage.map(f64), rad: buf.rad.map(f64),
  plus: f64(buf.plus), minus: f64(buf.minus),
  space: f64(buf.space), ds: f64(buf.ds), turns: f64(buf.turns), audit: f64(buf.audit),
  ctrl: new Int32Array(buf.ctrl),
};

const ctrl = S_.ctrl;
let seen = 0;
parentPort!.postMessage("ready");
for (;;) {
  /* wait for the next phase to be announced. The generation only ever goes up, so a worker
   * that was slow to arrive cannot miss one and cannot run one twice. */
  Atomics.wait(ctrl, GEN, seen);
  const gen = Atomics.load(ctrl, GEN);
  if (gen < 0) break;                       // the pool is closing
  seen = gen;
  phase(Atomics.load(ctrl, PHASE), S_, G, rev, rates, lo, hi, id);
  Atomics.add(ctrl, ARRIVED, 1);
  Atomics.notify(ctrl, ARRIVED);
}
