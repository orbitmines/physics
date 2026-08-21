/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * vacuum.occupancy, for G on fcc-12
 * (D 3, DEG 12), box 21, 20 ticks.
 *
 * f = \frac{surviving}{cases} = 0
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

export const THEOREM = "vacuum.occupancy";
export const ASKS = "the vacuum makes space by splitting a point into two halves that meet. How much of what it makes is still there afterwards?";
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
    "text": "f = "
  },
  {
    "kind": "frac",
    "over": [
      {
        "kind": "text",
        "text": "surviving"
      }
    ],
    "under": [
      {
        "kind": "text",
        "text": "cases"
      }
    ]
  },
  {
    "kind": "text",
    "text": " = 0"
  }
];
export const STANDING = false;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "definition",
    "via": "vacuum.occupancy",
    "line": [
      {
        "kind": "text",
        "text": "f = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "surviving"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "cases"
          }
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "every point the vacuum makes arrives as one facing pair, and the states such a pair can be in are equally available - so how much of what is made is still there is how many states leave something behind, over how many there are"
      }
    ],
    "measured": []
  },
  {
    "kind": "premise",
    "via": "meeting/what-the-halves-do",
    "line": [
      {
        "kind": "text",
        "text": "surviving = 0"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "ANNIHILATION was applied to a real facing pair in each of the 1 states and left something behind in 0 of them: neutral meets neutral: both gone"
      }
    ],
    "measured": [
      {
        "name": "surviving",
        "value": 0,
        "note": "applying ANNIHILATION to each: neutral meets neutral: both gone"
      }
    ]
  },
  {
    "kind": "premise",
    "via": "meeting/what-the-halves-do",
    "line": [
      {
        "kind": "text",
        "text": "cases = 1"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "a ray of G can be carrying nothing but itself, so a facing pair has 1 possible states and the enumeration is complete"
      }
    ],
    "measured": [
      {
        "name": "cases",
        "value": 1,
        "note": "every combination the two ends can be carrying in G - no sign to carry, so one. Enumerated, not sampled"
      }
    ]
  },
  {
    "kind": "derived",
    "via": "a ratio of counts",
    "line": [
      {
        "kind": "text",
        "text": "f = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "surviving"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "cases"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = 0"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "f = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "surviving"
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "cases"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "= "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "0"
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "1"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "= 0"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "surviving is 0 and cases is 1, both counted off the tiling, so the ratio is 0 exactly - and it is worth reading as surviving/cases rather than as the number, because on another lattice it is a different number and the same ratio"
      }
    ],
    "measured": []
  }
];
