/**
 * THE INNER SOLAR SYSTEM, MEASURED AND MODELLED SIDE BY SIDE — the control panel.
 *
 * SPARC and Genzel are the far field, where the model is being asked whether the universe
 * needs dark matter. THIS IS THE NEAR FIELD, where gravity is known to eleven figures and
 * there is nothing to argue about. If a theory of gravity does not put a planet round a star,
 * no rotation curve it fits means anything - so this panel is the control, and it is drawn
 * whether or not it flatters the model.
 *
 * THE NUMBERS ARE JPL'S. `data/solar-inner` is fetched from the Horizons ephemeris by
 * `tools/CATALOGUE.ts` - `GM`, the mean radius, and the J2000 semi-major axis, eccentricity
 * and sidereal period of each of the four terrestrial planets. Nothing here is typed, and the
 * left-hand half of the picture is those numbers and Kepler, with no model in it at all.
 *
 * THE RIGHT-HAND HALF IS THE SAME FIVE BODIES HANDED TO `G`, through the same backend every
 * other panel runs on. What it shows is what the rules do.
 *
 * ═══ AND THE UNITS ARE FORCED, WHICH IS THE FIRST THING TO SAY ═══════════════════════════
 *
 * `\bar{c}` is one cell a tick - that is `MOVEMENT`, not a choice - so fixing the size of a
 * cell fixes the length of a tick, and everything else follows with nothing left to tune:
 *
 *     one cell   = Mars' aphelion / VIEW           = 0.0278 au = 4.16e6 km
 *     one tick   = one cell / c                    = 13.9 seconds
 *     Earth's orbital speed 29.78 km/s             = 9.9e-5 \bar{c}
 *     Earth's year                                 = 2.3 MILLION ticks
 *
 * A PANEL IS TWO HUNDRED FRAMES. So a faithful Earth year is four orders of magnitude more
 * world than a film can hold, and the right-hand half runs the planets at `HASTE` times their
 * true speed to put one orbit inside it. That factor is the only thing scaled and it is
 * written on the picture, because a reader who is not told will read the right-hand half as a
 * prediction about seconds.
 *
 * AND THE MASSES CANNOT BE SCALED AT ALL, which is the second thing to say. In `G` a body's
 * mass is what it is joined on to the space by - `\bar{m} = \bar{m}_{x} \cdot ways` - and it
 * is the same number as its brightness. The Sun is 333,000 Earths; run the Sun at the largest
 * `ways` this backend can step and Earth lands at `0.2` connections, which is less than one.
 * So the planets are floored at the smallest mass that still moves, the true ratio is printed
 * beside the one drawn, and the picture is honest about being a caricature in that one axis.
 */
import { panel } from "./FIELD.ts";
import { GEOMETRIES } from "../lib/Local.ts";
import { measured } from "../lib/Measured.ts";
import { G } from "../theories/G/G.ts";

/* -- what JPL says ---------------------------------------------------------- */

const SOLAR = measured("solar-inner");
const NAMES = (SOLAR.header as any).names as string[];
const GM = SOLAR.columns.GM, A = SOLAR.columns.a, E = SOLAR.columns.e, P = SOLAR.columns.period;
const RAD = SOLAR.columns.radius;
/** the planets are every row with an orbit; the Sun is the one without */
const PLANETS = NAMES.map((_, i) => i).filter(i => P[i] > 0);
/** the one every reader has a feel for, used for the scale note underneath */
const EARTH = NAMES.indexOf("Earth");

const AU = 1.495978707e8;                       // km, the IAU definition
const CKM = 299792.458;                         // km/s, exact

/* -- the box, and what a cell and a tick then are --------------------------- */

const GEO = GEOMETRIES["square-8"], DEG = GEO.DEG;

/**
 * THE SAME PANEL AS `gravity.rain`, WITH THE SOLAR SYSTEM'S NUMBERS IN IT — every line of the
 * picture is `FIELD.ts`'s. What differs is where the bodies start, how big the box is, and
 * that the view does not open: `gravity.rain` watches a front leave a body, so its view
 * follows the front; here the arrangement is GIVEN - Mars is at fifty cells and stays there
 * or does not - so a view that opened would spend half the film hiding the thing being asked
 * about. The range is the system's own from the first tick.
 */
/*
 * AND EVERY LENGTH HERE IS IN `\bar{c}` — see `sized` in `RAIN.ts`. `VIEW` is how far the
 * picture reaches, as a distance; `ANGLES` and `PER_C` are the two resolutions the line is
 * integrated at, and neither may move the answer.
 */
/*
 * AND THE SOLAR PANEL IS THE ONE THAT NEEDS THE RESOLUTION, because what it is asking is
 * whether a track CLOSES - and a track that is a percent wrong per orbit is not a track. The
 * arrangement spans `VIEW` in `\bar{c}` and every length in it is a distance; `PER_C` is how
 * many cells make one, and it is the thing that decides how finely a curve can be followed.
 */
