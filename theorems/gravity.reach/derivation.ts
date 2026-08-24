/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * gravity.reach, for G on fcc-12
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

export const THEOREM = "gravity.reach";
export const ASKS = "every source in the universe is putting charges everywhere. Adding up what all of them put on you, is there a total?";
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
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [];
