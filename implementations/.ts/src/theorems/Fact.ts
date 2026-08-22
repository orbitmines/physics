/**
 * WHAT CAN BE KNOWN ABOUT A QUANTITY — the whole vocabulary, and it is five words long.
 *
 * A prover is only as general as the things it is allowed to say, and the temptation
 * is to let it say anything. This says five: how a quantity scales, that it is
 * conserved, that it is spread evenly, that it is the product of others, and that it is
 * not zero. Every premise the probes come back with is one of those, and every
 * conclusion is too — the falloff rate is a `scales`, and the reason there is a force
 * at all is a `positive`.
 *
 * AND THEY CARRY THEIR ASYMPTOTIC SENSE. A `scales` fact is a statement about a LEADING
 * ORDER — `ball(r) ∝ ρ·r^D` is true up to a correction that grows more slowly, and
 * saying so is the difference between a derivation and a curve fit. The correction is
 * carried in `error` and the limit it is a limit in is carried in `limit`, so a
 * conclusion can be read off knowing exactly what was neglected and where it is safe to
 * neglect it. A fact with no `limit` is exact at every r, which is what an exhaustive
 * count of a finite set is.
 *
 * THE FIVE ARE NOT A GUESS AT WHAT PHYSICS NEEDS. They are what a counting argument
 * needs: something is made, none of it is lost, it goes everywhere alike, and the room
 * it has to be in grows. Take away `conserved` and there is no reason the total at
 * radius r is the total at radius 2r; take away `isotropic` and there is no reason to
 * divide by the whole shell rather than part of it; take away `positive` and a theory
 * whose vacuum destroys nothing proves the same theorem about a force that is
 * identically zero. Each of the five is load-bearing, and `G^CONSERVING` is the proof
 * of it — see `probes/shadow.ts`.
 */
import { Rat, rshow, Scaling, skey, sshow } from "./Algebra.ts";
import { Expr, key as ekey, show as eshow } from "./Expr.ts";

