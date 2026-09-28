//! tick SNAP CLEAR SWEEP TOTAL MEET0 TAKE CREATE1 CREATE2 LOCATE CARRY FUNNEL TAGCARRY@z TAGFUNNEL@z GATHER | APPLY SETTLE SNAP SWEEP ARRIVED

fn f32_of_u(x: u32) -> f32 { return f32(x); }
fn i32_of_u(x: u32) -> i32 { return i32(x); }
fn i32_of_f(x: f32) -> i32 { return i32(x); }
fn u32_of_i(x: i32) -> u32 { return u32(x); }
fn absf(x: f32) -> f32 { return abs(x); }
fn maxf(a: f32, b: f32) -> f32 { return max(a, b); }
fn clampf(x: f32, lo: f32, hi: f32) -> f32 { return clamp(x, lo, hi); }
fn rnd(x: f32) -> f32 { return round(x); }

struct Par { cells: u32, A: u32, N: u32, K: u32, DEG: f32, holes: u32, tick: u32, tags: u32, z: u32, entries: u32, outs: u32, bod: u32, beam: u32, whom: u32, track: u32, rungs: u32, span: u32, part: u32, first: u32, fill: u32 }
@group(0) @binding(0) var<uniform> P: Par;
@group(0) @binding(1) var<storage, read_write> st: array<f32>;
@group(0) @binding(2) var<storage, read_write> cel: array<f32>;
@group(0) @binding(3) var<storage, read> dir: array<vec4<f32>>;
@group(0) @binding(4) var<storage, read_write> ho: array<f32>;
@group(0) @binding(5) var<storage, read_write> hn: array<f32>;
@group(0) @binding(6) var<storage, read_write> link: array<atomic<i32>>;
@group(0) @binding(7) var<storage, read_write> sb0: array<u32>;
@group(0) @binding(8) var<storage, read_write> sb1: array<u32>;
@group(0) @binding(9) var<storage, read_write> sb2: array<u32>;
@group(0) @binding(10) var<storage, read_write> sb3: array<u32>;
@group(0) @binding(11) var<storage, read_write> sb4: array<u32>;
@group(0) @binding(12) var<storage, read_write> sb5: array<u32>;
@group(0) @binding(13) var<storage, read_write> sb6: array<u32>;
@group(0) @binding(14) var<storage, read_write> sb7: array<u32>;

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

fn meet1_gate(rho: f32, nf: f32) -> f32 {
  let F: f32 = 1.0;
  let omega: f32 = 1.0;
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return clampf(0.0, 0.0, 1.0);
}

fn meet1_rays(rho: f32, nf: f32) -> f32 {
  let F: f32 = 1.0;
  let omega: f32 = 1.0;
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return 0.0;
}

fn meet1_space(rho: f32, nf: f32) -> f32 {
  let F: f32 = 1.0;
  let omega: f32 = 1.0;
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return 1.0;
}

fn meet1_folds(rho: f32, nf: f32) -> f32 {
  let F: f32 = 1.0;
  let omega: f32 = 1.0;
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return 0.0;
}

fn meet2_gate(rho: f32, nf: f32) -> f32 {
  let F: f32 = 1.0;
  let omega: f32 = 1.0;
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return clampf(0.0, 0.0, 1.0);
}

fn meet2_rays(rho: f32, nf: f32) -> f32 {
  let F: f32 = 1.0;
  let omega: f32 = 1.0;
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return 0.0;
}

fn meet2_space(rho: f32, nf: f32) -> f32 {
  let F: f32 = 1.0;
  let omega: f32 = 1.0;
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return 1.0;
}

