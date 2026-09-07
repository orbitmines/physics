/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * turn.kernel, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * g_{1} = 0.667
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

export const THEOREM = "turn.kernel";
export const ASKS = "a ray is turned a fixed angle about an axis pointing anywhere. Over all the ways the axis could point, how far does the ray actually end up being deflected?";
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
    "text": "g"
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
    "text": " = 0.667"
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
        "text": "g"
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
        "text": " = 0.667"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "<cos gamma> for a turn of THETA about a UNIFORM axis, in closed form: (1 + 2 cos THETA)/3"
      }
    ],
    "measured": [
      {
        "name": "g_{1}",
        "value": 0.6666666641831398,
        "note": "<cos gamma> for a turn of THETA about a UNIFORM axis, in closed form: (1 + 2 cos THETA)/3"
      }
    ]
  }
];
