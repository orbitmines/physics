import { cross, dot, norm, scale, sub, Vec } from "./Local.ts";
import { Embedding } from "./Source.ts";
import { Finding, headerOf, judge, stat } from "./Report.ts";

export const basisAt = (d: Vec): { r: Vec; theta: Vec; phi: Vec } => {
  const R = norm(d) || 1;
  const r = scale(d, 1 / R);
  const rho = Math.hypot(d[0], d[1]);
  const phi = rho > 1e-9 ? [-d[1] / rho, d[0] / rho, 0] : [1, 0, 0];
  const theta = cross(phi, r);
  return { r, theta, phi };
};

/**
 * THE RADII A PROFILE IS READ AT, IN THE BOX IT IS ACTUALLY RUNNING IN.
 *
 * A claim names the radii it wants, and those are the article's — chosen for the 41³
 * box the published numbers were measured in. Written as `[4, 6, 8, 11].filter(r => r <
 * C - 2)` that list is silently EMPTIED on a smaller box, and the claim then measures a
 * profile over no radii: `exponent` of nothing is NaN, and a run that reports nothing
 * looks exactly like a run whose numbers did not resolve. Measured, nine claims could
 * not be smoke-tested at all because `--quick` shrinks the box below their innermost
 * radius, and three of them crashed reading `[0]` of an empty list.
 *
 * WHAT A PROFILE CLAIM NEEDS IS SEVERAL RADII SPANNING A RANGE, not those integers. So
 * where the box holds them they are used unchanged — a full run measures exactly what
 * the article measured — and where it does not, the same SHAPE is measured smaller: the
 * spacing is kept and the span is scaled onto what there is. A reduced box then reports
 * a profile that can be compared with itself across tiers, rather than nothing at all.
 *
 * AND WHERE EVEN THAT WILL NOT FIT, IT SAYS SO. Two radii is the least a falloff can be
 * fitted through; below that there is no profile to take, and a claim asking for one is
 * refused where it asks rather than handed an empty list to average.
 */
export const shells = (want: number[], furthest: number, nearest = 3): number[] => {
  const fits = want.filter(r => r >= nearest && r <= furthest);
  if (fits.length >= 2) return fits;
  if (furthest - nearest < 1) throw new Error(
    `a profile wants radii between ${nearest} and ${want[want.length - 1]}, and this box ` +
    `has room for none: the furthest a shell can sit from the centre is ${furthest.toFixed(1)} ` +
    `cells. Widen the box or measure something that is not a profile — an empty radius ` +
    `list is not a smaller measurement, it is no measurement wearing one's shape.`);
  const lo = Math.min(...want), hi = Math.max(...want);
  const at = (r: number) => nearest + (furthest - nearest) * (hi > lo ? (r - lo) / (hi - lo) : 0);
  const out: number[] = [];
  for (const r of want) {
    const k = Math.round(at(r));
    if (!out.includes(k)) out.push(k);
  }
  if (out.length >= 2) return out;
  return [Math.round(nearest), Math.round(furthest)];
};

export type ShellReading = { r: number; radial: number; theta: number; phi: number; n: number };

const shell = (w: any, centre: Vec, radius: number, tol: number) => {
  const e: Embedding = w.embedding;
  const out: { local: any; d: Vec; R: number }[] = [];
  for (const l of w.backend) {
    const at = e.at(l);
    if (!at) continue;
    const d = sub(at, centre), R = norm(d);
    if (Math.abs(R - radius) > tol || R < 1e-9) continue;
    out.push({ local: l, d, R });
  }
  return out;
};

/**
 * A SHELL READING — and the point is handed over BY ITS INDEX, as the article's backend
 * hands them out.
 *
 * Every field in this book is read as a difference against the same box at the same seed
 * with nothing in it, so the closure this takes almost always reaches into a SECOND
 * world. The two runs share their SITES, not their objects: handing over a point that
 * belongs to `w` and letting the caller pass it to the control asks that world about a
 * point it has never held — its embedding returns nothing, the separation comes back
 * empty, and every component is NaN. Measured, 1016 of 1331 points came back NaN that
 * way, and the claims downstream reported "did not resolve" rather than "was never
 * asked". An index means the same site in both, which is what makes the difference a
 * difference.
 */
