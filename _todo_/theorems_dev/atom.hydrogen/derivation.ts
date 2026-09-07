/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * atom.hydrogen, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * no law follows from what the probes found
 *
 * The notation is parsed into pieces rather than into markup for any one framework:
 * map each piece's `kind` onto whatever you draw with. See `rendering/Notation.ts`.
 */
import type { Piece } from "../../implementations/.ts/src/rendering/Notation.ts";

export type Step = {
  kind: "premise" | "definition" | "derived";
  via: string;
  line: Piece[];
  working: Piece[][];
  because: Piece[];
  measured: { name: string; value: number; err?: number; note?: string }[];
};

export const THEOREM = "atom.hydrogen";
export const ASKS = "one body biased one way, one the other. The sign law says what they pull with and the counting condition says what can stand in it - so how far out are the shells, and what does it take to get off one?";
export const UNDER = {
  "theory": "G",
  "geometry": "fcc-12",
  "D": 3,
  "DEG": 12,
  "N": 21,
  "T": 120,
  "seeds": [
    1
  ],
  "regime": null,
  "regimeSays": null
};
export const CONCLUDED: Piece[] = [];
export const STANDING = false;
export const MISSING = [
  "p^{2}r is conserved in flight",
  "E·r is conserved in flight",
  "E_{n} > 0"
];
export const CITES = [];

export const STEPS: Step[] = [];
