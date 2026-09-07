/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * vacuum.beats, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * \beta = 0.526
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

export const THEOREM = "vacuum.beats";
export const ASKS = "the making and the killing are two rules that fire at different times, not two terms that hold at once. What is left of the vacuum once that is taken seriously?";
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
    "text": "β"
  },
  {
    "kind": "text",
    "text": " = 0.526"
  }
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "premise",
    "via": "population/what-the-rules-do-as-a-crowd",
    "line": [
      {
        "kind": "text",
        "text": "β"
      },
      {
        "kind": "text",
        "text": " = 0.526"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "and only the opposites on a ray's OWN beat are partners: 53% of the opposing polarity where it stands. The other half is invisible to it and it passes straight through, which is what lets anything cross a vacuum that would otherwise kill it where it was made"
      }
    ],
    "measured": [
      {
        "name": "\\beta",
        "value": 0.5256188849983423,
        "note": "and only the opposites on a ray's OWN beat are partners: 53% of the opposing polarity where it stands. The other half is invisible to it and it passes straight through, which is what lets anything cross a vacuum that would otherwise kill it where it was made"
      }
    ]
  }
];
