/** solve one state at the render's own settings and print it, rather than waiting for twelve */
import { mkdirSync, writeFileSync } from "node:fs";
import { png } from "../src/theorems/probes/png.ts";
import { GEOMETRIES } from "../src/lib/Local.ts";
import { emit, grid, opposite, polarity, profile, section, step } from "../src/lib/Vlasov2.ts";

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

const [n, l, m] = (process.argv[2] ?? "1,0,0").split(",").map(Number);
const g: any = GEOMETRIES["fcc-12"], N = 61, C = 30, R = 22, TICKS = 220;
const a0 = 26 / (n*n);
const G = grid(g, N);
for (const a of G.n) a.fill(0.0485);
/*
 * AND THE AXIS COMES ROUND, which is what m IS and what was missing entirely.
 *
 * Y_lm carries e^{i·m·phi} - an azimuthal winding - and the standalone solver had only the
 * polar factor P_l^m(cos theta), with the axis nailed to z for every state. So m changed the
 * shape across theta and nothing ever turned, and the time-average came out as a hard static
 * cut instead of the ring a spinning thing leaves. Here the pattern is carried round at m
 * steps per beat and the picture is the average over that, so |m| shows as a winding and a
 * state with m = 0 is the one that stands still.
 */
const spin = (t: number) => 2 * Math.PI * m * t / Math.max(1, 4 * n * n * a0);
const axis = [0,0,1];
/* the real spherical harmonic at an exit, on this tick - polar shape times the azimuthal
 * winding, carried round at m steps per beat */
const ylm = (d: number, mg: number, t: number) => {
  const u = g.U[d];
  const cos = (u[2] ?? 0) / mg;
  const P = leg(l, m, cos);
  if (m === 0) return P;
  const phi = Math.atan2(u[1] ?? 0, u[0] ?? 0);
  return P * Math.cos(m * phi - spin(t));
};

const acc = new Float64Array((2*R+1)*(2*R+1));
const accP = new Float64Array((2*R+1)*(2*R+1));
const accO = new Float64Array((2*R+1)*(2*R+1));
/*
 * WHAT THE BARE VACUUM SETTLES AT, MEASURED - not the value it was seeded with.
 *
 * The excess is what the source drew in over an undisturbed vacuum, so the level it is taken
 * against has to be the level the vacuum actually reaches. Seeding at 0.0485 and then
 * subtracting 0.0485 subtracts the wrong number, because the fixed point at this nu is
 * somewhere else - and a constant offset in the wrong direction makes every cell negative,
 * which is a picture that is uniformly blue and says nothing.
 */
/*
 * THE VACUUM THIS IS DRAWN IN, AND IT IS NOT THE ONE THE MODEL DERIVES.
 *
 *   nu 0.05    a tenth of the derived occupancy, so a cloud has room to have a shape at all.
 *              At the model's own value the whole thing is three cells across and twelve
 *              directions, which cannot carry an orbital however it is drawn
 *   tau 3x     three times as much scattering as absorption. At the lattice's own ratio -
 *              equal, because the vacuum is unbiased - the direct beams outlive the diffusion
 *              at this range and the picture is twelve rays: measured, four and a half times
 *              as much charge on the <110> arms as between them at six cells, nine times at
 *              eleven. Scattering three times as often puts that at a third
 *
 * Both departures are in the same direction and are the same debt: this vacuum is too dense
 * and too absorbing for anything to be bound in it, which  states as a Coulomb
 * force with a range of two Planck lengths. What follows is the SHAPE the equation gives when
 * the range is long enough to have one, and it is not a claim about the range.
 */
const RATES =
{ nu: 0.05, sigma: 3.48, cap: 1, tau: 10, shine: 0.05, fold: 0.02, stir: 0.12 };

