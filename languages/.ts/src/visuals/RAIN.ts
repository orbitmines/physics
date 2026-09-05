/**
 * THE DEFICIT, WITH THE STATIC TAKEN OUT — and it propagates at c̄ where you can see
 * it do it.
 *
 * Every other gravity panel in this arc runs the stochastic vacuum, where creation
 * fires on a coin and the shortfall has to be dug out of shot noise by averaging over
 * hundreds of ticks. That is the honest picture of the model and it is nearly
 * unreadable: at one tick the force is invisible, and at two thousand the arrow is
 * still only three sigma.
 *
 * THE VACUUM IS CONTINUOUS AND THE PARTICLES ARE NOT, and that split is the whole of the
 * fix. The archive's panel ran a shadow in a FROZEN medium - one ray out of every exit at
 * t = 0 and no creation ever after - so every ray traced back to the initial condition and
 * the shortfall spread because nothing was refilling behind it. That reads well and it is
 * this theory with (G/2) switched off.
 *
 *   THE VACUUM IS A DENSITY. `v[c·DEG + e]` is the chance that exit `e` of point `c` is lit,
 *     and it runs the three rules as one balance: (G/1) takes facing pairs off an edge,
 *     (STREAM) moves what is left one cell, and (G/2) lights every exit of a point in
 *     proportion to its being neutral. It has to be a density, because a lattice of whole
 *     rays run deterministically locks into a two-cycle - all full, then all annihilated -
 *     and never finds a fixed point at all. As a field it settles on its own, from empty, to
 *     the occupancy the balance solves for. NOTHING ABOUT `DEG` IS VISIBLE IN IT: it is a
 *     continuum and it is drawn as one.
 *   THE PARTICLES ARE WHOLE RAYS. `q[c·DEG + e]` is a COUNT - one thing or no things, with a
 *     heading, taking one cell a tick. There is no third of a ray on this lattice.
 *   AND THEY INTERACT. A particle is annihilated by the vacuum coming the other way, at the
 *     rate (G/1) gives for a facing pair, which is bilinear in the two. Whole particles go,
 *     never fractions of one: the rate is accumulated per exit and a ray is taken when the
 *     accumulator has earned it, so the vacuum thins the rain without the rain ever being
 *     anything but rays.
 *
 * SO THE DEFICIT GROWS AT c̄, EXACTLY, AND IT GROWS AS A CIRCLE. Nothing on this lattice
 * moves but rays and rays move one cell a tick, so news of a body cannot be anywhere but
 * inside `r = t` - and it is not slower either, because the leading rays are never
 * annihilated: there is nothing coming the other way yet.
 *
 * AND THE VIEW GOES WITH IT. A front that leaves the frame cannot be watched leaving it, so
 * the view is the front's own radius plus a margin at every tick and the lattice is sized so
 * it has somewhere to go. What changes between frames is the SCALE, which is the thing being
 * claimed.
 *
 * NOTHING WAS TUNED TO GET ANY OF THIS. `\nu` multiplies a rule that fires on every neutral
 * point every tick; `F` is not a number to pick because whether two rays face each other is
 * decided by their headings; and the settled occupancy is
 *
 *     \rho_{\infty} = 0.42805 at DEG = 8, D = 2   - the fold balance's own root
 *
 * which the medium arrives at on its own, at every `K`, from a fixed point this file solves
 * for one point rather than by running four hundred ticks of moving a constant around.
 *
 * AND IT IS DRAWN ON A LOG SCALE, because the falloff is a power law. A 1/r² field
 * inked linearly is a white dot and a black field: the body saturates and everything
 * past a few cells is under the first quantisation step, so the shell structure the
 * panel is about cannot be seen. On a log scale each halving is the same number of
 * shades and the profile above reads as the near-straight line it is.
 *
 * PORTED WITHOUT REACT and put onto the theory's own backend, and then made a picture of the
 * thing the force law is actually about: TWO bodies.
 *
 * A SINGLE BODY CANNOT HAVE GRAVITY HERE, and the law says so in its own front - `F_{g}` goes
 * as `\bar{m}\bar{m}'`, a PRODUCT, because a ray needs something to annihilate against and
 * one body's rays have only the vacuum. So the panel is two bodies and the two halves of what
 * happens between them:
 *
 *   THE RAYS EXPANDING. Each body lights its exits alike and what it sends dilutes over the
 *     shell as it goes - measured on this arrangement, the slope near a body is about -1.7
 *     against the `-\paren{D - 1} = -1` a shell gives in the plane, the rest being what the
 *     vacuum takes on the way. They are drawn in the two bodies' own colours, and they are
 *     drawn as RAYS: `n[c·DEG + k]` is the chance that exit is lit and what is lit is one
 *     whole ray, so the ink is a sample of it rather than a wash.
 *   AND WHERE SPACE IS DESTROYED, which is what gravity IS in these rules - (G/1) leaves one
 *     neutral point where two were. The panel inks the space ledger going down, and picks out
 *     the part of it that is one body's ray against the OTHER'S: measured, that is six orders
 *     of magnitude stronger on the line joining them than off to the side. It is the
 *     `\bar{m}\bar{m}'` cross term of a quadratic, arising rather than being put in.
 *
 * THE VACUUM IS DOING IT TOO, everywhere, all the time - most of the destruction in the panel
 * is the medium against itself. That is why the two are inked apart rather than summed: the
 * ambient rate is the background the pair term has to be seen against, and hiding it would be
 * drawing a two-body effect as though nothing else were happening.
 *
 * IT RUNS ON `backends/Field.ts`, which integrates the equation `Continuum` reads off `G`.
 * Every rate, gate, degree, sign and ledger count in it is read off the derived terms and
 * evaluated against the constants `MEASURE` published off the closed theory. Change a rule and
 * the equation changes and the panel follows, with nothing here edited.
 */

