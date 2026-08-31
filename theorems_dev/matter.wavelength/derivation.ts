/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * matter.wavelength, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * beat = 2·v
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

export const THEOREM = "matter.wavelength";
export const ASKS = "a moving source has two retarded branches and you do not know which side you are on. What do they leave when they beat against each other?";
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
    "text": "beat = 2·v"
  }
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "definition",
    "via": "matter.wavelength",
    "line": [
      {
        "kind": "text",
        "text": "beat = ahead - behind"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "you do not know which side you are on, so both branches are there at half weight each and what you see is the two beating against one another - their difference. The halves cancel out of the difference, which is why the answer does not depend on them being exactly a half but the WAVELENGTH does"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "matter.wavelength",
    "line": [
      {
        "kind": "text",
        "text": "ahead = 1 + v"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "the branch that set out ahead of the source is compressed by its motion - the retarded time carries a 1/(1 - v), which to first order in a small speed is 1 + v"
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
        "text": "beat = 1 - behind + v"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "beat = ahead - behind"
        }
      ],
      [
        {
          "kind": "text",
          "text": "ahead = 1 + v"
        }
      ],
      [
        {
          "kind": "text",
          "text": "beat = 1 - behind + v"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "ahead is not a primitive of this theory - it is 1 + v, so it stands in for itself here and the result is multiplied out"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "matter.wavelength",
    "line": [
      {
        "kind": "text",
        "text": "behind = 1 - v"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "the branch behind is stretched by the same motion by the same amount the other way - 1/(1 + v), which to first order is 1 - v"
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
        "text": "beat = 2·v"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "beat = 1 - behind + v"
        }
      ],
      [
        {
          "kind": "text",
          "text": "behind = 1 - v"
        }
      ],
      [
        {
          "kind": "text",
          "text": "beat = 2·v"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "behind is not a primitive of this theory - it is 1 - v, so it stands in for itself here and the result is multiplied out"
      }
    ],
    "measured": []
  }
];
