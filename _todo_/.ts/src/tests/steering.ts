/**
 * THE LORENTZ FORCE — a charge moving through a field is pushed SIDEWAYS to both, and the
 * two signs of charge are pushed opposite ways.
 *
 * WHAT THE FIELD IS HERE. At a point P there are DEG rays, each carrying a polarity and a
 * direction, and taken together they are a vector: B(P) = Σ polarity · d̂ over the rays
 * that are AT P. Nothing imposes it and no rule maintains it — it is what the point is
 * already holding, summed. A charge passing through P is a ray at the same point, and the
 * two never meet under (G+M/1) or (G+M/3): they are simply CO-LOCATED, which is the whole
 * of the setup.
 *
 * AND THE FORCE IS THE ROTATION THE LATTICE ALREADY HAD. qv×B integrates to "v rotates
 * about B", which is the cyclotron, and `Geometry.turn(d, axis)` is exactly "which exit d
 * becomes, rotated one step about axis". So a charged ray banks |B|/gyro of a turn each
 * tick and takes one ring step whenever it has a whole one saved, in the sense its charge
 * gives. Three things then follow rather than being put in: v ∥ B feels nothing, because
 * `turn` returns d unchanged for an exit parallel to the axis; the two charges curve
 * opposite ways, because the sign of q is the only thing choosing which way round the ring
 * the step goes; and reversing B reverses the curve, because turning about −B is the
 * opposite step.
 *
 * THIS REPLACED A READING THAT COULD NOT DEFLECT AT ALL, and that is why the `axial` row
 * below is run rather than deleted. The first version of this theory read the two
 * boundaries ALONG THE RAY'S OWN AXIS and took their difference — which can only say "keep
 * going" or "turn around", so the force was necessarily parallel to v. It gave no
 * trajectory divergence (0.9σ) and no transverse separation (0.2σ), and it could not have:
 * a force along v does no turning, and an extended field of it cannot exist at all, being
 * the gradient of a bounded ±1 quantity, which averages to nought over any region.
 *
 * WHAT IS MEASURED is the transverse displacement of a beam. A source aimed along +x sits
 * in a uniform field along +z — laid down as what a field IS here, the ±z ray pair aligned
 * at every point — and what is read is the mean y of the beam's own rays. Nothing tells
 * them which way to go in y: the emission has no y preference, so any net y is the field
 * acting on the charge.
 */
import { GEOMETRIES } from "../lib/Local.ts";
import { World, headerOf, judge, Finding } from "../lib/DISCRETE.ts";
import { test } from "../lib/Report.ts";
import { Steering, withSteering } from "../theories/G^XOR+XOR.ts";

/**
 * A UNIFORM B ALONG ±z FOR THE BEAM, laid down as the ±z ray pair aligned at every point —
 * +1 out of +z and −1 out of −z — so Σ polarity·d̂ = 2Bz·ẑ there.
 *
 * A PAIR IS RIGHT HERE AND WOULD BE WRONG FOR A CHARGE FLOWN ALONG THE FIELD, and the two
 * constructions are kept apart deliberately rather than unified into one that is wrong for
 * half its callers. The beam in this test crosses the field at RIGHT ANGLES: it is never
 * co-directional with anything the field holds, so the pair's counter-propagating half is
 * never in its way, and the pair buys twice the field strength for the same rays. See
 * `oneWay` for the case where it does matter.
 *
 * IMPOSED EVERY TICK, which is the honest reading rather than a convenience: a field is
 * maintained by something far away, and left alone this one would be eaten by the vacuum's
 * own meetings and what got measured would be the relaxation instead of the force.
 */
const impose = (w: any, g: any, Bz: number, thin = 1) => {
  const zp = g.exits.findIndex((v: number[]) => v[2] === 1);
  const zm = g.exits.findIndex((v: number[]) => v[2] === -1);
  w.backend.forEachLocal((n: number) => {
    const l: any = w.locals[n];
    if (l.source) return;
    /* THINNED, NOT DIVIDED DOWN — `thin` points share one field ray, so the mean |B| is
     * 1/thin and a charge banks that much of a turn a tick. This is what the `gyro`
     * constant used to do, said as an amount of field rather than a number beside it. */
    const at = w.embedding.at(l);
    if (thin > 1 && at &&
      ((at[0] * 3 + at[1] * 5 + at[2] * 7) % thin + thin) % thin !== 0) return;
    const a = l.rays[zp], b = l.rays[zm];
    /* the field carries POLARITY and no charge: it is what is steered BY, not steered */
    if (a) { a.active = true; a.polarity = Bz; a.charge = undefined; }
    if (b) { b.active = true; b.polarity = -Bz; b.charge = undefined; }
  });
};

