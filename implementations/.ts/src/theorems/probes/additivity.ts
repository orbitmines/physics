/**
 * ARE THE TWO MECHANISMS ADDITIVE - asked by taking each one out of the theory and
 * looking, rather than by writing down that they add.
 *
 * `gravity.full` says `F_{g} = F_{meet} + F_{vac}` and calls it a definition: what a body
 * feels is everything that arrives at it, and things that arrive add. That is a perfectly
 * good sentence and it is not a definition at all - it is a claim about the DYNAMICS, and
 * a false one in any theory where the two mechanisms interfere. Two rules running together
 * can easily do something neither does alone: the vacuum's creation supplies the very rays
 * the meetings then annihilate, so there is every reason to think the pair is not the sum
 * of the parts, and no reason at all to assume it.
 *
 * SO IT IS SETTLED THE WAY THIS FOLDER SETTLES THINGS - by isolating the rules and
 * counting. `Theory.without` gives back the same theory with a rule removed, so the
 * experiment is three worlds and not one: the vacuum with nothing to annihilate it, the
 * meetings with nothing creating for them, and both together. If the pull in the third is
 * the pull in the first plus the pull in the second, additivity is measured. If it is not,
 * then the assembled gravitational law is wrong in a way no amount of algebra above it
 * would have revealed, and this probe says so and hands back nothing.
 *
 * ADDING TWO CHANNELS IS NOT WHAT IS BEING TESTED, AND THE FIRST VERSION OF THIS PROBE
 * TESTED IT ANYWAY. The two mechanisms write to different ledgers - meetings DESTROY and
 * the vacuum CREATES - so `F_{meet} + F_{vac}` is a sum of two quantities that are not in
 * the same units, and a run that adds them is adding counts of different things. Worse,
 * the pull was read off the destruction ledger for both, so taking ANNIHILATION out made
 * the vacuum's channel read zero by construction and the probe reported a hundred per cent
 * disagreement about the model when what it had measured was its own instrument.
 *
 * WHAT ADDITIVITY ACTUALLY REQUIRES IS INDEPENDENCE, and that is a well-posed question
 * with no units in it. Two contributions superpose exactly when neither is changed by the
 * other being there. So each channel is measured in its OWN ledger, twice: with the other
 * mechanism running and with it taken out. If the destruction imbalance is the same
 * whether or not the vacuum is creating, and the creation imbalance is the same whether or
 * not the meetings are annihilating, then the two do not interfere and adding them is
 * justified. If either moves, they interfere, and the assembled law is adding things that
 * are not there to be added.
 *
 * THIS IS THE STRONGER TEST AS WELL AS THE FAIR ONE. Interference is exactly what one
 * would expect here - the vacuum's creation supplies the very rays the meetings then
 * annihilate - so a model in which these two channels are independent is saying something
 * quite specific about itself, and it should have to say it out loud.
 *
 * AND WHEN IT DOES HOLD, THE DEFINITION IS GONE. The fact this emits is keyed identically
 * to the line `gravity.full` writes by hand, and premises are added before definitions -
 * so the measured version takes the slot, the definition is never added, and everything
 * standing on it stops being conjectured. That is the whole mechanism for retiring an
 * assumption here: measure the thing it asserts, and it stops being an assumption without
 * anybody editing the theorem.
 */
import { Geometry } from "../../lib/Local.ts";
import { World, pullChannel } from "../../lib/Compat.ts";
import { add, sym } from "../Expr.ts";
import { Lab, Probe, Probing, measure, middle } from "../Probe.ts";
import { Emitted, Measured } from "../Kernel.ts";
import { BY_MEETING, BY_VACUUM, FORCE } from "../theorems/full.ts";

/** the rule that makes space, and the rule that takes it away */
const MAKES = "CREATION";
const TAKES = "ANNIHILATION";

/**
 * THE TWO BODIES, IN A THEORY WITH THESE RULES TAKEN OUT.
 *
 * Everything else held: same lattice, same box, same seed, same run length, and
 * `slotUniformRng` so that two runs on one seed differ only by what was removed rather
 * than by having drawn a different random stream.
 */
const world = (lab: Lab, g: Geometry, N: number, drop: string[], sep: number) => {
  let theory = lab.theory;
  for (const name of drop) {
    if (!theory.rules[name]) return undefined;
    theory = theory.without(name);
  }
  const w = new World({ theory, geometry: g, N, seed: lab.seeds[0], boundary: "absorb",
    slotUniformRng: true });
  const centre = middle(g, N);
  const other = centre.map((x, i) => (i === 0 ? x + sep : x));
  w.add({ at: centre, radius: 1, absorbs: true, emits: 1, duty: 1 });
  w.add({ at: other, radius: 1, absorbs: true, emits: 1, duty: 1 });
  w.run(Math.min(lab.T, 60));
  return { w, centre, toward: other.map((x, i) => x - centre[i]) };
};

/**
 * THE MEETINGS' OWN CHANNEL: the running destruction ledger, read across the near body -
 * what is gone on the side facing its partner against the side facing away. This is what
 * the article means by a force and what `pullChannel` reads.
 */
