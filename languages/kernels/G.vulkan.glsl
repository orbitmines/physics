//! tick SNAP SWEEP SIGMA CREATE TOTAL MEET TOTAL POOLSUM CARRY FORCE TAGPOOL@z TAGCARRY@z TAGCOPY@z SNAP SWEEP TOTAL ARRIVED
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

layout(std140, set = 0, binding = 0) uniform ParBlock { uint cells; uint A; uint N; uint K; float DEG; uint holes; uint tick; uint tags; uint z; uint pad0; uint pad1; uint pad2; } P;
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

u32 eA(u32 a, u32 c) {
  return 5u * P.cells * P.A + a * P.cells + c;
}

u32 bA(u32 z, u32 a, u32 c) {
  return (6u + 2u * z) * P.cells * P.A + a * P.cells + c;
}

u32 beA(u32 z, u32 a, u32 c) {
  return (7u + 2u * z) * P.cells * P.A + a * P.cells + c;
}

u32 sA(u32 a, u32 c) {
  return (6u + 2u * (P.tags - 1u)) * P.cells * P.A + a * P.cells + c;
}

i32 hop(u32 c, u32 a) {
  i32 x = i32_of_u(c % P.N);
  i32 y = i32_of_u(c / P.N);
  i32 tx = x + i32_of_f(dir[a].z);
  i32 ty = y + i32_of_f(dir[a].w);
  if (tx < 0 || ty < 0 || tx >= i32_of_u(P.N) || ty >= i32_of_u(P.N)) { return -1; }
  return ty * i32_of_u(P.N) + tx;
}

i32 back(u32 c, u32 a) {
  i32 x = i32_of_u(c % P.N);
  i32 y = i32_of_u(c / P.N);
  i32 tx = x - i32_of_f(dir[a].z);
  i32 ty = y - i32_of_f(dir[a].w);
  if (tx < 0 || ty < 0 || tx >= i32_of_u(P.N) || ty >= i32_of_u(P.N)) { return -1; }
  return ty * i32_of_u(P.N) + tx;
}

u32 opp(u32 a) {
  return (a + P.A / 2u) % P.A;
}

f32 facing(u32 a, u32 b) {
  return (1.0 - (dir[a].x * dir[b].x + dir[a].y * dir[b].y)) / 2.0;
}

f32 toward(u32 a, u32 c) {
  return (f32_of_u(P.A) * cel[0u * P.cells + c] - dir[a].x * cel[7u * P.cells + c] - dir[a].y * cel[8u * P.cells + c]) / f32_of_u(P.A);
}

f32 standing(u32 a, u32 c) {
  f32 m = 0.0;
  if (cel[5u * P.cells + c] > 0.5) { m = st[dA(a, c)]; } else { m = st[wA(a, c)] + st[dA(a, c)]; }
  return maxf(0.0, m);
}

f32 crossing(u32 a, u32 c, u32 other) {
  if (P.tags < 3u) { return 0.0; }
  f32 w = st[wA(a, c)];
  if (w <= 0.0) { return 0.0; }
  f32 f1 = 0.0;
  f32 fall = 0.0;
  f1 = st[bA(0u, a, c)] / w;
  for (u32 z = 0u; z < P.tags - 1u; z++) {
    fall = fall + st[bA(z, a, c)];
  }
  fall = fall / w;
  return f1 * (cel[10u * P.cells + other] - cel[9u * P.cells + other]) + (fall - f1) * cel[9u * P.cells + other];
}

f32 land(u32 a, u32 c, f32 w, f32 rays, f32 space, f32 folds, f32 mixed) {
  f32 dr = w * rays / 4.0;
  st[dA(a, c)] = st[dA(a, c)] + dr;
  if (dr < 0.0) { st[tA(a, c)] = st[tA(a, c)] + dr; }
  f32 ev = w * P.DEG / f32_of_u(P.A) / 4.0;
  st[fA(a, c)] = maxf(0.0, st[fA(a, c)] + ev * folds);
  cel[11u * P.cells + c] = cel[11u * P.cells + c] + absf(ev * space) * mixed;
  return ev * space;
}

