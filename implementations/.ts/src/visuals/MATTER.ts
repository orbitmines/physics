/**
 * WHERE THINGS ARE IS HOW FAR APART THEY ARE — and what moves, leaves a trail.
 *
 * THE COORDINATES A LATTICE IS LAID DOWN WITH STOP BEING TRUE. A point is folded and stops
 * being a place; a deflection leaves a bead at the midpoint of an edge; a structure moves
 * by being re-contained somewhere else. After a hundred ticks the numbers a site was
 * seeded with describe a grid that has not existed for most of the run — and plotting them
 * draws that grid, perfectly regular, with the actual dynamics scattered over it as noise.
 *
 * WHAT A GRAPH CAN HONESTLY SAY IS HOW FAR ONE POINT IS FROM ANOTHER along the connections
 * that exist NOW. So the frame is built from that: two anchors are chosen once, far apart,
 * and every point is placed by how many hops it is from each. Points that are close in the
 * graph come out close on the page because that is the only thing being measured. When the
 * dynamics breaks something apart, the pieces separate here too — which is the thing that
 * was invisible before.
 *
 * AND THE CENTRES LEAVE TRAILS. A centre of gravity is not marked with a ring: it is a
 * point holding more space than any of its neighbours, and what is drawn is where it has
 * BEEN — the last of its positions, fading. A thing with momentum draws a streak; a thing
 * being pushed about draws a scribble; a thing going nowhere draws a dot. Nothing computes
 * a velocity or asserts one: the trail is the history and the eye reads the motion out of
 * it, which is what watching something move means.
 *
 * NOTHING IS SEEDED. No mass is placed and no source: what gathers, gathers because (G/2)
 * and (G/1) disagree about how much space there should be.
 */

import { Painter, Surface, visual } from "./CANVAS.ts";
import { Graph } from "../backends/CPU.graph.ts";
import { GEOMETRIES, outward } from "../lib/Local.ts";
import { G_XOR_C } from "../theories/G^XOR^c.ts";

const BACK = "#07080c";
const INK = "#e6e8ef";
const FAINT = "#5a5f6e";
const DIM = "#232838";      // ordinary space
const POS = "#ffb35c";
const NEG = "#6ea8fe";
const HEAVY = "#7ee0b8";    // a centre: more space here than anywhere beside it

const g: any = GEOMETRIES["fcc-12"], DEG = g.DEG;
/*
 * IT STARTS AS ONE POINT.
 *
 * SEEDING A LATTICE AND WATCHING ITS EDGES CREEP OUTWARD SHOWS A CORNER OF SOMETHING. The
 * rules do not need a lattice to be given to them — (G/2) splits a neutral point into two
 * and there is nothing in that sentence about there being anything else. So the world is
 * ONE SITE and everything else is what the rules made: measured, one point becomes 1,678
 * and sixteen cells across by tick eight, and 12,744 and thirty-seven across by tick
 * twenty-four, at which point it is holding the bound rather than slowing down.
 *
 * AND IT COSTS WHAT EXPANDING COSTS. On a wrap `make` could never put a point down —
 * every direction already had the far side of the world in it — so a tick was cheap
 * because nothing was being built. With a boundary to grow at it fires on every free exit
 * of every neutral point, and the same box runs fifty times slower while it is growing:
 * 65ms a tick against 1,165ms. It settles back once the bound is reached.
 */
const N = 1, BOUND = 12_000, TICKS = 90, EVERY = 2;
/** how long to let it grow before the frame is pinned to it — a world of one point has
 *  no two places to measure anything between */
const SETTLE = 14;
/** how many anchors pin the frame down — more than the lattice has dimensions, so a 2D
 *  lattice and a 3D one are both covered without either being named */
const ANCHORS = 4;
const HOLD = 2;
/** how many of its own past positions a centre still shows */
const TRAIL = 26;

type Dot = { x: number; y: number; q: number; d: number };
type Cen = { x: number; y: number; m: number };
type Shot = { t: number; dots: Dot[]; cens: Cen[]; pts: number; folded: number; fill: number };

