import { Backend } from "../../lib/Backend.ts";
import { GEOMETRIES, Geometry } from "../../lib/Local.ts";
import {
  Embedding, embedding, propel, radiate, Source, SourceSpec,
} from "../../lib/Source.ts";
import { method, Theory } from "../../lib/Theory.ts";
import { along, at, facing, gate, over } from "../../lib/Rules.ts";
import {
  a, and, b, bump, carriedBy, douse, each, either, exits, facingIt, fold, handOver, it,
  let_, light, lit, neutral as isNeutral, not, owned, point, seq, settle, some, stands,
  steps, tally, unfold,
  waitForRoom, when, world,
} from "../../lib/Language.ts";
import { Graph } from "../../backends/CPU.graph.ts";


/**
 * THE CONDITIONS THE RULES OF `G` FIRE UNDER — each written ONCE, as an expression, where the
 * thing that DECIDES whether the rule fires is the same value the equation READS.
 *
 * A gate used to be two things in two places: a predicate in a rule's body, and a factor in
 * whatever prose described that rule's continuous term. Nothing tied them. Change `busy(l)` and
 * the `(1-rho)` written under it stays where it is, still saying what the rule no longer does.
 */

/**
 * A NEUTRAL POINT — nothing passing through it, and nothing there.
 *
 * (G/2) fires at a point BECAUSE THE POINT IS NEUTRAL and asks nothing else, so below the
 * scale where one point matters it is a flat rate against the room left — which is where the
 * vacuum's own fixed point comes from: creation gated on `1-rho` against a loss quadratic in
 * it, meeting at a density this theory HAS rather than one it was given.
 *
 * IT WAS TWO CONDITIONS. `busy` asked only whether a ray was passing through, so the rule
 * needed a second gate saying the point was not matter — and that second gate IS the gravity
 * mechanism, sitting in a rule where it could be left out. It is an invariant of what neutral
 * MEANS rather than a test a rule performs, so it says so there instead: see `busy` in
 * `Local.ts`.
 */
const neutral = gate({
  test: isNeutral(point),
  reads: { as: "room", factor: "(1-\\rho)" },
});

/**
 * A POINT SOMETHING OUTSIDE THE MODEL PUT THERE — which is what makes a rule Sigma.
 *
 * Not a condition on the medium: a condition on whether the medium is what is being talked
 * about at all. A rewrite gated on this fires only where `world.add` laid a body down, so it
 * is a statement about what was put in rather than about what the vacuum does — and the
 * reading takes it out of the rules and writes it as the source term.
 */
const owns = gate({
  column: "source",
  test: owned(point),
  reads: { as: "outside" },
});

/**
 * BOTH ENDS CARRYING — what makes the meeting term a power of the density rather than a rate
 * against bare space.
 *
 * A meeting needs a ray AND something facing it, so this reads as `held` on a quantifier that
 * hands over two ends: the term is quadratic, and a ray with nothing facing it is not
 * destroyed however long it flies. The degree is not written down — it is counted off the pair.
 */
const met = gate({
  column: "active",
  test: and(lit(carriedBy(a)), lit(carriedBy(b))),
  reads: { as: "held" },
});

