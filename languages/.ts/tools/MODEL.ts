/**
 * THE MODEL, RUN — the seam between the rules and what gets measured.
 *
 * IT LIVES BESIDE THE TOOL AND NOT BESIDE THE PANELS, deliberately. `RENDER.ts` builds its
 * registry by importing every file in `src/visuals`, so anything there that reaches for
 * `Prove` makes EVERY picture wait for the rules to be closed - a minute of proving before a
 * colour change. Only `MEASURE.ts` needs the model; the panels read what it wrote.
 *
 * The panels are copied from the research repository unchanged: same axes, same colours,
 * same observations, same layout. What differs is WHERE THE MODEL LINE COMES FROM. There it
 * was a closed form somebody had derived once and typed in; here it is closed off `G.ts` by
 * `Prove`, and this file is the only place the two meet.
 *
 * WHY A SEAM AND NOT A REWRITE. A picture that is redrawn at the same time as the physics
 * changes cannot be used to check the physics - a difference could be either. Keeping the
 * panels byte-identical and moving only the source means a curve that shifts, shifted because
 * the model did.
 *
 * AND THE TWO LIMITS ARE THE ONES THE ARCHIVE'S FORM HAD, reached differently. `gOf` there
 * solved `g = g_N(1 + a_0/g)`, which was a turnover condition somebody wrote down. Here the
 * same two ends - `g -> g_N` where the medium is dense and `g -> \sqrt{g_N a_0}` where it is
 * thin - fall out of `spreading` solving a conservation whose speed depends on the density it
 * is solving for. Same shape, and now it is derived rather than assumed.
 */
import { continuum } from "../src/lib/Continuum.ts";
import { prove } from "../src/lib/Prove.ts";
import { evaluate, simplify, type Expr } from "../src/lib/Algebra.ts";
import { G } from "../src/theories/G/G.ts";
import { C_LIGHT, H0, hz } from "../src/lib/Transport.ts";

/** what the theory calls itself - so a panel names it rather than describing it */
export const THEORY: string = (G as any).name ?? "G";

const store = prove(continuum(G as any), (G as any).rules).store;
/** ANY DERIVED LAW BY NAME - what lets a measurement read the store instead of retyping it */
export const fact = (of: string) => store.all("is").find(f => f.of === of);

/**
 * A DERIVED EXPRESSION AS A NUMBER — by the algebra's own reader, not a second one.
 *
 * This carried its own walk over the tree, which meant every kind the algebra learned had to
 * be taught here too: it did not know a `root`, so the moment a balance stopped having a
 * closed form the panels died at import. `evaluate` fills the names in and `simplify` folds
 * what is left, and both are the ones the proof itself uses.
 */
/** and that law as a number, once its names are bound */
export const at = (e: Expr, env: Record<string, number>): number => {
  const got = simplify(evaluate(e, env));
  return got.kind === "num" ? got.n : NaN;
};

/**
 * THE FACT THE PANELS ARE A PICTURE OF — fetched, not restated.
 *
 * `spreading` solves the conservation and leaves `n` in the store. THAT EXPRESSION IS THE
 * MODEL. Writing its closed form out again here would mean the panels draw what this file
 * says rather than what the rules say, and the two could part without anything noticing -
 * which is exactly what happened the first time this seam was written: the formula was
 * copied across it and every picture came out byte-identical to the archive's.
 */
const N = fact("n");
const A0_FACT = fact("a_{0}");

/**
 * AND THE ENVIRONMENT THAT MAKES ITS SYMBOLS INTO A NEWTONIAN READING.
 *
 * The stored law is written in the flux, the room and the rules' own rates; a panel has a
 * Newtonian acceleration and a scale. One tick of room - `r = 1` - and the flux set to the
 * acceleration makes `\Phi·r^{-(D-1)}` the one and `\sigma\rho` the other, so the two meet
 * without either being rewritten.
 *
 * CHECKED, NOT ASSUMED. `a_{0}` has a derivation of its own and its form is not this file's
 * to know: the environment is built, the stored `a_{0}` is evaluated in it, and if it does
 * not come to the scale that was asked for, this throws. A seam that silently drew the wrong
 * curve because a rule changed shape underneath it is the failure this is here to prevent.
 */
const envFor = (gN: number, a0: number) => {
  const env = { ...settled(), r: 1, "\\Phi": gN, "\\rho": a0 };
  if (!A0_FACT) throw new Error("the rules left no a_{0} for the curves to be drawn against");
  const got = at(A0_FACT.to, env);
  if (!(Math.abs(got - a0) <= 1e-12 * Math.max(1, Math.abs(a0))))
    throw new Error(`a_{0} came to ${got} where the panel asked for ${a0} - ` +
      `its derived form has changed and this seam no longer sets it`);
  return env;
};

