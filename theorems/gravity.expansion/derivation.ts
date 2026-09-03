/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * gravity.expansion, for G on any
 * (D null, DEG null), box null, null ticks.
 *
 * the deficit in recession = \frac{1}{\sigma·\omega^{2}·\rho}·\nu·\paren{1 - \rho}·A·\paren{1 - \paren{1 - \sigma·\omega·\rho}^{\frac{m}{A}}}·\paren{n_{f} + 1}·\paren{-\frac{1}{\ln\paren{1 - \frac{1}{L}}}}^{2 - D}·\Gamma\paren{2 - D, -R·\ln\paren{1 - \frac{1}{L}}}
 *
 * The notation is parsed into pieces rather than into markup for any one framework:
 * map each piece's `kind` onto whatever you draw with. See `rendering/Notation.ts`.
 */
import type { Piece } from "@orbitmines/physics";

export type Step = {
  kind: "premise" | "definition" | "derived";
  via: string;
  line: Piece[];
  working: Piece[][];
  because: Piece[];
  measured: { name: string; value: number; err?: number; note?: string }[];
};

export const THEOREM = "gravity.expansion";
export const ASKS = "a body makes less space where it sits. What does that do to how fast two of them are carried apart - and is THAT the attraction?";
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
    "kind": "text",
    "text": "the deficit in recession = "
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
        "text": "σ"
      },
      {
        "kind": "text",
        "text": "·"
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "ω"
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
        "text": "·"
      },
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
    "kind": "text",
    "text": "ν"
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
        "kind": "text",
        "text": "ρ"
      }
    ]
  },
  {
    "kind": "text",
    "text": "·A·"
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
              "kind": "text",
              "text": "σ"
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "text",
              "text": "ω"
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "text",
              "text": "ρ"
            }
          ]
        },
        "sup": [
          {
            "kind": "frac",
            "over": [
              {
                "kind": "text",
                "text": "m"
              }
            ],
            "under": [
              {
                "kind": "text",
                "text": "A"
              }
            ]
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
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "n"
        },
        "sub": [
          {
            "kind": "text",
            "text": "f"
          }
        ]
      },
      {
        "kind": "text",
        "text": " + 1"
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
          "text": "-"
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
              "kind": "fn",
              "of": [
                {
                  "kind": "text",
                  "text": "ln"
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
                      "text": "L"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    "sup": [
      {
        "kind": "text",
        "text": "2 - "
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
    "text": "·"
  },
  {
    "kind": "text",
    "text": "Γ"
  },
  {
    "kind": "paren",
    "of": [
      {
        "kind": "text",
        "text": "2 - "
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
        "text": ", -R·"
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
                "kind": "text",
                "text": "L"
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
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "theorem",
    "via": "the line",
    "line": [
      {
        "kind": "text",
        "text": "the space line nets = "
      },
      {
        "kind": "text",
        "text": "ν"
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
              "kind": "text",
              "text": "ρ"
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
        "text": " + "
      },
      {
        "kind": "text",
        "text": "σ"
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
        "kind": "text",
        "text": "ρ"
      },
      {
        "kind": "text",
        "text": " - "
      },
      {
        "kind": "text",
        "text": "σ"
      },
      {
        "kind": "text",
        "text": "·"
      },
      {
        "kind": "text",
        "text": "ω"
      },
      {
        "kind": "text",
        "text": "·"
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "ρ"
        },
        "sup": [
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
          "text": "CREATION: "
        },
        {
          "kind": "text",
          "text": "ν"
        },
        {
          "kind": "paren",
          "of": [
            {
              "kind": "text",
              "text": "1 - "
            },
            {
              "kind": "text",
              "text": "ρ"
            }
          ]
        },
        {
          "kind": "text",
          "text": " into space 1"
        }
      ],
      [
        {
          "kind": "text",
          "text": "MOVEMENT, ANNIHILATION: "
        },
        {
          "kind": "text",
          "text": "σ"
        },
        {
          "kind": "text",
          "text": "\\omegan"
        },
        {
          "kind": "tilde",
          "of": [
            {
              "kind": "text",
              "text": "n"
            }
          ]
        },
        {
          "kind": "text",
          "text": " into space -1"
        }
      ],
      [
        {
          "kind": "text",
          "text": "MOVEMENT: "
        },
        {
          "kind": "text",
          "text": "σ"
        },
        {
          "kind": "paren",
          "of": [
            {
              "kind": "text",
              "text": "1 - "
            },
            {
              "kind": "text",
              "text": "ω"
            }
          ]
        },
        {
          "kind": "text",
          "text": "n into space 1"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "every term of the line does something to the space ledger - its rate, times what its gates let through, times the count one firing puts in - and what the ledger does per point per tick is those added up. Nothing is left out and nothing is counted twice, which is the whole reason for reading it off the line rather than assembling it again wherever it is wanted"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "space is made between them, and there is more of it the further apart they are",
    "line": [
      {
        "kind": "text",
        "text": "recession = "
      },
      {
        "kind": "paren",
        "of": [
          {
            "kind": "text",
            "text": "ν"
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
                  "kind": "text",
                  "text": "ρ"
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
            "text": " + "
          },
          {
            "kind": "text",
            "text": "σ"
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
            "kind": "text",
            "text": "ρ"
          },
          {
            "kind": "text",
            "text": " - "
          },
          {
            "kind": "text",
            "text": "σ"
          },
          {
            "kind": "text",
            "text": "·"
          },
          {
            "kind": "text",
            "text": "ω"
          },
          {
            "kind": "text",
            "text": "·"
          },
          {
            "kind": "scripted",
            "base": {
              "kind": "text",
              "text": "ρ"
            },
            "sup": [
              {
                "kind": "text",
                "text": "2"
              }
            ]
          }
        ]
      },
      {
        "kind": "text",
        "text": "·R"
      }
    ],
    "working": [
      [
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "∂"
          },
          "sub": [
            {
              "kind": "text",
              "text": "t"
            }
          ]
        },
        {
          "kind": "text",
          "text": "s = "
        },
        {
          "kind": "text",
          "text": "ν"
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
                "kind": "text",
                "text": "ρ"
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
          "text": " + "
        },
        {
          "kind": "text",
          "text": "σ"
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
          "kind": "text",
          "text": "ρ"
        },
        {
          "kind": "text",
          "text": " - "
        },
        {
          "kind": "text",
          "text": "σ"
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "text",
          "text": "ω"
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "ρ"
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
          "text": ", every term of the space line"
        }
      ],
      [
        {
          "kind": "text",
          "text": "points between two bodies R apart: R of them"
        }
      ],
      [
        {
          "kind": "text",
          "text": "recession = "
        },
        {
          "kind": "paren",
          "of": [
            {
              "kind": "text",
              "text": "ν"
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
                    "kind": "text",
                    "text": "ρ"
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
              "text": " + "
            },
            {
              "kind": "text",
              "text": "σ"
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
              "kind": "text",
              "text": "ρ"
            },
            {
              "kind": "text",
              "text": " - "
            },
            {
              "kind": "text",
              "text": "σ"
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "text",
              "text": "ω"
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "scripted",
              "base": {
                "kind": "text",
                "text": "ρ"
              },
              "sup": [
                {
                  "kind": "text",
                  "text": "2"
                }
              ]
            }
          ]
        },
        {
          "kind": "text",
          "text": "·R"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "the space line says every neutral point makes space at the net of what the splitting makes and the meetings take. Between two bodies there are as many such points as there is distance, so the room between them grows at that rate times that distance - nothing is pushing them and they are carried apart anyway, faster the further apart they already are"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "and so the rate",
    "line": [
      {
        "kind": "text",
        "text": "δ"
      },
      {
        "kind": "text",
        "text": " is pushed back at "
      },
      {
        "kind": "text",
        "text": "ν"
      },
      {
        "kind": "text",
        "text": " + 2·"
      },
      {
        "kind": "text",
        "text": "ρ"
      },
      {
        "kind": "text",
        "text": "·"
      },
      {
        "kind": "text",
        "text": "σ"
      },
      {
        "kind": "text",
        "text": "·"
      },
      {
        "kind": "text",
        "text": "ω"
      },
      {
        "kind": "text",
        "text": " - "
      },
      {
        "kind": "text",
        "text": "σ"
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
            "kind": "text",
            "text": "ω"
          }
        ]
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "ν"
        },
        {
          "kind": "paren",
          "of": [
            {
              "kind": "text",
              "text": "1 - "
            },
            {
              "kind": "text",
              "text": "ρ"
            }
          ]
        },
        {
          "kind": "text",
          "text": ": "
        },
        {
          "kind": "text",
          "text": "ν"
        }
      ],
      [
        {
          "kind": "text",
          "text": "σ"
        },
        {
          "kind": "text",
          "text": "\\omegan"
        },
        {
          "kind": "tilde",
          "of": [
            {
              "kind": "text",
              "text": "n"
            }
          ]
        },
        {
          "kind": "text",
          "text": ": 2·"
        },
        {
          "kind": "text",
          "text": "ρ"
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "text",
          "text": "σ"
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "text",
          "text": "ω"
        }
      ],
      [
        {
          "kind": "text",
          "text": "σ"
        },
        {
          "kind": "paren",
          "of": [
            {
              "kind": "text",
              "text": "1 - "
            },
            {
              "kind": "text",
              "text": "ω"
            }
          ]
        },
        {
          "kind": "text",
          "text": "n: -"
        },
        {
          "kind": "text",
          "text": "σ"
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
              "kind": "text",
              "text": "ω"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "a = "
        },
        {
          "kind": "text",
          "text": "ν"
        },
        {
          "kind": "text",
          "text": " + 2·"
        },
        {
          "kind": "text",
          "text": "ρ"
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "text",
          "text": "σ"
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "text",
          "text": "ω"
        },
        {
          "kind": "text",
          "text": " - "
        },
        {
          "kind": "text",
          "text": "σ"
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
              "kind": "text",
              "text": "ω"
            }
          ]
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "every term that depends on the density answers a change in it, and they do not consult one another - so what the line does back to a shortfall is their sum"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "the kernel",
    "line": [
      {
        "kind": "text",
        "text": "δ"
      },
      {
        "kind": "text",
        "text": " is conserved on its way out"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "a turn that keeps the heading does not lose the shortfall, so as much of it crosses a far shell as a near one - which is what the dilution argument needs and what a kernel that forgot the direction would not give"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "the lattice",
    "line": [
      {
        "kind": "text",
        "text": "δ"
      },
      {
        "kind": "text",
        "text": " goes every way alike"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "the tiling has no preferred direction, so what spreads through it goes every way alike"
      }
    ],
    "measured": []
  },
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
          "kind": "text",
          "text": "r"
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
          "text": "(p): the ways out of a point, "
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
            "kind": "text",
            "text": "r"
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
          "text": "(r) = "
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
          "text": "(r) - "
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
          "text": "(r-1) ∝ "
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "r"
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
          "kind": "text",
          "text": "r"
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
          "kind": "text",
          "text": "r"
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
    "via": "spreading",
    "line": [
      {
        "kind": "text",
        "text": "δ"
      },
      {
        "kind": "text",
        "text": " per site = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "δ"
          },
          {
            "kind": "text",
            "text": "·"
          },
          {
            "kind": "scripted",
            "base": {
              "kind": "text",
              "text": "r"
            },
            "sup": [
              {
                "kind": "text",
                "text": "-"
              },
              {
                "kind": "paren",
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
                    "text": " - 1"
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
                "kind": "scripted",
                "base": {
                  "kind": "text",
                  "text": "n"
                },
                "sub": [
                  {
                    "kind": "text",
                    "text": "f"
                  }
                ]
              },
              {
                "kind": "text",
                "text": " + 1"
              }
            ]
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "ω"
          }
        ]
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "what crosses one site: "
        },
        {
          "kind": "text",
          "text": "δ"
        },
        {
          "kind": "text",
          "text": "/shell = "
        },
        {
          "kind": "text",
          "text": "δ"
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "r"
          },
          "sup": [
            {
              "kind": "text",
              "text": "-"
            },
            {
              "kind": "paren",
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
                  "text": " - 1"
                }
              ]
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "and it dwells 1/v there, with v = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "ω"
            }
          ],
          "under": [
            {
              "kind": "scripted",
              "base": {
                "kind": "text",
                "text": "n"
              },
              "sub": [
                {
                  "kind": "text",
                  "text": "f"
                }
              ]
            },
            {
              "kind": "text",
              "text": " + 1"
            }
          ]
        },
        {
          "kind": "text",
          "text": " off turns's own draw"
        }
      ],
      [
        {
          "kind": "text",
          "text": "δ"
        },
        {
          "kind": "text",
          "text": " per site = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "δ"
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "scripted",
              "base": {
                "kind": "text",
                "text": "r"
              },
              "sup": [
                {
                  "kind": "text",
                  "text": "-"
                },
                {
                  "kind": "paren",
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
                      "text": " - 1"
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
                  "kind": "scripted",
                  "base": {
                    "kind": "text",
                    "text": "n"
                  },
                  "sub": [
                    {
                      "kind": "text",
                      "text": "f"
                    }
                  ]
                },
                {
                  "kind": "text",
                  "text": " + 1"
                }
              ]
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "ω"
            }
          ]
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "count what crosses a shell in one tick - the sites on it, times what is at each, times the share of a step that went outward - and MOVEMENT neither makes nor destroys, so that count is carried outward unchanged. So what CROSSES one site is the whole of it over the number of sites there are at that distance. What IS at one site is that again over how fast a share gets across, and how fast a share gets across is not a constant: a carrier with nowhere to step makes the room instead and does not move, so it dwells longer exactly where the medium is thin. Solving the conservation with that speed in it is one quadratic with one root that is not negative - the old line where the medium is dense, and a square root where it is not"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "what is pushed back is screened",
    "line": [
      {
        "kind": "text",
        "text": "δ"
      },
      {
        "kind": "text",
        "text": " screened = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "δ"
          },
          {
            "kind": "text",
            "text": "·"
          },
          {
            "kind": "scripted",
            "base": {
              "kind": "text",
              "text": "r"
            },
            "sup": [
              {
                "kind": "text",
                "text": "-"
              },
              {
                "kind": "paren",
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
                    "text": " - 1"
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
                "kind": "scripted",
                "base": {
                  "kind": "text",
                  "text": "n"
                },
                "sub": [
                  {
                    "kind": "text",
                    "text": "f"
                  }
                ]
              },
              {
                "kind": "text",
                "text": " + 1"
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
                      "text": "L"
                    }
                  ]
                }
              ]
            },
            "sup": [
              {
                "kind": "text",
                "text": "r"
              }
            ]
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "ω"
          }
        ]
      }
    ],
    "working": [
      [
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "∇"
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
          "text": "δ"
        },
        {
          "kind": "text",
          "text": " = "
        },
        {
          "kind": "text",
          "text": "ν"
        },
        {
          "kind": "text",
          "text": " + 2·"
        },
        {
          "kind": "text",
          "text": "ρ"
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "text",
          "text": "σ"
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "text",
          "text": "ω"
        },
        {
          "kind": "text",
          "text": " - "
        },
        {
          "kind": "text",
          "text": "σ"
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
            "kind": "text",
            "text": "σ"
          },
          "sub": [
            {
              "kind": "text",
              "text": "tr"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "text",
          "text": "δ"
        }
      ],
      [
        {
          "kind": "text",
          "text": "what spreads: "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "δ"
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "scripted",
              "base": {
                "kind": "text",
                "text": "r"
              },
              "sup": [
                {
                  "kind": "text",
                  "text": "-"
                },
                {
                  "kind": "paren",
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
                      "text": " - 1"
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
                  "kind": "scripted",
                  "base": {
                    "kind": "text",
                    "text": "n"
                  },
                  "sub": [
                    {
                      "kind": "text",
                      "text": "f"
                    }
                  ]
                },
                {
                  "kind": "text",
                  "text": " + 1"
                }
              ]
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "ω"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "a carrier survives one step with 1 - 1/L, and r steps with that r times over"
        }
      ],
      [
        {
          "kind": "text",
          "text": "damped: "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "δ"
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "scripted",
              "base": {
                "kind": "text",
                "text": "r"
              },
              "sup": [
                {
                  "kind": "text",
                  "text": "-"
                },
                {
                  "kind": "paren",
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
                      "text": " - 1"
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
                  "kind": "scripted",
                  "base": {
                    "kind": "text",
                    "text": "n"
                  },
                  "sub": [
                    {
                      "kind": "text",
                      "text": "f"
                    }
                  ]
                },
                {
                  "kind": "text",
                  "text": " + 1"
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
                        "text": "L"
                      }
                    ]
                  }
                ]
              },
              "sup": [
                {
                  "kind": "text",
                  "text": "r"
                }
              ]
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "ω"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "L = "
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
              "kind": "sqrt",
              "of": [
                {
                  "kind": "paren",
                  "of": [
                    {
                      "kind": "text",
                      "text": "ν"
                    },
                    {
                      "kind": "text",
                      "text": " + 2·"
                    },
                    {
                      "kind": "text",
                      "text": "ρ"
                    },
                    {
                      "kind": "text",
                      "text": "·"
                    },
                    {
                      "kind": "text",
                      "text": "σ"
                    },
                    {
                      "kind": "text",
                      "text": "·"
                    },
                    {
                      "kind": "text",
                      "text": "ω"
                    },
                    {
                      "kind": "text",
                      "text": " - "
                    },
                    {
                      "kind": "text",
                      "text": "σ"
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
                          "kind": "text",
                          "text": "ω"
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
                    "kind": "text",
                    "text": "σ"
                  },
                  "sub": [
                    {
                      "kind": "text",
                      "text": "tr"
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
        "text": "δ"
      },
      {
        "kind": "text",
        "text": " is pushed back at "
      },
      {
        "kind": "text",
        "text": "ν"
      },
      {
        "kind": "text",
        "text": " + 2·"
      },
      {
        "kind": "text",
        "text": "ρ"
      },
      {
        "kind": "text",
        "text": "·"
      },
      {
        "kind": "text",
        "text": "σ"
      },
      {
        "kind": "text",
        "text": "·"
      },
      {
        "kind": "text",
        "text": "ω"
      },
      {
        "kind": "text",
        "text": " - "
      },
      {
        "kind": "text",
        "text": "σ"
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
            "kind": "text",
            "text": "ω"
          }
        ]
      },
      {
        "kind": "text",
        "text": ", so what spreads is damped as well as diluted - and the range is where the two balance. WHAT SURVIVES IS A POWER: a carrier takes whole steps and on each one it is either destroyed or it is not, so surviving r steps is surviving one, r times over. An exponential is that in the limit where no single step can matter, which is a continuum this lattice has not got"
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
            "kind": "text",
            "text": "d"
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
              "kind": "text",
              "text": "d"
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
        "kind": "text",
        "text": "S = "
      },
      {
        "kind": "text",
        "text": "ν"
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
            "kind": "text",
            "text": "ρ"
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
    "kind": "rule",
    "via": "MOVEMENT",
    "line": [
      {
        "kind": "text",
        "text": "what is taken = "
      },
      {
        "kind": "text",
        "text": "σ"
      },
      {
        "kind": "text",
        "text": "·"
      },
      {
        "kind": "text",
        "text": "ω"
      },
      {
        "kind": "text",
        "text": "·"
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "ρ"
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
        "kind": "text",
        "text": "σ"
      },
      {
        "kind": "text",
        "text": "·"
      },
      {
        "kind": "text",
        "text": "ω"
      },
      {
        "kind": "text",
        "text": "·"
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "ρ"
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
        "kind": "text",
        "text": "ν"
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
              "kind": "text",
              "text": "ρ"
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
        "kind": "text",
        "text": "ν"
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
              "kind": "text",
              "text": "ρ"
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
          "kind": "text",
          "text": "ρ"
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
        "kind": "text",
        "text": "ρ"
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
              "kind": "text",
              "text": "ρ"
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
        "text": " - F·"
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "ρ"
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
          "kind": "text",
          "text": "ν"
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
                "kind": "text",
                "text": "ρ"
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
          "kind": "text",
          "text": "σ"
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "text",
          "text": "ω"
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "ρ"
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
          "kind": "text",
          "text": "ν"
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
                "kind": "text",
                "text": "ρ"
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
          "kind": "text",
          "text": "ν"
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
                "kind": "text",
                "text": "ρ"
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
          "text": " + -2·F·"
        },
        {
          "kind": "text",
          "text": "σ"
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "text",
          "text": "ω"
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "ρ"
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
            "kind": "text",
            "text": "ρ"
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
          "kind": "text",
          "text": "ρ"
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
                "kind": "text",
                "text": "ρ"
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
          "text": " - F·"
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "ρ"
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
        "kind": "text",
        "text": "λ"
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
            "kind": "text",
            "text": "σ"
          },
          {
            "kind": "text",
            "text": "·"
          },
          {
            "kind": "text",
            "text": "ω"
          },
          {
            "kind": "text",
            "text": "·"
          },
          {
            "kind": "text",
            "text": "ρ"
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
          "kind": "text",
          "text": "σ"
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "text",
          "text": "ω"
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "ρ"
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
          "kind": "text",
          "text": "ρ"
        }
      ],
      [
        {
          "kind": "text",
          "text": "λ"
        },
        {
          "kind": "text",
          "text": " = 1/("
        },
        {
          "kind": "text",
          "text": "σ"
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "text",
          "text": "ω"
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "text",
          "text": "ρ"
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
              "kind": "text",
              "text": "σ"
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "text",
              "text": "ω"
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "text",
              "text": "ρ"
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
            "kind": "text",
            "text": "ν"
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
                "kind": "text",
                "text": "ρ"
              }
            ]
          },
          {
            "kind": "text",
            "text": "·A·"
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
                      "kind": "text",
                      "text": "σ"
                    },
                    {
                      "kind": "text",
                      "text": "·"
                    },
                    {
                      "kind": "text",
                      "text": "ω"
                    },
                    {
                      "kind": "text",
                      "text": "·"
                    },
                    {
                      "kind": "text",
                      "text": "ρ"
                    }
                  ]
                },
                "sup": [
                  {
                    "kind": "frac",
                    "over": [
                      {
                        "kind": "text",
                        "text": "m"
                      }
                    ],
                    "under": [
                      {
                        "kind": "text",
                        "text": "A"
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
            "kind": "text",
            "text": "σ"
          },
          {
            "kind": "text",
            "text": "·"
          },
          {
            "kind": "text",
            "text": "ω"
          },
          {
            "kind": "text",
            "text": "·"
          },
          {
            "kind": "text",
            "text": "ρ"
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
          "kind": "text",
          "text": "ν"
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
              "kind": "text",
              "text": "ρ"
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
          "kind": "text",
          "text": "σ"
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "text",
          "text": "ω"
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "ρ"
          },
          "sup": [
            {
              "kind": "text",
              "text": "d"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "the body is T = m/A deep, so the sum runs to there and not past it"
        }
      ],
      [
        {
          "kind": "sum",
          "from": [
            {
              "kind": "text",
              "text": "d=0"
            }
          ],
          "to": [
            {
              "kind": "text",
              "text": "T"
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
            "kind": "text",
            "text": "q"
          },
          "sup": [
            {
              "kind": "text",
              "text": "d"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = "
        },
        {
          "kind": "text",
          "text": "λ"
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
                "kind": "text",
                "text": "q"
              },
              "sup": [
                {
                  "kind": "text",
                  "text": "T"
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
          "kind": "text",
          "text": "λ"
        },
        {
          "kind": "text",
          "text": ", the skin.  shallow: it is T, the whole of it"
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
              "kind": "text",
              "text": "ν"
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
                  "kind": "text",
                  "text": "ρ"
                }
              ]
            },
            {
              "kind": "text",
              "text": "·A·"
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
                        "kind": "text",
                        "text": "σ"
                      },
                      {
                        "kind": "text",
                        "text": "·"
                      },
                      {
                        "kind": "text",
                        "text": "ω"
                      },
                      {
                        "kind": "text",
                        "text": "·"
                      },
                      {
                        "kind": "text",
                        "text": "ρ"
                      }
                    ]
                  },
                  "sup": [
                    {
                      "kind": "frac",
                      "over": [
                        {
                          "kind": "text",
                          "text": "m"
                        }
                      ],
                      "under": [
                        {
                          "kind": "text",
                          "text": "A"
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
              "kind": "text",
              "text": "σ"
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "text",
              "text": "ω"
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "text",
              "text": "ρ"
            }
          ]
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "a body prevents the making at every cell it owns, so what it HOLDS goes as its bulk. What it SENDS does not: a cell's output has to cross the cells outside it, and the meeting term thins it exactly as it thins one body's radiation against another's - the rule has no notion of which body a ray belongs to. A cell at depth d therefore reaches the outside attenuated by "
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "e"
        },
        "sup": [
          {
            "kind": "text",
            "text": "-d/"
          },
          {
            "kind": "text",
            "text": "λ"
          }
        ]
      },
      {
        "kind": "text",
        "text": ", and summing that over the depth leaves a geometric sum, and it is summed over the cells there ACTUALLY ARE - down to the body's own depth, m/A, rather than down to infinity. ITS TWO LIMITS ARE THE TWO CASES AND NOTHING CHOOSES BETWEEN THEM: a body deeper than a mean free path sends its skin and goes as its AREA, and one shallower than a mean free path has nothing shadowed and goes as its MASS. Which it is, is what the mean free path says"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "and a body makes less of it, so they are carried apart more slowly",
    "line": [
      {
        "kind": "text",
        "text": "the deficit in recession = "
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
            "text": "σ"
          },
          {
            "kind": "text",
            "text": "·"
          },
          {
            "kind": "scripted",
            "base": {
              "kind": "text",
              "text": "ω"
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
            "text": "·"
          },
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
        "kind": "text",
        "text": "ν"
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
            "kind": "text",
            "text": "ρ"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·A·"
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
                  "kind": "text",
                  "text": "σ"
                },
                {
                  "kind": "text",
                  "text": "·"
                },
                {
                  "kind": "text",
                  "text": "ω"
                },
                {
                  "kind": "text",
                  "text": "·"
                },
                {
                  "kind": "text",
                  "text": "ρ"
                }
              ]
            },
            "sup": [
              {
                "kind": "frac",
                "over": [
                  {
                    "kind": "text",
                    "text": "m"
                  }
                ],
                "under": [
                  {
                    "kind": "text",
                    "text": "A"
                  }
                ]
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
            "kind": "scripted",
            "base": {
              "kind": "text",
              "text": "n"
            },
            "sub": [
              {
                "kind": "text",
                "text": "f"
              }
            ]
          },
          {
            "kind": "text",
            "text": " + 1"
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
              "text": "-"
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
                  "kind": "fn",
                  "of": [
                    {
                      "kind": "text",
                      "text": "ln"
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
                          "text": "L"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        "sup": [
          {
            "kind": "text",
            "text": "2 - "
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
        "text": "·"
      },
      {
        "kind": "text",
        "text": "Γ"
      },
      {
        "kind": "paren",
        "of": [
          {
            "kind": "text",
            "text": "2 - "
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
            "text": ", -R·"
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
                    "kind": "text",
                    "text": "L"
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
          "kind": "text",
          "text": "recession = "
        },
        {
          "kind": "paren",
          "of": [
            {
              "kind": "text",
              "text": "ν"
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
                    "kind": "text",
                    "text": "ρ"
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
              "text": " + "
            },
            {
              "kind": "text",
              "text": "σ"
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
              "kind": "text",
              "text": "ρ"
            },
            {
              "kind": "text",
              "text": " - "
            },
            {
              "kind": "text",
              "text": "σ"
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "text",
              "text": "ω"
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "scripted",
              "base": {
                "kind": "text",
                "text": "ρ"
              },
              "sup": [
                {
                  "kind": "text",
                  "text": "2"
                }
              ]
            }
          ]
        },
        {
          "kind": "text",
          "text": "·R"
        }
      ],
      [
        {
          "kind": "text",
          "text": "the shortfall at each point is the body's own, carried: "
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
              "text": "σ"
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "text",
              "text": "ω"
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "text",
              "text": "ρ"
            },
            {
              "kind": "text",
              "text": "·"
            },
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
          "kind": "text",
          "text": "ν"
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
              "kind": "text",
              "text": "ρ"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·A·"
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
                    "kind": "text",
                    "text": "σ"
                  },
                  {
                    "kind": "text",
                    "text": "·"
                  },
                  {
                    "kind": "text",
                    "text": "ω"
                  },
                  {
                    "kind": "text",
                    "text": "·"
                  },
                  {
                    "kind": "text",
                    "text": "ρ"
                  }
                ]
              },
              "sup": [
                {
                  "kind": "frac",
                  "over": [
                    {
                      "kind": "text",
                      "text": "m"
                    }
                  ],
                  "under": [
                    {
                      "kind": "text",
                      "text": "A"
                    }
                  ]
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
            "kind": "text",
            "text": "r"
          },
          "sup": [
            {
              "kind": "text",
              "text": "-"
            },
            {
              "kind": "paren",
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
                  "text": " - 1"
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
              "kind": "scripted",
              "base": {
                "kind": "text",
                "text": "n"
              },
              "sub": [
                {
                  "kind": "text",
                  "text": "f"
                }
              ]
            },
            {
              "kind": "text",
              "text": " + 1"
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
                    "text": "L"
                  }
                ]
              }
            ]
          },
          "sup": [
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
          "text": "far out that comes to "
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
              "text": "σ"
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "scripted",
              "base": {
                "kind": "text",
                "text": "ω"
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
              "text": "·"
            },
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
          "kind": "text",
          "text": "ν"
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
              "kind": "text",
              "text": "ρ"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·A·"
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
                    "kind": "text",
                    "text": "σ"
                  },
                  {
                    "kind": "text",
                    "text": "·"
                  },
                  {
                    "kind": "text",
                    "text": "ω"
                  },
                  {
                    "kind": "text",
                    "text": "·"
                  },
                  {
                    "kind": "text",
                    "text": "ρ"
                  }
                ]
              },
              "sup": [
                {
                  "kind": "frac",
                  "over": [
                    {
                      "kind": "text",
                      "text": "m"
                    }
                  ],
                  "under": [
                    {
                      "kind": "text",
                      "text": "A"
                    }
                  ]
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
            "kind": "text",
            "text": "r"
          },
          "sup": [
            {
              "kind": "text",
              "text": "-"
            },
            {
              "kind": "paren",
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
                  "text": " - 1"
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
              "kind": "scripted",
              "base": {
                "kind": "text",
                "text": "n"
              },
              "sub": [
                {
                  "kind": "text",
                  "text": "f"
                }
              ]
            },
            {
              "kind": "text",
              "text": " + 1"
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
                    "text": "L"
                  }
                ]
              }
            ]
          },
          "sup": [
            {
              "kind": "text",
              "text": "r"
            }
          ]
        }
      ],
      [
        {
          "kind": "int",
          "from": [],
          "to": []
        },
        {
          "kind": "text",
          "text": " of that dr = -"
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
              "text": "σ"
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "scripted",
              "base": {
                "kind": "text",
                "text": "ω"
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
              "text": "·"
            },
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
          "kind": "text",
          "text": "ν"
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
              "kind": "text",
              "text": "ρ"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·A·"
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
                    "kind": "text",
                    "text": "σ"
                  },
                  {
                    "kind": "text",
                    "text": "·"
                  },
                  {
                    "kind": "text",
                    "text": "ω"
                  },
                  {
                    "kind": "text",
                    "text": "·"
                  },
                  {
                    "kind": "text",
                    "text": "ρ"
                  }
                ]
              },
              "sup": [
                {
                  "kind": "frac",
                  "over": [
                    {
                      "kind": "text",
                      "text": "m"
                    }
                  ],
                  "under": [
                    {
                      "kind": "text",
                      "text": "A"
                    }
                  ]
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
              "kind": "scripted",
              "base": {
                "kind": "text",
                "text": "n"
              },
              "sub": [
                {
                  "kind": "text",
                  "text": "f"
                }
              ]
            },
            {
              "kind": "text",
              "text": " + 1"
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
                "text": "-"
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
                    "kind": "fn",
                    "of": [
                      {
                        "kind": "text",
                        "text": "ln"
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
                            "text": "L"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          "sup": [
            {
              "kind": "text",
              "text": "2 - "
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
          "text": "·"
        },
        {
          "kind": "text",
          "text": "Γ"
        },
        {
          "kind": "paren",
          "of": [
            {
              "kind": "text",
              "text": "2 - "
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
              "text": ", -r·"
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
                      "kind": "text",
                      "text": "L"
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
          "text": "the deficit in recession = "
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
              "text": "σ"
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "scripted",
              "base": {
                "kind": "text",
                "text": "ω"
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
              "text": "·"
            },
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
          "kind": "text",
          "text": "ν"
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
              "kind": "text",
              "text": "ρ"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·A·"
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
                    "kind": "text",
                    "text": "σ"
                  },
                  {
                    "kind": "text",
                    "text": "·"
                  },
                  {
                    "kind": "text",
                    "text": "ω"
                  },
                  {
                    "kind": "text",
                    "text": "·"
                  },
                  {
                    "kind": "text",
                    "text": "ρ"
                  }
                ]
              },
              "sup": [
                {
                  "kind": "frac",
                  "over": [
                    {
                      "kind": "text",
                      "text": "m"
                    }
                  ],
                  "under": [
                    {
                      "kind": "text",
                      "text": "A"
                    }
                  ]
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
              "kind": "scripted",
              "base": {
                "kind": "text",
                "text": "n"
              },
              "sub": [
                {
                  "kind": "text",
                  "text": "f"
                }
              ]
            },
            {
              "kind": "text",
              "text": " + 1"
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
                "text": "-"
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
                    "kind": "fn",
                    "of": [
                      {
                        "kind": "text",
                        "text": "ln"
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
                            "text": "L"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          "sup": [
            {
              "kind": "text",
              "text": "2 - "
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
          "text": "·"
        },
        {
          "kind": "text",
          "text": "Γ"
        },
        {
          "kind": "paren",
          "of": [
            {
              "kind": "text",
              "text": "2 - "
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
              "text": ", -R·"
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
                      "kind": "text",
                      "text": "L"
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
        "text": "the room between two bodies grows at the making rate times how many points there are, and a body has reduced that rate at every one of them. Summed along the line - integrated by the algebra over whatever profile the transport gave, not over a power assumed in advance - that is the deficit in how fast they are carried apart, and it is what an attraction IS in a model whose gravity is an expansion that did not happen"
      }
    ],
    "measured": []
  }
];