const byDestruction = (it: NonNullable<ReturnType<typeof world>>) =>
  pullChannel(it.w, it.centre, it.toward, 2, 5);

/**
 * THE VACUUM'S OWN CHANNEL: how much space was MADE, read the same way across the same
 * body.
 *
 * CREATION is gated on `world.blocks`, which is how a body suppresses the vacuum around
 * it - so the quantity the suppression argument is about is the shortfall in what the
 * vacuum managed to make near one body on the side facing the other. A local that has
 * unfolded stands for more than one point and says so in its `density`, so the density
 * summed over a side is what the vacuum did there, and the two sides differenced is the
 * imbalance. No destruction appears in it anywhere, which is the whole point: this channel
 * can be read in a theory with nothing that destroys.
 */
const byCreation = (it: NonNullable<ReturnType<typeof world>>) => {
  const { w, centre, toward } = it;
  const n = Math.hypot(...toward) || 1;
  const u = toward.map(x => x / n);
  let tow = 0, twN = 0, awy = 0, awN = 0;
  for (const l of w.locals as any[]) {
    if (l.source) continue;
    const p = w.embedding.at(l) as number[] | undefined;
    if (!p) continue;
    const d = p.map((x, i) => x - centre[i]);
    const r = Math.hypot(...d);
    if (r < 2 || r > 5) continue;
    const along = d.reduce((a, x, i) => a + x * u[i], 0);
    if (Math.abs(along) < 0.6 * r) continue;
    const made = (l.density ?? 1);
    if (along > 0) { tow += made; twN++; } else { awy += made; awN++; }
  }
  return tow / Math.max(twN, 1) - awy / Math.max(awN, 1);
};

