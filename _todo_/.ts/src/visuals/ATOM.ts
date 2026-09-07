/**
 * THE ATOM - built the only way this model can honestly draw one: by watching where the
 * centre of mass turns up, and counting.
 *
 * WHAT IS BEING DRAWN, AND WHAT IS NOT. There is no orbit here and no circle. A bound
 * thing in this model is not something going round - `G^XOR^c`'s whole reading of mass is
 * that motion CLOSES, and what closes has no "where it is now" that survives asking on a
 * different tick. What does survive is where it is FOUND, over many of them, and that is a
 * density: the only part of a bound state that is not a matter of when you looked.
 *
 * SO THE FILM IS THE ARGUMENT. Nothing is drawn at the first frame. Each frame throws a
 * few thousand more samples at each panel, and the shells come up out of noise - which is
 * what an aggregate IS, and is a thing a still cannot say. THE LAST FRAME IS THE STILL, so
 * the picture on disk is the one the accumulation arrived at.
 *
 * WHERE THE SAMPLES COME FROM. `lib/Atom.ts`, which `theorems/probes/atom.ts` also reads -
 * the same arrays, the same integration, so `atom.hydrogen`'s proof and this picture
 * cannot disagree about a shell. Three theorems went into it and none of them is about
 * atoms: `charge.attraction` for how hard the pair pulls, `charge.falloff` for how that
 * thins with distance, `matter.debroglie` for how many nodes fit in a region. The atom is
 * what is left when all three hold at once.
 *
 * AND THE SAMPLING IS EXACT RATHER THAN REJECTED. A point in the plane is drawn from
 * p(r) proportional to u(r)^{2}/r - the radial density with the plane's own area element
 * folded in - by inverting the cumulative sum over the lattice's own shells, and then an
 * angle from the angular part. Nothing is thrown away, so the noise in the early frames is
 * the noise of a finite count and not of a rejection rate.
 */

import { Painter, Surface, visual } from "./CANVAS.ts";
import {
  A0, ALIKE, CONTRAST, M, OPPOSITE, SHOWN, State, colour, legendre, shells,
} from "../lib/Atom.ts";

const BACK = "#08090d";
const DIM = "#8a8d99";
const FAINT = "#6c7080";
const AMBER = "#e0a878";
const BLUE = "#7fb8d4";


/** a small deterministic generator, so a film is the same film every time it is made */
const rng = (seed: number) => {
  let x = (seed | 0) || 1;
  return () => {
    x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
    return ((x >>> 0) % 16777216) / 16777216;
  };
};

/**
 * HOW TO DRAW A PLACE FROM ONE STATE, in the plane the picture is a plane of.
 *
 * THE AREA ELEMENT IS THE PART THAT IS EASY TO GET WRONG. What is wanted is a point whose
 * density over the PLANE is |R(r)|^{2}|P(cos t)|^{2}. In polar that is r dr dt of it, so
 * the radius is drawn from u(r)^{2}/r and not from u(r)^{2} - the first is the plane's
 * distribution, the second is the shell-summed one that every radial plot shows, and
 * sampling the second puts far too much out at large r. The two differ by exactly the
 * Jacobian and by nothing else.
 */
