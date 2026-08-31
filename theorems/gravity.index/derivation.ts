/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * gravity.index, for G on any
 * (D null, DEG null), box null, null ticks.
 *
 * N in r = \frac{1}{1 - \nu·\paren{1 - \rho}·r^{-\paren{D - 2}}}
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

export const THEOREM = "gravity.index";
export const ASKS = "one term of the line swings a heading. What refractive index is that, and what does it come to at a distance from a body?";
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
    "text": "N in r = "
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
        "text": "1 - "
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
                "text": " - 2"
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
    "via": "the kernel",
    "line": [
      {
        "kind": "text",
        "text": "what swings a heading = "
      },
      {
        "kind": "text",
        "text": "∇"
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
            "text": "f"
          }
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "the line's direction term is the kernel's first moment - which way a turn leans on average"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "what a place stands for, counted off what a fold does",
    "line": [
      {
        "kind": "text",
        "text": "N = "
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
            "text": "1 - "
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
                "text": "f"
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
          "text": "a ray crosses where it stands: one tick per point the place stands for"
        }
      ],
      [
        {
          "kind": "text",
          "text": "fold joins what was behind each point onto the other, so the count is transitive"
        }
      ],
      [
        {
          "kind": "text",
          "text": "folds along the path: "
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
              "text": "f"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "N = 1 + "
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
              "text": "f"
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
            "text": "n"
          },
          "sub": [
            {
              "kind": "text",
              "text": "f"
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
          "text": " + ... = "
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
              "text": "1 - "
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
                  "text": "f"
                }
              ]
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "N = "
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
              "text": "1 - "
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
                  "text": "f"
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
        "text": "MOVEMENT says a ray crosses where it stands before it goes anywhere, one tick per point the place stands for - so the index IS that count. What the count is comes off `fold`, which joins what was behind each of the two points onto the other: a place that swallows another inherits what THAT place stood for, including whatever it had already swallowed. So it is a sum over CHAINS of folds rather than a tally of them, which is geometric and comes to 1/(1 - n). It converges because `unfold` hands a point back at every free point, so the chains are cut off by the same balance the space ledger is written in. Continuum ray optics would exponentiate here instead - that is the right sum where a path picks up a little at a time, and this lattice folds a whole point at a time"
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
    "kind": "theorem",
    "via": "what is left behind is what arrived, summed",
    "line": [
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
          "text": "δ"
        },
        {
          "kind": "text",
          "text": " per site "
        },
        {
          "kind": "text",
          "text": "∝"
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
          "text": " = "
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
          "kind": "text",
          "text": "δ"
        },
        {
          "kind": "text",
          "text": " "
        },
        {
          "kind": "text",
          "text": "dr "
        },
        {
          "kind": "text",
          "text": "∝"
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
              "text": "-2)"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "which is 1/r in three dimensions - the potential, from the flux"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "the record is an accumulation and what accumulates is what arrives, so it is the flux integrated - one power weaker than the flux itself"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "substituting",
    "line": [
      {
        "kind": "text",
        "text": "N in r = "
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
            "text": "1 - "
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
                    "text": " - 2"
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
          "text": "N = "
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
              "text": "1 - "
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
                  "text": "f"
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
                  "text": " - 2"
                }
              ]
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "N = "
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
              "text": "1 - "
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
                      "text": " - 2"
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
        "text": " is not a primitive here - it is what the line above shows it to be, so it stands in for itself"
      }
    ],
    "measured": []
  }
];
