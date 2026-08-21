/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * gravity.spacetime, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * A·B = A · B = 1
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
    "text": "A·B = A · B = 1"
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
  },
  {
    "kind": "cited",
    "via": "gravity.metric",
    "line": [
      {
        "kind": "text",
        "text": "B = 1 + 2u"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "established earlier by gravity.metric, on this same theory and lattice - the working is there rather than repeated here"
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
        "text": "A·B = 1 - 4·u"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "2"
          }
        ]
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "A·B = B - 2·B·u"
        }
      ],
      [
        {
          "kind": "text",
          "text": "B = 1 + 2·u"
        }
      ],
      [
        {
          "kind": "text",
          "text": "A·B = 1 - 4·u"
        },
        {
          "kind": "sup",
          "of": [
            {
              "kind": "text",
              "text": "2"
            }
          ]
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "B is not a primitive of this theory - it is 1 + 2·u, so it stands in for itself here and the result is multiplied out"
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
        "text": "u << 1"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "the potential is small wherever this is asked - far outside anything dense - so its square is smaller still and the first order is the whole of it"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "to first order",
    "line": [
      {
        "kind": "text",
        "text": "A·B = 1"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "A·B = 1 - 4·u"
        },
        {
          "kind": "sup",
          "of": [
            {
              "kind": "text",
              "text": "2"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "u << 1"
        }
      ],
      [
        {
          "kind": "text",
          "text": "A·B = 1"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "u is much smaller than one, so powers of it beyond the first are smaller still and are dropped. What is kept is everything to first order in it - stated rather than assumed, and the line above is what it was before"
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
        "text": "A·B = 1"
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
