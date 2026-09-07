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
 * IT RUNS ON `backends/CPU.continuous.ts`, which reads the line off `G` and integrates it
 * in one file, so the reading and the running cannot disagree.
 * Every rate, gate, degree, sign and ledger count in it is read off the derived terms and
 * evaluated against the constants `MEASURE` published off the closed theory. Change a rule and
 * the equation changes and the panel follows, with nothing here edited.
 */

import { Painter, Played, Surface, visual } from "./CANVAS.ts";
import { continuous } from "../backends/CPU.continuous.ts";
import { GEOMETRIES } from "../lib/Local.ts";
import { G } from "../theories/G/G.ts";

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
 *
 * AND WHAT IS SHOWN HAS TO REACH PAST WHERE THE TURN HAPPENS. It does not happen between them:
 * the field is retarded, so a body feels the other's record from where the other WAS, and it
 * sails straight through the meeting and hooks over on the FAR side - measured, at forty-one
 * cells out. At `46` that hook was in the last few cells of the picture and what followed it
 * was off the edge, which is why the arc could not be seen however hard it was. At `60` the
 * hook is at two thirds of the way out and the forty cells the body travels on its new heading
 * are all in the frame.
 */
const VIEW = 60, MARGIN = 30;
const N = 2 * (VIEW + MARGIN) + 1, C = (N - 1) / 2, GAP = 30;
/*
 * AND A BODY HAS TO BE BIG ENOUGH TO HEAR THE PULL OVER ITS OWN RADIATION.
 *
 * `propel` counts both halves of what a body does - every ray it sends costs the recoil, every
 * ray that arrives is caught - and for one at rest they cancel to `10^{-8}`. On WHOLE rays what
 * is left is the fluctuation: a body of thirteen cells sends about seventy-five rays a tick out
 * of eighty-eight ways out, so its own recoil cancels to `\sqrt{75}`, which is nine. The pull
 * goes as `\bar{m}\bar{m}'` - a product of AREAS - and the noise as `\sqrt{A}`, so what a
 * body can hear goes as `A^{3/2}` and a radius of two is on the wrong side of it.
 */
const R = 6;

/*
 * NOTHING IS HANDED TO THE BACKEND BUT THE THEORY AND THE LATTICE.
 *
 * IT USED TO PASS `law`'s SYMBOLS - `\rho`, `F`, `\omega`, `\lambda`, the numbers `Prove`
 * settles by algebra. Two things then had an opinion about one number and could differ; a
 * panel drawn from the wrong one says nothing and says it confidently. `Field` counts what the
 * rules fix - a rate is one per match per tick, `DEG` is the geometry's, `\rho` and `n_{f}`
 * are the cell's, `\omega` is the share of steps that found room - and arrives at the rest by
 * being run. Measured, the fold record it comes to is `5.1909` against the `5.190893` the
 * prover derives, which is the two agreeing rather than one being told.
 */

/*
 * THE VACUUM IS NOT SEEDED, IT IS LET RUN — because its stillness is an AGGREGATE and not a
 * local fact.
 *
 * IT USED TO BE A NUMBER. One 3x3 wrapped cell was stepped nine hundred times and the density
 * and the fold record it came to were painted onto every cell of the box. "A uniform field
 * moves onto itself" - and that is exactly the trouble: on a wrapped cell every point is a
 * copy of every other, so no point can be out of step with its neighbour and the alternation
 * the rules run on has nowhere to live. A point empties, splits, and empties again; its
 * neighbour is doing the same thing half a tick away; the SUM over the box is flat and no
 * single point is. Painting the sum onto every point puts the aggregate where the dynamics go.
 *
 * SO THE MEDIUM MAKES ITSELF. The box starts with nothing in it and the rules are run until
 * what they build stops drifting - which is what a vacuum IS here, the state (G/2) and (G/1)
 * come to between them - and only then are the bodies put in. Nothing is painted, nothing is
 * assumed uniform, and a ray a source sends crosses a medium that is somewhere in its own beat
 * rather than one holding still at its own average.
 */
const BURN = 400;

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
 *
 * AND IT IS WHAT DECIDES THE ARC, because it is what `\bar{m}\bar{m}'` is a product of. At a
 * half these two barely notice each other - THREE DEGREES over the whole encounter, which is
 * the straight line the panel was drawing. Near the ceiling they turn a right angle.
 */
const MX = 0.85;
/**
 * TICKS IN EVERY FRAME — how much world goes by in one, which is how much there is to watch.
 *
 * `RENDER` plays a visual at twenty-four frames a second and `RUN` is how many frames there
 * are, so the film is `RUN/24` seconds whatever happens inside it. THIS IS THE ONLY DIAL THAT
 * PUTS MORE IN IT: raising the bodies' speed moves them across a fixed number of ticks, and
 * cutting the frame count shortens the film, and neither of those is more world.
 *
 * SO IT IS ALSO WHAT HOLDS THE PACE ON THE SCREEN WHEN THE PHYSICS CHANGES. A body crosses
 * `V0 \times TICKS` cells in a frame and that is what a reader sees as speed; the encounter
 * below needs a faster body than the last one did, and two ticks a frame puts it back where it
 * was - `1.1` cells a frame against `1.35`.
 */
