/**
 * THE INFERENCE RULES — five of them, and not one mentions gravity.
 *
 * This is the part that has to stay honest. A rule here may say nothing about vacuums,
 * absorbers, shadows or forces; it may only say what follows from a quantity being
 * conserved, being spread evenly, being the product of others, or being made of
 * something with a law of its own. The physics is entirely in WHICH facts the probes
 * come back with, and the falloff rate is entirely in what the geometry's own shells do
 * — which is measured, not assumed.
 *
 * SO THE SAME FIVE RULES PROVE THE OTHER THEOREMS. Nothing below is specialised to the
 * inverse square: the transport law wants the same dilution rule with a carrier speed
 * multiplied in, which is `multiplying` and `expansion` on a premise set with one more
 * fact in it. If a theorem needs a sixth rule, the sixth rule must be as free of
 * physics as these are, or it is the conclusion smuggled in as machinery.
 *
 * THE SHELL IS THE ONE NAMED QUANTITY. `spreading` divides by `shell`, and that is not
 * a physics assumption but the geometry's: a lattice has a set of sites at each
 * distance and that set has a size. What that size DOES with r is probed (see
 * `probes/geometry.ts`) and is the whole of where D−1 enters this folder.
 */
import {
  base, eshow, expo, ezero, radd, rat, rmul, rnum, rshow, sdiv, skey, smul, spow, sshow,
  substitute, ONE, Scaling,
} from "./Algebra.ts";
import { Fact, key as idOf } from "./Fact.ts";
import {
  add as xadd, asMonomial as asMono, asNumber, asNumber as asNum, Expr, key as ekey,
  mul as xmul, pow as xpow, show as xshow, sub as xsub, substitute as esub,
  sym as xsym, toFirstOrder as first, ZERO,
} from "./Expr.ts";
import { Emitted, Rule, Store } from "./Kernel.ts";

/** the room a thing spreading outwards has at distance r — the geometry's own quantity */
export const SHELL = "shell";
/** the discrete radius — how many steps from the centre, written r̄ */
export const RBAR = "\\bar{r}";
/** everything inside that radius, which is what the shell is the growth of */
export const BALL = "ball";
/** distance, and the room a region of space has — the two the volume rule is about */
export const RADIUS = RBAR;
export const ROOM = "room";
/** the leading coefficient Ehrhart gives — the step-polytope's own volume */
/**
 * HOW MUCH ROOM ONE STEP COVERS - the volume of the polytope the exits span, which is the
 * leading coefficient Ehrhart gives the ball.
 *
 * NAMED RATHER THAN LETTERED, after two goes at a letter that both failed the same way.
 * It was β, until `gravity.relativistic` arrived carrying the speed as a fraction of a
 * cell a tick - which is β everywhere in physics. Moved to ν, it was worse: ν and v are
 * the same glyph in most faces, so a lattice constant was sitting in a force law full of
 * velocities looking exactly like one.
 *
 * It is one of the tiling's own counts, like DEG and SHEET, and those are words. So this
 * is a word - and being in `COUNTS` it sets upright and coloured, which says what sort of
 * thing it is before anybody reads the glossary. On fcc-12 it is 10/3: the volume of the
 * cuboctahedron the twelve neighbours span.
 */
export const BETA = "STEP";

/** what a quantity's per-site share is called once it has been spread over the shell */
export const spread = (q: string) => `n[${q}]`;

const scales = (of: string, by: Scaling): Fact => ({ kind: "scales", of, by });
/**
 * WHAT IS CONSERVED AND SHARED ALIKE IS DILUTED BY EXACTLY THE ROOM IT IS SHARED OVER.
 *
 * This is the whole argument, and it is four words of counting. If as much crosses a
 * far shell as a near one, the total at every radius is the same total; if every site
 * on the shell gets the same share, one site's share is that total over the number of
 * sites. Neither half mentions distance. Distance arrives only when somebody says how
 * many sites a shell has — and that is a fact about the lattice, which is measured.
 *
 * BOTH PREMISES ARE LOAD-BEARING AND BOTH ARE PROBED. Drop conservation and the total
 * at radius r is not the total at radius 2r, so there is nothing to divide; drop
 * isotropy and the share of one site is not the total over the count.
 */
const spreading: Rule = {
  name: "spreading",
  because: "what is conserved on its way out, and goes every way alike, is shared " +
    "between exactly the sites there are to share it between",
  fire: (s: Store) => {
    const out: Emitted[] = [];
    for (const c of s.all("conserved")) {
      if (!s.all("isotropic").some(i => i.of === c.of)) continue;
      /* A QUANTITY WITH NO LAW OF ITS OWN STANDS FOR ITSELF. Not every premise is a
       * proportionality — a probe may report only that a thing is conserved and even —
       * and such a thing is still its own measure. Requiring a law first would make the
       * rules silent about exactly the quantities the theory takes as primitive. */
      for (const law of s.laws(c.of).length ? s.laws(c.of) : [base(c.of)]) {
        const by = sdiv(law, base(SHELL));
        out.push({
          fact: scales(spread(c.of), by),
          from: [idOf({ kind: "conserved", of: c.of }),
            idOf({ kind: "isotropic", of: c.of }), idOf(scales(c.of, law))],
          because: "conserved and even, so one site's share is the whole of it over " +
            "the number of sites there are at that distance",
          line: `${spread(c.of)} ∝ ${sshow(by)}`,
        });
      }
    }
    return out;
  },
};

/**
 * A BASE REPLACED BY WHAT IT IS MADE OF — the step where the falloff rate appears.
 *
 * The line above `spreading` has no r in it. It says a share is a total over a shell,
 * and both of those are quantities rather than distances. Then the shell is replaced by
 * what the lattice says a shell is, and an exponent in r is suddenly standing in a line
 * that did not have one. That is the moment the theorem is recovered, and it is a
 * substitution rather than an assertion.
 */