const bareRun = grid(g, N);
for (const a of bareRun.n) a.fill(0.0485);
for (let t = 0; t < 80; t++) step(bareRun, RATES);
let BARE = 0;
{
  const b0 = ((3 * N + 3) * N + 3) * g.DEG;    // a corner cell, far from anything
  for (let k = 0; k < 4; k++) for (let d = 0; d < g.DEG; d++) BARE += bareRun.n[k][b0 + d];
  BARE /= 4 * g.DEG;
}
let samples = 0;
for (let t = 0; t < TICKS; t++) {
  const amp = Rnl(n, l, a0, t % Math.ceil(4*n*n*a0));
  const sgn = amp >= 0 ? 1 : -1;
  emit(G, { at: [C,C,C], radius: 1,
    exits: (d) => { const u = g.U[d]; if (!u) return 0;
      const mg = Math.hypot(u[0],u[1],u[2]??0)||1;
      const y = ylm(d, mg, t);
      return Math.abs(y) < 1e-9 ? 0 : (y > 0 ? sgn : -sgn); },
    amountAt: (d) => { const u = g.U[d]; if (!u) return 0;
      const mg = Math.hypot(u[0],u[1],u[2]??0)||1;
      return Math.min(1,Math.abs(amp)) * Math.abs(ylm(d, mg, t)) * 0.5; },
    amount: Math.min(1,Math.abs(amp))*0.5 });
  step(G, RATES);

  /* both books accumulated - the polarity line was missing, so every polarity picture was a
   * zero array drawn as a black square rather than a measurement of anything */
  if (t > TICKS/3) {
    const s = section(G, R), pl = polarity(G, R), op = opposite(G, R, BARE);
    for (let i = 0; i < acc.length; i++) {
      acc[i] += s[i]; accP[i] += pl[i]; accO[i] += op[i];
    }
    samples++;
  }
}
for (let i = 0; i < acc.length; i++) { acc[i] /= Math.max(1, samples); accP[i] /= Math.max(1, samples);
  accO[i] /= Math.max(1, samples); }

const pr = profile(G, 20);
console.log(`n=${n} l=${l} m=${m}   a0=${a0.toFixed(1)}   radial |net| per cell:`);
console.log("  " + [1,2,3,5,8,12,16,20].map(r =>
  `r${r}=${Math.abs(pr.net[r]).toExponential(1)}`).join("  "));

/*
 * WRITTEN AS A PICTURE AND NOT AS CHARACTERS. The ASCII map this replaced put negatives
 * through a chain of toLowerCase and a replace that does nothing to punctuation, so half the
 * glyphs meant nothing and a correct dipole read as a diagonal smear. The emission was right
 * the whole time - measured, +z carries +1.414 and -z carries -1.414 with x balanced to
 * nought - and what was wrong was the reading of it.
 */
const PX2 = 2 * R + 1;
/* the folder, made here - a patch removed this line while adding the writer that uses it,
 * and twelve full solves were computed and then thrown away on a missing variable */
/* a tag per variant, so two versions of the solver can be compared side by side instead of
 * one quietly replacing the other */
const TAG = process.argv[3] ?? "spin";
const dir = `/home/fadi/Desktop/orbitmines/physics/visuals/vacuum/${TAG}`;
mkdirSync(dir, { recursive: true });
const draw = (data: Float64Array, name: string) => {
  let hi2 = 0;
  for (const v of data) hi2 = Math.max(hi2, Math.abs(v));
  const SC = 14, W = PX2 * SC, H = PX2 * SC;
  const rgb = new Uint8Array(W * H * 3);
  for (let j = 0; j < PX2; j++) for (let i2 = 0; i2 < PX2; i2++) {
    const v = Math.max(-1, Math.min(1, data[j * PX2 + i2] / (hi2 || 1)));
    const t = Math.sign(v) * Math.pow(Math.abs(v), 0.25);
    const c = t >= 0 ? [20 + 235*t, 20 + 130*t, 20 + 60*t]
                     : [20 + 60*-t, 20 + 140*-t, 20 + 235*-t];
    for (let dy = 0; dy < SC; dy++) for (let dx = 0; dx < SC; dx++) {
      const k = (((PX2 - 1 - j) * SC + dy) * W + i2 * SC + dx) * 3;
      rgb[k] = c[0]|0; rgb[k+1] = c[1]|0; rgb[k+2] = c[2]|0;
    }
  }
  writeFileSync(`${dir}/${name}.png`, Buffer.from(png(W, H, rgb), "base64"));
  return hi2;
};
const hq = draw(acc, `n${n}l${l}m${m}-charge`);
const hp = draw(accP, `n${n}l${l}m${m}-polarity`);
const ho = draw(accO, `n${n}l${l}m${m}-cloud`);
console.log(`\nwrote n${n}l${l}m${m}-charge (${hq.toExponential(2)}) and -polarity (${hp.toExponential(2)}) and -cloud (${ho.toExponential(2)})`);
