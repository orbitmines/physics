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
 * TWO RENDERERS, ONE MARKUP. `html` writes a standalone page that needs no build; the
 * React notation in `src/react/Notation.ts` sets the same markup into elements. They
 * must agree, which is why there is one parser and one `set` here that both of them
 * walk, rather than two files each with their own idea of what `^{D-1}` means - a
 * renderer here is a `Setter`, and a `Setter` cannot reinterpret the markup because it
 * never sees it.
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
 * AND THE COUNTS THAT ARE BARRED WHEREVER THEY APPEAR, which is the other way round.
 *
 * `BARRED_COUNTS` is for a bar that was WRITTEN and has to keep the count's colour. This is
 * for a count the article always writes under a bar whether the markup says so or not:
 * `l.DEG` is a discrete number of ways out and is set as `l.\overline{DEG}` on the page, so a
 * proof that renders it bare disagrees with the prose beside it about what kind of thing it is.
 */
const ALWAYS_BARRED = new Set(["DEG"]);

/** one of the lattice's own counts, barred if it is always written so */
const counted = (w: string): Piece => {
  const of: Piece = { kind: "count", of: [{ kind: "text", text: w }] };
  return ALWAYS_BARRED.has(w) ? { kind: "bar", of: [of] } : of;
};

/**
 * THE QUANTITIES THAT ARE WRITTEN WITH A BAR WHEREVER THEY APPEAR.
 *
 * `R` is a DISCRETE DISTANCE - a whole number of steps out from a mass, counted on the
 * lattice - and everything discrete in this repository is written with a bar over it. `m` is
 * the same kind of thing from the other side: a body's size is how many CELLS it is, a whole
 * number like every other count here, and it was arriving bare beside a barred `\bar{m}_{x}`
 * that is the rate those same cells emit at. The prime stays outside the bar, where a prime
 * belongs - `m'` is another body, not another mark on this one.
 * The lower-case `\bar{r}` has carried one since the beginning; `R` is the same quantity
 * measured from a body instead of from a point, and it was coming out bare.
 *
 * IT IS DONE HERE RATHER THAN IN THE PROVER because `R` is a KEY there and not a
 * spelling. `Prove.ts` differentiates with respect to `"R"`, substitutes `"r"` for it,
 * asks the store what is known in terms of it, and matches it inside field names like
 * `l.shell(R)`; renaming the symbol to `\bar{R}` would change every one of those lookups
 * to make one mark appear on a page. So the name stays what the algebra calls it and the
 * bar goes on where the name is SET - which is the same division `COUNTS` already draws,
 * where `DEG` is a plain word in the source and one of the lattice's own counts here.
 *
 * AND WHETHER IT LEANS IS A SECOND QUESTION, which is why this is a table and not a set.
 *
 * `R` STANDS UPRIGHT, and that is the whole of what its bar is saying. A leaning letter is a
 * quantity that varies over a continuum; `R` does not - it is a whole number of steps. Set in
 * italic it read as a real-valued radius with a decoration on it, which is the one thing it
 * is not.
 *
 * `m` LEANS. It is discrete for the same reason - a body is a whole number of cells - but it
 * is also the thing a law is ABOUT: it is what varies from one body to the next, and every
 * other quantity in that position leans. So it takes both marks and each says its own thing,
 * the bar that it is counted and the lean that it is what the law is being written in.
 */
const BARRED = new Map<string, "upright" | "leans">([["R", "upright"], ["m", "leans"]]);

/**
 * NAMES THAT ARE FUNCTIONS EVEN WITH NOTHING IN BRACKETS AFTER THEM.
 *
 * A name is normally read as a function because something is APPLIED to it - `shell(r)`,
 * `met(R)` - and that test is what colours it as something this repository worked out rather
 * than a symbol it was handed. `recur` takes no argument: it is not applied to anything, it
 * says that the line it stands in is asked again, so writing `recur\paren{g}` names a `g` the
 * reader is expected to already have and writing it bare leaves it set as prose. Listed here
 * it is set as what it is.
 */
const FUNCTIONS = new Set(["recur"]);

/**
 * A GREEK LETTER IS A QUANTITY, and is set like one.
 *
 * `GLYPHS` is mostly punctuation - relations, operators, arrows - which stands upright
 * because it is not naming anything. The alphabet in it is different: `\rho` is the
 * occupancy and `\sigma` is a cross-section, and the article writes both of them `<V>`,
 * so a proof that set them upright disagreed with the prose around it about what kind of
 * thing they were. Listed rather than detected, because "is this glyph a letter" is not a
 * question the string answers.
 */
