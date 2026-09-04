/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * gravity.newton, for G on any
 * (D null, DEG null), box null, null ticks.
 *
 * F_{g} \aside{at} D \aside{= 3} = \frac{\bar{m}·\bar{m}'}{\bar{r}^{2}}·\paren{T_{vac} + \mathcal{D}·\mathcal{D}'·\paren{\frac{4·\ln\paren{\bar{r}}}{\bar{r}} + 1}}·\paren{\frac{a_{0}}{recur} + 1}
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

export const THEOREM = "gravity.newton";
export const ASKS = "the law is written with the dimension as a symbol. Put three in - what is the force between two bodies in the world we live in?";
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
      "kind": "var",
      "of": [
        {
          "kind": "text",
          "text": "F"
        }
      ]
    },
    "sub": [
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "g"
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
        "text": "at"
      }
    ]
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
        "text": "D"
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
        "text": "= 3"
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
                "text": "m"
              }
            ]
          }
        ]
      },
      {
        "kind": "text",
        "text": "'"
      }
    ],
    "under": [
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
                  "text": "r"
                }
              ]
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
    "kind": "paren",
    "of": [
      {
        "kind": "scripted",
        "base": {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "T"
            }
          ]
        },
        "sub": [
          {
            "kind": "text",
            "text": "vac"
          }
        ]
      },
      {
        "kind": "text",
        "text": " + "
      },
      {
        "kind": "cal",
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
        "kind": "cal",
        "of": [
          {
            "kind": "text",
            "text": "D"
          }
        ]
      },
      {
        "kind": "text",
        "text": "'·"
      },
      {
        "kind": "paren",
        "of": [
          {
            "kind": "frac",
            "over": [
              {
                "kind": "text",
                "text": "4·"
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
              }
            ],
            "under": [
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
          },
          {
            "kind": "text",
            "text": " + 1"
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
        "kind": "frac",
        "over": [
          {
            "kind": "scripted",
            "base": {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "a"
                }
              ]
            },
            "sub": [
              {
                "kind": "text",
                "text": "0"
              }
            ]
          }
        ],
        "under": [
          {
            "kind": "fn",
            "of": [
              {
                "kind": "text",
                "text": "recur"
              }
            ]
          }
        ]
      },
      {
        "kind": "text",
        "text": " + 1"
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
    "via": "and so the rate",
    "line": [
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "δ"
          }
        ]
      },
      {
        "kind": "text",
        "text": " is pushed back at "
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
        "text": " + 2·"
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
          "text": ": "
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "ν"
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
          "text": ": 2·"
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
        }
      ],
      [
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
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "n"
            }
          ]
        },
        {
          "kind": "text",
          "text": ": -"
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
        }
      ],
      [
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "a"
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
          "text": " + 2·"
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
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "δ"
          }
        ]
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
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "δ"
          }
        ]
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
    "via": "spreading",
    "line": [
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "δ"
          }
        ]
      },
      {
        "kind": "text",
        "text": " per site = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "δ"
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
                  "text": "r"
                }
              ]
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
                  "kind": "var",
                  "of": [
                    {
                      "kind": "text",
                      "text": "n"
                    }
                  ]
                },
                "sub": [
                  {
                    "kind": "var",
                    "of": [
                      {
                        "kind": "text",
                        "text": "f"
                      }
                    ]
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
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "ω"
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
          "text": "what crosses one site: "
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "δ"
            }
          ]
        },
        {
          "kind": "text",
          "text": "/shell = "
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "δ"
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
                "text": "r"
              }
            ]
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
          "text": "and it dwells 1/v there, with "
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "v"
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
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "ω"
                }
              ]
            }
          ],
          "under": [
            {
              "kind": "scripted",
              "base": {
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "n"
                  }
                ]
              },
              "sub": [
                {
                  "kind": "var",
                  "of": [
                    {
                      "kind": "text",
                      "text": "f"
                    }
                  ]
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
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "δ"
            }
          ]
        },
        {
          "kind": "text",
          "text": " per site = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "δ"
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
                    "text": "r"
                  }
                ]
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
                    "kind": "var",
                    "of": [
                      {
                        "kind": "text",
                        "text": "n"
                      }
                    ]
                  },
                  "sub": [
                    {
                      "kind": "var",
                      "of": [
                        {
                          "kind": "text",
                          "text": "f"
                        }
                      ]
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
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "ω"
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
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "δ"
          }
        ]
      },
      {
        "kind": "text",
        "text": " screened = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "δ"
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
                  "text": "r"
                }
              ]
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
                  "kind": "var",
                  "of": [
                    {
                      "kind": "text",
                      "text": "n"
                    }
                  ]
                },
                "sub": [
                  {
                    "kind": "var",
                    "of": [
                      {
                        "kind": "text",
                        "text": "f"
                      }
                    ]
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
                      "kind": "var",
                      "of": [
                        {
                          "kind": "text",
                          "text": "L"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            "sup": [
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
        "under": [
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
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "δ"
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
          "text": " + 2·"
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
          "kind": "scripted",
          "base": {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "σ"
              }
            ]
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
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "δ"
            }
          ]
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
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "δ"
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
                    "text": "r"
                  }
                ]
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
                    "kind": "var",
                    "of": [
                      {
                        "kind": "text",
                        "text": "n"
                      }
                    ]
                  },
                  "sub": [
                    {
                      "kind": "var",
                      "of": [
                        {
                          "kind": "text",
                          "text": "f"
                        }
                      ]
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
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "ω"
                }
              ]
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "a carrier survives one step with 1 - 1/"
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "L"
            }
          ]
        },
        {
          "kind": "text",
          "text": ", and r steps with that r times over"
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
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "δ"
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
                    "text": "r"
                  }
                ]
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
                    "kind": "var",
                    "of": [
                      {
                        "kind": "text",
                        "text": "n"
                      }
                    ]
                  },
                  "sub": [
                    {
                      "kind": "var",
                      "of": [
                        {
                          "kind": "text",
                          "text": "f"
                        }
                      ]
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
                        "kind": "var",
                        "of": [
                          {
                            "kind": "text",
                            "text": "L"
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              "sup": [
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
          "under": [
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
        }
      ],
      [
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "L"
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
              "kind": "sqrt",
              "of": [
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
                      "text": " + 2·"
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
                        "text": "σ"
                      }
                    ]
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
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "δ"
          }
        ]
      },
      {
        "kind": "text",
        "text": " is pushed back at "
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
        "text": " + 2·"
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
        "text": ", so what spreads is damped as well as diluted - and the range is where the two balance. WHAT SURVIVES IS A POWER: a carrier takes whole steps and on each one it is either destroyed or it is not, so surviving r steps is surviving one, r times over. An exponential is that in the limit where no single step can matter, which is a continuum this lattice has not got"
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
                    "text": "β"
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
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "Σ"
                }
              ]
            },
            "sub": [
              {
                "kind": "text",
                "text": "0"
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
                      "text": "β"
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
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "Σ"
                  }
                ]
              },
              "sub": [
                {
                  "kind": "text",
                  "text": "0"
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
    "via": "what is there per site, times the sites it has",
    "line": [
      {
        "kind": "text",
        "text": "what a body is open to = "
      },
      {
        "kind": "frac",
        "over": [
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
                    "text": "β"
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
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "Σ"
                }
              ]
            },
            "sub": [
              {
                "kind": "text",
                "text": "0"
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
            "text": "'·"
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
                  },
                  {
                    "kind": "text",
                    "text": "'"
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
          "text": "the emitting side is "
        },
        {
          "kind": "frac",
          "over": [
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
                      "text": "β"
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
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "Σ"
                  }
                ]
              },
              "sub": [
                {
                  "kind": "text",
                  "text": "0"
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
      [
        {
          "kind": "text",
          "text": "and the far body is the same law about the far body"
        }
      ],
      [
        {
          "kind": "text",
          "text": "what it is open to = "
        },
        {
          "kind": "frac",
          "over": [
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
                      "text": "β"
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
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "Σ"
                  }
                ]
              },
              "sub": [
                {
                  "kind": "text",
                  "text": "0"
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
              "text": "'·"
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
                    },
                    {
                      "kind": "text",
                      "text": "'"
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
        "text": "a body is open the way it is emitting: on its skin. The rules never say that a cell hidden behind another can still take what the front one stopped, and `shadowing` is the same argument whichever way the rays are going - so what a body is open to is its own mass, the same law the emitting side is written in, and not a count of its cells times the ways out of one"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "the kernel",
    "line": [
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "Σ"
          }
        ]
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
        "text": "what a source puts out survives its own transport for the same reason a shortfall does - a turn that keeps the heading loses none of it"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "put in from outside",
    "line": [
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "Σ"
          }
        ]
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
        "text": "a body lights its exits alike, so what leaves it goes every way alike"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "spreading",
    "line": [
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "Σ"
          }
        ]
      },
      {
        "kind": "text",
        "text": " per site = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "Σ"
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
                  "text": "r"
                }
              ]
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
                  "kind": "var",
                  "of": [
                    {
                      "kind": "text",
                      "text": "n"
                    }
                  ]
                },
                "sub": [
                  {
                    "kind": "var",
                    "of": [
                      {
                        "kind": "text",
                        "text": "f"
                      }
                    ]
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
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "ω"
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
          "text": "what crosses one site: "
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "Σ"
            }
          ]
        },
        {
          "kind": "text",
          "text": "/shell = "
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "Σ"
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
                "text": "r"
              }
            ]
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
          "text": "and it dwells 1/v there, with "
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "v"
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
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "ω"
                }
              ]
            }
          ],
          "under": [
            {
              "kind": "scripted",
              "base": {
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "n"
                  }
                ]
              },
              "sub": [
                {
                  "kind": "var",
                  "of": [
                    {
                      "kind": "text",
                      "text": "f"
                    }
                  ]
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
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "Σ"
            }
          ]
        },
        {
          "kind": "text",
          "text": " per site = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "Σ"
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
                    "text": "r"
                  }
                ]
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
                    "kind": "var",
                    "of": [
                      {
                        "kind": "text",
                        "text": "n"
                      }
                    ]
                  },
                  "sub": [
                    {
                      "kind": "var",
                      "of": [
                        {
                          "kind": "text",
                          "text": "f"
                        }
                      ]
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
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "ω"
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
        "text": "count what crosses a shell in one tick - the sites on it, times what is at each, times the share of a step that went outward - and MOVEMENT neither makes nor destroys, so that count is carried outward unchanged. So what CROSSES one site is the whole of it over the number of sites there are at that distance. What IS at one site is that again over how fast a share gets across, and how fast a share gets across is not a constant: a carrier with nowhere to step makes the room instead and does not move, so it dwells longer exactly where the medium is thin. Solving the conservation with that speed in it is one quadratic with one root that is not negative - the old line where the medium is dense, and a square root where it is not"
      }
    ],
    "measured": []
  },
  {
    "kind": "rule",
    "via": "MOVEMENT",
    "line": [
      {
        "kind": "count",
        "of": [
          {
            "kind": "bar",
            "of": [
              {
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "c"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "kind": "text",
        "text": " = 1"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "every active ray goes ONE CELL along its own exit in one tick, which is what the streaming term says - so a step is one cell, and that is the only length the lattice has to measure anything else against"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "two bodies make meetings neither makes alone",
    "line": [
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "met"
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
        "text": ") = 2·"
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
        "kind": "scripted",
        "base": {
          "kind": "count",
          "of": [
            {
              "kind": "bar",
              "of": [
                {
                  "kind": "var",
                  "of": [
                    {
                      "kind": "text",
                      "text": "c"
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
                "text": " - 2"
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
        "kind": "cal",
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
        "kind": "cal",
        "of": [
          {
            "kind": "text",
            "text": "D"
          }
        ]
      },
      {
        "kind": "text",
        "text": "'"
      }
    ],
    "working": [
      [
        {
          "kind": "scripted",
          "base": {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "n"
              }
            ]
          },
          "sub": [
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
        },
        {
          "kind": "text",
          "text": "+"
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "n"
              }
            ]
          },
          "sub": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "B"
                }
              ]
            }
          ]
        },
        {
          "kind": "text",
          "text": " squared has a cross piece 2"
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "n"
              }
            ]
          },
          "sub": [
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
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "n"
              }
            ]
          },
          "sub": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "B"
                }
              ]
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "each thins as "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "Σ"
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
                    "text": "r"
                  }
                ]
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
                    "kind": "var",
                    "of": [
                      {
                        "kind": "text",
                        "text": "n"
                      }
                    ]
                  },
                  "sub": [
                    {
                      "kind": "var",
                      "of": [
                        {
                          "kind": "text",
                          "text": "f"
                        }
                      ]
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
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "ω"
                }
              ]
            }
          ]
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
                  "text": "l"
                }
              ]
            }
          ],
          "to": []
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
                "text": "n"
              }
            ]
          },
          "sub": [
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
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "n"
              }
            ]
          },
          "sub": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "B"
                }
              ]
            }
          ]
        },
        {
          "kind": "text",
          "text": " is largest at either end, cut off at "
        },
        {
          "kind": "count",
          "of": [
            {
              "kind": "bar",
              "of": [
                {
                  "kind": "var",
                  "of": [
                    {
                      "kind": "text",
                      "text": "c"
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
          "text": "1 means "
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
        },
        {
          "kind": "text",
          "text": " cells is "
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
        },
        {
          "kind": "text",
          "text": " ticks, and a body crosses "
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "β"
            }
          ]
        },
        {
          "kind": "text",
          "text": " of a cell a tick"
        }
      ],
      [
        {
          "kind": "text",
          "text": "two rays a tick apart land 1 - "
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "β"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·"
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
          "text": " ticks apart, so what arrives per tick goes as the reciprocal - one factor per body"
        }
      ],
      [
        {
          "kind": "fn",
          "of": [
            {
              "kind": "text",
              "text": "met"
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
          "text": ") = 2·"
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
          "kind": "scripted",
          "base": {
            "kind": "count",
            "of": [
              {
                "kind": "bar",
                "of": [
                  {
                    "kind": "var",
                    "of": [
                      {
                        "kind": "text",
                        "text": "c"
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
                  "text": " - 2"
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
          "kind": "cal",
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
          "kind": "cal",
          "of": [
            {
              "kind": "text",
              "text": "D"
            }
          ]
        },
        {
          "kind": "text",
          "text": "'"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "the cross piece of the quadratic is one body's radiation meeting the other'"
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
        "text": ", summed along the line between them. Each body's thins as the shell grows, so the product is large only near one of them - and how near is bounded by a step, which is the only length the lattice has. Two ends, each contributing the far density times the near sum cut off at one step. AND EACH END CARRIES A DOPPLER FACTOR, which is not put in: one cell a tick makes a distance a time, a body crosses "
      },
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "β"
          }
        ]
      },
      {
        "kind": "text",
        "text": " of a cell a tick, so two rays sent a tick apart land 1 - "
      },
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "β"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·"
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
        "text": " ticks apart and what arrives per tick is the reciprocal. That is the classical factor, derived from the two rules and directional because only the motion ALONG the line changes when a ray gets there"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "the rest of the integral, which is a logarithm",
    "line": [
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "met"
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
        "text": ") in full = 2·"
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
        "kind": "scripted",
        "base": {
          "kind": "count",
          "of": [
            {
              "kind": "bar",
              "of": [
                {
                  "kind": "var",
                  "of": [
                    {
                      "kind": "text",
                      "text": "c"
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
                "text": " - 2"
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
        "kind": "cal",
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
        "kind": "cal",
        "of": [
          {
            "kind": "text",
            "text": "D"
          }
        ]
      },
      {
        "kind": "text",
        "text": "' + 2·"
      },
      {
        "kind": "binom",
        "over": [
          {
            "kind": "text",
            "text": "2·"
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
                "text": " - 2"
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
                "text": "D"
              }
            ]
          },
          {
            "kind": "text",
            "text": " - 2"
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
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "r"
                }
              ]
            }
          ]
        },
        "sup": [
          {
            "kind": "text",
            "text": "3 - 2·"
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
            "kind": "frac",
            "over": [
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
            "under": [
              {
                "kind": "count",
                "of": [
                  {
                    "kind": "bar",
                    "of": [
                      {
                        "kind": "var",
                        "of": [
                          {
                            "kind": "text",
                            "text": "c"
                          }
                        ]
                      }
                    ]
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
        "kind": "cal",
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
        "kind": "cal",
        "of": [
          {
            "kind": "text",
            "text": "D"
          }
        ]
      },
      {
        "kind": "text",
        "text": "'"
      }
    ],
    "working": [
      [
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "l"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = Ru turns "
        },
        {
          "kind": "int",
          "from": [],
          "to": []
        },
        {
          "kind": "text",
          "text": " "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "dl"
            }
          ],
          "under": [
            {
              "kind": "scripted",
              "base": {
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "l"
                  }
                ]
              },
              "sup": [
                {
                  "kind": "var",
                  "of": [
                    {
                      "kind": "text",
                      "text": "a"
                    }
                  ]
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
              "text": "-"
            },
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "l"
                }
              ]
            },
            {
              "kind": "scripted",
              "base": {
                "kind": "text",
                "text": ")"
              },
              "sup": [
                {
                  "kind": "var",
                  "of": [
                    {
                      "kind": "text",
                      "text": "a"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "kind": "text",
          "text": " into "
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
              "kind": "text",
              "text": "1-2"
            },
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "a"
                }
              ]
            }
          ]
        },
        {
          "kind": "int",
          "from": [],
          "to": []
        },
        {
          "kind": "text",
          "text": " "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "du"
            }
          ],
          "under": [
            {
              "kind": "scripted",
              "base": {
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "u"
                  }
                ]
              },
              "sup": [
                {
                  "kind": "var",
                  "of": [
                    {
                      "kind": "text",
                      "text": "a"
                    }
                  ]
                }
              ]
            },
            {
              "kind": "text",
              "text": "(1-"
            },
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "u"
                }
              ]
            },
            {
              "kind": "scripted",
              "base": {
                "kind": "text",
                "text": ")"
              },
              "sup": [
                {
                  "kind": "var",
                  "of": [
                    {
                      "kind": "text",
                      "text": "a"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "kind": "text",
          "text": ","
        },
        {
          "kind": "text",
          "text": " "
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
              "text": "a"
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
              "text": "D"
            }
          ]
        },
        {
          "kind": "text",
          "text": " - 1"
        }
      ],
      [
        {
          "kind": "text",
          "text": "(1-"
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "u"
            }
          ]
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": ")"
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
                  "text": "a"
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
          "kind": "sum",
          "from": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "k"
                }
              ]
            }
          ],
          "to": []
        },
        {
          "kind": "binom",
          "over": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "a"
                }
              ]
            },
            {
              "kind": "text",
              "text": "+"
            },
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "k"
                }
              ]
            },
            {
              "kind": "text",
              "text": "-1"
            }
          ],
          "under": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "k"
                }
              ]
            }
          ]
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "u"
              }
            ]
          },
          "sup": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "k"
                }
              ]
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "so the integrand is "
        },
        {
          "kind": "sum",
          "from": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "k"
                }
              ]
            }
          ],
          "to": []
        },
        {
          "kind": "binom",
          "over": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "a"
                }
              ]
            },
            {
              "kind": "text",
              "text": "+"
            },
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "k"
                }
              ]
            },
            {
              "kind": "text",
              "text": "-1"
            }
          ],
          "under": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "k"
                }
              ]
            }
          ]
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "u"
              }
            ]
          },
          "sup": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "k"
                }
              ]
            },
            {
              "kind": "text",
              "text": "-"
            },
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "a"
                }
              ]
            }
          ]
        },
        {
          "kind": "text",
          "text": " - a power at every k except "
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "k"
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
              "text": "a"
            }
          ]
        },
        {
          "kind": "text",
          "text": "-1, which is "
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "u"
              }
            ]
          },
          "sup": [
            {
              "kind": "text",
              "text": "-1"
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
          "text": " "
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "u"
              }
            ]
          },
          "sup": [
            {
              "kind": "text",
              "text": "-1"
            }
          ]
        },
        {
          "kind": "text",
          "text": "du = "
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
          "text": " "
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "u"
            }
          ]
        },
        {
          "kind": "text",
          "text": ", taken between "
        },
        {
          "kind": "count",
          "of": [
            {
              "kind": "bar",
              "of": [
                {
                  "kind": "var",
                  "of": [
                    {
                      "kind": "text",
                      "text": "c"
                    }
                  ]
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
          "text": " and 1 - "
        },
        {
          "kind": "count",
          "of": [
            {
              "kind": "bar",
              "of": [
                {
                  "kind": "var",
                  "of": [
                    {
                      "kind": "text",
                      "text": "c"
                    }
                  ]
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
          "kind": "bar",
          "of": [
            {
              "kind": "text",
              "text": "R"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "two ends, so 2·"
        },
        {
          "kind": "binom",
          "over": [
            {
              "kind": "text",
              "text": "2·"
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
                  "text": " - 2"
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
                  "text": "D"
                }
              ]
            },
            {
              "kind": "text",
              "text": " - 2"
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
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "r"
                  }
                ]
              }
            ]
          },
          "sup": [
            {
              "kind": "text",
              "text": "3 - 2·"
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
              "kind": "frac",
              "over": [
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
              "under": [
                {
                  "kind": "count",
                  "of": [
                    {
                      "kind": "bar",
                      "of": [
                        {
                          "kind": "var",
                          "of": [
                            {
                              "kind": "text",
                              "text": "c"
                            }
                          ]
                        }
                      ]
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
          "kind": "fn",
          "of": [
            {
              "kind": "text",
              "text": "met"
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
          "text": ") = 2·"
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
          "kind": "scripted",
          "base": {
            "kind": "count",
            "of": [
              {
                "kind": "bar",
                "of": [
                  {
                    "kind": "var",
                    "of": [
                      {
                        "kind": "text",
                        "text": "c"
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
                  "text": " - 2"
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
          "kind": "cal",
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
          "kind": "cal",
          "of": [
            {
              "kind": "text",
              "text": "D"
            }
          ]
        },
        {
          "kind": "text",
          "text": "' + 2·"
        },
        {
          "kind": "binom",
          "over": [
            {
              "kind": "text",
              "text": "2·"
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
                  "text": " - 2"
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
                  "text": "D"
                }
              ]
            },
            {
              "kind": "text",
              "text": " - 2"
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
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "r"
                  }
                ]
              }
            ]
          },
          "sup": [
            {
              "kind": "text",
              "text": "3 - 2·"
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
              "kind": "frac",
              "over": [
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
              "under": [
                {
                  "kind": "count",
                  "of": [
                    {
                      "kind": "bar",
                      "of": [
                        {
                          "kind": "var",
                          "of": [
                            {
                              "kind": "text",
                              "text": "c"
                            }
                          ]
                        }
                      ]
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
          "kind": "cal",
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
          "kind": "cal",
          "of": [
            {
              "kind": "text",
              "text": "D"
            }
          ]
        },
        {
          "kind": "text",
          "text": "'"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "the leading term is the two ends of the line, where the product of the two thinning populations is largest. The rest of the line contributes as well, and one term of the series about either end is a simple pole - which integrates to a logarithm of the separation against a step rather than to a power. It falls off one power faster than the leading term, so it is a correction that matters close in and vanishes far out, which is what a near field IS"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "put in from outside",
    "line": [
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "Σ"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = "
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
                "text": "β"
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
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "Σ"
            }
          ]
        },
        "sub": [
          {
            "kind": "text",
            "text": "0"
          }
        ]
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "the term is "
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
                  "text": "β"
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
              "text": "Σ"
            }
          ]
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "what a body puts out is the term no rewrite puts there, scaled by what its gates let through - and a body going somewhere has spent that share of its ticks moving rather than shining, which is the whole of why a moving source is shifted"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "what one puts in, thinned, times what the other is open to",
    "line": [
      {
        "kind": "text",
        "text": "the vacuum's channel = "
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
            "kind": "scripted",
            "base": {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "σ"
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
            "text": "·"
          },
          {
            "kind": "scripted",
            "base": {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "ω"
                }
              ]
            },
            "sup": [
              {
                "kind": "text",
                "text": "3"
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
                  "text": "β"
                }
              ]
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
        "text": "·"
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "Σ"
            }
          ]
        },
        "sub": [
          {
            "kind": "text",
            "text": "0"
          }
        ],
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
        "text": "'·"
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
              },
              {
                "kind": "text",
                "text": "'"
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
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "r"
                }
              ]
            }
          ]
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
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "n"
                }
              ]
            },
            "sub": [
              {
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "f"
                  }
                ]
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
                  "kind": "var",
                  "of": [
                    {
                      "kind": "text",
                      "text": "L"
                    }
                  ]
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
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "the vacuum's channel = "
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
              "kind": "scripted",
              "base": {
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "σ"
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
              "text": "·"
            },
            {
              "kind": "scripted",
              "base": {
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "ω"
                  }
                ]
              },
              "sup": [
                {
                  "kind": "text",
                  "text": "3"
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
                    "text": "β"
                  }
                ]
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
          "text": "·"
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "Σ"
              }
            ]
          },
          "sub": [
            {
              "kind": "text",
              "text": "0"
            }
          ],
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
          "text": "'·"
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
                },
                {
                  "kind": "text",
                  "text": "'"
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
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "r"
                  }
                ]
              }
            ]
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
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "n"
                  }
                ]
              },
              "sub": [
                {
                  "kind": "var",
                  "of": [
                    {
                      "kind": "text",
                      "text": "f"
                    }
                  ]
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
                    "kind": "var",
                    "of": [
                      {
                        "kind": "text",
                        "text": "L"
                      }
                    ]
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
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "the near body prevents an expansion, that shortfall spreads, and the far one is pushed into it because fewer rays arrive from that side. NEITHER BODY HAS TO EMIT ANYTHING for this one - it is the making that did not happen, carried out to "
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
        "text": " and met by whatever is open to it"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "the bodies, the separation, and what carries between them",
    "line": [
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
        "text": ".distance"
      },
      {
        "kind": "paren",
        "of": [
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
            "text": "'"
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
                  "text": "r"
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
          "text": ".distance"
        },
        {
          "kind": "paren",
          "of": [
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
              "text": "'"
            }
          ]
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "the separation is what the pair has and neither body does - and it is not `"
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
        "text": "`, which in `massOf` is a body's own thickness. Two lengths that never met until a law was written with a mass in it"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "the bodies, the separation, and what carries between them",
    "line": [
      {
        "kind": "scripted",
        "base": {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "T"
            }
          ]
        },
        "sub": [
          {
            "kind": "text",
            "text": "vac"
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
            "kind": "paren",
            "of": [
              {
                "kind": "scripted",
                "base": {
                  "kind": "var",
                  "of": [
                    {
                      "kind": "text",
                      "text": "n"
                    }
                  ]
                },
                "sub": [
                  {
                    "kind": "var",
                    "of": [
                      {
                        "kind": "text",
                        "text": "f"
                      }
                    ]
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
                      "kind": "var",
                      "of": [
                        {
                          "kind": "text",
                          "text": "L"
                        }
                      ]
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
          }
        ],
        "under": [
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
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "the vacuum's channel = "
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
              "kind": "scripted",
              "base": {
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "σ"
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
              "text": "·"
            },
            {
              "kind": "scripted",
              "base": {
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "ω"
                  }
                ]
              },
              "sup": [
                {
                  "kind": "text",
                  "text": "3"
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
                    "text": "β"
                  }
                ]
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
          "text": "·"
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "Σ"
              }
            ]
          },
          "sub": [
            {
              "kind": "text",
              "text": "0"
            }
          ],
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
          "text": "'·"
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
                },
                {
                  "kind": "text",
                  "text": "'"
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
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "r"
                  }
                ]
              }
            ]
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
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "n"
                  }
                ]
              },
              "sub": [
                {
                  "kind": "var",
                  "of": [
                    {
                      "kind": "text",
                      "text": "f"
                    }
                  ]
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
                    "kind": "var",
                    "of": [
                      {
                        "kind": "text",
                        "text": "L"
                      }
                    ]
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
        }
      ],
      [
        {
          "kind": "text",
          "text": "over the two bodies, "
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
              "kind": "scripted",
              "base": {
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "σ"
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
              "text": "·"
            },
            {
              "kind": "scripted",
              "base": {
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "ω"
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
                    "text": "β"
                  }
                ]
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
          "text": "·"
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "Σ"
              }
            ]
          },
          "sub": [
            {
              "kind": "text",
              "text": "0"
            }
          ],
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
          "text": "'·"
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
                },
                {
                  "kind": "text",
                  "text": "'"
                }
              ]
            }
          ]
        },
        {
          "kind": "text",
          "text": ", and over the shell they share:"
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
                "text": "T"
              }
            ]
          },
          "sub": [
            {
              "kind": "text",
              "text": "vac"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = the channel over its bodies over "
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
                    "text": "r"
                  }
                ]
              }
            ]
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
          "text": " = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "paren",
              "of": [
                {
                  "kind": "scripted",
                  "base": {
                    "kind": "var",
                    "of": [
                      {
                        "kind": "text",
                        "text": "n"
                      }
                    ]
                  },
                  "sub": [
                    {
                      "kind": "var",
                      "of": [
                        {
                          "kind": "text",
                          "text": "f"
                        }
                      ]
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
                        "kind": "var",
                        "of": [
                          {
                            "kind": "text",
                            "text": "L"
                          }
                        ]
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
            }
          ],
          "under": [
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
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "the vacuum's channel with its two bodies and the shell divided out - a SCREENED transport, which is what is left of a shortfall that spread and was damped. The damping is a power and not an exponential because a carrier takes whole steps and on each one is either destroyed or not, and `"
      },
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "L"
          }
        ]
      },
      {
        "kind": "text",
        "text": "` is where damping balances dilution"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "what one puts in, thinned, times what the other is open to",
    "line": [
      {
        "kind": "text",
        "text": "the meetings' channel = "
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
            "kind": "scripted",
            "base": {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "σ"
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
            "text": "·"
          },
          {
            "kind": "scripted",
            "base": {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "ω"
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
                  "text": "β"
                }
              ]
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
        "text": "·"
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "Σ"
            }
          ]
        },
        "sub": [
          {
            "kind": "text",
            "text": "0"
          }
        ],
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
        "text": "'·"
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
              },
              {
                "kind": "text",
                "text": "'"
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
            "text": "2·"
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
            "kind": "scripted",
            "base": {
              "kind": "count",
              "of": [
                {
                  "kind": "bar",
                  "of": [
                    {
                      "kind": "var",
                      "of": [
                        {
                          "kind": "text",
                          "text": "c"
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
                    "text": " - 2"
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
            "kind": "cal",
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
            "kind": "cal",
            "of": [
              {
                "kind": "text",
                "text": "D"
              }
            ]
          },
          {
            "kind": "text",
            "text": "' + 2·"
          },
          {
            "kind": "binom",
            "over": [
              {
                "kind": "text",
                "text": "2·"
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
                    "text": " - 2"
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
                    "text": "D"
                  }
                ]
              },
              {
                "kind": "text",
                "text": " - 2"
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
                  "kind": "var",
                  "of": [
                    {
                      "kind": "text",
                      "text": "r"
                    }
                  ]
                }
              ]
            },
            "sup": [
              {
                "kind": "text",
                "text": "3 - 2·"
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
                "kind": "frac",
                "over": [
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
                "under": [
                  {
                    "kind": "count",
                    "of": [
                      {
                        "kind": "bar",
                        "of": [
                          {
                            "kind": "var",
                            "of": [
                              {
                                "kind": "text",
                                "text": "c"
                              }
                            ]
                          }
                        ]
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
            "kind": "cal",
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
            "kind": "cal",
            "of": [
              {
                "kind": "text",
                "text": "D"
              }
            ]
          },
          {
            "kind": "text",
            "text": "'"
          }
        ]
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "the meetings' channel = "
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
              "kind": "scripted",
              "base": {
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "σ"
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
              "text": "·"
            },
            {
              "kind": "scripted",
              "base": {
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "ω"
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
                    "text": "β"
                  }
                ]
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
          "text": "·"
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "Σ"
              }
            ]
          },
          "sub": [
            {
              "kind": "text",
              "text": "0"
            }
          ],
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
          "text": "'·"
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
                },
                {
                  "kind": "text",
                  "text": "'"
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
              "text": "2·"
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
              "kind": "scripted",
              "base": {
                "kind": "count",
                "of": [
                  {
                    "kind": "bar",
                    "of": [
                      {
                        "kind": "var",
                        "of": [
                          {
                            "kind": "text",
                            "text": "c"
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
                      "text": " - 2"
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
              "kind": "cal",
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
              "kind": "cal",
              "of": [
                {
                  "kind": "text",
                  "text": "D"
                }
              ]
            },
            {
              "kind": "text",
              "text": "' + 2·"
            },
            {
              "kind": "binom",
              "over": [
                {
                  "kind": "text",
                  "text": "2·"
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
                      "text": " - 2"
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
                      "text": "D"
                    }
                  ]
                },
                {
                  "kind": "text",
                  "text": " - 2"
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
                    "kind": "var",
                    "of": [
                      {
                        "kind": "text",
                        "text": "r"
                      }
                    ]
                  }
                ]
              },
              "sup": [
                {
                  "kind": "text",
                  "text": "3 - 2·"
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
                  "kind": "frac",
                  "over": [
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
                  "under": [
                    {
                      "kind": "count",
                      "of": [
                        {
                          "kind": "bar",
                          "of": [
                            {
                              "kind": "var",
                              "of": [
                                {
                                  "kind": "text",
                                  "text": "c"
                                }
                              ]
                            }
                          ]
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
              "kind": "cal",
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
              "kind": "cal",
              "of": [
                {
                  "kind": "text",
                  "text": "D"
                }
              ]
            },
            {
              "kind": "text",
              "text": "'"
            }
          ]
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "the cross piece of the quadratic: one body's radiation meeting the other'"
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
        "text": ". It needs BOTH to be shining, which is why it carries both masses and the motion factor twice"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "the bodies, the separation, and what carries between them",
    "line": [
      {
        "kind": "scripted",
        "base": {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "T"
            }
          ]
        },
        "sub": [
          {
            "kind": "text",
            "text": "met"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = 2·"
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
          "kind": "count",
          "of": [
            {
              "kind": "bar",
              "of": [
                {
                  "kind": "var",
                  "of": [
                    {
                      "kind": "text",
                      "text": "c"
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
                "text": " - 2"
              }
            ]
          }
        ]
      },
      {
        "kind": "text",
        "text": " + 2·"
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
                  "text": "r"
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
        "kind": "binom",
        "over": [
          {
            "kind": "text",
            "text": "2·"
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
                "text": " - 2"
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
                "text": "D"
              }
            ]
          },
          {
            "kind": "text",
            "text": " - 2"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·"
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
            "kind": "frac",
            "over": [
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
            "under": [
              {
                "kind": "count",
                "of": [
                  {
                    "kind": "bar",
                    "of": [
                      {
                        "kind": "var",
                        "of": [
                          {
                            "kind": "text",
                            "text": "c"
                          }
                        ]
                      }
                    ]
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
          "text": "the meetings' channel = "
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
              "kind": "scripted",
              "base": {
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "σ"
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
              "text": "·"
            },
            {
              "kind": "scripted",
              "base": {
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "ω"
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
                    "text": "β"
                  }
                ]
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
          "text": "·"
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "Σ"
              }
            ]
          },
          "sub": [
            {
              "kind": "text",
              "text": "0"
            }
          ],
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
          "text": "'·"
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
                },
                {
                  "kind": "text",
                  "text": "'"
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
              "text": "2·"
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
              "kind": "scripted",
              "base": {
                "kind": "count",
                "of": [
                  {
                    "kind": "bar",
                    "of": [
                      {
                        "kind": "var",
                        "of": [
                          {
                            "kind": "text",
                            "text": "c"
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
                      "text": " - 2"
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
              "kind": "cal",
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
              "kind": "cal",
              "of": [
                {
                  "kind": "text",
                  "text": "D"
                }
              ]
            },
            {
              "kind": "text",
              "text": "' + 2·"
            },
            {
              "kind": "binom",
              "over": [
                {
                  "kind": "text",
                  "text": "2·"
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
                      "text": " - 2"
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
                      "text": "D"
                    }
                  ]
                },
                {
                  "kind": "text",
                  "text": " - 2"
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
                    "kind": "var",
                    "of": [
                      {
                        "kind": "text",
                        "text": "r"
                      }
                    ]
                  }
                ]
              },
              "sup": [
                {
                  "kind": "text",
                  "text": "3 - 2·"
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
                  "kind": "frac",
                  "over": [
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
                  "under": [
                    {
                      "kind": "count",
                      "of": [
                        {
                          "kind": "bar",
                          "of": [
                            {
                              "kind": "var",
                              "of": [
                                {
                                  "kind": "text",
                                  "text": "c"
                                }
                              ]
                            }
                          ]
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
              "kind": "cal",
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
              "kind": "cal",
              "of": [
                {
                  "kind": "text",
                  "text": "D"
                }
              ]
            },
            {
              "kind": "text",
              "text": "'"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "over the same two bodies and the same shell:"
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
                "text": "T"
              }
            ]
          },
          "sub": [
            {
              "kind": "text",
              "text": "met"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = the channel over its bodies over "
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
                    "text": "r"
                  }
                ]
              }
            ]
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
          "text": " = 2·"
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
            "kind": "count",
            "of": [
              {
                "kind": "bar",
                "of": [
                  {
                    "kind": "var",
                    "of": [
                      {
                        "kind": "text",
                        "text": "c"
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
                  "text": " - 2"
                }
              ]
            }
          ]
        },
        {
          "kind": "text",
          "text": " + 2·"
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
                    "text": "r"
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
          "kind": "binom",
          "over": [
            {
              "kind": "text",
              "text": "2·"
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
                  "text": " - 2"
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
                  "text": "D"
                }
              ]
            },
            {
              "kind": "text",
              "text": " - 2"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·"
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
              "kind": "frac",
              "over": [
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
              "under": [
                {
                  "kind": "count",
                  "of": [
                    {
                      "kind": "bar",
                      "of": [
                        {
                          "kind": "var",
                          "of": [
                            {
                              "kind": "text",
                              "text": "c"
                            }
                          ]
                        }
                      ]
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
        "text": "the meetings' channel the same way - the interference term of the two bodies' own radiation, which is why it needs BOTH to be shining where the vacuum's needs only one to be open. It carries a different power of the separation, and the crossover between the two is what turns a rotation curve over"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "the bodies, the separation, and what carries between them",
    "line": [
      {
        "kind": "scripted",
        "base": {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        "sub": [
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "N"
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
            "text": "in bodies and transport"
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
                "text": "m"
              }
            ]
          }
        ]
      },
      {
        "kind": "text",
        "text": "'·"
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
                  "text": "r"
                }
              ]
            }
          ]
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
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "T"
                }
              ]
            },
            "sub": [
              {
                "kind": "text",
                "text": "vac"
              }
            ]
          },
          {
            "kind": "text",
            "text": " + "
          },
          {
            "kind": "cal",
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
            "kind": "cal",
            "of": [
              {
                "kind": "text",
                "text": "D"
              }
            ]
          },
          {
            "kind": "text",
            "text": "'·"
          },
          {
            "kind": "paren",
            "of": [
              {
                "kind": "text",
                "text": "2·"
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
                  "kind": "count",
                  "of": [
                    {
                      "kind": "bar",
                      "of": [
                        {
                          "kind": "var",
                          "of": [
                            {
                              "kind": "text",
                              "text": "c"
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
                        "text": " - 2"
                      }
                    ]
                  }
                ]
              },
              {
                "kind": "text",
                "text": " + 2·"
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
                          "text": "r"
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
                "kind": "binom",
                "over": [
                  {
                    "kind": "text",
                    "text": "2·"
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
                        "text": " - 2"
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
                        "text": "D"
                      }
                    ]
                  },
                  {
                    "kind": "text",
                    "text": " - 2"
                  }
                ]
              },
              {
                "kind": "text",
                "text": "·"
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
                    "kind": "frac",
                    "over": [
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
                    "under": [
                      {
                        "kind": "count",
                        "of": [
                          {
                            "kind": "bar",
                            "of": [
                              {
                                "kind": "var",
                                "of": [
                                  {
                                    "kind": "text",
                                    "text": "c"
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
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
          "kind": "frac",
          "over": [
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
                      "text": "β"
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
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "Σ"
                  }
                ]
              },
              "sub": [
                {
                  "kind": "text",
                  "text": "0"
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
          "text": "' = "
        },
        {
          "kind": "frac",
          "over": [
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
                      "text": "β"
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
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "Σ"
                  }
                ]
              },
              "sub": [
                {
                  "kind": "text",
                  "text": "0"
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
              "text": "'·"
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
                    },
                    {
                      "kind": "text",
                      "text": "'"
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
          "kind": "scripted",
          "base": {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "g"
              }
            ]
          },
          "sub": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "N"
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
                  "text": "m"
                }
              ]
            }
          ]
        },
        {
          "kind": "text",
          "text": "'·"
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
                    "text": "r"
                  }
                ]
              }
            ]
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
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "T"
                  }
                ]
              },
              "sub": [
                {
                  "kind": "text",
                  "text": "vac"
                }
              ]
            },
            {
              "kind": "text",
              "text": " + "
            },
            {
              "kind": "cal",
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
              "kind": "cal",
              "of": [
                {
                  "kind": "text",
                  "text": "D"
                }
              ]
            },
            {
              "kind": "text",
              "text": "'·"
            },
            {
              "kind": "paren",
              "of": [
                {
                  "kind": "text",
                  "text": "2·"
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
                    "kind": "count",
                    "of": [
                      {
                        "kind": "bar",
                        "of": [
                          {
                            "kind": "var",
                            "of": [
                              {
                                "kind": "text",
                                "text": "c"
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
                          "text": " - 2"
                        }
                      ]
                    }
                  ]
                },
                {
                  "kind": "text",
                  "text": " + 2·"
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
                            "text": "r"
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
                  "kind": "binom",
                  "over": [
                    {
                      "kind": "text",
                      "text": "2·"
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
                          "text": " - 2"
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
                          "text": "D"
                        }
                      ]
                    },
                    {
                      "kind": "text",
                      "text": " - 2"
                    }
                  ]
                },
                {
                  "kind": "text",
                  "text": "·"
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
                      "kind": "frac",
                      "over": [
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
                      "under": [
                        {
                          "kind": "count",
                          "of": [
                            {
                              "kind": "bar",
                              "of": [
                                {
                                  "kind": "var",
                                  "of": [
                                    {
                                      "kind": "text",
                                      "text": "c"
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
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
        "text": "the same arrival, told apart. TWO BODIES AND THE DISTANCE BETWEEN THEM STAND IN FRONT, and at three dimensions that front is `"
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
        "kind": "text",
        "text": "'/"
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
                  "text": "r"
                }
              ]
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
        "text": "` - Newton'"
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
        "text": ", arrived at rather than assumed. What is left is a bracket of two transports, and the model is entirely in the bracket. THE TWO ARE NOT THE SAME KIND OF COUPLING: `"
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "T"
            }
          ]
        },
        "sub": [
          {
            "kind": "text",
            "text": "vac"
          }
        ]
      },
      {
        "kind": "text",
        "text": "` carries the near body's shortfall per unit of its mass, which SATURATES because a body deeper than a mean free path shadows itself, and `"
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "T"
            }
          ]
        },
        "sub": [
          {
            "kind": "text",
            "text": "met"
          }
        ]
      },
      {
        "kind": "text",
        "text": "` does not. That difference is the whole of what separates a body felt as its face from one felt as its bulk"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "the bodies, the separation, and what carries between them",
    "line": [
      {
        "kind": "scripted",
        "base": {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        "sub": [
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "N"
              }
            ]
          }
        ]
      },
      {
        "kind": "text",
        "text": " at "
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
        "text": " = 3 "
      },
      {
        "kind": "muted",
        "of": [
          {
            "kind": "text",
            "text": "in bodies and transport"
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
                    "text": "m"
                  }
                ]
              }
            ]
          },
          {
            "kind": "text",
            "text": "'"
          }
        ],
        "under": [
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
                      "text": "r"
                    }
                  ]
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
        "kind": "paren",
        "of": [
          {
            "kind": "scripted",
            "base": {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "T"
                }
              ]
            },
            "sub": [
              {
                "kind": "text",
                "text": "vac"
              }
            ]
          },
          {
            "kind": "text",
            "text": " + "
          },
          {
            "kind": "cal",
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
            "kind": "cal",
            "of": [
              {
                "kind": "text",
                "text": "D"
              }
            ]
          },
          {
            "kind": "text",
            "text": "'·"
          },
          {
            "kind": "paren",
            "of": [
              {
                "kind": "frac",
                "over": [
                  {
                    "kind": "text",
                    "text": "2·"
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
                        "text": "F"
                      }
                    ]
                  }
                ],
                "under": [
                  {
                    "kind": "count",
                    "of": [
                      {
                        "kind": "bar",
                        "of": [
                          {
                            "kind": "var",
                            "of": [
                              {
                                "kind": "text",
                                "text": "c"
                              }
                            ]
                          }
                        ]
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
                    "kind": "text",
                    "text": "4·"
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
                        "kind": "frac",
                        "over": [
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
                        "under": [
                          {
                            "kind": "count",
                            "of": [
                              {
                                "kind": "bar",
                                "of": [
                                  {
                                    "kind": "var",
                                    "of": [
                                      {
                                        "kind": "text",
                                        "text": "c"
                                      }
                                    ]
                                  }
                                ]
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
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "g"
              }
            ]
          },
          "sub": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "N"
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
                  "text": "m"
                }
              ]
            }
          ]
        },
        {
          "kind": "text",
          "text": "'·"
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
                    "text": "r"
                  }
                ]
              }
            ]
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
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "T"
                  }
                ]
              },
              "sub": [
                {
                  "kind": "text",
                  "text": "vac"
                }
              ]
            },
            {
              "kind": "text",
              "text": " + "
            },
            {
              "kind": "cal",
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
              "kind": "cal",
              "of": [
                {
                  "kind": "text",
                  "text": "D"
                }
              ]
            },
            {
              "kind": "text",
              "text": "'·"
            },
            {
              "kind": "paren",
              "of": [
                {
                  "kind": "text",
                  "text": "2·"
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
                    "kind": "count",
                    "of": [
                      {
                        "kind": "bar",
                        "of": [
                          {
                            "kind": "var",
                            "of": [
                              {
                                "kind": "text",
                                "text": "c"
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
                          "text": " - 2"
                        }
                      ]
                    }
                  ]
                },
                {
                  "kind": "text",
                  "text": " + 2·"
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
                            "text": "r"
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
                  "kind": "binom",
                  "over": [
                    {
                      "kind": "text",
                      "text": "2·"
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
                          "text": " - 2"
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
                          "text": "D"
                        }
                      ]
                    },
                    {
                      "kind": "text",
                      "text": " - 2"
                    }
                  ]
                },
                {
                  "kind": "text",
                  "text": "·"
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
                      "kind": "frac",
                      "over": [
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
                      "under": [
                        {
                          "kind": "count",
                          "of": [
                            {
                              "kind": "bar",
                              "of": [
                                {
                                  "kind": "var",
                                  "of": [
                                    {
                                      "kind": "text",
                                      "text": "c"
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
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
          "text": " = 3"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "the arrival between two bodies in three dimensions: their two masses over the square of what separates them, times what the medium carries between them"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "the bodies, the separation, and what carries between them",
    "line": [
      {
        "kind": "scripted",
        "base": {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "F"
            }
          ]
        },
        "sub": [
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "g"
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
            "text": "at"
          }
        ]
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
            "text": "D"
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
            "text": "= 3"
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
                    "text": "m"
                  }
                ]
              }
            ]
          },
          {
            "kind": "text",
            "text": "'"
          }
        ],
        "under": [
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
                      "text": "r"
                    }
                  ]
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
        "kind": "paren",
        "of": [
          {
            "kind": "scripted",
            "base": {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "T"
                }
              ]
            },
            "sub": [
              {
                "kind": "text",
                "text": "vac"
              }
            ]
          },
          {
            "kind": "text",
            "text": " + "
          },
          {
            "kind": "cal",
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
            "kind": "cal",
            "of": [
              {
                "kind": "text",
                "text": "D"
              }
            ]
          },
          {
            "kind": "text",
            "text": "'·"
          },
          {
            "kind": "paren",
            "of": [
              {
                "kind": "frac",
                "over": [
                  {
                    "kind": "text",
                    "text": "2·"
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
                        "text": "F"
                      }
                    ]
                  }
                ],
                "under": [
                  {
                    "kind": "count",
                    "of": [
                      {
                        "kind": "bar",
                        "of": [
                          {
                            "kind": "var",
                            "of": [
                              {
                                "kind": "text",
                                "text": "c"
                              }
                            ]
                          }
                        ]
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
                    "kind": "text",
                    "text": "4·"
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
                        "kind": "frac",
                        "over": [
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
                        "under": [
                          {
                            "kind": "count",
                            "of": [
                              {
                                "kind": "bar",
                                "of": [
                                  {
                                    "kind": "var",
                                    "of": [
                                      {
                                        "kind": "text",
                                        "text": "c"
                                      }
                                    ]
                                  }
                                ]
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
            "kind": "frac",
            "over": [
              {
                "kind": "scripted",
                "base": {
                  "kind": "var",
                  "of": [
                    {
                      "kind": "text",
                      "text": "a"
                    }
                  ]
                },
                "sub": [
                  {
                    "kind": "text",
                    "text": "0"
                  }
                ]
              }
            ],
            "under": [
              {
                "kind": "fn",
                "of": [
                  {
                    "kind": "text",
                    "text": "recur"
                  }
                ]
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
    "working": [
      [
        {
          "kind": "scripted",
          "base": {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "F"
              }
            ]
          },
          "sub": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "g"
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
                  "text": "m"
                }
              ]
            }
          ]
        },
        {
          "kind": "text",
          "text": "'·"
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
                    "text": "r"
                  }
                ]
              }
            ]
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
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "T"
                  }
                ]
              },
              "sub": [
                {
                  "kind": "text",
                  "text": "vac"
                }
              ]
            },
            {
              "kind": "text",
              "text": " + "
            },
            {
              "kind": "cal",
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
              "kind": "cal",
              "of": [
                {
                  "kind": "text",
                  "text": "D"
                }
              ]
            },
            {
              "kind": "text",
              "text": "'·"
            },
            {
              "kind": "paren",
              "of": [
                {
                  "kind": "text",
                  "text": "2·"
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
                    "kind": "count",
                    "of": [
                      {
                        "kind": "bar",
                        "of": [
                          {
                            "kind": "var",
                            "of": [
                              {
                                "kind": "text",
                                "text": "c"
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
                          "text": " - 2"
                        }
                      ]
                    }
                  ]
                },
                {
                  "kind": "text",
                  "text": " + 2·"
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
                            "text": "r"
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
                  "kind": "binom",
                  "over": [
                    {
                      "kind": "text",
                      "text": "2·"
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
                          "text": " - 2"
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
                          "text": "D"
                        }
                      ]
                    },
                    {
                      "kind": "text",
                      "text": " - 2"
                    }
                  ]
                },
                {
                  "kind": "text",
                  "text": "·"
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
                      "kind": "frac",
                      "over": [
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
                      "under": [
                        {
                          "kind": "count",
                          "of": [
                            {
                              "kind": "bar",
                              "of": [
                                {
                                  "kind": "var",
                                  "of": [
                                    {
                                      "kind": "text",
                                      "text": "c"
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
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
              "kind": "frac",
              "over": [
                {
                  "kind": "scripted",
                  "base": {
                    "kind": "var",
                    "of": [
                      {
                        "kind": "text",
                        "text": "a"
                      }
                    ]
                  },
                  "sub": [
                    {
                      "kind": "text",
                      "text": "0"
                    }
                  ]
                }
              ],
              "under": [
                {
                  "kind": "fn",
                  "of": [
                    {
                      "kind": "text",
                      "text": "recur"
                    }
                  ]
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
          "text": " = 3"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "and what is felt: Newton's two masses over the square of the separation, times a bracket of two transports, times the mismatch measured against the acceleration it produces. EVERY PART OF THE MODEL IS IN THE BRACKET - the front is a count of the places three-dimensional space has at a distance, and nothing was fitted to make it an inverse square"
      }
    ],
    "measured": []
  }
];
