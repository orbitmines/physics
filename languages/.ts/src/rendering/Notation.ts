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
  /**
   * THE OTHER ACCENTS, DRAWN THE SAME WAY THE BAR IS.
   *
   * `\hat{d}` is a direction and appears in nearly every line of the vacuum equation; a
   * combining circumflex is banned here for the reason at the top of this file, so the
   * accent is a mark the stylesheet sets over the box rather than a code point glued to
   * the letter. Same construction as `bar`, one per mark.
   */
  | { kind: "hat"; of: Piece[] }
  | { kind: "tilde"; of: Piece[] }
  | { kind: "vec"; of: Piece[] }
  | { kind: "dot"; of: Piece[] }
  | { kind: "ddot"; of: Piece[] }
  /** words standing inside a formula - upright, and spaced as they were written */
  | { kind: "words"; text: string }
  /** `\mathbf`, `\mathcal`, `\mathbb` - a letter saying what SORT of object it names */
  | { kind: "bold"; of: Piece[] }
  | { kind: "cal"; of: Piece[] }
  | { kind: "bb"; of: Piece[] }
  /** a radical, with its vinculum over the whole of what is under it */
  | { kind: "sqrt"; of: Piece[] }
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
  /** and the other two big operators, which differ only in the sign that is drawn */
  | { kind: "prod"; from: Piece[]; to: Piece[] }
  | { kind: "oint"; from: Piece[]; to: Piece[] }
  /** a built-up fraction - a numerator over a denominator with a rule between */
  | { kind: "frac"; over: Piece[]; under: Piece[] }
  /**
   * A CHOICE - `\binom{n}{k}`, two things stacked in one bracket and no rule between them.
   *
   * Written as a fraction it reads as a division, which is a different quantity; written as
   * its own source it reads as nothing at all, which is what a proof carrying a count of
   * arrangements did until this was here.
   */
  | { kind: "binom"; over: Piece[]; under: Piece[] }
  /**
   * SOMETHING WITH A SCRIPT ON IT - and the script belongs to THAT and not to the line.
   *
   * `^{2}` was emitted as a SIBLING of whatever came before, so the stylesheet had nothing to
   * align it against but the line box. After a letter that is nearly right; after a bracket, a
   * fraction, a root or a sum it is wrong in a way that gets worse the taller the thing is -
   * the exponent of a bracket floated at the height of the tallest thing on the line, and a
   * subscript under a fraction sat below the fraction's own baseline.
   *
   * Attached, a base and its scripts are ONE box: the scripts stack beside it and are aligned
   * against its own top and bottom, whatever it turns out to be. That is one rule for every
   * base rather than a correction per shape, and it is also what keeps a line from breaking
   * between a thing and its own exponent.
   */
  | { kind: "scripted"; base: Piece; sup?: Piece[]; sub?: Piece[] }
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
 *
 * THE WHOLE ALPHABET IS HERE RATHER THAN THE LETTERS IN USE TODAY. Every one of these
 * was once absent, and the failure is silent in exactly the wrong way: a missing entry
 * does not stop the build, it prints `\Sigma` in the middle of a set equation and the
 * proof still publishes. Listing the alphabet once costs a table; listing it as it is
 * needed costs a reader a formula every time someone writes a rule.
 */
