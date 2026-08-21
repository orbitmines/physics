/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * decoherence.rate, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * rate ∝ \frac{SHEET^{2}·m·m'}{STEP·\bar{r}^{D-1}}
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

export const THEOREM = "decoherence.rate";
export const ASKS = "a meeting does not know whose charge it is, so a which-path record has to be in the field. How fast is one left, and does it depend on how far apart things are?";
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
    "text": "rate ∝ "
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
            "text": "STEP"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·"
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
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
  }
];
export const STANDING = false;
export const MISSING = [];
export const CITES = [
  "binomial"
];

export const STEPS: Step[] = [
  {
    "kind": "definition",
    "via": "decoherence.rate",
    "line": [
      {
        "kind": "text",
        "text": "rate = "
      },
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "rate"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(r) · shell"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "the record is left anywhere on the shell, not at one chosen place - so the rate over the whole field is the rate at one place times how many places there are. That count is the shell, and it is what cancels one of the two falloffs"
      }
    ],
    "measured": []
  },
  {
    "kind": "premise",
    "via": "lattice/what-the-tiling-is",
    "line": [
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
        "text": "("
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": ") = "
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
        "text": "("
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": ") - "
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
        "text": "("
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": "-1)"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "a site is either within "
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": "-1 steps or it is not, so the sites at exactly "
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": " steps are those within "
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": " less those within "
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": "-1 - a subtraction, with nothing left over and nothing counted twice"
      }
    ],
    "measured": [
      {
        "name": "sites within \\bar{r} steps",
        "value": 8,
        "note": "walked over the lattice's own exits from the centre: 1, 13, 55, 147, 309, 561, 923, 1415, 2057 for \\bar{r} = 0, 1, 2, ..."
      }
    ]
  },
  {
    "kind": "cited",
    "via": "meeting.rate",
    "line": [
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
        "text": "("
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": ") ∝ "
      },
      {
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "STEP"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·"
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
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
          }
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "established earlier by meeting.rate, on this same theory and lattice - the working is there rather than repeated here"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "the difference of a dilate",
    "line": [
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
        "text": "("
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": ") ∝ "
      },
      {
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "STEP"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·"
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
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
    ],
    "working": [
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
          "text": "("
        },
        {
          "kind": "bar",
          "of": [
            {
              "kind": "text",
              "text": "r"
            }
          ]
        },
        {
          "kind": "text",
          "text": ") = "
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
          "text": "("
        },
        {
          "kind": "bar",
          "of": [
            {
              "kind": "text",
              "text": "r"
            }
          ]
        },
        {
          "kind": "text",
          "text": ") - "
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
          "text": "("
        },
        {
          "kind": "bar",
          "of": [
            {
              "kind": "text",
              "text": "r"
            }
          ]
        },
        {
          "kind": "text",
          "text": "-1)"
        }
      ],
      [
        {
          "kind": "text",
          "text": "= β·"
        },
        {
          "kind": "bar",
          "of": [
            {
              "kind": "text",
              "text": "r"
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
            }
          ]
        },
        {
          "kind": "text",
          "text": " - β·("
        },
        {
          "kind": "bar",
          "of": [
            {
              "kind": "text",
              "text": "r"
            }
          ]
        },
        {
          "kind": "text",
          "text": "-1)"
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
      ],
      [
        {
          "kind": "text",
          "text": "= β·"
        },
        {
          "kind": "bar",
          "of": [
            {
              "kind": "text",
              "text": "r"
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
            }
          ]
        },
        {
          "kind": "text",
          "text": " - β·("
        },
        {
          "kind": "bar",
          "of": [
            {
              "kind": "text",
              "text": "r"
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
              "text": "D"
            }
          ]
        },
        {
          "kind": "text",
          "text": "·"
        },
        {
          "kind": "bar",
          "of": [
            {
              "kind": "text",
              "text": "r"
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
        },
        {
          "kind": "text",
          "text": " + ...)"
        }
      ],
      [
        {
          "kind": "text",
          "text": "= β·"
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
          "text": "·"
        },
        {
          "kind": "bar",
          "of": [
            {
              "kind": "text",
              "text": "r"
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
        },
        {
          "kind": "text",
          "text": " + ..."
        }
      ],
      [
        {
          "kind": "text",
          "text": "∝ β·"
        },
        {
          "kind": "bar",
          "of": [
            {
              "kind": "text",
              "text": "r"
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
    ],
    "because": [
      {
        "kind": "text",
        "text": "every site is either within "
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": "-1 steps or it is not, so the shell is the ball less its own shift by one step. Expanding ("
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
          }
        ]
      },
      {
        "kind": "text",
        "text": "-1)"
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
      },
      {
        "kind": "text",
        "text": " by "
      },
      {
        "kind": "ref",
        "key": "binomial"
      },
      {
        "kind": "text",
        "text": ", the leading β·"
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
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
          }
        ]
      },
      {
        "kind": "text",
        "text": " cancels against the ball's, and what survives is "
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
        "text": "·β·"
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
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
      },
      {
        "kind": "text",
        "text": ". The "
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
        "text": " came DOWN from the exponent in that cancellation; a proportionality does not carry it, and the exponent left behind is "
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
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "multiplying",
    "line": [
      {
        "kind": "text",
        "text": "rate ∝ "
      },
      {
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "STEP"
          }
        ]
      },
      {
        "kind": "text",
        "text": "·"
      },
      {
        "kind": "bar",
        "of": [
          {
            "kind": "text",
            "text": "r"
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
            "text": "rate"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(r)"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "each factor carries its own dependence and they multiply"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "decoherence.rate",
    "line": [
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "rate"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(r) = chance · chance'"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "a record is left where a charge from each source meets, so the rate at one place is what the first has put there times what the second has - both of which thinned on the way, and both of which are cited rather than counted again"
      }
    ],
    "measured": []
  },
  {
    "kind": "cited",
    "via": "meeting.rate",
    "line": [
      {
        "kind": "text",
        "text": "chance ∝ "
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
            "kind": "text",
            "text": "·m"
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
          },
          {
            "kind": "text",
            "text": "·"
          },
          {
            "kind": "bar",
            "of": [
              {
                "kind": "text",
                "text": "r"
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
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "established earlier by meeting.rate, on this same theory and lattice - the working is there rather than repeated here"
      }
    ],
    "measured": []
  },
  {
    "kind": "cited",
    "via": "meeting.rate",
    "line": [
      {
        "kind": "text",
        "text": "chance' ∝ "
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
            "kind": "text",
            "text": "·m'"
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
          },
          {
            "kind": "text",
            "text": "·"
          },
          {
            "kind": "bar",
            "of": [
              {
                "kind": "text",
                "text": "r"
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
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "established earlier by meeting.rate, on this same theory and lattice - the working is there rather than repeated here"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "multiplying",
    "line": [
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "rate"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(r) ∝ "
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
                "text": "STEP"
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
            "kind": "bar",
            "of": [
              {
                "kind": "text",
                "text": "r"
              }
            ]
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
        "text": "each factor carries its own dependence and they multiply"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "expansion",
    "line": [
      {
        "kind": "text",
        "text": "rate ∝ "
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
                "text": "STEP"
              }
            ]
          },
          {
            "kind": "text",
            "text": "·"
          },
          {
            "kind": "bar",
            "of": [
              {
                "kind": "text",
                "text": "r"
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
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "record here is not a primitive of this theory - it is what the line above shows it to be, so it stands in for itself here"
      }
    ],
    "measured": []
  }
];
