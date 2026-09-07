/**
 * THE PICTURES ABOUT THE LATTICE rather than about what happens on it.
 *
 * Ported 1:1 from the article's `visuals/LATTICE.tsx` — the drawing is unchanged;
 * only the React shell around it is gone.
 */
import { Geometry, GEOMETRIES, Vec, add, scale } from "../lib/Local.ts";
import { frames, Surface, visual } from "./CANVAS.ts";

// the article's own palette, so these sit beside the other lattice pictures
export const BACK = "#08090d";
export const NEUTRAL = [140, 147, 168], CYAN = [61, 220, 255], AMBER = [255, 122, 69];
export const rgba = (c: number[], a: number) => `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;

/** how far along its connection a boundary is drawn, so the two ends meet with a gap */
export const STUB = 0.42;

export type Cam = { yaw: number; pitch: number; scale: number; cx: number; cy: number };

/** the same orbit camera the lattice views use: yaw, then pitch, then flatten */
export const place = (v: Vec, cam: Cam) => {
  const [x, y, z] = [v[0] ?? 0, v[1] ?? 0, v[2] ?? 0];
  const cy = Math.cos(cam.yaw), sy = Math.sin(cam.yaw);
  const cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
  const rx = x * cy - z * sy;
  const rz = x * sy + z * cy;
  const ry = y * cp - rz * sp;
  const depth = y * sp + rz * cp;
  return { x: cam.cx + rx * cam.scale, y: cam.cy - ry * cam.scale, depth };
};

/** the points of a patch: every lattice position within `half` of the middle */
export const patch = (g: Geometry, half: number): Vec[] => {
  const out: Vec[] = [];
  const walk = (p: number[]) => {
    if (p.length === g.D) { out.push(p.slice()); return; }
    for (let i = -half; i <= half; i++) walk([...p, i]);
  };
  walk([]);
  return out;
};

/**
 * A STRIP: long the way the thing is going, thin across it.
 *
 * A beam wants a strip and not a cube. Drawn in a 7³ block the ray is one point among
 * three hundred and forty-three and cannot be picked out at all.
 */
export const strip = (g: Geometry, length: number, across: number): Vec[] => {
  const out: Vec[] = [];
  const walk = (p: number[]) => {
    if (p.length === g.D) { out.push(p.slice()); return; }
    const h = p.length === 0 ? length : across;
    for (let i = -h; i <= h; i++) walk([...p, i]);
  };
  walk([]);
  return out;
};

/**
 * The connections, drawn as two stubs with a gap between them — which is what a
 * BOUNDARY is here. A point does not touch its neighbour; each holds its own way
 * out, and the gap is where nothing is.
 */
export const connections = (
  ctx: CanvasRenderingContext2D, g: Geometry, points: Vec[], cam: Cam,
  alpha = 0.22,
) => {
  const has = new Set(points.map(p => p.join(",")));
  ctx.lineWidth = 1;
  ctx.strokeStyle = rgba(NEUTRAL, alpha);
  ctx.beginPath();
  for (const p of points) {
    for (let d = 0; d < g.DEG; d++) {
      const q = add(p, g.exits[d]);
      if (!has.has(q.map(v => Math.round(v)).join(","))) continue;
      const a = place(p, cam), b = place(q, cam);
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(a.x + (b.x - a.x) * STUB, a.y + (b.y - a.y) * STUB);
    }
  }
  ctx.stroke();
};

export const nodes = (
  ctx: CanvasRenderingContext2D, points: Vec[], cam: Cam,
  colour: (p: Vec) => number[] | undefined, r = 2.4, alpha = 1,
) => {
  const drawn = points
    .map(p => ({ p, at: place(p, cam) }))
    .sort((a, b) => a.at.depth - b.at.depth);
  for (const { p, at } of drawn) {
    const c = colour(p);
    if (!c) continue;
    const near = Math.min(Math.max((at.depth + 3) / 6, 0.35), 1);
    ctx.beginPath();
    ctx.arc(at.x, at.y, r * near, 0, Math.PI * 2);
    ctx.fillStyle = rgba(c, (0.5 + 0.45 * near) * alpha);
    ctx.fill();
  }
};

/*
 * NOTHING IS WRITTEN INSIDE THE PICTURE. What a figure is of belongs beside it, in
 * the same type as the prose, where it can be read.
 */
const camFor = (sur: Surface, g: Geometry, span: number, turn = 0): Cam => ({
  yaw: g.D === 2 ? 0 : 0.62 + turn,
  pitch: g.D === 2 ? 0 : 0.42,
  scale: Math.min(sur.width, sur.height - 26) / (1.5 * span),
  cx: sur.width / 2,
  cy: (sur.height - 20) / 2 + 6,
});

// ─── a cell a tick ──────────────────────────────────────────────────────────

/**
 * SOMETHING TRAVELLING AT THE SPEED OF LIGHT: one cell, one tick.
 *
 * Remade every step rather than ticked. Movement in this model is a swap — the mover
 * eats the point in front and puts a fresh one down behind — and a fresh point has
 * only the connections it was made with. So each frame is a fresh patch with the ray
 * one further on.
 */
export const beam = (g: Geometry) => {
  const LONG = 5, ACROSS = 2;
  /*
   * TWO RAYS, ON THE SHORTEST EXIT AND THE LONGEST, both moving one exit a tick.
   *
   * On a geometry whose exits are all the same length they stay level and `a cell a
   * tick` is the whole story; on cubic 26 one of them pulls away from the other by
   * 73% because a body diagonal covers √3 cells in the tick a face step covers one.
   */
  const shortest = g.steps.indexOf(Math.min(...g.steps));
  const longest = g.steps.indexOf(Math.max(...g.steps));
  const same = g.cAnisotropy < 1.001;
  let at = 0;
  return (sur: Surface) => {
    const { ctx } = sur;
    ctx.fillStyle = BACK; ctx.fillRect(0, 0, sur.width, sur.height);
    const cam = camFor(sur, g, 2 * LONG + 1);
    const pts = strip(g, LONG, ACROSS);
    connections(ctx, g, pts, cam);

    const k = at++ % (2 * LONG + 1);
    const rays = same ? [shortest] : [shortest, longest];
    const on = new Map<string, number[]>();
    const heads: [Vec, Vec, number[]][] = [];
    for (const d of rays) {
      // one exit a tick, from the near end — so the two set off together
      const here = scale(g.exits[d], k - LONG).map(Math.round);
      const c = d === shortest ? CYAN : AMBER;
      on.set(here.join(","), c);
      heads.push([here, add(here, g.exits[d]), c]);
    }

    /*
     * THE RAYS ARE DRAWN WHEREVER THEY ARE, including off the strip — because
     * leaving it is the thing worth seeing.
     */
    nodes(ctx, pts, cam, p => on.get(p.join(",")) ?? NEUTRAL, 2.8);
    for (const [from, , c] of heads) {
      const at2 = place(from, cam);
      ctx.beginPath();
      ctx.arc(at2.x, at2.y, 3.4, 0, Math.PI * 2);
      ctx.fillStyle = rgba(c, 0.95); ctx.fill();
    }
    for (const [from, to, c] of heads) {
      const a = place(from, cam), b = place(to, cam);
      ctx.strokeStyle = rgba(c, 0.9); ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(a.x + (b.x - a.x) * 0.8, a.y + (b.y - a.y) * 0.8);
      ctx.stroke();
    }
  };
};

// ─── what a sheet is ────────────────────────────────────────────────────────

/**
 * THE SHEET: the points around one point, and the ones a pulse leaves into.
 *
 * Neither ticks. There is no universe running here — the lattice is a still patch
 * with nothing moving in it, and the only thing that moves is the sheet.
 */
export const sheet = (g: Geometry, turning: boolean) => {
  let phase = 0;
  return (sur: Surface) => {
    const { ctx } = sur;
    ctx.fillStyle = BACK; ctx.fillRect(0, 0, sur.width, sur.height);
    const cam = camFor(sur, g, 3.4, turning ? (phase * 0.012) : 0);
    const pts = patch(g, 1);
    connections(ctx, g, pts, cam, 0.18);

    /*
     * THE SHEET ITSELF IS TURNED, member by member — not recomputed as the equator
     * of some new axis. Rotating the AXIS lands it on classes of axis whose equators
     * are different sizes, so a turning panel lit six exits beside a still panel of
     * eight — which says a source loses two rays by coming round. It does not.
     */
    const lit = new Set<string>();
    const base = g.equator(g.sheetAxis);
    if (base.length) {
      /*
       * THE SHEET TURNS ABOUT AN AXIS LYING IN ITSELF, which is the article's "we'll
       * be rotating this sheet in one more dimension than it's defined" and is the
       * step that fixes the emission at SHEET rays rather than at l.DEG.
       */
      const about = g.U[base[0]];
      const k = turning ? Math.floor(phase / 18) % Math.max(g.CYCLE, 1) : 0;
      for (const d of base) {
        let e = d;
        for (let i = 0; i < k; i++) e = g.turn(e, about);
        lit.add(g.exits[e].join(","));
      }
    }
    phase++;

    nodes(ctx, pts, cam, p => {
      if (p.every(v => v === 0)) return CYAN;
      return lit.has(p.join(",")) ? AMBER : NEUTRAL;
    }, 3);

    // the exits of the sheet, drawn out of the middle
    if (lit.size) {
      ctx.strokeStyle = rgba(AMBER, 0.75); ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (const key of lit) {
        const v = key.split(",").map(Number);
        const a = place(new Array(g.D).fill(0), cam), b = place(v, cam);
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(a.x + (b.x - a.x) * 0.86, a.y + (b.y - a.y) * 0.86);
      }
      ctx.stroke();
    }
  };
};

/** the order the article discusses them in */
export const ORDER = ["cubic-6", "bcc-8", "fcc-12", "cubic-18", "cubic-26"];

export default ORDER.flatMap(name => {
  const g = GEOMETRIES[name];
  return [
    visual({
      id: `beam.${name}`, width: 720, height: 300, frames: 2 * 5 + 1,
      what: `a cell a tick, on ${name} — one exit a tick along the shortest exit and the ` +
        `longest, so the picture says both "a cell a tick" and what the anisotropy costs`,
      paint: frames(() => beam(g)),
    }),
    visual({
      id: `sheet.${name}`, width: 460, height: 460,
      frames: 18 * Math.max(g.CYCLE, 1),
      what: `the sheet on ${name}, turning — SHEET ${g.SHEET} exits, turned member by member ` +
        `about an axis lying in itself, so one rotation reaches everywhere`,
      paint: frames(() => sheet(g, true)),
    }),
  ];
});
