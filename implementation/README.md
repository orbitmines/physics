# The `.ray` setup — language reference for this repository

Read this before touching any `.ray` file. Everything in this repository is *defined* in `.ray`;
every other file (TypeScript, Python, shaders, tests, visuals, theorems, data) is *generated* from
it. Nothing below was invented here: every construct was confirmed with the author. **If a needed
construct is not on this page, do not guess it — ask, then add it here.**

## 1. Pipeline

```
implementation/ray/          the Ray language: stdlib written in .ray + a minimal TS bootstrap that runs .ray
implementation/physics.ray/  physics-only core (Theory, Geometry, Source, ...) and the theories (theories/G/G.ray)
implementation/gen/          the code generator, written in .ray, run by the bootstrap
implementation/examples/     example projects that depend on physics.ray and fill in definable slots

languages/physics.ts/        generated: npm `@orbitmines/physics` (browser + node)
languages/physics.py/        generated: PyPI `orbitmines-physics`, `import orbitmines.physics`
tests/                       generated: one suite per language/backend, from every `dynamically assert`
visuals/ theorems/ data/     generated, language-independent outputs
```

Flow: rules in a theory (`G.ray`) → `gen` reads the theory as data → per Language × Backend it
matches every program against the language's map rules → files. The rules are dynamic: change
`G.ray`, rerun, everything downstream changes.

Running (from the repository root, after `npm install` there): `npx ray <file-or-project>` runs Ray;
`npx ray gen` regenerates every output; `npx ray test [projects...]` runs every requirement on every
fixture in the bootstrap; `npx ray visuals [ids...] [--stills] [--record]` records every film's world
(stale or missing recordings first) and renders each visual with headless Chrome; `npx ray measure
[names...]` runs the model on the generated package and writes the galaxy densities and the law;
`npx ray data [ids...]` fetches the borrowed catalogues; `npm test` runs the bootstrap, TypeScript and
Python suites. The bootstrap lives in
`implementation/ray/bootstrap/` (TypeScript). It is temporary and deliberately small.

Delivery order: (1) discrete rules + backends + visuals → (2) counting rules into the continuous
line → (3) prover/theorems → (4) notation + data catalogue. Each fully generated and tested before
the next.

Projects: a folder with a `.project.ray` is a project; scope is directory-derived, there are no
imports. `implementation/ray/.project.ray` has `` `!language` `` as its first line (it defines the
language); the other `.project.ray` files are plain/empty.

## 2. The one primitive

The only primitive in the whole language is the conditional goto:

```
goto L if p        // jump to label L when p holds
goto L             // sugar for `goto L if true`
```

