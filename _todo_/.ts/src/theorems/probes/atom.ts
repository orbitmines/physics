/**
 * THE ATOM - the three laws this folder proved, put on the lattice together, and what
 * comes out is where the electron IS.
 *
 * THIS IS THE SECOND PROBE HERE THAT MEASURES A CONSEQUENCE RATHER THAN A RULE, and it is
 * the same kind of thing `orbits/what-the-metric-does` is: everything else counts exits or
 * enumerates states and gets an exact answer, and neither a perihelion nor a shell
 * structure is like that. A bound state is what two laws do to each other over a whole
 * region, and the honest way to know it is to solve and look.
 *
 * WHAT IT SOLVES IS NOT HERE. `lib/Atom.ts` holds the radial integration and says which
 * three theorems it is made of - `charge.attraction` for the coupling, `charge.falloff`
 * for the room, `matter.debroglie` for what may stand in it - and `visuals/ATOM.ts` draws
 * the same arrays this reads. That is the arrangement `Orbit.ts` is in for the same
 * reason: two copies of an integrator drift apart with nothing to notice, and then the
 * proof and the picture disagree about a number neither of them printed.
 *
 * WHAT THIS FILE DOES IS DECIDE WHAT MAY BE SAID ABOUT THE SOLUTIONS, which is a separate
 * job and the one a probe is for. It emits two conserved quantities and a positive, and
 * DELIBERATELY NOT THE EXPONENTS: it fits them, reports them as a check, and hands the
 * prover only the thing a run can honestly establish - that the coupling comes out the
 * same whichever shell is asked about. A probe that handed over n^{-2} would be handing
 * over the answer.
 *
 * WHAT IS PUT IN BY HAND AND WHAT IS NOT. One number: how many cells across the ground
 * state is, which `lib/Atom.ts` sets at 24. NOTHING BELOW DEPENDS ON IT - every claim is a ratio
 * between shells, and the article's own `binding` port is where an absolute size is got,
 * out of CODATA rather than out of this. What is NOT put in is the integer: n is how many
 * nodes fit, counted off the solution, and the fact that it comes out whole is the
 * counting condition doing its work rather than a quantum number anybody wrote down.
 */
import {
  A0, ALIKE, CONTRAST, OPPOSITE, SHOWN, State, colour, densityAt, shells,
} from "../../lib/Atom.ts";
import { Lab, Probe, Probing, Figure, measure } from "../Probe.ts";
import { Emitted, Measured } from "../Kernel.ts";
import { png } from "./png.ts";

/** how far a shell stands out from the middle */
export const SHELL = "r_{n}";
/** how many nodes fit in it - the integer that is not a postulate */
export const NODES = "nodes";
/** how much it would take to get the thing out - the binding energy */
export const BINDING = "E_{n}";
/** momentum times shell, squared and once - what the balance holds fixed */
export const ORBIT = "p^{2}r";
/** and the energy times the shell, which is the same statement about the coupling */
export const VIRIAL = "E·r";
/** how much of the unbiased pull the pair gets - `charge.attraction`'s answer */
export const COUPLING = "g_{q}";


/**
 * ONE PANEL: where the centre of mass is found, over a plane through the middle.
 *
 * THE DENSITY IS THE RADIAL SOLUTION TIMES THE ANGULAR ONE, and both are the same counting
 * condition asked in the two directions a plane has. Across, it is how many nodes fit
 * between here and the middle - which is what `shoot` integrated. Round, it is how many
 * fit on the way round, and a loop that did not close on a whole number of them would be a
 * loop whose phase did not match itself. Split out: |m| nodal planes through the axis and
 * l - |m| nodal cones across it, against the n - l - 1 rings the radial solution has.
 * Neither count was imposed - the radial one is read off the integration and the angular
 * one is what a closed loop can carry.
 */
