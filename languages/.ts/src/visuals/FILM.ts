/**
 * GENERATED - do not edit. Rebuild with `npm run film`.
 *
 * WHERE EACH RENDERED VISUAL IS, as something a bundler can resolve. `new URL(...,
 * import.meta.url)` is the one way to name an asset from inside a package that ships no build
 * step, and it only works where the path is written out - which is why this file is generated
 * rather than a loop over a directory.
 */
export type Film = { webm?: string; poster?: string };

export const FILM: Record<string, Film> = {
  "galaxy.many": {
    webm: new URL("../../visuals/galaxy.many/animation.webm", import.meta.url).href,
    poster: new URL("../../visuals/galaxy.many/snapshot.png", import.meta.url).href,
  },
  "galaxy.point": {
    webm: new URL("../../visuals/galaxy.point/animation.webm", import.meta.url).href,
    poster: new URL("../../visuals/galaxy.point/snapshot.png", import.meta.url).href,
  },
  "gravity.pull": {
    webm: new URL("../../visuals/gravity.pull/animation.webm", import.meta.url).href,
    poster: new URL("../../visuals/gravity.pull/snapshot.png", import.meta.url).href,
  },
  "gravity.rain": {
    webm: new URL("../../visuals/gravity.rain/animation.webm", import.meta.url).href,
    poster: new URL("../../visuals/gravity.rain/snapshot.png", import.meta.url).href,
  },
};
