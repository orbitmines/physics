/**
 * HOW FAST A SOURCE IS GOING, READ OUT OF THE SPACE AROUND IT - and the reason nothing
 * needs to be told.
 *
 * THIS THEOREM EXISTS TO RETIRE A DECLARATION. A magnetic field in this model is
 * Σ q (d̂ × u) summed over the exits, and until now the u in it came from `Source.u` - a
 * field somebody sets when they build the world. Nothing in the dynamics writes it and
 * nothing checks it against where the source ends up, since what moves a structure is the
 * momentum the vacuum handed it. So the field was being computed from a number the model
 * neither produces nor validates, carried to the point of use on a per-ray tag.
 *
 * AND IT NEED NOT BE, BECAUSE XOR ALREADY WRITES THE VELOCITY INTO SPACE. Two rules do it
 * between them, both there for other reasons: EMISSION alternates the sign a source puts
 * out, and MOVEMENT carries a ray one cell a tick. A front emitted at one tick is, later,
 * as far from where the source stood as the time between them - and the source has moved
 * on since. So consecutive fronts of the same sign are a period's worth of travel apart,
 * less a period's worth of the source's own displacement along that direction: compressed
 * ahead of the motion and stretched behind it.
 *
 * WHICH IS A DOPPLER SHIFT, and read the other way round it is a measurement anyone can
 * take: the spacing between sign reversals at a place gives the component of the source's
 * velocity along the line to it. Locally - one place, one period, without knowing which
 * source it came from - and it is the velocity the source ACTUALLY has, because it is the
 * displacement that shifted the fronts.
 *
 * SO THE DECLARED NUMBER IS THE WEAKER OF THE TWO and can go. What replaces it is not a
 * second implementation somewhere else: it is this theorem, looked up through
 * `theory.theorems` by whatever wants to draw a field. A derivation used by a reader has
 * to BE the derivation, or the two drift apart with nothing to notice.
 */
import { Theorem } from "../Theorem.ts";
import { CBAR, CLOSING, PULSE, WAVELENGTH, doppler } from "../probes/doppler.ts";

export const drift: Theorem = {
  id: "matter.drift",
  asks: "a source alternates its sign and its rays leave one cell a tick. What does the " +
    "spacing between sign reversals say about how fast it is going?",
  about: CLOSING,
  probes: [doppler],
  wants: [
    { kind: "equals", of: WAVELENGTH, to: [] },
  ],
  glossary: {
    [CLOSING]: { symbol: "\\delta \\cdot \\hat{n}",
      says: "how fast the source is going along the line to here - the thing a magnetic field needs and used to be told" },
    [WAVELENGTH]: { symbol: "\\lambda(\\hat{n})",
      says: "the spacing between sign reversals along that direction" },
    [PULSE]: { symbol: "pulse period",
      says: "how long the source takes to come back to the sign it started with" },
    [CBAR]: { symbol: "\\bar{c}", says: "one cell a tick" },
  },
};
