/**
 * THE WORKS A PROOF LEANS ON, and where a reader goes to check it.
 *
 * A derivation that says "by Ehrhart's theorem" and stops is asking to be taken on
 * trust. The step is only checkable if the reader can find the theorem, so a rule that
 * cites one names it here and the citation is rendered as a link rather than as a
 * sentence. These are the borrowed steps - everything else in a proof is either measured
 * on this repository's own lattices or is arithmetic.
 */
export type Reference = {
  key: string;
  /** how it appears inline, in brackets */
  short: string;
  title: string;
  authors: string;
  year: number;
  /** what it says, in the one sentence the proof actually uses */
  says: string;
  link?: string;
};

export const REFERENCES: Record<string, Reference> = {
  ehrhart: {
    key: "ehrhart",
    short: "Ehrhart 1962",
    title: "Sur les polyèdres rationnels homothétiques à n dimensions",
    authors: "Eugène Ehrhart",
    year: 1962,
    says: "the number of lattice points in the k-fold dilate of a lattice polytope P is " +
      "a polynomial in k of degree equal to the dimension of P, whose leading " +
      "coefficient is the volume of P",
    link: "https://en.wikipedia.org/wiki/Ehrhart_polynomial",
  },
  binomial: {
    key: "binomial",
    short: "the binomial theorem",
    title: "the binomial theorem",
    authors: "-",
    year: 0,
    says: "(x - 1)^n = x^n - n·x^(n-1) + ... , so subtracting a degree-n polynomial " +
      "from its own shift by one cancels the leading term and leaves degree n-1",
  },
};
