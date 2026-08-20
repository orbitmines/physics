/**
 * THE SAME ORBIT UNDER THREE LAWS — Kepler closing, and the two that do not.
 *
 * One integrator, three metrics, so what differs is the physics. Newton is integrated
 * as Newton rather than as a weak-field metric, because geodesics in A = 1 − 2u with
 * flat space still precess and a baseline that precesses is not a baseline.
 *
 * WHAT IT SHOWS. General relativity and the annihilation count give the SAME advance
 * to four figures — 8.7014·10⁻² against 8.7095·10⁻² per orbit here — which is not a
 * coincidence and is not a success either: `metric/against-relativity` shows the two
 * metrics agree through second order in u, and the perihelion advance is a second
 * order effect. So this figure is evidence that the model passes the classical test,
 * and evidence that the classical test cannot tell the two apart. The place they
 * differ is where the field is strong, which is the shadow.
 */

import { frames, Painter, visual, Surface } from "./CANVAS.ts";
import { COUNTED, Metric, NEWTON, SCHWARZSCHILD, orbit } from "../lib/Orbit.ts";

const BACK = "#08090d";
const FAINT = "#5a5f6e";
const COLOUR: Record<string, string> = {
  "Newton": "#8a8d99",
  "general relativity": "#ff7a45",
  "the count": "#3ddcff",
};

const R0 = 300, KICK = 0.7, TURNS = 5;

const draw = (ms: Metric[]) => {
  const runs = ms.map(m => ({ m, o: orbit(m, R0, KICK, TURNS) }));
  const advance = (peri: number[]) => {
    const d = peri.slice(1).map((a, i) => {
      let x = a - peri[i];
      while (x < -Math.PI) x += 2 * Math.PI;
      while (x > Math.PI) x -= 2 * Math.PI;
      return x;
    });
    return d.length ? d.reduce((a, b) => a + b, 0) / d.length : NaN;
  };

  return (s: Surface) => {
    const { ctx, width, height } = s;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = BACK; ctx.fillRect(0, 0, width, height);

    const k = Math.min(width, height) / (2.25 * R0);
    const cx = width / 2, cy = height / 2;

    /* the mass at the focus */
    ctx.fillStyle = "rgba(200,205,220,0.75)";
    ctx.beginPath(); ctx.arc(cx, cy, 3, 0, 2 * Math.PI); ctx.fill();

    runs.forEach(({ m, o }) => {
      ctx.strokeStyle = COLOUR[m.name] ?? "#888";
      ctx.lineWidth = m.kepler ? 1.9 : 1.2;
      ctx.globalAlpha = m.kepler ? 0.95 : 0.8;
      ctx.beginPath();
      o.path.forEach(([x, y], i) =>
        i ? ctx.lineTo(cx + x * k, cy - y * k) : ctx.moveTo(cx + x * k, cy - y * k));
      ctx.stroke();
      ctx.globalAlpha = 1;
    });

    ctx.font = "11px system-ui, sans-serif";
    ctx.textAlign = "left";
    runs.forEach(({ m, o }, i) => {
      ctx.fillStyle = COLOUR[m.name] ?? "#888";
      const a = advance(o.peri);
      ctx.fillText(
        `${m.name} — ${Math.abs(a) < 5e-3 ? "closes" : `${a.toExponential(4)} rad/orbit`}`,
        12, 16 + i * 15);
    });
    ctx.fillStyle = FAINT;
    ctx.fillText(`${TURNS} orbits, apoapsis ${R0} M`, 12, height - 10);
  };
};

export default [visual({
  id: "orbits.precession", width: 620, height: 620, frames: 300,
  what: "the same orbit under Newton, Schwarzschild and the count — the perihelion " +
    "advance is the difference between them, drawn rather than quoted",
  paint: () => ({ frame: draw([NEWTON, SCHWARZSCHILD, COUNTED]) }),
})];
