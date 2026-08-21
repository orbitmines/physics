/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * lattice.turn, for G on fcc-12
 * (D 3, DEG 12), box 21, 20 ticks.
 *
 * CYCLE = 6
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

export const THEOREM = "lattice.turn";
export const ASKS = "DEG and SHEET grow with the dimension. Why does the length of a turn not?";
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
    "kind": "count",
    "of": [
      {
        "kind": "text",
        "text": "CYCLE"
      }
    ]
  },
  {
    "kind": "text",
    "text": " = 6"
  }
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "premise",
    "via": "counts/what-the-tiling-fixes",
    "line": [
      {
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "CYCLE"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = 6"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "how many steps go round the ring of a turn on fcc-12. A count of the tiling, taken off the geometry itself with nothing run and nothing fitted"
      }
    ],
    "measured": [
      {
        "name": "CYCLE",
        "value": 6,
        "note": "how many steps go round the ring of a turn on fcc-12"
      }
    ]
  }
];
