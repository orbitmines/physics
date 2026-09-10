/**
 * EMISSION: `program.as(language)`.
 *
 * A Language's body holds map rules `{ <Ray with holes> } => "<target text>"`. The left side is
 * literal Ray syntax; an identifier the pattern does not KNOW (no class, member, or definition of
 * that name anywhere loaded) is a hole and binds whatever stands there; a known name is literal.
 * The most literal structure wins. `{x}` in the target writes a bound part, itself emitted; a
 * sequence hole is joined by the language's `{separator}` rule, a block hole is one statement a
 * line, indented by its `{indent}` rule. Rewrite rules `{ pattern } => { replacement }` (Ray to
 * Ray, e.g. the goto lowering of Rewrite.ray) are applied before emission where the language has
 * no rule for the construct itself.
 */
import { Arg, Block, Body, Expr, Loc, Param, Stmt, Type, isBlock } from "./ast.ts";
import { parse, parseExpression } from "./parser.ts";
import { Many, RayClass, RayError, RayObject, Runtime, Value } from "./runtime.ts";

type Node = Expr | Stmt | Block | Type | Param | Arg;
type Bindings = Map<string, Node | Node[] | string>;

export type MapRule = { pattern: Block; target: Expr; text?: string; replacement?: Block; specificity: number; root: string };

const RESERVED = new Set(["separator", "indent", "newline", "statement_end", "interpolation", "named_arg", "parameter", "parameter_untyped", "parameter_default", "empty_block", "dynamic_get", "dynamic_set", "lambda_hoist", "whole"]);

export class Emitter {
  known = new Set<string>();
  rulesByLanguage = new Map<RayClass, MapRule[]>();
  /** the parameters of the lambdas being emitted, innermost last - what an inner lambda captures */
  scopeParams: string[][] = [];
  /** functions hoisted out of the statement being emitted (a language without block lambdas) */
  hoisted: string[][] = [];
  hoistCount = 0;

  constructor(public rt: Runtime) {
    this.collectKnown();
  }

  /** every name that is literal in a pattern: classes, their members and statics, global definitions */
  collectKnown() {
    for (const [name, cls] of this.rt.classes) {
      this.known.add(name);
      for (const m of cls.members) if ("name" in m && typeof m.name === "string") this.known.add(m.name);
      for (const part of cls.parts) if (part.name) this.known.add(part.name);
      if (cls.ctor) for (const p of cls.ctor) this.known.add(p.name);
      for (const k of cls.statics.keys()) this.known.add(k);
      for (const k of cls.aliases.keys()) this.known.add(k);
    }
    for (const k of this.rt.global.vars.keys()) this.known.add(k);
    for (const m of this.rt.universal) if ("name" in m) this.known.add(m.name as string);
    this.known.add("this"); this.known.add("true"); this.known.add("false"); this.known.add("None");
    this.known.add("start"); this.known.add("end"); this.known.add("result"); this.known.add("state"); this.known.add("*");
    this.known.add("Class");   // in a pattern, `Class(args)` is a call to any class - construction
    for (const k of ["choose", "rule", "visual", "theorem", "test", "data"]) this.known.add(k);   // keywords
    for (const cls of this.rt.classes.values()) for (const m of cls.members) if (m.kind === "rule" && (m as any).rate) this.known.add((m as any).rate);   // a rule's rate is a symbol
  }

  isHole(name: string): boolean { return !this.known.has(name); }

  /** the language's rules, its parents' included, once */
  rules(language: RayClass): MapRule[] {
    if (this.rulesByLanguage.has(language)) return this.rulesByLanguage.get(language)!;
    const out: MapRule[] = [];
    for (const cls of this.rt.allParents(language)) {
      for (const r of this.rt.mapRules.get(cls) ?? []) out.push(this.compile(r.pattern, r.target));
    }
    this.rulesByLanguage.set(language, out);
    return out;
  }

  private compiled = new Map<Block, MapRule>();
  compile(pattern: Block, target: Expr): MapRule {
    // one MapRule per written rule, so that "produced by this rule" means the same rule next time
    const cached = this.compiled.get(pattern);
    if (cached && cached.target === target) return cached;
    const rule = this.compileFresh(pattern, target);
    this.compiled.set(pattern, rule);
    return rule;
  }

  private compileFresh(pattern: Block, target: Expr): MapRule {
    const root = this.rootOf(pattern);
    const rule: MapRule = { pattern, target, specificity: this.specificity(pattern), root };
    if (target.kind === "string") rule.text = undefined; // rendered per match (interpolation holes)
    if (target.kind === "block") rule.replacement = target.body;
    return rule;
  }

  /** what a pattern is about, for a quick first filter */
  rootOf(pattern: Block): string {
    if (pattern.statements.length !== 1) return "program";
    const s = pattern.statements[0];
    if (s.kind === "expr") {
      if (s.expr.kind === "type_expr") return "type";
      if (s.expr.kind === "name") return this.isHole(s.expr.name) ? "any" : "name";
      return s.expr.kind;
    }
    return s.kind;
  }

  specificity(n: Node | Node[] | undefined): number {
    if (!n) return 0;
    if (Array.isArray(n)) return n.length === 0 ? 1 : n.reduce((a, x) => a + this.specificity(x), 0);
    if (this.holeOf(n)) return 0;
    if ((n as any).kind === "name") return this.isHole((n as any).name) ? 0 : 2;
    let s = 1;
    for (const [k, v] of Object.entries(n)) {
      if (k === "loc" || k === "kind") continue;
      if (v && typeof v === "object") s += this.specificity(v as any);
      else if (typeof v === "string" && (k === "name" || k === "op" || k === "label" || k === "value" || k === "id")) s += this.isHole(v) ? 0 : 1;
    }
    return s;
  }

  // ——— matching ————————————————————————————————————————————————————————————

