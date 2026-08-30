/**
 * ONE STATE, EVERY RATE DERIVED, AND THE VACUUM SUBTRACTED RATHER THAN ASSUMED.
 *
 * What is different from what came before, and each of them was an assumption that is now not
 * one:
 *
 *   the rates      come from `derived.ts`, each read off the rule it stands for
 *   the background is a SECOND RUN with no source in it, subtracted cell by cell - not a
 *                  scalar guessed from the seeding, which is what made the cloud uniformly
 *                  blue: subtracting the wrong constant tilts every cell the same way
 *   the winding    is `axisAt` said as an angle - m ring steps a beat, CYCLE steps to a turn
 *   the output     goes to its own folder, so nothing overwrites what came before it
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { png } from "../src/theorems/probes/png.ts";
import { GEOMETRIES } from "../src/lib/Local.ts";
import { emit, grid, opposite, polarity, section, step } from "../src/lib/Vlasov2.ts";
import { pool } from "../src/lib/Vlasov3.ts";
import { derive, OCCUPANCY, spinPerTick } from "./derived.ts";

const lag = (k: number, a: number, x: number): number => {
  if (k === 0) return 1;
  if (k === 1) return 1 + a - x;
  let Lm = 1, L = 1 + a - x;
  for (let i = 1; i < k; i++) { const Ln = ((2*i+1+a-x)*L - (i+a)*Lm)/(i+1); Lm = L; L = Ln; }
  return L;
};
const Rnl = (n: number, l: number, a0: number, r: number) => {
  const rho = 2*r/(n*a0);
  return Math.pow(rho, l) * Math.exp(-rho/2) * lag(n-l-1, 2*l+1, rho);
};
const leg = (l: number, m: number, x: number): number => {
  let pmm = 1;
  if (m > 0) { const s = Math.sqrt(Math.max(0,1-x*x)); let f = 1;
    for (let i = 1; i <= m; i++) { pmm *= -f*s; f += 2; } }
  if (l === m) return pmm;
  let p1 = x*(2*m+1)*pmm;
  if (l === m+1) return p1;
  for (let ll = m+2; ll <= l; ll++) { const pr = ((2*ll-1)*x*p1 - (ll+m-1)*pmm)/(ll-m);
    pmm = p1; p1 = pr; }
  return p1;
};

const [n, l, m] = (process.argv[2] ?? "2,1,0").split(",").map(Number);
const TAG = process.argv[3] ?? "derived";
/* the box follows the frame instead of being nailed to 41, which capped every render at a
 * thirteen-cell section however large R was asked for */
/*
 * THE GEOMETRY IS AN ARGUMENT, because it is the lever that works on the beams.
 *
 * Measured on the 3d state: correlating the angular profile against the emitted harmonic and
 * against a nearest-exit beam model, fcc-12 gives the beams 0.65-0.70 and the orbital 0.11-0.32
 * - the lattice's own directions dominate. icosahedral-12 has the SAME twelve exits spread as
 * evenly as twelve can be, and the beam correlation roughly halves to 0.21-0.48 while the
 * orbital holds. Same DEG, so nothing but the evenness changed.
 */
const GEOM = process.env.GEOM ?? "fcc-12";
const g: any = (GEOMETRIES as any)[GEOM];
if (!g) throw new Error(`no geometry called ${GEOM} - have ${Object.keys(GEOMETRIES).join(", ")}`);
const N = Number(process.argv[7] ?? 2 * Number(process.argv[5] ?? 6) + 13);
const C = (N - 1) >> 1;
/*
 * CUT TO THE STRUCTURE. At the derived rates the cloud is one to three cells - the mean free
 * path, measured - so drawing sixteen put the shape in the middle sixth of the frame and let
 * the empty remainder set nothing but the noise. Six is the cloud and a margin.
 */
const R = Number(process.argv[5] ?? 6);
/*
 * HOW LONG IT IS RUN, AND WHETHER THAT MATTERS, is a question rather than a setting: a cloud
 * that is still sharpening has not converged, and one that is not is telling you what it is.
 * The first third is always discarded as the vacuum settling round the source.
 */
const TICKS = Number(process.argv[4] ?? 260);
/*
 * a0 IS THE ONE SCALE PUT IN, and it is free because every claim here is a RATIO. The state is
 * sized so its outermost feature sits inside the box; a smaller atom is the same atom drawn
 * smaller. It is stated rather than hidden.
 */
const a0 = 22 / (n * n);
const PERIOD = Math.max(1, Math.ceil(4 * n * n * a0));
/*
 * AND WHAT THE CORNER MAKES, which is the whole of the mass question.
 *
 * `shine` 0 is `G^XOR+XOR`, which has no corner rule and is the default here. Above nought
 * this is `G^XOR^o`, and `carries` says what the recoil sheds. Measured on the lattice with
 * the log armed, `makes: "polarity"` leaves 279 closed orbits and a polarity residue of 0.88
 * while `makes: "charge"` leaves 12 and 0.13 - matter almost stops existing - so a cloud drawn
 * under the two should not look alike either.
 *
 * The shine is kept small on purpose: swept, the polarity variant holds a real vacuum up to
 * about 0.02 (rho 0.146 against the bare 0.1945) and saturates by 0.05. What is drawn at 0.02
 * is therefore a cloud in a vacuum, not a cloud in a filled box.
 */
const SHINE = Number(process.argv[8] ?? 0);
const CARRIES = (process.argv[9] ?? "polarity") as "inherit" | "polarity" | "charge";
const RATES = { ...derive(g), shine: SHINE, carries: CARRIES };
const spin = spinPerTick(g, m, 1);

