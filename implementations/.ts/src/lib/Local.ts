import { Backend } from "./Backend.ts"

export type Vocabulary = {
  Local: unknown
  Ray: unknown
  Boundary: unknown
}

export interface Local<V extends Vocabulary = Base> {
  get backend(): Backend
  get DEG(): number
  get rays(): V["Ray"][]
  create(): V["Ray"]
}
export interface Ray<V extends Vocabulary = Base> {
  get backend(): Backend
  get l(): V["Local"]
  get boundaries(): V["Boundary"][]
  delete(): void
}
export interface Boundary<V extends Vocabulary = Base> {
  get backend(): Backend
  get source(): V["Ray"]
  get target(): V["Boundary"]
  link(to: V["Boundary"]): void
  collapse(): void
}

export type Vocab<L = {}, R = {}, B = {}> = {
  Local: Local<Vocab<L, R, B>> & L
  Ray: Ray<Vocab<L, R, B>> & R
  Boundary: Boundary<Vocab<L, R, B>> & B
}
export type Base = Vocab

export type Global<V extends Vocabulary = Base> = Local<V> & {
  get name(): string
}

export const global = (name: string, backend: Backend, DEG: number): Global => {
  const l = backend.rewrite.local();
  backend.rewrite.flush();
  for (let i = 0; i < DEG / 2; i++) backend.rewrite.ray(l);
  backend.rewrite.flush();
  for (const r of l.rays) r.boundaries[0].link(r.boundaries[1]);
  backend.rewrite.flush();
  return Object.defineProperty(l, "name", { value: name }) as Global;
}

export type Vec = number[]

export type Geometry = {
  get name(): string
  get exits(): Vec[]
  get D(): number
  get DEG(): number
  seed(backend: Backend, N: number): Backend
}

const leading = (e: Vec) => e[e.findIndex(x => x !== 0)]

export const geometry = (name: string, exits: Vec[]): Geometry => ({
  get name() { return name },
  get exits() { return exits },
  get D() { return exits[0].length },
  get DEG() { return exits.length },

  seed(backend, N) {
    const w = backend.rewrite, D = this.D, size = N ** D;
    const locals = Array.from({ length: size }, () => w.local());
    w.flush();

    const at = (i: number) => Array.from({ length: D }, (_, k) => Math.floor(i / N ** k) % N);
    const index = (c: Vec) => c.reduce((i, x, k) => i + ((x % N + N) % N) * N ** k, 0);

    for (let i = 0; i < size; i++)
      for (const e of exits) {
        if (leading(e) < 0) continue;
        const there = locals[index(at(i).map((x, k) => x + e[k]))];
        const a = w.ray(locals[i]), b = w.ray(there);
        w.flush();
        a.boundaries[0].link(b.boundaries[0]);
        w.flush();
      }
    return backend;
  },
})

const cube = (D: number): Vec[] => {
  const out: Vec[] = [];
  const walk = (v: Vec) => v.length === D
    ? (v.some(x => x !== 0) && out.push([...v]))
    : [-1, 0, 1].forEach(x => walk([...v, x]));
  walk([]);
  return out;
}
const spread = (v: Vec) => v.filter(x => x !== 0).length;

export const GEOMETRIES: Record<string, Geometry> = {
  "line-2": geometry("line-2", [[1], [-1]]),
  "square-4": geometry("square-4", cube(2).filter(v => spread(v) === 1)),
  "square-8": geometry("square-8", cube(2)),
  "cubic-6": geometry("cubic-6", cube(3).filter(v => spread(v) === 1)),
  "bcc-8": geometry("bcc-8", cube(3).filter(v => spread(v) === 3)),
  "fcc-12": geometry("fcc-12", cube(3).filter(v => spread(v) === 2)),
  "cubic-18": geometry("cubic-18", cube(3).filter(v => spread(v) <= 2)),
  "cubic-26": geometry("cubic-26", cube(3)),
}

export type Ref = "Local" | "Ray" | "Boundary"
export type Ref2 = Local | Ray | Boundary

export const kind = (ref: any): Ref =>
  "target" in ref ? "Boundary" : "boundaries" in ref ? "Ray" : "Local"

export const base = {
  Local: (backend: Backend) => ({
    backend,
    get rays() { return backend.children(this as unknown as Local) as Ray[] },
    get DEG() {
      return this.rays.reduce((n, r) =>
        n + r.boundaries.filter(b => b.target !== undefined).length, 0);
    },
    create(this: Local) { return backend.rewrite.ray(this) },
  }),
  Ray: (backend: Backend) => ({
    backend,
    get l() { return backend.parent(this as unknown as Ray) as Local },
    get boundaries() { return backend.children(this as unknown as Ray) as Boundary[] },
    delete(this: Ray) { backend.rewrite.delete(this) },
  }),
  Boundary: (backend: Backend) => ({
    backend,
    get source() { return backend.parent(this as unknown as Boundary) as Ray },
    get target() { return backend.target(this as unknown as Boundary) as Boundary },
    link(this: Boundary, to: Boundary) { backend.rewrite.link(this, to) },
    collapse(this: Boundary) { backend.rewrite.collapse(this) },
  }),
}
