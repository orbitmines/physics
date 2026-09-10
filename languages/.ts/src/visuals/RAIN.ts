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

import { panel } from "./FIELD.ts";
import { GEOMETRIES } from "../lib/Local.ts";
import { G } from "../theories/G/G.ts";

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
/*
 * AND THE PICTURE IS THE SIZE OF THE THING IN IT — which is a good deal smaller than it was.
 *
 * SIXTY CELLS AND THIRTY APART WAS SIZED FOR A FIELD THAT REACHED. Measured now, with a body
 * held still and emitting on every tick, what it puts out reaches a STATIONARY profile by tick
 * fifteen and never gets further: its own rays read `22, 8, 0.4, 0.014, 0.001, 0` at radius
 * `1, 3, 6, 10, 15, 22`. Six cells, and the total flat for a hundred ticks after.
 *
 * SO AT THIRTY APART THE TWO FIELDS NEVER TOUCH, and this panel is ABOUT them touching - "the
 * part of it that is one body's ray against the OTHER's, which is what `\bar{m}\bar{m}'`
 * counts". The white it is drawn in came out as a single pixel of luck at the midpoint. At ten
 * apart the two overlap where they are strongest, which is where a cross term can be seen at
 * all, and sixty cells of view for a six-cell field was ninety per cent empty box.
 *
 * THIS IS THE PANEL BEING SIZED TO THE PHYSICS, not the physics to the panel: nothing about
 * what the bodies ARE has changed, only how far apart they are put and how much of the box is
 * shown.
 */
const VIEW = 20, MARGIN = 8;
const N = 2 * (VIEW + MARGIN) + 1, C = (N - 1) / 2, GAP = 20;
/*
 * HOW MANY NEIGHBOURS THE HOLE HAS — `l.DEG`, its own, and the only thing that makes it heavy.
 *
 * A SOURCE IS NOT A BALL OF CELLS. It was one here: a radius of six, a hundred and thirteen
 * cells, and a mass that went as its AREA - a body twice as heavy drawn twice as wide. The
 * lattice is an abstraction and a hole's connections are its own, so what it weighs is what it
 * is joined on to: `\bar{m} = \bar{m}_{x} \cdot l.DEG`, at one point, however many ways out
 * that point has.
 *
 * AND IT IS WHAT KEEPS IT SLOWER THAN ITS OWN FIELD. `propel` advances at `p/\bar{m}`, and
 * what arrives at a body is single rays: one caught is one unit of momentum, so a light body
 * is thrown a whole cell a tick by one of them. Measured at `\bar{m} = 8` a body put down at
 * rest left at `\bar{c}` on its first tick and never gravitated again. At `2\cdot10^{3}` its
 * momentum settles round `45` and it wanders at `0.02\bar{c}`, which is a body.
 */
const WAYS = 2_000;

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
 * THE VACUUM NEEDS NO WARMING UP, BECAUSE IT IS ALREADY WHAT IT SETTLES TO — and that is what
 * `\bar{c} = one cell a tick` came to cost.
 *
 * FOUR HUNDRED TICKS STOOD HERE. The reasoning was sound for the medium it was written for:
 * "the box starts with nothing in it and the rules are run until what they build stops
 * drifting - which is what a vacuum IS here, the state (G/2) and (G/1) come to between them",
 * and measured, that came to `\rho \approx 0.2` with a fold record around five.
 *
 * THERE IS NO DRIFT LEFT TO WAIT OUT. With every rule reading the tick it opened with, the
 * medium is a two-cycle from the first tick: every point splits, and the tick after, every one
 * of them annihilates. Measured on an empty bounded box, wall and all, over six hundred ticks -
 * `n_{f} = 0` at the moment rays move and `\rho = 1` at every point of it, from tick one and
 * for ever. THAT is the vacuum, so a burn-in warms nothing and only costs the recording four
 * hundred ticks of it.
 */
const BURN = 0;

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
const V0 = 0.3, IMPACT = 6;

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
const STAMP = [GEO.name, N, WAYS, GAP, MX, TICKS, V0, IMPACT, VIEW].join("/");
const BOX = 2 * VIEW + 1;
const box = (x: number, y: number) => (y + VIEW) * BOX + (x + VIEW);

/**
 * THE BOX AND THE FRAME A PANEL OF A GIVEN REACH NEEDS — because the two panels below no
 * longer want the same reach, and everything about the size follows from one number.
 */
/**
 * AND EVERY LENGTH A PANEL STATES IS IN `\bar{c}`, WHICH IS WHAT A LENGTH IS.
 *
 * `VIEW` and `MARGIN` are how far the picture reaches and how much world is kept out of sight
 * past it, and both are distances - so many `\bar{c}`, the distance light goes in a tick. How
 * many CELLS that comes to is `K`, the line's spatial resolution, and it is not the panel's
 * business: refine it and the same picture comes out of a bigger array.
 */
/*
 * THE TWO RESOLUTIONS THE LINE IS INTEGRATED AT — `A` directions, `K` cells to one `\bar{c}`.
 * Neither may move the answer, so both are raised together and the medium is the same medium:
 * measured, the vacuum beats period 2 at `n_{f} = DEG/2` at every pair of them.
 */
