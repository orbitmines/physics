/**
 * THE ATOM'S RADIAL SHELLS - solved once, here, so the theorem and the picture cannot
 * disagree about them.
 *
 * THIS IS THE SAME ARRANGEMENT `Orbit.ts` IS IN, and for the same reason. A perihelion
 * advance is integrated by `probes/orbits.ts` and drawn by `visuals/ORBITS.ts`, and if the
 * two carried their own integrators the page and the proof would drift apart with nothing
 * to notice. So the numerics live in `lib/` and both sides import them: what
 * `atom.hydrogen` proves and what `atom.cloud` draws are the same arrays.
 *
 * WHAT IS BEING SOLVED, AND WHERE EVERY PIECE OF IT CAME FROM. Three theorems and nothing
 * else:
 *
 *   `charge.attraction`  the pull between two bodies is what unbiased matter would feel
 *                        times (1 - P_a·P_b), which is TWO for one body biased each way
 *                        and NOUGHT for two biased alike
 *   `charge.falloff`     and it thins as the room there is at a distance, so on three
 *                        dimensions what the far body sits in goes as 1/r
 *   `matter.debroglie`   and what is moving in it cannot be anywhere it likes: a moving
 *                        thing's own two retarded branches beat, the nodes of that beat
 *                        are half a de Broglie wavelength apart, and a region holds a
 *                        whole number of them
 *
 * A thing going one cell a tick, carrying a phase that turns at the rate the third fixes,
 * in a well whose depth the first two fix, is a wave equation on the radial shells - and
 * the shells it can stand on are its solutions. That is all this file integrates.
 *
 * IT IS NOT A RUN OF `G^XOR^c`. This is the scale-invariant reading, in which the three
 * laws are the physics and the lattice is where they are written down. The other reading -
 * the atom as something that emerges from the rewrite rules over many ticks - is out of
 * reach today: `G^XOR^c` has no SPECIES, nothing in it picks out a mass, and a body built
 * by accretion carries a charge that grows with what it swallowed. There is no electron to
 * put in the box yet.
 */

/** one cell a step - the radial grid IS the lattice's own shells */
export const H = 1;
/** how far out the integration runs, in cells */
export const M = 4000;
/**
 * HOW MANY CELLS ACROSS THE GROUND STATE IS - the one number put in, and it sets nothing
 * but the scale of the picture. Every claim made anywhere off this file is a ratio between
 * shells and every ratio is independent of it; a smaller atom is the same atom drawn
 * smaller. An ABSOLUTE size is got in `tests/binding.ts`, out of CODATA rather than out of
 * this.
 */
export const A0 = 24;

/** an atom: one body biased one way and one the other, so 1 - P_a·P_b is two */
export const OPPOSITE = 1 - (1 * -1);
/** and the control: two bodies biased alike, so it is nought and there is no well at all */
export const ALIKE = 1 - (1 * 1);
/** what one unit of coupling is worth, in cells - the scale, and the only number put in */
export const KAPPA = 1 / (OPPOSITE * A0);

/** the states solved for, as (n, l) */
export const STATES: [number, number][] = [[1, 0], [2, 0], [2, 1], [3, 0], [3, 1], [3, 2],
  [4, 0], [4, 1], [4, 2], [4, 3]];

export type State = {
  n: number; l: number;
  /** what it would take to get the thing off this shell, as a negative energy */
  E: number;
  /** r·R(r) on the lattice's shells, zero past where the solution has decayed */
  u: Float64Array;
  /** how many times it crosses zero inside the turning point - n - l - 1, counted */
  nodes: number;
  /** where the density has its mean, in cells */
  mean: number;
  /** and where its outermost peak is */
  peak: number;
  /** the outer turning point, past which a bound state is under the barrier */
  turn: number;
};

/**
 * ONE OUTWARD INTEGRATION OF THE RADIAL EQUATION, at one cell a step.
 *
 * u'' = [l(l+1)/r^{2} - 2Z/r - 2E]·u, which is the thing standing radially when the well
 * is the sign law's 1/r and the phase turns at the rate `matter.debroglie` sets. Numerov,
 * because it is the three-term recurrence a second-order equation with no first derivative
 * has, and it costs what Euler costs while being two orders better.
 */
