/**
 * WHAT HAPPENS WHILE IT RUNS — the vacuum, and the matter that condenses out of it.
 *
 * The two layers are the same story told twice. (G/1) annihilates a ± pair and FOLDS the
 * point that held it, which takes that point out of the world; the layer above is made of
 * exactly those folded points, so THE SPACE GRAVITY DESTROYS IS THE MATERIAL MATTER IS
 * MADE OF. Nothing here is put in by hand: matter is where the vacuum went.
 *
 * WHAT TO WATCH, IN THE ORDER IT HAPPENS.
 *
 *   THE VACUUM FILLS. (G/2) splits every neutral point every tick and meetings unmake
 *   what it makes, and the balance settles near half — the line that flattens first.
 *
 *   MATTER CONCENTRATES. A structure absorbs a ray whose sign disagrees with its own,
 *   AND THE POINT THAT RAY CAME FROM GOES WITH IT — the vacuum is drawn through and the
 *   space crossed is folded in. That one choice is the whole of the concentration:
 *   measured at 28× the ambient density, against 1.6× when only the ray is taken.
 *
 *   AND IT RADIATES. A point spending its action walking its own graph has none left to
 *   hold what arrived, so what arrives overflows. Emission is the remainder of the one
 *   action after the clock has taken it, not a third thing competing with it.
 *
 * THE DISCS ARE THE STRUCTURES, area by how many points they hold, placed by a hash of
 * their own name so a disc stays where it is while it grows. Blue is neutral; warm is
 * carrying a net ±, which is a pair that has come apart inside it.
 */

import { Painter, Surface, visual } from "./CANVAS.ts";
import { G_XOR_2 } from "../theories/G^XOR*2.ts";
import { Graph } from "../backends/CPU.graph.ts";
import { GEOMETRIES, outward } from "../lib/Local.ts";

const BACK = "#08090d";
const INK = "#e6e8ef";
const FAINT = "#5a5f6e";
const GRID = "#181c26";
const VAC = "#4a7fb5";      // the vacuum's occupancy
const MASS = "#6ea8fe";     // neutral matter
const CHG = "#ffb35c";      // matter carrying a net ±
const CLUMP = "#7ee0b8";

const g: any = GEOMETRIES["fcc-12"], DEG = g.DEG;
const N = 13, BOUND = 1_500_000, TICKS = 300, EVERY = 5;
/** frames each snapshot is held for, so the film is watchable rather than a flicker */
const HOLD = 3;

type Shot = {
  t: number; fill: number; clump: number; pts: number;
  absorbed: number; radiated: number; cF: number; cP: number;
  discs: { id: number; n: number; q: number; x: number; y: number; z: number }[];
};

