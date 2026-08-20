/**
 * THE DEFICIT, WITH THE STATIC TAKEN OUT — and it leaves the body, which is the one
 * thing the stochastic vacuum's shortfall never does.
 *
 * THIS FILE DRAWS; IT DOES NOT MODEL. What is on the canvas is a run of
 * `G^DETERMINISTIC` — `G` with (G/2)'s die and (G/1) taken out and a phase put in
 * their place — on the same `World`, the same `square-8` lattice and the same
 * `Flat` backend every ported claim is measured on. The rule itself, and the argument
 * for why the die is what had to go, live in `theories/G^DETERMINISTIC.ts`. An earlier
 * version of this panel carried its own hand-rolled 121² loop, which meant the picture
 * and the theory could drift apart without either one saying so; nothing here now
 * knows anything about how a ray moves.
 *
 * Every other gravity panel in this arc runs the stochastic vacuum, where creation
 * fires on a coin and the shortfall has to be dug out of shot noise by averaging over
 * hundreds of ticks. That is the honest picture of the model and it is nearly
 * unreadable: at one tick the force is invisible, and at two thousand the arrow is
 * still only three sigma. This is the same mechanism with the randomness removed and
 * NOTHING ELSE removed.
 *
 * WHAT IT SHOWS, measured on the model this panel now draws — `G^DETERMINISTIC`,
 * square-8, N = 121, GAP = 24, shells taken about the LEFT body, and the last column
 * of each row is the running push on each of the two:
 *
 *     t        r4      r8     r14     r20     r28      push
 *       8   −19.1%   −1.3%   −0.4%   −0.8%   −0.5%     5 /  5
 *      20   −36.3%   −2.1%   −0.7%   −2.7%   −1.8%     5 /  5
 *      60   −53.4%  −19.4%   −1.4%   −4.7%   −3.1%     2 /  1
 *     200   −60.1%  −36.7%  −16.7%  −11.5%   −7.3%    15 / −6
 *
 * THESE ARE NOT THE NUMBERS THIS PANEL USED TO QUOTE, and the difference is not the
 * port. The table that stood here read `t = 20: r4 −1.6%, r8 −11.5%` — a hollow shell
 * that had already left the body and refilled behind itself. Re-running the panel's
 * OWN previous loop reproduces what is above and not what was written above it, so
 * the table had come loose from the code it sat on some rewrite ago. That is the
 * whole argument for this file not owning a model.
 *
 * SO WHAT IT ACTUALLY DOES: the shortfall deepens AT the body and works outward,
 * reaching r8 by t ≈ 60 and r28 by t ≈ 200. That is spreading, and against the
 * stochastic vacuum — whose shortfall never leaves the body at all — it is the whole
 * difference between the two panels. It is NOT one cell a tick: the old text claimed
 * a front at c̄ and the measurement is about a sixth of that. Whether the ray front is
 * at c̄ and only the DEFICIT is slow, or whether the deterministic spread genuinely
 * transports more slowly than a ray, is not something this arrangement separates, and
 * it is left open here rather than asserted.
 *
 * AND THE TWO OUTER COLUMNS ARE CONTAMINATED. The r20 and r28 shells about the left
 * body pass through the right body's own shadow — the bodies are 24 apart — which is
 * why r14 reads shallower than r20 at early t. They are kept because the panel is of
 * two bodies, and flagged because a shell is not a clean radial average here.
 *
 * THE PUSHES ARE NOT EQUAL AND OPPOSITE, which the old text also claimed. They are
 * the same sign for most of the run and only separate late (15 and −6 at t = 200,
 * which is the attractive sense: each body pushed toward the other). Equal and
 * opposite is what the SYMMETRY of the arrangement would give a symmetric rule; the
 * phase is a shared global state that both bodies read from the same side, so it is
 * not one, and the panel should not be read as showing a balanced pair.
 *
 * AND IT IS DRAWN ON A LOG SCALE, because the falloff is a power law. A 1/r² field
 * inked linearly is a white dot and a black field: the body saturates and everything
 * past a few cells is under the first quantisation step, so the shell structure the
 * panel is about cannot be seen. On a log scale each halving is the same number of
 * shades and the profile above reads as the near-straight line it is.
 */

import { World } from "../lib/Compat.ts";
import { GEOMETRIES } from "../lib/Local.ts";
import { G_DETERMINISTIC } from "../theories/G^DETERMINISTIC.ts";
import { Painter, Surface, visual } from "./CANVAS.ts";

const BACK = "#08090d", FAINT = "#5a5f6e", INK = "#c8cbd4";
const SEEN = "#eef0f5", RAIN = "#4aa8eb", MISS = "#eb964a", GOOD = "#8bd48b";

const G = GEOMETRIES["square-8"];
const N = 121, C = (N - 1) / 2, DEG = G.DEG, GAP = 24, R = 2, VIEW = 46;
/** how many ticks the run is, and the rate they are played back at */
const TICKS = 260, RATE = 26;

const W = 2 * VIEW + 1;
const win = (x: number, y: number) => (y + VIEW) * W + (x + VIEW);

