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
import { Scaling, skey, sshow } from "./Algebra.ts";

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
    case "conserved": return `${n(f.of)} is conserved in flight`;
    case "isotropic": return `${n(f.of)} goes every way alike`;
    case "product": return `${n(f.of)} = ${f.from.map(n).join(" · ")}`;
    case "positive": return `${n(f.of)} > 0`;
  }
};

/** what a quantity is called on the page, and what it is */
export type Named = { symbol: string; says: string };
export type Glossary = Record<string, Named>;
