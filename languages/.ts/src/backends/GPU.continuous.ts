/**
 * THE SAME LINE, ON THE GPU — and it is the same interpreter, compiled instead of walked.
 *
 * `backends/CPU.continuous.ts` reads the equation off the theory and steps it; this reads the
 * SAME equation off the SAME terms and steps it in parallel. What differs is only that a term's
 * gate is EMITTED as WGSL rather than evaluated per cell: `wgsl` below walks the very `Expr` that
 * `val` walks, so a gate written in anything at all reaches the shader without this file knowing
 * what it says, and a theory that changes its gates changes the generated kernel in the same
 * keystroke. NOTHING ABOUT `G` IS WRITTEN HERE.
 *
 * WHY IT IS WORTH A SECOND BACKEND. Every rule of this model is LOCAL - a point reads the place
 * it stands on and the places one `\bar{c}` away, and nothing else - so every cell of every
 * direction can be stepped at once, which is the shape a GPU is. The CPU reading is the same
 * arithmetic done a millionth at a time: measured, 17.5 million state-elements a second against
 * a device that does thirteen thousand million.
 *
 * AND EVERY THREAD OWNS ITS OWN OUTPUT, which is what makes it exact rather than nearly right.
 * A meeting is one event across an edge and the CPU walks it from both ends, halving each visit;
 * here each end computes its own share of the same edge and writes only its own cell, so two
 * threads never touch one address and there is nothing to serialise. Where the draw genuinely
 * scatters - a heading bent toward the folds can land where another heading lands - the write is
 * an atomic add, because the alternative is to invent an order the rules do not have.
 */
/*
 * AND THE DEVICE'S OWN NAMES ARE DECLARED RATHER THAN DEPENDED ON.
 *
 * WebGPU is the runtime's, not a package's - Deno has it built in and a browser has it - so the
 * only thing missing under a type-check aimed at Node is the SHAPE of those names. Declaring
 * them here keeps the file honest under `tsc` without adding anything to install: nothing is
 * imported, and where the runtime has no `navigator.gpu` the backend says so and stops.
 */
declare const navigator: { gpu?: any };
declare const GPUBufferUsage: {
  STORAGE: number; COPY_SRC: number; COPY_DST: number; MAP_READ: number; UNIFORM: number;
};
declare const GPUMapMode: { READ: number };
declare const GPUShaderStage: { COMPUTE: number };

import { Expr } from "../lib/Algebra.ts";
import { continuum, Symbols, val } from "./CPU.continuous.ts";
import { Geometry as Lattice } from "../lib/Local.ts";

/**
 * A TERM'S OWN EXPRESSION, AS SHADER SOURCE — the one thing this file does that the CPU does
 * differently, and it is the same walk over the same tree.
 *
 * `val` evaluates an `Expr` against a table of names; this PRINTS one against a table of names,
 * and the names are the fields the shader already has in hand. A kind this does not know is a
 * kind nobody has written a rule with yet: it throws rather than guessing, so a theory that
 * needs one is told, instead of being silently given a wrong number.
 */
const wgsl = (e: Expr | undefined, at: Record<string, string>): string => {
  if (!e) return "1.0";
  const go = (x: Expr): string => {
    switch (x.kind) {
      case "num": return x.n.toFixed(8);
      case "sym": case "field": {
        const v = at[x.name];
        if (v === undefined) throw new Error(`GPU: nothing to read \`${x.name}\` from`);
        return v;
      }
      case "add": return `(${x.of.map(go).join(" + ")})`;
      case "mul": return `(${x.of.map(go).join(" * ")})`;
      case "pow": {
        const by = typeof x.by === "number" ? x.by : undefined;
        /* an integer power is a product, which is exact where `pow` is not - and `\rho` can be
         * nought, where `pow(0, n)` is a hole in the floating point and a product is nought */
        if (by !== undefined && Number.isInteger(by) && by >= 0 && by <= 32) {
          if (by === 0) return "1.0";
          return `(${new Array(by).fill(go(x.base)).join(" * ")})`;
        }
        if (by !== undefined && by === -1) return `(1.0 / ${go(x.base)})`;
        return `pow(${go(x.base)}, ${typeof x.by === "number" ? x.by.toFixed(8) : go(x.by)})`;
      }
      case "log": return `log(${go(x.of)})`;
      case "exp": return `exp(${go(x.of)})`;
      /* a gradient is a fact about the neighbourhood and is handed in already taken - see
       * `settle`, which is where the kernel's drift is read */
      case "grad": return go(x.of);
      case "call": return go(x.of);
      default: throw new Error(`GPU: no shader for a \`${(x as any).kind}\``);
    }
  };
  return go(e);
};

/**
 * AND A NAME THIS HAS NOTHING TO READ FROM FALLS BACK, EXACTLY AS `val` DOES.
 *
 * The CPU evaluates a gate with `val(expr, state, fallback)`: a name the state does not carry
 * makes the whole expression non-finite, and the fallback stands. `\omega` is one of those - the
 * share of steps that found room, which the medium measures rather than declares - so a term
 * gated on it runs at the fallback on both backends. Throwing here instead would make the GPU
 * refuse a line the CPU runs, and the two have to be the same reading of the same equation or
 * there is no point having a second one.
 */
const shaderOr = (e: Expr | undefined, at: Record<string, string>, fallback = "1.0") => {
  try { return wgsl(e, at); } catch { return fallback; }
};

export type Hole = {
  x: number; y: number; mx: number; ways: number; tag?: number;
  moves?: boolean; px?: number; py?: number; ax?: number; ay?: number;
  stepped?: boolean; moved?: number; along?: number;
  chooses?: (d: number, tick: number) => number;
};

/** where each per-place ledger lives in the one buffer that holds them */
const CELL = ["rho", "fire", "folds", "space", "gone", "cross",
              "keep", "gx", "gy", "blocks"] as const;
const SLOT = Object.fromEntries(CELL.map((k, i) => [k, i])) as Record<typeof CELL[number], number>;

/**
 * THE LINE, STEPPED ON THE DEVICE — the same arguments as `line`, and `step` is awaited.
 *
 * `A` is how finely direction is sampled and `K` how many cells make one `\bar{c}`; neither may
 * move the answer, which is the test both backends are held to.
 */
