/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * gravity.schwarzschild, for G on any
 * (D null, DEG null), box null, null ticks.
 *
 * A in r as GR writes it = 1 - r_{s}·r^{-\paren{D - 2}}
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

export const THEOREM = "gravity.schwarzschild";
export const ASKS = "the metric this model derives has Schwarzschild's shape. Written in Schwarzschild's own names, what is it - and where do the two theories actually part?";
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
    "text": "A in r as GR writes it = 1 - "
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
    "sub": [
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "s"
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
            "text": " - 2"
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
        "kind": "var",
        "of": [
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
            "text": "1"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "1 - "
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
                    "text": "f"
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
                  "text": "f"
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
              "text": "N"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = 1 + "
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
                  "text": "f"
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
              "text": "1"
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "1 - "
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
                      "text": "f"
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
        "text": "MOVEMENT says a ray crosses where it stands before it goes anywhere, one tick per point the place stands for - so the index IS that count. What the count is comes off `fold`, which joins what was behind each of the two points onto the other: a place that swallows another inherits what THAT place stood for, including whatever it had already swallowed. So it is a sum over CHAINS of folds rather than a tally of them, which is geometric and comes to 1/(1 - "
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
        "text": "). It converges because `unfold` hands a point back at every free point, so the chains are cut off by the same balance the space ledger is written in. Continuum ray optics would exponentiate here instead - that is the right sum where a path picks up a little at a time, and this lattice folds a whole point at a time"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "an index is a metric",
    "line": [
      {
        "kind": "text",
        "text": "A in "
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
        "text": " = "
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
                  "text": "δ"
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
          "text": "MOVEMENT: one tick per point the place stands for"
        }
      ],
      [
        {
          "kind": "text",
          "text": "a place standing for N points gets through 1/N per tick, so "
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
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "τ"
            }
          ]
        },
        {
          "kind": "text",
          "text": "/dt = 1/"
        },
        {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "N"
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
              "text": "A"
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
            "kind": "paren",
            "of": [
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
                "kind": "var",
                "of": [
                  {
                    "kind": "text",
                    "text": "τ"
                  }
                ]
              },
              {
                "kind": "text",
                "text": "/dt"
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
          "text": " = 1/"
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "N"
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
          "text": " = "
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
                    "text": "δ"
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
    ],
    "because": [
      {
        "kind": "text",
        "text": "MOVEMENT says a ray crosses where it stands before it goes anywhere - ONE TICK PER POINT THE PLACE STANDS FOR. So anything happening at a place that stands for N points gets through 1/N as much of itself per tick of the world, which is what a slow clock IS here. THIS FIXES THE TIME PART ON ITS OWN: it is not read off a ratio to the space part, and there is no freedom left over once it is said. AND THE RATE IS THE ROOT OF THE COEFFICIENT, NOT THE COEFFICIENT. `"
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
        "text": "` multiplies `d"
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "t"
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
        "text": "` in the line element, so a clock ticking at `"
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
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "τ"
          }
        ]
      },
      {
        "kind": "text",
        "text": "/dt` sits at `"
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
        "text": " = "
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "paren",
          "of": [
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
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "τ"
                }
              ]
            },
            {
              "kind": "text",
              "text": "/dt"
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
        "text": "`. What MOVEMENT counts is the RATE, `1/"
      },
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "N"
          }
        ]
      },
      {
        "kind": "text",
        "text": "`, so the coefficient is `1/"
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "N"
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
        "text": "` - and THAT IS WHERE THE FACTOR OF TWO LIVED. Squaring gives `"
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
        "text": " = 1 - 2"
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
                "text": "f"
              }
            ]
          }
        ]
      },
      {
        "kind": "text",
        "text": "`, which is general relativity'"
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
        "text": " `1 - 2"
      },
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "Φ"
          }
        ]
      },
      {
        "kind": "text",
        "text": "`, and it is not put there: it is one count entering a square. Light going at the root of A over B is then a consequence rather than the premise"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "the metric as general relativity writes it",
    "line": [
      {
        "kind": "text",
        "text": "A in r as GR writes it = 1 - "
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
        "sub": [
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "s"
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
          "text": " = 1 - "
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
          "sub": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "s"
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
                  "text": " - 2"
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
              "text": "B"
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
              "text": "1 - "
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
              "sub": [
                {
                  "kind": "var",
                  "of": [
                    {
                      "kind": "text",
                      "text": "s"
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
                      "text": " - 2"
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
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "γ"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = 1, and "
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
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "B"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = 1 as Schwarzschild has it"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "the same metric in Schwarzschild's names. IT IS THE WHOLE FUNCTION AND NOT AN EXPANSION: `"
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
        "text": " = 1 - "
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
        "sub": [
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "s"
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
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": "` and `"
      },
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "B"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = 1/paren{1 - "
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
        "sub": [
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "s"
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
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": "}` is what this model derives, so light bends by twice the Newtonian amount, `gamma` is one, and the perihelion advances by `3pi "
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
        "sub": [
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "s"
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
            "text": "a"
          }
        ]
      },
      {
        "kind": "text",
        "text": "`. WHERE THE TWO THEORIES PART is not here - it is that general relativity has the metric and the force as ONE object and this has them as two derivations sourced by two different masses, and that the force carries a recursion the metric knows nothing about"
      }
    ],
    "measured": []
  }
];