const expansion: Rule = {
  name: "expansion",
  because: "a quantity standing in a law can be replaced by whatever it was itself " +
    "shown to be",
  fire: (s: Store) => {
    const out: Emitted[] = [];
    const fixed = new Set(s.all("constant").map(c => c.of));
    for (const f of s.all("scales"))
      for (const b of Object.keys(f.by)) {
        if (b === f.of || !s.known(b)) continue;
        /* a constant has nothing it can be expanded INTO - see the `constant` fact */
        if (fixed.has(b)) continue;
        for (const inner of s.laws(b)) {
          /* a definition that leads back to the thing being defined is not an
           * expansion, it is a loop — and saturation would run it for ever */
          if (inner[f.of] || Object.keys(inner).includes(b)) continue;
          /* a base standing under an exponent that has a count in it cannot be
           * expanded and stay linear; `substitute` refuses, and so does this */
          let by: Scaling;
          try { by = substitute(f.by, b, inner); } catch { continue; }
          /*
           * A SUBSTITUTION THAT BRINGS THE SUBJECT BACK IS NOT A SIMPLIFICATION.
           *
           * The transport premises are genuinely circular as definitions - the density
           * depends on the speed, the speed on the hand-off, the hand-off on a partner,
           * and whether a partner is there on the density. Expanding round that loop
           * produces a longer law for n with n still in it, then a longer one again, for
           * ever; the saturation guard caught it as "the rules are still producing facts
           * after 24 passes". Which is correct: unrolling a loop is not progress. The
           * loop is resolved in one step by `balancing`, which collects the exponent the
           * subject carries and divides through - so expansion simply declines to walk
           * it.
           */
          if (by[f.of]) continue;
          out.push({
            fact: scales(f.of, by),
            from: [idOf(f), idOf(scales(b, inner))],
            because: `${b} is not a primitive of this theory - it is what the line ` +
              `above shows it to be, so it stands in for itself here`,
            line: `${f.of} ∝ ${sshow(by)}`,
          });
        }
      }
    return out;
  },
};

/** a product of things with laws has the product of their laws — the multiplying rule */
const multiplying: Rule = {
  name: "multiplying",
  because: "a quantity that is one thing times another falls off as both of them do",
  fire: (s: Store) => {
    const out: Emitted[] = [];
    for (const p of s.all("product")) {
      let by: Scaling = ONE;
      const from = [idOf(p)];
      for (const q of p.from) {
        /* as in `spreading`: a factor the theory takes as primitive is its own measure */
        const law = s.laws(q)[0] ?? base(q);
        by = smul(by, law);
        if (s.known(q)) from.push(idOf(scales(q, law)));
      }
      out.push({
        fact: scales(p.of, by), from,
        because: "each factor carries its own dependence and they multiply",
        line: `${p.of} ∝ ${sshow(by)}`,
      });
    }
    return out;
  },
};

/**
 * A PRODUCT OF THINGS THAT ARE THERE IS ITSELF THERE.
 *
 * Which sounds like nothing and is the rule that separates a theory with gravity in it
 * from one without. `G^CONSERVING`'s medium destroys nothing, so an absorber leaves no
 * shortfall behind it, so the shadow probe hands back no `positive` — and this rule
 * never fires, and the force is never shown to be more than a proportionality about a
 * quantity that may be identically zero. The scaling law is still derived there. It is
 * just a law about nothing, and the prover says so rather than reporting the exponent
 * and letting it pass for a result.
 */
const standing: Rule = {
  name: "standing",
  because: "something times something is something",
  fire: (s: Store) => {
    const out: Emitted[] = [];
    const has = (q: string) => s.all("positive").some(p => p.of === q);
    for (const p of s.all("product")) {
      if (has(p.of) || !p.from.every(has)) continue;
      out.push({
        fact: { kind: "positive", of: p.of },
        from: [idOf(p), ...p.from.map(q => idOf({ kind: "positive", of: q }))],
        because: "every factor is greater than zero, so the product is",
      });
    }
    return out;
  },
};

/** sharing something out between finitely many places leaves some at each of them */
const sharing: Rule = {
  name: "sharing",
  because: "a positive amount spread over a finite number of places leaves a positive " +
    "amount at each",
  fire: (s: Store) => {
    const out: Emitted[] = [];
    for (const p of s.all("positive")) {
      if (!s.all("conserved").some(c => c.of === p.of)) continue;
      if (!s.all("isotropic").some(i => i.of === p.of)) continue;
      out.push({
        fact: { kind: "positive", of: spread(p.of) },
        from: [idOf(p), idOf({ kind: "conserved", of: p.of }),
          idOf({ kind: "isotropic", of: p.of })],
        because: "there is some of it and the shell is finite, so there is some of it " +
          "at each site of the shell",
      });
    }
    return out;
  },
};

/**
 * HOW MANY SITES ARE WITHIN r̄ STEPS — a polynomial of degree D, exactly, by Ehrhart.
 *
 * THE RADIUS IS A COUNT OF STEPS AND NOT A DISTANCE. Everything in this model moves by
 * taking exits, so the natural radius is r̄ — how many hops from the centre — and that
 * is what makes this exact rather than asymptotic. The set of sites reachable in r̄ steps
 * is exactly the r̄-fold dilate of the set reachable in one: take one step r̄ times and
 * you are somewhere in r̄·P, where P is the convex hull of the exits, and every site of
 * r̄·P is reachable that way. So the ball is a DILATED POLYTOPE, not an approximated
 * sphere, and no boundary is being cut.
 *
 * AND THEN IT IS EHRHART'S THEOREM. The number of lattice points in the r̄-fold dilate of
 * a lattice polytope is a polynomial in r̄ of degree exactly D, whose leading coefficient
 * is the polytope's volume. That is a theorem about lattices, proved once and for all,
 * and it holds for every r̄ — not in a limit, not over a fitted range, not in a box.
 *
 * WHY THIS REPLACED A FIT. The first version of this folder MEASURED the exponent: a
 * log-log fit of site counts against Euclidean distance in a box, which gave 1.906 at
 * N = 17, 1.950 at N = 21 and 1.960 at N = 31 — creeping towards 2 and never arriving,
 * because a box has corners and a Euclidean shell near the wall is not a shell. Rounding
 * 1.950 to 2 puts a judgement call exactly where the theorem ought to be. Here the
 * degree is D because Ehrhart says it is D, and the counting is used to CHECK that
 * — exactly, by finite differences on integers — rather than to discover it.
 */
const ehrhart: Rule = {
  name: "Ehrhart's theorem",
  because: "the sites within a given number of steps are the dilate of the sites within " +
    "one step, and the number of lattice points in a dilated lattice polytope is a " +
    "polynomial in the dilation of degree exactly D",
  fire: (s: Store) => {
    const out: Emitted[] = [];
    for (const d of s.all("dilate")) {
      if (d.by !== RBAR) continue;
      const by = smul(base(BETA), base(RBAR, expo(0, { D: 1 })));
      out.push({
        fact: { kind: "scales", of: d.of, by },
        from: [idOf(d)],
        because: `[[ehrhart]]: the number of lattice points in the k-fold dilate of a ` +
          `lattice polytope is a polynomial in k of degree exactly D, whose leading ` +
          `coefficient is the polytope's volume. Here k is ${RBAR} and P is the set of ` +
          `sites one step from the centre, so the ball's count is a polynomial in ` +
          `${RBAR} of degree D and everything below the leading term is dropped by the ` +
          `proportionality`,
        line: `${d.of}(${RBAR}) ∝ ${sshow(by)}`,
        working: [
          `${d.of}(${RBAR}) = |${RBAR}·P ∩ L|`,
          `= β·${RBAR}^{D} + c_{1}·${RBAR}^{D-1} + ... + c_{D}`,
          `∝ β·${RBAR}^{D}`,
        ],
      });
      if (s.all("positive").some(p => p.of === BETA))
        out.push({
          fact: { kind: "positive", of: d.of },
          from: [idOf(d), idOf({ kind: "positive", of: BETA })],
          because: "a polytope with volume holds sites, so the count is not zero",
        });
    }
    return out;
  },
};

