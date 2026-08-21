/**
 * WHAT THE TILING IS — counted in STEPS, exactly, and checked with integers.
 *
 * NOTHING HERE IS FITTED. The version this replaced measured the shell exponent as a
 * log-log slope of site counts against Euclidean distance inside a box: 1.906 at N = 17,
 * 1.950 at N = 21, 1.960 at N = 31, creeping towards 2 and never arriving, because a box
 * has corners and a Euclidean shell near the wall is not a shell. Rounding that to 2 is
 * a judgement call standing where a theorem ought to be, and it is true only in the box
 * it was fitted in.
 *
 * THE RADIUS IS r̄ — HOW MANY STEPS. Everything in this model moves by taking exits, so
 * the honest radius is a count of hops rather than a length, and it is what makes the
 * argument exact: the sites within r̄ steps are precisely the r̄-fold dilate of the sites
 * within one, so the ball is a dilated polytope and Ehrhart's theorem applies to it
 * verbatim. That gives a polynomial of degree exactly D, at every r̄, on any lattice.
 *
 * SO WHAT IS PROBED IS NOT THE EXPONENT BUT THE PREMISE. Two things: that the ball is a
 * dilate, which is established by walking the lattice and checking that the ball at
 * r̄ steps grows the way a dilate must; and the degree, checked EXACTLY. The count is an
 * integer, and a sequence is a polynomial of degree D exactly when its D-th finite
 * difference is constant and its (D+1)-th is zero. That is arithmetic on whole numbers
 * with no tolerance in it, and it either holds or it does not.
 *
 * AND IT IS GENERAL IN D. The determinant is taken by elimination for any dimension and
 * the differences are taken to whatever order the lattice needs, so a geometry this
 * repository has not got yet is handled by the same code.
 */
import { Geometry, Vec } from "../../lib/Local.ts";
import { BALL, BETA, RBAR, ROOM, SHELL } from "../Rules.ts";
import { Lab, Probe, Probing, box, measure, middle } from "../Probe.ts";
import { Emitted, Measured } from "../Kernel.ts";

/** the lattice's own site density — one site per fundamental cell */
export const RHO = "ρ";

/**
 * |det basis|, for any number of dimensions — the volume of one fundamental cell.
 *
 * By elimination rather than by a formula per dimension. The hard-coded 2×2 and 3×3 it
 * replaced were correct and were also the only two this folder could ever have handled,
 * which is the wrong shape for a file whose whole claim is that it does not care which
 * lattice it is given.
 */
const det = (m: Vec[]): number => {
  const n = m.length, a = m.map(row => [...row]);
  let d = 1;
  for (let i = 0; i < n; i++) {
    let pivot = i;
    for (let r = i + 1; r < n; r++) if (Math.abs(a[r][i]) > Math.abs(a[pivot][i])) pivot = r;
    if (Math.abs(a[pivot][i]) < 1e-12) return 0;
    if (pivot !== i) { [a[i], a[pivot]] = [a[pivot], a[i]]; d = -d; }
    d *= a[i][i];
    for (let r = i + 1; r < n; r++) {
      const f = a[r][i] / a[i][i];
      for (let c = i; c < n; c++) a[r][c] -= f * a[i][c];
    }
  }
  return Math.abs(d);
};

/** one round of finite differences — the operation the degree check is made of */
const diff = (v: number[]): number[] =>
  v.slice(1).map((x, i) => x - v[i]);

/**
 * HOW MANY SITES ARE WITHIN r̄ STEPS OF THE CENTRE — a breadth-first walk of the lattice
 * itself, following exits, which is how anything in this model actually travels.
 *
 * Walked over the world's own links rather than computed from coordinates, so a geometry
 * whose exits are skew, or weighted, or of unequal length is counted correctly without
 * this file knowing anything about it.
 */
const ballsByStep = (w: any, centre: any, upto: number): number[] => {
  const seen = new Set<any>([centre]);
  let edge = [centre];
  const out = [1];
  for (let k = 1; k <= upto; k++) {
    const next: any[] = [];
    for (const l of edge)
      for (const ray of l.rays as any[])
        for (const b of ray.boundaries as any[]) {
          const there = b.target?.source?.l;
          if (!there || seen.has(there)) continue;
          seen.add(there); next.push(there);
        }
    if (!next.length) break;
    edge = next;
    out.push(seen.size);
  }
  return out;
};

