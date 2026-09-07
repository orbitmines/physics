/**
 * THE RENDERED VISUALS, INTO THE PACKAGE — so that a page which depends on `@orbitmines/physics`
 * gets the pictures with the theory rather than having to render them itself.
 *
 * `RENDER.ts` writes films into `visuals/<id>/` at the repository's top level, beside the
 * fields they were drawn from, which is where they belong for reading and checking. A CONSUMER
 * CANNOT REACH THEM THERE: `files` in the manifest is what npm ships, the top level is outside
 * it, and a package that tells a reader to go and clone the repository has not shipped
 * anything. So this NAMES what is in `visuals/` and writes the map
 *
 * AND IT DOES NOT COPY. It used to duplicate every rendered film into `src/visuals/film/`, and
 * a copy is a second thing that can be stale: render, forget to run this, and the package ships
 * yesterday's picture beside today's recording with nothing to say which is which. There is one
 * directory a visual is rendered into and it is the one that is shipped, so a film cannot be
 * out of step with the run that made it.
 * that names it.
 *
 * AS FILES, NOT AS BASE64. Five megabytes of media is seven of text, and the text is parsed on
 * every load, decoded on every mount, and held twice in memory. `new URL(..., import.meta.url)`
 * is what a bundler resolves an asset by - Turbopack, Vite and webpack all understand it - so
 * the map below is a static one of those per film and the bytes stay bytes.
 *
 * AND THE MAP IS GENERATED RATHER THAN WRITTEN, because a `new URL` with a name in a variable
 * is not something a bundler can follow. Every entry has to be spelled out; spelling them out
 * by hand is how one gets forgotten.
 */
import { existsSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const HERE = import.meta.dirname;
const OLD = resolve(`${HERE}/../src/visuals/film`);
const FROM = resolve(`${HERE}/../visuals`);

/* what a film is made of, and what is worth carrying: the animation and its first frame */
const PARTS = [["animation.webm", "webm"], ["snapshot.png", "poster"]] as const;

const only = process.argv.slice(2);
const want = (id: string) => !only.length || only.some(o => id.includes(o));

console.log(`\n═════ films → naming ${FROM} ═════\n`);

/* the old copies, if any are still lying about from when this duplicated them */
if (existsSync(OLD)) rmSync(OLD, { recursive: true });

const rows: string[] = [];
let bytes = 0;
for (const id of readdirSync(FROM).sort()) {
  if (!want(id)) continue;
  const have = PARTS.filter(([f]) => existsSync(`${FROM}/${id}/${f}`));
  if (!have.length) continue;
  const fields: string[] = [];
  for (const [file, name] of have) {
    bytes += statSync(`${FROM}/${id}/${file}`).size;
    fields.push(`    ${name}: new URL("../../visuals/${id}/${file}", import.meta.url).href`);
  }
  rows.push(`  ${JSON.stringify(id)}: {\n${fields.join(",\n")},\n  }`);
  console.log(`  ${id.padEnd(24)} ${have.map(h => h[1]).join(" + ")}`);
}

writeFileSync(`${resolve(`${HERE}/../src/visuals`)}/FILM.ts`, `/**
 * GENERATED - do not edit. Rebuild with \`npm run film\`.
 *
 * WHERE EACH RENDERED VISUAL IS, as something a bundler can resolve. \`new URL(...,
 * import.meta.url)\` is the one way to name an asset from inside a package that ships no build
 * step, and it only works where the path is written out - which is why this file is generated
 * rather than a loop over a directory.
 */
export type Film = { webm?: string; poster?: string };

export const FILM: Record<string, Film> = {
${rows.join(",\n")},
};
`);

console.log(`\n  ${rows.length} films · \`FILM\` names them, and \`files\` ships them\n`);