/**
 * THE SHELL IS WHAT THE BALL GAINED ON ITS LAST STEP — a subtraction, and the exponent
 * drops by exactly one.
 *
 * WHAT THIS STEP IS, since "by differencing" on its own says nothing. The sites at
 * exactly r̄ steps are the sites within r̄ steps less the sites within r̄−1 steps. That is
 * a definition, not an approximation — every site is in one group or the other. So:
 *
 *     shell(r̄) = ball(r̄) − ball(r̄−1)
 *              = β·r̄^D − β·(r̄−1)^D
 *
 * and expanding (r̄−1)^D by the binomial theorem, the β·r̄^D on the left cancels the
 * β·r̄^D the expansion begins with. What survives is the next term, D·β·r̄^(D−1), and
 * everything after it is smaller still. The D that appears in front came DOWN from the
 * exponent when the two leading terms cancelled; it is not carried by a proportionality,
 * and the exponent left behind is D−1.
 *
 * NO LIMIT IS TAKEN. This is subtraction of two integers, exact at every r̄ including
 * r̄ = 1, which is the difference between this and differentiating. A finite difference
 * of a polynomial of degree D is a polynomial of degree exactly D−1 — that is an
 * identity about polynomials, and it is why the answer does not depend on the lattice
 * being large, or Euclidean, or anything else.
 */
const differencing: Rule = {
  name: "the difference of a dilate",
  because: "the sites at exactly that many steps are those within it less those within " +
    "one fewer, and subtracting a polynomial of degree D from its own shift cancels the " +
    "leading term and leaves one of degree exactly D-1",
  fire: (s: Store) => {
    const out: Emitted[] = [];
    for (const r of s.all("rate")) {
      if (r.in !== RBAR) continue;
      for (const f of s.all("scales")) {
        if (f.of !== r.from) continue;
        const e = f.by[RBAR];
        /* a count that does not grow with r̄ has nothing to gain on its last step */
        if (!e || ezero(e)) continue;
        const by = sdiv(f.by, base(RBAR));
        out.push({
          fact: { kind: "scales", of: r.of, by, error: f.error, limit: f.limit },
          from: [idOf(r), idOf(f)],
          because: `every site is either within ${RBAR}-1 steps or it is not, so the ` +
            `shell is the ball less its own shift by one step. Expanding ` +
            `(${RBAR}-1)^{D} by [[binomial]], the leading β·${RBAR}^{D} cancels against ` +
            `the ball's, and what survives is D·β·${RBAR}^{D-1}. The D came DOWN from ` +
            `the exponent in that cancellation; a proportionality does not carry it, and ` +
            `the exponent left behind is D-1`,
          line: `${r.of}(${RBAR}) ∝ ${sshow(by)}`,
          working: [
            `${r.of}(${RBAR}) = ${f.of}(${RBAR}) - ${f.of}(${RBAR}-1)`,
            `= β·${RBAR}^{D} - β·(${RBAR}-1)^{D}`,
            `= β·${RBAR}^{D} - β·(${RBAR}^{D} - D·${RBAR}^{D-1} + ...)`,
            `= β·D·${RBAR}^{D-1} + ...`,
            `∝ β·${RBAR}^{D-1}`,
          ],
        });
        if (s.all("positive").some(p => p.of === f.of))
          out.push({
            fact: { kind: "positive", of: r.of },
            from: [idOf(r), idOf({ kind: "positive", of: f.of })],
            because: `${f.of} grows with every step, so what it gains on a step is more ` +
              `than nothing`,
          });
      }
    }
    return out;
  },
};

/**
 * WHAT THE MEDIUM CARRIES, IT CARRIES THE WAY IT CARRIES EVERYTHING.
 *
 * The lattice's own evenness is an exact fact about at most twenty-six exit vectors, and
 * it is not by itself a fact about a shortfall in the vacuum. This is the line that
 * connects them, and it is worth stating rather than assuming: a thing that gets from
 * here to there BY TRAVELLING THROUGH the medium inherits the medium's directional
 * preferences, because those preferences are the only thing deciding where it goes next.
 * A thing that acted at a distance would not, which is exactly why `carried` has to be
 * established and cannot be taken as read.
 */
const carrying: Rule = {
  name: "carrying",
  because: "something that gets about by travelling through the medium goes the ways " +
    "the medium goes, and the medium's own evenness is an exact property of its exits",
  fire: (s: Store) => {
    const out: Emitted[] = [];
    for (const c of s.all("carried")) {
      if (!s.all("isotropic").some(i => i.of === c.by)) continue;
      if (s.all("isotropic").some(i => i.of === c.of)) continue;
      out.push({
        fact: { kind: "isotropic", of: c.of },
        from: [idOf(c), idOf({ kind: "isotropic", of: c.by })],
        because: `${c.of} travels through ${c.by}, and ${c.by} prefers no direction - ` +
          `so neither does what it carries`,
        line: `${c.of} goes every way alike`,
      });
    }
    return out;
  },
};

/**
 * A PRODUCT THAT CANNOT CHANGE, SOLVED FOR ONE OF ITS FACTORS - and this is where a
 * flat rotation curve comes from.
 *
 * `spreading` handles the case where the conserved thing is simply shared out. But the
 * quantity that is actually conserved as a medium carries something outward is a FLUX -
 * how much crosses a shell per tick - and that is the room times the density times the
 * speed. Written out, Phi = shell * n * v is constant, and what happens next depends
 * entirely on whether v knows about n.
 *
 * IF IT DOES NOT, the speed is just a constant, n is left standing alone against the
 * shell, and n goes as 1/shell: the ordinary dilution, and Newton. IF IT DOES - if a
 * carrier moves more slowly where there is less of the medium to hand it on to - then n
 * appears TWICE in the same product, the balance goes quadratic, and n falls off as the
 * SQUARE ROOT of the shell instead. At D = 3 that is 1/r̄ rather than 1/r̄², which is a
 * force that falls off slowly enough to hold a galaxy's outskirts up.
 *
 * THE RULE ITSELF KNOWS NONE OF THAT. It collects the exponent the target ends up
 * carrying once every factor has been written in terms of what it is, and divides
 * through by it. One line of algebra, no physics, and the two regimes are the same line
 * evaluated at two different exponents - which is the point, because a model that needed
 * a different mechanism for the flat part would be two models.
 *
 * WHAT IT REFUSES. An exponent with one of the lattice's counts in it cannot be divided
 * through by and leave the linear algebra this folder is - `n^D` solved for n is a D-th
 * root, and the exponents would stop being linear forms. Such a balance is declined
 * rather than approximated.
 */
