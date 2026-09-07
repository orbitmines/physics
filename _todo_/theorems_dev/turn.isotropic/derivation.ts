/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * turn.isotropic, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * \hat{b} ∝ n_{ray}
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

export const THEOREM = "turn.isotropic";
export const ASKS = "`steer` turns a ray about the field it has accumulated. In a vacuum with nothing driving it, which way does that field point - and what does the answer make the scattering into?";
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
    "kind": "hat",
    "of": [
      {
        "kind": "text",
        "text": "b"
      }
    ]
  },
  {
    "kind": "text",
    "text": " ∝ n"
  },
  {
    "kind": "sub",
    "of": [
      {
        "kind": "text",
        "text": "ray"
      }
    ]
  }
];
export const STANDING = false;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "definition",
    "via": "turn.isotropic",
    "line": [
      {
        "kind": "hat",
        "of": [
          {
            "kind": "text",
            "text": "b"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = B/|B|"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "THE AXIS IS NOT A CHOICE, IT IS THE FIELD. `steer` reads `held` - the running sum of polarity times direction over what the ray has met - and turns about THAT, in the sense the charge gives. So the axis is a moment of the same density being steered, which is `vacuum.continuum`'s closure said from the other side"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "multiplying",
    "line": [
      {
        "kind": "hat",
        "of": [
          {
            "kind": "text",
            "text": "b"
          }
        ]
      },
      {
        "kind": "text",
        "text": " ∝ n"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "ray"
          }
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "each factor carries its own dependence and they multiply"
      }
    ],
    "measured": []
  }
];
