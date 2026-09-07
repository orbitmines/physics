/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * gravity.identical, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * share* = 1
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

export const THEOREM = "gravity.identical";
export const ASKS = "two of the SAME thing, closer than a wavelength. Does the averaging that gave one half still apply to them?";
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
export const CONCLUDED: Piece[] = [
  {
    "kind": "text",
    "text": "share* = 1"
  }
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "definition",
    "via": "gravity.identical",
    "line": [
      {
        "kind": "text",
        "text": "share* = 1"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "the half in share.coherence came from averaging |ψ|/π over a phase difference that was anybody's guess. Two of the same thing pulse at the same rate, so their phase difference is not anybody's guess - there is nothing left to average, and what would have been averaged down is not"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "which is a number",
    "line": [
      {
        "kind": "text",
        "text": "share* = 1"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "1 has nothing left in it that varies, so it is 1 exactly"
      }
    ],
    "measured": []
  }
];
