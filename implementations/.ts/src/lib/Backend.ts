import { Local } from "./Local.ts"

export type Backend = Iterable<Local> & {
  size(): number
}