/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * gravity.relativistic, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * F_{g}^{rel} = F_{g}·\paren{1 + β^{2}·\paren{3/2 + 1/2·β^{2}}}
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

export const THEOREM = "gravity.relativistic";
export const ASKS = "nothing here acts at a distance - a shortfall crosses one cell a tick. What does that do to the gravitational law when the two bodies are moving?";
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
  "regime": "receiver",
  "regimeSays": "per the receiving body's own clock, which is the one anything it does with the momentum is timed by - so the lattice-rate arrival is divided by how slowly that clock runs"
};
export const CONCLUDED: Piece[] = [
  {
    "kind": "text",
    "text": "F"
  },
  {
    "kind": "sub",
    "of": [
      {
        "kind": "text",
        "text": "g"
      }
    ]
  },
  {
    "kind": "sup",
    "of": [
      {
        "kind": "text",
        "text": "rel"
      }
    ]
  },
  {
    "kind": "text",
    "text": " = F"
  },
  {
    "kind": "sub",
    "of": [
      {
        "kind": "text",
        "text": "g"
      }
    ]
  },
  {
    "kind": "text",
    "text": "·"
  },
  {
    "kind": "paren",
    "of": [
      {
        "kind": "text",
        "text": "1 + β"
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
        "text": "·"
      },
      {
        "kind": "paren",
        "of": [
          {
            "kind": "text",
            "text": "3/2 + 1/2·β"
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
    ]
  }
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [
  "binomial"
];

export const STEPS: Step[] = [
  {
    "kind": "definition",
    "via": "gravity.relativistic",
    "line": [
      {
        "kind": "text",
        "text": "F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "g"
          }
        ]
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "rel"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "g"
          }
        ]
      },
      {
        "kind": "text",
        "text": " · γ² · γ"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "so the force is the one between bodies at rest, times what retardation does to what arrives, quoted per the receiving body's own clock, which is the one anything it does with the momentum is timed by - so the lattice-rate arrival is divided by how slowly that clock runs. The first order cancels between the two retarded branches and the square survives; the clock then contributes its own half a square, out of the budget rule"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "gravity.relativistic",
    "line": [
      {
        "kind": "text",
        "text": "γ² = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "ahead + behind"
          }
        ],
        "under": [
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
        "text": "you do not know which side of the source you are on, so both branches are there at half weight each. This is the same ignorance matter.wavelength weighs, and it is not a knob: half is what two possibilities with nothing to tell them apart come to. Weighted so, the two first-order terms are equal and opposite and cancel - which is why the ignorant answer is quadratic and isotropic"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "substituting",
    "line": [
      {
        "kind": "text",
        "text": "F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "g"
          }
        ]
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "rel"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = 1/2·F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "g"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·ahead·γ + 1/2·F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "g"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·behind·γ"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "sup",
          "of": [
            {
              "kind": "text",
              "text": "rel"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·γ²·γ"
        }
      ],
      [
        {
          "kind": "text",
          "text": "γ² = 1/2·ahead + 1/2·behind"
        }
      ],
      [
        {
          "kind": "text",
          "text": "F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "sup",
          "of": [
            {
              "kind": "text",
              "text": "rel"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = 1/2·F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·ahead·γ + 1/2·F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·behind·γ"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "retardation is not a primitive of this theory - it is 1/2·ahead + 1/2·behind, so it stands in for itself here and the result is multiplied out"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "gravity.relativistic",
    "line": [
      {
        "kind": "text",
        "text": "γ = (1 - β²)"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "-1/2"
          }
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "how much a lattice tick is worth in the receiver's own ticks is one over how fast that clock runs - the same quantity the budget gave, to the opposite power"
      }
    ],
    "measured": []
  },
  {
    "kind": "premise",
    "via": "budget/what-a-tick-is-spent-on",
    "line": [
      {
        "kind": "text",
        "text": "left = 1 - spent"
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
        "text": "a ray moves at exactly one cell a tick and never slower, so what a structure varies is not how fast its constituents go but WHICH WAY - motion that walks its own graph gets nowhere, motion that carries it across the lattice does. Two components of a rate whose magnitude is fixed, so they add as squares rather than as shares: what is left for the clock is 1 - β²"
      }
    ],
    "measured": [
      {
        "name": "rules that move a structure",
        "value": 1,
        "note": "TRANSPORT, over \"World\""
      },
      {
        "name": "the theory carries an upkeep",
        "value": 1,
        "note": "G declares `upkeep` - what one period of a structure's own clock costs - and spends the tick on it BEFORE moving, which is what \"not both\" means"
      }
    ]
  },
  {
    "kind": "derived",
    "via": "the binomial series",
    "line": [
      {
        "kind": "text",
        "text": "γ = 1 + 1/2·spent"
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
    "working": [
      [
        {
          "kind": "text",
          "text": "left = 1 + -spent"
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
      [
        {
          "kind": "text",
          "text": "γ = (1 + -spent"
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
          "text": ")"
        },
        {
          "kind": "sup",
          "of": [
            {
              "kind": "text",
              "text": "-1/2"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "= 1 + -1/2·-spent"
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
          "text": " + ..."
        }
      ],
      [
        {
          "kind": "text",
          "text": "= 1 + 1/2·spent"
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
    ],
    "because": [
      {
        "kind": "text",
        "text": "left is 1 - spent"
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
        "text": ", which is one plus -spent"
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
        "text": ". Raised to -1/2 that is "
      },
      {
        "kind": "ref",
        "key": "binomial"
      },
      {
        "kind": "text",
        "text": " in -spent"
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
        "text": ", kept to first order"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "substituting",
    "line": [
      {
        "kind": "text",
        "text": "F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "g"
          }
        ]
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "rel"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = 1/2·F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "g"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·ahead + 1/4·F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "g"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·ahead·spent"
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
        "text": " + 1/2·F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "g"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·behind + 1/4·F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "g"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·behind·spent"
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
    "working": [
      [
        {
          "kind": "text",
          "text": "F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "sup",
          "of": [
            {
              "kind": "text",
              "text": "rel"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = 1/2·F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·ahead·γ + 1/2·F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·behind·γ"
        }
      ],
      [
        {
          "kind": "text",
          "text": "γ = 1 + 1/2·spent"
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
      [
        {
          "kind": "text",
          "text": "F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "sup",
          "of": [
            {
              "kind": "text",
              "text": "rel"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = 1/2·F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·ahead + 1/4·F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·ahead·spent"
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
          "text": " + 1/2·F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·behind + 1/4·F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·behind·spent"
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
    ],
    "because": [
      {
        "kind": "text",
        "text": "γ is not a primitive of this theory - it is 1 + 1/2·spent"
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
        "text": ", so it stands in for itself here and the result is multiplied out"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "gravity.relativistic",
    "line": [
      {
        "kind": "text",
        "text": "ahead = (1-β)"
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
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "what arrives from the compressed branch goes as one over that"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "gravity.relativistic",
    "line": [
      {
        "kind": "text",
        "text": "1-β = 1 - β"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "over the delay the source has moved, so the branch that set out ahead of the motion left from closer than R and arrives compressed - by one less the fraction of a cell a tick it is going"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "the binomial series",
    "line": [
      {
        "kind": "text",
        "text": "ahead = 1 + β + β"
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
    "working": [
      [
        {
          "kind": "text",
          "text": "1-β = 1 + -β"
        }
      ],
      [
        {
          "kind": "text",
          "text": "ahead = (1 + -β)"
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
      [
        {
          "kind": "text",
          "text": "= 1 + -1·-β + ... + ..."
        }
      ],
      [
        {
          "kind": "text",
          "text": "= 1 + β + β"
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
    ],
    "because": [
      {
        "kind": "text",
        "text": "1-β is 1 - β"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "v"
          }
        ]
      },
      {
        "kind": "text",
        "text": ", which is one plus -β"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "v"
          }
        ]
      },
      {
        "kind": "text",
        "text": ". Raised to -1 that is "
      },
      {
        "kind": "ref",
        "key": "binomial"
      },
      {
        "kind": "text",
        "text": " in -β"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "v"
          }
        ]
      },
      {
        "kind": "text",
        "text": ", kept to second order"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "substituting",
    "line": [
      {
        "kind": "text",
        "text": "F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "g"
          }
        ]
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "rel"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = 1/2·F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "g"
          }
        ]
      },
      {
        "kind": "text",
        "text": " + 1/2·F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "g"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·behind + 1/4·F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "g"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·behind·spent"
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
        "text": " + 1/4·F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "g"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·spent"
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
        "text": " + 1/4·F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "g"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·spent"
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
        "text": "·β + 1/4·F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "g"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·spent"
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
        "text": "·β"
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
        "text": " + 1/2·F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "g"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·β + 1/2·F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "g"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·β"
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
    "working": [
      [
        {
          "kind": "text",
          "text": "F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "sup",
          "of": [
            {
              "kind": "text",
              "text": "rel"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = 1/2·F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·ahead + 1/4·F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·ahead·spent"
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
          "text": " + 1/2·F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·behind + 1/4·F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·behind·spent"
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
      [
        {
          "kind": "text",
          "text": "ahead = 1 + β + β"
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
      [
        {
          "kind": "text",
          "text": "F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "sup",
          "of": [
            {
              "kind": "text",
              "text": "rel"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = 1/2·F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": " + 1/2·F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·behind + 1/4·F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·behind·spent"
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
          "text": " + 1/4·F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·spent"
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
          "text": " + 1/4·F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·spent"
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
          "text": "·β + 1/4·F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·spent"
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
          "text": "·β"
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
          "text": " + 1/2·F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·β + 1/2·F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·β"
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
    ],
    "because": [
      {
        "kind": "text",
        "text": "ahead is not a primitive of this theory - it is 1 + β"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "v"
          }
        ]
      },
      {
        "kind": "text",
        "text": " + β"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "v"
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
        "text": ", so it stands in for itself here and the result is multiplied out"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "gravity.relativistic",
    "line": [
      {
        "kind": "text",
        "text": "behind = (1+β)"
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
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "and from the stretched one, one over the other"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "gravity.relativistic",
    "line": [
      {
        "kind": "text",
        "text": "1+β = 1 + β"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "and the branch behind left from further away and arrives stretched by the same amount the other way"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "the binomial series",
    "line": [
      {
        "kind": "text",
        "text": "behind = 1 - β + β"
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
    "working": [
      [
        {
          "kind": "text",
          "text": "1+β = 1 + β"
        }
      ],
      [
        {
          "kind": "text",
          "text": "behind = (1 + β)"
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
      [
        {
          "kind": "text",
          "text": "= 1 + -1·β + ... + ..."
        }
      ],
      [
        {
          "kind": "text",
          "text": "= 1 - β + β"
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
    ],
    "because": [
      {
        "kind": "text",
        "text": "1+β is 1 + β"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "v"
          }
        ]
      },
      {
        "kind": "text",
        "text": ", which is one plus β"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "v"
          }
        ]
      },
      {
        "kind": "text",
        "text": ". Raised to -1 that is "
      },
      {
        "kind": "ref",
        "key": "binomial"
      },
      {
        "kind": "text",
        "text": " in β"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "v"
          }
        ]
      },
      {
        "kind": "text",
        "text": ", kept to second order"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "substituting",
    "line": [
      {
        "kind": "text",
        "text": "F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "g"
          }
        ]
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "rel"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "g"
          }
        ]
      },
      {
        "kind": "text",
        "text": " + 1/2·F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "g"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·spent"
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
        "text": " + 1/2·F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "g"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·spent"
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
        "text": "·β"
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
        "text": " + F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "g"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·β"
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
    "working": [
      [
        {
          "kind": "text",
          "text": "F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "sup",
          "of": [
            {
              "kind": "text",
              "text": "rel"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = 1/2·F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": " + 1/2·F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·behind + 1/4·F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·behind·spent"
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
          "text": " + 1/4·F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·spent"
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
          "text": " + 1/4·F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·spent"
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
          "text": "·β + 1/4·F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·spent"
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
          "text": "·β"
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
          "text": " + 1/2·F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·β + 1/2·F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·β"
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
      [
        {
          "kind": "text",
          "text": "behind = 1 - β + β"
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
      [
        {
          "kind": "text",
          "text": "F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "sup",
          "of": [
            {
              "kind": "text",
              "text": "rel"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": " + 1/2·F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·spent"
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
          "text": " + 1/2·F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·spent"
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
          "text": "·β"
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
          "text": " + F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·β"
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
    ],
    "because": [
      {
        "kind": "text",
        "text": "behind is not a primitive of this theory - it is 1 - β"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "v"
          }
        ]
      },
      {
        "kind": "text",
        "text": " + β"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "v"
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
        "text": ", so it stands in for itself here and the result is multiplied out"
      }
    ],
    "measured": []
  },
  {
    "kind": "premise",
    "via": "budget/what-a-tick-is-spent-on",
    "line": [
      {
        "kind": "text",
        "text": "spent = β"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "a structure gets one action a tick and crossing a cell costs the whole of it, so a thing going at a fraction β of a cell a tick spends that fraction of its actions on moving. Read off TRANSPORT, which takes the upkeep before it moves anything"
      }
    ],
    "measured": [
      {
        "name": "rules that move a structure",
        "value": 1,
        "note": "TRANSPORT, over \"World\""
      },
      {
        "name": "the theory carries an upkeep",
        "value": 1,
        "note": "G declares `upkeep` - what one period of a structure's own clock costs - and spends the tick on it BEFORE moving, which is what \"not both\" means"
      }
    ]
  },
  {
    "kind": "derived",
    "via": "substituting",
    "line": [
      {
        "kind": "text",
        "text": "F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "g"
          }
        ]
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "rel"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "g"
          }
        ]
      },
      {
        "kind": "text",
        "text": " + 3/2·F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "g"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·β"
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
        "text": " + 1/2·F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "g"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·β"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "4"
          }
        ]
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "sup",
          "of": [
            {
              "kind": "text",
              "text": "rel"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": " + 1/2·F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·spent"
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
          "text": " + 1/2·F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·spent"
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
          "text": "·β"
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
          "text": " + F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·β"
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
      [
        {
          "kind": "text",
          "text": "spent = β"
        }
      ],
      [
        {
          "kind": "text",
          "text": "F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "sup",
          "of": [
            {
              "kind": "text",
              "text": "rel"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": " + 3/2·F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·β"
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
          "text": " + 1/2·F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·β"
        },
        {
          "kind": "sup",
          "of": [
            {
              "kind": "text",
              "text": "4"
            }
          ]
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "spent is not a primitive of this theory - it is β"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "v"
          }
        ]
      },
      {
        "kind": "text",
        "text": ", so it stands in for itself here and the result is multiplied out"
      }
    ],
    "measured": []
  }
];
