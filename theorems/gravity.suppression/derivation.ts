/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * gravity.suppression, for G on any
 * (D null, DEG null), box null, null ticks.
 *
 * what a body puts into the medium = \frac{\nu·\paren{1 - \rho}·A}{\sigma·\rho}
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

export const THEOREM = "gravity.suppression";
export const ASKS = "every cell of a body prevents an expansion. Does the pull go as its bulk or as its surface - and does anything in these rules decide?";
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
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
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
  }
];
