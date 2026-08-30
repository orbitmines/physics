/**
 * THE PICTURES, WRITTEN BY EVERY RUN - shared, so no script can forget them.
 *
 * Three batches in a row dumped their fields and no images, and each time the rendering had to
 * be chased afterwards with a separate pass. A run that produces numbers nobody can look at is
 * half a run. So this is imported and called at the end of every script, and the fields are
 * written BESIDE the pictures rather than instead of them.
 *
 * THE CUTS, and the third one is a choice that destroys the first two:
 *   meridian  the (x, z) plane at y ~ 0 - azimuth KEPT, so a lobe stays a lobe
 *   equator   the (x, y) plane at z ~ 0 - where seats show as discrete lobes
 *   ring      azimuthally integrated (rho, z) - every azimuth merged into one radius, so a lobe
 *             is spread into a RING. Kept only for the comparison; it is what made every earlier
 *             picture circular
 */
import { writeFileSync } from "node:fs";
import { png } from "../src/theorems/probes/png.ts";

const PX = 720, SLAB = 3;

/**
 * THE FRAME COMES FROM THE FIELD, not from one number shared by all of them.
 *
 * A fixed RMAX suits whichever field it was chosen for and nothing else. The vacuum response
 * dies by about three units and was drawn in a frame of six, so half the picture was empty; the
 * ballistic run is concentrated within one unit of the source and in the same frame is a tight
 * blob. Same number, opposite complaints, and both right.
 *
 * So each field is measured: the radius inside which nine tenths of |field| sits, with a margin.
 * A field that reaches further is drawn wider, one that is compact is drawn closer, and the two
 * are then each shown at their own scale rather than at a compromise that suits neither.
 */
/*
 * THE FRAME IS GIVEN, NOT GUESSED - two attempts at deriving it failed in opposite directions.
 *
 * By share of |field| it collapsed onto the source, because the profile runs 1.2e3 at r = 0.26
 * against 1e-2 at r = 3 and nine tenths of the total is inside half a unit. By where the mean
 * falls below a fraction of its reference it ran to the box edge, because far out the field is
 * NOISE and the mean of |noise| does not decay. Both are reasonable rules and both are wrong on
 * this data, in opposite ways.
 *
 * The extent is known from the measured profiles - the response is over by about three units -
 * so it is stated. A caller that wants a different one passes it.
 */
export const cut = (
  dir: string, tag: string, f: Float64Array,
  N: number, L: number, RMAX: number, signed = false, MASK = 0.2,
) => {
  const at = (a: number, b: number, c: number) =>
    (a<0||b<0||c<0||a>=N||b>=N||c>=N) ? 0 : f[(a*N+b)*N+c];
  const idx = (v: number) => Math.floor((v/L + 0.5)*N);
  const cuts: [string, (u: number, v: number) => number][] = [
    ["meridian", (u,v) => { let s=0,k=0;
      for(let d=-SLAB;d<=SLAB;d++){ s+=at(idx(u),idx(d*L/N),idx(v)); k++; } return s/k; }],
    ["equator",  (u,v) => { let s=0,k=0;
      for(let d=-SLAB;d<=SLAB;d++){ s+=at(idx(u),idx(v),idx(d*L/N)); k++; } return s/k; }],
    ["ring",     (u,v) => { const rho=Math.abs(u); let s=0;
      for(let q=0;q<48;q++){ const ph=2*Math.PI*(q+0.5)/48;
        s+=at(idx(rho*Math.cos(ph)),idx(rho*Math.sin(ph)),idx(v)); } return s/48; }],
  ];
  for (const [name, get] of cuts) {
    const img = new Float64Array(PX*PX); let hi = 0;
    for (let j=0;j<PX;j++) for(let i=0;i<PX;i++){
      const u=(i-(PX-1)/2)/((PX-1)/2)*RMAX, v=(j-(PX-1)/2)/((PX-1)/2)*RMAX;
      const r=Math.hypot(u,v); if(r>RMAX||r<MASK) continue;
      const g=get(u,v); img[j*PX+i]=g; hi=Math.max(hi,Math.abs(g));
    }
    const rgb = new Uint8Array(PX*PX*3);
    for (let k=0;k<PX*PX;k++){
      const val = img[k]/(hi||1);
      let c: number[];
      if (signed){ const p=Math.pow(Math.min(1,Math.abs(val)),0.5);
        c = val>=0 ? [20+235*p,20+130*p,20+60*p] : [20+60*p,20+140*p,20+235*p]; }
      else { const t=Math.pow(Math.max(0,Math.min(1,Math.abs(val))),0.45);
        const st=[[6,8,14],[20,45,95],[70,130,200],[190,220,245],[255,205,140]];
        const ff=t*(st.length-1), k0=Math.min(st.length-2,Math.floor(ff)), fr=ff-k0;
        c=[0,1,2].map(q=>st[k0][q]+(st[k0+1][q]-st[k0][q])*fr); }
      const j=(k/PX)|0, i=k%PX, q=((PX-1-j)*PX+i)*3;
      rgb[q]=c[0]|0; rgb[q+1]=c[1]|0; rgb[q+2]=c[2]|0;
    }
    writeFileSync(`${dir}/${tag}-${name}.png`, Buffer.from(png(PX,PX,rgb),"base64"));
  }
};

