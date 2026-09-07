/**
 * WHAT EACH KIND LOOKS LIKE WHILE IT IS DOING IT — the aggregates, breathing.
 *
 * `species` says what a kind IS: a centre of pull, the mass it holds, and the period it
 * comes back at. Two numbers cannot show a shape, and a still of the points cannot show a
 * PULSE — which is the whole of what the kind was defined by. A thing that breathes has to
 * be watched breathing.
 *
 * SO EVERY PANEL IS ONE AGGREGATE, PLAYED. Each frame is one tick of the world, and the
 * points are every point of matter within reach of that centre at that tick, at the place
 * it is actually held. What the eye is being asked is whether these look like THINGS —
 * whether a kind swells and shrinks about a centre the way something held together does,
 * or whether it is a cloud of unrelated points that happen to be near each other.
 *
 * THE FACE IS FIXED ONCE AND KEPT. Which two axes to draw is decided from the whole run,
 * not per frame — recomputed each tick the projection would swim about and every aggregate
 * would look like it was tumbling whether or not it moved at all.
 *
 * READ IT THIS WAY. The ring is the reach the mass is counted in, so a shape pressing
 * against it is one outgrowing its own centre. Warm points carry a net charge. The trace
 * under each panel is that aggregate's own mass over the whole run with the moment being
 * drawn marked on it, so what the eye sees can be checked against what was measured.
 */

import { Painter, Surface, visual } from "./CANVAS.ts";
import { G_XOR_C } from "../theories/G^XOR^c.ts";
import { Graph } from "../backends/CPU.graph.ts";
import { GEOMETRIES, outward } from "../lib/Local.ts";

const BACK = "#08090d";
const INK = "#e6e8ef";
const FAINT = "#5a5f6e";
const GRID = "#181c26";
const DOT = "#6ea8fe";
const CHG = "#ffb35c";
const RING = "#2a3140";
const TRACE = "#4a7fb5";

const g: any = GEOMETRIES["fcc-12"], DEG = g.DEG, D = g.D as number;
const N = 13, BOUND = 40_000;
const SETTLE = 30, WATCH = 120, R = 4, CENTRES = 8, SEEDS = 2;
/** frames each tick is held for, so a pulse is watchable rather than a flicker */
const HOLD = 2;

type Frame = { pts: { x: number; y: number; q: number }[]; n: number };
type Shape = {
  mass: number; period: number; corr: number;
  film: Frame[];          // one per tick — this is the thing pulsing
  series: number[];       // its mass over the run, to check the film against
};

const periodOf = (x0: number[]) => {
  /* differenced, and the peak must be a peak — see the note in `SPECIES.ts` */
  const n0 = x0.length;
  if (n0 < 12) return { p: 0, r: 0 };
  const x = x0.slice(1).map((v, i) => v - x0[i]);
  const n = x.length, mu = x.reduce((a, z) => a + z, 0) / n;
  const d = x.map(v => v - mu);
  const v0 = d.reduce((a, z) => a + z * z, 0);
  if (v0 <= 0) return { p: 0, r: 0 };
  const rs: number[] = [];
  const top = Math.floor(n / 3);
  for (let lag = 0; lag <= top; lag++) {
    let s = 0;
    for (let i = 0; i + lag < n; i++) s += d[i] * d[i + lag];
    rs.push(s / v0);
  }
  let bp = 0, br = 0;
  for (let lag = 3; lag < top; lag++) {
    if (rs[lag] <= rs[lag - 1] || rs[lag] <= rs[lag + 1]) continue;
    if (rs[lag] > br) { br = rs[lag]; bp = lag; }
  }
  return { p: bp, r: Math.max(0, br) };
};

