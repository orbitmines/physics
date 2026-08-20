/**
 * THE PANELS — drawn from the same core the measurements use, so a picture and a
 * number can no longer disagree.
 *
 * Every panel below constructs a `World` from DISCRETE.ts with an explicit theory
 * and geometry, ticks it, and reads the SAME observables the tests read. There is no
 * second implementation of the rules for drawing purposes, which is what the old
 * `grid.tsx` and `current.tsx` were and is how they came to be showing a vacuum a
 * fifth of the derived density.
 *
 * WHAT RENDERING KEEPS CATCHING, recorded so it is not re-learned:
 *
 *   A DIFFERENCE, NOT A TOTAL. A source emits along its EXITS, so what dominates a
 *   raw frame is pencil beams that are identical in every configuration. Two panels
 *   meant to show opposite physics came out looking the same. Each panel here runs a
 *   CONTROL world at the same seed and draws the difference.
 *
 *   AND THE DIFFERENCE HAS A DC OFFSET. A second body changes the vacuum's own
 *   statistics everywhere, which rendered as a uniform wash with the signal buried
 *   in it. The far field is where nothing local happens, so its mean is that offset.
 *
 *   A SHARED SCALE, NOT A PER-PANEL PEAK. Normalising each panel to its own maximum
 *   makes them incomparable and reads backwards — a panel where almost nothing
 *   happens turns its own shot noise up to full brightness beside a panel with a
 *   real signal.
 */

import { frames, Painter, visual, Surface } from "./CANVAS.ts";
import {
  World, Theory, Geometry, GRAVITY, GRAVITY_MAGNETISM, LABELLED, GEOMETRIES,
  l, fieldB, fill, withSign,
} from "../lib/DISCRETE.ts";

const BACK = "#08090d", FAINT = "#5a5f6e", SEEN = "#eef0f5";
const PLUS = "#4aa8eb", MINUS = "#eb964a", DESTROYED = "#e0685f", TRAFFIC = "#6fd39b";

/** what a panel reads off a local, and how it is coloured */
export type Channel = {
  name: string;
  /** the value at a local, already differenced against the control by the caller */
  at: (w: World, local: number) => number;
  /** signed: two colours; unsigned: one */
  positive: string;
  negative?: string;
  /**
   * Whether this reading has to be ACCUMULATED over ticks or is already a total.
   *
   * A single tick of this vacuum is noise. Reading how many rays are present at a
   * local right now and differencing it against another world gives a difference of
   * two random numbers — rendered, it is a uniform speckle with the physics
   * invisible inside it, which is exactly what the first version of these panels
   * drew. `density` is already cumulative because a fold is permanent; everything
   * else has to be summed over time, and the sum IS the measurement.
   */
  cumulative?: boolean;
};

export const CHANNELS = {
  /**
   * WHERE SPACE HAS BEEN DESTROYED — the metric channel, and the article's pull.
   *
   * READ OUT OF `w.destroyed`, NOT `backend.density`. Density counts how much space
   * has been FOLDED into a point, and on-edge annihilation does not fold: it collapses
   * the point the split inserted BETWEEN two others and leaves both ends alone. So
   * density stopped moving when the meeting rule was settled, and this channel — the
   * one every "pull" panel in the article is drawn from — silently went flat. The
   * panels kept rendering; the layer they were about was blank.
   *
   * `w.destroyed` is the per-point annihilation count, credited half to each end of
   * the edge the event happened on, and it is the same quantity the force
   * measurements read. `before` is still taken so the signature does not change and
   * so a panel can be drawn against a warmed world.
   */
  destroyed: (before: Int32Array): Channel => ({
    name: "space destroyed — the pull",
    at: (w, k) => (k < w.destroyed.length ? w.destroyed[k] : 0) - (before[k] ?? 0),
    positive: DESTROYED,
    cumulative: true,                      // a count only ever grows, so it already sums
  }),
  /** how much is present — the mechanical channel, and the push */
  traffic: (): Channel => ({
    name: "rays that survived — the push",
    at: (w, k) => l.rays(w, k).length,
    positive: TRAFFIC, negative: MINUS,
  }),
  /** the net polarity, which IS the electric field */
  charge: (): Channel => ({
    name: "net polarity — the electric field",
    at: (w, k) => l.charge(w, k),
    positive: PLUS, negative: MINUS,
  }),
  /** B = Σσ(d̂ × u), out of the plane */
  magnetic: (axis = 2): Channel => ({
    name: "B = Σσ(d̂ × u), read off the rays",
    at: (w, k) => fieldB(w, k)[axis] ?? 0,
    positive: PLUS, negative: MINUS,
  }),
} as const;

