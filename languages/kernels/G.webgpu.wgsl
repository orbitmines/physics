//! tick SNAP CLEAR SWEEP TOTAL MEET0 TAKE CREATE1 CREATE2 LOCATE CARRY FUNNEL TAGCARRY@z TAGFUNNEL@z GATHER | APPLY SETTLE SNAP SWEEP ARRIVED

fn f32_of_u(x: u32) -> f32 { return f32(x); }
fn i32_of_u(x: u32) -> i32 { return i32(x); }
fn i32_of_f(x: f32) -> i32 { return i32(x); }
fn u32_of_i(x: i32) -> u32 { return u32(x); }
fn absf(x: f32) -> f32 { return abs(x); }
fn maxf(a: f32, b: f32) -> f32 { return max(a, b); }
fn clampf(x: f32, lo: f32, hi: f32) -> f32 { return clamp(x, lo, hi); }
fn rnd(x: f32) -> f32 { return round(x); }

struct Par { cells: u32, A: u32, N: u32, K: u32, DEG: f32, holes: u32, tick: u32, tags: u32, z: u32, entries: u32, pad1: u32, pad2: u32 }
@group(0) @binding(0) var<uniform> P: Par;
@group(0) @binding(1) var<storage, read_write> st: array<f32>;
@group(0) @binding(2) var<storage, read_write> cel: array<f32>;
@group(0) @binding(3) var<storage, read> dir: array<vec4<f32>>;

fn nA(a: u32, c: u32) -> u32 {
  return a * P.cells + c;
}

fn wA(a: u32, c: u32) -> u32 {
  return P.cells * P.A + a * P.cells + c;
}

fn dA(a: u32, c: u32) -> u32 {
  return 2u * P.cells * P.A + a * P.cells + c;
}

fn fA(a: u32, c: u32) -> u32 {
  return 3u * P.cells * P.A + a * P.cells + c;
}

fn tA(a: u32, c: u32) -> u32 {
  return 4u * P.cells * P.A + a * P.cells + c;
}

fn aA(a: u32, c: u32) -> u32 {
  return 5u * P.cells * P.A + a * P.cells + c;
}

fn eA(a: u32, c: u32) -> u32 {
  return 6u * P.cells * P.A + a * P.cells + c;
}

fn kA(a: u32, c: u32) -> u32 {
  return 7u * P.cells * P.A + a * P.cells + c;
}

fn gA(a: u32, c: u32) -> u32 {
  return 8u * P.cells * P.A + a * P.cells + c;
}

fn bA(z: u32, a: u32, c: u32) -> u32 {
  return (9u + 2u * z) * P.cells * P.A + a * P.cells + c;
}

fn beA(z: u32, a: u32, c: u32) -> u32 {
  return (10u + 2u * z) * P.cells * P.A + a * P.cells + c;
}

fn swA(a: u32, c: u32) -> u32 {
  return (9u + 2u * (P.tags - 1u)) * P.cells * P.A + a * P.cells + c;
}

fn sA(a: u32, c: u32) -> u32 {
  return (10u + 2u * (P.tags - 1u)) * P.cells * P.A + a * P.cells + c;
}

fn tap(c: u32, a: u32, sign: f32, k: u32) -> i32 {
  let px: f32 = f32_of_u(c % P.N) + sign * dir[a].z;
  let py: f32 = f32_of_u(c / P.N) + sign * dir[a].w;
  let x0: i32 = i32_of_f(floor(px));
  let y0: i32 = i32_of_f(floor(py));
  let tx: i32 = x0 + i32_of_u(k % 2u);
  let ty: i32 = y0 + i32_of_u(k / 2u);
  if (tx < 0 || ty < 0 || tx >= i32_of_u(P.N) || ty >= i32_of_u(P.N)) { return -1; }
  return ty * i32_of_u(P.N) + tx;
}

fn tapw(c: u32, a: u32, sign: f32, k: u32) -> f32 {
  let px: f32 = f32_of_u(c % P.N) + sign * dir[a].z;
  let py: f32 = f32_of_u(c / P.N) + sign * dir[a].w;
  let fx: f32 = px - floor(px);
  let fy: f32 = py - floor(py);
  let wx: f32 = select(1.0 - fx, fx, (k % 2u) == 1u);
  let wy: f32 = select(1.0 - fy, fy, (k / 2u) == 1u);
  return wx * wy;
}

fn opp(a: u32) -> u32 {
  return (a + P.A / 2u) % P.A;
}

fn owns(c: u32, a: u32) -> f32 {
  return clampf(st[gA(a, c)] * (P.DEG / f32_of_u(P.A)), 0.0, 1.0);
}

fn hopc(c: u32, a: u32) -> i32 {
  let hx: i32 = i32_of_f(select(-floor(0.5 - dir[a].z), floor(dir[a].z + 0.5), dir[a].z >= 0.0));
  let hy: i32 = i32_of_f(select(-floor(0.5 - dir[a].w), floor(dir[a].w + 0.5), dir[a].w >= 0.0));
  let tx: i32 = i32_of_u(c % P.N) + hx;
  let ty: i32 = i32_of_u(c / P.N) + hy;
  if (tx < 0 || ty < 0 || tx >= i32_of_u(P.N) || ty >= i32_of_u(P.N)) { return -1; }
  return ty * i32_of_u(P.N) + tx;
}

