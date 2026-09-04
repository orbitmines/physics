/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * gravity.emissivity, for G on any
 * (D null, DEG null), box null, null ticks.
 *
 * m_{\Sigma} = \frac{l.choose\paren{\bar{m}_{x}·l.DEG}}{A}
 *
 * The notation is parsed into pieces rather than into markup for any one framework:
 * map each piece's `kind` onto whatever you draw with. See `rendering/Notation.ts`.
 */
import type { Piece } from "@orbitmines/physics/notation";

export type Step = {
  kind: "premise" | "definition" | "derived";
  via: string;
  line: Piece[];
  working: Piece[][];
  because: Piece[];
  measured: { name: string; value: number; err?: number; note?: string }[];
};

export const THEOREM = "gravity.emissivity";
export const ASKS = "a body blocks the vacuum's making and it emits its own rays, and those are counted off different rules. How much does it emit for what it blocks?";
export const UNDER = {
  "theory": "G",
  "geometry": "any",
  "D": null,
  "DEG": null,
  "N": null,
  "T": null,
  "seeds": [],
  "regime": null,
  "regimeSays": null
};
export const CONCLUDED: Piece[] = [
  {
    "kind": "scripted",
    "base": {
      "kind": "bar",
      "of": [
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "m"
            }
          ]
        }
      ]
    },
    "sub": [
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "Σ"
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
        "kind": "muted",
        "of": [
          {
            "kind": "text",
            "text": "l."
          }
        ]
      },
      {
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "choose"
          }
        ]
      },
      {
        "kind": "paren",
        "of": [
          {
            "kind": "scripted",
            "base": {
              "kind": "bar",
              "of": [
                {
                  "kind": "var",
                  "of": [
                    {
                      "kind": "text",
                      "text": "m"
                    }
                  ]
                }
              ]
            },
            "sub": [
              {
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "x"
                  }
                ]
              }
            ]
          },
          {
            "kind": "text",
            "text": "·"
          },
          {
            "kind": "muted",
            "of": [
              {
                "kind": "text",
                "text": "l."
              }
            ]
          },
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
    "under": [
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "A"
          }
        ]
      }
    ]
  }
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "theorem",
    "via": "how many places are r steps out",
    "line": [
      {
        "kind": "text",
        "text": "shell grows as "
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "r"
            }
          ]
        },
        "sup": [
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
            "text": " - 1"
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
              "text": "exits"
            }
          ]
        },
        {
          "kind": "text",
          "text": "("
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "p"
            }
          ]
        },
        {
          "kind": "text",
          "text": "): the ways out of a point, "
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
          "text": " of them"
        }
      ],
      [
        {
          "kind": "text",
          "text": "steps: where one exit leads - and that is all the rules say about where anything is"
        }
      ],
      [
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
          "text": " of those ways are independent, so places within r steps ∝ "
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "r"
              }
            ]
          },
          "sup": [
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
          "kind": "var",
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
          "kind": "var",
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
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "r"
            }
          ]
        },
        {
          "kind": "text",
          "text": "-1) ∝ "
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "r"
              }
            ]
          },
          "sup": [
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
        "text": "the rules give a point, "
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
        "text": " ways out of it, and where each one leads - and nothing else about where anything is. So how far is how many steps were taken, and how many places are that far out is a count of walks. "
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
        "text": " is how many of those ways are independent, so within r steps there are r choices along each of "
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
        "text": " and the places within r go as "
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "r"
            }
          ]
        },
        "sup": [
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
        "text": "; the places at exactly r are the difference between two of those, which is "
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "r"
            }
          ]
        },
        "sup": [
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
        "text": ". Every step is whole and every place counted once, so this is the count itself and not an approximation to one"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "the ball and the shell it is bounded by",
    "line": [
      {
        "kind": "muted",
        "of": [
          {
            "kind": "text",
            "text": "l."
          }
        ]
      },
      {
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "shell"
          }
        ]
      },
      {
        "kind": "paren",
        "of": [
          {
            "kind": "bar",
            "of": [
              {
                "kind": "text",
                "text": "R"
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
        "kind": "scripted",
        "base": {
          "kind": "bar",
          "of": [
            {
              "kind": "text",
              "text": "R"
            }
          ]
        },
        "sup": [
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
            "text": " - 1"
          }
        ]
      }
    ],
    "working": [
      [
        {
          "kind": "muted",
          "of": [
            {
              "kind": "text",
              "text": "l."
            }
          ]
        },
        {
          "kind": "count",
          "of": [
            {
              "kind": "text",
              "text": "shell"
            }
          ]
        },
        {
          "kind": "paren",
          "of": [
            {
              "kind": "bar",
              "of": [
                {
                  "kind": "text",
                  "text": "R"
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
          "kind": "scripted",
          "base": {
            "kind": "bar",
            "of": [
              {
                "kind": "text",
                "text": "R"
              }
            ]
          },
          "sup": [
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
              "text": " - 1"
            }
          ]
        }
      ],
      [
        {
          "kind": "muted",
          "of": [
            {
              "kind": "text",
              "text": "l."
            }
          ]
        },
        {
          "kind": "count",
          "of": [
            {
              "kind": "text",
              "text": "shell"
            }
          ]
        },
        {
          "kind": "text",
          "text": "(1) = "
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
          "text": " = "
        },
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
    ],
    "because": [
      {
        "kind": "text",
        "text": "the places at exactly "
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "R"
          }
        ]
      },
      {
        "kind": "text",
        "text": " steps out, which `ehrhart` counts off the ways out of a point - and at "
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "R"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = 1 it is the ways out themselves, so "
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
        "text": " is this same count read at one rather than a number of its own"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "the ball and the shell it is bounded by",
    "line": [
      {
        "kind": "muted",
        "of": [
          {
            "kind": "text",
            "text": "l."
          }
        ]
      },
      {
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "ball"
          }
        ]
      },
      {
        "kind": "paren",
        "of": [
          {
            "kind": "bar",
            "of": [
              {
                "kind": "text",
                "text": "R"
              }
            ]
          }
        ]
      },
      {
        "kind": "text",
        "text": ".count = "
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "bar",
          "of": [
            {
              "kind": "text",
              "text": "R"
            }
          ]
        },
        "sup": [
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
          "kind": "muted",
          "of": [
            {
              "kind": "text",
              "text": "l."
            }
          ]
        },
        {
          "kind": "count",
          "of": [
            {
              "kind": "text",
              "text": "ball"
            }
          ]
        },
        {
          "kind": "paren",
          "of": [
            {
              "kind": "bar",
              "of": [
                {
                  "kind": "text",
                  "text": "R"
                }
              ]
            }
          ]
        },
        {
          "kind": "text",
          "text": ".count = "
        },
        {
          "kind": "sum",
          "from": [
            {
              "kind": "var",
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
              "kind": "bar",
              "of": [
                {
                  "kind": "text",
                  "text": "R"
                }
              ]
            }
          ]
        },
        {
          "kind": "text",
          "text": " "
        },
        {
          "kind": "muted",
          "of": [
            {
              "kind": "text",
              "text": "l."
            }
          ]
        },
        {
          "kind": "count",
          "of": [
            {
              "kind": "text",
              "text": "shell"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = "
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "bar",
            "of": [
              {
                "kind": "text",
                "text": "R"
              }
            ]
          },
          "sup": [
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
        "kind": "text",
        "text": "the places WITHIN "
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "R"
          }
        ]
      },
      {
        "kind": "text",
        "text": " steps, which is the shell summed over every radius up to "
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "R"
          }
        ]
      },
      {
        "kind": "text",
        "text": " - one power higher, by the same count of walks"
      }
    ],
    "measured": []
  },
  {
    "kind": "rule",
    "via": "MOVEMENT",
    "line": [
      {
        "kind": "text",
        "text": "what is taken = "
      },
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "σ"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·"
      },
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "ω"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·"
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "ρ"
            }
          ]
        },
        "sup": [
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
        "text": "MOVEMENT, ANNIHILATION takes at "
      },
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "σ"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·"
      },
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "ω"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·"
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "ρ"
            }
          ]
        },
        "sup": [
          {
            "kind": "text",
            "text": "2"
          }
        ]
      },
      {
        "kind": "text",
        "text": " - its rate, times what its gates let through, times the density to the power its quantifier gives"
      }
    ],
    "measured": []
  },
  {
    "kind": "rule",
    "via": "CREATION",
    "line": [
      {
        "kind": "text",
        "text": "what is made = "
      },
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "ν"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·"
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "paren",
          "of": [
            {
              "kind": "text",
              "text": "1 - "
            },
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "ρ"
                }
              ]
            }
          ]
        },
        "sup": [
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
        "text": "CREATION makes at "
      },
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "ν"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·"
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "paren",
          "of": [
            {
              "kind": "text",
              "text": "1 - "
            },
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "ρ"
                }
              ]
            }
          ]
        },
        "sup": [
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
        "text": " - its rate, times what its gates let through, times the density to the power its quantifier gives"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "where the making pays for the taking",
    "line": [
      {
        "kind": "scripted",
        "base": {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "ρ"
            }
          ]
        },
        "sub": [
          {
            "kind": "text",
            "text": "∞"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = "
      },
      {
        "kind": "words",
        "text": "the "
      },
      {
        "kind": "text",
        "text": " "
      },
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "ρ"
          }
        ]
      },
      {
        "kind": "text",
        "text": " "
      },
      {
        "kind": "words",
        "text": " where "
      },
      {
        "kind": "text",
        "text": " "
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
        "text": "·"
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "paren",
          "of": [
            {
              "kind": "text",
              "text": "1 - "
            },
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "ρ"
                }
              ]
            }
          ]
        },
        "sup": [
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
        "text": " - "
      },
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "F"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·"
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "ρ"
            }
          ]
        },
        "sup": [
          {
            "kind": "text",
            "text": "2"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = 0"
      }
    ],
    "working": [
      [
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "ν"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "paren",
            "of": [
              {
                "kind": "text",
                "text": "1 - "
              },
              {
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "ρ"
                  }
                ]
              }
            ]
          },
          "sup": [
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
          "text": " = "
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "σ"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "ω"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "ρ"
              }
            ]
          },
          "sup": [
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
          "text": "rays made a firing: "
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
          "text": ",  rays taken a meeting: -2"
        }
      ],
      [
        {
          "kind": "text",
          "text": "a point is free when all "
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
          "text": " of its ways out are dark: "
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "ν"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "paren",
            "of": [
              {
                "kind": "text",
                "text": "1 - "
              },
              {
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "ρ"
                  }
                ]
              }
            ]
          },
          "sup": [
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
          "text": "·"
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "ν"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "paren",
            "of": [
              {
                "kind": "text",
                "text": "1 - "
              },
              {
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "ρ"
                  }
                ]
              }
            ]
          },
          "sup": [
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
          "text": " + -2·"
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "F"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "σ"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "ω"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "ρ"
              }
            ]
          },
          "sup": [
            {
              "kind": "text",
              "text": "2"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = 0"
        }
      ],
      [
        {
          "kind": "scripted",
          "base": {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "ρ"
              }
            ]
          },
          "sub": [
            {
              "kind": "text",
              "text": "∞"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = "
        },
        {
          "kind": "words",
          "text": "the "
        },
        {
          "kind": "text",
          "text": " "
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "ρ"
            }
          ]
        },
        {
          "kind": "text",
          "text": " "
        },
        {
          "kind": "words",
          "text": " where "
        },
        {
          "kind": "text",
          "text": " "
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
          "text": "·"
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "paren",
            "of": [
              {
                "kind": "text",
                "text": "1 - "
              },
              {
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "ρ"
                  }
                ]
              }
            ]
          },
          "sup": [
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
          "text": " - "
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "F"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "ρ"
              }
            ]
          },
          "sup": [
            {
              "kind": "text",
              "text": "2"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = 0"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "the vacuum settles where a neutral point's splitting exactly pays for what the meetings take. That is one equation in one unknown and it has one root that is not negative - so the density is FIXED by the rules rather than chosen, and it is the same on every lattice"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "one over the rate it is removed at",
    "line": [
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "λ"
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
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "σ"
              }
            ]
          },
          {
            "kind": "text",
            "text": "·"
          },
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "ω"
              }
            ]
          },
          {
            "kind": "text",
            "text": "·"
          },
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "ρ"
              }
            ]
          }
        ]
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "removed at "
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "σ"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "ω"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "ρ"
              }
            ]
          },
          "sup": [
            {
              "kind": "text",
              "text": "2"
            }
          ]
        },
        {
          "kind": "text",
          "text": " per "
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "ρ"
            }
          ]
        }
      ],
      [
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "λ"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = 1/("
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "σ"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "ω"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "ρ"
            }
          ]
        },
        {
          "kind": "text",
          "text": ") = "
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
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "σ"
                }
              ]
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "ω"
                }
              ]
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "ρ"
                }
              ]
            }
          ]
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "what removes a ray is the meeting term, and a rate per unit of what is there is a rate per unit length once the density is settled. One over it is how far one carrier gets, which is the length everything else in this model is screened in"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "what a body of that size sends",
    "line": [
      {
        "kind": "bar",
        "of": [
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "m"
              }
            ]
          }
        ]
      },
      {
        "kind": "paren",
        "of": [
          {
            "kind": "bar",
            "of": [
              {
                "kind": "text",
                "text": "R"
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
            "kind": "muted",
            "of": [
              {
                "kind": "text",
                "text": "l."
              }
            ]
          },
          {
            "kind": "count",
            "of": [
              {
                "kind": "text",
                "text": "choose"
              }
            ]
          },
          {
            "kind": "paren",
            "of": [
              {
                "kind": "scripted",
                "base": {
                  "kind": "bar",
                  "of": [
                    {
                      "kind": "var",
                      "of": [
                        {
                          "kind": "text",
                          "text": "m"
                        }
                      ]
                    }
                  ]
                },
                "sub": [
                  {
                    "kind": "var",
                    "of": [
                      {
                        "kind": "text",
                        "text": "x"
                      }
                    ]
                  }
                ]
              },
              {
                "kind": "text",
                "text": "·"
              },
              {
                "kind": "muted",
                "of": [
                  {
                    "kind": "text",
                    "text": "l."
                  }
                ]
              },
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
            "text": "·"
          },
          {
            "kind": "paren",
            "of": [
              {
                "kind": "text",
                "text": "1 - "
              },
              {
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "ρ"
                  }
                ]
              }
            ]
          },
          {
            "kind": "text",
            "text": "·"
          },
          {
            "kind": "scripted",
            "base": {
              "kind": "bar",
              "of": [
                {
                  "kind": "text",
                  "text": "R"
                }
              ]
            },
            "sup": [
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
                "text": " - 1"
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
                "text": "1 - "
              },
              {
                "kind": "scripted",
                "base": {
                  "kind": "paren",
                  "of": [
                    {
                      "kind": "text",
                      "text": "1 - "
                    },
                    {
                      "kind": "var",
                      "of": [
                        {
                          "kind": "text",
                          "text": "σ"
                        }
                      ]
                    },
                    {
                      "kind": "text",
                      "text": "·"
                    },
                    {
                      "kind": "var",
                      "of": [
                        {
                          "kind": "text",
                          "text": "ω"
                        }
                      ]
                    },
                    {
                      "kind": "text",
                      "text": "·"
                    },
                    {
                      "kind": "var",
                      "of": [
                        {
                          "kind": "text",
                          "text": "ρ"
                        }
                      ]
                    }
                  ]
                },
                "sup": [
                  {
                    "kind": "bar",
                    "of": [
                      {
                        "kind": "text",
                        "text": "R"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        "under": [
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "σ"
              }
            ]
          },
          {
            "kind": "text",
            "text": "·"
          },
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "ω"
              }
            ]
          },
          {
            "kind": "text",
            "text": "·"
          },
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "ρ"
              }
            ]
          },
          {
            "kind": "text",
            "text": "·"
          },
          {
            "kind": "muted",
            "of": [
              {
                "kind": "text",
                "text": "l."
              }
            ]
          },
          {
            "kind": "count",
            "of": [
              {
                "kind": "text",
                "text": "shell"
              }
            ]
          },
          {
            "kind": "paren",
            "of": [
              {
                "kind": "bar",
                "of": [
                  {
                    "kind": "text",
                    "text": "R"
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    "working": [
      [
        {
          "kind": "muted",
          "of": [
            {
              "kind": "text",
              "text": "l."
            }
          ]
        },
        {
          "kind": "count",
          "of": [
            {
              "kind": "text",
              "text": "shell"
            }
          ]
        },
        {
          "kind": "text",
          "text": " at one = "
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
          "text": ", and only 1 - "
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "ρ"
            }
          ]
        },
        {
          "kind": "text",
          "text": " of the exits are dark"
        }
      ],
      [
        {
          "kind": "text",
          "text": "the body is "
        },
        {
          "kind": "bar",
          "of": [
            {
              "kind": "text",
              "text": "R"
            }
          ]
        },
        {
          "kind": "text",
          "text": " cells thick"
        }
      ],
      [
        {
          "kind": "text",
          "text": "shadowing lets out "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "scripted",
              "base": {
                "kind": "bar",
                "of": [
                  {
                    "kind": "text",
                    "text": "R"
                  }
                ]
              },
              "sup": [
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
                  "text": " - 1"
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
                  "text": "1 - "
                },
                {
                  "kind": "scripted",
                  "base": {
                    "kind": "paren",
                    "of": [
                      {
                        "kind": "text",
                        "text": "1 - "
                      },
                      {
                        "kind": "var",
                        "of": [
                          {
                            "kind": "text",
                            "text": "σ"
                          }
                        ]
                      },
                      {
                        "kind": "text",
                        "text": "·"
                      },
                      {
                        "kind": "var",
                        "of": [
                          {
                            "kind": "text",
                            "text": "ω"
                          }
                        ]
                      },
                      {
                        "kind": "text",
                        "text": "·"
                      },
                      {
                        "kind": "var",
                        "of": [
                          {
                            "kind": "text",
                            "text": "ρ"
                          }
                        ]
                      }
                    ]
                  },
                  "sup": [
                    {
                      "kind": "bar",
                      "of": [
                        {
                          "kind": "text",
                          "text": "R"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          "under": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "σ"
                }
              ]
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "ω"
                }
              ]
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "ρ"
                }
              ]
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "and the mass is that over the face it went through, "
        },
        {
          "kind": "muted",
          "of": [
            {
              "kind": "text",
              "text": "l."
            }
          ]
        },
        {
          "kind": "count",
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
              "text": "R"
            }
          ]
        },
        {
          "kind": "text",
          "text": ")"
        }
      ],
      [
        {
          "kind": "bar",
          "of": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "m"
                }
              ]
            }
          ]
        },
        {
          "kind": "paren",
          "of": [
            {
              "kind": "bar",
              "of": [
                {
                  "kind": "text",
                  "text": "R"
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
              "kind": "muted",
              "of": [
                {
                  "kind": "text",
                  "text": "l."
                }
              ]
            },
            {
              "kind": "count",
              "of": [
                {
                  "kind": "text",
                  "text": "choose"
                }
              ]
            },
            {
              "kind": "paren",
              "of": [
                {
                  "kind": "scripted",
                  "base": {
                    "kind": "bar",
                    "of": [
                      {
                        "kind": "var",
                        "of": [
                          {
                            "kind": "text",
                            "text": "m"
                          }
                        ]
                      }
                    ]
                  },
                  "sub": [
                    {
                      "kind": "var",
                      "of": [
                        {
                          "kind": "text",
                          "text": "x"
                        }
                      ]
                    }
                  ]
                },
                {
                  "kind": "text",
                  "text": "·"
                },
                {
                  "kind": "muted",
                  "of": [
                    {
                      "kind": "text",
                      "text": "l."
                    }
                  ]
                },
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
              "text": "·"
            },
            {
              "kind": "paren",
              "of": [
                {
                  "kind": "text",
                  "text": "1 - "
                },
                {
                  "kind": "var",
                  "of": [
                    {
                      "kind": "text",
                      "text": "ρ"
                    }
                  ]
                }
              ]
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "scripted",
              "base": {
                "kind": "bar",
                "of": [
                  {
                    "kind": "text",
                    "text": "R"
                  }
                ]
              },
              "sup": [
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
                  "text": " - 1"
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
                  "text": "1 - "
                },
                {
                  "kind": "scripted",
                  "base": {
                    "kind": "paren",
                    "of": [
                      {
                        "kind": "text",
                        "text": "1 - "
                      },
                      {
                        "kind": "var",
                        "of": [
                          {
                            "kind": "text",
                            "text": "σ"
                          }
                        ]
                      },
                      {
                        "kind": "text",
                        "text": "·"
                      },
                      {
                        "kind": "var",
                        "of": [
                          {
                            "kind": "text",
                            "text": "ω"
                          }
                        ]
                      },
                      {
                        "kind": "text",
                        "text": "·"
                      },
                      {
                        "kind": "var",
                        "of": [
                          {
                            "kind": "text",
                            "text": "ρ"
                          }
                        ]
                      }
                    ]
                  },
                  "sup": [
                    {
                      "kind": "bar",
                      "of": [
                        {
                          "kind": "text",
                          "text": "R"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          "under": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "σ"
                }
              ]
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "ω"
                }
              ]
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "ρ"
                }
              ]
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "muted",
              "of": [
                {
                  "kind": "text",
                  "text": "l."
                }
              ]
            },
            {
              "kind": "count",
              "of": [
                {
                  "kind": "text",
                  "text": "shell"
                }
              ]
            },
            {
              "kind": "paren",
              "of": [
                {
                  "kind": "bar",
                  "of": [
                    {
                      "kind": "text",
                      "text": "R"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "EMISSION is the one rule a body owns, and all it says is how often. So a body's mass is that share, times the ways one cell has to announce itself, times the share of those that are dark enough to take it, times how many of its cells can get their rays out at all - which is `shadowing`, and which saturates at the skin because an inner cell's output is annihilated crossing its neighbours. IT IS PER UNIT OF THE BODY'S OWN FACE: the total goes as the shell and grows for ever, which is a fact about how much stuff there is rather than about what the stuff is. TWO THINGS ARE THE SOURCE'"
      },
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "S"
          }
        ]
      },
      {
        "kind": "text",
        "text": ", "
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "bar",
          "of": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "m"
                }
              ]
            }
          ]
        },
        "sub": [
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "x"
              }
            ]
          }
        ]
      },
      {
        "kind": "text",
        "text": " and "
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "R"
          }
        ]
      },
      {
        "kind": "text",
        "text": "; everything else here is a count of the tiling or a rate the rules already fixed"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "what a body is worth per unit of its own face",
    "line": [
      {
        "kind": "bar",
        "of": [
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "m"
              }
            ]
          }
        ]
      },
      {
        "kind": "text",
        "text": " solved = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "muted",
            "of": [
              {
                "kind": "text",
                "text": "l."
              }
            ]
          },
          {
            "kind": "count",
            "of": [
              {
                "kind": "text",
                "text": "choose"
              }
            ]
          },
          {
            "kind": "paren",
            "of": [
              {
                "kind": "scripted",
                "base": {
                  "kind": "bar",
                  "of": [
                    {
                      "kind": "var",
                      "of": [
                        {
                          "kind": "text",
                          "text": "m"
                        }
                      ]
                    }
                  ]
                },
                "sub": [
                  {
                    "kind": "var",
                    "of": [
                      {
                        "kind": "text",
                        "text": "x"
                      }
                    ]
                  }
                ]
              },
              {
                "kind": "text",
                "text": "·"
              },
              {
                "kind": "muted",
                "of": [
                  {
                    "kind": "text",
                    "text": "l."
                  }
                ]
              },
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
            "text": "·"
          },
          {
            "kind": "paren",
            "of": [
              {
                "kind": "text",
                "text": "1 - "
              },
              {
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "ρ"
                  }
                ]
              }
            ]
          }
        ],
        "under": [
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "σ"
              }
            ]
          },
          {
            "kind": "text",
            "text": "·"
          },
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "ω"
              }
            ]
          },
          {
            "kind": "text",
            "text": "·"
          },
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "ρ"
              }
            ]
          }
        ]
      }
    ],
    "working": [
      [
        {
          "kind": "bar",
          "of": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "m"
                }
              ]
            }
          ]
        },
        {
          "kind": "paren",
          "of": [
            {
              "kind": "bar",
              "of": [
                {
                  "kind": "text",
                  "text": "R"
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
              "kind": "muted",
              "of": [
                {
                  "kind": "text",
                  "text": "l."
                }
              ]
            },
            {
              "kind": "count",
              "of": [
                {
                  "kind": "text",
                  "text": "choose"
                }
              ]
            },
            {
              "kind": "paren",
              "of": [
                {
                  "kind": "scripted",
                  "base": {
                    "kind": "bar",
                    "of": [
                      {
                        "kind": "var",
                        "of": [
                          {
                            "kind": "text",
                            "text": "m"
                          }
                        ]
                      }
                    ]
                  },
                  "sub": [
                    {
                      "kind": "var",
                      "of": [
                        {
                          "kind": "text",
                          "text": "x"
                        }
                      ]
                    }
                  ]
                },
                {
                  "kind": "text",
                  "text": "·"
                },
                {
                  "kind": "muted",
                  "of": [
                    {
                      "kind": "text",
                      "text": "l."
                    }
                  ]
                },
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
              "text": "·"
            },
            {
              "kind": "paren",
              "of": [
                {
                  "kind": "text",
                  "text": "1 - "
                },
                {
                  "kind": "var",
                  "of": [
                    {
                      "kind": "text",
                      "text": "ρ"
                    }
                  ]
                }
              ]
            }
          ],
          "under": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "σ"
                }
              ]
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "ω"
                }
              ]
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "ρ"
                }
              ]
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
              "text": "1 - "
            },
            {
              "kind": "scripted",
              "base": {
                "kind": "paren",
                "of": [
                  {
                    "kind": "text",
                    "text": "1 - "
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
                        "kind": "var",
                        "of": [
                          {
                            "kind": "text",
                            "text": "λ"
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              "sup": [
                {
                  "kind": "frac",
                  "over": [
                    {
                      "kind": "muted",
                      "of": [
                        {
                          "kind": "text",
                          "text": "l."
                        }
                      ]
                    },
                    {
                      "kind": "count",
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
                          "text": "R"
                        }
                      ]
                    },
                    {
                      "kind": "text",
                      "text": ").count"
                    }
                  ],
                  "under": [
                    {
                      "kind": "muted",
                      "of": [
                        {
                          "kind": "text",
                          "text": "l."
                        }
                      ]
                    },
                    {
                      "kind": "count",
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
                          "text": "R"
                        }
                      ]
                    },
                    {
                      "kind": "text",
                      "text": ")"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      [
        {
          "kind": "frac",
          "over": [
            {
              "kind": "muted",
              "of": [
                {
                  "kind": "text",
                  "text": "l."
                }
              ]
            },
            {
              "kind": "count",
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
                  "text": "R"
                }
              ]
            },
            {
              "kind": "text",
              "text": ").count"
            }
          ],
          "under": [
            {
              "kind": "muted",
              "of": [
                {
                  "kind": "text",
                  "text": "l."
                }
              ]
            },
            {
              "kind": "count",
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
                  "text": "R"
                }
              ]
            },
            {
              "kind": "text",
              "text": ")"
            }
          ]
        },
        {
          "kind": "text",
          "text": " "
        },
        {
          "kind": "text",
          "text": "→"
        },
        {
          "kind": "text",
          "text": " "
        },
        {
          "kind": "text",
          "text": "∞"
        },
        {
          "kind": "text",
          "text": ", so the bracket "
        },
        {
          "kind": "text",
          "text": "→"
        },
        {
          "kind": "text",
          "text": " 1"
        }
      ],
      [
        {
          "kind": "bar",
          "of": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "m"
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
          "kind": "scripted",
          "base": {
            "kind": "fn",
            "of": [
              {
                "kind": "text",
                "text": "lim"
              }
            ]
          },
          "sub": [
            {
              "kind": "bar",
              "of": [
                {
                  "kind": "text",
                  "text": "R"
                }
              ]
            },
            {
              "kind": "text",
              "text": " "
            },
            {
              "kind": "text",
              "text": "→"
            },
            {
              "kind": "text",
              "text": " "
            },
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
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "m"
                }
              ]
            }
          ]
        },
        {
          "kind": "paren",
          "of": [
            {
              "kind": "bar",
              "of": [
                {
                  "kind": "text",
                  "text": "R"
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
              "kind": "muted",
              "of": [
                {
                  "kind": "text",
                  "text": "l."
                }
              ]
            },
            {
              "kind": "count",
              "of": [
                {
                  "kind": "text",
                  "text": "choose"
                }
              ]
            },
            {
              "kind": "paren",
              "of": [
                {
                  "kind": "scripted",
                  "base": {
                    "kind": "bar",
                    "of": [
                      {
                        "kind": "var",
                        "of": [
                          {
                            "kind": "text",
                            "text": "m"
                          }
                        ]
                      }
                    ]
                  },
                  "sub": [
                    {
                      "kind": "var",
                      "of": [
                        {
                          "kind": "text",
                          "text": "x"
                        }
                      ]
                    }
                  ]
                },
                {
                  "kind": "text",
                  "text": "·"
                },
                {
                  "kind": "muted",
                  "of": [
                    {
                      "kind": "text",
                      "text": "l."
                    }
                  ]
                },
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
              "text": "·"
            },
            {
              "kind": "paren",
              "of": [
                {
                  "kind": "text",
                  "text": "1 - "
                },
                {
                  "kind": "var",
                  "of": [
                    {
                      "kind": "text",
                      "text": "ρ"
                    }
                  ]
                }
              ]
            }
          ],
          "under": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "σ"
                }
              ]
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "ω"
                }
              ]
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "ρ"
                }
              ]
            }
          ]
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "the body's thickness is its ball over its shell, and that grows with "
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "R"
          }
        ]
      },
      {
        "kind": "text",
        "text": " - so past one mean free path the skin factor is one and every "
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "R"
          }
        ]
      },
      {
        "kind": "text",
        "text": " cancels. What is left is a SURFACE DENSITY the vacuum fixes: one mean free path of announcement per unit of face, and no body of any size or make can exceed it. Since what is felt at a distance is this same quantity read at the far shell rather than the near one, the SURFACE GRAVITY of a large body saturates - which Newton's does not"
      }
    ],
    "measured": []
  },
  {
    "kind": "rule",
    "via": "EMISSION",
    "line": [
      {
        "kind": "text",
        "text": "what a body feels = "
      },
      {
        "kind": "sum",
        "from": [],
        "to": []
      },
      {
        "kind": "hat",
        "of": [
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "d"
              }
            ]
          }
        ]
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "each absorbed ray adds its exit"
        }
      ],
      [
        {
          "kind": "text",
          "text": "force = "
        },
        {
          "kind": "sum",
          "from": [],
          "to": []
        },
        {
          "kind": "text",
          "text": " "
        },
        {
          "kind": "hat",
          "of": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "d"
                }
              ]
            }
          ]
        },
        {
          "kind": "text",
          "text": " over what arrives"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "the rule adds the ray's own exit to the body's momentum, once per ray taken - so what a body feels is the vector sum of the directions that arrived at it, and a count of them would be a different quantity that is not what any rule computes"
      }
    ],
    "measured": []
  },
  {
    "kind": "rule",
    "via": "CREATION",
    "line": [
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "S"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = "
      },
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "ν"
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
            "text": "1 - "
          },
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "ρ"
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
        "text": "CREATION fires because a point is neutral, and matter is not - so what a body puts into the medium is exactly the making that did not happen where it sits. Its strength is that term, and is not a quantity of its own"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "a body's own cells thin one another",
    "line": [
      {
        "kind": "text",
        "text": "what a body puts into the medium = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "ν"
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
                "text": "1 - "
              },
              {
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "ρ"
                  }
                ]
              }
            ]
          },
          {
            "kind": "text",
            "text": "·"
          },
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "A"
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
                "text": "1 - "
              },
              {
                "kind": "scripted",
                "base": {
                  "kind": "paren",
                  "of": [
                    {
                      "kind": "text",
                      "text": "1 - "
                    },
                    {
                      "kind": "var",
                      "of": [
                        {
                          "kind": "text",
                          "text": "σ"
                        }
                      ]
                    },
                    {
                      "kind": "text",
                      "text": "·"
                    },
                    {
                      "kind": "var",
                      "of": [
                        {
                          "kind": "text",
                          "text": "ω"
                        }
                      ]
                    },
                    {
                      "kind": "text",
                      "text": "·"
                    },
                    {
                      "kind": "var",
                      "of": [
                        {
                          "kind": "text",
                          "text": "ρ"
                        }
                      ]
                    }
                  ]
                },
                "sup": [
                  {
                    "kind": "bar",
                    "of": [
                      {
                        "kind": "text",
                        "text": "R"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        "under": [
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "σ"
              }
            ]
          },
          {
            "kind": "text",
            "text": "·"
          },
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "ω"
              }
            ]
          },
          {
            "kind": "text",
            "text": "·"
          },
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "ρ"
              }
            ]
          }
        ]
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "each cell prevents "
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "ν"
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
              "text": "1 - "
            },
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "ρ"
                }
              ]
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "a cell at depth d survives d steps: 1 - "
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "σ"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "ω"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "ρ"
              }
            ]
          },
          "sup": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "d"
                }
              ]
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "the body is "
        },
        {
          "kind": "bar",
          "of": [
            {
              "kind": "text",
              "text": "R"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = "
        },
        {
          "kind": "bar",
          "of": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "m"
                }
              ]
            }
          ]
        },
        {
          "kind": "text",
          "text": "/A deep, so the sum runs to there and not past it"
        }
      ],
      [
        {
          "kind": "sum",
          "from": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "d"
                }
              ]
            },
            {
              "kind": "text",
              "text": "=0"
            }
          ],
          "to": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "T"
                }
              ]
            }
          ]
        },
        {
          "kind": "text",
          "text": " "
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "q"
              }
            ]
          },
          "sup": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "d"
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
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "λ"
            }
          ]
        },
        {
          "kind": "paren",
          "of": [
            {
              "kind": "text",
              "text": "1 - "
            },
            {
              "kind": "scripted",
              "base": {
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "q"
                  }
                ]
              },
              "sup": [
                {
                  "kind": "var",
                  "of": [
                    {
                      "kind": "text",
                      "text": "T"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "deep: that is "
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "λ"
            }
          ]
        },
        {
          "kind": "text",
          "text": ", the skin.  shallow: it is "
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "T"
            }
          ]
        },
        {
          "kind": "text",
          "text": ", the whole of it"
        }
      ],
      [
        {
          "kind": "text",
          "text": "what a body puts into the medium = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "ν"
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
                  "text": "1 - "
                },
                {
                  "kind": "var",
                  "of": [
                    {
                      "kind": "text",
                      "text": "ρ"
                    }
                  ]
                }
              ]
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "A"
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
                  "text": "1 - "
                },
                {
                  "kind": "scripted",
                  "base": {
                    "kind": "paren",
                    "of": [
                      {
                        "kind": "text",
                        "text": "1 - "
                      },
                      {
                        "kind": "var",
                        "of": [
                          {
                            "kind": "text",
                            "text": "σ"
                          }
                        ]
                      },
                      {
                        "kind": "text",
                        "text": "·"
                      },
                      {
                        "kind": "var",
                        "of": [
                          {
                            "kind": "text",
                            "text": "ω"
                          }
                        ]
                      },
                      {
                        "kind": "text",
                        "text": "·"
                      },
                      {
                        "kind": "var",
                        "of": [
                          {
                            "kind": "text",
                            "text": "ρ"
                          }
                        ]
                      }
                    ]
                  },
                  "sup": [
                    {
                      "kind": "bar",
                      "of": [
                        {
                          "kind": "text",
                          "text": "R"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          "under": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "σ"
                }
              ]
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "ω"
                }
              ]
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "ρ"
                }
              ]
            }
          ]
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "a body prevents the making at every cell it owns, so what it HOLDS goes as its bulk. What it SENDS does not: a cell's output has to cross the cells outside it, and the meeting term thins it exactly as it thins one body's radiation against another'"
      },
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "s"
          }
        ]
      },
      {
        "kind": "text",
        "text": " - the rule has no notion of which body a ray belongs to. A cell at depth d therefore reaches the outside attenuated by "
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "e"
            }
          ]
        },
        "sup": [
          {
            "kind": "text",
            "text": "-"
          },
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "d"
              }
            ]
          },
          {
            "kind": "text",
            "text": "/"
          },
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "λ"
              }
            ]
          }
        ]
      },
      {
        "kind": "text",
        "text": ", and summing that over the depth leaves a geometric sum, and it is summed over the cells there ACTUALLY ARE - down to the body's own depth, "
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "m"
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
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "A"
          }
        ]
      },
      {
        "kind": "text",
        "text": ", rather than down to infinity. ITS TWO LIMITS ARE THE TWO CASES AND NOTHING CHOOSES BETWEEN THEM: a body deeper than a mean free path sends its skin and goes as its AREA, and one shallower than a mean free path has nothing shadowed and goes as its MASS. Which it is, is what the mean free path says"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "how loud a body is for its size",
    "line": [
      {
        "kind": "scripted",
        "base": {
          "kind": "bar",
          "of": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "m"
                }
              ]
            }
          ]
        },
        "sub": [
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "Σ"
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
            "kind": "muted",
            "of": [
              {
                "kind": "text",
                "text": "l."
              }
            ]
          },
          {
            "kind": "count",
            "of": [
              {
                "kind": "text",
                "text": "choose"
              }
            ]
          },
          {
            "kind": "paren",
            "of": [
              {
                "kind": "scripted",
                "base": {
                  "kind": "bar",
                  "of": [
                    {
                      "kind": "var",
                      "of": [
                        {
                          "kind": "text",
                          "text": "m"
                        }
                      ]
                    }
                  ]
                },
                "sub": [
                  {
                    "kind": "var",
                    "of": [
                      {
                        "kind": "text",
                        "text": "x"
                      }
                    ]
                  }
                ]
              },
              {
                "kind": "text",
                "text": "·"
              },
              {
                "kind": "muted",
                "of": [
                  {
                    "kind": "text",
                    "text": "l."
                  }
                ]
              },
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
        "under": [
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "ν"
              }
            ]
          },
          {
            "kind": "text",
            "text": "·"
          },
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "A"
              }
            ]
          }
        ]
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "what it blocks is "
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "ν"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·A put through the skin"
        }
      ],
      [
        {
          "kind": "text",
          "text": "what it emits is "
        },
        {
          "kind": "muted",
          "of": [
            {
              "kind": "text",
              "text": "l."
            }
          ]
        },
        {
          "kind": "count",
          "of": [
            {
              "kind": "text",
              "text": "choose"
            }
          ]
        },
        {
          "kind": "paren",
          "of": [
            {
              "kind": "scripted",
              "base": {
                "kind": "bar",
                "of": [
                  {
                    "kind": "var",
                    "of": [
                      {
                        "kind": "text",
                        "text": "m"
                      }
                    ]
                  }
                ]
              },
              "sub": [
                {
                  "kind": "var",
                  "of": [
                    {
                      "kind": "text",
                      "text": "x"
                    }
                  ]
                }
              ]
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "muted",
              "of": [
                {
                  "kind": "text",
                  "text": "l."
                }
              ]
            },
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
          "text": " put through the same skin"
        }
      ],
      [
        {
          "kind": "text",
          "text": "everything but the source is common, so "
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "bar",
            "of": [
              {
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "m"
                  }
                ]
              }
            ]
          },
          "sub": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "Σ"
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
              "kind": "muted",
              "of": [
                {
                  "kind": "text",
                  "text": "l."
                }
              ]
            },
            {
              "kind": "count",
              "of": [
                {
                  "kind": "text",
                  "text": "choose"
                }
              ]
            },
            {
              "kind": "paren",
              "of": [
                {
                  "kind": "scripted",
                  "base": {
                    "kind": "bar",
                    "of": [
                      {
                        "kind": "var",
                        "of": [
                          {
                            "kind": "text",
                            "text": "m"
                          }
                        ]
                      }
                    ]
                  },
                  "sub": [
                    {
                      "kind": "var",
                      "of": [
                        {
                          "kind": "text",
                          "text": "x"
                        }
                      ]
                    }
                  ]
                },
                {
                  "kind": "text",
                  "text": "·"
                },
                {
                  "kind": "muted",
                  "of": [
                    {
                      "kind": "text",
                      "text": "l."
                    }
                  ]
                },
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
          "under": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "ν"
                }
              ]
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "A"
                }
              ]
            }
          ]
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "what a body puts out, over what the vacuum would have made where it is. Both are firings per tick counted off a rewrite, and the two mass laws differ in NOTHING ELSE - same dark share, same mean free path, same depth - so their ratio is this and carries no geometry. It is a CHARGE-TO-MASS RATIO in the other physics, and bodies fall alike exactly where it does not vary, which is what Eotvos bounds"
      }
    ],
    "measured": []
  }
];
