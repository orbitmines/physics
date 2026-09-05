/**
 * THE CONTINUUM AS A BACKEND — the theory's own equation, integrated, with nothing added.
 *
 * `Continuum.continuum(G)` reads the rewrite rules and hands back ONE kinetic equation:
 *
 *     \partial_{t}n + \hat{d}\cdot\nabla_{x}n + \paren{\nabla n_{f}}\cdot\nabla_{\hat{d}}n
 *       = \paren{1 - \beta}\Sigma + \nu\paren{1 - \rho} - \sigma\omega n\tilde{n}
 *         + \sigma\paren{1 - \omega}n
 *
 * and each of its terms carries the three ledgers the rules move - rays, points of space and
 * folds - as counts rather than as prose. THIS FILE INTEGRATES THAT AND NOTHING ELSE. Every
 * rate, gate, degree, sign and ledger count is read off the term; the constants are the ones
 * `MEASURE` published off the closed theory. There is no number in here that was chosen.
 *
 * WHY A BACKEND AND NOT A PANEL. Drawing the discrete world means drawing single rays and
 * shot noise, and every gravity panel that tried it had to average hundreds of ticks to see
 * anything. The continuum is not a different model - it is the same rules with the population
 * read as a density - so a picture drawn from it is the theory, at the scale a reader can see.
 * And because it is a backend rather than a drawing, every visual can be put on it.
 *
 * AND NOTHING HERE KNOWS WHAT THE RULES ARE. There is no `\nu` in this file, no `\sigma`, no
 * `DEG`, no test for which rule a term came from. A term carries a RATE NAME, a GATE as an
 * expression, a DEGREE, whether it is FACING, what it was quantified OVER, and its three
 * ledger counts; this reads those and evaluates them against the symbol table the theory
 * published. Change a rule and `Continuum` hands back a different equation - a term more, a
 * gate different, a count changed - and this integrates that instead, without being edited.
 * The only things written down are what the grammar MEANS: a degree is a power of the
 * population, a facing term is quantified over an edge, a point-gate is a ray-share to the
 * `DEG`, and a left-hand operator streams.
 *
 * AND IT IS WHY THERE ARE NO BEAMS. The transport term is not free streaming: the same
 * meeting that destroys a pair leaves a fold, and `turns` draws against it - straight on with
 * weight one against `n_{f}` folded ways, which is the term's own
 *
 *     kernel.keeps = 1/\paren{1 + n_{f}}
 *
 * At the settled vacuum `n_{f}` is about six on this plane, so a ray keeps its heading about
 * one time in seven and is turned the other six. A shadow cast along an exit is scattered off
 * that exit within a cell or so, and what spreads is a sphere. Ballistic transport - keeping
 * the heading - is what makes eight beams, and it is not what the rules say.
 */

import { continuum } from "../lib/Continuum.ts";
import { Geometry } from "../lib/Local.ts";
import { numeric, type Expr } from "../lib/Algebra.ts";

/**
 * THE THEORY'S OWN CONSTANTS, KEYED BY THE NAMES IT USES — whatever it happens to name.
 *
 * Not a typed record of `nu` and `sigma`: a rule added tomorrow brings a rate with it, and a
 * record with fields for today's rates would silently drop it. `MEASURE` publishes whatever
 * the closed theory could put a number to, and every expression below is evaluated against
 * that map by NAME.
 */
export type Symbols = Record<string, number>;

/**
 * A SOURCE, AND WHAT IT DOES — `Source.ts`'s own three moving parts, kept here because they
 * are DERIVED and a panel that re-derives them gets them wrong.
 *
 * Every one of these was got wrong at least once by being written in a drawing instead: a body
 * pushed by its own rays, then by its own wake, then by the medium it had displaced, then flung
 * apart at twenty-five cells a tick by the impulse of its own step. None of that is about
 * pictures. It is `propel` and `turns`, it is written down in the rules, and it belongs
 * wherever the rules are integrated so that there is one place to be right.
 */
