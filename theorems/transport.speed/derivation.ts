/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * transport.speed, for G on any
 * (D null, DEG null), box null, null ticks.
 *
 * v = \frac{\omega}{n_{f} + 1}
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

export const THEOREM = "transport.speed";
export const ASKS = "MOVEMENT says a ray goes one cell a tick, and then says what happens when there is no cell. How fast does a carrier actually go?";
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
    "text": "v = "
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
        "kind": "paren",
        "of": [
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
        ]
      },
      {
        "kind": "text",
        "text": " + "
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
          "kind": "paren",
          "of": [
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
          ]
        },
        {
          "kind": "text",
          "text": " + "
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
  }
];
