/**
 * The parser of the brace dialect. Recursive descent with precedence climbing; produces the tree
 * of ast.ts. Nothing here is a semantic decision - `if`, `while`, `return` are parsed into nodes
 * that the runtime executes by the .ray definitions of Program.ray (or their recognised
 * equivalents).
 */
import { Arg, Block, Body, Expr, Loc, Param, Part, Stmt, Type } from "./ast.ts";
import { lex, Token } from "./lexer.ts";

export class ParseError extends Error {
  constructor(msg: string, public loc: Loc) { super(`${loc.file}:${loc.line}:${loc.col}: ${msg}`); }
}

const MODIFIERS = new Set(["static", "internal", "external", "dynamically", "confidential", "protected", "io", "force", "suggest", "approx"]);
const NAMED = new Set(["visual", "theorem", "choose", "test", "data"]);
const OPERATOR_NAMES = new Set(["+", "-", "*", "/", "%", "^", "<", "<=", ">", ">=", "==", "!=", "!", "&", "|", "~", "??", "?"]);

export function parse(src: string, file = "<input>"): Block {
  return new Parser(lex(src, file), file).program();
}

export function parseExpression(src: string, file = "<input>"): Expr {
  const p = new Parser(lex(src, file), file);
  p.skipNl();
  const e = p.expr();
  p.skipNl();
  return e;
}

class Parser {
  i = 0;
  constructor(public toks: Token[], public file: string) {}

  // ——— token helpers ———————————————————————————————————————————————————————
  get t(): Token { return this.toks[this.i]; }
  peek(n = 1): Token { return this.toks[Math.min(this.i + n, this.toks.length - 1)]; }
  loc(t: Token = this.t): Loc { return { file: this.file, line: t.line, col: t.col }; }
  err(msg: string, t: Token = this.t): never { throw new ParseError(`${msg} (got ${t.kind} ${JSON.stringify(t.text)})`, this.loc(t)); }
  is(kind: string, text?: string, t: Token = this.t): boolean { return t.kind === kind && (text === undefined || t.text === text); }
  isOp(text: string, t: Token = this.t): boolean { return t.kind === "op" && t.text === text; }
  isId(text: string, t: Token = this.t): boolean { return t.kind === "id" && t.text === text; }
  next(): Token { return this.toks[this.i++]; }
  eat(kind: string, text?: string): Token {
    if (!this.is(kind, text)) this.err(`expected ${text ?? kind}`);
    return this.next();
  }
  eatOp(text: string): Token { return this.eat("op", text); }
  accept(kind: string, text?: string): Token | undefined { return this.is(kind, text) ? this.next() : undefined; }
  acceptOp(text: string): Token | undefined { return this.isOp(text) ? this.next() : undefined; }
  skipNl() { while (this.is("nl") || this.isOp(";")) this.i++; }
  atEnd(): boolean { return this.is("eof"); }
  /** the next token is adjacent (no whitespace) to the previous */
  adjacent(t: Token = this.t): boolean { return !t.spaced && t.kind !== "nl"; }

  // ——— programs ———————————————————————————————————————————————————————————
  program(): Block {
    const loc = this.loc();
    const statements: Stmt[] = [];
    this.skipNl();
    while (!this.atEnd()) {
      const before = this.i;
      statements.push(this.statement());
      this.skipNl();
      if (this.i === before) this.err("parser made no progress");
    }
    return { kind: "program", statements, loc };
  }

  block(): Block {
    const loc = this.loc();
    this.eatOp("{");
    const statements: Stmt[] = [];
    this.skipNl();
    while (!this.isOp("}")) {
      if (this.atEnd()) this.err("unterminated block");
      const before = this.i;
      statements.push(this.statement());
      this.skipNl();
      if (this.i === before) this.err("parser made no progress");
    }
    this.eatOp("}");
    return { kind: "program", statements, loc };
  }

  /** a body: `{ block }` or a single inline statement (an expression, or e.g. `this.active = true`) */
  body(): Body {
    if (this.isOp("{") && !this.looksLikeMapPattern()) return this.block();
    const loc = this.loc();
    const s = this.statement(true);
    if (s.kind === "expr" && !s.predicate) return s.expr;
    return { kind: "program", statements: [s], loc };
  }

