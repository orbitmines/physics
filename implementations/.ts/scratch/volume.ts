/**
 * THE OBJECT, NOT A SLICE OF IT - the same field the cuts draw, ray-marched from a tilted camera.
 *
 * Every picture so far has been a PLANE through the field: meridian, equator, or the azimuthal
 * average. A plane answers "what is the value here", which is the right question for finding a
 * node and the wrong one for seeing a shape - the reason d_z2 reads as an hourglass with two
 * caps rather than as two lobes threaded through a torus is that a cut cannot show you the torus
 * and the lobes at once, at different depths.
 *
 * So the volume is integrated along the line of sight instead, front to back, each sample
 * occluding what is behind it. Two things then do the work a cut cannot:
 *
 *   OCCLUSION. Accumulating (1-A)*alpha means near material hides far material, which is the
 *   only depth cue an orthographic projection of a transparent cloud has. Without it the sum is
 *   symmetric front-to-back and the picture flattens into exactly the projection `project` makes.
 *
 *   SHADING. The gradient of the tone-mapped field is a surface normal wherever the field has an
 *   edge, and a fixed light against it turns each shell into a lit surface. This is what makes
 *   the published orbital pictures look solid; they are isosurfaces, and a shaded cloud is the
 *   same information without having to choose the isovalue.
 *
 * THE RADIAL WEIGHT. `den` is a count per cell, so it carries the 1/r^2 dilution of anything
 * spreading from a point and the core outshines the rest by three orders of magnitude - alpha
 * composited, that is an opaque ball and nothing else. Weighting by r^2 gives the count per
 * SHELL, which is the radial distribution function, the quantity whose nodes are the ones
 * hydrogen is drawn with. It is a reweighting of the same field, not a different field.
 *
 * Same palette as the cuts, same 0.45 tone curve, so a lobe that is cream here is cream there.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { png } from "../src/theorems/probes/png.ts";

const dir = "/home/fadi/Desktop/orbitmines/physics/visuals/vacuum/hydro";
const TAG   = process.argv[2] ?? "3d_z2s0.15";
const CHAN  = process.argv[3] ?? "den";
const PX    = Number(process.argv[4] ?? 1400);
const RVIEW0 = Number(process.argv[5] ?? 1.9);     // an upper bound; the field sets the rest
const RIN   = Number(process.argv[6] ?? 0.16);     // the source itself, left out
const POW   = Number(process.argv[7] ?? 2);        // r^POW shell weight
const SIGNED= (process.argv[8] ?? "0") === "1";

const meta = JSON.parse(readFileSync(`${dir}/${TAG}.json`, "utf8"));
const NO: number = meta.NO, LOUT: number = meta.LOUT;
const raw = new Float32Array(readFileSync(`${dir}/${TAG}-${CHAN}.f32`).buffer.slice(0));
if (raw.length !== NO*NO*NO) throw new Error(`${raw.length} floats, expected ${NO}^3`);

/*
 * THE AMBIENT VACUUM IS SUBTRACTED FIRST, BEFORE THE SHELL WEIGHT - and that ordering is the
 * whole difference between 4d reading as an object and 4d reading as a mottled ball.
 *
 * `den` is the density of the vacuum run, so it is the source's response PLUS the bare vacuum
 * the source is sitting in, and the bare vacuum is uniform at about 8e-4 a cell at every radius.
 * Weighted by r^2 a uniform background is not uniform: it GROWS outward as r^2, so it is
 * brightest exactly where the object is faintest. For 3d that background is a thousandth of the
 * response and invisible. For 4d it is not: 4d's field is some 280 times weaker, so the response
 * stands about four times over the background, and an r^2-weighted background four times under
 * the signal and rising is the ball that came out.
 *
 * WHY 4d IS WEAKER IS NOT WHAT THIS FILE USED TO SAY. It said the source emits less, because the
 * firing is gated on |R_nl| and R_42 is smaller. Measured, the gating differs by 1.54 over a
 * period and the two BALLISTIC twins - the same sources fired into sigma = tau = nu = stir = 0 -
 * differ by 1.08. The sources put out the same amount. What differs is what the vacuum does with
 * it: 3d's field is 481 times its own ballistic twin and 4d's is 1.85 times its own. The whole
 * gap is the vacuum's response, not the emission.
 *
 * So the ambient level is measured as the median over a band the response never reaches (r in
 * [0.8, 1.1], flat in both states) and taken off the RAW density, where it is the constant it
 * actually is. What is left is the excess over the bare vacuum, and only then is it weighted by
 * r^2 to give the count per shell.
 *
 * The spread in that same band is what a cell reads when nothing is there, so it sets two more
 * things that are then not chosen: how much smoothing (a field four times over its noise needs
 * several passes, one a thousand times over needs none) and where the object ENDS - the last
 * radius whose shell mean still stands clear. The frame stops just past that, so a state that
 * reaches further is drawn wider and one that does not is not padded with its own background.
 */