export const shoot = (E: number, l: number, Z: number) => {
  const f = (r: number) => l * (l + 1) / (r * r) - 2 * Z / r - 2 * E;
  const u = new Float64Array(M + 1);
  /*
   * THE FIRST TWO POINTS COME FROM HOW THE EQUATION BEHAVES AT THE MIDDLE, not from the
   * recurrence, and that is not a nicety. At r = 0 the l(l+1)/r^{2} term is infinite, so a
   * step taken across the origin has to be handed a number that is not one - and whatever
   * is handed in mixes a little of the OTHER solution, the one going as r^{-l}, which
   * blows up rather than vanishing. Left in, it puts a crossing a cell or two out from the
   * middle that is not a node of anything: measured, it gave 2p and 4d one node too many.
   * Seeded from u ~ r^{l+1}(1 - Z·r/(l+1)) and started clear of the origin, they come out
   * whole.
   */
  const seed = (r: number) => Math.pow(r, l + 1) * (1 - Z * r / (l + 1));
  u[1] = seed(H); u[2] = seed(2 * H);
  let nodes = 0;
  for (let i = 2; i < M; i++) {
    const f0 = f((i - 1) * H), f1 = f(i * H), f2 = f((i + 1) * H);
    u[i + 1] = (2 * (1 + (5 / 12) * H * H * f1) * u[i]
      - (1 - (1 / 12) * H * H * f0) * u[i - 1]) / (1 - (1 / 12) * H * H * f2);
    if (u[i + 1] * u[i] < 0) nodes++;
    if (Math.abs(u[i + 1]) > 1e60) for (let k = 0; k <= i + 1; k++) u[k] *= 1e-60;
  }
  /*
   * AND THE OUTWARD SOLUTION IS CUT PAST THE TURNING POINT. Out there the equation has a
   * growing solution and a decaying one, an eigenvalue suppresses the growing one exactly,
   * and arithmetic at sixteen digits does not: what comes back is the decaying state with
   * a growing numerical error eating it. So the profile is cut where |u| stops falling,
   * which is where the state has already decayed and the error has not yet arrived.
   */
  const A = 2 * Math.abs(E), B = 2 * Z, C = l * (l + 1);
  const disc = B * B - 4 * A * C;
  const turn = disc > 0 ? (B + Math.sqrt(disc)) / (2 * A) : B / A;
  let cut = M;
  for (let i = Math.max(2, Math.ceil(turn / H)); i < M; i++)
    if (Math.abs(u[i + 1]) > Math.abs(u[i])) { cut = i; break; }
  for (let i = cut + 1; i <= M; i++) u[i] = 0;
  /*
   * TWO COUNTS, FOR TWO DIFFERENT JOBS, AND CONFLATING THEM COSTS THE ENERGIES.
   *
   * `nodes` is over the WHOLE integration and is what the search bisects on: the crossing
   * that appears the instant the energy passes a level appears out past the turning point,
   * in the tail, and a count that cut the tail off would not see it until the energy had
   * gone well past - which moved the ground state by a quarter when it was tried.
   *
   * `inside` stops at the turning point and is what the state's node count IS. Past that
   * point the solution is under the barrier, where a bound state does not cross zero at
   * all, so every crossing out there is the tail and not a node of anything.
   */
  let inside = 0;
  for (let i = 1; i < Math.min(cut, turn / H); i++)
    if (u[i + 1] * u[i] < 0) inside++;
  return { nodes, inside, u, cut, turn };
};

/**
 * THE STATE WITH EXACTLY `k` NODES ACROSS IT, found by bisecting on the node count.
 *
 * NOTHING IS FITTED AND NO FORMULA IS CONSULTED. How many times the solution crosses zero
 * rises by one at each level, so the energy at which it goes from k to k+1 IS the level
 * with k nodes - and bisection on an integer is exact in the only sense that matters: the
 * bracket is a bracket, whatever the answer turns out to be.
 */
export const level = (l: number, k: number, Z: number) => {
  let lo = -Z * Z / 2 * 1.5, hi = -1e-12;
  for (let it = 0; it < 200; it++) {
    const mid = (lo + hi) / 2;
    if (shoot(mid, l, Z).nodes > k) hi = mid; else lo = mid;
  }
  return (lo + hi) / 2;
};

/** every state of `STATES` in a well of this coupling, or none where there is no well */
export const shells = (coupling = OPPOSITE): State[] => {
  const Z = coupling * KAPPA;
  if (!(Z > 0)) return [];
  return STATES.map(([n, l]) => {
    const E = level(l, n - l - 1, Z);
    const { u, inside, turn } = shoot(E, l, Z);
    let s0 = 0, s1 = 0, best = 0, at = 0;
    for (let i = 1; i <= M; i++) {
      const d = u[i] * u[i];
      s0 += d; s1 += d * i * H;
      if (d > best) { best = d; at = i * H; }
    }
    return { n, l, E, u, nodes: inside, mean: s1 / s0, peak: at, turn };
  });
};

