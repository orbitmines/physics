/**
 * RUN THE MODEL AND WRITE DOWN WHAT IT SAID — the half of a picture that is physics.
 *
 *   tsx tools/MEASURE.ts [name…]
 *
 * A panel that closes the rules and sums a galaxy every time it is drawn costs minutes per
 * colour change, and hides its own numbers inside a canvas. This does the measuring once and
 * puts it beside the picture as named `Float32` columns with a JSON header; `RENDER.ts` hands
 * those to the page and a panel just draws. Change the look, re-render in seconds. Change the
 * rules, measure again — and the header says when, so a stale picture can be caught.
 *
 * IT IS SWEPT ON A REGULAR GRID, and that is what makes the picture possible rather than
 * merely faster. What a panel wants is a DENSITY in the plane it draws: how likely a galaxy is
 * to be found at a given pair of accelerations. That is the pushforward of the mass
 * distribution through the model, and a pushforward needs to know how a patch of `(M, R)` maps
 * onto a patch of the plane — which a scatter of unrelated samples cannot say and a grid can.
 *
 * NOTHING HERE DECIDES ANY PHYSICS. It sweeps the two things a source is allowed to define —
 * how much mass, how much skin — and the radius a probe sits at. The rest is closed off
 * `G.ts` by `Prove`.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { at as num, boost, fact, A0_LATTICE } from "./MODEL.ts";
import type { Header } from "../src/visuals/DATA.ts";

const OUT = `${import.meta.dirname}/../../../visuals`;

/** columns of numbers and a header, beside the picture they are drawn into */
const save = (id: string, columns: Record<string, number[]>, extra: Record<string, unknown>) => {
  const dir = `${OUT}/${id}`;
  mkdirSync(dir, { recursive: true });
  const names = Object.keys(columns);
  const rows = columns[names[0]].length;
  for (const n of names)
    if (columns[n].length !== rows)
      throw new Error(`${id}: ${n} has ${columns[n].length} rows where ${names[0]} has ${rows}`);
  /*
   * AND A COLUMN OF NOTHING IS NOT A MEASUREMENT.
   *
   * A rule changed shape under `MODEL.boost` and every call came back `NaN`. This wrote nine
   * hundred of them to disk without a word, the render succeeded, and the panels came out with
   * the model curve, the six discs and four labels silently missing - which looks exactly like
   * a styling change nobody made. A column that is entirely not-a-number is the measurement
   * having failed, and it should stop here rather than downstream in a picture.
   */
  for (const n of names)
    if (!columns[n].some(v => Number.isFinite(v)))
      throw new Error(`${id}: column ${n} is not a number anywhere - the model did not answer, ` +
        `and a field of NaN drawn as a blank panel is worse than a failed run`);
  const all = new Float32Array(names.length * rows);
  names.forEach((n, i) => all.set(columns[n], i * rows));
  const header: Header = {
    what: id, columns: names, rows, measured: new Date().toISOString(), ...extra,
  };
  writeFileSync(`${dir}/field.f32`, Buffer.from(all.buffer));
  writeFileSync(`${dir}/meta.json`, JSON.stringify(header, null, 2) + "\n");
  console.log(`  ${id.padEnd(14)} ${String(rows).padStart(6)} rows × ${names.length} columns ` +
    `(${names.join(", ")})  →  visuals/${id}/field.f32`);
};

/*
 * THE CONFIGURATION SPACE — every galaxy the model can be asked about, swept whole.
 *
 * A source is allowed to define three things and they are all here: HOW MUCH mass, HOW BIG it
 * is spread, and WHERE the probe sits in it. Sweeping mass and radius while holding the size
 * fixed asks about one shape of galaxy repeated at every mass, which is a slice through the
 * space and not the space - and real discs range over decades in scale length at the same
 * mass, so that slice is exactly the width a region would have shown.
 *
 * THE GRID IS REGULAR IN ALL THREE, evenly in the logarithm because all three range that way,
 * and that regularity is what makes the pushforward computable: a cell is a patch of
 * configurations, and its image is the patch of the plane those configurations land on.
 */
const MASSES = { from: 3, to: 7.5, n: 28 };
const SIZES = { from: Math.log10(4), to: Math.log10(400), n: 13 };
const RADII = { from: -0.9, to: 2.6, n: 64 };      // radii as multiples of the scale length
const axis = (a: { from: number; to: number; n: number }, i: number) =>
  Math.pow(10, a.from + (a.to - a.from) * (i / (a.n - 1)));

