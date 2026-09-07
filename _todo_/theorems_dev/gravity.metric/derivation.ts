/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * gravity.metric, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * δ = 3·u
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

export const THEOREM = "gravity.metric";
export const ASKS = "the lean threw away how many ways out there now are. Read that way instead, what does the same count give?";
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
    "text": "δ = 3·u"
  }
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [
  "binomial"
];

export const STEPS: Step[] = [
  {
    "kind": "definition",
    "via": "gravity.metric",
    "line": [
      {
        "kind": "text",
        "text": "δ = B"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "3/2"
          }
        ]
      },
      {
        "kind": "text",
        "text": " - 1"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "the correction is what the path accumulates over and above flat space, which is that quantity less one"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "gravity.metric",
    "line": [
      {
        "kind": "text",
        "text": "B"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "3/2"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = B"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "3/2"
          }
        ]
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "what a path accumulates through the stretched space goes as B to the three halves - and three halves is not a number of times you can multiply something by itself, so the next line is a series rather than a product"
      }
    ],
    "measured": []
  },
  {
    "kind": "definition",
    "via": "gravity.metric",
    "line": [
      {
        "kind": "text",
        "text": "B = 1 + 2u"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "the ways out of the point number "
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
        "text": " + n rather than "
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
        "text": ", which over "
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
        "text": " is 1 + n/"
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
        "text": " - the same everywhere, so one number per place and no tensor needed. Written in the potential that is 1 + 2u, which is what u NAMES; the factor of two is the normalisation the article carries, not a step"
      }
    ],
    "measured": []
  },
  {
    "kind": "derived",
    "via": "the binomial series",
    "line": [
      {
        "kind": "text",
        "text": "B"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "3/2"
          }
        ]
      },
      {
        "kind": "text",
        "text": " = 1 + 3·u"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "B = 1 + 2·u"
        }
      ],
      [
        {
          "kind": "text",
          "text": "B"
        },
        {
          "kind": "sup",
          "of": [
            {
              "kind": "text",
              "text": "3/2"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = (1 + 2·u)"
        },
        {
          "kind": "sup",
          "of": [
            {
              "kind": "text",
              "text": "3/2"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "= 1 + 3/2·2·u + ... (to order 1)"
        }
      ],
      [
        {
          "kind": "text",
          "text": "= 1 + 3·u"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "B is 1 + 2·u, which is one plus 2·u. Raised to 3/2 that is "
      },
      {
        "kind": "ref",
        "key": "binomial"
      },
      {
        "kind": "text",
        "text": " in 2·u, kept to order 1"
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
        "text": "δ = 3·u"
      }
    ],
    "working": [
      [
        {
          "kind": "text",
          "text": "δ = -1 + B"
        },
        {
          "kind": "sup",
          "of": [
            {
              "kind": "text",
              "text": "3/2"
            }
          ]
        }
      ],
      [
        {
          "kind": "text",
          "text": "B"
        },
        {
          "kind": "sup",
          "of": [
            {
              "kind": "text",
              "text": "3/2"
            }
          ]
        },
        {
          "kind": "text",
          "text": " = 1 + 3·u"
        }
      ],
      [
        {
          "kind": "text",
          "text": "δ = 3·u"
        }
      ]
    ],
    "because": [
      {
        "kind": "text",
        "text": "B"
      },
      {
        "kind": "sup",
        "of": [
          {
            "kind": "text",
            "text": "3/2"
          }
        ]
      },
      {
        "kind": "text",
        "text": " is not a primitive of this theory - it is 1 + 3·u, so it stands in for itself here and the result is multiplied out"
      }
    ],
    "measured": []
  }
];
