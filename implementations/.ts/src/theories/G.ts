import { Theory } from "../lib/Theory.ts";

export const G = new Theory()
  .rule("ANNIHILATION", ["Boundary", "Boundary"], (a, b) => [a, b])
  .rule("CREATION", "Local", (a) => a)

  .decorate.Boundary<{
    active: boolean
  }>(self => ({
    active: false
  }));
