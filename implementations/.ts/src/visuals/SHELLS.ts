/**
 * THE STATES AS PULSE SEQUENCES - what a source laying down a named radial shape actually
 * leaves in the vacuum, and whether it is that shape.
 *
 * RADIUS IS RETARDED TIME. A ray leaves at one cell a tick and nothing overtakes it, so what
 * stands at radius r on tick T was emitted on tick T - r. The radial profile a source lays
 * down IS its emission history read backwards - which means a named radial function can be
 * ASKED FOR by handing the source that function as its pulse, and whether the vacuum returns
 * it is a measurement rather than a fit.
 *
 * SO THE SCHEDULE IS THE STATE. `pulse` on `Source` carries two arrays: the SIGN it emits on
 * each tick, which flips at the radial nodes, and the DUTY, which is what fraction of ticks it
 * fires - the aggregate amplitude, since one ray is only ever +1 or -1 and an amplitude here
 * is how many of them there are. Both come from R_nl, and nothing else about the source
 * changes between panels.
 *
 * AND WHAT IS FALSIFIABLE IN IT NEEDS NO SCALE. The nodes of 3s sit at rho = 3 +/- sqrt(3),
 * so their RATIO is 2 + sqrt(3) = 3.7321 whatever a0 is; 4p's two are (5 +/- sqrt(5))/1, ratio
 * (3 + sqrt(5))/2 = 2.6180. A model that produces evenly spaced nodes is making harmonic
 * shells and not Coulomb ones, and the ratio says which without any size having to be right.
 *
 * EVERY PANEL IS THE SOURCE'S RUN MINUS THE SAME VACUUM WITH NO SOURCE IN IT, seeded
 * identically, so what is drawn is what the source did and not what the vacuum does anyway.
 * CREATION is on throughout and nothing is imposed.
 */
import { visual, Painter, Surface } from "./CANVAS.ts";
import { World, GEOMETRIES } from "../lib/DISCRETE.ts";
import { G_XOR_XOR } from "../theories/G^XOR+XOR.ts";
import { CONTRAST, colour } from "../lib/Atom.ts";

const BACK = "#08090d", DIM = "#8a8d99", FAINT = "#5f6472";

/** the associated Laguerre polynomial, by the standard recurrence */
const lag = (k: number, a: number, x: number): number => {
  if (k === 0) return 1;
  if (k === 1) return 1 + a - x;
  let Lm = 1, L = 1 + a - x;
  for (let i = 1; i < k; i++) {
    const Ln = ((2 * i + 1 + a - x) * L - (i + a) * Lm) / (i + 1);
    Lm = L; L = Ln;
  }
  return L;
};

/** R_nl(r), which is both the shape wanted and the history that asks for it */
const Rnl = (n: number, l: number, a0: number, r: number) => {
  const rho = 2 * r / (n * a0);
  return Math.pow(rho, l) * Math.exp(-rho / 2) * lag(n - l - 1, 2 * l + 1, rho);
};

const schedule = (n: number, l: number, a0: number, len: number) => {
  const raw = Array.from({ length: len }, (_, t) => Rnl(n, l, a0, t));
  const hi = Math.max(...raw.map(Math.abs)) || 1;
  return { sign: raw.map(v => (v >= 0 ? 1 : -1)),
           duty: raw.map(v => Math.min(1, Math.abs(v) / hi)) };
};

/** where R_nl changes sign, which is what the panel is checked against */
const nodesOf = (n: number, l: number, a0: number, rmax: number) => {
  const out: number[] = [];
  for (let r = 0.4; r < rmax; r += 0.005)
    if (Rnl(n, l, a0, r) * Rnl(n, l, a0, r + 0.005) < 0) out.push(r);
  return out;
};

/*
 * THE PICTURE IS CUT TO WHAT THE SOURCE ACTUALLY REACHES, and it was not before.
 *
 * Measured, the charge a source adds runs 2.40, 1.11, 0.17 per cell at r = 1, 2, 3 and is
 * under the noise past that. Drawn to eleven cells, nine of them were beyond anything the
 * source touched - so nine tenths of every panel was the vacuum's own fluctuation, and no
 * filtering recovers a shape from a region nothing reached. R = 4 keeps the two cells that
 * carry the signal and one either side of them, and the box shrinks with it.
 */
