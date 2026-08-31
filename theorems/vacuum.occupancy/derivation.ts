/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * vacuum.occupancy, for G on any
 * (D null, DEG null), box null, null ticks.
 *
 * \rho_{\infty} = \frac{\paren{\sqrt{\paren{\nu·DEG}^{2} + 4·\sigma·F·\paren{DEG - 2}·\nu·DEG} - \nu·DEG}}{2·\sigma·F·\paren{DEG - 2}}
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

export const THEOREM = "vacuum.occupancy";
export const ASKS = "the vacuum makes and takes at once. Left alone, where does it settle - and is that a number the rules fix, or one somebody chose?";
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
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
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
  }
];
