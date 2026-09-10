/**
 * The syntax tree of the brace dialect. Every node has a `kind`, which is also the CONSTRUCT
 * NAME a Language's map rule matches by (`{if predicate yes no}` matches a node of kind `if`
 * with parts `predicate`, `yes`, `no`). Part names are the property names below.
 */

export type Loc = { file: string; line: number; col: number };

export type Type = {
  kind: "type";
  /** `1 Edge` - how many; None = the Many */
  count?: number;
  /** `Ray`, `Ray.Initial`, `*`, `static` */
  name: string;
  /** `Ray{active}` */
  filter?: Expr;
  /** `Digit[]` - how many `[]` */
  array: number;
  optional: boolean;
  /** `(x: *): boolean` */
  fn?: { params: Param[]; returns?: Type };
  /** `[Digit, boolean]` */
  tuple?: Type[];
  /** `"-"` */
  literal?: string;
  /** `T | U` */
  union?: Type[];
  loc: Loc;
};

export type Param = { name: string; type?: Type; optional: boolean; default?: Expr; loc: Loc };

export type Expr =
  | { kind: "number"; value: string; loc: Loc }
  | { kind: "string"; parts: (string | Expr)[]; loc: Loc }
  | { kind: "path"; value: string; parts?: (string | Expr)[]; loc: Loc }   // @./a/{id}/b - interpolated like a string
  | { kind: "name"; name: string; loc: Loc }
  | { kind: "this"; loc: Loc }
  | { kind: "context"; name: string; loc: Loc }            // &caller
  | { kind: "list"; items: Expr[]; loc: Loc }
  | { kind: "member"; target: Expr; name: string; optional: boolean; loc: Loc }
  | { kind: "dynamic"; target: Expr; name: Expr; loc: Loc }  // x[name] with a string
  | { kind: "index"; target: Expr; at: Expr; loc: Loc }
  | { kind: "call"; target: Expr; args: Arg[]; optional: boolean; loc: Loc }
  | { kind: "configure"; target: Expr; config: Arg[]; loc: Loc }   // f<local: &caller>
  | { kind: "filter"; target: Expr; predicate: Expr; loc: Loc }     // x{...} / Ray{active}
  | { kind: "optional"; target: Expr; loc: Loc }                    // x?
  | { kind: "paren"; inner: Expr; loc: Loc }                        // (x) - kept, so that a language can set it
  | { kind: "many"; target: Expr; loc: Loc }                        // x# - the superposition of x
  | { kind: "unary"; op: string; operand: Expr; loc: Loc }
  | { kind: "binary"; op: string; left: Expr; right: Expr; loc: Loc }
  | { kind: "instance_of"; target: Expr; type: Expr; loc: Loc }      // x ==.instance_of T
  | { kind: "as"; target: Expr; type: Type; loc: Loc }
  | { kind: "ternary"; predicate: Expr; yes: Expr; no: Expr; loc: Loc }
  | { kind: "lambda"; params: Param[]; returns?: Type; body: Body; config?: Arg[]; loc: Loc }
  | { kind: "block"; body: Block; loc: Loc }
  | { kind: "class"; ctor?: Param[]; parents: Type[]; parts: Part[]; body: Block; loc: Loc }
  | { kind: "enum"; variants: Expr[]; body: Block; loc: Loc }
  | { kind: "type_expr"; type: Type; loc: Loc }
  | { kind: "if"; predicate: Expr; yes: Body; no?: Body; loc: Loc }
  | { kind: "unless"; predicate: Expr; yes: Body; loc: Loc }
  | { kind: "while"; predicate: Expr; do: Body; loc: Loc }
  | { kind: "draw"; weights: Expr; outcomes: Expr; loc: Loc };

export type Arg = { name?: string; value: Expr };
export type Part = { name?: string; type?: Type; literal?: string };
export type Body = Expr | Block;

export type Stmt =
  | { kind: "label"; name: string; loc: Loc }
  | { kind: "goto"; label: string; predicate?: Expr; loc: Loc }
  | { kind: "return"; value?: Expr; predicate?: Expr; loc: Loc }
  | { kind: "recur"; loc: Loc }
  | { kind: "assert"; requirement: Expr; predicate?: Expr; loc: Loc }
  | { kind: "define"; names: string[]; type?: Type; value?: Expr; modifiers: string[]; predicate?: Expr; loc: Loc }
  | { kind: "assign"; target: Expr; value: Expr; predicate?: Expr; loc: Loc }
  | { kind: "extend"; target: Expr; body: Block; loc: Loc }
  | { kind: "method"; names: string[]; params: Param[]; returns?: Type; body?: Body; modifiers: string[]; config?: Arg[]; loc: Loc }
  | { kind: "rule"; id: string; name: string; rate?: string; params: Param[]; body: Body; loc: Loc }
  | { kind: "named"; keyword: string; name: string; params: Param[]; returns?: Type; body?: Body; loc: Loc }  // visual / theorem / choose / test / data
  | { kind: "map"; pattern: Block; target: Expr; strength?: string; loc: Loc }   // {pattern} => "text" | force/suggest/approx {pattern} => { block }
  | { kind: "grammar"; pattern: Block; params: Param[]; body: Body; loc: Loc }  // {method: *}(args) => ...
  | { kind: "conversion"; type: Type; body: Body; loc: Loc }         // as (=== T) => body
  | { kind: "index_method"; params: Param[]; returns?: Type; body: Body; loc: Loc } // [at: N] () => ...
  | { kind: "expr"; expr: Expr; predicate?: Expr; loc: Loc };

export type Block = { kind: "program"; statements: Stmt[]; loc: Loc };

export const isBlock = (b: Body): b is Block => (b as Block).kind === "program";
