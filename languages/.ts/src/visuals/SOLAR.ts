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
const HASTE = Math.round((2 * Math.PI * cells(A[PLANETS[0]])) /
  (speed(PLANETS[0]) * RUN * TICKS));

/**
 * AND THE MASSES ARE A CARICATURE, WHICH THE PANEL HAD BETTER SAY.
 *
 * In `G` a body's mass is what it is joined on to the space by - `\bar{m} = \bar{m}_{x} \cdot
 * ways` - and it is the same number as its brightness. `radiate` walks every way out every
 * tick, so what can be run is bounded by the clock. The Sun gets the largest that steps in
 * reasonable time; the planets keep their true ratio to it until they hit the floor, which is
 * the least a body can be joined on by and still be a body.
 */
const SUN_WAYS = 32768, FLOOR = 256;
const ways = (i: number) => Math.max(FLOOR, Math.round(SUN_WAYS * GM[i] / GM[0]));

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
    ring: (k) => k === 0 ? "#f0b429" : "#eef0f5",
    stamp: [GEO.name, N, VIEW, RUN, TICKS, HASTE, SUN_WAYS, FLOOR,
      PLANETS.map(i => `${NAMES[i]}:${A[i].toFixed(4)}:${GM[i].toExponential(3)}`).join(",")]
      .join("/"),
    place: () => [
      /*
       * THE SUN IS HELD, because the panel is about whether a planet goes round it. `Source`
       * carries `moves` for exactly this - "whether the vacuum is allowed to carry it
       * anywhere" - and letting it wander would put the Sun's own drift into every planet's
       * track with no telling which was which.
       */
      { x: 0, y: 0, mx: 1, ways: SUN_WAYS, moves: false, tag: 0 },
      ...PLANETS.map(i => ({
        /* started at perihelion, where its speed is the one the data gives, and moving
         * tangentially - `propel` advances at `p/\bar{m}`, so a speed is a momentum of
         * `v\bar{m}` */
        x: cells(A[i] * (1 - E[i])), y: 0, mx: 1, ways: ways(i), tag: 1, moves: true,
        px: 0, py: -speed(i) * HASTE * ways(i),
      })),
    ],
  }),
];
