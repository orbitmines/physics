/**
 * THE NOTATION AS COMPONENTS - and this file does not import React.
 *
 * WHAT A CONSUMER WANTS is to write `<Eq><V>a</V> = <K>DEG</K></Eq>` in their own
 * `.tsx`. WHAT THIS PACKAGE MUST NOT BECOME is something that only builds if you have a
 * view library and a JSX transform. The core is a handful of files with NO dependencies,
 * checked with neither `dom` nor `node`, and that property is the whole reason the
 * package was cut out of the research repository in the first place. A `react` in
 * `dependencies` undoes it; a `peerDependency` undoes it more quietly, by making
 * `npm install` warn at anyone who wanted the theory and not the typesetting.
 *
 * BOTH AT ONCE, BECAUSE JSX IS A CALLING CONVENTION AND NOT A LANGUAGE. `<Eq of={x}/>`
 * compiles, in the CONSUMER'S build, to `jsx(Eq, { of: x })`. All `Eq` has to be, for
 * that to work, is a function from props to a node. It does not have to be WRITTEN in
 * JSX and it does not have to have been built against the same React - nothing
 * downstream can tell. So the components are built by `notation(React)`, which takes the
 * runtime as an argument:
 *
 *     // one file in the consumer, once
 *     import * as React from "react";
 *     import { notation } from "@orbitmines/physics/notation";
 *
 *     export const { Eq, V, K, Bar, Frac, Sub, Sup, Markup } = notation(React);
 *
 * and from there `<Eq>`, `<V>`, `<K>` are ordinary components in ordinary JSX. What this
 * buys:
 *
 *   - NO DEPENDENCY, not a real one and not a peer one. This file names no module. It
 *     asks for eight functions by shape - `createElement`, `Fragment`, `Children`,
 *     `isValidElement`, `useState`, `useRef`, `useEffect` - and anything providing them
 *     works, which includes Preact's compat layer and whatever React the consumer is
 *     already on. There is exactly one React in the tree because the consumer passed the
 *     one they have.
 *   - NO `@types/react` EITHER. `Runtime` below is structural and generic in the node
 *     type, so the types come out of the consumer's own React at the call site.
 *   - NO `.tsx` IN THIS PACKAGE, so no `"jsx"` compiler option and no `jsx-runtime`
 *     import in anything shipped.
 *
 * WHAT IS HERE is the notation the article is set in - `V`, `K`, `R`, `F`, `D`, `B`,
 * `Sub`, `Sup`, `Frac`, `Type`, `Paren`, `Hat`, `Bar`, `Eq`, `Head`, `Rows`, `Step`,
 * `Because`, `Note` - lifted from `orbitmines.com`'s `Physics/LAW.tsx`, which is where
 * they were written and which can now import them from here instead of keeping them.
 * The sixteen `Derivation` records that sat in the same file are NOT here: those are
 * prose about this theory, and prose belongs to the article.
 *
 * AND `Markup`, which is the piece that only makes sense on this side. The proofs this
 * repository emits carry their statements as ASCII - `\bar{r}^{D-1}` - because a
 * combining macron is a tofu box on half the phones that will read them. `Notation.ts`
 * parses that; `html()` sets it for a standalone page; `Markup` sets the same parse into
 * the components below. So a theorem on the site and the same theorem in a static page
 * are one string read once, and the prose around it is written in the very components
 * the proof is set in.
 */
import { parse, set, type Setter } from "../rendering/Notation.ts";
import { REFERENCES } from "../rendering/references.ts";
import { proved, type Proved, type Registry } from "../theorems/Registry.ts";

/**
 * WHAT `notation` NEEDS OF A VIEW LIBRARY, named by shape rather than by import.
 *
 * Deliberately the smallest set that renders these components, and deliberately loose:
 * `createElement` takes an unknown type and unknown props because every call in this
 * file is one this file wrote, so there is nothing for a tighter signature to catch, and
 * a tighter one would reject the real React by disagreeing with one of its overloads.
 * `N` is whatever the runtime's elements ARE, and it is the return type of every
 * component below - so in a consumer's `.tsx` these are typed with that consumer's own
 * node type and no `@types/react` is needed here.
 */
export type Runtime<N> = {
  createElement(type: unknown, props?: object | null, ...children: unknown[]): N;
  Fragment: unknown;
  Children: { toArray(children: unknown): unknown[] };
  isValidElement(value: unknown): boolean;
  useState<S>(initial: S): [S, (next: S) => void];
  useRef<T>(initial: T): { current: T };
  useEffect(effect: () => void | (() => void), deps?: unknown[]): void;
};

/** anything that can stand inside a component: a node, some text, or a list of those */
export type Content<N> = N | string | number | boolean | null | undefined | Content<N>[];

/**
 * A STYLE, AS A PLAIN OBJECT.
 *
 * `React.CSSProperties` would be better and would cost `@types/react`, which is the one
 * thing this file is for not costing. Nothing is lost: every style here is written in
 * this file and read by the runtime, so the only reader that could have benefited from
 * the stricter type is the code that already knows what it wrote.
 */
type Style = Record<string, string | number | undefined>;

/** the colours - a count the lattice fixes, something derived, something borrowed */
export const INK = "#c6c9d4";
export const DIM = "#8a8d99";
export const FAINT = "#6c7080";
export const RULE = "#1c1e27";
export const NAMED = "#e0a878";
export const DERIVED = "#7fb8d4";
export const BORROWED = "#b58a8a";

export const SERIF = 'Georgia, "Times New Roman", serif';

/** a derivation: what stands behind an equation, and opens beside it */
export type Derivation<N> = { title: Content<N>; label: string; body: Content<N> };