  /** a statement body after `if p` etc: block, or one inline statement */
  stmtBody(): Body {
    if (this.isOp("{")) return this.block();
    const loc = this.loc();
    const s = this.statement(true);
    return { kind: "program", statements: [s], loc };
  }

  endStatement() {
    if (this.is("nl") || this.isOp(";")) { this.next(); return; }
    if (this.isOp("}") || this.atEnd()) return;
    this.err("expected end of statement");
  }

  /** `stmt if p` */
  postfixIf(): Expr | undefined {
    if (this.isId("if")) { this.next(); return this.expr(); }
    return undefined;
  }

  statement(inline = false): Stmt {
    const loc = this.loc();
    const t = this.t;

    if (t.kind === "label") {
      this.next();
      return { kind: "label", name: t.text, loc };
    }
    if (this.isId("goto")) {
      this.next();
      const lt = this.next();
      if (lt.kind !== "id" && lt.kind !== "num") this.err("expected label", lt);
      let predicate: Expr | undefined;
      if (this.isId("if")) { this.next(); predicate = this.expr(); }
      if (!inline) this.endStatement();
      return { kind: "goto", label: lt.text, predicate, loc };
    }
    if (this.isId("return") && !this.isOp(":=", this.peek())) {
      this.next();
      let value: Expr | undefined;
      if (!this.is("nl") && !this.isOp(";") && !this.isOp("}") && !this.isId("if") && !this.atEnd()) value = this.expr();
      const predicate = this.postfixIf();
      if (!inline) this.endStatement();
      return { kind: "return", value, predicate, loc };
    }
    if (this.isId("recur") && !this.isOp(":=", this.peek())) {
      this.next();
      if (!inline) this.endStatement();
      return { kind: "recur", loc };
    }
    if (this.isId("dynamically") && this.isId("assert", this.peek())) {
      this.next(); this.next();
      const requirement = this.expr();
      const predicate = this.postfixIf();
      if (!inline) this.endStatement();
      return { kind: "assert", requirement, predicate, loc };
    }
    if (this.isId("rule") && this.isOp("/", this.peek())) return this.rule(loc, inline);
    if (this.isId("as") && this.isOp("(", this.peek()) && this.isOp("===", this.peek(2))) {
      this.next(); this.next(); this.next();
      const type = this.type();
      this.eatOp(")");
      this.eatOp("=>");
      const body = this.body();
      if (!inline) this.endStatement();
      return { kind: "conversion", type, body, loc };
    }
    if (t.kind === "id" && NAMED.has(t.text) && this.is("str", undefined, this.peek())) return this.named(loc, inline);

    // modifiers before a member
    const modifiers: string[] = [];
    while (this.t.kind === "id" && MODIFIERS.has(this.t.text) && !(this.t.text === "dynamically" && this.isId("assert", this.peek()))) {
      modifiers.push(this.next().text);
    }

    // `{pattern} => target` map / rewrite rule, or `{method: *}(args) => body` grammar member
    if (this.isOp("{") && this.looksLikeMapPattern()) {
      const pattern = this.looksLikeTypePattern() ? this.typePattern() : this.block();
      if (this.isOp("(")) {
        const params = this.params();
        this.eatOp("=>");
        const body = this.body();
        if (!inline) this.endStatement();
        return { kind: "grammar", pattern, params, body, loc };
      }
      this.eatOp("=>");
      const target = this.isOp("{") ? { kind: "block", body: this.block(), loc: this.loc() } as Expr : this.expr();
      if (!inline) this.endStatement();
      const strength = modifiers.find(m => m === "force" || m === "suggest" || m === "approx");
      return { kind: "map", pattern, target, strength, loc };
    }

    // `[at: N] () => body`
    if (this.isOp("[") && this.is("id", undefined, this.peek()) && this.isOp(":", this.peek(2))) {
      this.next();
      const params = this.paramList("]");
      const params2 = this.isOp("(") ? this.params() : [];
      const returns = this.acceptOp(":") ? this.type() : undefined;
      this.eatOp("=>");
      const body = this.body();
      if (!inline) this.endStatement();
      return { kind: "index_method", params: [...params, ...params2], returns, body, loc };
    }

    // a member/definition: name (| alias)* followed by `:=`, `:`, `(`, `+=`
    const names = this.memberNames();
    if (names) {
      // method: `name (params)` with a space before `(`
      if (this.isOp("(") && this.t.spaced) {
        const params = this.params();
        const returns = this.acceptOp(":") ? this.type() : undefined;
        let body: Body | undefined;
        if (this.acceptOp("=>")) { this.skipNl(); body = this.body(); }
        if (!inline) this.endStatement();
        return { kind: "method", names, params, returns, body, modifiers, loc };
      }
      if (this.isOp(":=")) {
        this.next();
        const value = this.expr();
        const predicate = this.postfixIf();
        if (!inline) this.endStatement();
        return { kind: "define", names, value, modifiers, predicate, loc };
      }
      if (this.isOp(":") && !this.isOp("=", this.peek())) {
        this.next();
        const type = this.type();
        let value: Expr | undefined;
        if (this.acceptOp("=")) value = this.expr();
        const predicate = this.postfixIf();
        if (!inline) this.endStatement();
        return { kind: "define", names, type, value, modifiers, predicate, loc };
      }
      if (this.isOp("+=") && names.length === 1 && this.isOp("{", this.peek())) {
        this.next();
        const body = this.block();
        if (!inline) this.endStatement();
        return { kind: "extend", target: { kind: "name", name: names[0], loc }, body, loc };
      }
      // a bare `name = expr` where name is a field being given its value (in class bodies) - assignment
      this.i = this.namesStart!;
    }

    // `X.y += { }` extension of a nested class, or a `* += { }` extension of everything
    if (this.isOp("*") && this.isOp("+=", this.peek())) {
      this.next(); this.next();
      const body = this.block();
      if (!inline) this.endStatement();
      return { kind: "extend", target: { kind: "name", name: "*", loc }, body, loc };
    }

    if (modifiers.length) {
      // `static NAME = expr`
      const e = this.expr();
      if (this.acceptOp("=")) {
        const value = this.expr();
        if (!inline) this.endStatement();
        if (e.kind === "name") return { kind: "define", names: [e.name], value, modifiers, loc };
        return { kind: "assign", target: e, value, loc };
      }
      if (!inline) this.endStatement();
      return { kind: "expr", expr: e, loc };
    }

    // expression or assignment
    const e = this.expr();
    if (e.kind === "path" && this.isOp(":=")) {
      this.next();
      const value = this.expr();
      if (!inline) this.endStatement();
      return { kind: "assign", target: { ...e, mkdir: true } as Expr, value, loc };
    }
    if (this.isOp("+=") && this.isOp("{", this.peek())) {
      this.next();
      const body = this.block();
      if (!inline) this.endStatement();
      return { kind: "extend", target: e, body, loc };
    }
    if (this.acceptOp("=")) {
      const value = this.expr();
      const predicate = this.postfixIf();
      if (!inline) this.endStatement();
      return { kind: "assign", target: e, value, predicate, loc };
    }
    const predicate = this.postfixIf();
    if (!inline) this.endStatement();
    return { kind: "expr", expr: e, predicate, loc };
  }