/**
 * THE RATE SPACE IS MADE, as the rules give it — `a_0` in the units the lattice counts in.
 *
 * Read off the space line: the term with no rays in it, which is the waiting. `\rho` is the
 * settled density the rules fix, so nothing here is chosen.
 */
/**
 * THE VACUUM AS THE TWO LEDGERS LEAVE IT — both shares, solved in the order they close in.
 *
 * The model has two unknowns and two lines: the RAY line settles `\rho`, the share of ways
 * that are lit, and the SPACE line settles `\omega`, the share of drawn ways that lead to a
 * point that is there. `\omega` is written in `\rho`, so the ray balance already has it
 * substituted and comes out a single root; then `\omega` is read at that root. Every seam
 * below needs both, so it is done once here rather than four times badly.
 */
export const settled = (DEG = 26) => {
  const base: Record<string, number> = { D: 3, DEG, "\\nu": 1, "\\sigma": 1, "F": 0.5,
    "\\bar{c}": 1, "m'": 1, "A'": 1, "\\bar{R}'": 1, "m_{\\Sigma}": 1, "m_{\\Sigma}'": 1, "\\mathcal{D}": 1, "\\mathcal{D}'": 1, "\\beta'": 0, "\\beta\\cdot\\hat{d}": 0, "\\beta'\\cdot\\hat{d}": 0 };
  const rho = fact("\\rho_{\\infty}"), om = fact("\\omega");
  if (rho) base["\\rho"] = at(rho.to, base);
  if (om) base["\\omega"] = at(om.to, base);
  /*
   * AND THE FOLD RECORD AND WHAT HANGS OFF IT, AT A RADIUS WITH NOTHING NEAR IT.
   *
   * `n_{f}` settles to the fold balance's own level far from any body and rises toward one as
   * a body is approached, so "the settled vacuum" means reading it where the body's term has
   * died - which is what `R` far out is for. `\sigma_{tr}` and `L` are written in it, and
   * since `closing` made the scale `v/\lambda` the SCALE is written in it too: leaving them
   * unbound made `A0_LATTICE` return nothing at all, silently, for several turns.
   */
  const far = { ...base, R: 1e12, r: 1e12, "\\bar{r}": 1e12 };
  for (const n of ["n_{f}", "\\sigma_{tr}", "L"]) {
    const f = fact(n);
    if (f) far[n] = at(f.to, far);
  }
  return far;
};

export const A0_LATTICE = () => {
  const a0 = fact("a_{0}");
  return a0 ? at(a0.to, settled()) : NaN;
};

/**
 * AND THE SAME SCALE IN SI — as far as the rules reach, and no further.
 *
 * `expansionScale` closes `cH` off `G.ts`: the space line gives a rate, `MOVEMENT` gives one
 * cell a tick, and their product is an acceleration with nothing chosen in it. `H_0 = 1/t_0`
 * is the frontier's, so the only measured thing entering is the age of the universe, and it is
 * bracketed by the Hubble tension rather than fitted.
 *
 * `TURN` IS THE ONE COUNT THESE RULES DO NOT CARRY, and it is kept as its own name so that it
 * cannot be mistaken for something derived. The measured turnover sits about `2\pi` under
 * `cH_0`; the article this comes from says where that belongs - `inStep`, a rule about
 * emitters within a common phase paying an update once between them - AND SAYS PLAINLY THAT
 * NOTHING THERE DERIVES THE JOIN EITHER. `G` has splitting, meeting, streaming, arrival and
 * two source rules. Not one of them has a phase in it, so the count cannot be read off them.
 *
 * IT IS A DIVISION BY A NAMED CONSTANT, WRITTEN WHERE A READER CAN SEE IT. Everything above it
 * is closed off the rules; this is not, and pretending otherwise by folding it into a formula
 * was the assumption this file is here to keep visible.
 */
export const CH0 = (kmsMpc = H0.planck) => C_LIGHT * hz(kmsMpc);

/*
 * AND THE COUNT BETWEEN `cH_0` AND WHERE A CURVE ACTUALLY TURNS OVER IS NOT DERIVED, so it is
 * not here at all. It used to be a typed `2\pi` that every axis was built on, which put an
 * undeduced constant under every picture. The panels use the theory's own `a_{0}` instead and
 * carry the measured scale beside it, so the gap is visible rather than absorbed.
 */

/** and the same, in cells and ticks, which IS closed off the rules end to end */
export const CH_LATTICE = () => {
  const cH = fact("cH");
  return cH ? at(cH.to, { ...settled(), R: 1 }) : NaN;
};