fn view(a: u32, c: u32) -> f32 {
  var m: f32 = 0.0;
  m = st[wA(a, c)] + st[tA(a, c)] + st[aA(a, c)];
  return maxf(0.0, m);
}

fn moving(a: u32, c: u32) -> f32 {
  return view(a, c);
}

fn moving_of(z: u32, a: u32, c: u32) -> f32 {
  var had: f32 = 0.0;
  var whole: f32 = 0.0;
  had = st[bA(z, a, c)];
  whole = st[wA(a, c)];
  if (had <= 0.0 || whole <= 0.0) { return 0.0; }
  var f: f32 = 0.0;
  f = (whole + st[tA(a, c)] + st[aA(a, c)]) / whole;
  if (f < 0.0) { f = 0.0; }
  return had * f;
}

fn crossing(i: u32, j: u32) -> f32 {
  if (P.tags < 3u) { return 0.0; }
  let wi: f32 = st[P.cells * P.A + i];
  let wj: f32 = st[P.cells * P.A + j];
  if (wi <= 0.0 || wj <= 0.0) { return 0.0; }
  let f1i: f32 = st[9u * P.cells * P.A + i] / wi;
  let f1j: f32 = st[9u * P.cells * P.A + j] / wj;
  var alli: f32 = 0.0;
  var allj: f32 = 0.0;
  for (var z: u32 = 0u; z < P.tags - 1u; z = z + 1u) {
    alli = alli + st[(9u + 2u * z) * P.cells * P.A + i];
    allj = allj + st[(9u + 2u * z) * P.cells * P.A + j];
  }
  alli = alli / wi;
  allj = allj / wj;
  return f1i * (allj - f1j) + (alli - f1i) * f1j;
}

fn bodily(i: u32) -> f32 {
  let w: f32 = st[P.cells * P.A + i];
  if (w <= 0.0) { return 0.0; }
  var b: f32 = 0.0;
  for (var z: u32 = 0u; z < P.tags - 1u; z = z + 1u) {
    b = b + st[(9u + 2u * z) * P.cells * P.A + i];
  }
  return clampf(b / w, 0.0, 1.0);
}

fn meet0_gate(rho: f32, nf: f32) -> f32 {
  let F: f32 = 1.0;
  let omega: f32 = 1.0;
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return clampf(F, 0.0, 1.0);
}

fn meet0_rays(rho: f32, nf: f32) -> f32 {
  let F: f32 = 1.0;
  let omega: f32 = 1.0;
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return (-2.0);
}

fn meet0_space(rho: f32, nf: f32) -> f32 {
  let F: f32 = 1.0;
  let omega: f32 = 1.0;
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return (-1.0);
}

fn meet0_folds(rho: f32, nf: f32) -> f32 {
  let F: f32 = 1.0;
  let omega: f32 = 1.0;
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return 1.0;
}

fn point0_gate(rho: f32, nf: f32) -> f32 {
  let F: f32 = 1.0;
  let omega: f32 = 1.0;
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return clampf((1.0 - rho), 0.0, 1.0);
}

fn point1_gate(rho: f32, nf: f32) -> f32 {
  let F: f32 = 1.0;
  let omega: f32 = 1.0;
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return clampf(((nf / DEG) * ((1.0 - rho))), 0.0, 1.0);
}

fn point2_gate(rho: f32, nf: f32) -> f32 {
  let F: f32 = 1.0;
  let omega: f32 = 1.0;
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return clampf((nf * ((1.0 - rho))), 0.0, 1.0);
}

fn point3_gate(rho: f32, nf: f32) -> f32 {
  let F: f32 = 1.0;
  let omega: f32 = 1.0;
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return clampf((1.0 - omega), 0.0, 1.0);
}

//! medium MRECORD MCARRY@z MSETTLE@z MSHINE MSWEEP

fn powi(b: f32, n: i32) -> f32 {
  var r: f32 = 1.0;
  let m: i32 = abs(n);
  for (var i: i32 = 0; i < m; i = i + 1) { r = r * b; }
  if (n < 0) { return 1.0 / r; }
  return r;
}
fn choose(n: f32, k: f32) -> f32 {
  var r: f32 = 1.0;
  var i: f32 = 0.0;
  for (var c: i32 = 0; c < 64; c = c + 1) { if (i < k) { r = r * (n - i) / (i + 1.0); i = i + 1.0; } }
  return r;
}
fn finite(v: f32) -> bool { return abs(v) < 1e30 && v == v; }

