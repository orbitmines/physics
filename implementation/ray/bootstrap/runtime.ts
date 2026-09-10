/**
 * THE RUNTIME - a goto machine, plus the recognition of Number / String / Array / boolean by name.
 *
 * What runs here is what the .ray files define. The only control-flow primitive is `goto L if p`;
 * `if`, `unless`, `while`, `return`, `recur` are classes and functions of Program.ray. Because their
 * definitions are exactly what they say, the machine is allowed to take them as recognised
 * constructs and execute them directly - the same allowance Number gets: N, Z, Real, String, Array,
 * boolean are recognised by class name and carried as the host's numbers, strings, arrays and
 * booleans, with their .ray definitions as the meaning.
 */
import { Arg, Block, Body, Expr, Loc, Param, Stmt, Type, isBlock } from "./ast.ts";

// ——— values ————————————————————————————————————————————————————————————————

export type Value = null | boolean | number | string | Value[] | RayObject | RayClass | Closure | Many | Path | NativeFn;

export class RayError extends Error {
  constructor(msg: string, public loc?: Loc) { super(loc ? `${loc.file}:${loc.line}:${loc.col}: ${msg}` : msg); }
}

/** a field default not yet evaluated: everything is lazy, as in the ray repository */
export class Thunk { constructor(public expr: Expr, public env: Env) {} }

/** a location `@./path` */
export class Path { constructor(public path: string) {} }

/** the Many: a superposition; methods and members apply elementwise, equal things collapse */
export class Many {
  constructor(public items: Value[]) {}
}

export class NativeFn {
  constructor(public name: string, public fn: (...args: Value[]) => Value, public arity = -1) {}
}

export type Member =
  | { kind: "field"; name: string; type?: Type; value?: Expr; modifiers: string[]; optional: boolean; loc: Loc }
  | { kind: "method"; name: string; params: Param[]; returns?: Type; body?: Body; modifiers: string[]; config?: Arg[]; loc: Loc }
  | { kind: "rule"; id: string; name: string; params: Param[]; body: Body; loc: Loc }
  | { kind: "named"; keyword: string; name: string; params: Param[]; returns?: Type; body?: Body; loc: Loc }
  | { kind: "map"; pattern: Block; target: Expr; loc: Loc }
  | { kind: "conversion"; type: Type; body: Body; loc: Loc }
  | { kind: "index_method"; params: Param[]; body: Body; loc: Loc }
  | { kind: "grammar"; pattern: Block; params: Param[]; body: Body; loc: Loc };

export class RayClass {
  members: Member[] = [];
  statics = new Map<string, Value>();
  /** `vertex | ∙ : Vertex` - the alias names of a field, to its one slot */
  aliases = new Map<string, string>();
  /** `enum` variants, in order */
  variants?: Value[];
  constructor(
    public name: string,
    public parents: RayClass[],
    public ctor: Param[] | undefined,
    public parts: { name?: string; type?: Type; literal?: string }[],
    public env: Env,
    public loc: Loc,
  ) {}

  /** every member, parents first, own last (so a redeclaration wins) */
  allMembers(): Member[] {
    const out: Member[] = [];
    for (const p of this.parents) out.push(...p.allMembers());
    out.push(...this.members);
    return out;
  }

  find(name: string): Member | undefined {
    for (let i = this.members.length - 1; i >= 0; i--) {
      const m = this.members[i];
      if ((m.kind === "field" || m.kind === "method") && m.name === name) return m;
    }
    for (let i = this.parents.length - 1; i >= 0; i--) {
      const m = this.parents[i].find(name);
      if (m) return m;
    }
    return undefined;
  }

  isA(c: RayClass): boolean {
    if (this === c) return true;
    return this.parents.some(p => p.isA(c));
  }

  findStatic(name: string): Value | undefined {
    if (this.statics.has(name)) return this.statics.get(name);
    for (const p of this.parents) { const v = p.findStatic(name); if (v !== undefined) return v; }
    return undefined;
  }

  canonical(name: string): string {
    if (this.aliases.has(name)) return this.aliases.get(name)!;
    for (const p of this.parents) { const c = p.canonical(name); if (c !== name) return c; }
    return name;
  }
}

export class RayObject {
  fields = new Map<string, Value>();
  constructor(public cls: RayClass) {}
}

/** an enum variant: a named singleton */
export class Variant extends RayObject {
  constructor(cls: RayClass, public label: string, public index: number) { super(cls); }
}

export class Closure {
  constructor(
    public params: Param[],
    public body: Body | undefined,
    public env: Env,
    public self: Value,
    public name: string,
    public config: Arg[] = [],
    public loc?: Loc,
    /** `<local: &caller>`: the body runs in the caller's frame */
    public callerLocal = false,
    public modifiers: string[] = [],
  ) {}
}

// ——— environments and frames ————————————————————————————————————————————————

export class Env {
  vars = new Map<string, Value>();
  constructor(public parent?: Env, public self: Value = null, public implicit?: Value) {}
  lookup(name: string): { env: Env; value: Value } | undefined {
    let e: Env | undefined = this;
    while (e) {
      if (e.vars.has(name)) return { env: e, value: e.vars.get(name)! };
      e = e.parent;
    }
    return undefined;
  }
  define(name: string, v: Value) { this.vars.set(name, v); }
  assign(name: string, v: Value): boolean {
    const found = this.lookup(name);
    if (!found) return false;
    found.env.vars.set(name, v);
    return true;
  }
}

/** one running program: its statements, labels, pc and result */
class Frame {
  pc = 0;
  labels = new Map<string, number>();
  result: Value = null;
  constructor(public block: Block, public env: Env, public loc?: Loc) {
    block.statements.forEach((s, i) => { if (s.kind === "label") this.labels.set(s.name, i); });
  }
}

class Unwind {
  constructor(public frame: Frame, public value: Value) {}
}
class Restart {
  constructor(public frame: Frame) {}
}

// ——— the interpreter ————————————————————————————————————————————————————————

export class Runtime {
  global = new Env();
  classes = new Map<string, RayClass>();
  /** the map rules declared inside Language classes, by class */
  mapRules = new Map<RayClass, { pattern: Block; target: Expr; strength?: string }[]>();
  /** top-level rewrite rules `force|suggest|approx {pattern} => {block}` */
  rewrites: { pattern: Block; target: Expr; strength: string }[] = [];
  /** every `dynamically assert`, for the generated tests */
  asserts: { requirement: Expr; predicate?: Expr; loc: Loc; owner?: string; filter?: Expr; env?: Env }[] = [];
  /** every top-level definition, by name: what it was defined as, and where */
  definitions = new Map<string, { value: Expr; loc: Loc }>();
  /** `@./path := text` writes go through here */
  io: { read(path: string): string; write(path: string, text: string, mkdir: boolean): void } = {
    read: () => { throw new RayError("no IO"); }, write: () => { throw new RayError("no IO"); },
  };
  /** `Tests.requirements` / `Tests.fixtures`: the asserts and the test-file definitions, as Ray data */
  requirements(): Value[] {
    return this.asserts.filter(a => a.owner).map(a => this.makeObject("Requirement", {
      owner: a.owner!,
      filter: a.filter ? this.implicitProgram(a.filter, a.env ?? this.global) : null,
      requirement: this.implicitProgram(a.requirement, a.env ?? this.global),
      location: `${a.loc.file.split("/").slice(-2).join("/")}:${a.loc.line}`,
    }));
  }
  /** `Gen.constants`: the top-level definitions of the projects (not classes, functions or test fixtures), as Ray data */
  constants(): Value[] {
    const out: Value[] = [];
    for (const [name, d] of this.definitions) {
      if (d.loc.file.includes("/tests/") || d.loc.file.includes("/gen/") || d.loc.file.includes("/implementation/ray/")) continue;
      if (["class", "enum", "path"].includes(d.value.kind)) continue;
      if (d.value.kind === "lambda" && d.value.config?.length) continue;   // `draw := <local: &caller>...` is the language's
      const v = this.global.lookup(name)?.value;
      if (v instanceof RayClass) continue;
      out.push(this.makeObject("Definition", { name, definition: this.program(d.value, this.global, null, []) }));
    }
    return out;
  }

  fixtures(): Value[] {
    const out: Value[] = [];
    for (const [name, d] of this.definitions) {
      if (!d.loc.file.includes("/tests/")) continue;
      const v = this.global.lookup(name)?.value;
      if (!(v instanceof RayObject)) continue;
      out.push(this.makeObject("Fixture", { name, kind: v.cls.name, definition: this.program(d.value, this.global, null, []) }));
    }
    return out;
  }

