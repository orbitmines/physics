//! tick SNAP CLEAR SWEEP TOTAL MEET0 TAKE CREATE1 CREATE2 LOCATE CARRY FUNNEL TAGCARRY@z TAGFUNNEL@z GATHER | APPLY SETTLE SNAP SWEEP ARRIVED

#define f32 float
#define u32 unsigned int
#define i32 int
#define f32_of_u(x) ((float)(x))
#define i32_of_u(x) ((int)(x))
#define i32_of_f(x) ((int)(x))
#define u32_of_i(x) ((unsigned int)(x))
#define absf(x) fabsf(x)
#define maxf(a, b) fmaxf(a, b)
#define clampf(x, lo, hi) fminf(fmaxf(x, lo), hi)
#define rnd(x) roundf(x)

struct Par { u32 cells; u32 A; u32 N; u32 K; f32 DEG; u32 holes; u32 tick; u32 tags; u32 z; u32 entries; u32 outs; u32 bod; u32 beam; u32 whom; u32 track; u32 rungs; u32 span; u32 pad2; };

__device__ u32 nA(f32* st, f32* cel, const float4* dir, const Par P, u32 a, u32 c) {
  return a * P.cells + c;
}

__device__ u32 wA(f32* st, f32* cel, const float4* dir, const Par P, u32 a, u32 c) {
  return P.cells * P.A + a * P.cells + c;
}

__device__ u32 dA(f32* st, f32* cel, const float4* dir, const Par P, u32 a, u32 c) {
  return 2u * P.cells * P.A + a * P.cells + c;
}

__device__ u32 fA(f32* st, f32* cel, const float4* dir, const Par P, u32 a, u32 c) {
  return 3u * P.cells * P.A + a * P.cells + c;
}

__device__ u32 tA(f32* st, f32* cel, const float4* dir, const Par P, u32 a, u32 c) {
  return 4u * P.cells * P.A + a * P.cells + c;
}

__device__ u32 aA(f32* st, f32* cel, const float4* dir, const Par P, u32 a, u32 c) {
  return 5u * P.cells * P.A + a * P.cells + c;
}

__device__ u32 eA(f32* st, f32* cel, const float4* dir, const Par P, u32 a, u32 c) {
  return 6u * P.cells * P.A + a * P.cells + c;
}

__device__ u32 kA(f32* st, f32* cel, const float4* dir, const Par P, u32 a, u32 c) {
  return 7u * P.cells * P.A + a * P.cells + c;
}

__device__ u32 gA(f32* st, f32* cel, const float4* dir, const Par P, u32 a, u32 c) {
  return 8u * P.cells * P.A + a * P.cells + c;
}

__device__ u32 bA(f32* st, f32* cel, const float4* dir, const Par P, u32 z, u32 a, u32 c) {
  return (9u + 2u * z) * P.cells * P.A + a * P.cells + c;
}

__device__ u32 beA(f32* st, f32* cel, const float4* dir, const Par P, u32 z, u32 a, u32 c) {
  return (10u + 2u * z) * P.cells * P.A + a * P.cells + c;
}

__device__ u32 swA(f32* st, f32* cel, const float4* dir, const Par P, u32 a, u32 c) {
  return (9u + 2u * (P.tags - 1u)) * P.cells * P.A + a * P.cells + c;
}

__device__ u32 sA(f32* st, f32* cel, const float4* dir, const Par P, u32 a, u32 c) {
  return (10u + 2u * (P.tags - 1u)) * P.cells * P.A + a * P.cells + c;
}

__device__ i32 tap(f32* st, f32* cel, const float4* dir, const Par P, u32 c, u32 a, f32 sign, u32 k) {
  f32 px = f32_of_u(c % P.N) + sign * dir[a].z;
  f32 py = f32_of_u(c / P.N) + sign * dir[a].w;
  i32 x0 = i32_of_f(floor(px));
  i32 y0 = i32_of_f(floor(py));
  i32 tx = x0 + i32_of_u(k % 2u);
  i32 ty = y0 + i32_of_u(k / 2u);
  if (tx < 0 || ty < 0 || tx >= i32_of_u(P.N) || ty >= i32_of_u(P.N)) { return -1; }
  return ty * i32_of_u(P.N) + tx;
}

__device__ f32 tapw(f32* st, f32* cel, const float4* dir, const Par P, u32 c, u32 a, f32 sign, u32 k) {
  f32 px = f32_of_u(c % P.N) + sign * dir[a].z;
  f32 py = f32_of_u(c / P.N) + sign * dir[a].w;
  f32 fx = px - floor(px);
  f32 fy = py - floor(py);
  f32 wx = select(1.0 - fx, fx, (k % 2u) == 1u);
  f32 wy = select(1.0 - fy, fy, (k / 2u) == 1u);
  return wx * wy;
}

__device__ u32 opp(f32* st, f32* cel, const float4* dir, const Par P, u32 a) {
  return (a + P.A / 2u) % P.A;
}

__device__ f32 owns(f32* st, f32* cel, const float4* dir, const Par P, u32 c, u32 a) {
  return clampf(st[gA(st, cel, dir, P, a, c)] * (P.DEG / f32_of_u(P.A)), 0.0, 1.0);
}

