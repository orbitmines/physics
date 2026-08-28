/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * scatter.harmonics, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * \lambda_{1} = 3.000
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

export const THEOREM = "scatter.harmonics";
export const ASKS = "the scattering does not care which way anything is pointing. What does that alone settle about how far a shape can be carried before the vacuum forgets it?";
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
    "text": "\\lambda"
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
    "text": " = 3.000"
  }
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "premise",
    "via": "scattering/what-a-turn-does",
    "line": [
      {
        "kind": "text",
        "text": "\\lambda"
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
        "text": " = 3.000"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "how far the dipole reaches, in mean free paths: 1/(1 - g"
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
        "text": ")"
      }
    ],
    "measured": [
      {
        "name": "\\lambda_{1}",
        "value": 2.999999977648258,
        "note": "how far the dipole reaches, in mean free paths: 1/(1 - g_1)"
      }
    ]
  }
];