const paint = (): Painter => {
  let w: any = null, b: any = null, t = 0;
  /* WHICH SNAPSHOT THIS FRAME SHOWS. `dt` is a time DELTA — visuals that move accumulate
   * it — so reading it as a progress fraction drew very nearly the same frame sixty times
   * and the film looked frozen. The painter is driven one frame at a time, so it counts
   * its own, and each snapshot is held for `HOLD` of them. */
  let drawn = 0;
  let lastAbs = 0, lastRad = 0;
  const shots: Shot[] = [];

  const snap = () => {
    const two: any = w.layers.MATTER, I: any = two.inside;
    const size = new Map<number, number>(), q = new Map<number, number>();
    for (const l of two.backend as Iterable<any>) {
      const p = (l as any).part;
      size.set(p, (size.get(p) ?? 0) + 1);
      let net = 0;
      for (const r of (l as any).rays) if (r.active) net += r.polarity ?? 0;
      q.set(p, (q.get(p) ?? 0) + net);
    }
    /*
     * GRAVITY, READ WITHOUT FINDING ANYTHING. No body is located and nothing is tracked:
     * at each point that has matter, ∇m is how much more matter its own neighbours have
     * and F is the net of what is actually flying there. Matter is in the way of the
     * expansion, so the vacuum thins where it is and F runs DOWN the gradient; a
     * structure absorbs fewer rays from the matter side, and a ray pushes away from where
     * it came from, so its momentum runs UP the gradient. Both are cosines at one point.
     */
    const cosv = (a: number[], z: number[]) => {
      let d = 0, na = 0, nz = 0;
      for (let k = 0; k < 3; k++) { d += a[k] * z[k]; na += a[k] * a[k]; nz += z[k] * z[k]; }
      return na && nz ? d / Math.sqrt(na * nz) : NaN;
    };
    const massOf = (l: any) => { const m = I?.matter?.(l); return m ? m.share : 0; };
    let fS = 0, fN = 0, pS = 0, pN = 0;
    let pts = 0, dens = 0, held = 0, mdens = 0, rays = 0, act = 0;
    for (const l of b as Iterable<any>) {
      pts++; dens += (l as any).density ?? 1;
      for (const r of l.rays) { rays++; if (r.active) act++; }
      if (I?.occupied?.(l)) { held++; mdens += (l as any).density ?? 1; }
      const here = massOf(l);
      if (here <= 0) continue;
      const rr = l.rays as any[];
      const grad = [0, 0, 0], F = [0, 0, 0];
      for (let d = 0; d < rr.length && d < DEG; d++) {
        if (rr[d]?.active) for (let k = 0; k < 3; k++) F[k] += g.V[d][k] ?? 0;
        const nb: any = outward(rr[d])?.target?.source?.l;
        if (!nb) continue;
        const dm = massOf(nb) - here;
        for (let k = 0; k < 3; k++) grad[k] += dm * (g.U[d][k] ?? 0);
      }
      const c1 = cosv(F, grad);
      if (Number.isFinite(c1)) { fS += c1; fN++; }
      const list = (I as any).inside?.get?.((l as any).i) ?? [];
      for (const m of list) {
        const pv = (I as any).held2?.get?.((m as any).part);
        if (!pv) continue;
        const c2 = cosv(pv, grad);
        if (Number.isFinite(c2)) { pS += c2; pN++; }
        break;
      }
    }
    /* WHERE EACH STRUCTURE IS: the centroid of the points of the world it is held at.
     * The store keeps coordinates now, so this is a place and not a hash — which is the
     * difference between watching things move and watching labels get reshuffled. */
    const sum = new Map<number, number[]>(), cnt = new Map<number, number>();
    for (const [, held] of (I as any).inside ?? []) { void held; }
    for (const l of b as Iterable<any>) {
      const m = I?.matter?.(l);
      if (!m || !m.share) continue;
      const xy = b.at?.(l);
      if (!xy) continue;
      const list = (I as any).inside?.get?.((l as any).i) ?? [];
      for (const mm of list) {
        const p = (mm as any).part;
        const acc = sum.get(p) ?? [0, 0, 0];
        for (let k = 0; k < 3; k++) acc[k] += xy[k] ?? 0;
        sum.set(p, acc); cnt.set(p, (cnt.get(p) ?? 0) + 1);
      }
    }
    const discs = [...size.entries()]
      .sort((a, z) => z[1] - a[1]).slice(0, 120)
      .map(([id, n]) => {
        const c = cnt.get(id) ?? 0, a = sum.get(id);
        return { id, n, q: q.get(id) ?? 0,
          x: a && c ? a[0] / c : NaN, y: a && c ? a[1] / c : NaN, z: a && c ? a[2] / c : NaN };
      })
      .filter(d => Number.isFinite(d.x));
    shots.push({
      t, fill: act / Math.max(rays, 1),
      clump: held ? (mdens / held) / (dens / pts) : 0, pts,
      absorbed: (I?.absorbed ?? 0) - lastAbs, radiated: (two.radiated ?? 0) - lastRad,
      cF: fN ? fS / fN : 0, cP: pN ? pS / pN : 0,
      discs,
    });
    lastAbs = I?.absorbed ?? 0; lastRad = two.radiated ?? 0;
  };

  return {
    warm(budgetMs: number) {
      if (!w) {
        const backend = g.seed(
          new Graph(G_XOR_2 as any, 1, BOUND, DEG * 2, true, true, true, true), N);
        w = G_XOR_2.seed({ N, seed: 1, geometry: g, bound: BOUND, backend } as any);
        b = w.backend;
      }
      const until = Date.now() + budgetMs;
      while (t < TICKS && Date.now() < until) {
        w.tick(); t++;
        if (t % EVERY === 0) snap();
      }
      return t >= TICKS ? 1 : t / TICKS;
    },

    frame({ ctx, width, height }: Surface) {
      ctx.fillStyle = BACK; ctx.fillRect(0, 0, width, height);
      if (!shots.length) return;
      const i = Math.min(shots.length - 1, Math.floor(drawn / HOLD));
      drawn++;
      const s = shots[i];

      const M = 34, TOP = 92;
      ctx.fillStyle = INK;
      ctx.font = "600 25px ui-sans-serif, system-ui, sans-serif";
      ctx.fillText("Matter condensing out of the vacuum", M, 44);
      ctx.fillStyle = FAINT;
      ctx.font = "14px ui-sans-serif, system-ui, sans-serif";
      ctx.fillText(
        "(G/1) folds the point it destroys, and the layer above is made of those points · " +
        "a structure absorbs a ray AND the point behind it, so space contracts as it feeds",
        M, 68);

      /* ── the swarm ──────────────────────────────────────────────────── */
      const swW = width * 0.56, swH = height - TOP - 150;
      ctx.strokeStyle = GRID; ctx.lineWidth = 1;
      ctx.strokeRect(M, TOP, swW, swH);
      /* THE SCALE IS OVER THE WHOLE RUN, not over the frame. Taken from the last
       * snapshot, an early structure larger than anything that survives comes out with a
       * radius past 1 and is drawn over the title. */
      let biggest = 1;
      for (const x of shots) for (const d of x.discs) if (d.n > biggest) biggest = d.n;
      ctx.save();
      ctx.beginPath(); ctx.rect(M, TOP, swW, swH); ctx.clip();
      /* the box the world was laid down in, plus what it has grown past */
      let lo = 0, hi = N - 1;
      for (const x of shots) for (const d of x.discs) {
        lo = Math.min(lo, d.x, d.y); hi = Math.max(hi, d.x, d.y);
      }
      const span = Math.max(1, hi - lo);
      const px = (v: number) => M + 12 + ((v - lo) / span) * (swW - 24);
      const py = (v: number) => TOP + 12 + ((v - lo) / span) * (swH - 24);

      /* THE TRAIL — where each structure has been over the last few samples, so a
       * trajectory reads as a trajectory rather than as a disc that has moved */
      const TRAIL = 8;
      for (let k = Math.max(0, i - TRAIL); k < i; k++) {
        const a = k / Math.max(i, 1);
        for (const d of shots[k].discs) {
          if (d.n < 3) continue;
          ctx.fillStyle = d.q !== 0 ? CHG : MASS;
          ctx.globalAlpha = 0.10 * a;
          ctx.beginPath(); ctx.arc(px(d.x), py(d.y), 2 + Math.min(1, Math.sqrt(d.n / biggest)) * 22, 0, Math.PI * 2); ctx.fill();
        }
      }
      for (const d of s.discs) {
        const r = 2 + Math.min(1, Math.sqrt(d.n / biggest)) * 26;
        ctx.fillStyle = d.q !== 0 ? CHG : MASS;
        ctx.globalAlpha = d.q !== 0 ? 0.9 : 0.55;
        ctx.beginPath(); ctx.arc(px(d.x), py(d.y), r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.restore();
      ctx.fillStyle = FAINT;
      ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.fillText(`${s.discs.length} structures · largest ${s.discs[0]?.n ?? 0} points` +
        ` · warm = carrying a net ± · position is the centroid of the space it holds`, M + 4, TOP + swH + 18);

      /* ── the lines ──────────────────────────────────────────────────── */
      const cx = M + swW + 40, cw = width - cx - M, ch = (swH - 40) / 3;
      const line = (row: number, label: string, get: (x: Shot) => number, col: string, fmt: (v: number) => string) => {
        const y0 = TOP + row * (ch + 20);
        const vals = shots.map(get);
        const hi = Math.max(1e-9, ...vals);
        ctx.strokeStyle = GRID; ctx.beginPath();
        ctx.moveTo(cx, y0 + ch); ctx.lineTo(cx + cw, y0 + ch); ctx.stroke();
        ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath();
        shots.forEach((x, k) => {
          if (k > i) return;
          const px = cx + (k / Math.max(shots.length - 1, 1)) * cw;
          const py = y0 + ch - (get(x) / hi) * ch;
          k ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
        });
        ctx.stroke();
        ctx.fillStyle = INK;
        ctx.font = "600 12px ui-monospace, SFMono-Regular, Menlo, monospace";
        ctx.fillText(`${label}  ${fmt(get(s))}`, cx, y0 - 6);
      };
      line(0, "vacuum occupancy", x => x.fill, VAC, v => v.toFixed(3));
      line(1, "matter density / ambient", x => x.clump, CLUMP, v => `${v.toFixed(1)}×`);
      /* the two gravity cosines, on one signed axis so the split reads at a glance */
      {
        const y0 = TOP + 2 * (ch + 20), mid = y0 + ch / 2;
        ctx.strokeStyle = GRID; ctx.beginPath();
        ctx.moveTo(cx, mid); ctx.lineTo(cx + cw, mid); ctx.stroke();
        const trace = (get: (x: Shot) => number, col: string) => {
          ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath();
          shots.forEach((x, k) => {
            if (k > i) return;
            const qx = cx + (k / Math.max(shots.length - 1, 1)) * cw;
            const qy = mid - Math.max(-1, Math.min(1, get(x))) * (ch / 2);
            k ? ctx.lineTo(qx, qy) : ctx.moveTo(qx, qy);
          });
          ctx.stroke();
        };
        trace(x => x.cF, VAC);
        trace(x => x.cP, CHG);
        ctx.fillStyle = INK;
        ctx.font = "600 12px ui-monospace, SFMono-Regular, Menlo, monospace";
        ctx.fillText(`gravity   flux·∇m ${s.cF.toFixed(2)}` +
          `   momentum·∇m ${s.cP.toFixed(2)}`, cx, y0 - 6);
        ctx.fillStyle = FAINT;
        ctx.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace";
        ctx.fillText("the vacuum runs away from matter · matter is pushed towards it",
          cx, y0 + ch + 14);
      }

      ctx.fillStyle = FAINT;
      ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.fillText(`tick ${s.t} of ${TICKS}   ·   ${s.pts} points of vacuum` +
        `   ·   radiating ${(s.radiated / EVERY).toFixed(0)}/tick`, M, height - 30);
    },
  };
};

export default [visual({
  id: "matter",
  what: "matter condensing out of the vacuum in G^XOR*2 — the swarm of structures, the occupancy, and the concentration",
  width: 1360,
  height: 760,
  frames: 180,
  paint,
})];