const sampler = (s: State, m: number) => {
  /* the cumulative radial weight over the lattice's own shells - built once */
  const cdf = new Float64Array(M + 1);
  let acc = 0;
  for (let i = 1; i <= M; i++) {
    acc += s.u[i] * s.u[i] / i;
    cdf[i] = acc;
  }
  const total = acc;
  /* the biggest the angular part gets, for the one rejection that is left */
  let top = 0;
  for (let k = 0; k <= 512; k++)
    top = Math.max(top, legendre(s.l, m, Math.cos(Math.PI * k / 512)) ** 2);

  return (r0: () => number): [number, number] => {
    /* the radius, by bisecting the cumulative sum - exact, not rejected */
    const want = r0() * total;
    let lo = 1, hi = M;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cdf[mid] < want) lo = mid + 1; else hi = mid;
    }
    /* somewhere inside that shell, so the picture is not a picture of the grid */
    const r = lo - 1 + r0();
    /*
     * AND THE ANGLE, WHICH IS THE ONLY THING LEFT DRAWN BY REJECTION - AND IT IS THE
     * ANGLE THAT IS DRAWN, NOT ITS COSINE.
     *
     * A PLANE'S AREA ELEMENT IS r dr dt, so what is wanted is p(t) proportional to
     * |P(cos t)|^{2} - flat in the ANGLE. Drawing cos t flat instead and weighting by
     * |P|^{2} leaves an extra sin t in it, which starves the poles: measured, it turned
     * 2p from a dumbbell along the axis into a four-lobed clover, and put a dark line
     * down the middle of every panel where the axis should have been brightest. The bug
     * is a Jacobian and nothing else, and it is invisible until something with a lobe ON
     * the axis is drawn.
     */
    let c = 0;
    for (let t = 0; t < 64; t++) {
      c = Math.cos(Math.PI * r0());
      if (r0() * top <= legendre(s.l, m, c) ** 2) break;
    }
    const sn = Math.sqrt(Math.max(0, 1 - c * c));
    return [r * sn * (r0() < 0.5 ? -1 : 1), r * c];
  };
};

/* —— the cloud, accumulating —————————————————————————————————————————— */

const PX = 232, GAP = 18, PAD = 34, LABEL = 24, COLS = 4;
const ROWS = Math.ceil(SHOWN.length / COLS);
const WIDTH = PAD * 2 + COLS * PX + (COLS - 1) * GAP;
const HEIGHT = PAD * 2 + ROWS * (PX + LABEL) + (ROWS - 1) * GAP + 26;

/**
 * ONE SCALE OR TWELVE, and the two say different things about the same twelve states.
 *
 *   `one`  every panel the same number of cells across, so what you see is the GROWTH -
 *          r_n going as n^{2}, which is half of what `atom.hydrogen` concludes
 *   `own`  every panel scaled to its own extent, which throws the growth away and shows
 *          the STRUCTURE - the rings and the lobes, which is the other half
 */
const cloud = (scale: "one" | "own") => (): Painter => {
  const states = shells(OPPOSITE);
  const at = (n: number, l: number) => states.find(s => s.n === n && s.l === l)!;
  const outer = Math.max(...SHOWN.map(([n, l]) => at(n, l).mean)) * 1.35;
  const span = (n: number, l: number) => scale === "one" ? outer : at(n, l).mean * 2.1;

  /* one count buffer per panel - the picture IS the counts, and nothing else is kept */
  const counts = SHOWN.map(() => new Float32Array(PX * PX));
  const draws = SHOWN.map(([n, l, m]) => sampler(at(n, l), m));
  const r0 = rng(20260826);
  let thrown = 0;

  return {
    frame: (s: Surface, _dt: number) => {
      const { ctx, width, height } = s;

      /* MORE SAMPLES, EVERY FRAME. This is the whole visual: the shells are not drawn,
       * they are what a count of places arrives at */
      const per = 2600;
      SHOWN.forEach(([n, l], i) => {
        const c = counts[i], sp = span(n, l), draw = draws[i];
        for (let k = 0; k < per; k++) {
          const [x, z] = draw(r0);
          const px = Math.round((x / sp + 1) / 2 * (PX - 1));
          const py = Math.round((1 - z / sp) / 2 * (PX - 1));
          if (px < 0 || py < 0 || px >= PX || py >= PX) continue;
          c[py * PX + px] += 1;
        }
      });
      thrown += per;

      ctx.fillStyle = BACK; ctx.fillRect(0, 0, width, height);

      SHOWN.forEach(([n, l, m], i) => {
        const x0 = PAD + (i % COLS) * (PX + GAP);
        const y0 = PAD + Math.floor(i / COLS) * (PX + LABEL + GAP);
        const c = counts[i];
        let peak = 0;
        for (let k = 0; k < c.length; k++) if (c[k] > peak) peak = c[k];
        const img = ctx.createImageData(PX, PX);
        for (let k = 0; k < c.length; k++) {
          /* CONTRAST is a change to how it is shown and not to the counts, which are
           * what the panel is - and it is the same number the theorem page uses */
          const [R, G, B] = colour(peak > 0 ? Math.pow(c[k] / peak, CONTRAST) : 0);
          img.data[k * 4] = R; img.data[k * 4 + 1] = G; img.data[k * 4 + 2] = B;
          img.data[k * 4 + 3] = 255;
        }
        ctx.putImageData(img, x0, y0);

        ctx.fillStyle = DIM;
        ctx.font = "12px ui-monospace, Menlo, monospace";
        ctx.textAlign = "center";
        ctx.fillText(`n=${n}  l=${l}  m=${m}`, x0 + PX / 2, y0 + PX + 16);
      });

      /* WHAT THE READER IS LOOKING AT, including how much of it there is so far */
      ctx.textAlign = "left";
      ctx.fillStyle = FAINT;
      ctx.font = "12px ui-monospace, Menlo, monospace";
      ctx.fillText(
        `${(thrown * SHOWN.length / 1000) | 0}k places the centre of mass turned up - ` +
        (scale === "one"
          ? `all twelve at one scale, ${Math.round(outer)} cells across`
          : `each panel to its own extent`),
        PAD, height - PAD + 6);
    },
  };
};