var<private> e: array<f32, 9>;
fn shell_at(x: f32) -> f32 { return pow(x, (e[5] + ((-1.0) * (1.0)))); }
fn reach_at(x: f32) -> f32 { return pow((((-1.0) * e[6] * e[7] * e[8]) + (1.0)), x); }
fn summand() -> f32 { return (e[0] * (powi(e[1], -1) + ((-1.0) * e[2]))); }
fn record_of() -> f32 { return (((0.5) * e[4]) + (powi((2.0), -1) * e[3])); }
fn folds_rate(rho: f32, nf: f32) -> f32 { e[0] = rho; e[1] = nf; return (((0.5) * powi(e[0], 2)) + ((-1.0) * e[1] * (((-1.0) * e[0]) + (1.0)))); }

const MAXH: u32 = 64u;

const NV: u32 = 9u;

const CN: u32 = 4u;

fn xc(k: u32) -> f32 { return dir[P.A + MAXH + k / 4u][k % 4u]; }

fn mfill() { for (var k: u32 = 0u; k < NV; k = k + 1u) { e[k] = xc(k); } }

const HIST: u32 = 1024u;

fn where_was(h: u32, back: u32) -> vec4<f32> {
  let b: u32 = min(back, min(P.tick, HIST - 1u));
  return dir[u32(xc(NV + 5u)) + h * HIST + ((P.tick + HIST - b) % HIST)];
}

fn record_at(px: f32, py: f32) -> f32 {
  var total: f32 = 0.0;
  for (var h: u32 = 0u; h < P.holes; h = h + 1u) {
    var b: vec4<f32> = dir[P.A + h];
    var R: f32 = sqrt((px - b.x) * (px - b.x) + (py - b.y) * (py - b.y)) / f32(P.K);
    for (var r: u32 = 0u; r < 4u; r = r + 1u) {
      let back: u32 = min(u32(round(R)), min(P.tick, HIST - 1u));
      let was: vec4<f32> = where_was(h, back);
      let before: vec4<f32> = where_was(h, back + 1u);
      let v: vec2<f32> = select(vec2<f32>(0.0, 0.0), was.xy - before.xy, back + 1u <= min(P.tick, HIST - 1u));
      b = vec4<f32>(was.xy + v * f32(back), was.z, was.w);
      R = sqrt((px - b.x) * (px - b.x) + (py - b.y) * (py - b.y)) / f32(P.K);
    }
    e[0u] = b.z;
    e[1u] = shell_at(max(R, (0.5)));
    e[2u] = reach_at(max(R, 0.0));
    total = total + summand();
  }
  e[3u] = total;
  return record_of();
}

fn mcell(x: i32, y: i32) -> i32 { if (x < 0 || y < 0 || x >= i32(P.N) || y >= i32(P.N)) { return -1; } return y * i32(P.N) + x; }

fn behind(z: u32, b: u32, c: u32) -> f32 {
  let px: f32 = f32(c % P.N) - dir[b].z;
  let py: f32 = f32(c / P.N) - dir[b].w;
  let x0: i32 = i32(floor(px));
  let y0: i32 = i32(floor(py));
  let fx: f32 = px - floor(px);
  let fy: f32 = py - floor(py);
  let base: u32 = z * P.cells * P.A + b * P.cells;
  var got: f32 = 0.0;
  let c00: i32 = mcell(x0, y0);
  let c10: i32 = mcell(x0 + 1, y0);
  let c01: i32 = mcell(x0, y0 + 1);
  let c11: i32 = mcell(x0 + 1, y0 + 1);
  if (c00 >= 0) { got = got + (1.0 - fx) * (1.0 - fy) * st[base + u32(c00)]; }
  if (c10 >= 0) { got = got + fx * (1.0 - fy) * st[base + u32(c10)]; }
  if (c01 >= 0) { got = got + (1.0 - fx) * fy * st[base + u32(c01)]; }
  if (c11 >= 0) { got = got + fx * fy * st[base + u32(c11)]; }
  return got;
}

fn shift(b: u32, c: u32) -> f32 {
  let s: f32 = (cel[3u * P.cells + c] * dir[b].x - cel[2u * P.cells + c] * dir[b].y) * f32(P.A) / 6.283185307179586;
  return clamp(s, -1.0, 1.0);
}

//! kernel SNAP over cells*A
@compute @workgroup_size(64) fn SNAP(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i: u32 = gid.y * 1024u * 64u + gid.x;
  if (i >= P.cells * P.A) { return; }
  st[P.cells * P.A + i] = st[i];
  st[8u * P.cells * P.A + i] = st[3u * P.cells * P.A + i];
  st[2u * P.cells * P.A + i] = 0.0;
  st[4u * P.cells * P.A + i] = 0.0;
  st[5u * P.cells * P.A + i] = 0.0;
  st[6u * P.cells * P.A + i] = 0.0;
  st[7u * P.cells * P.A + i] = 0.0;
  for (var z: u32 = 0u; z < P.tags - 1u; z = z + 1u) {
    st[(10u + 2u * z) * P.cells * P.A + i] = 0.0;
  }
}

//! kernel CLEAR over cells
@compute @workgroup_size(64) fn CLEAR(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i: u32 = gid.y * 1024u * 64u + gid.x;
  if (i >= P.cells) { return; }
  cel[3u * P.cells + i] = 0.0;
  cel[6u * P.cells + i] = 0.0;
}

