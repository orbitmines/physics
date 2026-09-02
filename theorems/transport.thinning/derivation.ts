/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * transport.thinning, for G on any
 * (D null, DEG null), box null, null ticks.
 *
 * n = \Phi·r^{-\paren{D - 1}}·\paren{n_{f} + 1}
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

export const THEOREM = "transport.thinning";
export const ASKS = "a medium carries something outward from a source, and its carriers may have to make the room they cross. How thick is it at r steps?";
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
    "text": "n = "
  },
  {
    "kind": "text",
    "text": "Φ"
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
    "via": "the line",
    "line": [
      {
        "kind": "text",
        "text": "the folds line nets = "
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
        "kind": "paren",
        "of": [
          {
            "kind": "text",
            "text": "1 - "
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
          "text": " into folds 1"
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
          "kind": "text",
          "text": " n into folds 0"
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
    "via": "what a place has swallowed, where the folding pays for the handing back",
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
        "kind": "words",
        "text": "the "
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
        "text": " F·"
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
        "text": " - "
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
              ]
            },
            "sup": [
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
      },
      {
        "kind": "text",
        "text": " = 0 + "
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
          "text": "the folds line: "
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
          "kind": "paren",
          "of": [
            {
              "kind": "text",
              "text": "1 - "
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
      [
        {
          "kind": "text",
          "text": "a meeting makes 1; a split hands back -"
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
          "text": ", one per way out"
        }
      ],
      [
        {
          "kind": "text",
          "text": "and only where there is one to hand back: P = 1 - "
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
            ]
          },
          "sup": [
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
          "text": "the vacuum's own level, where the two rates pay for each other: "
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
          "text": " "
        },
        {
          "kind": "words",
          "text": " where "
        },
        {
          "kind": "text",
          "text": " F·"
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
          "text": " - "
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
                ]
              },
              "sup": [
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
        },
        {
          "kind": "text",
          "text": " = 0"
        }
      ],
      [
        {
          "kind": "text",
          "text": "and a body's, one power weaker than what it prevents: "
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
          "kind": "words",
          "text": "the "
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
          "text": " F·"
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
          "text": " - "
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
                ]
              },
              "sup": [
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
        },
        {
          "kind": "text",
          "text": " = 0 + "
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
    ],
    "because": [
      {
        "kind": "text",
        "text": "a meeting leaves a fold and handing a point back takes one away, so what a place has swallowed is not a tally that only grows - it settles where the two rates pay for each other, and that value is the same everywhere the vacuum is left alone. A BODY ADDS TO IT: what it prevents spreads, and an accumulation of what arrives is one power weaker than the flux. `turns` draws on the sum, so both belong"
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
    "via": "how fast a carrier goes, which is the share of its step that was straight",
    "line": [
      {
        "kind": "text",
        "text": "v = "
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
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "turns: 1 way straight on against folds[d] ways out along d"
        }
      ],
      [
        {
          "kind": "text",
          "text": "so a ray keeps its heading with 1/(1 + "
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
          "text": ")"
        }
      ],
      [
        {
          "kind": "text",
          "text": "v = "
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
          "text": "/(1 + "
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
          "text": " small: v -> one cell a tick, and the carrier streams"
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
          "text": " large: v -> "
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
          "text": "/"
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
          "text": ", and it does not"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "MOVEMENT does not simply move a ray one cell: it draws where the ray goes, one way straight on against the ways each direction was folded. A place that has swallowed "
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
        "text": " folds sends it straight with 1/(1 + "
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
        "text": ") and turns it otherwise, so what advances it OUTWARD is that share. It is statistical and it is local, and it applies wherever the vacuum has met itself - which is everywhere, unlike the waiting, which happens only where there is no cell at all and so only at the frontier"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "what crosses a shell is the room times what is at each site times how fast it goes",
    "line": [
      {
        "kind": "text",
        "text": "n = "
      },
      {
        "kind": "text",
        "text": "Φ"
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
          "text": "Φ"
        },
        {
          "kind": "text",
          "text": " = shell·n·v"
        }
      ],
      [
        {
          "kind": "text",
          "text": "v = "
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
        }
      ],
      [
        {
          "kind": "text",
          "text": "n = "
        },
        {
          "kind": "text",
          "text": "Φ"
        },
        {
          "kind": "text",
          "text": "/(shell·v) = "
        },
        {
          "kind": "text",
          "text": "Φ"
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
          "kind": "words",
          "text": "the "
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
          "text": " F·"
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
          "text": " - "
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
                ]
              },
              "sup": [
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
        },
        {
          "kind": "text",
          "text": " = 0 + "
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
        },
        {
          "kind": "text",
          "text": ", which grows with how far a ray has come"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "count what crosses a shell in a tick - the sites on it, what is at each, and the share of a step that went outward - and MOVEMENT neither makes nor destroys, so that count is carried. Solved for what is AT a site it is the flux over the room over the speed, and the speed is the share of the draw that did not turn. THE FOLD RECORD IS WHAT MAKES THIS MORE THAN A DILUTION: it grows with how far a ray has come, so 1 + "
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
        "text": " rises outward and the density falls more slowly than the room alone would have it. Close in that is nothing and this is an inverse square; far out it is not"
      }
    ],
    "measured": []
  }
];
