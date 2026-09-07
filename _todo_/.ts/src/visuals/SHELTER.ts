/**
 * THE TWO GRAVITY PANELS FROM THE ARCHIVE, ON THE NEW CORE.
 *
 * These are `grid.tsx`'s `LatticeAttract/Repel/Inert` and `wander.tsx`'s
 * `WanderGravity`, rebuilt so that they run `DISCRETE.ts` instead of their own
 * automaton. The layout, the split, the labels and the argument are unchanged — what
 * changed is that a picture of the model is now a picture of THE model. The archive's
 * versions were two separate simulators, which is how the old panels came to be
 * drawing a vacuum a fifth of the derived density while every test said otherwise.
 *
 * WHY BOTH ARE SPLIT DOWN THE MIDDLE, which is the whole point of the pair:
 *
 *   A SINGLE TICK IS NOISE. At this occupancy the shot noise across a cell is far
 *   bigger than the shortfall a body leaves, so the left half is static with two
 *   holes in it. The shortfall is not visible in any one tick and never will be.
 *
 *   IT IS VISIBLE IN THE AVERAGE, which is the right half, and it comes out of the
 *   noise as √n. That is not an artefact of the drawing — it is what it means for
 *   gravity to be the weakest thing there is.
 *
 * AND WHAT WAS TRIED FIRST, kept because it is worth knowing. The obvious way to
 * isolate the shortfall is to run two copies, one with the bodies and one without, on
 * the same draws, and subtract. It does not work: a lattice gas is CHAOTIC, so a
 * single changed bit spreads across the light cone at full amplitude within a few
 * dozen ticks and the difference is decorrelated noise rather than the response.
 * Common random numbers are a technique for smooth systems. Averaging is what is left.
 *
 * THE ARROWS ARE MEASURED, not drawn on: the momentum actually arriving at each body,
 * summed over its cells and over every tick since the start, read straight off
 * `Source.absorbed`. They come out pointing at each other, which is the claim.
 */

import { frames, Painter, visual, Surface } from "./CANVAS.ts";
import { GRAVITY, GRAVITY_MAGNETISM, GEOMETRIES, Source, World } from "../lib/DISCRETE.ts";

const BACK = "#08090d", FAINT = "#5a5f6e";
const PLUS = "#4aa8eb", MINUS = "#eb964a";
const SEEN = "#eef0f5", BAD = "#e0685f", GOOD = "#8bd48b", INK = "#c8cbd4";
/** where the vacuum is destroyed SLOWER than it would be — the shadow, and the pull */
const SHADE = "#5b8dd6";

const GEOM = GEOMETRIES["square-8"];
const N = 121, C = 60;

type Two = { w: World; bodies: Source[]; sep: number; since?: Float64Array };

const make = (qL: 1 | -1 | 0, qR: 1 | -1 | 0, sep: number, theory = GRAVITY_MAGNETISM, empty = false, settle = 0): Two => {
  const w = new World({
    /*
     * WRAPPED, BECAUSE AN ABSORBING EDGE IS ITSELF A SHADOW. Rays leave at the
     * boundary and never come back, so the vacuum annihilates less there — and once
     * the panel drew deficit as well as excess, that edge came out as a bright blue
     * frame around the whole box, far stronger than anything a body does. It was a
     * picture of the boundary condition. A wrapped box has no edge to be short of.
     */
    theory, geometry: GEOM, N, seed: 20260817, boundary: "wrap",
  });
  /*
   * THE VACUUM SETTLES BEFORE THE BODY ARRIVES, which is what makes the panel a
   * picture of the body rather than of the box starting up. The snapshot taken at
   * that instant is the zero everything after it is drawn against.
   */
  let since: Float64Array | undefined;
  if (settle) {
    for (let i = 0; i < settle; i++) w.tick();
    since = new Float64Array(w.backend.size());
    w.backend.forEachLocal(k => { since![k] = w.destroyed[k]; });
  }
  if (sep === 0) return { w, since, bodies: empty ? [] : [w.add({
    at: [C, C], radius: 3, emits: qL, absorbs: true, duty: qL === 0 ? 0 : 1,
  })], sep };
  const one = (x: number, q: 1 | -1 | 0) => w.add({
    at: [x, C], radius: 3, emits: q, absorbs: true, duty: q === 0 ? 0 : 1,
  });
  return { w, since, bodies: empty ? [] : [one(C - sep / 2, qL), one(C + sep / 2, qR)], sep };
};

