/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * vacuum.suppression, for G on fcc-12
 * (D 3, DEG 12), box 21, 20 ticks.
 *
 * deficit = A'
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

export const THEOREM = "vacuum.suppression";
export const ASKS = "a body's cells belong to a source, so the split does not fire on them. What does that do to the expansion around it - and is that gravity?";
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
    "text": "deficit = A'"
  }
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "definition",
    "via": "vacuum.suppression",
    "line": [
      {
        "kind": "text",
        "text": "deficit = A' · expansion"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "each blocked cell is one point that would have expanded and did not, so the shortfall is how many are blocked times how fast each would have grown. THIS IS GRAVITY IN THIS MODEL: not a pull between bodies but an expansion that did not happen, spreading outward from whatever was in the way. A second body is pushed toward it because fewer rays arrive from that direction than from the far side"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "vacuum.suppression",
    "line": [
      {
        "kind": "text",
        "text": "A' = A'"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "the split fails to fire at every cell the body owns, so the suppression itself goes as its volume - but a shortfall deep inside is filled in by its neighbours before it gets out. What reaches the medium beyond has to cross the boundary, and how many ways there are through it is the body's area. So what a distant body feels is limited by the surface, and a bigger surface pulls harder"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "substituting",
    "line": [
      {
        "kind": "text",
        "text": "deficit = A'·expansion"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "deficit = A'·expansion"
        }
      ],
      [
        {
          "kind": "text",
          "text": "A' = A'"
        }
      ],
      [
        {
          "kind": "text",
          "text": "deficit = A'·expansion"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "blocked is not a primitive of this theory - it is A', so it stands in for itself here and the result is multiplied out"
      }
    ],
    "measured": []
  },
  {
    "kind": "cited",
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
        "text": "established earlier by vacuum.expansion, on this same theory and lattice - the working is there rather than repeated here"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "a number is an expression",
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
        "text": "expansion is 1, so it can stand in an expression as that"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "substituting",
    "line": [
      {
        "kind": "text",
        "text": "deficit = A'"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "deficit = A'·expansion"
        }
      ],
      [
        {
          "kind": "text",
          "text": "expansion = 1"
        }
      ],
      [
        {
          "kind": "text",
          "text": "deficit = A'"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "expansion is not a primitive of this theory - it is 1, so it stands in for itself here and the result is multiplied out"
      }
    ],
    "measured": []
  }
];