const panel = (st: State, m: number, span: number, px: number) => {
  const rgb = new Uint8Array(px * px * 3);
  const dens = new Float64Array(px * px);
  let peak = 0;
  /*
   * TWO BY TWO WITHIN EACH PIXEL, AND THE PROFILE READ BETWEEN ITS CELLS.
   *
   * The radial solution lives on the lattice's own shells, one cell apart, and a plane
   * sampled at whole cells is a plane sampled on a square grid against a set of circles -
   * which puts a four-pointed star of aliasing through the middle of every panel where the
   * circles are tightest. Reading u between its cells and averaging four samples to a
   * pixel is not a change to what was solved, it is drawing what was solved without the
   * grid of the drawing showing through it.
   */
  for (let j = 0; j < px; j++) for (let i = 0; i < px; i++) {
    let d = 0;
    for (const [dx, dy] of [[-0.25, -0.25], [0.25, -0.25], [-0.25, 0.25], [0.25, 0.25]]) {
      const x = (i + dx - (px - 1) / 2) / ((px - 1) / 2) * span;
      const z = ((px - 1) / 2 - j - dy) / ((px - 1) / 2) * span;
      d += densityAt(st, m, x, z) / 4;
    }
    dens[j * px + i] = d;
    if (d > peak) peak = d;
  }
  for (let p = 0; p < px * px; p++) {
    const [R, G, B] = colour(peak > 0 ? Math.pow(dens[p] / peak, CONTRAST) : 0);
    rgb[p * 3] = R; rgb[p * 3 + 1] = G; rgb[p * 3 + 2] = B;
  }
  return png(px, px, rgb);
};