const TICKS = 2;
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
 * UNDER ABOUT A THREE QUARTERS THE SIGN COMES RIGHT AND THEY STILL GET AWAY, and both halves
 * of that matter. With the field going out at nearly twice the body's own pace, what it reads
 * where it stands is the OTHER body's record and it turns TOWARD it - `\bar{m}\bar{m}'`
 * attracting, which is what the force law says.
 *
 * AND WHAT IS LEFT IS A NARROW BAND BETWEEN NOTHING AND CAPTURE, which is not a nuisance of
 * the panel but what a retarded attraction does. Measured at this miss, all of them coming to
 * twelve cells at closest: `\bar{m}_{x}` a half turns them THREE DEGREES over the whole
 * encounter - a straight line with a kink in it, which is what this panel drew before and why
 * there was no arc to see. Four fifths and they never leave, caught at a dozen cells and
 * whirling. `0.85` and they turn EIGHTY-TWO DEGREES and go. Nine tenths and they are caught
 * again. The escapes and the captures are interleaved, which is what chaotic scattering IS,
 * and the way to a bigger arc is to sit in a band and not to lean on a dial.
 *
 * SO THE ARC AND THE PACE ARE NOT INDEPENDENT HERE. That band is at `0.55` and near the
 * emission ceiling; a body at `0.45` has nothing between three degrees and capture, so the
 * right angle costs a faster body, and `TICKS` is what pays it back on the screen.
 *
 * THE MISS DECIDES WHETHER IT IS A PASS OR A COLLISION. `\nabla n_{f}` is `0.0175` per tick
 * thirteen cells out and `0.37` at nine, so a wide miss goes by in a straight line and a
 * narrow one ends in a collision. Six apiece brings them to twelve at closest - and then, ONE
 * HUNDRED AND FIFTY TICKS LATER AND FORTY CELLS PAST EACH OTHER, each hooks through a right
 * angle and leaves across the way it came. That lateness is the retardation and not a fault:
 * what turns a body is the folding where it STANDS, and that is the other's record arriving,
 * not the other. It is `turns` doing all of it.
 */
const V0 = 0.3, IMPACT = 18;

/*
 * AND THE FILM IS ONE ENCOUNTER LONG — measured, not chosen. From where they start to the tick
 * both are past `VIEW` is two hundred and forty-five ticks at these numbers, and a hundred and
 * twenty-two frames of `TICKS` is the last one drawn wholly before it - so the loop is the
 * approach, the hook, and the leaving, once, and it ends on the tick before the guard fires
 * rather than on a frame of the world already laid again. At a hundred and fifty frames of three ticks it was two and a half encounters
 * and the seam in the middle was the world being torn down and laid again - a cut no dynamics
 * puts there. `gravity.rain` is cut to the same length because the two sit side by side on the
 * page and a reader watches them together.
 *
 * IT IS NOT DERIVED HERE and it cannot be: knowing it costs running the encounter, which is
 * the thing the recording exists to avoid doing twice. The guard in `frame` below is what
 * makes it safe - if a change to the physics makes the encounter longer the film simply ends
 * mid-swing, and if it makes it shorter the guard lays the world again rather than drawing a
 * body that has left.
 */
const RUN = 122;

/*
 * WHAT THE NUMBERS DEPEND ON, as one string. A film stamped otherwise is ignored and the world
 * is run live, so a change to the physics can never be drawn from a stale recording - and a
 * change to the colours never re-runs the physics, which is the whole point of keeping one.
 */
const STAMP = [GEO.name, N, R, GAP, MX, TICKS, V0, IMPACT, VIEW].join("/");
const BOX = 2 * VIEW + 1;
const CHANNELS = { one: BOX * BOX, two: BOX * BOX, gone: BOX * BOX, marks: 11 };
const box = (x: number, y: number) => (y + VIEW) * BOX + (x + VIEW);
/* what the meetings came to over a frame - see `frame` below */
const gone = new Float64Array(N * N);

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
  let w = continuous({ N, geometry: GEO, theory: G, tags: 2 });

  const place = () => {
    w = continuous({ N, geometry: GEO, theory: G, tags: 2 });
    /* and it comes to its own state before anything is put in it - see `BURN` above */
    for (let i = 0; i < BURN; i++) w.step();
    [-1, 1].forEach(sign => w.add(moving
      /* thrown in with MOMENTUM, which is what `propel` moves a body by - `speed` was a
       * heading carried at a rate, and neither is in the rules */
      ? { x: C + sign * 45, y: C + sign * IMPACT, hx: -sign, hy: 0,
          px: -sign * V0, py: 0, mx: MX, radius: R }
      : { x: C + sign * GAP / 2, y: C, mx: MX, radius: R }));
    w.t = 0;
  };

  return {
    start: () => { place(); },
    frame: (into: Record<string, Float32Array>) => {
      /*
       * AND WHAT IS DRAWN IS SUMMED OVER THE FRAME, because the aggregate is what is still and
       * a point is not. On whole rays a meeting either happened at a cell this tick or it did
       * not, so one tick of `destroyed` is a speckle of ones and noughts - the picture is what
       * that comes to over the ticks the frame stands for, which is the same quantity the
       * moment reading was an average of.
       */
      gone.fill(0);
      for (let i = 0; i < TICKS; i++) {
        if (moving && w.bodies.every(b => Math.hypot(b.x - C, b.y - C) > VIEW)) { place(); continue; }
        w.step();
        w.carry();
        for (let c = 0; c < N * N; c++) gone[c] += w.destroyed[c];
      }
      /*
       * AND WHAT IS READ OUT IS AN EXCESS, not a total - the vacuum destroys everywhere and
       * inking that is a flat wash. The far corner is the level nothing has reached.
       */
      const far = at(C + VIEW, C + VIEW);
      const corner = far < 0 ? 0 : gone[far];
      for (let y = -VIEW; y <= VIEW; y++) for (let x = -VIEW; x <= VIEW; x++) {
        const c = at(C + x, C + y), i = box(x, y);
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
      into.marks[10] = corner;
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

  /* what the vacuum destroys at one cell in a tick - the scale an EXCESS is an excess of */
  const ambient = Math.abs(ch.marks[10]) || 1e-30;
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
