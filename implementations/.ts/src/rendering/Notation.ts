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
  | { kind: "ref"; key: string }
  /** a function's name - `shell`, `met`, `ball`. Something derived, so coloured as such */
  | { kind: "fn"; of: Piece[] }
  /**
   * SET BACK RATHER THAN PICKED OUT - the `l.` of a local's field.
   *
   * `l.contained` names one thing, and the half that carries the meaning is the field. The
   * `l.` is only saying whose field it is, so it is muted: present enough to read, quiet
   * enough that the eye goes to the name. Coloured like a derived quantity it competed with
   * the field beside it and the pair read as two things rather than one.
   */
  | { kind: "muted"; of: Piece[] }
  /** an integral sign carrying its two limits */
  | { kind: "int"; from: Piece[]; to: Piece[] }
  /** a summation sign, the same */
  | { kind: "sum"; from: Piece[]; to: Piece[] }
  /** a built-up fraction - a numerator over a denominator with a rule between */
  | { kind: "frac"; over: Piece[]; under: Piece[] }
  /**
   * A BRACKET THAT GROWS WITH WHAT IS INSIDE IT.
   *
   * A typed `(` is one line tall whatever it encloses, so around a fraction it sits beside
   * the numerator and the denominator hangs below it - which reads as a bracket that has
   * come loose rather than as one holding anything. Drawn instead, it takes the height of
   * its contents, which is what a bracket in set mathematics does.
   */
  | { kind: "paren"; of: Piece[] };

/** the counts a lattice fixes, which are set apart from the quantities that vary */
const COUNTS = new Set(["D", "DEG", "SHEET", "CYCLE", "STEP", "LIGHT"]);

/**
 * THE COUNTS THAT ARE WRITTEN WITH A BAR OVER THEM.
 *
 * c̄ is one of the lattice's own numbers - a step, one cell a tick - and belongs in the
 * same colour as DEG and SHEET. Written `\bar{c}` it was arriving as a bar around a
 * plain letter and coming out in the ink colour, so the one constant that appears in
 * nearly every line was the one constant that did not look like one.
 */
const BARRED_COUNTS = new Set(["c"]);

/**
 * COMMANDS THAT ARE JUST A CHARACTER.
 *
 * `\perp` is a symbol and not a construction - it takes no arguments and needs no
 * layout, only the right glyph. Written without an entry here it fell through the scanner
 * and printed as its own source in the middle of the gravitational law.
 */
const GLYPHS: Record<string, string> = {
  perp: "\u22a5", cdot: "\u00b7", times: "\u00d7", approx: "\u2248",
  propto: "\u221d", infty: "\u221e", ll: "\u226a", gg: "\u226b",
  le: "\u2264", ge: "\u2265", pm: "\u00b1", to: "\u2192",
};

/**
 * THE PIECES OF A LINE, in the order they are set.
 *
 * Plain runs between the markers are split further into counts and everything else, so
 * a `D` standing in a sentence of arithmetic comes out coloured without anyone having
 * had to wrap it - which matters because the whole claim of the generated proofs is that
 * the exponent is one of the model's own counts, and a reader should be able to SEE that
 * rather than be told it.
 */