//! kernel SWEEP over cells
@compute @workgroup_size(64) fn SWEEP(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i: u32 = gid.y * 1024u * 64u + gid.x;
  let c: u32 = i;
  if (i >= P.cells) { return; }
  var s: f32 = 0.0;
  for (var a: u32 = 0u; a < P.A; a = a + 1u) {
    s = s + clampf(st[wA(a, c)], 0.0, 1.0);
  }
  cel[0u * P.cells + c] = s / f32_of_u(P.A);
}

//! kernel GATHER over holes*A
@compute @workgroup_size(64) fn GATHER(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i: u32 = gid.y * 1024u * 64u + gid.x;
  if (i >= P.holes * P.A) { return; }
  let h: u32 = i / P.A;
  let a: u32 = i % P.A;
  let cx: i32 = i32_of_f(dir[P.A + h].x);
  let cy: i32 = i32_of_f(dir[P.A + h].y);
  st[sA(0u, i)] = 0.0;
  st[sA(0u, P.holes * P.A + i)] = 0.0;
  if (cx < 0 || cy < 0 || cx >= i32_of_u(P.N) || cy >= i32_of_u(P.N)) { return; }
  let c: u32 = u32_of_i(cy) * P.N + u32_of_i(cx);
  st[sA(0u, i)] = view(a, c);
  st[sA(0u, P.holes * P.A + i)] = st[gA(a, c)];
  let nx: i32 = cx + i32_of_f(select(-floor(0.5 - dir[a].z), floor(dir[a].z + 0.5), dir[a].z >= 0.0));
  let ny: i32 = cy + i32_of_f(select(-floor(0.5 - dir[a].w), floor(dir[a].w + 0.5), dir[a].w >= 0.0));
  let inside: u32 = select(0u, 1u, nx >= 0 && ny >= 0 && nx < i32_of_u(P.N) && ny < i32_of_u(P.N));
  let nc: u32 = select(0u, u32_of_i(ny) * P.N + u32_of_i(nx), inside == 1u);
  for (var b: u32 = 0u; b < P.A; b = b + 1u) {
    st[sA(0u, 2u * P.holes * P.A + i * P.A + b)] = select(0.0, st[gA(b, nc)], inside == 1u);
  }
  for (var b: u32 = 0u; b < P.A; b = b + 1u) {
    st[sA(0u, (2u + P.A) * P.holes * P.A + i * P.A + b)] = select(0.0, st[swA(b, nc)], inside == 1u);
  }
  st[sA(0u, (2u + 2u * P.A) * P.holes * P.A + i)] = st[swA(a, c)];
}

//! kernel APPLY over one
@compute @workgroup_size(64) fn APPLY(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i: u32 = gid.y * 1024u * 64u + gid.x;
  if (i >= 1u) { return; }
  for (var e: u32 = 0u; e < P.entries; e = e + 1u) {
    let k: u32 = u32_of_i(i32_of_f(dir[P.A + 64u + e].x));
    let amount: f32 = dir[P.A + 64u + e].y;
    let tag: i32 = i32_of_f(dir[P.A + 64u + e].z);
    let kind: f32 = dir[P.A + 64u + e].w;
    st[2u * P.cells * P.A + k] = st[2u * P.cells * P.A + k] + amount;
    if (kind < 0.5) {
      st[5u * P.cells * P.A + k] = st[5u * P.cells * P.A + k] + amount;
    } else {
      st[6u * P.cells * P.A + k] = st[6u * P.cells * P.A + k] + amount;
      if (tag > 0 && tag < i32_of_u(P.tags)) { st[(10u + 2u * u32_of_i(tag - 1)) * P.cells * P.A + k] = st[(10u + 2u * u32_of_i(tag - 1)) * P.cells * P.A + k] + amount; }
    }
  }
}

