/**
 * PROVE WHAT THE RULES COME TO, AND WRITE IT OUT.
 *
 *     npm run theorems
 *
 * ONE COMMAND, NO SETTINGS. There is no box, no lattice, no seed and no number of ticks in
 * this: what is being derived is what the RULES say, and a run would only tell you what one
 * world did. `Continuum` assembles the model by counting what each rule's body does, `Prove`
 * reads its premises off that line and closes them under the inference rules, and this writes
 * the result to `theorems/`.
 *
 * SO A CHANGE TO `G.ts` MOVES THESE PAGES. That is the whole point of the arrangement, and it
 * is worth checking rather than believing: edit a rule body and the term, the premise, the step
 * that used it and the conclusion all move together, because none of them was written down
 * anywhere else.
 */
import { G } from "../index.ts";
import { continuum } from "../src/lib/Continuum.ts";
import { lineSteps, prove } from "../src/lib/Prove.ts";
import { Asked, group, record, rendering, write, writeIndex } from "./EMIT.ts";

const equation = continuum(G as any);
const proof = prove(equation, (G as any).rules);
rendering(equation, (G as any).rules);
const line = lineSteps(equation, (G as any).rules).map(n => ({ ...n, pass: 0 }));

/**
 * WHAT THE ONE LINE IMPLIES, SPLIT INTO THE QUESTIONS IT ANSWERS.
 *
 * A theorem here is not a separate derivation - the rules are closed ONCE and each of these is
 * a conclusion of that closure, named by the question it answers and carrying the steps it
 * actually rests on. Splitting them is for a reader; the store is one.
 */
/**
 * WHAT THE TWO FORMS OF THE FORCE LAW ARE, said once - every page that shows the pair says it.
 */
const REC = "RECURSIVE — g stands on both sides, because the mismatch is measured against " +
  "the acceleration it produces. This is the form the rules give and it is exact.";
const SOLVED = "NOT RECURSIVE — the same law solved for g, with nothing on the right that is " +
  "not already known. Every name in it is written once. It loses precision where the field " +
  "is strong, so it is what a reader gets and never what a number is evaluated from.";