/** every field a run produced: the response, the pattern alone, and what the vacuum ADDED */
/*
 * THE SKY: the field as a function of DIRECTION, averaged over every radius.
 *
 * A slab three cells thick holds a thirtieth of the samples the harmonic projection uses, so a
 * cone that the harmonics find easily (P4 = 1.45 for d_z2) is invisible in a slice - the shape
 * cut of that field came out pure noise while the number was unambiguous. The structure being
 * looked for is ANGULAR, so it should be averaged over the one coordinate it does not depend on.
 *
 * Each direction bin takes every cell whose direction falls in it, at every radius, each divided
 * by the mean at ITS radius so the bright isotropic shell at r ~ 1.08 cannot dominate. What is
 * drawn is longitude across and cos(latitude) up - an equal-area map of the sphere, on which a
 * cone is a horizontal band and seats are spots along it.
 */
/**
 * THE ORBITAL, DRAWN THE WAY AN ORBITAL IS DRAWN - projected through the volume.
 *
 * A sky map is a rectangular projection: longitude across, latitude up. A compact lobe becomes a
 * vertical STRIPE in it, and four lobes read as a bunch of stripes. It is fine for counting folds
 * and useless for looking at, which is what it was asked to do.
 *
 * `atom.cloud` draws |psi|^2 by summing THROUGH the box along a line of sight, and that is what
 * makes a lobe look like a lobe. The same is done here with two corrections the lattice does not
 * need:
 *
 *   the SHELL IS DIVIDED OUT first. The field is ~5 at most radii and 478 on one isotropic shell
 *   at r ~ 1.08, so a raw projection is that shell and nothing else. Each radius against its own
 *   mean leaves how much MORE there is in each direction, which is the lobe.
 *
 *   only the POSITIVE side is kept. What is wanted is where this state puts more than a sphere
 *   would at that radius; the negative side is where it puts less, and drawn together they fill
 *   each other in. `atom.cloud` has the same convention - a density, not a signed field.
 */