const GLYPHS: Record<string, string> = {
  /* the lower-case Greek, and the variant shapes of the letters that have them */
  alpha: "α", beta: "β", gamma: "γ", delta: "δ",
  epsilon: "ϵ", varepsilon: "ε", zeta: "ζ", eta: "η",
  theta: "θ", vartheta: "ϑ", iota: "ι", kappa: "κ",
  lambda: "λ", mu: "μ", nu: "ν", xi: "ξ",
  omicron: "ο", pi: "π", varpi: "ϖ", rho: "ρ",
  varrho: "ϱ", sigma: "σ", varsigma: "ς", tau: "τ",
  upsilon: "υ", phi: "ϕ", varphi: "φ", chi: "χ",
  psi: "ψ", omega: "ω",
  /* the upper-case Greek - only the letters that are not a Latin capital */
  Gamma: "Γ", Delta: "Δ", Theta: "Θ", Lambda: "Λ",
  Xi: "Ξ", Pi: "Π", Sigma: "Σ", Upsilon: "Υ",
  Phi: "Φ", Psi: "Ψ", Omega: "Ω",
  /* relations */
  le: "≤", leq: "≤", ge: "≥", geq: "≥",
  ne: "≠", neq: "≠", equiv: "≡", sim: "∼",
  simeq: "≃", approx: "≈", cong: "≅", propto: "∝",
  ll: "≪", gg: "≫", subset: "⊂", supset: "⊃",
  subseteq: "⊆", supseteq: "⊇", in: "∈", notin: "∉",
  ni: "∋", mid: "∣", parallel: "∥", perp: "⊥",
  /* operators */
  cdot: "·", times: "×", div: "÷", pm: "±",
  mp: "∓", ast: "∗", star: "⋆", circ: "∘",
  bullet: "∙", oplus: "⊕", ominus: "⊖", otimes: "⊗",
  odot: "⊙", cap: "∩", cup: "∪", setminus: "∖",
  wedge: "∧", vee: "∨",
  /* arrows */
  to: "→", rightarrow: "→", leftarrow: "←",
  leftrightarrow: "↔", Rightarrow: "⇒", Leftarrow: "⇐",
  Leftrightarrow: "⇔", mapsto: "↦", uparrow: "↑",
  downarrow: "↓",
  /* everything else a derivation reaches for */
  infty: "∞", partial: "∂", nabla: "∇", hbar: "ℏ",
  ell: "ℓ", forall: "∀", exists: "∃", neg: "¬",
  emptyset: "∅", varnothing: "∅", angle: "∠",
  degree: "°", prime: "′", dagger: "†",
  langle: "⟨", rangle: "⟩", lceil: "⌈", rceil: "⌉",
  lfloor: "⌊", rfloor: "⌋", Re: "ℜ", Im: "ℑ",
  aleph: "ℵ", cdots: "⋯", ldots: "…", vdots: "⋮",
  ddots: "⋱",
  /* the spaces, which are commands here for the same reason they are in TeX */
  quad: " ", qquad: "  ",
};

/**
 * THE ESCAPES THAT ARE NOT WORDS.
 *
 * `\,` is the thin space between a `c` and the `t` it multiplies, and `\{` is a brace
 * that means a SET rather than a group the parser should eat. Both are a backslash and
 * one character, so neither is found by a scanner looking for a command name - which is
 * how `c\,t` came to be set with its own markup showing.
 */
const ESCAPES: Record<string, string> = {
  ",": " ", ";": " ", ":": " ", "!": "", " ": " ",
  "{": "{", "}": "}", "_": "_", "%": "%", "&": "&", "#": "#", "$": "$",
};

/**
 * A COMMAND THAT WRAPS ONE BRACED ARGUMENT, and the piece it becomes.
 *
 * Read from a table rather than written out as a chain of `startsWith`, because the chain
 * is where a command goes missing: adding one meant adding a test, a branch and a line to
 * the switch below, and forgetting any of the three printed the source. Here a new accent
 * is one entry.
 */
const WRAPS: Record<string, "bar" | "hat" | "tilde" | "vec" | "dot" | "ddot" |
  "bold" | "cal" | "bb" | "sqrt" | "paren"> = {
  bar: "bar", overline: "bar", hat: "hat", widehat: "hat",
  tilde: "tilde", widetilde: "tilde", vec: "vec", dot: "dot", ddot: "ddot",
  mathbf: "bold", boldsymbol: "bold", mathcal: "cal", mathbb: "bb",
  sqrt: "sqrt", paren: "paren",
};

/** the commands whose one argument is WORDS and must not be read as mathematics */
const WORDS = new Set(["text", "textrm", "mathrm", "operatorname", "mbox"]);

/**
 * THE NAMED OPERATORS - `cos`, `max`, `log`.
 *
 * Upright, and coloured as something derived, which is what `plain` already does for a
 * name standing before a bracket. `\max(0, 1-rho)` was reaching that rule as the literal
 * text `\max` and so came out as source with a backslash on it.
 */
const OPS = new Set([
  "sin", "cos", "tan", "sec", "csc", "cot", "arcsin", "arccos", "arctan",
  "sinh", "cosh", "tanh", "exp", "log", "ln", "lg", "min", "max", "det",
  "dim", "ker", "deg", "gcd", "arg", "tr", "lim", "sup", "inf", "mod",
]);

/** the big operators, each one a sign with room at its corners for two limits */
const BIGS = new Set(["int", "oint", "sum", "prod"]);

/** the commands that build something, and so must not be read as a bare glyph */
const BUILDS = new Set([
  ...Object.keys(WRAPS), ...WORDS, ...BIGS, "frac", "binom",
]);

/**
 * THE PIECES OF A LINE, in the order they are set.
 *
 * Plain runs between the markers are split further into counts and everything else, so
 * a `D` standing in a sentence of arithmetic comes out coloured without anyone having
 * had to wrap it - which matters because the whole claim of the generated proofs is that
 * the exponent is one of the model's own counts, and a reader should be able to SEE that
 * rather than be told it.
 */
