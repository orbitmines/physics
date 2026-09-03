/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * gravity.horizon, for G on any
 * (D null, DEG null), box null, null ticks.
 *
 * S at the horizon = DEG·r^{D - 1}
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

export const THEOREM = "gravity.horizon";
export const ASKS = "the shortfall grows without limit as a body is approached, and a point has only so many exits to be missing. What happens where the two meet?";
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
    "text": "S at the horizon = "
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
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
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
    "via": "where the falloff meets the ceiling",
    "line": [
      {
        "kind": "text",
        "text": "S at the horizon = "
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
      [
        {
          "kind": "text",
          "text": "δ"
        },
        {
          "kind": "text",
          "text": " per site "
        },
        {
          "kind": "text",
          "text": "≤"
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
          "text": ", the ways out a point has"
        }
      ],
      [
        {
          "kind": "text",
          "text": "S = "
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
      [
        {
          "kind": "text",
          "text": "so on three dimensions a mass goes as the AREA of its horizon, not as its radius"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "the shortfall per site goes as S/"
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
        "text": " and cannot exceed "
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
        "text": ", the ways out a point has. Setting the two equal and solving for the SOURCE rather than for the radius - because one over a linear form in "
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
        "text": " is not a linear form in "
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
        "text": ", and these exponents stay linear so a law survives changing the lattice - gives the strength needed to put a horizon at r as the ceiling times the room out there"
      }
    ],
    "measured": []
  }
];