/**
 * THE NOTATION, BOUND TO ONE RUNTIME - AND, IF IT IS GIVEN ONE, TO A REGISTRY.
 *
 * Everything is inside this function because everything needs `h`, and `h` is the
 * argument. That is the only reason - there is no state here and no reason to call it
 * more than once, so a consumer calls it in one module and imports the result from
 * there, the same way they would have imported the components themselves.
 *
 * AND `theorems` IS OPTIONAL FOR THE SAME REASON REACT IS AN ARGUMENT. Handed the
 * registry from `@orbitmines/physics/theorems`, `<Eq theory="G" theorem="gravity.mass"/>`
 * shows the line the prover concluded and opens the working behind it. Handed nothing,
 * everything else here still works and that one form says what it is missing - which is
 * the right trade for about a megabyte of derivations that most pages do not want.
 */
export const notation = <N,>(React: Runtime<N>, theorems?: Registry) => {
  const { createElement: h, Fragment, Children, isValidElement } = React;

  type Of = { children?: Content<N> };

  /**
   * A `<span>` with a style and some children, which is what nearly every component here
   * is. Named because the style is the only thing that differs between them and it
   * should be the only thing written.
   */
  const span = (style: Style, children?: Content<N>, rest?: object): N =>
    h("span", { style, ...rest }, children);

  const div = (style: Style, children?: Content<N>, rest?: object): N =>
    h("div", { style, ...rest }, children);

  /** children of a fragment, keyed, since several of these hand back a list */
  const list = (...children: Content<N>[]): N =>
    h(Fragment, null, ...children.map((c, i) => h(Fragment, { key: i }, c)));

  // —— notation ——————————————————————————————————————————————————————————

  /** A quantity. Leans, as a variable should. */
  const V = ({ children }: Of) => span({ fontStyle: "italic" }, children);

  /** One of the lattice's own counts. Upright, and coloured. */
  const K = ({ children }: Of) => span({ color: NAMED, fontStyle: "normal" }, children);

  const R = ({ children }: Of) => span({ color: "indianred", fontStyle: "normal" }, children);

  const F = ({ children }: Of) => span({ color: FAINT, fontStyle: "normal" }, children);

  const D = ({ children }: Of) => span({ color: DERIVED, fontStyle: "normal" }, children);

  /** Something taken from general relativity rather than counted here. */
  const Borrowed = ({ children }: Of) =>
    span({ color: BORROWED, fontStyle: "normal" }, children);

  /** A vector. Upright and bold, the way a vector is set. */
  const B = ({ children }: Of) => span({ fontWeight: 700, fontStyle: "normal" }, children);

  /*
   * A SUBSCRIPT, WITH THE SLANT PAID FOR AFTER IT.
   *
   * It leans, and a leaning letter's top-right corner reaches past the box the font gives it -
   * so `n_{f} + 1` set the `f` into the space before the `+` and came out `nf+ 1`, and
   * `T_{vac}\paren{x}` put the `c` inside the bracket. Metal type called the remedy an ITALIC
   * CORRECTION and every maths setter still applies one; this is that, at the one place here
   * that leans and is followed by something.
   */
  const Sub = ({ children }: Of) =>
    h("sub", { style: { fontSize: "0.72em", fontStyle: "italic", marginRight: "0.08em" } },
      children);

  const Sup = ({ children }: Of) => h("sup", { style: { fontSize: "0.72em" } }, children);

  /** A fraction, which is the only thing here that needs building. */
  const Frac = ({ over, under }: { over: Content<N>; under: Content<N> }) =>
    span({
      display: "inline-flex", flexDirection: "column", alignItems: "center",
      verticalAlign: "middle", margin: "0 0.35em", lineHeight: 1.25,
    }, [
      span({ padding: "0 0.4em" }, over, { key: "o" }),
      span({
        borderTop: "1px solid currentColor", padding: "0.12em 0.4em 0",
        marginTop: "0.12em", width: "100%", textAlign: "center",
      }, under, { key: "u" }),
    ]);

  /**
   * A choice - two things stacked in one bracket, and no rule between them.
   *
   * Written as a fraction it reads as a division, which is a different quantity, and a
   * count of arrangements is exactly the thing that gets misread that way.
   */
  const Binom = ({ over, under }: { over: Content<N>; under: Content<N> }) =>
    h(Paren, null, span({
      display: "inline-flex", flexDirection: "column", alignItems: "center",
      verticalAlign: "middle", lineHeight: 1.2, padding: "0 0.15em",
    }, [span({}, over, { key: "o" }), span({}, under, { key: "u" })]));

  /**
   * A term with its type set quietly underneath it, the way a signature reads.
   *
   * Not a fraction and so no rule line: `of` is the thing, `is` is what it ranges over.
   * Used where a name would otherwise need a sentence after it to say what kind of
   * number comes back.
   */
  const Type = ({ of, is }: { of: Content<N>; is: Content<N> }) =>
    span({
      display: "inline-flex", flexDirection: "column", alignItems: "center",
      verticalAlign: "middle", lineHeight: 1.15, margin: "0 0.15em",
    }, [
      span({}, of, { key: "of" }),
      span({
        fontSize: "0.66em", color: FAINT, fontStyle: "normal", marginTop: "0.15em",
      }, is, { key: "is" }),
    ]);

  /**
   * An operator with its condition set UNDER it, the way a limit is written.
   *
   * As a subscript it reads like a labelled variable, which is a different statement.
   */
  const Under = ({ of, is }: { of: Content<N>; is: Content<N> }) =>
    span({
      display: "inline-flex", flexDirection: "column", alignItems: "center",
      verticalAlign: "middle", lineHeight: 1.15, margin: "0 0.15em",
    }, [
      span({}, of, { key: "of" }),
      span({ fontSize: "0.66em", fontStyle: "normal" }, is, { key: "is" }),
    ]);

  /**
   * BRACKETS THE HEIGHT OF WHAT IS INSIDE THEM - DRAWN, like every other mark here.
   *
   * IT USED TO BE A BIGGER GLYPH, at a flat 2.2em, and that was wrong twice. A glyph
   * scaled up scales its STROKES with it, so a bracket sized to clear a fraction came out
   * two and a bit times heavier than the letters it enclosed and shouted over the line it
   * was only supposed to group. And the size was a constant, so it was the SAME height
   * round `\paren{R}` as round a two-storey fraction - which meant that in the common
   * case, which is a bracket round a short expression, it towered above and below its own
   * contents with nothing in the gap.
   *
   * SO IT IS DRAWN, WHICH IS WHAT THE REST OF THIS FILE ALREADY DOES. `Bar` is a border,
   * a fraction's rule is a border, and a radical's vinculum is a border - all of them one
   * pixel, because that reads as a MARK rather than as a character. A bracket is the same
   * thing bent: a one pixel border down one side of a box, with an elliptical radius that
   * carries it round at the ends. The stroke no longer depends on the height, so a
   * bracket round a fraction is exactly as heavy as a bracket round a letter, and both
   * are as heavy as the fraction's own rule.
   *
   * AND `align-self: stretch` IS WHAT MAKES IT FIT. The wings are flex items that take
   * the row's height, and the row's height is set by the one item that does not stretch -
   * the contents. So the bracket is measured from what it holds instead of guessing, at
   * every size, with no number in here that has to be revised when something taller turns
   * up. `scaleY` on a small bracket would also have grown it, and is what the note here
   * used to reject: it smears the stroke - thin at the ends, heavy in the middle - which
   * is the same fault as the big glyph, arrived at from the other side.
   *
   * The radius is a shade over half the width so the curve reaches its full bend before
   * the end of the wing; below that the bracket squares off and reads as an enclosure
   * rather than a bracket.
   *
   * AND THE STROKE IS IN `em`, WHERE THE OTHER RULES HERE ARE ONE PIXEL. A bar and a
   * fraction's rule are short and straight, and a pixel reads as a deliberate mark at any
   * size; a bracket is a long curve, which the eye reads lighter than a straight line of
   * the same width, and it is the one mark here that gets TALLER than the text beside it.
   * So it is measured against the type rather than against the screen, and it keeps that
   * relation at every size - which is the one thing the old scaled glyph did right.
   *
   * THE NUMBER IS THE TYPED BRACKET'S OWN WEIGHT. What this has to match is not the
   * letters but the `(` in the prose a few lines up, because a page that sets some of its
   * brackets and types the rest cannot have them come out as different marks.
   *
   * AND IT IS NOT THE MEASURED WIDTH, which is the trap. Georgia's `(` measures about 1.9
   * device pixels through the middle at the size the article runs at, and a border of
   * that width reads distinctly lighter beside it - twice I set this from the measurement
   * and twice it was still too thin. Text is not drawn the way a border is: the rasteriser
   * darkens stems and applies its own gamma, so a glyph puts more ink on the screen than
   * its geometry says, and a border gets none of that help. It has to be set against the
   * typed bracket BY EYE, at one device pixel and no magnification, which is the only view
   * that shows what the reader is actually comparing. That is 0.17em - about half again
   * the measured width, and the point at which the two stop looking like different marks.
   */
  const wing = (open: boolean): Style => ({
    alignSelf: "stretch",
    width: "0.26em",
    boxSizing: "border-box",
    [open ? "borderLeft" : "borderRight"]: "0.17em solid currentColor",
    borderRadius: open ? "140% 0 0 140% / 50% 0 0 50%" : "0 140% 140% 0 / 0 50% 50% 0",
  });

  /**
   * AND THE CHARACTER IS STILL THERE, where only a reader who is not looking will find it.
   *
   * A drawn bracket is not in the text, so an equation copied out of the page came back
   * without its brackets and a screen reader read the contents as though they had never
   * been grouped. The glyphs are therefore kept, clipped to nothing: out of the layout so
   * they cannot affect what is drawn, in the document so that selecting a line still
   * yields `(1 - p)` and an assistive reader still hears the group.
   */
  const HIDDEN: Style = {
    position: "absolute", width: "1px", height: "1px",
    overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap",
  };

  const Paren = ({ children }: Of) =>
    span({
      display: "inline-flex", alignItems: "center", verticalAlign: "middle",
      /* the sidebearing a bracket glyph used to carry inside itself */
      margin: "0 0.05em",
    }, [
      span(wing(true), span(HIDDEN, "("), { key: "l" }),
      /*
       * `line-height: 1` IS WHAT MAKES THE BRACKET THE HEIGHT OF WHAT IT HOLDS.
       *
       * The wings stretch to this box, so this box has to be the CONTENTS and not the
       * room the paragraph left for them. Inside `Eq` the line is set at 1.95 - wide,
       * because what stacks up in an equation is fractions and exponents rather than
       * words - and inherited, that leading made a bracket round a single letter nearly
       * twice the height of the letter, with nothing in the gap. It is the contents that
       * are being bracketed, so the strut is reset to their own size here.
       *
       * ANYTHING TALLER STILL WINS, which is why this is safe: a fraction, a radical and
       * a bracket are all inline-flex boxes carrying their own height, so they measure
       * the same whatever the strut under them says. This only takes away the leading.
       */
      span({ lineHeight: 1, padding: "0.08em 0.1em" }, children, { key: "c" }),
      span(wing(false), span(HIDDEN, ")"), { key: "r" }),
    ]);

  /**
   * AN ACCENT, DRAWN OVER THE BOX RATHER THAN GLUED TO THE LETTER.
   *
   * A combining mark is banned here for the reason at the top of `rendering/Notation.ts`:
   * it is one mark per glyph, it lands wherever that glyph's own metrics put it, and a
   * font without it draws a dotted box. So the mark is positioned over the whole of what
   * it covers and out of flow, so that a hatted letter in a paragraph does not make that
   * line any taller than the ones around it.
   */
  const accent = (mark: string) => ({ children }: Of) =>
    span({ position: "relative", display: "inline-block", fontStyle: "italic" }, [
      span({
        position: "absolute", left: 0, right: 0, top: "-0.62em",
        textAlign: "center", fontSize: "0.85em", fontStyle: "normal",
      }, mark, { key: "m", "aria-hidden": true }),
      h(Fragment, { key: "c" }, children),
    ]);

  /** A hat, for a direction - and the four other marks, drawn the same way. */
  const Hat = accent("^");
  const Tilde = accent("~");
  const Vec = accent("→");
  const Dot = accent("˙");
  const DDot = accent("¨");

  /**
   * A bar over the whole of what it covers - the mark that means DISCRETE.
   *
   * Not U+0305. A combining overline is one mark per letter, so a five letter word comes
   * out as five short strokes with the gaps between the letters showing through, each
   * landing wherever that glyph's own metrics put it, and a font without the combining
   * mark drops them on the floor or draws them as dotted boxes. This is one rule, the
   * width of what it covers, at one height - drawn the way the fraction's rule is drawn,
   * since that is all a bar is.
   *
   * IT TAKES NO SPACE. A barred letter in the middle of a paragraph must not push that
   * line of prose any taller than the lines around it, so the rule is positioned out of
   * flow. Which means it needs a height to be positioned AT, and that is measured from
   * the bottom of a box exactly one em tall - the `lineHeight: 1` - rather than from the
   * paragraph's line box, which is whatever the surrounding text asked for and would
   * slide the bar around from one context to the next. A box that tall has its baseline
   * a fixed sliver above its bottom edge in every font here, so `bottom` is effectively
   * a distance above the baseline - and it is set to sit clear of the letters rather
   * than on top of them. A capital reaches about 0.7em and an ascender a little past
   * that, so 1.06em leaves an unmistakable gap under the rule at every size, which is
   * what makes it read as a bar OVER the letters and not as part of them. Any lower and
   * it crowds the caps of `STEP` and `SHEET`.
   */
  const Bar = ({ children }: Of) =>
    span({ position: "relative", display: "inline-block", lineHeight: 1 }, [
      span({
        position: "absolute", left: 0, right: 0, bottom: "1.06em",
        borderTop: "1px solid currentColor",
      }, null, { key: "r", "aria-hidden": true }),
      h(Fragment, { key: "c" }, children),
    ]);

  /** A radical, with its vinculum over the whole of what is under it. */
  const Sqrt = ({ children }: Of) =>
    span({ display: "inline-flex", alignItems: "stretch", verticalAlign: "middle" }, [
      span({ fontStyle: "normal", paddingRight: "0.05em" }, "√", { key: "s" }),
      span({
        borderTop: "1px solid currentColor", padding: "0.08em 0.15em 0", marginTop: "0.1em",
      }, children, { key: "u" }),
    ]);

  const Note = ({ children }: Of) =>
    div({ color: DIM, fontSize: "0.88em", lineHeight: 1.6, paddingTop: "0.5em" }, children);

  // —— where a line may come apart ————————————————————————————————————————

  /**
   * Where a set line is allowed to break, since a phone is narrower than most of the
   * equations here and a sideways scrollbar is not reading.
   *
   * A line of maths cannot simply be handed to the normal wrapping rules. The spaces in
   * it are wherever the source happened to be indented, so `4 pi rbar^2` would come
   * apart between the two halves, and a fraction would be left stranded from the thing
   * it divides. So the line stays unbreakable as before, EXCEPT at the two places where
   * a break means something:
   *
   * AFTER A RELATION. `A = B` becomes `A =` over `B`, the sign staying on the line it
   * closes, which is how a two line equation has always been set - never `A` over `= B`.
   *
   * AT A GAP. The empty padded span is what stands two independent statements side by
   * side, so it is exactly the seam between them, and it goes at the end of the line it
   * finishes where its padding costs nothing. A padded span with something IN it - an
   * arrow, a `vs`, an aside in FAINT - becomes a piece of its own, free to fall either
   * way.
   *
   * Joined by zero width spaces, so a line that fits is set exactly as it was before;
   * and a single piece too wide for the screen still has the horizontal scroll
   * underneath it as the last resort.
   */
  const RELATION = /([=≈][  ]*)/;

  /** A padded top-level span: 'after' for a bare gap, 'both' for one with a mark in it. */
  const gap = (child: unknown): "after" | "both" | null => {
    if (!isValidElement(child)) return null;

    const el = child as { type?: unknown; props?: { style?: Style; children?: unknown } };
    if (el.type !== "span") return null;

    const pad = el.props?.style?.padding;
    if (typeof pad !== "string" || !pad.startsWith("0 ")) return null;

    return el.props?.children == null ? "after" : "both";
  };

  /**
   * The line's own parts, through any fragment wrapped around them.
   *
   * `Eq` is handed its children as a list, but `Step`'s line arrives as one FRAGMENT
   * whose contents are the equation. Walked into, or a step's line has exactly one
   * piece, cannot break, and scrolls sideways in a panel that is 94vw on a phone.
   */
  const parts = (children: Content<N>): unknown[] => {
    const kids = Children.toArray(children);

    if (kids.length !== 1 || !isValidElement(kids[0])) return kids;

    const only = kids[0] as { type?: unknown; props?: { children?: Content<N> } };

    return only.type === Fragment ? parts(only.props?.children) : kids;
  };

  const breakable = (children: Content<N>, hanging = false): N => {
    const pieces: unknown[][] = [[]];
    const put = (n: unknown) => pieces[pieces.length - 1].push(n);
    const cut = () => { if (pieces[pieces.length - 1].length) pieces.push([]); };

    /**
     * Whether we are at the head of a statement that a gap has just started - and if we
     * are, its own relation is not a place to break.
     *
     * THE GAP WINS, which is the whole of this. A line reading `A = 1 [gap] B = 2` has
     * three places it could come apart, and filling greedily takes the last one that
     * fits: `A = 1 [gap] B =` on the first line and a lonely `2` on the second, which
     * splits a statement down the middle while the seam between the two statements sits
     * unused a few characters to its left. Taking the second statement's own relation
     * out of the running leaves the gap as the last opportunity, so a new equation goes
     * to a new line and stays whole - and a statement long enough to need it can still
     * break at its NEXT relation, which is the one place a break was going to be
     * necessary anyway.
     */
    let heading = false;

    parts(children).forEach((child) => {
      if (typeof child === "string") {
        /*
         * Odd indices are the relations themselves, with whatever space followed them -
         * which travels with the sign, so a wrapped line never starts indented by it.
         */
        child.split(RELATION).forEach((bit, i) => {
          if (!bit) return;

          put(bit);
          if (!(i % 2)) return;

          if (heading) heading = false;
          else cut();
        });
        return;
      }

      const at = gap(child);

      if (!at) return put(child);
      if (at === "both") cut();

      put(child);
      cut();

      heading = true;
    });

    return div({
      display: "inline-block",
      /*
       * Room between the halves of a line that has come apart - set wide, because what
       * sits above and below in an equation is fractions and superscripts rather than
       * words, and at reading leading the two lines touch. `Frac` and `Bar` both fix
       * their own leading, so this reaches the gap between the lines and nothing inside
       * them. A line that fits pays for it as a slightly taller box, which is a thing
       * with 1.5em of margin either side of it and nowhere to collide.
       */
      lineHeight: 1.95,
      /*
       * What is carried onto the next line is set in from the line it continues by about
       * the width of a space, which is enough to say `still the same line` and not
       * enough to look like an indent. Hung, so only the carried lines take it and the
       * first still starts where it always did. Left off where the line is centred,
       * since centring already says it.
       */
      ...(hanging ? { textIndent: "-0.3em", paddingLeft: "0.3em" } : null),
    }, pieces.filter(piece => piece.length).map((piece, i) =>
      h(Fragment, { key: i }, i ? "​" : null,
        span({ whiteSpace: "nowrap" }, piece as Content<N>))));
  };

  // —— the derivations, and the panel they open in ————————————————————————

  /** A step of working: the line, then why. */
  const Step = ({ eq, children }: { eq?: Content<N>; children?: Content<N> }) =>
    div({ padding: "0 0 1.4em" }, [
      eq ? div({
        fontFamily: SERIF, fontSize: "1.05em", color: INK,
        overflowX: "auto", padding: "0.3em 0 0.6em",
      }, breakable(eq, true), { key: "eq" }) : null,
      div({ color: DIM, fontSize: "0.87em", lineHeight: 1.62 }, children, { key: "why" }),
    ]);

  const Because = ({ children }: Of) =>
    div({
      color: FAINT, fontSize: "0.68em", letterSpacing: "0.09em",
      textTransform: "uppercase", padding: "0.6em 0 0.5em",
    }, children);

  /**
   * The panel a derived equation opens.
   *
   * Dismissed three ways, because a thing that covers half the screen has to be easy to
   * be rid of: the backdrop, Escape, and a control that says so. Focus moves into it on
   * open and back to whatever opened it on close, so a reader who arrived by keyboard is
   * not stranded at the top of the document.
   */
  const Panel = ({ of, onClose }: { of: Derivation<N>; onClose: () => void }) => {
    const panel = React.useRef<{ focus(): void } | null>(null);

    React.useEffect(() => {
      const key = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };

      document.addEventListener("keydown", key);
      panel.current?.focus();

      return () => document.removeEventListener("keydown", key);
    }, [onClose]);

    return list(
      div({ position: "fixed", inset: 0, zIndex: 60, background: "rgba(4,5,9,0.6)" },
        null, { onClick: onClose }),
      div({
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 61,
        width: "min(38rem, 94vw)", overflowY: "auto", outline: "none",
        background: "#080910", borderLeft: `1px solid ${RULE}`,
        boxShadow: "-24px 0 60px rgba(0,0,0,0.5)",
        padding: "2.2rem 2rem 4rem",
      }, [
        h("style", { key: "css" }, `
          .law-panel { animation: lawIn 180ms ease-out }
          @keyframes lawIn { from { transform: translateX(2rem); opacity: 0 } }
          @media (prefers-reduced-motion: reduce) { .law-panel { animation: none } }
        `),
        div({
          display: "flex", alignItems: "baseline", justifyContent: "space-between",
          gap: "1rem", paddingBottom: "1.4rem", borderBottom: `1px solid ${RULE}`,
          marginBottom: "1.6rem",
        }, [
          div({}, [
            div({
              color: FAINT, fontSize: "0.68em", letterSpacing: "0.09em",
              textTransform: "uppercase",
            }, "where it comes from", { key: "l" }),
            div({
              fontFamily: SERIF, fontSize: "1.35em", color: INK, paddingTop: "0.25em",
            }, of.title, { key: "n" }),
          ], { key: "t" }),
          h("button", {
            key: "x",
            onClick: onClose,
            "aria-label": "Close",
            style: {
              background: "none", border: `1px solid ${RULE}`, borderRadius: 2,
              color: DIM, cursor: "pointer", fontSize: "0.75em",
              padding: "0.35em 0.7em", flexShrink: 0,
            },
          }, "esc"),
        ], { key: "head" }),
        h(Fragment, { key: "body" }, of.body),
      ], {
        ref: panel,
        role: "dialog",
        "aria-modal": true,
        "aria-label": `Where ${of.label} comes from`,
        tabIndex: -1,
        className: "law-panel",
      }),
    );
  };

  /**
   * ONE DISPLAYED LINE. Clickable when there is working behind it, and looking clickable
   * - a derived line and a stated one must not be the same object.
   *
   * `Eq` is what a page writes; this is the block it renders, and it is separate because
   * a theorem with two forms of its law is TWO of these under one caption apiece.
   *
   * IT CARRIES ITS OWN PANEL unless whoever placed it keeps one. A page where everything
   * opens holds a single piece of state and passes `open`; a line standing in the prose
   * of a book has nothing above it doing that, and cannot be given one from the top of
   * the article either - a book renders the children of the SELECTED SECTION and nothing
   * else, so a panel hung anywhere but beside its own equation is never rendered at all.
   * Hence the state living here, which is the one place that is always in the tree when
   * the equation a reader just clicked is.
   *
   * Only one is ever open: the panel's backdrop covers the viewport, so a click meant
   * for a second equation closes the first instead.
   */
  const Line = ({ children, note, derive, open }: {
    children?: Content<N>;
    note?: Content<N>;
    derive?: Derivation<N>;
    open?: (d: Derivation<N>) => void;
  }) => {
    const [shown, setShown] = React.useState(false);
    const from = React.useRef<{ focus(): void } | null>(null);

    const inner = list(
      div({
        overflowX: "auto", textAlign: "center", color: INK,
        fontFamily: SERIF, fontSize: "1.18em", padding: "0.2em 0",
      }, breakable(children)),
      note ? div({
        textAlign: "center", color: FAINT, fontSize: "0.72em",
        letterSpacing: "0.04em", paddingTop: "0.5em",
      }, note) : null,
    );

    if (!derive) return div({ margin: "1.5em 0" }, inner);

    /** the border says where focus is, and hover says the line can be opened */
    const edge = (e: { currentTarget: { style: Style } }, colour: string) => {
      e.currentTarget.style.borderColor = colour;
    };

    return list(
      h("button", {
        onClick: () => {
          if (open) return open(derive);

          from.current = document.activeElement as unknown as { focus(): void };
          setShown(true);
        },
        style: {
          display: "block", width: "100%", margin: "1.5em 0",
          background: "none", border: "1px solid transparent", borderRadius: 3,
          padding: "0.9em 0.5em 0.7em", cursor: "pointer", font: "inherit",
          color: "inherit", textAlign: "inherit", position: "relative",
          transition: "background 120ms, border-color 120ms",
        },
        onMouseEnter: (e: { currentTarget: { style: Style } }) => {
          e.currentTarget.style.background = "rgba(127,184,212,0.05)";
          edge(e, RULE);
        },
        onMouseLeave: (e: { currentTarget: { style: Style } }) => {
          e.currentTarget.style.background = "none";
          edge(e, "transparent");
        },
        onFocus: (e: { currentTarget: { style: Style } }) => edge(e, DERIVED),
        onBlur: (e: { currentTarget: { style: Style } }) => edge(e, "transparent"),
      }, inner, span({
        position: "absolute", right: "0.7em", top: "0.45em",
        color: DERIVED, fontSize: "0.6em", letterSpacing: "0.1em",
        textTransform: "uppercase", opacity: 0.75,
      }, "derived ›")),
      shown ? h(Panel, {
        of: derive,
        onClose: () => { setShown(false); from.current?.focus(); },
      }) : null,
    );
  };

  const Head = ({ children }: Of) =>
    div({
      color: FAINT, fontSize: "0.7em", letterSpacing: "0.09em",
      textTransform: "uppercase", padding: "2.2em 0 0.1em",
      borderTop: `1px solid ${RULE}`, marginTop: "2em",
    }, children);

  /** symbol -> what it is, laid out so the symbols line up down the page. */
  const Rows = ({ of }: { of: [Content<N>, Content<N>][] }) =>
    div({
      display: "grid", gridTemplateColumns: "minmax(6.5em, max-content) 1fr",
      gap: "0.75em 1.4em", alignItems: "baseline", padding: "1em 0 0.2em",
    }, of.map(([sym, what], i) => h(Fragment, { key: i },
      div({ fontFamily: SERIF, fontSize: "1.02em", color: INK, whiteSpace: "nowrap" }, sym),
      div({ color: DIM, fontSize: "0.86em", lineHeight: 1.55 }, what))));

  // —— and the proofs' own markup, set through all of the above ——————————

  /**
   * A BIG OPERATOR, AND ITS LIMITS ONLY IF IT HAS ANY.
   *
   * An empty limit column is not nothing: it is an inline-flex child that still takes
   * its margin, so a bare integral sign comes out shunted off the letter it integrates.
   */
  const big = (sign: string, lo: Content<N>, hi: Content<N>): N =>
    span({ display: "inline-flex", alignItems: "center", verticalAlign: "middle" }, [
      span({ fontSize: "1.6em", lineHeight: 0.8, fontStyle: "normal" }, sign, { key: "s" }),
      lo || hi ? span({
        display: "inline-flex", flexDirection: "column", justifyContent: "space-between",
        fontSize: "0.6em", lineHeight: 1.1, padding: "0 0.15em",
      }, [span({}, hi, { key: "h" }), span({}, lo, { key: "l" })], { key: "lim" }) : null,
    ]);

  /**
   * THE SETTER THAT TURNS A PARSED LINE INTO ELEMENTS.
   *
   * One handler per `Piece`, and nearly every one of them is a component from above.
   * Which is the point: `\bar{r}` emitted by a proof and `<Bar><V>r</V></Bar>` written
   * by hand in the prose come out as the same nodes, because they are the same call.
   * There is no styling decision in this object - it is a table from a kind of piece to
   * the component that already knew how to set it, which is why a change to how a
   * fraction looks cannot make the two disagree.
   */
  const SETTER: Setter<Content<N>> = {
    join: pieces => pieces.length === 1 ? pieces[0] : list(...pieces),
    text: t => t,
    var: c => h(V, null, c),
    count: c => h(K, null, c),
    fn: c => h(D, null, c),
    muted: c => h(F, null, c),
    bar: c => h(Bar, null, c),
    hat: c => h(Hat, null, c),
    tilde: c => h(Tilde, null, c),
    vec: c => h(Vec, null, c),
    dot: c => h(Dot, null, c),
    ddot: c => h(DDot, null, c),
    /* words standing inside a formula - upright, and spaced as they were written */
    words: t => span({ fontStyle: "normal", whiteSpace: "pre" }, t),
    bold: c => h(B, null, c),
    /*
     * A CALLIGRAPHIC LETTER, SYNTHESISED — see `notation.css` for why it is not a script font
     * and not a Unicode script code point. `\mathcal{D}` must be tellable from `D`, the
     * dimension, at a glance: same letter, same equations, one a count and one a factor.
     */
    cal: c => span({
      fontFamily: SERIF, fontStyle: "italic", letterSpacing: "0.06em",
      fontSize: "1.08em", display: "inline-block", transform: "skewX(-9deg)",
    }, c),
    bb: c => span({ fontWeight: 600, fontStyle: "normal" }, c),
    sqrt: c => h(Sqrt, null, c),
    sup: c => h(Sup, null, c),
    sub: c => h(Sub, null, c),
    int: (lo, hi) => big("∫", lo, hi),
    oint: (lo, hi) => big("∮", lo, hi),
    sum: (lo, hi) => big("∑", lo, hi),
    prod: (lo, hi) => big("∏", lo, hi),
    frac: (over, under) => h(Frac, { over, under }),
    paren: c => h(Paren, null, c),
    binom: (over, under) => h(Binom, { over, under }),
    /*
     * A base and its scripts as ONE box, so the scripts are aligned against IT and not
     * against the line. After a letter the difference is slight; after a bracket, a
     * fraction, a root or a sum it is the difference between an exponent ON the thing
     * and one floating at the height of the tallest thing on the line.
     */
    scripted: (base, sup, sub) => sup === undefined && sub === undefined ? base
      : span({ display: "inline-flex", alignItems: "stretch", verticalAlign: "middle" }, [
        span({ display: "inline-flex", alignItems: "center" }, base, { key: "b" }),
        span({
          display: "inline-flex", flexDirection: "column",
          justifyContent: "space-between", fontSize: "0.72em", lineHeight: 1,
        }, [
          sup !== undefined ? span({}, sup, { key: "u" }) : null,
          sub !== undefined ? span({ marginTop: "auto" }, sub, { key: "d" }) : null,
        ], { key: "s" }),
      ]),
    underset: (base, under) => h(Under, { of: base, is: under }),
    ref: k => {
      const r = REFERENCES[k];
      if (!r) return `[${k}]`;

      const style: Style = { color: DERIVED, fontSize: "0.85em", whiteSpace: "nowrap" };

      return r.link
        ? h("a", { href: r.link, target: "_blank", rel: "noreferrer", title: r.says, style },
          r.short)
        : span(style, r.short, { title: r.says });
    },
  };

  /**
   * A LINE OF THE PROOFS' OWN MARKUP, set with the notation above.
   *
   * This is the reason the notation is in this package rather than only on the site. A
   * theorem this repository emits carries its statement as ASCII - `\bar{r}^{D-1}` - and
   * `html()` already sets that for a standalone page. `<Markup of={...}/>` sets the same
   * string, off the same parse, into the same components an article writes by hand. So a
   * proof, the page it is published on, and the prose around it cannot come to differ
   * about what a bar means.
   */
  const Markup = ({ of }: { of: string }) => h(Fragment, null, set(parse(of), SETTER));

  /** the same, displayed and centred the way `Eq` displays a line written by hand */
  /** one line of the registry's markup, set with the notation above */
  const pieces = (of: string): Content<N> => set(parse(of), SETTER);

  // —— and a theorem, cited by name ——————————————————————————————————————

  /**
   * WHAT A PAGE SAYS WHEN IT ASKS FOR A THEOREM THAT IS NOT THERE.
   *
   * Loudly, and in place. A missing citation is a fact about the page and the one thing
   * the reader and the author both need to see; rendering nothing hides it, and throwing
   * takes down an article that is still being ported over one line that has not landed
   * yet. So it is set where the equation would have been, in the colour the rest of the
   * book uses for something borrowed, and it says which name it looked for.
   */
  const Absent = ({ says }: { says: string }) =>
    div({
      margin: "1.5em 0", padding: "0.9em 1em", textAlign: "center",
      border: `1px dashed ${BORROWED}`, borderRadius: 3,
      color: BORROWED, fontSize: "0.8em", letterSpacing: "0.04em",
    }, says);

  /**
   * THE WORKING BEHIND A PROVED LINE, as the panel wants it.
   *
   * Every step is one `Step`: the line it concluded, the rule or inference it came by,
   * its arithmetic where it has any, and why it follows. Which is the same shape the
   * article's hand-written derivations are in - so a machine-derived panel and a written
   * one are the same object, and a reader cannot tell from the page which is which.
   * That is the point rather than a coincidence: they are the same KIND of claim.
   */
  const behind = (p: Proved): Derivation<N> => ({
    label: p.theorem,
    title: p.about ? h(Markup, { of: p.about }) : p.theorem,
    body: list(
      div({ color: DIM, fontSize: "0.87em", lineHeight: 1.62, paddingBottom: "1.6em" }, p.asks),
      !p.standing ? div({ color: BORROWED, fontSize: "0.8em", paddingBottom: "1.4em" },
        p.missing.length
          ? `the closure did not reach this. it wanted: ${p.missing.join(", ")}`
          : "the closure did not reach this") : null,
      list(...p.steps.map(step => h(Step, {
        eq: pieces(step.line),
      },
        h(Because, null, step.via),
        step.working.length ? div({
          fontFamily: SERIF, color: DIM, fontSize: "0.95em",
          padding: "0 0 0.8em", overflowX: "auto",
        }, list(...step.working.map(w =>
          div({ padding: "0.15em 0" }, pieces(w))))) : null,
        pieces(step.because)))),
      /*
       * AND WHAT EVERY NAME IN THE LINE STANDS FOR, opened once each, underneath.
       *
       * Without this the panel shows an equation a reader cannot evaluate: the line keeps
       * its names precisely so that the same four-hundred-character sub-expression is not
       * printed three times inside it, and the price of that is that the names have to be
       * given somewhere. This is somewhere. `Rows` is the layout the article already uses
       * for exactly this - symbol on the left, what it is on the right, lined up down the
       * page - so a machine-derived glossary and a written one look the same.
       */
      p.parts.length ? list(
        h(Head, null, "which part is which"),
        h(Rows, {
          of: p.parts.map(x => [pieces(x.part), list(
            div({ color: INK }, x.is),
            div({ paddingTop: "0.3em" }, pieces(x.because)),
          )] as [Content<N>, Content<N>]),
        }),
      ) : null,
      p.standingFor.length ? list(
        h(Head, null, "and what the names stand for"),
        h(Rows, {
          of: p.standingFor.map(x => [pieces(x.name), list(
            div({ fontFamily: SERIF, color: INK, overflowX: "auto" }, pieces(x.is)),
            x.because ? div({ paddingTop: "0.3em" }, pieces(x.because)) : null,
          )] as [Content<N>, Content<N>]),
        }),
      ) : null,
      div({
        color: FAINT, fontSize: "0.68em", letterSpacing: "0.09em",
        textTransform: "uppercase", paddingTop: "1.2em",
        borderTop: `1px solid ${RULE}`, marginTop: "1.4em",
      }, `${p.theory} · ${p.theorem} · read off the rules, not measured`),
    ),
  });

  /**
   * A DISPLAYED EQUATION - written out, or cited from the registry by name.
   *
   *     <Eq><V>a</V> = <K>DEG</K></Eq>
   *     <Eq theory="G" theorem="gravity.mass" />
   *
   * THE SECOND FORM IS THE POINT OF PACKAGING THE THEOREMS. What it sets is the line
   * `npm run theorems` concluded, looked up rather than transcribed - so a rule edited in
   * `G.ts` moves the equation on the page, and there is no second copy for the two to
   * disagree about. Clicking it opens the whole working, which was derived in the same
   * run and is therefore about the same line by construction.
   *
   * AND WHERE A THEOREM HAS TWO FORMS OF ITS LAW, BOTH ARE SHOWN. The recursive writing
   * of the force law says WHY and the solved one says WHAT; a page showing one of them
   * hides either the mechanism or the answer, so `leads` and `then` caption the pair and
   * the pair is what is set. Only the first carries the panel - it is one derivation.
   */
  const Eq = (props: {
    children?: Content<N>;
    note?: Content<N>;
    derive?: Derivation<N>;
    open?: (d: Derivation<N>) => void;
    /** which theory answered it - `G`, or a variant of it */
    theory?: string;
    /** and which question: the folder under `theorems/`, such as `gravity.mass` */
    theorem?: string;
  }) => {
    const { theory, theorem, note, open } = props;

    if (!theorem) return h(Line, props);

    if (!theorems) return h(Absent, {
      says: `${theorem} — notation() was given no registry to look it up in`,
    });

    const of = proved(theorems, theory ?? "G", theorem);

    if (!of) return h(Absent, {
      says: `${theory ?? "G"} proves no ${theorem}`,
    });

    if (!of.concluded) return h(Absent, {
      says: `${of.theorem} — the closure reached no line${
        of.missing.length ? `; it wanted ${of.missing.join(", ")}` : ""}`,
    });

    /*
     * WHAT A CAPTION IS FOR HERE. `leads` and `then` are whole sentences saying what KIND
     * of statement each writing of the law is, and they go above the line they describe
     * rather than under it - a reader has to know which form they are looking at before
     * they read it, not after.
     */
    const caption = (says: string | null) => says ? div({
      color: FAINT, fontSize: "0.72em", lineHeight: 1.6, textAlign: "center",
      maxWidth: "44em", margin: "1.4em auto -0.6em",
    }, says) : null;

    return list(
      caption(of.also ? of.leads : null),
      h(Line, {
        note: note ?? of.theorem,
        derive: behind(of),
        open,
      }, pieces(of.concluded)),
      of.also ? list(
        caption(of.then),
        h(Line, null, pieces(of.also)),
      ) : null,
    );
  };

  /** a line of markup, displayed the way `Eq` displays one written by hand */
  const EqMarkup = ({ of, note, derive, open }: {
    of: string;
    note?: Content<N>;
    derive?: Derivation<N>;
    open?: (d: Derivation<N>) => void;
  }) => h(Line, { note, derive, open }, h(Markup, { of }));

  /**
   * THE WORKING BEHIND A CITED THEOREM, for a page that keeps ONE panel.
   *
   * `Eq` hands this to `open` when its line is clicked, which is all a page needs to hold
   * a single panel above thirty equations. It is out here as well for the page that wants
   * the derivation without an equation in front of it - a table of what is proved, a
   * check that a name resolves - and because a thing `Eq` builds internally is a thing
   * that cannot be tested from outside.
   */
  const derivation = (theorem: string, theory = "G"): Derivation<N> | undefined => {
    const of = theorems && proved(theorems, theory, theorem);
    return of ? behind(of) : undefined;
  };

  return {
    V, K, R, F, D, B, Borrowed,
    Sub, Sup, Frac, Binom, Type, Under, Paren,
    Hat, Tilde, Vec, Dot, DDot, Bar, Sqrt,
    Note, Step, Because, Panel, Eq, Line, Head, Rows,
    Markup, EqMarkup, derivation,
    /** the walk itself, for anything that wants to set a line into something else */
    setter: SETTER,
  };
};
