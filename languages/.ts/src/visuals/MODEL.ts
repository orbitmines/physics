/**
 * THE CURVES, DRAWN BY THE RULES — the seam between the prover and the panels.
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
import { continuum } from "../lib/Continuum.ts";
import { prove } from "../lib/Prove.ts";
import { gammaUpper, type Expr } from "../lib/Algebra.ts";
import { G } from "../theories/G/G.ts";
import { C_LIGHT, H0, hz } from "../lib/Transport.ts";

/** what the theory calls itself - so a panel names it rather than describing it */
export const THEORY: string = (G as any).name ?? "G";

const store = prove(continuum(G as any), (G as any).rules).store;
const fact = (of: string) => store.all("is").find(f => f.of === of);

/** a derived expression as a number, with every name it still mentions supplied */
const at = (e: Expr, env: Record<string, number>): number => {
  const go = (x: any): number => {
    switch (x.kind) {
      case "num": return x.n;
      case "sym": case "field":
        if (!(x.name in env)) throw new Error(`the model still mentions ${x.name}`);
        return env[x.name];
      case "add": return x.of.reduce((a: number, y: any) => a + go(y), 0);
      case "mul": return x.of.reduce((a: number, y: any) => a * go(y), 1);
      case "pow": return Math.pow(go(x.base), typeof x.by === "number" ? x.by : go(x.by));
      case "log": return Math.log(go(x.of));
      case "exp": return Math.exp(go(x.of));
      case "gammaInc": return gammaUpper(go(x.s), go(x.x));
      case "choose": {
        const n = go(x.n), k = go(x.k);
        let r = 1; for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1);
        return r;
      }
      default: throw new Error(`no number for ${x.kind}`);
    }
  };
  return go(e);
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
  const env = { D: 3, r: 1, "\\Phi": gN, "\\sigma": 1, "\\rho": a0, "\\nu": 1, F: 0.5, DEG: 26 };
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
export const A0_LATTICE = (() => {
  const a0 = fact("a_{0}"), rho = fact("\\rho_{\\infty}");
  if (!a0 || !rho) return NaN;
  const base = { D: 3, DEG: 26, "\\nu": 1, "\\sigma": 1, "F": 0.5 };
  return at(a0.to, { ...base, "\\rho": at(rho.to, base) });
})();

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

/** the count `G` has not got - see above. Not derived, and not to be quietly folded away. */
export const TURN = 2 * Math.PI;

export const A0 = (kmsMpc = H0.planck) => CH0(kmsMpc) / TURN;

/** and the same, in cells and ticks, which IS closed off the rules end to end */
export const CH_LATTICE = (() => {
  const cH = fact("cH"), rho = fact("\\rho_{\\infty}");
  if (!cH || !rho) return NaN;
  const base = { D: 3, DEG: 26, "\\nu": 1, "\\sigma": 1, "F": 0.5, R: 1 };
  return at(cH.to, { ...base, "\\rho": at(rho.to, base) });
})();


/**
 * AND THE BOOST, `g/g_N`, AS A FUNCTION OF HOW DEEP THE FIELD IS — which is the one number
 * every one of these panels is a picture of.
 *
 * Taken from the conservation `spreading` solves, in the form it solves it: what is at a site
 * is the flux over the room over the speed, and the speed is `n/(n + a_0)`, so
 *
 *     n = \frac{1}{2}\paren{\Phi/shell + \sqrt{(\Phi/shell)^{2} + 4(\Phi/shell)a_{0}}}
 *
 * with `\Phi/shell` the Newtonian reading. Dense, that is `g_N`; thin, `\sqrt{g_N a_0}`.
 */
export const boost = (gN: number, a0: number): number => {
  if (!N) throw new Error("the rules left no n for the curves to be drawn from");
  return at(N.to, envFor(gN, a0));
};
