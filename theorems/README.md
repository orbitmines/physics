# theorems

Automated proofs about the discrete space, derived from the theories themselves.

Open [`index.html`](index.html) for all of them. The **theory** is a dropdown on each
title - it is what changes which rules ran. Below that the lattice and, where a theorem
has one, the transport regime are switches; genuinely different results get arrows.

```
cd implementations/.ts
npm run theorems              # G, G^XOR, G^XOR*2 over four lattices - about 30s
npm run theorems -- --render  # re-render, no re-proving
```

## the gravitational law, assembled

```
             1        A²       SHEET²·m·m′        SHEET²·c̄·ln(R/c̄)·m·m′
F_g  =  ─────────── ·( ──  + 2 ───────────── )  +  ──────────────────────
          R^(D−1)      β        DEG·c̄^(D−3)              DEG·R^D
                       ↑             ↑                       ↑
                  the vacuum    the meetings      the near-field correction
```

Every factor is proved elsewhere and substituted through; no intermediate symbol is left
to open. What to read in it:

- **The bracket holds the two channels of the pull side by side.** `A²/β` is what the
  **vacuum** contributes; `2·SHEET²·m·m′/(DEG·c̄^(D−3))` is what the **meetings**
  contribute. They share the same 1/R^(D−1) - a Newtonian inverse square at D = 3 - which
  is why they add inside one bracket rather than standing as two laws.
- **The vacuum term scales with the square of the area, and that is derived.** A body's
  cells are not neutral, so the split does not fire on them - but a shortfall deep inside
  is filled by its neighbours before it escapes. What reaches the medium beyond has to
  cross the boundary, so the deficit that gets out is limited by the body's **area**, not
  its volume; and the far body catches it with its own area. Both appear, giving A². A
  bigger surface pulls harder.
- **The meeting term needs both bodies to be emitting** and carries m·m′. An inert
  absorber that emits nothing still has the vacuum term - which is what `gravity.falloff`
  measures, and why its bodies are inert. The two channels are not one thing counted twice.
- **The third term is the near-field correction**, from the middle region of the meeting
  integral. It carries c̄·ln(R/c̄)/R and dies away with range: per cent a few cells apart,
  nothing at astronomical distance.
- **The exponent is the transport regime's.** Dense gives R^(D−1) - Newton at D = 3. Thin
  gives R^((D−1)/2) for the meeting channel - **1/R at D = 3, a flat rotation curve** -
  while the vacuum channel keeps 1/R^(D−1). In thin medium the two stop sharing a bracket
  and are printed apart, which is the physics rather than the formatting.
- **`share` falls out of the theory**: the fraction of meeting states in which the pair
  annihilates, enumerated by `meeting/what-the-halves-do`. **1 under G**, **1/2 under
  G^XOR and G^XOR\*2** - it is the 2 in front of the meeting term. Counted, not stipulated.

## the vacuum, as two laws

- **`vacuum.expansion`** - the split fires on a point because the point is *neutral*, and
  does not ask what the theory's rays carry. Space is made at one point per neutral point
  per tick **in every theory, G included**. What differs is how much survives the meeting:
  the occupancy, 0 under G and 1/2 under G^XOR.
- **`vacuum.suppression`** - a body's cells belong to a source, so the split does not fire
  on them. The space that would have been made is not, and the part that crosses the
  boundary spreads outward. **This is gravity in this model** - not a pull between bodies
  but an expansion that did not happen.

An earlier version set expansion equal to the occupancy, so pure gravity came out not
expanding at all. That was backwards: G expands as hard as anything and then destroys what
it made. If it did not expand there would be nothing for matter to be in the way of.

## the article's sixteen derivations, all of them

| article | here | answer (fcc-12, G) |
|---|---|---|
| `SPACE` | `space.rewrites` | 6 rewrites, listed off the theory |
| `CONSTANTS` | `lattice.lean` | lean = c̄/DEG = 1/12 |
| `TURNS` | `lattice.turn` | CYCLE = 6, a turn lives in min(D,2) |
| `LAW` | `gravity.law` | lean(n) = n·c̄/DEG - linear, no ceiling |
| `METRIC` | `gravity.metric` | δ = 3u |
| `MADE_FROM` | `charge.beyond` | ε = 1/r |
| `MEETINGS` | `meeting.rate` | S ∝ SHEET²·m·m′/(β²·r̄^(2D−2)) |
| `MET` | `met.integral` | the two cores plus the middle's logarithm |
| `REACH` | `gravity.reach` | Φ → ∞ (Olbers) |
| `COHERENT` | `share.coherence` | share = 1 under G, 1/2 under G^XOR |
| `IDENTICAL` | `gravity.identical` | share\* = 1 |
| `CLOCK` | `mass.period` | period = 1/m, m ≤ c̄ |
| `IGNORANCE` | `matter.wavelength` | beat = 2v |
| `RECORD` | `decoherence.rate` | the r's cancel, twice |
| `CEILING` | `gravity.constant` | G = SHEET²/DEG = 3 |
| `FULL` | `gravity.full` | the law above |

Plus seven the article leans on without deriving separately: `lattice.shell-growth`,
`gravity.falloff`, `vacuum.occupancy`, `vacuum.expansion`, `vacuum.suppression`,
`transport.thinning`, `charge.beyond`.

## nothing is fitted

| premise | how |
|---|---|
| the ball is a dilated polytope | finite differences of integer counts - cubic-6 gives 1, 7, 25, 63, … with Δ³ a flat 8 |
| the lattice prefers no direction | the exit set's second moment, over all DEG exits |
| transport conserves what it carries | strip to `MOVEMENT`+`ARRIVAL` and count: 1250, 1250, 1250 … |
| a hand-off needs a partner | read off the rule: `ANNIHILATION` gated on `active` |
| what two halves do when they meet | the rule applied to a facing pair in **every** state it can be in |
| a body's ways across its boundary | walked over the lattice's own links |
| the rewrites a theory has | listed off `Theory.rules` |
| DEG, SHEET, CYCLE, c̄, β | counts of the tiling |

Borrowed and cited: **Ehrhart 1962**, the **binomial theorem**.

## where it still stops

`gravity.constant` gives G as a ratio of counts; reading it in kilograms needs ħ, c in SI
and the Planck mass - none of which is a count - so that step is named rather than
attempted. `met.integral`'s own summary still carries one intermediate symbol (`core`)
inside its bracket; the law that uses it, `gravity.full`, is fully substituted.
