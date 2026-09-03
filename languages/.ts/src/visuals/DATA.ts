/**
 * WHAT A VISUAL WAS DRAWN FROM — the panel's door onto `lib/Measured.ts`, and nothing else.
 *
 * This used to be the whole reader. It moved down into `lib` the day `Sparc.ts` started
 * reading its catalogue off disk rather than carrying it as a blob: core code needed the
 * same file format, and core code reaching up into `visuals/` for it would have been the
 * wrong way round. The panels keep importing it from here because that is where they look.
 */
export { measured, read } from "../lib/Measured.ts";
export type { Header, Measured } from "../lib/Measured.ts";