/**
 * AND WHAT A BODY IS ACTUALLY FELT TO PULL WITH, given what arrives — the force law itself.
 *
 * `closing` derives it: the vacuum pulses every other tick because `CREATION` fires only where
 * nothing is going on, a source moves or pulses and never both, so moving shifts the phase
 * between them — and an accelerating body keeps changing that shift, so the mismatch
 * accumulates instead of averaging away. That puts `g` on both sides and makes it a root.
 *
 * IT IS READ, NOT RESTATED. The store carries `F_{g}` written in the two names that have
 * proofs of their own, `g_{N}` and `a_{0}`; binding those and evaluating is the whole of this.
 * An earlier version read `n` — the transport density — which is a different quantity, cites
 * the fold record, and came back as nothing at all because that was never bound.
 */
export const boost = (gN: number, a0: number): number => {
  /*
   * AND IT IS `F_{g}` THAT IS READ, NOT THE WRITTEN-OUT ONE.
   *
   * This preferred `F_{g} at D = 3`, which is that law with the ARRIVAL WRITTEN INTO IT - so
   * the moment that theorem started actually substituting, there was no `g_{N}` left in it to
   * bind and every call came back NaN. What `boost` is for is exactly the two-name form: it is
   * handed a Newtonian arrival, worked out by whoever asked, and returns what is felt. The
   * written-out laws are for reading; this one is for evaluating.
   */
  const F = fact("F_{g}");
  if (!F) return NaN;
  const env = { D: 3, DEG: 26, "g_{N}": gN, "a_{0}": a0 };
  const got = at(F.to, env);
  /*
   * AND A LAW THAT DOES NOT COME TO A NUMBER IS AN ERROR, NOT A BLANK PANEL.
   *
   * This returned whatever `at` gave it, so when `inThree` re-pointed its citation at a name
   * this env did not bind, every call came back `NaN` - and nothing anywhere said so. The
   * measurement wrote nine hundred NaNs to disk, the render succeeded, and the panels came out
   * with the model curve, the six discs and four labels silently missing. The seam exists to
   * catch a rule changing shape underneath it; catching it means SAYING so.
   */
  if (!Number.isFinite(got) && Number.isFinite(gN) && gN > 0 && Number.isFinite(a0)) {
    const left = unbound(simplify(evaluate(F.to, env)));
    throw new Error(
      `the law came to ${got} at g_N = ${gN}: ${F.of} leans on ` +
      `${left.length ? left.join(", ") : "something"} and this seam binds none of it. ` +
      `Its derived form has changed - bind the new name here or fix the rule.`);
  }
  return got;
};

/** the names an expression still stands on, once everything known has been filled in */
const unbound = (e: Expr): string[] => {
  const out = new Set<string>();
  const walk = (x: any) => {
    switch (x?.kind) {
      case "sym": case "field": out.add(x.name); return;
      case "add": case "mul": x.of.forEach(walk); return;
      case "pow": walk(x.base); if (typeof x.by !== "number") walk(x.by); return;
      case "grad": case "log": case "exp": walk(x.of); return;
      case "choose": walk(x.n); walk(x.k); return;
      case "gammaInc": walk(x.s); walk(x.x); return;
      case "root": walk(x.of); return;
      default: return;
    }
  };
  walk(e);
  return [...out];
};

/* —— a galaxy, at two scales ——————————————————————————————————————————————— */

/**
 * WHAT ONE SOURCE DELIVERS — its arrival, and the scale the vacuum settles to around it.
 *
 * `g_{N}` is what actually reaches the probe: rays absorbed and meetings had. `a_{0}` is the
 * rate space is made where the probe sits, which is not the vacuum's own value because a body
 * crowds the medium around it - `crowding` solves that.
 *
 * THE BOOST IS NOT APPLIED HERE, and that is the whole of the correction. `closing` derives
 * `g = g_{N}(1 + a_{0}/g)` where `g_{N}` is WHAT A BODY HAS DELIVERED TO IT - the total, from
 * everything delivering. It is a statement about the field at the probe, not about each source
 * separately. Boosting every star and adding the results applies a concave root N times over
 * and inflates the answer by roughly the root of the number of pieces the mass was cut into,
 * which measured six orders of magnitude and is an artefact of the arithmetic, not the rules.
 */