const GEOM = "fcc-12", N = 13, C = 6, R = 4, PX = 2 * R + 1;
const WARM = 8, TICKS = 150, SEEDS = 15;

type State = { n: number; l: number; m: number; a0: number; len: number };

/**
 * EVERY (n, l) THROUGH n = 4, which is the set `lib/Atom.ts` solves and `atom.cloud` draws -
 * so the two pictures cover the same states and can be read against each other.
 *
 * AND a0 IS SET PER STATE, WHICH COSTS NOTHING. A state reaches out to about n^{2}·a0 cells,
 * so a fixed a0 would put 4s past the edge of any box this can afford. Everything the claim
 * rests on is a RATIO - the two nodes of 3s stand at 2 + sqrt(3) whatever a0 is - so shrinking
 * the scale for the far-reaching states loses nothing that is being tested. a0 = 12/n^{2}
 * keeps every state inside R and is the only place a size is chosen.
 *
 * THE LADDER STOPS AT CYCLE, AND THAT IS THE MODEL'S OWN PREDICTION. The winding is a whole
 * number of ring steps and the ring has CYCLE of them - 6 on fcc-12 - so n runs 1..5 here and
 * n = 6 has no direction left to wind through. Hydrogen has no such ceiling, and this is the
 * sharpest place the model can be wrong.
 */
/*
 * a0 IS SET SO THE STATE FITS INSIDE THE REACH, which is the whole of what was wrong.
 *
 * A source's influence on this vacuum dies by about three cells - measured, the charge excess
 * runs 2.40, 1.11, 0.17 at r = 1, 2, 3 and is under the noise past that. Drawing out to eleven
 * cells therefore drew nine cells of pure noise round two cells of signal, and no amount of
 * filtering recovers a structure from a region the source never reached. So the state is
 * SCALED TO THE REACH: its outermost feature is put at about two and a half cells, and the
 * picture is cut off just past it.
 *
 * NOTHING THE CLAIM RESTS ON MOVES. Every falsifiable thing here is a RATIO - the two nodes of
 * 3s stand at 2 + sqrt(3) apart whatever a0 is - so choosing the scale to fit the box is free.
 */
const scaleFor = (n: number) => 2.2 / (n * n);
const STATES: State[] = ([[1,0,0],[2,0,0],[2,1,0],[2,1,1],[3,0,0],[3,1,0],
  [3,2,0],[3,2,1],[4,0,0],[4,1,0],[4,2,1],[4,3,2]] as [number,number,number][])
  .map(([n, l, m]) => ({ n, l, m, a0: scaleFor(n),
    len: Math.ceil(3.2 * n * n * scaleFor(n)) + 8 }));

type Run = { w: any; grid: Float64Array; radial: Float64Array; count: Float64Array };

const start = (st: State, source: boolean, seed: number): Run => {
  const g: any = (GEOMETRIES as any)[GEOM];
  const w: any = new World({ theory: G_XOR_XOR, geometry: g, N, seed,
    boundary: "absorb", slotUniformRng: true } as any);
  w.world.turnLog = [];
  /*
   * THE ANGULAR PART IS ASKED FOR TOO, and leaving it out was why every panel came back a
   * circle. `pulse` carries R_nl and nothing else - the radius. Y_lm lives in WHICH WAY the
   * source emits, which is `axis` and the sheet: `half()` puts one sign out of each half and
   * NOTHING along the equator, which is a nodal plane, and `turning` winds the axis round the
   * ring |m| steps a beat, which is the azimuthal winding. A source with none of these is
   * isotropic and can only ever lay down shells.
   */
  if (source) w.add({ at: [C, C, C], radius: 1, emits: 1, period: 1, dwellTicks: 1,
    pulse: schedule(st.n, st.l, st.a0, st.len),
    ...(st.l > 0 ? { axis: [0, 0, 1] as number[], emission: "sheet" as const,
      turning: st.m } : {}),
    absorbs: true } as any);
  return { w, grid: new Float64Array(PX * PX), radial: new Float64Array(R + 2),
    count: new Float64Array(R + 2) };
};

