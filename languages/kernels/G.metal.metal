//! tick SNAP SWEEP SIGMA CREATE TOTAL MEET TOTAL POOLSUM CARRY FORCE TAGPOOL@z TAGCARRY@z TAGCOPY@z SNAP SWEEP TOTAL ARRIVED

#include <metal_stdlib>
using namespace metal;
#define f32 float
#define u32 uint
#define i32 int
#define f32_of_u(x) ((float)(x))
#define i32_of_u(x) ((int)(x))
#define i32_of_f(x) ((int)(x))
#define u32_of_i(x) ((uint)(x))
#define absf(x) fabs(x)
#define maxf(a, b) fmax(a, b)
#define clampf(x, lo, hi) clamp(x, lo, hi)
#define rnd(x) round(x)

struct Par { u32 cells; u32 A; u32 N; u32 K; f32 DEG; u32 holes; u32 tick; u32 tags; u32 z; u32 pad0; u32 pad1; u32 pad2; };

u32 nA(device f32* st, device f32* cel, const device float4* dir, constant Par& P, u32 a, u32 c) {
  return a * P.cells + c;
}

u32 wA(device f32* st, device f32* cel, const device float4* dir, constant Par& P, u32 a, u32 c) {
  return P.cells * P.A + a * P.cells + c;
}

u32 dA(device f32* st, device f32* cel, const device float4* dir, constant Par& P, u32 a, u32 c) {
  return 2u * P.cells * P.A + a * P.cells + c;
}

u32 fA(device f32* st, device f32* cel, const device float4* dir, constant Par& P, u32 a, u32 c) {
  return 3u * P.cells * P.A + a * P.cells + c;
}

u32 tA(device f32* st, device f32* cel, const device float4* dir, constant Par& P, u32 a, u32 c) {
  return 4u * P.cells * P.A + a * P.cells + c;
}

u32 eA(device f32* st, device f32* cel, const device float4* dir, constant Par& P, u32 a, u32 c) {
  return 5u * P.cells * P.A + a * P.cells + c;
}

u32 bA(device f32* st, device f32* cel, const device float4* dir, constant Par& P, u32 z, u32 a, u32 c) {
  return (6u + 2u * z) * P.cells * P.A + a * P.cells + c;
}

u32 beA(device f32* st, device f32* cel, const device float4* dir, constant Par& P, u32 z, u32 a, u32 c) {
  return (7u + 2u * z) * P.cells * P.A + a * P.cells + c;
}

u32 sA(device f32* st, device f32* cel, const device float4* dir, constant Par& P, u32 a, u32 c) {
  return (6u + 2u * (P.tags - 1u)) * P.cells * P.A + a * P.cells + c;
}

i32 hop(device f32* st, device f32* cel, const device float4* dir, constant Par& P, u32 c, u32 a) {
  i32 x = i32_of_u(c % P.N);
  i32 y = i32_of_u(c / P.N);
  i32 tx = x + i32_of_f(dir[a].z);
  i32 ty = y + i32_of_f(dir[a].w);
  if (tx < 0 || ty < 0 || tx >= i32_of_u(P.N) || ty >= i32_of_u(P.N)) { return -1; }
  return ty * i32_of_u(P.N) + tx;
}

i32 back(device f32* st, device f32* cel, const device float4* dir, constant Par& P, u32 c, u32 a) {
  i32 x = i32_of_u(c % P.N);
  i32 y = i32_of_u(c / P.N);
  i32 tx = x - i32_of_f(dir[a].z);
  i32 ty = y - i32_of_f(dir[a].w);
  if (tx < 0 || ty < 0 || tx >= i32_of_u(P.N) || ty >= i32_of_u(P.N)) { return -1; }
  return ty * i32_of_u(P.N) + tx;
}

u32 opp(device f32* st, device f32* cel, const device float4* dir, constant Par& P, u32 a) {
  return (a + P.A / 2u) % P.A;
}

f32 facing(device f32* st, device f32* cel, const device float4* dir, constant Par& P, u32 a, u32 b) {
  return (1.0 - (dir[a].x * dir[b].x + dir[a].y * dir[b].y)) / 2.0;
}

