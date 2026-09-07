/**
 * WHAT IS PROVED, AND IN WHAT ORDER - the one table, read by two entry points.
 *
 * It lived in `PROVE.ts` until `discovery/` wanted it too, and a second copy of a
 * twenty-four line list is a second copy that goes stale: `DISCOVER.ts` unions every
 * probe in this table and every definition it carries, so a theorem added to one and not
 * the other would be a theorem the discovery sweep cannot see. There is one list, here.
 *
 * NOTHING RUNS ON IMPORT. That is the whole reason this is its own file rather than an
 * export from `PROVE.ts`, which proves the moment it is loaded.
 */
import { Theorem } from "./Theorem.ts";
import { drift } from "./theorems/drift.ts";
import { ampere, coulomb, sheet } from "./theorems/electromagnetism.ts";
import { definitions as attractionDefs, coulomb as attraction } from "./theorems/coulomb.ts";
import { horizon, phase, range, recession } from "./theorems/reach.range.ts";
import { charge_reach, definitions as chargeReachDefs } from "./theorems/reach.charge.ts";
import { Lab } from "./Probe.ts";
import { definitions, inverseSquare } from "./theorems/inverse-square.ts";
import { shellGrowth } from "./theorems/shell-growth.ts";
import { constants, definitions as constantDefs } from "./theorems/constants.ts";
import { occupancy, definitions as occupancyDefs } from "./theorems/occupancy.ts";
import {
  expansion, expansionDefinitions as expansionDefs,
  suppression, suppressionDefinitions as suppressionDefs,
} from "./theorems/vacuum.ts";
import { turns } from "./theorems/turns.ts";
import { space } from "./theorems/space.ts";
import {
  assumptions, fluxIsPositive, fluxIsWhatTransportConserves, REGIMES, transport,
} from "./theorems/transport.ts";
import { DEFICIT } from "./probes/medium.ts";
import { definitions as meetingDefs, meetings } from "./theorems/meetings.ts";
import { definitions as reachDefs, reach } from "./theorems/reach.ts";
import { definitions as lawDefs, law } from "./theorems/law.ts";
import { definitions as metricDefs, metric } from "./theorems/metric.ts";
import { definitions as shareDefs, share } from "./theorems/share.ts";
import { definitions as clockDefs, clock } from "./theorems/clock.ts";
import { rest } from "./theorems/rest.ts";
import { definitions as epsilonDefs, epsilon } from "./theorems/epsilon.ts";
import { definitions as identicalDefs, identical } from "./theorems/identical.ts";
import { definitions as ignoranceDefs, ignorance } from "./theorems/ignorance.ts";
import { definitions as debroglieDefs, debroglie } from "./theorems/debroglie.ts";
import { definitions as gravityAtomDefs, gravityAtom } from "./theorems/gravity.atom.ts";
import { definitions as gravityRatioDefs, gravityRatio } from "./theorems/gravity.ratio.ts";
import { definitions as electronDefs, gravityElectron } from "./theorems/gravity.electron.ts";
import { continuum, definitions as continuumDefs } from "./theorems/vacuum.continuum.ts";
import {
  harmonics, harmonicsDefinitions, isotropic, isotropicDefinitions, kernelDefinitions,
  rates, ratesDefinitions, turnKernel,
} from "./theorems/scattering.ts";
import {
  beats, beatsDefinitions, carried, carriedDefinitions, equation, equationDefinitions,
  facing, facingDefinitions,
} from "./theorems/vacuum.population.ts";
import {
  definitions as emissionDefs, emissionTheorem,
} from "./theorems/atom.emission.ts";
import { definitions as metDefs, met } from "./theorems/met.ts";
import { definitions as recordDefs, record as recordThm } from "./theorems/record.ts";
import { definitions as fullDefs, full } from "./theorems/full.ts";
import { definitions as ceilingDefs, ceiling } from "./theorems/ceiling.ts";
import { definitions as spacetimeDefs, spacetime } from "./theorems/spacetime.ts";
import { definitions as joiningDefs, joining } from "./theorems/joining.ts";
import {
  definitions as relativisticDefs, relativistic,
} from "./theorems/relativistic.ts";

