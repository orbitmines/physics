/**
 * WHAT BECOMES OF A NET SIGN IN A VACUUM THAT IS RUNNING - and it is not what Coulomb's
 * law in this folder is standing on.
 *
 * WHY THIS PROBE EXISTS. `charge.falloff` derives the inverse square the way every falloff
 * here is derived: something is CONSERVED on its way out, it goes every way alike, and it
 * is shared between the sites there are to share it between. The conserved thing is the
 * net polarity, and the premise comes from `carried/what-a-ray-keeps` - which establishes
 * it by STRIPPING THE THEORY TO TRANSPORT. `MOVEMENT` and `ARRIVAL` and nothing else.
 *
 * THAT IS THE RIGHT TEST FOR A DIFFERENT QUESTION. It asks whether carrying a sign about
 * changes it, and the answer is no, exactly, as a multiset. It does NOT ask what happens
 * when the rule that destroys things is switched back on - and the whole of the article's
 * complaint about the reach of electrostatics is about exactly that. So the premise the
 * inverse square rests on has never been asked under the rules the world actually runs.
 *
 * SO IT IS ASKED HERE, THE WAY `medium/what-transport-does` ASKS ITS OWN. Two worlds on
 * one seed, differing by a perturbation and by nothing else, run under EVERY rule; what is
 * measured is the difference between them. `slotUniformRng` is what makes that a
 * controlled comparison rather than two runs of a chaotic system: a local that does not
 * split still pays its draws, so the stream does not shift and the two worlds differ only
 * where the perturbation reached.
 *
 * AND IT IS AVERAGED OVER SEEDS, because one seed cannot answer it. The vacuum draws its
 * signs at random, so the difference between two worlds picks up that draw's own noise -
 * measured, tens of units of it against a perturbation of twelve. The noise is zero-mean
 * and the signal is not, so the mean over seeds separates them and the standard error says
 * how well. Nothing here is fitted; the scale is the scatter's own.
 *
 * WHAT IT FINDS, and it is a negative: THE NET DOES NOT SURVIVE. A perturbation carrying a
 * net of +12 is down to a third of it after two ticks and consistent with nought after
 * five. Under `perAxis`, where the vacuum creates in balanced pairs and there is no draw
 * noise at all, it goes to EXACTLY nought by the third tick, with no scatter to hide in.
 *
 * WHICH IS A SHARPER STATEMENT OF THE ARTICLE'S OWN DEBT THAN THE ARTICLE MAKES. Its
 * complaint is that the mean free path is about two cells and "a Coulomb force with a range
 * of two Planck lengths is not a Coulomb force". That is a complaint about a LENGTH. This
 * is about a PREMISE: the quantity the inverse square is the dilution of is not conserved
 * once the vacuum runs, so the derivation does not have its premise rather than having it
 * over too short a range.
 *
 * AND IT IS NOT THE SAME ANSWER THE DEFICIT GETS, WHICH IS THE INTERESTING PART.
 * `medium/what-transport-does` runs the same comparison for the GROSS disturbance - how
 * many rays the two worlds differ by, summed over every site - and finds it SETTLES, under
 * every rule, at nought sigma from flat. So a disturbance is carried and a net sign is not:
 * gravity's carrier survives this vacuum and charge's does not. That asymmetry is measured
 * rather than argued, and it is what anybody trying to give this model electrostatics at
 * range has to attack.
 */
import { Geometry } from "../../lib/Local.ts";
import { World } from "../../lib/Compat.ts";
import { Lab, Probe, Probing, measure, middle } from "../Probe.ts";
import { Emitted, Measured } from "../Kernel.ts";

/** the net sign a disturbance carries - what the inverse square is the dilution of */
export const NET = "net polarity of a disturbance";
/** and how many rays it differs by at all, which is the deficit `medium` already measures */
export const GROSS = "gross disturbance";

/** how many seeds the difference is averaged over - the vacuum's own draw is the noise */
const SEEDS = 24;
const TICKS = 10;

const netOf = (z: World) => {
  let net = 0;
  for (const l of z.locals as any[])
    for (const r of l.rays as any[])
      if (r.active && r.polarity !== undefined) net += r.polarity;
  return net;
};

const grossOf = (z: World) => {
  let n = 0;
  for (const l of z.locals as any[])
    for (const r of l.rays as any[]) if (r.active) n++;
  return n;
};

const mean = (x: number[]) => x.reduce((a, b) => a + b, 0) / x.length;
const stderr = (x: number[]) => {
  if (x.length < 2) return 0;
  const m = mean(x);
  return Math.sqrt(x.reduce((a, v) => a + (v - m) ** 2, 0) / (x.length - 1) / x.length);
};

