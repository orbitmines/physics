/**
 * A RASTER, AS A PNG, WITH NOTHING BEHIND IT BUT `node:zlib`.
 *
 * WHY A RASTER AT ALL. Everything else `visuals/` draws is lines and text, which SVG is
 * made for. A density over a plane is not lines: it is one number per place, forty
 * thousand of them to a panel, and drawing that as forty thousand `<rect>`s produces a
 * file a browser struggles with and a diff nobody can read. A PNG is the right container
 * for a picture that IS pixels, and it embeds in an SVG as one `<image>` with a data URI,
 * so the page stays a single self-contained file.
 *
 * AND IT IS WRITTEN OUT HERE RATHER THAN DEPENDED ON. A PNG is a signature, three chunks
 * and a CRC, over scanlines that `zlib.deflateSync` compresses - and zlib is in the
 * standard library. The whole encoder is forty lines, which is less than the argument for
 * adding a dependency to a repository that has none.
 */
import { deflateSync } from "node:zlib";

const TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

const crc32 = (b: Uint8Array) => {
  let c = 0xffffffff;
  for (let i = 0; i < b.length; i++) c = TABLE[(c ^ b[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

const chunk = (type: string, data: Uint8Array) => {
  const name = Uint8Array.from([...type].map(c => c.charCodeAt(0)));
  const body = new Uint8Array(name.length + data.length);
  body.set(name); body.set(data, name.length);
  const out = new Uint8Array(8 + data.length + 4);
  const dv = new DataView(out.buffer);
  dv.setUint32(0, data.length);
  out.set(body, 4);
  dv.setUint32(out.length - 4, crc32(body));
  return out;
};

/**
 * ONE PNG OUT OF ONE RGB BUFFER - `rgb` is w·h·3 bytes, row-major, no alpha.
 *
 * Every scanline is filtered with 0 (none): the pictures here are smooth gradients and
 * deflate handles them well enough that choosing a filter per row would buy a few per
 * cent for a page of extra code.
 */
export const png = (w: number, h: number, rgb: Uint8Array): string => {
  const raw = new Uint8Array(h * (w * 3 + 1));
  for (let y = 0; y < h; y++) {
    raw[y * (w * 3 + 1)] = 0;
    raw.set(rgb.subarray(y * w * 3, (y + 1) * w * 3), y * (w * 3 + 1) + 1);
  }
  const ihdr = new Uint8Array(13);
  const dv = new DataView(ihdr.buffer);
  dv.setUint32(0, w); dv.setUint32(4, h);
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const parts = [
    Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", new Uint8Array(deflateSync(raw, { level: 9 }))),
    chunk("IEND", new Uint8Array(0)),
  ];
  const all = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let at = 0;
  for (const p of parts) { all.set(p, at); at += p.length; }
  return Buffer.from(all).toString("base64");
};
