/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * gravity.index, for G on any
 * (D null, DEG null), box null, null ticks.
 *
 * N in r = \frac{1}{\frac{-2·\paren{1 - \beta}·\Sigma_{0}·A·\paren{1 - \paren{1 - \frac{\rho}{2}}^{\bar{R}}}·r^{-\paren{D - 2}}}{\rho} + 1}
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
    "text": "N in "
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
    "kind": "frac",
    "over": [
      {
        "kind": "text",
        "text": "1"
      }
    ],
    "under": [
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "-2·"
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
        "under": [
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
    "via": "the line",
    "line": [
      {
        "kind": "text",
        "text": "the folds line nets = "
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
        "text": " - "
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
          "text": " into folds -"
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
          "text": " into folds 1"
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
          "text": "n into folds 0"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "every term of the line does something to the folds ledger - its rate, times what its gates let through, times the count one firing puts in - and what the ledger does per point per tick is those added up. Nothing is left out and nothing is counted twice, which is the whole reason for reading it off the line rather than assembling it again wherever it is wanted"
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
    "via": "what a place has swallowed, where the folding pays for the handing back",
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
        "text": "what a body ADDS to the fold record, over what the vacuum settles to on its own. The settled part is everywhere alike and is the vacuum's own index; this is the part that depends on where you are relative to a body, and it is what a metric is"
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
        "text": "N in "
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
      }
    ],
    "working": [
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
        "text": " is not a primitive here - it is what the line above shows it to be, so it stands in for itself"
      }
    ],
    "measured": []
  }
];