export type PanelSpec = {
  note: string;
  /** draw a dot for each source; off where the claim is that the field hides them */
  markers?: boolean;
  theory: Theory;
  geometry?: Geometry;
  /** the world under test, and the control it is drawn against */
  build: (w: World) => void;
  control?: (w: World) => void;
  /**
   * DRAW THE FIELD ITSELF, NOT A DIFFERENCE — for the one kind of panel where a
   * control is a contradiction.
   *
   * Every other panel here asks what a body DOES to the vacuum, and the honest way
   * to ask that is to run the vacuum again without the body and subtract. But a
   * panel whose subject IS the vacuum has no body to leave out, so its control is
   * the same world at the same seed: the difference is identically zero at every
   * point, the far-field spread the colour scale is taken from is zero, and the
   * panel renders permanently black. It did. Nothing was wrong with the physics —
   * the picture was of a quantity that had been subtracted from itself.
   */
  absolute?: boolean;
  channels: (before: Int32Array) => Channel[];
  N?: number;
  expansion?: number;
  /** how much of the box to ink; the rest is run but not drawn */
  view?: number;
  warm?: number;
  height?: number;
};

/**
 * THE PANELS RUN IN TWO DIMENSIONS, and that is a decision rather than a shortcut.
 *
 * A panel is a picture of one plane. Running a 41³ world to draw a slice of it costs
 * sixty-eight thousand locals a tick against a plane's fourteen thousand at 121² —
 * for pixels nobody sees. Measured, the 3D version did not finish. `triangular-6` is
 * the same three rules with DEG = 6, and every constant a panel needs comes out of it
 * the same way, so it is a row of `geometry/derived-constants` rather than a special
 * case.
 *
 * TRIANGULAR RATHER THAN SQUARE, for the reason the default is FCC rather than cubic
 * 26. `square-8`'s eight exits are two different lengths, 1 and √2, so rays down the
 * diagonals outrun the ones going straight and a picture of a rule is also a picture
 * of the lattice's grain; taking the diagonals out fixes that and leaves four exits,
 * which is as anisotropic as a plane gets. Triangular 6 has ONE STEP LENGTH — exactly
 * 1, so c̄ is one cell a tick down every exit — equal weights, and it is EXACT at
 * ranks two, three and four, which no square arrangement in the plane is. It stands
 * to the panels as fcc-12 stands to the measurements.
 *
 * It could not be run until the lattice was fixed. Its exits carry ±√3/2, the backend
 * stepped through the array by ROUNDING them, and rounding is not antipodal — two
 * thirds of its links were one-way, so every head-on meeting looked for its partner
 * in the wrong cell. In axial coordinates it is plainly an integer lattice; see
 * `GeometrySpec.L`.
 *
 * What is still lost is named: SHEET is 2 rather than 8, and rank six is 0.200. A
 * panel shows the MECHANISM; the numbers belong to the measurements, which run in
 * three.
 */
const make = (s: PanelSpec, build: (w: World) => void) => {
  const w = new World({
    theory: s.theory, geometry: s.geometry ?? GEOMETRIES["triangular-6"], N: s.N ?? 121,
    /*
     * p = 1, WHICH IS THE RULE. (G/2) says a neutral point expands ON ALL AXIS — it
     * is not gated on anything, and `World`'s own default is 1. These panels ran at
     * 0.05 because that is what the archive's automaton used, and the archive's
     * automaton had a rate because it was written before the rule was settled.
     *
     * It is not a small correction. At p = 1 gravity+magnetism settles at fill
     * 0.5019 — the derived fixed point ½, on the nose, on both lattices — against
     * 0.2449 at p = 0.06. Half the vacuum was missing from every one of these
     * pictures.
     */
    seed: 20260817, boundary: "absorb",
  });
  build(w);
  return w;
};

/** the far-field mean, which is the offset a second body adds everywhere */
/*
 * WHERE A LOCAL ACTUALLY IS. A lattice's array coordinates are not its coordinates —
 * triangular 6 is stored in axial (q, r) and sits at q·a₁ + r·a₂ — so every distance
 * and every pixel here goes through the geometry's own embedding. It is the identity
 * on every cubic lattice, so nothing else moves.
 */
