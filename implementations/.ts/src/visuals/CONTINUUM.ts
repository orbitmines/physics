/**
 * THE SHELLS, INTEGRATED RATHER THAN SAMPLED - the same states, out of the one equation.
 *
 * `atom.shell.*` runs the lattice and averages over seeds, which costs a pass over every cell
 * and every exit per tick per seed and still leaves the picture speckled - the source moves
 * the vacuum by a few per cent and a single cell fluctuates by more than that. This solves
 * `vacuum.continuum`'s equation for the DENSITY instead:
 *
 *   d_t n + c·d^·grad_x n + q(B x d^)·grad_d n = nu(1-rho) - sigma·n·n~,  B = integral p d^ n
 *
 * NO SEEDS AND NO NOISE. The sampling is integrated out rather than averaged out, so one pass
 * gives a clean picture and the box can be big enough for the structure to have room - which
 * is what the lattice version could not afford. Nothing about the geometry is relaxed: the
 * directions are still the lattice's own exits and a turn is still one ring step through the
 * same table, so fcc-12 and cubic-6 still differ as they should.
 *
 * WHAT IS ASKED FOR, AND IT IS THE SAME REQUEST. Radius is retarded time - a ray leaves at one
 * cell a tick - so a state is asked for by handing the source R_nl(t) as its emission history
 * and Y_lm as which exits fire. The angular half is the axis and the sheet: `half()` puts one
 * sign out of each side and nothing along the equator, which is a nodal plane.
 */
import { visual, Painter, Surface } from "./CANVAS.ts";
import { GEOMETRIES } from "../lib/DISCRETE.ts";
import { emit, grid, Grid, section, step } from "../lib/Vlasov2.ts";
import { CONTRAST } from "../lib/Atom.ts";

const BACK = "#08090d", DIM = "#8a8d99", FAINT = "#5f6472";

const lag = (k: number, a: number, x: number): number => {
  if (k === 0) return 1;
  if (k === 1) return 1 + a - x;
  let Lm = 1, L = 1 + a - x;
  for (let i = 1; i < k; i++) { const Ln = ((2*i + 1 + a - x)*L - (i + a)*Lm)/(i + 1);
    Lm = L; L = Ln; }
  return L;
};
/**
 * THE ANGULAR PART AS AN AMPLITUDE AND NOT ONLY A SIGN - which is the difference between two
 * lobes and a ball with a stripe painted round it.
 *
 * `half()` answers which side of the axis an exit is on and nothing else, so a source built
 * on it emits at full strength everywhere above the equator and full strength below, with a
 * hard zero on the line between. That is a filled sphere in two colours. A p_z is not that:
 * its density goes as cos^{2}(theta), so it FADES away from the axis and the equator is where
 * it has faded to nothing rather than where a rule switched it off. What has to be asked for
 * is therefore |Y_lm| as an amount, with its sign, and the lobes are then what the emission
 * already is rather than something the vacuum has to make.
 */
const legendre = (l: number, m: number, x: number): number => {
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
    const pr = ((2 * ll - 1) * x * pmm1 - (ll + m - 1) * pmm) / (ll - m);
    pmm = pmm1; pmm1 = pr;
  }
  return pmm1;
};

const Rnl = (n: number, l: number, a0: number, r: number) => {
  const rho = 2*r/(n*a0);
  return Math.pow(rho, l) * Math.exp(-rho/2) * lag(n-l-1, 2*l+1, rho);
};

/*
 * BIGGER, BECAUSE IT IS NOW AFFORDABLE. `Vlasov2` is the same equation with the bookkeeping
 * taken out of the inner loop - one pass instead of four, neighbours precomputed, two
 * polarity planes instead of four sign slots - so a state costs seconds rather than minutes.
 * The box is 61 cells across and a panel 55 by 55, where the lattice version could afford
 * nine by nine and still came out speckled.
 */
/*
 * CUT TO THE CLOUD AND NOT TO THE BOX. The source reaches about three cells - measured, the
 * charge it adds runs 1.08, 0.43, 0.034 at r = 1, 2, 3 and is nothing beyond - and that size
 * is set by the mean free path, so no bigger box makes a bigger cloud. Drawn to eight cells
 * the structure sat in the middle third of every panel with five cells of nothing round it.
 * Five is the cloud and one to spare.
 */
