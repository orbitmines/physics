/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * vacuum.equation, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * (\partial_{t}+\hat{d}·\nabla_{x})n_{b} = \nu(1-\rho) - \sigma n\tilde{n}_{b}F - \tau n\tilde{n}_{b}F(R-1) + (\sigma_{s}+|B|)(S_{\Theta}-1)n_{b} + \chi(turning)_{1-b} + \Sigma(x,\hat{d},t)
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

export const THEOREM = "vacuum.equation";
export const ASKS = "every rule has been written as a term and three of those terms have been corrected. Put the whole of it on one line - what IS the continuous model?";
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
    "text": "(\\partial"
  },
  {
    "kind": "sub",
    "of": [
      {
        "kind": "text",
        "text": "t"
      }
    ]
  },
  {
    "kind": "text",
    "text": "+\\hat{d}·\\nabla"
  },
  {
    "kind": "sub",
    "of": [
      {
        "kind": "text",
        "text": "x"
      }
    ]
  },
  {
    "kind": "text",
    "text": ")n"
  },
  {
    "kind": "sub",
    "of": [
      {
        "kind": "text",
        "text": "b"
      }
    ]
  },
  {
    "kind": "text",
    "text": " = \\"
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
    "text": "(1-\\rho) - \\sigma n\\tilde{n}"
  },
  {
    "kind": "sub",
    "of": [
      {
        "kind": "text",
        "text": "b"
      }
    ]
  },
  {
    "kind": "text",
    "text": "F - \\tau n\\tilde{n}"
  },
  {
    "kind": "sub",
    "of": [
      {
        "kind": "text",
        "text": "b"
      }
    ]
  },
  {
    "kind": "fn",
    "of": [
      {
        "kind": "text",
        "text": "F"
      }
    ]
  },
  {
    "kind": "text",
    "text": "(R-1) + (\\sigma"
  },
  {
    "kind": "sub",
    "of": [
      {
        "kind": "text",
        "text": "s"
      }
    ]
  },
  {
    "kind": "text",
    "text": "+|B|)(S"
  },
  {
    "kind": "sub",
    "of": [
      {
        "kind": "text",
        "text": "\\Theta"
      }
    ]
  },
  {
    "kind": "text",
    "text": "-1)n"
  },
  {
    "kind": "sub",
    "of": [
      {
        "kind": "text",
        "text": "b"
      }
    ]
  },
  {
    "kind": "text",
    "text": " + \\"
  },
  {
    "kind": "fn",
    "of": [
      {
        "kind": "text",
        "text": "chi"
      }
    ]
  },
  {
    "kind": "text",
    "text": "(turning)"
  },
  {
    "kind": "sub",
    "of": [
      {
        "kind": "text",
        "text": "1-b"
      }
    ]
  },
  {
    "kind": "text",
    "text": " + \\"
  },
  {
    "kind": "fn",
    "of": [
      {
        "kind": "text",
        "text": "Sigma"
      }
    ]
  },
  {
    "kind": "text",
    "text": "(x,\\hat{d},t)"
  }
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "definition",
    "via": "vacuum.equation",
    "line": [
      {
        "kind": "text",
        "text": "(\\partial"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "t"
          }
        ]
      },
      {
        "kind": "text",
        "text": "+\\hat{d}·\\nabla"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "x"
          }
        ]
      },
      {
        "kind": "text",
        "text": ")n"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "b"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = \\"
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
        "text": "(1-\\rho) - \\sigma n\\tilde{n}"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "b"
          }
        ]
      },
      {
        "kind": "text",
        "text": "F - \\tau n\\tilde{n}"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "b"
          }
        ]
      },
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "F"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(R-1) + (\\sigma"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "s"
          }
        ]
      },
      {
        "kind": "text",
        "text": "+|B|)(S"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "\\Theta"
          }
        ]
      },
      {
        "kind": "text",
        "text": "-1)n"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "b"
          }
        ]
      },
      {
        "kind": "text",
        "text": " + \\"
      },
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "chi"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(turning)"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "1-b"
          }
        ]
      },
      {
        "kind": "text",
        "text": " + \\"
      },
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "Sigma"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(x,\\hat{d},t)"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "THE WHOLE MODEL, ON ONE LINE, WITH EVERY CORRECTION IN IT:\n\n  (d"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "t"
          }
        ]
      },
      {
        "kind": "text",
        "text": " + d^·grad"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "x"
          }
        ]
      },
      {
        "kind": "text",
        "text": ") n"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "b"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = "
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
        "text": "(1-rho)/2 - sigma n"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "b"
          }
        ]
      },
      {
        "kind": "text",
        "text": " n~"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "b"
          }
        ]
      },
      {
        "kind": "text",
        "text": " F - tau n"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "b"
          }
        ]
      },
      {
        "kind": "text",
        "text": " n~"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "b"
          }
        ]
      },
      {
        "kind": "text",
        "text": " F (1-R) + (sigma"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "s"
          }
        ]
      },
      {
        "kind": "text",
        "text": " + |B|)(S"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "Theta"
          }
        ]
      },
      {
        "kind": "text",
        "text": " - 1) n"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "b"
          }
        ]
      },
      {
        "kind": "text",
        "text": " + chi·(turning)"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "1-b"
          }
        ]
      },
      {
        "kind": "text",
        "text": " + Sigma\n\nwith "
      },
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "B"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(x) = integral p d^ n dd^, F = (1 - d^·j^"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "opp"
          }
        ]
      },
      {
        "kind": "text",
        "text": ")/2, rho = sum of weights over the cell, and b the beat the ray was made on. EVERY SYMBOL IN IT IS A RULE. The transport is MOVEMENT; "
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
        "text": "(1-rho) is (G/2) with its room gate; sigma is ANNIHILATION and tau is (G+M/3), both against the ONCOMING population of the ray's OWN beat; S"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "Theta"
          }
        ]
      },
      {
        "kind": "text",
        "text": " is `steer`; chi is RADIATING, and what it sheds lands on the OTHER beat because it is made between the splitting and the killing. Nothing else is in it.\n\nAND THE TURN IS AN OPERATOR, NOT A FORCE. `vacuum.continuum` wrote it as "
      },
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "q"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(B x d^)·grad"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "d"
          }
        ]
      },
      {
        "kind": "text",
        "text": " n, which is the Vlasov reading and is what a SMALL turn would be. The rule does not make small turns: it makes one of size THETA = 2pi/"
      },
      {
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "CYCLE"
          }
        ]
      },
      {
        "kind": "text",
        "text": ", which is 60, 90 or 45 degrees. A finite rotation is not a derivative, so it belongs in a collision operator - and once it is one, `turn.kernel` diagonalises it and the whole angular problem is g"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "l"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = <P"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "l"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(cos gamma)>, in closed form, with nothing expanded or truncated"
      }
    ],
    "measured": []
  }
];