__device__ i32 hopc(f32* st, f32* cel, const float4* dir, const Par P, u32 c, u32 a) {
  i32 hx = i32_of_f(select(-floor(0.5 - dir[a].z), floor(dir[a].z + 0.5), dir[a].z >= 0.0));
  i32 hy = i32_of_f(select(-floor(0.5 - dir[a].w), floor(dir[a].w + 0.5), dir[a].w >= 0.0));
  i32 tx = i32_of_u(c % P.N) + hx;
  i32 ty = i32_of_u(c / P.N) + hy;
  if (tx < 0 || ty < 0 || tx >= i32_of_u(P.N) || ty >= i32_of_u(P.N)) { return -1; }
  return ty * i32_of_u(P.N) + tx;
}

__device__ f32 view(f32* st, f32* cel, const float4* dir, const Par P, u32 a, u32 c) {
  f32 m = 0.0;
  m = st[wA(st, cel, dir, P, a, c)] + st[tA(st, cel, dir, P, a, c)] + st[aA(st, cel, dir, P, a, c)];
  return maxf(0.0, m);
}

__device__ f32 moving(f32* st, f32* cel, const float4* dir, const Par P, u32 a, u32 c) {
  return view(st, cel, dir, P, a, c);
}

__device__ f32 moving_of(f32* st, f32* cel, const float4* dir, const Par P, u32 z, u32 a, u32 c) {
  f32 had = 0.0;
  f32 whole = 0.0;
  had = st[bA(st, cel, dir, P, z, a, c)];
  whole = st[wA(st, cel, dir, P, a, c)];
  if (had <= 0.0 || whole <= 0.0) { return 0.0; }
  f32 f = 0.0;
  f = (whole + st[tA(st, cel, dir, P, a, c)] + st[aA(st, cel, dir, P, a, c)]) / whole;
  if (f < 0.0) { f = 0.0; }
  return had * f;
}

