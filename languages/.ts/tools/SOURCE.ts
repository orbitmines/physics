/**
 * THE SOURCE OF EACH RULE, READ OFF THE FILE — so a page can show what a term came out of and
 * not merely name it.
 *
 * A DERIVATION THAT NAMES ITS RULE IS ASKING TO BE TRUSTED. The step says `CREATION`, the term
 * says `\nu\paren{1-\rho}`, and a reader who wants to know why has to go and find `G.ts`. Put
 * the rule's own text above the step and the claim is checkable where it is made: the gates are
 * there, the body is there, and the degree, the share and the sign are visibly what the page
 * says they are.
 *
 * READ OFF THE FILE RATHER THAN RECONSTRUCTED, because a reconstruction is a second description
 * of the rule and this whole folder exists to have one. `Function.toString` would give the
 * COMPILED body - one closure with the gates folded in - which is what a tick runs and not what
 * anybody wrote. The text is what was written.
 */
import { readFileSync } from "node:fs";

const FILE = new URL("../src/theories/G/G.ts", import.meta.url).pathname;

/**
 * ONE RULE'S TEXT, from `.rule("NAME"` to the call that closes it.
 *
 * Counted on brackets rather than matched with a pattern, because a rule body is an expression
 * of the language and nests as deep as it likes. The comments inside are KEPT: they are where a
 * rule says why it is what it is, and a page that dropped them would show the arithmetic
 * without the argument.
 */
export const sourceOf = (name: string): string | undefined => {
  const text = readFileSync(FILE, "utf8");
  const at = text.indexOf(`.rule("${name}"`);
  if (at < 0) return undefined;
  let depth = 0, i = at, started = false;
  for (; i < text.length; i++) {
    const c = text[i];
    if (c === "(") { depth++; started = true; }
    else if (c === ")") { depth--; if (started && depth === 0) { i++; break; } }
  }
  const body = text.slice(at, i);
  /* the leading `.` and the trailing `)` are the chain's, not the rule's */
  return body.replace(/^\./, "").replace(/\s+$/, "");
};

/**
 * AND THE GATES A RULE NAMES, since a rule reads `at.point.of(neutral)` and the interesting
 * half is what `neutral` IS.
 *
 * A gate is where a share comes from - `\paren{1-\rho}` is `not(busy(point))` and nothing else
 * - so a page showing the rule without the gate shows half the derivation.
 */
export const gatesIn = (src: string): string[] => {
  const text = readFileSync(FILE, "utf8");
  const out: string[] = [];
  for (const m of src.matchAll(/\.of\(([a-zA-Z_][a-zA-Z0-9_]*)\)/g)) {
    const at = text.indexOf(`const ${m[1]} = gate({`);
    if (at < 0) continue;
    const end = text.indexOf("});", at);
    if (end < 0) continue;
    /* with the comment above it, which is where a gate says what it lets through */
    let head = at;
    const before = text.lastIndexOf("*/", at);
    if (before > 0 && text.slice(before, at).trim() === "*/") {
      const open = text.lastIndexOf("/**", before);
      if (open > 0) head = open;
    }
    out.push(text.slice(head, end + 3));
  }
  return out;
};
