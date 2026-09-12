//! tick SNAP CLEAR SWEEP TOTAL MEET0 TAKE CREATE1 CREATE2 CARRY TAGCARRY@z TAGCOPY@z GATHER | APPLY SETTLE SNAP SWEEP ARRIVED

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

fn sA(a: u32, c: u32) -> u32 {
  return (9u + 2u * (P.tags - 1u)) * P.cells * P.A + a * P.cells + c;
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
  if (cx < 0 || cy < 0 || cx >= i32_of_u(P.N) || cy >= i32_of_u(P.N)) { return; }
  let c: u32 = u32_of_i(cy) * P.N + u32_of_i(cx);
  st[sA(0u, i)] = view(a, c);
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
  if (cel[5u * P.cells + c] > 0.5) { return; }
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
    for (var q: u32 = 0u; q < 4u; q = q + 1u) {
      let to: i32 = tap(c, a, 1.0, q);
      let tw: f32 = tapw(c, a, 1.0, q);
      if (to >= 0) {
        inside = inside + tw;
        if (cel[5u * P.cells + u32_of_i(to)] <= 0.5) {
          let j: u32 = o * P.cells + u32_of_i(to);
          let aj: f32 = clampf(st[P.cells * P.A + j], 0.0, 1.0);
          facing = facing + tw * aj;
          mixed = mixed + tw * aj * crossing(a * P.cells + c, j);
        }
      }
    }
    if (inside < 1.0) {
      let jm: u32 = o * P.cells + c;
      let am: f32 = clampf(st[P.cells * P.A + jm], 0.0, 1.0);
      facing = facing + (1.0 - inside) * am;
      mixed = mixed + (1.0 - inside) * am * crossing(a * P.cells + c, jm);
    }
      let w: f32 = clampf(st[wA(a, c)], 0.0, 1.0) * facing * meet0_gate(rho, nf);
      if (w > 0.0) {
        st[kA(a, c)] = st[kA(a, c)] + w * meet0_rays(rho, nf) / 2.0;
        let ds: f32 = w * meet0_space(rho, nf) / 2.0;
        dSpace = dSpace + ds * (P.DEG / f32_of_u(P.A));
        st[fA(a, c)] = maxf(0.0, st[fA(a, c)] + w * meet0_folds(rho, nf) / 2.0);
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
  if (cel[5u * P.cells + c] > 0.5) { return; }
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
      st[dA(a, c)] = st[dA(a, c)] + fires0 * (DEG) / DEG * (1.0 - clampf(st[wA(a, c)], 0.0, 1.0));
    }
    dSpace = dSpace + fires0 * (1.0);
    let df0: f32 = fires0 * ((-DEG)) / DEG;
    for (var a: u32 = 0u; a < P.A; a = a + 1u) {
      st[fA(a, c)] = maxf(0.0, st[fA(a, c)] + df0);
    }
  }
  cel[2u * P.cells + c] = cel[2u * P.cells + c] + dSpace;
}

//! kernel CREATE2 over cells
@compute @workgroup_size(64) fn CREATE2(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i: u32 = gid.y * 1024u * 64u + gid.x;
  let c: u32 = i;
  if (i >= P.cells) { return; }
  if (cel[5u * P.cells + c] > 0.5) { return; }
  let rho: f32 = cel[0u * P.cells + c];
  let nf: f32 = cel[1u * P.cells + c];
  let F: f32 = 1.0;
  let omega: f32 = 1.0;
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  var dSpace: f32 = 0.0;
  let fires0: f32 = clampf((1.0 - omega), 0.0, 1.0) * rho;
  if (fires0 > 0.0) {
    for (var a: u32 = 0u; a < P.A; a = a + 1u) {
      st[dA(a, c)] = st[dA(a, c)] + fires0 * (0.0) / DEG * 1.0;
    }
    dSpace = dSpace + fires0 * (1.0);
    let df0: f32 = fires0 * (0.0) / DEG;
    for (var a: u32 = 0u; a < P.A; a = a + 1u) {
      st[fA(a, c)] = maxf(0.0, st[fA(a, c)] + df0);
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
      got = got + sw * moving(a, u32_of_i(src)) * cel[4u * P.cells + u32_of_i(src)];
      let fa: f32 = st[gA(a, u32_of_i(src))];
      if (fa > 0.0) {
      for (var b: u32 = 0u; b < P.A; b = b + 1u) {
        got = got + sw * moving(b, u32_of_i(src)) * fa * cel[4u * P.cells + u32_of_i(src)] * (P.DEG / f32_of_u(P.A));
      }
      }
    }
  }
  st[nA(a, c)] = got;
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
      got = got + sw * moving_of(P.z, a, u32_of_i(src)) * cel[4u * P.cells + u32_of_i(src)];
      let fa: f32 = st[gA(a, u32_of_i(src))];
      if (fa > 0.0) {
      for (var b: u32 = 0u; b < P.A; b = b + 1u) {
        got = got + sw * moving_of(P.z, b, u32_of_i(src)) * fa * cel[4u * P.cells + u32_of_i(src)] * (P.DEG / f32_of_u(P.A));
      }
      }
    }
  }
  st[sA(a, c)] = got;
}

//! kernel TAGCOPY over cells*A
@compute @workgroup_size(64) fn TAGCOPY(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i: u32 = gid.y * 1024u * 64u + gid.x;
  if (i >= P.cells * P.A) { return; }
  st[(9u + 2u * P.z) * P.cells * P.A + i] = st[(9u + 2u * (P.tags - 1u)) * P.cells * P.A + i];
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