//! kernel MEET0 over cells
@compute @workgroup_size(64) fn MEET0(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i: u32 = gid.y * 1024u * 64u + gid.x;
  let c: u32 = i;
  if (i >= P.cells) { return; }
  let rho: f32 = cel[0u * P.cells + c];
  let nf: f32 = cel[1u * P.cells + c];
  var dSpace: f32 = 0.0;
  var gone: f32 = 0.0;
  var cross: f32 = 0.0;
  for (var a: u32 = 0u; a < P.A; a = a + 1u) {
    let o: u32 = opp(a);
    var facing: f32 = 0.0;
    var mixed: f32 = 0.0;
    var inside: f32 = 0.0;
    var there_b: f32 = 0.0;
    for (var q: u32 = 0u; q < 4u; q = q + 1u) {
      let to: i32 = tap(c, a, 1.0, q);
      let tw: f32 = tapw(c, a, 1.0, q);
      if (to >= 0) {
        inside = inside + tw;
        let j: u32 = o * P.cells + u32_of_i(to);
        let aj: f32 = clampf(st[P.cells * P.A + j], 0.0, 1.0);
        facing = facing + tw * aj;
        mixed = mixed + tw * aj * crossing(a * P.cells + c, j);
        there_b = there_b + tw * bodily(j);
      }
    }
    if (inside < 1.0) {
      let jm: u32 = o * P.cells + c;
      let am: f32 = clampf(st[P.cells * P.A + jm], 0.0, 1.0);
      facing = facing + (1.0 - inside) * am;
      mixed = mixed + (1.0 - inside) * am * crossing(a * P.cells + c, jm);
      there_b = there_b + (1.0 - inside) * bodily(jm);
    }
      let w: f32 = clampf(st[wA(a, c)], 0.0, 1.0) * facing * meet0_gate(rho, nf);
      if (w > 0.0) {
        st[kA(a, c)] = st[kA(a, c)] + w * meet0_rays(rho, nf) / 2.0;
        let ds: f32 = w * meet0_space(rho, nf) / 2.0;
        dSpace = dSpace + ds * (P.DEG / f32_of_u(P.A));
        let mine: f32 = 0.5 + 0.5 * (bodily(a * P.cells + c) - there_b);
        st[fA(a, c)] = maxf(0.0, st[fA(a, c)] + w * meet0_folds(rho, nf) * mine);
        gone = gone + absf(ds) * (P.DEG / f32_of_u(P.A));
        cross = cross + absf(ds) * (P.DEG / f32_of_u(P.A)) * mixed / maxf(facing, 0.000000000001);
      }
  }
  cel[2u * P.cells + c] = cel[2u * P.cells + c] + dSpace;
  cel[3u * P.cells + c] = cel[3u * P.cells + c] + gone;
  cel[6u * P.cells + c] = cel[6u * P.cells + c] + cross;
}

//! kernel CREATE1 over cells
@compute @workgroup_size(64) fn CREATE1(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i: u32 = gid.y * 1024u * 64u + gid.x;
  let c: u32 = i;
  if (i >= P.cells) { return; }
  let rho: f32 = cel[0u * P.cells + c];
  let nf: f32 = cel[1u * P.cells + c];
  let F: f32 = 1.0;
  let omega: f32 = 1.0;
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  var dSpace: f32 = 0.0;
  let fires0: f32 = clampf((1.0 - rho), 0.0, 1.0) * 1.0;
  if (fires0 > 0.0) {
    for (var a: u32 = 0u; a < P.A; a = a + 1u) {
      st[dA(a, c)] = st[dA(a, c)] + clampf(point0_gate(clampf(st[wA(a, c)], 0.0, 1.0), nf), 0.0, 1.0) * 1.0 * (DEG) / DEG;
    }
    dSpace = dSpace + fires0 * (0.0);
    let df0: f32 = fires0 * (0.0) / DEG;
    for (var a: u32 = 0u; a < P.A; a = a + 1u) {
      st[fA(a, c)] = maxf(0.0, st[fA(a, c)] + df0);
    }
  }
  let fires1: f32 = clampf(((nf / DEG) * ((1.0 - rho))), 0.0, 1.0) * 1.0;
  if (fires1 > 0.0) {
    for (var a: u32 = 0u; a < P.A; a = a + 1u) {
      st[dA(a, c)] = st[dA(a, c)] + fires1 * (0.0) / DEG;
    }
    dSpace = dSpace + fires1 * (0.0);
    let df1: f32 = fires1 * ((-DEG)) / DEG;
    for (var a: u32 = 0u; a < P.A; a = a + 1u) {
      st[fA(a, c)] = maxf(0.0, st[fA(a, c)] + df1);
    }
  }
  let fires2: f32 = clampf((nf * ((1.0 - rho))), 0.0, 1.0) * 1.0;
  if (fires2 > 0.0) {
    for (var a: u32 = 0u; a < P.A; a = a + 1u) {
      st[dA(a, c)] = st[dA(a, c)] + fires2 * (0.0) / DEG;
    }
    dSpace = dSpace + fires2 * (1.0);
    let df2: f32 = fires2 * (0.0) / DEG;
    for (var a: u32 = 0u; a < P.A; a = a + 1u) {
      st[fA(a, c)] = maxf(0.0, st[fA(a, c)] + df2);
    }
  }
  cel[2u * P.cells + c] = cel[2u * P.cells + c] + dSpace;
}

//! kernel CREATE2 over cells
@compute @workgroup_size(64) fn CREATE2(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i: u32 = gid.y * 1024u * 64u + gid.x;
  let c: u32 = i;
  if (i >= P.cells) { return; }
  let rho: f32 = cel[0u * P.cells + c];
  let nf: f32 = cel[1u * P.cells + c];
  let F: f32 = 1.0;
  let omega: f32 = 1.0;
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  var dSpace: f32 = 0.0;
  let fires3: f32 = clampf((1.0 - omega), 0.0, 1.0) * rho;
  if (fires3 > 0.0) {
    for (var a: u32 = 0u; a < P.A; a = a + 1u) {
      st[dA(a, c)] = st[dA(a, c)] + fires3 * (0.0) / DEG;
    }
    dSpace = dSpace + fires3 * (1.0);
    let df3: f32 = fires3 * (0.0) / DEG;
    for (var a: u32 = 0u; a < P.A; a = a + 1u) {
      st[fA(a, c)] = maxf(0.0, st[fA(a, c)] + df3);
    }
  }
  cel[2u * P.cells + c] = cel[2u * P.cells + c] + dSpace;
}