/* —— the ladder ——————————————————————————————————————————————————————— */

/**
 * WHAT `atom.hydrogen` ACTUALLY CONCLUDES, drawn as the two things it says: the shells go
 * out as n^{2} and the levels come up as 1/n^{2}.
 *
 * AND THE CONTROL BESIDE IT, which is the sign law with its teeth in. At ALIKE biases
 * `charge.attraction` gives a coupling of nought - there is no well, and the same
 * integration finds nothing bound at all. That empty half is not decoration: it is the
 * difference between "these two attract" and "these two attract BECAUSE their biases
 * oppose", and it is the only part of this picture that could have come out otherwise.
 */
const ladder = (s: Surface) => {
  const { ctx, width, height } = s;
  ctx.fillStyle = BACK; ctx.fillRect(0, 0, width, height);
  const states = shells(OPPOSITE).filter(x => x.l === 0);
  const none = shells(ALIKE);
  const mid = width * 0.46;

  ctx.font = "12px ui-monospace, Menlo, monospace";

  /* —— left: the shells, to scale —— */
  const big = Math.max(...states.map(x => x.mean)) * 1.16;
  const cx = mid * 0.5, cy = height / 2 + 10;
  const k = Math.min(mid * 0.44, height * 0.34) / big;
  for (const x of [...states].reverse()) {
    ctx.beginPath();
    ctx.arc(cx, cy, x.mean * k, 0, Math.PI * 2);
    ctx.strokeStyle = x.n === 1 ? AMBER : BLUE;
    ctx.globalAlpha = x.n === 1 ? 0.95 : 0.26 + 0.1 * (4 - x.n);
    ctx.lineWidth = x.n === 1 ? 1.6 : 1;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = FAINT;
    ctx.textAlign = "center";
    ctx.fillText(`n=${x.n}`, cx, cy - x.mean * k - 6);
  }
  ctx.fillStyle = AMBER;
  ctx.beginPath(); ctx.arc(cx, cy, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = DIM; ctx.textAlign = "center";
  ctx.fillText(`mean radius, to scale - n=1 sits at ${states[0].mean.toFixed(0)} cells`,
    cx, height - 42);
  ctx.fillStyle = FAINT;
  ctx.fillText(`r_n / r_1 = ${states.map(x =>
    (x.mean / states[0].mean).toFixed(0)).join(", ")}      n^2 = 1, 4, 9, 16`,
    cx, height - 24);

  /* —— right: the levels —— */
  const x0 = mid + 40, x1 = width - 250;
  const top = 60, bot = height - 78;
  const deep = Math.abs(states[0].E);
  /*
   * DEEPEST AT THE BOTTOM, which is the way a level diagram is read and was worth getting
   * right: the binding energy is how far DOWN a state sits, so n=1 - the hardest to get
   * off - belongs at the floor and the free line at the ceiling, with the levels crowding
   * up against it as 1/n^{2}. Drawn the other way up it says the opposite of what it means.
   */
  const Y = (E: number) => top + (Math.abs(E) / deep) * (bot - top);
  ctx.strokeStyle = "#1c1e27"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x0 - 14, Y(0)); ctx.lineTo(x1 + 10, Y(0)); ctx.stroke();
  ctx.fillStyle = FAINT; ctx.textAlign = "left";
  ctx.fillText("free - nothing bound above", x1 + 18, Y(0) + 4);
  for (const x of states) {
    const y = Y(x.E);
    ctx.strokeStyle = x.n === 1 ? AMBER : BLUE;
    ctx.globalAlpha = x.n === 1 ? 0.95 : 0.75;
    ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = x.n === 1 ? AMBER : FAINT;
    ctx.fillText(`n=${x.n}   E_1/${x.n * x.n}`, x1 + 18, y + 4);
  }
  ctx.fillStyle = DIM; ctx.textAlign = "center";
  ctx.fillText("the levels, to scale - they crowd up against the free line",
    (x0 + x1) / 2, height - 42);
  ctx.fillStyle = FAINT;
  ctx.fillText(`E_1/E_n = ${states.map(x =>
    (states[0].E / x.E).toFixed(0)).join(", ")}      n^2 = 1, 4, 9, 16`,
    (x0 + x1) / 2, height - 24);

  /* —— and the control across the top, which is the only part that could have gone
   *    otherwise: at ALIKE biases there is no well and nothing to draw —— */
  ctx.textAlign = "left";
  const head = `1 - P_a.P_b = ${OPPOSITE} `;
  ctx.fillStyle = AMBER;
  ctx.fillText(head, PAD, 26);
  ctx.fillStyle = DIM;
  /* measured rather than guessed at, so the two halves cannot run into each other when
   * the coupling is printed with a different number of digits */
  ctx.fillText(`for one body biased each way, and the well holds ${states.length} ` +
    `s-states.   Biased ALIKE it is ${ALIKE}: no well, ${none.length} bound states, ` +
    `nothing to draw.`, PAD + ctx.measureText(head).width, 26);
};

