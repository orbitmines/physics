/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * gravity.doppler, for G on any
 * (D null, DEG null), box null, null ticks.
 *
 * \mathcal{D} = \frac{\paren{1 - \beta}}{1 - \beta\cdot\hat{d}}
 *
 * The notation is parsed into pieces rather than into markup for any one framework:
 * map each piece's `kind` onto whatever you draw with. See `rendering/Notation.ts`.
 */
import type { Piece } from "@orbitmines/physics/notation";

export type Step = {
  kind: "premise" | "definition" | "derived";
  via: string;
  line: Piece[];
  working: Piece[][];
  because: Piece[];
  measured: { name: string; value: number; err?: number; note?: string }[];
};

export const THEOREM = "gravity.doppler";
export const ASKS = "a body that is going somewhere shines on fewer of its ticks, and what it does send arrives closer together ahead of it than behind. What is that worth?";
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
    "kind": "cal",
    "of": [
      {
        "kind": "text",
        "text": "D"
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
        "kind": "paren",
        "of": [
          {
            "kind": "text",
            "text": "1 - "
          },
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "β"
              }
            ]
          }
        ]
      }
    ],
    "under": [
      {
        "kind": "text",
        "text": "1 - "
      },
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "β"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·"
      },
      {
        "kind": "hat",
        "of": [
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "d"
              }
            ]
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
        "text": "what is taken = "
      },
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "σ"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·"
      },
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "ω"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·"
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "ρ"
            }
          ]
        },
        "sup": [
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
        "text": "MOVEMENT, ANNIHILATION takes at "
      },
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "σ"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·"
      },
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "ω"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·"
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "ρ"
            }
          ]
        },
        "sup": [
          {
            "kind": "text",
            "text": "2"
          }
        ]
      },
      {
        "kind": "text",
        "text": " - its rate, times what its gates let through, times the density to the power its quantifier gives"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "what motion does to what a body sends",
    "line": [
      {
        "kind": "cal",
        "of": [
          {
            "kind": "text",
            "text": "D"
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
            "kind": "paren",
            "of": [
              {
                "kind": "text",
                "text": "1 - "
              },
              {
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "β"
                  }
                ]
              }
            ]
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "1 - "
          },
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "β"
              }
            ]
          },
          {
            "kind": "text",
            "text": "·"
          },
          {
            "kind": "hat",
            "of": [
              {
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "d"
                  }
                ]
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
          "text": "EMISSION is gated on "
        },
        {
          "kind": "fn",
          "of": [
            {
              "kind": "text",
              "text": "not"
            }
          ]
        },
        {
          "kind": "text",
          "text": "(moving), so it shines on 1 - "
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "β"
            }
          ]
        },
        {
          "kind": "text",
          "text": " of its ticks"
        }
      ],
      [
        {
          "kind": "text",
          "text": "one cell a tick, so "
        },
        {
          "kind": "bar",
          "of": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "r"
                }
              ]
            }
          ]
        },
        {
          "kind": "text",
          "text": " cells is "
        },
        {
          "kind": "bar",
          "of": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "r"
                }
              ]
            }
          ]
        },
        {
          "kind": "text",
          "text": " ticks"
        }
      ],
      [
        {
          "kind": "text",
          "text": "two rays a tick apart land 1 - "
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "β"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "hat",
          "of": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "d"
                }
              ]
            }
          ]
        },
        {
          "kind": "text",
          "text": " ticks apart"
        }
      ],
      [
        {
          "kind": "cal",
          "of": [
            {
              "kind": "text",
              "text": "D"
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
              "kind": "paren",
              "of": [
                {
                  "kind": "text",
                  "text": "1 - "
                },
                {
                  "kind": "var",
                  "of": [
                    {
                      "kind": "text",
                      "text": "β"
                    }
                  ]
                }
              ]
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "1 - "
            },
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "β"
                }
              ]
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "hat",
              "of": [
                {
                  "kind": "var",
                  "of": [
                    {
                      "kind": "text",
                      "text": "d"
                    }
                  ]
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
        "text": "TWO THINGS, ONE MOTION. `EMISSION` is gated on `spare = "
      },
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "not"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(moving)`, so a tick spent crossing a cell is a tick not spent shining and a body emits on 1 - "
      },
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "β"
          }
        ]
      },
      {
        "kind": "text",
        "text": " of its ticks - the same in every direction. And `MOVEMENT` gives one cell a tick, so a distance IS a time: between two emissions a tick apart the body has closed "
      },
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "β"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·"
      },
      {
        "kind": "hat",
        "of": [
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "d"
              }
            ]
          }
        ]
      },
      {
        "kind": "text",
        "text": " of the way to wherever the ray is going, so they land that much closer together and what arrives per tick is the reciprocal. The first is how OFTEN it shines and the second is WHEN what it shone arrives, and both belong to the same moving body - so they are one factor. IT IS THE CLASSICAL DOPPLER FACTOR and nothing about waves or observers went into it. A body blocks the vacuum's making whether it moves or not, so this is on the meeting term and nowhere else"
      }
    ],
    "measured": []
  }
];