const cell = LOUT / NO;
/*
 * THE BACKGROUND IS A MEAN AND AN RMS, NOT A MEDIAN AND A MAD.
 *
 * The first version used the median, and it read exactly nought: the field is a count of
 * particles in a cell 0.025 across, so out where the response has died MOST CELLS ARE EMPTY and
 * the middle one of them is empty too. A robust centre is the right tool for a continuous field
 * with outliers and the wrong one for a sparse count, where the information is entirely in the
 * minority of cells that are not zero. The mean of a count is its density and the RMS about it
 * is what one cell's worth of shot noise looks like, which are the two numbers wanted.
 */
const bandStat = (get: (k: number) => number) => {
  let n=0, s1=0, s2=0;
  for (let a=0;a<NO;a++) for(let b=0;b<NO;b++) for(let c=0;c<NO;c++){
    const x=(a+0.5-NO/2)*cell, y=(b+0.5-NO/2)*cell, z=(c+0.5-NO/2)*cell;
    const r=Math.hypot(x,y,z); if(r<0.8||r>1.1) continue;
    const v=get((a*NO+b)*NO+c); n++; s1+=v; s2+=v*v;
  }
  const med = n?s1/n:0;
  return { med, sd: n?Math.sqrt(Math.max(0,s2/n-med*med)):0 };
};
const amb = bandStat(k => raw[k]);

let f = new Float64Array(NO*NO*NO);
for (let a=0;a<NO;a++) for(let b=0;b<NO;b++) for(let c=0;c<NO;c++){
  const x=(a+0.5-NO/2)*cell, y=(b+0.5-NO/2)*cell, z=(c+0.5-NO/2)*cell;
  const r=Math.hypot(x,y,z); const k=(a*NO+b)*NO+c;
  f[k] = r<RIN ? 0 : (raw[k]-amb.med)*Math.pow(r,POW);   // the outer band is KEPT, it is what sets the floor
}
const blur = (src: Float64Array) => {          // separable [1 2 1], one pass per axis
  let cur = src;
  for (const ax of [0,1,2]) {
    const dst = new Float64Array(src.length), c0 = cur;
    const g = (a:number,b:number,c:number) =>
      (a<0||b<0||c<0||a>=NO||b>=NO||c>=NO) ? 0 : c0[(a*NO+b)*NO+c];
    for (let a=0;a<NO;a++) for(let b=0;b<NO;b++) for(let c=0;c<NO;c++){
      const m = ax===0 ? g(a-1,b,c)+2*g(a,b,c)+g(a+1,b,c)
              : ax===1 ? g(a,b-1,c)+2*g(a,b,c)+g(a,b+1,c)
              :          g(a,b,c-1)+2*g(a,b,c)+g(a,b,c+1);
      dst[(a*NO+b)*NO+c] = m/4;
    }
    cur = dst;
  }
  return cur;
};
let peak0 = 0; for (const v of f) if (Math.abs(v)>peak0) peak0=Math.abs(v);
const snr0 = peak0 / ((amb.sd || 1e-30) * 1.0);
const PASSES = snr0 > 3000 ? 2 : snr0 > 300 ? 3 : snr0 > 60 ? 5 : 7;
for (let i=0;i<PASSES;i++) f = blur(f);
const nb = bandStat(k => f[k]);
const floor = nb.sd || 1e-30;