fn meet2_folds(rho: f32, nf: f32) -> f32 {
  let F: f32 = 1.0;
  let omega: f32 = 1.0;
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return 0.0;
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

fn point4_gate(rho: f32, nf: f32) -> f32 {
  let F: f32 = 1.0;
  let omega: f32 = 1.0;
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return clampf(omega, 0.0, 1.0);
}

//! medium MKEEP MCARRY MHWANT MHSTREAM MHSHINE MHJOIN MHFIELD MOPEN MMEET MUNFOLD MMAKE MSETTLE MMOVE MPULLC MPULLH MMOVEH MSTEP MSTEPH MSOURCE MHCLEAR MHLINK MHSCAN MHSCAN2 MHSCAN3 MHPLACE MHSRC1 MHSRC MBLOCK

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

const MAXH: u32 = 64u;

const MAXM: u32 = 1048576u;

const TRACKB: u32 = 64u;

const MPCHUNK: u32 = 64u;

fn mchunks() -> u32 { return select((mplanes() + MPCHUNK - 1u) / MPCHUNK, 1u, mlocal()); }

const MGATHER: u32 = 96u;

fn mapart() -> bool { return xc(22u) > 0.5; }

fn mbin(dx: f32, dy: f32) -> u32 {
  let ang: f32 = atan2(dy, dx);
  let turned: f32 = select(ang, ang + 6.283185307179586, ang < 0.0);
  return u32(floor(turned / 6.283185307179586 * f32(MGATHER) + 0.5)) % MGATHER;
}

fn minside(x: f32, y: f32) -> f32 {
  let x0: f32 = floor(x);
  let y0: f32 = floor(y);
  var got: f32 = 0.0;
  for (var j: i32 = 0; j < 2; j = j + 1) {
    for (var i: i32 = 0; i < 2; i = i + 1) {
      if (mcell(i32(x0) + i, i32(y0) + j) >= 0) { got = got + max(0.0, 1.0 - abs(x - x0 - f32(i))) * max(0.0, 1.0 - abs(y - y0 - f32(j))); }
    }
  }
  return got;
}

fn mlocal() -> bool { return xc(23u) > 0.5; }

fn mslots() -> u32 { return u32(xc(23u)); }

const MLIST: u32 = 12u;

const MGROUPS: u32 = 64u;

fn mzone() -> f32 { return f32(2u * P.K + 2u); }

fn medge() -> f32 { return mzone() + 0.5005; }

fn mwindow() -> u32 { let s: f32 = 1.4142135623730951 / (mzone() - f32(P.K)); return u32(floor(f32(MGATHER) * atan2(s, sqrt(1.0 - s * s)) / 6.283185307179586)) + 2u; }

fn mslot(c: u32, b: u32, s: u32) -> u32 { return ((c * MGATHER + b) * mslots() + s) * 8u; }

fn mmid(c: u32) -> u32 { return P.cells * MGATHER * mslots() * 8u + c; }

fn mway(b: u32) -> vec2<f32> { let a: f32 = 6.283185307179586 * f32(b) / f32(MGATHER); return vec2<f32>(cos(a), sin(a)); }

fn mocc(c: u32, b: u32) -> u32 { return P.cells * MGATHER * mslots() * 8u + P.cells + c * MGATHER + b; }

fn msrc(c: u32) -> u32 { return P.cells * MGATHER * mslots() * 8u + P.cells + P.cells * MGATHER + c * 12u; }

fn msource(c: u32) -> array<f32, 8> {
  var m: array<f32, 8>;
  for (var j: u32 = 0u; j < 8u; j = j + 1u) { m[j] = hn[msrc(c) + j]; }
  return m;
}

fn msourcewas(c: u32) -> array<f32, 8> {
  var m: array<f32, 8>;
  for (var j: u32 = 0u; j < 8u; j = j + 1u) { m[j] = ho[msrc(c) + j]; }
  return m;
}

fn mhas(c: u32, b: u32) -> bool { return hn[mocc(c, b)] > 0.5; }

fn mbits(c: u32, w: u32) -> u32 { return P.cells * MGATHER * mslots() * 8u + P.cells + P.cells * MGATHER + P.cells * 12u + P.cells * 2u + c * 4u + w; }

fn mwant(c: u32, w: u32) -> u32 { return P.cells * MGATHER * mslots() * 8u + P.cells + P.cells * MGATHER + P.cells * 12u + P.cells * 2u + P.cells * 4u + c * 4u + w; }

fn mmark(c: u32, b: u32, on: bool) {
  hn[mocc(c, b)] = select(0.0, 1.0, on);
  let k: u32 = mbits(c, b / 24u);
  var v: u32 = u32(hn[k]);
  let bit: u32 = 1u << (b % 24u);
  if (on) { v = v | bit; } else { v = v & ~bit; }
  hn[k] = f32(v);
}

fn mheld(k: u32) -> array<f32, 8> {
  var m: array<f32, 8>;
  for (var j: u32 = 0u; j < 8u; j = j + 1u) { m[j] = hn[k + j]; }
  return m;
}

fn mwas(k: u32) -> array<f32, 8> {
  var m: array<f32, 8>;
  for (var j: u32 = 0u; j < 8u; j = j + 1u) { m[j] = ho[k + j]; }
  return m;
}

fn mput(k: u32, m: array<f32, 8>) {
  for (var j: u32 = 0u; j < 8u; j = j + 1u) { hn[k + j] = m[j]; }
}

fn mnow(m: array<f32, 8>, x: f32, y: f32) -> vec2<f32> {
  let sx: f32 = m[1] / m[0];
  let sy: f32 = m[2] / m[0];
  let age: f32 = sqrt((x - sx) * (x - sx) + (y - sy) * (y - sy)) / f32(P.K);
  return vec2<f32>(sx + m[3] / m[0] * age, sy + m[4] / m[0] * age);
}

fn mreads(m: array<f32, 8>, x: f32, y: f32) -> vec3<f32> {
  if (!(m[0] > 0.0)) { return vec3<f32>(0.0, 0.0, 0.0); }
  let s: vec2<f32> = mnow(m, x, y);
  let dx: f32 = x - s.x;
  let dy: f32 = y - s.y;
  let d: f32 = sqrt(dx * dx + dy * dy);
  let r: f32 = max(m[5] / m[0], d / f32(P.K));
  let got: f32 = min(1.0, m[0] / pow(r, xc(6u) - 1.0) * select(1.0, mspread_of(m, d), r > m[5] / m[0]));
  if (d <= 0.0) { return vec3<f32>(got, 0.0, 0.0); }
  return vec3<f32>(got, dx / d, dy / d);
}

fn mspread_with(a: array<f32, 8>, b: array<f32, 8>, x: f32, y: f32) -> f32 {
  if (!(a[0] > 0.0 && b[0] > 0.0)) { return a[7] + b[7]; }
  let q: f32 = a[0] + b[0];
  let ex: f32 = x - (a[1] + b[1]) / q;
  let ey: f32 = y - (a[2] + b[2]) / q;
  let e: f32 = sqrt(ex * ex + ey * ey);
  var along: f32 = 0.0;
  if (e > 0.0) { along = ((a[1] / a[0] - b[1] / b[0]) * ex + (a[2] / a[0] - b[2] / b[0]) * ey) / e; }
  return a[7] + b[7] + a[0] * b[0] / q * along * along;
}

fn mspread_of(m: array<f32, 8>, d: f32) -> f32 {
  let n: f32 = xc(6u) - 1.0;
  if (!(d > 0.0 && m[0] > 0.0)) { return 1.0; }
  return max(0.5, 1.0 + n * (n + 1.0) / 2.0 * m[7] / (m[0] * d * d));
}

fn mjoin(a: array<f32, 8>, b: array<f32, 8>, x: f32, y: f32) -> array<f32, 8> {
  var m: array<f32, 8>;
  for (var j: u32 = 0u; j < 6u; j = j + 1u) { m[j] = a[j] + b[j]; }
  m[6] = select(-1.0, a[6], a[6] == b[6]);
  m[7] = mspread_with(a, b, x, y);
  return m;
}

fn mseen(a: array<f32, 8>, b: array<f32, 8>, x: f32, y: f32) -> f32 {
  let ax: f32 = a[1] / a[0];
  let ay: f32 = a[2] / a[0];
  let bx: f32 = b[1] / b[0];
  let by: f32 = b[2] / b[0];
  let near: f32 = min(sqrt((x - ax) * (x - ax) + (y - ay) * (y - ay)), sqrt((x - bx) * (x - bx) + (y - by) * (y - by)));
  return sqrt((ax - bx) * (ax - bx) + (ay - by) * (ay - by)) / max(near, 1.0);
}

fn mrelaid(m: array<f32, 8>, x: f32, y: f32) -> bool {
  if (m[6] >= 0.0 && u32(m[6]) < P.holes) {
    let o: vec4<f32> = bodat(u32(m[6]));
    return sqrt((x - o.x) * (x - o.x) + (y - o.y) * (y - o.y)) <= medge();
  }
  return mfresh(m, x, y);
}

fn mshrink(l0: array<array<f32, 8>, MLIST>, n: u32, x: f32, y: f32) -> array<array<f32, 8>, MLIST> {
  var l: array<array<f32, 8>, MLIST> = l0;
  var best: f32 = 0.0;
  var bi: i32 = -1;
  var bj: i32 = -1;
  for (var tries: u32 = 0u; tries < 2u; tries = tries + 1u) {
    if (bi >= 0) { break; }
    for (var i: u32 = 0u; i < n; i = i + 1u) {
      for (var j: u32 = i + 1u; j < n; j = j + 1u) {
        if (tries == 0u && mfresh(l[i], x, y) != mfresh(l[j], x, y)) { continue; }
        let seen: f32 = mseen(l[i], l[j], x, y);
        if (bi < 0 || seen < best) { best = seen; bi = i32(i); bj = i32(j); }
      }
    }
  }
  l[bi] = mjoin(l[bi], l[bj], x, y);
  l[bj] = l[n - 1u];
  return l;
}

fn mfresh(m: array<f32, 8>, x: f32, y: f32) -> bool {
  let s: vec2<f32> = mnow(m, x, y);
  return sqrt((x - s.x) * (x - s.x) + (y - s.y) * (y - s.y)) <= medge();
}

fn mfill(c: u32, b: u32, l0: array<array<f32, 8>, MLIST>, n0: u32) -> u32 {
  var l: array<array<f32, 8>, MLIST> = l0;
  var n: u32 = n0;
  let x: f32 = f32(c % P.N);
  let y: f32 = f32(c / P.N);
  loop {
    if (n <= mslots()) { break; }
    /* two the shine lays anew, or two the stream brought, never one of each (Medium.lay); any pair only where no two are of one kind */
    var best: f32 = 0.0;
    var bi: i32 = -1;
    var bj: i32 = -1;
    for (var tries: u32 = 0u; tries < 2u; tries = tries + 1u) {
      if (bi >= 0) { break; }
      for (var i: u32 = 0u; i < n; i = i + 1u) {
        for (var j: u32 = i + 1u; j < n; j = j + 1u) {
          if (tries == 0u && mfresh(l[i], x, y) != mfresh(l[j], x, y)) { continue; }
          let seen: f32 = mseen(l[i], l[j], x, y);
          if (bi < 0 || seen < best) { best = seen; bi = i32(i); bj = i32(j); }
        }
      }
    }
    l[bi] = mjoin(l[bi], l[bj], x, y);
    l[bj] = l[n - 1u];
    n = n - 1u;
  }
  for (var j: u32 = 0u; j < mslots(); j = j + 1u) {
    if (j < n) { mput(mslot(c, b, j), l[j]); } else { hn[mslot(c, b, j)] = 0.0; }
  }
  return n;
}

fn mlay(c: u32, b: u32, l: array<array<f32, 8>, MLIST>, n: u32) { mmark(c, b, mfill(c, b, l, n) > 0u); }

fn mhaswas(c: u32, b: u32) -> bool { return ho[mocc(c, b)] > 0.5; }

fn memit(h: u32) -> array<f32, 8> {
  let o: vec4<f32> = bodat(h);
  let g: vec4<f32> = bodgo(h);
  let beta: f32 = min(1.0, sqrt(g.x * g.x + g.y * g.y) / o.z);
  let face: f32 = max((0.5), bodface(h));
  let q: f32 = mper_way(o.z, beta) * bodskin(h) * mdrift(h) * pow(face, xc(6u) - 1.0);
  let vx: f32 = g.x / o.z * f32(P.K);
  let vy: f32 = g.y / o.z * f32(P.K);
  var m: array<f32, 8>;
  m[0] = q;
  m[1] = q * o.x;
  m[2] = q * o.y;
  m[3] = q * vx;
  m[4] = q * vy;
  m[5] = q * face;
  m[6] = f32(h);
  return m;
}

fn mleft(e: array<f32, 8>, d: f32) -> array<f32, 8> {
  var m: array<f32, 8> = e;
  let back: f32 = d / f32(P.K);
  m[7] = 0.0;
  m[1] = e[1] - e[3] * back;
  m[2] = e[2] - e[4] * back;
  return m;
}

fn mheldat(c: u32) -> f32 {
  let x: f32 = f32(c % P.N);
  let y: f32 = f32(c / P.N);
  var got: f32 = hn[mmid(c)];
  for (var b: u32 = 0u; b < MGATHER; b = b + 1u) {
    if (!mhas(c, b)) { continue; }
    for (var s: u32 = 0u; s < mslots(); s = s + 1u) {
      let k: u32 = mslot(c, b, s);
      if (hn[k] > 0.0) { got = got + mreads(mheld(k), x, y).x; }
    }
  }
  return got;
}

const MNEARF: f32 = 5.0;

const MNEAR: u32 = 96u;

const MCELLPULL: bool = true;

const MFUSED: bool = true;

fn mtay(c: u32) -> u32 { return P.cells * MGATHER * mslots() * 8u + P.cells + P.cells * MGATHER + P.cells * 12u + P.cells * 2u + P.cells * 8u + c * 9u; }

fn mnear(c: u32) -> u32 { return P.cells * MGATHER * mslots() * 8u + P.cells + P.cells * MGATHER + P.cells * 12u + P.cells * 2u + P.cells * 8u + P.cells * 9u + c * (MNEAR + 1u); }

fn mhot(c: u32) -> u32 { return P.cells * MGATHER * mslots() * 8u + P.cells + P.cells * MGATHER + P.cells * 12u + P.cells * 2u + P.cells * 8u + P.cells * 9u + P.cells * (MNEAR + 1u) + c; }

fn mnb() -> u32 { return (P.cells + 1u + 255u) / 256u; }

fn mstart(c: u32) -> u32 { return P.cells + 1u + c; }

fn mblk(b: u32) -> u32 { return 2u * P.cells + 3u + b; }

fn morder(j: u32) -> u32 { return 2u * P.cells + 3u + mnb() + j; }

fn mcellpull(c: u32) -> u32 { return P.part + select(2u * P.holes, 0u, MCOMPACT) + 2u * c; }

fn mgen(k: u32) -> u32 { return P.track - 16u + k; }

fn mhash(a: u32, b: u32) -> f32 { var z: u32 = a * 747796405u + b * 2891336453u + 12345u; z = (z ^ (z >> 16u)) * 2246822519u; z = (z ^ (z >> 13u)) * 3266489917u; z = z ^ (z >> 16u); return (f32(z >> 8u) + 0.5) / 16777216.0; }

fn mgauss(a: u32, b: u32) -> f32 { return sqrt(-2.0 * log(mhash(a, b))) * cos(6.283185307179586 * mhash(a, b + 7919u)); }

fn mgrid(k: u32) -> u32 { return 10u * P.cells + 4u + k; }

fn mqref() -> f32 { return max(cel[BODS() + 10u], 1e-30); }

fn macc(c: u32, k: u32) -> u32 { return c * 10u + k; }

const MSQ: f32 = 4096.0;

const MSX: f32 = 4096.0;

const MSV: f32 = 16384.0;

fn msrcpart(c: u32, l: u32) -> u32 { return P.part - P.cells * 384u + (c * 32u + l) * 12u; }

fn mtensor(c: u32) -> vec3<f32> { return vec3<f32>(hn[msrc(c) + 8u], hn[msrc(c) + 9u], hn[msrc(c) + 10u]); }

fn mtensorwas(c: u32) -> vec3<f32> { return vec3<f32>(ho[msrc(c) + 8u], ho[msrc(c) + 9u], ho[msrc(c) + 10u]); }

fn mspread_toward(e: array<f32, 8>, t: vec3<f32>, cx: f32, cy: f32, tx: f32, ty: f32) -> f32 {
  if (!(e[0] > 0.0)) { return 0.0; }
  let q: f32 = e[0];
  let mx: f32 = e[1] / q - cx;
  let my: f32 = e[2] / q - cy;
  let sxx: f32 = t.x / q - mx * mx;
  let sxy: f32 = t.y / q - mx * my;
  let syy: f32 = t.z / q - my * my;
  let ux: f32 = tx - e[1] / q;
  let uy: f32 = ty - e[2] / q;
  let d2: f32 = ux * ux + uy * uy;
  if (!(d2 > 0.0)) { return 0.0; }
  let along: f32 = (sxx * ux * ux + 2.0 * sxy * ux * uy + syy * uy * uy) / d2;
  let n: f32 = xc(6u) - 1.0;
  return q * (along - (sxx + syy - along) / (n + 1.0));
}

fn mspread_without(h: u32, mine: array<f32, 8>, tx: f32, ty: f32) -> f32 {
  let o: vec4<f32> = bodat(h);
  let c: i32 = mcell(i32(floor(o.x + 0.5)), i32(floor(o.y + 0.5)));
  if (c < 0) { return 0.0; }
  let cx: f32 = f32(u32(c) % P.N);
  let cy: f32 = f32(u32(c) / P.N);
  var rest: array<f32, 8> = msourcewas(u32(c));
  for (var q: u32 = 0u; q < 6u; q = q + 1u) { rest[q] = rest[q] - mine[q]; }
  let dx: f32 = o.x - cx;
  let dy: f32 = o.y - cy;
  let t: vec3<f32> = mtensorwas(u32(c)) - mine[0] * vec3<f32>(dx * dx, dx * dy, dy * dy);
  return mspread_toward(rest, t, cx, cy, tx, ty);
}

fn mbodycell(h: u32) -> u32 { let o: vec4<f32> = bodat(h); let c: i32 = mcell(i32(floor(o.x + 0.5)), i32(floor(o.y + 0.5))); return select(u32(c), P.cells, c < 0); }

fn mfar(m: array<f32, 8>, ux: f32, uy: f32) -> bool {
  let s: vec2<f32> = mnow(m, ux, uy);
  let d: f32 = sqrt((ux - s.x) * (ux - s.x) + (uy - s.y) * (uy - s.y));
  let r: f32 = d / f32(P.K);
  return d > MNEARF && r > m[5] / m[0] && m[0] / pow(r, xc(6u) - 1.0) < 1.0;
}

fn mtaylor(m: array<f32, 8>, ux: f32, uy: f32) -> array<f32, 9> {
  let s: vec2<f32> = mnow(m, ux, uy);
  let ex: f32 = ux - s.x;
  let ey: f32 = uy - s.y;
  let r2: f32 = ex * ex + ey * ey;
  let Dd: f32 = xc(6u);
  let C: f32 = m[0] * pow(f32(P.K), Dd - 1.0) * mspread_of(m, sqrt(r2));
  let rD: f32 = pow(r2, Dd / 2.0);
  let a: f32 = C / rD;
  let b: f32 = Dd * C / (rD * r2);
  let c3: f32 = Dd * (Dd + 2.0) * C / (rD * r2 * r2);
  var t: array<f32, 9>;
  t[0] = a * ex;
  t[1] = a * ey;
  t[2] = a - b * ex * ex;
  t[3] = 0.0 - b * ex * ey;
  t[4] = a - b * ey * ey;
  t[5] = 0.0 - 3.0 * b * ex + c3 * ex * ex * ex;
  t[6] = 0.0 - b * ey + c3 * ex * ex * ey;
  t[7] = 0.0 - b * ex + c3 * ex * ey * ey;
  t[8] = 0.0 - 3.0 * b * ey + c3 * ey * ey * ey;
  return t;
}

fn marrive(px: f32, py: f32, zown: u32) -> vec3<f32> {
  let u: i32 = mcell(i32(floor(px + 0.5)), i32(floor(py + 0.5)));
  if (u < 0) { return vec3<f32>(0.0, 0.0, 0.0); }
  let uu: u32 = u32(u);
  let ux: f32 = f32(uu % P.N);
  let uy: f32 = f32(uu / P.N);
  /* the far ones, off the cell's nine numbers */
  let dx: f32 = px - ux;
  let dy: f32 = py - uy;
  let T: u32 = mtay(uu);
  var gx: f32 = hn[T] + hn[T + 2u] * dx + hn[T + 3u] * dy + (hn[T + 5u] * dx * dx + 2.0 * hn[T + 6u] * dx * dy + hn[T + 7u] * dy * dy) / 2.0;
  var gy: f32 = hn[T + 1u] + hn[T + 3u] * dx + hn[T + 4u] * dy + (hn[T + 6u] * dx * dx + 2.0 * hn[T + 7u] * dx * dy + hn[T + 8u] * dy * dy) / 2.0;
  var sum: f32 = 0.0;
  /* what reads itself here: the body at zown, or where it stands with others its cell's gathering (Medium.arriving_at) */
  var own: i32 = -1;
  if (zown >= 1u && zown <= P.holes) { own = i32(zown) - 1; }
  var mine: array<f32, 8>;
  var me: f32 = 0.5;
  var owns: u32 = 0u;
  var alone: bool = false;
  var nearest: i32 = -1;
  let L: u32 = mnear(uu);
  let n: u32 = u32(hn[L]);
  /* the name its own cell's gathering goes by (Medium.cell_sources) */
  var srcid: f32 = 0.5;
  if (own >= 0) {
    let o: vec4<f32> = bodat(u32(own));
    let oc: i32 = mcell(i32(floor(o.x + 0.5)), i32(floor(o.y + 0.5)));
    mine = memit(u32(own));
    me = f32(own);
    srcid = -2.0 - f32(oc);
    /* standing with others on its cell, it reads as its cell's gathering: all but what the cell sends (Medium.arriving_at) */
    if (MCELLPULL && oc >= 0) {
      let w: array<f32, 8> = msourcewas(u32(oc));
      if (w[6] == srcid && w[0] > 0.0) { mine = w; mine[7] = 0.0; me = srcid; }
    }
    owns = mbin(ux - mine[1] / mine[0], uy - mine[2] / mine[0]);
    var far: f32 = 0.0;
    for (var e: u32 = 0u; e < n; e = e + 1u) {
      let rel: u32 = u32(hn[L + 1u + e]);
      if (rel / mslots() != owns) { continue; }
      let m: array<f32, 8> = mheld(mslot(uu, owns, rel % mslots()));
      if (m[6] == me) { alone = true; } else if (m[6] == -1.0) {
        let d: f32 = sqrt((m[1] / m[0] - mine[1] / mine[0]) * (m[1] / m[0] - mine[1] / mine[0]) + (m[2] / m[0] - mine[2] / mine[0]) * (m[2] / m[0] - mine[2] / mine[0]));
        if (nearest < 0 || d < far) { nearest = i32(rel); far = d; }
      }
    }
  }
  for (var e: u32 = 0u; e < n; e = e + 1u) {
    let rel: u32 = u32(hn[L + 1u + e]);
    var m: array<f32, 8> = mheld(mslot(uu, rel / mslots(), rel % mslots()));
    if (own >= 0 && m[6] == me) { continue; }
    if (own >= 0 && rel / mslots() == owns && !alone && m[6] == -1.0 && i32(rel) == nearest && m[0] - mine[0] > 0.0) {
      let all: array<f32, 8> = m;
      for (var q: u32 = 0u; q < 6u; q = q + 1u) { m[q] = m[q] - mine[q]; }
      m[6] = -1.0;
      /* and how far apart the rest stand: the gathering's, less what its own stood off the rest's middle */
      let ex: f32 = ux - all[1] / all[0];
      let ey: f32 = uy - all[2] / all[0];
      let ee: f32 = sqrt(ex * ex + ey * ey);
      var along: f32 = 0.0;
      if (ee > 0.0) { along = ((m[1] / m[0] - mine[1] / mine[0]) * ex + (m[2] / m[0] - mine[2] / mine[0]) * ey) / ee; }
      m[7] = max(0.0, all[7] - m[0] * mine[0] / all[0] * along * along);
    }
    /* sent out within its own cell's gathering: its share taken out of that, laid as that was (Medium.left_for) */
    if (own >= 0 && m[6] == srcid) {
      let lf: array<f32, 8> = mleft(mine, sqrt((ux - m[1] / m[0]) * (ux - m[1] / m[0]) + (uy - m[2] / m[0]) * (uy - m[2] / m[0])));
      for (var q: u32 = 0u; q < 6u; q = q + 1u) { m[q] = m[q] - lf[q]; }
      m[7] = mspread_without(u32(own), mine, ux, uy);
    }
    let got: vec3<f32> = mreads(m, px, py);
    sum = sum + got.x;
    gx = gx + got.x * got.y;
    gy = gy + got.x * got.z;
  }
  /* what stands at the cell's very middle is on no way: its source as the shine laid it, read at the point */
  var e: array<f32, 8> = msourcewas(uu);
  e[7] = 0.0;
  if (e[0] > 0.0 && sqrt((ux - e[1] / e[0]) * (ux - e[1] / e[0]) + (uy - e[2] / e[0]) * (uy - e[2] / e[0])) <= 0.001 && !(own >= 0 && e[6] == me)) {
    if (own >= 0 && e[6] == srcid) {
      for (var q: u32 = 0u; q < 6u; q = q + 1u) { e[q] = e[q] - mine[q]; }
    }
    let got: vec3<f32> = mreads(e, px, py);
    sum = sum + got.x;
    gx = gx + got.x * got.y;
    gy = gy + got.x * got.z;
  }
  return vec3<f32>(sum, gx, gy);
}

const CN: u32 = 6u;

fn xc(k: u32) -> f32 { return dir[P.A + 2u * MAXH + k / 4u][k % 4u]; }

fn mmeet0_share(rho: f32, nf: f32) -> f32 {
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return clamp(F, 0.0, 1.0);
}

fn mmeet0_rays(rho: f32, nf: f32) -> f32 {
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return (-2.0);
}

fn mmeet0_folds(rho: f32, nf: f32) -> f32 {
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return 1.0;
}

fn mmeet0_space(rho: f32, nf: f32) -> f32 {
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return (-1.0);
}

fn mmeet0_grew(rho: f32, nf: f32) -> f32 {
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return 0.0;
}

const MMEET0_SETS: bool = false;

fn mmeet1_share(rho: f32, nf: f32) -> f32 {
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return clamp(0.0, 0.0, 1.0);
}

fn mmeet1_rays(rho: f32, nf: f32) -> f32 {
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return 0.0;
}

fn mmeet1_folds(rho: f32, nf: f32) -> f32 {
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return 0.0;
}

fn mmeet1_space(rho: f32, nf: f32) -> f32 {
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return 1.0;
}

fn mmeet1_grew(rho: f32, nf: f32) -> f32 {
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return 1.0;
}

const MMEET1_SETS: bool = false;

fn mmeet2_share(rho: f32, nf: f32) -> f32 {
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return clamp(0.0, 0.0, 1.0);
}

fn mmeet2_rays(rho: f32, nf: f32) -> f32 {
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return 0.0;
}

fn mmeet2_folds(rho: f32, nf: f32) -> f32 {
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return 0.0;
}

fn mmeet2_space(rho: f32, nf: f32) -> f32 {
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return 1.0;
}

fn mmeet2_grew(rho: f32, nf: f32) -> f32 {
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return 1.0;
}

const MMEET2_SETS: bool = false;

fn mpoint0_share(rho: f32, nf: f32) -> f32 {
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return clamp((1.0 - rho), 0.0, 1.0);
}

fn mpoint0_rays(rho: f32, nf: f32) -> f32 {
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return DEG;
}

fn mpoint0_folds(rho: f32, nf: f32) -> f32 {
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return 0.0;
}

fn mpoint0_space(rho: f32, nf: f32) -> f32 {
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return 0.0;
}

fn mpoint0_grew(rho: f32, nf: f32) -> f32 {
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return 0.0;
}

const MPOINT0_SETS: bool = true;

fn mpoint1_share(rho: f32, nf: f32) -> f32 {
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return clamp(((nf / DEG) * ((1.0 - rho))), 0.0, 1.0);
}

fn mpoint1_rays(rho: f32, nf: f32) -> f32 {
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return 0.0;
}

fn mpoint1_folds(rho: f32, nf: f32) -> f32 {
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return (-DEG);
}

fn mpoint1_space(rho: f32, nf: f32) -> f32 {
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return 0.0;
}

fn mpoint1_grew(rho: f32, nf: f32) -> f32 {
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return 0.0;
}

const MPOINT1_SETS: bool = false;

fn mpoint2_share(rho: f32, nf: f32) -> f32 {
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return clamp((nf * ((1.0 - rho))), 0.0, 1.0);
}

fn mpoint2_rays(rho: f32, nf: f32) -> f32 {
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return 0.0;
}

fn mpoint2_folds(rho: f32, nf: f32) -> f32 {
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return 0.0;
}

fn mpoint2_space(rho: f32, nf: f32) -> f32 {
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return 1.0;
}

fn mpoint2_grew(rho: f32, nf: f32) -> f32 {
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return 0.0;
}

const MPOINT2_SETS: bool = false;

fn msingle0_share(rho: f32, nf: f32) -> f32 {
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return clamp((1.0 - omega), 0.0, 1.0);
}

fn msingle0_rays(rho: f32, nf: f32) -> f32 {
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return 0.0;
}

fn msingle0_folds(rho: f32, nf: f32) -> f32 {
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return 0.0;
}

fn msingle0_space(rho: f32, nf: f32) -> f32 {
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return 1.0;
}

fn msingle0_grew(rho: f32, nf: f32) -> f32 {
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = 0.0;
  let DEG: f32 = P.DEG;
  return 1.0;
}

const MSINGLE0_SETS: bool = false;

fn msource0_share(b_: f32) -> f32 {
  let rho: f32 = 0.0;
  let nf: f32 = 0.0;
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = b_;
  let DEG: f32 = P.DEG;
  return clamp((omega * ((1.0 - beta))), 0.0, 1.0);
}

fn msource0_rays(b_: f32) -> f32 {
  let rho: f32 = 0.0;
  let nf: f32 = 0.0;
  let F: f32 = select(1.0, xc(5u), xc(5u) > 0.0);
  let omega: f32 = xc(8u);
  let beta: f32 = b_;
  let DEG: f32 = P.DEG;
  return 1.0;
}

fn mper_way(mass: f32, b_: f32) -> f32 {
  var got: f32 = mass / P.DEG;
got = got * msource0_share(b_) * msource0_rays(b_);
  return got;
}

fn mnets(rho: f32, nf: f32) -> f32 {
  var got: f32 = 0.0;
got = got + mpoint0_share(rho, nf) * mpoint0_rays(rho, nf);
got = got + mpoint1_share(rho, nf) * mpoint1_rays(rho, nf);
got = got + mpoint2_share(rho, nf) * mpoint2_rays(rho, nf);
got = got + msingle0_share(rho, nf) * rho * msingle0_rays(rho, nf);
got = got + mmeet0_share(rho, nf) * rho * rho * mmeet0_rays(rho, nf);
got = got + mmeet1_share(rho, nf) * rho * rho * mmeet1_rays(rho, nf);
got = got + mmeet2_share(rho, nf) * rho * rho * mmeet2_rays(rho, nf);
  return got;
}

fn mscale(avg: f32) -> f32 {
  var e: array<f32, 2>;
  e[0] = avg;
  e[1] = xc(0u);
  return ((0.02721371823050147) * powi((e[1] + (1.0)), -1));
}

fn mcell(x: i32, y: i32) -> i32 { if (x < 0 || y < 0 || x >= i32(P.N) || y >= i32(P.N)) { return -1; } return y * i32(P.N) + x; }

fn mplanes() -> u32 { return P.tags - 1u; }

fn mledger() -> u32 { return select(mplanes(), 2u, xc(22u) > 0.5); }

fn at_plane(p: u32, c: u32) -> u32 { return p * P.cells + c; }

fn FOLD() -> u32 { return 0u; }

fn STAND() -> u32 { return 1u; }

fn VAC() -> u32 { return 2u; }

fn mvac(c: u32) -> f32 { let v: f32 = st[at_plane(VAC(), c)]; return select(v, xc(1u), v <= 0.0); }

fn RUNGS() -> u32 { return P.rungs; }

fn BODS() -> u32 { return P.bod; }

const MCOMPACT: bool = false;

const MSHARD: u32 = 178956970u;

const MVMAX: f32 = 1.0;

fn mword(h: u32, w: u32) -> u32 {
  let k: u32 = h / MSHARD;
  let j: u32 = (h % MSHARD) * 3u + w;
  if (k == 0u) { return sb0[j]; }
  if (k == 1u) { return sb1[j]; }
  if (k == 2u) { return sb2[j]; }
  if (k == 3u) { return sb3[j]; }
  if (k == 4u) { return sb4[j]; }
  if (k == 5u) { return sb5[j]; }
  if (k == 6u) { return sb6[j]; }
  return sb7[j];
}

fn msetword(h: u32, w: u32, v: u32) {
  let k: u32 = h / MSHARD;
  let j: u32 = (h % MSHARD) * 3u + w;
  if (k == 0u) { sb0[j] = v; } else if (k == 1u) { sb1[j] = v; } else if (k == 2u) { sb2[j] = v; } else if (k == 3u) { sb3[j] = v; } else if (k == 4u) { sb4[j] = v; } else if (k == 5u) { sb5[j] = v; } else if (k == 6u) { sb6[j] = v; } else { sb7[j] = v; }
}

fn mfixed(w: u32) -> f32 { return f32(w >> 20u) + f32(w & 1048575u) * 9.5367431640625e-7 - 1024.0; }

fn mtofixed(x: f32) -> u32 { let y: f32 = clamp(x + 1024.0, 0.0, 4095.999); let whole: f32 = floor(y); return (u32(whole) << 20u) | min(u32((y - whole) * 1048576.0), 1048575u); }

fn mvel(w: u32) -> vec2<f32> { return vec2<f32>(f32(i32(w << 16u) >> 16u), f32(i32(w) >> 16u)) * (MVMAX / 32767.0); }

fn mdither(h: u32, k: u32) -> f32 { var z: u32 = h * 747796405u + P.tick * 2891336453u + k * 1181783497u; z = (z ^ (z >> 16u)) * 2246822519u; z = (z ^ (z >> 13u)) * 3266489917u; z = z ^ (z >> 16u); return f32(z >> 8u) / 16777216.0; }

fn mtovel(v: vec2<f32>, h: u32) -> u32 { let s: vec2<f32> = v / MVMAX * 32767.0; let q: vec2<f32> = clamp(floor(s + vec2<f32>(mdither(h, 1u), mdither(h, 2u))), vec2<f32>(-32767.0), vec2<f32>(32767.0)); return (u32(i32(q.x)) & 65535u) | (u32(i32(q.y)) << 16u); }

fn bodat(h: u32) -> vec4<f32> {
  if (MCOMPACT) { return vec4<f32>(mfixed(mword(h, 0u)), mfixed(mword(h, 1u)), cel[BODS() + 2u], f32(h + 1u)); }
  let b: u32 = BODS() + 12u * h;
  return vec4<f32>(cel[b], cel[b + 1u], cel[b + 2u], cel[b + 3u]);
}

fn bodgo(h: u32) -> vec4<f32> {
  if (MCOMPACT) { let v: vec2<f32> = mvel(mword(h, 2u)); let m: f32 = cel[BODS() + 2u]; return vec4<f32>(v.x * m, v.y * m, cel[BODS() + 6u], 0.0); }
  let b: u32 = BODS() + 12u * h;
  return vec4<f32>(cel[b + 4u], cel[b + 5u], cel[b + 6u], cel[b + 7u]);
}

fn bodface(h: u32) -> f32 { return cel[BODS() + select(12u * h, 0u, MCOMPACT) + 8u]; }

fn bodskin(h: u32) -> f32 { return cel[BODS() + select(12u * h, 0u, MCOMPACT) + 9u]; }

fn msetat(h: u32, x: f32, y: f32) {
  if (MCOMPACT) { msetword(h, 0u, mtofixed(x)); msetword(h, 1u, mtofixed(y)); return; }
  let b: u32 = BODS() + 12u * h;
  cel[b] = x;
  cel[b + 1u] = y;
}

fn msetgo(h: u32, px: f32, py: f32) {
  if (MCOMPACT) { let m: f32 = cel[BODS() + 2u]; msetword(h, 2u, mtovel(vec2<f32>(px, py) / m, h)); return; }
  let b: u32 = BODS() + 12u * h;
  cel[b + 4u] = px;
  cel[b + 5u] = py;
}

fn mrecur(px: f32, py: f32, gn: f32) -> f32 {
  if (xc(19u) < 1.5 || gn <= 0.0) { return 1.0; }
  var a0: f32 = xc(17u);
  /* and where a_0 is read off the matter crossed rather than the vacuum's own (Medium.a0_from) */
  if (xc(21u) > 0.5 && xc(21u) < 1.5 && xc(1u) > 0.0) { a0 = a0 * max(0.0, mtapc(0u, px, py, 0.0) - xc(4u) * xc(1u)) / xc(1u); }
  /* or the chain's own, at the density crossed on the way in (Medium.a0_at_place, a0_from 2) */
  if (xc(21u) > 1.5) { let inf: f32 = mscale(xc(1u)); if (inf > 0.0) { a0 = a0 * mscale(mcrossed(px, py)) / inf; } }
  if (a0 <= 0.0) { return 1.0; }
  let gx: f32 = mtapc(2u, px, py, 0.0);
  let gy: f32 = mtapc(3u, px, py, 0.0);
  let was: f32 = sqrt(gx * gx + gy * gy);
  /* g = sqrt(g_N(g + a_0)): the same line as g = g_N(1 + a_0/g), written as the mean it is, and the form that settles */
  return sqrt(gn * (was + a0)) / gn;
}

fn mdrift(h: u32) -> f32 {
  if (xc(19u) < 0.5 || xc(19u) > 1.5) { return 1.0; }
  let gx: f32 = cel[P.outs + 4u * h];
  let gy: f32 = cel[P.outs + 4u * h + 1u];
  let g: f32 = sqrt(gx * gx + gy * gy);
  let a0: f32 = xc(17u);
  if (g <= 0.0 || a0 <= 0.0) { return 1.0; }
  return 1.0 + a0 / g;
}

fn facing_out(z: u32) -> f32 { let h: i32 = whom(z); if (h < 0) { return (0.5); } return max((0.5), bodface(u32(h))); }

const TRACKED: u32 = 4096u;

fn TRACK(t: u32, h: u32) -> u32 { return P.track + (t % TRACKED) * TRACKB * 4u + h * 4u; }

fn whom(z: u32) -> i32 { return i32(cel[P.whom + z]); }

fn BEAMAT(z: u32, r: u32) -> u32 { return P.beam + z * RUNGS() + r; }

fn BEAMWAS(z: u32, r: u32) -> u32 { return P.beam + P.span + z * RUNGS() + r; }

fn msent(z: u32, r: f32) -> f32 {
  let n: u32 = RUNGS();
  let i: f32 = floor(r);
  if (i < 0.0) { return 0.0; }
  let k: u32 = u32(i);
  if (k + 1u >= n) { return 0.0; }
  let f: f32 = r - i;
  let over: f32 = xc(6u) - 1.0;
  let face: f32 = facing_out(z);
  let here: f32 = pow(max(face, r), over);
  let was: f32 = cel[BEAMAT(z, k)] * pow(max(face, i), over);
  let next: f32 = cel[BEAMAT(z, k + 1u)] * pow(max(face, i + 1.0), over);
  if (here <= 0.0) { return 0.0; }
  return (was * (1.0 - f) + next * f) / here;
}

fn mact(x: f32) -> f32 { return clamp(x, 0.0, 1.0); }

fn mtap(p: u32, px: f32, py: f32, outside: f32) -> f32 {
  let x0: i32 = i32(floor(px));
  let y0: i32 = i32(floor(py));
  let fx: f32 = px - floor(px);
  let fy: f32 = py - floor(py);
  let base: u32 = p * P.cells;
  var got: f32 = 0.0;
  let c00: i32 = mcell(x0, y0);
  let c10: i32 = mcell(x0 + 1, y0);
  let c01: i32 = mcell(x0, y0 + 1);
  let c11: i32 = mcell(x0 + 1, y0 + 1);
  got = got + (1.0 - fx) * (1.0 - fy) * select(outside, st[base + u32(max(c00, 0))], c00 >= 0);
  got = got + fx * (1.0 - fy) * select(outside, st[base + u32(max(c10, 0))], c10 >= 0);
  got = got + (1.0 - fx) * fy * select(outside, st[base + u32(max(c01, 0))], c01 >= 0);
  got = got + fx * fy * select(outside, st[base + u32(max(c11, 0))], c11 >= 0);
  return got;
}

fn mcrossed(px: f32, py: f32) -> f32 {
  var best: i32 = -1;
  var far: f32 = 0.0;
  for (var h: u32 = 0u; h < P.holes; h = h + 1u) {
    let o: vec4<f32> = bodat(h);
    let d: f32 = (o.x - px) * (o.x - px) + (o.y - py) * (o.y - py);
    if (best < 0 || d < far) { best = i32(h); far = d; }
  }
  if (best < 0) { return xc(1u); }
  let o: vec4<f32> = bodat(u32(best));
  var got: f32 = 0.0;
  for (var i: u32 = 0u; i < 16u; i = i + 1u) {
    let f: f32 = (f32(i) + 0.5) / 16.0;
    got = got + mtap(VAC(), o.x + (px - o.x) * f, o.y + (py - o.y) * f, xc(1u));
  }
  return got / 16.0;
}

fn mtapc(slot: u32, px: f32, py: f32, outside: f32) -> f32 {
  let x0: i32 = i32(floor(px));
  let y0: i32 = i32(floor(py));
  let fx: f32 = px - floor(px);
  let fy: f32 = py - floor(py);
  let base: u32 = slot * P.cells;
  var got: f32 = 0.0;
  let c00: i32 = mcell(x0, y0);
  let c10: i32 = mcell(x0 + 1, y0);
  let c01: i32 = mcell(x0, y0 + 1);
  let c11: i32 = mcell(x0 + 1, y0 + 1);
  got = got + (1.0 - fx) * (1.0 - fy) * select(outside, cel[base + u32(max(c00, 0))], c00 >= 0);
  got = got + fx * (1.0 - fy) * select(outside, cel[base + u32(max(c10, 0))], c10 >= 0);
  got = got + (1.0 - fx) * fy * select(outside, cel[base + u32(max(c01, 0))], c01 >= 0);
  got = got + fx * fy * select(outside, cel[base + u32(max(c11, 0))], c11 >= 0);
  return got;
}

fn mout(z: u32, px: f32, py: f32) -> vec3<f32> {
  let h: i32 = whom(z);
  if (h < 0) { return vec3<f32>(0.0, 0.0, 0.0); }
  let o: vec4<f32> = bodat(u32(h));
  let dx: f32 = px - o.x;
  let dy: f32 = py - o.y;
  let d: f32 = sqrt(dx * dx + dy * dy);
  let face: f32 = max((0.5), bodface(u32(h)));
  if (d <= 0.0) { return vec3<f32>(0.0, 0.0, face); }
  return vec3<f32>(dx / d, dy / d, max(face, d / f32(P.K)));
}

fn mfacing(ax: f32, ay: f32, bx: f32, by: f32) -> f32 {
  let wide: f32 = 6.283185307179586 / P.DEG;
  let ux: f32 = -bx;
  let uy: f32 = -by;
  let angle: f32 = abs(atan2(ax * uy - ay * ux, ax * ux + ay * uy));
  return max(0.0, 1.0 - angle / wide);
}

fn munder(h: u32, k: u32) -> i32 {
  let o: vec4<f32> = bodat(h);
  let half: i32 = i32((P.K - 1u) / 2u);
  let x: i32 = i32(floor(o.x + 0.5)) - half + i32(k % P.K);
  let y: i32 = i32(floor(o.y + 0.5)) - half + i32(k / P.K);
  return mcell(x, y);
}

//! kernel SNAP over cells*A
@compute @workgroup_size(64) fn SNAP(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
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
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  if (i >= P.cells) { return; }
  cel[3u * P.cells + i] = 0.0;
  cel[6u * P.cells + i] = 0.0;
}

//! kernel SWEEP over cells
@compute @workgroup_size(64) fn SWEEP(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
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
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
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
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  if (i >= 1u) { return; }
  for (var e: u32 = 0u; e < P.entries; e = e + 1u) {
    let k: u32 = u32_of_i(i32_of_f(dir[P.A + 2u * 64u + 6u + e].x));
    let amount: f32 = dir[P.A + 2u * 64u + 6u + e].y;
    let tag: i32 = i32_of_f(dir[P.A + 2u * 64u + 6u + e].z);
    let kind: f32 = dir[P.A + 2u * 64u + 6u + e].w;
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
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
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
        gone = gone + maxf(0.0, w * meet0_folds(rho, nf) / 2.0) * (P.DEG / f32_of_u(P.A));
        cross = cross + maxf(0.0, w * meet0_folds(rho, nf) / 2.0) * (P.DEG / f32_of_u(P.A)) * mixed / maxf(facing, 0.000000000001);
      }
  }
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
      let w: f32 = clampf(st[wA(a, c)], 0.0, 1.0) * facing * meet1_gate(rho, nf);
      if (w > 0.0) {
        st[kA(a, c)] = st[kA(a, c)] + w * meet1_rays(rho, nf) / 2.0;
        let ds: f32 = w * meet1_space(rho, nf) / 2.0;
        dSpace = dSpace + ds * (P.DEG / f32_of_u(P.A));
        let mine: f32 = 0.5 + 0.5 * (bodily(a * P.cells + c) - there_b);
        st[fA(a, c)] = maxf(0.0, st[fA(a, c)] + w * meet1_folds(rho, nf) * mine);
        gone = gone + maxf(0.0, w * meet1_folds(rho, nf) / 2.0) * (P.DEG / f32_of_u(P.A));
        cross = cross + maxf(0.0, w * meet1_folds(rho, nf) / 2.0) * (P.DEG / f32_of_u(P.A)) * mixed / maxf(facing, 0.000000000001);
      }
  }
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
      let w: f32 = clampf(st[wA(a, c)], 0.0, 1.0) * facing * meet2_gate(rho, nf);
      if (w > 0.0) {
        st[kA(a, c)] = st[kA(a, c)] + w * meet2_rays(rho, nf) / 2.0;
        let ds: f32 = w * meet2_space(rho, nf) / 2.0;
        dSpace = dSpace + ds * (P.DEG / f32_of_u(P.A));
        let mine: f32 = 0.5 + 0.5 * (bodily(a * P.cells + c) - there_b);
        st[fA(a, c)] = maxf(0.0, st[fA(a, c)] + w * meet2_folds(rho, nf) * mine);
        gone = gone + maxf(0.0, w * meet2_folds(rho, nf) / 2.0) * (P.DEG / f32_of_u(P.A));
        cross = cross + maxf(0.0, w * meet2_folds(rho, nf) / 2.0) * (P.DEG / f32_of_u(P.A)) * mixed / maxf(facing, 0.000000000001);
      }
  }
  cel[2u * P.cells + c] = cel[2u * P.cells + c] + dSpace;
  cel[3u * P.cells + c] = cel[3u * P.cells + c] + gone;
  cel[6u * P.cells + c] = cel[6u * P.cells + c] + cross;
}

