//! tick SNAP SWEEP SIGMA CREATE TOTAL MEET TOTAL POOLSUM CARRY SNAP SWEEP TOTAL

fn f32_of_u(x: u32) -> f32 { return f32(x); }
fn i32_of_u(x: u32) -> i32 { return i32(x); }
fn i32_of_f(x: f32) -> i32 { return i32(x); }
fn u32_of_i(x: i32) -> u32 { return u32(x); }
fn absf(x: f32) -> f32 { return abs(x); }
fn maxf(a: f32, b: f32) -> f32 { return max(a, b); }
fn clampf(x: f32, lo: f32, hi: f32) -> f32 { return clamp(x, lo, hi); }
fn rnd(x: f32) -> f32 { return round(x); }

struct Par { cells: u32, A: u32, N: u32, K: u32, DEG: f32, holes: u32, tick: u32, pad: u32 }
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

fn hop(c: u32, a: u32) -> i32 {
  let x: i32 = i32_of_u(c % P.N);
  let y: i32 = i32_of_u(c / P.N);
  let tx: i32 = x + i32_of_f(dir[a].z);
  let ty: i32 = y + i32_of_f(dir[a].w);
  if (tx < 0 || ty < 0 || tx >= i32_of_u(P.N) || ty >= i32_of_u(P.N)) { return -1; }
  return ty * i32_of_u(P.N) + tx;
}

fn back(c: u32, a: u32) -> i32 {
  let x: i32 = i32_of_u(c % P.N);
  let y: i32 = i32_of_u(c / P.N);
  let tx: i32 = x - i32_of_f(dir[a].z);
  let ty: i32 = y - i32_of_f(dir[a].w);
  if (tx < 0 || ty < 0 || tx >= i32_of_u(P.N) || ty >= i32_of_u(P.N)) { return -1; }
  return ty * i32_of_u(P.N) + tx;
}

fn opp(a: u32) -> u32 {
  return (a + P.A / 2u) % P.A;
}

fn facing(a: u32, b: u32) -> f32 {
  return (1.0 - (dir[a].x * dir[b].x + dir[a].y * dir[b].y)) / 2.0;
}

fn toward(a: u32, c: u32) -> f32 {
  return (f32_of_u(P.A) * cel[0u * P.cells + c] - dir[a].x * cel[7u * P.cells + c] - dir[a].y * cel[8u * P.cells + c]) / f32_of_u(P.A);
}

fn standing(a: u32, c: u32) -> f32 {
  var m: f32 = 0.0;
  if (cel[5u * P.cells + c] > 0.5) { m = st[dA(a, c)]; } else { m = st[wA(a, c)] + st[dA(a, c)]; }
  return maxf(0.0, m);
}

fn land(a: u32, c: u32, w: f32, rays: f32, space: f32, folds: f32) -> f32 {
  st[dA(a, c)] = st[dA(a, c)] + w * rays / 4.0;
  let ev: f32 = w * P.DEG / f32_of_u(P.A) / 4.0;
  st[fA(a, c)] = maxf(0.0, st[fA(a, c)] + ev * folds);
  return ev * space;
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
  st[2u * P.cells * P.A + i] = 0.0;
}

//! kernel SWEEP over cells
@compute @workgroup_size(64) fn SWEEP(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i: u32 = gid.y * 1024u * 64u + gid.x;
  let c: u32 = i;
  if (i >= P.cells) { return; }
  var s: f32 = 0.0;
  var mx: f32 = 0.0;
  var my: f32 = 0.0;
  for (var a: u32 = 0u; a < P.A; a = a + 1u) {
    let v: f32 = st[wA(a, c)];
    s = s + v;
    mx = mx + v * dir[a].x;
    my = my + v * dir[a].y;
  }
  cel[0u * P.cells + c] = s / f32_of_u(P.A);
  cel[7u * P.cells + c] = mx;
  cel[8u * P.cells + c] = my;
  cel[3u * P.cells + c] = 0.0;
}

//! kernel SIGMA over holes*A
@compute @workgroup_size(64) fn SIGMA(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i: u32 = gid.y * 1024u * 64u + gid.x;
  if (i >= P.holes * P.A) { return; }
  let h: u32 = i / P.A;
  let a: u32 = i % P.A;
  let hx: f32 = dir[P.A + h].x;
  let hy: f32 = dir[P.A + h].y;
  let hz: f32 = dir[P.A + h].z;
  let cx: i32 = i32_of_f(rnd(hx + f32_of_u(P.K) * dir[a].x));
  let cy: i32 = i32_of_f(rnd(hy + f32_of_u(P.K) * dir[a].y));
  if (cx < 0 || cy < 0 || cx >= i32_of_u(P.N) || cy >= i32_of_u(P.N)) { return; }
  let c: u32 = u32_of_i(cy) * P.N + u32_of_i(cx);
  st[dA(a, c)] = st[dA(a, c)] + hz;
  st[fA(a, c)] = maxf(0.0, st[fA(a, c)] - hz / f32_of_u(P.A));
}

