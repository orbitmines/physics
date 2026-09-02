/**
 * EVERY MEASUREMENT THE LAW IS JUDGED ON, ON ONE PAIR OF AXES.
 *
 * The four panels beside this one are four pictures of ONE claim, and split up they let a
 * reader believe the law was arranged separately for each. They are not separate: every point
 * in all of them is a pair of accelerations — what the ordinary matter would pull with, and
 * what is actually seen — so they belong on the same two axes and the overlaps are the point.
 *
 *   SPARC's 2,696 rotation points are the cloud. Each is one radius in one galaxy.
 *   THE BARYONIC TULLY–FISHER RELATION IS THE DEEP END OF THAT SAME CLOUD, not another
 *     measurement: `v^4 = GMa_0` is `g = \sqrt{g_N a_0}` read where the gas runs out, so it is
 *     the asymptote drawn through the bottom-left rather than a second law.
 *   GENZEL'S HIGH-REDSHIFT DISCS are six points on the same curve, at the other end.
 *   `a_0` IS THE KNEE, and it is where all three meet.
 *
 * SCALED BY `a_0` ON BOTH AXES, so the curve is universal: nothing in it is per-galaxy, and a
 * reader can see that one line is being asked to pass through every dataset at once.
 *
 * THE LINE IS THE RULES'. It comes from `MODEL.boost`, which evaluates what `Prove` closed off
 * `G.ts` — not a formula written here. Newton is drawn beside it as the diagonal, which is
 * what the same picture says if nothing waits for room.
 */
import { frames, Painter, visual, Surface } from "./CANVAS.ts";
import { boost, a0 as A0, theory as THEORY } from "./LAW.ts";
import { measured, Measured } from "./DATA.ts";
import { RAR, BTFR, baryonicMass } from "../lib/Sparc.ts";
import { G_NEWTON, KPC, MSUN } from "../lib/Transport.ts";

/*
 * THE BORROWED DATA IS SCALED BY ITS OWN a_0, NOT BY THE MODEL'S.
 *
 * The two numbers are not the same and nothing here derives the join between them - `cH` is
 * closed off the rules and the count from it to the measured turnover is not. Dividing a
 * measurement by the model's scale asserts that join silently and lands the whole of SPARC
 * outside the frame. WHAT IS BEING COMPARED IS THE SHAPE: each side in its own units, the knee
 * of one against the knee of the other.
 */
const A0_DATA = 1.2e-10;      // m/s^2, measured - borrowed, and the data's own axis

const BACK = "#08090d", FAINT = "#5a5f6e", GRID = "rgba(120,127,148,0.13)";
const SEEN = "#eef0f5", MODEL = "#4aa8eb", DATA = "#eb964a";
const NEWT = "#eb964a", DISCC = "#c98bd4", BTFRC = "#cd5c5c";   // indianred
/*
 * THE MEASUREMENTS ARE WHITE AND THE MODEL IS COLOURED, and that is the right way round.
 *
 * The region is what the theory ALLOWS; the points are what was seen. The seen thing should be
 * the thing that reads first off the page, with the region as the ground it is read against -
 * so SPARC is white and opaque enough to count, and the band the theory draws sits behind it.
 */
const POINTS = "rgba(255,255,255,0.70)", POINTS_LABEL = "#ffffff";

/** Genzel et al. 2017, Nature 543:397 — borrowed, as everywhere it appears */
const DISCS = [
  { name: "COS4 01351", Mb: 1.7, Re: 7.3 }, { name: "D3a 6397", Mb: 2.3, Re: 7.4 },
  { name: "GS4 43501", Mb: 1.0, Re: 4.9 }, { name: "zC 406690", Mb: 1.7, Re: 5.5 },
  { name: "zC 400569", Mb: 1.7, Re: 3.3 }, { name: "D3a 15504", Mb: 2.1, Re: 6.0 },
];

/**
 * A LABEL LAID ALONG THE LINE IT NAMES — at the angle the line actually has on screen.
 *
 * A key down in the corner makes a reader carry five colours in their head and look back and
 * forth; a word written along a curve is read where the curve is. The angle is measured off
 * the drawn points rather than worked out from the axes, so it stays right whatever the frame
 * does.
 */
