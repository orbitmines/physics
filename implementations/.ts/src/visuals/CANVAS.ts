/**
 * A canvas that draws only while it is worth drawing on.
 *
 * PORTED WITHOUT REACT. `Surface` and `Painter` are exactly the contract the article's
 * `CANVAS.tsx` defines — `start` makes the world, `frame` draws it, `stop` lets it go.
 * React was only the thing that mounted it; a headless renderer drives the same
 * painter directly, so a visual is the same object in a browser and on disk.
 */

export type Surface = { ctx: CanvasRenderingContext2D; width: number; height: number };

export type Painter = {
  /** called as it comes on screen, before the first frame; make the world here */
  start?: () => void;
  frame: (surface: Surface, dt: number) => void;
  /** called as it goes off screen; let go of everything `start` made */
  stop?: () => void;
};

export type Visual = {
  id: string;
  /** what it is a picture of, and — where it draws a closed form — that it is one */
  what: string;
  width: number;
  height: number;
  /** how many frames the whole animation is */
  frames: number;
  /** the painter, made fresh per render so a run cannot inherit the last one's world */
  paint: () => Painter;
};

export const visual = (v: Visual): Visual => v;

/** a painter whose every frame is a fresh draw, which is what most of these are */
export const frames = (make: () => (s: Surface) => void): (() => Painter) =>
  () => ({ frame: make() });
