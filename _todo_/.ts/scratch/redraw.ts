/**
 * THE PICTURES, REMADE FROM THE DUMPS - so a rendering decision never costs a run again.
 *
 * Every run writes its fields beside its images, and this reads those fields back. Nothing here
 * touches the model; it is the same numbers the run produced, drawn differently. That is the
 * whole point of dumping them: the four hundred ticks are spent once and the framing, the masks
 * and the colour can be argued about afterwards for the price of a few seconds.
 *
 * The HD cuts are the fine output grid (160 cells across four units, 0.025 a cell) rather than
 * the physics grid the mean field needs (64 across sixteen). The model is continuous and the
 * particle positions are continuous, so the resolution of a picture of them is a choice, not a
 * property of the simulation - and at the physics grid's 0.25 a cell every radial feature in
 * this object is one or two cells wide.
 */
import { readFileSync, existsSync } from "node:fs";
import { cut } from "./render.ts";

const dir = "/home/fadi/Desktop/orbitmines/physics/visuals/vacuum/hydro";
const TAG = process.argv[2];
const RMAX = Number(process.argv[3] ?? 1.9);
const MASK = Number(process.argv[4] ?? 0.05);

const meta = JSON.parse(readFileSync(`${dir}/${TAG}.json`, "utf8"));
const NO: number = meta.NO, LOUT: number = meta.LOUT;

for (const [nm, signed] of [["den",false],["bal",false],["pol",true],["chg",true],
                            ["added",true]] as [string,boolean][]) {
  const f = `${dir}/${TAG}-${nm}.f32`;
  if (!existsSync(f)) { console.log(`  ${nm}: no dump`); continue; }
  const raw = new Float32Array(readFileSync(f).buffer.slice(0));
  if (raw.length !== NO*NO*NO) { console.log(`  ${nm}: ${raw.length} floats, not ${NO}^3`); continue; }
  cut(dir, `${TAG}-${nm}-HD`, Float64Array.from(raw), NO, LOUT, RMAX, signed, MASK);
  console.log(`  ${nm}-HD`);
}
console.log(`${TAG}  ${NO}^3 over ${LOUT}  frame ${RMAX}  mask ${MASK}`);