  namesStart?: number;
  namesOptional = false;
  /** `name (| alias)*` where name may be an operator glyph; undefined if this is not a member head */
  memberNames(): string[] | undefined {
    this.namesStart = this.i;
    const names: string[] = [];
    const head = this.t;
    const isHead = (t: Token) => t.kind === "id" || (t.kind === "op" && OPERATOR_NAMES.has(t.text));
    if (!isHead(head)) return undefined;
    // an operator name must be followed by ` (`
    if (head.kind === "op" && !(this.isOp("(", this.peek()) && this.peek().spaced) && !this.isOp("|", this.peek())) return undefined;
    // an identifier that is a keyword statement is not a member, unless it is being defined (`if := class ...`)
    if (head.kind === "id" && ["if", "unless", "while", "goto", "return", "recur", "class", "enum"].includes(head.text) && !this.isOp(":=", this.peek())) return undefined;
    if (head.kind === "id" && head.text === "draw" && this.isOp("(", this.peek()) && !this.peek().spaced) return undefined;
    // `as (=== T) => body`: a conversion
    if (head.kind === "id" && head.text === "as" && this.isOp("(", this.peek()) && this.isOp("===", this.peek(2))) return undefined;
    names.push(head.text);
    let j = this.i + 1;
    while (this.isOp("|", this.toks[j]) && isHead(this.toks[j + 1]) && this.toks[j].spaced) {
      names.push(this.toks[j + 1].text);
      j += 2;
    }
    let after = this.toks[j];
    let optional = false;
    if (this.isOp("?", after) && this.isOp(":", this.toks[j + 1])) { optional = true; j++; after = this.toks[j]; }
    const follows = (this.isOp("(", after) && after.spaced) || this.isOp(":=", after) || this.isOp("+=", after)
      || (this.isOp(":", after) && !this.isOp("=", this.toks[j + 1]));
    if (!follows) return undefined;
    this.i = j;
    this.namesOptional = optional;
    return names;
  }

