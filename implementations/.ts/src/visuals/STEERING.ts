/**
 * TWO CHARGES CROSSING A FIELD, AND PARTING — qv×B, drawn as trajectories.
 *
 * WHAT A FIELD IS HERE, since nothing in the model stores one. At a point P there are DEG
 * rays, each carrying a polarity and a direction, and taken together they are a vector:
 *
 *   B(P) = Σ polarity · d̂        over the rays that are AT P
 *
 * That is the magnetism XOR. It is not a variable, no rule maintains it, and it is not
 * painted on: it is what the point is already holding, summed. The charge XOR is the same
 * rays summed over their OTHER sign, and a charge crossing the field is a ray at the same
 * point as the field — CO-LOCATED, never meeting. (G+M/1) and (G+M/3) are about two rays
 * facing each other ACROSS AN EDGE, and these two are on different exits of one point.
 *
 * THE FORCE IS THE ROTATION THE LATTICE ALREADY HAD. qv×B integrates to "v rotates about
 * B" — the cyclotron — and `Geometry.turn(d, axis)` is "which exit d becomes, rotated one
 * step about axis". A charged ray banks |B|/gyro of a turn each tick and takes one ring
 * step when it has a whole one saved, IN THE SENSE OF ITS CHARGE. That sign is the only
 * difference between the two charges here, and the parting is its whole content.
 *
 * WHAT IS DRAWN IS ONE CHARGE, NOT A BEAM, AND THAT IS A CORRECTION.
 *
 * An earlier cut of this panel put a SOURCE at the start line and traced the CENTROID of
 * everything it had emitted. That is not a trajectory and it did not behave like one: a
 * source on a duty cycle emits in pulses, rays are absorbed at the rim and scattered in
 * flight, and the mean of a changing population jumps about from tick to tick. The result
 * oscillated, which read as the force law ringing when it was nothing but the average
 * wobbling. It was also drawn as a cloud of dots, which showed the population and hid the
 * path.
 *
 * SO WHAT FLIES HERE IS A SINGLE INJECTED RAY — one excitation, given a charge and a
 * heading and then left alone. Its position every tick IS its trajectory, exactly and with
 * nothing averaged, and the two charges come out exact mirrors of one another. Verified as
 * a closed orbit in a uniform field: (−4,0) (−1,1) (−1,5) (−2,8) (−6,8) (−9,7) (−9,3)
 * (−8,0) and round again, with the opposite charge tracing the same ring the other way.
 *
 * AND THE VACUUM'S OWN CREATION IS OFF, the `RAIN.ts` precedent — same mechanism, the
 * scattering removed and nothing else. With (G+M/2) in, the vacuum fills to about a third
 * and a ray meets something every few cells, so no single excitation survives long enough
 * to have a path at all. The deflection is still there with the vacuum fully alive, and
 * that is what `tests/steering.ts` measures: +0.750 against −0.750 at B+z, −0.738 against
 * +0.738 at B−z, and exactly zero with no field.
 */

import { World } from "../lib/Compat.ts";
import { GEOMETRIES, Vec } from "../lib/Local.ts";
import { G_XOR_XOR, fieldAt } from "../theories/G^XOR+XOR.ts";
import { Painter, Surface, visual } from "./CANVAS.ts";

const BACK = "#08090d", INK = "#c8cbd4", FAINT = "#5a5f6e";
const POS = "#ffb35c", NEG = "#6ea8fe";
const WAVE_OUT = "#3d6ea8", WAVE_IN = "#8a5bb5", MAGNET = "#e8556d";

/**
 * `cubic-18` AND NOT `cubic-6`, BECAUSE THE RING IS THE RESOLUTION OF THE ARC.
 *
 * A turn is ONE STEP ALONG THE RING about B, so the ring's size is how finely a trajectory
 * can bend: `cubic-6` has four exits in the plane across z, every turn is a right angle,
 * and an orbit is a SQUARE. That is the lattice being honest and it is also unreadable as
 * a cyclotron. `cubic-18` keeps the same rule and puts eight exits in that plane — the
 * four axes and the four face diagonals — so a turn is 45° and an orbit is an octagon,
 * which is a circle as far as a picture is concerned. Nothing about the force changes;
 * what changes is how many pieces the circle is allowed to have.
 */
