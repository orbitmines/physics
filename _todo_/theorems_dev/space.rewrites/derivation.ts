/**
 * GENERATED - do not edit. Rebuild with `npm run theorems`.
 *
 * space.rewrites, for G on fcc-12
 * (D 3, DEG 12), box 21, 120 ticks.
 *
 * rewrites = 6
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

export const THEOREM = "space.rewrites";
export const ASKS = "what is this theory made of - and how many rewrites does making space out of nothing actually take?";
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
    "text": "rewrites = 6"
  }
];
export const STANDING = true;
export const MISSING = [];
export const CITES = [];

export const STEPS: Step[] = [
  {
    "kind": "premise",
    "via": "rules/what-this-theory-does",
    "line": [
      {
        "kind": "text",
        "text": "rewrites = 6"
      }
    ],
    "working": [],
    "because": [
      {
        "kind": "text",
        "text": "G has exactly these 6 rewrites and no others: EMISSION over each Local, gated on \"source\"; CREATION over each Local; MOVEMENT over the world; ARRIVAL over the world; ANNIHILATION over a chain of Boundary, Boundary, gated on \"active\"; TRANSPORT over the world. Listed off the theory rather than transcribed, so a theory with a rule taken out reports one fewer without anything here changing"
      }
    ],
    "measured": [
      {
        "name": "rewrites",
        "value": 6,
        "note": "G is made of these, read off the theory itself: EMISSION over each Local, gated on \"source\"; CREATION over each Local; MOVEMENT over the world; ARRIVAL over the world; ANNIHILATION over a chain of Boundary, Boundary, gated on \"active\"; TRANSPORT over the world"
      }
    ]
  }
];