/**
 * A LAW WITH EVERYTHING WRITTEN OUT AS FAR AS IT GOES.
 *
 * `balancing` has to see the WHOLE exponent its subject carries, and that is only visible
 * once every factor has been reduced to primitives. Left unreduced, the thin regime read
 * `v ∝ handoff` and stopped there - so n appeared once instead of twice, the balance
 * stayed linear, and the answer came out as the dense one wearing a different name. The
 * square root that makes a rotation curve flat is exactly the second appearance of n.
 *
 * Constants are left alone (they have nothing to be expanded into) and so is anything
 * already reduced; the depth cap is a guard against a premise set that defines two things
 * in terms of each other, not a budget.
 */
const reduced = (s: Store, m: Scaling, fixed: Set<string>, depth = 6): Scaling => {
  let out = m;
  for (let i = 0; i < depth; i++) {
    let grew = false;
    for (const b of Object.keys(out)) {
      if (fixed.has(b)) continue;
      const law = s.laws(b)[0];
      if (!law || law[b]) continue;
      let next: Scaling;
      try { next = substitute(out, b, law); } catch { continue; }
      if (skey(next) === skey(out)) continue;
      out = next; grew = true;
    }
    if (!grew) break;
  }
  return out;
};

/** an expression with every symbol that has a law of its own written out - see `reduced` */
const reducedE = (s: Store, e: Expr, fixed: Set<string>, depth = 6): Expr => {
  let out = e;
  for (let i = 0; i < depth; i++) {
    let grew = false;
    for (const b of new Set(out.flatMap(t => Object.keys(t.m)))) {
      if (fixed.has(b)) continue;
      const law = s.all("equals").find(x => x.of === b);
      if (!law || law.to.some(t => t.m[b])) continue;
      let next: Expr;
      try { next = esub(out, b, law.to); } catch { continue; }
      if (ekey(next) === ekey(out)) continue;
      out = next; grew = true;
    }
    if (!grew) break;
  }
  return out;
};

const balancing: Rule = {
  name: "balancing a conserved product",
  because: "a product of powers that cannot change pins each of its factors to the " +
    "others: collect the exponent the one you want carries, and divide through by it",
  fire: (s: Store) => {
    const out: Emitted[] = [];
    for (const c of s.all("conserved")) {
      for (const p of s.all("product")) {
        if (p.of !== c.of) continue;
        /* every factor written in terms of what it is; a factor with no law of its own
         * stands for itself, as everywhere else in these rules */
        const fixed = new Set(s.all("constant").map(x => x.of));
        let M: Scaling = ONE;
        const from = [idOf(c), idOf(p)];
        for (const f of p.from) {
          const law = s.laws(f)[0];
          M = smul(M, law ?? base(f));
          if (law) from.push(idOf(scales(f, law)));
        }
        /* every factor written out as far as it goes - see `reduced` */
        M = reduced(s, M, fixed);
        for (const target of new Set(Object.keys(M))) {
          const e = M[target];
          if (!e || ezero(e)) continue;
          /* the target must come out linear - see the note above */
          if (Object.keys(e.of).length) continue;
          if (s.known(target)) continue;
          /*
           * AND IT MUST BE SOMETHING THAT CAN VARY. Rearranging `shell·n·v = const` for
           * the shell's own coefficient is valid arithmetic and meaningless physics: that
           * coefficient is a property of the tiling and cannot depend on where you are
           * standing. Left unguarded the rule duly produced `β ∝ 1/(r̄^(D-1)·c·n)`.
           */
          if (fixed.has(target)) continue;
          const rest = { ...M };
          delete rest[target];
          const by = spow(rest, rat(-e.k.d, e.k.n));
          out.push({
            fact: { kind: "scales", of: target, by },
            from,
            because: `${p.of} cannot change, and written out it is ${sshow(M)}. ` +
              `${target} carries the exponent ${eshow(e)} there` +
              (rnum(e.k) === 1 ? "" :
                ` - it appears more than once, because the factors are not all ` +
                `independent of it`) +
              `, so holding the product fixed pins ${target} to the rest raised to ` +
              `${eshow(expo(rat(-e.k.d, e.k.n)))}`,
            line: `${target} ∝ ${sshow(by)}`,
            working: [
              `${p.of} = ${p.from.join(" · ")} = constant`,
              `${sshow(M)} = constant`,
              `${target}^{${eshow(e)}} ∝ 1 / (${sshow(rest)})`,
              `${target} ∝ ${sshow(by)}`,
            ],
          });
          /*
           * AND IF THE PRODUCT IS THERE AND EVERYTHING ELSE IN IT IS THERE, SO IS WHAT
           * IS LEFT. A balance that pinned a quantity to the others without saying it
           * was greater than zero would leave the law standing over a possible nothing -
           * which is the difference between the shape of an answer and an answer.
           */
          const has = (q: string) => s.all("positive").some(x => x.of === q);
          if (has(p.of) && Object.keys(rest).every(has) && !has(target))
            out.push({
              fact: { kind: "positive", of: target },
              from: [idOf(c), idOf(p), idOf({ kind: "positive", of: p.of })],
              because: `${p.of} is greater than zero and so is everything else it is ` +
                `made of, so what is left cannot be nothing`,
            });
        }
      }
    }
    return out;
  },
};

/**
 * A RATIO OF TWO COUNTS, WORKED OUT - which is what nearly every constant in this model
 * turns out to be.
 *
 * BIAS is one annihilation's worth of lean against all the ways out that did not take
 * one: LIGHT over DEG, and on cubic-26 that is 1/26. There is no measurement in it and no
 * approximation - both numbers are counts of the tiling, and the answer is a rational
 * that a decimal would only round.
 *
 * THE RULE IS ARITHMETIC AND KNOWS NO PHYSICS, as everything here must be. What makes
 * the result a statement about the lattice is that the two counts came off the lattice.
 */
