/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * gravity.sign, for G on any
 * (D null, DEG null), box null, null ticks.
 *
 * the sign of the force = 1
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

export const THEOREM = "gravity.sign";
export const ASKS = "two channels could in principle oppose. Can anything a body does make this law push rather than pull - a second body moving away, for instance?";
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
    "text": "the sign of the force = 1"
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
        "kind": "paren",
        "of": [
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
            "text": " + "
          },
          {
            "kind": "sqrt",
            "of": [
              {
                "kind": "scripted",
                "base": {
                  "kind": "text",
                  "text": "δ"
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
                  "text": "r"
                },
                "sup": [
                  {
                    "kind": "text",
                    "text": "2 - 2·"
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
                "text": " + 4·"
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
          "text": "and it dwells 1/v there, with v = n/(n + "
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
          "text": ")"
        }
      ],
      [
        {
          "kind": "text",
          "text": "δ"
        },
        {
          "kind": "text",
          "text": " = shell·n·n/(n + "
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
          "text": ")"
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
          "kind": "paren",
          "of": [
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
              "text": " + "
            },
            {
              "kind": "sqrt",
              "of": [
                {
                  "kind": "scripted",
                  "base": {
                    "kind": "text",
                    "text": "δ"
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
                    "text": "r"
                  },
                  "sup": [
                    {
                      "kind": "text",
                      "text": "2 - 2·"
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
                  "text": " + 4·"
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
          ]
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "count what crosses a shell in one tick - the sites on it, times what is at each, times the share of ticks each one steps - and MOVEMENT neither makes nor destroys, so that count is carried outward unchanged. So what CROSSES one site is the whole of it over the number of sites there are at that distance. What IS at one site is that again over how fast a share gets across, and how fast a share gets across is not a constant: a carrier with nowhere to step makes the room instead and does not move, so it dwells longer exactly where the medium is thin. Solving the conservation with that speed in it is one quadratic with one root that is not negative - the old line where the medium is dense, and a square root where it is not"
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
        "kind": "paren",
        "of": [
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
            "text": " + "
          },
          {
            "kind": "sqrt",
            "of": [
              {
                "kind": "scripted",
                "base": {
                  "kind": "text",
                  "text": "δ"
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
                  "text": "r"
                },
                "sup": [
                  {
                    "kind": "text",
                    "text": "2 - 2·"
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
                "text": " + 4·"
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
          "kind": "paren",
          "of": [
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
              "text": " + "
            },
            {
              "kind": "sqrt",
              "of": [
                {
                  "kind": "scripted",
                  "base": {
                    "kind": "text",
                    "text": "δ"
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
                    "text": "r"
                  },
                  "sup": [
                    {
                      "kind": "text",
                      "text": "2 - 2·"
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
                  "text": " + 4·"
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
          "kind": "paren",
          "of": [
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
              "text": " + "
            },
            {
              "kind": "sqrt",
              "of": [
                {
                  "kind": "scripted",
                  "base": {
                    "kind": "text",
                    "text": "δ"
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
                    "text": "r"
                  },
                  "sup": [
                    {
                      "kind": "text",
                      "text": "2 - 2·"
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
                  "text": " + 4·"
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
        "kind": "paren",
        "of": [
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
            "text": " + "
          },
          {
            "kind": "sqrt",
            "of": [
              {
                "kind": "scripted",
                "base": {
                  "kind": "text",
                  "text": "Σ"
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
                  "text": "r"
                },
                "sup": [
                  {
                    "kind": "text",
                    "text": "2 - 2·"
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
                "text": " + 4·"
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
          "text": "and it dwells 1/v there, with v = n/(n + "
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
          "text": ")"
        }
      ],
      [
        {
          "kind": "text",
          "text": "Σ"
        },
        {
          "kind": "text",
          "text": " = shell·n·n/(n + "
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
          "text": ")"
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
          "kind": "paren",
          "of": [
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
              "text": " + "
            },
            {
              "kind": "sqrt",
              "of": [
                {
                  "kind": "scripted",
                  "base": {
                    "kind": "text",
                    "text": "Σ"
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
                    "text": "r"
                  },
                  "sup": [
                    {
                      "kind": "text",
                      "text": "2 - 2·"
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
                  "text": " + 4·"
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
          ]
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "count what crosses a shell in one tick - the sites on it, times what is at each, times the share of ticks each one steps - and MOVEMENT neither makes nor destroys, so that count is carried outward unchanged. So what CROSSES one site is the whole of it over the number of sites there are at that distance. What IS at one site is that again over how fast a share gets across, and how fast a share gets across is not a constant: a carrier with nowhere to step makes the room instead and does not move, so it dwells longer exactly where the medium is thin. Solving the conservation with that speed in it is one quadratic with one root that is not negative - the old line where the medium is dense, and a square root where it is not"
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
          "kind": "paren",
          "of": [
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
              "text": " + "
            },
            {
              "kind": "sqrt",
              "of": [
                {
                  "kind": "scripted",
                  "base": {
                    "kind": "text",
                    "text": "Σ"
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
                    "text": "r"
                  },
                  "sup": [
                    {
                      "kind": "text",
                      "text": "2 - 2·"
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
                  "text": " + 4·"
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
        "text": " - its rate, times what its gates let through, times the density to the power its quantifier gives"
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
          "text": " = "
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
        "kind": "frac",
        "over": [
          {
            "kind": "paren",
            "of": [
              {
                "kind": "sqrt",
                "of": [
                  {
                    "kind": "scripted",
                    "base": {
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
                    "sup": [
                      {
                        "kind": "text",
                        "text": "2"
                      }
                    ]
                  },
                  {
                    "kind": "text",
                    "text": " + 4·"
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
                    "kind": "paren",
                    "of": [
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
                        "text": " - 2"
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
                "kind": "text",
                "text": "ν"
              },
              {
                "kind": "text",
                "text": "·"
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
            "kind": "paren",
            "of": [
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
          "text": ",  rays taken a meeting: "
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
          "text": " - 2"
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
        },
        {
          "kind": "text",
          "text": " - 2·"
        },
        {
          "kind": "text",
          "text": "σ"
        },
        {
          "kind": "text",
          "text": " F"
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
          "kind": "frac",
          "over": [
            {
              "kind": "paren",
              "of": [
                {
                  "kind": "sqrt",
                  "of": [
                    {
                      "kind": "scripted",
                      "base": {
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
                      "sup": [
                        {
                          "kind": "text",
                          "text": "2"
                        }
                      ]
                    },
                    {
                      "kind": "text",
                      "text": " + 4·"
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
                      "kind": "paren",
                      "of": [
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
                          "text": " - 2"
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
                  "kind": "text",
                  "text": "ν"
                },
                {
                  "kind": "text",
                  "text": "·"
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
              "kind": "paren",
              "of": [
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
            "text": "·A"
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
          "text": "a cell at depth d is thinned crossing the rest: "
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
        }
      ],
      [
        {
          "kind": "sum",
          "from": [
            {
              "kind": "text",
              "text": "d"
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
          "text": " = "
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
              "text": "ρ"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "so what gets out is the surface, "
        },
        {
          "kind": "text",
          "text": "λ"
        },
        {
          "kind": "text",
          "text": " deep"
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
              "text": "·A"
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
        "text": ", and summing that over the depth leaves the skin: the surface, one mean free path thick. A body twice as deep sends no more than one half its size, and that is an AREA law reached from the same quadratic that gives the meetings their channel"
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
                    "text": " - 2"
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
            "text": "ρ"
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
          "text": "the shortfall at each point goes as "
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
          "kind": "paren",
          "of": [
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
              "text": " + "
            },
            {
              "kind": "sqrt",
              "of": [
                {
                  "kind": "scripted",
                  "base": {
                    "kind": "text",
                    "text": "δ"
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
                    "text": "r"
                  },
                  "sup": [
                    {
                      "kind": "text",
                      "text": "2 - 2·"
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
                  "text": " + 4·"
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
          ]
        }
      ],
      [
        {
          "kind": "sum",
          "from": [
            {
              "kind": "text",
              "text": "r"
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
            "text": "r"
          },
          "sup": [
            {
              "kind": "text",
              "text": "-("
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
              "text": "-1)"
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
            "kind": "text",
            "text": "r"
          },
          "sup": [
            {
              "kind": "text",
              "text": "-("
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
              "text": "-2)"
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
                      "text": " - 2"
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
              "text": "ρ"
            }
          ]
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "the room between two bodies grows at the making rate times how many points there are, and a body has reduced that rate at every one of them. Summed along the line, a shortfall going as "
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
            "text": "-("
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
            "text": "-1)"
          }
        ]
      },
      {
        "kind": "text",
        "text": " comes to "
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
            "text": "-("
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
            "text": "-2)"
          }
        ]
      },
      {
        "kind": "text",
        "text": " - one power weaker, because summing a power raises its exponent. That is the deficit in how fast they are carried apart, and it is what an attraction IS in a model whose gravity is an expansion that did not happen"
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
            "text": "·m'·"
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
                "text": " + "
              },
              {
                "kind": "sqrt",
                "of": [
                  {
                    "kind": "scripted",
                    "base": {
                      "kind": "text",
                      "text": "δ"
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
                      "text": "R"
                    },
                    "sup": [
                      {
                        "kind": "text",
                        "text": "2 - 2·"
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
                    "text": " + 4·"
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
            "text": "m'·"
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
                    "text": " - 2"
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
            "text": "ρ"
          }
        ]
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "the vacuum's channel - what the near body prevents, thinned, over what the far one is open to:"
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
          "kind": "paren",
          "of": [
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
              "text": " + "
            },
            {
              "kind": "sqrt",
              "of": [
                {
                  "kind": "scripted",
                  "base": {
                    "kind": "text",
                    "text": "δ"
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
                    "text": "R"
                  },
                  "sup": [
                    {
                      "kind": "text",
                      "text": "2 - 2·"
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
                  "text": " + 4·"
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
              "text": "·m'·"
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
                  "text": " + "
                },
                {
                  "kind": "sqrt",
                  "of": [
                    {
                      "kind": "scripted",
                      "base": {
                        "kind": "text",
                        "text": "δ"
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
                        "text": "R"
                      },
                      "sup": [
                        {
                          "kind": "text",
                          "text": "2 - 2·"
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
                      "text": " + 4·"
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
          "text": "and the expansion's - the room between them grows, and one of them makes less of it:"
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
                      "text": " - 2"
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
              "text": "ρ"
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
              "text": "·m'·"
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
                  "text": " + "
                },
                {
                  "kind": "sqrt",
                  "of": [
                    {
                      "kind": "scripted",
                      "base": {
                        "kind": "text",
                        "text": "δ"
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
                        "text": "R"
                      },
                      "sup": [
                        {
                          "kind": "text",
                          "text": "2 - 2·"
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
                      "text": " + 4·"
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
              "text": "m'·"
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
                      "text": " - 2"
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
              "text": "ρ"
            }
          ]
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "THREE CHANNELS, and they are not the same thing counted over. The vacuum's needs neither body to emit anything: the near one prevents an expansion, that shortfall spreads, and the far one is pushed into it because fewer rays arrive from that side. The meetings' needs both: it is the cross piece of the quadratic, one body's radiation meeting the other's, and it carries both masses. What a body feels is everything that arrives at it, and things that arrive add - and the third is an expansion that did not happen, which reaches it as an acceleration rather than as a delivery"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "the density where a body is, which is not the density of empty space",
    "line": [
      {
        "kind": "text",
        "text": "ρ"
      },
      {
        "kind": "text",
        "text": " at R = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "paren",
            "of": [
              {
                "kind": "sqrt",
                "of": [
                  {
                    "kind": "scripted",
                    "base": {
                      "kind": "paren",
                      "of": [
                        {
                          "kind": "text",
                          "text": "ν"
                        },
                        {
                          "kind": "text",
                          "text": " + "
                        },
                        {
                          "kind": "frac",
                          "over": [
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
                              "kind": "text",
                              "text": "σ"
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
                                  "text": " + "
                                },
                                {
                                  "kind": "sqrt",
                                  "of": [
                                    {
                                      "kind": "scripted",
                                      "base": {
                                        "kind": "text",
                                        "text": "δ"
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
                                        "text": "R"
                                      },
                                      "sup": [
                                        {
                                          "kind": "text",
                                          "text": "2 - 2·"
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
                                      "text": " + 4·"
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
                    "text": " + 4·"
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
                    "kind": "text",
                    "text": "ν"
                  }
                ]
              },
              {
                "kind": "text",
                "text": " - "
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
                    "text": " + "
                  },
                  {
                    "kind": "frac",
                    "over": [
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
                        "kind": "text",
                        "text": "σ"
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
                            "text": " + "
                          },
                          {
                            "kind": "sqrt",
                            "of": [
                              {
                                "kind": "scripted",
                                "base": {
                                  "kind": "text",
                                  "text": "δ"
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
                                  "text": "R"
                                },
                                "sup": [
                                  {
                                    "kind": "text",
                                    "text": "2 - 2·"
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
                                "text": " + 4·"
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
                ]
              }
            ]
          }
        ],
        "under": [
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
            "text": "·F"
          }
        ]
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "the body's carriers where the far one is: n = "
        },
        {
          "kind": "frac",
          "over": [
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
                  "text": " + "
                },
                {
                  "kind": "sqrt",
                  "of": [
                    {
                      "kind": "scripted",
                      "base": {
                        "kind": "text",
                        "text": "δ"
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
                        "text": "R"
                      },
                      "sup": [
                        {
                          "kind": "text",
                          "text": "2 - 2·"
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
                      "text": " + 4·"
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
          "text": " = "
        },
        {
          "kind": "text",
          "text": "σ"
        },
        {
          "kind": "text",
          "text": " F"
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
          "text": " + "
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
          "text": " n"
        }
      ],
      [
        {
          "kind": "text",
          "text": "σ"
        },
        {
          "kind": "text",
          "text": " F"
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
          "text": " + "
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
              "text": " + "
            },
            {
              "kind": "text",
              "text": "σ"
            },
            {
              "kind": "text",
              "text": " n"
            }
          ]
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
          "text": "ν"
        },
        {
          "kind": "text",
          "text": " = 0"
        }
      ],
      [
        {
          "kind": "text",
          "text": "ρ"
        },
        {
          "kind": "text",
          "text": " at R = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "paren",
              "of": [
                {
                  "kind": "sqrt",
                  "of": [
                    {
                      "kind": "scripted",
                      "base": {
                        "kind": "paren",
                        "of": [
                          {
                            "kind": "text",
                            "text": "ν"
                          },
                          {
                            "kind": "text",
                            "text": " + "
                          },
                          {
                            "kind": "frac",
                            "over": [
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
                                "kind": "text",
                                "text": "σ"
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
                                    "text": " + "
                                  },
                                  {
                                    "kind": "sqrt",
                                    "of": [
                                      {
                                        "kind": "scripted",
                                        "base": {
                                          "kind": "text",
                                          "text": "δ"
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
                                          "text": "R"
                                        },
                                        "sup": [
                                          {
                                            "kind": "text",
                                            "text": "2 - 2·"
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
                                        "text": " + 4·"
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
                      "text": " + 4·"
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
                      "kind": "text",
                      "text": "ν"
                    }
                  ]
                },
                {
                  "kind": "text",
                  "text": " - "
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
                      "text": " + "
                    },
                    {
                      "kind": "frac",
                      "over": [
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
                          "kind": "text",
                          "text": "σ"
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
                              "text": " + "
                            },
                            {
                              "kind": "sqrt",
                              "of": [
                                {
                                  "kind": "scripted",
                                  "base": {
                                    "kind": "text",
                                    "text": "δ"
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
                                    "text": "R"
                                  },
                                  "sup": [
                                    {
                                      "kind": "text",
                                      "text": "2 - 2·"
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
                                  "text": " + 4·"
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
                  ]
                }
              ]
            }
          ],
          "under": [
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
              "text": "·F"
            }
          ]
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "the empty-space density is the root of the making against the taking, and it was derived under a condition it is then used outside of: it holds where the line is about the vacuum and NOT about a source. Near a body there is a source. The meeting rule never asks which body a ray belongs to, so the body's own carriers are taken against as readily as the vacuum's and the balance gains a cross piece, which moves "
      },
      {
        "kind": "text",
        "text": "ν"
      },
      {
        "kind": "text",
        "text": " to "
      },
      {
        "kind": "text",
        "text": "ν"
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
        "text": " n in the linear term and NOWHERE ELSE. IT IS THE SAME QUADRATIC AND THE SAME ROOT. Far out the body's carriers are negligible and it returns exactly "
      },
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
        "text": ", so nothing derived above changes where nothing above was wrong; close in it departs, and it departs under a square root because that is the shape the rules' own balance has"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "and the law read at the density that is actually there",
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
            "text": "·m'·"
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
                "text": " + "
              },
              {
                "kind": "sqrt",
                "of": [
                  {
                    "kind": "scripted",
                    "base": {
                      "kind": "text",
                      "text": "δ"
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
                      "text": "R"
                    },
                    "sup": [
                      {
                        "kind": "text",
                        "text": "2 - 2·"
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
                    "text": " + 4·"
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
            "text": "m'·"
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
                    "text": " - 2"
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
            "text": "ρ"
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
              "text": "·m'·"
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
                  "text": " + "
                },
                {
                  "kind": "sqrt",
                  "of": [
                    {
                      "kind": "scripted",
                      "base": {
                        "kind": "text",
                        "text": "δ"
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
                        "text": "R"
                      },
                      "sup": [
                        {
                          "kind": "text",
                          "text": "2 - 2·"
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
                      "text": " + 4·"
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
              "text": "m'·"
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
                      "text": " - 2"
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
              "text": "ρ"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "and the "
        },
        {
          "kind": "text",
          "text": "ρ"
        },
        {
          "kind": "text",
          "text": " in it is not "
        },
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
          "text": " but the root where the body is:"
        }
      ],
      [
        {
          "kind": "text",
          "text": "ρ"
        },
        {
          "kind": "text",
          "text": " = "
        },
        {
          "kind": "text",
          "text": "ρ"
        },
        {
          "kind": "text",
          "text": " at R = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "paren",
              "of": [
                {
                  "kind": "sqrt",
                  "of": [
                    {
                      "kind": "scripted",
                      "base": {
                        "kind": "paren",
                        "of": [
                          {
                            "kind": "text",
                            "text": "ν"
                          },
                          {
                            "kind": "text",
                            "text": " + "
                          },
                          {
                            "kind": "frac",
                            "over": [
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
                                "kind": "text",
                                "text": "σ"
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
                                    "text": " + "
                                  },
                                  {
                                    "kind": "sqrt",
                                    "of": [
                                      {
                                        "kind": "scripted",
                                        "base": {
                                          "kind": "text",
                                          "text": "δ"
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
                                          "text": "R"
                                        },
                                        "sup": [
                                          {
                                            "kind": "text",
                                            "text": "2 - 2·"
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
                                        "text": " + 4·"
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
                      "text": " + 4·"
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
                      "kind": "text",
                      "text": "ν"
                    }
                  ]
                },
                {
                  "kind": "text",
                  "text": " - "
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
                      "text": " + "
                    },
                    {
                      "kind": "frac",
                      "over": [
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
                          "kind": "text",
                          "text": "σ"
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
                              "text": " + "
                            },
                            {
                              "kind": "sqrt",
                              "of": [
                                {
                                  "kind": "scripted",
                                  "base": {
                                    "kind": "text",
                                    "text": "δ"
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
                                    "text": "R"
                                  },
                                  "sup": [
                                    {
                                      "kind": "text",
                                      "text": "2 - 2·"
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
                                  "text": " + 4·"
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
                  ]
                }
              ]
            }
          ],
          "under": [
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
              "text": "·F"
            }
          ]
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
              "text": "·m'·"
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
                  "text": " + "
                },
                {
                  "kind": "sqrt",
                  "of": [
                    {
                      "kind": "scripted",
                      "base": {
                        "kind": "text",
                        "text": "δ"
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
                        "text": "R"
                      },
                      "sup": [
                        {
                          "kind": "text",
                          "text": "2 - 2·"
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
                      "text": " + 4·"
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
              "text": "m'·"
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
                      "text": " - 2"
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
              "text": "ρ"
            }
          ]
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "what a body has delivered to it was assembled in terms of the density, because the rules gate on it: CREATION fires only where a point is free, so its channel carries (1-"
      },
      {
        "kind": "text",
        "text": "ρ"
      },
      {
        "kind": "text",
        "text": ")/"
      },
      {
        "kind": "text",
        "text": "ρ"
      },
      {
        "kind": "text",
        "text": ", and the meetings' channel carries it through how far a carrier gets. Which density that is came from the balance, and the balance near a body has a different root. Reading the same law at the right root is the whole of this step - no channel is added, no term is dropped, and nothing is fitted"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "with every factor written in",
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
        "text": " in full = m'·"
      },
      {
        "kind": "paren",
        "of": [
          {
            "kind": "frac",
            "over": [
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
                    "text": " + "
                  },
                  {
                    "kind": "sqrt",
                    "of": [
                      {
                        "kind": "scripted",
                        "base": {
                          "kind": "text",
                          "text": "δ"
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
                          "text": "R"
                        },
                        "sup": [
                          {
                            "kind": "text",
                            "text": "2 - 2·"
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
                        "text": " + 4·"
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
                "text": "ρ"
              }
            ]
          },
          {
            "kind": "text",
            "text": " + m·"
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
                "kind": "text",
                "text": "2·"
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
                    "text": "R"
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
            "text": " + "
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
                        "text": " - 2"
                      }
                    ]
                  }
                ]
              }
            ],
            "under": [
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
              "text": "·m'·"
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
                  "text": " + "
                },
                {
                  "kind": "sqrt",
                  "of": [
                    {
                      "kind": "scripted",
                      "base": {
                        "kind": "text",
                        "text": "δ"
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
                        "text": "R"
                      },
                      "sup": [
                        {
                          "kind": "text",
                          "text": "2 - 2·"
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
                      "text": " + 4·"
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
              "text": "m'·"
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
                      "text": " - 2"
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
              "text": "ρ"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "ν"
        },
        {
          "kind": "text",
          "text": " = 1"
        }
      ],
      [
        {
          "kind": "text",
          "text": "σ"
        },
        {
          "kind": "text",
          "text": " = 1"
        }
      ],
      [
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
      [
        {
          "kind": "text",
          "text": "F = "
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
          "text": " = m'·"
        },
        {
          "kind": "paren",
          "of": [
            {
              "kind": "frac",
              "over": [
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
                      "text": " + "
                    },
                    {
                      "kind": "sqrt",
                      "of": [
                        {
                          "kind": "scripted",
                          "base": {
                            "kind": "text",
                            "text": "δ"
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
                            "text": "R"
                          },
                          "sup": [
                            {
                              "kind": "text",
                              "text": "2 - 2·"
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
                          "text": " + 4·"
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
                  "text": "ρ"
                }
              ]
            },
            {
              "kind": "text",
              "text": " + m·"
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
                  "kind": "text",
                  "text": "2·"
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
                      "text": "R"
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
              "text": " + "
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
                          "text": " - 2"
                        }
                      ]
                    }
                  ]
                }
              ],
              "under": [
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
        "text": "what is read straight off a rewrite is written in, because a reader could not have known it; what has a theorem of its own KEEPS ITS NAME and is cited, because writing it in would replace a proof with its answer. What is left standing is the rules' own rates, the counts of the tiling, the two bodies, and the handful of quantities that have pages of their own"
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
  },
  {
    "kind": "theorem",
    "via": "whether any of it can turn negative",
    "line": [
      {
        "kind": "text",
        "text": "the sign of the force = 1"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "motion contributes "
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
      [
        {
          "kind": "text",
          "text": "β"
        },
        {
          "kind": "text",
          "text": " is a share of ticks, so 0 <= "
        },
        {
          "kind": "text",
          "text": "β"
        },
        {
          "kind": "text",
          "text": " <= 1"
        }
      ],
      [
        {
          "kind": "text",
          "text": "(1-"
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
        },
        {
          "kind": "text",
          "text": " >= 0, with no direction in it"
        }
      ],
      [
        {
          "kind": "text",
          "text": "and every other factor is a rate, a count or an exponential"
        }
      ],
      [
        {
          "kind": "text",
          "text": "so "
        },
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
          "text": " > 0 always - it weakens with motion and never reverses"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "every factor of the assembled law is a rate, a count, a square, or an exponential, and none of those is ever below nothing. In particular the one thing motion contributes is a SHARE OF TICKS - how often a body spent its action crossing a cell rather than shining - which lies between nothing and all, so `(1-\beta)` is never negative and its square is never negative. THE RULE THAT PRODUCES IT ASKS WHETHER A BODY STEPPED, AND A "
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
        "text": " IS A "
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
        "text": " WHICHEVER WAY IT WENT: nothing in it distinguishes toward from away. So the force is attractive always, and a body moving off is pulled LESS rather than pushed - which is a thing that could be looked for, and a thing this theory would be wrong about if a repulsion were ever seen"
      }
    ],
    "measured": []
  }
];