const THEOREMS: {
  id: string; asks: string; about: string;
  also?: string; leads?: string; then?: string; chain?: string;
}[] = [
  {
    id: "vacuum.equation",
    asks: "every rule of the theory is a term, and every rule touches two things - the " +
      "population and the space. What ARE the continuous equations, counted off the rules?",
    about: "",
  },
  {
    id: "vacuum.occupancy",
    asks: "the vacuum makes and takes at once. Left alone, where does it settle - and is that " +
      "a number the rules fix, or one somebody chose?",
    about: "\\rho_{\\infty}",
  },
  {
    id: "force.range",
    asks: "a carrier is destroyed when it meets something. How far does ONE of them get " +
      "before that happens?",
    about: "\\lambda",
  },
  {
    id: "transport.speed",
    asks: "MOVEMENT says a ray goes one cell a tick, and then says what happens when there is " +
      "no cell. How fast does a carrier actually go?",
    about: "v",
  },
  {
    id: "transport.thinning",
    asks: "a medium carries something outward from a source, and its carriers may have to make " +
      "the room they cross. How thick is it at r steps?",
    about: "n",
  },
  {
    id: "gravity.falloff",
    asks: "a shortfall spreads out from a body. How does what reaches a distance depend on " +
      "that distance, and on what else?",
    about: "\\delta screened",
  },
  {
    id: "gravity.reach",
    asks: "every body in the world is casting a shortfall everywhere. Adding up what all of " +
      "them put on you, is there a total?",
    about: "the ambient field",
  },
  {
    id: "gravity.horizon",
    asks: "the shortfall grows without limit as a body is approached, and a point has only so " +
      "many exits to be missing. What happens where the two meet?",
    about: "S at the horizon",
  },
  {
    id: "gravity.index",
    asks: "one term of the line swings a heading. What refractive index is that, and what " +
      "does it come to at a distance from a body?",
    about: "N in r",
  },
  {
    id: "gravity.bending",
    asks: "light crossing a body's field is turned by it. How far, and is that the Newtonian " +
      "answer or twice it?",
    about: "\\alpha",
  },
  {
    id: "vacuum.facing",
    asks: "a meeting is with what is coming the OTHER way. What does that come to in a " +
      "vacuum with no bias in it?",
    about: "F",
  },
  {
    id: "gravity.motion",
    asks: "a body gets one action a tick and can move or shine, not both. What does that do " +
      "to the pull between two of them?",
    about: "how motion moves it",
  },
  {
    id: "gravity.suppression",
    asks: "every cell of a body prevents an expansion. Does the pull go as its bulk or as " +
      "its surface - and does anything in these rules decide?",
    about: "what a body puts into the medium",
  },
  {
    id: "gravity.absorbing",
    asks: "a body sitting in a field is a region rather than a point. How much of what is " +
      "there does it actually receive?",
    about: "what a body is open to",
  },
  {
    id: "vacuum.crowding",
    asks: "the settled density solves the making against the taking WITH NOTHING IN IT. What " +
      "does the same balance give where a body's own carriers are also being met?",
    about: "\\rho at R",
  },
  {
    id: "gravity.arrivals",
    asks: "what does a body actually have DELIVERED to it - rays absorbed and meetings had?",
    about: "g_{N} in full",
  },
  {
    id: "gravity.full",
    asks: "put the pieces together. What is the gravitational force between two bodies R " +
      "apart, with every factor written in?",
    about: "F_{g} as one equation in full",
    also: "F_{g} in full",
    leads: REC, then: SOLVED,
  },
  {
    id: "space.recession",
    asks: "the vacuum makes space wherever it is idle. What does that do to two things " +
      "sitting some distance apart?",
    about: "recession",
  },
  {
    id: "gravity.expansion",
    asks: "a body makes less space where it sits. What does that do to how fast two of them " +
      "are carried apart - and is THAT the attraction?",
    about: "the deficit in recession",
  },
  {
    id: "gravity.sign",
    asks: "two channels could in principle oppose. Can anything a body does make this law " +
      "push rather than pull - a second body moving away, for instance?",
    about: "the sign of the force",
  },
  {
    id: "rotation.curve",
    asks: "a body goes round at a radius. What speed does the circle need - and what decides " +
      "whether that speed falls off or does not?",
    about: "v^{2} as one equation in full",
    also: "v^{2} in full",
    leads: REC, then: SOLVED,
  },
  {
    id: "galaxy.point",
    asks: "a galaxy taken as ONE source, the whole of its mass presenting one face. What does " +
      "it send, and what curve does that give?",
    about: "v^{2} with the mass gathered as one equation in full",
    also: "v^{2} with the mass gathered in full",
    leads: REC, then: SOLVED,
  },
  {
    id: "galaxy.many",
    asks: "and the same galaxy taken as its stars, each thin enough to send all of itself. " +
      "Why is that not the same answer?",
    about: "v^{2} with the mass scattered as one equation in full",
    also: "v^{2} with the mass scattered in full",
    leads: REC, then: SOLVED,
  },
  {
    id: "rotation.keplerian",
    asks: "where what arrives is far above the scale, what does the curve do?",
    about: "v^{2} where the arrival dominates in full",
  },
  {
    id: "rotation.flat",
    asks: "and where the scale is far above what arrives - why does the radius drop out?",
    about: "v^{2} where the scale dominates in full",
  },
  {
    id: "gravity.newton",
    asks: "the law is written with the dimension as a symbol. Put three in - what is the " +
      "force between two bodies in the world we live in?",
    about: "F_{g} at D = 3 as one equation",
    also: "F_{g} at D = 3",
    leads: REC, then: SOLVED,
  },
  {
    id: "lattice.counting",
    asks: "a body has a size, so the same counting that says how far away something is has " +
      "to say how big it is. What are the two counts?",
    about: "l.ball(R).count",
  },
  {
    id: "gravity.mass",
    asks: "a source says how often it announces itself and how big it is, and nothing else. " +
      "What is it worth to everything around it?",
    about: "\\bar{m}\\paren{R}",
  },
  {
    id: "gravity.saturation",
    asks: "and for a body far bigger than the distance one of its rays gets - what does it " +
      "come to per unit of its own face, as R goes to infinity?",
    about: "\\bar{m}",
    chain: "\\bar{m} solved",
  },
  {
    id: "gravity.metric",
    asks: "light goes at one over the index. What metric is the medium, then?",
    about: "A in r",
  },
];

const groups = THEOREMS.map(t => {
  const t0 = Date.now();
  const q: Asked = { ...t, equation, proof, line };
  const g = group(t.id, [record(q)]);
  const r = g.theories[0].results[0].variants[0];
  const built = Date.now() - t0;
  write(g);
  console.log(`  ${t.id.padEnd(18)} ${String(((Date.now() - t0) / 1000).toFixed(1) + "s").padStart(7)}` +
    ` (build ${(built / 1000).toFixed(1)}s)  ${r.concluded ?? "no law follows"}`);
  return g;
});
console.log(`\n  index at theorems/${writeIndex(groups).split("/").pop()}`);