const ylm = (d: number, t: number) => {
  const u = g.U[d], mg = Math.hypot(u[0], u[1], u[2] ?? 0) || 1;
  const P = leg(l, m, (u[2] ?? 0) / mg);
  if (m === 0) return P;
  return P * Math.cos(m * Math.atan2(u[1] ?? 0, u[0] ?? 0) - spin * t);
};

/** the two runs, identical but for the source - the background is measured, not assumed */
const G = grid(g, N), K = grid(g, N);
for (const a of G.n) a.fill(OCCUPANCY / 4);
for (const a of K.n) a.fill(OCCUPANCY / 4);

const PX = 2 * R + 1;
/*
 * ACROSS THE CORES WHEN ASKED. `WORKERS=n` runs the sourced grid and its control through a pool
 * each; unset, it is the serial step and nothing changes. Measured at N=61 the pool is 3.3x the
 * serial one and agrees with it to a relative L2 of 3e-16 - the same arithmetic in a different
 * order, which is what a reordering costs and no more.
 */
const WORKERS = Number(process.env.WORKERS ?? 0);
let tick: () => Promise<void>;
let closePools: () => Promise<void> = async () => {};
if (WORKERS > 0) {
  const pG = await pool(G, RATES as any, GEOM, false, WORKERS);
  const pK = await pool(K, RATES as any, GEOM, false, WORKERS);
  /* every array the render reads has to be the pool's, not the grid's own - `turns` was left
   * behind here, so the workers filled the shared one while the picture read a local zero and
   * the cloud channel came out empty under WORKERS and correct without it */
  (G as any).n = pG.S.n; (G as any).space = pG.S.space; (G as any).turns = pG.S.turns;
  (K as any).n = pK.S.n; (K as any).space = pK.S.space; (K as any).turns = pK.S.turns;
  tick = async () => { pG.step(); pK.step(); };
  closePools = async () => { await pG.close(); await pK.close(); };
} else {
  tick = async () => { step(G, RATES); step(K, RATES); };
}

/*
 * SAMPLED AS A CONTINUOUS FIELD, WHICH IS WHAT IT IS - and the squares were an ALIAS.
 *
 * The lattice holds a field that is continuous underneath; the cells are where it was sampled,
 * not what it is. The first attempt at this binned by `Math.round(rho)` and `Math.round(z)`,
 * which resamples one lattice onto another by nearest neighbour - and nearest-neighbour
 * resampling of a periodic structure is a MOIRE. That is what squares within squares within
 * squares are: not the physics, and not even the twelve beams, but the beat between the fcc
 * lattice and the pixel grid I was dropping it into. Averaging round the axis kept the alias
 * and just rearranged it, which is why the picture did not improve.
 *
 * So the field is RECONSTRUCTED instead of binned. Each output pixel is a point in (rho, z),
 * the azimuth is integrated as a continuum rather than as whatever cells happened to land in a
 * bin, and every sample is taken by trilinear interpolation between the eight cells around it.
 * Interpolating is a low pass: it removes the Nyquist modes - the cell-by-cell alternation and
 * the parity seam both - because those are exactly the modes a linear reconstruction cannot
 * carry. Nothing is thrown away that the sampling could have represented.
 *
 * The picture can then be drawn at any resolution, because it is a function being evaluated
 * rather than an array being blown up.
 */
const NPHI = 120;                       // azimuth samples per pixel - the continuum, discretised finely
const PXM = 2 * R * 4 + 1;              // four pixels per cell, so the image is not the lattice

const scalar = (nn: any, of: "charge" | "polarity") => {
  const f = new Float64Array(N * N * N);
  const P4 = [1, 1, -1, -1];
  for (let c = 0; c < N * N * N; c++) {
    const b0 = c * g.DEG;
    let v = 0;
    if (of === "charge") { for (const sl of [1, 3]) for (let d = 0; d < g.DEG; d++) v += nn[sl][b0 + d]; }
    else { for (let sl = 0; sl < 4; sl++) for (let d = 0; d < g.DEG; d++) v += nn[sl][b0 + d] * P4[sl]; }
    f[c] = v;
  }
  return f;
};

/*
 * ONE SUBLATTICE AT A TIME, because they are two different solutions and averaging them is
 * averaging one against the other.
 *
 * fcc-12 steps by <110>, so the parity of x+y+z never changes and the lattice is two interleaved
 * copies that streaming NEVER mixes - coupled only by what happens inside a cell. Measured on
 * the charge left over after the control is removed, the two carry different amounts and often
 * OPPOSITE SIGN: at radii 2 to 12 the ratio of their means runs -7.5, -0.34, 0.18, -0.67, 0.52,
 * 0.62. They are not two samples of one field. They are two fields.
 *
 * Trilinear interpolation reaches the eight cells around a point, which straddle BOTH parities,
 * so it averages the two against each other and what survives is mostly their difference. That
 * is the orange-and-blue alternation at cell scale, and it is why smoothing made the picture
 * worse rather than better: the smoother the reconstruction, the more completely the signal
 * cancelled itself.
 *
 * So the field is rebuilt from ONE parity. Each cell takes a Gaussian-weighted average of the
 * cells around it that belong to the chosen sublattice - which for a cell of the other parity
 * means reaching an odd number of steps away. The result is a smooth field defined everywhere
 * that is a reconstruction of one solution rather than a blend of two.
 */