f32 standing_of(u32 z, u32 a, u32 c) {
  f32 had = 0.0;
  f32 whole = 0.0;
  if (cel[5u * P.cells + c] > 0.5) { had = st[beA(z, a, c)]; whole = st[eA(a, c)]; } else { had = st[bA(z, a, c)] + st[beA(z, a, c)]; whole = st[wA(a, c)] + st[eA(a, c)]; }
  if (had <= 0.0 || whole <= 0.0) { return 0.0; }
  f32 f = 0.0;
  f = (whole + st[tA(a, c)]) / whole;
  if (f < 0.0) { f = 0.0; }
  return had * f;
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
  st[2u * P.cells * P.A + i] = 0.0;
  st[4u * P.cells * P.A + i] = 0.0;
  st[5u * P.cells * P.A + i] = 0.0;
  for (u32 z = 0u; z < P.tags - 1u; z++) {
    st[(7u + 2u * z) * P.cells * P.A + i] = 0.0;
  }
}

//! kernel SWEEP over cells
layout(local_size_x = 64) in;
void main() {
  u32 i = gl_GlobalInvocationID.y * 1024u * 64u + gl_GlobalInvocationID.x;
  u32 c = i;
  if (i >= P.cells) { return; }
  f32 s = 0.0;
  f32 mx = 0.0;
  f32 my = 0.0;
  f32 t1 = 0.0;
  f32 ta = 0.0;
  for (u32 a = 0u; a < P.A; a++) {
    f32 v = st[wA(a, c)];
    s = s + v;
    mx = mx + v * dir[a].x;
    my = my + v * dir[a].y;
    for (u32 z = 0u; z < P.tags - 1u; z++) {
      f32 bz = st[bA(z, a, c)];
      ta = ta + bz;
      if (z == 0u) { t1 = t1 + bz; }
    }
  }
  cel[0u * P.cells + c] = s / f32_of_u(P.A);
  cel[7u * P.cells + c] = mx;
  cel[8u * P.cells + c] = my;
  if (s > 0.0) { cel[9u * P.cells + c] = t1 / s; cel[10u * P.cells + c] = ta / s; } else { cel[9u * P.cells + c] = 0.0; cel[10u * P.cells + c] = 0.0; }
}

//! kernel SIGMA over holes*A
layout(local_size_x = 64) in;
void main() {
  u32 i = gl_GlobalInvocationID.y * 1024u * 64u + gl_GlobalInvocationID.x;
  if (i >= P.holes * P.A) { return; }
  u32 h = i / P.A;
  u32 a = i % P.A;
  f32 hx = dir[P.A + h].x;
  f32 hy = dir[P.A + h].y;
  f32 hz = dir[P.A + h].z;
  i32 cx = i32_of_f(rnd(hx + f32_of_u(P.K) * dir[a].x));
  i32 cy = i32_of_f(rnd(hy + f32_of_u(P.K) * dir[a].y));
  if (cx < 0 || cy < 0 || cx >= i32_of_u(P.N) || cy >= i32_of_u(P.N)) { return; }
  u32 c = u32_of_i(cy) * P.N + u32_of_i(cx);
  f32 along = dir[P.A + 64u + h].x;
  if (along >= 0.0 && i32_of_f(along) == i32_of_u(a)) { return; }
  st[dA(a, c)] = st[dA(a, c)] + hz;
  st[eA(a, c)] = st[eA(a, c)] + hz;
  i32 tag = i32_of_f(dir[P.A + h].w);
  if (tag > 0 && tag < i32_of_u(P.tags)) { st[beA(u32_of_i(tag - 1), a, c)] = st[beA(u32_of_i(tag - 1), a, c)] + hz; }
  st[fA(a, c)] = maxf(0.0, st[fA(a, c)] - hz / f32_of_u(P.A));
}

