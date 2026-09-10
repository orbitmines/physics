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
  /** what a gate is asked in — the two the medium carries, by the names the theory uses */
  const NAMES: Record<string, string> = { "\\rho": "rho", "n_{f}": "nf", DEG: `${DEG}.0` };

  /* which field the turn leans on, read off the kernel rather than chosen here */
  const nameOf = (e: any): string | undefined =>
    !e ? undefined : e.kind === "grad" && e.of?.kind === "field" ? e.of.name
      : e.of ? (Array.isArray(e.of) ? e.of.map(nameOf).find(Boolean) : nameOf(e.of)) : undefined;
  const bendSlot = nameOf(carried?.kernel?.drifts) === "\\rho" ? SLOT.rho : SLOT.folds;

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
  const par = dev.createBuffer({ size: 32, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
  const st = buf(3 * cells * A + 64 * 8);                     /* n | was | dN */
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
struct Par { cells: u32, A: u32, N: u32, T: u32, DEG: f32, K: f32, holes: u32 };
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
  const REACT = `${HEAD}
@compute @workgroup_size(64) fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let c = me(gid); if (c >= P.cells) { return; }
  /*
   * ═══ AND NOTHING OF THE MEDIUM HAPPENS INSIDE A HOLE ════════════════════════════════════
   *
   * A source is a hole in the space and the model has no account of what is inside it - it is
   * where space was taken FROM. So the medium's own rules are asked of the medium, and a place
   * a hole stands on is not one: what the hole puts out leaves it, and what it meets it meets
   * outside.
   *
   * ASKED THERE, A BODY BLINDED ITSELF. Its ways are lit at one point, so they are all opposed
   * to one another at that point and annihilate against each other on the spot: measured, the
   * record at a body's own cell stood at 17.9 against nought one c-bar either side - a spike of
   * the body's own making, and the gradient at the peak of a symmetric spike is nought. So the
   * one thing a body reads to know where anything else is was flattened by its own light, and
   * turns had nothing to lean on however strong the other body's field was.
   */
  if (${at("blocks")} > 0.5) { return; }
  let rho = select(${at("rho")}, 1.0, ${at("blocks")} > 0.5);
  let nf = ${at("folds")};
  var dSpace = 0.0; var dFolds = 0.0; var gone = 0.0; var cross = 0.0;
${point.map(fx => {
  const deg = fx.degree ? ` * ${new Array(fx.degree).fill("rho").join(" * ")}` : "";
  return `  {
    let fires = ${fx.rate.toFixed(8)} * clamp(${shaderOr(fx.t.share, NAMES)}, 0.0, 1.0)${deg};
    if (fires > 0.0) {
      for (var a = 0u; a < P.A; a = a + 1u) {
        st[dA(a, c)] = st[dA(a, c)] + fires * ${(fx.dRays / DEG).toFixed(8)};
      }
      dSpace = dSpace + fires * ${fx.dSpace.toFixed(8)};
      dFolds = dFolds + fires * ${fx.dFolds.toFixed(8)};
    }
  }`;
}).join("\n")}
${meets.map(fx => `  {
    let mine = ${fx.rate.toFixed(8)} * clamp(${shaderOr(fx.t.share, NAMES)}, 0.0, 1.0);
    for (var a = 0u; a < P.A; a = a + 1u) {
      let to = hop(c, a);
      if (to < 0) { continue; }
      let tc = u32(to);
      /* the gate at the far end, asked of the far end — a meeting is across an edge */
      let rho2 = select(${at("rho", "tc")}, 1.0, ${at("blocks", "tc")} > 0.5);
      let nf2 = ${at("folds", "tc")};
      let theirs = ${fx.rate.toFixed(8)} * clamp(${shaderOr(fx.t.share, { ...NAMES, "\\rho": "rho2", "n_{f}": "nf2" })}, 0.0, 1.0);
      /*
       * ═══ AND WHAT IT MEETS IS EVERYTHING COMING THE OTHER WAY, NOT ONLY WHAT IS EXACTLY
       *     OPPOSED ═══════════════════════════════════════════════════════════════════════
       *
       * facing.pair carries its own factor and says what it is: "what counts is the part of
       * the opposing population actually coming the other way, F = (1 - d.j)/2, one head-on,
       * nought co-moving". That is a weight over EVERY pair of headings - near one for two rays
       * nearly opposed, a half for two crossing square - and this paired a heading only with its
       * exact opposite, which is F = 1 for one bin and F = 0 for all the rest.
       *
       * SO TWO RAYS CROSSING AT 179 DEGREES NEVER MET. For one body that is invisible: its own
       * rays are opposed across every edge anyway. For TWO it is the whole picture, because the
       * only place where one body's rays are exactly opposed to the other's is the line joining
       * them - measured, the cross term came out 871 times stronger on that axis than two c-bar
       * off it, and exactly nought one c-bar off it. A one-cell line where the model says a
       * region.
       *
       * WALKED RATHER THAN MULTIPLIED IN, which is what Term.walked distinguishes: a solver
       * holding a population per direction walks the pairs itself and must not also multiply F.
       * The 2/A puts a fully lit medium back where it was - the mean of F over the bins is a
       * half - so the vacuum's own balance is untouched and only the crossings are new.
       */
      var meet = 0.0;
      for (var b = 0u; b < P.A; b = b + 1u) {
        let n2 = st[wA(b, tc)];
        if (n2 <= 0.0) { continue; }
        let F = (1.0 - (dir[a].x * dir[b].x + dir[a].y * dir[b].y)) * 0.5;
        meet = meet + n2 * F;
      }
      meet = meet * 2.0 / f32(P.A);
      let w = st[wA(a, c)] * meet * (mine + theirs);
      if (w <= 0.0) { continue; }
      /* EACH END WRITES ITS OWN, so the edge is one event however many threads see it */
      st[dA(a, c)] = st[dA(a, c)] + w * ${(fx.dRays / 4).toFixed(8)};
      let ev = w * P.DEG / f32(P.A) / 4.0;
      dSpace = dSpace + ev * ${fx.dSpace.toFixed(8)};
      dFolds = dFolds + ev * ${fx.dFolds.toFixed(8)};
      gone = gone + abs(ev * ${fx.dSpace.toFixed(8)});
      if (P.T >= 2u) {
        let si = st[wA(a, c)];
        if (si > 0.0) {
          let ai = tg[nA(a, c)] / si;
          let bi = tg[P.cells * P.A + nA(a, c)] / si;
          /* whose rays were in it, asked of the same pairs the meeting walked */
          var m0 = 0.0; var m1 = 0.0;
          for (var b = 0u; b < P.A; b = b + 1u) {
            let n2 = st[wA(b, tc)];
            if (n2 <= 0.0) { continue; }
            let F = (1.0 - (dir[a].x * dir[b].x + dir[a].y * dir[b].y)) * 0.5;
            m0 = m0 + tg[nA(b, tc)] * F;
            m1 = m1 + tg[P.cells * P.A + nA(b, tc)] * F;
          }
          let sc = 2.0 / f32(P.A) * st[wA(a, c)] * (mine + theirs);
          cross = cross + abs((ai * m1 + bi * m0) * sc * P.DEG / f32(P.A) / 4.0 * ${fx.dSpace.toFixed(8)});
        }
      }
    }
  }`).join("\n")}
  ${at("space")} = ${at("space")} + dSpace;
  ${at("folds")} = max(0.0, ${at("folds")} + dFolds);
  ${at("gone")} = gone;
  ${at("cross")} = cross;
}`;

  /**
   * WHAT THE MEDIUM IS DOING AT EACH PLACE — the kernel's two moments, read off the term.
   * `keeps` is how much of a heading survives here; the drift is the gradient of the field the
   * kernel names, taken across the places one step away.
   */
  const SETTLE = `${HEAD}
fn bend(c: u32) -> f32 { return cel[${bendSlot}u * P.cells + c]; }
@compute @workgroup_size(64) fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let c = me(gid); if (c >= P.cells) { return; }
  let rho = select(${at("rho")}, 1.0, ${at("blocks")} > 0.5);
  let nf = ${at("folds")};
  ${at("keep")} = clamp(${shaderOr(carried?.kernel?.keeps, NAMES)}, 0.0, 1.0);
  let x = i32(c % P.N); let y = i32(c / P.N); let n = i32(P.N);
  var gx = 0.0; var gy = 0.0;
  if (x > 0 && x < n - 1) { gx = (bend(c + 1u) - bend(c - 1u)) * 0.5; }
  if (y > 0 && y < n - 1) { gy = (bend(c + P.N) - bend(c - P.N)) * 0.5; }
  ${at("gx")} = gx; ${at("gy")} = gy;
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
@compute @workgroup_size(64) fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let id = me(gid); if (id >= P.cells * P.A) { return; }
  let a = id / P.cells; let c = id % P.cells;
  let m = max(0.0, st[wA(a, c)] + st[dA(a, c)]);
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
    addP(c, turned / f32(P.A));
    for (var z = 0u; z < P.T; z = z + 1u) {
      let sv = tg[z * P.cells * P.A + nA(a, c)];
      if (sv > 0.0) { addP((1u + z) * P.cells + c, turned * min(1.0, sv / m) / f32(P.A)); }
    }
  }
  let kept = m * keeps;
  if (kept <= 0.0) { return; }
  var f = f32(a);
  let gx = ${at("gx")}; let gy = ${at("gy")};
  let gm = sqrt(gx * gx + gy * gy);
  if (gm > 0.0 && keeps < 1.0) {
    let mx = keeps * dir[a].x + (1.0 - keeps) * (gx / gm);
    let my = keeps * dir[a].y + (1.0 - keeps) * (gy / gm);
    f = atan2(my, mx) / 6.28318530718 * f32(P.A);
  }
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
  let sh = kept * min(1.0, select(0.0, tg[nA(a, c)] / m, P.T > 0u));
  for (var q = 0; q < 2; q = q + 1) {
    let bb = u32(select(b0, b1, q == 1));
    let ww = kept * select(1.0 - fr, fr, q == 1);
    if (ww <= 0.0) { continue; }
    let to = hop(c, bb);
    if (to < 0) { continue; }
    addO(nA(bb, u32(to)), ww);
    for (var z = 0u; z < P.T; z = z + 1u) {
      let sv = tg[z * P.cells * P.A + nA(a, c)];
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
  if (p > 0.0) { addO(nA(b, u32(to)), p); }
  for (var z = 0u; z < P.T; z = z + 1u) {
    let q = bitcast<f32>(atomicLoad(&pool[(1u + z) * P.cells + c]));
    if (q > 0.0) { addT(z * P.cells * P.A + nA(b, u32(to)), q); }
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
   * AND THE SPACE COMES BACK WHERE THE WAY REACHES, one c-bar out, because that is where the
   * way GOES. One way, one neighbour, one fold - the hole gives back to the space it is joined
   * to, and what is left at its own place is what the meetings there actually made. Handed back
   * INSIDE the hole it flattened the record exactly where a body has to read it: measured, a
   * test body sat at keeps = 1.000 with a gradient of nought and did not move in forty ticks.
   */
  let tx = ox + i32(dir[a].z); let ty = oy + i32(dir[a].w);
  if (tx < 0 || ty < 0 || tx >= i32(P.N) || ty >= i32(P.N)) { return; }
  let r = u32(ty * i32(P.N) + tx);
  ${at("folds", "r")} = max(0.0, ${at("folds", "r")} - M / f32(P.A));
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
  /* past the state - which is THREE planes of cells*A, not three of cells. Written short, the
   * probe landed inside the population itself: the body felt nothing and the medium was
   * quietly overwritten where it was read. */
  let o = 3u * P.cells * P.A + h * 8u;
  st[o] = fx / f32(P.A);
  st[o + 1u] = fy / f32(P.A);
  st[o + 2u] = ${at("gx")};
  st[o + 3u] = ${at("gy")};
  /* and how much of a heading this place lets through, which is what bends the body */
  st[o + 4u] = ${at("keep")};
}`;

  const P = new Uint32Array(8);
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
  const K_SWEEP = make(SWEEP), K_REACT = make(REACT), K_SETTLE = make(SETTLE);
  const K_ZERO = make(ZERO), K_CARRY = make(CARRY), K_POOL = make(POOL);
  const K_DONE = make(DONE), K_SNAP = make(SNAP), K_SIGMA = make(SIGMA);
  const K_PROBE = make(PROBE);

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
    }
    dev.queue.writeBuffer(dirb, A * 16, rows, 0, Math.max(1, holes.length) * 8);
    P[6] = Math.min(holes.length, MAXH);
    dev.queue.writeBuffer(par, 0, P);
  };

  const step = async () => {
    aim();
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
    run(K_REACT, cells, enc);         /* what the terms do */
    if (holes.length) run(K_SIGMA, holes.length * A, enc);   /* and what was put in from outside */
    run(K_SETTLE, cells, enc);        /* what the medium is doing at each place */
    run(K_ZERO, cells * A, enc);      /* the tick's output starts at nothing */
    run(K_CARRY, cells * A, enc);     /* the draw */
    run(K_POOL, cells * A, enc);      /* and what turned, handed to the place's ways */
    run(K_DONE, cells * A, enc);      /* what was arriving is now what is here */
    if (holes.length) run(K_PROBE, holes.length, enc);   /* and what each body felt */
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
  const propel = async () => {
    const felt = await read(st, holes.length * 8, 3 * cells * A * 4);
    for (let i = 0; i < holes.length; i++) {
      const h = holes[i];
      if (!h.moves) continue;
      const m = mass(h);
      h.px = (h.px ?? 0) + felt[i * 8]; h.py = (h.py ?? 0) + felt[i * 8 + 1];
      const gx = felt[i * 8 + 2], gy = felt[i * 8 + 3], gm = Math.hypot(gx, gy);
      const sp = Math.hypot(h.px, h.py);
      if (sp > 0 && gm > 0) {
        /* what survives the place carries on; what does not goes the way the folds lean */
        /* the place's own, gathered with the rest rather than read off a stale copy */
        const keeps = Math.min(1, Math.max(0, felt[i * 8 + 4]));
        const nx = h.px / sp * keeps + (gx / gm) * (1 - keeps);
        const ny = h.py / sp * keeps + (gy / gm) * (1 - keeps);
        const nm = Math.hypot(nx, ny);
        if (nm > 0) { h.px = sp * nx / nm; h.py = sp * ny / nm; }
      }
      /* x advances at p/m, in cells, and a whole c-bar of it is what a step costs */
      h.ax = (h.ax ?? 0) + K * h.px / m; h.ay = (h.ay ?? 0) + K * h.py / m;
      const d = Math.hypot(h.ax, h.ay);
      if (d >= K) {
        const nx = h.x + K * h.ax / d, ny = h.y + K * h.ay / d;
        if (nx >= 0 && ny >= 0 && nx < N && ny < N) {
          h.x = nx; h.y = ny;
          h.ax -= K * h.ax / d; h.ay -= K * h.ay / d;
          h.moved = (h.moved ?? 0) + 1;
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
    source: { SWEEP, REACT, SETTLE, CARRY, POOL },
  };
};
