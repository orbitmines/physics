//! tick SNAP CLEAR SWEEP TOTAL MEET0 TAKE CREATE1 CREATE2 CARRY TAGCARRY@z TAGCOPY@z GATHER | APPLY SETTLE SNAP SWEEP ARRIVED
#version 450
#define f32 float
#define u32 uint
#define i32 int
#define f32_of_u(x) float(x)
#define i32_of_u(x) int(x)
#define i32_of_f(x) int(x)
#define u32_of_i(x) uint(x)
#define absf(x) abs(x)
#define maxf(a, b) max(a, b)
#define clampf(x, lo, hi) clamp(x, lo, hi)
#define rnd(x) round(x)
#define select(a, b, c) ((c) ? (b) : (a))

layout(std140, set = 0, binding = 0) uniform ParBlock { uint cells; uint A; uint N; uint K; float DEG; uint holes; uint tick; uint tags; uint z; uint entries; uint pad1; uint pad2; } P;
layout(std430, set = 0, binding = 1) buffer StBlock { float st[]; };
layout(std430, set = 0, binding = 2) buffer CelBlock { float cel[]; };
layout(std430, set = 0, binding = 3) readonly buffer DirBlock { vec4 dir[]; };

u32 nA(u32 a, u32 c) {
  return a * P.cells + c;
}

u32 wA(u32 a, u32 c) {
  return P.cells * P.A + a * P.cells + c;
}

u32 dA(u32 a, u32 c) {
  return 2u * P.cells * P.A + a * P.cells + c;
}

u32 fA(u32 a, u32 c) {
  return 3u * P.cells * P.A + a * P.cells + c;
}

u32 tA(u32 a, u32 c) {
  return 4u * P.cells * P.A + a * P.cells + c;
}

u32 aA(u32 a, u32 c) {
  return 5u * P.cells * P.A + a * P.cells + c;
}

u32 eA(u32 a, u32 c) {
  return 6u * P.cells * P.A + a * P.cells + c;
}

u32 kA(u32 a, u32 c) {
  return 7u * P.cells * P.A + a * P.cells + c;
}

u32 gA(u32 a, u32 c) {
  return 8u * P.cells * P.A + a * P.cells + c;
}

u32 bA(u32 z, u32 a, u32 c) {
  return (9u + 2u * z) * P.cells * P.A + a * P.cells + c;
}

u32 beA(u32 z, u32 a, u32 c) {
  return (10u + 2u * z) * P.cells * P.A + a * P.cells + c;
}

u32 sA(u32 a, u32 c) {
  return (9u + 2u * (P.tags - 1u)) * P.cells * P.A + a * P.cells + c;
}

i32 tap(u32 c, u32 a, f32 sign, u32 k) {
  f32 px = f32_of_u(c % P.N) + sign * dir[a].z;
  f32 py = f32_of_u(c / P.N) + sign * dir[a].w;
  i32 x0 = i32_of_f(floor(px));
  i32 y0 = i32_of_f(floor(py));
  i32 tx = x0 + i32_of_u(k % 2u);
  i32 ty = y0 + i32_of_u(k / 2u);
  if (tx < 0 || ty < 0 || tx >= i32_of_u(P.N) || ty >= i32_of_u(P.N)) { return -1; }
  return ty * i32_of_u(P.N) + tx;
}

f32 tapw(u32 c, u32 a, f32 sign, u32 k) {
  f32 px = f32_of_u(c % P.N) + sign * dir[a].z;
  f32 py = f32_of_u(c / P.N) + sign * dir[a].w;
  f32 fx = px - floor(px);
  f32 fy = py - floor(py);
  f32 wx = select(1.0 - fx, fx, (k % 2u) == 1u);
  f32 wy = select(1.0 - fy, fy, (k / 2u) == 1u);
  return wx * wy;
}

u32 opp(u32 a) {
  return (a + P.A / 2u) % P.A;
}

f32 view(u32 a, u32 c) {
  f32 m = 0.0;
  m = st[wA(a, c)] + st[tA(a, c)] + st[aA(a, c)];
  return maxf(0.0, m);
}

