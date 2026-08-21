/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * vacuum.expansion, for G on fcc-12
 * (D 3, DEG 12), box 21, 20 ticks.
 *
 * expansion = 1
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

export const THEOREM = "vacuum.expansion";
export const ASKS = "the vacuum splits every neutral point every tick. How fast does empty space actually grow, in this theory?";
export const UNDER = {
  "theory": "G",
  "geometry": "fcc-12",
  "D": 3,
  "DEG": 12,
  "N": 21,
  "T": 20,
  "seeds": [
    1
  ],
  "regime": null,
  "regimeSays": null
};
export const CONCLUDED: Piece[] = [
  {
    "kind": "text",
    "text": "expansion = 1"
  }
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "definition",
    "via": "vacuum.expansion",
    "line": [
      {
        "kind": "text",
        "text": "expansion = 1"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "the split fires on a point because the point is NEUTRAL, and it does not ask what this theory's rays carry - so every neutral point makes one point every tick, in every theory here. That is the rate space is made at, and it is the same number whatever is running"
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
        "text": "expansion = 1"
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