  /** installed by emit.ts */
  programAs?: (p: RayObject, language: Value) => string;
  nodeAs?: (node: any, language: Value) => string;
  classAs?: (target: RayClass | RayObject, language: Value) => string;
  optimizeAll?: () => void;

  /** what recognised classes are called */
  static NUMBER = new Set(["Number", "N", "Natural", "Z", "Integer", "Real", "Decimal", "Digit", "Char"]);

  constructor() {
    this.global.define("None", null);
    this.global.define("true", true);
    this.global.define("false", false);
  }

  // —— running files ————————————————————————————————————————————————————————
  run(block: Block, env = this.global): Value {
    return this.execute(block, env);
  }

  /** execute a program in an environment: the goto machine */
  execute(block: Block, env: Env, loc?: Loc): Value {
    const frame = new Frame(block, env, loc);
    return this.drive(frame);
  }

  private drive(frame: Frame): Value {
    const st = frame.block.statements;
    let last: Value = null;
    while (true) {
      try {
        while (frame.pc < st.length) {
          const s = st[frame.pc++];
          last = this.statement(s, frame);
        }
        return frame.result !== null ? frame.result : last;
      } catch (e) {
        if (e instanceof Unwind && e.frame === frame) return e.value;
        if (e instanceof Restart && e.frame === frame) { frame.pc = 0; continue; }
        throw e;
      }
    }
  }

  private statement(s: Stmt, frame: Frame): Value {
    const env = frame.env;
    switch (s.kind) {
      case "label": return null;
      case "goto": {
        if (s.predicate && !this.truthy(this.eval(s.predicate, env))) return null;
        const target = frame.labels.get(s.label);
        if (target === undefined) {
          if (s.label === "end") { frame.pc = frame.block.statements.length; return null; }
          if (s.label === "start") { frame.pc = 0; return null; }
          throw new RayError(`no label ${s.label}`, s.loc);
        }
        frame.pc = target;
        return null;
      }
      case "return": {
        if (s.predicate && !this.truthy(this.eval(s.predicate, env))) return null;
        const v = s.value ? this.eval(s.value, env) : null;
        throw new Unwind(this.returnTarget(frame), v);
      }
      case "recur": throw new Restart(this.returnTarget(frame));
      case "assert": {
        if (s.predicate && !this.truthy(this.eval(s.predicate, env))) return null;
        const ok = this.eval(s.requirement, env);
        if (!this.truthy(ok)) throw new RayError(`assertion failed: ${show(s.requirement)}`, s.loc);
        return null;
      }
      case "define": {
        if (s.predicate && !this.truthy(this.eval(s.predicate, env))) return null;
        // a class is registered under its name BEFORE its body is read, so the body may name it
        if (s.value && (s.value.kind === "class" || s.value.kind === "enum")) {
          const shell = this.classShell(s.value, env);
          shell.name = s.names[0];
          for (const n of s.names) { env.define(n, shell); this.classes.set(n, shell); }
          this.classBody(shell, s.value, env);
          let v: Value = shell;
          if (s.type) {
            const base = this.resolveType(s.type, env);
            if (base instanceof RayClass) { shell.parents.unshift(base); v = this.instantiate(shell, [], env, s.loc); for (const n of s.names) env.define(n, v); }
          }
          return v;
        }
        let v: Value = s.value ? this.eval(s.value, env) : null;
        if (v instanceof RayClass && v.name === "") v.name = s.names[0];
        if (env === this.global && s.value) this.definitions.set(s.names[0], { value: s.value, loc: s.loc });
        for (const n of s.names) {
          env.define(n, v);
          if (v instanceof RayClass) this.classes.set(n, v);
        }
        return v;
      }
      case "assign": {
        if (s.predicate && !this.truthy(this.eval(s.predicate, env))) return null;
        const v = this.eval(s.value, env);
        this.assignTo(s.target, v, env);
        return v;
      }
      case "extend": {
        const target = s.target.kind === "name" && s.target.name === "*" ? null : this.eval(s.target, env);
        if (target === null) { this.extendAll(s.body, env); return null; }
        const cls = target instanceof RayClass ? target : target instanceof RayObject ? target.cls : null;
        if (!cls) throw new RayError("can only extend a class", s.loc);
        this.declareMembers(cls, s.body, env, target instanceof RayObject ? target : undefined);
        return null;
      }
      case "method": {
        const c = new Closure(s.params, s.body, env, env.self, s.names[0], s.config, s.loc, false, s.modifiers);
        for (const n of s.names) env.define(n, c);
        return c;
      }
      case "map": this.rewrites.push({ pattern: s.pattern, target: s.target, strength: s.strength ?? "force" }); return null;
      case "expr": {
        if (s.predicate && !this.truthy(this.eval(s.predicate, env))) return null;
        // a `{ ... }` standing as a statement runs here, in this scope (what a rewrite splices in)
        if (s.expr.kind === "block") return this.executeInline(s.expr.body, env);
        return this.eval(s.expr, env);
      }
      case "rule": case "named": case "conversion": case "index_method": case "grammar":
        throw new RayError(`${s.kind} outside a class`, s.loc);
    }
  }

  /** `return` inside a caller-local closure returns from the caller: the frame that owns `result` */
  private returnTarget(frame: Frame): Frame {
    return (frame.env as any).__owner ?? frame;
  }

  // —— classes —————————————————————————————————————————————————————————————
  private declareMembers(cls: RayClass, body: Block, env: Env, instance?: RayObject) {
    for (const s of body.statements) {
      switch (s.kind) {
        case "define": {
          const isStatic = s.modifiers.includes("static");
          if (isStatic) {
            const v = s.value ? this.eval(s.value, new Env(env, cls)) : null;
            for (const n of s.names) cls.statics.set(n, v);
            break;
          }
          // a nested class: `Initial := class < Boundary { }`
          if (s.value && s.value.kind === "class") {
            const nested = this.eval(s.value, new Env(env, cls)) as RayClass;
            nested.name = s.names[0];
            for (const n of s.names) cls.statics.set(n, nested);
            break;
          }
          cls.members.push({ kind: "field", name: s.names[0], type: s.type, value: s.value, modifiers: s.modifiers, optional: false, loc: s.loc });
          for (const n of s.names.slice(1)) cls.aliases.set(n, s.names[0]);
          if (instance) instance.fields.set(s.names[0], s.value ? this.eval(s.value, new Env(env, instance)) : null);
          break;
        }
        case "method":
          for (const n of s.names) cls.members.push({ kind: "method", name: n, params: s.params, returns: s.returns, body: s.body, modifiers: s.modifiers, config: s.config, loc: s.loc });
          break;
        case "rule": cls.members.push({ kind: "rule", id: s.id, name: s.name, params: s.params, body: s.body, loc: s.loc }); break;
        case "named": cls.members.push({ kind: "named", keyword: s.keyword, name: s.name, params: s.params, returns: s.returns, body: s.body, loc: s.loc }); break;
        case "map": {
          cls.members.push({ kind: "map", pattern: s.pattern, target: s.target, loc: s.loc });
          if (!this.mapRules.has(cls)) this.mapRules.set(cls, []);
          this.mapRules.get(cls)!.push({ pattern: s.pattern, target: s.target, strength: s.strength });
          break;
        }
        case "conversion": cls.members.push({ kind: "conversion", type: s.type, body: s.body, loc: s.loc }); break;
        case "index_method": cls.members.push({ kind: "index_method", params: s.params, body: s.body, loc: s.loc }); break;
        case "grammar": cls.members.push({ kind: "grammar", pattern: s.pattern, params: s.params, body: s.body, loc: s.loc }); break;
        case "assert": this.asserts.push({ requirement: s.requirement, predicate: s.predicate, loc: s.loc, owner: cls.name, filter: cls instanceof Refined ? cls.filter : undefined, env }); break;
        case "assign": {
          // `name = "G"` inside a class body: a field given its value
          if (s.target.kind === "name") {
            cls.members.push({ kind: "field", name: s.target.name, value: s.value, modifiers: [], optional: false, loc: s.loc });
            if (instance) instance.fields.set(s.target.name, this.eval(s.value, new Env(env, instance)));
          } else throw new RayError("unexpected assignment in class body", s.loc);
          break;
        }
        case "extend": {
          const v = this.eval(s.target, new Env(env, cls));
          const c = v instanceof RayClass ? v : v instanceof RayObject ? v.cls : null;
          if (!c) throw new RayError("can only extend a class", s.loc);
          this.declareMembers(c, s.body, env);
          break;
        }
        case "expr": {
          // `() => { ... }`: the call operator
          if (s.expr.kind === "lambda") { cls.members.push({ kind: "method", name: "()", params: s.expr.params, returns: s.expr.returns, body: s.expr.body, modifiers: [], config: s.expr.config, loc: s.loc }); break; }
          throw new RayError(`unexpected expression in class body`, s.loc);
        }
        case "label": case "goto": case "return": case "recur":
          throw new RayError(`unexpected ${s.kind} in class body`, s.loc);
      }
    }
  }