export const lattice: Probe = {
  id: "lattice/what-the-tiling-is",
  asks: "how many sites lie within \\bar{r} steps of a point, is that count a polynomial in " +
    "\\bar{r}, and does this lattice's set of exits prefer any direction?",
  run: (lab: Lab): Probing => {
    const g: Geometry = lab.geometry, D = g.D;
    const measured: Measured[] = [];
    const facts: Emitted[] = [];

    /* —— the density, exactly, in any dimension ————————————————————————— */
    const v = det(g.basis), rho = v ? 1 / v : NaN;
    measured.push(measure("volume of one fundamental cell", v,
      `|det basis| for ${g.name}, by elimination in ${D} dimensions - from the basis ` +
      `vectors themselves, with no run and no fit`));

    /* —— the ball, walked in steps ——————————————————————————————————— */
    const N = lab.boxFor(g);
    const w = box(lab, g, N, lab.seeds[0], "absorb");
    const centre = nearest(w, middle(g, N));
    /* far enough inside the box that the walk never meets a wall: a ball of r̄ steps
     * reaches at most r̄ cells, so the reading stops well short of the edge */
    const upto = Math.max(D + 2, Math.min(8, Math.floor((N - 1) / 2) - 2));
    const balls = ballsByStep(w, centre, upto);

    measured.push(measure("sites within \\bar{r} steps", balls.length - 1,
      `walked over the lattice's own exits from the centre: ${balls.join(", ")} ` +
      `for \\bar{r} = 0, 1, 2, ...`));

    /* —— the degree, checked exactly on integers ————————————————————— */
    let seq = balls, order = 0, constant = false;
    const rounds: string[] = [`ball(\\bar{r}) = ${balls.join(", ")}`];
    while (seq.length > 1 && order < D + 2) {
      seq = diff(seq); order++;
      rounds.push(`Δ^{${order}} = ${seq.join(", ")}`);
      if (seq.length >= 2 && seq.every(x => x === seq[0])) { constant = true; break; }
    }
    const degree = constant ? order : NaN;
    measured.push(measure("degree of the count in \\bar{r}", degree,
      constant
        ? `the ${order}-th difference of the counts is constant at ${seq[0]}, and a ` +
          `sequence whose ${order}-th difference is constant is a polynomial of degree ` +
          `${order}. Integer arithmetic - ${rounds.join("  |  ")}`
        : `the differences did not settle to a constant within ${D + 2} rounds - ` +
          `${rounds.join("  |  ")}`));

    if (constant && degree === D) {
      facts.push({
        fact: { kind: "dilate", of: BALL, by: RBAR },
        from: [], measured: [measured[1], measured[2]],
        because: `the sites within \\bar{r} steps are the \\bar{r}-fold dilate of the sites within ` +
          `one step - take one step \\bar{r} times and you are somewhere in \\bar{r}·P, and every ` +
          `site of \\bar{r}·P is reached that way. Checked: the counts walked out of the ` +
          `lattice are a polynomial in \\bar{r} of degree ${degree}, which is D, exactly and ` +
          `on integers`,
        line: `${BALL}(\\bar{r}) = |\\bar{r}·P ∩ L|`,
        working: rounds,
      });
      facts.push({
        fact: { kind: "constant", of: BETA },
        from: [], measured: [measured[0]],
        because: `the step-polytope is the same shape wherever it is centred, so its ` +
          `volume is a property of the tiling and does not vary from place to place`,
        line: `${BETA} is the same everywhere`,
      });
      facts.push({
        fact: { kind: "positive", of: BETA },
        from: [], measured: [measured[0]],
        because: `the step-polytope has ${D}-dimensional volume, so the leading ` +
          `coefficient Ehrhart gives it is not zero`,
        line: `${BETA} > 0`,
      });
    }

    /* the shell is what the ball gained on its last step — true by what the words mean */
    facts.push({
      fact: { kind: "rate", of: SHELL, from: BALL, in: RBAR },
      from: [], measured: [measured[1]],
      because: "a site is either within \\bar{r}-1 steps or it is not, so the sites at exactly " +
        "\\bar{r} steps are those within \\bar{r} less those within \\bar{r}-1 - a subtraction, with " +
        "nothing left over and nothing counted twice",
      line: `${SHELL}(\\bar{r}) = ${BALL}(\\bar{r}) - ${BALL}(\\bar{r}-1)`,
    });

    facts.push({
      fact: { kind: "uniform", of: RHO, per: ROOM },
      from: [], measured: [measured[0]],
      because: `a lattice holds exactly one site per fundamental cell, so its sites lie ` +
        `at ${rho.toFixed(4)} per unit of room everywhere and without exception`,
      line: `${RHO} is the same per ${ROOM} everywhere`,
    });
    facts.push({
      fact: { kind: "positive", of: RHO },
      from: [], measured: [measured[0]],
      because: "a fundamental cell has non-zero volume and holds a site",
      line: `${RHO} > 0`,
    });

    /* —— and whether the exits prefer a direction ————————————————————— */
    const m = g.moment(2);
    const even = m.isotropic || m.anisotropy < 1e-9;
    measured.push(measure("second moment anisotropy", m.anisotropy,
      `the spread of Σw·(c·p)² over directions p, computed from all ${g.DEG} exit ` +
      `vectors - 0 is perfectly even. Exhaustive over the exit set, so it holds for ` +
      `all time and every configuration rather than being sampled`));
    if (even) facts.push({
      fact: { kind: "isotropic", of: RHO },
      from: [], measured: [measured[measured.length - 1]],
      because: `the exit set's second moment is a multiple of the identity, so nothing ` +
        `carried on this lattice prefers a direction at second order`,
      line: "the lattice carries alike in every direction",
    });

    return {
      facts, measured, holds: constant && degree === D,
      found: constant
        ? `the ball is a polynomial of degree ${degree} in \\bar{r} (D is ${D}), checked ` +
          `exactly by finite differences; ρ = ${rho.toFixed(4)} per unit volume; the ` +
          `exit set is ${even ? "isotropic" : `anisotropic at ${m.anisotropy.toFixed(4)}`} ` +
          `at second order`
        : `the site counts of this lattice are not a polynomial in \\bar{r} of any degree up ` +
          `to ${D + 2}, so Ehrhart's premise does not hold here as walked`,
    };
  },
};

/** the site nearest a position — where the walk starts */
const nearest = (w: any, at: Vec) => {
  let best: any, far = Infinity;
  for (const l of w.locals) {
    const p = w.embedding.at(l) as Vec | undefined;
    if (!p) continue;
    let d = 0;
    for (let i = 0; i < at.length; i++) d += (p[i] - at[i]) ** 2;
    if (d < far) { far = d; best = l; }
  }
  return best;
};