const along = (
  s: Surface, at: (t: number) => [number, number], t: number, text: string, colour: string,
  lift = -7, leans: (t: number) => [number, number] = at,
) => {
  const { ctx } = s;
  /*
   * WHERE IT SITS AND WHICH WAY IT LEANS ARE TWO PATHS, and they were one.
   *
   * A label wants to lie along what it names, and it wants to be clear of it. Those were the
   * same curve while the possibilities were a line. Now the region has a WIDTH, so the place to
   * sit is its upper edge - and that edge is a boundary read off a grid, which is jagged, and
   * an angle taken from two nearby points on it comes out wherever the last cell fell. So the
   * lean is taken from the smooth curve the band follows and the position from the edge.
   */
  const [x0, y0] = leans(t - 0.01), [x1, y1] = leans(t + 0.01), [cx, cy] = at(t);
  const a = Math.atan2(y1 - y0, x1 - x0);
  ctx.save();
  ctx.translate(cx, cy); ctx.rotate(a);
  ctx.font = "11px ui-monospace, monospace";
  ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
  /* a dark rule under the words so a line does not run through them */
  const w = ctx.measureText(text).width;
  ctx.fillStyle = BACK; ctx.fillRect(-w / 2 - 4, lift - 9, w + 8, 12);
  ctx.fillStyle = colour; ctx.fillText(text, 0, lift);
  ctx.restore();
  ctx.textBaseline = "alphabetic";
};

const lawAt = (lx: number): number => {
  const a0 = A0();
  return Math.log10(boost(Math.pow(10, lx) * a0, a0) / a0);
};

/**
 * THE CURVE, CARRYING HOW MUCH OF THE POSSIBLE LANDS ON EACH PART OF IT.
 *
 * `a_{0}` is the ambient one, so what is felt is a FUNCTION of what arrives - the possibilities
 * do not fill an area, they fill a LINE, and asking for a cloud is asking the theory for a
 * scatter it does not have. What varies along that line is HOW MUCH of the configuration space
 * reaches each part of it, and `MEASURE` has integrated exactly that: for every arrival, the
 * radius that reaches it, weighted by one over how fast the arrival moves with radius, summed
 * over every mass and every face. A change of variables against the algebra's own derivative
 * of the closed form `curvesOfEach` gives.
 *
 * SO NOTHING IS PUSHED FORWARD OR BINNED HERE. The version before this scattered a grid of
 * galaxies into the plane and counted where they landed - the same integral done with noise and
 * a histogram, needing a caustic rule and a column rescaling before it looked like anything.
 * This reads what was solved.
 */
/**
 * WHICH FREEDOM A CELL NEEDS — asked by taking each one away, so no order decides it.
 *
 * Adding them up in some order credits whichever went first with everything the later ones
 * could also have done, and leaves the last with only its leftovers. `MEASURE` instead runs
 * the whole sweep and then runs it again with one freedom held still: a cell that was
 * reachable and now is not NEEDS that freedom, whatever else is free.
 *
 * So the first colour is where nothing in particular is needed - several arrangements reach
 * it - the middle four are where exactly one is, and the last is where two are needed at once.
 */
const SEVERAL: [number, number, number] = [86, 168, 235];
const FREEDOM: [string, [number, number, number]][] = [
  ["mass", [232, 193, 90]],
  ["face", [90, 212, 193]],
  ["moving", [240, 122, 178]],          // pink
  ["radiating", [169, 139, 224]],
];

/**
 * AND A COMBINATION IS THE COLOURS OF WHAT IS IN IT, MIXED.
 *
 * `by` carries the SET of freedoms a cell needs, a bit apiece. Painting every set of two as
 * one flat "needs two" threw away which two, and mass-and-face is a different claim about a
 * galaxy from mass-and-what-it-radiates. Mixing means a pair sits between its parts, so a
 * region reads as belonging to both of them without a key having to be memorised.
 */
