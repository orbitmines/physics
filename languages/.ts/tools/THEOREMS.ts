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
const THEOREMS: { id: string; asks: string; about: string }[] = [
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
    id: "transport.law",
    asks: "and where the medium is thin, so a carrier spends its ticks making room - what does " +
      "the same conservation give then?",
    about: "n where the medium is thin",
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
    about: "F_{g} in full",
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
    id: "gravity.newton",
    asks: "the law is written with the dimension as a symbol. Put three in - what is the " +
      "force between two bodies in the world we live in?",
    about: "F_{g} at D = 3",
  },
  {
    id: "gravity.metric",
    asks: "light goes at one over the index. What metric is the medium, then?",
    about: "A in r",
  },
];

const groups = THEOREMS.map(t => {
  const q: Asked = { ...t, equation, proof, line };
  const g = group(t.id, [record(q)]);
  const r = g.theories[0].results[0].variants[0];
  console.log(`  ${t.id.padEnd(18)} ${r.concluded ?? "no law follows"}`);
  write(g);
  return g;
});
console.log(`\n  index at theorems/${writeIndex(groups).split("/").pop()}`);
