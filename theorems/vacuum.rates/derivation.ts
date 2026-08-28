/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * vacuum.rates, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * \sigma_{a} = 1 = 1
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

export const THEOREM = "vacuum.rates";
export const ASKS = "the continuum model has an absorption and a scattering in it. What sets the two, and how much freedom is actually left once the rules have spoken?";
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
    "text": "\\sigma"
  },
  {
    "kind": "sub",
    "of": [
      {
        "kind": "text",
        "text": "a"
      }
    ]
  },
  {
    "kind": "text",
    "text": " = 1 = 1"
  }
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "definition",
    "via": "vacuum.rates",
    "line": [
      {
        "kind": "text",
        "text": "\\sigma"
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
        "text": " = \\sigma"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "a"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = 1"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "AND `steer` SPENDS ONE RING "
      },
      {
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "STEP"
          }
        ]
      },
      {
        "kind": "text",
        "text": " PER TICK, so stir is 1 per tick too, and absorb = stir IDENTICALLY. A ray is exactly as likely to be destroyed as turned. That is not a regime that was chosen, it is where the rules put themselves, and it matters for how the model must be solved: with scattering and absorption comparable the medium is NEARLY BALLISTIC, most of what arrives anywhere arrived straight, and a moment expansion of the direction - P"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "L"
          }
        ]
      },
      {
        "kind": "text",
        "text": " - cannot represent that at any usable order. Measured, such a solve moved 45% between L = 9 and L = 15 and missed the exact ballistic profile by a factor of thirty"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "vacuum.rates",
    "line": [
      {
        "kind": "text",
        "text": "\\sigma"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "a"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = \\sigma·\\rho"
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
        "text": " = (1/\\rho"
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
        "text": ")·\\rho"
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
        "text": " = 1"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "AND THE TWO CANCEL. The cross-section read off the rule is 1/occ and the vacuum settles AT occ - the same number, because it is the same balance seen twice - so the annihilation rate is 1 per tick ON EVERY LATTICE. The occupancies differ by 68% between fcc-12 and icosahedral-12 and this does not move at all, which is the sort of thing that is either a coincidence or the point"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "a number is an expression",
    "line": [
      {
        "kind": "text",
        "text": "\\sigma"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "a"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = 1"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "\\sigma"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "a"
          }
        ]
      },
      {
        "kind": "text",
        "text": " is 1, so it can stand in an expression as that"
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
        "text": "\\sigma"
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
        "text": " = 1"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "\\sigma"
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
          "text": " = \\sigma"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "a"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "\\sigma"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "a"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = 1"
        }
      ],
      [
        {
          "kind": "text",
          "text": "\\sigma"
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
          "text": " = 1"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "\\sigma"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "a"
          }
        ]
      },
      {
        "kind": "text",
        "text": " is not a primitive of this theory - it is 1, so it stands in for itself here and the result is multiplied out"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "which is a number",
    "line": [
      {
        "kind": "text",
        "text": "\\sigma"
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
        "text": " = 1"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "1 has nothing left in it that varies, so it is 1 exactly"
      }
    ],
    "measured": []
  }
];
