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
  base, eshow, expo, ezero, rat, rnum, sdiv, skey, smul, spow, sshow, substitute, ONE,
  Scaling,
} from "./Algebra.ts";
import { Fact, key as idOf } from "./Fact.ts";
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
export const BETA = "β";

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
    standing, sharing];