/** the charge each cell is holding, into a plane section and into a radial profile */
const step = (r: Run) => {
  const w = r.w;
  w.tick();
  for (const l of w.locals) {
    const at = w.embedding.at(l as any); if (!at) continue;
    const x = at[0] - C, y = at[1] - C, z = at[2] - C;
    let q = 0;
    for (const ry of (l as any).rays) if (ry.active) q += ry.charge ?? 0;
    const rr = Math.round(Math.hypot(x, y, z));
    if (rr >= 1 && rr <= R) { r.radial[rr] += q; r.count[rr]++; }
    /*
     * THE SLAB CONTAINS THE AXIS, and slicing across it was why every panel came back a
     * circle. The source's axis is z, so a slab at |z| <= 1 is the EQUATORIAL PLANE - looking
     * straight down the axis at the one section where an axially symmetric state has nothing
     * to show but rings, and where a p_z has its NODE. Every state is axially symmetric about
     * its own axis, so that view can only ever produce circles whatever is there.
     *
     * Cut along the axis instead: |y| <= 1, plotting x across and z up. The lobes of a p_z
     * lie along z and are in this plane; the nodal cone of a d state cuts it; and a state
     * with |m| > 0, whose density really is a ring about the axis, still shows as two
     * separated blobs here rather than as a disc - which is the difference the picture is
     * supposed to make visible.
     */
    if (Math.abs(y) > 1) continue;                       // the slab, taken ALONG the axis
    if (Math.abs(x) > R || Math.abs(z) > R) continue;
    r.grid[(z + R) * PX + (x + R)] += q;
  }
  w.world.turnLog.length = 0;
};

/** the same section with angle pooled - the ripple is under the per-cell noise */
/**
 * SMOOTHED ROUND THE AXIS AND NOT ROUND THE CENTRE.
 *
 * Pooling by RADIUS averages over the whole sphere, so it destroys exactly the angular
 * structure the picture is for - it can only ever return circles. Pooling by (distance ALONG
 * the axis, distance FROM the axis) averages over the one angle a state is symmetric in and
 * keeps the one it is not: the lobes survive and only the noise is smoothed.
 */
const axial = (grid: Float64Array): Float64Array => {
  const sum = new Map<string, number>(), n = new Map<string, number>();
  const key = (i: number, j: number) => `${Math.abs(i - R)},${j - R}`;
  for (let j = 0; j < PX; j++) for (let i = 0; i < PX; i++) {
    const k = key(i, j);
    sum.set(k, (sum.get(k) ?? 0) + grid[j * PX + i]);
    n.set(k, (n.get(k) ?? 0) + 1);
  }
  const out = new Float64Array(PX * PX);
  for (let j = 0; j < PX; j++) for (let i = 0; i < PX; i++) {
    const k = key(i, j);
    out[j * PX + i] = (sum.get(k) ?? 0) / Math.max(1, n.get(k) ?? 1);
  }
  return out;
};

const pooled = (grid: Float64Array) => {
  const s = new Map<number, number>(), n = new Map<number, number>();
  for (let j = 0; j < PX; j++) for (let i = 0; i < PX; i++) {
    const rr = Math.round(Math.hypot(i - R, j - R));
    s.set(rr, (s.get(rr) ?? 0) + grid[j * PX + i]);
    n.set(rr, (n.get(rr) ?? 0) + 1);
  }
  const out = new Float64Array(PX * PX);
  for (let j = 0; j < PX; j++) for (let i = 0; i < PX; i++) {
    const rr = Math.round(Math.hypot(i - R, j - R));
    out[j * PX + i] = (s.get(rr) ?? 0) / Math.max(1, n.get(rr) ?? 1);
  }
  return out;
};

