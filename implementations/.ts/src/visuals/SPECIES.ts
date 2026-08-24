/**
 * EVERY DISTINCT STRUCTURE THE INTERIOR MAKES, DRAWN — the species of Layer 2.
 *
 * WHAT A STRUCTURE IS HERE, since it is not what it looks like on the lattice. Ninety-odd
 * per cent of the settled graph is 2-valent points, which reads as degree collapse until
 * you ask what a 2-valent point IS: a SUBDIVISION, a bead left standing on an edge where
 * (G+M/3) fired. So the real vertices are the full-degree points, an EDGE is a chain of
 * beads between two of them, and the chain carries a TWIST — the sign of the meeting that
 * put the beads there, since a deflection fires only where two charges AGREE. Contract the
 * chains and the lattice is a ribbon graph: a graph, a cyclic order at each node, and a
 * twist per edge. That is the object `Ribbon.ts` has always described and never been
 * handed by the dynamics.
 *
 * SO THIS DRAWS WHAT THE RULES MAKE, NOT WHAT A STRUCTURE WAS ASSUMED TO BE. Each panel
 * is one distinct species — one combination of sidedness, Euler characteristic, first
 * Betti number, and face profile — with how many times it was seen over the run. The
 * invariants are integers and none of them is chosen.
 *
 * READ THE PANELS THIS WAY. A ring is the vertices of the component; a line between two
 * of them is an edge; the small marks along it are the beads, so a long chain is an edge
 * a great deal of deflection went into. A DASHED edge is TWISTED. A component with any
 * odd cycle of twists is ONE-SIDED — the belt-trick condition, and the one candidate here
 * for a fermion — and its ring is drawn in the second colour.
 */

import { Painter, Surface, visual } from "./CANVAS.ts";
import { G_XOR_2 } from "../theories/G^XOR*2.ts";
import { Graph } from "../backends/CPU.graph.ts";
import { GEOMETRIES, outward } from "../lib/Local.ts";
import { Edge, Ribbon, allOrbits, oneSided } from "../lib/Ribbon.ts";

const BACK = "#08090d";
const INK = "#e6e8ef";
const FAINT = "#5a5f6e";
const TWO = "#6ea8fe";      // two-sided
const ONE = "#ffb35c";      // one-sided — a cycle of twists no gauge removes
const BEAD = "#8a8f9e";

const g: any = GEOMETRIES["fcc-12"], DEG = g.DEG;
const N = 17, BOUND = 2_000_000, TICKS = 300, EVERY = 20;

type Species = {
  one: boolean; chi: number; b1: number; V: number; E: number; F: number;
  faces: number[]; beads: number; count: number;
  edges: [number, number][]; twist: number[]; bead: number[];
};

/** the ribbon the lattice is carrying, with the bead chains contracted to edges */
const ribbonOf = (b: any) => {
  const isV = (l: any) => (l.rays as any[]).length >= DEG;
  const id = new Map<number, number>(); const verts: any[] = [];
  for (const l of b as Iterable<any>) if (isV(l)) { id.set((l as any).i, verts.length); verts.push(l); }
  const chain = (from: any, d: number) => {
    let cur: any = from, exit = d, tw = 1, beads = 0;
    for (let h = 0; h < 8192; h++) {
      const ray = (cur.rays as any[])[exit]; if (!ray) return null;
      const facing = outward(ray)?.target?.source;
      const there: any = facing && (facing as any).l;
      if (!there || b.parent(there) !== undefined) return null;
      const idx = (there.rays as any[]).indexOf(facing); if (idx < 0) return null;
      if (isV(there)) return { to: there, arrive: idx, tw, beads };
      beads++; if ((there.twist ?? 0) < 0) tw = -tw;
      const o = there.rays as any[]; if (o.length !== 2) return null;
      exit = idx === 0 ? 1 : 0; cur = there;
    }
    return null;
  };
  const edges: Edge[] = [], twist: number[] = [], beadsOf: number[] = [];
  const slots: [number, number][][] = Array.from({ length: verts.length }, (): [number, number][] => []);
  const taken = new Set<string>();
  for (let v = 0; v < verts.length; v++) for (let d = 0; d < DEG; d++) {
    const k = `${v}:${d}`; if (taken.has(k)) continue;
    const r = chain(verts[v], d); const u = r && id.get((r.to as any).i);
    if (!r || u === undefined) continue;
    const k2 = `${u}:${r.arrive}`; if (taken.has(k2)) continue;
    const e = edges.length;
    edges.push([v, u]); twist.push(r.tw < 0 ? 1 : 0); beadsOf.push(r.beads);
    taken.add(k); taken.add(k2);
    slots[v].push([d, 2 * e]); slots[u].push([r.arrive, 2 * e + 1]);
  }
  const tail: number[] = [], head: number[] = [];
  edges.forEach(([u, v], e) => { tail[2*e]=u; head[2*e]=v; tail[2*e+1]=v; head[2*e+1]=u; });
  const rot = slots.map(l => l.sort((a, c) => a[0] - c[0]).map(([, dd]) => dd));
  return { R: { V: verts.length, edges, twist, rot, tail, head } as Ribbon, beadsOf };
};

