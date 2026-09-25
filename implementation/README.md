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
  `β | stepped` and `m_l | emits` (Source: the mass at the local, set `\bar{m}_{l}`), `n_f | folds` (Vertex), `ω | ahead` (Ray), `F | active`
  (Edge: a meeting's share is F times its ends'), `n | rays` (World). A rule's rate is an alias on the
  rule: `rule /2 "Creation" | ν (x: Vertex{neutral}) => ...`. The equation uses the shortest alias.
- **Programs are data.** `program.statements` is a list of `Node`s; a Node has `construct`
  (`if`, `while`, `method` (a call `x.m(args)`: `receiver`, `method`, `arguments`), `call`, `member`,
  `assign`, `define`, `return`, `binary` (`operator`, `left`, `right`), `unary`, `lambda`
  (`parameters`, `body`), `list` (`items`), `name`, `number`, `string`, `index` (`target`, `index`),
  `expression`, ...), its parts by those names, and `source` (its text). `Class.method("name")` is the
  Program of that method (through aliases), `Class.alias("name")` its shortest alias, `Class.members`
  its members. Every level is an abstraction over goto: a reading may follow a method's program down.

- **Reading.ray** derives every rule's term by running its program on a symbolic match (`Symbolic`
  elements, `Term` = Ray source over the symbols `s`, `Doing` = the ledgers moved). Gates it reads as shares:
  a postfix `x = ... if p` is an `assign` node with its own `predicate`, taken at p's share; `folds[d] > 0`
  is the record's activity on one way, `n_f/DEG`; `held` (the points a hub holds, one per fold) has share
  `n_f` and `.last`/`.first` of a list is one of it, there when the list is (`room`); `grow` marks the
  branch `grown`. **Continuum.ray**
  turns the branches into `Equation` (`terms`, `left`, `right`, `as(language)`, `latex`, `space`).
  `Term.at(symbols)` runs a term; `Term.as(LaTeX)` sets it (`gen/languages/LaTeX.ray`). gen writes the
  equation into every package as data: `G.equation = { latex, terms: [{ rule, rate, degree, outside,
  settles, transport, share: (s) => ..., asked, around, rays, space, folds }] }` (`asked` = the rule's own `where` gate,
  `around` = what the branch asked; `share` = their product).