const VIEW = 24, MARGIN = 6, ANGLES = 96, PER_C = 3;
const N = 2 * (VIEW + MARGIN) * PER_C + 1, C = (N - 1) / 2;
/** the furthest any of them gets, which is what the picture has to hold */
const REACH = Math.max(...PLANETS.map(i => A[i] * (1 + E[i])));
const CELL_AU = REACH / VIEW;
const CELL_KM = CELL_AU * AU;
const TICK_S = CELL_KM / CKM;                  // `\bar{c}` is one cell a tick, so this follows

/** where a body sits, in cells, from its own semi-major axis */
const cells = (au: number) => au / CELL_AU;
/** and how fast it goes there, as a share of `\bar{c}` - `2\pi a/P`, off the data */
const speed = (i: number) => (2 * Math.PI * A[i] * AU) / (P[i] * 86400) / CKM;

/* and no burn-in: the medium is a coherent two-cycle from the first tick, so there is no
 * drift to wait out - see the note in `RAIN.ts` */
const TICKS = 6, RUN = 150, BURN = 0;
/**
 * HOW MUCH FASTER THE MODEL RUNS THE PLANETS THAN THEY GO — the one scaled quantity, and the
 * reason it has to exist is the units, which are forced:
 *
 *     one cell   = Mars' aphelion / VIEW      one tick = one cell / c
 *     Earth at 29.78 km/s                     = 9.9e-5 \bar{c}
 *     Earth's year                            = MILLIONS of ticks
 *
 * A film is nine hundred. So the planets are run at `HASTE` times their true speed, chosen so
 * the innermost gets round once inside it and no faster - any more and Mercury is at a
 * fraction of `\bar{c}`, where a body outruns its own field, and the panel would be showing
 * that instead.
 */
/**
 * ═══ AND THEY ARE LAUNCHED AT THE SPEED THIS MODEL'S OWN PULL HOLDS THEM AT ══════════════
 *
 * A circular orbit is `v^{2} = a\bar{r}`, and `a` is not Newton's here - it is what the medium
 * actually does, which is a thing to MEASURE rather than assume. Measured on this backend with
 * a test body dropped from rest beside a Sun of these numbers: `a = 1.21\cdot10^{-3}` c-bar a
 * tick squared at eight c-bar, so `v = \sqrt{a\bar{r}} = 0.098` c-bar a tick there.
 *
 * AND THE OTHERS FOLLOW KEPLER FROM IT, `v \propto 1/\sqrt{\bar{r}}`, which is the ratio JPL's
 * own semi-major axes already carry - so one measured number sets the scale and the arrangement
 * is the data's. At `0.098` c-bar a tick the innermost comes round in about five hundred ticks,
 * which is why the film is as long as it is.
 *
 * `HASTE` IS GONE AND IT HAD TO BE. It multiplied the planets' speed to fit an orbit in the
 * film while gravity went on propagating at `\bar{c}` - so the retardation was wrong by that
 * factor, and a body moving at a fraction of `\bar{c}` outruns the field that is meant to hold
 * it. What it bought was a picture of planets moving; what it cost was the only thing the panel
 * is about.
 */
const V_AT_8 = 0.098;
const orbital = (i: number) => V_AT_8 * Math.sqrt(8 / Math.max(1e-9, cells(A[i]) / PER_C));

/**
 * AND THE MASSES ARE A CARICATURE, WHICH THE PANEL HAD BETTER SAY.
 *
 * In `G` a body's mass is what it is joined on to the space by - `\bar{m} = \bar{m}_{x} \cdot
 * ways` - and it is the same number as its brightness. `radiate` walks every way out every
 * tick, so what can be run is bounded by the clock. The Sun gets the largest that steps in
 * reasonable time; the planets keep their true ratio to it until they hit the floor, which is
 * the least a body can be joined on by and still be a body.
 */
/*
 * AND HOW OFTEN THEY ANNOUNCE THEMSELVES — `\bar{m}_{x}`, which is a rate and a ceiling.
 *
 * One is a way lit every tick, which is `\bar{c}`, and a body at the ceiling is a hole that
 * swallows its own neighbourhood: with a hole's `ways/DEG` ways down each exit, `\bar{m}_{x} = 1`
 * on tens of thousands of ways leaves `keeps` near nought for `\bar{c}` all around it. Ordinary
 * matter is nowhere near the ceiling, so the SYSTEM is put in the band where the medium feels a
 * body without being swallowed by it, and what is kept exact is the RATIO between them - which
 * is the only thing about these masses that is JPL's rather than the panel's.
 */