/**
 * ONE TICK OF THE RUN, AS MUCH OF IT AS IS DRAWN: how many rays each point in the
 * window is holding, and what each body has absorbed so far.
 *
 * A whole `World` per tick would be the honest thing to keep and it is 260 copies of
 * a graph with a quarter of a million objects in it. This is the reading, taken off
 * the model at the tick it was true — which is all a picture ever is.
 */
type Shot = { q: Uint8Array; F: number[][] };

/**
 * THE RUN, WHICH HAPPENS BEFORE THE FILM DOES AND NOT INSIDE IT.
 *
 * The renderer paces frames by the wall clock and the recorder stamps them that way,
 * so a panel that ticked the model inside `frame()` would come back as a film minutes
 * long with a few seconds of animation smeared through it. The ticks therefore happen
 * up front and the frames play back what they recorded.
 *
 * BUT NOT ALL AT ONCE. Two hundred and sixty ticks of a 121² world is minutes, and
 * spending it inside a single `start()` is a call the driver cannot see into — on a
 * page a frozen tab, headless indistinguishable from a hang. So this hands back a
 * world that ticks on request, and the painter's `warm` spends whatever budget it is
 * given and says how far along it is.
 */
const born = () => {
  const w = new World({
    theory: G_DETERMINISTIC, geometry: G, N, boundary: "wrap", seed: 0,
  });

  /* the two bodies: pure absorbers, so the only thing they do to the vacuum is eat it */
  const bodies = [-GAP / 2, GAP / 2].map(dx =>
    w.add({ at: [C + dx, C], radius: R, absorbs: true, emits: 0, duty: 0 }));

  /*
   * THE INITIAL CONDITION IS THE WHOLE VACUUM: one ray out of every exit of every
   * point that is not a body. With (G/2) gone nothing is ever added, so every ray on
   * the lattice from here on traces back to this line — which is exactly why every
   * ray carries the shadow.
   */
  const where = new Map<any, number>();
  w.backend.forEachLocal(l => {
    if (!(l as any).source) for (let d = 0; d < DEG; d++) w.backend.put(l, d);
    const [x, y] = w.backend.position(l);
    const [dx, dy] = [x - C, y - C];
    if (Math.abs(dx) <= VIEW && Math.abs(dy) <= VIEW) where.set(l, win(dx, dy));
  });

  const shot = (): Shot => {
    const q = new Uint8Array(W * W);
    /* a local is walked as an index; the point itself is what carries the rays */
    w.backend.forEachLocal((n: number) => {
      const l: any = w.locals[n];
      const i = where.get(l);
      if (i === undefined || l.source) return;
      let k = 0;
      for (const r of l.rays) if (r.active) k++;
      q[i] = k;
    });
    return { q, F: bodies.map(b => [b.absorbed[0] ?? 0, b.absorbed[1] ?? 0]) };
  };

  return { tick: () => w.tick(), shot };
};

/** how much of a frame is given to ticking while the run is still being laid down */
const BUDGET_MS = 12;