f32 toward(device f32* st, device f32* cel, const device float4* dir, constant Par& P, u32 a, u32 c) {
  return (f32_of_u(P.A) * cel[0u * P.cells + c] - dir[a].x * cel[7u * P.cells + c] - dir[a].y * cel[8u * P.cells + c]) / f32_of_u(P.A);
}

f32 standing(device f32* st, device f32* cel, const device float4* dir, constant Par& P, u32 a, u32 c) {
  f32 m = 0.0;
  if (cel[5u * P.cells + c] > 0.5) { m = st[dA(st, cel, dir, P, a, c)]; } else { m = st[wA(st, cel, dir, P, a, c)] + st[dA(st, cel, dir, P, a, c)]; }
  return maxf(0.0, m);
}

f32 crossing(device f32* st, device f32* cel, const device float4* dir, constant Par& P, u32 a, u32 c, u32 other) {
  if (P.tags < 3u) { return 0.0; }
  f32 w = st[wA(st, cel, dir, P, a, c)];
  if (w <= 0.0) { return 0.0; }
  f32 f1 = 0.0;
  f32 fall = 0.0;
  f1 = st[bA(st, cel, dir, P, 0u, a, c)] / w;
  for (u32 z = 0u; z < P.tags - 1u; z++) {
    fall = fall + st[bA(st, cel, dir, P, z, a, c)];
  }
  fall = fall / w;
  return f1 * (cel[10u * P.cells + other] - cel[9u * P.cells + other]) + (fall - f1) * cel[9u * P.cells + other];
}

f32 land(device f32* st, device f32* cel, const device float4* dir, constant Par& P, u32 a, u32 c, f32 w, f32 rays, f32 space, f32 folds, f32 mixed) {
  f32 dr = w * rays / 4.0;
  st[dA(st, cel, dir, P, a, c)] = st[dA(st, cel, dir, P, a, c)] + dr;
  if (dr < 0.0) { st[tA(st, cel, dir, P, a, c)] = st[tA(st, cel, dir, P, a, c)] + dr; }
  f32 ev = w * P.DEG / f32_of_u(P.A) / 4.0;
  st[fA(st, cel, dir, P, a, c)] = maxf(0.0, st[fA(st, cel, dir, P, a, c)] + ev * folds);
  cel[11u * P.cells + c] = cel[11u * P.cells + c] + absf(ev * space) * mixed;
  return ev * space;
}

f32 standing_of(device f32* st, device f32* cel, const device float4* dir, constant Par& P, u32 z, u32 a, u32 c) {
  f32 had = 0.0;
  f32 whole = 0.0;
  if (cel[5u * P.cells + c] > 0.5) { had = st[beA(st, cel, dir, P, z, a, c)]; whole = st[eA(st, cel, dir, P, a, c)]; } else { had = st[bA(st, cel, dir, P, z, a, c)] + st[beA(st, cel, dir, P, z, a, c)]; whole = st[wA(st, cel, dir, P, a, c)] + st[eA(st, cel, dir, P, a, c)]; }
  if (had <= 0.0 || whole <= 0.0) { return 0.0; }
  f32 f = 0.0;
  f = (whole + st[tA(st, cel, dir, P, a, c)]) / whole;
  if (f < 0.0) { f = 0.0; }
  return had * f;
}

f32 meet0_gate(device f32* st, device f32* cel, const device float4* dir, constant Par& P, f32 rho, f32 nf) {
  f32 F = 1.0;
  f32 omega = 1.0;
  f32 beta = 0.0;
  f32 DEG = P.DEG;
  return clampf(F, 0.0, 1.0);
}

f32 meet0_rays(device f32* st, device f32* cel, const device float4* dir, constant Par& P, f32 rho, f32 nf) {
  f32 F = 1.0;
  f32 omega = 1.0;
  f32 beta = 0.0;
  f32 DEG = P.DEG;
  return (-2.0);
}

f32 meet0_space(device f32* st, device f32* cel, const device float4* dir, constant Par& P, f32 rho, f32 nf) {
  f32 F = 1.0;
  f32 omega = 1.0;
  f32 beta = 0.0;
  f32 DEG = P.DEG;
  return (-1.0);
}