const G = GEOMETRIES["cubic-18"];
const N = 39, C = 19;
const zp = G.exits.findIndex(v => v[0] === 0 && v[1] === 0 && v[2] === 1);
const zm = G.exits.findIndex(v => v[0] === 0 && v[1] === 0 && v[2] === -1);
/* the PURE +x exit — `cubic-18` has several with a positive x, and a diagonal would
 * launch the charge across the picture instead of along it */
const xp = G.exits.findIndex(v => v[0] === 1 && v[1] === 0 && v[2] === 0);

type Step = { x: number; y: number } | null;

/**
 * ONE CHARGE, FLOWN — its position every tick, and nothing averaged.
 *
 * `where` says which points carry the field this tick, so the same routine flies a charge
 * through a slab of uniform field and through a magnet's own outflow.
 */
const fly = (o: {
  q: number; thin: number; ticks: number;
  start: Vec; magnet?: { radius: number; duty: number };
  slab?: (at: Vec) => number;
}): { path: Step[]; B: Map<string, Vec> } => {
  const theory = (G_XOR_XOR as any).without("CREATION").called("one");
  const w = new World({
    theory, geometry: G, N, seed: 1, boundary: "absorb", slotUniformRng: true,
  });
  if (o.magnet) w.add({ at: [C, C, C], radius: o.magnet.radius, emits: 1, charges: 0,
    axis: [0, 0, 1], duty: o.magnet.duty });

  /* THE SLAB: a region of uniform field, laid down as what a field IS — the ±z ray pair
   * aligned, so Σ polarity·d̂ = 2Bz·ẑ inside it and nothing outside */
  const impose = () => {
    if (!o.slab) return;
    w.backend.forEachLocal((n: number) => {
      const l: any = w.locals[n];
      if (l.source) return;
      const at = w.embedding.at(l);
      const Bz = at ? o.slab!(at) : 0;
      const a = l.rays[zp], b = l.rays[zm];
      if (!Bz) { if (a) a.active = false; if (b) b.active = false; return; }
      if (a) { a.active = true; a.polarity = Bz; a.charge = undefined; }
      if (b) { b.active = true; b.polarity = -Bz; b.charge = undefined; }
    });
  };

  const findAt = (v: Vec) => {
    for (const l of w.locals) {
      const a = w.embedding.at(l as any);
      if (a && a[0] === v[0] && a[1] === v[1] && a[2] === v[2]) return l as any;
    }
    return undefined;
  };

  impose();
  const seat = findAt(o.start);
  if (seat) {
    const r = seat.rays[xp];
    /*
     * IT CARRIES POLARITY +1, AND THAT IS WHAT LETS IT SURVIVE A REAL MAGNET.
     *
     * Given polarity 0 its rays are NOT ALIKE to anything the magnet puts out, so (G+M/1)
     * fires on the first meeting and destroys it — measured, the charge flew in and simply
     * stopped dead at the field's edge, which reads as the rule failing when it is the
     * charge being annihilated. Carrying the same polarity the magnet emits makes those
     * meetings alike, so they deflect instead, and the charge lives to be steered. In the
     * slab panels nothing is ever met and this makes no difference at all.
     */
    r.active = true; r.charge = o.q; r.polarity = 1; r.gyrophase = 0;
  }

  const path: Step[] = [];
  /* the field on the drawn plane, taken once the run has settled — what the waves show */
  const B = new Map<string, Vec>();
  for (let t = 0; t < o.ticks; t++) {
    w.tick();
    impose();
    let here: Step = null;
    for (const l of w.locals) {
      let hit = false;
      for (const r of (l as any).rays) if (r.active && r.charge) { hit = true; break; }
      if (!hit) continue;
      const a = w.embedding.at(l as any);
      if (a) here = { x: a[0] - C, y: a[1] - C };
      break;
    }
    path.push(here);
    if (t === Math.floor(o.ticks / 2)) {
      const z = o.start[2];
      for (const l of w.locals) {
        const a = w.embedding.at(l as any);
        if (!a || a[2] !== z) continue;
        const b = fieldAt(l, G);
        if (b[0] || b[1] || b[2]) B.set(`${a[0] - C},${a[1] - C}`, b);
      }
    }
  }
  return { path, B };
};