export type Fact =
  /** `of` is proportional to this product of others — the only quantitative one */
  | {
      kind: "scales"; of: string; by: Scaling;
      /** what was dropped: the next-order term, if this is a leading-order statement */
      error?: Scaling;
      /** the limit that leading order is leading in — absent means exact at every r */
      limit?: string;
    }
  /** as much of `of` crosses a far shell per tick as crosses a near one */
  | { kind: "conserved"; of: string }
  /** what crosses a shell is shared alike by every site on it */
  | { kind: "isotropic"; of: string }
  /** `of` is what you get by multiplying these together, whatever they turn out to be */
  | { kind: "product"; of: string; from: string[] }
  /**
   * `of` is spread at a constant amount per unit of room, everywhere — exact, and
   * the premise the volume argument needs. A lattice has this by construction: it is
   * one site per fundamental cell, so the density is one over that cell's volume and
   * is a number, not a fit.
   */
  | { kind: "uniform"; of: string; per: string }
  /** `of` is the `by`-fold dilate of a fixed lattice polytope — what Ehrhart needs */
  | { kind: "dilate"; of: string; by: string }
  /**
   * `of` does not vary from place to place - a count of the lattice, or a speed limit.
   *
   * NEEDED BECAUSE BALANCING WOULD OTHERWISE SOLVE FOR IT. A conserved product pins its
   * factors to one another, and the algebra is perfectly happy to rearrange
   * `shell·n·v = const` into a law for the shell's own coefficient - which is true as
   * arithmetic and nonsense as physics, because that coefficient is a property of the
   * tiling and cannot depend on where you stand. Marking it says which symbols are
   * allowed to move.
   */
  /**
   * `of` IS this number, exactly - not proportional to something, equal to it.
   *
   * THE SECOND HALF OF WHAT THIS FOLDER CAN SAY. Everything above is a scaling: how one
   * quantity moves when another does, with every constant deliberately dropped. That is
   * the right shape for a falloff and the wrong shape for BIAS, which is 1/26 on
   * cubic-26 and 1/12 on fcc-12 - a ratio of two counts of the tiling, with nothing
   * approximate about it and nothing left to drop. A theorem whose answer IS a number
   * needs somewhere to put it.
   *
   * EXACT, as a rational, because these come from counting exits and enumerating what a
   * rule does: 1/3 is an answer and 0.3333 is a rounding of one.
   */
  | { kind: "value"; of: string; equals: Rat; unit?: string }
  /** `of` is `over` divided by `under` - the shape almost every lattice constant has */
  | { kind: "quotient"; of: string; over: string; under: string }
  /**
   * `of` IS this expression - a sum, not a proportionality and not a bare number.
   *
   * WHAT THE MONOMIALS COULD NOT SAY. The lean an annihilation buys is `1 + n` ways where
   * there was one; the total is `DEG + n`, not DEG; a moving source's branches carry
   * `1 - v` and `1 + v`. A `scales` fact throws the coefficients away, which is right for
   * a falloff and fatal here, because in every one of those lines the whole content is
   * the constant sitting beside the variable.
   */
  | { kind: "equals"; of: string; to: Expr }
  /** `of` is `base` raised to `to` - kept as a fact because a rational power of a sum
   *  is not a sum, and only the binomial rule knows how to make one */
  | {
      kind: "raised"; of: string; base: string; to: Rat;
      /**
       * WHETHER TO EXPAND IT AS A SERIES, and the default is NOT TO.
       *
       * A power of a sum is only a sum again when the exponent is a whole positive
       * number. Every other case - a half, a minus one - is an infinite series, and a
       * prover that expands one has to stop somewhere and then carries a truncation
       * through everything downstream. Multiply two such series and the terms past the
       * cut are not merely imprecise, they are wrong: the cross terms that belonged there
       * were discarded before the multiplication. Measured on this folder's own
       * relativistic law, the b^{3} coefficient came out with the WRONG SIGN.
       *
       * KEPT CLOSED IT IS EXACT. `gamma` is `(1 - b^{2})^{-1/2}` and stays that, which
       * this algebra can carry as a monomial in a named base without approximating
       * anything. The answers then read as powers of gamma rather than as polynomials
       * that are only true near zero - which is both exact and easier to recognise.
       *
       * Expansion is still available where a series is what is wanted, and it is then
       * correct to whatever order the premise names.
       */
      expand?: boolean;
    }
  /** `of` is at most `at most` - a ceiling, which some answers are */
  | { kind: "bound"; of: string; atMost: string }
  /**
   * `of` IS THE NAME OF A FACTOR WORTH SEEING - do not multiply it out.
   *
   * `met(R) = X·(1 + Y)` says something that `met(R) = 2/(c̄R²) + 2ln(R/c̄)/(c̄R³)` does
   * not, even though they are the same quantity: it says there is a long-range law and a
   * correction to it, and that the correction is the part which dies away. Multiplied out
   * that structure is gone and a reader has to reconstruct it. So a factor that was given
   * a name because the name is the point keeps it, and its own value is derived on a line
   * of its own where it can be read.
   */
  | { kind: "named"; of: string }
  /**
   * `of` is much smaller than one, so powers of it beyond `order` may be dropped.
   *
   * THE ORDER IS PART OF THE CLAIM, not a setting. Most of these derivations want the
   * first correction and nothing else, and dropping the square is exactly right there.
   * Relativity is the case where it is exactly wrong: the two retarded branches differ at
   * FIRST order and cancel when averaged, so a proof that truncated at first order would
   * conclude that travel time does nothing at all. What survives is the second-order
   * term, and it is the whole of the effect.
   */
  | { kind: "small"; of: string; order?: number }
  /**
   * `of` is `term` integrated over `in`, between two limits.
   *
   * Kept as a fact rather than worked out where it is written, so the integral appears in
   * the derivation as a line of its own with the region it is over stated - which is what
   * makes a piecewise one checkable, since the whole difficulty in those is where the
   * pieces were cut.
   */
  | { kind: "integral"; of: string; term: string; in: string; from: Expr; to: Expr }
  /** `of` is the mean of `term` as `over` ranges uniformly across `across` */
  | { kind: "mean"; of: string; term: string; over: string; across: string }
  /** `of` is what you get by adding `term` up over every value of `over` */
  | { kind: "sum"; of: string; over: string; term: string }
  /** that sum does not settle on a number, however far it is taken */
  | { kind: "diverges"; of: string; in: string }
  | { kind: "constant"; of: string }
  /** `of` travels through the medium rather than acting at a distance */
  | { kind: "carried"; of: string; by: string }
  /** `of` is the rate at which `from` grows with `in` — the shell against the ball */
  | { kind: "rate"; of: string; from: string; in: string }
  /** there is some of it — the premise a null theory fails, and the one that makes a
   *  proportionality a claim about something rather than about nothing */
  | { kind: "positive"; of: string };

