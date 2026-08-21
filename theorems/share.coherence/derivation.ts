/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * share.coherence, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * share = \frac{opposed}{states} = 1
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

export const THEOREM = "share.coherence";
export const ASKS = "how much of the time are two charges opposed, in this theory?";
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
    "text": "share = "
  },
  {
    "kind": "frac",
    "over": [
      {
        "kind": "text",
        "text": "opposed"
      }
    ],
    "under": [
      {
        "kind": "text",
        "text": "states"
      }
    ]
  },
  {
    "kind": "text",
    "text": " = 1"
  }
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "definition",
    "via": "share.coherence",
    "line": [
      {
        "kind": "text",
        "text": "share = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "opposed"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "states"
          }
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "two charges are opposed exactly when their meeting leaves nothing - that is what the word means for a rule that either annihilates a pair or does not. The states a pair can be in are equally available, so how much of the time they are opposed is how many of those states annihilate, over how many there are"
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
        "text": "opposed = 1"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "and left nothing at all in the other 1: those are the states in which the two were opposed, which is what being opposed MEANS in a theory whose meetings either annihilate a pair or do not"
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
        "text": "states = 1"
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
        "text": "share = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "opposed"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "states"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = 1"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "share = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "opposed"
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "states"
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
              "text": "1"
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
          "text": "= 1"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "annihilating is 1 and cases is 1, both counted off the tiling, so the ratio is 1 exactly - and it is worth reading as annihilating/cases rather than as the number, because on another lattice it is a different number and the same ratio"
      }
    ],
    "measured": []
  }
];
