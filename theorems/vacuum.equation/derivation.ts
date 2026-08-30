/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * vacuum.equation, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * (\partial_{t}+\hat{d}·\nabla_{x})n_{b} = \nu(1-\rho) - \sigma n\tilde{n}_{b}F - \tau n\tilde{n}_{b}F(R-1) + (\sigma_{s}+|B|)(S_{\Theta}-1)n_{b} + \chi(turning)_{1-b} + \Sigma(x,\hat{d},t)
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

export const THEOREM = "vacuum.equation";
export const ASKS = "every rule has been written as a term and three of those terms have been corrected. Put the whole of it on one line - what IS the continuous model?";
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
    "text": "("
  },
  {
    "kind": "text",
    "text": "∂"
  },
  {
    "kind": "sub",
    "of": [
      {
        "kind": "text",
        "text": "t"
      }
    ]
  },
  {
    "kind": "text",
    "text": "+"
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
    "text": "·"
  },
  {
    "kind": "text",
    "text": "∇"
  },
  {
    "kind": "sub",
    "of": [
      {
        "kind": "text",
        "text": "x"
      }
    ]
  },
  {
    "kind": "text",
    "text": ")n"
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
    "text": " = "
  },
  {
    "kind": "text",
    "text": "ν"
  },
  {
    "kind": "text",
    "text": "(1-"
  },
  {
    "kind": "text",
    "text": "ρ"
  },
  {
    "kind": "text",
    "text": ") - "
  },
  {
    "kind": "text",
    "text": "σ"
  },
  {
    "kind": "text",
    "text": " n"
  },
  {
    "kind": "tilde",
    "of": [
      {
        "kind": "text",
        "text": "n"
      }
    ]
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
    "text": "F - "
  },
  {
    "kind": "text",
    "text": "τ"
  },
  {
    "kind": "text",
    "text": " n"
  },
  {
    "kind": "tilde",
    "of": [
      {
        "kind": "text",
        "text": "n"
      }
    ]
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
    "kind": "fn",
    "of": [
      {
        "kind": "text",
        "text": "F"
      }
    ]
  },
  {
    "kind": "text",
    "text": "(R-1) + ("
  },
  {
    "kind": "text",
    "text": "σ"
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
    "text": "+|B|)(S"
  },
  {
    "kind": "sub",
    "of": [
      {
        "kind": "text",
        "text": "Θ"
      }
    ]
  },
  {
    "kind": "text",
    "text": "-1)n"
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
    "text": " + "
  },
  {
    "kind": "text",
    "text": "χ"
  },
  {
    "kind": "text",
    "text": "(turning)"
  },
  {
    "kind": "sub",
    "of": [
      {
        "kind": "text",
        "text": "1-b"
      }
    ]
  },
  {
    "kind": "text",
    "text": " + "
  },
  {
    "kind": "text",
    "text": "Σ"
  },
  {
    "kind": "text",
    "text": "(x,"
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
    "text": ",t)"
  }
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "premise",
    "via": "terms/what-the-model-is-made-of",
    "line": [
      {
        "kind": "text",
        "text": "ν"
      },
      {
        "kind": "text",
        "text": "(1-"
      },
      {
        "kind": "text",
        "text": "ρ"
      },
      {
        "kind": "text",
        "text": ") is a term of ("
      },
      {
        "kind": "text",
        "text": "∂"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "t"
          }
        ]
      },
      {
        "kind": "text",
        "text": "+"
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
        "text": "·"
      },
      {
        "kind": "text",
        "text": "∇"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "x"
          }
        ]
      },
      {
        "kind": "text",
        "text": ")n"
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
        "text": " - (G/2)"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "(G/2) is a rewrite of this model - it is on the object `tick` is handed, as `nu` - and as a statement about a density it says that a neutral point splits into a pair, gated on the room left. Read off the rule set rather than transcribed, so a model without it writes no such term. Taken out on its own the vacuum moves 29.2 per cent, which is the check that it is a term at all"
      }
    ],
    "measured": [
      {
        "name": "making",
        "value": 0.2915273132664415,
        "note": "`nu` is a key of the solver's own `Rules`, and it is a neutral point splits into a pair, gated on the room left. Settled with every rate on the box comes to rho = 1.495; with `nu` alone taken out it moves 29.2 per cent, so the term is doing something and is not being carried for nothing"
      }
    ]
  },
  {
    "kind": "premise",
    "via": "terms/what-the-model-is-made-of",
    "line": [
      {
        "kind": "text",
        "text": "σ"
      },
      {
        "kind": "text",
        "text": " n"
      },
      {
        "kind": "tilde",
        "of": [
          {
            "kind": "text",
            "text": "n"
          }
        ]
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
        "text": "F is a term of ("
      },
      {
        "kind": "text",
        "text": "∂"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "t"
          }
        ]
      },
      {
        "kind": "text",
        "text": "+"
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
        "text": "·"
      },
      {
        "kind": "text",
        "text": "∇"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "x"
          }
        ]
      },
      {
        "kind": "text",
        "text": ")n"
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
        "text": " - ANNIHILATION"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "ANNIHILATION is a rewrite of this model - it is on the object `tick` is handed, as `sigma` - and as a statement about a density it says that a facing pair of opposite sign is destroyed, against the oncoming current. Read off the rule set rather than transcribed, so a model without it writes no such term. Taken out on its own the vacuum moves 1347.0 per cent, which is the check that it is a term at all"
      }
    ],
    "measured": [
      {
        "name": "killing",
        "value": 13.470023535240966,
        "note": "`sigma` is a key of the solver's own `Rules`, and it is a facing pair of opposite sign is destroyed, against the oncoming current. Settled with every rate on the box comes to rho = 1.495; with `sigma` alone taken out it moves 1347.0 per cent, so the term is doing something and is not being carried for nothing"
      }
    ]
  },
  {
    "kind": "premise",
    "via": "terms/what-the-model-is-made-of",
    "line": [
      {
        "kind": "text",
        "text": "τ"
      },
      {
        "kind": "text",
        "text": " n"
      },
      {
        "kind": "tilde",
        "of": [
          {
            "kind": "text",
            "text": "n"
          }
        ]
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
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "F"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(R-1) is a term of ("
      },
      {
        "kind": "text",
        "text": "∂"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "t"
          }
        ]
      },
      {
        "kind": "text",
        "text": "+"
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
        "text": "·"
      },
      {
        "kind": "text",
        "text": "∇"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "x"
          }
        ]
      },
      {
        "kind": "text",
        "text": ")n"
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
        "text": " - (G+M/3)"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "(G+M/3) is a rewrite of this model - it is on the object `tick` is handed, as `tau` - and as a statement about a density it says that a facing pair of alike sign is sent back the way it came, and nothing dies. Read off the rule set rather than transcribed, so a model without it writes no such term. Taken out on its own the vacuum moves 6.5 per cent, which is the check that it is a term at all"
      }
    ],
    "measured": [
      {
        "name": "R_{alike}",
        "value": 0.06546513068252388,
        "note": "`tau` is a key of the solver's own `Rules`, and it is a facing pair of alike sign is sent back the way it came, and nothing dies. Settled with every rate on the box comes to rho = 1.495; with `tau` alone taken out it moves 6.5 per cent, so the term is doing something and is not being carried for nothing"
      }
    ]
  },
  {
    "kind": "premise",
    "via": "terms/what-the-model-is-made-of",
    "line": [
      {
        "kind": "text",
        "text": "("
      },
      {
        "kind": "text",
        "text": "σ"
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
        "text": "+|B|)(S"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "Θ"
          }
        ]
      },
      {
        "kind": "text",
        "text": "-1)n"
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
        "text": " is a term of ("
      },
      {
        "kind": "text",
        "text": "∂"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "t"
          }
        ]
      },
      {
        "kind": "text",
        "text": "+"
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
        "text": "·"
      },
      {
        "kind": "text",
        "text": "∇"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "x"
          }
        ]
      },
      {
        "kind": "text",
        "text": ")n"
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
        "text": " - steer"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "steer is a rewrite of this model - it is on the object `tick` is handed, as `stir` - and as a statement about a density it says that a ray is turned by a fixed angle about the field's axis, at the vacuum's own stir plus whatever field is there. Read off the rule set rather than transcribed, so a model without it writes no such term. Taken out on its own the vacuum moves 37.5 per cent, which is the check that it is a term at all"
      }
    ],
    "measured": [
      {
        "name": "S_{\\Theta}",
        "value": 0.3753251579338501,
        "note": "`stir` is a key of the solver's own `Rules`, and it is a ray is turned by a fixed angle about the field's axis, at the vacuum's own stir plus whatever field is there. Settled with every rate on the box comes to rho = 1.495; with `stir` alone taken out it moves 37.5 per cent, so the term is doing something and is not being carried for nothing"
      }
    ]
  },
  {
    "kind": "premise",
    "via": "terms/what-the-model-is-made-of",
    "line": [
      {
        "kind": "text",
        "text": "χ"
      },
      {
        "kind": "text",
        "text": "(turning)"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "1-b"
          }
        ]
      },
      {
        "kind": "text",
        "text": " is a term of ("
      },
      {
        "kind": "text",
        "text": "∂"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "t"
          }
        ]
      },
      {
        "kind": "text",
        "text": "+"
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
        "text": "·"
      },
      {
        "kind": "text",
        "text": "∇"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "x"
          }
        ]
      },
      {
        "kind": "text",
        "text": ")n"
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
        "text": " - RADIATING"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "RADIATING is a rewrite of this model - it is on the object `tick` is handed, as `shine` - and as a statement about a density it says that a turn throws off a ray of its own, onto the other beat. Read off the rule set rather than transcribed, so a model without it writes no such term. Taken out on its own the vacuum moves 38.7 per cent, which is the check that it is a term at all"
      }
    ],
    "measured": [
      {
        "name": "\\chi(turning)",
        "value": 0.386535364796231,
        "note": "`shine` is a key of the solver's own `Rules`, and it is a turn throws off a ray of its own, onto the other beat. Settled with every rate on the box comes to rho = 1.495; with `shine` alone taken out it moves 38.7 per cent, so the term is doing something and is not being carried for nothing"
      }
    ]
  },
  {
    "kind": "premise",
    "via": "terms/what-the-model-is-made-of",
    "line": [
      {
        "kind": "text",
        "text": "Σ"
      },
      {
        "kind": "text",
        "text": "(x,"
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
        "text": ",t) is a term of ("
      },
      {
        "kind": "text",
        "text": "∂"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "t"
          }
        ]
      },
      {
        "kind": "text",
        "text": "+"
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
        "text": "·"
      },
      {
        "kind": "text",
        "text": "∇"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "x"
          }
        ]
      },
      {
        "kind": "text",
        "text": ")n"
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
        "text": " - not a rule"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "`source` is on the same object and moves the vacuum 18.1 per cent when it is taken away, so it is a term of the model like the others - but NO REWRITE PRODUCES IT. It is what is put into the box from outside - no rewrite of the model writes into it, and that is what makes it the only place a particular problem can be written"
      }
    ],
    "measured": [
      {
        "name": "\\Sigma",
        "value": 0.18103555060076837,
        "note": "`source` is a key of the solver's own `Rules`, and it is what is put into the box from outside - no rewrite of the model writes into it. Settled with every rate on the box comes to rho = 1.495; with `source` alone taken out it moves 18.1 per cent, so the term is doing something and is not being carried for nothing"
      }
    ]
  },
  {
    "kind": "premise",
    "via": "terms/what-the-model-is-made-of",
    "line": [
      {
        "kind": "text",
        "text": "("
      },
      {
        "kind": "text",
        "text": "σ"
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
        "text": "+|B|)(S"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "Θ"
          }
        ]
      },
      {
        "kind": "text",
        "text": "-1)n"
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
        "text": " = "
      },
      {
        "kind": "text",
        "text": "σ"
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
        "text": "+|B| · n"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "b"
          }
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "and the operator is that rate against the density it acts on, and nothing else: a steer TURNS a ray, so it neither makes one nor takes one, and the term is linear in n. A finite rotation is not a derivative - the rule makes one turn of size THETA = 2pi/"
      },
      {
        "kind": "count",
        "of": [
          {
            "kind": "text",
            "text": "CYCLE"
          }
        ]
      },
      {
        "kind": "text",
        "text": ", which is 60, 90 or 45 degrees, not a small one - so it belongs in a collision operator rather than in a "
      },
      {
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "q"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(B x d^)·grad"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "d"
          }
        ]
      },
      {
        "kind": "text",
        "text": " n, and once it is one `turn.kernel` diagonalises it and the whole angular problem is g"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "l"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = <P"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "l"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(cos gamma)> in closed form, with nothing expanded or truncated"
      }
    ],
    "measured": [
      {
        "name": "\\sigma_{s}+|B|",
        "value": 1.35698848967672,
        "note": "`steer` fires once a ring step a tick against the field a ray has accumulated, so the rate is the vacuum's own stir plus the local field: 1 + 0.357 = 1.357 averaged over the box. Where the field is nought a ray still turns - at the bare stir, about a uniform axis, which is `turn.isotropic` - and where a source has built one it turns faster and about THAT axis. The sense is the ray's CHARGE, so the two charges wind opposite ways in the same field, which is the only thing in the equation that tells them apart"
      }
    ]
  },
  {
    "kind": "derived",
    "via": "multiplying",
    "line": [
      {
        "kind": "text",
        "text": "("
      },
      {
        "kind": "text",
        "text": "σ"
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
        "text": "+|B|)(S"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "Θ"
          }
        ]
      },
      {
        "kind": "text",
        "text": "-1)n"
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
        "text": " ∝ "
      },
      {
        "kind": "text",
        "text": "σ"
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
        "text": "+|B|·n"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "b"
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
    "via": "every rule is a term, and the terms add",
    "line": [
      {
        "kind": "text",
        "text": "("
      },
      {
        "kind": "text",
        "text": "∂"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "t"
          }
        ]
      },
      {
        "kind": "text",
        "text": "+"
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
        "text": "·"
      },
      {
        "kind": "text",
        "text": "∇"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "x"
          }
        ]
      },
      {
        "kind": "text",
        "text": ")n"
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
        "text": " = "
      },
      {
        "kind": "text",
        "text": "ν"
      },
      {
        "kind": "text",
        "text": "(1-"
      },
      {
        "kind": "text",
        "text": "ρ"
      },
      {
        "kind": "text",
        "text": ") - "
      },
      {
        "kind": "text",
        "text": "σ"
      },
      {
        "kind": "text",
        "text": " n"
      },
      {
        "kind": "tilde",
        "of": [
          {
            "kind": "text",
            "text": "n"
          }
        ]
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
        "text": "F - "
      },
      {
        "kind": "text",
        "text": "τ"
      },
      {
        "kind": "text",
        "text": " n"
      },
      {
        "kind": "tilde",
        "of": [
          {
            "kind": "text",
            "text": "n"
          }
        ]
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
        "kind": "fn",
        "of": [
          {
            "kind": "text",
            "text": "F"
          }
        ]
      },
      {
        "kind": "text",
        "text": "(R-1) + ("
      },
      {
        "kind": "text",
        "text": "σ"
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
        "text": "+|B|)(S"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "Θ"
          }
        ]
      },
      {
        "kind": "text",
        "text": "-1)n"
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
        "text": " + "
      },
      {
        "kind": "text",
        "text": "χ"
      },
      {
        "kind": "text",
        "text": "(turning)"
      },
      {
        "kind": "sub",
        "of": [
          {
            "kind": "text",
            "text": "1-b"
          }
        ]
      },
      {
        "kind": "text",
        "text": " + "
      },
      {
        "kind": "text",
        "text": "Σ"
      },
      {
        "kind": "text",
        "text": "(x,"
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
        "text": ",t)"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "+ "
        },
        {
          "kind": "text",
          "text": "ν"
        },
        {
          "kind": "text",
          "text": "(1-"
        },
        {
          "kind": "text",
          "text": "ρ"
        },
        {
          "kind": "text",
          "text": ")   ((G/2))"
        }
      ],
      [
        {
          "kind": "text",
          "text": "- "
        },
        {
          "kind": "text",
          "text": "σ"
        },
        {
          "kind": "text",
          "text": " n"
        },
        {
          "kind": "tilde",
          "of": [
            {
              "kind": "text",
              "text": "n"
            }
          ]
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
          "text": "F   (ANNIHILATION)"
        }
      ],
      [
        {
          "kind": "text",
          "text": "- "
        },
        {
          "kind": "text",
          "text": "τ"
        },
        {
          "kind": "text",
          "text": " n"
        },
        {
          "kind": "tilde",
          "of": [
            {
              "kind": "text",
              "text": "n"
            }
          ]
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
          "kind": "fn",
          "of": [
            {
              "kind": "text",
              "text": "F"
            }
          ]
        },
        {
          "kind": "text",
          "text": "(R-1)   ((G+M/3))"
        }
      ],
      [
        {
          "kind": "text",
          "text": "+ ("
        },
        {
          "kind": "text",
          "text": "σ"
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
          "text": "+|B|)(S"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "Θ"
            }
          ]
        },
        {
          "kind": "text",
          "text": "-1)n"
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
          "text": "   (steer)"
        }
      ],
      [
        {
          "kind": "text",
          "text": "+ "
        },
        {
          "kind": "text",
          "text": "χ"
        },
        {
          "kind": "text",
          "text": "(turning)"
        },
        {
          "kind": "sub",
          "of": [
            {
              "kind": "text",
              "text": "1-b"
            }
          ]
        },
        {
          "kind": "text",
          "text": "   (RADIATING)"
        }
      ],
      [
        {
          "kind": "text",
          "text": "+ "
        },
        {
          "kind": "text",
          "text": "Σ"
        },
        {
          "kind": "text",
          "text": "(x,"
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
          "text": ",t)   (not a rule)"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "5 of these 6 terms is a rule of the model - (G/2), ANNIHILATION, (G+M/3), steer, RADIATING - and each of them fires on its own matches without consulting the others, so what they do adds. The line is therefore what the rules come to rather than a transcription of them: a model with a rule taken out writes one term fewer here without anything else changing"
      }
    ],
    "measured": []
  }
];