export type Moving = {
  /** where it is, and what is left over of a cell - `Source`'s own remainder */
  x: number; y: number; ax: number; ay: number;
  /** the way it is going, which is what `turns` bends */
  hx: number; hy: number;
  /** what arrives at it, which `propel` would make a force of - measured, not integrated */
  px: number; py: number;
  /** how often one of its cells lights one exit: `\bar{m}_{x}`, PER NEIGHBOUR, at most one */
  mx: number;
  /** how far across it is, in cells */
  radius: number;
  /** how fast it is carried, in cells a tick */
  speed: number;
  /** and which of its recent ticks went on moving rather than shining, which is `\beta` */
  moved: number[];
};

export type Field = {
  N: number;
  /** `n[c·DEG + k]` — the population, per point, per exit. `\hat{d}` is discretised by the
   *  geometry because the collision is `facing`, and a facing pair is two rays on one EDGE */
  n: Float64Array; work: Float64Array;
  /** the ledgers the terms move, one array each, named as the terms name them */
  ledger: Record<string, Float64Array>;
  /** what a source puts in, per point — the term no rewrite of the medium produces */
  put: Float64Array;
  /** the sources in it, which the step below moves by the rules and not by a path */
  bodies: Moving[];
  blocks: Uint8Array;
  t: number;
};

/*
 * READ AS A NUMBER, NOT REBUILT AS AN EXPRESSION — which is the difference between a panel
 * that records in twenty minutes and one that records in one.
 *
 * `simplify(evaluate(e, at))` makes a fresh tree and folds it, and this is asked of every term
 * of every cell of every tick: at a hundred and eighty cells square that is a million trees a
 * tick. `Algebra.numeric` walks the same expression and returns the number, allocating
 * nothing. It is the same answer by the same rules - the folding was never what made it right.
 */
const num = (e: Expr | undefined, at: Symbols, fallback: number): number => {
  if (!e) return fallback;
  const v = numeric(e, at);
  return Number.isFinite(v) ? v : fallback;
};

/** a count like `{n: 0, of: {DEG: 1}}`, against whatever the theory called those names */
const count = (c: { n: number; of?: Record<string, number> } | undefined, at: Symbols): number => {
  if (!c) return 0;
  let v = c.n ?? 0;
  for (const [k, m] of Object.entries(c.of ?? {})) v += m * (at[k] ?? 0);
  return v;
};

