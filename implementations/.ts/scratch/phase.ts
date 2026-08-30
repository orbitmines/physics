/**
 * DOES A CARRIER'S SURVIVAL DEPEND ON ITS PHASE AGAINST THE VACUUM?
 *
 * `probes/survival.ts` derives the range from the annihilation rule under one stated
 * assumption: "whether a partner is present is not correlated with whether the carrier
 * is - the standard kinetic assumption ... it is one line". This measures whether that
 * line holds. The rule kills on `mine !== theirs` and lets ALIKE pairs through to turn,
 * so a carrier that keeps meeting its own sign is never killed at all, and the 2-cell
 * mean free path is a statement about an UNCORRELATED carrier and not about every one.
 *
 * The ray is marked with `from`, which is CARRIED, so it is followed rather than guessed
 * at - the identity problem `tests/steering.ts` documents.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR } from "../src/theories/G^XOR.ts";

const MARK = 999;

const flight = (o: { geom: string; N: number; warm: number; T: number;
  polarity: number | undefined; phase: number }) => {
  const g: any = (GEOMETRIES as any)[o.geom];
  const C = (o.N - 1) / 2;
  const w: any = new World({ theory: G_XOR, geometry: g, N: o.N, seed: 1,
    boundary: "absorb", slotUniformRng: true } as any);
  /* the vacuum is let run first, then the carrier is lit on a chosen tick of its beat */
  for (let t = 0; t < o.warm + o.phase; t++) w.tick();

  let seat: any;
  for (const l of w.locals) { const at = w.embedding.at(l as any);
    if (at && at[0] === C && at[1] === C && at[2] === C) { seat = l; break; } }
  /* launch along +x, or whichever exit exists */
  const d = g.exits.findIndex((v: number[]) => v[0] === 1 && v[1] === 0 && v[2] === 0);
  const r: any = seat.rays[d];
  r.active = true; r.polarity = o.polarity; r.charge = undefined; r.from = MARK;

  let far = 0, alive = 0;
  for (let t = 0; t < o.T; t++) {
    w.tick();
    let found = false;
    for (const l of w.locals) {
      for (const ry of (l as any).rays) {
        /* `active` alternates with `arriving` while a ray is in transit, so presence is
         * the MARK and not the flag - reading the flag reports every carrier dead on the
         * tick it happens to be mid-step */
        if (ry.from !== MARK) continue;
        const at = w.embedding.at(l as any);
        if (at) far = Math.max(far, Math.hypot(at[0]-C, at[1]-C, at[2]-C));
        found = true; break;
      }
      if (found) break;
    }
    if (!found) break;
    alive++;
  }
  return { far, alive };
};

const N = 31, warm = 10, T = 80;
console.log(`G^XOR  ${process.argv[2] ?? "cubic-6"}  N=${N} warm=${warm}`);
console.log("phase  polarity=+1        polarity=-1        unsigned");
for (let phase = 0; phase < 16; phase++) {
  const row = [1, -1, undefined].map(p =>
    flight({ geom: process.argv[2] ?? "cubic-6", N, warm, T, polarity: p, phase }));
  console.log(String(phase).padStart(4),
    ...row.map(r => `far=${r.far.toFixed(1)} alive=${r.alive}`.padEnd(19)));
}
