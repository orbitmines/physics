/**
 * THE LATTICE DIVIDED OUT, BY MEASURING IT ON A STATE THAT HAS NO SHAPE.
 *
 * The 1s source is isotropic by construction: it emits Y00, the same amount down every exit. So
 * whatever angular structure its `-shape` channel carries came from the LATTICE and from nothing
 * else - and measured, that is not small. On fcc-12 the 1s shape channel is four diagonal lobes
 * and an eight-fold rosette at eleven per cent of the cloud; on icosahedral-12 it is richer than
 * that. A 2p or 3d picture drawn on the same lattice is therefore not to be compared with black.
 * It is to be compared with THIS.
 *
 * The comparison is made on the angular MODULATION rather than on the field, because the two
 * states put out different amounts at different radii and that difference is not the lattice's
 * doing. At each radius the field is divided by its own mean round the ring:
 *
 *     ahat(r, theta) = a(r, theta) / <a>_theta (r)
 *
 * which is 1 everywhere for a perfectly isotropic response whatever its radial profile. Then
 *
 *     d(r, theta) = ahat_state(r, theta) - ahat_1s(r, theta)
 *
 * is what this state does to the angle that the lattice does not do on its own. Subtracting is
 * used rather than dividing because ahat_1s passes through nought at the lattice's own nodes and
 * a ratio there is a division by nothing.
 *
 * usage: npx tsx scratch/beamless.ts <tag> <n,l,m> [channel]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { png } from "../src/theorems/probes/png.ts";

const TAG = process.argv[2] ?? "c26all";
const [n, l, m] = (process.argv[3] ?? "2,1,0").split(",").map(Number);
const CH = process.argv[4] ?? "accT";
const dir = `/home/fadi/Desktop/orbitmines/physics/visuals/vacuum/${TAG}`;

const meta = JSON.parse(readFileSync(`${dir}/n${n}l${l}m${m}-meta.json`, "utf8"));
const { R, PXM, mask: MASK } = meta as { R: number; PXM: number; mask: number };

const load = (nn: number, ll: number, mm: number) => {
  const b = readFileSync(`${dir}/n${nn}l${ll}m${mm}-${CH}.f32`);
  const f = new Float32Array(b.buffer, b.byteOffset, b.byteLength / 4);
  return Float64Array.from(f);
};

const mid = (PXM - 1) / 2, perCell = (PXM - 1) / (2 * R);
const rOf = (i: number, j: number) => Math.hypot(i - mid, j - mid) / perCell;

/** a / <a> round each ring - 1 everywhere for an isotropic response, whatever its falloff */
const modulation = (a: Float64Array) => {
  const NB = Math.ceil(rOf(PXM - 1, PXM - 1)) + 1;
  const sum = new Float64Array(NB), cnt = new Float64Array(NB);
  for (let j = 0; j < PXM; j++) for (let i = 0; i < PXM; i++) {
    const b = Math.round(rOf(i, j)); sum[b] += a[j * PXM + i]; cnt[b]++;
  }
  /*
   * A RING WHOSE MEAN IS NEARLY NOUGHT CANNOT BE NORMALISED BY IT, and icosahedral-12 has one:
   * its turning excess runs +230 at the middle to -120 at the rim, so somewhere near r = 4.5 the
   * ring mean passes through zero. Dividing there turns that ring's noise into the largest thing
   * in the picture. Rings within five per cent of the largest ring mean of nought are left BLACK
   * instead - the honest answer being that this radius carries no scale to measure an angle
   * against, not that it carries no angle.
   */
  /*
   * THE RADIAL MEAN IS SMOOTHED BEFORE IT IS DIVIDED BY, or the picture comes out in rings.
   *
   * The bins are one PIXEL of radius wide and the image is four pixels to the cell, so four
   * neighbouring bins sample the same cells in different proportions and their means ripple
   * against each other by a few per cent. Dividing by that ripple stamps it into every pixel,
   * and it showed as concentric banding across the whole frame. The profile a source makes is
   * smooth on the scale of a cell by construction - it is a mean free path and a decay - so a
   * moving average over half a cell removes the sampling and not the physics.
   */
  const mu0 = new Float64Array(NB);
  for (let b = 0; b < NB; b++) mu0[b] = cnt[b] ? sum[b] / cnt[b] : 0;
  const H = Math.max(1, Math.round(perCell / 2));
  const mu = new Float64Array(NB);
  for (let b = 0; b < NB; b++) {
    let acc = 0, k = 0;
    for (let q = b - H; q <= b + H; q++) if (q >= 0 && q < NB && cnt[q]) { acc += mu0[q]; k++; }
    mu[b] = k ? acc / k : 0;
  }
  let big = 0;
  for (let b = 0; b < NB; b++) big = Math.max(big, Math.abs(mu[b]));
  const out = new Float64Array(a.length);
  for (let j = 0; j < PXM; j++) for (let i = 0; i < PXM; i++) {
    const b = Math.round(rOf(i, j));
    out[j * PXM + i] = Math.abs(mu[b]) < 0.05 * big ? 0 : a[j * PXM + i] / mu[b];
  }
  return out;
};

