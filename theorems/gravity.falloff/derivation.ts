/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * gravity.falloff, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * F ∝ A·δ/site
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

export const THEOREM = "gravity.falloff";
export const ASKS = "a body sits \\bar{r} steps away from another in the medium. How does what it feels depend on \\bar{r}, and on what else?";
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
    "text": "F ∝ A·δ/site"
  }
];
export const STANDING = false;
export const MISSING = [
  "deficit is conserved in flight",
  "deficit travels through ρ"
];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "definition",
    "via": "gravity.falloff",
    "line": [
      {
        "kind": "text",
        "text": "F = A · δ/site"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "what a body feels is what the medium has to offer where it stands, times how much of the medium it is open to. That is what a force IS in this model, and it mentions no distance"
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
        "text": "F ∝ A·δ/site"
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
  }
];
