/**
 * THE SAME STEP, SPREAD ACROSS THE CORES - and the restructure that makes that safe.
 *
 * `Vlasov2.step` SCATTERS: a cell computes what leaves it and writes that straight into its
 * neighbours. Two cells can write the same neighbour, so handing halves of the box to two
 * threads races. The usual patches - halo buffers, atomics, locks - all trade correctness for
 * bookkeeping, and this solver has already cost enough in bugs that looked like physics.
 *
 * SO THE SCATTER IS INVERTED INSTEAD, and it inverts cleanly because every non-local write in
 * the serial step has ONE shape:
 *
 *     out[s][nbr[c][dir] * DEG + dir] += amount
 *
 * the streaming remainder, the turn, the scattered spread and the corner's recoil all included.
 * Every one of them is "leaving cell c along dir, landing on the neighbour's exit dir". So a
 * cell can write what LEAVES it into its own row of a staging array, and then every cell can
 * gather what ARRIVES from the one cell that can have sent it - `rev[c][dir]`, the cell a step
 * back along dir. No cell ever writes another cell's memory, in either half. There are no
 * halos and no atomics because there is nothing to contend for.
 *
 * WHAT THIS DOES NOT PRESERVE, said plainly: the ORDER of the additions. Serial adds each
 * contribution into `out` as it reaches the sending cell; this adds them into `stage` first and
 * then adds one number. Floating point is not associative, so the last digits move. The two are
 * the same arithmetic in a different order, not the same result - `scratch/agree.ts` measures
 * the gap and it is at the size of the rounding, but it is not nought and calling it identical
 * would be a lie.
 *
 * The phases and why each barrier is where it is:
 *
 *   A  presums        the facing density of each polarity, per exit. Reads n, writes plus/minus
 *   B  local          the whole per-cell computation. Reads n/plus/minus, writes its OWN row of
 *                     stage, its OWN out (creation is local), its OWN ds
 *   C  gather         out += stage[rev]. Reads neighbours' stage, writes own out
 *   D  stir + shine   turns within a cell, and the recoil into rad's own row
 *   E  gather rad     out += rad[rev]
 *   F  commit         n = out, and the space update
 *
 * B must finish everywhere before C reads it; C before D, because the stir reads a finished
 * `out`; and so on. Six barriers a tick, which against a step of a second is nothing.
 */
import { Geometry } from "./Local.ts";
import { Grid, grid } from "./Vlasov2.ts";

/** the rates, named here because `Vlasov2` states them inline on its step */
export type Rates = {
  nu: number; sigma: number; cap: number; tau: number;
  shine: number; fold: number; stir: number;
  carries?: "inherit" | "polarity" | "charge";
};

const P_OF = [1, 1, -1, -1];
const Q_OF = [1, -1, 1, -1];

/** the shared state a worker needs; the read-only tables it rebuilds for itself */
export type Shared = {
  n: Float64Array[]; out: Float64Array[]; stage: Float64Array[]; rad: Float64Array[];
  plus: Float64Array; minus: Float64Array;
  space: Float64Array; ds: Float64Array; turns: Float64Array;
  audit: Float64Array;      // per-worker rows, summed by the caller
  ctrl: Int32Array;         // [generation, arrived, phase]
};

export const GEN = 0, ARRIVED = 1, PHASE = 2;

const shared64 = (len: number) =>
  new Float64Array(new SharedArrayBuffer(len * 8));

/** the reverse neighbour: the cell that can have sent along `dir` into `c` */
export const reverse = (G: Grid) => {
  const { g, N, cells } = G, DEG = g.DEG;
  const rev = new Int32Array(cells * DEG).fill(-1);
  for (let c = 0; c < cells; c++) {
    for (let d = 0; d < DEG; d++) {
      const to = G.nbr[c * DEG + d];
      if (to >= 0) rev[to * DEG + d] = c;
    }
  }
  return rev;
};

export const allocate = (G: Grid): Shared => {
  const len = G.cells * G.g.DEG;
  const four = () => [shared64(len), shared64(len), shared64(len), shared64(len)];
  const n = four();
  for (let s = 0; s < 4; s++) n[s].set(G.n[s]);
  const space = shared64(G.cells);
  space.set(G.space);
  return {
    n, out: four(), stage: four(), rad: four(),
    plus: shared64(len), minus: shared64(len),
    space, ds: shared64(G.cells), turns: shared64(G.cells),
    audit: shared64(64 * 8),
    ctrl: new Int32Array(new SharedArrayBuffer(16)),
  };
};

