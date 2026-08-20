/**
 * THE SAME MODEL READ IN THE LIMIT, with its constants TAKEN FROM the geometry object
 * rather than written down beside it. Change the lattice and they change together,
 * and `affectedBy` says which LAWS moved and through which constant.
 */
import { add, cross, dot, GEOMETRIES, Geometry, norm, scale, sub, unit, Vec } from "./Local.ts";

export const M_PLANCK = 2.176434e-8;

export type Constants = {
  geometry: string
  D: number
  DEG: number
  SHEET: number
  CYCLE: number
  SPIN: number
  cAnisotropy: number
  secondMomentUnit: number
  secondMomentRaw: number
  secondMomentIsotropic: boolean
  fourthMomentAnisotropy: number
  falloff: number
  vacuumFixedPointUnsigned: (p: number) => number
  LIGHT: number
  BITE: number
  CORE: number
  gravitational: (share?: number) => number
  massUnit: (share?: number) => number
}

export const constants = (g: Geometry = GEOMETRIES["fcc-12"]): Constants => {
  const m2 = g.moment(2), m4 = g.moment(4);

  /* c = one step a tick, and a meeting is worth one point. Both definitional. */
  const LIGHT = 1, BITE = 1 * LIGHT;
  /* and the core off the exits, which is where the old file wrote 0.5 */
  const CORE = Math.min(...g.steps) / 2;
  const G = (share = 0.5) =>
    BITE * share * g.SHEET * g.SHEET * LIGHT / (4 * Math.PI * Math.PI * CORE * g.DEG);

  return {
    geometry: g.name, D: g.D, DEG: g.DEG, SHEET: g.SHEET, CYCLE: g.CYCLE, SPIN: g.SPIN,
    cAnisotropy: g.cAnisotropy,
    /* READ OFF THE EXITS rather than asserted as DEG/D. */
    secondMomentUnit: m2.diagUnit,
    secondMomentRaw: m2.diag,
    secondMomentIsotropic: m2.isotropic,
    fourthMomentAnisotropy: m4.anisotropy,
    falloff: g.D - 1,
    vacuumFixedPointUnsigned: (p: number) => (1 - p) / (2 - p),
    LIGHT, BITE, CORE,
    gravitational: G,
    massUnit: (share = 0.5) => G(share) * M_PLANCK,
  };
};

export type Law = {
  name: string
  /** which constants it consumes, so a change of geometry lists what it moved */
  uses: (keyof Constants)[]
  kind: "derived" | "calibrated"
  /** THE STATEMENT, WRITTEN FROM THE CONSTANTS RATHER THAN BESIDE THEM. */
  form: (k: Constants) => string
  owes?: string
}

export const LAWS: Law[] = [
  {
    name: "inverse-square",
    form: k => `|F| ∝ 1/R^${k.falloff} — ${k.SHEET} rays over a shell in ${k.D - 1} dimensions`,
    uses: ["D", "SHEET", "falloff", "secondMomentUnit"],
    kind: "derived",
  },
  {
    name: "deficit potential",
    form: k => `deficit ∝ A(1/r − 1/R_b), a potential whose gradient is the force; ` +
      `l.DEG = ${k.DEG} is what the shortfall is counted against`,
    uses: ["D", "DEG"],
    kind: "calibrated",
    owes: "the amplitude A, which carries a ballistic fraction nothing derives",
  },
  {
    name: "Coulomb",
    form: k => `ρ(r) = Σ σ_d ∝ q/r^${k.falloff} — the net polarity a charge leaves in the ` +
      `vacuum IS the field, read directly rather than differentiated out of a potential`,
    uses: ["D", "falloff"],
    kind: "derived",
  },
  {
    name: "Biot–Savart",
    form: k => `B = Σ σ_d (d̂ × u) ∝ q u × r̂ / r^${k.falloff}`,
    uses: ["D", "falloff", "secondMomentUnit"],
    kind: "derived",
  },
  {
    name: "Ampère",
    form: k => `B ∝ I/r^${Math.max(k.falloff - 1, 1)} for a line current — a line's shell is ` +
      `a cylinder, so it grows one power slower than a point's`,
    uses: ["D", "falloff"],
    kind: "derived",
  },
  {
    name: "screening",
    form: () => "F(d) ∝ e^(−d/λ) with λ the mean free path — a force is second order in " +
      "survival, since it needs rays from BOTH bodies to live long enough to meet",
    uses: ["DEG"],
    kind: "calibrated",
    owes: "λ, which is a property of the vacuum's occupancy and not of the geometry",
  },
  {
    name: "phase quantum",
    form: k => k.CYCLE
      ? `one step of a ring of ${k.CYCLE}: SPIN = ${(180 / Math.PI * k.SPIN).toFixed(1)}°`
      : "NONE — this geometry has no equator, so there is no ring to put a phase on",
    uses: ["CYCLE", "SPIN", "SHEET"],
    kind: "derived",
  },
  {
    name: "light-speed isotropy",
    form: k => k.cAnisotropy > 1.001
      ? `c̄ varies by ${k.cAnisotropy.toFixed(2)}× with direction — one exit a tick, and the ` +
        `exits are not the same length`
      : "c̄ is the same every way — every exit is the same length here",
    uses: ["cAnisotropy"],
    kind: "derived",
  },
  {
    name: "expansion",
    form: k => `space grows where a split's two halves do not annihilate. In a theory with ` +
      `no polarity every pair is neutral and the rate is ZERO; with polarity about half ` +
      `the ${k.DEG} pairs at a point turn instead, and the point they were inserted as survives`,
    uses: ["DEG"],
    kind: "calibrated",
    owes: "the surviving fraction, which depends on how often alike meets alike",
  },
];

