/**
 * A canvas that draws only while it is worth drawing on.
 *
 * PORTED WITHOUT REACT. `Surface` and `Painter` are exactly the contract the article's
 * `CANVAS.tsx` defines — `start` makes the world, `frame` draws it, `stop` lets it go.
 * React was only the thing that mounted it; a headless renderer drives the same
 * painter directly, so a visual is the same object in a browser and on disk.
 */

import { measured, type Measured } from "../lib/Measured.ts";

export type Surface = { ctx: CanvasRenderingContext2D; width: number; height: number };

export type Painter = {
  /** called as it comes on screen, before the first frame; make the world here */
  start?: () => void;
  frame: (surface: Surface, dt: number) => void;
  /** called as it goes off screen; let go of everything `start` made */
  stop?: () => void;
  /**
   * A SLICE OF WHATEVER HAS TO HAPPEN BEFORE THE FIRST FRAME IS HONEST, and how much
   * of it is done — 1 when there is nothing left.
   *
   * A visual that averages cannot be recorded until it has an average: the panels warm
   * for two hundred ticks of two worlds, which is minutes, and doing it inside `start`
   * meant the renderer sat inside ONE blocking call with no way to say how far along it
   * was. On screen that is a frozen tab; headless it is indistinguishable from a hang,
   * which is what it was taken for.
   *
   * Given a budget in milliseconds, do that much and return. Nothing implements it
   * unless it needs to, and a painter without one is ready the moment `start` returns.
   */
  warm?: (budgetMs: number) => number;
};

/**
 * A SIMULATION, RECORDED ONCE AND REPLAYED — so that changing how a picture LOOKS costs
 * seconds rather than the minutes its physics costs.
 *
 * `Measured.ts` already says why: "A PANEL THAT COMPUTES ITS OWN PHYSICS IS A PANEL NOBODY
 * ITERATES ON... changing a colour takes seconds, and tying the two together means every
 * colour costs minutes." That was written for a static field and it is just as true of a
 * moving one - more so, because an animation runs its world once per FRAME.
 *
 * AND A RECORDING IS A MEASUREMENT, which is the whole of why this is small. `<id>.frames` is
 * an ordinary named-column field with a header: the same `.f32` on disk, the same baking into
 * the page, the same reader on both sides. Nothing new is invented; a frame is a stride into
 * a column, and that is the only idea here.
 *
 * WHAT IT IS STAMPED WITH IS WHAT IT DEPENDS ON. A cache whose stamp does not match what the
 * visual now asks for is ignored and the world is run live - so a change to the physics can
 * never be drawn from a stale film, and a change to the colours never re-runs the physics.
 */
export type Recording = {
  /** everything the numbers depend on, as one string - the constants, the sizes, the rules */
  stamp: string;
  /** the channels one frame carries, and how many numbers each of them holds */
  channels: Record<string, number>;
  /** make the world */
  start(): void;
  /** and advance it one frame, filling the channels in place */
  frame(into: Record<string, Float32Array>): void;
};

/** one frame's channels, off disk where there is a film and computed where there is not */
export type Played = {
  /** whether these came off disk, which is the only thing a caller might want to know */
  cached: boolean;
  at(frame: number): Record<string, Float32Array>;
};

export type Visual = {
  id: string;
  /** what it is a picture of, and — where it draws a closed form — that it is one */
  what: string;
  width: number;
  height: number;
  /** how many frames the whole animation is */
  frames: number;
  /**
   * WHAT THE PICTURE IS MADE OF, recorded apart from how it is drawn - optional, and a visual
   * without one computes as it always did.
   */
  record?: Recording;
  /**
   * the painter, made fresh per render so a run cannot inherit the last one's world - and
   * handed the frames, off disk where they have been recorded and live where they have not
   */
  paint: (played?: Played) => Painter;
};

export const visual = (v: Visual): Visual => v;

/** a painter whose every frame is a fresh draw, which is what most of these are */
export const frames = (make: () => (s: Surface) => void): (() => Painter) =>
  () => ({ frame: make() });

/**
 * THE FRAMES OF A VISUAL — off disk if they are there and stamped right, and computed if not.
 *
 * The caller does not have to know which: `at(f)` gives that frame's channels either way. A
 * live one is only allowed to be asked for frames in order, which is what a simulation IS -
 * it has no way to jump to the hundredth without running the ninety-nine before it - and it
 * says so rather than quietly returning the wrong one.
 */
export const played = (v: Visual): Played | undefined => {
  const r = v.record;
  if (!r) return undefined;

  const names = Object.keys(r.channels);
  const width = names.reduce((n, k) => n + r.channels[k], 0);

  let film: Measured | undefined;
  try { film = measured(`${v.id}.frames`); } catch { film = undefined; }
  if (film && (film.header as any).stamp === r.stamp && film.header.rows === width * v.frames) {
    const all = film.columns.frames;
    return {
      cached: true,
      at: f => {
        const out: Record<string, Float32Array> = {};
        let at = f * width;
        for (const k of names) { out[k] = all.subarray(at, at + r.channels[k]); at += r.channels[k]; }
        return out;
      },
    };
  }

  /* no film, or one that was recorded from something else: run it here, in order */
  const buf: Record<string, Float32Array> = {};
  for (const k of names) buf[k] = new Float32Array(r.channels[k]);
  let next = 0;
  r.start();
  return {
    cached: false,
    at: f => {
      if (f < next - 1) throw new Error(
        `${v.id}: frame ${f} was asked for after ${next - 1}, and a world that is being run ` +
        `cannot go back - record it first with \`npm run record\``);
      while (next <= f) { r.frame(buf); next++; }
      return buf;
    },
  };
};