  rule(loc: Loc, inline: boolean): Stmt {
    this.next(); // rule
    // `/S.1`: a `/` followed by adjacent tokens
    this.eatOp("/");
    let id = "/";
    while (this.adjacent() && (this.t.kind === "id" || this.t.kind === "num" || this.isOp("."))) id += this.next().text;
    const name = this.eat("str").text;
    let rate: string | undefined;
    if (this.isOp("|")) { this.next(); rate = this.eat("id").text; }
    const params = this.params();
    this.eatOp("=>");
    const body = this.body();
    if (!inline) this.endStatement();
    return { kind: "rule", id, name, rate, params, body, loc };
  }

  named(loc: Loc, inline: boolean): Stmt {
    const keyword = this.next().text;
    const name = this.eat("str").text;
    const params = this.isOp("(") ? this.params() : [];
    const returns = this.acceptOp(":") ? this.type() : undefined;
    let body: Body | undefined;
    if (this.acceptOp("=>")) body = this.body();
    if (!inline) this.endStatement();
    return { kind: "named", keyword, name, params, returns, body, loc };
  }

  /** `{N}`, `{ty[]}`, `{ty?}`, `{*}`: a pattern that is a type */
  looksLikeTypePattern(): boolean {
    let j = this.i + 1;
    const first = this.toks[j];
    if (first.kind === "op" && first.text === "*") return this.isOp("}", this.toks[j + 1]);
    if (first.kind !== "id") return false;
    j++;
    let suffix = false;
    while (true) {
      const t = this.toks[j];
      if (t.kind === "op" && t.text === "[" && this.isOp("]", this.toks[j + 1])) { j += 2; suffix = true; continue; }
      if (t.kind === "op" && t.text === "?") { j++; suffix = true; continue; }
      break;
    }
    return suffix && this.isOp("}", this.toks[j]);
  }

  typePattern(): Block {
    const loc = this.loc();
    this.eatOp("{");
    const type = this.type();
    this.eatOp("}");
    return { kind: "program", statements: [{ kind: "expr", expr: { kind: "type_expr", type, loc }, loc }], loc };
  }

  /** does a `{` at this position open a map-rule pattern rather than a block literal?
   *  A pattern is a `{...}` at statement start whose closing `}` is followed by `=>` or `(`. */
  looksLikeMapPattern(): boolean {
    let depth = 0, j = this.i;
    for (; j < this.toks.length; j++) {
      const t = this.toks[j];
      if (t.kind === "op" && (t.text === "{" || t.text === "(" || t.text === "[")) depth++;
      else if (t.kind === "op" && (t.text === "}" || t.text === ")" || t.text === "]")) { depth--; if (depth === 0) break; }
      else if (t.kind === "eof") return false;
    }
    const after = this.toks[j + 1];
    return !!after && after.kind === "op" && (after.text === "=>" || after.text === "(");
  }

  // ——— parameters and types ————————————————————————————————————————————————
  params(): Param[] {
    this.eatOp("(");
    return this.paramList(")");
  }

  paramList(close: string): Param[] {
    const out: Param[] = [];
    this.skipNl();
    while (!this.isOp(close)) {
      const loc = this.loc();
      const name = this.eat("id").text;
      const optional = !!this.acceptOp("?");
      let type: Type | undefined;
      if (this.acceptOp(":")) type = this.type();
      let def: Expr | undefined;
      if (this.acceptOp("=")) def = this.expr();
      out.push({ name, type, optional, default: def, loc });
      this.skipNl();
      if (!this.acceptOp(",")) break;
      this.skipNl();
    }
    this.eatOp(close);
    return out;
  }

