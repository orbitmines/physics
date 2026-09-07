/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * space.recession, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * recession ∝ separation
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

export const THEOREM = "space.recession";
export const ASKS = "the vacuum makes space wherever it is idle. What does that do to two things sitting some distance apart?";
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
    "text": "recession ∝ separation"
  }
];
export const STANDING = false;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "premise",
    "via": "expanding/why-far-things-recede-faster",
    "line": [
      {
        "kind": "text",
        "text": "recession ∝ separation"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "space is made by idle points splitting, and the only points that can add to the distance between two markers are the ones BETWEEN them - each contributing at most one step when it splits. So how fast they come apart is how many such points there are, times whatever rate each splits at; and the count is proportional to the separation. The rate per point is the vacuum's own business and is not claimed here - what is claimed is that it is the SAME rate everywhere, so the recession goes as the separation with one constant for the whole medium. That is Hubble's law, and it is a count of what lies between rather than a statement about the universe"
      }
    ],
    "measured": [
      {
        "name": "idle points between",
        "value": 1,
        "note": "points lying between two markers at separations 2, 3, 4, 5, 6 on fcc-12: 1, 2, 3, 4, 5. Differences 1, 1, 1, 1, which are constant at 1, so the count is linear in the separation. Walked over the lattice's own positions, with nothing ticked"
      }
    ]
  }
];
