/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * force.range, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * \lambda = -1/ln(1 - death per step)
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

export const THEOREM = "force.range";
export const ASKS = "a carrier is destroyed when it meets something. How far does ONE of them get before that happens?";
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
    "text": "\\lambda = -1/"
  },
  {
    "kind": "fn",
    "of": [
      {
        "kind": "text",
        "text": "ln"
      }
    ]
  },
  {
    "kind": "text",
    "text": "(1 - death per step)"
  }
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "premise",
    "via": "survival/what-kills-a-carrier",
    "line": [
      {
        "kind": "text",
        "text": "death per step = partner · fatal fraction"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "ANNIHILATION is quantified over a facing pair and gated on \"active\", read off G itself rather than transcribed. So a carrier is destroyed on a step exactly when there is something facing it carrying something - which is how often partner - AND that meeting is one of the ones that leaves nothing - which is fatal fraction. Neither alone kills anything. ASSUMED HERE, and nowhere else: that whether a partner is present is not correlated with whether the carrier is, which is the standard kinetic assumption and is what lets the two be multiplied"
      }
    ],
    "measured": [
      {
        "name": "rules that can destroy a carrier in flight",
        "value": 1,
        "note": "ANNIHILATION over [Boundary, Boundary] gated on \"active\""
      }
    ]
  },
  {
    "kind": "derived",
    "via": "a chance per step compounds",
    "line": [
      {
        "kind": "text",
        "text": "\\lambda = -1/"
      },
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "ln"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(1 - death per step)"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "and the length it dies over is that chance's own logarithm. This is a transcendental in a folder of counts, and deliberately so: death per step is a ratio of counts and its logarithm is not, but it is a CLOSED FORM which names exactly which counts it came from - which is what distinguishes it from a fitted parameter. A theory that destroys nothing has death per step = 0 and a range that is infinite, so its forces are not screened at all"
      }
    ],
    "measured": []
  }
];
