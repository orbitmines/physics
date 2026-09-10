# theorems

What the rules of `G` come to, derived from the rules themselves.

```
npx ray gen
```

Nothing here is written by hand, and nothing here was measured. `Reading.ray` counts the continuous equation off what each rule's body does; `Prove.ray` reads its premises off that line and closes them under its inference rules; this folder is what came out, one question per folder, with `proof.json` (the record), `README.md` (the answer, then the working) and `index.html` (the same, set).

There is no lattice on these pages: no box, no seed, no number of ticks. What is derived is what the rules say, which they say on every lattice at once - `D` and `DEG` stay symbols for exactly that reason.

| theorem | answer |
|---|---|
| [`vacuum.equation`](vacuum.equation/) | \partial_{t} n + \hat{d} \cdot \nabla_{x} n + \paren{\nabla n_{f}} \cdot \nabla_{\hat{d}} n = - 2 \sigma F n^{2} + \bar{DEG} \nu \paren{1 - \rho^{\bar{DEG}}} - \paren{\Sigma \paren{1 - \beta}} n + \Sigma \paren{\omega \paren{1 - \beta}} |
| [`vacuum.occupancy`](vacuum.occupancy/) | \rho_{\infty} = \text{the } \rho \text{ where } \bar{DEG} \paren{1 - \rho^{\bar{DEG}}} - 2 F \rho^{2} = 0 |
| [`force.range`](force.range/) | \lambda = \frac{1}{\paren{\sigma F \rho}} |
| [`vacuum.facing`](vacuum.facing/) | F = \frac{1}{2} |
| [`lattice.counting`](lattice.counting/) | l.ball\paren{\bar{R}}.count = \bar{R}^{D} |
| [`gravity.falloff`](gravity.falloff/) | \delta \text{ screened} = \frac{\paren{\delta \paren{1 + n_{f}}}}{\paren{r^{\paren{D - 1}}}} |
| [`gravity.reach`](gravity.reach/) | \text{the ambient field} = \infty |
| [`gravity.horizon`](gravity.horizon/) | \text{S at the horizon} = \bar{DEG} \paren{r^{\paren{D - 1}}} |
