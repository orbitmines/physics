/**
 * WHAT A PROTON IN THIS VACUUM LOOKS LIKE.
 *
 * The world is a 3D grid of cells, so a picture is a slice through it - but a single plane of
 * cells is noisy, and the thing is spherically symmetric, so the field is reconstructed as a
 * function of (rho, z) with the azimuth integrated as a continuum. Same reconstruction the
 * lattice renders use, and for the same reason: what is being drawn is a field that happens to
 * have been sampled on cells, not the cells themselves.
 *
 * Channels: the NET CHARGE (signed - where the vacuum has been polarised), the TURNING (where it
 * is being bent, which is where a cloud would be), and the DENSITY.
 *
 * usage: npx tsx scratch/proton-draw.ts [theta-deg] [ticks] [rate] [tag]
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { png } from "../src/theorems/probes/png.ts";
import { gather, tick, world, type Rules } from "../src/lib/Vacuum.ts";

const THDEG = Number(process.argv[2] ?? 90);
const TICKS = Number(process.argv[3] ?? 60);
const RATE  = Number(process.argv[4] ?? 4);
const TAG   = process.argv[5] ?? "proton";
const R: Rules = { theta: THDEG*Math.PI/180, sigma: 1, tau: 1, nu: 1, stir: 1,
                   shine: 0.02, makes: "polarity",
                   /*
 * THE SOURCE IS AS SMALL AS THE GRID ALLOWS. At radius 0.4 against a shell at 1.3 the "proton"
 * was 30% of the structure it is meant to organise - a real one is about 1e-5 of the Bohr
 * radius, so that is not a point charge but an extended emitting sphere of comparable size, and
 * the black disc it left covered an eighth of the picture. One cell is the floor: below that it
 * is not resolved at all.
 */
                   source: { rate: RATE, radius: 0.12, charge: 1 } };
/*
 * AND A CONTROL RUN WITH NO PROTON IN IT, SUBTRACTED CELL BY CELL.
 *
 * The vacuum turns everywhere on its own - that is what a vacuum IS here - and the shell is a
 * modulation on top of it. Drawn against nought the scale is set by the vacuum's own churn and
 * the picture is noise with a hole in the middle. The same two-run subtraction the lattice
 * renders use: identical rules, identical seed, the only difference being the source.
 */
const N = 64, L = 9.6;      // finer cells, so the source can be smaller
/*
 * AND AVERAGED OVER TICKS, because one snapshot of each run is two lots of noise that ADD in the
 * difference. The vacuum is stationary once settled, so every tick after that is another sample
 * of the same thing: the first third is discarded as the settling and the rest accumulated. Same
 * idiom as the lattice renders, and it costs nothing but the ticks already being run.
 */
const cellsN = N*N*N;
const acc = { q: new Float64Array(cellsN), t: new Float64Array(cellsN),
              r: new Float64Array(cellsN), n: 0 };
const chargeOf = (w: any) => {
  const f = new Float64Array(cellsN);
  for (let i = 0; i < w.n; i++) {
    const a = Math.floor((w.x[i]/L + 0.5)*N), b = Math.floor((w.y[i]/L + 0.5)*N),
          c = Math.floor((w.z[i]/L + 0.5)*N);
    if (a<0||b<0||c<0||a>=N||b>=N||c>=N) continue;
    f[(a*N+b)*N+c] += w.q[i] * w.wt;
  }
  return f;
};
const W = world(N, L, 8_000_000, 1/200);
const K = world(N, L, 8_000_000, 1/200);
const noSrc = { ...R, source: undefined };
for (let t = 0; t < TICKS; t++) {
  tick(W, R, 1, 5); tick(K, noSrc, 1, 5);
  if (t < TICKS/3) continue;
  gather(W); gather(K);
  const qw = chargeOf(W), qk = chargeOf(K);
  for (let c = 0; c < cellsN; c++) {
    acc.q[c] += qw[c] - qk[c];
    acc.t[c] += W.turned[c] - K.turned[c];
    acc.r[c] += W.rho[c] - K.rho[c];
  }
  acc.n++;
}
for (let c = 0; c < cellsN; c++) { acc.q[c] /= acc.n; acc.t[c] /= acc.n; acc.r[c] /= acc.n; }

