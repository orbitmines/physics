/**
 * WHAT A VISUAL WAS DRAWN FROM, KEPT — so the look can be changed without measuring again.
 *
 * A PANEL THAT COMPUTES ITS OWN PHYSICS IS A PANEL NOBODY ITERATES ON. Closing the rules,
 * solving the balances and summing a galaxy takes minutes; changing a colour takes seconds,
 * and tying the two together means every colour costs minutes. Worse, it hides what the
 * picture is made of: a reader cannot check a number that only ever existed inside a canvas.
 *
 * SO MEASURING AND DRAWING ARE SPLIT. `tools/MEASURE.ts` runs the model and writes what it
 * found; a panel imports that and draws. The numbers are on disk, in the open, and the same
 * file can be read by a test, a table, or a different picture entirely.
 *
 * THE FORMAT IS COLUMNS OF `Float32` PLUS A JSON HEADER, which is what this repository already
 * uses for measured fields elsewhere. Raw, so it costs nothing to read; named, so nothing has
 * to remember what column three was; and with the header carrying whatever the measurement
 * wants to say about itself - what it swept, what the model's own scale was, how long it took.
 *
 * AND IT IS BAKED INTO THE BUNDLE. A browser has no filesystem, so `RENDER.ts` inlines a
 * `.f32` through esbuild's binary loader and the panel gets bytes. The same file read from
 * node gives the same numbers; there is one artefact and two readers.
 */

import { existsSync, readFileSync } from "node:fs";

/** what a measurement says about itself - free-form, and the header a reader gets first */
export type Header = {
  /** what was measured, in words */
  what: string;
  /** the columns, in the order they were written */
  columns: string[];
  /** how many rows each column has */
  rows: number;
  /** and anything the measurement wants to carry - scales, sweeps, counts */
  [key: string]: unknown;
};

export type Measured = { header: Header; columns: Record<string, Float32Array> };

/**
 * AND WHERE A PANEL GETS ONE — the same call from node and from a browser.
 *
 * `RENDER.ts` puts what `MEASURE.ts` wrote into the page before the bundle runs, so in a
 * browser this is already in hand. From node - a test, a table, a check that the picture and
 * the numbers agree - it comes off disk. ONE ARTEFACT, TWO READERS, and a panel that does not
 * know or care which one it is talking to.
 *
 * IMPORTING THE FILE DIRECTLY DOES NOT WORK, which is why this exists: the renderer builds its
 * registry by importing every visual in NODE, and node has no loader for a raw field. A panel
 * that imported one could be bundled and could not be listed.
 */
export const measured = (name: string): Measured => {
  const baked = (globalThis as any).__measured?.[name];
  if (baked) return read(baked.bytes, baked.header);
  /* off disk, which is the node side - the renderer builds its registry by importing every
   * visual here before it ever opens a browser, so this path is not optional */
  const dir = `${import.meta.dirname}/../../../../visuals/${name}`;
  if (existsSync(`${dir}/field.f32`) && existsSync(`${dir}/meta.json`)) {
    const bytes = readFileSync(`${dir}/field.f32`);
    return read(new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength),
      JSON.parse(readFileSync(`${dir}/meta.json`, "utf8")));
  }
  throw new Error(
    `${name} has not been measured - run \`npm run measure\` and render again`);
};

/**
 * BYTES AND A HEADER, READ BACK AS NAMED COLUMNS — the browser side, and the only side a
 * panel needs. The bytes arrive inlined by the bundler; nothing here touches a file.
 *
 * COPIED RATHER THAN VIEWED, because a bundled `Uint8Array` is not promised to start at an
 * eight-byte boundary and a `Float32Array` view over an odd offset throws. The arrays are
 * small next to the picture they draw.
 */
export const read = (bytes: Uint8Array, header: Header): Measured => {
  const all = new Float32Array(bytes.byteLength / 4);
  new Uint8Array(all.buffer).set(bytes);
  const columns: Record<string, Float32Array> = {};
  header.columns.forEach((name, i) => {
    columns[name] = all.subarray(i * header.rows, (i + 1) * header.rows);
  });
  return { header, columns };
};