const oneCache = new Map<string, { gN: number; a0: number }>();
export const deliveredBy = (sep: number, m: number, A: number) => {
  const key = sep.toPrecision(3) + "|" + m + "|" + A;
  const hit = oneCache.get(key);
  if (hit) return hit;
  const e: Record<string, number> = {
    D: 3, DEG: 26, "\\bar{c}": 1, "\\Sigma_{0}": 1, "\\beta": 0, "m'": 1, "A'": 1, "m_{\\Sigma}": 1, "m_{\\Sigma}'": 1, "\\beta'": 0, "\\beta\\cdot\\hat{d}": 0, "\\beta'\\cdot\\hat{d}": 0,
    R: sep, r: sep, "\\bar{r}": sep, A, m, "\\bar{R}": m / A,
  };
  for (const rate of ["\\nu", "\\sigma", "F"]) {
    const g = fact(rate); if (g) e[rate] = at(g.to, e);
  }
  const rho = fact("\\rho_{\\infty}"); if (rho) e["\\rho"] = at(rho.to, e);
  const step = (name: string, into = name) => {
    const g = fact(name); if (g) e[into] = at(g.to, e);
  };
  step("n_{f}"); step("\\sigma_{tr}"); step("L");
  step("what a body puts into the medium", "\\delta");
  step("\\rho at R", "\\rho");
  step("n_{f}"); step("\\sigma_{tr}"); step("L");
  step("g_{N}");
  /*
   * AND THE SCALE IS THE AMBIENT ONE, which is what `closing` derives.
   *
   * The mismatch accumulates over a mean free path - how far a carrier gets THROUGH THE MEDIUM
   * IT CROSSES - so the scale belongs to the vacuum a ray traverses, not to the population at
   * the point it arrives at. I had it reading the local population, which makes the turnover a
   * property of whatever happens to be nearby; the coherence argument says otherwise, and a
   * turnover that is the same everywhere is what a tight relation means.
   */
  step("a_{0}");
  const out = { gN: e["g_{N}"], a0: e["a_{0}"] };
  oneCache.set(key, out);
  return out;
};

/** and what a probe FEELS, given everything that reached it - the law, applied once */
export const feltFrom = (gN: number, a0: number) => ({ gN, g: boost(gN, a0) });

/**
 * THE DISC'S OWN DENSITY — an exponential disc, which is the shape a galaxy has.
 *
 * ITS SCALE LENGTH IS A PARAMETER AND NOT A CONSTANT, because it is one of the things a source
 * is allowed to define and real galaxies range over decades in it at the same mass. Held fixed
 * it makes every galaxy the same shape, and a region swept that way is a slice through the
 * configuration space rather than the space.
 */
export const RD = 30;                              // a scale length to sweep AROUND, not a law
export const surface = (r: number, M: number, rd = RD) =>
  M * Math.exp(-r / rd) / (2 * Math.PI * rd * rd);

/**
 * ONE SOURCE: the whole galaxy at once, presenting its own face as its skin.
 */
export const asPointParts = (R: number, M: number, rd = RD) => {
  const one = deliveredBy(R, M, Math.PI * rd * rd);
  return feltFrom(one.gN, one.a0);
};

/**
 * MANY SOURCES: every star its own, laid down where the density says they are.
 *
 * THE ARRIVALS ADD, because an arrival is a delivery and deliveries add - that is the same
 * sentence `assembling` is built on. The scale the vacuum settles to is read from the crowding
 * the whole of the mass causes, and the law is applied ONCE to the total.
 *
 * SO WHAT THE TWO MODELS DIFFER BY IS GEOMETRY, and only geometry: a disc's mass spread over
 * its own radii delivers differently from the same mass gathered at its centre. That is a real
 * difference and it is what this pair of pictures is for.
 */
export const asStarsParts = (R: number, M: number, rd = RD, mStar = 1, aStar = 1) => {
  const rings = 16, spokes = 24, rmax = 8 * rd;
  let gN = 0;
  for (let i = 0; i < rings; i++) {
    const r = rmax * (i + 0.5) / rings, dr = rmax / rings;
    const dm = 2 * Math.PI * r * dr * surface(r, M, rd);
    if (!(dm > 0)) continue;
    for (let k = 0; k < spokes; k++) {
      const th = 2 * Math.PI * (k + 0.5) / spokes;
      const dx = R - r * Math.cos(th), dy = -r * Math.sin(th);
      const sep = Math.hypot(dx, dy);
      if (sep < 1) continue;
      const one = deliveredBy(sep, mStar, aStar);
      if (!Number.isFinite(one.gN)) continue;
      gN += (dm / mStar / spokes) * one.gN * (dx / sep);
    }
  }
  /* and the scale where the probe sits, which the whole of the mass sets */
  const a0 = deliveredBy(R, M, Math.PI * rd * rd).a0;
  return feltFrom(gN, a0);
};

/** and what a curve is: the speed a circle at R needs against what pulls it in */
export const speed = (g: number, R: number) => (g > 0 ? Math.sqrt(R * g) : NaN);
