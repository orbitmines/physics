/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * met.integral, for G on fcc-12
 * (D 3, DEG 12), box 21, 20 ticks.
 *
 * met(R) = \frac{1}{\bar{c}^{D-2}}·\paren{\frac{ln(R/\bar{c})}{R^{2D-1}·core} + 2·\frac{1}{R^{D-1}}}
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

export const THEOREM = "met.integral";
export const ASKS = "two bodies R apart. Adding the product of what each puts at every point along the line between them, what does it come to - and how does that differ close up?";
export const UNDER = {
  "theory": "G",
  "geometry": "fcc-12",
  "D": 3,
  "DEG": 12,
  "N": 21,
  "T": 20,
  "seeds": [
    1
  ],
  "regime": "dense",
  "regimeSays": "there are partners everywhere, so the hand-off is never what a carrier waits for and the lattice's one-cell-a-tick is the binding bound"
};
export const CONCLUDED: Piece[] = [
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
            "text": "-2"
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
            "text": "·core"
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
        "text": "(R) = met"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "far"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·(1 + near)"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "so the whole of it is the long-range law times one plus a correction. The one is what becomes Newton's inverse square; the correction is the middle's logarithm over the long-range term, and it carries "
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
        "text": "/R - worth per cent at a few cells and nothing at all once R is an astronomical number of lattice steps"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "met.integral",
    "line": [
      {
        "kind": "text",
        "text": "met"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "far"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = 2 · core"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "there is a core at each end and they are the same by symmetry. Added to the inverse-square part of the middle, the (R - "
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
        "text": ") that each carries cancels over a common denominator - which is what makes the long-range law a plain power of R with no trace of the core size left in its exponent"
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
            "text": "met"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(R) = 2·near·core + 2·core"
      }
    ],
    "working": [
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
          "text": "(R) = met"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "far"
            }
          ]
        },
        {
          "kind": "text",
          "text": " + met"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "far"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·near"
        }
      ],
      [
        {
          "kind": "text",
          "text": "met"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "far"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = 2·core"
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
          "text": "(R) = 2·near·core + 2·core"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "met"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "far"
          }
        ]
      },
      {
        "kind": "text",
        "text": " is not a primitive of this theory - it is 2·one core, so it stands in for itself here and the result is multiplied out"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "met.integral",
    "line": [
      {
        "kind": "text",
        "text": "near = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "middle"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "met"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "far"
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
        "text": "the correction is what the middle's tail is worth against the long-range law - a ratio of the two, and the thing that goes to nothing as R grows"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "as a ratio",
    "line": [
      {
        "kind": "text",
        "text": "near = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "middle"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "met"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "far"
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
        "text": "near is the middle over met"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "far"
          }
        ]
      },
      {
        "kind": "text",
        "text": ", which written out is "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "the middle"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "met"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "far"
              }
            ]
          }
        ]
      },
      {
        "kind": "text",
        "text": " - kept in the counts rather than worked out, so that whatever uses it can cancel against them"
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
            "text": "met"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(R) = 2·"
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "core·middle"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "met"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "far"
              }
            ]
          }
        ]
      },
      {
        "kind": "text",
        "text": " + 2·core"
      }
    ],
    "working": [
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
          "text": "(R) = 2·near·core + 2·core"
        }
      ],
      [
        {
          "kind": "text",
          "text": "near = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "middle"
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "met"
            },
            {
              "kind": "sub",
              "of": [
                {
                  "kind": "text",
                  "text": "far"
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
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "core·middle"
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "met"
            },
            {
              "kind": "sub",
              "of": [
                {
                  "kind": "text",
                  "text": "far"
                }
              ]
            }
          ]
        },
        {
          "kind": "text",
          "text": " + 2·core"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "near is not a primitive of this theory - it is "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "the middle"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "met"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "far"
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
    "via": "met.integral",
    "line": [
      {
        "kind": "text",
        "text": "core = "
      },
      {
        "kind": "int",
        "from": [
          {
            "kind": "text",
            "text": "0"
          }
        ],
        "to": [
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
      },
      {
        "kind": "text",
        "text": " integrand dx"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "one core runs from the body out to a distance of one core, and across it the integrand is flat - so its contribution is that value times the width"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "met.integral",
    "line": [
      {
        "kind": "text",
        "text": "integrand = "
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
        "text": "inside the core at one end the near density has flattened off at its cap - a shell is never smaller than the cell its source sits in - while the far density barely moves across a width of one core. So the integrand there is the product of the two, neither depending on x any more. How fast each thins is the dense regime's: there are partners everywhere, so the hand-off is never what a carrier waits for and the lattice's one-cell-a-tick is the binding bound"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "integrating a power",
    "line": [
      {
        "kind": "text",
        "text": "core = "
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
    "working": [
      [
        {
          "kind": "text",
          "text": "core = "
        },
        {
          "kind": "int",
          "from": [
            {
              "kind": "text",
              "text": "0"
            }
          ],
          "to": [
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
                  "text": "-1"
                }
              ]
            }
          ]
        },
        {
          "kind": "text",
          "text": " dx"
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
              "text": "x"
            },
            {
              "kind": "sup",
              "of": [
                {
                  "kind": "text",
                  "text": "1"
                }
              ]
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "1"
            }
          ]
        },
        {
          "kind": "text",
          "text": ", at the limits"
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
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "the integrand in a core is "
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
                "text": "-1"
              }
            ]
          }
        ]
      },
      {
        "kind": "text",
        "text": ", a power 0 of x. Integrated that is x"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "1"
          }
        ]
      },
      {
        "kind": "text",
        "text": "/1, taken between 0 and "
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
            "text": "met"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(R) = 2·"
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
        "text": " + 2·"
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "middle"
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
          },
          {
            "kind": "text",
            "text": "·met"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "far"
              }
            ]
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
              "text": "met"
            }
          ]
        },
        {
          "kind": "text",
          "text": "(R) = 2·"
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "core·middle"
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "met"
            },
            {
              "kind": "sub",
              "of": [
                {
                  "kind": "text",
                  "text": "far"
                }
              ]
            }
          ]
        },
        {
          "kind": "text",
          "text": " + 2·core"
        }
      ],
      [
        {
          "kind": "text",
          "text": "core = "
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
          "text": " + 2·"
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "middle"
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
            },
            {
              "kind": "text",
              "text": "·met"
            },
            {
              "kind": "sub",
              "of": [
                {
                  "kind": "text",
                  "text": "far"
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
  },
  {
    "kind": "definition",
    "via": "met.integral",
    "line": [
      {
        "kind": "text",
        "text": "middle = "
      },
      {
        "kind": "int",
        "from": [
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
        "to": [
          {
            "kind": "text",
            "text": "R"
          }
        ]
      },
      {
        "kind": "text",
        "text": " tail dx"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "the middle runs from the edge of one core to the edge of the other, and one over x integrated between them is a logarithm - which grows more slowly than any power, and is the whole of why the correction dies away"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "met.integral",
    "line": [
      {
        "kind": "text",
        "text": "tail = R"
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
          }
        ]
      },
      {
        "kind": "text",
        "text": "·"
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
            "text": "x"
          }
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "between the two cores the integrand is a genuine product of two falling densities. By partial fractions that splits into a part carrying the same power of the separation as the cores do - which sums with them - and this part, one power of R further down and going as one over the distance along the line. It is the second that gives the correction, and being a power lower is exactly why the correction shrinks as the bodies are moved apart"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "integrating a power",
    "line": [
      {
        "kind": "text",
        "text": "middle = "
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
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "middle = "
        },
        {
          "kind": "int",
          "from": [
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
          "to": [
            {
              "kind": "text",
              "text": "R"
            }
          ]
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
              "text": "x"
            }
          ]
        },
        {
          "kind": "text",
          "text": " dx"
        }
      ],
      [
        {
          "kind": "text",
          "text": "= "
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
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "the middle's tail goes as one over x, whose integral is a logarithm - so between "
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
        "text": " and R it is "
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
        "text": "). It grows more slowly than any power of x, which is what matters about it here"
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
            "text": "met"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(R) = 2·"
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
            "text": "·met"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "far"
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
    "working": [
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
          "text": " + 2·"
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "middle"
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
            },
            {
              "kind": "text",
              "text": "·met"
            },
            {
              "kind": "sub",
              "of": [
                {
                  "kind": "text",
                  "text": "far"
                }
              ]
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "middle = "
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
              "text": "·met"
            },
            {
              "kind": "sub",
              "of": [
                {
                  "kind": "text",
                  "text": "far"
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
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "the middle is not a primitive of this theory - it is "
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
        "text": ", so it stands in for itself here and the result is multiplied out"
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
            "text": "·core"
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
    "working": [
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
              "text": "·met"
            },
            {
              "kind": "sub",
              "of": [
                {
                  "kind": "text",
                  "text": "far"
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
          "text": "met"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "far"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = 2·core"
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
              "text": "·core"
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
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "met"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "far"
          }
        ]
      },
      {
        "kind": "text",
        "text": " is not a primitive of this theory - it is 2·one core, so it stands in for itself here and the result is multiplied out"
      }
    ],
    "measured": []
  }
];
