/**
 * @orbitmines/physics - THE DISCRETE THEORY, AND THE SMALLEST THING THAT RUNS IT.
 *
 * WHAT IS HERE IS `G` AND WHAT `G` NEEDS. The research repository is
 * `implementations/.ts`, and it carries the measurement, the reports, the visuals, the
 * prover and seven further theories; none of that is needed to state the rules and tick
 * a world, so none of it is here. Eight files: the vocabulary a rule is written in
 * (`Local`), what a rewrite is (`Rewrite`), where the state lives (`Backend`, and the
 * `Graph` that implements it), what a theory IS (`Theory`, `World`), what puts matter in
 * (`Source`), and the theory itself.
 *
 * THE SHORTEST COMPLETE USE OF IT:
 *
 *     import { G, GEOMETRIES } from "@orbitmines/physics";
 *
 *     const world = G.seed({ N: 21, seed: 1, geometry: GEOMETRIES["fcc-12"] });
 *     for (let t = 0; t < 100; t++) world.tick();
 *
 * `seed` lays down a box `N` cells a side on the given lattice and hands back a world;
 * `tick` runs every rule of the theory once, in the order the theory declares them. The
 * box, the tiling and the seed are the configuration a result is about - a number
 * measured on fcc-12 is a number about fcc-12 - so they are arguments and not constants.
 *
 * AND THE THEORY IS A VALUE, which is the point of building it this way. `G` is not a
 * module of functions; it is an object carrying its rules and its decorations, and every
 * builder on it - `rule`, `decorate`, `without`, `layered` - returns a NEW theory rather
 * than changing this one. So a variant is a theory in its own right and can be run beside
 * the one it came from:
 *
 *     const heavier = G.decorate.World(() => ({ inertia: 2 }));
 *     const deterministic = G.without("CREATION");
 *
 * WHICH IS WHY THERE ARE NO SETTINGS ON `G` ITSELF. It used to carry two dozen - which
 * meeting to resolve, what a fold leaves behind, whether a collapse sends itself out,
 * where the split may not fire - and every one of them had a default that was the only
 * value `G` was ever run at, because the other values ARE the other theories. A switch
 * inside a theory is a second theory hiding in it: it reads as though the rule were
 * conditional, and the rules of `G` are not. The configuration that remains is the
 * configuration a RESULT is about - the tiling, the box and the seed - and it is on
 * `seed` where a reader can see it.
 */

/** the theory, and the variants of it that this package ships */
export * from "./src/theories/G/G.ts";

/** what a rule is written in - points, rays, boundaries, lattices and vectors */
export * from "./src/lib/Local.ts";

/** what a theory is, and the world a theory seeds */
export * from "./src/lib/Theory.ts";
export * from "./src/lib/World.ts";

/**
 * THE LANGUAGE A RULE'S BODY IS WRITTEN IN - the five atoms and the ways of composing them.
 *
 * `light` and `busy` are the language's own: `light(ray)` is the ACT of putting one ray out on
 * one exit, where `Local`'s lights every exit of a point at once, and `busy(point)` is the
 * ASKING as an expression. Named rather than splatted so the two cannot be confused.
 */
export {
  and, arg, bump, carriedBy, count, douse, each, either, exits, facingIt, fold, grow, handOver,
  is, it, let_, not, of, op, owned, plus, point, putIn, seq, set, settle, showCount, some,
  stands, steps, tally, times, unfold, value, waitForRoom, when, world, ZERO, NOTHING,
  light as lightOne, busy as isBusy, neutral, lit, a, b, list,
} from "./src/lib/Language.ts";
export type { Act, Count, Doing, Env, Term } from "./src/lib/Language.ts";

/** and what a rule is - a quantifier, some gates, and a body in that language */
export * from "./src/lib/Rules.ts";

/**
 * and the same values read as an equation, which is where the continuous model comes from.
 * `Term` is this module's own - a term of the EQUATION, where `Language`'s is a term of the
 * expression tree - so it is named rather than splatted.
 */
export { continuum, ledger, read } from "./src/lib/Continuum.ts";
export type { Equation, Readable } from "./src/lib/Continuum.ts";

/** what a rewrite is - the operations a rule is allowed to ask for */
export * from "./src/lib/Rewrite.ts";

/** where the state lives, and the one implementation of it here */
export * from "./src/lib/Backend.ts";
export * from "./src/backends/CPU.graph.ts";

/** what puts matter into a world, and how a body is laid onto the lattice */
export * from "./src/lib/Source.ts";