//! kernel TAKE over cells*A
@compute @workgroup_size(64) fn TAKE(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i: u32 = gid.y * 1024u * 64u + gid.x;
  if (i >= P.cells * P.A) { return; }
  st[4u * P.cells * P.A + i] = st[4u * P.cells * P.A + i] + st[7u * P.cells * P.A + i];
  st[7u * P.cells * P.A + i] = 0.0;
}

//! kernel TOTAL over cells
@compute @workgroup_size(64) fn TOTAL(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i: u32 = gid.y * 1024u * 64u + gid.x;
  let c: u32 = i;
  if (i >= P.cells) { return; }
  var nf: f32 = 0.0;
  for (var b: u32 = 0u; b < P.A; b = b + 1u) {
    nf = nf + maxf(0.0, st[gA(b, c)]);
  }
  nf = nf * (P.DEG / f32_of_u(P.A));
  cel[1u * P.cells + c] = nf;
  cel[4u * P.cells + c] = 1.0 / (1.0 + nf);
}

//! kernel LOCATE over cells
@compute @workgroup_size(64) fn LOCATE(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i: u32 = gid.y * 1024u * 64u + gid.x;
  let c: u32 = i;
  if (i >= P.cells) { return; }
  var total: f32 = 0.0;
  var now: f32 = 0.0;
  for (var b: u32 = 0u; b < P.A; b = b + 1u) {
    let h: i32 = hopc(c, b);
    let j: u32 = opp(b) * P.cells + u32_of_i(h);
    let s: f32 = select(0.0, clampf(st[8u * P.cells * P.A + j] * (P.DEG / f32_of_u(P.A)), 0.0, 1.0), h >= 0);
    let r: f32 = select(0.0, maxf(0.0, (st[3u * P.cells * P.A + j] - st[8u * P.cells * P.A + j]) * (P.DEG / f32_of_u(P.A))), h >= 0);
    total = total + s;
    now = now + r;
  }
  let inside: f32 = clampf(now, 0.0, 1.0);
  for (var b: u32 = 0u; b < P.A; b = b + 1u) {
    let h: i32 = hopc(c, b);
    let j: u32 = opp(b) * P.cells + u32_of_i(h);
    let s: f32 = select(0.0, clampf(st[8u * P.cells * P.A + j] * (P.DEG / f32_of_u(P.A)), 0.0, 1.0), h >= 0);
    let r: f32 = select(0.0, maxf(0.0, (st[3u * P.cells * P.A + j] - st[8u * P.cells * P.A + j]) * (P.DEG / f32_of_u(P.A))), h >= 0);
    st[swA(b, c)] = select(0.0, inside * r / now, now > 0.0);
  }
  cel[(7u + P.tags) * P.cells + c] = inside;
}

//! kernel CARRY over cells*A
@compute @workgroup_size(64) fn CARRY(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i: u32 = gid.y * 1024u * 64u + gid.x;
  if (i >= P.cells * P.A) { return; }
  let a: u32 = i / P.cells;
  let c: u32 = i % P.cells;
  var got: f32 = 0.0;
  for (var q: u32 = 0u; q < 4u; q = q + 1u) {
    let src: i32 = tap(c, a, -1.0, q);
    if (src >= 0) {
      let sw: f32 = tapw(c, a, -1.0, q);
      got = got + sw * moving(a, u32_of_i(src)) * cel[4u * P.cells + u32_of_i(src)] * (1.0 - owns(u32_of_i(src), a));
    }
  }
  for (var q: u32 = 0u; q < 4u; q = q + 1u) {
    let src2: i32 = tap(c, a, -2.0, q);
    if (src2 >= 0) {
      let sw2: f32 = tapw(c, a, -2.0, q);
      got = got + sw2 * moving(a, u32_of_i(src2)) * cel[4u * P.cells + u32_of_i(src2)] * owns(u32_of_i(src2), a);
      let fa: f32 = st[gA(a, u32_of_i(src2))];
      if (fa > 0.0) {
      for (var b: u32 = 0u; b < P.A; b = b + 1u) {
        got = got + sw2 * moving(b, u32_of_i(src2)) * fa * cel[4u * P.cells + u32_of_i(src2)] * (P.DEG / f32_of_u(P.A));
      }
      }
    }
  }
  st[sA(a, c)] = got;
}