const paint = (): Painter => {
  let w: any = null, b: any = null, t = 0, drawn = 0;
  let anchors: number[] = [];
  let basis: { mean: number[]; e1: number[]; e2: number[] } | null = null;
  const shots: Shot[] = [];

  /** hops from one point to every other, along the links that exist now */
  const hopsFrom = (start: any) => {
    const d = new Map<number, number>([[(start as any).i, 0]]);
    let edge = [start];
    for (let h = 1; edge.length && h < 600; h++) {
      const next: any[] = [];
      for (const l of edge) for (const r of (l.rays as any[])) {
        const nb: any = outward(r)?.target?.source?.l;
        if (!nb || d.has(nb.i)) continue;
        d.set(nb.i, h); next.push(nb);
      }
      edge = next;
    }
    return d;
  };

  /**
   * ANCHORS BY FARTHEST-POINT SAMPLING — each new one as far as possible from all the
   * ones already taken, so between them they see the whole of the space rather than one
   * direction through it.
   *
   * TWO IS NOT ENOUGH AND CANNOT BE. Two anchors span one axis: every point is placed by
   * how far along it lies and how far off it had to go, which is a plane at best — and if
   * the two happen to be the ends of the graph's own diameter, `da + db` is the same
   * number everywhere and the whole picture collapses onto a line. Measured, thirty
   * thousand points drew one diagonal streak. A space of D dimensions needs at least D of
   * them to be pinned down, and this asks for four so there is something to spare.
   */
  const pickAnchors = (): void => {
    const first = [...(b as Iterable<any>)][0];
    if (!first) return;
    anchors = [(first as any).i];
    for (let k = 0; k < ANCHORS - 1; k++) {
      const ds = anchors.map(i2 => hopsFrom(b.ref("Local", i2)));
      let bestI = -1, bestD = -1;
      for (const [i2, h0] of ds[0]) {
        let near = h0;
        for (let z = 1; z < ds.length; z++) near = Math.min(near, ds[z].get(i2) ?? Infinity);
        if (near > bestD && Number.isFinite(near)) { bestD = near; bestI = i2; }
      }
      if (bestI < 0) break;
      anchors.push(bestI);
    }
  };

  /**
   * AND THE TWO DIRECTIONS WORTH DRAWING, FOUND ONCE AND KEPT.
   *
   * Every point now has one number per anchor, which is a coordinate system of as many
   * axes as there are anchors — skewed, and more of them than the space has dimensions.
   * What is wanted is the flat view that loses least, which is the two directions the
   * cloud actually spreads in: its principal axes, taken by power iteration on the
   * covariance and then deflated for the second.
   *
   * IT WORKS WHATEVER THE LATTICE'S DIMENSION, which is why it is done this way rather
   * than by naming axes. A three-dimensional space has three directions with spread in
   * them and the third is simply not drawn; a two-dimensional one has two, and the rest
   * come out near zero on their own. Nothing has to be told which case it is in.
   *
   * FOUND ONCE, because a basis recomputed every tick turns under the points and
   * everything appears to tumble whether or not it has moved.
   */
  const findBasis = (rows: number[][]) => {
    const K = anchors.length;
    const mean = new Array(K).fill(0);
    for (const r of rows) for (let i2 = 0; i2 < K; i2++) mean[i2] += r[i2] / rows.length;
    const cov = Array.from({ length: K }, () => new Array(K).fill(0));
    for (const r of rows) for (let a = 0; a < K; a++) for (let z = 0; z < K; z++)
      cov[a][z] += (r[a] - mean[a]) * (r[z] - mean[z]) / rows.length;
    const mul = (v: number[]) => cov.map(row => row.reduce((s, c, z) => s + c * v[z], 0));
    const norm = (v: number[]) => { const n = Math.hypot(...v) || 1; return v.map(x => x / n); };
    const power = () => {
      let v = norm(new Array(K).fill(0).map((_, i2) => Math.sin(i2 + 1)));
      for (let it = 0; it < 60; it++) v = norm(mul(v));
      return v;
    };
    const e1 = power();
    /* deflate, so the second direction is the best one at right angles to the first */
    for (let a = 0; a < K; a++) for (let z = 0; z < K; z++) {
      const lam = e1.reduce((s, x, q) => s + x * mul(e1)[q], 0);
      cov[a][z] -= lam * e1[a] * e1[z];
    }
    const e2 = power();
    return { mean, e1, e2 };
  };

  const snap = () => {
    if (anchors.length < 2) return;
    const ds = anchors.map(i2 => hopsFrom(b.ref("Local", i2)));

    /* every point's distance to each anchor — the raw coordinates */
    const rows: number[][] = [];
    const meta: { l: any; q: number; held: number }[] = [];
    let rays = 0, act = 0;
    for (const l of b as Iterable<any>) {
      for (const r of l.rays as any[]) { rays++; if (r.active) act++; }
      const row: number[] = [];
      let ok = true;
      for (const d of ds) { const h = d.get((l as any).i); if (h === undefined) { ok = false; break; } row.push(h); }
      if (!ok) continue;
      let q = 0;
      for (const r of l.rays as any[]) if (r.active) q += r.charge ?? 0;
      rows.push(row);
      meta.push({ l, q, held: (b.contained?.(l) ?? []).length });
    }
    if (!rows.length) return;
    /* taken once the world is worth measuring, and kept from then on */
    if (!basis && rows.length >= 200) basis = findBasis(rows);
    const use = basis ?? findBasis(rows);
    const { mean, e1, e2 } = use;
    const proj = (row: number[]) => {
      let x = 0, y = 0;
      for (let i2 = 0; i2 < row.length; i2++) { const c = row[i2] - mean[i2]; x += c * e1[i2]; y += c * e2[i2]; }
      return [x, y] as const;
    };

    const dots: Dot[] = [];
    const heavy: { i: number; x: number; y: number; m: number }[] = [];
    for (let n = 0; n < rows.length; n++) {
      const [x, y] = proj(rows[n]);
      const m = meta[n];
      dots.push({ x, y, q: m.q, d: m.held });
      if (m.held >= 2) heavy.push({ i: (m.l as any).i, x, y, m: m.held });
    }

    /* A CENTRE IS A POINT HOLDING MORE THAN ANY OF ITS NEIGHBOURS DO — asked of the point
     * and its own links, so nothing is located from outside and no ring is drawn. */
    const cens: Cen[] = [];
    for (const h of heavy) {
      const l = b.ref("Local", h.i);
      let top = true;
      for (const r of (l.rays as any[])) {
        const nb: any = outward(r)?.target?.source?.l;
        if (nb && (b.contained?.(nb) ?? []).length > h.m) { top = false; break; }
      }
      if (top) cens.push({ x: h.x, y: h.y, m: h.m });
    }
    shots.push({ t, dots, cens, pts: b.size(), folded: b.foldedSize(), fill: act / Math.max(rays, 1) });
  };

  return {
    warm(budgetMs: number) {
      if (!w) {
        const backend = g.seed(new Graph(G_XOR_C as any, 1, BOUND, DEG * 2, true, true, true, true), N);
        w = G_XOR_C.seed({ N, seed: 1, geometry: g, bound: BOUND, backend } as any);
        (w as any).turnLog = [];
        b = w.backend;
      }
      const until = Date.now() + budgetMs;

      /*
       * ONE PASS, AND THE FRAME IS PINNED AS SOON AS THERE IS SOMETHING TO PIN IT TO.
       *
       * IT CANNOT BE PINNED AT THE START, because at the start there is ONE POINT —
       * farthest-point sampling on a world of size one hands back that site four times
       * over, every coordinate comes out identical, and the projection collapses.
       *
       * AND IT CANNOT BE FOUND IN A SCOUTING RUN AND CARRIED OVER, which was tried: an
       * anchor is an INDEX, and an index means nothing in a store it did not come from.
       * The second store has no such row, `head` gives `undefined`, and the walk that
       * should stop at `NONE` goes round for ever. That is fixed in the store, where a
       * chain that does not end now reads as nothing held — but the visual should not have
       * been asking it in the first place.
       *
       * SO EVERY TICK IS RECORDED FROM THE FIRST, and the early ones are laid out by
       * whatever anchors the world has at that moment. A world of three points has no
       * stable frame and does not need one; once it is big enough the frame is taken once
       * and kept, and everything after it is in the same coordinates.
       */
      while (t < TICKS && Date.now() < until) {
        w.tick(); t++;
        if (!anchors.length || (!basis && b.size() >= 200)) pickAnchors();
        if (t === 1 || t % EVERY === 0) snap();
      }
      /* the scouting pass is a fraction of the work, so progress counts both */
      return t >= TICKS ? 1 : t / TICKS;
    },

    frame({ ctx, width, height }: Surface) {
      ctx.fillStyle = BACK; ctx.fillRect(0, 0, width, height);
      ctx.textBaseline = "alphabetic";
      if (!shots.length) return;
      const i = Math.min(shots.length - 1, Math.floor(drawn / HOLD));
      drawn++;
      const s = shots[i];

      const M = 40, TOP = 100, W = width - 2 * M, H = height - TOP - 70;
      ctx.fillStyle = INK;
      ctx.font = "600 26px ui-sans-serif, system-ui, sans-serif";
      ctx.fillText("Space, laid out by how far apart it is", M, 46);
      ctx.fillStyle = FAINT;
      ctx.font = "14px ui-sans-serif, system-ui, sans-serif";
      ctx.fillText(
        "one point at the start · every site placed by its distance in HOPS from four fixed anchors, " +
        "viewed along the two directions it spreads in most · trails are where the heavy points have been",
        M, 72);

      /* one scale for the whole run, so growth reads as growth */
      let lox = 0, hix = 0, loy = 0, hiy = 0;
      for (const x of shots) for (const d of x.dots) {
        if (d.x < lox) lox = d.x; if (d.x > hix) hix = d.x;
        if (d.y < loy) loy = d.y; if (d.y > hiy) hiy = d.y;
      }
      const sx = Math.max(1, hix - lox), sy = Math.max(1, hiy - loy);
      const k = Math.min(W / sx, H / sy);
      const ox = M + (W - sx * k) / 2 - lox * k, oy = TOP + (H - sy * k) / 2 - loy * k;
      const px = (x: number) => ox + x * k, py = (y: number) => oy + y * k;

      /* ORDINARY SPACE, faint — the sea the rest of it happens in */
      ctx.fillStyle = DIM;
      ctx.globalAlpha = 0.5;
      for (const d of s.dots) {
        if (d.q !== 0 || d.d) continue;
        ctx.beginPath(); ctx.arc(px(d.x), py(d.y), 1.3, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      /* WHAT IS CHARGED, and what is holding space */
      for (const d of s.dots) {
        if (d.q === 0 && !d.d) continue;
        const r = 1.8 + Math.min(1, Math.sqrt(d.d / 6)) * 4;
        ctx.fillStyle = d.q > 0 ? POS : d.q < 0 ? NEG : HEAVY;
        ctx.globalAlpha = d.q !== 0 ? 0.9 : 0.5;
        ctx.beginPath(); ctx.arc(px(d.x), py(d.y), r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      /* AND WHERE THE CENTRES HAVE BEEN. Not a velocity anybody computed — the positions
       * themselves, fading, so a streak is a thing that went somewhere. */
      for (let back = Math.min(TRAIL, i); back >= 0; back--) {
        const old = shots[i - back];
        const a = (1 - back / (TRAIL + 1)) ** 2;
        for (const c of old.cens) {
          ctx.fillStyle = HEAVY;
          ctx.globalAlpha = 0.5 * a;
          ctx.beginPath();
          ctx.arc(px(c.x), py(c.y), 2 + Math.min(1, c.m / 8) * 5 * a, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      ctx.fillStyle = FAINT;
      ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.fillText(
        `tick ${s.t} of ${TICKS}   ·   ${s.pts.toLocaleString()} points   ·   ` +
        `${s.folded.toLocaleString()} folded away   ·   ${s.cens.length} centres   ·   ` +
        `occupancy ${s.fill.toFixed(3)}   ·   ${anchors.length} anchors   ·   ` +
        `frame is ${sx.toFixed(0)} × ${sy.toFixed(0)} hops`,
        M, height - 40);
      ctx.fillStyle = "#39404f";
      ctx.font = "11px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.fillText(
        "warm and cool are the two charges   ·   green is space held together, and its trail " +
        "is where it came from   ·   faint grey is space carrying nothing",
        M, height - 22);
    },
  };
};

export default [visual({
  id: "matter",
  what: "G^XOR^c laid out by graph distance, with the heavy points trailing where they have been",
  width: 1500,
  height: 1100,
  frames: 220,
  paint,
})];
