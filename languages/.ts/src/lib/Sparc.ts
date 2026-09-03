/**
 * SPARC AND GENZEL — WHAT THE TELESCOPES SAW, TURNED INTO WHAT THE MODEL IS ASKED ABOUT.
 *
 * Every number below is borrowed. None of it is the model's to derive, and none of it is
 * typed into this file: `tools/CATALOGUE.ts` fetches the published tables from the addresses
 * their authors keep them at and writes them into `data/`, and this reads those columns and
 * applies the published recipes to them.
 *
 *     data/sparc-galaxies   Lelli, McGaugh & Schombert 2016 (AJ 152:157) table 1 — 175 rows
 *     data/sparc-curves     the same paper's table 2 — 3,391 measured radii
 *     data/sparc-btfr       Lelli et al. 2019 (MNRAS 484:3267) — the Tully–Fisher relation
 *     data/genzel-discs     Genzel et al. 2017 (Nature 543:397) table 1 — six discs
 *
 * WHY IT MOVED. The catalogue used to live here as a base-36 blob and a hand-typed array,
 * generated once by a script that no longer existed. The numbers were right; that was not the
 * problem. The problem was that nobody — me included — could tell a transcription slip from a
 * measurement, and the recipe that produced them was a comment rather than code. Now the
 * recipe IS the code, three lines of it, next to the cuts it is applied under.
 *
 * WHY THE DATA AND NOT A FITTED CURVE. The article once compared its interpolation against
 * McGaugh et al.'s FITTING FUNCTION and reported that the two agree to 0.029 dex. That is a
 * true statement about two formulae and a weak one about the world: a fit is a summary, its
 * residuals have been thrown away, and a curve that tracks another curve has not met a single
 * galaxy. Here the points themselves are compared, with their own scatter.
 *
 * TWO CUTS, BOTH THEIRS. Rotation-curve quality flag Q < 3, inclination ≥ 30°, and points
 * whose velocity error exceeds 10% dropped — the cut McGaugh, Lelli & Schombert 2016 (PRL
 * 117:201101) make. It lands on 153 galaxies, which is the number they quote.
 */

import { measured } from "./Measured.ts";
import { G_NEWTON, MSUN } from "./Transport.ts";

const KPC = 3.0856775814913673e19;              // metres
const KMS = 1e3;

/* ── the sample, one row per galaxy ────────────────────────────────────────── */

const sample = measured("sparc-galaxies");
const S = sample.columns;

/** the 175 names, in catalogue order — the index everything else in this file refers by */
export const NAMES = sample.header.names as string[];

/**
 * WHICH GALAXIES THE RELATION IS DRAWN FROM, and the cut is the authors' own.
 *
 * A low-quality rotation curve and a face-on disc are both cases where the velocity is not
 * measured so much as guessed at, and both are excluded before anything is plotted rather
 * than argued away afterwards.
 */
const usable = (g: number) => S.Q[g] < 3 && S.Inc[g] >= 30;

/** SPARC's own recipe for the baryonic mass, in kilograms: stars at Υ=0.5, gas with helium */
export const massOf = (g: number) => (0.5 * S["L[3.6]"][g] + 1.33 * S.MHI[g]) * 1e9 * MSUN;

/* ── the radial acceleration relation, point by point ──────────────────────── */

/**
 * TWO LINES OF ARITHMETIC ON TABLE 2, and they are the whole of the transformation.
 *
 *     g_obs = V_obs² / R
 *     g_bar = (V_gas|V_gas| + Υ_d·V_disk|V_disk| + Υ_b·V_bul|V_bul|) / R
 *
 * with SPARC's own mass-to-light ratios at 3.6 µm, Υ_d = 0.5 and Υ_b = 0.7. The velocity
 * contributions are SIGNED because a gas disc with a hole in it pulls outwards, which is why
 * |V| appears rather than V².
 *
 * NOTHING IN THIS RELATION DEPENDS ON G. Both axes are V²/R — a length and a speed each — so
 * the comparison is between accelerations the telescope measured and accelerations the
 * photometry implies, and the gravitational constant never enters. The Tully–Fisher half is
 * the one that needs it.
 */
const YD = 0.5, YB = 0.7;

export type RarPoint = { gbar: number; gobs: number; galaxy: number; R: number };

const curves = measured("sparc-curves");
const C = curves.columns;

export const RAR: RarPoint[] = (() => {
  const out: RarPoint[] = [];
  for (let i = 0; i < curves.header.rows; i++) {
    const g = C.galaxy[i], R = C.R[i] * KPC, v = C.Vobs[i] * KMS;
    if (!usable(g) || !(R > 0) || !(v > 0)) continue;
    /* the error cut, theirs: a point known to worse than ten per cent says nothing */
    if (!(C.e_Vobs[i] <= 0.1 * C.Vobs[i])) continue;
    const gas = C.Vgas[i] * KMS, disk = C.Vdisk[i] * KMS, bul = C.Vbul[i] * KMS;
    const gbar = (gas * Math.abs(gas) + YD * disk * Math.abs(disk) +
      YB * bul * Math.abs(bul)) / R;
    if (!(gbar > 0)) continue;
    out.push({ gbar, gobs: (v * v) / R, galaxy: g, R });
  }
  return out;
})();

