//! tick SNAP SWEEP SIGMA CREATE TOTAL MEET TOTAL POOLSUM CARRY SNAP SWEEP TOTAL

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

struct Par { u32 cells; u32 A; u32 N; u32 K; f32 DEG; u32 holes; u32 tick; u32 pad; };

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
  f32 meet = 0.0;
  for (u32 b = 0u; b < P.A; b++) {
    meet = meet + st[wA(st, cel, dir, P, b, c)] * facing(st, cel, dir, P, a, b);
  }
  return meet * 2.0 / f32_of_u(P.A);
}

f32 standing(device f32* st, device f32* cel, const device float4* dir, constant Par& P, u32 a, u32 c) {
  f32 m = 0.0;
  if (cel[5u * P.cells + c] > 0.5) { m = st[dA(st, cel, dir, P, a, c)]; } else { m = st[wA(st, cel, dir, P, a, c)] + st[dA(st, cel, dir, P, a, c)]; }
  return maxf(0.0, m);
}

f32 land(device f32* st, device f32* cel, const device float4* dir, constant Par& P, u32 a, u32 c, f32 w, f32 rays, f32 space, f32 folds) {
  st[dA(st, cel, dir, P, a, c)] = st[dA(st, cel, dir, P, a, c)] + w * rays / 4.0;
  f32 ev = w * P.DEG / f32_of_u(P.A) / 4.0;
  st[fA(st, cel, dir, P, a, c)] = maxf(0.0, st[fA(st, cel, dir, P, a, c)] + ev * folds);
  return ev * space;
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
}

//! kernel SWEEP over cells
kernel void SWEEP(constant Par& P [[buffer(0)]], device f32* st [[buffer(1)]], device f32* cel [[buffer(2)]], const device float4* dir [[buffer(3)]], u32 i [[thread_position_in_grid]]) {
  u32 c = i;
  if (i >= P.cells) { return; }
  f32 s = 0.0;
  for (u32 a = 0u; a < P.A; a++) {
    s = s + st[wA(st, cel, dir, P, a, c)];
  }
  cel[0u * P.cells + c] = s / f32_of_u(P.A);
  cel[3u * P.cells + c] = 0.0;
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
  st[dA(st, cel, dir, P, a, c)] = st[dA(st, cel, dir, P, a, c)] + hz;
  st[fA(st, cel, dir, P, a, c)] = maxf(0.0, st[fA(st, cel, dir, P, a, c)] - hz / f32_of_u(P.A));
}

//! kernel CREATE over cells
kernel void CREATE(constant Par& P [[buffer(0)]], device f32* st [[buffer(1)]], device f32* cel [[buffer(2)]], const device float4* dir [[buffer(3)]], u32 i [[thread_position_in_grid]]) {
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
        f32 ds = land(st, cel, dir, P, a, c, w, meet0_rays(st, cel, dir, P, rho, nf), meet0_space(st, cel, dir, P, rho, nf), meet0_folds(st, cel, dir, P, rho, nf));
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
          f32 ds2 = land(st, cel, dir, P, a, c, w2, meet0_rays(st, cel, dir, P, r2, f2), meet0_space(st, cel, dir, P, r2, f2), meet0_folds(st, cel, dir, P, r2, f2));
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
