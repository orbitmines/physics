/**
 * THE MARKUP A PROOF IS WRITTEN IN, AND THE TWO WAYS OF SETTING IT.
 *
 * NO COMBINING CHARACTERS, NO UNICODE SUPERSCRIPTS, NO EM DASHES. A macron over an r
 * looks right on the machine it was written on and is a tofu box or a bare r with a
 * floating bar on a good number of phones; `r̄` is two code points pretending to be one
 * glyph and the pretence is what breaks. Unicode superscripts are worse, because there
 * is no complete set of them - `⁽ᴰ⁻¹⁾` does not exist, so an exponent written that way
 * silently degrades to whatever the font happens to have. So a proof emits ASCII markup
 * and the renderer sets it properly, in a `<Bar>`, a `<Sup>`, a `<Sub>`.
 *
 * TWO RENDERERS, ONE MARKUP. `html` writes a standalone page that needs no build; `jsx`
 * writes a component against the article's own notation. They must agree, which is why
 * they are in one file reading one parser rather than two files each with their own idea
 * of what `^{D-1}` means.
 */
import { REFERENCES } from "./references.ts";

/**
 * ONE PIECE OF A LINE.
 *
 * `text` is set as it stands; the rest carry their own contents, which are parsed in
 * turn - an exponent may itself hold a count, and `\bar{r}^{D-1}` is a bar and a
 * superscript standing side by side rather than one inside the other.
 */
export type Piece =
  | { kind: "text"; text: string }
  /** a quantity - leans, as a variable does */
  | { kind: "var"; of: Piece[] }
  /** one of the lattice's own counts - upright and coloured */
  | { kind: "count"; of: Piece[] }
  | { kind: "bar"; of: Piece[] }
  | { kind: "sup"; of: Piece[] }
  | { kind: "sub"; of: Piece[] }
  | { kind: "ref"; key: string };

/** the counts a lattice fixes, which are set apart from the quantities that vary */
const COUNTS = new Set(["D", "DEG", "LIGHT", "BIAS"]);

const TOKEN = /\\bar\{([^{}]*)\}|\^\{([^{}]*)\}|\^([A-Za-z0-9]+)|_\{([^{}]*)\}|_([A-Za-z0-9]+)|\[\[([a-z0-9-]+)\]\]/g;

/**
 * THE PIECES OF A LINE, in the order they are set.
 *
 * Plain runs between the markers are split further into counts and everything else, so
 * a `D` standing in a sentence of arithmetic comes out coloured without anyone having
 * had to wrap it - which matters because the whole claim of the generated proofs is that
 * the exponent is one of the model's own counts, and a reader should be able to SEE that
 * rather than be told it.
 */
export const parse = (s: string): Piece[] => {
  const out: Piece[] = [];
  let at = 0;
  for (const m of s.matchAll(TOKEN)) {
    if (m.index! > at) out.push(...plain(s.slice(at, m.index!)));
    const [, bar, supB, supP, subB, subP, ref] = m;
    if (bar !== undefined) out.push({ kind: "bar", of: parse(bar) });
    else if (supB !== undefined) out.push({ kind: "sup", of: parse(supB) });
    else if (supP !== undefined) out.push({ kind: "sup", of: parse(supP) });
    else if (subB !== undefined) out.push({ kind: "sub", of: parse(subB) });
    else if (subP !== undefined) out.push({ kind: "sub", of: parse(subP) });
    else if (ref !== undefined) out.push({ kind: "ref", key: ref });
    at = m.index! + m[0].length;
  }
  if (at < s.length) out.push(...plain(s.slice(at)));
  return out;
};

/** a run with no markup in it, with the lattice's counts picked out of it */
const plain = (s: string): Piece[] => {
  const out: Piece[] = [];
  let buf = "";
  for (const w of s.split(/([A-Za-z]+)/)) {
    if (COUNTS.has(w)) {
      if (buf) { out.push({ kind: "text", text: buf }); buf = ""; }
      out.push({ kind: "count", of: [{ kind: "text", text: w }] });
    } else buf += w;
  }
  if (buf) out.push({ kind: "text", text: buf });
  return out;
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** set as standalone HTML - the classes are defined in `notation.css` */
export const html = (s: string): string => set(parse(s), {
  text: t => esc(t),
  var: c => `<i>${c}</i>`,
  count: c => `<b class="k">${c}</b>`,
  bar: c => `<span class="bar">${c}</span>`,
  sup: c => `<sup>${c}</sup>`,
  sub: c => `<sub>${c}</sub>`,
  ref: k => {
    const r = REFERENCES[k];
    if (!r) return `[${esc(k)}]`;
    const label = esc(r.short);
    return r.link
      ? `<a class="ref" href="${r.link}" target="_blank" rel="noreferrer" title="${esc(r.says)}">${label}</a>`
      : `<span class="ref" title="${esc(r.says)}">${label}</span>`;
  },
});

/**
 * SET AS JSX, against the article's own components.
 *
 * Braces are escaped because a line of arithmetic may contain one and JSX would read it
 * as an expression - which is a build error in a generated file, discovered by whoever
 * imports it rather than by whoever wrote it.
 */
export const jsx = (s: string): string => set(parse(s), {
  text: t => t.replace(/[{}]/g, m => `{'${m}'}`),
  var: c => `<V>${c}</V>`,
  count: c => `<K>${c}</K>`,
  bar: c => `<Bar>${c}</Bar>`,
  sup: c => `<Sup>${c}</Sup>`,
  sub: c => `<Sub>${c}</Sub>`,
  ref: k => `<Reference of="${k}" />`,
});

type Setter = {
  text(t: string): string;
  var(c: string): string;
  count(c: string): string;
  bar(c: string): string;
  sup(c: string): string;
  sub(c: string): string;
  ref(k: string): string;
};

const set = (pieces: Piece[], w: Setter): string =>
  pieces.map(p => {
    switch (p.kind) {
      case "text": return w.text(p.text);
      case "var": return w.var(set(p.of, w));
      case "count": return w.count(set(p.of, w));
      case "bar": return w.bar(set(p.of, w));
      case "sup": return w.sup(set(p.of, w));
      case "sub": return w.sub(set(p.of, w));
      case "ref": return w.ref(p.key);
    }
  }).join("");

/** the discrete radius, as it is written everywhere in this repository */
export const RBAR_MARKUP = "\\bar{r}";

/**
 * WHAT A LINE MUST NOT CONTAIN, checked rather than hoped for.
 *
 * The rule about combining characters is only worth anything if something enforces it,
 * and the place a stray macron gets in is a string literal in a rule that nobody looks
 * at again. So the emitter runs this over every line it is about to write, and a
 * violation stops the build rather than reaching a phone.
 */
export const BANNED = [
  { re: /[̀-ͯ]/, why: "a combining diacritic - write \\bar{x} instead" },
  { re: /[⁰-₟]/, why: "a unicode super/subscript - write ^{...} or _{...}" },
  { re: /[—–]/, why: "an em or en dash - write a plain hyphen" },
  { re: /−/, why: "a unicode minus - write a plain hyphen" },
];

export const check = (line: string, where: string) => {
  for (const b of BANNED)
    if (b.re.test(line)) throw new Error(
      `${where} contains ${b.why}: ${JSON.stringify(line)}`);
  return line;
};
