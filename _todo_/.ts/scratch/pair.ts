/**
 * TWO BODIES, WHICH IS WHAT AN ATOM IS IN THIS MODEL - and every run before this had one.
 *
 * `charge.attraction` gives the coupling between two biased bodies as (1 - P_a·P_b): TWO
 * when one is biased each way, NOUGHT when they are biased alike. A single source has no
 * partner and therefore no coupling at all, so every angular measurement so far was made on
 * a configuration the theorem says is not bound - and then reported as evidence that nothing
 * binds. This puts the pair in.
 *
 * AND THE CONTROL IS THE THEOREM'S OWN. Alike biases give coupling nought, so the ALIKE pair
 * must show whatever the OPPOSED pair shows if the effect is not the coupling. That is a
 * sharper control than "no source", because both arms have the same amount of stuff in the
 * box radiating the same amount - the only difference is the sign law.
 *
 * WHAT IS MEASURED, and the second is the one today's results turn on:
 *
 *   turning      where charges are being bent, which is where matter is
 *   SPLITTING    what fraction of cells took (G/2) - the local occupancy. `G^XOR^o` says a
 *                busy point does not split and that this IS gravity; if a bound pair
 *                suppresses splitting between its bodies, the vacuum THERE is thinner
 *   lifetime     how long a marked carrier lives IN THE GAP against the far field. The
 *                (1/2)^CYCLE law was measured in bulk vacuum; if the gap is thinner, its
 *                base is different there, and orbits would be possible inside matter and
 *                not outside it
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_XOR } from "../src/theories/G^XOR+XOR.ts";

const MARK = 4000;
const GEOM = "fcc-12", N = 21, C = 10, SEP = 3;

type Cfg = "none" | "one" | "opposed" | "alike";

const build = (cfg: Cfg, seed: number) => {
  const g: any = (GEOMETRIES as any)[GEOM];
  const w: any = new World({ theory: G_XOR_XOR, geometry: g, N, seed,
    boundary: "absorb", slotUniformRng: true } as any);
  w.world.turnLog = [];
  const put = (x: number, emits: number) => w.add({ at: [C + x, C, C], radius: 1,
    emits, period: 1, dwellTicks: 1, absorbs: true } as any);
  if (cfg === "one") put(0, 1);
  if (cfg === "opposed") { put(-SEP, 1); put(+SEP, -1); }
  if (cfg === "alike") { put(-SEP, 1); put(+SEP, 1); }
  return { w, g };
};

/** the gap is the cells between the two bodies; the far field is well outside them */
const inGap = (p: number[]) => Math.abs(p[0]) <= SEP - 1 &&
  Math.hypot(p[1], p[2]) <= 2;
const inFar = (p: number[]) => Math.hypot(...p) >= 7 && Math.hypot(...p) <= 9;

const run = (cfg: Cfg, seed: number, T: number, warm: number) => {
  const { w, g } = build(cfg, seed);
  for (let t = 0; t < warm; t++) { w.tick(); w.world.turnLog.length = 0; }

  let splitGap = 0, cellGap = 0, splitFar = 0, cellFar = 0;
  let turnGap = 0, turnFar = 0;
  for (let t = 0; t < T; t++) {
    w.tick();
    for (const l of w.locals) {
      const at = w.embedding.at(l as any); if (!at) continue;
      const p = [at[0]-C, at[1]-C, at[2]-C];
      const gap = inGap(p), far = inFar(p);
      if (!gap && !far) continue;
      /*
       * OCCUPANCY AS ACTIVE RAYS PER CELL, and the flag it replaced never fired.
       * `splitting` is set by G's CREATION, but G^XOR overrides that rule with (G+M/2) and
       * does not set it - so under G^XOR+XOR it is false at every point of every tick and
       * the first version of this measurement read 0.0000 in the far field, where the
       * vacuum is certainly splitting. Occupancy is what `vacuum.occupancy` derives anyway:
       * how much of the lattice is carrying something.
       */
      let act = 0;
      for (const r of (l as any).rays) if (r.active) act++;
      const s = act / (l as any).rays.length;
      if (gap) { splitGap += s; cellGap++; } else { splitFar += s; cellFar++; }
    }
    const log = w.world.turnLog;
    for (let i = 0; i < log.length; i += 6) {
      const l = log[i]; const at = l && w.embedding.at(l); if (!at) continue;
      const p = [at[0]-C, at[1]-C, at[2]-C];
      if (inGap(p)) turnGap++; else if (inFar(p)) turnFar++;
    }
    log.length = 0;
  }
  return {
    splitGap: cellGap ? splitGap / cellGap : 0,
    splitFar: cellFar ? splitFar / cellFar : 0,
    turnGap: turnGap / Math.max(1, T), turnFar: turnFar / Math.max(1, T),
  };
};