  /** `* += { }`: members of everything */
  universal: Member[] = [];
  private extendAll(body: Block, env: Env) {
    const tmp = new RayClass("*", [], undefined, [], env, body.loc);
    this.declareMembers(tmp, body, env);
    this.universal.push(...tmp.members);
  }

  instantiate(cls: RayClass, args: Arg[] | { name?: string; value: Value }[], env: Env, loc: Loc, evaluated = false): Value {
    // the recognised classes construct the host's own values
    const native = this.nativeConstruct(cls, args, env, evaluated);
    if (native !== undefined) return native;
    const obj = new RayObject(cls);
    const ienv = new Env(cls.env, obj);
    // parts and constructor parameters become fields, by name or position
    const params: { name: string; default?: Expr; type?: Type }[] = [];
    for (const c of this.allParents(cls)) {
      for (const p of c.parts) if (p.name) params.push({ name: p.name, type: p.type });
      if (c.ctor) for (const p of c.ctor) params.push({ name: p.name, default: p.default, type: p.type });
    }
    const given = new Map<string, Value>();
    let pos = 0;
    for (const a of args) {
      const v = evaluated ? (a as { value: Value }).value : this.eval((a as Arg).value, env);
      if (a.name) given.set(a.name, v);
      else if (params[pos]) given.set(params[pos++].name, v);
    }
    for (const p of params) {
      if (given.has(p.name)) obj.fields.set(p.name, given.get(p.name)!);
      else if (p.default) obj.fields.set(p.name, this.eval(p.default, ienv));
      else obj.fields.set(p.name, null);
    }
    // fields with defaults, parents first, in declaration order - LAZY: a default is evaluated on first read
    for (const m of cls.allMembers()) {
      if (m.kind !== "field") continue;
      if (given.has(m.name)) { obj.fields.set(m.name, given.get(m.name)!); continue; }
      if (m.value) obj.fields.set(m.name, new Thunk(m.value, ienv) as any);
      else if (!obj.fields.has(m.name)) obj.fields.set(m.name, null);
    }
    // what was given wins over every default
    for (const [k, v] of given) obj.fields.set(cls.canonical(k), v);
    // a theory: its `rule`, `visual`, `theorem` members become the lists a backend reads
    this.collectDeclarations(obj, ienv);
    return obj;
  }

  /** `rule /id "Name" (params) => body` members -> `rules`; `visual`/`theorem` -> `visuals`/`theorems` */
  private collectDeclarations(obj: RayObject, ienv: Env) {
    const rules: Value[] = [], visuals: Value[] = [], theorems: Value[] = [];
    const seen = new Map<string, number>();
    for (const m of obj.cls.allMembers()) {
      if (m.kind === "rule") {
        const t = m.params[0]?.type;
        const r = this.makeObject("Rule", {
          id: m.id, name: m.name,
          over: t ? t.name : "World",
          single: !t || t.count === 1 || t.name !== "Ray",
          where: t?.filter ? this.implicitProgram(t.filter, ienv) : null,
          body: this.program(m.body, ienv, obj, m.params),
        });
        if (seen.has(m.id)) rules[seen.get(m.id)!] = r; else { seen.set(m.id, rules.length); rules.push(r); }
      } else if (m.kind === "named" && m.keyword === "visual") {
        const v = this.makeObject("Visual", { id: m.name, body: this.program(m.body ?? { kind: "program", statements: [], loc: m.loc }, ienv, obj, m.params) });
        (v as any).__node = { kind: "named", keyword: m.keyword, name: m.name, params: m.params, returns: m.returns, body: m.body, loc: m.loc };
        visuals.push(v);
      } else if (m.kind === "named" && m.keyword === "theorem") {
        theorems.push(this.makeObject("Theorem", { id: m.name, body: this.program(m.body ?? { kind: "program", statements: [], loc: m.loc }, ienv, obj, m.params) }));
      }
    }
    if (rules.length) obj.fields.set("rules", rules);
    if (visuals.length) obj.fields.set("visuals", visuals);
    if (theorems.length) obj.fields.set("theorems", theorems);
  }

  makeObject(className: string, fields: Record<string, Value>): RayObject {
    const cls = this.classes.get(className) ?? new RayClass(className, [], undefined, [], this.global, { file: "<runtime>", line: 0, col: 0 });
    const o = new RayObject(cls);
    for (const [k, v] of Object.entries(fields)) o.fields.set(k, v);
    return o;
  }

  /** a program of an implicit element - a filter or a requirement: bare names are its members; emitted as `it.name` */
  implicitProgram(body: Body, env: Env): RayObject {
    const p = this.program(body, env, null, []);
    (p as any).__implicit = true;
    return p;
  }

  /** a Program value: a body with the environment it was written in; callable; `parameters` readable */
  program(body: Body, env: Env, self: Value, params: Param[] = []): RayObject {
    const p = this.makeObject("Program", {});
    p.fields.set("parameters", params.map(x => this.makeObject("Parameter", {
      name: x.name,
      type: x.type ? this.makeObject("TypeOf", { name: x.type.name, count: x.type.count ?? null, filter: x.type.filter ? this.program(x.type.filter, env, self) : null, optional: x.type.optional }) : null,
    })));
    (p as any).__body = body;
    (p as any).__env = env;
    (p as any).__self = self;
    (p as any).__params = params;
    return p;
  }

  /** `N(digits: [...])`, `Z(sign: "-", magnitude: 3)`, `Real(integer: z, fraction: [...])`, `String(chars: [...])` as host values */
  private nativeConstruct(cls: RayClass, args: Arg[] | { name?: string; value: Value }[], env: Env, evaluated: boolean): Value | undefined {
    const name = cls.name;
    if (!Runtime.NUMBER.has(name) && name !== "String" && name !== "Array") return undefined;
    const get = (n: string): Value | undefined => {
      const a = (args as any[]).find(x => x.name === n);
      if (!a) return undefined;
      return evaluated ? a.value : this.eval(a.value, env);
    };
    switch (name) {
      case "N": case "Natural": { const d = get("digits"); return Array.isArray(d) ? Number(d.map(x => this.text(x)).join("")) : (typeof d === "number" ? d : 0); }
      case "Z": case "Integer": { const m = get("magnitude") as number; const sign = get("sign"); return sign === "-" ? -Math.abs(m ?? 0) : Math.abs(m ?? 0); }
      case "Real": case "Decimal": {
        const i = get("integer") as number; const f = get("fraction");
        const frac = Array.isArray(f) ? Number("0." + f.map(x => this.text(x)).join("")) : 0;
        return (i ?? 0) < 0 || Object.is(i, -0) ? (i ?? 0) - frac : (i ?? 0) + frac;
      }
      case "String": { const c = get("chars"); return Array.isArray(c) ? c.map(x => typeof x === "number" ? String.fromCodePoint(x) : this.text(x)).join("") : ""; }
      case "Array": return [];
      case "Char": return get("value") ?? 0;
      default: return undefined;
    }
  }

  /** the class with its parents resolved and nothing else - registered under its name before the body is read */
  classShell(e: Extract<Expr, { kind: "class" | "enum" }>, env: Env): RayClass {
    if (e.kind === "class") {
      const parents = e.parents.map(t => {
        const c = this.resolveType(t, env);
        if (!(c instanceof RayClass)) throw new RayError(`unknown name ${t.name}`, t.loc);
        return c;
      });
      return new RayClass("", parents, e.ctor, e.parts, env, e.loc);
    }
    return new RayClass("", [], undefined, [], env, e.loc);
  }