/* the charge per cell, which `gather` does not build - it keeps polarity, not charge */
const cells = N*N*N;


const at = (f: Float64Array, x: number, y: number, z: number) => {
  const a = Math.floor((x/L + 0.5)*N), b = Math.floor((y/L + 0.5)*N), c = Math.floor((z/L + 0.5)*N);
  if (a<0||b<0||c<0||a>=N||b>=N||c>=N) return 0;
  return f[(a*N+b)*N+c];
};

const RD = 3.2, PX = 481, NPHI = 96;
const slice = (f: Float64Array) => {
  const out = new Float64Array(PX*PX);
  for (let j = 0; j < PX; j++) for (let i = 0; i < PX; i++) {
    const rho = Math.abs((i - (PX-1)/2)/((PX-1)/2)*RD), zz = (j - (PX-1)/2)/((PX-1)/2)*RD;
    if (Math.hypot(rho, zz) > RD) continue;
    let acc = 0;
    for (let k = 0; k < NPHI; k++) {
      const ph = 2*Math.PI*(k+0.5)/NPHI;
      acc += at(f, rho*Math.cos(ph), rho*Math.sin(ph), zz);
    }
    out[j*PX+i] = acc/NPHI;
  }
  return out;
};

const dir = `/home/fadi/Desktop/orbitmines/physics/visuals/vacuum/${TAG}`;
mkdirSync(dir, { recursive: true });
const draw = (raw: Float64Array, name: string, signed: boolean) => {
  let hi = 0;
  for (let j = 0; j < PX; j++) for (let i = 0; i < PX; i++) {
    const r = Math.hypot((i-(PX-1)/2)/((PX-1)/2)*RD, (j-(PX-1)/2)/((PX-1)/2)*RD);
    if (r > RD || r < 0.15) continue;              // the source's own cells are not the answer
    hi = Math.max(hi, Math.abs(raw[j*PX+i]));
  }
  const rgb = new Uint8Array(PX*PX*3);
  for (let j = 0; j < PX; j++) for (let i = 0; i < PX; i++) {
    const r = Math.hypot((i-(PX-1)/2)/((PX-1)/2)*RD, (j-(PX-1)/2)/((PX-1)/2)*RD);
    const v = (r > RD || r < 0.15) ? 0 : raw[j*PX+i]/(hi || 1);
    let c: number[];
    if (signed) { const p = Math.pow(Math.min(1, Math.abs(v)), 0.5);
      c = v >= 0 ? [20+235*p, 20+130*p, 20+60*p] : [20+60*p, 20+140*p, 20+235*p]; }
    else { const t = Math.pow(Math.max(0, Math.min(1, Math.abs(v))), 0.45);
      const st = [[6,8,14],[20,45,95],[70,130,200],[190,220,245],[255,205,140]];
      const f = t*(st.length-1), k0 = Math.min(st.length-2, Math.floor(f)), fr = f-k0;
      c = [0,1,2].map(q => st[k0][q] + (st[k0+1][q]-st[k0][q])*fr); }
    const k = ((PX-1-j)*PX + i)*3;
    rgb[k]=c[0]|0; rgb[k+1]=c[1]|0; rgb[k+2]=c[2]|0;
  }
  writeFileSync(`${dir}/${name}.png`, Buffer.from(png(PX, PX, rgb), "base64"));
};

draw(slice(acc.q), `q${THDEG}-charge`, true);
draw(slice(acc.t), `q${THDEG}-turning`, true);
draw(slice(acc.r), `q${THDEG}-density`, true);
console.log(`THETA=${THDEG} ticks=${TICKS} (${acc.n} sampled) rate=${RATE} rays=${W.n} -> ${dir}`);