/*
 * AND HALF A CELL OF BLUR, because trilinear interpolation is only C0 and the kinks show.
 *
 * `lerp3` is linear between the eight cells around a point, so its derivative JUMPS at every
 * cell boundary. Against a field that is falling steeply that is invisible; against the field
 * divided by its own smooth radial trend it is all that is left, and it drew as concentric
 * banding one cell apart across the whole picture. It is not the physics and it is not the
 * lattice's anisotropy either - it is the reconstruction's own seams, and it survived smoothing
 * the radial profile because it is in the field and not in the profile.
 *
 * A Gaussian of half a cell removes them. Nothing is lost: the grid holds no information below
 * one cell, so a feature narrower than the blur was never measured in the first place.
 */
const blur = (a: Float64Array, sigmaPx: number) => {
  const rad = Math.max(1, Math.ceil(2 * sigmaPx));
  const w: number[] = [];
  for (let d = -rad; d <= rad; d++) w.push(Math.exp(-(d * d) / (2 * sigmaPx * sigmaPx)));
  const pass = (src: Float64Array, alongX: boolean) => {
    const out = new Float64Array(src.length);
    for (let j = 0; j < PXM; j++) for (let i = 0; i < PXM; i++) {
      let acc = 0, ws = 0;
      for (let d = -rad; d <= rad; d++) {
        const ii = alongX ? i + d : i, jj = alongX ? j : j + d;
        if (ii < 0 || jj < 0 || ii >= PXM || jj >= PXM) continue;
        acc += w[d + rad] * src[jj * PXM + ii]; ws += w[d + rad];
      }
      out[j * PXM + i] = ws ? acc / ws : 0;
    }
    return out;
  };
  return pass(pass(a, true), false);
};

const A = blur(modulation(load(n, l, m)), perCell / 2);
const B = blur(modulation(load(1, 0, 0)), perCell / 2);
const d = new Float64Array(A.length);
for (let i = 0; i < d.length; i++) d[i] = A[i] - B[i];

const shown = (i: number, j: number) => {
  const r = rOf(i, j);
  return r > MASK && r <= R;
};

const write = (raw: Float64Array, name: string, signed: boolean) => {
  let hi = 0;
  for (let j = 0; j < PXM; j++) for (let i = 0; i < PXM; i++)
    if (shown(i, j)) hi = Math.max(hi, Math.abs(raw[j * PXM + i]));
  const SC = Math.max(1, Math.round(640 / PXM)), W = PXM * SC, H = W;
  const rgb = new Uint8Array(W * H * 3);
  for (let j = 0; j < PXM; j++) for (let i = 0; i < PXM; i++) {
    const raw0 = shown(i, j) ? raw[j * PXM + i] / (hi || 1) : 0;
    let c: number[];
    if (signed) {
      const v = Math.max(-1, Math.min(1, raw0)), p = Math.pow(Math.abs(v), 0.5);
      c = v >= 0 ? [20 + 235 * p, 20 + 130 * p, 20 + 60 * p]
                 : [20 + 60 * p, 20 + 140 * p, 20 + 235 * p];
    } else {
      const t = Math.pow(Math.max(0, Math.min(1, Math.abs(raw0))), 0.45);
      const stops = [[6,8,14],[20,45,95],[70,130,200],[190,220,245],[255,205,140]];
      const f = t * (stops.length - 1), k0 = Math.min(stops.length - 2, Math.floor(f)), fr = f - k0;
      c = [0,1,2].map(q => stops[k0][q] + (stops[k0+1][q] - stops[k0][q]) * fr);
    }
    for (let dy = 0; dy < SC; dy++) for (let dx = 0; dx < SC; dx++) {
      const k = (((PXM - 1 - j) * SC + dy) * W + i * SC + dx) * 3;
      rgb[k] = c[0]|0; rgb[k+1] = c[1]|0; rgb[k+2] = c[2]|0;
    }
  }
  writeFileSync(`${dir}/n${n}l${l}m${m}-${name}.png`, Buffer.from(png(W, H, rgb), "base64"));
  return hi;
};

/* how big the lattice's own modulation is, so the picture can be believed or not */
const rms = (a: Float64Array) => {
  let s = 0, k = 0;
  for (let j = 0; j < PXM; j++) for (let i = 0; i < PXM; i++)
    if (shown(i, j)) { s += a[j * PXM + i] * a[j * PXM + i]; k++; }
  return Math.sqrt(s / Math.max(1, k));
};
console.log(`${TAG} n=${n} l=${l} m=${m} ${CH}` +
  `  |state modulation|=${rms(A).toFixed(3)}  |lattice (1s)|=${rms(B).toFixed(3)}` +
  `  |difference|=${rms(d).toFixed(3)}`);
console.log(`  wrote beamless=${write(d, `${CH}-beamless`, false).toExponential(2)}  ` +
  `beamless-signed=${write(d, `${CH}-beamless-signed`, true).toExponential(2)}  -> ${dir}`);
