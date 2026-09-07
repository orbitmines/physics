/**
 * THE DRAWING, KEPT APART FROM THE CASTING - so that changing how a picture looks costs
 * milliseconds instead of six million rays.
 *
 * Twice now a rendering decision has been wrong in a way only visible in the picture - a frame
 * too wide, then a mask far too big - and each time fixing it meant re-running the whole sweep,
 * because the fields only ever existed inside the process that made them. They are written to
 * disk now, and this is the half that reads them. `rays-run.ts` imports `render` so there is one
 * implementation and not two that drift.
 *
 * usage (re-render everything already cast under a tag):
 *   npx tsx scratch/rays-draw.ts rays45
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { png } from "../src/theorems/probes/png.ts";

export type Meta = { n: number; l: number; m: number; frame: number; NR: number; NU: number };

const STOPS = [[6,8,14],[20,45,95],[70,130,200],[190,220,245],[255,205,140]];

/**
 * `scale` says how the numbers are mapped to the ramp, and the choice is not cosmetic.
 *
 *   "shell"  the field is already r^2 times a density, so it is finite at the origin and a
 *            plain power curve reads it. Nothing is masked but the innermost bin, where the
 *            r^2 weight is taken at the bin's midpoint and is wrong by a factor of order one.
 *   "log"    the field is a density per unit volume and a point source puts a 1/r^2 in it, so
 *            the middle is orders above the rim and a linear ramp shows the singularity and
 *            nothing else. Four decades on a log scale shows the whole of it. THIS IS WHY THE
 *            RAW CHANNEL WAS MASKED, and a mask was the wrong answer: it hid the divergence
 *            rather than displaying it, and took a tenth of the frame with it.
 *   "signed" a diverging ramp about nought, for the channels that carry a sign.
 */
export const render = (
  dir: string, meta: Meta, f: Float64Array, name: string,
  scale: "shell" | "raw" | "signed" | "positive", maskFrac = 0.015,
) => {
  const { NR, NU, frame: R } = meta;
  const PX = 961, mid = (PX - 1) / 2;
  /*
   * THE MASK IS PER CHANNEL, because what the innermost radius means differs by channel and one
   * setting for all of them broke two pictures at once.
   *
   * An r^2-weighted field is finite at the origin and wants almost no mask - a bin and a half,
   * where the r^2 weight is taken at the bin's midpoint and is wrong by a factor of order one.
   * But a SHAPE field is each radius against its own mean, and the innermost ring is a mean over
   * a handful of samples: it is noise, it is large, and with no mask it set `hi` and washed the
   * whole picture into one shade. And a RAW per-volume density carries the point source's 1/r^2,
   * so it needs a real one or the singularity is the only thing drawn.
   *
   * A log ramp was tried for the raw channel instead of a mask, on the reasoning that a
   * divergence should be displayed rather than hidden. It is worse: the density runs over seven
   * decades across the frame and compressing that into the ramp leaves the angular variation - a
   * factor of a few - as a colour difference too small to see. The 2p came out a flat blue disc
   * with its lobes gone. A modest mask and a power curve keeps the shape, which is the thing
   * being looked for.
   */
  const mask = maskFrac * R;

  const img = new Float64Array(PX * PX);
  const seen = new Uint8Array(PX * PX);
  for (let j = 0; j < PX; j++) for (let i = 0; i < PX; i++) {
    const rho = (i - mid) / mid * R, zz = (j - mid) / mid * R;
    const r = Math.hypot(rho, zz);
    if (r >= R || r < mask) continue;
    const ir = Math.min(NR - 1, Math.floor(r / R * NR));
    const iu = Math.min(NU - 1, Math.floor(((r > 0 ? zz / r : 0) + 1) / 2 * NU));
    img[j * PX + i] = f[ir * NU + iu]; seen[j * PX + i] = 1;
  }
  let hi = 0;
  for (let k = 0; k < img.length; k++) if (seen[k]) hi = Math.max(hi, Math.abs(img[k]));

  const rgb = new Uint8Array(PX * PX * 3);
  for (let j = 0; j < PX; j++) for (let i = 0; i < PX; i++) {
    const k = j * PX + i, v = img[k];
    let c: number[];
    if (!seen[k]) c = STOPS[0];
    else if (scale === "signed") {
      const u = Math.max(-1, Math.min(1, v / (hi || 1))), p = Math.pow(Math.abs(u), 0.5);
      c = u >= 0 ? [20 + 235*p, 20 + 130*p, 20 + 60*p] : [20 + 60*p, 20 + 140*p, 20 + 235*p];
    } else {
      /*
       * A POSITIVE RAMP CLAMPS THE NEGATIVE SIDE TO BLACK - it does not fold it up.
       *
       * This was `abs`, and for a field that is positive anyway - the cloud, the density - the
       * two are the same. For a SHAPE channel they are not: `f/mean - 1` runs about -1 to +2,
       * so folding it lights the equatorial torus as brightly as the polar lobes and leaves
       * only the nodes dark. The picture came out one flat shade of blue with two dark cones in
       * it, and the dipole it was supposed to show was gone. `atom.cloud` clamps, and clamping
       * is what makes a lobe read as a lobe: what is drawn is where this state puts MORE than a
       * sphere would at that radius, and the rest is ground.
       */
      const u = scale === "positive" ? Math.max(0, v) : Math.abs(v);
      const t = Math.pow(Math.max(0, Math.min(1, u / (hi || 1))), 0.45);
      const ff = t * (STOPS.length - 1);
      const k0 = Math.min(STOPS.length - 2, Math.floor(ff)), fr = ff - k0;
      c = [0,1,2].map(q => STOPS[k0][q] + (STOPS[k0+1][q] - STOPS[k0][q]) * fr);
    }
    const q = ((PX - 1 - j) * PX + i) * 3;
    rgb[q] = c[0]|0; rgb[q+1] = c[1]|0; rgb[q+2] = c[2]|0;
  }
  writeFileSync(`${dir}/n${meta.n}l${meta.l}m${meta.m}-${name}.png`,
    Buffer.from(png(PX, PX, rgb), "base64"));
  return hi;
};