const dividing: Rule = {
  name: "a ratio of counts",
  because: "a quantity that is one count over another is worked out by dividing them, " +
    "and two exact counts divide to an exact rational",
  fire: (s: Store) => {
    const out: Emitted[] = [];
    for (const q of s.all("quotient")) {
      if (s.all("value").some(v => v.of === q.of)) continue;
      const over = s.all("value").find(v => v.of === q.over);
      const under = s.all("value").find(v => v.of === q.under);
      if (!over || !under || under.equals.n === 0) continue;
      const equals = rat(over.equals.n * under.equals.d, over.equals.d * under.equals.n);
      out.push({
        fact: { kind: "value", of: q.of, equals },
        from: [idOf(q), idOf({ kind: "value", of: q.over, equals: over.equals }),
          idOf({ kind: "value", of: q.under, equals: under.equals })],
        /*
         * THE SYMBOLS STAY IN THE ANSWER. `= 1/12` on its own is a number a reader has to
         * take on trust; `= c̄/DEG = 1/12` says where it came from and survives being read
         * on a different lattice, which is the entire claim this repository makes about
         * its constants. So the line keeps the ratio and appends the value, rather than
         * replacing one with the other.
         */
        because: `${q.over} is ${rshow(over.equals)} and ${q.under} is ` +
          `${rshow(under.equals)}, both counted off the tiling, so the ratio is ` +
          `${rshow(equals)} exactly - and it is worth reading as ${q.over}/${q.under} ` +
          `rather than as the number, because on another lattice it is a different number ` +
          `and the same ratio`,
        /* set as a fraction, so this line and the definition it came from are the same
         * object rather than two spellings of one - see `chained`, which dedupes on it */
        line: `${q.of} = \\frac{${q.over}}{${q.under}} = ${rshow(equals)}`,
        working: [
          `${q.of} = \\frac{${q.over}}{${q.under}}`,
          `= \\frac{${rshow(over.equals)}}{${rshow(under.equals)}}`,
          `= ${rshow(equals)}`,
        ],
      });
    }
    return out;
  },
};

/** something that IS a number is a number greater than zero when the number is */
const beingSomething: Rule = {
  name: "a number that is not zero",
  because: "a quantity known to equal a positive number is a positive quantity",
  fire: (s: Store) => {
    const out: Emitted[] = [];
    for (const v of s.all("value")) {
      if (rnum(v.equals) <= 0) continue;
      if (s.all("positive").some(p => p.of === v.of)) continue;
      out.push({
        fact: { kind: "positive", of: v.of },
        from: [idOf(v)],
        because: `${v.of} is ${rshow(v.equals)}, which is more than nothing`,
      });
    }
    return out;
  },
};

/**
 * ONE EXPRESSION PUT INTO ANOTHER - the workhorse once sums are in play.
 *
 * `expansion` does this for monomials and cannot do it here: replacing n by `1 + x` inside
 * a product is not a product any more. Written out for expressions the same step is a
 * substitution and a multiplying-out, which is what every "and so" in the article's
 * derivations is doing between one line and the next.
 *
 * IT WILL NOT WALK A LOOP, for the reason `expansion` will not: a definition that leads
 * back to what is being defined unrolls for ever and unrolling is not progress.
 */
const rewriting: Rule = {
  name: "substituting",
  because: "a quantity standing in an expression can be replaced by whatever it was " +
    "itself shown to be, and the result multiplied out",
  fire: (s: Store) => {
    const out: Emitted[] = [];
    /*
     * A CONSTANT IS NOT SUBSTITUTED AWAY, for the reason it is not in `expansion` - and
     * here the reason has teeth. c̄ is one cell a tick, so its value in the lattice's own
     * units is 1; substituted, `lean = c̄/DEG` became `1/DEG`, the c̄ vanished, and the
     * assembled law in `gravity.full` came out with a stray c̄ in the denominator that
     * should have cancelled. The number was right and the physics was not. A constant
     * keeps its name.
     */
    const fixed = new Set([
      ...s.all("constant").map(c => c.of),
      /* a named factor is not multiplied out - see the `named` fact */
      ...s.all("named").map(c => c.of),
    ]);
    for (const f of s.all("equals")) {
      for (const b of new Set(f.to.flatMap(t => Object.keys(t.m)))) {
        if (b === f.of || fixed.has(b)) continue;
        const inner = s.all("equals").find(x => x.of === b);
        if (!inner) continue;
        /* a definition that leads back to the subject is a loop, not an expansion */
        if (inner.to.some(t => t.m[f.of]) || inner.to.some(t => t.m[b])) continue;
        let to: Expr;
        try { to = esub(f.to, b, inner.to); } catch { continue; }
        if (ekey(to) === ekey(f.to)) continue;
        out.push({
          fact: { kind: "equals", of: f.of, to },
          from: [idOf(f), idOf(inner)],
          because: `${b} is not a primitive of this theory - it is ${xshow(inner.to)}, ` +
            `so it stands in for itself here and the result is multiplied out`,
          line: `${f.of} = ${xshow(to)}`,
          working: [
            `${f.of} = ${xshow(f.to)}`,
            `${b} = ${xshow(inner.to)}`,
            `${f.of} = ${xshow(to)}`,
          ],
        });
      }
    }
    return out;
  },
};

/**
 * DROPPING WHAT IS TOO SMALL TO KEEP - and saying which order was kept.
 *
 * Every "to first order" in the article is this step. Done by hand it is invisible and a
 * reader has to trust that the dropped terms were the small ones; done as a rule it
 * appears in the derivation with the quantity named, and the line before it is still
 * there to compare against.
 */
const truncating: Rule = {
  name: "to first order",
  because: "a quantity much smaller than one has a square much smaller than itself, so " +
    "beyond the first power it makes no difference worth carrying",
  fire: (s: Store) => {
    const out: Emitted[] = [];
    for (const small of s.all("small"))
      for (const f of s.all("equals")) {
        const order = small.order ?? 1;
        const cut = first(f.to, small.of, order);
        if (ekey(cut) === ekey(f.to)) continue;
        out.push({
          fact: { kind: "equals", of: f.of, to: cut },
          from: [idOf(f), idOf(small)],
          because: `${small.of} is much smaller than one, so powers of it beyond the ` +
            `${order === 1 ? "first" : order === 2 ? "second" : `${order}th`} are ` +
            `smaller still and are dropped. What is kept is everything to ` +
            `${order === 1 ? "first" : order === 2 ? "second" : `${order}th`} order in ` +
            `it - stated rather than assumed, and the line above is what it was before`,
          line: `${f.of} = ${xshow(cut)}`,
          working: [`${f.of} = ${xshow(f.to)}`, `${small.of} << 1`, `${f.of} = ${xshow(cut)}`],
        });
      }
    return out;
  },
};

/**
 * A SUM RAISED TO A POWER THAT IS NOT A WHOLE NUMBER - the binomial series, to first order.
 *
 * `(1 + x)^p = 1 + p·x + ...` whenever x is small. This is the one place the article's
 * derivations reach for a power that repeated multiplication cannot give: the metric's
 * correction is `B^(3/2) - 1`, and three halves is not a number of times you can multiply
 * something by itself.
 *
 * ONLY AROUND ONE, and only to first order, and both restrictions are stated rather than
 * quietly assumed. The series converges around 1 and the derivations only ever want the
 * leading correction, so the rule refuses anything whose constant term is not 1 - which
 * is the case where the expansion would be about a different point and the answer would
 * be wrong rather than merely truncated.
 */
