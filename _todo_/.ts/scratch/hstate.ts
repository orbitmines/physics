/**
 * THE PATTERN THE PROTON WOULD ACTUALLY BE FIRING, DERIVED FROM THE TURN - and a ballistic
 * control at every step, because a cone of emission has a shape of its own and that shape is
 * not a vacuum response.
 *
 * WHAT THE PATTERN IS, and it is read off `steer` rather than chosen. A turn is by THETA about
 * the local field b^. That CONSERVES u^ . b^ - the pitch - and advances the azimuth about b^ by
 * THETA. So a ray inside a turning body does not wander over the sphere: it sits on a CONE of
 * fixed pitch alpha and steps around it, CYCLE = 2pi/THETA seats to the lap. RADIATING sheds a
 * ray from whichever seat the turn happened at. So what a body emits is not a smooth cone and
 * not an isotropic spray - it is CYCLE DISCRETE BEAMS on a cone, and which seat fires when is
 * the body's own rotation showing.
 *
 * That gives exactly two numbers, and they are the two the article names:
 *   alpha  the pitch of the cone - how far off the axis the seats sit
 *   m      how many seats the pattern advances each tick - the WINDING round the ring
 * "l and m are counts on the finite ring", as an emission rule.
 *
 * AND THE CONTROL. Firing into a cone elongates the density along that cone whether or not any
 * vacuum is there - so the same pattern is run BALLISTICALLY, with sigma = tau = nu = 0 and no
 * medium at all, and the two are reported side by side. Only what the vacuum adds ON TOP of the
 * ballistic shape is a response. Without this a cone's own geometry reads as a harmonic, which
 * is the same trap as emitting |Y_lm| and measuring |Y_lm| back.
 *
 * usage: npx tsx scratch/hstate.ts [theta-deg] [ticks]
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { png } from "../src/theorems/probes/png.ts";
import { gather, tick, world, type Rules } from "../src/lib/Vacuum.ts";

const THDEG = Number(process.argv[2] ?? 90);
const TICKS = Number(process.argv[3] ?? 36);
const THETA = THDEG * Math.PI / 180;
const CYCLE = Math.max(2, Math.round(2 * Math.PI / THETA));
const N = 40, L = 9.6, RMAX = 3.2, NR = 16, NA = 16;
const RATE = Number(process.argv[4] ?? 10);
const NB = Math.round(RMAX / (L/N));   // cells across the radius - one bin per cell
const dir = `/home/fadi/Desktop/orbitmines/physics/visuals/vacuum/hstate`;
mkdirSync(dir, { recursive: true });

const P = (l: number, x: number): number => {
  if (l === 0) return 1; if (l === 1) return x;
  let pm = 1, p = x;
  for (let k = 2; k <= l; k++) { const pn = ((2*k-1)*x*p - (k-1)*pm)/k; pm = p; p = pn; }
  return p;
};

/** the ring: CYCLE seats on a cone of pitch alpha, the pattern advancing m seats a tick */
const ring = (alpha: number, m: number) =>
  (ux: number, uy: number, uz: number, t: number) => {
    if (Math.abs(uz - Math.cos(alpha)) > 0.18) return 0;      // on the cone, within a seat's width
    const ph = Math.atan2(uy, ux);
    const seat = ((ph / (2*Math.PI) * CYCLE) % CYCLE + CYCLE) % CYCLE;
    const want = ((m * t) % CYCLE + CYCLE) % CYCLE;
    const d = Math.min(Math.abs(seat - want), CYCLE - Math.abs(seat - want));
    return d < 0.5 ? 1 : 0;                                    // this seat, this tick
  };

type Out = { rad: Float64Array; ang: Float64Array; img: Float64Array; cnt: Float64Array; n: number };
const blank = (): Out => ({ rad: new Float64Array(NR), ang: new Float64Array(NA),
                            img: new Float64Array(NB*2*NB), cnt: new Float64Array(NB*2*NB), n: 0 });

const go = (pat: any, medium: boolean): Out => {
  const R: Rules = medium
    ? { theta: THETA, sigma: 1, tau: 1, nu: 1, stir: 1, shine: 0.02, makes: "polarity",
        source: { rate: RATE, radius: 0.12, charge: 1, pattern: pat } }
    /* BALLISTIC: no meetings, no making, no turning. Just what the pattern throws out. */
    : { theta: THETA, sigma: 0, tau: 0, nu: 0, stir: 0, shine: 0, makes: "polarity",
        source: { rate: RATE, radius: 0.12, charge: 1, pattern: pat } };
  const W = world(N, L, 8_000_000, 1/200);
  const K = world(N, L, 8_000_000, 1/200);
  const noSrc = { ...R, source: undefined };
  const o = blank();
  for (let t = 0; t < TICKS; t++) {
    tick(W, R, 1, 5); if (medium) tick(K, noSrc, 1, 5);
    if (t < TICKS/3) continue;
    gather(W); if (medium) gather(K);
    for (let a = 0; a < N; a++) for (let b = 0; b < N; b++) for (let e = 0; e < N; e++) {
      const x=(a+0.5-N/2)*L/N, y=(b+0.5-N/2)*L/N, z=(e+0.5-N/2)*L/N;
      const r = Math.hypot(x,y,z); if (r >= RMAX || r < 0.2) continue;
      const c = (a*N+b)*N+e;
      /* the TURNING where there is a medium, the DENSITY where there is not - a ballistic run
       * turns nothing at all, so its turning channel is empty by construction */
      const d = medium ? W.turned[c] - K.turned[c] : W.rho[c];
      o.rad[Math.floor(r/RMAX*NR)] += d;
      o.ang[Math.min(NA-1, Math.floor((z/r + 1)/2*NA))] += d;
      /* NOT a raw slice. A single y~0 plane of a 40^3 grid holds a handful of particles per
       * cell and the picture came out as noise; the `proton` renders are legible because they
       * integrate the azimuth. So the cell is added into its (rho, z) bin, which is the same
       * reconstruction and gathers every cell at that radius and height instead of one row. */
      /*
       * THE BINS MATCH THE CELLS. Twenty bins in rho and forty in z over a region only thirteen
       * cells in radius is over-binning: neighbouring bins draw on the same cells in different
       * proportions and the picture came out in horizontal stripes. NB is the number of cells
       * across RMAX, so a bin is a cell and no bin is empty for want of anything to put in it.
       */
      const rho = Math.hypot(x, y);
      const ir2 = Math.floor(rho / RMAX * NB), iz2 = Math.floor((z/RMAX + 1)/2 * (2*NB));
      if (ir2 >= 0 && ir2 < NB && iz2 >= 0 && iz2 < 2*NB) {
        o.img[ir2*(2*NB) + iz2] += d; o.cnt[ir2*(2*NB) + iz2]++;
      }
    }
    o.n++;
  }
  return o;
};