/* —— the profiles ————————————————————————————————————————————————————— */

/**
 * THE RADIAL PROFILES, WITH THE NODES COUNTED - what the panels above are a picture of,
 * before the angle is put back.
 *
 * THE INTEGER IS THE POINT. Each curve crosses zero n - l - 1 times, and that count was
 * read off the integration rather than imposed: `matter.debroglie` says a region holds a
 * whole number of nodes and this is where the whole number turns up.
 */
const profiles = (s: Surface) => {
  const { ctx, width, height } = s;
  ctx.fillStyle = BACK; ctx.fillRect(0, 0, width, height);
  const states = shells(OPPOSITE).filter(x => x.l === 0);
  /*
   * OUT AS FAR AS THE PROFILES GO, not as far as the turning point. Cutting at the turning
   * point clipped n=4 while it was still a long way from nought, so the picture showed a
   * curve running off the edge and a reader counting nodes had to take the last one on
   * trust. The extent is where every state has actually decayed away.
   */
  const tail = (u: Float64Array) => {
    let peak = 0, last = 1;
    for (let i = 1; i <= M; i++) peak = Math.max(peak, Math.abs(u[i]));
    for (let i = M; i > 1; i--) if (Math.abs(u[i]) > 5e-3 * peak) { last = i; break; }
    return last;
  };
  const far = Math.max(...states.map(x => tail(x.u))) * 1.02;
  const L = PAD + 40, R = width - PAD - 240, T = 44, B = height - 62;
  const X = (r: number) => L + (r / far) * (R - L);

  ctx.strokeStyle = "#1c1e27"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(L, (T + B) / 2); ctx.lineTo(R, (T + B) / 2); ctx.stroke();

  /* the scale, in cells - the lattice's own step, so a reader can count them */
  ctx.fillStyle = FAINT; ctx.textAlign = "center";
  for (const r of [0, 200, 400, 600, 800, 1000, 1200].filter(v => v <= far)) {
    ctx.strokeStyle = "#14161d";
    ctx.beginPath(); ctx.moveTo(X(r), B); ctx.lineTo(X(r), B + 5); ctx.stroke();
    ctx.fillText(`${r}`, X(r), B + 18);
  }

  ctx.font = "12px ui-monospace, Menlo, monospace";
  states.forEach((st, i) => {
    let peak = 0;
    for (let k = 1; k <= M; k++) peak = Math.max(peak, Math.abs(st.u[k]));
    const amp = (B - T) / 2 * 0.86;
    ctx.beginPath();
    for (let k = 1; k <= M; k++) {
      const r = k;
      if (r > far) break;
      const y = (T + B) / 2 - (st.u[k] / peak) * amp;
      if (k === 1) ctx.moveTo(X(r), y); else ctx.lineTo(X(r), y);
    }
    ctx.strokeStyle = st.n === 1 ? AMBER : BLUE;
    ctx.globalAlpha = st.n === 1 ? 0.95 : 0.35 + 0.18 * (4 - st.n);
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = FAINT;
    ctx.textAlign = "left";
    ctx.fillStyle = st.n === 1 ? AMBER : FAINT;
    ctx.fillText(`n=${st.n}, l=0 - ${st.nodes} node${st.nodes === 1 ? "" : "s"}` +
      `, mean ${st.mean.toFixed(0)} cells`, R + 24, T + 16 + i * 18);
  });

  ctx.fillStyle = DIM; ctx.textAlign = "center";
  ctx.fillText("r·R(r) against r, in cells of the lattice - the crossings are the nodes, " +
    "counted off the integration and whole in every state", (L + R) / 2, height - 20);
};

