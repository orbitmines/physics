import { Backend } from "../lib/Backend.ts";
import { GEOMETRIES, Geometry, Global, global } from "../lib/Local.ts";
import { Theory } from "../lib/Theory.ts";
import { Graph } from "../backends/CPU.graph.ts";

export const G = new Theory()
  .decorate.Boundary<{
    active: boolean
  }>(self => ({
    active: false
  }))

  .decorate.World<{
    geometry: Geometry
    N: number
  }>(() => ({
    geometry: GEOMETRIES["fcc-12"],
    N: 1,
  }))

  .decorate.World<{
    global: Global
    backend: Backend
  }>(self => {
    let assumed: Global, laid: Backend;
    return {
      global: () => assumed ??= global(self.geometry.name, new Graph(self.theory), self.geometry.DEG),
      backend: () => laid ??= self.geometry.seed(new Graph(self.theory), self.N),
    };
  })

  .rule("ANNIHILATION", ["Boundary", "Boundary"], (a, b) => {
    if (a.active && b.active) a.collapse();
  })

  .rule("CREATION", "Local", (l) => {
    if (!l.rays.some(r => r.boundaries.some(b => b.active))) l.create();
  });