export const purity: Probe = {
  id: "purity/what-becomes-of-a-net-sign",
  asks: "the inverse square is the dilution of something conserved, and the something is " +
    "a net sign. Is it still conserved once the rule that destroys things is running?",
  run: (lab: Lab): Probing => {
    const measured: Measured[] = [];
    const facts: Emitted[] = [];

    if (!lab.theory.polarised) return {
      facts, measured, holds: false,
      found: `${lab.theory.name}'s rays carry no sign, so there is no net for a vacuum to ` +
        `take and nothing here to ask. That is the same absence charge.falloff reports ` +
        `under this theory rather than a second one`,
    };

    const g: Geometry = lab.geometry;
    /* small and wrapped, as `medium` is and for the same two reasons: (G+M/3) grows a
     * world left to itself, and an absorbing edge would take rays out of the tally */
    const N = Math.min(lab.boxFor(g), g.D === 1 ? 41 : g.D === 2 ? 21 : 9);
    const centre = middle(g, N);

    const dNet: number[][] = Array.from({ length: TICKS }, (): number[] => []);
    const dGross: number[][] = Array.from({ length: TICKS }, (): number[] => []);
    let injected = 0;

    for (let s = 0; s < SEEDS; s++) {
      const seed = lab.seeds[0] + s;
      const w = new World({ theory: lab.theory, geometry: g, N, seed, boundary: "wrap" });
      const u = new World({ theory: lab.theory, geometry: g, N, seed, boundary: "wrap" });

      /*
       * THE PERTURBATION IS A MONOPOLE: every exit of the middle point lit, all carrying
       * the SAME sign. That is what a charge is in this model - `carried` measures that a
       * round source writes one sign on every exit - so this is the smallest thing whose
       * field the inverse square would be about, rather than an arbitrary disturbance.
       */
      const home = (w.locals as any[]).find(l => {
        const p = w.embedding.at(l) as number[] | undefined;
        return p && p.every((x, k) => Math.abs(x - centre[k]) < 1e-9);
      });
      if (!home) continue;
      let inj = 0;
      for (const r of home.rays as any[]) { r.active = true; r.polarity = 1; inj++; }
      injected = inj;

      for (let t = 0; t < TICKS; t++) {
        w.run(1); u.run(1);
        dNet[t].push(netOf(w) - netOf(u));
        dGross[t].push(Math.abs(grossOf(w) - grossOf(u)));
      }
    }

    if (!injected) return {
      facts, measured, holds: false,
      found: "no middle point could be found to perturb, so the comparison could not be set up",
    };

    const m = dNet.map(mean), e = dNet.map(stderr);
    const gross = dGross.map(mean);
    /* how many ticks before the injected net is below half of what went in */
    let half = -1;
    for (let t = 0; t < TICKS; t++) if (Math.abs(m[t]) < injected / 2) { half = t + 1; break; }

    const from = Math.floor(TICKS / 2);
    const tail = m.slice(from), tailE = e.slice(from);

    /*
     * THREE OUTCOMES, AND TELLING THEM APART IS THE WHOLE HONESTY OF THIS PROBE.
     *
     *   KEPT          the tail still sits at what went in, within its own scatter. The
     *                 premise holds under the full rules and the fact is emitted.
     *   EATEN         the tail sits at nought, well below what went in, with a scatter
     *                 small enough to say so. The vacuum took it, and that is a result.
     *   DECORRELATED  the difference between the two worlds has grown PAST what was put
     *                 in, and its scatter with it. Then the two worlds are no longer one
     *                 experiment with a perturbation in it - they are two runs of a
     *                 chaotic system - and the honest answer is that this instrument
     *                 cannot see the perturbation any more, which is a statement about
     *                 the instrument and NOT about charge.
     *
     * THE THIRD ONE IS WHY THIS BLOCK EXISTS. Read as a ratio of magnitudes it comes back
     * as "264 per cent of what went in is still there", which reads as conservation and
     * is the opposite: measured under `G^XOR^c`, the mean runs to -32 with a standard
     * error of 30 while the gross difference climbs from 3 to 83. Reporting that as a
     * finding about the net would be reporting the divergence of two worlds as physics.
     */
    const scatter = mean(tailE);
    const swamped = tail.some(v => Math.abs(v) > injected) || scatter > injected / 2 ||
      gross[TICKS - 1] > 6 * Math.max(gross[from], 1);
    const kept = !swamped &&
      tail.every((v, i) => Math.abs(v - injected) <= 2 * Math.max(tailE[i], 1));
    const eaten = !swamped && !kept &&
      tail.every((v, i) => Math.abs(v) <= Math.max(2 * tailE[i], injected / 4));
    const left = m[TICKS - 1] / injected;

    measured.push(measure("net put in", injected,
      `every exit of the middle point lit carrying the same sign, which is what a round ` +
      `source writes and so is the smallest thing the inverse square could be about`));
    measured.push(measure("net still there, tick by tick", m[0],
      `${m.map((v, i) => `${v.toFixed(1)}±${e[i].toFixed(1)}`).join(", ")} over ` +
      `${TICKS} ticks on ${g.name}, box ${N}, wrapped, under EVERY rule of ` +
      `${lab.theory.name} - the signed difference between a perturbed world and an ` +
      `unperturbed one at the same seed, averaged over ${SEEDS} seeds. The vacuum's own ` +
      `sign draw is the noise here and it is zero-mean, so the mean separates it from the ` +
      `perturbation and the standard error says how well`));
    measured.push(measure("fraction of it left at the end", left,
      (half > 0 ? `it is below half of what went in by tick ${half}. ` :
        `it never falls below half of what went in. `) +
      `Over the second half the mean scatter is ${scatter.toFixed(1)} against ` +
      `${injected} put in` +
      (swamped ? ", which is the two worlds coming apart rather than the perturbation " +
        "being read - see the note in this probe about the third outcome" : "")));
    if (kept) {
      facts.push({
        fact: { kind: "conserved", of: NET }, from: [],
        measured: [measured[1], measured[2]],
        because: `the net sign a perturbation carries still sits at what went in after ` +
          `${TICKS} ticks under every rule of ${lab.theory.name}, within its own scatter, ` +
          `averaged over ${SEEDS} seeds against the vacuum's own draw. So the quantity ` +
          `the inverse square is the dilution of survives the rule that destroys things, ` +
          `and charge.falloff's premise holds where the world runs rather than only ` +
          `where transport does`,
        line: `${NET} is conserved in flight`,
      });
      return {
        facts, measured, holds: true,
        found: `a net sign survives this vacuum: ${injected} went in and the mean is ` +
          `still ${m[TICKS - 1].toFixed(1)} after ${TICKS} ticks, within its scatter`,
      };
    }

    if (swamped) return {
      facts, measured, holds: false,
      found: `THIS INSTRUMENT CANNOT SEE IT HERE, which is a statement about the ` +
        `instrument. The difference between the two worlds has grown past the ` +
        `${injected} that was put in - the mean runs to ${m[TICKS - 1].toFixed(1)} with a ` +
        `scatter of ${scatter.toFixed(1)}, and the gross difference climbs ` +
        `${gross[0].toFixed(0)} to ${gross[TICKS - 1].toFixed(0)} over the run - so what ` +
        `is being measured is two worlds of ${lab.theory.name} coming apart rather than ` +
        `one world with a perturbation in it. NO CLAIM IS MADE ABOUT THE NET EITHER WAY. ` +
        `A theory whose worlds diverge this fast needs either a shorter run, more seeds, ` +
        `or a perturbation big enough to stay above the divergence, and none of those is ` +
        `a thing to choose after seeing the answer`,
    };

    return {
      facts, measured, holds: false,
      found: `THE NET DOES NOT SURVIVE. ${injected} put in as a monopole at the middle is ` +
        (half > 0 ? `below half of that by tick ${half} and ` : "") +
        `${m[TICKS - 1].toFixed(1)} after ${TICKS}, against a scatter of ` +
        `${scatter.toFixed(1)}, averaged over ${SEEDS} seeds under every rule of ` +
        `${lab.theory.name}${eaten ? " - consistent with nothing at all" : ""}. ` +
        `charge.falloff's conservation premise comes from carried/what-a-ray-keeps, ` +
        `which STRIPS THE THEORY TO TRANSPORT to ask it, and under transport alone the ` +
        `multiset of signs is kept exactly. Switch the destroying rule back on and it is ` +
        `not. So the inverse square for CHARGE is derived from a premise that does not ` +
        `hold in a vacuum that is running - which is a sharper version of the article's ` +
        `own complaint about the reach of electrostatics than the article makes: not a ` +
        `range too short, a premise absent. Read it beside ` +
        `medium/what-transport-does, which runs this same comparison for the GROSS ` +
        `disturbance and finds that one settles`,
    };
  },
};
