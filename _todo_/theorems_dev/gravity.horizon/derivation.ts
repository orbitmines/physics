/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * gravity.horizon, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * what gets out = 0
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

export const THEOREM = "gravity.horizon";
export const ASKS = "the shortfall around a body grows without limit as you approach it, and a point has only so many exits to be missing. What happens where they meet?";
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
    "text": "what gets out = 0"
  }
];
export const STANDING = false;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "premise",
    "via": "saturation/what-a-point-cannot-lose-more-than",
    "line": [
      {
        "kind": "text",
        "text": "what gets out = 0"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "at the ceiling every one of a point's 12 exits is dark. Leaving is what an exit is, so nothing leaves such a point by any route - not a weakened signal, none. That is a horizon in the only sense this model has one, and it is not put in anywhere: it is where a law that has to keep growing meets a count that cannot"
      }
    ],
    "measured": [
      {
        "name": "DEG",
        "value": 12,
        "note": "the ways out of a point on fcc-12, counted. A shortfall at a point is exits that are dark, and there are 12 of them, so the shortfall at one point can be at most 12. Read off the tiling with nothing ticked, and there is no way for it to come out otherwise"
      }
    ]
  }
];