export const parse = (src: string): Piece[] => {
  const out: Piece[] = [];
  let plainFrom = 0, i = 0;

  const flush = (upto: number) => {
    if (upto > plainFrom) out.push(...plain(src.slice(plainFrom, upto)));
  };

  /**
   * THE CONTENTS OF A `{...}`, COUNTING BRACES.
   *
   * This replaced a regular expression, and the reason is the outermost fraction on the
   * `share.coherence` page: `\frac{\int_{0}^{π} \frac{ψ}{π} dψ}{π}`. Its numerator
   * contains braces of its own, so a pattern matching `\{[^{}]*\}` stops at the first
   * inner `}` and the whole construction falls back to being printed as source. Nested
   * markup is the normal case rather than an edge one - an integral of a fraction is the
   * commonest thing in these derivations - so the reader counts.
   */
  const braced = (at: number): { body: string; end: number } | undefined => {
    if (src[at] !== "{") return undefined;
    let depth = 0;
    for (let k = at; k < src.length; k++) {
      if (src[k] === "{") depth++;
      else if (src[k] === "}" && --depth === 0)
        return { body: src.slice(at + 1, k), end: k + 1 };
    }
    return undefined;
  };

  /** a command's braced arguments in order, or nothing if any of them is unterminated */
  const args = (at: number, n: number, between: string[] = []) => {
    const got: string[] = [];
    let k = at;
    for (let a = 0; a < n; a++) {
      const want = between[a] ?? "";
      if (want && src.slice(k, k + want.length) !== want) return undefined;
      k += want.length;
      const b = braced(k);
      if (!b) return undefined;
      got.push(b.body);
      k = b.end;
    }
    return { got, end: k };
  };

  while (i < src.length) {
    if (src[i] === "\\") {
      const rest = src.slice(i);
      const bar = rest.startsWith("\\bar") && args(i + 4, 1);
      const frac = rest.startsWith("\\frac") && args(i + 5, 2);
      const paren = rest.startsWith("\\paren") && args(i + 6, 1);
      /*
       * A LIMIT MAY BE MISSING, and one was. `\sum_{r̄}` - a sum over every shell, with
       * no top to it - needs only the lower one, and a reader requiring both let that
       * fall through and print as its own source on the index page. Both limits are tried
       * first, then the lower alone.
       */
      const int = rest.startsWith("\\int") &&
        (args(i + 4, 2, ["_", "^"]) || args(i + 4, 1, ["_"]));
      const sum = rest.startsWith("\\sum") &&
        (args(i + 4, 2, ["_", "^"]) || args(i + 4, 1, ["_"]));
      /* a bare glyph command - no arguments, just the character it stands for */
      const glyph = /^\\([a-z]+)/.exec(rest);
      if (glyph && GLYPHS[glyph[1]] && !rest.startsWith("\\bar") &&
          !rest.startsWith("\\frac") && !rest.startsWith("\\paren") &&
          !rest.startsWith("\\int") && !rest.startsWith("\\sum")) {
        flush(i);
        out.push({ kind: "text", text: GLYPHS[glyph[1]] });
        i = plainFrom = i + glyph[0].length;
        continue;
      }
      const hit = bar || frac || paren || int || sum;
      if (hit) {
        flush(i);
        if (bar) {
          /* a barred lattice count is still a lattice count - see BARRED_COUNTS */
          const inner: Piece = { kind: "bar", of: parse(hit.got[0]) };
          out.push(BARRED_COUNTS.has(hit.got[0])
            ? { kind: "count", of: [inner] } : inner);
        }
        else if (frac)
          out.push({ kind: "frac", over: parse(hit.got[0]), under: parse(hit.got[1]) });
        else if (paren) out.push({ kind: "paren", of: parse(hit.got[0]) });
        else if (int)
          out.push({ kind: "int", from: parse(hit.got[0]), to: parse(hit.got[1] ?? "") });
        else out.push({ kind: "sum", from: parse(hit.got[0]), to: parse(hit.got[1] ?? "") });
        i = plainFrom = hit.end;
        continue;
      }
    }
    if (src[i] === "^" || src[i] === "_") {
      const kind = src[i] === "^" ? "sup" : "sub";
      const b = braced(i + 1);
      if (b) {
        flush(i);
        out.push({ kind, of: parse(b.body) });
        i = plainFrom = b.end;
        continue;
      }
      const bare = /^[A-Za-z0-9]+/.exec(src.slice(i + 1));
      if (bare) {
        flush(i);
        out.push({ kind, of: parse(bare[0]) });
        i = plainFrom = i + 1 + bare[0].length;
        continue;
      }
    }
    if (src[i] === "[" && src[i + 1] === "[") {
      const close = src.indexOf("]]", i);
      const key = close > 0 ? src.slice(i + 2, close) : "";
      if (close > 0 && /^[a-z0-9-]+$/.test(key)) {
        flush(i);
        out.push({ kind: "ref", key });
        i = plainFrom = close + 2;
        continue;
      }
    }
    i++;
  }
  flush(src.length);
  return out;
};

/**
 * A RUN WITH NO MARKUP IN IT, with the counts and the function names picked out.
 *
 * Two kinds of word are set apart from the rest, and both for the same reason: a reader
 * should be able to see WHAT SORT of thing each symbol is without being told. One of the
 * lattice's own counts is upright and coloured, because the whole claim of these proofs
 * is that the constants are counted rather than fitted. A function's name - anything
 * standing immediately before an opening bracket - is coloured as something derived,
 * because `shell(r̄)` and `met(R)` are quantities this repository worked out rather than
 * symbols it was handed.
 */
