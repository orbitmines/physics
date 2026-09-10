/**
 * Projects: a directory with a `.project.ray`. The language project (first line `` `!language` ``)
 * is loaded first, then every other project's files in path order. No imports: scope is the
 * directory. `+=` is project-scoped in the language; this bootstrap loads everything into one
 * runtime, which is right for one repository built as one.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { Block, Stmt } from "./ast.ts";
import { parse } from "./parser.ts";
import { installNatives, RayError, Runtime } from "./runtime.ts";
import { installEmitter } from "./emit.ts";

export type Project = { root: string; language: boolean; files: string[] };

export function findProjects(dir: string): Project[] {
  const out: Project[] = [];
  const walk = (d: string) => {
    const marker = join(d, ".project.ray");
    if (existsSync(marker)) {
      const text = readFileSync(marker, "utf8");
      out.push({ root: d, language: text.split("\n")[0].includes("!language"), files: rayFiles(d) });
    }
    for (const f of readdirSync(d)) {
      const p = join(d, f);
      if (f === "node_modules" || f.startsWith(".git")) continue;
      if (statSync(p).isDirectory()) walk(p);
    }
  };
  walk(dir);
  return out;
}

function rayFiles(root: string): string[] {
  const out: string[] = [];
  const walk = (d: string) => {
    for (const f of readdirSync(d).sort()) {
      const p = join(d, f);
      if (f === "node_modules" || f === "bootstrap") continue;
      if (statSync(p).isDirectory()) { if (!existsSync(join(p, ".project.ray")) || p === root) walk(p); }
      else if (f.endsWith(".ray") && f !== ".project.ray") out.push(p);
    }
  };
  walk(root);
  return out;
}

/** the files of the language project in the order the definitions need: Program first, then the rest */
const LANGUAGE_ORDER = ["Program.ray", "boolean.ray", "Iterable.ray", "Number.ray", "String.ray", "Random.ray", "Ray.ray", "Language.ray", "Rewrite.ray"];

export function load(runtime: Runtime, projects: Project[], cwd: string) {
  runtime.io = {
    read: (p) => readFileSync(resolve(cwd, p), "utf8"),
    write: (p, text, mkdir) => {
      const full = resolve(cwd, p);
      if (mkdir) mkdirSync(dirname(full), { recursive: true });
      writeFileSync(full, text);
    },
  };
  /*
   * THE LANGUAGE FIRST, THEN EVERYTHING ELSE AS ONE. Projects have no imports and one may extend a
   * class another defines (gen extends what physics.ray declares), so the non-language projects are
   * loaded together: one pool of statements, definitions first, the deferral below across all of them.
   */
  const others = projects.filter(p => !p.language);
  const ordered = [...projects.filter(p => p.language), ...(others.length ? [{ root: others.map(p => p.root).join("+"), language: false, files: others.flatMap(p => p.files) } as Project] : [])];
  for (const project of ordered) {
    const files = project.language
      ? [...LANGUAGE_ORDER.map(n => project.files.find(f => f.endsWith("/" + n))).filter((f): f is string => !!f),
        ...project.files.filter(f => !LANGUAGE_ORDER.some(n => f.endsWith("/" + n)))]
      : project.files;
    /*
     * UNORDERED DEFINITIONS. There are no imports and a file may extend a class another file
     * defines, so a project is loaded as one: every statement of every file, definitions first,
     * extensions and the rest after, and anything naming something not yet there is deferred and
     * tried again once the others have run.
     */
    const pending: { file: string; stmt: Stmt; phase: number }[] = [];
    for (const f of files) {
      if (process.env.RAY_TRACE) console.error(`loading ${f}`);
      const ast: Block = parse(readFileSync(f, "utf8"), f);
      // definitions of classes, enums and functions first; extensions, rules and plain values after
      const declares = (st: Stmt) => st.kind === "method" || (st.kind === "define" && (!st.value || ["class", "enum", "lambda", "path"].includes(st.value.kind)));
      for (const stmt of ast.statements) pending.push({ file: f, stmt, phase: declares(stmt) ? 0 : 1 });
    }
    for (const phase of [0, 1]) {
      let queue = pending.filter(p => p.phase === phase);
      while (queue.length) {
        const deferred: typeof queue = [];
        let lastError: Error | undefined;
        for (const item of queue) {
          try {
            runtime.run({ kind: "program", statements: [item.stmt], loc: item.stmt.loc });
          } catch (e) {
            if (e instanceof RayError && /unknown name|no member|no static member/.test(e.message)) { deferred.push(item); lastError = e; }
            else throw e;
          }
          if (project.language && item.stmt.kind === "define" && (item.stmt as any).names?.includes("Random")) installNatives(runtime);
        }
        if (deferred.length === queue.length) throw lastError;
        queue = deferred;
      }
      if (project.language) installNatives(runtime);
    }
    // `program.as(language)` is the host's: fulfilled once the language project is in, so that a
    // definition of a later project (a test fixture that prints a term) can use it while loading
    if (project.language) installEmitter(runtime);
  }
  runtime.optimizeAll?.();
}