/** carriers lit in the gap and in the far field, and how long each lives */
const lives = (cfg: Cfg, seed: number, warm: number) => {
  const { w, g } = build(cfg, seed);
  for (let t = 0; t < warm; t++) { w.tick(); w.world.turnLog.length = 0; }
  const seats: { l: any; gap: boolean }[] = [];
  for (const l of w.locals) {
    const at = w.embedding.at(l as any); if (!at) continue;
    const p = [at[0]-C, at[1]-C, at[2]-C];
    
    if (inGap(p)) seats.push({ l, gap: true });
    else if (inFar(p)) seats.push({ l, gap: false });
  }
  const live = new Map<number, { gap: boolean; alive: number; turned: number }>();
  seats.forEach((s, i) => {
    const r: any = s.l.rays[i % g.DEG]; if (!r) return;
    r.active = true; r.polarity = 1; r.charge = (i % 2) ? 1 : -1;
    r.from = MARK + i; r.gyrophase = 0; r.turned = 0;
    live.set(MARK + i, { gap: s.gap, alive: 0, turned: 0 });
  });
  const done: { gap: boolean; alive: number; turned: number }[] = [];
  for (let t = 0; t < 40 && live.size; t++) {
    w.tick();
    const seen = new Set<number>();
    for (const l of w.locals) for (const ry of (l as any).rays) {
      const f = ry.from;
      if (f === undefined || f < MARK) continue;
      const e = live.get(f); if (!e) continue;
      seen.add(f); e.turned = Math.max(e.turned, ry.turned ?? 0);
    }
    for (const [f, e] of [...live]) {
      if (seen.has(f)) { e.alive++; continue; }
      done.push(e); live.delete(f);
    }
  }
  for (const e of live.values()) done.push(e);
  return done;
};

const SEEDS = 8, T = 40, WARM = 10;
console.log(`${GEOM} N=${N}, bodies at x=±${SEP}, G^XOR+XOR real vacuum, ${SEEDS} seeds\n`);
console.log("config      occupancy gap    occupancy far   ratio    turn/tick gap   turn/tick far");
for (const cfg of ["none", "one", "opposed", "alike"] as Cfg[]) {
  const rs = Array.from({ length: SEEDS }, (_, k) => run(cfg, k + 1, T, WARM));
  const m = (f: (r: any) => number) => rs.reduce((a, r) => a + f(r), 0) / rs.length;
  const sg = m(r => r.splitGap), sf = m(r => r.splitFar);
  console.log(cfg.padEnd(10), sg.toFixed(4).padStart(14), sf.toFixed(4).padStart(16),
    (sg / (sf || 1)).toFixed(3).padStart(9),
    m(r => r.turnGap).toFixed(1).padStart(15), m(r => r.turnFar).toFixed(1).padStart(15));
}

console.log("\nCARRIER LIFETIME, lit in the gap against the far field");
console.log("config     n_gap  alive_gap   n_far  alive_far   ratio   turned_gap  turned_far");
for (const cfg of ["none", "one", "opposed", "alike"] as Cfg[]) {
  const all = Array.from({ length: SEEDS }, (_, k) => lives(cfg, k + 1, WARM)).flat();
  const gap = all.filter(e => e.gap), far = all.filter(e => !e.gap);
  const av = (xs: any[], f: (e: any) => number) =>
    xs.length ? xs.reduce((a, e) => a + f(e), 0) / xs.length : 0;
  const ag = av(gap, e => e.alive), af = av(far, e => e.alive);
  console.log(cfg.padEnd(10), String(gap.length).padStart(5), ag.toFixed(2).padStart(11),
    String(far.length).padStart(7), af.toFixed(2).padStart(11),
    (ag / (af || 1)).toFixed(3).padStart(8),
    av(gap, e => e.turned).toFixed(2).padStart(12),
    av(far, e => e.turned).toFixed(2).padStart(11));
}