const GREEK = new Set([
  "alpha", "beta", "gamma", "delta", "epsilon", "varepsilon", "zeta", "eta",
  "theta", "vartheta", "iota", "kappa", "lambda", "mu", "nu", "xi",
  "omicron", "pi", "varpi", "rho", "varrho", "sigma", "varsigma", "tau",
  "upsilon", "phi", "varphi", "chi", "psi", "omega",
  "Gamma", "Delta", "Theta", "Lambda", "Xi", "Pi", "Sigma", "Upsilon", "Phi", "Psi", "Omega",
  "ell",
]);

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
/**
 * THE COMMANDS THAT CHOOSE A LETTER'S SHAPE, as against the ones that mark a name.
 *
 * `\mathcal`, `\mathbb` and `\mathbf` say how to SET a letter; `\bar` and the accents say
 * something about what the letter underneath already means. The first kind takes a letter and
 * nothing else - so what is inside it is not read as a formula, and does not go through the
 * table of counts or the table of barred names. See the note at the call site.
 */
const LETTERFORMS = new Set(["mathcal", "mathbb", "mathbf", "boldsymbol"]);

const WRAPS: Record<string, "bar" | "hat" | "tilde" | "vec" | "dot" | "ddot" |
  "bold" | "cal" | "bb" | "sqrt" | "paren" | "muted"> = {
  bar: "bar", overline: "bar", hat: "hat", widehat: "hat",
  tilde: "tilde", widetilde: "tilde", vec: "vec", dot: "dot", ddot: "ddot",
  mathbf: "bold", boldsymbol: "bold", mathcal: "cal", mathbb: "bb",
  sqrt: "sqrt", paren: "paren",
  /*
   * AND SOMETHING SAID BESIDE A LINE RATHER THAN IN IT.
   *
   * A conclusion is headed by the name of what was concluded, and some of those names carry
   * bookkeeping - `at D = 3` says which reading of the law this is. That is a real part of the
   * name and cannot be dropped, but it is not part of the QUANTITY: set in the same ink as
   * `F_{g}` it reads as though `at` and `3` were factors of it. Muted, it reads as what it is,
   * a note on which line you are looking at. Same colour the `l.` of a local's field uses, and
   * for the same reason.
   */
  aside: "muted",
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

/**
 * AND THE ONES WHOSE SUBSCRIPT GOES UNDERNEATH RATHER THAN BESIDE.
 *
 * `\lim_{R \to \infty}` is not a limit with a label on its shoulder: the condition is SET
 * UNDER the word, which is how every text writes it and how a reader finds it. `\sin_{x}` is
 * not a thing, so this is a short list and it is about these operators specifically rather
 * than about subscripts in general - a `\max` over a set is the same shape and gets the same
 * treatment.
 */
const UNDERSET = new Set(["lim", "max", "min", "sup", "inf", "argmax", "argmin"]);

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
      /*
       * AND ONE SPACE AFTER A CONTROL WORD IS EATEN, which is what a space after one is FOR.
       * `\cdot l.DEG` has to have it - `\cdotl` is a different command - and it is a
       * separator rather than a gap, so printing it put a hole in the middle of `x·l.DEG`.
       */
      const after = i + (word?.[0].length ?? 0) +
        (word && src[i + word[0].length] === " " ? 1 : 0);
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
          /*
           * A LETTERFORM IS NOT A NAME, so what is inside one is not looked up.
           *
           * `\mathcal{D}` says SET THIS LETTER THAT WAY - the whole point of writing it is
           * that the shape distinguishes it from the `D` beside it. Parsed as a formula, the
           * `D` went through `plain` and came out as one of the lattice's own counts, in the
           * count's colour, which is precisely the letter it is being written to be told apart
           * from. `\mathcal{R}` came out barred for the same reason.
           *
           * A LETTERFORM COMMAND TAKES A LETTER, and that is all it takes - there is nothing
           * to parse and nothing to look up. `\bar` and the accents are the other case and
           * keep their parse: those mark something that IS a name, and the name still has to
           * mean what it means underneath the mark.
           */
          const of = LETTERFORMS.has(name) && /^[A-Za-z]+$/.test(hit.got[0])
            ? [{ kind: "text", text: hit.got[0] } as Piece]
            : parse(hit.got[0]);
          /* a barred lattice count is still a lattice count - see BARRED_COUNTS */
          /*
           * AND A BAR AROUND A BAR IS ONE BAR.
           *
           * `\bar{m}` is written out in the proofs, and `m` is now one of the letters that
           * carries a bar wherever it stands - so the mark arrives twice, once from the source
           * and once from the table, and two rules drawn a hair apart read as a smudge rather
           * than as a mark. There is no expression that wants two, so the second is dropped
           * rather than guarded against at every call site.
           */
          const once = WRAPS[name] === "bar" && of.length === 1 && of[0].kind === "bar"
            ? (of[0] as { of: Piece[] }).of : of;
          out.push(WRAPS[name] === "bar" && BARRED_COUNTS.has(hit.got[0])
            ? { kind: "count", of: [{ kind: "bar", of: once }] }
            : { kind: WRAPS[name], of: once });
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
        const glyph: Piece = { kind: "text", text: GLYPHS[name] };
        out.push(GREEK.has(name) ? { kind: "var", of: [glyph] } : glyph);
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
      out.push(counted(w));
      continue;
    }
    /* something discrete, which is written with a bar over it - see BARRED */
    const bar = BARRED.get(w);
    if (bar) {
      flush();
      const letter: Piece = { kind: "text", text: w };
      out.push({ kind: "bar", of: [bar === "leans" ? { kind: "var", of: [letter] } : letter] });
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
      out.push(counted(bits[i + 2]));
      i += 2;
      continue;
    }
    /* a name that is a function whether or not anything is applied to it - see FUNCTIONS */
    if (FUNCTIONS.has(w)) {
      flush();
      out.push({ kind: "fn", of: [{ kind: "text", text: w }] });
      continue;
    }
    /* a name immediately before a bracket is a function being applied */
    if (/^[A-Za-z_]/.test(w) && (bits[i + 1] ?? "").startsWith("(")) {
      flush();
      out.push({ kind: "fn", of: [{ kind: "text", text: w }] });
      continue;
    }
    /*
     * A LONE LETTER IS A QUANTITY, so it leans - `\bar{m}`, `m_{x}`, `A`, `g`, `v`.
     *
     * Left as plain text they came out upright, so a proof set the same mass roman that
     * the prose beside it set `<V>m</V>` and leaned - one symbol, two ways, on one page.
     *
     * AND EVERY OTHER RUN OF LETTERS IS A WORD, which is the half that has to be got right
     * or this rule is worse than none. `because` and `working` are ENGLISH with formulae
     * in them - the opposite arrangement to a line, where prose is the exception and is
     * marked `\text{}` - so leaning every letter run leaned whole paragraphs of the panel.
     * A quantity in this repository is one letter, optionally barred, accented, or carrying
     * a script; a name of more than one letter is a count, a function, or a word.
     *
     * WHICH STILL LEAVES `a` AND `I`, the two English words that are one letter, so the
     * decision looks at what FOLLOWS. A quantity is next to mathematics - an operator, a
     * relation, a digit, a brace, a script - and a word is next to another word. `g = 1`
     * leans; `a rewrite fires` does not, and neither does the `a` in `once a tick`.
     */
    const alone = /^[A-Za-z]$/.test(w);
    const after = bits[i + 1] ?? "";
    const isWord = alone && /^\s+$/.test(after) && /^[A-Za-z]/.test(bits[i + 2] ?? "");
    if (alone && !isWord) {
      flush();
      out.push({ kind: "var", of: [{ kind: "text", text: w }] });
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
export const html = (s: string): string => set<string>(parse(s), {
  join: p => p.join(""),
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
  underset: (b, under) => `<span class="under"><span class="base">${b}</span>` +
    `<span class="cond">${under}</span></span>`,
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
 * AND THE SECOND RENDERER IS NOT HERE, which is deliberate and is not the same as there
 * not being one. `src/react/Notation.ts` sets the same pieces into React elements, and
 * it lives over there because it names `react` and this file must not - the core of this
 * package has no dependencies and is checked with neither `dom` nor `node`, and a theory
 * that can only be loaded alongside a view library is not that. What it takes from here
 * is `parse`, `set` and `Setter`, so there is still exactly one parser and exactly one
 * walk; what differs between the two renderers is the twenty-odd lines that say what a
 * fraction LOOKS like, which is the only thing that should differ.
 */

/**
 * WHAT A LINE IS SET INTO - and it is not necessarily a string.
 *
 * `html` sets into text and the React notation sets into elements, and both walk the
 * same `Piece[]` through the same `set` below. That is the whole point of the type being
 * generic: a second renderer is a second SETTER, not a second parser, so there is no
 * second place for the two to disagree about what `^{D-1}` means. The note further up
 * this file said a consumer gets the pieces and maps them itself; this is that map,
 * written once, so that the mapping cannot be got subtly wrong per consumer either.
 *
 * `join` is what makes the walk generic. A run of pieces has to become ONE of whatever
 * is being built - concatenated text, or a fragment of children - and that is the only
 * operation the walk needs which a per-piece handler cannot supply.
 */
export type Setter<T = string> = {
  join(parts: T[]): T;
  text(t: string): T;
  var(c: T): T;
  count(c: T): T;
  fn(c: T): T;
  muted(c: T): T;
  bar(c: T): T;
  hat(c: T): T;
  tilde(c: T): T;
  vec(c: T): T;
  dot(c: T): T;
  ddot(c: T): T;
  words(t: string): T;
  bold(c: T): T;
  cal(c: T): T;
  bb(c: T): T;
  sqrt(c: T): T;
  sup(c: T): T;
  sub(c: T): T;
  int(lo: T, hi: T): T;
  oint(lo: T, hi: T): T;
  sum(lo: T, hi: T): T;
  prod(lo: T, hi: T): T;
  frac(over: T, under: T): T;
  paren(c: T): T;
  binom(over: T, under: T): T;
  /**
   * A base with its scripts. Either script may be ABSENT, which is not the same as
   * empty - a text setter can render nothing for both and an element setter must not
   * emit an empty `<sup>` box, so the difference is carried rather than flattened.
   */
  scripted(base: T, sup: T | undefined, sub: T | undefined): T;
  /** an operator with its condition set underneath, the way a limit is written */
  underset(base: T, under: T): T;
  ref(k: string): T;
};

/**
 * A BASE THAT IS NO TALLER THAN A LETTER, so its scripts can simply follow it.
 *
 * `scripted` exists because an exponent has to be aligned against the thing it is ON: put
 * beside a bracket, a fraction, a root or a sum as a plain sibling, it floats at the
 * height of the tallest thing on the line instead of sitting on its base's own shoulder.
 * The box that fixes that is only needed where the base HAS a shoulder to miss.
 *
 * On a letter it is worse than unnecessary. `\bar{m}_{x}` set in the box gets a column
 * stretched to the barred `m`'s full height with the `x` pushed to the bottom of it -
 * lower and looser than a subscript, and unlike the `<Sub>` the article writes by hand a
 * few lines away, so the same mass came out two ways on one page. A letter's scripts are
 * an ordinary `<sub>` and `<sup>`, which every renderer here already has.
 *
 * BOTH SCRIPTS AT ONCE STILL TAKE THE BOX, whatever the base: as siblings they would
 * stand side by side rather than stacked, and stacking them is the one thing the box does
 * that a pair of tags cannot.
 */
const SHORT = new Set([
  "text", "var", "count", "fn", "muted", "words",
  "bold", "cal", "bb", "bar", "hat", "tilde", "vec", "dot", "ddot",
]);

export const set = <T,>(pieces: Piece[], w: Setter<T>): T =>
  w.join(pieces.map(p => {
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
      case "scripted": {
        /*
         * A LIMIT'S CONDITION IS SET UNDER IT, not on its shoulder. `\lim_{R \to \infty}` is
         * how every text writes it and where a reader looks for it; as a subscript it reads
         * like a labelled variable. The base of such a piece is one `fn` whose text is the
         * operator's own name, so that is what is checked - and a superscript is left alone,
         * since nothing puts one on a limit.
         */
        const b = p.base as { kind: string; of?: { kind: string; text?: string }[] };
        const named = b?.kind === "fn" && b.of?.length === 1 && b.of[0].kind === "text"
          ? b.of[0].text : undefined;
        if (named && UNDERSET.has(named) && p.sub && !p.sup)
          return w.underset(set([p.base], w), set(p.sub, w));
        /* a letter's script is an ordinary one, and follows it - see SHORT */
        if (SHORT.has(p.base.kind) && !(p.sup && p.sub))
          return w.join([
            set([p.base], w),
            ...(p.sup ? [w.sup(set(p.sup, w))] : []),
            ...(p.sub ? [w.sub(set(p.sub, w))] : []),
          ]);
        return w.scripted(set([p.base], w),
          p.sup ? set(p.sup, w) : undefined, p.sub ? set(p.sub, w) : undefined);
      }
      case "ref": return w.ref(p.key);
    }
  }));

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
