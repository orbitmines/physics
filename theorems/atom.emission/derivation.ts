/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * atom.emission, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * \Sigma_{nlm} ∝ R_{nl}(t)·|Y_{lm}(\hat{d})|^{2}
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

export const THEOREM = "atom.emission";
export const ASKS = "the vacuum equation has one term that is not a rule. Write a hydrogen state into it and nothing else - how much of the equation has to change, and what do n, l and m turn out to be counts of?";
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
    "text": "\\Sigma"
  },
  {
    "kind": "sub",
    "of": [
      {
        "kind": "text",
        "text": "nlm"
      }
    ]
  },
  {
    "kind": "text",
    "text": " ∝ R"
  },
  {
    "kind": "sub",
    "of": [
      {
        "kind": "text",
        "text": "nl"
      }
    ]
  },
  {
    "kind": "text",
    "text": "(t)·|Y"
  },
  {
    "kind": "sub",
    "of": [
      {
        "kind": "text",
        "text": "lm"
      }
    ]
  },
  {
    "kind": "text",
    "text": "(\\hat{d})|"
  },
  {
    "kind": "sup",
    "of": [
      {
        "kind": "text",
        "text": "2"
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
    "via": "atom.emission",
    "line": [
      {
        "kind": "text",
        "text": "\\Sigma"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "nlm"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = \\text{rate}·1"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "|x|<a"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·|Y"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "lm"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(\\hat{d})|"
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
        "text": "·|R"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "nl"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(t)|"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "AND l AND m ARE COUNTS ON THE SPHERE, used as a probability rather than as an amplitude. |Y"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "lm"
          }
        ]
      },
      {
        "kind": "text",
        "text": "|"
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
        "text": " vanishes l - |m| times in the polar angle and 2|m| times round the azimuth, and the source draws a direction and fires with that chance - so the emission has the harmonic's own smooth profile. THE EARLIER VERSION GATED ON A NARROW WINDOW instead and what came out was four thin spokes, which is what a beam looks like and not what a lobe looks like. The narrowness was the gate's, not the vacuum's"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "multiplying",
    "line": [
      {
        "kind": "text",
        "text": "\\Sigma"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "nlm"
          }
        ]
      },
      {
        "kind": "text",
        "text": " ∝ R"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "nl"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(t)·|Y"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "lm"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(\\hat{d})|"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "2"
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