/**
 * WHAT IS PROVED, AND IN WHAT ORDER - the shell first, because everything else stands on
 * it.
 *
 * `extra` is a function of the lab rather than a list, because a theorem may be asked
 * under a named setting that is not the lattice: `transport.thinning` has two regimes and
 * they are two different questions, so the assumption it is given depends on which one is
 * being asked. A theorem with nothing to vary ignores the argument.
 */
export type Entry = {
  theorem: typeof shellGrowth;
  extra: (lab: Lab) => { fact: any; because: string; line?: string }[];
  /** the settings other than the lattice this theorem is asked under, if it has any */
  regimes?: { name: string; says: string }[];
};

export const THEOREMS: Entry[] = [
  { theorem: space, extra: () => [] },
  { theorem: constants, extra: () => constantDefs },
  { theorem: turns, extra: () => [] },
  { theorem: occupancy, extra: () => occupancyDefs },
  { theorem: expansion, extra: () => expansionDefs },
  { theorem: suppression, extra: () => suppressionDefs },
  { theorem: shellGrowth, extra: () => [] },
  { theorem: inverseSquare, extra: () => definitions },
  {
    theorem: meetings,
    extra: () => meetingDefs,
  },
  { theorem: law, extra: () => lawDefs },
  { theorem: metric, extra: () => metricDefs },
  { theorem: share, extra: () => shareDefs },
  { theorem: clock, extra: () => clockDefs },
  /* the clock says what a period is; this says what the tick it is a period OF is spent
   * on, so it comes straight after and cites it */
  { theorem: rest, extra: () => [] },
  { theorem: epsilon, extra: () => epsilonDefs },
  { theorem: identical, extra: () => identicalDefs },
  { theorem: ignorance, extra: () => ignoranceDefs },
  /*
   * AND THE SAME BEAT TAKEN ALL THE WAY TO A LENGTH. `matter.wavelength` stops at the
   * beat, which is a shape and not a distance; this measures the node spacing off the
   * phase field and counts how many fit, which is what every bound state below needs.
   */
  { theorem: debroglie, extra: () => debroglieDefs },
  /* met multiplies two densities together, so it inherits the transport regime - see
   * the note in met.ts about this having been got wrong */
  { theorem: met, regimes: REGIMES, extra: (lab: Lab) =>
      metDefs(REGIMES.find(r => r.name === lab.regime?.name) ?? REGIMES[0]) },
  { theorem: recordThm, extra: () => recordDefs },
  /* the assembled law multiplies met, so it inherits the transport regime too */
  { theorem: full, regimes: REGIMES, extra: (lab: Lab) =>
      fullDefs(REGIMES.find(r => r.name === lab.regime?.name) ?? REGIMES[0]) },
  { theorem: ceiling, extra: () => ceilingDefs },
  { theorem: spacetime, extra: () => spacetimeDefs },
  { theorem: joining, extra: () => joiningDefs },
  /*
   * ASKED ONCE PER CLOCK. Which clock a force is quoted per is a choice rather than a
   * derivation - see `PERSPECTIVES` - so it is swept like the transport regime and every
   * answer is on the page, with the receiver's first.
   */
  {
    theorem: relativistic,
    /* one law now, with w and k carried in it - there is nothing left to sweep */
    extra: () => relativisticDefs,
  },
  { theorem: reach, extra: () => reachDefs },
  { theorem: drift, extra: () => [] },
  { theorem: coulomb, extra: () => [] },
  /*
   * THE SIGN, WHICH IS A DIFFERENT QUESTION FROM THE SHAPE. `charge.falloff` gets the
   * inverse square out of the shells; this gets attraction and repulsion out of which
   * pairs the meeting rule destroys. It comes after `share.coherence` and `gravity.full`
   * because it is those two read again with the bodies allowed to be biased.
   */
  /*
   * AND IT CARRIES `share.coherence`'S OWN DEFINITION RATHER THAN CITING IT, because the
   * two are the same enumeration read twice and this theorem runs the same probe. Citing
   * would leave `share` as an opaque name on the page in any run where the earlier
   * theorem was not asked; reusing the definition object - the same one, imported, not a
   * second copy - puts the half on the page beside the law it turns out to be a case of.
   */
  { theorem: attraction, extra: () => [...shareDefs, ...attractionDefs] },
  { theorem: ampere, extra: () => [] },
  { theorem: sheet, extra: () => [] },
  /*
   * THE TWO HYDROGEN LADDERS ARE GONE, and what replaced them is not a better derivation of
   * the same thing - it is the admission that they were the wrong kind of statement.
   *
   * `atom.hydrogen` put `charge.attraction`, `charge.falloff` and `matter.debroglie`
   * together and read the Bohr ladder off the balance; `gravity.hydrogen` did the same with
   * the two gravity sentences and got the integer from the ring's winding. Both were sound
   * as scalings and neither was an ATOM: they solved for where a shell would stand given a
   * counting condition, on a lattice's own shells, with no run of the rules behind them and
   * nothing in either that could produce an ORBITAL - no angle, no lobe, no node in space.
   * `atom.hydrogen`'s own header said as much, in the paragraph headed WHAT IS NOT CLAIMED.
   *
   * The vacuum theorems below are the same question asked the only way that can answer it:
   * write the rules as a population, run it round a source, and look at what stands in the
   * space. That is a harder thing to be right about and it is at least the right thing.
   */
  { theorem: gravityAtom, extra: () => gravityAtomDefs },
  { theorem: gravityRatio, extra: () => gravityRatioDefs },
  { theorem: gravityElectron, extra: () => electronDefs },
  { theorem: continuum, extra: () => continuumDefs },
  /*
   * AND THEN THE STEERING TERM TAKEN APART, which is the one `vacuum.continuum` leaves
   * standing. They come after it because each is a statement about a term in its line, and
   * in this order because each uses the one before: the axis is isotropic, so the turn has a
   * closed-form phase function, so the scattering is diagonal in the harmonics, and once the
   * rates are read off there is one parameter left.
   */
  { theorem: isotropic, extra: () => isotropicDefinitions },
  { theorem: turnKernel, extra: () => kernelDefinitions },
  { theorem: harmonics, extra: () => harmonicsDefinitions },
  { theorem: rates, extra: () => ratesDefinitions },
  /*
   * AND THEN WHAT IS LEFT WHEN THE EQUATION IS ACTUALLY RUN. `vacuum.continuum` is an
   * accounting of the rules and the four above take its steering term apart; these three are
   * what the accounting does not say and an integration cannot avoid - what a meeting is
   * against, that the making and the killing alternate rather than hold at once, and whether
   * the grid the moments are read on is in the answer. They come last because each is a
   * correction to a term the others have already written down.
   */
  { theorem: facing, extra: () => facingDefinitions },
  { theorem: beats, extra: () => beatsDefinitions },
  { theorem: carried, extra: () => carriedDefinitions },
  /*
   * AND THEN THE WHOLE OF IT ON ONE LINE, which comes after all of them because it is all of
   * them - every rule as a term with the three corrections folded in, and one term left over
   * that is not a rule at all.
   */
  { theorem: equation, extra: () => equationDefinitions },
  /*
   * AND THAT ONE TERM WRITTEN FOR A HYDROGEN STATE, which is where n, l and m turn out to
   * live - all three of them, and nothing else in the model touched. It replaces the two
   * ladders removed above, and it claims a great deal less than they did.
   */
  { theorem: emissionTheorem, extra: () => emissionDefs },
  { theorem: range, extra: () => [] },
  /*
   * AND THE SAME QUESTION ASKED OF CHARGE WITH THE DESTROYING RULE RUNNING. It comes after
   * `force.range` because it is that theorem re-read, and after `charge.falloff` because
   * the whole of it is charge.falloff's premise asked again under the full rules.
   */
  { theorem: charge_reach, extra: () => chargeReachDefs },
  { theorem: horizon, extra: () => [] },
  { theorem: recession, extra: () => [] },
  { theorem: phase, extra: () => [] },
  {
    theorem: transport,
    regimes: REGIMES,
    extra: (lab: Lab) => {
      const regime = REGIMES.find(r => r.name === lab.regime?.name) ?? REGIMES[0];
      return [...assumptions(regime), fluxIsWhatTransportConserves(DEFICIT), fluxIsPositive];
    },
  },
];