import { Painter, Played, Surface, visual } from "./CANVAS.ts";
import { field, Symbols } from "../backends/Field.ts";
import { GEOMETRIES } from "../lib/Local.ts";
import { G } from "../theories/G/G.ts";
import { measured } from "./DATA.ts";

const BACK = "#08090d";
const SEEN = "#eef0f5";
/* one colour per body, and one for where their rays put each other out */
const ONE = "#4aa8eb", TWO = "#8bd48b", GONE = "#eb964a", PAIR = "#eef0f5";

const GEO = GEOMETRIES["square-8"], DEG = GEO.DEG;
/*
 * AND THE LATTICE REACHES BEYOND WHAT IS DRAWN, so nothing that leaves the picture comes back
 * into it - but only as far as it must. `VIEW` is the furthest the panel ever shows; the
 * margin is what a body needs to get out of sight before an encounter is called over, and a
 * ray that goes past the edge is gone rather than wrapped. NINETY CELLS OF IT WAS A GUESS and
 * cost what a guess costs: the medium is stepped over every cell of the box whether it is
 * drawn or not, so twice the margin is four times the run.
 */
const VIEW = 46, MARGIN = 30;
const N = 2 * (VIEW + MARGIN) + 1, C = (N - 1) / 2, GAP = 30, R = 2, RUN = 150;

const SYMBOLS = (): Symbols => {
  const h = measured("law").header as any;
  return { ...(h.symbols as Symbols), DEG };
};

/* the settled vacuum, which is a question about ONE point - a uniform field moves onto itself */
const settled = () => {
  /* a periodic cell, because "the settled vacuum" is what a UNIFORM medium comes to */
  const one = field({ symbols: SYMBOLS(), N: 3, geometry: GEO, theory: G, wraps: true });
  for (let i = 0; i < 900; i++) one.step();
  return { rho: one.rho(4), nf: one.ledger.folds?.[4] ?? 0 };
};

/*
 * AND THE BOX HAS AN EDGE HERE TOO — this was still the wrapping one while the backend's had
 * been opened, so the bodies and everything read through it still lived on a torus: a body
 * walking off one side reappeared on the other, and each was lit from behind by its own
 * radiation come round the world.
 */
const at = (x: number, y: number) =>
  x < 0 || y < 0 || x >= N || y >= N ? -1 : y * N + x;

/**
 * THE PICTURE, ONCE — because the two panels below differ in what the bodies DO and not in
 * what is drawn of them. Where they are is handed in rather than assumed, which is the whole
 * of the difference between a pair held apart and a pair let go.
 */
/*
 * HOW OFTEN A CELL OF A BODY ACTIVATES ONE OF ITS EXITS — `\bar{m}_{x}`, the article's own
 * quantity, "a number between 0 and `\bar{c}`". It is PER NEIGHBOUR, so what a cell sends
 * altogether in a tick is that times its `DEG` ways out, and `\bar{m}_{x} = 1` is the ceiling:
 * a cell lighting every exit every tick, which is not what ordinary matter does.
 */
const MX = 0.5;
/**
 * TICKS IN EVERY FRAME — how much world goes by in one, which is how much there is to watch.
 *
 * `RENDER` plays a visual at twenty-four frames a second and `RUN` is how many frames there
 * are, so the film is `RUN/24` seconds whatever happens inside it. THIS IS THE ONLY DIAL THAT
 * PUTS MORE IN IT: raising the bodies' speed moves them across a fixed number of ticks, and
 * cutting the frame count shortens the film, and neither of those is more world.
 */