export default [
  visual({
    id: "atom.cloud",
    width: WIDTH, height: HEIGHT, frames: 110,
    what: "where the centre of mass turns up, counted - the twelve lowest states of a " +
      "pair whose biases oppose, all at one scale so the n^2 growth is what you see. " +
      "Nothing is drawn at the first frame; the shells come up out of the count, which " +
      "is what an aggregate is. No orbit and no circle anywhere in it",
    paint: cloud("one"),
  }),
  visual({
    id: "atom.cloud.own-scale",
    width: WIDTH, height: HEIGHT, frames: 110,
    what: "the same twelve, each panel scaled to its own extent - which throws the " +
      "growth away and shows the structure instead: n-l-1 rings across, l-|m| nodal " +
      "cones and |m| nodal planes round",
    paint: cloud("own"),
  }),
  visual({
    id: "atom.ladder", width: 1200, height: 520, frames: 1,
    what: "what atom.hydrogen concludes, drawn to scale: the shells out as n^2 and the " +
      "levels up as 1/n^2 - with the control across the top, where two bodies biased " +
      "ALIKE have a coupling of nought and nothing is bound at all",
    paint: () => ({ frame: ladder }),
  }),
  visual({
    id: "atom.profiles", width: 1200, height: 420, frames: 1,
    what: "the radial profiles the panels are a picture of, before the angle is put " +
      "back - each crossing zero n-l-1 times, a count read off the integration rather " +
      "than imposed",
    paint: () => ({ frame: profiles }),
  }),
];