f32 meet0_folds(device f32* st, device f32* cel, const device float4* dir, constant Par& P, f32 rho, f32 nf) {
  f32 F = 1.0;
  f32 omega = 1.0;
  f32 beta = 0.0;
  f32 DEG = P.DEG;
  return 1.0;
}

//! kernel SNAP over cells*A
kernel void SNAP(constant Par& P [[buffer(0)]], device f32* st [[buffer(1)]], device f32* cel [[buffer(2)]], const device float4* dir [[buffer(3)]], u32 i [[thread_position_in_grid]]) {
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
kernel void SWEEP(constant Par& P [[buffer(0)]], device f32* st [[buffer(1)]], device f32* cel [[buffer(2)]], const device float4* dir [[buffer(3)]], u32 i [[thread_position_in_grid]]) {
  u32 c = i;
  if (i >= P.cells) { return; }
  f32 s = 0.0;
  f32 mx = 0.0;
  f32 my = 0.0;
  f32 t1 = 0.0;
  f32 ta = 0.0;
  for (u32 a = 0u; a < P.A; a++) {
    f32 v = st[wA(st, cel, dir, P, a, c)];
    s = s + v;
    mx = mx + v * dir[a].x;
    my = my + v * dir[a].y;
    for (u32 z = 0u; z < P.tags - 1u; z++) {
      f32 bz = st[bA(st, cel, dir, P, z, a, c)];
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
kernel void SIGMA(constant Par& P [[buffer(0)]], device f32* st [[buffer(1)]], device f32* cel [[buffer(2)]], const device float4* dir [[buffer(3)]], u32 i [[thread_position_in_grid]]) {
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
  st[dA(st, cel, dir, P, a, c)] = st[dA(st, cel, dir, P, a, c)] + hz;
  st[eA(st, cel, dir, P, a, c)] = st[eA(st, cel, dir, P, a, c)] + hz;
  i32 tag = i32_of_f(dir[P.A + h].w);
  if (tag > 0 && tag < i32_of_u(P.tags)) { st[beA(st, cel, dir, P, u32_of_i(tag - 1), a, c)] = st[beA(st, cel, dir, P, u32_of_i(tag - 1), a, c)] + hz; }
  st[fA(st, cel, dir, P, a, c)] = maxf(0.0, st[fA(st, cel, dir, P, a, c)] - hz / f32_of_u(P.A));
}

//! kernel CREATE over cells
kernel void CREATE(constant Par& P [[buffer(0)]], device f32* st [[buffer(1)]], device f32* cel [[buffer(2)]], const device float4* dir [[buffer(3)]], u32 i [[thread_position_in_grid]]) {
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
      st[dA(st, cel, dir, P, a, c)] = st[dA(st, cel, dir, P, a, c)] + fires0 * (DEG) / DEG;
    }
    dSpace = dSpace + fires0 * (1.0);
    f32 df0 = fires0 * ((-DEG)) / f32_of_u(P.A);
    for (u32 a = 0u; a < P.A; a++) {
      st[fA(st, cel, dir, P, a, c)] = maxf(0.0, st[fA(st, cel, dir, P, a, c)] + df0);
    }
  }
  f32 fires1 = clampf((1.0 - omega), 0.0, 1.0) * rho;
  if (fires1 > 0.0) {
    for (u32 a = 0u; a < P.A; a++) {
      st[dA(st, cel, dir, P, a, c)] = st[dA(st, cel, dir, P, a, c)] + fires1 * (0.0) / DEG;
    }
    dSpace = dSpace + fires1 * (1.0);
    f32 df1 = fires1 * (0.0) / f32_of_u(P.A);
    for (u32 a = 0u; a < P.A; a++) {
      st[fA(st, cel, dir, P, a, c)] = maxf(0.0, st[fA(st, cel, dir, P, a, c)] + df1);
    }
  }
  cel[2u * P.cells + c] = cel[2u * P.cells + c] + dSpace;
}

//! kernel TOTAL over cells
kernel void TOTAL(constant Par& P [[buffer(0)]], device f32* st [[buffer(1)]], device f32* cel [[buffer(2)]], const device float4* dir [[buffer(3)]], u32 i [[thread_position_in_grid]]) {
  u32 c = i;
  if (i >= P.cells) { return; }
  f32 nf = 0.0;
  for (u32 b = 0u; b < P.A; b++) {
    nf = nf + maxf(0.0, st[fA(st, cel, dir, P, b, c)]);
  }
  cel[1u * P.cells + c] = nf;
  cel[4u * P.cells + c] = 1.0 / (1.0 + nf);
}

//! kernel MEET over cells
kernel void MEET(constant Par& P [[buffer(0)]], device f32* st [[buffer(1)]], device f32* cel [[buffer(2)]], const device float4* dir [[buffer(3)]], u32 i [[thread_position_in_grid]]) {
  u32 c = i;
  if (i >= P.cells) { return; }
  bool blocked = cel[5u * P.cells + c] > 0.5;
  f32 rho = cel[0u * P.cells + c];
  f32 nf = cel[1u * P.cells + c];
  f32 dSpace = 0.0;
  f32 gone = 0.0;
  for (u32 a = 0u; a < P.A; a++) {
    u32 o = opp(st, cel, dir, P, a);
    i32 to = hop(st, cel, dir, P, c, a);
    if (to >= 0 && !blocked) {
      f32 w = st[wA(st, cel, dir, P, a, c)] * toward(st, cel, dir, P, a, u32_of_i(to)) * meet0_gate(st, cel, dir, P, rho, nf);
      if (w > 0.0) {
        f32 ds = land(st, cel, dir, P, a, c, w, meet0_rays(st, cel, dir, P, rho, nf), meet0_space(st, cel, dir, P, rho, nf), meet0_folds(st, cel, dir, P, rho, nf), crossing(st, cel, dir, P, a, c, u32_of_i(to)));
        dSpace = dSpace + ds;
        gone = gone + absf(ds);
      }
    }
    i32 src = back(st, cel, dir, P, c, o);
    if (src >= 0) {
      u32 sc = u32_of_i(src);
      if (cel[5u * P.cells + sc] <= 0.5) {
        f32 r2 = cel[0u * P.cells + sc];
        f32 f2 = cel[1u * P.cells + sc];
        f32 w2 = st[wA(st, cel, dir, P, o, sc)] * toward(st, cel, dir, P, o, c) * meet0_gate(st, cel, dir, P, r2, f2);
        if (w2 > 0.0) {
          f32 ds2 = land(st, cel, dir, P, a, c, w2, meet0_rays(st, cel, dir, P, r2, f2), meet0_space(st, cel, dir, P, r2, f2), meet0_folds(st, cel, dir, P, r2, f2), crossing(st, cel, dir, P, o, sc, c));
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
kernel void POOLSUM(constant Par& P [[buffer(0)]], device f32* st [[buffer(1)]], device f32* cel [[buffer(2)]], const device float4* dir [[buffer(3)]], u32 i [[thread_position_in_grid]]) {
  u32 c = i;
  if (i >= P.cells) { return; }
  f32 keeps = cel[4u * P.cells + c];
  f32 p = 0.0;
  for (u32 a = 0u; a < P.A; a++) {
    f32 m = standing(st, cel, dir, P, a, c);
    if (m > 0.00000000000001) { p = p + m * (1.0 - keeps); }
  }
  cel[6u * P.cells + c] = p;
}

//! kernel CARRY over cells*A
kernel void CARRY(constant Par& P [[buffer(0)]], device f32* st [[buffer(1)]], device f32* cel [[buffer(2)]], const device float4* dir [[buffer(3)]], u32 i [[thread_position_in_grid]]) {
  if (i >= P.cells * P.A) { return; }
  u32 a = i / P.cells;
  u32 c = i % P.cells;
  f32 got = 0.0;
  i32 src = back(st, cel, dir, P, c, a);
  if (src >= 0) {
    u32 sc = u32_of_i(src);
    f32 m = standing(st, cel, dir, P, a, sc);
    if (m > 0.00000000000001) { got = got + m * cel[4u * P.cells + sc]; }
    f32 p = cel[6u * P.cells + sc];
    if (p > 0.0) {
      f32 nf = cel[1u * P.cells + sc];
      f32 part = 1.0 / f32_of_u(P.A);
      if (nf > 0.0) { part = st[fA(st, cel, dir, P, a, sc)] / nf; }
      got = got + p * part;
    }
  }
  st[nA(st, cel, dir, P, a, c)] = got;
}

//! kernel FORCE over holes
kernel void FORCE(constant Par& P [[buffer(0)]], device f32* st [[buffer(1)]], device f32* cel [[buffer(2)]], const device float4* dir [[buffer(3)]], u32 i [[thread_position_in_grid]]) {
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
    f32 v = st[wA(st, cel, dir, P, a, c)];
    if (v > m) { v = m; }
    fx = fx + v * dir[a].x;
    fy = fy + v * dir[a].y;
  }
  cel[(11u + 2u * P.tags) * P.cells + 2u * h] = fx / f32_of_u(P.A);
  cel[(11u + 2u * P.tags) * P.cells + 2u * h + 1u] = fy / f32_of_u(P.A);
}

//! kernel TAGPOOL over cells
kernel void TAGPOOL(constant Par& P [[buffer(0)]], device f32* st [[buffer(1)]], device f32* cel [[buffer(2)]], const device float4* dir [[buffer(3)]], u32 i [[thread_position_in_grid]]) {
  u32 c = i;
  if (i >= P.cells) { return; }
  f32 keeps = cel[4u * P.cells + c];
  f32 p = 0.0;
  for (u32 a = 0u; a < P.A; a++) {
    f32 m = standing_of(st, cel, dir, P, P.z, a, c);
    if (m > 0.00000000000001) { p = p + m * (1.0 - keeps); }
  }
  cel[(12u + P.z) * P.cells + c] = p;
}

//! kernel TAGCARRY over cells*A
kernel void TAGCARRY(constant Par& P [[buffer(0)]], device f32* st [[buffer(1)]], device f32* cel [[buffer(2)]], const device float4* dir [[buffer(3)]], u32 i [[thread_position_in_grid]]) {
  if (i >= P.cells * P.A) { return; }
  u32 a = i / P.cells;
  u32 c = i % P.cells;
  f32 got = 0.0;
  i32 src = back(st, cel, dir, P, c, a);
  if (src >= 0) {
    u32 sc = u32_of_i(src);
    f32 m = standing_of(st, cel, dir, P, P.z, a, sc);
    if (m > 0.00000000000001) { got = got + m * cel[4u * P.cells + sc]; }
    f32 p = cel[(12u + P.z) * P.cells + sc];
    if (p > 0.0) {
      f32 nf = cel[1u * P.cells + sc];
      f32 part = 1.0 / f32_of_u(P.A);
      if (nf > 0.0) { part = st[fA(st, cel, dir, P, a, sc)] / nf; }
      got = got + p * part;
    }
  }
  st[sA(st, cel, dir, P, a, c)] = got;
}

//! kernel TAGCOPY over cells*A
kernel void TAGCOPY(constant Par& P [[buffer(0)]], device f32* st [[buffer(1)]], device f32* cel [[buffer(2)]], const device float4* dir [[buffer(3)]], u32 i [[thread_position_in_grid]]) {
  if (i >= P.cells * P.A) { return; }
  st[(6u + 2u * P.z) * P.cells * P.A + i] = st[(6u + 2u * (P.tags - 1u)) * P.cells * P.A + i];
}

//! kernel ARRIVED over cells
kernel void ARRIVED(constant Par& P [[buffer(0)]], device f32* st [[buffer(1)]], device f32* cel [[buffer(2)]], const device float4* dir [[buffer(3)]], u32 i [[thread_position_in_grid]]) {
  u32 c = i;
  if (i >= P.cells) { return; }
  f32 total = 0.0;
  f32 others = 0.0;
  f32 got = 0.0;
  for (u32 a = 0u; a < P.A; a++) {
    total = total + st[nA(st, cel, dir, P, a, c)];
  }
  for (u32 z = 0u; z < P.tags - 1u; z++) {
    got = 0.0;
    for (u32 a = 0u; a < P.A; a++) {
      got = got + st[bA(st, cel, dir, P, z, a, c)];
    }
    others = others + got;
    cel[(12u + P.tags + z) * P.cells + c] = got;
  }
  cel[(11u + P.tags) * P.cells + c] = maxf(0.0, total - others);
}