const TICKS = 3;
/*
 * HOW FAST THEY ARE THROWN, AND HOW WIDE THEY MISS BY — the two things a scattering has to be
 * told and the only two, because everything after is the rules'.
 *
 * AND THE SPEED IS A FRACTION OF `\bar{c}`, WHICH IS ONE CELL A TICK. That is not a detail of
 * the panel, it is `MOVEMENT`: nothing on this lattice goes faster than a cell a tick, so a
 * body at `0.9` is at nine tenths of the speed of light and its own field can barely get away
 * from it. `EMISSION` says the same thing from the other side - it is gated on `not(moving)`,
 * so a body moving on `\beta` of its ticks shines on `1 - \beta` of them, and at `0.9` it
 * shines at a tenth. What it then reads where it stands is mostly its own wake, lagging behind
 * it, and a wake behind you pushes you ON: measured, a pair at `0.9` was deflected APART, the
 * turning starting only after they had passed and still going at a hundred cells' separation.
 * That was never gravity - it was a body outrunning what it had emitted.
 *
 * AT A HALF THE SIGN COMES RIGHT AND THEY STILL GET AWAY, and both halves of that matter.
 * With the field going out at twice the body's own pace, what it reads where it stands is the
 * OTHER body's record and it turns TOWARD it - `\bar{m}\bar{m}'` attracting, which is what the
 * force law says. Slower than about three tenths the turn has time to come all the way round
 * and they capture each other instead, bound at a dozen cells and never leaving; slower again
 * and there is nothing wrong, only nothing to watch. THE DEFLECTION IS TEN DEGREES at a miss
 * of six apiece, which is a real scattering and a modest one, and it is not dressed up.
 *
 * THE MISS DECIDES WHETHER IT IS A PASS OR A COLLISION. `\nabla n_{f}` is `0.0175` per tick
 * thirteen cells out and `0.37` at nine, so a wide miss goes by in a straight line and a
 * narrow one ends in a collision. Six apiece brings them to about ten at closest, where each
 * is turned through a hundred and thirty degrees and they leave on new headings - which is a
 * slingshot, and it is `turns` doing all of it.
 */
const V0 = 0.5, IMPACT = 6;

/*
 * WHAT THE NUMBERS DEPEND ON, as one string. A film stamped otherwise is ignored and the world
 * is run live, so a change to the physics can never be drawn from a stale recording - and a
 * change to the colours never re-runs the physics, which is the whole point of keeping one.
 */
const STAMP = [GEO.name, N, R, GAP, MX, TICKS, V0, IMPACT, VIEW].join("/");
const BOX = 2 * VIEW + 1;
const CHANNELS = { one: BOX * BOX, two: BOX * BOX, gone: BOX * BOX, marks: 10 };
const box = (x: number, y: number) => (y + VIEW) * BOX + (x + VIEW);

/**
 * THE WORLD OF ONE PANEL — and every derived thing in it is the backend's.
 *
 * `Field` owns what a source is and what it does: laying it in, handing back what arrived,
 * `propel`'s measured force, `turns`' bend, and displacing the medium on a step. All of it was
 * written in a drawing first and all of it was wrong there - a body pushed by its own rays,
 * then by its own wake, then flung apart by the impulse of its own step. It is one place to be
 * right now, and a panel only says where the bodies start and reads what happened.
 */