export const key = (f: Fact): string =>
  f.kind === "scales" ? `scales(${f.of})=${skey(f.by)}`
    : f.kind === "uniform" ? `uniform(${f.of})/${f.per}`
    : f.kind === "dilate" ? `dilate(${f.of})by(${f.by})`
    : f.kind === "rate" ? `rate(${f.of})=d(${f.from})/d${f.in}`
    : f.kind === "carried" ? `carried(${f.of})by(${f.by})`
    : f.kind === "constant" ? `constant(${f.of})`
    : f.kind === "value" ? `value(${f.of})`
    : f.kind === "quotient" ? `quotient(${f.of})=${f.over}/${f.under}`
    : f.kind === "equals" ? `equals(${f.of})=${ekey(f.to)}`
    : f.kind === "small" ? `small(${f.of})`
    : f.kind === "named" ? `named(${f.of})`
    : f.kind === "bound" ? `bound(${f.of})<=${f.atMost}`
    : f.kind === "raised" ? `raised(${f.of})=${f.base}^${rshow(f.to)}`
    : f.kind === "integral" ? `integral(${f.of})=${f.term}d${f.in}[${ekey(f.from)},${ekey(f.to)}]`
    : f.kind === "mean" ? `mean(${f.of})=${f.term}over${f.over}`
    : f.kind === "sum" ? `sum(${f.of})=${f.term}over${f.over}`
    : f.kind === "diverges" ? `diverges(${f.of})in(${f.in})`
    : f.kind === "product" ? `product(${f.of})=${[...f.from].sort().join("·")}`
      : `${f.kind}(${f.of})`;

/** the fact as a sentence, which is what a derivation step is made of */
export const says = (f: Fact, g: Glossary = {}): string => {
  const n = (q: string) => g[q]?.symbol ?? q;
  switch (f.kind) {
    case "scales": return `${n(f.of)} ∝ ${sshow(f.by)}` +
      (f.error ? `  + O(${sshow(f.error)})` : "");
    case "uniform": return `${n(f.of)} is the same per ${n(f.per)} everywhere`;
    case "dilate": return `${n(f.of)} is the ${n(f.by)}-fold dilate of a fixed polytope`;
    case "rate": return `${n(f.of)} = d(${n(f.from)}) / d${n(f.in)}`;
    case "carried": return `${n(f.of)} travels through ${n(f.by)}`;
    case "constant": return `${n(f.of)} is the same everywhere`;
    case "value": return `${n(f.of)} = ${rshow(f.equals)}${f.unit ? ` ${f.unit}` : ""}`;
    case "quotient": return `${n(f.of)} = \\frac{${n(f.over)}}{${n(f.under)}}`;
    case "equals": return `${n(f.of)} = ${eshow(f.to)}`;
    case "small": return `${n(f.of)} is small`;
    case "named": return `${n(f.of)} is worth naming`;
    case "bound": return `${n(f.of)} is at most ${n(f.atMost)}`;
    case "raised": return `${n(f.of)} = ${n(f.base)}^${rshow(f.to)}`;
    /* set as mathematics, not described in words - see rendering/Notation.ts */
    case "integral": return `${n(f.of)} = \\int_{${eshow(f.from)}}^{${eshow(f.to)}} ` +
      `${n(f.term)} d${f.in}`;
    case "mean": return `${n(f.of)} = <${n(f.term)}>`;
    case "sum": return `${n(f.of)} = \\sum_{${n(f.over)}} ${n(f.term)}`;
    case "diverges": return `${n(f.of)} → ∞`;
    case "conserved": return `${n(f.of)} is conserved in flight`;
    case "isotropic": return `${n(f.of)} goes every way alike`;
    case "product": return `${n(f.of)} = ${f.from.map(n).join(" · ")}`;
    case "positive": return `${n(f.of)} > 0`;
  }
};

/** what a quantity is called on the page, and what it is */
export type Named = { symbol: string; says: string };
export type Glossary = Record<string, Named>;
