/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * gravity.constant, for G on fcc-12
 * (D 3, DEG 12), box 21, 20 ticks.
 *
 * G = \frac{SHEET^{2}}{DEG} = 3
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

export const THEOREM = "gravity.constant";
export const ASKS = "the assembled law carries SHEET^{2}/DEG in front of it, in either regime. What is that ratio, on this lattice?";
export const UNDER = {
  "theory": "G",
  "geometry": "fcc-12",
  "D": 3,
  "DEG": 12,
  "N": 21,
  "T": 20,
  "seeds": [
    1
  ],
  "regime": null,
  "regimeSays": null
};
export const CONCLUDED: Piece[] = [
  {
    "kind": "text",
    "text": "G = "
  },
  {
    "kind": "frac",
    "over": [
      {
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "SHEET"
          }
        ]
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
    "under": [
      {
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "DEG"
          }
        ]
      }
    ]
  },
  {
    "kind": "text",
    "text": " = 3"
  }
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "definition",
    "via": "gravity.constant",
    "line": [
      {
        "kind": "text",
        "text": "G = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "count",
            "of": [
              {
                "kind": "text",
                "text": "SHEET"
              }
            ]
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
        "under": [
          {
            "kind": "count",
            "of": [
              {
                "kind": "text",
                "text": "DEG"
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
        "text": "the assembled law carries "
      },
      {
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "SHEET"
          }
        ]
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
        "text": "/"
      },
      {
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "DEG"
          }
        ]
      },
      {
        "kind": "text",
        "text": " in front of the masses and the inverse square - so the constant is those two counts, divided. Both came off the tiling, and there is nowhere in this line for a fitted number to be"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "gravity.constant",
    "line": [
      {
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "SHEET"
          }
        ]
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
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "SHEET"
          }
        ]
      },
      {
        "kind": "text",
        "text": " · "
      },
      {
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "SHEET"
          }
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "a meeting needs a charge from each side, so the pulse count enters twice"
      }
    ],
    "measured": []
  },
  {
    "kind": "premise",
    "via": "counts/what-the-tiling-fixes",
    "line": [
      {
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "SHEET"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = 6"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "the exits with no component along the pulsing axis, which is what a source emits over. NOT "
      },
      {
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "DEG"
          }
        ]
      },
      {
        "kind": "text",
        "text": ", which is 12. A count of the tiling, taken off the geometry itself with nothing run and nothing fitted"
      }
    ],
    "measured": [
      {
        "name": "SHEET",
        "value": 6,
        "note": "the exits with no component along the pulsing axis, which is what a source emits over. NOT DEG, which is 12"
      }
    ]
  },
  {
    "kind": "derived",
    "via": "counts multiplied",
    "line": [
      {
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "SHEET"
          }
        ]
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
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "SHEET"
          }
        ]
      },
      {
        "kind": "text",
        "text": " · "
      },
      {
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "SHEET"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = 36"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "SHEET"
          }
        ]
      },
      {
        "kind": "text",
        "text": " and "
      },
      {
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "SHEET"
          }
        ]
      },
      {
        "kind": "text",
        "text": " are 6 and 6, so their product is 36"
      }
    ],
    "measured": []
  },
  {
    "kind": "premise",
    "via": "counts/what-the-tiling-fixes",
    "line": [
      {
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "DEG"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = 12"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "the ways out of a point on fcc-12 - the exits it has, counted. A count of the tiling, taken off the geometry itself with nothing run and nothing fitted"
      }
    ],
    "measured": [
      {
        "name": "DEG",
        "value": 12,
        "note": "the ways out of a point on fcc-12 - the exits it has, counted"
      }
    ]
  },
  {
    "kind": "derived",
    "via": "a ratio of counts",
    "line": [
      {
        "kind": "text",
        "text": "G = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "count",
            "of": [
              {
                "kind": "text",
                "text": "SHEET"
              }
            ]
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
        "under": [
          {
            "kind": "count",
            "of": [
              {
                "kind": "text",
                "text": "DEG"
              }
            ]
          }
        ]
      },
      {
        "kind": "text",
        "text": " = 3"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "G = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "count",
              "of": [
                {
                  "kind": "text",
                  "text": "SHEET"
                }
              ]
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
          "under": [
            {
              "kind": "count",
              "of": [
                {
                  "kind": "text",
                  "text": "DEG"
                }
              ]
            }
          ]
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
              "text": "36"
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "12"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "= 3"
        }
      ]
    ],
    "because": [
      {
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "SHEET"
          }
        ]
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
        "text": " is 36 and "
      },
      {
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "DEG"
          }
        ]
      },
      {
        "kind": "text",
        "text": " is 12, both counted off the tiling, so the ratio is 3 exactly - and it is worth reading as "
      },
      {
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "SHEET"
          }
        ]
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
        "text": "/"
      },
      {
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "DEG"
          }
        ]
      },
      {
        "kind": "text",
        "text": " rather than as the number, because on another lattice it is a different number and the same ratio"
      }
    ],
    "measured": []
  }
];
