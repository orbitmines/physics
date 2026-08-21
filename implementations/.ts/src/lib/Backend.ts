import { Boundary, Local, Ref, Ref2, Vec } from "./Local.ts"
import { Op, Rewrite } from "./Rewrite.ts"

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
  world: any

  create(of: Ref): Ref2
  apply(op: Op): void

  sample(accuracy?: number, from?: Local): Sample[]

  parent(ref: Ref2): Ref2 | undefined
  children(ref: Ref2): Ref2[]
  target(b: Boundary): Boundary | undefined
}