const binomial: Rule = {
  name: "the binomial series",
  because: "a sum close to one, raised to any power, is one plus that power times how " +
    "far it is from one - to first order, which is as far as any of this needs",
  fire: (s: Store) => {
    const out: Emitted[] = [];
    for (const r of s.all("raised")) {
      if (s.all("equals").some(x => x.of === r.of)) continue;
      const b = s.all("equals").find(x => x.of === r.base);
      if (!b) continue;
      /* the constant term must be one, or the series is about somewhere else */
      const konst = b.to.find(t => Object.keys(t.m).length === 0);
      if (!konst || konst.c.n !== konst.c.d) continue;
      const x = xsub(b.to, [konst]);
      /*
       * TO SECOND ORDER WHERE THE PREMISE ASKS FOR IT.
       *
       * (1+x)^p = 1 + p·x + p(p-1)/2·x² + ... , and which of those to keep is not this
       * rule's to decide - it is what the `small` fact says about x. Relativity needs the
       * square: the two retarded branches differ at first order and cancel when averaged,
       * so truncating there concludes that travel time does nothing.
       */
      const xs = new Set(x.flatMap(t => Object.keys(t.m)));
      const order = Math.max(1, ...s.all("small")
        .filter(sm => xs.has(sm.of)).map(sm => sm.order ?? 1));
      let to = xadd([{ c: rat(1), m: {} }], xmul([{ c: r.to, m: {} }], x));
      if (order >= 2) {
        const half = rmul(rmul(r.to, radd(r.to, rat(-1))), rat(1, 2));
        to = xadd(to, xmul([{ c: half, m: {} }], xmul(x, x)));
      }
      out.push({
        fact: { kind: "equals", of: r.of, to },
        from: [idOf(r), idOf(b)],
        because: `${r.base} is ${xshow(b.to)}, which is one plus ${xshow(x)}. Raised to ` +
          `${rshow(r.to)} that is [[binomial]] in ${xshow(x)}, kept to ` +
          `${order >= 2 ? "second" : "first"} order`,
        line: `${r.of} = ${xshow(to)}`,
        working: [
          `${r.base} = 1 + ${xshow(x)}`,
          `${r.of} = (1 + ${xshow(x)})^{${rshow(r.to)}}`,
          `= 1 + ${rshow(r.to)}·${xshow(x)}${order >= 2 ? " + ..." : ""} + ...`,
          `= ${xshow(to)}`,
        ],
      });
    }
    return out;
  },
};

/**
 * A POWER INTEGRATED BETWEEN TWO LIMITS - the one integral these derivations actually need.
 *
 * `∫ x^a dx = x^(a+1)/(a+1)`, evaluated at both ends. That covers `∫ ds/s²` from r out to
 * for ever, which is 1/r and is what tells you how much of a charge's field is left past a
 * radius; it covers a region of a piecewise integrand where the integrand has gone flat;
 * and it covers the mean of a power over a range, which is the same integral divided by
 * the width.
 *
 * WHAT IT REFUSES, AND WHY THE REFUSAL MATTERS. At a = -1 the answer is a logarithm and
 * this algebra has no logarithms in it, so the rule declines rather than producing
 * something shaped like the right answer. An infinite limit is taken only where the power
 * makes it vanish - `∫^∞ ds/s²` converges and `∫^∞ ds/s` does not, and the difference is a
 * physical result rather than an inconvenience. Both refusals leave the fact unproved and
 * visible, which is the behaviour every other rule here has.
 */
const integrating: Rule = {
  name: "integrating a power",
  because: "a power integrated is that power raised by one and divided by the new " +
    "exponent, taken between the limits",
  fire: (s: Store) => {
    const out: Emitted[] = [];
    for (const it of s.all("integral")) {
      if (s.all("equals").some(x => x.of === it.of)) continue;
      const term = s.all("equals").find(x => x.of === it.term);
      if (!term) continue;
      const m = asMono(term.to);
      if (!m) continue;                       /* a sum has to be split before it is done */
      const e = m[it.in];
      const a = e ? (Object.keys(e.of).length ? undefined : rnum(e.k)) : 0;
      if (a === undefined) continue;
      const c = term.to[0].c;
      const rest = { ...m };
      delete rest[it.in];
      /*
       * AT a = -1 THE ANSWER IS A LOGARITHM, and there is one now.
       *
       * This case used to be declined, which was right while nothing needed it and wrong
       * the moment met's middle region did: 1/x integrated between two limits is
       * ln(hi/lo), and that term is exactly the short-range correction to gravity - the
       * piece that dies away as the separation grows and is worth per cent at a few cells
       * and nothing at astronomical distances. Declining it did not make the correction
       * absent from the physics, only from the page.
       *
       * The log is carried as an opaque symbol. Nothing downstream differentiates it or
       * expands it; what matters about it is that it grows slower than any power, which
       * is what makes the bracket it sits in tend to one.
       */
      if (a === -1) {
        const name = `ln(${xshow(it.to)}/${xshow(it.from)})`;
        const to = xmul([{ c, m: rest }], xsym(name));
        out.push({
          fact: { kind: "equals", of: it.of, to },
          from: [idOf(it), idOf(term)],
          because: `${it.term} goes as one over ${it.in}, whose integral is a logarithm ` +
            `- so between ${xshow(it.from)} and ${xshow(it.to)} it is ${name}. It grows ` +
            `more slowly than any power of ${it.in}, which is what matters about it here`,
          line: `${it.of} = ${xshow(to)}`,
          working: [
            `${it.of} = \\int_{${xshow(it.from)}}^{${xshow(it.to)}} \\frac{1}{${it.in}} d${it.in}`,
            `= ${name}`,
          ],
        });
        continue;
      }
      const at = (limit: Expr) => {
        const v = asNum(limit);
        /* an endpoint at infinity contributes nothing only when the power kills it */
        if (v === undefined) return xmul([{ c: rat(1), m: rest }], xpow(limit, a + 1));
        if (!isFinite(rnum(v))) return a + 1 < 0 ? ZERO : undefined as unknown as Expr;
        return xmul([{ c: rat(1), m: rest }], xpow(limit, a + 1));
      };
      let hi: Expr, lo: Expr;
      try { hi = at(it.to); lo = at(it.from); } catch { continue; }
      if (!hi || !lo) continue;
      const to = xmul([{ c: rat(c.n, c.d * (a + 1)) , m: {} }], xsub(hi, lo));
      out.push({
        fact: { kind: "equals", of: it.of, to },
        from: [idOf(it), idOf(term)],
        because: `${it.term} is ${xshow(term.to)}, a power ${a} of ${it.in}. Integrated ` +
          `that is ${it.in}^{${a + 1}}/${a + 1}, taken between ${xshow(it.from)} and ` +
          `${xshow(it.to)}`,
        line: `${it.of} = ${xshow(to)}`,
        working: [
          `${it.of} = \\int_{${xshow(it.from)}}^{${xshow(it.to)}} ${xshow(term.to)} d${it.in}`,
          `= \\frac{${it.in}^{${a + 1}}}{${a + 1}}, at the limits`,
          `= ${xshow(to)}`,
        ],
      });
    }
    return out;
  },
};

