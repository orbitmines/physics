/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * transport.thinning, for G on any
 * (D null, DEG null), box null, null ticks.
 *
 * n = \frac{1}{2}·\paren{\Phi·r^{-\paren{D - 1}} + \sqrt{\Phi^{2}·r^{2 - 2·D} + 4·\Phi·r^{-\paren{D - 1}}·\sigma·\rho}}
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

export const THEOREM = "transport.thinning";
export const ASKS = "a medium carries something outward from a source, and its carriers may have to make the room they cross. How thick is it at r steps?";
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
    "text": "n = "
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
        "text": "2"
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
        "text": "Φ"
      },
      {
        "kind": "text",
        "text": "·"
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "r"
        },
        "sup": [
          {
            "kind": "text",
            "text": "-"
          },
          {
            "kind": "paren",
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
                "text": " - 1"
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
        "kind": "sqrt",
        "of": [
          {
            "kind": "scripted",
            "base": {
              "kind": "text",
              "text": "Φ"
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
            "text": "·"
          },
          {
            "kind": "scripted",
            "base": {
              "kind": "text",
              "text": "r"
            },
            "sup": [
              {
                "kind": "text",
                "text": "2 - 2·"
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
            "text": " + 4·"
          },
          {
            "kind": "text",
            "text": "Φ"
          },
          {
            "kind": "text",
            "text": "·"
          },
          {
            "kind": "scripted",
            "base": {
              "kind": "text",
              "text": "r"
            },
            "sup": [
              {
                "kind": "text",
                "text": "-"
              },
              {
                "kind": "paren",
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
                    "text": " - 1"
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
  }
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "theorem",
    "via": "how many places are r steps out",
    "line": [
      {
        "kind": "text",
        "text": "shell grows as "
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "r"
        },
        "sup": [
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
            "text": " - 1"
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
              "text": "exits"
            }
          ]
        },
        {
          "kind": "text",
          "text": "(p): the ways out of a point, "
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
          "text": " of them"
        }
      ],
      [
        {
          "kind": "text",
          "text": "steps: where one exit leads - and that is all the rules say about where anything is"
        }
      ],
      [
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
          "text": " of those ways are independent, so places within r steps ∝ "
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "r"
          },
          "sup": [
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
          "text": "(r) = "
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
          "text": "(r) - "
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
          "text": "(r-1) ∝ "
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "r"
          },
          "sup": [
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
        "text": "the rules give a point, "
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
        "text": " ways out of it, and where each one leads - and nothing else about where anything is. So how far is how many steps were taken, and how many places are that far out is a count of walks. "
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
        "text": " is how many of those ways are independent, so within r steps there are r choices along each of "
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
        "text": " and the places within r go as "
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "r"
        },
        "sup": [
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
        "text": "; the places at exactly r are the difference between two of those, which is "
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "r"
        },
        "sup": [
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
        "text": ". Every step is whole and every place counted once, so this is the count itself and not an approximation to one"
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
        "text": "what the waiting makes = "
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
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "no rays, 1 of space"
        }
      ],
      [
        {
          "kind": "text",
          "text": "the waiting makes "
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
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "MOVEMENT hands the ray to itself and grows the world - no ray made, destroyed or moved, and a point of space where there was none. That is a carrier standing still to make the room it could not step into, and the rate it does so at is "
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
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "the room the line does not supply, which the waiting has to make",
    "line": [
      {
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "a"
        },
        "sub": [
          {
            "kind": "text",
            "text": "0"
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
        "kind": "text",
        "text": "ρ"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "the space line carries a term with no rays in it: the waiting"
        }
      ],
      [
        {
          "kind": "text",
          "text": "a ray that cannot step makes the room instead, and that is space at "
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
        }
      ],
      [
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "a"
          },
          "sub": [
            {
              "kind": "text",
              "text": "0"
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
          "kind": "text",
          "text": "ρ"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "the space ledger gains one wherever a free point splits and loses one wherever two carriers meet, so its net rate per point is the first less the second. NOTHING IS FITTED HERE: it is the space line read off as it stands, and it is the only scale in this theory that is not a count of the tiling"
      }
    ],
    "measured": []
  },
  {
    "kind": "rule",
    "via": "MOVEMENT",
    "line": [
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
        "text": " = 1"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "every active ray goes ONE CELL along its own exit in one tick, which is what the streaming term says - so a step is one cell, and that is the only length the lattice has to measure anything else against"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "how fast a carrier goes, when the cell ahead may not be there yet",
    "line": [
      {
        "kind": "text",
        "text": "v = "
      },
      {
        "kind": "frac",
        "over": [
          {
            "kind": "text",
            "text": "n"
          }
        ],
        "under": [
          {
            "kind": "paren",
            "of": [
              {
                "kind": "text",
                "text": "n + "
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
          "text": "MOVEMENT: "
        },
        {
          "kind": "fn",
          "of": [
            {
              "kind": "text",
              "text": "either"
            }
          ]
        },
        {
          "kind": "text",
          "text": "("
        },
        {
          "kind": "fn",
          "of": [
            {
              "kind": "text",
              "text": "some"
            }
          ]
        },
        {
          "kind": "text",
          "text": "(to), step, "
        },
        {
          "kind": "fn",
          "of": [
            {
              "kind": "text",
              "text": "waitForRoom"
            }
          ]
        },
        {
          "kind": "text",
          "text": "(it))"
        }
      ],
      [
        {
          "kind": "text",
          "text": "waitForRoom carries space: "
        },
        {
          "kind": "fn",
          "of": [
            {
              "kind": "text",
              "text": "count"
            }
          ]
        },
        {
          "kind": "text",
          "text": "(1) and no step"
        }
      ],
      [
        {
          "kind": "text",
          "text": "room to be made: "
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "a"
          },
          "sub": [
            {
              "kind": "text",
              "text": "0"
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
          "kind": "text",
          "text": "ρ"
        },
        {
          "kind": "text",
          "text": " a point a tick, shared by n carriers"
        }
      ],
      [
        {
          "kind": "text",
          "text": "each waits "
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "a"
          },
          "sub": [
            {
              "kind": "text",
              "text": "0"
            }
          ]
        },
        {
          "kind": "text",
          "text": "/n of a tick and steps with the rest"
        }
      ],
      [
        {
          "kind": "text",
          "text": "v = n/(n + "
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "a"
          },
          "sub": [
            {
              "kind": "text",
              "text": "0"
            }
          ]
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
              "text": "n"
            }
          ],
          "under": [
            {
              "kind": "paren",
              "of": [
                {
                  "kind": "text",
                  "text": "n + "
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
        "text": "MOVEMENT says a lit ray goes one cell along its exit, and then says what happens when there is no cell: waitForRoom, which MAKES a point of space and does not step. That is a carrier being refused a cell, and it is in these rules. A ray therefore advances only on the ticks the cell ahead was already there, and what has to be made is what the space line makes - "
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "a"
        },
        "sub": [
          {
            "kind": "text",
            "text": "0"
          }
        ]
      },
      {
        "kind": "text",
        "text": " a point a tick. CREATION makes it where a point is free; where carriers are standing, they make it, and n of them share it, so each spends "
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "a"
        },
        "sub": [
          {
            "kind": "text",
            "text": "0"
          }
        ]
      },
      {
        "kind": "text",
        "text": "/n of its tick standing still. Where the medium is dense none of them ever waits and the speed is exactly the one cell a tick MOVEMENT advertises. Where it is thin the speed goes as the density itself"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "what crosses a shell is the room times what is at each site times how fast it goes",
    "line": [
      {
        "kind": "text",
        "text": "n = "
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
            "text": "2"
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
            "text": "Φ"
          },
          {
            "kind": "text",
            "text": "·"
          },
          {
            "kind": "scripted",
            "base": {
              "kind": "text",
              "text": "r"
            },
            "sup": [
              {
                "kind": "text",
                "text": "-"
              },
              {
                "kind": "paren",
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
                    "text": " - 1"
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
            "kind": "sqrt",
            "of": [
              {
                "kind": "scripted",
                "base": {
                  "kind": "text",
                  "text": "Φ"
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
                "text": "·"
              },
              {
                "kind": "scripted",
                "base": {
                  "kind": "text",
                  "text": "r"
                },
                "sup": [
                  {
                    "kind": "text",
                    "text": "2 - 2·"
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
                "text": " + 4·"
              },
              {
                "kind": "text",
                "text": "Φ"
              },
              {
                "kind": "text",
                "text": "·"
              },
              {
                "kind": "scripted",
                "base": {
                  "kind": "text",
                  "text": "r"
                },
                "sup": [
                  {
                    "kind": "text",
                    "text": "-"
                  },
                  {
                    "kind": "paren",
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
                        "text": " - 1"
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
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "Φ"
        },
        {
          "kind": "text",
          "text": " = shell·n·n/(n + "
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "a"
          },
          "sub": [
            {
              "kind": "text",
              "text": "0"
            }
          ]
        },
        {
          "kind": "text",
          "text": ")"
        }
      ],
      [
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "n"
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
          "text": " - ("
        },
        {
          "kind": "text",
          "text": "Φ"
        },
        {
          "kind": "text",
          "text": "/shell)n - ("
        },
        {
          "kind": "text",
          "text": "Φ"
        },
        {
          "kind": "text",
          "text": "/shell)"
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "a"
          },
          "sub": [
            {
              "kind": "text",
              "text": "0"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = 0"
        }
      ],
      [
        {
          "kind": "text",
          "text": "n = "
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
              "text": "2"
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
              "text": "Φ"
            },
            {
              "kind": "text",
              "text": "·"
            },
            {
              "kind": "scripted",
              "base": {
                "kind": "text",
                "text": "r"
              },
              "sup": [
                {
                  "kind": "text",
                  "text": "-"
                },
                {
                  "kind": "paren",
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
                      "text": " - 1"
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
              "kind": "sqrt",
              "of": [
                {
                  "kind": "scripted",
                  "base": {
                    "kind": "text",
                    "text": "Φ"
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
                  "text": "·"
                },
                {
                  "kind": "scripted",
                  "base": {
                    "kind": "text",
                    "text": "r"
                  },
                  "sup": [
                    {
                      "kind": "text",
                      "text": "2 - 2·"
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
                  "text": " + 4·"
                },
                {
                  "kind": "text",
                  "text": "Φ"
                },
                {
                  "kind": "text",
                  "text": "·"
                },
                {
                  "kind": "scripted",
                  "base": {
                    "kind": "text",
                    "text": "r"
                  },
                  "sup": [
                    {
                      "kind": "text",
                      "text": "-"
                    },
                    {
                      "kind": "paren",
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
                          "text": " - 1"
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
        }
      ],
      [
        {
          "kind": "text",
          "text": "dense: n -> "
        },
        {
          "kind": "text",
          "text": "Φ"
        },
        {
          "kind": "text",
          "text": "/shell.  thin: n -> "
        },
        {
          "kind": "sqrt",
          "of": [
            {
              "kind": "text",
              "text": "Φ"
            },
            {
              "kind": "text",
              "text": " "
            },
            {
              "kind": "scripted",
              "base": {
                "kind": "text",
                "text": "a"
              },
              "sub": [
                {
                  "kind": "text",
                  "text": "0"
                }
              ]
            },
            {
              "kind": "text",
              "text": "/shell"
            }
          ]
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "and neither limit has to be chosen between: the conservation solves as it stands. "
      },
      {
        "kind": "text",
        "text": "Φ"
      },
      {
        "kind": "text",
        "text": " = shell·n·n/(n + "
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "a"
        },
        "sub": [
          {
            "kind": "text",
            "text": "0"
          }
        ]
      },
      {
        "kind": "text",
        "text": ") is one quadratic in the density and it has one root that is not negative, which is the dense law at one end and the thin law at the other with no crossover put in by hand. WHERE THE TURNOVER SITS IS "
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "a"
        },
        "sub": [
          {
            "kind": "text",
            "text": "0"
          }
        ]
      },
      {
        "kind": "text",
        "text": ", and "
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "a"
        },
        "sub": [
          {
            "kind": "text",
            "text": "0"
          }
        ]
      },
      {
        "kind": "text",
        "text": " is the rate the space line makes space - so the scale at which a rotation curve departs from Newton is not fitted here either. It is the same number the recession is built out of"
      }
    ],
    "measured": []
  }
];