/**
 * AND THE SAME FIELD BUILT ONE WAY — every ray pointing +z, nothing on −z, so
 * Σ polarity·d̂ = ẑ and there is NOTHING IN THE FIELD TRAVELLING THE OTHER WAY.
 *
 * WHICH IS THE WHOLE POINT, AND IT IS A CORRECTION. A meeting in this model is two rays
 * facing each other across an edge — head-on only, never two rays going the same way,
 * which is exactly as it should be. But a field built as a ± PAIR holds a
 * counter-propagating ray at every one of its points, so a charge travelling ALONG it runs
 * head-on into the field itself and is annihilated by (G+M/1) before it has gone anywhere.
 * Measured: with the pair, a charge launched along B was destroyed outright; with the field
 * one way it sails through with its transverse coordinates frozen, and the PERPENDICULAR
 * deflection is bit-identical between the two. So the pair was never a statement about the
 * force law — it was a field that happened to be full of oncoming traffic.
 *
 * The slot a charge is riding in is never overwritten: one exit of one point is one ray, so
 * a charge moving along the field shares its slot with the field there, and writing the
 * field over it would erase the thing being followed.
 */
const oneWay = (w: any, g: any) => {
  const zp = g.exits.findIndex((v: number[]) => v[0] === 0 && v[1] === 0 && v[2] === 1);
  const zm = g.exits.findIndex((v: number[]) => v[0] === 0 && v[1] === 0 && v[2] === -1);
  w.backend.forEachLocal((n: number) => {
    const l: any = w.locals[n];
    if (l.source) return;
    const a = l.rays[zp], b = l.rays[zm];
    if (b && !(b.active && b.charge)) b.active = false;
    if (a && !(a.active && a.charge)) { a.active = true; a.polarity = 1; a.charge = undefined; }
  });
};

/**
 * ONE CHARGE, FLOWN — where it ends up, and whether it survived.
 *
 * A SINGLE INJECTED RAY AND NOT A BEAM, which is a correction. An earlier version put a
 * SOURCE at the start line and averaged the position of everything it had emitted. That is
 * not a trajectory: a source emits in pulses, rays are absorbed at the rim, and the mean of
 * a changing population moves for reasons that have nothing to do with the force. It also
 * could not survive a THIN field — see `impose` — because a fan of rays in a patchy field
 * reads mostly as noise, and the claim stopped resolving when the field was thinned.
 *
 * One ray has an exact position every tick and no population to average over, so what is
 * returned is the trajectory itself. It is deterministic given the lattice, which is why
 * nothing here is measured over seeds.
 */
/**
 * THE VACUUM'S OWN CREATION IS OFF FOR THESE FLIGHTS, AND IT HAS TO BE — for a reason of
 * IDENTITY before any reason of physics.
 *
 * (G+M/2) splits every neutral point into ± pairs carrying BOTH signs, so with it running
 * the vacuum is full of charge: measured, 186,319 charged rays on a 41³ box against the
 * one that was injected. "Follow the charged ray" is then not a question with an answer,
 * and the first version of this measurement silently tracked whichever of them the walk
 * reached first — every row came back at the box edge.
 *
 * A ray has no identity of its own here. A SOURCE's rays are stamped with `from`, which is
 * how the beam version of this test told its own radiation apart; an injected excitation
 * has nothing. So the way to follow one is for it to be the only one, which is the
 * ballistic limit and is stated as such: the force law measured with nothing else in the
 * box. The scattering the vacuum adds is real and is what `visuals/steering.magnet` shows;
 * it is not what this claim is about.
 */
const ballistic = (t: any) => (t as any).without("CREATION").called(`${t.name} (ballistic)`);

const flyOne = (o: {
  theory: any; g: any; N: number; T: number;
  q: number; Bz: number; thin: number;
  /** which exit to launch along, as a direction */
  along: [number, number, number];
}) => {
  const { g, N, T } = o, C = (N - 1) / 2;
  const w = new World({ theory: ballistic(o.theory), geometry: g, N, seed: 1,
    boundary: "absorb", slotUniformRng: true });
  const dir = g.exits.findIndex((v: number[]) =>
    v[0] === o.along[0] && v[1] === o.along[1] && v[2] === o.along[2]);
  const lay = () => { if (o.Bz) impose(w, g, o.Bz, o.thin); };
  lay();
  let seat: any;
  for (const l of w.locals) {
    const at = w.embedding.at(l as any);
    if (at && at[0] === C - 12 && at[1] === C && at[2] === C) { seat = l; break; }
  }
  const r = seat.rays[dir];
  r.active = true; r.charge = o.q; r.polarity = 1; r.gyrophase = 0;

  let last: number[] | undefined, alive = 0, stray = 0;
  for (let t = 0; t < T; t++) {
    w.tick();
    lay();
    let at: any;
    for (const l of w.locals) {
      let hit = false;
      for (const ry of (l as any).rays) if (ry.active && ry.charge) { hit = true; break; }
      if (hit) { at = w.embedding.at(l as any); break; }
    }
    if (!at) break;
    alive++; last = at;
    stray = Math.max(stray, Math.hypot(at[0] - C, at[1] - C));
  }
  return {
    y: last ? last[1] - C : NaN,
    z: last ? last[2] - C : NaN,
    stray, alive, w,
  };
};