  type(): Type {
    const loc = this.loc();
    let count: number | undefined;
    if (this.t.kind === "num" && (this.is("id", undefined, this.peek()) || this.isOp("[", this.peek()))) count = Number(this.next().text);
    let t = this.typeAtom(loc);
    t.count = count;
    while (true) {
      if (this.isOp("[") && this.isOp("]", this.peek()) && this.adjacent()) { this.next(); this.next(); t.array++; continue; }
      if (this.isOp("{") && this.adjacent()) { this.next(); t.filter = this.expr(); this.eatOp("}"); continue; }
      if (this.isOp("?") && this.adjacent()) { this.next(); t.optional = true; continue; }
      break;
    }
    if (this.isOp("|") && !this.isOp("{", this.peek())) {
      const union = [t];
      while (this.acceptOp("|")) union.push(this.type());
      t = { kind: "type", name: "|", array: 0, optional: false, union, loc };
    }
    return t;
  }

  typeAtom(loc: Loc): Type {
    if (this.isOp("*")) { this.next(); return { kind: "type", name: "*", array: 0, optional: false, loc }; }
    if (this.t.kind === "str") { return { kind: "type", name: "literal", literal: this.next().text, array: 0, optional: false, loc }; }
    if (this.isOp("[")) {
      this.next();
      const tuple: Type[] = [];
      while (!this.isOp("]")) { tuple.push(this.type()); if (!this.acceptOp(",")) break; }
      this.eatOp("]");
      return { kind: "type", name: "tuple", tuple, array: 0, optional: false, loc };
    }
    if (this.isOp("(")) {
      const params = this.params();
      let returns: Type | undefined;
      if (this.acceptOp(":")) returns = this.type();
      return { kind: "type", name: "function", fn: { params, returns }, array: 0, optional: false, loc };
    }
    if (this.isOp("{")) {
      // `{ }` an object type
      this.next(); this.skipNl();
      while (!this.isOp("}")) this.next();
      this.eatOp("}");
      return { kind: "type", name: "object", array: 0, optional: false, loc };
    }
    const id = this.eat("id");
    let name = id.text;
    while (this.isOp(".") && this.is("id", undefined, this.peek())) { this.next(); name += "." + this.next().text; }
    if (this.isOp("<") && this.adjacent()) {
      // generics: skip balanced
      let depth = 0;
      do { const t = this.next(); if (t.text === "<") depth++; else if (t.text === ">") depth--; } while (depth > 0);
    }
    return { kind: "type", name, array: 0, optional: false, loc };
  }

  // ——— expressions ————————————————————————————————————————————————————————
  expr(): Expr { return this.ternary(); }

  ternary(): Expr {
    const loc = this.loc();
    const cond = this.or();
    if (this.isOp("?") && this.t.spaced) {
      this.next();
      const yes = this.ternary();
      this.eatOp(":");
      const no = this.ternary();
      return { kind: "ternary", predicate: cond, yes, no, loc };
    }
    return cond;
  }

  or(): Expr {
    let left = this.and();
    while (this.isOp("|") && this.t.spaced && !this.isOp("{", this.peek())) {
      const loc = this.loc(); this.next();
      // a lambda on the right of `|` is not a thing; keep it simple
      const right = this.and();
      left = { kind: "binary", op: "|", left, right, loc };
    }
    return left;
  }

  and(): Expr {
    let left = this.comparison();
    while (this.isOp("&")) {
      const loc = this.loc(); this.next();
      const right = this.comparison();
      left = { kind: "binary", op: "&", left, right, loc };
    }
    return left;
  }

  comparison(): Expr {
    let left = this.additive();
    while (true) {
      const t = this.t;
      if (t.kind === "op" && ["==", "!=", "<", "<=", ">", ">="].includes(t.text) && (t.text !== "<" || t.spaced)) {
        const loc = this.loc(); this.next();
        if (t.text === "==" && this.isOp(".") && this.isId("instance_of", this.peek())) {
          this.next(); this.next();
          const type = this.additive();
          left = { kind: "instance_of", target: left, type, loc };
          continue;
        }
        const right = this.additive();
        left = { kind: "binary", op: t.text, left, right, loc };
        continue;
      }
      if (this.isOp("??")) {
        const loc = this.loc(); this.next();
        const right = this.additive();
        left = { kind: "binary", op: "??", left, right, loc };
        continue;
      }
      break;
    }
    return left;
  }

  additive(): Expr {
    let left = this.multiplicative();
    while ((this.isOp("+") || this.isOp("-")) && this.t.spaced) {
      const loc = this.loc(); const op = this.next().text;
      const right = this.multiplicative();
      left = { kind: "binary", op, left, right, loc };
    }
    return left;
  }