const tintOf = (mask: number): [number, number, number] => {
  if (!mask) return SEVERAL;
  let r = 0, g = 0, b = 0, n = 0;
  for (let k = 0; k < FREEDOM.length; k++) if (mask & (1 << k)) {
    const [cr, cg, cb] = FREEDOM[k][1]; r += cr; g += cg; b += cb; n++;
  }
  return n ? [r / n, g / n, b / n] : SEVERAL;
};
const nameOf = (mask: number): string => {
  if (!mask) return "several ways";
  const parts: string[] = [];
  for (let k = 0; k < FREEDOM.length; k++) if (mask & (1 << k)) parts.push(FREEDOM[k][0]);
  return "needs " + parts.join(" + ");
};

const spreadOf = (data: Measured) => {
  const { x, y, p } = data.columns;
  const g = (data.header as any).grid as
    { arrives: { from: number; to: number; n: number };
      felt: { from: number; to: number; n: number } };
  let most = 0;
  for (const v of p) if (Number.isFinite(v) && v > most) most = v;
  return { x, y, p, g, most };
};

/**
 * THE TOP OF THE REGION AT A GIVEN ARRIVAL — so a label can sit above it rather than in it.
 *
 * The band's width is a RESULT and it moves whenever the rules do: it is a decade across at
 * the knee and almost nothing out at the ends. A label lifted by a fixed number of pixels was
 * fine when the possibilities were a line and is wrong now, and picking a bigger number would
 * be wrong again the next time the region changes shape. So the label asks the region where
 * its edge is.
 */
const ceilingOf = (data: Measured) => {
  const { x, y, p } = data.columns;
  const g = (data.header as any).grid as
    { arrives: { from: number; to: number; n: number }; felt: { n: number } };
  const XS = g.arrives.n, YS = g.felt.n;
  const dx = (g.arrives.to - g.arrives.from) / (XS - 1);
  const top = new Float64Array(XS).fill(NaN);
  for (let gx = 0; gx < XS; gx++) {
    for (let gy = YS - 1; gy >= 0; gy--) {
      if (p[gy * XS + gx] > 0) { top[gx] = y[gy * XS + gx]; break; }
    }
  }
  return (lx: number, fallback: number) => {
    const gx = Math.round((lx - g.arrives.from) / dx);
    if (gx < 0 || gx >= XS || !Number.isFinite(top[gx])) return fallback;
    return Math.max(top[gx], fallback);
  };
};