__device__ f32 crossing(f32* st, f32* cel, const float4* dir, const Par P, u32 i, u32 j) {
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

__device__ f32 bodily(f32* st, f32* cel, const float4* dir, const Par P, u32 i) {
  f32 w = st[P.cells * P.A + i];
  if (w <= 0.0) { return 0.0; }
  f32 b = 0.0;
  for (u32 z = 0u; z < P.tags - 1u; z++) {
    b = b + st[(9u + 2u * z) * P.cells * P.A + i];
  }
  return clampf(b / w, 0.0, 1.0);
}

__device__ f32 meet0_gate(f32* st, f32* cel, const float4* dir, const Par P, f32 rho, f32 nf) {
  f32 F = 1.0;
  f32 omega = 1.0;
  f32 beta = 0.0;
  f32 DEG = P.DEG;
  return clampf(F, 0.0, 1.0);
}

__device__ f32 meet0_rays(f32* st, f32* cel, const float4* dir, const Par P, f32 rho, f32 nf) {
  f32 F = 1.0;
  f32 omega = 1.0;
  f32 beta = 0.0;
  f32 DEG = P.DEG;
  return (-2.0);
}

__device__ f32 meet0_space(f32* st, f32* cel, const float4* dir, const Par P, f32 rho, f32 nf) {
  f32 F = 1.0;
  f32 omega = 1.0;
  f32 beta = 0.0;
  f32 DEG = P.DEG;
  return (-1.0);
}

__device__ f32 meet0_folds(f32* st, f32* cel, const float4* dir, const Par P, f32 rho, f32 nf) {
  f32 F = 1.0;
  f32 omega = 1.0;
  f32 beta = 0.0;
  f32 DEG = P.DEG;
  return 1.0;
}

__device__ f32 meet1_gate(f32* st, f32* cel, const float4* dir, const Par P, f32 rho, f32 nf) {
  f32 F = 1.0;
  f32 omega = 1.0;
  f32 beta = 0.0;
  f32 DEG = P.DEG;
  return clampf((((1.0 - rho)) * F), 0.0, 1.0);
}

__device__ f32 meet1_rays(f32* st, f32* cel, const float4* dir, const Par P, f32 rho, f32 nf) {
  f32 F = 1.0;
  f32 omega = 1.0;
  f32 beta = 0.0;
  f32 DEG = P.DEG;
  return 0.0;
}

__device__ f32 meet1_space(f32* st, f32* cel, const float4* dir, const Par P, f32 rho, f32 nf) {
  f32 F = 1.0;
  f32 omega = 1.0;
  f32 beta = 0.0;
  f32 DEG = P.DEG;
  return 1.0;
}

__device__ f32 meet1_folds(f32* st, f32* cel, const float4* dir, const Par P, f32 rho, f32 nf) {
  f32 F = 1.0;
  f32 omega = 1.0;
  f32 beta = 0.0;
  f32 DEG = P.DEG;
  return 0.0;
}

__device__ f32 meet2_gate(f32* st, f32* cel, const float4* dir, const Par P, f32 rho, f32 nf) {
  f32 F = 1.0;
  f32 omega = 1.0;
  f32 beta = 0.0;
  f32 DEG = P.DEG;
  return clampf((((1.0 - rho)) * F), 0.0, 1.0);
}

__device__ f32 meet2_rays(f32* st, f32* cel, const float4* dir, const Par P, f32 rho, f32 nf) {
  f32 F = 1.0;
  f32 omega = 1.0;
  f32 beta = 0.0;
  f32 DEG = P.DEG;
  return 0.0;
}

__device__ f32 meet2_space(f32* st, f32* cel, const float4* dir, const Par P, f32 rho, f32 nf) {
  f32 F = 1.0;
  f32 omega = 1.0;
  f32 beta = 0.0;
  f32 DEG = P.DEG;
  return 1.0;
}

__device__ f32 meet2_folds(f32* st, f32* cel, const float4* dir, const Par P, f32 rho, f32 nf) {
  f32 F = 1.0;
  f32 omega = 1.0;
  f32 beta = 0.0;
  f32 DEG = P.DEG;
  return 0.0;
}

__device__ f32 point0_gate(f32* st, f32* cel, const float4* dir, const Par P, f32 rho, f32 nf) {
  f32 F = 1.0;
  f32 omega = 1.0;
  f32 beta = 0.0;
  f32 DEG = P.DEG;
  return clampf((1.0 - rho), 0.0, 1.0);
}

__device__ f32 point1_gate(f32* st, f32* cel, const float4* dir, const Par P, f32 rho, f32 nf) {
  f32 F = 1.0;
  f32 omega = 1.0;
  f32 beta = 0.0;
  f32 DEG = P.DEG;
  return clampf(((nf / DEG) * ((1.0 - rho))), 0.0, 1.0);
}

__device__ f32 point2_gate(f32* st, f32* cel, const float4* dir, const Par P, f32 rho, f32 nf) {
  f32 F = 1.0;
  f32 omega = 1.0;
  f32 beta = 0.0;
  f32 DEG = P.DEG;
  return clampf((nf * ((1.0 - rho))), 0.0, 1.0);
}

__device__ f32 point3_gate(f32* st, f32* cel, const float4* dir, const Par P, f32 rho, f32 nf) {
  f32 F = 1.0;
  f32 omega = 1.0;
  f32 beta = 0.0;
  f32 DEG = P.DEG;
  return clampf((1.0 - omega), 0.0, 1.0);
}

__device__ f32 point4_gate(f32* st, f32* cel, const float4* dir, const Par P, f32 rho, f32 nf) {
  f32 F = 1.0;
  f32 omega = 1.0;
  f32 beta = 0.0;
  f32 DEG = P.DEG;
  return clampf(omega, 0.0, 1.0);
}

//! kernel SNAP over cells*A
extern "C" __global__ void SNAP(f32* st, f32* cel, const float4* dir, const Par P) {
  u32 i = blockIdx.x * blockDim.x + threadIdx.x;
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
extern "C" __global__ void CLEAR(f32* st, f32* cel, const float4* dir, const Par P) {
  u32 i = blockIdx.x * blockDim.x + threadIdx.x;
  if (i >= P.cells) { return; }
  cel[3u * P.cells + i] = 0.0;
  cel[6u * P.cells + i] = 0.0;
}

//! kernel SWEEP over cells
extern "C" __global__ void SWEEP(f32* st, f32* cel, const float4* dir, const Par P) {
  u32 i = blockIdx.x * blockDim.x + threadIdx.x;
  u32 c = i;
  if (i >= P.cells) { return; }
  f32 s = 0.0;
  for (u32 a = 0u; a < P.A; a++) {
    s = s + clampf(st[wA(st, cel, dir, P, a, c)], 0.0, 1.0);
  }
  cel[0u * P.cells + c] = s / f32_of_u(P.A);
}

//! kernel GATHER over holes*A
extern "C" __global__ void GATHER(f32* st, f32* cel, const float4* dir, const Par P) {
  u32 i = blockIdx.x * blockDim.x + threadIdx.x;
  if (i >= P.holes * P.A) { return; }
  u32 h = i / P.A;
  u32 a = i % P.A;
  i32 cx = i32_of_f(dir[P.A + h].x);
  i32 cy = i32_of_f(dir[P.A + h].y);
  st[sA(st, cel, dir, P, 0u, i)] = 0.0;
  st[sA(st, cel, dir, P, 0u, P.holes * P.A + i)] = 0.0;
  if (cx < 0 || cy < 0 || cx >= i32_of_u(P.N) || cy >= i32_of_u(P.N)) { return; }
  u32 c = u32_of_i(cy) * P.N + u32_of_i(cx);
  st[sA(st, cel, dir, P, 0u, i)] = view(st, cel, dir, P, a, c);
  st[sA(st, cel, dir, P, 0u, P.holes * P.A + i)] = st[gA(st, cel, dir, P, a, c)];
  i32 nx = cx + i32_of_f(select(-floor(0.5 - dir[a].z), floor(dir[a].z + 0.5), dir[a].z >= 0.0));
  i32 ny = cy + i32_of_f(select(-floor(0.5 - dir[a].w), floor(dir[a].w + 0.5), dir[a].w >= 0.0));
  u32 inside = select(0u, 1u, nx >= 0 && ny >= 0 && nx < i32_of_u(P.N) && ny < i32_of_u(P.N));
  u32 nc = select(0u, u32_of_i(ny) * P.N + u32_of_i(nx), inside == 1u);
  for (u32 b = 0u; b < P.A; b++) {
    st[sA(st, cel, dir, P, 0u, 2u * P.holes * P.A + i * P.A + b)] = select(0.0, st[gA(st, cel, dir, P, b, nc)], inside == 1u);
  }
  for (u32 b = 0u; b < P.A; b++) {
    st[sA(st, cel, dir, P, 0u, (2u + P.A) * P.holes * P.A + i * P.A + b)] = select(0.0, st[swA(st, cel, dir, P, b, nc)], inside == 1u);
  }
  st[sA(st, cel, dir, P, 0u, (2u + 2u * P.A) * P.holes * P.A + i)] = st[swA(st, cel, dir, P, a, c)];
}

//! kernel APPLY over one
extern "C" __global__ void APPLY(f32* st, f32* cel, const float4* dir, const Par P) {
  u32 i = blockIdx.x * blockDim.x + threadIdx.x;
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
extern "C" __global__ void MEET0(f32* st, f32* cel, const float4* dir, const Par P) {
  u32 i = blockIdx.x * blockDim.x + threadIdx.x;
  u32 c = i;
  if (i >= P.cells) { return; }
  f32 rho = cel[0u * P.cells + c];
  f32 nf = cel[1u * P.cells + c];
  f32 dSpace = 0.0;
  f32 gone = 0.0;
  f32 cross = 0.0;
  for (u32 a = 0u; a < P.A; a++) {
    u32 o = opp(st, cel, dir, P, a);
    f32 facing = 0.0;
    f32 mixed = 0.0;
    f32 inside = 0.0;
    f32 there_b = 0.0;
    for (u32 q = 0u; q < 4u; q++) {
      i32 to = tap(st, cel, dir, P, c, a, 1.0, q);
      f32 tw = tapw(st, cel, dir, P, c, a, 1.0, q);
      if (to >= 0) {
        inside = inside + tw;
        u32 j = o * P.cells + u32_of_i(to);
        f32 aj = clampf(st[P.cells * P.A + j], 0.0, 1.0);
        facing = facing + tw * aj;
        mixed = mixed + tw * aj * crossing(st, cel, dir, P, a * P.cells + c, j);
        there_b = there_b + tw * bodily(st, cel, dir, P, j);
      }
    }
    if (inside < 1.0) {
      u32 jm = o * P.cells + c;
      f32 am = clampf(st[P.cells * P.A + jm], 0.0, 1.0);
      facing = facing + (1.0 - inside) * am;
      mixed = mixed + (1.0 - inside) * am * crossing(st, cel, dir, P, a * P.cells + c, jm);
      there_b = there_b + (1.0 - inside) * bodily(st, cel, dir, P, jm);
    }
      f32 w = clampf(st[wA(st, cel, dir, P, a, c)], 0.0, 1.0) * facing * meet0_gate(st, cel, dir, P, rho, nf);
      if (w > 0.0) {
        st[kA(st, cel, dir, P, a, c)] = st[kA(st, cel, dir, P, a, c)] + w * meet0_rays(st, cel, dir, P, rho, nf) / 2.0;
        f32 ds = w * meet0_space(st, cel, dir, P, rho, nf) / 2.0;
        dSpace = dSpace + ds * (P.DEG / f32_of_u(P.A));
        f32 mine = 0.5 + 0.5 * (bodily(st, cel, dir, P, a * P.cells + c) - there_b);
        st[fA(st, cel, dir, P, a, c)] = maxf(0.0, st[fA(st, cel, dir, P, a, c)] + w * meet0_folds(st, cel, dir, P, rho, nf) * mine);
        gone = gone + maxf(0.0, w * meet0_folds(st, cel, dir, P, rho, nf) / 2.0) * (P.DEG / f32_of_u(P.A));
        cross = cross + maxf(0.0, w * meet0_folds(st, cel, dir, P, rho, nf) / 2.0) * (P.DEG / f32_of_u(P.A)) * mixed / maxf(facing, 0.000000000001);
      }
  }
  for (u32 a = 0u; a < P.A; a++) {
    u32 o = opp(st, cel, dir, P, a);
    f32 facing = 0.0;
    f32 mixed = 0.0;
    f32 inside = 0.0;
    f32 there_b = 0.0;
    for (u32 q = 0u; q < 4u; q++) {
      i32 to = tap(st, cel, dir, P, c, a, 1.0, q);
      f32 tw = tapw(st, cel, dir, P, c, a, 1.0, q);
      if (to >= 0) {
        inside = inside + tw;
        u32 j = o * P.cells + u32_of_i(to);
        f32 aj = clampf(st[P.cells * P.A + j], 0.0, 1.0);
        facing = facing + tw * aj;
        mixed = mixed + tw * aj * crossing(st, cel, dir, P, a * P.cells + c, j);
        there_b = there_b + tw * bodily(st, cel, dir, P, j);
      }
    }
    if (inside < 1.0) {
      u32 jm = o * P.cells + c;
      f32 am = clampf(st[P.cells * P.A + jm], 0.0, 1.0);
      facing = facing + (1.0 - inside) * am;
      mixed = mixed + (1.0 - inside) * am * crossing(st, cel, dir, P, a * P.cells + c, jm);
      there_b = there_b + (1.0 - inside) * bodily(st, cel, dir, P, jm);
    }
      f32 w = clampf(st[wA(st, cel, dir, P, a, c)], 0.0, 1.0) * facing * meet1_gate(st, cel, dir, P, rho, nf);
      if (w > 0.0) {
        st[kA(st, cel, dir, P, a, c)] = st[kA(st, cel, dir, P, a, c)] + w * meet1_rays(st, cel, dir, P, rho, nf) / 2.0;
        f32 ds = w * meet1_space(st, cel, dir, P, rho, nf) / 2.0;
        dSpace = dSpace + ds * (P.DEG / f32_of_u(P.A));
        f32 mine = 0.5 + 0.5 * (bodily(st, cel, dir, P, a * P.cells + c) - there_b);
        st[fA(st, cel, dir, P, a, c)] = maxf(0.0, st[fA(st, cel, dir, P, a, c)] + w * meet1_folds(st, cel, dir, P, rho, nf) * mine);
        gone = gone + maxf(0.0, w * meet1_folds(st, cel, dir, P, rho, nf) / 2.0) * (P.DEG / f32_of_u(P.A));
        cross = cross + maxf(0.0, w * meet1_folds(st, cel, dir, P, rho, nf) / 2.0) * (P.DEG / f32_of_u(P.A)) * mixed / maxf(facing, 0.000000000001);
      }
  }
  for (u32 a = 0u; a < P.A; a++) {
    u32 o = opp(st, cel, dir, P, a);
    f32 facing = 0.0;
    f32 mixed = 0.0;
    f32 inside = 0.0;
    f32 there_b = 0.0;
    for (u32 q = 0u; q < 4u; q++) {
      i32 to = tap(st, cel, dir, P, c, a, 1.0, q);
      f32 tw = tapw(st, cel, dir, P, c, a, 1.0, q);
      if (to >= 0) {
        inside = inside + tw;
        u32 j = o * P.cells + u32_of_i(to);
        f32 aj = clampf(st[P.cells * P.A + j], 0.0, 1.0);
        facing = facing + tw * aj;
        mixed = mixed + tw * aj * crossing(st, cel, dir, P, a * P.cells + c, j);
        there_b = there_b + tw * bodily(st, cel, dir, P, j);
      }
    }
    if (inside < 1.0) {
      u32 jm = o * P.cells + c;
      f32 am = clampf(st[P.cells * P.A + jm], 0.0, 1.0);
      facing = facing + (1.0 - inside) * am;
      mixed = mixed + (1.0 - inside) * am * crossing(st, cel, dir, P, a * P.cells + c, jm);
      there_b = there_b + (1.0 - inside) * bodily(st, cel, dir, P, jm);
    }
      f32 w = clampf(st[wA(st, cel, dir, P, a, c)], 0.0, 1.0) * facing * meet2_gate(st, cel, dir, P, rho, nf);
      if (w > 0.0) {
        st[kA(st, cel, dir, P, a, c)] = st[kA(st, cel, dir, P, a, c)] + w * meet2_rays(st, cel, dir, P, rho, nf) / 2.0;
        f32 ds = w * meet2_space(st, cel, dir, P, rho, nf) / 2.0;
        dSpace = dSpace + ds * (P.DEG / f32_of_u(P.A));
        f32 mine = 0.5 + 0.5 * (bodily(st, cel, dir, P, a * P.cells + c) - there_b);
        st[fA(st, cel, dir, P, a, c)] = maxf(0.0, st[fA(st, cel, dir, P, a, c)] + w * meet2_folds(st, cel, dir, P, rho, nf) * mine);
        gone = gone + maxf(0.0, w * meet2_folds(st, cel, dir, P, rho, nf) / 2.0) * (P.DEG / f32_of_u(P.A));
        cross = cross + maxf(0.0, w * meet2_folds(st, cel, dir, P, rho, nf) / 2.0) * (P.DEG / f32_of_u(P.A)) * mixed / maxf(facing, 0.000000000001);
      }
  }
  cel[2u * P.cells + c] = cel[2u * P.cells + c] + dSpace;
  cel[3u * P.cells + c] = cel[3u * P.cells + c] + gone;
  cel[6u * P.cells + c] = cel[6u * P.cells + c] + cross;
}

//! kernel CREATE1 over cells
extern "C" __global__ void CREATE1(f32* st, f32* cel, const float4* dir, const Par P) {
  u32 i = blockIdx.x * blockDim.x + threadIdx.x;
  u32 c = i;
  if (i >= P.cells) { return; }
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
      st[dA(st, cel, dir, P, a, c)] = st[dA(st, cel, dir, P, a, c)] + clampf(point0_gate(st, cel, dir, P, clampf(st[wA(st, cel, dir, P, a, c)], 0.0, 1.0), nf), 0.0, 1.0) * 1.0 * (DEG) / DEG;
    }
    dSpace = dSpace + fires0 * (0.0);
    f32 df0 = fires0 * (0.0) / DEG;
    for (u32 a = 0u; a < P.A; a++) {
      st[fA(st, cel, dir, P, a, c)] = maxf(0.0, st[fA(st, cel, dir, P, a, c)] + df0);
    }
  }
  f32 fires1 = clampf(((nf / DEG) * ((1.0 - rho))), 0.0, 1.0) * 1.0;
  if (fires1 > 0.0) {
    for (u32 a = 0u; a < P.A; a++) {
      st[dA(st, cel, dir, P, a, c)] = st[dA(st, cel, dir, P, a, c)] + fires1 * (0.0) / DEG;
    }
    dSpace = dSpace + fires1 * (0.0);
    f32 df1 = fires1 * ((-DEG)) / DEG;
    for (u32 a = 0u; a < P.A; a++) {
      st[fA(st, cel, dir, P, a, c)] = maxf(0.0, st[fA(st, cel, dir, P, a, c)] + df1);
    }
  }
  f32 fires2 = clampf((nf * ((1.0 - rho))), 0.0, 1.0) * 1.0;
  if (fires2 > 0.0) {
    for (u32 a = 0u; a < P.A; a++) {
      st[dA(st, cel, dir, P, a, c)] = st[dA(st, cel, dir, P, a, c)] + fires2 * (0.0) / DEG;
    }
    dSpace = dSpace + fires2 * (1.0);
    f32 df2 = fires2 * (0.0) / DEG;
    for (u32 a = 0u; a < P.A; a++) {
      st[fA(st, cel, dir, P, a, c)] = maxf(0.0, st[fA(st, cel, dir, P, a, c)] + df2);
    }
  }
  cel[2u * P.cells + c] = cel[2u * P.cells + c] + dSpace;
}

//! kernel CREATE2 over cells
extern "C" __global__ void CREATE2(f32* st, f32* cel, const float4* dir, const Par P) {
  u32 i = blockIdx.x * blockDim.x + threadIdx.x;
  u32 c = i;
  if (i >= P.cells) { return; }
  f32 rho = cel[0u * P.cells + c];
  f32 nf = cel[1u * P.cells + c];
  f32 F = 1.0;
  f32 omega = 1.0;
  f32 beta = 0.0;
  f32 DEG = P.DEG;
  f32 dSpace = 0.0;
  f32 fires3 = clampf((1.0 - omega), 0.0, 1.0) * rho;
  if (fires3 > 0.0) {
    for (u32 a = 0u; a < P.A; a++) {
      st[dA(st, cel, dir, P, a, c)] = st[dA(st, cel, dir, P, a, c)] + fires3 * (0.0) / DEG;
    }
    dSpace = dSpace + fires3 * (1.0);
    f32 df3 = fires3 * (0.0) / DEG;
    for (u32 a = 0u; a < P.A; a++) {
      st[fA(st, cel, dir, P, a, c)] = maxf(0.0, st[fA(st, cel, dir, P, a, c)] + df3);
    }
  }
  f32 fires4 = clampf(omega, 0.0, 1.0) * rho;
  if (fires4 > 0.0) {
    for (u32 a = 0u; a < P.A; a++) {
      st[dA(st, cel, dir, P, a, c)] = st[dA(st, cel, dir, P, a, c)] + fires4 * (0.0) / DEG;
    }
    dSpace = dSpace + fires4 * (0.0);
    f32 df4 = fires4 * (0.0) / DEG;
    for (u32 a = 0u; a < P.A; a++) {
      st[fA(st, cel, dir, P, a, c)] = maxf(0.0, st[fA(st, cel, dir, P, a, c)] + df4);
    }
  }
  cel[2u * P.cells + c] = cel[2u * P.cells + c] + dSpace;
}

//! kernel TAKE over cells*A
extern "C" __global__ void TAKE(f32* st, f32* cel, const float4* dir, const Par P) {
  u32 i = blockIdx.x * blockDim.x + threadIdx.x;
  if (i >= P.cells * P.A) { return; }
  st[4u * P.cells * P.A + i] = st[4u * P.cells * P.A + i] + st[7u * P.cells * P.A + i];
  st[7u * P.cells * P.A + i] = 0.0;
}

//! kernel TOTAL over cells
extern "C" __global__ void TOTAL(f32* st, f32* cel, const float4* dir, const Par P) {
  u32 i = blockIdx.x * blockDim.x + threadIdx.x;
  u32 c = i;
  if (i >= P.cells) { return; }
  f32 nf = 0.0;
  for (u32 b = 0u; b < P.A; b++) {
    nf = nf + maxf(0.0, st[gA(st, cel, dir, P, b, c)]);
  }
  nf = nf * (P.DEG / f32_of_u(P.A));
  cel[1u * P.cells + c] = nf;
  cel[4u * P.cells + c] = 1.0 / (1.0 + nf);
}

//! kernel LOCATE over cells
extern "C" __global__ void LOCATE(f32* st, f32* cel, const float4* dir, const Par P) {
  u32 i = blockIdx.x * blockDim.x + threadIdx.x;
  u32 c = i;
  if (i >= P.cells) { return; }
  f32 total = 0.0;
  f32 now = 0.0;
  for (u32 b = 0u; b < P.A; b++) {
    i32 h = hopc(st, cel, dir, P, c, b);
    u32 j = opp(st, cel, dir, P, b) * P.cells + u32_of_i(h);
    f32 s = select(0.0, clampf(st[8u * P.cells * P.A + j] * (P.DEG / f32_of_u(P.A)), 0.0, 1.0), h >= 0);
    f32 r = select(0.0, maxf(0.0, (st[3u * P.cells * P.A + j] - st[8u * P.cells * P.A + j]) * (P.DEG / f32_of_u(P.A))), h >= 0);
    total = total + s;
    now = now + r;
  }
  f32 inside = clampf(now, 0.0, 1.0);
  for (u32 b = 0u; b < P.A; b++) {
    i32 h = hopc(st, cel, dir, P, c, b);
    u32 j = opp(st, cel, dir, P, b) * P.cells + u32_of_i(h);
    f32 s = select(0.0, clampf(st[8u * P.cells * P.A + j] * (P.DEG / f32_of_u(P.A)), 0.0, 1.0), h >= 0);
    f32 r = select(0.0, maxf(0.0, (st[3u * P.cells * P.A + j] - st[8u * P.cells * P.A + j]) * (P.DEG / f32_of_u(P.A))), h >= 0);
    st[swA(st, cel, dir, P, b, c)] = select(0.0, inside * r / now, now > 0.0);
  }
  cel[(7u + P.tags) * P.cells + c] = inside;
}

//! kernel CARRY over cells*A
extern "C" __global__ void CARRY(f32* st, f32* cel, const float4* dir, const Par P) {
  u32 i = blockIdx.x * blockDim.x + threadIdx.x;
  if (i >= P.cells * P.A) { return; }
  u32 a = i / P.cells;
  u32 c = i % P.cells;
  f32 got = 0.0;
  for (u32 q = 0u; q < 4u; q++) {
    i32 src = tap(st, cel, dir, P, c, a, -1.0, q);
    if (src >= 0) {
      f32 sw = tapw(st, cel, dir, P, c, a, -1.0, q);
      got = got + sw * moving(st, cel, dir, P, a, u32_of_i(src)) * cel[4u * P.cells + u32_of_i(src)] * (1.0 - owns(st, cel, dir, P, u32_of_i(src), a));
    }
  }
  for (u32 q = 0u; q < 4u; q++) {
    i32 src2 = tap(st, cel, dir, P, c, a, -2.0, q);
    if (src2 >= 0) {
      f32 sw2 = tapw(st, cel, dir, P, c, a, -2.0, q);
      got = got + sw2 * moving(st, cel, dir, P, a, u32_of_i(src2)) * cel[4u * P.cells + u32_of_i(src2)] * owns(st, cel, dir, P, u32_of_i(src2), a);
      f32 fa = st[gA(st, cel, dir, P, a, u32_of_i(src2))];
      if (fa > 0.0) {
      for (u32 b = 0u; b < P.A; b++) {
        got = got + sw2 * moving(st, cel, dir, P, b, u32_of_i(src2)) * fa * cel[4u * P.cells + u32_of_i(src2)] * (P.DEG / f32_of_u(P.A));
      }
      }
    }
  }
  st[sA(st, cel, dir, P, a, c)] = got;
}

//! kernel FUNNEL over cells*A
extern "C" __global__ void FUNNEL(f32* st, f32* cel, const float4* dir, const Par P) {
  u32 i = blockIdx.x * blockDim.x + threadIdx.x;
  if (i >= P.cells * P.A) { return; }
  u32 a = i / P.cells;
  u32 c = i % P.cells;
  f32 stays = 1.0;
  f32 got = 0.0;
  f32 own = select(0.0, st[swA(st, cel, dir, P, opp(st, cel, dir, P, a), c)], hopc(st, cel, dir, P, c, opp(st, cel, dir, P, a)) >= 0);
  f32 mine_t = cel[(7u + P.tags) * P.cells + c] - own;
  f32 mine_s = select(1.0, 1.0 / mine_t, mine_t > 1.0);
  for (u32 b = 0u; b < P.A; b++) {
    if (b != opp(st, cel, dir, P, a)) {
      i32 h = hopc(st, cel, dir, P, c, b);
      if (h >= 0) { stays = stays - st[swA(st, cel, dir, P, b, c)] * mine_s; }
      i32 q = hopc(st, cel, dir, P, c, opp(st, cel, dir, P, b));
      if (q >= 0) {
        f32 q_own = select(0.0, st[swA(st, cel, dir, P, opp(st, cel, dir, P, a), u32_of_i(q))], hopc(st, cel, dir, P, u32_of_i(q), opp(st, cel, dir, P, a)) >= 0);
        f32 q_t = cel[(7u + P.tags) * P.cells + u32_of_i(q)] - q_own;
        f32 q_s = select(1.0, 1.0 / q_t, q_t > 1.0);
        got = got + st[sA(st, cel, dir, P, a, u32_of_i(q))] * st[swA(st, cel, dir, P, b, u32_of_i(q))] * q_s;
      }
    }
  }
  st[nA(st, cel, dir, P, a, c)] = got + st[sA(st, cel, dir, P, a, c)] * maxf(0.0, stays);
}

//! kernel TAGCARRY over cells*A
extern "C" __global__ void TAGCARRY(f32* st, f32* cel, const float4* dir, const Par P) {
  u32 i = blockIdx.x * blockDim.x + threadIdx.x;
  if (i >= P.cells * P.A) { return; }
  u32 a = i / P.cells;
  u32 c = i % P.cells;
  f32 got = 0.0;
  for (u32 q = 0u; q < 4u; q++) {
    i32 src = tap(st, cel, dir, P, c, a, -1.0, q);
    if (src >= 0) {
      f32 sw = tapw(st, cel, dir, P, c, a, -1.0, q);
      got = got + sw * moving_of(st, cel, dir, P, P.z, a, u32_of_i(src)) * cel[4u * P.cells + u32_of_i(src)] * (1.0 - owns(st, cel, dir, P, u32_of_i(src), a));
    }
  }
  for (u32 q = 0u; q < 4u; q++) {
    i32 src2 = tap(st, cel, dir, P, c, a, -2.0, q);
    if (src2 >= 0) {
      f32 sw2 = tapw(st, cel, dir, P, c, a, -2.0, q);
      got = got + sw2 * moving_of(st, cel, dir, P, P.z, a, u32_of_i(src2)) * cel[4u * P.cells + u32_of_i(src2)] * owns(st, cel, dir, P, u32_of_i(src2), a);
      f32 fa = st[gA(st, cel, dir, P, a, u32_of_i(src2))];
      if (fa > 0.0) {
      for (u32 b = 0u; b < P.A; b++) {
        got = got + sw2 * moving_of(st, cel, dir, P, P.z, b, u32_of_i(src2)) * fa * cel[4u * P.cells + u32_of_i(src2)] * (P.DEG / f32_of_u(P.A));
      }
      }
    }
  }
  st[sA(st, cel, dir, P, a, c)] = got;
}

//! kernel TAGFUNNEL over cells*A
extern "C" __global__ void TAGFUNNEL(f32* st, f32* cel, const float4* dir, const Par P) {
  u32 i = blockIdx.x * blockDim.x + threadIdx.x;
  if (i >= P.cells * P.A) { return; }
  u32 a = i / P.cells;
  u32 c = i % P.cells;
  f32 stays = 1.0;
  f32 got = 0.0;
  f32 own = select(0.0, st[swA(st, cel, dir, P, opp(st, cel, dir, P, a), c)], hopc(st, cel, dir, P, c, opp(st, cel, dir, P, a)) >= 0);
  f32 mine_t = cel[(7u + P.tags) * P.cells + c] - own;
  f32 mine_s = select(1.0, 1.0 / mine_t, mine_t > 1.0);
  for (u32 b = 0u; b < P.A; b++) {
    if (b != opp(st, cel, dir, P, a)) {
      i32 h = hopc(st, cel, dir, P, c, b);
      if (h >= 0) { stays = stays - st[swA(st, cel, dir, P, b, c)] * mine_s; }
      i32 q = hopc(st, cel, dir, P, c, opp(st, cel, dir, P, b));
      if (q >= 0) {
        f32 q_own = select(0.0, st[swA(st, cel, dir, P, opp(st, cel, dir, P, a), u32_of_i(q))], hopc(st, cel, dir, P, u32_of_i(q), opp(st, cel, dir, P, a)) >= 0);
        f32 q_t = cel[(7u + P.tags) * P.cells + u32_of_i(q)] - q_own;
        f32 q_s = select(1.0, 1.0 / q_t, q_t > 1.0);
        got = got + st[sA(st, cel, dir, P, a, u32_of_i(q))] * st[swA(st, cel, dir, P, b, u32_of_i(q))] * q_s;
      }
    }
  }
  st[bA(st, cel, dir, P, P.z, a, c)] = got + st[sA(st, cel, dir, P, a, c)] * maxf(0.0, stays);
}

//! kernel SETTLE over cells*A
extern "C" __global__ void SETTLE(f32* st, f32* cel, const float4* dir, const Par P) {
  u32 i = blockIdx.x * blockDim.x + threadIdx.x;
  if (i >= P.cells * P.A) { return; }
  st[i] = st[i] + st[2u * P.cells * P.A + i];
  for (u32 z = 0u; z < P.tags - 1u; z++) {
    st[(9u + 2u * z) * P.cells * P.A + i] = st[(9u + 2u * z) * P.cells * P.A + i] + st[(10u + 2u * z) * P.cells * P.A + i];
  }
}

//! kernel ARRIVED over cells
extern "C" __global__ void ARRIVED(f32* st, f32* cel, const float4* dir, const Par P) {
  u32 i = blockIdx.x * blockDim.x + threadIdx.x;
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
    cel[(8u + z) * P.cells + c] = got * (P.DEG / f32_of_u(P.A));
  }
  cel[7u * P.cells + c] = maxf(0.0, total - others) * (P.DEG / f32_of_u(P.A));
}
