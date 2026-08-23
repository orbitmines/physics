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
what the other was doing \`R/c\` ticks ago. A moving source's shells leave from ahead and
behind and arrive compressed and stretched. The clock comes from the budget rule - one
action a tick, spent moving or walking your own graph - and because a ray always moves at
exactly one cell a tick those are two **directions of a fixed rate**, not two shares of an
amount, so they add in quadrature and the clock runs at \`sqrt(1-b^2)\`. The Lorentz factor,
out of the budget rather than beside it.

**One law, with nothing left standing in it:**

\`\`\`
                    F_g . (1 + b.cos t)
F^rel   =   ---------------------------------
              (1 - b^2)^((m_r - m_s + 2)/2)
\`\`\`

No gamma anywhere - it is written out. Every symbol is a physical fact:

- **b** is the speed, as a fraction of one cell a tick.
- **cos t** is the angle between the source's motion and the line between the two bodies,
  so \`b.cos t\` is the LINE-OF-SIGHT speed. The first order depends on the radial velocity
  and the rest on the total one, which is the shape relativistic Doppler has.
- **m_r** is 1 when the answer is counted in the receiver's own ticks, **m_s** is 1 when
  the source is the one moving and so pulsing less often. Two facts about the setup, not
  free numbers - and not the same kind of thing as each other: the receiver's is a
  *denominator* conversion (fewer of its ticks pass while the same momentum lands) and the
  source's a *numerator* reduction (a slowed source emits less, so less arrives).

It reproduces every case exactly:

| | cos t | m_r | m_s | comes to |
|---|---|---|---|---|
| receiver moves | 0 | 0 | 0 | gamma^2 |
| receiver moves, own clock | 0 | 1 | 0 | gamma^3 |
| source moves, transverse | 0 | 0 | 1 | gamma |
| approaching head-on | +1 | 0 | 1 | the Doppler factor |
| receding head-on | -1 | 0 | 1 | its reciprocal |

and every angle between, which separate cases could not express at all.

**The asymmetry is first order and the isotropic part second**, which is why knowing the
direction is worth so much: at b = 0.1 head-on approach sits ten per cent above transverse
against a second-order correction of one per cent. A gravitational force that differs
between approach and recession at first order is something neither a Newtonian nor a
metric theory has.

**cos t is geometry, not knowledge** - a correction to how this was first written. Setting
it to zero is TRANSVERSE motion, not an average over unknown directions: averaging
1/(1 - b.cos t) over a sphere gives 1.0034 at b = 0.1 while the transverse case gives
1.0101. Different numbers.

#### where the Lorentz factor comes from

Not from the budget rule, which is what the first version of this claimed. "One action a
tick, spent moving or ticking" is a SPLIT, and a split is linear: spend a fraction b of
your ticks moving and you have 1 - b left. That gives clock = 1 - b, which is not the
Lorentz factor, and calling the two "components of a fixed rate" did not make it so.

It comes from ray geometry, and it is derived:

\`\`\`
|step|^2 = 1                      every exit of this lattice is the same length - PROBED
|along|^2 = b^2                   a bound ray must keep pace or be left behind
|across|^2 = |step|^2 - |along|^2  Pythagoras, on ONE vector of fixed magnitude
clock = sqrt(1 - b^2)
\`\`\`

That is the light-clock argument in the model's own terms - the diagonal path, not a
budget. **And it is lattice-dependent, which is the test.** Uniform exits: fcc-12,
cubic-6, bcc-8, square-4. Not uniform: cubic-18 and cubic-26, whose exits are 1, sqrt(2)
and sqrt(3). On those the probe REFUSES - no fixed step magnitude, no Pythagoras - and the
law stays in unsimplified branch form. The Lorentz factor is not universal here; it
belongs to tilings whose steps are all one length.

### the metric - \`gravity.spacetime\`

The lean and the stretch are two readings of **one** count, and put together they are
inverses:

\`\`\`
A = 1 - 2u      B = 1 + 2u      A.B = 1 - 4u^2 = 1
\`\`\`

\`A.B = 1\` is what Schwarzschild has in isotropic form, and it is not put in - it follows
from both being readings of one count, so what the count does to the ways *through* a
point it does inversely to the ways *round* it.

**Checked by integration, against observation, not by inspection.** The counted metric and
Schwarzschild go through the same stepper, at Mercury's own eccentricity and out where the
planets actually are:

| test | counted metric | against |
|---|---|---|
| **Mercury's perihelion** | **43.00"/century** | observed **42.98 +/- 0.04** |
| ratio to general relativity | 6.0028 sixths | six is GR's own; worst radius off by 5e-3 |
| light at the solar limb | 1.7512" | observed ~1.75" |
| bending vs GR | 1.0003, falling as b grows | converging on 1 |
| Newton, same stepper | 9e-4 | the integrator's own noise |

This used to be measured at r0 = 60 to 240 with a hard kick - deep field, wildly eccentric
- and got 6.07 sixths with the three orbits scattered by 0.11. That is agreement to two per
cent reported as though it settled something, and it is the wrong place to ask: the
perihelion advance is a WEAK-field statement and Mercury sits four hundred thousand M from
the Sun, not sixty. Run out where the planets are, the two metrics agree to four parts in
ten thousand - and it is cheaper, because an orbit that closes sooner needs fewer steps.

**Rotation curves survive too**: dense gives v ~ R^-0.5 (Keplerian), thin gives v ~ R^0
(flat), matching the article's transport law in both regimes.

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

## and what nobody asked for

\`npm run discover\` runs every probe in the catalogue into ONE store instead of the handful
a theorem named, closes it under these same rules, and reads off everything the closure
reached. No goal is named before saturation, so nothing that comes out of it can have been
aimed at - which is the same guarantee the theorems above make, with the last line removed.

The output is \`discovered/\`. Every statement there is graded, and the grade is a gate
rather than a label:

- **derived** - every leaf of the proof is a premise a probe stood behind, with numbers
  under it. Only these may claim to recover or contradict a known law.
- **conjectured** - somewhere underneath is a definition, a line that is true because of
  what a word was chosen to mean. The match is still computed and phrased as what it WOULD
  be, because knowing which experiment would earn it is the whole point.
- **assumed** - no run anywhere underneath.

That gate is there because of what happened without it. The sweep reported that the
assembled vacuum force recovered Newton's law exactly - on four definitions, no runs, and
an alias table that read a body's boundary as its mass. \`coupling\` then built the same body
at four duty cycles and counted: sixty ways across its boundary at every one of them. A
boundary is fixed by a body's radius and has nothing to do with how often it pulses, so
that match was the alias table talking to itself. The reading is kept, marked **refuted**,
with the measurement beside it.

Seven probes serve no theorem and exist only for that sweep. \`tables\` enumerates every
rule's whole outcome table; \`currents\` profiles every ledger the world keeps against
distance; \`sweep\` varies two bodies' separation and masses. Three more exist to retire
assumptions rather than to find anything: \`coupling\` measures what mass does to the medium,
\`additivity\` takes each mechanism out of the theory in turn, and \`potential\` asks whether
the force really is the gradient of the deficit. They emit facts keyed identically to the
definitions they replace, and premises are added before definitions - so a successful
measurement takes the slot and the definition is never added. Measure what an assumption
asserts and it stops being one, without anybody editing the theorem that wrote it.

What they have found so far is mostly negative, and the negatives are the useful part.
\`additivity\` reports that in G the two mechanisms are not two contributions at all: with
CREATION removed the meetings' channel reads exactly nothing, because the medium IS what
the vacuum makes, and with ANNIHILATION removed the vacuum's channel reads exactly nothing,
because unchecked creation fills the box uniformly and a uniform filling has no imbalance
across anything. Each is a precondition for the other rather than a term beside it, so
\`F_g = F_meet + F_vac\` cannot be established by ablation however good the instrument gets.

The page also carries what is still being taken on trust - every definition turned round
and stated as an experiment, ordered by how much is waiting on it - and a coverage table
saying whether the sweep refound each of the theorems above. It refinds all of them.

## the vocabulary, and what it now reaches

\`Fact.ts\` began as a counting argument's vocabulary and has been widened to hold the
article's continuous laws: exponentials for screening, vectors and cross products for
Biot-Savart and the Lorentz force, gradients and divergences and curls so that "a potential
whose gradient is the force" is a step rather than an assertion, and tensor components and
stationarity so that a metric component and a least-action principle can at least be
stated.

Every rule over the new kinds is gated on a fact kind no existing theorem states. That is
deliberate: the theorems above are a fixed point whose pages are regenerated byte for byte,
and a rule that could fire on a plain scaling would put new nodes into their stores and
could change which form each proof ends on. Nothing new can fire until something states a
gradient, a cross product or an exponential.

## where it still stops

\`gravity.constant\` gives G as a ratio of counts; reading it in kilograms needs hbar and c
in SI and the Planck mass - none of which is a count. \`met.integral\`'s own summary carries
one unopened symbol; the law that uses it is fully substituted. The relativistic results are exact closed forms
rather than series, so nothing there is stated to an order at all.

What \`gravity.joining\` does NOT settle: whether the retarded route could be extended to
carry the stretch as well. It would have to become a statement about something other than
arrival times, at which point it is a metric - so the honest reading is that the two are
one physics described twice, and the metric is the description that says all of it.
`;