//! kernel CREATE over cells
layout(local_size_x = 64) in;
void main() {
  u32 i = gl_GlobalInvocationID.y * 1024u * 64u + gl_GlobalInvocationID.x;
  u32 c = i;
  if (i >= P.cells) { return; }
  cel[3u * P.cells + c] = 0.0;
  cel[11u * P.cells + c] = 0.0;
  if (cel[5u * P.cells + c] > 0.5) { return; }
  f32 rho = cel[0u * P.cells + c];
  f32 nf = cel[1u * P.cells + c];
  f32 F = 1.0;
  f32 omega = 1.0;
  f32 beta = 0.0;
  f32 DEG = P.DEG;
  f32 dSpace = 0.0;
  f32 fires0 = clampf((1.0 - pow(rho, DEG)), 0.0, 1.0) * 1.0;
  if (fires0 > 0.0) {
    for (u32 a = 0u; a < P.A; a++) {
      st[dA(a, c)] = st[dA(a, c)] + fires0 * (DEG) / DEG;
    }
    dSpace = dSpace + fires0 * (1.0);
    f32 df0 = fires0 * ((-DEG)) / f32_of_u(P.A);
    for (u32 a = 0u; a < P.A; a++) {
      st[fA(a, c)] = maxf(0.0, st[fA(a, c)] + df0);
    }
  }
  f32 fires1 = clampf((1.0 - omega), 0.0, 1.0) * rho;
  if (fires1 > 0.0) {
    for (u32 a = 0u; a < P.A; a++) {
      st[dA(a, c)] = st[dA(a, c)] + fires1 * (0.0) / DEG;
    }
    dSpace = dSpace + fires1 * (1.0);
    f32 df1 = fires1 * (0.0) / f32_of_u(P.A);
    for (u32 a = 0u; a < P.A; a++) {
      st[fA(a, c)] = maxf(0.0, st[fA(a, c)] + df1);
    }
  }
  cel[2u * P.cells + c] = cel[2u * P.cells + c] + dSpace;
}

//! kernel TOTAL over cells
layout(local_size_x = 64) in;
void main() {
  u32 i = gl_GlobalInvocationID.y * 1024u * 64u + gl_GlobalInvocationID.x;
  u32 c = i;
  if (i >= P.cells) { return; }
  f32 nf = 0.0;
  for (u32 b = 0u; b < P.A; b++) {
    nf = nf + maxf(0.0, st[fA(b, c)]);
  }
  cel[1u * P.cells + c] = nf;
  cel[4u * P.cells + c] = 1.0 / (1.0 + nf);
}