  classBody(cls: RayClass, e: Extract<Expr, { kind: "class" | "enum" }>, env: Env) {
    if (e.kind === "enum") {
      cls.variants = e.variants.map((v, i) => {
        if (v.kind === "name" && v.name !== "static") {
          const existing = env.lookup(v.name);
          if (existing && (typeof existing.value === "boolean" || existing.value === null)) return existing.value;
          const variant = new Variant(cls, v.name, i);
          env.define(v.name, variant);
          return variant;
        }
        if (v.kind === "name") return null;
        return this.eval(v, env);
      });
    }
    this.declareMembers(cls, e.body, new Env(env, cls));
  }

  allParents(cls: RayClass): RayClass[] {
    const out: RayClass[] = [];
    for (const p of cls.parents) out.push(...this.allParents(p));
    out.push(cls);
    return out;
  }

  // —— evaluation ———————————————————————————————————————————————————————————
  eval(e: Expr, env: Env): Value {
    switch (e.kind) {
      case "number": return Number(e.value);
      case "string": return e.parts.map(p => typeof p === "string" ? p : this.text(this.eval(p, env))).join("");
      case "path": return this.io.read(this.pathOf(e, env));
      case "this": return env.self;
      case "name": return this.name(e.name, env, e.loc);
      case "context": {
        if (e.name === "caller") return (env as any).__callerSelf ?? null;
        throw new RayError(`unknown context &${e.name}`, e.loc);
      }
      case "list": return e.items.map(i => this.eval(i, env));
      case "member": {
        const target = this.eval(e.target, env);
        if (e.optional && target === null) return null;
        if ((e as any).distribute) {
          // `.(a & b).x` distributes: the member of each, joined by the operator
          const inner = (e as any).distribute as Expr;
          return this.distribute(target, inner, env, e.loc);
        }
        return this.member(target, e.name, env, e.loc);
      }
      case "dynamic": {
        const target = this.eval(e.target, env);
        const name = this.text(this.eval(e.name, env));
        return this.member(target, name, env, e.loc);
      }
      case "index": {
        const target = this.eval(e.target, env);
        const at = this.eval(e.at, env);
        return this.index(target, at, e.loc);
      }
      case "call": {
        if (e.target.kind === "member" && !(e.target as any).distribute) {
          const recv = this.eval(e.target.target, env);
          if (e.target.optional && recv === null) return null;
          const args = e.args.map(a => ({ name: a.name, value: this.eval(a.value, env) }));
          return this.callMethod(recv, e.target.name, args, env, e.loc);
        }
        const f = this.eval(e.target, env);
        if (e.optional && f === null) return null;
        const args = e.args.map(a => ({ name: a.name, value: this.eval(a.value, env) }));
        return this.call(f, args, env, e.loc);
      }
      case "configure": {
        const f = this.eval(e.target, env);
        return this.configure(f, e.config, env, e.loc);
      }
      case "filter": {
        const target = this.eval(e.target, env);
        return this.filter(target, e.predicate, env, e.loc);
      }
      case "optional": return this.eval(e.target, env);
      case "many": {
        const v = this.eval(e.target, env);
        if (v instanceof Many) return v;
        if (Array.isArray(v)) return new Many(v);
        return new Many([v]);
      }
      case "unary": {
        const v = this.eval(e.operand, env);
        if (e.op === "!") return this.not(v, env, e.loc);
        if (e.op === "-") { if (typeof v === "number") return -v; return this.callMethod(v, "negated", [], env, e.loc); }
        throw new RayError(`unknown unary ${e.op}`, e.loc);
      }
      case "binary": return this.binary(e.op, e.left, e.right, env, e.loc);
      case "instance_of": {
        const v = this.eval(e.target, env);
        const t = this.eval(e.type, env);
        return this.instanceOf(v, t);
      }
      case "as": {
        const v = this.eval(e.target, env);
        const t = this.resolveType(e.type, env);
        return this.convert(v, t, env, e.loc);
      }
      case "ternary": return this.truthy(this.eval(e.predicate, env)) ? this.eval(e.yes, env) : this.eval(e.no, env);
      case "lambda": {
        const c = new Closure(e.params, e.body, env, env.self, "<lambda>", e.config ?? [], e.loc);
        if (e.config?.some(a => a.name === "local")) c.callerLocal = true;
        return c;
      }
      case "block": {
        // `{ }` as a value: an object literal (empty), or a block to run when called
        if (e.body.statements.length === 0) return new RayObject(this.objectClass());
        return new Closure([], e.body, env, env.self, "<block>", [], e.loc);
      }
      case "class": case "enum": {
        const cls = this.classShell(e, env);
        this.classBody(cls, e, env);
        return cls;
      }
      case "type_expr": return this.resolveType(e.type, env);
      case "if": {
        // recognised: Program.ray's `if` class - `goto 1 if predicate; 0\ no; 1\ yes`
        if (this.truthy(this.eval(e.predicate, env))) return this.body(e.yes, env);
        if (e.no) return this.body(e.no, env);
        return null;
      }
      case "unless": {
        if (!this.truthy(this.eval(e.predicate, env))) return this.body(e.yes, env);
        return null;
      }
      case "while": {
        // recognised: Program.ray's `while` - `return if !predicate; do(); recur`
        let last: Value = null;
        let guard = 0;
        while (this.truthy(this.eval(e.predicate, env))) {
          last = this.body(e.do, env);
          if (++guard > 50_000_000) throw new RayError("while: no progress", e.loc);
        }
        return last;
      }
      case "draw": {
        const weights = this.eval(e.weights, env);
        const outcomes = this.eval(e.outcomes, env);
        const drawFn = this.name("draw", env, e.loc);
        return this.call(drawFn, [{ value: weights }, { value: outcomes }], env, e.loc, env.self);
      }
    }
  }

  /** run a body (block or expression) in the SAME environment - the branch of an `if` sees its caller's locals */
  body(b: Body, env: Env): Value {
    if (isBlock(b)) return this.executeInline(b, env);
    return this.eval(b, env);
  }

  /** a block run in the caller's environment; `return` inside it leaves the caller's program */
  private executeInline(block: Block, env: Env): Value {
    const frame = new Frame(block, env);
    (frame.env as any).__owner ??= undefined;
    const st = block.statements;
    let last: Value = null;
    while (true) {
      try {
        while (frame.pc < st.length) {
          const s = st[frame.pc++];
          last = this.statement(s, frame);
        }
        return last;
      } catch (e) {
        if (e instanceof Restart && e.frame === frame) { frame.pc = 0; continue; }
        throw e;
      }
    }
  }

  private name(n: string, env: Env, loc: Loc): Value {
    const found = env.lookup(n);
    if (found) return found.value;
    // an implicit receiver: filters `Ray{active}` read members off the element
    let e: Env | undefined = env;
    while (e) {
      if (e.implicit !== undefined) {
        const v = this.tryMember(e.implicit, n, env, loc);
        if (v !== undefined) return v;
      }
      e = e.parent;
    }
    // members of `this`
    if (env.self !== null && env.self !== undefined) {
      const v = this.tryMember(env.self, n, env, loc);
      if (v !== undefined) return v;
    }
    if (this.classes.has(n)) return this.classes.get(n)!;
    throw new RayError(`unknown name ${n}`, loc);
  }

  private objectCls?: RayClass;
  objectClass(): RayClass {
    return this.objectCls ??= new RayClass("Object", [], undefined, [], this.global, { file: "<runtime>", line: 0, col: 0 });
  }

  // —— members ———————————————————————————————————————————————————————————————
  /** the member if the target HAS one of that name - an error inside it is the member's own */
  private tryMember(target: Value, name: string, env: Env, loc: Loc): Value | undefined {
    if (!this.hasMember(target, name)) return undefined;
    return this.member(target, name, env, loc);
  }

  hasMember(target: Value, name: string): boolean {
    if (target instanceof Many) return target.items.some(t => this.hasMember(t, name));
    if (target instanceof RayObject) {
      const n = target.cls.canonical(name);
      if (target.fields.has(n)) return true;
      if (target.cls.find(n)) return true;
      if (target.cls.findStatic(n) !== undefined) return true;
      if (target instanceof Variant && ["index", "next", "previous", "label"].includes(n)) return true;
      return this.universal.some(m => m.kind === "method" && m.name === n);
    }
    if (target instanceof RayClass) return target.findStatic(name) !== undefined || name === "name" || name === "nested" || !!target.find(name);
    if (target === null || target === undefined) return false;
    try { return this.nativeMember(target, name, this.global, { file: "<runtime>", line: 0, col: 0 }) !== undefined; } catch { return false; }
  }

