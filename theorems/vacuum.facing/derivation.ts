/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * vacuum.facing, for G on any
 * (D null, DEG null), box null, null ticks.
 *
 * F = \frac{1}{2}
 *
 * The notation is parsed into pieces rather than into markup for any one framework:
 * map each piece's `kind` onto whatever you draw with. See `rendering/Notation.ts`.
 */
import type { Piece } from "@orbitmines/physics/notation";

export type Step = {
  kind: "premise" | "definition" | "derived";
  via: string;
  line: Piece[];
  working: Piece[][];
  because: Piece[];
  measured: { name: string; value: number; err?: number; note?: string }[];
};

export const THEOREM = "vacuum.facing";
export const ASKS = "a meeting is with what is coming the OTHER way. What does that come to in a vacuum with no bias in it?";
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
    "kind": "var",
    "of": [
      {
        "kind": "text",
        "text": "F"
      }
    ]
  },
  {
    "kind": "text",
    "text": " = "
  },
  {
    "kind": "frac",
    "over": [
      {
        "kind": "text",
        "text": "1"
      }
    ],
    "under": [
      {
        "kind": "text",
        "text": "2"
      }
    ]
  }
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "theorem",
    "via": "put in from outside",
    "line": [
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "Σ"
          }
        ]
      },
      {
        "kind": "text",
        "text": " goes every way alike"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "a body lights its exits alike, so what leaves it goes every way alike"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "isotropy leaves no mean heading",
    "line": [
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "F"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "1"
          }
        ],
        "under": [
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
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "F"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = (1 - "
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "d"
            }
          ]
        },
        {
          "kind": "text",
          "text": "^·"
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "j"
            }
          ]
        },
        {
          "kind": "text",
          "text": "^)/2"
        }
      ],
      [
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "j"
            }
          ]
        },
        {
          "kind": "text",
          "text": "^ = 0 where nothing is biased"
        }
      ],
      [
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "F"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = 1/2"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "the facing factor is (1 - "
      },
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "d"
          }
        ]
      },
      {
        "kind": "text",
        "text": "^·"
      },
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "j"
          }
        ]
      },
      {
        "kind": "text",
        "text": "^)/2 and "
      },
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "j"
          }
        ]
      },
      {
        "kind": "text",
        "text": "^ is what the opposing population is doing on average. Alike in every direction, that is nothing - so a meeting in an undisturbed vacuum carries exactly a half, and the two limits it interpolates are one head-on and nought co-moving"
      }
    ],
    "measured": []
  }
];
