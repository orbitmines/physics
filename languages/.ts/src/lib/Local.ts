import { Backend } from "./Backend.ts"

export type Vocabulary = {
  Local: unknown
  Ray: unknown
  Boundary: unknown
}

export interface Local<V extends Vocabulary = Base> {
  get backend(): Backend
  get DEG(): number
  get world(): any
  get rays(): V["Ray"][]
  create(): V["Ray"]
  fold(l: V["Local"]): void
  unfold(): void
}
export interface Ray<V extends Vocabulary = Base> {
  get backend(): Backend
  get l(): V["Local"]
  get boundaries(): V["Boundary"][]
  delete(): void
}
export interface Boundary<V extends Vocabulary = Base> {
  get backend(): Backend
  get source(): V["Ray"]
  get target(): V["Boundary"]
  link(to: V["Boundary"]): void
  insert(): void
  collapse(): void
}

export type Vocab<L = {}, R = {}, B = {}> = {
  Local: Local<Vocab<L, R, B>> & L
  Ray: Ray<Vocab<L, R, B>> & R
  Boundary: Boundary<Vocab<L, R, B>> & B
}
export type Base = Vocab

export type Global<V extends Vocabulary = Base> = Local<V> & {
  get name(): string
}

export const global = (g: Geometry, backend: Backend): Global => {
  const [l] = [...g.seed(backend, 1)];
  return Object.defineProperty(l, "name", { value: g.name }) as Global;
}

/**
 * WHAT HAPPENS TO A RAY THAT STEPS OFF THE EDGE.
 *
 *   wrap     the box is periodic
 *   absorb   it is gone, it comes back as nothing, and it is not counted anywhere
 *   expand   there is no edge: the world MAKES room there, which is the graph
 *            backend's business and what makes the vacuum grow
 */
export type Boundaries = "wrap" | "absorb" | "expand"

export type Vec = number[]

