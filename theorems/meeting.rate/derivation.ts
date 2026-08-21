/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * meeting.rate, for G on fcc-12
 * (D 3, DEG 12), box 21, 20 ticks.
 *
 * S ∝ \frac{SHEET^{2}·m·m'}{\bar{r}^{2D-2}·β^{2}}
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

export const THEOREM = "meeting.rate";
export const ASKS = "two sources are both putting charges into the medium. How often do a charge from each turn up in the same place, \\bar{r} steps out?";
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
    "text": "S ∝ "
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
      },
      {
        "kind": "text",
        "text": "·m·m'"
      }
    ],
    "under": [
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
            "kind": "text",
            "text": "2"
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
            "text": "-2"
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
    "via": "meeting.rate",
    "line": [
      {
        "kind": "text",
        "text": "S = chance · chance'"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "a meeting needs a charge from EACH source in the same place, so the rate is the chance the first has one there times the chance the second does. Both have travelled and thinned on the way, which is why the rate carries the falloff twice over - and that is what it means for a rate to want two things to coincide"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "meeting.rate",
    "line": [
      {
        "kind": "text",
        "text": "emitted is conserved in flight"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "what the first source lets go of is carried by transport, which was counted in integers neither making nor unmaking any of what it carries - the same fact that makes deficit conserved, under another name"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "meeting.rate",
    "line": [
      {
        "kind": "text",
        "text": "emitted travels through ρ"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "what the first source lets go of travels outward through the medium by the same stepping everything else does - it is the same rays"
      }
    ],
    "measured": []
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
        "text": "emitted goes every way alike"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "emitted"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "a"
          }
        ]
      },
      {
        "kind": "text",
        "text": " travels through ρ, and ρ prefers no direction - so neither does what it carries"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "meeting.rate",
    "line": [
      {
        "kind": "text",
        "text": "emitted ∝ m · "
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
        "text": "the first source pulses at its own rate - which is what its mass IS here - and each pulse lets go of "
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
        "text": " charges over its equator. So what it puts into the medium is the one times the other, and "
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
        "text": " is a count of the tiling rather than anything fitted"
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
        "text": "chance ∝ "
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
            "kind": "text",
            "text": "·m"
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
    "kind": "definition",
    "via": "meeting.rate",
    "line": [
      {
        "kind": "text",
        "text": "emitted' is conserved in flight"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "what the second source lets go of is carried by transport, which was counted in integers neither making nor unmaking any of what it carries - the same fact that makes deficit conserved, under another name"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "meeting.rate",
    "line": [
      {
        "kind": "text",
        "text": "emitted' travels through ρ"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "what the second source lets go of travels outward through the medium by the same stepping everything else does - it is the same rays"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "carrying",
    "line": [
      {
        "kind": "text",
        "text": "emitted' goes every way alike"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "emitted"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "b"
          }
        ]
      },
      {
        "kind": "text",
        "text": " travels through ρ, and ρ prefers no direction - so neither does what it carries"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "meeting.rate",
    "line": [
      {
        "kind": "text",
        "text": "emitted' ∝ m' · "
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
        "text": "the second source pulses at its own rate - which is what its mass IS here - and each pulse lets go of "
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
        "text": " charges over its equator. So what it puts into the medium is the one times the other, and "
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
        "text": " is a count of the tiling rather than anything fitted"
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
        "text": "chance' ∝ "
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
            "kind": "text",
            "text": "·m'"
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
    "kind": "derived",
    "via": "multiplying",
    "line": [
      {
        "kind": "text",
        "text": "S ∝ "
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
          },
          {
            "kind": "text",
            "text": "·m·m'"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "shell"
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
        "text": "·β"
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
        "text": "·β"
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
        "text": "S ∝ "
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
          },
          {
            "kind": "text",
            "text": "·m·m'"
          }
        ],
        "under": [
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
                "kind": "text",
                "text": "2"
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
                "text": "-2"
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
  }
];
