/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * vacuum.equation, for G on any
 * (D null, DEG null), box null, null ticks.
 *
 * (\partial_{t} + \hat{d}·\nabla_{x} + \paren{\nabla n_{f}}·\nabla_{\hat{d}})n = \nu\paren{1 - \rho} - \sigma\omegan\tilde{n} + \paren{1 - \beta}\Sigma
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

export const THEOREM = "vacuum.equation";
export const ASKS = "every rule of the theory is a term, and every rule touches two things - the population and the space. What ARE the continuous equations, counted off the rules?";
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
    "text": "("
  },
  {
    "kind": "scripted",
    "base": {
      "kind": "text",
      "text": "∂"
    },
    "sub": [
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "t"
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
    "text": "·"
  },
  {
    "kind": "scripted",
    "base": {
      "kind": "text",
      "text": "∇"
    },
    "sub": [
      {
        "kind": "var",
        "of": [
          {
            "kind": "text",
            "text": "x"
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
    "kind": "paren",
    "of": [
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
      "text": "∇"
    },
    "sub": [
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
    ]
  },
  {
    "kind": "text",
    "text": ")"
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
    "text": " + "
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
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "theorem",
    "via": "put in from outside",
    "line": [
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
      },
      {
        "kind": "text",
        "text": " = carried"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "rays: 0"
        }
      ],
      [
        {
          "kind": "text",
          "text": "space: 0"
        }
      ],
      [
        {
          "kind": "text",
          "text": "degree: 0"
        }
      ],
      [
        {
          "kind": "text",
          "text": "term: + "
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
        "text": "no rewrite of the model puts it there - it is what is put into the box from outside, and the only place anything about a particular problem can be written"
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
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "rays: "
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
          "text": "space: 1"
        }
      ],
      [
        {
          "kind": "text",
          "text": "degree: 0"
        }
      ],
      [
        {
          "kind": "text",
          "text": "term: + "
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
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "CREATION contributes it: its body comes to "
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
        "text": " rays and 1 points of space, its quantifier makes it carry no power of the density, and its gates let through what they let through"
      }
    ],
    "measured": []
  },
  {
    "kind": "rule",
    "via": "MOVEMENT",
    "line": [
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
        "text": " = --2"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "rays: -2"
        }
      ],
      [
        {
          "kind": "text",
          "text": "space: -1"
        }
      ],
      [
        {
          "kind": "text",
          "text": "degree: 2, across an edge"
        }
      ],
      [
        {
          "kind": "text",
          "text": "term: - "
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
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "MOVEMENT, ANNIHILATION contributes it: its body comes to -2 rays and -1 points of space, its quantifier makes it of degree 2 in the density across an edge, which is the facing factor, and its gates let through what they let through"
      }
    ],
    "measured": []
  },
  {
    "kind": "rule",
    "via": "MOVEMENT",
    "line": [
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
        "text": "·"
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "∇"
        },
        "sub": [
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "x"
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
        "kind": "paren",
        "of": [
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
          "text": "∇"
        },
        "sub": [
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
        "text": " = carried"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "rays: 0"
        }
      ],
      [
        {
          "kind": "text",
          "text": "space: 0"
        }
      ],
      [
        {
          "kind": "text",
          "text": "degree: 1"
        }
      ],
      [
        {
          "kind": "text",
          "text": "term: + "
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
          "text": "·"
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "∇"
          },
          "sub": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "x"
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
          "kind": "paren",
          "of": [
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
            "text": "∇"
          },
          "sub": [
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
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "MOVEMENT contributes it: its body moves the population without making or taking any, its quantifier makes it of degree 1 in the density, and its gates let through what they let through"
      }
    ],
    "measured": []
  },
  {
    "kind": "rule",
    "via": "MOVEMENT",
    "line": [
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
        "text": " = carried"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "rays: 0"
        }
      ],
      [
        {
          "kind": "text",
          "text": "space: 1"
        }
      ],
      [
        {
          "kind": "text",
          "text": "degree: 1"
        }
      ],
      [
        {
          "kind": "text",
          "text": "term: + "
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
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "n"
            }
          ]
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "MOVEMENT contributes it: its body moves the population without making or taking any, its quantifier makes it of degree 1 in the density, and its gates let through what they let through"
      }
    ],
    "measured": []
  },
  {
    "kind": "rule",
    "via": "ARRIVAL",
    "line": [
      {
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "∂"
        },
        "sub": [
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "t"
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
        "text": " = carried"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "rays: 0"
        }
      ],
      [
        {
          "kind": "text",
          "text": "space: 0"
        }
      ],
      [
        {
          "kind": "text",
          "text": "degree: 1"
        }
      ],
      [
        {
          "kind": "text",
          "text": "term: + "
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "∂"
          },
          "sub": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "t"
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
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "ARRIVAL contributes it: its body moves the population without making or taking any, its quantifier makes it of degree 1 in the density, and its gates let through what they let through"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "and the terms add",
    "line": [
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
        "text": "·"
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "∇"
        },
        "sub": [
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "x"
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
        "kind": "paren",
        "of": [
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
          "text": "∇"
        },
        "sub": [
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
          "text": "∂"
        },
        "sub": [
          {
            "kind": "var",
            "of": [
              {
                "kind": "text",
                "text": "t"
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
        "text": " + "
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
        "text": " + "
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
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "+ "
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
        },
        {
          "kind": "text",
          "text": "   (not a rule)"
        }
      ],
      [
        {
          "kind": "text",
          "text": "+ "
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
          "text": "   (CREATION)"
        }
      ],
      [
        {
          "kind": "text",
          "text": "- "
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
          "text": "   (MOVEMENT, ANNIHILATION)"
        }
      ],
      [
        {
          "kind": "text",
          "text": "+ "
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
          "text": "·"
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "∇"
          },
          "sub": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "x"
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
          "kind": "paren",
          "of": [
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
            "text": "∇"
          },
          "sub": [
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
          "text": "   (MOVEMENT)"
        }
      ],
      [
        {
          "kind": "text",
          "text": "+ "
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
          "text": "   (MOVEMENT)"
        }
      ],
      [
        {
          "kind": "text",
          "text": "+ "
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "∂"
          },
          "sub": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "t"
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
          "text": "   (ARRIVAL)"
        }
      ],
      [
        {
          "kind": "text",
          "text": "("
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "∂"
          },
          "sub": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "t"
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
          "text": "·"
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "∇"
          },
          "sub": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "x"
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
          "kind": "paren",
          "of": [
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
            "text": "∇"
          },
          "sub": [
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
          ]
        },
        {
          "kind": "text",
          "text": ")"
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
          "text": " + "
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
      ],
      [
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "∂"
          },
          "sub": [
            {
              "kind": "var",
              "of": [
                {
                  "kind": "text",
                  "text": "t"
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
              "text": "s"
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
          "text": " + "
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
          "kind": "var",
          "of": [
            {
              "kind": "text",
              "text": "n"
            }
          ]
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "the rules do not consult one another - each fires on its own matches once a tick - so what they do to the population adds, and the line is what they come to rather than a description of them. A theory with a rule taken out writes one term fewer here without anything else changing"
      }
    ],
    "measured": []
  }
];
