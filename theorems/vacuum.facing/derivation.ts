/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * vacuum.facing, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * F=(1-\hat{d}·\hat{j})/2 = 0.508
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

export const THEOREM = "vacuum.facing";
export const ASKS = "ANNIHILATION is quantified over a ray and something FACING it. Against what, exactly - the opposing density where it stands, or the part of it that is coming the other way?";
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
    "text": "F=(1-\\hat{d}·\\hat{j})/2 = 0.508"
  }
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "premise",
    "via": "population/what-the-rules-do-as-a-crowd",
    "line": [
      {
        "kind": "text",
        "text": "F=(1-\\hat{d}·\\hat{j})/2 = 0.508"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "a meeting is with what is coming the OTHER way, so the rate carries (1 - d^·j^)/2 against the opposing polarity's mean heading. In a vacuum with no bias that heading averages to nothing and the factor comes out at a HALF - which is not a coefficient anybody chose, it is what an isotropic crowd does"
      }
    ],
    "measured": [
      {
        "name": "\\langle F\\rangle",
        "value": 0.5079113348612256,
        "note": "a meeting is with what is coming the OTHER way, so the rate carries (1 - d^·j^)/2 against the opposing polarity's mean heading. In a vacuum with no bias that heading averages to nothing and the factor comes out at a HALF - which is not a coefficient anybody chose, it is what an isotropic crowd does"
      }
    ]
  }
];