//! kernel MEET over cells
layout(local_size_x = 64) in;
void main() {
  u32 i = gl_GlobalInvocationID.y * 1024u * 64u + gl_GlobalInvocationID.x;
  u32 c = i;
  if (i >= P.cells) { return; }
  bool blocked = cel[5u * P.cells + c] > 0.5;
  f32 rho = cel[0u * P.cells + c];
  f32 nf = cel[1u * P.cells + c];
  f32 dSpace = 0.0;
  f32 gone = 0.0;
  for (u32 a = 0u; a < P.A; a++) {
    u32 o = opp(a);
    i32 to = hop(c, a);
    if (to >= 0 && !blocked) {
      f32 w = st[wA(a, c)] * toward(a, u32_of_i(to)) * meet0_gate(rho, nf);
      if (w > 0.0) {
        f32 ds = land(a, c, w, meet0_rays(rho, nf), meet0_space(rho, nf), meet0_folds(rho, nf), crossing(a, c, u32_of_i(to)));
        dSpace = dSpace + ds;
        gone = gone + absf(ds);
      }
    }
    i32 src = back(c, o);
    if (src >= 0) {
      u32 sc = u32_of_i(src);
      if (cel[5u * P.cells + sc] <= 0.5) {
        f32 r2 = cel[0u * P.cells + sc];
        f32 f2 = cel[1u * P.cells + sc];
        f32 w2 = st[wA(o, sc)] * toward(o, c) * meet0_gate(r2, f2);
        if (w2 > 0.0) {
          f32 ds2 = land(a, c, w2, meet0_rays(r2, f2), meet0_space(r2, f2), meet0_folds(r2, f2), crossing(o, sc, c));
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
layout(local_size_x = 64) in;
void main() {
  u32 i = gl_GlobalInvocationID.y * 1024u * 64u + gl_GlobalInvocationID.x;
  u32 c = i;
  if (i >= P.cells) { return; }
  f32 keeps = cel[4u * P.cells + c];
  f32 p = 0.0;
  for (u32 a = 0u; a < P.A; a++) {
    f32 m = standing(a, c);
    if (m > 0.00000000000001) { p = p + m * (1.0 - keeps); }
  }
  cel[6u * P.cells + c] = p;
}

//! kernel CARRY over cells*A
layout(local_size_x = 64) in;
void main() {
  u32 i = gl_GlobalInvocationID.y * 1024u * 64u + gl_GlobalInvocationID.x;
  if (i >= P.cells * P.A) { return; }
  u32 a = i / P.cells;
  u32 c = i % P.cells;
  f32 got = 0.0;
  i32 src = back(c, a);
  if (src >= 0) {
    u32 sc = u32_of_i(src);
    f32 m = standing(a, sc);
    if (m > 0.00000000000001) { got = got + m * cel[4u * P.cells + sc]; }
    f32 p = cel[6u * P.cells + sc];
    if (p > 0.0) {
      f32 nf = cel[1u * P.cells + sc];
      f32 part = 1.0 / f32_of_u(P.A);
      if (nf > 0.0) { part = st[fA(a, sc)] / nf; }
      got = got + p * part;
    }
  }
  st[nA(a, c)] = got;
}

//! kernel FORCE over holes
layout(local_size_x = 64) in;
void main() {
  u32 i = gl_GlobalInvocationID.y * 1024u * 64u + gl_GlobalInvocationID.x;
  if (i >= P.holes) { return; }
  u32 h = i;
  i32 cx = i32_of_f(dir[P.A + h].x);
  i32 cy = i32_of_f(dir[P.A + h].y);
  cel[(11u + 2u * P.tags) * P.cells + 2u * h] = 0.0;
  cel[(11u + 2u * P.tags) * P.cells + 2u * h + 1u] = 0.0;
  if (cx < 0 || cy < 0 || cx >= i32_of_u(P.N) || cy >= i32_of_u(P.N)) { return; }
  u32 c = u32_of_i(cy) * P.N + u32_of_i(cx);
  f32 m = dir[P.A + 64u + h].z;
  f32 fx = 0.0;
  f32 fy = 0.0;
  for (u32 a = 0u; a < P.A; a++) {
    f32 v = st[wA(a, c)];
    if (v > m) { v = m; }
    fx = fx + v * dir[a].x;
    fy = fy + v * dir[a].y;
  }
  cel[(11u + 2u * P.tags) * P.cells + 2u * h] = fx / f32_of_u(P.A);
  cel[(11u + 2u * P.tags) * P.cells + 2u * h + 1u] = fy / f32_of_u(P.A);
}

//! kernel TAGPOOL over cells
layout(local_size_x = 64) in;
void main() {
  u32 i = gl_GlobalInvocationID.y * 1024u * 64u + gl_GlobalInvocationID.x;
  u32 c = i;
  if (i >= P.cells) { return; }
  f32 keeps = cel[4u * P.cells + c];
  f32 p = 0.0;
  for (u32 a = 0u; a < P.A; a++) {
    f32 m = standing_of(P.z, a, c);
    if (m > 0.00000000000001) { p = p + m * (1.0 - keeps); }
  }
  cel[(12u + P.z) * P.cells + c] = p;
}

//! kernel TAGCARRY over cells*A
layout(local_size_x = 64) in;
void main() {
  u32 i = gl_GlobalInvocationID.y * 1024u * 64u + gl_GlobalInvocationID.x;
  if (i >= P.cells * P.A) { return; }
  u32 a = i / P.cells;
  u32 c = i % P.cells;
  f32 got = 0.0;
  i32 src = back(c, a);
  if (src >= 0) {
    u32 sc = u32_of_i(src);
    f32 m = standing_of(P.z, a, sc);
    if (m > 0.00000000000001) { got = got + m * cel[4u * P.cells + sc]; }
    f32 p = cel[(12u + P.z) * P.cells + sc];
    if (p > 0.0) {
      f32 nf = cel[1u * P.cells + sc];
      f32 part = 1.0 / f32_of_u(P.A);
      if (nf > 0.0) { part = st[fA(a, sc)] / nf; }
      got = got + p * part;
    }
  }
  st[sA(a, c)] = got;
}

//! kernel TAGCOPY over cells*A
layout(local_size_x = 64) in;
void main() {
  u32 i = gl_GlobalInvocationID.y * 1024u * 64u + gl_GlobalInvocationID.x;
  if (i >= P.cells * P.A) { return; }
  st[(6u + 2u * P.z) * P.cells * P.A + i] = st[(6u + 2u * (P.tags - 1u)) * P.cells * P.A + i];
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
    cel[(12u + P.tags + z) * P.cells + c] = got;
  }
  cel[(11u + P.tags) * P.cells + c] = maxf(0.0, total - others);
}
