/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * lattice.lean, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * lean = \frac{\bar{c}}{DEG} = 1/12
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

export const THEOREM = "lattice.lean";
export const ASKS = "what is one annihilation worth to a path, on this lattice?";
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
    "text": "lean = "
  },
  {
    "kind": "frac",
    "over": [
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
    "text": " = 1/12"
  }
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "definition",
    "via": "lattice.lean",
    "line": [
      {
        "kind": "text",
        "text": "lean = "
      },
      {
        "kind": "frac",
        "over": [
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
        "text": "an annihilation gives the direction it went one extra way of being taken, while every other way out of that point still weighs exactly what it did before - and there are "
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
        "text": " of those. So the lean is a step against "
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
        "text": ": what the annihilation bought, over the alternatives it did not take. The numerator is "
      },
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
        "text": " rather than a bare 1 because what it bought is a step, and a step is "
      },
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
        "text": "a step's worth of lean is what one annihilation buys a path, and a step is "
      },
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
        "text": " - one cell a tick, the lattice's own speed. Its value in those units is one, which is a statement about the units and not about the quantity. A count of the tiling, taken off the geometry itself with nothing run and nothing fitted"
      }
    ],
    "measured": [
      {
        "name": "\\bar{c}",
        "value": 1,
        "note": "a step's worth of lean is what one annihilation buys a path, and a step is \\bar{c} - one cell a tick, the lattice's own speed. Its value in those units is one, which is a statement about the units and not about the quantity"
      }
    ]
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
        "text": "lean = "
      },
      {
        "kind": "frac",
        "over": [
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
        "text": " = 1/12"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "lean = "
        },
        {
          "kind": "frac",
          "over": [
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
              "text": "1"
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
          "text": "= 1/12"
        }
      ]
    ],
    "because": [
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
        "text": " is 1 and "
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
        "text": " is 12, both counted off the tiling, so the ratio is 1/12 exactly - and it is worth reading as "
      },
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
