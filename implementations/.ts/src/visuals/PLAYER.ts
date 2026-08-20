/**
 * A LATTICE, TICKING, WITH TRANSPORT CONTROLS — the new core's replacement for the
 * archive's `LatticePlayer`.
 *
 * The old one ran `archive/discrete.ts`, a 3,395-line simulator written before
 * `DISCRETE.ts` existed and sharing no code with it. So every lattice panel in the
 * article was showing A DIFFERENT MODEL from the one the tests measure — same
 * intentions, separately maintained, and nothing anywhere checked that the two agreed.
 * That is the whole reason for this file: a picture of the model has to be a picture
 * of THE model.
 *
 * IT LOOKS THE SAME ON PURPOSE. Same camera, same palette, same points-and-stubs
 * drawing as the other lattice figures — a reader ten screens deep should not have to
 * work out whether a new picture is a new kind of thing. What changed is underneath.
 */


import { frames, Painter, visual, Surface } from "./CANVAS.ts";
import {
  AMBER, BACK, Cam, CYAN, NEUTRAL, connections, nodes, place, rgba,
} from "./LATTICE.ts";
import { GEOMETRIES, GRAVITY, GRAVITY_MAGNETISM, Theory, Vec, World, WorldOptions } from "../lib/DISCRETE.ts";

export type Seed = (w: World) => void;

export type PlayerSpec = {
  /** what the world is: everything `World` takes, plus what to put in it */
  world: Omit<WorldOptions, "theory"> & { theory: Theory };
  seed?: Seed;
  /** ticks run before the first frame, so a reader does not watch an empty box */
  warm?: number;
  /** ticks a second */
  rate?: number;
  height?: number;
  /** how much of the box to show, in cells from the middle */
  view?: number;
  note?: string;
  /** draw the charges, or only where space has been destroyed */
  show?: "charge" | "density";
};

/**
 * WHAT COLOUR A POINT IS.
 *
 * `charge` is the polarity of what it is holding — cyan for one sign, amber for the
 * other, grey for space that has not been charged by anything. `density` is how much
 * space has been folded into it, which is where annihilation has been happening and
 * is the channel the force results are read out of.
 */
const colourOf = (w: World, show: "charge" | "density") => {
  let hi = 0;
  /*
   * READ OUT OF `destroyed` AND NOT `density`, which is the difference between a
   * picture and a blank panel.
   *
   * `backend.density` counts how much space has been FOLDED into a point, and on-edge
   * annihilation does not fold: it collapses the point the split inserted BETWEEN two
   * others and leaves both ends alone. So density no longer moves, and a panel drawn
   * from it stays uniformly grey however much annihilation is happening — which is
   * exactly what it did before this was fixed. `w.destroyed` is the per-point
   * annihilation count that was added for the force measurements, and it is the same
   * quantity these pictures are supposed to be of: where space went.
   */
  if (show === "density")
    w.backend.forEachLocal(k => {
      hi = Math.max(hi, k < w.destroyed.length ? w.destroyed[k] : 0);
    });
  return (k: number): number[] | undefined => {
    if (show === "density") {
      const d = k < w.destroyed.length ? w.destroyed[k] : 0;
      if (d <= 0) return NEUTRAL;
      const t = Math.min(1, d / Math.max(hi, 1e-9));
      return [NEUTRAL[0] + (AMBER[0] - NEUTRAL[0]) * t,
        NEUTRAL[1] + (AMBER[1] - NEUTRAL[1]) * t,
        NEUTRAL[2] + (AMBER[2] - NEUTRAL[2]) * t];
    }
    let plus = 0, minus = 0;
    for (let d = 0; d < w.DEG; d++) {
      if (!w.backend.active(k, d)) continue;
      const q = w.backend.charge(k, d);
      if (q > 0) plus++; else if (q < 0) minus++;
    }
    if (!plus && !minus) return NEUTRAL;
    return plus === minus ? NEUTRAL : plus > minus ? CYAN : AMBER;
  };
};

const ICON = {
  play: "M187 101a24 24 0 0 0-59 35v368a24 24 0 0 0 59 35l336-184a24 24 0 0 0 0-70z",
  pause: "M176 96h64a48 48 0 0 1 48 48v352a48 48 0 0 1-48 48h-64a48 48 0 0 1-48-48V144a48 48 0 0 1 48-48zm224 0h64a48 48 0 0 1 48 48v352a48 48 0 0 1-48 48h-64a48 48 0 0 1-48-48V144a48 48 0 0 1 48-48z",
  step: "M149 101a24 24 0 0 0-21 35v368a24 24 0 0 0 45 8l258-170v144a32 32 0 0 0 64 0V128a32 32 0 0 0-64 0v144z",
  reset: "M491 101a24 24 0 0 0-41 2L192 272V128a32 32 0 0 0-64 0v384a32 32 0 0 0 64 0V368l258 170a24 24 0 0 0 62-34V136a24 24 0 0 0-21-35z",
};



/*
 * THE SEEDS THE ARTICLE'S LATTICE PANELS USE — two blocks of charge facing each
 * other, and two emitters across a gap.
 *
 * IN TWO DIMENSIONS, as the originals were: `Graph.blocks` and `Graph.emitters` both
 * set `dims = 2`, and a plane is the right picture for these because the thing being
 * shown is which way things go, which a 3D block hides behind its own outer shell.
 * `square-8` is the new core's plane and it is a geometry like any other, so these
 * pictures come off the same `World` as everything else.
 */

