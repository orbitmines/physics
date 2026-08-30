/**
 * DOES THE PICTURE DEPEND ON THE STATE? - which is the test a pretty rendering has to pass.
 *
 * `beamless` takes the lattice's own angular signature out by measuring it on the 1s, which is
 * isotropic by construction. What is left should be the STATE's, and a state's angular pattern
 * changes when the state does: a 2p is P1, a 3d is P2, and the two are orthogonal. So correlate
 * one state's beamless field against another's. Near nought means the pipeline is reporting the
 * states; near one means it is reporting something they share - which, the lattice having been
 * subtracted already, is whatever the subtraction did not catch.
 *
 * This is the check that says whether a picture is an orbital or an ornament, and it costs
 * nothing: both fields are already on disk.
 *
 * usage: npx tsx scratch/samey.ts <tag> [channel]
 */
import { readFileSync, existsSync } from "node:fs";

const TAG = process.argv[2] ?? "c26all";
const CH = process.argv[3] ?? "accT";
const dir = `/home/fadi/Desktop/orbitmines/physics/visuals/vacuum/${TAG}`;

const STATES = ["2,1,0", "3,2,0", "2,0,0", "2,1,1", "3,0,0", "3,1,0", "3,2,1",
                "4,0,0", "4,1,0", "4,2,1", "4,3,2"];

const meta = JSON.parse(readFileSync(`${dir}/n1l0m0-meta.json`, "utf8"));
const { R, PXM, mask: MASK } = meta as { R: number; PXM: number; mask: number };
const mid = (PXM - 1) / 2, perCell = (PXM - 1) / (2 * R);
const rOf = (i: number, j: number) => Math.hypot(i - mid, j - mid) / perCell;

const load = (s: string) => {
  const [n, l, m] = s.split(",").map(Number);
  const p = `${dir}/n${n}l${l}m${m}-${CH}.f32`;
  if (!existsSync(p)) return null;
  const b = readFileSync(p);
  return Float64Array.from(new Float32Array(b.buffer, b.byteOffset, b.byteLength / 4));
};

const modulation = (a: Float64Array) => {
  const NB = Math.ceil(rOf(PXM - 1, PXM - 1)) + 1;
  const sum = new Float64Array(NB), cnt = new Float64Array(NB);
  for (let j = 0; j < PXM; j++) for (let i = 0; i < PXM; i++) {
    const b = Math.round(rOf(i, j)); sum[b] += a[j * PXM + i]; cnt[b]++;
  }
  const mu0 = new Float64Array(NB);
  for (let b = 0; b < NB; b++) mu0[b] = cnt[b] ? sum[b] / cnt[b] : 0;
  const H = Math.max(1, Math.round(perCell / 2)), mu = new Float64Array(NB);
  for (let b = 0; b < NB; b++) {
    let acc = 0, k = 0;
    for (let q = b - H; q <= b + H; q++) if (q >= 0 && q < NB && cnt[q]) { acc += mu0[q]; k++; }
    mu[b] = k ? acc / k : 0;
  }
  let big = 0; for (let b = 0; b < NB; b++) big = Math.max(big, Math.abs(mu[b]));
  const out = new Float64Array(a.length);
  for (let j = 0; j < PXM; j++) for (let i = 0; i < PXM; i++) {
    const b = Math.round(rOf(i, j));
    out[j * PXM + i] = Math.abs(mu[b]) < 0.05 * big ? 0 : a[j * PXM + i] / mu[b];
  }
  return out;
};

const base = load("1,0,0");
if (!base) throw new Error(`${dir} has no 1s - nothing to calibrate against`);
const B = modulation(base);

const inside: number[] = [];
for (let j = 0; j < PXM; j++) for (let i = 0; i < PXM; i++) {
  const r = rOf(i, j); if (r > MASK && r <= R) inside.push(j * PXM + i);
}

const fields = new Map<string, Float64Array>();
for (const s of STATES) {
  const a = load(s); if (!a) continue;
  const A = modulation(a), d = new Float64Array(A.length);
  for (let i = 0; i < d.length; i++) d[i] = A[i] - B[i];
  fields.set(s, d);
}
const have = [...fields.keys()];
if (have.length < 2) { console.log(`${TAG}: only ${have.length} state(s) yet - nothing to compare`); process.exit(0); }

const corr = (a: Float64Array, b: Float64Array) => {
  let sa = 0, sb = 0;
  for (const k of inside) { sa += a[k]; sb += b[k]; }
  const ma = sa / inside.length, mb = sb / inside.length;
  let num = 0, da = 0, db = 0;
  for (const k of inside) {
    const x = a[k] - ma, y = b[k] - mb; num += x * y; da += x * x; db += y * y;
  }
  return da > 0 && db > 0 ? num / Math.sqrt(da * db) : 0;
};
const rms = (a: Float64Array) => {
  let s = 0; for (const k of inside) s += a[k] * a[k];
  return Math.sqrt(s / inside.length);
};

console.log(`${TAG}  ${CH}  - beamless field of each state against every other`);
console.log(`  size  ` + have.map(s => rms(fields.get(s)!).toFixed(3).padStart(7)).join(""));
console.log(`        ` + have.map(s => s.padStart(7)).join(""));
for (const a of have)
  console.log(`  ${a.padEnd(6)}` +
    have.map(b => (a === b ? "     - " : corr(fields.get(a)!, fields.get(b)!).toFixed(2).padStart(7))).join(""));
console.log(`\n  near 0 between different states = the pipeline is reporting the STATES.`);
console.log(`  near 1 = it is reporting something they share, which after the 1s is subtracted`);
console.log(`  is lattice the calibration did not catch.`);