/*
 * WHERE THE OBJECT ENDS IS A HIGH PERCENTILE OF EACH SHELL, NOT ITS MEAN.
 *
 * A shell's mean divides what the lobes hold by the whole sphere's worth of cells, most of which
 * are between the lobes and empty. The more concentrated the state the worse it reads: 4d's
 * outer shell is unmistakable along the axis and its shell MEAN is barely over the floor, so the
 * edge came out at 0.27 and the frame cut the shell off. What is being asked is "is there
 * anything at this radius", so the answer should come from the brightest part of the shell, not
 * from the average of it with the emptiness beside it.
 */
const NBF = 60, PBIN = 4000;
const bins: Float64Array[] = [], bn = new Int32Array(NBF);
for (let i=0;i<NBF;i++) bins.push(new Float64Array(PBIN));
for (let a=0;a<NO;a++) for(let b=0;b<NO;b++) for(let c=0;c<NO;c++){
  const x=(a+0.5-NO/2)*cell, y=(b+0.5-NO/2)*cell, z=(c+0.5-NO/2)*cell;
  const r=Math.hypot(x,y,z); const i=Math.floor(r/1.2*NBF); if(i>=NBF) continue;
  const v=Math.abs(f[(a*NO+b)*NO+c]);
  if (bn[i]<PBIN) bins[i][bn[i]++]=v;                       // a sample of the shell is enough
  else { const j=(Math.random()*bn[i])|0; if(j<PBIN) bins[i][j]=v; bn[i]++; }
}
let edge = RIN*1.5;
for (let i=0;i<NBF;i++){
  const n=Math.min(bn[i],PBIN); if(!n) continue;
  const v=Array.from(bins[i].subarray(0,n)).sort((p,q)=>p-q);
  const p95=v[Math.floor(n*0.95)];
  if (p95 > 4*floor) edge=(i+1)/NBF*1.2;
}
const RV = HARD || Math.max(0.35, Math.min(RVIEW0, edge*1.10));
const FLOORK = Number(process.env.FLOORK ?? 0.6);
for (let a=0;a<NO;a++) for(let b=0;b<NO;b++) for(let c=0;c<NO;c++){
  const x=(a+0.5-NO/2)*cell, y=(b+0.5-NO/2)*cell, z=(c+0.5-NO/2)*cell;
  const r=Math.hypot(x,y,z); const k=(a*NO+b)*NO+c;
  if (r<RIN || r>RV) { f[k]=0; continue; }
  const v=f[k], m=Math.abs(v)-FLOORK*floor;             // the empty-cell reading, taken out
  f[k] = m>0 ? Math.sign(v)*m : 0;
}
console.log(`ambient = ${amb.med.toExponential(2)} +- ${amb.sd.toExponential(2)}  ` +
            `peak/noise = ${snr0.toFixed(0)}  blur x${PASSES}  ` +
            `floor = ${floor.toExponential(2)}  edge = ${edge.toFixed(3)} -> frame ${RV.toFixed(3)}`);

const nz = Array.from(f).filter(v => Math.abs(v) > 0).map(Math.abs).sort((a,b)=>a-b);
const hi = nz.length ? nz[Math.min(nz.length-1, Math.floor(nz.length*0.995))] : 1;

const sample = (x:number,y:number,z:number) => {   // trilinear
  const a=(x/LOUT+0.5)*NO-0.5, b=(y/LOUT+0.5)*NO-0.5, c=(z/LOUT+0.5)*NO-0.5;
  const a0=Math.floor(a), b0=Math.floor(b), c0=Math.floor(c);
  if(a0<0||b0<0||c0<0||a0+1>=NO||b0+1>=NO||c0+1>=NO) return 0;
  const fa=a-a0, fb=b-b0, fc=c-c0; let s=0;
  for(let i=0;i<2;i++) for(let j=0;j<2;j++) for(let k=0;k<2;k++)
    s += f[((a0+i)*NO+(b0+j))*NO+(c0+k)]
       * (i?fa:1-fa)*(j?fb:1-fb)*(k?fc:1-fc);
  return s;
};

