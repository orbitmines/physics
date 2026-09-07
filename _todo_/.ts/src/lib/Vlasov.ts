/**
 * `G^XOR+XOR` INTEGRATED RATHER THAN SIMULATED - the one equation `vacuum.continuum` derives,
 * solved directly, with no rays and no seeds in it.
 *
 *   d_t n + c·d^·grad_x n + q(B x d^)·grad_d n = nu(1 - rho) - sigma·n·n~
 *   B(x) = integral p·d^·n dd^
 *
 * WHY IT IS FASTER, AND IT IS NOT A TRICK. A lattice tick walks every cell and every exit and
 * resolves rays that nobody asked about, then has to be averaged over seeds because each run
 * carries its own draw. This carries the DENSITY of those rays instead: the same information
 * the rules can see - none of them asks which ray - with the sampling noise integrated out
 * rather than averaged out. One pass, deterministic, no seeds.
 *
 * WHAT IS KEPT EXACTLY. The directions are the lattice's own exits, not a sphere: `g.U` and
 * no more, so a turn is still one RING STEP through `g.turn` and CYCLE still counts a lap.
 * The anisotropy every count in this book depends on is therefore still in here - this is the
 * limit in the DENSITY, not in the geometry, and fcc-12 and cubic-6 give different answers as
 * they should.
 *
 * WHAT IS APPROXIMATED, SAID PLAINLY. Two rays at a point are two numbers here, not two
 * objects, so anything that depends on WHICH ray - a marked carrier, a single trajectory
 * followed - cannot be asked of this. It answers about populations. `tests/steering.ts` had
 * to inject one ray and follow it precisely because a density cannot do that.
 */
import { Geometry } from "./Local.ts";

export type Field = {
  g: Geometry;
  N: number;
  /** n[cell][exit][sign] - the density of rays, by where, which way, and carrying what */
  n: Float64Array;
  /** how many of the four sign combinations are carried: (p,q) in {+,-} x {+,-} */
  S: number;
};

const SIGNS: [number, number][] = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

/**
 * WHICH EXIT A TURN LANDS ON, WORKED OUT ONCE PER LATTICE INSTEAD OF ONCE PER CELL PER TICK.
 *
 * `g.turn(d, axis)` is a search over the exits with vector arithmetic in it, and the density
 * form calls it for EVERY cell, exit and sign on every tick - four million times in a short
 * run, where the lattice only calls it for rays that exist. But the answer depends on nothing
 * but the exit and the DIRECTION of the field, and a direction here quantises to one of the
 * lattice's own exits. So it is a table of DEG x DEG entries, built once.
 *
 * This is the whole difference between the continuum form being slower than the thing it
 * replaces and being faster than it: the physics is identical either way.
 */
const TURNS = new WeakMap<Geometry, Int16Array>();
const turnTable = (g: Geometry): Int16Array => {
  let t = TURNS.get(g);
  if (t) return t;
  t = new Int16Array(g.DEG * g.DEG);
  for (let b = 0; b < g.DEG; b++) {
    const axis = g.U[b];
    for (let d = 0; d < g.DEG; d++) {
      const to = axis ? g.turn(d, axis as any) : d;
      t[b * g.DEG + d] = (to === undefined ? d : to);
    }
  }
  TURNS.set(g, t);
  return t;
};

/** which exit a vector points most nearly along - how a field picks its axis from the table */
const nearest = (g: Geometry, x: number, y: number, z: number) => {
  let best = -1, dot = 0;
  for (let d = 0; d < g.DEG; d++) {
    const u = g.U[d]; if (!u) continue;
    const c = x * (u[0] ?? 0) + y * (u[1] ?? 0) + z * (u[2] ?? 0);
    if (c > dot) { dot = c; best = d; }
  }
  return best;
};

export const field = (g: Geometry, N: number): Field => ({
  g, N, S: SIGNS.length,
  n: new Float64Array(N * N * N * g.DEG * SIGNS.length),
});

const at = (f: Field, c: number, d: number, s: number) =>
  (c * f.g.DEG + d) * f.S + s;

/** where a cell is, and whether it is inside the box */
const cellOf = (N: number, x: number, y: number, z: number) =>
  (x < 0 || y < 0 || z < 0 || x >= N || y >= N || z >= N) ? -1 : (x * N + y) * N + z;

/**
 * THE FIELD AT EVERY CELL - B = sum over exits and signs of polarity times direction, which
 * is `fieldAt` with the sum over rays replaced by a sum over the density carrying them.
 */