/** how many galaxies the relation is drawn from */
export const GALAXIES = () => new Set(RAR.map(p => p.galaxy)).size;

/**
 * ONE POINT PER GALAXY, AT THE OUTERMOST RADIUS ITS CURVE REACHES.
 *
 * THE CLOUD IS NOT 2,700 INDEPENDENT DRAWS AND NOTHING ABOUT IT SAYS SO. A distance or an
 * inclination error moves a whole galaxy up and down the relation together, so most of the
 * 0.13 dex of scatter is ONE number per galaxy repeated across its radii. Drawing the
 * galaxies as well as the radii is the honest version of that: the cloud is where the
 * measurements are, and these are how many objects made it.
 *
 * THE OUTERMOST RADIUS RATHER THAN A FIT. `V_flat` exists for only 123 of the 175 and IS a
 * fit — the asymptote read off the outer curve — so using it would put a fitted quantity in
 * the one place this file exists to keep them out of. The last measured point is a
 * measurement, it exists for every galaxy that survives the cut, and it is the deepest into
 * the transport regime each object was actually followed.
 */
export const FLAT: (RarPoint & { name: string })[] = (() => {
  const best = new Map<number, RarPoint>();
  for (const p of RAR) {
    const had = best.get(p.galaxy);
    if (!had || p.R > had.R) best.set(p.galaxy, p);
  }
  return [...best.values()]
    .sort((a, b) => a.galaxy - b.galaxy)
    .map(p => ({ ...p, name: NAMES[p.galaxy] }));
})();

/** how far a law sits from the points it is being asked about, in dex */
export const rarResidual = (law: (gbar: number) => number) => {
  let s = 0, ss = 0;
  for (const p of RAR) {
    const d = Math.log10(p.gobs / law(p.gbar));
    s += d; ss += d * d;
  }
  return { mean: s / RAR.length, rms: Math.sqrt(ss / RAR.length), n: RAR.length };
};

/* ── the baryonic Tully–Fisher sample ──────────────────────────────────────── */

/**
 * THE BARYONIC TULLY–FISHER SAMPLE, TAKEN AS PUBLISHED RATHER THAN REBUILT.
 *
 * This used to be assembled here out of table 1 — `V_flat` and `e_Vflat` with a mass built
 * from `L[3.6]` and `MHI` — and it landed on the right 123 galaxies with the right masses.
 * It was still a reconstruction. Lelli, McGaugh, Schombert, Desmond & Katz 2019 publish the
 * fiducial relation as a table: their velocity, their mass, and their uncertainties on both.
 * So that table is what is drawn, and the reconstruction is kept only as a check on it.
 *
 * WHAT ACTUALLY CHANGES IS THE ERROR BARS. The masses agree to 0.003 dex, so no point moves
 * anywhere a reader could see. The 2019 uncertainties are not table 1's: they were redone,
 * and they are LARGER — DDO154's flat velocity is ±1.7 km/s there against ±1.0 here. Drawing
 * the old ones understated the error on every galaxy in the panel, which is the kind of thing
 * that is invisible until somebody asks whether a slope of 3.73 is far from 4.
 *
 * AND THE FILE IS ALREADY THE CUT SAMPLE. Its 153 rows are the Q < 3, inclination ≥ 30° cut,
 * and the 123 with a flat velocity are the fiducial relation — so the cut is not applied
 * again here. That it agrees galaxy-for-galaxy with applying `usable` to table 1 is checked
 * below rather than assumed.
 */
export type Btfr = {
  name: string; galaxy: number;
  /** the flat rotation velocity and its error, km/s, as published */
  vf: number; e: number;
  /** the baryonic mass in kilograms, and its error in dex, as published */
  M: number; eM: number;
};

export const BTFR: Btfr[] = (() => {
  const t = measured("sparc-btfr"), c = t.columns;
  const names = t.header.names as string[];
  const out: Btfr[] = [];
  for (let i = 0; i < t.header.rows; i++) {
    if (!(c.Vf[i] > 0)) continue;
    out.push({
      name: names[i], galaxy: c.galaxy[i],
      vf: c.Vf[i], e: c.e_Vf[i],
      M: Math.pow(10, c["log(Mb)"][i]) * MSUN, eM: c["e_log(Mb)"][i],
    });
  }
  return out.sort((a, b) => b.vf - a.vf);
})();

/** kept as a function because every caller had one, and the mass is now already on the row */
export const baryonicMass = (g: Btfr) => g.M;

