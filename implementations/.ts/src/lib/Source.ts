import { Sample } from "./Backend.ts";
import { Local, sub, Vec } from "./Local.ts";

export type Source = {
  id: number
  emits: number
  absorbs: boolean
  collides: boolean
  moves: boolean
  duty: number
  dwellTicks: number
  period: number
  phase: number
  u: Vec
  /** the locals it occupies */
  locals: any[]
  absorbed: Vec
  emitted: Vec
  arrivals: number
}

export type SourceSpec = Partial<Omit<Source, "id" | "absorbed" | "arrivals">> & {
  /** the centre, in embedding coordinates */
  at: Vec
  radius?: number
  /** half-extents in real space, making the body a slab rather than a ball */
  half?: Vec
  /** which way round it is; absent for a source with no sides */
  axis?: Vec
  /** how many ring steps its axis takes per beat, or 0 for one held still */
  turning?: number
  /** how the body is pushed by what it absorbs, if at all */
  propulsion?: string | boolean
  /** the sheet, or every exit at once */
  emission?: "sheet" | "isotropic"
  /** whether it meets the vacuum's rays, or is exempt from the collision rule */
  collides?: boolean
  /** the bias P = 2·dwell − 1, reported from the tick count rather than set */
  bias?: number
  SATURATES?: boolean
  /** which way it is pointed, for a body that is aimed rather than round */
  toward?: Vec
  /** whether what it hands on conserves momentum exit by exit */
  conserve?: boolean
}

export const bias = (s: Source) => 2 * (s.dwellTicks / s.period) - 1;

export const acting = (s: Source, tick: number) =>
  s.duty >= 1 || ((tick * s.duty) % 1) < s.duty;

export const sign = (s: Source, tick: number) => {
  const ph = (((tick + s.phase) % s.period) + s.period) % s.period;
  return ph < s.dwellTicks ? s.emits : -s.emits;
};

export type Embedding = {
  at(l: Local): Vec | undefined
  toward(from: Local, to: Local): Vec
  within(centre: Vec, radius: number): Local[]
}

export const embedding = (samples: Sample[]): Embedding => {
  const at = new Map<Local, Vec>();
  for (const s of samples) at.set(s.local, s.at);
  return {
    at: l => at.get(l),
    toward: (from, to) => {
      const a = at.get(from), b = at.get(to);
      return a && b ? sub(b, a) : [];
    },
    within: (centre, radius) => samples
      .filter(s => Math.sqrt(sub(s.at, centre).reduce((n, x) => n + x * x, 0)) <= radius)
      .map(s => s.local),
  };
};