/**
 * AND ONE CHARGE FLOWN ALONG THE FIELD — the case qv×B says nothing happens in.
 *
 * On a ONE-WAY field, so that the field holds nothing travelling the other way for the
 * charge to run into. What is returned is how far it ever strayed from the line it was
 * launched on, and whether it survived at all: a charge that is destroyed strays nothing
 * and would pass a test that only looked at displacement.
 */
const alongTheField = (theory: any, g: any, N: number, T: number) => {
  const C = (N - 1) / 2;
  const w = new World({ theory: ballistic(theory), geometry: g, N, seed: 1,
    boundary: "absorb", slotUniformRng: true });
  const zp = g.exits.findIndex((v: number[]) => v[0] === 0 && v[1] === 0 && v[2] === 1);
  oneWay(w, g);
  let seat: any;
  for (const l of w.locals) {
    const a = w.embedding.at(l as any);
    if (a && a[0] === C && a[1] === C && a[2] === C - 12) { seat = l; break; }
  }
  const r = seat.rays[zp];
  r.active = true; r.charge = 1; r.polarity = 1; r.gyrophase = 0;

  let stray = 0, alive = 0;
  for (let t = 0; t < T; t++) {
    w.tick();
    oneWay(w, g);
    let at: any;
    for (const l of w.locals) {
      let hit = false;
      for (const ry of (l as any).rays) if (ry.active && ry.charge) { hit = true; break; }
      if (hit) { at = w.embedding.at(l as any); break; }
    }
    if (!at) break;
    alive++;
    stray = Math.max(stray, Math.hypot(at[0] - C, at[1] - C));
  }
  return { stray, alive };
};