const painter = (startAt: number): (() => Painter) => () => {
  let world: ReturnType<typeof born> | undefined;
  let film: Shot[] = [];
  let t = startAt, acc = 0;

  /*
   * ONE SLICE OF THE RUN. Returns how much of it is laid down, which is what both
   * `warm` and the first frames report — the film is exactly TICKS + 1 shots long
   * when it is finished, the extra one being the initial condition.
   */
  const slice = (ms: number) => {
    const t0 = performance.now();
    while (world && film.length <= TICKS && performance.now() - t0 < ms) {
      world.tick();
      film.push(world.shot());
    }
    return Math.min(1, (film.length - 1) / TICKS);
  };

  return {
    start: () => { world = born(); film = [world.shot()]; t = startAt; acc = 0; },
    warm: (budgetMs: number) => slice(budgetMs),
    frame: (s: Surface, dt: number) => {
      /* a driver that does not warm still gets there, a slice at a time */
      if (film.length <= TICKS) slice(BUDGET_MS);
      acc += dt;
      // one tick is one cell of travel, so the front is visible at this rate
      while (acc > 1 / RATE) { acc -= 1 / RATE; t = t + 1 >= film.length ? 0 : t + 1; }
      const w = film[Math.min(t, film.length - 1)];

      const { ctx, width, height: H } = s;
      ctx.clearRect(0, 0, width, H);
      ctx.fillStyle = BACK; ctx.fillRect(0, 0, width, H);

      const TOP = 20, BOT = 18, GAP2 = 10;
      const cw = (width - GAP2) / 2;
      const side = Math.min(cw, H - TOP - BOT);
      const pz = side / (2 * VIEW + 1);
      const top = TOP + Math.max(0, (H - TOP - BOT - side) / 2);

      const body = (x: number, y: number) =>
        [-GAP / 2, GAP / 2].some(dx => (x - dx) ** 2 + y ** 2 <= R * R);

      // the level far from either body — the zero the deficit is drawn against
      let bg = 0, bn = 0;
      for (let y = -VIEW; y <= VIEW; y += 2) for (let x = -VIEW; x <= VIEW; x += 2)
        if (Math.hypot(x + GAP / 2, y) > 40 && Math.hypot(x - GAP / 2, y) > 40) {
          bg += w.q[win(x, y)]; bn++;
        }
      bg = bn ? bg / bn : DEG;

      /*
       * LOGARITHMIC. `d` is the shortfall as a fraction of the far field, and
       * what is inked is log(1 + d/floor) / log(1 + 1/floor) — so the deepest
       * shortfall is full ink, a tenth of it is still better than half ink, and
       * a thousandth is still visible. Linear, everything past r = 8 is under
       * the first shade and the panel is a dot.
       */
      const FLOOR = 0.002;
      const lg = (d: number) =>
        Math.log(1 + Math.max(0, d) / FLOOR) / Math.log(1 + 1 / FLOOR);

      for (const col of [0, 1]) {
        const cx = (col === 0 ? cw / 2 : cw + GAP2 + cw / 2), cy = top + side / 2;
        for (let y = -VIEW; y <= VIEW; y++) for (let x = -VIEW; x <= VIEW; x++) {
          if (body(x, y)) continue;
          const q = w.q[win(x, y)];
          const v = col === 0
            ? Math.min(1, q / Math.max(bg, 1e-9))          // what is there
            : lg((bg - q) / Math.max(bg, 1e-9));           // what is MISSING
          if (v <= 0.004) continue;
          ctx.globalAlpha = Math.min(1, v);
          ctx.fillStyle = col === 0 ? RAIN : MISS;
          ctx.fillRect(cx + x * pz - pz / 2, cy + y * pz - pz / 2, pz + 0.6, pz + 0.6);
        }
        ctx.globalAlpha = 1;

        [-GAP / 2, GAP / 2].forEach((dx, k) => {
          ctx.strokeStyle = SEEN; ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(cx + dx * pz, cy, (R + 0.8) * pz, 0, 2 * Math.PI);
          ctx.stroke();

          if (col !== 1 || !t) return;
          /*
           * SCALED BY THE LARGER OF THE TWO, and clamped. Scaling by their
           * DIFFERENCE — which is what the archive did — divides by nearly zero
           * exactly when the two read alike, which they do for most of this run:
           * measured, both are 5 at t = 8 and t = 20, so the difference is 0 and
           * the arrows shot off the canvas.
           *
           * THE ARROWS ARE A DIRECTION AND A RELATIVE SIZE, NOT A FORCE. The two
           * pushes are neither equal nor opposite here (15 and −6 at t = 200), and
           * scaling by the larger makes the smaller one look like a fraction of it
           * rather than a quantity anyone can read off the picture. The numbers
           * under the panel are the quantity; these say which way.
           */
          const big = Math.max(1, ...w.F.map(f => Math.hypot(f[0], f[1])));
          const sc = Math.min(26, 26 / big * Math.hypot(w.F[k][0], w.F[k][1])) /
            Math.max(1e-9, Math.hypot(w.F[k][0], w.F[k][1]));
          const fx = w.F[k][0] * sc, fy = w.F[k][1] * sc;
          if (Math.hypot(fx, fy) < 2) return;
          const x0 = cx + dx * pz, y0 = cy;
          ctx.strokeStyle = GOOD; ctx.lineWidth = 1.8;
          ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + fx, y0 + fy); ctx.stroke();
          const a = Math.atan2(fy, fx);
          ctx.beginPath();
          ctx.moveTo(x0 + fx, y0 + fy);
          ctx.lineTo(x0 + fx - 6 * Math.cos(a - 0.4), y0 + fy - 6 * Math.sin(a - 0.4));
          ctx.moveTo(x0 + fx, y0 + fy);
          ctx.lineTo(x0 + fx - 6 * Math.cos(a + 0.4), y0 + fy - 6 * Math.sin(a + 0.4));
          ctx.stroke();
        });
      }

      ctx.font = "11px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = INK;
      ctx.fillText("the charges themselves", cw / 2, 13);
      ctx.fillText("how many are MISSING — log scale", cw + GAP2 + cw / 2, 13);

      ctx.font = "10px ui-monospace, monospace";
      ctx.fillStyle = FAINT;
      // the total, not the per-tick rate: it is a running sum and the per-tick
      // figure rounds to three zeros while the arrow is plainly there
      const p = w.F.map(f => String(f[0]));
      ctx.fillText(`t = ${t}  ·  push on each body  ${p[0]}  and  ${p[1]}` +
        `   — whole rays, no averaging`, width / 2, H - 5);
      ctx.textAlign = "left";
    },
    stop: () => { film = []; world = undefined; },
  }
};

export default [
  visual({
    id: "rain.deficit", width: 900, height: 340, frames: 236,
    what: "the same mechanism with the static taken out — G^DETERMINISTIC, the " +
      "deterministic limit of (G/1) and (G/2), where the deficit is exact, needs no " +
      "averaging, and works its way out of the body instead of dying inside it. " +
      "Left: the charges themselves. Right: how many are MISSING, log scale",
    paint: painter(0),
  }),
];
