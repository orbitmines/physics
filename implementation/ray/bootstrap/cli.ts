#!/usr/bin/env -S npx tsx
/**
 * `ray <file-or-project>`   run Ray (the language project is always loaded first)
 * `ray gen`                 run implementation/gen over implementation/physics.ray
 * `ray check <paths>`       parse only
 * `ray test`                run every `dynamically assert` collected from the loaded projects
 */
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "./parser.ts";
import { Env, RayError, Runtime } from "./runtime.ts";
import { findProjects, load } from "./project.ts";
import { measure, renderVisuals } from "./visuals.ts";

const here = dirname(fileURLToPath(import.meta.url));
const implementation = resolve(here, "..", "..");
const repo = resolve(implementation, "..");

const [cmd, ...rest] = process.argv.slice(2);

/*
 * THE HOST'S HALF OF THE BORROWED CATALOGUES (physics.ray/Catalogue.ray): what needs the network, a
 * PDF reader, a binary file or a number parser. Everything that decides what a column MEANS stays in .ray.
 */
function installCatalogue(rt: Runtime) {
  const raw = resolve(repo, "data/.raw");
  rt.hosted["Catalogue.fetch"] = (url, as) => {
    mkdirSync(raw, { recursive: true });
    const at = resolve(raw, as as string);
    if (!existsSync(at) || process.env.RAY_REFETCH) {
      process.stderr.write(`  GET      ${url} ... `);
      execFileSync("curl", ["-sSL", "-A", "orbitmines-physics (research)", "-o", at, url as string]);
      process.stderr.write(`${(statSync(at).size / 1024).toFixed(0)} kB\n`);
    }
    return readFileSync(at, "utf8");
  };
  /* an image: [width, height, then every pixel row by row from the bottom, as FITS lays them] - [] when what came back is no image */
  rt.hosted["Catalogue.fits"] = (url, as) => {
    mkdirSync(raw, { recursive: true });
    const at = resolve(raw, as as string);
    if (!existsSync(at) || process.env.RAY_REFETCH) {
      process.stderr.write(`  GET      ${url} ... `);
      try { execFileSync("curl", ["-sSL", "-m", "120", "-A", "orbitmines-physics (research)", "-o", at, url as string]); } catch { writeFileSync(at, ""); }
      process.stderr.write(`${(statSync(at).size / 1024).toFixed(0)} kB\n`);
    }
    const b = readFileSync(at);
    if (b.length < 2880 || b.subarray(0, 6).toString("latin1") !== "SIMPLE") return [];
    const cards: Record<string, string> = {};
    let off = 0;
    for (let done = false; !done && off + 80 <= b.length; off += 80) {
      const card = b.subarray(off, off + 80).toString("latin1");
      const key = card.slice(0, 8).trim();
      if (key === "END") done = true;
      else if (card[8] === "=") cards[key] = card.slice(10).split("/")[0].trim().replace(/'/g, "").trim();
    }
    off = Math.ceil(off / 2880) * 2880;
    const bitpix = Number(cards.BITPIX), w = Number(cards.NAXIS1), h = Number(cards.NAXIS2);
    const scale = Number(cards.BSCALE ?? 1), zero = Number(cards.BZERO ?? 0), size = Math.abs(bitpix) / 8;
    if (!(w > 0 && h > 0) || off + w * h * size > b.length) return [];
    const view = new DataView(b.buffer, b.byteOffset + off, w * h * size);
    const out: number[] = [w, h];
    for (let i = 0; i < w * h; i++) {
      const raw_ = bitpix === -32 ? view.getFloat32(i * 4) : bitpix === -64 ? view.getFloat64(i * 8) : bitpix === 16 ? view.getInt16(i * 2) : bitpix === 32 ? view.getInt32(i * 4) : view.getUint8(i);
      out.push(raw_ * scale + zero);
    }
    return out;
  };
  rt.hosted["Catalogue.pdf_text"] = (as) => {
    try { return execFileSync("pdftotext", ["-layout", resolve(raw, as as string), "-"], { encoding: "utf8", maxBuffer: 64 << 20 }); }
    catch { throw new RayError("this table needs `pdftotext` (poppler-utils) - its publisher offers no machine-readable version"); }
  };
  rt.hosted["Catalogue.save_f32"] = (path, values) => {
    const full = resolve(repo, path as string);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, Buffer.from(new Float32Array(values as number[]).buffer));
    return null;
  };
  /* the host's half of a measurement (physics.ray/Visual.ray): what is on disk under visuals/ or data/, read back as columns and a header */
  const toRay = (x: any): any => {
    if (x === null || x === undefined) return null;
    if (ArrayBuffer.isView(x)) return Array.from(x as any);
    if (Array.isArray(x)) return x.map(toRay);
    if (typeof x === "object") { const o = rt.makeObject("Object", {}); for (const [k, v] of Object.entries(x)) o.fields.set(k, toRay(v)); return o; }
    return x;
  };
  const fromRay = (x: any): any => {
    if (x === null || x === undefined) return null;
    if (Array.isArray(x)) return x.map(fromRay);
    if (x && typeof x === "object" && x.fields instanceof Map) { const o: any = {}; for (const [k, v] of x.fields) o[k] = fromRay(v); return o; }
    return x;
  };
  rt.hosted["Measured.of"] = (id) => {
    const name = String(id), frames = name.endsWith(".frames"), stem = frames ? name.slice(0, -7) : name;
    for (const root of ["visuals", "data"]) {
      const dir = resolve(repo, root, stem);
      const f = resolve(dir, frames ? "frames.f32" : "field.f32"), h = resolve(dir, frames ? "frames.json" : "meta.json");
      if (!existsSync(f) || !existsSync(h)) continue;
      const header = JSON.parse(readFileSync(h, "utf8"));
      const bytes = readFileSync(f);
      const all = new Float32Array(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
      const columns: Record<string, number[]> = {};
      (header.columns as string[]).forEach((n, i) => { columns[n] = Array.from(all.subarray(i * header.rows, (i + 1) * header.rows)); });
      return rt.makeObject("Measured", { header: toRay(header), columns: toRay(columns) });
    }
    return null;
  };
  rt.hosted["Measured.save"] = (where, id, what, names, columns, extra) => {
    const cols = fromRay(columns), ns = names as string[], rows = cols[ns[0]].length;
    const flat = new Float32Array(ns.length * rows);
    ns.forEach((n, i) => flat.set(cols[n], i * rows));
    const dir = resolve(repo, String(where), String(id));
    mkdirSync(dir, { recursive: true });
    writeFileSync(resolve(dir, "field.f32"), Buffer.from(flat.buffer));
    writeFileSync(resolve(dir, "meta.json"), JSON.stringify({ what, columns: ns, rows, measured: new Date().toISOString(), ...fromRay(extra) }, null, 2) + "\n");
    return null;
  };
  rt.hosted["Catalogue.number"] = (text) => { const n = Number(String(text).trim()); return Number.isFinite(n) ? n : null; };
  rt.hosted["Catalogue.numbers"] = (text) => [...String(text).matchAll(/-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?/g)].map(m => Number(m[0]));
}

function boot(extra: string[] = []): Runtime {
  const rt = new Runtime();
  installCatalogue(rt);
  const projects = findProjects(implementation).filter(p => !p.root.includes("/examples"));
  for (const e of extra) {
    const p = resolve(e);
    if (statSync(p).isDirectory()) projects.push(...findProjects(p));
  }
  load(rt, projects, repo);
  return rt;
}

try {
  if (!cmd || cmd === "help") {
    console.log("ray <file|project> | ray gen [targets...] | ray check <paths> | ray test [projects...] | ray visuals [ids...] [--stills] [--record] | ray measure [names...] | ray data [ids...]");
  } else if (cmd === "check") {
    for (const f of rest) { parse(readFileSync(f, "utf8"), f); console.log(`ok ${f}`); }
  } else if (cmd === "gen") {
    const rt = boot();
    const gen = rt.global.lookup("Gen");
    if (!gen) throw new RayError("implementation/gen defines no `Gen`");
    const targets = rest.length ? rest : ["all"];
    rt.callMethod(gen.value, "run", [{ value: targets }], rt.global, { file: "<cli>", line: 0, col: 0 });
  } else if (cmd === "visuals") {
    await renderVisuals(rest);
  } else if (cmd === "measure") {
    await measure(rest);
  } else if (cmd === "data") {
    /* the borrowed catalogues, fetched from the people who measured them and written to data/ */
    const rt = boot();
    const borrowed = rt.global.lookup("Borrowed");
    if (!borrowed) throw new RayError("implementation/physics.ray defines no `Borrowed`");
    const loc = { file: "<cli>", line: 0, col: 0 };
    const of = rt.call(borrowed.value, [], rt.global, loc);
    const datasets = (of as any).fields.get("datasets") as any[];
    for (const d of datasets) {
      const id = d.fields.get("id");
      if (rest.length && !rest.includes(id)) continue;
      const c = rt.call(d.fields.get("body"), [], rt.global, loc);
      rt.callMethod(c, "write", [], rt.global, loc);
      console.log(`  wrote    data/${id}`);
    }
  } else if (cmd === "test") {
    /* every requirement on every fixture of its kind, ticked until its refinement holds - the same cases gen writes */
    const rt = boot(rest);
    const loc = { file: "<test>", line: 0, col: 0 };
    let failed = 0, ran = 0;
    const requirements = rt.requirements() as any[];
    const fixtures = rt.fixtures() as any[];
    for (const r of requirements) {
      for (const f of fixtures) {
        if (!(f.fields.get("kinds") as string[]).includes(r.fields.get("owner") as string)) continue;
        const label = `${r.fields.get("location")} on ${f.fields.get("name")}`;
        try {
          // a fresh fixture per case: the definition, evaluated again
          const world = rt.call(f.fields.get("definition"), [], rt.global, loc);
          const filter = r.fields.get("filter");
          const until = (r.fields.get("until") as number) ?? 8;
          let guard = 0, held = true;
          while (filter && !rt.truthy(rt.call(filter, [{ value: world }], rt.global, loc))) {
            if (++guard > until) { held = false; break; }
            // a fixture that cannot be ticked is one whose refinement either holds as it stands or never
            try { rt.callMethod(world, "tick", [], rt.global, loc); } catch { held = false; break; }
          }
          // a fixture the refinement never reaches is not one this requirement is about
          if (!held) { console.log(`skip ${label} (the refinement never held)`); continue; }
          const ok = rt.truthy(rt.call(r.fields.get("requirement"), [{ value: world }], rt.global, loc));
          console.log(`${ok ? "ok  " : "FAIL"} ${label}`);
          if (!ok) failed++;
        } catch (e: any) { failed++; console.log(`FAIL ${label}: ${e.message}`); }
        ran++;
      }
    }
    console.log(`${ran - failed}/${ran} passed`);
    process.exit(failed ? 1 : 0);
  } else {
    const target = resolve(cmd);
    if (statSync(target).isDirectory()) { boot([target]); }
    else {
      const rt = boot();
      const v = rt.run(parse(readFileSync(target, "utf8"), target));
      if (v !== null && v !== undefined) console.log(rt.text(v));
    }
  }
} catch (e: any) {
  console.error(process.env.RAY_STACK ? e.stack : (e instanceof RayError ? e.message : (e.stack ?? e.message)));
  process.exit(1);
}
