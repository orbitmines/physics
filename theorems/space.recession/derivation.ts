/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * space.recession, for G on any
 * (D null, DEG null), box null, null ticks.
 *
 * recession = \paren{\paren{1 - \rho}^{DEG} + \frac{\rho}{2} - \frac{\rho^{2}}{2}}·\bar{r}
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

export const THEOREM = "space.recession";
export const ASKS = "the vacuum makes space wherever it is idle. What does that do to two things sitting some distance apart?";
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
    "text": "recession = "
  },
  {
    "kind": "paren",
    "of": [
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
        "text": " + "
      },
      {
        "kind": "frac",
        "over": [
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
        "under": [
          {
            "kind": "text",
            "text": "2"
          }
        ]
      },
      {
        "kind": "text",
        "text": " - "
      },
      {
        "kind": "frac",
        "over": [
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
        "under": [
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
    "text": "·"
  },
  {
    "kind": "bar",
    "of": [
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "r"
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
        "text": " + "
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
        "text": " - "
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
    "working": [
      [
        {
          "kind": "text",
          "text": "CREATION: "
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
          "text": " into space 1"
        }
      ],
      [
        {
          "kind": "text",
          "text": "MOVEMENT, ANNIHILATION: "
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
          "text": "\\omegan"
        },
        {
          "kind": "tilde",
          "of": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "n"
                }
              ]
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
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "σ"
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
              "kind": "var",
              "of": [
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
            "text": " + "
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
            "text": " - "
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
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "r"
              }
            ]
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
            "text": "∂"
          },
          "sub": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "t"
                }
              ]
            }
          ]
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
          "text": " + "
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
          "text": " - "
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
          "text": ", every term of the space line"
        }
      ],
      [
        {
          "kind": "text",
          "text": "points between two bodies "
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
          "text": " apart: "
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
          "text": " of them"
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
              "text": " + "
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
              "text": " - "
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
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "r"
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
        "text": "the space line says every neutral point makes space at the net of what the splitting makes and the meetings take. Between two bodies there are as many such points as there is distance, so the room between them grows at that rate times that distance - nothing is pushing them and they are carried apart anyway, faster the further apart they already are"
      }
    ],
    "measured": []
  }
];