const plain = (s: string): Piece[] => {
  const out: Piece[] = [];
  let buf = "";
  const flush = () => { if (buf) { out.push({ kind: "text", text: buf }); buf = ""; } };
  /* split keeping the separators, so a word can be tested against what follows it */
  const bits = s.split(/([A-Za-z_][A-Za-z0-9_]*)/);
  for (let i = 0; i < bits.length; i++) {
    const w = bits[i];
    if (!w) continue;
    if (COUNTS.has(w)) {
      flush();
      out.push({ kind: "count", of: [{ kind: "text", text: w }] });
      continue;
    }
    /*
     * A FIELD OF A LOCAL - `l.contained`, `l.source`, `l.rays`.
     *
     * The two halves are different kinds of thing and are set as such: `l.` is the point
     * being read, which is the article's dark reader, and what follows it is one of the
     * lattice's own names, which is a count. Left as plain text the whole thing leans like
     * a variable, which is what it is least - a quantity that varies is exactly what a
     * field of a named local is not.
     */
    if (w === "l" && (bits[i + 1] ?? "") === "." && /^[A-Za-z_]/.test(bits[i + 2] ?? "")) {
      flush();
      out.push({ kind: "muted", of: [{ kind: "text", text: "l." }] });
      out.push({ kind: "count", of: [{ kind: "text", text: bits[i + 2] }] });
      i += 2;
      continue;
    }
    /* a name immediately before a bracket is a function being applied */
    if (/^[A-Za-z_]/.test(w) && (bits[i + 1] ?? "").startsWith("(")) {
      flush();
      out.push({ kind: "fn", of: [{ kind: "text", text: w }] });
      continue;
    }
    buf += w;
  }
  flush();
  return out;
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** set as standalone HTML - the classes are defined in `notation.css` */
export const html = (s: string): string => set(parse(s), {
  text: t => esc(t),
  var: c => `<i>${c}</i>`,
  count: c => `<b class="k">${c}</b>`,
  fn: c => `<b class="d">${c}</b>`,
  muted: c => `<span class="mu">${c}</span>`,
  bar: c => `<span class="bar">${c}</span>`,
  sup: c => `<sup>${c}</sup>`,
  sub: c => `<sub>${c}</sub>`,
  int: (lo, hi) => `<span class="big"><span class="sign">&#8747;</span>` +
    `<span class="lim"><sup>${hi}</sup><sub>${lo}</sub></span></span>`,
  sum: (lo, hi) => `<span class="big"><span class="sign">&#8721;</span>` +
    `<span class="lim"><sup>${hi}</sup><sub>${lo}</sub></span></span>`,
  frac: (o, u) => `<span class="frac"><span class="o">${o}</span>` +
    `<span class="u">${u}</span></span>`,
  paren: c => `<span class="paren">${c}</span>`,
  ref: k => {
    const r = REFERENCES[k];
    if (!r) return `[${esc(k)}]`;
    const label = esc(r.short);
    return r.link
      ? `<a class="ref" href="${r.link}" target="_blank" rel="noreferrer" title="${esc(r.says)}">${label}</a>`
      : `<span class="ref" title="${esc(r.says)}">${label}</span>`;
  },
});

/*
 * THERE WAS A JSX RENDERER HERE and it is gone with the `.tsx` output it existed for.
 * What a consumer gets now is the parsed `Piece[]` and maps it onto whatever it draws
 * with - see the note at the top of this file. Keeping a half-used second renderer was a
 * second place for the two to disagree about what `^{D-1}` means.
 */

type Setter = {
  text(t: string): string;
  var(c: string): string;
  count(c: string): string;
  fn(c: string): string;
  muted(c: string): string;
  bar(c: string): string;
  sup(c: string): string;
  sub(c: string): string;
  int(lo: string, hi: string): string;
  sum(lo: string, hi: string): string;
  frac(over: string, under: string): string;
  paren(c: string): string;
  ref(k: string): string;
};

const set = (pieces: Piece[], w: Setter): string =>
  pieces.map(p => {
    switch (p.kind) {
      case "text": return w.text(p.text);
      case "var": return w.var(set(p.of, w));
      case "count": return w.count(set(p.of, w));
      case "fn": return w.fn(set(p.of, w));
      case "muted": return w.muted(set(p.of, w));
      case "bar": return w.bar(set(p.of, w));
      case "sup": return w.sup(set(p.of, w));
      case "sub": return w.sub(set(p.of, w));
      case "int": return w.int(set(p.from, w), set(p.to, w));
      case "sum": return w.sum(set(p.from, w), set(p.to, w));
      case "frac": return w.frac(set(p.over, w), set(p.under, w));
      case "paren": return w.paren(set(p.of, w));
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