const where = (w: World, k: number) => w.geometry.embed(w.backend.position(k));

/*
 * AND THE MIDDLE HAS TO BE EMBEDDED TOO. The box's centre is the index (C, C, …); on
 * a sheared lattice that is NOT the point (C, C, …) in space. Subtracting the raw C
 * from an embedded position measures from somewhere that is not the middle of
 * anything, which puts the far-field annulus off centre and slides the whole drawing
 * out of frame.
 */
const middle = (w: World, C: number) =>
  w.geometry.embed(new Array(w.geometry.D).fill(C));

const offset = (w: World, f: (k: number) => number, C: number, view: number) => {
  let s = 0, n = 0;
  w.backend.forEachLocal(k => {
    if (w.isSource(k)) return;
    const p = where(w, k), m = middle(w, C);
    const d = Math.hypot(...p.map((x, i) => x - m[i]));
    if (d < view + 8) return;
    s += f(k); n++;
  });
  return n ? s / n : 0;
};


const paint = (
  sur: Surface, w: World, chans: Channel[], read: ((k: number) => number)[],
  C: number, view: number, ticks: number, markers = true, ready = 1,) => {
  const { ctx, width, height } = sur;
  const mid = middle(w, C);
  ctx.fillStyle = BACK; ctx.fillRect(0, 0, width, height);
  const cols = chans.length;
  const cw = width / cols, H = height - 26;
  const VN = 2 * view + 1;
  const s = Math.min(cw / VN, H / VN);
  const oy = 20 + (H - 20 - VN * s) / 2;

  chans.forEach((ch, ci) => {
    const ox = ci * cw + (cw - VN * s) / 2;
    const dc = read[ci];
    const off = offset(w, dc, C, view);
    /*
     * THE SCALE IS THE SPREAD OF THE DIFFERENCE ITSELF, taken in the far field where
     * nothing local is happening — so the colour means "this many times the level
     * this quantity fluctuates at anyway". Normalising to a panel's own PEAK makes
     * panels incomparable and reads backwards: one where almost nothing happens
     * turns its own shot noise up to full brightness beside one with a real signal.
     */
    let v2 = 0, n = 0;
    w.backend.forEachLocal(k => {
      if (w.isSource(k)) return;
      const p = where(w, k);
      if (Math.hypot(...p.map((x, i) => x - mid[i])) < view + 8) return;
      const d = dc(k) - off; v2 += d * d; n++;
    });
    const scale = n ? Math.max(Math.sqrt(v2 / n), 1e-12) : 1;

    w.backend.forEachLocal(k => {
      const p = where(w, k);
      if (p.length > 2 && Math.abs(p[2] - mid[2]) > 0.5) return;   // one plane, in 3D
      const x = p[0] - mid[0] + view, y = p[1] - mid[1] + view;
      if (x < 0 || y < 0 || x >= VN || y >= VN) return;
      if (w.isSource(k)) return;
      // in units of the far-field spread: two of those is a signal, and below one is
      // indistinguishable from the vacuum doing what it does anyway
      const v = (dc(k) - off) / scale;
      if (Math.abs(v) < 1) return;
      ctx.globalAlpha = Math.min(0.92, (Math.abs(v) - 1) * 0.35);
      ctx.fillStyle = v > 0 ? ch.positive : (ch.negative ?? ch.positive);
      ctx.fillRect(ox + x * s, oy + y * s, Math.max(s, 1), Math.max(s, 1));
    });
    ctx.globalAlpha = 1;

    /*
     * THE MARKERS ARE OPTIONAL, because on some panels drawing them contradicts the
     * claim. The three sign-convention panels exist to show that a single tick of the
     * vacuum does NOT show the structure in it — and a ring of source dots painted
     * over the field shows it whatever the field is doing, which makes the picture
     * argue the opposite of its caption. Where the point is "you cannot see it here",
     * only what was measured is drawn.
     */
    for (const src of (markers ? w.sources : [])) {
      const p = where(w, src.locals[0]);
      if (p.length > 2 && Math.abs(p[2] - mid[2]) > 2) continue;
      let cx = 0, cy = 0, m = 0;
      for (const k of src.locals) {
        const q = where(w, k);
        if (q.length > 2 && Math.abs(q[2] - mid[2]) > 0.5) continue;
        cx += q[0]; cy += q[1]; m++;
      }
      if (!m) continue;
      ctx.beginPath();
      ctx.arc(ox + (cx / m - mid[0] + view) * s, oy + (cy / m - mid[1] + view) * s, 2.2 * s, 0, 7);
      ctx.fillStyle = src.emits > 0 ? PLUS : src.emits < 0 ? MINUS : "#2a2e38";
      ctx.fill();
      ctx.strokeStyle = SEEN; ctx.lineWidth = 1.2; ctx.stroke();
    }

    ctx.font = "10px ui-monospace, monospace";
    ctx.fillStyle = FAINT; ctx.textAlign = "center";
    ctx.fillText(ch.name, ci * cw + cw / 2, 14);
  });

  /*
   * THE CAPTION IS ALREADY ABOVE THE CANVAS, so drawing it again inside it bought
   * nothing and cost the readout: the two ran into each other in the same line of
   * pixels and the tick count came out written through the end of the sentence.
   * Only what cannot be in the caption — what this particular run did — is drawn.
   */
  ctx.textAlign = "right";
  ctx.fillStyle = FAINT;
  ctx.fillText(`${ticks} ticks · fill ${fill(w).toFixed(2)}`, width - 10, height - 10);
  ctx.textAlign = "left";

  // how much of the average is in yet — a panel that is still filling in says so
  if (ready < 1) {
    ctx.fillStyle = "#1a1d25"; ctx.fillRect(0, height - 2, width, 2);
    ctx.fillStyle = FAINT; ctx.fillRect(0, height - 2, width * ready, 2);
  }
};