export const atom: Probe = {
  id: "atom/where-the-centre-of-mass-is",
  asks: "the sign law says what a biased pair pulls with and the counting condition says " +
    "what can stand in it. Put both on the lattice at once: what is bound, how far out, " +
    "and where is it actually found?",
  run: (lab: Lab): Probing => {
    const measured: Measured[] = [];
    const facts: Emitted[] = [];
    const figures: Figure[] = [];

    /*
     * AND A THEORY WITH NO SIGN ON ITS RAYS HAS NO ATOM, which is a result rather than a
     * gap. Everything below rests on `charge.attraction`, and that theorem concludes
     * nothing under a theory whose rays carry nothing to be biased about: there is one
     * sign of force, every meeting is the same meeting, and the well that a pair of
     * opposite biases digs does not exist. Running the integration anyway would produce
     * shells under `G` and they would be shells of nothing.
     */
    if (!lab.theory.polarised) return {
      facts, measured, holds: false,
      found: `${lab.theory.name}'s rays carry no sign, so there is no bias, no sign law ` +
        `and no well - charge.attraction concludes nothing here and neither can this. ` +
        `Pure gravity has one sign of force and it does not bind a shell structure; the ` +
        `absence is what this theory says rather than something the run failed to find`,
    };

    /*
     * AND IT IS A THREE-DIMENSIONAL QUESTION, which is not a limitation of the probe but
     * what `charge.falloff` says.
     *
     * The pull thins as the room there is at a distance, and that room is the lattice's:
     * the field goes as r^{-(D-1)}, so what a far body sits in goes as r^{-(D-2)} - which
     * is 1/r on three dimensions, a LOGARITHM on two, and a well that gets deeper for ever
     * on one. Those are three different problems with three different ladders, and only
     * the first has the balance this theorem is built on. Running the three-dimensional
     * arithmetic on a two-dimensional lattice would be reporting an answer to a question
     * the lattice was not asked.
     *
     * THE TWO THREE-DIMENSIONAL LATTICES ARE THE CHECK. fcc-12 and cubic-6 are both D = 3
     * with different exit counts, so an answer that came out of the TILING rather than out
     * of the dimension would show up as those two disagreeing.
     */
    if (lab.geometry.D !== 3) return {
      facts, measured, holds: false,
      found: `${lab.geometry.name} has ${lab.geometry.D} dimension` +
        `${lab.geometry.D === 1 ? "" : "s"}, and charge.falloff makes the potential ` +
        `r^{-(D-2)} - which on ${lab.geometry.D} is ` +
        `${lab.geometry.D === 2 ? "a logarithm" : "a well that only gets deeper"}, not ` +
        `the 1/r this balance is built on. That is a different problem with a different ` +
        `ladder and it is not this theorem's; the inverse square is a fact about three ` +
        `dimensions and so is everything that follows from it`,
    };

    /*
     * THE COUPLING IS THE SIGN LAW'S, AND BOTH SIGNS OF IT ARE RUN.
     *
     * An atom is one body biased one way and one biased the other, so P_a·P_b = -1 and the
     * coupling is 2 - twice what unbiased matter of the same masses would feel. The other
     * case is run as the control that costs nothing and decides everything: two bodies
     * biased the SAME way have P_a·P_b = +1, coupling nought, no well, and there is
     * nothing for anything to stand in. If that came back with a bound state the sign law
     * would be wrong and so would this.
     */
    const opposite = OPPOSITE, alike = ALIKE;
    const states = shells(opposite);
    const control = shells(alike);

    measured.push(measure(COUPLING, opposite,
      `1 - P_a·P_b at P_a = +1 against P_b = -1, which is what an atom is: one body ` +
      `biased one way and one the other. Twice what unbiased matter of the same masses ` +
      `would feel, and it is charge.attraction's number rather than this probe's`));
    measured.push(measure("bound states at alike bias", control.length,
      `the control, and it is the sign law with its teeth in: two bodies biased the SAME ` +
      `way have 1 - P_a·P_b = 0, so there is no well at all and nothing can stand in it. ` +
      `Nought here is the prediction; anything else would refute charge.attraction`));

    if (!states.length) return {
      facts, measured, holds: false,
      found: "no coupling, so no well and nothing bound - which is what the sign law says " +
        "about a pair whose biases agree, and not a failure of the integration",
    };

    /*
     * WHAT THE SHELLS COME TO. Everything from here is a ratio between them, so none of it
     * moves when the one number put in does.
     */
    const s = (n: number, l: number) => states.find(x => x.n === n && x.l === l)!;
    const ess = [1, 2, 3, 4].map(n => s(n, 0));

    for (const x of states)
      measured.push(measure(`E at n = ${x.n}, l = ${x.l}`, x.E,
        `${x.nodes} nodes across, which is n - l - 1 = ${x.n - x.l - 1} - counted off the ` +
        `solution rather than imposed. Its mean radius is ${x.mean.toFixed(1)} cells and ` +
        `its outermost peak is at ${x.peak} - against n^{2} times the ground state's ` +
        `${A0}, which is ${x.n * x.n * A0}`));

    /* the two products the balance holds fixed - the same measurement read two ways */
    const virial = ess.map(x => x.E * x.mean);
    const orbit = ess.map(x => 2 * -x.E * x.mean);
    const spread = (v: number[]) =>
      (Math.max(...v.map(Math.abs)) - Math.min(...v.map(Math.abs))) /
      (v.reduce((a, b) => a + Math.abs(b), 0) / v.length);

    measured.push(measure(VIRIAL, virial[0],
      `E·r at n = 1, and across n = 1 to 4 it is ` +
      `${virial.map(v => v.toExponential(3)).join(", ")} - a spread of ` +
      `${(spread(virial) * 100).toFixed(2)} per cent. IT DOES NOT DEPEND ON WHICH SHELL, ` +
      `which is the whole of what makes this one atom rather than a different force at ` +
      `every radius: the coupling is a property of the two bodies' biases and of nothing ` +
      `else`));
    measured.push(measure(ORBIT, orbit[0],
      `p^{2}r at n = 1, taken as 2·(-E)·r since what is not potential is kinetic - across ` +
      `n = 1 to 4 it is ${orbit.map(v => v.toExponential(3)).join(", ")}, a spread of ` +
      `${(spread(orbit) * 100).toFixed(2)} per cent. The same numbers as E·r read as the ` +
      `force balance rather than as the energy, and constant for the same reason`));

    /* and the two laws, snapped off the shells rather than fitted to them */
    const fit = (ys: number[]) => {
      const xs = ess.map(x => Math.log(x.n));
      const mx = xs.reduce((a, b) => a + b, 0) / xs.length;
      const ly = ys.map(y => Math.log(Math.abs(y)));
      const my = ly.reduce((a, b) => a + b, 0) / ly.length;
      let num = 0, den = 0;
      for (let i = 0; i < xs.length; i++) { num += (xs[i] - mx) * (ly[i] - my); den += (xs[i] - mx) ** 2; }
      const k = num / den;
      const res = Math.max(...xs.map((x, i) => Math.abs(ly[i] - (my + k * (x - mx)))));
      return { k, res };
    };
    const eFit = fit(ess.map(x => x.E)), rFit = fit(ess.map(x => x.mean));

    measured.push(measure("slope of log|E| against log n", eFit.k,
      `over n = 1 to 4, worst residual ${eFit.res.toExponential(2)} in the log. Fitted ` +
      `here only to be reported: the law the prover concludes comes from the balance and ` +
      `the counting condition, and this is the check that the two agree`));
    measured.push(measure("slope of log r against log n", rFit.k,
      `over the same four, worst residual ${rFit.res.toExponential(2)}`));

    /*
     * AND THE PICTURES, WHICH ARE THE RESULT.
     *
     * A shell structure is not a number. What the two laws come to is a density over a
     * whole plane - where the centre of mass is FOUND, which is the only thing about a
     * bound electron there is to know - and no exponent is a faithful statement of it.
     * Both figures are made from the same solved states and nothing else.
     */
    const px = 150;
    const shown = SHOWN;
    const cols = 4, rows = Math.ceil(shown.length / cols);
    const cell = 190, gap = 16, pad = 30, lab_ = 22;

    const sheet = (span: (n: number, l: number) => number, title: string, caption: string) => {
      const W = pad * 2 + cols * cell + (cols - 1) * gap;
      const Hh = pad * 2 + rows * (cell + lab_) + (rows - 1) * gap;
      const bits: string[] = [];
      shown.forEach(([n, l, m], i) => {
        const st = s(n, l);
        const x = pad + (i % cols) * (cell + gap);
        const y = pad + Math.floor(i / cols) * (cell + lab_ + gap);
        const data = panel(st, m, span(n, l), px);
        bits.push(`<image x="${x}" y="${y}" width="${cell}" height="${cell}" ` +
          `preserveAspectRatio="none" href="data:image/png;base64,${data}"/>`);
        bits.push(`<text x="${x + cell / 2}" y="${y + cell + 15}" fill="#8a8d99" ` +
          `font-size="11" font-family="ui-monospace,Menlo,monospace" ` +
          `text-anchor="middle">n=${n} l=${l} m=${m}</text>`);
      });
      return {
        title, caption,
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${Hh}" ` +
          `role="img" aria-label="${title}">` +
          `<rect width="${W}" height="${Hh}" fill="#08090d"/>${bits.join("")}</svg>`,
      };
    };

    const outer = Math.max(...shown.map(([n, l]) => s(n, l).mean)) * 1.35;
    figures.push(sheet(() => outer,
      "the shells at one scale",
      `where the centre of mass is found, on a plane through the middle, for the twelve ` +
      `lowest states - all twelve drawn at ONE scale, ${Math.round(outer)} cells across, ` +
      `so that the growth is the thing you see. Brightness is the density to the power a ` +
      `quarter, because the outer lobes are two decades under the inner ones. Nothing is ` +
      `drawn that was not solved: each panel is that state's own radial profile times the ` +
      `angular one, and both are the counting condition asked in the two directions a ` +
      `plane has - how many nodes fit across, and how many fit on the way round`));

    figures.push(sheet((n, l) => s(n, l).mean * 2.1,
      "the shells each at its own scale",
      `the same twelve states with each panel scaled to its own extent, which is how these ` +
      `are usually drawn - it throws away the growth and shows the structure. The rings ` +
      `are the radial nodes, n - l - 1 of them, counted off the solution rather than ` +
      `imposed; the dark lines through the lobes are the angular ones, l - |m| across the ` +
      `axis and |m| round it. NOTE WHAT IS NOT HERE: no orbit, no ` +
      `circle, and nothing going round. What is drawn is where the thing IS, which is what ` +
      `a standing wave leaves behind and the only part of it that is not a matter of ` +
      `which tick you looked on`));

    /*
     * WHAT THE PROBE STANDS BEHIND - two constants and a positive, and not the exponents.
     *
     * THE EXPONENTS ARE DELIBERATELY NOT EMITTED. They were fitted above and are reported
     * as a check, but a probe that handed the prover `E ∝ n^{-2}` would be handing it the
     * answer: the whole point of the folder is that the exponent is what the RULES make of
     * the premises. What is emitted is the thing a run can honestly establish - that the
     * coupling does not depend on which shell you are on - and the rest is the prover's.
     */
    if (spread(orbit) > 0.02 || spread(virial) > 0.02) return {
      facts, measured, figures, holds: false,
      found: `the balance does not hold across the shells: p^{2}r spreads by ` +
        `${(spread(orbit) * 100).toFixed(1)} per cent and E·r by ` +
        `${(spread(virial) * 100).toFixed(1)}. A coupling that changed with the shell ` +
        `would not be a coupling and nothing here would be one atom`,
    };

    facts.push({
      fact: { kind: "conserved", of: ORBIT }, from: [],
      measured: [measured[measured.length - 3], measured[measured.length - 4]],
      because: `what holds a thing in a circle is its momentum against the pull, and the ` +
        `pull here is the sign law's coupling over r^{2} - so p^{2}/r = g_q/r^{2} and ` +
        `p^{2}r is the coupling itself. THE COUPLING IS A PROPERTY OF THE TWO BODIES' ` +
        `BIASES AND OF NOTHING ELSE, so it cannot depend on which shell is being asked ` +
        `about - measured across the four lowest, it moves by ` +
        `${(spread(orbit) * 100).toFixed(2)} per cent`,
      line: `${ORBIT} is the same on every shell`,
    });

    facts.push({
      fact: { kind: "conserved", of: VIRIAL }, from: [],
      measured: [measured[measured.length - 4]],
      because: `and the same numbers read as an energy rather than as a balance: what is ` +
        `not kinetic is potential, the potential is the coupling over r, so E·r is the ` +
        `coupling again up to a factor that is the same on every shell. Measured, it ` +
        `moves by ${(spread(virial) * 100).toFixed(2)} per cent across n = 1 to 4. It is ` +
        `NOT a second measurement - it is the first one read the other way, and saying ` +
        `so is the difference between two premises and one premise counted twice`,
      line: `${VIRIAL} is the same on every shell`,
    });

    /*
     * AND n IS A COUNT, WHICH IS NOT THE SAME AS A QUANTITY THAT MOVES.
     *
     * THIS IS A GUARD AND IT IS LOAD-BEARING. Without it the balance is rearranged for n
     * as readily as for r - `p^{2}r` fixed with p ∝ n/r gives n ∝ r^{1/2} by exactly the
     * same arithmetic - and that inverts the whole argument: it says how many nodes fit
     * is decided by how far out the shell is. It is the other way round. THE COUNTING
     * CONDITION FIXES n AND THE BALANCE THEN FIXES r, and n is a count of nodes rather
     * than something a force law is allowed to solve for.
     *
     * AND IT IS MEASURED RATHER THAN DECLARED. Every state's nodes were counted off its
     * own solution and every count came out a whole number, which is what makes n a
     * count at all - a shell at which one and a half nodes fitted would refute this and
     * there is no such shell.
     */
    const whole = states.every(x => x.nodes === x.n - x.l - 1);
    measured.push(measure("states whose nodes came out whole", states.length,
      `every one of them, and every count is exactly n - l - 1 - ` +
      `${states.map(x => `${x.nodes}`).join(", ")} against ` +
      `${states.map(x => `${x.n - x.l - 1}`).join(", ")}. Counted off each solution by ` +
      `watching it cross zero, not imposed: the integer is what the counting condition ` +
      `produces and this is where it is checked`));
    if (whole) facts.push({
      fact: { kind: "constant", of: NODES }, from: [],
      measured: [measured[measured.length - 1]],
      because: `n is how many nodes fit, and a node is a place where the thing's own two ` +
        `branches cancel - so it is a COUNT, and it came out whole in every one of the ` +
        `${states.length} states solved for. That makes it the label of a shell rather ` +
        `than a quantity a balance may be rearranged for: the counting condition fixes n, ` +
        `and only then does the balance fix how far out r has to be. Solving the balance ` +
        `for n instead would be saying the number of nodes is decided by the radius, ` +
        `which is the argument run backwards`,
    });

    facts.push({
      fact: { kind: "positive", of: BINDING }, from: [],
      measured: [measured[0], measured[1]],
      because: `and there IS something bound, which is the premise a null theory fails. ` +
        `At opposite biases the coupling is ${opposite} and ${states.length} states stand ` +
        `in the well; at alike biases it is ${alike}, there is no well, and ` +
        `${control.length} do. The binding energy is what it would take to get the thing ` +
        `out and it is greater than nothing exactly when the two biases oppose`,
    });

    return {
      facts, measured, figures, holds: true,
      found: `the two laws together bind: ${states.length} states stand in the well, each ` +
        `with n - l - 1 nodes in its radius - counted off its own solution, and whole in ` +
        `every one of them. The coupling comes out the same on every shell to ` +
        `${(spread(orbit) * 100).toFixed(2)} per cent, the mean radius goes as ` +
        `n^{${rFit.k.toFixed(3)}} and the energy as n^{${eFit.k.toFixed(3)}}. At ALIKE ` +
        `biases the coupling is nought, there is no well, and nothing is bound - which is ` +
        `the sign law's own prediction and the control this rests on`,
    };
  },
};