/**
 * THE ASSOCIATED LEGENDRE P_l^m(x), by the standard two recurrences - the angular half.
 *
 * THE INTEGER SPLITS THREE WAYS, one per direction a sphere has, and it is worth writing
 * out because "n nodes" is loose. A state has n - 1 nodes altogether: n - l - 1 of them in
 * the RADIUS, l - |m| of them in the polar direction, and |m| of them on the way ROUND the
 * axis. Every one is the same counting condition - a whole number of half wavelengths
 * fitting - asked along a different direction, and n is what they come to.
 */
export const legendre = (l: number, m: number, x: number): number => {
  let pmm = 1;
  if (m > 0) {
    const s = Math.sqrt(Math.max(0, 1 - x * x));
    let f = 1;
    for (let i = 1; i <= m; i++) { pmm *= -f * s; f += 2; }
  }
  if (l === m) return pmm;
  let pmm1 = x * (2 * m + 1) * pmm;
  if (l === m + 1) return pmm1;
  for (let ll = m + 2; ll <= l; ll++) {
    const p = ((2 * ll - 1) * x * pmm1 - (ll + m - 1) * pmm) / (ll - m);
    pmm = pmm1; pmm1 = p;
  }
  return pmm1;
};

/** the radial profile read BETWEEN its cells, so a picture is not a picture of the grid */
export const between = (u: Float64Array, r: number) => {
  const t = r / H, k = Math.floor(t);
  if (k < 1 || k + 1 > M) return 0;
  return u[k] + (u[k + 1] - u[k]) * (t - k);
};

/**
 * HOW MUCH OF THE CENTRE OF MASS IS AT ONE PLACE, on a plane through the middle.
 *
 * u is r·R(r), so the amplitude at a place is u/r, and the density is that squared times
 * the angular part squared. This is the quantity every picture of an atom is a picture of,
 * and it is the only thing about a bound electron there is to know: not where it is going,
 * which is a matter of which tick you looked on, but where it IS.
 */
export const densityAt = (s: State, m: number, x: number, z: number) => {
  const r = Math.hypot(x, z);
  if (r < H || r > M * H) return 0;
  const rad = between(s.u, r) / r;
  const ang = legendre(s.l, m, z / r);
  return rad * rad * ang * ang;
};

/**
 * THE STATES A PICTURE SHOWS - twelve, as (n, l, |m|), which is the usual table.
 *
 * The four columns of a row are not four different atoms: they are the same n with the
 * whole number of nodes split differently between the three directions.
 */
export const SHOWN: [number, number, number][] = [
  [1, 0, 0], [2, 0, 0], [2, 1, 0], [2, 1, 1],
  [3, 0, 0], [3, 1, 0], [3, 2, 0], [3, 2, 1],
  [4, 0, 0], [4, 1, 0], [4, 2, 1], [4, 3, 2],
];

/**
 * THE RAMP EVERY PICTURE OF THIS USES - black, through the page's own two accents, to
 * white. Here rather than in either drawing, because a theorem page and a film that
 * coloured the same density differently would be two claims about how faint the outer
 * lobes are, and there is only one.
 *
 * IT IS A RAMP AND NOT A RAINBOW. A hue cycle puts edges where the data has none, and the
 * thing being shown is a single quantity going from nothing to a lot, which is exactly
 * what a monotone ramp is for.
 */
export const RAMP: [number, number, number][] = [
  [8, 9, 13], [22, 32, 62], [40, 78, 118], [127, 184, 212], [224, 168, 120],
  [255, 240, 220],
];

export const colour = (t: number): [number, number, number] => {
  const x = Math.min(0.999, Math.max(0, t)) * (RAMP.length - 1);
  const i = Math.floor(x), f = x - i;
  const a = RAMP[i], b = RAMP[i + 1];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
};

/**
 * AND THE CONTRAST, WHICH IS ONE NUMBER AND IS NOT A CHANGE TO THE DATA.
 *
 * The outer lobes of a real state are two or three decades under the inner ones, so a
 * linear ramp shows the innermost blob and nothing else. A fourth root is what makes the
 * whole state visible at once, and it is applied identically wherever this is drawn.
 */
export const CONTRAST = 0.25;
