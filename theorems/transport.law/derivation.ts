/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * transport.law, for G on any
 * (D null, DEG null), box null, null ticks.
 *
 * no law follows from what the probes found
 *
 * The notation is parsed into pieces rather than into markup for any one framework:
 * map each piece's `kind` onto whatever you draw with. See `rendering/Notation.ts`.
 */
import type { Piece } from "@orbitmines/physics";

export type Step = {
  kind: "premise" | "definition" | "derived";
  via: string;
  line: Piece[];
  working: Piece[][];
  because: Piece[];
  measured: { name: string; value: number; err?: number; note?: string }[];
};

export const THEOREM = "transport.law";
export const ASKS = "and where the medium is thin, so a carrier spends its ticks making room - what does the same conservation give then?";
export const UNDER = {
  "theory": "G",
  "geometry": "any",
  "D": null,
  "DEG": null,
  "N": null,
  "T": null,
  "seeds": [],
  "regime": null,
  "regimeSays": null
};
export const CONCLUDED: Piece[] = [];
export const STANDING = false;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [];
