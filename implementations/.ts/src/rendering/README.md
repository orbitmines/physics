# rendering

The notation this repository's generated documents are set in, and the one place it is
defined. The prover writes its proofs against this and the generated pages inline it, so
a derivation reads identically in a standalone HTML page and on the website.

| file | |
|---|---|
| `Notation.ts` | the markup, its parser, and the HTML renderer |
| `references.ts` | the works a proof cites, by key - Ehrhart and the rest |
| `notation.css` | the notation as styles, inlined into every generated page |
| `panel.js` | opening and closing the working behind an equation |

## nothing here is tied to a framework

An earlier version of this exported React components, which made the proofs usable by
exactly one website. A derivation is a document rather than a component, so what the
prover emits is the notation PARSED - a `Piece[]` tree of `text`, `var`, `count`, `bar`,
`sup`, `sub` and `ref` - and a consumer maps each kind onto whatever it draws with. That
is the whole interface. A React project renders `count` as its own coloured span, a plain
page renders it as a `<b>`, and neither has to agree with the other about anything but
the shape of the tree.

`notation.css` and `panel.js` are inlined into the generated HTML rather than linked, so
a proof page is one file that opens anywhere.

## the markup

A generated proof never writes a combining character, a unicode superscript, or an em
dash. Those look right on a desktop and break on a phone: a combining macron over `r`
renders as a bare `r` with a floating bar, or as a tofu box, on a good number of mobile
fonts. So working is emitted in an ASCII markup and set properly at render time, by
whichever of the two renderers is in use.

| written | set as | |
|---|---|---|
| `\bar{r}` | `<Bar>r</Bar>` | an overline - the discrete radius |
| `^{D-1}` | `<Sup>D-1</Sup>` | a superscript |
| `_{1}` | `<Sub>1</Sub>` | a subscript |
| `[[ehrhart]]` | `<Reference of="ehrhart" />` | a citation, by key from `references.ts` |
| `-` | `-` | a hyphen-minus, never an em dash and never U+2212 |

Greek letters are written as themselves - they are in every font that matters, and the
alternative is naming them, which is worse to read.