/*
 * AND THESE RUN WITH NO VACUUM, which is the setting that makes them pictures at all.
 *
 * `expansion` defaults to 1 — every neutral point splits every tick — and under
 * polarity that fills the whole plane with charge. The two blocks are then a few
 * points among a thousand and cannot be picked out: measured, the panel is a solid
 * field of cyan and amber with the sources invisible inside it. The vacuum is a real
 * part of the model and has its own figures; THESE panels are about what two blocks
 * do to each other, so they are run in empty space and say so.
 */
export const EMPTY = { expansion: 0 } as const;

/**
 * TWO CLUMPS OF CHARGE THROWN AT EACH OTHER — the whole of (G+M/1) and (G+M/3) in one
 * picture, and NOTHING ELSE RUNNING.
 *
 * It is a demonstration, not a sample, so everything that is not the rule is taken
 * out. There are no sources: nobody is emitting, nobody is absorbing, and the number
 * of charges never grows. Two rectangles of rays are simply placed on the lattice,
 * the left one heading right and the right one heading left, and then the rules are
 * let run. Expansion is off, so (G+M/2) makes nothing either — what is on the board
 * at the start is all there will ever be.
 *
 * WHY IT IS BUILT THIS WAY. Earlier versions of this figure used `Source` bodies with
 * momentum, which dragged in the whole of `moveRule`, mass, recoil and a body's force
 * on itself — and what a reader then saw was two blobs of *emitted field* grazing past
 * each other while the rule being illustrated happened somewhere inside. None of that
 * apparatus is needed to show two charges meeting. Rays already move; that is what
 * streaming is. The two rules already say what happens when they meet.
 *
 * Measured, on 208 charges:
 *
 *     + −   208 → 0     104 annihilations,   0 deflections
 *     + +   208 → 152     0 annihilations, 170 deflections
 *     − −   208 → 152     0 annihilations, 170 deflections
 *
 * Opposite charges destroy each other completely. Alike charges all turn and come
 * back, and the count only falls because the ones that turn around run off the far
 * edge of the box. `+ +` and `− −` are identical, which they have to be.
 */
const CLUMP = { near: 9, far: 14, span: 8 };

export const charges = (left: 1 | -1, right: 1 | -1): Seed => (w) => {
  const g = w.geometry, b = w.backend;
  const C = ((w.opts.N ?? 1) - 1) / 2;
  const mid = g.embed(new Array(g.D).fill(C));
  /*
   * THE AXIS THEY MEET ON, taken from the geometry rather than assumed. Every lattice
   * in this book has a ±x exit; which INDEX it is differs, and on triangular 6 it is
   * not the one a square lattice would have made it.
   */
  const toward = g.V.findIndex(v => v[0] === 1 && !v.slice(1).some(x => x !== 0));
  if (toward < 0) throw new Error(`${g.name} has no exit straight along x to collide on`);
  const back = g.OPP[toward];

  b.forEachLocal(k => {
    const p = g.embed(b.position(k)).map((x, i) => x - (mid[i] ?? 0));
    for (let i = 1; i < g.D; i++) if (Math.abs(p[i] ?? 0) > CLUMP.span) return;
    const x = p[0] ?? 0;
    if (x >= -CLUMP.far && x <= -CLUMP.near) b.put(k, toward, left);
    else if (x >= CLUMP.near && x <= CLUMP.far) b.put(k, back, right);
  });
};

/**
 * THE PLANE THESE FIGURES RUN ON — faces only, and heavy matter in it.
 *
 * SIX EXITS, ALL OF THEM ONE CELL LONG. `square-8`'s diagonals are √2, so rays down
 * them outrun the ones going straight for no reason a reader can see, and a picture
 * of a rule ends up also being a picture of the lattice's grain. Taking the diagonals
 * out fixes the lengths but leaves four exits, which is as anisotropic as a plane
 * gets — rank four 0.667.
 *
 * Triangular 6 has both: ONE STEP LENGTH, c̄ one cell a tick down every exit, which is
 * the setup the three rules are stated for — and EXACT at ranks two, three and four,
 * which no square arrangement in the plane is.
 *
 * It had to be repaired first. Its ±√3/2 components do not land on the integer grid,
 * the backend rounded them, and two thirds of its links came out one-way — measured
 * HERE, as blocks that passed straight through each other with alike and opposite
 * pairs behaving identically. In axial coordinates it is an integer lattice and the
 * figure separates: alike close from 20 cells to 10, touch, and go out to 30;
 * opposite close to 10 and stay.
 */
export const PLANE = {
  theory: GRAVITY_MAGNETISM,
  geometry: GEOMETRIES["triangular-6"],
  N: 61, boundary: "absorb" as const, ...EMPTY,
};

/** two emitters across a gap, each pulsing its own polarity into the space between */
export const emitters = (left: 1 | -1, right: 1 | -1): Seed => (w) => {
  const C = ((w.opts.N ?? 1) - 1) / 2, gap = Math.max(2, Math.floor(C * 0.6));
  w.add({ at: [C - gap, C], radius: 1, emits: left, duty: 1, absorbs: true });
  w.add({ at: [C + gap, C], radius: 1, emits: right, duty: 1, absorbs: true });
};

/**
 * THE ARRANGEMENTS, AS A GALLERY — every one of them the same rules, differing only in
 * what was put in the world and how it was watched.
 *
 * This replaces a catalogue of runs from the archive's own simulator. The point of
 * that catalogue was breadth: that one rule set, unchanged, produces all of these. It
 * only makes that point if they are all the SAME rule set, which is exactly what could
 * not be checked when the figures ran a different engine from the tests.
 */
