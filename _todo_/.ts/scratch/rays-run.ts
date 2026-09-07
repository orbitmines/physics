/**
 * A HYDROGEN STATE WITH NO LATTICE UNDER IT.
 *
 * THE RULE HAS ONE PARAMETER. `derived.ts` reads sigma = 1/occ off ANNIHILATION and the vacuum
 * settles at rho = occ, so the annihilation rate sigma*rho is 1 per tick on every geometry; and
 * `steer` spends one ring step per tick, so stir is 1 per tick too. absorb = stir identically,
 * whatever the lattice. Everything a geometry contributes is therefore THETA = 2pi/CYCLE and a
 * length unit, and the family of models is one-dimensional. Lengths here are mean free paths:
 * Sigma_t = 1, so absorb = stir = 0.5.
 *
 * usage: npx tsx scratch/rays-run.ts <n,l,m> <tag> [theta-deg] [millions of rays]
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { png } from "../src/theorems/probes/png.ts";
import { bins, cast, normalise } from "../src/lib/Rays.ts";
import { legendre } from "../src/lib/Kernel.ts";
import { renderAll } from "./rays-draw.ts";

const [n, l, m] = (process.argv[2] ?? "2,1,0").split(",").map(Number);
const TAG = process.argv[3] ?? "rays";
const THETA = Number(process.argv[4] ?? 45) * Math.PI / 180;
const MRAYS = Number(process.argv[5] ?? 8);

/* the same schedule the lattice runs use, in mean free paths instead of cells */
const lag = (k: number, a: number, x: number): number => {
  if (k === 0) return 1;
  if (k === 1) return 1 + a - x;
  let Lm = 1, L = 1 + a - x;
  for (let i = 1; i < k; i++) { const Ln = ((2*i+1+a-x)*L - (i+a)*Lm)/(i+1); Lm = L; L = Ln; }
  return L;
};
/*
 * THE FRAME AND a0 ARE IN MEAN FREE PATHS, and they have to be, because this model's cloud is
 * a different size from the lattice's.
 *
 * On the lattice the field filled a twenty-cell box: g_0 = 1 exactly, so the monopole never
 * decays by scattering, and the vacuum keeps re-radiating what it absorbs. Here only the
 * SOURCE's own rays are followed and they are absorbed for good, so what is drawn is a halo
 * about 1/Sigma_t across - two mean free paths, not twenty. Drawn in the lattice's frame it was
 * a dot in the middle of a black square.
 *
 * a0 is free in both, and for the same reason: every claim is a RATIO, and the state is sized so
 * its outermost feature sits inside the frame. Stated rather than hidden.
 */
const RFRAME = Number(process.argv[6] ?? 6);
/*
 * a0 IS SET FROM THE TRANSPORT RANGE, and choosing it by eye put every radial node out of reach.
 *
 * A ray is annihilated with probability absorb/(absorb+stir) = 1/2 at each event, so it travels
 * about one and a half mean free paths and the cloud is two or three across NO MATTER WHAT. Any
 * feature of the schedule that lands beyond that is not merely off the edge of the frame - there
 * are no rays out there to carry it. At a0 = 6/n^2 the 4d state's one radial node sat at tau =
 * 4.5, so it could never appear, and the same held for the outer node of every s state.
 *
 * The scale is free - every claim here is a RATIO - so it should be matched to the range rather
 * than picked. Write a0 = A/n^2; then rho = 2 tau n / A, and the outermost peak of the radial
 * distribution rho^2 |R_nl|^2 sits near rho = 2n, which lands at tau = A WHATEVER n AND l ARE.
 * So A is simply where the outer shell is put, measured in mean free paths, and one number does
 * for every state. A = 2 puts it at two, with the nodes inside that.
 */
const a0 = Number(process.argv[7] ?? 2) / (n * n);
const PERIOD = 4 * n * n * a0;
const Rnl = (r: number) => {
  const rho = 2*r/(n*a0);
  return Math.pow(rho, l) * Math.exp(-rho/2) * lag(n-l-1, 2*l+1, rho);
};

/* the emission's angular pattern: |Y_lm| in size, sign(Y_lm) in polarity */
const assoc = (L: number, M: number, x: number): number => {
  let pmm = 1;
  if (M > 0) { const s = Math.sqrt(Math.max(0, 1 - x*x)); let f = 1;
    for (let i = 1; i <= M; i++) { pmm *= -f*s; f += 2; } }
  if (L === M) return pmm;
  let p1 = x*(2*M+1)*pmm;
  if (L === M+1) return p1;
  for (let ll = M+2; ll <= L; ll++) { const pr = ((2*ll-1)*x*p1 - (ll+M-1)*pmm)/(ll-M); pmm = p1; p1 = pr; }
  return p1;
};
let YMAX = 0;
for (let i = 0; i <= 400; i++) for (let j = 0; j <= 40; j++) {
  const mu = -1 + i/200, ph = j/40*2*Math.PI;
  YMAX = Math.max(YMAX, Math.abs(assoc(l, m, mu) * (m === 0 ? 1 : Math.cos(m*ph))));
}
const Y = (mu: number, ph: number) => assoc(l, m, mu) * (m === 0 ? 1 : Math.cos(m*ph)) / (YMAX || 1);

