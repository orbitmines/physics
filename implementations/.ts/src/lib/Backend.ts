import { Boundary, Local, Ref, Ref2 } from "./Local.ts"
import { Op, Rewrite } from "./Rewrite.ts"

export type Backend = Iterable<Local> & {
  size(): number
  get rewrite(): Rewrite

  create(of: Ref): Ref2
  apply(op: Op): void

  parent(ref: Ref2): Ref2 | undefined
  children(ref: Ref2): Ref2[]
  target(b: Boundary): Boundary | undefined
}