  match(pattern: Node | Node[] | undefined, node: Node | Node[] | undefined, b: Bindings): boolean {
    if (pattern === undefined || pattern === null) return node === undefined || node === null || (Array.isArray(node) && node.length === 0);
    if (typeof pattern === "string") return typeof node === "string" && this.matchName(pattern, node, b);
    if (Array.isArray(pattern)) {
      // a list: a single hole binds the whole sequence; otherwise positional
      if (pattern.length === 1 && this.holeOf(pattern[0])) {
        if (node === undefined) node = [];
        return this.bind(b, this.holeOf(pattern[0])!, Array.isArray(node) ? node : [node]);
      }
      if (!Array.isArray(node) || node.length !== pattern.length) return false;
      const items = node;
      return pattern.every((p, i) => this.match(p, items[i], b));
    }
    const hole = this.holeOf(pattern);
    if (hole) return node !== undefined && node !== null && this.bind(b, hole, node as Node);
    if ((pattern as any).kind !== "paren" && (node as any)?.kind === "paren") return this.match(pattern, (node as any).inner, b);
    if (node === undefined || node === null || Array.isArray(node)) {
      // a block pattern `{ stmt }` against a body
      return false;
    }
    const p = pattern as any, n = node as any;
    // a block pattern with one expression statement matches that expression, or a block with that one statement
    if (p.kind === "program" && n.kind !== "program") {
      if (p.statements.length !== 1) return false;
      const only = p.statements[0];
      if (only.kind === "expr" && !only.predicate) return this.isStatement(n) && n.kind !== "expr" ? false : this.match(n.kind === "expr" ? only : only.expr, node, b);
      return this.match(only, node, b);
    }
    if (p.kind !== "program" && n.kind === "program" && n.statements.length === 1 && n.statements[0].kind === "expr") {
      return this.match(pattern, n.statements[0].expr, b);
    }
    if (n.kind === "type" && p.kind !== "type") {
      // a type against an expression-shaped pattern: `{N}` (a name), `{ty?}` (optional), `{*}`
      if (p.kind === "type_expr") return this.match(p.type, n, b);
      if (p.kind === "name") return this.match({ kind: "type", name: p.name, array: 0, optional: false, loc: p.loc } as Type, n, b);
      if (p.kind === "optional" && p.target.kind === "name") return this.match({ kind: "type", name: p.target.name, array: 0, optional: true, loc: p.loc } as Type, n, b);
      return false;
    }
    if (p.kind === "type_expr" && n.kind !== "type") return false;
    if (p.kind !== n.kind) return false;
    switch (p.kind) {
      case "program": {
        // a statement-list hole is a BLOCK: it renders as lines, and as the language's `empty_block` when empty
        if (p.statements.length === 1 && this.holeOf(p.statements[0])) { const arr: any = [...n.statements]; arr.__block = true; return this.bind(b, this.holeOf(p.statements[0])!, arr); }
        return this.match(p.statements, n.statements, b);
      }
      case "expr": return this.match(p.expr, n.expr, b) && this.matchOpt(p.predicate, n.predicate, b);
      case "name":
        if (p.name === "Class" && n.name !== "Class") return this.rt.classes.has(n.name) && this.bind(b, "Class", n.name);
        return p.name === n.name;
      case "number": return p.value === n.value;
      case "string": {
        // `"text"` with one unknown word: a hole for the whole string's parts
        if (p.parts.length === 1 && typeof p.parts[0] === "string" && /^[A-Za-z_]\w*$/.test(p.parts[0]) && this.isHole(p.parts[0])) return this.bind(b, p.parts[0], n.parts);
        return JSON.stringify(p.parts) === JSON.stringify(n.parts);
      }
      case "path": return p.value === n.value;
      case "this": return true;
      case "context": return p.name === n.name;
      case "list": return this.match(p.items, n.items, b);
      case "member": return this.match(p.target, n.target, b) && this.matchName(p.name, n.name, b) && !!p.optional === !!n.optional;
      case "dynamic": return this.match(p.target, n.target, b) && this.match(p.name, n.name, b);
      case "index": return this.match(p.target, n.target, b) && this.match(p.at, n.at, b);
      case "call": {
        if (p.target.kind === "name" && p.target.name === "Class" && n.target.kind === "member" && n.target.target.kind === "name") {
          const outer = this.rt.classes.get(n.target.target.name);
          const inner = outer?.findStatic(n.target.name);
          if (inner instanceof RayClass) return this.bind(b, "Class", `${n.target.target.name}.${n.target.name}`) && this.match(p.args, n.args, b);
        }
        return this.match(p.target, n.target, b) && this.match(p.args, n.args, b);
      }
      case "configure": return this.match(p.target, n.target, b) && this.match(p.config, n.config, b);
      case "filter": return this.match(p.target, n.target, b) && this.match(p.predicate, n.predicate, b);
      case "optional": case "many": return this.match(p.target, n.target, b);
      case "paren": return this.match(p.inner, n.inner, b);
      case "unary": return p.op === n.op && this.match(p.operand, n.operand, b);
      case "binary": return p.op === n.op && this.match(p.left, n.left, b) && this.match(p.right, n.right, b);
      case "instance_of": return this.match(p.target, n.target, b) && this.match(p.type, n.type, b);
      case "as": return this.match(p.target, n.target, b) && this.match(p.type, n.type, b);
      case "ternary": return this.match(p.predicate, n.predicate, b) && this.match(p.yes, n.yes, b) && this.match(p.no, n.no, b);
      case "lambda": return this.match(p.params, n.params, b) && this.matchBody(p.body, n.body, b, true);
      case "block": return this.match(p.body, n.body, b);
      case "class": return this.match(p.parents, n.parents, b) && this.match(p.parts, n.parts, b) && this.match(p.body, n.body, b) && this.matchOpt(p.ctor, n.ctor, b);
      case "enum": return this.match(p.variants, n.variants, b) && this.match(p.body.statements, n.body.statements, b);
      case "if": return this.match(p.predicate, n.predicate, b) && this.matchBody(p.yes, n.yes, b) && this.matchOptBody(p.no, n.no, b);
      case "unless": return this.match(p.predicate, n.predicate, b) && this.matchBody(p.yes, n.yes, b);
      case "while": return this.match(p.predicate, n.predicate, b) && this.matchBody(p.do, n.do, b);
      case "draw": return this.match(p.weights, n.weights, b) && this.match(p.outcomes, n.outcomes, b);
      case "type_expr": return this.match(p.type, n.type, b);
      // statements
      case "label": return this.matchName(p.name, n.name, b);
      case "goto": return this.matchName(p.label, n.label, b) && this.matchOpt(p.predicate, n.predicate, b);
      case "return": return this.matchOpt(p.value, n.value, b) && this.matchOpt(p.predicate, n.predicate, b);
      case "recur": return true;
      case "assert": return this.match(p.requirement, n.requirement, b);
      case "define": return this.matchName(p.names[0], n.names[0], b) && this.matchOptType(p.type, n.type, b) && this.matchOpt(p.value, n.value, b)
        && (p.modifiers.includes("static") === n.modifiers.includes("static"));
      case "assign": return this.match(p.target, n.target, b) && this.match(p.value, n.value, b);
      case "extend": return this.match(p.target, n.target, b) && this.match(p.body.statements, n.body.statements, b);
      case "method": return this.matchName(p.names[0], n.names[0], b) && this.match(p.params, n.params, b) && this.matchOptType(p.returns, n.returns, b) && this.matchOptBody(p.body, n.body, b)
        && (p.modifiers.includes("static") === n.modifiers.includes("static"));
      case "rule": return this.matchName(p.id.replace(/^\//, ""), n.id.replace(/^\//, ""), b) && this.matchName(p.name, n.name, b) && this.match(p.params, n.params, b) && this.matchBody(p.body, n.body, b)
        && (p.rate === undefined || (n.rate !== undefined && this.matchName(p.rate, n.rate, b)));
      case "named": return p.keyword === n.keyword && this.matchName(p.name, n.name, b) && this.match(p.params, n.params, b) && this.matchOptType(p.returns, n.returns, b) && this.matchOptBody(p.body, n.body, b);
      case "conversion": return this.match(p.type, n.type, b) && this.matchBody(p.body, n.body, b);
      case "index_method": return this.match(p.params, n.params, b) && this.matchBody(p.body, n.body, b);
      // types and parameters
      case "type": {
        if (this.isHole(p.name) && !p.array && !p.optional && !p.filter && !p.fn && !p.tuple && !p.union) return this.bind(b, p.name, node as Node);
        if (p.array !== n.array) {
          // `T[]` against `N[][]`: the hole takes the rest
          if (p.array > 0 && n.array >= p.array && this.isHole(p.name) && !p.filter) return this.bind(b, p.name, { ...n, array: n.array - p.array } as Type);
          return false;
        }
        if (!!p.optional !== !!n.optional) return false;
        if (p.array > 0 && this.isHole(p.name) && !p.filter) return this.bind(b, p.name, { ...n, array: 0 } as Type);
        if (p.optional && this.isHole(p.name)) return this.bind(b, p.name, { ...n, optional: false } as Type);
        if (p.fn) { if (!n.fn) return false; return this.match(p.fn.params, n.fn.params, b) && this.matchOptType(p.fn.returns, n.fn.returns, b); }
        if (p.tuple) { if (!n.tuple) return false; return this.match(p.tuple, n.tuple, b); }
        if (p.union) { if (!n.union) return false; return this.match(p.union, n.union, b); }
        if (p.literal !== undefined) return p.literal === n.literal;
        return p.name === n.name && this.matchOpt(p.filter, n.filter, b) && (p.count === undefined || p.count === n.count);
      }
      case "param": return this.matchName(p.name, n.name, b) && this.matchOptType(p.type, n.type, b);
    }
    // args `{ name?, value }` and parts
    if ("value" in p && "kind" in p === false) return this.matchOpt(p.name, n.name, b) && this.match(p.value, n.value, b);
    return false;
  }

  private holeOf(n: Node | undefined): string | undefined {
    if (!n || typeof n !== "object") return undefined;
    const a = n as any;
    if (a.kind === "paren") return this.holeOf(a.inner);
    if (a.kind === "name" && this.isHole(a.name)) return a.name;
    if (a.kind === "expr" && a.expr?.kind === "name" && !a.predicate && this.isHole(a.expr.name)) return a.expr.name;
    if (a.kind === "program" && a.statements?.length === 1) return this.holeOf(a.statements[0]);
    if (a.kind === "type" && this.isHole(a.name) && !a.array && !a.optional && !a.filter && !a.fn && !a.tuple && !a.union && a.count === undefined) return a.name;
    if (a.kind === undefined && "value" in a && a.name === undefined) return this.holeOf(a.value);   // an argument
    if (a.kind === undefined && "name" in a && "optional" in a && this.isHole(a.name) && !a.type) return a.name;  // a parameter
    return undefined;
  }

  private bind(b: Bindings, name: string, v: Node | Node[] | string): boolean {
    if (b.has(name)) {
      const had = b.get(name)!;
      // a lambda's parameter bound as `v`, then `v` used in its body: the same thing
      const paramName = (x: any): string | undefined => {
        if (Array.isArray(x) && x.length === 1 && x[0] && !("kind" in x[0])) {
          if ("optional" in x[0]) return x[0].name;                                   // a parameter
          if ("value" in x[0] && x[0].name === undefined) return paramName(x[0].value); // an argument
        }
        if (x && !Array.isArray(x) && (x as any).kind === "name") return (x as any).name;
        return typeof x === "string" ? x : undefined;
      };
      if (paramName(had) !== undefined && paramName(had) === paramName(v)) return true;
      return JSON.stringify(strip(had)) === JSON.stringify(strip(v));
    }
    b.set(name, v);
    return true;
  }

  private matchName(p: string, n: string, b: Bindings): boolean {
    if (this.isHole(p)) return this.bind(b, p, n);
    return p === n;
  }
  private matchOpt(p: Node | undefined, n: Node | undefined, b: Bindings): boolean {
    if (p === undefined) return n === undefined;
    return this.match(p, n, b);
  }
  private matchOptType(p: Type | undefined, n: Type | undefined, b: Bindings): boolean {
    if (p === undefined) return n === undefined;
    if (n === undefined) return false;
    return this.match(p, n, b);
  }
  private matchBody(p: Body, n: Body, b: Bindings, lambda = false): boolean {
    const hole = this.holeOf(p);
    if (hole) {
      // of a lambda, `=> e` takes an expression and `=> { stmts }` a block; a method's body may be either
      if (lambda && !isBlock(p) && isBlock(n)) return false;
      return this.bind(b, hole, n);
    }
    return this.match(p, n, b);
  }
  private matchOptBody(p: Body | undefined, n: Body | undefined, b: Bindings): boolean {
    if (p === undefined) return n === undefined;
    if (n === undefined) return false;
    return this.matchBody(p, n, b);
  }

  // ——— emission ————————————————————————————————————————————————————————————

  setting(language: RayClass, name: string, fallback: string): string {
    for (const r of this.rules(language)) {
      const s = r.pattern.statements[0];
      if (r.pattern.statements.length === 1 && s.kind === "expr" && s.expr.kind === "name" && s.expr.name === name && r.target.kind === "string")
        return r.target.parts.map(p => typeof p === "string" ? p : (p.kind === "name" ? `{${p.name}}` : "")).join("");
    }
    return fallback;
  }

  emit(node: Node | Node[] | string | undefined, language: RayClass, depth = 0): string {
    if (node === undefined || node === null) return "";
    if (depth > 400) throw new RayError(`emit: runaway recursion at ${this.describe(node as any)}`, (node as any).loc);
    depth++;
    if (typeof node === "string") return node;
    if (Array.isArray(node)) {
      const parts = node.map(n => this.emit(n, language, depth));
      const allStatements = node.every(n => this.isStatement(n));
      if (allStatements && node.length > 0) return parts.join(this.setting(language, "newline", "\n"));
      return parts.join(this.setting(language, "separator", ", "));
    }
    const n = node as any;
    if (n.kind === "number") {
      // a whole-number literal, where the language writes it otherwise (`{whole} => "{val}.0"` in a shader)
      if (/^[0-9]+$/.test(n.value)) return this.fill(this.setting(language, "whole", "{val}"), { val: n.value });
      return n.value;
    }
    if (n.kind === undefined && "value" in n) {
      // an argument
      const value = this.emit(n.value, language, depth);
      if (n.name === undefined) return value;
      return this.fill(this.setting(language, "named_arg", "{nm}: {val}"), { nm: n.name, val: value });
    }
    if (n.kind === undefined && "name" in n && "optional" in n) {
      // a parameter
      if (n.default) return this.fill(this.setting(language, "parameter_default", "{nm} = {val}"), { nm: n.name, ty: n.type ? this.emit(n.type, language, depth) : "any", val: this.emit(n.default, language, depth) });
      if (n.type) return this.fill(this.setting(language, "parameter", "{nm}: {ty}"), { nm: n.name, ty: this.emit(n.type, language, depth) });
      return this.fill(this.setting(language, "parameter_untyped", "{nm}"), { nm: n.name });
    }
    // a statement with a postfix `if`: `return x if p` is `if p { return x }`
    if (n.predicate && ["goto", "return", "assert", "define", "assign", "expr"].includes(n.kind)) {
      const inner = { ...n, predicate: undefined };
      return this.emit({ kind: "expr", expr: { kind: "if", predicate: n.predicate, yes: { kind: "program", statements: [inner], loc: n.loc }, loc: n.loc }, loc: n.loc } as Stmt, language, depth);
    }
    // `x["name"] = v`: no rule can say this; the language's `dynamic_set` setting does
    if (n.kind === "assign" && n.target.kind === "dynamic") return this.fill(this.setting(language, "dynamic_set", "{tgt}[{key}] = {val}"), { tgt: this.emit(n.target.target, language, depth), key: this.emit(n.target.name, language, depth), val: this.emit(n.value, language, depth) }) + this.setting(language, "statement_end", "");
    if (n.kind === "program") {
      // a language without goto gets the lowering of Rewrite.ray
      if (this.hasGotos(n) && !this.rules(language).some(r => r.root === "goto")) return this.emit(this.lowered(n), language, depth);
      const lines = n.statements.map((s: Stmt) => {
        this.hoisted.push([]);
        const text = this.emit(s, language, depth);
        const before = this.hoisted.pop()!;
        return before.length ? before.join(this.setting(language, "newline", "\n")) + this.setting(language, "newline", "\n") + text : text;
      });
      return lines.join(this.setting(language, "newline", "\n"));
    }
    if (n.kind === "expr") {
      const text = this.emit(n.expr, language, depth);
      const ends = ["if", "while", "unless", "block"].includes(n.expr.kind) ? "" : this.setting(language, "statement_end", "");
      return text + ends;
    }
    // reserved settings are not constructs
    const typeRule = (r: MapRule) => { const st = r.pattern.statements[0]; return r.root === "name" && st.kind === "expr" && st.expr.kind === "name" && this.rt.classes.has(st.expr.name); };
    const candidates = this.rules(language).filter(r => !RESERVED.has(r.root) && (
      (r.root === n.kind && !(n.kind === "name" && typeRule(r))) || (n.kind === "type" && (r.root === "name" || r.root === "optional" || r.root === "type"))));
    let best: { rule: MapRule; b: Bindings } | undefined;
    for (const r of candidates) {
      const b: Bindings = new Map();
      const target = n.kind === "expr" && r.root !== "expr" && !r.pattern.statements[0].hasOwnProperty("expr") ? n : n;
      if (this.match(r.pattern, target, b) && (!best || r.specificity > best.rule.specificity)) best = { rule: r, b };
    }

    // `x["name"]` and `x["name"] = v` with no rule of their own: a member by a string, through the language's settings
    if (!best && n.kind === "dynamic") return this.fill(this.setting(language, "dynamic_get", "{tgt}[{key}]"), { tgt: this.emit(n.target, language, depth), key: this.emit(n.name, language, depth) });
    if (!best && n.kind === "type") {
      if (n.tuple) return "[" + n.tuple.map((t: Type) => this.emit(t, language, depth)).join(", ") + "]";
      if (n.fn) return "((...args: any[]) => any)";
      if (n.union) return n.union.map((t: Type) => this.emit(t, language, depth)).join(" | ");
      return n.name.split(".").pop()! + "[]".repeat(n.array) + (n.optional ? " | null" : "");
    }
    if (!best && n.kind === "name") return n.name;
    if (!best && n.kind === "paren") return "(" + this.emit(n.inner, language, depth) + ")";
    if (!best && n.kind === "lambda" && this.hoisted.length && this.setting(language, "lambda_hoist", "") !== "") {
      // a block lambda where the language has none: a function of its own, before this statement
      const nm = `_fn_${++this.hoistCount}`;
      this.scopeParams.push(n.params.map((p: Param) => p.name));
      const body = this.emitBound(this.returned(n.body) as any, language, depth);
      this.scopeParams.pop();
      const ind = this.setting(language, "indent", "  ");
      this.hoisted[this.hoisted.length - 1].push(this.fill(this.setting(language, "lambda_hoist", ""), { nm, paramlist: this.emit(n.params, language, depth), body: body.split("\n").map(l => l ? ind + l : l).join("\n") }));
      return nm;
    }
    if (!best && n.kind === "number") return n.value;
    if (!best && n.kind === "block") return this.emit(n.body, language, depth);
    if (!best) {
      // the goto lowering, and other rewrites, before giving up
      const rewritten = this.rewrite(n);
      if (rewritten) return this.emit(rewritten, language, depth);
      throw new RayError(`${language.name} has no rule for ${this.describe(n)}`, n.loc);
    }
    if (best.rule.replacement) {
      const replaced = this.substitute(best.rule.replacement, best.b);
      return this.emit(replaced, language, depth);
    }
    if (n.kind === "rule") this.bindRuleParts(n, best.b);
    // `{captures}`: the parameters of enclosing lambdas, for a language that binds late (Python);
    // the parameters this rule itself introduces (a bound lambda, or a bound parameter) are in scope for its body
    const introduced: string[] = n.kind === "lambda" ? n.params.map((p: Param) => p.name) : [];
    // a rule's parameter is its body function's own; its `where` lambda is not inside that scope
    for (const v of n.kind === "rule" ? [] : best.b.values()) {
      if (Array.isArray(v)) { for (const x of v as any[]) if (x && typeof x === "object" && "optional" in x && "name" in x && !("kind" in x)) introduced.push(x.name); }
      else if (v && typeof v === "object" && "optional" in (v as any) && "name" in (v as any) && !("kind" in (v as any))) introduced.push((v as any).name);
    }
    const outer = [...new Set(this.scopeParams.flat().filter(p => !introduced.includes(p)))];
    const own = n.kind === "lambda" ? n.params.length : introduced.length;
    best.b.set("captures", outer.length ? (own ? ", " : "") + outer.map(p => `${p}=${p}`).join(", ") : "");
    this.scopeParams.push(introduced);
    try { return this.render(best.rule.target, best.b, language, depth); } finally { this.scopeParams.pop(); }
  }

  /** what a rule quantifies over, read off its first parameter: `over`, `single`, `where` */
  private bindRuleParts(n: any, b: Bindings) {
    const p: Param | undefined = n.params[0];
    const t = p?.type;
    b.set("over", t ? t.name : "World");
    // one of a kind, unless it is `Ray` without a count - a point's Many rays
    b.set("single", !t || t.count === 1 || t.name !== "Ray" ? "true" : "false");
    if (t?.filter) {
      const it: Expr = { kind: "name", name: "it", loc: t.loc };
      b.set("where", { kind: "lambda", params: [{ name: "it", optional: false, loc: t.loc }], body: this.prefixed(t.filter, it), loc: t.loc } as Expr);
    } else b.set("where", { kind: "name", name: "None", loc: n.loc } as Expr);
  }

  prefixedExpr(e: Expr, name: string): Expr { return this.prefixed(e, { kind: "name", name, loc: e.loc }); }

  /** a filter `emits & vertex.source.spare` read off `it`: every leading member name becomes `it.name` */
  private prefixed(e: Expr, it: Expr): Expr {
    switch (e.kind) {
      case "this": return it;
      case "name": return e.name === "None" || e.name === "true" || e.name === "false" || this.rt.classes.has(e.name) ? e : { kind: "member", target: it, name: e.name, optional: false, loc: e.loc };
      case "member": return { ...e, target: this.prefixed(e.target, it) };
      case "call": return { ...e, target: this.prefixed(e.target, it), args: e.args.map(a => ({ ...a, value: this.prefixed(a.value, it) })) };
      case "lambda": {
        const bound = new Set(e.params.map(p => p.name));
        const inner = (x: Expr): Expr => x.kind === "name" && bound.has(x.name) ? x : this.prefixedSkipping(x, it, bound);
        return { ...e, body: isBlock(e.body) ? e.body : inner(e.body) };
      }
      case "ternary": return { ...e, predicate: this.prefixed(e.predicate, it), yes: this.prefixed(e.yes, it), no: this.prefixed(e.no, it) };
      case "list": return { ...e, items: e.items.map(x => this.prefixed(x, it)) };
      case "paren": return { ...e, inner: this.prefixed(e.inner, it) };
      case "dynamic": return { ...e, target: this.prefixed(e.target, it) };
      case "binary": return { ...e, left: this.prefixed(e.left, it), right: this.prefixed(e.right, it) };
      case "unary": return { ...e, operand: this.prefixed(e.operand, it) };
      case "index": return { ...e, target: this.prefixed(e.target, it), at: this.prefixed(e.at, it) };
      default: return e;
    }
  }

  /** prefixing under a lambda: its own parameters stay bare */
  private prefixedSkipping(e: Expr, it: Expr, bound: Set<string>): Expr {
    const walk = (x: Expr): Expr => {
      switch (x.kind) {
        case "this": return it;
        case "name": return bound.has(x.name) ? x : this.prefixed(x, it);
        case "member": return { ...x, target: walk(x.target) };
        case "call": return { ...x, target: walk(x.target), args: x.args.map(a => ({ ...a, value: walk(a.value) })) };
        case "binary": return { ...x, left: walk(x.left), right: walk(x.right) };
        case "unary": return { ...x, operand: walk(x.operand) };
        case "index": return { ...x, target: walk(x.target), at: walk(x.at) };
        case "lambda": { const b2 = new Set([...bound, ...x.params.map(p => p.name)]); return { ...x, body: isBlock(x.body) ? x.body : this.prefixedSkipping(x.body, it, b2) }; }
        case "ternary": return { ...x, predicate: walk(x.predicate), yes: walk(x.yes), no: walk(x.no) };
        case "list": return { ...x, items: x.items.map(walk) };
        case "paren": return { ...x, inner: walk(x.inner) };
        case "dynamic": return { ...x, target: walk(x.target) };
        default: return x;
      }
    };
    return walk(e);
  }

  private isStatement(n: any): boolean {
    return ["label", "goto", "return", "recur", "assert", "define", "assign", "extend", "method", "rule", "named", "map", "grammar", "conversion", "index_method", "expr"].includes(n.kind);
  }
  private isExpr(n: any): boolean { return !this.isStatement(n) && n.kind !== "type" && n.kind !== "program"; }

  describe(n: any): string {
    if (n.kind === "call") return `call ${this.describe(n.target)}(...)`;
    if (n.kind === "member") return `member .${n.name}`;
    if (n.kind === "binary") return `binary ${n.op}`;
    if (n.kind === "name") return `name ${n.name}`;
    if (n.kind === "define") return `define ${n.names[0]}`;
    if (n.kind === "method") return `method ${n.names[0]}`;
    if (n.kind === "type") return `type ${n.name}${"[]".repeat(n.array)}${n.optional ? "?" : ""}`;
    if (n.kind === "expr") return `expr ${this.describe(n.expr)}`;
    return n.kind;
  }

  /** the target text with `{hole}` filled by the emitted binding; `{{`/`}}` were already unescaped by the lexer */
  private render(target: Expr, b: Bindings, language: RayClass, depth: number): string {
    if (target.kind !== "string") throw new RayError("a map rule's target is text", target.loc);
    let out = "";
    for (const part of target.parts) {
      if (typeof part === "string") { out += part; continue; }
      if (part.kind === "name") {
        const v = b.get(part.name);
        if (v === undefined) throw new RayError(`the rule binds no ${part.name}`, part.loc);
        out += this.emitBound(v, language, depth);
        continue;
      }
      // `{stmts.returned.indent}`-style helpers: members on a hole, applied in order
      if (part.kind === "member") {
        const chain: string[] = [];
        let e: Expr = part;
        while (e.kind === "member") { chain.unshift(e.name); e = e.target; }
        if (e.kind !== "name") throw new RayError(`unsupported interpolation in a map rule`, part.loc);
        let v = b.get(e.name) as Node | Node[] | string | undefined;
        if (v === undefined) throw new RayError(`the rule binds no ${e.name}`, part.loc);
        // helpers on the tree itself come first
        while (chain.length && ["returned", "first", "bare"].includes(chain[0])) {
          const h = chain.shift()!;
          if (h === "returned") v = this.returned(v ?? "");
          if (h === "first") v = Array.isArray(v) ? (v[0] as Node) : v;
          if (h === "bare") { const p: any = Array.isArray(v) ? v[0] : v; v = typeof p === "string" ? p : (p?.name ?? this.emit(p ?? "", language, depth)); }
        }
        let text = this.emitBound(v ?? "", language, depth);
        for (const h of chain) text = this.helper(h, text, language);
        out += text;
        continue;
      }
      throw new RayError(`unsupported interpolation in a map rule`, part.loc);
    }
    return out;
  }

  /** a body whose last expression is returned - what a Ray program's value is */
  returned(v: Node | Node[] | string): Node | Node[] | string {
    if (typeof v === "string") return v;
    if (Array.isArray(v)) {
      const stmts = v as Stmt[];
      if (!stmts.length) return v;
      const last = stmts[stmts.length - 1];
      const isLoop = (e: Expr) => e.kind === "call" && e.target.kind === "member" && e.target.name === "for";
      if (last.kind === "expr" && !last.predicate && !(last.expr.kind === "if" || last.expr.kind === "while" || last.expr.kind === "unless" || isLoop(last.expr)))
        return [...stmts.slice(0, -1), { kind: "return", value: last.expr, loc: last.loc } as Stmt];
      if (last.kind === "expr" && !last.predicate && last.expr.kind === "if") {
        const e = last.expr;
        const ret = (bd: Body | undefined): Body | undefined => bd === undefined ? undefined : isBlock(bd) ? { ...bd, statements: this.returned(bd.statements) as Stmt[] } : { kind: "program", statements: [{ kind: "return", value: bd, loc: bd.loc }], loc: bd.loc };
        return [...stmts.slice(0, -1), { kind: "expr", expr: { ...e, yes: ret(e.yes)!, no: ret(e.no) }, loc: last.loc } as Stmt];
      }
      return v;
    }
    const n = v as any;
    if (n.kind === "program") return { ...n, statements: this.returned(n.statements) };
    if (this.isStatement(n)) return this.returned([n]);
    // an expression: returned
    return [{ kind: "return", value: n, loc: n.loc } as Stmt];
  }

  static METHOD_NAMES: Record<string, string> = {
    "+": "plus", "-": "minus", "*": "times", "/": "over", "%": "mod", "<": "lt", "<=": "le", ">": "gt", ">=": "ge",
    "==": "equals", "!=": "differs", "!": "not", "&": "and", "|": "or", "~": "filter", "??": "or_else", "?": "choose", "()": "call",
  };

  private fill(template: string, parts: Record<string, string>): string {
    return template.replace(/\{(\w+)\}/g, (m, k) => parts[k] ?? m);
  }

  private helper(name: string, text: string, language: RayClass): string {
    switch (name) {
      case "method": return Emitter.METHOD_NAMES[text] ?? text;
      case "indent": { const ind = this.setting(language, "indent", "  "); return text.split("\n").map(l => l ? ind + l : l).join("\n"); }
      case "snake": return text.replace(/-/g, "_").replace(/\./g, "_");
      case "camel": return text.split(/[_\-.]/).filter(Boolean).map(w => w[0].toUpperCase() + w.slice(1)).join("");
      case "upper": return text.toUpperCase();
      case "lower": return text.toLowerCase();
      case "quoted": return JSON.stringify(text);
      case "capitalised": return text ? text[0].toUpperCase() + text.slice(1) : text;
      case "identifier": return text.replace(/[^A-Za-z0-9_]/g, "_");
      case "length": return String(text.length);
      default: throw new RayError(`no helper .${name} in a map rule`);
    }
  }

  private emitBound(v: Node | Node[] | string, language: RayClass, depth: number): string {
    if (typeof v === "string") return v;
    // an empty block: what the language writes for nothing (Python: `pass`)
    if (Array.isArray(v) && v.length === 0 && (v as any).__block) return this.setting(language, "empty_block", "");
    if (!Array.isArray(v) && (v as any).kind === "program" && (v as any).statements.length === 0) return this.setting(language, "empty_block", "");
    if (Array.isArray(v) && v.some(p => typeof p === "string")) {
      // string parts: text pieces escaped, expression pieces through the language's `{interpolation}` rule
      const wrap = this.setting(language, "interpolation", "{x}");
      // a language whose interpolation is written with braces (an f-string) needs literal braces doubled
      const braces = wrap.startsWith("{");
      const text = (p: string) => { const e = this.escape(p); return braces ? e.replace(/\{/g, "{{").replace(/\}/g, "}}") : e; };
      return (v as any[]).map(p => typeof p === "string" ? text(p) : wrap.replace("{x}", this.emit(p, language, depth))).join("");
    }
    return this.emit(v, language, depth);
  }

  private escape(s: string): string {
    return s.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/`/g, "\\`").replace(/\n/g, "\\n").replace(/\t/g, "\\t").replace(/\$\{/g, "\\${");
  }

  // ——— optimization: the search for a better program ————————————————————————————
  /**
   * The rewrite rules of the projects (`force`/`suggest`/`approx {p} => {r}`) and of the language
   * (map rules whose target is a block), applied to a tree: `force` everywhere to a fixpoint, then
   * `suggest` wherever the language's cost prefers the result, again to a fixpoint. `approx` only
   * when the language allows it (`approximations = true`).
   */
  optimize(node: any, language?: RayClass): any {
    const rules: MapRule[] = [];
    for (const r of this.rt.rewrites) { const c = this.compile(r.pattern, r.target) as any; c.strength = r.strength; rules.push(c); }
    if (language) for (const cls of this.rt.allParents(language)) for (const r of this.rt.mapRules.get(cls) ?? []) if (r.target.kind === "block") { const c = this.compile(r.pattern, r.target) as any; c.strength = r.strength ?? "force"; rules.push(c); }
    const usable = rules.filter(r => r.replacement && r.root !== "any" && r.root !== "program" && (r as any).strength !== "approx" || (language && this.allowsApprox(language)));
    let out = node;
    for (let round = 0; round < 8; round++) {
      const before = JSON.stringify(strip(out));
      out = this.applyRules(out, usable.filter(r => (r as any).strength === "force"), language, false);
      out = this.applyRules(out, usable.filter(r => (r as any).strength !== "force"), language, true);
      if (JSON.stringify(strip(out)) === before) break;
    }
    return out;
  }

  private allowsApprox(language: RayClass): boolean { return language.findStatic("approximations") === true; }

  /** the cost of a program in a language: its `cost` method if it has one, else the size of the tree */
  cost(node: any, language?: RayClass): number {
    if (language) {
      const m = language.find("cost");
      if (m && m.kind === "method" && m.body) {
        const v = this.rt.call(this.rt.bind(m, language), [{ value: this.rt.program(node, this.rt.global, null, []) }], this.rt.global, m.loc);
        if (typeof v === "number") return v;
      }
    }
    return JSON.stringify(strip(node)).length;
  }

  /** one bottom-up pass; a rewritten statement may become several (a block splices into its list) */
  private produced = new WeakMap<object, Set<MapRule>>();
  private applyRules(node: any, rules: MapRule[], language: RayClass | undefined, byCost: boolean): any {
    if (node === null || typeof node !== "object") return node;
    if (Array.isArray(node)) {
      const out: any[] = [];
      for (const x of node) {
        const y = this.applyRules(x, rules, language, byCost);
        if (y && y.kind === "expr" && y.expr?.kind === "block" && x?.kind !== "expr") out.push(...y.expr.body.statements);
        else if (y && y.kind === "program" && x?.kind !== "program") out.push(...y.statements);
        else out.push(y);
      }
      return out;
    }
    const rebuilt: any = {};
    for (const [k, v] of Object.entries(node)) rebuilt[k] = k === "loc" ? v : this.applyRules(v, rules, language, byCost);
    let current = rebuilt;
    if (this.produced.has(node)) this.produced.set(current, this.produced.get(node)!);
    for (const r of rules) {
      if (r.root !== current.kind && !(current.kind === "expr" && r.root !== "program")) continue;
      if (this.produced.get(current)?.has(r)) continue;   // its own output, or a copy of it
      const b: Bindings = new Map();
      if (!this.match(r.pattern, current, b)) continue;
      let replaced = this.substitute(r.replacement, b);
      // several statements can only stand where a statement stood
      if (replaced.kind === "program" && replaced.statements.length !== 1 && current.kind !== "expr" && !this.isStatement(current)) continue;
      // a statement pattern replaced by a block: the statements take its place
      if (current.kind === "expr" && replaced.kind === "program") replaced = replaced.statements.length === 1 ? replaced.statements[0] : { kind: "expr", expr: { kind: "block", body: replaced, loc: current.loc }, loc: current.loc };
      else if (this.isStatement(current) && replaced.kind === "program") replaced = replaced.statements.length === 1 ? replaced.statements[0] : { kind: "expr", expr: { kind: "block", body: replaced, loc: current.loc }, loc: current.loc };
      else if (replaced.kind === "program" && replaced.statements.length === 1 && replaced.statements[0].kind === "expr") replaced = replaced.statements[0].expr;
      if (byCost && this.cost(replaced, language) >= this.cost(current, language)) continue;
      const mark = (x: any) => { if (x && typeof x === "object") { if (!this.produced.has(x)) this.produced.set(x, new Set()); this.produced.get(x)!.add(r); if (Array.isArray(x)) x.forEach(mark); else for (const [k, v] of Object.entries(x)) if (k !== "loc") mark(v); } };
      mark(replaced);
      current = replaced;
    }
    return current;
  }

  // ——— rewrites (Ray -> Ray) ————————————————————————————————————————————————
  rewrite(n: any): Node | undefined {
    for (const r of this.rt.rewrites) {
      const rule = this.compile(r.pattern, r.target);
      if (!rule.replacement) continue;
      if (rule.root === "any" || rule.root === "goto" || rule.root === "label" || rule.root === "program") continue;  // the goto lowering is applied structurally, see lowered()
      if (r.strength !== "force") continue;
      const b: Bindings = new Map();
      if (this.match(rule.pattern, n, b)) return this.substitute(rule.replacement, b);
    }
    return undefined;
  }

  /** a program written with gotos, labels or recur, as Rewrite.ray's three rules compose: one loop over a state */
  lowered(block: Block): Block {
    const loc = block.loc;
    const name = (s: string): Expr => ({ kind: "name", name: s, loc });
    const str = (s: string): Expr => ({ kind: "string", parts: [s], loc });
    const assignState = (to: string): Stmt => ({ kind: "assign", target: name("state"), value: str(to), loc });
    // segments: `start` up to the first label, then one per label
    const segments: { label: string; stmts: Stmt[] }[] = [{ label: "start", stmts: [] }];
    for (const st of block.statements) {
      if (st.kind === "label") { segments.push({ label: st.name, stmts: [] }); continue; }
      segments[segments.length - 1].stmts.push(st);
    }
    const lowerStmt = (st: Stmt): Stmt => {
      if (st.kind === "goto") {
        const jump: Stmt[] = [assignState(st.label), { kind: "recur", loc }];
        if (!st.predicate) return { kind: "expr", expr: { kind: "block", body: { kind: "program", statements: jump, loc }, loc }, loc } as Stmt;
        return { kind: "expr", expr: { kind: "if", predicate: st.predicate, yes: { kind: "program", statements: jump, loc }, loc }, loc };
      }
      if (st.kind === "recur") return { kind: "expr", expr: { kind: "block", body: { kind: "program", statements: [assignState("start"), { kind: "recur", loc }], loc }, loc }, loc } as Stmt;
      return st;
    };
    const branches: Stmt[] = segments.map((seg, i) => ({
      kind: "expr", loc,
      expr: { kind: "if", loc, predicate: { kind: "binary", op: "==", left: name("state"), right: str(seg.label), loc },
        yes: { kind: "program", loc, statements: [...seg.stmts.map(lowerStmt), assignState(i + 1 < segments.length ? segments[i + 1].label : "end")] } },
    }));
    branches.push({ kind: "expr", loc, expr: { kind: "if", loc, predicate: { kind: "binary", op: "==", left: name("state"), right: str("end"), loc }, yes: { kind: "program", loc, statements: [{ kind: "return", value: name("result"), loc }] } } });
    return { kind: "program", loc, statements: [
      { kind: "define", names: ["result"], value: name("None"), modifiers: [], loc },
      { kind: "define", names: ["state"], value: str("start"), modifiers: [], loc },
      { kind: "expr", loc, expr: { kind: "while", predicate: name("true"), do: { kind: "program", statements: branches, loc }, loc } },
    ] };
  }

  private hasGotos(block: Block): boolean {
    return block.statements.some(s => s.kind === "goto" || s.kind === "label" || s.kind === "recur");
  }

  /** the replacement with its holes filled by what was bound */
  substitute(node: any, b: Bindings): any {
    if (node === null || node === undefined) return node;
    if (Array.isArray(node)) {
      const out: any[] = [];
      for (const x of node) {
        const h = this.holeOf(x);
        if (h && b.has(h) && Array.isArray(b.get(h))) out.push(...(b.get(h) as any[]));
        else out.push(this.substitute(x, b));
      }
      return out;
    }
    if (typeof node !== "object") return node;
    const h = this.holeOf(node);
    if (h && b.has(h)) {
      let v = b.get(h) as any;
      const isArg = (x: any) => x && typeof x === "object" && !Array.isArray(x) && "value" in x && !("kind" in x);
      const oneArg = Array.isArray(v) && v.length === 1 && isArg(v[0]) && v[0].name === undefined;
      // the hole stands as an argument: give it an argument
      if (isArg(node)) return oneArg ? v[0] : (typeof v === "string" ? { ...node, value: { kind: "name", name: v, loc: node.value?.loc } } : Array.isArray(v) ? node : { ...node, value: v });
      // the hole stands as an expression: an argument bound to it is its expression
      if (oneArg && node.kind === "name") v = v[0].value;
      if (typeof v === "string") return { ...node, name: v };
      // a bound body inside an expression position: keep as a block expression
      if (node.kind === "expr" && (v as any).kind === "program") return { kind: "expr", expr: { kind: "block", body: v, loc: node.loc }, loc: node.loc };
      return v;
    }
    const out: any = {};
    for (const [k, v] of Object.entries(node)) {
      if (k === "loc") { out[k] = v; continue; }
      if (typeof v === "string" && this.isHole(v) && b.has(v) && typeof b.get(v) === "string") { out[k] = b.get(v); continue; }
      out[k] = this.substitute(v, b);
    }
    return out;
  }
}

function strip(v: any): any {
  if (v === null || v === undefined || typeof v !== "object") return v;
  if (Array.isArray(v)) return v.map(strip);
  const out: any = {};
  for (const [k, x] of Object.entries(v)) if (k !== "loc") out[k] = strip(x);
  return out;
}

/** a class, as the tree it would have been written as - extensions merged in, parts as typed fields */
export function classNode(rt: Runtime, target: RayClass | RayObject): Stmt {
  const cls = target instanceof RayObject ? target.cls : target;
  const loc = cls.loc;
  const members: Stmt[] = [];
  for (const c of [cls]) {
    for (const part of c.parts) if (part.name) members.push({ kind: "define", names: [part.name], type: part.type, modifiers: [], loc });
    if (c.ctor) for (const p of c.ctor) members.push({ kind: "define", names: [p.name], type: p.type, value: p.default, modifiers: [], loc });
  }
  for (const [k, v] of cls.statics) {
    if (v instanceof RayClass) continue;   // nested classes are emitted on their own
    if (typeof v === "number") members.push({ kind: "define", names: [k], type: { kind: "type", name: Number.isInteger(v) ? "N" : "Real", array: 0, optional: false, loc }, value: { kind: "number", value: String(v), loc }, modifiers: ["static"], loc });
  }
  for (const m of cls.members) {
    switch (m.kind) {
      case "field":
        if (!m.type && m.value && !m.modifiers.includes("static")) members.push({ kind: "assign", target: { kind: "name", name: m.name, loc: m.loc }, value: m.value, loc: m.loc });
        else members.push({ kind: "define", names: [m.name], type: m.type, value: m.value, modifiers: m.modifiers, loc: m.loc });
        break;
      case "method": members.push({ kind: "method", names: [m.name], params: m.params, returns: m.returns, body: m.body, modifiers: m.modifiers, config: m.config, loc: m.loc }); break;
      case "rule": members.push({ kind: "rule", id: m.id, name: m.name, rate: m.rate, params: m.params, body: m.body, loc: m.loc }); break;
      case "named":
        // visuals and theorems are collected by gen, not members of the emitted class; choices are
        if (m.keyword === "choose") members.push({ kind: "named", keyword: m.keyword, name: m.name, params: m.params, returns: m.returns, body: m.body, loc: m.loc });
        break;
      case "conversion": members.push({ kind: "conversion", type: m.type, body: m.body, loc: m.loc }); break;
      case "index_method": members.push({ kind: "index_method", params: m.params, returns: undefined, body: m.body, loc: m.loc }); break;
      default: break;
    }
  }
  // statics declared as `static X = expr` were evaluated; re-read them from the member list above where declared
  const parentTypes: Type[] = cls.parents.map(p => ({ kind: "type", name: p.name, array: 0, optional: false, loc }));
  if (target instanceof RayObject) {
    // `G: Theory = class { }` - an instance; its base is the type
    const base = parentTypes.shift();
    return { kind: "define", names: [cls.name], type: base, value: { kind: "class", parents: parentTypes, parts: [], body: { kind: "program", statements: members, loc }, loc }, modifiers: [], loc };
  }
  return { kind: "define", names: [cls.name], value: { kind: "class", parents: parentTypes, parts: [], body: { kind: "program", statements: members, loc }, loc }, modifiers: [], loc };
}

/** wire `Program.as(language)` and the reflective members of a Program value into the runtime */
export function installEmitter(rt: Runtime) {
  const emitter = new Emitter(rt);
  (rt as any).emitter = emitter;
  const program = rt.classes.get("Program");
  if (!program) return;
  const loc: Loc = { file: "<emitter>", line: 0, col: 0 };
  program.statics.set("__as", null);
  const classOf = (language: Value): RayClass => {
    if (language instanceof RayClass) return language;
    if (language instanceof RayObject) return language.cls;
    throw new RayError("as: not a language");
  };
  rt.programAs = (p: RayObject, language: Value): string => {
    emitter.collectKnown();
    let body = (p as any).__body as Body;
    if ((p as any).__implicit && !isBlock(body)) body = emitter.prefixedExpr(body, "it");
    return emitter.emit(emitter.optimize(body, classOf(language)), classOf(language));
  };
  rt.nodeAs = (node: any, language: Value): string => {
    emitter.collectKnown();
    return emitter.emit(node, classOf(language));
  };
  rt.classAs = (target: RayClass | RayObject, language: Value): string => {
    emitter.collectKnown();
    return emitter.emit(emitter.optimize(classNode(rt, target), classOf(language)), classOf(language));
  };
  /* the bootstrap is an implementation too: every method body it runs is the optimized one */
  rt.optimizeAll = () => {
    emitter.collectKnown();
    for (const cls of rt.classes.values()) for (const m of cls.members) {
      if (m.kind === "method" && m.body) m.body = emitter.optimize(m.body);
      if (m.kind === "rule") m.body = emitter.optimize(m.body);
      if (m.kind === "field" && m.value) m.value = emitter.optimize(m.value);
    }
  };
}