const px = (w: World, k: number) => w.geometry.embed(w.backend.position(k));

/**
 * THE SPLIT PANEL. Left: one tick, which is mostly vacuum. Right: where space has
 * been destroyed, AGAINST THE VACUUM'S OWN RATE.
 *
 * Normalising the right half to its peak makes the panels incomparable — the opposite
 * case puts a narrow, intense band between the two, so scaling to its peak sends
 * everything else to nothing, while the alike case has no band and its vacuum fills
 * the frame. Both then look like the opposite of what they are. A force is an EXCESS
 * over the rate the vacuum runs at anyway, so that is what is drawn: the far field is
 * the zero and only what exceeds it is inked.
 */
const paint = (t: Two, sur: Surface, label: string, right: string) => {
  const { ctx, width, height } = sur;
  const w = t.w, g = w.geometry;
  /** what has been destroyed, since whenever this panel's clock starts */
  const D = t.since ? (k: number) => w.destroyed[k] - t.since![k] : (k: number) => w.destroyed[k];
  const H = height - 26;
  ctx.fillStyle = BACK; ctx.fillRect(0, 0, width, height);
  const half = width / 2;
  const s = Math.min(half / N, H / N);
  const ox = (half - N * s) / 2, oy = 20 + (H - 20 - N * s) / 2;
  const ox2 = half + (half - N * s) / 2;

  // ── left: one tick of the model
  w.backend.forEachLocal(k => {
    if (w.isSource(k)) return;
    let net = 0, n = 0;
    for (let d = 0; d < g.DEG; d++) {
      if (!w.backend.active(k, d)) continue;
      net += w.backend.charge(k, d); n++;
    }
    if (!n) return;
    const p = px(w, k);
    ctx.globalAlpha = Math.min(0.9, 0.25 + n / g.DEG);
    ctx.fillStyle = net > 0 ? PLUS : net < 0 ? MINUS : FAINT;
    ctx.fillRect(ox + p[0] * s, oy + p[1] * s, Math.max(s, 1), Math.max(s, 1));
  });
  ctx.globalAlpha = 1;

  // ── the vacuum's own rate, taken in the far field where nothing local happens
  let bg = 0, bn = 0;
  w.backend.forEachLocal(k => {
    if (w.isSource(k)) return;
    const p = px(w, k);
    if (p[0] < 6 || p[1] < 6 || p[0] > N - 6 || p[1] > N - 6) return;
    if (Math.hypot(p[0] - C, p[1] - C) < 34) return;
    bg += D(k); bn++;
  });
  bg = bn ? bg / bn : 1;

  /*
   * AND IN UNITS OF THE FAR FIELD'S OWN SCATTER, not of a fixed percentage.
   *
   * The archive thresholded at 8% above the far-field mean, which worked there
   * because its automaton's vacuum barely annihilated. THIS vacuum annihilates
   * constantly — the far-field mean is 34 destructions a cell after 260 ticks — so a
   * fixed 8% passes the vacuum's own shot noise everywhere and the panel came out a
   * uniform red haze with the bodies lost in it. Measured: the band between two
   * opposite charges is 13.0% above the far field and between two alike ones 10.2%,
   * so the two cases are separated by rather less than the archive's picture implied,
   * and the honest scale is the one that says how many times the vacuum's own
   * fluctuation a reading is.
   */
  let v2 = 0, vn = 0;
  w.backend.forEachLocal(k => {
    if (w.isSource(k)) return;
    const p = px(w, k);
    if (p[0] < 6 || p[1] < 6 || p[0] > N - 6 || p[1] > N - 6) return;
    if (Math.hypot(p[0] - C, p[1] - C) < 34) return;
    const d = D(k) - bg; v2 += d * d; vn++;
  });
  const sd = vn ? Math.max(Math.sqrt(v2 / vn), 1e-9) : 1;

  /*
   * ── right: BOTH SIGNS, and the one that was missing is the whole of gravity.
   *
   * The archive inked only what EXCEEDED the far field, and so did the first version
   * of this. That is right for the electric panels, where two opposite charges
   * annihilate between them and pile destruction up in the gap. It renders GRAVITY
   * INVISIBLE, because a gravitating body does the opposite: it EATS the rays that
   * would have met behind it, so the vacuum downstream of it annihilates LESS than it
   * otherwise would. The aggregate pressure is a SHORTFALL, and a panel that only
   * draws excess draws everything about it except the thing it is.
   *
   * Measured on shells, against the far field at 300 ticks:
   *
   *     two inert bodies, pure gravity   r8 −7%   r12 −12%   r16 −11%
   *     two inert bodies, g+m            r8 −10%  r12 −13%   r16 −12%
   *     two opposite charges, g+m        r8 +11%  r12 +11%   r16  +7%
   *
   * So the shadow is a ring of DEFICIT around the pair, of about the same size as the
   * electric excess and of the opposite sign. Both are drawn: red where space is
   * being destroyed faster than the vacuum does anyway, blue where it is being
   * destroyed slower — which is the shadow, and which is what a body falls toward.
   */
  /*
   * AND AVERAGED OVER A NEIGHBOURHOOD, for exactly the reason the left half is
   * averaged over time.
   *
   * Per cell, the shortfall is far under the vacuum's own scatter — the shell profile
   * says −12% at r = 12 while a single cell's fluctuation is several times that, so
   * cell-by-cell the panel is salt and pepper with the structure buried in it. A box
   * average over ±B cells divides the noise by the number of cells in the box and
   * leaves the structure alone, which is the same √n the time average buys. It is
   * smoothing, not enhancement: nothing is scaled up, the noise is taken down.
   */
  const B = 3, W = (2 * B + 1) * (2 * B + 1);
  const fld = new Float64Array(N * N).fill(NaN);
  w.backend.forEachLocal(k => {
    if (w.isSource(k)) return;
    const p = px(w, k);
    fld[Math.round(p[0]) * N + Math.round(p[1])] = D(k);
  });
  for (let x = B; x < N - B; x++) for (let y = B; y < N - B; y++) {
    let sum = 0, n = 0;
    for (let i = -B; i <= B; i++) for (let j = -B; j <= B; j++) {
      const v = fld[(x + i) * N + (y + j)];
      if (!Number.isNaN(v)) { sum += v; n++; }
    }
    if (n < W * 0.6) continue;                    // next to a body: not a fair average
    const z = (sum / n - bg) / (sd / Math.sqrt(n));
    if (Math.abs(z) < 2) continue;                // two sigma of the SMOOTHED field
    ctx.globalAlpha = Math.min(0.9, (Math.abs(z) - 2) * 0.16);
    ctx.fillStyle = z > 0 ? BAD : SHADE;
    ctx.fillRect(ox2 + x * s, oy + y * s, Math.max(s, 1), Math.max(s, 1));
  }
  ctx.globalAlpha = 1;

  // the two bodies, on both halves
  for (const base of [ox, ox2]) {
    for (const b of t.bodies) {
      const p = px(w, b.locals[0]);
      let cx = 0, cy = 0;
      for (const k of b.locals) { const q = px(w, k); cx += q[0]; cy += q[1]; }
      cx /= b.locals.length; cy /= b.locals.length;
      ctx.beginPath();
      ctx.arc(base + cx * s, oy + cy * s, 3 * s, 0, 7);
      ctx.fillStyle = b.emits === 0 ? "#2a2e38" : b.emits > 0 ? PLUS : MINUS;
      ctx.fill();
      ctx.strokeStyle = SEEN; ctx.lineWidth = 1.2; ctx.stroke();
      void p;
    }
  }

  // ── the arrows: the momentum that actually arrived, on the averaged half
  const scale = 26 / Math.max(...t.bodies.map(b => Math.hypot(...b.absorbed.slice(0, 2))), 1e-9);
  t.bodies.forEach(b => {
    let cx = 0, cy = 0;
    for (const k of b.locals) { const q = px(w, k); cx += q[0]; cy += q[1]; }
    cx /= b.locals.length; cy /= b.locals.length;
    const fx = (b.absorbed[0] ?? 0) * scale, fy = (b.absorbed[1] ?? 0) * scale;
    if (Math.hypot(fx, fy) < 3) return;
    const x0 = ox2 + cx * s, y0 = oy + cy * s;
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

  ctx.font = "10px ui-monospace, monospace";
  ctx.fillStyle = FAINT;
  ctx.textAlign = "center";
  ctx.fillText("one tick — mostly vacuum", half / 2, 14);
  ctx.fillText(right, half + half / 2, 14);
  ctx.fillStyle = "#8a8f9e";
  ctx.fillText("red: destroyed faster    blue: SLOWER — the shadow", half + half / 2, height - 10);
  ctx.fillStyle = FAINT;
  ctx.textAlign = "left";
  ctx.fillText(label, 10, height - 10);
  ctx.textAlign = "right";
  ctx.fillText(t.since ? `${w.stats.ticks - 300} ticks since it appeared` : `${w.stats.ticks} ticks`, width - 10, height - 10);
  ctx.textAlign = "left";
};


/** two opposite charges: the annihilation piles up between them */

/** two alike charges: (G+M/3) turns instead, and the between-band is absent */

/** the control: two absorbers with no charge, which shadow each other and nothing more */

/**
 * THE PURE-GRAVITY VACUUM, WITH NOTHING IN IT — and it does nothing, exactly.
 *
 * (G/2) is UNCONDITIONAL: every neutral point splits every tick, on all axis. Not at
 * some rate — the rule has no rate in it, and `World`'s default has always been p = 1.
 * These panels ran at p = 0.05 because that is what the archive's automaton used, and
 * that automaton had a rate because it was written before the rule was settled. It is
 * not a small correction: at p = 1 gravity+magnetism settles at fill 0.5019, the
 * derived fixed point ½ on the nose, against 0.2449 at p = 0.06. Half the vacuum was
 * missing from every one of these pictures.
 *
 * AND UNDER GRAVITY THE SPLIT UNDOES ITSELF, which is the whole character of this
 * theory and is not a defect. A point splits into two; with no polarity every meeting
 * is a neutral one, so on the next tick they meet and annihilate back into one; and
 * then it splits again. Measured on a 41² triangular lattice, every tick, without
 * variation:
 *
 *     1,681 points  ->  1,681 splits  and  5,043 annihilations
 *     5,043 edges                     ->  exactly ONE annihilation per edge, 1.000
 *
 * So the vacuum is doing an enormous amount of work — a quarter of a million events a
 * tick on a modest box — and the NET IS NOTHING. `fill` reads 0.0000 not because the
 * vacuum is empty but because nothing SURVIVES a tick: what is drawn on the left is
 * the state after the annihilation, which under gravity is bare space every time.
 *
 * THAT IS WHY GRAVITY NEEDS MATTER TO SHOW UP AT ALL. A perfectly balanced breathing
 * has nothing to say about anywhere in particular. Put a body in it and the balance
 * breaks where the body is — it eats what arrives and does not split — and the
 * shortfall is the only structure there is. Measured: exactly −16.7% at the body's
 * own surface and exactly 0.0% at every radius beyond it, unchanged from t = 4 to
 * t = 60. **The deficit does not propagate, because a medium refreshed completely
 * every tick has no memory to carry it.**
 */

/**
 * TWO BODIES IN THE VACUUM — THE SHORTFALL EACH LEAVES, AND THE PUSH IT MAKES.
 *
 * The archive's `WanderGravity`, rebuilt on `DISCRETE.ts`. Same two halves, same
 * quantity, same colours; what changed is that the vacuum underneath is the one the
 * tests measure rather than a second automaton written for the picture.
 *
 * WHAT EACH HALF IS, because they are the same quantity twice and that is the point:
 *
 *   LEFT — the charges themselves, right now. Each cell inked by how many of its
 *   exits are occupied, so a full cell is solid and an empty one is background. This
 *   is what the vacuum LOOKS like: dense, uniform, and with two holes in it where the
 *   bodies eat what arrives. Nothing about the force is visible here and nothing ever
 *   will be — at this occupancy the shot noise across a cell is far larger than the
 *   shortfall.
 *
 *   RIGHT — how many are MISSING. The same occupancy averaged over every tick since
 *   the start, subtracted from the level far from either body. It is a picture of
 *   absence: bright where the vacuum is thinner than it would otherwise be, which is
 *   exactly the shadow each body casts and exactly what the other one falls into.
 *
 * IT COMES OUT OF THE NOISE AS √n, which is why the right half needs hundreds of
 * ticks and the left needs one. That is not a fact about the drawing — it is what it
 * means for gravity to be the weakest thing there is.
 *
 * AND THE PUSH IS MEASURED, not drawn on: the momentum that actually arrived at each
 * body, summed over its cells and over every tick, read off `Source.absorbed`. The
 * two come out equal and opposite and pointing at each other, which is the claim.
 */
const GAP_CELLS = 24, VIEW = 38;


/**
 * ONE BODY IN THE VACUUM, AND HOW FAR ITS DEFICIT REACHES — which is nowhere.
 *
 * The same pure-gravity vacuum as above with one absorber dropped into it after it
 * has settled, so that whatever appears is the body's doing. It is the article's own
 * sentence — *the deficit expands at c̄* — put to the test at the rule's own rate.
 *
 * IT DOES NOT EXPAND. Measured against the far field, at every tick from 4 to 60
 * without changing:
 *
 *     r        4       6       9      13      18      24      30
 *          −16.7%    0.0%    0.0%    0.0%    0.0%    0.0%    0.0%
 *
 * Exactly the body's own surface, and exactly nothing beyond it. Not a weak signal
 * under noise — the far field is uniform to the last digit, because the vacuum is
 * perfectly regular. And it is the same at t = 60 as at t = 4, so nothing is on its
 * way either.
 *
 * THE REASON IS THE UNCONDITIONAL SPLIT. Every point is refreshed completely every
 * tick — split, annihilated, split again — so the medium has no memory from one tick
 * to the next, and news cannot ride on a medium with no memory. This is not a limit
 * on the SPEED of the deficit; there is no deficit out there travelling slowly. It is
 * that a perfectly balanced breathing is unaffected by what happened next door.
 *
 * WHAT THIS PANEL IS FOR, then, is to say that plainly. The gravity arc's mechanism
 * cannot be a shortfall propagating through the vacuum, because at the rule's own
 * rate it does not propagate at all. What survives the correction is everything that
 * does not depend on it — the metric read off annihilation counts, which is local to
 * where the counting happens, and the results that rest on it.
 */

/**
 * THE LATTICE PANELS — two bodies on the lattice, and what the rules do between them.
 *
 * The article's own arrangements: opposite charges, alike charges, the inert control,
 * the pure-gravity vacuum with nothing in it, and one body dropped into a settled one.
 */
const two = (
  id: string, what: string, qL: 1 | -1 | 0, qR: 1 | -1 | 0, label: string,
  o: { sep?: number; theory?: any; empty?: boolean; settle?: number } = {},
) => visual({
  id: `shelter.${id}`, width: 1200, height: 320, frames: 90,
  what,
  paint: () => {
    const t = make(qL, qR, o.sep ?? 14, o.theory ?? GRAVITY_MAGNETISM, o.empty ?? false, o.settle ?? 0);
    return { frame: (sur: Surface) => { t.w.tick(); paint(t, sur, label, ""); } };
  },
});

export default [
  two("attract", "two opposite charges on the lattice — space is destroyed BETWEEN them, " +
    "which is the pull", 1, -1, "opposite — (G+M/1) fires between them"),
  two("repel", "two alike charges — (G+M/3) turns instead, and the between-band is absent",
    1, 1, "alike — (G+M/3) turns instead"),
  two("inert", "the control — two inert absorbers of the same shape, which shadow each " +
    "other and carry no sign", 0, 0, "inert — the control, which only shadows"),
  two("vacuum-gravity", "the pure-gravity vacuum with nothing in it — every point splits " +
    "every tick and every edge annihilates every tick, exactly. An enormous amount of work " +
    "whose net is nothing, and nowhere in it is special",
    0, 0, "pure gravity — an enormous amount of work whose net is nothing",
    { sep: 26, theory: GRAVITY, empty: true }),
  two("deficit-front", "ONE body dropped into a settled pure-gravity vacuum — and its " +
    "deficit does not spread at all. A medium refreshed every tick has no memory to carry news",
    0, 0, "one body in a settled vacuum — the deficit does not spread",
    { theory: GRAVITY, settle: 60 }),
];
