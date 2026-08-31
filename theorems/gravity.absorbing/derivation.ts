/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * gravity.absorbing, for G on any
 * (D null, DEG null), box null, null ticks.
 *
 * what a body is open to = m'·DEG
 *
 * The notation is parsed into pieces rather than into markup for any one framework:
 * map each piece's `kind` onto whatever you draw with. See `rendering/Notation.ts`.
 */
import type { Piece } from "@orbitmines/physics";

export type Step = {
  kind: "premise" | "definition" | "derived";
  via: string;
  line: Piece[];
  working: Piece[][];
  because: Piece[];
  measured: { name: string; value: number; err?: number; note?: string }[];
};

export const THEOREM = "gravity.absorbing";
export const ASKS = "a body sitting in a field is a region rather than a point. How much of what is there does it actually receive?";
export const UNDER = {
  "theory": "G",
  "geometry": "any",
  "D": null,
  "DEG": null,
  "N": null,
  "T": null,
  "seeds": [],
  "regime": null,
  "regimeSays": null
};
export const CONCLUDED: Piece[] = [
  {
    "kind": "text",
    "text": "what a body is open to = m'·"
  },
  {
    "kind": "count",
    "of": [
      {
        "kind": "text",
        "text": "DEG"
      }
    ]
  }
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "rule",
    "via": "CREATION",
    "line": [
      {
        "kind": "text",
        "text": "the ways out of a point = "
      },
      {
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "DEG"
          }
        ]
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "the body lit "
        },
        {
          "kind": "count",
          "of": [
            {
              "kind": "text",
              "text": "DEG"
            }
          ]
        },
        {
          "kind": "text",
          "text": " exits"
        }
      ],
      [
        {
          "kind": "text",
          "text": "so a point has "
        },
        {
          "kind": "count",
          "of": [
            {
              "kind": "text",
              "text": "DEG"
            }
          ]
        },
        {
          "kind": "text",
          "text": " ways out"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "CREATION lights every exit a point has, so the count its body ran over is how many ways out there are - "
      },
      {
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "DEG"
          }
        ]
      },
      {
        "kind": "text",
        "text": ". A shortfall is ways out that are missing, so that count is also its ceiling"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "what is there per site, times the sites it has",
    "line": [
      {
        "kind": "text",
        "text": "what a body is open to = m'·"
      },
      {
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "DEG"
          }
        ]
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "a point has "
        },
        {
          "kind": "count",
          "of": [
            {
              "kind": "text",
              "text": "DEG"
            }
          ]
        },
        {
          "kind": "text",
          "text": " ways out"
        }
      ],
      [
        {
          "kind": "text",
          "text": "a body of m' cells has m' of them"
        }
      ],
      [
        {
          "kind": "text",
          "text": "what it is open to = m'·"
        },
        {
          "kind": "count",
          "of": [
            {
              "kind": "text",
              "text": "DEG"
            }
          ]
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "a body is open on every exit of every cell it owns. How many cells is what makes one body bigger than another and is a fact about the body rather than about the theory; how many exits each has is the count the making rule ran over, already settled above"
      }
    ],
    "measured": []
  }
];
