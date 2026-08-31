/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * transport.speed, for G on any
 * (D null, DEG null), box null, null ticks.
 *
 * v = \frac{n}{\paren{n + \sigma·\rho}}
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

export const THEOREM = "transport.speed";
export const ASKS = "MOVEMENT says a ray goes one cell a tick, and then says what happens when there is no cell. How fast does a carrier actually go?";
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
    "text": "v = "
  },
  {
    "kind": "frac",
    "over": [
      {
        "kind": "text",
        "text": "n"
      }
    ],
    "under": [
      {
        "kind": "paren",
        "of": [
          {
            "kind": "text",
            "text": "n + "
          },
          {
            "kind": "text",
            "text": "σ"
          },
          {
            "kind": "text",
            "text": "·"
          },
          {
            "kind": "text",
            "text": "ρ"
          }
        ]
      }
    ]
  }
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "rule",
    "via": "MOVEMENT",
    "line": [
      {
        "kind": "text",
        "text": "what the waiting makes = "
      },
      {
        "kind": "text",
        "text": "σ"
      },
      {
        "kind": "text",
        "text": "·"
      },
      {
        "kind": "text",
        "text": "ρ"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "no rays, 1 of space"
        }
      ],
      [
        {
          "kind": "text",
          "text": "the waiting makes "
        },
        {
          "kind": "text",
          "text": "σ"
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "text",
          "text": "ρ"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "MOVEMENT hands the ray to itself and grows the world - no ray made, destroyed or moved, and a point of space where there was none. That is a carrier standing still to make the room it could not step into, and the rate it does so at is "
      },
      {
        "kind": "text",
        "text": "σ"
      },
      {
        "kind": "text",
        "text": "·"
      },
      {
        "kind": "text",
        "text": "ρ"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "the room the line does not supply, which the waiting has to make",
    "line": [
      {
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "a"
        },
        "sub": [
          {
            "kind": "text",
            "text": "0"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = "
      },
      {
        "kind": "text",
        "text": "σ"
      },
      {
        "kind": "text",
        "text": "·"
      },
      {
        "kind": "text",
        "text": "ρ"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "the space line carries a term with no rays in it: the waiting"
        }
      ],
      [
        {
          "kind": "text",
          "text": "a ray that cannot step makes the room instead, and that is space at "
        },
        {
          "kind": "text",
          "text": "σ"
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "text",
          "text": "ρ"
        }
      ],
      [
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "a"
          },
          "sub": [
            {
              "kind": "text",
              "text": "0"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = "
        },
        {
          "kind": "text",
          "text": "σ"
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "text",
          "text": "ρ"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "the space ledger gains one wherever a free point splits and loses one wherever two carriers meet, so its net rate per point is the first less the second. NOTHING IS FITTED HERE: it is the space line read off as it stands, and it is the only scale in this theory that is not a count of the tiling"
      }
    ],
    "measured": []
  },
  {
    "kind": "rule",
    "via": "MOVEMENT",
    "line": [
      {
        "kind": "count",
        "of": [
          {
            "kind": "bar",
            "of": [
              {
                "kind": "text",
                "text": "c"
              }
            ]
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
        "text": "every active ray goes ONE CELL along its own exit in one tick, which is what the streaming term says - so a step is one cell, and that is the only length the lattice has to measure anything else against"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "how fast a carrier goes, when the cell ahead may not be there yet",
    "line": [
      {
        "kind": "text",
        "text": "v = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "n"
          }
        ],
        "under": [
          {
            "kind": "paren",
            "of": [
              {
                "kind": "text",
                "text": "n + "
              },
              {
                "kind": "text",
                "text": "σ"
              },
              {
                "kind": "text",
                "text": "·"
              },
              {
                "kind": "text",
                "text": "ρ"
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
          "text": "MOVEMENT: "
        },
        {
          "kind": "fn",
          "of": [
            {
              "kind": "text",
              "text": "either"
            }
          ]
        },
        {
          "kind": "text",
          "text": "("
        },
        {
          "kind": "fn",
          "of": [
            {
              "kind": "text",
              "text": "some"
            }
          ]
        },
        {
          "kind": "text",
          "text": "(to), step, "
        },
        {
          "kind": "fn",
          "of": [
            {
              "kind": "text",
              "text": "waitForRoom"
            }
          ]
        },
        {
          "kind": "text",
          "text": "(it))"
        }
      ],
      [
        {
          "kind": "text",
          "text": "waitForRoom carries space: "
        },
        {
          "kind": "fn",
          "of": [
            {
              "kind": "text",
              "text": "count"
            }
          ]
        },
        {
          "kind": "text",
          "text": "(1) and no step"
        }
      ],
      [
        {
          "kind": "text",
          "text": "room to be made: "
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "a"
          },
          "sub": [
            {
              "kind": "text",
              "text": "0"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = "
        },
        {
          "kind": "text",
          "text": "σ"
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "text",
          "text": "ρ"
        },
        {
          "kind": "text",
          "text": " a point a tick, shared by n carriers"
        }
      ],
      [
        {
          "kind": "text",
          "text": "each waits "
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "a"
          },
          "sub": [
            {
              "kind": "text",
              "text": "0"
            }
          ]
        },
        {
          "kind": "text",
          "text": "/n of a tick and steps with the rest"
        }
      ],
      [
        {
          "kind": "text",
          "text": "v = n/(n + "
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "a"
          },
          "sub": [
            {
              "kind": "text",
              "text": "0"
            }
          ]
        },
        {
          "kind": "text",
          "text": ") = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "n"
            }
          ],
          "under": [
            {
              "kind": "paren",
              "of": [
                {
                  "kind": "text",
                  "text": "n + "
                },
                {
                  "kind": "text",
                  "text": "σ"
                },
                {
                  "kind": "text",
                  "text": "·"
                },
                {
                  "kind": "text",
                  "text": "ρ"
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
        "text": "MOVEMENT says a lit ray goes one cell along its exit, and then says what happens when there is no cell: waitForRoom, which MAKES a point of space and does not step. That is a carrier being refused a cell, and it is in these rules. A ray therefore advances only on the ticks the cell ahead was already there, and what has to be made is what the space line makes - "
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "a"
        },
        "sub": [
          {
            "kind": "text",
            "text": "0"
          }
        ]
      },
      {
        "kind": "text",
        "text": " a point a tick. CREATION makes it where a point is free; where carriers are standing, they make it, and n of them share it, so each spends "
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "a"
        },
        "sub": [
          {
            "kind": "text",
            "text": "0"
          }
        ]
      },
      {
        "kind": "text",
        "text": "/n of its tick standing still. Where the medium is dense none of them ever waits and the speed is exactly the one cell a tick MOVEMENT advertises. Where it is thin the speed goes as the density itself"
      }
    ],
    "measured": []
  }
];