const parityField = (f: Float64Array, par: number) => {
  const out = new Float64Array(f.length);
  const RAD = 2, s2 = 2 * 1.0 * 1.0;
  for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) for (let z = 0; z < N; z++) {
    let acc = 0, wsum = 0;
    for (let dx = -RAD; dx <= RAD; dx++) for (let dy = -RAD; dy <= RAD; dy++)
      for (let dz = -RAD; dz <= RAD; dz++) {
        const xi = x + dx, yi = y + dy, zi = z + dz;
        if (xi < 0 || yi < 0 || zi < 0 || xi >= N || yi >= N || zi >= N) continue;
        if (par >= 0 && (((xi + yi + zi) % 2) + 2) % 2 !== par) continue;   // this sublattice only
        const w = Math.exp(-(dx*dx + dy*dy + dz*dz) / s2);
        acc += w * f[(xi * N + yi) * N + zi]; wsum += w;
      }
    out[(x * N + y) * N + z] = wsum > 0 ? acc / wsum : 0;
  }
  return out;
};

/** the field between the samples - trilinear, which is the reconstruction the grid supports */
const lerp3 = (f: Float64Array, x: number, y: number, z: number) => {
  const x0 = Math.floor(x), y0 = Math.floor(y), z0 = Math.floor(z);
  const fx = x - x0, fy = y - y0, fz = z - z0;
  let v = 0;
  for (let dx = 0; dx < 2; dx++) for (let dy = 0; dy < 2; dy++) for (let dz = 0; dz < 2; dz++) {
    const xi = x0 + dx, yi = y0 + dy, zi = z0 + dz;
    if (xi < 0 || yi < 0 || zi < 0 || xi >= N || yi >= N || zi >= N) continue;
    v += (dx ? fx : 1 - fx) * (dy ? fy : 1 - fy) * (dz ? fz : 1 - fz) * f[(xi * N + yi) * N + zi];
  }
  return v;
};

const meridian = (f: Float64Array, m: number) => {
  const out = new Float64Array(PXM * PXM);
  const step2 = (2 * R) / (PXM - 1);
  for (let j = 0; j < PXM; j++) {
    const zz = -R + j * step2;
    for (let i = 0; i < PXM; i++) {
      const rho = Math.abs(-R + i * step2);
      let acc = 0;
      for (let k = 0; k < NPHI; k++) {
        const phi = 2 * Math.PI * (k + 0.5) / NPHI;
        const x = C + rho * Math.cos(phi), y = C + rho * Math.sin(phi), z = C + zz;
        acc += lerp3(f, x, y, z) * (m === 0 ? 1 : Math.cos(m * phi));
      }
      out[j * PXM + i] = acc / NPHI * (m === 0 ? 1 : 2);
    }
  }
  return out;
};


/*
 * ONE LAYER, NOT THE WHOLE BOX - and the box is what turned the cloud into a blob.
 *
 * `atom.cloud` sums a solved wavefunction through the box because there is nothing else in the
 * box: |psi|^2 is the entire content and its integral along the line of sight is still |psi|^2's
 * shape. Here the box is a VACUUM with a source in it, and the two do not integrate alike. The
 * monopole has g0 = 1 exactly, so lambda_0 is infinite and the source's isotropic excess never
 * falls off; the angular pattern is imprinted only within lambda_1, which on fcc-12 is 0.94
 * cells. Summing 2R+1 cells of line of sight therefore adds ~40 cells of structureless excess
 * on top of the two or three cells that carry the shape. That ratio IS the blob, and it gets
 * worse the shorter lambda_1 is - which is exactly why cubic-26 survived the projection and
 * fcc-12 and icosahedral-12 did not.
 *
 * A single layer through the middle takes the shape where it is imprinted and leaves the rest
 * of the line of sight out of the sum. The layer is not a row of cells: the field is already
 * reconstructed from one parity (a Gaussian of radius 2, so the plane is physically a slab of
 * about two cells) and the plane is then sampled continuously at four pixels to the cell, the
 * same way the meridian channels are - so no nearest-neighbour binning and no moire.
 *
 * Two planes are drawn because m decides which one holds the pattern:
 *   the MERIDIAN plane (x,z), containing the axis - where an m = 0 state's lobes and nodes are
 *   the EQUATORIAL plane (x,y), across it   - where an m != 0 state's azimuthal lobes are
 */
const slice = (f: Float64Array, plane: "xz" | "xy") => {
  const out = new Float64Array(PXM * PXM);
  const st = (2 * R) / (PXM - 1);
  for (let j = 0; j < PXM; j++) for (let i = 0; i < PXM; i++) {
    const a = -R + i * st, b = -R + j * st;
    out[j * PXM + i] = plane === "xz"
      ? lerp3(f, C + a, C, C + b)
      : lerp3(f, C + a, C + b, C);
  }
  return out;
};

/*
 * AND THE SAME LAYER WITH ITS OWN RADIAL AVERAGE TAKEN OFF.
 *
 * What is left after the control run is subtracted is still dominated by the l = 0 part, which
 * carries no shape at all and cannot be made to decay - so a positive-density picture of it is
 * a bright middle fading outwards whatever the state is. Removing the mean AT EACH RADIUS
 * divides out the monopole exactly, radius by radius, and leaves only the dependence on angle:
 * where this state puts MORE turning than a sphere at that distance would. That is the picture
 * that distinguishes 2p from 3d; the un-flattened one only says how much was moved.
 */
const lessRadial = (a: Float64Array, px: number) => {
  const mid = (px - 1) / 2;
  /* one ring per pixel of radius, so the subtraction is as fine as the picture is */
  const NB = Math.ceil(Math.hypot(mid, mid)) + 1;
  const sum = new Float64Array(NB), cnt = new Float64Array(NB);
  const bin = (i: number, j: number) =>
    Math.min(NB - 1, Math.round(Math.hypot(i - mid, j - mid)));
  for (let j = 0; j < px; j++) for (let i = 0; i < px; i++) {
    const b = bin(i, j); sum[b] += a[j * px + i]; cnt[b]++;
  }
  const out = new Float64Array(a.length);
  for (let j = 0; j < px; j++) for (let i = 0; i < px; i++) {
    const b = bin(i, j);
    out[j * px + i] = a[j * px + i] - (cnt[b] ? sum[b] / cnt[b] : 0);
  }
  return out;
};