//! kernel CREATE1 over cells
@compute @workgroup_size(64) fn CREATE1(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
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
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
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
  let fires4: f32 = clampf(omega, 0.0, 1.0) * rho;
  if (fires4 > 0.0) {
    for (var a: u32 = 0u; a < P.A; a = a + 1u) {
      st[dA(a, c)] = st[dA(a, c)] + fires4 * (0.0) / DEG;
    }
    dSpace = dSpace + fires4 * (0.0);
    let df4: f32 = fires4 * (0.0) / DEG;
    for (var a: u32 = 0u; a < P.A; a = a + 1u) {
      st[fA(a, c)] = maxf(0.0, st[fA(a, c)] + df4);
    }
  }
  cel[2u * P.cells + c] = cel[2u * P.cells + c] + dSpace;
}

//! kernel TAKE over cells*A
@compute @workgroup_size(64) fn TAKE(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  if (i >= P.cells * P.A) { return; }
  st[4u * P.cells * P.A + i] = st[4u * P.cells * P.A + i] + st[7u * P.cells * P.A + i];
  st[7u * P.cells * P.A + i] = 0.0;
}

//! kernel TOTAL over cells
@compute @workgroup_size(64) fn TOTAL(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
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
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
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
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
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
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
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
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
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
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
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
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  if (i >= P.cells * P.A) { return; }
  st[i] = st[i] + st[2u * P.cells * P.A + i];
  for (var z: u32 = 0u; z < P.tags - 1u; z = z + 1u) {
    st[(9u + 2u * z) * P.cells * P.A + i] = st[(9u + 2u * z) * P.cells * P.A + i] + st[(10u + 2u * z) * P.cells * P.A + i];
  }
}

