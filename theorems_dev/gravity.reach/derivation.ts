/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * gravity.reach, for G on square-4
 * (D 2, DEG 4), box 41, 120 ticks.
 *
 * Φ → ∞
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

export const THEOREM = "gravity.reach";
export const ASKS = "every source in the universe is putting charges everywhere. Adding up what all of them put on you, is there a total?";
export const UNDER = {
  "theory": "G",
  "geometry": "square-4",
  "D": 2,
  "DEG": 4,
  "N": 41,
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
    "text": "Φ → ∞"
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
    "via": "gravity.reach",
    "line": [
      {
        "kind": "text",
        "text": "Φ = "
      },
      {
        "kind": "sum",
        "from": [
          {
            "kind": "bar",
            "of": [
              {
                "kind": "text",
                "text": "r"
              }
            ]
          }
        ],
        "to": []
      },
      {
        "kind": "text",
        "text": " dΦ"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "every source in the universe is putting charges everywhere, so what arrives at you is what all of them put together - taken shell by shell, out as far as there are shells"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "gravity.reach",
    "line": [
      {
        "kind": "text",
        "text": "dΦ = "
      },
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "M"
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
        "text": ") · δ/site"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "what one shell puts on you is how much matter is in it, times what a unit of matter at that distance puts on you - and the second of those is the falloff, cited rather than reproved"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "gravity.reach",
    "line": [
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "M"
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
        "text": ") ∝ ρ · shell"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "a shell at "
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
        "text": " steps has as many sites in it as the shell has, and matter is spread through space at some density - so the matter it holds is the one times the other. No power appears here; the shell's size is established separately"
      }
    ],
    "measured": []
  },
  {
    "kind": "cited",
    "via": "gravity.falloff",
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
        "text": "established earlier by gravity.falloff, on this same theory and lattice - the working is there rather than repeated here"
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
        "text": "dΦ ∝ "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "A'·shell·ρ"
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
        "note": "walked over the lattice's own exits from the centre: 1, 5, 13, 25, 41, 61, 85, 113, 145 for \\bar{r} = 0, 1, 2, ..."
      }
    ]
  },
  {
    "kind": "cited",
    "via": "gravity.falloff",
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
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "established earlier by gravity.falloff, on this same theory and lattice - the working is there rather than repeated here"
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
        "text": "dΦ ∝ A'·ρ"
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
    "kind": "derived",
    "via": "summing over every shell",
    "line": [
      {
        "kind": "text",
        "text": "Φ → ∞"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "Φ = "
        },
        {
          "kind": "sum",
          "from": [
            {
              "kind": "bar",
              "of": [
                {
                  "kind": "text",
                  "text": "r"
                }
              ]
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
          "text": " dΦ"
        }
      ],
      [
        {
          "kind": "text",
          "text": "dΦ ∝ A'·ρ"
        }
      ],
      [
        {
          "kind": "sum",
          "from": [
            {
              "kind": "bar",
              "of": [
                {
                  "kind": "text",
                  "text": "r"
                }
              ]
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
          "text": " "
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
        "text": "what the shell puts on you goes as A'·ρ"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "m"
          }
        ]
      },
      {
        "kind": "text",
        "text": ", so in "
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
        "text": " it falls off as "
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