export const fieldOf = (f: Field): Float64Array => {
  const { g, N, n } = f;
  const B = new Float64Array(N * N * N * 3);
  for (let c = 0; c < N * N * N; c++) {
    let bx = 0, by = 0, bz = 0;
    for (let d = 0; d < g.DEG; d++) {
      const u = g.U[d]; if (!u) continue;
      for (let s = 0; s < f.S; s++) {
        const w = n[at(f, c, d, s)] * SIGNS[s][0];
        bx += w * (u[0] ?? 0); by += w * (u[1] ?? 0); bz += w * (u[2] ?? 0);
      }
    }
    B[c * 3] = bx; B[c * 3 + 1] = by; B[c * 3 + 2] = bz;
  }
  return B;
};

/**
 * ONE TICK OF THE EQUATION, term by term and in the rules' own order - steering decides the
 * exit, then the density streams along it, then what is made and what is killed are applied.
 * The order is not cosmetic: `steer` runs inside MOVEMENT and ANNIHILATION is a later rule,
 * so a turn changes who a ray ends up facing before the meeting is resolved.
 */
export const step = (f: Field, o: { nu: number; sigma: number; cap: number }) => {
  const { g, N, n } = f;
  const B = fieldOf(f);
  const tab = turnTable(g);
  const out = new Float64Array(n.length);

  for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) for (let z = 0; z < N; z++) {
    const c = (x * N + y) * N + z;
    /* AN EMPTY CELL HAS NOTHING TO STREAM, and most of a box is empty once anything has
     * absorbed at the rim - checked before the exits are walked rather than inside them */
    let any = 0;
    for (let k = c * g.DEG * f.S, e = k + g.DEG * f.S; k < e; k++) any += n[k];
    if (any <= 0) continue;
    const bx = B[c * 3], by = B[c * 3 + 1], bz = B[c * 3 + 2];
    const mag = Math.hypot(bx, by, bz);
    /* THE OPPOSITE AXIS IS THE OPPOSITE EXIT, not a second search - `nearest` is a walk
     * over every exit and running it twice a cell doubled the cost of the field for nothing */
    const ax = mag > 0 ? nearest(g, bx, by, bz) : -1;
    const axNeg = ax >= 0 ? (g.OPP[ax] ?? -1) : -1;

    for (let d = 0; d < g.DEG; d++) {
      const u = g.U[d]; if (!u) continue;
      for (let s = 0; s < f.S; s++) {
        const w = n[at(f, c, d, s)];
        if (w <= 0) continue;
        const q = SIGNS[s][1];

        /* THE TURN: one ring step about B, in the sense the charge gives - read off the
         * table rather than searched for, which is the only thing that differs from the
         * line it replaces */
        let e = d;
        if (ax >= 0 && q) {
          const b = q > 0 ? ax : axNeg;
          if (b >= 0) { const t = tab[b * g.DEG + d]; if (t !== d) e = t; }
        }
        const turned = Math.min(1, mag) * (e !== d ? 1 : 0);
        const paths: [number, number][] = e === d
          ? [[d, 1]] : [[e, turned], [d, 1 - turned]];

        /* THE STREAM: what leaves goes one cell along the exit it is now on */
        for (const [ex, share] of paths) {
          if (share <= 0) continue;
          const v = g.L[ex] ?? g.U[ex];
          const to = cellOf(N, x + (v[0] | 0), y + (v[1] | 0), z + (v[2] | 0));
          if (to < 0) continue;                       // absorbed at the rim
          out[at(f, to, ex, s)] += w * share;
        }
      }
    }
  }

  /* WHAT A MEETING TAKES - quadratic, and against the ONCOMING population. Two rays facing
   * each other with opposite polarity are both destroyed; alike ones are left to turn. */
  /*
   * WHAT A MEETING TAKES, SUMMED ONCE PER FACING PAIR rather than over every combination of
   * signs. What kills a ray is the ONCOMING population of the opposite polarity - which sign
   * of CHARGE it carries makes no difference to whether the meeting is fatal, so the four by
   * four inner loop was doing sixteen passes to compute two sums.
   */
  const half = f.S >> 1;
  for (let c = 0; c < N * N * N; c++) {
    for (let d = 0; d < g.DEG; d++) {
      const o2 = g.OPP[d]; if (o2 === undefined || o2 < d) continue;
      /* the two polarity groups, here and facing */
      let hp = 0, hm = 0, fp = 0, fm = 0;
      for (let s = 0; s < f.S; s++) {
        const w = out[at(f, c, d, s)], v = out[at(f, c, o2, s)];
        if (SIGNS[s][0] > 0) { hp += w; fp += v; } else { hm += w; fm += v; }
      }
      /* + here dies against - facing, and - here against + facing */
      const k1 = o.sigma * Math.min(hp, fm), k2 = o.sigma * Math.min(hm, fp);
      if (k1 <= 0 && k2 <= 0) continue;
      for (let s = 0; s < f.S; s++) {
        const plus = SIGNS[s][0] > 0;
        const hereTot = plus ? hp : hm, faceTot = plus ? fp : fm;
        const kh = plus ? k1 : k2, kf = plus ? k2 : k1;
        if (hereTot > 0 && kh > 0)
          out[at(f, c, d, s)] -= kh * out[at(f, c, d, s)] / hereTot;
        if (faceTot > 0 && kf > 0)
          out[at(f, c, o2, s)] -= kf * out[at(f, c, o2, s)] / faceTot;
      }
    }
  }

  /* AND WHAT A NEUTRAL POINT MAKES - gated on the room left, which is where the vacuum's own
   * fixed point comes from rather than from a rate anybody chose */
  for (let c = 0; c < N * N * N; c++) {
    let rho = 0;
    for (let d = 0; d < g.DEG; d++) for (let s = 0; s < f.S; s++) rho += out[at(f, c, d, s)];
    const room = Math.max(0, 1 - rho / o.cap);
    if (room <= 0) continue;
    const made = o.nu * room / (g.DEG * f.S);
    for (let d = 0; d < g.DEG; d++) for (let s = 0; s < f.S; s++) out[at(f, c, d, s)] += made;
  }

  f.n.set(out);
};