export const project = (dir: string, tag: string, f: Float64Array,
                        N: number, L: number, RMAX: number) => {
  const NB = 64, R = L/2;
  const rs = new Float64Array(NB), rc = new Float64Array(NB);
  for (let a=0;a<N;a++) for(let b=0;b<N;b++) for(let c=0;c<N;c++){
    const x=(a+0.5-N/2)*L/N, y=(b+0.5-N/2)*L/N, z=(c+0.5-N/2)*L/N;
    const i=Math.floor(Math.hypot(x,y,z)/R*NB); if(i>=NB) continue;
    rs[i]+=f[(a*N+b)*N+c]; rc[i]++;
  }
  const mu = Array.from(rs,(v,i)=>rc[i]?v/rc[i]:0);
  /*
   * ONLY THE SHELL THAT HOLDS THE SIGNAL IS PROJECTED, or the line of sight is mostly noise.
   *
   * Summing along an axis, each pixel gathers N cells - ninety-six here - and the lobe occupies
   * only the few at its own radius. Clipping to the positive side first, the positive half of the
   * noise in the other ninety adds up into a bright wash with the shell's edges showing as
   * circles, which is what the first attempt drew. Signal to noise of one in ninety is not a
   * rendering problem that contrast can fix.
   *
   * So the radii are restricted to the band that actually carries the field - where the radial
   * mean is at least a fifth of its peak, measured over the mapped region rather than over the
   * source's own bin - and the rest contributes nothing. On the d_xy field that band alone gives
   * a twenty to one azimuthal contrast; projected whole it gives none.
   */
  /*
   * NO BRIGHTNESS THRESHOLD. It had one - radii below a fifth of the peak were dropped - and
   * since the radial profile is sharply peaked (478 on one shell against ~5 elsewhere) a fifth
   * of the peak is 95, so ONLY THE PEAK BIN EVER QUALIFIED. The picture was one shell by
   * construction whatever the physics did, which is why thinning the vacuum thirtyfold and
   * setting `stir` to nought changed the image not at all. That was the renderer answering, not
   * the model.
   *
   * Dividing by the mean at each radius already normalises every shell to the same scale, which
   * is the whole point of it - a faint radius and a bright one both come out as "how much more
   * than average, here". So every radius is kept and the radial extent in the picture is the
   * radial extent in the field.
   */
  const sh = new Float64Array(f.length);
  for (let a=0;a<N;a++) for(let b=0;b<N;b++) for(let c=0;c<N;c++){
    const x=(a+0.5-N/2)*L/N, y=(b+0.5-N/2)*L/N, z=(c+0.5-N/2)*L/N;
    const r=Math.hypot(x,y,z); if(r<0.3||r>RMAX) continue;
    const i=Math.floor(r/R*NB);
    if(i>=NB||Math.abs(mu[i])<1e-9) continue;
    const k=(a*N+b)*N+c;
    sh[k] = Math.max(0, f[k]/mu[i] - 1);
  }
  /* three views, each summed THROUGH the box - the axis is up in the first two */
  const views: [string, (i: number, j: number, k: number) => number][] = [
    ["front", (i,j,k) => sh[(i*N+k)*N+j]],      // sum along y: x across, z up
    ["side",  (i,j,k) => sh[(k*N+i)*N+j]],      // sum along x: y across, z up
    ["top",   (i,j,k) => sh[(i*N+j)*N+k]],      // sum along z: x across, y up
  ];
  const PXP = 600;
  for (const [name, get] of views) {
    const img = new Float64Array(N*N);
    for (let i=0;i<N;i++) for(let j=0;j<N;j++){
      let s=0; for(let k=0;k<N;k++) s += get(i,j,k);
      img[j*N+i]=s;
    }
    let hi=0; for(const v of img) hi=Math.max(hi,v);
    const rgb = new Uint8Array(PXP*PXP*3);
    for (let py=0;py<PXP;py++) for(let px=0;px<PXP;px++){
      const i=Math.floor(px/PXP*N), j=Math.floor(py/PXP*N);
      const t = Math.pow(Math.max(0,Math.min(1,img[j*N+i]/(hi||1))), 0.45);
      const st=[[6,8,14],[20,45,95],[70,130,200],[190,220,245],[255,205,140]];
      const ff=t*(st.length-1), k0=Math.min(st.length-2,Math.floor(ff)), fr=ff-k0;
      const c=[0,1,2].map(q=>st[k0][q]+(st[k0+1][q]-st[k0][q])*fr);
      const q=((PXP-1-py)*PXP+px)*3; rgb[q]=c[0]|0; rgb[q+1]=c[1]|0; rgb[q+2]=c[2]|0;
    }
    writeFileSync(`${dir}/${tag}-${name}.png`, Buffer.from(png(PXP,PXP,rgb),"base64"));
  }
};

