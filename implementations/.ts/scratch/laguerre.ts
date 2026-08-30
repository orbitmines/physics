/**
 * DOES THE PREDICTED PULSE PRODUCE THE PREDICTED SHAPE? - the test, with the answer stated
 * before it is run so it cannot be read into agreement.
 *
 * Radius is retarded time, so a source handed R_nl(t) as its emission history should lay down
 * R_nl(r) in space. The claim is falsifiable in a way that needs no scale: the nodes of 3s sit
 * at rho = 3 +/- sqrt(3), whose RATIO is 2 + sqrt(3) = 3.7321 - a pure number, the same at
 * every a0. So what is checked is where the measured profile changes sign, and whether the two
 * radii it happens at stand in that ratio.
 */
import { GEOMETRIES } from "../src/lib/Local.ts";
import { World } from "../src/lib/DISCRETE.ts";
import { G_XOR_XOR } from "../src/theories/G^XOR+XOR.ts";

const lag = (k: number, a: number, x: number): number => {
  if (k === 0) return 1;
  if (k === 1) return 1 + a - x;
  let Lm = 1, L = 1 + a - x;
  for (let i = 1; i < k; i++) { const Ln = ((2*i + 1 + a - x)*L - (i + a)*Lm)/(i + 1);
    Lm = L; L = Ln; }
  return L;
};
const Rnl = (n: number, l: number, a0: number, r: number) => {
  const rho = 2*r/(n*a0);
  return Math.pow(rho, l) * Math.exp(-rho/2) * lag(n-l-1, 2*l+1, rho);
};

const schedule = (n: number, l: number, a0: number, len: number) => {
  const raw = Array.from({ length: len }, (_, t) => Rnl(n, l, a0, t));
  const hi = Math.max(...raw.map(Math.abs)) || 1;
  return { sign: raw.map(v => (v >= 0 ? 1 : -1)),
           duty: raw.map(v => Math.min(1, Math.abs(v)/hi)) };
};

const GEOM = "fcc-12", N = 25, C = 12, WARM = 10, TICKS = 140;

const profile = (n: number, l: number, a0: number, len: number, seed: number, src: boolean) => {
  const g: any = (GEOMETRIES as any)[GEOM];
  const w: any = new World({ theory: G_XOR_XOR, geometry: g, N, seed,
    boundary: "absorb", slotUniformRng: true } as any);
  w.world.turnLog = [];
  if (src) w.add({ at: [C,C,C], radius: 1, emits: 1, period: 1, dwellTicks: 1,
    pulse: schedule(n, l, a0, len), absorbs: true } as any);
  for (let t = 0; t < WARM; t++) w.tick();
  const q = new Float64Array(12), cnt = new Float64Array(12);
  for (let t = 0; t < TICKS; t++) {
    w.tick();
    for (const li of w.locals) {
      const at = w.embedding.at(li as any); if (!at) continue;
      const rr = Math.round(Math.hypot(at[0]-C, at[1]-C, at[2]-C));
      if (rr < 1 || rr > 11) continue;
      let v = 0;
      for (const ry of (li as any).rays) if (ry.active) v += ry.charge ?? 0;
      q[rr] += v; cnt[rr]++;
    }
  }
  return Array.from(q, (v, i) => cnt[i] ? v/cnt[i] : 0);
};

const SEEDS = 4;
for (const [n, l, a0, len] of [[3,0,1,24] as const, [3,0,2,42] as const,
                               [2,0,2,28] as const]) {
  const want = [] as number[];
  for (let r = 0.5; r < 11; r += 0.01) {
    const A = Rnl(n, l, a0, r), B = Rnl(n, l, a0, r + 0.01);
    if (A * B < 0) want.push(Math.round((r + 0.005) * 100) / 100);
  }
  const rows: number[][] = [];
  for (let s = 1; s <= SEEDS; s++) {
    const a = profile(n, l, a0, len, s, true);
    const b = profile(n, l, a0, len, s, false);
    rows.push(a.map((v, i) => v - b[i]));
  }
  const mean = (i: number) => rows.reduce((x, r) => x + r[i], 0)/rows.length;
  const sem = (i: number) => {
    const m = mean(i);
    return Math.sqrt(rows.reduce((x, r) => x + (r[i]-m)**2, 0)/(rows.length-1))
      / Math.sqrt(rows.length);
  };
  console.log(`\nn=${n} l=${l} a0=${a0}  — predicted nodes at r = ${want.join(", ")}` +
    (want.length > 1 ? `  ratio ${(want[1]/want[0]).toFixed(3)} (want 3.732)` : ""));
  console.log("  r   charge(source - control)      sign");
  const signs: number[] = [];
  for (let r = 1; r <= 11; r++) {
    const m = mean(r), e = sem(r);
    signs.push(Math.sign(m));
    console.log(`  ${String(r).padStart(2)}   ${(m>=0?"+":"")}${m.toFixed(4)} ± ${e.toFixed(4)}` +
      `${Math.abs(m) > 2*e ? " *" : "  "}   ${m >= 0 ? "+" : "-"}`);
  }
  const flips: number[] = [];
  for (let i = 1; i < signs.length; i++) if (signs[i] !== signs[i-1]) flips.push(i + 1);
  console.log(`  measured sign changes between r = ${flips.join(", ")}` +
    (flips.length > 1 ? `   ratio ${(flips[1]/flips[0]).toFixed(3)}` : ""));
}