const sweep = (
  id: string,
  parts: (R: number, M: number, rd: number) => { gN: number; g: number },
) => {
  const M: number[] = [], Rd: number[] = [], R: number[] = [];
  const gN: number[] = [], g: number[] = [], w: number[] = [];
  const t0 = Date.now();
  const dM = (MASSES.to - MASSES.from) / (MASSES.n - 1);
  const dS = (SIZES.to - SIZES.from) / (SIZES.n - 1);
  const dR = (RADII.to - RADII.from) / (RADII.n - 1);
  for (let s = 0; s < SIZES.n; s++) {
    const rd = axis(SIZES, s);
    for (let i = 0; i < MASSES.n; i++) {
      const m = axis(MASSES, i);
      for (let j = 0; j < RADII.n; j++) {
        /* the probe's radius is swept in units of the disc's OWN size, so every galaxy is
         * sampled over the same part of itself however big it is */
        const r = axis(RADII, j) * rd;
        const p = parts(r, m, rd);
        M.push(m); Rd.push(rd); R.push(r);
        gN.push(p.gN > 0 ? p.gN : 0);
        g.push(p.g > 0 ? p.g : 0);
        /* uninformative over all three - see the note in the panel about what the weight is */
        w.push(dM * dS * dR);
      }
    }
    process.stdout.write(`\r    ${id}: ${s + 1}/${SIZES.n} sizes`);
  }
  process.stdout.write("\r" + " ".repeat(48) + "\r");
  save(id, { M, Rd, R, gN, g, w }, {
    grid: { masses: MASSES, sizes: SIZES, radii: RADII, order: "size-major, then mass, then radius" },
    a0: A0_LATTICE(),
    seconds: (Date.now() - t0) / 1000,
  });
};

/*
 * THE DENSITY ALONG THE CURVE — solved, not sampled.
 *
 * `a_{0}` is the ambient one, so what is felt is a FUNCTION of what arrives and every galaxy
 * this theory admits lands on one curve. The picture of the possibilities is therefore that
 * curve carrying how much of the possible lands where, and that is a change of variables rather
 * than a tally:
 *
 *     p(\log g_{N}) = \int\int \frac{d\log m\, d\log A}{\abs{\partial\log g_{N}/\partial\log R}}
 *                     evaluated where the radius puts the arrival at that value
 *
 * THE INTEGRAND IS THE PROVER'S OWN. The arrival is `curvesOfEach`'s closed form and the slope
 * underneath is `crowdingOfArrivals`, taken by the algebra's derivative - neither is retyped
 * here. The output axis is walked directly, so nothing is binned: at each value of the arrival
 * the radius that reaches it is solved for, and the weight is read there.
 *
 * WHAT IS SWEPT IS WHAT A SOURCE DEFINES and nothing else: how much mass, how big a face it
 * presents, and where the probe sits. There is no disc profile in it, because `arrangement`
 * showed the scattered answer does not depend on how the mass is cut up.
 */
/*
 * THE POSSIBILITY SPACE — and whether it is a line or an area is decided here, not assumed.
 *
 * What is felt is `F_{g}` of what arrives AND of the scale, and `crossing` derives that scale
 * as the medium a carrier crossed on its way: `\frac{1}{R}\int_{0}^{R}\sigma\rho(s)ds` over
 * `crowding`'s own profile. Both depend on the mass, the face and the radius - so at one value
 * of the arrival, different galaxies can be felt differently, and the possibilities have a
 * WIDTH. If the scale had turned out the same for all of them the width would come back zero
 * on its own; nothing here puts one in.
 *
 * THE WEIGHT IS THE CHANGE OF VARIABLES, in two directions now rather than one: a patch of
 * `(\log R, \log m)` at a face maps to a patch of the plane, and what lands there is the patch
 * over the area of its image. The derivatives are taken numerically off the DERIVED closed
 * forms - there is no second expression for any of this written out by hand.
 */
