/**
 * THE WORKER'S OWN TYPESCRIPT LOADER.
 *
 * A worker does not inherit the parent's module hooks, and `execArgv: ["--import","tsx"]` is
 * not honoured for a worker's entry point either - both give ERR_UNKNOWN_FILE_EXTENSION on a
 * .ts file. So the worker starts on plain .mjs, registers tsx itself, and only then imports
 * the TypeScript it actually came here to run.
 */
import { register } from "tsx/esm/api";
register();
await import("./Vlasov3.worker.ts");