/** which laws move when the geometry changes, and which constants moved under them */
export const affectedBy = (from: Geometry, to: Geometry) => {
  const a = constants(from), b = constants(to);
  /* a constant read for comparison, whether it is a number or a function of one —
   * `gravitational` and `massUnit` are functions OF THE GEOMETRY too, and a plain
   * typeof filter dropped them, so changing the lattice moved G and said nothing. */
  const at = (k: Constants, key: keyof Constants) => {
    const val = k[key];
    return typeof val === "function" ? String((val as (x?: number) => number)()) : String(val);
  };
  const moved = (Object.keys(a) as (keyof Constants)[]).filter(k => at(a, k) !== at(b, k));
  return LAWS
    .map(law => ({ law, via: law.uses.filter(u => moved.includes(u)) }))
    .filter(x => x.via.length)
    .map(x => ({
      law: x.law.name,
      was: x.law.form(a), now: x.law.form(b),
      via: x.via,
      changes: x.via.map(v => ({ constant: v, from: at(a, v), to: at(b, v) })),
    }));
};

// ─── the retarded reading ───────────────────────────────────────────────────

// ─── §3  the retarded reading ───────────────────────────────────────────────

export type Emitter = {
  at: Vec;
  /** where it is at time t, so that a retarded position means something */
  path?: (t: number) => Vec;
  sigma: number;
  /** the emitter's velocity — the label, and the whole of what makes B */
  u: Vec;
};

/**
 * The retarded time at a field point: the t' at which what arrives now left.
 *
 * BISECTION WITH A BRACKET THAT IS CHECKED. An earlier version of this in the arc
 * had its inequality inverted, walked to its own bracket endpoint, and returned
 * t − 10⁷ for every field point in silence; it was caught only by asking the solver
 * for its own residual, which should be nought and was −7·10⁶. So the residual is
 * returned here and every caller gets it whether it wants it or not.
 */
export const retarded = (P: Vec, t: number, e: Emitter, c = 1) => {
  const at = (tp: number) => e.path ? e.path(tp) : e.at;
  const f = (tp: number) => (t - tp) * c - norm(sub(P, at(tp)));
  let lo = t - 4 * (norm(sub(P, at(t))) + 1) / c - 1, hi = t;
  let flo = f(lo), fhi = f(hi);
  if (flo * fhi > 0) return { t: NaN, residual: NaN, bracketed: false };
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2, fm = f(mid);
    if (flo * fm <= 0) { hi = mid; fhi = fm; } else { lo = mid; flo = fm; }
  }
  const tp = (lo + hi) / 2;
  return { t: tp, residual: f(tp), bracketed: true };
};

/**
 * The fields of a set of emitters at a field point, read at the retarded time.
 *
 * THE ARRIVAL-RATE FACTOR IS NOT A RELATIVISTIC CORRECTION BOLTED ON. A source
 * emitting at a fixed rate in its own time has its rays ARRIVE at a different rate,
 * because it moves between emissions — 1/(1 − n̂·u) — and that is simply what
 * counting arrivals means when the emitter is moving. `lorenz` found Ampère fails
 * without it.
 */
export const fieldsAt = (P: Vec, t: number, ems: Emitter[], k = constants()) => {
  const E: Vec = [0, 0, 0], B: Vec = [0, 0, 0];
  let worstResidual = 0, unbracketed = 0;
  for (const e of ems) {
    const r = retarded(P, t, e);
    if (!r.bracketed) { unbracketed++; continue; }
    worstResidual = Math.max(worstResidual, Math.abs(r.residual));
    const src = e.path ? e.path(r.t) : e.at;
    const d = sub(P, src), R = norm(d);
    if (R < 1e-9) continue;
    const n = scale(d, 1 / R);
    const rate = 1 / Math.max(1e-6, 1 - dot(n, e.u));
    const w = e.sigma * rate / Math.pow(R, k.falloff);
    for (let i = 0; i < 3; i++) E[i] += w * n[i];
    const b = cross(n, e.u);
    for (let i = 0; i < 3; i++) B[i] += w * b[i];
  }
  return { E, B, worstResidual, unbracketed };
};
