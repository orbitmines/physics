/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * gravity.joining, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * missing = k_{metric} - k_{retard} = 1/2
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

export const THEOREM = "gravity.joining";
export const ASKS = "the retarded force and the metric both correct gravity for motion. Are those two effects, one effect twice, or one of them short of something?";
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
    "text": "missing = k"
  },
  {
    "kind": "sub",
    "of": [
      {
        "kind": "text",
        "text": "metric"
      }
    ]
  },
  {
    "kind": "text",
    "text": " - k"
  },
  {
    "kind": "sub",
    "of": [
      {
        "kind": "text",
        "text": "retard"
      }
    ]
  },
  {
    "kind": "text",
    "text": " = 1/2"
  }
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "definition",
    "via": "gravity.joining",
    "line": [
      {
        "kind": "text",
        "text": "missing = k"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "metric"
          }
        ]
      },
      {
        "kind": "text",
        "text": " - k"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "retard"
          }
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "so what the retarded route does not account for is the difference, and it is B's term less the clock convention. THE GAP IS NOT A DISAGREEMENT BUT A MISSING TERM: the retarded force is the metric with the space part left out. That is why the two are compared rather than multiplied - multiplying would count A twice and still never mention B"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "gravity.joining",
    "line": [
      {
        "kind": "text",
        "text": "k"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "retard"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = k"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "A"
          }
        ]
      },
      {
        "kind": "text",
        "text": " + 1/2"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "the retarded force carries A's beta"
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
        "text": " - its two branches and its clock are exactly what a late arrival and a slow clock do - plus a half from whose clock the answer is quoted per, which this folder makes a switch of. That is 3/2 on the receiver's clock and 1 on the lattice's"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "gravity.joining",
    "line": [
      {
        "kind": "text",
        "text": "k"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "A"
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
        "text": "splitting the Hamiltonian's radial force in the counted metric, the piece coming from the time part A carries 1.00 beta"
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
        "text": " - measured at r = 10"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "4"
          }
        ]
      },
      {
        "kind": "text",
        "text": ", where the static term is six parts in ten thousand and does not confuse the reading. This is the part a slow clock and a delayed arrival account for"
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
        "text": "k"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "retard"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = 3/2"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "k"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "retard"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = 1/2 + k"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "A"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "k"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "A"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = 1"
        }
      ],
      [
        {
          "kind": "text",
          "text": "k"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "retard"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = 3/2"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "k"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "A"
          }
        ]
      },
      {
        "kind": "text",
        "text": " is not a primitive of this theory - it is 1, so it stands in for itself here and the result is multiplied out"
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
        "text": "missing = -3/2 + k"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "metric"
          }
        ]
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "missing = k"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "metric"
            }
          ]
        },
        {
          "kind": "text",
          "text": " - k"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "retard"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "k"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "retard"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = 3/2"
        }
      ],
      [
        {
          "kind": "text",
          "text": "missing = -3/2 + k"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "metric"
            }
          ]
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "k"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "retard"
          }
        ]
      },
      {
        "kind": "text",
        "text": " is not a primitive of this theory - it is 3/2, so it stands in for itself here and the result is multiplied out"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "gravity.joining",
    "line": [
      {
        "kind": "text",
        "text": "k"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "metric"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = k"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "A"
          }
        ]
      },
      {
        "kind": "text",
        "text": " + k"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "B"
          }
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "so the metric's whole velocity correction is the two together, 2 beta"
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
        "text": " - which is what differentiating it gives directly, so the split accounts for all of it"
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
        "text": "k"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "metric"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = 1 + k"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "B"
          }
        ]
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "k"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "metric"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = k"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "A"
            }
          ]
        },
        {
          "kind": "text",
          "text": " + k"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "B"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "k"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "A"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = 1"
        }
      ],
      [
        {
          "kind": "text",
          "text": "k"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "metric"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = 1 + k"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "B"
            }
          ]
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "k"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "A"
          }
        ]
      },
      {
        "kind": "text",
        "text": " is not a primitive of this theory - it is 1, so it stands in for itself here and the result is multiplied out"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "gravity.joining",
    "line": [
      {
        "kind": "text",
        "text": "k"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "B"
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
        "text": "and the piece from the space part B carries another 1.00 beta"
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
        "text": ". This is space being stretched where the count is high, which is not a statement about when anything arrives - so nothing about travel time can produce it"
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
        "text": "k"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "metric"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = 2"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "k"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "metric"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = 1 + k"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "B"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "k"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "B"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = 1"
        }
      ],
      [
        {
          "kind": "text",
          "text": "k"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "metric"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = 2"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "k"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "B"
          }
        ]
      },
      {
        "kind": "text",
        "text": " is not a primitive of this theory - it is 1, so it stands in for itself here and the result is multiplied out"
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
        "text": "missing = 1/2"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "missing = -3/2 + k"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "metric"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "k"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "metric"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = 2"
        }
      ],
      [
        {
          "kind": "text",
          "text": "missing = 1/2"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "k"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "metric"
          }
        ]
      },
      {
        "kind": "text",
        "text": " is not a primitive of this theory - it is 2, so it stands in for itself here and the result is multiplied out"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "which is a number",
    "line": [
      {
        "kind": "text",
        "text": "missing = 1/2"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "1/2 has nothing left in it that varies, so it is 1/2 exactly"
      }
    ],
    "measured": []
  }
];