  member(target: Value, name: string, env: Env, loc: Loc, quiet = false): Value {
    if (target instanceof Many) {
      if (name === "length" || name === "count") return target.items.length;
      if (name === "empty") return target.items.length === 0;
      if (name === "nonempty") return target.items.length > 0;
      if (name === "items") return target.items;
      const items = target.items.map(t => this.member(t, name, env, loc, quiet));
      return this.collapse(items);
    }
    if (target instanceof RayObject) {
      name = target.cls.canonical(name);
      if (target.fields.has(name)) {
        let v = target.fields.get(name)! as Value | Thunk;
        if (v instanceof Thunk) { const forced = this.eval(v.expr, v.env); target.fields.set(name, forced); return forced; }
        return v;
      }
      const m = target.cls.find(name);
      if (m && m.kind === "method") {
        const c = this.bind(m, target);
        // a parameterless method is its value
        if (m.params.length === 0 && m.body !== undefined) return this.call(c, [], env, loc);
        return c;
      }
      const st = target.cls.findStatic(name);
      if (st !== undefined) return st;
      if (target instanceof Variant) {
        const v = this.enumMember(target, name);
        if (v !== undefined) return v;
      }
      const u = this.universalMember(target, name, env, loc);
      if (u !== undefined) return u;
      if (quiet) throw new RayError(`no member ${name}`, loc);
      throw new RayError(`no member ${name} on ${target.cls.name}`, loc);
    }
    if (target instanceof RayClass) {
      const st = target.findStatic(name);
      if (st !== undefined) return st;
      if (name === "name") return target.name;
      if (name === "nested") return [...target.statics.values()].filter((v): v is RayClass => v instanceof RayClass);
      if (target.name === "Tests" && name === "requirements") return this.requirements();
      if (target.name === "Tests" && name === "fixtures") return this.fixtures();
      if (target.name === "Gen" && name === "constants") return this.constants();
      const m = target.find(name);
      if (m && m.kind === "method" && m.modifiers.includes("static")) { const c = this.bind(m, target); return m.params.length === 0 ? this.call(c, [], env, loc) : c; }
      if (target.variants && name === "variants") return target.variants;
      throw new RayError(`no static member ${name} on ${target.name}`, loc);
    }
    if (target instanceof Closure) {
      throw new RayError(`no member ${name} on a function`, loc);
    }
    // natives
    const v = this.nativeMember(target, name, env, loc);
    if (v !== undefined) return v;
    const u = this.universalMember(target, name, env, loc);
    if (u !== undefined) return u;
    throw new RayError(`no member ${name} on ${this.text(target)}`, loc);
  }

  private universalMember(target: Value, name: string, env: Env, loc: Loc): Value | undefined {
    for (let i = this.universal.length - 1; i >= 0; i--) {
      const m = this.universal[i];
      if (m.kind === "method" && m.name === name) {
        const c = this.bind(m, target);
        if (m.params.length === 0) return this.call(c, [], env, loc);
        return c;
      }
    }
    return undefined;
  }

  private enumMember(v: Variant, name: string): Value | undefined {
    const vs = v.cls.variants ?? [];
    if (name === "index") return v.index;
    if (name === "next") return vs[v.index + 1] ?? null;
    if (name === "previous") return v.index > 0 ? vs[v.index - 1] : null;
    if (name === "label") return v.label;
    return undefined;
  }

  bind(m: Extract<Member, { kind: "method" }>, self: Value): Closure {
    const owner = self instanceof RayObject ? self.cls : self instanceof RayClass ? self : null;
    const env = owner ? owner.env : this.global;
    const c = new Closure(m.params, m.body, env, self, m.name, m.config, m.loc, false, m.modifiers);
    if (m.config?.some(a => a.name === "local")) c.callerLocal = true;
    return c;
  }

  collapse(items: Value[]): Value {
    if (items.length === 0) return new Many([]);
    const first = items[0];
    if (items.every(i => this.same(i, first))) return first;
    return new Many(items);
  }

  same(a: Value, b: Value): boolean {
    if (a === b) return true;
    if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((x, i) => this.same(x, b[i]));
    return false;
  }

  private distribute(target: Value, inner: Expr, env: Env, loc: Loc): Value {
    // `.(initial & terminal).active` -> `.initial.active & .terminal.active`
    const names: { op: string; name: string }[] = [];
    const walk = (x: Expr, op: string) => {
      if (x.kind === "binary" && (x.op === "&" || x.op === "|")) { walk(x.left, op); walk(x.right, x.op); return; }
      if (x.kind === "name") { names.push({ op, name: x.name }); return; }
      throw new RayError("distribution wants names", loc);
    };
    walk(inner, "&");
    const values = names.map(n => this.member(target, n.name, env, loc));
    return new Many(values);
  }

  // —— calls ————————————————————————————————————————————————————————————————
  /** the Iterable API a Many answers as a collection (`#`), rather than elementwise */
  static COLLECTION = new Set(["filter", "~", "map", "for", "some", "every", "reduce", "contains", "join", "most", "sorted_by", "take", "drop", "index_of"]);

  callMethod(recv: Value, name: string, args: { name?: string; value: Value }[], env: Env, loc: Loc): Value {
    if (recv instanceof Many) {
      if (Runtime.COLLECTION.has(name)) {
        const v = this.nativeCall(recv.items, name, args.map(a => a.value), env, loc);
        if (name === "filter" || name === "~") return new Many(v as Value[]);
        return v ?? null;
      }
      const results = recv.items.map(r => this.callMethod(r, name, args, env, loc));
      return this.collapse(results);
    }
    if (recv instanceof RayObject) {
      if ((recv as any).__body !== undefined && name === "as" && this.programAs) return this.programAs(recv, args[0].value);
      if ((recv as any).__node !== undefined && name === "as" && this.nodeAs) return this.nodeAs((recv as any).__node, args[0].value);
      // a theory instance (`G: Theory = class {}`) or any object of a class: the class, in the language
      if (name === "as" && this.classAs && args[0]?.value instanceof RayObject && (args[0].value as RayObject).cls.isA(this.classes.get("Language")!)) return this.classAs(recv, args[0].value);
      const m = recv.cls.find(name);
      if (m && m.kind === "method") return this.call(this.bind(m, recv), args, env, loc);
      if (recv.fields.has(name)) return this.call(this.member(recv, name, env, loc), args, env, loc, recv);
      // `s.choose("emit?")` - a named choice
      if (name === "choose") return this.choice(recv, this.text(args[0].value), loc);
      const st = recv.cls.findStatic(name);
      if (st !== undefined) return this.call(st, args, env, loc, recv);
      const u = this.universalCall(recv, name, args, env, loc);
      if (u !== undefined) return u;
      throw new RayError(`no method ${name} on ${recv.cls.name}`, loc);
    }
    if (recv instanceof RayClass) {
      if (name === "as" && this.classAs && args[0]?.value instanceof RayObject) return this.classAs(recv, args[0].value);
      const st = recv.findStatic(name);
      if (st !== undefined) return this.call(st, args, env, loc, recv);
      const m = recv.find(name);
      if (m && m.kind === "method") return this.call(this.bind(m, recv), args, env, loc);
      throw new RayError(`no static method ${name} on ${recv.name}`, loc);
    }
    if (recv instanceof Closure) {
      throw new RayError(`no method ${name} on a function`, loc);
    }
    const v = this.nativeCall(recv, name, args.map(a => a.value), env, loc);
    if (v !== undefined) return v;
    const u = this.universalCall(recv, name, args, env, loc);
    if (u !== undefined) return u;
    throw new RayError(`no method ${name} on ${this.text(recv)}`, loc);
  }

  private universalCall(recv: Value, name: string, args: { name?: string; value: Value }[], env: Env, loc: Loc): Value | undefined {
    for (let i = this.universal.length - 1; i >= 0; i--) {
      const m = this.universal[i];
      if (m.kind === "method" && m.name === name) return this.call(this.bind(m, recv), args, env, loc);
    }
    return undefined;
  }

  /** a named choice declared `choose "emit?" (exit: N): boolean` on the receiver's class */
  private choice(recv: RayObject, name: string, loc: Loc): Value {
    let found: Extract<Member, { kind: "named" }> | undefined;
    for (const m of recv.cls.allMembers()) if (m.kind === "named" && m.keyword === "choose" && m.name === name) found = m;
    if (!found) throw new RayError(`no choice "${name}" on ${recv.cls.name}`, loc);
    if (!found.body) throw new RayError(`the choice "${name}" on ${recv.cls.name} is not defined by anyone`, loc);
    return new Closure(found.params, found.body, recv.cls.env, recv, name, [], found.loc);
  }