const paint = (): Painter => {
  let w: any = null, b: any = null, t = 0, seed = 1, drawn = 0;
  let centres: { at: number[] }[] = [];
  let series: number[][] = [];
  let films: { p: number[]; q: number }[][][] = [];
  let global: number[] = [];
  const shapes: Shape[] = [];

  const pickCentres = (): void => {
    const held = (l: any) => (b.contained?.(l) ?? []).length;
    const cands: { at: number[]; m: number }[] = [];
    for (const l of b as Iterable<any>) {
      const m = held(l);
      if (m < 3) continue;
      const p = b.at?.(l); if (!p) continue;
      let top = true;
      for (const r of l.rays as any[]) {
        const nb: any = outward(r)?.target?.source?.l;
        if (nb && held(nb) > m) { top = false; break; }
      }
      if (top) cands.push({ at: p.slice(), m });
    }
    cands.sort((a, z) => z.m - a.m);
    centres = [];
    for (const c of cands) {
      if (centres.length >= CENTRES) break;
      if (centres.some(x => Math.hypot(...x.at.map((v, i) => v - c.at[i])) < 2 * R)) continue;
      centres.push({ at: c.at });
    }
    series = centres.map((): number[] => []);
    films = centres.map((): any[] => []);
  };

  const sample = (): void => {
    global.push(b.foldedSize());
    const acc = new Array(centres.length).fill(0);
    /* AND THE POINTS THEMSELVES, kept per tick — the film. Counting them and throwing them
     * away leaves a number that pulses and no way to see it doing so. */
    const shot: { p: number[]; q: number }[][] = centres.map((): { p: number[]; q: number }[] => []);
    b.eachFolded((x: any) => {
      const h = b.parent(x); if (!h) return;
      const p = b.at?.(h); if (!p) return;
      for (let c = 0; c < centres.length; c++) {
        let d2 = 0;
        for (let i = 0; i < D; i++) d2 += (p[i] - centres[c].at[i]) ** 2;
        if (d2 <= R * R) {
          acc[c]++;
          let q = 0;
          for (const r of (x.rays as any[])) if (r.active) q += r.charge ?? 0;
          shot[c].push({ p: [p[0] - centres[c].at[0], p[1] - centres[c].at[1], p[2] - centres[c].at[2]], q });
          return;
        }
      }
    });
    for (let c = 0; c < centres.length; c++) { series[c].push(acc[c]); films[c].push(shot[c]); }
  };

  /**
   * THE FACE TO DRAW IT ON, DECIDED FROM THE WHOLE RUN.
   *
   * Which two axes an aggregate spreads most in is a fact about the thing, so it is worked
   * out once over every tick of the film and then kept. Recomputed per frame it would swim
   * — the projection turning under the points — and everything would look like it was
   * tumbling whether or not it had moved at all.
   */
  const faceOf = (film: { p: number[]; q: number }[][]) => {
    const v = [0, 0, 0];
    for (const shot of film) for (const z of shot)
      for (let i = 0; i < 3; i++) v[i] += z.p[i] * z.p[i];
    const order = [0, 1, 2].sort((a, z) => v[z] - v[a]);
    return [order[0], order[1]] as const;
  };

  return {
    warm(budgetMs: number) {
      const until = Date.now() + budgetMs;
      while (seed <= SEEDS && Date.now() < until) {
        if (!w) {
          const backend = g.seed(new Graph(G_XOR_C as any, seed, BOUND, DEG * 2, true, true, true, true), N);
          w = G_XOR_C.seed({ N, seed, geometry: g, bound: BOUND, backend } as any);
          (w as any).turnLog = [];
          b = w.backend; t = 0; global = [];
        }
        while (t < SETTLE + WATCH && Date.now() < until) {
          w.tick(); t++;
          if (t === SETTLE) pickCentres();
          else if (t > SETTLE) sample();
        }
        if (t < SETTLE + WATCH) break;
        for (let i = 0; i < centres.length; i++) {
          const x = series[i];
          if (!x.length) continue;
          const share = x.map((v, k) => v / Math.max(global[k] ?? 1, 1));
          const { p, r } = periodOf(share);
          const mass = x.reduce((a, z) => a + z, 0) / x.length;
          if (mass <= 3) continue;
          const [ax, ay] = faceOf(films[i]);
          const film = films[i].map(shot => ({
            n: shot.length,
            pts: shot.map(z => ({ x: z.p[ax], y: z.p[ay], q: z.q })),
          }));
          shapes.push({ mass, period: p, corr: r, film, series: x });
        }
        w = null; seed++;
      }
      return seed > SEEDS ? 1 : (seed - 1 + t / (SETTLE + WATCH)) / SEEDS;
    },

    frame({ ctx, width, height }: Surface) {
      ctx.fillStyle = BACK; ctx.fillRect(0, 0, width, height);
      ctx.textBaseline = "alphabetic";
      const M = 40;

      ctx.fillStyle = INK;
      ctx.font = "600 26px ui-sans-serif, system-ui, sans-serif";
      ctx.fillText("What each kind looks like while it breathes", M, 44);
      ctx.fillStyle = FAINT;
      ctx.font = "14px ui-sans-serif, system-ui, sans-serif";
      ctx.fillText(
        `every point of matter within reach of a centre of pull, tick by tick · ` +
        `warm carries a net charge · the trace is that aggregate's own mass over the run`,
        M, 68);

      const list = [...shapes].sort((a, z) => z.corr - a.corr).slice(0, 8);
      if (!list.length) {
        ctx.fillStyle = FAINT;
        ctx.font = "15px ui-sans-serif, system-ui, sans-serif";
        ctx.fillText("nothing held together long enough to have a shape", M, 140);
        return;
      }

      /* WHICH TICK THIS FRAME SHOWS. The painter is driven one frame at a time, so it
       * counts its own — `dt` is a time delta and reading it as progress freezes the film. */
      const longest = Math.max(...list.map(s => s.film.length));
      const at = Math.min(longest - 1, Math.floor(drawn / HOLD));
      drawn++;

      const COLS = 4, ROWS = Math.ceil(list.length / COLS);
      const cw = (width - 2 * M) / COLS, chh = (height - 130) / ROWS;
      const rad = Math.min(cw, chh) * 0.30;

      list.forEach((s, i) => {
        const cx = M + (i % COLS) * cw + cw / 2;
        const cy = 118 + Math.floor(i / COLS) * chh + chh * 0.40;
        const k = Math.min(at, s.film.length - 1);
        const shot = s.film[k];

        ctx.strokeStyle = RING; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.stroke();

        let q = 0;
        for (const p of shot.pts) {
          const X = cx + (p.x / R) * rad;
          const Y = cy + (p.y / R) * rad;
          q += p.q;
          ctx.fillStyle = p.q !== 0 ? CHG : DOT;
          ctx.globalAlpha = p.q !== 0 ? 0.95 : 0.55;
          ctx.beginPath(); ctx.arc(X, Y, 2.4, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;

        /* its own mass over the run, with the moment being drawn marked on it */
        const tw = cw * 0.72, tx = cx - tw / 2, ty = cy + rad + 30, th = 26;
        const lo = Math.min(...s.series), hi = Math.max(...s.series);
        ctx.strokeStyle = TRACE; ctx.lineWidth = 1.2; ctx.globalAlpha = 0.7;
        ctx.beginPath();
        s.series.forEach((v, n) => {
          const X = tx + (n / Math.max(s.series.length - 1, 1)) * tw;
          const Y = ty + th - ((v - lo) / Math.max(hi - lo, 1)) * th;
          n ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y);
        });
        ctx.stroke();
        ctx.globalAlpha = 1;
        const mx = tx + (k / Math.max(s.series.length - 1, 1)) * tw;
        ctx.strokeStyle = CHG; ctx.globalAlpha = 0.8;
        ctx.beginPath(); ctx.moveTo(mx, ty - 2); ctx.lineTo(mx, ty + th + 2); ctx.stroke();
        ctx.globalAlpha = 1;

        ctx.fillStyle = FAINT;
        ctx.font = "11px ui-monospace, monospace";
        ctx.textAlign = "center";
        ctx.fillText(`${shot.n} pts now · mean ${s.mass.toFixed(0)} · period ${s.period || "—"}` +
          ` · corr ${s.corr.toFixed(2)}${q !== 0 ? `  net ${q > 0 ? "+" : ""}${q}` : ""}`,
          cx, ty + th + 16);
        ctx.textAlign = "left";
      });

      ctx.fillStyle = FAINT;
      ctx.font = "12px ui-monospace, monospace";
      ctx.fillText(`tick ${at + 1} of ${longest}`, M, height - 24);
    },
  };
};

export default [visual({
  id: "shapes",
  what: "the actual shape of every aggregate G^XOR^c holds together, drawn where its points are",
  width: 1600,
  height: 1000,
  frames: 240,
  paint,
})];
