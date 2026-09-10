/**
 * The lexer of the brace dialect - see implementation/README.md for every construct it accepts.
 * Newlines are significant (a statement ends at one); `;` also ends a statement.
 */

export type TokenKind =
  | "num" | "str" | "tick" | "path" | "id" | "label" | "ctx"
  | "op" | "nl" | "eof";

export type Token = {
  kind: TokenKind;
  text: string;
  line: number;
  col: number;
  /** character offsets into the source, so a parser can tell adjacency (`/S.1`, `a<b>`) */
  start: number;
  end: number;
  /** whitespace preceded this token on the same line */
  spaced: boolean;
};

export class LexError extends Error {
  constructor(msg: string, public file: string, public line: number, public col: number) {
    super(`${file}:${line}:${col}: ${msg}`);
  }
}

const OPS = [
  ":=", "+=", "=>", "===", "==", "!=", "<=", ">=", "??", "?.",
  "&", "|", "!", "+", "-", "*", "/", "%", "<", ">", "=", ":", "?", ".", ",",
  "(", ")", "[", "]", "{", "}", "~", "\\", ";", "#", "^",
];

const isIdStart = (c: string) => /[\p{L}_∙⊙⊢⊣]/u.test(c);
const isIdPart = (c: string) => /[\p{L}\p{N}_]/u.test(c);
const isDigit = (c: string) => c >= "0" && c <= "9";

export function lex(src: string, file = "<input>"): Token[] {
  const out: Token[] = [];
  let i = 0, line = 1, col = 1;
  let spaced = false;
  const push = (kind: TokenKind, text: string, start: number, l: number, c: number) => {
    out.push({ kind, text, line: l, col: c, start, end: i, spaced });
    spaced = false;
  };
  const adv = (n = 1) => { for (let k = 0; k < n; k++) { if (src[i] === "\n") { line++; col = 1; } else col++; i++; } };
  const err = (m: string) => new LexError(m, file, line, col);

  while (i < src.length) {
    const c = src[i];
    if (c === " " || c === "\t" || c === "\r") { adv(); spaced = true; continue; }
    if (c === "\n") {
      if (out.length && out[out.length - 1].kind !== "nl") push("nl", "\n", i, line, col);
      adv(); spaced = false; continue;
    }
    if (c === "/" && src[i + 1] === "/") { while (i < src.length && src[i] !== "\n") adv(); continue; }
    if (c === "/" && src[i + 1] === "*") {
      adv(2);
      while (i < src.length && !(src[i] === "*" && src[i + 1] === "/")) adv();
      if (i >= src.length) throw err("unterminated comment");
      adv(2); spaced = true; continue;
    }
    const start = i, l = line, cc = col;

    if (c === "\"") {
      adv();
      let s = "";
      while (i < src.length && src[i] !== "\"") {
        if (src[i] === "\\") {
          const n = src[i + 1];
          if (n === "n") s += "\n"; else if (n === "t") s += "\t"; else if (n === "\"") s += "\""; else if (n === "\\") s += "\\"; else if (n === "{") s += "{{"; else if (n === "}") s += "}}"; else s += n;
          adv(2); continue;
        }
        if (src[i] === "\n") throw err("newline in string");
        s += src[i]; adv();
      }
      if (i >= src.length) throw err("unterminated string");
      adv();
      push("str", s, start, l, cc); continue;
    }
    if (c === "`") {
      adv();
      let s = "";
      while (i < src.length && src[i] !== "`") { s += src[i]; adv(); }
      if (i >= src.length) throw err("unterminated backtick");
      adv();
      push("tick", s, start, l, cc); continue;
    }
    if (c === "@" && (src[i + 1] === "." || src[i + 1] === "/" || src[i + 1] === "\"")) {
      adv();
      let s = "";
      if (src[i] === "\"") {
        adv();
        while (i < src.length && src[i] !== "\"") { s += src[i]; adv(); }
        adv();
      } else {
        // a path runs to whitespace or a closing bracket; `{x}` inside it interpolates
        let depth = 0;
        while (i < src.length) {
          const ch = src[i]!;
          if (ch === "{") depth++;
          else if (ch === "}") { if (depth === 0) break; depth--; }
          else if (/[\s,)\]]/.test(ch) && depth === 0) break;
          s += ch; adv();
        }
      }
      push("path", s, start, l, cc); continue;
    }
    if (c === "&" && i + 1 < src.length && isIdStart(src[i + 1])) {
      adv();
      let s = "";
      while (i < src.length && isIdPart(src[i])) { s += src[i]; adv(); }
      push("ctx", s, start, l, cc); continue;
    }
    if (isDigit(c)) {
      let s = "";
      while (i < src.length && isDigit(src[i])) { s += src[i]; adv(); }
      if (src[i] === "." && isDigit(src[i + 1] ?? "")) {
        s += "."; adv();
        while (i < src.length && isDigit(src[i])) { s += src[i]; adv(); }
      }
      if (src[i] === "\\") { adv(); push("label", s, start, l, cc); continue; }
      push("num", s, start, l, cc); continue;
    }
    if (isIdStart(c)) {
      let s = c; adv();
      while (i < src.length && isIdPart(src[i])) { s += src[i]; adv(); }
      if (src[i] === "\\") { adv(); push("label", s, start, l, cc); continue; }
      push("id", s, start, l, cc); continue;
    }
    let matched = false;
    for (const op of OPS) {
      if (src.startsWith(op, i)) { adv(op.length); push("op", op, start, l, cc); matched = true; break; }
    }
    if (matched) continue;
    throw err(`unexpected character ${JSON.stringify(c)}`);
  }
  if (out.length && out[out.length - 1].kind !== "nl") push("nl", "\n", i, line, col);
  push("eof", "", i, line, col);
  return out;
}
