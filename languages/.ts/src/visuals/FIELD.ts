/**
 * THE GRAVITY PANEL, ONCE — the picture every one of these is, with the arrangement handed in.
 *
 * `gravity.rain`, `gravity.pull` and `solar.inner` are ONE panel and three sets of numbers.
 * They ask the same question of the same backend and draw the same three things: what each
 * body puts out, where space is destroyed, and the part of that destruction which is one
 * body's ray against another's - the cross term `\bar{m}\bar{m}'` is a product for. Written
 * out three times they would drift apart in the fourth decimal of a shade, and a reader
 * comparing two of them would be comparing two drawings as much as two runs.
 *
 * SO THE DRAWING LIVES HERE AND NOTHING ELSE DOES. What a panel supplies is where the bodies
 * start, how big the box is, how long the film runs and how the view opens. Everything about
 * how it LOOKS - the log scale, the ray sampling carried along its own exit at one cell a
 * tick, the excess measured against what the vacuum does anyway - is one copy, so a change to
 * any of it lands on all three at once.
 */
import { Painter, Played, Surface, Visual, visual } from "./CANVAS.ts";
import { line } from "../backends/CPU.continuous.ts";
import { gpu } from "../backends/GPU.continuous.ts";
import { Geometry } from "../lib/Local.ts";

const BACK = "#08090d";
const SEEN = "#eef0f5";
/* one colour per population, and one for where their rays put each other out */
const ONE = "#4aa8eb", TWO = "#8bd48b", GONE = "#eb964a", PAIR = "#eef0f5";
/* and LESS destroyed here than the rest of the picture - a shadow, which is what an expansion
 * that did not happen looks like from the outside */
const SHADE = "#3f6fb5";

/**
 * WHAT A BODY IS PUT DOWN AS — the source's own properties, and its place in `\bar{c}` FROM
 * THE MIDDLE, because that is what a length is. How many cells that comes to is `K`'s business.
 */
export type Body = {
  x: number; y: number; mx: number; ways: number;
  px?: number; py?: number; moves?: boolean; tag?: number;
  chooses?: (d: number, tick: number) => number;
};

export type Setup = {
  id: string; what: string; width: number; height: number;
  GEO: Geometry; DEG: number;
  /** the furthest the panel ever shows, and how much lattice it keeps out of sight past it */
  VIEW: number; MARGIN: number;
  N: number; C: number;
  /**
   * THE TWO RESOLUTIONS THE LINE IS INTEGRATED AT — and neither may move the answer.
   *
   * `A` is how finely DIRECTION is sampled; `K` is how many cells make one `\bar{c}`. Refine
   * either and the same medium comes out, which is what makes them resolutions rather than
   * choices - see `line`. Everything else in a panel is in `\bar{c}`.
   */
  A: number; K: number;
  /**
   * HOW MANY PIXELS TO ONE `\bar{c}` IN THE RECORDING — and it is `K`, because that is how
   * finely the world was worked out.
   *
   * A panel used to sample every `K`th cell, so the picture was one pixel per `\bar{c}` however
   * finely the line had been integrated: at `K = 3` eight ninths of what had been computed was
   * thrown away on the way to the file, and what a reader saw was blocky for that reason and no
   * other. Smoothness here is not more physics - it is not discarding the physics already done.
   */
  PIX: number;
  /** what `draw` needs of the arrangement: the gap the view opens from, and how many bodies */
  GAP: number; bodies: number;
  /** ticks in a frame, frames in the film, and ticks of vacuum before anything is put in */
  TICKS: number; RUN: number; BURN: number;
  /** how many populations are told apart - two, whichever panel it is */
  tags: number;
  stamp: string;
  box(x: number, y: number): number;
  /** where the bodies start, and what to do when there is nothing left in frame */
  place(): Body[];
  spent?(at: { x: number; y: number }[]): boolean;
  /** how wide the picture is on tick `t` */
  view(t: number): number;
  /** the ring colour for body `k`, where a panel wants to tell them apart */
  ring?(k: number): string;
  /** the theory it is a panel of - handed in, because nothing here knows what `G` is */
  theory: any;
};

