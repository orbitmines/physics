/**
 * COLUMNS AND A HEADER — the one artefact this repository writes numbers into, and the one
 * reader that gets them back, from node or from a browser.
 *
 * A PANEL THAT COMPUTES ITS OWN PHYSICS IS A PANEL NOBODY ITERATES ON. Closing the rules,
 * solving the balances and summing a galaxy takes minutes; changing a colour takes seconds,
 * and tying the two together means every colour costs minutes. Worse, it hides what the
 * picture is made of: a reader cannot check a number that only ever existed inside a canvas.
 *
 * SO MEASURING AND DRAWING ARE SPLIT. `tools/MEASURE.ts` runs the model and writes what it
 * found; `tools/CATALOGUE.ts` fetches what other people measured and writes that; a panel
 * imports and draws. The numbers are on disk, in the open, and the same file can be read by a
 * test, a table, or a different picture entirely.
 *
 * THE FORMAT IS COLUMNS OF `Float32` PLUS A JSON HEADER. Raw, so it costs nothing to read;
 * named, so nothing has to remember what column three was; and with the header carrying
 * whatever the file wants to say about itself — what was swept, what the model's scale was,
 * or, for a borrowed catalogue, which paper and which URL it came out of.
 *
 * AND MEASURED AND BORROWED ARE THE SAME KIND OF THING. `visuals/` holds what this model
 * worked out, `data/` holds what was borrowed from the people who observed it; both are named
 * columns with a header saying where they came from, and a panel holding one does not have to
 * care which. What it must never do is confuse them, which is why the header of every
 * borrowed file names its source and every panel that draws one says `(borrowed)`.
 *
 * THIS LIVES IN `lib` AND NOT IN `visuals` because `Sparc.ts` reads a catalogue and `Sparc.ts`
 * is not a picture. Core reaching into `visuals/` for a file reader is exactly the direction
 * of dependency this folder exists to keep out.
 */

import { existsSync, readFileSync } from "node:fs";

/** what a file says about itself — free-form, and the header a reader gets first */
export type Header = {
  /** what it holds, in words */
  what: string;
  /** the columns, in the order they were written */
  columns: string[];
  /** how many rows each column has */
  rows: number;
  /** and anything else it wants to carry — scales, sweeps, counts, sources, names */
  [key: string]: unknown;
};

export type Measured = { header: Header; columns: Record<string, Float32Array> };

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

/** where the two kinds live, relative to the repository root */
const ROOTS = ["visuals", "data"];

/**
 * AND WHERE A READER GETS ONE — the same call from node and from a browser.
 *
 * `RENDER.ts` puts everything on disk into the page before the bundle runs, so in a browser
 * this is already in hand. From node — a test, a table, a check that the picture and the
 * numbers agree — it comes off disk. ONE ARTEFACT, TWO READERS, and nothing that reads one
 * has to know or care which side it is on.
 *
 * IMPORTING THE FILE DIRECTLY DOES NOT WORK, which is why this exists: the renderer builds
 * its registry by importing every visual in NODE, and node has no loader for a raw field. A
 * panel that imported one could be bundled and could not be listed.
 */
export const measured = (name: string): Measured => {
  const baked = (globalThis as any).__measured?.[name];
  if (baked) return read(baked.bytes, baked.header);
  /*
   * AND A RECORDING LIVES BESIDE THE FILM IT IS OF, under `<id>/frames.*` rather than in a
   * directory of its own. `<id>.frames` is what a panel asks for and this is where it looks -
   * the same named columns and the same header, so nothing downstream knows the difference.
   */
  const frames = name.endsWith(".frames");
  const id = frames ? name.slice(0, -".frames".length) : name;
  const stem = frames ? "frames" : "field", meta = frames ? "frames" : "meta";
  for (const root of ROOTS) {
    const dir = `${import.meta.dirname}/../../../../${root}/${id}`;
    if (existsSync(`${dir}/${stem}.f32`) && existsSync(`${dir}/${meta}.json`)) {
      const bytes = readFileSync(`${dir}/${stem}.f32`);
      return read(new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength),
        JSON.parse(readFileSync(`${dir}/${meta}.json`, "utf8")));
    }
  }
  throw new Error(
    `${name} is not on disk — run \`npm run measure\` (a model field) or ` +
    `\`npm run catalogue\` (a borrowed one) and try again`);
};
