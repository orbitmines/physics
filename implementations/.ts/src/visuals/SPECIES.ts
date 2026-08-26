/**
 * A SPECIES IS A THING THAT PULSES — mass on one axis, period on the other.
 *
 * ASKING FOR A REPEATING SHAPE WAS THE WRONG QUESTION and it got a wrong answer. Censused
 * by exact shape, the only signature stable across samples was A SINGLE ISOLATED POINT:
 * 732 copies of it, present in every sample, and everything else was one blob measured at
 * sixteen different sizes as it grew. That is what happens when you ask a thing made of
 * thousands of points to hold still — a real aggregate never repeats exactly, it BREATHES.
 *
 * SO IT IS FOUND WHERE THE PULL IS. Matter is in the way of the expansion, so a region
 * holding matter suppresses (G/2), and the places that suppression is strongest are where
 * the aggregates are — WITHOUT ANYBODY HAVING TO IDENTIFY ONE. Take those as centres,
 * watch how much mass is within reach of each over a long run, and ask whether the number
 * comes back. A period is a property of the thing. Two things with the same period and the
 * same mass are the same KIND of thing, and that is what a species is here.
 *
 * AND THE VACUUM'S OWN BEAT IS DIVIDED OUT FIRST. (G/2) splits every neutral point and the
 * meetings unmake what it made, so the whole lattice rises and falls together on a beat
 * that belongs to the medium and not to anything in it. Read raw, every region carries
 * that beat and every region looks like a resonance — which is finding a species in empty
 * space. What is plotted is each region's SHARE of the world, so the common motion cancels
 * and what is left is this region holding more or less than its part.
 *
 * NOTHING IS TRACKED BETWEEN TICKS. A centre is a PLACE, and what is measured is what is
 * at that place — so an aggregate that wanders off simply stops contributing, which is a
 * fact about it rather than a failure of bookkeeping.
 *
 * READ THE PLOT THIS WAY. Each disc is one centre of pull: across is how much mass it
 * holds, up is the period it keeps coming back at, and the disc's size is how strongly it
 * does so. Discs that land on top of each other are the same kind of thing found twice —
 * which is the whole claim. The traces beneath are what each one actually did.
 */

import { Painter, Surface, visual } from "./CANVAS.ts";
import { G_XOR_C } from "../theories/G^XOR^c.ts";
import { Graph } from "../backends/CPU.graph.ts";
import { GEOMETRIES, outward } from "../lib/Local.ts";

const BACK = "#08090d";
const INK = "#e6e8ef";
const FAINT = "#5a5f6e";
const GRID = "#181c26";
const WEAK = "#4a7fb5";
const STRONG = "#ffb35c";
const TRACE = "#6ea8fe";

const g: any = GEOMETRIES["fcc-12"], DEG = g.DEG, D = g.D as number;
const N = 13, BOUND = 40_000;
const SETTLE = 40, WATCH = 160, R = 3, CENTRES = 18;
/** MANY WORLDS, NOT ONE. Eight centres out of a single run cannot show a cluster — with
 *  that few points every mass is its own island whether or not there are kinds. Each seed
 *  is an independent world and its centres are more of the same question. */
const SEEDS = 24;
/** a pulse this weak is noise, and the axis says so rather than the caption */
const REAL = 0.25;

type Centre = { at: number[]; mass: number; period: number; corr: number; x: number[]; seed: number };

/** the period a signal keeps coming back at — autocorrelation, no transform, no fitting.
 *  FROM THREE, because two is the vacuum's own beat and everything has it. */
const periodOf = (x0: number[]) => {
  /*
   * DIFFERENCED FIRST, AND THE PEAK HAS TO BE A PEAK.
   *
   * A THING THAT IS MERELY GROWING CORRELATES WITH ITSELF AT EVERY LAG. Subtracting the
   * mean does not help — a rising signal is below its mean for the whole first half and
   * above it for the second, so any two points a few ticks apart multiply to something
   * positive whatever the separation. Ten centres all came back "period 3, correlation
   * 0.94", four of them with traces that are smooth monotone climbs and no oscillation in
   * them at all. Taking out the straight line was not enough either: the growth here
   * ACCELERATES, so a linear fit leaves a curved residual that correlates just as happily,
   * and lag 3 kept winning by being the smallest one allowed.
   *
   * SO WHAT IS AUTOCORRELATED IS THE CHANGE, tick to tick. Differencing kills any trend
   * that is smooth on the scale being looked at and leaves whatever oscillates, which is
   * the only thing a period can be about.
   *
   * AND A PERIOD IS A LOCAL MAXIMUM OF THE CORRELATION, not the largest value in a range.
   * A signal with no period at all still has a biggest correlation somewhere; a signal
   * WITH one comes back at that lag and not at its neighbours. Requiring the winner to
   * beat both of its neighbours is what tells those apart, and it costs nothing.
   */
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
    if (rs[lag] <= rs[lag - 1] || rs[lag] <= rs[lag + 1]) continue;   // not a peak
    if (rs[lag] > br) { br = rs[lag]; bp = lag; }
  }
  return { p: bp, r: Math.max(0, br) };
};