Labels are written on their own line, one column left of the block, as `name\`:

```
if := class (predicate: boolean, yes?: (): *) {
  no?: (): *

  () => {
    goto 1 if predicate
   0\ return no<local: &caller>?()
   1\ return yes<local: &caller>?()
  }
}
```

`if`, `unless`, `while`, `return` and every other control-flow word are defined in
`implementation/ray` on top of `goto`. There are **no host primitives**: numbers, booleans, strings
and lists are `.ray` classes too (ported from the ray repo, `../ray/@ether/.ray3`). The bootstrap
and `gen` are allowed to be smart — they recognise a structure that *is* a number/string/list **by
class name** (`Number`, `boolean`, `String`, `Array`) and encode it natively — but the definitions
are the `.ray` ones. This is what keeps the compute graph small: everything downstream (rules, GPU
kernels, equations) is derived from goto plus these definitions.

Machine types by class name: `N`/`Natural` → u32, `Z`/`Integer` → i32, `Real`/`Decimal` → f32.

## 3. Dialect (brace style, as in `G.ray`)

| construct | form |
|---|---|
| new definition | `name := expr` |
| reassignment | `name = expr` (must already exist) |
| typed new definition | `name: Type = expr` (also a new definition) |
| field with default | `active: boolean = false` |
| method | `name (args): ReturnType => body` — body is an expression or a `{ ... }` block |
| bodyless method | `choose (d: Exit): Number` — abstract: must be defined by someone else (another project, a rule); calling it undefined is an error |
| class | `Name := class (constructor pattern)? < Parent? { ... }` |
| typed class instance | `G: Theory = class { ... }` (`G` is a `Theory`, defined as a class literal) |
| enum | `boolean := enum false \| true { ... }` (higher inductive types allowed the same way) |
| extension | `Ray += { ... }` adds members to an existing class — **project-scoped**: `physics.ray`'s `Ray += {}` changes Ray for physics.ray and for code interacting with that package, not other Rays in an importing project |
| override in place | redeclaring the same member (e.g. `rule /S.1 ...`) on `G += { }` replaces it, keeping its position |
| and / or / not | `a & b`, `a \| b`, `!a` — and these are what `if` takes: `if a & b { }`, `if !a { }`, `unless a { }` |
| filter / refinement | `Ray{active}`, `Edge{value.(initial & terminal).active}` — a constraint on the type |
| distribution | `.(a & b).prop` ≡ `.a.prop & .b.prop` |
| optional | `x?`, `yes?: (): *` |
| caller-scoped block | `block<local: &caller>()` runs a block in the caller's scope (so `return`/`break` are the caller's) |
| conditional postfix | `return x if p` |
| assertion (= a test) | `dynamically assert expr` — a requirement a type must meet; every one becomes a generated test. Tests live in **separate files** that extend the type under test with asserts (`World{ticks == 100} += { dynamically assert ... }`), e.g. `theories/G/tests/*.ray` |
| calls | dot-method only: `a.fold(b)`, `this.unfold`, `this.leaving.grow` — `()` optional with no args; **no** juxtaposition (`f a, b`), **no** `->` (that is Ray's recursive-structure operator) |
| loops | `list.for(x => { body })`; `list.map(x => expr)`; `.each.method` broadcasts (`vertex.rays.each.activate`); `recur` = tail self-call (defined via goto, not a primitive) |
| strings | `"text {x} more"` interpolates any expression; literal braces are `{{` / `}}`; applies to every string literal |
| filter | `list.filter(x => p)`, alias `list ~ (x => p)` |
| per-exit array | `folds: N[] = this.exits.map(_ => 0)`; `folds[d]` indexes by exit |
| control words | `if p { }`, `if p { } else { }`, `if p { } elsif q { } else { }`, `unless p { }`, `while p { }`, `return x if p`, `goto L if p`; parentheses around `p` optional; a single statement may follow inline without braces |
| implicit labels | every program has `start\` before its first statement and `end\` after its last, and an implicit local `result`; `return` is `result = value; goto end`; `recur` is `goto start` |
| glyph aliases | allowed as in the ray repo (`vertex \| ∙`, `edge \| ⊙`, `initial \| ⊢`, `terminal \| ⊣`); plain names preferred here |
| emission | `program.as(WGSL)` applies a Language's map rules to a program (ray repo's `as (language: Language)`) |
| class parts | `N := class < Number, digits: Digit[] { }` — parent list then named parts (`"literal"` parts are the written form); `N(digits: [...])` constructs; parts become fields |
| enum order | variants are a Ray in declaration order: `.next`, `.previous`, `.index` (N); past the ends is `None` |
| list API | `[a, b]`, `x[i]`, `?? default`, `None`, `.length .push .concat .reverse .rest .take(n) .drop(n) .some .every .join .first .last .filter/~ .map .for .reduce .each` — `implementation/ray/Iterable.ray` |
| goto lowering | three composing rewrite rules in `implementation/ray/Rewrite.ray`: `{ program } => { state := start; while true { program } }`, `{ goto label if predicate } => { if predicate { state = label; recur } }`, `{ label\ block } => { if state == label { block } }` |
| map | the object literal `{ }`: `index := { }`, `index[key] = v`, `index[key]` (None when absent); keys are strings (ray repo's `x[name]` dynamic members) |
| comments | `//` and `/* */` |

There is **no** `let` and **no** `when` (the old `G.ray` had them; they are wrong). Bind with `x := expr`.

### Modifiers on methods (keyword before the name)

- `rule /id "Name" (pattern) => body` — a rule of a theory. `/id` is the article's label (`/1`, `/c`, `/S.1`, `/S.v`).
- `visual "gravity.rain" () => <a Picture>` — a visual (`Visual.ray`): the body returns a `Picture`
  (`id what width height frames`, an optional `record: Recording`, and `paint`, a Program from the
  played frames to a `Painter`). gen writes `visuals/visuals.ts` (`VISUALS[id]()`); `npx ray visuals`
  records each film's world into `visuals/<id>/frames.f32` + `frames.json`, then renders it with
  headless Chrome into `animation.webm`, `snapshot.png` (the last frame), `index.html`, and the
  contents page `visuals/index.html`. See §"The visuals" below.
- `theorem "gravity.mass" () => { ... }` — a theorem; generated into `theorems/<id>/`.
- `data "sparc-curves" ...` — a borrowed dataset (form to be confirmed when phase 4 starts).
- `static`, `internal` as in the ray repo.

### Rules

- Rules are methods. Quantification is **implicit in the parameter pattern**; the backend decides
  parallelism. Declaration order = pass order; a match belongs to the first rule that takes it.
- **A point is many Rays.** `(x: Ray{active})` fires **once per point** with `x` = the Many of that
  point's matching rays: methods on `x` apply elementwise (`x.MOVE` per ray), and `x.vertex`
  collapses to the one point (a superposition of equal things is one thing), so `x.vertex.CREATE`
  runs once. `1 Edge{...}` / `1 Boundary{...}` = each single element. `()` = once per tick, on the World.
- Model: a `Ray` is one exit-slot of a point (`vertex`, `exit`), with ends `initial` (at the point)
  and `terminal` (towards the neighbour); an `Edge` joins the terminal ends of the two opposite rays
  of neighbouring points; `active`/`arriving` live on `Boundary`; `Ray.active = initial.active &
  terminal.active`; `Ray.activate` sets both; a meeting is `Edge{active}` (both ends).
- Emission lights the **neighbour's** same-heading ray (`x.ray.steps.activate`), never the cell's own.
- **GPU backends only run the continuous model** (phase 2). Phase 1 backends are CPU, per language.
- A rule body may fill a definable slot: `rule /S.1 "Emission" (x) => { ... choose ... }` in another
  project (see `implementation/examples/`).

### `draw` — weighted random choice

```
draw([1, this.vertex.folds], [this.steps, d => this.vertex.outward(d)])
```
Two lists, weights and outcomes, paired positionally. A weight that is a list (`folds`, one per
exit) fans out: its outcome is a function of the index. Total the weights, pick uniformly in
`[0, total)`, return that outcome. Randomness is the World's
seeded stream (`World.seed`), deterministic per seed.

### Paths as values (IO)

A path is written with the `@` location operator: `@./languages/physics.ts/index.ts`; quotes only if
it contains spaces; it always starts with `./` or `/`. `@./path := text` writes the file **and creates
missing directories**; `@./path = text` is a plain write (the directory must exist); reading
`@./path` reads the file. A path interpolates like a string: `@./visuals/{id}/film.ts := text`
(`{{` for a literal brace). This is how `gen` writes every output.

## 4. Physics core (`implementation/physics.ray`)

Graph words (methods on Vertex / Ray / Boundary in `Theory.ray`), meanings fixed:

| word | meaning |
|---|---|
| `a.fold(b)` | merge point `b` into `a`, recording on `a` which exit `b` was behind (space −1, folds +1) |
| `x.unfold` | hand a point of space back at `x`, taking one fold off each way that holds one (space +1) |
| `r.hand(to)` | ray `r` steps onto boundary `to` as *arriving* (settled by the Arrival rule) |
| `x.grow` | make a new point past boundary `x` at the frontier |
| `this.leaving` | the boundary a ray exits by (its terminal) |
| `this.facing` | the ray coming the other way across the same edge |
| `this.steps` | the boundary reached by stepping straight on across the ray's own exit (c̄ = one step a tick, always) |
| `vertex.outward(d)` | the boundary across exit `d` of the current point |
| `x.along` | unit vector of `x`'s exit direction |
| `d.steps` | length of one step along exit `d` (one cell) |
| `whole per exit` | an array of naturals, one slot per exit (`folds[d]`) |
| `v.along(d)` | component of vector `v` along exit `d` |
| `v.most` | the exit with the largest component of `v` |
| `cells.map(c => c.outward(d))` | for each cell, the point across exit `d` |
| `there whole` / `there vacuum` | all those points exist / none is owned by a source |

- Everything a Source does is **definable**: named choices are declared bodyless on Source
  (`choose "emit?" (exit: N): boolean`, `choose "mass" (): Real`), used as `s.choose("emit?")(exit)`,
  and filled by extending Source in the owning project: `Source += { choose "emit?" (exit) => ... }`.
- Rewrites are immediate; each rule iterates a snapshot of its matches taken before it runs.
- `World` holds `theory, geometry, N, seed, bound, ticks`; `tick ()` in `Theory.ray` is the
  reference semantics: every rule in order over all its matches, rewrites flushed after each rule. A
  Backend may replace it with its own pass schedule; tests check backends against this.
- Geometries: `FCC12 := Geometry.nearest(3, 12)` — the `DEG` nearest integer offsets in Z^D by
  Euclidean distance, ties kept by shell. `nearest(2, 8)` = square-8, `nearest(3, 6)` = cubic-6.
  Weighted / icosahedral lattices need their own generator later.

### Confirmed API (2026-09-10)

- Array (`implementation/ray/Iterable.ray`): `length count empty nonempty first last every some reduce map filter/~ each contains join push concat reverse rest take(n) drop(n) == index_of(x) most(key) sum filled(n, x) range(n)`; `sorted_by(key)` (Geometry.ray).
- String (`implementation/ray/String.ray`): `== != < length empty starts_with ends_with contains index_of split replace lines indent(prefix) trim upper lower snake kebab camel capitalised quoted repeat(n)`.
- Vector: `+ - * dot norm unit along(dir) negated == key Vector.zero(D)`. Geometry: `D DEG V(d) steps(d) opposite(d) Geometry.shells(D, [squared]) Geometry.nearest(D, DEG) Geometry.box(D, radius)`; named: `LINE2 SQUARE4 SQUARE8 CUBIC6 FCC12 CUBIC18 CUBIC26`.
- World: `theory geometry N seed bound ticks vertices live index random expands folded annihilations created laid positions place(at) make(here, d) at(position) all(kind) tick draw(weights, outcomes) rays points sources add(source) within box` — `live` is the list of points not folded away, `index` maps `Vector.key` to the point ever made there; edges are enumerated from the end whose point has the lower `Vertex.ordinal`.
- Vertex: `world at ordinal rays exits source density destroyed folds held folded_into alive busy neutral vacuum emits(d) outward(d) fold(b) unfold`.
- Ray: `vertex exit initial terminal active arriving activate deactivate emits neutral leaving along ahead facing steps turns hand(to) settle`. Boundary: `active arriving activate deactivate ray vertex emits across grow`. Edge: `initial terminal active link(a, b)`.
- Source: `world cells at half radius moves momentum advance stepped moved_along spare mass absorbs emits(exit) ahead(d)`; choices `choose "emit?" (exit: N): boolean`, `choose "mass" (): Real`.
- Rule (data): `id name over single where body matches(world) apply(x)`. Theory: `name rules visuals theorems carried seed(geometry, N, seed, bound)`.

## 5. Languages, backends, gen (`implementation/gen`)

```
WGSL: Language = class {
  extension = ".wgsl"
  {if predicate yes no} => "if ({predicate}) {{ {yes} }} else {{ {no} }}"
}
```

- A **map rule** is `{ <any .ray pattern> } => "<target text>"`. `{x}` interpolates a bound part;
  literal braces in the target are doubled `{{ }}`. gen matches most-specific-first: a language that
  declares `if` gets an `if`; one that does not gets the goto lowering.
- A **rewrite rule** (Ray → Ray) has the same shape with a `.ray` block on the right:
  `{ <pattern> } => { <replacement> }`. The `goto`-program → `while + switch(state)` lowering is one
  of these, in `implementation/ray`, used only by languages without goto.
- **Backends** are top-level and shared across languages: `WebGPU: Backend = class { name, kernel = WGSL,
  head, declarations, supports(language), runtime_for(language), kernels(theory) }` in `gen/backends/`.
  The kernels of the continuous model are written ONCE, in `gen/backends/Kernels.ray`, from the
  pieces of a shader language (`gen/languages/Shader.ray`: `WGSL`, `GLSL`, `OpenCL_C`, `CUDA_C`, `MSL`,
  `HLSL`, each with the term map rules and `fix/mut/loop/func/arg/entry`, `ctx_params/ctx_args`,
  `preamble` naming `f32 u32 i32`, casts `f32_of_u i32_of_u i32_of_f u32_of_i`, maths `absf maxf
  clampf rnd`) and the backend's `head` (a `#version`) and `declarations` (the bindings of `P`, `st`,
  `cel`, `dir`). The text carries a manifest - `//! tick <passes>` and `//! kernel NAME over
  cells|cells*A|holes*A` - that a runtime reads for the pass order and widths; GLSL runtimes compile
  each kernel with the common part as its own program. Every write is to the thread's own place: no
  atomics, so the same text runs on every API.
- Backends: `CPU` (the emitted classes), `WebGPU` (runtimes `webgpu.runtime.ts` for browsers/Deno,
  `gpu.runtime.py` via wgpu-py), `Vulkan` (GLSL 450; Python via wgpu-py/naga, the same
  `gpu.runtime.py`), `OpenGL` (GLSL 430; Python via moderngl, `opengl.runtime.py`), `OpenCL` (Python
  via pyopencl, `opencl.runtime.py`), and `CUDA`, `Metal`, `DirectX` as kernels only (no device to
  test a runtime against). Every GPU backend's kernels are also written to
  `languages/kernels/<theory>.<backend>.<ext>`; a runtime-bearing one becomes
  `languages/physics.py/orbitmines/physics/<backend>.py` (and `.ts/src/webgpu.ts`) with a generated
  agreement test against the CPU Field (`npm run test:gpu`; Python tests skip where the binding's
  `ready()` is false). Python's wgpu is pinned to the platform API (`WGPU_BACKEND_TYPE`) because its
  GL probe panics once another binding holds an OpenGL context in the process.
- gen reads a theory as data: `theory.rules` (in order), each `Rule(id, name, over, single, where, body)`;
  plus `visuals`, `theorems`. `Gen.constants`, `Tests.requirements`, `Tests.fixtures` are read off the
  loaded projects by the bootstrap (declared bodyless in .ray, fulfilled by the host, like IO).
- **Holes**: an identifier a pattern does not KNOW (no class, member, part, static or definition of that
  name anywhere loaded, and not a keyword `choose/rule/visual/theorem/test/data`) is a hole; known names
  are literal; most literal structure wins. Choose hole names no class declares (`cond`, `lhs`, `rhs`,
  `nm`, `ty`, `stmts`, `xs`, `tgt`, `arglist`, ...). A bare class name as a pattern (`{N} => "number"`)
  is a **type** rule. `{Class(arglist)}` matches construction of any class (`Class` binds its name).
- **Helpers on a bound part** in a target: `{x.indent}`, `{x.returned}` (the last expression returned),
  `{x.method}` (operator name to a word: `+`→`plus`, `==`→`equals`, ...), `{x.quoted}`, `{x.snake}`,
  `{x.identifier}`, `{x.capitalised}`, `{x.first}`, `{x.bare}` (a parameter's name).
- **Reserved settings** (a rule whose pattern is the bare name): `{separator}`, `{indent}`, `{newline}`,
  `{statement_end}`, `{interpolation}` (with `{x}`), `{named_arg}` (`{nm}`, `{val}`), `{parameter}`,
  `{parameter_untyped}`, `{parameter_default}` (`{nm}`, `{ty}`, `{val}`), `{empty_block}`, `{whole}` (a whole-number
  literal, `{val}`: a shader writes `{val}.0`).
- A Language also has ordinary methods gen calls: `nested(outer, name, inner)`, `constant(name, text)`,
  `write_package(code)`, `test_case(requirement, fixture)`, `write_tests(cases, fixtures)`.
- The runtime template holes are `{{core}}`, `{{theories}}`, `{{constants}}` (written with doubled
  braces in .ray strings, since `{x}` interpolates).

### Optimizations

`.ray` definitions are written to be read, not to be fast. `implementation/physics.ray/Optimizations.ray`
says how an implementation may do better, without changing meaning: plain extensions add the state an
optimization keeps (`World += { positions_index: {} = { } }`), and rewrite rules with the ray repo's
strength modifiers say which expression stands for which:

```
force   { this.vertices.push(v) } => { this.vertices.push(v); this.positions_index[v.at.key] = v }
suggest { this.vertices.filter(v => v.alive & v.at == position).first } => { this.at_indexed(position) }
```

`force` always applies; `suggest` applies where the language's cost prefers the result (a Language may
define `cost (program: Program): Real`, default = size of the tree); `approx` only where a Language
sets `approximations = true`. A Language class may hold rewrite rules of its own (a `.ray` block on
the right) that apply only for it. Every implementation searches systematically: `force` to a
fixpoint, then the cheapest fixpoint over `suggest` — gen before emission, and the bootstrap on every
method body after loading.

### The reading (phase 2)

- **Names are aliases.** The reading attaches a symbol by an alias on the member: `ρ | active` (Boundary),
  `β | stepped` and `Σ | emits` (Source), `n_f | folds` (Vertex), `ω | ahead` (Ray), `F | active`
  (Edge: a meeting's share is F times its ends'), `n | rays` (World). A rule's rate is an alias on the
  rule: `rule /2 "Creation" | ν (x: Ray{neutral}) => ...`. The equation uses the shortest alias.
- **Programs are data.** `program.statements` is a list of `Node`s; a Node has `construct`
  (`if`, `while`, `method` (a call `x.m(args)`: `receiver`, `method`, `arguments`), `call`, `member`,
  `assign`, `define`, `return`, `binary` (`operator`, `left`, `right`), `unary`, `lambda`
  (`parameters`, `body`), `list` (`items`), `name`, `number`, `string`, `index` (`target`, `index`),
  `expression`, ...), its parts by those names, and `source` (its text). `Class.method("name")` is the
  Program of that method (through aliases), `Class.alias("name")` its shortest alias, `Class.members`
  its members. Every level is an abstraction over goto: a reading may follow a method's program down.

- **Reading.ray** derives every rule's term by running its program on a symbolic match (`Symbolic`
  elements, `Term` = Ray source over the symbols `s`, `Doing` = the ledgers moved); **Continuum.ray**
  turns the branches into `Equation` (`terms`, `left`, `right`, `as(language)`, `latex`, `space`).
  `Term.at(symbols)` runs a term; `Term.as(LaTeX)` sets it (`gen/languages/LaTeX.ray`). gen writes the
  equation into every package as data: `G.equation = { latex, terms: [{ rule, rate, degree, outside,
  settles, transport, share: (s) => ..., rays, space, folds }] }`.