  call(f: Value, args: { name?: string; value: Value }[], env: Env, loc: Loc, self?: Value): Value {
    if (f instanceof Many) return this.collapse(f.items.map(x => this.call(x, args, env, loc, self)));
    if (f instanceof NativeFn) return f.fn(...args.map(a => a.value));
    if (f instanceof RayClass) return this.instantiate(f, args, env, loc, true);
    if (f instanceof RayObject && (f as any).__body !== undefined) {
      const body = (f as any).__body as Body;
      const params = (f as any).__params as Param[];
      const local = (f as any).__local as Value | undefined;
      const owner = local !== undefined ? local : (f as any).__self;
      const implicit = local !== undefined ? local : (params.length === 0 && args.length === 1 ? args[0].value : undefined);
      const penv = new Env((f as any).__env as Env, implicit !== undefined ? implicit : owner, implicit);
      for (let i = 0; i < params.length; i++) penv.define(params[i].name, args[i] ? args[i].value : null);
      if (isBlock(body)) { const frame = new Frame(body, penv, loc); (penv as any).__owner = frame; return this.drive(frame); }
      return this.eval(body, penv);
    }
    if (f instanceof RayObject) {
      // an object with a `()` method
      const m = f.cls.find("()");
      if (m && m.kind === "method") return this.call(this.bind(m, f), args, env, loc);
      throw new RayError(`${f.cls.name} is not callable`, loc);
    }
    if (!(f instanceof Closure)) throw new RayError(`not callable: ${this.text(f)}`, loc);
    if (f.body === undefined) throw new RayError(`${f.name} is declared but not defined by anyone`, loc);
    const callEnv = f.callerLocal ? env : new Env(f.env, self ?? f.self);
    if (f.callerLocal) {
      // the body runs in the caller's frame: bind the parameters there
      for (let i = 0; i < f.params.length; i++) {
        const p = f.params[i];
        const a = args.find(x => x.name === p.name) ?? (args[i]?.name === undefined ? args[i] : undefined);
        callEnv.define(p.name, a ? a.value : p.default ? this.eval(p.default, callEnv) : null);
      }
      return this.body(f.body, callEnv);
    }
    (callEnv as any).__callerSelf = env.self;
    for (let i = 0; i < f.params.length; i++) {
      const p = f.params[i];
      const a = args.find(x => x.name === p.name) ?? (args[i]?.name === undefined ? args[i] : undefined);
      callEnv.define(p.name, a ? a.value : p.default ? this.eval(p.default, callEnv) : null);
    }
    for (const c of f.config) if (c.name && c.name !== "local") callEnv.define(c.name, this.eval(c.value, callEnv));
    if (isBlock(f.body)) {
      const frame = new Frame(f.body, callEnv, loc);
      (callEnv as any).__owner = frame;
      return this.drive(frame);
    }
    // an expression body may still `return` (postfix if) - it was parsed as an expression
    const frame = new Frame({ kind: "program", statements: [{ kind: "expr", expr: f.body, loc: f.loc ?? loc }], loc: f.loc ?? loc }, callEnv, loc);
    (callEnv as any).__owner = frame;
    return this.drive(frame);
  }

  /** `f<local: &caller, break: return>` - a closure with its configuration applied */
  private configure(f: Value, config: Arg[], env: Env, loc: Loc): Value {
    if (f instanceof RayObject && (f as any).__body !== undefined) {
      // `program<local: x>`: the program with x as its `this`
      const local = config.find(a => a.name === "local");
      const copy = this.program((f as any).__body, (f as any).__env, (f as any).__self, (f as any).__params);
      if (local) (copy as any).__local = local.value.kind === "context" ? env.self : this.eval(local.value, env);
      return copy;
    }
    if (!(f instanceof Closure)) throw new RayError("only a function takes a configuration", loc);
    const c = new Closure(f.params, f.body, f.env, f.self, f.name, [...f.config, ...config], f.loc, f.callerLocal, f.modifiers);
    for (const a of config) {
      if (a.name === "local" && a.value.kind === "context" && a.value.name === "caller") c.callerLocal = true;
      if (a.name === "break") {
        // `break: return` - break leaves the program that configured the block
        const owner = (env as any).__owner as Frame | undefined;
        (c as any).breakFrame = owner;
      }
    }
    return c;
  }

  // —— assignment ———————————————————————————————————————————————————————————
  assignTo(target: Expr, v: Value, env: Env) {
    if (target.kind === "name") {
      if (!env.assign(target.name, v)) {
        // a field of `this`
        if (env.self instanceof RayObject && (env.self.fields.has(target.name) || env.self.cls.find(target.name))) { env.self.fields.set(target.name, v); return; }
        env.define(target.name, v);
      }
      return;
    }
    if (target.kind === "member") {
      const obj = this.eval(target.target, env);
      this.setMember(obj, target.name, v, target.loc);
      return;
    }
    if (target.kind === "dynamic") {
      const obj = this.eval(target.target, env);
      this.setMember(obj, this.text(this.eval(target.name, env)), v, target.loc);
      return;
    }
    if (target.kind === "index") {
      const obj = this.eval(target.target, env);
      const at = this.eval(target.at, env);
      if (Array.isArray(obj) && typeof at === "number") { obj[at] = v; return; }
      if (obj instanceof RayObject) { obj.fields.set(this.text(at), v); return; }
      throw new RayError("cannot index-assign", target.loc);
    }
    if (target.kind === "path") {
      this.io.write(this.pathOf(target, env), this.text(v), (target as any).mkdir === true);
      return;
    }
    throw new RayError(`cannot assign to ${target.kind}`, target.loc);
  }

  /** `@./visuals/{id}/film.ts` - a path interpolates like a string */
  pathOf(e: Extract<Expr, { kind: "path" }>, env: Env): string {
    if (!e.parts) return e.value;
    return e.parts.map(p => typeof p === "string" ? p : this.text(this.eval(p, env))).join("");
  }

  setMember(obj: Value, name: string, v: Value, loc: Loc) {
    if (obj instanceof Many) { for (const o of obj.items) this.setMember(o, name, v, loc); return; }
    if (obj instanceof RayObject) { obj.fields.set(obj.cls.canonical(name), v); return; }
    if (obj instanceof RayClass) { obj.statics.set(name, v); return; }
    throw new RayError(`cannot set ${name} on ${this.text(obj)}`, loc);
  }

  // —— operators ————————————————————————————————————————————————————————————
  private binary(op: string, l: Expr, r: Expr, env: Env, loc: Loc): Value {
    if (op === "&") { const a = this.eval(l, env); if (!this.truthy(a)) return a; return this.eval(r, env); }
    if (op === "|") { const a = this.eval(l, env); if (this.truthy(a)) return a; return this.eval(r, env); }
    if (op === "??") { const a = this.eval(l, env); return a === null || a === undefined ? this.eval(r, env) : a; }
    const a = this.eval(l, env), b = this.eval(r, env);
    return this.operate(op, a, b, env, loc);
  }

  operate(op: string, a: Value, b: Value, env: Env, loc: Loc): Value {
    if (a instanceof Many) return this.collapse(a.items.map(x => this.operate(op, x, b, env, loc)));
    if (op === "==") return this.equals(a, b);
    if (op === "!=") return !this.equals(a, b);
    if (typeof a === "number" && typeof b === "number") {
      switch (op) {
        case "+": return a + b; case "-": return a - b; case "*": return a * b; case "/": return b === 0 ? (a === 0 ? 0 : a / b) : a / b;
        case "%": return a % b; case "<": return a < b; case "<=": return a <= b; case ">": return a > b; case ">=": return a >= b;
      }
    }
    if (typeof a === "string" && typeof b === "string") {
      switch (op) { case "<": return a < b; case "<=": return a <= b; case ">": return a > b; case ">=": return a >= b; }
    }
    if (typeof a === "boolean" && typeof b === "boolean") {
      switch (op) { case "xor": return a !== b; }
    }
    if (a instanceof RayObject || a instanceof RayClass) return this.callMethod(a, op, [{ value: b }], env, loc);
    if (a instanceof Variant && b instanceof Variant) {
      switch (op) { case "<": return a.index < b.index; case "<=": return a.index <= b.index; case ">": return a.index > b.index; case ">=": return a.index >= b.index; }
    }
    throw new RayError(`cannot ${op} ${this.text(a)} and ${this.text(b)}`, loc);
  }

