/**
 * THE GENERATED FOLDER'S OWN README - kept here because `theorems/` is generated.
 *
 * The honest way to rebuild generated output is to delete it and run again, and doing
 * that ate a hand-written README three times before this file existed. Anything that must
 * survive a rebuild has to be produced BY the rebuild, so the prose lives in the source
 * and is emitted like the pages are.
 */
export const README = `# theorems

Automated proofs about the discrete space, derived from the theories themselves.

Open [\`index.html\`](index.html). The **theory** is a dropdown on each title; below it the
lattice and, where a theorem has one, the transport regime or the clock are switches.

\`\`\`
cd implementations/.ts
npm run theorems              # G, G^XOR, G^XOR*2 over four lattices - about 2.5 minutes
npm run theorems -- --render  # re-render only; a change to the algebra needs a full run
\`\`\`

## the gravitational law

\`\`\`
             1        A'.Aperp     SHEET^2.m.m'       2          c.ln(R/c)
F_g  =  ----------- .( --------  +  ----------- .(  -------  +  --------- ))
          R^(D-1)       STEP           DEG          c^(D-3)         R
                          ^              ^             ^              ^
                     the vacuum    the meetings    Newtonian     near-field
\`\`\`

**How to read the bracket.** Everything outside it is the law; everything inside is a
*fraction of that law*. \`1\` is the Newtonian term, and each thing added to it is a
correction expressed as a **share of the Newtonian one**. So \`(1 + x)\` means "Newton, plus
x of Newton again" - and \`x\` is directly how big the departure is: 0.01 is a per-cent
effect, 1 a doubling. Written as separate terms you would have to divide them yourself to
find that out.

The near-field term carries \`c.ln(R/c)/R\` - the core size over the separation. A few cells
apart that is per cent; at astronomical range, where R is a vast number of lattice steps,
it is nothing. Same law, different scale.

- **Two channels of pull, both derived.** \`A'.Aperp/STEP\` is the **vacuum**: a body's cells
  are not neutral, so the split does not fire on them, and the expansion that did not
  happen spreads outward. The other is the **meetings** between the bodies' own radiation.
  An inert absorber that emits nothing still has the first.
- **The two areas differ, and the asymmetry is derived.** What a body *sends* leaves
  through its whole boundary and spreads isotropically, so its full \`A'\` counts. What a
  body *feels* is an imbalance along the line between them, so only its facing
  cross-section \`Aperp\` takes part.
- **STEP** is how much room one step covers - the volume of the polytope the exits span,
  Ehrhart's leading coefficient. On fcc-12, 10/3.
- **The exponent is the transport regime's.** Dense -> \`R^(D-1)\`, Newton at D = 3. Thin ->
  \`R^((D-1)/2)\`, **1/R at D = 3, a flat rotation curve.**

### with travel time - \`gravity.relativistic\`

Nothing acts at a distance: a shortfall crosses one cell a tick, so what a body feels is
what the other was doing \`R/c\` ticks ago. Two retarded branches, weighted at half each
because you do not know which side you are on; the first order cancels and the square
survives. The clock comes from the budget rule - a structure gets one action a tick and
spends it moving or walking its own graph - and because a ray always moves at exactly one
cell a tick, those are two **directions of a fixed rate**, not two shares of an amount. So
they add in quadrature and the clock runs at \`sqrt(1-b^2)\`: the Lorentz factor, out of the
budget rather than beside it.

**Which clock the force is quoted per is a switch**, because it is a choice and not a
derivation - the receiver's by default, since that is the clock the body's own dynamics
run on.

| perspective | result |
|---|---|
| **receiver** | \`F_g.(1 + 3/2.b^2 + ...)\` ~ gamma^3 |
| lattice | \`F_g.(1 + b^2)\` = gamma^2 |
| source | \`F_g.(1 + 1/2.b^2 - ...)\` ~ gamma |

### the metric - \`gravity.spacetime\`

The lean and the stretch are two readings of **one** count, and put together they are
inverses:

\`\`\`
A = 1 - 2u      B = 1 + 2u      A.B = 1 - 4u^2 = 1
\`\`\`

\`A.B = 1\` is what Schwarzschild has in isotropic form, and it is not put in - it follows
from both being readings of one count, so what the count does to the ways *through* a
point it does inversely to the ways *round* it.

**Checked by integration, not inspection.** The counted metric and Schwarzschild go
through the same stepper:

| test | result |
|---|---|
| perihelion advance | **6.07 sixths** of GR's (6.08, 6.11, 6.01 on three orbits; six is GR's own) |
| light deflection | **1.0006** of GR's, both on GR's own 4M/b |
| Newton, same stepper | closes to 5e-4 - the integrator's noise |

Light's deflection is the harder half: the force law alone gives *none* of it, since a
massless corpuscle feels no force law. So bending is where the second reading of the count
either earns its place or does not, and it does.

### the two routes do not multiply - \`gravity.joining\`

The retarded force and the metric both correct gravity for motion, and the tempting next
step is to multiply one into the other. **It would double count** - and splitting the
metric's own correction says exactly why.

The Hamiltonian's radial force has two pieces, one from the time part \`A\` and one from the
space part \`B\`. Measured separately at r = 10^4 (where the static term is six parts in ten
thousand and does not confuse the reading), on the actual counted metric \`A = e^-2u\`,
\`B = e^+2u\`:

| piece | per beta squared |
|---|---|
| from \`A\` - the time part | **1.00** |
| from \`B\` - the space part | **1.00** |
| together | **2.00** |

The retarded force carries \`A\`'s term - its two branches and its clock are exactly what a
late arrival and a slow clock do - plus a half from whose clock the answer is quoted per.
That is the 3/2. **It has nothing for \`B\`.** Space being stretched where the count is high
is not a statement about when anything arrives, so no amount of care about travel time
will produce it.

\`\`\`
k_metric = k_A + k_B = 2          k_retard = k_A + 1/2 = 3/2
missing  = k_metric - k_retard = 1/2
\`\`\`

**So the gap is not a disagreement, it is a missing term.** The retarded force is the
metric with the space part left out. That is why the two are compared rather than
combined: multiplying them would count \`A\` twice while still never mentioning \`B\`.

## the article's sixteen derivations, all of them

| article | here | answer (fcc-12, G) |
|---|---|---|
| \`SPACE\` | \`space.rewrites\` | 6 rewrites, listed off the theory |
| \`CONSTANTS\` | \`lattice.lean\` | lean = c/DEG = 1/12 |
| \`TURNS\` | \`lattice.turn\` | CYCLE = 6, a turn lives in min(D,2) |
| \`LAW\` | \`gravity.law\` | lean(n) = n.c/DEG - linear, no ceiling |
| \`METRIC\` | \`gravity.metric\` | delta = 3u |
| \`MADE_FROM\` | \`charge.beyond\` | epsilon = 1/r |
| \`MEETINGS\` | \`meeting.rate\` | S ~ SHEET^2.m.m'/(STEP^2.r^(2D-2)) |
| \`MET\` | \`met.integral\` | two cores plus the middle's logarithm |
| \`REACH\` | \`gravity.reach\` | Phi -> infinity (Olbers) |
| \`COHERENT\` | \`share.coherence\` | share = 1 under G, 1/2 under G^XOR |
| \`IDENTICAL\` | \`gravity.identical\` | share* = 1 |
| \`CLOCK\` | \`mass.period\` | period = 1/m, m <= c |
| \`IGNORANCE\` | \`matter.wavelength\` | beat = 2v |
| \`RECORD\` | \`decoherence.rate\` | the r's cancel, twice |
| \`CEILING\` | \`gravity.constant\` | G = SHEET^2/DEG = 3 |
| \`FULL\` | \`gravity.full\` | the law above |

Plus ten the article leans on without deriving separately: \`lattice.shell-growth\`,
\`gravity.falloff\`, \`gravity.relativistic\`, \`gravity.spacetime\`, \`gravity.joining\`,
\`vacuum.occupancy\`, \`vacuum.expansion\`, \`vacuum.suppression\`, \`transport.thinning\`,
\`charge.beyond\`.

## nothing is fitted

| premise | how |
|---|---|
| the ball is a dilated polytope | finite differences of integer counts - cubic-6 gives 1, 7, 25, 63, ... with the third difference a flat 8 |
| the lattice prefers no direction | the exit set's second moment, over all DEG exits |
| transport conserves what it carries | strip to \`MOVEMENT\`+\`ARRIVAL\` and count: 1250, 1250, 1250 ... |
| a shortfall crosses one cell a tick | a front watched never outrunning its own steps |
| a hand-off needs a partner | read off the rule: \`ANNIHILATION\` gated on \`active\` |
| what two halves do when they meet | the rule applied to a facing pair in **every** state it can be in |
| a body's ways across its boundary | walked over the lattice's own links |
| DEG, SHEET, CYCLE, c, STEP | counts of the tiling |

\`Aperp\` is carried by **name**: the facing share of a boundary is a sum of direction
cosines - 1/(3.sqrt(2)) on fcc-12 - and rounding it into this exact-rational algebra would
put something indistinguishable from a fitted parameter in front of the law.

\`orbits/what-the-metric-does\` is the one probe that measures a **consequence** rather than
a rule. Everything else counts something structural and is exact; a perihelion advance is
what a differential equation does over many orbits, and the honest way to know it is to
integrate and look.

Borrowed and cited: **Ehrhart 1962**, the **binomial theorem**.

## where it still stops

\`gravity.constant\` gives G as a ratio of counts; reading it in kilograms needs hbar and c
in SI and the Planck mass - none of which is a count. \`met.integral\`'s own summary carries
one unopened symbol; the law that uses it is fully substituted. The fourth-order terms in
the relativistic results are truncation residue rather than results - the inputs were kept
to second order.

What \`gravity.joining\` does NOT settle: whether the retarded route could be extended to
carry the stretch as well. It would have to become a statement about something other than
arrival times, at which point it is a metric - so the honest reading is that the two are
one physics described twice, and the metric is the description that says all of it.
`;
