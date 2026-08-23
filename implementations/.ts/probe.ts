import { G_XOR_2 } from "./src/theories/G^XOR*2.ts";

const N = 15, T = 60;
for (const interior of [0, 0.25, 1]) {
  const w: any = G_XOR_2.seed({ N, seed: 1, interior, escape: 0 } as any);
  const b: any = w.backend;
  for (let t = 0; t < T; t++) w.tick();
  const two: any = w.layers.MATTER;

  const inside = new Set<number>();
  for (const l of two.backend as Iterable<any>) inside.add((l as any).i);

  let pts = 0, ways = 0, waysInside = 0, isolated = 0;
  const degHist = new Map<number, number>();
  for (const l of two.backend as Iterable<any>) {
    pts++;
    let d = 0, di = 0;
    for (const r of l.rays) for (const bd of r.boundaries) {
      const there = bd.target?.source?.l;
      if (there === undefined || there === l) continue;
      d++;
      if (inside.has((there as any).i)) di++;
    }
    ways += d; waysInside += di;
    if (di === 0) isolated++;
    degHist.set(di, (degHist.get(di) ?? 0) + 1);
  }
  const hist = [...degHist.entries()].sort((a, c) => a[0] - c[0])
    .slice(0, 6).map(([k, n]) => `${k}:${n}`).join(" ");
  console.log(`interior=${String(interior).padEnd(5)} folded=${String(pts).padStart(5)}` +
    ` ways/pt=${(ways / pts).toFixed(2)}  ways-INSIDE/pt=${(waysInside / pts).toFixed(3)}` +
    `  isolated=${isolated}/${pts} (${(100 * isolated / pts).toFixed(1)}%)` +
    `\n   inside-degree histogram: ${hist}`);
}