  equals(a: Value, b: Value): boolean {
    if (a instanceof Many) return a.items.every(x => this.equals(x, b));
    if (a === b) return true;
    if (a === null || b === null) return false;
    if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((x, i) => this.equals(x, b[i]));
    if (a instanceof RayObject && b instanceof RayObject) {
      const m = a.cls.find("==");
      if (m && m.kind === "method" && m.body) return this.truthy(this.call(this.bind(m, a), [{ value: b }], this.global, m.loc));
      return false;
    }
    return false;
  }

  not(v: Value, env: Env, loc: Loc): Value {
    if (v instanceof Many) return this.collapse(v.items.map(x => this.not(x, env, loc)));
    if (typeof v === "boolean") return !v;
    if (v === null) return true;
    if (v instanceof RayObject) return this.callMethod(v, "!", [], env, loc);
    return !this.truthy(v);
  }

  truthy(v: Value): boolean {
    if (v instanceof Many) return v.items.length > 0 && v.items.every(x => this.truthy(x));
    if (v === null || v === undefined || v === false) return false;
    return true;
  }

  index(target: Value, at: Value, loc: Loc): Value {
    if (target === null) return null;   // an `?.` chain ran off the end
    if (target instanceof Many) return this.collapse(target.items.map(t => this.index(t, at, loc)));
    if (Array.isArray(target)) {
      if (typeof at !== "number") throw new RayError("index must be a number", loc);
      return at < 0 ? target[target.length + at] ?? null : target[at] ?? null;
    }
    if (typeof target === "string") { if (typeof at !== "number") throw new RayError("index must be a number", loc); return target[at] ?? null; }
    if (target instanceof RayObject) {
      if (typeof at === "string" && target.fields.has(at)) return this.member(target, at, this.global, loc);
      if (target.cls === this.objectCls) return null;   // `{ }` as a map: a missing key is None
      const m = target.cls.allMembers().find(m => m.kind === "index_method");
      if (m && m.kind === "index_method") return this.call(new Closure(m.params, m.body, target.cls.env, target, "[]", [], m.loc), [{ value: at }], this.global, loc);
      throw new RayError(`cannot index ${target.cls.name}`, loc);
    }
    throw new RayError(`cannot index ${this.text(target)}`, loc);
  }

  filter(target: Value, predicate: Expr, env: Env, loc: Loc): Value {
    // `Ray{active}` on a class: a refined type - kept as a class with a filter for pattern matching
    if (target instanceof RayClass) return new Refined(target, predicate);
    const items = target instanceof Many ? target.items : Array.isArray(target) ? target : [target];
    const kept = items.filter(x => this.truthy(this.eval(predicate, new Env(env, x, x))));
    return Array.isArray(target) ? kept : new Many(kept);
  }

  instanceOf(v: Value, t: Value): boolean {
    if (t instanceof Refined) return this.instanceOf(v, t.cls) && this.truthy(this.eval(t.filter, new Env(this.global, v, v)));
    if (!(t instanceof RayClass)) return false;
    if (v instanceof RayObject) return v.cls.isA(t);
    if (Array.isArray(v)) return ["Array", "Iterable", "Path", "Structure"].includes(t.name);
    if (typeof v === "string") return ["String", "Array", "Iterable", "Digit"].includes(t.name);
    if (typeof v === "number") return Runtime.NUMBER.has(t.name);
    if (typeof v === "boolean") return t.name === "boolean";
    return false;
  }

  convert(v: Value, t: Value, env: Env, loc: Loc): Value {
    if (!(t instanceof RayClass)) return v;
    if (typeof v === "number" && Runtime.NUMBER.has(t.name)) return v;
    if (typeof v === "number" && t.name === "String") return String(v);
    if (typeof v === "string" && Runtime.NUMBER.has(t.name)) return Number(v);
    if (v instanceof RayObject) {
      for (const m of [...v.cls.allMembers()].reverse()) {
        if (m.kind === "conversion" && this.resolveType(m.type, env) === t) return this.call(new Closure([], m.body, v.cls.env, v, "as", [], m.loc), [], env, loc);
      }
    }
    return v;
  }

  resolveType(t: Type, env: Env): Value {
    if (t.name === "*" || t.name === "static") return null;
    const found = env.lookup(t.name.split(".")[0]);
    let v: Value = found ? found.value : (this.classes.get(t.name.split(".")[0]) ?? null);
    for (const part of t.name.split(".").slice(1)) if (v instanceof RayClass) v = v.findStatic(part) ?? null;
    if (t.filter && v instanceof RayClass) return new Refined(v, t.filter);
    return v;
  }

  // —— natives: the recognised classes ————————————————————————————————————————
  text(v: Value): string {
    if (v === null || v === undefined) return "None";
    if (typeof v === "string") return v;
    if (typeof v === "number") return Number.isInteger(v) ? String(v) : String(v);
    if (typeof v === "boolean") return v ? "true" : "false";
    if (Array.isArray(v)) return "[" + v.map(x => this.text(x)).join(", ") + "]";
    if (v instanceof Variant) return v.label;
    if (v instanceof RayObject) {
      const m = v.cls.find("as");
      return `${v.cls.name}(${[...v.fields.entries()].filter(([k, x]) => !k.startsWith("_") && !(x instanceof Thunk)).slice(0, 6).map(([k, x]) => `${k}: ${x instanceof RayObject ? x.cls.name : this.text(x)}`).join(", ")})`;
    }
    if (v instanceof RayClass) return v.name;
    if (v instanceof Closure) return `<${v.name}>`;
    if (v instanceof Many) return "(" + v.items.map(x => this.text(x)).join(" & ") + ")";
    if (v instanceof Path) return "@" + v.path;
    return String(v);
  }

  private nativeMember(target: Value, name: string, env: Env, loc: Loc): Value | undefined {
    if (typeof target === "number") {
      switch (name) {
        case "negated": return -target;
        case "abs": return Math.abs(target);
        case "floor": return Math.floor(target);
        case "round": return Math.round(target);
        case "sqrt": return Math.sqrt(target);
        case "exp": return Math.exp(target);
        case "ln": return Math.log(target);
        case "cos": return Math.cos(target);
        case "sin": return Math.sin(target);
        case "magnitude": return Math.abs(target);
        case "zero": return target === 0;
        case "successor": return target + 1;
        case "negative": return target < 0;
        case "integer": return Math.trunc(target);
        case "blank": return target === 32 || target === 9 || target === 10 || target === 13;
        case "upper": return (target >= 97 && target <= 122) ? target - 32 : target;
        case "lower": return (target >= 65 && target <= 90) ? target + 32 : target;
        case "index": return target;
        case "next": return target + 1;
        case "previous": return target - 1;
        case "up": return target === 9 ? [0, true] : [target + 1, false];
        case "down": return target === 0 ? [9, true] : [target - 1, false];
      }
      return undefined;
    }
    if (typeof target === "boolean") {
      switch (name) { case "!": return !target; }
      return undefined;
    }
    if (typeof target === "string") {
      switch (name) {
        case "length": return target.length;
        case "empty": return target.length === 0;
        case "chars": return [...target].map(c => c.codePointAt(0)!);
        case "lines": return target.split("\n");
        case "trim": return target.trim();
        case "upper": return target.toUpperCase();
        case "lower": return target.toLowerCase();
        case "snake": return target.replace(/-/g, "_").replace(/\./g, "_");
        case "kebab": return target.replace(/_/g, "-").replace(/\./g, "-");
        case "camel": return target.split(/[_\-.]/).filter(Boolean).map(w => w[0].toUpperCase() + w.slice(1)).join("");
        case "capitalised": return target ? target[0].toUpperCase() + target.slice(1) : target;
        case "first": return target[0] ?? null;
        case "last": return target[target.length - 1] ?? null;
        case "rest": return target.slice(1);
        case "reverse": return [...target].reverse().join("");
        case "quoted": return JSON.stringify(target);
        // a digit
        case "index": return /^\d$/.test(target) ? Number(target) : undefined as any;
        case "next": return /^\d$/.test(target) ? (target === "9" ? null : String(Number(target) + 1)) : undefined as any;
        case "previous": return /^\d$/.test(target) ? (target === "0" ? null : String(Number(target) - 1)) : undefined as any;
        case "up": return target === "9" ? ["0", true] : [String(Number(target) + 1), false];
        case "down": return target === "0" ? ["9", true] : [String(Number(target) - 1), false];
      }
      return undefined;
    }
    if (Array.isArray(target)) {
      switch (name) {
        case "length": case "count": return target.length;
        case "empty": return target.length === 0;
        case "nonempty": return target.length > 0;
        case "first": return target[0] ?? null;
        case "last": return target[target.length - 1] ?? null;
        case "rest": return target.slice(1);
        case "reverse": return [...target].reverse();
        case "sum": return target.reduce((a: number, x) => a + (x as number), 0);
        case "entry": return target[0] ?? null;
        case "each": return new Many(target);
        case "flat": return target.flat();
      }
      return undefined;
    }
    if (target instanceof Path) {
      if (name === "text") return this.io.read(target.path);
      return undefined;
    }
    return undefined;
  }