f32 moving(u32 a, u32 c) {
  return view(a, c);
}

f32 moving_of(u32 z, u32 a, u32 c) {
  f32 had = 0.0;
  f32 whole = 0.0;
  had = st[bA(z, a, c)];
  whole = st[wA(a, c)];
  if (had <= 0.0 || whole <= 0.0) { return 0.0; }
  f32 f = 0.0;
  f = (whole + st[tA(a, c)] + st[aA(a, c)]) / whole;
  if (f < 0.0) { f = 0.0; }
  return had * f;
}

f32 crossing(u32 i, u32 j) {
  if (P.tags < 3u) { return 0.0; }
  f32 wi = st[P.cells * P.A + i];
  f32 wj = st[P.cells * P.A + j];
  if (wi <= 0.0 || wj <= 0.0) { return 0.0; }
  f32 f1i = st[9u * P.cells * P.A + i] / wi;
  f32 f1j = st[9u * P.cells * P.A + j] / wj;
  f32 alli = 0.0;
  f32 allj = 0.0;
  for (u32 z = 0u; z < P.tags - 1u; z++) {
    alli = alli + st[(9u + 2u * z) * P.cells * P.A + i];
    allj = allj + st[(9u + 2u * z) * P.cells * P.A + j];
  }
  alli = alli / wi;
  allj = allj / wj;
  return f1i * (allj - f1j) + (alli - f1i) * f1j;
}

f32 meet0_gate(f32 rho, f32 nf) {
  f32 F = 1.0;
  f32 omega = 1.0;
  f32 beta = 0.0;
  f32 DEG = P.DEG;
  return clampf(F, 0.0, 1.0);
}

f32 meet0_rays(f32 rho, f32 nf) {
  f32 F = 1.0;
  f32 omega = 1.0;
  f32 beta = 0.0;
  f32 DEG = P.DEG;
  return (-2.0);
}

f32 meet0_space(f32 rho, f32 nf) {
  f32 F = 1.0;
  f32 omega = 1.0;
  f32 beta = 0.0;
  f32 DEG = P.DEG;
  return (-1.0);
}

f32 meet0_folds(f32 rho, f32 nf) {
  f32 F = 1.0;
  f32 omega = 1.0;
  f32 beta = 0.0;
  f32 DEG = P.DEG;
  return 1.0;
}

//! kernel SNAP over cells*A
layout(local_size_x = 64) in;
void main() {
  u32 i = gl_GlobalInvocationID.y * 1024u * 64u + gl_GlobalInvocationID.x;
  if (i >= P.cells * P.A) { return; }
  st[P.cells * P.A + i] = st[i];
  st[8u * P.cells * P.A + i] = st[3u * P.cells * P.A + i];
  st[2u * P.cells * P.A + i] = 0.0;
  st[4u * P.cells * P.A + i] = 0.0;
  st[5u * P.cells * P.A + i] = 0.0;
  st[6u * P.cells * P.A + i] = 0.0;
  st[7u * P.cells * P.A + i] = 0.0;
  for (u32 z = 0u; z < P.tags - 1u; z++) {
    st[(10u + 2u * z) * P.cells * P.A + i] = 0.0;
  }
}

//! kernel CLEAR over cells
layout(local_size_x = 64) in;
void main() {
  u32 i = gl_GlobalInvocationID.y * 1024u * 64u + gl_GlobalInvocationID.x;
  if (i >= P.cells) { return; }
  cel[3u * P.cells + i] = 0.0;
  cel[6u * P.cells + i] = 0.0;
}

//! kernel SWEEP over cells
layout(local_size_x = 64) in;
void main() {
  u32 i = gl_GlobalInvocationID.y * 1024u * 64u + gl_GlobalInvocationID.x;
  u32 c = i;
  if (i >= P.cells) { return; }
  f32 s = 0.0;
  for (u32 a = 0u; a < P.A; a++) {
    s = s + clampf(st[wA(a, c)], 0.0, 1.0);
  }
  cel[0u * P.cells + c] = s / f32_of_u(P.A);
}

