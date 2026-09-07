/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * gravity.spacetime, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * A·B = B·\paren{1 - 2·u}
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

export const THEOREM = "gravity.spacetime";
export const ASKS = "the lean and the stretch are two readings of one count. Put together, what metric do they make - and does it move a perihelion the way general relativity does?";
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
    "text": "A·B = B·"
  },
  {
    "kind": "paren",
    "of": [
      {
        "kind": "text",
        "text": "1 - 2·u"
      }
    ]
  }
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "definition",
    "via": "gravity.spacetime",
    "line": [
      {
        "kind": "text",
        "text": "A·B = A · B"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "the metric is ds² = -A dt² + B dr², so what there is to ask about the two together is their product. Multiplied out it is (1 - 2u)(1 + 2u) = 1 - 4u², which is one to this order - the two readings are INVERSES. That is what Schwarzschild has in isotropic form, and it is not put in here: it follows from both being readings of one count, so what the count does to the ways through a point it does inversely to the ways round it"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "gravity.spacetime",
    "line": [
      {
        "kind": "text",
        "text": "A = 1 - 2u"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "the lean makes a clock run slow where the count is high - that is the first reading, the one gravity.law takes, and in the potential it is 1 - 2u. The factor of two is the normalisation u carries, not a step"
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
        "text": "A·B = B - 2·B·u"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "A·B = A·B"
        }
      ],
      [
        {
          "kind": "text",
          "text": "A = 1 - 2·u"
        }
      ],
      [
        {
          "kind": "text",
          "text": "A·B = B - 2·B·u"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "A is not a primitive of this theory - it is 1 - 2·u, so it stands in for itself here and the result is multiplied out"
      }
    ],
    "measured": []
  }
];