/* the whole box summed through, kept for the comparison the paragraph above rests on */
const project = (f: Float64Array) => {
  const out = new Float64Array(PXM * PXM);
  const st = (2 * R) / (PXM - 1);
  for (let j = 0; j < PXM; j++) for (let i = 0; i < PXM; i++) {
    const a = -R + i * st, b = -R + j * st;
    /* one sample per CELL along the line of sight - the grid holds nothing finer, and taking
     * four per cell only costs four times the work to integrate the same interpolant */
    let acc = 0;
    for (let k = 0; k <= 2 * R; k++) acc += lerp3(f, C + a, C - R + k, C + b);
    out[j * PXM + i] = acc / (2 * R + 1);
  }
  return out;
};

/* a plain de-mean over the frame, for the anisotropy channels */
const lessMean = (a: Float64Array) => {
  let s = 0;
  for (const v of a) s += v;
  const mu = s / a.length;
  const out = new Float64Array(a.length);
  for (let i = 0; i < a.length; i++) out[i] = a[i] - mu;
  return out;
};

/*
 * WHICH PHASE OF THE PULSE IS FROZEN, CHOSEN RATHER THAN INHERITED FROM THE RUN LENGTH.
 *
 * The strobe used to fire when `t % PERIOD === TICKS % PERIOD`, which ties the phase it catches
 * to how long the run happens to be. Two runs of the same state at 400 and 600 ticks therefore
 * froze DIFFERENT moments - phase 48 and phase 72 of 88 - and for 2p the emitted amplitude at
 * those is 0.11 against 0.02, a factor of five. The shorter run looked far more distinct, and
 * nothing about the physics differed: it had simply caught the pulse nearer its peak. Any
 * comparison between runs of unequal length was confounded by this.
 *
 * So the phase is the one where the state actually emits hardest - the maximum of |R_nl| over
 * the period - which is the moment with the most structure to see and is the same moment
 * whatever the run length.
 */
/*
 * THE PHASE IS CHOSEN SO THE SCHEDULE LANDS INSIDE THE FRAME - and choosing it by the emission
 * peak put every radial node outside the picture.
 *
 * Radius is retarded time: what stands at r carries R(PHASE0 - r), counted round the period. So
 * PHASE0 fixes WHICH PART of the schedule the frame shows. Setting it to the peak of |R| - which
 * for every s state is tau = 0 - maps radius r to tau = -r mod 88, so the middle of the picture
 * holds the LATE tail where R has died to nothing and the rim holds the early peak: the profile
 * is drawn inside out. 2s changes sign at tau = 11, which lands at r = 77 in a frame of twelve.
 * Every radial node was rendered outside the frame, which is why no s state has shown one.
 *
 * Setting PHASE0 = R maps the frame onto the FIRST R ticks: radius r carries tau = R - r, so the
 * centre is the schedule's start and the rim is tau = 0. A node at tau = t appears at r = R - t,
 * inside the picture whenever t < R.
 */
const PHASE0 = ((R % PERIOD) + PERIOD) % PERIOD;

/*
 * ONLY A BIPARTITE LATTICE HAS TWO SOLUTIONS TO KEEP APART, and cubic-26 does not have them.
 *
 * The rule is the geometry's own: if EVERY exit changes x+y+z by an even amount then parity is
 * conserved, streaming never mixes the two interleaved copies, and they drift into two
 * different solutions that must never be averaged. fcc-12 and icosahedral-12 are both <110>, so
 * they are; cubic-26 has +-(1,0,0) among its twenty-six and is not. Restricting to one parity
 * there throws away half the samples and half the resolution for nothing, so `par = -1` takes
 * the lot - which is the honest reconstruction on a lattice that has only one solution.
 */
const BIPARTITE = ((g.L ?? g.U) as number[][]).every(u =>
  ((((u[0] | 0) + (u[1] | 0) + ((u[2] ?? 0) | 0)) % 2) + 2) % 2 === 0);

const accM = new Float64Array(PXM*PXM), accMP = new Float64Array(PXM*PXM);
/* the turning channel, taken THREE ways: one layer through the axis, one across it, and
 * the whole box summed through - so the blob and the pattern can be put side by side */
const accT = new Float64Array(PXM*PXM);      // meridian layer  (x, z) at y = C
const accE = new Float64Array(PXM*PXM);      // equatorial layer (x, y) at z = C
const accTP = new Float64Array(PXM*PXM);     // the whole box, projected

const accC = new Float64Array(PX*PX), accP = new Float64Array(PX*PX);
const accO = new Float64Array(PX*PX);
let samples = 0;