//! kernel GATHER over holes*A
layout(local_size_x = 64) in;
void main() {
  u32 i = gl_GlobalInvocationID.y * 1024u * 64u + gl_GlobalInvocationID.x;
  if (i >= P.holes * P.A) { return; }
  u32 h = i / P.A;
  u32 a = i % P.A;
  i32 cx = i32_of_f(dir[P.A + h].x);
  i32 cy = i32_of_f(dir[P.A + h].y);
  st[sA(0u, i)] = 0.0;
  st[sA(0u, P.holes * P.A + i)] = 0.0;
  if (cx < 0 || cy < 0 || cx >= i32_of_u(P.N) || cy >= i32_of_u(P.N)) { return; }
  u32 c = u32_of_i(cy) * P.N + u32_of_i(cx);
  st[sA(0u, i)] = view(a, c);
  st[sA(0u, P.holes * P.A + i)] = st[gA(a, c)];
  i32 nx = cx + i32_of_f(select(-floor(0.5 - dir[a].z), floor(dir[a].z + 0.5), dir[a].z >= 0.0));
  i32 ny = cy + i32_of_f(select(-floor(0.5 - dir[a].w), floor(dir[a].w + 0.5), dir[a].w >= 0.0));
  u32 inside = select(0u, 1u, nx >= 0 && ny >= 0 && nx < i32_of_u(P.N) && ny < i32_of_u(P.N));
  u32 nc = select(0u, u32_of_i(ny) * P.N + u32_of_i(nx), inside == 1u);
  for (u32 b = 0u; b < P.A; b++) {
    st[sA(0u, 2u * P.holes * P.A + i * P.A + b)] = select(0.0, st[gA(b, nc)], inside == 1u);
  }
}