/*
 * ONE COLOUR PER RADIAL SHELL, AND ADJACENT SHELLS OPPOSED.
 *
 * The two humps in the radial profile are the whole point of this state and in a single ramp
 * they are the same colour at the same brightness, so the only thing separating them in the
 * picture is the thin dark gap between - which the line of sight fills in as soon as the volume
 * is projected rather than cut. Integrating THROUGH the object is what makes a shell and the
 * shell inside it overlap on the screen; giving them opposite colours is what unpicks them again.
 *
 * The boundaries are not chosen. The shell-weighted radial mean is measured, smoothed, and its
 * local MINIMA are the divisions - a minimum in <f> r^2 is where the radial distribution passes
 * through its node, which is exactly the thing being separated. So the number of colours in the
 * picture is the number of radial features the field has, and if the field has one, the picture
 * has one.
 *
 * The two ramps are the two ends of the palette the cuts already use - its cool blue and its
 * warm cream - so nothing new is introduced, they are just no longer stacked on one axis.
 */
const RAMPS = [
  [[6,8,14],[20,45,95],[70,130,200],[190,220,245],[240,250,255]],     // cool
  [[6,8,14],[60,32,14],[170,100,34],[250,185,105],[255,242,210]],     // warm
];

const NBR = 96;
const rprof = new Float64Array(NBR), rcnt = new Float64Array(NBR);
for (let a=0;a<NO;a++) for(let b=0;b<NO;b++) for(let c=0;c<NO;c++){
  const x=(a+0.5-NO/2)*cell, y=(b+0.5-NO/2)*cell, z=(c+0.5-NO/2)*cell;
  const r=Math.hypot(x,y,z); const i=Math.floor(r/RV*NBR); if(i>=NBR) continue;
  rprof[i]+=f[(a*NO+b)*NO+c]; rcnt[i]++;
}
const mu = new Float64Array(NBR);
for (let i=0;i<NBR;i++) mu[i]=rcnt[i]?Math.abs(rprof[i]/rcnt[i]):0;
const sm = new Float64Array(NBR);                        // 5-bin smoothing before minima
for (let i=0;i<NBR;i++){ let s=0,k=0;
  for(let d=-2;d<=2;d++){ const j=i+d; if(j<0||j>=NBR) continue; s+=mu[j]; k++; } sm[i]=s/k; }
const peakMu = Math.max(...sm);
const bounds: number[] = [];
for (let i=3;i<NBR-3;i++){
  const r=(i+0.5)/NBR*RV;
  if (r<=RIN) continue;
  if (sm[i]<sm[i-1]&&sm[i]<sm[i-2]&&sm[i]<=sm[i+1]&&sm[i]<sm[i+2]
      && sm[i]<0.5*peakMu && (bounds.length===0 || r-bounds[bounds.length-1]>0.06))
    bounds.push(r);
}
console.log(`shell boundaries at r = ${bounds.map(v=>v.toFixed(3)).join(", ") || "(none)"}`);
const shellOf = (r: number) => { let k=0; while(k<bounds.length && r>bounds[k]) k++; return k; };

/*
 * THE OTHER PARITY, AND IT COMES OUT OF THE FIELD TOO.
 *
 * Radial shells alone leave the axial lobes and the equatorial belt the same colour, because at
 * a given radius they ARE the same shell - what separates them is direction, not distance. So a
 * second division is measured the same way the first was: the field's own angular EXCESS.
 *
 * On a coarse (r, mu, phi) grid the mean at each radius is subtracted, which is the only thing
 * that can be subtracted without saying what shape to expect - it leaves "more here than a
 * sphere would put here" and nothing else. Its sign is the division. For a state whose angular
 * part is a lobe along the axis and a belt around it, that sign is positive on the lobe and
 * negative on the belt, and no Y_lm was written down to get it; had the field come out isotropic
 * the excess would be noise about zero and the second division would not appear.
 *
 * The two parities are then ADDED mod two, so crossing a radial node flips the colour and so
 * does crossing from lobe to belt - the checkerboard a wavefunction's sign makes, read off the
 * density. Two colours, the palette's own cool and warm ends.
 */
