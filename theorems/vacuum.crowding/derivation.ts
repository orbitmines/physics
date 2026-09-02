/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * vacuum.crowding, for G on any
 * (D null, DEG null), box null, null ticks.
 *
 * \rho at R = \text{the } \rho \text{ where } DEG·\nu·\paren{1 - \paren{1 - \paren{1 - \paren{\rho + \frac{\nu·\paren{1 - \rho}·A·\paren{1 - \paren{1 - \sigma·\rho}^{\frac{m}{A}}}·R^{-\paren{D - 1}}·\paren{n_{f} + 1}}{\sigma·\rho}}}^{DEG}}} - 2·F·\sigma·\paren{\rho + \frac{\nu·\paren{1 - \rho}·A·\paren{1 - \paren{1 - \sigma·\rho}^{\frac{m}{A}}}·R^{-\paren{D - 1}}·\paren{n_{f} + 1}}{\sigma·\rho}}^{2} = 0
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

export const THEOREM = "vacuum.crowding";
export const ASKS = "the settled density solves the making against the taking WITH NOTHING IN IT. What does the same balance give where a body's own carriers are also being met?";
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
    "text": "ρ"
  },
  {
    "kind": "text",
    "text": " at R = "
  },
  {
    "kind": "words",
    "text": "the "
  },
  {
    "kind": "text",
    "text": " "
  },
  {
    "kind": "text",
    "text": "ρ"
  },
  {
    "kind": "text",
    "text": " "
  },
  {
    "kind": "words",
    "text": " where "
  },
  {
    "kind": "text",
    "text": " "
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
    "kind": "paren",
    "of": [
      {
        "kind": "text",
        "text": "1 - "
      },
      {
        "kind": "paren",
        "of": [
          {
            "kind": "text",
            "text": "1 - "
          },
          {
            "kind": "scripted",
            "base": {
              "kind": "paren",
              "of": [
                {
                  "kind": "text",
                  "text": "1 - "
                },
                {
                  "kind": "paren",
                  "of": [
                    {
                      "kind": "text",
                      "text": "ρ"
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
                          "text": "·A·"
                        },
                        {
                          "kind": "paren",
                          "of": [
                            {
                              "kind": "text",
                              "text": "1 - "
                            },
                            {
                              "kind": "scripted",
                              "base": {
                                "kind": "paren",
                                "of": [
                                  {
                                    "kind": "text",
                                    "text": "1 - "
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
                              },
                              "sup": [
                                {
                                  "kind": "frac",
                                  "over": [
                                    {
                                      "kind": "text",
                                      "text": "m"
                                    }
                                  ],
                                  "under": [
                                    {
                                      "kind": "text",
                                      "text": "A"
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
                            "text": "R"
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
                          "kind": "paren",
                          "of": [
                            {
                              "kind": "scripted",
                              "base": {
                                "kind": "text",
                                "text": "n"
                              },
                              "sub": [
                                {
                                  "kind": "text",
                                  "text": "f"
                                }
                              ]
                            },
                            {
                              "kind": "text",
                              "text": " + 1"
                            }
                          ]
                        }
                      ],
                      "under": [
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
            },
            "sup": [
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
      }
    ]
  },
  {
    "kind": "text",
    "text": " - 2·F·"
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
      "kind": "paren",
      "of": [
        {
          "kind": "text",
          "text": "ρ"
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
              "text": "·A·"
            },
            {
              "kind": "paren",
              "of": [
                {
                  "kind": "text",
                  "text": "1 - "
                },
                {
                  "kind": "scripted",
                  "base": {
                    "kind": "paren",
                    "of": [
                      {
                        "kind": "text",
                        "text": "1 - "
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
                  },
                  "sup": [
                    {
                      "kind": "frac",
                      "over": [
                        {
                          "kind": "text",
                          "text": "m"
                        }
                      ],
                      "under": [
                        {
                          "kind": "text",
                          "text": "A"
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
                "text": "R"
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
              "kind": "paren",
              "of": [
                {
                  "kind": "scripted",
                  "base": {
                    "kind": "text",
                    "text": "n"
                  },
                  "sub": [
                    {
                      "kind": "text",
                      "text": "f"
                    }
                  ]
                },
                {
                  "kind": "text",
                  "text": " + 1"
                }
              ]
            }
          ],
          "under": [
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
    "text": " = 0"
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
            "kind": "paren",
            "of": [
              {
                "kind": "text",
                "text": "1 - "
              },
              {
                "kind": "scripted",
                "base": {
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
                "sup": [
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
            "kind": "paren",
            "of": [
              {
                "kind": "text",
                "text": "1 - "
              },
              {
                "kind": "scripted",
                "base": {
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
                "sup": [
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
    "kind": "rule",
    "via": "EMISSION",
    "line": [
      {
        "kind": "text",
        "text": "what a body feels = "
      },
      {
        "kind": "sum",
        "from": [],
        "to": []
      },
      {
        "kind": "hat",
        "of": [
          {
            "kind": "text",
            "text": "d"
          }
        ]
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "each absorbed ray adds its exit"
        }
      ],
      [
        {
          "kind": "text",
          "text": "force = "
        },
        {
          "kind": "sum",
          "from": [],
          "to": []
        },
        {
          "kind": "text",
          "text": " "
        },
        {
          "kind": "hat",
          "of": [
            {
              "kind": "text",
              "text": "d"
            }
          ]
        },
        {
          "kind": "text",
          "text": " over what arrives"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "the rule adds the ray's own exit to the body's momentum, once per ray taken - so what a body feels is the vector sum of the directions that arrived at it, and a count of them would be a different quantity that is not what any rule computes"
      }
    ],
    "measured": []
  },
  {
    "kind": "rule",
    "via": "CREATION",
    "line": [
      {
        "kind": "text",
        "text": "S = "
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
        "text": "CREATION fires because a point is neutral, and matter is not - so what a body puts into the medium is exactly the making that did not happen where it sits. Its strength is that term, and is not a quantity of its own"
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
        "kind": "words",
        "text": "the "
      },
      {
        "kind": "text",
        "text": " "
      },
      {
        "kind": "text",
        "text": "ρ"
      },
      {
        "kind": "text",
        "text": " "
      },
      {
        "kind": "words",
        "text": " where "
      },
      {
        "kind": "text",
        "text": " "
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
        "kind": "paren",
        "of": [
          {
            "kind": "text",
            "text": "1 - "
          },
          {
            "kind": "paren",
            "of": [
              {
                "kind": "text",
                "text": "1 - "
              },
              {
                "kind": "scripted",
                "base": {
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
                "sup": [
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
          }
        ]
      },
      {
        "kind": "text",
        "text": " - 2·F·"
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
        "text": " = 0"
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
              "kind": "paren",
              "of": [
                {
                  "kind": "text",
                  "text": "1 - "
                },
                {
                  "kind": "scripted",
                  "base": {
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
                  "sup": [
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
          "text": ",  rays taken a meeting: -2"
        }
      ],
      [
        {
          "kind": "text",
          "text": "a point is free when all "
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
          "text": " of its ways out are dark: "
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
              "kind": "paren",
              "of": [
                {
                  "kind": "text",
                  "text": "1 - "
                },
                {
                  "kind": "scripted",
                  "base": {
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
                  "sup": [
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
            }
          ]
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
              "kind": "paren",
              "of": [
                {
                  "kind": "text",
                  "text": "1 - "
                },
                {
                  "kind": "scripted",
                  "base": {
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
                  "sup": [
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
            }
          ]
        },
        {
          "kind": "text",
          "text": " + -2·F·"
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
          "text": " = 0"
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
          "kind": "words",
          "text": "the "
        },
        {
          "kind": "text",
          "text": " "
        },
        {
          "kind": "text",
          "text": "ρ"
        },
        {
          "kind": "text",
          "text": " "
        },
        {
          "kind": "words",
          "text": " where "
        },
        {
          "kind": "text",
          "text": " "
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
          "kind": "paren",
          "of": [
            {
              "kind": "text",
              "text": "1 - "
            },
            {
              "kind": "paren",
              "of": [
                {
                  "kind": "text",
                  "text": "1 - "
                },
                {
                  "kind": "scripted",
                  "base": {
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
                  "sup": [
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
            }
          ]
        },
        {
          "kind": "text",
          "text": " - 2·F·"
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
          "text": " = 0"
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
  },
  {
    "kind": "theorem",
    "via": "one over the rate it is removed at",
    "line": [
      {
        "kind": "text",
        "text": "λ"
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
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "removed at "
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
          "text": " per "
        },
        {
          "kind": "text",
          "text": "ρ"
        }
      ],
      [
        {
          "kind": "text",
          "text": "λ"
        },
        {
          "kind": "text",
          "text": " = 1/("
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
          "text": ") = "
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
    ],
    "because": [
      {
        "kind": "text",
        "text": "what removes a ray is the meeting term, and a rate per unit of what is there is a rate per unit length once the density is settled. One over it is how far one carrier gets, which is the length everything else in this model is screened in"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "a body's own cells thin one another",
    "line": [
      {
        "kind": "text",
        "text": "what a body puts into the medium = "
      },
      {
        "kind": "frac",
        "over": [
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
            "text": "·A·"
          },
          {
            "kind": "paren",
            "of": [
              {
                "kind": "text",
                "text": "1 - "
              },
              {
                "kind": "scripted",
                "base": {
                  "kind": "paren",
                  "of": [
                    {
                      "kind": "text",
                      "text": "1 - "
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
                },
                "sup": [
                  {
                    "kind": "frac",
                    "over": [
                      {
                        "kind": "text",
                        "text": "m"
                      }
                    ],
                    "under": [
                      {
                        "kind": "text",
                        "text": "A"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        "under": [
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
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "each cell prevents "
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
      [
        {
          "kind": "text",
          "text": "a cell at depth d survives d steps: 1 - "
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
              "text": "d"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "the body is T = m/A deep, so the sum runs to there and not past it"
        }
      ],
      [
        {
          "kind": "sum",
          "from": [
            {
              "kind": "text",
              "text": "d=0"
            }
          ],
          "to": [
            {
              "kind": "text",
              "text": "T"
            }
          ]
        },
        {
          "kind": "text",
          "text": " "
        },
        {
          "kind": "scripted",
          "base": {
            "kind": "text",
            "text": "q"
          },
          "sup": [
            {
              "kind": "text",
              "text": "d"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = "
        },
        {
          "kind": "text",
          "text": "λ"
        },
        {
          "kind": "paren",
          "of": [
            {
              "kind": "text",
              "text": "1 - "
            },
            {
              "kind": "scripted",
              "base": {
                "kind": "text",
                "text": "q"
              },
              "sup": [
                {
                  "kind": "text",
                  "text": "T"
                }
              ]
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "deep: that is "
        },
        {
          "kind": "text",
          "text": "λ"
        },
        {
          "kind": "text",
          "text": ", the skin.  shallow: it is T, the whole of it"
        }
      ],
      [
        {
          "kind": "text",
          "text": "what a body puts into the medium = "
        },
        {
          "kind": "frac",
          "over": [
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
              "text": "·A·"
            },
            {
              "kind": "paren",
              "of": [
                {
                  "kind": "text",
                  "text": "1 - "
                },
                {
                  "kind": "scripted",
                  "base": {
                    "kind": "paren",
                    "of": [
                      {
                        "kind": "text",
                        "text": "1 - "
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
                  },
                  "sup": [
                    {
                      "kind": "frac",
                      "over": [
                        {
                          "kind": "text",
                          "text": "m"
                        }
                      ],
                      "under": [
                        {
                          "kind": "text",
                          "text": "A"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          "under": [
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
    ],
    "because": [
      {
        "kind": "text",
        "text": "a body prevents the making at every cell it owns, so what it HOLDS goes as its bulk. What it SENDS does not: a cell's output has to cross the cells outside it, and the meeting term thins it exactly as it thins one body's radiation against another's - the rule has no notion of which body a ray belongs to. A cell at depth d therefore reaches the outside attenuated by "
      },
      {
        "kind": "scripted",
        "base": {
          "kind": "text",
          "text": "e"
        },
        "sup": [
          {
            "kind": "text",
            "text": "-d/"
          },
          {
            "kind": "text",
            "text": "λ"
          }
        ]
      },
      {
        "kind": "text",
        "text": ", and summing that over the depth leaves a geometric sum, and it is summed over the cells there ACTUALLY ARE - down to the body's own depth, m/A, rather than down to infinity. ITS TWO LIMITS ARE THE TWO CASES AND NOTHING CHOOSES BETWEEN THEM: a body deeper than a mean free path sends its skin and goes as its AREA, and one shallower than a mean free path has nothing shadowed and goes as its MASS. Which it is, is what the mean free path says"
      }
    ],
    "measured": []
  },
  {
    "kind": "theorem",
    "via": "the density where a body is, which is not the density of empty space",
    "line": [
      {
        "kind": "text",
        "text": "ρ"
      },
      {
        "kind": "text",
        "text": " at R = "
      },
      {
        "kind": "words",
        "text": "the "
      },
      {
        "kind": "text",
        "text": " "
      },
      {
        "kind": "text",
        "text": "ρ"
      },
      {
        "kind": "text",
        "text": " "
      },
      {
        "kind": "words",
        "text": " where "
      },
      {
        "kind": "text",
        "text": " "
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
        "kind": "paren",
        "of": [
          {
            "kind": "text",
            "text": "1 - "
          },
          {
            "kind": "paren",
            "of": [
              {
                "kind": "text",
                "text": "1 - "
              },
              {
                "kind": "scripted",
                "base": {
                  "kind": "paren",
                  "of": [
                    {
                      "kind": "text",
                      "text": "1 - "
                    },
                    {
                      "kind": "paren",
                      "of": [
                        {
                          "kind": "text",
                          "text": "ρ"
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
                              "text": "·A·"
                            },
                            {
                              "kind": "paren",
                              "of": [
                                {
                                  "kind": "text",
                                  "text": "1 - "
                                },
                                {
                                  "kind": "scripted",
                                  "base": {
                                    "kind": "paren",
                                    "of": [
                                      {
                                        "kind": "text",
                                        "text": "1 - "
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
                                  },
                                  "sup": [
                                    {
                                      "kind": "frac",
                                      "over": [
                                        {
                                          "kind": "text",
                                          "text": "m"
                                        }
                                      ],
                                      "under": [
                                        {
                                          "kind": "text",
                                          "text": "A"
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
                                "text": "R"
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
                              "kind": "paren",
                              "of": [
                                {
                                  "kind": "scripted",
                                  "base": {
                                    "kind": "text",
                                    "text": "n"
                                  },
                                  "sub": [
                                    {
                                      "kind": "text",
                                      "text": "f"
                                    }
                                  ]
                                },
                                {
                                  "kind": "text",
                                  "text": " + 1"
                                }
                              ]
                            }
                          ],
                          "under": [
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
                },
                "sup": [
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
          }
        ]
      },
      {
        "kind": "text",
        "text": " - 2·F·"
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
          "kind": "paren",
          "of": [
            {
              "kind": "text",
              "text": "ρ"
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
                  "text": "·A·"
                },
                {
                  "kind": "paren",
                  "of": [
                    {
                      "kind": "text",
                      "text": "1 - "
                    },
                    {
                      "kind": "scripted",
                      "base": {
                        "kind": "paren",
                        "of": [
                          {
                            "kind": "text",
                            "text": "1 - "
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
                      },
                      "sup": [
                        {
                          "kind": "frac",
                          "over": [
                            {
                              "kind": "text",
                              "text": "m"
                            }
                          ],
                          "under": [
                            {
                              "kind": "text",
                              "text": "A"
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
                    "text": "R"
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
                  "kind": "paren",
                  "of": [
                    {
                      "kind": "scripted",
                      "base": {
                        "kind": "text",
                        "text": "n"
                      },
                      "sub": [
                        {
                          "kind": "text",
                          "text": "f"
                        }
                      ]
                    },
                    {
                      "kind": "text",
                      "text": " + 1"
                    }
                  ]
                }
              ],
              "under": [
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
        "text": " = 0"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "the body's carriers where the far one is: n = "
        },
        {
          "kind": "frac",
          "over": [
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
              "text": "·A·"
            },
            {
              "kind": "paren",
              "of": [
                {
                  "kind": "text",
                  "text": "1 - "
                },
                {
                  "kind": "scripted",
                  "base": {
                    "kind": "paren",
                    "of": [
                      {
                        "kind": "text",
                        "text": "1 - "
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
                  },
                  "sup": [
                    {
                      "kind": "frac",
                      "over": [
                        {
                          "kind": "text",
                          "text": "m"
                        }
                      ],
                      "under": [
                        {
                          "kind": "text",
                          "text": "A"
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
                "text": "R"
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
              "kind": "paren",
              "of": [
                {
                  "kind": "scripted",
                  "base": {
                    "kind": "text",
                    "text": "n"
                  },
                  "sub": [
                    {
                      "kind": "text",
                      "text": "f"
                    }
                  ]
                },
                {
                  "kind": "text",
                  "text": " + 1"
                }
              ]
            }
          ],
          "under": [
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
      ],
      [
        {
          "kind": "text",
          "text": "the population where the body is: "
        },
        {
          "kind": "text",
          "text": "ρ"
        },
        {
          "kind": "text",
          "text": " + n"
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
              "kind": "paren",
              "of": [
                {
                  "kind": "text",
                  "text": "1 - "
                },
                {
                  "kind": "scripted",
                  "base": {
                    "kind": "paren",
                    "of": [
                      {
                        "kind": "text",
                        "text": "1 - "
                      },
                      {
                        "kind": "paren",
                        "of": [
                          {
                            "kind": "text",
                            "text": "ρ"
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
                                "text": "·A·"
                              },
                              {
                                "kind": "paren",
                                "of": [
                                  {
                                    "kind": "text",
                                    "text": "1 - "
                                  },
                                  {
                                    "kind": "scripted",
                                    "base": {
                                      "kind": "paren",
                                      "of": [
                                        {
                                          "kind": "text",
                                          "text": "1 - "
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
                                    },
                                    "sup": [
                                      {
                                        "kind": "frac",
                                        "over": [
                                          {
                                            "kind": "text",
                                            "text": "m"
                                          }
                                        ],
                                        "under": [
                                          {
                                            "kind": "text",
                                            "text": "A"
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
                                  "text": "R"
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
                                "kind": "paren",
                                "of": [
                                  {
                                    "kind": "scripted",
                                    "base": {
                                      "kind": "text",
                                      "text": "n"
                                    },
                                    "sub": [
                                      {
                                        "kind": "text",
                                        "text": "f"
                                      }
                                    ]
                                  },
                                  {
                                    "kind": "text",
                                    "text": " + 1"
                                  }
                                ]
                              }
                            ],
                            "under": [
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
                  },
                  "sup": [
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
            }
          ]
        },
        {
          "kind": "text",
          "text": " + -2·F·"
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
            "kind": "paren",
            "of": [
              {
                "kind": "text",
                "text": "ρ"
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
                    "text": "·A·"
                  },
                  {
                    "kind": "paren",
                    "of": [
                      {
                        "kind": "text",
                        "text": "1 - "
                      },
                      {
                        "kind": "scripted",
                        "base": {
                          "kind": "paren",
                          "of": [
                            {
                              "kind": "text",
                              "text": "1 - "
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
                        },
                        "sup": [
                          {
                            "kind": "frac",
                            "over": [
                              {
                                "kind": "text",
                                "text": "m"
                              }
                            ],
                            "under": [
                              {
                                "kind": "text",
                                "text": "A"
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
                      "text": "R"
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
                    "kind": "paren",
                    "of": [
                      {
                        "kind": "scripted",
                        "base": {
                          "kind": "text",
                          "text": "n"
                        },
                        "sub": [
                          {
                            "kind": "text",
                            "text": "f"
                          }
                        ]
                      },
                      {
                        "kind": "text",
                        "text": " + 1"
                      }
                    ]
                  }
                ],
                "under": [
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
          "text": " = 0"
        }
      ],
      [
        {
          "kind": "text",
          "text": "ρ"
        },
        {
          "kind": "text",
          "text": " at R = "
        },
        {
          "kind": "words",
          "text": "the "
        },
        {
          "kind": "text",
          "text": " "
        },
        {
          "kind": "text",
          "text": "ρ"
        },
        {
          "kind": "text",
          "text": " "
        },
        {
          "kind": "words",
          "text": " where "
        },
        {
          "kind": "text",
          "text": " "
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
          "kind": "paren",
          "of": [
            {
              "kind": "text",
              "text": "1 - "
            },
            {
              "kind": "paren",
              "of": [
                {
                  "kind": "text",
                  "text": "1 - "
                },
                {
                  "kind": "scripted",
                  "base": {
                    "kind": "paren",
                    "of": [
                      {
                        "kind": "text",
                        "text": "1 - "
                      },
                      {
                        "kind": "paren",
                        "of": [
                          {
                            "kind": "text",
                            "text": "ρ"
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
                                "text": "·A·"
                              },
                              {
                                "kind": "paren",
                                "of": [
                                  {
                                    "kind": "text",
                                    "text": "1 - "
                                  },
                                  {
                                    "kind": "scripted",
                                    "base": {
                                      "kind": "paren",
                                      "of": [
                                        {
                                          "kind": "text",
                                          "text": "1 - "
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
                                    },
                                    "sup": [
                                      {
                                        "kind": "frac",
                                        "over": [
                                          {
                                            "kind": "text",
                                            "text": "m"
                                          }
                                        ],
                                        "under": [
                                          {
                                            "kind": "text",
                                            "text": "A"
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
                                  "text": "R"
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
                                "kind": "paren",
                                "of": [
                                  {
                                    "kind": "scripted",
                                    "base": {
                                      "kind": "text",
                                      "text": "n"
                                    },
                                    "sub": [
                                      {
                                        "kind": "text",
                                        "text": "f"
                                      }
                                    ]
                                  },
                                  {
                                    "kind": "text",
                                    "text": " + 1"
                                  }
                                ]
                              }
                            ],
                            "under": [
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
                  },
                  "sup": [
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
            }
          ]
        },
        {
          "kind": "text",
          "text": " - 2·F·"
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
            "kind": "paren",
            "of": [
              {
                "kind": "text",
                "text": "ρ"
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
                    "text": "·A·"
                  },
                  {
                    "kind": "paren",
                    "of": [
                      {
                        "kind": "text",
                        "text": "1 - "
                      },
                      {
                        "kind": "scripted",
                        "base": {
                          "kind": "paren",
                          "of": [
                            {
                              "kind": "text",
                              "text": "1 - "
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
                        },
                        "sup": [
                          {
                            "kind": "frac",
                            "over": [
                              {
                                "kind": "text",
                                "text": "m"
                              }
                            ],
                            "under": [
                              {
                                "kind": "text",
                                "text": "A"
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
                      "text": "R"
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
                    "kind": "paren",
                    "of": [
                      {
                        "kind": "scripted",
                        "base": {
                          "kind": "text",
                          "text": "n"
                        },
                        "sub": [
                          {
                            "kind": "text",
                            "text": "f"
                          }
                        ]
                      },
                      {
                        "kind": "text",
                        "text": " + 1"
                      }
                    ]
                  }
                ],
                "under": [
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
          "text": " = 0"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "the empty-space density is the root of the making against the taking, and it was derived under a condition it is then used outside of: it holds where the line is about the vacuum and NOT about a source. Near a body there is a source. The meeting rule never asks which body a ray belongs to, so the body's own carriers are taken against as readily as the vacuum's and the balance gains a cross piece - AND IT IS THE SAME BALANCE otherwise, read off the same terms with the same counts, so a change in what a rule does moves both together. Far out the body's carriers are nothing and it returns the empty-space root exactly"
      }
    ],
    "measured": []
  }
];