// ─── the panels the article uses ────────────────────────────────────────────

/** a position with as many components as the geometry has dimensions */
const at = (w: World, ...c: number[]) => c.slice(0, w.geometry.D);

const pair = (a: 1 | -1 | 0, b: 1 | -1 | 0, sep = 14) => (w: World) => {
  const C = (w.opts.N - 1) / 2;
  w.add({ at: at(w, C - sep / 2, C, C), radius: 3, emits: a, absorbs: true, duty: a === 0 ? 0 : 1 });
  w.add({ at: at(w, C + sep / 2, C, C), radius: 3, emits: b, absorbs: true, duty: b === 0 ? 0 : 1 });
};
const lone = (a: 1 | -1 | 0, sep = 14) => (w: World) => {
  const C = (w.opts.N - 1) / 2;
  w.add({ at: at(w, C - sep / 2, C, C), radius: 3, emits: a, absorbs: true, duty: a === 0 ? 0 : 1 });
};

/** two alike charges: nothing annihilates between them, so the rays land — the push */



/** two opposite charges: the gap is destroyed rather than crossed — the pull */

/** gravity: two inert absorbers, and the vacuum's own shadow between them */

/** the magnetic field of a moving charge, beside the same charge at rest */

/**
 * TWO WIRES. Each is a line of sources whose POLARITY carries the current — the
 * cells on one side of the line emit +1 and on the other −1, so there is no net
 * charge and the direction of the current is in the sign.
 *
 * IT HAS TO BE BUILT THAT WAY FOR A FORCE TO EXIST AT ALL, and the two constructions
 * of a wire in this book are not interchangeable. A wire made of counter-drifting
 * LABELLED carriers gives the right field — Ampère's 1/r, no curl taken — and has
 * no magnetic force whatever, because its polarity distribution is identical
 * whichever way the current runs and a label does not enter the collision rules.
 * A wire whose polarity carries the current has the force and the wrong field
 * exponent. Joining them needs carriers that actually move, which is owed.
 *
 * So these panels show the FORCE, and `MovingCharge` shows the FIELD.
 */
const wire = (sense: 1 | -1, x: number) => (w: World) => {
  const N = w.opts.N;
  for (let y = 4; y < N - 4; y++)
    w.add({ at: at(w, x, y, (N - 1) / 2), radius: 0.9, emits: (y % 2 === 0 ? sense : -sense) as 1 | -1 });
};
const wires = (a: 1 | -1, b: 1 | -1 | 0, sep = 14) => (w: World) => {
  const C = (w.opts.N - 1) / 2;
  wire(a, C - sep / 2)(w);
  if (b !== 0) wire(b, C + sep / 2)(w);
};

/** parallel currents: the rays that face each other carry opposite signs, so they annihilate */