//! kernel ARRIVED over cells
@compute @workgroup_size(64) fn ARRIVED(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
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

//! kernel MHWANT over cells
@compute @workgroup_size(64) fn MHWANT(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  let c: u32 = i;
  if (c >= P.cells || !mlocal()) { return; }
  /* whether the shine has anything to do here: a source within the edge and a cell (a body goes less than a cell a tick) */
  var hot: bool = false;
  let RH: i32 = i32(ceil(medge())) + 1;
  for (var hy: i32 = -RH; hy <= RH && !hot; hy = hy + 1) {
    for (var hx: i32 = -RH; hx <= RH; hx = hx + 1) {
      let nc: i32 = mcell(i32(c % P.N) + hx, i32(c / P.N) + hy);
      if (nc >= 0 && ho[msrc(u32(nc))] > 0.0) { hot = true; break; }
    }
  }
  hn[mhot(c)] = select(0.0, 1.0, hot);
  let W: u32 = mwindow();
  /* the ways anything can come on here: within the window of a way some cell within reach holds */
  var want: array<u32, 4>;
  /* every way any cell within reach holds, gathered first, then widened by the window once */
  var held: array<u32, 4>;
  let R: i32 = i32(P.K) + 1;
  for (var ddy: i32 = -R; ddy <= R; ddy = ddy + 1) {
    for (var ddx: i32 = -R; ddx <= R; ddx = ddx + 1) {
      let nc: i32 = mcell(i32(c % P.N) + ddx, i32(c / P.N) + ddy);
      if (nc < 0) { continue; }
      for (var wd: u32 = 0u; wd < 4u; wd = wd + 1u) {
        held[wd] = held[wd] | u32(ho[mbits(u32(nc), wd)]);
      }
    }
  }
  for (var bb: u32 = 0u; bb < MGATHER; bb = bb + 1u) {
    if (((held[bb / 24u] >> (bb % 24u)) & 1u) == 0u) { continue; }
    for (var o: u32 = 0u; o < 2u * W + 1u; o = o + 1u) {
      let t: u32 = (bb + MGATHER + o - W) % MGATHER;
      want[t / 24u] = want[t / 24u] | (1u << (t % 24u));
    }
  }
  /* what this point held two ticks ago is cleared, and only the ways something reaches are laid again */
  for (var wd: u32 = 0u; wd < 4u; wd = wd + 1u) {
    let had: u32 = u32(hn[mbits(c, wd)]);
    for (var bo: u32 = 0u; bo < 24u; bo = bo + 1u) {
      if (((had >> bo) & 1u) == 1u) { hn[mocc(c, wd * 24u + bo)] = 0.0; }
    }
    hn[mbits(c, wd)] = 0.0;
  }
  for (var wd: u32 = 0u; wd < 4u; wd = wd + 1u) { hn[mwant(c, wd)] = f32(want[wd]); }
}

//! kernel MHSTREAM over cells*G
@compute @workgroup_size(64) fn MHSTREAM(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  let c: u32 = i / MGATHER;
  let t: u32 = i % MGATHER;
  if (c >= P.cells || !mlocal()) { return; }
  if (((u32(hn[mwant(c, t / 24u)]) >> (t % 24u)) & 1u) == 0u) { return; }
  let x: f32 = f32(c % P.N);
  let y: f32 = f32(c / P.N);
  let W: u32 = mwindow();
  var l: array<array<f32, 8>, MLIST>;
  let way: vec2<f32> = mway(t);
  let tw: f32 = tan(3.141592653589793 / f32(MGATHER)) * 1.001;
  /* each bundle that goes way t here, read one c-bar back along its own heading off the cells round that place (Medium.stream_local): those places lie between the ones half a way either side of t */
  let a0: f32 = 6.283185307179586 * (f32(t) - 0.5) / f32(MGATHER);
  let a1: f32 = 6.283185307179586 * (f32(t) + 0.5) / f32(MGATHER);
  let p0x: f32 = x - f32(P.K) * cos(a0);
  let p0y: f32 = y - f32(P.K) * sin(a0);
  let p1x: f32 = x - f32(P.K) * cos(a1);
  let p1y: f32 = y - f32(P.K) * sin(a1);
  let lx0: i32 = i32(floor(min(p0x, p1x)));
  let ly0: i32 = i32(floor(min(p0y, p1y)));
  let nx: i32 = i32(floor(max(p0x, p1x))) + 2 - lx0;
  let ny: i32 = i32(floor(max(p0y, p1y))) + 2 - ly0;
  var n: u32 = 0u;
  /* the cells met in an order that turns with the cell and the tick: what is merged as it comes then leans no way on the whole (met low y first always, a disc leaned +y) */
  let sy: bool = ((c / P.N + P.tick) & 1u) == 1u;
  let sx: bool = ((c % P.N + P.tick / 2u) & 1u) == 1u;
  for (var j0: i32 = 0; j0 < ny; j0 = j0 + 1) {
    let j: i32 = select(j0, ny - 1 - j0, sy);
    for (var i0: i32 = 0; i0 < nx; i0 = i0 + 1) {
      let i2: i32 = select(i0, nx - 1 - i0, sx);
      let u: i32 = mcell(lx0 + i2, ly0 + j);
      if (u < 0) { continue; }
      let ux: f32 = f32(lx0 + i2);
      let uy: f32 = f32(ly0 + j);
      for (var o: u32 = 0u; o < 2u * W + 1u; o = o + 1u) {
        let bb: u32 = (t + MGATHER + o - W) % MGATHER;
        if (!mhaswas(u32(u), bb)) { continue; }
        for (var s: u32 = 0u; s < mslots(); s = s + 1u) {
          let k: u32 = mslot(u32(u), bb, s);
          let q: f32 = ho[k];
          if (!(q > 0.0)) { continue; }
          let lx: f32 = ho[k + 1u] / q;
          let ly: f32 = ho[k + 2u] / q;
          let dx: f32 = x - lx;
          let dy: f32 = y - ly;
          if (dx == 0.0 && dy == 0.0) { continue; }
          /* what heads more than half a way off this one is not on it: told off its place alone, before the rest is read */
          let along: f32 = dx * way.x + dy * way.y;
          if (!(along > 0.0) || abs(dx * way.y - dy * way.x) > along * tw) { continue; }
          if (mbin(dx, dy) != t) { continue; }
          /* where its ray came through, a c-bar back, and this cell's share of that place */
          let dd: f32 = sqrt(dx * dx + dy * dy);
          let cx: f32 = x - f32(P.K) * dx / dd;
          let cy: f32 = y - f32(P.K) * dy / dd;
          let ws: f32 = max(0.0, 1.0 - abs(ux - cx)) * max(0.0, 1.0 - abs(uy - cy)) / minside(cx, cy);
          if (!(ws > 0.0)) { continue; }
          let m: array<f32, 8> = mwas(k);
          let now: vec2<f32> = mnow(m, x, y);
          if (sqrt((x - now.x) * (x - now.x) + (y - now.y) * (y - now.y)) <= mzone()) { continue; }
          var g: i32 = -1;
          for (var gi: u32 = 0u; gi < n; gi = gi + 1u) {
            let h: array<f32, 8> = l[gi];
            let same: bool = (m[6] != -1.0 && h[6] == m[6]) || (m[6] == -1.0 && h[6] == -1.0 && sqrt((h[1] / h[0] - lx) * (h[1] / h[0] - lx) + (h[2] / h[0] - ly) * (h[2] / h[0] - ly)) < 0.5 + 0.05 * sqrt(dx * dx + dy * dy));
            if (g < 0 && same) { g = i32(gi); }
          }
          var part: array<f32, 8>;
          for (var q2: u32 = 0u; q2 < 6u; q2 = q2 + 1u) { part[q2] = ws * m[q2]; }
          part[6] = m[6];
          part[7] = ws * m[7];
          if (g < 0) {
            /* a list full: the nearest pair of all it holds gathered, two of one kind first (mshrink, as the shine does) - merging each newcomer into the one nearest it merged whatever the scan met last, the cells of greater y: a million-star disc pulled itself 4% of its pull toward them */
            if (n >= MLIST) { l = mshrink(l, n, x, y); n = n - 1u; }
            l[n] = part;
            n = n + 1u;
          } else {
            l[g][7] = mspread_with(l[g], part, x, y);
            for (var q2: u32 = 0u; q2 < 6u; q2 = q2 + 1u) { l[g][q2] = l[g][q2] + part[q2]; }
          }
        }
      }
    }
  }
  if (n == 0u) { return; }
  /* read by area: the shares of the cells it came through are already in it, and together they are the whole (Medium.stream_local) */
  hn[mocc(c, t)] = select(0.0, 1.0, mfill(c, t, l, n) > 0u);
}

//! kernel MHJOIN over cells
@compute @workgroup_size(64) fn MHJOIN(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  let c: u32 = i;
  if (c >= P.cells || !mlocal()) { return; }
  let x: f32 = f32(c % P.N);
  let y: f32 = f32(c / P.N);
  /* which ways the stream laid, as the cell's own bits: the stream's threads each had one way, and only this one has the cell */
  for (var wd: u32 = 0u; wd < 4u; wd = wd + 1u) {
    var bits: u32 = 0u;
    for (var bo: u32 = 0u; bo < 24u; bo = bo + 1u) { if (hn[mocc(c, wd * 24u + bo)] > 0.5) { bits = bits | (1u << bo); } }
    hn[mbits(c, wd)] = f32(bits);
  }
}

//! kernel MHSHINE over cells*G
@compute @workgroup_size(64) fn MHSHINE(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  let c: u32 = i / MGATHER;
  let b: u32 = i % MGATHER;
  if (c >= P.cells || !mlocal()) { return; }
  let x: f32 = f32(c % P.N);
  let y: f32 = f32(c / P.N);
  let way: vec2<f32> = mway(b);
  let E: f32 = medge();
  var l: array<array<f32, 8>, MLIST>;
  var n: u32 = 0u;
  if (b == 0u) { hn[mmid(c)] = 0.0; }
  /* no source near: nothing to keep apart from what streamed in, nothing to lay (MHWANT) */
  if (hn[mhot(c)] < 0.5) { return; }
  if (hn[mocc(c, b)] > 0.5) {
    for (var s: u32 = 0u; s < mslots(); s = s + 1u) {
      let m: array<f32, 8> = mheld(mslot(c, b, s));
      if (m[0] > 0.0 && !mrelaid(m, x, y) && n < MLIST) { l[n] = m; n = n + 1u; }
    }
  }
  let fx: f32 = x - (E + 1.0) * way.x;
  let fy: f32 = y - (E + 1.0) * way.y;
  let lx0: i32 = i32(floor(min(x, fx) - 1.0));
  let ly0: i32 = i32(floor(min(y, fy) - 1.0));
  let hx0: i32 = i32(ceil(max(x, fx) + 1.0));
  let hy0: i32 = i32(ceil(max(y, fy) + 1.0));
  /* met in an order that turns with the cell and the tick, as the stream's */
  let sy: bool = ((c / P.N + P.tick) & 1u) == 1u;
  let sx: bool = ((c % P.N + P.tick / 2u) & 1u) == 1u;
  for (var cy0: i32 = ly0; cy0 <= hy0; cy0 = cy0 + 1) {
    let cy: i32 = select(cy0, ly0 + hy0 - cy0, sy);
    for (var cx0: i32 = lx0; cx0 <= hx0; cx0 = cx0 + 1) {
      let cx: i32 = select(cx0, lx0 + hx0 - cx0, sx);
      let ax: f32 = x - f32(cx);
      let ay: f32 = y - f32(cy);
      let along: f32 = ax * way.x + ay * way.y;
      if (abs(ax * way.y - ay * way.x) > 1.0 || along < -1.0 || along > E + 1.0) { continue; }
      let nc: i32 = mcell(cx, cy);
      if (nc < 0) { continue; }
      let e: array<f32, 8> = msourcewas(u32(nc));
      if (!(e[0] > 0.0)) { continue; }
      let dx: f32 = x - e[1] / e[0];
      let dy: f32 = y - e[2] / e[0];
      let d: f32 = sqrt(dx * dx + dy * dy);
      if (d > E) { continue; }
      if (d <= 0.001) {
        if (b == 0u) { hn[mmid(c)] = min(1.0, e[0] / pow(e[5] / e[0], xc(6u) - 1.0)); }
        continue;
      }
      if (mbin(dx, dy) != b) { continue; }
      if (n >= MLIST) { l = mshrink(l, n, x, y); n = n - 1u; }
      l[n] = mleft(e, d);
      l[n][7] = mspread_toward(e, mtensorwas(u32(nc)), f32(cx), f32(cy), x, y);
      n = n + 1u;
    }
  }
  hn[mocc(c, b)] = select(0.0, 1.0, mfill(c, b, l, n) > 0u);
}

//! kernel MHSEED over cells*G
@compute @workgroup_size(64) fn MHSEED(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  let c: u32 = i / MGATHER;
  let b: u32 = i % MGATHER;
  if (c >= P.cells || !mlocal()) { return; }
  let x: f32 = f32(c % P.N);
  let y: f32 = f32(c / P.N);
  let way: vec2<f32> = mway(b);
  let E: f32 = medge();
  var l: array<array<f32, 8>, MLIST>;
  var n: u32 = 0u;
  if (b == 0u) { hn[mmid(c)] = 0.0; }


  let fx: f32 = x - (E + 1.0) * way.x;
  let fy: f32 = y - (E + 1.0) * way.y;
  let lx0: i32 = i32(floor(min(x, fx) - 1.0));
  let ly0: i32 = i32(floor(min(y, fy) - 1.0));
  let hx0: i32 = i32(ceil(max(x, fx) + 1.0));
  let hy0: i32 = i32(ceil(max(y, fy) + 1.0));
  /* met in an order that turns with the cell and the tick, as the stream's */
  let sy: bool = ((c / P.N + P.tick) & 1u) == 1u;
  let sx: bool = ((c % P.N + P.tick / 2u) & 1u) == 1u;
  for (var cy0: i32 = ly0; cy0 <= hy0; cy0 = cy0 + 1) {
    let cy: i32 = select(cy0, ly0 + hy0 - cy0, sy);
    for (var cx0: i32 = lx0; cx0 <= hx0; cx0 = cx0 + 1) {
      let cx: i32 = select(cx0, lx0 + hx0 - cx0, sx);
      let ax: f32 = x - f32(cx);
      let ay: f32 = y - f32(cy);
      let along: f32 = ax * way.x + ay * way.y;
      if (abs(ax * way.y - ay * way.x) > 1.0 || along < -1.0 || along > E + 1.0) { continue; }
      let nc: i32 = mcell(cx, cy);
      if (nc < 0) { continue; }
      let e: array<f32, 8> = msource(u32(nc));
      if (!(e[0] > 0.0)) { continue; }
      let dx: f32 = x - e[1] / e[0];
      let dy: f32 = y - e[2] / e[0];
      let d: f32 = sqrt(dx * dx + dy * dy);
      if (d > E) { continue; }
      if (d <= 0.001) {
        if (b == 0u) { hn[mmid(c)] = min(1.0, e[0] / pow(e[5] / e[0], xc(6u) - 1.0)); }
        continue;
      }
      if (mbin(dx, dy) != b) { continue; }
      if (n >= MLIST) { l = mshrink(l, n, x, y); n = n - 1u; }
      l[n] = mleft(e, d);
      l[n][7] = mspread_toward(e, mtensor(u32(nc)), f32(cx), f32(cy), x, y);
      n = n + 1u;
    }
  }
  hn[mocc(c, b)] = select(0.0, 1.0, mfill(c, b, l, n) > 0u);
}

//! kernel MHCLEAR over cells1
@compute @workgroup_size(64) fn MHCLEAR(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  if (i >= P.cells + 1u || !mlocal()) { return; }
  if (MCOMPACT) {
    if (i < P.cells) { for (var k: u32 = 0u; k < 10u; k = k + 1u) { atomicStore(&link[macc(i, k)], 0); } }
    /* one past the last: the sources that have left the box (Medium.departed) */
    if (i == P.cells) { atomicStore(&link[macc(P.cells, 0u)], 0); }
    return;
  }
  atomicStore(&link[i], 0);
}

//! kernel MHSCAN over blocks
@compute @workgroup_size(64) fn MHSCAN(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  if (i >= mnb() || !mlocal() || MCOMPACT) { return; }
  var sum: i32 = 0;
  for (var c: u32 = i * 256u; c < min((i + 1u) * 256u, P.cells + 1u); c = c + 1u) {
    let v: i32 = atomicLoad(&link[c]);
    atomicStore(&link[mstart(c)], sum);
    sum = sum + v;
  }
  atomicStore(&link[mblk(i)], sum);
}

//! kernel MHSCAN2 over one
@compute @workgroup_size(64) fn MHSCAN2(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  if (i > 0u || !mlocal() || MCOMPACT) { return; }
  var run: i32 = 0;
  for (var b: u32 = 0u; b < mnb(); b = b + 1u) {
    let v: i32 = atomicLoad(&link[mblk(b)]);
    atomicStore(&link[mblk(b)], run);
    run = run + v;
  }
  atomicStore(&link[mstart(P.cells + 1u)], run);
}

//! kernel MHSCAN3 over cells1
@compute @workgroup_size(64) fn MHSCAN3(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  if (i >= P.cells + 1u || !mlocal() || MCOMPACT) { return; }
  atomicStore(&link[mstart(i)], atomicLoad(&link[mstart(i)]) + atomicLoad(&link[mblk(i / 256u)]));
  atomicStore(&link[i], 0);
}

//! kernel MHPLACE over holes
@compute @workgroup_size(64) fn MHPLACE(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  if (i >= P.holes || !mlocal() || MCOMPACT) { return; }
  let c: u32 = mbodycell(i);
  let j: i32 = atomicLoad(&link[mstart(c)]) + atomicAdd(&link[c], 1);
  atomicStore(&link[morder(u32(j))], i32(i));
}

//! kernel MHSRC1 over cells32
@compute @workgroup_size(64) fn MHSRC1(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  let c: u32 = i / 32u;
  let l: u32 = i % 32u;
  if (c >= P.cells || !mlocal() || MCOMPACT) { return; }
  var s: array<f32, 12>;
  let cx: f32 = f32(c % P.N);
  let cy: f32 = f32(c / P.N);
  let j0: u32 = u32(atomicLoad(&link[mstart(c)]));
  let j1: u32 = u32(atomicLoad(&link[mstart(c + 1u)]));
  for (var j: u32 = j0 + l; j < j1; j = j + 32u) {
    let h: u32 = u32(atomicLoad(&link[morder(j)]));
    let e: array<f32, 8> = memit(h);
    for (var q: u32 = 0u; q < 6u; q = q + 1u) { s[q] = s[q] + e[q]; }
    s[7] = max(s[7], f32(h + 1u));
    /* and how they stand about the cell's middle (Medium.cell_sources) */
    let o: vec4<f32> = bodat(h);
    let dx: f32 = o.x - cx;
    let dy: f32 = o.y - cy;
    s[8] = s[8] + e[0] * dx * dx;
    s[9] = s[9] + e[0] * dx * dy;
    s[10] = s[10] + e[0] * dy * dy;
  }
  for (var q: u32 = 0u; q < 12u; q = q + 1u) { cel[msrcpart(c, l) + q] = s[q]; }
}

//! kernel MHSRC over cells
@compute @workgroup_size(64) fn MHSRC(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  let c: u32 = i;
  if (i >= P.cells || !mlocal()) { return; }
  if (MCOMPACT) {
    /* compact: the cell's sums, as a source (Medium.cell_sources) */
    var t: array<f32, 12>;
    let n: i32 = atomicLoad(&link[macc(c, 0u)]);
    let qn: f32 = f32(atomicLoad(&link[macc(c, 1u)])) / MSQ;
    if (n > 0 && qn > 0.0) {
      let q: f32 = qn * mqref();
      let cx: f32 = f32(c % P.N) + f32(atomicLoad(&link[macc(c, 2u)])) / MSX / qn;
      let cy: f32 = f32(c / P.N) + f32(atomicLoad(&link[macc(c, 3u)])) / MSX / qn;
      let last: i32 = atomicLoad(&link[macc(c, 9u)]);
      t[0] = q;
      t[1] = q * cx;
      t[2] = q * cy;
      t[3] = q * f32(atomicLoad(&link[macc(c, 4u)])) / MSV / qn;
      t[4] = q * f32(atomicLoad(&link[macc(c, 5u)])) / MSV / qn;
      let one: array<f32, 8> = memit(u32(max(last - 1, 0)));
      t[5] = q * one[5] / max(one[0], 1e-30);
      t[6] = select(-2.0 - f32(c), f32(last - 1), n == 1);
      t[7] = f32(last);
      t[8] = mqref() * f32(atomicLoad(&link[macc(c, 6u)])) / MSX;
      t[9] = mqref() * f32(atomicLoad(&link[macc(c, 7u)])) / MSX;
      t[10] = mqref() * f32(atomicLoad(&link[macc(c, 8u)])) / MSX;
    }
    for (var q2: u32 = 0u; q2 < 12u; q2 = q2 + 1u) { hn[msrc(c) + q2] = t[q2]; }
    return;
  }
  var s: array<f32, 12>;
  for (var l: u32 = 0u; l < 32u; l = l + 1u) {
    for (var q: u32 = 0u; q < 6u; q = q + 1u) { s[q] = s[q] + cel[msrcpart(c, l) + q]; }
    for (var q: u32 = 8u; q < 11u; q = q + 1u) { s[q] = s[q] + cel[msrcpart(c, l) + q]; }
    /* and the last of them by number, one more than it (nought, none) - the body a cell's c-bar is blocked by (MBLOCK) */
    s[7] = max(s[7], cel[msrcpart(c, l) + 7u]);
  }
  let j0: u32 = u32(atomicLoad(&link[mstart(c)]));
  let n: u32 = u32(atomicLoad(&link[mstart(c + 1u)])) - j0;
  /* a lone body keeps its own name, two or more are the cell's own gathering (Medium.cell_sources) */
  s[6] = select(-2.0 - f32(c), f32(atomicLoad(&link[morder(j0)])), n == 1u);
  for (var q: u32 = 0u; q < 12u; q = q + 1u) { hn[msrc(c) + q] = s[q]; }
}

//! kernel MHFIELD over cells
@compute @workgroup_size(64) fn MHFIELD(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  let c: u32 = i;
  if (c >= P.cells || !mlocal()) { return; }
  let ux: f32 = f32(c % P.N);
  let uy: f32 = f32(c / P.N);
  var t: array<f32, 9>;
  var n: u32 = 0u;
  let L: u32 = mnear(c);
  for (var wd: u32 = 0u; wd < 4u; wd = wd + 1u) {
    let bits: u32 = u32(hn[mbits(c, wd)]);
    if (bits == 0u) { continue; }
    for (var bo: u32 = 0u; bo < 24u; bo = bo + 1u) {
      if (((bits >> bo) & 1u) == 0u) { continue; }
      let b: u32 = wd * 24u + bo;
      for (var s: u32 = 0u; s < mslots(); s = s + 1u) {
        let k: u32 = mslot(c, b, s);
        if (!(hn[k] > 0.0)) { continue; }
        let m: array<f32, 8> = mheld(k);
        if (!mfar(m, ux, uy) && n < MNEAR) {
          hn[L + 1u + n] = f32(b * mslots() + s);
          n = n + 1u;
          continue;
        }
        let e: array<f32, 9> = mtaylor(m, ux, uy);
        for (var q: u32 = 0u; q < 9u; q = q + 1u) { t[q] = t[q] + e[q]; }
      }
    }
  }
  for (var q: u32 = 0u; q < 9u; q = q + 1u) { hn[mtay(c) + q] = t[q]; }
  hn[L] = f32(n);
}

//! kernel MHLINK over holes
@compute @workgroup_size(64) fn MHLINK(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  if (i >= P.holes || !mlocal()) { return; }
  if (MCOMPACT) {
    let c: u32 = mbodycell(i);
    if (c >= P.cells) { atomicAdd(&link[macc(P.cells, 0u)], 1); return; }
    let e: array<f32, 8> = memit(i);
    if (!(e[0] > 0.0)) { return; }
    let qn: f32 = e[0] / mqref();
    let o: vec4<f32> = bodat(i);
    let dx: f32 = o.x - f32(c % P.N);
    let dy: f32 = o.y - f32(c / P.N);
    atomicAdd(&link[macc(c, 0u)], 1);
    atomicAdd(&link[macc(c, 1u)], i32(round(qn * MSQ)));
    atomicAdd(&link[macc(c, 2u)], i32(round(qn * dx * MSX)));
    atomicAdd(&link[macc(c, 3u)], i32(round(qn * dy * MSX)));
    atomicAdd(&link[macc(c, 4u)], i32(round(qn * e[3] / e[0] * MSV)));
    atomicAdd(&link[macc(c, 5u)], i32(round(qn * e[4] / e[0] * MSV)));
    atomicAdd(&link[macc(c, 6u)], i32(round(qn * dx * dx * MSX)));
    atomicAdd(&link[macc(c, 7u)], i32(round(qn * dx * dy * MSX)));
    atomicAdd(&link[macc(c, 8u)], i32(round(qn * dy * dy * MSX)));
    atomicMax(&link[macc(c, 9u)], i32(i + 1u));
    return;
  }
  atomicAdd(&link[mbodycell(i)], 1);
}

//! kernel MSTEPH over holes
@compute @workgroup_size(64) fn MSTEPH(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  if (i >= P.holes || !mapart() || (mlocal() && MCELLPULL && MFUSED)) { return; }
  let out: u32 = P.outs;
  let h: u32 = i;
  let pulled: vec2<f32> = vec2<f32>(cel[out + 4u * h], cel[out + 4u * h + 1u]);
  let g: vec4<f32> = bodgo(h);
    let o: vec4<f32> = bodat(h);
    var nx: f32 = o.x;
    var ny: f32 = o.y;
    var npx: f32 = g.x;
    var npy: f32 = g.y;
    if (g.z >= 0.5) {
      var px: f32 = g.x + pulled.x * o.z;
      var py: f32 = g.y + pulled.y * o.z;
      let m: f32 = sqrt(px * px + py * py);
      if (m > o.z) { px = px * o.z / m; py = py * o.z / m; }
      npx = px;
      npy = py;
      nx = o.x + px / o.z * f32(P.K);
      ny = o.y + py / o.z * f32(P.K);
      msetgo(h, px, py);
      msetat(h, nx, ny);
    }
    /* and where that leaves it is kept, this tick's own place on the track - for the bodies an orbit is read off */
    if (h < TRACKB) {
      let tr: u32 = TRACK(P.tick, h);
      cel[tr] = nx;
      cel[tr + 1u] = ny;
      cel[tr + 2u] = npx;
      cel[tr + 3u] = npy;
    }
}

//! kernel MSOURCE over holes
@compute @workgroup_size(64) fn MSOURCE(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  if (i >= P.holes || !mapart() || !mlocal() || !MCELLPULL || !MFUSED) { return; }
  let out: u32 = P.outs;
  let h: u32 = i;
  var pulled: vec2<f32> = vec2<f32>(0.0, 0.0);
  {
    let o: vec4<f32> = bodat(h);
    let bc: u32 = mbodycell(h);
    var gx: f32 = 0.0;
    var gy: f32 = 0.0;
    if (bc < P.cells) {
      gx = cel[mcellpull(bc)];
      gy = cel[mcellpull(bc) + 1u];
    }
    let n: f32 = f32(P.K * P.K);
    let f: f32 = mrecur(o.x, o.y, sqrt(gx * gx + gy * gy) / n);
    pulled = vec2<f32>(gx / n * f, gy / n * f);
    /* kept for a reading (leans) where each body has room for it; compact, a reading asks for it (MLEANS) */
    if (!MCOMPACT) {
      cel[out + 4u * h] = pulled.x;
      cel[out + 4u * h + 1u] = pulled.y;
    }
  }
  let g: vec4<f32> = bodgo(h);
    let o: vec4<f32> = bodat(h);
    var nx: f32 = o.x;
    var ny: f32 = o.y;
    var npx: f32 = g.x;
    var npy: f32 = g.y;
    if (g.z >= 0.5) {
      var px: f32 = g.x + pulled.x * o.z;
      var py: f32 = g.y + pulled.y * o.z;
      let m: f32 = sqrt(px * px + py * py);
      if (m > o.z) { px = px * o.z / m; py = py * o.z / m; }
      npx = px;
      npy = py;
      nx = o.x + px / o.z * f32(P.K);
      ny = o.y + py / o.z * f32(P.K);
      msetgo(h, px, py);
      msetat(h, nx, ny);
    }
    /* and where that leaves it is kept, this tick's own place on the track - for the bodies an orbit is read off */
    if (h < TRACKB) {
      let tr: u32 = TRACK(P.tick, h);
      cel[tr] = nx;
      cel[tr + 1u] = ny;
      cel[tr + 2u] = npx;
      cel[tr + 3u] = npy;
    }
}

//! kernel MPULLC over cells
@compute @workgroup_size(64) fn MPULLC(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  let c: u32 = i;
  if (c >= P.cells || !mlocal() || !MCELLPULL) { return; }
  var many: u32 = 0u;
  var h0: u32 = 0u;
  if (MCOMPACT) {
    many = u32(max(atomicLoad(&link[macc(c, 0u)]), 0));
    h0 = u32(max(atomicLoad(&link[macc(c, 9u)]) - 1, 0));
  } else {
    let j0: u32 = u32(atomicLoad(&link[mstart(c)]));
    let j1: u32 = u32(atomicLoad(&link[mstart(c + 1u)]));
    many = j1 - min(j0, j1);
    if (many > 0u) { h0 = u32(atomicLoad(&link[morder(j0)])); }
  }
  if (many == 0u) { return; }
  var o: vec4<f32> = bodat(h0);
  let w: array<f32, 8> = msourcewas(c);
  if (many > 1u && w[0] > 0.0) { o = vec4<f32>(w[1] / w[0], w[2] / w[0], o.z, o.w); }
  let zown: u32 = h0 + 1u;
  let half: f32 = f32(P.K - 1u) / 2.0;
  var gx: f32 = 0.0;
  var gy: f32 = 0.0;
  for (var k: u32 = 0u; k < P.K * P.K; k = k + 1u) {
    let px: f32 = o.x - half + f32(k % P.K);
      let py: f32 = o.y - half + f32(k / P.K);
      let rho: f32 = mtapc(0u, px, py, 0.0);
      let nf: f32 = mtapc(1u, px, py, 0.0);
      var rate: f32 = 0.0;
  rate = rate + mmeet0_share(rho, nf) * mmeet0_folds(rho, nf) / 2.0;
  rate = rate + mmeet1_share(rho, nf) * mmeet1_folds(rho, nf) / 2.0;
  rate = rate + mmeet2_share(rho, nf) * mmeet2_folds(rho, nf) / 2.0;
      let stood: f32 = mtap(STAND(), px, py, 0.0);
      let came: vec3<f32> = marrive(px, py, zown);
      let per: f32 = rate / select(1.0, 1.0 + stood, xc(20u) > 0.5);
      gx = gx - per * came.y;
      gy = gy - per * came.z;
  }
  cel[mcellpull(c)] = gx;
  cel[mcellpull(c) + 1u] = gy;
}

//! kernel MGEN over made
@compute @workgroup_size(64) fn MGEN(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  let h: u32 = u32(cel[mgen(6u)]) + i;
  if (i >= u32(cel[mgen(7u)]) || h >= P.holes) { return; }
  let seed: u32 = u32(cel[mgen(5u)]);
  let cx: f32 = cel[mgen(1u)];
  let cy: f32 = cel[mgen(2u)];
  let sc: f32 = cel[mgen(3u)];
  let cut: f32 = cel[mgen(4u)];
  var x: f32 = cx;
  var y: f32 = cy;
  if (cel[mgen(0u)] < 0.5) {
    /* surface density falling as e^(-r/scale): r off two draws, as a disc's is */
    let r: f32 = min(-sc * log(mhash(h, seed) * mhash(h, seed + 1u)), cut);
    let th: f32 = 6.283185307179586 * mhash(h, seed + 2u);
    x = cx + r * cos(th);
    y = cy + r * sin(th);
  } else {
    x = cx + (2.0 * mhash(h, seed) - 1.0) * sc;
    y = cy + (2.0 * mhash(h, seed + 1u) - 1.0) * sc;
  }
  msetat(h, x, y);
  msetgo(h, 0.0, 0.0);
}

//! kernel MLAUNCH over holes
@compute @workgroup_size(64) fn MLAUNCH(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  if (i >= P.holes) { return; }
  let h: u32 = i;
  let o: vec4<f32> = bodat(h);
  let bc: u32 = mbodycell(h);
  if (bc >= P.cells) { return; }
  let n: f32 = f32(P.K * P.K);
  var gx: f32 = cel[mcellpull(bc)] / n;
  var gy: f32 = cel[mcellpull(bc) + 1u] / n;
  let f: f32 = mrecur(o.x, o.y, sqrt(gx * gx + gy * gy));
  gx = gx * f;
  gy = gy * f;
  let dx: f32 = (o.x - cel[mgen(1u)]) / f32(P.K);
  let dy: f32 = (o.y - cel[mgen(2u)]) / f32(P.K);
  let r: f32 = sqrt(dx * dx + dy * dy);
  if (!(r > 0.0)) { return; }
  let g: f32 = -(gx * dx + gy * dy) / r;
  let v: f32 = sqrt(max(0.0, g * r));
  let sig: f32 = cel[mgen(8u)];
  let seed: u32 = u32(cel[mgen(5u)]) + 101u;
  let vx: f32 = -v * dy / r + sig * v * mgauss(h, seed);
  let vy: f32 = v * dx / r + sig * v * mgauss(h, seed + 3u);
  msetgo(h, o.z * vx, o.z * vy);
}

//! kernel MFRAMECLEAR over grid2
@compute @workgroup_size(64) fn MFRAMECLEAR(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  let G: u32 = u32(cel[mgen(10u)]);
  if (i >= G * G) { return; }
  atomicStore(&link[mgrid(i)], 0);
}

//! kernel MFRAME over holes
@compute @workgroup_size(64) fn MFRAME(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  if (i >= P.holes || !MCOMPACT) { return; }
  let o: vec4<f32> = bodat(i);
  let G: u32 = u32(cel[mgen(10u)]);
  let span: f32 = cel[mgen(13u)];
  let gx: f32 = ((o.x - cel[mgen(11u)]) / span + 1.0) / 2.0 * f32(G);
  let gy: f32 = ((o.y - cel[mgen(12u)]) / span + 1.0) / 2.0 * f32(G);
  if (gx < 0.0 || gy < 0.0 || gx >= f32(G) || gy >= f32(G)) { return; }
  atomicAdd(&link[mgrid(u32(gy) * G + u32(gx))], 1);
}

//! kernel MPULLH over pulls
@compute @workgroup_size(64) fn MPULLH(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  /* held where they are, a thread a body walks its c-bar's K x K points and keeps only their sum: a part a point was 72 bytes a star */
  let per: u32 = select(P.K * P.K * mchunks(), 1u, mlocal());
  if (i >= P.holes * per || !mapart() || (mlocal() && MCELLPULL && MFUSED)) { return; }
  let half: f32 = f32(P.K - 1u) / 2.0;
  let h: u32 = select(i / per, u32(atomicLoad(&link[morder(min(i, P.holes - 1u))])), mlocal());
  let ch: u32 = i % mchunks();
  let o: vec4<f32> = bodat(h);
  let zown: u32 = u32(o.w);
  var gx: f32 = 0.0;
  var gy: f32 = 0.0;
  let z0: u32 = select(ch * MPCHUNK, 1u, ch == 0u);
  let z1: u32 = select((ch + 1u) * MPCHUNK, mplanes(), (ch + 1u) * MPCHUNK > mplanes());
  if (mlocal() && MCELLPULL) {
    /* held where they are, a body's pull is its cell's, read once for all on it (MPULLC); off the box, none */
    let bc: u32 = mbodycell(h);
    if (bc < P.cells) {
      gx = cel[mcellpull(bc)];
      gy = cel[mcellpull(bc) + 1u];
    }
  } else if (mlocal()) {
    for (var k: u32 = 0u; k < P.K * P.K; k = k + 1u) {
    let px: f32 = o.x - half + f32(k % P.K);
      let py: f32 = o.y - half + f32(k / P.K);
      let rho: f32 = mtapc(0u, px, py, 0.0);
      let nf: f32 = mtapc(1u, px, py, 0.0);
      var rate: f32 = 0.0;
  rate = rate + mmeet0_share(rho, nf) * mmeet0_folds(rho, nf) / 2.0;
  rate = rate + mmeet1_share(rho, nf) * mmeet1_folds(rho, nf) / 2.0;
  rate = rate + mmeet2_share(rho, nf) * mmeet2_folds(rho, nf) / 2.0;
      let stood: f32 = mtap(STAND(), px, py, 0.0);
      let came: vec3<f32> = marrive(px, py, zown);
      let per: f32 = rate / select(1.0, 1.0 + stood, xc(20u) > 0.5);
      gx = gx - per * came.y;
      gy = gy - per * came.z;
    }
  } else {
    let k: u32 = (i % per) / mchunks();
    let px: f32 = o.x - half + f32(k % P.K);
      let py: f32 = o.y - half + f32(k / P.K);
      let rho: f32 = mtapc(0u, px, py, 0.0);
      let nf: f32 = mtapc(1u, px, py, 0.0);
      var rate: f32 = 0.0;
  rate = rate + mmeet0_share(rho, nf) * mmeet0_folds(rho, nf) / 2.0;
  rate = rate + mmeet1_share(rho, nf) * mmeet1_folds(rho, nf) / 2.0;
  rate = rate + mmeet2_share(rho, nf) * mmeet2_folds(rho, nf) / 2.0;
      let stood: f32 = mtap(STAND(), px, py, 0.0);
      for (var z: u32 = z0; z < z1; z = z + 1u) {
        if (z == zown) { continue; }
        let way: vec3<f32> = mout(z, px, py);
        if (way.z <= 0.0) { continue; }
        let tx: f32 = -way.x;
        let ty: f32 = -way.y;
        let share: f32 = rate * mact(msent(z, way.z)) / select(1.0, 1.0 + stood, xc(20u) > 0.5);
        gx = gx + share * tx;
        gy = gy + share * ty;
      }
  }
  /* held where they are the thread took its body in cell order, and the part goes where the body is */
  let at: u32 = select(i, h, mlocal());
  cel[P.part + 2u * at] = gx;
  cel[P.part + 2u * at + 1u] = gy;
}

//! kernel MMOVEH over holes
@compute @workgroup_size(64) fn MMOVEH(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  if (i >= P.holes || !mapart() || (mlocal() && MCELLPULL && MFUSED)) { return; }
  let out: u32 = P.outs;
  let h: u32 = i;
  let o: vec4<f32> = bodat(h);
    let per: u32 = select(P.K * P.K * mchunks(), 1u, mlocal());
    var gx: f32 = 0.0;
    var gy: f32 = 0.0;
    for (var j: u32 = 0u; j < per; j = j + 1u) {
      gx = gx + cel[P.part + 2u * (h * per + j)];
      gy = gy + cel[P.part + 2u * (h * per + j) + 1u];
    }
    let n: f32 = f32(P.K * P.K);
    let f: f32 = mrecur(o.x, o.y, sqrt(gx * gx + gy * gy) / n);
    cel[out + 4u * h] = gx / n * f;
    cel[out + 4u * h + 1u] = gy / n * f;
}

//! kernel MSTEP over one
@compute @workgroup_size(64) fn MSTEP(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  if (i >= 1u || mapart()) { return; }
  let out: u32 = P.outs;
  for (var h: u32 = 0u; h < P.holes; h = h + 1u) {
    let pulled: vec2<f32> = vec2<f32>(cel[out + 4u * h], cel[out + 4u * h + 1u]);
    let g: vec4<f32> = bodgo(h);
    let o: vec4<f32> = bodat(h);
    var nx: f32 = o.x;
    var ny: f32 = o.y;
    var npx: f32 = g.x;
    var npy: f32 = g.y;
    if (g.z >= 0.5) {
      var px: f32 = g.x + pulled.x * o.z;
      var py: f32 = g.y + pulled.y * o.z;
      let m: f32 = sqrt(px * px + py * py);
      if (m > o.z) { px = px * o.z / m; py = py * o.z / m; }
      npx = px;
      npy = py;
      nx = o.x + px / o.z * f32(P.K);
      ny = o.y + py / o.z * f32(P.K);
      msetgo(h, px, py);
      msetat(h, nx, ny);
    }
    /* and where that leaves it is kept, this tick's own place on the track - for the bodies an orbit is read off */
    if (h < TRACKB) {
      let tr: u32 = TRACK(P.tick, h);
      cel[tr] = nx;
      cel[tr + 1u] = ny;
      cel[tr + 2u] = npx;
      cel[tr + 3u] = npy;
    }
  }
}

//! kernel MBLOCK over cells
@compute @workgroup_size(64) fn MBLOCK(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  let c: u32 = i;
  if (i >= P.cells) { return; }
  let x: i32 = i32(c % P.N);
  let y: i32 = i32(c / P.N);
  let half: i32 = i32((P.K - 1u) / 2u);
  var b: f32 = 0.0;
  var pl: f32 = 0.0;
  if (mlocal()) {
    /* held where they are, the last body standing on any cell of the footprint, off each cell's own source (gathered again once they moved): every body apart is on the plane one past its number */
    for (var ddy: i32 = -half; ddy <= half; ddy = ddy + 1) {
      for (var ddx: i32 = -half; ddx <= half; ddx = ddx + 1) {
        let nc: i32 = mcell(x + ddx, y + ddy);
        if (nc >= 0) { b = max(b, hn[msrc(u32(nc)) + 7u]); }
      }
    }
    pl = b;
  } else {
  for (var h: u32 = 0u; h < P.holes; h = h + 1u) {
    let o: vec4<f32> = bodat(h);
    if (abs(x - i32(floor(o.x + 0.5))) <= half && abs(y - i32(floor(o.y + 0.5))) <= half) { b = f32(h + 1u); pl = o.w; }
  }
  }
  cel[5u * P.cells + c] = b;
  cel[(8u + mledger()) * P.cells + c] = pl;
}

//! kernel MKEEP over rungs
@compute @workgroup_size(64) fn MKEEP(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  if (mlocal()) { return; }
  let n: u32 = RUNGS();
  if (i >= mplanes() * n) { return; }
  let z: u32 = i / n;
  let r: u32 = i % n;
  cel[BEAMWAS(z, r)] = cel[BEAMAT(z, r)];
}

//! kernel MCARRY over rungs
@compute @workgroup_size(64) fn MCARRY(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  if (mlocal()) { return; }
  let n: u32 = RUNGS();
  if (i >= mplanes() * n) { return; }
  let z: u32 = i / n;
  let r: u32 = i % n;
  var v: f32 = 0.0;
  if (z == 0u) { v = 0.0; } else if (r == 0u) {
    /* every body apart: the plane is that body's own, looked up rather than searched for among all of them */
    var h0: u32 = 0u;
    var h1: u32 = P.holes;
    if (mapart()) {
      let w: i32 = whom(z);
      h1 = 0u;
      if (w >= 0) { h0 = u32(w); h1 = u32(w) + 1u; }
    }
    for (var h: u32 = h0; h < h1; h = h + 1u) {
      let o: vec4<f32> = bodat(h);
      if (u32(o.w) != z) { continue; }
      let g: vec4<f32> = bodgo(h);
      let beta: f32 = min(1.0, sqrt(g.x * g.x + g.y * g.y) / o.z);
      v = v + mper_way(o.z, beta) * bodskin(h) * mdrift(h);
    }
  } else {
    let D: f32 = xc(6u);
    let face: f32 = facing_out(z);
    let here: f32 = max(face, f32(r));
    let back: f32 = max(face, f32(r) - 1.0);
    v = cel[BEAMWAS(z, r - 1u)] * pow(back / here, D - 1.0);
  }
  cel[BEAMAT(z, r)] = min(1.0, v);
}

//! kernel MOPEN over cells
@compute @workgroup_size(64) fn MOPEN(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  let c: u32 = i;
  if (i >= P.cells) { return; }
  let x: f32 = f32(c % P.N);
  let y: f32 = f32(c / P.N);
  var got: f32 = 0.0;
  /* held where they are, what stands at a point is what its ways hold (Medium.held_at) */
  if (mlocal()) { got = mheldat(c); }
  for (var z: u32 = 1u; z < select(mplanes(), 1u, mlocal()); z = z + 1u) {
    let way: vec3<f32> = mout(z, x, y);
    if (way.z <= 0.0) { continue; }
    got = got + msent(z, way.z);
  }
  cel[c] = min(1.0, mact(got) + xc(4u) * mvac(c));
  cel[1u * P.cells + c] = st[at_plane(FOLD(), c)] + xc(4u) * xc(0u);
  cel[6u * P.cells + c] = 0.0;
  cel[(7u + mledger()) * P.cells + c] = 0.0;
}

//! kernel MMEET over cells
@compute @workgroup_size(64) fn MMEET(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  let c: u32 = i;
  if (i >= P.cells) { return; }
  let x: f32 = f32(c % P.N);
  let y: f32 = f32(c / P.N);
  let rho: f32 = cel[c];
  let nf: f32 = cel[1u * P.cells + c];
  var fold: f32 = 0.0;
  var grew: f32 = 0.0;
  var gone: f32 = 0.0;
  /* EVERY BODY APART: what arrives gathered by the way it comes from, bundle meeting facing bundle (Medium.meet_gathered) */
  if (mapart()) {
    var sums: array<f32, 96>;
    var wxs: array<f32, 96>;
    var wys: array<f32, 96>;
    for (var b: u32 = 0u; b < MGATHER; b = b + 1u) { sums[b] = 0.0; wxs[b] = 0.0; wys[b] = 0.0; }
    /* held where they are, the bins are what the point's own ways hold, and what goes no way out on the way whose angle is nought (Medium.meet_local) */
    if (mlocal()) {
      for (var b: u32 = 0u; b < MGATHER; b = b + 1u) {
        if (!mhas(c, b)) { continue; }
        for (var s: u32 = 0u; s < mslots(); s = s + 1u) {
          let k: u32 = mslot(c, b, s);
          if (!(hn[k] > 0.0)) { continue; }
          let got: vec3<f32> = mreads(mheld(k), x, y);
          sums[b] = sums[b] + got.x;
          wxs[b] = wxs[b] + got.x * got.y;
          wys[b] = wys[b] + got.x * got.z;
        }
      }
      sums[0] = sums[0] + hn[mmid(c)];
    }
    for (var z: u32 = 1u; z < select(mplanes(), 1u, mlocal()); z = z + 1u) {
      let way: vec3<f32> = mout(z, x, y);
      if (way.z <= 0.0) { continue; }
      let got: f32 = msent(z, way.z);
      if (got <= 0.0) { continue; }
      let b: u32 = mbin(way.x, way.y);
      sums[b] = sums[b] + got;
      wxs[b] = wxs[b] + got * way.x;
      wys[b] = wys[b] + got * way.y;
    }
    for (var a: u32 = 0u; a < MGATHER; a = a + 1u) {
      if (sums[a] <= 0.0) { continue; }
      let na: f32 = sqrt(wxs[a] * wxs[a] + wys[a] * wys[a]);
      /* rays with no way out of them (at a body's own middle) face nothing, but still meet the vacuum's own */
      let ax: f32 = select(0.0, wxs[a] / na, na > 0.0);
      let ay: f32 = select(0.0, wys[a] / na, na > 0.0);
      let mine: f32 = sums[a];
      /* a bundle meets only what comes within a turn of the lattice's own of head on, and each bundle's way lies inside its own bin: so only the bins that near the opposite one are looked at - the rest would each be skipped below */
      let span: u32 = u32(ceil(f32(MGATHER) / P.DEG)) + 1u;
      let many: u32 = min(MGATHER, 2u * span + 1u);
      let first: u32 = (a + MGATHER / 2u + MGATHER - min(span, MGATHER / 2u)) % MGATHER;
      for (var s: u32 = 0u; s < many; s = s + 1u) {
        let b: u32 = (first + s) % MGATHER;
        if (b == a || sums[b] <= 0.0 || na <= 0.0) { continue; }
        let nb: f32 = sqrt(wxs[b] * wxs[b] + wys[b] * wys[b]);
        if (nb <= 0.0) { continue; }
        let bx: f32 = wxs[b] / nb;
        let by: f32 = wys[b] / nb;
        if (-(ax * bx + ay * by) <= cos(6.283185307179586 / P.DEG)) { continue; }
        let over: f32 = mfacing(ax, ay, bx, by);
        if (over <= 0.0) { continue; }
        let theirs: f32 = sums[b];
  {
    let w: f32 = mmeet0_share(rho, nf) * mact(mine) * mact(theirs) * over;
    fold = fold + w * mmeet0_folds(rho, nf) / 2.0;
    grew = grew + w * mmeet0_space(rho, nf) / 2.0;
    gone = gone + w * abs(mmeet0_folds(rho, nf)) / 2.0;
  }
  {
    let w: f32 = mmeet1_share(rho, nf) * mact(mine) * mact(theirs) * over;
    fold = fold + w * mmeet1_folds(rho, nf) / 2.0;
    grew = grew + w * mmeet1_space(rho, nf) / 2.0;
    gone = gone + w * abs(mmeet1_folds(rho, nf)) / 2.0;
  }
  {
    let w: f32 = mmeet2_share(rho, nf) * mact(mine) * mact(theirs) * over;
    fold = fold + w * mmeet2_folds(rho, nf) / 2.0;
    grew = grew + w * mmeet2_space(rho, nf) / 2.0;
    gone = gone + w * abs(mmeet2_folds(rho, nf)) / 2.0;
  }
      }
      if (xc(4u) > 0.5) {
        let theirs: f32 = xc(1u);
        let over: f32 = 1.0 / P.DEG;
  {
    let w: f32 = mmeet0_share(rho, nf) * mact(mine) * mact(theirs) * over;
    fold = fold + w * mmeet0_folds(rho, nf) / 2.0;
    grew = grew + w * mmeet0_space(rho, nf) / 2.0;
    gone = gone + w * abs(mmeet0_folds(rho, nf)) / 2.0;
  }
  {
    let w: f32 = mmeet1_share(rho, nf) * mact(mine) * mact(theirs) * over;
    fold = fold + w * mmeet1_folds(rho, nf) / 2.0;
    grew = grew + w * mmeet1_space(rho, nf) / 2.0;
    gone = gone + w * abs(mmeet1_folds(rho, nf)) / 2.0;
  }
  {
    let w: f32 = mmeet2_share(rho, nf) * mact(mine) * mact(theirs) * over;
    fold = fold + w * mmeet2_folds(rho, nf) / 2.0;
    grew = grew + w * mmeet2_space(rho, nf) / 2.0;
    gone = gone + w * abs(mmeet2_folds(rho, nf)) / 2.0;
  }
      }
    }
  }
  for (var z: u32 = 1u; z < select(mplanes(), 1u, mapart()); z = z + 1u) {
    let way: vec3<f32> = mout(z, x, y);
    if (way.z <= 0.0) { continue; }
    let mine: f32 = msent(z, way.z);
    if (mine <= 0.0) { continue; }
    for (var yy: u32 = 1u; yy < mplanes(); yy = yy + 1u) {
      if (yy == z) { continue; }
      let their: vec3<f32> = mout(yy, x, y);
      if (their.z <= 0.0) { continue; }
      let theirs: f32 = msent(yy, their.z);
      if (theirs <= 0.0) { continue; }
      /* the two only meet where their ways have something in common, which is a turn of the lattice's own at most: the rest of the box is skipped before any of it is worked out */
      if (-(way.x * their.x + way.y * their.y) <= cos(6.283185307179586 / P.DEG)) { continue; }
      let over: f32 = mfacing(way.x, way.y, their.x, their.y);
      if (over <= 0.0) { continue; }
  {
    let w: f32 = mmeet0_share(rho, nf) * mact(mine) * mact(theirs) * over;
    fold = fold + w * mmeet0_folds(rho, nf) / 2.0;
    grew = grew + w * mmeet0_space(rho, nf) / 2.0;
    gone = gone + w * abs(mmeet0_folds(rho, nf)) / 2.0;
  }
  {
    let w: f32 = mmeet1_share(rho, nf) * mact(mine) * mact(theirs) * over;
    fold = fold + w * mmeet1_folds(rho, nf) / 2.0;
    grew = grew + w * mmeet1_space(rho, nf) / 2.0;
    gone = gone + w * abs(mmeet1_folds(rho, nf)) / 2.0;
  }
  {
    let w: f32 = mmeet2_share(rho, nf) * mact(mine) * mact(theirs) * over;
    fold = fold + w * mmeet2_folds(rho, nf) / 2.0;
    grew = grew + w * mmeet2_space(rho, nf) / 2.0;
    gone = gone + w * abs(mmeet2_folds(rho, nf)) / 2.0;
  }
    }
    /* and against the vacuum's own rays, which stand on every way there is (Medium.meet) */
    if (xc(4u) > 0.5) {
      let theirs: f32 = xc(1u);
      let over: f32 = 1.0 / P.DEG;
  {
    let w: f32 = mmeet0_share(rho, nf) * mact(mine) * mact(theirs) * over;
    fold = fold + w * mmeet0_folds(rho, nf) / 2.0;
    grew = grew + w * mmeet0_space(rho, nf) / 2.0;
    gone = gone + w * abs(mmeet0_folds(rho, nf)) / 2.0;
  }
  {
    let w: f32 = mmeet1_share(rho, nf) * mact(mine) * mact(theirs) * over;
    fold = fold + w * mmeet1_folds(rho, nf) / 2.0;
    grew = grew + w * mmeet1_space(rho, nf) / 2.0;
    gone = gone + w * abs(mmeet1_folds(rho, nf)) / 2.0;
  }
  {
    let w: f32 = mmeet2_share(rho, nf) * mact(mine) * mact(theirs) * over;
    fold = fold + w * mmeet2_folds(rho, nf) / 2.0;
    grew = grew + w * mmeet2_space(rho, nf) / 2.0;
    gone = gone + w * abs(mmeet2_folds(rho, nf)) / 2.0;
  }
    }
  }
  st[at_plane(FOLD(), c)] = max(0.0, st[at_plane(FOLD(), c)] + fold);
  cel[6u * P.cells + c] = gone;
  cel[(7u + mledger()) * P.cells + c] = grew;
}

//! kernel MUNFOLD over cells
@compute @workgroup_size(64) fn MUNFOLD(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  let c: u32 = i;
  if (i >= P.cells) { return; }
  let rho: f32 = cel[c];
  /* the excess above the settled vacuum's own record, which is all the fold plane holds: the vacuum's own is not carried and neither is its clearing (Medium.unfold) */
  let nf: f32 = cel[1u * P.cells + c] - xc(4u) * xc(0u);
  var h: f32 = 0.0;
  if (P.tick % 2u == 1u) {
  {
    let back: f32 = mpoint0_folds(rho, nf);
    if (back != 0.0) { h = h + mpoint0_share(rho, nf) * back; }
  }
  {
    let back: f32 = mpoint1_folds(rho, nf);
    if (back != 0.0) { h = h + mpoint1_share(rho, nf) * back; }
  }
  {
    let back: f32 = mpoint2_folds(rho, nf);
    if (back != 0.0) { h = h + mpoint2_share(rho, nf) * back; }
  }
  }
  st[at_plane(FOLD(), c)] = max(0.0, st[at_plane(FOLD(), c)] + h);
  st[at_plane(STAND(), c)] = max(0.0, nf + h);
}

//! kernel MSETTLE over cells
@compute @workgroup_size(64) fn MSETTLE(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  let c: u32 = i;
  if (i >= P.cells) { return; }
  if (xc(4u) < 0.5) { return; }
  let nf: f32 = cel[1u * P.cells + c];
  let theirs: f32 = max(0.0, cel[c] - mvac(c));
  var lo: f32 = 0.0;
  var hi: f32 = 1.0;
  for (var k: i32 = 0; k < 24; k = k + 1) {
    let mid: f32 = (lo + hi) / 2.0;
    if (mnets(min(1.0, mid + theirs), nf) > 0.0) { lo = mid; } else { hi = mid; }
  }
  st[at_plane(VAC(), c)] = (lo + hi) / 2.0;
}

//! kernel MMAKE over cells
@compute @workgroup_size(64) fn MMAKE(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  let c: u32 = i;
  if (i >= P.cells) { return; }
  let rho: f32 = cel[c];
  let nf: f32 = cel[1u * P.cells + c];
  var grown: f32 = cel[(7u + mledger()) * P.cells + c];
  grown = grown + mpoint0_share(rho, nf) * mpoint0_space(rho, nf);
  grown = grown + mpoint1_share(rho, nf) * mpoint1_space(rho, nf);
  grown = grown + mpoint2_share(rho, nf) * mpoint2_space(rho, nf);
  grown = grown + msingle0_share(rho, nf) * rho * msingle0_space(rho, nf);
  cel[(7u + mledger()) * P.cells + c] = grown;
}

//! kernel MLEAN over cells
@compute @workgroup_size(64) fn MLEAN(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  let c: u32 = i;
  if (i >= P.cells) { return; }
  let x: f32 = f32(c % P.N);
  let y: f32 = f32(c / P.N);
  let zown: u32 = u32(cel[(8u + mledger()) * P.cells + c]);
  let rho: f32 = cel[c];
  let nf: f32 = cel[1u * P.cells + c];
  var rate: f32 = 0.0;
  rate = rate + mmeet0_share(rho, nf) * mmeet0_folds(rho, nf) / 2.0;
  rate = rate + mmeet1_share(rho, nf) * mmeet1_folds(rho, nf) / 2.0;
  rate = rate + mmeet2_share(rho, nf) * mmeet2_folds(rho, nf) / 2.0;
  let stood: f32 = st[at_plane(STAND(), c)];
  var gx: f32 = 0.0;
  var gy: f32 = 0.0;
  if (mlocal()) {
    let came: vec3<f32> = marrive(x, y, zown);
    let per: f32 = rate / select(1.0, 1.0 + stood, xc(20u) > 0.5);
    gx = gx - per * came.y;
    gy = gy - per * came.z;
  }
  for (var z: u32 = 1u; z < select(mplanes(), 1u, mlocal()); z = z + 1u) {
    if (z == zown) { continue; }
    let way: vec3<f32> = mout(z, x, y);
    if (way.z <= 0.0) { continue; }
    let share: f32 = rate * mact(msent(z, way.z)) / select(1.0, 1.0 + stood, xc(20u) > 0.5);
    gx = gx - share * way.x;
    gy = gy - share * way.y;
  }
  let f: f32 = mrecur(x, y, sqrt(gx * gx + gy * gy));
  cel[2u * P.cells + c] = gx * f;
  cel[3u * P.cells + c] = gy * f;
  cel[4u * P.cells + c] = st[at_plane(FOLD(), c)];
}

//! kernel MMOVE over one
@compute @workgroup_size(64) fn MMOVE(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  if (i >= 1u || mapart()) { return; }
  let out: u32 = P.outs;
  let half: f32 = f32(P.K - 1u) / 2.0;
  for (var h: u32 = 0u; h < P.holes; h = h + 1u) {
    let o: vec4<f32> = bodat(h);
    let zown: u32 = u32(o.w);
    var gx: f32 = 0.0;
    var gy: f32 = 0.0;
    for (var k: u32 = 0u; k < P.K * P.K; k = k + 1u) {
      let z0: u32 = 1u;
      let z1: u32 = mplanes();
      let px: f32 = o.x - half + f32(k % P.K);
      let py: f32 = o.y - half + f32(k / P.K);
      let rho: f32 = mtapc(0u, px, py, 0.0);
      let nf: f32 = mtapc(1u, px, py, 0.0);
      var rate: f32 = 0.0;
  rate = rate + mmeet0_share(rho, nf) * mmeet0_folds(rho, nf) / 2.0;
  rate = rate + mmeet1_share(rho, nf) * mmeet1_folds(rho, nf) / 2.0;
  rate = rate + mmeet2_share(rho, nf) * mmeet2_folds(rho, nf) / 2.0;
      let stood: f32 = mtap(STAND(), px, py, 0.0);
      for (var z: u32 = z0; z < z1; z = z + 1u) {
        if (z == zown) { continue; }
        let way: vec3<f32> = mout(z, px, py);
        if (way.z <= 0.0) { continue; }
        let tx: f32 = -way.x;
        let ty: f32 = -way.y;
        let share: f32 = rate * mact(msent(z, way.z)) / select(1.0, 1.0 + stood, xc(20u) > 0.5);
        gx = gx + share * tx;
        gy = gy + share * ty;
      }
    }
    let n: f32 = f32(P.K * P.K);
    let f: f32 = mrecur(o.x, o.y, sqrt(gx * gx + gy * gy) / n);
    cel[out + 4u * h] = gx / n * f;
    cel[out + 4u * h + 1u] = gy / n * f;
  }
}

//! kernel MPROBE over entries
@compute @workgroup_size(64) fn MPROBE(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  if (i >= P.entries) { return; }
  let ask: vec4<f32> = dir[P.A + 2u * MAXH + CN + i];
  let zown: u32 = u32(ask.z);
  let half: f32 = f32(P.K - 1u) / 2.0;
  var gx: f32 = 0.0;
  var gy: f32 = 0.0;
  for (var k: u32 = 0u; k < P.K * P.K; k = k + 1u) {
    let px: f32 = ask.x - half + f32(k % P.K);
    let py: f32 = ask.y - half + f32(k / P.K);
    let rho: f32 = mtapc(0u, px, py, 0.0);
    let nf: f32 = mtapc(1u, px, py, 0.0);
    var rate: f32 = 0.0;
  rate = rate + mmeet0_share(rho, nf) * mmeet0_folds(rho, nf) / 2.0;
  rate = rate + mmeet1_share(rho, nf) * mmeet1_folds(rho, nf) / 2.0;
  rate = rate + mmeet2_share(rho, nf) * mmeet2_folds(rho, nf) / 2.0;
    let stood: f32 = mtap(STAND(), px, py, 0.0);
    if (mlocal()) {
      let came: vec3<f32> = marrive(px, py, zown);
      let per: f32 = rate / select(1.0, 1.0 + stood, xc(20u) > 0.5);
      gx = gx - per * came.y;
      gy = gy - per * came.z;
    }
    for (var z: u32 = 1u; z < select(mplanes(), 1u, mlocal()); z = z + 1u) {
      if (z == zown) { continue; }
      let way: vec3<f32> = mout(z, px, py);
      if (way.z <= 0.0) { continue; }
      let share: f32 = rate * mact(msent(z, way.z)) / select(1.0, 1.0 + stood, xc(20u) > 0.5);
      gx = gx - share * way.x;
      gy = gy - share * way.y;
    }
  }
  let n: f32 = f32(P.K * P.K);
  let f: f32 = mrecur(ask.x, ask.y, sqrt(gx * gx + gy * gy) / n);
  let out: u32 = P.outs + select(4u * P.holes, 0u, MCOMPACT);
  cel[out + 2u * i] = gx / n * f;
  cel[out + 2u * i + 1u] = gy / n * f;
}

//! kernel MSWEEP over cells
@compute @workgroup_size(64) fn MSWEEP(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (P.fill > 0u && gid.y * 1024u * 64u + gid.x >= P.fill) { return; }
  let i: u32 = P.first + gid.y * 1024u * 64u + gid.x;
  let c: u32 = i;
  if (i >= P.cells) { return; }
  let x: f32 = f32(c % P.N);
  let y: f32 = f32(c / P.N);
  cel[7u * P.cells + c] = 0.0;
  /* every body apart: all the bodies' rays together on one ledger (Medium.apart) */
  if (mapart()) {
    var summed: f32 = select(0.0, mheldat(c), mlocal());
    for (var z: u32 = 1u; z < select(mplanes(), 1u, mlocal()); z = z + 1u) {
      let way: vec3<f32> = mout(z, x, y);
      summed = summed + select(0.0, msent(z, way.z), way.z > 0.0);
    }
    cel[8u * P.cells + c] = summed;
    return;
  }
  for (var z: u32 = 1u; z < mplanes(); z = z + 1u) {
    let way: vec3<f32> = mout(z, x, y);
    cel[(7u + z) * P.cells + c] = select(0.0, msent(z, way.z), way.z > 0.0);
  }
}