const world = (moving: boolean) => {
  let level = { rho: 0, nf: 0 };
  let w = field({ symbols: SYMBOLS(), N, geometry: GEO, theory: G, tags: 2 });

  const place = () => {
    w = field({ symbols: SYMBOLS(), N, geometry: GEO, theory: G, tags: 2 });
    for (let c = 0; c < N * N; c++) {
      for (let k = 0; k < DEG; k++) w.n[c * DEG + k] = level.rho;
      if (w.ledger.folds) w.ledger.folds[c] = level.nf;
    }
    [-1, 1].forEach(sign => w.add(moving
      ? { x: C + sign * 45, y: C + sign * IMPACT, hx: -sign, hy: 0, mx: MX, radius: R, speed: V0 }
      : { x: C + sign * GAP / 2, y: C, mx: MX, radius: R }));
    w.t = 0;
  };

  return {
    start: () => { level = settled(); place(); },
    frame: (into: Record<string, Float32Array>) => {
      for (let i = 0; i < TICKS; i++) {
        if (moving && w.bodies.every(b => Math.hypot(b.x - C, b.y - C) > VIEW)) { place(); continue; }
        w.step();
        w.carry();
      }
      /*
       * AND WHAT IS READ OUT IS AN EXCESS, not a total - the vacuum destroys everywhere and
       * inking that is a flat wash. The far corner is the level nothing has reached.
       */
      const far = at(C + VIEW, C + VIEW);
      const corner = far < 0 ? 0 : w.destroyed[far];
      for (let y = -VIEW; y <= VIEW; y++) for (let x = -VIEW; x <= VIEW; x++) {
        const c = at(C + x, C + y), i = box(x, y);
        if (c < 0) { into.one[i] = into.two[i] = into.gone[i] = 0; continue; }
        into.one[i] = w.blocks[c] ? -1 : w.from(0, c);
        into.two[i] = w.blocks[c] ? -1 : w.from(1, c);
        into.gone[i] = Math.abs(w.destroyed[c] - corner);
      }
      w.bodies.forEach((b, k) => {
        into.marks[k * 5] = b.x - C; into.marks[k * 5 + 1] = b.y - C;
        into.marks[k * 5 + 2] = b.px; into.marks[k * 5 + 3] = b.py;
        into.marks[k * 5 + 4] = w.t;
      });
    },
  };
};

/**
 * THE PICTURE, FROM THE CHANNELS AND FROM NOTHING ELSE — so it can be changed without the
 * world being run again, which is the whole point of recording one.
 */
const draw = (s: Surface, ch: Record<string, Float32Array>, t: number) => {
  const { ctx, width, height: H } = s;
  ctx.clearRect(0, 0, width, H);
  ctx.fillStyle = BACK; ctx.fillRect(0, 0, width, H);

  const TOP = 14, BOT = 14, GAP2 = 10;
  const cw = (width - GAP2) / 2;
  const side = Math.min(cw, H - TOP - BOT);
  /* the view opens with the field, so what is spreading stays in the picture */
  const view = Math.max(GAP / 2 + 6, Math.min(VIEW, GAP / 2 + 6 + t / TICKS));
  const pz = side / (2 * view + 1);
  const top = TOP + Math.max(0, (H - TOP - BOT - side) / 2);

  /*
   * THE LOG SCALE, ON BOTH HALVES AND FOR THE SAME REASON: what is drawn falls off as a power
   * of the distance, so linearly the body saturates and everything past a few cells is under
   * the first shade. A thousandth of the peak is still visible on this one.
   */
  const lg = (v: number, floor: number) =>
    v <= 0 ? 0 : Math.log(1 + v / floor) / Math.log(1 + 1 / floor);

  let peak = 1e-30, extra = 1e-30;
  for (let y = -view; y <= view; y++) for (let x = -view; x <= view; x++) {
    const i = box(x, y);
    if (ch.one[i] < 0) continue;
    peak = Math.max(peak, ch.one[i] + ch.two[i]);
    extra = Math.max(extra, ch.gone[i]);
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
        const amb = lg(ch.gone[i] / extra, 0.002);
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

    for (let k = 0; k < 2; k++) {
      const bx = ch.marks[k * 5], by = ch.marks[k * 5 + 1];
      ctx.strokeStyle = SEEN; ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(cx + bx * pz, cy + by * pz, (R + 0.9) * pz, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }
};

/** and a painter is that drawing, over whatever frames it was handed */
const shows = (moving: boolean) => (from?: Played): Painter => {
  const w = from ?? { cached: false, at: () => ({}) } as Played;
  let f = 0;
  return {
    frame: (s: Surface) => {
      const ch = w.at(f);
      if ((ch as any).one) draw(s, ch, f * TICKS);
      f++;
    },
  };
};

export default [
  visual({
    id: "gravity.rain", width: 900, height: 460, frames: RUN,
    what: "two bodies, because one cannot have gravity: what each sends out expanding over " +
      "the shell, and where space is destroyed - with the part of it that is one body's rays " +
      "against the other's picked out, which is what \\bar{m}\\bar{m}' counts",
    record: { stamp: STAMP, channels: CHANNELS, ...world(false) },
    paint: shows(false),
  }),
  visual({
    id: "gravity.pull", width: 900, height: 460, frames: RUN,
    what: "two sources thrown past each other and bent by `turns` - each asking only what is " +
      "folded where it stands - with the destruction between them swelling as they close, " +
      "which is the pair term the force law is a product for",
    record: { stamp: STAMP, channels: CHANNELS, ...world(true) },
    paint: shows(true),
  }),
];