const panel = (data: Measured, what: string) => (s: Surface) => {
  const { ctx } = s;
  ctx.fillStyle = BACK; ctx.fillRect(0, 0, s.width, s.height);
  ctx.font = "12px ui-monospace, monospace";

  const a0 = A0();
    const box = { x0: 92, x1: s.width - 26, y0: 82, y1: s.height - 76 };
  /* both axes in units of a_0, four decades below the knee and three above */
  const XMIN = -4, XMAX = 3, YMIN = -3, YMAX = 3;
  const X = (l: number) => box.x0 + (l - XMIN) / (XMAX - XMIN) * (box.x1 - box.x0);
  const Y = (l: number) => box.y1 - (l - YMIN) / (YMAX - YMIN) * (box.y1 - box.y0);

  /* ── grid ─────────────────────────────────────────────────────────────── */
  ctx.strokeStyle = GRID; ctx.lineWidth = 1;
  ctx.fillStyle = FAINT; ctx.textAlign = "center";
  for (let l = XMIN; l <= XMAX; l++) {
    ctx.beginPath(); ctx.moveTo(X(l), box.y0); ctx.lineTo(X(l), box.y1); ctx.stroke();
    ctx.fillText(`10^${l}`, X(l), box.y1 + 17);
  }
  ctx.textAlign = "right";
  for (let l = YMIN; l <= YMAX; l++) {
    ctx.beginPath(); ctx.moveTo(box.x0, Y(l)); ctx.lineTo(box.x1, Y(l)); ctx.stroke();
    ctx.fillText(`10^${l}`, box.x0 - 8, Y(l) + 4);
  }

  /*
   * ── AND WHAT TULLY–FISHER ACTUALLY TESTS, which is the asymptote's HEIGHT ──
   *
   * EACH GALAXY IS A LINE ON THESE AXES, not a point and not a tick. It gives a flat speed and
   * a mass and no radius, but the radius cancels: `g_bar = GM/r^2` and `g_obs = v_f^2/r`
   * together give
   *
   *     \log(g_obs/a_0) = \frac{1}{2}\log(g_bar/a_0) + \frac{1}{2}\log(a_0^{gal}/a_0),
   *     a_0^{gal} = v_f^4/GM
   *
   * so it runs PARALLEL TO THE DEEP ASYMPTOTE, lifted by half its own scale's offset from the
   * theory's. Drawing all of them is drawing the relation: a band whose width is the scatter
   * and whose height against the drawn asymptote is the normalisation - which is the whole of
   * what Tully-Fisher has to say and the one thing a rug of ticks at one radius could not.
   */
  const implied: number[] = [];
  for (const g of BTFR as any[]) {
    const M = baryonicMass(g), v = g.vf * 1000;
    if (!(M > 0) || !(v > 0)) continue;
    implied.push(Math.log10((v * v * v * v) / (G_NEWTON * M) / A0_DATA));
  }
  implied.sort((p, q) => p - q);
  const med = implied.length ? implied[implied.length >> 1] : NaN;
  /*
   * AND THEY FADE OUT RATHER THAN STOPPING DEAD, because the relation they draw does.
   *
   * `v_f^4 = GMa_0` is the DEEP limit - it is what the law comes to where the medium is thin,
   * and it says nothing at all above the knee. A line ruled to `g_bar = a_0` and cut there
   * looks like a measurement that ends; a line that thins out as it approaches is the same
   * statement drawn honestly, which is that it stops applying before it stops being drawn.
   */
  ctx.lineWidth = 1;
  for (const o of implied) {
    const g = ctx.createLinearGradient(X(XMIN), 0, X(0.2), 0);
    g.addColorStop(0, "rgba(205,92,92,0.62)");
    g.addColorStop(0.62, "rgba(205,92,92,0.40)");
    g.addColorStop(1, "rgba(205,92,92,0)");
    ctx.strokeStyle = g;
    ctx.beginPath();
    ctx.moveTo(X(XMIN), Y(0.5 * (XMIN + o)));
    ctx.lineTo(X(0.2), Y(0.5 * (0.2 + o)));
    ctx.stroke();
  }

  /*
   * ── WHERE THE MODEL SAYS GALAXIES ARE, before any measurement is drawn ──
   *
   * AN AREA, and that it is one rather than a line is a result and not a choice. What is felt
   * depends on what arrives AND on the scale, and `crossing` derives that scale as the medium
   * a carrier crossed getting there - which depends on how heavy the body is, how wide a face
   * it shows and how far out the probe sits. Had that come out the same for every body the
   * width would be nought here on its own.
   *
   * FAINTER WHERE LESS OF THE POSSIBLE LANDS. Each cell carries how much of the configuration
   * space maps into it, so the edges are where few arrangements reach and the middle is where
   * most do - it falls away from the ridge because fewer galaxies land there, not because
   * anything was drawn to fall away.
   */
  {
    const { x, y, p, g, most } = spreadOf(data);
    if (most > 0) {
      const wpx = (box.x1 - box.x0) / (g.arrives.n - 1) *
        (g.arrives.to - g.arrives.from) / (XMAX - XMIN);
      const hpx = (box.y1 - box.y0) / (g.felt.n - 1) * (g.felt.to - g.felt.from) / (YMAX - YMIN);
      /*
       * READ IN THE LOGARITHM, because the density spans orders of magnitude.
       *
       * Almost all of the weight sits on a narrow ridge and the rest of the region carries
       * thousandths of it. Scaled straight, the ridge is the only thing with a value and
       * everywhere else is one flat wash - which is what made a real variation look like a
       * monotone block. Taken in the logarithm, a floor of four decades below the peak, the
       * whole range has somewhere to sit.
       *
       * AND IT IS DIM, and behind. It is the model's claim about where galaxies COULD be, and
       * the measurements are the thing being judged - so the measurements are what should read
       * first, and the region is the ground they are read against.
       */
      /*
       * READ BY RANK, not by value — which is the only mapping that shows what is there.
       *
       * The density spans five decades, but FOUR CELLS IN FIVE sit inside two of them. Any
       * fixed ramp - straight or logarithmic - spends most of its range on decades that are
       * nearly empty and squeezes the bulk into a corner of it, which is why a real variation
       * kept coming out as one flat wash. Sorting the live cells and colouring by POSITION IN
       * THAT ORDER gives every part of the ramp the same number of cells, so whatever
       * structure the bulk has is what the eye gets.
       *
       * It preserves order and not spacing: darker still means fewer arrangements reach here,
       * but the steps between shades are not equal amounts of weight. The `.f32` beside the
       * picture holds the actual numbers.
       */
      const live: number[] = [];
      for (const v of p) if (v > 0) live.push(v);
      live.sort((u, w) => u - w);
      const rank = (v: number) => {
        let lo = 0, hi = live.length;
        while (lo < hi) { const mid = (lo + hi) >> 1; live[mid] < v ? lo = mid + 1 : hi = mid; }
        return lo / live.length;
      };
      const by = data.columns.by;
      for (let i = 0; i < p.length; i++) {
        if (!(p[i] > 0)) continue;
        const t = rank(p[i]);
        const px = X(x[i]), py = Y(y[i]);
        if (px < box.x0 - wpx || px > box.x1 || py < box.y0 || py > box.y1 + hpx) continue;
        /*
         * THE HUE SAYS WHICH FREEDOM PUT THE CELL THERE, and the strength says how much of the
         * possible lands in it - two different questions on the one picture.
         *
         * AND THE STRENGTH IS SQUARED. Ranked flat, every shade carries the same number of
         * cells and the dense ridge is no brighter than the sparse outskirts, which is exactly
         * the flatness that made this look like a block. Squaring holds the faint parts down
         * near the floor and lets the crowded middle stand out, while a rank still decides the
         * order - so the region reads as background and its dense part reads as a claim.
         */
        const [r, gg, bl] = tintOf(by ? Math.round(by[i]) : 0);
        const k = 0.30 + 0.70 * t * t;                 // dim, and stark only where it is dense
        ctx.fillStyle = `rgba(${Math.round(r * k)},${Math.round(gg * k)},` +
          `${Math.round(bl * k)},${(0.10 + 0.55 * t * t).toFixed(3)})`;
        ctx.fillRect(px - wpx / 2, py - hpx / 2, wpx + 1, hpx + 1);
      }
    }
  }

  /* ── SPARC: every rotation point, which is every rotation curve at once ── */
  ctx.fillStyle = POINTS;
  let shown = 0;
  for (const p of RAR) {
    if (!(p.gbar > 0) || !(p.gobs > 0)) continue;
    const x = X(Math.log10(p.gbar / A0_DATA)), y = Y(Math.log10(p.gobs / A0_DATA));
    if (x < box.x0 || x > box.x1 || y < box.y0 || y > box.y1) continue;
    ctx.fillRect(x - 0.7, y - 0.7, 1.4, 1.4); shown++;
  }

  /* ── Newton, if nothing ever waited for room ───────────────────────────── */
  ctx.strokeStyle = NEWT; ctx.lineWidth = 1.5; ctx.setLineDash([6, 5]);
  ctx.beginPath(); ctx.moveTo(X(XMIN), Y(XMIN)); ctx.lineTo(X(XMAX), Y(XMAX)); ctx.stroke();
  ctx.setLineDash([]);

  /* ── the deep asymptote, which IS the Tully–Fisher relation ────────────── */
  ctx.strokeStyle = BTFRC; ctx.lineWidth = 1.5; ctx.setLineDash([2, 4]);
  ctx.beginPath();
  for (let l = XMIN; l <= XMAX; l += 0.05) {
    const y = 0.5 * l;                       // g = sqrt(g_N a_0)  ->  half the slope
    const px = X(l), py = Y(y);
    l === XMIN ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.stroke(); ctx.setLineDash([]);

  /* ── AND THE LAW, evaluated out of the store ───────────────────────────── */
  ctx.strokeStyle = MODEL; ctx.lineWidth = 3;
  ctx.beginPath();
  for (let l = XMIN; l <= XMAX; l += 0.02) {
    const px = X(l), py = Y(lawAt(l));
    l === XMIN ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.stroke();

  /* ── the six high-redshift discs, on the same curve ────────────────────── */
  for (const d of DISCS) {
    const gN = G_NEWTON * d.Mb * 1e11 * MSUN / Math.pow(d.Re * KPC, 2);
    /* the disc's own arrival on the data's axis, and what the law makes of it - so the six
     * sit where the measurement puts them rather than where the model's scale would */
    const lx = Math.log10(gN / A0_DATA);
    const x = X(lx), y = Y(lawAt(lx));
    ctx.fillStyle = DISCC; ctx.beginPath(); ctx.arc(x, y, 4, 0, 7); ctx.fill();
    ctx.strokeStyle = BACK; ctx.lineWidth = 1.2; ctx.stroke();
  }

  /* ── frame and legend ──────────────────────────────────────────────────── */
  ctx.strokeStyle = "#1b2130"; ctx.lineWidth = 1;
  ctx.strokeRect(box.x0, box.y0, box.x1 - box.x0, box.y1 - box.y0);

  ctx.textAlign = "left"; ctx.fillStyle = SEEN; ctx.font = "13px ui-monospace, monospace";
  ctx.fillText(what, box.x0, 26);
  ctx.font = "11px ui-monospace, monospace"; ctx.fillStyle = FAINT;
  ctx.fillText("each side in its own a₀ — the model's " + a0.toExponential(3) +
    ", the data's 1.2e-10 m/s². blue: the density along the curve, integrated", box.x0, 41);

  /*
   * ── NAMED WHERE THEY ARE ─────────────────────────────────────────────────
   *
   * AND GENERAL RELATIVITY IS NOT DRAWN SEPARATELY, because it would be the same pixels.
   * At a galaxy's accelerations its correction to Newton is of order v²/c² — about 10⁻⁶ here,
   * a millionth of a decade, some ten thousand times finer than the line is wide. It is said
   * on the diagonal rather than drawn under it, because a curve a reader cannot distinguish
   * from another is worse than a sentence.
   */
  along(s, t => [X(t), Y(t)], -2.2, "Newton + GR", NEWT, -9);
  /* the cloud and the band say what they are where they are, so the key underneath is only
     for what a word beside a line cannot carry - the counts and the offset */
  const ceiling = ceilingOf(data);
  /* both of these rode the law curve and are now inside the band, so they ride its top edge */
  const onLaw = (t: number): [number, number] => [X(t), Y(lawAt(t))];
  along(s, t => [X(t), Y(ceiling(t, lawAt(t)))], -1.15,
    "SPARC rotation points", POINTS_LABEL, -14, onLaw);
  along(s, t => [X(t), Y(0.5 * (t + (Number.isFinite(med) ? med : 0)))], -3.05,
    "Tully–Fisher", BTFRC, -9);
  /* the six discs sit in a short run on the curve, so the name goes above the middle of them */
  {
    const ds = DISCS.map(d =>
      Math.log10(G_NEWTON * d.Mb * 1e11 * MSUN / Math.pow(d.Re * KPC, 2) / A0_DATA));
    ds.sort((p, q) => p - q);
    const mid = ds[ds.length >> 1];
    along(s, t => [X(t), Y(ceiling(t, lawAt(t)))], mid,
      "Genzel high-z discs", DISCC, -14, onLaw);
  }
  along(s, t => [X(t), Y(ceiling(t, lawAt(t)))], 2.3, THEORY(), MODEL, -10, onLaw);
  along(s, t => [X(t), Y(0.5 * t)], 2.0, "deep limit  g = √(g_N a₀)", BTFRC, 11);

  /*
   * WHAT EACH COLOUR MEANS, READ OFF THE DATA RATHER THAN LISTED.
   *
   * Which combinations actually occur is a result, and a fixed key would either miss one or
   * name several that never happen. So the sets present are counted and the ones that carry
   * the region are named, largest first, in the colour they are drawn in.
   */
  {
    const by = data.columns.by, pp = data.columns.p;
    const tally = new Map<number, number>();
    if (by) for (let i = 0; i < pp.length; i++) if (pp[i] > 0) {
      const m = Math.round(by[i]); tally.set(m, (tally.get(m) ?? 0) + 1);
    }
    const total = [...tally.values()].reduce((a, b) => a + b, 0) || 1;
    /*
     * EVERY SINGLE FREEDOM IS NAMED, then the largest combinations that fit.
     *
     * Ranking purely by size drops the small ones, and the small ones are the ones a reader
     * cannot work out from the mixes - a combination's colour is readable only once its parts
     * have been shown. So the four singles come first whether they are large or not, and the
     * pairs fill whatever room is left.
     */
    const ranked = [...tally.entries()].sort((a, b) => b[1] - a[1]);
    const singles = ranked.filter(([m]) => m === 0 || (m & (m - 1)) === 0);
    const rest = ranked.filter(([m]) => m !== 0 && (m & (m - 1)) !== 0);
    const shownSets = [...singles, ...rest];
    ctx.font = "10px ui-monospace, monospace"; ctx.textAlign = "left";
    let lx = box.x0;
    ctx.fillStyle = FAINT;
    const intro = "coloured by which freedoms a cell NEEDS:  ";
    ctx.fillText(intro, lx, box.y0 - 8); lx += ctx.measureText(intro).width;
    for (const [mask, n] of shownSets) {
      const [r, g, b] = tintOf(mask);
      /* the intro already says these are what a cell NEEDS, so the word is not repeated */
      const label = `${nameOf(mask).replace(/^needs /, "")} ${(100 * n / total).toFixed(0)}%`;
      if (lx + ctx.measureText(label).width + 14 > box.x1) break;
      ctx.fillStyle = `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
      ctx.fillRect(lx, box.y0 - 16, 8, 8); lx += 11;
      ctx.fillText(label, lx, box.y0 - 8); lx += ctx.measureText(label).width + 10;
    }
  }

  const key: [string, string][] = [
    [POINTS, `SPARC rotation points — ${shown} of ${RAR.length} in frame (borrowed)`],
    [BTFRC, `Tully–Fisher: ${implied.length} galaxies, one line each (a₀ = v_f⁴/GM), ` +
      `median ${Number.isFinite(med) ? (med >= 0 ? "+" : "") + med.toFixed(2) : "—"} dex ` +
      `from the theory's`],
    [DISCC, "Genzel high-z discs (borrowed)"],
  ];
  let ky = box.y1 + 52;
  ctx.font = "11px ui-monospace, monospace";
  for (const [c, t] of key) {
    ctx.fillStyle = c; ctx.fillRect(box.x0, ky - 7, 9, 9);
    ctx.fillStyle = FAINT; ctx.fillText(t, box.x0 + 15, ky + 1);
    ky += 15;
    if (ky > s.height - 8) break;
  }

  ctx.fillStyle = FAINT; ctx.textAlign = "center";
  ctx.fillText("g_baryons / a₀", (box.x0 + box.x1) / 2, box.y1 + 34);
  ctx.save(); ctx.translate(16, (box.y0 + box.y1) / 2); ctx.rotate(-Math.PI / 2);
  ctx.fillText("g_observed / a₀", 0, 0); ctx.restore();
  ctx.textAlign = "left";
};

export default [
  visual({ id: "galaxy.point", width: 960, height: 660, frames: 1,
    what: "a galaxy as ONE source - the whole of its mass behind one face, so what it sends " +
      "saturates at the face. Where the model puts galaxies, against every measurement",
    paint: frames(() => panel(measured("galaxy.point"), "A GALAXY AS ONE SOURCE")) }),
  visual({ id: "galaxy.many", width: 960, height: 660, frames: 1,
    what: "and as its stars - each thin enough to send all of itself, so what is sent is the " +
      "total mass. The same axes, the same law, the other limit of the skin",
    paint: frames(() => panel(measured("galaxy.many"), "A GALAXY AS MANY SOURCES, ONE PER STAR")) }),
];
