/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * charge.attraction, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * F = F_{meet}·opposed + F_{vac}
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

export const THEOREM = "charge.attraction";
export const ASKS = "the half in the gravitational constant is how often two charges are opposed, and that is a fact about the bodies rather than a number. What happens to the force when they are biased?";
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
    "text": "F = F"
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
    "text": "·opposed + F"
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
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "definition",
    "via": "charge.attraction",
    "line": [
      {
        "kind": "text",
        "text": "F = F"
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
        "text": " + F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "q"
          }
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "and what a body actually feels is everything that arrives, which is BOTH channels - and only one of them has been touched. The vacuum channel needs neither body to emit anything: a body's cells are not neutral, the split does not fire on them, and the expansion that did not happen spreads outward as a shortfall whatever signs anybody is carrying. THERE IS NOTHING IN IT FOR A BIAS TO ACT ON, so it is the same for both signs of charge and cannot be screened by either. That is the part of this law that is gravity, and it is why a charged thing falls like an uncharged one even where the other channel is pulling it about"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "charge.attraction",
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
            "text": "q"
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
        "text": " · g"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "q"
          }
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "and a pair that meets opposed that fraction as often feels that fraction of the meeting channel. This line says nothing except what a ratio is"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "charge.attraction",
    "line": [
      {
        "kind": "text",
        "text": "g"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "q"
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
            "text": "opposed"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "share"
          }
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "gravity.full writes the meeting channel as six factors multiplied - what one meeting is worth to a path, how much of the time the two are OPPOSED, the charges each pulse lets go on both sides, the two masses, and the meetings summed along the line. Exactly one of those asks about the SIGNS the bodies are carrying, and it is the second: the rest are counts of the tiling, masses, and a distance, and not one of them moves when a body is biased. So the biased and unbiased channels differ by that factor alone and everything else cancels out of the ratio"
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
        "text": "g"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "q"
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
            "text": "opposed"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "share"
          }
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "g"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "q"
          }
        ]
      },
      {
        "kind": "text",
        "text": " is opposed over share, which written out is "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "opposed"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "share"
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
        "kind": "text",
        "text": "F"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "q"
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
                "text": "meet"
              }
            ]
          },
          {
            "kind": "text",
            "text": "·opposed"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "share"
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
              "text": "q"
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
          "text": "·g"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "q"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "g"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "q"
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
              "text": "opposed"
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "share"
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
              "text": "q"
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
                  "text": "meet"
                }
              ]
            },
            {
              "kind": "text",
              "text": "·opposed"
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "share"
            }
          ]
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "g"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "q"
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
            "text": "opposed"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "share"
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
    "via": "charge.attraction",
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
            "text": "n"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "opp"
              }
            ]
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "n"
          },
          {
            "kind": "sub",
            "of": [
              {
                "kind": "text",
                "text": "states"
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
        "text": "two charges are opposed exactly when their meeting leaves nothing - that is what the word means for a rule that either annihilates a pair or does not. The states a pair can be in are equally available, so how much of the time they are opposed is how many of those states annihilate, over how many there are"
      }
    ],
    "measured": []
  },
  {
    "kind": "premise",
    "via": "meeting/what-the-halves-do",
    "line": [
      {
        "kind": "text",
        "text": "n"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "opp"
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
        "text": "and left nothing at all in the other 1: those are the states in which the two were opposed, which is what being opposed MEANS in a theory whose meetings either annihilate a pair or do not"
      }
    ],
    "measured": [
      {
        "name": "surviving",
        "value": 0,
        "note": "applying ANNIHILATION to each: neutral meets neutral: both gone"
      }
    ]
  },
  {
    "kind": "derived",
    "via": "a number is an expression",
    "line": [
      {
        "kind": "text",
        "text": "n"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "opp"
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
        "text": "annihilating is 1, so it can stand in an expression as that"
      }
    ],
    "measured": []
  },
  {
    "kind": "premise",
    "via": "meeting/what-the-halves-do",
    "line": [
      {
        "kind": "text",
        "text": "n"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "states"
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
        "text": "a ray of G can be carrying nothing but itself, so a facing pair has 1 possible states and the enumeration is complete"
      }
    ],
    "measured": [
      {
        "name": "cases",
        "value": 1,
        "note": "every combination the two ends can be carrying in G - no sign to carry, so one. Enumerated, not sampled"
      }
    ]
  },
  {
    "kind": "derived",
    "via": "a number is an expression",
    "line": [
      {
        "kind": "text",
        "text": "n"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "states"
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
        "text": "cases is 1, so it can stand in an expression as that"
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
        "text": "share = 1"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "share = n"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "opp"
            }
          ]
        },
        {
          "kind": "text",
          "text": " / n"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "states"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "= (1) / (1)"
        }
      ],
      [
        {
          "kind": "text",
          "text": "= 1"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "annihilating is 1 and cases is 1, so the one over the other is 1"
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
            "text": "q"
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
        "text": "·opposed"
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
              "text": "q"
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
                  "text": "meet"
                }
              ]
            },
            {
              "kind": "text",
              "text": "·opposed"
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "share"
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
              "text": "q"
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
          "text": "·opposed"
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
    "kind": "derived",
    "via": "substituting",
    "line": [
      {
        "kind": "text",
        "text": "F = F"
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
        "text": "·opposed + F"
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
    "working": [
      [
        {
          "kind": "text",
          "text": "F = F"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "q"
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
              "text": "q"
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
          "text": "·opposed"
        }
      ],
      [
        {
          "kind": "text",
          "text": "F = F"
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
          "text": "·opposed + F"
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
            "text": "q"
          }
        ]
      },
      {
        "kind": "text",
        "text": " is not a primitive of this theory - it is F"
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
        "text": "·opposed, so it stands in for itself here and the result is multiplied out"
      }
    ],
    "measured": []
  }
];