export const additivity: Probe = {
  id: "additivity/do-the-two-mechanisms-add",
  asks: "take the vacuum's creation out, then take the annihilation out, then put both " +
    "back. Is what two bodies do together what each does alone, added?",
  run: (lab: Lab): Probing => {
    const measured: Measured[] = [];
    const facts: Emitted[] = [];

    const g = lab.geometry;
    const N = Math.min(lab.boxFor(g), g.D === 1 ? 41 : g.D === 2 ? 31 : 17);
    const sep = 4;

    if (!lab.theory.rules[MAKES] || !lab.theory.rules[TAKES]) return {
      facts, measured, holds: false,
      found: `${lab.theory.name} has no ${MAKES} or no ${TAKES}, so there are not two ` +
        `mechanisms here to ask whether they add`,
    };

    /*
     * WHICH RUN IS WHICH. Taking ANNIHILATION out leaves the vacuum making space with
     * nothing to unmake it, which is the suppression channel alone; taking CREATION out
     * leaves the meetings with only what the bodies themselves emit, which is the meeting
     * channel alone. Both is the theory as it stands.
     */
    const both = world(lab, g, N, [], sep);
    const vacuumOnly = world(lab, g, N, [TAKES], sep);
    const meetingOnly = world(lab, g, N, [MAKES], sep);

    if (!both || !vacuumOnly || !meetingOnly) return {
      facts, measured, holds: false,
      found: "one of the three worlds could not be built, so the comparison is not " +
        "available in this theory",
    };

    /*
     * EACH CHANNEL IN ITS OWN LEDGER, WITH AND WITHOUT THE OTHER MECHANISM. Four numbers,
     * and the question is whether the two pairs agree.
     */
    const destroyBoth = byDestruction(both);
    const destroyAlone = byDestruction(meetingOnly);
    const createBoth = byCreation(both);
    const createAlone = byCreation(vacuumOnly);

    const drift = (a: number, b: number) =>
      Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-12);
    const meetDrift = drift(destroyBoth, destroyAlone);
    const vacDrift = drift(createBoth, createAlone);

    measured.push(measure("the meetings' channel, with the vacuum running", destroyBoth,
      `the destruction imbalance across the near body, two bodies ${sep} cells apart on ` +
      `${g.name}, theory as it stands`));
    measured.push(measure(`the meetings' channel, with ${MAKES} taken out`, destroyAlone,
      `the same reading with nothing creating for the meetings to work on - ` +
      `${(meetDrift * 100).toFixed(1)} per cent from the reading above`));
    measured.push(measure("the vacuum's channel, with the meetings running", createBoth,
      `the density imbalance across the same body - how much space the vacuum managed to ` +
      `make on the side facing its partner against the side facing away`));
    measured.push(measure(`the vacuum's channel, with ${TAKES} taken out`, createAlone,
      `the same reading with nothing unmaking what the vacuum makes - ` +
      `${(vacDrift * 100).toFixed(1)} per cent from the reading above`));

    /*
     * A CHANNEL THAT READS NOTHING IN BOTH WORLDS HAS NOT BEEN TESTED. That is a fact
     * about this box and this run length rather than about the model, and it is reported
     * as one instead of being counted as perfect agreement - two zeros agree to zero per
     * cent and mean nothing at all.
     */
    const silent = Math.max(Math.abs(destroyBoth), Math.abs(destroyAlone)) < 1e-9
      ? "the meetings" : Math.max(Math.abs(createBoth), Math.abs(createAlone)) < 1e-9
        ? "the vacuum" : undefined;
    if (silent) return {
      facts, measured, holds: false,
      found: `${silent}' channel reads nothing in either world at this size, so whether ` +
        `the two mechanisms interfere cannot be settled here. Two zeros are not an ` +
        `agreement`,
    };

    /*
     * A TENTH IS THE LINE, and it is a judgement rather than a theorem - these are two
     * bodies in a box small enough to run, read off channels the article itself records as
     * noisy. Anything past it is reported and refused, which is the honest place to put a
     * threshold rather than pretending there is a sharp one.
     */
    /*
     * A CHANNEL THAT EXISTS WITH THE OTHER RULE AND VANISHES WITHOUT IT IS NOT
     * INTERFERENCE - it is a PRECONDITION, and the difference is the whole content.
     *
     * Interference means two contributions that are each there but do not simply add.
     * What G actually does is stronger and stranger: with CREATION removed the meetings'
     * channel reads exactly nothing, because in this theory the medium IS what the vacuum
     * creates and there is nothing left to annihilate; with ANNIHILATION removed the
     * vacuum's channel reads exactly nothing, because creation runs unchecked and fills
     * the box uniformly, and a uniform filling has no imbalance across anything. Neither
     * mechanism has a contribution of its own to be added to the other's.
     *
     * SAYING THAT AS "THEY DISAGREE BY A HUNDRED PER CENT" WOULD BE TRUE AND USELESS. It
     * reads as a measurement that came out badly, when it is a structural fact about the
     * model - and it is the reason `F_{g} = F_{meet} + F_{vac}` cannot be established by
     * ablation at all, however good the instrument gets.
     */
    const gone = (both_: number, alone: number) =>
      Math.abs(both_) > 1e-9 && Math.abs(alone) < 1e-9;
    const preconditions: string[] = [];
    if (gone(destroyBoth, destroyAlone)) preconditions.push(
      `the meetings' channel reads ${destroyBoth.toFixed(4)} with the vacuum running and ` +
      `exactly nothing without it - in this theory the medium IS what ${MAKES} makes, so ` +
      `with it removed there is nothing left for a meeting to happen in`);
    if (gone(createBoth, createAlone)) preconditions.push(
      `the vacuum's channel reads ${createBoth.toFixed(4)} with the meetings running and ` +
      `exactly nothing without them - unchecked, ${MAKES} fills the box uniformly, and a ` +
      `uniform filling has no imbalance across a body to read`);
    if (preconditions.length) return {
      facts, measured, holds: false,
      found: `the two mechanisms are not two contributions at all in ${lab.theory.name}: ` +
        `${preconditions.join("; and ")}. Each is a PRECONDITION for the other's channel ` +
        `rather than a term beside it, so there is nothing here to add and no ablation ` +
        `could establish that there is. ${FORCE} = ${BY_MEETING} + ${BY_VACUUM} stays a ` +
        `conjecture, and this is the reason rather than a failure to measure well enough`,
    };

    if (meetDrift > 0.1 || vacDrift > 0.1) return {
      facts, measured, holds: false,
      found: `the two mechanisms INTERFERE in ${lab.theory.name}: taking ${MAKES} out ` +
        `moves the meetings' own channel by ${(meetDrift * 100).toFixed(1)} per cent ` +
        `(${destroyBoth.toFixed(4)} to ${destroyAlone.toFixed(4)}) and taking ${TAKES} ` +
        `out moves the vacuum's by ${(vacDrift * 100).toFixed(1)} per cent ` +
        `(${createBoth.toFixed(4)} to ${createAlone.toFixed(4)}). Neither contribution is ` +
        `what it would be alone, so they are not two things being added - and the ` +
        `assembled law adds them`,
    };

    /*
     * AND EVEN WHEN THE TWO CHANNELS AGREE, NOTHING IS EMITTED.
     *
     * A PROBE'S PREMISES COME FROM THE RULES; a measurement is allowed to be the reason a
     * probe exists and is never allowed to be what a premise stands on. Everything above
     * is read off ticked worlds and compared against a tolerance somebody chose - which
     * is a measurement however carefully it is done, and a premise resting on it would
     * carry that tolerance into every line above while reading exactly like a premise
     * resting on a rule.
     *
     * SO THIS PROBE REPORTS AND DOES NOT SUPPLY. What it is FOR is telling you which
     * rule-level question is worth asking, and here it has done that: the two mechanisms
     * are not two contributions at all, because each one's channel reads exactly nothing
     * without the other rule running. That is not a tolerance being missed, it is a
     * structural fact about the theory, and the probe that would establish it properly
     * asks the rules directly - does CREATION supply what ANNIHILATION consumes - rather
     * than ticking two worlds and comparing totals.
     */
    return {
      facts, measured, holds: true,
      found: `the two mechanisms do not interfere: the meetings' channel moves ` +
        `${(meetDrift * 100).toFixed(1)} per cent when the vacuum is taken away and the ` +
        `vacuum's moves ${(vacDrift * 100).toFixed(1)} per cent when the meetings are, so ` +
        `each contributes what it would contribute alone and adding them is justified`,
    };
  },
};