- **Field.ray** integrates the equation on an N×N box, per way: `n[a * cells + c]`, a fold record per
  way `fold[a * cells + c]` (its per-cell sum is `folds`), ledgers `space`, `destroyed`, `blocks`,
  `rho`, `keep`, `pools`. One tick: `aim`, snapshot `was`, `sweep`, `emit` (bodies), `create` (point
  terms against `rho^degree`), `tally`, `meet` (meeting terms; every meeting has two sides and each
  cell takes its own - the pair it stands in, `hop(c, a)`, and the pair one step `back` that lands
  here - so no cell writes another's ledger), `tally`, `carry` (kept straight on, the rest pooled and
  sent down the folded ways, evenly when none), then `propel`. A blocked cell (a body) carries only
  what was put down there this tick. `theory.field(N, A, K, seed, DEG)`.
- **Kernels.ray** emits the same tick as kernels off the equation's terms (`meet{k}_gate/rays/space/folds`
  per meeting term; `SNAP`, `SWEEP`, `SIGMA` (= emit), `CREATE`, `TOTAL` (= tally), `MEET`, `POOLSUM`,
  `CARRY` (a gather)); the runtimes run the passes in the CPU order and write `blocks` on `add`. `gpu(N, A, K)` has the Field's surface: `tick`, `state`, `rho`,
  `folds`, `mean`, `add(hole)`. Agreement tests are generated per GPU backend
  (`tests/ts/G.webgpu.test.ts` for Deno, `tests/py/test_G_webgpu.py` skipping without `wgpu`):
  `npm run test:gpu`. Numbers in Python: a quotient of whole numbers is whole when exact (an index),
  real otherwise - the bootstrap's one number.
