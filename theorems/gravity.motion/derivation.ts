/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * gravity.motion, for G on any
 * (D null, DEG null), box null, null ticks.
 *
 * how motion moves it = \paren{1 - \beta}^{2}
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

export const THEOREM = "gravity.motion";
export const ASKS = "a body gets one action a tick and can move or shine, not both. What does that do to the pull between two of them?";
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
    "text": "how motion moves it = "
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
          "text": "β"
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
        "text": " - "
      },
      {
        "kind": "text",
        "text": "σ"
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
          "text": " n"
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
        }
      ],
      [
        {
          "kind": "text",
          "text": "σ"
        },
        {
          "kind": "text",
          "text": " n: -"
        },
        {
          "kind": "text",
          "text": "σ"
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
          "text": " - "
        },
        {
          "kind": "text",
          "text": "σ"
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
              "text": "1"
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
                      "text": " - "
                    },
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
        "text": " - "
      },
      {
        "kind": "text",
        "text": "σ"
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
    "via": "CREATION",
    "line": [
      {
        "kind": "text",
        "text": "the ways out of a point = "
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
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "the body lit "
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
          "text": " exits"
        }
      ],
      [
        {
          "kind": "text",
          "text": "so a point has "
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
          "text": " ways out"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "CREATION lights every exit a point has, so the count its body ran over is how many ways out there are - "
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
        "text": ". A shortfall is ways out that are missing, so that count is also its ceiling"
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
        "text": "what a body is open to = m'·"
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
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "a point has "
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
          "text": " ways out"
        }
      ],
      [
        {
          "kind": "text",
          "text": "a body of m' cells has m' of them"
        }
      ],
      [
        {
          "kind": "text",
          "text": "what it is open to = m'·"
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
        "text": "a body is open on every exit of every cell it owns. How many cells is what makes one body bigger than another and is a fact about the body rather than about the theory; how many exits each has is the count the making rule ran over, already settled above"
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
        "text": "Σ"
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
        "kind": "text",
        "text": "Σ"
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
        "kind": "text",
        "text": "Σ"
      },
      {
        "kind": "text",
        "text": " per site = "
      },
      {
        "kind": "text",
        "text": "Σ"
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
    "working": [
      [
        {
          "kind": "text",
          "text": "what crosses one site: "
        },
        {
          "kind": "text",
          "text": "Σ"
        },
        {
          "kind": "text",
          "text": "/shell = "
        },
        {
          "kind": "text",
          "text": "Σ"
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
              "text": "1"
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
          "text": "Σ"
        },
        {
          "kind": "text",
          "text": " per site = "
        },
        {
          "kind": "text",
          "text": "Σ"
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
    "via": "MOVEMENT",
    "line": [
      {
        "kind": "count",
        "of": [
          {
            "kind": "bar",
            "of": [
              {
                "kind": "text",
                "text": "c"
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
        "text": "(R) = 2·"
      },
      {
        "kind": "text",
        "text": "σ"
      },
      {
        "kind": "text",
        "text": "·F·"
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "R"
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
                  "kind": "text",
                  "text": "c"
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
      }
    ],
    "working": [
      [
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "n"
          },
          "sub": [
            {
              "kind": "text",
              "text": "A"
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
            "kind": "text",
            "text": "n"
          },
          "sub": [
            {
              "kind": "text",
              "text": "B"
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
            "kind": "text",
            "text": "n"
          },
          "sub": [
            {
              "kind": "text",
              "text": "A"
            }
          ]
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "n"
          },
          "sub": [
            {
              "kind": "text",
              "text": "B"
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
          "kind": "text",
          "text": "Σ"
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
      [
        {
          "kind": "sum",
          "from": [
            {
              "kind": "text",
              "text": "l"
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
            "kind": "text",
            "text": "n"
          },
          "sub": [
            {
              "kind": "text",
              "text": "A"
            }
          ]
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "n"
          },
          "sub": [
            {
              "kind": "text",
              "text": "B"
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
                  "kind": "text",
                  "text": "c"
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
          "text": "(R) = 2·"
        },
        {
          "kind": "text",
          "text": "σ"
        },
        {
          "kind": "text",
          "text": "·F·"
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "R"
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
                    "kind": "text",
                    "text": "c"
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
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "the cross piece of the quadratic is one body's radiation meeting the other's, summed along the line between them. Each body's thins as the shell grows, so the product is large only near one of them - and how near is bounded by a step, which is the only length the lattice has. Two ends, each contributing the far density times the near sum cut off at one step"
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
        "text": "(R) in full = 2·"
      },
      {
        "kind": "text",
        "text": "σ"
      },
      {
        "kind": "text",
        "text": "·F·"
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "R"
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
                  "kind": "text",
                  "text": "c"
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
          "kind": "text",
          "text": "R"
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
                "kind": "text",
                "text": "R"
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
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "l = Ru turns "
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
                "kind": "text",
                "text": "l"
              },
              "sup": [
                {
                  "kind": "text",
                  "text": "a"
                }
              ]
            },
            {
              "kind": "text",
              "text": "(R-l"
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
                  "text": "a"
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
            "kind": "text",
            "text": "R"
          },
          "sup": [
            {
              "kind": "text",
              "text": "1-2a"
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
                "kind": "text",
                "text": "u"
              },
              "sup": [
                {
                  "kind": "text",
                  "text": "a"
                }
              ]
            },
            {
              "kind": "text",
              "text": "(1-u"
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
                  "text": "a"
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
          "text": " a = "
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
          "text": "(1-u"
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
              "text": "-a"
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
              "kind": "text",
              "text": "k"
            }
          ],
          "to": []
        },
        {
          "kind": "binom",
          "over": [
            {
              "kind": "text",
              "text": "a+k-1"
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "k"
            }
          ]
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "u"
          },
          "sup": [
            {
              "kind": "text",
              "text": "k"
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
              "kind": "text",
              "text": "k"
            }
          ],
          "to": []
        },
        {
          "kind": "binom",
          "over": [
            {
              "kind": "text",
              "text": "a+k-1"
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "k"
            }
          ]
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "u"
          },
          "sup": [
            {
              "kind": "text",
              "text": "k-a"
            }
          ]
        },
        {
          "kind": "text",
          "text": " - a power at every k except k = a-1, which is "
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "u"
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
            "kind": "text",
            "text": "u"
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
          "text": " u, taken between "
        },
        {
          "kind": "count",
          "of": [
            {
              "kind": "bar",
              "of": [
                {
                  "kind": "text",
                  "text": "c"
                }
              ]
            }
          ]
        },
        {
          "kind": "text",
          "text": "/R and 1 - "
        },
        {
          "kind": "count",
          "of": [
            {
              "kind": "bar",
              "of": [
                {
                  "kind": "text",
                  "text": "c"
                }
              ]
            }
          ]
        },
        {
          "kind": "text",
          "text": "/R"
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
            "kind": "text",
            "text": "R"
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
                  "kind": "text",
                  "text": "R"
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
          "text": "(R) = 2·"
        },
        {
          "kind": "text",
          "text": "σ"
        },
        {
          "kind": "text",
          "text": "·F·"
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "R"
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
                    "kind": "text",
                    "text": "c"
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
            "kind": "text",
            "text": "R"
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
                  "kind": "text",
                  "text": "R"
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
        "kind": "text",
        "text": "Σ"
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
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "Σ"
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
              "kind": "text",
              "text": "β"
            }
          ]
        },
        {
          "kind": "text",
          "text": "Σ"
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
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "g"
        },
        "sub": [
          {
            "kind": "text",
            "text": "N"
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
            "text": "m'·"
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
              "text": "R"
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
                "text": "R"
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
            "text": "ρ"
          }
        ]
      },
      {
        "kind": "text",
        "text": " + m·m'·"
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
              "text": "β"
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
          "kind": "text",
          "text": "Σ"
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
        "kind": "paren",
        "of": [
          {
            "kind": "text",
            "text": "2·"
          },
          {
            "kind": "text",
            "text": "σ"
          },
          {
            "kind": "text",
            "text": "·F·"
          },
          {
            "kind": "scripted",
            "base": {
              "kind": "text",
              "text": "R"
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
                      "kind": "text",
                      "text": "c"
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
              "kind": "text",
              "text": "R"
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
                    "kind": "text",
                    "text": "R"
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
          "text": "the vacuum's channel - what the near body prevents, CARRIED as the "
        },
        {
          "kind": "text",
          "text": "δ"
        },
        {
          "kind": "text",
          "text": " that spreads rather than multiplied onto it afterwards, over what the far one is open to:"
        }
      ],
      [
        {
          "kind": "text",
          "text": "  S = "
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
          "text": ",  thinned "
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
            "text": "R"
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
              "text": "R"
            }
          ]
        },
        {
          "kind": "text",
          "text": ",  open to m'·"
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
      ],
      [
        {
          "kind": "text",
          "text": "  = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "m'·"
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
                "text": "R"
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
                  "text": "R"
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
              "text": "ρ"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "the meetings' channel - the two bodies' own radiation, meeting:"
        }
      ],
      [
        {
          "kind": "text",
          "text": "  = m·m'·"
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
                "text": "β"
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
            "kind": "text",
            "text": "Σ"
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
          "kind": "paren",
          "of": [
            {
              "kind": "text",
              "text": "2·"
            },
            {
              "kind": "text",
              "text": "σ"
            },
            {
              "kind": "text",
              "text": "·F·"
            },
            {
              "kind": "scripted",
              "base": {
                "kind": "text",
                "text": "R"
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
                        "kind": "text",
                        "text": "c"
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
                "kind": "text",
                "text": "R"
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
                      "kind": "text",
                      "text": "R"
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
          "kind": "text",
          "text": "and the expansion is not a third - it is the same shortfall where nothing is in the way"
        }
      ],
      [
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "g"
          },
          "sub": [
            {
              "kind": "text",
              "text": "N"
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
              "text": "m'·"
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
                "text": "R"
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
                  "text": "R"
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
              "text": "ρ"
            }
          ]
        },
        {
          "kind": "text",
          "text": " + m·m'·"
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
                "text": "β"
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
            "kind": "text",
            "text": "Σ"
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
          "kind": "paren",
          "of": [
            {
              "kind": "text",
              "text": "2·"
            },
            {
              "kind": "text",
              "text": "σ"
            },
            {
              "kind": "text",
              "text": "·F·"
            },
            {
              "kind": "scripted",
              "base": {
                "kind": "text",
                "text": "R"
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
                        "kind": "text",
                        "text": "c"
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
                "kind": "text",
                "text": "R"
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
                      "kind": "text",
                      "text": "R"
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
        "text": "TWO CHANNELS, and they are not the same thing counted over. The vacuum's needs neither body to emit anything: the near one prevents an expansion, that shortfall spreads, and the far one is pushed into it because fewer rays arrive from that side. The meetings' needs both: it is the cross piece of the quadratic, one body's radiation meeting the other's, and it carries both masses. What a body feels is everything that arrives at it, and things that arrive add. AND THE EXPANSION IS NOT A THIRD: a body prevents the splitting around it, and that one missing making is read as room that never appeared where there is nothing in the way, and as something arriving where there is. Asking what force a body feels puts a body in the way, so it is the second reading - counting both would count one shortfall twice"
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
        "text": "what the waiting makes = "
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
        "text": "ρ"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "no rays, 1 of space"
        }
      ],
      [
        {
          "kind": "text",
          "text": "the waiting makes "
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
          "text": "ρ"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "MOVEMENT hands the ray to itself and grows the world - no ray made, destroyed or moved, and a point of space where there was none. That is a carrier standing still to make the room it could not step into, and the rate it does so at is "
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
        "text": "ρ"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "the room the line does not supply, which the waiting has to make",
    "line": [
      {
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "a"
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
        "text": "ρ"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "the space line carries a term with no rays in it: the waiting"
        }
      ],
      [
        {
          "kind": "text",
          "text": "a ray that cannot step makes the room instead, and that is space at "
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
          "text": "ρ"
        }
      ],
      [
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "a"
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
          "text": "ρ"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "the space ledger gains one wherever a free point splits and loses one wherever two carriers meet, so its net rate per point is the first less the second. NOTHING IS FITTED HERE: it is the space line read off as it stands, and it is the only scale in this theory that is not a count of the tiling"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "the phase between the two pulses, which the body's own acceleration keeps from cancelling",
    "line": [
      {
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "F"
        },
        "sub": [
          {
            "kind": "text",
            "text": "g"
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
          "kind": "text",
          "text": "g"
        },
        "sub": [
          {
            "kind": "text",
            "text": "N"
          }
        ]
      },
      {
        "kind": "text",
        "text": " + "
      },
      {
        "kind": "sqrt",
        "of": [
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
                "text": "4"
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
              "text": "g"
            },
            "sub": [
              {
                "kind": "text",
                "text": "N"
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
            "text": " + "
          },
          {
            "kind": "scripted",
            "base": {
              "kind": "text",
              "text": "g"
            },
            "sub": [
              {
                "kind": "text",
                "text": "N"
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
              "text": "a"
            },
            "sub": [
              {
                "kind": "text",
                "text": "0"
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
          "text": "CREATION: fires at a free point, lights every exit -> the vacuum pulses, period two"
        }
      ],
      [
        {
          "kind": "text",
          "text": "propel + EMISSION: a source moves or pulses, never both -> the second pulse"
        }
      ],
      [
        {
          "kind": "text",
          "text": "an emission r cells out arrives r ticks later, so meeting the vacuum's rays is a parity"
        }
      ],
      [
        {
          "kind": "text",
          "text": "each move flips it, opposite ways fore and aft"
        }
      ],
      [
        {
          "kind": "text",
          "text": "constant speed: the flips cancel.  accelerating: they accumulate, at g"
        }
      ],
      [
        {
          "kind": "text",
          "text": "a flip counts only while the carrier lasts, which is one mean free path"
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
          "text": "ρ"
        },
        {
          "kind": "text",
          "text": "), and "
        },
        {
          "kind": "count",
          "of": [
            {
              "kind": "bar",
              "of": [
                {
                  "kind": "text",
                  "text": "c"
                }
              ]
            }
          ]
        },
        {
          "kind": "text",
          "text": " = 1 so that length is the time too"
        }
      ],
      [
        {
          "kind": "text",
          "text": "an accelerating source displaces "
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
              "text": "2"
            }
          ]
        },
        {
          "kind": "text",
          "text": "g"
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "λ"
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
          "text": " over it - that many flips"
        }
      ],
      [
        {
          "kind": "text",
          "text": "g"
        },
        {
          "kind": "text",
          "text": "λ"
        },
        {
          "kind": "text",
          "text": " is the only dimensionless combination; g"
        },
        {
          "kind": "text",
          "text": "λ"
        },
        {
          "kind": "text",
          "text": " diverges, 1/(g"
        },
        {
          "kind": "text",
          "text": "λ"
        },
        {
          "kind": "text",
          "text": ") turns over"
        }
      ],
      [
        {
          "kind": "text",
          "text": "g = "
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "g"
          },
          "sub": [
            {
              "kind": "text",
              "text": "N"
            }
          ]
        },
        {
          "kind": "text",
          "text": "(1 + 1/(g"
        },
        {
          "kind": "text",
          "text": "λ"
        },
        {
          "kind": "text",
          "text": ")),  and 1/"
        },
        {
          "kind": "text",
          "text": "λ"
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
          "text": "ρ"
        },
        {
          "kind": "text",
          "text": " = "
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "a"
          },
          "sub": [
            {
              "kind": "text",
              "text": "0"
            }
          ]
        }
      ],
      [
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "g"
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
          "text": " - "
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "g"
          },
          "sub": [
            {
              "kind": "text",
              "text": "N"
            }
          ]
        },
        {
          "kind": "text",
          "text": "g - "
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "g"
          },
          "sub": [
            {
              "kind": "text",
              "text": "N"
            }
          ]
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "a"
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
          "text": " = 0"
        }
      ],
      [
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "F"
          },
          "sub": [
            {
              "kind": "text",
              "text": "g"
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
            "kind": "text",
            "text": "g"
          },
          "sub": [
            {
              "kind": "text",
              "text": "N"
            }
          ]
        },
        {
          "kind": "text",
          "text": " + "
        },
        {
          "kind": "sqrt",
          "of": [
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
                  "text": "4"
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
                "text": "g"
              },
              "sub": [
                {
                  "kind": "text",
                  "text": "N"
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
              "text": " + "
            },
            {
              "kind": "scripted",
              "base": {
                "kind": "text",
                "text": "g"
              },
              "sub": [
                {
                  "kind": "text",
                  "text": "N"
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
                "text": "a"
              },
              "sub": [
                {
                  "kind": "text",
                  "text": "0"
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
        "text": "CREATION fires only where nothing is going on and lights every exit, so a point fires, fills, drains and fires - the vacuum pulses every other tick. And a source moves or pulses and never both, which is what puts (1-"
      },
      {
        "kind": "text",
        "text": "β"
      },
      {
        "kind": "text",
        "text": ") on the line. So there are two pulses and moving shifts the phase between them: an emission reaches a place r cells away after r ticks, and whether it arrives while the vacuum there is lit - and is doused by the meeting rule - is a parity. Each move flips it, and moving toward a place shortens the path where moving away lengthens it, so the flip goes opposite ways fore and aft. AT A CONSTANT SPEED THOSE CANCEL; under an acceleration they accumulate, because the rate of flipping keeps changing - and what a body accelerates at is g itself. That is what puts g on the right-hand side. Measured against the only rate the vacuum has it is "
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "a"
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
        "text": "/g, and solving is the one place here where anything is solved rather than assembled: strong field gives back "
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "g"
        },
        "sub": [
          {
            "kind": "text",
            "text": "N"
          }
        ]
      },
      {
        "kind": "text",
        "text": " exactly, weak field the GEOMETRIC MEAN of what arrives and the rate space is made - so g carries the ROOT of the mass "
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "g"
        },
        "sub": [
          {
            "kind": "text",
            "text": "N"
          }
        ]
      },
      {
        "kind": "text",
        "text": " carries whole"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "what one action a tick does to a moving body",
    "line": [
      {
        "kind": "text",
        "text": "how motion moves it = "
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
              "text": "β"
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
          "text": "what a body puts out: "
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
              "text": "β"
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
            "text": "Σ"
          },
          "sub": [
            {
              "kind": "text",
              "text": "0"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "the meetings channel needs both: (1-"
        },
        {
          "kind": "text",
          "text": "β"
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
              "text": "2"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "the vacuum's channel needs neither: 1"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "the meetings channel is one body's radiation meeting the other's, so it needs both to be shining and carries the share twice. The vacuum's channel needs neither to emit anything - an inert body suppresses the expansion just by sitting there - so it carries none of it. Gravity between things in motion is therefore weaker, and weaker in ONE of its two channels, which is a thing that could be looked for"
      }
    ],
    "measured": []
  }
];