/** r^2 times a density: how much happens in a SHELL at r, which is the picture of an orbital */
export const shell = (f: Float64Array, meta: Meta) => {
  const out = new Float64Array(f.length);
  for (let ir = 0; ir < meta.NR; ir++) {
    const r = (ir + 0.5) * meta.frame / meta.NR;
    for (let iu = 0; iu < meta.NU; iu++) out[ir*meta.NU + iu] = f[ir*meta.NU + iu] * r * r;
  }
  return out;
};

/** each radius against its own mean: the dependence on ANGLE, with the falloff divided out */
export const shape = (f: Float64Array, meta: Meta) => {
  const out = new Float64Array(f.length);
  for (let ir = 0; ir < meta.NR; ir++) {
    let mean = 0;
    for (let iu = 0; iu < meta.NU; iu++) mean += f[ir*meta.NU + iu];
    mean /= meta.NU;
    for (let iu = 0; iu < meta.NU; iu++)
      out[ir*meta.NU + iu] = mean ? f[ir*meta.NU + iu] / mean - 1 : 0;
  }
  return out;
};

/** every picture a state gets, in one place, so `rays-run` and a re-render cannot disagree */
export const renderAll = (dir: string, meta: Meta,
  fields: { dens: Float64Array; turns: Float64Array; pol: Float64Array }) => {
  const sh = shape(fields.turns, meta);
  /* r^2-weighted: finite at the origin, so barely masked */
  render(dir, meta, shell(fields.dens, meta), "density", "shell", 0.015);
  render(dir, meta, shell(fields.turns, meta), "cloud", "shell", 0.015);
  /* raw per volume: carries the source's 1/r^2, so masked like the lattice masks its body */
  render(dir, meta, fields.turns, "turns", "raw", 0.06);
  render(dir, meta, fields.pol, "polarity-signed", "signed", 0.06);
  /* each radius against its own mean: the innermost ring is a mean over almost nothing */
  render(dir, meta, sh, "turns-shape", "positive", 0.06);
  render(dir, meta, sh, "turns-shape-signed", "signed", 0.06);
};

/* ---- run directly to re-render whatever is already on disk ---------------------------- */
if (process.argv[1]?.endsWith("rays-draw.ts")) {
  const TAG = process.argv[2] ?? "rays45";
  const dir = `/home/fadi/Desktop/orbitmines/physics/visuals/vacuum/${TAG}`;
  const load = (p: string) => {
    const b = readFileSync(p);
    return Float64Array.from(new Float32Array(b.buffer, b.byteOffset, b.byteLength / 4));
  };
  let done = 0;
  for (const st of ["1,0,0","2,1,0","3,2,0","2,0,0","2,1,1","3,0,0","3,1,0","3,2,1",
                    "4,0,0","4,1,0","4,2,1","4,3,2"]) {
    const [n,l,m] = st.split(",").map(Number);
    const mp = `${dir}/n${n}l${l}m${m}-meta.json`;
    if (!existsSync(mp)) continue;
    const meta = JSON.parse(readFileSync(mp, "utf8")) as Meta;
    renderAll(dir, meta, {
      dens: load(`${dir}/n${n}l${l}m${m}-dens.f32`),
      turns: load(`${dir}/n${n}l${l}m${m}-turns.f32`),
      pol: load(`${dir}/n${n}l${l}m${m}-pol.f32`),
    });
    console.log(`  redrew n=${n} l=${l} m=${m}  frame ${meta.frame.toFixed(2)} mfp`);
    done++;
  }
  console.log(`${done} state(s) redrawn from disk -> ${dir}`);
}
