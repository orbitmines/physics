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
import { boost, A0, THEORY } from "./MODEL.ts";
import { RAR, BTFR, baryonicMass } from "../lib/Sparc.ts";
import { G_NEWTON, KPC, MSUN } from "../lib/Transport.ts";

const BACK = "#08090d", FAINT = "#5a5f6e", GRID = "rgba(120,127,148,0.13)";
const SEEN = "#eef0f5", MODEL = "#4aa8eb", DATA = "#eb964a";
const NEWT = "#eb964a", DISCC = "#c98bd4", BTFRC = "#8bd48b";
const POINTS = "rgba(150,157,178,0.34)", POINTS_LABEL = "#9aa0b4";

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
  lift = -7,
) => {
  const { ctx } = s;
  const [x0, y0] = at(t - 0.01), [x1, y1] = at(t + 0.01), [cx, cy] = at(t);
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

const panel = (s: Surface) => {
  const { ctx } = s;
  ctx.fillStyle = BACK; ctx.fillRect(0, 0, s.width, s.height);
  ctx.font = "12px ui-monospace, monospace";

  const a0 = A0();
  const box = { x0: 92, x1: s.width - 26, y0: 54, y1: s.height - 76 };
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
    implied.push(Math.log10((v * v * v * v) / (G_NEWTON * M) / a0));
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
    g.addColorStop(0, "rgba(139,212,139,0.13)");
    g.addColorStop(0.62, "rgba(139,212,139,0.08)");
    g.addColorStop(1, "rgba(139,212,139,0)");
    ctx.strokeStyle = g;
    ctx.beginPath();
    ctx.moveTo(X(XMIN), Y(0.5 * (XMIN + o)));
    ctx.lineTo(X(0.2), Y(0.5 * (0.2 + o)));
    ctx.stroke();
  }

  /* ── SPARC: every rotation point, which is every rotation curve at once ── */
  ctx.fillStyle = POINTS;
  let shown = 0;
  for (const p of RAR) {
    if (!(p.gbar > 0) || !(p.gobs > 0)) continue;
    const x = X(Math.log10(p.gbar / a0)), y = Y(Math.log10(p.gobs / a0));
    if (x < box.x0 || x > box.x1 || y < box.y0 || y > box.y1) continue;
    ctx.fillRect(x - 1, y - 1, 2, 2); shown++;
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
    const gN = Math.pow(10, l) * a0;
    const px = X(l), py = Y(Math.log10(boost(gN, a0) / a0));
    l === XMIN ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.stroke();

  /* ── the six high-redshift discs, on the same curve ────────────────────── */
  for (const d of DISCS) {
    const gN = G_NEWTON * d.Mb * 1e11 * MSUN / Math.pow(d.Re * KPC, 2);
    const x = X(Math.log10(gN / a0)), y = Y(Math.log10(boost(gN, a0) / a0));
    ctx.fillStyle = DISCC; ctx.beginPath(); ctx.arc(x, y, 4, 0, 7); ctx.fill();
    ctx.strokeStyle = BACK; ctx.lineWidth = 1.2; ctx.stroke();
  }

  /* ── frame and legend ──────────────────────────────────────────────────── */
  ctx.strokeStyle = "#1b2130"; ctx.lineWidth = 1;
  ctx.strokeRect(box.x0, box.y0, box.x1 - box.x0, box.y1 - box.y0);

  ctx.textAlign = "left"; ctx.fillStyle = SEEN; ctx.font = "13px ui-monospace, monospace";
  ctx.fillText("ONE LAW, EVERY MEASUREMENT", box.x0, 26);
  ctx.font = "11px ui-monospace, monospace"; ctx.fillStyle = FAINT;
  ctx.fillText("both axes in units of a₀ = cH₀/2π = " + a0.toExponential(3) + " m/s²  —  " +
    "cH₀ is closed off the rules; the 2π is not, and is the one count G has no rule for",
    box.x0, 41);

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
  along(s, t => [X(t), Y(Math.log10(boost(Math.pow(10, t) * a0, a0) / a0))], -1.15,
    "SPARC rotation points", POINTS_LABEL, -16);
  along(s, t => [X(t), Y(0.5 * (t + (Number.isFinite(med) ? med : 0)))], -3.05,
    "Tully–Fisher", BTFRC, -9);
  /* the six discs sit in a short run on the curve, so the name goes above the middle of them */
  {
    const ds = DISCS.map(d =>
      Math.log10(G_NEWTON * d.Mb * 1e11 * MSUN / Math.pow(d.Re * KPC, 2) / a0));
    ds.sort((p, q) => p - q);
    const mid = ds[ds.length >> 1];
    along(s, t => [X(t), Y(Math.log10(boost(Math.pow(10, t) * a0, a0) / a0))], mid,
      "Genzel high-z discs", DISCC, -14);
  }
  along(s, t => [X(t), Y(Math.log10(boost(Math.pow(10, t) * a0, a0) / a0))], 2.3,
    THEORY, MODEL, -10);
  along(s, t => [X(t), Y(0.5 * t)], 2.0, "deep limit  g = √(g_N a₀)", BTFRC, 11);

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
  visual({ id: "curves.all", width: 960, height: 660, frames: 1,
    what: "every measurement the law is judged on, on one pair of axes — " +
      "SPARC, Tully–Fisher and the high-z discs against one line out of the rules",
    paint: frames(() => panel) }),
];