for (let t = 0; t < TICKS; t++) {
  const amp = Rnl(n, l, a0, t % PERIOD);
  const sgn = amp >= 0 ? 1 : -1;
  emit(G, { at: [C,C,C], radius: 1,
    exits: (d) => { const y = ylm(d, t); return Math.abs(y) < 1e-9 ? 0 : (y > 0 ? sgn : -sgn); },
    amountAt: (d) => Math.min(1, Math.abs(amp)) * Math.abs(ylm(d, t)) * 0.5,
    amount: Math.min(1, Math.abs(amp)) * 0.5 });
  await tick();
  /*
   * SAMPLED AT ONE PHASE OF THE PULSE, NOT ACROSS IT - and averaging across it is what flattened
   * every radial profile in this session.
   *
   * Radius is retarded time, so what stands at r on tick t was emitted at t - r. A source whose
   * schedule repeats with period P therefore shows R(t-r) at radius r - and averaging that over
   * t across whole periods gives the MEAN OF R, the same number at every radius, with the radial
   * shape divided out exactly. The nodes cannot survive it, and did not: 3s came back as a blob
   * with no sign change anywhere.
   *
   * Sampling at a fixed phase keeps it. Take only the ticks with t mod P equal to one value and
   * every sample sees the same R(t0 - r) at each radius, so the profile stands while the vacuum's
   * own fluctuation still averages down over however many periods are run. It costs a factor of P
   * in samples, which is why this wants a long run rather than a longer one.
   */
  if (t > TICKS / 3 && (t % PERIOD) === PHASE0) {
    const cS = section(G, R), cK = section(K, R);
    const pS = polarity(G, R), pK = polarity(K, R);
    const oS = opposite(G, R, 0), oK = opposite(K, R, 0);
    const PAR = BIPARTITE ? (((C + C + C) % 2) + 2) % 2 : -1;   // the source's own parity, or all
    const mS = meridian(parityField(scalar(G.n, "charge"), PAR), m);
    const mK = meridian(parityField(scalar(K.n, "charge"), PAR), m);
    const mpS = meridian(parityField(scalar(G.n, "polarity"), PAR), m);
    const mpK = meridian(parityField(scalar(K.n, "polarity"), PAR), m);
    for (let i = 0; i < accM.length; i++) { accM[i] += mS[i] - mK[i]; accMP[i] += mpS[i] - mpK[i]; }
    /* the cloud: TURNING, with the bare vacuum's own turning subtracted cell by cell. The
     * parity reconstruction is done ONCE per grid and the three views are cut from it - it is
     * the expensive step and it does not depend on which plane is being taken. */
    const fT = parityField(G.turns, PAR), fTK = parityField(K.turns, PAR);
    const xzS = slice(fT, "xz"),  xzK = slice(fTK, "xz");
    const xyS = slice(fT, "xy"),  xyK = slice(fTK, "xy");
    const prS = project(fT),      prK = project(fTK);
    for (let i = 0; i < accT.length; i++) {
      accT[i]  += xzS[i] - xzK[i];
      accE[i]  += xyS[i] - xyK[i];
      accTP[i] += prS[i] - prK[i];
    }
    for (let i = 0; i < accC.length; i++) {
      accC[i] += cS[i] - cK[i];
      accP[i] += pS[i] - pK[i];
      accO[i] += oS[i] - oK[i];
    }
    samples++;
  }
}
/*
 * EVERY ACCUMULATOR OVER ITS OWN LENGTH. They were all divided over `accC.length`, which is the
 * SECTION's (2R+1)^2 - but the meridian and layer images are (8R+1)^2, so only their first ten
 * rows were being averaged and the remaining ninety-four per cent kept a factor of `samples`.
 * The scale is set by the frame maximum, so what it showed was a dark band along one edge.
 */
const S = Math.max(1, samples);
for (const a of [accC, accP, accO, accM, accMP, accT, accE, accTP])
  for (let i = 0; i < a.length; i++) a[i] /= S;

const dir = `/home/fadi/Desktop/orbitmines/physics/visuals/vacuum/${TAG}`;
mkdirSync(dir, { recursive: true });
/*
 * THE SOURCE'S OWN CELLS ARE NOT THE CLOUD, and letting them set the scale hid it.
 *
 * A body occupies the cells within its radius and those are held at whatever it is emitting,
 * which for the ground state came out at 2.9e2 against a cloud of order one - so the maximum
 * was the proton, everything else was divided by it, and the picture was a bright cross on a
 * flat field. The body is masked out of both the scaling and the drawing: what is left is the
 * vacuum's response, which is the thing being asked about. The masked cells are drawn as the
 * ground rather than as nought so they read as "not part of this" instead of as an answer.
 */
const MASK = Number(process.argv[6] ?? 1.6);                      // the source's radius, and a cell either side of it
/* the source's own cells, in whatever pixel grid is being drawn - the meridian image is four
 * pixels to the cell, so a mask written in cell units has to be scaled into it */
/* the disc the datum is defined on - see `pedestal` */
const inFrame = (i: number, j: number, px: number) => {
  const mid = (px - 1) / 2, perCell = (px - 1) / (2 * R);
  return Math.hypot(i - mid, j - mid) <= R * perCell;
};
const inBody = (i: number, j: number, px = PX) => {
  const mid = (px - 1) / 2, perCell = (px - 1) / (2 * R);
  return Math.hypot(i - mid, j - mid) <= MASK * perCell;
};

/*
 * THE TWO SUBLATTICES, AVERAGED - because the picture was mostly the seam between them.
 *
 * fcc-12 steps by <110>, so every exit changes x+y+z by an EVEN amount and the parity of a
 * cell is conserved: the lattice is two interleaved copies that streaming never mixes, coupled
 * only by what happens inside a cell. They carry slightly different amounts - measured, the
 * cloud channel sits at 2.58 on one and 2.43 on the other, a gap of 6% - and in a flat slice
 * the two alternate cell by cell, which is a checkerboard.
 *
 * Six per cent would be nothing if it were drawn linearly. It is not: the colour goes through
 * a FOURTH ROOT, so 0.03 of the peak comes out at 0.42 of full intensity, and in the de-meaned
 * channels the uniform part is subtracted away and the seam is left as the largest thing in
 * the frame, flipping sign every cell. That is the alternating blue and orange, and the cloud
 * is the faint structure behind it.
 *
 * A checkerboard is exactly the mode (-1)^(i+j), so averaging a cell with its four orthogonal
 * neighbours - which are all of the other parity - cancels it dead while leaving anything
 * smooth alone. This is a de-staggering and not a blur: it removes one specific mode, the one
 * the lattice's own parity puts there.
 */
