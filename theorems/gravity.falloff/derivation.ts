/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * gravity.falloff, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * F ∝ \frac{A·A'}{STEP·\bar{r}^{D-1}}
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

export const THEOREM = "gravity.falloff";
export const ASKS = "a body sits \\bar{r} steps away from another in the medium. How does what it feels depend on \\bar{r}, and on what else?";
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
    "text": "F ∝ "
  },
  {
    "kind": "frac",
    "over": [
      {
        "kind": "text",
        "text": "A·A'"
      }
    ],
    "under": [
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
        "text": "·"
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
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
    ]
  }
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [
  "ehrhart",
  "binomial"
];

export const STEPS: Step[] = [
  {
    "kind": "definition",
    "via": "gravity.falloff",
    "line": [
      {
        "kind": "text",
        "text": "F = A · δ/site"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "what a body feels is what the medium has to offer where it stands, times how much of the medium it is open to. That is what a force IS in this model, and it mentions no distance"
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
        "text": "F ∝ A·δ/site"
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
    "kind": "premise",
    "via": "medium/what-transport-does",
    "line": [
      {
        "kind": "text",
        "text": "δ is conserved in flight"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "run with MOVEMENT and ARRIVAL and nothing else, the number of rays in the world does not change: 1250, 1250, 1250, 1250, 1250, 1250, 1250. MOVEMENT writes each ray's contents onto exactly one neighbour and ARRIVAL makes that the ray, so transport is a bijection - it moves what it carries and neither makes nor unmakes any of it. This holds at every shell at once and for every run length, because it is a property of the rule rather than of a configuration. What was set aside to ask it: EMISSION, CREATION, ANNIHILATION, TRANSPORT - so this is what the medium does while CARRYING a disturbance, and anything those rules do to one is a correction on top of it"
      }
    ],
    "measured": [
      {
        "name": "rays in the world, tick by tick",
        "value": 1250,
        "note": "1250, 1250, 1250, 1250, 1250, 1250, 1250 over 6 ticks of transport alone on fcc-12, box 9, wrapped so nothing can leave. Whole numbers, so this is exact rather than close"
      },
      {
        "name": "rules set aside to ask this",
        "value": 4,
        "note": "kept MOVEMENT and ARRIVAL; set aside EMISSION, CREATION, ANNIHILATION, TRANSPORT"
      }
    ]
  },
  {
    "kind": "premise",
    "via": "medium/what-transport-does",
    "line": [
      {
        "kind": "text",
        "text": "δ travels through ρ"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "transport is the only rule that changes where anything is, and it moves along the lattice's own exits - one exit a tick, watched here as a front that never runs ahead of the steps it has taken. So a disturbance gets from here to there BY TRAVELLING THROUGH the medium, which is what makes the medium's own evenness a fact about the disturbance as well"
      }
    ],
    "measured": [
      {
        "name": "how far one ray has got, tick by tick",
        "value": 4,
        "note": "2, 4, 6, 8 in lattice units after 1, 2, 3, 4 ticks - it advances by steps and cannot appear anywhere it has not stepped to"
      }
    ]
  },
  {
    "kind": "premise",
    "via": "lattice/what-the-tiling-is",
    "line": [
      {
        "kind": "text",
        "text": "the lattice carries alike in every direction"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "the exit set's second moment is a multiple of the identity, so nothing carried on this lattice prefers a direction at second order"
      }
    ],
    "measured": [
      {
        "name": "second moment anisotropy",
        "value": 7.771561172376096e-16,
        "note": "the spread of Σw·(c·p)^{2} over directions p, computed from all 12 exit vectors - 0 is perfectly even. Exhaustive over the exit set, so it holds for all time and every configuration rather than being sampled"
      }
    ]
  },
  {
    "kind": "derived",
    "via": "carrying",
    "line": [
      {
        "kind": "text",
        "text": "δ goes every way alike"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "deficit travels through ρ, and ρ prefers no direction - so neither does what it carries"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "gravity.falloff",
    "line": [
      {
        "kind": "text",
        "text": "δ ∝ S"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "the disturbance a body leaves is the rays it took out, and how many that is per tick is what S names. This is what the letter means, not something measured about it"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "spreading",
    "line": [
      {
        "kind": "text",
        "text": "δ/site ∝ "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "S"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "shell"
          }
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "conserved and even, so one site's share is the whole of it over the number of sites there are at that distance"
      }
    ],
    "measured": []
  },
  {
    "kind": "premise",
    "via": "lattice/what-the-tiling-is",
    "line": [
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "shell"
          }
        ]
      },
      {
        "kind": "text",
        "text": "("
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": ") = "
      },
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "ball"
          }
        ]
      },
      {
        "kind": "text",
        "text": "("
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": ") - "
      },
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "ball"
          }
        ]
      },
      {
        "kind": "text",
        "text": "("
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": "-1)"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "a site is either within "
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": "-1 steps or it is not, so the sites at exactly "
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": " steps are those within "
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": " less those within "
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": "-1 - a subtraction, with nothing left over and nothing counted twice"
      }
    ],
    "measured": [
      {
        "name": "sites within \\bar{r} steps",
        "value": 8,
        "note": "walked over the lattice's own exits from the centre: 1, 13, 55, 147, 309, 561, 923, 1415, 2057 for \\bar{r} = 0, 1, 2, ..."
      }
    ]
  },
  {
    "kind": "premise",
    "via": "lattice/what-the-tiling-is",
    "line": [
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "ball"
          }
        ]
      },
      {
        "kind": "text",
        "text": "("
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": ") = |"
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·P ∩ L|"
      }
    ],
    "working": [
      [
        {
          "kind": "fn",
          "of": [
            {
              "kind": "text",
              "text": "ball"
            }
          ]
        },
        {
          "kind": "text",
          "text": "("
        },
        {
          "kind": "bar",
          "of": [
            {
              "kind": "text",
              "text": "r"
            }
          ]
        },
        {
          "kind": "text",
          "text": ") = 1, 13, 55, 147, 309, 561, 923, 1415, 2057"
        }
      ],
      [
        {
          "kind": "text",
          "text": "Δ"
        },
        {
          "kind": "sup",
          "of": [
            {
              "kind": "text",
              "text": "1"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = 12, 42, 92, 162, 252, 362, 492, 642"
        }
      ],
      [
        {
          "kind": "text",
          "text": "Δ"
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
          "text": " = 30, 50, 70, 90, 110, 130, 150"
        }
      ],
      [
        {
          "kind": "text",
          "text": "Δ"
        },
        {
          "kind": "sup",
          "of": [
            {
              "kind": "text",
              "text": "3"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = 20, 20, 20, 20, 20, 20"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "the sites within "
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": " steps are the "
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": "-fold dilate of the sites within one step - take one step "
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": " times and you are somewhere in "
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·P, and every site of "
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·P is reached that way. Checked: the counts walked out of the lattice are a polynomial in "
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": " of degree 3, which is "
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
        "text": ", exactly and on integers"
      }
    ],
    "measured": [
      {
        "name": "sites within \\bar{r} steps",
        "value": 8,
        "note": "walked over the lattice's own exits from the centre: 1, 13, 55, 147, 309, 561, 923, 1415, 2057 for \\bar{r} = 0, 1, 2, ..."
      },
      {
        "name": "degree of the count in \\bar{r}",
        "value": 3,
        "note": "the 3-th difference of the counts is constant at 20, and a sequence whose 3-th difference is constant is a polynomial of degree 3. Integer arithmetic - ball(\\bar{r}) = 1, 13, 55, 147, 309, 561, 923, 1415, 2057  |  Δ^{1} = 12, 42, 92, 162, 252, 362, 492, 642  |  Δ^{2} = 30, 50, 70, 90, 110, 130, 150  |  Δ^{3} = 20, 20, 20, 20, 20, 20"
      }
    ]
  },
  {
    "kind": "derived",
    "via": "Ehrhart's theorem",
    "line": [
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "ball"
          }
        ]
      },
      {
        "kind": "text",
        "text": "("
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": ") ∝ "
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
        "text": "·"
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
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
          }
        ]
      }
    ],
    "working": [
      [
        {
          "kind": "fn",
          "of": [
            {
              "kind": "text",
              "text": "ball"
            }
          ]
        },
        {
          "kind": "text",
          "text": "("
        },
        {
          "kind": "bar",
          "of": [
            {
              "kind": "text",
              "text": "r"
            }
          ]
        },
        {
          "kind": "text",
          "text": ") = |"
        },
        {
          "kind": "bar",
          "of": [
            {
              "kind": "text",
              "text": "r"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·P ∩ L|"
        }
      ],
      [
        {
          "kind": "text",
          "text": "= β·"
        },
        {
          "kind": "bar",
          "of": [
            {
              "kind": "text",
              "text": "r"
            }
          ]
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
            }
          ]
        },
        {
          "kind": "text",
          "text": " + c"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "1"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "bar",
          "of": [
            {
              "kind": "text",
              "text": "r"
            }
          ]
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
          "text": " + ... + c"
        },
        {
          "kind": "sub",
          "of": [
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
        }
      ],
      [
        {
          "kind": "text",
          "text": "∝ β·"
        },
        {
          "kind": "bar",
          "of": [
            {
              "kind": "text",
              "text": "r"
            }
          ]
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
            }
          ]
        }
      ]
    ],
    "because": [
      {
        "kind": "ref",
        "key": "ehrhart"
      },
      {
        "kind": "text",
        "text": ": the number of lattice points in the k-fold dilate of a lattice polytope is a polynomial in k of degree exactly "
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
        "text": ", whose leading coefficient is the polytope's volume. Here k is "
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": " and P is the set of sites one step from the centre, so the ball's count is a polynomial in "
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": " of degree "
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
        "text": " and everything below the leading term is dropped by the proportionality"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "the difference of a dilate",
    "line": [
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "shell"
          }
        ]
      },
      {
        "kind": "text",
        "text": "("
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": ") ∝ "
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
        "text": "·"
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
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
    "working": [
      [
        {
          "kind": "fn",
          "of": [
            {
              "kind": "text",
              "text": "shell"
            }
          ]
        },
        {
          "kind": "text",
          "text": "("
        },
        {
          "kind": "bar",
          "of": [
            {
              "kind": "text",
              "text": "r"
            }
          ]
        },
        {
          "kind": "text",
          "text": ") = "
        },
        {
          "kind": "fn",
          "of": [
            {
              "kind": "text",
              "text": "ball"
            }
          ]
        },
        {
          "kind": "text",
          "text": "("
        },
        {
          "kind": "bar",
          "of": [
            {
              "kind": "text",
              "text": "r"
            }
          ]
        },
        {
          "kind": "text",
          "text": ") - "
        },
        {
          "kind": "fn",
          "of": [
            {
              "kind": "text",
              "text": "ball"
            }
          ]
        },
        {
          "kind": "text",
          "text": "("
        },
        {
          "kind": "bar",
          "of": [
            {
              "kind": "text",
              "text": "r"
            }
          ]
        },
        {
          "kind": "text",
          "text": "-1)"
        }
      ],
      [
        {
          "kind": "text",
          "text": "= β·"
        },
        {
          "kind": "bar",
          "of": [
            {
              "kind": "text",
              "text": "r"
            }
          ]
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
            }
          ]
        },
        {
          "kind": "text",
          "text": " - β·("
        },
        {
          "kind": "bar",
          "of": [
            {
              "kind": "text",
              "text": "r"
            }
          ]
        },
        {
          "kind": "text",
          "text": "-1)"
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
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "= β·"
        },
        {
          "kind": "bar",
          "of": [
            {
              "kind": "text",
              "text": "r"
            }
          ]
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
            }
          ]
        },
        {
          "kind": "text",
          "text": " - β·("
        },
        {
          "kind": "bar",
          "of": [
            {
              "kind": "text",
              "text": "r"
            }
          ]
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
            }
          ]
        },
        {
          "kind": "text",
          "text": " - "
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
          "text": "·"
        },
        {
          "kind": "bar",
          "of": [
            {
              "kind": "text",
              "text": "r"
            }
          ]
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
          "text": " + ...)"
        }
      ],
      [
        {
          "kind": "text",
          "text": "= β·"
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
          "text": "·"
        },
        {
          "kind": "bar",
          "of": [
            {
              "kind": "text",
              "text": "r"
            }
          ]
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
          "text": " + ..."
        }
      ],
      [
        {
          "kind": "text",
          "text": "∝ β·"
        },
        {
          "kind": "bar",
          "of": [
            {
              "kind": "text",
              "text": "r"
            }
          ]
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
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "every site is either within "
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": "-1 steps or it is not, so the shell is the ball less its own shift by one step. Expanding ("
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": "-1)"
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
          }
        ]
      },
      {
        "kind": "text",
        "text": " by "
      },
      {
        "kind": "ref",
        "key": "binomial"
      },
      {
        "kind": "text",
        "text": ", the leading β·"
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
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
          }
        ]
      },
      {
        "kind": "text",
        "text": " cancels against the ball's, and what survives is "
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
        "text": "·β·"
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
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
        "text": ". The "
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
        "text": " came DOWN from the exponent in that cancellation; a proportionality does not carry it, and the exponent left behind is "
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
        "text": "-1"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "expansion",
    "line": [
      {
        "kind": "text",
        "text": "δ/site ∝ "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "S"
          }
        ],
        "under": [
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
            "text": "·"
          },
          {
            "kind": "bar",
            "of": [
              {
                "kind": "text",
                "text": "r"
              }
            ]
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
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "shell is not a primitive of this theory - it is what the line above shows it to be, so it stands in for itself here"
      }
    ],
    "measured": []
  },
  {
    "kind": "cited",
    "via": "vacuum.suppression",
    "line": [
      {
        "kind": "text",
        "text": "S = A'"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "established earlier by vacuum.suppression, on this same theory and lattice - the working is there rather than repeated here"
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
        "text": "S ∝ A'"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "S is A', which is a single product of powers - so it scales as that, and whatever was written in terms of S can be written in terms of what it is made of"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "expansion",
    "line": [
      {
        "kind": "text",
        "text": "δ/site ∝ "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "A'"
          }
        ],
        "under": [
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
            "text": "·"
          },
          {
            "kind": "bar",
            "of": [
              {
                "kind": "text",
                "text": "r"
              }
            ]
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
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "S is not a primitive of this theory - it is what the line above shows it to be, so it stands in for itself here"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "expansion",
    "line": [
      {
        "kind": "text",
        "text": "F ∝ "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "A·A'"
          }
        ],
        "under": [
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
            "text": "·"
          },
          {
            "kind": "bar",
            "of": [
              {
                "kind": "text",
                "text": "r"
              }
            ]
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
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "n[deficit] is not a primitive of this theory - it is what the line above shows it to be, so it stands in for itself here"
      }
    ],
    "measured": []
  }
];