const draw = (sur: Surface, grid: Float64Array, x0: number, y0: number, size: number) => {
  const { ctx } = sur;
  const mags = Array.from(grid, Math.abs).sort((a, b) => a - b);
  const hi = mags[Math.floor(mags.length * 0.98)] || mags[mags.length - 1] || 1;
  const cell = size / PX;
  for (let j = 0; j < PX; j++) for (let i = 0; i < PX; i++) {
    const v = Math.max(-1, Math.min(1, grid[j * PX + i] / hi));
    const t = Math.sign(v) * Math.pow(Math.abs(v), CONTRAST);
    const c = t >= 0 ? [20 + 235 * t, 20 + 130 * t, 20 + 60 * t]
                     : [20 + 60 * -t, 20 + 140 * -t, 20 + 235 * -t];
    ctx.fillStyle = `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;
    ctx.fillRect(x0 + i * cell, y0 + j * cell, Math.ceil(cell), Math.ceil(cell));
  }
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1; ctx.strokeRect(x0 + 0.5, y0 + 0.5, size - 1, size - 1);
};

/** the measured profile against the one asked for, so a node is checked and not eyeballed */
const curve = (sur: Surface, st: State, prof: number[], x0: number, y0: number,
               w: number, h: number) => {
  const { ctx } = sur;
  const hi = Math.max(...prof.map(Math.abs)) || 1;
  const X = (r: number) => x0 + (r / R) * w;
  const Y = (v: number) => y0 + h / 2 - (v / hi) * (h / 2) * 0.86;
  ctx.strokeStyle = "rgba(255,255,255,0.16)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x0, Y(0)); ctx.lineTo(x0 + w, Y(0)); ctx.stroke();
  /* where R_nl says the sign changes */
  for (const nd of nodesOf(st.n, st.l, st.a0, R)) {
    ctx.strokeStyle = "rgba(224,168,120,0.55)";
    ctx.setLineDash([3, 3]); ctx.beginPath();
    ctx.moveTo(X(nd), y0); ctx.lineTo(X(nd), y0 + h); ctx.stroke(); ctx.setLineDash([]);
  }
  /* what was asked for */
  ctx.strokeStyle = "rgba(127,184,212,0.75)"; ctx.lineWidth = 1.5;
  ctx.beginPath();
  const want: number[] = [];
  for (let r = 1; r <= R; r += 0.1) want.push(Rnl(st.n, st.l, st.a0, r));
  const wh = Math.max(...want.map(Math.abs)) || 1;
  want.forEach((v, i) => {
    const r = 1 + i * 0.1;
    const yy = y0 + h / 2 - (v / wh) * (h / 2) * 0.86;
    i ? ctx.lineTo(X(r), yy) : ctx.moveTo(X(r), yy);
  });
  ctx.stroke();
  /* what came back */
  ctx.strokeStyle = "#e0a878"; ctx.lineWidth = 2;
  ctx.beginPath();
  for (let r = 1; r <= R; r++) (r === 1 ? ctx.moveTo : ctx.lineTo)
    .call(ctx, X(r), Y(prof[r]));
  ctx.stroke();
};

const SIZE = 300, GAPX = 48, GAPY = 128, TOP = 128, LEFT = 64, CURVE_H = 84;
const PAIR = 2 * SIZE + 12;
const COLS = 4;
const WIDTH = LEFT * 2 + COLS * PAIR + (COLS - 1) * GAPX;
const ROWS = Math.ceil(STATES.length / COLS);
const HEIGHT = TOP + ROWS * (SIZE + CURVE_H + GAPY) - GAPY + 70;

const shells = (only?: State): (() => Painter) => () => {
  const list = only ? [only] : STATES;
  let sim: Run[][] = [], ctl: Run[][] = [];
  let done = 0;
  const per = SEEDS * (WARM + TICKS) * 2;
  const total = list.length * per;
  return {
    start: () => {
      sim = list.map(st => Array.from({ length: SEEDS },
        (_, k) => start(st, true, k + 1)));
      ctl = list.map(st => Array.from({ length: SEEDS },
        (_, k) => start(st, false, k + 1)));
      done = 0;
    },
    warm: (budgetMs: number) => {
      const t0 = performance.now();
      while (done < total && performance.now() - t0 < budgetMs) {
        const si = Math.min(list.length - 1, Math.floor(done / per));
        const into = done % per, half = per / 2;
        const arr = into < half ? sim[si] : ctl[si];
        const rest = into % half;
        const r = arr[Math.floor(rest / (WARM + TICKS))];
        if (rest % (WARM + TICKS) < WARM) { r.w.tick(); r.w.world.turnLog.length = 0; }
        else step(r);
        done++;
      }
      return done / total;
    },
    stop: () => { sim = []; ctl = []; },
    frame: (sur: Surface) => {
      const { ctx, width, height } = sur;
      ctx.fillStyle = BACK; ctx.fillRect(0, 0, width, height);
      ctx.textAlign = "left"; ctx.fillStyle = "#e8eaf0";
      ctx.font = "600 21px ui-sans-serif, system-ui, sans-serif";
      ctx.fillText(only ? `n = ${only.n}, l = ${only.l}, m = ${only.m} — asked for as a pulse`
        : "the states as pulse sequences, and what the vacuum returned", LEFT, 44);
      ctx.fillStyle = FAINT; ctx.font = "12.5px ui-sans-serif, system-ui, sans-serif";
      ctx.fillText(`G^XOR+XOR · ${GEOM} · real vacuum, CREATION on, nothing imposed · ` +
        `radius is retarded time, so the source is handed R_nl(t) and the vacuum is asked ` +
        `for R_nl(r) · charge, source minus the same vacuum with none · every (n, l) through n = 4`, LEFT, 66);

      list.forEach((st, i) => {
        const col = only ? 0 : i % COLS, row = only ? 0 : Math.floor(i / COLS);
        const x = LEFT + col * (PAIR + GAPX);
        const y = TOP + row * (SIZE + CURVE_H + GAPY);
        const diff = new Float64Array(PX * PX);
        for (let k = 0; k < PX * PX; k++) {
          let a = 0, b = 0;
          for (const z of sim[i]) a += z.grid[k];
          for (const z of ctl[i]) b += z.grid[k];
          diff[k] = a - b;
        }
        draw(sur, diff, x, y, SIZE);
        /* pooled about the AXIS, not about the centre - averaging over the angle
         * ROUND the axis keeps the lobes and only smooths the noise; averaging over the
         * full solid angle, which is what pooling by radius does, destroys them */
        draw(sur, axial(diff), x + SIZE + 12, y, SIZE);
        const prof: number[] = [0];
        for (let r = 1; r <= R; r++) {
          let a = 0, b = 0, na = 0, nb = 0;
          for (const z of sim[i]) { a += z.radial[r]; na += z.count[r]; }
          for (const z of ctl[i]) { b += z.radial[r]; nb += z.count[r]; }
          prof.push((na ? a / na : 0) - (nb ? b / nb : 0));
        }
        curve(sur, st, prof, x, y + SIZE + 16, PAIR, CURVE_H);
        ctx.textAlign = "center"; ctx.fillStyle = "#e8eaf0";
        ctx.font = "600 15px ui-sans-serif, system-ui, sans-serif";
        ctx.fillText(`n = ${st.n}   l = ${st.l}   m = ${st.m}`, x + PAIR / 2, y - 34);
        const nd = nodesOf(st.n, st.l, st.a0, R);
        ctx.fillStyle = DIM; ctx.font = "11.5px ui-sans-serif, system-ui, sans-serif";
        ctx.fillText(nd.length
          ? `nodes wanted at r = ${nd.map(v => v.toFixed(2)).join(", ")}` +
            (nd.length > 1 ? `   ratio ${(nd[1] / nd[0]).toFixed(3)}` : "")
          : "no radial node", x + PAIR / 2, y - 16);
      });

      ctx.textAlign = "center"; ctx.fillStyle = FAINT;
      ctx.font = "12px ui-sans-serif, system-ui, sans-serif";
      ctx.fillText("each pair: the section AS MEASURED on the left, smoothed round the axis on the right — " +
        "red is more charge than the bare vacuum, blue is less.   below: the measured radial " +
        "profile (amber) against the R_nl that was asked for (blue), nodes dashed",
        width / 2, height - 44);
      ctx.fillText(done < total ? `accumulating — ${(100 * done / total) | 0}%`
        : `${SEEDS} seeds × ${TICKS} ticks per state · a0 = 2.2/n² cells · R = ${R} — ` +
          `scaled to the ~3 cells the source actually reaches`,
        width / 2, height - 24);
    },
  };
};

export default [
  ...STATES.map(st => visual({
    id: `atom.shell.n${st.n}l${st.l}m${st.m}`,
    width: Math.max(LEFT * 2 + PAIR, 780), height: TOP + SIZE + CURVE_H + 84,
    frames: 1,
    what: `the n = ${st.n}, l = ${st.l}, m = ${st.m} state asked for as a pulse sequence and measured ` +
      `back out of G^XOR+XOR's own vacuum — the section, and the radial profile against ` +
      `the R_nl that was requested`,
    paint: shells(st),
  })),
  visual({
    id: "atom.shells",
    width: WIDTH, height: HEIGHT, frames: 1,
    what: "the six lowest states, each asked for by handing the source its own radial " +
      "function as an emission history and each measured back out of the vacuum — with " +
      "the node positions the state demands drawn against the ones that came back",
    paint: shells(),
  }),
];