const CHARGES = [{ q: +1, tone: POS, name: "q +1" }, { q: -1, tone: NEG, name: "q −1" }];

/* ── the two panels each visual draws ──────────────────────────────────────── */

type Panel = {
  label: string; sub: string;
  paths: Step[][];
  B: Map<string, Vec>;
  /** the field region, in cells, for the wave rendering — null where it is a magnet */
  slab: { x0: number; x1: number; sign: number } | null;
  magnet: boolean;
};

const VIEW = 19, TICKS = 50;

/**
 * A SLAB OF FIELD THINNER THAN THE ORBIT — the gap between a pair of magnet poles, and
 * what makes this a SEPARATION rather than a reflection.
 *
 * FILLING EVERYTHING BEYOND ONE EDGE GIVES A 180°, AND THAT IS CORRECT PHYSICS RATHER THAN
 * a bug — it is just not the picture anyone means. Inside a uniform field the motion is a
 * circle; if the field fills the whole half-space there is nowhere to exit FORWARD, so the
 * charge comes round and leaves through the face it entered by, displaced one diameter.
 * Traced, it did exactly that: straight to (−1,0), then (1,2) (3,4) (4,6) (4,8) (4,10)
 * (3,12) (1,14) (−1,16) — a clean semicircle of radius 8 — and then straight back out
 * along y = 16. The two charges ended 32 cells apart, mirrored. Right, and it reads as a
 * mirror rather than as a beam being split.
 *
 * SO THE FIELD IS GIVEN A FAR SIDE. A charge crossing a slab NARROWER than its gyroradius
 * banks only part of a turn before it runs out of field, and then flies straight on at the
 * angle it acquired — which is the classic separator: two charges entering together, each
 * picking up an opposite fraction of a turn, and diverging forward ever after. The width
 * and `gyro` are set so that a crossing is worth about one ring step, 45° on this lattice.
 */
const slabRun = (sign: number): Panel => {
  const x0 = -4, x1 = 4;
  const paths = CHARGES.map(h => fly({
    q: h.q, thin: 7, ticks: TICKS, start: [C - 16, C, C],
    slab: at => { const u = at[0] - C; return u >= x0 && u <= x1 ? sign : 0; },
  }));
  return {
    label: sign > 0 ? "field out of the page" : "field into the page",
    sub: sign > 0 ? "each picks up a turn crossing it, and they diverge"
      : "the field reversed — and they swap sides",
    paths: paths.map(p => p.path), B: paths[0].B,
    slab: { x0, x1, sign }, magnet: false,
  };
};

/** and the same charges crossing a real MAGNET's own outflow */
const magnetRun = (): Panel => {
  /*
   * FLOWN CLEAR OF THE MAGNET'S OWN CELLS. A source ABSORBS what lands on it, so a charge
   * routed through the body of the magnet is simply eaten; it has to cross the field
   * ABOVE the magnet, in the outflow from the pole, where the field is and the magnet is
   * not.
   */
  const paths = CHARGES.map(h => fly({
    q: h.q, thin: 1, ticks: TICKS, start: [C - 14, C, C + 7],
    magnet: { radius: 4, duty: 0.5 },
  }));
  return {
    label: "a real magnet, its own field",
    sub: "an AXIAL source — the poles are EMISSION's doing, not a field painted on",
    paths: paths.map(p => p.path), B: paths[0].B, slab: null, magnet: true,
  };
};

