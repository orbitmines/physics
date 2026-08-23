/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * lattice.phase, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * SPIN = 1/2·\pi
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

export const THEOREM = "lattice.phase";
export const ASKS = "the exits about an axis form a ring. How far round is one step of it?";
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
    "text": "SPIN = 1/2·\\pi"
  }
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "premise",
    "via": "turning/is-a-turn-a-rotation",
    "line": [
      {
        "kind": "text",
        "text": "SPIN = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "2\\pi"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "turn order"
          }
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "one turn is one step of a ring of 4, so it is a whole turn over 4 - the phase quantum, and a count of the tiling rather than an angle anybody chose"
      }
    ],
    "measured": [
      {
        "name": "what an alike meeting does to a direction",
        "value": 0,
        "note": "ANNIHILATION left the direction alone entirely"
      }
    ]
  },
  {
    "kind": "premise",
    "via": "turning/is-a-turn-a-rotation",
    "line": [
      {
        "kind": "text",
        "text": "turn order = 4"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "the theory's own turn was applied to a direction until it came home, which took 4 applications: 0 -> 8 -> 11 -> 3 -> 0. That count is the ring's length. It is also the proof that a turn is a ROTATION rather than a reflection, since a reflection has order two - and everything magnetic in this model rests on that distinction"
      }
    ],
    "measured": [
      {
        "name": "what an alike meeting does to a direction",
        "value": 0,
        "note": "ANNIHILATION left the direction alone entirely"
      }
    ]
  },
  {
    "kind": "derived",
    "via": "a number is an expression",
    "line": [
      {
        "kind": "text",
        "text": "turn order = 4"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "turn order is 4, so it can stand in an expression as that"
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
        "text": "SPIN = 1/2·\\pi"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "SPIN = 2·"
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "\\pi"
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "turn order"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "turn order = 4"
        }
      ],
      [
        {
          "kind": "text",
          "text": "SPIN = 1/2·\\pi"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "turn order is not a primitive of this theory - it is 4, so it stands in for itself here and the result is multiplied out"
      }
    ],
    "measured": []
  }
];