- **Field.ray** integrates the equation on an N×N box as an INTERPRETER of the rules. A way holds a
  COUNT of rays (many, not one); a boolean the rules ask of a way (`active`) reads as its activity,
  min(1, n). The rules fire in the theory's own order, each on the world as the rules before it left it
  (`view` = what opened the tick less what was taken so far) - a point the meetings emptied is neutral
  for the creation that follows, and the folds are what they are by then - except that what a rule
  MAKES (`dN`: created, lit by a source) is the tick's output and no later rule sees it; every meeting of
  one rule reads the world as the rule found it (a snapshot; the kernels' `kA` plane and TAKE pass). A
  term whose rays come from `active = true` (`Doing.sets`, read off the assignment) SETS a way, so it
  gains what it lacked of one ray; a meeting is one match per edge, taking one ray from each end (the
  pairing is exact: the opposite heading at `hop(c, a)`, its mirror beyond the window's edge), each end
  taking its own half of what one match does to the three ledgers; the transport is the rule's own
  draw, gathered (straight on with weight one, across each folded way with the weight it was folded,
  heading kept; `keep = 1/(1+n_f)`), and rays arriving on a way ADD to it. The symbols a share is read
  against come off the theory's aliases at the cell. What follows on an empty box: every point splits
  on one tick and every edge meets on the next (rho 1, 0, 1, 0; n_f 0, DEG/2, 0, DEG/2), and the folds
  the meetings leave stand for the whole of the next tick, when what is out of phase with the beat
  moves through them (97% of it turned across the folds at 96 headings); a body's rays land beside the
  ray the beat made, survive the meeting that takes one pair, and move on every tick - c-bar. THE GRID
  IS NOT THE LATTICE: a step of one c-bar (K cells) lands by area on the four cells around its true
  position (`taps`), for transport and for the ray it faces (its mirror past the window's edge), so
  rays of a heading do not all visit one sub-lattice; and a way a source lights is a way of a POINT,
  the c-bar around the cell one step out - K by K cells lit alike (`light`, `point_of`) - so what a
  hole puts in does not depend on K. NOR ARE THE HEADINGS THE LATTICE'S WAYS: the lattice has DEG ways
  at a point (`theory.field(N, A, K, seed, DEG, tags)`, DEG 8 by default), the line samples them with A
  headings, so a way of the line holds a DENSITY - rays per edge on that heading - and a heading stands
  for DEG/A edges (`Field.edge`): a hole lights each heading at mass/DEG per edge, a sum over a point's
  headings (its folds n_f, what arrived, the space a meeting destroys, what a turn gathers off every
  heading) is DEG times the headings' mean, and a Beam's `along` (the momentum a source rule moves)
  weighs a heading by the edges it stands for. Measured (held body, K 3): 96 and 16 headings agree on
  the body's rays, n_f and rho by radius to a few percent; the far vacuum beats (n_f DEG/2 at the odd
  tick). The Reading's `xs.some(r => p)` over a point's exits is p, not 1 - (1 - p)^DEG: the exits of a
  point are lit as ONE event (CREATE activates every exit together), so one of them being active is the
  share they have in common - `Vertex{neutral}` reads as 1 - rho and the vacuum's beat survives a body's
  faint field (a shortfall in one creation blocks the next by the same fraction, not entirely, as the
  product would). A residual eight-fold star of about 1.27/0.75 by sector remains, the grid's cells as
  the edges a stream meets the vacuum on. A BODY TURNS ON THE SPACE AROUND IT (G.ray `Transport`): each
  way is weighed by the folds of the point across it, one against all of them, laid on the way the body was
  going, and the momentum keeps its size - the ray's draw taken in the mean for a thing of many ways. The
  proxies give a source rule `Cell.folds` at its own cell and at the cells across every heading
  (`Field.folds_at`; the kernels' GATHER pass lays out what stands, the folds there, and the folds at every
  neighbour per body). Measured: a lone body runs straight at K 3; a pair thrown past each other at 4 c-bar
  turn around each other with the momentum's size kept. Even K puts the lit block off-centre (`point_of`
  has no middle cell) and a lone body drifts diagonally: use odd K. A HOP IS ROUNDED AWAY FROM NOUGHT after
  snapping (`Field.whole`): cos and sin land a hair either side of a half (sin 30° is 0.49999999999999994), so
  plain rounding hopped eight of 96 headings a cell further than their opposites, every body felt a wind of
  2.5 a tick along (-1, 1), and a mirrored pair broke its mirror. The line's geometry for the source rules is
  the hops themselves in c-bar (`Field.geometry`), so what a step pays is what it took. A held body now gains
  no momentum and a mirrored pair stays mirrored to the last digit.
- **Aggregate.ray / Medium.ray - THE DERIVED EQUATION, RUN (2026-09-15).** The films and the orbit
  solves no longer run the rules' own microdynamics: they run the CONTINUOUS EQUATION `vacuum.equation`
  derives, read off the prover so an edit to the derivation moves the dynamics. `Prover.chain(store)` builds
  the same steps `Prover.proof` prints, keyed by role (`population space folds one general settled single
  aggregate remembered each known felt record line`; a role the chain no longer produces is absent).
  `Aggregate.of(theory, DEG)` (one closure per theory and lattice, cached) reads them: `rho_inf` (the root
  the closure settles), `nf_inf` (the `settled` step at that density), `fold_weight`, `shell(R)` and
  `reach(R)` (the closure's own `l.shell(R̄)` and `l.reach(R̄)` facts, evaluated, tabled a hundredth of a
  c-bar apart out to FAR 400), `record_at(masses, xs, ys, x, y, except)` (the `record` step's expression
  with its sum run over the bodies - each at its own distance - and every other name bound to the settled
  vacuum; the body's own names are read off the summand BY KIND, not assumed: a name carrying `\bar{m}` is its
  mass, `\bar{R}` its distance, `l.shell…` / `l.reach…` the two counts there, so the sum may be over i, over x
  or over a body at a retarded tick and still binds), `lean_at` (its gradient, central differences a quarter
  c-bar apart), `pull(m, R)` (the gradient of a lone mass's record at R, toward it, positive), `circling(m, R,
  rho)` = sqrt(pull·rho) (NaN where the record falls toward the mass), and the shader pieces `names`,
  `constants`, `bindings`, `wgsl` (Shaded.wgsl of the outside of the record with the sum a name `SUM`, of the
  summand, of the shell and of the reach). A body has a size: no distance reads closer than NEAR 0.5 c-bar.
  **Medium** (`theory.medium(N, A, K, DEG, tags)`) integrates it on a box: one plane of rays per tag above
  the vacuum's own (the settled vacuum is uniform and isotropic, unchanged by streaming or bending, so it is
  not carried); a tick is `field` (the record and its gradient at every cell, off the closed form), STREAM +
  BEND per plane (`carry`: what stood one c-bar back along a heading lands here by area on four cells; a
  heading's content goes to the two nearest headings of where the lean at the local now points it - a shift of
  `(lean_y cos θ − lean_x sin θ)·A/2π` headings, one at most, gathered so nothing is lost), SOURCE (`shine`:
  the body's mass over DEG per way on the K×K cells of its c-bar, alike), PULL (`move`: every moving body's
  momentum grows by the gradient of the record the OTHER bodies leave, times its mass, never past c-bar; it
  moves by momentum over mass, continuously - no step rule). Readings: `arrived(z, c)` (0: the settled
  density times DEG; z ≥ 1: that plane's rays over the point's ways), `record_above(c)`, `crossed(c)` (space destroyed above the vacuum's own: the
  equation's meeting term on the local density less the same on the settled vacuum, `taking` per meeting - the panel's
  right half, drawn frame by frame, not accumulated), `rho`, `state`, `mean`, `blocks`, `holes`, `t`. The
  `Hole` class is the body (mass = mx·ways is the body's `\bar{m}`). Field.ray, Kernels.ray's rule kernels and
  the old agreement tests are untouched and still the interpreter of the RULES; nothing dynamic reads them now.
  **On the device**: `Kernels.medium(d, theory)` (WGSL only, appended to the WebGPU text under its own
  manifest `//! medium MRECORD MCARRY@z MSETTLE@z MSHINE MSWEEP`) evaluates the same expressions
  (Aggregate.wgsl) at every cell - `record_at` loops the bodies with each one's names bound by kind
  (`Aggregate.bindings`) - and streams and bends the planes exactly as `Medium.carry`; `medium(N, A, K, tags,
  theory, DEG)` in `webgpu.runtime.ts` is the runtime (`st`: the planes and one scratch, `P.tags` = planes+1;
  `cel`: rho, record, lean x, lean y, -, blocks, what bends, arrived per tag; `dir`: headings, bodies (x, y,
  mass, plane), the constants `Aggregate.constants` then nf_inf, rho_inf, DEG, NEAR packed four to a vec4, the
  entries a body's shining makes), with the bodies moved on the host by the same `Aggregate.lean_at`. The
  Python GPU runtimes do not carry the medium yet. `record.gpu.ts` prints what the derivation says (the settled
  vacuum, the record step, the line, the pull by radius, each film's launch) and records on the device, falling
  back to the CPU Medium (`RAY_CPU_RECORD=1`). `G.pair` and `G.solar` launch off `Aggregate.circling`, at rest
  where it gives no circle; `gravity.rest` is the two-frame probe. Agreement: `tests/ts/G.webgpu.test.ts` has a
  medium case (`npm run test:gpu`); `theories/G/tests/medium.ray` holds the CPU requirements.
  **THE VACUUM UNDER THE BODIES (2026-09-21).** `Medium.vacuum` (fixture: `.under_vacuum`, runtime `{ vacuum: true }`) puts
  the settled vacuum under what the bodies add: a body's rays meet the vacuum's own (`meet`, one way of DEG), and the
  vacuum's own population is SETTLED at every cell against the bodies' rays (`settle_rho` on the CPU, the `MSETTLE`
  kernel on the device off `mnets` = the rays line's terms, kept on the `VAC` plane, three `st` planes). `fold` holds
  ONLY the record above the vacuum's own (the vacuum's DEG/2 is written and cleared by its own beat, which the medium does
  not run), so `record_above`/`grown` ARE `fold` (they subtracted nf_inf again before, reading nine below nothing), and
  `unfold` clears at the EXCESS's own share, `n_f/DEG·(1 − ρ)·DEG` read at `n_f` = the excess: read at the vacuum's nine it
  wiped a body's whole record every dark tick and nothing ever stood to an even tick. Measured: the standing excess is
  0.1-0.5 of the chain's settled `record` step and at most a thousandth of the vacuum's own where g ~ a_0; CPU and device
  agree to three digits (`medium_agrees_vacuum`, `npm run test:gpu`; the `standing` fixture in `tests/medium.ray`).
  Gotcha: a `.ray` fixture's refinement reads world members as `this.N`, never bare `N`; and every requirement of a
  class runs on EVERY fixture of that class, so refinements must tell the fixtures apart (`this.N == 16`).
  **a_0 AT THE DENSITY CROSSED (2026-09-22).** `Medium.a0_from = 2` (`RAY_A0FROM=2`) reads a_0 as the chain's `a_{0} along
  the path`: `scale_at(avg)` evaluates the step at the vacuum's own share averaged from the nearest body to the place
  (`crossed_at`, 16 taps), scaled so the undisturbed vacuum gives `a0_vacuum` back. On the device: `mscale` (the step as
  WGSL with the density crossed and the settled record `n_f` left free - `n_f` is read off the run's own `xc(0u)`, so the
  kernel is right on every DEG; baked at the theory's DEG it went negative at DEG 26) and `mcrossed` (the VAC plane).
  Parity: `medium_agrees_crossed()` and `(26)` in `npm run test:gpu`, to 2% (single precision in the settled density).
  **THE GALAXY SPACE (record.gpu).** `RAY_SPACE=1` runs the medium: x is what ARRIVES (a twin run without the recursion),
  y what is felt, tracks laid as `Sweep.rasterise` lays them, cells classed by the FEWEST freedoms that reach them (nought
  = the source as it starts, the law's own line), runs continued past the box in closed form. `RAY_SOLVE=1` solves the same
  space in closed form in the medium's own functions on DEG 4 to 40 by halves (72 s) and writes `visuals/<id>.solved`
  (rows: deg, cell, p, by; header `starts`, `degs`, `a0`, `coincidence` = the chain's a_0/cH per DEG, `theory_deg`);
  it agrees with the device's runs at DEG 10, 18 and 26 to about 0.02 dex at the space's top. `Galaxies.of` films it:
  `Sweeping` (a `Painter`, in `Gen.core` - a class not listed there is not emitted) draws one lattice a frame, DEG 40 down
  to 4, then settles on `theory_deg`; the model's side is laid in m/s^2 through a_0/cH x c H_0 (`Galaxies.H0` = 70,
  borrowed). A way's stored count stays capped at one ray (`Medium.shine`); the user reverted lifting it.
- **Kernels.ray** emits the same tick as kernels off the equation's terms, in the theory's rule order
  (`Kernels.tick_of`: `SNAP CLEAR`, then per rule what its terms need - `SWEEP MEET{k} TAKE`, `SWEEP TOTAL
  CREATE{k}`, `TOTAL CARRY TAGCARRY@z`, or `SWEEP GATHER | APPLY` for a rule about a source's end - then
  `SETTLE SNAP SWEEP TOTAL ARRIVED`); the runtimes run the passes as listed and step in at the `|` to run
  the source rules. `gpu(N, A, K, tags, theory)` has the Field's surface: `tick`, `state`, `rho`,
  `folds`, `gone`, `crossed`, `arrived(z)`, `mean`, `add(hole)`, `frame`. Agreement tests are generated per GPU backend
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
  draw, and the source's word: the line is written per local `l` (`∇_l`), a source puts in its mass there,
  `l.\\bar{{m}} = l.choose(m̄_x·l.DEG·<what its rule asked>)`, and "what a body puts out" is `l.m·<what the branch
  found around it>`: `Doing.asked` is the rule's own `where` gate (`(1 - β)` off `spare`), carried INSIDE the
  choice because it is a statement about which exits; `Doing.around` (`ω`, the room ahead) is the medium's
  and stays on the line; `l.choose(x)` is read as `x` where a number is wanted, `l.DEG` = the ways out of a
  point; the equation theorem (`about: ""`) goes on past the line, every step derived off the ledgers and none
  assumed: `the density is the share of ways lit` (n = ρ on a heading: isotropic and dilute, both named),
  `with every factor written in` (the population's, the space's and the record's lines, every settled name
  filled in and cited; the space AT A LOCAL is the points it holds, the world's count read from the hub's side,
  a grown point excluded - `Doing.grown`), `the record is the space held` (∂ₜs − ∂ₜn_f = 0, so s = 1 + n_f),
  `the population's line and the record's added` (the general equation, growth term kept), `the record settled
  against the density` (the folds line at nought solved for n_f - `Expr.split/linear`), `the record written as
  the density` (the single equation in ρ: n_f eliminated by the settled line, ∇n_f by the chain rule -
  `Expr.quotient_d`), `the vacuum settled` (the aggregate: on the right everything but the masses is the
  vacuum's balance, checked to be the one ρ_∞ is the root of, so it is nought there and the answer is the
  conserved line `∂ₜ(ρ + k·n_f) + transport = l.\\bar{{m}}`, k the rays a meeting turns into one fold; the single
  line in ρ is its `also`). Then the line SOLVED (the field of the bodies, four steps): `what a heading carries
  in from behind it` (the streaming operator followed back: ρ_l(t) = ρ_∞ + Σ_R l.reach(R)·m̄_{l_R}(t−R)), `each
  body from its own distance` (the sum collapses to one term per body, retarded: x.R̄ = l.distance(x.l) with x = x_{@t}),
  `ignorant of what came before` (the past infinite and unknown: no transient - but the retardation stays),
  `what a local feels from every body` (the far field, on rays PLUS record, which the vacuum never loses:
  (ρ + 2n_f)_l = ρ_∞ + DEG + Σ x.m̄ / l.shell(x.R̄)), `the mass law is the near field of a body's own cells` (two
  radii: R̄ in the mass law is the body's DEPTH, x.R̄ the distance), `the record every body leaves at a local`
  (far less near: n_{f,l} = DEG/2 + ½ Σ x.m̄ (1/l.shell(x.R̄) − l.reach(x.R̄))), and `one line for every body` - THE
  ANSWER, and the only line under the claim, the sum in it ONCE (the user's rule: no renamed factor; ∂ₜ and ∇
  gathered into one operator on one sum), the body's time bound ONCE in the sum's binder:
  `summed over the locals` (a body is the locals it stands on and l.m̄ is nought elsewhere, so the sum over
  bodies is a sum over EVERY LOCAL l', each read at its own time - a local does not move, so its retarded tick
  t − l.distance(l') is fixed; a moving body is a trail of locals each at a different tick, so mass and speed
  may vary per tick exactly), and `one line for every mass` - THE ANSWER, and the only line under the claim:
  `∂ₜρ_l + d̂·∇_l ρ_l + (∂ₜ + ½(∇_d̂ρ_l)·∇) Σ_{l'} l'_{@t}.m̄ (1/l.shell(l.distance(l')) − l.reach(l.distance(l'))) = l.m̄`
  then written with the FOLLOWING difference `Δ_v f = f_{l+v}(t+1) − f_l(t)` (the material derivative D/Dt with
  the velocity marked; one step along v on the lattice). THE CLAIM (audited 2026-09-16 against every theorem's
  root premises - creation 34, annihilation 33, the making/taking balance 32, the free path 31, emission 28,
  the shell count 28, shadowing 28, movement 23, the turn's kernel 16 - so a theorem needs the MAKING, the
  TAKING, the SOURCE and the TRANSPORT with its turn) is the population's own line with the balance KEPT:
  `Δ_d̂ ρ_l + a·∇S_l = l.balance + l.m̄` - streaming + bending = the vacuum's balance + the mass here, with
  `vacuum.balance`: `l.balance = (ρ_∞ − ρ_l)(ρ_l + ρ_∞ + DEG)` = DEG(1−ρ_l) − ρ_l² factored on its root ρ_∞
  (checked exact symbolically). S = 2n_f now (no −DEG). `vacuum.record`: `Δ_t S_l = (DEG − S_l)(1 − ρ_l) −
  l.balance` (the imbalance with the opposite sign: the conservation of rays plus record), also far from every
  body `S_l = DEG + Σ_{l'} …`. `vacuum.settled`: at ρ_∞ the balance is nought - `Δ_d̂ρ_l + a·∇S_l at ρ_∞ = l.m̄`,
  also `Δ_t S_l at ρ_∞ = (DEG − S_l)(1 − ρ_∞)` - the far field, 'the near-field terms do not matter' made once
  and named. Method names: `settled_record(folds)` is the older step (record as a function of ρ); the settled
  record LINE is `settled_S` - a clash of the two names once made every chain reader hit None.
  The conserved form (rays plus record, making cancelled against taking) hid the balance, so 32 theorems
  could not follow from it; it is now a derived step, not the claim. Three differences kept apart: `Δ_v`
  through the lattice (step + tick), `∇` along a way at one tick, `∂_d̂` across the headings at one local.
  Its names are THEOREMS OF THEIR OWN, answered from the equation's chain by name (`proof` hoists the chain
  once; a theorem whose `about`/`also` matches a chain step's fact is answered by that step - `named`):
  `vacuum.at` (`l'_{@t} = l' \aside{at} @t` - a source read at a particular time; the mark is on the source,
  which tick is a use of it, never `t − distance` as its definition), `vacuum.following` (`Δ_v f`),
  `vacuum.lean` (`a = ½∂_d̂ρ_l`, how the heading is being turned), `vacuum.record` (THE RECORD'S OWN LINE,
  `Δ_t S_l = ρ_l² − (S_l + DEG)(1 − ρ_l)`: written by the meetings, cleared by creation; `also`, far from every
  body: `S_l = Σ_{l'} l'_{@t}.m̄(1/l.shell(l.distance(l')) − l.reach(l.distance(l')))`, = 2n_{f,l} − DEG). The
  site's Continuous Model section (`../orbitmines.com/.../Physics.tsx`) lists the four under `vacuum.equation`.
  THE MODEL IS THE ROOT (2026-09-16, user: 'literally reading off the continuous model'): `Prover.model_step`
  stands `the continuous model = <the line's right side, symbols in>` first in the store, cited to the reading,
  with `line_steps` as its derivation; `closure` then gives every premise with no `upon` the model as its
  `upon` (`st.upon = [model.key]`) except what the line does not carry - `what a body feels` (the body's own
  rule) and steps `via "the lattice"` (`Prover.not_the_lines`). So every theorem's derivation passes through
  the model - rules -> reading -> model -> premises -> theorem - and NO ANSWER MOVED (all 88 pinned before
  and after). `Prover.population_line`/`record_line` cache the filled lines for the chain's readers (other sessions call
  `one_line(rec)` with one argument). `ρ + S` is 'rays plus record'. To fill in: l.m̄ over locals and ticks,
  and S from its own line, or the sum far from every body.
  `l.reach(R̄) = (1 − 1/λ)^R̄` is its own fact (`Inferences.reaching`), used by name inside the mass law's skin
  (`1 − l.reach(R̄)`) and in the near-field steps - never in the far field. Naming: `l.m̄` is the mass AT the
  local only; `x.m̄`, `m̄(R̄)` are variable masses; a body's mass is never expanded on a line (its choice is its
  own line); the local is a subscript, `ρ_l`, never an argument. Premises added for it: `ω = 1` read off `outward` (a folded point is followed to
  its hub; None only across the world's edge; the vacuum is INFINITE - the user's standing setting), and the
  population's line carries each term's ray count as the ledgers do. Algebra for it:
  `Expr.collected` (a sum collected on a bracket its terms share, loose terms absorbed), `Expr.flip` (a sign
  turned inside a bracket), `Expr.reduced` (terms over one denominator, a bracket turned to cancel it),
  `Expr.split/linear/quotient_d`, a guard so nought to a negative power is left standing, `Prover.tidy` (expand, fold, factor) and `Prover.neat` (fold, factor, brackets kept).
  The notation sets a lone `l` back like `l.`, and a body `x` and its `x.` the same way (also before a
  command: `l.\bar{m}`, `x.\bar{R}`); `l` is the local, a length along a path is `s`. NAMING (the user's):
  the local mass is `l.\bar{m}` (the line's own symbol for `m_l`), a body's is `x_{@t}.\bar{m}`: the body x AT ITS OWN TIME `@t` (set in the derived colour, like a function),
  the tick its rays left, which is t less `x_{@t}.\bar{R}`; its distance `x_{@t}.\bar{R}` is from the local now to the
  body then (so it needs no second time mark), its place `x_{@t}.l`; the notation mutes the lone dot between a
  subscripted body and its field; `\bar{m}(\bar{R})`
  stays the mass law with the body's depth as argument - parentheses on m̄ mean a radius, never a time),
  `RULES` (ehrhart, counting, balancing, unbiased, free_path, spreading, screening, summing,
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
  the world in order), `Painter` (`start`, `frame(s, dt)`, `warm(budget)`), `Still`, `Pane` (`name width height
  paints`: a part of a picture painted on its own), `Picture` (`played`, `painter`, `panes` - the parts,
  where a page may lay them out itself; the whole is still `paint` -, `Picture.still(...)`), `Fmt` (`log10 finite fixed exponential min max hypot
  median` - numbers as text, since there is no toFixed).
- **Panel.ray** is the gravity panel once: `Setup` (VIEW MARGIN A K PIX GAP bodies TICKS RUN BURN tags
  stamp colours, Programs `place(setup) view(t) spent(bodies) ring(k)`), `Body`, `FieldRecording`
  (channels `one two gone [who] marks`, TICKS ticks a frame off `theory.field(...)`), `FieldPainter`,
  `Panel.paint` (the two-column drawing, log shading, mixed colours, body rings) and `Panel.of(setup)`.
  G.ray declares `gravity.rain`, `gravity.pull` (`G.pair`) and `solar.inner` (`G.solar`, off
  `data/solar-inner`) with the old RAIN.ts/SOLAR.ts numbers and stamps.
- **Strip.ray** is the old LINES.tsx strip: a rule on a 1-D lattice (`LINE2`), before on the left
  and after on the right, drawn 1-1 - the head ON the node, a faint bar of the same colour behind
  (`Ink.behind`), a solid bar in front, points as plain dots, only the cells a ray is on or heading
  into. `Strip.of(id, what, theory, ids, seeds, ink)`: each seed (a program of the theory returning a
  World: `Strip.meeting`, `Strip.heading(t, sign)` - three points, the ray in the middle -,
  `Strip.left(t, seed, ids)` for what rules left of a seed) is laid, read into a `Lane` (`points`,
  `sides` of `at sign ink`), run through the named rules by their own `matches`/`apply`
  (`Strip.run`), and read again; the picture is a `Picture.still`, with no text in it, and its `panes`
  are the two lanes on their own (`Strip.paint(s, rows, ink, lanes)` draws any lanes in any order). `Ink` holds the
  look: `ray_ink` (a program of the Ray, None = `Ink.NEUTRAL` - gravity has no polarity), `Ink.RED`
  (indianred) and `Ink.BLUE` (the panels' blue) for a theory that has one, and the alphas `behind
  front head dot line`. G declares `rule.annihilation` (/1 on a meeting), `rule.creation` (/2 on what
  /1 left of the meeting) and `rule.movement` (/c then /4 on a lone ray, each way).
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
  **A film's world runs on the GPU**: `record.gpu.ts` under `deno run --unstable-webgpu` drives
  `languages/physics.ts/src/webgpu.ts` and hands each tick's readback to the Ray recording's own
  `begin_frame` / `take(w)` / `finish(into, w)` (Panel.ray), so the readings and channels are one
  copy and only the async ticking is host code. 150 frames of a pair film record in ~10 s,
  `solar.inner` in ~40 s (the CPU field took an hour: ~4 s a tick at 169²×96; `RAY_CPU_RECORD=1`
  falls back to it, as does a missing deno or device). The runtime asks the adapter for its full
  `maxStorageBufferBindingSize`/`maxBufferSize`: solar.inner's 17 planes are 214 MiB, and a binding past
  the default 128 MiB reads as nought without a word (an empty film was the symptom).
- **A body is the theory's own source rules, run.** `Hole` (Field.ray) is a `Source` that makes the two
  choices a source is left (`mass` = m-bar_x × ways, `emit?` = every way; a lit heading carries the hole's
  ways spread over the line's headings, mass/A rays' worth - a heading holds many); everything else a body does
  is G's Emission and Transport rules, applied by `Bodies.radiate` / `Bodies.transport` to proxies of
  the lattice elements the rules are written over - `Cell` (a point: `source`, `vacuum`, `emits(d)`,
  `outward(d)`), `Beam` (a ray: `active`, `along` - so many rays' worth -, `steps`, `activate`,
  `deactivate`) and `Port` (an end: `emits`). The rule's own `where` matches them and its body runs
  unchanged: `deactivate` is the absorption, `activate` lights the neighbour's ray, the momentum is
  the rule's own two lines, a step is S.v's advance and vacuum test. A proxy stands on a backing (`of`)
  offering `geometry, column_of, row_of, hop_from, blocks_at, source_at, was_at, absorb, light`: the
  CPU Field is one, and every GPU runtime builds one from a readback (GATHER lays what stands at each
  body's cell; the entries `absorb`/`light` produce are written and APPLY - by one thread, in order,
  since two entries can land on one place - puts them into the planes; `Bodies.transport` runs after
  the tick and the blocks follow the bodies' cells). A `|` in the manifest's tick is where the host
  steps in. No kernel knows what a body does, and `Field.emit`/`propel`/`mass` are gone.
- **The kernels carry everything the panel reads** (Kernels.ray, every backend): `st` planes n, was,
  dN, fold, taken, absorbed, emitted, then per tag above the vacuum's (`bA(z)`, `beA(z)`) and a scratch
  plane; `cel` slots rho folds space gone keep blocks cross (destruction that is the first body's rays
  against another's, per bin - what `crossed(c)` and the panel's right half are), then (7+z) what
  arrived per tag (0 the vacuum's own). `P` carries `tags`, `z` and `entries`; a manifest entry `NAME@z`
  runs once per tag with `P.z` set. Bodies are tags 1.. (0 is the vacuum): `G.pair` tags its two 1
  and 2 with `tags: 3`. Planes: n, was, dN, fold, taken, absorbed, emitted, taking (this pass's), then
  per tag; `st` is 9 + 2·(tags-1) planes. `tests/ts/G.webgpu.test.ts` checks n, rho, folds, the tagged arrivals, gone,
  crossed and the body's track against the CPU field with two tagged bodies, one moving.
- **The galaxy densities sweep on the GPU too.** `Sweep` (Model.ray) is the plan - axes, the world's
  constants, the per-radius fold record, `rasterise`, `needs`, `save` - shared by the CPU sweep
  (`Measure.density`) and `measure.gpu.ts` (Deno WebGPU). `Shaded.wgsl(expr, names, bound)` writes a
  derived law as WGSL (`e[i]` per symbol, a root's variable as `x`, integer powers as `powi`, the same
  bracketing points and bisection as `Expr.solving` in `Shaded.solver`); `Sweep.kernel` is the whole
  text: PROFILE (a thread per mass×face solving the crowded density at every radius) and TRACK (a
  thread per point: what arrives, what is felt). The driver checks four points against
  `Sweep.landing` on the CPU (must agree within 0.01 dex; it does to 2e-6) and then lets the Ray sweep
  lay the tracks and write the field. 4 s per density against 25+ min on the CPU (`RAY_CPU_MEASURE=1`
  forces the CPU). The laws must be resolved against a FULLY bound probe env (`Sweep.probe`) before
  rendering - resolved without g_N and a_0 bound, F_g expanded them from the store and the device
  disagreed by a dex.
- **The galaxies, run (Simulation.ray, 2026-09-24).** A galaxy is 1.5e-4 of a c-bar, so it is laid in its own units
  (kpc, km/s), not in the medium's box: what ARRIVES at a place is every piece of its mass added (the far field's sum
  over bodies), what is FELT is `Law.boost` at that arrival, keeping the pull's direction (`Model.as_stars_parts`'s
  reading), at the vacuum's a_0 of the lattice (`Galaxies.a0_at`). `Annulus` (a ring, uniform across its width, puffed
  to SPARC's own disc thickness z0 = 0.196 R_d^0.633) is summed element by element; `Simulation(deg)` lays the disc and
  the gas as annuli (edges 0, R_1/2, midway between measured radii, half a spacing past the last) whose masses are SOLVED
  (active-set NNLS, `Simulation.nnls`) so the laid galaxy pulls as SPARC's Vdisk/Vgas do at every measured radius
  (median 0.00%, 90th 0.6%), and the bulge as spherical shells off Vbul. The device (`implementation/ray/bootstrap/galaxy.gpu.ts`,
  run by `npx ray measure galaxy.simulated`, never by a bare measure) runs the WGSL `Simulation` writes: PULL (a thread
  a radius x annulus), LAW (the law's own table read as `Law.boost` reads it), FIT (the data's four freedoms - Y_disk,
  Y_bulge, D, i - on a 17^4 then 9^4 grid, priors as Li et al. 2018: lognormal 0.1 dex on Y, Gaussian at the published
  e_D and e_Inc; D moves every radius and leaves each arrival as it was, i scales the measured speed by sin i/sin i'),
  BEST, and STARS (START/STEP: 1024 tracers a galaxy, 10 km/s HI stir, kick-drift-kick for three turns of the outermost
  radius; past the table the whole galaxy's arrival falls as 1/r^2). The driver checks every kernel against the CPU
  (`Annulus.pull`, `felt`, `logpost`) and prints the sample's miss. It writes `visuals/galaxy.simulated` (every measured
  radius: disc/gas/bulge pulls at Y = 1, v0 at SPARC's freedoms, v1 fitted as the data would see it, vs the tracers,
  kept; per galaxy the fitted freedoms and rms in the header), `galaxy.fields` (the field on a 128-radius table),
  `galaxy.stars` (the filmed galaxies' tracers, `RAY_GALAXIES=a,b` names them), and `galaxy.possible` (every galaxy
  there could be - exponential stellar and gas discs and a Hernquist bulge, scaled from ONE unit disc summed by PULL -
  read by LAW on every lattice of the solved space, binned in the panels' 0.05 dex). `RAY_DEG` picks the lattice.
  Drawn by: `galaxy.curves` (`Galaxies.curve_box`), `galaxy.simulation` (the film, `Orbiting`), the bold "every galaxy,
  run" layer of `galaxy.point`/`galaxy.many` (`Galaxies.possible_at`, in place of the old `typical` line), and
  `galaxy.rar` - a `Picture` with `on_request = true`, rendered only when named (`npx ray visuals galaxy.rar`).
  A FILMED galaxy is its own: `npx ray data sparc-orientation sparc-images` borrows each galaxy's 3.6 um light
  (hips2fits cut-outs: S4G, else Spitzer IRAC1, else unWISE W1; `Catalogue.fits`, a host static like `fetch`, reads the
  FITS) and SIMBAD's position angle; `Simulation.face_on` turns the image face on (SPARC's inclination; the light's own
  long axis where SIMBAD has no angle) and `film_seeds` lays FILM_STARS where the light is (the laid annuli and shells
  where there is no image), filmed for FILM_TURNS of the outermost radius from the moment of the picture.
  **Formed.ray** leaves discs to themselves: every star pulls every other (direct sum in tiles, `ACCEL`), the law read at
  each star on its summed pull, launched smooth at Toomre Q with the law's g/g_N standing in for G. Read at each star
  the law breaks action = reaction, so a disc sets itself moving (~5 km/s a star in 244 Myr; the law-off control,
  `RAY_FORMED_NEWTON=1`, stays put to the last digit) - the user's decision (2026-09-24): run what the model says and
  show it, so the film follows each disc's middle and prints how far and how fast it has gone (`Formed.middles`).
  `RAY_ONLY=formed` runs only the discs, `RAY_FORMED_FRAMES=n` a short look (nothing saved).
  **THE DEVICE IS THE DISPLAY'S TOO**: every dispatch in galaxy.gpu.ts is cut into pieces (kernels start at `P[7]`), one
  submission each, the host rests as long as the device worked after each, and a submission over 250 ms stops the run -
  25 N-body steps in one submission once took the card off the bus and rebooted the machine.
- `Sweep.base_env` binds the vacuum's own body defaults (m-bar_x 1, A 1, R-bar 0, beta 0) before
  solving n_f per radius; without them n_f is NaN at every radius and the sweep lands nothing - which
  is why the OLD galaxy fields on disk had `most: 0` and a blank region.

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
- A method named `force` cannot be called (`force` is a modifier keyword). `union` is reserved in WGSL and
  OpenCL C. `select(if_false, if_true, cond)` is WGSL's and OpenCL C's; GLSL, CUDA, Metal and HLSL get a
  macro of the same shape in their preambles. A kernel applying host entries must run on ONE thread: two entries can
  land on one place and threads adding to it lose updates.
- An expression-bodied method whose body is a loop (`f () => xs.for(...)`) is emitted as `return for`;
  wrap it: `f () => { xs.for(...) }`. A Python lambda captures the enclosing names as defaults, so
  `xs.filter(...).for(rule => ...)` fails with the loop variable unbound - hoist the filter into a
  local first. `Line` is the prover's (a step on a page); the hole's world is `Around`.
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