const destagger = (a: Float64Array, PX: number) => {
  const out = new Float64Array(a.length);
  for (let j = 0; j < PX; j++) for (let i = 0; i < PX; i++) {
    let sum = 0, k = 0;
    if (i > 0)      { sum += a[j*PX + i-1]; k++; }
    if (i < PX - 1) { sum += a[j*PX + i+1]; k++; }
    if (j > 0)      { sum += a[(j-1)*PX + i]; k++; }
    if (j < PX - 1) { sum += a[(j+1)*PX + i]; k++; }
    out[j*PX + i] = k ? 0.5 * (a[j*PX + i] + sum / k) : a[j*PX + i];
  }
  return out;
};

/* the colour curve. A fourth root saturates a few per cent into half the range, which is what
 * made a 6% seam the whole picture; a square root still lifts the faint structure without
 * turning noise into a pattern. */
const CURVE = 0.5;

/*
 * DRAWN THE WAY `atom.cloud` DRAWS ITS COUNTS - a POSITIVE density on black, not a signed field
 * on a diverging ramp.
 *
 * A cloud is an amount of something, not a sign, so the ramp runs from the ground up: black
 * where nothing turns, through blue and white to amber where the most does. Nodes then read as
 * DARK - the absence that they are - which is what makes the rings in `atom.cloud` legible.
 * A diverging blue/orange map cannot show a node at all: it puts the node at the middle of the
 * ramp, where the colour is brightest.
 */
const cloudy = (raw: Float64Array, name: string, px: number) => {
  let hi = 0;
  for (let j = 0; j < px; j++) for (let i = 0; i < px; i++) {
    if (inBody(i, j, px) || !inFrame(i, j, px)) continue;
    hi = Math.max(hi, raw[j * px + i]);
  }
  const SC = Math.max(1, Math.round(640 / px)), W = px * SC, H = px * SC;
  const rgb = new Uint8Array(W * H * 3);
  for (let j = 0; j < px; j++) for (let i = 0; i < px; i++) {
    /* the body is left OUT of the drawing as well as out of the scale - it is held at whatever
     * it emits, which is orders above the cloud, and drawn it is a white disc where the answer
     * should be. And so is everything past r = R: the datum is the ring AT r = R, so that is
     * where the picture's domain ends - the corners of a square frame reach R*sqrt2, where the
     * profile has fallen further below the datum and |a - base| climbs again, which drew as four
     * bright corners outside a dark ring. A cloud fading into black corners is what it should
     * look like, and clipping to the disc the datum is defined on is what makes it one. */
    const v = (inBody(i, j, px) || !inFrame(i, j, px))
      ? 0 : Math.max(0, Math.min(1, raw[j * px + i] / (hi || 1)));
    /* the same climb atom.cloud uses: a gentle power so the faint outer shells survive */
    const t = Math.pow(v, 0.45);
    /* black -> deep blue -> pale blue -> white -> amber */
    const stops = [[6,8,14],[20,45,95],[70,130,200],[190,220,245],[255,205,140]];
    const f = t * (stops.length - 1), k0 = Math.min(stops.length - 2, Math.floor(f)), fr = f - k0;
    const c = [0,1,2].map(q => stops[k0][q] + (stops[k0+1][q] - stops[k0][q]) * fr);
    for (let dy = 0; dy < SC; dy++) for (let dx = 0; dx < SC; dx++) {
      const q = (((px - 1 - j) * SC + dy) * W + i * SC + dx) * 3;
      rgb[q] = c[0]|0; rgb[q+1] = c[1]|0; rgb[q+2] = c[2]|0;
    }
  }
  writeFileSync(`${dir}/n${n}l${l}m${m}-${name}.png`, Buffer.from(png(W, H, rgb), "base64"));
  return hi;
};

const draw = (raw: Float64Array, name: string, px = PX, smooth = true) => {
  /* a reconstructed image is already low-passed by the interpolation; de-staggering it again
   * would only blur it, and the mode it removes is not there to remove */
  const data = smooth ? destagger(raw, px) : raw;
  const PX = px;
  let hi = 0;
  for (let j = 0; j < PX; j++) for (let i = 0; i < PX; i++) {
    if (inBody(i, j, PX)) continue;
    hi = Math.max(hi, Math.abs(data[j * PX + i]));
  }
  /* the same adaptive scale `cloudy` uses - a fixed 16 turned the 161-pixel meridian images
   * into 2576-square PNGs, sixteen times the pixels of the field they are drawing */
  const SC = Math.max(1, Math.round(640 / PX)), W = PX*SC, H = PX*SC;
  const rgb = new Uint8Array(W*H*3);
  for (let j = 0; j < PX; j++) for (let i = 0; i < PX; i++) {
    const v = inBody(i, j, PX) ? 0 : Math.max(-1, Math.min(1, data[j*PX+i] / (hi || 1)));
    const c = v >= 0
      ? [20 + 235*Math.pow(v,CURVE), 20 + 130*Math.pow(v,CURVE), 20 + 60*Math.pow(v,CURVE)]
      : [20 + 60*Math.pow(-v,CURVE), 20 + 140*Math.pow(-v,CURVE), 20 + 235*Math.pow(-v,CURVE)];
    for (let dy = 0; dy < SC; dy++) for (let dx = 0; dx < SC; dx++) {
      const k = (((PX-1-j)*SC + dy) * W + i*SC + dx) * 3;
      rgb[k] = c[0]|0; rgb[k+1] = c[1]|0; rgb[k+2] = c[2]|0;
    }
  }
  writeFileSync(`${dir}/n${n}l${l}m${m}-${name}.png`, Buffer.from(png(W,H,rgb), "base64"));
  return hi;
};