export const sky = (dir: string, tag: string, f: Float64Array,
                    N: number, L: number, signed = true) => {
  const NB = 64, R = L/2;
  const rs = new Float64Array(NB), rc = new Float64Array(NB);
  for (let a=0;a<N;a++) for(let b=0;b<N;b++) for(let c=0;c<N;c++){
    const x=(a+0.5-N/2)*L/N, y=(b+0.5-N/2)*L/N, z=(c+0.5-N/2)*L/N;
    const i=Math.floor(Math.hypot(x,y,z)/R*NB); if(i>=NB) continue;
    rs[i]+=f[(a*N+b)*N+c]; rc[i]++;
  }
  const mu = Array.from(rs,(v,i)=>rc[i]?v/rc[i]:0);
  /*
   * COARSE BINS, because the sampling decides what can be seen. The harmonic projection sums
   * about twenty-seven thousand cells into each polar bin and finds the cone easily; a 96 x 48
   * sky spreads the same cells over four and a half thousand bins - a hundred and forty times
   * fewer each - and came out as pure noise for a field whose P4 is 1.45. The structure was
   * never missing; the map was finer than the data.
   */
  const NPH = 24, NTH = 12;
  const acc = new Float64Array(NPH*NTH), cnt = new Float64Array(NPH*NTH);
  /*
   * ONLY WHERE THERE IS SIGNAL. The field is not spread over radius: it is ~5 nearly everywhere
   * and 478 on one shell at r ~ 1.08, and the angular structure the harmonics find lives ON that
   * shell. Averaging every radius equally dilutes it with the empty ones - which is why the map
   * came out as noise for a field whose P4 is 1.45. So the radii are weighted by how much is
   * actually there, and those holding less than a fifth of the brightest are left out entirely.
   */
  /* the peak is taken OVER THE MAPPED REGION only - computed over everything it was set by the
   * source's own bin (196 against a shell of ~5) and the threshold then excluded the entire
   * field, leaving a black picture */
  const i0 = Math.ceil(0.3/R*NB);
  let peak = 0;
  for (let i=i0;i<NB;i++) peak = Math.max(peak, Math.abs(mu[i]));
  for (let a=0;a<N;a++) for(let b=0;b<N;b++) for(let c=0;c<N;c++){
    const x=(a+0.5-N/2)*L/N, y=(b+0.5-N/2)*L/N, z=(c+0.5-N/2)*L/N;
    const r=Math.hypot(x,y,z); if(r<0.3||r>R) continue;
    const i=Math.floor(r/R*NB);
    if(i>=NB||Math.abs(mu[i])<1e-12||Math.abs(mu[i])<0.2*peak) continue;
    const ip=Math.min(NPH-1,Math.floor((((Math.atan2(y,x)/(2*Math.PI))%1+1)%1)*NPH));
    const it=Math.min(NTH-1,Math.floor((z/r+1)/2*NTH));
    acc[it*NPH+ip] += f[(a*N+b)*N+c]/mu[i] - 1; cnt[it*NPH+ip]++;
  }
  const W = NPH*30, H = NTH*30;
  let hi=0;
  const v = new Float64Array(NPH*NTH);
  for (let k=0;k<v.length;k++){ v[k]=cnt[k]?acc[k]/cnt[k]:0; hi=Math.max(hi,Math.abs(v[k])); }
  const rgb = new Uint8Array(W*H*3);
  for (let j=0;j<H;j++) for(let i=0;i<W;i++){
    const val = v[((j/30)|0)*NPH + ((i/30)|0)]/(hi||1);
    let c: number[];
    if (signed){ const p=Math.pow(Math.min(1,Math.abs(val)),0.5);
      c = val>=0 ? [20+235*p,20+130*p,20+60*p] : [20+60*p,20+140*p,20+235*p]; }
    else { const t=Math.pow(Math.max(0,Math.min(1,Math.abs(val))),0.45);
      const st=[[6,8,14],[20,45,95],[70,130,200],[190,220,245],[255,205,140]];
      const ff=t*(st.length-1),k0=Math.min(st.length-2,Math.floor(ff)),fr=ff-k0;
      c=[0,1,2].map(q=>st[k0][q]+(st[k0+1][q]-st[k0][q])*fr); }
    const q=((H-1-j)*W+i)*3; rgb[q]=c[0]|0; rgb[q+1]=c[1]|0; rgb[q+2]=c[2]|0;
  }
  writeFileSync(`${dir}/${tag}-sky.png`, Buffer.from(png(W,H,rgb),"base64"));
};

export const cutAll = (dir: string, tag: string, N: number, L: number, RMAX: number,
                       fields: { vol: Float64Array; bal?: Float64Array; den?: Float64Array }) => {
  cut(dir, tag, fields.vol, N, L, RMAX);
  /* the ANGULAR part alone, with the dominating isotropic shell divided out - this is where a
   * cone is visible and the raw field is not */
  cut(dir, `${tag}-shape`, shaped(fields.vol, N, L), N, L, RMAX, true);
  /* and the sky, which uses every radius at once and is where a cone is actually visible */
  /* the orbital, projected through the box - this is the one to look at */
  project(dir, tag, fields.vol, N, L, RMAX);
  if (fields.bal) project(dir, `${tag}-bal`, fields.bal, N, L, RMAX);
  if (fields.den) cut(dir, `${tag}-denshape`, shaped(fields.den, N, L), N, L, RMAX, true);
  if (fields.den) cut(dir, `${tag}-den`, fields.den, N, L, RMAX);
  if (fields.bal) {
    cut(dir, `${tag}-bal`, fields.bal, N, L, RMAX);
    const sum = (a: Float64Array) => { let s=0; for(const v of a) s+=Math.abs(v); return s||1; };
    const sv = sum(fields.vol), sb = sum(fields.bal);
    const add = new Float64Array(fields.vol.length);
    for (let i=0;i<add.length;i++) add[i] = fields.vol[i]/sv - fields.bal[i]/sb;
    cut(dir, `${tag}-added`, add, N, L, RMAX, true);
  }
};