/** every component of it, as a species key and its drawable graph */
const harvest = (b: any, into: Map<string, Species>) => {
  const { R, beadsOf } = ribbonOf(b);
  if (!R.V) return;
  const owner = new Array<number>(R.V).fill(-1);
  const adj: number[][] = Array.from({ length: R.V }, (): number[] => []);
  R.edges.forEach(([u, v]) => { adj[u].push(v); adj[v].push(u); });
  let c = 0;
  for (let r = 0; r < R.V; r++) {
    if (owner[r] >= 0) continue;
    const st = [r]; owner[r] = c;
    while (st.length) { const u = st.pop()!; for (const v of adj[u]) if (owner[v] < 0) { owner[v] = c; st.push(v); } }
    c++;
  }
  const faces: number[][] = Array.from({ length: c }, (): number[] => []);
  for (const o of allOrbits(R)) faces[owner[R.tail[o.darts[0]]]].push(o.len);
  const eOf: number[][] = Array.from({ length: c }, (): number[] => []);
  R.edges.forEach(([u], e) => eOf[owner[u]].push(e));
  const vOf: number[][] = Array.from({ length: c }, (): number[] => []);
  for (let v = 0; v < R.V; v++) vOf[owner[v]].push(v);

  for (let k = 0; k < c; k++) {
    const V = vOf[k].length, E = eOf[k].length, F = faces[k].length;
    /* the bulk phase is not a species — it is the rest of the world */
    if (V > 24) continue;
    const alive = R.edges.map(() => false); for (const e of eOf[k]) alive[e] = true;
    const one = oneSided(R.V, R.edges, R.twist, alive);
    const chi = V - E + F, b1 = E - V + 1;
    const fs = faces[k].slice().sort((a, z) => z - a);
    const key = `${one ? 1 : 2}|${chi}|${b1}|${V}|${E}|${fs.join(".")}`;
    const got = into.get(key);
    if (got) { got.count++; continue; }
    const idx = new Map(vOf[k].map((v, i) => [v, i]));
    into.set(key, {
      one, chi, b1, V, E, F, faces: fs, count: 1,
      beads: eOf[k].reduce((a, e) => a + beadsOf[e], 0),
      edges: eOf[k].map(e => [idx.get(R.edges[e][0])!, idx.get(R.edges[e][1])!] as [number, number]),
      twist: eOf[k].map(e => R.twist[e]),
      bead: eOf[k].map(e => beadsOf[e]),
    });
  }
};

