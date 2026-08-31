/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * gravity.relativistic, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * F_{g}^{rel} = \frac{F_{g}}{(1-β^{2})^{(m_{r}-m_{s}+2)/2}}·\paren{1 + cos(θ)·β}
 *
 * The notation is parsed into pieces rather than into markup for any one framework:
 * map each piece's `kind` onto whatever you draw with. See `rendering/Notation.ts`.
 */
import type { Piece } from "../../implementations/.ts/src/rendering/Notation.ts";

export type Step = {
  kind: "premise" | "definition" | "derived";
  via: string;
  line: Piece[];
  working: Piece[][];
  because: Piece[];
  measured: { name: string; value: number; err?: number; note?: string }[];
};

export const THEOREM = "gravity.relativistic";
export const ASKS = "nothing here acts at a distance - a shortfall crosses one cell a tick. What does that do to the gravitational law when the two bodies are moving?";
export const UNDER = {
  "theory": "G",
  "geometry": "fcc-12",
  "D": 3,
  "DEG": 12,
  "N": 21,
  "T": 120,
  "seeds": [
    1
  ],
  "regime": null,
  "regimeSays": null
};
export const CONCLUDED: Piece[] = [
  {
    "kind": "text",
    "text": "F"
  },
  {
    "kind": "sub",
    "of": [
      {
        "kind": "text",
        "text": "g"
      }
    ]
  },
  {
    "kind": "sup",
    "of": [
      {
        "kind": "text",
        "text": "rel"
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
        "text": "F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "g"
          }
        ]
      }
    ],
    "under": [
      {
        "kind": "text",
        "text": "(1-β"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "2"
          }
        ]
      },
      {
        "kind": "text",
        "text": ")"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "(m"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "r"
              }
            ]
          },
          {
            "kind": "text",
            "text": "-m"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "s"
              }
            ]
          },
          {
            "kind": "text",
            "text": "+2)/2"
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
        "text": "1 + "
      },
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "cos"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(θ)·β"
      }
    ]
  }
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "definition",
    "via": "gravity.relativistic",
    "line": [
      {
        "kind": "text",
        "text": "F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "g"
          }
        ]
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "rel"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "g"
          }
        ]
      },
      {
        "kind": "text",
        "text": " · retardation · γ"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "m"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "r"
              }
            ]
          },
          {
            "kind": "text",
            "text": "-m"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "s"
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
        "text": "so the force is the one between bodies at rest, times what retardation does to what arrives, times gamma to whatever power the clocks call for. k is +1 if the answer is counted in the receiver's own ticks and -1 if the source is the one moving - a numerator reduction, since a slowed source pulses less often - and 0 in the lattice's own frame, which is where the dynamics run"
      }
    ],
    "measured": []
  },
  {
    "kind": "premise",
    "via": "budget/what-a-tick-is-spent-on",
    "line": [
      {
        "kind": "text",
        "text": "γ = (1-β"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "2"
          }
        ]
      },
      {
        "kind": "text",
        "text": ")"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "-1/2"
          }
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "the clock advances by the crossing component, which is the root of that - so a moving thing ticks at "
      },
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "sqrt"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(1 - β"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "2"
          }
        ]
      },
      {
        "kind": "text",
        "text": ") and one lattice tick is worth (1 - β"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "2"
          }
        ]
      },
      {
        "kind": "text",
        "text": ")"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "-1/2"
          }
        ]
      },
      {
        "kind": "text",
        "text": " of its own. The Lorentz factor, out of a step of fixed length and nothing else"
      }
    ],
    "measured": [
      {
        "name": "distinct exit lengths",
        "value": 1,
        "note": "fcc-12 has one exit length: 1.414213562. A step is a vector of fixed magnitude only where there is one"
      }
    ]
  },
  {
    "kind": "derived",
    "via": "kept exact",
    "line": [
      {
        "kind": "text",
        "text": "γ = (1-β"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "2"
          }
        ]
      },
      {
        "kind": "text",
        "text": ")"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "-1/2"
          }
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "γ is (1-β"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "2"
          }
        ]
      },
      {
        "kind": "text",
        "text": ") to the -1/2, and it is carried as that rather than expanded. The exponent is not a whole positive number, so a series would be infinite and would have to be cut somewhere - and anything built on the cut version inherits the cut. Kept closed it is exact"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "substituting",
    "line": [
      {
        "kind": "text",
        "text": "F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "g"
          }
        ]
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "rel"
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
            "text": "F"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "g"
              }
            ]
          },
          {
            "kind": "text",
            "text": "·retardation"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "(1-β"
          },
          {
            "kind": "sup",
            "of": [
              {
                "kind": "text",
                "text": "2"
              }
            ]
          },
          {
            "kind": "text",
            "text": ")"
          },
          {
            "kind": "sup",
            "of": [
              {
                "kind": "text",
                "text": "(m"
              },
              {
                "kind": "sub",
                "of": [
                  {
                    "kind": "text",
                    "text": "r"
                  }
                ]
              },
              {
                "kind": "text",
                "text": "-m"
              },
              {
                "kind": "sub",
                "of": [
                  {
                    "kind": "text",
                    "text": "s"
                  }
                ]
              },
              {
                "kind": "text",
                "text": ")/2"
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
          "text": "F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "sup",
          "of": [
            {
              "kind": "text",
              "text": "rel"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·retardation·γ"
        },
        {
          "kind": "sup",
          "of": [
            {
              "kind": "text",
              "text": "m"
            },
            {
              "kind": "sub",
              "of": [
                {
                  "kind": "text",
                  "text": "r"
                }
              ]
            },
            {
              "kind": "text",
              "text": "-m"
            },
            {
              "kind": "sub",
              "of": [
                {
                  "kind": "text",
                  "text": "s"
                }
              ]
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "γ = "
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
              "text": "(1-β"
            },
            {
              "kind": "sup",
              "of": [
                {
                  "kind": "text",
                  "text": "2"
                }
              ]
            },
            {
              "kind": "text",
              "text": ")"
            },
            {
              "kind": "sup",
              "of": [
                {
                  "kind": "text",
                  "text": "1/2"
                }
              ]
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "sup",
          "of": [
            {
              "kind": "text",
              "text": "rel"
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
              "text": "F"
            },
            {
              "kind": "sub",
              "of": [
                {
                  "kind": "text",
                  "text": "g"
                }
              ]
            },
            {
              "kind": "text",
              "text": "·retardation"
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "(1-β"
            },
            {
              "kind": "sup",
              "of": [
                {
                  "kind": "text",
                  "text": "2"
                }
              ]
            },
            {
              "kind": "text",
              "text": ")"
            },
            {
              "kind": "sup",
              "of": [
                {
                  "kind": "text",
                  "text": "(m"
                },
                {
                  "kind": "sub",
                  "of": [
                    {
                      "kind": "text",
                      "text": "r"
                    }
                  ]
                },
                {
                  "kind": "text",
                  "text": "-m"
                },
                {
                  "kind": "sub",
                  "of": [
                    {
                      "kind": "text",
                      "text": "s"
                    }
                  ]
                },
                {
                  "kind": "text",
                  "text": ")/2"
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
        "text": "γ is not a primitive of this theory - it is "
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
            "text": "(1-β"
          },
          {
            "kind": "sup",
            "of": [
              {
                "kind": "text",
                "text": "2"
              }
            ]
          },
          {
            "kind": "text",
            "text": ")"
          },
          {
            "kind": "sup",
            "of": [
              {
                "kind": "text",
                "text": "1/2"
              }
            ]
          }
        ]
      },
      {
        "kind": "text",
        "text": ", so it stands in for itself here and the result is multiplied out"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "gravity.relativistic",
    "line": [
      {
        "kind": "text",
        "text": "retardation = w·ahead + (1-w)·behind"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "how much of the time you are on each side is w and 1 - w, so what arrives is the two branches at those weights. Ignorance is w = 1/2 and is not a special case of anything - it is the value that makes the two equal. What this average COMES to is not stated here: it is put over a common denominator by the rules below, and what falls out is exact"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "gravity.relativistic",
    "line": [
      {
        "kind": "text",
        "text": "ahead = "
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
            "text": "(1-β)"
          }
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "what arrives from the compressed branch goes as one over that - carried as an exact power rather than expanded, so nothing below inherits a truncation"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "kept exact",
    "line": [
      {
        "kind": "text",
        "text": "ahead = (1-β)"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "-1"
          }
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "ahead is (1-β) to the -1, and it is carried as that rather than expanded. The exponent is not a whole positive number, so a series would be infinite and would have to be cut somewhere - and anything built on the cut version inherits the cut. Kept closed it is exact"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "substituting",
    "line": [
      {
        "kind": "text",
        "text": "retardation = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "w"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "(1-β)"
          }
        ]
      },
      {
        "kind": "text",
        "text": " + behind - behind·w"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "retardation = ahead·w + behind - behind·w"
        }
      ],
      [
        {
          "kind": "text",
          "text": "ahead = "
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
              "text": "(1-β)"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "retardation = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "w"
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "(1-β)"
            }
          ]
        },
        {
          "kind": "text",
          "text": " + behind - behind·w"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "ahead is not a primitive of this theory - it is "
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
            "text": "(1-β)"
          }
        ]
      },
      {
        "kind": "text",
        "text": ", so it stands in for itself here and the result is multiplied out"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "gravity.relativistic",
    "line": [
      {
        "kind": "text",
        "text": "behind = "
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
            "text": "(1+β)"
          }
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "and from the stretched one, one over the other"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "kept exact",
    "line": [
      {
        "kind": "text",
        "text": "behind = (1+β)"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "-1"
          }
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "behind is (1+β) to the -1, and it is carried as that rather than expanded. The exponent is not a whole positive number, so a series would be infinite and would have to be cut somewhere - and anything built on the cut version inherits the cut. Kept closed it is exact"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "substituting",
    "line": [
      {
        "kind": "text",
        "text": "retardation = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "w"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "(1-β)"
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
            "text": "1"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "(1+β)"
          }
        ]
      },
      {
        "kind": "text",
        "text": " - "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "w"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "(1+β)"
          }
        ]
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "retardation = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "w"
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "(1-β)"
            }
          ]
        },
        {
          "kind": "text",
          "text": " + behind - behind·w"
        }
      ],
      [
        {
          "kind": "text",
          "text": "behind = "
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
              "text": "(1+β)"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "retardation = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "w"
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "(1-β)"
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
              "text": "1"
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "(1+β)"
            }
          ]
        },
        {
          "kind": "text",
          "text": " - "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "w"
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "(1+β)"
            }
          ]
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "behind is not a primitive of this theory - it is "
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
            "text": "(1+β)"
          }
        ]
      },
      {
        "kind": "text",
        "text": ", so it stands in for itself here and the result is multiplied out"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "over a common denominator",
    "line": [
      {
        "kind": "text",
        "text": "retardation = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "fn",
            "of": [
              {
                "kind": "text",
                "text": "num"
              }
            ]
          },
          {
            "kind": "text",
            "text": "(retardation)"
          }
        ],
        "under": [
          {
            "kind": "fn",
            "of": [
              {
                "kind": "text",
                "text": "den"
              }
            ]
          },
          {
            "kind": "text",
            "text": "(retardation)"
          }
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "so retardation is the one over the other"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "over a common denominator",
    "line": [
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "num"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(retardation) = (1-β) - (1-β)·w + (1+β)·w"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "putting retardation over (1+β)·(1-β), what is left on top is (1-β) - (1-β)·w + (1+β)·w - the schoolbook move, and nothing about it knows what these quantities are"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "over a common denominator",
    "line": [
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "den"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(retardation) = (1+β)·(1-β)"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "and underneath is (1+β)·(1-β)"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "gravity.relativistic",
    "line": [
      {
        "kind": "text",
        "text": "(1-β) = 1 - β"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "over the delay the source has moved, so the branch that set out ahead of the motion left from closer than R and arrives compressed - by one less the fraction of a cell a tick it is going"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "substituting",
    "line": [
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "den"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(retardation) = (1+β) - (1+β)·β"
      }
    ],
    "working": [
      [
        {
          "kind": "fn",
          "of": [
            {
              "kind": "text",
              "text": "den"
            }
          ]
        },
        {
          "kind": "text",
          "text": "(retardation) = (1+β)·(1-β)"
        }
      ],
      [
        {
          "kind": "text",
          "text": "(1-β) = 1 - β"
        }
      ],
      [
        {
          "kind": "fn",
          "of": [
            {
              "kind": "text",
              "text": "den"
            }
          ]
        },
        {
          "kind": "text",
          "text": "(retardation) = (1+β) - (1+β)·β"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "(1-β) is not a primitive of this theory - it is 1 - β, so it stands in for itself here and the result is multiplied out"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "the same quantity",
    "line": [
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "den"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(retardation) = (1-β"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "2"
          }
        ]
      },
      {
        "kind": "text",
        "text": ")"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "den"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(retardation) and (1-β"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "2"
          }
        ]
      },
      {
        "kind": "text",
        "text": ") both come to 1 - β"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "2"
          }
        ]
      },
      {
        "kind": "text",
        "text": ", so they are the same quantity reached by two roads - and whatever is written in terms of one can be written in terms of the other"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "one over another",
    "line": [
      {
        "kind": "text",
        "text": "retardation = "
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
            "text": "(1-β"
          },
          {
            "kind": "sup",
            "of": [
              {
                "kind": "text",
                "text": "2"
              }
            ]
          },
          {
            "kind": "text",
            "text": ")"
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
            "kind": "fn",
            "of": [
              {
                "kind": "text",
                "text": "cos"
              }
            ]
          },
          {
            "kind": "text",
            "text": "(θ)·β"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "(1-β"
          },
          {
            "kind": "sup",
            "of": [
              {
                "kind": "text",
                "text": "2"
              }
            ]
          },
          {
            "kind": "text",
            "text": ")"
          }
        ]
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "retardation = "
        },
        {
          "kind": "fn",
          "of": [
            {
              "kind": "text",
              "text": "num"
            }
          ]
        },
        {
          "kind": "text",
          "text": "(retardation) / "
        },
        {
          "kind": "fn",
          "of": [
            {
              "kind": "text",
              "text": "den"
            }
          ]
        },
        {
          "kind": "text",
          "text": "(retardation)"
        }
      ],
      [
        {
          "kind": "text",
          "text": "= ((1-β) - (1-β)·w + (1+β)·w) / ((1-β"
        },
        {
          "kind": "sup",
          "of": [
            {
              "kind": "text",
              "text": "2"
            }
          ]
        },
        {
          "kind": "text",
          "text": "))"
        }
      ],
      [
        {
          "kind": "text",
          "text": "= "
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
              "text": "(1-β"
            },
            {
              "kind": "sup",
              "of": [
                {
                  "kind": "text",
                  "text": "2"
                }
              ]
            },
            {
              "kind": "text",
              "text": ")"
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
              "kind": "fn",
              "of": [
                {
                  "kind": "text",
                  "text": "cos"
                }
              ]
            },
            {
              "kind": "text",
              "text": "(θ)·β"
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "(1-β"
            },
            {
              "kind": "sup",
              "of": [
                {
                  "kind": "text",
                  "text": "2"
                }
              ]
            },
            {
              "kind": "text",
              "text": ")"
            }
          ]
        }
      ]
    ],
    "because": [
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "num"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(retardation) is (1-β) - (1-β)·w + (1+β)·w and "
      },
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "den"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(retardation) is (1-β"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "2"
          }
        ]
      },
      {
        "kind": "text",
        "text": "), so the one over the other is "
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
            "text": "(1-β"
          },
          {
            "kind": "sup",
            "of": [
              {
                "kind": "text",
                "text": "2"
              }
            ]
          },
          {
            "kind": "text",
            "text": ")"
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
            "kind": "fn",
            "of": [
              {
                "kind": "text",
                "text": "cos"
              }
            ]
          },
          {
            "kind": "text",
            "text": "(θ)·β"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "(1-β"
          },
          {
            "kind": "sup",
            "of": [
              {
                "kind": "text",
                "text": "2"
              }
            ]
          },
          {
            "kind": "text",
            "text": ")"
          }
        ]
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "substituting",
    "line": [
      {
        "kind": "text",
        "text": "F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "g"
          }
        ]
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "rel"
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
            "text": "F"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "g"
              }
            ]
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "(1-β"
          },
          {
            "kind": "sup",
            "of": [
              {
                "kind": "text",
                "text": "2"
              }
            ]
          },
          {
            "kind": "text",
            "text": ")"
          },
          {
            "kind": "sup",
            "of": [
              {
                "kind": "text",
                "text": "(m"
              },
              {
                "kind": "sub",
                "of": [
                  {
                    "kind": "text",
                    "text": "r"
                  }
                ]
              },
              {
                "kind": "text",
                "text": "-m"
              },
              {
                "kind": "sub",
                "of": [
                  {
                    "kind": "text",
                    "text": "s"
                  }
                ]
              },
              {
                "kind": "text",
                "text": "+2)/2"
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
            "text": "F"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "g"
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
                "text": "cos"
              }
            ]
          },
          {
            "kind": "text",
            "text": "(θ)·β"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "(1-β"
          },
          {
            "kind": "sup",
            "of": [
              {
                "kind": "text",
                "text": "2"
              }
            ]
          },
          {
            "kind": "text",
            "text": ")"
          },
          {
            "kind": "sup",
            "of": [
              {
                "kind": "text",
                "text": "(m"
              },
              {
                "kind": "sub",
                "of": [
                  {
                    "kind": "text",
                    "text": "r"
                  }
                ]
              },
              {
                "kind": "text",
                "text": "-m"
              },
              {
                "kind": "sub",
                "of": [
                  {
                    "kind": "text",
                    "text": "s"
                  }
                ]
              },
              {
                "kind": "text",
                "text": "+2)/2"
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
          "text": "F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "sup",
          "of": [
            {
              "kind": "text",
              "text": "rel"
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
              "text": "F"
            },
            {
              "kind": "sub",
              "of": [
                {
                  "kind": "text",
                  "text": "g"
                }
              ]
            },
            {
              "kind": "text",
              "text": "·retardation"
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "(1-β"
            },
            {
              "kind": "sup",
              "of": [
                {
                  "kind": "text",
                  "text": "2"
                }
              ]
            },
            {
              "kind": "text",
              "text": ")"
            },
            {
              "kind": "sup",
              "of": [
                {
                  "kind": "text",
                  "text": "(m"
                },
                {
                  "kind": "sub",
                  "of": [
                    {
                      "kind": "text",
                      "text": "r"
                    }
                  ]
                },
                {
                  "kind": "text",
                  "text": "-m"
                },
                {
                  "kind": "sub",
                  "of": [
                    {
                      "kind": "text",
                      "text": "s"
                    }
                  ]
                },
                {
                  "kind": "text",
                  "text": ")/2"
                }
              ]
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "retardation = "
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
              "text": "(1-β"
            },
            {
              "kind": "sup",
              "of": [
                {
                  "kind": "text",
                  "text": "2"
                }
              ]
            },
            {
              "kind": "text",
              "text": ")"
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
              "kind": "fn",
              "of": [
                {
                  "kind": "text",
                  "text": "cos"
                }
              ]
            },
            {
              "kind": "text",
              "text": "(θ)·β"
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "(1-β"
            },
            {
              "kind": "sup",
              "of": [
                {
                  "kind": "text",
                  "text": "2"
                }
              ]
            },
            {
              "kind": "text",
              "text": ")"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "g"
            }
          ]
        },
        {
          "kind": "sup",
          "of": [
            {
              "kind": "text",
              "text": "rel"
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
              "text": "F"
            },
            {
              "kind": "sub",
              "of": [
                {
                  "kind": "text",
                  "text": "g"
                }
              ]
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "(1-β"
            },
            {
              "kind": "sup",
              "of": [
                {
                  "kind": "text",
                  "text": "2"
                }
              ]
            },
            {
              "kind": "text",
              "text": ")"
            },
            {
              "kind": "sup",
              "of": [
                {
                  "kind": "text",
                  "text": "(m"
                },
                {
                  "kind": "sub",
                  "of": [
                    {
                      "kind": "text",
                      "text": "r"
                    }
                  ]
                },
                {
                  "kind": "text",
                  "text": "-m"
                },
                {
                  "kind": "sub",
                  "of": [
                    {
                      "kind": "text",
                      "text": "s"
                    }
                  ]
                },
                {
                  "kind": "text",
                  "text": "+2)/2"
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
              "text": "F"
            },
            {
              "kind": "sub",
              "of": [
                {
                  "kind": "text",
                  "text": "g"
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
                  "text": "cos"
                }
              ]
            },
            {
              "kind": "text",
              "text": "(θ)·β"
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "(1-β"
            },
            {
              "kind": "sup",
              "of": [
                {
                  "kind": "text",
                  "text": "2"
                }
              ]
            },
            {
              "kind": "text",
              "text": ")"
            },
            {
              "kind": "sup",
              "of": [
                {
                  "kind": "text",
                  "text": "(m"
                },
                {
                  "kind": "sub",
                  "of": [
                    {
                      "kind": "text",
                      "text": "r"
                    }
                  ]
                },
                {
                  "kind": "text",
                  "text": "-m"
                },
                {
                  "kind": "sub",
                  "of": [
                    {
                      "kind": "text",
                      "text": "s"
                    }
                  ]
                },
                {
                  "kind": "text",
                  "text": "+2)/2"
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
        "text": "retardation is not a primitive of this theory - it is "
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
            "text": "(1-β"
          },
          {
            "kind": "sup",
            "of": [
              {
                "kind": "text",
                "text": "2"
              }
            ]
          },
          {
            "kind": "text",
            "text": ")"
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
            "kind": "fn",
            "of": [
              {
                "kind": "text",
                "text": "cos"
              }
            ]
          },
          {
            "kind": "text",
            "text": "(θ)·β"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "(1-β"
          },
          {
            "kind": "sup",
            "of": [
              {
                "kind": "text",
                "text": "2"
              }
            ]
          },
          {
            "kind": "text",
            "text": ")"
          }
        ]
      },
      {
        "kind": "text",
        "text": ", so it stands in for itself here and the result is multiplied out"
      }
    ],
    "measured": []
  }
];
