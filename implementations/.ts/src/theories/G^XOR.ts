import { G } from "./G.ts"

export type Polarity = -1 | 1

export const G_XOR = G.copy()
  .decorate.Boundary<{
    polarity?: Polarity
  }>(self => ({
    active: () => !!self.polarity 
  }));