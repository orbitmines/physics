/**
 * WHAT A PORTED TEST IMPORTS — the article's `DISCRETE` surface, assembled out of the
 * pieces this implementation keeps separate.
 *
 * The model here is not one file: the vocabulary is `Local.ts`, the rules are theories,
 * measurement is `Measure.ts` and the report is `Report.ts`. A migrated claim was
 * written against one module, and it should not have to know that.
 */
export * from "./Local.ts";
export * from "./Measure.ts";
export * from "./Report.ts";
export * from "./Compat.ts";
