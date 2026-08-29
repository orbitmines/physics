/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * vacuum.population, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * \rho^{fine}/\rho^{coarse} = 1.015
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

export const THEOREM = "vacuum.population";
export const ASKS = "the model is meant to be continuous, and it is integrated on a grid. Is the grid in the answer?";
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
    "text": "\\rho"
  },
  {
    "kind": "sup",
    "of": [
      {
        "kind": "text",
        "text": "fine"
      }
    ]
  },
  {
    "kind": "text",
    "text": "/\\rho"
  },
  {
    "kind": "sup",
    "of": [
      {
        "kind": "text",
        "text": "coarse"
      }
    ]
  },
  {
    "kind": "text",
    "text": " = 1.015"
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
        "text": "\\rho"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "fine"
          }
        ]
      },
      {
        "kind": "text",
        "text": "/\\rho"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "coarse"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = 1.015"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "and the same doubling with the WEIGHT taken down by the cell volume, so each cell holds the same number of particles: 1.015. The positions were continuous throughout and the grid carries nothing but the moments, so once it is sampled well enough it is not in the answer - which is what makes this a continuum model with a grid in its implementation rather than a lattice model"
      }
    ],
    "measured": [
      {
        "name": "\\rho^{fine}/\\rho^{coarse}",
        "value": 1.014635316698548,
        "note": "and the same doubling with the WEIGHT taken down by the cell volume, so each cell holds the same number of particles: 1.015. The positions were continuous throughout and the grid carries nothing but the moments, so once it is sampled well enough it is not in the answer - which is what makes this a continuum model with a grid in its implementation rather than a lattice model"
      }
    ]
  }
];