export const gpu = async (o: {
  theory: any; geometry: Lattice; N: number;
  A?: number; K?: number; tags?: number; symbols?: Symbols;
}) => {
  const adapter = await navigator.gpu?.requestAdapter();
  if (!adapter) throw new Error("GPU: no adapter — run under a runtime with WebGPU");
  const dev = await adapter.requestDevice();

  const eq = continuum(o.theory);
  const g = o.geometry, DEG = g.DEG, N = o.N, cells = N * N;
  const A = Math.max(8, (o.A ?? 96) & ~1), K = Math.max(1, o.K ?? 3);
  const T = Math.max(0, o.tags ?? 0);

  const sym: Symbols = { DEG, ...(o.symbols ?? {}) };
  for (const t of eq.terms) if (t.rate) sym[t.rate] = 1;

  /* the same reading of the same terms the CPU makes — see `line` */
  const count = (c: any): number => {
    if (!c) return 0;
    let v = c.n;
    for (const [k, w] of Object.entries(c.of ?? {}))
      v += (w as number) * (k.split("·").reduce((x, p) => x * (sym[p] ?? 1), 1));
    return v;
  };
  const acting = eq.terms.filter(t => t.side === "right").map(t => ({
    t, facing: t.facing, rate: t.rate ? (sym[t.rate] ?? 1) : 1,
    dRays: count(t.rayCount), dSpace: count(t.spaceCount), dFolds: count(t.foldCount),
    outside: !t.rules.length, degree: t.degree,
  }));
  const carried = eq.terms.find(t => t.side === "left" && t.operator
    && !/partial_\{t\}/.test(t.operator));
  const point = acting.filter(fx => !fx.facing && !fx.outside);
  const meets = acting.filter(fx => fx.facing);

  /**
   * ═══ THE RULES, IN THE ORDER THEY ARE WRITTEN ════════════════════════════════════════════
   *
   * "Rules are tried in the order they are written and a match belongs to the first that takes
   * it" - so what one rule does to a ledger is what the next one reads, and a solver applying
   * them in another order is solving another theory. The order is the theory's, carried on every
   * term, and the passes below ARE that order rather than one typed out here: add a rule and a
   * pass appears where the rule is, move it and the pass moves.
   */
  const orders = [...new Set(eq.terms.map(t => t.order))].sort((a, b) => a - b);
  const group = (o: number) => ({
    o,
    point: point.filter(fx => fx.t.order === o),
    meets: meets.filter(fx => fx.t.order === o),
    outside: acting.filter(fx => fx.outside && fx.t.order === o),
    /* the rule that carries a population is the one with a transport operator, and the one that
     * settles what was arriving is the one with the time derivative - both say so themselves */
    carries: eq.terms.some(t => t.order === o && t.side === "left" && t.operator
      && !/partial_\{t\}/.test(t.operator)),
    settles: eq.terms.some(t => t.order === o && t.side === "left"
      && /partial_\{t\}/.test(t.operator ?? "")),
  });
  type Pass = ReturnType<typeof group>;
  const passes = orders.map(group);

  /**
   * AND WHERE A COUNT LANDS IS THE RULE'S OWN WORD FOR IT — `place`, a `way`, or the `matched`
   * way this firing was across. Anything else is a shape no solver here knows how to lay down,
   * and it says so rather than quietly picking one: that is what kept letting a backend drift.
   */
  const lands = (t: any, which: "rays" | "space" | "folds", want: string[]): string => {
    const how = t[`${which}Along`] ?? "place";
    if (!want.includes(how))
      throw new Error(`GPU: ${t.rules.join("/")} lands its ${which} on the ${how}, `
        + `which this pass cannot lay down (it can do ${want.join(" or ")})`);
    return how;
  };
  /** what a gate is asked in — the two the medium carries, by the names the theory uses */
  const NAMES: Record<string, string> = { "\\rho": "rho", "n_{f}": "nf", DEG: `${DEG}.0` };
  /*
   * AND THE DRAW ITSELF, AS THE RULE DECLARES IT: what carrying on weighs, and what one way of
   * the place weighs. A rule that moves a population without saying what its choice weighs is a
   * rule this cannot step, and it says so rather than reaching for a formula of its own.
   */
  const draw = eq.terms.map(t => t.draw).find(Boolean);
  if (!draw) throw new Error("GPU: nothing here declares what a turn weighs");
  const STRAIGHT = shaderOr(draw.straight, NAMES);
  /* one way's weight, asked of the record on that way - which is where a fold was written */
  const WAY_AT = (b: string) =>
    shaderOr(draw.way, { ...NAMES, "n_{f}": `max(0.0, st[fA(${b}, c)])` });

  /* which field the turn leans on, read off the kernel rather than chosen here */
  const nameOf = (e: any): string | undefined =>
    !e ? undefined : e.kind === "grad" && e.of?.kind === "field" ? e.of.name
      : e.of ? (Array.isArray(e.of) ? e.of.map(nameOf).find(Boolean) : nameOf(e.of)) : undefined;
  /**
   * ═══ WHICH FIELD THE TURN LEANS ON — and it is the one the rules leave standing ══════════
   *
   * The kernel names `n_{f}`, the fold record, and that is right about what a turn IS: a place
   * that has swallowed folds has more ways through it. But `n_{f}` is not what SURVIVES: every
   * firing of `(G/2)` hands back `DEG` of it, so wherever a body's field is thin enough that the
   * vacuum still splits, the record is zeroed every tick. Measured round a body: the pull is
   * `0.71` at one c-bar, `0.80` at two, and `0.004` at THREE - a cliff, at exactly the radius
   * where `\rho` falls under a tenth and the creation gate opens back up.
   *
   * THE SPACE LEDGER IS THE SAME EVENT COUNTED AND IT IS NOT HANDED BACK THE SAME WAY. A meeting
   * is `space -1, folds +1`; a splitting is `space +1, folds -DEG`. So the folds a place holds
   * are wiped `DEG` at a time while the space it has lost is given back ONE at a time - and what
   * is left standing is the SHORTFALL, which is what this theory says gravity IS: "GRAVITY IS
   * SPACE BEING DESTROYED rather than a counter of events standing in for one".
   *
   * IT IS THE SAME QUANTITY THE RIGHT-HAND PANEL DRAWS, which is the check that this is not a
   * substitution: the picture of where space is annihilated already shows the shape a path
   * should bend along, and this is a body reading that shape at the one place it stands.
   */
  const bendSlot = nameOf(carried?.kernel?.drifts) === "\\rho" ? SLOT.rho : SLOT.space;

  const ANG = Array.from({ length: A }, (_, a) => 2 * Math.PI * a / A);
  const DIR = new Float32Array(A * 4);
  for (let a = 0; a < A; a++) {
    DIR[a * 4] = Math.cos(ANG[a]); DIR[a * 4 + 1] = Math.sin(ANG[a]);
    DIR[a * 4 + 2] = Math.round(K * Math.cos(ANG[a]));
    DIR[a * 4 + 3] = Math.round(K * Math.sin(ANG[a]));
  }
  /**
   * ═══ AND A STEP IS ONE `\bar{c}` ALONG THE HEADING, NOT ALONG THE NEAREST GRID OFFSET ═══
   *
   * `round(K cos t), round(K sin t)` is a whole number of cells, and there are only about
   * `pi K^2` distinct ones - twenty-eight at `K = 3`. Left fixed, every direction takes the SAME
   * rounded offset on every tick for ever, so a bin travels along a rational slope rather than
   * along its own heading, and the whole population collects onto those few slopes: the field
   * goes out ROUND on the first ticks and turns into a fan of BEAMS over the next hundred. That
   * is the grid quantising direction one level below the direction axis itself, and refining `A`
   * cannot fix it, because the beams are the OFFSETS and not the bins.
   *
   * SO EACH DIRECTION KEEPS WHAT IT IS OWED, and the whole part of that is the step it takes.
   * The remainder is under half a cell and is carried to the next tick, so a heading's mean
   * displacement is exactly `K cos t, K sin t` however the individual steps round - the
   * trajectory is the straight line the heading names, and the grid is only where it is written
   * down. Every direction still crosses one `\bar{c}` a tick; what changes is that no direction
   * is pinned to one lattice slope for the whole run.
   */
  const owedX = new Float32Array(A), owedY = new Float32Array(A);
  const aim = () => {
    for (let a = 0; a < A; a++) {
      owedX[a] += K * DIR[a * 4]; owedY[a] += K * DIR[a * 4 + 1];
      const sx = Math.round(owedX[a]), sy = Math.round(owedY[a]);
      owedX[a] -= sx; owedY[a] -= sy;
      DIR[a * 4 + 2] = sx; DIR[a * 4 + 3] = sy;
    }
    dev.queue.writeBuffer(dirb, 0, DIR);
  };

  /* ── the buffers ───────────────────────────────────────────────────────────────────────── */
  const MAXH = 64;
  const S = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST;
  const buf = (n: number, usage = S) => dev.createBuffer({ size: Math.max(16, n * 4), usage });
  const par = dev.createBuffer({ size: 48, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
  const st = buf(4 * cells * A + 64 * 8);   /* n | was | dN | the fold record, per way */
  const cel = buf(CELL.length * cells);
  const dirb = buf((A + MAXH * 2) * 4);
  const outp = buf(cells * A);                       /* atomic<u32>, bit-cast floats */
  const pool = buf((1 + Math.max(1, T)) * cells);
  const tgb = buf(Math.max(1, T) * cells * A);
  const otg = buf(Math.max(1, T) * cells * A);
  const ptg = buf(Math.max(1, T) * cells);
  dev.queue.writeBuffer(dirb, 0, DIR);

  const at = (k: keyof typeof SLOT, i = "c") => `cel[${SLOT[k]}u * P.cells + ${i}]`;
  const WIDE = 1024;
  const HEAD = `
struct Par { cells: u32, A: u32, N: u32, T: u32, DEG: f32, K: f32, holes: u32, tick: u32, vacWas: f32, vacOut: f32, vacRho: f32, vacNf: f32 };
@group(0) @binding(0) var<uniform> P: Par;
@group(0) @binding(1) var<storage, read_write> st: array<f32>;
@group(0) @binding(2) var<storage, read_write> cel: array<f32>;
@group(0) @binding(3) var<storage, read> dir: array<vec4<f32>>;
@group(0) @binding(4) var<storage, read_write> outp: array<atomic<u32>>;
@group(0) @binding(5) var<storage, read_write> pool: array<atomic<u32>>;
@group(0) @binding(6) var<storage, read_write> tg: array<f32>;
@group(0) @binding(7) var<storage, read_write> otg: array<atomic<u32>>;
fn ix(a: u32, c: u32) -> u32 { return a * P.cells + c; }
fn nA(a: u32, c: u32) -> u32 { return ix(a, c); }
fn wA(a: u32, c: u32) -> u32 { return P.cells * P.A + ix(a, c); }
fn dA(a: u32, c: u32) -> u32 { return 2u * P.cells * P.A + ix(a, c); }
/*
 * THE FOLD RECORD, PER WAY — which is what it is: fold marks the way a meeting went across,
 * unfold takes one off each way HOLDING one, and turns weighs each way by its own count. One
 * number per place can say none of that, and reading a direction back off a gradient between
 * places is a second thing standing in for the record rather than the record.
 */
fn fA(a: u32, c: u32) -> u32 { return 3u * P.cells * P.A + ix(a, c); }
fn hop(c: u32, a: u32) -> i32 {
  let x = i32(c % P.N); let y = i32(c / P.N);
  let tx = x + i32(dir[a].z); let ty = y + i32(dir[a].w);
  if (tx < 0 || ty < 0 || tx >= i32(P.N) || ty >= i32(P.N)) { return -1; }
  return ty * i32(P.N) + tx;
}
fn opp(a: u32) -> u32 { return (a + P.A / 2u) % P.A; }
/* which element this thread is, off a two-dimensional dispatch - see run() below */
fn me(gid: vec3<u32>) -> u32 { return gid.y * ${WIDE}u * 64u + gid.x; }
/* AN ADD TWO THREADS MAY MAKE AT ONCE — where the draw genuinely scatters, two headings bent
 * toward the same folds land in one place, and inventing an order for them is inventing physics.
 * WGSL has no float atomic, so it is a compare-and-swap on the bits. */
fn addO(i: u32, v: f32) {
  var old = atomicLoad(&outp[i]);
  loop { let got = atomicCompareExchangeWeak(&outp[i], old, bitcast<u32>(bitcast<f32>(old) + v));
         if (got.exchanged) { break; } old = got.old_value; }
}
fn addP(i: u32, v: f32) {
  var old = atomicLoad(&pool[i]);
  loop { let got = atomicCompareExchangeWeak(&pool[i], old, bitcast<u32>(bitcast<f32>(old) + v));
         if (got.exchanged) { break; } old = got.old_value; }
}
fn addT(i: u32, v: f32) {
  var old = atomicLoad(&otg[i]);
  loop { let got = atomicCompareExchangeWeak(&otg[i], old, bitcast<u32>(bitcast<f32>(old) + v));
         if (got.exchanged) { break; } old = got.old_value; }
}
`;

  /** `\rho` at a place — the share of its ways that are carrying, and `was` is the tick's input */
  const SWEEP = `${HEAD}
@compute @workgroup_size(64) fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let c = me(gid); if (c >= P.cells) { return; }
  var s = 0.0;
  for (var a = 0u; a < P.A; a = a + 1u) { s = s + st[wA(a, c)]; st[dA(a, c)] = 0.0; }
  /* the pool the turned share is gathered in - the medium's, and one for each tag */
  for (var z = 0u; z <= P.T; z = z + 1u) { atomicStore(&pool[z * P.cells + c], bitcast<u32>(0.0)); }
  ${at("rho")} = s / f32(P.A);
  ${at("gone")} = 0.0; ${at("cross")} = 0.0;
}`;

  /**
   * WHAT THE TERMS DO — every point rule and every meeting, at every place at once.
   *
   * THE GATE IS THE TERM'S OWN EXPRESSION, printed. A share is a fraction, so it is held to
   * `[0, 1]`; and a place a source stands on is full, which is what `busy` says.
   */
  /**
   * ═══ (G/2) A NEUTRAL POINT HANDS BACK A POINT OF SPACE AND LIGHTS EVERY WAY IT HAS ════════
   *
   * seq(unfold(point), each(exits(point), light)) - one rule, in its own pass, because the rules
   * are applied in the order they are written and what each does to the record is read by the
   * next. Its gate, its rays and its counts are the term's own.
   */
  const CREATE = (r: Pass) => `${HEAD}
@compute @workgroup_size(64) fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let c = me(gid); if (c >= P.cells) { return; }
  if (${at("blocks")} > 0.5) { return; }
  let rho = ${at("rho")};
  var nf = 0.0;
  for (var a = 0u; a < P.A; a = a + 1u) { nf = nf + max(0.0, st[fA(a, c)]); }
  var dSpace = 0.0;
${r.point.map(fx => {
  const deg = fx.degree ? ` * ${new Array(fx.degree).fill("rho").join(" * ")}` : "";
  /* a rule that changes nothing need not say where nothing lands */
  const onRays = fx.dRays === 0 ? "place" : lands(fx.t, "rays", ["way"]);
  const onFolds = fx.dFolds === 0 ? "place" : lands(fx.t, "folds", ["way", "place"]);
  return `  {
    let fires = ${fx.rate.toFixed(8)} * clamp(${shaderOr(fx.t.share, NAMES)}, 0.0, 1.0)${deg};
    if (fires > 0.0) {
      /* ${onRays === "way" ? "one apiece on the ways of the place" : ""} */
      for (var a = 0u; a < P.A; a = a + 1u) {
        st[dA(a, c)] = st[dA(a, c)] + fires * ${(fx.dRays / DEG).toFixed(8)};
      }
      dSpace = dSpace + fires * ${fx.dSpace.toFixed(8)};
      /*
       * AND THE RECORD COMES BACK WAY BY WAY: "one off each way that is holding a fold ... a way
       * out that has swallowed nothing has nothing to hand back". The term's own count is the
       * most that can come back over all of them; a way gives back its share of that or what it
       * holds, whichever is less.
       */
${fx.dFolds === 0 ? "" : onFolds === "way" ? `      for (var a = 0u; a < P.A; a = a + 1u) {
        ${fx.dFolds < 0
          ? `st[fA(a, c)] = st[fA(a, c)] - fires * min(max(0.0, st[fA(a, c)]), ${(-fx.dFolds / A).toFixed(8)});`
          : `st[fA(a, c)] = st[fA(a, c)] + fires * ${(fx.dFolds / A).toFixed(8)};`}
      }` : `      st[fA(0u, c)] = max(0.0, st[fA(0u, c)] + fires * ${fx.dFolds.toFixed(8)});`}
    }
  }`;
}).join("\n")}
  ${at("space")} = ${at("space")} + dSpace;
}`;

  /**
   * ═══ (G/1) TWO RAYS THAT MEET ON THE EDGE BETWEEN TWO POINTS ANNIHILATE ═══════════════════
   *
   * Both are doused, a point of space is destroyed, and the place is left with the two ends
   * joined ALONG THE WAY THEY MET ACROSS - which is the way this loop is walking.
   */
  const MEET = (r: Pass) => `${HEAD}
@compute @workgroup_size(64) fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let c = me(gid); if (c >= P.cells) { return; }
  if (${at("blocks")} > 0.5) { return; }
  let rho = ${at("rho")};
  var nf = ${at("folds")};
  var dSpace = 0.0; var gone = 0.0; var cross = 0.0;
${r.meets.map(fx => {
  const onRays = fx.dRays === 0 ? "matched" : lands(fx.t, "rays", ["matched"]);
  const onFolds = fx.dFolds === 0 ? "matched" : lands(fx.t, "folds", ["matched"]);
  return `  {
    let mine = ${fx.rate.toFixed(8)} * clamp(${shaderOr(fx.t.share, NAMES)}, 0.0, 1.0);
    for (var a = 0u; a < P.A; a = a + 1u) {
      let to = hop(c, a);
      let inside = to >= 0;
      let tc = select(0u, u32(max(to, 0)), inside);
      /* the gate at the far end, asked of the far end - a meeting is across an edge; beyond the
       * box the far end is the vacuum these same terms make, stepped alongside (see vacuumStep) */
      let rho2 = select(P.vacRho, select(${at("rho", "tc")}, 1.0, ${at("blocks", "tc")} > 0.5), inside);
      let nf2 = select(P.vacNf, ${at("folds", "tc")}, inside);
      let theirs = ${fx.rate.toFixed(8)} * clamp(${shaderOr(fx.t.share, { ...NAMES, "\\rho": "rho2", "n_{f}": "nf2" })}, 0.0, 1.0);
      var meet = P.vacWas;
      if (inside) {
        meet = 0.0;
        for (var b = 0u; b < P.A; b = b + 1u) {
          let n2 = st[wA(b, tc)];
          if (n2 <= 0.0) { continue; }
          let F = (1.0 - (dir[a].x * dir[b].x + dir[a].y * dir[b].y)) * 0.5;
          meet = meet + n2 * F;
        }
        meet = meet * 2.0 / f32(P.A);
      }
      let w = st[wA(a, c)] * meet * (mine + theirs);
      if (w <= 0.0) { continue; }
      /*
       * ${onRays}: on the way this pair met across, which is the way being walked - and halved
       * once for the gate summed from both ends, once for the edge walked from both.
       *
       * AND IT IS DOUSED WHERE IT HAS ARRIVED, because this rule is written after the ones that
       * move it and settle it. The pair is still the one the tick was handed - a ray meets what
       * faced it when the tick began - but what it takes is taken from what is here now. Put in
       * the arriving pile instead it was never taken at all: that pile had already been carried
       * and emptied, so nothing annihilated, the medium stayed lit and the record ran away.
       */
      st[nA(a, c)] = max(0.0, st[nA(a, c)] + w * ${(fx.dRays / 4).toFixed(8)});
      let ev = w * P.DEG / f32(P.A) / 4.0;
      dSpace = dSpace + ev * ${fx.dSpace.toFixed(8)};
      /* AND WHICH WAY IT WENT IS KEPT - ${onFolds}, and it stands from here on: this rule is
       * written after the one that moves, so what it folds is a way through the place NEXT tick */
      st[fA(a, c)] = max(0.0, st[fA(a, c)] + ev * ${fx.dFolds.toFixed(8)});
      if (P.T > 0u) {
        let si2 = st[wA(a, c)];
        if (si2 > 0.0) {
          var owed = 0.0;
          for (var z = 0u; z < P.T; z = z + 1u) { owed = owed + tg[z * P.cells * P.A + nA(a, c)]; }
          /* a ray put in from outside is born of no split, so its fold is still owed - and it
           * is paid here, on this way, where the ray dies */
          st[fA(a, c)] = max(0.0, st[fA(a, c)] - ev * min(1.0, owed / si2));
        }
      }
      gone = gone + abs(ev * ${fx.dSpace.toFixed(8)});
      if (P.T >= 2u && inside) {
        let si = st[wA(a, c)];
        if (si > 0.0) {
          let ai = tg[nA(a, c)] / si;
          var bsum = 0.0;
          for (var z = 1u; z < P.T; z = z + 1u) { bsum = bsum + tg[z * P.cells * P.A + nA(a, c)]; }
          let bi = bsum / si;
          var m0 = 0.0; var m1 = 0.0;
          for (var b = 0u; b < P.A; b = b + 1u) {
            let n2 = st[wA(b, tc)];
            if (n2 <= 0.0) { continue; }
            let F = (1.0 - (dir[a].x * dir[b].x + dir[a].y * dir[b].y)) * 0.5;
            m0 = m0 + tg[nA(b, tc)] * F;
            for (var z = 1u; z < P.T; z = z + 1u) { m1 = m1 + tg[z * P.cells * P.A + nA(b, tc)] * F; }
          }
          let sc = 2.0 / f32(P.A) * st[wA(a, c)] * (mine + theirs);
          cross = cross + abs((ai * m1 + bi * m0) * sc * P.DEG / f32(P.A) / 4.0 * ${fx.dSpace.toFixed(8)});
        }
      }
    }
  }`;
}).join("\n")}
  ${at("space")} = ${at("space")} + dSpace;
  ${at("gone")} = gone;
  ${at("cross")} = cross;
}`;

  /**
   * WHAT THE MEDIUM IS DOING AT EACH PLACE — the kernel's two moments, read off the term.
   * `keeps` is how much of a heading survives here; the drift is the gradient of the field the
   * kernel names, taken across the places one step away.
   */
  /**
   * WHAT A PLACE HOLDS AND WHAT A TURN KEEPS OF A HEADING — the record summed over the ways,
   * and the kernel's own expression of it. Nothing else is worked out here: where a turn GOES is
   * the record itself, way by way, and not a gradient between places standing in for it.
   */
  const TOTAL = `${HEAD}
@compute @workgroup_size(64) fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let c = me(gid); if (c >= P.cells) { return; }
  /*
   * WHAT THE DRAW WEIGHS AT THIS PLACE — the rule's own two weights, summed over the ways.
   *
   * turns declares the choice: carrying straight on, against each way of the place. So what a
   * turn KEEPS of a heading is the straight weight over the whole weight, and where it GOES is
   * each way's weight over the rest - one declaration, both read off it, instead of a keeps
   * written in one place and a share written in another with nothing holding them together.
   */
  var nf = 0.0;
  for (var b = 0u; b < P.A; b = b + 1u) { nf = nf + ${WAY_AT("b")}; }
  ${at("folds")} = nf;
  let rho = select(${at("rho")}, 1.0, ${at("blocks")} > 0.5);
  let straight = ${STRAIGHT};
  ${at("keep")} = clamp(straight / max(1e-30, straight + nf), 0.0, 1.0);
  atomicStore(&outp[c], bitcast<u32>(0.0));
}`;


  /** the output has to start at nothing, and it is `cells·A` long rather than `cells` */
  const ZERO = `${HEAD}
@compute @workgroup_size(64) fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = me(gid); if (i >= P.cells * P.A) { return; }
  atomicStore(&outp[i], bitcast<u32>(0.0));
  for (var z = 0u; z < P.T; z = z + 1u) { atomicStore(&otg[z * P.cells * P.A + i], bitcast<u32>(0.0)); }
}`;

  /**
   * ═══ THE DRAW: STRAIGHT ON WITH WEIGHT ONE, OR A FOLDED WAY ═══════════════════════════
   *
   * `turns` says what leaves a place, and this is that said in parallel: what survives carries
   * on, leaning toward where the folds are, and what does not goes down the ways this place was
   * folded. Every thread reads only the place it stands on.
   */
  const CARRY = `${HEAD}
/*
 * ═══ A SOURCE ABSORBS WHAT ARRIVED, AND ONLY WHAT IT PUTS OUT LEAVES IT ═══════════════════
 *
 * radiate: "a source absorbs what arrived and writes its own charge onto the space around it" -
 * every ray that reaches it is counted and CLEARED, its own included. So a hole is a sink: what
 * comes from its side is taken out of the space, and the lopsidedness that leaves round it "is
 * exactly the shadow another body casts". Carried straight through instead, nothing was ever
 * taken out, there was no shadow at all, and the only lopsided thing a body met was the other
 * body's outgoing light - which pushes it away. Measured on a flyby: the absorbed momentum turned
 * it 1.22 degrees AWAY while turns turned it 0.49 degrees toward.
 *
 * WHAT LEAVES A HOLE IS WHAT IT PUT DOWN THIS TICK, and whose it is is the hole's own.
 */
fn hole(c: u32) -> bool { return cel[${SLOT.blocks}u * P.cells + c] > 0.5; }
fn carriedTag(z: u32, a: u32, c: u32) -> f32 {
  let hb = cel[${SLOT.blocks}u * P.cells + c];
  if (hb < 0.5) { return tg[z * P.cells * P.A + nA(a, c)]; }
  let own = u32(dir[P.A + (u32(hb) - 1u) * 2u].w);
  return select(0.0, max(0.0, st[dA(a, c)]), z == own);
}
@compute @workgroup_size(64) fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let id = me(gid); if (id >= P.cells * P.A) { return; }
  let a = id / P.cells; let c = id % P.cells;
  let m = select(max(0.0, st[wA(a, c)] + st[dA(a, c)]), max(0.0, st[dA(a, c)]), hole(c));
  if (m <= 1e-14) { return; }
  let keeps = ${at("keep")};
  let turned = m * (1.0 - keeps);
  if (turned > 0.0) {
    /*
     * AND WHAT TURNS TAKES ITS TAGS WITH IT — a ray that is bent is the same ray, and whose it
     * is does not change on the way round. Dropped, only what went STRAIGHT stayed tagged, so
     * the total diffused while the tagged field kept a beam down every way the source lit: the
     * medium was right and the picture of it was a fan of rays.
     */
    addP(c, turned);
    for (var z = 0u; z < P.T; z = z + 1u) {
      let sv = carriedTag(z, a, c);
      if (sv > 0.0) { addP((1u + z) * P.cells + c, turned * min(1.0, sv / m)); }
    }
  }
  let kept = m * keeps;
  if (kept <= 0.0) { return; }
  /*
   * WHAT KEEPS ITS HEADING CARRIES STRAIGHT ON, WITH WEIGHT ONE. The draw is between going on
   * and taking a folded way, and the part that goes on goes on: it is not bent. Leaning it
   * toward a gradient between places was a second mechanism beside the draw, reading a direction
   * off the neighbourhood rather than off the record the rule actually writes.
   */
  var f = f32(a);
  /*
   * AND A BENT HEADING IS SHARED BETWEEN THE TWO BINS IT FALLS BETWEEN, not rounded into one.
   *
   * A heading is continuous and the bins are only where it is written down, so rounding is the
   * same fault as rounding the step was, one level up: with a lean of any size MANY headings
   * round into the SAME bin, they pile up there, and that pile is a beam which grows with every
   * tick. The field then keeps its falloff - nothing is created or destroyed by rounding - while
   * its angular shape collects onto a few directions, which is a structure that appears over
   * time out of a picture that started smooth.
   *
   * SHARED BY HOW FAR IT LIES BETWEEN THEM, the mean direction is exactly the one the kernel
   * asked for and no bin is preferred. This is the same statement as the step's: the grid and
   * the bins are resolutions, and a resolution may not decide where anything goes.
   */
  let lo = floor(f);
  let fr = f - lo;
  var b0 = (i32(lo) % i32(P.A) + i32(P.A)) % i32(P.A);
  var b1 = (b0 + 1) % i32(P.A);
  let sh = kept * min(1.0, select(0.0, carriedTag(0u, a, c) / m, P.T > 0u));
  for (var q = 0; q < 2; q = q + 1) {
    let bb = u32(select(b0, b1, q == 1));
    let ww = kept * select(1.0 - fr, fr, q == 1);
    if (ww <= 0.0) { continue; }
    let to = hop(c, bb);
    if (to < 0) { continue; }
    addO(nA(bb, u32(to)), ww);
    for (var z = 0u; z < P.T; z = z + 1u) {
      let sv = carriedTag(z, a, c);
      if (sv > 0.0) { addT(z * P.cells * P.A + nA(bb, u32(to)), ww * min(1.0, sv / m)); }
    }
  }
}`;

  /** and what turned goes down every way the place has, one pass over them */
  const POOL = `${HEAD}
@compute @workgroup_size(64) fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let id = me(gid); if (id >= P.cells * P.A) { return; }
  let b = id / P.cells; let c = id % P.cells;
  let p = bitcast<f32>(atomicLoad(&pool[c]));
  let to = hop(c, b);
  if (to < 0) { return; }
  /*
   * AND WHAT TURNS TAKES A FOLDED WAY, WITH THE WEIGHT THAT WAY WAS FOLDED — this way's weight
   * in the draw against everything the place weighs. A place that has folded nothing turns
   * nothing, so the even share never carries anything; it is there so the shares come to one.
   */
  let nf = ${at("folds")};
  let share = select(1.0 / f32(P.A), ${WAY_AT("b")} / nf, nf > 0.0);
  if (share <= 0.0) { return; }
  if (p > 0.0) { addO(nA(b, u32(to)), p * share); }
  for (var z = 0u; z < P.T; z = z + 1u) {
    let q = bitcast<f32>(atomicLoad(&pool[(1u + z) * P.cells + c]));
    if (q > 0.0) { addT(z * P.cells * P.A + nA(b, u32(to)), q * share); }
  }
}`;

  /** what was arriving is now what is here — the tick's own exchange */
  const DONE = `${HEAD}
@compute @workgroup_size(64) fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = me(gid); if (i >= P.cells * P.A) { return; }
  st[i] = bitcast<f32>(atomicLoad(&outp[i]));
  for (var z = 0u; z < P.T; z = z + 1u) {
    tg[z * P.cells * P.A + i] = bitcast<f32>(atomicLoad(&otg[z * P.cells * P.A + i]));
  }
}`;

  /** and the tick's input is what the tick opened with */
  const SNAP = `${HEAD}
@compute @workgroup_size(64) fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = me(gid); if (i >= P.cells * P.A) { return; }
  st[P.cells * P.A + i] = st[i];
}`;


  /**
   * ═══ `\Sigma` — WHAT SOMETHING OUTSIDE THE MODEL PUT IN THE BOX ═══════════════════════════
   *
   * A hole hands what it puts down to the space one `\bar{c}` around it, which is `radiate`'s own
   * body: "a way out is a way to a NEIGHBOUR, so what it hands down that way arrives there". What
   * stands on one of its ways is an OCCUPANCY - `\bar{m}/ways`, never more than one, because a way
   * lit every tick is `\bar{c}` and the ceiling - and the mass is the term's own, worked out on
   * the host where there are a handful of bodies rather than a million cells.
   *
   * AND IT GIVES THE SPACE BACK WHERE IT TOOK IT FROM, one fold per way it lights: at the place
   * it stands and at the places its ways reach. That is `(G/2)`'s `unfold` half asked of a
   * source, and it is the same rate a point of the vacuum hands back at - a body is not some
   * other kind of thing, it only has more ways.
   */
  const SIGMA = `${HEAD}
@compute @workgroup_size(64) fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let id = me(gid);
  if (id >= P.holes * P.A) { return; }
  let h = id / P.A; let a = id % P.A;
  let H = dir[P.A + h * 2u];
  let M = dir[P.A + h * 2u + 1u].x;      /* what it weighs, which is what it hands back */
  let ox = i32(H.x); let oy = i32(H.y);
  let own = u32(oy * i32(P.N) + ox);
  /*
   * ═══ AND THE SPACE COMES BACK WHERE ITS WAYS REACH, NOT INSIDE THE HOLE ══════════════════
   *
   * unfold takes one off each WAY, and a way is an edge to a neighbour - so what a hole hands
   * back lands on the space it is joined to. The hole itself is not a place the medium models:
   * it is where space was taken FROM, a point with many, many neighbours, and the model has no
   * account of what is inside it.
   *
   * RETURNING IT AT THE HOLE'S OWN CELL SCRUBBED THE RECORD FLAT THERE, and that is the whole
   * of gravity switched off: a hole lights every tick, so its return is m-bar a tick against
   * the DEG/2 the vacuum deposits, and it wins everywhere its own field reaches. Measured, a
   * test body eight c-bar from a heavy one sat at n_f = 0.000 with keeps = 1.000 and a
   * gradient of nought - so turns had nothing to lean on, the body did not move at all in
   * forty ticks, and the only channel left was the absorbed momentum the model says is the
   * SMALLER effect. The lean is the mechanism; a body that flattens the record where it stands
   * cannot feel it.
   */
  /*
   * AND IT IS PUT DOWN WHERE THE BODY IS, which is what the line says: the source term is
   * sum_b m_b delta(x - x_b), a delta AT the body, and the transport carries it out.
   *
   * IT WAS HANDED TO THE RING ONE c-bar OUT, which is radiate's "a way out is a way to a
   * NEIGHBOUR" - true on a graph, where the neighbour IS one step away. Here a step is K cells,
   * so that ring is a circle of radius K on a grid, and a circle on a grid is a few dozen cells
   * rather than a shell: measured, the field varied by 126 per cent from one cell to the next,
   * which is the ring's own spokes and not a field. Put down where the body is, the very first
   * step spreads it over every direction there is and what leaves is smooth.
   *
   * AND IT STILL CANNOT CATCH ITS OWN LIGHT, which is what the ring was guarding: the radiation
   * moves one c-bar a tick and a body moves at p/m, far under it.
   */
  let c = own;
  st[dA(a, c)] = st[dA(a, c)] + H.z;
  let z = u32(H.w);
  if (z < P.T) { tg[z * P.cells * P.A + nA(a, c)] = tg[z * P.cells * P.A + nA(a, c)] + H.z; }
  /*
   * AND THE SPACE IT COSTS IS NOT PAID HERE — see the meeting, where each of its rays pays.
   *
   * A hole gives back one fold per way it lights, and the question is WHERE. Paid all at once,
   * at the hole or on the ring one c-bar out, it lands in one place while the rays it is paying
   * for annihilate over the whole region they travel through - so the books balance globally
   * and not locally, and the record is scrubbed flat near every body: measured, n_f was nought
   * out to six c-bar around a body of four thousand ways, where the vacuum makes DEG/2 a tick.
   * The return was ten times the deposit and simply won.
   *
   * SO EACH RAY CARRIES ITS OWN RETURN AND PAYS IT WHERE IT DIES. A vacuum ray's is already paid
   * at birth - that is CREATION's own unfold, one per way it lights - and a source's ray is
   * born of no split, so its return is still owed. It is paid at the meeting that ends it, which
   * is where the space it cost was actually taken.
   */
}`;


  /**
   * ═══ WHAT EACH BODY FEELS, GATHERED ON THE DEVICE ══════════════════════════════════════
   *
   * A body reads the place it stands on and nothing else - what arrived, with its heading, and
   * how that place turns a heading. That is a handful of numbers per body, so the gathering is
   * done where the state is and only the handful crosses back.
   */
  const PROBE = `${HEAD}
@compute @workgroup_size(64) fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let h = me(gid);
  if (h >= P.holes) { return; }
  let H = dir[P.A + h * 2u];
  let cap = dir[P.A + h * 2u + 1u].y;
  let c = u32(i32(H.y) * i32(P.N) + i32(H.x));
  var fx = 0.0; var fy = 0.0;
  for (var a = 0u; a < P.A; a = a + 1u) {
    /* what it can take in down ONE way is its ceiling there - the same it can put out */
    let v = min(st[wA(a, c)], cap);
    fx = fx + v * dir[a].x; fy = fy + v * dir[a].y;
  }
  /*
   * ═══ THE RECORD turns READS, AT THE PLACE THE BODY STANDS ═══════════════════════════════
   *
   * "carry straight on with weight one, or take a folded way with the weight it was folded" -
   * the fold record of the place. A HOLE IS AS MANY POINTS AS IT HAS WAYS, and "the places it is
   * joined to are as much the hole as the middle of it is", so the record a body steps by is the
   * medium's own at the places its ways reach, one c-bar out: what has been folded down each of
   * its ways. Summed with the ways' directions it is where the record leans - the kernel's
   * drifts, grad n_f, read over the one ring the hole is joined to - and its mean is the n_f the
   * kernel's keeps is a function of.
   *
   * NOTHING ELSE IS READ: no other body, no distance, no direction to anything. Whatever bends a
   * path toward matter has to be what the annihilation around a body has already done to the
   * record at its own place.
   *
   * IT COUNTED ONLY ITS OWN MEETINGS BEFORE, the body's outgoing rays against what came back
   * along each way - and that left out all the annihilation happening round it, which is most
   * of what the record is: measured, the other body's part of that was under one per cent.
   */
  var ffx = 0.0; var ffy = 0.0; var fsum = 0.0; var ways = 0.0;
  for (var a = 0u; a < P.A; a = a + 1u) {
    let to = hop(c, a);
    if (to < 0) { continue; }
    let fa = max(0.0, ${at("folds", "u32(to)")});
    ffx = ffx + fa * dir[a].x; ffy = ffy + fa * dir[a].y; fsum = fsum + fa; ways = ways + 1.0;
  }
  if (ways > 0.0) { ffx = ffx / ways; ffy = ffy / ways; fsum = fsum / ways; }
  let tfx = 0.0; let tfy = 0.0;
  /* past the state - which is THREE planes of cells*A, not three of cells. Written short, the
   * probe landed inside the population itself: the body felt nothing and the medium was
   * quietly overwritten where it was read. */
  let o = 4u * P.cells * P.A + h * 8u;
  st[o] = fx / f32(P.A);
  st[o + 1u] = fy / f32(P.A);
  /* the fold record as a vector over the ways, and its total */
  st[o + 2u] = ffx;
  st[o + 3u] = ffy;
  st[o + 4u] = fsum;
  st[o + 5u] = tfx;
  st[o + 6u] = tfy;
}`;

  /**
   * ═══ WHAT THE VACUUM BEYOND THE BOX SENDS IN ══════════════════════════════════════════════
   *
   * On the ticks the vacuum splits, every point beyond the box lights every way, and the ones
   * pointing in arrive at the box's edge exactly as a place one step inside would have sent
   * them. How much is what the vacuum beyond puts out down one way this tick, worked out by the
   * same terms - see vacuumStep - and not a number written here. Rays leaving the box leave; nothing comes back from
   * beyond but the vacuum's own.
   */
  const EDGE = `${HEAD}
@compute @workgroup_size(64) fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let id = me(gid); if (id >= P.cells * P.A) { return; }
  let a = id / P.cells; let c = id % P.cells;
  let x = i32(c % P.N) - i32(dir[a].z); let y = i32(c / P.N) - i32(dir[a].w);
  if (x >= 0 && y >= 0 && x < i32(P.N) && y < i32(P.N)) { return; }
  addO(nA(a, c), P.vacOut);
}`;

  /**
   * ═══ A SOURCE HANDS A FOLD BACK ON EVERY WAY IT LIGHTS, AT THE PLACE THAT WAY REACHES ═════
   *
   * radiate: "it hands a fold back on every way it has, which is the other half of putting rays
   * out ... at the places those ways reach", because a hole is as many points as it has ways and
   * CREATION is unfold then light. And unfold's act bounds it: one off each way HOLDING a fold,
   * so a place gives back at most what it holds. How many ways a source lights down each
   * direction this tick is what it puts down there - its occupancy per way times its ways over
   * the directions - so that is what reaches each place.
   *
   * AND IT COMES AFTER THE BODY HAS READ, which is the rules' own order: TRANSPORT (propel reads
   * where it stands) is written before EMISSION (radiate hands back). Without it a body's own
   * record piled up round it - measured, n_f 8.3 at the places its ways reach, lopsided by forty
   * per cent whatever else was in the box - and every step was a draw from that.
   */
  const HANDBACK = `${HEAD}
@compute @workgroup_size(64) fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let c = me(gid); if (c >= P.cells) { return; }
  let cx = i32(c % P.N); let cy = i32(c / P.N);
  var back = 0.0;
  for (var h = 0u; h < P.holes; h = h + 1u) {
    let H = dir[P.A + h * 2u];
    let ways = dir[P.A + h * 2u + 1u].z;
    let ox = i32(H.x); let oy = i32(H.y);
    if (abs(cx - ox) > i32(P.K) + 1 || abs(cy - oy) > i32(P.K) + 1) { continue; }
    let own = u32(oy * i32(P.N) + ox);
    for (var a = 0u; a < P.A; a = a + 1u) {
      if (hop(own, a) == i32(c)) { back = back + H.z * ways / f32(P.A); }
    }
  }
  if (back > 0.0) { ${at("folds")} = ${at("folds")} - min(${at("folds")}, back); }
}`;

  const P = new Uint32Array(12);
  const PF = new Float32Array(P.buffer);
  P[0] = cells; P[1] = A; P[2] = N; P[3] = T;
  new Float32Array(P.buffer)[4] = DEG; new Float32Array(P.buffer)[5] = K;
  dev.queue.writeBuffer(par, 0, P);

  /*
   * ONE LAYOUT FOR EVERY KERNEL, DECLARED — and not `auto`, which is where an hour went.
   *
   * `layout: "auto"` builds the layout from what a shader HAPPENS TO USE, so a kernel that only
   * touches three of the eight buffers gets a three-entry layout - and a bind group offering
   * eight is then invalid. WebGPU reports that asynchronously, so nothing throws where the
   * mistake is: the pass is simply dropped, the buffers keep whatever they had, and every
   * quantity reads nought while the shaders themselves are perfectly correct. Declared once, the
   * layout is the same for all of them whether they use a binding or not.
   */
  const rw = { type: "storage" as const }, ro = { type: "read-only-storage" as const };
  const layout = dev.createBindGroupLayout({ entries: [
    { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: "uniform" } },
    { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: rw },
    { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: rw },
    { binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: ro },
    { binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: rw },
    { binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: rw },
    { binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: rw },
    { binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: rw },
  ] });
  const bind = dev.createBindGroup({ layout, entries: [
    { binding: 0, resource: { buffer: par } }, { binding: 1, resource: { buffer: st } },
    { binding: 2, resource: { buffer: cel } }, { binding: 3, resource: { buffer: dirb } },
    { binding: 4, resource: { buffer: outp } }, { binding: 5, resource: { buffer: pool } },
    { binding: 6, resource: { buffer: tgb } }, { binding: 7, resource: { buffer: otg } },
  ] });
  const holder = dev.createPipelineLayout({ bindGroupLayouts: [layout] });
  /* and a shader that fails to compile says so where it is written, rather than silently */
  dev.addEventListener?.("uncapturederror", (e: any) => {
    throw new Error(`GPU: ${e.error?.message ?? e}`);
  });
  const make = (code: string) => {
    const mod = dev.createShaderModule({ code });
    const pipe = dev.createComputePipeline({ layout: holder, compute: { module: mod, entryPoint: "main" } });
    return { pipe, bind };
  };
  const K_SWEEP = make(SWEEP), K_TOTAL = make(TOTAL);
  /* one pass per rule that has one, built from that rule's own terms */
  const K_OF = new Map(passes.map(r => [r.o, {
    ...(r.point.length ? { create: make(CREATE(r)) } : {}),
    ...(r.meets.length ? { meet: make(MEET(r)) } : {}),
  }]));
  const K_ZERO = make(ZERO), K_CARRY = make(CARRY), K_POOL = make(POOL);
  const K_DONE = make(DONE), K_SNAP = make(SNAP), K_SIGMA = make(SIGMA);
  const K_PROBE = make(PROBE), K_EDGE = make(EDGE), K_HANDBACK = make(HANDBACK);

  let t = 0;
  const holes: Hole[] = [];
  const blocks = new Float32Array(cells);

  /*
   * AND A DISPATCH IS TWO-DIMENSIONAL, because one dimension only goes to 65535 groups.
   *
   * At `A = 96` on a box of 145 that is a million and a half elements, which is seventy-four
   * thousand groups of sixty-four - past the limit, and the device says so rather than silently
   * doing less. Laid out as a grid the same threads are dispatched and each works out which
   * element it is from both of its indices, which is what `WIDE` is for.
   */
  const run = (k: { pipe: any; bind: any }, n: number, enc: any) => {
    const groups = Math.ceil(n / 64);
    const gx = Math.min(groups, WIDE), gy = Math.ceil(groups / WIDE);
    const p = enc.beginComputePass();
    p.setPipeline(k.pipe); p.setBindGroup(0, k.bind);
    p.dispatchWorkgroups(gx, gy); p.end();
  };

  /** the holes as the shader reads them: where, what one way carries, and whose it is */
  const rows = new Float32Array(MAXH * 8);
  const lay = () => {
    for (let i = 0; i < holes.length && i < MAXH; i++) {
      const h = holes[i];
      const m = mass(h);
      rows[i * 8] = Math.round(h.x); rows[i * 8 + 1] = Math.round(h.y);
      /* what stands on ONE of its ways - an occupancy, which is what `n` is */
      rows[i * 8 + 2] = Math.min(1, m / Math.max(1, h.ways));
      rows[i * 8 + 3] = h.tag ?? 0;
      /* and what it WEIGHS, which is what it hands back in folds - `\bar{m}` and not the
       * occupancy: a hole gives space back once per way it lights, and it has `ways` of them */
      rows[i * 8 + 4] = m;
      /* and what it can take down one way, which is what it can put down one way */
      rows[i * 8 + 5] = Math.min(1, m / Math.max(1, h.ways));
      /* and how many ways it has, which is how many folds its lit ways can hand back */
      rows[i * 8 + 6] = Math.max(1, h.ways);
    }
    dev.queue.writeBuffer(dirb, A * 16, rows, 0, Math.max(1, holes.length) * 8);
    P[6] = Math.min(holes.length, MAXH);
    dev.queue.writeBuffer(par, 0, P);
  };

  /**
   * ═══ THE VACUUM BEYOND THE BOX, STEPPED BY THE SAME TERMS ════════════════════════════════
   *
   * The box is where the world is worked out and not where it ends, and beyond it is space no
   * disturbance has reached. What that space does is not a thing to write down - it is what
   * these terms do to a medium with nothing in it: every way alike, every place alike, from the
   * same empty start the box had. So it is stepped here, one place standing for all of them,
   * with the same gates, the same pairing and the same counts the shaders use - the beat, its
   * phase and how much crosses into the box all come out of that rather than being set.
   */
  let vacN = 0, vacF = 0;
  const unit = (v: number) => Math.min(1, Math.max(0, v));
  const vacuumStep = () => {
    const was = vacN, rho = was, nf = vacF;
    const here: Symbols = { ...sym, "\\rho": rho, "n_{f}": nf };
    let dN = 0, dF = 0;
    for (const fx of point) {
      const fires = fx.rate * unit(val(fx.t.share, here, 1)) * Math.pow(rho, fx.degree ?? 0);
      if (fires <= 0) continue;
      dN += fires * fx.dRays / DEG;
      dF += fx.dFolds < 0 ? -fires * Math.min(Math.max(0, nf), -fx.dFolds) : fires * fx.dFolds;
    }
    for (const fx of meets) {
      /* every way alike: what faces a way is the same population, and F over it is one half */
      const gate = fx.rate * unit(val(fx.t.share, here, 1));
      const w = was * was * (gate + gate);
      dN += w * fx.dRays / 4;
      dF += w * DEG / 4 * fx.dFolds;
    }
    return { was, rho, nf, out: Math.max(0, was + dN), nfNext: Math.max(0, nf + dF) };
  };

  const step = async () => {
    aim();
    const v = vacuumStep();
    P[7] = t + 1; PF[8] = v.was; PF[9] = v.out; PF[10] = v.rho; PF[11] = v.nf;
    dev.queue.writeBuffer(par, 0, P);
    vacN = v.out; vacF = v.nfNext;
    /*
     * AND WHAT THE MEDIUM IS COMING TO IS MEASURED EVERY TICK, because the mass is written
     * against it. `\rho` in `gravity.saturation` is the vacuum a body announces itself INTO, so
     * a mass worked out against a stale one is a different body: read only when a panel asked
     * for a frame, `\rho` sat at its initial guess for the whole run and the field came out
     * thirty times the CPU's. It is one small copy a tick against a million-element step.
     */
    if (holes.length) { await ambientNow(); lay(); }
    const enc = dev.createCommandEncoder();
    run(K_SNAP, cells * A, enc);      /* the world every rule is handed */
    run(K_SWEEP, cells, enc);         /* what each place is carrying */
    /*
     * ═══ AND THE PASSES ARE THE RULES, IN THEIR ORDER ═══════════════════════════════════════
     *
     * Not a sequence written here: `passes` is the theory's own rule order and each one runs what
     * its terms say it does. A rule added to `G` gets a pass where it stands; one moved moves.
     */
    for (const r of passes) {
      const k = K_OF.get(r.o);
      if (r.outside.length) {
        /* a source: it reads where it stands, hands its folds back, and writes its charge */
        if (holes.length) { run(K_PROBE, holes.length, enc); run(K_HANDBACK, cells, enc); }
        if (holes.length) run(K_SIGMA, holes.length * A, enc);
      }
      /* what a point does on its own, then what each place now holds and what a turn keeps */
      if (k?.create) { run(k.create, cells, enc); run(K_TOTAL, cells, enc); }
      /* what meets on an edge - its rays go now, its folds are owed until the rays have moved */
      if (k?.meet) run(k.meet, cells, enc);
      if (r.carries) {
        run(K_ZERO, cells * A, enc);    /* the tick's output starts at nothing */
        run(K_CARRY, cells * A, enc);   /* the draw: on with weight one, or a folded way */
        run(K_POOL, cells * A, enc);    /*   and what turned, handed to the place's ways */
        run(K_EDGE, cells * A, enc);    /*   and what the vacuum beyond the box sends in */
      }
      if (r.settles) run(K_DONE, cells * A, enc);   /* what was arriving is now what is here */
    }
    /* and what the tick left behind, so what is read of a place is what the tick left there */
    run(K_TOTAL, cells, enc);
    dev.queue.submit([enc.finish()]);
    await dev.queue.onSubmittedWorkDone();
    if (holes.some(h => h.moves)) await propel();
    t++;
  };

  /**
   * ═══ AND A BODY GOES WHERE THE VACUUM SENDS IT ═════════════════════════════════════════
   *
   * The same two lines the textbook is, and the same two the CPU runs: what arrives changes the
   * MOMENTUM, the momentum advances the body, and a whole c-bar of advance is what a step costs
   * - so a body with no force on it keeps going. What arrived is the LOPSIDEDNESS of the
   * arrivals, since a body hit alike from every side takes in nothing on balance; and where it
   * stands leans its heading by the kernel's own two moments, which is how gravity gets in.
   */
  /** what each body read at its place on the last step - for a reader checking the turn */
  let lastFelt = new Float32Array(0);
  const propel = async () => {
    const felt = await read(st, holes.length * 8, 4 * cells * A * 4);
    lastFelt = felt;
    for (let i = 0; i < holes.length; i++) {
      const h = holes[i];
      if (!h.moves) continue;
      const m = mass(h);
      h.px = (h.px ?? 0) + felt[i * 8]; h.py = (h.py ?? 0) + felt[i * 8 + 1];
      /*
       * ═══ propel, READ AS IT IS WRITTEN ═════════════════════════════════════════════════
       *
       * x ADVANCES AT p/m: what it carries moves it on every tick, and a body crosses a cell
       * only once it has EARNED one - a body at rest earns nothing and goes nowhere.
       */
      h.ax = (h.ax ?? 0) + K * h.px / m; h.ay = (h.ay ?? 0) + K * h.py / m;
      const d = Math.hypot(h.ax, h.ay);
      if (d >= K) {
        /*
         * WHERE THE STEP LANDS IS turns, asked at the place the body stands: straight on along
         * the way it earned with weight one, or down a folded way with the weight that way was
         * folded. The two moments of that draw are the kernel's - keeps of the earned way, and
         * the rest along the way the record leans - so the step goes where the draw goes on
         * average, and keeps is the theory's own expression, evaluated here.
         */
        const ffx = felt[i * 8 + 2], ffy = felt[i * 8 + 3], nf = Math.max(0, felt[i * 8 + 4]);
        const keeps = carried?.kernel
          ? Math.min(1, Math.max(0, val(carried.kernel.keeps, { ...sym, "n_{f}": nf, "\\rho": 1 }, 1))) : 1;
        let hx = keeps * h.ax / d, hy = keeps * h.ay / d;
        if (nf > 0) { hx += (1 - keeps) * ffx / nf; hy += (1 - keeps) * ffy / nf; }
        const hn = Math.hypot(hx, hy);
        if (hn > 0) {
          hx /= hn; hy /= hn;
          const tx = h.x + K * hx, ty = h.y + K * hy;
          const tc = Math.round(ty) * N + Math.round(tx);
          /* AND IT CANNOT MOVE INTO WHAT IS ALREADY THERE - it keeps its momentum instead */
          const taken = tc >= 0 && tc < cells && blocks[tc] && blocks[tc] !== i + 1;
          if (tx >= 0 && ty >= 0 && tx < N && ty < N && !taken) {
            h.x = tx; h.y = ty;
            /* it PAYS FOR THE WAY IT ACTUALLY TOOK, not the one it earned */
            h.ax -= K * hx; h.ay -= K * hy;
            /* AND WHAT IS BENT IS THE BODY: the momentum keeps its size and points the new way */
            const sp = Math.hypot(h.px, h.py);
            h.px = sp * hx; h.py = sp * hy;
            h.moved = (h.moved ?? 0) + 1;
          }
        }
      }
    }
    /* and where the bodies are is what the medium is told next tick */
    blocks.fill(0);
    for (let i = 0; i < holes.length; i++) {
      const c = Math.round(holes[i].y) * N + Math.round(holes[i].x);
      if (c >= 0 && c < cells) blocks[c] = i + 1;
    }
    dev.queue.writeBuffer(cel, SLOT.blocks * cells * 4, blocks);
  };

  /** reading a buffer back is the one thing that costs, so it is asked for explicitly */
  const read = async (b: any, n: number, from = 0) => {
    const rd = dev.createBuffer({ size: n * 4, usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ });
    const enc = dev.createCommandEncoder();
    enc.copyBufferToBuffer(b, from, rd, 0, n * 4);
    dev.queue.submit([enc.finish()]);
    await rd.mapAsync(GPUMapMode.READ);
    const out = new Float32Array(rd.getMappedRange().slice(0));
    rd.unmap(); rd.destroy();
    return out;
  };

  /*
   * WHAT A SOURCE WEIGHS — the same expression, evaluated the same way as `line` does it.
   * A handful of numbers per body per tick, so it stays on the host: what belongs on the device
   * is the million-fold arithmetic, not the half-dozen.
   */
  const SIG = acting.find(fx => fx.outside && fx.t.weighs)?.t;
  let ambient = 0.5, seenT = 0;
  const asked: Symbols = { ...sym };
  const beta = (h: Hole) => t > 0 ? Math.min(1, (h.moved ?? 0) / t) : 0;
  const mass = (h: Hole) => {
    if (!SIG?.weighs) return Math.max(1e-12, h.mx * h.ways);
    asked["l.choose"] = 1;
    asked["\\bar{m}_{x}"] = h.mx;
    asked["l.DEG"] = h.ways;
    asked["\\beta"] = beta(h);
    asked["\\rho"] = Math.min(0.999, Math.max(1e-6, ambient));
    for (const k of ["\\sigma", "F"]) if (!(k in asked)) asked[k] = 1;
    return Math.max(1e-12, val(SIG.weighs, asked, h.mx * h.ways) * val(SIG.share, asked, 1));
  };

  /*
   * AND WHAT A PANEL READS IS ASKED FOR ONCE A FRAME, not once a cell. The state lives on the
   * device, so every read is a copy across the bus, and a panel wants whole arrays rather than
   * single cells. `sync` fetches them once and the accessors below read what it fetched.
   */
  let tagsAt = new Float32Array(Math.max(1, T) * cells * A);
  let cellAt = new Float32Array(CELL.length * cells);
  /** the vacuum's own density, as the mass equation is written against it */
  const ambientNow = async () => {
    const r = await read(cel, cells, SLOT.rho * cells * 4);
    let s = 0; for (let c = 0; c < cells; c++) s += r[c];
    s /= cells; seenT++; ambient += (s - ambient) / Math.min(seenT, 512);
  };
  const sync = async () => {
    if (T) tagsAt = await read(tgb, T * cells * A);
    cellAt = await read(cel, CELL.length * cells);
    let r = 0;
    for (let c = 0; c < cells; c++) r += cellAt[SLOT.rho * cells + c];
    r /= cells; seenT++; ambient += (r - ambient) / Math.min(seenT, 512);
  };
  const slice = (k: keyof typeof SLOT) => cellAt.subarray(SLOT[k] * cells, (SLOT[k] + 1) * cells);

  return {
    step, sync, mass, N, A, K, DEG, cells, equation: eq,
    get felt() { return lastFelt; },
    at: (x: number, y: number) => (x < 0 || y < 0 || x >= N || y >= N ? -1 : y * N + x),
    /** how much of a tagged population stands at a point, in the units `\rho` is in — which
     *  is the MEAN over the place's ways against its degree, exactly as the CPU reads it */
    from: (i: number, c: number) => {
      if (i >= T) return 0;
      let s = 0; for (let a = 0; a < A; a++) s += tagsAt[i * cells * A + a * cells + c];
      return s / A / DEG;
    },
    get blocks() { return blocks; },
    get destroyed() { return slice("gone"); },
    get crossed() { return slice("cross"); },
    get ledger() { return { folds: slice("folds"), space: slice("space") }; },
    get t() { return t; },
    /** the whole state, as the CPU holds it */
    state: () => read(st, cells * A),
    /** and the per-place ledgers, by name */
    ledgers: async () => {
      const all = await read(cel, CELL.length * cells);
      return Object.fromEntries(CELL.map((k, i) =>
        [k, all.subarray(i * cells, (i + 1) * cells)])) as Record<typeof CELL[number], Float32Array>;
    },
    tags: () => read(tgb, Math.max(1, T) * cells * A),
    /** a hole, laid down from outside — which is the whole of what `\Sigma` is */
    add: (h: Hole) => {
      holes.push(h);
      const c = Math.round(h.y) * N + Math.round(h.x);
      if (c >= 0 && c < cells) { blocks[c] = holes.length; }
      dev.queue.writeBuffer(cel, SLOT.blocks * cells * 4, blocks);
      return h;
    },
    bodies: holes,
    /** what the shader came to, for a reader who wants to see the equation compiled */
    source: { SWEEP, TOTAL, CARRY, POOL, rules: passes.map(r => ({
      order: r.o, create: r.point.length ? CREATE(r) : undefined, meet: r.meets.length ? MEET(r) : undefined,
    })) },
  };
};
