export type Local = {
  get DEG(): number
  get rays(): Ray[]
}
export type Ray = {
  get l(): Local
  get boundaries(): Boundary[]
}
export type Boundary = {
  get source(): Ray
  get target(): Boundary
  collapse(): void
}