export const sub = (a: Vec, b: Vec) => a.map((x, i) => x - (b[i] ?? 0))
export const add = (a: Vec, b: Vec) => a.map((x, i) => x + (b[i] ?? 0))
export const scale = (a: Vec, k: number) => a.map(x => x * k)
export const dot = (a: Vec, b: Vec) => a.reduce((s, x, i) => s + x * (b[i] ?? 0), 0)
export const norm = (v: Vec) => Math.sqrt(dot(v, v))
export const unit = (v: Vec) => { const n = norm(v); return n ? scale(v, 1 / n) : v.slice() }
export const cross = (a: Vec, b: Vec): Vec => [
  a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

export type Moment = {
  rank: number
  diag: number
  mixed: number
  diagUnit: number
  mixedUnit: number
  ratio: number
  anisotropy: number
  isotropic: boolean
}

export type Geometry = {
  get name(): string
  get exits(): Vec[]
  get D(): number
  get DEG(): number
  /** the exits, as offsets — V in the article */
  get V(): Vec[]
  /** the exits as unit directions — d̂ in the article */
  get U(): Vec[]
  /** the whole turn as a lookup, cached per axis */
  turnTable(axis: Vec): number[]
  get w(): number[]
  get OPP(): number[]
  /** one representative per antipodal pair, which is what a head-on rule iterates */
  get AXES(): number[]
  get steps(): number[]
  /** whether two exits are approaching — d̂·ê < 0 */
  approaching(a: number, e: number): boolean
  /** the exits with no component along an axis — the article's equator */
  equator(axis: Vec): number[]
  /** the largest equator over the admissible axes — DEG(D−1) on a cubic lattice */
  get SHEET(): number
  /** the exits lying IN the plane of rotation. Equal to SHEET in 3D; DEG in 2D. */
  get CYCLE(): number
  get SPIN(): number
  get sheetAxis(): Vec
  get ringAxis(): Vec
  /** that equator in circular order — a turn is a step along it */
  get RING(): number[]
  moment(rank: number): Moment
  /** how much faster light goes along the longest exit than the shortest */
  get cAnisotropy(): number
  /** whether the field a source makes is round or veined, at rank four */
  get veined(): boolean
  get alternatives(): { withFaceDiagonals: number }
  /** the exit whose direction is nearest v, or −1 if v is null */
  nearest(v: Vec): number
  /** a turn: which exit d becomes, rotated one step about `axis` */
  turn(d: number, axis: Vec): number
  /** whole-cell index offsets, one per exit — what the backend steps by */
  get L(): Vec[]
  /** the real-space vectors index coordinates are counted in */
  get basis(): Vec[]
  /** an index coordinate put back into real space: Σ cᵢ·basisᵢ */
  embed(c: Vec): Vec
  /**
   * Why this geometry cannot be a world, or undefined if it can. Set when the exits
   * do not form an integer lattice that steps back the way it stepped out — such a
   * geometry is still fine to take MOMENTS of, which is what icosahedral 12 is for.
   */
  get unrunnable(): string | undefined
  seed(backend: Backend, N: number, boundary?: Boundaries): Backend
}

/** a Fibonacci-ish spread of probe directions, for measuring anisotropy honestly */
const probes = (D: number, K = 512): Vec[] => {
  const out: Vec[] = [];
  if (D === 2) {
    for (let i = 0; i < K; i++) { const t = 2 * Math.PI * i / K; out.push([Math.cos(t), Math.sin(t)]); }
    return out;
  }
  const ph = (1 + Math.sqrt(5)) / 2;
  for (let i = 0; i < K; i++) {
    const z = 1 - 2 * (i + 0.5) / K, r = Math.sqrt(Math.max(0, 1 - z * z)), t = 2 * Math.PI * i / ph;
    out.push([r * Math.cos(t), r * Math.sin(t), z]);
  }
  return out;
}

const leading = (e: Vec) => e[e.findIndex(x => x !== 0)]
export const eq = (a: Vec, b: Vec) => a.length === b.length && a.every((x, i) => x === b[i])

export const geometry = (
  name: string, exits: Vec[], weights?: number[],
  spec: { L?: Vec[]; basis?: Vec[] } = {},
): Geometry => {
  const D = exits[0].length, DEG = exits.length;
  const w = weights ?? exits.map(() => 1);
  const U = exits.map(unit);
  const OPP = exits.map(v => exits.findIndex(o => eq(o, scale(v, -1))));
  const AXES = OPP.map((o, d) => d).filter(d => d < OPP[d]);
  const steps = exits.map(norm);

  const equator = (axis: Vec) => {
    const a = unit(axis);
    return U.map((u, d) => d).filter(d => Math.abs(dot(U[d], a)) < 1e-9);
  };

  /* WHICH AXES A SHEET OR A RING MAY LIVE ON — a modelling choice, so the road not
   * taken is reported rather than hidden. The default is the article's own table:
   * coordinate axes, the geometry's own exits, and the body diagonals. */
  const axisCandidates: Vec[] = [];
  for (let i = 0; i < D; i++) { const e = new Array(D).fill(0); e[i] = 1; axisCandidates.push(e); }
  for (const v of exits) axisCandidates.push(unit(v));
  if (D === 3) for (const s of [[1, 1, 1], [1, 1, -1], [1, -1, 1], [-1, 1, 1]])
    axisCandidates.push(unit(s));
  const wider: Vec[] = D === 3
    ? [[1, 1, 0], [1, -1, 0], [1, 0, 1], [1, 0, -1], [0, 1, 1], [0, 1, -1]].map(unit) : [];

  const bestAxis = (cands: Vec[]) => {
    let axis = cands[0], n = 0;
    for (const a of cands) { const k = equator(a).length; if (k > n) { n = k; axis = a; } }
    return { axis, n };
  };
  const chosen = bestAxis(axisCandidates);
  const SHEET = chosen.n;
  const alternatives = { withFaceDiagonals: bestAxis([...axisCandidates, ...wider]).n };

  const planeBasis = (axis: Vec): [Vec, Vec] => {
    const a = unit(axis);
    let seed: Vec = [1, 0, 0].slice(0, D);
    if (Math.abs(dot(seed, a)) > 0.9) seed = [0, 1, 0].slice(0, D);
    const u = unit(sub(seed, scale(a, dot(seed, a))));
    const v = D === 3 ? unit(cross(a, u)) : [-u[1], u[0]];
    return [u, v];
  };

  const nearest = (v: Vec) => {
    if (norm(v) < 1e-12) return -1;
    const t = unit(v);
    let best = -1, bestDot = -Infinity;
    for (let d = 0; d < DEG; d++) { const c = dot(U[d], t); if (c > bestDot) { bestDot = c; best = d; } }
    return best;
  };

  /* THE RING IS THE EQUATOR ORDERED BY ANGLE, not a sampling of the plane — sorting
   * the equator cannot lose a member, so |RING| = |equator| by construction. */
  const ringOf = (axis: Vec) => {
    const set = D === 2 ? Array.from({ length: DEG }, (_, i) => i) : equator(axis);
    if (set.length < 3) return set.slice();
    const [u, v] = planeBasis(axis);
    return set.slice().sort((a, b) =>
      Math.atan2(dot(U[a], v), dot(U[a], u)) - Math.atan2(dot(U[b], v), dot(U[b], u)));
  };

  const sheetAxis: Vec = chosen.axis;
  const ringAxis: Vec = D === 2 ? [0, 0, 1] : chosen.axis;
  const RING = ringOf(ringAxis);
  const CYCLE = RING.length;
  const SPIN = CYCLE ? 2 * Math.PI / CYCLE : 0;

  const momentCache = new Map<number, Moment>();
  const moment = (rank: number): Moment => {
    const hit = momentCache.get(rank);
    if (hit) return hit;
    /* ON THE RAW EXIT VECTORS: Σ w c⊗c⊗… is the momentum flux of a gas whose carriers
     * move at velocity c, which is what the isotropy theorem is about. */
    let diag = 0, mixed = 0, diagUnit = 0, mixedUnit = 0;
    for (let d = 0; d < DEG; d++) {
      diag += w[d] * Math.pow(exits[d][0], rank);
      diagUnit += w[d] * Math.pow(U[d][0], rank);
      if (rank >= 4) {
        mixed += w[d] * Math.pow(exits[d][0], rank / 2) * Math.pow(exits[d][1] ?? 0, rank / 2);
        mixedUnit += w[d] * Math.pow(U[d][0], rank / 2) * Math.pow(U[d][1] ?? 0, rank / 2);
      } else if (rank === 2) {
        mixed += w[d] * (exits[d][1] ?? 0) * (exits[d][1] ?? 0);
        mixedUnit += w[d] * (U[d][1] ?? 0) * (U[d][1] ?? 0);
      }
    }
    let lo = Infinity, hi = -Infinity;
    for (const p of probes(D)) {
      let s = 0;
      for (let d = 0; d < DEG; d++) s += w[d] * Math.pow(dot(exits[d], p), rank);
      lo = Math.min(lo, s); hi = Math.max(hi, s);
    }
    const mean = (lo + hi) / 2;
    const anisotropy = mean ? (hi - lo) / mean : 0;
    const ratio = rank === 2 ? (mixed ? diag / mixed : NaN) : (mixed ? diag / (3 * mixed) : NaN);
    const m: Moment = { rank, diag, mixed, diagUnit, mixedUnit, ratio, anisotropy,
      isotropic: anisotropy < 1e-9 };
    momentCache.set(rank, m);
    return m;
  };

  const turn = (d: number, axis: Vec) => {
    const ring = eq(unit(axis), unit(ringAxis)) ? RING : ringOf(axis);
    const i = ring.indexOf(d);
    if (i >= 0) return ring[(i + 1) % ring.length];
    const a = unit(axis);
    const par = scale(a, dot(U[d], a));
    const perp = sub(U[d], par);
    if (norm(perp) < 1e-12) return d;
    const [u, v] = planeBasis(axis);
    const th = Math.atan2(dot(perp, v), dot(perp, u)) + (ring.length ? 2 * Math.PI / ring.length : SPIN);
    const rot = add(par, add(scale(u, Math.cos(th) * norm(perp)), scale(v, Math.sin(th) * norm(perp))));
    const got = nearest(rot);
    return got < 0 ? d : got;
  };

  /*
   * THE INDEX LATTICE, AND THE ONE INVARIANT THE RULES CANNOT DO WITHOUT.
   *
   * Everything here is a head-on meeting: a ray at (A, d) meets the ray at (B, OPP[d])
   * where B is A's neighbour along d. That is only true if stepping along `d` and then
   * back along `OPP[d]` returns where it started. It is checked once, here.
   */
  const L: Vec[] = spec.L ?? exits.map(v => v.map(x => Math.round(x)));
  const basis: Vec[] = spec.basis ?? Array.from({ length: D }, (_, i) =>
    Array.from({ length: D }, (_, j) => (i === j ? 1 : 0)));
  const embed = (c: Vec): Vec => {
    const out = new Array(D).fill(0);
    for (let i = 0; i < D; i++)
      for (let j = 0; j < D; j++) out[j] += (c[i] ?? 0) * (basis[i][j] ?? 0);
    return out;
  };
  /*
   * RECORDED RATHER THAN THROWN, because a geometry that cannot be RUN can still be
   * perfectly good to MEASURE — icosahedral 12 carries φ and has no integer lattice
   * at all, and it is a row in the article's table.
   */
  let unrunnable: string | undefined;
  for (let d = 0; d < DEG && !unrunnable; d++) {
    if (L[d].some(x => !Number.isInteger(x)))
      unrunnable = `exit ${d} steps by [${L[d]}], which is not a whole number of cells`;
    else if (L[d].some((x, i) => x + (L[OPP[d]][i] ?? 0) !== 0))
      unrunnable = `exit ${d} steps by [${L[d]}] and its opposite by [${L[OPP[d]]}], so a ` +
        `ray cannot come back the way it went — and every rule here is a head-on meeting`;
    else if (embed(L[d]).some((x, i) => Math.abs(x - (exits[d][i] ?? 0)) > 1e-9))
      unrunnable = `exit ${d} goes to [${exits[d]}] in space but [${embed(L[d])}] in the index`;
  }

  const tableCache = new Map<string, number[]>();
  const turnTable = (axis: Vec) => {
    const k = unit(axis).map(x => x.toFixed(6)).join(",");
    let hit = tableCache.get(k);
    if (!hit) {
      hit = Array.from({ length: DEG }, (_, d) => turn(d, axis));
      tableCache.set(k, hit);
    }
    return hit;
  };

  return ({
  get V() { return exits },
  turnTable,
  get L() { return L },
  get basis() { return basis },
  embed,
  get unrunnable() { return unrunnable },
  get U() { return U },
  get w() { return w },
  get OPP() { return OPP },
  get AXES() { return AXES },
  get steps() { return steps },
  approaching: (a, e) => dot(U[a], U[e]) < 0,
  equator,
  get SHEET() { return SHEET },
  get CYCLE() { return CYCLE },
  get SPIN() { return SPIN },
  get sheetAxis() { return sheetAxis },
  get ringAxis() { return ringAxis },
  get RING() { return RING },
  moment,
  get cAnisotropy() { return Math.max(...steps) / Math.min(...steps) },
  get veined() { return !moment(4).isotropic },
  get alternatives() { return alternatives },
  nearest,
  turn,
  get name() { return name },
  get exits() { return exits },
  get D() { return exits[0].length },
  get DEG() { return exits.length },

  /**
   * AND A WORLD EXPANDS UNLESS IT IS TOLD OTHERWISE.
   *
   * A WRAP IS A TORUS AND A TORUS HAS NO BOUNDARY, so there is nowhere for (G/2) to put a
   * new point: every site already has all DEG of its neighbours through the wrap, `make`
   * finds the far side of the world in whichever direction it looks, and joins to it
   * rather than creating anything. The lattice can then only grow by SUBDIVIDING itself,
   * and it does — measured, a box ten cells wide was still exactly ten cells wide after
   * ninety ticks while its point count went from 1,331 to 20,364, of which 20,035 were
   * beads sitting between two older points. Its hop diameter reached 786 inside a box you
   * could cross in ten.
   *
   * WITH A BOUNDARY IT GROWS THE WAY THE RULES SAY IT SHOULD. The same run on `expand`
   * goes from ten cells wide to thirty-four, outward in every direction, and half of what
   * it adds lands ON the lattice rather than between it.
   *
   * SO THE DEFAULT IS THE ONE THE MODEL IS ABOUT. A wrap is a deliberate choice for a
   * claim that needs no edges — a current that has to close on itself, a field measured
   * without a far side — and those say so. Nothing should get a torus by not mentioning it.
   */
  seed(backend, N, boundary: Boundaries = "expand") {
    const w = backend.rewrite, D = this.D, size = N ** D;
    const locals = Array.from({ length: size }, () => w.local());
    w.flush();

    const at = (i: number) => Array.from({ length: D }, (_, k) => Math.floor(i / N ** k) % N);
    const index = (c: Vec) => c.some(x => x < 0 || x >= N)
      ? (boundary === "wrap" ? c.reduce((i, x, k) => i + ((x % N + N) % N) * N ** k, 0) : -1)
      : c.reduce((i, x, k) => i + x * N ** k, 0);
    /*
     * STEP THROUGH THE INDEX BY `L`, NOT BY `exits`. An exit says where it goes in
     * SPACE, and on a sheared lattice that is not a whole number of cells —
     * triangular 6's exits carry ±√3/2, so `at(i) + exits[d]` is a fractional
     * coordinate, `index` of it is fractional, and `rays[j]` is undefined. `L` is the
     * same step written in the index, checked integral and antipodal above, and is
     * what the array backend already walks.
     */
    const rays = locals.map(l => exits.map(() => w.ray(l)));
    w.flush();

    /* AND WHERE EACH OF THEM IS. A store that can say this lets `make` run at all — its
     * first line refuses without `at` and `place` — and lets a picture of the world be
     * drawn in space rather than scattered by a hash. */
    const store: any = backend;
    if (store.place)
      for (let i = 0; i < size; i++)
        store.place(locals[i], Array.from({ length: D }, (_, k) => Math.floor(i / N ** k) % N));

    /*
     * READ THE TWO ENDS WITHOUT BUILDING THE LIST, and step the coordinate in place.
     *
     * `r.boundaries` is the vocabulary and hands back an array; asked four times per exit
     * per point that is three million throwaway arrays and six million flyweights to lay
     * down a box, and `at(i).map(...)` is another one per exit on top. Neither is what the
     * loop needs — it wants one end and one index — so it asks for those. The wiring is
     * the same wiring; what is gone is the garbage.
     */
    const end = (r: any, n: number) =>
      (backend as any).nth ? (backend as any).nth("Boundary", r, n) : r.boundaries[n];
    const here = new Array<number>(D), there = new Array<number>(D);
    for (let i = 0; i < size; i++) {
      for (let k = 0; k < D; k++) here[k] = Math.floor(i / N ** k) % N;
      for (let d = 0; d < exits.length; d++) {
        const o = OPP[d];
        if (o < 0) throw new Error(
          `${name}: exit [${exits[d]}] has nothing facing it, so this lattice has no OPP ` +
          `and a ray on it could not be said to turn around.`);
        end(rays[i][d], 1).link(end(rays[i][o], 1));
        if (leading(L[d]) < 0) continue;
        for (let k = 0; k < D; k++) there[k] = here[k] + (L[d][k] ?? 0);
        const j = index(there);
        if (j >= 0) end(rays[i][d], 0).link(end(rays[j][o], 0));
      }
    }
    w.flush();
    return backend;
  },
});
}

/*
 * THE TWO ENDS OF A RAY, TOLD APART BY WHERE THEY LEAD.
 *
 * One end leaves — its partner is at another point — and one faces back into the
 * point it belongs to, which is what pairs an exit with its opposite. That is the
 * whole of OPP here, and it is structural rather than tabulated.
 *
 * READ WITHOUT BUILDING THE LIST. `r.boundaries` is the vocabulary and hands back an
 * array, which is right for a rule reading it once and wrong for a helper called
 * three times per ray per tick. Where the backend can hand over the n-th child
 * directly it is asked to; where it cannot, the array is still correct.
 */
const end = (r: any, n: number) =>
  r.backend?.nth ? r.backend.nth("Boundary", r, n) : r.boundaries[n];

const faces = (b: any, r: any, same: boolean) => {
  const l = b?.target?.source?.l;
  return l !== undefined && (same ? l === r.l : l !== r.l);
};

export const outward = (r: any) => {
  const a = end(r, 0);
  if (faces(a, r, false)) return a;
  const b = end(r, 1);
  return faces(b, r, false) ? b : undefined;
}

export const inward = (r: any) => {
  const a = end(r, 1);
  if (faces(a, r, true)) return a;
  const b = end(r, 0);
  return faces(b, r, true) ? b : undefined;
}

/** the ray on this local's opposite exit — OPP, read off the inward link */
export const opposite = (r: any) => inward(r)?.target?.source

/**
 * WHERE A RAY GOES WHEN IT STEPS — `opposite(outward(r)?.target?.source)`, which is the
 * neighbour's ray on the same exit, and the whole of what streaming is.
 *
 * Spelled out through the vocabulary that is ten flyweights per moving ray per tick, so
 * where the store can walk its own indices it is asked to; where it cannot, the spelled
 * out version is still correct and the answer is the same one.
 */
export const across = (r: any, bounced: boolean) => {
  if (r.backend?.across) return r.backend.across(r, bounced);
  const from = bounced ? opposite(r) : r;
  if (!from) return undefined;
  const facing = outward(from)?.target?.source;
  return facing && opposite(facing);
}

/**
 * IS ANYTHING ON THIS POINT — asked of every point every tick by (G/2), so it is asked
 * without building the list of rays first. And the same for lighting all of them: the
 * list is the vocabulary and it is the right shape for a rule that READS it, and the
 * wrong shape for a question with an early exit asked fourteen thousand times a tick.
 */
/**
 * AND MATTER IS NEVER NEUTRAL, WHICH IS AN INVARIANT AND NOT A SECOND TEST.
 *
 * "A body's cells are not neutral - they belong to a source - so the split does not fire on
 * them", and that is the whole of gravity in this model: not a pull between bodies but an
 * expansion that did not happen where something was in the way. It used to be asked as a
 * SEPARATE condition beside this one, `!l.source && !busy(l)`, and a rule that forgot the
 * first half would have matter expanding instead of suppressing the expansion - measured, a
 * body with a duty cycle went neutral on its quiet ticks and split, because EMISSION douses
 * every ray it absorbs and a source that is not acting carries nothing.
 *
 * A point is unavailable to split when something is passing THROUGH it or when something IS
 * there, and both of those are the same word. So the word says both, and the gravity
 * mechanism is not something a rule can be written without.
 */
export const busy = (l: any): boolean => !!l.source || (l.backend?.some
  ? l.backend.some("Ray", l, lit)
  : l.rays.some(lit));
const lit = (r: any) => r.active;

export const light = (l: any): void => {
  if (l.backend?.walk) l.backend.walk("Ray", l, on);
  else for (const r of l.rays) r.active = true;
};
const on = (r: any) => { r.active = true; };

/**
 * THE END THAT LEAVES THIS POINT, whether or not it leads anywhere.
 *
 * `outward` answers "which end leads to another point" and is undefined at an edge that
 * has nothing on the far side — which is the whole state an EXPANDING boundary is in.
 * This is the same end named structurally instead: the one the inward pairing did not
 * claim. It is what a ray about to step off the edge has to be given.
 */
export const leaving = (r: any) => {
  const a = end(r, 0), b = end(r, 1);
  return inward(r) === b ? a : b;
}

const cube = (D: number): Vec[] => {
  const out: Vec[] = [];
  const walk = (v: Vec) => v.length === D
    ? (v.some(x => x !== 0) && out.push([...v]))
    : [-1, 0, 1].forEach(x => walk([...v, x]));
  walk([]);
  return out;
}
const spread = (v: Vec) => v.filter(x => x !== 0).length;
const len2 = (v: Vec) => v.reduce((s, x) => s + x * x, 0);

export const GEOMETRIES: Record<string, Geometry> = {
  "line-2": geometry("line-2", [[1], [-1]]),
  "square-4": geometry("square-4", cube(2).filter(v => spread(v) === 1)),
  "square-8": geometry("square-8", cube(2)),
  /*
   * THE TRIANGULAR PLANE, IN AXIAL COORDINATES — the plane's fcc-12, and the geometry
   * that made the whole L/basis distinction necessary. Six exits, all exactly one cell
   * long, and EXACT at ranks two, three and four, which no square arrangement is.
   *
   * Written in real-space coordinates its exits carry ±√3/2 and rounding them to step
   * through an array is not antipodal. Written AXIALLY the same lattice is plainly
   * integral: the array stores whole numbers, the skew lives in the basis, and the
   * exits still say where they go in space.
   */
  "triangular-6": geometry("triangular-6",
    [[1, 0], [-1, 0], [0.5, Math.sqrt(3) / 2], [-0.5, Math.sqrt(3) / 2],
     [0.5, -Math.sqrt(3) / 2], [-0.5, -Math.sqrt(3) / 2]], undefined,
    { L: [[1, 0], [-1, 0], [0, 1], [-1, 1], [1, -1], [0, -1]],
      basis: [[1, 0], [0.5, Math.sqrt(3) / 2]] }),
  "cubic-6": geometry("cubic-6", cube(3).filter(v => spread(v) === 1)),
  "bcc-8": geometry("bcc-8", cube(3).filter(v => spread(v) === 3)),
  "fcc-12": geometry("fcc-12", cube(3).filter(v => spread(v) === 2)),
  "cubic-18": geometry("cubic-18", cube(3).filter(v => spread(v) <= 2)),
  "cubic-26": geometry("cubic-26", cube(3)),
  /*
   * THE WEIGHTS THAT MAKE THE RANK-FOUR MOMENT EXACT on a cubic lattice. They are
   * FORCED rather than fitted — the lattice-Boltzmann weights are the unique ones —
   * and adopting them is a prediction: a source does not emit equally down all
   * twenty-six exits.
   */
  "cubic-26-weighted": geometry("cubic-26-weighted", cube(3),
    cube(3).map(v => len2(v) === 1 ? 2 / 27 : len2(v) === 2 ? 1 / 54 : 1 / 216)),
  "cubic-18-weighted": geometry("cubic-18-weighted", cube(3).filter(v => len2(v) <= 2),
    cube(3).filter(v => len2(v) <= 2).map(v => len2(v) === 1 ? 1 / 18 : 1 / 36)),
  "icosahedral-12": geometry("icosahedral-12", (() => {
    const p = (1 + Math.sqrt(5)) / 2, out: Vec[] = [];
    for (const s1 of [1, -1]) for (const s2 of [1, -1]) {
      out.push([0, s1 * 1, s2 * p], [s1 * 1, s2 * p, 0], [s2 * p, 0, s1 * 1]);
    }
    return out;
  })()),
}

export type Ref = "Local" | "Ray" | "Boundary"
export type Ref2 = Local | Ray | Boundary

export const kind = (ref: any): Ref =>
  "target" in ref ? "Boundary" : "boundaries" in ref ? "Ray" : "Local"

export const base = {
  Local: (backend: Backend) => ({
    backend,
    get world() { return backend.world },
    get rays() {
      return backend.children(this as unknown as Local).filter(c => kind(c) === "Ray") as Ray[];
    },
    get DEG() {
      return this.rays.reduce((n, r) => n + r.boundaries.filter(b => {
        const there = b.target?.source?.l;
        return there !== undefined && backend.parent(there) === undefined;
      }).length, 0);
    },
    create(this: Local) { return backend.rewrite.ray(this) },
    fold(this: Local, l: Local) { backend.rewrite.fold(this, l) },
    unfold(this: Local) { backend.rewrite.unfold(this) },
  }),
  Ray: (backend: Backend) => ({
    backend,
    get l() { return backend.parent(this as unknown as Ray) as Local },
    get boundaries() { return backend.children(this as unknown as Ray) as Boundary[] },
    delete(this: Ray) { backend.rewrite.delete(this) },
  }),
  Boundary: (backend: Backend) => ({
    backend,
    get source() { return backend.parent(this as unknown as Boundary) as Ray },
    get target() { return backend.target(this as unknown as Boundary) as Boundary },
    link(this: Boundary, to: Boundary) { backend.rewrite.link(this, to) },
    insert(this: Boundary) { backend.rewrite.insert(this) },
    collapse(this: Boundary) { backend.rewrite.collapse(this) },
  }),
}