const proj = (ang: Float64Array) => {
  let tot = 0; for (const v of ang) tot += v;
  if (!tot) return [0,0,0,0];
  return [1,2,3,4].map(l => {
    let s = 0;
    for (let i = 0; i < NA; i++) s += (ang[i]/tot*NA - 1) * P(l, -1 + (i+0.5)*2/NA) / NA;
    return s * (2*l+1);
  });
};
const draw = (o: Out, name: string) => {
  const PX = 480;
  /* per cell that fell in the bin, so a wide ring is not brighter merely for being wide */
  const per = new Float64Array(o.img.length);
  for (let i = 0; i < per.length; i++) per[i] = o.cnt[i] > 0 ? o.img[i]/o.cnt[i] : 0;
  let hi = 0; for (const v of per) hi = Math.max(hi, Math.abs(v));
  const rgb = new Uint8Array(PX*PX*3);
  for (let j = 0; j < PX; j++) for (let i = 0; i < PX; i++) {
    /* the full meridian: rho from the middle out, mirrored, z up the picture */
    const rho = Math.abs(i - (PX-1)/2)/((PX-1)/2) * RMAX;
    const zz  = (j - (PX-1)/2)/((PX-1)/2) * RMAX;
    const ir2 = Math.floor(rho / RMAX * NB), iz2 = Math.floor((zz/RMAX + 1)/2 * (2*NB));
    const v = (ir2 >= 0 && ir2 < NB && iz2 >= 0 && iz2 < 2*NB && Math.hypot(rho,zz) < RMAX
               && Math.hypot(rho,zz) > 0.2)
      ? per[ir2*(2*NB) + iz2] / (hi || 1) : 0;
    const t = Math.pow(Math.max(0, Math.min(1, Math.abs(v))), 0.45);
    const st = [[6,8,14],[20,45,95],[70,130,200],[190,220,245],[255,205,140]];
    const f = t*(st.length-1), k0 = Math.min(st.length-2, Math.floor(f)), fr = f-k0;
    const c = [0,1,2].map(q => st[k0][q] + (st[k0+1][q]-st[k0][q])*fr);
    const k = ((PX-1-j)*PX + i)*3;
    rgb[k]=c[0]|0; rgb[k+1]=c[1]|0; rgb[k+2]=c[2]|0;
  }
  writeFileSync(`${dir}/${name}.png`, Buffer.from(png(PX, PX, rgb), "base64"));
};

console.log(`THETA=${THDEG}deg CYCLE=${CYCLE}  ${TICKS} ticks`);
console.log(`  the pattern is CYCLE seats on a cone of pitch alpha, advancing m a tick.`);
console.log(`  BALLISTIC is the same pattern with no medium at all - the cone's own shape.\n`);
console.log(`  state        shell    P1      P2      P3      P4     | ballistic P2   vacuum ADDS`);
/* one state per run, so the set goes across the cores instead of down one */
const ONLY = process.argv[5];
const STATES: [string, number, number][] = [
  ["alpha=90 m=0", 90, 0], ["alpha=90 m=1", 90, 1],
  ["alpha=55 m=0", 55, 0], ["alpha=55 m=1", 55, 1],
  ["alpha=35 m=0", 35, 0], ["alpha=35 m=1", 35, 1], ["alpha=35 m=2", 35, 2],
];
for (const [nm, al, m] of (ONLY ? STATES.filter(s => s[0].replace(/[= ]/g,"") === ONLY) : STATES)) {
  const pat = ring(al*Math.PI/180, m);
  const V = go(pat, true), B = go(pat, false);
  const pv = proj(V.ang), pb = proj(B.ang);
  let best = 0, bi = 0;
  for (let i = 1; i < NR; i++) { const v = V.rad[i]/((i+0.5)**2); if (v > best) { best=v; bi=i; } }
  draw(V, `${nm.replace(/[= ]/g,"")}-vacuum`);
  draw(B, `${nm.replace(/[= ]/g,"")}-ballistic`);
  console.log(`  ${nm}  ${((bi+0.5)*RMAX/NR).toFixed(2)}  ` +
    pv.map(v => v.toFixed(3).padStart(7)).join(" ") +
    `  |  ${pb[1].toFixed(3).padStart(9)}   ${(pv[1]-pb[1]).toFixed(3).padStart(9)}`);
}
console.log(`\n  -> ${dir}`);