  multiplicative(): Expr {
    let left = this.unary();
    while ((this.isOp("*") || this.isOp("/") || this.isOp("%")) && this.t.spaced) {
      const loc = this.loc(); const op = this.next().text;
      const right = this.unary();
      left = { kind: "binary", op, left, right, loc };
    }
    return left;
  }

  unary(): Expr {
    const loc = this.loc();
    if (this.isOp("!")) { this.next(); return { kind: "unary", op: "!", operand: this.unary(), loc }; }
    return this.power();
  }

  /* `a ^ b`, binding tighter than `*`, to the right */
  power(): Expr {
    const base = this.unaryTail();
    if (this.isOp("^") && this.t.spaced) {
      const loc = this.loc(); this.next();
      const right = this.power();
      return { kind: "binary", op: "^", left: base, right, loc };
    }
    return base;
  }

  unaryTail(): Expr {
    const loc = this.loc();
    if (this.isOp("-") && !this.t.spaced || (this.isOp("-") && (this.peek().kind === "num" || this.peek().kind === "id" || this.isOp("(", this.peek())) && !this.peek().spaced)) {
      this.next(); return { kind: "unary", op: "-", operand: this.unary(), loc };
    }
    return this.postfix();
  }

  postfix(): Expr {
    let e = this.primary();
    while (true) {
      const loc = this.loc();
      if (this.isOp(".") || this.isOp("?.")) {
        const optional = this.next().text === "?.";
        const nt = this.next();
        if (nt.kind === "id") { e = { kind: "member", target: e, name: nt.text, optional, loc }; continue; }
        if (nt.kind === "op" && OPERATOR_NAMES.has(nt.text)) { e = { kind: "member", target: e, name: nt.text, optional, loc }; continue; }
        if (nt.kind === "op" && nt.text === "(") {
          // `.(a & b)` distribution: member over a superposition of names
          const inner = this.expr();
          this.eatOp(")");
          e = { kind: "member", target: e, name: "(" , optional, loc } as Expr;
          (e as any).distribute = inner;
          continue;
        }
        this.err("expected member name", nt);
      }
      if (this.isOp("(") && this.adjacent()) { e = { kind: "call", target: e, args: this.args(), optional: false, loc }; continue; }
      if (this.isOp("?") && this.adjacent() && this.isOp("(", this.peek()) && this.adjacent(this.peek())) {
        this.next(); e = { kind: "call", target: e, args: this.args(), optional: true, loc }; continue;
      }
      if (this.isOp("[") && this.adjacent()) {
        this.next();
        const at = this.expr();
        this.eatOp("]");
        e = at.kind === "string" ? { kind: "dynamic", target: e, name: at, loc } : { kind: "index", target: e, at, loc };
        continue;
      }
      if (this.isOp("<") && this.adjacent() && this.looksLikeConfig()) {
        this.next();
        const config = this.configList();
        e = { kind: "configure", target: e, config, loc };
        continue;
      }
      if (this.isOp("{") && this.adjacent() && (e.kind === "name" || e.kind === "member")) {
        this.next();
        const predicate = this.expr();
        this.eatOp("}");
        e = { kind: "filter", target: e, predicate, loc };
        continue;
      }
      if (this.isOp("?") && this.adjacent() && !this.isOp(":", this.peek()) && (this.isOp(".", this.peek()) || this.isOp("?.", this.peek()) || this.isOp(")", this.peek()) || this.isOp(",", this.peek()) || this.isOp("]", this.peek()) || this.is("nl", undefined, this.peek()) || this.isOp("}", this.peek()))) {
        this.next(); e = { kind: "optional", target: e, loc }; continue;
      }
      if (this.isOp("#") && this.adjacent()) { this.next(); e = { kind: "many", target: e, loc }; continue; }
      if (this.isId("as") && this.t.spaced) {
        this.next();
        const type = this.type();
        e = { kind: "as", target: e, type, loc };
        continue;
      }
      break;
    }
    return e;
  }

  /** `<local: &caller, break: return>` - a `<` that opens a config list: `name:` follows */
  looksLikeConfig(): boolean {
    const a = this.peek(), b = this.peek(2);
    return (a.kind === "id" && this.isOp(":", b)) || (a.kind === "op" && a.text === ".");
  }