/**
 * ONE WORKER'S SHARE OF ONE PHASE - the whole of the physics, sliced by cell.
 *
 * `lo` and `hi` are this worker's cells. Every write below is to row `c` of something, for `c`
 * in that range, so two workers never touch the same word.
 */
export const phase = (
  which: number, S_: Shared, G: Grid, rev: Int32Array, o: Rates, lo: number, hi: number,
  auditRow: number,
) => {
  const { g, nbr, turn, U, opp, ring, ringN } = G;
  const DEG = g.DEG, S = 4;
  const { n, out, stage, rad, plus, minus, space, ds, turns, audit } = S_;
  const made = o.nu / (2 * DEG);
  const A = auditRow * 8;

  if (which === 0) {
    const n0 = n[0], n1 = n[1], n2 = n[2], n3 = n[3];
    for (let i = lo * DEG; i < hi * DEG; i++) {
      plus[i] = n0[i] + n1[i];
      minus[i] = n2[i] + n3[i];
    }
    /* this worker's rows of everything it will accumulate into */
    for (let s = 0; s < S; s++) {
      out[s].fill(0, lo * DEG, hi * DEG);
      stage[s].fill(0, lo * DEG, hi * DEG);
      rad[s].fill(0, lo * DEG, hi * DEG);
    }
    ds.fill(0, lo, hi);
    return;
  }

  if (which === 1) {
    const axes = new Int32Array(DEG);
    const scat = new Float64Array(S);
    for (let c = lo; c < hi; c++) {
      const b0 = c * DEG;
      let bx = 0, by = 0, bz = 0, tot = 0;
      for (let s = 0; s < S; s++) {
        const a = n[s], pol = P_OF[s];
        for (let d = 0; d < DEG; d++) {
          const w = a[b0 + d];
          if (w === 0) continue;
          tot += w;
          const k = w * pol;
          bx += k * U[d*3]; by += k * U[d*3+1]; bz += k * U[d*3+2];
        }
      }
      const rho = tot / DEG;
      scat[0] = 0; scat[1] = 0; scat[2] = 0; scat[3] = 0;

      if (tot > 0) {
        const B2 = bx * bx + by * by + bz * bz;
        let nAx = 0, mag = 0;
        if (B2 > 1e-18) {
          let best = -Infinity;
          for (let d = 0; d < DEG; d++) {
            const c2 = bx * U[d*3] + by * U[d*3+1] + bz * U[d*3+2];
            if (c2 > best + 1e-9) { best = c2; nAx = 0; axes[nAx++] = d; }
            else if (c2 > best - 1e-9) axes[nAx++] = d;
          }
          if (best > 1e-12) mag = Math.min(1, Math.sqrt(B2));
          else nAx = 0;
        }

        for (let s = 0; s < S; s++) {
          const a = n[s], pol = P_OF[s], q = Q_OF[s];
          const plusIsLike = pol > 0;
          for (let d = 0; d < DEG; d++) {
            const w = a[b0 + d];
            if (w <= 0) continue;
            const od = opp[d];
            const face = nbr[b0 + d];
            let opp_ = 0, same = 0;
            if (face >= 0) {
              const f0 = face * DEG + od;
              const pl = plus[f0], mi = minus[f0];
              opp_ = plusIsLike ? mi : pl;
              same = plusIsLike ? pl : mi;
            }
            let kp = o.sigma * w * opp_, tp = o.tau * w * same;
            audit[A + 4] += opp_; audit[A + 5] += same;
            const want = kp + tp;
            if (want > w && want > 0) { const f = w / want; kp *= f; tp *= f; }
            const left = w - kp - tp;
            scat[s] += tp;
            turns[c] += tp;              // where a corner happened - see Vlasov2
            ds[c] += o.fold * (tp - kp);
            audit[A] += tp; audit[A + 1] += kp;
            if (left <= 0) continue;

            const turnAmt = nAx ? left * mag : 0, str = left - turnAmt;
            if (turnAmt > 0) {
              const each = turnAmt / nAx;
              for (let ia = 0; ia < nAx; ia++) {
                const b = q > 0 ? axes[ia] : opp[axes[ia]];
                const e = turn[b * DEG + d];
                const dir = e === d ? d : e;
                /* LEAVING along dir - the neighbour picks it up in the gather */
                if (nbr[b0 + dir] >= 0) stage[s][b0 + dir] += each;
                if (o.shine > 0 && e !== d) {
                  const back = nbr[b0 + od];
                  if (back >= 0) {
                    const seat = back * DEG + od;
                    let held = 0;
                    for (let k2 = 0; k2 < S; k2++) held += n[k2][seat];
                    const lit = o.shine * each * Math.max(0, 1 - held);
                    if (lit > 0) {
                      const shed = SHED[o.carries ?? "inherit"][s];
                      for (const ts of shed) stage[ts][b0 + od] += lit / shed.length;
                      ds[c] -= o.fold * lit;
                      audit[A + 2] += lit;
                    }
                  }
                }
              }
            }
            if (str > 0 && nbr[b0 + d] >= 0) stage[s][b0 + d] += str;
          }
        }
      }

      const room = Math.pow(Math.max(0, 1 - rho), o.cap);
      const k = room > 0 ? made * room : 0;
      audit[A + 3] += k; audit[A + 6] += room; audit[A + 7] += 1;
      for (let s = 0; s < S; s++) {
        const spread = scat[s] / DEG;
        for (let d = 0; d < DEG; d++) {
          if (k > 0) out[s][b0 + d] += k;                       // creation is LOCAL
          if (spread > 0 && nbr[b0 + d] >= 0) stage[s][b0 + d] += spread;
        }
      }
    }
    return;
  }

  if (which === 2) {
    /* what arrived: from the one cell a step back along each exit */
    for (let c = lo; c < hi; c++) {
      const b0 = c * DEG;
      for (let d = 0; d < DEG; d++) {
        const from = rev[b0 + d];
        if (from < 0) continue;
        const f = from * DEG + d;
        for (let s = 0; s < S; s++) out[s][b0 + d] += stage[s][f];
      }
    }
    return;
  }

  if (which === 3) {
    if (!(o.stir > 0)) return;
    const was = new Float64Array(DEG);
    for (let c = lo; c < hi; c++) {
      const b0 = c * DEG;
      for (let s = 0; s < S; s++) {
        const a = out[s];
        let any = 0;
        for (let d = 0; d < DEG; d++) { was[d] = a[b0 + d]; any += was[d]; }
        if (any <= 0) continue;
        for (let d = 0; d < DEG; d++) {
          const w = was[d];
          if (w <= 0) continue;
          const k = ringN[d];
          if (!k) continue;
          const turned = w * o.stir;
          a[b0 + d] -= turned;
          const each = turned / k;
          for (let i2 = 0; i2 < k; i2++) a[b0 + ring[d * DEG + i2]] += each;
          if (o.shine > 0) {
            const od = opp[d], back = nbr[b0 + od];
            if (back >= 0) {
              const seat = back * DEG + od;
              let held = 0;
              for (let k2 = 0; k2 < S; k2++) held += n[k2][seat];
              const lit = o.shine * turned * Math.max(0, 1 - held);
              if (lit > 0) {
                const shed = SHED[o.carries ?? "inherit"][s];
                for (const ts of shed) rad[ts][b0 + od] += lit / shed.length;
                ds[c] -= o.fold * lit;
                audit[A + 2] += lit;
              }
            }
          }
        }
      }
    }
    return;
  }

  if (which === 4) {
    if (!(o.shine > 0)) return;
    for (let c = lo; c < hi; c++) {
      const b0 = c * DEG;
      for (let d = 0; d < DEG; d++) {
        const from = rev[b0 + d];
        if (from < 0) continue;
        const f = from * DEG + d;
        for (let s = 0; s < S; s++) out[s][b0 + d] += rad[s][f];
      }
    }
    return;
  }

  if (which === 5) {
    for (let s = 0; s < S; s++) n[s].set(out[s].subarray(lo * DEG, hi * DEG), lo * DEG);
    for (let c = lo; c < hi; c++) space[c] = Math.max(0.05, space[c] + ds[c]);
    return;
  }
};

