/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * gravity.hydrogen, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * E_{n} ∝ \frac{1}{r_{n}^{2}}
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

export const THEOREM = "gravity.hydrogen";
export const ASKS = "a source emits gravity, turning emits gravity, and the axis can only wind a whole number of ring steps a beat. With no wavelength and no counting condition put on the electron, where do the shells stand and what does it cost to leave one?";
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
    "text": "E"
  },
  {
    "kind": "sub",
    "of": [
      {
        "kind": "text",
        "text": "n"
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
        "text": "1"
      }
    ],
    "under": [
      {
        "kind": "text",
        "text": "r"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "n"
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
    ]
  }
];
export const STANDING = false;
export const MISSING = [
  "E_{n} > 0"
];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "definition",
    "via": "gravity.hydrogen",
    "line": [
      {
        "kind": "text",
        "text": "E"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "n"
          }
        ]
      },
      {
        "kind": "text",
        "text": " ∝ \\omega"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "n"
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
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "AND WHAT IT COSTS TO LEAVE IS THE TURNING TWICE OVER. Mass is the rate of bending - `gravity.atom`'s premise - and what a thing at that rate carries goes as the rate again, so the energy is quadratic in ω. Nothing about this is put in for the atom; it is the same statement `mass.budget` makes when it writes β"
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
    "measured": []
  },
  {
    "kind": "definition",
    "via": "gravity.hydrogen",
    "line": [
      {
        "kind": "text",
        "text": "\\omega"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "n"
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
            "text": "1"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "r"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "n"
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
        "text": "EVERYTHING MOVES AT ONE CELL A TICK, so a closed curve of radius r is 2πr cells round and a lap is "
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
        "text": " ring steps - `G"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "XOR"
          }
        ]
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "o"
          }
        ]
      },
      {
        "kind": "text",
        "text": "`'s own `laps`. Holding that curve therefore costs "
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
        "text": "/(2πr) ring steps a tick, and neither π nor "
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
        "text": " depends on which curve is being asked about. This is `gravity.atom`'s second line and it is cited rather than re-argued"
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
        "text": "E"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "n"
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
            "text": "1"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "r"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "n"
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
  }
];