/**
 * A SOURCE, IN THE DENSITY FORM - the same `Source` the lattice has, applied to n.
 *
 * `EMISSION` clears a source's cell and lights the exits `firing` names, with the sign
 * `sign(s,tick)` gives and the half `half()` puts it in. In a density that is: set the cells
 * inside the body to the emitted amount on the exits that fire, and to nothing on the rest.
 */
export const emit = (f: Field, o: {
  at: [number, number, number]; radius: number;
  /** which exits fire, and the sign each carries: +1, -1, or 0 for one that does not */
  exits: (d: number) => number;
  amount: number;
}) => {
  const { g, N } = f;
  const R2 = o.radius * o.radius;
  for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) for (let z = 0; z < N; z++) {
    const dx = x - o.at[0], dy = y - o.at[1], dz = z - o.at[2];
    if (dx*dx + dy*dy + dz*dz > R2) continue;
    const c = (x * N + y) * N + z;
    for (let d = 0; d < g.DEG; d++) {
      const sgn = o.exits(d);
      for (let s = 0; s < f.S; s++) f.n[at(f, c, d, s)] = 0;
      if (!sgn) continue;
      /* the emitted ray carries that polarity and the source's charge - one sign slot */
      const slot = sgn > 0 ? 0 : 2;
      f.n[at(f, c, d, slot)] = o.amount;
    }
  }
};

/** the density in a plane through the middle, for a picture - z across, x up */
export const section = (f: Field, R: number, slab = 1) => {
  const { g, N, n } = f, C = (N - 1) / 2, PX = 2 * R + 1;
  const net = new Float64Array(PX * PX);
  for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) for (let z = 0; z < N; z++) {
    if (Math.abs(y - C) > slab) continue;
    const u = x - C, v = z - C;
    if (Math.abs(u) > R || Math.abs(v) > R) continue;
    const c = (x * N + y) * N + z;
    let q = 0;
    for (let d = 0; d < g.DEG; d++) for (let s = 0; s < f.S; s++)
      q += n[at(f, c, d, s)] * SIGNS[s][1];
    net[(v + R) * PX + (u + R)] += q;
  }
  return net;
};

/** the net and gross charge at each radius from the middle - what a cloud picture is of */
export const profile = (f: Field, RMAX: number) => {
  const { g, N, n } = f, C = (N - 1) / 2;
  const net = new Float64Array(RMAX + 1), gross = new Float64Array(RMAX + 1);
  const cells = new Float64Array(RMAX + 1);
  for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) for (let z = 0; z < N; z++) {
    const r = Math.round(Math.hypot(x - C, y - C, z - C));
    if (r < 1 || r > RMAX) continue;
    const c = (x * N + y) * N + z;
    cells[r]++;
    for (let d = 0; d < g.DEG; d++) for (let s = 0; s < f.S; s++) {
      const w = n[at(f, c, d, s)];
      net[r] += w * SIGNS[s][1]; gross[r] += w;
    }
  }
  return { net: Array.from(net, (v, i) => cells[i] ? v / cells[i] : 0),
           gross: Array.from(gross, (v, i) => cells[i] ? v / cells[i] : 0) };
};