const painter = (make: () => Panel[]): (() => Painter) => () => {
  let panels: Panel[] = [];
  let t = 0, acc = 0, built = false;

  return {
    start: () => { panels = []; t = 0; acc = 0; built = false; },
    warm: () => { if (!built) { panels = make(); built = true; } return 1; },
    frame: (s: Surface, dt: number) => {
      if (!built) { panels = make(); built = true; }
      acc += dt;
      while (acc > 1 / 9 && t < TICKS) { acc -= 1 / 9; t++; }
      const at = Math.min(t, TICKS - 1);

      const { ctx, width, height: H } = s;
      ctx.clearRect(0, 0, width, H);
      ctx.fillStyle = BACK; ctx.fillRect(0, 0, width, H);

      const TOP = 36, BOT = 46, GAPX = 12;
      const n = panels.length;
      const cw = (width - (n - 1) * GAPX) / n;
      const side = Math.min(cw, H - TOP - BOT);
      const pz = side / (2 * VIEW + 1);
      const top = TOP + Math.max(0, (H - TOP - BOT - side) / 2);

      panels.forEach((P, c) => {
        const cx = c * (cw + GAPX) + cw / 2, cy = top + side / 2;
        const X = (u: number) => cx + u * pz, Y = (v: number) => cy - v * pz;

        ctx.save();
        ctx.beginPath();
        ctx.rect(cx - side / 2, cy - side / 2, side, side);
        ctx.clip();

        /*
         * THE FIELD, AS WAVES. B here points out of the drawn plane, which is the only way
         * a charge moving IN that plane can be deflected within it — so there is no arrow
         * to draw. What is drawn instead is the field as a travelling wave across the
         * region it occupies: crests where it is strong, nothing where it is not, and the
         * phase advancing with the tick so the region reads as something alive rather than
         * a shaded box. The SIGN is the colour and the direction the crests run.
         */
        const tone = P.slab ? (P.slab.sign > 0 ? WAVE_OUT : WAVE_IN) : WAVE_OUT;
        if (P.slab) {
          const { x0, x1, sign } = P.slab;
          ctx.fillStyle = tone;
          ctx.globalAlpha = 0.09;
          ctx.fillRect(X(x0), cy - side / 2, (x1 - x0) * pz, side);
          ctx.globalAlpha = 1;
          ctx.strokeStyle = tone; ctx.lineWidth = 1.1;
          for (let k = -VIEW; k <= VIEW; k += 2) {
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            for (let u = x0; u <= x1; u += 0.25) {
              const ph = (u - x0) * 1.1 - sign * at * 0.42;
              const v = k + Math.sin(ph) * 0.5;
              u === x0 ? ctx.moveTo(X(u), Y(v)) : ctx.lineTo(X(u), Y(v));
            }
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
          /* the two faces of the slab — where the bending starts and where it stops */
          ctx.strokeStyle = tone; ctx.globalAlpha = 0.85; ctx.lineWidth = 1.4;
          for (const e of [x0, x1]) {
            ctx.beginPath();
            ctx.moveTo(X(e), cy - side / 2); ctx.lineTo(X(e), cy + side / 2); ctx.stroke();
          }
          ctx.globalAlpha = 1;
        } else {
          /*
           * A MAGNET'S FIELD IS NOT UNIFORM, so the wave is drawn where the field actually
           * is: a crest per point, its brightness the strength B has there. Nothing is
           * smoothed and nothing is idealised — this is `Σ polarity·d̂` sampled on the
           * plane, so where the picture is empty the model has no field.
           */
          let peak = 1e-6;
          P.B.forEach(b => { const m = Math.hypot(b[0], b[1], b[2]); if (m > peak) peak = m; });
          ctx.strokeStyle = tone; ctx.lineWidth = 1.6;
          P.B.forEach((b, key) => {
            const [u, v] = key.split(",").map(Number);
            const m = Math.hypot(b[0], b[1], b[2]) / peak;
            if (m < 0.06) return;
            ctx.globalAlpha = Math.min(0.7, 0.15 + 0.85 * m);
            ctx.beginPath();
            for (let d = -0.5; d <= 0.5; d += 0.125) {
              const y = v + Math.sin(d * 6 + at * 0.5) * 0.3 * m;
              d === -0.5 ? ctx.moveTo(X(u + d), Y(y)) : ctx.lineTo(X(u + d), Y(y));
            }
            ctx.stroke();
          });
          ctx.globalAlpha = 1;
          ctx.strokeStyle = MAGNET; ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.arc(X(0), Y(0), 4 * pz, 0, 2 * Math.PI); ctx.stroke();
        }

        /* THE TRAJECTORIES — one charge each, its position every tick, nothing averaged */
        P.paths.forEach((path, k) => {
          const tone = CHARGES[k].tone;
          ctx.strokeStyle = tone; ctx.lineWidth = 2.4;
          ctx.lineJoin = "round"; ctx.lineCap = "round";
          ctx.beginPath();
          let on = false, head: Step = null;
          for (let i = 0; i <= at && i < path.length; i++) {
            const p = path[i];
            if (!p) continue;
            on ? ctx.lineTo(X(p.x), Y(p.y)) : (ctx.moveTo(X(p.x), Y(p.y)), on = true);
            head = p;
          }
          ctx.stroke();
          if (head) {
            ctx.fillStyle = tone;
            ctx.beginPath(); ctx.arc(X(head.x), Y(head.y), 3.6, 0, 2 * Math.PI); ctx.fill();
          }
        });
        ctx.restore();

        ctx.strokeStyle = "#1c1f28"; ctx.lineWidth = 1;
        ctx.strokeRect(cx - side / 2, cy - side / 2, side, side);

        ctx.textAlign = "center";
        ctx.font = "11px ui-monospace, monospace"; ctx.fillStyle = INK;
        ctx.fillText(P.label, cx, TOP - 18);
        ctx.font = "10px ui-monospace, monospace"; ctx.fillStyle = FAINT;
        ctx.fillText(P.sub, cx, TOP - 6);

        const a = P.paths[0][Math.min(at, P.paths[0].length - 1)];
        const b = P.paths[1][Math.min(at, P.paths[1].length - 1)];
        if (a && b) ctx.fillText(`the charges are ${Math.abs(a.y - b.y).toFixed(0)} cells apart`,
          cx, top + side + 14);
      });

      ctx.textAlign = "left"; ctx.font = "10px ui-monospace, monospace";
      let kx = 14;
      for (const h of CHARGES) {
        ctx.strokeStyle = h.tone; ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.moveTo(kx, H - 25); ctx.lineTo(kx + 14, H - 25); ctx.stroke();
        ctx.fillStyle = h.tone; ctx.fillText(h.name, kx + 20, H - 22);
        kx += 78;
      }
      ctx.fillStyle = FAINT;
      ctx.fillText("one injected charge each — its position every tick, nothing averaged",
        kx + 12, H - 22);

      ctx.textAlign = "center"; ctx.fillStyle = INK;
      ctx.font = "11px ui-monospace, monospace";
      ctx.fillText(`t = ${at}   ·   B = Σ polarity·d̂ over the rays AT a point — a charge ` +
        `there turns one ring step about it, in the sense of its charge`, width / 2, H - 8);
      ctx.textAlign = "left";
    },
    stop: () => { panels = []; built = false; },
  };
};

export default [
  visual({
    id: "steering.field", width: 940, height: 470, frames: 160,
    what: "Two charges fly in from outside a field region, cross into it, and part. The " +
      "field is the ±z ray pair aligned inside a SLAB thinner than the orbit, so B = " +
      "Σ polarity·d̂ points out of the page there and is nothing outside it — drawn as a " +
      "travelling wave over the region it occupies. Each charge is a SINGLE injected ray " +
      "and the line is its position every tick, nothing averaged: they run straight in, " +
      "each banks an opposite fraction of a turn while crossing, and they fly on diverging " +
      "ever after. Reversing the field swaps which goes which way",
    paint: painter(() => [slabRun(+1), slabRun(-1)]),
  }),
  visual({
    id: "steering.magnet", width: 940, height: 470, frames: 160,
    what: "The same charges crossing a REAL magnet's own field — an axial source, so the " +
      "poles are EMISSION's doing rather than a field painted on, and B is nothing but its " +
      "rays summed. Beside it the same crossing through a uniform slab, for what the " +
      "magnet's field costs in raggedness: a field here IS rays, so what crosses one also " +
      "meets it",
    paint: painter(() => [magnetRun(), slabRun(+1)]),
  }),
];