/** antiparallel: the facing rays are alike, so they turn and survive */

// ─── the gravity arc's own panels, on the core ──────────────────────────────

/**
 * WHAT THE VACUUM DOES ON ITS OWN — which is the whole of the gravity mechanism
 * before any matter is put in it.
 *
 * (G+M/2) makes new room and the same expansion thins what is already there, and
 * the two together have a fixed point nobody chose. A panel of it is not a picture
 * of anything happening to a body: it is the pressure a body will later be in.
 */

/**
 * THE DEFICIT — matter in the way of the expansion.
 *
 * A body eats the rays that arrive at it, so the vacuum around it is short of what
 * it would otherwise have, and that shortfall spreads at c̄. It is the mechanism
 * rather than the observable — the force is what a SECOND body does to it — but it
 * is the thing the article's gravity arc is about, and it can be looked at.
 */

/**
 * THE VEINS, AND WHETHER THE VACUUM TAKES THEM OUT — the two limits side by side.
 *
 * Left: a source in an EMPTY box, which is the collisionless limit the geometry
 * table computes in, and where a body diagonal really does run √3 times as far in a
 * tick. Right: the same source in the model's own vacuum, where a ray meets
 * something every few cells and a ray that has been turned is on a different exit
 * from the one it left on.
 *
 * The measurement is `geometry/veins`; this is what it is a measurement OF.
 */

/**
 * THE SHEET — l.SHEET rays pulsed in a plane that comes round, which is how the
 * article derives 1/R^(D−1): a FIXED number of rays spread over a shell.
 *
 * Both halves are the same source; only the emission differs. Isotropic fires every
 * exit every tick, which is the approximation every measurement in this book has
 * used; `sheet` fires the equator of an axis that steps round the ring, which is
 * what the article actually describes.
 */

/*
 * THE VACUUM'S ONE FREE DRAW, AND WHAT AVERAGING DOES TO IT.
 *
 * These replace the archive's `ribbon.tsx` panels. The point they make is the same
 * one: (G+M/2) fixes where and when a creation fires and leaves only the SIGN open,
 * so the three conventions are the whole of the model's randomness — and none of the
 * three shows a structure at a single tick, because a structure is one object in a
 * field that fills every point. It is AVERAGING that makes it visible.
 *
 * WHAT CHANGED IS WHAT IS UNDERNEATH. `ribbon.tsx` ran its own automaton; these run
 * `DISCRETE.ts` with `withSign`, so the convention is a parameter of the model rather
 * than a re-implementation of it, and the picture cannot drift from what the tests
 * measure.
 */

/** a held ring of charge, which is the structure these panels are looking for */
const ring = (radius: number) => (w: World) => {
  const C = (w.opts.N - 1) / 2;
  for (let i = 0; i < 64; i++) {
    const a = (2 * Math.PI * i) / 64;
    w.add({
      at: [Math.round(C + radius * Math.cos(a)), Math.round(C + radius * Math.sin(a)), C],
      radius: 0, emits: i % 2 ? 1 : -1, duty: 1, absorbs: true,
    });
  }
};

/**
 * THE FIELD PANELS — two worlds, differenced, read through named channels.
 *
 * `Panel`'s body, exactly as the article has it: the React wrapper it sat in is gone
 * and what is left is the painter it always was.
 */