- Explicit parentheses are kept as a `paren` node (a language may set them: `{(a)} => "\\paren{{{a}}}"`).
- `a ^ b` is the power (right-associative, above `*`).

### The prover (phase 3)

- **Algebra.ray**: a `Term` is Ray source over `s`; its tree is the program's own AST (`Term.node`). On it:
  `mentions(name)`, `substitute(name, by)`, `derivative(name)` (sum, product, power rules; a call is
  taken as standing still), `simplify` (numbers folded, ones and noughts gone, x^1 and x^0 read, a
  product's factors collected so ρ²/ρ is ρ), `inverse`, `negated`, `root(name)` (carried as
  `Solve.root(s, "ρ", (s) => e)`: bisection in [0, 1] when run, `\text{the } \rho \text{ where } e = 0`
  when set). A `Symbols` class declares the prover's own symbols (`δ λ r L S v c Rb Φ sigma_tr rho_inf
  infty`) so that a member name in a pattern (`{s.δ}`) is literal rather than a hole.
- **Prove.ray**: `Fact(kind, of, to)` (`is | grows | restored | conserved | isotropic | positive`),
  `Step(fact, via, rule?, from, because, working, derivation)`, `Store` (first arrival keeps the slot),
  `Inference(name, because, fire: (s: Store) => Step[])`, `Prover(theory)`: `premises` read off the
  equation (what is made / taken and their ray counts, every rate = 1, the ways out of a point, the
  density's restoring rate = −Σ d/dρ of the terms, δ conserved and isotropic, c̄ = 1, v off the turn's
  draw), `RULES` (ehrhart, counting, balancing, unbiased, free_path, spreading, screening, summing,
  horizon), `saturate` (a rule re-runs only where the store grew), `behind(store, about)`, `proof`.
  `theorem "id" () => Asked(asks: "...", about: "ρ_∞")` on a theory; `theory.proved` is a `Proof`
  (`theorem(id)`, `has`, `concluded`, `standing`, `ids`) of `Proved` records with `Line`s
  (`kind rule|theorem`, `via`, `line` in LaTeX markup, `working`, `because`). The old prover's other
  ~40 inference rules (refracting, massOf, shadowing, relativity, ...) are NOT ported yet: 8 of the 42
  theorems are declared on G.
- **gen/Theorems.ray** writes `theorems/<id>/{proof.json, README.md, index.html}` (KaTeX, `\paren` as
  growing brackets) and the index; `languages/physics.ts/theorems.ts` (`PROVED`, `proved`, `theories`,
  `asked`) and `orbitmines/physics/theorems.py` carry the same records. Old theorem folders the new
  pipeline does not regenerate are left in place.
- `fail(says)` throws (what `assert` calls); `Array.pop` takes the last element off.

### The notation and the data (phase 4)

- **Notation.ray** is the markup a line is written in (ASCII: `\bar{r}^{D-1}`, `\frac`, `\paren`, `\text`,
  `\sum_{a}^{b}`, `[[ref]]`) read into `Piece`s (`kind`, `text`, `of`, `lo/hi`, `over/under`, `base`,
  `raised/lowered`, `key`) by `Notation.parse`, walked by `Notation.set(pieces, setter)` through a
  `Setter` (`together`, `text`, `words`, `wrap(kind, c)`, `big(kind, lo, hi)`, `frac`, `binom`,
  `scripted`, `underset`, `ref`); the default Setter writes HTML (`Notation.html`). `Notation.check`
  refuses combining marks, unicode scripts, dashes and minus signs. These classes are in every
  package; `languages/physics.ts/notation.ts` (template `gen/languages/notation.runtime.ts`) adds
  `notation(React, PROVED)` - the components (`Eq`, `V`, `K`, `Bar`, `Frac`, `Markup`, `Film`, ...) the
  article is set in, as one more Setter over the same parse - and re-exports `parse`, `html`, `set`,
  `check`, `REFERENCES`. Python: `orbitmines.physics.notation`.
- **Catalogue.ray**: `data "id" () => Catalogue(...)` declarations on `Borrowed` (collected as
  `datasets`); `npx ray data [ids]` fetches each from its authors' address (cached in `data/.raw`,
  `RAY_REFETCH=1` to refetch), parses it (`Mrt` reads a CDS/AAS machine-readable table by the
  description it carries; `Horizons` reads a JPL page) and writes `data/<id>/field.f32` + `meta.json`.
  The host fulfils only `Catalogue.fetch/pdf_text/save_f32/number/numbers` (bodyless statics: the
  bootstrap's `hosted` map, installed by the CLI). Catalogues: sparc-galaxies, sparc-curves,
  sparc-btfr, genzel-discs, solar-inner. The old `check()` against Lelli's own masses is not ported.
- A string in a `.ray` file knows only `\n`, `\t`, `\"` and `\\`: write a carriage return as
  `String(chars: [13])`. `{x}` interpolates in EVERY string, so a LaTeX `{...}` in a string is `{{...}}`.