/*
 * A THINNED VACUUM, AND SAYING SO IS THE POINT.
 *
 * At the occupancy this model derives - a half, and 0.19 of exits carrying once it settles -
 * a source's cloud dies by three cells. Three cells and twelve directions cannot carry an
 * orbital: on fcc-12 the angle to the axis takes the values 0, 45 and 90 degrees and nothing
 * between, so any angular shape comes out as a ball in two colours however it is drawn. That
 * is not a rendering limit, it is the mean free path, and it is the same debt `force.range`
 * records as "a Coulomb force with a range of two Planck lengths is not a Coulomb force".
 *
 * So this draws the vacuum the model WOULD need rather than the one it has: `nu` ten times
 * smaller, an occupancy of six per cent instead of twenty, and a cloud that reaches twelve
 * cells instead of three. Everything else is unchanged and every rate but this one is
 * measured off the lattice. What the picture shows is what the equation gives WHEN THE RANGE
 * IS LONG ENOUGH TO HAVE A SHAPE, which is a statement about the shape and not about the
 * range, and the range is the outstanding debt either way.
 */
const GEOM = "fcc-12", N = 61, C = 30, R = 22, PX = 2 * R + 1;
const TICKS = 220;

type State = { n: number; l: number; m: number; a0: number };
const STATES: State[] = ([[1,0,0],[2,0,0],[2,1,0],[2,1,1],[3,0,0],[3,1,0],
  [3,2,0],[3,2,1],[4,0,0],[4,1,0],[4,2,1],[4,3,2]] as [number,number,number][])
  .map(([n, l, m]) => ({ n, l, m, a0: 26 / (n * n) }));

/** run one state to its steady picture - deterministic, so once is enough */
const solve = (st: State): Float64Array => {
  const g: any = GEOMETRIES[GEOM];
  const f: Grid = grid(g, N);
  /* the vacuum's own occupancy, split evenly between the two polarities */
  for (const a of f.n) a.fill(0.0485);
  const axis = [0, 0, 1];
  /*
   * ACCUMULATED OVER TICKS AND NOT READ OFF THE LAST ONE.
   *
   * A bound thing has no "where it is now" that survives being asked on a different tick -
   * `visuals/ATOM.ts` says it in as many words: what survives is where it is FOUND, over many
   * of them, and that is a density. A single final section is one instant of a vacuum that is
   * remade every tick, so it shows whatever the last step happened to leave. What the picture
   * is of is the integral.
   */
  const acc = new Float64Array((2 * R + 1) * (2 * R + 1));
  let samples = 0;
  for (let t = 0; t < TICKS; t++) {
    /* what the source is emitting on this tick: R_nl as its history, and the sheet's own
     * halves as which way - the angular part and the radial part asked for together */
    const amp = Rnl(st.n, st.l, st.a0, t % Math.ceil(4 * st.n * st.n * st.a0));
    const sgn = amp >= 0 ? 1 : -1;
    emit(f, {
      at: [C, C, C], radius: 1,
      exits: (d: number) => {
        const u = g.U[d]; if (!u) return 0;
        const mag = Math.hypot(u[0], u[1], u[2] ?? 0) || 1;
        const cos = (u[0]*axis[0] + u[1]*axis[1] + (u[2] ?? 0)*axis[2]) / mag;
        const y = legendre(st.l, st.m, cos);
        if (Math.abs(y) < 1e-9) return 0;
        return y > 0 ? sgn : -sgn;
      },
      /* AND HOW MUCH, which is where the shape is: the radial history times |Y_lm| at that
       * exit, so an exit near the equator of a p state emits almost nothing rather than
       * emitting fully and being cut off by a rule */
      amountAt: (d: number) => {
        const u = g.U[d]; if (!u) return 0;
        const mag = Math.hypot(u[0], u[1], u[2] ?? 0) || 1;
        const cos = (u[0]*axis[0] + u[1]*axis[1] + (u[2] ?? 0)*axis[2]) / mag;
        return Math.min(1, Math.abs(amp)) * Math.abs(legendre(st.l, st.m, cos)) * 0.5;
      },
      amount: Math.min(1, Math.abs(amp)) * 0.5,
    });
    step(f, { nu: 0.05, sigma: 3.48, cap: 1, tau: 3.48, shine: 0.05, fold: 0.02, stir: 0.12 });
    /* the first third is the vacuum settling round the source and is not part of the answer */
    if (t > TICKS / 3) {
      const sec = section(f, R);
      for (let i = 0; i < acc.length; i++) acc[i] += sec[i];
      samples++;
    }
  }
  for (let i = 0; i < acc.length; i++) acc[i] /= Math.max(1, samples);
  return acc;
};

