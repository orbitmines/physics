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
import { continuous } from "../backends/CPU.continuous.ts";
import { Geometry } from "../lib/Local.ts";

const BACK = "#08090d";
const SEEN = "#eef0f5";
/* one colour per population, and one for where their rays put each other out */
const ONE = "#4aa8eb", TWO = "#8bd48b", GONE = "#eb964a", PAIR = "#eef0f5";

/** what a body is put down as - the source's own properties and nothing derived */
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
const draw = (p: Setup, s: Surface, ch: Record<string, Float32Array>, t: number) => {
  const { VIEW, TICKS, GAP, DEG, GEO, box } = p;
  const { ctx, width, height: H } = s;
  ctx.clearRect(0, 0, width, H);
  ctx.fillStyle = BACK; ctx.fillRect(0, 0, width, H);

  const TOP = 14, BOT = 14, GAP2 = 10;
  const cw = (width - GAP2) / 2;
  const side = Math.min(cw, H - TOP - BOT);
  /* the view opens with the field, so what is spreading stays in the picture */
  const view = p.view(t);
  const pz = side / (2 * view + 1);
  const top = TOP + Math.max(0, (H - TOP - BOT - side) / 2);

  /*
   * THE LOG SCALE, ON BOTH HALVES AND FOR THE SAME REASON: what is drawn falls off as a power
   * of the distance, so linearly the body saturates and everything past a few cells is under
   * the first shade. A thousandth of the peak is still visible on this one.
   */
  const lg = (v: number, floor: number) =>
    v <= 0 ? 0 : Math.log(1 + v / floor) / Math.log(1 + 1 / floor);

  /* what the vacuum destroys at one cell in a tick - the scale an EXCESS is an excess of */
  const ambient = Math.abs(ch.marks[5 * p.bodies]) || 1e-30;
  let peak = 1e-30;
  for (let y = -view; y <= view; y++) for (let x = -view; x <= view; x++) {
    const i = box(x, y);
    if (ch.one[i] < 0) continue;
    peak = Math.max(peak, ch.one[i] + ch.two[i]);
  }

  for (const col of [0, 1]) {
    const cx = (col === 0 ? cw / 2 : cw + GAP2 + cw / 2), cy = top + side / 2;
    ctx.fillStyle = col === 0 ? "#0b1119" : "#150f09";
    ctx.fillRect(cx - side / 2, cy - side / 2, side, side);

    for (let y = -view; y <= view; y++) for (let x = -view; x <= view; x++) {
      const i = box(x, y);
      if (ch.one[i] < 0) continue;                       /* a body's own cells */
      if (col === 1) {
        /*
         * WHERE SPACE IS DESTROYED, which is what gravity IS in these rules - and picked out
         * in white, the part that is one body's ray against the OTHER'S. That is the geometric
         * mean of the two populations, which is what the pair term is proportional to, put on
         * the rays' own scale so the two halves come up at the same rate.
         */
        /*
         * AGAINST WHAT THE VACUUM IS DOING, not against the brightest cell in the frame. The
         * panel draws an EXCESS over a destruction that happens everywhere, so the excess is
         * only worth ink where it is a real share of it - and a frame with no excess in it
         * draws nothing, which is the truth about that frame.
         */
        const amb = lg(ch.gone[i] / ambient, 0.002);
        if (amb > 0.01) {
          ctx.globalAlpha = Math.min(1, amb);
          ctx.fillStyle = GONE;
          ctx.fillRect(cx + x * pz - pz / 2, cy + y * pz - pz / 2, pz + 0.6, pz + 0.6);
        }
        const pair = lg(Math.sqrt(ch.one[i] * ch.two[i]) / peak, 0.0006);
        if (pair > 0.02) {
          ctx.globalAlpha = Math.min(1, pair);
          ctx.fillStyle = PAIR;
          ctx.fillRect(cx + x * pz - pz / 2, cy + y * pz - pz / 2, pz + 0.6, pz + 0.6);
        }
        continue;
      }
      /*
       * AND THE RAYS, ONE PER EXIT, IN THE COLOUR OF WHOSE THEY ARE. A density is the chance an
       * exit is lit and what is lit is one whole ray, so the ink is a SAMPLE of it - hashed
       * from the place and the exit, and NOT from the frame.
       *
       * DRAWN AFRESH EVERY FRAME IT PULSED, and the field does not: measured over the run the
       * density at a cell climbs smoothly and levels off, and so does everything the shades
       * are scaled against. An independent draw per frame is scintillation, and it says
       * something the model does not - a ray here STREAMS, one cell a tick.
       *
       * SO THE GRAIN IS CARRIED ALONG THE EXIT IT IS ON. A mark for exit `e` is hashed at the
       * cell the ray on it came FROM - `t` cells back along `-\hat{u}` - so the pattern travels
       * outward at exactly `\bar{c}`, one cell a tick, which is what `MOVEMENT` says it does.
       * The motion is the transport rather than a flicker, and it is the transport's own speed.
       *
       * AND THE COLOUR IS THE DENSITY AND ONLY THE DENSITY, which is radially even about a
       * body, so a shell reads at one shade all the way round. What moves is WHICH cells carry
       * a mark; how bright they are does not move at all.
       */
      for (let k = 0; k < 2; k++) {
        const tot = k === 0 ? ch.one[i] : ch.two[i];
        if (tot <= 0) continue;
        const shade = lg(tot / peak, 0.0006);
        if (shade <= 0.02) continue;
        for (let e = 0; e < DEG; e++) {
          const u = GEO.U[e];
          const bx = Math.round(x - u[0] * t) + 8192, by = Math.round(y - u[1] * t) + 8192;
          let h = (Math.imul(bx, 0x27d4eb2d) ^ Math.imul(by, 0x165667b1)
            ^ Math.imul(e + 1 + k * 97, 0x9e3779b1)) >>> 0;
          h = Math.imul(h ^ (h >>> 16), 0x21f0aaad) >>> 0;
          h = Math.imul(h ^ (h >>> 15), 0x735a2d97) >>> 0;
          if (((h ^ (h >>> 15)) >>> 0) / 4294967296 > shade) continue;
          ctx.globalAlpha = Math.min(1, 0.25 + 0.75 * shade);
          ctx.fillStyle = k === 0 ? ONE : TWO;
          ctx.fillRect(cx + (x + u[0] * 0.3) * pz - pz * 0.2,
            cy + (y + u[1] * 0.3) * pz - pz * 0.2, pz * 0.4, pz * 0.4);
        }
      }
    }
    ctx.globalAlpha = 1;

    for (let k = 0; k < p.bodies; k++) {
      const bx = ch.marks[k * 5], by = ch.marks[k * 5 + 1];
      /* A BODY IS ONE PLACE and the ring is a MARKER for it rather than its extent - it
       * used to be drawn at the radius of a ball of cells, which is a size a hole does
       * not have. It is drawn wide enough to be seen and no wider. */
      ctx.strokeStyle = p.ring?.(k) ?? SEEN; ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(cx + bx * pz, cy + by * pz, 3.5 * pz, 0, 2 * Math.PI);
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
  const { N, C, VIEW, TICKS, BURN, GEO } = p;
  const at = (x: number, y: number) =>
    x < 0 || y < 0 || x >= N || y >= N ? -1 : y * N + x;
  /* what the meetings came to over a frame - on whole rays one tick of `destroyed` is a
   * speckle of ones and noughts, and the picture is what that comes to over the frame */
  const gone = new Float64Array(N * N);
  let w = continuous({ N, geometry: GEO, theory: p.theory, tags: p.tags });

  const lay = () => {
    w = continuous({ N, geometry: GEO, theory: p.theory, tags: p.tags });
    /* and it comes to its own state before anything is put in it - see `BURN` */
    for (let i = 0; i < BURN; i++) w.step();
    for (const b of p.place()) w.add(b);
    w.t = 0;
  };

  return {
    start: () => { lay(); },
    frame: (into: Record<string, Float32Array>) => {
      gone.fill(0);
      for (let i = 0; i < TICKS; i++) {
        if (p.spent?.(w.bodies)) { lay(); continue; }
        w.step();
        for (let c = 0; c < N * N; c++) gone[c] += w.destroyed[c];
      }
      /*
       * AND WHAT IS READ OUT IS AN EXCESS, not a total - the vacuum destroys everywhere and
       * inking that is a flat wash. The far corner is the level nothing has reached.
       */
      const far = at(C + VIEW, C + VIEW);
      const corner = far < 0 ? 0 : gone[far];
      for (let y = -VIEW; y <= VIEW; y++) for (let x = -VIEW; x <= VIEW; x++) {
        const c = at(C + x, C + y), i = p.box(x, y);
        if (c < 0) { into.one[i] = into.two[i] = into.gone[i] = 0; continue; }
        into.one[i] = w.blocks[c] ? -1 : w.from(0, c);
        into.two[i] = w.blocks[c] ? -1 : w.from(1, c);
        into.gone[i] = Math.abs(gone[c] - corner);
      }
      /*
       * AND WHAT THE VACUUM DESTROYS ANYWAY IS CARRIED WITH THE FRAME, because the excess has
       * to be drawn against something that is THERE and not against the largest excess in the
       * picture. Before the bodies have reached anywhere the excess is nothing but the
       * arithmetic's own last digit, and dividing it by its own maximum puts that on the
       * screen at full brightness - which is the blaze of noise the first frames were.
       */
      into.marks[5 * p.bodies] = corner;
      w.bodies.forEach((b, k) => {
        if (k >= p.bodies) return;
        into.marks[k * 5] = b.x - C; into.marks[k * 5 + 1] = b.y - C;
        into.marks[k * 5 + 2] = b.px; into.marks[k * 5 + 3] = b.py;
        into.marks[k * 5 + 4] = w.t;
      });
    },
  };
};

/** and a painter is that drawing, over whatever frames it was handed */
const shows = (p: Setup) => (from?: Played): Painter => {
  const w = from ?? { cached: false, at: () => ({}) } as Played;
  let f = 0;
  return {
    frame: (s: Surface) => {
      const ch = w.at(f);
      if ((ch as any).one) draw(p, s, ch, f * p.TICKS);
      f++;
    },
  };
};

/** ONE PANEL, FROM ONE ARRANGEMENT — which is the whole of what these files differ by */
export const panel = (p: Setup): Visual => {
  const BOX = 2 * p.VIEW + 1;
  return visual({
    id: p.id, width: p.width, height: p.height, frames: p.RUN, what: p.what,
    record: {
      stamp: p.stamp,
      channels: { one: BOX * BOX, two: BOX * BOX, gone: BOX * BOX, marks: 5 * p.bodies + 1 },
      ...world(p),
    },
    paint: shows(p),
  });
};