/*
 * THE POSSIBILITY SPACE, AND WHAT EACH PART OF IT CONTRIBUTES.
 *
 * What is felt is `F_{g}` of what arrives AND of the scale, and `crossing` derives that scale
 * as the medium a carrier crossed getting there. Both depend on what a source decides, so the
 * possibilities have a width - and it is a result, not a setting: had the scale come out the
 * same for every body the width would be nought on its own.
 *
 * AND THE SAME SWEEP IS RUN ONCE PER VARIABLE, with the others held at the middle of their
 * range, so the picture can say WHICH FREEDOM MAKES WHICH PART OF THE SPREAD. A region is one
 * number per place and hides that entirely: two variables that each move the answer a little
 * look the same as one that moves it a lot. The marginals along the edge separate them.
 */
type Axis = { from: number; to: number; n: number; linear?: boolean };

const density = (id: string, how: "gathered" | "scattered") => {
  const arrival = fact(`what arrives with the mass ${how}`);
  const felt = fact("F_{g}");
  const rhoAt = fact("\\rho at R");
  if (!arrival || !felt || !rhoAt) { console.log(`  ${id}: nothing derived to integrate`); return; }
  const a0v = A0_LATTICE();

  /*
   * WHAT IS FIXED IS THE WORLD, AND WHAT IS SWEPT IS THE SOURCE. `D` and `DEG` are the
   * dimension and the lattice's degree - facts about where this happens, not choices a body
   * makes. Everything below is something a source decides: how much mass, how wide a face,
   * where the probe sits, how it MOVES and how it RADIATES.
   */
  const base: Record<string, number> = { D: 3, DEG: 26, "\\bar{c}": 1, "m'": 1, "A'": 1, "\\bar{R}'": 1, "m_{\\Sigma}": 1, "m_{\\Sigma}'": 1, "\\mathcal{D}": 1, "\\mathcal{D}'": 1, "\\beta'": 0, "\\beta\\cdot\\hat{d}": 0, "\\beta'\\cdot\\hat{d}": 0 };
  for (const rate of ["\\nu", "\\sigma", "F"]) {
    const g = fact(rate); if (g) base[rate] = num(g.to, base);
  }
  const rho = fact("\\rho_{\\infty}"); if (rho) base["\\rho"] = num(rho.to, base);
  /*
   * AND THE SHARE OF DRAWN WAYS THAT LEAD SOMEWHERE, which this had been leaving unbound.
   *
   * `\omega` is settled by the SPACE ledger the way `\rho` is settled by the ray one, and
   * `MODEL.settled()` reads it off the store in exactly these two lines. This function does
   * the same job for the sweep and had every rate but that one - so `n_{f}` came back NaN,
   * and with it `\sigma_{tr}`, `L`, both channels and every number this file writes. Nothing
   * complained: a NaN divides and compares like anything else, and what reached disk was a
   * field of them.
   *
   * IT IS READ AFTER `\rho` BECAUSE IT IS WRITTEN IN IT, which is the order `settled()` uses
   * and the reason the two cannot be looped over together with the rates above.
   */
  const om = fact("\\omega"); if (om) base["\\omega"] = num(om.to, base);

  const AXES: Record<string, Axis> = {
    mass: { from: 2, to: 9, n: 46 },
    face: { from: 1, to: 6, n: 28 },
    moving: { from: 0, to: 0.9, n: 5, linear: true },
    radiating: { from: -2, to: 2, n: 5 },
  };
  const R0 = -1, R1 = 8, RS = 170;                    // the radius always runs - it is the track
  const value = (a: Axis, i: number) => {
    const t = a.n > 1 ? i / (a.n - 1) : 0.5;
    const v = a.from + (a.to - a.from) * t;
    return a.linear ? v : Math.pow(10, v);
  };

  /* the fold record and what follows it depend on the radius alone - solved once per radius */
  const rad: number[] = [], env: Record<string, number>[] = [];
  for (let i = 0; i < RS; i++) {
    const R = Math.pow(10, R0 + (R1 - R0) * i / (RS - 1));
    /* and the separation, which the laws now name `\bar{r}` - `R` was two lengths */
    const e: Record<string, number> = { ...base, R, r: R, "\\bar{r}": R };
    for (const n of ["n_{f}", "\\sigma_{tr}", "L"]) {
      const g = fact(n); if (g) e[n] = num(g.to, e);
    }
    rad.push(R); env.push(e);
  }

  /* the medium crossed, averaged along the way in - `crowding`'s profile carried outward */
  const crossed = (m: number, A: number) => {
    const out = new Float64Array(RS);
    let sum = 0, last = 0;
    for (let k = 0; k < RS; k++) {
      /*
       * AND THE BODY'S OWN DEPTH, which `shadowing` now names `\bar{R}` instead of spelling
       * `m/A` into every law it touches. It is that same count - what a body has over what it
       * shows - so it is bound off the two axes that carry them.
       */
      const r = num(rhoAt.to, { ...env[k], m, A, "\\bar{R}": m / A });
      const here = Number.isFinite(r) && r > 0 ? r : base["\\rho"];
      if (k > 0) sum += 0.5 * (here + last) * (rad[k] - rad[k - 1]);
      last = here;
      out[k] = k === 0 ? here : sum / rad[k];
    }
    return out;
  };

  /*
   * THE GRID IS AS FINE AS THE PICTURE IS, so the region stops looking like tiles.
   *
   * It costs almost nothing: the expensive part is evaluating the derived laws along each
   * track, and that count does not change with the grid - only the laying-down does, which is
   * arithmetic. What DOES have to keep up is the number of tracks, or a finer grid just shows
   * the gaps between them, so the mass and face steps go up with it.
   */
  const XS = 700, X0 = -5, X1 = 4;                    // what arrives, in units of a_0
  const YS = 520, Y0 = -4, Y1 = 4;                    // what is felt, in the same units
  const dx = (X1 - X0) / (XS - 1), dy = (Y1 - Y0) / (YS - 1);

  /** the region, with only the named freedoms allowed to vary - the rest sit mid-range */
  const lay = (vary: Set<string>) => {
    const grid = new Float64Array(XS * YS);
    const steps = (k: string) => (vary.has(k) ? AXES[k].n : 1);
    const pick = (k: string, i: number) =>
      vary.has(k) ? value(AXES[k], i) : value(AXES[k], -1);
    for (let mi = 0; mi < steps("mass"); mi++) {
      const m = pick("mass", mi);
      for (let ai = 0; ai < steps("face"); ai++) {
        const A = pick("face", ai);
        const avg = crossed(m, A);                     // does not depend on moving or radiating
        for (let bi = 0; bi < steps("moving"); bi++) {
          const beta = pick("moving", bi);
          for (let si = 0; si < steps("radiating"); si++) {
            const S0 = pick("radiating", si);
            const xs: number[] = [], ys: number[] = [];
            for (let k = 0; k < RS; k++) {
              /*
             * THE SWEPT AXIS IS THE EMISSIVITY NOW, not a source strength.
             *
             * `\Sigma_{0}` was the one free number in the derivation and it is gone:
             * `emissivity` shows that what a body emits per unit of what it blocks is a
             * RATIO of two firing counts, `m_{\Sigma}`, and it is that ratio the meetings
             * channel carries. Same axis, same range, and now the thing being varied is the
             * quantity Eotvos bounds rather than an unexplained amplitude.
             */
            const e = { ...env[k], m, A, "\\bar{R}": m / A,
              "\\beta": beta, "m_{\\Sigma}": S0, "m_{\\Sigma}'": S0 };
              const gN = num(arrival.to, e);
              const g = num(felt.to,
                { ...e, "g_{N}": gN, "a_{0}": base["\\sigma"] * avg[k] });
              xs.push(gN > 0 ? Math.log10(gN / a0v) : NaN);
              ys.push(g > 0 ? Math.log10(g / a0v) : NaN);
            }
            /* the track laid between neighbours, weighted by the length of its image -
             * a change of variables, so nothing here is a count of sampled points */
            for (let k = 0; k < RS - 1; k++) {
              const xa = xs[k], xb = xs[k + 1], ya = ys[k], yb = ys[k + 1];
              if (![xa, xb, ya, yb].every(Number.isFinite)) continue;
              const st = Math.max(1, Math.ceil(Math.max(
                Math.abs(xb - xa) / dx, Math.abs(yb - ya) / dy)));
              for (let t = 0; t < st; t++) {
                const f = (t + 0.5) / st;
                const gx = Math.round((xa + f * (xb - xa) - X0) / dx);
                const gy = Math.round((ya + f * (yb - ya) - Y0) / dy);
                if (gx < 0 || gy < 0 || gx >= XS || gy >= YS) continue;
                grid[gy * XS + gx] += 1 / st;
              }
            }
          }
        }
      }
    }
    return grid;
  };

  /*
   * AND WHICH FREEDOM A CELL ACTUALLY NEEDS — asked by taking each one away.
   *
   * ADDING THEM UP IN AN ORDER DOES NOT ANSWER THIS. Whichever goes first collects everything
   * the later ones could also have reached, and whichever goes last gets only what nothing
   * else can do - so `moving` came out at three cells in a thousand purely because it was
   * fourth in a list I chose. That is a fact about the list.
   *
   * The question with an answer is: IS THIS FREEDOM NECESSARY HERE? Run the whole sweep, then
   * run it again with one freedom held still; a cell that was reachable and now is not NEEDS
   * that freedom, whatever else is free. That does not depend on any order.
   *
   * A cell can need two at once, and many need none - reachable several ways. Both are marked
   * as themselves rather than forced into a winner.
   */
  const ORDER = ["mass", "face", "moving", "radiating"];
  const all = new Set(Object.keys(AXES));
  const grid = lay(all);
  const need = new Float64Array(XS * YS).fill(0);     // a bit per freedom that is necessary
  const count = new Float64Array(XS * YS).fill(0);
  for (let k = 0; k < ORDER.length; k++) {
    const without = new Set(all); without.delete(ORDER[k]);
    const g = lay(without);
    for (let i = 0; i < need.length; i++)
      if (grid[i] > 0 && !(g[i] > 0)) { need[i] += 1 << k; count[i] += 1; }
  }
  /*
   * `by` IS THE SET ITSELF, one bit per freedom, and not a collapsed label.
   *
   * Saying a cell "needs two" throws away WHICH two, and that is the interesting half: mass
   * and face together is a different statement about a galaxy than mass and what it radiates.
   * The bits cost nothing to carry and the picture can colour a combination by mixing the
   * colours of what is in it, so a pair reads as a pair rather than as a category.
   *
   * Nought means no freedom is necessary - several arrangements reach that cell.
   */
  const stage = need;

  const x: number[] = [], y: number[] = [], p: number[] = [], by: number[] = [];
  for (let gy = 0; gy < YS; gy++) for (let gx = 0; gx < XS; gx++) {
    x.push(X0 + gx * dx); y.push(Y0 + gy * dy);
    p.push(grid[gy * XS + gx]); by.push(stage[gy * XS + gx]);
  }
  let most = 0; for (const v of p) if (v > most) most = v;
  save(id, { x, y, p, by }, {
    a0: a0v, arrangement: how, most,
    grid: { arrives: { from: X0, to: X1, n: XS }, felt: { from: Y0, to: Y1, n: YS } },
    freedoms: ORDER,
    stages: ["nought is: reachable several ways; otherwise one bit per freedom, in the " +
      "order of `freedoms`, for each one that is NECESSARY there"],
    about: "how much of the possible lands at each pair of what arrives and what is felt, " +
      "and `by` is which freedom that cell NEEDS - found by taking each one away in turn, " +
      "so it does not depend on any order they might be added in",
  });
};

/*
 * AND THE LAW ITSELF, on its own, so anything that needs it can read it without the prover.
 *
 * `boost` is what `closing` derives, read at the ambient scale. A panel wants the curve and
 * nothing else, and closing the rules to draw one line is what made every picture wait.
 */
const law = () => {
  const a0 = A0_LATTICE();
  const gN: number[] = [], g: number[] = [];
  for (let i = 0; i <= 900; i++) {
    const x = Math.pow(10, -5 + 9 * i / 900) * a0;
    gN.push(x); g.push(boost(x, a0));
  }
  save("law", { gN, g }, { a0, theory: "G",
    about: "what arrives against what is felt, both in units of a_0" });
};

const only = process.argv.slice(2);
const want = (n: string) => !only.length || only.some(o => n.includes(o));

console.log(`\n═════ measuring → ${OUT}/<id>/field.f32 ═════\n`);
console.log(`  a_0 off the rules = ${A0_LATTICE()}\n`);
if (want("galaxy.point")) density("galaxy.point", "gathered");
if (want("galaxy.many")) density("galaxy.many", "scattered");
if (want("law")) law();
console.log("");
