/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * gravity.ratio, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * \frac{m_{p}}{m_{e}} ∝ \frac{-1/ln(1 - death per step)}{CYCLE}
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

export const THEOREM = "gravity.ratio";
export const ASKS = "mass goes as one over size, so a mass ratio is a size ratio. What are the two sizes a bound pair has here, and what does the ratio between them come to?";
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
        "text": "m"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "p"
          }
        ]
      }
    ],
    "under": [
      {
        "kind": "text",
        "text": "m"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "e"
          }
        ]
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
        "text": "-1/"
      },
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "ln"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(1 - death per step)"
      }
    ],
    "under": [
      {
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "CYCLE"
          }
        ]
      }
    ]
  }
];
export const STANDING = false;
export const MISSING = [
  "\\lambda > 0"
];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "definition",
    "via": "gravity.ratio",
    "line": [
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "m"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "p"
              }
            ]
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "m"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "e"
              }
            ]
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
            "text": "r"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "e"
              }
            ]
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
                "text": "p"
              }
            ]
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
            "text": "2\\pi·\\lambda"
          }
        ],
        "under": [
          {
            "kind": "count",
            "of": [
              {
                "kind": "text",
                "text": "CYCLE"
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
        "text": "AND A MASS RATIO IS A SIZE RATIO INVERTED, which is `gravity.atom`'s m ∝ 1/r and nothing more. Both masses are the same kind of thing - an amount of turning - so the constant between mass and size is the same for both and cancels. What is left is 2πλ/"
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
        "text": ", and every symbol in it is a count this folder already derives"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "gravity.ratio",
    "line": [
      {
        "kind": "text",
        "text": "r"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "p"
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
            "kind": "count",
            "of": [
              {
                "kind": "text",
                "text": "CYCLE"
              }
            ]
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "2\\pi"
          }
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "THE TIGHTEST THING THAT CAN CLOSE is a lap, and a lap is "
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
        "text": "`'s `laps`, and `lattice.turn` establishes that "
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
        "text": " does not grow with the dimension. A closed curve whose circumference is "
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
        "text": " cells has radius "
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
        "text": "/(2π), and nothing smaller closes because there is no shorter way round the ring. The 2π is not fitted; it is what a circumference is"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "expansion",
    "line": [
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "m"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "p"
              }
            ]
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "m"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "e"
              }
            ]
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
            "text": "r"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "e"
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
                "text": "CYCLE"
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
        "text": "r"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "p"
          }
        ]
      },
      {
        "kind": "text",
        "text": " is not a primitive of this theory - it is what the line above shows it to be, so it stands in for itself here"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "gravity.ratio",
    "line": [
      {
        "kind": "text",
        "text": "r"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "e"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = \\lambda"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "AND THE CLOUD REACHES AS FAR AS ITS CARRIERS DO. `gravity.atom` establishes that every shell of it weighs the same, so its mass is set by HOW MANY SHELLS there are and diverges without a cut - and what cuts it is the carrier being eaten, which `reach.range` derives from the vacuum's occupancy rather than assuming"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "which is also a scaling",
    "line": [
      {
        "kind": "text",
        "text": "r"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "e"
          }
        ]
      },
      {
        "kind": "text",
        "text": " ∝ \\lambda"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "r"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "e"
          }
        ]
      },
      {
        "kind": "text",
        "text": " is \\lambda, which is a single product of powers - so it scales as that, and whatever was written in terms of r"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "e"
          }
        ]
      },
      {
        "kind": "text",
        "text": " can be written in terms of what it is made of"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "expansion",
    "line": [
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "m"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "p"
              }
            ]
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "m"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "e"
              }
            ]
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
            "text": "\\lambda"
          }
        ],
        "under": [
          {
            "kind": "count",
            "of": [
              {
                "kind": "text",
                "text": "CYCLE"
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
        "text": "r"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "e"
          }
        ]
      },
      {
        "kind": "text",
        "text": " is not a primitive of this theory - it is what the line above shows it to be, so it stands in for itself here"
      }
    ],
    "measured": []
  },
  {
    "kind": "premise",
    "via": "survival/what-kills-a-carrier",
    "line": [
      {
        "kind": "text",
        "text": "death per step = partner · fatal fraction"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "ANNIHILATION is quantified over a facing pair and gated on \"active\", read off G itself rather than transcribed. So a carrier is destroyed on a step exactly when there is something facing it carrying something - which is how often partner - AND that meeting is one of the ones that leaves nothing - which is fatal fraction. Neither alone kills anything. ASSUMED HERE, and nowhere else: that whether a partner is present is not correlated with whether the carrier is, which is the standard kinetic assumption and is what lets the two be multiplied"
      }
    ],
    "measured": [
      {
        "name": "rules that can destroy a carrier in flight",
        "value": 1,
        "note": "ANNIHILATION over [Boundary, Boundary] gated on \"active\""
      }
    ]
  },
  {
    "kind": "derived",
    "via": "a chance per step compounds",
    "line": [
      {
        "kind": "text",
        "text": "\\lambda = -1/"
      },
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "ln"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(1 - death per step)"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "and the length it dies over is that chance's own logarithm. This is a transcendental in a folder of counts, and deliberately so: death per step is a ratio of counts and its logarithm is not, but it is a CLOSED FORM which names exactly which counts it came from - which is what distinguishes it from a fitted parameter. A theory that destroys nothing has death per step = 0 and a range that is infinite, so its forces are not screened at all"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "which is also a scaling",
    "line": [
      {
        "kind": "text",
        "text": "\\lambda ∝ -1/"
      },
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "ln"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(1 - death per step)"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "\\lambda is -1/"
      },
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "ln"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(1 - death per step), which is a single product of powers - so it scales as that, and whatever was written in terms of \\lambda can be written in terms of what it is made of"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "expansion",
    "line": [
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "m"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "p"
              }
            ]
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "m"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "e"
              }
            ]
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
            "text": "-1/"
          },
          {
            "kind": "fn",
            "of": [
              {
                "kind": "text",
                "text": "ln"
              }
            ]
          },
          {
            "kind": "text",
            "text": "(1 - death per step)"
          }
        ],
        "under": [
          {
            "kind": "count",
            "of": [
              {
                "kind": "text",
                "text": "CYCLE"
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
        "text": "\\lambda is not a primitive of this theory - it is what the line above shows it to be, so it stands in for itself here"
      }
    ],
    "measured": []
  }
];