/** where a corner's recoil lands - the same table `Vlasov2` uses */
const SHED: Record<string, number[][]> = {
  inherit:  [[0], [1], [2], [3]],
  polarity: [[0, 1], [0, 1], [2, 3], [2, 3]],
  charge:   [[0, 2], [1, 3], [0, 2], [1, 3]],
};

export const PHASES = 6;

/** the serial driver, for checking the restructure on its own before threads are added */
export const stepStaged = (G: Grid, S_: Shared, rev: Int32Array, o: Rates) => {
  for (let p = 0; p < PHASES; p++) phase(p, S_, G, rev, o, 0, G.cells, 0);
};

export const makeGrid = (g: Geometry, N: number, wrap = false) => grid(g, N, wrap);

/**
 * THE POOL - workers held open across ticks, woken six times a tick.
 *
 * Making a worker costs milliseconds and a tick costs a second, so they are made once and
 * parked on the generation counter. The counter only ever rises, so a worker that was slow to
 * park cannot sleep through a phase: it compares against what it last saw, and if that is
 * already behind it runs straight through without waiting.
 */
import { Worker } from "node:worker_threads";
import { fileURLToPath } from "node:url";

export type Pool = {
  S: Shared; rev: Int32Array; workers: Worker[];
  step: () => void; close: () => Promise<void>;
  audit: () => { tp: number; kp: number; lit: number; k: number; opp: number; same: number; room: number; cells: number };
};