export const onShell = (
  w: any, centre: Vec, radius: number, field: (local: any) => Vec, tol = 0.5,
): ShellReading => {
  let pr = 0, pt = 0, pf = 0, n = 0;
  const index = new Map<unknown, number>();
  const all = w.locals ?? [...w.backend];
  for (let i = 0; i < all.length; i++) index.set(all[i], i);
  for (const { local, d } of shell(w, centre, radius, tol)) {
    const b = basisAt(d), v = field(index.get(local) ?? local);
    pr += dot(v, b.r); pt += dot(v, b.theta); pf += dot(v, b.phi); n++;
  }
  n = Math.max(n, 1);
  return { r: radius, radial: pr / n, theta: pt / n, phi: pf / n, n };
};

export const flux = (
  w: any, centre: Vec, radius: number, field: (local: any) => Vec, tol = 0.5,
) => {
  let f = 0, m = 0, n = 0;
  for (const { local, d, R } of shell(w, centre, radius, tol)) {
    const p = dot(field(local), scale(d, 1 / R));
    f += p; m += Math.abs(p); n++;
  }
  return { net: f / Math.max(n, 1), scale: m / Math.max(n, 1), n };
};

const exponentRaw = (rs: number[], vs: number[]) => {
  const p = rs.map((r, i) => [Math.log(r), Math.log(Math.abs(vs[i]))] as const)
    .filter(q => isFinite(q[1]));
  if (p.length < 2) return NaN;
  const mx = p.reduce((a, q) => a + q[0], 0) / p.length;
  const my = p.reduce((a, q) => a + q[1], 0) / p.length;
  let num = 0, den = 0;
  for (const q of p) { num += (q[0] - mx) * (q[1] - my); den += (q[0] - mx) ** 2; }
  return num / den;
};

export const exponent = (rs: number[], vs: number[], errs?: number[]) => {
  if (errs) {
    const keep = rs.map((_, i) => Math.abs(vs[i]) > 2 * (errs[i] ?? 0));
    rs = rs.filter((_, i) => keep[i]); vs = vs.filter((_, i) => keep[i]);
    if (rs.length < 2) return NaN;
  }
  return exponentRaw(rs, vs);
};

export const screenedFit = (rs: number[], vs: number[], n: number) => {
  const pts = rs.map((r, i) => [r, vs[i]] as const)
    .filter(([r, v]) => isFinite(v) && v !== 0 && r > 0);
  if (pts.length < 2) return { lambda: NaN, A: NaN, error: NaN, n };
  const xs = pts.map(([r]) => r);
  const ys = pts.map(([r, v]) => Math.log(Math.abs(v) * Math.pow(r, n)));
  const mx = xs.reduce((a, b) => a + b, 0) / xs.length;
  const my = ys.reduce((a, b) => a + b, 0) / ys.length;
  let num = 0, den = 0;
  for (let i = 0; i < xs.length; i++) { num += (xs[i] - mx) * (ys[i] - my); den += (xs[i] - mx) ** 2; }
  const slope = den ? num / den : NaN;
  const A = Math.exp(my - slope * mx);
  const lambda = slope < 0 ? -1 / slope : Infinity;
  const error = ys.reduce((s, y, i) =>
    s + Math.abs(y - (my + slope * (xs[i] - mx))), 0) / ys.length;
  return { lambda, A, error, n };
};

/** the net polarity a local holds — signed, so the vacuum's own traffic cancels */
export const charge = (local: any) =>
  local.rays.reduce((s: number, r: any) => s + (r.active ? (r.polarity ?? 0) : 0), 0);

/**
 * A CLAIM ADDRESSES A POINT BY ITS INDEX, as the article's backend hands them out — and
 * every reading here takes either that or the point itself.
 *
 * IT MATTERS MOST WHERE TWO WORLDS ARE COMPARED. Every field in this book is read as a
 * difference against the same box at the same seed with nothing in it, and the two runs
 * share their SITES, not their objects: `fieldE(v, l)` for an `l` belonging to `w` asks
 * the control world about a point it has never heard of. It does not fail — the
 * embedding returns nothing, the separation comes back empty, and the reading is NaN in
 * every component. Measured, 1016 of 1331 points came back NaN that way, and the claims
 * downstream reported "did not resolve" rather than "was never asked".
 */
