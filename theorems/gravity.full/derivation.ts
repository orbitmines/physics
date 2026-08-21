/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * gravity.full, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * F_{g} = \frac{1}{R^{D-1}}·\paren{\frac{A'·A_{\perp}}{STEP} + \frac{SHEET^{2}·m·m'}{DEG}·\paren{2·\frac{1}{\bar{c}^{D-3}} + \frac{\bar{c}·ln(R/\bar{c})}{R}}}
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

export const THEOREM = "gravity.full";
export const ASKS = "put the pieces together. What is the gravitational force between two bodies R apart, with every factor written in?";
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
  "regime": "dense",
  "regimeSays": "there are partners everywhere, so the hand-off is never what a carrier waits for and the lattice's one-cell-a-tick is the binding bound"
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
        "text": "R"
      },
      {
        "kind": "sup",
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
            "text": "-1"
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
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "A'·A"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "⊥"
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
                "text": "STEP"
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
            "kind": "count",
            "of": [
              {
                "kind": "text",
                "text": "SHEET"
              }
            ]
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
            "text": "·m·m'"
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
                "kind": "sup",
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
                    "text": "-3"
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
                "kind": "text",
                "text": "(R/"
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
                "text": ")"
              }
            ],
            "under": [
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
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "definition",
    "via": "gravity.full",
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
        "kind": "text",
        "text": " = F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "meet"
          }
        ]
      },
      {
        "kind": "text",
        "text": " + F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "vac"
          }
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "what a body feels is everything that arrives at it, and things that arrive add. So the gravitational force is the two channels together: the meetings between the bodies' own radiation, and the expansion the vacuum did not manage around them"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "gravity.full",
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
            "text": "meet"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = lean · share · "
      },
      {
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "SHEET"
          }
        ]
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
        "text": " · m · m' · "
      },
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
        "text": "(R)"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "what arrives through MEETINGS is what a meeting is worth to a path, times how much of the time the two phases are opposed, times the charges each pulse lets go on both sides, times the two masses, times the meetings summed along the line between them. Every one of those was proved somewhere else and is cited; this line only says how they multiply"
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
        "kind": "text",
        "text": " = F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "vac"
          }
        ]
      },
      {
        "kind": "text",
        "text": " + "
      },
      {
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "SHEET"
          }
        ]
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
        "text": "·lean·m·m'·"
      },
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
        "text": "(R)·share"
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
          "kind": "text",
          "text": " = F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "meet"
            }
          ]
        },
        {
          "kind": "text",
          "text": " + F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "vac"
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
              "text": "meet"
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
              "text": "SHEET"
            }
          ]
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
          "text": "·lean·m·m'·"
        },
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
          "text": "(R)·share"
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
          "kind": "text",
          "text": " = F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "vac"
            }
          ]
        },
        {
          "kind": "text",
          "text": " + "
        },
        {
          "kind": "count",
          "of": [
            {
              "kind": "text",
              "text": "SHEET"
            }
          ]
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
          "text": "·lean·m·m'·"
        },
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
          "text": "(R)·share"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "meet"
          }
        ]
      },
      {
        "kind": "text",
        "text": " is not a primitive of this theory - it is "
      },
      {
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "SHEET"
          }
        ]
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
        "text": "·lean·m"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "a"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·m"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "b"
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
            "text": "met"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(R)·share, so it stands in for itself here and the result is multiplied out"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "gravity.full",
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
            "text": "vac"
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
            "text": "A"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "⊥"
              }
            ]
          },
          {
            "kind": "text",
            "text": " · S"
          }
        ],
        "under": [
          {
            "kind": "count",
            "of": [
              {
                "kind": "text",
                "text": "STEP"
              }
            ]
          }
        ]
      },
      {
        "kind": "text",
        "text": "·R"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "-"
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
            "text": "+1"
          }
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "and what arrives because the vacuum's expansion was SUPPRESSED is the other channel. A body's cells are not neutral, so the split does not fire on them; the expansion that did not happen there spreads outward and a second body is pushed into the shortfall. This needs neither body to emit anything - an inert absorber has it - which is what makes it a separate arrival rather than the meeting term counted again. It thins as the dense regime says, because the deficit is carried by the same rays as everything else. Note the two areas are not the same kind of area: what the near body SENDS leaves through the whole of its boundary and spreads isotropically, so its full A' counts; what the far body FEELS is an imbalance along the line between them, so only its facing cross-section takes part"
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
        "kind": "text",
        "text": " = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "A"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "⊥"
              }
            ]
          },
          {
            "kind": "text",
            "text": "·S"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "R"
          },
          {
            "kind": "sup",
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
                "text": "-1"
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
                "text": "STEP"
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
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "SHEET"
          }
        ]
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
        "text": "·lean·m·m'·"
      },
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
        "text": "(R)·share"
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
          "kind": "text",
          "text": " = F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "vac"
            }
          ]
        },
        {
          "kind": "text",
          "text": " + "
        },
        {
          "kind": "count",
          "of": [
            {
              "kind": "text",
              "text": "SHEET"
            }
          ]
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
          "text": "·lean·m·m'·"
        },
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
          "text": "(R)·share"
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
              "text": "vac"
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
              "text": "A"
            },
            {
              "kind": "sub",
              "of": [
                {
                  "kind": "text",
                  "text": "⊥"
                }
              ]
            },
            {
              "kind": "text",
              "text": "·S"
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "R"
            },
            {
              "kind": "sup",
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
                  "text": "-1"
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
                  "text": "STEP"
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
          "kind": "text",
          "text": " = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "A"
            },
            {
              "kind": "sub",
              "of": [
                {
                  "kind": "text",
                  "text": "⊥"
                }
              ]
            },
            {
              "kind": "text",
              "text": "·S"
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "R"
            },
            {
              "kind": "sup",
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
                  "text": "-1"
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
                  "text": "STEP"
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
          "kind": "count",
          "of": [
            {
              "kind": "text",
              "text": "SHEET"
            }
          ]
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
          "text": "·lean·m·m'·"
        },
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
          "text": "(R)·share"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "vac"
          }
        ]
      },
      {
        "kind": "text",
        "text": " is not a primitive of this theory - it is "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "A"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "⊥"
              }
            ]
          },
          {
            "kind": "text",
            "text": "·S"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "R"
          },
          {
            "kind": "sup",
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
                "text": "-1"
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
                "text": "STEP"
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
    "kind": "cited",
    "via": "vacuum.suppression",
    "line": [
      {
        "kind": "text",
        "text": "S = A'"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "established earlier by vacuum.suppression, on this same theory and lattice - the working is there rather than repeated here"
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
        "kind": "text",
        "text": " = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "A'·A"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "⊥"
              }
            ]
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "R"
          },
          {
            "kind": "sup",
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
                "text": "-1"
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
                "text": "STEP"
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
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "SHEET"
          }
        ]
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
        "text": "·lean·m·m'·"
      },
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
        "text": "(R)·share"
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
          "kind": "text",
          "text": " = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "A"
            },
            {
              "kind": "sub",
              "of": [
                {
                  "kind": "text",
                  "text": "⊥"
                }
              ]
            },
            {
              "kind": "text",
              "text": "·S"
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "R"
            },
            {
              "kind": "sup",
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
                  "text": "-1"
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
                  "text": "STEP"
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
          "kind": "count",
          "of": [
            {
              "kind": "text",
              "text": "SHEET"
            }
          ]
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
          "text": "·lean·m·m'·"
        },
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
          "text": "(R)·share"
        }
      ],
      [
        {
          "kind": "text",
          "text": "S = A'"
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
          "kind": "text",
          "text": " = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "A'·A"
            },
            {
              "kind": "sub",
              "of": [
                {
                  "kind": "text",
                  "text": "⊥"
                }
              ]
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "R"
            },
            {
              "kind": "sup",
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
                  "text": "-1"
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
                  "text": "STEP"
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
          "kind": "count",
          "of": [
            {
              "kind": "text",
              "text": "SHEET"
            }
          ]
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
          "text": "·lean·m·m'·"
        },
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
          "text": "(R)·share"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "S is not a primitive of this theory - it is A', so it stands in for itself here and the result is multiplied out"
      }
    ],
    "measured": []
  },
  {
    "kind": "cited",
    "via": "lattice.lean",
    "line": [
      {
        "kind": "text",
        "text": "lean = "
      },
      {
        "kind": "frac",
        "over": [
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
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "established earlier by lattice.lean, on this same theory and lattice - the working is there rather than repeated here"
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
        "kind": "text",
        "text": " = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "A'·A"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "⊥"
              }
            ]
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "R"
          },
          {
            "kind": "sup",
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
                "text": "-1"
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
                "text": "STEP"
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
            "kind": "count",
            "of": [
              {
                "kind": "text",
                "text": "SHEET"
              }
            ]
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
            "text": "·"
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
            "text": "·m·m'·"
          },
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
            "text": "(R)·share"
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
          "kind": "text",
          "text": " = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "A'·A"
            },
            {
              "kind": "sub",
              "of": [
                {
                  "kind": "text",
                  "text": "⊥"
                }
              ]
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "R"
            },
            {
              "kind": "sup",
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
                  "text": "-1"
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
                  "text": "STEP"
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
          "kind": "count",
          "of": [
            {
              "kind": "text",
              "text": "SHEET"
            }
          ]
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
          "text": "·lean·m·m'·"
        },
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
          "text": "(R)·share"
        }
      ],
      [
        {
          "kind": "text",
          "text": "lean = "
        },
        {
          "kind": "frac",
          "over": [
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
          "kind": "text",
          "text": " = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "A'·A"
            },
            {
              "kind": "sub",
              "of": [
                {
                  "kind": "text",
                  "text": "⊥"
                }
              ]
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "R"
            },
            {
              "kind": "sup",
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
                  "text": "-1"
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
                  "text": "STEP"
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
              "kind": "count",
              "of": [
                {
                  "kind": "text",
                  "text": "SHEET"
                }
              ]
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
              "text": "·"
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
              "text": "·m·m'·"
            },
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
              "text": "(R)·share"
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
    ],
    "because": [
      {
        "kind": "text",
        "text": "lean is not a primitive of this theory - it is "
      },
      {
        "kind": "frac",
        "over": [
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
      },
      {
        "kind": "text",
        "text": ", so it stands in for itself here and the result is multiplied out"
      }
    ],
    "measured": []
  },
  {
    "kind": "cited",
    "via": "share.coherence",
    "line": [
      {
        "kind": "text",
        "text": "share = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "annihilating"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "cases"
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
        "text": "established earlier by share.coherence, on this same theory and lattice - the working is there rather than repeated here"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "a number is an expression",
    "line": [
      {
        "kind": "text",
        "text": "share = 1"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "share is 1, so it can stand in an expression as that"
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
        "kind": "text",
        "text": " = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "A'·A"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "⊥"
              }
            ]
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "R"
          },
          {
            "kind": "sup",
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
                "text": "-1"
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
                "text": "STEP"
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
            "kind": "count",
            "of": [
              {
                "kind": "text",
                "text": "SHEET"
              }
            ]
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
            "text": "·"
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
            "text": "·m·m'·"
          },
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
            "text": "(R)"
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
          "kind": "text",
          "text": " = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "A'·A"
            },
            {
              "kind": "sub",
              "of": [
                {
                  "kind": "text",
                  "text": "⊥"
                }
              ]
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "R"
            },
            {
              "kind": "sup",
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
                  "text": "-1"
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
                  "text": "STEP"
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
              "kind": "count",
              "of": [
                {
                  "kind": "text",
                  "text": "SHEET"
                }
              ]
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
              "text": "·"
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
              "text": "·m·m'·"
            },
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
              "text": "(R)·share"
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
      ],
      [
        {
          "kind": "text",
          "text": "share = 1"
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
          "kind": "text",
          "text": " = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "A'·A"
            },
            {
              "kind": "sub",
              "of": [
                {
                  "kind": "text",
                  "text": "⊥"
                }
              ]
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "R"
            },
            {
              "kind": "sup",
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
                  "text": "-1"
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
                  "text": "STEP"
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
              "kind": "count",
              "of": [
                {
                  "kind": "text",
                  "text": "SHEET"
                }
              ]
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
              "text": "·"
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
              "text": "·m·m'·"
            },
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
              "text": "(R)"
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
    ],
    "because": [
      {
        "kind": "text",
        "text": "share is not a primitive of this theory - it is 1, so it stands in for itself here and the result is multiplied out"
      }
    ],
    "measured": []
  },
  {
    "kind": "cited",
    "via": "met.integral",
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
        "text": "(R) = "
      },
      {
        "kind": "frac",
        "over": [
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
            "text": "(R/"
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
            "text": ")"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "R"
          },
          {
            "kind": "sup",
            "of": [
              {
                "kind": "text",
                "text": "2"
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
                "text": "-1"
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
            "kind": "sup",
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
                "text": "-2"
              }
            ]
          },
          {
            "kind": "text",
            "text": "·one core"
          }
        ]
      },
      {
        "kind": "text",
        "text": " + 2·"
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
            "text": "R"
          },
          {
            "kind": "sup",
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
                "text": "-1"
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
            "kind": "sup",
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
                "text": "-2"
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
        "text": "established earlier by met.integral, on this same theory and lattice - the working is there rather than repeated here"
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
        "kind": "text",
        "text": " = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "A'·A"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "⊥"
              }
            ]
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "R"
          },
          {
            "kind": "sup",
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
                "text": "-1"
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
                "text": "STEP"
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
            "kind": "count",
            "of": [
              {
                "kind": "text",
                "text": "SHEET"
              }
            ]
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
            "kind": "text",
            "text": "(R/"
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
            "text": ")·m·m'"
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
          },
          {
            "kind": "text",
            "text": "·R"
          },
          {
            "kind": "sup",
            "of": [
              {
                "kind": "text",
                "text": "2"
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
                "text": "-1"
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
            "kind": "sup",
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
                "text": "-3"
              }
            ]
          },
          {
            "kind": "text",
            "text": "·one core"
          }
        ]
      },
      {
        "kind": "text",
        "text": " + 2·"
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "count",
            "of": [
              {
                "kind": "text",
                "text": "SHEET"
              }
            ]
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
            "text": "·m·m'"
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
          },
          {
            "kind": "text",
            "text": "·R"
          },
          {
            "kind": "sup",
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
                "text": "-1"
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
            "kind": "sup",
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
                "text": "-3"
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
          "kind": "text",
          "text": " = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "A'·A"
            },
            {
              "kind": "sub",
              "of": [
                {
                  "kind": "text",
                  "text": "⊥"
                }
              ]
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "R"
            },
            {
              "kind": "sup",
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
                  "text": "-1"
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
                  "text": "STEP"
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
              "kind": "count",
              "of": [
                {
                  "kind": "text",
                  "text": "SHEET"
                }
              ]
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
              "text": "·"
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
              "text": "·m·m'·"
            },
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
              "text": "(R)"
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
          "text": "(R) = "
        },
        {
          "kind": "frac",
          "over": [
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
              "text": "(R/"
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
              "text": ")"
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "R"
            },
            {
              "kind": "sup",
              "of": [
                {
                  "kind": "text",
                  "text": "2"
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
                  "text": "-1"
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
              "kind": "sup",
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
                  "text": "-2"
                }
              ]
            },
            {
              "kind": "text",
              "text": "·one core"
            }
          ]
        },
        {
          "kind": "text",
          "text": " + 2·"
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
              "text": "R"
            },
            {
              "kind": "sup",
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
                  "text": "-1"
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
              "kind": "sup",
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
                  "text": "-2"
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
          "kind": "text",
          "text": " = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "A'·A"
            },
            {
              "kind": "sub",
              "of": [
                {
                  "kind": "text",
                  "text": "⊥"
                }
              ]
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "R"
            },
            {
              "kind": "sup",
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
                  "text": "-1"
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
                  "text": "STEP"
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
              "kind": "count",
              "of": [
                {
                  "kind": "text",
                  "text": "SHEET"
                }
              ]
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
              "kind": "text",
              "text": "(R/"
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
              "text": ")·m·m'"
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
            },
            {
              "kind": "text",
              "text": "·R"
            },
            {
              "kind": "sup",
              "of": [
                {
                  "kind": "text",
                  "text": "2"
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
                  "text": "-1"
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
              "kind": "sup",
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
                  "text": "-3"
                }
              ]
            },
            {
              "kind": "text",
              "text": "·one core"
            }
          ]
        },
        {
          "kind": "text",
          "text": " + 2·"
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "count",
              "of": [
                {
                  "kind": "text",
                  "text": "SHEET"
                }
              ]
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
              "text": "·m·m'"
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
            },
            {
              "kind": "text",
              "text": "·R"
            },
            {
              "kind": "sup",
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
                  "text": "-1"
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
              "kind": "sup",
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
                  "text": "-3"
                }
              ]
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
            "text": "met"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(R) is not a primitive of this theory - it is "
      },
      {
        "kind": "frac",
        "over": [
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
            "text": "(R/"
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
            "text": ")"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "R"
          },
          {
            "kind": "sup",
            "of": [
              {
                "kind": "text",
                "text": "2"
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
                "text": "-1"
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
            "kind": "sup",
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
                "text": "-2"
              }
            ]
          },
          {
            "kind": "text",
            "text": "·one core"
          }
        ]
      },
      {
        "kind": "text",
        "text": " + 2·"
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
            "text": "R"
          },
          {
            "kind": "sup",
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
                "text": "-1"
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
            "kind": "sup",
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
                "text": "-2"
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
    "kind": "cited",
    "via": "met.integral",
    "line": [
      {
        "kind": "text",
        "text": "one core = "
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
            "text": "R"
          },
          {
            "kind": "sup",
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
                "text": "-1"
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
            "kind": "sup",
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
                "text": "-2"
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
        "text": "established earlier by met.integral, on this same theory and lattice - the working is there rather than repeated here"
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
        "kind": "text",
        "text": " = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "A'·A"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "⊥"
              }
            ]
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "R"
          },
          {
            "kind": "sup",
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
                "text": "-1"
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
                "text": "STEP"
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
            "kind": "count",
            "of": [
              {
                "kind": "text",
                "text": "SHEET"
              }
            ]
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
            "text": "·"
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
            "kind": "text",
            "text": "(R/"
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
            "text": ")·m·m'"
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
          },
          {
            "kind": "text",
            "text": "·R"
          },
          {
            "kind": "sup",
            "of": [
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
        ]
      },
      {
        "kind": "text",
        "text": " + 2·"
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "count",
            "of": [
              {
                "kind": "text",
                "text": "SHEET"
              }
            ]
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
            "text": "·m·m'"
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
          },
          {
            "kind": "text",
            "text": "·R"
          },
          {
            "kind": "sup",
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
                "text": "-1"
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
            "kind": "sup",
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
                "text": "-3"
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
          "kind": "text",
          "text": " = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "A'·A"
            },
            {
              "kind": "sub",
              "of": [
                {
                  "kind": "text",
                  "text": "⊥"
                }
              ]
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "R"
            },
            {
              "kind": "sup",
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
                  "text": "-1"
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
                  "text": "STEP"
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
              "kind": "count",
              "of": [
                {
                  "kind": "text",
                  "text": "SHEET"
                }
              ]
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
              "kind": "text",
              "text": "(R/"
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
              "text": ")·m·m'"
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
            },
            {
              "kind": "text",
              "text": "·R"
            },
            {
              "kind": "sup",
              "of": [
                {
                  "kind": "text",
                  "text": "2"
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
                  "text": "-1"
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
              "kind": "sup",
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
                  "text": "-3"
                }
              ]
            },
            {
              "kind": "text",
              "text": "·one core"
            }
          ]
        },
        {
          "kind": "text",
          "text": " + 2·"
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "count",
              "of": [
                {
                  "kind": "text",
                  "text": "SHEET"
                }
              ]
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
              "text": "·m·m'"
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
            },
            {
              "kind": "text",
              "text": "·R"
            },
            {
              "kind": "sup",
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
                  "text": "-1"
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
              "kind": "sup",
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
                  "text": "-3"
                }
              ]
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "one core = "
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
              "text": "R"
            },
            {
              "kind": "sup",
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
                  "text": "-1"
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
              "kind": "sup",
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
                  "text": "-2"
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
          "kind": "text",
          "text": " = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "A'·A"
            },
            {
              "kind": "sub",
              "of": [
                {
                  "kind": "text",
                  "text": "⊥"
                }
              ]
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "R"
            },
            {
              "kind": "sup",
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
                  "text": "-1"
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
                  "text": "STEP"
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
              "kind": "count",
              "of": [
                {
                  "kind": "text",
                  "text": "SHEET"
                }
              ]
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
              "text": "·"
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
              "kind": "text",
              "text": "(R/"
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
              "text": ")·m·m'"
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
            },
            {
              "kind": "text",
              "text": "·R"
            },
            {
              "kind": "sup",
              "of": [
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
          ]
        },
        {
          "kind": "text",
          "text": " + 2·"
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "count",
              "of": [
                {
                  "kind": "text",
                  "text": "SHEET"
                }
              ]
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
              "text": "·m·m'"
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
            },
            {
              "kind": "text",
              "text": "·R"
            },
            {
              "kind": "sup",
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
                  "text": "-1"
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
              "kind": "sup",
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
                  "text": "-3"
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
        "text": "one core is not a primitive of this theory - it is "
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
            "text": "R"
          },
          {
            "kind": "sup",
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
                "text": "-1"
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
            "kind": "sup",
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
                "text": "-2"
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
  }
];