const paint = (): Painter => {
  let w: any = null, b: any = null, t = 0, seed = 1;
  let centres: { at: number[]; m: number }[] = [];
  let series: number[][] = [];
  let global: number[] = [];
  let found: Centre[] = [];

  const pickCentres = (): void => {
    const held = (l: any) => (b.contained?.(l) ?? []).length;
    const cands: { at: number[]; m: number }[] = [];
    for (const l of b as Iterable<any>) {
      const m = held(l);
      if (m < 2) continue;
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
      centres.push(c);
    }
    series = centres.map((): number[] => []);
  };

  const sample = () => {
    global.push(b.foldedSize());
    const acc = new Array(centres.length).fill(0);
    /* WALKED OVER WHAT IS FOLDED, not over the whole world: asking every point what it
     * contains means a list-walk per point across the whole lattice, every tick, to find
     * the few that hold anything. The folded set IS the answer. */
    b.eachFolded((x: any) => {
      const h = b.parent(x); if (!h) return;
      const p = b.at?.(h); if (!p) return;
      for (let c = 0; c < centres.length; c++) {
        let d2 = 0;
        for (let i = 0; i < D; i++) d2 += (p[i] - centres[c].at[i]) ** 2;
        if (d2 <= R * R) { acc[c]++; return; }
      }
    });
    for (let c = 0; c < centres.length; c++) series[c].push(acc[c]);
  };

  return {
    warm(budgetMs: number) {
      const until = Date.now() + budgetMs;
      while (seed <= SEEDS && Date.now() < until) {
        if (!w) {
          const backend = g.seed(new Graph(G_XOR_C as any, seed, BOUND, DEG * 2, true, true, true, true), N);
          w = G_XOR_C.seed({ N, seed, geometry: g, bound: BOUND, backend } as any);
          /* the theory records each turn as it makes it — see `steer` in `G^XOR+XOR` */
          (w as any).turnLog = [];
          b = w.backend; t = 0; global = [];
        }
        while (t < SETTLE + WATCH && Date.now() < until) {
          w.tick(); t++;
          if (t === SETTLE) pickCentres();
          else if (t > SETTLE) sample();
        }
        if (t < SETTLE + WATCH) break;          // out of budget mid-world; resume next call
        /* this world is done: take what it found and start the next */
        for (let i = 0; i < centres.length; i++) {
          const x = series[i];
          if (!x.length) continue;
          const share = x.map((v, k) => v / Math.max(global[k] ?? 1, 1));
          const { p, r } = periodOf(share);
          const mass = x.reduce((a, z) => a + z, 0) / x.length;
          if (mass > 0) found.push({ at: centres[i].at, mass, period: p, corr: r, x, seed });
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
      ctx.fillText("A species is a thing that pulses", M, 44);
      ctx.fillStyle = FAINT;
      ctx.font = "14px ui-sans-serif, system-ui, sans-serif";
      ctx.fillText(
        `${found.length} centres of pull across ${SEEDS} independent ${N}³ worlds · across is the ` +
        `mass each holds, up is the period it comes back at · the vacuum's own beat is divided out`,
        M, 68);

      if (!found.length) {
        ctx.fillStyle = FAINT;
        ctx.font = "15px ui-sans-serif, system-ui, sans-serif";
        ctx.fillText("nothing held together long enough to pulse", M, 140);
        return;
      }

      /* THE PLANE. Across: mass. Up: period. A cluster is a kind. */
      const PW = Math.floor(width * 0.56), PH = height - 300;
      const px0 = M + 50, py0 = 110;
      const mMax = Math.max(4, ...found.map(c => c.mass)) * 1.15;
      const pMax = Math.max(6, ...found.map(c => c.period)) * 1.15;
      const px = (m: number) => px0 + (m / mMax) * PW;
      const py = (p: number) => py0 + PH - (p / pMax) * PH;

      ctx.strokeStyle = GRID; ctx.lineWidth = 1;
      for (let k = 0; k <= 4; k++) {
        const y = py0 + (PH * k) / 4;
        ctx.beginPath(); ctx.moveTo(px0, y); ctx.lineTo(px0 + PW, y); ctx.stroke();
        ctx.fillStyle = FAINT;
        ctx.font = "11px ui-monospace, monospace";
        ctx.fillText(String(Math.round(pMax * (1 - k / 4))), px0 - 26, y + 4);
      }
      ctx.fillStyle = FAINT;
      ctx.font = "12px ui-sans-serif, system-ui, sans-serif";
      ctx.save(); ctx.translate(px0 - 34, py0 + PH / 2); ctx.rotate(-Math.PI / 2);
      ctx.textAlign = "center"; ctx.fillText("period — ticks to come back", 0, 0);
      ctx.restore(); ctx.textAlign = "left";
      ctx.fillText("mass held", px0 + PW / 2 - 28, py0 + PH + 30);

      for (const c of found) {
        const r = 5 + Math.min(1, c.corr) * 22;
        const strong = c.corr >= REAL;
        ctx.fillStyle = strong ? STRONG : WEAK;
        ctx.globalAlpha = strong ? 0.75 : 0.3;
        ctx.beginPath(); ctx.arc(px(c.mass), py(c.period), r, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      }
      ctx.fillStyle = FAINT;
      ctx.font = "11px ui-sans-serif, system-ui, sans-serif";
      ctx.fillText(`disc size is how strongly it repeats · warm is above ${REAL}, which is a pulse` +
        ` rather than noise`, px0, py0 + PH + 52);

      /* WHAT EACH ONE ACTUALLY DID, so the plane above can be checked against it */
      const tx = px0 + PW + 60, tw = width - tx - M;
      ctx.fillStyle = INK;
      ctx.font = "600 13px ui-monospace, monospace";
      ctx.fillText("what each centre did", tx, py0 - 6);
      const rows = [...found].sort((a, z) => z.corr - a.corr).slice(0, 8);
      const rh = Math.min(64, PH / Math.max(rows.length, 1));
      rows.forEach((c, i) => {
        const y0 = py0 + i * rh, h = rh - 22;
        const lo = Math.min(...c.x), hi = Math.max(...c.x);
        ctx.strokeStyle = TRACE; ctx.lineWidth = 1.5;
        ctx.globalAlpha = c.corr >= REAL ? 0.9 : 0.35;
        ctx.beginPath();
        c.x.forEach((v, k) => {
          const X = tx + (k / Math.max(c.x.length - 1, 1)) * tw;
          const Y = y0 + h - ((v - lo) / Math.max(hi - lo, 1)) * h;
          k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y);
        });
        ctx.stroke(); ctx.globalAlpha = 1;
        ctx.fillStyle = FAINT;
        ctx.font = "11px ui-monospace, monospace";
        ctx.fillText(`mass ${c.mass.toFixed(0)}  ·  period ${c.period || "—"}  ·  corr ${c.corr.toFixed(2)}`,
          tx, y0 + h + 14);
      });

      /* AND WHICH OF THEM ARE THE SAME KIND — same period, masses within a quarter */
      const same: string[] = [];
      for (let i = 0; i < found.length; i++) for (let j = i + 1; j < found.length; j++) {
        const a = found[i], z = found[j];
        if (a.corr < REAL || z.corr < REAL || a.period !== z.period || !a.period) continue;
        const dm = Math.abs(a.mass - z.mass) / Math.max(a.mass, z.mass, 1);
        if (dm < 0.25) same.push(`period ${a.period}: mass ${a.mass.toFixed(0)} and ${z.mass.toFixed(0)}`);
      }
      ctx.fillStyle = same.length ? STRONG : FAINT;
      ctx.font = "13px ui-monospace, monospace";
      ctx.fillText(same.length
        ? `TWO OF A KIND — ${same.join(" · ")}`
        : "no two centres agree on both mass and period — no kind found twice",
        M, height - 40);
    },
  };
};

export default [visual({
  id: "species",
  what: "centres of gravitational pull in G^XOR^c, plotted by the mass they hold and the period they pulse at",
  width: 1500,
  height: 900,
  frames: 1,
  paint,
})];