const NRA = 40, NMU = 20, NPH = 40;
const asum = new Float64Array(NRA*NMU*NPH), acnt = new Float64Array(NRA*NMU*NPH);
const rsum = new Float64Array(NRA), rcn2 = new Float64Array(NRA);
for (let a=0;a<NO;a++) for(let b=0;b<NO;b++) for(let c=0;c<NO;c++){
  const v=f[(a*NO+b)*NO+c]; if(v===0) continue;
  const x=(a+0.5-NO/2)*cell, y=(b+0.5-NO/2)*cell, z=(c+0.5-NO/2)*cell;
  const r=Math.hypot(x,y,z); const ir=Math.floor(r/RV*NRA); if(ir>=NRA) continue;
  const imu=Math.min(NMU-1,Math.floor((z/r*0.5+0.5)*NMU));
  const iph=Math.min(NPH-1,Math.floor((Math.atan2(y,x)/(2*Math.PI)+0.5)*NPH));
  const k=(ir*NMU+imu)*NPH+iph; asum[k]+=v; acnt[k]++; rsum[ir]+=v; rcn2[ir]++;
}
const exc = new Float64Array(NRA*NMU*NPH);
for (let ir=0;ir<NRA;ir++){ const m=rcn2[ir]?rsum[ir]/rcn2[ir]:0;
  for(let i=0;i<NMU*NPH;i++){ const k=ir*NMU*NPH+i;
    exc[k] = (acnt[k]&&Math.abs(m)>1e-15) ? asum[k]/acnt[k]/m - 1 : 0; } }
const sme = new Float64Array(NRA*NMU*NPH);          // smoothed, phi wraps
for (let ir=0;ir<NRA;ir++) for(let im=0;im<NMU;im++) for(let ip=0;ip<NPH;ip++){
  let s=0,n=0;
  for(let dr=-1;dr<=1;dr++) for(let dm=-1;dm<=1;dm++) for(let dp=-2;dp<=2;dp++){
    const jr=ir+dr, jm=im+dm; if(jr<0||jr>=NRA||jm<0||jm>=NMU) continue;
    const jp=(ip+dp+NPH)%NPH; s+=exc[(jr*NMU+jm)*NPH+jp]; n++; }
  sme[(ir*NMU+im)*NPH+ip]=n?s/n:0;
}
/*
 * THE PARITY IS INTERPOLATED, NOT LOOKED UP. Reading the nearest bin of a 40 x 20 x 40 angular
 * grid puts a hard edge on every bin boundary, and since the boundaries are surfaces of constant
 * r, mu and phi those edges are concentric rings and rectangular patches - which is exactly what
 * the first cutaway drew across its lobes. Interpolating the excess and taking the sign of the
 * RESULT moves the boundary to where the excess actually crosses zero, so the division follows
 * the field instead of the grid.
 */
const angOf = (x:number,y:number,z:number,r:number) => {
  const fr=Math.min(NRA-1.001,Math.max(0,r/RV*NRA-0.5));
  const fm=Math.min(NMU-1.001,Math.max(0,(z/r*0.5+0.5)*NMU-0.5));
  let fp=(Math.atan2(y,x)/(2*Math.PI)+0.5)*NPH-0.5; if(fp<0) fp+=NPH;
  const i0=Math.floor(fr), j0=Math.floor(fm), k0=Math.floor(fp);
  const a1=fr-i0, b1=fm-j0, c1=fp-k0; let v=0;
  for(let i=0;i<2;i++) for(let j=0;j<2;j++) for(let k=0;k<2;k++){
    const ii=Math.min(NRA-1,i0+i), jj=Math.min(NMU-1,j0+j), kk=(k0+k)%NPH;
    v += sme[(ii*NMU+jj)*NPH+kk]*(i?a1:1-a1)*(j?b1:1-b1)*(k?c1:1-c1);
  }
  return v>=0 ? 0 : 1;
};

const colour = (t: number, shell: number) => {
  const st = RAMPS[shell % 2];
  const ff=Math.max(0,Math.min(1,t))*(st.length-1);
  const k0=Math.min(st.length-2,Math.floor(ff)), fr=ff-k0;
  return [0,1,2].map(q=>st[k0][q]+(st[k0+1][q]-st[k0][q])*fr);
};

