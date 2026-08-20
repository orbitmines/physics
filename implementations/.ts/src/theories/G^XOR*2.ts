import { Theory } from "../lib/Theory.ts";
import { G_XOR } from "./G^XOR.ts";

export const G_XOR_2 = G_XOR.copy()
  .layers(
    G_XOR.copy()
  );