/* what the vacuum settled at, so the run can say whether the derived rates reproduce it */
let occ = 0, cells = 0;
for (let x = 4; x < N-4; x++) for (let y = 4; y < N-4; y++) for (let z = 4; z < N-4; z++) {
  if (Math.hypot(x-C,y-C,z-C) < 12) continue;
  const b0 = ((x*N+y)*N+z)*g.DEG;
  for (let s = 0; s < 4; s++) for (let d = 0; d < g.DEG; d++) occ += K.n[s][b0+d];
  cells++;
}
occ /= cells * g.DEG;

console.log(`n=${n} l=${l} m=${m}  a0=${a0.toFixed(2)}  phase=${PHASE0}/${PERIOD}  spin=${spin.toFixed(4)}/tick  ticks=${TICKS}  samples=${samples}`);
/* `carries` is a WORD, and printing it as a number threw after the whole solve had run and
 * before a single image was written - twenty minutes of arithmetic discarded on a format */
console.log(`  rates : ` + Object.entries(RATES).map(([k, v]) =>
  `${k}=${typeof v === "number" ? v.toFixed(3) : v}`).join("  "));
console.log(`  vacuum settled at ${occ.toFixed(4)} against the lattice's ${OCCUPANCY}` +
  `  (${(100*(occ-OCCUPANCY)/OCCUPANCY).toFixed(0)}%)`);
/*
 * AND THE SAME AGAIN WITH THE UNIFORM PART TAKEN OFF.
 *
 * The control run removes the bare vacuum cell by cell, so what is left is what the source
 * DID. But most of what it does to the minority charge is to deplete it everywhere it
 * reaches - a screening - and that is a large constant with the shape sitting on top of it.
 * Drawn against nought the constant sets the scale and the picture is flat blue with a faint
 * pattern in it; drawn against ITS OWN MEAN the constant is a datum rather than the signal
 * and what is left is where the cloud is thicker or thinner than its own average.
 *
 * Neither is more correct than the other and both are written: the first says how much charge
 * the source moved, the second says what shape it moved it into.
 */
const deMean = (a: Float64Array) => {
  let sum = 0;
  for (const v of a) sum += v;
  const mean = sum / a.length;
  const out = new Float64Array(a.length);
  for (let i = 0; i < a.length; i++) out[i] = a[i] - mean;
  return out;
};
draw(deMean(accC), "charge-flat");
draw(deMean(accP), "polarity-flat");
const hf = draw(deMean(accO), "cloud-flat");

console.log(`  cloud with its own mean removed: ${hf.toExponential(2)}`);
console.log(`  wrote charge=${draw(accC,"charge").toExponential(2)}  ` +
  `polarity=${draw(accP,"polarity").toExponential(2)}  ` +
  `cloud=${draw(accO,"cloud").toExponential(2)}  ` +
  `meridian=${draw(accM,"meridian-charge",PXM,false).toExponential(2)}  ` +
  `meridian-pol=${draw(accMP,"meridian-polarity",PXM,false).toExponential(2)}  ` +
  `anisotropy=${draw(lessMean(accM),"anisotropy-charge",PXM,false).toExponential(2)}  ` +
  `aniso-pol=${draw(lessMean(accMP),"anisotropy-polarity",PXM,false).toExponential(2)}  ` +
  `-> ${dir}`);
/*
 * THE TURNING, THE THREE WAYS. `-turns` is the layer through the axis, `-turns-eq` the layer
 * across it, `-turns-box` the whole box summed through (the old picture, kept so the blob and
 * the pattern can be compared); the `-shape` pair is each layer with the mean at its own radius
 * removed, which divides out the monopole that cannot decay and leaves the angle alone.
 */
/*
 * WHAT THE TURNING CHANNEL ACTUALLY DOES WITH RADIUS, printed - because a positive-density ramp
 * draws every negative pixel as black, and a black middle inside a bright rim is what a channel
 * that goes NEGATIVE near the source looks like. Reading it off the picture is guessing; this
 * says the sign and the size at each radius.
 */
const profile = (a: Float64Array, px: number) => {
  const mid = (px - 1) / 2, perCell = (px - 1) / (2 * R);
  const NB = R + 1, sum = new Float64Array(NB), cnt = new Float64Array(NB);
  for (let j = 0; j < px; j++) for (let i = 0; i < px; i++) {
    const b = Math.round(Math.hypot(i - mid, j - mid) / perCell);
    if (b >= NB) continue;
    sum[b] += a[j * px + i]; cnt[b]++;
  }
  return Array.from(sum, (v, b) => (cnt[b] ? v / cnt[b] : 0));
};
for (const [nm, a] of [["xz", accT], ["xy", accE], ["box", accTP]] as [string, Float64Array][])
  console.log(`  turns ${nm.padEnd(3)} r=0..${R}: ` +
    profile(a, PXM).map(v => v.toExponential(1)).join(" "));