const paint = (): Painter => {
  let w: any = null, b: any = null, t = 0;
  const found = new Map<string, Species>();
  let list: Species[] = [];

  return {
    /*
     * THE RUN IS THE WARM-UP. Three hundred ticks of a 17³ box is minutes, and doing it
     * inside `start` gives the renderer one blocking call with no way to say how far
     * along it is — which headless is indistinguishable from a hang.
     */
    warm(budgetMs: number) {
      if (!w) {
        const backend = g.seed(new Graph(G_XOR_2 as any, 1, BOUND, DEG * 2, true, true, true, true), N);
        w = G_XOR_2.seed({ N, seed: 1, geometry: g, bound: BOUND, backend } as any);
        b = w.backend;
      }
      const until = Date.now() + budgetMs;
      while (t < TICKS && Date.now() < until) {
        w.tick(); t++;
        if (t % EVERY === 0) harvest(b, found);
      }
      if (t >= TICKS) {
        list = [...found.values()].sort((a, z) => z.count - a.count || a.V - z.V);
        return 1;
      }
      return t / TICKS;
    },

    frame({ ctx, width, height }: Surface) {
      ctx.fillStyle = BACK; ctx.fillRect(0, 0, width, height);
      ctx.textBaseline = "alphabetic";

      const M = 34, TOP = 96;
      ctx.fillStyle = INK;
      ctx.font = "600 25px ui-sans-serif, system-ui, sans-serif";
      ctx.fillText("The species of Layer 2", M, 46);
      ctx.fillStyle = FAINT;
      ctx.font = "14px ui-sans-serif, system-ui, sans-serif";
      ctx.fillText(
        `every distinct structure the interior made over ${TICKS} ticks of a ${N}³ box · ` +
        `ring = vertices · marks along an edge = beads, where (G+M/3) fired · ` +
        `dashed = twisted · orange = one-sided`, M, 70);

      const cols = 5, cellW = (width - 2 * M) / cols;
      const rows = Math.max(1, Math.ceil(list.length / cols));
      const cellH = Math.min(196, (height - TOP - M) / rows);

      list.forEach((s, i) => {
        const cx = M + (i % cols) * cellW + cellW / 2;
        const cy = TOP + Math.floor(i / cols) * cellH + cellH / 2 - 12;
        const R = Math.min(cellW, cellH) * 0.27;
        const tone = s.one ? ONE : TWO;

        /* the vertices, on a ring — a layout that is the same every run */
        const at = (k: number) => {
          if (s.V === 1) return [cx, cy] as const;
          const a = -Math.PI / 2 + (2 * Math.PI * k) / s.V;
          return [cx + R * Math.cos(a), cy + R * Math.sin(a)] as const;
        };

        /* edges, with parallel ones bowed apart so a 2-gon reads as two edges */
        const seen = new Map<string, number>();
        s.edges.forEach(([u, v], e) => {
          const kk = u < v ? `${u}-${v}` : `${v}-${u}`;
          const n = seen.get(kk) ?? 0; seen.set(kk, n + 1);
          const [x1, y1] = at(u), [x2, y2] = at(v);
          const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
          let nx = -(y2 - y1), ny = x2 - x1;
          const len = Math.hypot(nx, ny) || 1;
          const bow = (u === v ? 34 : (n % 2 ? 1 : -1) * Math.ceil(n / 2) * 15);
          nx = nx / len * bow; ny = ny / len * bow;
          const qx = mx + nx, qy = my + ny;

          ctx.strokeStyle = tone;
          ctx.lineWidth = s.twist[e] ? 2 : 1.3;
          ctx.setLineDash(s.twist[e] ? [4, 3] : []);
          ctx.beginPath();
          if (u === v) { ctx.arc(x1, y1 - 15, 14, 0, Math.PI * 2); }
          else { ctx.moveTo(x1, y1); ctx.quadraticCurveTo(qx, qy, x2, y2); }
          ctx.stroke();
          ctx.setLineDash([]);

          /* the beads: how much deflection is buried in this edge */
          const nb = Math.min(s.bead[e], 9);
          ctx.fillStyle = BEAD;
          for (let k = 1; k <= nb; k++) {
            const p = k / (nb + 1), q = 1 - p;
            const bx = q * q * x1 + 2 * q * p * qx + p * p * x2;
            const by = q * q * y1 + 2 * q * p * qy + p * p * y2;
            ctx.beginPath(); ctx.arc(bx, by, 1.7, 0, Math.PI * 2); ctx.fill();
          }
        });

        for (let k = 0; k < s.V; k++) {
          const [x, y] = at(k);
          ctx.fillStyle = BACK; ctx.beginPath(); ctx.arc(x, y, 5.2, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = tone; ctx.beginPath(); ctx.arc(x, y, 3.4, 0, Math.PI * 2); ctx.fill();
        }

        const base = cy + Math.min(cellW, cellH) * 0.40;
        ctx.textAlign = "center";
        ctx.fillStyle = INK;
        ctx.font = "600 12px ui-monospace, SFMono-Regular, Menlo, monospace";
        ctx.fillText(`${s.one ? "one" : "two"}-sided   χ=${s.chi}   b₁=${s.b1}`, cx, base);
        ctx.fillStyle = FAINT;
        ctx.font = "11px ui-monospace, SFMono-Regular, Menlo, monospace";
        ctx.fillText(`V ${s.V}  E ${s.E}  F ${s.F}  beads ${s.beads}`, cx, base + 15);
        ctx.fillText(`seen ${s.count}×   faces ${s.faces.slice(0, 3).join(",") || "—"}`, cx, base + 29);
        ctx.textAlign = "left";
      });

      if (!list.length) {
        ctx.fillStyle = FAINT;
        ctx.font = "14px ui-sans-serif, system-ui, sans-serif";
        ctx.fillText("no structure — the interior made nothing this run", M, TOP + 40);
      }
    },
  };
};

export default [visual({
  id: "species",
  what: "every distinct ribbon structure the interior of G^XOR*2 makes, with its invariants",
  width: 1360,
  height: 900,
  frames: 1,
  paint,
})];