//! kernel CREATE over cells
@compute @workgroup_size(64) fn CREATE(@builtin(global_invocation_id) gid: vec3<u32>) {
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
  let fires0: f32 = clampf((1.0 - pow(rho, DEG)), 0.0, 1.0) * 1.0;
  if (fires0 > 0.0) {
    for (var a: u32 = 0u; a < P.A; a = a + 1u) {
      st[dA(a, c)] = st[dA(a, c)] + fires0 * (DEG) / DEG;
    }
    dSpace = dSpace + fires0 * (1.0);
    let df0: f32 = fires0 * ((-DEG)) / f32_of_u(P.A);
    for (var a: u32 = 0u; a < P.A; a = a + 1u) {
      st[fA(a, c)] = maxf(0.0, st[fA(a, c)] + df0);
    }
  }
  let fires1: f32 = clampf((1.0 - omega), 0.0, 1.0) * rho;
  if (fires1 > 0.0) {
    for (var a: u32 = 0u; a < P.A; a = a + 1u) {
      st[dA(a, c)] = st[dA(a, c)] + fires1 * (0.0) / DEG;
    }
    dSpace = dSpace + fires1 * (1.0);
    let df1: f32 = fires1 * (0.0) / f32_of_u(P.A);
    for (var a: u32 = 0u; a < P.A; a = a + 1u) {
      st[fA(a, c)] = maxf(0.0, st[fA(a, c)] + df1);
    }
  }
  cel[2u * P.cells + c] = cel[2u * P.cells + c] + dSpace;
}

//! kernel TOTAL over cells
@compute @workgroup_size(64) fn TOTAL(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i: u32 = gid.y * 1024u * 64u + gid.x;
  let c: u32 = i;
  if (i >= P.cells) { return; }
  var nf: f32 = 0.0;
  for (var b: u32 = 0u; b < P.A; b = b + 1u) {
    nf = nf + maxf(0.0, st[fA(b, c)]);
  }
  cel[1u * P.cells + c] = nf;
  cel[4u * P.cells + c] = 1.0 / (1.0 + nf);
}

//! kernel MEET over cells
@compute @workgroup_size(64) fn MEET(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i: u32 = gid.y * 1024u * 64u + gid.x;
  let c: u32 = i;
  if (i >= P.cells) { return; }
  let blocked: bool = cel[5u * P.cells + c] > 0.5;
  let rho: f32 = cel[0u * P.cells + c];
  let nf: f32 = cel[1u * P.cells + c];
  var dSpace: f32 = 0.0;
  var gone: f32 = 0.0;
  for (var a: u32 = 0u; a < P.A; a = a + 1u) {
    let o: u32 = opp(a);
    let to: i32 = hop(c, a);
    if (to >= 0 && !blocked) {
      let w: f32 = st[wA(a, c)] * toward(a, u32_of_i(to)) * meet0_gate(rho, nf);
      if (w > 0.0) {
        let ds: f32 = land(a, c, w, meet0_rays(rho, nf), meet0_space(rho, nf), meet0_folds(rho, nf));
        dSpace = dSpace + ds;
        gone = gone + absf(ds);
      }
    }
    let src: i32 = back(c, o);
    if (src >= 0) {
      let sc: u32 = u32_of_i(src);
      if (cel[5u * P.cells + sc] <= 0.5) {
        let r2: f32 = cel[0u * P.cells + sc];
        let f2: f32 = cel[1u * P.cells + sc];
        let w2: f32 = st[wA(o, sc)] * toward(o, c) * meet0_gate(r2, f2);
        if (w2 > 0.0) {
          let ds2: f32 = land(a, c, w2, meet0_rays(r2, f2), meet0_space(r2, f2), meet0_folds(r2, f2));
          dSpace = dSpace + ds2;
          gone = gone + absf(ds2);
        }
      }
    }
  }
  cel[2u * P.cells + c] = cel[2u * P.cells + c] + dSpace;
  cel[3u * P.cells + c] = gone;
}

//! kernel POOLSUM over cells
@compute @workgroup_size(64) fn POOLSUM(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i: u32 = gid.y * 1024u * 64u + gid.x;
  let c: u32 = i;
  if (i >= P.cells) { return; }
  let keeps: f32 = cel[4u * P.cells + c];
  var p: f32 = 0.0;
  for (var a: u32 = 0u; a < P.A; a = a + 1u) {
    let m: f32 = standing(a, c);
    if (m > 0.00000000000001) { p = p + m * (1.0 - keeps); }
  }
  cel[6u * P.cells + c] = p;
}

//! kernel CARRY over cells*A
@compute @workgroup_size(64) fn CARRY(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i: u32 = gid.y * 1024u * 64u + gid.x;
  if (i >= P.cells * P.A) { return; }
  let a: u32 = i / P.cells;
  let c: u32 = i % P.cells;
  var got: f32 = 0.0;
  let src: i32 = back(c, a);
  if (src >= 0) {
    let sc: u32 = u32_of_i(src);
    let m: f32 = standing(a, sc);
    if (m > 0.00000000000001) { got = got + m * cel[4u * P.cells + sc]; }
    let p: f32 = cel[6u * P.cells + sc];
    if (p > 0.0) {
      let nf: f32 = cel[1u * P.cells + sc];
      var part: f32 = 1.0 / f32_of_u(P.A);
      if (nf > 0.0) { part = st[fA(a, sc)] / nf; }
      got = got + p * part;
    }
  }
  st[nA(a, c)] = got;
}
