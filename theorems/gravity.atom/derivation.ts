/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * gravity.atom, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * m_{cloud} → ∞
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

export const THEOREM = "gravity.atom";
export const ASKS = "a source emits gravity, and so does anything that turns. With no counting condition of any kind, what relation does that fix between a bound thing's mass and its size?";
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
    "text": "m"
  },
  {
    "kind": "sub",
    "of": [
      {
        "kind": "text",
        "text": "cloud"
      }
    ]
  },
  {
    "kind": "text",
    "text": " → ∞"
  }
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "definition",
    "via": "gravity.atom",
    "line": [
      {
        "kind": "text",
        "text": "m"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "cloud"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = "
      },
      {
        "kind": "sum",
        "from": [
          {
            "kind": "text",
            "text": "r"
          }
        ],
        "to": []
      },
      {
        "kind": "text",
        "text": " M"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = M"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": " · L"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "AND THE CLOUD IS ALL OF THOSE SHELLS ADDED UP. Since every shell weighs the same, the sum is that weight times HOW MANY SHELLS THERE ARE - so what the cloud comes to is set by HOW FAR IT REACHES and not by how the field falls off. That extent is what an energy state IS here: how fast the thing rotates and how far what it throws off gets before it is eaten. The mass ratio is therefore a question about L, and the falloff has cancelled itself out of it"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "gravity.atom",
    "line": [
      {
        "kind": "text",
        "text": "M"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = "
      },
      {
        "kind": "text",
        "text": "ω"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": " · shell"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "SO A WHOLE SHELL IS WHAT ONE CELL DOES TIMES HOW MANY CELLS THERE ARE, and this is where the two exponents meet: the field thins as r"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "1-"
          },
          {
            "kind": "count",
            "of": [
              {
                "kind": "text",
                "text": "D"
              }
            ]
          }
        ]
      },
      {
        "kind": "text",
        "text": " and the room grows as r"
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
      },
      {
        "kind": "text",
        "text": ", so THE PRODUCT DOES NOT DEPEND ON r AT ALL. Every shell of the cloud weighs the same, which is conservation said as an arithmetic - the rays that left the source are all still there, spread thinner over more room"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "gravity.atom",
    "line": [
      {
        "kind": "text",
        "text": "ω"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": " ∝ g"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "what one cell out there is doing is what the source's gravity comes to there, which is the first line again - a cell is turned as hard as the field at it"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "gravity.atom",
    "line": [
      {
        "kind": "text",
        "text": "shell = "
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
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "AND THE VACUUM AROUND IT IS MANY MANY CELLS relative to the thing at the middle, which is the whole point: `lattice.shell-growth` counts the room at a distance as "
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
      },
      {
        "kind": "text",
        "text": ", and that count GROWS while the field thins"
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
        "text": "M"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": " ∝ 1"
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
    "via": "summing over every shell",
    "line": [
      {
        "kind": "text",
        "text": "m"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "cloud"
          }
        ]
      },
      {
        "kind": "text",
        "text": " → ∞"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "m"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "cloud"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = "
        },
        {
          "kind": "sum",
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
          "text": " M"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "r"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "M"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "r"
            }
          ]
        },
        {
          "kind": "text",
          "text": " ∝ 1"
        }
      ],
      [
        {
          "kind": "sum",
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
          "text": " r"
        },
        {
          "kind": "sup",
          "of": [
            {
              "kind": "text",
              "text": "0"
            }
          ]
        },
        {
          "kind": "text",
          "text": " → ∞"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "M"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": " goes as 1, so in r it falls off as r"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "0"
          }
        ]
      },
      {
        "kind": "text",
        "text": " - which is to say it does not fall off at all. Every shell contributes the same, and there is no end of shells. So the total does not converge"
      }
    ],
    "measured": []
  }
];
