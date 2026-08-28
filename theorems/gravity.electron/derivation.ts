/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * gravity.electron, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * \frac{M}{M_{0}} = e^{f·r} - 1
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

export const THEOREM = "gravity.electron";
export const ASKS = "charge is made in pairs and destroyed in pairs, what is left over is bent by everything inside it, and the bending itself weighs. What does a bound cloud come to, and how does it stand against the tightest thing that can close?";
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
    "kind": "frac",
    "over": [
      {
        "kind": "text",
        "text": "M"
      }
    ],
    "under": [
      {
        "kind": "text",
        "text": "M"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "0"
          }
        ]
      }
    ]
  },
  {
    "kind": "text",
    "text": " = e"
  },
  {
    "kind": "sup",
    "of": [
      {
        "kind": "text",
        "text": "f·r"
      }
    ]
  },
  {
    "kind": "text",
    "text": " - 1"
  }
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "definition",
    "via": "gravity.electron",
    "line": [
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "dM"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "dr"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "dM"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "dr"
          }
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "and that is what dM/dr MEANS - the rate the enclosed mass grows at as the radius does. Naming it is not a premise about the world; it is saying which derivative the product above is"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "gravity.electron",
    "line": [
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "dM"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "dr"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = shell · \\omega · f"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "AND WHAT THE NEXT SHELL ADDS IS ITS CELLS, TIMES WHAT EACH IS TURNING AT, TIMES WHAT SURVIVES THE CANCELLING. (G/2) makes charge in pairs and ANNIHILATION unmakes it in pairs, so what can act on anything is the residual, and f is that fraction - a property of the meeting rule, measured rather than assumed. THE THREE FACTORS ARE HANDED OVER SEPARATELY AND NOT MULTIPLIED HERE: what they come to is for the rules to work out, and the cancellation between the room and the falloff is the whole content of this theorem rather than something to be asserted in a sentence"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "gravity.electron",
    "line": [
      {
        "kind": "text",
        "text": "\\omega = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "M"
          }
        ],
        "under": [
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
            "text": "·r"
          },
          {
            "kind": "sup",
            "of": [
              {
                "kind": "count",
                "of": [
                  {
                    "kind": "text",
                    "text": "D"
                  }
                ]
              },
              {
                "kind": "text",
                "text": "-1"
              }
            ]
          }
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "WHAT BENDS A CELL IS EVERYTHING INSIDE IT. The second premise says turning emits gravity and `lib/Trajectory.ts` says mass IS turning, so the cloud that has already gathered is part of what does the bending - the field reads M and not the source alone. It spreads over the room above, which is the only geometry in this"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "multiplying",
    "line": [
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "dM"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "dr"
          }
        ]
      },
      {
        "kind": "text",
        "text": " ∝ "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "M·f·shell"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "r"
          },
          {
            "kind": "sup",
            "of": [
              {
                "kind": "count",
                "of": [
                  {
                    "kind": "text",
                    "text": "D"
                  }
                ]
              },
              {
                "kind": "text",
                "text": "-1"
              }
            ]
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
  },
  {
    "kind": "derived",
    "via": "a rate proportional to itself",
    "line": [
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "M"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "M"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "0"
              }
            ]
          }
        ]
      },
      {
        "kind": "text",
        "text": " = e"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "f·r"
          }
        ]
      },
      {
        "kind": "text",
        "text": " - 1"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "and what has ACCUMULATED is that less what it started from, so the ratio of the two is set by the single dimensionless product f·"
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": " and by nothing else at all - not by the dimension, not by the lattice, not by how far anything reaches on its own"
      }
    ],
    "measured": []
  }
];