/*
 * THE TURNING IS DRAWN AS A MAGNITUDE, BECAUSE ITS SIGN IS THE GEOMETRY'S AND NOT THE STATE'S.
 *
 * What is left after the control run is subtracted is HOW MUCH THE BODY CHANGED the vacuum's own
 * churn, and measured, which way it changes it depends on the lattice:
 *
 *   cubic-26, 1s   r = 0..8 :  -17  -13  -5.8  -2.1  -2.0  -2.4  -1.4  +0.08  +0.6
 *   icosahedral-12 r = 0..20:  +230 +220 +190 +110  +22   -36   -64   -77    ...  -120
 *
 * cubic-26 digs a hole everywhere the body reaches; icosahedral-12 raises a heap within about
 * four cells and digs a hole outside it. The reason is `room = (1-rho)^DEG`, the chance a point
 * splits into an empty neighbourhood: with DEG = 26 and the vacuum already at rho = 0.136, room
 * is 0.024 and any density the source injects drives creation towards nothing, so the body only
 * ever suppresses. Twelve exits at a looser occupancy leave room to spare near the source.
 *
 * So neither the raw field nor its negation is the picture. A ramp that runs up from black is
 * the right ramp for a DENSITY, and the density here is the SIZE of the change: |excess|. That
 * is also exactly how `atom.cloud` draws its counts - |psi|^2 puts both lobes of a p orbital in
 * the light and leaves the node dark - and it makes a radial sign change read as the dark ring a
 * radial node is. The signed field is written beside it so nothing is hidden by the modulus.
 *
 * `-shape` removes the mean at each radius first, which takes out the part that cannot decay
 * (g_0 = 1 exactly, so lambda_0 is infinite) and leaves the dependence on ANGLE alone. The mean
 * is round a CIRCLE in the drawn plane, not over the sphere - it weights each polar angle
 * equally where the l = 0 projection weights by sin(theta) - so it is the monopole to within
 * that weighting and not exactly it. It is a rendering, and the alternative is a picture whose
 * scale is set by the one component that carries no shape.
 */
/*
 * AND THE RAW FIELDS ARE KEPT, because the lattice's own signature can only be removed by
 * SUBTRACTING IT, and that needs two states side by side.
 *
 * The 1s state is isotropic by construction, so whatever angular structure its `-shape` channel
 * carries is the lattice and nothing else - and on fcc-12 that is four diagonal lobes and an
 * eight-fold rosette at eleven per cent of the cloud. A 2p or 3d picture on the same lattice is
 * therefore not to be read against black; it is to be read against THAT. Doing the subtraction
 * from the PNGs would be reading a colour ramp backwards, and re-solving to get the numbers back
 * costs ten minutes a state, so the fields go to disk as raw f32 beside the pictures.
 */
const dump = (name: string, a: Float64Array) =>
  writeFileSync(`${dir}/n${n}l${l}m${m}-${name}.f32`, Buffer.from(Float32Array.from(a).buffer));
for (const [nm, a] of [["accT", accT], ["accE", accE], ["accTP", accTP],
                       ["accM", accM], ["accMP", accMP]] as [string, Float64Array][]) dump(nm, a);
writeFileSync(`${dir}/n${n}l${l}m${m}-meta.json`, JSON.stringify(
  { n, l, m, geom: GEOM, N, R, PXM, PX, ticks: TICKS, samples, period: PERIOD, phase: PHASE0,
    a0, mask: MASK, bipartite: BIPARTITE, rates: RATES }, null, 1));

/*
 * THE FRAME'S EDGE IS THE ZERO, because a difference field has no zero of its own and taking
 * nought for one lit the entire picture.
 *
 * The control run removes the bare vacuum, so what is left is what the SOURCE did - but the
 * source pumps out a monopole that cannot decay. g_0 = 1 exactly, so lambda_0 is infinite, and
 * measured on fcc-12's 1s the turning excess runs 310 at the middle to 140 at r = 20: a factor
 * of 2.2 across the whole box and no sign of falling to nothing. Scaled to the frame maximum the
 * rim therefore sits at 0.45, which through the ramp's 0.45 power is 0.70 - pale blue. Every
 * pixel in the frame was lit and the cloud read as a bright field with a dark ring in it, which
 * is the picture upside down.
 *
 * `atom.cloud` has no such trouble because |psi|^2 really does go to nothing far out. Here the
 * far field is a PEDESTAL, and the honest thing is to say so and pick a datum rather than
 * pretend nought is one. The datum is the mean over the ring at the frame's own edge - the
 * furthest the picture reaches, where the state's structure is spent - so the background goes
 * black by construction and what is drawn is how much MORE the body changed the turning here
 * than it did at the rim. It also removes the sign flip: icosahedral-12 runs +230 to -120, and
 * against nought that crossing draws as a dark ring at r = 4.5 that looks exactly like a radial
 * node and is not one. Against the rim the same profile is monotone.
 */
const pedestal = (a: Float64Array, px: number) => {
  const mid = (px - 1) / 2, perCell = (px - 1) / (2 * R);
  let sum = 0, cnt = 0;
  for (let j = 0; j < px; j++) for (let i = 0; i < px; i++) {
    const r = Math.hypot(i - mid, j - mid) / perCell;
    if (r < 0.9 * R || r > R) continue;      // a ring at the edge, inside the frame on all sides
    sum += a[j * px + i]; cnt++;
  }
  return cnt ? sum / cnt : 0;
};
/** the size of what the body did, measured from the rim - which is the cloud */
const abs = (a: Float64Array, px = PXM) => {
  const base = pedestal(a, px);
  const out = new Float64Array(a.length);
  for (let i = 0; i < a.length; i++) out[i] = Math.abs(a[i] - base);
  return out;
};
console.log(`  turns : xz=${cloudy(abs(accT),"cloud-turns",PXM).toExponential(2)}  ` +
  `eq=${cloudy(abs(accE),"cloud-turns-eq",PXM).toExponential(2)}  ` +
  `box=${cloudy(abs(accTP),"cloud-turns-box",PXM).toExponential(2)}  ` +
  `signed=${draw(accT,"cloud-turns-signed",PXM,false).toExponential(2)}`);
const shX = lessRadial(accT, PXM), shE = lessRadial(accE, PXM);
console.log(`  shape : xz=${cloudy(abs(shX),"turns-shape",PXM).toExponential(2)}  ` +
  `eq=${cloudy(abs(shE),"turns-shape-eq",PXM).toExponential(2)}  ` +
  `signed=${draw(shX,"turns-shape-signed",PXM,false).toExponential(2)}  ` +
  `signed-eq=${draw(shE,"turns-shape-signed-eq",PXM,false).toExponential(2)}`);

await closePools();
