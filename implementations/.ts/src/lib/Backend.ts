import { Boundary, Local, Ref, Ref2, Vec } from "./Local.ts"
import { Op, Rewrite } from "./Rewrite.ts"
import { Carrying } from "./Theory.ts"

export type Sample = { local: Local; at: Vec }

export type Stats = {
  annihilations: number
  folded: number
  created: number
  /** meetings that TURNED rather than annihilated — (G+M/3), and what `current` reads */
  deflections: number
  /** turns that could not be carried out because the slot they wanted was taken */
  blocked: number
}

export type Backend = Iterable<Local> & {
  size(): number
  /** every local the store is holding, folded away or not — see `Graph.stored` */
  stored?(): number
  get rewrite(): Rewrite
  get rng(): () => number
  get bound(): number
  get DEG(): number
  get grows(): boolean
  get folds(): boolean
  get removes(): boolean
  get expands(): boolean
  get stats(): Stats
  /** what the rays of this world carry — the theory's list, bound to its columns */
  readonly carrying: Carrying[]
  world: any

  create(of: Ref): Ref2
  apply(op: Op): void

  sample(accuracy?: number, from?: Local): Sample[]

  /*
   * WHAT A STORE MAY OFFER A RULE INSTEAD OF A LIST.
   *
   * `children` and the vocabulary's `rays`/`boundaries` hand back arrays, which is right
   * for a rule that reads one and wrong for a question asked of every ref every tick.
   * Where a store can walk its own containment it says so here; where it cannot, the
   * arrays are still correct and the answer is the same one.
   */
  walk?(child: Ref, parent: Ref2, f: (x: any) => void): void
  some?(child: Ref, parent: Ref2, f: (x: any) => boolean): boolean
  first?(child: Ref, parent: Ref2): Ref2 | undefined
  /** every facing pair of ends, visited once — the shape ANNIHILATION is quantified over */
  facing?(f: (a: any, b: any) => void, where?: string): void
  /** where a ray goes when it steps — see `across` in Local.ts */
  across?(r: Ref2, bounced: boolean): Ref2 | undefined
  /** two columns exchanged, and one put back to its default — what ARRIVAL is */
  swap?(kind: Ref, a: string, b: string): void
  reset?(kind: Ref, name: string): void
  /** every ray that is there, one step along its own exit — what MOVEMENT is */
  step?(gate: string, back: string, moving: [string, string][], off: (r: any) => void): void

  parent(ref: Ref2): Ref2 | undefined
  children(ref: Ref2): Ref2[]
  target(b: Boundary): Boundary | undefined
}