/**
 * AND TWO CHECKS THAT COST NOTHING, both of which would catch a shifted column.
 *
 * THE MASS. `massOf` builds M_b from table 1's luminosity and HI columns by the recipe the
 * catalogue publishes; the 2019 table carries the authors' own `log(Mb)` for the same
 * galaxies, built the same way from the same photometry. They have no reason to agree unless
 * both parses and the recipe are right. This is no longer what gets drawn — it is now purely
 * a test of the table 1 parse, which the rotation points still depend on.
 *
 * THE SAMPLE. Applying `usable` and `V_flat > 0` to table 1 should select exactly the
 * galaxies the 2019 file lists. If it does not, one of the two files has been read wrong, or
 * the authors' cut is not the one written down here.
 */
export const massCheck = () => {
  const mine = new Set<number>();
  for (let g = 0; g < sample.header.rows; g++)
    if (usable(g) && S.Vflat[g] > 0) mine.add(g);
  const theirs = new Set(BTFR.map(g => g.galaxy));
  let n = 0, worst = 0, ss = 0;
  for (const g of BTFR) {
    const d = Math.log10(massOf(g.galaxy) / g.M);
    n++; ss += d * d; worst = Math.max(worst, Math.abs(d));
  }
  const missed = [...theirs].filter(g => !mine.has(g)).length +
    [...mine].filter(g => !theirs.has(g)).length;
  return { n, rms: Math.sqrt(ss / Math.max(n, 1)), worst, missed };
};

/**
 * THE ORTHOGONAL FIT, which is the one the BTFR is always quoted with.
 *
 * Both axes are measured and neither is the independent one, so a least-squares fit in y
 * alone is the wrong estimator — it is biased shallow by exactly the scatter in x, and the
 * slope is the whole question here. Minimising perpendicular distance instead is a
 * principal-axis problem and closed-form. Uniform weights: SPARC's per-galaxy errors are
 * dominated by the distance, which is common to both axes and cannot be put on one of them,
 * so weighting by V_f alone would be worse than not weighting.
 */
export const orthogonalFit = (xs: number[], ys: number[]) => {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0, syy = 0, sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2; syy += (ys[i] - my) ** 2; sxy += (xs[i] - mx) * (ys[i] - my);
  }
  sxx /= n; syy /= n; sxy /= n;
  const slope = (syy - sxx + Math.sqrt((syy - sxx) ** 2 + 4 * sxy * sxy)) / (2 * sxy);
  const intercept = my - slope * mx;
  let s = 0;
  for (let i = 0; i < n; i++)
    s += ((ys[i] - intercept - slope * xs[i]) / Math.sqrt(1 + slope * slope)) ** 2;
  return { slope, intercept, scatter: Math.sqrt(s / n) };
};

/** log V_f and log M_b, the two axes the relation is drawn on */
export const btfrAxes = () => ({
  x: BTFR.map(g => Math.log10(g.vf)),
  y: BTFR.map(g => Math.log10(g.M / MSUN)),
});

/**
 * WHAT THE MODEL PREDICTS, AND IN WHICH DIRECTION IT IS AN INEQUALITY.
 *
 * Deep in the transport regime g → √(g_N a₀), so V⁴ = G·M_b·a₀ exactly: slope four, and a
 * normalisation A = 1/(G a₀) with nothing free in it. But V_f is measured at the outermost
 * radius a telescope reached, not at infinity, and the law sits ABOVE its own asymptote
 * everywhere — so the observed V_f exceeds the asymptotic one and the measured A = M_b/V_f⁴
 * must come out BELOW 1/(G a₀). The prediction is therefore a ceiling rather than a value,
 * and the size of the gap says how far from asymptotic the flat parts of real curves are.
 */
export const btfrCeiling = (a0: number) => 1 / (G_NEWTON * a0) * 1e12 / MSUN;

/* ── Genzel's six high-redshift discs ──────────────────────────────────────── */

/**
 * TABLE 1 AS PUBLISHED, AND f_DM IS MEASURED PER GALAXY.
 *
 * An older version of this drew one ceiling at 0.2 for all six, because that is what the
 * abstract says. The table gives each galaxy its own number with its own error, so the model
 * is testable object by object — and since f_DM IS the free fraction, the prediction is
 * 1/(1+θ) with nothing free in it.
 */
export type HighZ = {
  name: string; z: number; Mb: number; Re: number; f: number; e: number; limit: boolean;
};

export const DISCS: HighZ[] = (() => {
  const d = measured("genzel-discs"), c = d.columns;
  const names = d.header.names as string[];
  return names.map((name, i) => ({
    name, z: c.z[i], Mb: c.Mb[i], Re: c.Re[i],
    f: c.fDM[i], e: c.e_fDM[i], limit: c.limit[i] > 0.5,
  }));
})();

/** the baryonic acceleration at R1/2 — Mb is in 1e11 M☉ and Re in kpc, as published */
export const discArrival = (d: HighZ) =>
  G_NEWTON * d.Mb * 1e11 * MSUN / Math.pow(d.Re * KPC, 2);