/**
 * THE MEAN OF A QUANTITY OVER SOMETHING SPREAD EVENLY - an integral divided by the width.
 *
 * Wanted for one line, and it is a line the article leans on twice: the average of |ψ|/π
 * over a phase that is anybody's guess is exactly one half. That is not a fitted number
 * and not a coincidence - it is what the mean of |ψ| over a uniform phase comes to, and
 * the article's `share` is that half.
 */
const averaging: Rule = {
  name: "averaging over what is uniform",
  because: "the mean of something over a quantity spread evenly is its integral across " +
    "that range, divided by how wide the range is",
  fire: (s: Store) => {
    const out: Emitted[] = [];
    for (const m of s.all("mean")) {
      if (s.all("equals").some(x => x.of === m.of)) continue;
      const whole = s.all("equals").find(x => x.of === `${m.term} over ${m.across}`);
      if (!whole) continue;
      out.push({
        fact: { kind: "equals", of: m.of, to: whole.to },
        from: [idOf(m), idOf(whole)],
        because: `${m.over} is anybody's guess across ${m.across}, so what ${m.term} ` +
          `comes to on average is what it comes to over that whole range - which is ` +
          `${xshow(whole.to)}`,
        line: `${m.of} = ${xshow(whole.to)}`,
      });
    }
    return out;
  },
};

/**
 * ONE EXPRESSION OVER ANOTHER - where the one underneath is a single term.
 *
 * `dividing` handles two counts and gives a rational; this handles two expressions and
 * gives an expression, which is what an average needs: the mean of something over a range
 * is its integral divided by the width of the range, and neither of those is a count.
 *
 * THE DENOMINATOR MUST BE ONE TERM. Dividing by a sum is not a sum, and there is nothing
 * in these derivations that wants it - every division here is by a width, a count or a
 * single symbol.
 */
const overOne: Rule = {
  name: "one over another",
  because: "an expression divided by a single term is that term's reciprocal multiplied " +
    "through",
  fire: (s: Store) => {
    const out: Emitted[] = [];
    for (const q of s.all("quotient")) {
      /*
       * FIRES AGAIN WHEN ITS PARTS HAVE BEEN OPENED FURTHER.
       *
       * This used to stop as soon as the quotient had any expression at all - and the
       * first one it gets is built from whatever its denominator happened to be worth in
       * that pass, which early on is another unopened name. So the near-field correction
       * froze as a ratio against `met_far` before `met_far` was known, and nothing
       * revisited it. A later, more reduced form is a different fact and is kept beside
       * the first; `conclusion` prefers the one with nothing left to open.
       */
      const over = s.all("equals").find(x => x.of === q.over);
      const under = s.all("equals").find(x => x.of === q.under);
      if (!over || !under) continue;
      /*
       * THE REDUCED FORM, for the reason `balancing` and `summing` need one: the first
       * expression a quantity gets is usually written in terms of others, and dividing by
       * it drags those along under a negative power where nothing later opens them. The
       * near-field correction came out as a ratio against `met_far`, then against `core`,
       * and the assembled gravitational law inherited whichever symbol the chain had
       * stopped at.
       */
      const fixedHere = new Set(s.all("constant").map(x => x.of));
      const m = asMono(reducedE(s, under.to, fixedHere));
      if (!m) continue;
      const den = reducedE(s, under.to, fixedHere);
      const c = den[0].c;
      let to: Expr;
      try {
        to = xmul(reducedE(s, over.to, fixedHere),
          [{ c: rat(c.d, c.n), m: spow(m, rat(-1)) }]);
      } catch { continue; }
      out.push({
        fact: { kind: "equals", of: q.of, to },
        from: [idOf(q), idOf(over), idOf(under)],
        because: `${q.over} is ${xshow(over.to)} and ${q.under} is ${xshow(under.to)}, ` +
          `so the one over the other is ${xshow(to)}`,
        line: `${q.of} = ${xshow(to)}`,
        working: [
          `${q.of} = ${q.over} / ${q.under}`,
          `= (${xshow(over.to)}) / (${xshow(under.to)})`,
          `= ${xshow(to)}`,
        ],
      });
    }
    return out;
  },
};

/**
 * A RATIO WRITTEN AS AN EXPRESSION - so a later theorem can substitute it symbolically.
 *
 * `dividing` works two counts out to a rational, which is what `lattice.lean` wants for
 * its own answer. But a theorem that USES the lean wants c̄/DEG rather than 1/12: the
 * number is right and says nothing, while the ratio carries its two counts into the next
 * line where they can cancel against something. Both forms are produced, and each is what
 * some reader of the proof needs.
 */
const asRatio: Rule = {
  name: "as a ratio",
  because: "a quantity defined as one thing over another is that thing times the " +
    "other's reciprocal - which is a form the next line can substitute into",
  fire: (s: Store) => {
    const out: Emitted[] = [];
    for (const q of s.all("quotient")) {
      if (s.all("equals").some(x => x.of === q.of)) continue;
      const to = xmul(xsym(q.over), xsym(q.under, -1));
      out.push({
        fact: { kind: "equals", of: q.of, to },
        from: [idOf(q)],
        because: `${q.of} is ${q.over} over ${q.under}, which written out is ` +
          `${xshow(to)} - kept in the counts rather than worked out, so that whatever ` +
          `uses it can cancel against them`,
        line: `${q.of} = ${xshow(to)}`,
      });
    }
    return out;
  },
};

/** counts multiplied together give a count - the companion to `dividing` */
const timesCounts: Rule = {
  name: "counts multiplied",
  because: "a quantity that is the product of things whose values are known is the " +
    "product of those values",
  fire: (s: Store) => {
    const out: Emitted[] = [];
    for (const p of s.all("product")) {
      if (s.all("value").some(v => v.of === p.of)) continue;
      const each = p.from.map(f => s.all("value").find(v => v.of === f));
      if (!each.every(Boolean)) continue;
      let acc = rat(1);
      for (const v of each) acc = rmul(acc, v!.equals);
      out.push({
        fact: { kind: "value", of: p.of, equals: acc },
        from: [idOf(p), ...p.from.map(f =>
          idOf({ kind: "value", of: f, equals: each.find(v => v!.of === f)!.equals }))],
        because: `${p.from.join(" and ")} are ${each.map(v => rshow(v!.equals)).join(" and ")}, ` +
          `so their product is ${rshow(acc)}`,
        line: `${p.of} = ${p.from.join(" · ")} = ${rshow(acc)}`,
      });
    }
    return out;
  },
};