const panel = (s: PanelSpec): (() => Painter) => () => {
        let w: World, ctl: World;
        let chans: Channel[] = [], ctlChans: Channel[] = [];
        /** the running sum of each channel's difference, which is what gets drawn */
        let sums: Float64Array[] = [];
        let samples = 0;
        const N = s.N ?? 121, C = (N - 1) / 2, view = s.view ?? Math.min(30, C - 2);
        let acc = 0;

        /*
         * THE BASELINE THE CUMULATIVE CHANNELS ARE DIFFERENCED AGAINST. Taken from
         * `destroyed` for the same reason the channel reads it: density does not move
         * under on-edge annihilation, so a baseline taken from density is a baseline
         * of zeroes against a quantity that is also zero.
         */
        const snapshot = (x: World) => {
          const a = new Int32Array(x.backend.size());
          x.backend.forEachLocal(k => { a[k] = k < x.destroyed.length ? x.destroyed[k] : 0; });
          return a;
        };

        /*
         * ONE TICK OF BOTH WORLDS, AND THE DIFFERENCE ADDED IN.
         *
         * Accumulating the DIFFERENCE rather than differencing the accumulations is
         * the same number, and it is what lets a cumulative channel and a per-tick
         * one be drawn side by side without either needing to know about the other.
         */
        const step = () => {
          w.tick(); if (ctl) ctl.tick();
          samples++;
          for (let ci = 0; ci < chans.length; ci++) {
            const a = chans[ci], b = ctlChans[ci], out = sums[ci];
            if (a.cumulative) continue;               // already a total; read at the end
            if (ctl) w.backend.forEachLocal(k => { out[k] += a.at(w, k) - b.at(ctl, k); });
            else w.backend.forEachLocal(k => { out[k] += a.at(w, k); });
          }
        };

        /*
         * THE AVERAGE IS THE MEASUREMENT, so it has to exist before the panel means
         * anything — but building it inside `start()` froze the tab. `start` runs
         * from an IntersectionObserver callback, on the main thread, and a few
         * hundred ticks of a 121² world with its control is a second or two of a
         * page that has stopped responding, once per panel as the reader scrolls
         * past it. Nothing was slow; it was all being spent at once.
         *
         * So the warm-up is spread over frames on a time budget, and the panel
         * paints from the first frame with however much average it has. It fills in
         * while it is watched instead of arriving whole after a stall.
         *
         * HEADLESS IS THE EXCEPTION and takes it in one go: there is no second
         * frame there — the renderer draws once and the picture has to be finished.
         */
        const WARM = s.warm ?? 200;
        const HEADLESS = typeof IntersectionObserver === "undefined";
        const BUDGET_MS = 12;                          // ~⅔ of a 60Hz frame
        let warmed = 0;

        return {
          start: () => {
            w = make(s, s.build);
            ctl = s.absolute ? (undefined as unknown as World) : make(s, s.control ?? (() => {}));
            chans = s.channels(snapshot(w));
            ctlChans = ctl ? s.channels(snapshot(ctl)) : chans;
            sums = chans.map(() => new Float64Array(w.backend.size()));
            samples = 0; warmed = 0;
            if (HEADLESS) { for (; warmed < WARM; warmed++) step(); }
          },
          stop: () => { (w as unknown) = undefined; (ctl as unknown) = undefined; sums = []; },
          frame: (sur: Surface, dt: number) => {
            if (warmed < WARM) {
              const t0 = performance.now();
              while (warmed < WARM && performance.now() - t0 < BUDGET_MS) { step(); warmed++; }
            } else {
              acc += dt;
              while (acc > 1 / 20) { step(); acc -= 1 / 20; }
            }
            const read = chans.map((ch, ci) => ch.cumulative
              ? (ctl ? (k: number) => ch.at(w, k) - ctlChans[ci].at(ctl, k)
                     : (k: number) => ch.at(w, k))
              : (k: number) => sums[ci][k] / Math.max(samples, 1));
            paint(sur, w, chans, read, C, view, w.stats.ticks, s.markers !== false,
              warmed < WARM ? warmed / WARM : 1);
          },
        };
};

export default [
  visual({
    id: "panels.two-charges", width: 760, height: 380, frames: 90,
    what: "two charges, differenced against the same vacuum without them — what a body " +
      "DOES to the medium, which is the only honest way to ask it",
    paint: panel({ note: "two charges", theory: GRAVITY_MAGNETISM as any,
      build: pair(1, -1), control: lone(1),
      channels: before => [CHANNELS.charge(), CHANNELS.destroyed(before)] }),
  }),
  visual({
    id: "panels.alike", width: 760, height: 380, frames: 90,
    what: "two ALIKE charges, where the meeting turns instead of annihilating",
    paint: panel({ note: "alike", theory: GRAVITY_MAGNETISM as any,
      build: pair(1, 1), control: lone(1),
      channels: before => [CHANNELS.charge(), CHANNELS.destroyed(before)] }),
  }),
  visual({
    id: "panels.wire", width: 760, height: 380, frames: 90,
    what: "a neutral wire — a current with no net charge, which is where B has to come " +
      "from the label rather than from the sign",
    paint: panel({ note: "a neutral wire", theory: LABELLED as any,
      build: wire(1, 0), control: wire(1, 0),
      channels: () => [CHANNELS.magnetic(), CHANNELS.traffic()] }),
  }),
];