const draw = (sur: Surface, grid: Float64Array, x0: number, y0: number, size: number) => {
  const { ctx } = sur;
  /*
   * SCALED TO THE BRIGHTEST, NOT TO A PERCENTILE OF EVERYTHING - and the difference was the
   * whole of what looked like a beam crossing the box.
   *
   * Half of fcc-12's cubic grid is unreachable: its steps are the <110> vectors, which change
   * x+y+z by nought or two, so from a source only the EVEN sublattice is ever occupied and
   * the rest is exactly zero. A percentile over all cells therefore lands almost at nought,
   * and the contrast curve - a fourth root, right for lifting an orbital's faint outer lobes
   * - turned values of 1e-4 into full brightness. The measured profile dies by three cells
   * (1.08, 0.43, 0.034) and the picture showed arms at twenty-seven.
   */
  let hi = 0;
  for (let i = 0; i < grid.length; i++) { const a = Math.abs(grid[i]); if (a > hi) hi = a; }
  if (!hi) hi = 1;
  const cell = size / PX;
  for (let j = 0; j < PX; j++) for (let i = 0; i < PX; i++) {
    const v = Math.max(-1, Math.min(1, grid[j * PX + i] / hi));
    const t = Math.sign(v) * Math.pow(Math.abs(v), CONTRAST);
    const c = t >= 0 ? [20 + 235*t, 20 + 130*t, 20 + 60*t]
                     : [20 + 60*-t, 20 + 140*-t, 20 + 235*-t];
    ctx.fillStyle = `rgb(${c[0]|0},${c[1]|0},${c[2]|0})`;
    ctx.fillRect(x0 + i*cell, y0 + j*cell, Math.ceil(cell), Math.ceil(cell));
  }
  ctx.strokeStyle = "rgba(255,255,255,0.12)"; ctx.lineWidth = 1;
  ctx.strokeRect(x0 + 0.5, y0 + 0.5, size - 1, size - 1);
};

const SIZE = 380, GAPX = 34, GAPY = 66, TOP = 122, LEFT = 64, COLS = 4;
const ROWS = Math.ceil(STATES.length / COLS);
const WIDTH = LEFT * 2 + COLS * SIZE + (COLS - 1) * GAPX;
const HEIGHT = TOP + ROWS * (SIZE + GAPY) + 60;

const shells = (): (() => Painter) => (): Painter => {
  let grids: (Float64Array | null)[] = STATES.map((): Float64Array | null => null);
  let done = 0;
  return {
    start: (): void => { grids = STATES.map((): null => null); done = 0; },
    warm: (budgetMs: number): number => {
      const t0 = performance.now();
      while (done < STATES.length && performance.now() - t0 < budgetMs) {
        grids[done] = solve(STATES[done]); done++;
      }
      return done / STATES.length;
    },
    stop: () => { grids = []; },
    frame: (sur: Surface) => {
      const { ctx, width, height } = sur;
      ctx.fillStyle = BACK; ctx.fillRect(0, 0, width, height);
      ctx.textAlign = "left"; ctx.fillStyle = "#e8eaf0";
      ctx.font = "600 21px ui-sans-serif, system-ui, sans-serif";
      ctx.fillText("the shells, out of the one equation", LEFT, 42);
      ctx.fillStyle = FAINT; ctx.font = "12.5px ui-sans-serif, system-ui, sans-serif";
      ctx.fillText(`vacuum.continuum on ${GEOM}, at a tenth of the derived occupancy so the cloud has room · ∂ₜn + c·d̂·∇ₓn + q(B×d̂)·∇_d n = ` +
        `ν(1−ρ) − σn·ñ, B = ∫p·d̂·n · ${PX}×${PX} cells, no seeds and no averaging`, LEFT, 64);

      STATES.forEach((st, i) => {
        const x = LEFT + (i % COLS) * (SIZE + GAPX);
        const y = TOP + Math.floor(i / COLS) * (SIZE + GAPY);
        const gr = grids[i];
        if (gr) draw(sur, gr, x, y, SIZE);
        else { ctx.fillStyle = "#101218"; ctx.fillRect(x, y, SIZE, SIZE); }
        ctx.textAlign = "center"; ctx.fillStyle = gr ? "#e8eaf0" : DIM;
        ctx.font = "600 14px ui-sans-serif, system-ui, sans-serif";
        ctx.fillText(`n=${st.n}  l=${st.l}  m=${st.m}`, x + SIZE/2, y + SIZE + 22);
      });
      ctx.textAlign = "center"; ctx.fillStyle = FAINT;
      ctx.font = "12px ui-sans-serif, system-ui, sans-serif";
      ctx.fillText(done < STATES.length
        ? `solving — ${done} of ${STATES.length}`
        : `${TICKS} ticks per state, the last two thirds accumulated`, width/2, height - 26);
    },
  };
};

export default [
  visual({
    id: "atom.continuum",
    width: WIDTH, height: HEIGHT, frames: 1,
    what: "the twelve states solved out of vacuum.continuum's single equation instead of " +
      "sampled off the lattice - deterministic, so one integration replaces fifteen seeds, " +
      "and big enough for the structure to have room",
    paint: shells(),
  }),
];
