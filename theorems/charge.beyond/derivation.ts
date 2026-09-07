/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * charge.beyond, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * ε = \frac{1}{r}
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

export const THEOREM = "charge.beyond";
export const ASKS = "a charge's field falls off as one over the square of the distance. How much of it is left beyond a radius r?";
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
    "text": "ε = "
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
        "text": "r"
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
    "via": "charge.beyond",
    "line": [
      {
        "kind": "text",
        "text": "ε = "
      },
      {
        "kind": "int",
        "from": [
          {
            "kind": "text",
            "text": "r"
          }
        ],
        "to": [
          {
            "kind": "text",
            "text": "∞"
          }
        ]
      },
      {
        "kind": "text",
        "text": " 1/s"
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
        "text": " ds"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "everything past r is everything at every s from r outwards, added up - and there is no outer edge to stop at, so the upper limit is however far you care to go"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "charge.beyond",
    "line": [
      {
        "kind": "text",
        "text": "1/s"
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
        "text": " = "
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
            "text": "s"
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
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "what a charge leaves at a distance falls off as one over the square of it - which is gravity.falloff at "
      },
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
        "text": " = 3, cited rather than counted again"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "integrating a power",
    "line": [
      {
        "kind": "text",
        "text": "ε = "
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
            "text": "r"
          }
        ]
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "ε = "
        },
        {
          "kind": "int",
          "from": [
            {
              "kind": "text",
              "text": "r"
            }
          ],
          "to": [
            {
              "kind": "text",
              "text": "Infinity"
            }
          ]
        },
        {
          "kind": "text",
          "text": " "
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
              "text": "s"
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
          ]
        },
        {
          "kind": "text",
          "text": " ds"
        }
      ],
      [
        {
          "kind": "text",
          "text": "= "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "s"
            },
            {
              "kind": "sup",
              "of": [
                {
                  "kind": "text",
                  "text": "-1"
                }
              ]
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "-1"
            }
          ]
        },
        {
          "kind": "text",
          "text": ", at the limits"
        }
      ],
      [
        {
          "kind": "text",
          "text": "= "
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
              "text": "r"
            }
          ]
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "what is at s is "
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
            "text": "s"
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
        ]
      },
      {
        "kind": "text",
        "text": ", a power -2 of s. Integrated that is s"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "-1"
          }
        ]
      },
      {
        "kind": "text",
        "text": "/-1, taken between r and Infinity"
      }
    ],
    "measured": []
  }
];
