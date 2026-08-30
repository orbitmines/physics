/**
 * WHAT HARMONIC IS ACTUALLY THERE - the test that says whether this is hydrogen or an ornament.
 *
 * Correlating one state's picture against another's says whether the pipeline distinguishes
 * them, and `samey.ts` does that. It does NOT say whether what it reports is the RIGHT thing:
 * a 2p and a 3d could differ from each other and both be wrong. So project onto the harmonics
 * the states are supposed to produce and read off the coefficients.
 *
 * The turning channel is a DENSITY - quadratic in the field - so the angle it should carry is
 * |Y_lm(theta)|^2 expanded in Legendre polynomials, not Y_lm itself. Worked out:
 *
 *   1s   |Y00|^2 = 1                          -> P0 only
 *   2p0  |Y10|^2 ~ cos^2                      -> P0/3   + P2 (2/3)
 *   2p1  |Y11|^2 ~ sin^2                      -> P0(2/3) - P2 (2/3)
 *   3d0  |Y20|^2 ~ (3cos^2-1)^2               -> P0      + P2 (1.14) + P4 (2.06)
 *   3d1  |Y21|^2 ~ sin^2 cos^2                -> P0      - P2 (0.23) - P4 (0.59)
 *   4f2  |Y32|^2 ~ sin^4 cos^2                -> P0      - P2 (0.49) + P4 (0.13) - P6 ...
 *
 * The MEAN over the ring is divided out upstream, so P0 is gone by construction and the first
 * thing to read is P2. A state whose P2 has the predicted SIGN and whose P4 grows with l is the
 * lattice carrying the harmonic; a set of states that all report the same coefficients is the
 * lattice carrying itself.
 *
 * usage: npx tsx scratch/harmonics.ts <tag> [channel]
 */
import { readFileSync, existsSync } from "node:fs";
import { CHANNELS, expected, pct, score } from "./expect.ts";

const TAG = process.argv[2] ?? "c26all";
const CH = process.argv[3] ?? "accT";
const dir = `/home/fadi/Desktop/orbitmines/physics/visuals/vacuum/${TAG}`;
const STATES = ["1,0,0", "2,1,0", "3,2,0", "2,0,0", "2,1,1", "3,0,0", "3,1,0", "3,2,1",
                "4,0,0", "4,1,0", "4,2,1", "4,3,2"];

const meta = JSON.parse(readFileSync(`${dir}/n1l0m0-meta.json`, "utf8"));
const { R, PXM, mask: MASK } = meta as { R: number; PXM: number; mask: number };
const mid = (PXM - 1) / 2, perCell = (PXM - 1) / (2 * R);

const load = (s: string) => {
  const [n, l, m] = s.split(",").map(Number);
  const p = `${dir}/n${n}l${l}m${m}-${CH}.f32`;
  if (!existsSync(p)) return null;
  const b = readFileSync(p);
  return Float64Array.from(new Float32Array(b.buffer, b.byteOffset, b.byteLength / 4));
};

const P = (l: number, x: number): number => {
  if (l === 0) return 1;
  if (l === 1) return x;
  let pm = 1, p = x;
  for (let k = 2; k <= l; k++) { const pn = ((2*k-1)*x*p - (k-1)*pm)/k; pm = p; p = pn; }
  return p;
};

/*
 * THE ANGULAR PROFILE, AVERAGED OVER RADIUS AFTER EACH RADIUS IS NORMALISED BY ITS OWN MEAN.
 * Normalising first is what makes the average meaningful: the field falls by orders between the
 * middle and the rim, so an unnormalised average is the innermost ring and nothing else.
 */
const NA = 60;                                     // bins in cos(theta), -1 .. 1
const angular = (a: Float64Array) => {
  const NB = Math.ceil(Math.hypot(mid, mid) / perCell) + 1;
  const rs = new Float64Array(NB), rc = new Float64Array(NB);
  const rOf = (i: number, j: number) => Math.hypot(i - mid, j - mid) / perCell;
  for (let j = 0; j < PXM; j++) for (let i = 0; i < PXM; i++) {
    const b = Math.round(rOf(i, j)); rs[b] += a[j*PXM+i]; rc[b]++;
  }
  /*
   * NORMALISED BY THE RMS ROUND EACH RING, not by the mean - so this and the ray tracer's own
   * projection are the SAME measurement and their numbers can be put in one table. A signed
   * channel's ring mean is nought by construction and dividing by it reported P1 = 736; the RMS
   * exists for both kinds of channel and differs from the mean, for a positive density, by an
   * O(1) factor that is the same at every radius.
   */
  const rr = new Float64Array(NB), rn = new Float64Array(NB);
  for (let j = 0; j < PXM; j++) for (let i = 0; i < PXM; i++) {
    const b = Math.round(rOf(i, j)); rr[b] += a[j*PXM+i] * a[j*PXM+i]; rn[b]++;
  }
  const sum = new Float64Array(NA), cnt = new Float64Array(NA);
  for (let j = 0; j < PXM; j++) for (let i = 0; i < PXM; i++) {
    const r = rOf(i, j);
    if (r <= MASK + 1 || r > R) continue;
    const b = Math.round(r);
    const mu = rn[b] ? Math.sqrt(rr[b]/rn[b]) : 0;
    if (!(mu > 0)) continue;
    const u = (j - mid) / (r * perCell);           // cos(theta), the axis being z = up = j
    const k = Math.min(NA - 1, Math.max(0, Math.floor((u + 1) / 2 * NA)));
    sum[k] += a[j*PXM+i] / mu; cnt[k]++;
  }
  const out = new Float64Array(NA);
  for (let k = 0; k < NA; k++) out[k] = cnt[k] ? sum[k]/cnt[k] : 0;
  return out;
};

/* c_l = (2l+1)/2 * integral A(u) P_l(u) du, on the bins that have anything in them */
const project = (A: Float64Array, l: number) => {
  let acc = 0, w = 0;
  for (let k = 0; k < NA; k++) {
    if (A[k] === 0) continue;
    const u = -1 + (k + 0.5) * 2 / NA;
    acc += A[k] * P(l, u); w += 1;
  }
  return w ? acc / w * (2*l+1) / 2 * 2 : 0;         // du = 2/NA, and w bins of it
};

console.log(`${TAG}  ${CH}  - |Y|^2 projected on Legendre, P0 removed upstream by the ring mean`);
console.log(`  state      P1       P2       P3       P4       P6   |  as a % of what |Y_lm|^2 puts there`);
console.log(`  ` + "-".repeat(100));
/* the expectation, the scoring and the Legendre recurrence are shared with the ray
 * tracer's own table so the two models are scored by the same lines - see `expect.ts` */
for (const s of STATES) {
  const a = load(s); if (!a) continue;
  const A = angular(a);
  const c = CHANNELS.map(L => project(A, L));
  const [, sl, sm] = s.split(",").map(Number);
  const e = expected(sl, sm);
  /* a channel counts as CARRIED when it has the right sign and reaches a tenth of what a
   * lattice-free emission would put there - the 1s row is the floor to read it against */
  const mark = score(c, e), pc = pct(c, e);
  console.log(`  ${s.padEnd(7)}` + c.map((v, i) => (v.toFixed(3) + mark[i]).padStart(9)).join("") +
    `  |  ` + pc.map(v => (Number.isNaN(v) ? "     -" : `${v.toFixed(0)}%`.padStart(6))).join(""));
}