/* ---- camera: perspective, tilted, z up ---- */
/*
 * HALF OF IT TAKEN AWAY, SO THE INSIDE IS THE SURFACE.
 *
 * A shell hides the shell inside it - that is what a shell is - and no amount of transparency
 * fixes it, because turning the outer one down enough to see through also turns it down enough
 * to stop being visible. A cut is the only way to have both at full strength: everything on one
 * side of a plane through the centre is simply not sampled, and the plane becomes a face.
 *
 * The plane is fixed to the CAMERA, not to the field, so it opens towards the viewer whatever
 * angle is being drawn; and samples lying within a step of it are shaded with the plane's own
 * normal instead of the field's gradient, which is what makes the exposed cross-section read as
 * a cut face rather than as the cloud fading out.
 */
const CUT = Number(process.argv[9] ?? 0);          // 0 whole, 1 half removed, 2 a quarter

const view = (azDeg: number, elDeg: number, name: string) => {
  const az=azDeg*Math.PI/180, el=elDeg*Math.PI/180, DIST=9, FOCAL=DIST/(RV*1.28);
  const ex=DIST*Math.cos(el)*Math.cos(az), ey=DIST*Math.cos(el)*Math.sin(az), ez=DIST*Math.sin(el);
  const fx=-ex/DIST, fy=-ey/DIST, fz=-ez/DIST;                       // forward
  let rx=fy*1-fz*0, ry=fz*0-fx*1, rz=fx*0-fy*0;                      // forward x zhat
  rx=fy; ry=-fx; rz=0; const rn=Math.hypot(rx,ry,rz); rx/=rn; ry/=rn; rz/=rn;
  const ux=ry*fz-rz*fy, uy=rz*fx-rx*fz, uz=rx*fy-ry*fx;              // right x forward
  /* the light sits above and to the left of the camera, so the lit side is the near-top one */
  const lx=-0.45*rx+0.62*ux-0.65*fx, ly=-0.45*ry+0.62*uy-0.65*fy, lz=-0.45*rz+0.62*uz-0.65*fz;
  const ln=Math.hypot(lx,ly,lz);

  const STEPS=520, ds=2*RV/STEPS, K=Number(process.env.OPACITY ?? 2.6);
  /*
   * THE BACKGROUND IS FADED OUT, NOT CUT OFF - the first attempt did cut, and it took the sides
   * with it.
   *
   * A hard threshold at a few times the empty-cell spread is a statement that everything below
   * it is nothing, and for 4d that threshold is a fifth of the peak because the whole object
   * stands only about twelve times over its background. The axial lobes survived it; the
   * equatorial belt, which is the faintest real thing in the picture, did not - and every lobe
   * lost its outskirts, so they came out smaller than they are.
   *
   * So opacity is RAMPED across the noise band instead. Below the floor a sample contributes
   * nothing, above about twice it a sample contributes fully, and in between it fades smoothly.
   * Haze at half the floor still composites to nothing over two hundred samples; a belt at three
   * times the floor comes through at full strength, and the edge of a lobe fades where the field
   * fades rather than where a number was set.
   */
  const GLO = Number(process.env.GLO ?? 0.7)*floor/hi;
  const GHI = Number(process.env.GHI ?? 2.0)*floor/hi;
  const CLIP = Math.max(0.0015, 0.25*GLO);
  const rgb=new Uint8Array(PX*PX*3);
  const eps=cell*1.2;
  for (let py=0; py<PX; py++) {
    for (let px=0; px<PX; px++) {
      const sx=(px-(PX-1)/2)/((PX-1)/2), sy=((PX-1)/2-py)/((PX-1)/2);
      let dx=fx*FOCAL+sx*rx+sy*ux, dy=fy*FOCAL+sx*ry+sy*uy, dz=fz*FOCAL+sx*rz+sy*uz;
      const dn=Math.hypot(dx,dy,dz); dx/=dn; dy/=dn; dz/=dn;
      /* entry / exit of the sphere of radius RV about the origin */
      const b=ex*dx+ey*dy+ez*dz, cq=DIST*DIST-RV*RV, disc=b*b-cq;
      let R=RAMPS[0][0][0], G=RAMPS[0][0][1], B=RAMPS[0][0][2];
      if (disc>0) {
        /*
         * THE FIRST SAMPLE IS JITTERED. Starting every ray exactly at the sphere it enters puts
         * all their sample points on the same concentric shells, and where the field varies
         * between one step and the next that regularity shows as contour rings across the lobes -
         * the onion grain. Offsetting each ray by a fraction of a step scatters the same error
         * into a faint noise instead of into rings, which the eye reads as the smooth surface it
         * is.
         */
        const sq=Math.sqrt(disc); const t1=-b+sq;
        let h=(px*73856093)^(py*19349663); h=(h^(h>>>13))>>>0;
        let t0=-b-sq+(h%1024)/1024*ds;
        let A=0, cr=0, cg=0, cb=0;
        for (let t=t0; t<t1 && A<0.995; t+=ds) {
          const x=ex+dx*t, y=ey+dy*t, z=ez+dz*t;
          const dr=x*rx+y*ry+z*rz, df=-(x*fx+y*fy+z*fz);
          /*
           * THE CUT PLANE FACES THE CAMERA. Removing a side half leaves the exposed face edge-on
           * to the viewer, which shows nothing - the point of a cut is to look ALONG its normal.
           * So it is the NEAR half that goes: everything between the viewer and the mid-plane,
           * leaving a flat cross-section pointing straight out of the screen with the inner
           * shells sitting on it.
           */
          if (CUT===1 && df>0) continue;                 // the near half
          if (CUT===2 && df>0 && dr>0) continue;         // a quarter out of the near-right
          const onFace = CUT>0 && ((CUT===1 && df>-1.6*ds) ||
                                   (CUT===2 && ((df>-1.6*ds&&dr>0)||(dr>-1.6*ds&&df>0))));
          const v=sample(x,y,z); if (v===0) continue;
          const m=Math.abs(v)/hi; if (m<CLIP) continue;
          const tone=Math.pow(Math.min(1,m),0.45);
          const gt = GHI>GLO ? Math.max(0,Math.min(1,(m-GLO)/(GHI-GLO))) : 1;
          const gate = gt*gt*(3-2*gt);                  // smoothstep across the noise band
          const al=Math.min(1, K*tone*gate*ds*(NO/LOUT)/6);
          /* normal from the gradient of the field; flat regions fall back to ambient */
          const gx=sample(x+eps,y,z)-sample(x-eps,y,z),
                gy=sample(x,y+eps,z)-sample(x,y-eps,z),
                gz=sample(x,y,z+eps)-sample(x,y,z-eps);
          const gn=Math.hypot(gx,gy,gz);
          let sh=0.55;
          if (onFace) {
            const useF = CUT===1 || df>dr;               // which of the two faces this is on
            const nx = useF ? -fx : rx, ny = useF ? -fy : ry, nz = useF ? -fz : rz;
            sh = 0.50+0.55*Math.max(0,(nx*lx+ny*ly+nz*lz)/ln);
          } else if (gn>1e-12) {
            const d=(-gx*lx-gy*ly-gz*lz)/(gn*ln);
            sh=0.42+0.58*Math.max(0,d)+0.12*Math.pow(Math.max(0,d),8);
          }
          const rr=Math.hypot(x,y,z);
          const c=colour(tone, shellOf(rr)+angOf(x,y,z,rr));
          const w=(1-A)*al;
          cr+=w*c[0]*sh; cg+=w*c[1]*sh; cb+=w*c[2]*sh; A+=w;
        }
        R=RAMPS[0][0][0]*(1-A)+cr; G=RAMPS[0][0][1]*(1-A)+cg; B=RAMPS[0][0][2]*(1-A)+cb;
      }
      const q=(py*PX+px)*3;
      rgb[q]=Math.max(0,Math.min(255,R))|0;
      rgb[q+1]=Math.max(0,Math.min(255,G))|0;
      rgb[q+2]=Math.max(0,Math.min(255,B))|0;
    }
  }
  mkdirSync(dir,{recursive:true});
  const out=`${dir}/${TAG}-${CHAN}-3D-${name}${CUT?`-cut${CUT}`:""}.png`;
  writeFileSync(out, Buffer.from(png(PX,PX,rgb),"base64"));
  console.log(out);
};

console.log(`${TAG}-${CHAN}  ${NO}^3 over ${LOUT}  scale=${hi.toExponential(3)}  r^${POW}  frame ${RV.toFixed(3)}`);
view(35, 22, "tilt");
view(35, 55, "high");
view(90, 8,  "edge");
