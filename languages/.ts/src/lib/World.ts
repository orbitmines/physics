import { Backend } from "./Backend.ts";
import { Theory } from "./Theory.ts";

export type World = {
  get theory(): Theory<any, any, any, any, any, any>
  get backend(): Backend
  get below(): World | undefined
  get layers(): Record<string, World>
  ticks: number
  tick(): void
}