const A = 96, K = 3;
const sized = (VIEW: number, MARGIN: number) => {
  const N = 2 * (VIEW + MARGIN) * K + 1, R = VIEW * K, BOX = 2 * R + 1;
  return { VIEW, MARGIN, N, C: (N - 1) / 2, A, K, PIX: K,
           /* indexed in PIXELS, which are `1/K` of a `\bar{c}` - the resolution the world was
            * worked out at, so nothing computed is thrown away on the way to the file */
           box: (x: number, y: number) => (y + R) * BOX + (x + R) };
};
/* the view is the front's own radius plus a margin, and the front goes at `\bar{c}` */
const opening = (VIEW: number) => (t: number) =>
  Math.max(GAP / 2 + 6, Math.min(VIEW, GAP / 2 + 6 + t));

/**
 * AND `gravity.rain` IS SIZED TO A FIELD THAT REACHES, WHICH IT DID NOT USED TO BE.
 *
 * This panel is one question - what a body puts into the space around it, expanding - and the
 * answer to it now travels. At `VIEW = 26` and `122` frames of two ticks the disc filled the
 * frame at tick twenty-six, on frame THIRTEEN, and the remaining hundred and nine frames were a
 * picture of a full box: measured off the recording, the disturbance to the destruction is
 * nought past `r = 13` on frame two, past `r = 20` on frame five, and flat everywhere from
 * frame fifteen on. Nothing was wrong with the physics - the front is at one cell a tick the
 * whole way - and the panel simply ran ten times longer than the thing it was showing.
 *
 * SO THE FILM IS THE GROWTH AND THE FRAME IS WHAT THE GROWTH REACHES. One tick a frame at one
 * cell a tick is one cell a frame, so a hundred frames is a hundred cells, and the view opens
 * with it and is always a little ahead. `gravity.pull` keeps its own numbers: it is an
 * ENCOUNTER, its bodies are placed at `VIEW - 4`, and widening its frame would be a different
 * scattering rather than the same one seen further out.
 */
/*
 * AND THE FILM IS AS LONG AS THE THING IT SHOWS. The two fields meet at the midpoint at
 * `GAP/2` ticks and the region where they do opens from there at `\bar{c}`, so the film has to
 * outlast the opening: `VIEW` ticks to reach the edge of the frame and as much again to watch
 * it fill. One tick a frame, so the frames ARE the ticks.
 */
/*
 * AND A FRAME SPANS THE MEDIUM'S OWN PERIOD, which is the least it can span and still be a
 * picture of a field rather than of a phase. `G`'s vacuum is a two-cycle - every point splits,
 * then every one of them annihilates - so one tick is one half of it. Two ticks a frame is one
 * beat, the parity divides out, and the film still advances one `\bar{c}` of front per frame.
 */
const RAIN_TICKS = 2, RAIN_RUN = 150;
/*
 * AND BOTH PANELS ARE THE SAME PANEL, SIZED THE SAME WAY. They differ in what the bodies DO -
 * held apart, or thrown past each other - and in nothing else, so a reader comparing them is
 * comparing two runs and not two drawings. It had its own `VIEW` and its own frame count, so
 * the two were drawn at different scales and different lengths and could not be read against
 * each other at all.
 */
const rain = sized(VIEW, MARGIN);
/**
 * AND WHAT THE TWO OF THEM DIFFER BY IS ONE LINE — whether the pair is held apart or thrown
 * past each other. Everything else about the picture is `FIELD.ts`'s and is the same drawing.
 */
const common = {
  GEO, DEG, GAP, bodies: 2, BURN, tags: 2,
  theory: G, width: 900, height: 460,
};

export default [
  panel({
    ...common, ...rain, TICKS: RAIN_TICKS, RUN: RAIN_RUN, view: opening(rain.VIEW),
    id: "gravity.rain",
    stamp: [STAMP, "held", rain.N, RAIN_TICKS, RAIN_RUN].join("/"),
    what: "two bodies, because one cannot have gravity: what each sends out expanding over " +
      "the shell, and where space is destroyed - with the part of it that is one body's rays " +
      "against the other's picked out, which is what \\bar{m}\\bar{m}' counts",
    /*
     * AND THEY ARE HELD, WHICH THIS PANEL HAS SAID IT DOES SINCE IT WAS WRITTEN AND DID NOT DO.
     *
     * The id, the stamp and the prose all say "held"; nothing set it, and `add` carries
     * `moves: b.moves ?? true`, so both bodies were free and drifted - which is why they came
     * out off-axis and unlike each other in a panel that places them symmetrically. The
     * measured populations are symmetric to a part in a thousand, so what the picture was
     * showing was the drift and not the field. `gravity.pull` is the one that moves.
     */
    place: () => [-1, 1].map(sign =>
      ({ x: sign * GAP / 2, y: 0, mx: MX, ways: WAYS,
         tag: (sign + 1) / 2, moves: false })),
  }),
  panel({
    ...common, ...rain, TICKS: RAIN_TICKS, RUN: RAIN_RUN, view: opening(VIEW),
    id: "gravity.pull", stamp: [STAMP, "thrown"].join("/"),
    what: "two sources thrown past each other and bent by `turns` - each asking only what is " +
      "folded where it stands - with the destruction between them swelling as they close, " +
      "which is the pair term the force law is a product for",
    /* thrown in with MOMENTUM, which is what `propel` moves a body by - and at a FRACTION OF
     * `\bar{c}`, so a speed asked for is a momentum of `v\bar{m}` */
    place: () => [-1, 1].map(sign =>
      ({ x: sign * (VIEW - 4), y: sign * IMPACT, mx: MX, ways: WAYS, moves: true,
         px: -sign * V0 * MX * WAYS, py: 0, tag: (sign + 1) / 2 })),
    /* an encounter is over when neither of them is in frame any more */
    spent: (at) => at.every(b => Math.hypot(b.x, b.y) > VIEW),
  }),
];
