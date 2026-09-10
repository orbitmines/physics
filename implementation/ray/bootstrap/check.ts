/** parse every .ray file given (or found under the given directories) and report */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { parse } from "./parser.ts";

const files: string[] = [];
const walk = (p: string) => {
  const s = statSync(p);
  if (s.isDirectory()) { for (const f of readdirSync(p)) if (!f.startsWith("node_modules")) walk(join(p, f)); }
  else if (p.endsWith(".ray")) files.push(p);
};
for (const a of process.argv.slice(2)) walk(a);
let bad = 0;
for (const f of files) {
  try {
    const ast = parse(readFileSync(f, "utf8"), f);
    console.log(`ok   ${f} (${ast.statements.length} statements)`);
  } catch (e: any) {
    bad++;
    console.log(`FAIL ${e.message}`);
  }
}
process.exit(bad ? 1 : 0);
