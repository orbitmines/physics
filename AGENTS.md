# AGENTS.md — working in the physics repository

A discrete theory of physics (and the continuous theory derived from it), written in `.ray`.
**Everything is defined in `.ray`; every other file is generated from it.**

## Before you touch anything

- **Read `implementation/README.md` before reading or writing any `.ray` file.** It is the language
  reference for this repository and lists every confirmed construct.
- **Do not invent Ray syntax or semantics.** If a construct you need is not in that README, ask the
  author, then record the answer there.
- **Never edit generated folders by hand:** `languages/`, `tests/`, `visuals/`, `theorems/`, `data/`.
  Change the `.ray` source and regenerate.

## Layout

| path | what |
|---|---|
| `implementation/ray/` | The Ray language: stdlib in `.ray` + a small, temporary TS bootstrap (`bootstrap/`, run as `npx ray`) |
| `implementation/physics.ray/` | Physics core (Theory, Geometry, Source, Simulation, Prove, Catalogue, Galaxies, …) |
| `implementation/physics.ray/theories/G/G.ray` | The gravity theory — the rules everything downstream is derived from |
| `implementation/gen/` | Codegen in `.ray`: `languages/` (per target language), `backends/` (CPU + GPU: CUDA, Metal, Vulkan, WebGPU, …), `rendering/`, `Theorems.ray`, `Tests.ray`, `Release.ray` |
| `implementation/examples/` | Example projects depending on physics.ray |
| `languages/` | Generated packages (TS, Python, C++, C#, Go, Java, Julia, Lean, R, Ruby, Rust, Swift, Wolfram) + `VERSION` |
| `tests/` | Generated suites, one per language, from every `dynamically assert` |
| `theorems/`, `visuals/`, `data/` | Generated, language-independent outputs used by the write-up at orbitmines.com/physics |
| `_todo_/` | Scratch/dev reports — not part of the generated tree |

Projects are folders with a `.project.ray`; scope is directory-derived, there are no imports.

## Commands (from the repo root, after `npm install`)

- `npx ray <file-or-project>` — run Ray
- `npx ray gen` / `npm run gen` — regenerate every output
- `npx ray test [projects...]` — run every requirement on every fixture in the bootstrap
- `npm test` — bootstrap + TypeScript + Python suites; `npm run test:gpu` for WebGPU/GPU suites
- `npx ray visuals [ids...] [--stills] [--record]` — record worlds and render visuals (headless Chrome)
- `npx ray measure [names...]` — run the model on the generated package (galaxy densities, the law)
- `npx ray data [ids...]` — fetch the borrowed catalogues (raw downloads cached in `data/.raw/`, ignored)

Release: `.github/workflows/release.yml` runs on pushes to `main` that change `languages/VERSION`.

## How to do the physics

These are lessons from earlier sessions; they apply regardless of which file holds the code.

- **Ask the rules, never fit.** Every rate is read off a rule; don't re-tune numbers by eye. The
  lattice is not the rule — a lattice/solver result can disagree with the rule itself.
- **The vacuum must produce the field.** Never impose a field or switch off CREATION to make
  something propagate. A body is a region of turning, not one surviving ray.
- **Don't impose the answer in a render.** A picture that seeds the target structure (e.g. Y_lm
  shapes) shows nothing; emergence has to come out of the closed rule loop.
- **Measure, then disbelieve.** Use RMS for signed quantities (means cancel to zero); never measure
  a vacuum in an open box (the absorbing edge grows a bright rim); never normalise `space`.
- **Seeds don't give error bars under G** — it is deterministic across seeds; spend budget on ticks
  or sizes instead.
- **Lattice rendering traps:** fcc-12 is bipartite (two decoupled sublattices with opposite charge)
  — reconstruct from one parity, never interpolate or `Math.round()` across parities. Turning is a
  deficit in the vacuum's churn — draw the hole, not an excess.
- **Theorems:** probe the rules (e.g. isolate transport by removing a rule), don't substitute
  constants away (c̄ = 1 in lattice units silently hides them). Full discovery sweeps are slow
  (~30+ min, saturation-bound).