/**
 * THE PICTURE, FROM THE CHANNELS AND FROM NOTHING ELSE — so it can be changed without the
 * world being run again, which is the whole point of recording one.
 */
/**
 * AND WHAT IS DRAWN OF THE DESTRUCTION IS WHAT IT COMES TO OVER THE FRAMES SO FAR, not one
 * frame of it.
 *
 * A meeting either happened at a cell this tick or it did not, so one frame's `gone` is a
 * couple of ticks of whole counts and EVERY cell sits about a hundred per cent from the mean.
 * Inked against that mean the picture is a checkerboard of noise at full brightness with the
 * structure buried in it - which is what this panel has been, in one colour before and in two
 * now. The quantity the model is about is what the meetings come to over many ticks; the
 * painter is handed the frames in order, so it can have that for nothing and without the world
 * being run again.
 */
const draw = (p: Setup, s: Surface, ch: Record<string, Float32Array>, t: number,
              avg: { sum: Float64Array; n: number }) => {
  const { VIEW, TICKS, GAP, DEG, GEO, box, PIX } = p;
  const { ctx, width, height: H } = s;
  ctx.clearRect(0, 0, width, H);
  ctx.fillStyle = BACK; ctx.fillRect(0, 0, width, H);

  const TOP = 14, BOT = 14, GAP2 = 10;
  const cw = (width - GAP2) / 2;
  const side = Math.min(cw, H - TOP - BOT);
  /* the view opens with the field, so what is spreading stays in the picture */
  const view = p.view(t);
  /* a pixel is `1/PIX` of a `\bar{c}`, and the view is stated in `\bar{c}` */
  const pz = side / (2 * view * PIX + 1);
  const top = TOP + Math.max(0, (H - TOP - BOT - side) / 2);

  /*
   * THE LOG SCALE, ON BOTH HALVES AND FOR THE SAME REASON: what is drawn falls off as a power
   * of the distance, so linearly the body saturates and everything past a few cells is under
   * the first shade. A thousandth of the peak is still visible on this one.
   */
  const lg = (v: number, floor: number) =>
    v <= 0 ? 0 : Math.log(1 + v / floor) / Math.log(1 + 1 / floor);

  /*
   * AND EACH POPULATION AGAINST ITS OWN PEAK. Two bodies differ by whatever their masses
   * differ by, and on one shared scale the lighter of them sits under the floor and draws
   * nothing - which is the whole of `\bar{m}\bar{m}'` missing from a panel that is about it.
   */
  let peakA = 1e-30, peakB = 1e-30, peakG = 1e-30;
  const R = Math.round(view * PIX);
  for (let y = -R; y <= R; y++) for (let x = -R; x <= R; x++) {
    const i = box(x, y);
    if (ch.one[i] < 0) continue;
    peakA = Math.max(peakA, ch.one[i]); peakB = Math.max(peakB, ch.two[i]);
    peakG = Math.max(peakG, avg.sum[i] / avg.n);
  }

  for (const col of [0, 1]) {
    const cx = (col === 0 ? cw / 2 : cw + GAP2 + cw / 2), cy = top + side / 2;
    ctx.fillStyle = "#0b1119";
    ctx.fillRect(cx - side / 2, cy - side / 2, side, side);

    for (let y = -R; y <= R; y++) for (let x = -R; x <= R; x++) {
      const i = box(x, y);
      if (ch.one[i] < 0) continue;                       /* a body's own cells */
      if (col === 1) {
        /*
         * WHERE SPACE IS ANNIHILATED BECAUSE THE BODIES ARE THERE — one quantity, in white, on
         * a dark ground, and nothing else in this half.
         *
         * The channel is the part of the destruction that is one body's ray against the
         * OTHER'S, summed over the frames so far. It is nought wherever the two fields have not
         * met, so the ground is dark by construction rather than by a threshold, and what takes
         * ink opens between the sources and accumulates as they go on meeting.
         *
         * AND IT IS WHERE MORE IS DESTROYED, NOT WHERE THE COUNT DIFFERS, and on a log scale
         * against its own peak, like the rays beside it, because it falls off as a power of the
         * distance and linearly everything past a few cells is under the first shade.
         */
        /* against where the MOST annihilation has accumulated, logged over two decades of it:
         * measured, it peaks between the bodies and is down by one decade ten c-bar out and by
         * three at eighteen, and a floor at 0.004 of the peak lit all of that at half brightness
         * and read as a uniform sphere */
        const ink = lg(Math.max(0, avg.sum[i] / avg.n) / peakG, 0.004);
        if (ink > 0.015) {
          ctx.globalAlpha = Math.min(1, ink);
          ctx.fillStyle = PAIR;
          ctx.fillRect(cx + x * pz - pz / 2, cy + y * pz - pz / 2, pz + 0.6, pz + 0.6);
        }
        continue;
      }
      /*
       * ═══ THE FIELD AS WHAT IT IS: A DENSITY, DRAWN AS A GRADIENT ════════════════════════
       *
       * `n(x, \hat{d})` is an occupancy and what a panel wants of it is how much stands HERE,
       * which is a number per place. So a place is inked at the shade that number comes to,
       * on a log scale because the falloff is a power law - measured off the recording, the
       * field about a body goes `4.3e-4, 2.8e-4, 1.6e-4, 1.1e-4` at `4, 6, 9, 12` `\bar{c}`,
       * which is a slope near `1/r` and is the shell dilution the model is about.
       *
       * IT USED TO BE DRAWN AS RAYS ON THE LATTICE'S EXITS, one mark per `GEO.U[e]`, with the
       * grain carried along each exit a cell a tick. That was right when the population WAS
       * per exit; it is the lattice, and the lattice is the one thing the continuous reading
       * does not have. So a field measured round to within fifteen per cent - `max/mean 1.14`,
       * `min/mean 0.84` at nine `\bar{c}` - was drawn as eight beams, and the beams were the
       * painter's. Nothing about the world changed here, only what is asked of it.
       *
       * AND THE TWO POPULATIONS ARE MIXED BY WHICH IS THERE, so where one body's field meets
       * the other's the colour says so rather than one of them winning the pixel.
       */
      const one = Math.max(0, ch.one[i]) / peakA, two = Math.max(0, ch.two[i]) / peakB;
      const tot = one + two;
      if (tot > 0) {
        const shade = lg(tot, 0.0015);
        if (shade > 0.012) {
          const f = two / tot;
          const mix = (a: string, b: string) => {
            const A0 = parseInt(a.slice(1), 16), B0 = parseInt(b.slice(1), 16);
            const r = Math.round(((A0 >> 16) & 255) * (1 - f) + ((B0 >> 16) & 255) * f);
            const g2 = Math.round(((A0 >> 8) & 255) * (1 - f) + ((B0 >> 8) & 255) * f);
            const b2 = Math.round((A0 & 255) * (1 - f) + (B0 & 255) * f);
            return `rgb(${r},${g2},${b2})`;
          };
          ctx.globalAlpha = Math.min(1, shade);
          ctx.fillStyle = mix(ONE, TWO);
          ctx.fillRect(cx + x * pz - pz / 2, cy + y * pz - pz / 2, pz + 0.6, pz + 0.6);
        }
      }
    }
    ctx.globalAlpha = 1;

    /* the heaviest in the picture, so the markers are to scale against each other */
    let heaviest = 1e-30;
    for (let k = 0; k < p.bodies; k++) heaviest = Math.max(heaviest, ch.marks[k * 6 + 5]);
    for (let k = 0; k < p.bodies; k++) {
      const bx = ch.marks[k * 6] * PIX, by = ch.marks[k * 6 + 1] * PIX;
      /* A BODY IS ONE PLACE and the ring is a MARKER for it rather than its extent - sized by
       * what it weighs, with a floor so the lightest is still seen */
      const heavy = ch.marks[k * 6 + 5] / heaviest;
      const r = Math.max(1.6, 3.5 * Math.sqrt(heavy)) * pz * PIX;
      ctx.strokeStyle = p.ring?.(k) ?? SEEN; ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(cx + bx * pz, cy + by * pz, r, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }
};


/**
 * THE WORLD OF ONE PANEL — and every derived thing in it is the backend's.
 *
 * `CPU.continuous` owns what a source is and what it does: laying it in, `radiate`'s measured
 * momentum, `turns`' lean, and the step. All of it was written in a drawing first and all of
 * it was wrong there - a body pushed by its own rays, then by its own wake, then flung apart
 * by the impulse of its own step. It is one place to be right now, and a panel only says
 * where the bodies start and reads what happened.
 */
const world = (p: Setup) => {
  const { N, C, VIEW, TICKS, BURN, GEO, A, K } = p;
  /*
   * TWO WORLDS ON ONE LINE — the same equation with the bodies in it and without them, so that
   * what is drawn is what the bodies DID and not what the vacuum does anyway.
   *
   * `(G/1)` fires everywhere every tick: an empty box destroys `DEG/2` a point a tick for ever.
   * The raw count is therefore almost all ambient and a picture of it is a white square. The
   * difference between the two is nought wherever the bodies' rays have not reached, so it is a
   * disc that grows at `\bar{c}` and is exactly the disturbance.
   */
  /*
   * AND IT IS STEPPED ON THE DEVICE WHERE THERE IS ONE — the same equation, the same terms, the
   * same numbers, in parallel. `GPU.continuous` generates its kernels from the very expressions
   * `line` evaluates, so which one runs is a question about the machine and not about the model:
   * measured, the vacuum comes out identical on both, period 2 at `n_{f} = DEG/2` at every
   * resolution and on every geometry. Where the runtime has no device this falls back and the
   * panel is the same panel, slower.
   */
  const made = async () => ({
    w: await world1(p.tags), t: await world1(0),
  });
  const world1 = async (tags: number) => {
    if ((globalThis as any).navigator?.gpu) {
      try { return await gpu({ theory: p.theory, geometry: GEO, N, A, K, tags }); }
      catch { /* no device, or one that cannot hold this - the reading below is the same */ }
    }
    return line({ theory: p.theory, geometry: GEO, N, A, K, tags });
  };
  let W: any;
  /* what the meetings came to over a frame, as an excess over the undisturbed twin */
  const gone = new Float64Array(N * N);
  /* and the field over the ticks a frame spans, so the medium's own phase divides out */
  const beat = new Float64Array(N * N), beat2 = new Float64Array(N * N);
  let spanned = 0;

  const lay = async () => {
    W = await made();
    for (let i = 0; i < BURN; i++) { await W.w.step(); await W.t.step(); }
    for (const b of p.place())
      W.w.add({ x: C + b.x * K, y: C + b.y * K, mx: b.mx, ways: b.ways,
                tag: b.tag, moves: b.moves ?? false, px: b.px ?? 0, py: b.py ?? 0 });
  };

  return {
    start: async () => { await lay(); },
    frame: async (into: Record<string, Float32Array>) => {
      gone.fill(0); beat.fill(0); beat2.fill(0); spanned = 0;
      for (let i = 0; i < TICKS; i++) {
        if (p.spent?.((W.w.bodies as any[]).map(b =>
          ({ x: (b.x - C) / K, y: (b.y - C) / K })))) { await lay(); continue; }
        await W.w.step(); await W.t.step();
        /* AND A WORLD ON A DEVICE HAS TO BE ASKED FOR WHAT IT HOLDS. `sync` fetches the frame's
         * arrays in one copy; on the CPU they are already here and it costs nothing. Left
         * unawaited the steps were fired and never waited on - the tick never advanced, and
         * every channel came out nought while the physics was perfectly correct. */
        await W.w.sync();
        /* THE PART OF THE DESTRUCTION THAT IS ONE BODY'S RAY AGAINST THE OTHER'S - which is
         * what `\bar{m}\bar{m}'` counts, and is nought until the two fields overlap */
        for (let c = 0; c < N * N; c++) {
          gone[c] += W.w.crossed[c];
          beat[c] += W.w.from(0, c); beat2[c] += W.w.from(1, c);
        }
        spanned++;
      }
      /*
       * AND WHAT IS READ OUT IS IN `\bar{c}`, NOT IN CELLS. The panel is about how far a field
       * reaches and how far apart two bodies are, and both of those are lengths - `K` cells make
       * one of them, so the picture samples the world every `K`th cell and the view is the same
       * view whatever the resolution is.
       */
      let level = 0, seen = 0;
      const R = VIEW * p.PIX, step = K / p.PIX;
      for (let y = -R; y <= R; y++) for (let x = -R; x <= R; x++) {
        const c = W.w.at(Math.round(C + x * step), Math.round(C + y * step)), i = p.box(x, y);
        if (c < 0) { into.one[i] = into.two[i] = into.gone[i] = 0; continue; }
        /*
         * AND THE FIELD IS WHAT STANDS OVER A BEAT, not what stands on one phase of it.
         *
         * The medium has a period: every point splits, and the tick after, every one of them
         * annihilates. So a single tick is ONE PHASE of a two-cycle, and a picture of it is a
         * picture of the parity - measured off the recording, a place differed from its
         * neighbour by 126 per cent, and by the same 126 across a whole `\bar{c}`, which is not
         * a field with structure but a field sampled at the wrong rate. Averaged over the ticks
         * a frame spans, the phase divides out and what is left is the envelope: the amount a
         * body has put into the space around it, which is the thing the panel is about.
         */
        into.one[i] = W.w.blocks[c] ? -1 : beat[c] / Math.max(1, spanned);
        into.two[i] = W.w.blocks[c] ? -1 : beat2[c] / Math.max(1, spanned);
        into.gone[i] = gone[c];
        if (!W.w.blocks[c]) { level += gone[c]; seen++; }
      }
      into.marks[6 * p.bodies] = seen ? level / seen : 0;
      (W.w.bodies as any[]).forEach((b, k) => {
        if (k >= p.bodies) return;
        into.marks[k * 6] = (b.x - C) / K; into.marks[k * 6 + 1] = (b.y - C) / K;
        into.marks[k * 6 + 2] = b.px ?? 0; into.marks[k * 6 + 3] = b.py ?? 0;
        into.marks[k * 6 + 4] = W.w.t;
        /* AND WHAT IT WEIGHS, so the marker is the size of the thing it marks - and it is
         * the mass the article's own equation gives, `gravity.saturation`, which is the same
         * number as what the body radiates */
        into.marks[k * 6 + 5] = W.w.mass(b);
      });
    },
  };
};

/** and a painter is that drawing, over whatever frames it was handed */
const shows = (p: Setup) => (from?: Played): Painter => {
  const w = from ?? { cached: false, at: () => ({}) } as Played;
  let f = 0;
  const BOX = 2 * p.VIEW * p.PIX + 1;
  const avg = { sum: new Float64Array(BOX * BOX), n: 0 };
  return {
    frame: (s: Surface) => {
      const ch = w.at(f);
      if ((ch as any).one) {
        for (let i = 0; i < avg.sum.length; i++) avg.sum[i] += ch.gone[i];
        avg.n++;
        draw(p, s, ch, f * p.TICKS, avg);
      }
      f++;
    },
  };
};

/** ONE PANEL, FROM ONE ARRANGEMENT — which is the whole of what these files differ by */
export const panel = (p: Setup): Visual => {
  const BOX = 2 * p.VIEW * p.PIX + 1;
  return visual({
    id: p.id, width: p.width, height: p.height, frames: p.RUN, what: p.what,
    record: {
      /* the `gone` channel is the DISTURBANCE now and was the raw count before, so a film
       * recorded against the old meaning must not be drawn against the new one */
      stamp: [p.stamp, "gone=\u03b4"].join("/"),
      channels: { one: BOX * BOX, two: BOX * BOX, gone: BOX * BOX, marks: 6 * p.bodies + 1 },
      ...world(p),
    },
    paint: shows(p),
  });
};