export const G = new Theory()
  .called("G")
  /*
   * THE CHANNELS, AS DECORATIONS. In the article these are parallel arrays allocated
   * per theory; here a per-ray quantity is a property, which is the same thing said in
   * this vocabulary — and a theory that does not declare one cannot read it by mistake.
   *
   * EVERY ONE OF THEM IS DECLARED WITH A DEFAULT, INCLUDING THE ABSENT ONES. The
   * backend builds its columns off what a freshly constructed ray SAYS it has, so a
   * decoration that returns `{}` for a field gets no column — and the field is then an
   * own property written onto the flyweight, which is per-index and is NOT reset when
   * that index is freed and handed to the next ray. Declaring it is what puts it in a
   * column and what makes `create` clear it.
   */
  .decorate.Ray<{
    active: boolean
    arriving: boolean
    bounced: boolean
  }>(self => ({
    active: false,
    arriving: false,
    bounced: false,
  }))

  /**
   * WHICH SOURCE IT CAME FROM, OR −1 FOR THE VACUUM'S OWN — and it travels with the ray.
   *
   * A BODY CANNOT PUSH ITSELF, and without this it does. A source of more than one cell
   * emits at every cell it owns and absorbs at every cell too, so it is permanently
   * radiating into itself. At rest that is invisible: the exits come in ± pairs, it eats
   * as much one way as the other, and the ledger cancels exactly. ONCE IT MOVES the
   * cancellation breaks — it takes in the cells ahead, which hold its own forward rays,
   * and abandons the cells behind, which hold its backward ones. Measured in the
   * article: momentum climbed by a constant every tick, +3 for a body of 5 cells, +7 for
   * 13, +11 for 29, in proportion to its own size, in a box with nothing else in it.
   *
   * The rays are real and still happen; what is wrong is the accounting. So a body is
   * TRANSPARENT TO ITS OWN UNTOUCHED RADIATION, and the moment a ray is deflected it
   * stops being the body's own — that is a real interaction with something else, and it
   * is exactly the channel repulsion arrives on.
   */
  .carries("from", -1)

  /**
   * WHAT HAS BEEN DESTROYED AT A LOCAL, AND HOW MANY POINTS THIS ONE NOW STANDS FOR.
   *
   * These two are the ledger gravity is read off, and they are the only two a rule of `G`
   * touches. `destroyed` is credited half to each end of the edge a meeting happened on —
   * the deficit, counted where it is made rather than inferred afterwards — and `density`
   * is what `Rewrite.fold` and `Rewrite.unfold` move between points as space is destroyed
   * and handed back.
   */
  .decorate.Local<{
    destroyed: number
    density: number
  }>(self => ({
    destroyed: 0,
    density: 1,
  }))

  /**
   * WHAT A WORLD OF `G` IS: A TILING, A BOX AND A SEED — and nothing else.
   *
   * These four are the configuration a RESULT is about. A number measured on fcc-12 is a
   * number about fcc-12, and a run is only comparable with another run of the same box and
   * the same stream, so they are arguments rather than constants. Everything else that used
   * to stand here was a SWITCH — which meeting to resolve, what a fold leaves behind,
   * whether a collapse sends itself out, where the split may not fire — and a switch is a
   * choice between theories wearing the clothes of one. `G` has no choices in it: every
   * rule below does one thing, and a variant of it is a theory of its own built with
   * `rule`, `without` and `decorate`, which is what those builders are for.
   */
  .decorate.World<{
    geometry: Geometry
    N: number
    seed: number
    bound: number
  }>(self => ({
    geometry: GEOMETRIES["fcc-12"],
    N: 1,
    seed: 0,
    bound: () => self.N ** self.geometry.D,
  }))

  /** the source that owns this point, or null for the vacuum's own space */
  .decorate.Local<{
    source: Source | null
  }>(self => ({ source: null }))

  .decorate.World<{
    backend: Backend
  }>(self => {
    let laid: Backend;
    return {
      backend: () => laid ??= self.geometry.seed(new Graph(self.theory, self.seed, self.bound, self.geometry.DEG * 2), self.N),
    };
  })

  .decorate.World<{
    sources: Source[]
    embedding: Embedding
    add(spec: SourceSpec): Source
  }>(self => {
    const sources: Source[] = [];
    let laid: Embedding | undefined, at = -1;
    return {
      sources,
      /*
       * REBUILT WHEN THE WORLD HAS CHANGED SIZE, and not otherwise. Held for ever it goes
       * stale the moment a point is made: an expanding world's frontier is exactly the
       * points that are not in it, so every shell reading past the seeded box came back
       * empty — which reads as a frontier that makes nothing rather than as a stale map.
       */
      embedding: () => {
        const n = self.backend.size();
        if (!laid || at !== n) { laid = embedding(self.backend.sample()); at = n; }
        return laid;
      },
      add: method((spec: SourceSpec): Source => {
        const D = self.geometry.D;
        const s: Source = {
          id: sources.length, emits: 1, absorbs: true, moves: false,
          duty: 1, dwellTicks: 1, period: 1, phase: 0, u: [], turning: 0,
          emission: "isotropic", propulsion: "none", bias: 1, conserve: false,
          locals: [], caught: new Array(self.geometry.DEG).fill(0), arrivals: 0,
          momentum: new Array(D).fill(0),
          owed: 0, upkeepTicks: 0, moved: 0, origin: spec.at.slice(),
          ...spec,
        };
        sources.push(s);
        /* a slab where half-extents were given, a ball otherwise — two slabs meet face
         * on, which is what a collision figure is actually about */
        const cells = spec.half
          ? self.embedding.box(spec.at, spec.half)
          : self.embedding.within(spec.at, spec.radius ?? 0);
        for (const l of cells) {
          (l as any).source = s;
          s.locals.push(l);
        }
        return s;
      }),
    };
  })

  /**
   * (EMIT) SOURCES ABSORB WHAT ARRIVED AND WRITE THEIR OWN CHARGE ONTO THE SPACE AROUND
   * THEM — and what leaves is decided by four things the article gives a source: which
   * exits fire (`emission`), which half of it they are in (`axis`), whether it is
   * aiming (`propulsion`), and whether it may make rays or only pass them on
   * (`conserve`). None of those is a knob added here; leaving any of them out makes a
   * different source, and a panel or a claim that asks for one and silently gets the
   * isotropic ball is measuring something nobody asked about.
   */
  .rule("EMISSION", at.point.of(owns).does(radiate))

  /**
   * (G/2) A NEUTRAL POINT EXPANDS INTO TWO POINTS, unconditionally — every neutral
   * point, every tick. Nothing is thinned; what removes a ray is the meeting on the
   * edge. A point carrying an active ray is not neutral, so it does not split.
   */
  .rule("CREATION", at.point.of(neutral).called("\\nu").does(
    seq(
      /* the point is handed back a point of space, and every exit it has is lit - which is
       * DEG rays, counted off the loop rather than written down anywhere */
      unfold(point),
      each(exits(point), ray => light(ray)),
    ),
  ))

  /**
   * (STREAM) EVERY ACTIVE RAY MOVES ONE STEP ALONG ITS OWN EXIT. c̄ = one step a tick,
   * by definition — and everything the ray carries goes with it, whatever the theory
   * above has decided that is. A ray on a SOURCE's cell streams like any other: that is
   * how what a body emits gets out of it.
   */
  .rule("MOVEMENT", along.ray.called("\\sigma").does(
    when(lit(it),
      /*
       * A RAY ARRIVING INTO SOMETHING COMING THE OTHER WAY IS A MEETING, AND IT IS RESOLVED
       * AS ONE — which is not a setting and never was.
       *
       * WITHOUT IT NOTHING CAN CROSS THIS MEDIUM. (G/2) lights every neutral point, so a ray
       * steps into a pair that was made to meet it and half of those meetings annihilate:
       * measured, one ray lit in a vacuum and at t=1 the world holding it was identical to
       * the world without it. Nothing propagates through that, which is exactly the premise
       * the falloff law needs and could not get.
       *
       * AND IT IS THE SAME EVENT (G/1) IS ABOUT, so it does what (G/1) does. What is fixed
       * here is WHEN the meeting is noticed, not whether space is destroyed by it — and
       * because the two rules do the same thing to the same ledgers, the reading gives one
       * loss term with both of them credited on it rather than counting the loss twice.
       */
      let_(steps(it), to =>
        either(some(to),
          let_(facingIt(it), back =>
            let_(stands(it), here =>
              let_(stands(to), there =>
                seq(
                  when(and(some(there), not(owned(there)), lit(back), not(owned(here))),
                    douse(it),
                    douse(back),
                    tally(it, "annihilations"),
                    bump(here, "destroyed", 0.5),
                    bump(there, "destroyed", 0.5),
                    fold(here, there),
                    /*
                     * AND THE COLLAPSE SENDS ITSELF OUT. Two points became one and the space
                     * between them is gone; the point left over is the only thing there to
                     * carry that, so it goes out along every exit it has — which is what
                     * (G/2) does at a neutral point, read from the other end. Measured,
                     * without it a structure of 2,265 points came apart into 14 while the
                     * vacuum stripped it; with it the largest grew 4,264 to 6,323.
                     */
                    each(exits(here), ray => light(ray)),
                  ),
                  /* and what is still lit goes on, carrying whatever it carries */
                  when(lit(it), handOver(it, to)),
                )))),
          /* nowhere to step: on an expanding world it makes the room and waits a tick */
          waitForRoom(it))))))

  /**
   * (ARRIVE) WHAT WAS ARRIVING IS NOW WHAT IS HERE, and nothing is arriving any more.
   *
   * The same sentence about every ray in the world, so it is quantified over the WORLD:
   * a store that keeps its rays in columns exchanges two of them and clears one, which is
   * the article's own "swapped, not copied", and one that cannot is asked ray by ray and
   * gets the same answer more slowly.
   *
   * A ray that received nothing goes out, and it goes out carrying nothing — its waiting
   * slot is empty because only MOVEMENT writes one, and only where it also said the ray
   * was arriving.
   */
  .rule("ARRIVAL", over.world.of("Ray",
    "every ray at once - which is what lets a store keeping them in columns exchange two " +
    "of them instead of being asked ray by ray").does(settle(world)))

  /**
   * (G/1) TWO RAYS THAT MEET ON THE EDGE BETWEEN TWO POINTS ANNIHILATE, LEAVING A
   * SINGLE NEUTRAL SPATIAL POINT BEHIND — which is what makes (G/1) the inverse of the
   * split rather than merely its opposite, and which is why GRAVITY IS SPACE BEING
   * DESTROYED rather than a counter of events standing in for one.
   */
  .rule("ANNIHILATION", facing.pair.of(met).called("\\sigma").does(
    let_(carriedBy(a), x =>
      let_(carriedBy(b), y =>
        let_(stands(x), here =>
          let_(stands(y), there =>
            seq(
              douse(x),
              douse(y),
              tally(x, "annihilations"),
              /* credited HALF TO EACH END of the edge the event happened on, which is what a
               * force is read off: the deficit belongs to the edge, not to either point */
              bump(here, "destroyed", 0.5),
              bump(there, "destroyed", 0.5),
              fold(here, there),
            ))))),
  ))

  /**
   * (MOVE) A STRUCTURE CARRIES THE MOMENTUM THE VACUUM GIVES IT, and crosses a cell
   * when it has enough — the first thing in this model that moves a STRUCTURE rather
   * than a ray.
   *
   * Nothing in the three rules does this. A ray moves because streaming moves it; a
   * structure is a region and a region has no heading, so if matter goes anywhere it is
   * because of what the vacuum does to it. That force is MEASURED rather than assumed:
   * what arrived, less what was thrown away. Transmitting costs nothing, so a perfect
   * transmitter is already moving; emitting is what it costs to be massive.
   *
   * ONE CELL AT A TIME, because that is the only distance there is. Momentum short of a
   * whole cell is kept rather than rounded away, so a slow thing moves rarely rather
   * than never — a duty cycle arrived at from the dynamics instead of imposed.
   *
   * IT IS A RULE OF THE WORLD AND NOT OF A POINT. A body is every local it owns at
   * once: it reads one force, decides once, and the cells go together or not at all.
   */
  .rule("TRANSPORT", over.sources.does(propel));
