/**
 * THE ARTICLE READING THE REPORT — the part of it a figure needs.
 *
 * A reference to a finding that no longer exists must not quietly become a blank: it
 * is looked up by id here, and what is missing is missing loudly.
 */
import REPORT from "../../../../REPORT.json" with { type: "json" };
import { Entry } from "../lib/Report.ts";

const REPORT_TYPED = REPORT as unknown as { title: string; generated: string; entries: Entry[] };

const notApplicable = (e: { findings: { value: unknown }[] }) =>
  e.findings.length > 0 && e.findings.every(f => f.value === null);


export const entryOf = (id: string) =>
  REPORT_TYPED.entries.find(e => e.id === id)
  ?? REPORT_TYPED.entries.find(e => e.id.startsWith(id) && !notApplicable(e))
  ?? REPORT_TYPED.entries.find(e => e.id.startsWith(id));

export const findingOf = (id: string, name: string) => {
  const e = entryOf(id);
  return e?.findings.find(f => f.name === name);
};