//! kernel FUNNEL over cells*A
@compute @workgroup_size(64) fn FUNNEL(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i: u32 = gid.y * 1024u * 64u + gid.x;
  if (i >= P.cells * P.A) { return; }
  let a: u32 = i / P.cells;
  let c: u32 = i % P.cells;
  var stays: f32 = 1.0;
  var got: f32 = 0.0;
  let own: f32 = select(0.0, st[swA(opp(a), c)], hopc(c, opp(a)) >= 0);
  let mine_t: f32 = cel[(7u + P.tags) * P.cells + c] - own;
  let mine_s: f32 = select(1.0, 1.0 / mine_t, mine_t > 1.0);
  for (var b: u32 = 0u; b < P.A; b = b + 1u) {
    if (b != opp(a)) {
      let h: i32 = hopc(c, b);
      if (h >= 0) { stays = stays - st[swA(b, c)] * mine_s; }
      let q: i32 = hopc(c, opp(b));
      if (q >= 0) {
        let q_own: f32 = select(0.0, st[swA(opp(a), u32_of_i(q))], hopc(u32_of_i(q), opp(a)) >= 0);
        let q_t: f32 = cel[(7u + P.tags) * P.cells + u32_of_i(q)] - q_own;
        let q_s: f32 = select(1.0, 1.0 / q_t, q_t > 1.0);
        got = got + st[sA(a, u32_of_i(q))] * st[swA(b, u32_of_i(q))] * q_s;
      }
    }
  }
  st[nA(a, c)] = got + st[sA(a, c)] * maxf(0.0, stays);
}

//! kernel TAGCARRY over cells*A
@compute @workgroup_size(64) fn TAGCARRY(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i: u32 = gid.y * 1024u * 64u + gid.x;
  if (i >= P.cells * P.A) { return; }
  let a: u32 = i / P.cells;
  let c: u32 = i % P.cells;
  var got: f32 = 0.0;
  for (var q: u32 = 0u; q < 4u; q = q + 1u) {
    let src: i32 = tap(c, a, -1.0, q);
    if (src >= 0) {
      let sw: f32 = tapw(c, a, -1.0, q);
      got = got + sw * moving_of(P.z, a, u32_of_i(src)) * cel[4u * P.cells + u32_of_i(src)] * (1.0 - owns(u32_of_i(src), a));
    }
  }
  for (var q: u32 = 0u; q < 4u; q = q + 1u) {
    let src2: i32 = tap(c, a, -2.0, q);
    if (src2 >= 0) {
      let sw2: f32 = tapw(c, a, -2.0, q);
      got = got + sw2 * moving_of(P.z, a, u32_of_i(src2)) * cel[4u * P.cells + u32_of_i(src2)] * owns(u32_of_i(src2), a);
      let fa: f32 = st[gA(a, u32_of_i(src2))];
      if (fa > 0.0) {
      for (var b: u32 = 0u; b < P.A; b = b + 1u) {
        got = got + sw2 * moving_of(P.z, b, u32_of_i(src2)) * fa * cel[4u * P.cells + u32_of_i(src2)] * (P.DEG / f32_of_u(P.A));
      }
      }
    }
  }
  st[sA(a, c)] = got;
}

//! kernel TAGFUNNEL over cells*A
@compute @workgroup_size(64) fn TAGFUNNEL(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i: u32 = gid.y * 1024u * 64u + gid.x;
  if (i >= P.cells * P.A) { return; }
  let a: u32 = i / P.cells;
  let c: u32 = i % P.cells;
  var stays: f32 = 1.0;
  var got: f32 = 0.0;
  let own: f32 = select(0.0, st[swA(opp(a), c)], hopc(c, opp(a)) >= 0);
  let mine_t: f32 = cel[(7u + P.tags) * P.cells + c] - own;
  let mine_s: f32 = select(1.0, 1.0 / mine_t, mine_t > 1.0);
  for (var b: u32 = 0u; b < P.A; b = b + 1u) {
    if (b != opp(a)) {
      let h: i32 = hopc(c, b);
      if (h >= 0) { stays = stays - st[swA(b, c)] * mine_s; }
      let q: i32 = hopc(c, opp(b));
      if (q >= 0) {
        let q_own: f32 = select(0.0, st[swA(opp(a), u32_of_i(q))], hopc(u32_of_i(q), opp(a)) >= 0);
        let q_t: f32 = cel[(7u + P.tags) * P.cells + u32_of_i(q)] - q_own;
        let q_s: f32 = select(1.0, 1.0 / q_t, q_t > 1.0);
        got = got + st[sA(a, u32_of_i(q))] * st[swA(b, u32_of_i(q))] * q_s;
      }
    }
  }
  st[bA(P.z, a, c)] = got + st[sA(a, c)] * maxf(0.0, stays);
}

//! kernel SETTLE over cells*A
@compute @workgroup_size(64) fn SETTLE(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i: u32 = gid.y * 1024u * 64u + gid.x;
  if (i >= P.cells * P.A) { return; }
  st[i] = st[i] + st[2u * P.cells * P.A + i];
  for (var z: u32 = 0u; z < P.tags - 1u; z = z + 1u) {
    st[(9u + 2u * z) * P.cells * P.A + i] = st[(9u + 2u * z) * P.cells * P.A + i] + st[(10u + 2u * z) * P.cells * P.A + i];
  }
}

