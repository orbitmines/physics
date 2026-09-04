/**
 * @orbitmines/physics/notation - THE NOTATION A PROOF IS SET IN, AND NOTHING ELSE.
 *
 * A SEPARATE ENTRY POINT ON PURPOSE. `import { G } from "@orbitmines/physics"` must not
 * reach a view library, a document or a stylesheet, because a theory that only runs
 * where there is a DOM is not the thing this package is. So the typesetting is here
 * instead, and importing the theory never loads it.
 *
 * AND STILL NO DEPENDENCY. `notation` takes the runtime as an argument rather than
 * importing one - see the header of `src/notation/Notation.ts` for why, and for what it
 * asks of it. In a consumer that is one file:
 *
 *     import * as React from "react";
 *     import { notation } from "@orbitmines/physics/notation";
 *
 *     export const { Eq, V, K, Bar, Frac, Sub, Sup, Markup } = notation(React);
 *
 * after which they are ordinary components in ordinary JSX - `<Eq><V>a</V> =
 * <K>DEG</K></Eq>` - typed with that consumer's own node type, with nothing about React
 * in this package's `package.json` and no `.tsx` in it either.
 *
 * `parse`, `set` and `Setter` come out here as well, for anything that wants to set a
 * line into something that is not elements at all - and `html`, which is that same walk
 * into a standalone page.
 */

/** the notation, bound to whatever runtime is handed to it */
export { notation, INK, DIM, FAINT, RULE, NAMED, DERIVED, BORROWED, SERIF } from "./src/notation/Notation.ts";
export type { Runtime, Content, Derivation } from "./src/notation/Notation.ts";

/** the markup itself - what a piece of a line is, how a line is read, how one is set */
export { parse, set, html, check, BANNED, RBAR_MARKUP } from "./src/rendering/Notation.ts";
export type { Piece, Setter } from "./src/rendering/Notation.ts";

/** and the works a proof is allowed to lean on, which is what a `[[ref]]` resolves to */
export { REFERENCES } from "./src/rendering/references.ts";
export type { Reference } from "./src/rendering/references.ts";