/**
 * ═══ WHAT A BODY IS: HOW BIG IT IS, AND HOW OFTEN IT SAYS SO ═════════════════════════════
 *
 * `\bar{m} = \bar{m}_{x}\cdot ways`, and the two are different facts about it:
 *
 *   `ways`         HOW MUCH SPACE IT IS JOINED TO - its area, which is what a hole's
 *                  connections ARE. So it goes as `R^{D - 1}`, the shell it announces through,
 *                  and the catalogue has the radii.
 *   `\bar{m}_{x}`   HOW OFTEN IT ANNOUNCES ITSELF down one of them, a rate between nought and
 *                  `\bar{c}`. The more mass, the more it pulses.
 *
 * AND THE TWO TOGETHER ARE THE DATA'S, WITH NOTHING LEFT OVER. Given `\bar{m}` goes as `GM` and
 * `ways` as `R^{2}`, the rate is `GM/R^{2}` - which is SURFACE GRAVITY, and nobody put it there:
 * it is what is left of a mass once its area is taken out of it, and it is the right thing for
 * "how often does a body announce itself per unit of the face it announces through".
 *
 * SO THE SUN PULSES HARDEST AND MERCURY IS THE WIDEST FOR ITS MASS, both off JPL's own numbers,
 * and the only choice the panel makes is where to put the Sun: at the top of the band where the
 * medium feels a body without being swallowed by it, since `\bar{m}_{x} = 1` is a hole light
 * cannot leave.
 */
const PULSE = 0.05;
const WAYS = 4096;
/* the area it announces through, as a share of the Sun's, and the rate is what is left */
const area = (i: number) => Math.pow(RAD[i] / RAD[0], 2);
const ways = (i: number) => Math.max(64, Math.round(WAYS * area(i)));
const grav = (i: number) => (GM[i] / GM[0]) / area(i);
const pulse = (i: number) => Math.min(1, PULSE * grav(i) / grav(0));

const PIX = PER_C, R = VIEW * PIX, BOX = 2 * R + 1;
/* indexed in PIXELS - `1/PER_C` of a `\bar{c}`, which is the resolution the line was
 * integrated at, so the picture shows what was computed rather than every `K`th cell of it */
const box = (x: number, y: number) => (y + R) * BOX + (x + R);

export default [
  panel({
    id: "solar.inner", width: 900, height: 460,
    what: "the near field as a control: JPL's own inner solar system in the same panel the " +
      "pair visuals are - what each body puts out, and where space is destroyed. `\\bar{c}` " +
      "is one cell a tick, so the cell fixes the tick and Earth's year comes to millions of " +
      "them; the planets are run fast and the ratio is on the picture",
    GEO, DEG, VIEW, MARGIN, N, C, TICKS, RUN, BURN, tags: 2, box, theory: G,
    A: ANGLES, K: PER_C, PIX,
    /* the Sun is one body and the four planets are the other population - `\bar{m}\bar{m}'`
     * is a product of two, and four planets are the same kind of thing */
    bodies: 1 + PLANETS.length,
    /* the view does not open: `GAP` is the whole system, so `view` is flat at `VIEW` */
    GAP: 2 * VIEW,
    view: () => VIEW,
    /*
     * AND EACH BODY IS THE COLOUR IT IS. The Sun is what the panel is about, so its field is
     * white; the planets share the other population and are told apart by their rings, in the
     * colours they are actually seen in - Mercury grey, Venus cream, Earth blue, Mars red.
     */
    tint: ["#ffffff", "#8ab4ff"],
    ring: (k) => ["#f0b429", "#9a9a9a", "#e8d3a0", "#4a90e2", "#c1440e"][k] ?? "#eef0f5",
    stamp: [GEO.name, N, VIEW, RUN, TICKS, V_AT_8, WAYS, PULSE,
      PLANETS.map(i => `${NAMES[i]}:${A[i].toFixed(4)}:${ways(i)}:${pulse(i).toExponential(2)}`).join(",")]
      .join("/"),
    place: () => [
      /*
       * THE SUN IS HELD, because the panel is about whether a planet goes round it. `Source`
       * carries `moves` for exactly this - "whether the vacuum is allowed to carry it
       * anywhere" - and letting it wander would put the Sun's own drift into every planet's
       * track with no telling which was which.
       */
      { x: 0, y: 0, mx: pulse(0), ways: ways(0), moves: false, tag: 0 },
      ...PLANETS.map(i => ({
        /* started at perihelion, where its speed is the one the data gives, and moving
         * tangentially - `propel` advances at `p/\bar{m}`, so a speed is a momentum of
         * `v\bar{m}` */
        x: cells(A[i] * (1 - E[i])), y: 0, mx: pulse(i), ways: ways(i), tag: 1, moves: true,
        px: 0, py: -orbital(i) * pulse(i) * ways(i),
      })),
    ],
  }),
];
