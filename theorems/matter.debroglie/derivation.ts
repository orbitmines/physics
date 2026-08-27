/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * matter.debroglie, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * p·r = \hbar·\pi·n
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

export const THEOREM = "matter.debroglie";
export const ASKS = "the nodes of a moving emitter's own beat are half a wavelength apart, and a node is not divisible. What does a region of a given size hold?";
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
    "text": "p·r = \\hbar·\\pi·n"
  }
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "definition",
    "via": "matter.debroglie",
    "line": [
      {
        "kind": "text",
        "text": "p·r = p · r"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "and the two are multiplied here rather than at the end, so that a reader can watch what cancels. The momentum carries gamma·v and the node spacing carries its reciprocal - that is the same gamma and the same v, because the emitter whose phase makes the nodes is the thing whose momentum is being counted. So they go, and what is left has neither a speed nor a Lorentz factor in it, which is why this holds at any speed rather than only at a slow one"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "matter.debroglie",
    "line": [
      {
        "kind": "text",
        "text": "p = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "\\hbar"
          }
        ],
        "under": [
          {
            "kind": "bar",
            "of": [
              {
                "kind": "text",
                "text": "\\lambda"
              }
            ]
          }
        ]
      },
      {
        "kind": "text",
        "text": "·\\gamma·v"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "and momentum is gamma·m·v. This model measures a mass as a wavelength - lbar is hbar/(m·c), which is what `mass.period` divides the budget by - so m is hbar/(lbar·c) and p is gamma·v·hbar/lbar at c = 1. A unit conversion and nothing else: there is no claim in this line that is not already in the definition of lbar"
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
        "text": "p·r = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "\\gamma·\\hbar·r·v"
          }
        ],
        "under": [
          {
            "kind": "bar",
            "of": [
              {
                "kind": "text",
                "text": "\\lambda"
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
          "text": "p·r = p·r"
        }
      ],
      [
        {
          "kind": "text",
          "text": "p = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "\\gamma·\\hbar·v"
            }
          ],
          "under": [
            {
              "kind": "bar",
              "of": [
                {
                  "kind": "text",
                  "text": "\\lambda"
                }
              ]
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "p·r = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "\\gamma·\\hbar·r·v"
            }
          ],
          "under": [
            {
              "kind": "bar",
              "of": [
                {
                  "kind": "text",
                  "text": "\\lambda"
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
        "text": "p is not a primitive of this theory - it is "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "\\gamma·\\hbar·v"
          }
        ],
        "under": [
          {
            "kind": "bar",
            "of": [
              {
                "kind": "text",
                "text": "\\lambda"
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
    "via": "matter.debroglie",
    "line": [
      {
        "kind": "text",
        "text": "r = n · \\lambda"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "dB"
          }
        ]
      },
      {
        "kind": "text",
        "text": "/2"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "the nodes are a fixed distance apart, so how many of them a region holds is the region divided by that distance - and a region holding n of them is n of them long. THE ONLY PHYSICS IN THIS LINE IS THAT n IS A WHOLE NUMBER, and that is not a quantisation postulate: a node is a place where the emitter's two branches cancel, and there is no such thing as most of one"
      }
    ],
    "measured": []
  },
  {
    "kind": "premise",
    "via": "standing/what-two-branches-leave",
    "line": [
      {
        "kind": "text",
        "text": "\\lambda"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "dB"
          }
        ]
      },
      {
        "kind": "text",
        "text": "/2 = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "\\pi·"
          },
          {
            "kind": "bar",
            "of": [
              {
                "kind": "text",
                "text": "\\lambda"
              }
            ]
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "\\gamma·v"
          }
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "a place is reached by two rays from one emitter - the one that set out ahead of it and the one behind - and the two beat. The SUM of their phases carries the envelope, and the spacing between its nodes is what a standing wave is counted in. Measured by building the phase field and bracketing successive turns of 2·pi, at four speeds over three decades, it is pi·lbar/(gamma·v) to 9.6e-14. AT REST IT IS INFINITE - the sum stops depending on position at all - so motion is what makes a pattern, which is the shape a length that depends on momentum has to have"
      }
    ],
    "measured": [
      {
        "name": "worst light-cone residual",
        "value": 1.5987211554602254e-13,
        "note": "over both roots, four speeds and five places. The two retarded times are SOLVED from t - t_e = |x - v·t_e| and then checked against it, each root against its own branch - which is what makes the rest of this a derivation and not a substitution"
      },
      {
        "name": "variation of the phase SUM across 80 cells, at rest",
        "value": 0,
        "note": "nought - no motion, no pattern. The two emission times do NOT coincide at rest, they differ by 2x; what coincides is that their sum stops depending on x, and the sum is the quantity the envelope is built from. At v = 0.5 the same span varies by 92.4, so MOTION IS WHAT MAKES A PATTERN"
      },
      {
        "name": "worst |envelope period / (pi·lbar/(gamma·v)) - 1|",
        "value": 9.636735853746359e-14,
        "note": "over v = 0.001 to 0.95. The period is bracketed off the numerically built phase field and only then divided by the closed form - nothing is evaluated from it"
      }
    ]
  },
  {
    "kind": "derived",
    "via": "substituting",
    "line": [
      {
        "kind": "text",
        "text": "r = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "bar",
            "of": [
              {
                "kind": "text",
                "text": "\\lambda"
              }
            ]
          },
          {
            "kind": "text",
            "text": "·\\pi·n"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "\\gamma·v"
          }
        ]
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "r = \\lambda"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "dB"
            }
          ]
        },
        {
          "kind": "text",
          "text": "/2·n"
        }
      ],
      [
        {
          "kind": "text",
          "text": "\\lambda"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "dB"
            }
          ]
        },
        {
          "kind": "text",
          "text": "/2 = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "bar",
              "of": [
                {
                  "kind": "text",
                  "text": "\\lambda"
                }
              ]
            },
            {
              "kind": "text",
              "text": "·\\pi"
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "\\gamma·v"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "r = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "bar",
              "of": [
                {
                  "kind": "text",
                  "text": "\\lambda"
                }
              ]
            },
            {
              "kind": "text",
              "text": "·\\pi·n"
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "\\gamma·v"
            }
          ]
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "\\lambda"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "dB"
          }
        ]
      },
      {
        "kind": "text",
        "text": "/2 is not a primitive of this theory - it is "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "bar",
            "of": [
              {
                "kind": "text",
                "text": "\\lambda"
              }
            ]
          },
          {
            "kind": "text",
            "text": "·\\pi"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "\\gamma·v"
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
        "kind": "text",
        "text": "p·r = \\hbar·\\pi·n"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "p·r = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "text",
              "text": "\\gamma·\\hbar·r·v"
            }
          ],
          "under": [
            {
              "kind": "bar",
              "of": [
                {
                  "kind": "text",
                  "text": "\\lambda"
                }
              ]
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "r = "
        },
        {
          "kind": "frac",
          "over": [
            {
              "kind": "bar",
              "of": [
                {
                  "kind": "text",
                  "text": "\\lambda"
                }
              ]
            },
            {
              "kind": "text",
              "text": "·\\pi·n"
            }
          ],
          "under": [
            {
              "kind": "text",
              "text": "\\gamma·v"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "p·r = \\hbar·\\pi·n"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "r is not a primitive of this theory - it is "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "bar",
            "of": [
              {
                "kind": "text",
                "text": "\\lambda"
              }
            ]
          },
          {
            "kind": "text",
            "text": "·\\pi·nodes"
          }
        ],
        "under": [
          {
            "kind": "text",
            "text": "\\gamma·v"
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
