/**
 * @orbitmines/physics/theorems - WHAT THE RULES COME TO, AS SOMETHING TO LOOK UP.
 *
 * `npm run theorems` closes the rules of the theory once and writes what follows: a
 * folder per question under `theorems/`, and this registry, which is those same records
 * as one value. Nothing here was written by hand and nothing here was measured - a
 * premise is read off a rewrite in `G.ts`, so a rule edited there moves the conclusion
 * and moves it everywhere it is cited.
 *
 * WHICH IS WHAT THIS ENTRY POINT IS FOR. Handed to `notation`, an article can cite a
 * theorem by name instead of copying its line out:
 *
 *     import * as React from "react";
 *     import { notation } from "@orbitmines/physics/notation";
 *     import { PROVED } from "@orbitmines/physics/theorems";
 *
 *     export const { Eq, V, K, Bar } = notation(React, PROVED);
 *
 *     <Eq theory="G" theorem="gravity.mass" />
 *
 * which sets the line the prover concluded and opens the whole working behind it. A
 * transcribed equation is a second copy of a derived thing and therefore a thing that
 * drifts; this one cannot, because there is only ever one of it.
 *
 * ITS OWN ENTRY POINT, because it is about a megabyte of parsed derivations and the
 * notation is a few kilobytes. Importing `@orbitmines/physics/notation` on its own
 * reaches none of this, and importing the theory reaches neither.
 */

/** every theorem, by theory and then by question */
export { PROVED } from "./src/theorems/PROVED.ts";

/** what one is, and the three ways of asking the registry for one */
export { proved, theories, asked } from "./src/theorems/Registry.ts";
export type { Registry, Proved, Step } from "./src/theorems/Registry.ts";