export const sidewaysToBoth = test({
  id: "electromagnetism/sideways-to-both",
  claims: "a charge moving through a field is deflected SIDEWAYS to both its motion and " +
    "the field, and the two signs of charge are deflected opposite ways — so the two " +
    "species separate, and which way each goes swaps when the field reverses",
  cited: [
    "G^XOR+XOR — the field at a point is the rays that are there, B = Σ polarity·d̂, and " +
    "a charge passing through turns one ring step about it in the sense of its charge",
  ],
  under: {
    "G^XOR+XOR": "holds",
    "G^XOR": "cannot be asked — a boundary there carries ONE sign, so there is no charge " +
      "to be steered and a source's `charges` is not read by anything",
    "G": "cannot be asked — with no polarity there is no field, and no second sign to be " +
      "the charge",
  },
  run: (ctx, theory) => {
    const { N, T } = ctx.budget({ N: 41, T: 40, seeds: 2, least: 41 });
    const g = GEOMETRIES["cubic-6"];
    /* one point in `THIN` carries the field, so the mean |B| is 2/THIN — see `impose` */
    const THIN = 6;

    const go = (how: Steering, q: number, Bz: number) => flyOne({
      theory: how === "lorentz" ? theory : withSteering(theory, how),
      g, N, T, q, Bz, thin: THIN, along: [1, 0, 0],
    });

    const PP = go("lorentz", +1, +1), PM = go("lorentz", -1, +1);
    const MP = go("lorentz", +1, -1), MM = go("lorentz", -1, -1);
    const OFF = go("lorentz", +1, 0), OFFm = go("lorentz", -1, 0);
    const AX = go("axial", +1, +1), AXm = go("axial", -1, +1);
    const NO = go("none", +1, +1), NOm = go("none", -1, +1);

    const split = PP.y - PM.y, splitR = MP.y - MM.y;
    const noField = Math.abs(OFF.y - OFFm.y);
    const axial = Math.abs(AX.y - AXm.y);
    const none = Math.abs(NO.y - NOm.y);

    /* AND THE CASE THE FORCE LAW SAYS NOTHING HAPPENS IN — launched ALONG the field */
    const along = alongTheField(theory, g, N, T);

    const findings: Finding[] = [
      judge({
        name: "do the two charges deflect to OPPOSITE sides of the line they were launched on",
        value: PP.y * PM.y < 0 ? 1 : 0,
        expect: {
          of: "1 — opposite signs, opposite sides", want: 1, tolerance: 0,
          because: "THE CLAIM. Both are launched along the same exit from the same point, " +
            "so nothing in the launch prefers a side — the only thing the charge does in " +
            "the rule is choose which way round B the ray turns, so the two must land on " +
            "opposite sides or the rule is not doing what it says",
        },
        note: `q+ ended at y = ${PP.y}, q− at y = ${PM.y}`,
      }),
      judge({
        name: "are the two deflections EQUAL and opposite",
        value: Math.abs(PP.y + PM.y) / Math.max(Math.abs(split), 1e-30),
        expect: {
          of: "0 — one turn, taken in the two senses", want: 0, tolerance: 0.02,
          because: "the sign of q enters ONLY as which way round the ring the step goes, " +
            "so the two are the same rotation run backwards. With a single ray and no " +
            "population to average this is not a statistical statement: they should be " +
            "exact mirrors, cell for cell",
        },
        note: `${PP.y} against ${PM.y}`,
      }),
      judge({
        name: "does reversing the FIELD reverse the split",
        value: split * splitR < 0 ? 1 : 0,
        expect: {
          of: "1 — the observable is q·B and neither alone", want: 1, tolerance: 0,
          because: "turning about −B is the opposite step to turning about B, so the whole " +
            "picture mirrors. With the row above this is the product law: swapping BOTH " +
            "the charge and the field is not a change the mechanism can see",
        },
        note: `split ${split} at B+, ${splitR} at B−`,
      }),
      judge({
        name: "a charge flown ALONG the field — how far it strays from a straight line",
        value: along.alive === 0 ? NaN : along.stray,
        expect: {
          of: "0 cells — qv×B is nought for v ∥ B", want: 0, tolerance: 0,
          because: "THE OTHER HALF OF THE FORCE LAW, and it falls out of the rotation " +
            "rather than being a case anyone wrote: `turn(d, axis)` returns d unchanged " +
            "for an exit PARALLEL to the axis, because such an exit has no component in " +
            "the plane of rotation. MEASURED WITH A ONE-WAY FIELD: built as a ± pair " +
            "instead, the charge meets the field's own counter-propagating rays head-on " +
            "and is annihilated, which is the field construction being wrong, not the rule",
        },
        note: `survived ${along.alive} of ${T} ticks, straying ${along.stray} cells`,
      }),
      judge({
        name: "does the split clear the no-field control",
        value: Math.abs(split) / Math.max(noField, 1e-30),
        expect: {
          of: "≫ 1 — no field, no deflection", atLeast: 2, want: 10,
          because: "the control the mechanism has to beat: with B = 0 there is nothing to " +
            "turn about, both charges fly straight, and whatever separation is read is the " +
            "box rather than the force",
        },
        note: `no-field ${noField} against ${Math.abs(split)}`,
      }),
      {
        name: "`axial` — the OLD reading, which could not deflect",
        value: axial / Math.max(Math.abs(split), 1e-30),
        note: `separation ${axial} against the cyclotron's ${Math.abs(split)}. It read the ` +
          `two boundaries along the ray's OWN axis, so it could only reverse a ray and ` +
          `never turn one — a force parallel to v does no deflecting. Kept because it is ` +
          `what this theory used to do, and a rule that cannot produce the effect is the ` +
          `sharpest control there is`,
      },
      judge({
        name: "`none` — the same theory with the steering switched off",
        value: none / Math.max(Math.abs(split), 1e-30),
        expect: {
          of: "0 — this is `G^XOR`, where charge is a label nothing reads",
          want: 0, tolerance: 0.02,
          because: "THE REDUCTION, and the control that says the split is the rule rather " +
            "than the arrangement: with no steering the two charges are one run repeated",
        },
        note: `${none}`,
      }),
    ];

    return {
      header: headerOf(PP.w, []),
      table: {
        columns: ["reading", "field", "q = +1 ends at y", "q = −1 ends at y", "separation"],
        rows: [
          ["lorentz", "B +z", String(PP.y), String(PM.y), String(split)],
          ["lorentz", "B −z", String(MP.y), String(MM.y), String(splitR)],
          ["lorentz", "none", String(OFF.y), String(OFFm.y), String(OFF.y - OFFm.y)],
          ["axial (old)", "B +z", String(AX.y), String(AXm.y), String(AX.y - AXm.y)],
          ["none", "B +z", String(NO.y), String(NOm.y), String(NO.y - NOm.y)],
        ],
      },
      findings,
    };
  },
});

export default [sidewaysToBoth];
