/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * gravity.metric, for G on any
 * (D null, DEG null), box null, null ticks.
 *
 * A in r = 1 - n_{f}
 *
 * The notation is parsed into pieces rather than into markup for any one framework:
 * map each piece's `kind` onto whatever you draw with. See `rendering/Notation.ts`.
 */
import type { Piece } from "@orbitmines/physics";

export type Step = {
  kind: "premise" | "definition" | "derived";
  via: string;
  line: Piece[];
  working: Piece[][];
  because: Piece[];
  measured: { name: string; value: number; err?: number; note?: string }[];
};

export const THEOREM = "gravity.metric";
export const ASKS = "light goes at one over the index. What metric is the medium, then?";
export const UNDER = {
  "theory": "G",
  "geometry": "any",
  "D": null,
  "DEG": null,
  "N": null,
  "T": null,
  "seeds": [],
  "regime": null,
  "regimeSays": null
};
export const CONCLUDED: Piece[] = [
  {
    "kind": "text",
    "text": "A in r = 1 - "
  },
  {
    "kind": "scripted",
    "base": {
      "kind": "text",
      "text": "n"
    },
    "sub": [
      {
        "kind": "text",
        "text": "f"
      }
    ]
  }
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "theorem",
    "via": "the kernel",
    "line": [
      {
        "kind": "text",
        "text": "what swings a heading = "
      },
      {
        "kind": "text",
        "text": "∇"
      },
      {
        "kind": "text",
        "text": " "
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "n"
        },
        "sub": [
          {
            "kind": "text",
            "text": "f"
          }
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "the line's direction term is the kernel's first moment - which way a turn leans on average"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "what a place stands for, counted off what a fold does",
    "line": [
      {
        "kind": "text",
        "text": "N = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "1"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "1 - "
          },
          {
            "kind": "scripted",
            "base": {
              "kind": "text",
              "text": "n"
            },
            "sub": [
              {
                "kind": "text",
                "text": "f"
              }
            ]
          }
        ]
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "a ray crosses where it stands: one tick per point the place stands for"
        }
      ],
      [
        {
          "kind": "text",
          "text": "fold joins what was behind each point onto the other, so the count is transitive"
        }
      ],
      [
        {
          "kind": "text",
          "text": "folds along the path: "
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "n"
          },
          "sub": [
            {
              "kind": "text",
              "text": "f"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "N = 1 + "
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "n"
          },
          "sub": [
            {
              "kind": "text",
              "text": "f"
            }
          ]
        },
        {
          "kind": "text",
          "text": " + "
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "n"
          },
          "sub": [
            {
              "kind": "text",
              "text": "f"
            }
          ],
          "sup": [
            {
              "kind": "text",
              "text": "2"
            }
          ]
        },
        {
          "kind": "text",
          "text": " + ... = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "1"
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "1 - "
            },
            {
              "kind": "scripted",
              "base": {
                "kind": "text",
                "text": "n"
              },
              "sub": [
                {
                  "kind": "text",
                  "text": "f"
                }
              ]
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "N = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "1"
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "1 - "
            },
            {
              "kind": "scripted",
              "base": {
                "kind": "text",
                "text": "n"
              },
              "sub": [
                {
                  "kind": "text",
                  "text": "f"
                }
              ]
            }
          ]
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "MOVEMENT says a ray crosses where it stands before it goes anywhere, one tick per point the place stands for - so the index IS that count. What the count is comes off `fold`, which joins what was behind each of the two points onto the other: a place that swallows another inherits what THAT place stood for, including whatever it had already swallowed. So it is a sum over CHAINS of folds rather than a tally of them, which is geometric and comes to 1/(1 - n). It converges because `unfold` hands a point back at every free point, so the chains are cut off by the same balance the space ledger is written in. Continuum ray optics would exponentiate here instead - that is the right sum where a path picks up a little at a time, and this lattice folds a whole point at a time"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "an index is a metric",
    "line": [
      {
        "kind": "text",
        "text": "A in r = 1 - "
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "n"
        },
        "sub": [
          {
            "kind": "text",
            "text": "f"
          }
        ]
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "MOVEMENT: one tick per point the place stands for"
        }
      ],
      [
        {
          "kind": "text",
          "text": "a place standing for N points gets through 1/N per tick"
        }
      ],
      [
        {
          "kind": "text",
          "text": "A = 1/N = 1 - "
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "n"
          },
          "sub": [
            {
              "kind": "text",
              "text": "f"
            }
          ]
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "MOVEMENT says a ray crosses where it stands before it goes anywhere - ONE TICK PER POINT THE PLACE STANDS FOR. So anything happening at a place that stands for N points gets through 1/N as much of itself per tick of the world, which is what a slow clock IS here. THIS FIXES THE TIME PART ON ITS OWN: it is not read off a ratio to the space part, and there is no freedom left over once it is said. Light going at the root of A over B is then a consequence rather than the premise"
      }
    ],
    "measured": []
  }
];