const at = (w: any, x: any) =>
  typeof x === "number" ? (w.locals ?? [...w.backend])[x] : x;

/** the field at a local, read off its rays — signed, never a magnitude */
export const fieldE = (w: any, k: any): Vec => {
  const e: Embedding = w.embedding;
  const out = new Array(w.geometry.D).fill(0);
  const local = at(w, k);
  if (!local) return out;
  for (const r of local.rays) {
    if (!r.active) continue;
    const q = r.polarity ?? 0;
    if (!q) continue;
    const there = r.boundaries.find((b: any) => b.target?.source?.l && b.target.source.l !== local)
      ?.target?.source?.l;
    if (!there) continue;
    const d = e.toward(local, there), n = norm(d) || 1;
    for (let i = 0; i < out.length; i++) out[i] += q * d[i] / n;
  }
  return out;
};

export const pullOn = (w: any, source = 0): Vec => {
  const s = w.sources[source];
  if (!s) throw new Error(`no source ${source}`);
  const n = Math.max(w.ticks, 1);
  return s.absorbed.map((v: number) => v / n);
};

export const forceOn = (w: any, source = 0) => {
  const s = w.sources[source];
  if (!s) throw new Error(`no source ${source}`);
  const n = Math.max(w.ticks, 1);
  const absorbed = s.absorbed.map((v: number) => v / n);
  const recoil = s.emitted.map((v: number) => -v / n);
  return { absorbed, recoil, net: absorbed.map((v: number, i: number) => v + recoil[i]) };
};

export const gravitationalPull = (o: {
  theory: any; geometry: any; backend: (seed: number) => any;
  N: number; T: number; seeds: number[]; separations?: number[];
}) => {
  const { theory, geometry, N, T, seeds } = o;
  const seps = o.separations ?? [6, 8, 10, 14];
  const C = (N - 1) / 2;
  let ran: any;

  /* ABSORBING EDGES, not periodic ones. A shadow measured in a wrapped box is
   * measured against a partner that is also `N − sep` cells away the other way. */
  const force = (sep: number, lone: boolean, seed: number) => {
    const w: any = theory.seed({ geometry, N, seed, backend: o.backend(seed) });
    w.add({ at: [C - sep / 2, C, C], radius: 2, absorbs: true, duty: 0 });
    if (!lone) w.add({ at: [C + sep / 2, C, C], radius: 2, absorbs: true, duty: 0 });
    for (let t = 0; t < T; t++) w.tick();
    ran = w;
    return pullOn(w, 0)[0];
  };

  const rows = seps.map(sep => {
    const lone = stat(seeds.map(s => force(sep, true, s)));
    const pair = stat(seeds.map(s => force(sep, false, s)));
    const value = pair.mean - lone.mean;
    const err = Math.hypot(pair.err, lone.err);
    return { sep, lone, pair, value, err, sigma: Math.abs(value) / (err || Infinity) };
  });

  const resolved = rows.filter(r => r.sigma > 2);
  const exp = resolved.length >= 2
    ? exponent(resolved.map(r => r.sep), resolved.map(r => r.value)) : NaN;

  const findings: Finding[] = [
    judge({
      name: "attraction at the closest separation",
      value: rows[0].value, err: rows[0].err,
      expect: {
        of: "positive — the partner shadows the vacuum and the far side wins",
        want: 0, atLeast: Math.abs(rows[0].err),
        because: "a body is pushed toward whatever is eating the rays that would have hit it",
      },
      note: `${rows[0].sigma.toFixed(1)}σ against a lone body at the same position`,
    }),
    judge({
      name: "force exponent",
      value: exp,
      expect: {
        of: "1/R^(D−1) — a shadow cast over a shell",
        want: -(3 - 1), tolerance: 0.25,
        because: "the shadowed solid angle a partner subtends falls as its area over the shell",
      },
      note: `fitted over the ${resolved.length} separations resolved above 2σ` +
        (resolved.length < 3 ? " — too few to call, widen the box or run longer" : ""),
    }),
  ];
  return { rows, exponent: exp, findings, seeds, header: headerOf(ran, "—", seeds) };
};