//! kernel APPLY over one
layout(local_size_x = 64) in;
void main() {
  u32 i = gl_GlobalInvocationID.y * 1024u * 64u + gl_GlobalInvocationID.x;
  if (i >= 1u) { return; }
  for (u32 e = 0u; e < P.entries; e++) {
    u32 k = u32_of_i(i32_of_f(dir[P.A + 64u + e].x));
    f32 amount = dir[P.A + 64u + e].y;
    i32 tag = i32_of_f(dir[P.A + 64u + e].z);
    f32 kind = dir[P.A + 64u + e].w;
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
layout(local_size_x = 64) in;
void main() {
  u32 i = gl_GlobalInvocationID.y * 1024u * 64u + gl_GlobalInvocationID.x;
  u32 c = i;
  if (i >= P.cells) { return; }
  if (cel[5u * P.cells + c] > 0.5) { return; }
  f32 rho = cel[0u * P.cells + c];
  f32 nf = cel[1u * P.cells + c];
  f32 dSpace = 0.0;
  f32 gone = 0.0;
  f32 cross = 0.0;
  for (u32 a = 0u; a < P.A; a++) {
    u32 o = opp(a);
    f32 facing = 0.0;
    f32 mixed = 0.0;
    f32 inside = 0.0;
    for (u32 q = 0u; q < 4u; q++) {
      i32 to = tap(c, a, 1.0, q);
      f32 tw = tapw(c, a, 1.0, q);
      if (to >= 0) {
        inside = inside + tw;
        if (cel[5u * P.cells + u32_of_i(to)] <= 0.5) {
          u32 j = o * P.cells + u32_of_i(to);
          f32 aj = clampf(st[P.cells * P.A + j], 0.0, 1.0);
          facing = facing + tw * aj;
          mixed = mixed + tw * aj * crossing(a * P.cells + c, j);
        }
      }
    }
    if (inside < 1.0) {
      u32 jm = o * P.cells + c;
      f32 am = clampf(st[P.cells * P.A + jm], 0.0, 1.0);
      facing = facing + (1.0 - inside) * am;
      mixed = mixed + (1.0 - inside) * am * crossing(a * P.cells + c, jm);
    }
      f32 w = clampf(st[wA(a, c)], 0.0, 1.0) * facing * meet0_gate(rho, nf);
      if (w > 0.0) {
        st[kA(a, c)] = st[kA(a, c)] + w * meet0_rays(rho, nf) / 2.0;
        f32 ds = w * meet0_space(rho, nf) / 2.0;
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
layout(local_size_x = 64) in;
void main() {
  u32 i = gl_GlobalInvocationID.y * 1024u * 64u + gl_GlobalInvocationID.x;
  u32 c = i;
  if (i >= P.cells) { return; }
  if (cel[5u * P.cells + c] > 0.5) { return; }
  f32 rho = cel[0u * P.cells + c];
  f32 nf = cel[1u * P.cells + c];
  f32 F = 1.0;
  f32 omega = 1.0;
  f32 beta = 0.0;
  f32 DEG = P.DEG;
  f32 dSpace = 0.0;
  f32 fires0 = clampf((1.0 - rho), 0.0, 1.0) * 1.0;
  if (fires0 > 0.0) {
    for (u32 a = 0u; a < P.A; a++) {
      st[dA(a, c)] = st[dA(a, c)] + fires0 * (DEG) / DEG * (1.0 - clampf(st[wA(a, c)], 0.0, 1.0));
    }
    dSpace = dSpace + fires0 * (1.0);
    f32 df0 = fires0 * ((-DEG)) / DEG;
    for (u32 a = 0u; a < P.A; a++) {
      st[fA(a, c)] = maxf(0.0, st[fA(a, c)] + df0);
    }
  }
  cel[2u * P.cells + c] = cel[2u * P.cells + c] + dSpace;
}

//! kernel CREATE2 over cells
layout(local_size_x = 64) in;
void main() {
  u32 i = gl_GlobalInvocationID.y * 1024u * 64u + gl_GlobalInvocationID.x;
  u32 c = i;
  if (i >= P.cells) { return; }
  if (cel[5u * P.cells + c] > 0.5) { return; }
  f32 rho = cel[0u * P.cells + c];
  f32 nf = cel[1u * P.cells + c];
  f32 F = 1.0;
  f32 omega = 1.0;
  f32 beta = 0.0;
  f32 DEG = P.DEG;
  f32 dSpace = 0.0;
  f32 fires0 = clampf((1.0 - omega), 0.0, 1.0) * rho;
  if (fires0 > 0.0) {
    for (u32 a = 0u; a < P.A; a++) {
      st[dA(a, c)] = st[dA(a, c)] + fires0 * (0.0) / DEG * 1.0;
    }
    dSpace = dSpace + fires0 * (1.0);
    f32 df0 = fires0 * (0.0) / DEG;
    for (u32 a = 0u; a < P.A; a++) {
      st[fA(a, c)] = maxf(0.0, st[fA(a, c)] + df0);
    }
  }
  cel[2u * P.cells + c] = cel[2u * P.cells + c] + dSpace;
}

//! kernel TAKE over cells*A
layout(local_size_x = 64) in;
void main() {
  u32 i = gl_GlobalInvocationID.y * 1024u * 64u + gl_GlobalInvocationID.x;
  if (i >= P.cells * P.A) { return; }
  st[4u * P.cells * P.A + i] = st[4u * P.cells * P.A + i] + st[7u * P.cells * P.A + i];
  st[7u * P.cells * P.A + i] = 0.0;
}

//! kernel TOTAL over cells
layout(local_size_x = 64) in;
void main() {
  u32 i = gl_GlobalInvocationID.y * 1024u * 64u + gl_GlobalInvocationID.x;
  u32 c = i;
  if (i >= P.cells) { return; }
  f32 nf = 0.0;
  for (u32 b = 0u; b < P.A; b++) {
    nf = nf + maxf(0.0, st[gA(b, c)]);
  }
  nf = nf * (P.DEG / f32_of_u(P.A));
  cel[1u * P.cells + c] = nf;
  cel[4u * P.cells + c] = 1.0 / (1.0 + nf);
}

//! kernel CARRY over cells*A
layout(local_size_x = 64) in;
void main() {
  u32 i = gl_GlobalInvocationID.y * 1024u * 64u + gl_GlobalInvocationID.x;
  if (i >= P.cells * P.A) { return; }
  u32 a = i / P.cells;
  u32 c = i % P.cells;
  f32 got = 0.0;
  for (u32 q = 0u; q < 4u; q++) {
    i32 src = tap(c, a, -1.0, q);
    if (src >= 0) {
      f32 sw = tapw(c, a, -1.0, q);
      got = got + sw * moving(a, u32_of_i(src)) * cel[4u * P.cells + u32_of_i(src)];
      f32 fa = st[gA(a, u32_of_i(src))];
      if (fa > 0.0) {
      for (u32 b = 0u; b < P.A; b++) {
        got = got + sw * moving(b, u32_of_i(src)) * fa * cel[4u * P.cells + u32_of_i(src)] * (P.DEG / f32_of_u(P.A));
      }
      }
    }
  }
  st[nA(a, c)] = got;
}

//! kernel TAGCARRY over cells*A
layout(local_size_x = 64) in;
void main() {
  u32 i = gl_GlobalInvocationID.y * 1024u * 64u + gl_GlobalInvocationID.x;
  if (i >= P.cells * P.A) { return; }
  u32 a = i / P.cells;
  u32 c = i % P.cells;
  f32 got = 0.0;
  for (u32 q = 0u; q < 4u; q++) {
    i32 src = tap(c, a, -1.0, q);
    if (src >= 0) {
      f32 sw = tapw(c, a, -1.0, q);
      got = got + sw * moving_of(P.z, a, u32_of_i(src)) * cel[4u * P.cells + u32_of_i(src)];
      f32 fa = st[gA(a, u32_of_i(src))];
      if (fa > 0.0) {
      for (u32 b = 0u; b < P.A; b++) {
        got = got + sw * moving_of(P.z, b, u32_of_i(src)) * fa * cel[4u * P.cells + u32_of_i(src)] * (P.DEG / f32_of_u(P.A));
      }
      }
    }
  }
  st[sA(a, c)] = got;
}

//! kernel TAGCOPY over cells*A
layout(local_size_x = 64) in;
void main() {
  u32 i = gl_GlobalInvocationID.y * 1024u * 64u + gl_GlobalInvocationID.x;
  if (i >= P.cells * P.A) { return; }
  st[(9u + 2u * P.z) * P.cells * P.A + i] = st[(9u + 2u * (P.tags - 1u)) * P.cells * P.A + i];
}

//! kernel SETTLE over cells*A
layout(local_size_x = 64) in;
void main() {
  u32 i = gl_GlobalInvocationID.y * 1024u * 64u + gl_GlobalInvocationID.x;
  if (i >= P.cells * P.A) { return; }
  st[i] = st[i] + st[2u * P.cells * P.A + i];
  for (u32 z = 0u; z < P.tags - 1u; z++) {
    st[(9u + 2u * z) * P.cells * P.A + i] = st[(9u + 2u * z) * P.cells * P.A + i] + st[(10u + 2u * z) * P.cells * P.A + i];
  }
}

//! kernel ARRIVED over cells
layout(local_size_x = 64) in;
void main() {
  u32 i = gl_GlobalInvocationID.y * 1024u * 64u + gl_GlobalInvocationID.x;
  u32 c = i;
  if (i >= P.cells) { return; }
  f32 total = 0.0;
  f32 others = 0.0;
  f32 got = 0.0;
  for (u32 a = 0u; a < P.A; a++) {
    total = total + st[nA(a, c)];
  }
  for (u32 z = 0u; z < P.tags - 1u; z++) {
    got = 0.0;
    for (u32 a = 0u; a < P.A; a++) {
      got = got + st[bA(z, a, c)];
    }
    others = others + got;
    cel[(8u + z) * P.cells + c] = got * (P.DEG / f32_of_u(P.A));
  }
  cel[7u * P.cells + c] = maxf(0.0, total - others) * (P.DEG / f32_of_u(P.A));
}