export const pool = async (G: Grid, o: Rates, geom: string, wrap: boolean, W: number): Promise<Pool> => {
  const S_ = allocate(G);
  const rev = reverse(G);
  const ctrl = S_.ctrl;
  const buf = {
    n: S_.n.map(a => a.buffer), out: S_.out.map(a => a.buffer),
    stage: S_.stage.map(a => a.buffer), rad: S_.rad.map(a => a.buffer),
    plus: S_.plus.buffer, minus: S_.minus.buffer,
    space: S_.space.buffer, ds: S_.ds.buffer, turns: S_.turns.buffer,
    audit: S_.audit.buffer, ctrl: ctrl.buffer,
  };
  const url = new URL("./worker-boot.mjs", import.meta.url);
  const here = fileURLToPath(url);
  /* cells split evenly; the last worker takes the remainder */
  const per = Math.ceil(G.cells / W);
  const workers: Worker[] = [];
  await Promise.all(Array.from({ length: W }, (_, i) => new Promise<void>((res, rej) => {
    const w = new Worker(here, {
      workerData: { geom, N: G.N, wrap, lo: i * per, hi: Math.min(G.cells, (i + 1) * per),
        id: i, rates: o, buf },
      execArgv: [],
    });
    w.once("message", () => res());
    w.once("error", rej);
    workers.push(w);
  })));

  const run = () => {
    for (let p = 0; p < PHASES; p++) {
      Atomics.store(ctrl, ARRIVED, 0);
      Atomics.store(ctrl, PHASE, p);
      Atomics.add(ctrl, GEN, 1);
      Atomics.notify(ctrl, GEN);
      /*
       * WAIT ON THE VALUE THE CONDITION ACTUALLY TESTED. Loading twice - once for the loop and
       * again inside the wait - lets the last workers arrive in between, and then the wait
       * blocks expecting a number that has ALREADY been reached and will never change again.
       * That sleeps the whole timeout, six times a tick.
       */
      for (;;) {
        const v = Atomics.load(ctrl, ARRIVED);
        if (v >= W) break;
        Atomics.wait(ctrl, ARRIVED, v, 1);
      }
    }
  };
  return {
    S: S_, rev, workers, step: run,
    audit: () => {
      const a = S_.audit; const g_ = (k: number) => { let s = 0; for (let i = 0; i < W; i++) s += a[i * 8 + k]; return s; };
      return { tp: g_(0), kp: g_(1), lit: g_(2), k: g_(3), opp: g_(4), same: g_(5), room: g_(6), cells: g_(7) };
    },
    close: async () => {
      Atomics.store(ctrl, GEN, -1);
      Atomics.notify(ctrl, GEN);
      await Promise.all(workers.map(w => w.terminate()));
    },
  };
};
