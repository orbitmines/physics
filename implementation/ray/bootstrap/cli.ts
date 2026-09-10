#!/usr/bin/env -S npx tsx
/**
 * `ray <file-or-project>`   run Ray (the language project is always loaded first)
 * `ray gen`                 run implementation/gen over implementation/physics.ray
 * `ray check <paths>`       parse only
 * `ray test`                run every `dynamically assert` collected from the loaded projects
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "./parser.ts";
import { Env, RayError, Runtime } from "./runtime.ts";
import { findProjects, load } from "./project.ts";
import { renderVisuals } from "./visuals.ts";

const here = dirname(fileURLToPath(import.meta.url));
const implementation = resolve(here, "..", "..");
const repo = resolve(implementation, "..");

const [cmd, ...rest] = process.argv.slice(2);

function boot(extra: string[] = []): Runtime {
  const rt = new Runtime();
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
    console.log("ray <file|project> | ray gen [targets...] | ray check <paths> | ray test [projects...] | ray visuals [ids...]");
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
  } else if (cmd === "test") {
    /* every requirement on every fixture of its kind, ticked until its refinement holds - the same cases gen writes */
    const rt = boot(rest);
    const loc = { file: "<test>", line: 0, col: 0 };
    let failed = 0, ran = 0;
    const requirements = rt.requirements() as any[];
    const fixtures = rt.fixtures() as any[];
    for (const r of requirements) {
      for (const f of fixtures) {
        if (f.fields.get("kind") !== r.fields.get("owner")) continue;
        const label = `${r.fields.get("location")} on ${f.fields.get("name")}`;
        try {
          // a fresh fixture per case: the definition, evaluated again
          const world = rt.call(f.fields.get("definition"), [], rt.global, loc);
          const filter = r.fields.get("filter");
          let guard = 0, held = true;
          while (filter && !rt.truthy(rt.call(filter, [{ value: world }], rt.global, loc))) {
            if (++guard > 8) { held = false; break; }
            rt.callMethod(world, "tick", [], rt.global, loc);
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
