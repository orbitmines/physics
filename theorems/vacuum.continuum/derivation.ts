/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * vacuum.continuum, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * \rho_{\infty} = \sigma n\tilde{n} \Rightarrow \rho_{\infty}
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

export const THEOREM = "vacuum.continuum";
export const ASKS = "below the scale where one ray matters, what is left of the rules? Write every one of them as a term in how the density of rays changes, and see what the sum is";
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
    "text": "\\rho"
  },
  {
    "kind": "sub",
    "of": [
      {
        "kind": "text",
        "text": "∞"
      }
    ]
  },
  {
    "kind": "text",
    "text": " = \\sigma n\\tilde{n} \\Rightarrow \\rho"
  },
  {
    "kind": "sub",
    "of": [
      {
        "kind": "text",
        "text": "∞"
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
    "via": "vacuum.continuum",
    "line": [
      {
        "kind": "text",
        "text": "\\"
      },
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "nu"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(1-\\rho) = \\sigma n\\tilde{n} \\Rightarrow \\rho"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "∞"
          }
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "AND WHAT THE EQUATION IS FOR IS WHAT IT IMPLIES, not the assembling of it. Left alone - no source, nothing streaming in or out, no field to turn about - the transport and the turning both vanish and the line above collapses to what is MADE against what is KILLED. Setting the rate to nought is then a statement about the vacuum on its own: it settles where a neutral point's splitting exactly pays for what the meetings take, "
      },
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "nu"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(1-rho) = sigma·rho"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "2"
          }
        ]
      },
      {
        "kind": "text",
        "text": ", and that is `vacuum.occupancy`'s own fixed point reached from the continuum side rather than by enumerating the rule"
      }
    ],
    "measured": []
  }
];
