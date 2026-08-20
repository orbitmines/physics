import { Backend } from "../lib/Backend.ts";
import { GEOMETRIES, Geometry, Global, global, opposite, outward } from "../lib/Local.ts";
import { acting, Embedding, embedding, Source, SourceSpec } from "../lib/Source.ts";
import { method, Theory } from "../lib/Theory.ts";
import { Graph } from "../backends/CPU.graph.ts";


export const G = new Theory()
  /*
   * THE CHANNELS, AS DECORATIONS. In the article these are parallel arrays allocated
   * per theory; here a per-ray quantity is a property, which is the same thing said in
   * this vocabulary — and a theory that does not declare one cannot read it by mistake.
   */
  .decorate.Ray<{
    active: boolean
    arriving?: boolean
    bounced?: boolean
    /** how many times this ray has been deflected — what `scattering` averages, and
     *  the diagnostic that says whether a null result is a result or a vacuum that
     *  never scattered in the first place */
    turns: number
    /** ticks in flight */
    age: number
    /** which source it came from, or −1 for the vacuum's own */
    from: number
  }>(self => ({
    active: false,
    turns: 0,
    age: 0,
    from: -1,
  }))

  /** what has been destroyed at a local, and what has turned there */
  .decorate.Local<{
    destroyed: number
    turned: number
  }>(self => ({
    destroyed: 0,
    turned: 0,
  }))

  .decorate.World<{
    vacuum: number | null
    geometry: Geometry
    N: number
    seed: number
    bound: number
  }>(self => ({
    vacuum: 0,
    geometry: GEOMETRIES["fcc-12"],
    N: 1,
    seed: 0,
    bound: () => self.N ** self.geometry.D,
  }))

  .decorate.Local<{
    source?: Source
  }>(self => ({}))

  .decorate.World<{
    global: Global
    backend: Backend
  }>(self => {
    let assumed: Global, laid: Backend;
    return {
      global: () => assumed ??= global(self.geometry, new Graph(self.theory)),
      backend: () => laid ??= self.geometry.seed(new Graph(self.theory, self.seed, self.bound, self.geometry.DEG * 2), self.N),
    };
  })

  .decorate.World<{
    sources: Source[]
    embedding: Embedding
    add(spec: SourceSpec): Source
  }>(self => {
    const sources: Source[] = [];
    let laid: Embedding;
    return {
      sources,
      embedding: () => laid ??= embedding(self.backend.sample()),
      add: method((spec: SourceSpec): Source => {
        const s: Source = {
          id: sources.length, emits: 1, absorbs: true, collides: true, moves: false,
          duty: 1, dwellTicks: 1, period: 1, phase: 0, u: [],
          locals: [], absorbed: [], emitted: [], arrivals: 0, ...spec,
        };
        sources.push(s);
        for (const l of self.embedding.within(spec.at, spec.radius ?? 0)) {
          (l as any).source = s;
          s.locals.push(l);
        }
        return s;
      }),
    };
  })

  .rule("EMISSION", "Local", (l) => {
    const s = l.source;
    if (!s) return;
    const w = l.world;
    const toward = (r: any) => {
      const there = r.boundaries.find((b: any) => b.target?.source?.l && b.target.source.l !== l)
        ?.target?.source?.l;
      return there ? w.embedding.toward(l, there) : undefined;
    };

    /* what arrived, counted BEFORE it is destroyed — a re-emit would erase it */
    if (s.absorbs) for (const r of l.rays) {
      if (!r.active) continue;
      s.arrivals++;
      const d = toward(r);
      if (d) s.absorbed = d.map((x: number, i: number) => (s.absorbed[i] ?? 0) + x);
    }

    /* the duty cycle: a heavy source does not act every tick */
    if (!acting(s, w.ticks)) {
      if (s.absorbs) for (const r of l.rays) r.active = false;
      return;
    }

    for (const r of l.rays) {
      const d = toward(r);
      if (d) s.emitted = d.map((x: number, i: number) => (s.emitted[i] ?? 0) + x);
      r.active = true;
    }
  })

  .rule("CREATION", "Local", (l) => {
    if (l.source) return;
    if (l.rays.some(r => r.active)) return;
    l.unfold();
    for (const r of l.rays) r.active = true;
  })

  .rule("MOVEMENT", "Ray", (r) => {
    if (!r.active || r.l.source) return;
    const from = r.bounced ? opposite(r) : r;
    const facing = outward(from)?.target?.source;
    const to = facing && opposite(facing);
    if (to) to.arriving = true;
  })

  .rule("ARRIVAL", "Ray", (r) => {
    r.active = r.arriving === true;
    r.arriving = undefined;
    r.bounced = false;
  })

  .rule("ANNIHILATION", ["Boundary", "Boundary"], (a, b) => {
    const [x, y] = [a.source, b.source];
    if (x.l === y.l) return;
    if (x.l.source?.collides === false || y.l.source?.collides === false) return;
    if (!x.active || !y.active) return;
    x.active = false;
    y.active = false;
    x.backend.stats.annihilations++;
    /* credited half to each end of the edge the event happened on, which is what a
     * force is read off — see `pullChannel` */
    x.l.destroyed += 0.5;
    y.l.destroyed += 0.5;
    x.l.fold(y.l);
  });
