/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * gravity.law, for G on fcc-12
 * (D 3, DEG 12), box 21, 20 ticks.
 *
 * lean_{1} = n · \frac{\bar{c}}{DEG}
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

export const THEOREM = "gravity.law";
export const ASKS = "n annihilations have happened at a place. How much does a path through it lean, and does that stop growing?";
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
    "text": "lean"
  },
  {
    "kind": "sub",
    "of": [
      {
        "kind": "text",
        "text": "1"
      }
    ]
  },
  {
    "kind": "text",
    "text": " = n · "
  },
  {
    "kind": "frac",
    "over": [
      {
        "kind": "count",
        "of": [
          {
            "kind": "bar",
            "of": [
              {
                "kind": "text",
                "text": "c"
              }
            ]
          }
        ]
      }
    ],
    "under": [
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
  }
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "definition",
    "via": "gravity.law",
    "line": [
      {
        "kind": "text",
        "text": "lean"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "1"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = n · "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "count",
            "of": [
              {
                "kind": "bar",
                "of": [
                  {
                    "kind": "text",
                    "text": "c"
                  }
                ]
              }
            ]
          }
        ],
        "under": [
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
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "an annihilation gives the direction it went one extra way of being taken, so after n of them that direction has 1 + n ways against the 1 each that the "
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
        "text": " alternatives still have. The surplus is n, each worth a step, against "
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
        "text": " - and a path's lean is that. Note what is NOT here: nothing divides by anything that grows with n, so the lean is linear in the count and has no ceiling"
      }
    ],
    "measured": []
  }
];
