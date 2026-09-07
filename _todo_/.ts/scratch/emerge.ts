/**
 * DOES l COME OUT OF THE ROTATION, OR ONLY OUT OF WHAT WAS PUT IN AT THE SOURCE?
 *
 * Everything drawn so far EMITTED a spherical harmonic and measured how much of it survived the
 * medium. That is a transport measurement and it cannot be anything else, because the linear
 * tracer turns rays about a UNIFORM axis - which is `turn.isotropic`, and `turn.isotropic` is
 * precisely the statement that there is no body. A uniform axis carries no direction, nothing
 * can be turned coherently, and no shape can appear that was not specified.
 *
 * The rules close a loop instead: `steer` turns about `held`, `fieldAt` builds `held` out of the
 * same rays' polarity times direction, so TURNING MAKES THE FIELD THAT DOES THE TURNING. The
 * question that has an emergent answer is therefore a stability one:
 *
 *      put a small l-shaped ripple in the field, run one pass of the rules,
 *      and measure whether that ripple comes back BIGGER or SMALLER.
 *
 * A mode that grows is self-sustaining - it is a shape the rules hold up on their own - and
 * which l grows is l EMERGING rather than being typed in. A mode that shrinks cannot be a body
 * however carefully it is emitted. Nothing here is told what a hydrogen orbital looks like: the
 * source is ISOTROPIC and unpolarised, and the only angular thing in the run is the seed ripple
 * whose fate is being measured.
 *
 * usage: npx tsx scratch/emerge.ts [theta-deg] [millions of rays] [amplitude]
 */
import { bins, cast, type Rules, type Source } from "../src/lib/Rays.ts";
import { legendre } from "../src/lib/Kernel.ts";

const THETA = Number(process.argv[2] ?? 45) * Math.PI / 180;
const MRAYS = Number(process.argv[3] ?? 2);
const AMP = Number(process.argv[4] ?? 0.3);
const RMAX = 4, NR = 48, NU = 48;

/* AN ISOTROPIC, UNSHAPED SOURCE - the only thing with an angle in this run is the seed field */
const SRC: Source = { weight: () => 1, sign: () => 1, schedule: () => 1, period: 1e9 };

/**
 * THE SEED: a field whose POLARITY varies as P_l(cos theta), pointing radially.
 *
 * `fieldAt` sums polarity times direction, so a region where more polarity of one sign is
 * heading outward than inward has a radial B. Giving that an l-shaped amplitude is the smallest
 * thing that is a ripple of order l and nothing else.
 */
const seed = (l: number, amp: number) =>
  (x: number, y: number, z: number, out: Float64Array) => {
    const r = Math.hypot(x, y, z);
    if (r < 1e-9 || r > RMAX) { out[0] = out[1] = out[2] = 0; return; }
    const s = amp * legendre(l, z / r);
    out[0] = s * x / r; out[1] = s * y / r; out[2] = s * z / r;
  };

/*
 * THE GAIN IS FIELD IN AGAINST FIELD OUT, because that is the loop the rules close.
 *
 * Reading it off the TURNING was the wrong measurement and reported nought for every mode: the
 * turning is a scalar count and the thing that has to feed itself is the FIELD - polarity times
 * direction, which is what `fieldAt` sums and what `steer` turns about. So seed a radial P_l
 * ripple, run the rules, read back the radial part of the field the rays made, and project it
 * on the same P_l. Bigger than it went in means the shape holds itself up.
 */
const radialField = (B: { fieldR: Float64Array }) => B.fieldR;

/** what an l-ripple in the OUTPUT is worth, read off whatever field is handed in */
const project = (f: Float64Array, l: number) => {
  let num = 0, w = 0;
  for (let ir = 0; ir < NR; ir++) {
    const r = (ir + 0.5) * RMAX / NR;
    if (r < 0.4 || r > RMAX * 0.9) continue;
    let ss = 0;
    for (let iu = 0; iu < NU; iu++) ss += f[ir*NU + iu] ** 2;
    const rms = Math.sqrt(ss / NU);
    if (!(rms > 0)) continue;
    for (let iu = 0; iu < NU; iu++) {
      const u = -1 + (iu + 0.5) * 2 / NU;
      num += f[ir*NU + iu] / rms * legendre(l, u); w++;
    }
  }
  return w ? num / w * (2*l + 1) : 0;
};

const run = (l: number, amp: number) => {
  const R: Rules = { theta: THETA, absorb: 0.5, stir: 0.5,
    field: amp === 0 ? undefined : seed(l, amp) };
  const B = bins(NR, NU, RMAX);
  cast({ R, source: SRC, out: B, count: MRAYS * 1_000_000, seed: 4242 });
  return B;
};

console.log(`THETA = ${(THETA*180/Math.PI).toFixed(0)}deg, ${MRAYS}M rays, seed amplitude ${AMP}`);
console.log(`an ISOTROPIC source. The seed is a P_l ripple in the FIELD; what is measured is the`);
console.log(`P_l content of the turning that comes back out.\n`);

/* the control: no field at all, so whatever this reports is the noise floor */
const base = run(0, 0);
console.log(`  no field at all (the floor):  ` +
  [1,2,3,4].map(l => `P${l}=${project(radialField(base), l).toFixed(3)}`).join("  "));
console.log();
const base0 = radialField(base);
console.log(`  seeded    field out    gain    turning out   other field channels`);
for (const l of [1, 2, 3, 4]) {
  const B = run(l, AMP);
  const fld = radialField(B);
  /* the unseeded run subtracted, so what is scored is the RESPONSE and not the vacuum's own */
  const resp = new Float64Array(fld.length);
  for (let i = 0; i < fld.length; i++) resp[i] = fld[i] - base0[i];
  const own = project(resp, l);
  const others = [1,2,3,4].filter(k => k !== l)
    .map(k => `P${k}=${project(resp, k).toFixed(3)}`).join(" ");
  console.log(`  l=${l}     ${own.toFixed(4).padStart(10)}  ${(own/AMP).toFixed(3).padStart(7)}   ` +
    `${project(B.turns, l).toFixed(4).padStart(9)}     ${others}`);
}
console.log(`\n  gain > 1 means the rules AMPLIFY that shape - it feeds itself and is a body.`);
console.log(`  gain < 1 means it dies however it is emitted.`);