  private nativeCall(recv: Value, name: string, args: Value[], env: Env, loc: Loc): Value | undefined {
    const fn = (f: Value) => (...xs: Value[]) => this.call(f, xs.map(v => ({ value: v })), env, loc);
    if (typeof recv === "number") {
      const b = args[0] as number;
      switch (name) {
        case "+": return recv + b; case "-": return recv - b; case "*": return recv * b; case "/": return recv / b; case "%": return recv % b;
        case "<": return recv < b; case "<=": return recv <= b; case ">": return recv > b; case ">=": return recv >= b;
        case "==": return recv === b; case "!=": return recv !== b;
        case "pow": return Math.pow(recv, b);
        case "atan2": return Math.atan2(recv, b);
        case "divided": return [Math.trunc(recv / b), recv % b];
        case "shifted_by": return recv * b;
        case "appended": return recv * 10 + Number(args[0]);
        case "plus": return [ (recv + Number(args[0]) + (args[1] ? 1 : 0)) % 10, recv + Number(args[0]) + (args[1] ? 1 : 0) >= 10 ];
        case "as": return recv;
        case "instance_of": return this.instanceOf(recv, args[0]);
      }
      return undefined;
    }
    if (typeof recv === "boolean") {
      const b = args[0] as boolean;
      switch (name) {
        case "&": return recv && b; case "|": return recv || b; case "xor": return recv !== b; case "nand": return !(recv && b);
        case "==": return recv === b; case "!=": return recv !== b; case "!": return !recv;
        case "?": return recv ? fn(args[0])() : fn(args[1])();
      }
      return undefined;
    }
    if (typeof recv === "string") {
      const b = args[0];
      switch (name) {
        case "==": return recv === b; case "!=": return recv !== b;
        case "<": return recv < (b as string); case ">": return recv > (b as string);
        case "starts_with": return recv.startsWith(b as string);
        case "ends_with": return recv.endsWith(b as string);
        case "contains": return recv.includes(b as string);
        case "index_of": { const i = recv.indexOf(b as string); return i < 0 ? null : i; }
        case "split": return recv.split(b as string);
        case "replace": return recv.split(b as string).join((args[1] ?? "") as string);
        case "indent": return recv.split("\n").map(l => l ? String(b) + l : l).join("\n");
        case "repeat": return recv.repeat(b as number);
        case "join": return recv;
        case "plus": { const s = Number(recv) + Number(b) + (args[1] ? 1 : 0); return [String(s % 10), s >= 10]; }
        case "as": return recv;
        case "instance_of": return this.instanceOf(recv, b);
        case "concat": return recv + (Array.isArray(b) ? b.map(x => this.text(x)).join("") : this.text(b));
        case "take": return recv.slice(0, b as number);
        case "drop": return recv.slice(b as number);
        case "map": return [...recv].map(c => fn(b)(c.codePointAt(0)!));
        case "for": { for (const c of recv) fn(b)(c); return null; }
      }
      return undefined;
    }
    if (Array.isArray(recv)) {
      const a = args[0];
      switch (name) {
        case "push": recv.push(a); return recv;
        case "concat": return recv.concat(a as Value[]);
        case "take": return recv.slice(0, a as number);
        case "drop": return recv.slice(a as number);
        case "index_of": { const i = recv.findIndex(x => this.equals(x, a)); return i < 0 ? null : i; }
        case "contains": return recv.some(x => this.equals(x, a));
        case "==": return this.equals(recv, a); case "!=": return !this.equals(recv, a);
        case "map": return recv.map(x => fn(a)(x));
        case "for": { this.forEach(recv, a, env, loc); return null; }
        case "filter": case "~": return recv.filter(x => this.truthy(fn(a)(x)));
        case "some": return recv.some(x => this.truthy(fn(a)(x)));
        case "every": return recv.every(x => this.truthy(fn(a)(x)));
        case "reduce": { let acc = a; for (const x of recv) acc = fn(args[1])(acc, x); return acc; }
        case "join": return recv.map(x => this.text(x)).join(a as string);
        case "most": {
          let best: Value = null, at: number | null = null, bestKey = -Infinity;
          recv.forEach((x, i) => { const k = fn(a)(x) as number; if (best === null || k > bestKey) { best = x; at = i; bestKey = k; } });
          return best === null ? null : [best, at];
        }
        case "sorted_by": return [...recv].map((x, i) => ({ x, i, k: fn(a)(x) as number })).sort((p, q) => p.k - q.k || p.i - q.i).map(p => p.x);
        case "as": return recv;
        case "instance_of": return this.instanceOf(recv, a);
      }
      return undefined;
    }
    return undefined;
  }

  /** `list.for(x => { ... })` - the block runs in the caller's scope (ray: `yield<local: &caller>`), so `return` inside it leaves the caller */
  private forEach(list: Value[], f: Value, env: Env, loc: Loc) {
    if (f instanceof Closure && f.body !== undefined && f.params.length <= 1) {
      for (const x of [...list]) {
        const scope = new Env(env, env.self, env.implicit);
        (scope as any).__owner = (env as any).__owner;
        (scope as any).__callerSelf = (env as any).__callerSelf;
        if (f.params[0]) scope.define(f.params[0].name, x);
        this.body(f.body, scope);
      }
      return;
    }
    for (const x of list) this.call(f, [{ value: x }], env, loc);
  }
}

export class Break {}

/** `Ray{active}` as a value: a class with a filter */
export class Refined extends RayClass {
  constructor(public cls: RayClass, public filter: Expr) {
    super(cls.name, [cls], undefined, [], cls.env, cls.loc);
  }
}

// ——— static natives on the recognised classes ——————————————————————————————————
export function installNatives(rt: Runtime) {
  const arr = rt.classes.get("Array");
  if (arr) {
    arr.statics.set("filled", new NativeFn("filled", (n, v) => Array.from({ length: n as number }, () => v)));
    arr.statics.set("range", new NativeFn("range", (n) => Array.from({ length: n as number }, (_, i) => i)));
  }
  for (const n of ["Real", "Decimal"]) {
    const c = rt.classes.get(n);
    if (!c) continue;
    c.statics.set("ZERO", 0); c.statics.set("ONE", 1); c.statics.set("TWO", 2); c.statics.set("PI", Math.PI); c.statics.set("TAU", 2 * Math.PI);
    c.statics.set("PRECISION", 16);
    c.statics.set("of", new NativeFn("of", (x) => x as number));
    c.statics.set("of_fraction", new NativeFn("of_fraction", (d) => Number("0." + (d as string[]).join(""))));
    c.statics.set("aligned", new NativeFn("aligned", () => 0));
    c.statics.set("from_scaled", new NativeFn("from_scaled", (z, p) => (z as number) / Math.pow(10, p as number)));
  }
  const rnd = rt.classes.get("Random");
  if (rnd) { rnd.statics.set("MODULUS", 4294967296); rnd.statics.set("MULTIPLIER", 1664525); rnd.statics.set("INCREMENT", 1013904223); }
}

/** a short rendering of an expression, for messages */
export function show(e: Expr): string {
  switch (e.kind) {
    case "number": return e.value;
    case "string": return JSON.stringify(e.parts.map(p => typeof p === "string" ? p : `{${show(p)}}`).join(""));
    case "name": return e.name;
    case "this": return "this";
    case "member": return `${show(e.target)}.${e.name}`;
    case "call": return `${show(e.target)}(${e.args.map(a => (a.name ? a.name + ": " : "") + show(a.value)).join(", ")})`;
    case "binary": return `${show(e.left)} ${e.op} ${show(e.right)}`;
    case "unary": return `${e.op}${show(e.operand)}`;
    case "index": return `${show(e.target)}[${show(e.at)}]`;
    case "list": return `[${e.items.map(show).join(", ")}]`;
    case "lambda": return `(${e.params.map(p => p.name).join(", ")}) => ...`;
    default: return e.kind;
  }
}