  configList(): Arg[] {
    const out: Arg[] = [];
    while (!this.isOp(">")) {
      this.acceptOp(".");
      const name = this.eat("id").text;
      this.eatOp(":");
      const value = this.configValue();
      out.push({ name, value });
      if (!this.acceptOp(",")) break;
    }
    this.eatOp(">");
    return out;
  }

  /** a config value is an expression that must not swallow the closing `>` */
  configValue(): Expr {
    const loc = this.loc();
    if (this.t.kind === "ctx") { const t = this.next(); return { kind: "context", name: t.text, loc }; }
    if (this.isId("return")) { this.next(); return { kind: "name", name: "return", loc }; }
    return this.postfix();
  }

  args(): Arg[] {
    this.eatOp("(");
    const out: Arg[] = [];
    this.skipNl();
    while (!this.isOp(")")) {
      if (this.t.kind === "id" && this.isOp(":", this.peek()) && !this.isOp("=", this.peek(2))) {
        const name = this.next().text; this.next();
        out.push({ name, value: this.expr() });
      } else out.push({ value: this.expr() });
      this.skipNl();
      if (!this.acceptOp(",")) break;
      this.skipNl();
    }
    this.eatOp(")");
    return out;
  }

  primary(): Expr {
    const loc = this.loc();
    const t = this.t;
    switch (t.kind) {
      case "num": this.next(); return { kind: "number", value: t.text, loc };
      case "str": this.next(); return { kind: "string", parts: this.interpolate(t.text, loc), loc };
      case "tick": this.next(); return { kind: "string", parts: [t.text], loc };
      case "path": this.next(); return { kind: "path", value: t.text, parts: this.interpolate(t.text, loc), loc } as Expr;
      case "ctx": this.next(); return { kind: "context", name: t.text, loc };
      case "id": break;
      case "op": break;
      default: this.err("expected expression");
    }
    if (t.kind === "op") {
      if (t.text === "(") {
        if (this.looksLikeLambda()) return this.lambda();
        this.next(); this.skipNl();
        const e = this.expr();
        this.skipNl();
        this.eatOp(")");
        return { kind: "paren", inner: e, loc };
      }
      if (t.text === "[") {
        this.next();
        const items: Expr[] = [];
        this.skipNl();
        while (!this.isOp("]")) { items.push(this.expr()); this.skipNl(); if (!this.acceptOp(",")) break; this.skipNl(); }
        this.eatOp("]");
        return { kind: "list", items, loc };
      }
      if (t.text === "{") {
        // an object/block literal `{ }` used as a value (e.g. `runtime: { }`), or a block body
        const body = this.block();
        return { kind: "block", body, loc };
      }
      if (t.text === "<") {
        // `<local: &caller>(params) => body`
        this.next();
        const config = this.configList();
        const l = this.lambda();
        (l as any).config = config;
        return l;
      }
      if (t.text === "*") { this.next(); return { kind: "name", name: "*", loc }; }
      this.err("expected expression");
    }
    // identifiers
    switch (t.text) {
      case "this": this.next(); return { kind: "this", loc };
      case "if": if (this.isOp("(", this.peek()) && !this.peek().spaced) break; return this.ifExpr();
      case "unless": {
        this.next();
        const predicate = this.condition();
        const yes = this.stmtBody();
        return { kind: "unless", predicate, yes, loc };
      }
      case "while": {
        this.next();
        const predicate = this.condition();
        const d = this.stmtBody();
        return { kind: "while", predicate, do: d, loc };
      }
      case "class": return this.classExpr();
      case "enum": return this.enumExpr();
      case "draw": {
        if (this.isOp("(", this.peek())) {
          this.next();
          const a = this.args();
          if (a.length !== 2) this.err("draw takes weights and outcomes");
          return { kind: "draw", weights: a[0].value, outcomes: a[1].value, loc };
        }
        break;
      }
    }
    // `x => body` lambda
    if (this.isOp("=>", this.peek())) return this.lambda();
    this.next();
    return { kind: "name", name: t.text, loc };
  }

  /** the condition of `if p {` - an expression that stops before the `{` body */
  condition(): Expr {
    // parenthesised or not; the `{` that follows a name is a filter only when adjacent, so a spaced `{` ends it
    return this.expr();
  }