/**
 * A SCRIPT PUT ON WHATEVER IT FOLLOWS.
 *
 * The last piece is the base, and if that piece is a run of text the base is its LAST CHARACTER
 * - `2R^{3}` is two times R cubed and not `(2R)` cubed. Where there is nothing before it at all
 * the script stands alone, which is what a line beginning with one means.
 */
const attach = (out: Piece[], kind: "sup" | "sub", of: Piece[]) => {
  const last = out[out.length - 1];
  if (!last) { out.push({ kind, of }); return; }
  /* a script already on this base joins it rather than replacing it */
  if (last.kind === "scripted" && !last[kind]) { last[kind] = of; return; }
  if (last.kind === "text") {
    const t = last.text;
    if (!t.length) { out.push({ kind, of }); return; }
    const head = t.slice(0, -1), tail = t.slice(-1);
    if (head) last.text = head; else out.pop();
    out.push({ kind: "scripted", base: { kind: "text", text: tail }, [kind]: of });
    return;
  }
  out.pop();
  out.push({ kind: "scripted", base: last, [kind]: of });
};

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
      const word = /^\\([a-zA-Z]+)/.exec(src.slice(i));
      const name = word?.[1] ?? "";
      const after = i + (word?.[0].length ?? 0);
      /*
       * A LIMIT MAY BE MISSING, AND SO MAY BOTH. `\sum_{\bar{r}}` - a sum over every
       * shell, with no top to it - needs only the lower one, and a reader requiring both
       * let that fall through and print as its own source on the index page. `\int
       * K(...)d\hat{d}'` has neither, because the range it runs over is every direction
       * and there is nothing else it could be. Both limits are tried, then the lower
       * alone, then the bare sign.
       */
      const big = BIGS.has(name) &&
        (args(after, 2, ["_", "^"]) || args(after, 1, ["_"]) ||
          { got: [] as string[], end: after });
      const frac = (name === "frac" || name === "binom") && args(after, 2);
      const wrap = WRAPS[name] && args(after, 1);
      const words = WORDS.has(name) && args(after, 1);
      const hit = big || frac || wrap || words;
      if (hit) {
        flush(i);
        if (frac)
          out.push({ kind: name === "binom" ? "binom" : "frac",
            over: parse(hit.got[0]), under: parse(hit.got[1]) });
        else if (wrap) {
          const of = parse(hit.got[0]);
          /* a barred lattice count is still a lattice count - see BARRED_COUNTS */
          out.push(WRAPS[name] === "bar" && BARRED_COUNTS.has(hit.got[0])
            ? { kind: "count", of: [{ kind: "bar", of }] }
            : { kind: WRAPS[name], of });
        }
        /*
         * WORDS ARE NOT READ AS MATHEMATICS. `\text{ is the only term that is not a
         * rule}` parsed as a formula loses its spaces to the browser and picks a `D` out
         * of a sentence as though it were the dimension. What is inside is a string.
         */
        else if (words) out.push({ kind: "words", text: hit.got[0] });
        else out.push({
          kind: name as "int" | "oint" | "sum" | "prod",
          from: parse(hit.got[0] ?? ""), to: parse(hit.got[1] ?? ""),
        });
        i = plainFrom = hit.end;
        continue;
      }
      /* a named operator - `\cos`, `\max` - which is a function and set as one */
      if (word && OPS.has(name)) {
        flush(i);
        out.push({ kind: "fn", of: [{ kind: "text", text: name }] });
        i = plainFrom = after;
        continue;
      }
      /* a bare glyph command - no arguments, just the character it stands for */
      if (word && GLYPHS[name] && !BUILDS.has(name)) {
        flush(i);
        out.push({ kind: "text", text: GLYPHS[name] });
        i = plainFrom = after;
        continue;
      }
      /* a backslash and one character - a thin space, a literal brace */
      const one = ESCAPES[src[i + 1] ?? ""];
      if (!word && one !== undefined) {
        flush(i);
        if (one) out.push({ kind: "text", text: one });
        i = plainFrom = i + 2;
        continue;
      }
    }
    if (src[i] === "^" || src[i] === "_") {
      const kind = src[i] === "^" ? "sup" : "sub";
      const b = braced(i + 1);
      if (b) {
        flush(i);
        attach(out, kind, parse(b.body));
        i = plainFrom = b.end;
        continue;
      }
      const bare = /^[A-Za-z0-9]+/.exec(src.slice(i + 1));
      if (bare) {
        flush(i);
        attach(out, kind, parse(bare[0]));
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

/**
 * A BIG OPERATOR, AND ITS LIMITS ONLY IF IT HAS ANY.
 *
 * An empty limit column is not nothing: it is an inline-flex child that still takes its
 * margin, so a bare integral sign came out shunted off the letter it integrates. If there
 * are no limits, only the sign is set.
 */
const big = (sign: string, lo: string, hi: string) =>
  `<span class="big"><span class="sign">${sign}</span>` +
  (lo || hi ? `<span class="lim"><sup>${hi}</sup><sub>${lo}</sub></span>` : "") +
  `</span>`;

/** set as standalone HTML - the classes are defined in `notation.css` */
export const html = (s: string): string => set(parse(s), {
  text: t => esc(t),
  var: c => `<i>${c}</i>`,
  count: c => `<b class="k">${c}</b>`,
  fn: c => `<b class="d">${c}</b>`,
  muted: c => `<span class="mu">${c}</span>`,
  bar: c => `<span class="bar">${c}</span>`,
  hat: c => `<span class="acc hat">${c}</span>`,
  tilde: c => `<span class="acc tld">${c}</span>`,
  vec: c => `<span class="acc vec">${c}</span>`,
  dot: c => `<span class="acc dot">${c}</span>`,
  ddot: c => `<span class="acc ddot">${c}</span>`,
  words: t => `<span class="tx">${esc(t)}</span>`,
  bold: c => `<b class="bf">${c}</b>`,
  cal: c => `<span class="cal">${c}</span>`,
  bb: c => `<span class="bb">${c}</span>`,
  sqrt: c => `<span class="sqrt"><span class="sign">&#8730;</span>` +
    `<span class="of">${c}</span></span>`,
  sup: c => `<sup>${c}</sup>`,
  sub: c => `<sub>${c}</sub>`,
  /* a base with its scripts beside it, so they are aligned against IT and not the line */
  scripted: (b, up, dn) => `<span class="scripted"><span class="base">${b}</span>` +
    `<span class="scripts">${up ? `<sup>${up}</sup>` : ""}` +
    `${dn ? `<sub>${dn}</sub>` : ""}</span></span>`,
  int: (lo, hi) => big("&#8747;", lo, hi),
  oint: (lo, hi) => big("&#8750;", lo, hi),
  sum: (lo, hi) => big("&#8721;", lo, hi),
  prod: (lo, hi) => big("&#8719;", lo, hi),
  binom: (o, u) => `<span class="paren"><span class="binom"><span class="o">${o}</span>` +
    `<span class="u">${u}</span></span></span>`,
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
  hat(c: string): string;
  tilde(c: string): string;
  vec(c: string): string;
  dot(c: string): string;
  ddot(c: string): string;
  words(t: string): string;
  bold(c: string): string;
  cal(c: string): string;
  bb(c: string): string;
  sqrt(c: string): string;
  sup(c: string): string;
  sub(c: string): string;
  int(lo: string, hi: string): string;
  oint(lo: string, hi: string): string;
  sum(lo: string, hi: string): string;
  prod(lo: string, hi: string): string;
  frac(over: string, under: string): string;
  paren(c: string): string;
  binom(over: string, under: string): string;
  scripted(base: string, sup: string, sub: string): string;
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
      case "hat": return w.hat(set(p.of, w));
      case "tilde": return w.tilde(set(p.of, w));
      case "vec": return w.vec(set(p.of, w));
      case "dot": return w.dot(set(p.of, w));
      case "ddot": return w.ddot(set(p.of, w));
      case "words": return w.words(p.text);
      case "bold": return w.bold(set(p.of, w));
      case "cal": return w.cal(set(p.of, w));
      case "bb": return w.bb(set(p.of, w));
      case "sqrt": return w.sqrt(set(p.of, w));
      case "sup": return w.sup(set(p.of, w));
      case "sub": return w.sub(set(p.of, w));
      case "int": return w.int(set(p.from, w), set(p.to, w));
      case "sum": return w.sum(set(p.from, w), set(p.to, w));
      case "oint": return w.oint(set(p.from, w), set(p.to, w));
      case "prod": return w.prod(set(p.from, w), set(p.to, w));
      case "frac": return w.frac(set(p.over, w), set(p.under, w));
      case "paren": return w.paren(set(p.of, w));
      case "binom": return w.binom(set(p.over, w), set(p.under, w));
      case "scripted": return w.scripted(set([p.base], w),
        p.sup ? set(p.sup, w) : "", p.sub ? set(p.sub, w) : "");
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
