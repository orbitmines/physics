# physics

Everything here is defined in `.ray` and generated from it. **Before reading or writing any `.ray`
file, read `implementation/README.md`** — it is the language reference for this repository and lists
every confirmed construct. Do not invent Ray syntax or semantics; ask, then record the answer there.

- `implementation/ray` — Ray stdlib (.ray) + TS bootstrap (`npx ray`)
- `implementation/physics.ray` — physics core + theories
- `implementation/gen` — codegen (.ray); `npx ray gen` regenerates `languages/`, `tests/`, `visuals/`, `theorems/`, `data/`
- Generated folders are never edited by hand.