  ifExpr(): Expr {
    const loc = this.loc();
    this.next(); // if
    const predicate = this.condition();
    const yes = this.stmtBody();
    let no: Body | undefined;
    // `else` / `elsif` may follow on the same line or after a newline
    const save = this.i;
    this.skipNl();
    if (this.isId("elsif")) {
      const inner = this.ifExpr();
      // `elsif` reuses the if node: the tail is another if
      const b: Block = { kind: "program", statements: [{ kind: "expr", expr: inner, loc: inner.loc }], loc: inner.loc };
      no = b;
    } else if (this.isId("else")) {
      this.next();
      no = this.stmtBody();
    } else this.i = save;
    return { kind: "if", predicate, yes, no, loc };
  }

  looksLikeLambda(): boolean {
    // `(` ... matching `)` followed by `=>` or `:` Type `=>`
    let depth = 0, j = this.i;
    for (; j < this.toks.length; j++) {
      const t = this.toks[j];
      if (t.kind === "op" && (t.text === "(" || t.text === "[" || t.text === "{")) depth++;
      else if (t.kind === "op" && (t.text === ")" || t.text === "]" || t.text === "}")) { depth--; if (depth === 0) break; }
      else if (t.kind === "eof") return false;
    }
    const after = this.toks[j + 1];
    if (!after) return false;
    if (after.kind === "op" && after.text === "=>") return true;
    if (after.kind === "op" && after.text === ":") {
      // `(x): T => ...` : scan to `=>` before newline
      for (let k = j + 2; k < this.toks.length; k++) {
        const t = this.toks[k];
        if (t.kind === "nl" || t.kind === "eof") return false;
        if (t.kind === "op" && t.text === "=>") return true;
        if (t.kind === "op" && (t.text === "(" || t.text === ")" || t.text === "," )) return false;
      }
    }
    return false;
  }

  lambda(): Expr {
    const loc = this.loc();
    let params: Param[];
    if (this.isOp("(")) params = this.params();
    else { const n = this.eat("id"); params = [{ name: n.text, optional: false, loc }]; }
    let returns: Type | undefined;
    if (this.acceptOp(":")) returns = this.type();
    this.eatOp("=>");
    this.skipNl();
    const body = this.body();
    return { kind: "lambda", params, returns, body, loc };
  }

  classExpr(): Expr {
    const loc = this.loc();
    this.next(); // class
    let ctor: Param[] | undefined;
    if (this.isOp("(")) ctor = this.params();
    const parents: Type[] = [];
    const parts: Part[] = [];
    if (this.acceptOp("<")) {
      while (true) {
        if (this.t.kind === "str") { parts.push({ literal: this.next().text }); }
        else if (this.t.kind === "id" && this.isOp(":", this.peek())) {
          const name = this.next().text; this.next();
          parts.push({ name, type: this.type() });
        } else parents.push(this.type());
        if (!this.acceptOp(",")) break;
      }
    }
    const body = this.isOp("{") ? this.block() : { kind: "program" as const, statements: [], loc };
    return { kind: "class", ctor, parents, parts, body, loc };
  }

  enumExpr(): Expr {
    const loc = this.loc();
    this.next(); // enum
    const variants: Expr[] = [];
    while (!this.isOp("{") && !this.is("nl")) {
      variants.push(this.postfix());
      if (!this.acceptOp("|")) break;
    }
    const body = this.isOp("{") ? this.block() : { kind: "program" as const, statements: [], loc };
    return { kind: "enum", variants, body, loc };
  }

  /** "text {expr} more" - `{{`/`}}` are literal braces */
  interpolate(s: string, loc: Loc): (string | Expr)[] {
    const parts: (string | Expr)[] = [];
    let cur = "";
    for (let k = 0; k < s.length; k++) {
      const c = s[k];
      if (c === "{" && s[k + 1] === "{") { cur += "{"; k++; continue; }
      if (c === "}" && s[k + 1] === "}") { cur += "}"; k++; continue; }
      if (c === "{") {
        let depth = 1, j = k + 1;
        for (; j < s.length && depth > 0; j++) { if (s[j] === "{") depth++; else if (s[j] === "}") depth--; }
        const inner = s.slice(k + 1, j - 1);
        if (cur) parts.push(cur);
        cur = "";
        parts.push(parseExpression(inner, loc.file));
        k = j - 1;
        continue;
      }
      cur += c;
    }
    if (cur || !parts.length) parts.push(cur);
    return parts;
  }
}