/**
 * A QUANTITY THAT IS ONE MONOMIAL ALSO OBEYS IT AS A SCALING LAW.
 *
 * THE TWO HALVES OF THIS FOLDER'S ALGEBRA HAD NOTHING JOINING THEM. `equals` carries a
 * sum with its coefficients, `scales` carries a proportionality with them dropped, and
 * every rule works in one or the other - so `vacuum.suppression` could derive that a
 * body's strength IS the expansion it prevented, and `gravity.falloff` went on writing S
 * as an unopened symbol because it was looking for a scaling and had been handed an
 * equality.
 *
 * That is the seam the vacuum's own pull was falling through. Where an expression is a
 * single term there is nothing to lose in dropping to a proportionality, so it drops, and
 * the falloff law can then open S into what the vacuum laws said it was.
 */
const asScaling: Rule = {
  name: "which is also a scaling",
  because: "a quantity equal to a single product of powers scales as that product - the " +
    "coefficient is what a proportionality drops, and there is nothing else to lose",
  fire: (s: Store) => {
    const out: Emitted[] = [];
    for (const f of s.all("equals")) {
      const m = asMono(f.to);
      if (!m || !Object.keys(m).length) continue;
      if (s.laws(f.of).some(l => skey(l) === skey(m))) continue;
      out.push({
        fact: { kind: "scales", of: f.of, by: m },
        from: [idOf(f)],
        because: `${f.of} is ${xshow(f.to)}, which is a single product of powers - so it ` +
          `scales as that, and whatever was written in terms of ${f.of} can be written ` +
          `in terms of what it is made of`,
        line: `${f.of} ∝ ${sshow(m)}`,
      });
    }
    return out;
  },
};

/** a quantity known to BE a number is an expression consisting of that number */
const asExpression: Rule = {
  name: "a number is an expression",
  because: "something that equals a number can stand wherever an expression can",
  fire: (s: Store) => {
    const out: Emitted[] = [];
    for (const v of s.all("value")) {
      if (s.all("equals").some(x => x.of === v.of)) continue;
      out.push({
        fact: { kind: "equals", of: v.of, to: [{ c: v.equals, m: {} }] },
        from: [idOf(v)],
        because: `${v.of} is ${rshow(v.equals)}, so it can stand in an expression as ` +
          `that`,
        line: `${v.of} = ${rshow(v.equals)}`,
      });
    }
    return out;
  },
};

/** an expression that has come out a plain number IS that number */
const evaluating: Rule = {
  name: "which is a number",
  because: "an expression with nothing left in it but arithmetic is the number that " +
    "arithmetic comes to",
  fire: (s: Store) => {
    const out: Emitted[] = [];
    for (const f of s.all("equals")) {
      const v = asNumber(f.to);
      if (!v) continue;
      if (s.all("value").some(x => x.of === f.of)) continue;
      out.push({
        fact: { kind: "value", of: f.of, equals: v },
        from: [idOf(f)],
        because: `${xshow(f.to)} has nothing left in it that varies, so it is ` +
          `${rshow(v)} exactly`,
        line: `${f.of} = ${rshow(v)}`,
      });
    }
    return out;
  },
};

/**
 * ADDING UP A CONTRIBUTION OVER EVERY SHELL - and noticing when the sum runs away.
 *
 * OLBERS' PARADOX IS A STATEMENT ABOUT AN EXPONENT. A shell at distance r̄ holds more
 * matter the further out it is, exactly as fast as what that matter puts on you falls
 * off - so the two cancel, and every shell contributes the same. Add the same number up
 * over unboundedly many shells and there is no total. The whole argument is that the r̄
 * cancelled, which the algebra above does without being told; this rule is only the line
 * that reads the answer off.
 *
 * WHERE THE THRESHOLD IS. Summing r̄^k out to infinity settles on a number only when k is
 * strictly below -1; at -1 it is the harmonic sum and still runs away, however slowly. A
 * term that does not fall off at all - k = 0, which is what a cancelled shell leaves - is
 * about as divergent as it gets, and saying so is the result rather than a failure.
 */
const summing: Rule = {
  name: "summing over every shell",
  because: "a contribution added up over unboundedly many shells settles on a number " +
    "only if it falls off faster than one over the distance",
  fire: (s: Store) => {
    const out: Emitted[] = [];
    for (const sum of s.all("sum")) {
      if (s.all("diverges").some(d => d.of === sum.of)) continue;
      /*
       * THE REDUCED LAW, for the same reason `balancing` needs one: the first law a
       * quantity gets is usually written in terms of other quantities, and the r̄ in it is
       * hiding inside one of them. Read unreduced, `what the shell puts on you` was
       * `matter · share` - no r̄ at all where the rule could see it - and the cancellation
       * this whole theorem is about was invisible.
       */
      const fixed = new Set(s.all("constant").map(c => c.of));
      const first = s.laws(sum.term)[0];
      if (!first) continue;
      const law = reduced(s, first, fixed);
      const e = law[sum.over];
      /* an exponent with a count in it has no sign until the lattice is named, and the
       * threshold is a comparison - so such a term is left alone rather than guessed at */
      const k = e ? (Object.keys(e.of).length ? undefined : rnum(e.k)) : 0;
      if (k === undefined || k < -1) continue;
      out.push({
        fact: { kind: "diverges", of: sum.of, in: sum.over },
        from: [idOf(sum), idOf(scales(sum.term, law))],
        because: `${sum.term} goes as ${sshow(law)}, so in ${sum.over} it falls off as ` +
          `${sum.over}^{${k}}` +
          (k === 0
            ? ` - which is to say it does not fall off at all. Every shell contributes ` +
              `the same, and there is no end of shells`
            : `, and a sum of that settles on a number only below -1`) +
          `. So the total does not converge`,
        line: `${sum.of} → ∞`,
        working: [
          `${sum.of} = \\sum_{${sum.over}}^{∞} ${sum.term}`,
          `${sum.term} ∝ ${sshow(law)}`,
          `\\sum_{${sum.over}}^{∞} ${sum.over}^{${k}} → ∞`,
        ],
      });
    }
    return out;
  },
};

/**
 * THE ORDER MATTERS FOR ONE PAIR OF THEM, and it is worth saying why rather than leaving
 * it to look arbitrary.
 *
 * Saturation repeats until nothing new appears, so in general a rule that fires late
 * simply fires again next pass. `balancing` is the exception: it solves for a quantity
 * and then declines to solve for it twice, because a second law for the same thing is a
 * worse route to it rather than a better one. So it has to see the fully written-out
 * product THE FIRST TIME - which means `multiplying`, which turns a product into a law,
 * has to have run already. Left the other way round the thin regime balanced against
 * `handoff` before `handoff` was known to be `carrier·n`, n appeared once instead of
 * twice, and the answer came out as the dense one under another name.
 */
export const RULES: Rule[] =
  [ehrhart, differencing, carrying, multiplying, spreading, balancing, expansion,
    timesCounts, dividing, overOne, asRatio, asExpression, asScaling, rewriting, binomial, integrating, averaging, truncating, evaluating,
    beingSomething, summing, standing, sharing];