- Package rules added: `{whole}` (see settings), `{static nm = val}` (a static written as it was
  written), string methods (`starts_with ends_with replace split trim upper lower lines quoted chars`,
  `String(chars: xs)`, `Char.blank`), `xs.pop`; the Python emitter writes `nonlocal` for a hoisted
  lambda that assigns a name of the scope around it. `contains`/`index_of` helpers take strings too.
- A hole name is shadowed by ANY class member of that name (`sup` in `{nm := class < sup {...}}` broke
  when `Piece` had a `sup` field): check the pattern holes of `gen/languages/*.ray` before naming a
  member `sup`, `xs`, `nm`, `ty`, `val`, `membs`, `paramlist`, `mbody`, `ret`, `cnt`, `x_`, `tgt`, `key`.

### The visuals (Visual.ray, Panel.ray, Galaxies.ray, Sparc.ray, Law.ray, Model.ray)

- **Visual.ray**: `Surface` (bodyless: the host's 2D canvas - `fill_style stroke_style line_width alpha
  fill_rect stroke_rect clear_rect begin_path move_to line_to arc stroke fill font text_align
  text_baseline fill_text measure save restore translate rotate dash gradient_stroke`; the one
  implementation is `CanvasSurface` in the recorder's page), `Measured` (`header`, `columns`; bodyless
  statics `of(id)` / `save(where, id, what, names, columns, extra)` fulfilled by the host: the bootstrap's
  `hosted` map reads `visuals/<id>` and `data/<id>` off disk, the generated package reads
  `globalThis.__measured` which `npx ray visuals`/`npx ray measure` fill), `Recording` (`stamp names
  sizes`, `start`, `frame(into)`), `Played` (`Cached` off a film whose stamp and rows match, `Live` runs
  the world in order), `Painter` (`start`, `frame(s, dt)`, `warm(budget)`), `Still`, `Picture`
  (`played`, `painter`, `Picture.still(...)`), `Fmt` (`log10 finite fixed exponential min max hypot
  median` - numbers as text, since there is no toFixed).
- **Panel.ray** is the gravity panel once: `Setup` (VIEW MARGIN A K PIX GAP bodies TICKS RUN BURN tags
  stamp colours, Programs `place(setup) view(t) spent(bodies) ring(k)`), `Body`, `FieldRecording`
  (channels `one two gone [who] marks`, TICKS ticks a frame off `theory.field(...)`), `FieldPainter`,
  `Panel.paint` (the two-column drawing, log shading, mixed colours, body rings) and `Panel.of(setup)`.
  G.ray declares `gravity.rain`, `gravity.pull` (`G.pair`) and `solar.inner` (`G.solar`, off
  `data/solar-inner`) with the old RAIN.ts/SOLAR.ts numbers and stamps.
- **Galaxies.ray** is the old ALL.ts panel (`galaxy.point`, `galaxy.many`: SPARC cloud and sample,
  Tully-Fisher lines, Genzel discs, Newton, the deep limit, the law, the region by rank and by which
  freedom a cell needs) drawn from `Measured.of("galaxy.point"|"galaxy.many")`; **Sparc.ray** reads the
  catalogues (`RAR FLAT BTFR DISCS`, `disc_arrival`, constants); **Law.ray** interpolates the measured
  law in the logarithm (`Law.boost`, `Law.a0`, `Law.theory`).
- **Model.ray** is the seam between the closed rules and numbers: `Model(theory)` closes the theory once
  (`store`), `fact(name)`, `at(expr, env)` (names nobody bound looked up in the store, `l.choose(x)`
  read as `x`, then `Expr.numeric`), `settled(DEG)`, `a0_lattice`, `boost(gN, a0)` (fails loudly on a
  NaN, naming what is unbound), `delivered_by`, `as_point_parts`, `as_stars_parts`, `speed`.
  `Measure.density(model, id, how)` integrates the possibility space (700×520 grid, five sweeps, one
  bit per necessary freedom in `by`), `Measure.law(model)` writes the curve with the rules' constants;
  `Measure.run(theory, only)` is what `npx ray measure` calls on the generated TypeScript (it is
  millions of evaluations - not for the bootstrap; about an hour per density).
- The recorder (`implementation/ray/bootstrap/visuals.ts`) is host tooling like the old
  RENDER.ts/RECORD.ts: esbuild bundles `visuals/visuals.ts`, Chrome is driven over CDP; a film's
  recording is refreshed only when its stamp or row count no longer match (`--record` forces it).
  The generated TypeScript runs a 169² box at 96 directions in about 4 s a tick, so a 150-frame pair
  film records in ~25 min and `solar.inner` (900 ticks, 181²) in over an hour.

Gotchas met writing these (all confirmed the hard way):
- More hole names than the list above: any class member named `each`, `sum`, `a`, `b`, `f`, `k`, `z`,
  `one`, `body`, `draw`, `of`, `number`, `sep`, `first`, `last`, `push`, `pop`, `join`, `contains`,
  `chars`, `lines`, `filter`, `map`, `range`, `filled` collides with an emitter rule (`this.each` came
  out as `each_of(this)`, `this.sum` as `sum(this)`). And `read`/`write` are the emitted Node's own
  slot accessors: a method named `read` recursed forever.
- Postfix `if` works on any statement (`x = v if p`); there is NO postfix `unless` - write `if !(p)`.
  There is no `.ceil`: `0 - (0 - v).floor`. `x.slice` does not exist: `x.drop(a).take(n)`.
- A zero-argument call of a Program-typed FIELD (`p.place()`) is emitted as a property read, not a
  call: give such a program a parameter (`place(setup)`). Zero-argument methods are getters
  everywhere (`r.start`, `s.stroke`).
- Inside a theory's own methods the theory is `this`, not its name (`G` in the emitted TypeScript is
  the class, not the instance): `Setup(theory: this, ...)`.
- `Array.range(n).for((i) => { ... })` is emitted as a counted `for` loop (no index array); every other
  `xs.for` spreads its list first. `elem` and `Node.read` in the TypeScript runtime take the common
  case first - that alone halved a field tick.

### Tests

`tests/` is generated: for every `dynamically assert` on a refinement (`World{ticks == 4} += { ... }`)
and every fixture (a definition in `theories/G/tests/*.ray` whose value is a World), one test per
language (`tests/ts/G.test.ts` with `node:test`, `tests/py/test_G.py` with `unittest`), which builds
the fixture, ticks it until the refinement holds, and checks the requirement. `npx ray test` runs the
same cases in the bootstrap. Requirements are written against the implicit world (`rays > 0`,
`this.N`); the emitter reads them as `it.rays`.

Running: `npx ray gen`, `npm test` (bootstrap + node:test + unittest discover), `npm run test:gpu`
(Deno WebGPU + every Python GPU backend), `npx ray visuals`, `npx ray data`. Fixtures of a kind the
packages do not carry (a `Term`, a `Proof`, a `Piece`) run in the bootstrap only; a fixture that cannot
be ticked is skipped where its refinement does not hold.

## 6. Workflow rules for the assistant

1. Read this file first. Use only constructs listed here.
2. For any new function/abstraction/syntax: ask (concrete options, a recommendation), then record
   the answer here **before** using it.
3. Keep `G.ray` faithful to the model: c̄ = one step a tick; rules read as written.
4. Never edit generated folders by hand; change `.ray` and rerun `npx ray gen`.

### Examples

`implementation/examples/hydrogen.ray/` is a project that depends on the physics package and fills
in the definable choices: `Source += { choose "emit?" (exit: N): boolean => true; choose "mass" (): Real => ... }`,
plus a fixture and requirements under its `tests/`. Run it with `npx ray test implementation/examples/hydrogen.ray`.

## 7. Still to confirm (ask before use)

- `data "..."` declaration form (phase 4).
- Generators for weighted / icosahedral geometries (`Geometry.shells` covers the cubic family).
- GPU backends: only for the continuous model (phase 2).
- Typed TypeScript output: the generated `physics.ts` carries `// @ts-nocheck`; the generated tests
  are what check it.
- Form of the continuous reading (phase 2) and theorem bodies (phase 3).