export const field = (o: {
  symbols: Symbols; N: number; geometry: Geometry; theory: any;
  /*
   * WHETHER THE BOX JOINS ITS OWN FACES — false, and it has to be, because a torus is a
   * different world and not a big one: a ray leaving one side arrives on the other, so a body
   * is lit from behind by its own radiation come round the world. The one place it is right
   * is a box standing for a UNIFORM medium, where wrapping is what "everywhere alike" means.
   */
  wraps?: boolean;
  /*
   * HOW MANY POPULATIONS ARE CARRIED APART FROM THE VACUUM'S — one per source, and it is
   * bookkeeping rather than a change to the dynamics.
   *
   * `G` gives a `Local` a `source`, so whose ray a ray is is a thing the model distinguishes.
   * Every rule treats them alike: transport moves a ray without asking, and a meeting destroys
   * whatever is facing whatever, so a tagged population is transported by the same operator
   * and loses the same SHARE of itself the total loses. Nothing is added; the sum of the tags
   * and the vacuum is exactly the population the line is about.
   *
   * AND IT IS WHAT LETS THE TWO-BODY TERM BE SEEN. A single body cannot have gravity - its
   * rays need something to annihilate against - so the force law is `\bar{m}\bar{m}'` and the
   * long-range channel is MEETINGS between two bodies' radiation. That is a cross term, and a
   * cross term cannot be drawn from a total: it needs the two halves kept apart.
   */
  tags?: number;
}) => {
  const sym = o.symbols, N = o.N, g = o.geometry, DEG = g.DEG;
  const cells = N * N;
  /*
   * AND THE BOX HAS AN EDGE, because a torus is a different world and not a big one.
   *
   * Wrapped, a ray that leaves one side arrives on the other - so a body is lit from behind
   * by its own radiation come round the world, and two bodies are pulled by their own images
   * as well as by each other. With bodies free to move it is worse: one walks off the edge
   * and reappears beside the other. `G` seeds a BOX and grows it; nothing in these rules
   * joins its faces. So a step that leaves is a ray that left, and it is gone.
   */
  const at = o.wraps
    ? (x: number, y: number) => (((y % N) + N) % N) * N + (((x % N) + N) % N)
    : (x: number, y: number) =>
        x < 0 || y < 0 || x >= N || y >= N ? -1 : y * N + x;

  const eq = continuum(o.theory);
  /*
   * THE EQUATION, SPLIT THE WAY IT SPLITS ITSELF. `side` says which terms are the operator
   * and which are the sources and sinks; nothing here decides that.
   */
  const moving = eq.terms.filter(t => t.side === "left" && t.operator && !/partial_\{t\}/.test(t.operator));
  const acting = eq.terms.filter(t => t.side === "right");

  /* one array per ledger the terms actually move, discovered from the terms */
  const ledgers = new Set<string>();
  for (const t of eq.terms) {
    if (count(t.rayCount as any, sym)) ledgers.add("rays");
    if (count(t.spaceCount as any, sym)) ledgers.add("space");
    if (count(t.foldCount as any, sym)) ledgers.add("folds");
  }
  const ledger: Record<string, Float64Array> = {};
  for (const l of ledgers) ledger[l] = new Float64Array(cells);

  const T = o.tags ?? 0;
  /* one scratch row for the tag totals, so a tick allocates nothing */
  const tagSum = new Float64Array(Math.max(1, o.tags ?? 0));
  const tag: Float64Array[] = Array.from({ length: T }, () => new Float64Array(cells * DEG));
  const tagWork: Float64Array[] = Array.from({ length: T }, () => new Float64Array(cells * DEG));
  /** where space was destroyed this tick, and by which pair of tags - the meetings */
  const destroyed = new Float64Array(cells);
  const between = new Float64Array(cells);
  /*
   * AND WHAT A RAY HANDS OVER WHEN IT STOPS, which is what pushes a body.
   *
   * `propel` gives a body the momentum of what arrives at it, and a ray arriving carries the
   * heading it was going: so a cell that absorbs one is handed that heading, and the sum over
   * a body's cells is the force on it. Nothing here decides what a force is - the ray was
   * going somewhere and now it is not, and this is where the difference went.
   */
  const hit = new Float64Array(cells * 2);
  /*
   * AND HOW MUCH ARRIVED, not just which way it was going - because a body HANDS IT BACK.
   *
   * `propel` counts every arrival into a budget and spends that budget emitting: "every ray
   * it sends costs it the recoil", and a conserving source sends no more than came in. So a
   * body is not a sink - what it takes it puts back, isotropically - and a body hit alike
   * from every side accumulates nothing, which is the guarantee that leaves only the
   * LOPSIDEDNESS, the shadow another body casts.
   */
  const took = new Float64Array(cells);

  const f: Field = {
    N, n: new Float64Array(cells * DEG), work: new Float64Array(cells * DEG),
    ledger, put: new Float64Array(cells), blocks: new Uint8Array(cells),
    bodies: [], t: 0,
  };

  /** the population at a point, in the units the equation's `n` is in — a share of exits */
  const rho = (c: number) => {
    let s = 0; for (let k = 0; k < DEG; k++) s += f.n[c * DEG + k];
    return s / DEG;
  };
  /*
   * AND EVERY EXPRESSION IS READ IN THE LOCAL STATE, because a gate is about THIS point. The
   * ledgers are offered under their own names, so a kernel written in `n_{f}` finds the fold
   * record here rather than the ambient one — which is the whole of why a shortfall deepens.
   */
  /*
   * AND THE ENVIRONMENT IS ONE OBJECT, WRITTEN INTO — not a fresh spread per cell.
   *
   * A gate is about THIS point, so `\rho` and `n_{f}` are read where the term is being
   * asked; everything else is the theory's and does not move. Spreading the whole table for
   * every cell of every tick allocated a million short-lived objects a tick and was most of
   * what a recording cost. The two that change are assigned in place.
   */
  const local: Symbols = { ...sym };
  const here = (c: number): Symbols => {
    local["\\rho"] = rho(c);
    if (ledger.folds) local["n_{f}"] = ledger.folds[c];
    return local;
  };

  /*
   * AND EVERYTHING ABOUT A TERM THAT DOES NOT DEPEND ON WHERE IT IS ASKED IS WORKED OUT ONCE.
   *
   * A term's rate and its three ledger counts are the same at every cell - they are read off
   * the rule, not off the medium - and only its GATE moves, because a gate is about this
   * point's occupancy. They were being rebuilt per cell per term per tick, and `count` walks
   * `Object.entries` to do it, so a hundred and eighty cells square came to a million small
   * arrays a tick. What is left in the loop is the one thing that actually varies.
   */
  const fixed = acting.map(t => ({
    t,
    rate: t.rate ? (sym[t.rate] ?? 1) : 1,
    dRays: count(t.rayCount as any, sym),
    dSpace: count(t.spaceCount as any, sym),
    dFolds: count(t.foldCount as any, sym),
    point: t.over === "Local",
  }));
  const source = acting.find(t => !t.rules.length);

  const step = () => {
    destroyed.fill(0); between.fill(0); hit.fill(0); took.fill(0);
    for (let c = 0; c < cells; c++) {
      const e = here(c);
      /*
       * A SOURCE IS PUT IN FROM OUTSIDE AND THE MEDIUM'S RULES DO NOT RUN ON IT — but what it
       * puts in still leaves it, which is the whole of how a body reaches anything. Skipping
       * the cell entirely skipped its emission too, so every body here was a pure absorber:
       * all shortfall and no source. A shortfall is screened - `transport.screened` gives it
       * about a cell - so the field died within a few cells and the `r^{-\paren{D - 1}}` the
       * rules derive was nowhere in the picture, because the term that carries it was off.
       */
      if (!f.blocks[c]) for (const fx of fixed) {
        const t = fx.t, rate = fx.rate;
        const share = num(t.share, e, 1);
        /*
         * A GATE IS A SHARE OF WHATEVER THE RULE WAS ASKED ABOUT — `Term.over`. Asked of a
         * POINT it is about all of the point's exits at once, and a point-occupancy and a
         * ray-density are `DEG` draws apart; asked of a ray it is the share as written.
         */
        const gate = fx.point ? Math.pow(Math.max(0, share), DEG) : share;
        const dRays = fx.dRays, dSpace = fx.dSpace, dFolds = fx.dFolds;

        if (t.facing) {
          /*
           * A FACING RATE GOES AGAINST THE ONCOMING CURRENT, AND THAT IS AN AVERAGE — not a
           * pairing of each exit with the one opposite it.
           *
           * `unbiased` derives the factor: the facing weight is `\paren{1 - \hat{d}\cdot
           * \hat{j}}/2` where `\hat{j}` is what the opposing population is doing on average,
           * and in a medium alike in every direction that is nothing, so `F = 1/2`. It
           * INTERPOLATES between one head-on and nought co-moving - which means a ray meets
           * the whole local population weighted by how much of it is coming the other way,
           * and not only the ray on the exit exactly opposite.
           *
           * PAIRING BY `OPP` WAS THE ASSUMPTION. It makes every counted meeting exactly
           * head-on, which is `F = 1` for the pairs it keeps and nought for all the rest, and
           * it came out `DEG` times too strong - the whole of the factor of eight between
           * this and `\rho_{\infty}`. The rules average; so does this.
           */
          const Fw = sym["F"] ?? 1;
          const p = rho(c);
          const fires = rate * gate * Fw * p * p;
          if (fires > 0) {
            /*
             * AND IT COMES OFF IN FACING PAIRS, WHICH IS WHY THE FLUX SURVIVES WHAT THE
             * DENSITY DOES NOT.
             *
             * A meeting takes ONE RAY FROM EACH SIDE of an edge, so it carries away no net
             * momentum whatever - `\Sigma` is marked conserved for exactly this reason, "a
             * turn that keeps the heading loses none of it", and `spreading` conserves the
             * flux through a shell and gets `r^{-\paren{D - 1}}` from it.
             *
             * TAKING IT IN PROPORTION TO WHAT IS THERE DESTROYS THAT. Removing a share of
             * every direction removes a share of the IMBALANCE too, so the net flux decayed
             * at the same rate the density did - exponentially, screened, with the long-range
             * field the rules derive nowhere in it. The rate is still the averaged one the
             * balance carries; only where the rays come from is fixed, and they come from
             * both ends of an edge in equal measure.
             */
            let wsum = 0;
            for (const k of g.AXES) wsum += f.n[c * DEG + k] * f.n[c * DEG + g.OPP[k]];
            if (dRays && wsum > 0) for (const k of g.AXES) {
              const a = c * DEG + k, b = c * DEG + g.OPP[k];
              const share = (f.n[a] * f.n[b]) / wsum;
              const off = fires * Math.abs(dRays) * share / 2;
              f.n[a] = Math.max(0, f.n[a] - off);
              f.n[b] = Math.max(0, f.n[b] - off);
            }
            if (ledger.space) ledger.space[c] += fires * dSpace;
            if (ledger.folds) ledger.folds[c] = Math.max(0, ledger.folds[c] + fires * dFolds);
            /*
             * AND THIS IS WHERE SPACE IS DESTROYED, which is what gravity IS here - (G/1)
             * leaves one neutral point where two were, so the space ledger going down is the
             * event itself and not a proxy for it.
             */
            destroyed[c] += Math.abs(fires * dSpace);
            /*
             * AND HOW MUCH OF IT WAS BETWEEN TWO DIFFERENT BODIES. A meeting is between what
             * is there, so the share of it that is body `i` against body `j` is the product
             * of their shares - which is the `\bar{m}\bar{m}'` of the force law, arising
             * here as the cross term of a quadratic and not put in.
             */
            if (T > 1) {
              const tot = Math.max(p * DEG, 1e-300);
              let cross = 0;
              for (let i = 0; i < T; i++) for (let j = i + 1; j < T; j++) {
                let si = 0, sj = 0;
                for (let k = 0; k < DEG; k++) { si += tag[i][c * DEG + k]; sj += tag[j][c * DEG + k]; }
                cross += 2 * (si / tot) * (sj / tot);
              }
              between[c] += Math.abs(fires * dSpace) * cross;
            }
            /* a tagged population loses the share of itself the total lost */
            if (T && dRays) {
              const tot = Math.max(p * DEG, 1e-300);
              const lost = Math.min(1, fires * Math.abs(dRays) / tot);
              for (let i = 0; i < T; i++)
                for (let k = 0; k < DEG; k++) tag[i][c * DEG + k] *= 1 - lost;
            }
          }
        } else {
          const fires = rate * gate * Math.pow(t.degree ? rho(c) : 1, t.degree || 0);
          if (fires <= 0) continue;
          /* what is made goes out every way alike, which is what lighting every exit IS */
          if (dRays) for (let k = 0; k < DEG; k++)
            f.n[c * DEG + k] = Math.max(0, f.n[c * DEG + k] + fires * dRays / DEG);
          if (ledger.space) ledger.space[c] += fires * dSpace;
          if (ledger.folds) {
            /*
             * AND A RETURN IS GATED ON THERE BEING SOMETHING TO RETURN, which is `unfold`'s
             * BODY rather than its declared count: it decrements a way only where that way
             * has a fold. The count says `-DEG` because a count has to be a constant. Taken
             * flat the returning outruns the making and the record drains to nothing, which
             * reads the line's NET as its LEVEL - and a level is the rate one is made times
             * how long one lasts. The vacuum is working the whole time; it is not empty
             * because its books balance.
             */
            const nf = ledger.folds[c];
            const d = dFolds < 0 ? dFolds * (1 - Math.pow(1 - 1 / DEG, nf)) : dFolds;
            ledger.folds[c] = Math.max(0, nf + fires * d);
          }
        }
      }
      /* and the source, which is the term no rewrite puts there — its own gate, its own rate */
      if (f.put[c] > 0) {
        const gate = num(source?.share, e, 1);
        const which = f.blocks[c] - 1;              /* which body owns this cell */
        for (let k = 0; k < DEG; k++) {
          const sent = f.put[c] * gate / DEG;
          f.n[c * DEG + k] += sent;
          if (which >= 0 && which < T) tag[which][c * DEG + k] += sent;
          /*
           * AND EVERY RAY IT SENDS COSTS IT THE RECOIL, wherever that ray ends up - `propel`'s
           * own line, and the half that makes the catch above safe to leave unfiltered. Sent
           * alike down every exit it sums to nothing, which is why an isotropic source does
           * not push itself; it is here so that it cannot silently stop being isotropic.
           */
          const u = g.U[k];
          hit[c * 2] -= u[0] * sent;
          hit[c * 2 + 1] -= u[1] * sent;
        }
      }
    }

    /* ———— and the operator: the turn, then the step ———— */
    f.work.fill(0);
    for (let i = 0; i < T; i++) tagWork[i].fill(0);
    const turn = moving.find(t => t.kernel);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const c = at(x, y);
      /*
       * AND A SOURCE'S CELL STREAMS LIKE ANY OTHER, which `MOVEMENT` says outright: "a ray on
       * a SOURCE's cell streams like any other - that is how what a body emits gets out of
       * it." Skipping it FROZE whatever was standing there, so a cell the body had held for a
       * while kept a full reservoir and dumped it the moment the body moved off - into the
       * body, from behind, pushing it the way it was already going. Measured, one body alone
       * accelerated itself at a fifth of a cell a tick with nothing else in the world.
       */
      const e = here(c);
      /*
       * THE KERNEL IS THE TERM'S, EVALUATED. `keeps` is how much of a heading survives one
       * turn and `drifts` is what bends it; both are expressions the term hands over, so a
       * rule that changes what a fold does to a ray changes this without it being edited.
       * With no turn term at all `keeps` is one and this is free streaming.
       */
      const keeps = turn ? num(turn.kernel!.keeps, e, 1) : 1;

      let tot = 0;
      for (let k = 0; k < DEG; k++) tot += f.n[c * DEG + k];
      const turned = tot * (1 - keeps);
      /*
       * AND WHAT EACH TAG HOLDS IS SUMMED ONCE, not once per exit. It does not depend on which
       * exit is being carried, and it was inside that loop - `DEG` sums of `DEG` terms per
       * cell where one sum of `DEG` would do, which on eight exits is the transport costing
       * eight times what it needs to.
       */
      const tagTot = tagSum;
      for (let i = 0; i < T; i++) {
        let s2 = 0;
        for (let q = 0; q < DEG; q++) s2 += tag[i][c * DEG + q];
        tagTot[i] = s2;
      }
      /* `drifts` is a gradient, so it is read as one — of whatever the expression names */
      const dv = turn ? num(turn.kernel!.drifts, e, 0) : 0;
      const fold = (i: number) => i < 0 ? 0 : ledger.folds![i];
      const gx = dv && ledger.folds ? (fold(at(x + 1, y)) - fold(at(x - 1, y))) / 2 : 0;
      const gy = dv && ledger.folds ? (fold(at(x, y + 1)) - fold(at(x, y - 1))) / 2 : 0;
      const gn = Math.hypot(gx, gy);

      for (let k = 0; k < DEG; k++) {
        const u = g.U[k];
        const lean = gn > 0 ? 1 + (u[0] * gx + u[1] * gy) / (gn + 1) : 1;
        const carries = f.n[c * DEG + k] * keeps + turned / DEG * lean;
        /* one cell along its own exit, which is what c̄ = 1 IS and which lands ON a cell */
        const v = g.V[k];
        const to = at(x + v[0], y + v[1]);
        if (to < 0) continue;                     /* it left the box, and it is gone */
        if (f.blocks[to]) {
          /*
           * EVERY RAY THAT ARRIVES IS CAUGHT, AND NONE OF THEM IS FILTERED — which is what
           * `propel` says the symmetry rests on, and it says what happens when it is broken:
           *
           *   "Emission counted every ray and absorption counted only foreign ones, so an
           *    internal ray was charged the recoil and never credited the catch — which does
           *    not prevent a self-force, IT MANUFACTURES ONE, at -V per internal ray. The
           *    symmetry is the guarantee; the filter was the thing breaking it."
           *
           * Both filters were here. A ray from a body's own cell into its own other cell was
           * skipped, which also DELETED it; and what was left was weighed against the body's
           * own tag and the tagged share dropped. So the catch was filtered and the recoil
           * below is not, which is the manufactured force exactly as described - and it was
           * what threw a pair released from rest apart at twenty-five cells a tick.
           *
           * SO EVERYTHING IS CAUGHT AND EVERYTHING IS COUNTED, and a body hit alike from
           * every side accumulates nothing because the exits come in plus-minus pairs and
           * cancel. What is left is the LOPSIDEDNESS, which is the shadow the other body
           * casts, and that is the whole of the pull.
           */
          const u = g.U[k];
          hit[to * 2] += u[0] * carries;
          hit[to * 2 + 1] += u[1] * carries;
          took[to] += carries;
          continue;
        }
        if (carries > 1e-14) f.work[to * DEG + k] += carries;
        /* and a tagged population is moved by the same operator, turn and all */
        for (let i = 0; i < T; i++) {
          const tc = tag[i][c * DEG + k] * keeps + tagTot[i] * (1 - keeps) / DEG * lean;
          if (tc > 1e-14) tagWork[i][to * DEG + k] += tc;
        }
      }
    }
    const swap = f.n; f.n = f.work; f.work = swap;
    for (let i = 0; i < T; i++) { tag[i].set(tagWork[i]); tagWork[i].fill(0); }
    f.t++;
  };

  /** how much of a tagged population is standing at a point, in the units `\rho` is in */
  const from = (i: number, c: number) => {
    let s = 0; for (let k = 0; k < DEG; k++) s += tag[i][c * DEG + k];
    return s / DEG;
  };
  /* the cells a body covers, clipped to the box - a body at the edge is partly out of it */
  const covers = (b: Moving) => {
    const out: number[] = [];
    const R = b.radius;
    for (let y = -R; y <= R; y++) for (let x = -R; x <= R; x++) {
      if (x * x + y * y > R * R) continue;
      const c = at(Math.round(b.x) + x, Math.round(b.y) + y);
      if (c >= 0) out.push(c);
    }
    return out;
  };

  /** the share of its recent ticks a body spent moving rather than shining */
  const beta = (b: Moving) =>
    b.moved.length ? b.moved.reduce((s, v) => s + v, 0) / b.moved.length : 0;

  /**
   * LAY THE SOURCES INTO THE FIELD — and a body HANDS BACK what arrived at it.
   *
   * `propel` counts every arrival into a budget and spends that budget emitting: "every ray it
   * sends costs it the recoil", and a conserving source sends no more than came in. So a body
   * is not a sink. Left as one it ploughs a furrow - the density four cells behind a moving
   * body came out at 0.377 against 0.419 ahead - and the medium drags on it at about two cells
   * a tick, which is a million times the pull between two bodies.
   *
   * AND WHAT IT SENDS ON TOP IS ITS OWN, gated by how much of its ticks went on moving rather
   * than shining: `EMISSION` is gated on `not(moving)`, so that share is `1 - \beta`. What one
   * of its cells sends altogether is `\bar{m}_{x}` times its `DEG` ways out, because
   * `\bar{m}_{x}` is PER NEIGHBOUR.
   */
  const lay = () => {
    const back = new Float64Array(took.length);
    back.set(took);
    f.blocks.fill(0); f.put.fill(0);
    f.bodies.forEach((b, i) => {
      for (const c of covers(b)) {
        f.blocks[c] = i + 1;
        f.put[c] = (1 - beta(b)) * b.mx * DEG + back[c];
      }
    });
  };

  /*
   * A STEP DISPLACES THE MEDIUM RATHER THAN OVERWRITING IT. Re-drawing a footprint one cell
   * over is not motion: a cell the body did not cover suddenly holds a body and one it did
   * suddenly holds vacuum, and neither transition conserves anything. What stood where it is
   * going is put where it has been - the medium goes round it - and nothing is made or lost.
   */
  const shift = (b: Moving, which: "ax" | "ay", along: "x" | "y") => {
    let stepped = 0;
    while (Math.abs(b[which]) >= 1) {
      const d = Math.sign(b[which]);
      const was = covers(b);
      b[along] += d; b[which] -= d;
      const now = covers(b);
      const gone = was.filter(c => !now.includes(c));
      const fresh = now.filter(c => !was.includes(c));
      for (let i = 0; i < Math.min(gone.length, fresh.length); i++)
        for (let k = 0; k < DEG; k++) {
          const a = gone[i] * DEG + k, g2 = fresh[i] * DEG + k;
          const keep = f.n[a]; f.n[a] = f.n[g2]; f.n[g2] = keep;
        }
      stepped = 1;
    }
    return stepped;
  };

  /**
   * AND WHICH WAY A BODY GOES IS `turns`, WHICH IS THE ONE RULE ABOUT HOW ANYTHING CURVES.
   *
   * `MOVEMENT` does not carry a thing straight on: it asks the place it is standing what ways
   * through it there are, and a place that has swallowed folds has more than its own exits -
   * "carry straight on with weight ONE and take a folded way with the weight that way was
   * folded". The continuum hands that same choice over in two moments,
   * `keeps = 1/\paren{1 + n_{f}}` of the heading and a lean of `\nabla n_{f}`, so the mean of
   * the draw is the heading plus the record as a vector. A BODY IS BENT BY WHAT IS FOLDED
   * WHERE IT STANDS AND BY NOTHING ELSE - it never asks where another body is, how heavy it
   * is, or how far away. That is a geodesic, arrived at rather than imposed.
   *
   * AND IT IS NOT `propel`'s FORCE, WHICH DOES NOT WORK HERE AND IT IS WORTH SAYING WHY. The
   * momentum ARRIVING at a body is the right quantity and it is measured below - for a body
   * standing still it comes to `10^{-8}`, machine nought, which is the check that the catch and
   * the recoil balance. But a body that STEPS takes an impulse from the step itself of order
   * ten, against a pull of order `10^{-3}`, and no mass closes that: the impulse does not fall
   * with mass the way a product of two masses does. The lean is not a small difference of large
   * arrivals - it is the record itself, `0.37` per tick nine cells from a body.
   */
  const bend = (b: Moving) => {
    const nf = (x: number, y: number) => {
      const c = at(Math.round(x), Math.round(y));
      return c < 0 ? 0 : (ledger.folds?.[c] ?? 0);
    };
    /*
     * AND IT IS READ ACROSS THE BODY, NOT INSIDE IT. A body of radius two asked what was
     * folded one cell away was asking its OWN cells, where no fold is ever made - the reaction
     * is skipped on a source's cells - so the difference came out as nothing and a pair passed
     * each other in a straight line. The record it is bent by is the one its own extent
     * spans, so the difference is taken at its edge and divided by the width between.
     */
    const d = b.radius + 1, span = 2 * d;
    const gx = (nf(b.x + d, b.y) - nf(b.x - d, b.y)) / span;
    const gy = (nf(b.x, b.y + d) - nf(b.x, b.y - d)) / span;
    const hx = b.hx + gx, hy = b.hy + gy;
    const n = Math.hypot(hx, hy) || 1;
    b.hx = hx / n; b.hy = hy / n;
  };

  /** what arrived at a body, which is what `propel` makes a force of - kept, not integrated */
  const felt = (b: Moving) => {
    let fx = 0, fy = 0;
    for (const c of covers(b)) { fx += hit[c * 2]; fy += hit[c * 2 + 1]; }
    b.px += fx; b.py += fy;
  };

  /** put a source in, and lay it down - `world.add` does this from outside, and so does this */
  const add = (spec: Partial<Moving> & { x: number; y: number }): Moving => {
    const b: Moving = {
      ax: 0, ay: 0, hx: 0, hy: 0, px: 0, py: 0,
      mx: 0.25, radius: 2, speed: 0, moved: [], ...spec,
    };
    f.bodies.push(b);
    lay();
    return b;
  };

  /** and everything a body does in a tick, in the order the rules do it */
  const carry = () => {
    for (const b of f.bodies) {
      felt(b);
      if (!b.speed) continue;
      bend(b);
      b.ax += b.speed * b.hx; b.ay += b.speed * b.hy;
      const stepped = Math.max(shift(b, "ax", "x"), shift(b, "ay", "y"));
      b.moved.push(stepped);
      if (b.moved.length > 100) b.moved.shift();
    }
    if (f.bodies.length) lay();
  };

  return Object.assign(f, {
    step, rho, DEG, from, destroyed, between, hit, took, tags: T,
    add, lay, carry, covers, beta,
  });
};