/*
 * THE FRAME IS MEASURED, NOT CHOSEN - because choosing it by eye put the cloud in the middle
 * sixth of the picture twice running.
 *
 * These states are not all the same size. Transport sets one scale (a ray goes about a mean
 * free path between events and is annihilated after two on average) and the schedule sets
 * another (a0, and the retarded map that puts radius r at schedule time phase - r), and which
 * dominates changes with n and l. A frame that suits the 1s buries the 4f in a corner and a
 * frame that suits the 4f throws the 1s away.
 *
 * So a cheap pass finds the radius holding 97 per cent of the turning, and the real pass bins
 * and draws to THAT. The pre-pass costs a fortieth of the run and it is the difference between
 * a picture of the cloud and a picture of the black around it.
 */
const RULES = { theta: THETA, absorb: 0.5, stir: 0.5 };
const SRC = { weight: (mu: number, ph: number) => Math.abs(Y(mu, ph)),
              sign: (mu: number, ph: number) => (Y(mu, ph) >= 0 ? 1 : -1),
              schedule: Rnl, period: PERIOD };

const scout = bins(200, 1, RFRAME);
cast({ R: RULES, source: SRC, out: scout, count: 300_000, seed: 1, phase: RFRAME % PERIOD });
let tot = 0;
for (const v of scout.turns) tot += v;
let acc = 0, R = RFRAME;
for (let ir = 0; ir < 200; ir++) {
  acc += scout.turns[ir];
  if (acc >= 0.97 * tot) { R = Math.max(0.5, (ir + 1) * RFRAME / 200); break; }
}

const NR = 160, NU = 160;
const B = bins(NR, NU, R);
const t0 = Date.now();
cast({ R: RULES, out: B, count: MRAYS * 1_000_000, seed: 20260828,
  /* the strobe is set by the FRAME, as on the lattice: radius r carries the schedule at
   * phase - r, so putting phase at the frame's edge maps the picture onto the schedule's first
   * R of retarded time and a node at tau appears at r = R - tau, inside the picture */
  phase: R % PERIOD, source: SRC });
const ms = Date.now() - t0;

const dens = normalise(B, B.density), turns = normalise(B, B.turns), pol = normalise(B, B.polarity);

/* ---- the harmonics, which is the whole comparison ------------------------------------- */
const project = (f: Float64Array, rmin: number, rmax: number) => {
  const c: number[] = [];
  for (let L = 0; L <= 6; L++) {
    let num = 0, w = 0;
    for (let ir = 0; ir < NR; ir++) {
      const r = (ir + 0.5) * R / NR;
      if (r < rmin || r > rmax) continue;
      /*
       * EACH RADIUS NORMALISED BY ITS OWN SIZE, not by its own mean - because a signed channel's
       * mean is nought by construction and dividing by it reported P1 = 736 for the polarity.
       * The RMS round the ring is a scale that exists for both kinds of channel; for a positive
       * density it differs from the mean by an O(1) factor that is the same at every radius, so
       * the harmonics it reports are the same ones.
       */
      let ss = 0;
      for (let iu = 0; iu < NU; iu++) ss += f[ir*NU + iu] * f[ir*NU + iu];
      const mean = Math.sqrt(ss / NU);
      if (!(mean > 0)) continue;
      for (let iu = 0; iu < NU; iu++) {
        const mu = -1 + (iu + 0.5) * 2 / NU;
        num += f[ir*NU + iu] / mean * legendre(L, mu); w++;
      }
    }
    c.push(w ? num / w * (2*L + 1) : 0);
  }
  return c;
};

console.log(`n=${n} l=${l} m=${m}  THETA=${(THETA*180/Math.PI).toFixed(0)}deg  ` +
  `${MRAYS}M rays  ${(ms/1000).toFixed(1)}s  frame ${R.toFixed(2)} mfp (scouted from ${RFRAME})`);
for (const [nm, f] of [["density", dens], ["turns", turns], ["polarity", pol]] as [string, Float64Array][])
  console.log(`  ${nm.padEnd(9)} P1..P6 ` +
    project(f, 0.25 * R, R).slice(1).map(v => v.toFixed(3).padStart(8)).join(""));

/* ---- and the pictures, drawn straight from (r, mu) - no grid, no interpolation --------- */
const dir = `/home/fadi/Desktop/orbitmines/physics/visuals/vacuum/${TAG}`;
mkdirSync(dir, { recursive: true });
/*
 * THE DRAWING LIVES IN `rays-draw.ts` and this only hands it the fields. It was inline here,
 * and twice a rendering decision was wrong in a way only the picture showed - a frame too wide,
 * then a mask a tenth of the frame across sitting exactly where the 2p's lobes are brightest -
 * and each fix meant casting six million rays again per state to see it. Split, a change to how
 * a picture looks costs milliseconds and re-reads what is already on disk.
 */
/*
 * AND THE RAW FIELDS GO TO DISK, so a change to how the picture is DRAWN never costs a re-run.
 * The mask was a drawing decision and fixing it meant casting six million rays again for every
 * state, which is the wrong thing to have to spend. `scratch/rays-draw.ts` re-renders from these.
 */
for (const [nm, f] of [["dens", dens], ["turns", turns], ["pol", pol]] as [string, Float64Array][])
  writeFileSync(`${dir}/n${n}l${l}m${m}-${nm}.f32`, Buffer.from(Float32Array.from(f).buffer));
writeFileSync(`${dir}/n${n}l${l}m${m}-meta.json`, JSON.stringify(
  { n, l, m, theta: THETA * 180 / Math.PI, rays: MRAYS * 1e6, frame: R, scoutedFrom: RFRAME,
    NR, NU, a0, period: PERIOD, absorb: 0.5, stir: 0.5 }, null, 1));
renderAll(dir, { n, l, m, frame: R, NR, NU }, { dens, turns, pol });
console.log(`  -> ${dir}`);