//! kernel ARRIVED over cells
@compute @workgroup_size(64) fn ARRIVED(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i: u32 = gid.y * 1024u * 64u + gid.x;
  let c: u32 = i;
  if (i >= P.cells) { return; }
  var total: f32 = 0.0;
  var others: f32 = 0.0;
  var got: f32 = 0.0;
  for (var a: u32 = 0u; a < P.A; a = a + 1u) {
    total = total + st[nA(a, c)];
  }
  for (var z: u32 = 0u; z < P.tags - 1u; z = z + 1u) {
    got = 0.0;
    for (var a: u32 = 0u; a < P.A; a = a + 1u) {
      got = got + st[bA(z, a, c)];
    }
    others = others + got;
    cel[(8u + z) * P.cells + c] = got * (P.DEG / f32_of_u(P.A));
  }
  cel[7u * P.cells + c] = maxf(0.0, total - others) * (P.DEG / f32_of_u(P.A));
}

//! kernel MRECORD over cells
@compute @workgroup_size(64) fn MRECORD(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i: u32 = gid.y * 1024u * 64u + gid.x;
  let c: u32 = i;
  if (i >= P.cells) { return; }
  mfill();
  let px: f32 = f32(c % P.N);
  let py: f32 = f32(c / P.N);
  let h: f32 = 0.25 * f32(P.K);
  let rec: f32 = record_at(px, py);
  cel[1u * P.cells + c] = rec;
  cel[2u * P.cells + c] = (record_at(px + h, py) - record_at(px - h, py)) / 0.5;
  cel[3u * P.cells + c] = (record_at(px, py + h) - record_at(px, py - h)) / 0.5;
}

//! kernel MCARRY over cells*A
@compute @workgroup_size(64) fn MCARRY(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i: u32 = gid.y * 1024u * 64u + gid.x;
  if (i >= P.cells * P.A) { return; }
  let a: u32 = i / P.cells;
  let c: u32 = i % P.cells;
  let z: u32 = P.z;
  let l: u32 = (a + P.A - 1u) % P.A;
  let r: u32 = (a + 1u) % P.A;
  let s: f32 = shift(a, c);
  var got: f32 = behind(z, a, c) * (1.0 - abs(s));
  let sl: f32 = shift(l, c);
  if (sl > 0.0) { got = got + behind(z, l, c) * sl; }
  let sr: f32 = shift(r, c);
  if (sr < 0.0) { got = got + behind(z, r, c) * (-sr); }
  st[(P.tags - 1u) * P.cells * P.A + i] = got;
}

//! kernel MSETTLE over cells*A
@compute @workgroup_size(64) fn MSETTLE(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i: u32 = gid.y * 1024u * 64u + gid.x;
  if (i >= P.cells * P.A) { return; }
  st[P.z * P.cells * P.A + i] = st[(P.tags - 1u) * P.cells * P.A + i];
}

//! kernel MSHINE over one
@compute @workgroup_size(64) fn MSHINE(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i: u32 = gid.y * 1024u * 64u + gid.x;
  if (i >= 1u) { return; }
  for (var k: u32 = 0u; k < P.entries; k = k + 1u) {
    let en: vec4<f32> = dir[P.A + MAXH + CN + k];
    let c: u32 = u32(i32(en.x));
    let z: u32 = u32(i32(en.z));
    for (var a: u32 = 0u; a < P.A; a = a + 1u) { st[z * P.cells * P.A + a * P.cells + c] = st[z * P.cells * P.A + a * P.cells + c] + en.y; }
  }
}

//! kernel MSWEEP over cells
@compute @workgroup_size(64) fn MSWEEP(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i: u32 = gid.y * 1024u * 64u + gid.x;
  let c: u32 = i;
  if (i >= P.cells) { return; }
  var all: f32 = 0.0;
  var means: array<f32, 16>;
  for (var z: u32 = 0u; z < P.tags - 1u; z = z + 1u) {
    var got: f32 = 0.0;
    for (var a: u32 = 0u; a < P.A; a = a + 1u) { got = got + st[z * P.cells * P.A + a * P.cells + c]; }
    all = all + got;
    if (z < 16u) { means[z] = min(1.0, got / f32(P.A)); }
    cel[(8u + z) * P.cells + c] = got * (P.DEG / f32(P.A));
  }
  let rho0: f32 = xc(NV + 1u);
  cel[7u * P.cells + c] = rho0 * P.DEG;
  let rho: f32 = min(1.0, rho0 + all / f32(P.A));
  cel[c] = rho;
  let nf: f32 = cel[4u * P.cells + c] + folds_rate(rho, cel[4u * P.cells + c]);
  cel[4u * P.cells + c] = nf;
  var gone: f32 = 0.0;
  for (var z: u32 = 0u; z < min(16u, P.tags - 1u); z = z + 1u) {
    for (var y: u32 = 0u; y < min(16u, P.tags - 1u); y = y + 1u) {
      if (y != z) { gone = gone + means[z] * means[y]; }
    }
  }
  cel[6u * P.cells + c] = gone * xc(NV + 4u) * P.DEG;
}
